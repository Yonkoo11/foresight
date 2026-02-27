# DESIGN TOKENS V2: Foresight's Visual System

**Version:** 2.0
**Date:** February 27, 2026
**Status:** DEFINITIVE - Use for all Tailwind and CSS configuration
**Scope:** Colors, typography, spacing, shadows, animations, breakpoints

---

## COLOR PALETTE

### Background Colors (60% - Neutral Base)

```css
:root {
  /* Primary backgrounds */
  --bg-primary: #09090B;        /* Main page background (nearly black) */
  --bg-elevated: #111111;       /* Cards, surfaces, modals */
  --bg-hover: #1A1A1F;          /* Hover state on cards/buttons */
  --bg-elevated-2: #1F1F27;     /* Floating elements (rare) */

  /* Semantic backgrounds for input/forms */
  --bg-input: #0F0F14;          /* Input background (darker than card) */
  --bg-input-focus: #111111;    /* Input on focus (same as elevated) */
}
```

**Tailwind Classes:**
- `bg-gray-950` → #09090B (primary)
- `bg-gray-900` → #111111 (elevated)
- `bg-gray-925` → #1A1A1F (hover, custom)
- `bg-gray-900/50` → overlay/translucent elevated

### Text & Border Colors (30% - Secondary Accents)

```css
:root {
  /* Primary text (white) */
  --text-primary: #FAFAFA;      /* Body text, headings */

  /* Secondary text (label, meta, secondary) */
  --text-secondary: #A1A1AA;    /* Labels, secondary info, borders */

  /* Muted text (hints, disabled, very secondary) */
  --text-muted: #71717A;        /* Disabled, hints, tertiary text */

  /* Very muted (disabled, deemphasized) */
  --text-disabled: #52525B;     /* Disabled states */

  /* All borders are this gray (never bright) */
  --border-color: #27272A;      /* Card borders, dividers */
  --border-hover: #3F3F46;      /* Border on hover (slightly lighter) */
  --border-focus: #52525B;      /* Focus state border */
}
```

**Tailwind Classes:**
- `text-white` → #FAFAFA (primary text)
- `text-gray-400` → #A1A1AA (secondary text)
- `text-gray-500` → #71717A (muted text)
- `text-gray-600` → #52525B (disabled text)
- `border-gray-800` → #27272A (standard border)
- `border-gray-700` → #3F3F46 (hover border)
- `border-gray-600` → #52525B (focus border)

### Primary Accent Color (10% - Gold Only)

**This is the power color. Use sparingly. One per screen section.**

```css
:root {
  /* Gold - Primary CTA, achievements, highlights */
  --accent-primary: #F59E0B;    /* Gold base (CTAs, badges, highlights) */
  --accent-hover: #FBBF24;      /* Gold lighter (hover state) */
  --accent-muted: #D97706;      /* Gold darker (disabled, pressed state) */

  /* Optional: Gold with opacity for backgrounds */
  --accent-bg: rgba(245, 158, 11, 0.1);  /* 10% opacity, for badge backgrounds */
}
```

**Tailwind Classes:**
- `bg-amber-500` → #F59E0B (primary CTA)
- `bg-amber-400` → #FBBF24 (lighter variant)
- `bg-amber-600` → #D97706 (darker variant)
- `text-amber-400` → #FBBF24 (gold text)
- `border-amber-500/20` → gold border at 20% opacity
- `bg-amber-500/10` → gold background at 10% opacity

### Status & Semantic Colors (Use Only for Meaning)

```css
:root {
  /* Success (green - positive outcomes, active, online) */
  --success: #10B981;           /* Emerald */
  --success-light: #34D399;     /* Emerald lighter */

  /* Error (red - failures, critical, offline) */
  --error: #EF4444;             /* Red */
  --error-light: #FB7185;       /* Red lighter */

  /* Warning (amber - caution, attention) */
  --warning: #F59E0B;           /* Amber (same as gold) */
  --warning-light: #FBBF24;

  /* Pending (gray - neutral, in-progress) */
  --pending: #71717A;           /* Gray (NOT blue) */

  /* Secondary accent (cyan - rare use) */
  --secondary: #06B6D4;         /* Cyan - use only for A-tier badges or links */
  --secondary-light: #22D3EE;
}
```

**Tailwind Classes:**
- `bg-emerald-500` or `bg-green-500` → success
- `bg-red-500` → error
- `bg-yellow-500` or `bg-amber-500` → warning
- `bg-gray-500` → pending
- `bg-cyan-500` → secondary (rare)

