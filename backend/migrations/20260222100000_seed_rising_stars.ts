/**
 * Seed Rising Stars Data
 *
 * Populates the rising_stars table with initial accounts for the demo.
 * These are fictional rising CT accounts with realistic growth metrics.
 */
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const risingStars = [
    {
      twitter_handle: 'sol_sensei',
      name: 'Sol Sensei',
      bio: 'Solana alpha hunter. DeFi degen since 2021. Not financial advice.',
      followers_count: 18500,
      followers_7d_ago: 14200,
      follower_growth_rate: 30.28,
      avg_likes_per_tweet: 842,
      avg_retweets_per_tweet: 156,
      viral_tweet_count: 3,
      discovery_source: 'engagement_spike',
      status: 'discovered',
    },
    {
      twitter_handle: 'onchain_oracle',
      name: 'On-Chain Oracle',
      bio: 'Tracking smart money on Solana. Data-driven takes only.',
      followers_count: 12400,
      followers_7d_ago: 9800,
      follower_growth_rate: 26.53,
      avg_likes_per_tweet: 634,
      avg_retweets_per_tweet: 201,
      viral_tweet_count: 2,
      discovery_source: 'growth_rate',
      status: 'discovered',
    },
    {
      twitter_handle: 'defi_detective',
      name: 'DeFi Detective',
      bio: 'Uncovering the next 100x. Deep dives into protocols nobody\'s talking about.',
      followers_count: 8900,
      followers_7d_ago: 6100,
      follower_growth_rate: 45.90,
      avg_likes_per_tweet: 1200,
      avg_retweets_per_tweet: 340,
      viral_tweet_count: 4,
      discovery_source: 'engagement_spike',
      status: 'discovered',
    },
    {
      twitter_handle: 'nft_navigator',
      name: 'NFT Navigator',
      bio: 'Finding gems in the Solana NFT space before the herd.',
      followers_count: 22100,
      followers_7d_ago: 19400,
      follower_growth_rate: 13.92,
      avg_likes_per_tweet: 520,
      avg_retweets_per_tweet: 89,
      viral_tweet_count: 1,
      discovery_source: 'growth_rate',
      status: 'under_review',
    },
    {
      twitter_handle: 'airdrop_alpha',
      name: 'Airdrop Alpha',
      bio: 'Never missed a major airdrop. Sharing strategies for free.',
      followers_count: 31200,
      followers_7d_ago: 24800,
      follower_growth_rate: 25.81,
      avg_likes_per_tweet: 1580,
      avg_retweets_per_tweet: 420,
      viral_tweet_count: 5,
      discovery_source: 'engagement_spike',
      status: 'discovered',
    },
    {
      twitter_handle: 'mev_maxi',
      name: 'MEV Maxi',
      bio: 'MEV researcher. Solana infra nerd. Building in public.',
      followers_count: 6700,
      followers_7d_ago: 4200,
      follower_growth_rate: 59.52,
      avg_likes_per_tweet: 380,
      avg_retweets_per_tweet: 112,
      viral_tweet_count: 2,
      discovery_source: 'growth_rate',
      status: 'discovered',
    },
    {
      twitter_handle: 'whale_watcher_sol',
      name: 'Whale Watcher',
      bio: 'Tracking the biggest wallets on Solana. Real-time alerts.',
      followers_count: 15600,
      followers_7d_ago: 12900,
      follower_growth_rate: 20.93,
      avg_likes_per_tweet: 710,
      avg_retweets_per_tweet: 195,
      viral_tweet_count: 2,
      discovery_source: 'engagement_spike',
      status: 'discovered',
    },
    {
      twitter_handle: 'ct_contrarian',
      name: 'CT Contrarian',
      bio: 'The take nobody wants to hear. Usually right.',
      followers_count: 9400,
      followers_7d_ago: 7100,
      follower_growth_rate: 32.39,
      avg_likes_per_tweet: 920,
      avg_retweets_per_tweet: 280,
      viral_tweet_count: 3,
      discovery_source: 'engagement_spike',
      status: 'discovered',
    },
  ];

  for (const star of risingStars) {
    // Check if already exists (idempotent)
    const existing = await knex('rising_stars')
      .where('twitter_handle', star.twitter_handle)
      .first();

    if (!existing) {
      await knex('rising_stars').insert({
        ...star,
        discovered_at: knex.fn.now(),
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      });
    }
  }

  console.log(`[Seed] Inserted ${risingStars.length} rising stars`);
}

export async function down(knex: Knex): Promise<void> {
  await knex('rising_stars').whereIn('twitter_handle', [
    'sol_sensei', 'onchain_oracle', 'defi_detective', 'nft_navigator',
    'airdrop_alpha', 'mev_maxi', 'whale_watcher_sol', 'ct_contrarian',
  ]).del();
}
