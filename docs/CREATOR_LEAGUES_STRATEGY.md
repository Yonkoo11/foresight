# Creator Leagues — Product Strategy

> **Status:** PRODUCT STRATEGY (Feb 27, 2026)
> **Audience:** Product, Engineering, Hackathon Judges
> **Deadline:** Feb 27, 2026 (Graveyard Hackathon)
> **MVP Scope:** Showable prototype with "Coming Soon" teaser for judge feedback

---

## Executive Summary

**The Opportunity:**
Foresight currently creates all contests. The next evolution is letting creators (influencers, brands, DAOs, power users) launch their own branded contests on our platform. They fund the prize, we run the scoring and leaderboard. Foresight takes a rake.

**Why This Matters:**
1. **Viral loop** — When @Pomp creates "Pomp's Weekly Draft," his 100K followers see it. A fraction enter. Foresight gains discovery through creator channels.
2. **Revenue without friction** — Rake on creator-funded prizes, not just user entry fees. Creator covers marketing cost.
3. **Network effect** — More creators = more contests = more reasons to check the app = more habit formation.
4. **Narrative for judges** — "Foresight is infrastructure for CT social gaming" (not just another contest app).

**MVP Ship Date:** Feb 27 (today)
**Full Implementation:** March 2026 (post-hackathon)

---

## 1. The Vision: Why This is Powerful

### 1.1 Creator Incentives

**For Influencers** (primary target):
- **Audience Activation:** Gives followers a reason to interact with you beyond scrolling. "Join my draft contest" = engagement hook.
- **Brand Loyalty:** Contest = branded experience. "Pomp's Weekly Draft" feels like his platform.
- **Prize Credibility:** Showing you're willing to put your own money behind it signals confidence and wealth.
- **Social Proof:** Leaderboard with your name as creator = credibility signal. "100K followers entered this contest."

