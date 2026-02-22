# Tapestry Feature Map — Visual Reference

> **Purpose:** Quick visual guide to where Tapestry features appear in the UI
> **Use during:** Design reviews, implementation, QA

---

## User Journey Timeline

```
DAY 1 (Signup & Draft)
═══════════════════════

[1] LANDING PAGE (/)
    ┌─────────────────────────────────────┐
    │ Formation Hero                      │
    │ "Start Playing" CTA                 │
    │                                     │
    │ [NEW] "Built on Tapestry" section   │
    │   • Teams Are Permanent             │
    │   • Scores Are Verifiable           │
    │   • Data Is Yours                   │
    └─────────────────────────────────────┘

    USER CLICKS "START PLAYING"
    ↓

[2] AUTH FLOW (Privy Modal)
    ┌─────────────────────────────────────┐
    │ "Continue with Google"              │
    │ "Continue with Twitter"             │
    │ "Or use Email"                      │
    │                                     │
    │ [TAPESTRY EVENT #1]                 │
    │ findOrCreateProfile() called        │
    └─────────────────────────────────────┘

    TOAST APPEARS:
    ┌─────────────────────────────────────┐
    │ ✓ Your Foresight identity on        │
    │   Tapestry is ready                 │
    │                                     │
    │ "Your profile is immutable and      │
    │  verifiable on Solana."             │
    └─────────────────────────────────────┘

    AUTO-REDIRECT
    ↓

[3] DRAFT PAGE (/draft)
    ┌─────────────────────────────────────┐
    │ Formation Visual                    │
    │   [Gold Captain]                    │
    │   [A-tier]  [A-tier]                │
    │   [B-tier]  [B-tier]                │
    │                                     │
    │ Budget: 95 / 150 pts                │
    │                                     │
    │ [SUBMIT BUTTON]                     │
    └─────────────────────────────────────┘

    USER CLICKS SUBMIT
    ↓

    [TAPESTRY EVENT #2]
    storeTeam() called
    ↓

    TOAST APPEARS:
    ┌─────────────────────────────────────┐
    │ ✓ Team Submitted Successfully       │
    │                                     │
    │ ✓ Published to Tapestry Protocol    │
    │ "Your team is immutable and         │
    │  verifiable on Solana's social      │
    │  graph."                            │
    │                                     │
    │ [View Profile] [View Leaderboard]   │
    └─────────────────────────────────────┘

    AUTO-REDIRECT TO LEADERBOARD
    ↓

[4] LEADERBOARD (/compete?tab=rankings)
    ┌──────────────────────────────────────────┐
    │ Rank │ Player      │ Score  │ Trend      │
    ├──────────────────────────────────────────┤
    │  1   │ @alice      │ 245 pt │ ↑ new     │
    │  2   │ @bob_trade  │ 220 pt │ ↓5        │
    │ ...                                      │
    │ 47   │ YOU [GOLD]  │ 0 pt   │ ↑ new    │
    │ ...                                      │
    └──────────────────────────────────────────┘

    [HOVER over any player]
    ↓

    POPOVER APPEARS:
    ┌──────────────────────────────┐
    │ @alice • 245 pts ↑2          │
    │ ✓ Published to Tapestry      │
    ├──────────────────────────────┤
    │  [Gold Captain: @vitalik]    │
    │  [A: @punk] [A: @deso]       │
    │  [B: @nans] [B: @0xfoobar]   │
    ├──────────────────────────────┤
    │ [View on Tapestry Explorer]  │ ← NEW
    │ Team stored on Tapestry      │
    └──────────────────────────────┘


DAY 7 (Contest Ends & Score Locks)
══════════════════════════════════════

[5] LEADERBOARD (After contest closes)
    ┌──────────────────────────────────────────┐
    │ Rank │ Player      │ Score  │ Trend      │
    ├──────────────────────────────────────────┤
    │  1   │ @alice      │ 318 pt │ Final      │
    │  12  │ YOU [GOLD]  │ 245 pt │ Final      │
    │ ...                                      │
    └──────────────────────────────────────────┘

    [TAPESTRY EVENT #3]
    storeScore() called
    ↓

    TOAST APPEARS:
    ┌──────────────────────────────────┐
    │ ✓ Score Locked on Tapestry       │
    │                                  │
    │ Your rank and points are         │
    │ permanently recorded on Solana.  │
    └──────────────────────────────────┘


[6] PROFILE PAGE (/profile)
    ┌─────────────────────────────────────┐
    │ OVERVIEW TAB                        │
    ├─────────────────────────────────────┤
    │                                     │
    │ [NEW] Tapestry Profile Badge        │
    │ ✓ Published to Tapestry Protocol    │
    │ ID: tapestry-profile-abc123         │
    │                                     │
    │ [NEW] Tapestry Social Stats         │
    │ 👥 Followers: 23 (on Tapestry)      │
    │ 👤 Following: 45 (on Tapestry)      │
    │                                     │
    ├─────────────────────────────────────┤
    │ TEAMS TAB                           │
    ├─────────────────────────────────────┤
    │                                     │
    │ Team: My Draft #6                   │
    │ Score: 245 pts | Rank: 12/2,847     │
    │ ✓ On Tapestry                       │
    │                                     │
    │ Formation:                          │
    │   [Gold Captain]                    │
    │   [A]... [A]                        │
    │   [B]... [B]                        │
    │                                     │
    │ [View on Tapestry Explorer] ← NEW   │
    │                                     │
    └─────────────────────────────────────┘
```

