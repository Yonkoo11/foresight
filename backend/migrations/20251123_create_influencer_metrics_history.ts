import { Knex } from 'knex';

/**
 * Migration: Create influencer_metrics table for historical tracking
 * Stores snapshots of influencer metrics over time for trend analysis
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('influencer_metrics', (table) => {
    table.increments('id').primary();
    table.integer('influencer_id').notNullable();
    table.integer('follower_count').notNullable().defaultTo(0);
    table.integer('following_count').defaultTo(0);
    table.integer('tweet_count').defaultTo(0);
    table.decimal('engagement_rate', 5, 2).defaultTo(0);
    table.integer('daily_tweets').defaultTo(0);
    table.integer('likes_count').defaultTo(0); // Total likes on recent tweets
    table.integer('retweets_count').defaultTo(0); // Total retweets on recent tweets
    table.integer('replies_count').defaultTo(0); // Total replies on recent tweets
    table.timestamp('scraped_at').notNullable().defaultTo(knex.fn.now());
    table.string('source', 50).defaultTo('nitter'); // nitter, twitter_api, manual, etc.

    // Foreign key
    table.foreign('influencer_id').references('influencers.id').onDelete('CASCADE');

    // Indexes for common queries
    table.index('influencer_id');
    table.index('scraped_at');
    table.index(['influencer_id', 'scraped_at']);
  });

  // Add indexes to influencers table for scraping
  await knex.schema.alterTable('influencers', (table) => {
    table.index('last_scraped_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('influencer_metrics');

  await knex.schema.alterTable('influencers', (table) => {
    table.dropIndex('last_scraped_at');
  });
}
