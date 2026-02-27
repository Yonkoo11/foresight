# Emoji → Phosphor Icon Replacement — Concrete Code Examples

**Reference:** Complete, copy-paste-ready code for all emoji replacements.

---

## 1. InfluencerProfileCard.tsx — Complete Updated Component

### Current Code (BEFORE)
```typescript
function valueLabel(ptsPerDollar: number): { text: string; className: string } {
  if (ptsPerDollar >= 45) return { text: '💎 Elite value', className: 'text-amber-400' };
  if (ptsPerDollar >= 28) return { text: '⭐ Good value', className: 'text-emerald-400' };
  if (ptsPerDollar >= 15) return { text: '📊 Fair', className: 'text-gray-400' };
  return { text: '💸 Premium', className: 'text-gray-500' };
}

// In render (line 179-183):
{draftCount > 0 && (
  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-[10px] text-emerald-400 font-medium">
    🔥 {draftCount} drafted
  </span>
)}

// In render (line 206):
<span className={`text-[10px] font-medium ${val.className}`}>{val.text}</span>
```

### Updated Code (AFTER)
```typescript
// Step 1: Update imports (top of file, around line 6-15)
import {
  TwitterLogo,
  TrendUp,
  TrendDown,
  Users,
  Lightning,
  Binoculars,
  Check,
  Star,
  Diamond,      // ← NEW
  ChartBar,      // ← NEW
  CurrencyDollar, // ← NEW
  Fire,          // ← NEW
} from '@phosphor-icons/react';

// Step 2: Add new interface (after the Influencer interface, around line 32)
interface ValueLabel {
  icon: React.ElementType;
  iconWeight: 'regular' | 'bold' | 'fill' | 'duotone';
  label: string;
  className: string;
}

// Step 3: Replace valueLabel function (around line 93-98)
function valueLabel(ptsPerDollar: number): ValueLabel {
  if (ptsPerDollar >= 45) {
    return {
      icon: Diamond,
      iconWeight: 'fill',
      label: 'Elite value',
      className: 'text-amber-400',
    };
  }
  if (ptsPerDollar >= 28) {
    return {
      icon: Star,
      iconWeight: 'fill',
      label: 'Good value',
      className: 'text-emerald-400',
    };
  }
  if (ptsPerDollar >= 15) {
    return {
      icon: ChartBar,
      iconWeight: 'regular',
      label: 'Fair',
      className: 'text-gray-400',
    };
  }
  return {
    icon: CurrencyDollar,
    iconWeight: 'regular',
    label: 'Premium',
    className: 'text-gray-500',
  };
}

// Step 4: Update draft count badge in render (around line 179-183)
{draftCount > 0 && (
  <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 rounded text-[10px] text-emerald-400 font-medium">
    <Fire weight="fill" size={12} className="text-emerald-400 flex-shrink-0" />
    {draftCount} drafted
  </span>
)}

// Step 5: Update points bar value label in render (around line 206)
// OLD:
// <span className={`text-[10px] font-medium ${val.className}`}>{val.text}</span>

// NEW:
{(() => {
  const ValueIcon = val.icon;
  return (
    <div className="inline-flex items-center gap-1">
      <span className={`text-[10px] font-medium ${val.className}`}>
        {val.label}
      </span>
      <ValueIcon
        weight={val.iconWeight}
        size={12}
        className={val.className}
      />
    </div>
  );
})()}
```

---

## 2. types/achievements.ts — Complete Updated File

### Current Structure
```typescript
export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'unlockedAt' | 'progress'>> = {
  few_understand: {
    id: 'few_understand',
    name: 'few understand',
    description: 'drafted a perfect team',
    icon: '💎',
    rarity: 'legendary',
  },
  // ... rest
};
```

