import { Router, Request, Response } from 'express';
import db from '../utils/db';
import { authenticate } from '../middleware/auth';
import { ethers } from 'ethers';
import * as crypto from 'crypto';

const router = Router();

// ========================================
// INTERFACES
// ========================================

interface QuestRequirement {
  type: string;
  value: number;
  min_correct?: number;
  min_games?: number;
  min_deposit_eth?: string;
  wait_days?: number;
  percentile?: number;
  mode?: string;
}

interface UserStats {
  games_played: number;
  account_age_days: number;
  wallet_age_days: number;
  total_deposited: number;
  current_streak: number;
  reputation: number;
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Calculate wallet age from blockchain
 */
async function getWalletAge(address: string): Promise<number> {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const currentBlock = await provider.getBlockNumber();

    // Get first transaction (simplified - production should use etherscan API)
    // For now, return account creation timestamp from DB
    const user = await db('users')
      .where('address', address.toLowerCase())
      .first();

    if (!user) return 0;

    const accountCreated = new Date(user.created_at);
    const now = new Date();
    const ageMs = now.getTime() - accountCreated.getTime();
    return Math.floor(ageMs / (1000 * 60 * 60 * 24)); // Days
  } catch (error) {
    console.error('Error getting wallet age:', error);
    return 0;
  }
}

/**
 * Get user statistics for eligibility checking
 */
async function getUserStats(userId: number): Promise<UserStats> {
  const user = await db('users').where('id', userId).first();

  // Count games played across all modes
  const draftGames = await db('ct_draft_teams').where('user_id', userId).count('* as count');
  const arenaGames = await db('arena_duels')
    .where('player1_id', userId)
    .orWhere('player2_id', userId)
    .count('* as count');
  const gauntletGames = await db('gauntlet_entries').where('user_id', userId).count('* as count');

  const totalGames =
    (draftGames[0]?.count || 0) +
    (arenaGames[0]?.count || 0) +
    (gauntletGames[0]?.count || 0);

  // Calculate account age
  const accountCreated = new Date(user.created_at);
  const now = new Date();
  const accountAgeDays = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));

  // Get wallet age
  const walletAgeDays = await getWalletAge(user.address);

  // Calculate total deposited (sum of all entry fees)
  // This is simplified - production should track actual deposits
  const totalDeposited = 0; // TODO: Implement deposit tracking

  return {
    games_played: Number(totalGames),
    account_age_days: accountAgeDays,
    wallet_age_days: walletAgeDays,
    total_deposited: totalDeposited,
    current_streak: user.current_streak_days || 0,
    reputation: user.reputation || 0,
  };
}

/**
 * Check if user meets quest eligibility requirements
 */
async function checkEligibility(userId: number, quest: any): Promise<{ eligible: boolean; reason?: string }> {
  const stats = await getUserStats(userId);

  // Check reputation
  if (quest.min_reputation && stats.reputation < quest.min_reputation) {
    return { eligible: false, reason: `Requires ${quest.min_reputation} reputation (you have ${stats.reputation})` };
  }

  // Check account age
  if (quest.min_account_age_days && stats.account_age_days < quest.min_account_age_days) {
    return { eligible: false, reason: `Account must be ${quest.min_account_age_days} days old` };
  }

  // Check wallet age
  if (quest.min_wallet_age_days && stats.wallet_age_days < quest.min_wallet_age_days) {
    return { eligible: false, reason: `Wallet must be ${quest.min_wallet_age_days} days old` };
  }

  // Check games played
  if (quest.min_games_played && stats.games_played < quest.min_games_played) {
    return { eligible: false, reason: `Must have played ${quest.min_games_played} games` };
  }

  // Check wallet balance
  if (quest.min_wallet_balance_eth && quest.min_wallet_balance_eth > 0) {
    // TODO: Check on-chain balance
  }

  // Check if quest is within active dates
  if (quest.start_date && new Date(quest.start_date) > new Date()) {
    return { eligible: false, reason: 'Quest not yet started' };
  }

  if (quest.end_date && new Date(quest.end_date) < new Date()) {
    return { eligible: false, reason: 'Quest has ended' };
  }

  // Check user completion limit
  if (quest.max_completions_per_user) {
    const completions = await db('user_quest_completions')
      .where({ user_id: userId, quest_id: quest.id })
      .count('* as count');

    if (Number(completions[0].count) >= quest.max_completions_per_user) {
      return { eligible: false, reason: 'Maximum completions reached' };
    }
  }

  // Check cooldown
  if (quest.cooldown_hours > 0) {
    const lastCompletion = await db('user_quest_completions')
      .where({ user_id: userId, quest_id: quest.id })
      .orderBy('completed_at', 'desc')
      .first();

    if (lastCompletion) {
      const hoursSinceCompletion =
        (new Date().getTime() - new Date(lastCompletion.completed_at).getTime()) / (1000 * 60 * 60);

      if (hoursSinceCompletion < quest.cooldown_hours) {
        const hoursRemaining = Math.ceil(quest.cooldown_hours - hoursSinceCompletion);
        return { eligible: false, reason: `Cooldown: ${hoursRemaining} hours remaining` };
      }
    }
  }

  // Check global completion cap
  if (quest.max_total_completions && quest.current_completions >= quest.max_total_completions) {
    return { eligible: false, reason: 'Quest completion limit reached' };
  }

  return { eligible: true };
}

