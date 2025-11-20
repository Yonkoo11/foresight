import { Router, Request, Response } from 'express';
import db from '../utils/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router: Router = Router();

/**
 * GET /api/arena/duels
 * Get all duels (with filters)
 */
router.get(
  '/duels',
  optionalAuthenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;
    const status = req.query.status as string;
    const type = req.query.type as string;

    let query = db('arena_duels')
      .leftJoin('users as creator', 'arena_duels.creator_id', 'creator.id')
      .leftJoin('users as opponent', 'arena_duels.opponent_id', 'opponent.id')
      .leftJoin('users as winner', 'arena_duels.winner_id', 'winner.id')
      .select(
        'arena_duels.*',
        'creator.wallet_address as creator_address',
        'creator.username as creator_username',
        'opponent.wallet_address as opponent_address',
        'opponent.username as opponent_username',
        'winner.wallet_address as winner_address'
      );

    if (status) {
      query = query.where('arena_duels.status', status);
    }

    if (type) {
      query = query.where('arena_duels.duel_type', type);
    }

    const duels = await query
      .orderBy('arena_duels.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('arena_duels').count('* as count').first();

    res.json({
      duels,
      total: parseInt(total?.count as string) || 0,
      limit,
      offset,
    });
  })
);

/**
 * GET /api/arena/duels/:id
 * Get duel by ID
 */
router.get(
  '/duels/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const duel = await db('arena_duels')
      .leftJoin('users as creator', 'arena_duels.creator_id', 'creator.id')
      .leftJoin('users as opponent', 'arena_duels.opponent_id', 'opponent.id')
      .leftJoin('users as winner', 'arena_duels.winner_id', 'winner.id')
      .where('arena_duels.id', id)
      .select(
        'arena_duels.*',
        'creator.wallet_address as creator_address',
        'creator.username as creator_username',
        'opponent.wallet_address as opponent_address',
        'opponent.username as opponent_username',
        'winner.wallet_address as winner_address'
      )
      .first();

    if (!duel) {
      throw new AppError('Duel not found', 404);
    }

    // If NARRATIVE duel, get votes
    if (duel.duel_type === 'NARRATIVE') {
      const votes = await db('arena_votes')
        .join('users', 'arena_votes.voter_id', 'users.id')
        .where('arena_votes.duel_id', id)
        .select(
          'arena_votes.*',
          'users.wallet_address',
          'users.username',
          'users.avatar_url'
        );

      duel.votes = votes;
    }

    res.json({ duel });
  })
);

/**
 * GET /api/arena/user/:walletAddress/stats
 * Get user arena stats
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

    const stats = await db('arena_results').where({ user_id: user.id }).first();

    if (!stats) {
      return res.json({
        stats: {
          wins: 0,
          losses: 0,
          totalStaked: '0',
          totalWinnings: '0',
          netProfit: '0',
          winRate: 0,
          currentStreak: 0,
          bestStreak: 0,
        },
      });
    }

    res.json({ stats });
  })
);

/**
 * GET /api/arena/leaderboard
 * Get arena leaderboard
 */
router.get(
  '/leaderboard',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;
    const sortBy = (req.query.sortBy as string) || 'net_profit';

    const validSortColumns = ['wins', 'net_profit', 'win_rate'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'net_profit';

    const results = await db('arena_results')
      .join('users', 'arena_results.user_id', 'users.id')
      .select(
        'arena_results.*',
        'users.wallet_address',
        'users.username',
        'users.avatar_url'
      )
      .orderBy(sortColumn, 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('arena_results').count('* as count').first();

    res.json({
      results,
      total: parseInt(total?.count as string) || 0,
      limit,
      offset,
    });
  })
);

export default router;
