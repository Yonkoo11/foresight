# Tapestry Frontend Implementation Quickstart

> **Companion to:** `TAPESTRY_TECHNICAL_ARCHITECTURE.md`
> **Time to implement:** 15-20 hours
> **Difficulty:** Medium (React patterns are standard)

---

## Phase 1: Context Setup (3 hours)

### Step 1.1: Create TapestryContext.tsx

**File:** `frontend/src/contexts/TapestryContext.tsx`

```typescript
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface TapestryContextValue {
  // Identity
  myTapestryProfileId: string | null;
  isLoading: boolean;

  // Social graph cache (session lifetime)
  followingMap: Record<string, boolean>; // profileId → isFollowing
  followerCounts: Record<string, number>; // profileId → count

  // Content interactions cache
  likedTeams: Set<string>; // contentId → liked
  teamLikeCounts: Record<string, number>; // contentId → count
  teamCommentCounts: Record<string, number>; // contentId → count

  // Loading states
  loadingFollows: Set<string>; // profileId in flight
  loadingLikes: Set<string>; // contentId in flight

  // Mutations
  follow(targetProfileId: string): Promise<void>;
  unfollow(targetProfileId: string): Promise<void>;
  likeTeam(contentId: string): Promise<void>;
  unlikeTeam(contentId: string): Promise<void>;
  postComment(contentId: string, text: string): Promise<string>;

  // Cache control
  refetchFollowingState(profileIds: string[]): Promise<void>;

  // Error handling
  error: string | null;
  clearError(): void;
}

const TapestryContext = createContext<TapestryContextValue | undefined>(
  undefined
);

export function TapestryProvider({ children }: { children: ReactNode }) {
  const [myTapestryProfileId, setMyTapestryProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Social graph
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [followerCounts, setFollowerCounts] = useState<Record<string, number>>({});

  // Content interactions
  const [likedTeams, setLikedTeams] = useState<Set<string>>(new Set());
  const [teamLikeCounts, setTeamLikeCounts] = useState<Record<string, number>>({});
  const [teamCommentCounts, setTeamCommentCounts] = useState<Record<string, number>>({});

  // Loading states
  const [loadingFollows, setLoadingFollows] = useState<Set<string>>(new Set());
  const [loadingLikes, setLoadingLikes] = useState<Set<string>>(new Set());

  // Error
  const [error, setError] = useState<string | null>(null);

  // Initialize on mount
  useEffect(() => {
    initializeFromAuth();
  }, []);

  const initializeFromAuth = async () => {
    try {
      // Get current user data which includes tapestry_user_id
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/v2/fs/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Assuming the user response includes tapestry_user_id
      // If not, get it from a dedicated endpoint
      const userData = res.data.data;
      if (userData.tapestryProfileId) {
        setMyTapestryProfileId(userData.tapestryProfileId);
      }
    } catch (err) {
      console.error('Failed to initialize Tapestry context:', err);
      // Not blocking — app works without Tapestry
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  // Follow mutation
  const follow = useCallback(async (targetProfileId: string) => {
    // Optimistic update
    setFollowingMap(prev => ({ ...prev, [targetProfileId]: true }));
    setLoadingFollows(prev => new Set(prev).add(targetProfileId));

    try {
      await axios.post(
        `${API_URL}/api/tapestry/follow`,
        { targetProfileId },
        { headers: getAuthHeaders() }
      );
    } catch (err: any) {
      // Revert on error
      setFollowingMap(prev => ({ ...prev, [targetProfileId]: false }));
      setError(err.response?.data?.error || 'Failed to follow');
      throw err;
    } finally {
      setLoadingFollows(prev => {
        const next = new Set(prev);
        next.delete(targetProfileId);
        return next;
      });
    }
  }, []);

  // Unfollow mutation
  const unfollow = useCallback(async (targetProfileId: string) => {
    setFollowingMap(prev => ({ ...prev, [targetProfileId]: false }));
    setLoadingFollows(prev => new Set(prev).add(targetProfileId));

    try {
      await axios.post(
        `${API_URL}/api/tapestry/unfollow`,
        { targetProfileId },
        { headers: getAuthHeaders() }
      );
    } catch (err: any) {
      // Revert on error
      setFollowingMap(prev => ({ ...prev, [targetProfileId]: true }));
      setError(err.response?.data?.error || 'Failed to unfollow');
      throw err;
    } finally {
      setLoadingFollows(prev => {
        const next = new Set(prev);
        next.delete(targetProfileId);
        return next;
      });
    }
  }, []);

  // Like mutation
  const likeTeam = useCallback(async (contentId: string) => {
    // Optimistic update
    setLikedTeams(prev => new Set(prev).add(contentId));
    setTeamLikeCounts(prev => ({
      ...prev,
      [contentId]: (prev[contentId] || 0) + 1
    }));
    setLoadingLikes(prev => new Set(prev).add(contentId));

    try {
      await axios.post(
        `${API_URL}/api/tapestry/like/${contentId}`,
        {},
        { headers: getAuthHeaders() }
      );
    } catch (err: any) {
      // Revert on error
      setLikedTeams(prev => {
        const next = new Set(prev);
        next.delete(contentId);
        return next;
      });
      setTeamLikeCounts(prev => ({
        ...prev,
        [contentId]: (prev[contentId] || 0) - 1
      }));
      setError(err.response?.data?.error || 'Failed to like');
      throw err;
    } finally {
      setLoadingLikes(prev => {
        const next = new Set(prev);
        next.delete(contentId);
        return next;
      });
    }
  }, []);

  // Unlike mutation
  const unlikeTeam = useCallback(async (contentId: string) => {
    setLikedTeams(prev => {
      const next = new Set(prev);
      next.delete(contentId);
      return next;
    });
    setTeamLikeCounts(prev => ({
      ...prev,
      [contentId]: (prev[contentId] || 0) - 1
    }));
    setLoadingLikes(prev => new Set(prev).add(contentId));

    try {
      await axios.delete(
        `${API_URL}/api/tapestry/like/${contentId}`,
        { headers: getAuthHeaders() }
      );
    } catch (err: any) {
      // Revert on error
      setLikedTeams(prev => new Set(prev).add(contentId));
      setTeamLikeCounts(prev => ({
        ...prev,
        [contentId]: (prev[contentId] || 0) + 1
      }));
      setError(err.response?.data?.error || 'Failed to unlike');
      throw err;
    } finally {
      setLoadingLikes(prev => {
        const next = new Set(prev);
        next.delete(contentId);
        return next;
      });
    }
  }, []);

  // Post comment
  const postComment = useCallback(async (contentId: string, text: string): Promise<string> => {
    try {
      const res = await axios.post(
        `${API_URL}/api/tapestry/comment/${contentId}`,
        { text },
        { headers: getAuthHeaders() }
      );

      // Update comment count
      setTeamCommentCounts(prev => ({
        ...prev,
        [contentId]: (prev[contentId] || 0) + 1
      }));

      return res.data.data.commentId;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post comment');
      throw err;
    }
  }, []);

  // Refetch following state for multiple profiles
  const refetchFollowingState = useCallback(async (profileIds: string[]) => {
    if (profileIds.length === 0) return;

    try {
      const idString = profileIds.join(',');
      const res = await axios.get(
        `${API_URL}/api/tapestry/following-state-batch`,
        {
          params: { profileIds: idString },
          headers: getAuthHeaders()
        }
      );

      setFollowingMap(prev => ({
        ...prev,
        ...res.data.data.following
      }));
    } catch (err: any) {
      console.error('Failed to refetch following state:', err);
      // Graceful degradation — keep cached values
    }
  }, []);

  const value: TapestryContextValue = {
    myTapestryProfileId,
    isLoading,
    followingMap,
    followerCounts,
    likedTeams,
    teamLikeCounts,
    teamCommentCounts,
    loadingFollows,
    loadingLikes,
    follow,
    unfollow,
    likeTeam,
    unlikeTeam,
    postComment,
    refetchFollowingState,
    error,
    clearError: () => setError(null),
  };

  return (
    <TapestryContext.Provider value={value}>
      {children}
    </TapestryContext.Provider>
  );
}

export function useTapestry(): TapestryContextValue {
  const context = useContext(TapestryContext);
  if (!context) {
    throw new Error('useTapestry must be used within TapestryProvider');
  }
  return context;
}
```

