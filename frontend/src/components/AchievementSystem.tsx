/**
 * Achievement System Component
 * Gamification layer with badges, milestones, and rewards
 * Keeps users engaged and creates progression goals
 */

import { useState } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'earnings' | 'predictions' | 'social' | 'streak' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  reward: string;
  progress: number;
  total: number;
  unlocked: boolean;
  unlockedDate?: Date;
}

export function AchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState<Achievement['category'] | 'all'>('all');

  // Mock achievements data
  const achievements: Achievement[] = [
    // Earnings Achievements
    {
      id: 'first-win',
      title: 'First Blood',
      description: 'Win your first game',
      emoji: '🎯',
      category: 'earnings',
      rarity: 'common',
      reward: '0.001 ETH bonus',
      progress: 1,
      total: 1,
      unlocked: true,
      unlockedDate: new Date(Date.now() - 86400000 * 3),
    },
    {
      id: 'eth-hunter',
      title: 'ETH Hunter',
      description: 'Earn 1 ETH total',
      emoji: '💎',
      category: 'earnings',
      rarity: 'rare',
      reward: '5% bonus on next win',
      progress: 0.342,
      total: 1,
      unlocked: false,
    },
    {
      id: 'whale-status',
      title: 'Whale Status',
      description: 'Earn 10 ETH total',
      emoji: '🐋',
      category: 'earnings',
      rarity: 'epic',
      reward: 'Whale badge + 10% permanent bonus',
      progress: 0.342,
      total: 10,
      unlocked: false,
    },
    {
      id: 'jackpot',
      title: 'Jackpot',
      description: 'Win 5+ ETH in a single game',
      emoji: '💰',
      category: 'earnings',
      rarity: 'legendary',
      reward: '0.5 ETH bonus',
      progress: 0,
      total: 1,
      unlocked: false,
    },

    // Prediction Achievements
    {
      id: 'prophet',
      title: 'Prophet',
      description: 'Get 10 predictions correct in a row',
      emoji: '🔮',
      category: 'predictions',
      rarity: 'rare',
      reward: '2x multiplier for 24h',
      progress: 3,
      total: 10,
      unlocked: false,
    },
    {
      id: 'perfect-week',
      title: 'Perfect Week',
      description: 'Win every game for 7 days straight',
      emoji: '⭐',
      category: 'predictions',
      rarity: 'epic',
      reward: '1 ETH bonus',
      progress: 2,
      total: 7,
      unlocked: false,
    },
    {
      id: 'oracle',
      title: 'The Oracle',
      description: 'Maintain 90%+ accuracy over 100 predictions',
      emoji: '👁️',
      category: 'predictions',
      rarity: 'legendary',
      reward: 'Oracle status + Premium forever',
      progress: 12,
      total: 100,
      unlocked: false,
    },

    // Social Achievements
    {
      id: 'influencer',
      title: 'Influencer',
      description: 'Refer 10 active users',
      emoji: '📢',
      category: 'social',
      rarity: 'rare',
      reward: '0.1 ETH bonus',
      progress: 7,
      total: 10,
      unlocked: false,
    },
    {
      id: 'viral-master',
      title: 'Viral Master',
      description: 'Get 1000+ impressions on shared wins',
      emoji: '🔥',
      category: 'social',
      rarity: 'epic',
      reward: '0.25 ETH bonus',
      progress: 342,
      total: 1000,
      unlocked: false,
    },
    {
      id: 'network-effect',
      title: 'Network Effect',
      description: 'Build referral network of 100+ users',
      emoji: '🌐',
      category: 'social',
      rarity: 'legendary',
      reward: '5 ETH bonus + Platinum tier',
      progress: 23,
      total: 100,
      unlocked: false,
    },

    // Streak Achievements
    {
      id: 'consistency',
      title: 'Consistency',
      description: 'Play for 7 days in a row',
      emoji: '📅',
      category: 'streak',
      rarity: 'common',
      reward: '10% bonus multiplier',
      progress: 7,
      total: 7,
      unlocked: true,
      unlockedDate: new Date(Date.now() - 86400000),
    },
    {
      id: 'dedicated',
      title: 'Dedicated',
      description: 'Play for 30 days in a row',
      emoji: '🎖️',
      category: 'streak',
      rarity: 'rare',
      reward: '25% bonus multiplier',
      progress: 7,
      total: 30,
      unlocked: false,
    },
    {
      id: 'unstoppable',
      title: 'Unstoppable',
      description: 'Play for 100 days in a row',
      emoji: '🏆',
      category: 'streak',
      rarity: 'legendary',
      reward: '50% permanent multiplier',
      progress: 7,
      total: 100,
      unlocked: false,
    },

    // Mastery Achievements
    {
      id: 'draft-master',
      title: 'Draft Master',
      description: 'Win 10 CT Draft leagues',
      emoji: '🏅',
      category: 'mastery',
      rarity: 'rare',
      reward: 'Free entry to premium leagues',
      progress: 2,
      total: 10,
      unlocked: false,
    },
    {
      id: 'arena-champion',
      title: 'Arena Champion',
      description: 'Win 25 Arena duels',
      emoji: '⚔️',
      category: 'mastery',
      rarity: 'epic',
      reward: '50% reduced duel fees',
      progress: 8,
      total: 25,
      unlocked: false,
    },
    {
      id: 'grandmaster',
      title: 'Grandmaster',
      description: 'Reach top 10 in global leaderboard',
      emoji: '👑',
      category: 'mastery',
      rarity: 'legendary',
      reward: 'Crown badge + 2 ETH bonus',
      progress: 0,
      total: 1,
      unlocked: false,
    },
  ];

  const categories = [
    { id: 'all' as const, label: 'All', emoji: '🎯' },
    { id: 'earnings' as const, label: 'Earnings', emoji: '💰' },
    { id: 'predictions' as const, label: 'Predictions', emoji: '🔮' },
    { id: 'social' as const, label: 'Social', emoji: '📢' },
    { id: 'streak' as const, label: 'Streaks', emoji: '🔥' },
    { id: 'mastery' as const, label: 'Mastery', emoji: '👑' },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-400';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
    }
  };

  const getRarityBorder = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-500/30';
      case 'rare': return 'border-blue-500/30';
      case 'epic': return 'border-purple-500/30';
      case 'legendary': return 'border-yellow-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Achievements</h2>
            <p className="text-sm text-gray-400">Unlock badges and earn bonus rewards</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-xs text-gray-500">Unlocked</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-purple-400 font-bold">{completionPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Rarity Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {(['common', 'rare', 'epic', 'legendary'] as const).map((rarity) => {
            const count = achievements.filter(a => a.rarity === rarity && a.unlocked).length;
            const total = achievements.filter(a => a.rarity === rarity).length;
            return (
              <div key={rarity} className="bg-gray-800/30 rounded-lg p-2 text-center">
                <div className={`text-sm font-bold bg-gradient-to-r ${getRarityColor(rarity)} bg-clip-text text-transparent`}>
                  {count}/{total}
                </div>
                <div className="text-[10px] text-gray-500 capitalize">{rarity}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-gray-800/50 rounded-xl overflow-hidden border ${
              achievement.unlocked
                ? getRarityBorder(achievement.rarity)
                : 'border-gray-700'
            } ${
              achievement.unlocked ? '' : 'opacity-75'
            }`}
          >
            {/* Achievement Header */}
            <div className={`p-4 ${
              achievement.unlocked
                ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)}/10`
                : 'bg-gray-800/30'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{achievement.emoji}</div>
                  <div>
                    <h3 className="font-bold text-white">{achievement.title}</h3>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Rarity Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} text-white font-bold uppercase`}>
                  {achievement.rarity}
                </span>
                <span className="text-xs text-green-400 font-medium">
                  🎁 {achievement.reward}
                </span>
              </div>

              {/* Progress Bar (if not unlocked) */}
              {!achievement.unlocked && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-400 font-bold">
                      {achievement.progress >= 1
                        ? `${achievement.progress}/${achievement.total}`
                        : `${(achievement.progress * 100 / achievement.total).toFixed(1)}%`
                      }
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getRarityColor(achievement.rarity)} transition-all`}
                      style={{ width: `${Math.min((achievement.progress / achievement.total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Unlocked Date */}
              {achievement.unlocked && achievement.unlockedDate && (
                <div className="text-xs text-gray-500 mt-2">
                  Unlocked {achievement.unlockedDate.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Benefits */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
          <span>💡</span> Why Chase Achievements?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-green-400 flex-shrink-0">✓</span>
            <p className="text-gray-300">
              <strong>Bonus Rewards</strong> - Each achievement unlocks ETH bonuses or multipliers
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 flex-shrink-0">✓</span>
            <p className="text-gray-300">
              <strong>Status & Prestige</strong> - Show off rare badges to other players
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 flex-shrink-0">✓</span>
            <p className="text-gray-300">
              <strong>Permanent Perks</strong> - Legendary achievements unlock lifetime benefits
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400 flex-shrink-0">✓</span>
            <p className="text-gray-300">
              <strong>Track Progress</strong> - Clear goals help you improve and earn more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
