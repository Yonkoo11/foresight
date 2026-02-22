# Social Features - Visual Wireframes

> ASCII wireframes showing exact placement of each social feature

---

## PROFILE PAGE - WITH SOCIAL FEATURES

### Desktop Layout

```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ FORESIGHT  [Score: 1,240] [⚙️ Settings]  @username       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PROFILE HEADER                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Avatar]  @username                      [FOLLOW Button]  │
│            Foresight Score: 1,240 pts                       │
│            Rank: #47 globally                               │
│            "Rising star, 5-week streak"                     │
│                                                             │
│  👥 1,240 Followers  |  👁️ 342 Following                   │
│  Following for 5 weeks  |  4-week streak                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TABS: [Stats]  [Teams]  [Watchlist]  [Activity]             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TEAMS TAB (SELECTED)                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Team: "Dream Team #1"                                  │ │
│ │ Status: Active  |  Score: 102 pts this week            │ │
│ │ Contest: Free Weekly Championship                       │ │
│ │                                                        │ │
│ │ Formation:                                             │ │
│ │           [S-tier: @vitalik]                           │ │
│ │       [A-tier] × [A-tier]                              │ │
│ │     [B-tier] × [B-tier]                                │ │
│ │                                                        │ │
│ │ Liked by: @friend1, @friend2, and 3 others             │ │
│ │ ❤️ 5 Likes  |  💬 3 Comments  [Share] [Stats]          │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Team: "Speed Run Picks"                                │ │
│ │ Status: Locked  |  Score: 34 pts                       │ │
│ │ [Formation card...]                                    │ │
│ │ ❤️ 2 Likes  |  💬 1 Comment  [View]                    │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────────┐
│ 🔙 Profile     ⚙️       │
├─────────────────────────┤
│                         │
│  [Large Avatar]         │
│  @username              │
│  1,240 pts | #47        │
│  "Rising star, 5w"      │
│                         │
│  [FOLLOW Button]        │
│  (Full Width)           │
│                         │
│  👥 1,240 Followers     │
│  👁️ 342 Following       │
│                         │
├─────────────────────────┤
│ [Stats][Teams][Watch]   │ ← Scrollable tabs
├─────────────────────────┤
│ TEAMS                   │
│                         │
│ Team: "Dream #1"        │
│ [Formation:             │
│  @vitalik               │
│  @raydium @punk_3882    │
│  @defiwral @modular]    │
│ 102 pts  (Active)       │
│                         │
│ ❤️ 5  💬 3  [Share]     │
│ [Stats] [View]          │
│                         │
│ ─────────────────────── │
│                         │
│ Team: "Speed Run"       │
│ [Formation...]          │
│ 34 pts  (Locked)        │
│                         │
│ ❤️ 2  💬 1  [View]      │
│                         │
└─────────────────────────┘
```

---

## LEADERBOARD PAGE - WITH FOLLOW & LIKE

### Desktop Layout

```
┌──────────────────────────────────────────────────────────────┐
│ 🏆 LEADERBOARD    [Filter by: All ▼]  [Timeframe: Weekly ▼] │
├──────────────────────────────────────────────────────────────┤
│  Rank  │  Player        │  This Week  │  Total  │  Actions   │
├──────────────────────────────────────────────────────────────┤
│        │                │             │         │            │
│   1   │  @alex_trader  │    +245     │  8,950  │  ❤️234     │
│       │  (S-tier draft) │             │         │  [Follow]  │
│   2   │  @defi_whale   │    +238     │  8,821  │  ❤️156     │
│       │  (Captain pick) │             │         │  [Follow]  │
│   3   │  @raydium      │    +225     │  8,754  │  ❤️189     │
│       │  (Hot streak)  │             │         │  [Unfol..] │ ← You follow
│       │                │             │         │            │
│  ...  │   ...          │    ...      │  ...    │   ...      │
│       │                │             │         │            │
│  47  │  YOU           │    +102     │  4,320  │  ❤️5 ✓    │
│      │  @username     │    (↑5)     │         │  [Unfollow]│ ← Gold highlight
│       │                │             │         │            │
│  48  │  @newbie123    │    +98      │  4,100  │  ❤️2      │
│       │  (Rising star) │             │         │  [Follow]  │
│       │                │             │         │            │
│ [Load more leaderboard entries...]                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘

Key:
- ❤️234 = Like count (gray = not liked, gold = you liked)
- [Follow] = Cyan button (click to follow)
- [Unfollow] = Gold button with check (click to unfollow)
- ↑5 = Rank change from yesterday
- YOUR ROW = Gold highlight/border
```

