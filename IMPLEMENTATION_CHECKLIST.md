# FORESIGHT — TACTICAL IMPLEMENTATION CHECKLIST
## Day-by-Day Execution Plan for 5-Day Sprint

**Start Date:** Monday, February 24, 2026
**Target Ship Date:** Friday, February 28, 2026 (Submission deadline)

---

## ⚙️ PRE-SPRINT SETUP (Complete by Sunday EOD)

### Infrastructure Setup (2 Hours)
- [ ] Create Neon.tech account: https://neon.tech
- [ ] Create Railway.app account: https://railway.app (or Render.com)
- [ ] Create Vercel account: https://vercel.com
- [ ] Prepare foresight.gg domain credentials
- [ ] Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Tapestry Setup (1 Hour)
- [ ] Apply for Tapestry API key: https://www.usetapestry.dev
- [ ] Store key securely (1Password, LastPass, etc.)
- [ ] Read Tapestry docs: https://docs.usetapestry.dev (10 min)

### Team Alignment (1 Hour)
- [ ] Read CTO_TECHNICAL_ASSESSMENT.md (full team)
- [ ] Read CTO_EXECUTIVE_SUMMARY.md (leadership)
- [ ] Sync call: Confirm team capacity, assign leads
- [ ] Resolve any questions or concerns

### Development Environment (1 Hour)
- [ ] Pull latest main branch
- [ ] Verify local build: `npm install && npm run build` (both frontend + backend)
- [ ] Confirm database is seeded and running
- [ ] Test local demo: signup → draft → leaderboard

**By Sunday 6 PM: "Go" status confirmed. All three teams ready.**

---

## 📅 MONDAY, FEBRUARY 24 — CLEANUP DAY

**Goal:** Ship zero compiler errors, activate Tapestry API key
**Success Metric:** `npx tsc --noEmit` passes, Tapestry logs say "API key configured"

### Morning (9 AM - 12 PM): Package Cleanup

**Backend Lead:**
- [ ] Open `backend/package.json`
- [ ] Remove line: `"ethers": "^6.9.0"`
- [ ] Remove line: `"siwe": "^2.1.4"`
- [ ] Save file
- [ ] Run: `pnpm install` (removes from node_modules)
- [ ] Commit: "cleanup: remove ethers and siwe dependencies"

**Expected output:**
```bash
$ pnpm install
removed ethers@6.9.0
removed siwe@2.1.4
```

### Late Morning (12 PM - 2 PM): Remove EVM Code

**Backend Lead:**
- [ ] Open `backend/src/api/prizedContestsV2.ts`
- [ ] Find line 3: `import { ethers } from 'ethers';`
- [ ] Delete that line
- [ ] Find lines 35-45 (the `getV2Contract()` function)
- [ ] Delete entire function
- [ ] Find lines 20-31 (the `PRIZED_V2_CONTRACT_ABI` constant)
- [ ] Delete entire constant
- [ ] Save file
- [ ] Run: `npx tsc --noEmit` in backend folder
- [ ] Should report 0 errors
- [ ] Commit: "cleanup: remove ethers imports from prizedContestsV2"

**Check file structure:**
```typescript
// ✅ GOOD - Only Express types and service imports remain
import { Router, Request, Response } from 'express';
import db from '../utils/db';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import foresightScoreService from '../services/foresightScoreService';
import tapestryService from '../services/tapestryService';

// ❌ BAD - ethers import removed ✓
// ❌ BAD - PRIZED_V2_CONTRACT_ABI removed ✓
// ❌ BAD - getV2Contract() removed ✓
```

### Afternoon (2 PM - 5 PM): Remove SIWE, Clean Auth

**Backend Lead:**
- [ ] Open `backend/src/api/auth.ts`
- [ ] Search for `siwe` (should find: `import siwe` line)
- [ ] Find the SIWE message generation endpoints (search for `/nonce`, `/verify`)
- [ ] Comment out or delete SIWE endpoints (keep Privy path intact)
- [ ] Keep line 6: `import { verifySiweMessage, ... }` (may be used elsewhere, safe)
- [ ] Run: `npx tsc --noEmit`
- [ ] Should report 0 errors
- [ ] Commit: "cleanup: disable SIWE auth endpoints, keep Privy only"

