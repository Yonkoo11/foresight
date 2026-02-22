# Foresight — Hackathon Architecture Document

> **Version:** 1.0 — February 22, 2026
> **Hackathon:** Solana Graveyard — "Resurrection of SocialFi through Game Theory"
> **Deadline:** February 27, 2026
> **Required Integration:** Tapestry Protocol (Solana social identity layer)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Strategic Decisions (Locked)](#3-strategic-decisions-locked)
4. [Auth System — Privy + Solana](#4-auth-system--privy--solana)
5. [Blockchain Strategy — Tapestry-First](#5-blockchain-strategy--tapestry-first)
6. [Scoring System — Audit & Fixes](#6-scoring-system--audit--fixes)
7. [Contest System — Consolidation Plan](#7-contest-system--consolidation-plan)
8. [Quest & Achievement System — Cleanup](#8-quest--achievement-system--cleanup)
9. [Twitter Data Pipeline — Reliability](#9-twitter-data-pipeline--reliability)
10. [Tapestry Integration — Deep Plan](#10-tapestry-integration--deep-plan)
11. [Frontend Architecture](#11-frontend-architecture)
12. [Deployment & Infrastructure](#12-deployment--infrastructure)
13. [Risk Matrix](#13-risk-matrix)
14. [5-Day Build Plan](#14-5-day-build-plan)
15. [Demo Strategy](#15-demo-strategy)
16. [Post-Hackathon Roadmap](#16-post-hackathon-roadmap)

---

## 1. Executive Summary

### What Is Foresight?

Fantasy sports for Crypto Twitter. Users draft 5 CT influencers, earn points from their real Twitter engagement, and compete on leaderboards. Built on Solana with Tapestry Protocol for identity and social proof.

### The Pitch

> "SocialFi died because it was speculative — Friend.tech was a ponzi with profile pictures. We resurrected it with **fantasy sports mechanics**: real utility, real engagement, no speculation. Tapestry Protocol provides the identity layer that Friend.tech never had — verified profiles, trustless score storage, anti-spam."

### Current State (After Feb 22 Migration)

| Layer | Status | Notes |
|-------|--------|-------|
| **Frontend** | ✅ CLEAN | Privy-only, TypeScript compiles clean, 6 polished pages |
| **Backend Auth** | ⚠️ 90% | Privy working, SIWE dead code needs removal |
| **Scoring Engine** | ⚠️ 80% | Solid math, but viral scoring is estimated, not actual |
| **Contest System** | 🔴 FRAGMENTED | Two competing APIs (league.ts vs prizedContestsV2.ts) |
| **Quest System** | ⚠️ 70% | Works but doesn't award FS, disconnected from achievements |
| **Tapestry** | 🔴 40% | Profile creation exists, API key not configured, storeScore never called |
| **Twitter Pipeline** | ⚠️ 75% | Well-built but no scheduled refresh, rising stars empty |
| **Blockchain** | 🔴 0% | No Solana program, EVM contract dead code still present |

### What This Document Covers

Every system in the codebase has been audited by specialized agents. This document captures:
- What works and should be **KEPT**
- What's broken and must be **FIXED**
- What's dead weight and should be **CUT**
- What's missing and needs to be **BUILT**
- The optimal build order for the remaining 5 days

---

## 2. System Architecture Overview

### Target Architecture (Post-Migration)

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  React 18 + Vite + TailwindCSS + Privy SDK          │
│  6 Pages: Home, Draft, Compete, Contest, Feed, Profile│
│  Auth via useAuth() → Privy (Solana wallet)          │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS (axios)
                       ▼
┌─────────────────────────────────────────────────────┐
│                    BACKEND                           │
│  Express + TypeScript + Knex                         │
│  Auth: Privy token verification → JWT sessions       │
│  Scoring: Weekly snapshots → V2 formula              │
│  Cron: Snapshot capture + scoring + finalization      │
└────────┬─────────────┬──────────────┬───────────────┘
         │             │              │
         ▼             ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
│ PostgreSQL  │ │ Tapestry    │ │ TwitterAPI.io    │
│ (Source of  │ │ Protocol    │ │ (Influencer      │
│  truth)     │ │ (Solana     │ │  metrics)        │
│             │ │  identity + │ │                  │
│ Users       │ │  content)   │ │ Profiles         │
│ Contests    │ │             │ │ Tweets           │
│ Teams       │ │ Profiles    │ │ Engagement       │
│ Scores      │ │ Teams       │ │                  │
│ Quests      │ │ Scores      │ │                  │
│ FS Economy  │ │             │ │                  │
└─────────────┘ └─────────────┘ └─────────────────┘
```

### Data Flow: User Journey

```
1. User visits foresight.gg
2. Clicks "Sign In" → Privy modal (Solana wallet)
3. Privy authenticates → usePrivyAuth sends token to backend
4. Backend: POST /api/auth/verify { privyToken }
   → Privy SDK verifies → extracts Solana wallet address
   → findOrCreateUser(wallet) → create JWT session
   → Tapestry: findOrCreateProfile(wallet, username) [async]
5. Frontend reloads with auth context
6. User navigates to /play → sees contests
7. Clicks "Enter" → /draft page
8. Drafts 5 influencers (150-point budget, 1 captain at 1.5x)
9. Submits team → POST /api/v2/contests/:id/enter-free
   → Validates budget, team size, captain
   → Stores in free_league_entries table
   → Tapestry: storeTeam() [async]
   → FS: award entry bonus
10. Weekly scoring runs (cron):
    → Twitter API snapshots (Mon start, Sun end)
    → Delta calculation → V2 scoring formula
    → Leaderboard update → FS awards
    → Tapestry: storeScore() [async]
```

---

## 3. Strategic Decisions (Locked)

These decisions are final. No more debate.

### 3.1 No Custom Solana Program

**Decision:** We will NOT write a custom Anchor/Solana program.

**Rationale:**
- A minimal Anchor program takes 40-60 hours. We have 5 days total.
- Risk of incomplete/broken smart contract is higher than no contract.
- Tapestry Protocol IS our on-chain layer — profiles and content are stored on Solana via Tapestry.
- Judges care about **working product + creative protocol usage**, not raw smart contract complexity.
- Past Solana hackathon winners often use ecosystem protocols creatively rather than building everything from scratch.

**What we tell judges:** "Gameplay is off-chain for speed (scores update in real-time). Results are stored on Tapestry (Solana) for trustless verification. We chose not to force blockchain where it doesn't add value — that's the lesson from Friend.tech's failure."

### 3.2 Tapestry = Our Blockchain Story

**Decision:** Tapestry Protocol handles ALL on-chain requirements.

**What goes on Tapestry (Solana):**
- User profiles (identity verification)
- Draft team compositions (portable across apps)
- Contest scores and results (immutable audit trail)

**What stays in PostgreSQL:**
- Real-time scoring (speed matters)
- Leaderboard rankings (frequent updates)
- Quest/achievement progress (complex queries)
- User sessions and auth state

### 3.3 Free Leagues Only for Hackathon

**Decision:** No paid contests. Free leagues are the entire demo.

**Rationale:**
- Paid contests require on-chain escrow → complex, risky
- Free leagues demonstrate the full game loop without financial friction
- "Free to play, win real prizes" is better marketing than "$5 entry fee"
- Removes smart contract dependency entirely

### 3.4 Single Contest API (prizedContestsV2.ts)

**Decision:** `prizedContestsV2.ts` is the canonical contest API. `league.ts` is legacy.

**Migration plan:** Port missing features (quests, activity, achievements) from league.ts into prizedContestsV2.ts, then deprecate league.ts endpoints.

### 3.5 Formation Visual is the Differentiator

**Decision:** The 2-3 formation layout (like FIFA Ultimate Team) is our visual hook.

It appears on: Landing page hero, Draft page, Profile page, Contest leaderboard.
It must be: Beautiful, responsive, animated, showing real influencer avatars + tiers + captain badge.

---

## 4. Auth System — Privy + Solana

### Current State: ✅ WORKING (Frontend), ⚠️ NEEDS CLEANUP (Backend)

### Frontend (DONE)
- `useAuth()` hook provides unified interface
- `PrivyAuthBridge` in App.tsx populates AuthContext from Privy state
- All pages use `useAuth()` — no direct Privy/wagmi imports
- Solana wallet preferred (`chainType === 'solana'`)
- Layout.tsx: Gold "Sign In" button → Privy modal

### Backend (NEEDS CLEANUP)

**What works:**
- `POST /api/auth/verify` accepts `{ privyToken }` → verifies via Privy SDK
- Extracts Solana wallet address (preferred) or Ethereum fallback
- Creates user + JWT session + Tapestry profile
- Founding member detection (first 1000 users)
- Referral tracking

**What needs removal:**
| Item | File | Action |
|------|------|--------|
| `siwe` package | backend/package.json | Remove dependency |
| `verifySiweMessage()` | backend/src/utils/auth.ts | Delete function |
| `generateNonce()` | backend/src/utils/auth.ts | Delete function |
| `SiweMessage` import | backend/src/utils/auth.ts | Remove import |
| `GET /api/auth/nonce` | backend/src/api/auth.ts | Remove endpoint |
| SIWE message/signature path | backend/src/api/auth.ts POST /verify | Remove branch |
| Ethereum wallet fallback | backend/src/utils/privy.ts | Remove fallback (Solana-only) |
| `ethers` package | backend/package.json | Remove dependency |
| `ethers` imports | backend/src/api/prizedContestsV2.ts | Remove import + getV2Contract() |
| EVM contract verification | prizedContestsV2.ts /verify-entry | Remove entire endpoint |
| Frontend ABIs | frontend/src/config/abis.ts | Delete file |
| EVM env vars | backend/.env | Remove Base Sepolia vars |

**Effort:** 2-3 hours for complete cleanup.

---

## 5. Blockchain Strategy — Tapestry-First

### What Is Tapestry Protocol?

Tapestry is Solana's decentralized social identity layer:
- **Identity:** Maps wallet addresses to verifiable profiles
- **Content:** Stores user-generated content on Solana (via state compression/Merkle trees)
- **Social Graph:** Following/follower relationships, portable across apps
- **SDK:** `socialfi` npm package (v0.1.14)

### Current Integration Status

| Feature | Code Exists? | Called? | Working? |
|---------|-------------|--------|----------|
| Profile creation | ✅ findOrCreateProfile() | ✅ On signup | ❌ API key missing |
| Team storage | ✅ storeTeam() | ✅ On draft | ❌ API key missing |
| Score storage | ✅ storeScore() | ❌ Never called | ❌ Not wired |
| Profile retrieval | ✅ getProfile() | ✅ Via status endpoint | ❌ API key missing |
| Identity resolution | ✅ resolveIdentity() | ❌ Not called | ❌ Not wired |

### Integration Plan (Priority Order)

**Step 1: Configure API Key (5 min)**
```bash
TAPESTRY_API_KEY=<from usetapestry.dev dashboard>
```
This single change enables ALL existing Tapestry code.

**Step 2: Wire storeScore() (1 hour)**
Call `tapestryService.storeScore()` after contest finalization:
- In `contestFinalizationService.ts` after rankings calculated
- Pass: userId, contestId, totalScore, rank, breakdown

**Step 3: Make Integration Visible in UI (2 hours)**
- Show "Stored on Tapestry" badge after team submission (Draft page)
- Show "Verified on Tapestry" badge on profile (Profile page)
- Show Tapestry badge on leaderboard entries (Compete page)
- Link badges to Tapestry explorer for verification

**Step 4: Score Verification Endpoint (1 hour)**
```
GET /api/tapestry/verify/:userId/:contestId
→ Fetches score from Tapestry
→ Compares with DB score
→ Returns { match: true/false, tapestryScore, dbScore }
```
This is the "wow moment" for judges — provably fair scoring.

**Total effort:** 4-5 hours

### What We Tell Judges

> "Every team and score is stored on Solana via Tapestry Protocol. This means:
> 1. **Anti-fraud:** Scores can't be retroactively manipulated (immutable on-chain)
> 2. **Portability:** Your draft history follows you across any app in the Tapestry ecosystem
> 3. **Verification:** Anyone can verify contest results independently
>
> Friend.tech had no identity layer — that's why scammers impersonated celebrities and the platform collapsed. Tapestry solves this."

---

## 6. Scoring System — Audit & Fixes

### What's Good (KEEP)

The V2 scoring formula is mathematically sound:

```
Weekly Score = Activity(0-35) + Engagement(0-60) + Growth(0-40) + Viral(0-25)
Max possible: 160 pts per influencer (240 with captain 1.5x)

Activity  = min(35, tweets_this_week × 1.5)
Engagement = min(60, sqrt(avgLikes + avgRT×2 + avgReplies×3) × 1.5 × volumeMultiplier)
Growth    = min(40, followersGained/2000 + growthRate%×5)
Viral     = Σ threshold_points for top 3 viral tweets (4/7/12 pts per tier)
Captain   = baseTotal × 1.5
```

**Strengths:**
- Four orthogonal dimensions prevent gaming any single metric
- Square root normalization on engagement prevents mega-accounts from dominating
- Volume multiplier penalizes small sample sizes
- Growth rate + absolute growth rewards both big and small accounts
- Captain selection adds strategic depth (1.5x, not 2x — balanced)

### What's Broken (FIX)

#### Issue #1: Viral Score is Estimated, Not Actual — CRITICAL

**Problem:** We don't have individual tweet engagement data in snapshots. Viral scoring estimates "viral tweets" from average engagement, which is fundamentally wrong.

**Current (broken):**
```typescript
const avgEngagement = avgLikes + avgRetweets + avgReplies;
viralTweets = Math.min(3, Math.floor(avgEngagement / 10000));
// Same threshold applied to all "viral tweets" — nonsensical
```

**Fix (for hackathon):** Use tweet-level data from CT Feed service.
```
1. During end-of-week snapshot, also query ct_tweets table
2. Find tweets by this influencer in the contest period
3. Calculate actual per-tweet engagement
4. Apply viral thresholds to real tweet data
```

**Effort:** 3-4 hours
**Fallback:** Keep estimation but document it. For demo, scores still look plausible.

#### Issue #2: Random Fallback Scores in Prized Contests — CRITICAL

**Problem:** If snapshots are missing, prizedContestsV2.ts generates random scores (25-75 pts).

```typescript
// Line 705-710 of prizedContestsV2.ts
influencerScore = 25 + Math.random() * 50; // ❌ RANDOM!
```

**Fix:** Remove random fallback. If snapshots missing, score = 0 with a warning flag.

**Effort:** 15 minutes

#### Issue #3: Scoring Duplication Between APIs — HIGH

**Problem:** `fantasyScoringService.ts` has the canonical V2 formula, but `prizedContestsV2.ts` has a simplified inline copy that may diverge.

**Fix:** All scoring must call `fantasyScoringService.calculateInfluencerWeeklyScore()`. Remove inline scoring from prizedContestsV2.ts.

**Effort:** 1-2 hours

#### Issue #4: Missing Snapshot Fallback — HIGH

**Problem:** If Twitter API fails during snapshot, affected influencers score 0. No fallback to last known data.

**Fix for hackathon:** Before demo, manually trigger snapshots and verify all 100 succeed. For production, implement last-valid-snapshot cache.

**Effort:** 0 for hackathon (manual verification), 4 hours for proper fix

#### Issue #5: Tie-Breaking is Creation-Time Only — LOW

**Current:** Ties broken by `created_at ASC` (earlier teams rank higher).

**Acceptable for hackathon.** Document as known limitation.

### Scoring Config Values (Reference)

| Parameter | Value | Notes |
|-----------|-------|-------|
| Points per tweet | 1.5 | Activity scoring |
| Activity cap | 35 | ~23 tweets maxes out |
| Engagement quality multiplier | 1.5 | Applied to sqrt(weighted avg) |
| Min tweets for full engagement | 10 | Volume multiplier denominator |
| Engagement cap | 60 | Hard ceiling |
| Followers per growth point | 2,000 | Absolute growth |
| Growth rate multiplier | 5 | Per 1% growth |
| Growth cap | 40 | 20 absolute + 20 rate |
| Viral thresholds | 10K/50K/100K | 4/7/12 points |
| Max viral tweets | 3 | Per influencer per week |
| Viral cap | 25 | Hard ceiling |
| Captain multiplier | 1.5 | Applied to base total |
| Spotlight bonuses | 12/8/4 | Flat points, top 3 voted |

---

## 7. Contest System — Consolidation Plan

### The Problem

Two competing contest APIs with different:
- Database tables (`fantasy_contests` vs `prized_contests`)
- Entry tables (`user_teams`/`team_picks` vs `free_league_entries`/`prized_entries`)
- Feature coverage (quests, activity, achievements)
- Response formats

### The Decision

**`prizedContestsV2.ts` is the canonical API.** It has the modern schema, Tapestry integration, and cleaner code.

### What prizedContestsV2 Is Missing (Port from league.ts)

| Feature | league.ts | prizedContestsV2.ts | Action |
|---------|-----------|---------------------|--------|
| Quest triggers | ✅ | ❌ | PORT: Add quest triggers on entry/win |
| Activity feed | ✅ | ❌ | SKIP: Activity feed is dead weight |
| Achievement checks | ✅ (partial) | ❌ | PORT: Add draft/ranking achievement checks |
| Live scoring estimation | ✅ | ❌ | SKIP: Use polling instead |
| Spotlight voting | ✅ | ❌ | SKIP: No vote table exists, feature is unfinished |
| Player transfers | ✅ | ❌ | SKIP: Not in hackathon spec |
| FS earning on entry | ✅ | ✅ | OK |
| Tapestry team storage | ❌ | ✅ | OK |

### Minimum Viable Fix (2 hours)

Add to `prizedContestsV2.ts` POST `/contests/:id/enter-free`:
```typescript
// After successful entry, add:
questService.triggerAction(userId, 'contest_entered', { contestId: id });
questService.triggerAction(userId, 'first_contest', { contestId: id });
```

Add to contest finalization:
```typescript
// After rankings calculated:
questService.triggerAction(userId, 'contest_won', { contestId });     // if rank === 1
questService.triggerAction(userId, 'contest_top_10', { contestId });  // if percentile <= 10
questService.triggerAction(userId, 'contest_top_50', { contestId });  // if percentile <= 50
```

### Contest Lifecycle (Target)

```
OPEN → LOCKED → SCORING → FINALIZED

OPEN:
  - Players can enter (POST /enter-free)
  - Teams can be updated (PUT /update-free-team)
  - Duration: Contest start → lock_time

LOCKED:
  - No more entries or updates
  - Scoring snapshots captured
  - Duration: lock_time → end_date

SCORING:
  - End-of-week snapshot captured (Sunday 23:55 UTC)
  - Deltas calculated (Monday 00:10 UTC)
  - V2 formula applied to all teams
  - Rankings updated

FINALIZED:
  - Results locked
  - FS awards distributed
  - Quests triggered (win, top 10%, top 50%)
  - Scores stored on Tapestry
  - Duration: Permanent
```

### Contest Types (Hackathon)

Only one active for demo:

| Type | Entry | Duration | Team Size | Captain | Players |
|------|-------|----------|-----------|---------|---------|
| FREE_LEAGUE | Free | 7 days | 5 | Yes (1.5x) | 10-1000 |

Post-hackathon: WEEKLY_STARTER (0.002 SOL), WEEKLY_STANDARD (0.01 SOL), DAILY_FLASH (24h, 3-player)

---

## 8. Quest & Achievement System — Cleanup

### Current State: Two Parallel Systems

**System A: Quest Service** (`questService.ts`, 445 lines)
- 23 quest definitions (6 onboarding, 5 daily, 5 weekly, 7 achievement-type)
- 5 quests deactivated (depend on unbuilt features)
- Progress tracking works
- FS rewards defined but **never actually awarded**

**System B: Achievement Service** (`achievementService.ts`, 246 lines)
- 8+ achievement definitions (hardcoded)
- Awards XP (legacy system), not FS
- 3 of 12 check functions never called
- Different naming convention than quests

### The Decision

**Keep Quest Service. Cut Achievement Service.**

Rationale:
- Quest service has better architecture (DB-defined, period-based, progress tracking)
- Achievement service is hardcoded and disconnected
- For hackathon, quests provide enough gamification
- Achievement system can be rebuilt post-hackathon as a quest type

### Quest Fixes Needed

**Fix 1: Award FS on quest completion (1 hour)**
```typescript
// In questService.updateProgress(), when quest completes:
if (result.isCompleted && !result.alreadyClaimed) {
  await foresightScoreService.earnFs({
    userId,
    reason: questId,
    baseAmount: quest.fs_reward,
    category: 'engagement',
  });
}
```

**Fix 2: Remove deactivated quests from code (30 min)**
Delete references to: `daily_prediction`, `daily_share_take`, `achieve_viral_pick`, `achieve_oracle`, `achieve_diamond_hands`

**Fix 3: Wire quest triggers in prizedContestsV2 (30 min)**
Add `questService.triggerAction()` calls for contest entry/win/placement.

### Active Quests for Hackathon

| Quest | Type | Target | FS Reward | Status |
|-------|------|--------|-----------|--------|
| Connect wallet | Onboarding | 1 | 25 | ✅ Working |
| Set username | Onboarding | 1 | 25 | ✅ Working |
| Create first team | Onboarding | 1 | 50 | ✅ Working |
| Enter first contest | Onboarding | 1 | 50 | ⚠️ Needs wiring |
| Daily login | Daily | 1 | 10 | ✅ Working |
| Check live scores | Daily | 1 | 15 | ✅ Working |
| Browse CT feed | Daily | 1 | 10 | ✅ Working |
| Enter weekly contest | Weekly | 1 | 50 | ⚠️ Needs wiring |
| Finish top 50% | Weekly | 1 | 100 | ⚠️ Needs wiring |
| Finish top 10% | Weekly | 1 | 200 | ⚠️ Needs wiring |
| First contest win | Achievement | 1 | 500 | ⚠️ Needs wiring |
| 7-day streak | Achievement | 7 | 300 | ✅ Working |

---

## 9. Twitter Data Pipeline — Reliability

### Architecture

```
TwitterAPI.io → twitterApiIoService.ts → weekly_snapshots table
                                       → ct_tweets table
                                       → influencers table (metrics)
```

### What Works Well (KEEP)

- Rate limiting: 5.5s between requests (free tier safe)
- Retry logic: 3 attempts with exponential backoff
- Cost tracking: Every API call logged with cost estimate
- Data validation: Profile and tweet data validated before storage
- Failure tracking: `consecutive_failures` counter per influencer
- Raw response storage: Full API response saved for debugging

### What Needs Fixing

| Issue | Severity | Fix | Effort |
|-------|----------|-----|--------|
| CT Feed not auto-refreshing | HIGH | Add cron job every 6 hours | 10 min |
| Rising stars table empty | MEDIUM | Seed manually or query by growth rate | 30 min |
| No API key validation at startup | HIGH | Throw error if key missing | 5 min |
| No auto-deactivation for dead accounts | LOW | Skip for hackathon | — |
| Avatar URLs may break (unavatar.io) | MEDIUM | Cache during snapshot | 15 min |

### Snapshot Timing (Cron Schedule)

```
Monday  00:05 UTC → captureStartOfWeekSnapshot()  [~9 min for 100 influencers]
Sunday  23:55 UTC → captureEndOfWeekSnapshot()     [~9 min]
Monday  00:10 UTC → calculateWeeklyContestScores() [~2 min]
```

**Risk:** If end snapshot takes >5 min, scoring may start before it finishes.

**Fix for hackathon:** Manually trigger snapshots before demo. Don't rely on cron for the demo.

### Cost

~$0.64/week for all API calls. Negligible.

---

## 10. Tapestry Integration — Deep Plan

### SDK Usage

```typescript
import { SocialFi } from 'socialfi';

const client = new SocialFi({
  baseURL: 'https://api.usetapestry.dev/api/v1',
});
```

### Integration Points (5 Total)

#### 1. Profile Creation (on signup) — EXISTS, NEEDS API KEY
```
Trigger: POST /api/auth/verify (new user)
Action: tapestryService.findOrCreateProfile(walletAddress, username)
Data stored: { username, walletAddress, blockchain: 'SOLANA', app: 'foresight' }
DB update: users.tapestry_user_id = profile.id
```

#### 2. Team Storage (on draft) — EXISTS, NEEDS API KEY
```
Trigger: POST /api/v2/contests/:id/enter-free
Action: tapestryService.storeTeam(profileId, userId, teamData)
Data stored: { contestId, picks: [{influencerId, tier, isCaptain, price}], captainId }
```

#### 3. Score Storage (on finalization) — EXISTS, NEEDS WIRING
```
Trigger: Contest finalization (cron or manual)
Action: tapestryService.storeScore(profileId, userId, scoreData)
Data stored: { contestId, totalScore, rank, breakdown: {activity, engagement, growth, viral} }
```
**Fix:** Call storeScore() in contestFinalizationService after rankings calculated.

#### 4. Verification Badge (frontend) — EXISTS, NEEDS POLISH
```
Component: TapestryBadge.tsx
Variants: inline (leaderboard), card (profile), confirmation (after draft)
Shows: "Verified on Tapestry" with link to explorer
```
**Fix:** Ensure badge appears on Draft success, Profile, and Leaderboard entries.

#### 5. Score Verification Endpoint — NEW, BUILD
```
GET /api/tapestry/verify/:userId/:contestId
→ Fetches score from Tapestry Protocol
→ Compares with PostgreSQL score
→ Returns { match: boolean, tapestryScore, dbScore, tapestryContentId }
```
**Purpose:** Judges can verify scores are really on-chain. This is the "provably fair" moment.

### Tapestry Demo Script (For Judges)

> "Let me show you something. This player's score is 127 points, rank #3. But don't trust our database — let me verify it on-chain."
>
> *Clicks "Verify on Tapestry" badge*
>
> "See? Same score, stored on Solana via Tapestry Protocol. Immutable. If we tried to change this score in our database, the Tapestry record would expose the discrepancy. That's the anti-fraud layer that Friend.tech never had."

---

## 11. Frontend Architecture

### Tech Stack
- React 18 + Vite + TailwindCSS
- Auth: Privy SDK (`@privy-io/react-auth`)
- Icons: Phosphor Icons
- Animations: Framer Motion
- HTTP: Axios
- Routing: React Router v7

### State Management
- **AuthContext** — Unified auth state (isConnected, address, login, logout)
- **OnboardingContext** — First-visit detection, tutorial progression
- **ToastContext** — Global notifications
- **NotificationContext** — Rich notifications (title + message)
- **AchievementToastContext** — Achievement unlock celebrations
- **RealtimeContext** — Mock event stream (placeholder for WebSocket)

### Pages (6 Total)

| Page | Route | Purpose | Data Sources |
|------|-------|---------|--------------|
| Home | `/` | Landing page, formation hero, CTAs | None (static) |
| Draft | `/draft` | Team builder, 5 picks, captain, budget | `/api/league/influencers`, `/api/v2/contests/:id` |
| Compete | `/play` | Rankings (FS/Fantasy/XP) + Contest discovery | `/api/v2/fs/leaderboard`, `/api/v2/contests` |
| Contest Detail | `/contest/:id` | Contest rules, leaderboard, user entry | `/api/v2/contests/:id`, entries |
| Intel/Feed | `/feed` | CT tweets, influencer profiles, rising stars | `/api/ct-feed`, `/api/league/influencers` |
| Profile | `/profile` | User stats, teams, Tapestry status | `/api/v2/fs/me`, `/api/auth/tapestry-status` |

### Design Tokens
- **Primary:** Gold (#F59E0B) — CTAs, achievements, wealth
- **Secondary:** Cyan (#06B6D4) — Links, accents, energy
- **Background:** Gray-950 (#09090B) — Dark, casino atmosphere
- **Surface:** Gray-800 (#27272A) — Cards, elevated elements
- **Success:** Emerald-500 (#10B981)
- **Error:** Rose-500 (#F43F5E)
- **Typography:** Plus Jakarta Sans (display), Inter (body), JetBrains Mono (data)
- **NO PURPLE.** Ever.

### Key Components
- `FormationPreview` — The visual hook (2-3 formation, captain highlighted)
- `ForesightScoreDisplay` — FS badge in header
- `TapestryBadge` — "Verified on Tapestry" social proof
- `EngagementBanner` — Contest promotion / onboarding nudge
- `PageTransition` — Smooth route transitions

---

## 12. Deployment & Infrastructure

### Target Stack

| Service | Provider | Why |
|---------|----------|-----|
| Frontend | Vercel | Free tier, instant deploys, edge CDN |
| Backend | Railway | $5/mo, auto-deploy from git, easy Postgres |
| Database | Railway Postgres | Same platform, low latency to backend |
| Domain | foresight.gg | Already referenced in codebase |

### Environment Variables (Production)

```bash
# Backend
DATABASE_URL=postgresql://...
JWT_SECRET=<32-byte-hex>
PRIVY_APP_ID=<from privy.io>
PRIVY_APP_SECRET=<from privy.io>
TAPESTRY_API_KEY=<from usetapestry.dev>
TWITTER_API_IO_KEY=<api-key>
FRONTEND_URL=https://foresight.gg
NODE_ENV=production
PORT=3001

# Frontend
VITE_API_URL=https://api.foresight.gg
VITE_PRIVY_APP_ID=<same as backend>
```

### Deployment Checklist

- [ ] Railway: Create project, add Postgres addon
- [ ] Railway: Deploy backend from git, set env vars
- [ ] Railway: Run migrations (`knex migrate:latest`)
- [ ] Railway: Seed demo data (`knex seed:run`)
- [ ] Vercel: Deploy frontend from git, set env vars
- [ ] DNS: Point foresight.gg to Vercel, api.foresight.gg to Railway
- [ ] Test: Auth flow end-to-end on production
- [ ] Test: Draft a team, verify Tapestry badge
- [ ] Test: Leaderboard loads with demo data
- [ ] Manually capture Twitter snapshots
- [ ] Run scoring on demo contest
- [ ] Final visual QA on mobile + desktop

---

## 13. Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Privy modal confuses judges | MEDIUM | CRITICAL | Pre-login backup account, test flow 5x |
| Tapestry API key not working | LOW | HIGH | Get key ASAP, test in dev first |
| Twitter API down during demo | LOW | MEDIUM | Pre-capture snapshots, seed realistic scores |
| Scoring shows 0 for all teams | MEDIUM | HIGH | Manually verify snapshots before demo |
| Frontend crash during demo | LOW | CRITICAL | Error boundaries, test all pages |
| Database migration fails on prod | MEDIUM | HIGH | Test migrations on staging first |
| Demo video too long/unfocused | MEDIUM | HIGH | Script it, practice, 2:45 target |
| Other teams have better on-chain | MEDIUM | MEDIUM | Our UX polish beats raw complexity |

### #1 Failure Mode: Auth Friction

If the Privy modal is confusing to judges, the demo dies in the first 30 seconds.

**Prevention:**
1. Have a pre-logged-in backup account
2. Custom Privy messaging ("Join 2,800+ players")
3. Test auth flow 5+ times before demo
4. If auth fails: "Let me show you with our demo account"

---

## 14. 5-Day Build Plan

### Day 1 (Feb 23): Backend Cleanup + Tapestry

**Morning (4 hours):**
- [ ] Remove SIWE from backend (auth.ts, package.json)
- [ ] Remove ethers.js from backend (prizedContestsV2.ts, package.json)
- [ ] Remove EVM contract code (/verify-entry endpoint, getV2Contract())
- [ ] Remove Ethereum wallet fallback from privy.ts
- [ ] Delete frontend/src/config/abis.ts
- [ ] Run `npx tsc --noEmit` — must pass clean

**Afternoon (4 hours):**
- [ ] Get Tapestry API key from usetapestry.dev
- [ ] Configure TAPESTRY_API_KEY in .env
- [ ] Test: Create user → verify Tapestry profile created
- [ ] Wire storeScore() into contest finalization
- [ ] Test: Finalize contest → verify score stored on Tapestry
- [ ] Fix random fallback scoring (remove `Math.random()` line)

### Day 2 (Feb 24): Contest Consolidation + Quests

**Morning (4 hours):**
- [ ] Add quest triggers to prizedContestsV2.ts (contest entry, win, placement)
- [ ] Fix quest FS reward awarding (call foresightScoreService.earnFs)
- [ ] Remove deactivated quest definitions
- [ ] Consolidate scoring: prizedContestsV2 must use fantasyScoringService

**Afternoon (4 hours):**
- [ ] Add CT Feed auto-refresh to cron (every 6 hours)
- [ ] Seed rising stars data (top 5 by growth rate)
- [ ] Add startup validation for API keys (Twitter, Tapestry, Privy)
- [ ] Test full contest lifecycle: Create → Enter → Score → Finalize → FS award

### Day 3 (Feb 25): Deployment + Integration Testing

**Morning (4 hours):**
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Configure production environment variables
- [ ] Run migrations + seed data on production
- [ ] DNS setup (foresight.gg + api.foresight.gg)

**Afternoon (4 hours):**
- [ ] End-to-end test on production: Signup → Draft → Leaderboard
- [ ] Verify Tapestry integration on production
- [ ] Manually capture Twitter snapshots for demo contest
- [ ] Run scoring on demo contest, verify leaderboard
- [ ] Test on mobile (responsive QA)
- [ ] Fix any production-only bugs

### Day 4 (Feb 26): Polish + Demo Video

**Morning (4 hours):**
- [ ] Polish: Formation visual (hero + draft + profile)
- [ ] Polish: Leaderboard (user position highlight, rank badges)
- [ ] Polish: Tapestry badges visible on all relevant pages
- [ ] Polish: Onboarding flow (< 2 min from signup to leaderboard)

**Afternoon (4 hours):**
- [ ] Record demo video (2:45-3:00, 1920x1080)
- [ ] Structure: Problem (30s) → Solution (90s) → Impact (45s)
- [ ] Key shots: Formation visual, live leaderboard, Tapestry verification
- [ ] Edit video, add captions if needed
- [ ] Review video 2-3 times, re-record if needed

### Day 5 (Feb 27): Final QA + Submission

**Morning (4 hours):**
- [ ] Full end-to-end test (fresh browser, new wallet)
- [ ] Test auth flow 5 times
- [ ] Test draft flow 3 times
- [ ] Test leaderboard with multiple entries
- [ ] Verify demo contest has realistic data
- [ ] Mobile QA (iPhone Safari, Android Chrome)

**Afternoon (2 hours):**
- [ ] Submit to hackathon
- [ ] Include: Demo video, live URL, GitHub repo, description
- [ ] Final check: All links work, site is live, no errors

---

## 15. Demo Strategy

### The 3-Minute Script

**0:00-0:30 — Problem**
> "SocialFi is dead. Friend.tech launched to massive hype — $50M in fees in 2 months — then collapsed. Why? It was pure speculation. Buy a key, hope the price goes up, sell. No real utility, no identity verification, rampant scamming."

**0:30-0:45 — Thesis**
> "We asked: what if SocialFi had real game mechanics instead of ponzi mechanics? What if you could prove your crypto intuition — not by trading social tokens, but by predicting who's actually influential?"

**0:45-1:00 — Intro**
> "This is Foresight — fantasy sports for Crypto Twitter. Built on Solana with Tapestry Protocol."

**1:00-1:30 — Draft Flow (LIVE)**
> *Show draft page with formation visual*
> "You draft 5 CT influencers within a 150-point budget. Mix S-tier legends with rising stars. Pick a captain for 1.5x points."
> *Select 5 influencers, show budget counting down, select captain*
> "Submit your team. It's stored on Solana via Tapestry — you can verify it."

**1:30-2:00 — Scoring (LIVE)**
> *Show leaderboard*
> "Your team scores based on REAL Twitter engagement. Tweets, likes, retweets, follower growth. Updated 4 times daily."
> *Point to score breakdown*
> "See the breakdown: 28 activity points, 45 engagement, 15 growth, 12 viral. This is your captain — 1.5x multiplier."

**2:00-2:15 — Tapestry Verification (THE WOW MOMENT)**
> *Click Tapestry badge on leaderboard*
> "Every score is stored on Tapestry Protocol. This isn't just our database — it's on Solana, immutable. Anyone can verify."
> "That's the layer Friend.tech never had."

**2:15-2:30 — Feed**
> *Quick flash of CT Feed*
> "Research your picks in the Intel feed. Real tweets, real engagement data."

**2:30-2:45 — Why Now**
> "Fantasy sports is a $25 billion market. Crypto Twitter has 50 million active users. We're applying proven mechanics to an untapped audience — with Solana speed and Tapestry identity."

**2:45-3:00 — Close**
> "Foresight. From signup to leaderboard in under 2 minutes. SocialFi, resurrected."

### The "Wow Moment"

The Tapestry verification — showing that scores exist on-chain and can be independently verified. This is the anti-thesis to Friend.tech's opacity and manipulation.

### Judge Q&A Preparation

| Question | Answer |
|----------|--------|
| "Why Solana?" | Speed. Scoring updates 4x daily, needs fast finality. Tapestry Protocol is Solana-native. |
| "Why not on-chain contracts?" | Deliberate choice. Gameplay stays off-chain for speed, results go on-chain for trust. Friend.tech put everything on-chain and it was still a scam — the issue isn't where the code runs, it's identity. |
| "How do you get users?" | Formation visual creates instant understanding. Leaderboard creates FOMO. Free to play removes friction. |
| "Revenue model?" | Free tier → Paid contests (10% rake) → Premium ($4.99/mo). Same model as DraftKings. |
| "Why Tapestry?" | Identity verification prevents fraud. Portable scores create lock-in. Cross-app social graph is a moat. |

---

## 16. Post-Hackathon Roadmap

### Phase 1: Production (Week 1-2)
- Real-time WebSocket scoring (replace polling)
- Paid contests with SOL entry fees
- Achievement system rebuild (as quest type)
- Email notifications (contest start, results)

### Phase 2: Growth (Week 3-4)
- Referral system (invite friends, earn FS)
- Social sharing (team cards for Twitter)
- Multiple contest types (daily flash, weekly pro)
- Mobile PWA optimizations

### Phase 3: Scale (Month 2-3)
- Solana program for paid contest escrow
- SPL token for platform governance
- Cross-platform integrations (Farcaster miniapp)
- Influencer partnerships and verified profiles

---

## Appendix A: File Map

### Frontend (Key Files)
```
src/App.tsx                          — Privy provider + routing
src/components/Layout.tsx            — Header, nav, wallet button
src/hooks/useAuth.ts                 — Unified auth context
src/hooks/usePrivyAuth.ts            — Privy ↔ backend bridge
src/pages/Home.tsx                   — Landing page
src/pages/Draft.tsx                  — Team builder
src/pages/Compete.tsx                — Rankings + contests
src/pages/ContestDetail.tsx          — Contest page
src/pages/Intel.tsx                  — CT Feed
src/pages/Profile.tsx                — User profile
src/components/FormationPreview.tsx  — Visual formation
src/components/TapestryBadge.tsx     — On-chain verification badge
```

### Backend (Key Files)
```
src/api/auth.ts                      — Auth endpoints (Privy)
src/api/prizedContestsV2.ts          — Contest API (canonical)
src/api/league.ts                    — Legacy league API (deprecate)
src/services/fantasyScoringService.ts — V2 scoring engine
src/services/foresightScoreService.ts — FS economy
src/services/tapestryService.ts      — Tapestry Protocol integration
src/services/twitterApiIoService.ts  — Twitter API client
src/services/weeklySnapshotService.ts — Snapshot capture
src/services/questService.ts         — Quest tracking
src/services/cronJobs.ts             — Scheduled tasks
src/utils/privy.ts                   — Privy client wrapper
src/middleware/auth.ts               — JWT middleware
```

---

## Appendix B: Database Schema (Key Tables)

```
users                    — User profiles + auth + FS link
sessions                 — JWT sessions
foresight_scores         — FS totals, tiers, ranks
foresight_score_transactions — FS audit trail
prized_contests          — Contest definitions
free_league_entries      — Free league team entries
contest_types            — Contest type configs
influencers              — 100 CT influencers
weekly_snapshots         — Twitter metric snapshots
ct_tweets                — CT Feed tweets
quest_definitions_v2     — Quest configs
user_quests_v2           — User quest progress
```

---

*This document is the single source of truth for the hackathon sprint. All decisions are locked. Execute the 5-day plan. Ship it.*
