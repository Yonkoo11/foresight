import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Whisperer questions table
  await knex.schema.createTable('whisperer_questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('tweet_id', 50).notNullable().unique();
    table.string('author_handle', 50).notNullable();
    table.text('tweet_text').notNullable();
    table.specificType('options', 'text[]').notNullable(); // Array of 4 author handles
    table.integer('correct_option').notNullable(); // Index 0-3
    table.enum('difficulty', ['EASY', 'MEDIUM', 'HARD']).notNullable();
    table.integer('times_shown').defaultTo(0);
    table.integer('times_correct').defaultTo(0);
    table.decimal('success_rate', 5, 2).defaultTo(0);
    table.boolean('active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('author_handle');
    table.index('difficulty');
    table.index('active');
  });

  // Whisperer attempts table
  await knex.schema.createTable('whisperer_attempts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('question_id').notNullable().references('id').inTable('whisperer_questions').onDelete('CASCADE');
    table.integer('selected_option').notNullable(); // Index 0-3
    table.boolean('correct').notNullable();
    table.integer('time_taken_ms').notNullable(); // Milliseconds
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('user_id');
    table.index('question_id');
    table.index(['user_id', 'created_at']);
  });

  // Whisperer leaderboard table (cumulative stats)
  await knex.schema.createTable('whisperer_leaderboard', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('total_attempts').defaultTo(0);
    table.integer('correct_answers').defaultTo(0);
    table.integer('ct_iq').defaultTo(0); // 0-100 score
    table.integer('current_streak').defaultTo(0);
    table.integer('best_streak').defaultTo(0);
    table.decimal('accuracy', 5, 2).defaultTo(0); // Percentage
    table.integer('avg_time_ms').defaultTo(0); // Average time per question
    table.timestamp('last_attempt_at');
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Unique constraint: one leaderboard entry per user
    table.unique(['user_id']);

    // Indexes
    table.index('ct_iq');
    table.index('accuracy');
    table.index('best_streak');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('whisperer_leaderboard');
  await knex.schema.dropTableIfExists('whisperer_attempts');
  await knex.schema.dropTableIfExists('whisperer_questions');
}