**Frontend Lead (in parallel):**
- [ ] Check `frontend/src/config/abis.ts` exists
- [ ] Delete file: `rm frontend/src/config/abis.ts`
- [ ] Search codebase for `abis.ts` imports: `grep -r "abis.ts" frontend/src`
- [ ] Should find 0 results (file is orphaned)
- [ ] Run: `npm run build`
- [ ] Frontend should build cleanly
- [ ] Commit: "cleanup: remove orphaned EVM ABIs"

### End of Day (5 PM - 6 PM): Verification

**Both Leads:**
- [ ] Backend: `cd backend && npx tsc --noEmit` — must report 0 errors
- [ ] Frontend: `cd frontend && npm run build` — must succeed
- [ ] Push all commits to main
- [ ] Tag: `git tag -a cleanup-day-1 -m "EVM cleanup complete"`

**End-of-Day Standup:**
- ✅ All ethers/siwe code removed
- ✅ TypeScript compiles cleanly
- ✅ No blocker for Tapestry integration
- ✅ Code is ready for DevOps handoff

---

## 📅 TUESDAY, FEBRUARY 25 — TAPESTRY INTEGRATION DAY

**Goal:** Wire Tapestry scoring, activate API key, test end-to-end
**Success Metric:** Scores stored on Tapestry, visible in logs

### Morning (9 AM - 12 PM): Activate Tapestry API Key

**Backend Lead:**
- [ ] Check email for Tapestry API key (should have arrived overnight)
- [ ] Copy key to secure location
- [ ] Open `backend/.env`
- [ ] Add line: `TAPESTRY_API_KEY=your_key_here`
- [ ] Save file
- [ ] Restart backend: `pnpm dev`
- [ ] Check logs: Should see "Tapestry configured: YES"
- [ ] (Do NOT commit .env file)

**Check for this log message:**
```
[Startup] Tapestry Protocol: CONFIGURED ✅
```

### Late Morning (12 PM - 2 PM): Wire storeScore() to Contest Finalization

**Backend Lead:**
- [ ] Open `backend/src/services/contestFinalizationService.ts`
- [ ] Find the section where contest is marked "finalized"
- [ ] Add after finalization:
```typescript
// Store final scores on Tapestry
if (tapestryService && isTapestryConfigured()) {
  for (const entry of finalizedEntries) {
    try {
      await tapestryService.storeScore(
        entry.user.tapestry_user_id,
        contestId,
        {
          finalScore: entry.final_score,
          rank: entry.rank,
          totalPlayers: finalizedEntries.length,
          timestamp: new Date().toISOString(),
        }
      );
    } catch (error) {
      logger.warn('Failed to store score on Tapestry', error, {
        context: 'contestFinalization',
        userId: entry.user_id,
      });
      // Don't fail the whole finalization if Tapestry is down
    }
  }
  logger.info(`Scores stored on Tapestry for ${finalizedEntries.length} players`, {
    context: 'contestFinalization',
  });
}
```
- [ ] Import if needed: `import tapestryService from '../services/tapestryService';`
- [ ] Run: `npx tsc --noEmit` — should pass
- [ ] Commit: "feat: wire storeScore to contest finalization"

### Afternoon (2 PM - 4 PM): Wire storeTeam() to Team Submission

**Backend Lead:**
- [ ] Open `backend/src/api/league.ts` (line ~330, team submission handler)
- [ ] Find where `INSERT INTO user_teams` happens
- [ ] Add after team is created:
```typescript
// Store team on Tapestry
if (userRecord.tapestry_user_id && tapestryService) {
  try {
    await tapestryService.storeTeam(userRecord.tapestry_user_id, team.id, {
      contestId: contestId,
      captainId: team.captain_id,
      formation: team.tier_distribution,
      timestamp: new Date().toISOString(),
    });
    logger.info('Team stored on Tapestry', {
      context: 'leagueAPI',
      teamId: team.id,
      contestId: contestId,
    });
  } catch (error) {
    logger.warn('Failed to store team on Tapestry', error, {
      context: 'leagueAPI',
      teamId: team.id,
    });
    // Don't fail team submission if Tapestry is down
  }
}
```
- [ ] Run: `npx tsc --noEmit`
- [ ] Commit: "feat: wire storeTeam to team submission"

### Late Afternoon (4 PM - 5:30 PM): Test Integration

**Backend Lead + QA:**
- [ ] Start backend: `pnpm dev`
- [ ] Create a test account locally
- [ ] Draft a team
- [ ] Check backend logs: Should see "Team stored on Tapestry"
- [ ] Verify Tapestry dashboard shows the team
- [ ] Mark contest as finalized (run manual script if needed)
- [ ] Check logs: Should see "Scores stored on Tapestry"

