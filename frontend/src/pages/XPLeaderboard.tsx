/**
 * XP Leaderboard Page
 * Shows rankings by XP with all-time and monthly views
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Medal, Crown, Star, Fire, Flame, Lightning, CalendarBlank, Clock } from '@phosphor-icons/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface LeaderboardUser {
  id: number;
  wallet_address: string;
  username: string;
  avatar_url: string;
  xp: number;
  lifetime_xp: number;
  vote_streak: number;
  rank: number;
}

// XP Level definitions
const XP_LEVELS = {
  NOVICE: { minXP: 0, maxXP: 99, color: 'text-gray-400', bg: 'bg-gray-500/20', badge: 'N' },
  APPRENTICE: { minXP: 100, maxXP: 249, color: 'text-blue-400', bg: 'bg-blue-500/20', badge: 'A' },
  SKILLED: { minXP: 250, maxXP: 499, color: 'text-purple-400', bg: 'bg-purple-500/20', badge: 'S' },
  EXPERT: { minXP: 500, maxXP: 999, color: 'text-pink-400', bg: 'bg-pink-500/20', badge: 'E' },
  MASTER: { minXP: 1000, maxXP: 2499, color: 'text-cyan-400', bg: 'bg-cyan-500/20', badge: 'M' },
  LEGENDARY: { minXP: 2500, maxXP: Infinity, color: 'text-yellow-400', bg: 'bg-yellow-500/20', badge: 'L' },
};

function getLevel(xp: number) {
  for (const [name, level] of Object.entries(XP_LEVELS)) {
    if (xp >= level.minXP && xp <= level.maxXP) {
      return { name, ...level };
    }
  }
  return { name: 'LEGENDARY', ...XP_LEVELS.LEGENDARY };
}

export default function XPLeaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'all-time' | 'monthly'>('all-time');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users/xp-leaderboard`, {
        params: { period, limit: 100 }
      });
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Failed to fetch XP leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown weight="fill" className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal weight="fill" className="w-6 h-6 text-gray-300" />;
    if (rank === 3) return <Medal weight="fill" className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 text-center text-sm text-gray-500">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 via-yellow-500/10 to-transparent border-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 via-gray-400/10 to-transparent border-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-transparent border-amber-600/30';
    return 'bg-dark-800/50 border-dark-700/50';
  };

  return (
    <div className="min-h-screen bg-dark-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-dark-800 to-dark-900 border-b border-dark-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-500/20 mb-4">
              <Trophy weight="fill" className="w-8 h-8 text-brand-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">XP Leaderboard</h1>
            <p className="text-gray-400">Top players ranked by experience points</p>
          </div>

          {/* Period Toggle */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex bg-dark-800 rounded-lg p-1">
              <button
                onClick={() => setPeriod('all-time')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === 'all-time'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                All Time
              </button>
              <button
                onClick={() => setPeriod('monthly')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === 'monthly'
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <CalendarBlank className="w-4 h-4" />
                This Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-dark-800/50 rounded-lg h-16 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            {/* Podium for top 3 */}
            {users.length >= 3 && (
              <div className="flex items-end justify-center gap-4 mb-8 pt-8">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={users[1]?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${users[1]?.wallet_address}`}
                      alt={users[1]?.username || 'User'}
                      className="w-16 h-16 rounded-full border-2 border-gray-400"
                    />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs font-bold text-dark-900">
                      2
                    </div>
                  </div>
                  <div className="bg-gradient-to-t from-gray-600 to-gray-400 w-20 h-32 mt-3 rounded-t-lg flex flex-col items-center justify-end pb-3">
                    <span className="text-xs font-bold text-white truncate max-w-[70px]">
                      {users[1]?.username || users[1]?.wallet_address?.slice(0, 6)}
                    </span>
                    <span className="text-[10px] text-gray-200">{(users[1]?.lifetime_xp || 0).toLocaleString()} XP</span>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center -mt-4">
                  <div className="relative">
                    <img
                      src={users[0]?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${users[0]?.wallet_address}`}
                      alt={users[0]?.username || 'User'}
                      className="w-20 h-20 rounded-full border-2 border-yellow-400"
                    />
                    <Crown weight="fill" className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400" />
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-dark-900">
                      1
                    </div>
                  </div>
                  <div className="bg-gradient-to-t from-yellow-600 to-yellow-400 w-24 h-40 mt-3 rounded-t-lg flex flex-col items-center justify-end pb-3">
                    <span className="text-sm font-bold text-white truncate max-w-[85px]">
                      {users[0]?.username || users[0]?.wallet_address?.slice(0, 6)}
                    </span>
                    <span className="text-xs text-yellow-100">{(users[0]?.lifetime_xp || 0).toLocaleString()} XP</span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={users[2]?.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${users[2]?.wallet_address}`}
                      alt={users[2]?.username || 'User'}
                      className="w-14 h-14 rounded-full border-2 border-amber-600"
                    />
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-amber-600 flex items-center justify-center text-[10px] font-bold text-dark-900">
                      3
                    </div>
                  </div>
                  <div className="bg-gradient-to-t from-amber-800 to-amber-600 w-16 h-24 mt-3 rounded-t-lg flex flex-col items-center justify-end pb-3">
                    <span className="text-[10px] font-bold text-white truncate max-w-[55px]">
                      {users[2]?.username || users[2]?.wallet_address?.slice(0, 6)}
                    </span>
                    <span className="text-[9px] text-amber-100">{(users[2]?.lifetime_xp || 0).toLocaleString()} XP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Full List */}
            <div className="space-y-2">
              {users.map((user) => {
                const level = getLevel(user.lifetime_xp || 0);
                return (
                  <div
                    key={user.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-colors hover:bg-dark-700/50 ${getRankBg(user.rank)}`}
                  >
                    {/* Rank */}
                    <div className="w-8 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar */}
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.wallet_address}`}
                      alt={user.username || 'User'}
                      className="w-10 h-10 rounded-full"
                    />

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white truncate">
                          {user.username || `${user.wallet_address?.slice(0, 6)}...${user.wallet_address?.slice(-4)}`}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${level.bg} ${level.color}`}>
                          {level.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{user.wallet_address?.slice(0, 6)}...{user.wallet_address?.slice(-4)}</span>
                        {user.vote_streak > 0 && (
                          <span className="flex items-center gap-1 text-orange-400">
                            <Flame className="w-3 h-3" />
                            {user.vote_streak} day streak
                          </span>
                        )}
                      </div>
                    </div>

                    {/* XP */}
                    <div className="text-right">
                      <div className="font-bold text-white">{(user.lifetime_xp || 0).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">XP</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Total count */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Showing {users.length} of {total} players
            </div>
          </>
        )}
      </div>
    </div>
  );
}
