/**
 * InfluencerModal Component
 * Shows detailed information about an influencer in a modal
 */

import { useState } from 'react';
import type { Influencer } from './InfluencerCard';

interface InfluencerModalProps {
  influencer: Influencer | null;
  onClose: () => void;
  onDraft?: (influencerId: bigint) => void;
  inTeam?: boolean;
  disabled?: boolean;
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
    <div className={`w-24 h-24 rounded-full border-4 ${tierBadgeColors[influencer.tier].replace('bg-', 'border-').replace('/20', '')}`}>
      {influencer.avatar && !imageError ? (
        <img
          src={influencer.avatar}
          alt={influencer.name}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`w-full h-full rounded-full bg-gradient-to-r ${tierColors[influencer.tier]} flex items-center justify-center text-white font-bold text-3xl`}>
          {influencer.name.charAt(0)}
        </div>
      )}
    </div>
  );
}

export function InfluencerModal({ influencer, onClose, onDraft, inTeam, disabled }: InfluencerModalProps) {
  if (!influencer) return null;

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

  const defaultTierDescriptions = {
    S: 'Elite influencer with massive reach and consistent engagement',
    A: 'Top-tier influencer with strong community following',
    B: 'Rising influencer with active and engaged audience',
    C: 'Emerging influencer with growing presence',
  };

  // Mock additional data - in production this would come from your backend
  const recentTweets = [
    { date: '2 hours ago', engagement: 12500, type: 'Market Analysis' },
    { date: '8 hours ago', engagement: 8900, type: 'Price Prediction' },
    { date: '1 day ago', engagement: 15200, type: 'Thread' },
  ];

  const weeklyPerformance = [
    { day: 'Mon', score: Number(influencer.weeklyScore) * 0.12 },
    { day: 'Tue', score: Number(influencer.weeklyScore) * 0.15 },
    { day: 'Wed', score: Number(influencer.weeklyScore) * 0.18 },
    { day: 'Thu', score: Number(influencer.weeklyScore) * 0.14 },
    { day: 'Fri', score: Number(influencer.weeklyScore) * 0.16 },
    { day: 'Sat', score: Number(influencer.weeklyScore) * 0.13 },
    { day: 'Sun', score: Number(influencer.weeklyScore) * 0.12 },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-start gap-4">
            <InfluencerAvatar influencer={influencer} />

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{influencer.name}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-bold border ${tierBadgeColors[influencer.tier]}`}>
                  {influencer.tier}-Tier
                </span>
              </div>

              <a
                href={`https://twitter.com/${influencer.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors mb-3 inline-block"
              >
                @{influencer.handle} ↗
              </a>

              <p className="text-sm text-gray-400 mb-4">
                {influencer.bio || defaultTierDescriptions[influencer.tier]}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${tierColors[influencer.tier]} bg-clip-text text-transparent`}>
                    {Number(influencer.weeklyScore)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Weekly Score</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {Number(influencer.totalDrafts)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Teams</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {Number(influencer.price)} pts
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Cost</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Weekly Performance Chart */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Weekly Performance</h3>
            <div className="flex items-end gap-2 h-32">
              {weeklyPerformance.map((day, index) => {
                const maxScore = Math.max(...weeklyPerformance.map(d => d.score));
                const height = (day.score / maxScore) * 100;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-gray-800 rounded-t relative" style={{ height: `${height}%` }}>
                      <div className={`absolute inset-0 bg-gradient-to-t ${tierColors[influencer.tier]} rounded-t opacity-80`} />
                    </div>
                    <div className="text-xs text-gray-500">{day.day}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentTweets.map((tweet, index) => (
                <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{tweet.date}</span>
                    <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                      {tweet.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                    <span className="text-sm font-bold text-white">{tweet.engagement.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">engagements</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Strengths</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Engagement Rate</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className={`bg-gradient-to-r ${tierColors[influencer.tier]} h-full rounded-full`} style={{ width: '85%' }} />
                  </div>
                  <span className="text-sm font-bold text-white">85%</span>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Consistency</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className={`bg-gradient-to-r ${tierColors[influencer.tier]} h-full rounded-full`} style={{ width: '92%' }} />
                  </div>
                  <span className="text-sm font-bold text-white">92%</span>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Quality Score</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className={`bg-gradient-to-r ${tierColors[influencer.tier]} h-full rounded-full`} style={{ width: '78%' }} />
                  </div>
                  <span className="text-sm font-bold text-white">78%</span>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Influence</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className={`bg-gradient-to-r ${tierColors[influencer.tier]} h-full rounded-full`} style={{ width: '88%' }} />
                  </div>
                  <span className="text-sm font-bold text-white">88%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          {inTeam ? (
            <div className="text-center py-3 bg-cyan-500/20 rounded-lg text-cyan-400 text-sm font-medium border border-cyan-500/30">
              ✓ Already in Your Team
            </div>
          ) : (
            <button
              onClick={() => {
                onDraft?.(influencer.id);
                onClose();
              }}
              disabled={disabled}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Draft for {Number(influencer.price)} points
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
