/**
 * TeamCard Component
 * Shows the user's drafted team
 */

import { useState } from 'react';
import type { Influencer } from './InfluencerCard';

interface TeamCardProps {
  teamName?: string;
  team: Influencer[];
  totalScore: bigint;
  rank?: bigint;
  maxTeamSize?: number;
}

function InfluencerAvatar({ influencer }: { influencer: Influencer }) {
  const [imageError, setImageError] = useState(false);

  const tierColors = {
    S: 'from-yellow-500 to-orange-500',
    A: 'from-purple-500 to-pink-500',
    B: 'from-blue-500 to-cyan-500',
    C: 'from-gray-500 to-gray-600',
  };

  const tierBadgeColors = {
    S: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    A: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    C: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <div className={`w-10 h-10 rounded-full border-2 flex-shrink-0 ${tierBadgeColors[influencer.tier].replace('bg-', 'border-').replace('/20', '')}`}>
      {influencer.avatar && !imageError ? (
        <img
          src={influencer.avatar}
          alt={influencer.name}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full rounded-full bg-gradient-to-r ${tierColors[influencer.tier]} flex items-center justify-center text-white font-bold text-sm`}>
          {influencer.name.charAt(0)}
        </div>
      )}
    </div>
  );
}

export function TeamCard({ teamName = 'Your Team', team, totalScore, rank, maxTeamSize = 5 }: TeamCardProps) {
  const emptySlots = maxTeamSize - team.length;

  const tierBadgeColors = {
    S: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    A: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    B: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    C: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-cyan-400">{teamName}</h3>
          <p className="text-sm text-gray-400">{team.length}/{maxTeamSize} influencers</p>
        </div>
        {rank && (
          <div className="text-right">
            <div className="text-xs text-gray-500">Rank</div>
            <div className="text-2xl font-bold text-yellow-400">#{Number(rank)}</div>
          </div>
        )}
      </div>

      {/* Team Members as Card Pieces */}
      <div className="space-y-3 mb-4">
        {team.map((influencer, index) => (
          <div
            key={Number(influencer.id)}
            className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-3 hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-center gap-3">
              {/* Position Number Badge */}
              <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/50 rounded-full flex items-center justify-center text-sm font-bold text-cyan-400 flex-shrink-0">
                {index + 1}
              </div>

              {/* Avatar */}
              <InfluencerAvatar influencer={influencer} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-200 truncate">{influencer.name}</div>
                <div className="text-xs text-gray-500">@{influencer.handle}</div>
              </div>

              {/* Stats */}
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-cyan-400">
                  {Number(influencer.weeklyScore)} pts
                </div>
                <div className={`text-xs font-medium ${tierBadgeColors[influencer.tier].split(' ')[1]}`}>
                  {influencer.tier}-Tier
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty Slots */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="flex items-center justify-center bg-gray-900/30 border border-dashed border-gray-700 rounded-lg p-4"
          >
            <span className="text-sm text-gray-600">Empty Slot {team.length + index + 1}</span>
          </div>
        ))}
      </div>

      {/* Total Score */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Total Weekly Score</span>
          <div className="text-3xl font-bold text-cyan-400">{Number(totalScore)}</div>
        </div>
      </div>
    </div>
  );
}
