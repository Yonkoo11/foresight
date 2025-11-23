/**
 * Nitter Scraper Service
 * Scrapes Twitter metrics from Nitter instances (free, no auth required)
 * Implements multi-instance rotation for reliability
 */

import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import db from '../utils/db';

// Public Nitter instances (rotate for redundancy)
const NITTER_INSTANCES = [
  'https://nitter.net',
  'https://nitter.poast.org',
  'https://nitter.privacydev.net',
  'https://nitter.unixfox.eu',
  'https://nitter.woodland.cafe',
];

interface ScrapedMetrics {
  follower_count: number;
  following_count: number;
  tweet_count: number;
  likes_count: number;
  retweets_count: number;
  replies_count: number;
  engagement_rate: number;
}

export class NitterScraper {
  private currentInstanceIndex = 0;
  private failedInstances: Set<string> = new Set();

  /**
   * Get next working Nitter instance
   */
  private getNextInstance(): string | null {
    const availableInstances = NITTER_INSTANCES.filter(
      (instance) => !this.failedInstances.has(instance)
    );

    if (availableInstances.length === 0) {
      // Reset failed instances and try again
      this.failedInstances.clear();
      return NITTER_INSTANCES[0];
    }

    const instance = availableInstances[this.currentInstanceIndex % availableInstances.length];
    this.currentInstanceIndex++;
    return instance;
  }

  /**
   * Mark an instance as failed
   */
  private markInstanceFailed(instance: string) {
    this.failedInstances.add(instance);
    console.warn(`Marked Nitter instance as failed: ${instance}`);
  }

  /**
   * Scrape metrics for a single Twitter handle
   */
  async scrapeHandle(handle: string): Promise<ScrapedMetrics | null> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const instance = this.getNextInstance();
      if (!instance) {
        console.error('No available Nitter instances');
        break;
      }

      try {
        console.log(`[Attempt ${attempt + 1}/${maxRetries}] Scraping @${handle} from ${instance}`);

        const url = `${instance}/${handle}`;
        const response = await axios.get(url, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });

        const $ = cheerio.load(response.data);

        // Parse profile stats
        const followerText = $('.profile-stat[title*="Followers"]').first().text().trim();
        const followingText = $('.profile-stat[title*="Following"]').first().text().trim();
        const tweetText = $('.profile-stat[title*="Tweets"]').first().text().trim();

        const follower_count = this.parseCount(followerText);
        const following_count = this.parseCount(followingText);
        const tweet_count = this.parseCount(tweetText);

        // Parse recent tweets for engagement (last 10 tweets)
        let totalLikes = 0;
        let totalRetweets = 0;
        let totalReplies = 0;
        let tweetsParsed = 0;

        $('.timeline-item').slice(0, 10).each((i, el) => {
          const likes = $(el).find('.icon-heart').parent().text().trim();
          const retweets = $(el).find('.icon-retweet').parent().text().trim();
          const replies = $(el).find('.icon-comment').parent().text().trim();

          totalLikes += this.parseCount(likes);
          totalRetweets += this.parseCount(retweets);
          totalReplies += this.parseCount(replies);
          tweetsParsed++;
        });

        // Calculate engagement rate: (likes + retweets + replies) / (followers * tweets)
        const totalEngagement = totalLikes + totalRetweets + totalReplies;
        const engagement_rate = follower_count > 0 && tweetsParsed > 0
          ? parseFloat(((totalEngagement / (follower_count * tweetsParsed)) * 100).toFixed(2))
          : 0;

        return {
          follower_count,
          following_count,
          tweet_count,
          likes_count: totalLikes,
          retweets_count: totalRetweets,
          replies_count: totalReplies,
          engagement_rate,
        };
      } catch (error) {
        lastError = error as Error;

        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 404) {
            console.error(`Handle @${handle} not found on ${instance}`);
            return null; // Profile doesn't exist
          }
          if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
            console.warn(`Timeout for ${instance}, trying next instance...`);
            this.markInstanceFailed(instance);
            continue;
          }
        }

        console.error(`Error scraping @${handle} from ${instance}:`, error);
        this.markInstanceFailed(instance);
      }

      // Wait before retry
      await this.sleep(2000 * (attempt + 1));
    }

    console.error(`Failed to scrape @${handle} after ${maxRetries} attempts:`, lastError);
    return null;
  }

  /**
   * Parse count strings like "1.2M", "500K", "1,234" to numbers
   */
  private parseCount(text: string): number {
    const cleaned = text.replace(/[^0-9.KMB]/gi, '');
    const multipliers: { [key: string]: number } = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
    };

    const match = cleaned.match(/^([\d.]+)([KMB])?$/i);
    if (!match) return 0;

    const number = parseFloat(match[1]);
    const multiplier = match[2] ? multipliers[match[2].toUpperCase()] : 1;
    return Math.round(number * multiplier);
  }

  /**
   * Update metrics for an influencer
   */
  async updateInfluencerMetrics(influencerId: number, handle: string): Promise<boolean> {
    try {
      const metrics = await this.scrapeHandle(handle);
      if (!metrics) {
        console.error(`Failed to scrape metrics for @${handle}`);
        return false;
      }

      // Store metrics in history table
      await db('influencer_metrics').insert({
        influencer_id: influencerId,
        ...metrics,
        scraped_at: new Date(),
        source: 'nitter',
      });

      // Update current metrics in influencers table
      await db('influencers')
        .where({ id: influencerId })
        .update({
          follower_count: metrics.follower_count,
          engagement_rate: metrics.engagement_rate,
          last_scraped_at: new Date(),
          updated_at: new Date(),
        });

      console.log(`✅ Updated metrics for @${handle}: ${metrics.follower_count} followers, ${metrics.engagement_rate}% engagement`);
      return true;
    } catch (error) {
      console.error(`Error updating metrics for @${handle}:`, error);
      return false;
    }
  }

  /**
   * Update all active influencers
   */
  async updateAllInfluencers(limit?: number): Promise<void> {
    try {
      let query = db('influencers')
        .where({ is_active: true })
        .select('id', 'twitter_handle')
        .orderBy('last_scraped_at', 'asc') // Scrape oldest first
        .orderBy('id', 'asc');

      if (limit) {
        query = query.limit(limit);
      }

      const influencers = await query;

      console.log(`\n🚀 Starting scrape for ${influencers.length} influencers...\n`);

      let successful = 0;
      let failed = 0;

      for (const influencer of influencers) {
        const success = await this.updateInfluencerMetrics(
          influencer.id,
          influencer.twitter_handle
        );

        if (success) {
          successful++;
        } else {
          failed++;
        }

        // Rate limiting: wait between requests
        await this.sleep(3000); // 3 seconds between requests
      }

      console.log(`\n✅ Scraping complete: ${successful} successful, ${failed} failed\n`);
    } catch (error) {
      console.error('Error in updateAllInfluencers:', error);
      throw error;
    }
  }

  /**
   * Get metrics history for an influencer
   */
  async getMetricsHistory(
    influencerId: number,
    days: number = 30
  ): Promise<any[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return await db('influencer_metrics')
      .where('influencer_id', influencerId)
      .where('scraped_at', '>=', cutoffDate)
      .orderBy('scraped_at', 'asc');
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export default new NitterScraper();
