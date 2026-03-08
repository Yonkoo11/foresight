// 8px grid spacing scale (DESIGN_MASTERY + Schoger's constrained scale)
// Rules:
// - No two adjacent values closer than ~25% apart
// - Internal padding < external gap (Gestalt proximity)
// - All UI spacing should come from this scale

export const spacing = {
  /** 4px — icon gaps, tight padding */
  xs: 4,
  /** 8px — inline spacing, small gaps */
  sm: 8,
  /** 12px — tight component padding */
  md: 12,
  /** 16px — default component padding, root view margins */
  lg: 16,
  /** 24px — between related components, card padding */
  xl: 24,
  /** 32px — section padding, major element gaps */
  '2xl': 32,
  /** 48px — between sections */
  '3xl': 48,
  /** 64px — major section separation */
  '4xl': 64,
} as const;

/** Minimum touch target size (Apple HIG + Fitts's law) */
export const TOUCH_MIN = 44;

/** Root view side margins (Apple HIG) */
export const ROOT_MARGIN = 16;
