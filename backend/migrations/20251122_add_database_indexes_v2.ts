import { Knex } from 'knex';

/**
 * Migration: Add performance indexes
 * Optimizes frequently queried columns
 */
export async function up(knex: Knex): Promise<void> {
  // Helper to safely create index if it doesn't exist
  const safeCreateIndex = async (tableName: string, columns: string | string[], indexName: string) => {
    const tableExists = await knex.schema.hasTable(tableName);
    if (!tableExists) return;

    // Check if all columns exist
    const colsArray = Array.isArray(columns) ? columns : [columns];
    for (const col of colsArray) {
      const hasCol = await knex.schema.hasColumn(tableName, col);
      if (!hasCol) return;
    }

    const indexExists = await knex.raw(`
      SELECT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE tablename = ? AND indexname = ?
      )
    `, [tableName, indexName]);

    if (!indexExists.rows[0].exists) {
      const cols = Array.isArray(columns) ? columns.join(', ') : columns;
      await knex.raw(`CREATE INDEX "${indexName}" ON "${tableName}" (${cols})`);
    }
  };

  // Users table indexes
  await safeCreateIndex('users', 'wallet_address', 'idx_users_wallet');
  await safeCreateIndex('users', 'username', 'idx_users_username');
  await safeCreateIndex('users', 'vote_streak', 'idx_users_streak');

  // User XP totals indexes
  await safeCreateIndex('user_xp_totals', 'total_xp', 'idx_xp_total');
  await safeCreateIndex('user_xp_totals', 'lifetime_xp', 'idx_xp_lifetime');
  await safeCreateIndex('user_xp_totals', 'last_xp_at', 'idx_xp_last_at');

  // User teams indexes
  await safeCreateIndex('user_teams', ['user_id', 'contest_id'], 'idx_teams_user_contest');
  await safeCreateIndex('user_teams', 'total_score', 'idx_teams_score');
  await safeCreateIndex('user_teams', 'is_locked', 'idx_teams_locked');

  // Team picks indexes
  await safeCreateIndex('team_picks', 'team_id', 'idx_picks_team');
  await safeCreateIndex('team_picks', 'influencer_id', 'idx_picks_influencer');

  // Influencers indexes
  await safeCreateIndex('influencers', 'tier', 'idx_influencers_tier');
  await safeCreateIndex('influencers', 'is_active', 'idx_influencers_active');
  await safeCreateIndex('influencers', 'price', 'idx_influencers_price');
  await safeCreateIndex('influencers', 'total_points', 'idx_influencers_points');

  // Weekly spotlight votes indexes
  await safeCreateIndex('weekly_spotlight_votes', ['user_id', 'contest_id'], 'idx_votes_user_contest');
  await safeCreateIndex('weekly_spotlight_votes', 'influencer_id', 'idx_votes_influencer');

  // Influencer weekly votes indexes
  await safeCreateIndex('influencer_weekly_votes', 'contest_id', 'idx_inf_votes_contest');
  await safeCreateIndex('influencer_weekly_votes', 'weighted_score', 'idx_inf_votes_score');

  // Fantasy contests indexes
  await safeCreateIndex('fantasy_contests', 'status', 'idx_contests_status');
  await safeCreateIndex('fantasy_contests', 'start_date', 'idx_contests_start');

  // User achievements indexes
  await safeCreateIndex('user_achievements', 'user_id', 'idx_user_achievements_user');
  await safeCreateIndex('user_achievements', 'unlocked_at', 'idx_user_achievements_date');
}

export async function down(knex: Knex): Promise<void> {
  // Helper to safely drop indexes only if table exists
  const safeAlterTable = async (tableName: string, callback: (table: Knex.AlterTableBuilder) => void) => {
    const exists = await knex.schema.hasTable(tableName);
    if (exists) {
      try {
        await knex.schema.alterTable(tableName, callback);
      } catch (e) {
        // Index may not exist, ignore
      }
    }
  };

  await safeAlterTable('users', (table) => {
    table.dropIndex('wallet_address', 'idx_users_wallet');
    table.dropIndex('username', 'idx_users_username');
    table.dropIndex('vote_streak', 'idx_users_streak');
  });

  await safeAlterTable('user_xp_totals', (table) => {
    table.dropIndex('total_xp', 'idx_xp_total');
    table.dropIndex('lifetime_xp', 'idx_xp_lifetime');
    table.dropIndex('last_xp_at', 'idx_xp_last_at');
  });

  await safeAlterTable('user_teams', (table) => {
    table.dropIndex(['user_id', 'contest_id'], 'idx_teams_user_contest');
    table.dropIndex('total_score', 'idx_teams_score');
    table.dropIndex('is_locked', 'idx_teams_locked');
  });

  await safeAlterTable('team_picks', (table) => {
    table.dropIndex('team_id', 'idx_picks_team');
    table.dropIndex('influencer_id', 'idx_picks_influencer');
  });

  await safeAlterTable('influencers', (table) => {
    table.dropIndex('tier', 'idx_influencers_tier');
    table.dropIndex('is_active', 'idx_influencers_active');
    table.dropIndex('price', 'idx_influencers_price');
    table.dropIndex('total_points', 'idx_influencers_points');
  });

  await safeAlterTable('weekly_spotlight_votes', (table) => {
    table.dropIndex(['user_id', 'contest_id'], 'idx_votes_user_contest');
    table.dropIndex('influencer_id', 'idx_votes_influencer');
  });

  await safeAlterTable('influencer_weekly_votes', (table) => {
    table.dropIndex('contest_id', 'idx_inf_votes_contest');
    table.dropIndex('weighted_score', 'idx_inf_votes_score');
  });

  await safeAlterTable('fantasy_contests', (table) => {
    table.dropIndex('status', 'idx_contests_status');
    table.dropIndex('start_date', 'idx_contests_start');
  });

  await safeAlterTable('user_achievements', (table) => {
    table.dropIndex('user_id', 'idx_user_achievements_user');
    table.dropIndex('unlocked_at', 'idx_user_achievements_date');
  });
}
