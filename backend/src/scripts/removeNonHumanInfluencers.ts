/**
 * Remove Non-Human Influencer Accounts
 * Removes platforms, bots, and organizational accounts that aren't actual CT personalities
 */

import db from '../utils/db';

// Non-human accounts to remove (platforms, bots, organizations)
const nonHumanAccounts = [
  'CoinGecko',           // Data aggregator platform
  'DocumentingBTC',      // Bot/automated account
  'MessariCrypto',       // Research platform/organization
  'glassnode',           // Analytics platform
  'santimentfeed',       // Analytics platform/organization
  'Frxresearch',         // Research platform (not a person)
];

async function removeNonHumanInfluencers() {
  console.log('🧹 Removing non-human influencer accounts...\n');

  for (const handle of nonHumanAccounts) {
    try {
      const influencer = await db('influencers')
        .where({ twitter_handle: handle })
        .first();

      if (!influencer) {
        console.log(`⏭️  Skipping @${handle} - not found in database`);
        continue;
      }

      // Delete the influencer
      await db('influencers')
        .where({ twitter_handle: handle })
        .delete();

      console.log(`❌ Removed ${influencer.display_name} (@${handle}) - ${influencer.tier} tier, ${influencer.follower_count?.toLocaleString()} followers`);
    } catch (error) {
      console.error(`❌ Error removing @${handle}:`, error);
    }
  }

  console.log('\n✨ Done! Non-human accounts removed.');

  // Show updated count
  const count = await db('influencers').count('* as count').first();
  console.log(`\n📊 Total influencers in database: ${count?.count}`);

  // Show remaining accounts by tier
  const byTier = await db('influencers')
    .select('tier')
    .count('* as count')
    .groupBy('tier')
    .orderBy('tier');

  console.log('\n📈 Influencers by tier:');
  byTier.forEach((row: any) => {
    console.log(`   ${row.tier}-tier: ${row.count}`);
  });

  process.exit(0);
}

removeNonHumanInfluencers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
