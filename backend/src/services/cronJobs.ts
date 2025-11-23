import cron from 'node-cron';
import { runFantasyScoringCycle } from './fantasyScoringService';
import twitterApiService from './twitterApiService';

/**
 * Cron Job Manager for Fantasy League
 * Schedules automated scoring and maintenance tasks
 */

/**
 * Initialize all cron jobs
 */
export function initializeCronJobs(): void {
  console.log('\n========================================');
  console.log('Initializing Cron Jobs');
  console.log('========================================\n');

  // 1. Fantasy Scoring - Every 5 minutes (TESTING MODE)
  // Production: '0 0 * * *' (daily at midnight UTC)
  // Alternative: '0 */6 * * *' (every 6 hours)
  // Gameweek: Monday 00:00 UTC to Sunday 23:59 UTC
  // Final scores locked Monday 00:01 UTC (1 minute after gameweek ends)
  cron.schedule('*/5 * * * *', async () => {
    console.log('\n[CRON] Running Fantasy Scoring Cycle...');
    try {
      await runFantasyScoringCycle();
    } catch (error) {
      console.error('[CRON] Fantasy scoring failed:', error);
    }
  });
  console.log('✅ Fantasy Scoring: Every 5 minutes (TESTING MODE)');
  console.log('   Production schedule: Daily at 00:00 UTC');
  console.log('   Gameweek runs Monday-Sunday, scores finalized Monday 00:01 UTC');

  // 2. Database Cleanup - Daily at 3 AM UTC
  cron.schedule('0 3 * * *', async () => {
    console.log('\n[CRON] Running Database Cleanup...');
    try {
      await cleanupExpiredSessions();
      await cleanupOldScoreHistory();
    } catch (error) {
      console.error('[CRON] Database cleanup failed:', error);
    }
  });
  console.log('✅ Database Cleanup: Daily at 03:00 UTC');

  // 3. Contest Management - Daily at midnight UTC
  cron.schedule('0 0 * * *', async () => {
    console.log('\n[CRON] Running Contest Management...');
    try {
      await checkContestEndDates();
      await createUpcomingContests();
    } catch (error) {
      console.error('[CRON] Contest management failed:', error);
    }
  });
  console.log('✅ Contest Management: Daily at 00:00 UTC');

  // 4. Influencer Metrics Update - Daily at 4 AM UTC
  cron.schedule('0 4 * * *', async () => {
    console.log('\n[CRON] Running Influencer Metrics Update...');
    try {
      if (twitterApiService.isConfigured()) {
        await twitterApiService.batchUpdateInfluencers(50);
        console.log('✅ Metrics update complete via Twitter API');
      } else {
        console.log('⚠️  Twitter API not configured. Skipping metrics update.');
        console.log('   Set TWITTER_BEARER_TOKEN in .env to enable automatic updates.');
      }
    } catch (error) {
      console.error('[CRON] Influencer metrics update failed:', error);
    }
  });
  console.log('✅ Influencer Metrics: Daily at 04:00 UTC');

  console.log('\n========================================');
  console.log('All Cron Jobs Initialized');
  console.log('========================================\n');
}

/**
 * Cleanup expired authentication sessions
 */
async function cleanupExpiredSessions(): Promise<void> {
  const db = (await import('../utils/db')).default;

  try {
    const result = await db('auth_sessions')
      .where('expires_at', '<', db.fn.now())
      .del();

    console.log(`🧹 Cleaned up ${result} expired sessions`);
  } catch (error) {
    console.error('Failed to cleanup sessions:', error);
  }
}

/**
 * Cleanup old score history (keep last 90 days)
 */
async function cleanupOldScoreHistory(): Promise<void> {
  const db = (await import('../utils/db')).default;

  try {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const result = await db('influencer_scores')
      .where('score_date', '<', ninetyDaysAgo)
      .del();

    console.log(`🧹 Cleaned up ${result} old score records (>90 days)`);
  } catch (error) {
    console.error('Failed to cleanup score history:', error);
  }
}

/**
 * Check and update contest statuses based on end dates
 * Also manages team locking/unlocking
 */
