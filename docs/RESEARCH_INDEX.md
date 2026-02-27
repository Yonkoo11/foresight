# Foresight UX Research: Complete Index (Feb 27, 2026)

> **What:** Three comprehensive research documents with 15 validated insights
> **Why:** To design Foresight so CT power users respect it, fantasy players come back daily, and judges see a shipping product
> **Status:** ✅ Complete and ready for implementation

---

## Start Here

**Role** | **Document** | **Purpose** | **Time**
---|---|---|---
Implementing a feature | [`UX_QUICK_REFERENCE_BATTLE_GUIDE.md`](./UX_QUICK_REFERENCE_BATTLE_GUIDE.md) | Daily reference: type scale, colors, animations, checklists | 10 min read
Understanding the research | [`UX_RESEARCH_COMPETITIVE_AUDIT_2026.md`](./UX_RESEARCH_COMPETITIVE_AUDIT_2026.md) | Full research + 15 insights + implementation roadmap | 30 min read
Reporting to leadership | [`RESEARCH_EXECUTIVE_SUMMARY.md`](./RESEARCH_EXECUTIVE_SUMMARY.md) | 3-bullet summary, metrics to track, next steps | 10 min read

---

## The Three Research Areas

### Area 1: CT-Native Product Aesthetics
**Question:** What makes Crypto Twitter power users respect design vs. dismiss it as "AI slop"?

**Key Findings:**
- Minimalism + precision = trust (Hyperliquid, Orca, Photon all restrained)
- Authenticity beats beauty (show real data, demystify mechanics)
- Dark theme needs off-black + off-white (not pure extremes)
- CT users hate engagement farming (artificial urgency, phantom notifications, jargon)
- Consistent secondary colors = premium feel (lock to gold + cyan)

**For Foresight:**
- ✅ Remove decorative colors, use gray for chrome
- ✅ Show real scoring methodology (Activity, Engagement, Growth, Viral visible)
- ✅ Use monospace ONLY for scores/ranks/amounts
- ✅ Plain language copy, no fake hype
- ✅ Remove purple from everywhere

**Documents:**
- Full analysis: `UX_RESEARCH_COMPETITIVE_AUDIT_2026.md` (Area 1, page 1-5)
- Quick reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` (Color Semantics section)

---

### Area 2: Fantasy Sports Retention & Habit Loops
**Question:** Why do players come back daily to DraftKings, Sleeper, Underdog? How do we replicate that?

**Key Findings:**
- Real streaks create 2.3x engagement lift (Duolingo data — but must be REAL, tied to performance)
- Real-time score updates increase session time by 15% (critical: <3 seconds, 150-200ms animations)
- Leaderboard tipping point at 500 users (social comparison turns negative without tier boards)
- Notification strategy matters: one per milestone, customizable timing, never >3/week
- Team formation visual (drag-and-drop) creates sunk cost fallacy (9+ minute sessions vs. 4 minutes for forms)

**For Foresight:**
- ✅ Contest-based streaks (real: top 100 performance, not daily login)
- ✅ Implement `scoreFlash` animation (150-200ms gold glow)
- ✅ Tier leaderboards at 500+ users (S-tier, A-tier, B-tier, C-tier zones)
- ✅ Notifications: contest results, major rank shifts, streak milestones only
- ✅ Formation visual as draft page hero (65%+ viewport on mobile)

**Documents:**
- Full analysis: `UX_RESEARCH_COMPETITIVE_AUDIT_2026.md` (Area 2, page 6-11)
- Psychology deep-dive: `BEHAVIORAL_PSYCHOLOGY_SOCIAL_FEATURES.md` (related, in repo)
- Quick reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` (Leaderboard template, Streak design)

---

### Area 3: Enterprise SaaS Dark-Theme Design
**Question:** How do Linear, Vercel, and modern SaaS show lots of data without overwhelming users?

**Key Findings:**
- Typography discipline creates simplicity (6-8 type sizes locked, never improvised)
- Elevation through light backgrounds, not shadows (off-black base → gray-900 → gray-800)
- Empty states teach, not apologize (reason + next action + gold CTA on every empty view)
- Real-time data streams need visual feedback (timestamp, pulse animation, live indicator)
- Information density scales with context (bento grid layout, varied card sizes, whitespace)

