/**
 * FollowButton — Follow/unfollow users via Tapestry social graph
 *
 * States:
 * - Not following: Ghost gray button "Follow" — quiet, doesn't compete with scores
 * - Following: Minimal check + text, rose hint on hover → "Unfollow"
 * - Loading: Spinner
 */

import { useState } from 'react';
import { UserPlus, UserMinus, Check } from '@phosphor-icons/react';
import apiClient, { hasSession } from '../lib/apiClient';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../hooks/useAuth';

interface FollowButtonProps {
  targetProfileId: string;
  targetUsername?: string;
  initialFollowing?: boolean;
  size?: 'sm' | 'md';
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export default function FollowButton({
  targetProfileId,
  targetUsername,
  initialFollowing = false,
  size = 'md',
  onFollowChange,
  className = '',
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { showToast } = useToast();
  const { isConnected, login } = useAuth();

  const handleToggle = async () => {
    if (!hasSession()) {
      if (!isConnected) {
        login();
      } else {
        showToast('Syncing your account — please try again in a moment', 'info');
      }
      return;
    }

    setLoading(true);
    try {
      const endpoint = isFollowing ? 'unfollow' : 'follow';
      await apiClient.post(
        `/api/tapestry/${endpoint}`,
        { targetProfileId, targetUsername }
      );

      const newState = !isFollowing;
      setIsFollowing(newState);
      onFollowChange?.(newState);
      showToast(
        newState ? 'Following — they\'ll appear on your Friends leaderboard' : 'Unfollowed',
        newState ? 'success' : 'info'
      );
    } catch (err) {
      showToast('Failed to update follow status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isSm = size === 'sm';

  if (loading) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 ${
          isSm ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'
        } ${className}`}
      >
        <div className={`border-2 border-gray-400 border-t-transparent rounded-full animate-spin ${
          isSm ? 'w-3 h-3' : 'w-4 h-4'
        }`} />
      </button>
    );
  }

  if (isFollowing) {
    return (
      <button
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`inline-flex items-center gap-1 rounded-md font-medium transition-all border ${
          isHovered
            ? 'border-rose-500/30 bg-rose-500/5 text-rose-400'
            : 'border-transparent bg-transparent text-gray-500'
        } ${
          isSm ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
        } ${className}`}
      >
        {isHovered ? (
          <>
            <UserMinus size={isSm ? 11 : 13} weight="bold" />
            Unfollow
          </>
        ) : (
          <>
            <Check size={isSm ? 11 : 13} weight="bold" className="text-emerald-500" />
            Following
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1 rounded-md font-medium transition-all border border-transparent text-gray-500 hover:border-gray-600 hover:bg-gray-800 hover:text-gray-200 ${
        isSm ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      } ${className}`}
    >
      <UserPlus size={isSm ? 11 : 13} weight="bold" />
      Follow
    </button>
  );
}
