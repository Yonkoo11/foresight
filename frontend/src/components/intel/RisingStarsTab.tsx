/**
 * RisingStarsTab
 * Discover and vote on rising CT influencers
 */

import { useState, useEffect } from 'react';
import apiClient, { hasSession } from '../../lib/apiClient';
import {
  Rocket,
  ThumbsUp,
  ThumbsDown,
  TrendUp,
  XLogo,
  Users,
  Lightning,
  Fire,
  Warning,
  ArrowClockwise,
  Crown,
} from '@phosphor-icons/react';
import { getAvatarUrl } from '../../utils/avatar';
import { useToast } from '../../contexts/ToastContext';

interface RisingStar {
  id: string;
  handle: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  followers: number;
  growthRate: number;
  avgLikes: number;
  avgRetweets: number;
  viralTweets: number;
  votesFor: number;
  votesAgainst: number;
  voteScore: number;
  userVote: 'for' | 'against' | null;
  status: string;
  discoveredAt: string;
}

export default function RisingStarsTab() {
  const { showToast } = useToast();

  const [stars, setStars] = useState<RisingStar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);

  // Fetch rising stars
  const fetchStars = async () => {
    try {
      setLoading(true);

      const res = await apiClient.get(`/api/intel/rising-stars`);

      if (res.data.success) {
        // Sort by vote score descending
        const sorted = res.data.data.stars.sort(
          (a: RisingStar, b: RisingStar) => b.voteScore - a.voteScore
        );
        setStars(sorted);
        setError(null);
      }
    } catch (err) {
      console.error('[RisingStars] Error fetching:', err);
      setError('Failed to load rising stars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStars();
  }, []);

  // Vote handler
  const handleVote = async (starId: string, vote: 'for' | 'against') => {
    if (!hasSession()) {
      showToast('Please sign in to vote', 'error');
      return;
    }

    setVotingId(starId);

    try {
      const res = await apiClient.post(
        `/api/intel/rising-stars/${starId}/vote`,
        { vote }
      );

      if (res.data.success) {
        // Update local state
        setStars(prev => prev.map(star => {
          if (star.id !== starId) return star;

          const oldVote = star.userVote;
          let newVotesFor = star.votesFor;
          let newVotesAgainst = star.votesAgainst;

          // Remove old vote
          if (oldVote === 'for') newVotesFor--;
          if (oldVote === 'against') newVotesAgainst--;

          // Add new vote (if different from old)
          if (vote === 'for' && oldVote !== 'for') newVotesFor++;
          if (vote === 'against' && oldVote !== 'against') newVotesAgainst++;

          return {
            ...star,
            userVote: oldVote === vote ? null : vote, // Toggle if same vote
            votesFor: newVotesFor,
            votesAgainst: newVotesAgainst,
            voteScore: newVotesFor - newVotesAgainst,
          };
        }));

        showToast(res.data.data.action === 'voted' ? 'Vote recorded!' : 'Vote updated!', 'success');

        // Secondary: Write to Tapestry if voting 'for' (non-blocking)
        if (vote === 'for') {
          try {
            const contentId = `foresight-rising-star-${starId}`;
            await apiClient.post(
              `/api/tapestry/like/${contentId}`,
              {}
            );
          } catch (tapestryErr) {
            console.log('[RisingStars] Tapestry like write failed (non-blocking):', tapestryErr);
          }
        }
      }
    } catch (err) {
      showToast('Failed to vote', 'error');
    } finally {
      setVotingId(null);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-gray-400">Discovering rising stars...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 text-center">
        <Warning size={40} className="mx-auto mb-3 text-red-400" />
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchStars}
          className="flex items-center gap-2 mx-auto px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
        >
          <ArrowClockwise size={16} />
          Try again
        </button>
      </div>
    );
  }

  // Empty state
  if (stars.length === 0) {
    return (
      <div className="py-12 text-center">
        <Rocket size={48} className="mx-auto mb-3 text-gray-600" />
        <h3 className="text-lg font-semibold text-white mb-2">No Rising Stars Yet</h3>
        <p className="text-gray-400 text-sm">
          We're constantly discovering new CT talent.
          <br />
          Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket size={18} className="text-cyan-400" />
          <span className="text-xs sm:text-sm text-gray-400">
            {stars.length} rising stars discovered
          </span>
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500 hidden sm:block">
          Vote to help us add the best CT talent
        </div>
      </div>

      {/* Stars List */}
      <div className="space-y-2 sm:space-y-3">
        {stars.map((star, index) => (
          <div
            key={star.id}
            className={`p-3 sm:p-4 rounded-xl border transition-all ${
              index === 0
                ? 'bg-gold-500/5 border-gold-500/30'
                : 'bg-gray-900/50 border-gray-800'
            }`}
          >
            {/* Top row: rank + avatar + name + vote */}
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              {/* Rank */}
              <div className={`shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center text-[10px] sm:text-sm font-bold ${
                index === 0
                  ? 'bg-gold-500/20 text-gold-400'
                  : index === 1
                  ? 'bg-gray-400/20 text-gray-400'
                  : index === 2
                  ? 'bg-amber-700/20 text-amber-600'
                  : 'bg-gray-800 text-gray-500'
              }`}>
                {index === 0 ? <Crown size={14} weight="fill" /> : `#${index + 1}`}
              </div>

              {/* Avatar */}
              <img
                src={getAvatarUrl(star.handle, star.avatar)}
                alt={star.name || star.handle}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover shrink-0"
              />

              {/* Name + handle */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                  {star.name || `@${star.handle}`}
                </h3>
                <a
                  href={`https://x.com/${star.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] sm:text-xs text-gray-500 hover:text-white"
                >
                  @{star.handle}
                </a>
              </div>

              {/* Vote buttons — inline */}
              <div className="shrink-0 flex items-center gap-1">
                <button
                  onClick={() => handleVote(star.id, 'for')}
                  disabled={votingId === star.id}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    star.userVote === 'for'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gray-800 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  <ThumbsUp size={14} weight={star.userVote === 'for' ? 'fill' : 'regular'} />
                </button>
                <span className={`text-xs sm:text-sm font-bold font-mono min-w-[20px] text-center ${
                  star.voteScore > 0 ? 'text-emerald-400' : star.voteScore < 0 ? 'text-rose-400' : 'text-gray-500'
                }`}>
                  {star.voteScore}
                </span>
                <button
                  onClick={() => handleVote(star.id, 'against')}
                  disabled={votingId === star.id}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                    star.userVote === 'against'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : 'bg-gray-800 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10'
                  }`}
                >
                  <ThumbsDown size={14} weight={star.userVote === 'against' ? 'fill' : 'regular'} />
                </button>
              </div>
            </div>

            {/* Bio */}
            {star.bio && (
              <p className="text-xs text-gray-400 line-clamp-1 mb-1.5 ml-8 sm:ml-11">{star.bio}</p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-xs ml-8 sm:ml-11">
              <span className="flex items-center gap-0.5 text-gray-500">
                <Users size={10} /> {formatNumber(star.followers)}
              </span>
              <span className="flex items-center gap-0.5 text-emerald-400">
                <TrendUp size={10} /> {star.growthRate.toFixed(1)}%
              </span>
              <span className="flex items-center gap-0.5 text-gray-500">
                <Lightning size={10} /> {star.avgLikes.toFixed(0)} avg
              </span>
              {star.viralTweets > 0 && (
                <span className="flex items-center gap-0.5 text-orange-400">
                  <Fire size={10} /> {star.viralTweets} viral
                </span>
              )}
              <span className="text-gray-600">
                {formatDate(star.discoveredAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
        <h4 className="text-xs sm:text-sm font-semibold text-white mb-1.5 sm:mb-2 flex items-center gap-2">
          <Rocket size={14} className="text-cyan-400" />
          How Rising Stars Works
        </h4>
        <ul className="space-y-1 text-[10px] sm:text-xs text-gray-400">
          <li>Vote for influencers you think should be added to the game</li>
          <li>Top voted stars get reviewed and added as draftable players</li>
        </ul>
      </div>
    </div>
  );
}
