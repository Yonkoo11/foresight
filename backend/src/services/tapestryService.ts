/**
 * Tapestry Protocol Service
 *
 * Integrates with Tapestry's social graph for:
 * - Identity resolution (wallet → profile)
 * - Team storage (store draft teams as Tapestry content)
 * - Score storage (store achievements/scores as Tapestry content)
 *
 * Uses the socialfi SDK (https://www.usetapestry.dev)
 */

import { SocialFi } from 'socialfi';
import logger from '../utils/logger';

const TAPESTRY_API_KEY = process.env.TAPESTRY_API_KEY || '';
const TAPESTRY_NAMESPACE = 'foresight';

// Initialize the SocialFi client
let client: InstanceType<typeof SocialFi> | null = null;

function getClient(): InstanceType<typeof SocialFi> {
  if (!client) {
    client = new SocialFi({
      baseURL: 'https://api.usetapestry.dev/api/v1',
    });
  }
  return client;
}

/**
 * Check if Tapestry is configured
 */
export function isTapestryConfigured(): boolean {
  return !!TAPESTRY_API_KEY;
}

// ─── Profile Operations ─────────────────────────────────────────────────────

export interface TapestryProfile {
  id: string;
  username: string;
  bio?: string | null;
  image?: string | null;
  namespace: string;
  walletAddress?: string;
}

/**
 * Find or create a Tapestry profile for a wallet address.
 * This is the primary identity operation — called during auth.
 */
export async function findOrCreateProfile(
  walletAddress: string,
  username: string
): Promise<TapestryProfile | null> {
  if (!isTapestryConfigured()) {
    logger.warn('Tapestry not configured, skipping profile creation', {
      context: 'Tapestry',
    });
    return null;
  }

  try {
    const api = getClient();
    const result = await api.profiles.findOrCreateCreate(
      { apiKey: TAPESTRY_API_KEY },
      {
        username,
        walletAddress,
        blockchain: 'SOLANA',
        execution: 'FAST_UNCONFIRMED',
        properties: [
          { key: 'app', value: 'foresight' },
          { key: 'role', value: 'player' },
        ],
      }
    );

    logger.info(`Tapestry profile created/found: ${result.profile.id}`, {
      context: 'Tapestry',
    });

    return {
      id: result.profile.id,
      username: result.profile.username,
      bio: result.profile.bio,
      image: result.profile.image,
      namespace: result.profile.namespace,
      walletAddress: result.walletAddress,
    };
  } catch (error) {
    logger.error('Failed to find/create Tapestry profile', error, {
      context: 'Tapestry',
      data: { walletAddress },
    });
    return null;
  }
}

/**
 * Get a Tapestry profile by ID.
 */
export async function getProfile(
  profileId: string
): Promise<TapestryProfile | null> {
  if (!isTapestryConfigured()) return null;

  try {
    const api = getClient();
    const result = await api.profiles.profilesDetail({
      apiKey: TAPESTRY_API_KEY,
      id: profileId,
    });

    return {
      id: result.profile.id,
      username: result.profile.username,
      bio: result.profile.bio,
      image: result.profile.image,
      namespace: result.profile.namespace,
      walletAddress: result.walletAddress,
    };
  } catch (error) {
    logger.error('Failed to get Tapestry profile', error, {
      context: 'Tapestry',
      data: { profileId },
    });
    return null;
  }
}

/**
 * Resolve a wallet address to Tapestry identities/profiles.
 */
export async function resolveIdentity(walletAddress: string): Promise<TapestryProfile[]> {
  if (!isTapestryConfigured()) return [];

  try {
    const api = getClient();
    const result = await api.identities.identitiesDetail({
      apiKey: TAPESTRY_API_KEY,
      id: walletAddress,
    });

    const profiles: TapestryProfile[] = [];
    for (const identity of result.identities) {
      for (const p of identity.profiles) {
        profiles.push({
          id: p.profile.id,
          username: p.profile.username,
          bio: p.profile.bio,
          image: p.profile.image,
          namespace: p.profile.namespace,
          walletAddress: identity.wallet?.address,
        });
      }
    }

    return profiles;
  } catch (error) {
    logger.error('Failed to resolve Tapestry identity', error, {
      context: 'Tapestry',
      data: { walletAddress },
    });
    return [];
  }
}

// ─── Content Operations (Team & Score Storage) ───────────────────────────────

export interface TeamContentData {
  contestId: string;
  picks: Array<{
    influencerId: string;
    tier: string;
    isCaptain: boolean;
    price: number;
  }>;
  totalBudgetUsed: number;
  captainId: string;
}