**Success criteria:**
```
✅ Team storage: LOG shows "Team stored on Tapestry"
✅ Score storage: LOG shows "Scores stored on Tapestry"
✅ Tapestry API: No 401/403 errors (auth works)
✅ Graceful degradation: If Tapestry is down, game still works
```

### End of Day (5:30 PM - 6 PM): Verification

**Backend Lead:**
- [ ] Backend compiles cleanly
- [ ] All logs show Tapestry operations succeeding
- [ ] Tapestry dashboard reflects stored data
- [ ] Commit all changes
- [ ] Tag: `git tag -a tapestry-integration -m "Tapestry API key activated, scoring wired"`

**End-of-Day Standup:**
- ✅ Tapestry API key configured
- ✅ `storeScore()` wired to contest finalization
- ✅ `storeTeam()` wired to team submission
- ✅ Tested end-to-end, all working
- ✅ Ready for deployment

---

## 📅 WEDNESDAY, FEBRUARY 26 — DEPLOYMENT & FRONTEND DAY

**Goal:** Ship to production, add Tapestry UI elements, test end-to-end
**Success Metric:** foresight.gg is live and functioning

### Morning (9 AM - 10:30 AM): Database Deployment

**DevOps Lead:**
- [ ] Go to Neon.tech dashboard
- [ ] Create PostgreSQL project
- [ ] Copy connection string: `postgresql://...`
- [ ] In Neon: Run migrations
```bash
DATABASE_URL="postgresql://..." npx knex migrate:latest
```
- [ ] In Neon: Seed demo data
```bash
DATABASE_URL="postgresql://..." npx knex seed:run
# OR if no seed script, run migration that seeds (20260221100000_seed_demo_data.ts)
```
- [ ] Verify: Query `SELECT COUNT(*) FROM influencers;` — should return 100
- [ ] Verify: Query `SELECT COUNT(*) FROM fantasy_contests WHERE id = 6;` — should return 1 (demo contest)

**Test local connection:**
- [ ] Update local `.env` to use Neon connection string
- [ ] Run: `npm run build` (backend)
- [ ] Verify database is accessible

### Late Morning (10:30 AM - 12 PM): Backend Deployment

**DevOps Lead:**
- [ ] Go to Railway.app (or Render.com)
- [ ] Create new project, connect GitHub repo
- [ ] Set environment variables:
  ```
  DATABASE_URL=postgresql://... (from Neon)
  JWT_SECRET=your-generated-secret
  NODE_ENV=production
  PORT=3000
  PRIVY_APP_ID=your-privy-id
  PRIVY_APP_SECRET=your-privy-secret
  TAPESTRY_API_KEY=your-tapestry-key
  TWITTER_API_IO_KEY=your-twitter-key
  ```
- [ ] Deploy: One-click deploy from GitHub
- [ ] Wait for deployment (5 min)
- [ ] Test endpoint: `curl https://your-railway-app.com/api/health`
- [ ] Should return: `{"status":"ok"}`
- [ ] Check logs: "Tapestry Protocol: CONFIGURED"

### Afternoon (12 PM - 2 PM): Frontend Deployment

**Frontend Lead:**
- [ ] Go to Vercel.com
- [ ] Create new project, connect GitHub repo
- [ ] Set environment variables:
  ```
  VITE_AUTH_PROVIDER=privy
  VITE_PRIVY_APP_ID=your-privy-id
  VITE_API_URL=https://your-railway-app.com
  ```
- [ ] Deploy: One-click deploy from GitHub
- [ ] Wait for deployment (3 min)
- [ ] Test: `https://foresight.vercel.app/` should load
- [ ] Walk through flow: signup → draft → leaderboard

### Late Afternoon (2 PM - 3:30 PM): Add Tapestry UI

**Frontend Lead:**
- [ ] Open `frontend/src/pages/Profile.tsx`
- [ ] Add Tapestry badge component below user stats:
```typescript
import TapestryBadge from '../components/TapestryBadge';

// In render:
{user.tapestry_user_id && (
  <TapestryBadge
    variant="card"
    message="Your identity is on Solana"
  />
)}
```
- [ ] Open `frontend/src/pages/Draft.tsx` (in the success celebration)
- [ ] Ensure TapestryBadge is displayed:
```typescript
<TapestryBadge
  variant="confirmation"
  message="Team shared on Solana via Tapestry"
/>
```
- [ ] Run: `npm run build`
- [ ] Commit: "feat: add Tapestry UI badges to profile and draft"
- [ ] Push to main → Vercel auto-deploys

