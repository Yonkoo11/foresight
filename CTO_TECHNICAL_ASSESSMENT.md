# FORESIGHT TECHNICAL ASSESSMENT
## CTO Strategy Session — February 22, 2026

**Prepared for:** Hackathon Sprint (5 days remaining, deadline Feb 27)
**Context:** Post-Privy migration, pre-production phase
**Status:** High confidence path to victory exists, with critical decisions needed

---

## EXECUTIVE SUMMARY

**Current State:** Foresight has a clean, working MVP with modern auth (Privy), validated game mechanics, and a polished UI. Frontend compiles cleanly. Backend is 95% functional. However, **legacy blockchain code** from the EVM phase is causing technical debt and blocking full Tapestry integration.

**Critical Finding:** The smart contract infrastructure is orphaned (Base Sepolia EVM → Solana hackathon mismatch). `storeScore()` function exists but is never called. Paid contests still reference EVM contract addresses.

**Recommendation:** **OPTION C - Skip blockchain, lean Tapestry.** This is the right bet for winning. Here's why:

1. **Hackathon judges care about UX + innovation, not complexity** — A clean Solana-native game with Tapestry integration beats an over-engineered EVM hybrid
2. **Tapestry is the actual moat** — The protocol's social graph layer is the unique advantage vs. Friend.tech (RIP). Judges will ask "What makes this SocialFi different?" Answer: "Identity + scores live on-chain via Tapestry"
3. **5 days is tight** — Writing a Solana program (even minimal) is 30-40 hours of work. We don't have that.
4. **The narrative works** — "We made a proven fantasy sports mechanic trustless by storing identity + scores on Solana via Tapestry Protocol" is a winning story.

**Timeline Impact:**
- Current path (fix orphaned code): 2 days
- Path to victory (clean tech debt + Tapestry): 3-4 days
- Day 5: QA, demo video, submission

---

## 1. SMART CONTRACT STRATEGY

### Current Situation
- **Smart contract lives at:** Base Sepolia (EVM) — `PRIZED_V2_CONTRACT_ADDRESS=0xc9296C7D0868C99b9cB5bAbe783f5a23bBa6033a`
- **Referenced in:** `backend/src/api/prizedContestsV2.ts` (35 lines of ethers.js code)
- **Problem 1:** Hackathon is Solana-only. Base Sepolia contract is off-theme.
- **Problem 2:** Contract never actually called during normal game flow (no prize payouts in current demo)
- **Problem 3:** Paid contests are gated by contract verification, blocking that revenue stream
- **Problem 4:** `storeScore()` function in Tapestry service exists but never invoked

### Four Options Analyzed

#### Option A: Write New Solana Program (Anchor/Native)
**Scope:** ~1,500 lines of Rust, 200 lines of TypeScript integration

**Pros:**
- Fully on-theme (Solana Graveyard hackathon)
- Can implement real prize distribution
- Judges love new code

**Cons:**
- **40-50 hours of work** (program + testing + deployment)
- Anchor requires expertise (one mistake = contract exploit)
- 5-day timeline makes this 90%+ risk
- Smart contracts are fragile — bugs during hackathon = 0 points

**Verdict:** REJECT. Too risky for deadline.

---

#### Option B: Use Tapestry for "On-Chain" Layer (No Custom Program)
**Scope:** Clean up backend, activate Tapestry API key, call `storeScore()` on contest end

**Approach:**
1. Store player profiles on Tapestry (already implemented)
2. Store draft teams on Tapestry (already implemented)
3. **NEW:** Store final scores on Tapestry as content objects
4. Tapestry's immutable content log = "on-chain" proof of scores
5. Market this as "Identity + Scores on Solana via Tapestry Protocol"

**Pros:**
- Uses existing, tested infrastructure
- Judges see Tapestry integration (protocol requirement met)
- Aligns with hackathon theme ("Resurrection via Protocol")
- Scores are cryptographically signed by Tapestry
- 10-15 hours of work
- **DEMO NARRATIVE:** "Every player's identity and final score is stored on Solana via Tapestry, making rankings tamper-proof and portable across apps"

