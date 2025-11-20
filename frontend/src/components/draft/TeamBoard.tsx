/**
 * TeamBoard Component
 * Shareable team display with social sharing and image download
 */

import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import type { Influencer } from './InfluencerCard';

interface TeamBoardProps {
  team: Influencer[];
  totalScore: bigint;
  rank: bigint;
  onClose: () => void;
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
    <div className={`w-16 h-16 rounded-full border-2 ${tierBadgeColors[influencer.tier].replace('bg-', 'border-').replace('/20', '')}`}>
      {influencer.avatar && !imageError ? (
        <img
          src={influencer.avatar}
          alt={influencer.name}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
          crossOrigin="anonymous"
        />
      ) : (
        <div className={`w-full h-full rounded-full bg-gradient-to-r ${tierColors[influencer.tier]} flex items-center justify-center text-white font-bold text-xl`}>
          {influencer.name.charAt(0)}
        </div>
      )}
    </div>
  );
}

export function TeamBoard({ team, totalScore, rank, onClose }: TeamBoardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#111827', // gray-900
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `timecaster-team-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareTwitter = async () => {
    const text = `Just drafted my Timecaster team! 🏆\n\nRank #${Number(rank)} | Score: ${Number(totalScore)}\n\nTeam:\n${team.map((p, i) => `${i + 1}. ${p.name} (@${p.handle})`).join('\n')}\n\nPlay now at timecaster.xyz`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleShareFarcaster = async () => {
    const text = `Just drafted my Timecaster team! 🏆\n\nRank #${Number(rank)} | Score: ${Number(totalScore)}\n\n${team.map((p, i) => `${i + 1}. ${p.name}`).join('\n')}\n\nPlay now!`;
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=550,height=600');
  };

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
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Team Board</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Shareable Card */}
        <div className="p-6">
          <div
            ref={cardRef}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 border-2 border-cyan-500/30"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4">
                <h3 className="text-2xl font-bold text-white">TIMECASTER</h3>
              </div>
              <h4 className="text-xl font-bold text-gray-300 mb-2">My CT Draft Team</h4>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Rank</span>
                  <span className="text-2xl font-bold text-yellow-400">#{Number(rank)}</span>
                </div>
                <div className="w-px h-8 bg-gray-700" />
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Total Score</span>
                  <span className="text-2xl font-bold text-cyan-400">{Number(totalScore)}</span>
                </div>
              </div>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {team.map((influencer, index) => (
                <div
                  key={Number(influencer.id)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex items-center gap-4"
                >
                  {/* Position */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>

                  {/* Avatar */}
                  <InfluencerAvatar influencer={influencer} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-bold text-white truncate">{influencer.name}</h5>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${tierBadgeColors[influencer.tier]}`}>
                        {influencer.tier}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">@{influencer.handle}</p>
                  </div>

                  {/* Score */}
                  <div className="flex-shrink-0 text-right">
                    <div className={`text-lg font-bold bg-gradient-to-r ${tierColors[influencer.tier]} bg-clip-text text-transparent`}>
                      {Number(influencer.weeklyScore)}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-500">timecaster.xyz</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-700 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareTwitter}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Share on Twitter
            </button>

            <button
              onClick={handleShareFarcaster}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#8a63d2] hover:bg-[#7952c4] text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.5 2h-13C4.67 2 4 2.67 4 3.5v17c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5v-17c0-.83-.67-1.5-1.5-1.5zM17 7h-3v10h-4V7H7V5h10v2z"/>
              </svg>
              Share on Farcaster
            </button>
          </div>

          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isDownloading ? 'Generating Image...' : 'Download as Image'}
          </button>
        </div>
      </div>
    </div>
  );
}