### Mobile Layout

```
┌────────────────────────┐
│ 🔙 Leaderboard   Filter│
├────────────────────────┤
│ 1. @alex_trader        │
│    +245 pts (Weekly)   │
│    ❤️234  [Follow ➜]  │
│                        │
│ 2. @defi_whale         │
│    +238 pts            │
│    ❤️156  [Follow ➜]  │
│                        │
│ ...                    │
│                        │
│ 47. YOU @username      │
│     +102 pts  ↑5       │
│     ❤️5✓  [Unfol.➜]   │ ← Gold background
│                        │
│ 48. @newbie123         │
│     +98 pts            │
│     ❤️2  [Follow ➜]   │
│                        │
│ [Load more]            │
│                        │
└────────────────────────┘

Swipe left to reveal:
┌────────────────────────┐
│ 47. YOU @username      │
│     +102 pts  ↑5       │
│     ← [Like] [Follow]→ │
│                        │
│ 48. @newbie123         │
│     +98 pts            │
│     ← [Like] [Follow]→ │
└────────────────────────┘
```

---

## HOME PAGE - WITH ACTIVITY FEED

### Desktop Layout

```
┌─────────────────────────────────────────────────────────┐
│ ⚡ FORESIGHT  [Your Score: 1,240]  @username  🔔 Settings│
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ HERO SECTION                                            │
│                                                         │
│ Left Side:              │  Right Side:                  │
│ "Draft your 5           │  [Formation Hero Visual]      │
│  influencers"           │                               │
│                         │       [S-tier Captain]        │
│ [Start Playing] CTA     │      [A] × [A]                │
│                         │     [B] × [B]                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 🔥 WHAT'S HAPPENING (Live Activity)                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ✓ @alex_trader just ranked #1 (↑5 spots)              │
│   2 minutes ago                                         │
│                                                         │
│ ❤️ 12 people liked @raydium's team                     │
│   "Great engagement picks"                              │
│   5 minutes ago                                         │
│                                                         │
│ 👁️ 1,247 players active right now                     │
│   Watching live scores                                  │
│                                                         │
│ ✓ @punk_3882 hit a 45-point streak!                    │
│   8 minutes ago                                         │
│                                                         │
│ 💬 @newbie started drafting the Speed Run               │
│   10 minutes ago                                        │
│                                                         │
│ ❤️ You got 5 likes on your team!                       │
│   Keep up the great picks                              │
│   15 minutes ago                                        │
│                                                         │
│ [View More Activity]  [Follow Friends]                  │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ HOW IT WORKS                                            │
│ Step 1: Draft  →  Step 2: Earn  →  Step 3: Win         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ FEATURED CONTEST                                        │
│ [Contest card...]                                       │
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────────┐
│ ⚡ FORESIGHT  @username  │
├──────────────────────────┤
│ Hero + CTA               │
│ [Formation Visual]       │
│ [Start Playing]          │
│                          │
├──────────────────────────┤
│ 🔥 ACTIVITY (Swipeable) │
│                          │
│ ✓ @alex_trader #1 (↑5)  │
│                          │
│ ❤️ 12 liked @raydium    │
│                          │
│ 👁️ 1,247 active now     │
│                          │
│ [← Swipe More →]         │
│                          │
│ [View More] [Follow]     │
│                          │
├──────────────────────────┤
│ How It Works             │
│ Step 1 → Step 2 → Step 3 │
│                          │
├──────────────────────────┤
│ Featured Contest         │
│ [Card...]               │
│                          │
├──────────────────────────┤
│ 🏠 | ⚔️ | 📰 | 👤       │ ← Bottom nav
└──────────────────────────┘
```

---

## CONTEST DETAIL - WITH COMMENTS

### Desktop Layout

