/**
 * Daily Quest System
 * Drives daily engagement through rewarded tasks
 * Creates habit loops and increases retention
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

type QuestType = 'daily' | 'weekly';
type QuestCategory = 'predictions' | 'social' | 'earnings' | 'participation';

interface Quest {
  id: string;
  type: QuestType;
  category: QuestCategory;
  title: string;
  description: string;
  reward: {
    type: 'eth' | 'multiplier' | 'free_play' | 'nft';
    amount: string;
    icon: string;
  };
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  expiresAt: Date;
}

export function DailyQuests() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<QuestType>('daily');
  const [quests, setQuests] = useState<Quest[]>([]);
  const currentStreak = 7;
  const freePlaysRemaining = 3;

  // Initialize quests
  useEffect(() => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);

    const dailyQuests: Quest[] = [
      {
        id: 'daily-predictions',
        type: 'daily',
        category: 'predictions',
        title: 'Make 3 Predictions',
        description: 'Submit predictions in any game mode',
        reward: { type: 'eth', amount: '0.01 ETH', icon: '💰' },
        progress: 1,
        target: 3,
        completed: false,
        claimed: false,
        expiresAt: endOfDay,
      },
      {
        id: 'daily-vote',
        type: 'daily',
        category: 'participation',
        title: 'Vote on 5 Arena Duels',
        description: 'Vote on active predictions to earn rewards',
        reward: { type: 'eth', amount: '0.02 ETH', icon: '📈' },
        progress: 2,
        target: 5,
        completed: false,
        claimed: false,
        expiresAt: endOfDay,
      },
      {
        id: 'daily-share',
        type: 'daily',
        category: 'social',
        title: 'Share on Twitter',
        description: 'Share your prediction or win on social media',
        reward: { type: 'free_play', amount: '1 Free Gauntlet', icon: '🎯' },
        progress: 0,
        target: 1,
        completed: false,
        claimed: false,
        expiresAt: endOfDay,
      },
      {
        id: 'daily-win',
        type: 'daily',
        category: 'earnings',
        title: 'Win Any Game',
        description: 'Secure a victory in Draft, Arena, or Gauntlet',
        reward: { type: 'multiplier', amount: '2x earnings for 24h', icon: '🔥' },
        progress: 0,
        target: 1,
        completed: false,
        claimed: false,
        expiresAt: endOfDay,
      },
    ];

    const weeklyQuests: Quest[] = [
      {
        id: 'weekly-streak',
        type: 'weekly',
        category: 'participation',
        title: 'Play 5 Days This Week',
        description: 'Log in and play for 5 different days',
        reward: { type: 'eth', amount: '0.1 ETH', icon: '💎' },
        progress: 3,
        target: 5,
        completed: false,
        claimed: false,
        expiresAt: endOfWeek,
      },
      {
        id: 'weekly-wins',
        type: 'weekly',
        category: 'earnings',
        title: 'Win 10 Games',
        description: 'Accumulate 10 victories across all game modes',
        reward: { type: 'eth', amount: '0.25 ETH', icon: '🏆' },
        progress: 4,
        target: 10,
        completed: false,
        claimed: false,
        expiresAt: endOfWeek,
      },
      {
        id: 'weekly-referral',
        type: 'weekly',
        category: 'social',
        title: 'Refer 3 Friends',
        description: 'Get 3 friends to sign up and make their first bet',
        reward: { type: 'eth', amount: '0.15 ETH bonus', icon: '📢' },
        progress: 1,
        target: 3,
        completed: false,
        claimed: false,
        expiresAt: endOfWeek,
      },
      {
        id: 'weekly-leaderboard',
        type: 'weekly',
        category: 'earnings',
        title: 'Reach Top 50',
        description: 'Climb to top 50 on any leaderboard',
        reward: { type: 'nft', amount: 'Exclusive NFT Badge', icon: '🎖️' },
        progress: 0,
        target: 1,
        completed: false,
        claimed: false,
        expiresAt: endOfWeek,
      },
    ];

    setQuests([...dailyQuests, ...weeklyQuests]);
  }, []);

  const filteredQuests = quests.filter(q => q.type === activeTab);
  const completedCount = filteredQuests.filter(q => q.completed || q.progress >= q.target).length;

  const claimReward = (questId: string) => {
    setQuests(prev => prev.map(q =>
      q.id === questId ? { ...q, claimed: true, completed: true } : q
    ));
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getCategoryColor = (category: QuestCategory) => {
    switch (category) {
      case 'predictions': return 'from-blue-500 to-cyan-500';
      case 'social': return 'from-purple-500 to-pink-500';
      case 'earnings': return 'from-green-500 to-emerald-500';
      case 'participation': return 'from-orange-500 to-red-500';
    }
  };

  const getCategoryIcon = (category: QuestCategory) => {
    switch (category) {
      case 'predictions': return '🔮';
      case 'social': return '📢';
      case 'earnings': return '💰';
      case 'participation': return '⚡';
    }
  };

  if (!address) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-bold mb-2">Daily Quests</h3>
        <p className="text-gray-400 mb-4">Complete quests to earn rewards and bonuses</p>
        <p className="text-sm text-gray-500">Connect your wallet to view quests</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Daily Quests</h2>
            <p className="text-sm text-gray-400">Complete tasks to earn rewards</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              {currentStreak}
            </div>
            <div className="text-xs text-gray-500">Day Streak 🔥</div>
          </div>
        </div>

        {/* Free Plays Banner */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <div className="text-sm font-bold text-green-400">Free Daily Plays</div>
                <div className="text-xs text-gray-400">Reset in {getTimeRemaining(new Date(new Date().setHours(23, 59, 59)))}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{freePlaysRemaining}</div>
              <div className="text-xs text-gray-500">Remaining</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-900/50">
        <button
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-3 px-4 font-medium transition-all ${
            activeTab === 'daily'
              ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Daily ({quests.filter(q => q.type === 'daily' && (q.completed || q.progress >= q.target)).length}/{quests.filter(q => q.type === 'daily').length})
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`flex-1 py-3 px-4 font-medium transition-all ${
            activeTab === 'weekly'
              ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Weekly ({quests.filter(q => q.type === 'weekly' && (q.completed || q.progress >= q.target)).length}/{quests.filter(q => q.type === 'weekly').length})
        </button>
      </div>

      {/* Quest List */}
      <div className="divide-y divide-gray-800">
        {filteredQuests.map((quest) => {
          const isCompleted = quest.progress >= quest.target;
          const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);

          return (
            <div
              key={quest.id}
              className={`p-4 ${quest.claimed ? 'opacity-50' : 'hover:bg-gray-800/30'} transition-all`}
            >
              <div className="flex items-start gap-4">
                {/* Category Icon */}
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getCategoryColor(quest.category)}/20 border border-gray-700 flex items-center justify-center text-2xl flex-shrink-0`}>
                  {getCategoryIcon(quest.category)}
                </div>

                {/* Quest Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-white mb-1">{quest.title}</h3>
                      <p className="text-sm text-gray-400">{quest.description}</p>
                    </div>
                    {quest.claimed ? (
                      <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs font-bold text-green-400">
                        <span>✓</span> Claimed
                      </div>
                    ) : isCompleted ? (
                      <button
                        onClick={() => claimReward(quest.id)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-bold rounded-lg transition-all animate-pulse"
                      >
                        Claim Reward
                      </button>
                    ) : null}
                  </div>

                  {/* Progress Bar */}
                  {!quest.claimed && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-bold text-gray-300">
                          {quest.progress}/{quest.target}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getCategoryColor(quest.category)} transition-all`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Reward & Time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{quest.reward.icon}</span>
                      <span className={`text-sm font-bold bg-gradient-to-r ${getCategoryColor(quest.category)} bg-clip-text text-transparent`}>
                        {quest.reward.amount}
                      </span>
                    </div>
                    {!quest.claimed && (
                      <div className="text-xs text-gray-500">
                        ⏰ {getTimeRemaining(quest.expiresAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/50">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-400">
            Completed: <span className="font-bold text-white">{completedCount}/{filteredQuests.length}</span>
          </div>
          <div className="text-gray-400">
            Total rewards earned: <span className="font-bold text-green-400">0.42 ETH</span>
          </div>
        </div>
      </div>
    </div>
  );
}