/**
 * Store a draft team on Tapestry as content.
 * Content ID format: `foresight-team-{userId}-{contestId}`
 */
export async function storeTeam(
  profileId: string,
  userId: string,
  team: TeamContentData
): Promise<string | null> {
  if (!isTapestryConfigured()) {
    logger.warn('Tapestry not configured, skipping team storage', {
      context: 'Tapestry',
    });
    return null;
  }

  try {
    const api = getClient();
    const contentId = `foresight-team-${userId}-${team.contestId}`;

    const result = await api.contents.findOrCreateCreate(
      { apiKey: TAPESTRY_API_KEY },
      {
        id: contentId,
        profileId,
        properties: [
          { key: 'type', value: 'draft_team' },
          { key: 'app', value: 'foresight' },
          { key: 'contest_id', value: team.contestId },
          { key: 'captain_id', value: team.captainId },
          { key: 'budget_used', value: String(team.totalBudgetUsed) },
          { key: 'picks_json', value: JSON.stringify(team.picks) },
          { key: 'created_at', value: String(Date.now()) },
        ],
      }
    );

    logger.info(`Team stored on Tapestry: ${contentId}`, {
      context: 'Tapestry',
    });
    return result.id;
  } catch (error) {
    logger.error('Failed to store team on Tapestry', error, {
      context: 'Tapestry',
      data: { profileId, contestId: team.contestId },
    });
    return null;
  }
}

export interface ScoreContentData {
  contestId: string;
  totalScore: number;
  rank: number;
  breakdown: {
    activity: number;
    engagement: number;
    growth: number;
    viral: number;
  };
}

/**
 * Store or update a score on Tapestry as content.
 * Content ID format: `foresight-score-{userId}-{contestId}`
 */
export async function storeScore(
  profileId: string,
  userId: string,
  score: ScoreContentData
): Promise<string | null> {
  if (!isTapestryConfigured()) {
    logger.warn('Tapestry not configured, skipping score storage', {
      context: 'Tapestry',
    });
    return null;
  }

  try {
    const api = getClient();
    const contentId = `foresight-score-${userId}-${score.contestId}`;

    // Try to update first, create if not found
    try {
      await api.contents.contentsUpdate(
        { apiKey: TAPESTRY_API_KEY, id: contentId },
        {
          properties: [
            { key: 'total_score', value: String(score.totalScore) },
            { key: 'rank', value: String(score.rank) },
            { key: 'activity_score', value: String(score.breakdown.activity) },
            { key: 'engagement_score', value: String(score.breakdown.engagement) },
            { key: 'growth_score', value: String(score.breakdown.growth) },
            { key: 'viral_score', value: String(score.breakdown.viral) },
            { key: 'updated_at', value: String(Date.now()) },
          ],
        }
      );
    } catch {
      // Content doesn't exist yet, create it
      await api.contents.findOrCreateCreate(
        { apiKey: TAPESTRY_API_KEY },
        {
          id: contentId,
          profileId,
          properties: [
            { key: 'type', value: 'contest_score' },
            { key: 'app', value: 'foresight' },
            { key: 'contest_id', value: score.contestId },
            { key: 'total_score', value: String(score.totalScore) },
            { key: 'rank', value: String(score.rank) },
            { key: 'activity_score', value: String(score.breakdown.activity) },
            { key: 'engagement_score', value: String(score.breakdown.engagement) },
            { key: 'growth_score', value: String(score.breakdown.growth) },
            { key: 'viral_score', value: String(score.breakdown.viral) },
            { key: 'created_at', value: String(Date.now()) },
          ],
        }
      );
    }

    logger.info(`Score stored on Tapestry: ${contentId}`, {
      context: 'Tapestry',
    });
    return contentId;
  } catch (error) {
    logger.error('Failed to store score on Tapestry', error, {
      context: 'Tapestry',
      data: { profileId, contestId: score.contestId },
    });
    return null;
  }
}

// ─── Social Operations (Follow, Like, Activity) ─────────────────────────────

/**
 * Follow another Tapestry profile.
 */
export async function followProfile(
  followerProfileId: string,
  targetProfileId: string
): Promise<boolean> {
  if (!isTapestryConfigured()) return false;

  try {
    const api = getClient();
    await api.followers.postFollowers(
      { apiKey: TAPESTRY_API_KEY },
      { startId: followerProfileId, endId: targetProfileId }
    );
    logger.info(`Tapestry follow: ${followerProfileId} → ${targetProfileId}`, {
      context: 'Tapestry',
    });
    return true;
  } catch (error) {
    logger.error('Failed to follow on Tapestry', error, {
      context: 'Tapestry',
      data: { followerProfileId, targetProfileId },
    });
    return false;
  }
}

