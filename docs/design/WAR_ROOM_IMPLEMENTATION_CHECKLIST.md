# War Room Design Implementation Checklist

> **Tactical execution guide for rolling out the War Room direction**
> **Status:** Ready to start
> **Deadline:** Before Feb 27 demo

---

## Phase 1: Foundation Setup (30 min — Day 1 Start)

### Tailwind Config Updates
- [ ] Add neon green color to `tailwind.config.js`:
  ```javascript
  colors: {
    'neon-green': {
      50: '#F0FFF4',
      100: '#C6F6D5',
      400: '#48BB78',
      500: '#10F981',  // Our neon
      600: '#00D084',
    }
  }
  ```

- [ ] Add new animations:
  ```javascript
  animation: {
    'pulse-green': 'pulseGreen 0.5s ease-in-out 2',
    'intense-pulse': 'intensePulse 1s ease-in-out',
  }
  ```

- [ ] Add keyframes:
  ```javascript
  keyframes: {
    pulseGreen: {
      '0%, 100%': {
        boxShadow: '0 0 20px rgba(16, 249, 129, 0.3)',
        color: 'rgb(250 204 21)'  // fades to normal
      },
      '50%': {
        boxShadow: '0 0 40px rgba(16, 249, 129, 0.6)',
        color: 'rgb(16 249 129)'   // neon green
      }
    },
    intensePulse: {
      '0%, 100%': { boxShadow: '0 0 20px rgba(16, 249, 129, 0.3)' },
      '50%': { boxShadow: '0 0 60px rgba(16, 249, 129, 0.8)' }
    }
  }
  ```

### Global CSS Updates
- [ ] Update `frontend/src/index.css` with new shadow utilities:
  ```css
  @layer components {
    .shadow-glow-green {
      box-shadow: 0 0 20px rgba(16, 249, 129, 0.4),
                  0 0 40px rgba(16, 249, 129, 0.2);
    }

    .shadow-glow-green-intense {
      box-shadow: 0 0 40px rgba(16, 249, 129, 0.6),
                  0 0 80px rgba(16, 249, 129, 0.3);
    }

    .update-animation {
      animation: pulseGreen 0.5s ease-in-out 2;
    }
  }
  ```

---

## Phase 2: Core Component Updates (5-6 hours — Day 1)

### Component 1: LeaderboardRow.tsx
**Current Location:** `frontend/src/components/LeaderboardRow.tsx`
**Estimated Time:** 1.5 hours

**Changes:**
- [ ] Reduce vertical padding: `py-2` instead of `py-3`
- [ ] Change rank number to monospace: `font-mono font-bold text-gold-400`
- [ ] Change score number to monospace: `font-mono font-bold text-lg`
- [ ] Add monospace to momentum delta: `font-mono text-sm`
- [ ] Add neon green color when positive: `text-neon-green-500 when momentum > 0`
- [ ] Add animation trigger: when score updates, add `update-animation` class
- [ ] Update hover state: buttons appear on hover (keep existing ghost styling)
- [ ] Add glow effect on hover for your own team:
  ```javascript
  {isYourTeam && (
    <div className="absolute inset-0 border border-neon-green-400/50 rounded-lg shadow-glow-green" />
  )}
  ```

**Before/After:**
```
Before: "2.  CZ Binance    Score: 4821     Follow"
After:  "#2 │ 🟡 CZ Binance │ 4,821 FS │ Follow >"
        (with monospace numbers and compact spacing)
```

### Component 2: ScoreDisplay.tsx (or ForesightScoreCard.tsx)
**Current Location:** `frontend/src/components/ScoreDisplay.tsx`
**Estimated Time:** 1 hour

**Changes:**
- [ ] Increase font size for main number: `text-6xl md:text-7xl` (was probably 3-4xl)
- [ ] Apply monospace to main score: `font-mono font-black`
- [ ] Apply monospace to momentum: `font-mono text-lg`
- [ ] Change momentum color to neon green if positive:
  ```javascript
  <span className={momentum > 0 ? 'text-neon-green-500' : 'text-rose-500'}>
    {momentum > 0 ? '⬆' : '⬇'} {Math.abs(momentum)} this week
  </span>
  ```
- [ ] Add glow animation when score updates:
  ```javascript
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    setJustUpdated(true);
    const timeout = setTimeout(() => setJustUpdated(false), 1100);
    return () => clearTimeout(timeout);
  }, [score]);

  // Apply to score display:
  className={justUpdated ? 'animate-pulse-green' : ''}
  ```