**For Brands/DAOs:**
- **Community Activation:** "Research League" for your members. Drives internal engagement.
- **Content Marketing:** Contest announcements drive social media content (not spam, it's utility).
- **Sponsorship Opportunities:** "This contest brought to you by..." sponsorship slots.

**For Power Users:**
- **Streamer/Podcast Vibes:** Build a micro-community around your league. "High-roller drafters only."
- **Affiliate Feel:** Not like running an exchange, but like curating an experience.

### 1.2 Foresight Growth Flywheel

```
Creator launches league
    ↓
Creator promotes to followers
    ↓
Followers discover Foresight
    ↓
Small % become repeat users
    ↓
Repeat users enter future creator leagues + Foresight contests
    ↓
Revenue compounds (rake on both)
    ↓
More creators want to launch leagues (social proof)
    ↓
Positive flywheel
```

**Metrics That Matter:**
- **New user acquisition cost:** Low (creator does marketing for us).
- **Lifetime value:** Medium (one-time league entrants + a % who stay).
- **Rake per contest:** 10% of all entry fees (whether creator-funded or player-funded).

### 1.3 Competitive Positioning

- **DraftKings:** Can't do this (centralized, NBA-focused).
- **FanDuel:** Can't do this (traditional, not creator-first).
- **Friend.tech:** Tried this but died (speculation vs. utility).
- **Foresight:** First to combine **verified social identity (Tapestry) + creator-owned contests + social gaming utilities**.

This is **infrastructure play**, not just another contest app.

---

## 2. Creator Journey: How Does a Creator Set This Up?

### 2.1 Discovery & Onboarding

**Where Creators Find Us:**
- Foresight app: Button on their profile or dedicated "Create League" page (Phase 2).
- Twitter/X: Share from finished contest leaderboard ("Create your own league").
- Community: Word of mouth, early influencers evangelize.

**Onboarding Flow (Mobile-First):**
```
[Log in with Solana wallet]
    ↓
[See "Create Your Own League" CTA on home or compete page]
    ↓
[Modal/page opens: "Create a Contest"]
    ├─ League Name: "Pomp's Weekly Draft" (prefill with @username)
    ├─ Description: Multi-line, 300 chars
    ├─ Prize Amount: 0.5 SOL (SOL only, for now)
    ├─ Entry Requirements: [Open to all] [Followers only*] [Allowlist*]
    ├─ Entry Fee: [Free] [0.01 SOL] [0.05 SOL] [Custom*]
    ├─ Duration: [7 days] [30 days] [Custom week*]
    ├─ Banner/thumbnail: Auto-generate from Twitter avatar + name (Phase 2)
    └─ [Create] button
    ↓
[System validates: "You have 0.5 SOL in your wallet?"]
    ↓
[Escrow created on Solana, funds locked]
    ↓
[Contest goes live on Foresight]
    ↓
[Creator gets shareable link + Twitter template]
```

\* = Phase 2 features (post-hackathon)

### 2.2 What Creators Control (MVP)

**Locked In (Platform Standard):**
- Team size: 5 players (match Foresight standard)
- Captain: 1 captain + 4 slots (match Foresight standard)
- Influencer pool: Top 100 (same as Foresight)
- Scoring rules: Activity + Engagement + Growth + Viral (same)
- Scoring cadence: Real-time, 4x daily updates (same)
- Duration: Exactly 7 days (Monday-Sunday, UTC) OR 24 hours (daily)

**Customizable (MVP):**
- Contest name
- Description (copy + emoji)
- Prize amount (0.05-10 SOL, Solana-only)
- Entry fee (0 SOL = free; other amounts require multi-sig or escrow approval — see Trust & Safety)

**Customizable (Phase 2):**
- Duration (custom weeks, bi-weekly, monthly)
- Entry requirements (followers only, whitelist, token-gated)
- Prize distribution (winner-take-all, top-3, top-5, leaderboard rake)
- Banner image (upload or auto-generate)
- Prize type (SOL, tokens, NFTs — with Tapestry escrow)

### 2.3 Creator Dashboard (Phase 2)

Once a creator has launched 1+ leagues:
```
[Creator Dashboard]
├─ Active Leagues
│  ├─ [Pomp's Weekly Draft — 237 players — 2 days left]
│  │  └─ [Share] [View Leaderboard] [Cancel*]
│  └─ ...
├─ Past Leagues
│  ├─ [Pomp's Original Draft — 412 players — FINALIZED]
│  │  └─ Prize Distributed: 0.45 SOL | Rake Paid: 0.05 SOL
│  └─ ...
├─ Stats Card
│  ├─ Total Contests: 3
│  ├─ Total Entrants: 1,200
│  ├─ Avg Player Rating: 4.7/5
│  └─ Total Prizes Distributed: 1.50 SOL
└─ [Create New League] button
```

---

## 3. Player Experience: What's Different?

### 3.1 Discovery: "Signature Leagues" Section

**On `/compete` page:**

**Option A: Horizontal Carousel (Current MVP)**
```
┌────────────────────────────────────────────────────────┐
│ Signature Leagues                                       │
├────────────────────────────────────────────────────────┤
│ [CZ's Champions League ▶]  [Pomp's Weekly Draft ▶]     │
│  Free | 412 players        Free | 98 players          │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Option B: Dedicated Grid (Phase 2)**
```
┌──────────────────────────────────────────────────────┐
│ SIGNATURE LEAGUES FROM TOP CT CREATORS                │
├──────────────────────────────────────────────────────┤
│ ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│ │ CZ's        │  │ Pomp's      │  │ TA's Picks  │    │
│ │ Champions   │  │ Weekly      │  │ Survivor    │    │
│ │ Free        │  │ Draft       │  │ League      │    │
│ │ 412 players │  │ Free        │  │ 0.1 SOL     │    │
│ │ [Join]      │  │ 98 players  │  │ 87 players  │    │
│ │             │  │ [Join]      │  │ [Join]      │    │
│ └─────────────┘  └─────────────┘  └─────────────┘    │
└──────────────────────────────────────────────────────┘
```

### 3.2 Contest Detail Card

**Shows Creator Attribution:**

```
┌─────────────────────────────────────────────────┐
│ Pomp's Weekly Draft                             │
├─────────────────────────────────────────────────┤
│ 👤 @APompliano  (123.5K followers)              │
│ Created by: Anthony Pompliano                   │
│                                                 │
│ "Draft the best CT thinkers and compete        │
│  against other Pomp fans. Winner gets 0.5 SOL" │
│                                                 │
│ Status: Open | 98/unlimited players | 2d left  │
│ Entry: Free | Prize: 0.5 SOL                    │
│                                                 │
│ [Join Contest]                                  │
└─────────────────────────────────────────────────┘
```

### 3.3 Leaderboard Badge

**Shows Creator Attribution on Each Row:**

```
Rank  Player           Score  Creator League
────────────────────────────────────────────
1.    CZ_Maxi          198   🎯 Pomp's Draft
2.    BNB_King         185   🎯 Pomp's Draft
3.    WebThreeWatcher  172   🎯 Pomp's Draft
```

Or just a gold/cyan badge next to contest name:
```
"Pomp's Weekly Draft" [CREATOR LEAGUE] or [GOLD STAR]
```

### 3.4 Share Card

**When Winner Shares Their Win:**

```
[ShareTeamCard.tsx generates]

🏆 I PLACED #3 IN POMP'S WEEKLY DRAFT

[Team visual: Captain | 4 slots]

Score: 187 pts | Prize: $12 SOL

Powered by Foresight
vs. @APompliano's 412-player league

[Join] [Share]
```

---

## 4. Revenue Model

### 4.1 How Foresight Makes Money

**Current Contest Revenue:**
- Entry fees from players → Prize pool
- Foresight takes 10% rake off entry fees
- Example: 100 players × 0.01 SOL = 1 SOL pool → Foresight gets 0.1 SOL

**Creator League Revenue:**
- Creator pre-funds prize (0.05-10 SOL)
- Players enter for free OR pay entry fee (creator decides)
- Foresight **still takes 10% rake off any entry fees players pay**
- **NEW: Foresight could take 5% rake off creator prize as "platform fee"** (optional, Phase 2)

**Example Economics:**

Scenario A: Free creator league, creator pre-funds prize
```
Creator: "Free to enter, I'm funding 1 SOL prize"
→ 200 players enter (free)
→ Foresight rake: $0 (no entry fees)
→ Foresight value: Discovery + marketing for future paid leagues
```

Scenario B: Paid creator league
```
Creator: "0.05 SOL entry fee, 0.5 SOL prize pool" (covers ~90 entries)
→ 150 players enter (0.05 each = 7.5 SOL collected)
→ Prize pool: Creator's 0.5 + players' 7.5 = 8 SOL
→ Foresight rake: 10% of 7.5 SOL player fees = **0.75 SOL**
→ Foresight value: Revenue + user acquisition
```

Scenario C: Creator premium tier (Phase 2)
```
Creator pays $99/month "Creator Tier" → Can run unlimited leagues
→ Benefits: Custom branding, followers-only, token-gated, API access
→ Foresight revenue: Recurring subscription + rake on contests
```

### 4.2 Competitive Pricing

**Reference:**
- Twitch affiliates: 50/50 split on subs (Twitch's cut)
- YouTube: 55/45 (platform/creator)
- DraftKings: 10-15% rake (industry standard daily fantasy)

**Foresight positioning:**
- **10% rake** (same as regular contests, creator-friendly)
- **Optional 5% "platform fee"** (Phase 2, for premium features)
- **Creator premium tier** (Phase 2, recurring revenue)

This is **competitive and fair** for creators while **highly profitable at scale**.

---

## 5. Trust & Safety: Prize Escrow & Risk Management

### 5.1 The Problem

**Risk:**
- Creator launches league with 1 SOL prize, gets 1000 entrants, disappears.
- Creator doesn't have funds to cover promised prize.
- Players get scammed, Foresight gets blamed.

**Solution:** **Mandatory Prize Escrow on Solana**

### 5.2 Escrow Flow (Hackathon Minimum)

```
Creator clicks [Create League]
    ↓
[Modal: "Fund Your Prize"]
├─ Amount: 0.5 SOL
├─ [Send to Escrow Address]
    ↓
Creator signs Solana transaction
    ↓
Foresight receives 0.5 SOL in escrow wallet
    ↓
System confirms: "Prize locked. Contest is live."
    ↓
[7 days pass, contest ends]
    ↓
Scoring finalizes
    ↓
Winner/top-X automatically paid from escrow
    ↓
Foresight rake collected
    ↓
Any leftover goes back to creator
```

**Implementation:**
- Create multi-sig Solana wallet (Foresight + creator can both approve release)
- Or use Solana Program Library `Token` contract for automatic escrow
- Or use Tapestry Protocol's escrow feature (if available; Phase 2)

**For MVP:** Simple centralized wallet, creator signs tx, we hold funds.

### 5.3 Edge Cases & Safeguards

**What if contest gets <5 players?**
- Foresight can cancel, refund creator's escrow, no rake taken.
- Creator decides: Extend deadline or cancel.

**What if creator wants to cancel mid-contest?**
- **Can't cancel** if contest is locked (players have entered).
- If <5 players, creator can cancel anytime.
- Refund goes back to escrow wallet → creator can withdraw.

**What if there's a dispute about scores?**
- Foresight arbitrates (same as today's contests).
- Scoring is deterministic (Twitter API data), not subjective.
- Creator can't change rules mid-contest.

**What if creator's wallet is compromised?**
- Escrow is separate from creator's wallet.
- Foresight holds funds, not creator.
- Only Foresight can release prizes (or multi-sig with creator).

---

## 6. Technical Requirements: What Changes?

### 6.1 Database Schema (Minimal Changes)

**Already exists (from Feb 25 migration):**
```sql
prized_contests:
  - is_signature_league (boolean)
  - creator_handle (string)
  - creator_avatar_url (string)
  - creator_follower_count (integer)
```

**New columns (MVP):**
```sql
prized_contests:
  + creator_id (uuid, FK to users)
  + creator_wallet (string, 42 chars)
  + prize_escrow_address (string, 42 chars) -- Solana wallet
  + prize_amount (decimal 18,8)
  + entry_fee (decimal 18,8) -- 0 for free
  + has_entry_fee (boolean)
  + escrow_tx_hash (string, 66) -- Proof of funding
  + max_players (integer)
  + allow_followers_only (boolean) -- Phase 2
  + allow_whitelist (boolean) -- Phase 2
```

**No schema removed.** Everything backward-compatible.

### 6.2 API Endpoints (New/Modified)

**New Endpoints:**

```typescript
POST /api/v2/creator-leagues/create
├─ Auth: Required
├─ Body:
│  ├─ name (string, 50-100 chars)
│  ├─ description (string, 0-300 chars)
│  ├─ prize_amount (decimal, 0.05-10)
│  ├─ entry_fee (decimal, 0-1)
│  ├─ duration (enum: 'week' | 'day') -- 'week' = 7 days
│  └─ max_players (integer, 0 = unlimited)
└─ Response: { contest_id, escrow_address, escrow_tx_url }

POST /api/v2/creator-leagues/:id/confirm-escrow
├─ Auth: Required
├─ Body: { escrow_tx_hash }
└─ Response: { contest_id, status: 'funded', live_at: timestamp }

GET /api/v2/creator-leagues
├─ Auth: Optional
├─ Response: [{ id, name, creator_handle, status, players, prize, ... }]

GET /api/v2/creator-leagues/:id/stats
├─ Auth: Optional (creator sees full stats)
└─ Response: { entrants, winner, prize_distributed, rake, ... }
```

**Modified Endpoints:**

```typescript
GET /api/v2/contests
  // Add filter: ?is_signature_league=true
  // Add fields: creator_handle, creator_avatar_url, is_signature_league

GET /api/v2/contests/:id
  // Add fields: creator_handle, creator_avatar_url, creator_wallet, prize_amount
```

### 6.3 Frontend Components (New)

**New Component Files:**

```
frontend/src/components/
├─ CreateLeagueModal.tsx (form to create league)
├─ CreatorLeagueCard.tsx (displayed in Compete page)
├─ CreatorLeagueDetail.tsx (contest detail modal)
├─ EscrowConfirmation.tsx (approve Solana tx)
└─ CreatorDashboard.tsx (Phase 2)

frontend/src/pages/
├─ CreateLeague.tsx (full page, if modal too cramped)
└─ CreatorDashboard.tsx (Phase 2)
```

**Modified Component Files:**

```
frontend/src/pages/Compete.tsx
  // Add "Signature Leagues" carousel section
  // Add filter toggle to show/hide creator leagues

frontend/src/components/ContestDetailCard.tsx
  // Show creator attribution (avatar + name)
  // Show escrow status if applicable
```

### 6.4 Backend Services (New)

```
backend/src/services/
├─ creatorLeagueService.ts (CRUD + validation)
├─ escrowService.ts (Solana interaction)
└─ creatorStatsService.ts (Creator dashboard stats)

backend/src/api/
└─ creatorLeagues.ts (Route handlers)
```

### 6.5 No Smart Contract Changes

- **If using Tapestry:** Store league metadata + winner info on Tapestry (Phase 2).
- **If using centralized escrow:** Solana CLI/SDK calls, no contract.
- **Verdict for MVP:** Centralized escrow (Foresight wallet), later migrate to Tapestry.

---

## 7. MVP Scope: What Ships Now vs. Later

### 7.1 MVP (Launch Today, Feb 27)

**For Hackathon Judges:**

**Shipped:**
- ✅ `is_signature_league` + `creator_handle` columns (already exist)
- ✅ CZ's Champions League demo (already seeded)
- ✅ "Signature Leagues" carousel on Compete page (already visible)
- ✅ Creator attribution in contest cards

**New (Add Today):**
- ✅ "Coming Soon: Create Your Own League" CTA on Compete page
- ✅ Landing page / modal preview (shows wireframe, collects email interest)
- ✅ Simple database schema expansion (creator_id, prize_amount, escrow_address)
- ✅ Prototype create-league form (doesn't actually create, shows flow)
- ✅ Escrow confirmation screen (mockup, shows Solana tx prompt)
- ✅ Documentation: This strategy + technical spec

**Why "Coming Soon" Instead of Full Build?**
1. **Time:** Full escrow + Solana integration = 8-10 hours. Judges see vision faster with prototype.
2. **Risk:** Solana mainnet integration in last hours = risky. Better to show intent.
3. **Feedback:** Judges see wireframes, give feedback, we iterate post-hackathon.
4. **Narrative:** "This is our Phase 2 roadmap" → judges appreciate transparency.

### 7.2 Phase 2 (March 2026, Post-Hackathon)

**Full Implementation:**
- [ ] Solana escrow integration (real transactions)
- [ ] Create-league form (full UX, no mocks)
- [ ] Prize distribution automation (winners paid automatically)
- [ ] Creator dashboard (stats, analytics, past leagues)
- [ ] Email validation + interest waitlist
- [ ] Custom branding (banners, thumbnails)
- [ ] Entry requirements (followers-only, whitelist)
- [ ] Token prizes (integration with Tapestry or DEX)
- [ ] Creator tier / subscription model
- [ ] Creator support docs + Twitter thread templates

### 7.3 Why This Phasing Makes Sense

**For Judges:**
- They see the **vision** (Creator Leagues = network effect flywheel).
- They see the **architecture** (How does escrow work? What changes? What doesn't?).
- They understand **risk mitigation** (We're not shipping broken Solana code at deadline).

**For Foresight:**
- We ship **showable prototype** today.
- We get **judge feedback** during hackathon (live Q&A).
- We have a **clear roadmap** for post-launch (full build by March 1).
- We don't **compromise core product** (contests, scoring) for half-baked social feature.

---

## 8. The "Coming Soon" Teaser: What to Show on the Page RIGHT NOW

### 8.1 Placement on Compete Page

**After "Signature Leagues" carousel:**

```
┌────────────────────────────────────────────────────────┐
│ READY TO START YOUR OWN LEAGUE?                        │
├────────────────────────────────────────────────────────┤
│                                                         │
│ Influencers, brands, and power users can now launch   │
│ their own Foresight contests with custom prizes.       │
│                                                         │
│ 🎯 Full control: Set your prize, description, entry   │
│ 💰 Revenue share: We rake 10%, you keep the rest      │
│ 🌐 Built on Tapestry: Teams and scores on Solana      │
│                                                         │
│ [Sign Up for Early Access] [Watch Demo] [Docs]         │
│                                                         │
└────────────────────────────────────────────────────────┘
```

### 8.2 Email Waitlist (Phase 2)

**Form collects:**
- Email
- Twitter handle (optional, to auto-fill creator info)
- What you'd want to run (free/paid, prize amount)

**Confirmation email:**
```
Subject: You're #47 on the Creator League waitlist

Hey @APompliano,

You're in line to launch your first Foresight league!
We'll send you early access (March 2026) and a guide
to set up your contest.

In the meantime:
- View CZ's Champions League (live demo)
- Read the full spec: /docs/creator-leagues
- Join Discord for updates: [link]

See you soon,
Foresight Team
```

### 8.3 Copy Strategy

**Headline:** "Turn Your Followers Into Competitors"

**Subheading:** "Launch your own Foresight league. Set the prize. Invite your audience. Watch them compete."

**Value Props (Bullet Points):**
- 💰 Fund your own prize pool (0.05 - 10 SOL)
- 🎯 Full control over contest rules (name, entry fee, duration)
- 🏆 Escrow-protected prizes (we hold the funds)
- 📊 Real-time leaderboard + winner payouts
- 🔗 Built on Tapestry (teams stored on-chain)
- 📱 White-label branded contest (comes to your followers)

**CTA Button:** "Join Creator Waitlist" (not "Pre-order", not "Request Access")

**Why "waitlist" resonates:**
- Implies exclusivity (influencers want to feel special).
- Implies iterative launches (not all-or-nothing).
- Implies judge feedback will shape it (transparent).

### 8.4 Demo Video Script (Phase 2)

**45-second video showing:**
1. 0:00-0:10 — Influencer in Foresight app, sees "Create League" button
2. 0:10-0:20 — Flow: Enter league name, prize amount, escrow funding
3. 0:20-0:30 — Contest goes live, followers see it on Foresight
4. 0:30-0:40 — Live leaderboard updating, creator sees analytics
5. 0:40-0:45 — Winner celebration + prize distributed, creator gets rake cut

**Tagline:** "Tap your audience. Create a league. Build community."

---

## 9. Phase 2 Ideas: The Roadmap Beyond Hackathon

### 9.1 Token Prizes

**The Vision:**
"Your community's token is the prize. Creators can fund with any SPL token."

**Example:**
```
Creator: "Enter my league for 0.05 SOL, win 10,000 ABC tokens"
→ Creator pre-funds in ABC
→ Winners get ABC automatically
→ Tokenomics: Creator gets distribution, Foresight gets SOL rake
```

**Integration:** Tapestry Protocol's token escrow (if available) or Serum DEX.

### 9.2 Leaderboard Widgets (Embeddable)

**The Vision:**
"Creators can embed their league leaderboard on their website, Substack, Discord."

**Example:**
```html
<iframe
  src="foresight.io/embed/league/pomp-weekly"
  width="500"
  height="600">
</iframe>
```

Shows:
- Live leaderboard (real-time)
- [Join] button (opens Foresight in new tab)
- Creator branding (logo, avatar, description)

**Use Case:** Newsletter, personal website, Discord server.

### 9.3 Creator Tier / Premium Subscription

**The Vision:**
"Creators pay $99/mo for unlimited leagues + custom branding + analytics."

**Features:**
- Unlimited league launches (free tier = 1 league/week)
- Custom banners, thumbnails, colors
- Followers-only entry (token-gated)
- Advanced analytics (player retention, engagement, etc.)
- Creator API access (programmatic league creation)
- Priority support

**Revenue:** $99 × 100 creators = $9,900/mo (recurring).

### 9.4 Sponsor Integrations

**The Vision:**
"Crypto brands can sponsor creator leagues, place ads, get data."

**Example:**
```
Creator: "This league is brought to you by Blur"
→ Blur logo on contest card + leaderboard
→ Blur pays Foresight $500
→ Blur gets access to player data (aggregate, anonymized)
→ Players see "Sponsored by Blur" (credibility)
```

**Revenue Model:** Sponsorship marketplace (Phase 2).

### 9.5 League Templates / Franchise System

**The Vision:**
"Foresight provides templates. Creators fork them, add their branding."

**Example:**
```
[Template] → CZ's Champions League
[Fork 1] → Pomp's Weekly Draft (same rules, Pomp's branding)
[Fork 2] → TA's Survivor League (same rules, TA's branding)
```

**Benefit:** Standardized player experience, easier scaling.

---

## 10. Failure Modes & Risk Mitigation

### 10.1 Risk: Creator Funds Escrow But Contest Never Starts

**Scenario:** Creator sends 0.5 SOL to escrow, but then the contest doesn't launch (bug, user changes mind).

**Mitigation:**
- Confirmation step: "You have 24h to finalize. After that, auto-refund." (Phase 2)
- Contact support: Foresight can manually refund.
- Transaction is reversible for first 24 hours (Solana tx memo or custom program).

### 10.2 Risk: Creator Disappears After Contest Starts

**Scenario:** 500 players enter, creator vanishes mid-contest.

**Mitigation:**
- Escrow is Foresight-held, not creator-held.
- We distribute prizes automatically (no creator action needed).
- Creator can't withdraw their share until contest finalizes.
- Legal ToS: "Creator agrees to fund prizes in full before launch."

### 10.3 Risk: Scoring Dispute

**Scenario:** Creator claims "Twitter API is wrong, my player should be #1."

**Mitigation:**
- Scoring is deterministic (Twitter API data is the truth).
- ToS: "Scores are final 24h after contest ends."
- Creator can't change rules mid-contest.
- Foresight arbitrates (not creator).

### 10.4 Risk: Creator Runs Scam League

**Scenario:** Creator: "Join my league, I'm giving away 10 SOL" (but never funds escrow).

**Mitigation:**
- Escrow **must be funded before contest goes live**.
- Front-end validation: "No escrow tx? Can't launch."
- Foresight can blacklist creators who violate ToS.
- Reputation system (Phase 2): Low-rated creators can't launch.

### 10.5 Risk: Low Adoption ("Nobody Creates Leagues")

**Scenario:** 3 months in, only 2 creators have launched leagues.

**Mitigation:**
- Pre-launch influencer outreach: DM top 20 CT creators with beta access.
- Incentive: "First 10 leagues get 0% rake, share of referral fees."
- Foresight partners with 2-3 major influencers (CZ, Pomp, etc.) to launch day-1.
- Community: "Run a league, get featured in newsletter."

---

## 11. Success Metrics & KPIs

### 11.1 Launch Metrics (MVP)

**For Judges to See:**
- ✅ "Coming Soon" landing page created (email collection)
- ✅ 50+ signups for early access waitlist (from demo/presentation)
- ✅ Database schema designed and documented
- ✅ API endpoints stubbed out (non-functional, but defined)
- ✅ Prototype UX mockups / Figma design
- ✅ Technical spec written (this document)

### 11.2 Phase 2 Metrics (March 2026)

**By End of March:**
- 5+ creators have launched leagues
- 500+ total entrants across creator leagues
- 0.5 SOL+ in Foresight rake revenue (from creator league entry fees)
- 10%+ of monthly active users have played in a creator league

### 11.3 Long-Term Metrics (2026)

**By Year-End:**
- 50+ active creators running leagues
- 10K+ monthly active users in creator leagues
- 50+ SOL in annual rake revenue (creator leagues)
- Creator league = 30% of platform engagement (vs. 70% Foresight official contests)

---

## 12. Implementation Timeline

### Phase 1: MVP (Feb 27 - Mar 1, 2026)

**Today (Feb 27) - Hackathon Submission:**
- [ ] Landing page / "Coming Soon" UI on Compete page
- [ ] Email waitlist form (collects creator interest)
- [ ] Prototype create-league form (wireframe + interaction)
- [ ] Escrow flow diagram (shows Solana tx step-by-step)
- [ ] This strategy document + technical spec
- [ ] 2-minute demo video script (not filmed, just written)

**Deliverables to Judges:**
- "Creator Leagues" section on Compete page
- "Sign up for early access" modal/form
- GitHub README section explaining roadmap
- Technical architecture diagram (in docs/)

### Phase 2: Full Build (Mar 2-15, 2026)

**Week 1:**
- [ ] Solana escrow service (SDK integration)
- [ ] Create-league form (fully functional)
- [ ] Database schema updates + migrations
- [ ] API endpoints (POST /creator-leagues/create, etc.)

**Week 2:**
- [ ] Frontend component build (CreateLeagueModal, etc.)
- [ ] Prize distribution automation (winners paid automatically)
- [ ] Email confirmations + waitlist management
- [ ] QA + testing

**Deliverables:**
- Fully functional creator league creation
- Live Solana escrow (real prize funding)
- Creator dashboard (first version)

### Phase 3: Polish & Growth (Mar 16-31, 2026)

- [ ] Creator tier / subscription model
- [ ] Advanced analytics + dashboards
- [ ] Sponsor integration framework
- [ ] Influencer partnerships (reach out to CZ, Pomp, etc.)
- [ ] Twitter campaign + content

---

## 13. For Judges: The Narrative

### 13.1 "This is How We're Different"

**The Pitch:**
> Foresight isn't just a contest app. It's infrastructure for creator-owned gaming experiences.
>
> Friend.tech failed because tokens replaced utility. We succeed because Foresight is the utility.
>
> We let creators (influencers, brands, DAOs) launch their own contests with Tapestry-backed teams and on-chain scores.
>
> That's network effects. That's SocialFi that actually works.

### 13.2 Why Judges Should Care

**Hackathon Impact:**
- Shows vision beyond MVP (6 pages today → infinite leagues tomorrow).
- Demonstrates platform thinking (not a one-shot app).
- Proves Solana integration matters (escrow, ownership, identity).
- Aligns with Graveyard theme (resurrecting SocialFi with real mechanics).

**Technical Complexity:**
- Database schema design (normalized, extensible).
- Solana integration (escrow, transactions, finality).
- Event-driven architecture (scoring affects multiple contest types).

**Business Model:**
- Clear revenue path (10% rake on creator leagues scales with adoption).
- Creator incentives (aligned, no extraction).
- Defensible (hard to copy without the scoring engine).

### 13.3 Demo Checklist (Live on Stage)

**If you show Creator Leagues live:**
1. [ ] Go to /compete page
2. [ ] Show "Signature Leagues" carousel (CZ's Champions League visible)
3. [ ] Show "Coming Soon" Creator League section
4. [ ] Click [Sign Up for Early Access] → show email collection form
5. [ ] Read CZ's league description → highlight creator attribution
6. [ ] Go to contest detail → show creator handle + follower count
7. [ ] Explain escrow flow (diagram on slide)
8. [ ] Say: "We're shipping the MVP today. Full build in March."

**Timing:** 2-3 minutes of your 15-min demo slot.

---

## 14. Conclusion: Why This Matters

**Without Creator Leagues:**
- Foresight is a fantasy sports app (saturated, low differentiation).
- Contests are Foresight-owned (centralized, low virality).
- Revenue is limited (only entry fees from players).

**With Creator Leagues:**
- Foresight is a platform (network effects, exponential growth).
- Contests can be creator-owned (decentralized, viral acquisition).
- Revenue compounds (rake on player fees + creator fees + subscriptions).

**In 12 months:**
```
100 creators × 50 leagues/year × 0.1 SOL avg rake = 500 SOL/year
+ Creator subscriptions: 50 creators × $99/mo × 12 = ~$60K/year
+ Sponsorship deals: $50K/year (estimated)
───────────────────────────────────────────────────
= $110K+ annual revenue from Creator League ecosystem alone
```

**Network Effect:**
More creators → more leagues → more discovery → more users → more players → more attractive to creators.

This is **the flywheel**. This is **how Foresight wins**.

---

## Appendix: File References

**Code Location References:**

```
Backend:
└─ backend/migrations/20260225100000_add_signature_league.ts
   (Already has is_signature_league + creator_handle columns)

