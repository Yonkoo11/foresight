export const colors = {
  background: '#09090B',
  card: '#18181B',
  cardBorder: '#27272A',
  surface: '#27272A',
  brand: '#F59E0B',
  brandDark: '#D97706',
  cyan: '#06B6D4',
  success: '#10B981',
  error: '#F43F5E',
  text: '#F0F0F3',          // was #FAFAFA — reduced to prevent halation on dark bg
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  white: '#FFFFFF',
  black: '#000000',
  // Tier colors
  tierS: '#F59E0B',
  tierA: '#06B6D4',
  tierB: '#10B981',
  tierC: '#71717A',
};

// Dark mode elevation layers (UX_MASTERY §2)
// Each layer adds ~4-6% lightness from base
export const elevation = {
  /** Page background (L ~3%) */
  base: '#09090B',
  /** Cards, panels (L ~7%) */
  surface: '#18181B',
  /** Modals, dropdowns (L ~11%) */
  elevated: '#27272A',
  /** Hover states, overlays (L ~17%) */
  overlay: '#3F3F46',
  /** Active states (L ~25%) */
  emphasis: '#52525B',
} as const;

// 5-level text hierarchy (UX_MASTERY §2)
// Each step drops ~15-20% lightness
export const textLevels = {
  /** Headings (L ~94%, ~16:1 vs base) */
  primary: '#F0F0F3',
  /** Body copy (L ~83%) */
  body: '#D4D4D8',
  /** Meta, descriptions (L ~63%) */
  secondary: '#A1A1AA',
  /** Hints, timestamps (L ~45%) */
  muted: '#71717A',
  /** Disabled elements (L ~32%) */
  disabled: '#52525B',
} as const;

// Border system for dark mode (UX_MASTERY §2)
// rgba auto-adapts to any dark surface
export const borders = {
  subtle: 'rgba(255, 255, 255, 0.06)',
  default: 'rgba(255, 255, 255, 0.10)',
  strong: 'rgba(255, 255, 255, 0.15)',
  hover: 'rgba(255, 255, 255, 0.20)',
} as const;