- [ ] Add percentile context: `<p className="text-sm text-gray-400">Top {percentile}% of all players</p>`
- [ ] Optional: add sparkline chart (TBD, lower priority)

**Before/After:**
```
Before:
  Foresight Score
  4821
  Rank: #42

After:
  YOUR FORESIGHT SCORE

  4,821 FS
  ⬆ +127 this week
  Top 8% of all players
  [sparkline chart]
```

### Component 3: ContestCard.tsx
**Current Location:** `frontend/src/components/ContestCard.tsx`
**Estimated Time:** 1 hour

**Changes:**
- [ ] Find prize/entry amount fields
- [ ] Apply monospace: `font-mono` to all numeric values
- [ ] Update "Live" badge styling:
  ```javascript
  {isLive && (
    <span className="inline-flex items-center gap-1 bg-neon-green-500/20 text-neon-green-500 px-2 py-1 rounded text-xs font-semibold animate-pulse">
      ◆ Live Now
    </span>
  )}
  ```
- [ ] Reduce card padding if applicable: tighter layout
- [ ] Add glow shadow to active/live contests:
  ```javascript
  className={`... ${isLive ? 'shadow-glow-green' : 'shadow-md'}`}
  ```
- [ ] Ensure button text uses monospace for amounts:
  ```javascript
  <button className="...">
    Join · <span className="font-mono">0.050 SOL</span>
  </button>
  ```

**Before/After:**
```
Before: "FREE   $0.13   12 Players   Join @cz_binance's League"
After:  "FREE ◆ Live Now │ Prize: 0.050 SOL │ Players: 42 │ Time Left: 2d 5h"
        (with neon green badge, monospace numbers)
```

### Component 4: Button.tsx Updates
**Current Location:** `frontend/src/components/ui/Button.tsx`
**Estimated Time:** 30 min

**Changes:**
- [ ] Reduce transition timing from 200ms to 150ms:
  ```javascript
  className="transition-all duration-150 ease-out"  // was duration-200
  ```
- [ ] Update gold button hover shadow:
  ```javascript
  hover:shadow-glow  // Gold button on hover shows subtle glow
  ```
- [ ] Add new ghost button variant for actions on every row (if not exists):
  ```javascript
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-800 hover:text-gray-200 border-transparent'
  ```

### Component 5: Badge.tsx Updates
**Current Location:** `frontend/src/components/ui/Badge.tsx`
**Estimated Time:** 30 min

**Changes:**
- [ ] Keep existing S/A/B/C tier variants
- [ ] Add new "winning" badge variant:
  ```javascript
  winning: {
    bg: 'bg-neon-green-500/20',
    text: 'text-neon-green-400',
    border: 'border-neon-green-500/30'
  }
  ```
- [ ] Add new "live" badge variant:
  ```javascript
  live: {
    bg: 'bg-neon-green-500/20',
    text: 'text-neon-green-500',
    border: 'border-neon-green-500/30',
    animation: 'pulse'
  }
  ```

---

## Phase 3: Page-Level Integration (2 hours — Day 1 Afternoon)

### Page 1: Leaderboard / Rankings
**File:** `frontend/src/pages/Leaderboard.tsx` or `Compete.tsx`
**Time:** 1 hour

- [ ] Import updated LeaderboardRow component
- [ ] Test spacing on mobile (375px)
- [ ] Verify monospace numbers display correctly
- [ ] Test animation trigger on score update
- [ ] Screenshot at 375px, 768px, 1024px widths
- [ ] Compare before/after visually

### Page 2: Dashboard / Home
**File:** `frontend/src/pages/Dashboard.tsx` or `Home.tsx`
**Time:** 45 min

- [ ] Update ScoreDisplay component
- [ ] Verify glow animation works
- [ ] Test percentile calculation
- [ ] Take screenshot
- [ ] Ensure layout doesn't break on mobile

### Page 3: Contest Detail
**File:** `frontend/src/pages/ContestDetail.tsx`
**Time:** 15 min

- [ ] Update ContestCard and inline contest info styling
- [ ] Ensure "Live" badge displays with glow
- [ ] Verify prize amounts use monospace
- [ ] Take screenshot

---

## Phase 4: Polish & Animation (2-3 hours — Day 2)

