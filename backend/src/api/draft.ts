import { Router, Request, Response } from 'express';
import db from '../utils/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate, optionalAuthenticate } from '../middleware/auth';

const router: Router = Router();

/**
 * GET /api/draft/influencers
 * Get all CT influencers
 */
router.get(
  '/influencers',
  asyncHandler(async (req: Request, res: Response) => {
    const influencers = await db('influencers')
      .where('is_active', true)
      .orderBy('tier', 'asc')
      .orderBy('follower_count', 'desc')
      .select('*');

    res.json({ influencers });
  })
);

/**
 * GET /api/draft/team/:walletAddress
 * Get user's draft team
 */
router.get(
  '/team/:walletAddress',
  asyncHandler(async (req: Request, res: Response) => {
    const { walletAddress } = req.params;

    // Use Knex query builder instead of raw
    const users = await db('users')
      .where('address', walletAddress.toLowerCase())
      .select('*');

    if (users.length === 0) {
      throw new AppError('User not found', 404);
    }

    const user = users[0];

    const teams = await db('ct_draft_teams')
      .where('user_id', user.id)
      .orderBy('created_at', 'desc')
      .limit(1)
      .select('*');

    if (teams.length === 0) {
      return res.json({ team: null });
    }

    const team = teams[0];

    // Get influencer details
    const influencers = await db('influencers')
      .whereIn('id', team.influencer_ids)
      .select('*');

    res.json({
      team: {
        id: team.id,
        userId: team.user_id,
        teamName: team.team_name,
        influencerIds: team.influencer_ids,
        weekNumber: team.week_number,
        year: team.year,
        totalScore: team.total_score,
        rank: team.rank,
        lastUpdated: team.updated_at,
        influencers: influencers,
      },
    });
  })
);

/**
 * POST /api/draft/team
 * Create or update user's draft team
 */
router.post(
  '/team',
  asyncHandler(async (req: Request, res: Response) => {
    const { teamName, influencerIds, walletAddress, leagueType = 'free' } = req.body;

    // Validation
    if (!teamName || !influencerIds || !walletAddress) {
      throw new AppError('Missing required fields: teamName, influencerIds, walletAddress', 400);
    }

    if (!Array.isArray(influencerIds) || influencerIds.length !== 5) {
      throw new AppError('Must select exactly 5 influencers', 400);
    }

    if (teamName.length > 32) {
      throw new AppError('Team name must be 32 characters or less', 400);
    }

    if (!['free', 'prize'].includes(leagueType)) {
      throw new AppError('Invalid league type. Must be "free" or "prize"', 400);
    }

    // Verify all influencers exist
    const influencerRecords = await db('influencers')
      .whereIn('id', influencerIds)
      .select('id', 'tier', 'base_price');

    if (influencerRecords.length !== 5) {
      throw new AppError('One or more invalid influencer IDs', 400);
    }

    // Calculate total price and validate budget (100 points)
    const totalPrice = influencerRecords.reduce((sum: number, inf: any) => sum + inf.base_price, 0);
    if (totalPrice > 100) {
      throw new AppError(`Team exceeds budget. Total: ${totalPrice}, Max: 100`, 400);
    }

    // Get or create user
    const existingUsers = await db('users')
      .where('address', walletAddress.toLowerCase())
      .select('*');

    let user;

    if (existingUsers.length === 0) {
      // Create new user
      const [newUser] = await db('users')
        .insert({
          address: walletAddress.toLowerCase(),
          created_at: db.fn.now(),
          last_seen: db.fn.now(),
        })
        .returning('*');
      user = newUser;
    } else {
      user = existingUsers[0];
      // Update last seen
      await db('users')
        .where('id', user.id)
        .update({ last_seen: db.fn.now() });
    }

    // Get current week and year
    const now = new Date();
    const weekNumber = Math.ceil(
      (now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
    const year = now.getFullYear();

    // Check if team already exists for this week
    const existingTeams = await db('ct_draft_teams')
      .where({
        user_id: user.id,
        week_number: weekNumber,
        year: year,
        league_type: leagueType,
      })
      .select('*');

    let team;

    if (existingTeams.length > 0) {
      // Update existing team
      const [updatedTeam] = await db('ct_draft_teams')
        .where('id', existingTeams[0].id)
        .update({
          team_name: teamName,
          influencer_ids: influencerIds,
          updated_at: db.fn.now(),
        })
        .returning('*');
      team = updatedTeam;
    } else {
      // Create new team
      const [newTeam] = await db('ct_draft_teams')
        .insert({
          user_id: user.id,
          team_name: teamName,
          influencer_ids: influencerIds,
          week_number: weekNumber,
          year: year,
          league_type: leagueType,
          total_score: 0,
          created_at: db.fn.now(),
          updated_at: db.fn.now(),
        })
        .returning('*');
      team = newTeam;
    }

    // Get full influencer details for response
    const teamInfluencers = await db('influencers')
      .whereIn('id', influencerIds)
      .select('*');

    res.status(existingTeams.length > 0 ? 200 : 201).json({
      success: true,
      message: existingTeams.length > 0 ? 'Team updated successfully' : 'Team created successfully',
      team: {
        id: team.id,
        userId: team.user_id,
        teamName: team.team_name,
        influencerIds: team.influencer_ids,
        weekNumber: team.week_number,
        year: team.year,
        leagueType: team.league_type,
        totalScore: team.total_score,
        rank: team.rank,
        createdAt: team.created_at,
        updatedAt: team.updated_at,
        influencers: teamInfluencers,
        totalPrice,
      },
    });
  })
);

/**
 * GET /api/draft/leaderboard
 * Get draft leaderboard
 */
router.get(
  '/leaderboard',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;

    const teams = await db('ct_draft_teams')
      .join('users', 'ct_draft_teams.user_id', 'users.id')
      .select(
        'ct_draft_teams.*',
        'users.address as wallet_address',
        'users.username'
      )
      .orderByRaw('ct_draft_teams.rank ASC NULLS LAST')
      .orderBy('ct_draft_teams.total_score', 'desc')
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db('ct_draft_teams').count('* as count');

    res.json({
      teams,
      total: parseInt(count as string),
      limit,
      offset,
    });
  })
);

export default router;
