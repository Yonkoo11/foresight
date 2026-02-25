# Profile Page Redesign — Executive Summary

> **Status:** Strategy complete, ready for implementation
> **Created:** February 25, 2026
> **Audience:** Product, Design, Engineering leads
> **Time to implement:** 6-8 hours

---

## The Problem (In 30 Seconds)

**Current Profile page has:** 5 visual sections with competing weights, 2 redundant progression cards (FS Score + XP), 6 navigation cards that duplicate the bottom nav, and Foresight's **key differentiator (Tapestry on-chain integration) buried at the bottom**.

**User experience:** Confusing hierarchy, too much scrolling, doesn't answer "who am I?" just says "go somewhere else."

**Judge experience:** Won't see Tapestry unless they scroll to bottom of a 1,200px tall page.

---

## The Solution (In 30 Seconds)

**Consolidate into 3 clear sections:**
1. **Player Status** — Merge FS Score + XP into one card (single focal point)
2. **Tapestry Identity** — Move from bottom to position #2 (key differentiator, visible immediately)
3. **Your Team** — Show current draft or "Start drafting" CTA

**Remove:** 6 redundant navigation cards + separate XP card

**Result:** Compact, mobile-friendly profile that tells a clear story in 3 sections, loads 50% faster vertically, and showcases Tapestry early.

---

## Key Metrics

| Metric | Before | After | Win |
|--------|--------|-------|-----|
| Sections | 5 | 3 | Clearer focus |
| Header height | 70px | 40px | -43% |
| Mobile: Cards visible 1st screen | 1.5 | 3 | 2x more visible |
| Color conflicts | 2 (gold + cyan) | 0 | Clean hierarchy |
| Tapestry visibility | Scrolled off | Immediate | Judges see it! |
| Scroll height | ~1,200px | ~600px | -50% |

---

## Visual Changes

### Removed Sections
- ❌ "Today's Actions" (3 cards) — users have /compete in bottom nav
- ❌ "Quick Links" (3 cards) — same, duplicate navigation
- ❌ Separate "Experience Level" card — merged into Player Status

### Promoted Sections
- ⬆️ Tapestry → Move from bottom to #2 (was at bottom, now immediate)
- 🔄 Player Status → New card merging old FS Score + XP cards

### New Components
- 📱 **PlayerStatusCard** — Merged FS Score + XP (single focal point)
- 🏆 **YourTeamCard** — Show current team or "Start drafting"
- ⛓️ **TapestryIdentityCard** — Refactored Tapestry section (same code, new position)

---

## Design System Compliance

✅ **Principle 1 (Color in Content):** No colored card backgrounds; color only on icons/badges
✅ **Principle 2 (One Semantic Role):** Gold = primary, Cyan = on-chain, Emerald = success
✅ **Principle 3 (Primary Metric Hero):** FS Score dominates Player Status card
✅ **Principle 6 (One Primary CTA):** Only one gold CTA per card
✅ **Principle 7 (No Gradient BGs):** All cards are flat `bg-gray-900/50 border-gray-800`
✅ **Principle 10 (Mobile First):** Designed at 375px, scales to 1024px+

All changes verified against `/docs/design/DESIGN_PRINCIPLES.md`.

---

## Mobile-First Design

### 375px (Phone)

```
BEFORE:
Header (70px)
  → Scroll to see Today's Actions (3 cards)
  → Scroll to see FS Score card
  → Scroll to see XP card
  → Scroll to see Quick Links (3 cards)
  → Scroll to see Tapestry (buried!)
Total: ~1,200px, users never see Tapestry

AFTER:
Header (40px) ← Compact
Player Status card (180px) ← No scroll needed
Tapestry card (180px) ← No scroll needed
Your Team card (180px) ← No scroll needed
Tabs
Total: ~600px, Tapestry visible immediately
```

**Result:** Users see key info on 1st screen without scrolling. Judges see Tapestry during demo walkthrough.

---

## Desktop Two-Column Layout

Left column (60%):
- Player Status (merged FS + XP)
- Your Team card

