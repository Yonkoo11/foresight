# Creator Leagues — MVP Implementation Checklist

> **Deadline:** Feb 27, 2026 (Today)
> **Scope:** Showable prototype + documentation for judges
> **Not Included:** Real Solana integration (Phase 2)

---

## BEFORE YOU START

Read these in order:
1. ✅ `CREATOR_LEAGUES_QUICK_REFERENCE.md` (5 min)
2. ✅ `CREATOR_LEAGUES_STRATEGY.md` (15 min)
3. ✅ `CREATOR_LEAGUES_TECHNICAL_SPEC.md` (10 min)

---

## IMPLEMENTATION TASKS

### Frontend: Creator League Teaser UI

**Task:** Add "Coming Soon" section to `/compete` page

**Checklist:**

- [ ] **Create component:** `frontend/src/components/CreatorLeagueTeaser.tsx`
  - [ ] Copy code from `TECHNICAL_SPEC.md` section 4.1
  - [ ] Verify imports (Mail, Star, Trophy, Phosphor icons)
  - [ ] Test email input validation
  - [ ] Ensure mobile responsive (375px width)
  - [ ] Run: `cd frontend && pnpm lint` → passes

- [ ] **Integrate into Compete page:** `frontend/src/pages/Compete.tsx`
  - [ ] Import component at top: `import CreatorLeagueTeaser from '../components/CreatorLeagueTeaser';`
  - [ ] Add below existing Signature Leagues carousel
  - [ ] Verify layout doesn't break existing sections
  - [ ] Test on mobile + desktop views

