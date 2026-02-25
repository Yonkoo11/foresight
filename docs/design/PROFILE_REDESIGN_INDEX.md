# Profile Page Redesign — Complete Documentation Index

> **Quick Navigation:** All redesign docs with descriptions
> **Status:** Ready for implementation (all strategy complete)
> **Last Updated:** February 25, 2026

---

## Documents (Read in This Order)

### 1. START HERE: Executive Summary (5 min read)
**File:** `/PROFILE_REDESIGN_SUMMARY.md`

Quick overview of:
- The problem (5 sections, redundancy, Tapestry buried)
- The solution (3 clean sections, promote Tapestry)
- Key metrics (50% less scrolling, clearer hierarchy)
- Implementation timeline (6-8 hours)
- Risk assessment
- Why it matters for the hackathon

**Use this for:** Getting buy-in from leadership, quick reference.

---

### 2. STRATEGY: Complete Design Analysis (20 min read)
**File:** `/docs/design/PROFILE_PAGE_REDESIGN.md`

Comprehensive document including:
- Detailed problem statement (8 specific pain points)
- Proposed redesign with visual structure
- ASCII wireframes for mobile + desktop
- Three new card components (PlayerStatus, YourTeam, Tapestry)
- Mobile-first layout (375px → 1024px)
- What gets removed and why
- Implementation checklist (Phase 1-5)
- Expected improvements
- Risk mitigation table
- Design system compliance audit

**Use this for:** Understanding the full strategy, getting detailed specs, referring during implementation.

---

### 3. DEVELOPER CHEAT SHEET (10 min read)
**File:** `/docs/design/PROFILE_REDESIGN_QUICK_REFERENCE.md`

Hands-on guide for engineers including:
- What's changing (table format)
- New component structure (quick wireframes)
- Code to delete (file paths + line numbers)
- Code to create (component names, file locations)
- Styling guidelines (Tailwind classes)
- Mobile breakpoints
- Testing checklist
- Timeline breakdown (6 hours total)
- Removed components/code cleanup

**Use this for:** During implementation, reference while coding, cross-check against requirements.

---

### 4. BEFORE/AFTER COMPARISON (15 min read)
**File:** `/docs/design/PROFILE_REDESIGN_BEFORE_AFTER.md`

Visual comparisons including:
- Mobile 375px: Before vs. After wireframes
- Desktop 1024px: Before vs. After wireframes
- User flow comparison (current vs. proposed)
- Design system compliance checklist
- Implementation checklist
- Quick wins vs. time-intensive work

**Use this for:** Stakeholder meetings, explaining the change visually, verification after implementation.

---

### 5. COMPONENT SPECIFICATIONS (25 min read)
**File:** `/docs/design/PROFILE_COMPONENT_SPECS.md`

Exact technical specs for all three new components:

#### PlayerStatusCard
- Props (TypeScript interface)
- Layout (with wireframe)
- Styling (all Tailwind classes)
- Boost indicator logic
- Progress bar implementation
- Button group layout
- Color decisions

#### YourTeamCard
- Props interface
- Two layouts (with team vs. empty state)
- Formation visual integration
- Budget progress bar
- Button actions

#### TapestryIdentityCard
- Refactoring existing component
- New header with "Live on Solana" badge
- Social counts layout
- Proof message logic
- Identity footer with links
- All color notes

Plus:
- General rules (spacing, responsive, touch targets, transitions, anti-patterns)
- Testing checklist per component
- Integration example (how to use in Profile.tsx)

**Use this for:** When writing actual code, copy styling classes, validate prop types.

---

## Document Dependency Map

```
START: Read PROFILE_REDESIGN_SUMMARY.md (5 min)
  ↓
GET APPROVAL: Share with PM/design leads
  ↓
UNDERSTAND: Read PROFILE_PAGE_REDESIGN.md (20 min) ← Full strategy
  ↓
PLAN: Read PROFILE_REDESIGN_QUICK_REFERENCE.md (10 min) ← Developer checklist
  ↓
CODE: Reference PROFILE_COMPONENT_SPECS.md (copy-paste ready)
  ↓
VERIFY: Compare using PROFILE_REDESIGN_BEFORE_AFTER.md (check mobile/desktop)
  ↓
DONE: Update CLAUDE.md with completion notes
```

---

## File Locations

### Project Root
- `/PROFILE_REDESIGN_SUMMARY.md` ← Start here

### Documentation
```
/docs/design/
├── PROFILE_PAGE_REDESIGN.md              ← Full strategy (12K words)
├── PROFILE_REDESIGN_QUICK_REFERENCE.md   ← Dev cheat sheet (4K words)
├── PROFILE_REDESIGN_BEFORE_AFTER.md      ← Visual comparisons (5K words)
├── PROFILE_COMPONENT_SPECS.md            ← Component specs (6K words)
├── PROFILE_REDESIGN_INDEX.md             ← This file
├── DESIGN_PRINCIPLES.md                  ← Reference (all redesign follows this)
└── ...other design docs...
```

---

## Quick Reference: What Changes

### Removed
- ❌ "Today's Actions" section (3 nav cards)
- ❌ "Quick Links" section (3 nav cards)
- ❌ Separate "Experience Level" card

### Added
- ✅ **PlayerStatusCard** — Merge FS Score + XP
- ✅ **YourTeamCard** — Show current team or "Start drafting"
- ✅ **TapestryIdentityCard** — Refactored (same logic, new position)

### Moved
- ⬆️ Tapestry → From bottom to position #2 (immediately visible)