/**
 * Unfollow a Tapestry profile.
 */
export async function unfollowProfile(
  followerProfileId: string,
  targetProfileId: string
): Promise<boolean> {
  if (!isTapestryConfigured()) return false;

  try {
    const api = getClient();
    await api.followers.removeCreate(
      { apiKey: TAPESTRY_API_KEY },
      { startId: followerProfileId, endId: targetProfileId }
    );
    logger.info(`Tapestry unfollow: ${followerProfileId} → ${targetProfileId}`, {
      context: 'Tapestry',
    });
    return true;
  } catch (error) {
    logger.error('Failed to unfollow on Tapestry', error, {
      context: 'Tapestry',
      data: { followerProfileId, targetProfileId },
    });
    return false;
  }
}

/**
 * Check if one profile follows another.
 */
export async function isFollowing(
  followerProfileId: string,
  targetProfileId: string
): Promise<boolean> {
  if (!isTapestryConfigured()) return false;

  try {
    const api = getClient();
    const result = await api.followers.stateList({
      apiKey: TAPESTRY_API_KEY,
      startId: followerProfileId,
      endId: targetProfileId,
    });
    return result.isFollowing || false;
  } catch (error) {
    logger.error('Failed to check follow state', error, {
      context: 'Tapestry',
    });
    return false;
  }
}

/**
 * Get follower/following counts for a profile.
 */
export async function getSocialCounts(
  profileId: string
): Promise<{ followers: number; following: number } | null> {
  if (!isTapestryConfigured()) return null;

  try {
    const api = getClient();
    const result = await api.profiles.profilesDetail({
      apiKey: TAPESTRY_API_KEY,
      id: profileId,
    });
    return {
      followers: (result as any).socialCounts?.followers || 0,
      following: (result as any).socialCounts?.following || 0,
    };
  } catch (error) {
    logger.error('Failed to get social counts', error, {
      context: 'Tapestry',
      data: { profileId },
    });
    return null;
  }
}

/**
 * Get followers list for a profile.
 */
export async function getFollowers(
  profileId: string,
  page = 1,
  pageSize = 20
): Promise<Array<{ id: string; username: string }>> {
  if (!isTapestryConfigured()) return [];

  try {
    const api = getClient();
    const result = await api.profiles.followersList({
      apiKey: TAPESTRY_API_KEY,
      id: profileId,
      page: String(page),
      pageSize: String(pageSize),
    });
    return ((result as any).profiles || []).map((p: any) => ({
      id: p.profile?.id || p.id,
      username: p.profile?.username || p.username,
    }));
  } catch (error) {
    logger.error('Failed to get followers', error, {
      context: 'Tapestry',
      data: { profileId },
    });
    return [];
  }
}

/**
 * Get following list for a profile.
 */
export async function getFollowing(
  profileId: string,
  page = 1,
  pageSize = 20
): Promise<Array<{ id: string; username: string }>> {
  if (!isTapestryConfigured()) return [];

  try {
    const api = getClient();
    const result = await api.profiles.followingList({
      apiKey: TAPESTRY_API_KEY,
      id: profileId,
      page: String(page),
      pageSize: String(pageSize),
    });
    return ((result as any).profiles || []).map((p: any) => ({
      id: p.profile?.id || p.id,
      username: p.profile?.username || p.username,
    }));
  } catch (error) {
    logger.error('Failed to get following', error, {
      context: 'Tapestry',
      data: { profileId },
    });
    return [];
  }
}

/**
 * Like a content item (team or score).
 */
export async function likeContent(
  profileId: string,
  contentId: string
): Promise<boolean> {
  if (!isTapestryConfigured()) return false;

  try {
    const api = getClient();
    await api.likes.likesCreate({ apiKey: TAPESTRY_API_KEY, nodeId: contentId }, { startId: profileId });
    logger.info(`Tapestry like: ${profileId} liked ${contentId}`, {
      context: 'Tapestry',
    });
    return true;
  } catch (error) {
    logger.error('Failed to like on Tapestry', error, {
      context: 'Tapestry',
      data: { profileId, contentId },
    });
    return false;
  }
}

/**
 * Unlike a content item.
 */
export async function unlikeContent(
  profileId: string,
  contentId: string
): Promise<boolean> {
  if (!isTapestryConfigured()) return false;

  try {
    const api = getClient();
    await api.likes.likesDelete({ apiKey: TAPESTRY_API_KEY, nodeId: contentId }, { startId: profileId });
    return true;
  } catch (error) {
    logger.error('Failed to unlike on Tapestry', error, {
      context: 'Tapestry',
      data: { profileId, contentId },
    });
    return false;
  }
}

