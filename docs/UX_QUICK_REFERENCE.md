# FORESIGHT UX QUICK REFERENCE
## One-Page Cheat Sheet for Developers & Designers

**Read this first. Read the full strategy if you need to make major decisions.**

---

## The Core Insight
**SocialFi failed because crypto required 5 steps before value. We have Privy + Tapestry API, so we show value in 90 seconds.**

**Users want:** Proof they understand CT better than everyone else (credibility, rank, status)

**Our edge:** Formation view (visual clarity) + Live scoring (real-time dopamine) + Social leaderboard (competitive FOMO)

---

## User Journey (What They See & Do)

```
1. Land on /home → See formation hero + "Start Playing" CTA
2. Click CTA → Privy email/social login (NOT wallet install)
3. Auto-redirect → Formation view with influencer list
4. Pick 5 people → Formation fills, budget counts down
5. Click "Submit" → Team locked, score shows "0 pts"
6. See leaderboard → Your rank displayed, live updates streaming in
7. Watch score climb → Real-time SSE updates as influencers tweet
8. Celebrate rank change → Share on X/Twitter button
```

**Time to value: <2 minutes. That's the hook.**

---

## Pages (6 Total)

| Page | URL | What Users Do | CTA | MVP? |
|------|-----|---------------|-----|------|
| Home | `/` | See product + check dashboard | "Start Playing" / "Check Scores" | ✅ |
| Draft | `/league` | Build 5-person team | "Lock & Submit" | ✅ |
| Leaderboard | `/compete` | View rankings + contests | "Draft New Team" | ✅ |
| Feed | `/intel` | See tweets from people you drafted | [Read tweets] | ✅ |
| Profile | `/profile` | View stats + settings | [Configure] | ✅ |
| Contest Detail | `/contest/:id` | View prizes + rules | "Draft Now" | ✅ |

**Rule:** One primary action per page. Everything else is secondary.

---

## Critical UX Rules (DO NOT BREAK)

1. **Formation view must be beautiful and clear**
   - Captain at top (gold glow, ×1.5 label visible)
   - 2 + 2 below
   - Colors: Gold (S-tier) → Cyan (A) → Emerald (B) → Gray (C)

2. **Live scoring must update every 30 seconds minimum**
   - SSE connection (with polling fallback)
   - Show "🟢 Live" status in header
   - Animate rank changes (green up ↑, red down ↓)

3. **Auth must not say "wallet"**
   - "Email" or "Continue with Google/Twitter"
   - Don't show "install MetaMask" or "connect wallet" on landing
   - Behind the scenes = Privy creates embedded wallet

4. **Never show crypto jargon on landing**
   - NOT: "Bridge your assets to Base"
   - USE: "Win real prizes"
   - NOT: "Connect your Web3 wallet"
   - USE: "Sign in with email"

5. **Leaderboard is the status symbol**
   - Always highlight user's rank in gold
   - Show rank change from previous day (↑/↓)
   - Make it impossible to miss

6. **Copy should be active, not passive**
   - NOT: "You can draft a team"
   - USE: "Draft your 5 influencers"
   - NOT: "Connect your wallet to get started"
   - USE: "Start Playing"

---

## Design Tokens (Use These, Not Others)

