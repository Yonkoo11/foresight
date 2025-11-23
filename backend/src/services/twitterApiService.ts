/**
 * Twitter API Service
 * Uses Twitter API v2 Free Tier (1,500 reads/month = 50 reads/day)
 * Strategic usage: Update 10-20 influencers per day
 */

import axios from 'axios';
import db from '../utils/db';

interface TwitterUserMetrics {
  id: string;
  username: string;
  name: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
}

interface TwitterUser extends TwitterUserMetrics {
  profile_image_url?: string;
  description?: string;
}

interface InfluencerRecord {
  id: number;
  twitter_handle: string;
}

export class TwitterApiService {
  private bearerToken: string;
  private baseUrl = 'https://api.twitter.com/2';

  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || '';
    if (!this.bearerToken) {
      console.warn('⚠️  TWITTER_BEARER_TOKEN not set. Twitter API features disabled.');
    }
  }

  /**
   * Check if Twitter API is configured
   */
  isConfigured(): boolean {
    return !!this.bearerToken;
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<TwitterUser | null> {
    if (!this.isConfigured()) {
      console.error('Twitter API not configured');
      return null;
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/users/by/username/${username}`,
        {
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
          },
          params: {
            'user.fields': 'public_metrics,description,profile_image_url',
          },
        }
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Twitter API error for @${username}:`, error.response?.data);
      }
      return null;
    }
  }

  /**
   * Get multiple users (batch request - counts as 1 API call!)
   * This is the key to making free tier work
   */
  async getUsersByUsernames(usernames: string[]): Promise<TwitterUser[]> {
    if (!this.isConfigured()) {
      console.error('Twitter API not configured');
      return [];
    }

    if (usernames.length === 0 || usernames.length > 100) {
      throw new Error('Must provide 1-100 usernames');
    }

    try {
      const response = await axios.get(`${this.baseUrl}/users/by`, {
        headers: {
          Authorization: `Bearer ${this.bearerToken}`,
        },
        params: {
          usernames: usernames.join(','),
          'user.fields': 'public_metrics,description,profile_image_url',
        },
      });

      return response.data.data || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Twitter API batch error:', error.response?.data);
      }
      return [];
    }
  }

  /**
   * Update influencer metrics from Twitter API
   */
  async updateInfluencerMetrics(influencerId: number, username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return false;
    }

    try {
      const metrics = user.public_metrics;

      // Store in history table
      await db('influencer_metrics').insert({
        influencer_id: influencerId,
        follower_count: metrics.followers_count,
        following_count: metrics.following_count,
        tweet_count: metrics.tweet_count,
        engagement_rate: 0, // Will calculate from recent tweets
        scraped_at: new Date(),
        source: 'twitter_api',
      });

      // Update influencers table
      await db('influencers')
        .where({ id: influencerId })
        .update({
          follower_count: metrics.followers_count,
          last_scraped_at: new Date(),
          updated_at: new Date(),
        });

      console.log(`✅ Updated @${username}: ${metrics.followers_count} followers`);
      return true;
    } catch (error) {
      console.error(`Error updating metrics for @${username}:`, error);
      return false;
    }
  }

  /**
   * Batch update influencers (MORE EFFICIENT - uses 1 API call per 100 users)
   * This is the key to staying within free tier limits
   */
  async batchUpdateInfluencers(limit: number = 50): Promise<void> {
    if (!this.isConfigured()) {
      console.error('Twitter API not configured. Cannot update influencers.');
      return;
    }

    try {
      // Get influencers that need updating (oldest first)
      const influencers: InfluencerRecord[] = await db('influencers')
        .where({ is_active: true })
        .select('id', 'twitter_handle')
        .orderByRaw('COALESCE(last_scraped_at, \'1970-01-01\'::timestamp) ASC')
        .limit(limit);

      if (influencers.length === 0) {
        console.log('No influencers to update');
        return;
      }

      console.log(`\n🚀 Updating ${influencers.length} influencers via Twitter API...\n`);

      // Batch them in groups of 100 (API limit)
      const batches: InfluencerRecord[][] = [];
      for (let i = 0; i < influencers.length; i += 100) {
        batches.push(influencers.slice(i, i + 100));
      }

      let successful = 0;
      let failed = 0;

      for (const batch of batches) {
        const usernames = batch.map((inf) => inf.twitter_handle);

        console.log(`Fetching batch of ${usernames.length} users...`);
        const users = await this.getUsersByUsernames(usernames);

        // Create a map of username -> data
        const userMap = new Map(
          users.map((user) => [user.username.toLowerCase(), user])
        );

        // Update database
        for (const influencer of batch) {
          const user = userMap.get(influencer.twitter_handle.toLowerCase());

          if (user) {
            try {
              const metrics = user.public_metrics;

              // Store in history
              await db('influencer_metrics').insert({
                influencer_id: influencer.id,
                follower_count: metrics.followers_count,
                following_count: metrics.following_count,
                tweet_count: metrics.tweet_count,
                engagement_rate: 0,
                scraped_at: new Date(),
                source: 'twitter_api',
              });

              // Update current data
              await db('influencers')
                .where({ id: influencer.id })
                .update({
                  follower_count: metrics.followers_count,
                  last_scraped_at: new Date(),
                  updated_at: new Date(),
                });

              console.log(`  ✅ @${influencer.twitter_handle}: ${metrics.followers_count} followers`);
              successful++;
            } catch (error) {
              console.error(`  ❌ Error saving @${influencer.twitter_handle}:`, error);
              failed++;
            }
          } else {
            console.warn(`  ⚠️  @${influencer.twitter_handle}: not found`);
            failed++;
          }
        }

        // Rate limiting between batches
        if (batches.length > 1) {
          await this.sleep(2000);
        }
      }

      console.log(`\n✅ Update complete: ${successful} successful, ${failed} failed`);
      console.log(`📊 API calls used: ${batches.length} (out of ~50 daily limit)\n`);
    } catch (error) {
      console.error('Error in batchUpdateInfluencers:', error);
      throw error;
    }
  }

  /**
   * Get API usage info (helpful for monitoring)
   */
  getRateLimitInfo(): string {
    return `
Twitter API Free Tier Limits:
- 1,500 reads/month = ~50 reads/day
- Batch requests (100 users) count as 1 read
- Current strategy: Update 50 influencers/day = 1 API call/day
- This leaves 49 calls for ad-hoc updates!
    `.trim();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new TwitterApiService();
