# Emoji → Phosphor Icon Replacement — Visual Reference

**Quick visual guide for understanding the emoji-to-icon mappings.**

---

## Value Labels (InfluencerProfileCard.tsx)

### How Value Labels Work

```
Points per Dollar → Label + Icon + Color
─────────────────────────────────────────

45+  → "Elite value"  → 💎 (Diamond,        fill, amber-400)
28+  → "Good value"   → ⭐ (Star,           fill, emerald-400)
15+  → "Fair"         → 📊 (ChartBar,       regular, gray-400)
0+   → "Premium"      → 💸 (CurrencyDollar, regular, gray-500)
```

### Visual Evolution

**BEFORE:** Emoji feels playful, inconsistent rendering across devices
```
┌─────────────────────────────┐
│ $25          💎 Elite value │
│ (Points bar) 📊 Fair        │
│              ⭐ Good value   │
│              💸 Premium      │
└─────────────────────────────┘
```

**AFTER:** Crisp icon, clean typography, consistent everywhere
```
┌──────────────────────────────┐
│ $25            Elite value 💎│
│ (Points bar) Fair 📊         │
│ Good value ⭐                │
│ Premium 💸                   │
└──────────────────────────────┘
```

---

## Achievement Icons (12 total)

### Tier System

```
LEGENDARY (4 badges):  💎 ⭐ 🏆 👁️
├─ few_understand   → Diamond (elite rarity)
├─ perfect_week     → Star (excellence)
├─ whale_watcher    → Whale (premium tier)
└─ the_chosen_one   → Eye (seeing/being seen)

EPIC (3 badges):       🔥 🚀 📈
├─ gm_streak_30     → Fire (30-day streak)
├─ sent_it          → Rocket (all-in risk)
└─ comeback_kid     → TrendUp (recovery arc)

RARE (2 badges):       🌙 ⚡
├─ to_the_moon      → Moon (aspirational)
└─ degen_mode       → Lightning (risk/energy)

COMMON (2 badges):     🔥 🎯
├─ gm_streak_7      → Fire (7-day streak)
└─ first_blood      → Target (first win)

SPECIAL:               💪
└─ diamond_hands    → HandFist (conviction)
```

### Achievement Display (Example)

```
┌─────────────────────────────────────┐
│ 🏆 few understand                   │
│    Legendary · Drafted a perfect team
│                                     │
│ 🔥 gm streak                        │
│    Common · 7 days in a row         │
│                                     │
│ 💪 diamond hands                    │
│    Epic · Kept same team 4 weeks    │
└─────────────────────────────────────┘
```

---

## XP Level Progression (6 levels)

### Level Icons

```
Level           Emoji  →  Icon          Color      Concept
───────────────────────────────────────────────────────────
1. NOVICE       🔰    →  SmileyBlank   gray-400   Beginner/blank slate
2. APPRENTICE   ⚔️    →  Sword        blue-400   Learning to wield
3. SKILLED      🛡️    →  ShieldPlus   purple-400 Defensive mastery
4. EXPERT       👑    →  Crown        pink-400   Authority/dominance
5. MASTER       💎    →  Diamond      cyan-400   Premium excellence
6. LEGENDARY    🏆    →  Trophy       yellow-400 Ultimate achievement
```

### XP Level Badge (Example)

**BEFORE (emoji):**
```
Your Level: 👑 EXPERT
             ├─ 1.3x vote weight
             ├─ 4 transfers/week
             └─ Unlock elite features
```

**AFTER (icon):**
```
Your Level: [👑] EXPERT
             ├─ 1.3x vote weight
             ├─ 4 transfers/week
             └─ Unlock elite features
```

### Full Level Progression Visual

```
Rank 1         Rank 2         Rank 3         Rank 4         Rank 5         Rank 6
──────         ──────         ──────         ──────         ──────         ──────
  🔰             ⚔️             🛡️             👑             💎             🏆
NOVICE       APPRENTICE      SKILLED        EXPERT        MASTER       LEGENDARY
0-99 XP      100-249 XP      250-499 XP     500-999 XP    1000-2499    2500+ XP
  │             │              │              │             │            │
  └─────────────┴──────────────┴───────────────┴─────────────┴────────────┘
           XP PROGRESSION SYSTEM
```

---

## Performance Feedback Icons

### Percentile-Based Feedback

```
Performance Tier    Emoji  →  Icon         Color      Meaning
─────────────────────────────────────────────────────────────
Top 10%            🏆    →  Trophy       yellow     Outstanding
Top 25%            🔥    →  Fire         orange     Great momentum
Top 40%            ⭐    →  Star         gold       Solid showing
Top 60%            💪    →  HandFist     gray       Good effort
Below 60%          🎯    →  Target       gray       Keep aiming
```

