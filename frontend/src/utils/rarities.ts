/**
 * Shared Rarity/Tier Definitions for CT Influence Competition
 * Consistent tier labels, gradients, and styling across all pages + canvas cards
 */

import { Sparkle, Star, TrendUp, Medal } from '@phosphor-icons/react';

export interface RarityInfo {
  label: string;
  fullLabel: string;
  gradient: string;
  badge: string;
  icon: typeof Sparkle;
  glow: string;
  border: string;
  text: string;
  // Canvas-ready hex values
  hexColor: string;
  glowColor: string;
  gradientPair: [string, string];
}

export const rarities: Record<string, RarityInfo> = {
  S: {
    label: 'Legendary',
    fullLabel: 'LEGENDARY',
    gradient: 'from-amber-500/20 to-yellow-500/10',
    badge: 'bg-amber-500',
    icon: Sparkle,
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
    border: 'border-amber-500/50',
    text: 'text-amber-400',
    hexColor: '#F59E0B',
    glowColor: 'rgba(245,158,11,0.25)',
    gradientPair: ['#FBBF24', '#D97706'],
  },
  A: {
    label: 'Epic',
    fullLabel: 'EPIC',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    badge: 'bg-cyan-500',
    icon: Star,
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    border: 'border-cyan-500/50',
    text: 'text-cyan-400',
    hexColor: '#06B6D4',
    glowColor: 'rgba(6,182,212,0.20)',
    gradientPair: ['#22D3EE', '#0891B2'],
  },
  B: {
    label: 'Rare',
    fullLabel: 'RARE',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    badge: 'bg-emerald-500',
    icon: TrendUp,
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    border: 'border-emerald-500/50',
    text: 'text-emerald-400',
    hexColor: '#10B981',
    glowColor: 'rgba(16,185,129,0.18)',
    gradientPair: ['#34D399', '#059669'],
  },
  C: {
    label: 'Common',
    fullLabel: 'COMMON',
    gradient: 'from-gray-600/20 to-gray-700/10',
    badge: 'bg-gray-500',
    icon: Medal,
    glow: '',
    border: 'border-gray-700',
    text: 'text-gray-400',
    hexColor: '#71717A',
    glowColor: 'rgba(113,113,122,0.12)',
    gradientPair: ['#A1A1AA', '#52525B'],
  },
};

/** Archetype color map (computed by backend from Twitter metrics) */
export const ARCHETYPE_COLORS: Record<string, { hex: string; tailwind: string }> = {
  'Activity Beast':     { hex: '#3B82F6', tailwind: 'text-blue-400' },
  'Engagement Wizard':  { hex: '#F59E0B', tailwind: 'text-gold-400' },
  'Growth Machine':     { hex: '#10B981', tailwind: 'text-emerald-400' },
  'Viral Sniper':       { hex: '#F43F5E', tailwind: 'text-rose-400' },
  'All-Rounder':        { hex: '#71717A', tailwind: 'text-gray-400' },
};

export function getArchetypeColor(archetype?: string) {
  return ARCHETYPE_COLORS[archetype ?? 'All-Rounder'] ?? ARCHETYPE_COLORS['All-Rounder'];
}

/**
 * Get rarity information for a tier
 * Falls back to Common (C) if tier is invalid
 */
export function getRarityInfo(tier: string): RarityInfo {
  return rarities[tier] || rarities.C;
}
