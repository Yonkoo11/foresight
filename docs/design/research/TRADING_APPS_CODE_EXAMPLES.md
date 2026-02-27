# Trading Apps Design Patterns: Copy-Paste Code Examples

These are production-ready code snippets extracted from trading app analysis. Copy-paste and modify as needed.

---

## 1. REAL-TIME SCORE FLASH ANIMATION

### CSS (add to `frontend/src/index.css`)

```css
/* Score update flash animation */
@keyframes scoreFlash {
  0% {
    background-color: rgba(245, 158, 11, 0.15);
  }
  50% {
    background-color: rgba(245, 158, 11, 0.1);
  }
  100% {
    background-color: transparent;
  }
}

@keyframes scoreFlashRed {
  0% {
    background-color: rgba(244, 63, 94, 0.15);
  }
  50% {
    background-color: rgba(244, 63, 94, 0.1);
  }
  100% {
    background-color: transparent;
  }
}

.animate-score-flash {
  animation: scoreFlash 200ms ease-out forwards;
}

.animate-score-flash-negative {
  animation: scoreFlashRed 200ms ease-out forwards;
}
```

### React Component (example)

```jsx
import { useState, useEffect } from 'react';

export function LeaderboardRow({ user, score, previousScore }) {
  const [isFlashing, setIsFlashing] = useState(false);
  const isPositive = score >= previousScore;

  useEffect(() => {
    if (score !== previousScore) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 200);
      return () => clearTimeout(timer);
    }
  }, [score, previousScore]);

  return (
    <tr
      className={`
        border-b border-gray-700/50
        ${isFlashing && (isPositive ? 'animate-score-flash' : 'animate-score-flash-negative')}
      `}
    >
      <td className="px-4 py-3 text-left">
        <span className="font-mono text-sm font-semibold text-gold-400">#1</span>
      </td>
      <td className="px-4 py-3 text-left">
        <span className="text-white font-semibold">{user.name}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm font-medium text-white">
          {score.toLocaleString()} pts
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <button className="text-gray-500 border-transparent hover:border-gray-700 hover:bg-gray-800 hover:text-gray-300 px-3 py-1 rounded-md transition-all">
          Follow
        </button>
      </td>
    </tr>
  );
}
```

---

## 2. GLOW EFFECTS FOR ACHIEVEMENTS

### CSS (add to `frontend/src/index.css`)

```css
/* Gold glow for primary achievements */
.glow-gold {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3),
              0 0 40px rgba(245, 158, 11, 0.1);
}

.glow-gold-subtle {
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
}

/* Cyan glow for secondary achievements */
.glow-cyan {
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.3),
              0 0 40px rgba(6, 182, 212, 0.1);
}

.glow-cyan-subtle {
  box-shadow: 0 0 12px rgba(6, 182, 212, 0.2);
}

/* Emerald glow for success */
.glow-emerald {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3),
              0 0 40px rgba(16, 185, 129, 0.1);
}

/* Pulsing glow (for "live" indicators) */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
  }
}

.glow-pulse-gold {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### React Component (Achievement Card)

```jsx
export function AchievementCard({ title, description, icon, rarity }) {
  const glowClass = {
    'S-tier': 'glow-gold',
    'A-tier': 'glow-cyan',
    'B-tier': 'glow-emerald',
  }[rarity] || '';

  return (
    <div
      className={`
        relative overflow-hidden
        bg-gray-800 border border-gray-700 rounded-lg p-4
        ${glowClass}
        transition-shadow duration-300
      `}
    >
      {/* Background glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <p className="text-gray-400 text-xs">{description}</p>
        </div>
      </div>

      {/* Tier badge */}
      <div className="absolute top-2 right-2 px-2 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded border border-gold-500/30">
        {rarity}
      </div>
    </div>
  );
}
```

---

## 3. MONOSPACE NUMBER FORMATTING

### Utility Function

```tsx
// utils/formatting.ts
export function formatScore(score: number): string {
  return score.toLocaleString('en-US');
}

