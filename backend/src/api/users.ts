import { Router, Request, Response } from 'express';
import db from '../utils/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router: Router = Router();

/**
 * GET /api/users/me
 * Get current user's profile (authenticated)
 */
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const user = await db('users')
      .where({ 'users.id': userId })
      .leftJoin('user_xp_totals', 'users.id', 'user_xp_totals.user_id')
      .select(
        'users.*',
        'user_xp_totals.total_xp as xp'
      )
      .first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      id: user.id,
      walletAddress: user.wallet_address,
      username: user.username,
      twitterHandle: user.twitter_handle,
      avatarUrl: user.avatar_url,
      xp: user.xp || 0,
      voteStreak: user.vote_streak || 0,
      lastVoteDate: user.last_vote_date,
      ctMasteryScore: user.ct_mastery_score,
      ctMasteryLevel: user.ct_mastery_level,
      createdAt: user.created_at,
    });
  })
);

/**
 * GET /api/users/xp-leaderboard
 * Get top users by XP with level info
 */
router.get(
  '/xp-leaderboard',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;
    const period = req.query.period as string || 'all-time';

    let query = db('users')
      .leftJoin('user_xp_totals', 'users.id', 'user_xp_totals.user_id')
      .select(
        'users.id',
        'users.wallet_address',
        'users.username',
        'users.avatar_url',
        'users.vote_streak',
        'user_xp_totals.total_xp as xp',
        'user_xp_totals.lifetime_xp'
      );

    if (period === 'monthly') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      query = query
        .where('user_xp_totals.last_xp_at', '>=', startOfMonth)
        .orderBy('user_xp_totals.total_xp', 'desc');
    } else {
      query = query.orderByRaw('COALESCE(user_xp_totals.lifetime_xp, 0) DESC');
    }

    const users = await query.limit(limit).offset(offset);
    const total = await db('users').count('* as count').first();

    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: offset + index + 1,
      xp: user.xp || 0,
      lifetime_xp: user.lifetime_xp || 0,
    }));

    res.json({
      users: rankedUsers,
      total: parseInt(total?.count as string) || 0,
      limit,
      offset,
      period,
    });
  })
);

/**
 * GET /api/users/achievements
 * Get user's achievements
 */
router.get(
  '/achievements',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const achievements = await db('user_achievements')
      .join('achievements', 'user_achievements.achievement_id', 'achievements.id')
      .where({ user_id: userId })
      .select(
        'achievements.id',
        'achievements.key',
        'achievements.name',
        'achievements.description',
        'achievements.icon',
        'achievements.xp_reward',
        'achievements.rarity',
        'user_achievements.unlocked_at'
      )
      .orderBy('user_achievements.unlocked_at', 'desc');

    const allAchievements = await db('achievements').select('*');

    res.json({
      unlocked: achievements,
      all: allAchievements,
      total_unlocked: achievements.length,
      total_available: allAchievements.length,
    });
  })
);

/**
 * GET /api/users/leaderboard
 * Get top users by CT Mastery Score
 */
router.get(
  '/leaderboard',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await db('users')
      .select(
        'id',
        'wallet_address',
        'username',
        'avatar_url',
        'ct_mastery_score',
        'ct_mastery_level'
      )
      .orderBy('ct_mastery_score', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('users').count('* as count').first();

    res.json({
      users,
      total: parseInt(total?.count as string) || 0,
      limit,
      offset,
    });
  })
);

/**
 * GET /api/users/:walletAddress
 * Get user profile by wallet address
 */
router.get(
  '/:walletAddress',
  optionalAuthenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { walletAddress } = req.params;

    const user = await db('users')
      .where({ wallet_address: walletAddress.toLowerCase() })
      .first();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      id: user.id,
      walletAddress: user.wallet_address,
      username: user.username,
      twitterHandle: user.twitter_handle,
      avatarUrl: user.avatar_url,
      ctMasteryScore: user.ct_mastery_score,
      ctMasteryLevel: user.ct_mastery_level,
      createdAt: user.created_at,
    });
  })
);

/**
 * PATCH /api/users/profile
 * Update user profile
 */
router.patch(
  '/profile',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { username, twitterHandle, avatarUrl } = req.body;

    const updates: any = {};

    if (username !== undefined) {
      // Check if username is taken
      const existing = await db('users')
        .where({ username })
        .whereNot({ id: userId })
        .first();

      if (existing) {
        throw new AppError('Username already taken', 400);
      }

      updates.username = username;
    }

    if (twitterHandle !== undefined) {
      updates.twitter_handle = twitterHandle;
    }

    if (avatarUrl !== undefined) {
      updates.avatar_url = avatarUrl;
    }

    if (Object.keys(updates).length === 0) {
      throw new AppError('No updates provided', 400);
    }

    await db('users').where({ id: userId }).update(updates);

    const updatedUser = await db('users').where({ id: userId }).first();

    res.json({
      id: updatedUser.id,
      walletAddress: updatedUser.wallet_address,
      username: updatedUser.username,
      twitterHandle: updatedUser.twitter_handle,
      avatarUrl: updatedUser.avatar_url,
      ctMasteryScore: updatedUser.ct_mastery_score,
      ctMasteryLevel: updatedUser.ct_mastery_level,
    });
  })
);

export default router;
