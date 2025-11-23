import { Knex } from 'knex';

/**
 * Migration: Add streak tracking to users table
 * Adds vote_streak and last_vote_date columns for daily streak mechanics
 */
export async function up(knex: Knex): Promise<void> {
  const hasVoteStreak = await knex.schema.hasColumn('users', 'vote_streak');

  if (!hasVoteStreak) {
    await knex.schema.alterTable('users', (table) => {
      table.integer('vote_streak').defaultTo(0).notNullable();
      table.date('last_vote_date').nullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('vote_streak');
    table.dropColumn('last_vote_date');
  });
}
