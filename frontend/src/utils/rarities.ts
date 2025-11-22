/**
 * Shared Rarity/Tier Definitions for CT Fantasy League
 * Consistent tier labels, gradients, and styling across all pages
 */

import { Sparkle, Star, TrendUp, Medal } from '@phosphor-icons/react';

export interface RarityInfo {
  label: string;
  gradient: string;
  badge: string;
  icon: typeof Sparkle;
}

export const rarities: Record<string, RarityInfo> = {
  S: {
    label: 'Legendary',
    gradient: 'from-amber-400 via-yellow-500 to-amber-600',
    badge: 'bg-gradient-to-br from-amber-400 to-yellow-600',
    icon: Sparkle,
  },
  A: {
    label: 'Epic',
    gradient: 'from-purple-400 via-fuchsia-500 to-purple-600',
    badge: 'bg-gradient-to-br from-purple-400 to-fuchsia-600',
    icon: Star,
  },
  B: {
    label: 'Rare',
    gradient: 'from-blue-400 via-cyan-500 to-blue-600',
    badge: 'bg-gradient-to-br from-blue-400 to-cyan-600',
    icon: TrendUp,
  },
  C: {
    label: 'Common',
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
    badge: 'bg-gradient-to-br from-gray-400 to-gray-600',
    icon: Medal,
  },
};

/**
 * Get rarity information for a tier
 * Falls back to Common (C) if tier is invalid
 */
export function getRarityInfo(tier: string): RarityInfo {
  return rarities[tier] || rarities.C;
}
