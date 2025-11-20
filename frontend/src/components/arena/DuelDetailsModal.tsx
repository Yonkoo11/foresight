/**
 * DuelDetailsModal Component
 * View duel details and vote
 */

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { formatEther } from 'viem';
import type { Duel } from './DuelCard';

interface DuelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  duel: Duel | null;
  currentUser?: `0x${string}`;
  onVote?: (duelId: bigint, position: boolean) => Promise<void>;
}

export function DuelDetailsModal({ isOpen, onClose, duel, currentUser, onVote }: DuelDetailsModalProps) {
  const [selectedPosition, setSelectedPosition] = useState<boolean | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  if (!isOpen || !duel) return null;

  const isCreator = currentUser && duel.creator.toLowerCase() === currentUser.toLowerCase();
  const isOpponent = currentUser && duel.opponent.toLowerCase() === currentUser.toLowerCase();
  const isActive = duel.opponent !== '0x0000000000000000000000000000000000000000';
  const isExpired = Date.now() / 1000 > Number(duel.deadline);
  const canVote = isActive && !isExpired && !isCreator && !isOpponent && currentUser;

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

  const handleVote = async () => {
    if (selectedPosition === null || !onVote) return;

    setIsVoting(true);
    try {
      await onVote(duel.id, selectedPosition);
      onClose();
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const creatorVotePercentage = duel.totalVotes && Number(duel.totalVotes) > 0
    ? (Number(duel.creatorVotes || 0n) / Number(duel.totalVotes)) * 100
    : 50;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{typeEmojis[duel.duelType]}</span>
              <div>
                <div className={`text-lg font-bold bg-gradient-to-r ${typeColors[duel.duelType]} bg-clip-text text-transparent`}>
                  {duel.duelType} DUEL #{Number(duel.id)}
                </div>
                <div className="text-sm text-gray-400">
                  {isActive ? 'Active Duel' : 'Open Challenge'}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Question */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Question</h3>
            <p className="text-xl text-gray-200 font-medium">{duel.question}</p>
          </div>

          {/* Positions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Creator's Position</div>
              <div className="text-cyan-400 font-bold text-lg">{duel.creatorPosition}</div>
              <div className="text-xs text-gray-500 mt-2">
                {duel.creator.slice(0, 6)}...{duel.creator.slice(-4)}
              </div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Opponent's Position</div>
              <div className="text-purple-400 font-bold text-lg">
                {isActive ? 'Opposite' : 'Awaiting...'}
              </div>
              {isActive && (
                <div className="text-xs text-gray-500 mt-2">
                  {duel.opponent.slice(0, 6)}...{duel.opponent.slice(-4)}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Stake</div>
              <div className="text-sm font-bold text-cyan-400">
                {formatEther(duel.stake)} ETH
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Prize Pool</div>
              <div className="text-sm font-bold text-green-400">
                {formatEther(duel.stake * 2n)} ETH
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Deadline</div>
              <div className="text-sm font-bold text-gray-300">
                {formatDistanceToNow(Number(duel.deadline) * 1000, { addSuffix: true })}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-500 mb-1">Total Votes</div>
              <div className="text-sm font-bold text-purple-400">
                {duel.totalVotes ? Number(duel.totalVotes) : 0}
              </div>
            </div>
          </div>

          {/* Voting Section (if active and can vote) */}
          {isActive && duel.totalVotes && Number(duel.totalVotes) > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Community Votes</h3>
              <div className="space-y-3">
                {/* Creator Side */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-cyan-400 font-medium">{duel.creatorPosition}</span>
                    <span className="text-gray-400">{Number(duel.creatorVotes || 0n)} votes ({creatorVotePercentage.toFixed(1)}%)</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      style={{ width: `${creatorVotePercentage}%` }}
                    />
                  </div>
                </div>

                {/* Opponent Side */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-purple-400 font-medium">Opposite</span>
                    <span className="text-gray-400">
                      {Number(duel.totalVotes) - Number(duel.creatorVotes || 0n)} votes ({(100 - creatorVotePercentage).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${100 - creatorVotePercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vote Selection (if can vote) */}
          {canVote && (
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-center">Cast Your Vote</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                Vote for the side you think will win. Costs 0.01 ETH. Correct voters share the losing voters' stakes.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => setSelectedPosition(true)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPosition === true
                      ? 'border-cyan-500 bg-cyan-500/20'
                      : 'border-gray-700 bg-gray-800/50 hover:border-cyan-500/50'
                  }`}
                >
                  <div className="text-cyan-400 font-bold mb-1">Creator Side</div>
                  <div className="text-sm text-gray-300">{duel.creatorPosition}</div>
                </button>

                <button
                  onClick={() => setSelectedPosition(false)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedPosition === false
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-gray-700 bg-gray-800/50 hover:border-purple-500/50'
                  }`}
                >
                  <div className="text-purple-400 font-bold mb-1">Opponent Side</div>
                  <div className="text-sm text-gray-300">Opposite</div>
                </button>
              </div>

              <button
                onClick={handleVote}
                disabled={selectedPosition === null || isVoting}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVoting ? 'Voting...' : 'Vote (0.01 ETH)'}
              </button>
            </div>
          )}

          {/* Oracle Info (for PRICE/PROTOCOL) */}
          {duel.oracleKey && (
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="text-xs text-gray-500 mb-1">Oracle Resolution</div>
              <div className="text-sm text-gray-300">
                This duel will be automatically resolved using oracle data for <span className="font-mono text-cyan-400">{duel.oracleKey}</span>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {isCreator && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-blue-400">This is your duel. You cannot vote.</p>
            </div>
          )}

          {isOpponent && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-purple-400">You are the opponent in this duel.</p>
            </div>
          )}

          {!canVote && !isCreator && !isOpponent && !currentUser && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-yellow-400">Connect wallet to vote</p>
            </div>
          )}

          {isExpired && !duel.resolved && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-yellow-400">This duel has ended and is awaiting resolution</p>
            </div>
          )}

          {duel.resolved && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
              <p className="text-sm text-green-400 font-medium mb-2">Duel Resolved</p>
              {duel.winner && (
                <p className="text-xs text-gray-400">
                  Winner: {duel.winner.slice(0, 6)}...{duel.winner.slice(-4)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