```
┌──────────────────────────────────────────────────────────┐
│ [← Back to Compete]  FREE WEEKLY CHAMPIONSHIP            │
├──────────────────────────────────────────────────────────┤
│ Entry: FREE  |  Prize Pool: 50 SOL  |  Players: 2,847   │
│ Ends: Saturday 11:59 PM UTC                              │
│ Rules: 5-player team, Captain ×1.5, Weekly scoring       │
├──────────────────────────────────────────────────────────┤
│ LEADERBOARD                                              │
│ 1. @alex_trader ... +245 pts                             │
│ 2. @defi_whale  ... +238 pts                             │
│ ... (more entries)                                       │
├──────────────────────────────────────────────────────────┤
│ 💬 COMMENTS (7 total)                                    │
│                                                          │
│ ┌───────────────────────────────────────────────────────┐│
│ │ [Avatar] @vitalik_fan     2 hours ago                 ││
│ │ "Love how @raydium dominates the engagement stats"    ││
│ │ ❤️ 12   💬 [Reply]   [Copy link]  [⋯]               ││
│ │                                                        ││
│ │ [Avatar] @defi_whale      1 hour ago                  ││
│ │ "Captain @vitalik was the key. +35 pts that won it"   ││
│ │ ❤️ 8    💬 [Reply]   [Copy link]  [⋯]               ││
│ │                                                        ││
│ │ [Avatar] @strategy_guide   45 min ago                 ││
│ │ "Anyone else notice the tier-2 bonus this week?"      ││
│ │ ❤️ 3    💬 [Reply]   [Copy link]  [⋯]               ││
│ │                                                        ││
│ │ [View 4 more comments...]                              ││
│ │                                                        ││
│ │ ─────────────────────────────────────────────────────│ ││
│ │ POST YOUR COMMENT:                                     ││
│ │ [Your Avatar]                                          ││
│ │ ┌─────────────────────────────────────────────────────┐││
│ │ │ What do you think? Great picks? Strategy questions? │││
│ │ │                                                     │││
│ │ │                                                     │││
│ │ │ 0 / 280 chars                            [Post]    │││
│ │ └─────────────────────────────────────────────────────┘││
│ │                                                        ││
│ └───────────────────────────────────────────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌────────────────────────┐
│ 🔙 Contest Detail      │
├────────────────────────┤
│ FREE WEEKLY CHAMP.     │
│ FREE | 50 SOL | 2,847  │
│ Ends: Sat 11:59 PM     │
│                        │
│ [Rules] [Leaderboard]  │ ← Tabs
│                        │
│ 1. @alex_trader        │
│    +245 pts            │
│                        │
│ 2. @defi_whale         │
│    +238 pts            │
│                        │
│ [Load more...]         │
│                        │
├────────────────────────┤
│ 💬 7 Comments          │ ← Tap to expand
│                        │
│ [Expanded Comments]    │
│ @vitalik_fan 2h ago    │
│ "Love @raydium's..."   │
│ ❤️ 12  [Reply]         │
│                        │
│ @defi_whale 1h ago     │
│ "Captain was key..."   │
│ ❤️ 8   [Reply]         │
│                        │
│ [View more...]         │
│                        │
├────────────────────────┤
│ Post a comment:        │
│ [Avatar]               │
│ ┌──────────────────────┐
│ │ What do you think?   │
│ │                      │
│ │ 0 / 280  [Post]      │
│ └──────────────────────┘
│                        │
└────────────────────────┘
```

---

## BUTTON STATES - UP CLOSE

### Follow Button Evolution

```
STATE 1: Not Following (Default)
┌──────────────────┐
│ + Follow         │  ← Cyan (#06B6D4)
│ (User+Plus icon) │  ← Normal weight
└──────────────────┘

STATE 2: Hovering (Desktop only)
┌──────────────────┐
│ + Follow         │  ← Brighter cyan
│                  │  ← Cursor pointer
└──────────────────┘
   [Tooltip: "Follow @username"]

STATE 3: Clicked / Loading
┌──────────────────┐
│ ⏳ Following...   │  ← Spinner icon
│                  │  ← Disabled (no pointer)
│                  │  ← Gray/muted text
└──────────────────┘

STATE 4: Success / Following
┌──────────────────┐
│ ✓ Following      │  ← Gold (#F59E0B)
│ (User+Check icon)│  ← Check mark visible
└──────────────────┘

STATE 5: Hover on Following (Unfollow prompt)
┌──────────────────┐
│ ✗ Unfollow?      │  ← Red text
│                  │  ← Gold border
└──────────────────┘
   [Tooltip: "Click to unfollow @username"]

STATE 6: Error / Retry
┌──────────────────┐
│ ! Try Again      │  ← Red border
│                  │  ← Red text
└──────────────────┘
   [Toast: "Failed to follow. Try again."]
```

### Like Button Evolution

```
STATE 1: Unliked
❤️ 234  ← Gray heart, gray count

STATE 2: Hover
❤️ 234  ← Brighten to cyan, cursor pointer
[Tooltip: "Like this team"]

STATE 3: Clicking / Animating
❤️ 235  ← Heart scales 1.0 → 1.15x → 1.0 (300ms)

STATE 4: Liked
❤️ 235  ← Gold heart, gold count
[Tooltip: "You liked this team"]

STATE 5: Already Liked (hover to unlike)
❤️ 235  ← Heart solid gold
[Tooltip: "Click to unlike this team"]

STATE 6: Error
❤️ 234  ← Gray again (unchanged)
[Toast: "Failed to like. Try again."]
```

