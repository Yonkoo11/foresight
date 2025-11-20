/**
 * Contract Verification Script
 * Verifies all deployed contracts are accessible and responding
 *
 * Run with: pnpm exec tsx src/tests/verify-contracts.ts
 */

import { createPublicClient, http, type Address } from 'viem';
import { baseSepolia } from 'viem/chains';
import { getContractAddresses } from '../contracts/addresses.js';

// Import ABIs
import ForesightNFTABI from '../contracts/abis/ForesightNFT.json' assert { type: 'json' };
import CTDraftABI from '../contracts/abis/CTDraft.json' assert { type: 'json' };
import TimecasterArenaABI from '../contracts/abis/TimecasterArena.json' assert { type: 'json' };
import DailyGauntletABI from '../contracts/abis/DailyGauntlet.json' assert { type: 'json' };
import ReputationEngineABI from '../contracts/abis/ReputationEngine.json' assert { type: 'json' };
import TreasuryABI from '../contracts/abis/Treasury.json' assert { type: 'json' };

const TEST_ADDRESS = '0x414A1F683feB519C4F24EbAbF782FF71A75C7BC0' as Address;

async function main() {
  console.log('🔍 Starting Contract Verification...\n');

  // Create public client
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  });

  // Get contract addresses
  const addresses = getContractAddresses(84532);

  console.log('📋 Contract Addresses:');
  console.log('  ForesightNFT:', addresses.foresightNFT);
  console.log('  CTDraft:', addresses.ctDraft);
  console.log('  TimecasterArena:', addresses.timecasterArena);
  console.log('  DailyGauntlet:', addresses.dailyGauntlet);
  console.log('  ReputationEngine:', addresses.reputationEngine);
  console.log('  Treasury:', addresses.treasury);
  console.log('');

  let passedTests = 0;
  let failedTests = 0;

  // Test ForesightNFT (Reputation Display NFT)
  console.log('🔮 Testing ForesightNFT Contract...');
  try {
    const repEngineAddr = await publicClient.readContract({
      address: addresses.foresightNFT,
      abi: ForesightNFTABI,
      functionName: 'reputationEngine',
    });
    console.log('  ✅ Reputation Engine:', repEngineAddr);
    passedTests++;

    const balance = await publicClient.readContract({
      address: addresses.foresightNFT,
      abi: ForesightNFTABI,
      functionName: 'balanceOf',
      args: [TEST_ADDRESS],
    });
    console.log('  ✅ Test Address NFT Balance:', balance.toString());
    passedTests++;

    if (balance > 0n) {
      const tokenId = await publicClient.readContract({
        address: addresses.foresightNFT,
        abi: ForesightNFTABI,
        functionName: 'ownerToTokenId',
        args: [TEST_ADDRESS],
      });
      console.log('  ✅ User Token ID:', tokenId.toString());
      passedTests++;
    }
  } catch (error: any) {
    console.error('  ❌ ForesightNFT Error:', error.message);
    failedTests++;
  }
  console.log('');

  // Test CTDraft
  console.log('📝 Testing CTDraft Contract...');
  try {
    const teamSize = await publicClient.readContract({
      address: addresses.ctDraft,
      abi: CTDraftABI,
      functionName: 'TEAM_SIZE',
    });
    console.log('  ✅ TEAM_SIZE:', teamSize.toString());
    passedTests++;

    const maxInfluencerId = await publicClient.readContract({
      address: addresses.ctDraft,
      abi: CTDraftABI,
      functionName: 'MAX_INFLUENCER_ID',
    });
    console.log('  ✅ MAX_INFLUENCER_ID:', maxInfluencerId.toString());
    passedTests++;

    const playerCount = await publicClient.readContract({
      address: addresses.ctDraft,
      abi: CTDraftABI,
      functionName: 'getPlayerCount',
    });
    console.log('  ✅ Total Players:', playerCount.toString());
    passedTests++;

    const hasTeam = await publicClient.readContract({
      address: addresses.ctDraft,
      abi: CTDraftABI,
      functionName: 'hasTeam',
      args: [TEST_ADDRESS],
    });
    console.log('  ✅ Test Address Has Team:', hasTeam);
    passedTests++;
  } catch (error: any) {
    console.error('  ❌ CTDraft Error:', error.message);
    failedTests++;
  }
  console.log('');

  // Test TimecasterArena
  console.log('⚔️  Testing TimecasterArena Contract...');
  try {
    const acceptDeadline = await publicClient.readContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'ACCEPT_DEADLINE',
    });
    console.log('  ✅ ACCEPT_DEADLINE:', acceptDeadline.toString(), 'seconds');
    passedTests++;

    const minVotes = await publicClient.readContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'MIN_VOTES',
    });
    console.log('  ✅ MIN_VOTES:', minVotes.toString());
    passedTests++;

    const oracle = await publicClient.readContract({
      address: addresses.timecasterArena,
      abi: TimecasterArenaABI,
      functionName: 'oracle',
    });
    console.log('  ✅ Oracle Address:', oracle);
    passedTests++;
  } catch (error: any) {
    console.error('  ❌ TimecasterArena Error:', error.message);
    failedTests++;
  }
  console.log('');

  // Test DailyGauntlet
  console.log('🏆 Testing DailyGauntlet Contract...');
  try {
    const minStake = await publicClient.readContract({
      address: addresses.dailyGauntlet,
      abi: DailyGauntletABI,
      functionName: 'MIN_STAKE',
    });
    console.log('  ✅ MIN_STAKE:', minStake.toString(), 'wei');
    passedTests++;

    const predictionsPerGauntlet = await publicClient.readContract({
      address: addresses.dailyGauntlet,
      abi: DailyGauntletABI,
      functionName: 'PREDICTIONS_PER_GAUNTLET',
    });
    console.log('  ✅ PREDICTIONS_PER_GAUNTLET:', predictionsPerGauntlet.toString());
    passedTests++;

    const currentDay = await publicClient.readContract({
      address: addresses.dailyGauntlet,
      abi: DailyGauntletABI,
      functionName: 'currentDay',
    });
    console.log('  ✅ Current Day:', currentDay.toString());
    passedTests++;

    const reputationEngine = await publicClient.readContract({
      address: addresses.dailyGauntlet,
      abi: DailyGauntletABI,
      functionName: 'reputationEngine',
    });
    console.log('  ✅ Reputation Engine:', reputationEngine);
    passedTests++;
  } catch (error: any) {
    console.error('  ❌ DailyGauntlet Error:', error.message);
    failedTests++;
  }
  console.log('');

  // Test ReputationEngine
  console.log('⭐ Testing ReputationEngine Contract...');
  try {
    const reputation = await publicClient.readContract({
      address: addresses.reputationEngine,
      abi: ReputationEngineABI,
      functionName: 'getReputation',
      args: [TEST_ADDRESS],
    });
    console.log('  ✅ User Reputation:', reputation);
    passedTests++;

    const ctDraftAddr = await publicClient.readContract({
      address: addresses.reputationEngine,
      abi: ReputationEngineABI,
      functionName: 'ctDraft',
    });
    console.log('  ✅ CT Draft Contract:', ctDraftAddr);
    passedTests++;

    const gauntletAddr = await publicClient.readContract({
      address: addresses.reputationEngine,
      abi: ReputationEngineABI,
      functionName: 'dailyGauntlet',
    });
    console.log('  ✅ Daily Gauntlet Contract:', gauntletAddr);
    passedTests++;
  } catch (error: any) {
    console.error('  ❌ ReputationEngine Error:', error.message);
    failedTests++;
  }
  console.log('');

  // Test Treasury
  console.log('💰 Testing Treasury Contract...');
  try {
    const balance = await publicClient.getBalance({
      address: addresses.treasury,
    });
    console.log('  ✅ Treasury Balance:', balance.toString(), 'wei');
    passedTests++;

    const arenaChampionBps = await publicClient.readContract({
      address: addresses.treasury,
      abi: TreasuryABI,
      functionName: 'ARENA_CHAMPION_BPS',
    });
    console.log('  ✅ ARENA_CHAMPION_BPS:', arenaChampionBps.toString());
    passedTests++;

    const gauntletChampionsBps = await publicClient.readContract({
      address: addresses.treasury,
      abi: TreasuryABI,
      functionName: 'GAUNTLET_CHAMPIONS_BPS',
    });
    console.log('  ✅ GAUNTLET_CHAMPIONS_BPS:', gauntletChampionsBps.toString());
    passedTests++;

    const currentMonthFees = await publicClient.readContract({
      address: addresses.treasury,
      abi: TreasuryABI,
      functionName: 'currentMonthFees',
    });
    console.log('  ✅ Current Month Fees:', currentMonthFees.toString(), 'wei');
    passedTests++;
  } catch (error: any) {
    console.error('  ❌ Treasury Error:', error.message);
    failedTests++;
  }
  console.log('');

  // Summary
  console.log('📊 Test Summary:');
  console.log(`  ✅ Passed: ${passedTests}`);
  console.log(`  ❌ Failed: ${failedTests}`);
  console.log(`  Total: ${passedTests + failedTests}`);
  console.log('');

  if (failedTests === 0) {
    console.log('✨ All contract integrations verified successfully!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Please review the errors above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('💥 Fatal Error:', error);
  process.exit(1);
});
