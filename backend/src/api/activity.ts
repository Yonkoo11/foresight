/**
 * Activity Feed API
 * Public feed of user activities for social proof
 */

import express, { Request, Response } from 'express';
import { authenticate as authenticateToken } from '../middleware/auth';
import activityFeedService from '../services/activityFeedService';
import { sendSuccess } from '../utils/response';
import logger from '../utils/logger';

const router = express.Router();

/**
 * Get global activity feed (public activities)
 * GET /api/activity/feed
 */
router.get('/feed', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = parseInt(req.query.offset as string) || 0;

    const activities = await activityFeedService.getGlobalFeed(limit, offset);

    sendSuccess(res, activities);
  } catch (error: any) {
    logger.error('Error fetching activity feed', error, { context: 'Activity' });
    res.status(500).json({ success: false, error: 'Failed to fetch activity feed' });
  }
});

/**
 * Get current user's activity feed
 * GET /api/activity/me
 */
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 50);
    const offset = parseInt(req.query.offset as string) || 0;

    const activities = await activityFeedService.getUserFeed(userId, limit, offset);

    sendSuccess(res, activities);
  } catch (error: any) {
    logger.error('Error fetching user activity', error, { context: 'Activity' });
    res.status(500).json({ success: false, error: 'Failed to fetch user activity' });
  }
});

export default router;
