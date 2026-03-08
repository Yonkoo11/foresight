/**
 * Achievements API
 * Endpoints for fetching and managing user achievements
 */

import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUserAchievements,
  getAllAchievementsWithStatus,
} from '../services/achievementService';
import { sendSuccess } from '../utils/response';
import logger from '../utils/logger';

const router = express.Router();

/**
 * Get all achievements with unlock status for authenticated user
 * GET /api/achievements
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const achievements = await getAllAchievementsWithStatus(userId);

    // Group by category
    const grouped = achievements.reduce((acc: any, ach: any) => {
      if (!acc[ach.category]) {
        acc[ach.category] = [];
      }
      acc[ach.category].push(ach);
      return acc;
    }, {});

    sendSuccess(res, {
      achievements,
      grouped,
      total: achievements.length,
      unlocked: achievements.filter((a: any) => a.unlocked).length,
    });
  } catch (error: any) {
    logger.error('Error fetching achievements', error, { context: 'Achievements' });
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get user's unlocked achievements only
 * GET /api/achievements/unlocked
 */
router.get('/unlocked', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const achievements = await getUserAchievements(userId);

    sendSuccess(res, {
      achievements,
      count: achievements.length,
    });
  } catch (error: any) {
    logger.error('Error fetching unlocked achievements', error, { context: 'Achievements' });
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get achievements for a specific user (public)
 * GET /api/achievements/user/:userId
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const achievements = await getUserAchievements(userId);

    sendSuccess(res, {
      achievements,
      count: achievements.length,
    });
  } catch (error: any) {
    logger.error('Error fetching user achievements', error, { context: 'Achievements' });
    res.status(500).json({ error: error.message });
  }
});

export default router;