### Complete Color Reference

| Color | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| **Backgrounds** | | | |
| Primary BG | #09090B | gray-950 | Page background |
| Elevated BG | #111111 | gray-900 | Cards, modals, surfaces |
| Hover BG | #1A1A1F | gray-925 | Card hover state |
| Input BG | #0F0F14 | gray-950 | Form inputs |
| **Text** | | | |
| Primary Text | #FAFAFA | white | Body, headings |
| Secondary Text | #A1A1AA | gray-400 | Labels, meta |
| Muted Text | #71717A | gray-500 | Disabled, hints |
| Disabled Text | #52525B | gray-600 | Disabled states |
| **Borders** | | | |
| Standard Border | #27272A | gray-800 | Card borders, dividers |
| Hover Border | #3F3F46 | gray-700 | Border on hover |
| Focus Border | #52525B | gray-600 | Focus state |
| **Accents** | | | |
| Gold Primary | #F59E0B | amber-500 | CTAs, highlights |
| Gold Hover | #FBBF24 | amber-400 | Gold hover state |
| Gold Muted | #D97706 | amber-600 | Gold disabled |
| Success | #10B981 | emerald-500 | Success, active |
| Error | #EF4444 | red-500 | Error, critical |
| Secondary | #06B6D4 | cyan-500 | A-tier badge, rare |

---

## TYPOGRAPHY

### Font Stack

```css
:root {
  /* Display: large, bold, eye-catching */
  --font-display: 'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif;

  /* Body: readable, friendly, default */
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;

  /* Mono: data, code, trustworthy numbers */
  --font-mono: 'JetBrains Mono', 'Courier New', monospace;
}
```

### Type Scale (6 Sizes Only)

| Name | Font | Size | Weight | Line Height | Use Case |
|------|------|------|--------|-------------|----------|
| **Display** | Plus Jakarta Sans | 32px | 700 | 1.2 | Page titles, KPI cards, hero stats |
| **H2** | Inter | 24px | 600 | 1.4 | Section headers, contest titles, major headlines |
| **H3** | Inter | 18px | 600 | 1.5 | Card titles, form labels, subheadings |
| **Body** | Inter | 16px | 400 | 1.6 | Paragraph text, leaderboard rows, primary body text |
| **Body-sm** | Inter | 14px | 400 | 1.5 | Secondary text, timestamps, descriptions |
| **Caption** | Inter | 12px | 500 | 1.4 | Metadata, hints, small labels, table headers |
| **Mono** | JetBrains Mono | 13px | 400 | 1.4 | Scores, wallet addresses, IDs, data (always use tabular-nums) |

### CSS Implementation

```css
/* Display */
.display {
  font-family: var(--font-display);
  font-size: 2rem;          /* 32px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

/* Heading 2 */
.h2 {
  font-family: var(--font-body);
  font-size: 1.5rem;        /* 24px */
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
}

/* Heading 3 */
.h3 {
  font-family: var(--font-body);
  font-size: 1.125rem;      /* 18px */
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-primary);
}

/* Body */
.body {
  font-family: var(--font-body);
  font-size: 1rem;          /* 16px */
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-primary);
}

/* Body Small */
.body-sm {
  font-family: var(--font-body);
  font-size: 0.875rem;      /* 14px */
  font-weight: 400;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* Caption */
.caption {
  font-family: var(--font-body);
  font-size: 0.75rem;       /* 12px */
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Monospace (Data) */
.mono {
  font-family: var(--font-mono);
  font-size: 0.8125rem;     /* 13px */
  font-weight: 400;
  line-height: 1.4;
  font-variant-numeric: tabular-nums;  /* Ensures alignment */
  color: var(--text-secondary);
}
```

