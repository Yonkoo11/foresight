import { Knex } from 'knex';

/**
 * Add Privy auth provider and Tapestry identity fields to users table.
 * Part of the Day 1 migration from SIWE to Privy + Tapestry integration.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    // Auth provider tracking (siwe | privy)
    table.string('auth_provider', 50).defaultTo('siwe');

    // Tapestry Protocol identity
    table.string('tapestry_user_id', 255).unique().nullable();

    // Privy DID for linking back to Privy account
    table.string('privy_did', 255).unique().nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('auth_provider');
    table.dropColumn('tapestry_user_id');
    table.dropColumn('privy_did');
  });
}