Right column (40%, sticky):
- Tapestry Identity (always visible, even while scrolling down)

**Why:** Judges see Tapestry immediately. Efficiently uses wide screens without making cards too wide.

---

## Implementation Plan

### Phase 1: Code Removal (1 hour)
- Delete `Today's Actions` section (lines 531-607)
- Delete `Quick Links` section (lines 647-695)
- Delete separate XP Card (lines 613-644)

### Phase 2: Component Creation (3-4 hours)
- Create `PlayerStatusCard.tsx` (merge FS + XP)
- Create `YourTeamCard.tsx` (show current team)
- Refactor `TapestryIdentityCard.tsx` (move up, same logic)

### Phase 3: Integration & Testing (2-3 hours)
- Update Profile.tsx to use new components
- Test at 375px, 768px, 1024px
- Verify Design Principles compliance
- Take Before/After screenshots

**Total: 6-8 hours**

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Users miss navigation | Low | Bottom nav covers all primary paths. Contextual prompts in modals. |
| XP feels hidden when merged | Low | Still visible, not competing visually. Users understand progress system. |
| Tapestry feels intrusive to new users | Very Low | Add brief label: "Your teams recorded on Solana." Explains value immediately. |
| Desktop layout too wide | Low | Set `max-w-4xl` container constraint. Test at multiple breakpoints. |

---

## Why This Matters (Hackathon Context)

**Foresight's differentiator:** We use **Tapestry Protocol** to permanently record teams and scores on Solana — immutable, verifiable, trustless.

**Current problem:** This key value prop is buried on the profile page. Judges have to scroll a lot to see it.

**This redesign fixes it:** Tapestry is front-and-center. Users see it immediately. Judges see it in the first 3 seconds of demo.

---

## Next Steps

1. **Review this doc** (5 min)
2. **Read detailed strategy** → `/docs/design/PROFILE_PAGE_REDESIGN.md` (15 min)
3. **Read Before/After comparison** → `/docs/design/PROFILE_REDESIGN_BEFORE_AFTER.md` (10 min)
4. **Get stakeholder approval** on section removal + Tapestry promotion
5. **Assign to engineer** (estimated 6-8 hours)
6. **Implement Phase 1-5** per `/docs/design/PROFILE_REDESIGN_QUICK_REFERENCE.md`
7. **Take screenshots** and compare before/after
8. **QA & iterate** (1 hour)

---

## Questions?

- **How will users navigate to contests?** → Bottom nav has "Compete" for contests/leaderboards
- **Where do Quests go?** → Either stay in bottom nav, or move to `/quests` page (later decision)
- **Will users still see their teams?** → Yes! "Teams" tab shows full list + edit UI (not changed)
- **Can users customize their profile picture?** → Currently no (silhouette). This redesign doesn't address, but recommends fixing.
- **How long does it take?** → 6-8 hours for engineer to implement, test, and polish

---

## Files Created

All strategy docs are in `/docs/design/`:

1. **PROFILE_PAGE_REDESIGN.md** (12K words)
   - Complete strategic analysis
   - Component specs, layout, wireframes
   - Implementation checklist
   - Design system compliance audit

2. **PROFILE_REDESIGN_QUICK_REFERENCE.md** (4K words)
   - Developer cheat sheet
   - What code to delete
   - What components to create
   - Testing checklist
   - Timeline breakdown

3. **PROFILE_REDESIGN_BEFORE_AFTER.md** (5K words)
   - Visual wireframe comparisons
   - Mobile 375px: before vs. after
   - Desktop 1024px: before vs. after
   - Color/typography compliance check
   - User flow comparison

---

## TL;DR for Busy People

**Current state:** Profile page has 5 sections, 6 redundant nav cards, and Tapestry buried at bottom.

**Fix:** 3 clean sections (Status → Proof → Team), remove nav cruft, promote Tapestry.

**Impact:** 50% less scrolling, clearer hierarchy, judges see key differentiator immediately.

**Time:** 6-8 hours to implement.

**Status:** Ready to code.

---

*Created: February 25, 2026 by Design Team*
*Ready for implementation review*
