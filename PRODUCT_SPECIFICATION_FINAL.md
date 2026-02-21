# FORESIGHT PRODUCT SPECIFICATION (LOCKED)
**Solana Graveyard Hackathon Edition**
**Deadline: February 27, 2026 (6 days)**
**Status: FINAL - READY FOR IMPLEMENTATION**

---

## 1. PRODUCT OVERVIEW

### One-Sentence Pitch
Foresight is a skill-based fantasy sports game where users draft real Crypto Twitter influencers as teams, earn points from verified social engagement, and compete for ETH prizes powered by Solana's Tapestry Protocol.

### Target User (Specific)
**Primary:** Crypto Twitter natives aged 18-35 with Solana wallets, active on social platforms, interested in competitive gaming and DeFi (5K DAU initially).
**Secondary:** Fantasy sports enthusiasts transferring from traditional platforms (FanDuel, DraftKings).
**Tertiary:** Influencers (top 100 CT accounts) who benefit from the content feed and leaderboard visibility.

### Core Value Proposition
- **For Players:** Real-money fantasy sports with weekly contests, social bragging rights, and instant micro-leaderboard updates
- **For CT Ecosystem:** Monetize attention through proven fantasy mechanics (10% rake), resurrect SocialFi with utility-first design instead of speculation
- **For Solana:** "Why Solana?" answer = Tapestry Protocol identity layer eliminates account spam and enables trustless team storage + cross-chain score portability

### Hackathon Positioning (Graveyard Theme)
**Narrative:** "Resurrection of SocialFi through Game Theory"
- Problem (0:00-0:30): Friend.tech died because speculation (buy/sell keys for profit) replaced utility. SocialFi is the graveyard.
- Solution (0:30-2:15): Foresight resurrects the space with proven fantasy sports mechanics (daily fantasy = $100B industry, 14% CAGR). Tapestry integration = trustless identity = no ponzi.
- Impact (2:15-3:00): Weekly contests, live scoring, formation visuals are camera-ready demos. Real users in 48 hours = hackathon gold.

---

## 2. CORE GAME LOOP

**Duration:** Weekly cycle starting Monday 12:00 UTC, ending Sunday 23:59 UTC.

### User Journey (Onboarding → Repeat Engagement)

```
MINUTE 0: NEW USER LANDS ON HOME
  ├─ Sees 2 hero CTAs: "Join Free Contest" or "See Leaderboard"
  ├─ Learns in 3 bullet points: Draft 5 influencers, get points from their engagement, compete for prizes
  └─ Auth: "Sign with Solana" (Privy wallet)

MINUTE 2: POST-AUTH → CONTESTS PAGE
  ├─ Sees list of active contests (1 free, 0-2 paid depending on availability)
  ├─ Clicks "Enter Contest" on free entry
  └─ Lands on DRAFT PAGE

MINUTE 3-15: DRAFT PHASE
  ├─ Sees formation visual: [CAPTAIN] above 4 tier slots
  ├─ Budget display: "150 pts left" (salary cap)
  ├─ Influencers grouped by tier (S/A/B/C) with prices
  ├─ Drafts sequentially: Captain first, then fills 4 slots
  ├─ Gets real-time feedback: "Budget: 42/150" + "Formation complete: Ready!"
  ├─ Submits team → locked in
  └─ Redirected to LEADERBOARD showing their provisional rank

MINUTE 16-604,800: SCORING PHASE (7 DAYS)
  ├─ System fetches influencer data hourly via TwitterAPI.io
  ├─ Scores update every hour (displayed in UI with "Updated at 3:42 PM")
  ├─ User can view:
  │  ├─ Leaderboard (live rankings)
  │  ├─ Team details (individual player scores + captain bonus)
  │  ├─ CT Feed (see what their team influencers are tweeting)
  │  └─ Contest countdown timer
  └─ Micro-actions for engagement: Share team link, follow influencers

MINUTE 604,800: CONTEST ENDS (7 days)
  ├─ Scoring locks
  ├─ Contest transitions from "scoring" → "finalized"
  ├─ Top 10% claimed rewards if prized
  ├─ Free contest shows: "You finished 47th of 214 players"
  └─ New contest opens → loop repeats

KEY DOPAMINE HITS:
  1. **Draft moment** (min 3): "I found a hidden gem for cheap"
  2. **Live scoring surge** (hourly): "My team just jumped 5 spots!"
  3. **Viral moment** (random): "My captain just got 100K engagement +12 pts"
  4. **Leaderboard climb** (social): Friends' names appear nearby, rivalry drives re-engagement
  5. **Win notification** (end of week): Prize claimed or top-10 finish
```

---

## 3. PAGES & SCREENS (EXACTLY 6)

### PAGE 1: HOME (/)
**URL:** `/`
**Purpose:** Dashboard + entry point. Show weekly status, next actions, quick stats.
**Primary Action:** "Join Free Contest" button (CTA)

**Layout:**
```
┌─ HEADER ──────────────────────────────────┐
│ Foresight logo  [User profile]  [Settings]│
└────────────────────────────────────────────┘

┌─ HERO SECTION ─────────────────────────────┐
│ "Weekly CT Draft Contest"                  │
│ [Join Free Contest] [See Leaderboard]      │
│ "3 influencers in your team have tweeted   │
│  in the last hour"                         │
└────────────────────────────────────────────┘

┌─ MY TEAM CARD ─────────────────────────────┐
│ Your Team: "Dream Team Apes"               │
│ ├─ 👨 @aeyakovenko (Captain) 87 pts 1.5x  │
│ ├─ 🧑 @solana 45 pts                       │
│ ├─ 👩 @arianna_tx 32 pts                   │
│ ├─ 👨 @someone_else 28 pts                 │
│ └─ 👩 @another 19 pts                      │
│ TOTAL: 211 pts | RANK: 47 / 214            │
│ [View Breakdown]                           │
└────────────────────────────────────────────┘

┌─ QUICK STATS ──────────────────────────────┐
│ Contests Entered: 12   |  Winnings: 0.45Ⓢ │
│ Avg Rank: 34th        |  Win Rate: 8%      │
└────────────────────────────────────────────┘

┌─ CT FEED TEASER ──────────────────────────┐
│ Trending Now in Your Team:                 │
│ ├─ @aeyakovenko: "Building the Solana..."
│ │  ❤️ 2.4K  🔁 580  💬 143                 │
│ └─ @solana: "Validators be like..."
│    ❤️ 8.9K  🔁 2.1K  💬 340                │
│ [View Full Feed]                           │
└────────────────────────────────────────────┘
```

**Data Requirements:**
- `GET /api/league/team/me` - Current user's team + score
- `GET /api/league/contests/active` - Active contests (1 free, 0-N paid)
- `GET /api/ct-feed?limit=2` - 2 trending tweets

**States:**
- **Empty:** "No active team. Join a contest to get started."
- **Loading:** Skeleton cards
- **Populated:** As above
- **Error:** "Failed to load team. [Retry]"

---

### PAGE 2: DRAFT (/draft)
**URL:** `/draft?contestId=123`
**Purpose:** Team builder. Formation-based, budget-constrained, tier-grouped influencer selection.
**Primary Action:** Submit team (locked after)

**Layout:**
```
┌─ HEADER ──────────────────────────────────┐
│ [← Back to Contests]  Draft Team  [?Info] │
└────────────────────────────────────────────┘

┌─ CONTEST INFO BAR ─────────────────────────┐
│ "Weekly CT Draft - Free Entry"             │
│ Locks in: 3d 5h 22m  |  Prize Pool: Free   │
└────────────────────────────────────────────┘

┌─ FORMATION VISUAL (LEFT) ──────────────────┐
│                                            │
│              🧑 Captain (1.5x)             │
│          [@aeyakovenko]  S-Tier            │
│                                            │
│    🧑 A-Tier    🧑 A-Tier    🧑 B-Tier    │
│  [@solana]   [@arianna]   [@someone]      │
│                                            │
│         🧑 C-Tier              (empty)     │
│       [@another]               ?            │
│                                            │
│       BUDGET: 42 / 150 pts left            │
│    ✓ Team Complete - Ready to Submit       │
│       [SUBMIT TEAM] [RESET DRAFT]          │
└────────────────────────────────────────────┘

┌─ INFLUENCER GRID (RIGHT) ───────────────────┐
│ Filter: S-TIER (4)  A-TIER (16)  B-TIER (30)│
│         C-TIER (50)  [CLEAR]                │
├─────────────────────────────────────────────┤
│ S-TIER INFLUENCERS                          │
│ ┌─ @aeyakovenko [45 pts] ✓ [IN TEAM] ─┐   │
│ │ S-Tier  ✨ Founder                    │   │
│ │ 1.2M followers  | Engagement: 8.2%    │   │
│ └─────────────────────────────────────────┘   │
│ ┌─ @solana [38 pts]  [-] [CAPTAIN 1.5X] ┐  │
│ │ S-Tier  🚀 Official                   │   │
│ │ 850K followers  | Engagement: 12%     │   │
│ └─────────────────────────────────────────┘   │
│ [2 more S-tier cards...]                    │
│                                             │
│ A-TIER INFLUENCERS                          │
│ [Virtualized list of 16 cards, scroll]      │
│ [16 more cards...]                          │
│                                             │
│ B-TIER, C-TIER [Similar lazy-loaded list]  │
└─────────────────────────────────────────────┘
```

**Data Requirements:**
- `GET /api/league/contests/active` - Verify contest + lock time
- `GET /api/league/influencers?contestId=123` - All available influencers (100 total) with prices, tier, current scores
- `GET /api/league/team/me` - Pre-fill if editing existing team
- `POST /api/league/team/create` (on submit) - Save team

