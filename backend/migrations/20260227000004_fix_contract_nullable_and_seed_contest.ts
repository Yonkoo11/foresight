import { Knex } from 'knex';

/**
 * CONVERTED TO NO-OP
 *
 * This migration attempted to use Knex's .alter() to make contract_contest_id
 * and contract_address nullable. The ALTER TABLE was silently not applied —
 * the NOT NULL constraint remained in place.
 *
 * Actual fix: 20260227000005_make_contract_fields_nullable_raw.ts
 * (uses raw SQL: ALTER TABLE ... ALTER COLUMN ... DROP NOT NULL)
 */
export async function up(_knex: Knex): Promise<void> {
  // No-op: see 20260227000005
}

export async function down(_knex: Knex): Promise<void> {
  // No-op
}
