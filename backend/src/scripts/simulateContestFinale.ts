/**
 * simulateContestFinale.ts
 *
 * Full E2E test: seeds fake opponents into a contest, runs finalization,
 * and assigns real prize amounts so you can test the claim flow in the UI.
 *
 * Usage:
 *   NODE_OPTIONS='--import tsx' npx tsx src/scripts/simulateContestFinale.ts <contestId> [yourWallet] [yourRank]
 *
 * Examples:
 *   # Contest 8, you win 1st place:
 *   NODE_OPTIONS='--import tsx' npx tsx src/scripts/simulateContestFinale.ts 8 0xYourWallet 1
 *
 *   # Contest 8, you finish 3rd out of 12:
 *   NODE_OPTIONS='--import tsx' npx tsx src/scripts/simulateContestFinale.ts 8 0xYourWallet 3
 *
 *   # Reset the contest back to open (undo):
 *   NODE_OPTIONS='--import tsx' npx tsx src/scripts/simulateContestFinale.ts 8 --reset
 */

import db from '../utils/db';

const FAKE_WALLETS = [
  '0xfake0000000000000000000000000000000000a1',
  '0xfake0000000000000000000000000000000000a2',
  '0xfake0000000000000000000000000000000000a3',
  '0xfake0000000000000000000000000000000000a4',
  '0xfake0000000000000000000000000000000000a5',
  '0xfake0000000000000000000000000000000000a6',
  '0xfake0000000000000000000000000000000000a7',
  '0xfake0000000000000000000000000000000000a8',
  '0xfake0000000000000000000000000000000000a9',
  '0xfake000000000000000000000000000000000aa0',
  '0xfake000000000000000000000000000000000ab1',
  '0xfake000000000000000000000000000000000ac2',
];

async function reset(contestId: number) {
  const contest = await db('prized_contests').where('id', contestId).first();
  if (!contest) { console.error('Contest not found'); process.exit(1); }

  const entriesTable = contest.is_free ? 'free_league_entries' : 'prized_entries';

  // Delete all fake entries
  await db(entriesTable)
    .where('contest_id', contestId)
    .whereIn('wallet_address', FAKE_WALLETS);

  await db(entriesTable)
    .where('contest_id', contestId)
    .whereIn('wallet_address', FAKE_WALLETS)
    .delete();

  // Reset contest to open
  await db('prized_contests').where('id', contestId).update({
    status: 'open',
    player_count: db.raw(`(SELECT COUNT(*) FROM ${entriesTable} WHERE contest_id = ?)`, [contestId]),
    updated_at: new Date(),
  });

  // Clear ranks/prizes from real entries
  const prizeCol = contest.is_free ? 'prize_won' : 'prize_amount';
  await db(entriesTable).where('contest_id', contestId).update({
    rank: null,
    score: null,
    [prizeCol]: null,
    claimed: false,
    claim_tx_hash: null,
    updated_at: new Date(),
  });

  console.log(`✅ Contest ${contestId} reset to open`);
  await db.destroy();
}