---

## Feature Placement Map

### HOME PAGE (/)

```
┌─────────────────────────────────────────────────┐
│ Header: Foresight                               │
│ Subheader: Fantasy sports for Crypto Twitter    │
├─────────────────────────────────────────────────┤
│                                                 │
│ [HERO SECTION]                                  │
│ Formation visual with "Start Playing" CTA       │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ [NEW] BUILT ON TAPESTRY SECTION ← SEE BELOW     │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ "How It Works"                                  │
│ • Pick 5 influencers                            │
│ • Earn points from their activity               │
│ • Win prizes on the leaderboard                 │
│                                                 │
└─────────────────────────────────────────────────┘

[NEW] BUILT ON TAPESTRY SECTION:
═══════════════════════════════

┌───────────────────────────────────────────────┐
│                                               │
│ Built on Tapestry                             │
│ ─────────────────────                         │
│                                               │
│ ┌──────────────┐  ┌──────────────┐           │
│ │ 🛡️  CARD 1   │  │ ✓  CARD 2    │           │
│ │              │  │              │           │
│ │ Teams Are    │  │ Scores Are   │           │
│ │ Permanent    │  │ Verifiable   │           │
│ │              │  │              │           │
│ │ Your draft   │  │ Every point  │           │
│ │ is stored on │  │ is locked    │           │
│ │ Solana. No   │  │ on-chain.    │           │
│ │ app can take │  │ Proof you    │           │
│ │ it away.     │  │ understand   │           │
│ │              │  │ CT better.   │           │
│ └──────────────┘  └──────────────┘           │
│                                               │
│      ┌──────────────────┐                     │
│      │ 🔗  CARD 3       │                     │
│      │                  │                     │
│      │ Data Is Yours    │                     │
│      │                  │                     │
│      │ Your profile     │                     │
│      │ works across     │                     │
│      │ Tapestry apps.   │                     │
│      │ Composability.   │                     │
│      └──────────────────┘                     │
│                                               │
└───────────────────────────────────────────────┘
```

---

### DRAFT PAGE (/draft)