**Colors:**
- Gold (#F59E0B) = CTAs, achievements, captain slot, highlights
- Cyan (#06B6D4) = Links, secondary actions, A-tier
- Emerald (#10B981) = Success, B-tier
- Gray-800 (#27272A) = Cards
- Gray-950 (#09090B) = Background

**Typography:**
- Plus Jakarta Sans (display font) = Headlines, big numbers
- Inter (body font) = Everything else
- JetBrains Mono (mono font) = Scores, wallet addresses

**Spacing:**
- 4px between tight elements
- 8px default
- 16px section padding
- 24px between major sections

---

## Features to KEEP (MVP) vs. CUT (Later)

### KEEP ✅
- Live Scoring (real-time leaderboard updates)
- Formation Draft (visual team builder)
- Influencer Selection (tier-grouped list)
- Leaderboard (global + friends)
- CT Feed (tweets from your picks)
- Multi-Contest Support (3-5 free contests running)
- Share Button (invite friends on X)

### CUT 🚫
- User Settings (no theme toggle, no notifications config)
- In-App Chat (social features go to X)
- Advanced Analytics (win rate, skill score, etc.)
- Achievements/Badges (leaderboard rank IS achievement)
- Email Notifications (in-app toast is enough)
- Referral System (sharing is enough)
- Paid Contests (free-only MVP)
- Mobile App (responsive web = sufficient)

**Cuts save ~40-50 hours. Use for polish, testing, demo prep.**

---

## Scoring Display (What Users See)

**During Draft:**
```
Budget: 95 / 150 SOL
Captain: @vitalik (×1.5 bonus visible)
Estimate: ~95 pts
```

**On Leaderboard:**
```
Rank 1: @player1 → 245 pts weekly
...
Rank 47: YOU → 102 pts weekly ← (gold highlight, ↑5 from yesterday)
```

**On Feed:**
```
@vitalik posted
[Tweet text]
48K likes, 12K retweets
THIS TWEET IS SCORING +12 PTS
```

**Rule:** Users should understand why they earned points without reading documentation.

---

## The Demo (What Judges See)

**Total duration: ~3 minutes, all auto-play (no clicking)**

1. Landing page → Formation hero visible (product is clear instantly)
2. Click "Start Playing" → Privy modal (email/Google/Twitter, no wallet)
3. Auth → Success, instant redirect
4. Formation view → Influencer list visible, drag to add
5. Auto-draft → Fills remaining slots, calculates budget
6. Submit → Success modal, team locked
7. Leaderboard → Shows your rank, live scores updating
8. Hover over opponent → See their team formation
9. Back to profile → Show stats (score, rank, history)

**The message:** "From signup to leaderboard in 2 minutes. That's the friction we solved."

---

## The #1 Risk (Auth Friction)

**Judges see Privy modal and think: "This is just another wallet thing..."**

**Prevention:**
- Landing copy: "Email or social login (no wallet install needed)"
- Privy modal shows: "Continue with Google" first, then Twitter, then Email
- Message in modal: "We create your wallet. It's instant."
- If modal closed: Show fallback page with alternative CTAs

**If you get this wrong, everything else is invisible.**

---

## Deployment Checklist (Before Demo)

**2 days before:**
- [ ] Fresh DB (no test junk)
- [ ] Auth flow tested start-to-finish
- [ ] 50+ test users in leaderboard (backend script)
- [ ] Live scoring updates every 30 sec
- [ ] Mobile responsive (tested on iPhone)
- [ ] Zero console errors

**1 day before:**
- [ ] Record backup video
- [ ] Test on slow internet
- [ ] Database synced + healthy
- [ ] Privy keys configured correctly

**During demo:**
- [ ] Run fresh server (`pnpm dev`)
- [ ] Open in incognito (no cached state)
- [ ] Have phone ready (for "does it work on mobile?" question)

---

## Common Mistakes to Avoid

❌ **Showing crypto jargon on landing page**
✅ Show: "Sign in with email" → Hide: "Connect MetaMask"

❌ **Auth modal being confusing**
✅ Social login first, email as fallback, clear messaging

❌ **Scores not updating in real-time**
✅ SSE every 30 sec, with polling fallback, show status

❌ **Formation view being hard to understand**
✅ Tier colors obvious, captain highlighted, budget tracked

❌ **Leaderboard not showing your rank prominently**
✅ Your rank in gold, animation on changes, comparison to yesterday

❌ **Killing features at the last minute without testing**
✅ If unsure, disable feature entirely rather than shipping buggy version

❌ **Not explaining why you earned points**
✅ Hover over score → Show breakdown (activity +18, engagement +24, viral +10)

---

## Questions?

**See full strategy:** `/Users/mujeeb/foresight/docs/UX_ARCHITECTURE_WARROOM.md`

**This reference card is maintained during development. Update daily.**

---