**For Foresight:**
- ✅ Lock 6 type sizes: 48px hero, 24px section, 18px card title, 14px body, 12px caption, monospace data
- ✅ Remove drop-shadows, use elevation (lighter backgrounds)
- ✅ Design empty states for all 6 pages
- ✅ Add timestamps to live data ("Updated 30s ago")
- ✅ Use bento grid (varied card sizes on dashboard)

**Documents:**
- Full analysis: `UX_RESEARCH_COMPETITIVE_AUDIT_2026.md` (Area 3, page 12-17)
- Quick reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` (Type scale, Mobile-First checklist)

---

## Implementation Roadmap

### Phase 1: Design Audit (Monday-Tuesday, ~4 hours)
Priority: High (unblocks all subsequent work)

**Tasks:**
- [ ] Audit codebase for color usage: find all colors, lock to gold + cyan only
- [ ] Remove purple from everywhere (search for `purple`, `violet`, `indigo`)
- [ ] Create type scale table and identify all deviations (target: 6-8 sizes)
- [ ] Design empty states for all 6 pages (use template in battle guide)
- [ ] Test dark theme contrast on extended viewing (real eyes, 10+ minutes)

**Reference:** `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Color Semantics + Type Scale Locked

---

### Phase 2: Animation + Real-Time (Wednesday-Thursday, ~6 hours)
Priority: High (improves engagement significantly)

**Tasks:**
- [ ] Implement `scoreFlash` animation on leaderboard scores (150-200ms gold glow)
- [ ] Add timestamp to leaderboard rows ("Updated 30s ago", refreshes every 1s)
- [ ] Verify leaderboard update cadence (should be 30-60s, predictable)
- [ ] Test animations on mid-range Android (60fps minimum, no jank)
- [ ] Implement live indicator dot (gold, appears on updates <5s old)

**Reference:** `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Animation Rules + Score Update Animation code example

---

### Phase 3: Copy + UX Polish (Friday, ~4 hours)
Priority: Medium (credibility boost)

**Tasks:**
- [ ] Copy audit: remove jargon, use plain language everywhere
- [ ] Define notification strategy (document which events trigger push notifications)
- [ ] Verify team formation UX: drag-and-drop on desktop, tap-and-confirm on mobile
- [ ] Real-time budget feedback as users draft
- [ ] Design comparison view (my team vs. friend's team, side-by-side)

**Reference:** `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Copy Audit Checklist

---

### Phase 4 (Post-Launch Roadmap): Engagement Features
Priority: Low (post-MVP, measure engagement first)

**Tasks:**
- [ ] Implement real streaks (tied to contest performance, unlock VIP perks)
- [ ] Create tier-based leaderboards (S, A, B, C tiers)
- [ ] Design streak milestone notifications
- [ ] A/B test different notification timing strategies
- [ ] Implement comparison view (drive multi-team drafting)

**Metrics to track:**
- DAU/MAU ratio (target: >20%)
- Contest streak retention (users completing 3+ consecutive contests)
- Leaderboard engagement (% checking within 30s of update)
- Session length (target: +15% from real-time updates)
- Notification opt-in (target: >70%)

---

## Key Documents Reference

### Core Research
- **`UX_RESEARCH_COMPETITIVE_AUDIT_2026.md`** — Complete audit, 15 insights, implementation roadmap
  - Area 1: CT aesthetics (5 insights)
  - Area 2: Fantasy retention (5 insights)
  - Area 3: SaaS dark theme (5 insights)
  - Implementation roadmap (4 phases)

### Quick Reference for Devs
- **`UX_QUICK_REFERENCE_BATTLE_GUIDE.md`** — Daily reference (print this)
  - Vibe checklist
  - Type scale (locked 6 sizes)
  - Color semantics (gold, cyan, emerald, rose)
  - Leaderboard template
  - Animation rules
  - Empty states formula
  - Real-time data indicators
  - Mobile-first checklist
  - Common mistakes & fixes

