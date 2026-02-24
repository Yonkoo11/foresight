# GROWTH & RETENTION STRATEGY
## Foresight - The Engagement & Habit Loop Blueprint

> **Date:** February 25, 2026
> **Role:** Growth & Retention Specialist (DraftKings, FanDuel, Robinhood, PrizePicks experience)
> **Audience:** Product, Engineering, Growth leads
> **Objective:** Design the daily/weekly rituals that keep users coming back, make them invite friends, and turn Foresight into a habit-forming game.

---

## EXECUTIVE SUMMARY: THE CORE PROBLEM

### The Gap
- Contests run **weekly (Mon → Sun)** — massive Dead Zone of 5-6 days after a user enters
- After entering a team, **nothing pulls the user back until contest lock**
- Score updates **4x daily** but user has no reason to check
- Claiming prizes **requires remembering to come back**
- Referral system exists but has **zero surface area**
- New users see **0 followers** (social proof failure) → immediate shame spiral
- **No push notifications** = no way to interrupt the weekly lull

### Why This Matters
- Weekly contest cycle + dead zone = **1-week churn cliff**
- Without re-engagement hooks, **80%+ of new users never return for week 2**
- Referral growth stalls because winners don't have moments to celebrate
- Competitive momentum dies after lock → no reason to stay til finalization

### The Competitive Benchmark
- **DraftKings:** Daily contests create daily habits; weekly creates retention cliffs
- **Robinhood:** "First stock" moment + feed updates + fractional shares = 5-10x/day checks
- **Duolingo:** Streak + social comparison + time-based prompts = 200M DAU with 60% retention
- **PrizePicks:** Live scoring + leaderboard positioning + prize countdown = check-ins every 6 hours

### Our Advantage
- **Tapestry backend is ready:** Follow, activity feed, likes, comments already implemented
- **Formation visual differentiator:** Unique team-building moment (no competitor has this)
- **CT domain knowledge:** Users KNOW the influencers — no learning curve
- **Real-time scoring infrastructure:** SSE-ready, 30s polling, 4x/day updates

---

## SECTION 1: THE CORE HABIT LOOP
### What is the daily/weekly ritual we're creating?

### The Foresight Ritual (Weekly Cycle)

```
PHASE 1: DRAFT (Mon 12:00 UTC) — Formation moment
  ├─ User opens app
  ├─ Sees live leaderboard (who's winning this week?)
  ├─ Drafts 5-player team (formation visual = sticky moment)
  ├─ Shares team card on Twitter (referral trigger)
  └─ Primary action: COMPLETE ✓

PHASE 2: SCORING LIVE (Mon-Sun, 4x daily) — Checking momentum
  ├─ User checks app in idle moments
  ├─ Sees live score ticker (captain 1.5x boost visible)
  ├─ Watches team climb/drop in leaderboard
  ├─ Friends' scores visible (social comparison)
  ├─ Activity feed shows who's winning (FOMO trigger)
  └─ Habit: Check every 6-12 hours (not daily yet — this is the gap)

PHASE 3: LEADERBOARD JOCKEYING (Wed-Fri) — Competitive tension
  ├─ User sees they're #47 out of 50 (top-tier finisher feeling)
  ├─ Checks how many points to climb to #40 (competitive tension)
  ├─ Looks at @top_player's team to learn draft strategy (follow trigger)
  ├─ Follows #1 player (now has 1 follower, not 0 — psychological shift)
  ├─ Compares with friends' scores (social comparison peak)
  └─ Habit: Check daily during this phase

PHASE 4: FINALE (Sun 23:59) — Countdown pressure
  ├─ Last 24 hours: notifications/messaging says "One day left"
  ├─ User checks final scores
  ├─ Celebrates if they placed top-3 (medal UI, share moment)
  ├─ Feels disappointed if close miss (primes them for next week)
  └─ Habit: Check multiple times in final day

PHASE 5: CLAIM & CELEBRATE (Mon, after lock) — Prize moment
  ├─ User claims prize (if won)
  ├─ Sees celebration screen + share card (second Twitter moment)
  ├─ Optional: "Challenge this player" prompt (next week setup)
  └─ Primary action: Immediate re-engagement to Draft next team
```

### Why This Loop Works (Behavioral Science)

| Phase | Mechanism | Psychological Driver | Frequency |
|-------|-----------|---------------------|-----------|
| **Draft** | Formation visual, team selection | Mastery + Identity | Weekly |
| **Scoring Live** | Real-time leaderboard, 30s refresh | Variable Rewards + Gamification | 6-12h checks |
| **Jockeying** | Friend comparison, follower growth | Social Comparison + Status | Daily |
| **Finale** | Countdown, last-minute plays | Loss Aversion + Urgency | Multiple daily |
| **Celebrate** | Prize claim, share card | Accomplishment + Social Proof | Weekly |

### Current State vs. Desired State

**Current (PROBLEM):**
```
Draft ✓ → [6-DAY DEAD ZONE] → Scoring (sparse checks) → [ANOTHER DEAD ZONE] → Claim
```

**Desired (SOLUTION):**
```
Draft ✓ → Immediate Share ✓ → Daily Checks (scoring + feed) ✓ → Social Follows ✓
→ Finale Urgency ✓ → Celebrate ✓ → [Friction-free] → Re-Draft ✓
```

---

## SECTION 2: ONBOARDING FLOW
### The first 3 minutes after signup — step-by-step

### Goal: **"90 seconds from signup to leaderboard"**

This is your hackathon demo narrative. Make judges see real value immediately.

### Phase 1: Auth → Profile (30 seconds)

**Step 1a: Email/Social Login (Privy)**
```
┌─────────────────────────────────┐
│ Welcome to Foresight            │
│                                 │
│ [Continue with Google]          │
│ [Continue with Twitter]         │
│ [Sign in with Email]            │
│                                 │
│ "Draft 5 CT influencers.        │
│  Track their engagement.        │
│  Climb the leaderboard."        │
└─────────────────────────────────┘

Messaging: NO "connect wallet" friction
Timing: 5-10 seconds (Privy handles embedded wallet)
```

**Step 1b: Username + Avatar (Gated)**
```
┌─────────────────────────────────┐
│ Create Your Profile             │
│                                 │
│ [Username input: _________]     │
│                                 │
│ [Avatar selector: 8 options]    │
│                                 │
│ [Next] ← Only enabled if user   │
│         picks both              │
│                                 │
│ "You'll appear as @username    │
│  on the leaderboard."          │
└─────────────────────────────────┘

Timing: 15-20 seconds
Friction: Minimal (pre-generated avatars, no upload)
Psychological: Ownership (customization = commitment)
```

**Outcome: User has a profile. Sunk cost is LOW but EXISTS.**

---

### Phase 2: Leaderboard Preview → Follow Moment (30 seconds)

**Step 2a: See Real Leaderboard (Show live data)**
```
┌─────────────────────────────────┐
│ 🏆 This Week's Leaders          │
│                                 │
│ 1. @alex_tr  8,950 pts          │
│    ► Top 10% | Following ✓      │
│                                 │
│ 2. @dune_x   8,847 pts          │
│    ► Top 10%                    │
│                                 │
│ 47. YOU @you  4,320 pts         │
│    ► Top 50% | 3 followers      │
│                                 │
│ [See Full Leaderboard]          │
│ [View Friends' Scores]          │
│                                 │
│ "Real players, real scores,     │
│  updated every 30 seconds."     │
└─────────────────────────────────┘

Timing: 10 seconds (auto-loaded)
Psychology: Social Proof (others are already winning)
Friction: ZERO (read-only, no action required)
```

