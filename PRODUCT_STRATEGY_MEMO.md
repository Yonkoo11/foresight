# FORESIGHT: PRODUCT STRATEGY MEMO
## Strategic Pivot to CT Intelligence Platform
**Date:** February 2026
**Status:** Pre-Launch | Preparing for Relaunch
**Target Launch:** Q1 2026

---

## EXECUTIVE SUMMARY

**Current State:** A fully-built fantasy sports game (12 pages, 27 quests, complex tier system) with zero active users.

**The Pivot:** Transform from "fantasy draft game for CT" into "CT credibility intelligence platform with prediction markets."

**Core Thesis:** Prediction markets did $40B+ in 2025. X banned InfoFi APIs (killing competitors). Creator economy is expanding. **Foresight fills the gap:** Give creators (and their fans) a platform to prove and monetize influence credibility through daily prediction markets on real engagement metrics.

**Success Metric:** 500 DAU, 5% daily retention, $10K monthly GMV within 6 months of launch.

---

## 1. PRODUCT VISION & POSITIONING

### Vision Statement
**"The credibility layer for Crypto Twitter influencers."**

Foresight is where CT influencers prove their value through daily prediction markets, build reputation scores that compound across the network, and create a verifiable track record of their impact. For users, it's the highest-leverage way to participate in the creator economy—not through fan tokens or Discord memberships, but through direct prediction of influence.

### One-Liner
**"Predict daily CT engagement. Build your credibility. Compete for ETH."**

### Primary User Persona

**Name:** Alex | "The Prediction Arbitrageur"

- **Profile:** 28, software engineer or trader with crypto background
- **Current Behavior:** Spends 30-60 min/day on X, uses Zapper/Zerion for portfolio tracking, engages in Discord communities
- **Pain Point:** No way to quantify or profit from strong opinions about "who's really influential on CT"
- **What Drives Them:**
  - Win rate tracking (gamification)
  - Real money upside (even small stakes, $1-5/day)
  - Status signal (leaderboard placement)
  - Edge through information (finding underrated influencers)
- **Job to be Done:** "I want to prove I understand CT culture and influencer impact better than others, and capture modest financial upside while doing it."

### Secondary Personas

1. **Maya | "The Creator"** (15% of users)
   - Small to mid-size CT account (10K-100K followers)
   - Wants proof of her influence/credibility
   - Uses Foresight score to negotiate sponsorships, show brands her reach
   - Motivated by: Status, social proof, monetization leverage

2. **James | "The Market Maker"** (5% of users)
   - Quant trader or market-savvy crypto native
   - Sees prediction market spread opportunities
   - Provides liquidity, catches inefficiencies
   - Motivated by: Edge, arbitrage, alpha generation

---

## 2. FEATURE AUDIT & KILL LIST

### Current State (From Codebase)
- **27 Quests** (onboarding, daily, weekly, achievement)
- **12 Pages** (Home, Draft, Progress, Vote, League, Profile, Feed, etc.)
- **Tier System** (Bronze → Diamond, 5 tiers)
- **Foresight Score** (FS) with multipliers and early-adopter bonuses
- **Fantasy Draft** (5 picks + captain, 150-point budget)
- **CT Feed** (100+ influencers, engagement metrics)
- **Voting/Spotlight** (weekly CT popularity vote)
- **Referral System**
- **Achievement System** (27 achievements across categories)
- **Activity Tracking** (quest-driven)

### KILL (Ruthlessly)
- **Most of the Quest System** (keep 3 onboarding, remove 24 achievement/daily/weekly)
  - *Why:* Quests are friction in a prediction market. One-tap predictions drive engagement, not "complete 7 dailies."
  - *Keep only:* "First prediction," "Connect wallet," "Make 3 predictions" (onboarding validation)

- **Tier System Complexity** (simplify from 5 tiers to 3)
  - *Why:* Bronze/Silver/Gold is cleaner than Bronze/Silver/Gold/Platinum/Diamond
  - *Keep:* Tier progression as status signal, use in prediction weighting