async function checkContestEndDates(): Promise<void> {
  const db = (await import('../utils/db')).default;

  try {
    const today = new Date().toISOString().split('T')[0];

    // End active contests that have passed their end date
    const endedContests = await db('fantasy_contests')
      .where('status', 'active')
      .where('end_date', '<', today)
      .select('id');

    if (endedContests.length > 0) {
      // Mark contests as completed
      await db('fantasy_contests')
        .whereIn('id', endedContests.map(c => c.id))
        .update({
          status: 'completed',
          updated_at: db.fn.now(),
        });

      // Unlock all teams from completed contests (allow changes for next gameweek)
      const unlockedCount = await db('user_teams')
        .whereIn('contest_id', endedContests.map(c => c.id))
        .update({
          is_locked: false,
          updated_at: db.fn.now(),
        });

      console.log(`🏁 Ended ${endedContests.length} contest(s), unlocked ${unlockedCount} team(s)`);
    }

    // Activate upcoming contests that have reached their start date
    const startingContests = await db('fantasy_contests')
      .where('status', 'upcoming')
      .where('start_date', '<=', today)
      .select('id');

    if (startingContests.length > 0) {
      // Activate contests
      await db('fantasy_contests')
        .whereIn('id', startingContests.map(c => c.id))
        .update({
          status: 'active',
          updated_at: db.fn.now(),
        });

      // Lock all teams in starting contests (FPL-style: no changes during gameweek)
      const lockedCount = await db('user_teams')
        .whereIn('contest_id', startingContests.map(c => c.id))
        .update({
          is_locked: true,
          updated_at: db.fn.now(),
        });

      console.log(`🚀 Activated ${startingContests.length} contest(s), locked ${lockedCount} team(s) for gameweek`);
    }
  } catch (error) {
    console.error('Failed to check contest end dates:', error);
  }
}

/**
 * Create upcoming weekly contests (Monday to Sunday)
 */
async function createUpcomingContests(): Promise<void> {
  const db = (await import('../utils/db')).default;

  try {
    // Find next Monday
    const today = new Date();
    const nextMonday = new Date(today);
    const daysUntilMonday = (8 - today.getDay()) % 7 || 7; // Days until next Monday
    nextMonday.setDate(today.getDate() + daysUntilMonday + 7); // Next week's Monday
    nextMonday.setHours(0, 0, 0, 0);

    // Sunday is 6 days after Monday
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextMonday.getDate() + 6);
    nextSunday.setHours(23, 59, 59, 999);

    // Check if contest already exists for this period
    const existing = await db('fantasy_contests')
      .where('start_date', nextMonday.toISOString().split('T')[0])
      .first();

    if (!existing) {
      // Calculate week number
      const weekNumber = Math.ceil(
        (nextMonday.getTime() - new Date(nextMonday.getFullYear(), 0, 1).getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );

      await db('fantasy_contests').insert({
        contest_key: `week_${weekNumber}_${nextMonday.getFullYear()}`,
        start_date: nextMonday.toISOString().split('T')[0],
        end_date: nextSunday.toISOString().split('T')[0],
        status: 'upcoming',
        total_participants: 0,
        max_participants: 1000,
        is_prize_league: false,
        entry_fee: 0.000,
        prize_pool: 0.000,
        prize_distribution: {
          '1': 40,
          '2': 25,
          '3': 15,
          '4': 5,
          '5': 5,
          '6-10': 2,
        },
        created_at: db.fn.now(),
        updated_at: db.fn.now(),
      });

      console.log(`📅 Created new upcoming contest for Week ${weekNumber} (Mon ${nextMonday.toISOString().split('T')[0]} - Sun ${nextSunday.toISOString().split('T')[0]})`);
    }
  } catch (error) {
    console.error('Failed to create upcoming contests:', error);
  }
}

/**
 * Get cron job status for monitoring
 */
export function getCronJobsStatus(): any[] {
  return [
    {
      name: 'Fantasy Scoring',
      schedule: 'Every 5 minutes (TEST) / Daily at 00:00 UTC (PROD)',
      cron: '*/5 * * * * (TEST) / 0 0 * * * (PROD)',
      status: 'active',
      description: 'Calculate team scores and rankings',
    },
    {
      name: 'Database Cleanup',
      schedule: 'Daily at 03:00 UTC',
      cron: '0 3 * * *',
      status: 'active',
      description: 'Remove expired sessions and old data',
    },
    {
      name: 'Contest Management',
      schedule: 'Daily at 00:00 UTC',
      cron: '0 0 * * *',
      status: 'active',
      description: 'Update contest statuses and create upcoming contests',
    },
  ];
}

/**
 * Manual trigger for fantasy scoring (for testing/admin)
 */
export async function triggerFantasyScoring(): Promise<void> {
  console.log('[MANUAL TRIGGER] Running Fantasy Scoring Cycle...');
  await runFantasyScoringCycle();
}
