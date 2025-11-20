import type { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex('quests').del();

  // Insert quest definitions
  await knex('quests').insert([
    // ========================================
    // TIER 1: BEGINNER QUESTS (Points Only)
    // ========================================
    {
      quest_id: 'daily_login',
      name: 'Daily Check-In',
      description: 'Log in to the platform',
      type: 'daily',
      category: 'engagement',
      points_reward: 10,
      eth_reward_wei: '0',
      eth_reward_enabled: false,
      requirements: JSON.stringify({ type: 'login', value: 1 }),
      min_reputation: 0,
      min_account_age_days: 0,
      max_completions_per_user: null,
      max_completions_per_day: 1,
      cooldown_hours: 24,
      is_active: true,
      priority: 1,
    },
    {
      quest_id: 'first_game',
      name: 'First Steps',
      description: 'Play your first game in any mode',
      type: 'one_time',
      category: 'engagement',
      points_reward: 50,
      eth_reward_wei: '0',
      eth_reward_enabled: false,
      requirements: JSON.stringify({ type: 'games_played', value: 1 }),
      min_reputation: 0,
      max_completions_per_user: 1,
      is_active: true,
      priority: 2,
    },
    {
      quest_id: 'play_3_games',
      name: 'Getting Started',
      description: 'Play 3 games in any mode',
      type: 'one_time',
      category: 'engagement',
      points_reward: 100,
      eth_reward_wei: '0',
      eth_reward_enabled: false,
      requirements: JSON.stringify({ type: 'games_played', value: 3 }),
      min_reputation: 0,
      max_completions_per_user: 1,
      is_active: true,
      priority: 3,
    },

    // ========================================
    // TIER 2: INTERMEDIATE QUESTS (Points + Small ETH)
    // ========================================
    {
      quest_id: 'weekly_streak_7',
      name: 'Week Warrior',
      description: 'Log in 7 days in a row',
      type: 'repeatable',
      category: 'engagement',
      points_reward: 200,
      eth_reward_wei: '5000000000000000', // 0.005 ETH
      eth_reward_enabled: true,
      requirements: JSON.stringify({ type: 'streak_days', value: 7 }),
      min_reputation: 50,
      min_account_age_days: 7,
      min_games_played: 3,
      cooldown_hours: 168, // 7 days
      is_active: true,
      priority: 10,
    },
    {
      quest_id: 'win_5_gauntlets',
      name: 'Gauntlet Novice',
      description: 'Get 3/5 or better in 5 Daily Gauntlets',
      type: 'repeatable',
      category: 'skill',
      points_reward: 300,
      eth_reward_wei: '10000000000000000', // 0.01 ETH
      eth_reward_enabled: true,
      requirements: JSON.stringify({
        type: 'gauntlet_wins',
        value: 5,
        min_correct: 3,
      }),
      min_reputation: 100,
      min_account_age_days: 7,
      min_games_played: 5,
      cooldown_hours: 168,
      max_total_completions: 500, // Cap total ETH payouts
      is_active: true,
      priority: 11,
    },
    {
      quest_id: 'draft_top_50',
      name: 'Draft Contender',
      description: 'Finish in top 50% of weekly CT Draft leaderboard',
      type: 'weekly',
      category: 'skill',
      points_reward: 250,
      eth_reward_wei: '8000000000000000', // 0.008 ETH
      eth_reward_enabled: true,
      requirements: JSON.stringify({
        type: 'leaderboard_rank',
        mode: 'draft',
        percentile: 50,
      }),
      min_reputation: 100,
      min_account_age_days: 7,
      min_games_played: 5,
      cooldown_hours: 168,
      max_total_completions: 200,
      is_active: true,
      priority: 12,
    },

    // ========================================
    // TIER 3: ADVANCED QUESTS (Higher ETH)
    // ========================================
    {
      quest_id: 'monthly_streak_30',
      name: 'Dedication Master',
      description: 'Log in 30 days in a row',
      type: 'repeatable',
      category: 'achievement',
      points_reward: 1000,
      eth_reward_wei: '50000000000000000', // 0.05 ETH
      eth_reward_enabled: true,
      requirements: JSON.stringify({ type: 'streak_days', value: 30 }),
      min_reputation: 500,
      min_account_age_days: 30,
      min_games_played: 20,
      min_wallet_age_days: 30,
      cooldown_hours: 720, // 30 days
      max_total_completions: 50,
      is_active: true,
      priority: 20,
    },
    {
      quest_id: 'leaderboard_top_10',
      name: 'Elite Player',
      description: 'Finish in top 10% of any weekly leaderboard',
      type: 'weekly',
      category: 'skill',
      points_reward: 500,
      eth_reward_wei: '20000000000000000', // 0.02 ETH
      eth_reward_enabled: true,
      requirements: JSON.stringify({
        type: 'leaderboard_rank',
        percentile: 10,
      }),
      min_reputation: 300,
      min_account_age_days: 14,
      min_games_played: 15,
      cooldown_hours: 168,
      max_total_completions: 100,
      is_active: true,
      priority: 21,
    },
    {
      quest_id: 'gauntlet_perfect_5',
      name: 'Foresight Master',
      description: 'Get 5/5 correct in a Daily Gauntlet',
      type: 'repeatable',
      category: 'skill',
      points_reward: 1000,
      eth_reward_wei: '30000000000000000', // 0.03 ETH
      eth_reward_enabled: true,
      requirements: JSON.stringify({
        type: 'gauntlet_perfect',
        value: 1,
      }),
      min_reputation: 200,
      min_account_age_days: 14,
      min_games_played: 10,
      cooldown_hours: 168,
      max_total_completions: 100,
      is_active: true,
      priority: 22,
    },

    // ========================================
    // TIER 4: REFERRAL QUESTS (Anti-Sybil)
    // ========================================
    {
      quest_id: 'refer_1_friend',
      name: 'Ambassador',
      description: 'Refer 1 active friend (must play 3+ games and deposit 0.05+ ETH)',
      type: 'repeatable',
      category: 'social',
      points_reward: 200,
      eth_reward_wei: '15000000000000000', // 0.015 ETH (decreasing)
      eth_reward_enabled: true,
      requirements: JSON.stringify({
        type: 'referral_active',
        value: 1,
        min_games: 3,
        min_deposit_eth: '0.05',
        wait_days: 30,
      }),
      min_reputation: 100,
      min_account_age_days: 14,
      min_games_played: 10,
      max_completions_per_user: 10, // Max 10 referrals
      cooldown_hours: 168,
      is_active: true,
      priority: 30,
    },

    // ========================================
    // TIER 5: SPECIAL EVENTS (Limited Time)
    // ========================================
    {
      quest_id: 'launch_week_bonus',
      name: 'Early Adopter',
      description: 'Play 10 games during launch week',
      type: 'one_time',
      category: 'achievement',
      points_reward: 500,
      eth_reward_wei: '25000000000000000', // 0.025 ETH
      eth_reward_enabled: true,
      requirements: JSON.stringify({ type: 'games_played', value: 10 }),
      min_reputation: 0,
      start_date: '2025-01-17 00:00:00',
      end_date: '2025-01-24 23:59:59',
      max_completions_per_user: 1,
      max_total_completions: 1000,
      is_active: true,
      priority: 40,
    },
  ]);

  console.log('✅ Quest definitions seeded');
}