### Updated Structure
```typescript
// Step 1: Add imports at top
import {
  Diamond,
  HandFist,
  Fire,
  Rocket,
  Moon,
  Lightning,
  Star,
  Target,
  TrendUp,
  Whale,
  Eye,
} from '@phosphor-icons/react';

// Step 2: Update Achievement interface
export interface Achievement {
  id: AchievementId;
  name: string;
  description: string;
  icon: React.ElementType;           // ← CHANGED from string
  iconWeight?: 'fill' | 'bold';      // ← NEW
  rarity: AchievementRarity;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

// Step 3: Replace ACHIEVEMENTS constant
export const ACHIEVEMENTS: Record<AchievementId, Omit<Achievement, 'unlockedAt' | 'progress'>> = {
  few_understand: {
    id: 'few_understand',
    name: 'few understand',
    description: 'drafted a perfect team',
    icon: Diamond,
    iconWeight: 'fill',
    rarity: 'legendary',
  },
  diamond_hands: {
    id: 'diamond_hands',
    name: 'diamond hands',
    description: 'kept same team for 4 weeks',
    icon: HandFist,
    iconWeight: 'fill',
    rarity: 'epic',
  },
  gm_streak_7: {
    id: 'gm_streak_7',
    name: 'gm streak',
    description: '7 days in a row',
    icon: Fire,
    iconWeight: 'fill',
    rarity: 'common',
  },
  gm_streak_30: {
    id: 'gm_streak_30',
    name: 'gm legend',
    description: '30 days in a row',
    icon: Fire,
    iconWeight: 'fill',
    rarity: 'epic',
  },
  sent_it: {
    id: 'sent_it',
    name: 'sent it',
    description: 'all budget on S-tier players',
    icon: Rocket,
    iconWeight: 'fill',
    rarity: 'rare',
  },
  to_the_moon: {
    id: 'to_the_moon',
    name: 'to the moon',
    description: 'scored 200+ in a week',
    icon: Moon,
    iconWeight: 'fill',
    rarity: 'rare',
  },
  degen_mode: {
    id: 'degen_mode',
    name: 'degen mode',
    description: 'risky draft paid off',
    icon: Lightning,
    iconWeight: 'fill',
    rarity: 'rare',
  },
  perfect_week: {
    id: 'perfect_week',
    name: 'perfect week',
    description: 'all 5 picks scored 20+',
    icon: Star,
    iconWeight: 'fill',
    rarity: 'epic',
  },
  first_blood: {
    id: 'first_blood',
    name: 'first blood',
    description: 'won your first contest',
    icon: Target,
    iconWeight: 'fill',
    rarity: 'common',
  },
  comeback_kid: {
    id: 'comeback_kid',
    name: 'comeback kid',
    description: 'went from last to top 10',
    icon: TrendUp,
    iconWeight: 'regular',
    rarity: 'epic',
  },
  whale_watcher: {
    id: 'whale_watcher',
    name: 'whale watcher',
    description: 'reached whale rank',
    icon: Whale,
    iconWeight: 'fill',
    rarity: 'legendary',
  },
  the_chosen_one: {
    id: 'the_chosen_one',
    name: 'the chosen one',
    description: 'picked CT spotlight winner 3 weeks straight',
    icon: Eye,
    iconWeight: 'fill',
    rarity: 'legendary',
  },
};

// Step 4: Update getAchievementWithProgress function
export function getAchievementWithProgress(
  achievementId: AchievementId,
  userAchievements: UserAchievement[]
): Achievement {
  const base = ACHIEVEMENTS[achievementId];
  const userAch = userAchievements.find((a) => a.achievementId === achievementId);

  return {
    ...base,
    unlockedAt: userAch?.unlockedAt,
    progress: userAch?.progress !== undefined ? {
      current: userAch.progress,
      target: getAchievementTarget(achievementId),
    } : undefined,
  };
}
```

### Using Updated Achievements in Components