### Step 1.2: Add Provider to App.tsx

```typescript
// frontend/src/App.tsx

import { TapestryProvider } from './contexts/TapestryContext';

export default function App() {
  return (
    <TapestryProvider>
      {/* rest of app */}
    </TapestryProvider>
  );
}
```

---

## Phase 2: Components (6 hours)

### Step 2.1: FollowButton Component

**File:** `frontend/src/components/FollowButton.tsx`

```typescript
import { useState } from 'react';
import { UserPlus, UserMinus, Warning } from '@phosphor-icons/react';
import { useTapestry } from '../contexts/TapestryContext';

interface FollowButtonProps {
  targetProfileId: string;
  targetUsername: string;
  size?: 'sm' | 'md';
}

export default function FollowButton({
  targetProfileId,
  targetUsername,
  size = 'md'
}: FollowButtonProps) {
  const { followingMap, loadingFollows, follow, unfollow } = useTapestry();
  const [error, setError] = useState<string | null>(null);

  const isFollowing = followingMap[targetProfileId] ?? false;
  const isLoading = loadingFollows.has(targetProfileId);

  const handleToggle = async () => {
    setError(null);
    try {
      if (isFollowing) {
        await unfollow(targetProfileId);
      } else {
        await follow(targetProfileId);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update follow status');
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  }[size];

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          ${sizeClasses} rounded-lg font-medium transition-colors
          flex items-center justify-center gap-2
          ${isFollowing
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gold-500 hover:bg-gold-600 text-black'
          }
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
        title={isFollowing ? `Unfollow ${targetUsername}` : `Follow ${targetUsername}`}
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-3 h-3 border-2 border-current border-t-transparent rounded-full" />
            {isFollowing ? 'Unfollowing...' : 'Following...'}
          </>
        ) : (
          <>
            {isFollowing ? (
              <>
                <UserMinus size={16} />
                Following
              </>
            ) : (
              <>
                <UserPlus size={16} />
                Follow
              </>
            )}
          </>
        )}
      </button>
      {error && (
        <div className="flex items-center gap-1 text-rose-500 text-xs">
          <Warning size={12} weight="fill" />
          {error}
        </div>
      )}
    </div>
  );
}
```

