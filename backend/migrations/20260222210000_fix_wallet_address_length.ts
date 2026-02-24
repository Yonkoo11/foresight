/**
 * Fix wallet_address column size for Solana addresses.
 * Ethereum addresses are 42 chars (0x + 40 hex).
 * Solana addresses are 32-44 chars (base58).
 * Increase to varchar(128) to be safe for both.
 */
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('wallet_address', 128).alter();
  });
  console.log('Increased wallet_address column to varchar(128)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('wallet_address', 42).alter();
  });
}
