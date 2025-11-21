import knex from 'knex';

const db = knex({
  client: 'postgresql',
  connection: {
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    user: process.env.PGUSER || 'yonko',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'foresight',
  },
});

/**
 * Update all influencer profile pictures to use dynamic avatar service
 *
 * Using unavatar.io which automatically fetches current Twitter profile pictures
 * Format: https://unavatar.io/twitter/{handle}
 *
 * This ensures profile pictures are always up-to-date even if users change them
 */
async function updateProfilePicturesDynamic() {
  console.log('🖼️  Updating to dynamic profile picture URLs...\n');

  try {
    // Get all influencers
    const influencers = await db('influencers').select('id', 'twitter_handle');

    console.log(`Found ${influencers.length} influencers to update\n`);

    for (const influencer of influencers) {
      // Generate dynamic URL using unavatar.io (using /x/ since Twitter rebranded to X)
      const dynamicUrl = `https://unavatar.io/x/${influencer.twitter_handle}`;

      await db('influencers')
        .where({ id: influencer.id })
        .update({ avatar_url: dynamicUrl });

      console.log(`✅ @${influencer.twitter_handle.padEnd(20)} → ${dynamicUrl}`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${influencers.length} influencers`);
    console.log(`   🔄 Using: unavatar.io dynamic service`);

    // Verify update
    const withPictures = await db('influencers')
      .whereNotNull('avatar_url')
      .count('* as count');

    console.log(`\n🔍 Verification: ${withPictures[0].count} influencers now have dynamic avatar URLs`);

    // Show sample URLs
    console.log(`\n📸 Sample URLs:`);
    const samples = await db('influencers')
      .select('twitter_handle', 'avatar_url')
      .limit(3);

    samples.forEach(s => {
      console.log(`   @${s.twitter_handle}: ${s.avatar_url}`);
    });

  } catch (error) {
    console.error('❌ Error updating profile pictures:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Run the script
updateProfilePicturesDynamic()
  .then(() => {
    console.log('\n✨ Dynamic profile picture URLs updated successfully!');
    console.log('ℹ️  Profile pictures will now auto-update when users change them on Twitter');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
