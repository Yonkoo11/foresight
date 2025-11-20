/**
 * Leaderboard Page
 * Shows top users by CT Mastery Score across different categories
 */

import React, { useState } from 'react';
import { useAccount } from 'wagmi';

type LeaderboardTab = 'overall' | 'draft' | 'whisperer' | 'arena' | 'gauntlet' | 'earnings' | 'referrals';
type TimeFilter = 'weekly' | 'alltime';
type DraftLeague = 'free' | 'prize';

interface LeaderboardEntry {
  rank: number;
  address: string;
  score: number;
  draft: number;
  ctIQ: number;
  timecaster: number;
  arenaWins?: number;
  gauntletStreak?: number;
  totalEarnings?: number;
  weeklyEarnings?: number;
  referrals?: number;
  referralEarnings?: number;
  teamName?: string;
  teamScore?: number;
  prize?: number;
  xp?: number;
}

export default function Leaderboard() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('overall');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('alltime');
  const [draftLeague, setDraftLeague] = useState<DraftLeague>('prize');
  const [selectedWeek, setSelectedWeek] = useState<number>(12); // Current week
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  // Mock CT Draft prize league leaderboard
  const draftPrizeLeague: LeaderboardEntry[] = [
    { rank: 1, address: '0x742d...3f2a', score: 95, draft: 28, ctIQ: 29, timecaster: 38, teamName: 'CT Gods', teamScore: 4850, prize: 5.0 },
    { rank: 2, address: '0x891c...6b4e', score: 88, draft: 25, ctIQ: 27, timecaster: 36, teamName: 'Moon Boys', teamScore: 4720, prize: 3.125 },
    { rank: 3, address: '0x3a5f...8d1c', score: 82, draft: 24, ctIQ: 25, timecaster: 33, teamName: 'Degen Squad', teamScore: 4590, prize: 1.875 },
    { rank: 4, address: '0x6c2b...4a9f', score: 79, draft: 23, ctIQ: 24, timecaster: 32, teamName: 'Alpha Hunters', teamScore: 4480, prize: 0.625 },
    { rank: 5, address: '0x9f7e...2d3c', score: 76, draft: 22, ctIQ: 23, timecaster: 31, teamName: 'Whale Watchers', teamScore: 4370, prize: 0.625 },
    { rank: 6, address: '0x1234...789a', score: 73, draft: 21, ctIQ: 22, timecaster: 30, teamName: 'Diamond Hands', teamScore: 4280, prize: 0.25 },
    { rank: 7, address: '0x2345...89ab', score: 70, draft: 20, ctIQ: 21, timecaster: 29, teamName: 'WAGMI Crew', teamScore: 4190, prize: 0.25 },
    { rank: 8, address: '0x3456...9abc', score: 67, draft: 19, ctIQ: 20, timecaster: 28, teamName: 'Ape Together', teamScore: 4120, prize: 0.25 },
    { rank: 9, address: '0x4567...abcd', score: 64, draft: 18, ctIQ: 19, timecaster: 27, teamName: 'Bull Market', teamScore: 4050, prize: 0.25 },
    { rank: 10, address: '0x5678...bcde', score: 61, draft: 17, ctIQ: 18, timecaster: 26, teamName: 'Giga Brains', teamScore: 3990, prize: 0.25 },
    ...(address ? [{ rank: 42, address: address, score: 45, draft: 12, ctIQ: 15, timecaster: 18, teamName: 'My Team', teamScore: 2850, prize: 0 }] : []),
  ];

  // Mock CT Draft free league leaderboard
  const draftFreeLeague: LeaderboardEntry[] = [
    { rank: 1, address: '0x1234...5678', score: 72, draft: 20, ctIQ: 22, timecaster: 30, teamName: 'CT Rookies', teamScore: 4200, xp: 500 },
    { rank: 2, address: '0x2345...6789', score: 68, draft: 19, ctIQ: 21, timecaster: 28, teamName: 'Learning Crew', teamScore: 4100, xp: 300 },
    { rank: 3, address: '0x3456...789a', score: 65, draft: 18, ctIQ: 20, timecaster: 27, teamName: 'Practice Squad', teamScore: 3950, xp: 200 },
    { rank: 4, address: '0x4567...89ab', score: 62, draft: 17, ctIQ: 19, timecaster: 26, teamName: 'The Newbies', teamScore: 3820, xp: 150 },
    { rank: 5, address: '0x5678...9abc', score: 59, draft: 16, ctIQ: 18, timecaster: 25, teamName: 'Future Stars', teamScore: 3720, xp: 120 },
    { rank: 6, address: '0x6789...abcd', score: 56, draft: 15, ctIQ: 17, timecaster: 24, teamName: 'Rising Phoenix', teamScore: 3650, xp: 100 },
    { rank: 7, address: '0x789a...bcde', score: 53, draft: 14, ctIQ: 16, timecaster: 23, teamName: 'The Underdogs', teamScore: 3580, xp: 100 },
    { rank: 8, address: '0x89ab...cdef', score: 50, draft: 13, ctIQ: 15, timecaster: 22, teamName: 'Beginners Luck', teamScore: 3500, xp: 100 },
    { rank: 9, address: '0x9abc...def0', score: 47, draft: 12, ctIQ: 14, timecaster: 21, teamName: 'Learn & Earn', teamScore: 3420, xp: 100 },
    { rank: 10, address: '0xabcd...ef01', score: 44, draft: 11, ctIQ: 13, timecaster: 20, teamName: 'Training Mode', teamScore: 3350, xp: 100 },
    ...(address ? [{ rank: 127, address: address, score: 28, draft: 8, ctIQ: 9, timecaster: 11, teamName: 'My Team', teamScore: 1950, xp: 0 }] : []),
  ];

  // Mock overall leaderboard
  const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, address: '0x1234...5678', score: 95, draft: 28, ctIQ: 29, timecaster: 38, arenaWins: 45, gauntletStreak: 12, totalEarnings: 24.5, weeklyEarnings: 4.2, referrals: 127, referralEarnings: 3.8 },
    { rank: 2, address: '0x2345...6789', score: 88, draft: 25, ctIQ: 27, timecaster: 36, arenaWins: 38, gauntletStreak: 10, totalEarnings: 18.3, weeklyEarnings: 3.5, referrals: 89, referralEarnings: 2.1 },
    { rank: 3, address: '0x3456...789a', score: 82, draft: 24, ctIQ: 25, timecaster: 33, arenaWins: 32, gauntletStreak: 9, totalEarnings: 15.7, weeklyEarnings: 2.8, referrals: 64, referralEarnings: 1.9 },
    { rank: 4, address: '0x4567...89ab', score: 79, draft: 23, ctIQ: 24, timecaster: 32, arenaWins: 28, gauntletStreak: 8, totalEarnings: 12.4, weeklyEarnings: 2.1, referrals: 52, referralEarnings: 1.5 },
    { rank: 5, address: '0x5678...9abc', score: 76, draft: 22, ctIQ: 23, timecaster: 31, arenaWins: 25, gauntletStreak: 7, totalEarnings: 10.2, weeklyEarnings: 1.8, referrals: 38, referralEarnings: 1.2 },
    { rank: 6, address: '0x6789...abcd', score: 73, draft: 21, ctIQ: 22, timecaster: 30, arenaWins: 22, gauntletStreak: 6, totalEarnings: 8.9, weeklyEarnings: 1.5, referrals: 29, referralEarnings: 0.9 },
    { rank: 7, address: '0x789a...bcde', score: 70, draft: 20, ctIQ: 21, timecaster: 29, arenaWins: 20, gauntletStreak: 5, totalEarnings: 7.6, weeklyEarnings: 1.2, referrals: 23, referralEarnings: 0.7 },
    { rank: 8, address: '0x89ab...cdef', score: 67, draft: 19, ctIQ: 20, timecaster: 28, arenaWins: 18, gauntletStreak: 5, totalEarnings: 6.3, weeklyEarnings: 0.9, referrals: 18, referralEarnings: 0.5 },
    { rank: 9, address: '0x9abc...def0', score: 64, draft: 18, ctIQ: 19, timecaster: 27, arenaWins: 16, gauntletStreak: 4, totalEarnings: 5.1, weeklyEarnings: 0.7, referrals: 14, referralEarnings: 0.4 },
    { rank: 10, address: '0xabcd...ef01', score: 61, draft: 17, ctIQ: 18, timecaster: 26, arenaWins: 14, gauntletStreak: 4, totalEarnings: 4.2, weeklyEarnings: 0.5, referrals: 11, referralEarnings: 0.3 },
  ];

  // Sort based on active tab and time filter
  const getSortedLeaderboard = () => {
    switch (activeTab) {
      case 'draft':
        // Return league-specific leaderboard
        return draftLeague === 'prize' ? draftPrizeLeague : draftFreeLeague;
      case 'whisperer':
        return [...mockLeaderboard].sort((a, b) => b.ctIQ - a.ctIQ);
      case 'arena':
        return [...mockLeaderboard].sort((a, b) => (b.arenaWins || 0) - (a.arenaWins || 0));
      case 'gauntlet':
        return [...mockLeaderboard].sort((a, b) => (b.gauntletStreak || 0) - (a.gauntletStreak || 0));
      case 'earnings':
        if (timeFilter === 'weekly') {
          return [...mockLeaderboard].sort((a, b) => (b.weeklyEarnings || 0) - (a.weeklyEarnings || 0));
        }
        return [...mockLeaderboard].sort((a, b) => (b.totalEarnings || 0) - (a.totalEarnings || 0));
      case 'referrals':
        return [...mockLeaderboard].sort((a, b) => (b.referrals || 0) - (a.referrals || 0));
      default:
        return mockLeaderboard;
    }
  };

  const sortedLeaderboard = getSortedLeaderboard();

  // Dynamic prize pool based on entries
  const prizeLeagueEntryFee = 0.005; // ETH (~$11)
  const prizeLeagueParticipants = 250;
  const currentPrizePool = prizeLeagueParticipants * prizeLeagueEntryFee; // 1.25 ETH

  const totalParticipants = activeTab === 'draft'
    ? (draftLeague === 'prize' ? prizeLeagueParticipants : 1840)
    : sortedLeaderboard.length;

  const tabs = [
    { id: 'overall' as LeaderboardTab, label: 'Overall', icon: '🏆', color: 'from-cyan-500 to-purple-500' },
    { id: 'earnings' as LeaderboardTab, label: 'Top Earners', icon: '💰', color: 'from-green-500 to-emerald-500' },
    { id: 'referrals' as LeaderboardTab, label: 'Referrals', icon: '📢', color: 'from-yellow-500 to-orange-500' },
    { id: 'draft' as LeaderboardTab, label: 'CT Draft', icon: '🏆', color: 'from-blue-500 to-cyan-500' },
    { id: 'whisperer' as LeaderboardTab, label: 'Whisperer', icon: '🧠', color: 'from-purple-500 to-pink-500' },
    { id: 'arena' as LeaderboardTab, label: 'Arena', icon: '⚔️', color: 'from-orange-500 to-red-500' },
    { id: 'gauntlet' as LeaderboardTab, label: 'Gauntlet', icon: '🎯', color: 'from-green-500 to-emerald-500' },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <p className="text-gray-400">
            Top performers across all Timecaster games
          </p>
        </div>
        {/* Time Filter */}
        {(activeTab === 'earnings' || activeTab === 'referrals') && (
          <div className="flex gap-2 bg-gray-800/50 border border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setTimeFilter('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeFilter === 'weekly'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('alltime')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeFilter === 'alltime'
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Time
            </button>
          </div>
        )}

        {/* Draft League Filter */}
        {activeTab === 'draft' && (
          <div className="flex gap-2 bg-gray-800/50 border border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setDraftLeague('prize')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                draftLeague === 'prize'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Prize League
            </button>
            <button
              onClick={() => setDraftLeague('free')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                draftLeague === 'free'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Free League
            </button>
          </div>
        )}
      </div>

      {/* Weekly Prize Pool Banner */}
      {activeTab === 'earnings' && timeFilter === 'weekly' && (
        <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-cyan-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Weekly Top Earner Bonus
            </h2>
            <div className="text-5xl font-bold text-green-400 mb-2">1 ETH</div>
            <p className="text-sm text-gray-400 mb-4">
              #1 earner this week wins bonus prize pool
            </p>
            <div className="text-xs text-gray-500">
              Resets in 3 days 14 hours
            </div>
          </div>
        </div>
      )}

      {/* Weekly Referral Prize */}
      {activeTab === 'referrals' && (
        <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Top Referrer Weekly Bonus
            </h2>
            <div className="text-5xl font-bold text-yellow-400 mb-2">1 ETH</div>
            <p className="text-sm text-gray-400 mb-4">
              Most referrals this week wins bonus
            </p>
            <div className="text-xs text-gray-500">
              Resets in 3 days 14 hours
            </div>
          </div>
        </div>
      )}

      {/* CT Draft League Banner */}
      {activeTab === 'draft' && (
        <div className={`bg-gradient-to-r ${
          draftLeague === 'prize'
            ? 'from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-cyan-500/30'
            : 'from-green-500/10 via-emerald-500/10 to-teal-500/10 border-green-500/30'
        } border rounded-xl p-6 mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {draftLeague === 'prize' ? 'Prize' : 'Free'} League - Week {selectedWeek}
              </h2>
              <p className="text-sm text-gray-400">
                {totalParticipants} teams competing
              </p>
              {draftLeague === 'prize' && (
                <p className="text-xs text-cyan-400 mt-1">
                  {prizeLeagueParticipants} entries × {prizeLeagueEntryFee} ETH
                </p>
              )}
            </div>
            <div className="text-right">
              {draftLeague === 'prize' ? (
                <>
                  <div className="text-4xl font-bold text-cyan-400 mb-1">{currentPrizePool.toFixed(2)} ETH</div>
                  <div className="text-xs text-gray-500">Total Prize Pool</div>
                </>
              ) : (
                <>
                  <div className="text-4xl font-bold text-green-400 mb-1">XP Rewards</div>
                  <div className="text-xs text-gray-500">Top 100 earn XP</div>
                </>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {selectedWeek === 12 ? 'Resets in 4d 2h' : 'Completed'}
              </div>
            </div>
          </div>

          {/* Week Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <div className="text-xs text-gray-500 flex items-center mr-2">Select Week:</div>
            {[12, 11, 10, 9, 8].map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap ${
                  selectedWeek === week
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Week {week} {week === 12 && '(Current)'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white`
                : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeTabData?.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{activeTabData?.label} Rankings</h2>
              <p className="text-sm text-gray-400">Top 10 performers</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700 bg-gray-900/50">
              <tr className="text-gray-400 text-sm">
                <th className="py-4 px-6 text-left">Rank</th>
                <th className="py-4 px-6 text-left">User</th>
                {activeTab === 'overall' && (
                  <>
                    <th className="py-4 px-6 text-right">CT Mastery</th>
                    <th className="py-4 px-6 text-right">Draft</th>
                    <th className="py-4 px-6 text-right">CT IQ</th>
                    <th className="py-4 px-6 text-right">Timecaster</th>
                  </>
                )}
                {activeTab === 'earnings' && (
                  <>
                    <th className="py-4 px-6 text-right">{timeFilter === 'weekly' ? 'Weekly' : 'Total'} Earnings</th>
                    <th className="py-4 px-6 text-right">Games Won</th>
                    <th className="py-4 px-6 text-right">Avg Win</th>
                  </>
                )}
                {activeTab === 'referrals' && (
                  <>
                    <th className="py-4 px-6 text-right">Total Referrals</th>
                    <th className="py-4 px-6 text-right">Commission Earned</th>
                    <th className="py-4 px-6 text-right">Tier</th>
                  </>
                )}
                {activeTab === 'draft' && (
                  <>
                    <th className="py-4 px-6 text-left">Team Name</th>
                    <th className="py-4 px-6 text-right">Team Score</th>
                    <th className="py-4 px-6 text-right">{draftLeague === 'prize' ? 'Prize' : 'XP'}</th>
                  </>
                )}
                {activeTab === 'whisperer' && (
                  <>
                    <th className="py-4 px-6 text-right">CT IQ</th>
                    <th className="py-4 px-6 text-right">Games</th>
                    <th className="py-4 px-6 text-right">Accuracy</th>
                  </>
                )}
                {activeTab === 'arena' && (
                  <>
                    <th className="py-4 px-6 text-right">Wins</th>
                    <th className="py-4 px-6 text-right">Win Rate</th>
                    <th className="py-4 px-6 text-right">Total Staked</th>
                  </>
                )}
                {activeTab === 'gauntlet' && (
                  <>
                    <th className="py-4 px-6 text-right">Streak</th>
                    <th className="py-4 px-6 text-right">Avg Score</th>
                    <th className="py-4 px-6 text-right">Days Played</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sortedLeaderboard.map((entry) => {
                const isUserRow = address && entry.address.toLowerCase().includes(address.toLowerCase().slice(2, 6));

                return (
                  <React.Fragment key={entry.rank}>
                    <tr
                      className={`text-sm transition-colors ${
                        isUserRow
                          ? 'bg-cyan-500/10 border-l-4 border-cyan-500'
                          : 'hover:bg-gray-900/30'
                      }`}
                    >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {entry.rank === 1 && <span className="text-2xl">🥇</span>}
                      {entry.rank === 2 && <span className="text-2xl">🥈</span>}
                      {entry.rank === 3 && <span className="text-2xl">🥉</span>}
                      {entry.rank > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                          {entry.rank}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm">{entry.address}</span>
                      {address && entry.address.toLowerCase().includes(address.toLowerCase().slice(2, 6)) && (
                        <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30">You</span>
                      )}
                    </div>
                  </td>
                  {activeTab === 'overall' && (
                    <>
                      <td className="py-4 px-6 text-right">
                        <span className={`text-lg font-bold bg-gradient-to-r ${activeTabData?.color} bg-clip-text text-transparent`}>
                          {entry.score}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-300 font-medium">{entry.draft}</td>
                      <td className="py-4 px-6 text-right text-gray-300 font-medium">{entry.ctIQ}</td>
                      <td className="py-4 px-6 text-right text-gray-300 font-medium">{entry.timecaster}</td>
                    </>
                  )}
                  {activeTab === 'earnings' && (
                    <>
                      <td className="py-4 px-6 text-right">
                        <span className="text-lg font-bold text-green-400">
                          {timeFilter === 'weekly'
                            ? `${entry.weeklyEarnings?.toFixed(2)} ETH`
                            : `${entry.totalEarnings?.toFixed(2)} ETH`
                          }
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-300">{entry.arenaWins && entry.arenaWins + 10}</td>
                      <td className="py-4 px-6 text-right text-cyan-400">
                        {timeFilter === 'weekly'
                          ? entry.weeklyEarnings && (entry.weeklyEarnings / 8).toFixed(3)
                          : entry.totalEarnings && (entry.totalEarnings / (entry.arenaWins || 10 + 10)).toFixed(3)
                        } ETH
                      </td>
                    </>
                  )}
                  {activeTab === 'referrals' && (
                    <>
                      <td className="py-4 px-6 text-right">
                        <span className="text-lg font-bold text-yellow-400">{entry.referrals}</span>
                      </td>
                      <td className="py-4 px-6 text-right text-green-400">
                        {entry.referralEarnings?.toFixed(2)} ETH
                      </td>
                      <td className="py-4 px-6 text-right">
                        {entry.referrals && entry.referrals >= 100 && (
                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded border border-cyan-500/30">💎 Platinum</span>
                        )}
                        {entry.referrals && entry.referrals >= 25 && entry.referrals < 100 && (
                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 rounded border border-yellow-500/30">🥇 Gold</span>
                        )}
                        {entry.referrals && entry.referrals >= 5 && entry.referrals < 25 && (
                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-gray-400/20 to-gray-300/20 text-gray-300 rounded border border-gray-400/30">🥈 Silver</span>
                        )}
                        {entry.referrals && entry.referrals < 5 && (
                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-orange-700/20 to-orange-500/20 text-orange-400 rounded border border-orange-500/30">🥉 Bronze</span>
                        )}
                      </td>
                    </>
                  )}
                  {activeTab === 'draft' && (
                    <>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setExpandedTeam(expandedTeam === entry.rank ? null : entry.rank)}
                          className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                        >
                          <span className="font-bold text-white">{entry.teamName || `Team ${entry.rank}`}</span>
                          <span className="text-xs text-gray-500">
                            {expandedTeam === entry.rank ? '▼' : '▶'}
                          </span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="text-lg font-bold text-cyan-400">{entry.teamScore || 0}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {draftLeague === 'prize' ? (
                          <span className="font-bold text-green-400">
                            {entry.prize ? `${entry.prize.toFixed(3)} ETH` : '-'}
                          </span>
                        ) : (
                          <span className="font-bold text-green-400">
                            {entry.xp ? `${entry.xp} XP` : '-'}
                          </span>
                        )}
                      </td>
                    </>
                  )}
                  {activeTab === 'whisperer' && (
                    <>
                      <td className="py-4 px-6 text-right">
                        <span className="text-lg font-bold text-purple-400">{entry.ctIQ}</span>
                      </td>
                      <td className="py-4 px-6 text-right text-gray-300">{50 - entry.rank * 2}</td>
                      <td className="py-4 px-6 text-right text-green-400">{95 - entry.rank}%</td>
                    </>
                  )}
                  {activeTab === 'arena' && (
                    <>
                      <td className="py-4 px-6 text-right">
                        <span className="text-lg font-bold text-orange-400">{entry.arenaWins}</span>
                      </td>
                      <td className="py-4 px-6 text-right text-green-400">{85 - entry.rank}%</td>
                      <td className="py-4 px-6 text-right text-gray-300">{(10 - entry.rank * 0.5).toFixed(1)} ETH</td>
                    </>
                  )}
                  {activeTab === 'gauntlet' && (
                    <>
                      <td className="py-4 px-6 text-right">
                        <span className="text-lg font-bold text-green-400">{entry.gauntletStreak} days</span>
                      </td>
                      <td className="py-4 px-6 text-right text-purple-400">{(5 - entry.rank * 0.1).toFixed(1)}/5</td>
                      <td className="py-4 px-6 text-right text-gray-300">{30 - entry.rank}</td>
                    </>
                  )}
                </tr>

                {/* Expanded Team Composition (Draft only) */}
                {activeTab === 'draft' && expandedTeam === entry.rank && (
                  <tr className="bg-gray-900/50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-cyan-400 mb-3">Team Composition</h4>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                          {/* Mock team members - in real app, fetch from contract/API */}
                          {['CZ', 'Vitalik', 'Cobie', 'Willy Woo', 'Pentoshi'].map((influencer, idx) => (
                            <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                  {influencer.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold text-white truncate">{influencer}</div>
                                  <div className="text-xs text-gray-500">S-Tier</div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <div>
                                  <div className="text-gray-500">Score</div>
                                  <div className="font-bold text-cyan-400">{950 - idx * 10}</div>
                                </div>
                                <div>
                                  <div className="text-gray-500">Cost</div>
                                  <div className="font-bold text-orange-400">{95 - idx}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                          <div className="text-sm text-gray-400">
                            Total Team Points: <span className="font-bold text-white">{entry.teamScore || 0}</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            Budget Used: <span className="font-bold text-orange-400">200/200</span>
                          </div>
                        </div>
                      </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-8 bg-gray-800/30 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">How Rankings Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              <strong className="text-white">CT Mastery Score</strong> combines performance across all apps:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-cyan-400">Draft (30%):</strong> Fantasy team rank and weekly scores</li>
              <li><strong className="text-purple-400">CT IQ (30%):</strong> Whisperer accuracy and speed bonuses</li>
              <li><strong className="text-pink-400">Timecaster (40%):</strong> Arena wins + Gauntlet streaks</li>
            </ul>
          </div>
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              <strong className="text-white">Individual Rankings</strong> are sorted by category-specific metrics:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li><strong className="text-cyan-400">Draft:</strong> Based on total draft score points</li>
              <li><strong className="text-purple-400">Whisperer:</strong> Based on CT IQ score</li>
              <li><strong className="text-orange-400">Arena:</strong> Based on total wins</li>
              <li><strong className="text-green-400">Gauntlet:</strong> Based on current streak length</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-400 mt-4 text-center">
          📊 Rankings update every hour. Play consistently to climb the leaderboard!
        </p>
      </div>
    </div>
  );
}