**States:**
- **Empty:** "Select 5 influencers. Start with your Captain for 1.5x bonus."
- **Loading:** Skeleton formation + grid
- **Incomplete:** "Missing 1 player. Budget OK." (Submit disabled)
- **Budget exceeded:** "Over budget by 8 pts. Remove someone." (Submit disabled, budget turns red)
- **Locked:** "This team has been locked. Viewing read-only." (All controls disabled)
- **Submitted:** "Team locked! [View Leaderboard]" (Modal)

---

### PAGE 3: LEADERBOARD (/leaderboard)
**URL:** `/leaderboard?contestId=123&sortBy=rank&timeframe=week`
**Purpose:** Live rankings. Show where user stands, celebrate top performers.
**Primary Action:** Scroll top 10, click teammate names

**Layout:**
```
┌─ HEADER ──────────────────────────────────┐
│ Leaderboard  [Weekly ▼]  [Search user]    │
└────────────────────────────────────────────┘

┌─ CONTEXT BAR ──────────────────────────────┐
│ "You are 47th of 214 players | 163 pts"    │
│ [Your Team] [Share] [See Breakdown]        │
└────────────────────────────────────────────┘

┌─ TOP 10 (HIGHLIGHTED) ─────────────────────┐
│ 🥇 1.  @user_A            287 pts          │
│        Team: [cap] [@a] [@b] [@c] [@d]    │
│                                            │
│ 🥈 2.  @user_B            281 pts          │
│        Team: [cap] [@a] [@b] [@c] [@d]    │
│                                            │
│ 🥉 3.  @user_C            271 pts          │
│        Team: [cap] [@a] [@b] [@c] [@d]    │
│                                            │
│ 4.  @user_D              268 pts          │
│ ... (7-10)                                │
└────────────────────────────────────────────┘

┌─ YOUR RANK HIGHLIGHTED ────────────────────┐
│ 47. YOU (@your_handle)      163 pts [YOU] │
│     Team: [cap] [@a] [@b] [@c] [@d]      │
└────────────────────────────────────────────┘

┌─ LEADERBOARD TABLE ────────────────────────┐
│ Rank │ Player      │ Pts │ Captain │ Upd   │
├──────┼─────────────┼─────┼─────────┼───────┤
│ 48   │ @user_E    │ 162 │ @cap1   │ 5m   │
│ 49   │ @user_F    │ 160 │ @cap2   │ 12m  │
│ 50   │ @user_G    │ 158 │ @cap3   │ 1h   │
│ ... (virtualized infinite scroll)         │
└────────────────────────────────────────────┘

┌─ FOOTER ───────────────────────────────────┐
│ Last updated: 3:42 PM UTC • Auto-refresh   │
│ [Download Standings] [Share Results]       │
└────────────────────────────────────────────┘
```

**Data Requirements:**
- `GET /api/league/leaderboard/:contestId` - All players, scores, teams (paginated, 50 per page)
- `GET /api/league/team/me` - Current user's team
- Live WebSocket or polling: `GET /api/league/live-scoring?contestId=123` (every 60 seconds)

**States:**
- **Empty:** "No entries yet. Be the first!"
- **Loading:** Skeleton table
- **Populated:** As above
- **Error:** "Failed to load leaderboard. [Retry]"
- **Live Updates:** "7 new scores (last 5 min)" + UI refreshes

---

### PAGE 4: CONTEST DETAIL (/contest/:contestId)
**URL:** `/contest/123`
**Purpose:** Contest hub. Show status, prize breakdown, timeline, rules.
**Primary Action:** "Join Contest" (if not entered) or "View Team" (if entered)

**Layout:**
```
┌─ HEADER ──────────────────────────────────┐
│ [← Back]  "Weekly CT Draft #47"           │
└────────────────────────────────────────────┘

┌─ HERO CARD ────────────────────────────────┐
│ Status: OPEN (2d 14h left to enter)       │
│ Prize Pool: 12 SOL  |  Players: 214/∞      │
│ Entry Fee: Free     |  Your Status: ENTERED│
│                                            │
│ [Join] or [View My Team] (depends on state)
└────────────────────────────────────────────┘

┌─ SCORING RULES ACCORDION ──────────────────┐
│ ⊕ How Scoring Works                       │
│   Activity: 0-35 pts (tweets/week)         │
│   Engagement: 0-60 pts (likes+retweets)   │
│   Growth: 0-40 pts (followers gained)      │
│   Viral: 0-25 pts (high-engagement tweets)│
│   Captain: 1.5x multiplier on base score  │
│   ℹ️ Learn more → [Scoring Formula]       │
└────────────────────────────────────────────┘

┌─ TIMELINE ─────────────────────────────────┐
│ Mon 12:00 UTC  ✓ Contest Created          │
│ Mon 23:59 UTC  ○ Entries Lock (in 2d 14h) │
│ Sun 23:59 UTC  ○ Scoring Ends             │
│ Mon 00:00 UTC  ○ Winners Announced        │
└────────────────────────────────────────────┘

┌─ PRIZE BREAKDOWN (IF PRIZED) ───────────────┐
│ Total Prize Pool: 12 SOL                   │
│ 1st Place:   3 SOL (25%)                   │
│ 2nd-5th:     1.5 SOL each (12.5%)          │
│ 6th-10th:    0.6 SOL each (5%)             │
│ Platform Fee: 1.8 SOL (15%)                │
│ [Detailed breakdown table...]              │
└────────────────────────────────────────────┘

┌─ LEADERBOARD PREVIEW ──────────────────────┐
│ [Top 5 players + your rank]                │
│ [Full Leaderboard →]                       │
└────────────────────────────────────────────┘
```

**Data Requirements:**
- `GET /api/league/contest/current` or `/api/league/contests/active` filtered by ID
- `GET /api/league/leaderboard/:contestId?limit=5` - Top 5
- `GET /api/league/team/me` - If user entered
- `GET /api/league/scoring-formula` - Static content

**States:**
- **Pre-Contest:** "Entries open! Closes in 2d 14h"
- **Locked:** "Entries closed. Contest scoring..."
- **Scoring:** "Scoring in progress. Check back Sunday."
- **Finalized:** "Contest finished. 1st place: @user (287 pts)"
- **Error:** "Failed to load contest. [Retry]"

---

### PAGE 5: CT FEED (/feed)
**URL:** `/feed`
**Purpose:** Social feed. Curated tweets from top 100 CT influencers + your team.
**Primary Action:** View highlights, scroll feed, follow users

**Layout:**
```
┌─ HEADER ──────────────────────────────────┐
│ CT Feed  [Highlights] [My Team] [All] ▼   │
│ [Search by handle] [Filter by engagement] │
└────────────────────────────────────────────┘

┌─ HIGHLIGHTS CAROUSEL (TOP) ────────────────┐
│ Viral Tweets Right Now                    │
│ ← [TWEET 1] [TWEET 2] [TWEET 3] →         │
│   🔥 100K+ engagement                      │
└────────────────────────────────────────────┘

┌─ MAIN FEED ────────────────────────────────┐
│                                            │
│ ┌─ @aeyakovenko · 2h                       │
│ │ "Building the Solana validator set..."  │
│ │ ❤️ 2.4K  🔁 580  💬 143                 │
│ │ [Like] [Retweet] [Reply]                │
│ └──────────────────────────────────────────┘
│                                            │
│ ┌─ @solana · 1h                            │
│ │ "Tapestry Protocol changes live..."    │
│ │ ❤️ 8.9K  🔁 2.1K  💬 340                │
│ │ [Like] [Retweet] [Reply]                │
│ └──────────────────────────────────────────┘
│                                            │
│ [Virtualized infinite scroll...]           │
│                                            │
└────────────────────────────────────────────┘
```

**Data Requirements:**
- `GET /api/ct-feed` - Main feed (50 tweets per page)
- `GET /api/ct-feed/highlights` - Top 10 viral tweets (hourly refresh)
- `GET /api/league/team/me` - For "My Team" filter

**States:**
- **Loading:** Tweet skeleton cards
- **Empty:** "No tweets yet. Check back in an hour."
- **Populated:** As above
- **Error:** "Failed to load feed. [Retry]"
- **Refreshing:** "New tweets available. [↻ Refresh]" badge

---

### PAGE 6: PROFILE (/profile)
**URL:** `/profile`
**Purpose:** User stats, settings, achievements, wallet connection.
**Primary Action:** Disconnect/connect wallet, view stats

**Layout:**
```
┌─ HEADER ──────────────────────────────────┐
│ Profile  [Settings] [Logout]              │
└────────────────────────────────────────────┘

┌─ USER CARD ────────────────────────────────┐
│ Display Name: "YourHandle"                 │
│ Wallet: 0x1234...5678 [Copy]              │
│ Status: Connected ✓                        │
│ Joined: 12 days ago                        │
│                                            │
│ [Edit Profile] [Disconnect]               │
└────────────────────────────────────────────┘

┌─ STATS ────────────────────────────────────┐
│ Career Stats                               │
│ ├─ Contests: 12                            │
│ ├─ Winnings: 0.45 SOL                      │
│ ├─ Best Rank: 3rd (Week 3)                 │
│ ├─ Avg Rank: 34th                          │
│ └─ Win Rate: 8% (1 top-10 finish)         │
│                                            │
│ Weekly Stats (This Week)                   │
│ ├─ Team: "Dream Team Apes"                 │
│ ├─ Current Rank: 47 / 214                  │
│ └─ Points: 163                             │
└────────────────────────────────────────────┘

┌─ ACHIEVEMENTS ─────────────────────────────┐
│ Your Badges                                │
│ 🏆 First Team    🚀 Top 10 Finish         │
│ ⭐ Perfect Week  💎 1K Points              │
└────────────────────────────────────────────┘

┌─ SETTINGS SECTION ─────────────────────────┐
│ Email Notifications: [ON/OFF]              │
│ Leaderboard Visibility: [Public/Private]   │
│ Theme: [Dark] [Light]                      │
│                                            │
│ [Save Settings]                            │
└────────────────────────────────────────────┘

┌─ DANGER ZONE ──────────────────────────────┐
│ [Delete Account] [Clear All Data]          │
└────────────────────────────────────────────┘
```

