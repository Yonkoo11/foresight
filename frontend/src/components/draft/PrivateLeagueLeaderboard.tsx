/**
 * PrivateLeagueLeaderboard Component
 * Shows leaderboard standings for a specific private league
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { PrivateLeague } from './PrivateLeagues';

interface LeaderboardEntry {
  address: string;
  teamName: string;
  score: number;
  rank: number;
}

interface PrivateLeagueLeaderboardProps {
  league: PrivateLeague;
  onBack: () => void;
}

export function PrivateLeagueLeaderboard({ league, onBack }: PrivateLeagueLeaderboardProps) {
  const { address } = useAccount();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Generate mock leaderboard based on league members
    // In production, this would fetch real scores from blockchain/backend
    const mockLeaderboard: LeaderboardEntry[] = league.members.map((memberAddress, index) => {
      // Load team name from localStorage if available
      const teamDataStr = localStorage.getItem(`ctdraft_team_${memberAddress}`);
      let teamName = `Team ${memberAddress.slice(0, 6)}...${memberAddress.slice(-4)}`;

      if (teamDataStr) {
        try {
          const teamData = JSON.parse(teamDataStr);
          teamName = teamData.name || teamName;
        } catch (e) {
          // Use default
        }
      }

      return {
        address: memberAddress,
        teamName,
        score: Math.floor(Math.random() * 5000) + 2000, // Random score 2000-7000
        rank: 0, // Will be set after sorting
      };
    });

    // Sort by score descending
    mockLeaderboard.sort((a, b) => b.score - a.score);

    // Assign ranks
    mockLeaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    setLeaderboard(mockLeaderboard);
  }, [league.members]);

  const myRank = leaderboard.find(entry => entry.address === address)?.rank;
  const myScore = leaderboard.find(entry => entry.address === address)?.score;

  // Calculate prize distribution for prize leagues
  const getPrizeAmount = (rank: number): number => {
    if (league.type !== 'prize' || !league.prizePool) return 0;

    const prizePool = league.prizePool;

    switch (rank) {
      case 1:
        return prizePool * 0.4; // 40%
      case 2:
        return prizePool * 0.25; // 25%
      case 3:
        return prizePool * 0.15; // 15%
      case 4:
      case 5:
        return prizePool * 0.05; // 5% each
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
        return prizePool * 0.02; // 2% each
      default:
        return 0;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-sm text-gray-400 hover:text-gray-200 mb-4 flex items-center gap-1"
        >
          ← Back to leagues
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-100">{league.name}</h2>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              league.type === 'prize'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
            }`}>
              {league.type === 'prize' ? '💰 Prize' : '🆓 Free'}
            </span>
          </div>
          {league.description && (
            <p className="text-sm text-gray-400">{league.description}</p>
          )}
        </div>

        {/* League Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Members</div>
            <div className="text-lg font-bold text-cyan-400">{league.members.length}</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">League Code</div>
            <div className="text-lg font-bold text-orange-400">{league.code}</div>
          </div>
          {league.type === 'prize' && league.prizePool ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Prize Pool</div>
              <div className="text-lg font-bold text-yellow-400">{league.prizePool} ETH</div>
            </div>
          ) : (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Type</div>
              <div className="text-lg font-bold text-green-400">XP</div>
            </div>
          )}
        </div>

        {/* My Position Banner */}
        {myRank && (
          <div className={`p-4 rounded-lg border ${
            myRank <= 3
              ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
              : 'bg-gray-800/50 border-gray-700'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400 mb-1">Your Position</div>
                <div className="text-2xl font-bold text-gray-100">
                  {myRank === 1 && '🥇 '}
                  {myRank === 2 && '🥈 '}
                  {myRank === 3 && '🥉 '}
                  #{myRank} of {league.members.length}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-1">Your Score</div>
                <div className="text-2xl font-bold text-cyan-400">{myScore}</div>
              </div>
              {league.type === 'prize' && myRank <= 10 && (
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Prize</div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {getPrizeAmount(myRank).toFixed(3)} ETH
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-200">Standings</h3>
          <div className="text-xs text-gray-500">Week 12</div>
        </div>

        {leaderboard.map((entry, index) => {
          const isCurrentUser = entry.address === address;
          const prizeAmount = getPrizeAmount(entry.rank);

          return (
            <div
              key={entry.address}
              className={`p-4 rounded-lg border transition-all ${
                isCurrentUser
                  ? 'bg-cyan-500/10 border-cyan-500/30'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="w-12 text-center">
                    {entry.rank === 1 && <div className="text-2xl">🥇</div>}
                    {entry.rank === 2 && <div className="text-2xl">🥈</div>}
                    {entry.rank === 3 && <div className="text-2xl">🥉</div>}
                    {entry.rank > 3 && (
                      <div className="text-lg font-bold text-gray-500">#{entry.rank}</div>
                    )}
                  </div>

                  {/* Team Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-gray-200">{entry.teamName}</div>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.address.slice(0, 6)}...{entry.address.slice(-4)}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="text-lg font-bold text-cyan-400">{entry.score}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>

                  {/* Prize (if applicable) */}
                  {league.type === 'prize' && prizeAmount > 0 && (
                    <div className="text-right min-w-[100px]">
                      <div className="text-lg font-bold text-yellow-400">
                        {prizeAmount.toFixed(3)} ETH
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.rank === 1 && '40%'}
                        {entry.rank === 2 && '25%'}
                        {entry.rank === 3 && '15%'}
                        {(entry.rank === 4 || entry.rank === 5) && '5%'}
                        {entry.rank >= 6 && entry.rank <= 10 && '2%'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-400">No standings yet</p>
            <p className="text-sm text-gray-500 mt-2">
              League members need to submit teams first
            </p>
          </div>
        )}
      </div>

      {/* Prize Distribution Info (for prize leagues) */}
      {league.type === 'prize' && league.prizePool && (
        <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h4 className="text-sm font-bold text-gray-300 mb-3">Prize Distribution</h4>
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">🥇 1st</div>
              <div className="text-sm font-bold text-yellow-400">40%</div>
              <div className="text-xs text-gray-600">{(league.prizePool * 0.4).toFixed(2)} ETH</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">🥈 2nd</div>
              <div className="text-sm font-bold text-gray-300">25%</div>
              <div className="text-xs text-gray-600">{(league.prizePool * 0.25).toFixed(2)} ETH</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">🥉 3rd</div>
              <div className="text-sm font-bold text-orange-400">15%</div>
              <div className="text-xs text-gray-600">{(league.prizePool * 0.15).toFixed(2)} ETH</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">4th-5th</div>
              <div className="text-sm font-bold text-cyan-400">5%</div>
              <div className="text-xs text-gray-600">each</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">6th-10th</div>
              <div className="text-sm font-bold text-blue-400">2%</div>
              <div className="text-xs text-gray-600">each</div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div className="flex-1">
            <div className="font-bold text-blue-400 text-sm mb-1">How Scoring Works</div>
            <div className="text-xs text-gray-400 space-y-1">
              <p>• Scores update daily based on your influencers' Twitter engagement</p>
              <p>• Each influencer can earn up to 100 points per week</p>
              <p>• Total team score = sum of all 5 influencers' scores</p>
              <p>• Week resets every Monday at 00:00 UTC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