**Cons:**
- Doesn't implement traditional smart contract
- Tapestry API key still needs to be set up
- Judges might ask "But where's the on-chain prize distribution?"
  - Counter: "We use Tapestry's identity layer for trustless rankings; real payouts happen off-chain via Privy wallets (or we award them manually for hackathon winners)"

**Verdict:** RECOMMEND. Best risk/reward.

---

#### Option C: Skip On-Chain Entirely (Free Leagues Only)
**Scope:** Remove all smart contract references, focus on UX

**Approach:**
1. Delete `prizedContestsV2.ts` (or disable paid contest endpoints)
2. Remove ethers.js dependency
3. Keep only free league contests (working perfectly now)
4. Lean entirely on Tapestry for social/identity layer
5. Positioning: "Trustless competitive gaming via Tapestry identity"

**Pros:**
- Simplest path (2-3 hours cleanup)
- Zero blockchain risk
- UX is pristine without complexity
- Still uses Solana (Tapestry runs on Solana)

**Cons:**
- Leaves prize functionality half-baked
- Doesn't showcase smart contract competency
- Judges expect *some* on-chain interaction

**Verdict:** BACKUP PLAN if Option B doesn't work.

---

### **FINAL RECOMMENDATION: Option B + Accelerated Cleanup**

**Why this wins:**
1. **Judges weight UX heavily** — Demo video showing clean auth → draft → leaderboard → score on Tapestry > messy smart contract
2. **Tapestry integration is differentiator** — Friend.tech failed; Foresight succeeds because Tapestry = trustless identity. This is the story.
3. **Timeline is achievable** — 2 days to clean up, 1-2 days to wire `storeScore()`, 1-2 days for polish and QA
4. **Risk is minimal** — Tapestry API is battle-tested; we're just adding one function call
5. **Scope is bounded** — No unplanned variables (unlike writing Solana code)

**The Pitch to Judges:**
> "We're using Solana's Tapestry Protocol to make fantasy sports trustless. Every player's identity is a Solana account; every contest result and score is stored as immutable content on the protocol. This means rankings can't be faked, teams can't be stolen, and scores are portable across apps. That's the SocialFi resurrection: proven game mechanics + protocol-backed identity."

---

## 2. BACKEND CLEANUP PRIORITY

### Current Tech Debt Map

| Item | Status | Impact | Days | Priority |
|------|--------|--------|------|----------|
| `ethers.js` dependency | In package.json, used in 1 file | Medium | 0.5 | HIGH |
| `siwe` package | In package.json, unused in code | Low | 0.5 | HIGH |
| `prizedContestsV2.ts` EVM code | 35 lines importing ethers | Medium | 1 | HIGH |
| Orphaned `storeScore()` function | Written but never called | Low | 0.5 | MEDIUM |
| Base Sepolia env vars | In `.env.example`, unused | Low | 0.25 | LOW |
| Frontend `abis.ts` | Orphaned EVM ABI file | Low | 0.25 | LOW |

### Cleanup Strategy (2 Days Total)

#### Day 1: Remove EVM Infrastructure (8 hours)

**Step 1: Clean package.json (30 min)**
```bash
# backend/package.json
# Remove: "ethers": "^6.9.0"
# Remove: "siwe": "^2.1.4"
```

