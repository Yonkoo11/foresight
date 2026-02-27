# Profile & Settings Feature Audit — Quick Reference

**Date:** February 25, 2026 | **Status:** COMPLETE | **Risk Level:** MEDIUM

## TL;DR

Profile & Settings pages have **4 major gaps** but most backends are **working**:

| Feature | Status | Impact | Effort | Fix |
|---------|--------|--------|--------|-----|
| **Daily quests show 0/3** | ❌ BUG | HIGH | 30 min | Change 3 lines to UTC |
| **Quests not displayed** | ❌ MISSING | HIGH | 1-1.5h | Add quest section to Settings |
| **Avatar upload** | ❌ NO UI | MED | 1.5h | Add file picker |
| **General settings** | ❌ MISSING | MED | 1-2h | Add sections |
| **Profile name edit** | ✅ WORKS | - | - | No change |
| **Team name edit** | ✅ WORKS | - | - | No change |
| **Twitter OAuth** | ✅ WORKS | - | - | No change |

---

## Critical Issues

### 1. TIMEZONE BUG - Quest Progress Shows 0/3

**File:** `backend/src/api/quests.ts` lines 58-66
**Root Cause:** Uses local timezone instead of UTC

```typescript
// BROKEN (lines 62-64):
const year = d.getFullYear();          // LOCAL timezone
const month = String(d.getMonth() + 1);
const day = String(d.getDate());

// FIXED:
const year = d.getUTCFullYear();       // UTC timezone
const month = String(d.getUTCMonth() + 1);
const day = String(d.getUTCDate());
```

**Why it breaks:**
- User in UTC-5 at 11 PM → local date is tomorrow
- Period lookup fails → quest shows progress 0 even if completed
- Affects every non-UTC user

**Time to fix:** 30 minutes (change 3 lines + test)

---

### 2. QUESTS INVISIBLE - No UI to Display Progress

**File:** `frontend/src/pages/Settings.tsx` (add new section)
**Root Cause:** Frontend doesn't fetch/render `/api/v2/quests` endpoint

Current state:
- Profile.tsx only fetches `summary` (counts only)
- Settings.tsx doesn't show quests anywhere
- Users can't see progress or claim rewards

**Fix:** Add quests section to Settings.tsx that:
1. Fetches `/api/v2/quests` (full endpoint)
2. Renders quests grouped by type
3. Shows progress bars, completion badges
4. Includes claim button

**Time to fix:** 1-1.5 hours

---

## Implementation Roadmap

### Phase 1: Critical (2 hours total)
- [ ] Fix timezone bug (30 mins)
- [ ] Add quests section to Settings (60 mins)
- [ ] Write & run tests (30 mins)

### Phase 2: Medium (3 hours)
- [ ] Add quest action triggers (3 hours)
  - browse_feed on /feed visit
  - check_scores on score view
  - follow_twitter on Twitter verify

### Phase 3: Polish (optional, 3 hours)
- [ ] Add avatar file upload (1.5 hours)
- [ ] Add general settings (1.5 hours)

---

## Files to Modify

### Backend
```
backend/src/api/quests.ts
  Lines 62-64: Change getFullYear/getMonth/getDate to UTC versions

backend/tests/api/quests.timezone.test.ts
  NEW: Test timezone handling
```

### Frontend
```
frontend/src/pages/Settings.tsx
  NEW: Add quests section above Twitter section

frontend/tests/pages/Settings.quests.test.tsx
  NEW: Test quest display component
```

---

## Test Plan (TDD)

### Backend Test: Timezone Bug
```bash
# Test that daily quests match correctly in different timezones
backend/tests/api/quests.timezone.test.ts

# Run: cd backend && pnpm test quests.timezone.test.ts
```

### Frontend Test: Quest Display
```bash
# Test that quests fetch and render correctly
frontend/tests/pages/Settings.quests.test.tsx

# Run: cd frontend && pnpm test Settings.quests.test.tsx
```

---

## Quick Wins

| Task | Time | Impact |
|------|------|--------|
| Fix timezone bug | 30 min | HIGH - enables quest tracking |
| Add quests section | 60 min | HIGH - shows progress to users |
| Both together | 90 min | CRITICAL for demo |

---

## What's Already Working ✅

- PATCH `/api/users/profile` — username, avatar URL, Twitter handle
- PATCH `/api/league/team/name` — team name updates
- GET `/api/auth/me` — user profile fetch
- GET `/api/twitter/*` — all Twitter OAuth flows
- Backend quest service — tracking works, just not visible
- Database — quest progress stored correctly

---

## Demo Readiness Check

Current status: **BLOCKED by quest visibility**

- [ ] Quests fetch correctly (blocked by timezone bug)
- [ ] Quests display on page (blocked by missing UI)
- [ ] Quests trigger on actions (action triggers incomplete)
- [ ] Quests claim rewards (not tested yet)
- [ ] Profile customization works (✅ ready)
- [ ] Settings page works (✅ mostly ready)

**Path to demo-ready:** Fix timezone bug + add quest UI = 2 hours work

---

## Full Audit Document

See `/Users/mujeeb/foresight/docs/PROFILE_SETTINGS_AUDIT.md` for:
- Detailed backend API analysis
- Frontend component breakdown
- Full test cases
- Timezone bug deep dive
- Complete implementation guide

---

## Contact Points

- **Backend quests:** `backend/src/api/quests.ts`
- **Backend profile:** `backend/src/api/users.ts`
- **Backend team:** `backend/src/api/league.ts`
- **Frontend profile:** `frontend/src/pages/Profile.tsx`
- **Frontend settings:** `frontend/src/pages/Settings.tsx`
- **Quest service:** `backend/src/services/questService.ts`
