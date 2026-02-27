# Creator Leagues — Quick Reference

> **TL;DR** — Influencers create their own branded contests. We run scoring. We rake 10%. Network effects.

---

## One-Sentence Pitch

**Creator Leagues lets influencers, brands, and power users launch their own Foresight contests with custom prizes, turning followers into competitors and Foresight into a platform.**

---

## Why It's Powerful (30 Seconds)

1. **Viral Loop** — Creator promotes their league to followers → Foresight gains discovery → users become repeat entrants
2. **Revenue** — 10% rake on entry fees + future subscription tiers = scalable revenue stream
3. **Positioning** — "Foresight is infrastructure for CT social gaming" (not just another contest app)
4. **Network Effects** — More creators → more contests → more engagement → more valuable for creators

---

## Creator Journey (60 Seconds)

```
Creator: "I want my own league"
  ↓
[Sign in with Solana wallet]
  ↓
[Modal: "Create Your League"]
├─ Name: "Pomp's Weekly Draft"
├─ Prize: 0.5 SOL
├─ Entry Fee: Free (or 0.01-0.05 SOL)
├─ Duration: 7 days (or 24h)
└─ [Create] → Escrow Popup
  ↓
[Solana: "Send 0.5 SOL to Foresight escrow?"]
  ↓
Creator signs → Funds locked
  ↓
[Contest goes live on /compete page]
  ↓
Creator shares link → Followers enter
  ↓
Leaderboard updates → Winners get paid from escrow
  ↓
Foresight keeps rake, creator keeps leftover
```

**Total time:** 3 minutes

---

## Player Experience (What's Different?)

**On `/compete` page:**

```
SIGNATURE LEAGUES
┌──────────────────────────────────────────┐
│ CZ's Champions League      Pomp's Draft  │
│ Free | 412 players         Free | 98     │
│ [Join]                     [Join]         │
└──────────────────────────────────────────┘

READY TO CREATE YOUR OWN?
[Sign Up for Early Access] [Watch Demo]
```

**On contest card:**
```
Pomp's Weekly Draft
👤 @APompliano (123.5K followers)
"Draft the best CT thinkers..."
Status: 98/unlimited players | 2d left
[Join Contest]
```

**Leaderboard:**
```
Rank  Player        Score  League
────────────────────────────
1.    CZ_Maxi       198   🎯 Pomp's Draft
2.    BNB_King      185   🎯 Pomp's Draft
```

---

## What's Locked (Can't Change)

| Item | Why? |
|------|------|
| Team size (5 players) | Consistency with Foresight standard |
| Captain rule (1.5x) | Game balance |
| Influencer pool (top 100) | Quality + consistency |
| Scoring rules | Deterministic, trustless |
| Scoring cadence (4x daily) | Real-time engagement |

**Translation:** Creator controls vibe, Foresight controls fairness.

---

## What's Customizable

**MVP (Now):**
- Contest name
- Description (copy + emoji)
- Prize amount (0.05-10 SOL)
- Entry fee (free or paid)
- Duration (7 days or 24 hours)

**Phase 2 (March):**
- Custom banner image
- Followers-only entry
- Whitelist entry
- Token prizes (ABC tokens instead of SOL)

---

## Revenue Model

**Current Contest:** 100 players × 0.01 SOL = 1 SOL pool → Foresight gets 0.1 SOL (10% rake)

**Creator League A (Free, Creator Funds Prize):**
```
Creator: "Free to enter, I'm funding 1 SOL prize"
→ 200 players enter (free)
→ Foresight rake: $0 (no entry fees from players)
→ Foresight value: User acquisition + future monetization
```

**Creator League B (Paid Entry):**
```
Creator: "0.05 SOL entry fee, 0.5 SOL prize"
→ 150 players enter (0.05 each = 7.5 SOL collected)
→ Prize pool: 0.5 (creator) + 7.5 (players) = 8 SOL
→ Foresight rake: 10% of 7.5 = **0.75 SOL**
→ Foresight value: Revenue + user acquisition
```

**At Scale (100 creators, 50 leagues/year each):**
```
100 creators × 50 leagues × 0.1 SOL avg rake = 500 SOL/year
+ Creator subscription tier ($99/mo × 50 creators) = $60K/year
= $110K+ annual recurring revenue
```

---

## Trust & Safety: The Escrow

**Problem:** Creator launches league, doesn't have prize funds, users get scammed.

**Solution:** Mandatory Solana escrow

```
Creator → [Escrow Wallet] → Foresight holds funds → Winners paid automatically
          (Locked 7 days)
```

**Safeguards:**
- Creator pre-funds before contest goes live
- Funds auto-released to winners at contest end
- If <5 players, auto-refund to creator
- Foresight can't disappear with funds (escrow is separate wallet)
- Can't cancel once contest starts (unless <5 players)

---

## Tech Stack Changes

**Nothing breaks:**
- Scoring system stays the same
- Auth stays the same
- Leaderboard stays the same
- Contests table gets 5 new columns (backward-compatible)