### Step 2.2: LikeButton Component

**File:** `frontend/src/components/LikeButton.tsx`

```typescript
import { useState } from 'react';
import { Heart, Warning } from '@phosphor-icons/react';
import { useTapestry } from '../contexts/TapestryContext';

interface LikeButtonProps {
  contentId: string;
  initialCount?: number;
  onLikeChange?: (newCount: number) => void;
}

export default function LikeButton({
  contentId,
  initialCount = 0,
  onLikeChange
}: LikeButtonProps) {
  const { likedTeams, loadingLikes, teamLikeCounts, likeTeam, unlikeTeam } = useTapestry();
  const [error, setError] = useState<string | null>(null);

  const isLiked = likedTeams.has(contentId);
  const isLoading = loadingLikes.has(contentId);
  const count = teamLikeCounts[contentId] ?? initialCount;

  const handleToggle = async () => {
    setError(null);
    const oldCount = count;

    try {
      if (isLiked) {
        await unlikeTeam(contentId);
        onLikeChange?.(oldCount - 1);
      } else {
        await likeTeam(contentId);
        onLikeChange?.(oldCount + 1);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update like');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`
          flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors
          ${isLiked
            ? 'text-rose-500 bg-rose-500/10'
            : 'text-gray-400 hover:text-rose-500 hover:bg-rose-500/5'
          }
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
        title={isLiked ? 'Unlike' : 'Like'}
      >
        <Heart
          size={16}
          weight={isLiked ? 'fill' : 'regular'}
          className={isLoading ? 'animate-pulse' : ''}
        />
        <span className="text-xs font-medium tabular-nums">{count}</span>
      </button>
      {error && (
        <div className="flex items-center gap-1 text-rose-500 text-xs">
          <Warning size={12} weight="fill" />
          {error}
        </div>
      )}
    </div>
  );
}
```

### Step 2.3: CommentModal Component

**File:** `frontend/src/components/CommentModal.tsx`

```typescript
import { useState } from 'react';
import { X, PaperPlaneRight, Warning } from '@phosphor-icons/react';
import { useTapestry } from '../contexts/TapestryContext';

interface CommentModalProps {
  contentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCommentPosted?: (commentId: string) => void;
}