/**
 * Verify quest completion based on requirements
 */
async function verifyQuestCompletion(userId: number, quest: any): Promise<{ completed: boolean; progress?: number; target?: number }> {
  const requirements: QuestRequirement = quest.requirements;

  switch (requirements.type) {
    case 'login': {
      // Check daily activity
      const today = new Date().toISOString().split('T')[0];
      const activity = await db('daily_activity')
        .where({ user_id: userId, activity_date: today })
        .first();

      return { completed: !!activity, progress: activity ? 1 : 0, target: 1 };
    }

    case 'games_played': {
      const stats = await getUserStats(userId);
      return {
        completed: stats.games_played >= requirements.value,
        progress: stats.games_played,
        target: requirements.value
      };
    }

    case 'streak_days': {
      const user = await db('users').where('id', userId).first();
      const currentStreak = user.current_streak_days || 0;
      return {
        completed: currentStreak >= requirements.value,
        progress: currentStreak,
        target: requirements.value
      };
    }

    case 'gauntlet_wins': {
      const wins = await db('gauntlet_entries')
        .where('user_id', userId)
        .where('correct_count', '>=', requirements.min_correct || 3)
        .count('* as count');

      const winCount = Number(wins[0].count);
      return {
        completed: winCount >= requirements.value,
        progress: winCount,
        target: requirements.value
      };
    }

    case 'gauntlet_perfect': {
      const perfect = await db('gauntlet_entries')
        .where({ user_id: userId, correct_count: 5 })
        .count('* as count');

      const perfectCount = Number(perfect[0].count);
      return {
        completed: perfectCount >= requirements.value,
        progress: perfectCount,
        target: requirements.value
      };
    }

    case 'leaderboard_rank': {
      // Check if user finished in top percentile for the mode
      // This is simplified - production should track weekly leaderboard snapshots
      const mode = requirements.mode || 'any';
      const percentile = requirements.percentile || 50;

      // TODO: Implement leaderboard ranking logic
      return { completed: false, progress: 0, target: 100 };
    }

    case 'referral_active': {
      const activeReferrals = await db('referrals')
        .where({
          referrer_id: userId,
          referee_active: true,
          referee_deposited: true,
          reward_paid: false
        })
        .where('referee_games_played', '>=', requirements.min_games || 3)
        .count('* as count');

      const count = Number(activeReferrals[0].count);
      return {
        completed: count >= requirements.value,
        progress: count,
        target: requirements.value
      };
    }

    default:
      return { completed: false };
  }
}

/**
 * Hash IP address for sybil detection
 */
function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT).digest('hex');
}

// ========================================
// PUBLIC ENDPOINTS
// ========================================

/**
 * GET /api/quests - List all available quests
 */
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get all active quests
    const quests = await db('quests')
      .where('is_active', true)
      .orderBy('priority', 'asc');

    // For each quest, check eligibility and progress
    const questsWithStatus = await Promise.all(
      quests.map(async (quest) => {
        const eligibility = await checkEligibility(userId, quest);
        const verification = await verifyQuestCompletion(userId, quest);

        // Get user's completion history
        const completions = await db('user_quest_completions')
          .where({ user_id: userId, quest_id: quest.id })
          .count('* as count');

        return {
          ...quest,
          eligible: eligibility.eligible,
          eligibility_reason: eligibility.reason,
          progress: verification.progress || 0,
          target: verification.target || 0,
          completed: verification.completed,
          completions: Number(completions[0].count),
          can_claim: verification.completed && eligibility.eligible,
        };
      })
    );

    res.json({
      success: true,
      quests: questsWithStatus,
    });
  } catch (error) {
    console.error('Error fetching quests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quests' });
  }
});

/**
 * GET /api/quests/:questId - Get specific quest details
 */
router.get('/:questId', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { questId } = req.params;

    const quest = await db('quests')
      .where('quest_id', questId)
      .first();

    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found' });
    }

    const eligibility = await checkEligibility(userId, quest);
    const verification = await verifyQuestCompletion(userId, quest);

    // Get completion history
    const completions = await db('user_quest_completions')
      .where({ user_id: userId, quest_id: quest.id })
      .orderBy('completed_at', 'desc');

    res.json({
      success: true,
      quest: {
        ...quest,
        eligible: eligibility.eligible,
        eligibility_reason: eligibility.reason,
        progress: verification.progress,
        target: verification.target,
        completed: verification.completed,
        completions: completions,
      },
    });
  } catch (error) {
    console.error('Error fetching quest:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch quest' });
  }
});