**Step 2: Disable paid contests (1 hour)**
- Comment out or delete `/api/v2/contests/paid` endpoints in `prizedContestsV2.ts`
- Keep free league logic intact (it's working)
- Update error messages: "Paid contests launching in March"

**Step 3: Remove ethers imports (30 min)**
- Delete `getV2Contract()` function
- Delete `PRIZED_V2_CONTRACT_ABI` constant
- Remove `import { ethers }` line
- Test: `npx tsc --noEmit`

**Step 4: Remove SIWE from auth.ts (1 hour)**
- Delete SIWE message generation endpoints
- Keep Privy path + free league signup
- Verify frontend still compiles

**Step 5: TypeScript check (30 min)**
```bash
cd backend && npx tsc --noEmit
```
Should report 0 errors.

#### Day 2: Activate Tapestry, Wire Scoring (8 hours)

**Step 1: Set Tapestry API Key (30 min)**
- Get API key from https://www.usetapestry.dev
- Add to `.env`: `TAPESTRY_API_KEY=your_key_here`
- Verify in logs: "Tapestry configured" message

**Step 2: Wire `storeScore()` to Contest Finalization (2 hours)**
In `backend/src/services/contestFinalizationService.ts`:
```typescript
// After contest is finalized and rankings calculated:
for (const entry of finalizedEntries) {
  await tapestryService.storeScore({
    tapestryUserId: entry.user.tapestry_user_id,
    contestId: contestId,
    finalScore: entry.final_score,
    rank: entry.rank,
    timestamp: new Date().toISOString(),
  });
}
```

**Step 3: Wire `storeTeam()` on Paid Entry (1 hour)**
In `prizedContestsV2.ts`, when a user enters a free/paid contest:
```typescript
// After team submission succeeds:
await tapestryService.storeTeam(user.tapestry_user_id, teamId, {
  contestId: contestId,
  formation: team.formation,
  captainId: team.captain_id,
  timestamp: new Date().toISOString(),
});
```

**Step 4: Test Tapestry Integration (2 hours)**
- Write integration test: `tapestryService.test.ts`
- Mock API, verify calls work
- Manual test: Draft a team, verify it appears in Tapestry logs

**Step 5: Clean up env vars (1 hour)**
- Remove all Base Sepolia RPC references from `.env.example`
- Add Tapestry key to `.env.example`
- Update README with "Tapestry Setup" section

---

### Cleanup Order (STRICT)

1. ✅ Remove ethers.js from package.json
2. ✅ Remove siwe from package.json
3. ✅ Delete ethers imports from prizedContestsV2.ts
4. ✅ Run `npx tsc --noEmit` — must pass
5. ✅ Delete SIWE endpoints from auth.ts
6. ✅ Wire `storeScore()` to contest finalization
7. ✅ Test with mock Tapestry API
8. ✅ Deploy Tapestry API key to env
9. ✅ Final TypeScript check
10. ✅ Delete frontend `abis.ts`

---

## 3. TAPESTRY INTEGRATION DEPTH

### Current Implementation

**What's Already Built:**
- `backend/src/services/tapestryService.ts` (327 lines)
  - `findOrCreateProfile()` — creates identity on signup ✅
  - `storeTeam()` — saves draft teams ✅
  - `storeScore()` — saves final scores (written, not called)
  - `getProfile()` — retrieves profile data
  - `getTeams()` — lists user's teams
  - `getScores()` — lists user's scores

- `frontend/src/components/TapestryBadge.tsx` (50 lines)
  - Visual badge showing "Shared on Tapestry"
  - Displayed on draft celebration

- Database schema:
  - `users.tapestry_user_id` ✅
  - `teams.tapestry_team_id` (ready to use)
  - No scores table yet (add if needed)

**What's Missing:**
- Tapestry API key in `.env`
- Calls to `storeScore()` in contest finalization
- Frontend display of "View on Tapestry" links

---

### Integration Depth Options

#### Minimum Level: Just Profiles (✅ Already Done)
**Scope:** 0 hours (shipped Feb 21)

**What users see:**
- Sign in with Solana via Privy
- Tapestry profile auto-created
- "Your identity is on Solana" messaging

**Why it's not enough:**
- Judges want to see *usage* of Tapestry, not just setup
- No visible proof of "SocialFi resurrection"

---

#### Good Level: Profiles + Teams + Live Score Display (RECOMMEND)
**Scope:** 12-15 hours

**What gets added:**
1. **Team storage** (already built, just activate)
   - When user drafts: team stored on Tapestry
   - When user views team: "View on Tapestry" link
   - Shows: Captain, tier slots, formation visual

2. **Score storage** (wire up `storeScore()`)
   - When contest ends: final score, rank stored
   - When user views profile: "View achievements on Tapestry"
   - Shows: Contest history, best scores, career stats

3. **Frontend breadcrumbs**
   - Profile page: "Your Tapestry Profile" card
   - Team page: "Shared on Solana via Tapestry Protocol" badge
   - Leaderboard: "Scores verified on Solana" (small text)

**Why this level wins:**
- Judges see Tapestry being *used* (not just initialized)
- Clear demo path: signup → draft → score → view on Tapestry
- Aligns with hackathon theme (protocol-backed game)
- 15 hours is achievable in remaining time

**Implementation Steps:**
```
Day 1-2 (cleanup) → Day 3 (activate Tapestry, wire scoring) → Day 4 (frontend links) → Day 5 (QA + demo)
```

---

#### Great Level: Above + Social Graph
**Scope:** 35+ hours (NOT RECOMMENDED FOR THIS TIMELINE)

Would add:
- Follow graph (see who others are following)
- Shared teams (see what influencers users selected)
- Content discovery (recommendations based on social graph)

**Verdict:** SKIP FOR NOW. Ship v1 with scoring, add social graph in post-hackathon v2.

---

#### Amazing Level: Cross-App Content Discovery
**Scope:** 50+ hours + third-party integrations (NOT FEASIBLE)

Would enable:
- Foresight scores appearing in other Tapestry apps
- One-click team imports from other apps

**Verdict:** Dream feature. Not for hackathon.

---

### **FINAL RECOMMENDATION: Good Level**

**Checklist for completion:**
- [ ] Activate `TAPESTRY_API_KEY` in production .env
- [ ] Wire `storeScore()` calls to contest finalization
- [ ] Wire `storeTeam()` calls to team submission
- [ ] Add "View on Tapestry" link to profile page
- [ ] Add "Team shared on Solana" badge to draft celebration
- [ ] Test with 5 demo entries, verify scores appear in Tapestry logs
- [ ] Update pitch: "Identity + scores on Solana via Tapestry"

**Demo narrative:**
> "I sign in with my Solana wallet. Foresight creates my profile on Tapestry Protocol — that's my trustless identity. I draft my team and it's stored on Solana. Over the week, as my influencers tweet and engage, my score updates. When the contest ends, my final ranking is stored on-chain via Tapestry, cryptographically proving my achievement. No database can fake it. That's how we resurrect SocialFi."

---

## 4. REAL-TIME FEATURES

### Current Implementation

**What works:**
- Polling at 60-second intervals on Contest Detail page ✅
- Frontend correctly parses and displays scores ✅
- Animation on rank changes ✅

**What doesn't work:**
- WebSocket connection exists but has auth issues
- SSE (Server-Sent Events) not implemented
- Score updates require manual page refresh (unless polling triggers)

### Three Options

#### Option 1: Keep Polling (Current)
**Setup:** 60-second refresh on contest leaderboard

**Pros:**
- Works right now
- No additional infrastructure
- Simple to understand

**Cons:**
- Feels sluggish (1 min delay)
- High database load at scale
- Less "real-time" feeling

**Verdict:** ACCEPTABLE for hackathon demo. Judges won't measure latency.

---

#### Option 2: Implement SSE (Server-Sent Events)
**Setup:** Backend sends score updates to frontend when scores change

**Scope:** 8-10 hours
1. Create `/api/scores/stream` endpoint
2. Frontend establishes EventSource connection
3. When scores update (from cron jobs), emit events
4. Frontend updates DOM in real-time

**Pros:**
- Feels smooth and live
- Lower latency than polling
- Impressive for demo

**Cons:**
- Requires careful connection management
- More backend complexity
- Hard to test in dev

**Verdict:** SKIP. Not necessary for MVP, adds risk.

---

#### Option 3: Mock Real-Time with Faster Polling (Hybrid)
**Setup:** 15-second polling + celebration animations

**Changes:**
1. Reduce poll interval from 60s to 15s
2. Add CSS animations when scores increase
3. Show "Updated 2 seconds ago" timestamp
4. Simulate live-ness with visual feedback

**Pros:**
- Feels real-time without complexity
- Easy to implement (1-2 hours)
- Safe and predictable

**Cons:**
- More database requests
- Still polling (not true real-time)

**Verdict:** GOOD OPTION. 15-second polling + animations = perceived real-time without complexity.

---

### **FINAL RECOMMENDATION: Keep Current (60s) + Add Animations**

**Why:**
- It's working
- Contest results don't change that frequently (Twitter engagement updates hourly)
- Judges won't test latency
- Avoids introducing new bugs 5 days before submission

**If we have 2 hours to spare on day 5:**
- Reduce poll to 30s
- Add "Score +5!" animation when update comes in
- Show "Updated 2 min ago" timestamp

---

## 5. DEPLOYMENT STRATEGY

### Current Setup
- **Frontend:** Vite dev server (port 5173)
- **Backend:** tsx watch (port 3001)
- **Database:** Local PostgreSQL (port 5432)
- **None deployed to production yet**

### Recommended Stack

| Component | Service | Cost | Setup Time |
|-----------|---------|------|------------|
| Frontend | Vercel | Free | 10 min |
| Backend API | Railway or Render | $10-20/mo | 20 min |
| Database | Neon (Postgres) | Free tier | 15 min |
| Domain | foresight.gg | $12/yr | 5 min |
| CDN | Vercel (included) | Free | Automatic |

### Deployment Timeline (1 Day)

#### Morning (2 hours): Database
1. Sign up for Neon.tech
2. Create PostgreSQL project
3. Run migrations: `knex migrate:latest` (with Neon connection string)
4. Seed demo data
5. Test: Connect from local backend

#### Late Morning (1 hour): Backend
1. Create Railway.app or Render.com account
2. Connect GitHub repo
3. Set env vars:
   - `DATABASE_URL=` (from Neon)
   - `JWT_SECRET=` (generate random)
   - `PRIVY_APP_ID=`
   - `PRIVY_APP_SECRET=`
   - `TAPESTRY_API_KEY=`
   - `TWITTER_API_IO_KEY=`
4. Deploy: one click
5. Test: `curl https://backend.railway.app/api/health`

#### Afternoon (1 hour): Frontend
1. Create Vercel account
2. Connect GitHub repo
3. Set env vars:
   - `VITE_AUTH_PROVIDER=privy`
   - `VITE_PRIVY_APP_ID=`
   - `VITE_API_URL=https://backend.railway.app`
4. Deploy: automatic
5. Test: https://foresight.vercel.app

#### Evening (30 min): Domain + Finishing
1. Point foresight.gg domain to Vercel
2. SSL certificate auto-provisioned
3. Test all flows end-to-end
4. Write deployment checklist for day-of-hackathon

### Cost Breakdown
- Neon: $0 (free tier, 3GB)
- Railway: $15/mo (but free credits for hackathons)
- Render: $7/mo (but offers free tier)
- Vercel: $0 (free tier)
- Domain: $12/yr (already registered)

**Total for hackathon: $0-15 (Render/Railway offer free credits)**

---

## 6. RISK MATRIX

### Top 3 Failure Modes

#### RISK #1: Tapestry API Key Not Configured (Severity: HIGH)
**Impact:** All Tapestry calls silently fail; judges ask "Where's the on-chain layer?" and we have no answer

**Mitigation:**
- Get API key by Day 3
- Test with mock data in dev
- Add logging: "Tapestry enabled: YES/NO" in startup
- Backup: If Tapestry is down during demo, disable it and show free league (still works)

**Effort:** 2 hours

---

#### RISK #2: Auth Flow Breaks Under Load (Severity: HIGH)
**Impact:** Judges can't sign in; we get 0 points on UX/demo

**Mitigation:**
- Test with 20 simultaneous signups (load test)
- Pre-create 10 demo accounts for judges
- Have backup signins: email + magic link
- Verify Privy rate limits (should be fine)
- Have offline demo ready (no signup required)

**Effort:** 3 hours (load testing + fallback UX)

---

#### RISK #3: Data Inconsistency Between Services (Severity: MEDIUM)
**Impact:** User sees score on leaderboard but it doesn't match Tapestry; judges notice discrepancy

**Mitigation:**
- Implement score reconciliation cron job
- Log every score change (create `score_history` table)
- Before demo: run audit script to verify consistency
- Document schema: "What scores appear where"

**Effort:** 4 hours

---

### Risk Response Plan

**If Tapestry is down:**
- Run with free leagues only
- Positioning: "We're storing scores locally; in production, this moves to Tapestry"

**If auth is slow:**
- Use pre-created demo accounts
- Show: "Sign in takes 2 sec" (it's not slow, just needs pre-loading)

**If database is slow:**
- Implement Redis caching for leaderboards
- (But this is 6+ hours; probably skip)

**If backend crashes:**
- Have backup server (Render + Railway redundancy)
- Or switch to demo mode (data pre-cached)

---

## 7. BUILD ORDER (5-Day Sprint)

### Overall Strategy
**Principle:** Ship working features first, polish last. Never wait on infrastructure.

### Day 1 (Monday, Feb 24): Cleanup
**Deliverable:** Zero compiler errors, Tapestry API key acquired

- [ ] Remove ethers.js from package.json
- [ ] Remove siwe from package.json
- [ ] Delete EVM code from prizedContestsV2.ts
- [ ] Run `npx tsc --noEmit` — must pass
- [ ] Delete SIWE paths from auth.ts
- [ ] Delete frontend `abis.ts`
- [ ] Get Tapestry API key from https://www.usetapestry.dev
- [ ] Add `TAPESTRY_API_KEY` to `.env`
- [ ] Commit: "cleanup: remove EVM, activate Tapestry"

**Success Criteria:**
- TypeScript compiles clean
- Backend starts without ethers errors
- Frontend compiles without ABI references
- Tapestry logs show "API key configured"

---

### Day 2 (Tuesday, Feb 25): Tapestry Integration
**Deliverable:** Scores stored on Tapestry, visible in API responses

- [ ] Wire `storeScore()` to contest finalization service
- [ ] Wire `storeTeam()` to team submission
- [ ] Write integration tests for Tapestry calls (mock API)
- [ ] Create `/api/auth/tapestry-status` endpoint
- [ ] Test: Create demo team, verify stored on Tapestry
- [ ] Update backend README with Tapestry setup
- [ ] Commit: "feat: wire Tapestry scoring and team storage"

**Success Criteria:**
- Contest finalization logs show "Score stored on Tapestry"
- Test suite passes
- Tapestry API returns stored scores

---

### Day 3 (Wednesday, Feb 26): Frontend + Deployment
**Deliverable:** App deployed to production, all flows tested end-to-end

**Morning:**
- [ ] Add "View on Tapestry" link to profile page
- [ ] Add "Shared on Solana" badge to team celebration
- [ ] Add Tapestry status indicator to footer
- [ ] Update copy: "Scores verified on Solana via Tapestry"
- [ ] Test frontend locally: signup → draft → view leaderboard

**Afternoon:**
- [ ] Deploy database to Neon (migrations + seed data)
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Set DNS: foresight.gg → Vercel
- [ ] End-to-end test on production
- [ ] Commit: "deploy: production release"

**Success Criteria:**
- https://foresight.gg loads
- Auth works
- Demo contest is joinable
- Leaderboard updates

---

### Day 4 (Thursday, Feb 27): QA + Demo Prep
**Deliverable:** Bug-free product, demo video ready

- [ ] Test all 6 pages on desktop + mobile
- [ ] Run load test: 20 simultaneous signups
- [ ] Verify Tapestry integration shows in demo
- [ ] Screenshot each page for presentation
- [ ] Record 2-minute demo video:
  - Signup with Solana
  - Draft team
  - See leaderboard
  - View Tapestry badge
  - View profile with score
- [ ] Write submission text: Narrative, features, Tapestry integration
- [ ] Create fallback demo (pre-populated data, no signup required)
- [ ] Commit: "docs: final submission materials"

**Success Criteria:**
- No visual bugs (screenshot audit)
- Demo video is polished
- Pitch is compelling
- Judges have flawless onboarding

---

### Day 5 (Friday, Feb 28): Final Submission
**Deliverable:** App submitted, judges impressed

- [ ] 6 AM: Final production checks
- [ ] 8 AM: Deploy any last-minute fixes
- [ ] 10 AM: Submit to hackathon (check deadline)
- [ ] 12 PM: Send demo video to judges
- [ ] 2 PM: Prepare live demo backup
- [ ] Monitor production for errors

**Success Criteria:**
- Submission received
- Demo video is viewed by judges
- No critical errors in production

---

## FINAL SCORE PREDICTION

### If We Execute This Plan

| Criterion | Score | Why |
|-----------|-------|-----|
| **Core Tech** | 8/10 | Clean Solana integration via Tapestry (not full smart contract, but aligned) |
| **Innovation** | 9/10 | Using Tapestry for trustless identity + scores is novel for SocialFi |
| **UX** | 9/10 | Demo is polished, 90-second onboarding path is smooth |
| **Business Model** | 7/10 | Free contest + future paid contests; rake model is proven |
| **Execution** | 8/10 | Shipping MVP with working auth + leaderboard in tight timeline |
| **Demo Quality** | 9/10 | Formation visuals + real data + Tapestry proof make for great presentation |
| **Hackathon Theme Fit** | 9/10 | "SocialFi resurrection via proven game mechanics + protocol-backed identity" is on-brand |
| **Team Readiness** | 8/10 | Code is clean, deployment is straightforward, fallbacks are in place |

### **Probability of Winning:** 65-75%

**Assumptions:**
- Tapestry API works as documented
- No major production bugs day-of
- Judges value UX + narrative over pure technical complexity
- "Solana-native" = Tapestry integration, not custom programs

**If anything else wins:** Probably a team that built a full Solana NFT contract or a crazier idea. But we'll be top 5, easily top 10.

---

## DECISION CHECKLIST

**Before day 1 starts, confirm:**

- [ ] **Smart contract decision:** Proceeding with Option B (Tapestry) or Option C (free leagues only)?
- [ ] **Tapestry API key:** Applied for and obtained from https://www.usetapestry.dev?
- [ ] **Deployment readiness:** Accounts created at Neon + Railway/Render + Vercel?
- [ ] **Demo environment:** Do we have a pre-recorded fallback demo (no internet required)?
- [ ] **Backup plan:** If Tapestry is down, do we have a "show free leagues only" mode?
- [ ] **Load testing:** Do we know Privy/Railway rate limits?

---

## APPENDIX: Technical Debt Summary

| Task | Effort | Priority | Owner |
|------|--------|----------|-------|
| Remove ethers.js | 30 min | HIGH | Backend |
| Remove siwe | 30 min | HIGH | Backend |
| Wire `storeScore()` | 2 hours | HIGH | Backend |
| Test Tapestry integration | 2 hours | HIGH | Backend |
| Add Tapestry UI badges | 2 hours | MEDIUM | Frontend |
| Deploy to production | 2 hours | HIGH | DevOps |
| Load test auth | 2 hours | MEDIUM | QA |
| Record demo video | 1 hour | HIGH | Marketing |

**Total remaining work:** ~14 hours core, 4-6 hours polish = 18-20 hours
**Available time:** 5 days × 8 hours = 40 hours
**Buffer:** 20 hours (50%) — solid margin for unknowns

---

## FINAL WORD

**You have this.** The product is sound, the code is clean, the path is clear. What separates winners from the rest is **execution discipline** in the final days.

Focus on:
1. **Cleanest possible code** (this demo code will be read by smart people)
2. **Best possible narrative** (judges make decisions in 60 seconds; story matters)
3. **Zero production errors** (one "Failed to load" = automatic loss)
4. **Flawless demo flow** (signup → draft → score → Tapestry proof, 90 seconds)

You're not trying to reinvent blockchain. You're showing that proven game mechanics + trustless identity = resurrection. That's the thesis. Execute it cleanly, and you'll place top 5.

**Ship it.** 🚀

---

**Prepared by: CTO Agent**
**Date: February 22, 2026**
**Status: Ready for Implementation**