### Late Afternoon (3:30 PM - 4:30 PM): Domain & SSL

**DevOps Lead:**
- [ ] Point foresight.gg DNS to Vercel:
  - DNS provider: Update A record to Vercel IP (or CNAME)
  - Vercel auto-provisions SSL cert (5-10 min)
- [ ] Test: `https://foresight.gg/` should load
- [ ] Should redirect from http → https automatically

### End of Day (4:30 PM - 5:30 PM): End-to-End Test on Production

**QA + Full Team:**
- [ ] Visit `https://foresight.gg/`
- [ ] Walk through complete flow on desktop:
  1. Sign in with Solana
  2. See home page dashboard
  3. Click "Contests" tab
  4. See "Hackathon Demo League" free contest
  5. Click "Enter Contest"
  6. Draft a team
  7. Submit team
  8. See leaderboard with 15 entries
  9. Check that your team appears
  10. View profile → see Tapestry badge
- [ ] Walk through on mobile (iPhone/Android)
  - All text readable
  - Buttons clickable
  - No layout breaking
- [ ] Check production logs: No 500 errors
- [ ] Performance: Page load < 3 seconds

**If anything breaks:**
- [ ] Check backend logs: `railway logs` or Render dashboard
- [ ] Check frontend deployment: Vercel deploy log
- [ ] Rollback: Revert last commit and redeploy

**End-of-Day Status:**
- ✅ Database deployed to Neon
- ✅ Backend deployed to Railway
- ✅ Frontend deployed to Vercel
- ✅ Domain pointing to Vercel
- ✅ SSL certificate active
- ✅ End-to-end flow tested
- ✅ Production is live

---

## 📅 THURSDAY, FEBRUARY 27 — QA & DEMO DAY

**Goal:** Bug-free product, polished 2-minute demo video, all materials ready
**Success Metric:** Zero critical bugs, demo video recorded and approved

### Morning (9 AM - 12 PM): QA Pass 1 — Desktop

**QA Lead:**
- [ ] Test on Chrome, Safari, Firefox
- [ ] Walk through all 6 pages:
  1. Home (/)
  2. Draft (/draft)
  3. Play (/play?tab=contests)
  4. Play (/play?tab=leaderboard)
  5. Feed (/feed)
  6. Profile (/profile)
- [ ] For each page, check:
  - [ ] Text renders clearly (no overflow)
  - [ ] Images load (avatars, badges)
  - [ ] Buttons are clickable
  - [ ] Forms submit without errors
  - [ ] Gold color theme is consistent
  - [ ] No console errors (`F12` → Console tab)
- [ ] Document any bugs in shared sheet
- [ ] Screenshot each page for reference

**Critical bugs only (block everything else):**
- [ ] Crashes (500 errors)
- [ ] Auth doesn't work
- [ ] Can't draft a team
- [ ] Leaderboard doesn't load

### Late Morning (12 PM - 1:30 PM): QA Pass 2 — Mobile

**QA Lead:**
- [ ] Use Chrome DevTools (F12 → Device Toolbar)
- [ ] Test on iPhone 12, Pixel 5 viewport sizes
- [ ] Same 6 pages, same checks
- [ ] Special attention to:
  - [ ] Text doesn't overflow
  - [ ] Buttons are at least 44px tall (Apple HIG)
  - [ ] Formation visual isn't squeezed
  - [ ] Horizontal scroll isn't needed
  - [ ] Leaderboard is readable (names, scores)

### Afternoon (1:30 PM - 2:30 PM): Load Test

**Backend Lead:**
- [ ] Use Apache Bench or simple Node script
- [ ] Simulate 20 simultaneous sign-ins:
```bash
ab -n 20 -c 20 https://foresight.gg/api/auth/verify
```
- [ ] Check backend doesn't crash
- [ ] Check auth succeeds for all 20
- [ ] Check logs for any warnings

### Afternoon (2:30 PM - 4:30 PM): Record Demo Video