### Modal Display (Example)

**BEFORE:**
```
┌─────────────────────────────────┐
│           🏆                    │
│  Outstanding! You're a natural! │
│     Top 10% finish              │
│                                 │
│  Score: 487.5   Rank: #12      │
│  You could have won: $2.45 SOL  │
└─────────────────────────────────┘
```

**AFTER (icon-driven):**
```
┌──────────────────────────────────┐
│           [🏆]                   │
│  Outstanding! You're a natural!  │
│        Top 10% finish            │
│                                  │
│  Score: 487.5   Rank: #12       │
│  You could have won: 2.45 SOL    │
└──────────────────────────────────┘
```

---

## Medal / Podium Ranking

### Contest Result Display

```
Rank  Medal  →  Icon             Color         Emoji Style
────────────────────────────────────────────────────────────
1st   🥇   →  Medal (fill)      yellow-400   Gold medal
2nd   🥈   →  Medal (fill)      gray-300     Silver medal
3rd   🥉   →  Medal (fill)      orange-600   Bronze medal
4-10  🏆   →  Trophy (fill)     gray-400     Generic trophy
```

### Leaderboard Display

```
┌───┬────────────────────────┬─────┐
│   │ Player                 │     │
├───┼────────────────────────┼─────┤
│ 🥇│ Alice (487 pts)        │ Win │
│ 🥈│ Bob (421 pts)          │ Win │
│ 🥉│ Carol (398 pts)        │ Win │
│ 🏆│ Dave (287 pts)         │ -   │
│ 🏆│ Emma (156 pts)         │ -   │
└───┴────────────────────────┴─────┘
```

---

## Color System for Icons

### Strategic Color Usage

```
Accent Color     Used For                    Icon Examples
─────────────────────────────────────────────────────────
amber-400        Premium / Elite / Value    💎 Diamond
emerald-400      Growth / Health / Good     ⭐ Star, 📈 TrendUp
cyan-400         Action / Standard          👑 Crown
yellow-400       Achievement / Victory      🏆 Trophy, 🥇 Medal
orange-400       Fire / Momentum / Heat     🔥 Fire
gray-400         Neutral / Info / Subtle    📊 ChartBar, 🏆 Trophy
```

### Icon Color Inheritance

```
Text color is inherited from the parent className:

<Fire weight="fill" size={12} className="text-emerald-400" />
                                          ├─ Amber accent
                                          ├─ Green for growth
                                          ├─ Cyan for action
                                          ├─ Yellow for achievement
                                          └─ Gray for neutral
```

---

## Size Reference (Pixel Sizes)

### Icon Sizing Strategy

```
Use Case                     Size   Weight   Context
────────────────────────────────────────────────────
Inline labels               12px   fill     Small text rows
Achievement badges          14px   fill     Card badges
Level badges               16px   fill     Prominent display
Medal/Trophy medals        24-28px fill    Rank display
Large feedback icons       48-56px fill    Modal headlines
```

### Size Comparison

```
inline (12px):    💎  [tiny, inline with text]
badge (14px):     💎  [compact icon badge]
level (16px):     💎  [visible, not overwhelming]
medal (28px):     💎  [prominent on contest card]
feedback (56px):  💎  [hero moment, large modal]
```

---

## Weight Reference (Icon Rendering)

### When to Use Each Weight

```
Weight   Usage                              Phosphor Style
─────────────────────────────────────────────────────────
fill     Achievement badges, medals        Solid, high contrast
         Level icons, priority icons

bold     Action buttons, emphasis          Heavier stroke
         Used rarely in Foresight

regular  Data charts, trends               Normal weight
         Secondary data (TrendUp, ChartBar)

duotone  (Not used in Foresight)          Two-color design
```

### Weight Visual Difference

```
Diamond icon rendered with different weights:

fill:     ◆  (solid, maximum visibility)
bold:     ◇  (heavier outline)
regular:  ◇  (normal outline)
duotone:  ◆◇ (two colors)
```

---

## Transition Timeline

### Before/After Comparison

