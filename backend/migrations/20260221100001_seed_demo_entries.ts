/**
 * Seed Demo Contest Entries
 *
 * Creates 15 demo users with team entries for the Hackathon Demo League (contest #6).
 * Each has realistic scores and varied teams to make the leaderboard look alive.
 */
import { Knex } from 'knex';
import { randomUUID } from 'crypto';

// Demo user data — realistic CT-style usernames
const DEMO_USERS = [
  { username: 'SolanaWhale', wallet: '0x1111111111111111111111111111111111111111' },
  { username: 'DeFi_Degen', wallet: '0x2222222222222222222222222222222222222222' },
  { username: 'AlphaHunter', wallet: '0x3333333333333333333333333333333333333333' },
  { username: 'CT_Maxi', wallet: '0x4444444444444444444444444444444444444444' },
  { username: 'GigaBrain', wallet: '0x5555555555555555555555555555555555555555' },
  { username: 'NFT_Flipper', wallet: '0x6666666666666666666666666666666666666666' },
  { username: 'OnChainAnon', wallet: '0x7777777777777777777777777777777777777777' },
  { username: 'MevBot_Chad', wallet: '0x8888888888888888888888888888888888888888' },
  { username: 'YieldFarmer', wallet: '0x9999999999999999999999999999999999999999' },
  { username: 'Ser_Ngmi', wallet: '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
  { username: 'ApeDegen', wallet: '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' },
  { username: 'ChartMaster', wallet: '0xcccccccccccccccccccccccccccccccccccccccc' },
  { username: 'DiamondHand', wallet: '0xdddddddddddddddddddddddddddddddddddddd' },
  { username: 'RektProof', wallet: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' },
  { username: 'TokenSniper', wallet: '0xffffffffffffffffffffffffffffffffffff0001' },
];

// Pre-generated team compositions (5 influencers each, valid budget)
// Each team: [captain, pick2, pick3, pick4, pick5]
const TEAM_COMPOSITIONS = [
  { team: [1, 13, 22, 35, 48], captain: 1 },   // S + A + B + B + C = 48+29+27+22+17 = 143
  { team: [2, 18, 26, 40, 49], captain: 2 },   // S + A + B + C + C = 46+35+25+22+16 = 144
  { team: [5, 11, 28, 43, 47], captain: 5 },   // S + A + B + C + C = 45+30+25+20+18 = 138
  { team: [7, 3, 30, 45, 49], captain: 3 },    // S + A + B + C + C = 38+36+24+19+16 = 133
  { team: [1, 15, 23, 37, 42], captain: 1 },   // S + A + B + B + C = 48+28+27+22+21 = 146
  { team: [2, 4, 31, 46, 48], captain: 4 },    // S + A + B + C + C = 46+35+24+19+17 = 141
  { team: [5, 6, 29, 41, 44], captain: 6 },    // S + A + B + C + C = 45+34+24+21+20 = 144
  { team: [7, 10, 25, 38, 43], captain: 10 },  // S + A + B + B + C = 38+31+26+22+20 = 137
  { team: [1, 12, 32, 39, 49], captain: 12 },  // S + A + B + B + C = 48+30+23+22+16 = 139
  { team: [2, 9, 24, 44, 47], captain: 9 },    // S + A + B + C + C = 46+32+26+20+18 = 142
  { team: [5, 16, 21, 36, 45], captain: 16 },  // S + A + B + B + C = 45+28+28+22+19 = 142
  { team: [7, 17, 27, 40, 46], captain: 17 },  // S + A + B + C + C = 38+28+25+22+19 = 132
  { team: [1, 14, 33, 41, 48], captain: 14 },  // S + A + B + C + C = 48+29+23+21+17 = 138
  { team: [2, 20, 34, 42, 49], captain: 20 },  // S + A + B + C + C = 46+32+23+21+16 = 138
  { team: [5, 8, 22, 43, 45], captain: 8 },    // S + A + B + C + C = 45+33+27+20+19 = 144
];

// Realistic scores — varied to create an interesting leaderboard
const SCORES = [
  { total: 127, activity: 30, engagement: 48, growth: 32, viral: 17 },
  { total: 119, activity: 28, engagement: 45, growth: 28, viral: 18 },
  { total: 112, activity: 25, engagement: 42, growth: 30, viral: 15 },
  { total: 108, activity: 32, engagement: 38, growth: 24, viral: 14 },
  { total: 103, activity: 22, engagement: 40, growth: 26, viral: 15 },
  { total: 98, activity: 20, engagement: 35, growth: 28, viral: 15 },
  { total: 94, activity: 18, engagement: 38, growth: 25, viral: 13 },
  { total: 89, activity: 24, engagement: 32, growth: 22, viral: 11 },
  { total: 85, activity: 16, engagement: 35, growth: 20, viral: 14 },
  { total: 79, activity: 15, engagement: 30, growth: 22, viral: 12 },
  { total: 73, activity: 14, engagement: 28, growth: 20, viral: 11 },
  { total: 68, activity: 12, engagement: 25, growth: 21, viral: 10 },
  { total: 62, activity: 10, engagement: 22, growth: 20, viral: 10 },
  { total: 55, activity: 8, engagement: 20, growth: 18, viral: 9 },
  { total: 48, activity: 6, engagement: 18, growth: 16, viral: 8 },
];

export async function up(knex: Knex): Promise<void> {
  // Find the demo contest
  const contest = await knex('prized_contests')
    .where('name', 'Hackathon Demo League')
    .first();

  if (!contest) {
    console.log('Demo contest not found, skipping entry seeding');
    return;
  }

  const now = new Date();

  for (let i = 0; i < DEMO_USERS.length; i++) {
    const user = DEMO_USERS[i];
    const team = TEAM_COMPOSITIONS[i];
    const score = SCORES[i];

    // Create user
    const userId = randomUUID();
    await knex('users').insert({
      id: userId,
      wallet_address: user.wallet,
      username: user.username,
      created_at: now,
      last_seen_at: now,
    });

    // Create free league entry
    await knex('free_league_entries').insert({
      contest_id: contest.id,
      user_id: userId,
      wallet_address: user.wallet,
      team_ids: team.team,
      captain_id: team.captain,
      score: score.total,
      score_breakdown: JSON.stringify({
        activity: score.activity,
        engagement: score.engagement,
        growth: score.growth,
        viral: score.viral,
      }),
      rank: i + 1,
      created_at: new Date(now.getTime() - (DEMO_USERS.length - i) * 3600000), // Stagger entry times
      updated_at: now,
    });
  }

  // Update contest player count
  await knex('prized_contests')
    .where('id', contest.id)
    .update({
      player_count: DEMO_USERS.length,
      updated_at: now,
    });
}

export async function down(knex: Knex): Promise<void> {
  const wallets = DEMO_USERS.map(u => u.wallet);

  // Remove entries
  await knex('free_league_entries')
    .whereIn('wallet_address', wallets)
    .del();

  // Remove users
  await knex('users')
    .whereIn('wallet_address', wallets)
    .del();

  // Reset contest player count
  const contest = await knex('prized_contests')
    .where('name', 'Hackathon Demo League')
    .first();

  if (contest) {
    await knex('prized_contests')
      .where('id', contest.id)
      .update({ player_count: 0, updated_at: new Date() });
  }
}
