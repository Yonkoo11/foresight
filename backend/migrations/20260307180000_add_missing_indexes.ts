import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // foresight_scores: frequently queried by user_id + tier
  const hasScoresUserTier = await knex.schema.hasTable('foresight_scores');
  if (hasScoresUserTier) {
    await knex.schema.alterTable('foresight_scores', (table) => {
      table.index(['user_id', 'tier'], 'idx_foresight_scores_user_tier');
    });
  }

  // user_quests_v2: queried by user_id + quest_id for completion checks
  const hasUserQuests = await knex.schema.hasTable('user_quests_v2');
  if (hasUserQuests) {
    await knex.schema.alterTable('user_quests_v2', (table) => {
      table.index(['user_id', 'quest_id'], 'idx_user_quests_v2_user_quest');
    });
  }

  // user_xp_ledger: queried by user_id + earned_at for XP history
  const hasXpLedger = await knex.schema.hasTable('user_xp_ledger');
  if (hasXpLedger) {
    await knex.schema.alterTable('user_xp_ledger', (table) => {
      table.index(['user_id', 'earned_at'], 'idx_user_xp_ledger_user_earned');
    });
  }

  // prized_contest_entries: queried by user_id for "my contests"
  const hasPrizedEntries = await knex.schema.hasTable('prized_contest_entries');
  if (hasPrizedEntries) {
    await knex.schema.alterTable('prized_contest_entries', (table) => {
      table.index(['user_id', 'contest_id'], 'idx_prized_entries_user_contest');
    });
  }

  // flash_contest_entries: queried by user_id for "my contests"
  const hasFlashEntries = await knex.schema.hasTable('flash_contest_entries');
  if (hasFlashEntries) {
    await knex.schema.alterTable('flash_contest_entries', (table) => {
      table.index(['user_id', 'contest_id'], 'idx_flash_entries_user_contest');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const tables = [
    { table: 'foresight_scores', index: 'idx_foresight_scores_user_tier' },
    { table: 'user_quests_v2', index: 'idx_user_quests_v2_user_quest' },
    { table: 'user_xp_ledger', index: 'idx_user_xp_ledger_user_earned' },
    { table: 'prized_contest_entries', index: 'idx_prized_entries_user_contest' },
    { table: 'flash_contest_entries', index: 'idx_flash_entries_user_contest' },
  ];

  for (const { table, index } of tables) {
    const exists = await knex.schema.hasTable(table);
    if (exists) {
      await knex.schema.alterTable(table, (t) => {
        t.dropIndex([], index);
      });
    }
  }
}
