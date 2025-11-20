import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { runDraftScoringCycle } from '../services/draftScoring';
import { scrapeAllInfluencers } from '../services/twitterScraper';
import { emitDraftScoresUpdated, emitLeaderboardUpdated } from '../services/websocket';

const router = Router();

/**
 * @route POST /api/admin/trigger-draft-scoring
 * @desc Manually trigger draft scoring cycle (for testing)
 */
router.post('/trigger-draft-scoring', authenticate, async (req: Request, res: Response) => {
  try {
    console.log('🎯 Manual draft scoring triggered by:', req.user?.address);

    await runDraftScoringCycle();
    emitDraftScoresUpdated();
    emitLeaderboardUpdated('draft');

    res.json({
      success: true,
      message: 'Draft scoring cycle completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Failed to run draft scoring:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run draft scoring',
      details: error.message,
    });
  }
});

/**
 * @route POST /api/admin/trigger-twitter-scrape
 * @desc Manually trigger Twitter scraping (for testing)
 */
router.post('/trigger-twitter-scrape', authenticate, async (req: Request, res: Response) => {
  try {
    console.log('🎯 Manual Twitter scrape triggered by:', req.user?.address);

    await scrapeAllInfluencers();

    res.json({
      success: true,
      message: 'Twitter scraping completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Failed to scrape Twitter:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scrape Twitter',
      details: error.message,
    });
  }
});

/**
 * @route GET /api/admin/cron-status
 * @desc Get status of all cron jobs
 */
router.get('/cron-status', authenticate, async (req: Request, res: Response) => {
  try {
    const status = {
      draftScoring: {
        schedule: 'Every 3 minutes (TESTING)',
        production: 'Daily at 00:00 UTC',
        lastRun: null, // TODO: Track last run time
      },
      twitterScraper: {
        schedule: 'Every 15 minutes',
        lastRun: null,
      },
    };

    res.json({ success: true, status });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to get cron status',
    });
  }
});

export default router;
