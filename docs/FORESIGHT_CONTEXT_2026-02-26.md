# Foresight — Full Project Context
## For AI assistants, new team members, or anyone needing complete context
### Last updated: February 26, 2026

---

## 1. WHAT IS FORESIGHT?

**Foresight is fantasy sports for Crypto Twitter.**

Players draft teams of 5 real CT influencers, earn points based on those influencers' actual Twitter activity during a contest week, and compete against other players for prizes. Think Fantasy Premier League or DraftKings, but instead of football players or athletes, you're picking Saylor, Lyn Alden, Ansem, and Vitalik.

The core insight: CT is already tribal. Bitcoin maxis, ETH builders, Solana degens, macro traders — they all have fierce opinions about whose calls are better, who's the real alpha source, whose framework is right. Foresight just puts a scoreboard on arguments that are already happening every day on CT.

**The viral loop:**
1. Player drafts their favourite CT voices as a team
2. Their team wins a week
3. Player brags on CT: "My team of Saylor + Lyn Alden + Ansem just won $50"
4. CT people see it, immediately disagree with the team selection
5. They join to prove their roster is better
6. The influencers themselves might tweet "apparently I'm in a fantasy game" — their followers flood in

---

## 2. CURRENT CONTEXT — WHERE WE ARE RIGHT NOW

**Date:** February 26, 2026
**Hackathon deadline:** February 27, 2026 (tomorrow)
**Hackathon:** Solana Graveyard Hackathon
**Deployment status:** Live in production (Railway backend + Vercel frontend)

The product is fully functional and deployed. The main areas of active work right now are:
1. **Influencer roster overhaul** — current roster has quality/authenticity issues, being fixed
2. **Mobile UX** — recently overhauled (fixes shipped Feb 26)
3. **Career History tab** — planned, backend endpoint exists, frontend implementation in progress

---

## 3. TECH STACK

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TailwindCSS, port 5173 |
| Backend | Express + TypeScript + Knex.js, port 3001 |
| Database | PostgreSQL |
| Auth | Privy (email, Twitter, Solana wallet login) |
| Social/On-chain | Tapestry Protocol (Solana social graph, `socialfi` npm package) |
| Chain | Solana |
| Twitter Data | TwitterAPI.io service (670+ lines in `twitterApiIoService.ts`) |
| Icons | Phosphor Icons exclusively |
| Fonts | Plus Jakarta Sans (display), Inter (body), JetBrains Mono (data) |
| Deployment | Vercel (frontend), Railway (backend) |

