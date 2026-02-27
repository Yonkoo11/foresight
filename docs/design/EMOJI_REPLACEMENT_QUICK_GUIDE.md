# Emoji → Phosphor Icon Replacement — Quick Guide

**TL;DR:** Replace all emojis with Phosphor icons for pixel-perfect rendering across platforms.

---

## At a Glance

| Where | Old | New | Icon Name | File(s) |
|-------|-----|-----|-----------|---------|
| **Value labels** | 💎 ⭐ 📊 💸 | Icons | Diamond, Star, ChartBar, CurrencyDollar | `InfluencerProfileCard.tsx` |
| **Draft count** | 🔥 | Icon | Fire | `InfluencerProfileCard.tsx` |
| **Achievements** | 11 emojis | Icons | See table below | `types/achievements.ts` |
| **XP badges** | 6 emojis | Icons | SmileyBlank, Sword, ShieldPlus, Crown, Diamond, Trophy | `utils/xp.ts` |
| **Performance** | 5 emojis | Icons | Trophy, Fire, Star, HandFist, Target | `PotentialWinningsModal.tsx` |
| **Medals** | 🥇🥈🥉🏆 | Icons | Medal, Trophy | `ContestDetail.tsx` |

---

## Achievement Icon Quick Lookup

```
💎 few_understand     → Diamond (fill)
💪 diamond_hands      → HandFist (fill)
🔥 gm_streak_7        → Fire (fill)
🔥 gm_streak_30       → Fire (fill)
🚀 sent_it            → Rocket (fill)
🌙 to_the_moon        → Moon (fill)
⚡ degen_mode         → Lightning (fill)
⭐ perfect_week       → Star (fill)
🎯 first_blood        → Target (fill)
📈 comeback_kid       → TrendUp (regular)
🐋 whale_watcher      → Whale (fill)
👁️ the_chosen_one    → Eye (fill)
```

---

## How to Implement (Copy-Paste Templates)

### Template 1: Value Label (InfluencerProfileCard.tsx)

```typescript
// Step 1: Update imports
import {
  TwitterLogo, TrendUp, TrendDown, Users, Lightning, Binoculars, Check, Star,
  Diamond, ChartBar, CurrencyDollar, Fire // ← ADD THESE
} from '@phosphor-icons/react';

// Step 2: Update valueLabel function return type
interface ValueLabel {
  icon: React.ElementType;
  iconWeight: 'regular' | 'bold' | 'fill' | 'duotone';
  label: string;
  className: string;
}

// Step 3: Update valueLabel function
function valueLabel(ptsPerDollar: number): ValueLabel {
  if (ptsPerDollar >= 45) {
    return {
      icon: Diamond,
      iconWeight: 'fill',
      label: 'Elite value',
      className: 'text-amber-400'
    };
  }
  if (ptsPerDollar >= 28) {
    return {
      icon: Star,
      iconWeight: 'fill',
      label: 'Good value',
      className: 'text-emerald-400'
    };
  }
  if (ptsPerDollar >= 15) {
    return {
      icon: ChartBar,
      iconWeight: 'regular',
      label: 'Fair',
      className: 'text-gray-400'
    };
  }
  return {
    icon: CurrencyDollar,
    iconWeight: 'regular',
    label: 'Premium',
    className: 'text-gray-500'
  };
}

// Step 4: Update render (around line 206)
// OLD:
// <span className={`text-[10px] font-medium mt-0.5 ${val.className}`}>
//   {val.text}
// </span>

// NEW:
const ValueIcon = val.icon;
<div className="flex items-center gap-1.5 ml-1">
  <span className={`text-[10px] font-medium ${val.className}`}>
    {val.label}
  </span>
  <ValueIcon
    weight={val.iconWeight}
    size={12}
    className={val.className}
  />
</div>
```

### Template 2: Draft Count Badge (InfluencerProfileCard.tsx, line 179-183)

```typescript
// In imports: Fire (already added above)

// In render:
// OLD:
// <span>🔥 {draftCount} drafted</span>

// NEW:
{draftCount > 0 && (
  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-[10px] text-emerald-400 font-medium">
    <Fire weight="fill" size={12} className="text-emerald-400 flex-shrink-0" />
    {draftCount} drafted
  </span>
)}
```

