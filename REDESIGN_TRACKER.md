# Foresight Redesign Tracker

> **Goal:** Enterprise-level, CT-native product design. Thousands of daily users, revenue, retention.
> **Process:** See `.claude/rules/design-revamp.md` for the full protocol.
> **Standard:** Linear × Hyperliquid × Fantasy sports — precise, dark, data-dense, unique.

---

## Overall Status

```
Phase 0: Foundation & AI Slop Removal    ⏳ IN PROGRESS
Phase 1: Page-by-Page Redesign           ⬜ NOT STARTED
Phase 2: Cross-Page QA & Polish          ⬜ NOT STARTED
Phase 3: Mobile Pass                     ⬜ NOT STARTED
Phase 4: Production Deploy & Verify      ⬜ NOT STARTED
```

---

## Phase 0: Foundation (must complete before page work)

| Task | Status | Notes |
|------|--------|-------|
| Remove all neon glows from codebase | ⬜ | shadow-glow-neon, animate-pulse-neon-loop |
| Remove excessive neon-500 usage | ⬜ | Keep only Tapestry verified dot |
| Audit + fix full-width secondary buttons | ⬜ | Especially Draft page Auto-fill |
| Confirm design tokens in tailwind.config.js | ⬜ | Colors, font-mono, spacing |
| TypeScript clean check | ⬜ | npx tsc --noEmit |

---

## Phase 1: Page-by-Page Redesign

**Process for each:** User sends screenshot → CTO analyzes → Spec written → Implement → Screenshot after → User approves → ✅

| # | Page | Route | Status | Session | Notes |
|---|------|-------|--------|---------|-------|
| 1 | Home / Landing | `/` | ⬜ Pending | - | Hero, formation preview, how it works |
| 2 | Draft | `/draft` | ⬜ Pending | - | Influencer grid, budget panel, formation |
| 3 | Compete | `/compete` | ⬜ Pending | - | Contest list, leaderboard tabs |
| 4 | Contest Detail | `/contest/:id` | ⬜ Pending | - | Rules, prizes, leaderboard |
| 5 | Intel / Feed | `/feed` | ⬜ Pending | - | CT feed, highlights, rising stars |
| 6 | Profile | `/profile` | ⬜ Pending | - | Stats, career history, Tapestry |
| 7 | Progress | `/progress` | ⬜ Pending | - | Score, quests, history |
| 8 | Settings | `/settings` | ⬜ Pending | - | Account, notifications |

---

## Phase 2: Cross-Page QA

| Task | Status |
|------|--------|
| Button hierarchy consistent across all pages | ⬜ |
| Typography scale consistent | ⬜ |
| Color usage audit (no cyan leaks, gold discipline) | ⬜ |
| Loading/empty/error states on all data components | ⬜ |
| Navigation active states correct | ⬜ |

---

## Phase 3: Mobile Pass (375px)

| Page | Mobile Status |
|------|--------------|
| Home | ⬜ |
| Draft | ⬜ |
| Compete | ⬜ |
| Contest Detail | ⬜ |
| Intel / Feed | ⬜ |
| Profile | ⬜ |
| Progress | ⬜ |

---

## Design Decisions Log

_Record major decisions here so they persist across sessions._

| Date | Decision | Reasoning |
|------|----------|-----------|
| 2026-02-27 | Remove all neon glows | Off-brand, "AI slop", not unique to Foresight |
| 2026-02-27 | Gold = primary only, 1 per section | Authority signal, not decorative |
| 2026-02-27 | All numbers font-mono | Data-first aesthetic, CT traders expect this |
| 2026-02-27 | Ghost buttons for repeated actions | Reduces noise, premium feel |
| 2026-02-27 | Cyan reserved ONLY for A-tier badges | Visual hierarchy, meaningful color |

---

## Known Issues Backlog

_Things spotted during page work that need fixing:_

- [ ] Draft page: "Auto-fill" button is full-width when it shouldn't be
- [ ] Various pages: neon glows added in previous session need removal
- [ ] Influencer list: needs new CT-native roster after migration runs

---

## Session Log

| Date | Work Done | Pages Completed |
|------|-----------|----------------|
| 2026-02-27 | CI/CD fixed (Railway + Vercel native integration), migrations fix, structure setup | - |
