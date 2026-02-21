# FORESIGHT BUILD CHECKLIST
**6-Day Sprint to Hackathon Launch**
**Target: February 27, 2026**

---

## PHASE 0: PRE-BUILD SETUP (Before Day 1)

### Dependencies
- [ ] Install Privy: `pnpm add @privy-io/react-auth @privy-io/server-auth`
- [ ] Install Tapestry: `pnpm add socialfi`
- [ ] Remove Wagmi: `pnpm remove wagmi ethers`
- [ ] Verify all packages installed: `pnpm install`

### Environment Setup
- [ ] Create `.env.local` in backend with:
  - `PRIVY_SECRET_KEY=...`
  - `TAPESTRY_API_KEY=...`
  - `TAPESTRY_BASE_URL=https://api.usetapestry.dev/v1`
  - `DATABASE_URL=...` (existing)
  - `TWITTER_API_IO_KEY=...` (existing)
- [ ] Create `.env.local` in frontend with:
  - `VITE_PRIVY_APP_ID=...`
  - `VITE_API_URL=http://localhost:3001`

### Git Setup
- [ ] Branch strategy: Work on `main`, tag each day's end: `git tag day-1-complete`
- [ ] Code review partner assigned
- [ ] Commit message format agreed: "feat|fix|refactor: description"

### Tools Ready
- [ ] Backend server starts: `cd backend && NODE_OPTIONS='--import tsx' pnpm dev`
- [ ] Frontend server starts: `cd frontend && pnpm dev`
- [ ] Database migrations work: `pnpm exec knex migrate:latest`
- [ ] Tests run: `pnpm test`

---

## DAY 1: AUTH & TAPESTRY FOUNDATION

### Status: START ⬜ | END ✅ | DEMO READY 🎬

**Goal:** Users can sign in with Solana wallet. Tapestry identity resolves.

### Morning (9am-1pm UTC)

#### Privy Auth Setup (1h)
- [ ] Update `backend/src/utils/auth.ts`:
  - Replace SIWE imports with Privy
  - Implement `verifyPrivyToken(token)` function
  - Test locally: should return valid user object
- [ ] Update `backend/src/api/auth.ts`:
  - New POST `/api/auth/verify` endpoint for Privy tokens
  - Response: `{ accessToken, refreshToken, user }`
- [ ] Commit: "feat: Privy auth backend"

#### Frontend Auth UI (2h)
- [ ] Create `frontend/src/pages/Login.tsx`:
  - Privy modal for wallet selection
  - "Sign with Solana" button
  - Error handling for rejected signatures
- [ ] Update `frontend/src/App.tsx`:
  - Wrap with Privy provider
  - Check token in localStorage on mount
- [ ] Test locally:
  - Click login → Privy modal appears ✓
  - Select wallet → Signature prompt ✓
  - Signed in → redirects to home ✓
- [ ] Commit: "feat: Privy auth frontend"

### Afternoon (1pm-5pm UTC)

#### Tapestry Service (2h)
- [ ] Create `backend/src/services/tapestryService.ts`:
  - `resolveUserIdentity(walletAddress)` → calls Tapestry API
  - `storeTeamOnTapestry(userId, team)` → placeholder
  - `storeScoreOnTapestry(userId, score)` → placeholder
  - Test each function with mock data
- [ ] Commit: "feat: Tapestry service scaffolding"

#### Database Migration (1h)
- [ ] Create migration file:
  - Add `users.tapestry_user_id` VARCHAR(255) UNIQUE
  - Add `users.auth_provider` VARCHAR(50)
- [ ] Run: `pnpm exec knex migrate:latest`
- [ ] Verify columns exist: `SELECT * FROM users LIMIT 1`
- [ ] Commit: "chore: Add Tapestry fields to users"

### Evening (5pm-7pm UTC)

#### QA Checklist
- [ ] Backend running without errors
- [ ] Frontend login page renders
- [ ] Can connect wallet via Privy
- [ ] User data saved to database
- [ ] Tapestry service resolves identity
- [ ] No console errors
- [ ] Push all commits

#### Demo Check
Can you:
- [ ] Sign in with Solana? YES/NO
- [ ] See your wallet on home page? YES/NO
- [ ] See your Tapestry ID in database? YES/NO

---

