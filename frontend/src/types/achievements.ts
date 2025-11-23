export type AchievementId =
  | 'few_understand'
  | 'diamond_hands'
  | 'gm_streak_7'
  | 'gm_streak_30'
  | 'sent_it'
  | 'to_the_moon'
  | 'degen_mode'
  | 'perfect_week'
  | 'first_blood'
  | 'comeback_kid'
  | 'whale_watcher'
  | 'the_chosen_one';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  unlockedAt?: string; // ISO timestamp
  progress?: {
    current: number;
    target: number;
  };
}

export interface UserAchievement {
  userId: string;
  achievementId: AchievementId;
  unlockedAt: string;
  progress?: number;
}

// Achievement definitions
export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'unlockedAt' | 'progress'>> = {
  few_understand: {
    id: 'few_understand',
    name: 'few understand',
    description: 'drafted a perfect team',
    icon: '💎',
    rarity: 'legendary',
  },
  diamond_hands: {
    id: 'diamond_hands',
    name: 'diamond hands',
    description: 'kept same team for 4 weeks',
    icon: '💪',
    rarity: 'epic',
  },
  gm_streak_7: {
    id: 'gm_streak_7',
    name: 'gm streak',
    description: '7 days in a row',
    icon: '🔥',
    rarity: 'common',
  },
  gm_streak_30: {
    id: 'gm_streak_30',
    name: 'gm legend',
    description: '30 days in a row',
    icon: '🔥',
    rarity: 'epic',
  },
  sent_it: {
    id: 'sent_it',
    name: 'sent it',
    description: 'all budget on S-tier players',
    icon: '🚀',
    rarity: 'rare',
  },
  to_the_moon: {
    id: 'to_the_moon',
    name: 'to the moon',
    description: 'scored 200+ in a week',
    icon: '🌙',
    rarity: 'rare',
  },
  degen_mode: {
    id: 'degen_mode',
    name: 'degen mode',
    description: 'risky draft paid off',
    icon: '⚡',
    rarity: 'rare',
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'perfect week',
    description: 'all 5 picks scored 20+',
    icon: '⭐',
    rarity: 'epic',
  },
  first_blood: {
    id: 'first_blood',
    name: 'first blood',
    description: 'won your first contest',
    icon: '🎯',
    rarity: 'common',
  },
  comeback_kid: {
    id: 'comeback_kid',
    name: 'comeback kid',
    description: 'went from last to top 10',
    icon: '📈',
    rarity: 'epic',
  },
  whale_watcher: {
    id: 'whale_watcher',
    name: 'whale watcher',
    description: 'reached whale rank',
    icon: '🐋',
    rarity: 'legendary',
  },
  the_chosen_one: {
    id: 'the_chosen_one',
    name: 'the chosen one',
    description: 'picked CT spotlight winner 3 weeks straight',
    icon: '👁️',
    rarity: 'legendary',
  },
};

// Helper to check if achievement is unlocked
export function isAchievementUnlocked(
  userAchievements: UserAchievement[],
  achievementId: AchievementId
): boolean {
  return userAchievements.some((a) => a.achievementId === achievementId);
}

// Get achievement progress
export function getAchievementWithProgress(
  achievementId: AchievementId,
  userAchievements: UserAchievement[]
): Achievement {
  const base = ACHIEVEMENTS[achievementId];
  const userAch = userAchievements.find((a) => a.achievementId === achievementId);

  return {
    ...base,
    unlockedAt: userAch?.unlockedAt,
    progress: userAch?.progress !== undefined ? {
      current: userAch.progress,
      target: getAchievementTarget(achievementId),
    } : undefined,
  };
}

// Get target value for achievements with progress
function getAchievementTarget(achievementId: AchievementId): number {
  const targets: Partial<Record<AchievementId, number>> = {
    gm_streak_7: 7,
    gm_streak_30: 30,
    diamond_hands: 4,
    the_chosen_one: 3,
  };
  return targets[achievementId] || 1;
}
