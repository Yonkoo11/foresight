/**
 * Test Twitter API Integration
 * Manually trigger a small metrics update to verify everything works
 */

import twitterApiService from '../services/twitterApiService';

async function main() {
  console.log('\n🧪 Testing Twitter API Integration...\n');

  // Check configuration
  if (!twitterApiService.isConfigured()) {
    console.error('❌ Twitter API not configured!');
    console.error('   Please set TWITTER_BEARER_TOKEN in .env');
    process.exit(1);
  }

  console.log('✅ Twitter API is configured!\n');
  console.log(twitterApiService.getRateLimitInfo());
  console.log('\n');

  // Update all 50 influencers
  console.log('📊 Updating all 50 influencers...\n');

  try {
    await twitterApiService.batchUpdateInfluencers(50);
    console.log('\n✅ Test successful! Your Twitter API integration is working!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

main();