## DAY 2: DRAFT PAGE COMPLETE

### Status: START ⬜ | END ✅ | DEMO READY 🎬

**Goal:** Users can draft full 5-player teams. Formation visual. Budget works.

### Morning (9am-1pm UTC)

#### Schema Update (1h)
- [ ] Create migration:
  - Add `draft_teams.contest_id` INT FK to `prized_contests`
  - Change unique constraint from `user_id` to `(user_id, contest_id)`
- [ ] Run: `pnpm exec knex migrate:latest`
- [ ] Verify in database: `\d draft_teams`
- [ ] Commit: "chore: Update draft_teams schema"

#### Formation Component (2h)
- [ ] Create `frontend/src/components/draft/FormationTeam.tsx`:
  - Visual: 5 slots (Captain at top, 4 tiers below)
  - Show selected influencers with tier badges
  - Captain slot shows 1.5x multiplier icon
  - Click to remove/swap
  - Test: Can add 5 players ✓
- [ ] Commit: "feat: Formation team visual"

### Afternoon (1pm-5pm UTC)

#### Budget Counter (1h)
- [ ] Create `frontend/src/components/draft/BudgetCounter.tsx`:
  - Display: "42 / 150 pts left"
  - Real-time update on influencer select
  - Turn red if over budget
  - Prevent submit if over budget
  - Test: Budget updates correctly ✓

#### Influencer Grid (2h)
- [ ] Update `frontend/src/components/draft/InfluencerGrid.tsx`:
  - Group by tier: S (4) | A (16) | B (30) | C (50)
  - Show: avatar, name, price, engagement rate, current score
  - Virtualized scroll (use react-window or similar)
  - Click to select/remove
  - Test: Can select influencers ✓
- [ ] Commit: "feat: Budget counter and influencer grid"

#### Team Submission (1h)
- [ ] Update `frontend/src/pages/Draft.tsx`:
  - Submit button enabled only when: 5 players, valid tier distribution, under budget
  - Call `POST /api/league/team/create`
  - Handle response: toast notification + redirect to leaderboard
  - Test: Can submit team ✓
- [ ] Commit: "feat: Draft submission flow"

### Evening (5pm-7pm UTC)

#### QA Checklist
- [ ] Formation visual shows all 5 slots
- [ ] Can add/remove influencers
- [ ] Budget counter updates in real-time
- [ ] Submit button enables/disables correctly
- [ ] Team saves to database
- [ ] No console errors
- [ ] Mobile responsive? (at least readable)

#### Demo Check
Can you:
- [ ] See draft page? YES/NO
- [ ] Select captain? YES/NO
- [ ] Fill all 4 tiers? YES/NO
- [ ] See budget constraints? YES/NO
- [ ] Submit team? YES/NO
- [ ] See "Team locked" confirmation? YES/NO

---

## DAY 3: LEADERBOARD & AUTOMATION

### Status: START ⬜ | END ✅ | DEMO READY 🎬

**Goal:** Live leaderboard with real-time scoring. Contest lifecycle automated.

### Morning (9am-1pm UTC)

#### Scoring Cron (2h)
- [ ] Update `backend/src/services/cronJobs.ts`:
  - Schedule: Run every 6 hours (00, 06, 12, 18 UTC)
  - Call `fantasyScoringService.calculateWeeklyScores()`
  - For each contest: update all teams' scores
  - Save to `scoring_history` table
  - Log: "Scoring run at {time}: Updated {N} teams"
  - Test: Manually call, verify scores updated ✓
- [ ] Commit: "feat: Automated scoring cron"

#### Contest Lifecycle Cron (2h)
- [ ] Update `backend/src/services/cronJobs.ts`:
  - Monday 12:00 UTC: `createWeeklyContest()` - NEW contest, status=open
  - Friday 23:59 UTC: `lockContest()` - no new entries, status=locked
  - Sunday 23:59 UTC: `finalizeContest()` - scores locked, status=finalized
  - Every hour: check timestamps, transition states
  - Log each transition
  - Test: Simulate timestamps, verify transitions ✓
- [ ] Commit: "feat: Contest lifecycle automation"

### Afternoon (1pm-5pm UTC)

