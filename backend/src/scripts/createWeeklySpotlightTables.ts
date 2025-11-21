/**
 * Create tables for Weekly CT Spotlight feature
 * Run with: NODE_OPTIONS='--import tsx' pnpm exec tsx src/scripts/createWeeklySpotlightTables.ts
 */

import db from '../utils/db';

async function createWeeklySpotlightTables() {
  try {
    console.log('========================================');
    console.log('Creating Weekly CT Spotlight Tables');
    console.log('========================================\n');

    // 1. Create weekly_spotlight_votes table
    await db.schema.hasTable('weekly_spotlight_votes').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('weekly_spotlight_votes', (table) => {
          table.increments('id').primary();
          table.string('user_id').notNullable();
          table.integer('influencer_id').notNullable().references('id').inTable('influencers').onDelete('CASCADE');
          table.integer('contest_id').notNullable().references('id').inTable('fantasy_contests').onDelete('CASCADE');
          table.integer('vote_weight').defaultTo(1);
          table.timestamp('created_at').defaultTo(db.fn.now());
          table.timestamp('updated_at').defaultTo(db.fn.now());

          // One vote per user per contest
          table.unique(['user_id', 'contest_id']);

          // Indexes
          table.index('user_id');
          table.index('influencer_id');
          table.index('contest_id');
        });
        console.log('✓ Created weekly_spotlight_votes table');
      } else {
        console.log('⊘ weekly_spotlight_votes table already exists');
      }
    });

    // 2. Create influencer_weekly_votes table (aggregated vote counts)
    await db.schema.hasTable('influencer_weekly_votes').then(async (exists) => {
      if (!exists) {
        await db.schema.createTable('influencer_weekly_votes', (table) => {
          table.increments('id').primary();
          table.integer('influencer_id').notNullable().references('id').inTable('influencers').onDelete('CASCADE');
          table.integer('contest_id').notNullable().references('id').inTable('fantasy_contests').onDelete('CASCADE');
          table.integer('vote_count').defaultTo(0);
          table.integer('weighted_score').defaultTo(0);
          table.timestamp('created_at').defaultTo(db.fn.now());
          table.timestamp('updated_at').defaultTo(db.fn.now());

          // One record per influencer per contest
          table.unique(['influencer_id', 'contest_id']);

          // Indexes
          table.index('contest_id');
          table.index(['contest_id', 'weighted_score']);
        });
        console.log('✓ Created influencer_weekly_votes table');
      } else {
        console.log('⊘ influencer_weekly_votes table already exists');
      }
    });

    console.log('\n========================================');
    console.log('✅ Weekly CT Spotlight Tables Created');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

createWeeklySpotlightTables();