---

## COMMENT INPUT BOX - LIFECYCLE

```
EMPTY (Default State)
┌──────────────────────────────────┐
│ [Avatar] What do you think?      │
│                                  │
│ 0 / 280 chars            [Post]  │ ← Disabled
└──────────────────────────────────┘

FOCUSED (User clicking in)
┌──────────────────────────────────┐
│ [Avatar] [Cursor blinking...]    │
│                                  │
│ 0 / 280 chars            [Post]  │ ← Still disabled
└──────────────────────────────────┘

TYPING (User entering text)
┌──────────────────────────────────┐
│ [Avatar] Great pick with @raydi  │
│ um, this is exactly why I...      │
│                                  │
│ 45 / 280 chars          [Post]   │ ← Enabled! Gold color
└──────────────────────────────────┘

TOO LONG (Exceeding 280 chars)
┌──────────────────────────────────┐
│ [Avatar] Great pick with @raydi  │
│ um, this is exactly why I picked  │
│ them because of the engagement... │
│                                  │
│ 290 / 280 chars (❌ 10 over)     │ ← Red error
│                         [Post]    │ ← Disabled again
└──────────────────────────────────┘

SUBMITTING (After clicking Post)
┌──────────────────────────────────┐
│ [Avatar] Great pick with @raydi  │
│                                  │
│ 45 / 280 chars    [⏳ Posting...]│ ← Loading state
│                                  │
└──────────────────────────────────┘

POSTED (Success)
┌──────────────────────────────────┐
│ [Avatar] @username  Just now      │
│ "Great pick with @raydium..."    │
│ ❤️ 0   💬 [Reply]   [⋯]          │ ← Your comment appears
│                                  │
│ [Avatar] What do you think?      │ ← Input clears
│ 0 / 280 chars            [Post]  │ ← Ready for next comment
└──────────────────────────────────┘

ERROR (Failed to post)
┌──────────────────────────────────┐
│ [Avatar] Great pick with @raydi  │
│                                  │
│ 45 / 280 chars          [Post]   │ ← Text preserved!
│ [Toast: ❌ Couldn't post. Try]    │
└──────────────────────────────────┘
```

---

## ACTIVITY FEED ITEM TYPES

```
RANK CHANGE
┌──────────────────────────────────┐
│ ✓ @alex_trader just ranked #1    │
│   ↑ 5 spots from #6 yesterday    │
│   2 minutes ago                  │
└──────────────────────────────────┘

LIKE
┌──────────────────────────────────┐
│ ❤️ 12 people liked @raydium's    │
│   team                           │
│   5 minutes ago                  │
└──────────────────────────────────┘

COMMENT
┌──────────────────────────────────┐
│ 💬 5 new comments on Free Weekly  │
│   Championship                   │
│   "Great picks everyone!"        │
│   8 minutes ago                  │
└──────────────────────────────────┘

FOLLOW
┌──────────────────────────────────┐
│ 👤 @new_friend started following  │
│   you                            │
│   12 minutes ago                 │
└──────────────────────────────────┘

MILESTONE
┌──────────────────────────────────┐
│ 🔥 @punk_3882 hit a 45-point     │
│   streak!                        │
│   15 minutes ago                 │
└──────────────────────────────────┘

ACTIVITY ALERT
┌──────────────────────────────────┐
│ 👁️ 1,247 players active right     │
│   now watching live scores       │
│   (updated every 30s)            │
└──────────────────────────────────┘
```

---

## RESPONSIVE BREAKPOINTS

```
Mobile (< 768px)
├─ Follow button: Full width below avatar
├─ Like button: Tap or swipe to reveal
├─ Comments: Collapsed section (tap to expand)
├─ Activity: Scrollable card (swipe more)
└─ Social counts: Inline (👥 1,240 | 👁️ 342)

Tablet (768px - 1024px)
├─ Follow button: Prominent, 2-col layout
├─ Leaderboard: Horizontal scroll if needed
├─ Comments: 2-col layout (comments + input)
└─ Activity: Grid layout (4 items per row)

Desktop (> 1024px)
├─ Full layouts as specified
├─ Hover states on all interactive elements
├─ Tooltips on icons/buttons
└─ Side-by-side layouts (leaderboard + profile)
```

---

**End of Wireframes**

These ASCII wireframes are meant to be **pixel-perfect references** for implementation. Every button placement, state, and interaction is shown exactly as it should appear in the final UI.

