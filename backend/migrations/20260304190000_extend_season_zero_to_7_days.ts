import type { Knex } from 'knex';

/**
 * Extend Season 0 from 72h to 7 days (5-day draft + 2-day scoring lock).
 * Sets lock_time = created_at + 5 days, end_time = created_at + 7 days.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE prized_contests
    SET
      lock_time = created_at + interval '5 days',
      end_time = created_at + interval '7 days',
      updated_at = now()
    WHERE name = 'Season 0'
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    UPDATE prized_contests
    SET
      lock_time = created_at + interval '48 hours',
      end_time = created_at + interval '72 hours',
      updated_at = now()
    WHERE name = 'Season 0'
  `);
}