export default function CommentModal({
  contentId,
  isOpen,
  onClose,
  onCommentPosted
}: CommentModalProps) {
  const { postComment } = useTapestry();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contentId || !text.trim()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const commentId = await postComment(contentId, text.trim());
      onCommentPosted?.(commentId);
      setText('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-gray-900 w-full sm:max-w-md rounded-t-xl sm:rounded-lg shadow-xl border border-gray-800 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Add Comment</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-60"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts about this team..."
            className="
              w-full h-32 p-3 bg-gray-800 border border-gray-700 rounded-lg
              text-white placeholder-gray-500 text-sm
              focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500
              disabled:opacity-60
              resize-none
            "
            maxLength={500}
            disabled={isSubmitting}
            autoFocus
          />

          {/* Character count */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{text.length}/500</span>
            {error && (
              <div className="flex items-center gap-1 text-rose-500">
                <Warning size={12} weight="fill" />
                {error}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="
                px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700
                text-white text-sm font-medium transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim() || isSubmitting}
              className="
                px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600
                text-black text-sm font-medium transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center gap-2
              "
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Posting...
                </>
              ) : (
                <>
                  <PaperPlaneRight size={16} weight="fill" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Phase 3: Hook for Modal State (1 hour)

**File:** `frontend/src/hooks/useCommentModal.ts`

```typescript
import { useState } from 'react';

interface CommentModalState {
  isOpen: boolean;
  contentId: string | null;
}

export function useCommentModal() {
  const [state, setState] = useState<CommentModalState>({
    isOpen: false,
    contentId: null,
  });

  return [
    state,
    {
      open: (contentId: string) => {
        setState({ isOpen: true, contentId });
      },
      close: () => {
        setState({ isOpen: false, contentId: null });
      },
    }
  ] as const;
}
```

---

## Phase 4: Integration (4 hours)

### Step 4.1: Update Leaderboard Component

Add these buttons to your leaderboard entry rows:

```typescript
import FollowButton from '../components/FollowButton';
import LikeButton from '../components/LikeButton';
import CommentModal from '../components/CommentModal';
import { useCommentModal } from '../hooks/useCommentModal';

// In your Leaderboard component
const [commentModal, commentActions] = useCommentModal();

// When rendering each team in leaderboard:
<tr key={team.id} className="border-b border-gray-700 hover:bg-gray-800/50">
  <td>{team.rank}</td>
  <td>{team.teamName}</td>
  <td className="text-right font-bold text-gold-500">{team.totalScore}</td>

  {/* Author follow button */}
  <td>
    <FollowButton
      targetProfileId={team.authorTapestryProfileId}
      targetUsername={team.authorUsername}
      size="sm"
    />
  </td>

  {/* Like button */}
  <td>
    <LikeButton
      contentId={team.tapestryTeamContentId}
      initialCount={0}
    />
  </td>

  {/* Comment button */}
  <td>
    <button
      onClick={() => commentActions.open(team.tapestryTeamContentId)}
      className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
      title="Add comment"
    >
      💬
    </button>
  </td>
</tr>

{/* Modal outside the table */}
<CommentModal
  contentId={commentModal.contentId}
  isOpen={commentModal.isOpen}
  onClose={commentActions.close}
  onCommentPosted={(id) => console.log('Comment posted:', id)}
/>
```

---

## Testing Checklist

- [ ] TapestryProvider initializes without errors
- [ ] useTapestry hook returns context values
- [ ] FollowButton follow/unfollow works
- [ ] LikeButton like/unlike works
- [ ] CommentModal opens/closes
- [ ] Comment posts and updates count
- [ ] Optimistic updates appear immediately
- [ ] Errors revert optimistic updates
- [ ] Loading states show spinners
- [ ] Mobile responsive (test on phone)

---

## Troubleshooting

### "useTapestry must be used within TapestryProvider"
- Ensure App.tsx wraps components with `<TapestryProvider>`
- Check nesting order in App.tsx

### Buttons don't respond to clicks
- Check browser console for errors
- Verify auth token exists: `localStorage.getItem('authToken')`
- Check network tab to see if API calls are made

### Context loses state on refresh
- This is expected — state is session-only
- To persist: Save to localStorage or backend DB (future feature)
- Refetch on page load: Call `refetchFollowingState` in useEffect

---

*Last updated: Feb 22, 2026*
