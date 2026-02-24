import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('free_league_entries', (table) => {
    table.string('claim_tx_hash', 128).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('free_league_entries', (table) => {
    table.dropColumn('claim_tx_hash');
  });
}