### Template 3: Achievement Icon (AchievementBadge.tsx or similar)

```typescript
// In component that renders achievement:
const AchievementIcon = achievement.icon; // Assuming icon is now React.ElementType

<div className="flex items-center gap-2">
  <div className={`p-2 rounded-lg ${getBgColor(achievement.rarity)}`}>
    <AchievementIcon
      weight={achievement.iconWeight || 'fill'}
      size={18}
      className={getIconColor(achievement.rarity)}
    />
  </div>
  <div>
    <p className="font-semibold">{achievement.name}</p>
    <p className="text-xs text-gray-400">{achievement.description}</p>
  </div>
</div>
```

### Template 4: XP Level Badge (any component using getLevelBadge)

```typescript
// In component that displays XP level badge:
const levelData = getXPLevel(userXP);
const LevelIcon = levelData.levelInfo.iconComponent;

<div className="flex items-center gap-2">
  {LevelIcon && (
    <LevelIcon
      weight={levelData.levelInfo.iconWeight || 'fill'}
      size={16}
      className={getLevelColors(levelData.level).text}
    />
  )}
  <span className={getLevelColors(levelData.level).text}>
    {levelData.level}
  </span>
</div>
```

### Template 5: Performance Feedback (PotentialWinningsModal.tsx, line 167)

```typescript
// In imports at top:
import { Trophy, Fire, Star, HandFist, Target, ... } from '@phosphor-icons/react';

// Update getPerformanceMessage return type:
interface PerformanceMessage {
  icon: React.ElementType;
  iconWeight: 'fill' | 'bold';
  text: string;
  subtext: string;
}

// Update function:
function getPerformanceMessage(percentile: number): PerformanceMessage {
  if (percentile <= 10) {
    return {
      icon: Trophy,
      iconWeight: 'fill',
      text: "Outstanding! You're a natural!",
      subtext: "Top 10% finish"
    };
  }
  if (percentile <= 25) {
    return {
      icon: Fire,
      iconWeight: 'fill',
      text: "Great performance!",
      subtext: "Top 25% finish"
    };
  }
  if (percentile <= 40) {
    return {
      icon: Star,
      iconWeight: 'fill',
      text: "Solid showing!",
      subtext: "In the money range"
    };
  }
  if (percentile <= 60) {
    return {
      icon: HandFist,
      iconWeight: 'fill',
      text: "Good effort!",
      subtext: "Keep improving"
    };
  }
  return {
    icon: Target,
    iconWeight: 'fill',
    text: "Nice try!",
    subtext: "Practice makes perfect"
  };
}

// In render (line 167, replace emoji with):
const PerformanceIcon = performance.icon;
<div className="text-center mb-6">
  <div className="mb-3 flex justify-center">
    <PerformanceIcon
      weight={performance.iconWeight}
      size={56}
      className={wouldHaveWon ? 'text-yellow-400' : 'text-gray-400'}
    />
  </div>
  <h2 className="text-2xl font-bold text-white mb-1">{performance.text}</h2>
  <p className="text-gray-400">{performance.subtext}</p>
</div>
```

### Template 6: Medal/Trophy (ContestDetail.tsx, line 230)

```typescript
// In imports:
import { Medal, Trophy, ... } from '@phosphor-icons/react';

// Add helper:
function getMedalColor(rank: number | null): string {
  if (rank === 1) return 'text-yellow-400';   // Gold
  if (rank === 2) return 'text-gray-300';     // Silver
  if (rank === 3) return 'text-orange-600';   // Bronze
  return 'text-gray-400';
}

// In render:
// OLD:
// {myEntry.rank === 1 ? '🥇' : myEntry.rank === 2 ? '🥈' : myEntry.rank === 3 ? '🥉' : '🏆'}

// NEW:
{myEntry.rank && myEntry.rank >= 1 && myEntry.rank <= 3 ? (
  <Medal
    weight="fill"
    size={28}
    className={getMedalColor(myEntry.rank)}
  />
) : (
  <Trophy
    weight="fill"
    size={28}
    className="text-gray-400"
  />
)}
```