```typescript
// In any component that displays achievements:
import { Achievement } from '../../types/achievements';

function AchievementDisplay({ achievement }: { achievement: Achievement }) {
  const AchievementIcon = achievement.icon;

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
      <div className="p-2 rounded-lg bg-amber-500/20">
        <AchievementIcon
          weight={achievement.iconWeight || 'fill'}
          size={18}
          className="text-amber-400"
        />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-white text-sm">{achievement.name}</h4>
        <p className="text-xs text-gray-400">{achievement.description}</p>
      </div>
    </div>
  );
}
```

---

## 3. utils/xp.ts — Complete Updated Functions

### Current Code (BEFORE)
```typescript
export function getLevelBadge(level: string): string {
  const badges: Record<string, string> = {
    NOVICE: '🔰',
    APPRENTICE: '⚔️',
    SKILLED: '🛡️',
    EXPERT: '👑',
    MASTER: '💎',
    LEGENDARY: '🏆',
  };
  return badges[level] || '🔰';
}
```

### Updated Code (AFTER)
```typescript
// Step 1: Add imports at top
import {
  SmileyBlank,
  Sword,
  ShieldPlus,
  Crown,
  Diamond,
  Trophy,
} from '@phosphor-icons/react';

// Step 2: Update XPLevel interface
export interface XPLevel {
  level: string;
  minXP: number;
  maxXP: number;
  voteWeight: number;
  maxTransfers: number;
  perks: string[];
  iconComponent?: React.ElementType;  // ← NEW
  iconWeight?: 'fill' | 'bold';       // ← NEW
}

// Step 3: Update XP_LEVELS constant
export const XP_LEVELS: Record<string, XPLevel> = {
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
    level: 'APPRENTICE',
    minXP: 100,
    maxXP: 249,
    voteWeight: 1.1,
    maxTransfers: 2,
    perks: ['1.1x vote weight', '2 transfers/week', 'Profile badges'],
    iconComponent: Sword,
    iconWeight: 'fill',
  },
  SKILLED: {
    level: 'SKILLED',
    minXP: 250,
    maxXP: 499,
    voteWeight: 1.2,
    maxTransfers: 3,
    perks: ['1.2x vote weight', '3 transfers/week', 'Captain change', 'Custom colors'],
    iconComponent: ShieldPlus,
    iconWeight: 'fill',
  },
  EXPERT: {
    level: 'EXPERT',
    minXP: 500,
    maxXP: 999,
    voteWeight: 1.3,
    maxTransfers: 4,
    perks: ['1.3x vote weight', '4 transfers/week', 'Early lock bonus', 'Vote change'],
    iconComponent: Crown,
    iconWeight: 'fill',
  },
  MASTER: {
    level: 'MASTER',
    minXP: 1000,
    maxXP: 2499,
    voteWeight: 1.5,
    maxTransfers: 5,
    perks: ['1.5x vote weight', '5 transfers/week', 'Private leagues', 'Profile flair'],
    iconComponent: Diamond,
    iconWeight: 'fill',
  },
  LEGENDARY: {
    level: 'LEGENDARY',
    minXP: 2500,
    maxXP: Infinity,
    voteWeight: 2.0,
    maxTransfers: 999,
    perks: ['2x vote weight', 'Unlimited transfers', 'All perks', 'Whale badge'],
    iconComponent: Trophy,
    iconWeight: 'fill',
  },
};

// Step 4: Update getLevelBadge function (returns component instead of emoji)
export function getLevelIcon(level: string): React.ElementType | null {
  const levelData = XP_LEVELS[level];
  return levelData?.iconComponent || SmileyBlank;
}

export function getLevelIconWeight(level: string): 'fill' | 'bold' {
  return XP_LEVELS[level]?.iconWeight || 'fill';
}

// Step 5: Old getLevelBadge still works (for backwards compatibility), but marks as deprecated
/**
 * @deprecated Use getLevelIcon and getLevelIconWeight instead
 * Returns emoji badge (kept for backwards compatibility only)
 */
export function getLevelBadge(level: string): string {
  // This can be removed once all components are updated to use getLevelIcon
  const badges: Record<string, string> = {
    NOVICE: '🔰',
    APPRENTICE: '⚔️',
    SKILLED: '🛡️',
    EXPERT: '👑',
    MASTER: '💎',
    LEGENDARY: '🏆',
  };
  return badges[level] || '🔰';
}
```

