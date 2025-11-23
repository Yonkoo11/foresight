import { Knex } from 'knex';

/**
 * Migration: Add CT-themed achievements
 * Adds crypto twitter culture specific achievements
 */
export async function up(knex: Knex): Promise<void> {
  // Add CT-specific achievements
  await knex('achievements').insert([
    // CT Culture achievements
    {
      key: 'FEW_UNDERSTAND',
      name: 'few understand',
      description: 'drafted a perfect team',
      icon: '💎',
      xp_reward: 500,
      rarity: 'legendary',
      category: 'performance',
    },
    {
      key: 'DIAMOND_HANDS',
      name: 'diamond hands',
      description: 'kept same team for 4 weeks',
      icon: '💪',
      xp_reward: 250,
      rarity: 'epic',
      category: 'performance',
      threshold: 4,
    },
    {
      key: 'GM_STREAK',
      name: 'gm streak',
      description: '7 days in a row',
      icon: '🔥',
      xp_reward: 100,
      rarity: 'common',
      category: 'voting',
      threshold: 7,
    },
    {
      key: 'GM_LEGEND',
      name: 'gm legend',
      description: '30 days in a row',
      icon: '🔥',
      xp_reward: 500,
      rarity: 'epic',
      category: 'voting',
      threshold: 30,
    },
    {
      key: 'SENT_IT',
      name: 'sent it',
      description: 'all budget on S-tier players',
      icon: '🚀',
      xp_reward: 150,
      rarity: 'rare',
      category: 'performance',
    },
    {
      key: 'TO_THE_MOON',
      name: 'to the moon',
      description: 'scored 200+ in a week',
      icon: '🌙',
      xp_reward: 200,
      rarity: 'rare',
      category: 'performance',
      threshold: 200,
    },
    {
      key: 'DEGEN_MODE',
      name: 'degen mode',
      description: 'risky draft paid off',
      icon: '⚡',
      xp_reward: 150,
      rarity: 'rare',
      category: 'performance',
    },
    {
      key: 'PERFECT_WEEK',
      name: 'perfect week',
      description: 'all 5 picks scored 20+',
      icon: '⭐',
      xp_reward: 300,
      rarity: 'epic',
      category: 'performance',
    },
    {
      key: 'WHALE_WATCHER',
      name: 'whale watcher',
      description: 'reached whale rank',
      icon: '🐋',
      xp_reward: 1000,
      rarity: 'legendary',
      category: 'milestone',
    },
    {
      key: 'THE_CHOSEN_ONE',
      name: 'the chosen one',
      description: 'picked CT spotlight winner 3 weeks straight',
      icon: '👁️',
      xp_reward: 500,
      rarity: 'legendary',
      category: 'voting',
      threshold: 3,
    },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  // Remove CT-specific achievements
  await knex('achievements').whereIn('key', [
    'FEW_UNDERSTAND',
    'DIAMOND_HANDS',
    'GM_STREAK',
    'GM_LEGEND',
    'SENT_IT',
    'TO_THE_MOON',
    'DEGEN_MODE',
    'PERFECT_WEEK',
    'WHALE_WATCHER',
    'THE_CHOSEN_ONE',
  ]).del();
}
