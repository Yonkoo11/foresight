import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('influencers', (table) => {
    table.integer('fs_rating').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('influencers', (table) => {
    table.dropColumn('fs_rating');
  });
}
