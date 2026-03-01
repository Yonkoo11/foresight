/**
 * useBrowseTimeTracker
 * Tracks time spent on a page and awards FS when threshold is reached
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import apiClient, { hasSession } from '../lib/apiClient';
import { useToast } from '../contexts/ToastContext';

const REQUIRED_SECONDS = 30;

interface UseBrowseTimeTrackerOptions {
  activityType: 'browse_ct_feed' | 'check_live_scores';
  enabled?: boolean;
}

interface BrowseTimeState {
  secondsSpent: number;
  rewardEarned: boolean;
  fsAmount: number | null;
  isChecking: boolean;
}

export function useBrowseTimeTracker(options: UseBrowseTimeTrackerOptions): BrowseTimeState {
  const { activityType, enabled = true } = options;
  const { showToast } = useToast();

  const [secondsSpent, setSecondsSpent] = useState(0);
  const [rewardEarned, setRewardEarned] = useState(false);
  const [fsAmount, setFsAmount] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasClaimedRef = useRef(false);
  const isClaimingRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const statusCheckedRef = useRef(false);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Check if already claimed today on mount
  useEffect(() => {
    if (!enabled || statusCheckedRef.current) return;

    const checkDailyStatus = async () => {
      if (!hasSession()) {
        setIsChecking(false);
        return;
      }

      try {
        const res = await apiClient.get(`/api/v2/fs/daily-status`, {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (res.data.success) {
          const activities = res.data.data.activities;
          if (activities[activityType]?.completed) {
            console.log('[BrowseTracker] Already claimed today');
            setRewardEarned(true);
            hasClaimedRef.current = true;
          }
        }
      } catch (err) {
        console.error('[BrowseTracker] Error checking status:', err);
      } finally {
        setIsChecking(false);
        statusCheckedRef.current = true;
      }
    };

    checkDailyStatus();
  }, [activityType, enabled]);

  // Claim reward when threshold reached
  const claimReward = useCallback(async (duration: number) => {
    if (hasClaimedRef.current || isClaimingRef.current) return;

    if (!hasSession()) return;

    isClaimingRef.current = true;
    console.log('[BrowseTracker] Claiming reward, duration:', duration);

    try {
      const res = await apiClient.post(
        `/api/v2/fs/track-activity`,
        { activityType, durationSeconds: duration }
      );

      console.log('[BrowseTracker] Response:', res.data);

      if (res.data.success) {
        if (!res.data.data.alreadyClaimed) {
          const earned = res.data.data.fsAwarded;
          setFsAmount(earned);
          setRewardEarned(true);
          hasClaimedRef.current = true;
          showToast(`+${earned} FS for browsing Intel!`, 'success');
        } else {
          setRewardEarned(true);
          hasClaimedRef.current = true;
        }
      }
    } catch (err: any) {
      console.error('[BrowseTracker] Error claiming reward:', err.response?.data || err.message);
      // Allow retry on error
    } finally {
      isClaimingRef.current = false;
    }
  }, [activityType, showToast]);

  // Start tracking time after status is checked
  useEffect(() => {
    // Don't start until we've checked status
    if (isChecking) return;
    // Don't start if disabled or already claimed
    if (!enabled || hasClaimedRef.current) return;

    console.log('[BrowseTracker] Starting timer');
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSecondsSpent(elapsed);

      // Check if threshold reached
      if (elapsed >= REQUIRED_SECONDS && !hasClaimedRef.current && !isClaimingRef.current) {
        console.log('[BrowseTracker] Threshold reached, claiming...');
        claimReward(elapsed);

        // Stop the interval after claiming
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, isChecking, claimReward]);

  // Handle visibility changes (pause when tab is hidden)
  useEffect(() => {
    if (!enabled || isChecking) return;

    const handleVisibilityChange = () => {
      if (hasClaimedRef.current) return;

      if (document.hidden) {
        // Pause tracking
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Resume tracking from where we left off
        if (!intervalRef.current) {
          const currentSeconds = secondsSpent;
          startTimeRef.current = Date.now() - currentSeconds * 1000;

          intervalRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
            setSecondsSpent(elapsed);

            if (elapsed >= REQUIRED_SECONDS && !hasClaimedRef.current && !isClaimingRef.current) {
              claimReward(elapsed);
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
            }
          }, 1000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, isChecking, secondsSpent, claimReward]);

  return {
    secondsSpent,
    rewardEarned,
    fsAmount,
    isChecking,
  };
}

export default useBrowseTimeTracker;