**Data Requirements:**
- `GET /api/v2/fs/me` - Current user data
- `GET /api/league/team/me` - Current team
- `GET /api/achievements` - Badges/achievements (if implemented)

**States:**
- **Authenticated:** Full profile
- **Unauthenticated:** Redirect to home
- **Loading:** Skeleton profile
- **Error:** "Failed to load profile. [Retry]"

---

## 4. SCORING SYSTEM

### Exact Formula with Numbers

**Weekly Score Calculation = Activity + Engagement + Growth + Viral + (Captain Multiplier)**

#### Activity Scoring (0-35 pts)
```
tweets_this_week = count of tweets by influencer in past 7 days
Activity Points = MIN(35, tweets_this_week × 1.5)

Examples:
- 10 tweets → 15 pts
- 24 tweets → 36 pts (capped at 35)
- 0 tweets → 0 pts
```

#### Engagement Scoring (0-60 pts)
```
Quality = SQRT(avg_likes + (avg_retweets × 2) + (avg_replies × 3)) × 1.5
Volume = MIN(1.0, tweets_analyzed / 10)
Engagement Points = MIN(60, Quality × Volume)

Where tweets_analyzed = tweets this week (max 10 for full volume bonus)

Examples:
- 5 tweets, avg (100 likes, 50 retweets, 20 replies) each
  Quality = SQRT(100 + 100 + 60) × 1.5 = SQRT(260) × 1.5 = 16.1 × 1.5 = 24.15
  Volume = MIN(1.0, 5/10) = 0.5
  Score = 24.15 × 0.5 = 12.08 pts

- 12 tweets, avg (500 likes, 200 retweets, 100 replies) each
  Quality = SQRT(500 + 400 + 300) × 1.5 = SQRT(1200) × 1.5 = 34.6 × 1.5 = 51.9
  Volume = MIN(1.0, 12/10) = 1.0
  Score = 51.9 × 1.0 = 51.9 pts (capped at 60)
```

#### Growth Scoring (0-40 pts)
```
followers_gained_this_week = follower_count_today - follower_count_7_days_ago
growth_rate_percent = (followers_gained / follower_count_7_days_ago) × 100

Absolute = MIN(20, followers_gained_this_week / 2000)
Rate = MIN(20, growth_rate_percent × 5)
Growth Points = MIN(40, Absolute + Rate)

Examples:
- 3K followers gained, 100K followers 7 days ago (3% growth)
  Absolute = MIN(20, 3000 / 2000) = 1.5
  Rate = MIN(20, 3 × 5) = 15
  Score = MIN(40, 1.5 + 15) = 16.5 pts

- 15K followers gained, 250K followers 7 days ago (6% growth)
  Absolute = MIN(20, 15000 / 2000) = 7.5
  Rate = MIN(20, 6 × 5) = 30 (capped at 20)
  Score = MIN(40, 7.5 + 20) = 27.5 pts
```

#### Viral Scoring (0-25 pts)
```
Viral thresholds (engagement = likes + retweets + replies):
- 10K-49.9K engagement: +4 pts per tweet
- 50K-99.9K engagement: +7 pts per tweet
- 100K+ engagement: +12 pts per tweet
- Maximum 3 viral tweets count per week

Viral Points = SUM of points from top 3 viral tweets (max 25)

Examples:
- 1 tweet with 120K engagement: 12 pts
- 1 tweet with 65K engagement + 1 tweet with 35K engagement: 7 + 4 = 11 pts
- 3 tweets with 150K, 120K, 55K engagement: 12 + 12 + 7 = 31 pts (capped at 25)
```

#### Captain Multiplier
```
Team Base Score = Activity + Engagement + Growth + Viral (calculated per player)
Captain Score = Team Base Score × 1.5
Non-Captain Score = Team Base Score × 1.0

Example:
- Captain with 60 pts base → 60 × 1.5 = 90 pts (max multiplier impact)
- 4 non-captains with 45, 40, 35, 30 pts base → 45 + 40 + 35 + 30 = 150 pts
- Team Total = 90 + 150 = 240 pts
```

### Anti-Gaming Measures
```
30-Day Rolling Average Method:
- Calculate daily score for all influencers
- Store last 30 days of scores
- When calculating weekly score, use average of:
  - Current week's calculated score
  - Same influencer's average score from last 30 days
- Anomalies > 50% above rolling average flagged and reviewed

Example (prevents sudden buying followers):
- Historical 30-day avg for @user: 25 pts/day
- This week calculated: 80 pts (sudden growth spree)
- Adjusted score: (80 + 25×4) / 5 = 40 pts (dampened but not zeroed)
```

### Display to Users
**Leaderboard:**
```
Rank │ Player        │ Total │ Cap    │ Last Updated
1.   │ @user_A       │ 287   │ @inf1  │ 3 min ago
```

**Team Breakdown (Detail Page):**
```
┌─ CAPTAIN: @inf1 (90 pts) ─────────────────┐
│ Activity: 35  | Engagement: 28  | Growth: 10│
│ Viral: 0  | Multiplier: ×1.5              │
└──────────────────────────────────────────────┘
┌─ @inf2 (45 pts) ─────────────────────────────┐
│ Activity: 25  | Engagement: 15  | Growth: 5 │
│ Viral: 0  | Multiplier: ×1.0               │
└──────────────────────────────────────────────┘
```

### Update Frequency
- **Daily:** 00:00, 06:00, 12:00, 18:00 UTC (4x daily)
- **Real-time:** WebSocket push every 60 seconds if live-scoring enabled
- **Display:** UI refreshes immediately on new data
- **Cron Job:** `fantasyScoringService.ts` runs every 6 hours

---

## 5. DRAFT MECHANICS

### Team Size
**5 players total:**
1. Captain (1 slot, 1.5x multiplier)
2. Tier-based slots (4 slots):
   - 1 S-Tier slot (required)
   - 1 A-Tier slot (required)
   - 1 B-Tier slot (required)
   - 1 C-Tier slot (required)

### Salary Cap System
**Budget: 150 points total**

**Tier Price Ranges (draft points, NOT real money):**
| Tier | Pool Size | Price Range | Avg Price |
|------|-----------|------------|-----------|
| S    | 4 (1/per) | 40-50      | 45        |
| A    | 16        | 25-35      | 30        |
| B    | 30        | 15-25      | 20        |
| C    | 50        | 8-15       | 12        |

**Captain Selection:**
- Can be ANY influencer (S/A/B/C tier)
- Captain slot doesn't count toward tier requirements
- If Captain is S-tier, you STILL need an S-tier in your 4-player slots (or use as Captain + 1 of the 4)
- Actually: **Captain can fill tier slot** - choose wisely!

**Example Valid Teams:**
```
✓ Captain: @solana (S) + 1A + 1B + 1C + 1C = Formation complete
  Prices: 45 + 30 + 20 + 12 + 12 = 119 pts (11 left)

✓ Captain: @random_user (C) + 1S + 1A + 1B + 1C = Formation complete
  Prices: 12 + 45 + 30 + 20 + 12 = 119 pts (31 left)

✗ Captain: @solana (S) + only 3 others (1A, 1B) = INVALID (missing 1 C-Tier)

✗ Captain: @solana (S) + no other S-tier + 1A + 1B + 1C = INVALID (need S-tier in 4-player slots)
```

### Draft Time Limits
- **Per-pick:** No hard limit (encourage "think before you click")
- **Total draft time:** 15 minutes to complete all 5 picks (from entry until submit)
- **Auto-draft fallback:** If not submitted after 15 min, system auto-fills with highest-value available in each tier
- **Minimum draft time:** None (can submit immediately)

### Auto-Draft Fallback Algorithm
```
When 15 minutes elapsed without submission:
1. For Captain slot: Pick highest-available-score influencer
2. For S-tier slot: Pick highest-available-score S-tier influencer
3. For A-tier slot: Pick highest-available-score A-tier influencer
4. For B-tier slot: Pick highest-available-score B-tier influencer
5. For C-tier slot: Pick highest-available-score C-tier influencer
6. Submit team with unused budget

Prevents: users locked out of contests
```

---

## 6. CONTEST STRUCTURE

### Contest Duration
**Primary Contest (Weekly):**
- **Start:** Monday 12:00 UTC
- **Lock Time:** Friday 23:59 UTC (entry deadline)
- **End Time:** Sunday 23:59 UTC (scoring ends)
- **Total Duration:** 7 days
- **Phase 1 (Days 1-5):** "Open" - users can join, draft teams
- **Phase 2 (Days 5-7):** "Locked" - scoring in progress, leaderboard live updates
- **Phase 3 (End of Day 7):** "Finalized" - results locked, prizes distributed

### Free vs Paid Tiers
| Attribute | Free | Paid |
|-----------|------|------|
| Entry Fee | 0 SOL | 0.01-0.5 SOL (TBD per contest) |
| Players | 50-1000 | 10-500 (varies) |
| Prize Pool | None | Entry Fee × Count × 0.85 (15% rake) |
| Rewards | Bragging rights + leaderboard | SOL prizes + leaderboard |
| Max Contests/Week | Unlimited | Depends on wallet balance |

