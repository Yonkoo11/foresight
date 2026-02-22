/**
 * Tapestry Protocol API Routes
 *
 * Social graph features: follow/unfollow, content read-back, likes,
 * comments, activity feed. All data lives on Tapestry's Solana-based
 * social graph.
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import tapestryService from '../services/tapestryService';
import db from '../utils/db';

const router: Router = Router();

/**
 * Helper: get the current user's Tapestry profile ID from DB.
 */
async function getTapestryProfileId(userId: string): Promise<string> {
  const user = await db('users').where({ id: userId }).first();
  if (!user?.tapestry_user_id) {
    throw new AppError('Tapestry profile not linked. Sign in again to create one.', 400);
  }
  return user.tapestry_user_id;
}

// ─── Social Graph ────────────────────────────────────────────────────────────

/**
 * POST /api/tapestry/follow
 * Follow another user by their Tapestry profile ID.
 */
router.post(
  '/follow',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { targetProfileId } = req.body;

    if (!targetProfileId) {
      throw new AppError('targetProfileId is required', 400);
    }

    const myProfileId = await getTapestryProfileId(userId);
    const ok = await tapestryService.followProfile(myProfileId, targetProfileId);

    if (!ok) {
      throw new AppError('Failed to follow user on Tapestry', 500);
    }

    sendSuccess(res, { followed: true, targetProfileId });
  })
);

/**
 * POST /api/tapestry/unfollow
 * Unfollow a user by their Tapestry profile ID.
 */
router.post(
  '/unfollow',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { targetProfileId } = req.body;

    if (!targetProfileId) {
      throw new AppError('targetProfileId is required', 400);
    }

    const myProfileId = await getTapestryProfileId(userId);
    const ok = await tapestryService.unfollowProfile(myProfileId, targetProfileId);

    if (!ok) {
      throw new AppError('Failed to unfollow user on Tapestry', 500);
    }

    sendSuccess(res, { followed: false, targetProfileId });
  })
);

/**
 * GET /api/tapestry/following-state/:targetProfileId
 * Check if the current user follows another profile.
 */
router.get(
  '/following-state/:targetProfileId',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { targetProfileId } = req.params;

    const myProfileId = await getTapestryProfileId(userId);
    const following = await tapestryService.isFollowing(myProfileId, targetProfileId);

    sendSuccess(res, { isFollowing: following });
  })
);

/**
 * GET /api/tapestry/followers/:profileId
 * Get followers of a profile.
 */
router.get(
  '/followers/:profileId',
  asyncHandler(async (req: Request, res: Response) => {
    const { profileId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const followers = await tapestryService.getFollowers(profileId, page);

    sendSuccess(res, { followers });
  })
);

/**
 * GET /api/tapestry/following/:profileId
 * Get who a profile follows.
 */
router.get(
  '/following/:profileId',
  asyncHandler(async (req: Request, res: Response) => {
    const { profileId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const following = await tapestryService.getFollowing(profileId, page);

    sendSuccess(res, { following });
  })
);

/**
 * GET /api/tapestry/social-counts/:profileId
 * Get follower/following counts.
 */
router.get(
  '/social-counts/:profileId',
  asyncHandler(async (req: Request, res: Response) => {
    const { profileId } = req.params;
    const counts = await tapestryService.getSocialCounts(profileId);

    sendSuccess(res, counts || { followers: 0, following: 0 });
  })
);

// ─── Content ─────────────────────────────────────────────────────────────────

/**
 * GET /api/tapestry/content/:profileId
 * Get all content (teams, scores) stored on Tapestry for a profile.
 */
router.get(
  '/content/:profileId',
  asyncHandler(async (req: Request, res: Response) => {
    const { profileId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const content = await tapestryService.getProfileContent(profileId, page);

    sendSuccess(res, { content });
  })
);

// ─── Likes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/tapestry/like/:contentId
 * Like a team or score on Tapestry.
 */
router.post(
  '/like/:contentId',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { contentId } = req.params;

    const myProfileId = await getTapestryProfileId(userId);
    const ok = await tapestryService.likeContent(myProfileId, contentId);

    if (!ok) {
      throw new AppError('Failed to like content on Tapestry', 500);
    }

    sendSuccess(res, { liked: true, contentId });
  })
);

/**
 * DELETE /api/tapestry/like/:contentId
 * Unlike a team or score on Tapestry.
 */
router.delete(
  '/like/:contentId',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { contentId } = req.params;

    const myProfileId = await getTapestryProfileId(userId);
    const ok = await tapestryService.unlikeContent(myProfileId, contentId);

    if (!ok) {
      throw new AppError('Failed to unlike content on Tapestry', 500);
    }

    sendSuccess(res, { liked: false, contentId });
  })
);

// ─── Comments ────────────────────────────────────────────────────────────────

/**
 * POST /api/tapestry/comment/:contentId
 * Comment on a team or score.
 */
router.post(
  '/comment/:contentId',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { contentId } = req.params;
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      throw new AppError('Comment text is required', 400);
    }

    const myProfileId = await getTapestryProfileId(userId);
    const commentId = await tapestryService.commentOnContent(myProfileId, contentId, text.trim());

    if (!commentId) {
      throw new AppError('Failed to post comment on Tapestry', 500);
    }

    sendSuccess(res, { commentId, contentId });
  })
);

/**
 * GET /api/tapestry/comments/:contentId
 * Get comments on content.
 */
router.get(
  '/comments/:contentId',
  asyncHandler(async (req: Request, res: Response) => {
    const { contentId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const comments = await tapestryService.getComments(contentId, page);

    sendSuccess(res, { comments });
  })
);

// ─── Activity Feed ───────────────────────────────────────────────────────────

/**
 * GET /api/tapestry/activity
 * Get the current user's Tapestry activity feed.
 */
router.get(
  '/activity',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;

    const user = await db('users').where({ id: userId }).first();
    if (!user?.tapestry_user_id) {
      sendSuccess(res, { activity: [] });
      return;
    }

    const activity = await tapestryService.getActivityFeed(user.username, page);

    sendSuccess(res, { activity });
  })
);

export default router;
