import cron from 'node-cron';
import { scrapeAllInfluencers } from './twitterScraper';
import { runDraftScoringCycle } from './draftScoring';
import { resolveArenaDuels, resolveGauntletPredictions } from './oracleKeeper';
import { emitDraftScoresUpdated, emitLeaderboardUpdated } from './websocket';

/**
 * Cron Job Manager
 * Schedules and manages all periodic tasks
 */

/**
 * Initialize all cron jobs
 */
export function initializeCronJobs(): void {
  console.log('========================================');
  console.log('Initializing Cron Jobs');
  console.log('========================================\n');

  // 1. Twitter Scraper - Every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('[CRON] Running Twitter Scraper...');
    await scrapeAllInfluencers();
  });
  console.log('✅ Twitter Scraper: Every 15 minutes');

  // 2. Draft Scoring - Every 3 minutes (TESTING MODE)
  // Production: '0 0 * * *' (daily at midnight UTC)
  cron.schedule('*/3 * * * *', async () => {
    console.log('[CRON] Running Draft Scoring Cycle...');
    await runDraftScoringCycle();
    emitDraftScoresUpdated();
    emitLeaderboardUpdated('draft');
  });
  console.log('✅ Draft Scoring: Every 3 minutes (TESTING MODE)');

  // 3. Oracle Keeper - DISABLED (Arena/Gauntlet not implemented yet)
  // cron.schedule('*/5 * * * *', async () => {
  //   console.log('[CRON] Running Oracle Keeper...');
  //   await resolveArenaDuels();
  //   await resolveGauntletPredictions();
  // });
  console.log('⏸️  Oracle Keeper: Disabled (Arena/Gauntlet modes)');

  // 4. Leaderboard Updates - DISABLED (other game modes not active)
  // cron.schedule('0 * * * *', async () => {
  //   console.log('[CRON] Updating Leaderboards...');
  //   emitLeaderboardUpdated('arena');
  //   emitLeaderboardUpdated('gauntlet');
  //   emitLeaderboardUpdated('whisperer');
  // });
  console.log('⏸️  Leaderboard Updates: Disabled (other game modes)');

  // 5. Database Cleanup - Daily at 3 AM UTC
  cron.schedule('0 3 * * *', async () => {
    console.log('[CRON] Running Database Cleanup...');
    await cleanupExpiredSessions();
  });
  console.log('✅ Database Cleanup: Daily at 03:00 UTC');

  console.log('\n========================================');
  console.log('All Cron Jobs Initialized');
  console.log('========================================\n');
}

/**
 * Cleanup expired sessions
 */
async function cleanupExpiredSessions(): Promise<void> {
  const db = (await import('../utils/db')).default;

  try {
    const result = await db.raw(
      'DELETE FROM auth_sessions WHERE expires_at < NOW()'
    );

    console.log(`🧹 Cleaned up ${result.rowCount || 0} expired sessions`);
  } catch (error) {
    console.error('Failed to cleanup sessions:', error);
  }
}

/**
 * Get cron job status
 */
export function getCronJobsStatus(): any[] {
  return [
    {
      name: 'Twitter Scraper',
      schedule: 'Every 15 minutes',
      cron: '*/15 * * * *',
      status: 'active',
    },
    {
      name: 'Draft Scoring',
      schedule: 'Daily at 00:00 UTC',
      cron: '0 0 * * *',
      status: 'active',
    },
    {
      name: 'Oracle Keeper',
      schedule: 'Every 5 minutes',
      cron: '*/5 * * * *',
      status: 'disabled',
      reason: 'Arena/Gauntlet modes not active',
    },
    {
      name: 'Leaderboard Updates',
      schedule: 'Every hour',
      cron: '0 * * * *',
      status: 'disabled',
      reason: 'Other game modes not active',
    },
    {
      name: 'Database Cleanup',
      schedule: 'Daily at 03:00 UTC',
      cron: '0 3 * * *',
      status: 'active',
    },
  ];
}
