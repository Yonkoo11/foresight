/**
 * Foresight Score Calculations
 * Determines user level, colors, and stats based on onchain data
 */

export interface UserStats {
  totalPredictions: bigint;
  resolvedPredictions: bigint;
  correctPredictions: bigint;
  currentStreak: bigint;
  foresightScore: bigint;
}

export type ForesightLevel = 'ORACLE' | 'PROPHET' | 'SEER' | 'APPRENTICE' | 'NOVICE';

export interface ForesightData {
  level: ForesightLevel;
  levelColor: string;
  levelEmoji: string;
  levelDescription: string;
  accuracy: number;
  streakCount: number;
  scoreValue: number;
}

/**
 * Get foresight level based on score (0-100)
 */
export function getForesightLevel(score: number): ForesightLevel {
  if (score >= 90) return 'ORACLE';
  if (score >= 75) return 'PROPHET';
  if (score >= 60) return 'SEER';
  if (score >= 40) return 'APPRENTICE';
  return 'NOVICE';
}

/**
 * Get level color (CSS variable)
 */
export function getLevelColor(level: ForesightLevel): string {
  const colors: Record<ForesightLevel, string> = {
    ORACLE: '#ffd700',      // Gold
    PROPHET: '#9945ff',     // Purple
    SEER: '#00d9ff',        // Cyan
    APPRENTICE: '#0066ff',  // Blue
    NOVICE: '#6e7681',      // Gray
  };
  return colors[level];
}

/**
 * Get level emoji
 */
export function getLevelEmoji(level: ForesightLevel): string {
  const emojis: Record<ForesightLevel, string> = {
    ORACLE: '🌟',
    PROPHET: '🔮',
    SEER: '👁️',
    APPRENTICE: '🌱',
    NOVICE: '🎯',
  };
  return emojis[level];
}

/**
 * Get level description
 */
export function getLevelDescription(level: ForesightLevel): string {
  const descriptions: Record<ForesightLevel, string> = {
    ORACLE: 'Legendary foresight',
    PROPHET: 'Exceptional accuracy',
    SEER: 'Strong prediction skills',
    APPRENTICE: 'Building track record',
    NOVICE: 'Just getting started',
  };
  return descriptions[level];
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(stats: UserStats): number {
  const resolved = Number(stats.resolvedPredictions);
  const correct = Number(stats.correctPredictions);

  if (resolved === 0) return 0;
  return Math.round((correct / resolved) * 100);
}

/**
 * Get complete foresight data for UI rendering
 */
export function getForesightData(stats: UserStats): ForesightData {
  const scoreValue = Number(stats.foresightScore);
  const level = getForesightLevel(scoreValue);
  const accuracy = calculateAccuracy(stats);
  const streakCount = Number(stats.currentStreak);

  return {
    level,
    levelColor: getLevelColor(level),
    levelEmoji: getLevelEmoji(level),
    levelDescription: getLevelDescription(level),
    accuracy,
    streakCount,
    scoreValue,
  };
}

/**
 * Calculate glow intensity based on streak (0-1)
 * Max streak of 10 = full intensity
 */
export function getGlowIntensity(streak: number): number {
  return Math.min(streak / 10, 1);
}

/**
 * Get next level threshold
 */
export function getNextLevelThreshold(currentLevel: ForesightLevel): number | null {
  const thresholds: Record<ForesightLevel, number | null> = {
    NOVICE: 40,
    APPRENTICE: 60,
    SEER: 75,
    PROPHET: 90,
    ORACLE: null, // Max level
  };
  return thresholds[currentLevel];
}

/**
 * Calculate progress to next level (0-100)
 */
export function getProgressToNextLevel(score: number, level: ForesightLevel): number {
  const nextThreshold = getNextLevelThreshold(level);
  if (!nextThreshold) return 100; // Already at max level

  const currentThresholds: Record<ForesightLevel, number> = {
    NOVICE: 0,
    APPRENTICE: 40,
    SEER: 60,
    PROPHET: 75,
    ORACLE: 90,
  };

  const currentThreshold = currentThresholds[level];
  const range = nextThreshold - currentThreshold;
  const progress = score - currentThreshold;

  return Math.round((progress / range) * 100);
}
