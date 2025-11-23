/**
 * Metrics Cron Service
 * Schedules regular updates of influencer metrics
 */

import { CronJob } from 'cron';
import twitterApiService from './twitterApiService';
import nitterScraper from './nitterScraper';

export class MetricsCronService {
  private jobs: CronJob[] = [];

  /**
   * Start all cron jobs
   */
  start() {
    console.log('🕐 Starting metrics cron jobs...');

    // Daily update at 3 AM UTC (update 50 influencers via Twitter API)
    const dailyUpdateJob = new CronJob(
      '0 3 * * *', // Every day at 3 AM
      async () => {
        console.log('\n⏰ Running daily influencer metrics update...');
        try {
          if (twitterApiService.isConfigured()) {
            await twitterApiService.batchUpdateInfluencers(50);
          } else {
            console.log('Twitter API not configured. Trying Nitter fallback...');
            await nitterScraper.updateAllInfluencers(10); // Try fewer with Nitter
          }
        } catch (error) {
          console.error('Error in daily metrics update:', error);
        }
      },
      null, // onComplete
      false, // Don't start automatically
      'UTC'
    );

    // Twice daily update (at noon and midnight) for top influencers
    const twiceDailyJob = new CronJob(
      '0 0,12 * * *', // Noon and midnight UTC
      async () => {
        console.log('\n⏰ Running priority influencer update...');
        try {
          if (twitterApiService.isConfigured()) {
            // Update only S-tier influencers (most important)
            await this.updateTopInfluencers(10);
          }
        } catch (error) {
          console.error('Error in priority update:', error);
        }
      },
      null,
      false,
      'UTC'
    );

    this.jobs.push(dailyUpdateJob);
    this.jobs.push(twiceDailyJob);

    // Start all jobs
    this.jobs.forEach((job) => job.start());

    console.log('✅ Metrics cron jobs started');
    console.log('  - Daily full update: 3 AM UTC');
    console.log('  - Priority update: 12 AM & 12 PM UTC');
  }

  /**
   * Stop all cron jobs
   */
  stop() {
    console.log('🛑 Stopping metrics cron jobs...');
    this.jobs.forEach((job) => job.stop());
    this.jobs = [];
  }

  /**
   * Update only top-tier influencers
   */
  private async updateTopInfluencers(limit: number) {
    // This would use Twitter API to update S-tier influencers
    // Implementation left as placeholder
    console.log(`Updating top ${limit} influencers...`);
  }

  /**
   * Run an immediate update (for testing/manual trigger)
   */
  async runNow() {
    console.log('\n🚀 Running immediate metrics update...');
    try {
      if (twitterApiService.isConfigured()) {
        await twitterApiService.batchUpdateInfluencers(50);
      } else {
        console.log('Twitter API not configured. Please set TWITTER_BEARER_TOKEN');
      }
    } catch (error) {
      console.error('Error in immediate update:', error);
      throw error;
    }
  }
}

export default new MetricsCronService();
