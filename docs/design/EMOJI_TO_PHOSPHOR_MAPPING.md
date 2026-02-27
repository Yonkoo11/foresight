# Emoji → Phosphor Icons Mapping

**Status:** Complete mapping for all emojis in Foresight codebase
**Date:** February 25, 2026
**Reason:** Ensure consistent, pixel-perfect icons across all platforms (no OS emoji rendering differences)

---

## Why Replace Emojis?

1. **Consistency across OS/platforms** — Emojis render differently on Apple, Android, Windows, Linux
2. **Style coherence** — Phosphor icons match the dark theme + gold accent aesthetic
3. **CSS control** — Full color, size, weight control (emojis can't be styled)
4. **Professional appearance** — Avoids playful/casual emoji look in a "sharp" app

---

## Complete Emoji Mapping

### Value Labels (InfluencerProfileCard.tsx)

| Emoji | Context | Phosphor Icon | Weight | Size | Rationale |
|-------|---------|---|--------|------|-----------|
| 💎 | Elite value (45+ pts/$) | **Diamond** (preferred) or **Gem** | `fill` | `12px` | Conveys premium, rarity, elite tier visually; diamond shape is iconic |
| ⭐ | Good value (28+ pts/$) | **Star** | `fill` | `12px` | Already established in codebase; warm, achievable feel |
| 📊 | Fair value (15+ pts/$) | **ChartBar** | `regular` | `12px` | Professional chart icon, accurate representation of "fair" neutral status |
| 💸 | Premium (low value, expensive) | **CurrencyDollar** | `regular` | `12px` | Money/expensive concept; regular weight keeps it neutral/less alarming |

**Updated return type:**
```typescript
interface ValueLabel {
  icon: React.ElementType;           // Phosphor icon component
  iconWeight: 'regular' | 'bold' | 'fill' | 'duotone';
  label: string;                     // text without emoji: "Elite value"
  className: string;                 // color: "text-amber-400"
}
```

**Usage in component (lines 189-206):**
```tsx
// OLD
<span className={`text-[10px] font-medium mt-0.5 ${val.className}`}>
  {ptsPerDollar > 0 ? `${ptsPerDollar} pts/$` : 'price'}
</span>

// NEW
const ValueIcon = val.icon;
<div className="flex items-center gap-1">
  <span className={`text-[10px] font-medium mt-0.5 ${val.className}`}>
    {ptsPerDollar > 0 ? `${ptsPerDollar} pts/$` : 'price'}
  </span>
  <ValueIcon
    weight={val.iconWeight}
    size={12}
    className={val.className}
  />
</div>
```

---

### Draft Count / Popularity (InfluencerProfileCard.tsx, line 181)

| Emoji | Context | Phosphor Icon | Weight | Size | Rationale |
|-------|---------|---|--------|------|-----------|
| 🔥 | "{N} drafted" — popularity indicator | **Fire** | `fill` | `12px` | Already used throughout codebase for "trending" / "hot"; fire = demand |

**Current usage (lines 179-183):**
```tsx
// OLD
<span>🔥 {draftCount} drafted</span>

// NEW
<span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-[10px] text-emerald-400 font-medium">
  <Fire weight="fill" size={12} className="text-emerald-400" />
  {draftCount} drafted
</span>
```

---

### Achievements (types/achievements.ts)

| Emoji | Achievement ID | Achievement Name | Phosphor Icon | Weight | Size | Rationale |
|-------|--------|---|---|--------|------|-----------|
| 💎 | `few_understand` | "few understand" (perfect team) | **Diamond** | `fill` | `14px` | Elite rarity badge; diamond = legendary tier |
| 💪 | `diamond_hands` | "diamond hands" (4-week hold) | **HandFist** | `fill` | `14px` | Fist emoji = strength, resolve, determination |
| 🔥 | `gm_streak_7` | "gm streak" (7 days) | **Fire** | `fill` | `14px` | Fire = momentum, streak, on fire |
| 🔥 | `gm_streak_30` | "gm legend" (30 days) | **Fire** | `fill` | `14px` | Same fire, amplified by context ("legend") |
| 🚀 | `sent_it` | "sent it" (all S-tier) | **Rocket** | `fill` | `14px` | 🚀 to the moon = risk-taking, aggression |
| 🌙 | `to_the_moon` | "to the moon" (200+ score) | **Moon** | `fill` | `14px` | Direct correspondence; moon = aspirational |
| ⚡ | `degen_mode` | "degen mode" (risky play) | **Lightning** | `fill` | `14px` | Lightning = speed, risk, electricity, high-energy |
| ⭐ | `perfect_week` | "perfect week" (all 5 pick 20+) | **Star** | `fill` | `14px` | Star = excellence, perfection, achievement |
| 🎯 | `first_blood` | "first blood" (1st win) | **Target** | `fill` | `14px` | Target = hitting the mark, bullseye |
| 📈 | `comeback_kid` | "comeback kid" (last→top10) | **TrendUp** | `regular` | `14px` | Chart up = growth trajectory visually |
| 🐋 | `whale_watcher` | "whale watcher" (whale rank) | **Whale** | `fill` | `14px` | Literal whale icon = whale rank concept |
| 👁️ | `the_chosen_one` | "the chosen one" (CT spotlight) | **Eye** | `fill` | `14px` | Eye = seeing, watching, being seen/chosen |

**To update achievements.ts:**
```typescript
import {
  Diamond, HandFist, Fire, Rocket, Moon, Lightning, Star,
  Target, TrendUp, Whale, Eye
} from '@phosphor-icons/react';

interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: React.ElementType;      // Changed from string to component
  iconWeight: 'fill' | 'bold';   // Add weight property
  rarity: AchievementRarity;
  unlockedAt?: string;
  progress?: { current: number; target: number };
}

export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'unlockedAt' | 'progress'>> = {
  few_understand: {
    id: 'few_understand',
    name: 'few understand',
    description: 'drafted a perfect team',
    icon: Diamond,
    iconWeight: 'fill',
    rarity: 'legendary',
  },
  // ... etc
};

// Usage in components:
const AchievementIcon = achievement.icon;
<AchievementIcon weight={achievement.iconWeight} size={14} className="..." />
```

---

### XP Level Badges (utils/xp.ts, getLevelBadge function)

| Badge | Level | Current Emoji | Phosphor Icon | Weight | Size | Rationale |
|-------|-------|---|---|--------|------|-----------|
| 🔰 | NOVICE | 🔰 (Japanese symbol) | **SmileyBlank** or **CircleDashed** | `fill` | `16px` | NOVICE = beginner; blank circle = open/potential, just starting |
| ⚔️ | APPRENTICE | ⚔️ (swords) | **Sword** | `fill` | `16px` | Apprentice = training/learning; sword = tool of learning |
| 🛡️ | SKILLED | 🛡️ (shield) | **ShieldPlus** | `fill` | `16px` | Skilled = defense/protection; shield = recognized competence |
| 👑 | EXPERT | 👑 (crown) | **Crown** | `fill` | `16px` | Expert = authority; crown = dominance (already in codebase!) |
| 💎 | MASTER | 💎 (diamond) | **Diamond** | `fill` | `16px` | Master = rarity/excellence; diamond = premium tier |
| 🏆 | LEGENDARY | 🏆 (trophy) | **Trophy** | `fill` | `16px` | Legendary = victory; trophy = ultimate achievement (already in codebase!) |

**To update xp.ts, getLevelBadge function:**
```typescript
import {
  SmileyBlank, Sword, ShieldPlus, Crown, Diamond, Trophy
} from '@phosphor-icons/react';

interface XPLevel {
  level: string;
  minXP: number;
  maxXP: number;
  voteWeight: number;
  maxTransfers: number;
  perks: string[];
  iconComponent?: React.ElementType;  // Add this
  iconWeight?: 'fill' | 'bold';       // Add this
}

const XP_LEVELS: Record<string, XPLevel> = {
  NOVICE: {
    level: 'NOVICE',
    minXP: 0,
    maxXP: 99,
    voteWeight: 1.0,
    maxTransfers: 1,
    perks: ['Basic voting', '1 transfer/week'],
    iconComponent: SmileyBlank,
    iconWeight: 'fill',
  },
  APPRENTICE: {
    iconComponent: Sword,
    iconWeight: 'fill',
    // ... rest of props
  },
  SKILLED: {
    iconComponent: ShieldPlus,
    iconWeight: 'fill',
    // ... rest of props
  },
  EXPERT: {
    iconComponent: Crown,
    iconWeight: 'fill',
    // ... rest of props
  },
  MASTER: {
    iconComponent: Diamond,
    iconWeight: 'fill',
    // ... rest of props
  },
  LEGENDARY: {
    iconComponent: Trophy,
    iconWeight: 'fill',
    // ... rest of props
  },
};
```

---

### Performance Feedback (PotentialWinningsModal.tsx, lines 129-137)

| Emoji | Percentile | Phosphor Icon | Weight | Size | Rationale |
|-------|-------|---|--------|------|-----------|
| 🏆 | ≤10% (Outstanding) | **Trophy** | `fill` | `48px` | Victory/championship feeling; matches LEGENDARY badge |
| 🔥 | ≤25% (Great) | **Fire** | `fill` | `48px` | Hot streak, momentum; matches achievement system |
| ⭐ | ≤40% (Solid) | **Star** | `fill` | `48px` | Achievement, solid performance; matches perfect_week |
| 💪 | ≤60% (Good effort) | **HandFist** | `fill` | `48px` | Strength, effort; encouragement signal |
| 🎯 | >60% (Nice try) | **Target** | `fill` | `48px` | Keep aiming; matches first_blood achievement |

**To update PotentialWinningsModal.tsx:**
```typescript
import {
  Trophy, Fire, Star, HandFist, Target, X, ArrowRight,
  Sparkle, Crown, Lightning, Play, Coins, Confetti
} from '@phosphor-icons/react';

interface PerformanceMessage {
  icon: React.ElementType;
  iconWeight: 'fill' | 'bold';
  text: string;
  subtext: string;
}

function getPerformanceMessage(percentile: number): PerformanceMessage {
  if (percentile <= 10) {
    return {
      icon: Trophy,
      iconWeight: 'fill',
      text: "Outstanding! You're a natural!",
      subtext: "Top 10% finish",
    };
  } else if (percentile <= 25) {
    return {
      icon: Fire,
      iconWeight: 'fill',
      text: "Great performance!",
      subtext: "Top 25% finish",
    };
  } else if (percentile <= 40) {
    return {
      icon: Star,
      iconWeight: 'fill',
      text: "Solid showing!",
      subtext: "In the money range",
    };
  } else if (percentile <= 60) {
    return {
      icon: HandFist,
      iconWeight: 'fill',
      text: "Good effort!",
      subtext: "Keep improving",
    };
  } else {
    return {
      icon: Target,
      iconWeight: 'fill',
      text: "Nice try!",
      subtext: "Practice makes perfect",
    };
  }
}

// In render (line 167):
const PerformanceIcon = performance.icon;
<div className="text-5xl mb-3 text-center">
  <PerformanceIcon
    weight={performance.iconWeight}
    size={48}
    className={wouldHaveWon ? 'text-yellow-400' : 'text-gray-400'}
  />
</div>
```

---

### Contest Results (ContestDetail.tsx, line 230 - medal emojis)

| Emoji | Rank | Phosphor Icon | Weight | Size | Rationale |
|-------|------|---|--------|------|-----------|
| 🥇 | 1st place | **Medal** (or create color variant) | `fill` | `24px` | Gold medal = 1st; Phosphor has "Medal" icon |
| 🥈 | 2nd place | **Medal** (with gray styling) | `fill` | `24px` | Silver medal = 2nd; same icon, different color |
| 🥉 | 3rd place | **Medal** (with bronze/orange styling) | `fill` | `24px` | Bronze medal = 3rd; same icon, different color |
| 🏆 | Other ranks | **Trophy** | `fill` | `24px` | General trophy for non-podium finishes |

**To update ContestDetail.tsx (lines 230-231):**
```typescript
import { Medal, Trophy, ... } from '@phosphor-icons/react';

// Determine medal color based on rank
function getMedalColor(rank: number): string {
  if (rank === 1) return 'text-yellow-400';   // Gold
  if (rank === 2) return 'text-gray-300';     // Silver
  if (rank === 3) return 'text-orange-600';   // Bronze
  return 'text-gray-400';                      // Default gray
}

// In render:
{myEntry.rank >= 1 && myEntry.rank <= 3 ? (
  <Medal
    weight="fill"
    size={24}
    className={getMedalColor(myEntry.rank)}
  />
) : (
  <Trophy weight="fill" size={24} className="text-gray-400" />
)}
```

---

### Additional UI Elements (Other files)

| Emoji | File/Context | Phosphor Icon | Weight | Size | Notes |
|-------|-------|---|--------|------|-----------|
| 💰 | Referrals.tsx (rewards) | **CurrencyDollar** or **Coin** | `fill` | `14px` | Money concept; consistent with prize displays |
| 📈 | Referrals.tsx ("Building position") | **TrendUp** | `regular` | `14px` | Already used in codebase for trends |
| 🥇 | Intel.tsx ("{draftCount}") | **Medal** | `fill` | `12px` | Popular/drafted indicator; medal = achievement |

---

## Implementation Checklist

### Phase 1: Value Labels & Draft Count (InfluencerProfileCard.tsx)
- [ ] Import: `Diamond, Star, ChartBar, CurrencyDollar, Fire`
- [ ] Update `valueLabel()` return type to include icon component
- [ ] Update render logic (lines 189-206) to display icon next to label
- [ ] Test all 4 value label states
- [ ] Screenshot comparison before/after

### Phase 2: Achievements (types/achievements.ts + AchievementBadge.tsx)
- [ ] Import: `Diamond, HandFist, Fire, Rocket, Moon, Lightning, Star, Target, TrendUp, Whale, Eye`
- [ ] Update Achievement interface to include icon component + iconWeight
- [ ] Update ACHIEVEMENTS constant with icon mapping
- [ ] Update AchievementBadge.tsx render logic to use icon components
- [ ] Test all 11 achievement display states
- [ ] Screenshot comparison

### Phase 3: XP Level Badges (utils/xp.ts + any component using getLevelBadge)
- [ ] Import: `SmileyBlank, Sword, ShieldPlus, Crown, Diamond, Trophy`
- [ ] Update XPLevel interface to include iconComponent + iconWeight
- [ ] Update XP_LEVELS constant
- [ ] Find all components using getLevelBadge and update to render icon
- [ ] Test all 6 level badge states
- [ ] Screenshot comparison

### Phase 4: Performance Feedback (PotentialWinningsModal.tsx)
- [ ] Import: `Trophy, Fire, Star, HandFist, Target`
- [ ] Update getPerformanceMessage() to return icon component
- [ ] Update render logic (line 167) to display icon
- [ ] Test all 5 performance feedback states
- [ ] Screenshot comparison

### Phase 5: Contest Results (ContestDetail.tsx)
- [ ] Import: `Medal, Trophy`
- [ ] Add helper function `getMedalColor(rank)`
- [ ] Update render logic (lines 230-231) to use Medal/Trophy icons with color
- [ ] Test 1st, 2nd, 3rd, and non-podium rank displays
- [ ] Screenshot comparison

### Phase 6: Miscellaneous (Referrals.tsx, Intel.tsx, etc.)
- [ ] Search for remaining emoji usage: `💰`, `📈`, direct in JSX
- [ ] Replace with appropriate icons
- [ ] Test and screenshot

---

## Icon Import Locations

**Core icons to import (use exact names from @phosphor-icons/react):**

```typescript
// Value labels
import { Diamond, Star, ChartBar, CurrencyDollar, Fire } from '@phosphor-icons/react';

// Achievements
import {
  Diamond, HandFist, Fire, Rocket, Moon, Lightning, Star,
  Target, TrendUp, Whale, Eye
} from '@phosphor-icons/react';

// XP levels
import { SmileyBlank, Sword, ShieldPlus, Crown, Diamond, Trophy } from '@phosphor-icons/react';

// Performance feedback
import { Trophy, Fire, Star, HandFist, Target } from '@phosphor-icons/react';

// Contest results
import { Medal, Trophy } from '@phosphor-icons/react';
```

**Note:** Some icons appear in multiple places (e.g., Diamond, Fire, Star, Trophy). Consolidate imports at file level to avoid duplication.

---

## Design System Alignment

All icon choices align with existing Phosphor icon usage in the codebase:
- **Fire** — Already used for "trending" (MetricsChart.tsx, InfluencerDetailModal.tsx)
- **Star** — Already used for tier ratings (InfluencerProfileCard.tsx line 199)
- **Crown** — Already used for Captain indication (draft/FormationTeam.tsx)
- **Trophy** — Already used for contest/achievement displays (PotentialWinningsModal.tsx)
- **TrendUp** — Already used for trend indicators throughout

This maintains visual consistency while upgrading emoji placeholders to intentional icon choices.

---

## Testing Strategy

For each phase:
1. **Before screenshot:** `./node_modules/.bin/tsx scripts/screenshot.ts [page] --full`
2. **Make changes** (update .tsx files with icon components)
3. **After screenshot:** `./node_modules/.bin/tsx scripts/screenshot.ts [page] --full`
4. **Compare:** Verify icons render properly, colors are correct, alignment is clean
5. **Edge cases:** Test with no data, max values, error states

---

## Notes

- All icons use Phosphor Icons library v2.1.10 (already in dependencies)
- Weight preference: `fill` for achievement/badge icons (more visual impact); `regular` for data representations (ChartBar, TrendUp)
- Sizes: 12px for small inline labels, 14px for achievements, 16px for level badges, 24-48px for large displays
- Colors: Inherit from existing color classes (text-amber-400, text-emerald-400, etc.)
- No need for custom SVG modifications — Phosphor's built-in icons perfectly suit the use cases