**Marketing/Product Lead:**
- [ ] Open OBS or Screenflow (Mac)
- [ ] Start recording at 1080p
- [ ] **Script:**
  ```
  [0:00] START: Show browser at foresight.gg
  [0:05] Click "Sign In with Solana"
  [0:10] Complete Privy auth (use pre-made account or demo)
  [0:15] See home dashboard
  [0:25] Click "Play" tab
  [0:30] Click "Contests" subtab, see demo league card
  [0:35] Click "Enter Contest"
  [0:40] See draft page with formation
  [0:50] Click on Captain slot, select an influencer
  [1:00] Click on Tier A slot, select an influencer
  [1:05] (Quick montage of remaining picks, speed it up 2x)
  [1:15] Click "Submit Team"
  [1:20] See success: "Team shared on Solana via Tapestry" 🏆
  [1:25] Leaderboard shows your team in ranking
  [1:35] Click on your team, see individual scores
  [1:45] Click "Profile"
  [1:50] See "Your Tapestry Profile" card with identity info
  [1:55] END: "Foresight: Draft. Predict. Win. Powered by Solana."
  ```
- [ ] Keep narration simple: "I'm drafting my team of Crypto Twitter influencers. My scores will be verified on Solana via Tapestry Protocol. Here's the leaderboard. I can see I'm ranked #47. That's Foresight."
- [ ] Export video: MP4, H.264, 1080p, 60fps (or 30fps)
- [ ] Upload to shared drive
- [ ] Get approval from product lead (watch video, give thumbs up)

### Late Afternoon (4:30 PM - 5:30 PM): Materials & Fallback

**Product Lead:**
- [ ] Create `HACKATHON_SUBMISSION.md`:
  ```markdown
  # Foresight - Solana Graveyard Hackathon Entry

  ## Problem
  Friend.tech died because speculation replaced utility. SocialFi is the graveyard.

  ## Solution
  Foresight resurrects SocialFi with proven game mechanics (fantasy sports) + trustless identity (Tapestry Protocol).

  ## Demo
  [Link to demo video]

  ## Live App
  https://foresight.gg

  ## How It Works
  1. Sign in with Solana wallet
  2. Draft 5 CT influencers (Captain 1.5x, tiers S/A/B/C)
  3. Earn points from real Twitter engagement
  4. Scores stored on Solana via Tapestry Protocol
  5. Compete on leaderboards

  ## What's On-Chain
  - Player identities (Tapestry profiles)
  - Team formations (stored on Solana)
  - Final scores (cryptographically verified)

  ## Built With
  - React 18 + Vite + TailwindCSS
  - Express + TypeScript + Knex
  - PostgreSQL
  - Privy Auth (embedded wallets)
  - Tapestry Protocol (Solana social layer)
  - TwitterAPI.io (real engagement data)

  ## Team
  [Your names]
  ```
- [ ] Create fallback demo (no internet required):
  - [ ] Pre-record 3-minute video walkthrough
  - [ ] Have PDF screenshots of each page
  - [ ] Have copy-paste text of key flows
- [ ] Document all credentials in secure location:
  - [ ] Privy app ID + secret
  - [ ] Tapestry API key
  - [ ] Railway/Neon passwords (in 1Password)

**End-of-Day Status:**
- ✅ All 6 pages tested on desktop + mobile
- ✅ Load test passed (20 simultaneous users)
- ✅ Demo video recorded and approved
- ✅ Submission materials drafted
- ✅ Fallback demo prepared
- ✅ Ready for final submission

---

## 📅 FRIDAY, FEBRUARY 28 — SUBMISSION DAY

**Goal:** Submit to hackathon, monitor production, celebrate
**Success Metric:** Submission received, demo video reviewed, no critical errors

### Morning (6 AM - 9 AM): Final Production Check

**Full Team:**
- [ ] Check foresight.gg loads (3-second page load)
- [ ] Check backend logs (Railway dashboard): No 500 errors in last 24h
- [ ] Check database (Neon dashboard): Connections healthy
- [ ] Run one more manual test: signup → draft → leaderboard
- [ ] Verify Tapestry integration: Check that new teams/scores appear in logs

**If anything is broken:**
- [ ] Immediately check logs
- [ ] Revert last deploy if necessary
- [ ] Contact Railway/Vercel support (they have hackathon support)

### Mid-Morning (9 AM - 10 AM): Final Submission

**Product Lead:**
- [ ] Go to hackathon submission portal
- [ ] Fill out form:
  - [ ] App name: "Foresight"
  - [ ] Demo video link: [MP4 file or YouTube]
  - [ ] Live app link: https://foresight.gg
  - [ ] GitHub link: your repo (make it public)
  - [ ] Description: HACKATHON_SUBMISSION.md text
  - [ ] Tagline: "Fantasy sports for Crypto Twitter, powered by Solana"
  - [ ] Team members: [Names + emails]
