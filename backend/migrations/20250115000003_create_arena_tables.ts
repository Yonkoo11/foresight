import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Arena duels table
  await knex.schema.createTable('arena_duels', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.bigInteger('chain_duel_id').notNullable().unique(); // ID from smart contract
    table.uuid('creator_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('opponent_id').references('id').inTable('users').onDelete('SET NULL');

    table.enum('duel_type', ['PRICE', 'PROTOCOL', 'NARRATIVE']).notNullable();
    table.enum('status', ['PENDING', 'ACTIVE', 'RESOLVED', 'CANCELLED', 'VOTING']).notNullable();

    table.text('question').notNullable();
    table.string('creator_position', 10).notNullable(); // YES or NO
    table.string('opponent_position', 10);

    table.decimal('stake', 18, 6).notNullable(); // ETH amount
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('accepted_at');
    table.timestamp('expires_at').notNullable();
    table.timestamp('resolution_time').notNullable();

    // Type-specific fields
    table.string('oracle_key', 100); // For PRICE duels
    table.decimal('target_price', 18, 8); // For PRICE duels
    table.string('protocol_metric', 100); // For PROTOCOL duels
    table.bigInteger('target_value'); // For PROTOCOL duels

    table.uuid('winner_id').references('id').inTable('users').onDelete('SET NULL');
    table.boolean('resolved').defaultTo(false);
    table.decimal('payout', 18, 6);
    table.string('tx_hash', 66); // Transaction hash

    // Indexes
    table.index('chain_duel_id');
    table.index('creator_id');
    table.index('opponent_id');
    table.index('status');
    table.index('duel_type');
    table.index('created_at');
  });

  // Arena votes table (for NARRATIVE duels)
  await knex.schema.createTable('arena_votes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('duel_id').notNullable().references('id').inTable('arena_duels').onDelete('CASCADE');
    table.uuid('voter_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.boolean('voted_for_creator').notNullable(); // true = creator wins, false = opponent wins
    table.decimal('stake', 18, 6).notNullable(); // 0.01 ETH
    table.boolean('claimed').defaultTo(false);
    table.decimal('reward', 18, 6);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.string('tx_hash', 66);

    // Unique constraint: one vote per user per duel
    table.unique(['duel_id', 'voter_id']);

    // Indexes
    table.index('duel_id');
    table.index('voter_id');
  });

  // Arena results table (for analytics and leaderboard)
  await knex.schema.createTable('arena_results', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('wins').defaultTo(0);
    table.integer('losses').defaultTo(0);
    table.decimal('total_staked', 18, 6).defaultTo(0);
    table.decimal('total_winnings', 18, 6).defaultTo(0);
    table.decimal('net_profit', 18, 6).defaultTo(0);
    table.decimal('win_rate', 5, 2).defaultTo(0); // Percentage
    table.integer('current_streak').defaultTo(0); // Positive = win streak, negative = loss streak
    table.integer('best_streak').defaultTo(0);
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Unique constraint: one result per user
    table.unique(['user_id']);

    // Indexes
    table.index('wins');
    table.index('net_profit');
    table.index('win_rate');
  });

  // Arena leaderboard table (monthly snapshots)
  await knex.schema.createTable('arena_leaderboard', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('month').notNullable(); // YYYYMM format
    table.integer('rank').notNullable();
    table.integer('wins').notNullable();
    table.integer('losses').notNullable();
    table.decimal('net_profit', 18, 6).notNullable();
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
  await knex.schema.dropTableIfExists('arena_leaderboard');
  await knex.schema.dropTableIfExists('arena_results');
  await knex.schema.dropTableIfExists('arena_votes');
  await knex.schema.dropTableIfExists('arena_duels');
}
