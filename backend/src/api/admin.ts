import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import db from '../utils/db';
import { triggerFantasyScoring, getCronJobsStatus } from '../services/cronJobs';
import twitterApiService from '../services/twitterApiService';

const router = Router();

/**
 * @route GET /api/admin/stats
 * @desc Get system statistics
 */
router.get('/stats', authenticate, async (req: Request, res: Response) => {
  try {
    const [users, teams, leagues, influencers] = await Promise.all([
      db('users').count('* as count').first(),
      db('user_teams').count('* as count').first(),
      db('private_leagues').count('* as count').first(),
      db('influencers').where({ is_active: true }).count('* as count').first(),
    ]);

    res.json({
      success: true,
      stats: {
        users: users?.count || 0,
        teams: teams?.count || 0,
        leagues: leagues?.count || 0,
        influencers: influencers?.count || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get stats',
    });
  }
});

/**
 * @route POST /api/admin/trigger-scoring
 * @desc Manually trigger fantasy league scoring (ADMIN ONLY)
 */
router.post('/trigger-scoring', authenticate, async (req: Request, res: Response) => {
  try {
    await triggerFantasyScoring();
    res.json({
      success: true,
      message: 'Fantasy scoring cycle triggered successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to trigger scoring',
      details: error.message,
    });
  }
});

/**
 * @route GET /api/admin/cron-status
 * @desc Get cron job status (ADMIN ONLY)
 */
router.get('/cron-status', authenticate, async (req: Request, res: Response) => {
  try {
    const jobs = getCronJobsStatus();
    res.json({
      success: true,
      jobs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get cron status',
    });
  }
});

/**
 * @route POST /api/admin/update-metrics
 * @desc Manually trigger influencer metrics update (ADMIN ONLY)
 */
router.post('/update-metrics', authenticate, async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.body;

    if (!twitterApiService.isConfigured()) {
      return res.status(400).json({
        success: false,
        error: 'Twitter API not configured. Set TWITTER_BEARER_TOKEN in .env',
      });
    }

    await twitterApiService.batchUpdateInfluencers(limit);

    res.json({
      success: true,
      message: `Updated metrics for ${limit} influencers`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to update metrics',
      details: error.message,
    });
  }
});

/**
 * @route GET /api/admin/metrics-status
 * @desc Get Twitter API configuration status and usage info
 */
router.get('/metrics-status', authenticate, async (req: Request, res: Response) => {
  try {
    const isConfigured = twitterApiService.isConfigured();
    const rateLimitInfo = twitterApiService.getRateLimitInfo();

    // Get last update time
    const lastUpdate = await db('influencers')
      .max('last_scraped_at as last_update')
      .first();

    // Get total influencers tracked
    const totalInfluencers = await db('influencers')
      .where({ is_active: true })
      .count('* as count')
      .first();

    // Get metrics from last 24 hours
    const recentMetrics = await db('influencer_metrics')
      .where('scraped_at', '>=', db.raw("NOW() - INTERVAL '24 hours'"))
      .count('* as count')
      .first();

    res.json({
      success: true,
      status: {
        apiConfigured: isConfigured,
        rateLimitInfo,
        lastUpdate: lastUpdate?.last_update,
        totalInfluencers: totalInfluencers?.count || 0,
        metricsLast24h: recentMetrics?.count || 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get metrics status',
    });
  }
});

/**
 * @route GET /api/admin/influencer-metrics/:id
 * @desc Get metrics history for an influencer (ADMIN ONLY)
 */
router.get('/influencer-metrics/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - Number(days));

    const metrics = await db('influencer_metrics')
      .where('influencer_id', id)
      .where('scraped_at', '>=', cutoffDate)
      .orderBy('scraped_at', 'asc');

    res.json({
      success: true,
      metrics,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get influencer metrics',
    });
  }
});

export default router;
