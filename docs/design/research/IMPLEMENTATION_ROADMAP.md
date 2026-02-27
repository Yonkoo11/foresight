# Trading App Design Patterns: Implementation Roadmap

**Status:** Ready for implementation
**Priority Level:** High (directly impacts perceived quality)
**Estimated Effort:** 20-30 developer hours
**Timeline:** 2-3 weeks (done during code review queue or slow periods)

---

## Summary

Foresight's design is 80% aligned with premium crypto trading apps (Hyperliquid, Axiom, Photon, Birdeye, DexScreener). This roadmap focuses on the remaining 20%: animations, glow effects, type scale simplification, and mobile interactions.

**Key Insight:** These changes are NOT new features. They're refinements to existing components that will make Foresight feel dramatically more premium.

---

## Phase 1: Animations & Effects (Week 1)

### Task 1.1: Add Score Flash Animation
**Effort:** 3-4 hours | **Difficulty:** Easy | **Impact:** High

**What:** When a user's leaderboard score updates, flash the row background for 150-200ms then fade.

**Why:** All trading apps do this. It signals "data is updating" without being distracting. Creates a sense of live action.

**Steps:**
1. Add `scoreFlash` animation to `frontend/src/index.css` (see CODE_EXAMPLES.md)
2. Update leaderboard component to detect score changes
3. Trigger animation when score changes: `className={isFlashing ? 'animate-score-flash' : ''}`
4. Test at 375px mobile width (ensure animation works on touch)
5. Verify animation duration (should be 150-200ms, not 300ms)

**Code reference:** `TRADING_APPS_CODE_EXAMPLES.md` → Section "Real-Time Score Flash Animation"

**Done when:**
- [ ] Score updates flash (gold for increase, rose for decrease)
- [ ] Animation is 150-200ms
- [ ] Works on mobile at 375px
- [ ] Screenshot shows before/after (compare to Hyperliquid leaderboard)

---

### Task 1.2: Increase Glow Usage (Achievements & Badges)
**Effort:** 2-3 hours | **Difficulty:** Easy | **Impact:** Medium-High

**What:** Replace standard shadows with soft glows on achievement cards, S-tier badges, and "Live" indicators.

**Why:** Glows work better in dark themes than shadows. Signal premium quality and "alive" status.

**Steps:**
1. Find all achievement card components (Profile, Progress pages)
2. Replace `shadow-md` with `glow-gold` (from DESIGN_TOKENS.md)
3. Apply to S-tier badges (leaderboard, draft board)
4. Add pulsing glow to "Live" contest indicator (optional but high impact)
5. Test glow intensity (should be visible but not harsh)

**Code reference:** `TRADING_APPS_CODE_EXAMPLES.md` → Section "Glow Effects for Achievements"

**Done when:**
- [ ] All achievement cards have glow-gold
- [ ] S-tier badges have glow
- [ ] "Live" indicator has pulsing glow (optional)
- [ ] Glow intensity matches Hyperliquid / Axiom
- [ ] Screenshot shows glowing cards (high impact visually)

---

### Task 1.3: Add Real-Time Update Service (Leaderboard)
**Effort:** 4-5 hours | **Difficulty:** Medium | **Impact:** High

**What:** Implement polling or SSE to fetch leaderboard updates every 30 seconds and flash changed rows.

**Why:** Leaderboard scores should update in real-time (or near-real-time). Signals that the game is "live."

**Steps:**
1. Create `services/scoringService.ts` with polling logic (see CODE_EXAMPLES.md)
2. Update leaderboard component to subscribe to updates
3. On update, trigger flash animation
4. Handle loading/error states gracefully
5. Test with mock data (rapid score changes)

**Code reference:** `TRADING_APPS_CODE_EXAMPLES.md` → Section "Real-Time Update Handler"

**Done when:**
- [ ] Leaderboard polls for updates every 30 seconds
- [ ] Score changes trigger flash animation
- [ ] Error handling is graceful (no crashes)
- [ ] Works on mobile
- [ ] Stops polling when page is not visible (battery friendly)

---

## Phase 2: Type Scale & Typography (Week 2)

### Task 2.1: Simplify Type Scale
**Effort:** 3-4 hours | **Difficulty:** Medium | **Impact:** High

**What:** Reduce from 12 type sizes to 6 core sizes (hero, display, body-lg, body, body-sm, caption).

**Why:** Too many sizes create visual chaos. Trading apps use 5-6. Simplicity = sophistication.

