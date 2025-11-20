import { ethers } from 'ethers';
import axios from 'axios';
import db from '../utils/db';

/**
 * Oracle Keeper Service
 * Resolves Arena duels and Gauntlet predictions
 */

// Blockchain setup
const PROVIDER_URL = process.env.BASE_RPC_URL || 'https://mainnet.base.org';
const KEEPER_PRIVATE_KEY = process.env.KEEPER_PRIVATE_KEY || '';

const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
const keeper = KEEPER_PRIVATE_KEY
  ? new ethers.Wallet(KEEPER_PRIVATE_KEY, provider)
  : null;

// Contract ABIs (simplified for key functions)
const ARENA_ABI = [
  'function resolveDuel(uint256 duelId, bool creatorWon) external',
];

const GAUNTLET_ABI = [
  'function resolvePrediction(uint256 predictionId, bool outcome) external',
  'function resolveGauntlet(uint256 day) external',
];

/**
 * Fetch price from oracle (using CoinGecko as example)
 */
async function fetchPrice(symbol: string): Promise<number | null> {
  try {
    const coinGeckoIds: Record<string, string> = {
      'ETH': 'ethereum',
      'BTC': 'bitcoin',
      'SOL': 'solana',
      'MATIC': 'matic-network',
    };

    const coinId = coinGeckoIds[symbol];
    if (!coinId) {
      console.error(`Unknown symbol: ${symbol}`);
      return null;
    }

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
    );

    return response.data[coinId]?.usd || null;
  } catch (error) {
    console.error(`Failed to fetch price for ${symbol}:`, error);
    return null;
  }
}

/**
 * Fetch on-chain data for PROTOCOL duels
 */
async function fetchProtocolData(metric: string): Promise<number | null> {
  // In production, fetch from DeFiLlama, on-chain contracts, etc.
  // For now, return mock data
  console.log(`Fetching ${metric}...`);

  const mockData: Record<string, number> = {
    'BASE_TVL': 1500000000, // $1.5B
    'ETH_STAKED': 32000000, // 32M ETH
  };

  return mockData[metric] || null;
}

/**
 * Resolve a PRICE duel
 */
async function resolvePriceDuel(duel: any): Promise<void> {
  console.log(`Resolving PRICE duel ${duel.id}...`);

  // Parse oracle key (e.g., "ETH/USD")
  const [symbol] = duel.oracle_key.split('/');

  // Fetch current price
  const currentPrice = await fetchPrice(symbol);

  if (currentPrice === null) {
    console.error(`Failed to get price for ${symbol}`);
    return;
  }

  console.log(`Current ${symbol} price: $${currentPrice}`);
  console.log(`Target price: $${duel.target_price / 100000000}`); // Convert from 8 decimals

  // Determine winner based on creator's position
  const targetPriceUSD = duel.target_price / 100000000;
  let creatorWon: boolean;

  if (duel.creator_position === 'YES') {
    // Creator says price will hit target
    creatorWon = currentPrice >= targetPriceUSD;
  } else {
    // Creator says price won't hit target
    creatorWon = currentPrice < targetPriceUSD;
  }

  console.log(`Winner: ${creatorWon ? 'Creator' : 'Opponent'}`);

  // Call contract
  if (!keeper) {
    console.error('Keeper wallet not configured');
    return;
  }

  const arenaContract = new ethers.Contract(
    process.env.TIMECASTER_ARENA_ADDRESS || '',
    ARENA_ABI,
    keeper
  );

  try {
    const tx = await arenaContract.resolveDuel(duel.chain_duel_id, creatorWon);
    console.log(`Transaction sent: ${tx.hash}`);

    await tx.wait();
    console.log('✅ Duel resolved on-chain');

    // Update database
    await db('arena_duels')
      .where({ id: duel.id })
      .update({
        resolved: true,
        status: 'RESOLVED',
        winner_id: creatorWon ? duel.creator_id : duel.opponent_id,
        tx_hash: tx.hash,
      });
  } catch (error) {
    console.error('Failed to resolve duel on-chain:', error);
  }
}

/**
 * Resolve a PROTOCOL duel
 */
async function resolveProtocolDuel(duel: any): Promise<void> {
  console.log(`Resolving PROTOCOL duel ${duel.id}...`);

  // Fetch protocol data
  const currentValue = await fetchProtocolData(duel.protocol_metric);

  if (currentValue === null) {
    console.error(`Failed to get data for ${duel.protocol_metric}`);
    return;
  }

  console.log(`Current ${duel.protocol_metric}: ${currentValue}`);
  console.log(`Target value: ${duel.target_value}`);

  // Determine winner
  let creatorWon: boolean;

  if (duel.creator_position === 'YES') {
    creatorWon = currentValue >= duel.target_value;
  } else {
    creatorWon = currentValue < duel.target_value;
  }

  console.log(`Winner: ${creatorWon ? 'Creator' : 'Opponent'}`);

  // Call contract
  if (!keeper) {
    console.error('Keeper wallet not configured');
    return;
  }

  const arenaContract = new ethers.Contract(
    process.env.TIMECASTER_ARENA_ADDRESS || '',
    ARENA_ABI,
    keeper
  );

  try {
    const tx = await arenaContract.resolveDuel(duel.chain_duel_id, creatorWon);
    console.log(`Transaction sent: ${tx.hash}`);

    await tx.wait();
    console.log('✅ Duel resolved on-chain');

    // Update database
    await db('arena_duels')
      .where({ id: duel.id })
      .update({
        resolved: true,
        status: 'RESOLVED',
        winner_id: creatorWon ? duel.creator_id : duel.opponent_id,
        tx_hash: tx.hash,
      });
  } catch (error) {
    console.error('Failed to resolve duel on-chain:', error);
  }
}

