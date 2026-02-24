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
 * Returns null if no profile is linked (graceful degradation for demo).
 */
async function getTapestryProfileId(userId: string): Promise<string | null> {
  const user = await db('users').where({ id: userId }).first();
  return user?.tapestry_user_id || null;
}

// ─── Social Graph ────────────────────────────────────────────────────────────

/**
 * POST /api/tapestry/follow
 * Follow another user by their Tapestry profile ID.
 * Gracefully degrades if Tapestry API is unavailable or profiles are missing.
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

    // Try Tapestry API, but succeed regardless (optimistic follow for demo)
    if (myProfileId) {
      try {
        await tapestryService.followProfile(myProfileId, targetProfileId);
      } catch {
        // Tapestry API failed — still return success for UX
      }
    }

    sendSuccess(res, { followed: true, targetProfileId });
  })
);

/**
 * POST /api/tapestry/unfollow
 * Unfollow a user by their Tapestry profile ID.
 * Gracefully degrades if Tapestry API is unavailable or profiles are missing.
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

    // Try Tapestry API, but succeed regardless
    if (myProfileId) {
      try {
        await tapestryService.unfollowProfile(myProfileId, targetProfileId);
      } catch {
        // Tapestry API failed — still return success for UX
      }
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
    if (!myProfileId) {
      sendSuccess(res, { isFollowing: false });
      return;
    }

    try {
      const following = await tapestryService.isFollowing(myProfileId, targetProfileId);
      sendSuccess(res, { isFollowing: following });
    } catch {
      sendSuccess(res, { isFollowing: false });
    }
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
    if (myProfileId) {
      try {
        await tapestryService.likeContent(myProfileId, contentId);
      } catch { /* graceful degradation */ }
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
    if (myProfileId) {
      try {
        await tapestryService.unlikeContent(myProfileId, contentId);
      } catch { /* graceful degradation */ }
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
    let commentId: string | null = null;
    if (myProfileId) {
      try {
        commentId = await tapestryService.commentOnContent(myProfileId, contentId, text.trim());
      } catch { /* graceful degradation */ }
    }

    sendSuccess(res, { commentId: commentId || 'local', contentId });
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

// ─── Batch Operations ────────────────────────────────────────────────────────

/**
 * POST /api/tapestry/following-state-batch
 * Check follow state for multiple profiles at once.
 * Body: { targetProfileIds: string[] }
 */
router.post(
  '/following-state-batch',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { targetProfileIds } = req.body;

    if (!Array.isArray(targetProfileIds) || targetProfileIds.length === 0) {
      sendSuccess(res, { states: {} });
      return;
    }

    const myProfileId = await getTapestryProfileId(userId);

    if (!myProfileId) {
      // No tapestry profile — all false
      const results: Record<string, boolean> = {};
      for (const id of targetProfileIds.slice(0, 50)) results[id] = false;
      sendSuccess(res, { states: results });
      return;
    }

    // Check follow state for each target in parallel
    const results: Record<string, boolean> = {};
    await Promise.all(
      targetProfileIds.slice(0, 50).map(async (targetId: string) => {
        try {
          results[targetId] = await tapestryService.isFollowing(myProfileId, targetId);
        } catch {
          results[targetId] = false;
        }
      })
    );

    sendSuccess(res, { states: results });
  })
);

/**
 * GET /api/tapestry/my-following
 * Get list of all profile IDs the current user follows (for Friends Leaderboard).
 */
router.get(
  '/my-following',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const myProfileId = await getTapestryProfileId(userId);

    if (!myProfileId) {
      sendSuccess(res, { following: [] });
      return;
    }

    try {
      const following = await tapestryService.getFollowing(myProfileId, 1, 100);
      sendSuccess(res, { following });
    } catch {
      sendSuccess(res, { following: [] });
    }
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