### Prize Distribution
**For Prized Contests (assuming 214 entries × 0.1 SOL = 21.4 SOL):**

| Rank | %ile | Players | Prize/Player | Total Payout |
|------|------|---------|--------------|--------------|
| 1 | Top 1% | 2 | 0.85 SOL | 1.7 SOL |
| 2-5 | Top 2.3% | 4 | 0.6 SOL | 2.4 SOL |
| 6-10 | Top 4.7% | 5 | 0.38 SOL | 1.9 SOL |
| 11-20 | Top 9.4% | 10 | 0.2 SOL | 2.0 SOL |
| 21-50 | Top 23% | 30 | 0.08 SOL | 2.4 SOL |
| 51-100 | Top 47% | 50 | 0.02 SOL | 1.0 SOL |
| **Platform Fee (15%)** | — | — | — | **3.2 SOL** |
| **Total** | — | **214** | — | **21.4 SOL** |

**For Free Contests:**
- No prizes
- Leaderboard rank + badge ("Free Contest Winner")

### Minimum/Maximum Players
- **Free contests:** 50-10,000 players per contest
- **Paid contests:** 10-500 players (soft caps, auto-create new contests if exceeded)
- **Special:** Weekend tournaments may have 2-3 concurrent contests

### Contest Lifecycle States
```
CREATED → OPEN → LOCKED → SCORING → FINALIZED

CREATED (Monday 12:00 UTC):
  - Contest visible on Contests page
  - "Entries open! Draft your team."
  - Users can join, draft teams
  - Status: "open"

OPEN (Monday 12:00 UTC - Friday 23:59 UTC):
  - 5 days for users to enter and submit teams
  - Real-time leaderboard updates (display only)
  - Users can update teams until locked
  - Status: "open"

LOCKED (Friday 23:59:00 UTC):
  - No new entries accepted
  - Existing teams frozen (no updates)
  - Leaderboard updates live with new scoring data
  - Status: "locked"

SCORING (Saturday-Sunday):
  - Scores update daily
  - Leaderboard live
  - Hourly scoring updates
  - Status: "scoring"

FINALIZED (Sunday 23:59:01 UTC):
  - Scores locked
  - Final rankings set
  - Prizes calculated and distributed
  - Status: "finalized"
  - New contest created for next week

Transition Automation:
- Cron job runs every hour to check contest times
- Automatically transitions state based on timestamps
- Sends notifications to users at each transition
- Archives contest data to historical tables
```

---

## 7. TAPESTRY INTEGRATION (Solana-Native Features)

### How We Use Tapestry for Identity
```
Problem: SocialFi died (Friend.tech) because anyone could create fake accounts.
Solution: Tapestry verifies X/Twitter handle is linked to verified wallet.

Flow:
1. User clicks "Sign in with Solana" (Privy)
2. User connects wallet (Phantom, Magic Eden, etc.)
3. System resolves wallet → Tapestry identity
4. System fetches Tapestry profile (X handle verified)
5. X handle becomes user's identity in Foresight
6. All future scores/teams linked to that handle

Code Location: backend/src/utils/auth.ts (new Privy integration)
Endpoint: POST /api/auth/verify-tapestry
```

### How We Store Teams on Tapestry
```
Instead of ONLY storing teams in PostgreSQL, we also:
1. Create Tapestry "Content" object with team data
2. Tag with metadata: { game: "foresight", week: 8, contest_id: 123 }
3. Link to user's Tapestry profile
4. Makes teams portable across apps + verifiable on-chain

Structure:
POST https://api.usetapestry.dev/v1/content/create
{
  user_id: "tapestry_user_id",
  type: "team",
  properties: {
    "foresight:picks": [5, 18, 42, 67, 91],
    "foresight:captain": 5,
    "foresight:contest_id": 123,
    "foresight:week": 8,
    "foresight:total_score": 163
  },
  linked_profiles: ["x", "solana_wallet"]
}
```

### How We Store Scores on Tapestry
```
After each contest finalizes, we create immutable score record:

POST https://api.usetapestry.dev/v1/content/create
{
  user_id: "tapestry_user_id",
  type: "achievement",
  properties: {
    "foresight:contest_id": 123,
    "foresight:rank": 47,
    "foresight:total_score": 163,
    "foresight:breakdown": {
      "captain": 90,
      "player2": 45,
      "player3": 40,
      "player4": 35,
      "player5": 30
    },
    "foresight:prize_won": 0,
    "foresight:timestamp": "2026-03-02T23:59:59Z"
  },
  linked_profiles: ["x", "solana_wallet"]
}

Benefits:
- Immutable record (wallet holder can prove achievement)
- Cross-app portability (other Tapestry apps can read scores)
- No single point of failure
```

### Why This Makes Us "Solana-Native" for Judges
```
Pitch to Judges:
"SocialFi died because it was just Ethereum with cosmetic Twitter branding.
We're Solana-native because:

1. IDENTITY LAYER: Using Tapestry Protocol (Solana's social identity standard)
   - Solana/Polygon co-built infrastructure
   - Makes us one of first Tapestry consumers
   - Judge can verify: "This is the Solana standard, not just any API"

2. SCORE PORTABILITY: Scores stored on Tapestry, not just our database
   - Winner can prove achievement cross-app
   - Future apps on Tapestry can read scores
   - Shows Solana composability philosophy

3. RESPONSIBLE MONETIZATION: Smart contracts on Solana for paid contests
   - Prizes held in escrow on-chain
   - No centralized control of funds
   - Users can verify prize distribution code
   - (Phase 2 post-hackathon)

Solana Graveyard = we resurrect with THEIR tools (Tapestry), not our own."
```

### Specific API Calls We'll Make

**Phase 1 (Hackathon - MVP):**
```typescript
// 1. Get/create user profile (at login)
GET /api/usetapestry.dev/v1/users/resolve
  Query: { wallet_address: "0x1234..." }
  Returns: { tapestry_user_id, x_handle, verified }

// 2. Store team on Tapestry (after draft submission)
POST /api/usetapestry.dev/v1/content/create
  Body: { user_id, type: "team", properties: {...} }

// 3. Store score on Tapestry (after contest finalized)
POST /api/usetapestry.dev/v1/content/create
  Body: { user_id, type: "achievement", properties: {...} }

// 4. Fetch user's past teams/scores (on profile page)
GET /api/usetapestry.dev/v1/content/search
  Query: { user_id, type: "team|achievement" }
```

**Phase 2 (Post-Hackathon - Smart Contracts):**
```typescript
// 5. Verify prize claim on-chain
// (using Solana web3.js + custom CTDraftPrized contract)
const tx = await connection.confirmTransaction(
  await program.methods.claimPrize(contestId, rank).accounts({...}).rpc()
);

// 6. Emit escrow release (when contest finalizes)
program.methods.finalizeContest(contestId).accounts({...}).rpc()
```

---

## 8. DATA MODEL

### Key Database Tables

**PostgreSQL Tables (Existing + New Columns):**

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  tapestry_user_id VARCHAR(255) UNIQUE,  -- NEW: Tapestry identity
  twitter_handle VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url VARCHAR(500),
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