### Tailwind Implementation

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    fontSize: {
      xs: ['12px', { lineHeight: '1.4' }],      // caption
      sm: ['14px', { lineHeight: '1.5' }],      // body-sm
      base: ['16px', { lineHeight: '1.6' }],    // body
      lg: ['18px', { lineHeight: '1.5' }],      // h3
      xl: ['24px', { lineHeight: '1.4' }],      // h2
      '2xl': ['32px', { lineHeight: '1.2' }],   // display
    },
    fontFamily: {
      display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontWeight: {
      400: '400',   // normal
      500: '500',   // medium
      600: '600',   // semibold
      700: '700',   // bold
    },
  },
};
```

### Font Weight Rules

- **700 (bold):** Display only
- **600 (semibold):** Headings (h1, h2, h3), form labels
- **500 (medium):** Data in monospace (scores, points), captions
- **400 (normal):** Body text, descriptions

---

## SPACING SCALE

**4px-based increments. Use exclusively.**

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;      /* Standard/default gap */
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### Spacing Usage Guidelines

| Size | Usage |
|------|-------|
| **4px (space-1)** | Tiny gaps (icon + label, tight spacing) |
| **8px (space-2)** | Small gaps (related elements, button internal) |
| **12px (space-3)** | Medium gaps (form input padding) |
| **16px (space-4)** | Standard gap (default card padding, list item vertical spacing) |
| **20px (space-5)** | Large gap (spacing between sections, between cards) |
| **24px (space-6)** | Extra-large (major section spacing, between distinct areas) |
| **32px (space-8)** | Huge (page margin, top-level sections) |

### Tailwind Spacing

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    spacing: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
    },
  },
};
```

---

## BORDER RADIUS

**Consistent roundness across all components.**

```css
:root {
  --radius-sm: 6px;       /* Buttons, small elements */
  --radius-md: 8px;       /* Cards, standard components */
  --radius-lg: 12px;      /* Modals, floating elements */
  --radius-full: 9999px;  /* Avatars, circles */
}
```

### Usage

| Radius | Component |
|--------|-----------|
| **6px** | Buttons, input fields, small UI elements |
| **8px** | Cards, containers, standard UI |
| **12px** | Modals, popovers, prominent floating elements |
| **9999px** | Avatars, circular badges, full circles |

### Tailwind Classes

- `rounded-sm` → 6px (buttons)
- `rounded-md` → 8px (cards, standard)
- `rounded-lg` → 12px (modals)
- `rounded-full` → 9999px (circles)

---

## SHADOWS & ELEVATION

**Use shadows for elevation, NOT for brightness or emphasis.**

```css
:root {
  /* Subtle elevation (cards at rest) */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.5);

  /* Raised elevation (cards on hover, popovers) */
  --shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.6);

  /* Strong elevation (dropdowns, important modals) */
  --shadow-lg: 0 20px 40px 0 rgba(0, 0, 0, 0.8);

  /* Very strong elevation (full-screen modals) */
  --shadow-xl: 0 40px 80px 0 rgba(0, 0, 0, 0.9);

  /* Glow for achievements, live indicators (gold) */
  --glow-gold: 0 0 20px rgba(245, 158, 11, 0.2);

  /* Glow for secondary elements (cyan, rare) */
  --glow-cyan: 0 0 20px rgba(6, 182, 212, 0.2);
}
```

### CSS Implementation

```css
.shadow-premium-sm {
  box-shadow: var(--shadow-sm);
}

.shadow-premium-md {
  box-shadow: var(--shadow-md);
}

.shadow-premium-lg {
  box-shadow: var(--shadow-lg);
}

.shadow-gold {
  box-shadow: var(--glow-gold);
}

.shadow-cyan {
  box-shadow: var(--glow-cyan);
}
```

### Usage Guidelines

| Shadow | When to Use |
|--------|------------|
| **sm** | Card at rest, default state |
| **md** | Card on hover, popover, dropdown |
| **lg** | Modal interior elements, important floating cards |
| **xl** | Full-screen modal backdrop |
| **glow-gold** | Achievement badges, S-tier indicators, live contests |
| **glow-cyan** | A-tier badges, active links (rare) |

---

## ANIMATIONS

### Timing Values

```css
:root {
  /* Duration */
  --duration-fast: 150ms;      /* Button hover, quick feedback */
  --duration-normal: 200ms;    /* State change, icon animation */
  --duration-slow: 300ms;      /* Page transition, modal appear */
  --duration-very-slow: 500ms; /* Only for significant transitions */

  /* Easing (Material Design standard) */
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);   /* Entry (snappy) */
  --ease-in: cubic-bezier(0.4, 0, 0.6, 1);    /* Exit */
  --ease-inout: cubic-bezier(0.4, 0, 0.2, 1); /* Hover/toggle */
}
```

### Animation Definitions