/**
 * Get content items (teams/scores) for a profile.
 */
export async function getProfileContent(
  profileId: string,
  page = 1,
  pageSize = 10
): Promise<Array<{
  id: string;
  properties: Record<string, string>;
  likeCount: number;
  commentCount: number;
}>> {
  if (!isTapestryConfigured()) return [];

  try {
    const api = getClient();
    const result = await api.contents.contentsList({
      apiKey: TAPESTRY_API_KEY,
      profileId,
      page: String(page),
      pageSize: String(pageSize),
    });

    return ((result as any).contents || []).map((c: any) => {
      // Content properties are flat on c.content (not a key/value array)
      const content = c.content || c;
      const props: Record<string, string> = {};
      // Extract known fields from the flat content object
      for (const [k, v] of Object.entries(content)) {
        if (typeof v === 'string' || typeof v === 'number') {
          props[k] = String(v);
        }
      }
      return {
        id: content.id || c.id,
        properties: props,
        likeCount: c.socialCounts?.likeCount || c.likeCount || 0,
        commentCount: c.socialCounts?.commentCount || c.commentCount || 0,
      };
    });
  } catch (error) {
    logger.error('Failed to get profile content', error, {
      context: 'Tapestry',
      data: { profileId },
    });
    return [];
  }
}

/**
 * Get activity feed for a user.
 */
export async function getActivityFeed(
  username: string,
  page = 1,
  pageSize = 20
): Promise<Array<{
  type: string;
  timestamp: string;
  actor: { id: string; username: string };
  target?: { id: string; username?: string };
}>> {
  if (!isTapestryConfigured()) return [];

  try {
    const api = getClient();
    const result = await api.activity.feedList({
      apiKey: TAPESTRY_API_KEY,
      username,
      page: String(page),
      pageSize: String(pageSize),
    });

    return ((result as any).activity || []).map((a: any) => ({
      type: a.type || 'unknown',
      timestamp: a.timestamp || a.createdAt,
      actor: {
        id: a.actor?.id || '',
        username: a.actor?.username || '',
      },
      target: a.target ? {
        id: a.target.id || '',
        username: a.target.username,
      } : undefined,
    }));
  } catch (error) {
    logger.error('Failed to get activity feed', error, {
      context: 'Tapestry',
      data: { username },
    });
    return [];
  }
}

/**
 * Add a comment to content.
 */
export async function commentOnContent(
  profileId: string,
  contentId: string,
  text: string
): Promise<string | null> {
  if (!isTapestryConfigured()) return null;

  try {
    const api = getClient();
    const result = await api.comments.commentsCreate(
      { apiKey: TAPESTRY_API_KEY },
      { profileId, contentId, text }
    );
    logger.info(`Tapestry comment on ${contentId} by ${profileId}`, {
      context: 'Tapestry',
    });
    return (result as any).id || null;
  } catch (error) {
    logger.error('Failed to comment on Tapestry', error, {
      context: 'Tapestry',
      data: { profileId, contentId },
    });
    return null;
  }
}

/**
 * Get comments on content.
 */
export async function getComments(
  contentId: string,
  page = 1,
  pageSize = 20
): Promise<Array<{
  id: string;
  text: string;
  author: { id: string; username: string };
  likeCount: number;
  createdAt: string;
}>> {
  if (!isTapestryConfigured()) return [];

  try {
    const api = getClient();
    const result = await api.comments.commentsList({
      apiKey: TAPESTRY_API_KEY,
      contentId,
      page: String(page),
      pageSize: String(pageSize),
    });

    return ((result as any).comments || []).map((c: any) => ({
      id: c.id,
      text: c.text || '',
      author: {
        id: c.profile?.id || '',
        username: c.profile?.username || '',
      },
      likeCount: c.likeCount || 0,
      createdAt: c.createdAt || '',
    }));
  } catch (error) {
    logger.error('Failed to get comments', error, {
      context: 'Tapestry',
      data: { contentId },
    });
    return [];
  }
}

// ─── Export as service object ────────────────────────────────────────────────

const tapestryService = {
  isTapestryConfigured,
  findOrCreateProfile,
  getProfile,
  resolveIdentity,
  storeTeam,
  storeScore,
  followProfile,
  unfollowProfile,
  isFollowing,
  getSocialCounts,
  getFollowers,
  getFollowing,
  likeContent,
  unlikeContent,
  getProfileContent,
  getActivityFeed,
  commentOnContent,
  getComments,
};

export default tapestryService;