### Leadership Brief
- **`RESEARCH_EXECUTIVE_SUMMARY.md`** — Executive summary
  - 3-bullet TL;DR
  - 15 insights synthesized
  - Implementation roadmap
  - Competitive benchmarks
  - What we're NOT doing (and why)
  - Metrics to track

### Related Design Docs
- **`docs/design/DESIGN_PRINCIPLES.md`** — Visual law (non-negotiable)
  - Color in content, not chrome
  - One semantic role per color
  - Primary metrics are visual heroes
  - Repeated actions whisper
  - Destructive actions hidden until hover
  - One primary action per context
  - No gradient backgrounds on cards
  - Hover is reveal, not repaint
  - Subtle animation only
  - Mobile first, always

---

## How to Use This Research

### For Product Managers
1. Read `RESEARCH_EXECUTIVE_SUMMARY.md` (10 min)
2. Review "What we're NOT doing" section (ensure alignment)
3. Track the 7 metrics post-launch
4. Use phase roadmap to allocate time

### For Designers
1. Print `UX_QUICK_REFERENCE_BATTLE_GUIDE.md`
2. Read `UX_RESEARCH_COMPETITIVE_AUDIT_2026.md` (reference section)
3. Before any design decision: check battle guide, then design principles
4. Use competitive benchmarks when stuck

### For Frontend Engineers
1. Print `UX_QUICK_REFERENCE_BATTLE_GUIDE.md`
2. Follow type scale locked (6 sizes only)
3. Use color semantics table (copy-paste)
4. Implement animations as specified (150-300ms only)
5. Test on mobile before shipping
6. Use pre-shipping checklist (10 items)

### For QA/Testing
1. Use mobile-first checklist (8 items)
2. Test animations on mid-range Android (60fps)
3. Verify dark theme contrast on extended viewing
4. Check empty states exist on all 6 pages
5. Verify timestamps update on real-time data

---

## Quick Decision Checklist

Before adding ANY feature or design element, ask:

1. **Is this color semantic or decorative?**
   - Semantic: gold, cyan, emerald, rose (locked meanings)
   - Decorative: remove or use gray
   - Reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Color Semantics

2. **Does this use one of the 6 locked type sizes?**
   - 48px hero, 24px section, 18px card, 14px body, 12px caption, monospace data
   - Reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Type Scale Locked

3. **Is this animation 150-300ms?**
   - Anything slower feels slow
   - Reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Animation Rules

4. **Does this work at 375px with touch?**
   - Test on actual phone before shipping
   - Reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Mobile-First Checklist

5. **Would a CT power user respect this?**
   - Ask: Would Hyperliquid, Orca, or Photon do this?
   - Reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Competitive Benchmarks

6. **Is this authentic or trying too hard?**
   - No confetti, no fake hype, no AI slop tells
   - Reference: `UX_RESEARCH_COMPETITIVE_AUDIT_2026.md` → Area 1

7. **Are there empty states designed for this view?**
   - Every page/section needs designed empty state
   - Reference: `UX_QUICK_REFERENCE_BATTLE_GUIDE.md` → Empty States Template

---

## Validation & Sources

All insights are based on research from:
- Competitive analysis of 20+ crypto/fantasy/SaaS products
- Behavioral psychology research (Fogg, Duolingo, DraftKings data)
- Web search Feb 27, 2026
- Existing internal docs (Design Principles, Psychology analysis)

See `UX_RESEARCH_COMPETITIVE_AUDIT_2026.md` for full source list and citations.

---

## Questions?

**"Should I add this color?"** → Color Semantics table in battle guide
**"How should this animate?"** → Animation Rules in battle guide
**"What size should this type be?"** → Type Scale Locked in battle guide
**"Why can't I use X?"** → Check "What we're NOT doing" in executive summary
**"How do I know this is right?"** → Run pre-shipping checklist (10 items)

---

**Last updated:** February 27, 2026, 21:15 UTC
**Status:** Ready for implementation
**Next action:** Phase 1 (Design Audit) begins Monday