- **Achievements/Badges** (most of them)
  - *Why:* Distraction. Focus on one metric: prediction accuracy score
  - *Keep:* Only "first prediction" and "7-day streak" badges

- **Referral System** (for now)
  - *Why:* Premature. Viral loop only works when core product is addictive
  - *Revisit:* Q2 2026 with proof of DAU/retention

- **Heavy Customization** (team names, custom formations)
  - *Why:* Doesn't matter. Prediction accuracy matters
  - *Replace with:* Simple "You" in prediction UI

- **Spotlight Voting** (move to leaderboard)
  - *Why:* Takes bandwidth away from prediction markets
  - *Keep the data:* Show top-voted influencers in markets, but remove voting as primary action

### SIMPLIFY (Keep but Reduce Scope)

- **Foresight Score (FS) → Credibility Score (CS)**
  - *Current:* Earned through quests, achievements, FS multipliers
  - *New:* Earned through prediction accuracy only
  - *Formula:* CS = (Win Rate % × 100) + (Prediction Volume / 10)
  - *Cap at 1000 CS (Diamond)* for simplicity
  - *Payout:* Top 1% get monthly ETH pool

- **Draft System → Watchlist**
  - *Current:* 5 picks + captain, budget constraints, scoring updates
  - *New:* One-time watchlist of 5-10 influencers you track
  - *Purpose:* Quick reference for their key metrics
  - *Auto-populated:* Top 20 by engagement if user doesn't customize

- **CT Feed → Metrics Dashboard**
  - *Current:* Tweet aggregation, rising stars, engagement tracking
  - *New:* Single view: influencer card with today's metrics
  - *Show:* Tweets today, engagement rate, follower delta, prediction lines open for them

- **Leaderboards** (keep, simplify)
  - *Current:* All-time, season, weekly, referral
  - *New:* All-time & weekly (remove season and referral)

---

## 3. CORE PRODUCT LOOP

### The Daily Habit Loop (Day 1 → Day 30)

```
OPEN FORESIGHT
    ↓
SEE TODAY'S MARKETS (3-5 new markets open each day)
    ↓
PREDICT: Will @influential_person get >5K engagement today?
         Odds: 2.1x if YES / 1.8x if NO
    ↓
PLACE BET ($1-10)
    ↓
CHECK YOUR POSITION (bookmark/watchlist)
    ↓
SEE LIVE METRICS UPDATING (engagement counter)
    ↓
MARKET SETTLES (end of day)
    ↓
CLAIM WINNINGS OR TRY AGAIN TOMORROW
    ↓
SEE YOUR CS (Credibility Score) UPDATE
    ↓
REPEAT (addictive if you hit >60% win rate)
```

### Progression Curve (Day 1 → Day 30)

**Day 1-3 (Activation):**
- Onboard: Connect wallet, fund with $5 testnet ETH
- Make 3 predictions on top influencers (Vitalik, Raydium CEO, etc.)
- See one settle, understand the loop
- See CS: 20 (you made 3 predictions, 2/3 correct)

