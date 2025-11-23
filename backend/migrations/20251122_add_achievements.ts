import { Knex } from 'knex';

/**
 * Migration: Add achievements system
 * Creates achievements table and user_achievements junction table
 */
export async function up(knex: Knex): Promise<void> {
  // Create achievements table
  await knex.schema.createTable('achievements', (table) => {
    table.increments('id').primary();
    table.string('key').unique().notNullable(); // e.g., 'FIRST_VOTE', 'TOP_10_FINISH'
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('icon').defaultTo('trophy'); // Lucide icon name
    table.integer('xp_reward').defaultTo(0);
    table.string('rarity').defaultTo('common'); // common, rare, epic, legendary
    table.string('category').defaultTo('general'); // voting, performance, social, milestone
    table.integer('threshold').nullable(); // For progress-based achievements
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Create user_achievements junction table
  await knex.schema.createTable('user_achievements', (table) => {
    table.increments('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('achievement_id').unsigned().notNullable().references('id').inTable('achievements').onDelete('CASCADE');
    table.timestamp('unlocked_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'achievement_id']);
  });

  // Seed initial achievements
  await knex('achievements').insert([
    // Voting achievements
    { key: 'FIRST_VOTE', name: 'First Voice', description: 'Cast your first spotlight vote', icon: 'vote', xp_reward: 25, rarity: 'common', category: 'voting' },
    { key: 'VOTES_10', name: 'Regular Voter', description: 'Cast 10 spotlight votes', icon: 'check-circle', xp_reward: 50, rarity: 'common', category: 'voting', threshold: 10 },
    { key: 'VOTES_50', name: 'Dedicated Voter', description: 'Cast 50 spotlight votes', icon: 'award', xp_reward: 150, rarity: 'rare', category: 'voting', threshold: 50 },
    { key: 'VOTES_100', name: 'Century Voter', description: 'Cast 100 spotlight votes', icon: 'trophy', xp_reward: 500, rarity: 'epic', category: 'voting', threshold: 100 },
    { key: 'STREAK_7', name: 'Week Warrior', description: 'Maintain a 7-day voting streak', icon: 'flame', xp_reward: 100, rarity: 'rare', category: 'voting', threshold: 7 },
    { key: 'STREAK_30', name: 'Monthly Master', description: 'Maintain a 30-day voting streak', icon: 'zap', xp_reward: 500, rarity: 'legendary', category: 'voting', threshold: 30 },

    // Performance achievements
    { key: 'FIRST_TEAM', name: 'Team Builder', description: 'Create your first fantasy team', icon: 'users', xp_reward: 50, rarity: 'common', category: 'performance' },
    { key: 'TOP_10_FINISH', name: 'Top 10', description: 'Finish in the top 10 of a contest', icon: 'medal', xp_reward: 100, rarity: 'rare', category: 'performance' },
    { key: 'TOP_3_FINISH', name: 'Podium Finisher', description: 'Finish in the top 3 of a contest', icon: 'crown', xp_reward: 250, rarity: 'epic', category: 'performance' },
    { key: 'WIN_CONTEST', name: 'Champion', description: 'Win a contest', icon: 'trophy', xp_reward: 500, rarity: 'legendary', category: 'performance' },
    { key: 'TEAM_100_POINTS', name: 'Century Team', description: 'Score 100+ points with your team', icon: 'target', xp_reward: 50, rarity: 'common', category: 'performance', threshold: 100 },

    // Social achievements
    { key: 'CREATE_LEAGUE', name: 'League Founder', description: 'Create a private league', icon: 'shield', xp_reward: 75, rarity: 'rare', category: 'social' },
    { key: 'JOIN_5_LEAGUES', name: 'Social Butterfly', description: 'Join 5 different leagues', icon: 'users', xp_reward: 50, rarity: 'common', category: 'social', threshold: 5 },
    { key: 'REFERRAL', name: 'Recruiter', description: 'Refer a friend who joins', icon: 'user-plus', xp_reward: 100, rarity: 'rare', category: 'social' },

    // Milestone achievements
    { key: 'XP_100', name: 'Rising Star', description: 'Earn 100 XP', icon: 'star', xp_reward: 25, rarity: 'common', category: 'milestone', threshold: 100 },
    { key: 'XP_500', name: 'Skilled Player', description: 'Earn 500 XP', icon: 'star', xp_reward: 50, rarity: 'rare', category: 'milestone', threshold: 500 },
    { key: 'XP_1000', name: 'Expert', description: 'Earn 1000 XP', icon: 'sparkles', xp_reward: 100, rarity: 'epic', category: 'milestone', threshold: 1000 },
    { key: 'XP_2500', name: 'Legend', description: 'Earn 2500 XP', icon: 'gem', xp_reward: 250, rarity: 'legendary', category: 'milestone', threshold: 2500 },

    // Special achievements
    { key: 'EARLY_ADOPTER', name: 'Early Adopter', description: 'Joined during beta', icon: 'rocket', xp_reward: 100, rarity: 'legendary', category: 'special' },
    { key: 'CAPTAIN_SUCCESS', name: 'Captain Clutch', description: 'Your captain scores highest on your team', icon: 'anchor', xp_reward: 25, rarity: 'common', category: 'performance' },
  ]);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user_achievements');
  await knex.schema.dropTableIfExists('achievements');
}
