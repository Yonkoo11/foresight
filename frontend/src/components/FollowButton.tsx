/**
 * FollowButton — Follow/unfollow users via Tapestry social graph
 *
 * States:
 * - Not following: Cyan outline button "Follow"
 * - Following: Gold-bordered button "Following", rose hint on hover → "Unfollow"
 * - Loading: Spinner
 */

import { useState } from 'react';
import { UserPlus, UserMinus, Check } from '@phosphor-icons/react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface FollowButtonProps {
  targetProfileId: string;
  initialFollowing?: boolean;
  size?: 'sm' | 'md';
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export default function FollowButton({
  targetProfileId,
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
    const token = localStorage.getItem('authToken');
    if (!token) {
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
      await axios.post(
        `${API_URL}/api/tapestry/${endpoint}`,
        { targetProfileId },
        { headers: { Authorization: `Bearer ${token}` } }
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
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all ${
          isHovered
            ? 'border-rose-500/50 bg-rose-500/10 text-rose-400'
            : 'border-gold-500/30 bg-gold-500/10 text-gold-400'
        } border ${
          isSm ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'
        } ${className}`}
      >
        {isHovered ? (
          <>
            <UserMinus size={isSm ? 12 : 14} weight="bold" />
            Unfollow
          </>
        ) : (
          <>
            <Check size={isSm ? 12 : 14} weight="bold" />
            Following
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 ${
        isSm ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'
      } ${className}`}
    >
      <UserPlus size={isSm ? 12 : 14} weight="bold" />
      Follow
    </button>
  );
}