/**
 * POST /api/quests/:questId/claim - Claim quest reward
 */
router.post('/:questId/claim', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { questId } = req.params;
    const userIP = req.ip || req.socket.remoteAddress || '';

    const quest = await db('quests')
      .where('quest_id', questId)
      .first();

    if (!quest) {
      return res.status(404).json({ success: false, error: 'Quest not found' });
    }

    // Check eligibility
    const eligibility = await checkEligibility(userId, quest);
    if (!eligibility.eligible) {
      return res.status(403).json({
        success: false,
        error: eligibility.reason || 'Not eligible for this quest'
      });
    }

    // Verify completion
    const verification = await verifyQuestCompletion(userId, quest);
    if (!verification.completed) {
      return res.status(400).json({
        success: false,
        error: 'Quest requirements not met',
        progress: verification.progress,
        target: verification.target,
      });
    }

    // Check if already claimed today (for daily quests)
    if (quest.max_completions_per_day) {
      const today = new Date().toISOString().split('T')[0];
      const todayCompletions = await db('user_quest_completions')
        .where({ user_id: userId, quest_id: quest.id })
        .where('completed_at', '>=', today)
        .count('* as count');

      if (Number(todayCompletions[0].count) >= quest.max_completions_per_day) {
        return res.status(400).json({
          success: false,
          error: 'Daily completion limit reached'
        });
      }
    }

    // Start transaction
    await db.transaction(async (trx) => {
      // Calculate vesting unlock time
      const vestingDays = quest.eth_reward_enabled ? 7 : 0;
      const unlockDate = new Date();
      unlockDate.setDate(unlockDate.getDate() + vestingDays);

      // Record completion
      await trx('user_quest_completions').insert({
        user_id: userId,
        quest_id: quest.id,
        completed_at: new Date(),
        points_earned: quest.points_reward,
        eth_earned_wei: quest.eth_reward_enabled ? quest.eth_reward_wei : '0',
        eth_unlock_date: quest.eth_reward_enabled ? unlockDate : null,
        eth_claimed: false,
        verification_data: JSON.stringify({
          ip_hash: hashIP(userIP),
          progress: verification.progress,
          timestamp: new Date().toISOString(),
        }),
        verified: true,
        verified_at: new Date(),
      });

      // Update quest completion count
      await trx('quests')
        .where('id', quest.id)
        .increment('current_completions', 1);

      // Award points to user
      await trx('users')
        .where('id', userId)
        .increment('total_points', quest.points_reward);

      // Update monthly budget pool
      if (quest.eth_reward_enabled) {
        const currentMonth = parseInt(
          new Date().toISOString().slice(0, 7).replace('-', '')
        ); // YYYYMM

        await trx.raw(`
          INSERT INTO quest_reward_pool (month, allocated_wei, distributed_wei, pending_wei, remaining_wei)
          VALUES (?, 0, 0, ?, 0)
          ON CONFLICT (month)
          DO UPDATE SET pending_wei = quest_reward_pool.pending_wei + EXCLUDED.pending_wei
        `, [currentMonth, quest.eth_reward_wei]);
      }

      // Update daily activity
      const today = new Date().toISOString().split('T')[0];
      await trx.raw(`
        INSERT INTO daily_activity (user_id, activity_date, first_activity, last_activity)
        VALUES (?, ?, NOW(), NOW())
        ON CONFLICT (user_id, activity_date)
        DO UPDATE SET last_activity = NOW()
      `, [userId, today]);
    });

    res.json({
      success: true,
      message: 'Quest completed!',
      rewards: {
        points: quest.points_reward,
        eth_wei: quest.eth_reward_enabled ? quest.eth_reward_wei : '0',
        vesting_days: quest.eth_reward_enabled ? 7 : 0,
        unlock_date: quest.eth_reward_enabled ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
      },
    });
  } catch (error) {
    console.error('Error claiming quest:', error);
    res.status(500).json({ success: false, error: 'Failed to claim quest' });
  }
});

/**
 * GET /api/quests/rewards/claimable - Get claimable ETH rewards
 */
router.get('/rewards/claimable', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get all vested rewards that are unlocked and unclaimed
    const claimableRewards = await db('user_quest_completions')
      .where({ user_id: userId, eth_claimed: false })
      .where('eth_unlock_date', '<=', new Date())
      .whereNotNull('eth_unlock_date')
      .select('*');

    const totalClaimable = claimableRewards.reduce(
      (sum, reward) => sum + BigInt(reward.eth_earned_wei),
      BigInt(0)
    );

    res.json({
      success: true,
      claimable_wei: totalClaimable.toString(),
      claimable_eth: ethers.formatEther(totalClaimable),
      rewards: claimableRewards,
    });
  } catch (error) {
    console.error('Error fetching claimable rewards:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch claimable rewards' });
  }
});

