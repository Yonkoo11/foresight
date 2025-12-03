/**
 * Add Missing Current CT Influencers
 * Adds the most active and relevant CT accounts that are currently missing
 */

import db from '../utils/db';

const missingInfluencers = [
  // User-suggested accounts
  {
    twitter_handle: 'beast_ico',
    display_name: 'IcoBeast',
    follower_count: 55700,
    tier: 'B',
    price: 18.00,
    base_price: 18.00,
    bio: 'Merchant of Narratives @ProofOfPlay | TwitterScore: 1000',
    is_active: true
  },
  {
    twitter_handle: 'waleswoosh',
    display_name: 'Wale Swoosh',
    follower_count: 82000,
    tier: 'B',
    price: 18.00,
    base_price: 18.00,
    bio: 'Crypto educator bringing accessible education to underrepresented communities',
    is_active: true
  },
  {
    twitter_handle: 'banditxbt',
    display_name: 'BanditXBT',
    follower_count: 32900,
    tier: 'C',
    price: 12.00,
    base_price: 12.00,
    bio: 'Crypto trader and enthusiast',
    is_active: true
  },

  // Major missing accounts from research
  {
    twitter_handle: 'saylor',
    display_name: 'Michael Saylor',
    follower_count: 3500000,
    tier: 'S',
    price: 28.00,
    base_price: 28.00,
    bio: 'MicroStrategy CEO, Bitcoin maximalist and leading corporate Bitcoin advocate',
    is_active: true
  },
  {
    twitter_handle: '100trillionUSD',
    display_name: 'PlanB',
    follower_count: 1900000,
    tier: 'S',
    price: 28.00,
    base_price: 28.00,
    bio: 'Creator of Stock-to-Flow model, quantitative analyst',
    is_active: true
  },
  {
    twitter_handle: 'woonomic',
    display_name: 'Willy Woo',
    follower_count: 1100000,
    tier: 'S',
    price: 28.00,
    base_price: 28.00,
    bio: 'Leading on-chain analyst, data-driven Bitcoin insights',
    is_active: true
  },
  {
    twitter_handle: 'aantonop',
    display_name: 'Andreas Antonopoulos',
    follower_count: 730000,
    tier: 'A',
    price: 22.00,
    base_price: 22.00,
    bio: 'Bitcoin educator, author of Mastering Bitcoin and The Internet of Money',
    is_active: true
  },
  {
    twitter_handle: 'lopp',
    display_name: 'Jameson Lopp',
    follower_count: 550000,
    tier: 'A',
    price: 22.00,
    base_price: 22.00,
    bio: 'Bitcoin developer, Casa CTO, cybersecurity expert',
    is_active: true
  },
  {
    twitter_handle: 'DocumentingBTC',
    display_name: 'Documenting Bitcoin',
    follower_count: 743000,
    tier: 'A',
    price: 22.00,
    base_price: 22.00,
    bio: 'Key moments in Bitcoin development and adoption',
    is_active: true
  },
  {
    twitter_handle: 'thedefiedge',
    display_name: 'The DeFi Edge',
    follower_count: 305110,
    tier: 'A',
    price: 22.00,
    base_price: 22.00,
    bio: 'DeFi strategies, research, and educational content',
    is_active: true
  },
  {
    twitter_handle: 'LightCrypto',
    display_name: 'LightCrypto',
    follower_count: 125000,
    tier: 'B',
    price: 18.00,
    base_price: 18.00,
    bio: 'Data-driven market analysis and early trend identification',
    is_active: true
  },
  {
    twitter_handle: 'Frxresearch',
    display_name: 'FRX Research',
    follower_count: 24000,
    tier: 'C',
    price: 12.00,
    base_price: 12.00,
    bio: 'Daily market content and clear market takes',
    is_active: true
  },

  // Additional high-value accounts
  {
    twitter_handle: 'intocryptoverse',
    display_name: 'Benjamin Cowen',
    follower_count: 820000,
    tier: 'A',
    price: 22.00,
    base_price: 22.00,
    bio: 'Data-driven crypto analysis, YouTube educator',
    is_active: true
  },
  {
    twitter_handle: 'econoar',
    display_name: 'Eric Conner',
    follower_count: 320000,
    tier: 'B',
    price: 18.00,
    base_price: 18.00,
    bio: 'Ethereum core developer, co-host Into the Ether podcast',
    is_active: true
  },
  {
    twitter_handle: 'MessariCrypto',
    display_name: 'Messari',
    follower_count: 480000,
    tier: 'A',
    price: 22.00,
    base_price: 22.00,
    bio: 'Crypto research and data intelligence platform',
    is_active: true
  },
  {
    twitter_handle: 'CoinGecko',
    display_name: 'CoinGecko',
    follower_count: 1400000,
    tier: 'S',
    price: 28.00,
    base_price: 28.00,
    bio: 'Leading crypto data aggregator and market tracker',
    is_active: true
  },
  {
    twitter_handle: 'santimentfeed',
    display_name: 'Santiment',
    follower_count: 170000,
    tier: 'B',
    price: 18.00,
    base_price: 18.00,
    bio: 'On-chain and social metrics for crypto markets',
    is_active: true
  },
  {
    twitter_handle: 'glassnode',
    display_name: 'Glassnode',
    follower_count: 580000,
    tier: 'A',
    price: 22.00,
    base_price: 22.00,
    bio: 'On-chain market intelligence and analytics',
    is_active: true
  }
];

async function addMissingInfluencers() {
  console.log('🚀 Adding missing CT influencers...\n');

  for (const influencer of missingInfluencers) {
    try {
      // Check if already exists
      const existing = await db('influencers')
        .where({ twitter_handle: influencer.twitter_handle })
        .first();

      if (existing) {
        console.log(`⏭️  Skipping ${influencer.display_name} (@${influencer.twitter_handle}) - already exists`);
        continue;
      }

      // Insert new influencer
      await db('influencers').insert({
        ...influencer,
        engagement_rate: 0,
        daily_tweets: 0,
        draft_score: 0,
        form_score: 0,
        total_points: 0,
        avatar_url: null,
        last_scraped_at: null,
        created_at: new Date(),
        updated_at: new Date()
      });

      console.log(`✅ Added ${influencer.display_name} (@${influencer.twitter_handle}) - ${influencer.tier} tier, ${influencer.follower_count.toLocaleString()} followers`);
    } catch (error) {
      console.error(`❌ Error adding ${influencer.display_name}:`, error);
    }
  }

  console.log('\n✨ Done! Missing influencers added.');

  // Show updated count
  const count = await db('influencers').count('* as count').first();
  console.log(`\n📊 Total influencers in database: ${count?.count}`);

  process.exit(0);
}

addMissingInfluencers().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