### Using Updated XP Icons in Components

```typescript
// In any component displaying level badge:
import { getLevelIcon, getLevelIconWeight, getLevelColors, getXPLevel } from '../../utils/xp';

function LevelBadgeDisplay({ userXP }: { userXP: number }) {
  const levelData = getXPLevel(userXP);
  const LevelIcon = getLevelIcon(levelData.level);
  const colors = getLevelColors(levelData.level);

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${colors.gradient}`}>
      {LevelIcon && (
        <LevelIcon
          weight={getLevelIconWeight(levelData.level)}
          size={16}
          className={colors.text}
        />
      )}
      <span className={`font-semibold text-sm ${colors.text}`}>
        {levelData.level}
      </span>
    </div>
  );
}
```

---

## 4. PotentialWinningsModal.tsx — Performance Feedback Update

### Current Code (BEFORE)
```typescript
function getPerformanceMessage() {
  if (percentile <= 10) {
    return { emoji: '🏆', text: "Outstanding! You're a natural!", subtext: "Top 10% finish" };
  } else if (percentile <= 25) {
    return { emoji: '🔥', text: "Great performance!", subtext: "Top 25% finish" };
  } else if (percentile <= 40) {
    return { emoji: '⭐', text: "Solid showing!", subtext: "In the money range" };
  } else if (percentile <= 60) {
    return { emoji: '💪', text: "Good effort!", subtext: "Keep improving" };
  } else {
    return { emoji: '🎯', text: "Nice try!", subtext: "Practice makes perfect" };
  }
}

// In render:
<div className="text-5xl mb-3">{performance.emoji}</div>
```

### Updated Code (AFTER)
```typescript
// Step 1: Update imports (top of file)
import {
  X, Trophy, ArrowRight, Sparkle, Crown,
  Lightning, Play, Coins, Star, Fire, Confetti,
  HandFist, Target, // ← ADD THESE
} from '@phosphor-icons/react';

// Step 2: Update interface
interface PerformanceMessage {
  icon: React.ElementType;
  iconWeight: 'fill' | 'bold';
  text: string;
  subtext: string;
}

