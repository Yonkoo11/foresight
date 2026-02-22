# Social Features UI/UX Specification

> **Date:** February 22, 2026
> **Status:** Design Specification (Ready for Implementation)
> **Audience:** Frontend Designers, Product, Engineering
> **Backend Ready:** All APIs exist via Tapestry Protocol integration

---

## EXECUTIVE SUMMARY

Foresight has **working backend APIs for all social features** (follow, like, comment, activity feed, social counts) powered by Tapestry Protocol. This spec defines **where and how each social feature appears in the UI** without cluttering the experience.

**Key Principle:** Social features are secondary to the core game loop (draft → score → compete). They enhance credibility and community, but don't replace the primary actions.

**Design Decision:** We're adding 5 social interactions across 3 key pages. NO new pages or bottom nav items needed. Everything fits organically into existing layouts.

---

## PART 1: WHERE EACH SOCIAL FEATURE GOES

### Feature 1: FOLLOW / UNFOLLOW (Player Profiles)

**Purpose:** Build a "following" list to track your peers and get FOMO when they beat you.

**Where:**
- **Profile Page (`/profile`)** - Main placement
- **Leaderboard (`/compete`)** - Secondary placement
- **Hover cards** - Tertiary placement

#### 1A: Profile Page - FOLLOW Button

**Location:** User's profile header (desktop: right side of header, mobile: below avatar)

```
┌──────────────────────────────────────────────────────┐
│ [Avatar] @username              [FOLLOW Button]      │
│           Foresight Score: 1,240 pts                  │
│           Rank: #47 globally                          │
│           "Rising star, 5w streak"                    │
└──────────────────────────────────────────────────────┘
```

**Button States:**

- **Not Following:**
  - Appearance: `btn-cyan` (secondary action)
  - Label: "Follow"
  - Icon: User + Plus
  - Hover state: Gold glow, "Following" label appears

- **Following:**
  - Appearance: `btn-ghost` with gold border
  - Label: "Following"
  - Icon: User + Check mark (gold)
  - Hover state: "Unfollow" label appears (confirm before action)

**Interaction Flow:**

```
User clicks "Follow"
  ↓
Loading state (1-2 sec) → Show "⏳ Following..."
  ↓
API call to POST /api/tapestry/follow
  ↓
Success → Button changes to "Following" with check
  ↓
Toast notification: "✓ Now following @username"
  ↓
(Optional) Email notification to @username (Tapestry feature)
```

**Error Handling:**

```
If follow fails:
  Toast: "❌ Couldn't follow. Try again."
  Button: Revert to "Follow"
  Retry: Auto-retry on next click (with exponential backoff)
```

**Mobile Consideration:**

On mobile, follow button is positioned below the avatar section in the profile header. Takes full width at small sizes (`btn-sm`).

---

#### 1B: Leaderboard Row - FOLLOW Mini-Button

**Location:** Right side of each leaderboard row (hidden on mobile, revealed on hover/tap)

```
┌─────────────────────────────────────────────────────┐
│ Rank │ Player      │ Weekly │ Total  │ [Follow ➜] │
├─────────────────────────────────────────────────────┤
│  1   │ @alex_tr... │ +245   │ 8,950  │ [Follow] ← Hover shows
│  47  │ YOU @you    │ +102   │ 4,320  │ (Your row) │
│  48  │ @newbie... │ +98    │ 4,100  │ [Unfollow] ← Already following
└─────────────────────────────────────────────────────┘
```

**Button Properties:**
- Size: `btn-xs` (compact)
- Appearance: Toggles between "Follow" (cyan) and "Following" (gold)
- Show on: Desktop hover / Mobile tap (persistent)
- Click action: Same as profile button (instant state change)

**Why this location matters:**
- You're comparing yourself to other players
- "Follow" turns their leaderboard rank into a watchlist item
- Builds the social layer without disrupting the competitive view

**Mobile Consideration:**
- Swipe left on row → reveals Follow/Unfollow button
- Or: Persistent button on far right with `flex-shrink-0`
- Don't hide it entirely (defeats the purpose)

---

#### 1C: Player Hover Card (Optional, for future)

