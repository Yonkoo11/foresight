/**
 * Test Nitter Scraper
 * Quick script to test scraping functionality
 */

import nitterScraper from '../services/nitterScraper';

async function main() {
  console.log('🧪 Testing Nitter Scraper...\n');

  // Test with a well-known handle
  const testHandle = 'VitalikButerin';

  console.log(`Testing scrape of @${testHandle}...\n`);

  const metrics = await nitterScraper.scrapeHandle(testHandle);

  if (metrics) {
    console.log('\n✅ Scraping successful!');
    console.log('Metrics:', JSON.stringify(metrics, null, 2));
  } else {
    console.log('\n❌ Scraping failed');
    process.exit(1);
  }

  // Test updating first 3 influencers from database
  console.log('\n\n🔄 Testing database update for 3 influencers...\n');
  await nitterScraper.updateAllInfluencers(3);

  process.exit(0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