async function simulate(contestId: number, yourWallet: string, yourRank: number) {
  const contest = await db('prized_contests')
    .leftJoin('contest_types', 'prized_contests.contest_type_id', 'contest_types.id')
    .select('prized_contests.*', 'contest_types.code as type_code', 'contest_types.has_captain', 'contest_types.team_size')
    .where('prized_contests.id', contestId)
    .first();

  if (!contest) { console.error(`Contest ${contestId} not found`); process.exit(1); }

  console.log(`\n🏆 Contest: "${contest.name}" (${contest.status})`);
  console.log(`   Prize pool: ${contest.prize_pool || contest.distributable_pool} SOL`);
  console.log(`   Is free: ${contest.is_free}\n`);

  const entriesTable = contest.is_free ? 'free_league_entries' : 'prized_entries';
  const prizeCol = contest.is_free ? 'prize_won' : 'prize_amount';
  const teamSize = contest.team_size || 5;

  // Get available influencers to fill fake teams
  const influencers = await db('influencers').select('id', 'tier').limit(100);
  const byTier = (t: string) => influencers.filter(i => i.tier === t);

  function pickTeam(): number[] {
    const s = byTier('S'); const a = byTier('A'); const b = byTier('B'); const c = byTier('C');
    const pool = [...s, ...a, ...b, ...c];
    const shuffled = pool.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, teamSize).map(i => i.id);
  }

  // Check if user has an entry
  const userEntry = await db(entriesTable)
    .where('contest_id', contestId)
    .where('wallet_address', yourWallet.toLowerCase())
    .first();

  if (!userEntry) {
    console.log(`⚠️  No entry found for wallet ${yourWallet} in contest ${contestId}`);
    console.log(`   Enter a team via the UI first, then re-run this script.\n`);
    process.exit(1);
  }

  console.log(`✅ Found your entry (id: ${userEntry.id})`);

  // Remove any existing fake entries first (idempotent)
  await db(entriesTable).where('contest_id', contestId).whereIn('wallet_address', FAKE_WALLETS).delete();

  // Build 11 fake opponents
  const TOTAL_PLAYERS = 12;
  const opponents = FAKE_WALLETS.slice(0, TOTAL_PLAYERS - 1);

  console.log(`\n📥 Seeding ${opponents.length} fake opponents...`);

  // Generate scores: distribute so yourRank is achievable
  // Score range: 50 – 500 pts
  // If you want rank 1: your score > all others
  // We'll generate scores, then sort them, and insert yours at yourRank position

  const fakeScores = opponents.map(() => Math.floor(Math.random() * 350) + 50);
  fakeScores.sort((a, b) => b - a); // descending

  // Insert fake entries
  for (let i = 0; i < opponents.length; i++) {
    await db(entriesTable).insert({
      contest_id: contestId,
      user_id: null,
      wallet_address: opponents[i],
      team_ids: pickTeam(),
      captain_id: null,
      score: fakeScores[i],
      created_at: new Date(),
      updated_at: new Date(),
    }).onConflict(['contest_id', 'wallet_address']).merge();
  }

  // Update contest player count
  const totalCount = TOTAL_PLAYERS;
  await db('prized_contests').where('id', contestId).update({
    player_count: totalCount,
    updated_at: new Date(),
  });

  // ─── Finalization ────────────────────────────────────────────────────────────

  console.log(`\n🏁 Running finalization for ${totalCount} players (you want rank ${yourRank})...`);

  // Get all entries sorted by score desc
  const allEntries = await db(entriesTable)
    .where('contest_id', contestId)
    .orderByRaw('score DESC NULLS LAST, created_at ASC');

  // Find where to insert the user's score
  // Score needed to land at yourRank
  let yourScore: number;
  if (yourRank === 1) {
    yourScore = fakeScores[0] + 50; // Beat everyone
  } else if (yourRank >= totalCount) {
    yourScore = Math.max(0, fakeScores[fakeScores.length - 1] - 50); // Come last
  } else {
    // Land between rank-1 and rank fake scores
    const above = fakeScores[yourRank - 2]; // score of entry above you
    const below = fakeScores[yourRank - 1]; // score of entry that should be below you
    yourScore = Math.floor((above + below) / 2);
  }

  // Update user's score
  await db(entriesTable).where('id', userEntry.id).update({
    score: yourScore,
    updated_at: new Date(),
  });

  console.log(`   Your score: ${yourScore} pts`);

  // Re-fetch all entries sorted
  const ranked = await db(entriesTable)
    .where('contest_id', contestId)
    .orderByRaw('score DESC NULLS LAST');

  // Assign ranks
  for (let i = 0; i < ranked.length; i++) {
    await db(entriesTable).where('id', ranked[i].id).update({ rank: i + 1, updated_at: new Date() });
  }

  // Get prize distribution rules
  const prizePool = parseFloat(contest.distributable_pool || contest.prize_pool || '0');
  const prizeRules = await db('prize_distribution_rules')
    .where('min_players', '<=', totalCount)
    .where(function () {
      this.where('max_players', '>=', totalCount).orWhere('max_players', 0);
    })
    .where('rank', '>', 0)
    .orderBy('rank', 'asc');

  console.log(`\n💰 Prize pool: ${prizePool} SOL | Rules: ${prizeRules.length} prize positions`);

  // Assign prizes
  for (const rule of prizeRules) {
    const entry = ranked[rule.rank - 1];
    if (!entry) continue;
    const amount = (prizePool * parseFloat(rule.percentage)) / 100;
    await db(entriesTable).where('id', entry.id).update({
      [prizeCol]: amount.toFixed(8),
      updated_at: new Date(),
    });
    const isYou = entry.wallet_address.toLowerCase() === yourWallet.toLowerCase();
    console.log(`   Rank ${rule.rank} (${rule.label}): ${amount.toFixed(4)} SOL${isYou ? ' ← YOU' : ''}`);
  }

  // Finalize the contest
  await db('prized_contests').where('id', contestId).update({
    status: 'finalized',
    winners_count: prizeRules.length,
    updated_at: new Date(),
  });

  // Summary
  const yourFinalEntry = await db(entriesTable).where('id', userEntry.id).first();
  const yourPrize = parseFloat(yourFinalEntry[prizeCol] || 0);

  console.log(`\n✅ Contest finalized!`);
  console.log(`   Your rank: #${yourFinalEntry.rank} of ${totalCount}`);
  console.log(`   Your score: ${yourFinalEntry.score} pts`);
  if (yourPrize > 0) {
    console.log(`   Your prize: ${yourPrize.toFixed(4)} SOL 🎉`);
    console.log(`\n👉 Now go to the contest page in the UI → "My Team" tab → click "Claim ${yourPrize.toFixed(3)} SOL"`);
  } else {
    console.log(`   No prize (rank outside payout zone)`);
    console.log(`\n👉 Refresh the contest page to see the final leaderboard`);
  }

  await db.destroy();
}

// ─── Main ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const contestId = parseInt(args[0]);

if (!contestId || isNaN(contestId)) {
  console.error('Usage: simulateContestFinale.ts <contestId> [yourWallet] [yourRank]');
  console.error('       simulateContestFinale.ts <contestId> --reset');
  process.exit(1);
}

if (args[1] === '--reset') {
  reset(contestId);
} else {
  const yourWallet = args[1] || '';
  const yourRank = parseInt(args[2] || '1');

  if (!yourWallet) {
    console.error('Error: provide your wallet address as the 2nd argument');
    process.exit(1);
  }

  simulate(contestId, yourWallet, yourRank);
}