**New pieces:**
- Solana escrow service (SDK calls)
- Create-league form + modal
- Creator dashboard (Phase 2)
- Prize distribution automation

**Database:** 5 new columns on `prized_contests`:
```
- creator_id (UUID)
- creator_wallet (42 chars)
- prize_escrow_address (Solana wallet)
- prize_amount (decimal)
- escrow_tx_hash (proof)
```

**API:** 2 new endpoints
```
POST /api/v2/creator-leagues/create
POST /api/v2/creator-leagues/:id/confirm-escrow
GET /api/v2/creator-leagues (list)
```

---

## MVP (Ship Today, Feb 27) vs. Full Build (March)

### MVP: Show Judges the Vision

**What's built:**
- ✅ "Coming Soon" teaser on `/compete` page
- ✅ Email waitlist form (collects creator interest)
- ✅ Prototype create-league form (wireframe, non-functional)
- ✅ Escrow flow diagram (showing steps)
- ✅ This documentation
- ✅ Database schema designed

**Why not full build?**
- Time: Escrow + Solana integration = 8-10 hours.
- Risk: Don't want to ship broken Solana code at deadline.
- Feedback: Let judges see wireframes, get feedback, iterate.
- Narrative: "Here's our Phase 2 roadmap" (shows planning).

### Full Build (March 2-15)

**What's added:**
- [ ] Functional create-league form
- [ ] Real Solana escrow transactions
- [ ] Automatic prize distribution
- [ ] Creator dashboard
- [ ] Email confirmations

**Timeline:** 2 weeks post-hackathon.

---

## Copy for Landing (What to Show Players)

### Headline
"Turn Your Followers Into Competitors"

### Subheading
"Launch your own Foresight league. Set the prize. Invite your audience. Watch them compete."

### Value Props
- 💰 Fund your own prize pool (0.05 - 10 SOL)
- 🎯 Full control over contest rules
- 🏆 Escrow-protected prizes (we hold the funds)
- 📊 Real-time leaderboard + automatic payouts
- 🔗 Built on Tapestry (on-chain identity)
- 📱 White-label experience

### CTA
"Join Creator Waitlist" (implies exclusivity + iteration)

---

## Demo Talking Points (For Judges)

**Open the app, navigate to `/compete`:**

1. **Show existing leagues:** "CZ's Champions League is already live with 412 players, zero Foresight marketing."

2. **Point to "Coming Soon" section:** "Below that, we're adding Creator Leagues. Influencers can launch their own."

3. **Explain the value:** "This is how we achieve network effects. Creators market for us. We rake. Everyone wins."

4. **Show the form:** "Creator enters name, prize, entry fee. We handle escrow on Solana. Winner gets paid automatically."

5. **Explain the narrative:** "Friend.tech failed because tokens replaced utility. We succeed because Foresight IS the utility."

6. **Timeline:** "MVP ships today (what you see). Full build by March 1 (Solana integration). First influencer leagues by mid-March."

**Time:** 2-3 minutes of your demo.

---

## FAQ

**Q: Why not let creators set scoring rules?**
A: Scoring is deterministic (tied to real Twitter data). We control this for fairness. Creator controls everything else (name, prize, vibe).

**Q: What if creator doesn't have SOL?**
A: We can add other entry methods later (credit card, etc.). MVP is Solana-native only.

**Q: What if a creator runs away with funds?**
A: Escrow is Foresight-held, not creator-held. We distribute prizes regardless. Creator can't touch the money.

**Q: Can we do referral fees?**
A: Yes, Phase 2. Creators who bring players get a % of rake (revenue share).

**Q: What about tokens instead of SOL?**
A: Phase 2. Tapestry escrow + DEX integration to handle SPL tokens.

---

## Success Metrics

**MVP (Hackathon):**
- 50+ signups for early access (from demo)
- Database schema documented
- Prototype built + shown to judges
- Clear roadmap explained

**Phase 2 (March 1):**
- 5+ creators have launched leagues
- 500+ total entrants across creator leagues
- 0.5 SOL+ in rake revenue

**Long-term (End 2026):**
- 50+ active creators
- 10K+ monthly users in creator leagues
- $110K+ annual revenue from creator ecosystem

---

## File References

**Docs:**
- `CREATOR_LEAGUES_STRATEGY.md` — Full 5K-word strategy (this is the TL;DR)
- `CREATOR_LEAGUES_TECHNICAL_SPEC.md` — API endpoints, database schema, implementation

**Code (existing):**
- `backend/migrations/20260225100000_add_signature_league.ts` (columns already exist)
- `frontend/src/pages/Compete.tsx` (where to add teaser)
- `backend/src/api/prizedContestsV2.ts` (endpoint to modify)

**Code (new, build in March):**
- `backend/src/api/creatorLeagues.ts`
- `backend/src/services/creatorLeagueService.ts`
- `backend/src/services/escrowService.ts`
- `frontend/src/components/CreatorLeagueTeaser.tsx`
- `frontend/src/components/CreateLeagueModal.tsx`

---

**Version:** 1.0
**Last Updated:** Feb 27, 2026
**Status:** READY TO PRESENT TO JUDGES
