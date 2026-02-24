/**
 * Fix ALL wallet_address columns for Solana addresses.
 * Solana addresses are 32-44 chars (base58), Ethereum is 42.
 */
import { Knex } from 'knex';

const TABLES_TO_FIX = [
  { table: 'free_league_entries', column: 'wallet_address' },
  { table: 'free_league_limits', column: 'wallet_address' },
  { table: 'prized_entries', column: 'wallet_address' },
  { table: 'prize_claims', column: 'wallet_address' },
  { table: 'prized_contract_events', column: 'wallet_address' },
  { table: 'prized_contests', column: 'contract_address' },
  { table: 'wallets', column: 'address' },
];

export async function up(knex: Knex): Promise<void> {
  for (const { table, column } of TABLES_TO_FIX) {
    const exists = await knex.schema.hasTable(table);
    if (exists) {
      await knex.schema.alterTable(table, (t) => {
        t.string(column, 128).alter();
      });
      console.log(`Fixed ${table}.${column} → varchar(128)`);
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  for (const { table, column } of TABLES_TO_FIX) {
    const exists = await knex.schema.hasTable(table);
    if (exists) {
      await knex.schema.alterTable(table, (t) => {
        t.string(column, 42).alter();
      });
    }
  }
}