**Design system:** Gold (#F59E0B) + dark (#09090B) theme. NO purple. Gold is primary CTA, cyan (#06B6D4) is secondary accent. Tier colours: S=gold, A=cyan, B=emerald, C=gray.

**Dev commands:**
```bash
cd backend && NODE_OPTIONS='--import tsx' pnpm dev   # backend :3001
cd frontend && pnpm dev                               # frontend :5173
cd backend && NODE_OPTIONS='--import tsx' pnpm exec knex migrate:latest
```

---

## 4. APPLICATION STRUCTURE

### Routes (frontend)
```
/           → Home.tsx        — Dashboard, daily actions, formation preview
/compete    → Compete.tsx     — Leaderboards, contest browser, rankings
/feed       → Intel.tsx       — CT Feed (curated tweets from influencers)
/profile    → Profile.tsx     — Stats, achievements, career history, Tapestry
/draft      → Draft.tsx       — Formation builder, influencer grid, captain pick
/contest/:id → ContestDetail.tsx — Contest rules, prizes, timeline, entry
/progress   → Progress.tsx    — Quests, XP, Foresight Score breakdown
/settings   → Settings.tsx    — Account settings, notifications
/referrals  → Referrals.tsx   — Referral program
/card-compare → CardCompare.tsx — Design tool (internal)
```

### Backend API files (`backend/src/api/`)
| File | Purpose |
|------|---------|
| `league.ts` | Core game: influencers, teams, scoring, leaderboard, voting |
| `prizedContestsV2.ts` | Paid contests, entries, claiming prizes, history |
| `auth.ts` | Privy auth, JWT tokens, Tapestry sync |
| `tapestry.ts` | Social graph: follows, social counts, content |
| `ctFeed.ts` | CT Feed tweet curation |
| `foresightScore.ts` | Foresight Score (XP system) |
| `achievements.ts` | Achievement badges |
| `quests.ts` | Quest system |
| `referrals.ts` | Referral tracking |
| `users.ts` | User profile data |
| `intel.ts` | Influencer intel/profiles |
| `activity.ts` | Activity feed |
| `watchlist.ts` | Watchlist feature |

### Backend Services (`backend/src/services/`)
| File | Purpose |
|------|---------|
| `tapestryService.ts` | Tapestry Protocol SDK integration |
| `twitterApiIoService.ts` | Twitter data fetching (primary) |
| `fantasyScoringService.ts` | Score calculation logic |
| `foresightScoreService.ts` | XP/Foresight Score logic |
| `ctFeedService.ts` | CT Feed curation |
| `achievementService.ts` | Achievement unlock logic |
| `questService.ts` | Quest progression |
| `cronJobs.ts` | Scheduled scoring updates |
| `leagueService.ts` | League business logic |

---

## 5. GAME MECHANICS (complete)

### Team Structure
- 5 players per team: **1 Captain (2× score multiplier) + 4 regular picks**
- Budget: **150 draft points**
- Contests run Monday 12:00 UTC → Sunday 23:59 UTC
- Scores update **4× per day**

### Scoring Formula
```
Weekly Score = Activity + Engagement + Growth + Viral

Activity Score (max 35 pts):
  - 1.5 pts per original tweet (retweets excluded)
  - Capped at 35 pts (~23 tweets/week = optimal)

Engagement Score (max 60 pts):
  - Weighted: (Replies×3 + Retweets×2 + Likes×1)
  - Square root applied across all tweets to prevent single viral domination
  - Replies worth 3× because they signal real debate, not passive consumption

Growth Score (max 40 pts):
  - Absolute follower gain + % growth rate, combined
  - Fast-growing smaller accounts can outscore large stagnant ones

Viral Score (max 25 pts):
  - 4-12 pts per tweet breaking 10K engagements
  - Bonus multiplier for 100K+ viral moments
  - The "lottery ticket" mechanic

Captain: their total score × 2.0
```

### Influencer Tiers & Prices
```
S-Tier: 4 influencers  → $38-48 draft points
A-Tier: 16 influencers → $25-35 draft points
B-Tier: 30 influencers → $18-25 draft points
C-Tier: 50 influencers → $12-18 draft points
TOTAL:  100 influencers
```

### Influencer Archetypes (computed at runtime in `league.ts`)
- **Activity Beast** — tweets 25-40×/week, reliable floor score
- **Engagement Wizard** — fewer tweets but massive reply/RT ratios
- **Growth Machine** — rapidly growing follower count
- **Viral Sniper** — infrequent but explosive when they post
- **All-Rounder** — balanced across all categories

---

## 6. TAPESTRY PROTOCOL INTEGRATION

Tapestry is a Solana social graph protocol — it stores profiles, follows, and content on-chain using Merkle proofs. We use it as:

1. **Identity layer** — wallet address → Tapestry profile (called during auth)
2. **Team storage** — each drafted team stored as Tapestry "content" on Solana
   - Content ID format: `foresight-team-{userId}-{contestId}`
3. **Score storage** — contest scores stored as immutable Tapestry content
4. **Social graph** — follows between users tracked on Tapestry
5. **Bounty** — there's a $5K Tapestry bounty in the hackathon ($2.5K/1.5K/1K split)

**File:** `backend/src/services/tapestryService.ts`
**API file:** `backend/src/api/tapestry.ts`
**Status:** Integration complete and working. The Profile page shows Tapestry status, follower/following counts, and teams stored on-chain.

**Key message for judges:** Foresight uses Tapestry as a permanent, on-chain record of every draft decision — your picks and scores live on Solana forever, not just in our database.

---

## 7. AUTH SYSTEM

**Provider:** Privy
**Login methods:** Email, Twitter, Solana wallet (all three now enabled)
**Key files:**
- `backend/src/api/auth.ts` — JWT generation, Tapestry sync
- `frontend/src/App.tsx` — PrivyProvider config + PrivyAuthBridge
- `frontend/src/hooks/usePrivyAuth.ts` — auth sync logic
- `frontend/src/hooks/useAuth.ts` — AuthContext

**Flow:**
1. User logs in via Privy (email/Twitter/wallet)
2. Frontend calls `/api/auth/privy` with Privy access token
3. Backend verifies, creates/finds user in DB, issues JWT
4. JWT stored in `localStorage.authToken`
5. Tapestry profile created/synced in background (non-blocking)

**Important:** We recently added email + Twitter login because mobile users don't have wallet browser extensions. Previously only wallet login was enabled, which blocked all mobile users.

---

## 8. FEATURES BUILT (complete inventory)

### Core Game Loop ✅
- [ x ] Influencer roster (100 influencers, S/A/B/C tiers) — *being overhauled (see Section 11)*
- [ x ] Draft page with formation visual (5-slot), captain selection, budget system
- [ x ] Weekly contests (free + paid)
- [ x ] Live scoring (4× daily updates via cron)
- [ x ] Leaderboard with rankings
- [ x ] Contest entry (free contests working, paid contest flow exists)
- [ x ] Prize claiming mechanism

### Social / Profile ✅
- [ x ] Profile page with tabs: Overview, Teams, Watchlist, Stats, History
- [ x ] Foresight Score (XP system with levels)
- [ x ] Achievement badges
- [ x ] Quest system (Progress page)
- [ x ] Referral system
- [ x ] Watchlist (follow/track influencers)
- [ x ] Career History tab (backend endpoint `/api/v2/me/history` exists, frontend implemented)
- [ x ] Tapestry social counts (followers/following/teams on-chain)

### CT Feed ✅
- [ x ] Curated tweet feed from top 100 influencers
- [ x ] Highlights section (top viral tweets)
- [ x ] Rising Stars tab
- [ x ] Feed interactions (likes, saves)
- [ x ] Real Twitter photos via unavatar.io

### UX / Polish ✅
- [ x ] Mobile bottom navigation (4 items: Home/Compete/Feed/Profile)
- [ x ] Page transitions (PageTransition component)
- [ x ] Toast notifications
- [ x ] Achievement toast system
- [ x ] Engagement banner
- [ x ] Onboarding context
- [ x ] Error boundary
- [ x ] Share team card (viral sharing with canvas generation)
- [ x ] Desktop header navigation
- [ x ] Foresight Score display in header

### Legal / Meta ✅
- [ x ] Terms of service page
- [ x ] Privacy policy page
- [ x ] Cookie policy page
- [ x ] Imprint page
- [ x ] Full OG meta tags, Twitter cards
- [ x ] Logo (eye/aperture SVG)

---

## 9. RECENT WORK (last 3 days — Feb 24-26)

### Feb 26 — Mobile UX Overhaul (latest)
**Problem:** App had horizontal scroll on all pages, homepage looked broken on mobile, formation cards too large for mobile viewport.

**Root causes found and fixed:**
1. `absolute -inset-4` glow div in Home.tsx extending 16px beyond container — changed to `absolute inset-0`
2. Header `-mx-4 sm:-mx-6` extending past viewport — removed
3. No `overflow-x: hidden` globally — added to html/body/#root in index.css

**Also fixed:**
- Home.tsx completely rewritten with separate mobile (<lg) and desktop (lg+) sections. Mobile gets compact hero: tight badge row, 4xl headline, full-width CTA, 5-slot tier teaser (circles). Desktop keeps full FormationPreview component.
- Privy auth updated: added `email` and `twitter` to `loginMethods` (previously only `wallet`) so mobile users without extensions can sign in
- Compete.tsx: follow button always visible on mobile (was hidden without hover)
- FormationTeam.tsx: X remove button always visible on mobile (was opacity-0)
- InfluencerGrid.tsx: removed nested scroll container that was causing double-scroll

### Feb 25-26 — Branding + Profile Card
- New logo: eye/aperture SVG (`/logo.svg`)
- Profile page got a "certificate" style card design
- Full OG meta tags added
- Various profile card explorations documented (badge, certificate, racing license concepts)

### Feb 25 — Deployment
- Railway backend deployment configured
- Vercel frontend deployment configured
- CORS, rate limits, env vars all set for production

### Feb 24-25 — Various fixes
- Bad C-tier handles removed (fake handles from DB)
- Real Twitter photos added to CT feed
- Banner links fixed
- Rate limits raised for production load

---

## 10. HACKATHON SUBMISSION REQUIREMENTS

**Hackathon:** Solana Graveyard Hackathon
**Deadline:** February 27, 2026, 11:59 PM UTC

### What judges look for
The hackathon has a **Tapestry Protocol bounty** (the main prize we're targeting):
- **40%** — Quality of Tapestry integration (how deeply do you use the protocol?)
- **30%** — Innovation (novel use case for social graph)
- **20%** — Polish (does the product look and feel real?)
- **10%** — Narrative (can you tell the story clearly?)

### Tapestry bounty prize
- 1st place: $2,500
- 2nd place: $1,500
- 3rd place: $1,000

### What we have for judges
✅ Profile storage via Tapestry (wallet → Tapestry profile on Solana)
✅ Team storage as Tapestry content (each draft = permanent on-chain record)
✅ Score storage as immutable Tapestry content
✅ Follow relationships between users on Tapestry
✅ Social counts displayed on profile (followers/following/teams on-chain)
✅ "Tapestry verified" badge on career history entries
✅ Clean UI that shows Tapestry data naturally (not bolted on)

### Still needed for submission
- [ ] Demo video (3 minutes, walkthrough narrative: sign in → draft team → see it on Tapestry)
- [ ] Clean GitHub README with Tapestry integration explained
- [ ] Final QA pass on the demo flow

### Demo narrative (what to show in video)
1. Sign in with email (no wallet needed — accessible)
2. Browse influencer roster — CT recognisable names, tiered by influence
3. Draft a team of 5 (Captain selection is strategic choice)
4. See your team stored on Solana via Tapestry ("Your team is permanently on-chain")
5. Go to Profile → Tapestry section: show follower count, teams stored on-chain count
6. Go to Career History: past contest performance, each entry has Tapestry verified badge
7. Leaderboard: compete with others, scores updating in real time

---

## 11. INFLUENCER ROSTER — CURRENT STATUS (CRITICAL)

**This is the most important open issue.**

### The problem
The current 100-influencer roster in the DB has:
- **Fake/nonexistent handles:** `notthreadguy`, `caborottt`, `taborottt`, `solloyd_`, `nebaborottt` (already patched in migration `20260226000003_fix_bad_handles.ts` but replacements need to be real)
- **Randomly seeded engagement data** (Math.random()) instead of real metrics
- **Wrong tier placements** (CoinDesk in C-tier despite 2M followers; it's a brand account not an influencer)
- **Protocol/brand accounts** that aren't individuals: `bonk_inu`, `marginfi`, `driftprotocol`, `arkham`

### What we did
1. Ran Grok (which has live Twitter access) through a structured 5-batch research process
2. Grok produced a cleaned 100-influencer list with verified handles, tier assignments, prices, and archetypes (as of Feb 26 2026)
3. We reviewed the output and applied corrections:
   - Moved `@naval`, `@chamath`, `@CryptoHayes` from C-tier to B-tier (too influential for C)
   - Removed `@bonk_inu`, `@marginfi`, `@driftprotocol`, `@arkham` (not individuals)
   - Flagged `@rogerkver` for review (convicted of tax fraud 2024)
   - Flagged possible duplicate: `@0xMert_` vs `@mertmumtaz`
4. Created a review document (`docs/CT_ROSTER_REVIEW.md`) being sent to a CT-active friend for validation

### Micro accounts status
Grok also surfaced 52 sub-5K follower "micro-credible" CT accounts. **~30-40% of these are likely hallucinated** — handles like `@NFTPhilosopher`, `@BuilderThesis`, `@CycleAustrian` are too descriptive/generic to be organic Twitter accounts. Do NOT add these to DB until each handle is manually verified on Twitter.

### Next step
Once CT friend validates the main 100 roster → build migration `20260227000001_overhaul_influencer_roster.ts` to update the DB.

---

## 12. CAREER HISTORY FEATURE — STATUS

### What it is
A "History" tab on the Profile page showing a player's past contest performance:
- Career stats row: total contests, wins, best score, avg score
- Expandable past contest cards: rank, score, date, total players
- Picks detail: expand any past contest to see the 5 influencers they picked, with avatars, tiers, score breakdown
- Tapestry verified badge on each entry

### Backend — COMPLETE ✅
Endpoint `GET /api/v2/me/history` exists at `prizedContestsV2.ts` line 1370. Returns:
```typescript
{
  history: [{
    contestId, contestName, score, rank, totalPlayers,
    prizeWon, claimed, startDate, endDate,
    scoreBreakdown: { activity, engagement, growth, viral },
    picks: [{ id, name, handle, tier, avatarUrl, price, isCaptain }],
    tapestryVerified: boolean
  }],
  careerStats: { totalContests, wins, topThree, avgScore, bestScore, bestRank },
  total
}
```

### Frontend — IMPLEMENTED ✅
`Profile.tsx` already has:
- `'history'` tab type defined
- `HistoryEntry` and `HistoryPick` interfaces
- `fetchHistory()` function calling `/api/v2/me/history`
- Lazy loading (only fetches when History tab first opened)
- State: `history[]`, `careerStats`, `historyLoading`, `historyLoaded`, `historyTotal`

**Verification needed:** Take a screenshot of the History tab to confirm it renders correctly end-to-end.

---

## 13. REVENUE MODEL

### Current (hackathon MVP)
- **Free contests:** No cost to enter, no prizes (builds habits, retention)
- **Paid contests:** Entry fee (SOL) → prize pool → we take 10% rake
- This is the revenue engine. Similar to DraftKings model.

### Growth path
1. **Paid contest rake** — scales directly with user count and contest volume
2. **Premium subscription** — $4.99/month for:
   - Advanced draft analytics (who scores most points in which contest types)
   - Historical performance data on influencers
   - Early access to new contest types
   - Portfolio-style team tracking
3. **Sponsored contests** — crypto projects sponsor a contest ("presented by [Protocol]") in exchange for visibility to CT audience. Natural fit since influencers are CT-native.
4. **Data/API** — anonymised aggregated data on CT influencer engagement trends. Valuable to crypto funds, research firms.

### Why this goes viral (organic growth loop)
- Players share winning teams on CT → friends join to prove better roster
- Influencers tweet about being in the game → their followers join
- Cross-faction competition (BTC maxis vs ETH builders) is inherently shareable
- Weekly reset means fresh content every week, sustained engagement
- No capital risk for free contests = low friction for new users

---

## 14. BIGGEST RISKS RIGHT NOW

### 1. Influencer roster authenticity (HIGH — immediate)
The roster is the product's first impression. If CT power users open the app and see fake handles or wrong-tier placements, they'll dismiss it instantly and tweet negatively about it. Fix needed before any CT launch/demo.
**Mitigation:** CT friend review + migration in progress.

### 2. Hackathon deadline (HIGH — 24 hours)
Demo video not yet recorded. GitHub README not cleaned up. Need both before 11:59 PM Feb 27.
**Mitigation:** Core product is done. Just need video recording and README.

### 3. Real Twitter data dependency
Scoring relies on TwitterAPI.io for engagement data. If that API goes down or rate-limits during a contest window, scoring breaks. Currently using random seed data in dev which means scoring will only be meaningful with real API data in prod.
**Mitigation:** Cron jobs handle this, but API reliability is a dependency.

### 4. Tapestry integration completeness for judges
Tapestry bounty is 40% integration quality. Need to make sure judges can see the on-chain data (teams stored, profiles linked) in a clear demo flow.
**Mitigation:** Profile page already shows this. Just needs to be featured prominently in demo video.

### 5. Cold start problem post-hackathon
With no users, leaderboards are empty and the social features feel hollow. Need initial seeded contests with real entries to make the app feel alive on day 1.
**Mitigation:** Demo data seeded in migrations. Need to recruit first 20-50 real users from CT personally.

---

## 15. KEY STRATEGIC DECISIONS (and why we made them)

### "Fantasy sports for CT" framing
CT is already tribal and argumentative. Fantasy sports mechanics turn existing CT behaviour (arguing about whose calls are better) into a game with a scoreboard. This is a natural fit — we're not creating new behaviour, we're scoring behaviour that already exists.

### Solana as the chain
Tapestry Protocol is Solana-native. The hackathon is Solana-focused. The Solana ecosystem has the fastest-growing CT community right now. Aligning with Solana gives us hackathon credibility, a built-in early user base, and Tapestry's on-chain capabilities.

### Privy for auth (not just wallet)
Originally wallet-only auth. Changed to email + Twitter + wallet because: mobile users don't have browser wallet extensions, email/Twitter is far lower friction, we don't need wallets for free contests (only for paid ones). More users through the door > wallet-first purity.

### Tapestry as verification layer, not navigation destination
Early design had "View full history" linking to external Tapestry explorer. Wrong. Tapestry should be a **verification badge** inside our product ("this team is permanently on Solana") not a place we send users away to. Users should never leave the app to see their on-chain data.

### Engagement rate > follower count in scoring
Deliberately chose this. A 150K account with 8% engagement will outscore a 2M account with 0.3% engagement. This makes the game more strategic (big follower count ≠ obvious pick), creates more upset results (David vs Goliath), and reflects how CT actually works (engagement rate is the real signal).

### No purple in design system
Gold + dark is CT-native aesthetics. Purple is associated with "AI slop" and generic Web3 products in 2026. Gold signals premium, winning, high stakes — appropriate for a fantasy sports/gaming product.

---

## 16. IMPORTANT FILE LOCATIONS

| What | Where |
|------|-------|
| Main game logic | `backend/src/api/league.ts` |
| Contest/history API | `backend/src/api/prizedContestsV2.ts` |
| Tapestry integration | `backend/src/services/tapestryService.ts` |
| Twitter data service | `backend/src/services/twitterApiIoService.ts` |
| Scoring logic | `backend/src/services/fantasyScoringService.ts` |
| Profile page | `frontend/src/pages/Profile.tsx` |
| Draft page | `frontend/src/pages/Draft.tsx` |
| Home page | `frontend/src/pages/Home.tsx` |
| App layout + nav | `frontend/src/components/Layout.tsx` |
| Auth context | `frontend/src/hooks/useAuth.ts` |
| Design system CSS | `frontend/src/index.css` |
| Tailwind config | `frontend/tailwind.config.js` |
| DB migrations | `backend/migrations/` |
| CT roster review doc | `docs/CT_ROSTER_REVIEW.md` |
| Grok research prompt | `docs/GROK_INFLUENCER_RESEARCH_PROMPT.md` |
| Tapestry strategy | `docs/TAPESTRY_BOUNTY_STRATEGY.md` |
| Design principles | `docs/design/DESIGN_PRINCIPLES.md` |

---

## 17. WHAT NOT TO DO (lessons learned)

- **Don't add protocol/brand accounts to the influencer roster** — they're companies, not CT voices
- **Don't use hover-only interactions** — mobile users can't hover
- **Don't add extra nav items** — mobile bottom nav is sacred at 4 items max
- **Don't link to external Tapestry explorers** — keep users in the app
- **Don't use purple** — it reads as generic AI/Web3 slop in 2026
- **Don't have wallet-only login** — kills mobile conversion entirely
- **Don't trust AI-generated micro CT account handles** — verify every sub-5K handle manually before adding to DB
- **Don't use absolute -inset-N on full-width containers** — it causes horizontal scroll

---

## 18. IMMEDIATE NEXT STEPS (in priority order)

1. **CT friend validates roster** → implement DB migration for clean 100-influencer list
2. **Record 3-minute demo video** for hackathon submission (focus on Tapestry on-chain story)
3. **Clean GitHub README** — explain Tapestry integration for judges
4. **Verify Career History tab** renders correctly end-to-end
5. **Post-hackathon:** Recruit first 20-50 real CT users personally, seed first paid contest

---

*This document was written on Feb 26, 2026 and covers the full project state as of that date.*
*Update after major changes.*
