/**
 * Add spotlight_bonus column to user_teams table
 * Run with: NODE_OPTIONS='--import tsx' pnpm exec tsx src/scripts/addSpotlightBonusColumn.ts
 */

import db from '../utils/db';

async function addSpotlightBonusColumn() {
  try {
    console.log('Adding spotlight_bonus column to user_teams...');

    const hasColumn = await db.schema.hasColumn('user_teams', 'spotlight_bonus');

    if (!hasColumn) {
      await db.schema.table('user_teams', (table) => {
        table.integer('spotlight_bonus').defaultTo(0);
      });
      console.log('✓ Added spotlight_bonus column to user_teams');
    } else {
      console.log('⊘ spotlight_bonus column already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addSpotlightBonusColumn();