/**
 * Check and resolve Arena duels
 */
export async function resolveArenaDuels(): Promise<void> {
  console.log('========================================');
  console.log('Checking Arena Duels for Resolution');
  console.log('========================================');

  try {
    // Get duels ready for resolution
    const duels = await db('arena_duels')
      .where({ status: 'ACTIVE', resolved: false })
      .where('resolution_time', '<=', db.fn.now())
      .whereIn('duel_type', ['PRICE', 'PROTOCOL']);

    if (duels.length === 0) {
      console.log('No duels ready for resolution');
      return;
    }

    console.log(`Found ${duels.length} duels ready for resolution\n`);

    for (const duel of duels) {
      if (duel.duel_type === 'PRICE') {
        await resolvePriceDuel(duel);
      } else if (duel.duel_type === 'PROTOCOL') {
        await resolveProtocolDuel(duel);
      }

      // Wait a bit between transactions to avoid nonce issues
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    console.log('\n========================================');
    console.log('✅ Arena Duels Resolution Complete');
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Failed to resolve arena duels:', error);
  }
}

/**
 * Resolve a Gauntlet prediction
 */
async function resolveGauntletPrediction(prediction: any): Promise<void> {
  console.log(`Resolving prediction ${prediction.id}: ${prediction.question}`);

  // Parse oracle key to determine how to resolve
  const oracleKey = prediction.oracle_key;

  let outcome: boolean;

  // Simple logic - in production, parse oracle_key and fetch appropriate data
  if (oracleKey.includes('PRICE')) {
    // Fetch price and determine outcome
    const [, symbol] = oracleKey.split('_');
    const price = await fetchPrice(symbol);
    outcome = price !== null && price > 2000; // Mock logic
  } else {
    // Random for demo - in production, fetch real data
    outcome = Math.random() > 0.5;
  }

  console.log(`Outcome: ${outcome ? 'YES' : 'NO'}`);

  // Call contract
  if (!keeper) {
    console.error('Keeper wallet not configured');
    return;
  }

  const gauntletContract = new ethers.Contract(
    process.env.DAILY_GAUNTLET_ADDRESS || '',
    GAUNTLET_ABI,
    keeper
  );

  try {
    const tx = await gauntletContract.resolvePrediction(
      prediction.chain_prediction_id,
      outcome
    );
    console.log(`Transaction sent: ${tx.hash}`);

    await tx.wait();
    console.log('✅ Prediction resolved on-chain');

    // Update database
    await db('gauntlet_predictions')
      .where({ id: prediction.id })
      .update({
        resolved: true,
        outcome,
        resolved_at: db.fn.now(),
      });
  } catch (error) {
    console.error('Failed to resolve prediction on-chain:', error);
  }
}

/**
 * Check and resolve Gauntlet predictions
 */
export async function resolveGauntletPredictions(): Promise<void> {
  console.log('========================================');
  console.log('Checking Gauntlet Predictions for Resolution');
  console.log('========================================');

  try {
    // Get predictions ready for resolution
    const predictions = await db('gauntlet_predictions')
      .where({ resolved: false })
      .where('resolution_time', '<=', db.fn.now());

    if (predictions.length === 0) {
      console.log('No predictions ready for resolution');
      return;
    }

    console.log(`Found ${predictions.length} predictions ready for resolution\n`);

    for (const prediction of predictions) {
      await resolveGauntletPrediction(prediction);

      // Wait between transactions
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    // Check if any gauntlets are fully resolved
    await resolveCompletedGauntlets();

    console.log('\n========================================');
    console.log('✅ Gauntlet Predictions Resolution Complete');
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Failed to resolve gauntlet predictions:', error);
  }
}

/**
 * Resolve gauntlets where all predictions are resolved
 */
async function resolveCompletedGauntlets(): Promise<void> {
  // Get active gauntlets
  const gauntlets = await db('gauntlet_days')
    .where({ active: true, resolved: false });

  for (const gauntlet of gauntlets) {
    // Check if all predictions are resolved
    const predictions = await db('gauntlet_predictions')
      .where({ gauntlet_day_id: gauntlet.id });

    const allResolved = predictions.every((p: any) => p.resolved);

    if (!allResolved) continue;

    console.log(`\nAll predictions resolved for gauntlet day ${gauntlet.chain_day_id}`);

    // Call contract to resolve gauntlet
    if (!keeper) continue;

    const gauntletContract = new ethers.Contract(
      process.env.DAILY_GAUNTLET_ADDRESS || '',
      GAUNTLET_ABI,
      keeper
    );

    try {
      const tx = await gauntletContract.resolveGauntlet(gauntlet.chain_day_id);
      console.log(`Transaction sent: ${tx.hash}`);

      await tx.wait();
      console.log('✅ Gauntlet resolved on-chain');

      // Update database
      await db('gauntlet_days')
        .where({ id: gauntlet.id })
        .update({
          resolved: true,
          active: false,
          resolved_at: db.fn.now(),
        });
    } catch (error) {
      console.error('Failed to resolve gauntlet on-chain:', error);
    }
  }
}

/**
 * Start oracle keeper with interval
 */
export function startOracleKeeper(): void {
  console.log('🔮 Oracle Keeper initialized');
  console.log('Checking for resolutions every 5 minutes\n');

  // Run every 5 minutes
  const INTERVAL = 5 * 60 * 1000;

  // Run immediately
  resolveArenaDuels();
  resolveGauntletPredictions();

  // Run on interval
  setInterval(() => {
    resolveArenaDuels();
    resolveGauntletPredictions();
  }, INTERVAL);
}
