import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import type { ForesightScore, DailyStatus, LeaderboardEntry } from '../types';

export function useForesightScore(enabled = true) {
  return useQuery({
    queryKey: ['foresight-score'],
    queryFn: async (): Promise<ForesightScore> => {
      const { data } = await api.get('/api/v2/fs/me');
      return data.data;
    },
    enabled,
  });
}

export function useDailyStatus(enabled = true) {
  return useQuery({
    queryKey: ['daily-status'],
    queryFn: async (): Promise<DailyStatus> => {
      const { data } = await api.get('/api/v2/fs/daily-status');
      return data.data;
    },
    enabled,
  });
}

export function useFSLeaderboard(type: 'all_time' | 'season' | 'weekly' = 'season', limit = 50, enabled = true) {
  return useQuery({
    queryKey: ['fs-leaderboard', type],
    queryFn: async (): Promise<{ entries: LeaderboardEntry[]; total: number }> => {
      const { data } = await api.get('/api/v2/fs/leaderboard', { params: { type, limit } });
      const raw = data.data;
      // API returns `score` and `rank: null` — normalize to LeaderboardEntry shape
      const entries: LeaderboardEntry[] = (raw.entries ?? []).map((e: any, i: number) => ({
        rank: e.rank ?? i + 1,
        userId: e.userId ?? '',
        username: e.username ?? 'Anonymous',
        avatar: e.avatarUrl ?? e.avatar,
        totalScore: e.totalScore ?? e.score ?? 0,
        tier: e.tier,
        percentile: e.percentile,
      }));
      return { entries, total: raw.total ?? entries.length };
    },
    enabled,
  });
}

export function useTrackActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (activityType: string) => {
      const { data } = await api.post('/api/v2/fs/track-activity', { activityType });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-status'] });
      queryClient.invalidateQueries({ queryKey: ['foresight-score'] });
    },
  });
}