**Location:** When hovering over a player's name/avatar anywhere

```
┌──────────────────────────────────┐
│ [Avatar]                         │
│ @username                        │
│ Foresight Score: 1,240 pts       │
│ Rank: #47                        │
│ Streak: 5 weeks                  │
│ Team: [5 avatars showing picks]  │
│                                  │
│ [Follow] [View Profile]          │
└──────────────────────────────────┘
```

**Not MVP.** Add later if needed. Adds complexity without proportional value.

---

### Feature 2: LIKE (Team/Score Celebration)

**Purpose:** "Clap" for amazing team picks or high scores. Creates social proof and replay value.

**Where:**
- **Leaderboard rows** - Main placement
- **Profile > Teams tab** - Secondary placement
- **Contest detail entries** - Tertiary placement

#### 2A: Leaderboard Row - LIKE Button

**Location:** Far right of row, next to Follow button

```
┌─────────────────────────────────────────────────────┐
│ Rank │ Player    │ Weekly │ Total  │ ❤️(234) [Follow]│
├─────────────────────────────────────────────────────┤
│  1   │ @alex_tr..│ +245   │ 8,950  │ ❤️(234) [Follow] │
│  2   │ @defi_wh..│ +238   │ 8,821  │ ❤️(156) [Follow] │
│  47  │ YOU @you  │ +102   │ 4,320  │ ❤️(5) ✓ [Unf...]│ ← You liked it
└─────────────────────────────────────────────────────┘
```

**Button Properties:**
- Icon: Heart (outline or solid)
- Count: Shows total likes (right of icon)
- State changes:
  - Unliked: Gray heart + count (e.g., "❤️ 234")
  - Liked by you: Solid gold heart + count (e.g., "❤️ 235")
  - Hover: Tooltip "You liked this team"

**Interaction Flow:**

```
User hovers over row with 1,245 pts
  ↓
Sees heart icon with count "❤️ 234"
  ↓
Clicks heart
  ↓
Loading (1 sec) → Heart fills with gold
  ↓
API call to POST /api/tapestry/like/:contentId
  ↓
Count updates: "❤️ 235"
  ↓
Toast (optional): "❤️ You liked @username's team"
```

**What counts as "likeable content"?**
- A team formation (after submission)
- A score achievement (e.g., "102 pts this week")
- A rank milestone (e.g., "Just hit #47!")

**Mobile Consideration:**
- On mobile, likes are shown but clicking is less obvious
- Swipe left on row → reveals like button
- Or: Add a button that appears on tap

---

#### 2B: Profile > Teams Tab - LIKE on Your Teams

**Location:** Below each team card you've created

```
┌───────────────────────────────┐
│ Team: "Dream Team #1"         │
│ Score: 102 pts                │
│ Formation: [5 avatars]        │
│                               │
│ Liked by: @friend1, @friend2  │
│ ❤️ 5 likes [Share]            │
└───────────────────────────────┘
```

**Shows:**
- "Liked by" list (first 3 friends, "and X more" link)
- Heart count
- Ability to like your own team (for pinning/saving)

---

### Feature 3: COMMENT (Team Discussion)

