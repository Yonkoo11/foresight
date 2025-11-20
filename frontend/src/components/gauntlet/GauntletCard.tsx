/**
 * GauntletCard Component
 * Shows a daily gauntlet summary card
 */

import { formatDistanceToNow } from 'date-fns';
import { formatEther } from 'viem';

export interface Gauntlet {
  day: bigint;
  totalPool: bigint;
  totalParticipants: bigint;
  deadline: bigint;
  resolved: boolean;
  userScore?: number; // 0-5
  userParticipated?: boolean;
}

interface GauntletCardProps {
  gauntlet: Gauntlet;
  onEnter?: (day: bigint) => void;
  onView?: (day: bigint) => void;
  onClaim?: (day: bigint) => void;
  hasClaimed?: boolean;
}

export function GauntletCard({ gauntlet, onEnter, onView, onClaim, hasClaimed }: GauntletCardProps) {
  const isActive = Date.now() / 1000 < Number(gauntlet.deadline);
  const isExpired = !isActive && !gauntlet.resolved;
  const canClaim = gauntlet.resolved && gauntlet.userParticipated && (gauntlet.userScore || 0) >= 3 && !hasClaimed;

  const getScoreColor = (score: number) => {
    if (score === 5) return 'text-green-400';
    if (score >= 4) return 'text-cyan-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-gray-400';
  };

  const getRewardTier = (score: number) => {
    if (score === 5) return '50% of pool';
    if (score === 4) return '35% of pool';
    if (score === 3) return '15% of pool';
    return 'No reward';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-lg font-bold text-gray-200">Day {Number(gauntlet.day)}</div>
          <div className="text-xs text-gray-500">
            {isActive ? 'Active Now' : gauntlet.resolved ? 'Completed' : 'Awaiting Resolution'}
          </div>
        </div>

        {/* Status Badge */}
        {isActive && (
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30 animate-pulse">
            Live
          </span>
        )}
        {gauntlet.resolved && (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
            Resolved
          </span>
        )}
        {isExpired && (
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
            Pending
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-gray-500 mb-1">Prize Pool</div>
          <div className="text-sm font-bold text-green-400">
            {formatEther(gauntlet.totalPool)} ETH
          </div>
        </div>
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-gray-500 mb-1">Players</div>
          <div className="text-sm font-bold text-cyan-400">
            {Number(gauntlet.totalParticipants)}
          </div>
        </div>
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-gray-500 mb-1">
            {isActive ? 'Closes' : 'Closed'}
          </div>
          <div className="text-sm font-bold text-gray-300">
            {formatDistanceToNow(Number(gauntlet.deadline) * 1000, { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* User Score (if participated) */}
      {gauntlet.userParticipated && gauntlet.userScore !== undefined && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Your Score</div>
              <div className={`text-2xl font-bold ${getScoreColor(gauntlet.userScore)}`}>
                {gauntlet.userScore}/5
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Reward Tier</div>
              <div className="text-sm font-medium text-green-400">
                {getRewardTier(gauntlet.userScore)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {canClaim && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaim?.(gauntlet.day);
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded font-medium transition-all"
          >
            💰 Claim Reward
          </button>
        )}

        {hasClaimed && (
          <div className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded text-center text-sm border border-green-500/30">
            ✓ Claimed
          </div>
        )}

        {isActive && !canClaim && !hasClaimed && (
          <button
            onClick={() => gauntlet.userParticipated ? onView?.(gauntlet.day) : onEnter?.(gauntlet.day)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded font-medium transition-all"
          >
            {gauntlet.userParticipated ? 'View Predictions' : 'Enter Gauntlet (0.05 ETH)'}
          </button>
        )}

        {!isActive && !canClaim && !hasClaimed && (
          <button
            onClick={() => onView?.(gauntlet.day)}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-all"
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
}