└─ backend/src/api/prizedContestsV2.ts
   (Contest list endpoint — add filter for creator leagues)

└─ backend/src/api/privateLeagues.ts
   (Template for league creation flow — adapt for Creator Leagues)

Frontend:
└─ frontend/src/pages/Compete.tsx
   (Signature Leagues carousel — add Coming Soon teaser here)

└─ frontend/src/components/ContestDetailCard.tsx
   (Show creator attribution — modify to include creator handle + avatar)
```

**New Files to Create (MVP):**

```
Backend:
├─ backend/migrations/20260227000000_add_creator_league_fields.ts
│  (Add: creator_id, prize_amount, escrow_address, etc.)
├─ backend/src/api/creatorLeagues.ts
│  (Stubs for POST /create, GET /list, etc.)
└─ backend/src/services/creatorLeagueService.ts
   (Validation, business logic)

Frontend:
├─ frontend/src/components/CreatorLeagueTeaser.tsx
│  (Landing page section with CTA + email form)
├─ frontend/src/components/CreateLeagueModal.tsx
│  (Form to create league — prototype/wireframe for MVP)
└─ frontend/src/pages/CreatorLeagueWaitlist.tsx
   (Email confirmation + waitlist management page)

Docs:
└─ docs/CREATOR_LEAGUES_TECHNICAL_SPEC.md
   (Detailed API spec, database schema, Solana integration guide)
```

---

**Document Version:** 1.0
**Last Updated:** Feb 27, 2026, 23:00 UTC
**Status:** READY FOR HACKATHON SUBMISSION