- [ ] **Styling check:**
  - [ ] Uses gold (#F59E0B) and cyan (#06B6D4) accents (no purple)
  - [ ] Dark background (#0A0A0F / #12121A)
  - [ ] Hover states work on touch (no hover-only interactions)
  - [ ] Spacing matches design system (8/12/16/24px increments)

- [ ] **Test on device:**
  - [ ] Open http://localhost:5173/compete
  - [ ] Scroll to "Coming Soon" section
  - [ ] Click email input → keyboard appears
  - [ ] Type email → button is enabled
  - [ ] Click "Join Waitlist" → confirmation message
  - [ ] Test on iPhone 12 simulator (375px width)

**Estimated Time:** 45 minutes

---

### Frontend: Create League Modal (Prototype)

**Task:** Build non-functional create league form

**Checklist:**

- [ ] **Create component:** `frontend/src/components/CreateLeagueModal.tsx`
  - [ ] Copy code from `TECHNICAL_SPEC.md` section 4.2
  - [ ] Verify imports (useState, X, Info icons)
  - [ ] Three steps: Form → Escrow Confirmation → Success
  - [ ] Run: `cd frontend && pnpm lint` → passes

- [ ] **Add to Compete page:**
  - [ ] Import: `import CreateLeagueModal from '../components/CreateLeagueModal';`
  - [ ] Add state: `const [showCreateModal, setShowCreateModal] = useState(false);`
  - [ ] Add modal JSX: `{showCreateModal && <CreateLeagueModal onClose={() => setShowCreateModal(false)} />}`
  - [ ] Add button to Teaser to trigger: `<button onClick={() => setShowCreateModal(true)}>Create League</button>`

- [ ] **Test flow:**
  - [ ] Open modal
  - [ ] Fill form: Name, Description, Prize, Fee, Duration
  - [ ] Click "Next: Fund Prize"
  - [ ] See escrow confirmation step
  - [ ] Click "Sign Solana TX" → success screen
  - [ ] Close modal → back to page
  - [ ] All three steps work without errors

**Estimated Time:** 30 minutes

---

### Backend: Database Schema Migration

**Task:** Create migration adding creator league fields

**Checklist:**

- [ ] **Create migration file:** `backend/migrations/20260227000000_add_creator_league_fields.ts`
  - [ ] Copy code from `TECHNICAL_SPEC.md` section 1.2
  - [ ] Filename matches timestamp pattern
  - [ ] Verify imports: `import type { Knex } from 'knex';`
  - [ ] Check `up()` and `down()` functions are symmetric

- [ ] **Test migration:**
  - [ ] Run: `cd backend && NODE_OPTIONS='--import tsx' pnpm exec knex migrate:latest`
  - [ ] Verify no errors in console
  - [ ] Verify columns added to `prized_contests`:
    ```bash
    sqlite3 foresight.db ".schema prized_contests" | grep creator
    ```
  - [ ] Verify indexes created:
    ```bash
    sqlite3 foresight.db "SELECT * FROM sqlite_master WHERE type='index' AND name LIKE '%creator%';"
    ```

- [ ] **Rollback test:**
  - [ ] Run: `cd backend && NODE_OPTIONS='--import tsx' pnpm exec knex migrate:rollback`
  - [ ] Verify columns removed
  - [ ] Run migration again to confirm it works

**Estimated Time:** 20 minutes

---

### Backend: Create League Service (Stub)

**Task:** Build service layer for league creation

**Checklist:**

- [ ] **Create file:** `backend/src/services/creatorLeagueService.ts`
  - [ ] Copy code from `TECHNICAL_SPEC.md` section 3.1
  - [ ] Verify all imports
  - [ ] Verify interface exports
  - [ ] Run: `cd backend && pnpm lint` → passes

- [ ] **Test compilation:**
  - [ ] Run: `cd backend && pnpm tsc --noEmit`
  - [ ] No TypeScript errors
  - [ ] All return types defined

**Estimated Time:** 15 minutes

---

### Backend: API Routes (Stubs)

**Task:** Create API endpoints (non-functional)

**Checklist:**

- [ ] **Create file:** `backend/src/api/creatorLeagues.ts`
  - [ ] Copy code from `TECHNICAL_SPEC.md` section 2
  - [ ] Implement all 5 endpoints as stubs (return mock data)
  - [ ] Verify req/res signatures
  - [ ] Add proper error handling (try/catch)
  - [ ] Run: `cd backend && pnpm lint` → passes

- [ ] **Register routes:** `backend/src/index.ts`
  - [ ] Import: `import creatorLeaguesRouter from './api/creatorLeagues';`
  - [ ] Add: `app.use('/api/v2/creator-leagues', creatorLeaguesRouter);`
  - [ ] Verify routes are registered

- [ ] **Test endpoints (manual):**
  - [ ] Start backend: `cd backend && NODE_OPTIONS='--import tsx' pnpm dev`
  - [ ] Test GET /api/v2/creator-leagues → returns mock array
  - [ ] Test POST /api/v2/creator-leagues/create → returns mock response
  - [ ] Verify 200 status codes

**Estimated Time:** 30 minutes

---

### Documentation

**Task:** Create product + tech specs

**Checklist:**

- [ ] **Strategy Document:** `docs/CREATOR_LEAGUES_STRATEGY.md`
  - [ ] ✅ Already created (5,000+ words)
  - [ ] Verify all sections present (1-14)
  - [ ] Proofread for typos/clarity
  - [ ] Add to git: `git add docs/CREATOR_LEAGUES_STRATEGY.md`

- [ ] **Quick Reference:** `docs/CREATOR_LEAGUES_QUICK_REFERENCE.md`
  - [ ] ✅ Already created (1,000+ words)
  - [ ] Covers all key points
  - [ ] Add to git: `git add docs/CREATOR_LEAGUES_QUICK_REFERENCE.md`

- [ ] **Technical Spec:** `docs/CREATOR_LEAGUES_TECHNICAL_SPEC.md`
  - [ ] ✅ Already created (3,000+ words)
  - [ ] All API endpoints defined
  - [ ] Database schema documented
  - [ ] Add to git: `git add docs/CREATOR_LEAGUES_TECHNICAL_SPEC.md`

- [ ] **Update main docs:**
  - [ ] `CLAUDE.md` → Add section under "Session History"
  - [ ] `README.md` → Mention Creator Leagues in roadmap (Phase 2)
  - [ ] `BUILD_CHECKLIST.md` → Note that Creator Leagues UX is coming

**Estimated Time:** 15 minutes (documentation already done)

---

### Screenshots & Verification

**Task:** Capture and verify UI changes

**Checklist:**

- [ ] **Before screenshot:** Current `/compete` page
  - [ ] Run: `./node_modules/.bin/tsx scripts/screenshot.ts /compete --full`
  - [ ] Save as `screenshots/compete-before.png`

- [ ] **Make all code changes** (above tasks)

- [ ] **After screenshot:** Updated `/compete` page with teaser
  - [ ] Run: `./node_modules/.bin/tsx scripts/screenshot.ts /compete --full`
  - [ ] Save as `screenshots/compete-after.png`
  - [ ] Compare before/after → teaser section visible

- [ ] **Mobile verification:**
  - [ ] Open http://localhost:5173/compete on iPhone 12 simulator
  - [ ] Scroll to teaser section
  - [ ] Verify it's readable and clickable (touch target ≥ 44px)
  - [ ] Try email input on mobile keyboard
  - [ ] Take screenshot: `screenshots/compete-mobile-teaser.png`

- [ ] **Desktop verification:**
  - [ ] Open http://localhost:5173/compete on desktop (1920x1080)
  - [ ] Verify teaser section centered and styled correctly
  - [ ] Click email input, type, submit
  - [ ] Success message appears

**Estimated Time:** 20 minutes

---

### Git Commit

**Task:** Commit all changes with clear message

**Checklist:**

- [ ] **Stage files:**
  ```bash
  cd /Users/mujeeb/foresight
  git add backend/migrations/20260227000000_add_creator_league_fields.ts
  git add backend/src/services/creatorLeagueService.ts
  git add backend/src/api/creatorLeagues.ts
  git add frontend/src/components/CreatorLeagueTeaser.tsx
  git add frontend/src/components/CreateLeagueModal.tsx
  git add frontend/src/pages/Compete.tsx
  git add docs/CREATOR_LEAGUES_STRATEGY.md
  git add docs/CREATOR_LEAGUES_QUICK_REFERENCE.md
  git add docs/CREATOR_LEAGUES_TECHNICAL_SPEC.md
  git add docs/CREATOR_LEAGUES_MVP_CHECKLIST.md
  git add screenshots/compete-before.png
  git add screenshots/compete-after.png
  ```

- [ ] **Verify staging:**
  ```bash
  git status
  # All new files should show as "new file:" in green
  ```

- [ ] **Commit:**
  ```bash
  git commit -m "feat: creator leagues MVP — showable prototype + full documentation"
  ```

- [ ] **Verify commit:**
  ```bash
  git log --oneline -1
  # Should show new commit
  ```

**Estimated Time:** 5 minutes

---

### Demo Prep

**Task:** Prepare presentation for judges

**Checklist:**

- [ ] **Talking points written:**
  - [ ] Headline: "Turn Your Followers Into Competitors"
  - [ ] Value props: 4-5 bullet points
  - [ ] Why it matters: Network effects, revenue, narrative
  - [ ] Timeline: MVP (today) → Full build (March)

- [ ] **Demo flow:**
  - [ ] Navigate to /compete page
  - [ ] Scroll to "Signature Leagues" (show CZ's Champions League)
  - [ ] Continue scrolling to "Coming Soon" teaser
  - [ ] Click "Join Waitlist" → show form submission
  - [ ] Point to Create League button (prototype) → show form
  - [ ] Walk through 3 steps: Form → Escrow → Success
  - [ ] Explain escrow flow (diagram on slide)

- [ ] **Slides prepared:**
  - [ ] Screenshot of `/compete` page with teaser
  - [ ] Architecture diagram (what changes, what doesn't)
  - [ ] Escrow flow diagram (3-5 boxes)
  - [ ] Revenue model (math showing $110K potential)
  - [ ] Timeline: MVP vs. Phase 2

- [ ] **Questions to prep for:**
  - [ ] "Why not let creators set scoring rules?" → Answer: Fairness, deterministic
  - [ ] "What if creators disappear?" → Answer: Escrow is Foresight-held
  - [ ] "How do you acquire creators?" → Answer: Early partnerships + influencer DMs
  - [ ] "How does this compare to DraftKings?" → Answer: Creator-owned, on-chain, viral

**Estimated Time:** 30 minutes

---

## TOTAL TIME ESTIMATE

| Task | Time | Status |
|------|------|--------|
| Frontend: Teaser UI | 45 min | 🔴 TODO |
| Frontend: Create Modal | 30 min | 🔴 TODO |
| Backend: Migration | 20 min | 🔴 TODO |
| Backend: Service | 15 min | 🔴 TODO |
| Backend: API Routes | 30 min | 🔴 TODO |
| Documentation | 15 min | ✅ DONE |
| Screenshots | 20 min | 🔴 TODO |
| Git Commit | 5 min | 🔴 TODO |
| Demo Prep | 30 min | 🔴 TODO |
| **TOTAL** | **3 hours** | |

---

## PARALLEL WORK (If Multiple People)

**Person 1 (Frontend):**
1. Create CreatorLeagueTeaser.tsx
2. Create CreateLeagueModal.tsx
3. Integrate both into Compete.tsx
4. Screenshots

**Person 2 (Backend):**
1. Create migration file + test it
2. Create creatorLeagueService.ts
3. Create creatorLeagues.ts API routes
4. Test endpoints with curl

**Person 3 (Docs/Demo):**
1. Finalize documentation
2. Create demo slides
3. Prepare talking points
4. Record quick video (30 sec)

---

## IF YOU'RE RUNNING OUT OF TIME

**Minimum MVP (1.5 hours):**
- ✅ Frontend: CreatorLeagueTeaser component only
- ✅ Integrate into /compete page
- ✅ Backend: Migration file (just creates columns, doesn't use them)
- ✅ Documentation (already done)
- ✅ Screenshots
- ✅ Commit to git

**Skip for Now (Phase 2):**
- ❌ CreateLeagueModal (prototype is nice-to-have)
- ❌ API routes (describe them in docs instead)
- ❌ Backend service file (can stub in code comments)

**Judge Impact:** Even the minimum version clearly communicates the vision and shows working UI.

---

## FINAL CHECKLIST (Before Demo)

- [ ] `/compete` page loads without errors
- [ ] "Coming Soon" section visible and styled
- [ ] Email form works (can submit)
- [ ] No console errors (open DevTools)
- [ ] Mobile responsive (test on iPhone 12 width)
- [ ] All docs updated in git
- [ ] Demo script written and practiced
- [ ] Slides prepared with screenshots
- [ ] Can explain escrow flow in 30 seconds
- [ ] Ready to answer judge questions

---

## SUCCESS CRITERIA

**MVP ships when all of these are true:**

✅ Frontend teaser is visible and functional on `/compete`
✅ Database schema migration exists and tested
✅ Documentation is complete and clear
✅ Can demo to judges in 2-3 minutes
✅ Code is committed to git
✅ No console errors or warnings
✅ Mobile experience is responsive
✅ Can explain network effects + revenue model

**If all ✅, you're done. Ship it.**

---

**Version:** 1.0
**Last Updated:** Feb 27, 2026, 11:00 UTC
**Status:** READY TO START BUILDING
