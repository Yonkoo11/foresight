import db from '../utils/db';

async function migrateQuestsOnly() {
  console.log('Creating quest system tables...\n');

  try {
    // Drop all quest tables first (in reverse dependency order)
    await db.schema.dropTableIfExists('quest_activity_log');
    await db.schema.dropTableIfExists('user_quest_completions');
    await db.schema.dropTableIfExists('user_achievements');
    await db.schema.dropTableIfExists('user_stats');
    await db.schema.dropTableIfExists('referrals');
    await db.schema.dropTableIfExists('quests');
    console.log('🗑️  Dropped existing quest tables (if any)\n');

    // Create quests table
    await db.schema.createTable('quests', (table) => {
      table.increments('id').primary();
      table.string('quest_id').unique().notNullable();
      table.string('name').notNullable();
      table.text('description');
      table.string('category').notNullable(); // beginner, intermediate, advanced, referral
      table.integer('points_reward').defaultTo(0);
      table.bigInteger('eth_reward_wei').defaultTo(0);
      table.boolean('eth_reward_enabled').defaultTo(false);
      table.jsonb('requirements').notNullable();
      table.integer('min_reputation').defaultTo(0);
      table.integer('min_account_age_days').defaultTo(0);
      table.integer('min_wallet_age_days').defaultTo(0);
      table.integer('min_games_played').defaultTo(0);
      table.integer('max_completions_per_user').nullable();
      table.integer('max_total_completions').nullable();
      table.integer('cooldown_hours').defaultTo(0);
      table.boolean('active').defaultTo(true);
      table.timestamps(true, true);
    });
    console.log('✅ Created quests table');

    // Create user_quest_completions table
    await db.schema.createTable('user_quest_completions', (table) => {
      table.increments('id').primary();
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('quest_id').notNullable().references('id').inTable('quests').onDelete('CASCADE');
      table.timestamp('completed_at').defaultTo(db.fn.now());
      table.integer('points_earned').defaultTo(0);
      table.bigInteger('eth_earned_wei').defaultTo(0);
      table.timestamp('eth_unlock_date').nullable();
      table.boolean('eth_claimed').defaultTo(false);
      table.string('claim_tx_hash').nullable();
      table.jsonb('verification_data').nullable();
      table.unique(['user_id', 'quest_id']); // Prevent duplicate completions
    });
    console.log('✅ Created user_quest_completions table');

    // Create referrals table
    await db.schema.createTable('referrals', (table) => {
      table.increments('id').primary();
      table.uuid('referrer_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.uuid('referee_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('referred_at').defaultTo(db.fn.now());
      table.boolean('reward_claimed').defaultTo(false);
      table.timestamp('reward_eligible_date').nullable();
      table.string('referee_ip_hash').nullable();
      table.boolean('flagged').defaultTo(false);
      table.unique(['referrer_id', 'referee_id']);
    });
    console.log('✅ Created referrals table');

    // Create user_achievements table
    await db.schema.createTable('user_achievements', (table) => {
      table.increments('id').primary();
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('achievement_id').notNullable();
      table.timestamp('unlocked_at').defaultTo(db.fn.now());
      table.jsonb('metadata').nullable();
      table.unique(['user_id', 'achievement_id']);
    });
    console.log('✅ Created user_achievements table');

    // Create user_stats table
    await db.schema.createTable('user_stats', (table) => {
      table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
      table.integer('total_quests_completed').defaultTo(0);
      table.integer('total_points_earned').defaultTo(0);
      table.bigInteger('total_eth_earned_wei').defaultTo(0);
      table.integer('current_login_streak').defaultTo(0);
      table.integer('longest_login_streak').defaultTo(0);
      table.timestamp('last_login_date').nullable();
      table.integer('total_referrals').defaultTo(0);
      table.integer('successful_referrals').defaultTo(0);
      table.timestamps(true, true);
    });
    console.log('✅ Created user_stats table');

    // Create quest_activity_log table
    await db.schema.createTable('quest_activity_log', (table) => {
      table.increments('id').primary();
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.integer('quest_id').nullable().references('id').inTable('quests').onDelete('SET NULL');
      table.string('action').notNullable(); // started, completed, claimed, flagged
      table.jsonb('metadata').nullable();
      table.timestamp('logged_at').defaultTo(db.fn.now());
      table.index(['user_id', 'logged_at']);
    });
    console.log('✅ Created quest_activity_log table');

    console.log('\n✨ Quest system tables created successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrateQuestsOnly();
