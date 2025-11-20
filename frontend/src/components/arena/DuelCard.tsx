/**
 * DuelCard Component
 * Displays a duel in the arena
 */

import { formatDistanceToNow } from 'date-fns';
import { formatEther } from 'viem';

export interface Duel {
  id: bigint;
  creator: `0x${string}`;
  opponent: `0x${string}`;
  duelType: 'PRICE' | 'PROTOCOL' | 'NARRATIVE';
  question: string;
  creatorPosition: string;
  stake: bigint;
  deadline: bigint;
  resolved: boolean;
  winner?: `0x${string}`;
  totalVotes?: bigint;
  creatorVotes?: bigint;
  oracleKey?: string;
}

interface DuelCardProps {
  duel: Duel;
  currentUser?: `0x${string}`;
  onAccept?: (duelId: bigint) => void;
  onClick?: (duel: Duel) => void;
  onClaim?: (duelId: bigint) => void;
  onCancel?: (duelId: bigint) => void;
  hasClaimed?: boolean;
}

export function DuelCard({ duel, currentUser, onAccept, onClick, onClaim, onCancel, hasClaimed }: DuelCardProps) {
  const isCreator = currentUser && duel.creator.toLowerCase() === currentUser.toLowerCase();
  const isOpponent = currentUser && duel.opponent.toLowerCase() === currentUser.toLowerCase();
  const isActive = duel.opponent !== '0x0000000000000000000000000000000000000000';
  const isPending = !isActive;
  const isExpired = Date.now() / 1000 > Number(duel.deadline);
  const canVote = isActive && !isExpired && !isCreator && !isOpponent;
  const canAccept = isPending && !isCreator && currentUser;
  const canClaim = duel.resolved && duel.winner?.toLowerCase() === currentUser?.toLowerCase() && !hasClaimed;
  const canCancel = isPending && isCreator && !isExpired;

  const typeColors = {
    PRICE: 'from-blue-500 to-cyan-500',
    PROTOCOL: 'from-purple-500 to-pink-500',
    NARRATIVE: 'from-orange-500 to-red-500',
  };

  const typeEmojis = {
    PRICE: '📈',
    PROTOCOL: '⚙️',
    NARRATIVE: '💭',
  };

  return (
    <div
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-all cursor-pointer group"
      onClick={() => onClick?.(duel)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{typeEmojis[duel.duelType]}</span>
          <div>
            <div className={`text-sm font-bold bg-gradient-to-r ${typeColors[duel.duelType]} bg-clip-text text-transparent`}>
              {duel.duelType} DUEL
            </div>
            <div className="text-xs text-gray-500">#{Number(duel.id)}</div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {duel.resolved && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/30">
              Resolved
            </span>
          )}
          {!duel.resolved && isExpired && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
              Ended
            </span>
          )}
          {!duel.resolved && !isExpired && isActive && (
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
              Active
            </span>
          )}
          {isPending && (
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/30">
              Open
            </span>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="mb-4">
        <p className="text-gray-200 font-medium mb-2">{duel.question}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Creator's Position:</span>
          <span className="text-base-blue font-medium">{duel.creatorPosition}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-gray-500 mb-1">Stake</div>
          <div className="text-sm font-bold text-cyan-400">
            {formatEther(duel.stake)} ETH
          </div>
        </div>
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-gray-500 mb-1">Deadline</div>
          <div className="text-sm font-bold text-gray-300">
            {formatDistanceToNow(Number(duel.deadline) * 1000, { addSuffix: true })}
          </div>
        </div>
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-gray-500 mb-1">Votes</div>
          <div className="text-sm font-bold text-purple-400">
            {duel.totalVotes ? Number(duel.totalVotes) : 0}
          </div>
        </div>
      </div>

      {/* Voting Progress (if active) */}
      {isActive && duel.totalVotes && Number(duel.totalVotes) > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Creator: {duel.creatorVotes ? Number(duel.creatorVotes) : 0}</span>
            <span>Opponent: {Number(duel.totalVotes) - Number(duel.creatorVotes || 0n)}</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
              style={{
                width: `${((Number(duel.creatorVotes || 0n) / Number(duel.totalVotes)) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {canClaim && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClaim?.(duel.id);
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded font-medium transition-all"
          >
            🏆 Claim {formatEther(duel.stake * 2n * 95n / 100n)} ETH
          </button>
        )}

        {canCancel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.(duel.id);
            }}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded font-medium transition-all"
          >
            Cancel Duel
          </button>
        )}

        {canAccept && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept?.(duel.id);
            }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded font-medium transition-all"
          >
            Accept Challenge ({formatEther(duel.stake)} ETH)
          </button>
        )}

        {canVote && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(duel);
            }}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition-all"
          >
            Vote (0.01 ETH)
          </button>
        )}

        {(isCreator || isOpponent) && !canClaim && !canCancel && (
          <div className="flex-1 px-4 py-2 bg-gray-900/50 text-gray-400 rounded text-center text-sm">
            {isCreator ? 'Your Duel' : 'Participating'}
          </div>
        )}

        {!canAccept && !canVote && !isCreator && !isOpponent && !canClaim && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(duel);
            }}
            className="flex-1 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded font-medium transition-all"
          >
            View Details
          </button>
        )}

        {hasClaimed && (
          <div className="flex-1 px-4 py-2 bg-green-500/20 text-green-400 rounded text-center text-sm border border-green-500/30">
            ✓ Claimed
          </div>
        )}
      </div>

      {/* Additional Info */}
      {duel.oracleKey && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            Oracle Key: <span className="text-gray-400 font-mono">{duel.oracleKey}</span>
          </div>
        </div>
      )}
    </div>
  );
}
