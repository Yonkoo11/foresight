# FORESIGHT PRODUCT SPECIFICATION
## EXECUTIVE SUMMARY (2-Pager for Engineering)

**Status: LOCKED FOR IMPLEMENTATION** | **Deadline: Feb 27, 2026** | **Full spec: PRODUCT_SPECIFICATION_FINAL.md**

---

## WHAT ARE WE BUILDING?

**One-sentence pitch:**
Foresight is a skill-based fantasy sports game where users draft real Crypto Twitter influencers as teams, earn points from verified social engagement, and compete for ETH prizes powered by Solana's Tapestry Protocol.

**For Hackathon (Solana Graveyard):**
- **Problem:** Friend.tech died because speculation (buy/sell keys) replaced utility. SocialFi is the graveyard.
- **Solution:** We resurrect it with proven fantasy sports mechanics (daily fantasy = $100B TAM) + Tapestry identity layer (no spam, no Ponzi).
- **Why Solana:** Using Tapestry for identity verification + team storage (cross-app portability).

---

## THE 6 PAGES (ALL WE BUILD)

| Page | URL | Primary Action | Key Feature |
|------|-----|-----------------|-------------|
| **Home** | `/` | "Join Free Contest" | Show my team, current rank, upcoming contests |
| **Draft** | `/draft` | Submit team | Formation visual (Captain 1.5x + 4 tiers), 150pt budget |
| **Leaderboard** | `/leaderboard` | View live rankings | Real-time scores updating every hour, highlight "you are 47th" |
| **Contest Detail** | `/contest/:id` | View rules + timeline | Prize breakdown, scoring rules, lock time countdown |
| **CT Feed** | `/feed` | Browse tweets | Viral tweets from top 100 influencers + your team |
| **Profile** | `/profile` | View stats | Career stats, achievements, wallet connection |

**NO OTHER PAGES.** Delete: Intel, Quests, Referrals, Settings, LeagueUltra.

---

## GAME MECHANICS (LOCKED)

### Teams
- **Size:** 5 players
- **Captain:** 1 player with 1.5x multiplier (can be any tier)
- **Tiers:** 1 S-Tier (4 total) + 1 A-Tier (16 total) + 1 B-Tier (30 total) + 2 C-Tier (50 total)
- **Budget:** 150 draft points total (artificial scarcity)
- **Draft time:** 15 minutes to select all 5, or auto-draft
- **Prices:** S=45pt avg, A=30pt avg, B=20pt avg, C=12pt avg

### Scoring (Per-Player, Per-Week)
```
Activity (0-35):     tweets × 1.5
Engagement (0-60):   sqrt(likes + retweets×2 + replies×3) × 1.5 × volume
Growth (0-40):       followers_gained / 2000 + growth_rate% × 5
Viral (0-25):        10K-50K engagement = +4 pts, 50K-100K = +7, 100K+ = +12 (max 3 tweets)
Captain:             Base score × 1.5
Team Total:          Sum of all 5 players

Anti-Gaming:         30-day rolling average dampens outliers
```

### Contests
- **Duration:** Monday 12:00 UTC → Sunday 23:59 UTC (7 days)
- **Phases:** Open (5 days) → Locked (2 days) → Finalized
- **Scoring updates:** 4x daily (00:00, 06:00, 12:00, 18:00 UTC)
- **Leaderboard:** Live updates every 60 seconds on frontend
- **Free contests:** 50-10,000 players, no prizes (bragging rights only)
- **Paid contests:** 10-500 players, 15% rake, 85% payout to winners

---

## TECH DECISIONS (FINAL)

### Auth: Privy + Solana (NOT SIWE)
- ✓ Install: `pnpm add @privy-io/react-auth @privy-io/server-auth`
- ✓ Remove: `pnpm remove wagmi ethers`
- ✓ Frontend: `usePrivy()` hook
- ✓ Backend: Verify Privy JWT

### Blockchain: PostgreSQL now, Solana contracts post-launch
- ✓ Hackathon: All state in database (no on-chain yet)
- ✓ Phase 2: Smart contracts for prize escrow + claim verification
- ✓ Reason: Faster to ship, less risk

### Tapestry Integration: Identity + Team Storage
- ✓ Install: `pnpm add socialfi`
- ✓ Create: `backend/src/services/tapestryService.ts`
- ✓ At login: Resolve wallet → X handle (verified identity)
- ✓ At draft submit: Store team on Tapestry
- ✓ At contest end: Store score on Tapestry (immutable achievement)
- ✓ Benefit: Cross-app portability + "Solana-native" for judges

