import { TextStyle } from 'react-native';

// Typography scale based on UX_MASTERY consensus (Linear, Raycast, Vercel)
// Rules applied:
// - Body >= 16px on mobile (iOS auto-zooms inputs below 16px)
// - Dark mode font weights bumped one step (400→500)
// - Negative letter-spacing on display/h1 (prevents airy appearance)
// - Tabular nums for all numeric displays
// - ALL CAPS letter-spacing widened (+0.05em equivalent)
// - Max 4-5 sizes per screen
// - Line height tightens as size increases

export const typography = {
  /** 40px — hero numbers, splash text */
  display: {
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 44,
    letterSpacing: -0.5,
  } as TextStyle,

  /** 24px — screen titles, major section headers */
  h1: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    letterSpacing: -0.3,
  } as TextStyle,

  /** 18px — card titles, subsection headers */
  h2: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.2,
  } as TextStyle,

  /** 16px — primary readable text */
  body: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0,
  } as TextStyle,

  /** 14px — secondary text, descriptions */
  bodySm: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0,
  } as TextStyle,

  /** 12px uppercase — form labels, stat labels, section tags */
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,

  /** 12px — metadata, timestamps, tertiary info */
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0,
  } as TextStyle,

  /** 14px tabular — stats, scores, numbers, prices */
  mono: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  } as TextStyle,

  /** 32px tabular — hero score numbers */
  monoLg: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  } as TextStyle,
} as const;