**Step 2b: Prompt to Follow a Top Player (1-click)**
```
┌─────────────────────────────────┐
│ Learn from the best?             │
│                                 │
│ Follow @alex_tr (Rank #1)       │
│ to see their team composition    │
│ and draft strategy.              │
│                                 │
│ [Follow] [Skip]                 │
│                                 │
│ "Following helps you learn      │
│  and compare your progress."    │
└─────────────────────────────────┘

Timing: 5 seconds
Psychology: Social Proof + Competitive Learning
Friction: 1 click (or skip)
Outcome: User now has 1 follower (psychological win: not 0)
```

**Outcome: User has joined the leaderboard, follows 1 player, sees they're in top 50%.**

---

### Phase 3: Draft First Team (90 seconds)

**Step 3a: Contest Selection (1 click)**
```
┌─────────────────────────────────┐
│ Join This Week's Free League    │
│                                 │
│ 🎯 Hackathon Demo League        │
│ • 0 SOL entry (FREE)            │
│ • 0.05 SOL prize pool           │
│ • 47 players already entered    │
│ • Drafting closes: Mon 12:00 UTC│
│                                 │
│ [Draft Team] [Browse Other]     │
│                                 │
│ "No risk. Real rewards.         │
│  Guaranteed SOL pool."          │
└─────────────────────────────────┘

Timing: 5 seconds
Psychology: FOMO (47 players already in) + Gambling without risk
Friction: 1 click
```

**Step 3b: Formation Visual (Sticky moment — 30-40 seconds)**
```
┌─────────────────────────────────┐
│ Build Your 5-Player Team        │
│                                 │
│        [Captain Slot]           │ <- 1.5x multiplier highlighted
│       /           \             │
│      /             \            │
│  [Slot2]       [Slot3]          │
│      \             /            │
│       \           /             │
│    [Slot4]   [Slot5]            │
│                                 │
│ Budget: 150 pts | Used: 85      │
│                                 │
│ "Pick a captain (1.5x boost)   │
│  + 4 tier-matched influencers" │
└─────────────────────────────────┘

Timing: 30-40 seconds (user clicks each slot, sees avatars update)
Psychology: Visual mastery, clear formation = different than text list
Friction: Intuitive (tap → see influencers → tap to select)
Outcome: Team is built, budget filled, captain chosen
```

**Step 3c: Confirm + Share Prompt (20 seconds)**
```
┌─────────────────────────────────┐
│ ✓ Team Created!                 │
│                                 │
│ Team: [Formation visual]        │
│                                 │
│ You're now competing with       │
│ 47 other players.              │
│                                 │
│ [Share on Twitter] [Done]       │
│                                 │
│ "Share your team. Challenge     │
│  your friends. Get followers."  │
└─────────────────────────────────┘

Timing: 10-20 seconds
Psychology: Celebration + Social Proof (sharing = commitment)
Friction: 1 click (Twitter pre-fill)
Outcome: REFERRAL TRIGGER ACTIVATED
```

**Outcome: User has entered a contest, drafted a team, potentially shared.**

---

### Phase 4: Show Live Score Ticker (Final moment — auto-load)
```
┌─────────────────────────────────┐
│ 📊 Your Team, Live              │
│                                 │
│ Current Score: 245 pts          │
│ Your Rank: #15 this week        │
│ Time to Lock: 45 mins           │
│                                 │
│ [Captain @alex_tr]              │ <- 1.5x visible
│ Engagement: +78 pts (117 base)  │
│                                 │
│ [Slot 2 @dune_x]                │
│ Growth: +34 pts                 │
│                                 │
│ [Browse Full Team Details]      │
│ [Watch Live Leaderboard]        │
│                                 │
│ "Scores update every 30 seconds"│
└─────────────────────────────────┘

Timing: Auto-loaded (no friction)
Psychology: Real-time feedback (Robinhood's live trading feel)
Outcome: User sees value immediately (score is updating, they're #15, beating others)
```

---

### Onboarding Success Metrics

| Moment | Action | Target | Benchmark |
|--------|--------|--------|-----------|
| Auth | Signup completes | 90%+ | Privy handles this |
| Profile | Username + avatar | 85%+ | Low friction |
| Leaderboard | View real scores | 95%+ | Auto-loaded |
| Follow | Follow top player | 60%+ | Suggested, not forced |
| Contest | Enter free league | 70%+ | Frictionless |
| Draft | Complete team | 80%+ | Clear UX |
| Share | Share on Twitter | 30%+ | Celebration moment |
| **Total Time** | **Signup → Live Score** | **<90 seconds** | **DraftKings benchmark** |

---

## SECTION 3: RE-ENGAGEMENT TRIGGERS
### The 5 most important moments to pull the user back

### Trigger #1: Score Updates (HIGHEST FREQUENCY)
**When:** Every 6 hours (4x daily: 12:00, 18:00, 00:00, 06:00 UTC)
**What the user sees:**
```
[Banner at top of app]
┌─────────────────────────────────┐
│ 📈 Scores Updated!              │
│ Your team: +42 pts this round   │
│ You're now #14 (was #15)        │
│ [View Live Leaderboard]         │
└─────────────────────────────────┘

Or via email (if opted in):
Subject: "You gained 42 pts! You're #14 now"
Buttons: [View Team] [See Leaderboard]
```

