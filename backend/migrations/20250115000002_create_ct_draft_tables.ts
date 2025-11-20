import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Influencers table (top 100 CT accounts)
  await knex.schema.createTable('influencers', (table) => {
    table.increments('id').primary(); // 1-100
    table.string('twitter_handle', 50).notNullable().unique();
    table.string('display_name', 100).notNullable();
    table.string('avatar_url', 500);
    table.text('bio');
    table.integer('follower_count').defaultTo(0);
    table.decimal('engagement_rate', 5, 2).defaultTo(0);
    table.integer('daily_tweets').defaultTo(0);
    table.integer('draft_score').defaultTo(0); // Calculated daily
    table.timestamp('last_scraped_at');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('twitter_handle');
    table.index('draft_score');
  });

  // Draft teams table
  await knex.schema.createTable('draft_teams', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.specificType('influencer_ids', 'integer[]').notNullable(); // Array of 5 influencer IDs
    table.integer('total_score').defaultTo(0);
    table.integer('rank').defaultTo(0);
    table.timestamp('last_updated').defaultTo(knex.fn.now());
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Unique constraint: one team per user
    table.unique(['user_id']);

    // Indexes
    table.index('user_id');
    table.index('total_score');
    table.index('rank');
  });

  // Draft scores table (historical daily scores)
  await knex.schema.createTable('draft_scores', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('team_id').notNullable().references('id').inTable('draft_teams').onDelete('CASCADE');
    table.date('date').notNullable();
    table.integer('daily_score').notNullable();
    table.integer('total_score').notNullable();
    table.integer('rank').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Unique constraint: one score per team per day
    table.unique(['team_id', 'date']);

    // Indexes
    table.index(['team_id', 'date']);
    table.index('date');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('draft_scores');
  await knex.schema.dropTableIfExists('draft_teams');
  await knex.schema.dropTableIfExists('influencers');
}