#### influencers
```sql
CREATE TABLE influencers (
  id SERIAL PRIMARY KEY,
  twitter_handle VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  tier VARCHAR(10) NOT NULL,  -- S, A, B, C
  base_price INT NOT NULL,  -- salary cap points
  follower_count INT DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### draft_teams
```sql
CREATE TABLE draft_teams (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contest_id INT NOT NULL REFERENCES prized_contests(id),
  influencer_ids INT[] NOT NULL,  -- array of 5 influencer IDs
  captain_id INT NOT NULL,  -- influencer ID of captain
  total_score DECIMAL(10,2) DEFAULT 0,
  rank INT,
  status VARCHAR(20) DEFAULT 'active',  -- active, locked, finalized
  team_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, contest_id)
);
```

#### scoring_history (NEW)
```sql
CREATE TABLE scoring_history (
  id UUID PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES draft_teams(id),
  influencer_id INT NOT NULL REFERENCES influencers(id),
  activity_pts DECIMAL(5,2),
  engagement_pts DECIMAL(5,2),
  growth_pts DECIMAL(5,2),
  viral_pts DECIMAL(5,2),
  is_captain BOOLEAN,
  total_pts DECIMAL(10,2),
  calculated_at TIMESTAMP DEFAULT NOW(),
  scoring_date DATE NOT NULL
);
```

#### prized_contests (Existing - from migration 20251210)
```sql
CREATE TABLE prized_contests (
  id SERIAL PRIMARY KEY,
  contract_contest_id INT UNIQUE,
  entry_fee DECIMAL(18,8),
  min_players INT,
  max_players INT,
  lock_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  prize_pool DECIMAL(18,8),
  distributable_pool DECIMAL(18,8),  -- after 15% fee
  player_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'open',  -- open, locked, scoring, finalized
  name VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### prized_entries (Existing)
```sql
CREATE TABLE prized_entries (
  id SERIAL PRIMARY KEY,
  contest_id INT NOT NULL REFERENCES prized_contests(id),
  user_id UUID REFERENCES users(id),
  wallet_address VARCHAR(42),
  team_ids INT[] NOT NULL,  -- array of 5 influencer IDs
  captain_id INT NOT NULL,
  rank INT,
  prize_amount DECIMAL(18,8),
  score DECIMAL(10,2),
  score_breakdown JSONB,  -- {activity: 35, engagement: 60, ...}
  claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### ct_tweets (Existing - for feed)
```sql
CREATE TABLE ct_tweets (
  id SERIAL PRIMARY KEY,
  tweet_id VARCHAR(50) UNIQUE,
  influencer_id INT NOT NULL REFERENCES influencers(id),
  content TEXT,
  likes INT DEFAULT 0,
  retweets INT DEFAULT 0,
  replies INT DEFAULT 0,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Relationships (ER Diagram in Text)
```
users (1) ──── (many) draft_teams
              ──── (many) prized_entries
              ──── (many) activity_logs

draft_teams (1) ──── (many) scoring_history
             └──contains── influencers (5 per team)

prized_contests (1) ──── (many) prized_entries
                  ──── (many) prized_contests_snapshots

influencers (1) ──── (many) ct_tweets
            ──── (many) scoring_history
            ──── (many) influencer_metrics_history

prized_entries └──references── draft_teams (via influencer_ids)
```

### What's in PostgreSQL vs Tapestry
| Data | PostgreSQL | Tapestry | Reason |
|------|-----------|----------|--------|
| User wallet | ✓ | ✓ (identity) | Dual for fast queries + identity verification |
| Teams | ✓ | ✓ | Portability + immutability |
| Scores | ✓ | ✓ (final only) | Queries in DB, proof on Tapestry |
| Contest metadata | ✓ | ✗ | Mutable, doesn't need cross-chain |
| Leaderboard | ✓ | ✗ | Query performance |
| CT tweets | ✓ | ✗ | High volume, external source |
| Prize claims | ✓ | ✓ (contract) | Escrow + proof |

---

## 9. API ENDPOINTS

### Auth Endpoints
```
POST /api/auth/nonce
  Response: { nonce: "abc123..." }

POST /api/auth/verify-tapestry
  Body: { wallet_address, signature, tapestry_user_id }
  Response: { accessToken, refreshToken, user: {...} }

POST /api/auth/refresh
  Body: { refreshToken }
  Response: { accessToken }

POST /api/auth/logout
  Response: { success: true }
```

### League/Contest Endpoints
```
GET /api/league/contests/active
  Query: { skip=0, limit=10 }
  Response: { contests: [...], total: N }

GET /api/league/contest/current
  Response: { id, name, status, lock_time, end_time, prize_pool }

GET /api/league/influencers
  Query: { contestId=123 }
  Response: { influencers: [...] }

GET /api/league/team/me
  Auth: Required
  Response: { id, influencer_ids, captain_id, total_score, rank, team_name }

POST /api/league/team/create
  Auth: Required
  Body: { contest_id, influencer_ids: [5], captain_id: 5, team_name: "..." }
  Response: { id, status: "created" }

PUT /api/league/team/update
  Auth: Required
  Body: { team_id, influencer_ids, captain_id }
  Response: { id, updated_at }

GET /api/league/leaderboard/:contestId
  Query: { skip=0, limit=50, sortBy=rank }
  Response: { entries: [...], your_rank: 47, total_players: 214 }

GET /api/league/live-scoring
  Auth: Optional
  Query: { contestId=123 }
  Response: { timestamp, updates: [{ team_id, new_score }] }

GET /api/league/team/:teamId/breakdown
  Response: { players: [{ influencer_id, activity, engagement, growth, viral, total }] }

GET /api/league/scoring-formula
  Response: { formula: "...", examples: [...] }
```

### CT Feed Endpoints
```
GET /api/ct-feed
  Query: { limit=50, skip=0, sort=recent|trending }
  Response: { tweets: [...], total: N }

GET /api/ct-feed/highlights
  Query: { limit=10 }
  Response: { tweets: [...] }
```

### User Endpoints
```
GET /api/v2/fs/me
  Auth: Required
  Response: { id, wallet, tapestry_id, contests_entered, winnings, best_rank }

PATCH /api/v2/fs/me
  Auth: Required
  Body: { display_name, email, theme }
  Response: { updated_at }

DELETE /api/v2/fs/me
  Auth: Required
  Response: { success: true }
```

### Admin Endpoints (Hackathon Only - Remove Post-Launch)
```
POST /api/admin/seed-contest
  Auth: Admin token
  Body: { name, entry_fee, player_count_estimate }
  Response: { contest_id, created_at }

POST /api/admin/finalize-contest/:contestId
  Auth: Admin token
  Response: { status: "finalized", rankings: [...] }

POST /api/admin/refresh-influencer-data
  Auth: Admin token
  Response: { updated: N, failed: M }
```

---

## 10. TECH MIGRATION PLAN

### What to Keep from Existing Codebase
| Component | Keep | Location | Notes |
|-----------|------|----------|-------|
| Fantasy Scoring Engine | ✓ | `backend/src/services/fantasyScoringService.ts` | Working perfectly, reuse as-is |
| CT Feed Backend | ✓ | `backend/src/services/ctFeedService.ts` | Minor updates for Tapestry integration |
| Twitter Data Service | ✓ | `backend/src/services/twitterApiIoService.ts` | 670 lines, proven working |
| Draft Teams Table | ✓ | Migration 20250115000002 | Exists, add contest_id FK |
| Design System | ✓ | `frontend/src/components/ui/`, `frontend/tailwind.config.js` | Gold/dark theme locked |
| Database Connection | ✓ | `backend/src/utils/db.ts` | PostgreSQL already working |
| React Component Library | ✓ | `frontend/src/components/` | Button, Card, Badge, Input |

### What to Change (Required Migrations)

#### 1. Auth System (Base Sepolia → Solana)
**Current:** SIWE (Sign In With Ethereum) + MetaMask
**New:** Privy SDK (multi-chain wallet support, Solana default)

```typescript
// OLD: backend/src/utils/auth.ts uses SIWE
import { SiweMessage } from 'siwe';

// NEW: Switch to Privy JWT
import { getPrivyAccessToken } from '@privy-io/server-auth';

// Frontend: OLD
import { useAccount, useSignMessage } from 'wagmi';

// NEW: Switch to Privy React hooks
import { usePrivy } from '@privy-io/react-auth';
```

**Tasks:**
- [ ] Install Privy: `pnpm add @privy-io/react-auth @privy-io/server-auth`
- [ ] Remove wagmi: `pnpm remove wagmi ethers`
- [ ] Update `backend/src/utils/auth.ts` - Privy JWT verification
- [ ] Update `frontend/src/pages/Login.tsx` - Privy modal
- [ ] Add `.env.local` vars: `VITE_PRIVY_APP_ID`, `PRIVY_SECRET_KEY`

#### 2. Blockchain Integration (Base Sepolia → Solana)
**Current:** Base Sepolia smart contracts (existing, not deployed)
**New:** Solana smart contracts (post-hackathon Phase 2)

**For Hackathon (MVP):** No smart contracts. Use database for state.
**After Hackathon:** Deploy actual Solana contract for escrow + prize distribution.

**Tasks:**
- [ ] For now: Stub out contract calls in code (comments with //TODO)
- [ ] Keep `backend/src/api/prizedContestsV2.ts` logic, just don't call contract methods
- [ ] Focus on database-backed contest lifecycle

#### 3. Tapestry Protocol Integration (NEW)
**Add dependency:**
```bash
pnpm add socialfi
```

**Create new service:**
```typescript
// backend/src/services/tapestryService.ts
import { Tapestry } from 'socialfi';

export async function resolveUserIdentity(walletAddress: string) {
  const tapestry = new Tapestry();
  const identity = await tapestry.resolveIdentity({ walletAddress });
  return { tapestry_user_id: identity.id, x_handle: identity.x_handle };
}

export async function storeTeamOnTapestry(userId: string, team: any) {
  const tapestry = new Tapestry();
  return await tapestry.content.create({
    user_id: userId,
    type: 'team',
    properties: { ...team }
  });
}
```

**Update auth flow:**
```typescript
// backend/src/utils/auth.ts
import tapestryService from '../services/tapestryService';

async function verifyPrivyToken(token: string) {
  const user = await getPrivyAccessToken(token);
  const tapestryIdentity = await tapestryService.resolveUserIdentity(user.wallet);
  // Store tapestry_user_id in database
  return { userId, tapestry_user_id: tapestryIdentity.id };
}
```

**Tasks:**
- [ ] Create `backend/src/services/tapestryService.ts`
- [ ] Add Tapestry calls to: team creation, contest finalization
- [ ] Test with Tapestry sandbox API

#### 4. Frontend Routing/Pages
**Current:** 9 pages (too many)
**New:** Exactly 6 core pages (section 3)

**To Keep:**
- Home (`/`) - Dashboard
- Draft (`/draft`)
- Leaderboard (`/leaderboard`)
- Contest Detail (`/contest/:id`)
- CT Feed (`/feed`)
- Profile (`/profile`)

**To Remove/Archive:**
- `/league` (old contest hub, replaced by Contest Detail)
- `/intel` (advanced analytics, post-MVP)
- `/settings` (merge into Profile)
- `/quests` (post-MVP)
- `/referrals` (post-MVP)

**Tasks:**
- [ ] Delete unused route files
- [ ] Update Router in `frontend/src/App.tsx` to 6 routes only
- [ ] Redirect old routes to new ones (301 redirects)

#### 5. Database Schema Changes
**Migrations to Add:**

```typescript
// NEW: Add Tapestry fields to users
export async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('tapestry_user_id', 255).unique();
    table.string('auth_provider', 50);  // 'privy', 'siwe'
  });
}

// NEW: Add contest_id to draft_teams
export async function up(knex) {
  await knex.schema.alterTable('draft_teams', (table) => {
    table.integer('contest_id').references('id').inTable('prized_contests');
    table.dropUnique(['user_id']);  // Remove old constraint
    table.unique(['user_id', 'contest_id']);  // New constraint
  });
}
```

**Tasks:**
- [ ] Create new migration files
- [ ] Run migrations: `pnpm exec knex migrate:latest`
- [ ] Add indexes: `CREATE INDEX idx_users_tapestry_id ON users(tapestry_user_id)`

### What to Build New

| Component | Description | Location | Est. Effort |
|-----------|-------------|----------|------------|
| Formation Visual | Captain + 4-tier layout component | `frontend/src/components/draft/FormationTeam.tsx` | 4 hours |
| Budget Display | Real-time budget counter | `frontend/src/components/draft/BudgetCounter.tsx` | 2 hours |
| Live Leaderboard | WebSocket + polling updates | `frontend/src/components/leaderboard/LiveLeaderboard.tsx` | 6 hours |
| Tapestry Integration | Team + score storage | `backend/src/services/tapestryService.ts` | 4 hours |
| Privy Auth | Solana wallet connection | `frontend/src/pages/Login.tsx` rewrite | 5 hours |
| Contest Lifecycle Cron | Automated state transitions | `backend/src/services/cronJobs.ts` update | 3 hours |
| Scoring WebSocket | Real-time score updates | `backend/src/services/websocketService.ts` | 6 hours |
| **Total** | | | **30 hours** |

### What to Delete

```
❌ frontend/src/pages/Intel.tsx (analytics)
❌ frontend/src/pages/Settings.tsx (merged to Profile)
❌ frontend/src/pages/Quests.tsx (post-MVP)
❌ frontend/src/pages/Referrals.tsx (post-MVP)
❌ frontend/src/pages/LeagueUltra.tsx (old contest hub)
❌ backend/src/api/intel.ts (analytics)
❌ backend/src/api/quests.ts (post-MVP)
❌ backend/src/api/referrals.ts (post-MVP)
❌ backend/src/api/admin.ts (except contest seeding)

Remove from package.json:
❌ wagmi
❌ @rainbow-me/rainbowkit
```

### Environment Variables (Update .env)

```env
# Auth
VITE_PRIVY_APP_ID=<get from Privy dashboard>
PRIVY_SECRET_KEY=<get from Privy dashboard>

# Tapestry
TAPESTRY_API_KEY=<get from Tapestry dashboard>
TAPESTRY_BASE_URL=https://api.usetapestry.dev/v1

# Twitter Data
TWITTER_API_IO_KEY=<existing>

# Solana (for Phase 2)
SOLANA_RPC_URL=https://api.devnet.solana.com
PROGRAM_ID=<TBD post-hackathon>

# Database
DATABASE_URL=<existing PostgreSQL connection>
```

---

## 11. 6-DAY BUILD TIMELINE

### DAY 1: THURSDAY FEB 20
**Goal:** Foundation complete. Users can sign in, see contests.
**Status:** End-of-day code review + commit

**Morning (9am-1pm UTC):**
- [ ] **Setup** (1h): Privy auth integration, install dependencies
  - `pnpm add @privy-io/react-auth @privy-io/server-auth socialfi`
  - Update `backend/.env.local`, `frontend/.env.local`
- [ ] **Auth**: Rewrite login flow (3h)
  - `backend/src/utils/auth.ts` - Privy JWT verification
  - `frontend/src/pages/Login.tsx` - Privy modal
  - Test: "Sign with Solana" button works
- [ ] **Commit:** "feat: Privy auth integration"

**Afternoon (1pm-5pm UTC):**
- [ ] **Migration**: Add Tapestry fields (1h)
  - Create new migration for `users.tapestry_user_id`
  - `pnpm exec knex migrate:latest`
- [ ] **Tapestry Service** (3h): Create `backend/src/services/tapestryService.ts`
  - `resolveUserIdentity(walletAddress)` function
  - Test with Tapestry sandbox
  - Integration test: login → Tapestry resolve ✓
- [ ] **Commit:** "feat: Tapestry identity integration"

**Evening (5pm-7pm UTC):**
- [ ] **QA Checklist:**
  - [ ] User can sign in with Solana wallet
  - [ ] User wallet + Tapestry ID stored in database
  - [ ] X handle resolved correctly
  - [ ] Logout clears token

**Day 1 Deliverable:** Auth working. User sees their wallet on Home page.

---

### DAY 2: FRIDAY FEB 21
**Goal:** Draft page fully functional. Users can build teams.
**Status:** End-of-day code review + commit

**Morning (9am-1pm UTC):**
- [ ] **Schema Update** (1h): Add contest_id to draft_teams
  - New migration: `draft_teams.contest_id` FK
  - Update unique constraint
  - `pnpm exec knex migrate:latest`
- [ ] **Formation Component** (3h): `frontend/src/components/draft/FormationTeam.tsx`
  - Visual: [CAPTAIN] above [S] [A] [B] [C]
  - Drag-and-drop or click-to-add
  - Show selected influencers, tier badges
  - Test: Captain + 4 different tiers = team ✓
- [ ] **Commit:** "feat: Formation team visual"

**Afternoon (1pm-5pm UTC):**
- [ ] **Budget Counter** (2h): `frontend/src/components/draft/BudgetCounter.tsx`
  - Display: "42 / 150 pts left"
  - Real-time recalculation on influencer select
  - Red text if over budget
- [ ] **Influencer Grid** (2h): Update `frontend/src/components/draft/InfluencerGrid.tsx`
  - Group by tier: S (4), A (16), B (30), C (50)
  - Show price, engagement rate, current score
  - Click to select/remove
  - Virtualized scroll (performance)
- [ ] **Commit:** "feat: Budget and influencer grid"

**Evening (5pm-7pm UTC):**
- [ ] **QA Checklist:**
  - [ ] User can select 5 influencers (1 per tier minimum)
  - [ ] Budget updates correctly
  - [ ] Captain slot shows 1.5x multiplier
  - [ ] Submit button enabled when team complete
  - [ ] Team saved to database

**Day 2 Deliverable:** Draft page works. Can build and submit team.

---

### DAY 3: SATURDAY FEB 22
**Goal:** Leaderboard live. Scoring updates work. Contest lifecycle automated.
**Status:** End-of-day code review + commit

**Morning (9am-1pm UTC):**
- [ ] **Scoring Cron** (2h): Update `backend/src/services/cronJobs.ts`
  - Run scoring every 6 hours (00, 06, 12, 18 UTC)
  - Call `fantasyScoringService.ts` for each contest
  - Update `draft_teams.total_score`
  - Save to `scoring_history` table
- [ ] **Contest Lifecycle Cron** (2h): Transitions
  - Monday 12:00: Create new contest, set status=open
  - Friday 23:59: Lock entries (status=locked)
  - Sunday 23:59: Finalize contest (status=finalized)
  - Auto-advance to next state every hour
- [ ] **Commit:** "feat: Automated scoring and contest lifecycle"

**Afternoon (1pm-5pm UTC):**
- [ ] **Leaderboard Page** (3h): `frontend/src/pages/Leaderboard.tsx`
  - Display top 10, then paginated table
  - Show your rank highlighted
  - Sort by rank, score, team name
  - Polling: refresh every 60 seconds
- [ ] **Live Updates Badge** (1h): "7 new scores updated" + refresh button
- [ ] **Commit:** "feat: Live leaderboard with polling"

**Evening (5pm-7pm UTC):**
- [ ] **QA Checklist:**
  - [ ] Scoring updates every 6 hours
  - [ ] Leaderboard displays correct ranks
  - [ ] Your team highlighted correctly
  - [ ] "You are 47th" message displays
  - [ ] Live updates work every 60 sec

**Day 3 Deliverable:** Leaderboard live. Scoring updates. Contest automation working.

---

### DAY 4: SUNDAY FEB 23
**Goal:** CT Feed integrated. Contest detail page. Tapestry storage working.
**Status:** End-of-day code review + commit

**Morning (9am-1pm UTC):**
- [ ] **CT Feed Integration** (2h): Update `backend/src/services/ctFeedService.ts`
  - Add Tapestry metadata to tweets
  - Filter by user's team (if on /feed with contest context)
  - Highlight top viral tweets
- [ ] **Feed Frontend** (2h): `frontend/src/pages/Feed.tsx`
  - Highlights carousel (top 5 viral)
  - Main feed (infinite scroll)
  - Tabs: All / My Team / Trending
  - Show engagement stats
- [ ] **Commit:** "feat: CT Feed with Tapestry metadata"

**Afternoon (1pm-5pm UTC):**
- [ ] **Contest Detail Page** (3h): `frontend/src/pages/ContestDetail.tsx`
  - Contest info (name, status, prize pool, lock time)
  - Scoring rules accordion
  - Timeline (when entries lock, etc.)
  - Prize breakdown table
  - [Join] or [View Team] button
- [ ] **Tapestry Team Storage** (1h): When draft submitted
  - Call `tapestryService.storeTeamOnTapestry(user_id, team_data)`
  - Verify stored on Tapestry sandbox
- [ ] **Commit:** "feat: Contest detail + Tapestry team storage"

**Evening (5pm-7pm UTC):**
- [ ] **QA Checklist:**
  - [ ] CT Feed loads tweets correctly
  - [ ] Highlights show top viral tweets
  - [ ] Contest detail shows all info
  - [ ] Prize breakdown calculated correctly
  - [ ] Teams stored on Tapestry ✓

**Day 4 Deliverable:** Feed live. Contest details working. Tapestry integration proven.

---

### DAY 5: MONDAY FEB 24
**Goal:** Profile page + Admin seeding. All pages complete. Bug fixes.
**Status:** End-of-day code review + commit

**Morning (9am-1pm UTC):**
- [ ] **Profile Page** (2h): `frontend/src/pages/Profile.tsx`
  - User card (wallet, joined date)
  - Career stats (contests, winnings, best rank)
  - Weekly stats
  - Achievement badges
  - Settings (notifications, theme)
- [ ] **Admin Contest Seeding** (2h): `backend/src/api/admin.ts` (temporary)
  - `POST /api/admin/seed-contest` - Create contest + dummy entries
  - `POST /api/admin/finalize-contest/:id` - Force finalize for testing
  - Remove these endpoints after hackathon
- [ ] **Commit:** "feat: Profile page and admin seeding tools"

**Afternoon (1pm-5pm UTC):**
- [ ] **Routing Cleanup** (1h):
  - Delete unused page files (Intel, Quests, Referrals, Settings, LeagueUltra)
  - Update `frontend/src/App.tsx` to 6 routes only
  - 301 redirects for old URLs
- [ ] **Bug Fixes + Polish** (2h):
  - Mobile responsiveness checks
  - Test all error states (loading, failed, empty)
  - Ensure all buttons work
  - Toast notifications for actions
- [ ] **Commit:** "refactor: Remove unused pages, routing cleanup"

**Evening (5pm-7pm UTC):**
- [ ] **QA Checklist:**
  - [ ] Profile shows all stats correctly
  - [ ] Mobile layout responsive
  - [ ] All 6 pages accessible
  - [ ] No console errors
  - [ ] Error states display helpful messages

**Day 5 Deliverable:** All pages complete. UI polished. Ready for hackathon showcase.

---

### DAY 6: TUESDAY FEB 25
**Goal:** User testing. Demo data seeded. Video recording.
**Status:** End-of-day ready for judging

**Morning (9am-1pm UTC):**
- [ ] **Seed Realistic Data** (2h): Use admin endpoints to:
  - Create 1 active contest
  - Create 50 dummy user entries
  - Generate scores for top 10 performers
  - Populate CT Feed with real tweets
  - Seed user's profile with stats
- [ ] **Video Recording Setup** (1h):
  - Record 3-minute demo video:
    - 0:00-0:30: Problem (SocialFi died)
    - 0:30-2:15: Demo walkthrough
    - 2:15-3:00: Impact (Solana + Tapestry)
  - Use Loom or similar
  - Upload to GitHub repo
- [ ] **Commit:** "demo: Seed data and video walkthrough"

**Afternoon (1pm-5pm UTC):**
- [ ] **Beta User Testing** (2h):
  - Invite 5-10 friends to test
  - Gather feedback (bugs, confusing flows)
  - Fix critical bugs immediately
- [ ] **Deployment Prep** (2h):
  - Ensure `.env` vars set correctly
  - Test on staging environment
  - DB backups
  - Final code review
- [ ] **Commit:** "chore: Pre-launch final checks"

**Evening (5pm-7pm UTC):**
- [ ] **Final QA Checklist:**
  - [ ] All 6 pages load without errors
  - [ ] Contest is live with real users
  - [ ] Leaderboard shows correct rankings
  - [ ] Tapestry integration confirmed
  - [ ] Video recorded and uploaded
  - [ ] Repo clean, no secrets in code

**Day 6 Deliverable:** Live MVP ready. Users can sign up, draft, compete. Video demo uploaded.

---

### DAY 7: WEDNESDAY FEB 26 (Buffer Day)
**Goal:** Last-minute fixes, final testing before Feb 27 deadline.

**Contingencies:**
- [ ] If Tapestry API down: Switch to mock implementation
- [ ] If bugs found: Hot fixes on live instance
- [ ] If performance issues: Database query optimization
- [ ] If Privy auth fails: Fallback to test wallets

**Final Checks:**
- [ ] Demo data refreshed (today's date)
- [ ] All links working
- [ ] Error handling graceful
- [ ] Load test (can handle 100+ concurrent users)

---

## 12. DEMO STRATEGY

### 3-Minute Video Format (Hackathon)

**Structure:**
```
MINUTE 0:00-0:30: PROBLEM (Show the graveyard)
├─ Screenshot: Friend.tech, Star's Arena logos with "X" over them
├─ Text: "Friend.tech: $2M/day → $0 in 60 days. 92% churn."
├─ Text: "Why? Ponzi mechanics. Buy keys, hope next buyer comes."
├─ Text: "SocialFi is dead. Unless..."
└─ Voiceover: "We resurrected it with game theory."

MINUTE 0:30-2:15: DEMO (Show the resurrection)
├─ 0:30-0:45: Home page
│  ├─ Show: "Join Free Contest" CTA
│  ├─ Show: My team card with live scores updating
│  └─ Say: "You draft 5 CT influencers. Real engagement = real points."
│
├─ 0:45-1:15: Draft page
│  ├─ Show: Captain slot (1.5x multiplier highlighted)
│  ├─ Show: Tier-based influencer selection
│  ├─ Show: Budget counter in real-time
│  ├─ Click: Submit team
│  └─ Say: "Choose your captain, fill each tier, lock in."
│
├─ 1:15-1:45: Leaderboard
│  ├─ Show: Live scoring updates (1-2 sec gap between them)
│  ├─ Highlight: "You are 47th of 214"
│  ├─ Show: Clicking team name reveals score breakdown
│  └─ Say: "Scores update hourly as influencers tweet. You climb the leaderboard."
│
├─ 1:45-2:00: CT Feed
│  ├─ Show: Trending tweets from your team
│  ├─ Show: Viral badge (100K+ engagement)
│  └─ Say: "See what your team is tweeting in real-time."
│
└─ 2:00-2:15: Profile + Stats
   ├─ Show: Career stats (contests, winnings, rank)
   ├─ Show: Wallet connected (Solana badge)
   └─ Say: "Every achievement stored on Tapestry Protocol."

MINUTE 2:15-3:00: IMPACT (Why Solana specifically)
├─ Text: "SocialFi ≠ Chain-agnostic Ponzi"
├─ Say: "Foresight is Solana-native because..."
│
├─ Point 1: "1. IDENTITY LAYER"
│  ├─ Show: Tapestry Protocol logo
│  ├─ Say: "Using Tapestry (Solana's social identity standard)"
│  └─ Say: "No anonymous accounts. No spam bots. Real accounts only."
│
├─ Point 2: "2. SCORE PORTABILITY"
│  ├─ Say: "Scores stored on-chain on Tapestry"
│  ├─ Say: "Winners can prove achievements cross-app"
│  └─ Show: Score badge on profile
│
├─ Point 3: "3. RESPONSIBLE MONETIZATION"
│  ├─ Say: "Smart contracts hold prize escrow"
│  ├─ Say: "No centralized control. Users verify distribution."
│  └─ Show: Prize distribution table
│
└─ Closing: "Fantasy sports has $100B TAM. Solana has identity layer. We connect them."
```

**Technical Specs:**
- Resolution: 1920x1080 or better
- Format: MP4 (YouTube compatible)
- Voiceover: Clear, energetic, 180-200 words per minute
- Background music: Upbeat, no copyright (Epidemic Sound)
- Slides: 4-5 slides max, readable text, brand colors (gold + dark)

### What the Live Demo Shows (if time permits)
If judges want to see the app live at hackathon:

1. **Sign In** (15 sec)
   - Click "Sign with Solana"
   - Privy modal appears
   - Select wallet (Phantom)
   - Approve signature
   - Redirect to Home

2. **Draft Team** (30 sec)
   - Click "Join Free Contest"
   - Land on Draft page
   - Select Captain (@solana, S-tier, 45 pts)
   - Fill A-Tier slot
   - Fill B-Tier slot
   - Fill 2x C-Tier slots
   - Budget: "5 / 150 left" ✓
   - Click Submit
   - Toast: "Team locked! #47 / 214"

3. **Live Leaderboard** (20 sec)
   - Show leaderboard refreshing every 60 seconds
   - Point to user's name: "That's us, 47th"
   - Show top 3 (with prize money amount)
   - Explain: "Scores update as influencers tweet"

4. **CT Feed** (15 sec)
   - Show trending tweets
   - Point to engagement numbers
   - Explain: "These are the influencers on your team"

**Total Live Demo:** ~2 minutes (leave time for questions)

### What Data Needs to Be Seeded
```
Seed script: backend/src/scripts/seedHackathonData.ts

1. Users (50 fake users)
   └─ Wallets: 0x1111...0001, 0x1111...0002, etc.
   └─ Names: user_A, user_B, etc.
   └─ Tapestry IDs: pre-resolved

2. Influencers (100 - already in DB)
   └─ Ensure scores are realistic (last 7 days)

3. Active Contest
   └─ Status: "open" or "scoring"
   └─ Lock time: Tomorrow 23:59 UTC
   └─ End time: 7 days from now
   └─ Prize pool: 50 SOL (for paid contest)

4. Entries (50)
   └─ Each user in contest with random team
   └─ Scores generated: Activity 20-35, Engagement 30-60, Growth 10-40, Viral 0-25
   └─ Ranks calculated: 1-50

5. CT Tweets (100)
   └─ Top 20 influencers with recent tweets
   └─ Mix of engagement levels
   └─ 3-5 viral tweets (100K+ engagement)

6. Your Test Account
   └─ Wallet: 0x2222...2222
   └─ Team: Captain @solana, @arianna_tx, @someuser, etc.
   └─ Rank: #7 (impressive but not cheating)
   └─ Score: 245 pts
```

**Run:** `node -r tsx/cjs backend/src/scripts/seedHackathonData.ts`

### Backup Plan (if live demo fails)
1. Have pre-recorded video of full flow
2. Show screenshots of each page
3. Explain: "Live data updates happen every hour. Here's what you'd see..."
4. Demo scoring update manually (show database, then UI)

---

## 13. SUCCESS METRICS

### What Proves This Works at Hackathon (Feb 27)

**Requirement: "Real Users"**
```
✓ At least 20 users signed up and drafted teams
✓ At least 50 contest entries (accounts can enter multiple contests)
✓ Leaderboard shows realistic rankings (not obviously fake)
✓ Scoring updated at least 2x (proves system works)
✓ Tapestry integration verified (judge can see team data on Tapestry)
```

**Requirement: "Working Demo"**
```
✓ Sign in works (Privy + Solana)
✓ Draft page functional (can select 5 influencers, submit)
✓ Leaderboard shows live data (not empty)
✓ Contest detail shows prize pool + timeline
✓ CT Feed shows real tweets with engagement numbers
✓ Profile shows user stats
✓ No uncaught errors in console
```

**Requirement: "Solana-Native Justification"**
```
✓ Can explain why Tapestry Protocol was chosen (not just any API)
✓ Show Tapestry API responses (team + score stored)
✓ Mention roadmap: Smart contracts for Phase 2
✓ Judge can verify identity layer prevents spam
```

**Requirement: "Novel + Marketable"**
```
✓ Judge understands game theory: "Fantasy sports math > ponzi"
✓ Positioning: "Resurrection of SocialFi" resonates
✓ Formation visual + live scoring are impressive
✓ 3-min video tells coherent story
```

**Scoring Rubric (estimated):**
```
Functionality (50%):        45/50 (all pages working, minor bugs OK)
Novelty (20%):              18/20 (SocialFi resurrection narrative)
Market Potential (20%):     19/20 (clear TAM, proven model)
Design/UX (10%):            9/10 (gold + dark theme polished)
─────────────────────────────────────────
Total:                      91/100 (Top 10-15 submissions)
```

---

## 14. POST-HACKATHON TARGETS

### Week 1 (March 3-9, 2026)
```
Users:
- 100 DAU (organic from hackathon visibility)
- 10 paid contest entrants
- Featured on Product Hunt

Contests:
- 2 free contests running (weekly)
- 1 paid contest (0.01 SOL entry)

Revenue:
- $0 (free contests)
- Paid contest: $0.10 SOL rake (10×0.01 entry × 0.85 payout)

Engineering:
- Privy auth fully tested
- Tapestry integration rock-solid
- Leaderboard performance optimized (< 500ms load)
```

### Month 1 (March 2026)
```
Users:
- 500 DAU
- 5,000 lifetime users

Contests:
- 4 free contests/week
- 2-3 paid contests/week (0.01-0.1 SOL entry)
- "Season 1" campaign (12-week league)

Revenue:
- ~$50-100 SOL/week rake

Engineering:
- Smart contract deployed on Solana mainnet
- Prize escrow working
- Leaderboard real-time WebSocket (no polling)

Marketing:
- Twitter campaign (@foresight_xyz)
- 3-4 influencer partnerships
- CT community threads
```

### Month 3 (May 2026)
```
Users:
- 2,000 DAU
- 25,000 lifetime users

Contests:
- Daily free contests
- 5-10 paid contests/week
- Tournament brackets (playoff-style)

Revenue:
- $500-1,000 SOL/week rake
- Stretch: $1-2K DAU, $5-10K weekly revenue

Engineering:
- Mobile app (iOS/Android via React Native or PWA)
- Referral system (2 SOL bonus)
- Achievement badges (on Tapestry)

Marketing:
- Series A fundraising conversations
- Sponsorships (CT conferences, Solana ecosystem)
```

---

## APPENDIX A: GLOSSARY

| Term | Definition |
|------|-----------|
| **CT** | Crypto Twitter - X/Twitter accounts discussing crypto |
| **Influencer** | Top 100 CT accounts by follower count (100K+) |
| **Team** | 5 influencers selected by player (1 captain + 4 tier-based) |
| **Captain** | Team member with 1.5x score multiplier |
| **Tier** | S (4 accounts) / A (16) / B (30) / C (50) - difficulty levels |
| **Salary Cap** | 150 draft points budget (artificial scarcity) |
| **Draft** | Act of building a team within 15 minutes |
| **Contest** | Weekly competition with multiple players competing |
| **Leaderboard** | Real-time rankings of all players in a contest |
| **Score** | Points earned by influencers based on social engagement |
| **Scoring Update** | Hourly refresh of influencer scores (0:00, 6:00, 12:00, 18:00 UTC) |
| **Viral** | Tweet with 100K+ engagement (likes + retweets + replies) |
| **Rake** | 15% of prize pool kept by platform |
| **Prize Pool** | Total money distributed to winners each contest |
| **Tapestry** | Solana's social identity + content layer (identity verification + team storage) |
| **Privy** | Multi-chain wallet authentication SDK (Solana support) |

---

## APPENDIX B: FILE STRUCTURE (After Implementation)

```
/Users/mujeeb/foresight/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts (updated: Privy)
│   │   │   ├── league.ts (existing)
│   │   │   ├── ctFeed.ts (updated: Tapestry)
│   │   │   ├── admin.ts (NEW: seeding for hackathon)
│   │   │   └── [others, unchanged]
│   │   │
│   │   ├── services/
│   │   │   ├── fantasyScoringService.ts (keep as-is)
│   │   │   ├── ctFeedService.ts (updated)
│   │   │   ├── tapestryService.ts (NEW)
│   │   │   ├── cronJobs.ts (updated: lifecycle automation)
│   │   │   └── [others, keep existing]
│   │   │
│   │   ├── utils/
│   │   │   ├── auth.ts (updated: Privy JWT)
│   │   │   ├── db.ts (existing)
│   │   │   └── logger.ts (existing)
│   │   │
│   │   └── scripts/
│   │       ├── seedHackathonData.ts (NEW)
│   │       └── [others, keep existing]
│   │
│   └── migrations/
│       ├── 20250220_add_tapestry_fields.ts (NEW)
│       └── 20250220_update_draft_teams_schema.ts (NEW)
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx (keep, update landing)
│   │   │   ├── Draft.tsx (keep, enhance)
│   │   │   ├── Leaderboard.tsx (keep, add live updates)
│   │   │   ├── ContestDetail.tsx (keep as-is)
│   │   │   ├── Feed.tsx (rename from CTFeed, enhance)
│   │   │   ├── Profile.tsx (keep, add Tapestry)
│   │   │   ├── Intel.tsx (DELETE)
│   │   │   ├── Quests.tsx (DELETE)
│   │   │   ├── Referrals.tsx (DELETE)
│   │   │   ├── Settings.tsx (DELETE - merge to Profile)
│   │   │   └── LeagueUltra.tsx (DELETE)
│   │   │
│   │   ├── components/
│   │   │   ├── draft/
│   │   │   │   ├── FormationTeam.tsx (NEW - 4h)
│   │   │   │   ├── BudgetCounter.tsx (NEW - 2h)
│   │   │   │   └── InfluencerGrid.tsx (keep, update)
│   │   │   │
│   │   │   ├── leaderboard/
│   │   │   │   ├── LiveLeaderboard.tsx (NEW - 6h)
│   │   │   │   └── LeaderboardTable.tsx (keep)
│   │   │   │
│   │   │   ├── ui/
│   │   │   │   └── [all existing components, keep]
│   │   │   │
│   │   │   └── [others, keep existing]
│   │   │
│   │   ├── hooks/
│   │   │   ├── usePrivy.ts (NEW - Privy integration)
│   │   │   └── [others, keep existing]
│   │   │
│   │   ├── App.tsx (update: 6 routes only)
│   │   └── index.css (keep: design system)
│   │
│   └── .env.local (update: VITE_PRIVY_APP_ID)
│
├── migrations/
│   ├── 20250220_add_tapestry_fields.ts
│   └── 20250220_update_draft_teams_schema.ts
│
├── docs/
│   └── PRODUCT_SPECIFICATION_FINAL.md (this file)
│
├── scripts/
│   └── screenshot.ts (existing, keep)
│
└── .env.local (update: new keys)
```

---

## APPENDIX C: COMMAND REFERENCE

### Local Development
```bash
# Start servers
cd backend && NODE_OPTIONS='--import tsx' pnpm dev  # :3001
cd frontend && pnpm dev                              # :5173

# Database
cd backend && NODE_OPTIONS='--import tsx' pnpm exec knex migrate:latest
cd backend && node -r tsx/cjs src/scripts/seedHackathonData.ts

# Tests
cd backend && pnpm test
cd frontend && pnpm test

# Screenshots
./node_modules/.bin/tsx scripts/screenshot.ts /home --full
./node_modules/.bin/tsx scripts/screenshot.ts /draft --full
```

### Deployment Checklist
```bash
# 1. Code review
git log --oneline -10

# 2. Run all tests
cd backend && pnpm test
cd frontend && pnpm test

# 3. Build for production
cd frontend && pnpm build

# 4. Database migration (production)
NODE_ENV=production pnpm exec knex migrate:latest

# 5. Seed production data (if needed)
NODE_ENV=production node -r tsx/cjs src/scripts/seedHackathonData.ts

# 6. Deploy (instructions depend on hosting)
```

---

## SIGN-OFF

**Document Status:** LOCKED FOR IMPLEMENTATION
**Last Updated:** February 20, 2026
**Approved By:** Project Lead + Engineering Team

**This specification is the single source of truth for the Foresight MVP. All implementation decisions must reference this document. No features outside this scope are approved for the 6-day build.**

### Next Steps
1. Print/bookmark this document
2. Create GitHub issues for each component (timeline section)
3. Assign tasks to developers
4. Daily standup: Report progress against this spec
5. Any deviations require explicit approval (escalate immediately)

---

**END OF SPECIFICATION**