### Real-Time Update Animations
**File:** Create or update `frontend/src/hooks/useScoreAnimation.ts`
**Time:** 1 hour

**Create hook for score update animation:**
```typescript
export const useScoreAnimation = (score: number) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevScore = useRef(score);

  useEffect(() => {
    if (score !== prevScore.current) {
      setIsAnimating(true);
      prevScore.current = score;
      const timeout = setTimeout(() => setIsAnimating(false), 1100);
      return () => clearTimeout(timeout);
    }
  }, [score]);

  return { isAnimating, animationClass: isAnimating ? 'animate-pulse-green' : '' };
};
```

- [ ] Apply hook to all score displays
- [ ] Test animation fires on update
- [ ] Verify timing (1.1s total)

### Hover State Reveals
**File:** Update LeaderboardRow.tsx with refined hover states
**Time:** 45 min

- [ ] Ensure buttons appear on hover (not at rest)
- [ ] Test on mobile (tap should trigger similar reveal)
- [ ] Verify no button artifacts at rest
- [ ] Test on dark backgrounds (contrast)

### Achievement/Win Celebrations (Optional)
**File:** Create `frontend/src/components/WinCelebration.tsx`
**Time:** 1 hour (if time permits)

- [ ] Create celebration modal/overlay
- [ ] Add confetti animation (use external lib or CSS)
- [ ] Apply intense neon glow
- [ ] Play optional sound effect
- [ ] Test dismissal

---

## Phase 5: Share Card Redesign (2 hours — Day 2)

### Share Card Redesign
**File:** `frontend/src/utils/generateTeamCard.ts` or `shareCard.ts`
**Time:** 2 hours

**Current State:** Likely using Canvas to generate parchment-style card

**Changes:**
- [ ] Replace background: cream parchment → dark gray gradient
- [ ] Keep header simple: Team name + league name (gold text)
- [ ] Redesign stats section: monospace numbers, neon green indicators
- [ ] Update influencer grid: pentagon formation with tier badges
- [ ] Add footer: "Built on Foresight · Powered by Tapestry Protocol"
- [ ] Add subtle gold/green glow around edges
- [ ] Test dimensions: 1200x630px (Twitter OG size)

**Example structure:**
```
┌────────────────────────────────────┐
│ CZ's Champions League              │
│ A SIGNATURE league · Week 8         │
│                                    │
│        🟡   🟡   🟡               │  (3 top tier avatars)
│      🟡           🟡              │  (2 supporting avatars)
│                                    │
│ SCORE:      4,821 FS  [green]    │
│ RANK:       #42       [gold]     │
│ TIER:       A-Tier    [cyan]     │
│ MOMENTUM:   +342      [green]    │
│                                    │
│ Built on Foresight                 │
│ ◆ Powered by Tapestry Protocol     │
└────────────────────────────────────┘
```

---

## Phase 6: Testing & Validation (1-2 hours — Day 2)

### Responsive Testing
- [ ] **Mobile (375px):** All numbers readable, touch targets 44px+
- [ ] **Tablet (768px):** Full layout visible, no overflow
- [ ] **Desktop (1024px+):** Spacious, all details visible

### Animation Testing
- [ ] **Score updates:** Glow appears, fades in 800ms
- [ ] **Contest "Live" badge:** Pulses continuously
- [ ] **Hover states:** Smooth 150ms transitions
- [ ] **Reduced motion:** Animations disabled if `prefers-reduced-motion` set

### Accessibility Testing
- [ ] **Contrast:** Neon green on dark gray (6:1+)
- [ ] **Color alone:** Don't rely on green for info (use icons/text too)
- [ ] **Touch targets:** All interactive elements 44px+ (check with DevTools)
- [ ] **Screen reader:** All numbers have semantic labels

### Visual Comparison
- [ ] **Take "before" screenshots** (if not done earlier)
- [ ] **Take "after" screenshots** at same breakpoints
- [ ] **Side-by-side comparison:** Document visual improvements
- [ ] **Get feedback:** Show to one CT user (trader/degen)

### Performance Checklist
- [ ] No animation janking (60fps)
- [ ] No layout shifts (Cumulative Layout Shift < 0.1)
- [ ] No excessive re-renders (React DevTools Profiler)

---

## Phase 7: Copy & Language Update (Optional — 1 hour)

**If time permits, update CTAs and labels to War Room language:**

