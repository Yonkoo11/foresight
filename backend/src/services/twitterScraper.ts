import axios from 'axios';
import db from '../utils/db';

/**
 * Twitter Scraper Service
 * Scrapes top 100 CT influencers every 15 minutes
 */

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || '';
const SCRAPE_INTERVAL = 15 * 60 * 1000; // 15 minutes

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  profile_image_url: string;
  description: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

/**
 * Fetch user data from Twitter API
 */
async function fetchTwitterUser(username: string): Promise<TwitterUser | null> {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
        params: {
          'user.fields': 'description,profile_image_url,public_metrics',
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch Twitter user ${username}:`, error);
    return null;
  }
}

/**
 * Fetch recent tweets from a user
 */
async function fetchUserTweets(userId: string, sinceDate: Date): Promise<Tweet[]> {
  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/${userId}/tweets`,
      {
        headers: {
          Authorization: `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
        params: {
          max_results: 100,
          start_time: sinceDate.toISOString(),
          'tweet.fields': 'created_at,public_metrics',
          exclude: 'retweets,replies', // Only original tweets
        },
      }
    );

    return response.data.data || [];
  } catch (error) {
    console.error(`Failed to fetch tweets for user ${userId}:`, error);
    return [];
  }
}

/**
 * Calculate engagement rate from tweets
 */
function calculateEngagementRate(tweets: Tweet[], followerCount: number): number {
  if (tweets.length === 0 || followerCount === 0) return 0;

  const totalEngagement = tweets.reduce((sum, tweet) => {
    const engagement =
      tweet.public_metrics.like_count +
      tweet.public_metrics.retweet_count +
      tweet.public_metrics.reply_count +
      tweet.public_metrics.quote_count;
    return sum + engagement;
  }, 0);

  const avgEngagement = totalEngagement / tweets.length;
  const engagementRate = (avgEngagement / followerCount) * 100;

  return Math.round(engagementRate * 100) / 100; // Round to 2 decimals
}

/**
 * Scrape a single influencer
 */
async function scrapeInfluencer(influencer: any): Promise<void> {
  console.log(`Scraping ${influencer.handle}...`);

  // Fetch user data
  const twitterUser = await fetchTwitterUser(influencer.handle);

  if (!twitterUser) {
    console.error(`Failed to fetch data for ${influencer.handle}`);
    return;
  }

  // Fetch tweets from last 24 hours
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const tweets = await fetchUserTweets(twitterUser.id, yesterday);

  // Calculate metrics
  const followerCount = twitterUser.public_metrics.followers_count;
  const dailyTweets = tweets.length;
  const engagementRate = calculateEngagementRate(tweets, followerCount);

  // Update influencer in database
  await db.raw(
    `UPDATE influencers
     SET name = $1,
         avatar_url = $2,
         bio = $3,
         follower_count = $4
     WHERE id = $5`,
    [twitterUser.name, twitterUser.profile_image_url, twitterUser.description, followerCount, influencer.id]
  );

  console.log(
    `✅ Updated ${influencer.handle}: ${followerCount} followers, ${dailyTweets} tweets, ${engagementRate}% engagement`
  );
}

/**
 * Scrape all influencers
 */
export async function scrapeAllInfluencers(): Promise<void> {
  console.log('========================================');
  console.log('Twitter Scraper Starting');
  console.log('========================================');

  if (!TWITTER_BEARER_TOKEN) {
    console.error('❌ TWITTER_BEARER_TOKEN not set. Skipping scrape.');
    return;
  }

  try {
    // Get all influencers
    const result = await db.raw('SELECT * FROM influencers ORDER BY id ASC');
    const influencers = result.rows;

    console.log(`Scraping ${influencers.length} influencers...`);

    // Scrape in batches to avoid rate limits
    const BATCH_SIZE = 5;
    const BATCH_DELAY = 60000; // 1 minute between batches

    for (let i = 0; i < influencers.length; i += BATCH_SIZE) {
      const batch = influencers.slice(i, i + BATCH_SIZE);

      console.log(`\nBatch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(influencers.length / BATCH_SIZE)}`);

      // Process batch in parallel
      await Promise.all(batch.map((inf: any) => scrapeInfluencer(inf)));

      // Wait before next batch (except for last batch)
      if (i + BATCH_SIZE < influencers.length) {
        console.log(`Waiting ${BATCH_DELAY / 1000}s before next batch...`);
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    }

    console.log('\n========================================');
    console.log('✅ Twitter Scraper Complete');
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Twitter scraper failed:', error);
  }
}

/**
 * Start scraper with interval
 */
export function startTwitterScraper(): void {
  console.log('🐦 Twitter Scraper initialized');
  console.log(`Scraping every ${SCRAPE_INTERVAL / 60000} minutes\n`);

  // Run immediately
  scrapeAllInfluencers();

  // Run on interval
  setInterval(scrapeAllInfluencers, SCRAPE_INTERVAL);
}