#### Leaderboard Component (2h)
- [ ] Create `frontend/src/components/leaderboard/LiveLeaderboard.tsx`:
  - Display top 10 with rankings (1st, 2nd, 3rd medals)
  - Show "You are 47th" highlighted row
  - Pagination/scroll for 50+ players
  - Click player → show team breakdown
  - Test: Renders correctly ✓
- [ ] Commit: "feat: Leaderboard component"

#### Live Updates (2h)
- [ ] Update `frontend/src/pages/Leaderboard.tsx`:
  - Fetch: `GET /api/league/leaderboard/:contestId`
  - Poll every 60 seconds: `GET /api/league/live-scoring`
  - UI updates without full page refresh
  - Show "Updated at 3:42 PM" timestamp
  - Badge: "7 new scores" if any updates
  - Test: Scores update every 60 seconds ✓
- [ ] Commit: "feat: Live leaderboard polling"

### Evening (5pm-7pm UTC)

#### QA Checklist
- [ ] Leaderboard loads with all players
- [ ] Your rank highlighted
- [ ] Scores polling every 60 seconds
- [ ] Ranking changes visible
- [ ] No performance issues (loads < 1 second)
- [ ] Contest state transitions work
- [ ] Cron job logs appear

#### Demo Check
Can you:
- [ ] See leaderboard? YES/NO
- [ ] See your rank? YES/NO
- [ ] See scores updating? YES/NO
- [ ] See "updated X min ago"? YES/NO
- [ ] Contest automated to next state? YES/NO

---

## DAY 4: CT FEED & CONTEST DETAIL

### Status: START ⬜ | END ✅ | DEMO READY 🎬

**Goal:** CT Feed with Tapestry metadata. Contest detail page. Teams stored on Tapestry.

### Morning (9am-1pm UTC)

#### CT Feed Backend (1h)
- [ ] Update `backend/src/services/ctFeedService.ts`:
  - Add Tapestry metadata to tweets: `properties: { game: "foresight", ... }`
  - Fetch top viral tweets (100K+ engagement)
  - Filter by user's team if needed
- [ ] Test: Tweets return with metadata ✓
- [ ] Commit: "feat: CT Feed Tapestry metadata"

#### CT Feed Frontend (2h)
- [ ] Update `frontend/src/pages/Feed.tsx` (rename from CTFeed):
  - Highlights carousel: Show top 5 viral tweets
  - Main feed: Infinite scroll of tweets
  - Tabs: All / My Team / Trending
  - Show: Avatar, name, tweet text, engagement (likes/retweets/replies)
  - Responsive design
  - Test: Can view feed ✓
- [ ] Commit: "feat: CT Feed page with highlights"

### Afternoon (1pm-5pm UTC)

#### Contest Detail Page (2h)
- [ ] Create `frontend/src/pages/ContestDetail.tsx`:
  - Show contest name, status, prize pool
  - Timeline: Open → Locked → Finalized (with dates)
  - Accordion: Scoring rules explained
  - Table: Prize distribution (top 10)
  - Button: [Join] or [View My Team] (if entered)
  - Test: All info displays ✓
- [ ] Commit: "feat: Contest detail page"

#### Tapestry Team Storage (1h)
- [ ] Update `backend/src/services/tapestryService.ts`:
  - Implement `storeTeamOnTapestry()` - POST to Tapestry API
  - Include: contest_id, picks array, captain_id, total_score
  - Handle errors gracefully
  - Test: Team stored successfully ✓
- [ ] Update team creation flow:
  - After `POST /api/league/team/create`, call Tapestry
  - Log: "Team stored on Tapestry"
- [ ] Commit: "feat: Store teams on Tapestry"

### Evening (5pm-7pm UTC)

#### QA Checklist
- [ ] CT Feed loads tweets
- [ ] Highlights show viral tweets
- [ ] Contest detail shows all info
- [ ] Prize breakdown calculated correctly
- [ ] Teams stored on Tapestry (verify via API)
- [ ] No errors on page load
- [ ] Mobile responsive

#### Demo Check
Can you:
- [ ] See CT Feed? YES/NO
- [ ] See highlights? YES/NO
- [ ] See contest details? YES/NO
- [ ] See prize breakdown? YES/NO
- [ ] Verify team on Tapestry? YES/NO

---

## DAY 5: PROFILE & POLISH

### Status: START ⬜ | END ✅ | DEMO READY 🎬