- [ ] "Compete" → "Hunt Influence"
- [ ] "View Feed" → "Track Signals"
- [ ] "Your Team" → "Your Position"
- [ ] "Join Contest" → "Enter"
- [ ] "Leaderboard" → "Rankings"
- [ ] "View Profile" → "Analyze"

---

## Time Breakdown (Best Case)

| Phase | Task | Time |
|-------|------|------|
| 1 | Config + CSS setup | 30 min |
| 2 | Core components (5) | 5 hours |
| 3 | Page integration | 1.5 hours |
| **Subtotal** | **Tier 1 (Core)** | **7 hours** |
| 4 | Animations + Polish | 2 hours |
| 5 | Share card redesign | 1.5 hours |
| 6 | Testing + validation | 1.5 hours |
| 7 | Copy updates | 0.5 hours |
| **TOTAL** | **Full War Room** | **12 hours** |

---

## Minimum Viable War Room (If Time Is Tight)

**If you only have 4-5 hours, do this:**

1. **Tailwind config** (30 min)
   - Add neon green
   - Add animations

2. **LeaderboardRow.tsx** (1.5 hours)
   - Monospace numbers
   - Neon green updates
   - Tight spacing

3. **ScoreDisplay.tsx** (1 hour)
   - Larger size
   - Monospace
   - Glow animation

4. **ContestCard.tsx** (1 hour)
   - Monospace amounts
   - Neon badge

5. **Test & verify** (30 min)
   - Mobile screenshot
   - Animation check
   - Visual comparison

**Result:** 60-70% improvement with 40% less work.

---

## Files to Modify (Summary)

### Config/CSS
- [ ] `frontend/tailwind.config.js` — Add colors, animations, keyframes
- [ ] `frontend/src/index.css` — Add shadow utilities, glow effects

### Components
- [ ] `frontend/src/components/LeaderboardRow.tsx` — Monospace, spacing, glow
- [ ] `frontend/src/components/ScoreDisplay.tsx` — Larger, monospace, animation
- [ ] `frontend/src/components/ContestCard.tsx` — Neon badge, monospace
- [ ] `frontend/src/components/ui/Button.tsx` — 150ms transitions
- [ ] `frontend/src/components/ui/Badge.tsx` — Add winning/live variants

### Utilities/Hooks
- [ ] Create `frontend/src/hooks/useScoreAnimation.ts` — Score update animation
- [ ] Update `frontend/src/utils/generateTeamCard.ts` — Share card redesign

### Pages
- [ ] `frontend/src/pages/Leaderboard.tsx` — Import updated components
- [ ] `frontend/src/pages/Dashboard.tsx` — Import updated components
- [ ] `frontend/src/pages/ContestDetail.tsx` — Import updated components

---

## Review Checklist Before "Done"

- [ ] All Tier 1 components completed
- [ ] Monospace applied to all numbers
- [ ] Neon green used only for updates/wins/alerts
- [ ] Animations are 100-150ms (snappy)
- [ ] Mobile responsive at 375px
- [ ] Accessibility standards met (contrast, touch targets)
- [ ] Share card redesigned
- [ ] Visual comparison screenshot done
- [ ] One CT user has seen it and approved
- [ ] No console errors or warnings
- [ ] Performance is smooth (60fps)

---

## Success Indicators

✅ **You'll know it's working when:**
- Numbers immediately stand out (monospace contrast)
- Updates feel electric (glow + green)
- Layout feels data-dense (tighter spacing)
- Leaderboard is scannable (compact rows)
- Mobile doesn't look cramped (responsive tested)
- Share card looks premium (not parchment)
- Animations don't feel sluggish (150ms snappy)
- A CT user says "This feels right"

---

## Deployment

- [ ] Test locally in all browsers (Chrome, Safari, Firefox)
- [ ] Test on real mobile devices (iPhone, Android)
- [ ] Deploy to staging
- [ ] Do final QA
- [ ] Deploy to production
- [ ] Monitor for layout shifts or performance regressions

---

## Support Resources

- **Tailwind docs:** https://tailwindcss.com/docs/
- **CSS animations:** https://developer.mozilla.org/en-US/docs/Web/CSS/animation
- **React hooks:** https://react.dev/reference/react/hooks
- **Canvas/Drawing:** Check existing share card implementation

---

*This checklist is your execution guide. Follow it step-by-step. You'll have a War Room design in 10-12 hours.*
