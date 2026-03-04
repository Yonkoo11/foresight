import type { Knex } from 'knex';

/**
 * Update Season 0 prize pool from $225 to $150 ($75/$50/$25 for top 3).
 */
export async function up(knex: Knex): Promise<void> {
  await knex('prized_contests')
    .where('name', 'Season 0')
    .update({
      prize_pool: '150',
      distributable_pool: '150',
      description: 'Draft 5 CT influencers. Captain gets 2x. $150 in prizes: $75 / $50 / $25 to top 3. Free entry. Welcome to Season 0.',
      updated_at: knex.fn.now(),
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex('prized_contests')
    .where('name', 'Season 0')
    .update({
      prize_pool: '225',
      distributable_pool: '225',
      description: 'Draft 5 CT influencers. Captain gets 2x. $225 in prizes: $100 / $75 / $50 to top 3. Free entry. Welcome to Season 0.',
      updated_at: knex.fn.now(),
    });
}