**Day 4-7 (Competence):**
- Try to beat leaderboard (currently #4,247)
- Find your "edge" (e.g., you're good at predicting morning chaos, afternoon rallies)
- Make 5-7 predictions/day, win rate improves to 55%
- CS: 47

**Day 8-14 (Habit):**
- Check Foresight first thing at 7am (like checking prices on Zerion)
- Develop strategy: bet small on unknowns, larger on high-confidence predictions
- Win rate: 58%
- CS: 73
- See yourself #1,247 on leaderboard (progress!)

**Day 15-30 (Obsession):**
- Predict every day (no-miss streak)
- Win rate: 62% (above 60% = genuinely good predictor)
- CS: 102 (Silver tier unlock)
- Rank: #347 globally
- **Monetization moment:** "If I maintain 62% win rate, I earn ~$50/month"

### Engagement Milestones

| Day | Trigger | CTA | CS | Goal |
|-----|---------|-----|----|----|
| 0 | Signup | "Fund wallet" | - | Reduce friction |
| 1 | First prediction | "Make 2 more" | 5 | Prove concept |
| 3 | 3rd prediction settles | "Try tomorrow" | 20 | Build habit |
| 7 | 7-day streak | "Unlock weekly markets" | 47 | Add variety |
| 14 | Win rate >50% | "You're a real predictor" | 73 | Validation |
| 30 | CS > 100 | "You entered Silver tier" | 102 | Status unlock |

---

## 4. MVP SCOPE FOR RELAUNCH (6 weeks, 1 engineer)

### What Ships
1. **3 Pages** (not 12)
   - **Home** (~40% new): Landing + quick connect
   - **Markets** (~80% new): Today's prediction markets (ONLY page user sees 90% of time)
   - **Profile** (~20% existing): CS, rank, stats, settings

2. **Prediction Markets Engine** (~100% new)
   - 3-5 new markets open daily (automated)
   - Market format: Binary YES/NO on influencer engagement
   - Settlement: End-of-day via automation
   - Odds: Automated market maker (AMM) or simple fixed-odds pool
   - Entry: $1-$10 per prediction (testnet ETH)

3. **Credibility Score (CS)** (~50% new, refactor existing FS)
   - Single formula: Win rate + volume
   - Three tiers: Bronze (0-300), Silver (300-700), Gold (700+)
   - Leaderboard: All-time (weekly reset removed)

4. **Influencer Metrics Dashboard** (~70% existing CT Feed)
   - Live stats: Tweets today, engagement, follower delta
   - Show 3-4 metrics per influencer
   - Auto-refresh every 5 min

5. **SIWE Auth Only** (keep existing)
   - Add one feature: "Fund wallet with testnet ETH" button (link to Testnet Faucet)

### What Gets Cut
- All 27 quests (except 3 onboarding)
- 9 of 12 pages (Arena, Vote, Compete as separate pages, Quests, Leaderboard, Feed, Referrals, Settings moved to Profile)
- Achievements system (replace with simple "streak" counter)
- Tier-based rewards, multipliers, early-adopter bonuses
- Spotlight voting
- Referral system
- Private leagues
- Team transfers

### What Stays Minimal
- Draft/watchlist (simplified to "view" only)
- CT metrics scraping (keep infrastructure, use for market creation)
- Auth middleware (works fine)
- Database (reuse, no schema migration needed)

### Deliverables by Week

| Week | Deliverable |
|------|-------------|
| 1-2 | Markets page UI, prediction entry form, odds display |
| 2-3 | Settlement logic, AMM or fixed-odds pool integration |
| 3-4 | CS calculation + leaderboard |
| 4-5 | Home page redesign, metrics dashboard, onboarding flow |
| 5-6 | Testing, bugfixes, Base testnet deployment |

---

## 5. CREDIBILITY SCORE (CS) PRODUCT DESIGN

### What It Is
A **single, transparent metric** that measures how well someone predicts CT influencer engagement.

### Data Feeds
- **Predictions:** User's YES/NO bets on daily markets
- **Outcomes:** X API → engagement metrics (tweets, likes, retweets, followers)
- **Win/Loss:** Market settlement (automated, deterministic)

### The Formula

```
Credibility Score (CS) =
  (Win Rate % × 50) + (Total Predictions / 20) + Streak Bonus

Win Rate % = (Correct Predictions / Total Predictions) × 100
Streak Bonus = (Current Streak Days / 100), max 10

Examples:
- 60% win rate, 40 predictions, 7-day streak: (60×0.5) + (40/20) + 7 = 39 CS
- 55% win rate, 100 predictions, 30-day streak: (55×0.5) + (100/20) + 10 = 45 CS
- 70% win rate, 200 predictions, 45-day streak: (70×0.5) + (200/20) + 10 = 50 CS
```

**Tiers:**
- Bronze: 0-300 CS
- Silver: 300-700 CS
- Gold: 700+ CS

### Gaming Prevention

**Designed anti-patterns:**
1. **Minimum stake:** $1 per bet (no "free" predictions)
2. **Real outcomes:** Settlement via X API (can't fake it)
3. **Streak resets:** One missed day = restart (incentivizes consistency, not bingeing)
4. **Decreasing returns:** After 100 predictions, each additional prediction adds less to CS (incentivizes quality over volume)
5. **Time-based decay:** CS doesn't decay, but monthly leaderboard resets (fresh challenge)
6. **Cooldown period:** Can't make >10 predictions/day (prevents farming)

### Virality/Shareability

**Makes it shareable:**

```
"I'm 62% accurate on CT predictions 📊
Credibility Score: 247 (Silver)
7-day streak, 143 predictions

Can you beat my win rate? 👇
[LINK TO FORESIGHT]"
```

**Why it spreads:**
- Creators use it as proof of impact
- Traders use it to find edges (follow high-CS predictors)
- FOMO: "Wait, people are making money predicting engagement?"
- Bragging rights: Pure, rankable metric (like Elo rating)

**Influencer Utility:**
- High CS = proof of influence (negotiating power)
- "1000+ Foresight traders predicted my engagement yesterday — I'm culturally relevant"
- Sponsorship deck stat: "Scored 78% on Foresight engagement predictions"

---

## 6. PREDICTION MARKETS PRODUCT DESIGN

### Market Creation (Backend Automation)

**Daily Cycle:**
- 12 AM UTC: Pull top 50 CT influencers by 7-day engagement
- 12:05 AM: Generate 3-5 markets for next 24h
- 6 AM: Market open for predictions
- 11:59 PM: Market closes, settlement begins
- 12 AM next day: Settle, award winners, repeat

**Market Examples:**

| Market | Odds (YES/NO) | Reasoning |
|--------|---------------|-----------|
| Will @vitalik_eth tweet >3 times today? | 1.6x / 2.3x | He's unpredictable (high odds) |
| Will @ethereum engagement exceed 500K today? | 2.1x / 1.7x | Team usually ~400K-600K |
| Will @punk_3882 get a viral tweet (>100K)? | 3.2x / 1.3x | Rare event, high odds for YES |
| Will @modular_team lose followers? | 4.5x / 1.1x | Unlikely, but possible selloff |
| Will @airdrop_alert beat yesterday's engagement? | 1.8x / 2.0x | Daily variability |

### How Many Markets?

**Target:** 3-5 per day initially (can scale to 10-15)

**Reasoning:**
- Too few = boring, users skip days
- Too many = decision paralysis, lower conviction
- 3-5 = "I have time to research, make thoughtful picks"

### Market Types (MVP → Evolution)

**MVP (Week 1):**
- Binary only: YES/NO on engagement threshold
- Fixed-odds: Set at market creation, don't change
- 24h duration only

**v1.1 (Week 4):**
- Add 2 new market types:
  - **Range markets:** "Will @creator get 50K-150K engagement?" (3 outcomes: below/in range/above)
  - **Head-to-head:** "Who'll have more engagement: @creator_a or @creator_b?" (2 outcomes, dynamic odds)

**Future (Post-MVP):**
- AMM-based dynamic odds (Uniswap V4 style)
- Multiple settlement times (daily + weekly snapshots)
- Parlay/combo bets
- Creator-initiated markets ("Bet on my engagement tomorrow")

### Settlement Mechanics

**Data Source:** X API (via existing scraper infrastructure)

**Settlement Rules:**
1. Market closes 11:59 PM UTC
2. Metrics aggregated over 24h window (6 AM - 5:59 PM UTC next day)
3. Engagement = Likes + Retweets + Replies (not followers)
4. If data unavailable: Market marked "Void" → ETH refunded
5. Settlement automated, results posted within 5 min of close

**Example Settlement:**
- Market: "Will @ethereum engagement exceed 500K?" (YES odds 2.1x, NO odds 1.7x)
- Actual: 487,342 engagement = NO wins
- Pool: $1,000 bet on YES, $1,500 on NO
- NO winners split: $1,000 + (50% of YES bets) = $1,500
- House rake: 2% of total ($50)

### UX Flow (Single Page)

```
TOP OF PAGE:
┌─────────────────────────────────────┐
│ Today's Markets (3 open)            │
│                                     │
│ Market 1: Will @vitalik tweet >3?   │
│ YES 1.6x | NO 2.3x                  │
│ Your picks: —                       │
│ [Tap to predict]                    │
│                                     │
│ Market 2: @ethereum 500K eng?       │
│ YES 2.1x | NO 1.7x                  │
│ Your picks: YES $5                  │
│ [Edit] [View breakdown]             │
│                                     │
│ Market 3: @punk viral (>100K)?      │
│ YES 3.2x | NO 1.3x                  │
│ Your picks: —                       │
│ [Tap to predict]                    │
└─────────────────────────────────────┘

BOTTOM TAB:
Your Bets (1 open, 0 settled)
- @ethereum market: $5 YES @ 2.1x
- Settles in 14h
- [View live metrics]
```

---

## 7. AUTHENTICATION & ONBOARDING

### Current State
- SIWE only (Sign-In with Ethereum)
- High friction for non-crypto users

### Recommendation: **SIWE + Email/Social** (Phased Launch)

**MVP (Week 0):** Keep SIWE only, but add testnet faucet button
- **Why:** Simple, proven, crypto-aligned. Keeps initial users sophisticated.
- **Pain point:** Testnet ETH is annoying. Add 1-click faucet link.

**v1.1 (Week 4):** Add Email + Social
- **Why:** Unlock 2-5x addressable market
- **How:**
  - Email = Firebase Auth (email + password, free tier)
  - Google = OAuth (single-tap for non-crypto users)
  - Stay on-chain: All bets still require wallet connection (MetaMask + RainbowKit)

**Implementation:**
```
Login page (3 options):
- SIWE [Button] ← v0 only
- Continue with Google [Button] ← v1.1
- Continue with Email [Button] ← v1.1

If email/Google:
  1. Create account (no wallet required yet)
  2. See demo (read-only markets)
  3. CTA: "Connect wallet to predict"
  4. SIWE modal triggers
  5. Deposit testnet ETH
```

### Onboarding Flow (3 min, 4 steps)

```
STEP 1: Connect Wallet
- Land on Home → "Start Playing"
- SIWE modal
- Sign message
- Done (2 sec)

STEP 2: Fund Wallet (30 sec)
- Show testnet balance
- If <$1: "Get testnet ETH"
- [Button] → Opens faucet.quicknode.com
- Check balance loop (poll every 5 sec, max 30 sec wait)

STEP 3: Make 3 Predictions (2 min)
- Markets page loads with 3 easy markets
- Predict on 3 different influencers
- UI pre-fills: $1 bet, YES side (easiest)
- After 3rd: "Great! You made your first predictions!"

STEP 4: See Results (30 sec)
- Settle one market immediately (test market)
- Show "You won $2" (if correct) or "You lost $1" (if incorrect)
- Show CS = 10
- [Next] → Go to Markets page
```

**Exit Metrics:**
- Step 1→2: 95%+ (1-click faucet)
- Step 2→3: 85%+ (funding takes 5-30 sec)
- Step 3→4: 99%+ (predictions are easy)
- **Overall:** 75%+ daily activation (95% × 85% × 99%)

---

## 8. INFORMATION ARCHITECTURE

### Core: 3 Pages Only

**Page 1: MARKETS** (90% of screen time)
- Primary navigation
- Shows today's 3-5 live markets
- Each market: Binary YES/NO, current odds, user's bet (if any), time to settlement
- Scroll down: Your open positions, win/loss from yesterday, CS progression
- Tap market: Detailed view (odds movement, pool depth, community prediction %)

**Page 2: PROFILE** (8% of screen time)
- User's CS and tier
- Win rate, total predictions, streak
- Leaderboard position
- Settings: Wallet, notification preferences, theme
- Sign out

**Page 3: HOME** (2% of screen time)
- Only seen on first load or if user is unsigned
- Landing page: Headline, how-it-works, CTA
- Once connected: Redirect to Markets

### Navigation Structure

```
Bottom Tab Bar (always visible):
┌─────────────────────────────────┐
│ 🎯 Markets    👤 Profile   ☰ Menu │
└─────────────────────────────────┘

Markets Tab (Primary):
  - Today's Markets
  - Your Positions
  - Yesterday's Results
  - Live Leaderboard (scroll right)

Profile Tab:
  - Credibility Score card
  - Stats (win rate, streak, volume)
  - Prediction history
  - Settings
  - Help/FAQ

Menu (Hamburger):
  - My Bets (full history)
  - Leaderboard (sortable)
  - Top Predictors (weekly)
  - FAQ / Rules
  - About
  - Sign Out
```

### Removed Pages (Kill Entirely)

| Old Page | Reason |
|----------|--------|
| Arena (Draft) | Replaced with watchlist view |
| Vote | Integrated into leaderboard |
| Compete | Merged into Markets + Profile |
| Feed | Became metrics dashboard in Markets |
| Leaderboard | Scrollable view in Markets tab |
| Quests | Removed (all complexity) |
| Referrals | Removed (premature) |
| League | Removed (fantasy scoring bloat) |
| Achievements | Removed (distraction) |
| Progress | Replaced with CS dashboard |
| Settings | Moved to Profile |
| Intel | Removed (not core) |

---

## 9. MONETIZATION LADDER

### Free → Paid → Premium

#### TIER 1: FREE
- **What:** Core prediction markets
- **Limits:**
  - Bet $1-$10 per prediction (testnet ETH)
  - 3-5 markets/day
  - Basic CS calculation
- **Monetization:** 2% rake on all bets
- **Lifetime value:** ~$0.50/user (not goal; proof of concept)

#### TIER 2: PREMIUM ($4.99/mo)
- **When to introduce:** After 500 DAU (6+ months)
- **What:**
  - Higher bet limits: $1-$50 per prediction (mainnet ETH)
  - 10-15 markets/day (earlier access, more variety)
  - Custom markets: "Create a prediction about your own engagement"
  - Advanced stats: Win rate by day-of-week, market type, influencer category
  - CS multiplier: Premium users earn 1.1x CS points (cosmetic edge)
- **Pricing:** $4.99 = catches 5% of engaged users at 30% annual churn
- **Projected revenue:** 500 DAU × 5% × $4.99 = $125/mo (seed milestone)

#### TIER 3: CREATOR ($19.99/mo or revenue share)
- **When:** Year 2, once credibility scores are meaningful
- **What (Option A - Revenue Share):**
  - Creators link their X account
  - Users predict on your engagement daily
  - You earn 0.5% of losing bets on your markets
  - E.g., $1K daily bets on you × 40% loss rate = $5/day = $150/mo
- **What (Option B - Flat Fee):**
  - $19.99/mo for private market creation
  - Run daily markets on your own account
  - Affiliate link: Earn 1% of friend's bets
- **Target:** 20-50 creators by Year 2

#### TIER 4: LIQUIDITY PROVIDER (v2, Year 2)
- **What:** Earn fees by providing liquidity to markets
- **Mechanism:** User deposits $100 ETH, takes 0.5% of all bets on specific markets
- **Target:** 5-10 power users, $50K-$100K total TVL by Year 2

### Monetization Roadmap

| Phase | User Count | Mechanism | MRR |
|-------|-----------|-----------|-----|
| MVP (M0) | 50 | 2% rake (testnet) | $0 |
| v1.0 (M3) | 500 | 2% rake (testnet) | $20 |
| v1.1 (M6) | 2,000 | 2% rake (testnet), Premium launch | $500 |
| v2.0 (M12) | 10,000 | 2% rake (mainnet), Creator tier, LPs | $5,000 |
| v3.0 (M18) | 50,000 | 2% rake, Premium (5%), Creator (2%), LPs | $50,000 |

**Unit Economics (Target at Scale):**
- Avg bet/user/day: $5
- Avg predictions/user/day: 3.5
- Avg user lifetime: 90 days (seasonal)
- Rake per user: $5 × 3.5 × 90 × 2% = $31.50
- Premium conversion: 5% of users → $4.99 × 12 × 90 days churn = $30
- **Total LTV:** $31.50 + $30 = $61.50
- **CAC target:** <$5 (word-of-mouth, crypto community)
- **Payback period:** 9-10 days

---

## 10. RISKS & MITIGATIONS

### Critical Risks

#### Risk 1: No Habit Formation (Biggest)
**Problem:** Prediction markets are high-friction. Unlike social apps, users need to actively predict, wait for settlement, then check results. Not passive engagement.

**Signal of Failure:** <5% daily retention after 2 weeks

**Mitigation:**
- Push notifications at market open (6 AM daily)
- Streak mechanic: "7-day streak 🔥 — don't break it"
- Leaderboard prominently in Markets tab (social pressure)
- Live metrics: Show engagement counter ticking up in real-time (FOMO)
- Test with 20 early users, iterate on notification cadence/messaging before full launch

**Alternative:** If habit doesn't form by M3, pivot to "prediction league for teams" (B2B, Discord communities bet together)

---

#### Risk 2: X API Restrictions / Data Unavailability
**Problem:** X suspended InfoFi access in Jan 2026. They could shut down public metric scraping again.

**Signal of Failure:** >10% markets marked "void" for more than 1 week

**Mitigation:**
- Use multiple data sources:
  - X API (primary)
  - Perplexity AI / Together AI (backup, scrape public data)
  - User-reported metrics (oracle mechanism) for small payouts
- Build market types that don't rely on X (head-to-head predictions, user voting)
- Store all historical data locally (can use snapshots to settle if API goes down)
- Alert users: "X is experiencing issues, markets may be delayed"

**Contingency:** If X blocks us entirely, pivot to Farcaster metrics (decentralized, hard to block)

---

#### Risk 3: Market Manipulation / Flash Loans
**Problem:** If TVL gets high (>$100K), sophisticated actors could:
- Manipulate influencer metrics (pay for fake engagement)
- Use flash loans to move large amounts on eve of settlement

**Signal of Failure:** Suspicious bet patterns in data (e.g., $1K bet 1 hour before settlement, influencer's metrics suddenly spike)

**Mitigation:**
- Start on testnet only (no real money at risk)
- When moving to mainnet (M6+), implement:
  - Time locks: Can't bet in final 1h before settlement (prevents last-second info advantages)
  - Bet limits per user per market ($50 max in MVP, scales with TVL)
  - Whale detection: Flag unusual bets, pause market if detected
  - Oracle redundancy: Use multiple data sources for final metrics, take median
- Regular audits: Review top winners, check for collusion

---

#### Risk 4: Regulatory (Crypto Gambling)
**Problem:** Prediction markets are legally grey in US/EU. X betting on social metrics might be classified as "gambling" or "unregistered securities."

**Signal of Failure:** Cease-and-desist letter from regulator

**Mitigation:**
- Launch testnet only (no real money = no regulatory risk)
- When moving to mainnet, geo-block US users
- Consult legal (once we have funding)
- Market as "social analytics games," not betting
- Required disclosures: "This is entertainment. You can lose money."
- Keep KYC-lite (email, wallet, no real identity) for plausible deniability

---

#### Risk 5: Influencer Pushback
**Problem:** Influencers might not like being "predicted on" without consent. Could lead to PR crisis ("predatory platform betting on creators").

**Signal of Failure:** Major CT figure tweets negatively; media pickup ("Foresight: The Problematic Betting App Betting Against Creators")

**Mitigation:**
- Frame as "credibility engine," not gambling
- Launch with influencers' permission: Reach out to top 50, offer free Premium access
- Creator tier: Pay them rev-share (turns potential enemies into stakeholders)
- Transparency: Public, verifiable prediction data (not hidden bets)
- Example messaging: "Foresight celebrates influence by quantifying it. Your engagement proves your impact."

---

#### Risk 6: Insufficient User Demand
**Problem:** Prediction markets are still niche. Maybe only 1,000 hardcore crypto traders care.

**Signal of Failure:** <50 DAU after 2 months

**Mitigation:**
- Aggressive launch strategy:
  - Day 1: Announce in top CT communities (LobsterDAO, Modular, etc.)
  - Reach out to 20 micro-influencers (10K-50K followers) → offer $100 bounty for first 10 predictions
  - Post on Crypto Reddit, X, Discord with viral angle ("Prove you understand CT better than anyone")
- If <50 DAU by M1, do user interviews, find the actual problem
- Potential pivots:
  - B2B: Sell to crypto teams as internal engagement game
  - Rebrand to "X Analytics" for brands (predict competitor engagement)
  - Add fantasy sports on other games/streams (Twitch prediction market equivalent)

---

### Non-Critical But Important Risks

| Risk | Signal of Failure | Mitigation |
|------|-------------------|-----------|
| **Prediction Accuracy is Random** | Win rate clusters at 50% | Add skill-based features: edge signals (trending topics), hints before market opens |
| **Foresight Score Too Noisy** | CS doesn't correlate with actual accuracy | Increase minimum predictions from 1 to 30 before public leaderboard |
| **Market Settlement Bugs** | Users lose money due to platform error | Insurance fund (2% of rake) + comprehensive testing, 48h test period before mainnet |
| **Bot Farming** | Automated accounts spamming predictions | Minimum bet $1, rate limits (10 predictions/day/user), CAPTCHA on signup |
| **Influencer Gaming** | Top influencers artificially spike engagement | Exclude auto-retweets, limit likes per account, flag anomalies |

---

## IMPLEMENTATION ROADMAP

### Phase 0: MVP Shipping (Weeks 1-6)
- **Goal:** Launch testnet, 50 beta users
- **Ship:** 3 pages, 3-5 markets/day, CS system, SIWE auth
- **Success Metric:** 5% daily retention over 2 weeks

### Phase 1: Hardening (Weeks 7-12)
- **Goal:** 500 DAU, 10% weekly retention
- **Build:** Email/social login, notifications, creator outreach, data redundancy
- **Kill:** Quests, tier system complexity
- **Iterate:** Onboarding based on 50 → 500 user feedback

### Phase 2: Monetization (Weeks 13-24, Month 4-6)
- **Goal:** 2,000 DAU, launch Premium tier
- **Build:** Premium features, creator tier, mainnet readiness
- **Success Metric:** $500/mo MRR, 100 premium subscribers

### Phase 3: Scale (Month 7+)
- **Goal:** 10,000 DAU, mainnet launch
- **Build:** Advanced market types, LPs, integrations (Discord bots, Telegram)
- **Success Metric:** $5,000/mo MRR, 1,000 premium subscribers

---

## SUMMARY: THE RUTHLESS RELAUNCH

**From:** Complex fantasy draft game with 27 quests, 12 pages, 5 tiers
**To:** Minimal prediction market with 3 pages, 1 metric (CS), 1 loop (predict → settle → repeat)

**Core Belief:** Users don't want badges and quests. They want to prove they're smarter than everyone else about what matters: **influence.**

Foresight succeeds by becoming the simplest, most addictive way to participate in the creator economy. A single page, a single daily habit, a single leaderboard rank. Everything else is noise.

**Launch date:** End of February 2026
**Success marker:** 500 DAU, 5% daily retention, $1K weekly GMV by Month 3

---

**Document updated:** February 9, 2026
**Next review:** After MVP launch (Month 1)
