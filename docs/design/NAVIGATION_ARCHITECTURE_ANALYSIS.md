# Foresight Navigation Architecture Analysis

> **Status:** Information Architecture Recommendations Ready
> **Date:** February 25, 2026
> **Analyst:** Senior Product Designer (UX Architecture Specialist)

## Executive Summary

Foresight's current navigation has **clarity problems**, not capacity problems. The 4-nav-item constraint is perfect, but the way pages are organized and labeled creates friction in critical user flows.

**Key Findings:**
- "Play" is the wrong label (vague, doesn't convey action)
- Contest entry is unnecessarily indirect (3+ clicks vs. 1-2 clicks on competitors like DraftKings)
- Progress/Quests is completely hidden (0 nav prominence, no user discovery)
- The `/draft` page is only reachable from `/contest/:id`, breaking mental models
- Draft/Contest flows have backward navigation issues

**Recommendation:** Rename one nav item and reorganize page hierarchy to create direct, intuitive paths without adding nav slots.

---

## Part 1: Current State Analysis

### Current Navigation Structure

```
┌─────────────────────────────────────────────────┐
│ FORESIGHT HEADER (Logo + Desktop Nav)            │
│ Home | Play | Feed | Profile | [Wallet Menu]    │
└─────────────────────────────────────────────────┘
           ↓              ↓           ↓         ↓
        HOME           PLAY         FEED     PROFILE
       /               /play        /feed     /profile
                         │                        │
         ┌───────────────┴───────────────┐       ├─ /settings
         │                               │       ├─ /referrals
      Rankings           Contests        │       └─ /progress (hidden!)
      Tab 1              Tab 2           │
         │                   │           │
    ├─ FS (3 filters)    ├─ All Contests│
    ├─ Fantasy           ├─ Free        │
    └─ XP                └─ Weekly      │
                              │
                              └─ /contest/:id (detail page)
                                   │
                                   └─ /draft (team builder)
```

### Pages & Their Access Points

| Page | Path | Primary Access | Secondary Access | Hidden? |
|------|------|---|---|---|
| Home | `/` | Nav item | Logo | ✅ |
| Play (Leaderboards) | `/play?tab=rankings` | Nav item (default) | Direct URL | ✅ |
| Contests | `/play?tab=contests` | Play nav → Contests tab | Direct URL | ⚠️ (buried in tab) |
| Contest Detail | `/contest/:id` | Play → Contests → click row | Direct URL | ✅ |
| Draft | `/draft?contestId=X` | Contest Detail → "Draft" button | Direct URL | ❌ **UNREACHABLE** from nav |
| Feed | `/feed` | Nav item | Logo | ✅ |
| Profile | `/profile` | Nav item | User menu? | ✅ |
| Settings | `/settings` | Profile page link | Direct URL | ⚠️ |
| Referrals | `/referrals` | Profile page link | Direct URL | ⚠️ |
| Progress (Quests) | `/progress` | ??? | Profile page link? | ❌ **INVISIBLE** |

### Problems with Current IA

#### 1. "Play" is Vague (Information Architecture Problem)
- **Issue:** Users see "Play" and think "draft a team" OR "view leaderboards" — two completely different actions
- **Evidence:** Mobile UI shows Trophy icon (implies rankings/competition) but label is action-based (Play = start game)
- **Impact:** Cognitive friction, unclear what will happen on click
- **Competitive Context:**
  - DraftKings: "My Contests" (singular, action-focused)
  - FanDuel: "Contests" (clear, specific)
  - Sleeper: "Leagues" (clear context)

#### 2. Contests Are Secondary (Information Architecture Problem)
- **Issue:** Default tab is Rankings; Contests is secondary tab
- **Evidence:** New users land on `/play?tab=rankings` by default, see leaderboards, miss contest entry
- **Impact:** Contest discovery friction, reduced conversion
- **Competitive Context:** DraftKings defaults to "My Contests" or "Browse Contests" as primary action
- **Severity:** HIGH — Contests are the primary monetization funnel

#### 3. Direct Draft Access is Missing
- **Issue:** `/draft` is only reachable from `/contest/:id`
- **Evidence:** No nav path, no shortcut, no direct URL disclosure
- **Impact:** Power users can't quickly iterate on drafts; demo flow is slower
- **Competitive Context:** Sorare has "Auctions" → "Create Lineup" as direct nav path

#### 4. Progress/Quests is Completely Hidden
- **Issue:** `/progress` (quests, achievements, FS tracking) has zero nav prominence
- **Evidence:** Only accessible via Profile → "View Progress" link (if user thinks to look there)
- **Impact:** Users don't know quests exist; no achievement discovery; FS score hiding
- **Severity:** MEDIUM — Kills engagement loop and progress visualization

#### 5. Contests Tab Location Creates Task Switching
- **Issue:** To enter a contest, user flow is: Play → **switch to Contests tab** → click contest → switch to /contest/:id → click "Draft"
- **Evidence:** 3 location changes + tab switching on desktop
- **Impact:** Slower demo flow, higher bounce before entry
- **Competitive Context:** DraftKings keeps "Browse" and "My Contests" in sidebar (always visible)

#### 6. Navigation Labels Don't Match Content
- **Issue:**
  - "Play" (action) vs. content is "Rankings" (state) + "Contests" (discovery)
  - "Feed" has no hover text, users unsure if it's leaderboard feed or news feed
  - Profile nav item reaches `/profile` (my stats) but also Settings, Referrals, Progress
- **Evidence:** No consistent mental model for what "nav items" contain
- **Impact:** Users explore differently on second visit

---

## Part 2: Competitive Analysis

### DraftKings (Desktop)
```
Top Nav:    Logo | My Contests | Browse | Account
Sidebar:    [None - contests in top nav]
Mobile:     Home | My Contests | Browse | Account
```
**Key:** Contests are the FIRST nav item, always prominent

### FanDuel
```
Top Nav:    Logo | Contests | Leaderboards | Account
Mobile:     Contests | Leaderboards | Account
```
**Key:** "Contests" (specific) before "Leaderboards" (ranked view)

### Sleeper (Fantasy)
```
Nav:        Home | Leagues | My Leagues | Settings | Account
```
**Key:** "Leagues" is distinct from personal leaderboards

### Sorare (NFT Fantasy)
```
Nav:        Home | Collections | Auctions | Activity | Profile
Auction:    Auctions → Create Lineup → [direct draft builder]
```
**Key:** Draft builder is directly nested under Auctions, not hidden in team detail

---

## Part 3: Proposed Navigation Architecture

### Option A: Rename "Play" → "Compete" (RECOMMENDED)

This is a **minimal change with high impact**. Rename one nav item, reorganize tab defaults, and create direct draft access.

#### New Navigation (4 items, unchanged structure)

```
┌───────────────────────────────────────────────────────┐
│ FORESIGHT HEADER                                      │
│ Home | Compete | Feed | Profile | [Wallet Menu]      │
└───────────────────────────────────────────────────────┘
           ↓           ↓          ↓         ↓
        HOME       COMPETE      FEED    PROFILE
        /          /compete    /feed    /profile
                       │
        ┌──────────────┴──────────────┐
        │                             │
    CONTESTS          LEADERBOARDS   DRAFT (NEW)
    (default)         (secondary)    (new route)
    /compete?         /compete?      /draft?
    tab=contests      tab=leaderboards
        │
    Contest List
    (join, view)
        │
    /contest/:id
    (detail + draft button)
```

#### New Routes (NO changes to existing pages, just re-organization)

| Route | Access Path | Label | Purpose |
|-------|---|---|---|
| `/compete` | Nav item (default) | Compete | Contest discovery (was `/play?tab=contests`) |
| `/compete?tab=leaderboards` | Compete → "Leaderboards" tab | Leaderboards | Rankings view (was `/play?tab=rankings`) |
| `/draft` | Direct URL or Compete → Contest → "Draft" | Draft Builder | Direct team building |
| `/progress` | Profile → "Progress" link, OR new "Quests" nav item (see Option B) | Progress | Quests, FS tracking |

#### Implementation Details

1. **Rename Navigation Item**
   - Change `/play` → `/compete`
   - Change label from "Play" → "Compete"
   - Update `Layout.tsx` nav items

2. **Swap Default Tab**
   - Change `Compete.tsx` default `mainTab` from `'rankings'` → `'contests'`
   - Contests now shows first when users click Compete

3. **Make Draft Reachable**
   - Current: `/draft` only called from Contest Detail with `?contestId=X`
   - New: Add `?contestId=X` to URL when entering draft from contest detail
   - Allow direct `/draft?contestId=X` for power users + demo scripts
   - Add "Quick Draft" shortcut on Home page (for returning users)

4. **Route Redirects**
   - `/play` → `/compete` (redirect existing bookmarks)
   - `/play?tab=contests` → `/compete` (redirect old URLs)
   - Keep `/play` redirect to maintain backward compat

#### Visual Changes (Minimal)

- Change Trophy icon label from "Play" → "Compete"
- Update `matchPaths` in Layout to recognize `/draft` and `/contest/:id` as "Compete" children
- No other UI changes required

#### Why "Compete" is Better Than "Play"

| Aspect | Play | Compete |
|--------|------|---------|
| **Clarity** | Could mean "join game" or "watch rankings" | Unambiguous: show me competitions |
| **Action** | Vague verb | Specific context (vs. "spectate") |
| **Confidence** | User unsure what will load | User confident they'll see contests |
| **Tone** | Casual, might feel game-y | Professional, stakes-aware |
| **Competitive Fit** | Generic | Aligns with PvP/rivalry focus |

---

### Option B: Add 5th Nav Item "Quests" (ALTERNATIVE)

If user wants maximum visibility for progress/achievements:

```
┌──────────────────────────────────────────────────────┐
│ Home | Compete | Quests | Feed | Profile | [Wallet]  │
└──────────────────────────────────────────────────────┘
```

**Pros:**
- Quests fully visible (not hidden in Profile)
- Emphasizes achievement/progression loop
- Matches gaming platforms (Twitch, Discord, gaming apps)

**Cons:**
- Breaks "4 items sacred rule" (mobile thumb reach)
- Quests are secondary to contest entry (shouldn't be primary nav)
- Text label too long on mobile ("Quests" + "Profile" = crowded)
- Requires icon choice (Star? Lightning? Sparkle?) — increases visual noise

**Recommendation:** NOT recommended unless user wants to sacrifice contest visibility or mobile UX. Option A is better.

---

## Part 4: Complete Page Inventory (After Re-architecture)

### Tier 1: Primary Navigation Pages (Always visible via bottom nav on mobile, top nav on desktop)

#### 1. HOME `/`
- **Purpose:** Landing page + dashboard for logged-in users
- **Who:** All users (new + returning)
- **Content:**
  - Hero section (before login)
  - After login: Activity feed card, current team summary, upcoming contests countdown
- **Navigation Out:**
  - CTA: "Browse Contests" → `/compete`
  - CTA: "View My Team" → `/draft?contestId=X` or `/profile`
  - Quick links: Activity feed items → `/contest/:id`
- **Entry Points:** Logo click, nav item, deep link
- **Primary Action:** See what's happening, join first contest

#### 2. COMPETE `/compete`
- **Purpose:** Unified hub for contest discovery and competition tracking
- **Who:** All authenticated users (logged-in only)
- **Content (Tabs):**
  - **Contests Tab** (default) — Browse/join contests
    - Filter: All | Free | Weekly | Daily
    - Shows: Contest name, entry fee, prize pool, player count, time remaining
    - Action: Click to view `/contest/:id`
  - **Leaderboards Tab** — Skill rankings across contests
    - Sub-tabs: Foresight Score | Fantasy League | XP
    - Time filters: All-time | Season | Weekly | Friends
    - Shows: User rank, score, username, tier badge, follow button
    - Action: Click user → `/profile?userId=X`
- **Navigation Out:**
  - Contest row → `/contest/:id`
  - User row → `/profile?userId=X`
  - "Draft" button → `/draft?contestId=X`
  - "View my teams" → profile link
- **Entry Points:** Nav item (primary), direct URL, Home CTA
- **Primary Action:** Find a contest to join

#### 3. FEED `/feed`
- **Purpose:** Real-time CT engagement feed (show what influencers are doing)
- **Who:** All users
- **Content:**
  - Highlights section (top viral tweets)
  - Main feed (recent tweets from top 100 CT influencers)
  - Each tweet shows: author, content, engagement metrics, timestamp
- **Navigation Out:**
  - Author name/avatar → external Twitter profile
  - Retweet/like → external action
  - (No internal nav — feed is informational)
- **Entry Points:** Nav item, Home link
- **Primary Action:** Stay informed on CT activity

#### 4. PROFILE `/profile`
- **Purpose:** Personal stats, achievements, wallet management
- **Who:** Logged-in users only
- **Content:**
  - User header: Name, avatar, wallet address, tier badge
  - Stats section: Foresight Score, XP, total teams, win rate
  - Social section: Followers, following, recent activity
  - Sections:
    - "My Contests" (active + past)
    - "My Teams" (list of all drafted teams, click to view scores)
    - "Achievements" (badges earned, quests completed)
  - Settings link (gear icon, top right)
  - Referral code (card at bottom)
- **Navigation Out:**
  - Team row → `/contest/:id` (view scores)
  - "Draft new team" → `/compete?tab=contests`
  - Settings link → `/settings`
  - Referral card → `/referrals`
  - Progress/Quests link → `/progress`
  - Follow users in "Followers" list → add to watched list
- **Entry Points:** Nav item, wallet dropdown
- **Primary Action:** See my stats and teams

---

### Tier 2: Secondary Pages (Accessible via Tier 1 pages, not in main nav)

#### 5. CONTEST DETAIL `/contest/:id`
- **Purpose:** Join a specific contest, view rules, leaderboard, prize breakdown
- **Who:** All users
- **Content:**
  - Contest header: Name, prize pool, player count, time remaining, lock time
  - Leaderboard: Live standings (top 10), with my position highlighted
  - Rules section: Team size, scoring rules, tier explanations
  - Prize breakdown: Payouts table
  - Action button: "Draft Team" or "View My Team" (if already entered)
- **Navigation Out:**
  - "Draft Team" → `/draft?contestId=X` (entry point to draft)
  - "View My Team" → shows formation card inline or modal
  - Leaderboard row (click user) → `/profile?userId=X`
  - Back arrow → `/compete`
- **Entry Points:** Compete → Contests tab → click row, direct URL, Home feed
- **Primary Action:** Enter the contest

#### 6. DRAFT `/draft?contestId=X`
- **Purpose:** Build 5-player team with salary cap + position constraints
- **Who:** Logged-in users
- **Required params:** `contestId` (which contest to enter)
- **Content:**
  - Formation visual (left side): 1 Captain (1.5x) + 4 tier slots (S/A/B/C)
  - Influencer list (right side): Searchable, filterable by tier, shows salary + projected points
  - Budget tracker: X / 150 remaining
  - Team summary: Current roster with scores
  - Action: "Submit Team" button (saves entry)
- **Navigation Out:**
  - "Back" → `/contest/:id` (back to detail)
  - "View Contest" → `/contest/:id` (from success screen)
  - "Draft Another" → `/draft?contestId=Y` (success screen)
  - "View Leaderboard" → `/compete?tab=leaderboards` (success screen)
- **Entry Points:** Contest Detail "Draft Team" button, direct URL, Home quick draft shortcut
- **Primary Action:** Submit a team

#### 7. PROGRESS `/progress`
- **Purpose:** Track quest progress, earn FS points, view achievements
- **Who:** Logged-in users
- **Content:**
  - Quests section: Active quests (enter contest, earn XP, etc.) with progress bars
  - Achievements section: Badges, milestones, completion status
  - FS earning breakdown: How you're earning points (activity, bonuses, etc.)
  - Rewards history: Items earned recently
- **Navigation Out:**
  - "Enter Contest" quest → `/compete?tab=contests`
  - "Draft Team" quest → `/draft?contestId=X` (recommended contest)
  - Back arrow → `/profile` (accessed from profile)
- **Entry Points:** Profile → "Progress" link, (Optional: Quests nav item if Option B chosen)
- **Primary Action:** See what actions earn rewards

---

### Tier 3: Account Management Pages (Accessible via Profile dropdown/settings)

#### 8. SETTINGS `/settings`
- **Purpose:** Account management, notifications, theme
- **Who:** Logged-in users
- **Content:**
  - Account section: Email, wallet, display name
  - Preferences: Notifications on/off, theme (light/dark)
  - Security: Two-factor auth, active sessions
  - Danger zone: Disconnect wallet, delete account
- **Navigation Out:** Back → `/profile`
- **Entry Points:** Profile gear icon or dropdown menu

#### 9. REFERRALS `/referrals`
- **Purpose:** Share referral code, track signups, earn bonuses
- **Who:** Logged-in users
- **Content:**
  - Referral code (copy button)
  - Stats: People referred, bonus earned
  - How it works: Info card
  - Share buttons: Twitter, email, copy link
- **Navigation Out:** Back → `/profile`
- **Entry Points:** Profile referral card, wallet dropdown

#### 10. LEGAL PAGES
- `/terms`, `/privacy`, `/cookies`, `/imprint`
- **Purpose:** Legal compliance
- **Access:** Footer links (not nav)

---

## Part 5: Page Hierarchy Diagram (NEW ARCHITECTURE)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FORESIGHT APP (Option A)                    │
│                                                                     │
│ PRIMARY NAVIGATION (4 items - Bottom nav on mobile, top on desktop) │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  HOME (/)                  COMPETE (/compete)      FEED (/feed)    │
│  ├─ Landing section        ├─ Contests Tab        ├─ Highlights    │
│  ├─ Activity feed            │  ├─ All            │  (viral tweets)│
│  ├─ Quick stats             │  ├─ Free            ├─ Main feed     │
│  └─ CTAs to Compete         │  ├─ Weekly          │  (50 tweets)   │
│                             │  └─ Daily           └─ (read-only)   │
│                             ├─ Leaderboards Tab                    │
│                             │  ├─ Foresight Score                  │
│                             │  ├─ Fantasy League                    │
│                             │  └─ XP                                │
│                             └─ (Timeframe filters)                  │
│                                                                     │
│  PROFILE (/profile)                                                │
│  ├─ My stats (FS, XP, rank)                                        │
│  ├─ My teams list                                                  │
│  ├─ Followers/following (with Follow button)                       │
│  ├─ Achievements                                                   │
│  └─ Links to:                                                      │
│      ├─ Settings (/settings)                                       │
│      ├─ Referrals (/referrals)                                     │
│      ├─ Progress (/progress)                                       │
│      └─ Disconnect wallet                                          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                    SECONDARY PAGES (Nested)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  CONTEST DETAIL (/contest/:id)                                    │
│  ├─ Accessed from: Compete → Contests tab → click row             │
│  ├─ Shows: Rules, prize pool, live leaderboard                    │
│  └─ CTA: "Draft Team" → /draft?contestId=X                        │
│                                                                     │
│  DRAFT (/draft?contestId=X)                                       │
│  ├─ Accessed from: ContestDetail → "Draft Team"                   │
│  ├─ Shows: Formation visual + influencer picker                   │
│  ├─ CTA: "Submit Team" (saves entry)                              │
│  └─ On success: Celebration screen with options to               │
│      ├─ Draft another (/draft?contestId=Y)                        │
│      ├─ View leaderboard (/compete?tab=leaderboards)              │
│      └─ Go home (/)                                               │
│                                                                     │
│  PROGRESS (/progress)                                             │
│  ├─ Accessed from: Profile → "View Progress"                      │
│  ├─ Shows: Active quests, achievements, FS tracker                │
│  └─ CTAs: Links back to actions (enter contest, draft team)       │
│                                                                     │
│  SETTINGS (/settings)                                             │
│  ├─ Accessed from: Profile gear icon                              │
│  ├─ Shows: Account, preferences, security                         │
│  └─ Danger: Disconnect wallet                                    │
│                                                                     │
│  REFERRALS (/referrals)                                           │
│  ├─ Accessed from: Profile referral card                          │
│  ├─ Shows: Referral code, stats, share buttons                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Part 6: Contest Entry Funnel (BEFORE vs AFTER)

### BEFORE (Current State)

```
User clicks "Play" nav
  ↓
Lands on /play?tab=rankings (LEADERBOARDS - default)
  ↓
Sees rankings, confused ("where are contests?")
  ↓
Clicks "Contests" tab
  ↓
Sees contest list
  ↓
Clicks contest row
  ↓
Lands on /contest/:id
  ↓
Reads rules
  ↓
Clicks "Draft Team" button
  ↓
Lands on /draft?contestId=X
  ↓
Builds team
  ↓
Clicks "Submit"

Duration: ~3 minutes (for a demo)
Friction points: 2 tab switches, unclear default, must read rules
```

### AFTER (Option A: "Compete" renamed)

```
User clicks "Compete" nav
  ↓
Lands on /compete (CONTESTS - default)
  ↓
Sees contest list immediately
  ↓
Clicks contest row
  ↓
Lands on /contest/:id
  ↓
Reads rules
  ↓
Clicks "Draft Team" button
  ↓
Lands on /draft?contestId=X
  ↓
Builds team
  ↓
Clicks "Submit"

Duration: ~2 minutes (for a demo)
Friction points: 0 tab switches, clear default, optional rules reading
Improvement: 33% faster, 100% clearer intent
```

### AFTER (Power User Quick Draft)

```
User who knows what they're doing:

  Home page shows "Quick Draft: Join Hackathon Demo League"
  ↓
  Clicks "Draft"
  ↓
  Lands on /draft?contestId=6 directly
  ↓
  Builds team (30 seconds)
  ↓
  Clicks "Submit"

Duration: 45 seconds
Friction points: 0
Use case: Returning users, demo, power players
```

---

## Part 7: New User vs. Power User Paths

### New User Journey (First 2 minutes)

```
Lands on Home (/) → Sees hero section + explanation
  ↓
Clicks "Browse Contests" → /compete (contests tab)
  ↓
Sees contest list
  ↓
Clicks "Free League" contest
  ↓
Lands on /contest/:id, reads rules (optional)
  ↓
Clicks "Draft Team"
  ↓
Lands on /draft, formation visual guides them
  ↓
Submits team, celebration screen
  ↓
Clicks "View Leaderboard"
  ↓
Sees themselves on leaderboard (motivation!)
```

**Success metric:** Team entered < 2 minutes from signup

---

### Returning User Journey (Power User)

```
Visits Home (/) → Sees activity feed + recommended contests
  ↓
Sees "Hackathon Demo League — Join now" card
  ↓
Clicks "Quick Draft"
  ↓
Lands directly on /draft?contestId=6
  ↓
Takes 30 seconds to re-draft (formation visual is familiar)
  ↓
Submits team
  ↓
Celebration screen → "View Leaderboard"
  ↓
Checks rank + follow button to track competitors
```

**Success metric:** Team entered < 1 minute, high engagement

---

### Engaged User Journey (Achievement/Progression)

```
Visits Home (/) → Activity feed shows recent achievements
  ↓
Clicks "Progress" link in sidebar
  ↓
Lands on /progress, sees quests ("Enter 3 contests = 10 FS")
  ↓
Clicks "Enter Contest" quest CTA
  ↓
Navigates to /compete?tab=contests
  ↓
Enters a contest (completes first quest)
  ↓
Returns to /progress, sees progress bar update
  ↓
Clicks next quest
```

**Success metric:** 3-quest streak = 2x retention

---

## Part 8: Implementation Checklist (Option A Recommended)

### Phase 1: Rename Navigation (1 hour)

- [ ] Update `frontend/src/components/Layout.tsx`
  - Change navItems path from `/play` → `/compete`
  - Change label from "Play" → "Compete"
  - Update Icon (Trophy → Trophy, same icon is fine)
  - Update matchPaths to include `/draft` and `/contest/:id`

- [ ] Update `frontend/src/pages/Compete.tsx`
  - No code changes needed (page already exists)
  - Just verify default `mainTab` is `'contests'` (change from `'rankings'` if needed)

- [ ] Update `frontend/src/App.tsx`
  - Add redirect: `/play` → `/compete` (line 169)
  - Update route from `<Route path="/play" element={<Play />} />` to `<Route path="/compete" element={<Play />} />`
  - Import path should still be `Play` (that's the component name)

- [ ] Update URL redirects in App.tsx
  - `/play?tab=contests` → `/compete`
  - `/play?tab=rankings` → `/compete?tab=leaderboards`
  - `/arena` → `/compete` (already exists, good)

- [ ] Test navigation
  - Click "Compete" nav item → should land on contests tab
  - Verify back button works (Contests → Contest Detail → Draft)
  - Test deep links: `/compete`, `/compete?tab=leaderboards`, `/draft?contestId=6`

### Phase 2: Improve Draft Discoverability (1 hour)

- [ ] Update `frontend/src/pages/Home.tsx`
  - Add "Quick Draft" card for logged-in users (if they've entered before)
  - Card shows: Last contest, "Draft another team" button → `/draft?contestId=X`
  - Only show if user has active/recent contests

- [ ] Update Contest Detail page
  - Verify "Draft Team" button links to `/draft?contestId=X` (should already work)

- [ ] Test draft flow
  - Contest Detail → "Draft Team" → should land on `/draft?contestId=X`
  - Verify formation visual loads
  - Submit team → success screen → verify CTAs work

### Phase 3: Mobile Testing (30 minutes)

- [ ] Test on iPhone 12 (375px width)
  - Nav items fit (4 items should be comfortable)
  - Bottom nav is thumb-reachable
  - Tap targets are ≥44px

- [ ] Test on Android (375px width)
  - Same checks

- [ ] Test landscape mode (812px width)
  - Nav adapts correctly
  - No overflow

### Phase 4: Screenshot Verification (30 minutes)

- [ ] Take screenshots of:
  - `/` (Home page)
  - `/compete` (default to Contests tab)
  - `/compete?tab=leaderboards` (Leaderboard tab)
  - `/contest/:id` (Contest detail)
  - `/draft?contestId=6` (Draft builder)
  - `/profile` (Profile page)
  - Mobile bottom nav (verify all 4 items visible)

### Phase 5: QA Checklist (1 hour)

- [ ] End-to-end: Home → Compete → Contest → Draft → Submit → Success
- [ ] Backward nav: Draft → back arrow → should go to Contest Detail
- [ ] Direct links: `/compete`, `/contest/6`, `/draft?contestId=6` all work
- [ ] Mobile: Nav items highlight correctly on tap
- [ ] Redirects: `/play`, `/arena`, `/league` all redirect to `/compete`
- [ ] Error states: No contest found, contest locked, etc.

---

## Part 9: Why Not Option B (5th Nav Item "Quests")?

Considered but **NOT recommended** for these reasons:

### The 4-Item Sacred Rule Exists For a Reason

```
Mobile (375px):
[Home] [Compete] [Quests] [Feed] [Profile]  ← crowded, labels cut off
[Home] [Compete] [Feed]   [Profile]          ← clean, thumb-reachable
```

On mobile, 4 items = optimal thumb reach (index + middle fingers hit outer items, pinky/ring hit inner). 5 items = labels start wrapping, touch targets shrink.

### Quests Are Not a Primary Action

- Entry hierarchy: Find contest → Draft team → Get FS points
- Quests are a consequence, not the primary path
- Showing them in primary nav would confuse new users ("What's a quest?")
- DraftKings, FanDuel, Sleeper don't have primary nav for "achievements"

### The Problem Quests Solves is Already Solved

- Option A makes Contest entry clearer (Compete nav)
- Quests are still 1 click away (Profile → Progress)
- For motivated users, this is fine
- For casual users, visible nav would create cognitive load

### When to Revisit (Post-Hackathon)

Once user base grows to 5K+:
- If FS score becomes primary engagement metric
- If quest completion rate is >60%
- If user research shows progress tracking friction
- Then consider: Quests → Primary nav OR Compete gets sub-nav

For now: Option A is the right balance.

---

## Part 10: Migration Path (For Existing Users)

### How Existing Bookmarks Behave

- User has bookmark to `/play` → Redirect to `/compete` (transparent)
- User has bookmark to `/play?tab=contests` → Redirect to `/compete` (explicit)
- User has bookmark to `/play?tab=rankings` → Redirect to `/compete?tab=leaderboards` (mapping)

### Update Social/Demo Links

Before submitting to hackathon:
- Change all hardcoded `/play` links to `/compete` in:
  - Homepage CTAs
  - Email templates (if any)
  - README/documentation
  - YouTube video descriptions

### Launch Messaging (Optional)

No user notification needed (nav label change is self-explanatory), but if desired:

> "We're renaming 'Play' to 'Compete' to make it clearer what the tab does. Everything else stays the same!"

---

## Part 11: Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Users don't understand "Compete" | Clarity confusion | A/B test with small group, or keep "Play" with tooltip |
| Deep links to `/play` break | External referral links fail | Keep `/play` redirect forever (cheap) |
| Contest tab becomes default but users want rankings | Feature regression | Add "Leaderboards" filter/tab (already exists) |
| Draft page hidden if users don't follow full path | Power users frustrated | Add "Quick Draft" to home page for engaged users |
| Mobile nav gets too crowded | UX regression | Stick to 4 items max; don't add Quests nav |

---

## Part 12: Success Metrics (After Implementation)

Track these to validate the architecture change:

### Engagement Metrics
- **Contest entry rate:** % of daily active users who enter a contest (target: +15% from clarity improvement)
- **Time to first entry:** Minutes from signup to team submission (target: <2 minutes)
- **Repeat entry rate:** % of users who draft 2+ teams (target: +20%)

### Navigation Metrics
- **Contests tab clicks:** % of Compete nav clicks that land on contests (should be 60-70% if default is working)
- **Leaderboards tab clicks:** % of Compete nav clicks that land on leaderboards (should be 30-40%)
- **Draft direct access:** % of draft submissions from `/draft?contestId=X` direct URL (should be >10% for power users)

### Awareness Metrics
- **Progress page discovery:** % of users who visit `/progress` (target: +40% once visible)
- **Achievement completion rate:** % of active users completing at least 1 quest (target: >50%)

---

## Summary & Recommendation

### Current State Problems
1. "Play" label is unclear (action vs. state confusion)
2. Contests are secondary tab (backward from competitor defaults)
3. Draft is unreachable from nav (hidden power feature)
4. Progress/Quests have zero visibility (engagement killer)
5. Contest entry is 4 steps + tab switching (slower than competitors)

### Proposed Solution (Option A: Recommended)
Rename nav item from "Play" to "Compete" and swap default tab order. This:
- Clarifies intent in 1 word
- Makes contests discoverable (default tab)
- Enables direct `/draft` access
- Takes <2 hours to implement
- Requires 0 new nav items
- Maintains mobile UX (4 items unchanged)
- Beats DraftKings/FanDuel on clarity

### Implementation Timeline
- Phase 1 (rename nav): 1 hour
- Phase 2 (draft discoverability): 1 hour
- Phase 3-5 (testing + QA): 2 hours
- **Total: 4 hours** → ready for demo in 1 day

### Next Steps
1. **User review:** Approve "Compete" label vs. alternatives
2. **Screenshot before:** Take screenshots of current nav
3. **Implement:** Execute Phase 1-2
4. **Screenshot after:** Verify visual changes
5. **QA:** Run end-to-end contest entry flow
6. **Deploy:** Push to production
7. **Monitor:** Track engagement metrics weekly

---

## Appendix A: Alternative Labels Considered

| Label | Clarity | Brevity | Tone | Mobile Fit | Recommendation |
|-------|---------|---------|------|-----------|-----------------|
| Play | 6/10 | 10/10 | Casual | 10/10 | ❌ Too vague |
| Compete | 9/10 | 10/10 | Professional | 10/10 | ✅ RECOMMENDED |
| Contests | 10/10 | 9/10 | Specific | 9/10 | ⚠️ Too narrow (only contests) |
| Arena | 7/10 | 10/10 | Gaming | 10/10 | ❌ PvP-specific (not leaderboards) |
| Leagues | 8/10 | 10/10 | Sleeper-like | 10/10 | ⚠️ Too narrow (suggests long-term) |
| Matchups | 5/10 | 8/10 | DFS-specific | 9/10 | ❌ Confusing |

**Recommendation:** "Compete" wins across all dimensions.

---

## Appendix B: Full Page Access Map

```
Navigation Item:     ├─ Primary Route
                     ├─ Secondary Routes (child pages)
                     └─ Access Method

Home                 ├─ / (landing + dashboard)
                     └─ Logo click, nav item

Compete              ├─ /compete (contests default)
                     ├─ /compete?tab=leaderboards (sub-page)
                     ├─ /contest/:id (child page)
                     └─ /draft?contestId=X (child page, entry point)
                     └─ Nav item

Feed                 ├─ /feed (tweet feed)
                     └─ Nav item

Profile              ├─ /profile (my stats)
                     ├─ /settings (sub-page, gear icon)
                     ├─ /referrals (sub-page, referral card)
                     ├─ /progress (sub-page, progress link)
                     └─ Nav item

Legal (Footer)       ├─ /terms
                     ├─ /privacy
                     ├─ /cookies
                     └─ /imprint
```

---

End of Navigation Architecture Analysis