export function formatChange(change: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toLocaleString('en-US')}`;
}

export function formatPercent(percent: number): string {
  const sign = percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}
```

### React Component (Stat Display)

```jsx
import { formatScore, formatChange, formatPercent } from '../utils/formatting';

export function StatDisplay({ label, value, change, changePercent }) {
  const isPositive = change >= 0;
  const changeColor = isPositive ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div className="space-y-1">
      {/* Label (regular font) */}
      <p className="text-gray-400 text-xs font-medium">{label}</p>

      {/* Main value (monospace, bold) */}
      <p className="font-mono text-lg font-semibold text-white">
        {formatScore(value)}
      </p>

      {/* Change indicator (monospace, colored) */}
      {change !== undefined && (
        <div className="flex gap-2">
          <span className={`font-mono text-sm font-medium ${changeColor}`}>
            {formatChange(change)}
          </span>
          <span className={`font-mono text-sm font-medium ${changeColor}`}>
            {formatPercent(changePercent)}
          </span>
        </div>
      )}
    </div>
  );
}
```

---

## 4. BUTTON HIERARCHY (4 VARIANTS)

### Tailwind Classes

```jsx
// Primary (solid gold) - use once per page/section
const buttonPrimary = `
  bg-gold-500 text-gray-950 px-4 py-2.5 rounded-md
  font-semibold text-sm
  hover:bg-gold-600 active:bg-gold-700
  transition-colors duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`;

// Secondary (outlined) - use for alternative actions
const buttonSecondary = `
  border border-gray-700 text-gray-300 px-4 py-2.5 rounded-md
  font-semibold text-sm
  hover:border-gray-600 hover:bg-gray-800
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`;

// Ghost (text only) - use for repeated actions on rows
const buttonGhost = `
  text-gray-500 border-transparent px-3 py-1.5 rounded-md
  text-sm font-medium
  hover:border-gray-700 hover:bg-gray-800 hover:text-gray-300
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`;

// Danger (red, hover-only) - destructive actions
const buttonDanger = `
  text-gray-500 border-transparent px-3 py-1.5 rounded-md
  text-sm font-medium
  hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-400
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`;
```

### React Button Component

```jsx
export function Button({
  variant = 'primary',
  disabled = false,
  children,
  ...props
}) {
  const variants = {
    primary: `
      bg-gold-500 text-gray-950 px-4 py-2.5 rounded-md font-semibold text-sm
      hover:bg-gold-600 active:bg-gold-700
      transition-colors duration-200 disabled:opacity-50
    `,
    secondary: `
      border border-gray-700 text-gray-300 px-4 py-2.5 rounded-md font-semibold text-sm
      hover:border-gray-600 hover:bg-gray-800
      transition-all duration-200 disabled:opacity-50
    `,
    ghost: `
      text-gray-500 border-transparent px-3 py-1.5 rounded-md text-sm font-medium
      hover:border-gray-700 hover:bg-gray-800 hover:text-gray-300
      transition-all duration-200 disabled:opacity-50
    `,
    danger: `
      text-gray-500 border-transparent px-3 py-1.5 rounded-md text-sm font-medium
      hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-400
      transition-all duration-200 disabled:opacity-50
    `,
  };

  return (
    <button
      className={`${variants[variant]} disabled:cursor-not-allowed`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## 5. LEADERBOARD ROW (COMPLETE EXAMPLE)

### Component

```jsx
import { formatScore } from '../utils/formatting';
import { Button } from './Button';