**Steps:**
1. Update `DESIGN_TOKENS.md` (reduce type scale section)
2. Update Tailwind config with 6 sizes only
3. Find all components using 7-12 sizes
4. Consolidate to the nearest core size
5. Test at desktop and mobile (ensure readability)

**Mapping:**
```
Current         → New
h1 (36px)       → display (32px)
h2 (28px)       → display (32px)
h3 (22px)       → body-lg (18px)
h4 (18px)       → body-lg (18px)
body-lg (18px)  → body-lg (18px)
body (16px)     → body (16px)
body-sm (14px)  → body-sm (14px)
caption (12px)  → caption (12px)
micro (10px)    → caption (12px)
```

**Done when:**
- [ ] DESIGN_TOKENS.md has 6 sizes only
- [ ] All components use new scale
- [ ] No components using unlisted sizes
- [ ] Type hierarchy is clear at 375px and desktop
- [ ] Lighthouse score improves (cleaner CSS)

---

### Task 2.2: Monospace Data Review
**Effort:** 2 hours | **Difficulty:** Easy | **Impact:** Medium

**What:** Audit all number usage, ensure monospace font is used for scores/ranks/amounts.

**Why:** Monospace numbers signal "trustworthy data." All trading apps do this.

**Steps:**
1. Find all leaderboard/stats components
2. Check that all numbers are `font-mono`
3. Verify monospace is used for:
   - Scores (leaderboard, contest detail)
   - Ranks (#1, #2, etc.)
   - Point values (+240 pts, -15 pts)
   - Contest prizes (1.5 ETH)
   - User IDs / wallet addresses
4. Check that body text is NOT monospace

**Code pattern:**
```jsx
// ✅ Correct
<span className="font-mono text-sm font-medium">2,480 pts</span>

// ❌ Wrong
<p className="font-mono">Your team is doing great!</p>
```

**Done when:**
- [ ] All numbers are monospace
- [ ] Body text is not monospace
- [ ] Monospace font is JetBrains Mono or equivalent
- [ ] Weight is medium (500) or semibold (600) for data

---

## Phase 3: Button & Interaction Polish (Week 2-3)

### Task 3.1: Button Hover States Review (Mobile)
**Effort:** 3-4 hours | **Difficulty:** Medium | **Impact:** Medium-High

**What:** Test all buttons at 375px mobile width. Ensure hover states work with touch (no tap-to-see-border).

**Why:** Hover states are invisible on touch. Every interaction must work with `:active` and `:focus` states.

**Steps:**
1. Open all pages in mobile viewport (375px)
2. Find all buttons (Primary, Secondary, Ghost, Danger)
3. Test on real mobile phone or DevTools touch emulation
4. Ensure buttons respond to TAP (not just hover)
5. Check that:
   - Touch target is ≥ 44px tall
   - Border/background reveals on tap (not just hover)
   - Active state is visible
   - No hover-only affordances

**Pattern to use:**
```jsx
// ✅ Works on touch (has :active and :focus)
<button className="
  text-gray-500 border-transparent
  hover:border-gray-700 hover:bg-gray-800
  active:border-gray-700 active:bg-gray-800  // ← for touch
  focus:outline-2 focus:outline-offset-2 focus:outline-gold-500
">
  Follow
</button>
```

**Done when:**
- [ ] All buttons tested on mobile (real phone or emulation)
- [ ] Touch states are visible (not just hover)
- [ ] No button is smaller than 44px height
- [ ] Buttons feel responsive on touch (no lag)
- [ ] Leaderboard buttons (follow, view) work perfectly

---

### Task 3.2: Ghost Button Consistency
**Effort:** 2 hours | **Difficulty:** Easy | **Impact:** Medium

**What:** Ensure all repeated action buttons (follow, like, view profile, etc.) use ghost styling consistently.

**Why:** Reduces visual noise. Makes primary actions (gold CTAs) stand out.

**Steps:**
1. Find all buttons that appear on every row (follow, like, share, etc.)
2. Check styling:
   - Default: `text-gray-500 border-transparent` (nearly invisible)
   - Hover: `border-gray-700 bg-gray-800 text-gray-300` (subtle reveal)
3. Replace any that have color defaults or solid backgrounds
4. Test consistency across all pages

**Done when:**
- [ ] All repeated action buttons are ghost-styled
- [ ] Follow buttons on leaderboard are consistent
- [ ] Like buttons on contests are consistent
- [ ] No colored buttons appear on every row

---

## Phase 4: Mobile-First Polish (Week 3)

### Task 4.1: Mobile Leaderboard Layout
**Effort:** 2-3 hours | **Difficulty:** Medium | **Impact:** High

**What:** Ensure leaderboard is perfect at 375px (one row = complete information unit).

**Why:** Most users access on mobile. Leaderboard is a key page.

**Steps:**
1. Open leaderboard on mobile (375px)
2. Verify all essential info fits: rank, name, score, action button
3. Check no horizontal scroll needed
4. Verify touch targets (44px minimum)
5. Test with long usernames (truncate gracefully)
6. Verify monospace numbers are readable

**Rows should fit:**
```
[#1] Avatar Name    2,480 pts [Follow]
     @handle             (secondary text below)
```

All on one row without wrapping (except long names).

**Done when:**
- [ ] Leaderboard looks great at 375px
- [ ] No horizontal scroll
- [ ] Rank, name, score, action all visible
- [ ] Touch targets work
- [ ] Screenshot looks clean and professional

---

### Task 4.2: Contest Grid Responsiveness
**Effort:** 1-2 hours | **Difficulty:** Easy | **Impact:** Low-Medium

**What:** Verify contest grid/card layout at 375px (should be 1 column), 640px (2 columns), 1024px (3 columns).

**Why:** Ensures mobile experience is clean, desktop is information-dense.

**Code pattern:**
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards stack properly at each breakpoint */}
</div>
```

**Done when:**
- [ ] Cards are 1 column on mobile (375px)
- [ ] Cards are 2 columns on tablet (640px)
- [ ] Cards are 3 columns on desktop (1024px)
- [ ] No cards are cramped at any breakpoint

---

## Phase 5: Final Polish & QA (Week 3)

### Task 5.1: Animation Audit
**Effort:** 2-3 hours | **Difficulty:** Easy | **Impact:** Medium

**What:** Review all animations for consistent timing and feel.

**Why:** Animations should feel snappy (150-300ms), not smooth (500ms+).

**Checklist:**
- [ ] Page transitions: 300ms max
- [ ] Button hovers: 200ms max
- [ ] Score flashes: 150-200ms
- [ ] Glow pulses: 2s (for breathing effect, not jarring)
- [ ] All use `ease-out` (snappy, not ease-in-out which feels sluggish)

**Fix if:**
- Any animation takes >300ms (reduce)
- Any animation uses `ease-in-out` (change to `ease-out`)
- Animations feel laggy on mobile (profile, reduce effect)

---

### Task 5.2: Contrast & Accessibility Audit
**Effort:** 2 hours | **Difficulty:** Easy | **Impact:** Medium

**What:** Ensure all text meets WCAG AA contrast (4.5:1 for body, 3:1 for large text).

**Why:** Accessibility is table-stakes. Premium products are accessible.

**Tools:** Use axe DevTools or WebAIM contrast checker

**Check:**
- [ ] All body text: 4.5:1 contrast
- [ ] All headings: 3:1 contrast (large text)
- [ ] Links are underlined or have color + underline
- [ ] Buttons have sufficient contrast
- [ ] Disabled states are still readable (not <3:1)

**Common fixes:**
- Replace `text-gray-500` with `text-gray-400` where contrast is poor
- Verify white text on gold background (might be too bright)
- Check dark-on-dark combinations

---

### Task 5.3: Screenshot Comparison
**Effort:** 2-3 hours | **Difficulty:** Easy | **Impact:** High (verification)

**What:** Take before/after screenshots and compare against reference apps.

**Why:** Visual verification is crucial. "Looks right" is the final test.

**Screenshots to take:**
1. Leaderboard (compare to Hyperliquid)
2. Achievement card (compare to Axiom style)
3. Contest grid (compare to Photon mobile layout)
4. Leaderboard with live score update (verify flash animation)

**Process:**
1. Use `scripts/screenshot.ts` or manual DevTools screenshots
2. Compare side-by-side against Hyperliquid leaderboard
3. Ask: "Does it feel premium? Does it feel CT-native?"
4. If not, adjust and take another screenshot

---

## Testing Checklist

Before marking Phase done:

### Animations
- [ ] Score flash is exactly 150-200ms
- [ ] Glow effects are visible but not harsh
- [ ] Pulsing animations don't feel jarring
- [ ] All animations work on mobile (30fps and 60fps)

### Typography
- [ ] 6 type sizes only (no orphaned sizes)
- [ ] All numbers are monospace
- [ ] Body text is readable at 14px minimum
- [ ] Hierarchy is clear

### Buttons
- [ ] Ghost buttons are nearly invisible by default
- [ ] Hover states reveal subtly (no jarring color changes)
- [ ] Touch targets are 44px minimum height
- [ ] Buttons work on mobile (tap, not just hover)

### Layout
- [ ] Mobile: 375px width, no horizontal scroll
- [ ] Tablet: 640px width, 2-column layout
- [ ] Desktop: 1024px+, 3-column layout
- [ ] All breakpoints tested

### Accessibility
- [ ] WCAG AA contrast (4.5:1 body, 3:1 large)
- [ ] Keyboard navigation works (Tab through buttons)
- [ ] Focus states are visible
- [ ] Screen reader friendly (test with NVDA/JAWS)

---

## Estimated Timeline

| Phase | Tasks | Hours | Timeline |
|-------|-------|-------|----------|
| 1 | Animations & Glow | 9-12 | Days 1-4 |
| 2 | Type Scale & Typography | 5-6 | Days 5-7 |
| 3 | Button Polish | 5-6 | Days 8-10 |
| 4 | Mobile Polish | 3-5 | Days 11-12 |
| 5 | Final QA | 6-8 | Days 13-14 |
| **Total** | **5 phases** | **28-37** | **2-3 weeks** |

---

## Dependencies & Prerequisites

- [ ] Read `TRADING_APPS_QUICK_REFERENCE.md` (10 min)
- [ ] Review `TRADING_APPS_CODE_EXAMPLES.md` for patterns (15 min)
- [ ] Have design tokens approved (should already be done)
- [ ] Have access to dev environment + mobile testing device
- [ ] Have Figma for comparison screenshots (optional but helpful)

---

## Success Criteria

When complete, Foresight should:

1. **Feel premium** — No components feel cheap or hastily made
2. **Be CT-native** — Uses patterns recognizable to crypto traders
3. **Perform well** — Animations are smooth, no jank
4. **Be accessible** — WCAG AA at minimum
5. **Impress on demo** — Should look like a $50M+ product
6. **Close to trading apps** — Hyperliquid/Axiom level visual quality

**Final test:** Show screenshot to someone familiar with Hyperliquid or DexScreener. Do they think Foresight is premium crypto UI? If yes, done.

---

## Risk Mitigation

**Risk:** Animations cause performance issues on older mobile phones

**Mitigation:**
- Test on iPhone 6S (oldest relevant device)
- Reduce animation complexity if needed
- Use `will-change` sparingly
- Profile with DevTools Performance tab

**Risk:** Type scale changes break layouts

**Mitigation:**
- Make changes in a feature branch
- Test all pages before merging
- Keep fallback sizes (won't break, just change appearance)

**Risk:** Mobile testing reveals last-minute issues

**Mitigation:**
- Test mobile early (Task 3.1, 4.1, 4.2)
- Don't wait until Phase 5 to discover mobile issues

---

## Rollback Plan

If issues arise:

1. Animations causing lag? → Keep animations, reduce complexity
2. Type scale breaks layout? → Revert type scale changes, do 1 size at a time
3. Glows look bad? → Reduce intensity (0.2 → 0.15 opacity)
4. Buttons don't work on mobile? → Add `:active` states, test touch emulation

All changes are CSS/styling, so rollback is simple (git revert).

---

## Sign-Off Checklist

Before shipping:

- [ ] All Phase 1-5 tasks complete
- [ ] Testing checklist 100% passed
- [ ] Screenshots show improvement vs. baseline
- [ ] No performance regressions (Lighthouse ≥ 90)
- [ ] Mobile feels responsive (no lag on iPhone)
- [ ] Accessibility audit passed (WCAG AA)
- [ ] Design review approved
- [ ] Product manager approved

---

## Questions?

- **"Where's the code?"** → `TRADING_APPS_CODE_EXAMPLES.md`
- **"What should I do first?"** → Task 1.1 (Score Flash)
- **"How long will this take?"** → 20-30 hours for 1 dev, 2-3 weeks
- **"Do I have to do this?"** → High priority but not blocking launch
- **"Can I skip Phase X?"** → Yes, but Phase 1 (animations) is most impactful

---

**Owner:** Design + Frontend Team
**Priority:** High (perceived quality)
**Status:** Ready for implementation
**Last Updated:** February 27, 2026