### Database Changes (2 migrations)
1. Add `tapestry_user_id` to users table
2. Add `contest_id` FK to draft_teams table (change unique constraint)

---

## BUILD TIMELINE (6 DAYS)

| Day | Focus | Deliverable |
|-----|-------|------------|
| **1** | Auth (Privy) + Tapestry setup | Users can sign in with Solana wallet |
| **2** | Draft page complete | Can build teams, see formation + budget |
| **3** | Leaderboard + contest lifecycle | Live rankings, automated state transitions |
| **4** | CT Feed + Contest detail + Tapestry storage | Feed works, teams stored on Tapestry |
| **5** | Profile page + admin seeding | All 6 pages complete, demo data seeded |
| **6** | Testing + video + launch prep | Live MVP ready, 3-min demo video |

---

## DEMO (3-MINUTE VIDEO)

**0:00-0:30: Problem** - Friend.tech failed, SocialFi is dead (show screenshots with X marks)
**0:30-2:15: Solution** - Show app: sign in → draft → leaderboard → feed → profile (4 screens, ~0:26 each)
**2:15-3:00: Impact** - Explain why Solana: Tapestry identity layer, score portability, smart contracts coming

---

## CRITICAL SUCCESS FACTORS

✓ **Working MVP** - All 6 pages load, no crashes
✓ **Real users** - 20+ signed up, 50+ contest entries, leaderboard populated
✓ **Live scoring** - Updates visible, at least 2 updates during demo
✓ **Solana integration** - Judge can verify Tapestry team storage
✓ **Demo video** - Coherent story, <3 minutes, uploaded to repo

---

## WHAT NOT TO BUILD (Scope Creep List)

❌ Referral system (post-MVP)
❌ Achievement badges/quests (post-MVP)
❌ Mobile app (web first)
❌ Multiple contests per week (1 free/week for MVP)
❌ Smart contracts (Phase 2)
❌ NFT team cards (post-MVP)
❌ Chat/social (post-MVP)
❌ Notifications (post-MVP)
❌ Analytics dashboard (post-MVP)

---

## FILE LOCATIONS (You'll Touch These)

**Frontend Pages to Update:**
```
frontend/src/pages/
  ├─ Home.tsx ✏️ (update landing)
  ├─ Draft.tsx ✏️ (enhance with formation)
  ├─ Leaderboard.tsx ✏️ (add live updates)
  ├─ ContestDetail.tsx ✓ (keep as-is)
  ├─ Feed.tsx ✏️ (update from existing CTFeed)
  └─ Profile.tsx ✏️ (add Tapestry)
```

**Backend Services to Update/Create:**
```
backend/src/
  ├─ services/
  │   ├─ tapestryService.ts (NEW)
  │   ├─ fantasyScoringService.ts ✓ (keep)
  │   └─ ctFeedService.ts ✏️ (add Tapestry metadata)
  ├─ utils/auth.ts ✏️ (SIWE → Privy)
  └─ api/admin.ts (NEW - seeding only, remove after)
```

**Migrations to Create:**
```
backend/migrations/
  ├─ 20250220_add_tapestry_fields.ts (NEW)
  └─ 20250220_update_draft_teams_schema.ts (NEW)
```

---

## ENVIRONMENT VARIABLES (New)

```env
# Privy Auth
VITE_PRIVY_APP_ID=<get from Privy dashboard>
PRIVY_SECRET_KEY=<get from Privy dashboard>

# Tapestry
TAPESTRY_API_KEY=<get from Tapestry dashboard>
TAPESTRY_BASE_URL=https://api.usetapestry.dev/v1
```

---

## HOW TO USE THIS DOCUMENT

1. **Print it** - Keep at your desk
2. **Reference during standup** - "We're on track for Day 2 (Draft page)"
3. **Check before coding** - "Is this feature in scope?"
4. **Ask for clarification NOW** - Before Day 1 starts
5. **Read full spec** (`PRODUCT_SPECIFICATION_FINAL.md`) before starting each component

---

## QUESTIONS? ASK BEFORE CODING

- Confused about scoring formula? Check Section 4.
- Not sure what Home should show? See Section 3, Page 1.
- What goes in database vs Tapestry? Section 8.
- How do I implement Privy auth? Section 10 (Tech Migration).
- What's the test data for demo? Section 12 (Demo Strategy).

**NO ASSUMPTIONS. ASK FIRST.**

---

**Document frozen:** Feb 20, 2026 | **Implementation starts:** Feb 20, 2026 | **Launch:** Feb 27, 2026

Full specification: [PRODUCT_SPECIFICATION_FINAL.md](PRODUCT_SPECIFICATION_FINAL.md)