```
PHASE 1 (Value Labels)
├─ 💎 → Diamond ✓
├─ ⭐ → Star ✓
├─ 📊 → ChartBar ✓
├─ 💸 → CurrencyDollar ✓
└─ 🔥 → Fire ✓

PHASE 2 (Achievements)
├─ 💎 few_understand → Diamond ✓
├─ 💪 diamond_hands → HandFist ✓
├─ 🔥 gm_streak_7 → Fire ✓
├─ ... (8 more) ...
└─ 👁️ the_chosen_one → Eye ✓

PHASE 3 (XP Levels)
├─ 🔰 NOVICE → SmileyBlank ✓
├─ ⚔️ APPRENTICE → Sword ✓
├─ 🛡️ SKILLED → ShieldPlus ✓
├─ 👑 EXPERT → Crown ✓
├─ 💎 MASTER → Diamond ✓
└─ 🏆 LEGENDARY → Trophy ✓

PHASE 4 (Performance)
├─ 🏆 ≤10% → Trophy ✓
├─ 🔥 ≤25% → Fire ✓
├─ ⭐ ≤40% → Star ✓
├─ 💪 ≤60% → HandFist ✓
└─ 🎯 >60% → Target ✓

PHASE 5 (Medals)
├─ 🥇 1st → Medal (gold) ✓
├─ 🥈 2nd → Medal (silver) ✓
├─ 🥉 3rd → Medal (bronze) ✓
└─ 🏆 Other → Trophy ✓

PHASE 6 (Misc)
├─ 💰 Money → CurrencyDollar ✓
├─ 📈 Trends → TrendUp ✓
└─ 👑 Leader → Crown ✓
```

---

## Quality Checklist

### After Each Icon Replacement

```
VISUAL ✓
  □ Icon is visible (not too small)
  □ Icon color matches theme (gold, cyan, etc.)
  □ Icon doesn't overflow container
  □ Icon aligns with text

FUNCTIONAL ✓
  □ Icon displays without errors
  □ Hover states work (if interactive)
  □ Mobile responsive (icons scale)
  □ No console errors

CONSISTENCY ✓
  □ Icon weight matches similar icons
  □ Size is appropriate (12/14/16/24/48px)
  □ Color class follows design system
  □ Spacing around icon is consistent

TESTING ✓
  □ Took before screenshot
  □ Took after screenshot
  □ Compared screenshots visually
  □ Verified on mobile viewport (375px)
```

---

## Common Icon Pairings

### Icons That Work Well Together

```
Diamond + Star
  → Premium tier display
  → "Elite" messaging

Fire + Trophy
  → Victory + momentum
  → "On fire" achievements

Rocket + Moon
  → Ambition
  → "To the moon" messaging

Sword + Shield
  → Learning progression
  → Apprentice → Skilled journey
```

---

## Design System Alignment

### Existing Phosphor Icons Already in Use

These icons are already used in the codebase, confirming our choices:

```
✓ Star — Used in InfluencerProfileCard for tier ratings
✓ Fire — Used in MetricsChart for trending indicators
✓ Crown — Used in FormationTeam for Captain indicator
✓ Trophy — Used in PotentialWinningsModal for achievements
✓ TrendUp — Used throughout for growth indicators
✓ Users — Used for follower counts
✓ Lightning — Used for engagement rates
✓ Check — Used for checkmarks/confirmations
```

Our emoji replacements use these same icons plus complementary ones from the same library.

---

## Implementation Preview

### InfluencerProfileCard Preview (Value Labels)

```
BEFORE:
┌──────────────────────────────────┐
│ Alice      💎 Elite value        │
│ $50        25 pts/$              │
│            [████████] 75%        │
│ 👥 12.5K   ⚡ 8.2% engagement    │
└──────────────────────────────────┘

AFTER:
┌──────────────────────────────────┐
│ Alice      [💎]                 │
│ $50        Elite value 💎 25 pts│
│            [████████] 75%        │
│ 👥 12.5K   ⚡ 8.2% engagement    │
└──────────────────────────────────┘
(icons crisp, consistent across devices, full CSS control)
```

---

## Font Pairing

### Icon + Typography

```
Icon Weight: fill
Icon Size: 12-16px
Typography: Inter (body)
Result: Professional, sharp, cohesive

Icon Weight: fill
Icon Size: 48-56px
Typography: Plus Jakarta Sans (display)
Result: Bold, confident, impactful
```

---

## Accessibility Notes

### Why Phosphor Icons Beat Emojis

1. **Screen Readers** — Icons can have `title` attributes
   ```tsx
   <Diamond weight="fill" size={12} title="Elite value" />
   // Better than emoji with no context
   ```

2. **Semantic Meaning** — Icon names are explicit
   ```tsx
   Diamond  // Clear: premium tier
   vs
   💎       // Ambiguous: could be anything shiny
   ```

3. **Styling** — Full control over visibility/contrast
   ```tsx
   className="text-amber-400"  // Guaranteed contrast
   vs
   💎 (emoji color = device default)
   ```

---

## Next Steps

1. Review this visual guide
2. Reference the detailed mapping: `EMOJI_TO_PHOSPHOR_MAPPING.md`
3. Follow code examples: `EMOJI_REPLACEMENT_CODE_EXAMPLES.md`
4. Implement phases 1-6 in order
5. Verify visually with before/after screenshots