```css
/* Score flash (150ms, real-time leaderboard update) */
@keyframes scoreFlash {
  0% {
    background-color: rgba(245, 158, 11, 0.2);  /* Gold tint */
  }
  100% {
    background-color: transparent;
  }
}

.animate-score-flash {
  animation: scoreFlash 150ms ease-out forwards;
}

/* Glow pulse (for live indicators) */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
  }
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}

/* Fade in up (new content entering) */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 300ms ease-out forwards;
}

/* Slide up (modal appear) */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Spinner (continuous rotation) */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### Animation Usage Rules

| Duration | Use Case | Example |
|----------|----------|---------|
| **150ms** | Quick feedback | Button press, icon change, ghost button reveal |
| **200ms** | State transition | Checkbox toggle, form focus, hover state |
| **300ms** | Content entry | Modal appear, page fade-in, card slide-up |
| **500ms+** | Only page nav | Full page transition, major layout shift |

---

## BREAKPOINTS

**Mobile-first. Only 2 breakpoints: sm (640px) and beyond.**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'base': '0px',     /* Default (mobile, 375px) */
      'sm': '640px',     /* Tablet */
      'lg': '1024px',    /* Desktop */
    },
  },
};
```

### Mobile-First Design Order

1. **Design for 375px first** (iPhone SE baseline)
2. **Add `sm:` classes for 640px and up**
3. **Add `lg:` classes for 1024px and up**
4. **Never use `md:` or `xl:`** (keeps CSS lean)

### Example Responsive Pattern

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 column at 375px, 2 at 640px, 3 at 1024px */}
</div>
```

---

## COMPONENT SCALE

### Button Sizes

```css
/* Small button (icon, secondary actions) */
.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
  height: auto;
  min-height: 28px;  /* Rarely used */
}

/* Standard button (default) */
.btn {
  padding: 8px 16px;
  font-size: 14px;
  height: auto;
  min-height: 40px;  /* Desktop */
  min-height: 44px;  /* Mobile target */
}

/* Large button (primary CTAs) */
.btn-lg {
  padding: 12px 24px;
  font-size: 16px;
  height: auto;
  min-height: 44px;  /* Mobile target */
  min-height: 48px;  /* Desktop */
}
```

### Card Padding

```css
.card-sm { padding: 12px; }     /* Small cards, forms */
.card { padding: 16px; }        /* Standard cards */
.card-lg { padding: 20px; }     /* Large cards, modals */
.card-xl { padding: 24px; }     /* Huge cards, major containers */
```

### Badge/Chip Sizes

```css
.badge-sm { padding: 2px 6px; font-size: 11px; }
.badge { padding: 4px 8px; font-size: 12px; }
.badge-lg { padding: 6px 12px; font-size: 13px; }
```

---

## UTILITY TOKENS

### Opacity Scale

```css
:root {
  --opacity-disabled: 0.5;    /* Disabled state */
  --opacity-hover: 0.8;       /* Hover fade */
  --opacity-overlay: 0.5;     /* Overlay/backdrop */
  --opacity-border: 0.2;      /* Border color with accent (e.g., amber-500/20) */
  --opacity-background: 0.1;  /* Background tint (e.g., emerald-500/10) */
}
```

### Z-Index Scale

```css
:root {
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
  --z-tooltip: 1100;
}
```

---

## ACCESSIBILITY STANDARDS

### Contrast Requirements

- **Body text:** 4.5:1 contrast ratio (WCAG AA)
- **Large text (18px+):** 3:1 contrast ratio
- **Disabled text:** 3:1 contrast ratio minimum
- **Interactive elements:** 3:1 contrast ratio

### Touch Targets

- **Minimum height:** 44px
- **Minimum width:** 44px
- **Minimum gap between targets:** 8px
- **Never use hover-only states on mobile**

### Focus States

- **All interactive elements must have visible focus**
- **Default:** `outline: 2px solid amber-500/50` (gold ring)
- **Alternative:** `border: 1px solid amber-400` with outline

---

## SEMANTIC COLOR MAPPING

### Status Colors

```css
/* Live / Active / Online */
--badge-live: emerald-500;      /* #10B981 */
--text-live: emerald-400;       /* Light emerald for text */

/* Entered / In Progress */
--badge-entered: amber-500;     /* #F59E0B (gold) */
--text-entered: amber-400;

/* Completed / Done */
--badge-completed: gray-600;    /* #52525B */
--text-completed: gray-400;

/* Error / Critical */
--badge-error: red-500;         /* #EF4444 */
--text-error: red-400;