export function LeaderboardRow({
  rank,
  user,
  score,
  isFlashing,
  isFlashingNegative,
  onFollow,
}) {
  return (
    <tr
      className={`
        border-b border-gray-700/50 transition-colors
        ${isFlashing ? 'animate-score-flash' : ''}
        ${isFlashingNegative ? 'animate-score-flash-negative' : ''}
      `}
    >
      {/* Rank */}
      <td className="px-4 py-3 text-left w-12">
        <span
          className={`
            inline-flex items-center justify-center
            w-8 h-8 rounded-full text-xs font-mono font-bold
            ${
              rank === 1
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : rank === 2
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : rank === 3
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gray-700/50 text-gray-400'
            }
          `}
        >
          {rank}
        </span>
      </td>

      {/* User */}
      <td className="px-4 py-3 text-left">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-white font-semibold text-sm">{user.name}</p>
            <p className="text-gray-500 text-xs">@{user.handle}</p>
          </div>
        </div>
      </td>

      {/* Score (hero metric) */}
      <td className="px-4 py-3 text-right">
        <p className="font-mono text-lg font-semibold text-white">
          {formatScore(score)}
        </p>
        <p className="text-gray-500 text-xs font-mono">pts</p>
      </td>

      {/* Action (whisper) */}
      <td className="px-4 py-3 text-right">
        <Button
          variant="ghost"
          onClick={() => onFollow(user.id)}
        >
          Follow
        </Button>
      </td>
    </tr>
  );
}
```

---

## 6. CARD VARIANTS

### CSS Classes

```jsx
// Default card - used most
const cardDefault = `
  bg-gray-800 border border-gray-700 rounded-md p-4
`;

// Elevated card - more important
const cardElevated = `
  bg-gray-800 border border-gray-700 rounded-md p-4
  shadow-md
`;

// Highlighted card - premium/featured
const cardHighlighted = `
  bg-gray-800 border border-gold-500/30 rounded-md p-4
  shadow-gold
`;