**Purpose:** Celebrate standout picks, discuss strategy, build community. **BUT** keep it lightweight (don't become a chat app).

**Where:**
- **Contest Detail page** - Main placement
- **Profile > Teams tab** - Secondary placement (optional)
- **NOT on leaderboard** (too cluttered)

#### 3A: Contest Detail - Comments Section

**Location:** Below the contest rules / prize info, before the leaderboard

```
┌──────────────────────────────────────────────────────┐
│ COMMENTS (Team Discussions)                          │
├──────────────────────────────────────────────────────┤
│                                                      │
│ [Avatar] @vitalik_fan  2 hours ago                   │
│ "Love how @raydium dominates the engagement stats"   │
│ ❤️ 12  💬 [Reply]  [Copy link]                       │
│                                                      │
│ [Avatar] @defi_whale   1 hour ago                    │
│ "Captain @vitalik was the key. Needed that +35 pts"  │
│ ❤️ 8   💬 [Reply]  [Copy link]                       │
│                                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ [Your avatar] Your comment                      │ │
│ │ [Text input: "Type your thoughts..."]           │ │
│ │                                          [Post] │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Key Details:**

- **What people comment on:** Contest strategy, team picks, scoring milestones
- **Who sees comments:** Everyone (public discussions per contest)
- **Comment depth:** 1 level (no nested replies for MVP)
- **Moderation:** Show reported comments as "[Removed]" (backend handles)

**Interaction Flow:**

```
User types in comment box: "Great pick with @raydium"
  ↓
Focus state: Textarea expands, blue border
  ↓
Character limit: 280 chars (like Twitter)
  ↓
Clicks [Post]
  ↓
Loading (1 sec) → Shows "⏳ Posting..."
  ↓
API call to POST /api/tapestry/comment/:contestId
  ↓
Comment appears at top of list with "just now" timestamp
  ↓
Toast: "✓ Comment posted" (optional)
```

**Error Handling:**

```
If comment is empty: Button disabled (gray)
If comment is too long: Show red error "280 char limit"
If post fails: Show toast "❌ Couldn't post. Try again."
  Keep text in textarea (don't lose it)
```

**Mobile Consideration:**

- Comments section is collapsed by default on mobile (saves scroll space)
- Tap "💬 5 Comments" to expand
- Full-width comment input when expanded

---

#### 3B: Contest Entries - Comments Sidebar

**Location:** Right side of leaderboard entries (desktop only)

**Not MVP.** Skip this for launch. Add in v2 if we want per-team comments.

---

### Feature 4: ACTIVITY FEED (What Friends Are Doing)

**Purpose:** Create FOMO and engagement by showing real-time social proof.

**Where:**
- **Home page** - NEW "Activity Feed" card (above or below hero)
- **New optional page** `/activity` - Dedicated activity feed

#### 4A: Home Page - Activity Feed Card (RECOMMENDED)

**Location:** Below the hero section, above "How it Works"

```
┌──────────────────────────────────────────────────────┐
│ 🔥 WHAT'S HAPPENING                                  │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ✓ @alex_trader just ranked #1 (+5 spots)             │
│ ❤️ @defi_whale liked @raydium's team                 │
│ 👁️ 847 players are watching @vitalik right now       │
│ ✓ @punk_3882 hit a 45-point streak!                  │
│ 💬 @newbie started a team for the Speed Run           │
│ ❤️ 12 people liked the @modular analysis             │
│                                                      │
│ [View More] [Follow Friends]                         │
└──────────────────────────────────────────────────────┘
```

**Content Types (in order of importance):**

1. **Rank changes** - "X just moved up 10 spots to #42"
2. **Likes on teams** - "12 people liked your team"
3. **Comments** - "5 new comments on the Free Weekly Championship"
4. **Follows** - "X started following you"
5. **Milestones** - "X just hit a 5-week streak"
6. **New teams** - "X entered a contest"

**Technical Implementation:**

- **Update frequency:** Fetch every 30 seconds (piggyback on live scoring SSE)
- **Limit:** Show 6 items max (rest hidden behind [View More])
- **Data source:** `GET /api/activity/feed` (already exists)
- **Filtering:** Only show for users the viewer follows (+ some global moments)

**Mobile Consideration:**

- Full-width card, stacks vertically
- Each item is a single line (no truncation, wraps naturally)

---

#### 4B: Dedicated Activity Feed Page (OPTIONAL, POST-MVP)

**Route:** `/activity`

**Worth building only if:**
- Activity feed gets heavy engagement on home card
- We want to show activity from strangers (not just friends)
- We're building community features beyond MVP

**Not recommended for hackathon.** Skip it.

---

### Feature 5: SOCIAL COUNTS (Followers / Following)

**Purpose:** Show credibility and social proof. "X people are watching you."

**Where:**
- **Profile header** - Main placement
- **Leaderboard hover card** - Secondary placement (v2)

#### 5A: Profile Header - Follower Stats

**Location:** Below username, left side of profile header

```
┌────────────────────────────────────────────────┐
│ [Avatar] @username              [FOLLOW Button]│
│          Foresight Score: 1,240 pts            │
│          Rank: #47 globally                    │
│                                                │
│  👥 1,240 Followers  |  Following 342          │
│  📍 Following for 5 weeks  |  Streak: 4 weeks  │
└────────────────────────────────────────────────┘
```

**What to Show:**
- **Followers count** - "👥 1,240 Followers"
- **Following count** - "👁️ Following 342"
- Click to expand list (modal with scrollable followers/following)

**Data Source:**
- `GET /api/tapestry/social-counts/:profileId` - Get follower/following counts
- `GET /api/tapestry/followers/:profileId` - Get list of followers
- `GET /api/tapestry/following/:profileId` - Get list of following

**Interaction Flow:**

```
User views profile
  ↓
See "👥 1,240 Followers" link
  ↓
Click to open modal
  ↓
Modal shows list of followers with their ranks/scores
  ↓
Can follow/unfollow directly from modal
```

**Mobile Consideration:**

- Counts are inline (👥 1,240 | 👁️ 342)
- Modal opens full-screen on mobile
- Swipe down to close modal

---

## PART 2: INTERACTION PATTERNS

### Pattern 1: Follow/Unfollow Button

**States:**

```
NOT FOLLOWING (default)
┌────────────────┐
│ + Follow       │ ← Cyan button
└────────────────┘
  On hover: Changes to gold
  On click: Starts loading

LOADING
┌────────────────┐
│ ⏳ Following...│ ← Disabled (gray)
└────────────────┘
  Takes 1-2 seconds
  Show spinner/skeleton

FOLLOWING (success)
┌────────────────┐
│ ✓ Following    │ ← Gold with check
└────────────────┘
  On hover: Changes to red text "Unfollow?"
  On click: Confirms and unfollows

ERROR
┌────────────────┐
│ ! Try Again    │ ← Red border
└────────────────┘
  Shows error toast
  Click to retry
```

**Loading State Behavior:**
- Button is disabled (pointer-events: none)
- Spinner animation inside button
- Takes 1-2 seconds (don't show if faster)

**Accessibility:**
- Button text changes for screen readers
- Keyboard: Tab to button, Enter to toggle
- No nested interactive elements

---

### Pattern 2: Like Button (Heart Icon)

**States:**

```
UNLIKED (default)
❤️ 234         ← Gray heart, count in gray

HOVER (desktop only)
❤️ 234 ← Brightens to cyan, tooltip "Like this team"

LIKED (success)
❤️ 235 ← Gold heart, count in gold
        ← Tooltip "You liked this team"

LOADING
⏳ 234 ← Spinner replaces heart briefly

ERROR
❤️ 234 ← Heart stays same, error toast shows
        ← User can retry by clicking again
```

**Animation:**
- When you like: Heart icon animates (bounce/scale up 1.1x) for 300ms
- Count increments smoothly (no jarring jump)

**Accessibility:**
- Role="button" on the container
- aria-label="Like this team, 234 likes total"
- Keyboard: Tab + Enter to toggle like

---

### Pattern 3: Comment Input Box

**States:**

```
EMPTY (focused)
┌────────────────────────────────────┐
│ [Your avatar] What do you think?   │
│                                    │
│ 0 / 280 chars            [Post]    │ ← Disabled
└────────────────────────────────────┘

TYPING
┌────────────────────────────────────┐
│ [Your avatar] Great pick with @ray │
│                                    │
│ 30 / 280 chars          [Post]     │ ← Enabled
└────────────────────────────────────┘

TOO LONG
┌────────────────────────────────────┐
│ [Your avatar] Great pick with      │
│ @raydium, this is going to rocket- │
│                                    │
│ 285 / 280 chars (❌ 5 over) [Post] │ ← Red, disabled
└────────────────────────────────────┘

POSTING
┌────────────────────────────────────┐
│ [Your avatar] Great pick with      │
│                                    │
│ 30 / 280 chars    [⏳ Posting...]   │ ← Disabled
└────────────────────────────────────┘

POSTED
┌────────────────────────────────────┐
│ [Your avatar] Great pick with      │
│ 1 second ago                        │
│ ❤️ 0  💬  [⋯]                       │
│                                    │
│ [Your avatar] What do you think?   │ ← Back to empty
└────────────────────────────────────┘
```

**Character Limit:**
- Max 280 characters (like Twitter)
- Show counter: "45 / 280"
- At 280: Disable input + show red error

**Emoji Support:**
- Yes, count as 1 character each
- Use a picker or allow direct paste

---

## PART 3: WHAT NOT TO ADD

### ❌ Direct Messaging / Chat

**Why:** Adds complexity (unread counts, notifications, moderation). Crypto Twit­ter already has Twitter/Telegram/Discord. Don't compete.

**Alternative:** "Reply on X" button links to Twitter.

---

### ❌ User Profiles with Edit Page

**Why:** Social profile editing adds a lot of scope. For MVP, profile = read-only stats.

**Alternative:** Profile just shows their team, rank, and stats. Edit username happens on settings page (already exists).

---

### ❌ Notifications Center

**Why:** Push notifications, email digests, in-app notification bell = scope creep.

**Alternative:** Toast notifications for direct actions ("You followed X") + email from Tapestry (native feature).

---

### ❌ Achievements / Badge System

**Why:** Another gamification layer on top of leaderboards. Redundant.

**Alternative:** Leaderboard rank IS the achievement. Show badges only if someone wins (1st place gets a trophy badge).

---

### ❌ Friends-Only Contests

**Why:** Adds complexity to contest creation. Just use global leaderboards.

**Alternative:** "View my friends' scores" tab on leaderboard (already exists in spec).

---

### ❌ Nested Comment Replies

**Why:** Turns into a forum. Thread discussions slow down the pace.

**Alternative:** Single-level comments only (flat). Build nested replies in v2 if needed.

---

### ❌ Advanced Search / Filtering

**Why:** "Find players by tier" or "Show comments from experts" adds UI complexity.

**Alternative:** Simple follower list, global activity feed, that's it.

---

## PART 4: MOBILE LAYOUT STRATEGY

### Mobile Navigation (Bottom Nav Remains 4 Items)

```
Current (Correct):
┌─────────────────────────────────┐
│ Page content                     │
│                                  │
├─────────────────────────────────┤
│ 🏠 Home | ⚔️ Compete | 📰 Intel │ Profile |
└─────────────────────────────────┘
```

**Decision:** DO NOT add a 5th nav item for "Activity" or "Social."

**Why:** Bottom nav is sacred real estate. 4 items is max usable on mobile. Adding a 5th makes icons tiny and forces scrolling.

**Alternative:** Activity feed lives on Home page (card-based, swiped away if not interested).

---

### Mobile Modifications for Social Features

#### Follow Button (Mobile)

```
Profile page on mobile:
┌───────────────────────────┐
│ [Avatar]                  │
│ @username                 │
│ 1,240 pts  |  #47         │
│ [FOLLOW Button - full wd] │ ← Stacks vertically
│                           │
│ 👥 1,240 Followers        │
│ 👁️ 342 Following          │
└───────────────────────────┘
```

Button is full-width, tappable target is 44x44px (iOS) / 48x48px (Android).

#### Like Button (Mobile)

```
Leaderboard on mobile:
┌──────────────────────────┐
│ Rank | Player   | Weekly │ (Scrollable table)
├──────────────────────────┤
│  1   | @alex    | +245   │
│      | Like: ❤️ 234 [Follow] │ ← Swipe reveals
└──────────────────────────┘
```

**Option A (Swipe):** Swipe left on row to reveal Like + Follow buttons.
**Option B (Persistent):** Like icon always shows with count. Tap to like.

**Recommendation:** Option B (persistent). Swipe gestures are less discoverable.

#### Comments (Mobile)

```
Contest detail on mobile:
┌───────────────────────┐
│ Contest info           │
│                       │
│ 💬 5 Comments         │ ← Tap to expand
│                       │
│ [Expanded comments]   │
└───────────────────────┘
```

Comments section is collapsed by default. Tap the "💬 5 Comments" to expand. Full-width comment input when active.

#### Activity Feed (Mobile)

```
Home page on mobile:
┌──────────────────────┐
│ Hero section         │
│                      │
│ 🔥 ACTIVITY          │ ← Swipeable card
│ ✓ @alex ranked #1    │
│ ❤️ 12 people liked... │
│ [View More ➜]        │
│                      │
│ How It Works         │
└──────────────────────┘
```

Activity card is swipeable (horizontal scroll). [View More] opens full feed.

---

## PART 5: DESIGN TOKENS & STYLING

### Colors

```
Follow Button (not following):
- Background: --cyan-500 (#06B6D4)
- Text: --white
- Hover: Brighter cyan (#22D3EE)
- Icon: User + Plus

Follow Button (following):
- Background: transparent
- Border: --gold-500 (#F59E0B)
- Text: --gold-500
- Icon: User + Check

Like Button (unliked):
- Color: --gray-500
- Hover: --cyan-500

Like Button (liked):
- Color: --gold-500
- Animation: Scale 1.1x for 300ms

Comment Count Badge:
- Background: --gray-800
- Text: --gray-400
- Hover: Brighten to --gray-700

Activity Feed Items:
- Text: --gray-300
- Icon: --gold-500 or --cyan-500 (action-specific)
- Timestamp: --gray-600
```

### Typography

```
Social Counts:
- Font: Inter 500 (medium weight)
- Size: 14px (mobile), 16px (desktop)
- Color: --gray-300

Comment Author:
- Font: Inter 600 (bold)
- Size: 13px
- Color: --white

Comment Text:
- Font: Inter 400 (regular)
- Size: 14px
- Color: --gray-300
- Line-height: 1.5

Activity Feed Item:
- Font: Inter 400
- Size: 13px
- Color: --gray-400
```

### Spacing

```
Follow Button:
- Padding: 8px 16px (desktop), full width on mobile
- Gap (icon + text): 6px

Like Count:
- Gap (heart + count): 4px

Comment Box:
- Padding: 12px
- Gap (avatar + input): 8px
- Input padding: 8px 12px

Activity Card:
- Padding: 16px
- Gap (items): 8px
- Item padding: 8px 0
```

### Animations

```
Follow Button Click:
- Loading: Spin icon 360° over 1.5s (linear)
- Success: Fade in check mark (200ms)

Like Button Click:
- Icon scale: 1 → 1.15 → 1 over 300ms (ease-out)
- Color fade: Gray → Gold over 200ms

Comment Submit:
- Button: Pulse effect during loading (opacity 0.8 → 1)
- Comment appear: Fade in from bottom (300ms, ease-out)

Activity Feed:
- Item entrance: Slide in from left (200ms)
- Timestamp update: Subtle color flash (100ms)
```

---

## PART 6: API INTEGRATION CHECKLIST

### All APIs Already Exist ✅

The backend has all these endpoints (via Tapestry Protocol):

```
FOLLOW/UNFOLLOW
✅ POST /api/tapestry/follow
✅ POST /api/tapestry/unfollow
✅ GET /api/tapestry/following-state/:targetProfileId
✅ GET /api/tapestry/followers/:profileId
✅ GET /api/tapestry/following/:profileId
✅ GET /api/tapestry/social-counts/:profileId

LIKE/UNLIKE
✅ POST /api/tapestry/like/:contentId
✅ DELETE /api/tapestry/like/:contentId

COMMENTS
✅ POST /api/tapestry/comment/:contentId
✅ GET /api/tapestry/comments/:contentId

ACTIVITY
✅ GET /api/activity/feed (global)
✅ GET /api/activity/me (user-specific)
✅ GET /api/tapestry/activity (Tapestry-specific)
```

### Frontend Implementation Order

1. **Follow buttons** (easy, low-risk)
   - Profile page
   - Leaderboard rows

2. **Like buttons** (simple state toggle)
   - Leaderboard rows
   - Profile teams

3. **Activity feed card** (informational, no interaction)
   - Home page
   - Auto-refresh every 30s

4. **Comments** (more complex, input validation)
   - Contest detail page
   - Comment moderation (backend handles)

5. **Social counts** (read-only display)
   - Profile header
   - Follower/following modals

---

## PART 7: SUMMARY TABLE

| Feature | Location | Placement | Importance | Mobile | Complexity |
|---------|----------|-----------|------------|--------|------------|
| Follow | Profile header, Leaderboard | Primary | HIGH | Button below avatar, row swipe | Low |
| Like | Leaderboard, Teams tab | Primary | HIGH | Swipe/persistent, tap to like | Low |
| Comment | Contest detail page | Primary | MEDIUM | Collapsed section, full-width input | Medium |
| Activity | Home page | Card | MEDIUM | Scrollable card, [View More] | Low |
| Social Counts | Profile header | Stats | LOW | Inline counts, modal on tap | Low |

---

## PART 8: WIREFRAME EXAMPLES

### Leaderboard with Social Features

```
Desktop:

┌──────────────────────────────────────────────────────────┐
│ 🏆 LEADERBOARD (This Week)                  [Filters]    │
├──────────────────────────────────────────────────────────┤
│ Rank | Player         | This Week | Total | Actions      │
│ ────┼────────────────┼───────────┼───────┼─────────────  │
│  1  │ @alex_trader   │   +245    │ 8,950 │ ❤️234 [Follow]│
│  2  │ @defi_whale    │   +238    │ 8,821 │ ❤️156 [Follow]│
│  ... │  ...           │   ...     │ ...   │  ...         │
│ 47  │ YOU @username  │   +102    │ 4,320 │ ❤️12 [Unf.] │
│ 48  │ @newbie123     │   +98     │ 4,100 │ ❤️5 [Follow] │
│ ────┴────────────────┴───────────┴───────┴─────────────  │
│ [Load more] or infinite scroll                           │
└──────────────────────────────────────────────────────────┘
```

### Profile with Social Features

```
Desktop:

┌────────────────────────────────────────────────────────┐
│ [Avatar] @username                  [FOLLOW Button]    │
│ Foresight Score: 1,240 pts                             │
│ Rank: #47 globally                                     │
│                                                        │
│ 👥 1,240 Followers  |  👁️ 342 Following               │
│ Following for 5 weeks | Streak: 4 weeks                │
├────────────────────────────────────────────────────────┤
│ [Stats] [Teams] [Watchlist] [Activity]                 │
├────────────────────────────────────────────────────────┤
│ STATS TAB                                              │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Total Points: 4,320  | Win Rate: 58%               │ │
│ │ Contests: 8          | Streak: 4 weeks             │ │
│ │ [Chart showing points over time]                   │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ TEAMS TAB                                              │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Team: "Dream Pick"                 102 pts         │ │
│ │ [Formation: 5 avatars]             [Share]         │ │
│ │ Liked by: @friend1, @friend2, and 3 others         │ │
│ │ ❤️ 5 Likes   💬 3 Comments   [More]                │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Home Page with Activity Feed

```
Desktop:

┌────────────────────────────────────────────────────────┐
│ HERO SECTION (Formation visual + CTA)                  │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ 🔥 WHAT'S HAPPENING                                    │
│ ✓ @alex_trader just ranked #1 (+5 spots)              │
│ ❤️ 12 people liked @raydium's team                     │
│ 👁️ 1,247 players active right now                     │
│ ✓ @punk_3882 hit a 45-point streak!                   │
│ 💬 @newbie started drafting the Speed Run              │
│ ❤️ You got 5 likes on your team                        │
│ [View More Activity]   [Follow Friends]                │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ HOW IT WORKS                                           │
│ Step 1: Draft  →  Step 2: Earn  →  Step 3: Win        │
└────────────────────────────────────────────────────────┘
```

### Contest Detail with Comments

```
Desktop:

┌────────────────────────────────────────────────────────┐
│ FREE WEEKLY CHAMPIONSHIP                               │
│ Entry: FREE  |  Prize Pool: 50 SOL  |  2,847 Players   │
│ Ends: Saturday 11:59 PM UTC                            │
├────────────────────────────────────────────────────────┤
│ RULES & LEADERBOARD                                    │
│ [Leaderboard entries...]                               │
├────────────────────────────────────────────────────────┤
│ 💬 COMMENTS (7 total)                                  │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [Avatar] @vitalik_fan     2 hours ago              │ │
│ │ "Loved picking @raydium for the engagement bonus"  │ │
│ │ ❤️ 12   💬 [Reply]   [Copy link]                   │ │
│ │                                                    │ │
│ │ [Avatar] @defi_whale      1 hour ago               │ │
│ │ "Captain @vitalik was the MVP this week"           │ │
│ │ ❤️ 8    💬 [Reply]   [Copy link]                   │ │
│ │                                                    │ │
│ │ [Your Avatar] Your comment                        │ │
│ │ [Text input: "Type your thoughts..."]             │ │
│ │                                               [Post]│ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## PART 9: IMPLEMENTATION PRIORITY

### Phase 1: MVP (Required for Hackathon)

1. **Follow buttons** (Leaderboard + Profile)
   - Effort: 3-4 hours
   - Risk: Low
   - Impact: High (credibility + social proof)

2. **Activity feed card** (Home page)
   - Effort: 2-3 hours
   - Risk: Low
   - Impact: Medium (engagement + FOMO)

**Time for Phase 1: ~6 hours**

### Phase 2: Polish (If time allows)

3. **Like buttons** (Leaderboard + Profile teams)
   - Effort: 2-3 hours
   - Risk: Low
   - Impact: Medium (celebration + engagement)

4. **Social counts** (Profile header)
   - Effort: 1-2 hours
   - Risk: Low
   - Impact: Low (display-only, but nice to have)

**Time for Phase 2: ~4 hours**

### Phase 3: Post-MVP

5. **Comments** (Contest detail page)
   - Effort: 4-5 hours
   - Risk: Medium (moderation, input validation)
   - Impact: Medium (community building)

**Time for Phase 3: ~5 hours**

---

## PART 10: FINAL CHECKLIST

### Before Committing

- [ ] User can follow/unfollow from profile page
- [ ] User can see follow button on leaderboard rows
- [ ] Follow state persists across page refreshes
- [ ] Loading state shows during API call
- [ ] Error toast appears if follow fails
- [ ] Activity feed card shows on home page
- [ ] Activity feed auto-refreshes every 30 seconds
- [ ] Mobile responsive (tested on iPhone)

### Before Demo

- [ ] No console errors related to social features
- [ ] Follow buttons have proper hover/active states
- [ ] Activity feed has real data (not dummy data)
- [ ] Performance: Social API calls complete in <1 second
- [ ] Accessibility: Tab through all interactive elements

### For Judges

- [ ] Social counts visible on profile (shows credibility)
- [ ] Activity feed shows real-time engagement (proof of community)
- [ ] One feature judges will immediately notice: Follow button (social proof on leaderboard)

---

## APPENDIX: Why This Strategy Works

### 1. Minimal Scope Creep

We're **not** building:
- Chat system
- Complex profile editor
- Moderation dashboard
- Advanced notifications

We're **adding:**
- 5 lightweight interactions to existing pages
- Zero new pages (everything fits existing layout)
- Zero new bottom nav items (keeps mobile UX clean)

### 2. Leverages Existing Architecture

- Tapestry API is 100% ready
- Activity feed API already exists
- Database schema supports everything
- Zero new migrations needed

### 3. Aligns with Core Loop

- Follow = builds your "watchlist" → check leaderboard
- Like = celebrate wins → drives sharing
- Comment = discuss strategy → builds community
- Activity = social proof → drives FOMO

None of these divert from the core action (draft → score → compete).

### 4. Mobile-First Design

- Bottom nav stays at 4 items (sacred on mobile)
- Activity and comments are collapsible (don't waste space)
- Follow/Like buttons are tappable (44x44px targets)
- No nested menus or complex gestures

### 5. Hackathon-Ready

Can implement Phase 1 + Phase 2 in **~10 hours total**. Gives us:
- Credible social proof (people following each other)
- Real-time engagement signaling (activity feed)
- Celebration mechanics (likes)
- Tapestry integration showcase (for bounty)

All without breaking the core experience or the 6-page MVP scope.

---

**End of Specification**

*Created Feb 22, 2026 by Claude (UX Designer)*
*Ready for frontend implementation immediately*