### Net Result
- 5 sections → 3 sections
- 1,200px scroll height → 600px (50% reduction)
- Competing color focus → Single focal point
- Tapestry buried → Tapestry prominent

---

## Implementation Timeline

| Phase | Time | Details |
|-------|------|---------|
| Review & Approval | 30 min | Share summary with stakeholders |
| Planning | 30 min | Read quick reference, plan components |
| Code Removal | 1 hour | Delete Today's Actions, Quick Links, old XP card |
| Component Creation | 3-4 hours | Build PlayerStatusCard, YourTeamCard, refactor Tapestry |
| Integration & Test | 2-3 hours | Update Profile.tsx, test mobile/tablet/desktop |
| Screenshots & QA | 1 hour | Before/after comparison, polish |
| **Total** | **8 hours** | Ready to merge |

---

## Design System Compliance

All changes follow `/docs/design/DESIGN_PRINCIPLES.md`:

✅ Principle 1: Color in content, not chrome (no colored card backgrounds)
✅ Principle 2: One semantic role per color (gold, cyan, emerald)
✅ Principle 3: Primary metric is visual hero (FS Score dominates)
✅ Principle 6: One primary CTA per context (only 1 gold button per card)
✅ Principle 7: No gradient backgrounds on cards (flat colors)
✅ Principle 10: Mobile-first design (375px → 1024px)

Full compliance audit in PROFILE_PAGE_REDESIGN.md (Appendix).

---

## Key Success Metrics

### User Experience
- [ ] Profile page tells clear story in 3 sections
- [ ] No competing visual focus (one focal point per card)
- [ ] Tapestry visible on first screen (mobile + desktop)
- [ ] Mobile: 3 full cards visible without scrolling

### Performance
- [ ] Vertical scroll height reduced by 50%
- [ ] Redundant navigation removed (nav cards gone)
- [ ] Faster cognitive load (fewer sections to parse)

### Design System
- [ ] No purple/violet colors
- [ ] No gradient card backgrounds
- [ ] All colors semantic (meaningful, not decorative)
- [ ] Spacing consistent (6/12/24px grid)
- [ ] Typography hierarchy clear

### Hackathon Context
- [ ] Tapestry Protocol prominently featured (position #2)
- [ ] Judges see on-chain proof early in demo walkthrough
- [ ] Clear message: "Your teams recorded on Solana"

---

## FAQs

**Q: Where do users navigate to contests now?**
A: Bottom nav "Compete" covers contests/leaderboards. No change needed.

**Q: What happens to Daily Quests?**
A: Either stays in bottom nav or moves to `/quests` page (later decision). Not on profile.

**Q: Will users still see their teams?**
A: Yes! "Teams" tab shows full list + edit UI (unchanged).

**Q: Can users upload profile pictures?**
A: Currently no. This redesign doesn't address it, but recommends adding later.

**Q: How long does implementation really take?**
A: 6-8 hours for experienced React dev. 3-4 hours if most components created cleanly.

**Q: What if we need to add a section later?**
A: Easy to add below Tapestry/Team cards. Space is there (structure allows it).

**Q: Is this mobile-only?**
A: No, designed for mobile-first (375px) but scales beautifully to desktop (1024px+).

**Q: Will this break existing tests?**
A: Check `/frontend/tests/pages/Profile.test.tsx` for snapshot tests. Update after implementation.

---

## Decision Log

### Why consolidate FS Score + XP?
Both show player progression. Separate cards waste real estate and confuse mental model. Merged card is clearer: score is primary, XP is secondary progression context.

### Why move Tapestry up?
- It's our hackathon differentiator
- Currently buried (users scroll past)
- Judges need to see it early
- Position #2 is after "Who am I" (Player Status) but before "What did I do" (Teams)

### Why remove nav cards?
Bottom nav already covers all destinations. Removing reduces cognitive load and clarifies that profile answers "Who am I?" not "Where should I go?"

### Why keep Teams tab?
Users need to see full history + edit teams. That stays in tabs (not Overview). This shows current team only.

---

## Next Steps

1. **Share PROFILE_REDESIGN_SUMMARY.md** with stakeholders (5 min read)
2. **Get approval** on scope (remove 6 cards, consolidate FS+XP, promote Tapestry)
3. **Assign to frontend engineer** (6-8 hours capacity needed)
4. **Follow PROFILE_REDESIGN_QUICK_REFERENCE.md** during implementation
5. **Use PROFILE_COMPONENT_SPECS.md** for exact code specs
6. **Verify with PROFILE_REDESIGN_BEFORE_AFTER.md** (mobile + desktop screenshots)
7. **Update CLAUDE.md** with completion notes

---

## Support & Questions

If you have questions while implementing:
1. **For strategy questions:** Reference PROFILE_PAGE_REDESIGN.md
2. **For code questions:** Reference PROFILE_COMPONENT_SPECS.md
3. **For design questions:** Reference DESIGN_PRINCIPLES.md
4. **For verification:** Reference PROFILE_REDESIGN_BEFORE_AFTER.md

All questions should be answerable from these docs. If not, add notes here.

---

## Appendix: Related Documents

Also helpful:
- `/docs/design/DESIGN_PRINCIPLES.md` — Core design rules (read before coding)
- `/docs/design/DESIGN_TOKENS.md` — Color palette, typography, spacing
- `/docs/design/SOCIAL_FEATURES_UX_SPEC.md` — Future social features on profile
- `/CLAUDE.md` — Project overview and memory system

---

**Ready to implement. All docs complete. Good luck!**

*Created: February 25, 2026*
*Status: Ready for development*
