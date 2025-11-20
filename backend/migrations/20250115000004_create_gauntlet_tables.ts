import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Gauntlet days table
  await knex.schema.createTable('gauntlet_days', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.bigInteger('chain_day_id').notNullable().unique(); // Day number from contract
    table.date('date').notNullable().unique();
    table.boolean('active').defaultTo(true);
    table.boolean('resolved').defaultTo(false);
    table.decimal('total_pool', 18, 6).defaultTo(0);
    table.integer('entry_count').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('resolved_at');

    // Indexes
    table.index('chain_day_id');
    table.index('date');
    table.index('active');
  });

  // Gauntlet predictions table
  await knex.schema.createTable('gauntlet_predictions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.bigInteger('chain_prediction_id').notNullable().unique(); // ID from contract
    table.uuid('gauntlet_day_id').notNullable().references('id').inTable('gauntlet_days').onDelete('CASCADE');
    table.text('question').notNullable();
    table.string('oracle_key', 100).notNullable();
    table.timestamp('resolution_time').notNullable();
    table.boolean('resolved').defaultTo(false);
    table.boolean('outcome'); // true = YES, false = NO
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('resolved_at');

    // Indexes
    table.index('chain_prediction_id');
    table.index('gauntlet_day_id');
    table.index('resolved');
  });

  // Gauntlet entries table
  await knex.schema.createTable('gauntlet_entries', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('gauntlet_day_id').notNullable().references('id').inTable('gauntlet_days').onDelete('CASCADE');
    table.specificType('predictions', 'boolean[]').notNullable(); // Array of 5 YES/NO predictions
    table.decimal('stake', 18, 6).notNullable();
    table.integer('correct_count').defaultTo(0);
    table.boolean('resolved').defaultTo(false);
    table.boolean('claimed').defaultTo(false);
    table.decimal('payout', 18, 6).defaultTo(0);
    table.timestamp('submitted_at').defaultTo(knex.fn.now());
    table.string('tx_hash', 66);

    // Unique constraint: one entry per user per day
    table.unique(['user_id', 'gauntlet_day_id']);

    // Indexes
    table.index('user_id');
    table.index('gauntlet_day_id');
    table.index('correct_count');
  });

  // Gauntlet results table (cumulative user stats)
  await knex.schema.createTable('gauntlet_results', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('days_participated').defaultTo(0);
    table.integer('total_predictions').defaultTo(0);
    table.integer('total_correct').defaultTo(0);
    table.decimal('accuracy', 5, 2).defaultTo(0); // Percentage
    table.integer('perfect_days').defaultTo(0); // 5/5 correct
    table.decimal('total_staked', 18, 6).defaultTo(0);
    table.decimal('total_winnings', 18, 6).defaultTo(0);
    table.decimal('net_profit', 18, 6).defaultTo(0);
    table.integer('current_streak').defaultTo(0);
    table.integer('best_streak').defaultTo(0);
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Unique constraint: one result per user
    table.unique(['user_id']);

    // Indexes
    table.index('accuracy');
    table.index('perfect_days');
    table.index('net_profit');
  });

  // Gauntlet leaderboard table (monthly snapshots)
  await knex.schema.createTable('gauntlet_leaderboard', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('month').notNullable(); // YYYYMM format
    table.integer('rank').notNullable();
    table.integer('days_participated').notNullable();
    table.decimal('accuracy', 5, 2).notNullable();
    table.integer('perfect_days').notNullable();
    table.decimal('total_winnings', 18, 6).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Unique constraint: one entry per user per month
    table.unique(['user_id', 'month']);

    // Indexes
    table.index(['month', 'rank']);
    table.index('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('gauntlet_leaderboard');
  await knex.schema.dropTableIfExists('gauntlet_results');
  await knex.schema.dropTableIfExists('gauntlet_entries');
  await knex.schema.dropTableIfExists('gauntlet_predictions');
  await knex.schema.dropTableIfExists('gauntlet_days');
}
