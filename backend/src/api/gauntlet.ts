import { Router, Request, Response } from 'express';
import db from '../utils/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router: Router = Router();

/**
 * GET /api/gauntlet/today
 * Get today's gauntlet
 */
router.get(
  '/today',
  asyncHandler(async (req: Request, res: Response) => {
    const today = new Date().toISOString().split('T')[0];

    const gauntlet = await db('gauntlet_days')
      .where({ date: today })
      .first();

    if (!gauntlet) {
      return res.json({ gauntlet: null });
    }

    // Get predictions for this gauntlet
    const predictions = await db('gauntlet_predictions')
      .where({ gauntlet_day_id: gauntlet.id })
      .orderBy('chain_prediction_id', 'asc');

    res.json({
      gauntlet: {
        ...gauntlet,
        predictions,
      },
    });
  })
);

/**
 * GET /api/gauntlet/days/:date
 * Get gauntlet by date
 */
router.get(
  '/days/:date',
  asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.params;

    const gauntlet = await db('gauntlet_days')
      .where({ date })
      .first();

    if (!gauntlet) {
      throw new AppError('Gauntlet not found for this date', 404);
    }

    const predictions = await db('gauntlet_predictions')
      .where({ gauntlet_day_id: gauntlet.id })
      .orderBy('chain_prediction_id', 'asc');

    res.json({
      gauntlet: {
        ...gauntlet,
        predictions,
      },
    });
  })
);

/**
 * GET /api/gauntlet/user/:walletAddress/entry/:date
 * Get user's entry for a specific date
 */
router.get(
  '/user/:walletAddress/entry/:date',
  asyncHandler(async (req: Request, res: Response) => {
    const { walletAddress, date } = req.params;

    const user = await db('users')
      .where({ wallet_address: walletAddress.toLowerCase() })
      .first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const gauntlet = await db('gauntlet_days')
      .where({ date })
      .first();

    if (!gauntlet) {
      throw new AppError('Gauntlet not found', 404);
    }

    const entry = await db('gauntlet_entries')
      .where({
        user_id: user.id,
        gauntlet_day_id: gauntlet.id,
      })
      .first();

    if (!entry) {
      return res.json({ entry: null });
    }

    res.json({ entry });
  })
);

/**
 * GET /api/gauntlet/user/:walletAddress/stats
 * Get user gauntlet stats
 */
router.get(
  '/user/:walletAddress/stats',
  asyncHandler(async (req: Request, res: Response) => {
    const { walletAddress } = req.params;

    const user = await db('users')
      .where({ wallet_address: walletAddress.toLowerCase() })
      .first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const stats = await db('gauntlet_results')
      .where({ user_id: user.id })
      .first();

    if (!stats) {
      return res.json({
        stats: {
          daysParticipated: 0,
          totalPredictions: 0,
          totalCorrect: 0,
          accuracy: 0,
          perfectDays: 0,
          totalStaked: '0',
          totalWinnings: '0',
          netProfit: '0',
          currentStreak: 0,
          bestStreak: 0,
        },
      });
    }

    res.json({ stats });
  })
);

/**
 * GET /api/gauntlet/leaderboard
 * Get gauntlet leaderboard
 */
router.get(
  '/leaderboard',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;
    const sortBy = (req.query.sortBy as string) || 'accuracy';

    const validSortColumns = ['accuracy', 'perfect_days', 'net_profit'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'accuracy';

    const results = await db('gauntlet_results')
      .join('users', 'gauntlet_results.user_id', 'users.id')
      .select(
        'gauntlet_results.*',
        'users.wallet_address',
        'users.username',
        'users.avatar_url'
      )
      .orderBy(sortColumn, 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('gauntlet_results').count('* as count').first();

    res.json({
      results,
      total: parseInt(total?.count as string) || 0,
      limit,
      offset,
    });
  })
);

/**
 * GET /api/gauntlet/history
 * Get gauntlet history
 */
router.get(
  '/history',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 30, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const days = await db('gauntlet_days')
      .select('*')
      .orderBy('date', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('gauntlet_days').count('* as count').first();

    res.json({
      days,
      total: parseInt(total?.count as string) || 0,
      limit,
      offset,
    });
  })
);

export default router;
