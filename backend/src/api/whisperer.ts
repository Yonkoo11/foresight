/**
 * CT Whisperer API v2
 * Sentiment/Stance guessing game - "What would [Influencer] say about [Topic]?"
 *
 * NON-MONETIZED: Just for fun, XP, and reputation
 */

import { Router, Request, Response } from 'express';
import db from '../utils/db';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router: Router = Router();

/**
 * GET /api/whisperer/question
 * Get a random unanswered question for the user
 */
router.get(
  '/question',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    // Get user's wallet address
    const user = await db('users').where('id', userId).first();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const walletAddress = user.wallet_address;

    // Get questions user hasn't answered yet
    const unansweredQuestions = await db('whisperer_questions as q')
      .leftJoin('whisperer_user_answers as a', function() {
        this.on('q.id', '=', 'a.question_id')
          .andOn('a.wallet_address', '=', db.raw('?', [walletAddress]));
      })
      .whereNull('a.id')
      .where('q.is_active', true)
      .select(
        'q.id',
        'q.influencer_id',
        'q.topic',
        'q.question',
        'q.category',
        'q.difficulty',
        'q.option_a',
        'q.option_b',
        'q.option_c',
        'q.option_d'
        // NOTE: Don't include correct_answer or explanation yet
      );

    if (unansweredQuestions.length === 0) {
      return res.json({
        success: false,
        message: 'You\'ve answered all available questions! Check back soon for more.',
        allComplete: true,
      });
    }

    // Pick random question from unanswered pool
    const randomQuestion = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];

    // Get influencer details
    const influencer = await db('influencers')
      .where('id', randomQuestion.influencer_id)
      .first();

    res.json({
      success: true,
      question: {
        id: randomQuestion.id,
        influencer: {
          id: influencer.id,
          name: influencer.name,
          handle: influencer.handle,
          tier: influencer.tier,
        },
        topic: randomQuestion.topic,
        question: randomQuestion.question,
        category: randomQuestion.category,
        difficulty: randomQuestion.difficulty,
        options: {
          A: randomQuestion.option_a,
          B: randomQuestion.option_b,
          C: randomQuestion.option_c,
          D: randomQuestion.option_d,
        },
      },
    });
  })
);

/**
 * POST /api/whisperer/answer
 * Submit answer to a question
 */
router.post(
  '/answer',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { questionId, selectedOption, timeTakenMs } = req.body;

    if (
      !questionId ||
      selectedOption === undefined ||
      timeTakenMs === undefined
    ) {
      throw new AppError('Missing required fields', 400);
    }

    // Get question
    const question = await db('whisperer_questions')
      .where({ id: questionId })
      .first();

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    const correct = selectedOption === question.correct_option;

    // Record attempt
    await db('whisperer_attempts').insert({
      id: uuidv4(),
      user_id: userId,
      question_id: questionId,
      selected_option: selectedOption,
      correct,
      time_taken_ms: timeTakenMs,
      created_at: db.fn.now(),
    });

    // Update question stats
    await db('whisperer_questions')
      .where({ id: questionId })
      .increment('times_shown', 1)
      .increment('times_correct', correct ? 1 : 0);

    // Recalculate success rate
    const updated = await db('whisperer_questions')
      .where({ id: questionId })
      .first();

    await db('whisperer_questions')
      .where({ id: questionId })
      .update({
        success_rate:
          updated.times_shown > 0
            ? (updated.times_correct * 100) / updated.times_shown
            : 0,
      });

    // Update user leaderboard
    await updateUserLeaderboard(userId);

    // Get updated user stats
    const userStats = await db('whisperer_leaderboard')
      .where({ user_id: userId })
      .first();

    res.json({
      correct,
      correctOption: question.correct_option,
      authorHandle: question.author_handle,
      userStats: userStats || {
        totalAttempts: 0,
        correctAnswers: 0,
        ctIQ: 0,
        currentStreak: 0,
        bestStreak: 0,
        accuracy: 0,
      },
    });
  })
);

/**
 * GET /api/whisperer/user/:walletAddress/stats
 * Get user whisperer stats
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

    const stats = await db('whisperer_leaderboard')
      .where({ user_id: user.id })
      .first();

    if (!stats) {
      return res.json({
        stats: {
          totalAttempts: 0,
          correctAnswers: 0,
          ctIQ: 0,
          currentStreak: 0,
          bestStreak: 0,
          accuracy: 0,
          avgTimeMs: 0,
        },
      });
    }

    res.json({ stats });
  })
);

/**
 * GET /api/whisperer/leaderboard
 * Get whisperer leaderboard
 */
router.get(
  '/leaderboard',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;
    const sortBy = (req.query.sortBy as string) || 'ct_iq';

    const validSortColumns = ['ct_iq', 'accuracy', 'best_streak'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'ct_iq';

    const results = await db('whisperer_leaderboard')
      .join('users', 'whisperer_leaderboard.user_id', 'users.id')
      .select(
        'whisperer_leaderboard.*',
        'users.wallet_address',
        'users.username',
        'users.avatar_url'
      )
      .orderBy(sortColumn, 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('whisperer_leaderboard').count('* as count').first();

    res.json({
      results,
      total: parseInt(total?.count as string) || 0,
      limit,
      offset,
    });
  })
);

/**
 * Update user leaderboard stats
 */
async function updateUserLeaderboard(userId: string): Promise<void> {
  // Get all user attempts
  const attempts = await db('whisperer_attempts')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc');

  const totalAttempts = attempts.length;
  const correctAnswers = attempts.filter((a) => a.correct).length;
  const accuracy = totalAttempts > 0 ? (correctAnswers * 100) / totalAttempts : 0;

  // Calculate CT IQ (0-100 score based on accuracy and speed)
  const avgTimeMs =
    totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + a.time_taken_ms, 0) / totalAttempts
      : 0;

  // CT IQ formula: accuracy weighted 70%, speed weighted 30%
  const accuracyScore = accuracy * 0.7;
  const speedScore = Math.max(0, (1 - avgTimeMs / 30000) * 30); // 30 seconds = 0 points
  const ctIQ = Math.min(100, Math.round(accuracyScore + speedScore));

  // Calculate streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  for (const attempt of attempts) {
    if (attempt.correct) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Current streak is from most recent attempts
  for (const attempt of attempts) {
    if (attempt.correct) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Upsert leaderboard entry
  const existing = await db('whisperer_leaderboard')
    .where({ user_id: userId })
    .first();

  if (existing) {
    await db('whisperer_leaderboard').where({ user_id: userId }).update({
      total_attempts: totalAttempts,
      correct_answers: correctAnswers,
      ct_iq: ctIQ,
      current_streak: currentStreak,
      best_streak: bestStreak,
      accuracy,
      avg_time_ms: Math.round(avgTimeMs),
      last_attempt_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
  } else {
    await db('whisperer_leaderboard').insert({
      id: uuidv4(),
      user_id: userId,
      total_attempts: totalAttempts,
      correct_answers: correctAnswers,
      ct_iq: ctIQ,
      current_streak: currentStreak,
      best_streak: bestStreak,
      accuracy,
      avg_time_ms: Math.round(avgTimeMs),
      last_attempt_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
  }
}

export default router;
