import { db } from '../utils/db';
import knex from 'knex';
import knexConfig from '../../knexfile';

async function runMigrations() {
  const environment = process.env.NODE_ENV || 'development';
  const config = knexConfig[environment];

  console.log(`Running migrations in ${environment} environment...`);

  const knexInstance = knex(config);

  try {
    await knexInstance.migrate.latest();
    console.log('✅ Migrations completed successfully');

    // List completed migrations
    const [, migrations] = await knexInstance.migrate.list();
    console.log(`\n📋 Completed migrations (${migrations.length}):`);
    migrations.forEach((migration: string) => {
      console.log(`  ✓ ${migration}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await knexInstance.destroy();
  }
}

runMigrations();
