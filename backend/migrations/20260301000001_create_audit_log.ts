import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // FINDING-029: Audit log for admin and sensitive actions
  await knex.schema.createTable('audit_log', (table) => {
    table.increments('id').primary();
    table.string('user_id').nullable();
    table.string('action').notNullable();
    table.string('resource_type').nullable();
    table.string('resource_id').nullable();
    table.string('ip_address').nullable();
    table.jsonb('details').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    table.index(['user_id']);
    table.index(['action']);
    table.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audit_log');
}