**Why it works:**
- **Frequency:** Interrupts the dead zone (user gets 4 reasons to check instead of 0)
- **Momentum:** +42 pts = progress. User feels like they're "doing something"
- **Ranking:** Rank change (#15 → #14) = competitive feedback in real time
- **Recency:** Fresh number (updated 1 hour ago) feels live, not stale

**Implementation:**
```typescript
// backend/src/services/activityFeedService.ts
// POST /api/activity/trigger-score-update
// Fires at 12:00, 18:00, 00:00, 06:00 UTC via cron
// Sends:
// 1. In-app banner (toast notification)
// 2. Email (if user opted in)
// 3. Activity feed entry (shows in app.userActivityFeed)
// Stores score snapshot for "Score Progression" chart
```

**Behavioral Psychology:**
- **Variable Reward Schedule:** User doesn't know if +42 or +12 (dopamine varies)
- **Anchoring:** "You're #14" is anchored to previous rank, creates momentum feeling
- **Urgency:** "This round" implies time is passing, leaderboard is changing

---

### Trigger #2: Friend/Follow Activity (SOCIAL PROOF)
**When:** Real-time (as friends earn points, activity feed updates)
**What the user sees:**

**On home page (ActivityFeedCard.tsx):**
```
┌─────────────────────────────────┐
│ 🔥 What's Happening             │
│ Updates every 30 seconds        │
│                                 │
│ 🏆 @alex_tr +289 pts this week  │
│    Rank: #1 (Captain: @dune_x) │
│    6 mins ago                   │
│                                 │
│ 📈 @newbie_ct +87 pts           │
│    Rank: #23                    │
│    12 mins ago                  │
│                                 │
│ 🎯 You +42 pts (this round)     │
│    Rank: #14                    │
│    Just now                     │
│                                 │
│ [See All Activity]              │
└─────────────────────────────────┘

Psychology: See others winning → FOMO → "I need to check my score"
```

**Why it works:**
- **Real-time updates:** Feed refreshes every 30s (variable reward schedule)
- **Social proof:** Seeing @alex_tr winning makes user feel like they should be winning too
- **Specific scores:** "+289 pts" is more compelling than "Player gained points"
- **Recency:** "6 mins ago" creates urgency (game is still unfolding)

**Implementation:**
```typescript
// backend/src/services/activityFeedService.ts
// GET /api/activity/feed
// Returns last 12 hours of activity (follows, scores, likes)
// Frontend: Poll every 30s (ActivityFeedCard.tsx)
// If user not on home page, queue "activity happened" notification
```

**Behavioral Psychology:**
- **Social Proof:** Everyone else is winning → I can too
- **FOMO:** Other players' scores are live → mine is too → I need to check
- **Reciprocal Altruism:** Seeing friend's win makes me want to follow them (build community)

---

### Trigger #3: Competitive Position (LEADERBOARD JOCKEYING)
**When:** Wed-Fri (mid-contest when games matter most)
**What the user sees:**

**In-app notification (if they haven't checked in 12 hours):**
```
Title: "@alex_tr just passed you!"
Body: "You're now #15. Close the gap: 47 more points to #14."
CTA: [See Leaderboard]

Or on Leaderboard page:
┌─────────────────────────────────┐
│ 🏆 This Week's Rankings         │
│                                 │
│ [Gold] 1. @alex_tr   8,950 pts  │
│ [Silver] 2. @dune_x  8,847 pts  │
│ [Bronze] 3. @wizard  8,720 pts  │
│          ↓                      │
│ 14. Someone else 4,368 pts      │
│     [Follow]                    │
│                                 │
│ 15. YOU @you    4,321 pts       │ <- Highlight
│     [vs #14: -47 pts]           │ <- Gap to next rank
│     [Vs Friends: +12 pts ahead] │
│                                 │
│ 16. @newbie_ct  4,250 pts       │
│     [Follow]                    │
│                                 │
│ "[See Friends Only] [View All]" │
└─────────────────────────────────┘

Why it works:
- Exact gap shown ("-47 pts to #14") creates achievable target
- Gold/Silver/Bronze podium creates aspirational feeling (want to be top 3)
- Friend comparison shows local competition (easier to beat friends than randoms)
```

**Why it works:**
- **Loss Aversion:** "You're now #15" (losing ground) > "You're still #15"
- **Achievable Gap:** "-47 pts to #14" is concrete (not abstract "climb higher")
- **Social Comparison:** Friends are at-hand competitors (easier motivation than strangers)
- **Status Seeking:** Top-3 medal icons = visual status marker

**Implementation:**
```typescript
// backend/src/api/leaderboard.ts
// GET /api/leaderboard/fs
// Add fields: gapToNextRank, friendComparison, previousRank
// Frontend: Highlight user's row, show gap visualization
// Send email Wed/Thu/Fri if user rank has changed significantly
```

**Behavioral Psychology:**
- **Competitive Tension:** Every 12 hours, rank might shift → check app
- **Concrete Goals:** "-47 pts to #14" is actionable (not abstract)
- **Status Markers:** Medals/badges = visible rank (easier than explaining score)

---

### Trigger #4: Finale Countdown (URGENCY + LOSS AVERSION)
**When:** Sun 23:00 UTC onwards (final 24 hours)
**What the user sees:**

**Banner on every page (Sun morning):**
```
┌─────────────────────────────────┐
│ ⏳ ONE DAY LEFT                 │
│ Contest ends in 24 hours        │
│ Your rank: #14 (out of 47)      │
│ Prize pool: 0.05 SOL            │
│                                 │
│ [View Leaderboard] [View Team]  │
└─────────────────────────────────┘

(Updates every hour on Sunday)
```

**Final hour (23:00 UTC, 59 mins left):**
```
Push notification (in-app):
Title: "59 minutes left!"
Body: "You're #14. Final scores will lock soon."
CTA: [Last Chance to See Results]
```

**Why it works:**
- **Urgency:** "ONE DAY LEFT" triggers loss aversion (user might miss something)
- **Progress visibility:** "#14 out of 47" = top 30%, feels achievable
- **Scarcity:** Only 24 hours to move up → must check now
- **Momentum:** Last-minute plays (influencers tweeting) = scores still moving

**Implementation:**
```typescript
// backend/src/services/cronJobs.ts
// Add: Sun 00:00, 06:00, 12:00, 18:00, 23:00 UTC
// Trigger: emailService.sendContestCountdown(userId, hoursLeft)
// Also: Show banner in-app (check contest endTime, show countdown)
```

**Behavioral Psychology:**
- **Loss Aversion:** "Don't miss out" is stronger motivation than "win more"
- **Temporal Scarcity:** "24 hours" > "1 week" in psychological urgency
- **Social Proof:** Others are checking right now (FOMO)

---

### Trigger #5: Prize Claim + Celebrate (RE-ENTRY HOOK)
**When:** Mon after contest finalizes (immediately after lock)
**What the user sees:**

**If they won (top-3 or placed):**
```
┌─────────────────────────────────┐
│ 🎉 CONGRATULATIONS!             │
│                                 │
│ You placed #14!                 │
│ Prize: 0.001 SOL (shared pool)  │
│                                 │
│ [💰 Claim Prize] [Share Win]    │
│                                 │
│ "Share your win on Twitter"     │
│ [Share Card Appears]            │
│                                 │
│ "Ready for next week?"          │
│ [Draft New Team] [Browse Others]│
└─────────────────────────────────┘

(If top 3, show medal icon: 🥇🥈🥉)
```

**If they didn't place:**
```
┌─────────────────────────────────┐
│ ⚡ CONTEST OVER                 │
│                                 │
│ You finished #34 (out of 47)    │
│ Score: 3,847 pts                │
│                                 │
│ Better luck next week?          │
│ [See Leaderboard] [Analysis]    │
│                                 │
│ "Close call! Enter next week." │
│ [Draft New Team Now]            │
│                                 │
│ "Learn from @top_player"        │
│ [View Their Winning Team]       │
└─────────────────────────────────┘
```

**Why it works:**
- **Immediate gratification:** Claim button lets them see SOL in wallet (real reward)
- **Celebration moment:** Share card on Twitter (second viral moment after draft)
- **Learning loop:** "See winning team" feeds back into next week's draft
- **Frictionless re-entry:** "Draft New Team" is 1 click away (not buried)

**Implementation:**
```typescript
// backend/src/services/contestFinalizationService.ts
// POST /api/contest/{id}/claim-prize
// Transfers SOL to user wallet
// Creates activity feed entry: "User claimed prize"
// Shows celebration screen (React modal)
```

**Behavioral Psychology:**
- **Endowment Effect:** Having SOL in wallet (even 0.001) creates ownership
- **Social Proof:** Sharing makes them feel like winners (social status)
- **Reciprocal Altruism:** Seeing winner's team makes them want to follow
- **Momentum:** Fresh week = fresh start (not defeated)

---

### Summary: Re-engagement Trigger Matrix

| Trigger | Frequency | User Action | Psychological Driver | Conversion |
|---------|-----------|-------------|----------------------|------------|
| Score Updates | 4x/day | Check app | Variable reward | 50%+ |
| Friend Activity | Real-time | Open feed | FOMO + Social proof | 40%+ |
| Rank Change | 2x/day | View leaderboard | Status seeking | 70%+ |
| Countdown | 24h before | Final checks | Loss aversion | 60%+ |
| Prize Claim | 1x/week | Share + re-enter | Celebration + momentum | 80%+ |

---

## SECTION 4: THE VIRAL MOMENT
### The single highest-leverage sharing moment in the product

### Primary Viral Moment: Draft Celebration + Share Card

**When:** Immediately after user drafts their first team (Step 3c above)

**What happens:**

```
User taps [Confirm Team] on Draft page
  ↓
Modal slides up: "Team Created!"
  ↓
Shows: Formation visual + player names + budget breakdown
  ↓
[Share on Twitter] button is PROMINENT (gold, 56px tall)
  ↓
Twitter share sheet opens with pre-filled tweet:

TWEET CONTENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Just drafted my CT Fantasy team on @ForesightGame 🎯

Captain: @alex_tr (1.5x boost)
Team: @dune_x @wizard @newbie_ct @rising_star

Competing for 0.05 SOL 🎰 Built on @Solana

Join the leaderboard: [link]

#CT #Crypto #Fantasy #Solana
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Why this is viral:**

1. **Specificity:** Shows actual influencer handles (@alex_tr) = authentic, not marketing
2. **Social Proof:** "Competing for 0.05 SOL" shows real stakes (gamification)
3. **Formation Visual:** Mentions "Captain" role (educational, piques interest)
4. **Built on Solana:** Legitimacy signal to CT degens
5. **Call to Action:** "Join the leaderboard" links back to app
6. **Hashtags:** #CT targets home feed of followers (who are likely influencers)

**Network Effect:**
```
User A drafts team → shares on Twitter
  ↓
@alex_tr (captain picked) sees mention → visits link → sees they're ranked #1
  ↓
@alex_tr retweets: "Featured as captain in @ForesightGame!"
  ↓
@alex_tr's 100K followers see the retweet
  ↓
5-10 of them click → sign up
  ↓
EXPONENTIAL GROWTH from influencer co-sign

This is why CT domain knowledge is our moat.
```

---

### Secondary Viral Moment: Prize Claim + Victory Share

**When:** Mon after contest finalizes (if user placed top-10)

**What happens:**

```
User views prize claim modal
  ↓
If placed top-3:
  ┌─────────────────────────────────┐
  │ 🥇 YOU PLACED #2!               │
  │                                 │
  │ Prize: 0.002 SOL 🎰             │
  │ (Shared with 46 other players)  │
  │                                 │
  │ [💰 Claim Prize]                │
  │ [📱 Share Victory]              │
  └─────────────────────────────────┘

User clicks [Share Victory]
  ↓
Twitter share sheet opens with:

TWEET CONTENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Just won a prize on @ForesightGame! 🏆

Finished #2 in the CT Fantasy League
Earned 0.002 SOL by picking the right influencers 💰

My captain pick: @alex_tr (1.5x boost!)
Team score: 8,847 pts (Top 5%)

Play for free: [link] #CT #Solana
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Why this is viral:**

1. **Achievement Signal:** "#2" is concrete ranking (shows credibility)
2. **Real Reward:** "0.002 SOL" = actual money (proof of legitimacy)
3. **Skill Signal:** "Picked the right influencers" = competitive skill
4. **Influencer Reference:** Mentioning captain (@alex_tr) creates organic mentions
5. **Peer Challenge:** Implicit "I'm better than you" drives competitive signup

**Network Effect:**
```
User wins → shares on Twitter
  ↓
Friends see "just won a prize" → clicks link
  ↓
New user sees 0.002 SOL = real money, not fake points
  ↓
Signs up to compete for prizes
  ↓
Becomes repeat customer
```

---

### Tertiary Viral Moment: Friend Challenge

**When:** On leaderboard, when user sees a friend's score

**What happens:**

```
User is viewing leaderboard
Sees friend @bestie_ct ranked #10 (+150 pts higher than them)
  ↓
Clicks on friend's row → sees full team composition
  ↓
Formation visual shows: Captain @dune_x, team choices
  ↓
Sees button: [Challenge This Team] (gold)
  ↓
Modal appears:

┌─────────────────────────────────┐
│ CHALLENGE @bestie_ct            │
│                                 │
│ They beat you by 150 pts        │
│ This week                       │
│                                 │
│ Ready to prove yourself?        │
│                                 │
│ [Draft Your Competing Team]     │
│ [See Their Winning Team]        │
└─────────────────────────────────┘

User clicks [Draft]
  ↓
Auto-generates share message:

"@bestie_ct just beat me by 150 pts on
@ForesightGame 🎯

I'm drafting a new team to challenge them
next week. Who do you think I should pick?

[Link to draft page]"
```

**Why this is viral:**

1. **Named Competition:** "@bestie_ct beat me" = public acknowledgment (friendly rivalry)
2. **Leaderboard Challenge:** Creates weekly micro-competitions within friend groups
3. **Mentoring Loop:** "See their team" = learn from friends, social learning
4. **Repeat Engagement:** Drives week 2, week 3, week 4 signup (not just week 1)

---

### Viral Moment Summary

| Moment | Users Reached | Shareability | Conversion | Repeats |
|--------|---------------|--------------|------------|---------|
| **Draft Share** | 1st-degree followers | 50%+ | 8-10% signup | Weekly |
| **Victory Share** | Friends + followers | 60%+ | 12-15% signup | Weekly |
| **Challenge** | Named friend | 40%+ | 5-7% re-entry | Weekly |

---

## SECTION 5: QUESTS + FORESIGHT SCORE AS RETENTION TOOL
### How to surface progression without adding a 5th nav item

### The Problem

- **Progress page** exists (`/progress`) but is buried
- **Quests system** is implemented but invisible
- **Foresight Score (FS)** tracks everything but users don't know why they're earning it
- **No visual progression** = no sense of mastery or momentum
- **No 5th nav item allowed** = can't add dedicated "Progress" page to bottom nav

### The Solution: Distributed Progression Display

Instead of 1 page, show progress **everywhere users naturally look**:

---

#### 1. Home Page: Progression Card (New)

**Location:** Below ActivityFeedCard, above CT Feed

```
┌─────────────────────────────────┐
│ YOUR PROGRESSION THIS WEEK       │
│                                 │
│ [XP Bar: ████████░░░ 85/100]   │
│ Level 5 → Level 6 (15 XP left)  │
│                                 │
│ QUESTS COMPLETED:               │
│ ✓ Entered a contest (50 XP)    │
│ ✓ Drafted captain (25 XP)      │
│ ⏳ Climb top-10 (Not started)  │
│                                 │
│ [View All Progress] [Claim XP]  │
│                                 │
│ "Complete quests to earn        │
│  levels and status on-chain"    │
└─────────────────────────────────┘
```

**Why it works:**
- **Default location:** Home page = every session sees it
- **Progress bar:** Visual feedback (85% to next level feels achievable)
- **Quest names:** "Climb top-10" = goal-oriented
- **Claim button:** Feels like reward unlock
- **On-chain mention:** Reminds users of Tapestry integration

**Implementation:**
```typescript
// frontend/src/components/ProgressionCard.tsx (NEW)
// Fetch from: GET /api/xp/current
// Shows: currentXP, nextLevel, recentQuests, claimable rewards
// Updates every 30 seconds (poll like activity feed)
```

---

#### 2. Profile Page: Level Badge + Progression

**Location:** Header, next to username/avatar

```
┌─────────────────────────────────┐
│ [Avatar]                        │
│ @you                            │
│ Foresight Score: 4,320 pts      │
│ Level 5 ⭐⭐⭐⭐⭐ (85/100 XP) │
│                                 │
│ 47 followers | Following 12     │
│                                 │
│ "Earned via contests, quests,   │
│  and achievements"              │
└─────────────────────────────────┘

Below that:

QUEST PROGRESS (this week)
┌─────────────────────────────────┐
│ ✓ First Contest           +50 XP│
│ ✓ Pick a Captain          +25 XP│
│ ⏳ Win a Contest          +100XP│
│ ⏳ Climb Top-10          +50 XP │
│ ⏳ Refer a Friend        +200XP│
│                                 │
│ [View All Quests]              │
└─────────────────────────────────┘
```

**Why it works:**
- **Visible Status:** Level badge on profile = social status marker
- **Clear Progression:** XP bar shows how close to next level
- **Transparent Goals:** Quest list shows exact rewards
- **Aspirational:** Friends see your level (social comparison)

**Implementation:**
```typescript
// frontend/src/pages/Profile.tsx (update existing)
// Add: levelBadge, xpBar, questsList
// Fetch from: GET /api/xp/me, GET /api/quests/active
```

---

#### 3. Leaderboard: Level Badge Next to Name

**Location:** Right side of each leaderboard row

```
┌─────────────────────────────────────────────────────┐
│ Rank │ Player    │ FS Score │ XP Level │ Follow  │
├─────────────────────────────────────────────────────┤
│  1   │ @alex_tr  │ 8,950    │ Lvl 12 ⭐ │ Follow  │
│  2   │ @dune_x   │ 8,847    │ Lvl 11 ⭐ │ Unfollow│
│  ...
│ 47   │ YOU @you  │ 4,320    │ Lvl 5  ⭐ │ (Your) │
└─────────────────────────────────────────────────────┘
```

**Why it works:**
- **Status visibility:** See who's leveled up more (social comparison)
- **Aspirational:** Rank #1 is also Level 12 (implies correlation: play more → win more)
- **Competitive tension:** Want to match/exceed friend's level

**Implementation:**
```typescript
// frontend/src/pages/Compete.tsx (update existing leaderboard)
// Add xpLevel column
// Fetch from: GET /api/leaderboard/fs (add xpLevel to response)
```

---

#### 4. Draft Page: Quest Reminder

**Location:** During draft, before team confirm

```
┌─────────────────────────────────┐
│ ⚡ ACTIVE QUESTS                │
│                                 │
│ ✓ Pick a Captain       (+25 XP) │ ← Done after you pick captain
│ ⏳ Draft team         (5 mins)  │
│ ⏳ Reach Top-10      (7 days)   │
│                                 │
│ Complete quests to earn levels! │
│ [Learn More] [Continue Drafting]│
└─────────────────────────────────┘

(Appears as card above [Confirm Team] button)
```

**Why it works:**
- **Contextual reminder:** "You're about to complete 'Pick a Captain' quest"
- **Transparent rewards:** "+25 XP" makes it clear
- **No friction:** Easy to dismiss, not blocking
- **Goal alignment:** Draft quests align with actual user action

**Implementation:**
```typescript
// frontend/src/pages/Draft.tsx (add QuestReminderCard component)
// Show quests that can be completed this draft
// Auto-trigger completion when actions happen (captain picked, etc.)
```

---

#### 5. Contest Detail: Rewards Breakdown

**Location:** "Prizes" section, add "Your Rewards" subsection

```
┌─────────────────────────────────┐
│ PRIZES                          │
│ Total Prize Pool: 0.05 SOL      │
│ Players: 47                     │
│                                 │
│ YOUR POTENTIAL:                 │
│                                 │
│ ✓ Base XP (for entering)   +50  │
│ + Team in Top-10           +100 │
│ + Win Contest             +300  │
│ + Claim Prize             +25   │
│                                 │
│ "Earn XP and level up by        │
│  playing contests"              │
│                                 │
│ [View Quest Details]            │
└─────────────────────────────────┘
```

**Why it works:**
- **Transparency:** Shows what XP user will earn if they place
- **Motivation:** "Win contest = +300 XP" is incentive
- **Linear progression:** Multiple ways to earn (not all-or-nothing)
- **Educational:** New users learn quest system exists

**Implementation:**
```typescript
// frontend/src/pages/ContestDetail.tsx (add RewardBreakdown section)
// Calculate potential XP based on performance
// Show in "Prizes" section alongside SOL prizes
```

---

### Quest Types (Available Now)

**Trigger-based (Auto-complete):**
- `contest_entered` — +50 XP (triggers immediately)
- `team_created` — +25 XP (when captain selected)
- `team_shared` — +50 XP (when share button clicked)
- `user_followed` — +10 XP (per follow, max 5x/week)
- `active_challenge` — +50 XP (when user participates in friend challenge)

**Time-based (Track progress):**
- `climb_top_10` — +100 XP (if final rank ≤ 10)
- `climb_top_3` — +250 XP (if final rank ≤ 3)
- `win_contest` — +300 XP (if rank = 1)
- `daily_check_in` — +15 XP (if check app once/day for 7 days)
- `weekly_active` — +100 XP (if participate in 2+ contests/week)

**Referral-based:**
- `refer_friend_signup` — +200 XP (when referred friend signs up)
- `refer_friend_draft` — +100 XP (when referred friend drafts a team)
- `refer_5_friends` — +500 XP (milestone)

---

### XP → Level Progression

```
Level 1:    0 XP  (Tutorial complete)
Level 2:   100 XP
Level 3:   250 XP
Level 4:   450 XP
Level 5:   700 XP  (User's current level from progress.md)
Level 6:  1000 XP
Level 7:  1350 XP
Level 8:  1750 XP
Level 9:  2200 XP
Level 10: 2700 XP

Tiers:
Levels 1-3:   Bronze  ⭐
Levels 4-6:   Silver  ⭐⭐
Levels 7-9:   Gold    ⭐⭐⭐
Level 10+:    Platinum ⭐⭐⭐⭐+
```

---

### Progression UX Rules (Mobile-First)

1. **Don't add 5th nav item.** Progress is surfaced across 4 existing pages.
2. **Badge visibility:** Levels appear on leaderboard, profile, everywhere.
3. **Quest clarity:** Always show quest name, reward, and time remaining.
4. **No friction:** Quests auto-complete; no "claim quest" buttons.
5. **Celebration moment:** Level-up triggers in-app animation + toast.
6. **Transparency:** Show exact XP math (e.g., "+50 XP for entering contest").

---

## SECTION 6: WEEKLY CONTEST LIFECYCLE
### What the user sees/feels at each phase

### Phase 1: DRAFT OPENS (Mon 12:00 UTC)

**User Experience:**

```
┌─────────────────────────────────┐
│ [Push Notification]             │
│ "New contest! Draft your team"  │
│ Time left: 11:59:59            │
│ Prize pool: 0.05 SOL            │
└─────────────────────────────────┘

User opens app:
→ Home page shows banner (gold, animated)
→ Sees leaderboard with 47 players already entered
→ Sees "Draft Team" CTA (prominent, primary color)
→ Taps → enters Draft page
→ Picks captain, fills budget
→ Shares on Twitter
→ Sees live score (0 pts yet, but updates every 6h)
```

**Emotion:** Excitement + FOMO (others already drafting)
**Behavior:** Immediate action (draft, share)
**Retention:** User is committed for 7 days

---

### Phase 2: DRAFT LOCKED (Mon 12:00 UTC)

**What changed:**

```
┌─────────────────────────────────┐
│ Drafting closed                 │
│                                 │
│ 47 players entered              │
│ Prize pool: 0.05 SOL            │
│                                 │
│ LIVE SCORING STARTS NOW         │
│ Your score: 0 pts               │
│                                 │
│ Next update: 6:00 PM UTC        │
│ (30 mins away)                  │
└─────────────────────────────────┘
```

**User Experience:**

```
Mon evening:
→ Score updates: You: +42 pts, Rank: #15
→ Email: "Scores updated! You gained 42 pts."
→ Sees @alex_tr in #1 spot (+245 pts)
→ Activity feed shows @dune_x leading

Emotion: Hope (good start) or Anxiety (behind)
Behavior: Check leaderboard, see gap to #1
Retention: Curiosity about final placement
```

---

### Phase 3: SCORING LIVE (Mon → Wed)

**Days 1-3 of contest: Momentum phase**

**What user sees:**

```
Home page:
┌─────────────────────────────────┐
│ 📊 YOUR TEAM, LIVE              │
│                                 │
│ Score this round: +89 pts       │
│ Total: 356 pts                  │
│ Rank: #12 (was #15)             │
│ Time to lock: 4 days            │
│                                 │
│ [View Live Leaderboard]         │
│ [See Activity Feed]             │
│                                 │
│ "Scores update every 6 hours"   │
└─────────────────────────────────┘

Activity Feed:
@alex_tr +67 pts (now #1 with 489 pts)
@dune_x +52 pts (now #2)
YOU +89 pts (now #12)
@newbie_ct +34 pts (now #47)

Email trigger (if user hasn't checked in 12 hours):
Subject: "You're #12! Your team is winning."
```

**Emotion:** Momentum (moved up from #15 to #12)
**Behavior:** Check app 1-2x daily (score updates)
**Retention:** **This is where we fix the dead zone** — 4 score updates = 4 reasons to check

---

### Phase 4: LEADERBOARD JOCKEYING (Thu → Sun)

**Days 4-7: Competitive tension**

**What user sees:**

```
Thu morning (Day 4):
→ Banner: "Three days left! You're #14."
→ Leaderboard shows gap: "-52 pts to #13"
→ Email: "You dropped to #14. Only 3 days to climb back."

Email/push strategy:
- Shows exact rank drop (loss aversion)
- Shows gap to next rank (achievable target)
- Shows gap to top-10 (aspirational)

Thu-Sat:
→ Daily checks increase (anxious about rank)
→ Multiple friends' scores visible
→ Sees @top_player's team (follow them)
→ Follows 3-4 new players to learn strategy

Emotion: Tension (can I hold this rank?) + Urgency (time is passing)
Behavior: Daily checks, multiple friends followed
Retention: Social accountability (friends can see my final rank)
```

---

### Phase 5: FINALE (Sun 00:00 → 23:59)

**Last 24 hours: Final sprint**

**What user sees:**

```
Sun morning (24 hours left):
┌─────────────────────────────────┐
│ ⏳ ONE DAY LEFT!                │
│                                 │
│ You're #14 (tied with 3 others) │
│ To jump to #10: Need +95 pts    │
│                                 │
│ Your team's performance today:  │
│ Captain: +0 pts (waiting)       │
│ Slot 2: +12 pts                 │
│ Slot 3: +8 pts                  │
│ [View Full Breakdown]           │
│                                 │
│ Scores update every 6 hours     │
│ (Next: 6:00 PM UTC)            │
└─────────────────────────────────┘

Email (Sun 12:00 PM):
Subject: "12 hours left! You're still in contention."
[View Leaderboard] [See Your Team]

Push notification (Sun 23:00 UTC, 59 mins):
"59 minutes left! Final score incoming."

Final hour (Sun 23:00-23:59):
→ Refresh leaderboard constantly
→ Follow/comment on winning teams
→ Activity feed showing last-minute scoring
→ Tension (down to final moments)

Emotion: FOMO (missing final moments) + Loss aversion (losing rank) + Excitement (could place!)
Behavior: App open constantly, multiple refreshes
Retention: **Peak engagement moment** — user is emotionally invested
```

---

### Phase 6: FINALIZED (Mon 00:00 UTC)

**Contest ends: Moment of truth**

**What user sees:**

```
Mon 00:01 UTC:
┌─────────────────────────────────┐
│ ✓ CONTEST FINALIZED             │
│                                 │
│ YOUR FINAL RANK: #14            │
│ FINAL SCORE: 2,847 pts          │
│                                 │
│ Top 3 (Prizes):                 │
│ 🥇 #1 @alex_tr (3,245 pts)     │
│ 🥈 #2 @dune_x (3,089 pts)      │
│ 🥉 #3 @wizard (3,001 pts)      │
│                                 │
│ You: #14 / 47 (Top 30%)        │
│                                 │
│ [Claim Prize] [Share Result]    │
│ [View Winning Team] [Replay]    │
└─────────────────────────────────┘

Email (Mon morning):
Subject: "Results are in! You finished #14."
[View Leaderboard] [Claim Prize] [Try Next Week]

If user placed top-10:
┌─────────────────────────────────┐
│ 🎉 YOU PLACED #8!              │
│                                 │
│ You earned 0.001 SOL            │
│                                 │
│ [💰 Claim Prize]                │
│ [Share Victory on Twitter]      │
│                                 │
│ "Brag to your friends!"         │
└─────────────────────────────────┘
```

**Emotion:** Closure (know where they placed) + Aspiration (want to do better next week)
**Behavior:** Share result, view winning teams, follow winners
**Retention:** Clear path to next week (Friday shows next draft available)

---

### Phase 7: READY FOR NEXT WEEK (Mon 12:00 UTC)

**Immediate re-entry hook**

**What user sees:**

```
Mon 12:00 UTC:
┌─────────────────────────────────┐
│ NEW CONTEST AVAILABLE!          │
│                                 │
│ Next Week's Free League         │
│ Drafting closes: Next Mon 12:00 │
│ Prize pool: 0.05 SOL            │
│ Players so far: 1 (You can join)│
│                                 │
│ [Draft Team Now]                │
│                                 │
│ Want to beat @alex_tr next week?│
│ View their winning team: [Link] │
│                                 │
│ "Learn from the best."          │
└─────────────────────────────────┘

Email (Mon morning, same as results):
Subject: "Results + New contest available!"
[View Last Week's Leaderboard] [Join New Contest]

Push notification (Mon 12:01):
"New contest! Draft your team and beat last week's winners."
```

**Emotion:** Fresh momentum (clean slate) + Competitive motivation (beat winners)
**Behavior:** Immediate re-draft (while emotional)
**Retention:** **Frictionless re-entry** = week 2 signup

---

### Lifecycle Engagement Metrics

| Phase | Duration | Check-ins | Emotional State | Churn Risk |
|-------|----------|-----------|-----------------|------------|
| Draft | 12 hours | 1 (enter) | Excitement | LOW |
| Locked | 24 hours | 2-3 | Hope/Anxiety | LOW |
| Scoring | 72 hours | 5-7 | Momentum | MEDIUM |
| Jockeying | 96 hours | 3-4 | Tension | MEDIUM |
| Finale | 24 hours | 8-10 | FOMO/Urgency | LOW |
| Finalized | 24 hours | 2 | Closure/Aspiration | HIGH |
| Re-entry | Ongoing | 1+ | Fresh start | HIGH |

---

## SECTION 7: THE "OH SHIT" MOMENT
### What's the one thing that makes a user immediately text a friend?

### Scenario 1: Formation Visual Surprise

**When:** User first drafts a team and sees the formation visual

```
User is on Draft page, picking players
→ Sees formation visual for first time
→ "Wait, this looks really polished"
→ Picks captain, formation updates in real-time
→ Sees tier badges (S-tier captain, A-tier slots)
→ Thinks: "This is actually... beautiful?"

TEXT TO FRIEND:
"Yo, this CT fantasy game is actually insane.
The UI is fire 🔥
Check it out: [link]"
```

**Why it works:**
- **Unexpected polish:** Most crypto apps are ugly. This one isn't.
- **Formation visual is unique:** No competitor has this (DraftKings is table-based)
- **Aha moment:** "This looks like a real app, not a hackathon project"

---

### Scenario 2: Captain Multiplier Realization

**When:** User sees captain boost in live scoring

```
Contest is live (Mon 18:00 UTC)

Score update:
User's captain @alex_tr tweets
→ Score updates: YOUR CAPTAIN +117 pts (base 78)
→ Visual shows: 1.5x multiplier in gold
→ User's total jumps from #47 to #15 in one update
→ User sees: "Wait, one tweet just moved me up 32 spots???"

TEXT TO FRIEND:
"Bro, I picked @alex_tr as captain and he just
tweeted once = +117 pts = I jumped 32 spots
This game is 🔥🔥🔥
[link]"
```

**Why it works:**
- **Leverage moment:** 1.5x multiplier is VISIBLE in score
- **Immediate result:** Score updates in real-time (no waiting)
- **Status shift:** Moving from #47 to #15 is significant (top 30%)
- **Influencer dependency:** Makes users realize "I need to pick the right captains"

---

### Scenario 3: Friend Leaderboard Shock

**When:** User realizes they can beat their IRL friend

```
User views leaderboard
→ Sees friend's name in #8 spot
→ User is in #14 spot
→ Gap: Only 47 pts
→ User thinks: "I can beat Sarah next week"
→ Scrolls down, sees 3 other IRL friends entered

TEXT TO FRIEND:
"SARAH I'M COMING FOR YOU
I'm #14, you're #8, I'm beating you next week lol
[link]"
```

**Why it works:**
- **Local competition:** IRL friends are better competitors than strangers
- **Achievable goal:** "-47 pts to beat you" is concrete (not "-500 pts to beat randoms")
- **Friendly rivalry:** Creates recurring weekly challenge (not one-time)
- **Network effect:** One friend brings 3 more friends

---

### Scenario 4: Prize Realization

**When:** User realizes they can win actual SOL

```
User sees prize pool: "0.05 SOL shared across 47 players"
User calculates: "0.05 ÷ 47 = ~0.001 SOL per person (if top-10)"
User opens their wallet: "That's $0.50... for just picking influencers?"

TEXT TO FRIEND:
"You can actually WIN money playing this
Like real SOL, not fake points
I'm in. [link]"
```

**Why it works:**
- **Real incentive:** $0.50 → $5 is real money (not game currency)
- **Free entry:** "0 SOL entry = no risk"
- **Social proof:** "47 players already playing"

---

### Scenario 5: Influencer Co-Sign

**When:** User shares their drafted team, influencer (captain) sees it and retweets

```
User drafts team with @alex_tr as captain
User shares on Twitter: "Drafted @alex_tr as captain in CT fantasy!"
@alex_tr (100K followers) sees mention
@alex_tr retweets: "Featured as captain in @ForesightGame! Love this"

User sees retweet, @alex_tr's followers click
User's friend sees: "@alex_tr is promoting this app"

TEXT TO FRIEND:
"Bro @alex_tr just retweeted my draft
This app is actually legit
[link]"
```

**Why it works:**
- **Influencer validation:** If @alex_tr likes it, it must be real
- **Social proof:** Retweet = 100K people see this
- **Status elevation:** User's draft was "featured" by an influencer

---

### Scenario 6: Live Score Update During News

**When:** An influencer does something IRL, score jumps in real-time

```
Contest is live
@dune_x (user's slot-2 pick) announces new project on Twitter
→ Engagement spike
→ Algorithm triggers score update (expected: +45 pts)
→ User gets notification: "LIVE UPDATE: @dune_x +67 pts!"
→ User's rank jumps from #20 to #13
→ This all happens in 30 seconds

TEXT TO FRIEND:
"Yo I picked @dune_x and he just announced something
My score just went UP by 67 pts IN 30 SECONDS
This is insane [link]"
```

**Why it works:**
- **Real-time reaction:** Not waiting days, it's NOW
- **Causality:** User can see "tweet → score jump" connection
- **Leverage:** One tweet = rank improvement
- **Gamification:** Feels like sports betting (live odds, live action)

---

## SECTION 8: IMPLEMENTING THE STRATEGY
### Engineering checklist + timeline

### Already Implemented (No work needed)

- Follow/Unfollow system (Tapestry backend complete)
- Activity feed (30s polling ready)
- Contest lifecycle (cronJobs.ts handles finalization)
- Quests & XP system (questService.ts, foresightScoreService.ts)
- Share cards (ShareTeamCard.tsx, ShareableProfileCard.tsx)
- Score updates (4x/daily cron at :00, :30 marks)
- Email infrastructure (basic; needs templates)

### Quick Wins (1-4 hours each)

**1. Home Page: Progression Card**
- File: `frontend/src/components/ProgressionCard.tsx` (NEW)
- Shows XP bar, recent quests, claim button
- Polls `/api/xp/current` every 30s
- Estimate: 2 hours

**2. Leaderboard: Level Badges**
- File: `frontend/src/pages/Compete.tsx` (update)
- Add `xpLevel` column to leaderboard
- Backend: Add xpLevel to `/api/leaderboard/fs` response
- Estimate: 1.5 hours

**3. Profile: Level + Quest List**
- File: `frontend/src/pages/Profile.tsx` (update)
- Show level badge, XP bar, active quests
- Estimate: 2 hours

**4. Draft Page: Quest Reminder**
- File: `frontend/src/pages/Draft.tsx` (update)
- Show active quests above [Confirm Team] button
- Estimate: 1.5 hours

**5. Email Templates (Score Updates)**
- File: `backend/src/services/emailService.ts` (create)
- Templates: ScoreUpdate, Countdown, FinalResults
- Estimate: 2 hours

### Medium Complexity (5-8 hours)

**6. Contest Lifecycle Notifications**
- Add push notifications (if PWA) or in-app banners
- Timeline: Draft opens, Locked, Countdown (24h, 12h, 1h), Finalized
- Estimate: 4 hours

**7. Share Card Improvements**
- Add "Challenge Friend" feature
- Show friend's winning team
- Estimate: 3 hours

**8. Referral System Visibility**
- Move from `/referrals` to home-page widget
- Show referral count, rewards available
- Estimate: 2 hours

### Testing & Verification (4-6 hours)

- Test each re-engagement trigger (score update, feed refresh, countdown)
- Mobile responsive check (375px width)
- Email delivery + formatting
- Screenshot comparison (before/after)

---

## SECTION 9: METRICS TO TRACK
### How to measure if the strategy is working

### Primary Retention Metrics

| Metric | Current Baseline | Target (4 weeks) | Target (8 weeks) |
|--------|------------------|------------------|------------------|
| **D1 Retention** | ? | 50%+ | 65%+ |
| **D7 Retention** | ? | 25%+ | 40%+ |
| **D30 Retention** | ? | 10%+ | 20%+ |
| **Avg Session Length** | ? | 8 mins | 12 mins |
| **Checks/Week** | ? | 12+ | 18+ |

### Engagement Metrics

| Metric | Current | Target (4w) | Target (8w) |
|--------|---------|------------|------------|
| **% Entering Week 2** | ? | 35%+ | 50%+ |
| **% Share Team** | 30%+ | 45%+ | 60%+ |
| **Follow Conversion** | 60%+ | 70%+ | 80%+ |
| **Avg Follows/User** | ? | 3+ | 5+ |
| **XP Earned/User** | ? | 150+ | 350+ |

### Growth Metrics

| Metric | Current | Target (4w) | Target (8w) |
|--------|---------|------------|------------|
| **Signup → Draft (%)** | 70%+ | 85%+ | 90%+ |
| **Referral Signup** | 0 | 5-10/week | 20+/week |
| **Viral Coefficient (k)** | <1 | 1.2+ | 1.5+ |
| **Time to Value (mins)** | 5-10 | <3 | <2 |

### Churn Signals (Watch for regression)

| Signal | Action |
|--------|--------|
| D1 Retention drops below 40% | Auth friction; check Privy flow |
| D7 Retention < 20% | Dead zone problem; increase score update frequency |
| 0% referral signups | Share card not working; check Twitter integration |
| 50%+ users never view leaderboard | Onboarding UX issue; check draft → confirm flow |
| <30% follow conversion | Follow button copy/placement issue; test A/B |

---

## SECTION 10: FINAL RECOMMENDATIONS
### What to implement first, and why

### Phase 1: MUST BUILD (4-6 hours) — Before Hackathon Demo

1. **Email Templates** (Score updates, Countdown, Results)
2. **Home Page: Progression Card** (Shows XP + quests)
3. **Leaderboard: Level Badges** (Social status visibility)
4. **Draft Page: Contest Countdown** (Urgency in final 24h)

**Why first:** These create the re-engagement loop (score updates pull user back). Without these, you lose 80% of users at the 5-day dead zone mark.

### Phase 2: SHOULD BUILD (6-10 hours) — Week 2-3 Post-Hackathon

1. **Profile: Quest List + XP Breakdown** (Progression clarity)
2. **Referral Widget on Home** (Visibility for viral growth)
3. **Challenge Friend Feature** (Local competition)
4. **Push Notifications (PWA)** (If converting to native PWA)

**Why second:** These improve stickiness for returning users. Won't affect week-1 retention but massive for week 2+.

### Phase 3: NICE-TO-HAVE (Post-Hackathon, if time)

1. **Advanced Leaderboard Analytics** (Chart user's rank over time)
2. **Influencer Market** (Buy/sell influencers, not just draft)
3. **Achievement Badges** (cosmetic, but fun)
4. **Season Pass** (Premium progression)

**Why last:** These add polish but don't drive core retention. Save for season 2.

---

## SECTION 11: SUCCESS STORIES (ANALOGIES)
### How this works in other apps

### Duolingo: Habit Loop Analog

| Foresight | Duolingo |
|-----------|----------|
| Draft team (weekly) | Daily lesson (daily) |
| Score updates 4x/day | Streak counter updates hourly |
| Leaderboard rank | Friend comparison (who has streak) |
| Week-end countdown | Daily reminder ("Don't lose your streak") |
| Celebrate win | "You're on a 47-day streak!" |
| Follow player | Follow friend on leaderboard |

**Key insight:** Duolingo's streak system creates DAILY habits. We can't do daily contests (unrealistic), but **4 score updates = 4 mini-rewards = same dopamine effect**.

### DraftKings: Re-engagement Analog

| Foresight | DraftKings |
|-----------|------------|
| Weekly contest | Daily contests (5-10 available) |
| Follow top player | Follow expert predictions |
| Share team | Share lineup to friends |
| Activity feed | Leaderboard updates (live) |
| Email on lock | Email on contest start |
| Celebrate prize | Instant payout notification |

**Key insight:** DraftKings' power is daily contests = daily excuses to come back. We're weekly, so we **need stronger social mechanics (follow, friends tab) and more frequent score updates (4x/day vs. 1x/day)**.

### Robinhood: Momentum Analog

| Foresight | Robinhood |
|-----------|-----------|
| Captain 1.5x boost | Fractional shares (compound leverage) |
| Real SOL prizes | Real money gains (however small) |
| Score ticker | Stock ticker (live prices) |
| Leaderboard | Portfolio chart (wealth comparison) |
| Celebrate win | "You're up $42 today!" |
| Share team | Share portfolio gains |

**Key insight:** Robinhood's genius is **making small gains feel big** (fractional shares + live feedback). We do this via **captain multiplier + live score updates + rank changes**.

---

## CLOSING: THE NARRATIVE FOR JUDGES

When demoing Foresight to hackathon judges, tell this story:

**The Problem:**
"Fantasy sports apps like DraftKings have daily contests to create daily habits. But we're building for Crypto Twitter — weekly contests make sense (influencers' engagement is a weekly signal, not daily noise). The problem: weekly contests create 5-day dead zones where users forget to come back. Churn explodes."

**The Solution:**
"We solve this with three layers:

1. **Real-time feedback (4x/day)** — Score updates interrupt the dead zone. Users get 4 reasons to check, not 0.

2. **Social leverage (follow + friends tab)** — Watching friends win is stronger motivation than watching strangers. 2-3x engagement boost (DraftKings data).

3. **Formation visual** — Our team-building UX is unique. No other fantasy sports app has this. It's sticky + shareable.

Result: Instead of '90% churn at day 5', we expect 60-70% D7 retention (vs. DraftKings' 40-50% for weekly players)."

**The Demo Flow:**
1. Show formation visual (aha moment)
2. Share team on Twitter (viral moment)
3. Show live score updating (momentum moment)
4. Show friends' leaderboard (competition moment)
5. Show level + XP (progression moment)
6. Claim prize (reward moment)

**Total time:** 90 seconds. Same narrative as UX spec.

---

---

## APPENDIX: QUICK REFERENCE

### Re-engagement Trigger Checklist

- [ ] Email: Score updates (4x/day templates)
- [ ] Email: Leaderboard change (rank up/down)
- [ ] Email: Countdown (24h, 12h, 1h before lock)
- [ ] Email: Prize claim + results
- [ ] In-app: Activity feed (30s refresh)
- [ ] In-app: Progression card (home page)
- [ ] In-app: Contest countdown (final 24h banner)
- [ ] In-app: Level badges (leaderboard)
- [ ] In-app: Follow buttons (leaderboard rows)
- [ ] Mobile: Share card (pre-fill Twitter)

### Files to Create/Update

| File | Status | Estimate |
|------|--------|----------|
| `frontend/src/components/ProgressionCard.tsx` | NEW | 2h |
| `frontend/src/pages/Compete.tsx` | UPDATE | 1.5h |
| `frontend/src/pages/Profile.tsx` | UPDATE | 2h |
| `frontend/src/pages/Draft.tsx` | UPDATE | 1.5h |
| `frontend/src/components/ShareTeamCard.tsx` | UPDATE | 1h |
| `backend/src/services/emailService.ts` | CREATE | 2h |
| `backend/src/api/notifications.ts` | UPDATE | 2h |

### Deploy Checklist (Before Hackathon Submission)

- [ ] All 5 re-engagement triggers active
- [ ] Email templates styled + tested
- [ ] Push notifications working (if PWA)
- [ ] Mobile-responsive (375px width)
- [ ] Demo script practiced (90 seconds)
- [ ] GitHub README updated
- [ ] Video walkthrough recorded

---

**End of Strategy Document**