- [ ] Double-check all links work
- [ ] Submit form
- [ ] Screenshot confirmation (should show "Submission received")

### Late Morning (10 AM - 12 PM): Demo Video Delivery

**Marketing Lead:**
- [ ] Upload demo video to hackathon platform (if required)
- [ ] OR post to YouTube as unlisted video, share link
- [ ] Verify judges can watch it (test link from incognito browser)
- [ ] Send video link via all required channels:
  - [ ] Hackathon email
  - [ ] Hackathon Discord
  - [ ] Submission form

### Afternoon (12 PM - 3 PM): Monitoring + Backup Prep

**DevOps Lead:**
- [ ] Set up 1-hour monitoring:
  - [ ] Check production every 15 minutes
  - [ ] Monitor logs for errors
  - [ ] Keep status page open (Railway/Vercel dashboard)
- [ ] Prepare emergency rollback:
  - [ ] If critical bug found, redeploy last known-good version
  - [ ] Have backup: Docker container or binary ready
- [ ] Prepare fallback demo:
  - [ ] If production goes down, judges can see pre-recorded demo
  - [ ] Have PDF walkthrough ready

### Evening (3 PM - 5 PM): Judge Preparation

**Product Lead:**
- [ ] Write judge briefing (1 page):
  ```
  Hi judges! Here's how to demo Foresight:
  1. Go to foresight.gg
  2. Sign in with test account: [email/wallet]
  3. You'll see the "Hackathon Demo League" contest
  4. Click "Enter Free" and draft your team
  5. See live leaderboard
  6. Check your profile to see Tapestry integration

  Expected time: 5 minutes

  If anything breaks, we have a backup video: [link]
  Questions? Contact: [your email]
  ```
- [ ] Email to hackathon organizers
- [ ] Post in Discord

### Evening (5 PM - 6 PM): Team Celebration

**Full Team:**
- [ ] You did it! 🚀
- [ ] Thank the team
- [ ] Review what went well
- [ ] Document lessons learned
- [ ] Take a screenshot of submission confirmation

---

## 🎯 DAILY STANDUP TEMPLATE

**Every day at 5 PM, use this format:**

```
## [DATE] STANDUP SUMMARY

✅ COMPLETED TODAY:
- Item 1
- Item 2
- Item 3

🔄 IN PROGRESS:
- Item A (blocked by X? no)
- Item B

❌ BLOCKERS:
- None / Item that's stuck

📊 METRICS:
- Test pass rate: X/Y
- Code coverage: Z%
- Performance: Page load time

🎯 TOMORROW'S FOCUS:
- Top priority
- Second priority

🚨 RISKS:
- Anything that came up
```

---

## ⚠️ CRITICAL SUCCESS FACTORS

**Do not compromise on these:**

1. **TypeScript compilation:** Must be 0 errors
2. **Production stability:** No 500 errors
3. **Demo video:** Smooth, under 2 minutes, no bugs
4. **Auth:** Judges must be able to sign in
5. **Leaderboard:** Must show real data
6. **Tapestry integration:** Must be visible (badge/score/profile)

---

## 🆘 EMERGENCY PROCEDURES

### If Backend Crashes
1. Check logs: `railway logs` or Render dashboard
2. Identify error
3. Fix locally, test
4. Redeploy: `git push` (auto-redeploys)
5. If that fails, rollback: `git revert HEAD && git push`

### If Database Is Down
1. Check Neon dashboard
2. If they're having an outage, contact support (they're fast)
3. Fallback: Deploy pre-seeded backup database
4. Worst case: Show pre-recorded demo only

### If Tapestry Is Down
1. App still works (scores just don't store on Solana)
2. Show demo video to judges
3. Explain: "Tapestry API had momentary downtime; here's what it looks like when it's live"

### If You Discover a Critical Bug
1. Pause all activities
2. Triage: Is it blocking the demo?
3. If yes: Fix immediately, redeploy, re-test
4. If no: Log it, prioritize for next hour

---

## 🏁 FINISH LINE

**When you submit:**

You've shipped a polished, working fantasy sports game for Crypto Twitter, powered by Solana's Tapestry Protocol for trustless identity and score storage. You've told a compelling story about SocialFi resurrection. You've executed flawlessly under pressure.

Now go win that $76K. 🚀

---

**Prepared by:** CTO Strategy
**Version:** 1.0 (Locked for 5-day sprint)
**Last Updated:** February 22, 2026