---

## Files to Modify (Priority Order)

1. **`frontend/src/components/intel/InfluencerProfileCard.tsx`**
   - Changes: valueLabel function + draft count badge
   - Estimated time: 10 min
   - Icons: Diamond, Star, ChartBar, CurrencyDollar, Fire

2. **`frontend/src/types/achievements.ts`**
   - Changes: Achievement interface + ACHIEVEMENTS constant
   - Estimated time: 15 min
   - Icons: 11 icons (see lookup table)

3. **`frontend/src/utils/xp.ts`**
   - Changes: XPLevel interface + XP_LEVELS constant
   - Estimated time: 10 min
   - Icons: SmileyBlank, Sword, ShieldPlus, Crown, Diamond, Trophy

4. **`frontend/src/components/onboarding/PotentialWinningsModal.tsx`**
   - Changes: getPerformanceMessage function + render
   - Estimated time: 10 min
   - Icons: Trophy, Fire, Star, HandFist, Target

5. **`frontend/src/pages/ContestDetail.tsx`**
   - Changes: Rank display logic + medal color helper
   - Estimated time: 10 min
   - Icons: Medal, Trophy

6. **`frontend/src/pages/Referrals.tsx`** (miscellaneous)
   - Changes: Replace inline emojis (💰, 📈, 👑) in strings
   - Estimated time: 5 min
   - Icons: CurrencyDollar, TrendUp, Crown

7. **`frontend/src/pages/Intel.tsx`** (miscellaneous)
   - Changes: Replace 🏆 in draftCount display
   - Estimated time: 5 min
   - Icons: Medal or Trophy

8. **Any component using AchievementBadge**
   - Changes: Update to render icon component instead of emoji string
   - Estimated time: 5-10 min per component

**Total estimated time: ~70 minutes for all phases**

---

## Testing Checklist

For each file modified:
- [ ] All emojis replaced with icon components
- [ ] Icons render correctly (visible, right color, right size)
- [ ] No TypeScript errors
- [ ] No runtime errors in console
- [ ] Before/after screenshots match (same visual hierarchy, better clarity)
- [ ] Hover states work (if applicable)
- [ ] Mobile responsive (icons scale appropriately)

---

## Common Mistakes to Avoid

1. ❌ **Forgetting to import the icon component** → `ReferenceError: Diamond is not defined`
   - Fix: Add to imports at file top

2. ❌ **Using emoji in string alongside icon** → Duplicate visual
   - Fix: Remove emoji from `label` or `text` fields once you add the icon component

3. ❌ **Wrong icon weight** → Icon looks too bold or too thin
   - Fix: Use `fill` for achievement badges, `regular` for data charts

4. ❌ **Icon too large/small** → Looks out of place
   - Fix: Use consistent sizes: 12px (inline), 14px (small badges), 16px (level), 24-48px (large displays)

5. ❌ **Icon color wrong** → Doesn't match the theme
   - Fix: Inherit from existing color classes (text-amber-400, text-emerald-400, etc.)

6. ❌ **Not updating TypeScript interfaces** → Props mismatch errors
   - Fix: Update Achievement, XPLevel, PerformanceMessage types first

---

## Before You Start

1. Read the full mapping doc: `/docs/design/EMOJI_TO_PHOSPHOR_MAPPING.md`
2. Verify Phosphor Icons are installed: `npm list @phosphor-icons/react`
3. Run the app locally to confirm no breaking changes: `npm dev` (frontend)
4. Take baseline screenshot: `./node_modules/.bin/tsx scripts/screenshot.ts [page] --full`

---

## After You Finish

1. Take final screenshot: `./node_modules/.bin/tsx scripts/screenshot.ts [page] --full`
2. Compare before/after for visual consistency
3. Test on mobile (375px viewport) if UI changes
4. Run tests: `npm test`
5. Commit with clear message: `refactor: replace emojis with Phosphor icons for cross-platform consistency`