// Step 3: Update getPerformanceMessage function
function getPerformanceMessage(): PerformanceMessage {
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

// Step 4: Update render (around line 165-170)
<div className="text-center mb-6">
  <div className="mb-3 flex justify-center">
    {(() => {
      const PerformanceIcon = performance.icon;
      return (
        <PerformanceIcon
          weight={performance.iconWeight}
          size={56}
          className={wouldHaveWon ? 'text-yellow-400' : 'text-gray-400'}
        />
      );
    })()}
  </div>
  <h2 className="text-2xl font-bold text-white mb-1">{performance.text}</h2>
  <p className="text-gray-400">{performance.subtext}</p>
</div>
```

---

## 5. ContestDetail.tsx — Medal Display Update

### Current Code (BEFORE)
```typescript
{myEntry.rank === 1 ? '🥇' : myEntry.rank === 2 ? '🥈' : myEntry.rank === 3 ? '🥉' : '🏆'}
```

### Updated Code (AFTER)
```typescript
// Step 1: Add imports
import { Medal, Trophy, ... } from '@phosphor-icons/react';

// Step 2: Add helper function (near top of component, with other helpers)
function getMedalColor(rank: number | null | undefined): string {
  if (rank === 1) return 'text-yellow-400';   // Gold
  if (rank === 2) return 'text-gray-300';     // Silver
  if (rank === 3) return 'text-orange-600';   // Bronze
  return 'text-gray-400';                      // Default
}

// Step 3: Replace render code (where the emoji was)
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

## 6. Miscellaneous Files — Inline Emoji Replacements

### Referrals.tsx — Replace Inline Emojis

```typescript
// Step 1: Add imports
import { CurrencyDollar, TrendUp, Crown, ... } from '@phosphor-icons/react';

// Step 2: Replace emoji strings

// OLD (line ~57):
// `I'm Founding Member #${data.foundingMemberNumber} of @ForesightLeague! 👑\n\nJoin...`

// NEW:
`I'm Founding Member #${data.foundingMemberNumber} of @ForesightLeague! ✨\n\nJoin...`
// Note: Keep ✨ for now, or replace with inline icon if needed

// OLD (line ~91):
// "You're one of the first 1,000 users. This status will be valuable. 💰"

// NEW:
<div className="text-sm text-gray-400 mt-1">
  <span className="inline-flex items-center gap-1">
    You're one of the first 1,000 users. This status will be valuable.
    <CurrencyDollar weight="fill" size={14} className="text-amber-400" />
  </span>
</div>

// OLD (line ~120):
// "Building your position 📈"

// NEW:
<div className="flex items-center gap-1">
  <span>Building your position</span>
  <TrendUp weight="regular" size={14} className="text-emerald-400" />
</div>

// OLD (line ~140):
// "💰 Early supporters with engaged referrals will be rewarded"

// NEW:
<div className="text-sm text-gray-400 mt-1">
  <span className="inline-flex items-center gap-1">
    <CurrencyDollar weight="fill" size={14} className="text-amber-400" />
    Early supporters with engaged referrals will be rewarded
  </span>
</div>
```

### Draft.tsx — Replace "You're in! 🏆"

```typescript
// Step 1: Add import
import { Trophy, ... } from '@phosphor-icons/react';

// OLD (line ~290):
// <h2 className="text-2xl font-bold text-white mb-1">You're in! 🏆</h2>

// NEW:
<div className="flex items-center gap-2">
  <h2 className="text-2xl font-bold text-white">You're in!</h2>
  <Trophy weight="fill" size={28} className="text-yellow-400" />
</div>

// OLD (line ~293):
// <div className="text-4xl mb-3">🏆</div>

// NEW:
<div className="mb-3 flex justify-center">
  <Trophy weight="fill" size={64} className="text-yellow-400" />
</div>
```

### Intel.tsx — Replace "🏆{draftCount}"

```typescript
// Step 1: Add import
import { Medal, Trophy, ... } from '@phosphor-icons/react';

// OLD:
// 🏆{draftCount}

// NEW:
<span className="inline-flex items-center gap-1">
  <Medal weight="fill" size={12} className="text-yellow-400" />
  {draftCount}
</span>
```

---

## Testing Each Change

### Quick Test for InfluencerProfileCard
```bash
# Run in frontend dir
npm dev
# Navigate to /intel page, verify:
# - Value labels show icon + text
# - Draft count shows fire icon
# - All 4 value label types render
```

### Quick Test for Achievements
```bash
# Verify all 11 achievement icons render
# Check /profile → Achievements section
# Each should show icon (not emoji)
```

### Quick Test for XP Levels
```bash
# Verify all 6 level badges render
# Check any profile/user card showing level
# Icons should match level progression
```

### Quick Test for Performance Modal
```bash
npm dev
# Complete a Free League contest
# See modal appear with correct icon for your percentile
```

### Quick Test for Medals
```bash
# Navigate to /contest/[id] where you have an entry
# Check rank display
# 1st/2nd/3rd should show medal, others show trophy
```

---

## Validation Checklist

- [ ] All emojis replaced with icon components
- [ ] No `console.error` about missing components
- [ ] TypeScript compiles without errors
- [ ] Icons render in correct colors
- [ ] Icons are correct size (not too big/small)
- [ ] Before/after screenshots show improvement
- [ ] Mobile responsive (icons scale down)
- [ ] No broken imports
- [ ] All tests pass: `npm test`