/* Pending / Neutral */
--badge-pending: gray-600;      /* #52525B (not blue) */
--text-pending: gray-400;
```

### Tier Colors

```css
/* S-Tier (Gold) */
--tier-s-bg: amber-500/10;       /* #F59E0B at 10% opacity */
--tier-s-text: amber-400;        /* #FBBF24 */
--tier-s-border: amber-500/20;   /* #F59E0B at 20% opacity */

/* A-Tier (Cyan) */
--tier-a-bg: cyan-500/10;        /* #06B6D4 at 10% opacity */
--tier-a-text: cyan-400;         /* #22D3EE */
--tier-a-border: cyan-500/20;

/* B-Tier (Emerald) */
--tier-b-bg: emerald-500/10;     /* #10B981 at 10% opacity */
--tier-b-text: emerald-400;      /* #34D399 */
--tier-b-border: emerald-500/20;

/* C-Tier (Gray) */
--tier-c-bg: gray-700/50;        /* #3F3F46 at 50% opacity */
--tier-c-text: gray-400;         /* #A1A1AA */
--tier-c-border: gray-700;
```

---

## TAILWIND CONFIG EXAMPLE

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#FAFAFA',
      black: '#000000',
      gray: {
        950: '#09090B',
        925: '#1A1A1F',
        900: '#111111',
        800: '#27272A',
        700: '#3F3F46',
        600: '#52525B',
        500: '#71717A',
        400: '#A1A1AA',
        300: '#D4D4D8',
      },
      amber: {
        400: '#FBBF24',
        500: '#F59E0B',
        600: '#D97706',
      },
      cyan: {
        400: '#22D3EE',
        500: '#06B6D4',
        600: '#0891B2',
      },
      emerald: {
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
      },
      red: {
        400: '#FB7185',
        500: '#EF4444',
        600: '#DC2626',
      },
    },
    spacing: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
    },
    fontSize: {
      xs: ['12px', { lineHeight: '1.4' }],
      sm: ['14px', { lineHeight: '1.5' }],
      base: ['16px', { lineHeight: '1.6' }],
      lg: ['18px', { lineHeight: '1.5' }],
      xl: ['24px', { lineHeight: '1.4' }],
      '2xl': ['32px', { lineHeight: '1.2' }],
    },
    fontFamily: {
      display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    borderRadius: {
      sm: '6px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    boxShadow: {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.5)',
      md: '0 4px 12px 0 rgba(0, 0, 0, 0.6)',
      lg: '0 20px 40px 0 rgba(0, 0, 0, 0.8)',
      gold: '0 0 20px rgba(245, 158, 11, 0.2)',
      cyan: '0 0 20px rgba(6, 182, 212, 0.2)',
    },
    screens: {
      base: '0px',
      sm: '640px',
      lg: '1024px',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

---

## CSS VARIABLES REFERENCE

**Add to `frontend/src/index.css`:**

```css
:root {
  /* Colors */
  --bg-primary: #09090B;
  --bg-elevated: #111111;
  --bg-hover: #1A1A1F;
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;
  --border-color: #27272A;
  --accent-primary: #F59E0B;
  --accent-hover: #FBBF24;
  --accent-muted: #D97706;
  --success: #10B981;
  --error: #EF4444;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 20px 40px 0 rgba(0, 0, 0, 0.8);
  --glow-gold: 0 0 20px rgba(245, 158, 11, 0.2);

  /* Typography */
  --font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Timing */
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --ease-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 0.6, 1);

  /* Z-Index */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 1000;
}
```

---

## CHECKLIST: DESIGN TOKEN COMPLIANCE

Before any UI work is merged:

- [ ] No colors used outside this palette
- [ ] All numbers are monospace (JetBrains Mono)
- [ ] All type uses 6 sizes (no orphaned sizes)
- [ ] All spacing uses 4px increments
- [ ] All shadows use defined scale
- [ ] All animations use defined timing
- [ ] All borders are gray (#27272A)
- [ ] Only 1 gold CTA per screen section
- [ ] All breakpoints use sm/lg (no md/xl)
- [ ] Contrast ratios meet WCAG AA (4.5:1)
- [ ] Focus states are visible (gold ring or border)
- [ ] Touch targets are 44px+ on mobile

---

**Version:** 2.0
**Last Updated:** February 27, 2026
**Status:** DEFINITIVE - Apply to all frontend code
**Ownership:** Design system (to be kept in sync with CREATIVE_BRIEF.md)