**Goal:** Profile page complete. All 6 pages done. Admin seeding working. Bug fixes.

### Morning (9am-1pm UTC)

#### Profile Page (2h)
- [ ] Create `frontend/src/pages/Profile.tsx`:
  - User card: wallet, joined date, Tapestry ID
  - Career stats: contests entered, winnings, best rank, avg rank, win rate
  - Weekly stats: current team, current rank, points
  - Achievements: badges (if any exist)
  - Settings: notifications toggle, visibility toggle, theme
  - Buttons: Edit profile, disconnect wallet
  - Test: All data displays ✓
- [ ] Commit: "feat: Profile page with stats"

#### Admin Seeding (2h)
- [ ] Create `backend/src/api/admin.ts` routes:
  - `POST /api/admin/seed-contest` - Create contest + dummy entries
  - `POST /api/admin/finalize-contest/:id` - Force finalize
  - `POST /api/admin/refresh-influencer-data` - Update influencer scores
  - Auth: Require `X-Admin-Token` header
  - Test: Can seed realistic data ✓
- [ ] Commit: "feat: Admin seeding endpoints"

### Afternoon (1pm-5pm UTC)

#### Routing Cleanup (1h)
- [ ] Delete unused page files:
  - `frontend/src/pages/Intel.tsx`
  - `frontend/src/pages/Quests.tsx`
  - `frontend/src/pages/Referrals.tsx`
  - `frontend/src/pages/Settings.tsx`
  - `frontend/src/pages/LeagueUltra.tsx`
- [ ] Update `frontend/src/App.tsx`:
  - Keep 6 routes only: Home, Draft, Leaderboard, ContestDetail, Feed, Profile
  - 301 redirect old URLs to home
- [ ] Remove unused API files (if any)
- [ ] Commit: "refactor: Remove unused pages and routes"

#### Bug Fixes & Polish (2h)
- [ ] Test all error states:
  - [ ] Loading spinners appear (not flash)
  - [ ] Error messages helpful
  - [ ] Empty states show CTAs
  - [ ] Form validation works
- [ ] Mobile responsiveness:
  - [ ] Test on 375px width
  - [ ] Test on 768px width
  - [ ] Test on 1920px width
  - [ ] No horizontal scroll
- [ ] Accessibility:
  - [ ] Buttons have focus states
  - [ ] Colors have sufficient contrast
  - [ ] Forms have labels
- [ ] Performance:
  - [ ] Home loads < 2 seconds
  - [ ] Leaderboard loads < 1 second
  - [ ] No "Forced reflow" warnings in DevTools
- [ ] Commit: "fix: UI polish and mobile responsiveness"

### Evening (5pm-7pm UTC)

#### QA Checklist
- [ ] Profile shows all stats
- [ ] All 6 pages navigate smoothly
- [ ] Admin seeding creates realistic data
- [ ] No 404 errors from deleted pages
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable

#### Demo Check
Can you:
- [ ] Navigate all 6 pages? YES/NO
- [ ] See profile stats? YES/NO
- [ ] Seed demo data? YES/NO
- [ ] No broken links? YES/NO

---

## DAY 6: TESTING & LAUNCH PREP

### Status: START ⬜ | END ✅ | READY FOR JUDGING 🎬

**Goal:** Live MVP with realistic data. Demo video recorded. Final testing.

### Morning (9am-1pm UTC)

#### Seed Production Data (1h)
- [ ] Create realistic demo dataset:
  - 1 active contest (status=open or scoring)
  - 50 user entries with varied teams
  - Top 10 have high scores (100-280 pts)
  - CT Feed populated with real tweets
  - Leaderboard shows realistic ranks