// Interactive card - clickable
const cardInteractive = `
  bg-gray-800 border border-gray-700 rounded-md p-4
  hover:border-gray-600 hover:bg-gray-800/90
  cursor-pointer transition-all
`;
```

### React Card Component

```jsx
export function Card({
  variant = 'default',
  className = '',
  children,
}) {
  const variants = {
    default: 'bg-gray-800 border border-gray-700 rounded-md p-4',
    elevated: 'bg-gray-800 border border-gray-700 rounded-md p-4 shadow-md',
    highlighted: 'bg-gray-800 border border-gold-500/30 rounded-md p-4 glow-gold-subtle',
    interactive: 'bg-gray-800 border border-gray-700 rounded-md p-4 hover:border-gray-600 hover:bg-gray-800/90 cursor-pointer transition-all',
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
```

---

## 7. HOVER STATE REVEAL PATTERN

### Button Example

```jsx
export function FollowButton({ isFollowing, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-md text-sm font-medium
        transition-all duration-200
        border
        ${
          isFollowing
            ? // Following state
              'text-gray-500 border-transparent hover:border-rose-500/50 hover:bg-rose-500/20 hover:text-rose-400'
            : // Not following state
              'text-gray-500 border-transparent hover:border-cyan-500/50 hover:bg-cyan-500/20 hover:text-cyan-400'
        }
      `}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}
```

---

## 8. TOOLTIP WITH MONOSPACE DATA

### Component

```jsx
import { useState } from 'react';

export function TooltipWithData({ value, label, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-xs whitespace-nowrap shadow-lg z-50">
          <div className="text-gray-400">{label}</div>
          <div className="font-mono font-semibold text-white">{value}</div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-0.5">
            <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-gray-700" />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 9. TYPE SCALE QUICK REFERENCE

### CSS/Tailwind

```jsx
// Hero - use once per page
const heroText = 'text-5xl font-bold leading-tight';           // 48px

// Display - page title, major headings
const displayText = 'text-4xl font-semibold leading-snug';     // 36px

// Body-lg - lead paragraphs, intro text
const bodyLgText = 'text-lg font-normal leading-relaxed';      // 18px

// Body - default, most text
const bodyText = 'text-base font-normal leading-relaxed';      // 16px

// Body-sm - secondary text, labels
const bodySmText = 'text-sm font-normal leading-relaxed';      // 14px

// Caption - hints, metadata, small info
const captionText = 'text-xs font-normal leading-relaxed';     // 12px

// Monospace data (all sizes)
const monoData = 'font-mono';
```

---

## 10. REAL-TIME UPDATE HANDLER

### Service (polling example)

```tsx
// services/scoringService.ts
export async function subscribeToScoreUpdates(
  contestId: string,
  callback: (data: ScoreUpdate) => void
) {
  const pollInterval = setInterval(async () => {
    try {
      const response = await fetch(`/api/contests/${contestId}/scores`);
      const data = await response.json();

      if (data.updates && data.updates.length > 0) {
        data.updates.forEach((update) => {
          callback(update);
        });
      }
    } catch (error) {
      console.error('Score polling error:', error);
    }
  }, 30000); // Poll every 30 seconds

  return () => clearInterval(pollInterval);
}
```

### Component Using It

```jsx
import { useState, useEffect } from 'react';
import { subscribeToScoreUpdates } from '../services/scoringService';

export function LiveLeaderboard({ contestId }) {
  const [scores, setScores] = useState({});
  const [flashingRows, setFlashingRows] = useState({});

  useEffect(() => {
    const unsubscribe = subscribeToScoreUpdates(
      contestId,
      (update) => {
        setScores((prev) => ({
          ...prev,
          [update.userId]: update.newScore,
        }));

        // Trigger flash animation
        setFlashingRows((prev) => ({
          ...prev,
          [update.userId]: true,
        }));

        // Remove flash after 200ms
        setTimeout(() => {
          setFlashingRows((prev) => ({
            ...prev,
            [update.userId]: false,
          }));
        }, 200);
      }
    );

    return unsubscribe;
  }, [contestId]);

  return (
    <table className="w-full">
      <tbody>
        {/* Render rows with isFlashing state */}
      </tbody>
    </table>
  );
}
```

---

## 11. RESPONSIVE GRID (MOBILE-FIRST)

### Component

```jsx
export function ContestGrid({ contests }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contests.map((contest) => (
        <Card key={contest.id} variant="interactive">
          <h3 className="text-white font-semibold">{contest.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{contest.description}</p>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
            <span className="text-gold-400 font-mono text-sm">
              {contest.prize} ETH
            </span>
            <Button variant="primary" size="sm">
              Join
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### Breakpoints
```
Mobile:   col-span-1         (375px default)
Tablet:   sm:col-span-2      (640px+)
Desktop:  lg:col-span-3      (1024px+)
```

---

## 12. NOTIFICATION/TOAST PATTERN

### Component

```jsx
import { useState, useEffect } from 'react';

export function Toast({
  message,
  type = 'info',
  duration = 4000,
  onClose,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
    error: 'bg-rose-500/20 border-rose-500/30 text-rose-400',
    info: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
    warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 px-4 py-3 rounded-md border
        ${typeStyles[type]}
        animate-in fade-in slide-in-from-bottom-4 duration-300
        z-50
      `}
    >
      {message}
    </div>
  );
}
```

---

## TAILWIND CONFIG ADDITIONS

### tailwind.config.js

```js
module.exports = {
  theme: {
    extend: {
      animation: {
        'score-flash': 'scoreFlash 200ms ease-out forwards',
        'score-flash-negative': 'scoreFlashRed 200ms ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        scoreFlash: {
          '0%': { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
        scoreFlashRed: {
          '0%': { backgroundColor: 'rgba(244, 63, 94, 0.15)' },
          '100%': { backgroundColor: 'transparent' },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 12px rgba(245, 158, 11, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)',
          },
        },
      },
    },
  },
};
```

---

## USAGE CHECKLIST

Before shipping any component:

- [ ] Numbers are monospace (font-mono)
- [ ] Buttons follow 4-variant pattern
- [ ] Hover states don't use jarring colors
- [ ] Cards use proper variant (default/elevated/highlighted)
- [ ] Real-time updates have 150-200ms animation
- [ ] Gold glow used for achievements (not shadows)
- [ ] Mobile works at 375px (test in DevTools)
- [ ] Text meets WCAG AA contrast (4.5:1)
- [ ] All spacing uses 8px grid (2, 3, 4, 5, 6 Tailwind)
- [ ] Button padding is consistent (py-2.5, py-1.5 for small)

---

**Last updated:** February 27, 2026
**Source:** Trading app design research (Hyperliquid, Axiom, Photon, Birdeye, DexScreener)
