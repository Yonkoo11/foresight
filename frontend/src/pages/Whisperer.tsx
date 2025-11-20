/**
 * CT Whisperer v2
 * Sentiment/Stance guessing game - "What would [Influencer] say about [Topic]?"
 * NON-MONETIZED: Just for fun, XP, and reputation
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNotifications } from '../contexts/NotificationContext';
import { getInfluencerAvatar } from '../data/influencerAvatars';

interface Question {
  id: number;
  influencer: {
    id: number;
    name: string;
    handle: string;
    tier: string;
  };
  topic: string;
  question: string;
  category: string;
  difficulty: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface AnswerResult {
  isCorrect: boolean;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  xpEarned: number;
  selectedAnswer: 'A' | 'B' | 'C' | 'D';
}

interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracyRate: number;
  totalXP: number;
  currentStreak: number;
  bestStreak: number;
  categoryBreakdown: {
    tech: { correct: number; total: number; accuracy: string };
    market: { correct: number; total: number; accuracy: string };
    governance: { correct: number; total: number; accuracy: string };
    culture: { correct: number; total: number; accuracy: string };
  };
}

export default function Whisperer() {
  const { address } = useAccount();
  const { showSuccess, showError } = useNotifications();

  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [allComplete, setAllComplete] = useState(false);

  // Fetch a new question
  const fetchQuestion = async () => {
    if (!address) return;

    try {
      setIsLoading(true);
      setAnswerResult(null);
      setSelectedAnswer(null);

      const response = await fetch('/api/whisperer/question', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.allComplete) {
        setAllComplete(true);
        setQuestion(null);
      } else if (data.success && data.question) {
        setQuestion(data.question);
        setStartTime(Date.now());
      } else {
        showError('Failed to load question', 'Please try again');
      }
    } catch (error) {
      console.error('Error fetching question:', error);
      showError('Network Error', 'Could not load question');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit answer
  const submitAnswer = async () => {
    if (!selectedAnswer || !question || !address) return;

    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);

    try {
      setIsLoading(true);

      const response = await fetch('/api/whisperer/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          questionId: question.id,
          selectedAnswer,
          timeTakenSeconds,
        }),
      });

      const data = await response.json();

      if (data.success && data.result) {
        setAnswerResult(data.result);

        if (data.result.isCorrect) {
          showSuccess('Correct!', `+${data.result.xpEarned} XP`);
        }
      } else {
        showError('Failed to submit', 'Please try again');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      showError('Network Error', 'Could not submit answer');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user stats
  const fetchStats = async () => {
    if (!address) return;

    try {
      const response = await fetch('/api/whisperer/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (data.success && data.stats) {
        setUserStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Load first question on mount
  useEffect(() => {
    if (address) {
      fetchQuestion();
      fetchStats();
    }
  }, [address]);

  const categoryColors: Record<string, string> = {
    tech: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    market: 'bg-green-500/10 text-green-400 border-green-500/30',
    governance: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    culture: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  };

  const difficultyStars = {
    easy: '⭐',
    medium: '⭐⭐',
    hard: '⭐⭐⭐',
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              CT Whisperer
            </h1>
            <p className="text-gray-400 text-sm">
              Test your knowledge of crypto twitter influencers
            </p>
          </div>
          <button
            onClick={() => {
              setShowStats(true);
              fetchStats();
            }}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded-lg text-sm transition-all"
          >
            Your Stats
          </button>
        </div>

        {/* XP Bar - Compact */}
        {userStats && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-gray-400">XP: </span>
                  <span className="font-bold text-white">{userStats.totalXP}</span>
                </div>
                <div>
                  <span className="text-gray-400">Accuracy: </span>
                  <span className="font-bold text-cyan-400">{userStats.accuracyRate.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-400">Streak: </span>
                  <span className="font-bold text-orange-400">🔥 {userStats.currentStreak}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {userStats.totalQuestions} questions answered
              </div>
            </div>
          </div>
        )}
      </div>

      {!address ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold mb-4">Connect to Play</h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Connect your wallet to test your knowledge of crypto twitter personalities and earn XP.
          </p>
        </div>
      ) : allComplete ? (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-4">All Questions Complete!</h2>
          <p className="text-gray-400 mb-6">
            You've answered all available questions. Check back soon for more!
          </p>
          {userStats && (
            <div className="inline-block bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">Final Stats</div>
              <div className="text-3xl font-bold text-cyan-400 mb-1">{userStats.totalXP} XP</div>
              <div className="text-sm text-gray-400">{userStats.accuracyRate.toFixed(1)}% accuracy</div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
          {isLoading && !question ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3 animate-pulse">⏳</div>
              <p className="text-gray-400">Loading question...</p>
            </div>
          ) : question ? (
            <>
              {/* Question Header */}
              <div className="p-6 border-b border-gray-700 bg-gray-900/50">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={getInfluencerAvatar(question.influencer.handle)}
                    alt={question.influencer.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-600"
                  />
                  <div>
                    <div className="font-bold text-white text-lg">{question.influencer.name}</div>
                    <div className="text-sm text-gray-400">@{question.influencer.handle}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Topic</div>
                  <div className="text-sm text-gray-300">{question.topic}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs border ${categoryColors[question.category] || categoryColors.tech}`}>
                    {question.category}
                  </span>
                  <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300">
                    {difficultyStars[question.difficulty as keyof typeof difficultyStars]}
                  </span>
                </div>
              </div>

              {/* Question */}
              <div className="p-6">
                <div className="text-xl font-medium text-white mb-6">
                  {question.question}
                </div>

                {/* Answer Options */}
                <div className="space-y-3 mb-6">
                  {(['A', 'B', 'C', 'D'] as const).map((option) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = answerResult?.correctAnswer === option;
                    const isWrong = answerResult && selectedAnswer === option && !answerResult.isCorrect;

                    let optionClass = 'bg-gray-800 border-gray-700 hover:border-gray-600 text-white';

                    if (answerResult) {
                      if (isCorrect) {
                        optionClass = 'bg-green-500/20 border-green-500 text-green-400';
                      } else if (isWrong) {
                        optionClass = 'bg-red-500/20 border-red-500 text-red-400';
                      }
                    } else if (isSelected) {
                      optionClass = 'bg-cyan-500/20 border-cyan-500 text-cyan-400';
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => !answerResult && setSelectedAnswer(option)}
                        disabled={!!answerResult}
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${optionClass} ${
                          answerResult ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold">
                            {option}
                          </div>
                          <div className="flex-1 text-sm">
                            {question.options[option]}
                          </div>
                          {isCorrect && <span className="text-xl">✓</span>}
                          {isWrong && <span className="text-xl">✗</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (after answering) */}
                {answerResult && (
                  <div className={`p-4 rounded-lg border mb-6 ${
                    answerResult.isCorrect
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{answerResult.isCorrect ? '✓' : '✗'}</span>
                      <div className="font-bold text-white">
                        {answerResult.isCorrect ? 'Correct!' : 'Wrong'}
                      </div>
                      {answerResult.isCorrect && (
                        <div className="ml-auto text-sm font-bold text-green-400">
                          +{answerResult.xpEarned} XP
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-300">
                      {answerResult.explanation}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {!answerResult ? (
                  <button
                    onClick={submitAnswer}
                    disabled={!selectedAnswer || isLoading}
                    className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Answer'}
                  </button>
                ) : (
                  <button
                    onClick={fetchQuestion}
                    className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all"
                  >
                    Next Question →
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowStats(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Your Stats</h2>
                <button
                  onClick={() => setShowStats(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            {userStats ? (
              <div className="p-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">Total XP</div>
                    <div className="text-2xl font-bold text-cyan-400">{userStats.totalXP}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">Accuracy</div>
                    <div className="text-2xl font-bold text-white">{userStats.accuracyRate.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">Current Streak</div>
                    <div className="text-2xl font-bold text-orange-400">🔥 {userStats.currentStreak}</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-xs text-gray-500 mb-1">Best Streak</div>
                    <div className="text-2xl font-bold text-yellow-400">{userStats.bestStreak}</div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-400">Questions Answered</div>
                    <div className="text-sm font-bold text-white">
                      {userStats.correctAnswers}/{userStats.totalQuestions}
                    </div>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all"
                      style={{ width: `${userStats.totalQuestions > 0 ? (userStats.correctAnswers / userStats.totalQuestions) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Category Breakdown */}
                <div>
                  <div className="text-sm font-bold text-gray-300 mb-3">Category Performance</div>
                  <div className="space-y-2">
                    {Object.entries(userStats.categoryBreakdown).map(([category, stats]) => (
                      <div key={category} className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm text-white capitalize">{category}</div>
                          <div className="text-sm font-bold text-gray-300">
                            {stats.correct}/{stats.total} ({stats.accuracy}%)
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 transition-all"
                            style={{ width: `${stats.accuracy}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-gray-400">No stats yet - answer some questions first!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