/**
 * GET /api/quests/rewards/pending - Get pending (locked) ETH rewards
 */
router.get('/rewards/pending', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get all vested rewards that are still locked
    const pendingRewards = await db('user_quest_completions')
      .where({ user_id: userId, eth_claimed: false })
      .where('eth_unlock_date', '>', new Date())
      .whereNotNull('eth_unlock_date')
      .select('*');

    const totalPending = pendingRewards.reduce(
      (sum, reward) => sum + BigInt(reward.eth_earned_wei),
      BigInt(0)
    );

    res.json({
      success: true,
      pending_wei: totalPending.toString(),
      pending_eth: ethers.formatEther(totalPending),
      rewards: pendingRewards,
    });
  } catch (error) {
    console.error('Error fetching pending rewards:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pending rewards' });
  }
});

/**
 * POST /api/quests/rewards/claim-eth - Claim vested ETH rewards (coordinates with smart contract)
 */
router.post('/rewards/claim-eth', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Get user address
    const user = await db('users').where('id', userId).first();

    // Get all claimable rewards
    const claimableRewards = await db('user_quest_completions')
      .where({ user_id: userId, eth_claimed: false })
      .where('eth_unlock_date', '<=', new Date())
      .whereNotNull('eth_unlock_date')
      .select('*');

    if (claimableRewards.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No claimable rewards available'
      });
    }

    const totalClaimable = claimableRewards.reduce(
      (sum, reward) => sum + BigInt(reward.eth_earned_wei),
      BigInt(0)
    );

    // TODO: Coordinate with QuestRewards smart contract
    // This should call questRewards.claimVestedRewards() on-chain
    // For now, just mark as claimed in DB (production should wait for tx confirmation)

    await db.transaction(async (trx) => {
      // Mark rewards as claimed
      await trx('user_quest_completions')
        .where({ user_id: userId, eth_claimed: false })
        .where('eth_unlock_date', '<=', new Date())
        .update({
          eth_claimed: true,
          claim_tx_hash: 'TODO_IMPLEMENT_SMART_CONTRACT_CALL'
        });
    });

    res.json({
      success: true,
      message: 'ETH rewards claimed!',
      claimed_wei: totalClaimable.toString(),
      claimed_eth: ethers.formatEther(totalClaimable),
      // TODO: Return transaction hash
    });
  } catch (error) {
    console.error('Error claiming ETH rewards:', error);
    res.status(500).json({ success: false, error: 'Failed to claim ETH rewards' });
  }
});

/**
 * GET /api/quests/leaderboard - Quest points leaderboard
 */
router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;

    const leaderboard = await db('users')
      .select('username', 'total_points', 'current_streak_days', 'longest_streak_days')
      .orderBy('total_points', 'desc')
      .limit(limit);

    res.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

// ========================================
// ADMIN ENDPOINTS
// ========================================

/**
 * GET /api/quests/admin/stats - Quest system statistics
 */
router.get('/admin/stats', authenticate, async (req: Request, res: Response) => {
  try {
    // TODO: Add admin role check

    const stats = {
      total_quests: await db('quests').count('* as count').first(),
      active_quests: await db('quests').where('is_active', true).count('* as count').first(),
      total_completions: await db('user_quest_completions').count('* as count').first(),
      total_points_awarded: await db('user_quest_completions').sum('points_earned as sum').first(),
      total_eth_pending: await db('user_quest_completions')
        .where('eth_claimed', false)
        .sum('eth_earned_wei as sum')
        .first(),
      total_eth_claimed: await db('user_quest_completions')
        .where('eth_claimed', true)
        .sum('eth_earned_wei as sum')
        .first(),
      active_users: await db('users').where('total_points', '>', 0).count('* as count').first(),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch stats' });
  }
});

/**
 * POST /api/quests/admin/flag-user - Flag user for suspicious activity
 */
router.post('/admin/flag-user', authenticate, async (req: Request, res: Response) => {
  try {
    // TODO: Add admin role check

    const { userId, reason } = req.body;

    // Mark all referrals from this user as flagged
    await db('referrals')
      .where('referrer_id', userId)
      .orWhere('referee_id', userId)
      .update({
        flagged: true,
        flag_reason: reason
      });

    // TODO: Call smart contract flagUser() function

    res.json({
      success: true,
      message: 'User flagged successfully',
    });
  } catch (error) {
    console.error('Error flagging user:', error);
    res.status(500).json({ success: false, error: 'Failed to flag user' });
  }
});

export default router;
