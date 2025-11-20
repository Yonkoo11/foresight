/**
 * Profile Page
 * Shows user's CT Mastery Score and NFT with mock data
 */

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { AchievementSystem } from '../components/AchievementSystem';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

export default function Profile() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'achievements' | 'history' | 'nft'>('overview');

  // Mock user stats - will be replaced with contract data
  const mockStats = address ? {
    ctMasteryScore: 73,
    draftScore: 24,
    ctIQ: 21,
    timecaster: 28,
    arenaWins: 12,
    arenaLosses: 8,
    arenaWinRate: 60,
    gauntletDaysPlayed: 15,
    gauntletAvgScore: 4.2,
    draftRank: 42,
    whispererIQ: 68,
    totalEarnings: 2.5, // ETH
    nftTier: 'Gold',
  } : {
    ctMasteryScore: 0,
    draftScore: 0,
    ctIQ: 0,
    timecaster: 0,
    arenaWins: 0,
    arenaLosses: 0,
    arenaWinRate: 0,
    gauntletDaysPlayed: 0,
    gauntletAvgScore: 0,
    draftRank: 0,
    whispererIQ: 0,
    totalEarnings: 0,
    nftTier: 'Bronze',
  };

  // Recent activity mock data
  const recentActivity = address ? [
    { type: 'arena', result: 'won', game: 'Price Duel vs 0x1234...5678', reward: '+0.2 ETH', time: '2 hours ago' },
    { type: 'gauntlet', result: 'completed', game: 'Daily Gauntlet Day #42', reward: '+0.15 ETH', time: '5 hours ago' },
    { type: 'draft', result: 'ranked', game: 'Weekly Draft Competition', reward: 'Rank #42', time: '1 day ago' },
    { type: 'whisperer', result: 'played', game: 'CT Whisperer Quiz', reward: '+5 CT IQ', time: '2 days ago' },
  ] : [];

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-12">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Connect your wallet to view your profile, stats, and Foresight NFT</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Your Profile
          </h1>
          <div className="font-mono text-sm text-gray-500">{address}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Earnings</div>
          <div className="text-2xl font-bold text-green-400">{mockStats.totalEarnings.toFixed(2)} ETH</div>
        </div>
      </div>

      {/* CT Mastery Score Banner */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-xl p-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 text-center">
            <div className="text-6xl mb-2">🎖️</div>
            <h2 className="text-xl font-bold mb-1">CT Mastery</h2>
            <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {mockStats.ctMasteryScore}
            </div>
          </div>
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-cyan-400 mb-1">{mockStats.draftScore}</div>
              <div className="text-sm text-gray-400">Draft Score</div>
              <div className="text-xs text-gray-500 mt-1">30% weight</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-purple-400 mb-1">{mockStats.ctIQ}</div>
              <div className="text-sm text-gray-400">CT IQ</div>
              <div className="text-xs text-gray-500 mt-1">30% weight</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-pink-400 mb-1">{mockStats.timecaster}</div>
              <div className="text-sm text-gray-400">Timecaster</div>
              <div className="text-xs text-gray-500 mt-1">40% weight</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
          }`}
        >
          📊 Analytics
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'achievements'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
          }`}
        >
          🏆 Achievements
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
          }`}
        >
          Activity
        </button>
        <button
          onClick={() => setActiveTab('nft')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'nft'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
          }`}
        >
          Foresight NFT
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Arena Stats */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚔️</span>
              <h3 className="text-xl font-bold">Arena Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Duels</span>
                <span className="text-xl font-bold">{mockStats.arenaWins + mockStats.arenaLosses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wins</span>
                <span className="text-xl font-bold text-green-400">{mockStats.arenaWins}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Losses</span>
                <span className="text-xl font-bold text-red-400">{mockStats.arenaLosses}</span>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-2xl font-bold text-cyan-400">{mockStats.arenaWinRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gauntlet Stats */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎯</span>
              <h3 className="text-xl font-bold">Gauntlet Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Days Played</span>
                <span className="text-xl font-bold">{mockStats.gauntletDaysPlayed}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Avg Score</span>
                <span className="text-xl font-bold text-purple-400">{mockStats.gauntletAvgScore}/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Best Score</span>
                <span className="text-xl font-bold text-green-400">5/5</span>
              </div>
              <div className="pt-3 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Current Streak</span>
                  <span className="text-2xl font-bold text-yellow-400">7 days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Draft Stats */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏆</span>
              <h3 className="text-xl font-bold">Draft Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Rank</span>
                <span className="text-2xl font-bold text-cyan-400">#{mockStats.draftRank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Team Score</span>
                <span className="text-xl font-bold">2,487</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Best Rank</span>
                <span className="text-xl font-bold text-yellow-400">#12</span>
              </div>
            </div>
          </div>

          {/* Whisperer Stats */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🧠</span>
              <h3 className="text-xl font-bold">CT Whisperer</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">CT IQ Score</span>
                <span className="text-2xl font-bold text-purple-400">{mockStats.whispererIQ}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Games Played</span>
                <span className="text-xl font-bold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Accuracy</span>
                <span className="text-xl font-bold text-green-400">74%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <AnalyticsDashboard />
      )}

      {activeTab === 'achievements' && (
        <AchievementSystem />
      )}

      {activeTab === 'history' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">
                    {activity.type === 'arena' && '⚔️'}
                    {activity.type === 'gauntlet' && '🎯'}
                    {activity.type === 'draft' && '🏆'}
                    {activity.type === 'whisperer' && '🧠'}
                  </div>
                  <div>
                    <div className="font-medium">{activity.game}</div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${activity.result === 'won' ? 'text-green-400' : activity.result === 'completed' ? 'text-cyan-400' : 'text-gray-400'}`}>
                    {activity.reward}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'nft' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">Your Foresight NFT</h3>
            <div className="aspect-square bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border-2 border-gray-700 mb-4">
              <div className="text-center">
                <div className="text-8xl mb-4">🔮</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {mockStats.nftTier} Tier
                </div>
                <div className="text-gray-400">Level {Math.floor(mockStats.ctMasteryScore / 10)}</div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Your NFT evolves as you play and increases your mastery score
              </p>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">NFT Attributes</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Arena Mastery</span>
                  <span className="text-cyan-400">{mockStats.arenaWinRate}%</span>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                    style={{ width: `${mockStats.arenaWinRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Gauntlet Mastery</span>
                  <span className="text-purple-400">{((mockStats.gauntletAvgScore / 5) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                    style={{ width: `${(mockStats.gauntletAvgScore / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">CT Knowledge</span>
                  <span className="text-yellow-400">{mockStats.whispererIQ}%</span>
                </div>
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all"
                    style={{ width: `${mockStats.whispererIQ}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Next Tier Progress</div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 transition-all"
                    style={{ width: `${(mockStats.ctMasteryScore % 20) * 5}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {mockStats.ctMasteryScore % 20}/20 points to next tier
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