```
┌──────────────────────────────────────────┐
│ DRAFT: Team Builder                      │
├──────────────────────────────────────────┤
│                                          │
│ Formation Visual                         │
│ Budget: 95 / 150 pts                     │
│                                          │
│     [Captain Gold]                       │
│    [A] ... [A]                           │
│    [B] ... [B]                           │
│                                          │
│ [Primary CTA] Lock & Submit              │
│                                          │
└──────────────────────────────────────────┘

AFTER SUBMIT → SUCCESS TOAST
═════════════════════════════

┌──────────────────────────────────────┐
│ ✓ Team Submitted Successfully        │
├──────────────────────────────────────┤
│                                      │
│ ✓ Published to Tapestry Protocol     │
│                                      │
│ "Your team is immutable and          │
│  verifiable on Solana's social       │
│  graph. Every score you earn will    │
│  be permanently recorded."           │
│                                      │
│ [View Your Profile]                  │
│ [View Leaderboard]                   │
│                                      │
└──────────────────────────────────────┘
```

---

### COMPETE PAGE (/compete?tab=rankings)

```
┌────────────────────────────────────────────────────┐
│ Rankings / Contests Tabs                           │
├────────────────────────────────────────────────────┤
│ [Rankings] [Contests]                              │
├────────────────────────────────────────────────────┤
│                                                    │
│ Rank │ Player    │ Score │ Status                 │
│ ────────────────────────────────────────────────  │
│  1   │ @alice    │ 245   │ ↑ new                 │
│  2   │ @bob_t    │ 220   │ ↓5                    │
│  ...                                              │
│ 47   │ YOU[GOLD] │ 0     │ ↑ new                 │
│                                                    │
│ [HOVER OVER ANY ENTRY]                            │
│           ↓                                        │
│                                                    │
│ ┌────────────────────────────────┐                │
│ │ @alice • 245 pts ↑2            │ ← POPOVER     │
│ │ ✓ Published to Tapestry        │               │
│ ├────────────────────────────────┤               │
│ │ Formation preview:             │               │
│ │   [Gold: @vitalik]             │               │
│ │   [A: @punk6529] [A: @deso]    │               │
│ │   [B: @nansen] [B: @0xfoobar]  │               │
│ ├────────────────────────────────┤               │
│ │ ✓ Team stored on Tapestry      │               │
│ │ [View on Tapestry Explorer] ←  │ NEW           │
│ └────────────────────────────────┘               │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

### PROFILE PAGE (/profile)

```
┌──────────────────────────────────────────────┐
│ PROFILE: @username                           │
│ [Overview] [Teams] [Watchlist] [Stats]       │
├──────────────────────────────────────────────┤
│                                              │
│ [OVERVIEW TAB — NEW SECTION]                 │
│ ╔══════════════════════════════════════╗    │
│ ║ Tapestry Profile                     ║    │
│ ║ ✓ Published to Tapestry Protocol     ║    │
│ ║ ID: tapestry-id-abc123              ║    │
│ ║                                      ║    │
│ ║ Tapestry Social Stats                ║    │
│ ║ 👥 Followers: 23 (on Tapestry)       ║    │
│ ║ 👤 Following: 45 (on Tapestry)       ║    │
│ ║                                      ║    │
│ ║ Foresight Score: 847 (Gold Tier)     ║    │
│ ╚══════════════════════════════════════╝    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│ [TEAMS TAB — UPDATED WITH TAPESTRY BADGES]  │
│                                              │
│ Team: My Draft #6                            │
│ Score: 245 pts | Rank: 12/2,847              │
│ ✓ On Tapestry ← NEW BADGE                    │
│                                              │
│ Formation:                                   │
│   [Gold Captain: @vitalik]                   │
│   [A: @punk] [A: @deso]                      │
│   [B: @nans] [B: @0xfoobar]                  │
│                                              │
│ [View on Tapestry Explorer] ← NEW LINK       │
│  (opens: https://explorer.usetapestry...     │
│                                              │
├──────────────────────────────────────────────┤
│ [WATCHLIST TAB]                              │
│ (unchanged)                                  │
├──────────────────────────────────────────────┤
│ [STATS TAB]                                  │
│ (unchanged)                                  │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Feature Checklist by Page

### HOME PAGE (/)
- [ ] Add "Built on Tapestry" section below hero
- [ ] 3 feature cards: Teams, Scores, Data
- [ ] No crypto jargon
- [ ] Responsive on mobile

### DRAFT PAGE (/draft)
- [ ] Success toast shows "Published to Tapestry"
- [ ] Messaging includes immutability statement
- [ ] Auto-redirect to leaderboard
- [ ] No console errors

### COMPETE PAGE (/compete)
- [ ] Leaderboard entry shows Tapestry badge on hover
- [ ] Popover shows team formation
- [ ] "View on Tapestry Explorer" link working
- [ ] Link format: `https://explorer.usetapestry.dev/content/foresight-team-{userId}-{contestId}`

### PROFILE PAGE (/profile)
- [ ] Overview tab: Tapestry profile badge + ID
- [ ] Overview tab: Social counts (followers/following)
- [ ] Teams tab: "✓ On Tapestry" badge on each team
- [ ] Teams tab: Formation preview for each team
- [ ] Teams tab: "View on Tapestry Explorer" link
- [ ] Link format: `https://explorer.usetapestry.dev/content/foresight-team-{userId}-{contestId}`

---

## Design Tokens (Tapestry Elements)

### Colors
- **Badges:** Gold (#F59E0B) for "✓" marks
- **Links:** Cyan (#06B6D4) for explorer links
- **Background:** Gradient gold/10 with border gold/30

### Typography
- **Badge text:** Text-gold-400, text-sm
- **Link text:** Text-gold-500, hover:text-gold-400
- **Toast title:** Font-semibold, text-green-400

### Icons
- **Check/Checkmark:** CheckCircle from @phosphor-icons/react
- **External link:** ArrowUpRight or CaretRight
- **Profile:** UserCircle

---

## API Integration Points

### Tapestry API Calls

```
1. Auth Flow
   └─ findOrCreateProfile(walletAddress, username)
      └─ Called in: backend auth.ts after Privy login
      └─ Toast: "✓ Your Foresight identity on Tapestry is ready"

2. Team Submission
   └─ storeTeam(profileId, userId, teamData)
      └─ Called in: backend prizedContestsV2.ts on entry creation
      └─ Toast: "✓ Published to Tapestry Protocol"

3. Score Finalization
   └─ storeScore(profileId, userId, scoreData)
      └─ Called in: backend contestFinalizationService.ts
      └─ Toast: "✓ Score locked on Tapestry"

4. Profile Content Fetch (NEW)
   └─ GET /api/tapestry/content?profileId={id}
      └─ Frontend: Profile page Teams tab
      └─ Returns: Array of teams stored on Tapestry

5. Social Counts (NEW)
   └─ GET /api/tapestry/social-counts?profileId={id}
      └─ Frontend: Profile page Overview tab
      └─ Returns: { followers: N, following: N }
```

---

## Timeline & Dependencies

```
FEB 22 (TODAY)
├─ ✓ Product strategy complete
├─ ✓ Implementation checklist ready
└─ ✓ This feature map ready

FEB 23-24
├─ [ ] Implement all 7 MVP features (6 hours)
├─ [ ] End-to-end test (1 hour)
├─ [ ] Polish & mobile QA (1 hour)
└─ [ ] Record demo video (1 hour)

FEB 25-26
├─ [ ] Deploy to production
├─ [ ] Final QA
└─ [ ] Prepare submission

FEB 27
└─ [ ] Submit before 11:59 PM UTC
```

---

## Success Criteria

By Feb 27, judges should be able to:

1. ✓ Sign up and see "Tapestry identity ready" message
2. ✓ Draft a team and see "Published to Tapestry" confirmation
3. ✓ Reload page and team is still visible in Profile
4. ✓ Hover leaderboard entry and see "✓ On Tapestry" badge
5. ✓ Click "View on Tapestry Explorer"
6. ✓ Actual Tapestry explorer opens with team data
7. ✓ Understand why Tapestry matters (composability)

**All 7 criteria must be met for "wow moment."**

---

*Last updated: February 22, 2026*