- [ ] Run: `node -r tsx/cjs src/scripts/seedHackathonData.ts`
- [ ] Verify data looks good in database
- [ ] Create your own test account with good rank (#7 is impressive)
- [ ] Commit: "demo: Seed production data"

#### Record Demo Video (1h)
- [ ] Script + structure (from SPEC section 12):
  - 0:00-0:30: Problem (SocialFi graveyard)
  - 0:30-2:15: Demo (4 screenshots, 26 sec each)
  - 2:15-3:00: Impact (Solana + Tapestry)
- [ ] Record using Loom or OBS:
  - Voiceover clear and energetic
  - Cursor visible, clickable areas highlighted
  - Background music (Epidemic Sound or free music)
  - Subtitles optional but helpful
- [ ] Upload to GitHub: `docs/DEMO_VIDEO_LINK.md`
- [ ] Commit: "demo: 3-minute hackathon video"

### Afternoon (1pm-5pm UTC)

#### Beta Testing (1h)
- [ ] Invite 5-10 friends to test:
  - Send them the app URL
  - Ask them to sign in + draft a team
  - Gather feedback: confusing? broken? fun?
  - Note any bugs
- [ ] Fix critical bugs immediately (same day)
- [ ] Log non-critical issues for future

#### Final Verification (1h)
- [ ] Comprehensive checklist:
  - [ ] Homepage loads (< 2 sec)
  - [ ] Can sign in with Solana
  - [ ] Can draft team (< 5 minutes total)
  - [ ] Leaderboard updates live
  - [ ] Scores visible + correct
  - [ ] Feed shows tweets
  - [ ] Contest detail shows rules
  - [ ] Profile shows stats
  - [ ] No console errors
  - [ ] Mobile responsive
  - [ ] Video uploaded and accessible
  - [ ] Repo clean (no secrets in code)
- [ ] Commit: "chore: Pre-launch final checks"

### Evening (5pm-7pm UTC)

#### Deployment & Buffer (2h)
- [ ] Test on staging environment
- [ ] Database backups taken
- [ ] Cron jobs running
- [ ] Monitor logs for errors
- [ ] If issues found: fix immediately
- [ ] Ensure team has deployment instructions

#### Demo Rehearsal (1h)
- [ ] Practice 3-minute pitch:
  - [ ] Can explain in < 3 minutes
  - [ ] Have backup answers for judge questions
  - [ ] Know your score formula
  - [ ] Know why Tapestry matters
  - [ ] Know what's MVP vs Phase 2

#### Final Commits
- [ ] `git tag day-6-complete`
- [ ] `git log --oneline -20` (verify all commits)
- [ ] No uncommitted changes: `git status` (should be clean)

---

## DAILY STANDUP TEMPLATE

**Each morning at 9am UTC:**

```
YESTERDAY:
- ✅ Completed: [list of checkboxes checked]
- ❌ Blocked by: [any issues]
- 🔧 In progress: [what's current focus]

TODAY:
- [ ] Task 1 (Est: 2h)
- [ ] Task 2 (Est: 3h)
- [ ] Task 3 (Est: 2h)

RISKS:
- Risk: [describe]
  → Mitigation: [how we handle it]
```

---

## EMERGENCY PROCEDURES

### If Privy Auth Breaks
**Fallback:** Use test wallets (hardcoded list)
```typescript
const TEST_WALLETS = [
  '0xtest1...0001',
  '0xtest2...0002',
  // ... 10 more
];
```

### If Tapestry API Down
**Fallback:** Mock responses, store locally
```typescript
// If Tapestry unreachable, log and continue
try {
  await storeTeamOnTapestry(...);
} catch (error) {
  console.warn('Tapestry API down, proceeding with local storage');
}
```

### If Database Crashes
**Recovery:** Have backup snapshot ready
```bash
pg_dump -d foresight > backup_day5.sql
```

### If Scoring Cron Fails
**Manual Fix:** Run scoring manually
```bash
node -r tsx/cjs backend/src/scripts/runScoringNow.ts
```

---

## SUCCESS CRITERIA

At end of Day 6, you should have:

- ✅ All 6 pages built and working
- ✅ Users can sign in (Privy auth)
- ✅ Users can draft teams (formation visual + budget)
- ✅ Leaderboard shows live scores (polling every 60 sec)
- ✅ CT Feed shows tweets from top 100 influencers
- ✅ Teams stored on Tapestry (verified)
- ✅ Contest lifecycle automated
- ✅ Demo data seeded (50+ entries, realistic scores)
- ✅ 3-minute demo video recorded and uploaded
- ✅ Zero console errors
- ✅ Mobile responsive
- ✅ No secrets in code

---

**Status:** Ready for implementation
**Print this checklist** - Post at your desk
**Reference daily** - Check off items as completed
**Ask if blocked** - Escalate immediately if stuck

🚀 **Let's ship this MVP and resurrect SocialFi on Solana** 🚀
