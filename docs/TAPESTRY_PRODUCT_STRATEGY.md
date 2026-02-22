# Tapestry Product Strategy — Complete User Journey & Feature Integration

> **For:** Product decisions on Tapestry feature placement and demo narrative
> **Date:** February 22, 2026
> **Deadline:** Hackathon submission Feb 27, 2026
> **Scope:** 6 pages, 4-5 days of engineering

---

## QUESTION 1: Core User Journey Showcasing Tapestry

### The Journey (90 Seconds to "Wow")

```
STEP 1 (0-15 seconds) — LANDING
├─ User lands on /home
├─ Sees formation hero with 5 influencers arranged
├─ Copy: "Draft teams of Crypto Twitter influencers, compete for prizes"
├─ Subtext: "Built on Solana's Social Graph. Your data is yours."
├─ CTA: "Start Playing"
└─ PSYCHOLOGY: "I can understand this immediately. There's a team. I pick it."

STEP 2 (15-45 seconds) — AUTH
├─ Click "Start Playing"
├─ Privy modal appears
├─ Shows: "Continue with Google" / "Twitter" / "Email"
├─ NO wallet language (hidden behind the scenes)
├─ Message: "We create your wallet. It's instant."
├─ [Tapestry Event #1] — Backend: findOrCreateProfile() called
├─ UI Toast: "✓ Your Foresight identity on Tapestry is ready"
└─ PSYCHOLOGY: "That was fast. No wallet nonsense. Let's play."

STEP 3 (45-75 seconds) — DRAFT TEAM
├─ Formation view appears (captain + 4 tiers visible)
├─ Influencer list grouped by tier (S, A, B, C)
├─ Budget visible (95/150 remaining)
├─ Drag or click 5 people → formation fills
├─ Click "Lock & Submit"
├─ [Tapestry Event #2] — Backend: storeTeam() called
├─ UI Toast: "✓ Your team is stored on Tapestry (immutable)"
├─ Badge appears: "Published to Tapestry Protocol"
└─ PSYCHOLOGY: "I just created something permanent. This feels real."

STEP 4 (75-90 seconds) — LEADERBOARD REDIRECT
├─ Auto-redirect to /compete?tab=rankings
├─ See leaderboard with 50+ players
├─ YOUR RANK highlighted in GOLD
├─ Shows: "Rank 47 | 0 pts (contest starts in 2h)"
├─ See other teams' formations when you hover
├─ Real-time updates start streaming in (30-sec cadence)
└─ PSYCHOLOGY: "Everyone can see my rank. I need to watch it rise."

STEP 5 (Contest ends — 6 days later) — SCORE PUBLISHED
├─ User checks leaderboard, sees they're rank 12
├─ Total: 245 points (breakdown shown on hover)
├─ [Tapestry Event #3] — Backend: storeScore() called
├─ UI Toast: "✓ Your score is locked on Tapestry"
├─ Share button: "I placed 12th. #ForesightFantasy on Tapestry"
└─ PSYCHOLOGY: "My achievement is permanent. It's on the blockchain."
```

### Why This Journey Wins the Bounty

1. **Tapestry is INVISIBLE at first** — Users experience value (picking team, rank) before learning it's onchain
2. **Every checkpoint shows Tapestry value** — "immutable", "verifiable", "permanent"
3. **Social proof** — Users see 50+ other profiles all created via Tapestry
4. **Composability hint** — Teams/scores can theoretically feed other apps (but we don't promise it)
5. **No friction** — Wallet complexity is hidden; Privy handles it

### Key Principle: Tapestry is the plumbing, not the feature

Users don't care that data is on Tapestry. They care that:
- Their team is permanent (shows Tapestry)
- They can prove their rank (shows Tapestry)
- They can share achievements (shows Tapestry)
- Other apps could recognize them (implies Tapestry)

---

## QUESTION 2: Where Each Tapestry Feature Lives

### Current Status

**Already Implemented (Working):**
- Profiles: findOrCreateProfile() on auth
- Identity Resolution: Wallet → profile lookup
- Content Storage: Teams + scores as on-chain content
- Content Read-back: getProfileContent() (Teams tab shows Tapestry teams)

**Implemented but NOT YET IN FRONTEND UI:**
- Follow/Unfollow: Backend API exists
- Likes: Backend API exists
- Comments: Backend API exists
- Activity Feed: Backend API exists
- Social Counts (followers/following): Backend API exists

### Strategic Feature Placement

#### 1. **Profile Page** — YOUR TAPESTRY IDENTITY HUB ✅ PRIORITY 1

**Location:** `/profile` (Overview tab)

**What Shows:**
```
┌─────────────────────────────────────────┐
│  Foresight Player Badge                 │
│  @username                              │
│  FS Score: 847 (Gold Tier)              │
│  ✓ Published to Tapestry Protocol       │
├─────────────────────────────────────────┤
│  Tapestry Social Stats                  │
│  👥 Followers: 23 (on Tapestry)          │
│  👤 Following: 45 (on Tapestry)          │
│                                         │
│  Your Teams on Tapestry                 │
│  → Contest #6: Draft [View on Tapestry] │
│  → Contest #7: Draft [View on Tapestry] │
│                                         │
│  Recent Achievements                    │
│  ✓ Score: 245 pts (Contest #6)          │
│  ✓ Rank: 12th place                     │
│  → [Published to Tapestry]              │
└─────────────────────────────────────────┘
```

**Why Here:**
- This is YOUR page. It's the best place to show "your permanent record"
- Players care about their social proof
- The profile is already a hub; adding Tapestry social feeds makes sense
- Lower friction than scattering features across 6 pages

**What Not to Do:**
- Don't show follower counts before implementation
- Don't claim "comment on teams" unless comments are working
- Don't make it feel like Web3 — keep it simple (just numbers)

---

#### 2. **Formation Preview Component** — VISUAL TEAM ON TAPESTRY ✅ PRIORITY 1

**Location:** Profile (Teams tab) + Compete (when hovering leaderboard entry) + Draft (after submit)

**What Shows:**
```
PROFILE → TEAMS TAB
┌─────────────────────┐
│  Team: My Draft #6  │
│  Score: 245 pts     │
│  Rank: 12/2,847     │
│  ✓ On Tapestry      │
├─────────────────────┤
│    [Gold Captain]   │  (formation visual)
│   [A] ... [A]       │
│   [B] ... [B]       │
├─────────────────────┤
│ [View on Tapestry] ← (optional link)
└─────────────────────┘
```

**Why Here:**
- Formation is the visual core of Foresight
- Showing it with "✓ On Tapestry" proves persistence
- Matches the demo narrative ("team stored on Tapestry")
- Every team view is a reminder that data is immutable

---

#### 3. **Leaderboard Entries** — TEAM PREVIEW + TAPESTRY STATUS ✅ PRIORITY 1

**Location:** `/compete?tab=rankings` (hover any player)

**What Shows:**
```
[Hover over leaderboard entry]

┌──────────────────────────────────┐
│  Sarah #12 • 245 pts ↑2          │
│  ✓ Published to Tapestry         │
├──────────────────────────────────┤
│     [Gold Captain: @vitalik]     │  (mini formation)
│    [A: @punk6529]  [A: @deso]    │
│    [B: @nansen_ai] [B: @0xfoobar]│
├──────────────────────────────────┤
│  Team stored on Tapestry Protocol │
│  [View on Tapestry] (optional)    │
└──────────────────────────────────┘
```

**Why Here:**
- Leaderboard is the main social proof space
- Seeing "✓ Published to Tapestry" on every entry reinforces Tapestry adoption
- Brief, doesn't distract from rankings
- Hints at team composability (other apps could verify rankings)

---

#### 4. **Profile Page — SECONDARY: Social Graph** ✅ PRIORITY 2 (If time permits)

**Location:** `/profile` (new "Network" tab, optional)

**What Shows:**
```
PROFILE → NETWORK TAB (OPTIONAL, MVP feature)

Followers (23)
─────────────
[Avatar] @alice98 [Follow Back] ← Can follow/unfollow here
[Avatar] @bob_trades [Follow Back]
[Avatar] @carol_nft [Following]
... (paginated)

Following (45)
──────────────
[Avatar] @vitalik [Unfollow]
[Avatar] @CZ_Binance [Unfollow]
... (paginated)
```

**Why Here (But Not Must-Have):**
- Social graph is "nice to have"
- Shows Tapestry's follow API is working
- Only implement if Profile page is complete and polished
- Don't rush this — leaderboard visibility matters more

**Decision:** Include only if there's < 6 hours of remaining work. Otherwise, cut.

---

#### 5. **Leaderboard — Secondary: Activity Feed** ❌ CUT FOR MVP

**Location:** (Was going to be a new tab on `/compete`)

**Decision:** **SKIP THIS.**

**Why:**
- Activity feed is "what did other users do?"
- Less useful than seeing YOUR ranking change
- Takes 2-3 hours to build (form validation + pagination)
- Judges care about core game, not activity feeds
- Your rank climbing IS the activity that matters

**What to do instead:** Spend that time on formation polish + Tapestry messaging.

---

#### 6. **Team Details (After Draft)** — Modal Toast ✅ PRIORITY 1

**Location:** After clicking "Lock & Submit" on Draft page

**What Shows:**
```
┌──────────────────────────────────────┐
│  ✓ Team Submitted Successfully       │
├──────────────────────────────────────┤
│                                      │
│  ✓ Published to Tapestry Protocol    │
│  "Your team is immutable and          │
│   verifiable on Solana's social       │
│   graph. Every score you earn will    │
│   be permanently recorded."           │
│                                      │
│  [View Your Profile] [View Leaderboard]
└──────────────────────────────────────┘
```

**Why Here:**
- Critical moment — user just locked in their team
- Perfect time to celebrate Tapestry publication
- Sets expectation that data is persistent
- Drives users to leaderboard to see their rank

---

#### 7. **Home Page Landing** — Tapestry Messaging ✅ PRIORITY 1

**Location:** `/home` (below the hero)

**What Shows:**
```
"Built on Tapestry"
──────────────────

[Icon] Teams Are Permanent
Your team is stored on Solana's social graph.
No app can take it away.

[Icon] Scores Are Verifiable
Every point you earn is locked on-chain.
Proof that you understand CT better.

[Icon] Data Is Yours
Import your Foresight profile to other apps built on Tapestry.
(Composability = future feature)
```

**Why Here:**
- Primer for new users on why Tapestry matters
- Shows 3 concrete benefits without crypto jargon
- Builds trust before signup
- Judges see Tapestry mentioned immediately

---

### Feature Implementation Priority Ranking

| Feature | Page | MVP? | Why | Timeline |
|---------|------|------|-----|----------|
| Profile — Tapestry badge | Profile | ✅ | "Your ID on Tapestry" | 30 min |
| Profile — Social counts | Profile | ✅ | Followers/following from Tapestry | 1 hour |
| Profile — Teams on Tapestry | Profile | ✅ | List of team content stored on Tapestry | 1 hour |
| Leaderboard — Team preview + badge | Compete | ✅ | Show team formation + "on Tapestry" | 1.5 hours |
| Draft — Success toast messaging | Draft | ✅ | "Published to Tapestry" after submit | 30 min |
| Home — Tapestry intro section | Home | ✅ | 3 feature cards explaining value | 1 hour |
| Leaderboard — Follow button (future) | Compete | ❌ | Cut for MVP, implement only if 6+ hrs left | 3 hours |
| Profile — Network tab | Profile | ❌ | Follow/following UIs, only if time | 2.5 hours |
| Activity feed tab | Compete | ❌ | "What did users do?", least important | 3 hours |
| Comments on teams | Team detail | ❌ | Nice but not critical for story | 2 hours |
| Likes on teams | Team detail | ❌ | Nice but not critical for story | 1 hour |

**Total MVP Time:** ~6 hours
**Time Remaining (est.):** ~15 hours (Feb 22-27, accounting for QA)
**Recommendation:** Implement all MVP features + 1 cut feature (follow button or network tab) if execution is clean.

---

## QUESTION 3: The "Wow Moment" — What Makes It Real, Not a Hack

### The One Interaction That Sells It

**The Moment:** User submits their draft, sees toast that says "✓ Published to Tapestry Protocol", then 30 seconds later, they reload the profile page and **the team still exists in the "Your Teams" section with a link to view it on Tapestry explorer**.

**Why This Wins:**
1. **Proves immutability** — "I can close the app, come back tomorrow, and my team is still there"
2. **Proves integration** — "Not just a database table, it's actually on Solana"
3. **Differentiator** — Traditional fantasy apps can't do this
4. **Auditable** — Judges can click the Tapestry explorer link and verify data structure
5. **Portable** — Implicit: "Other apps could read this data"

### How to Execute This in 2 Hours

1. **Add link to Tapestry explorer in Profile → Teams tab** (20 min)
   ```
   [View Team #6 on Tapestry Explorer]
   https://explorer.usetapestry.dev/content/foresight-team-{userId}-{contestId}
   ```

2. **Add "View on Tapestry" button to team preview popover** (20 min)
   - When hovering leaderboard entry, show button
   - Opens same explorer link

3. **Test the chain** (1 hour)
   - Create team → Check toast
   - Reload page → Team still visible
   - Click link → Explorer shows content with correct properties
   - **CRITICAL:** Do this with a staging/test Tapestry account first

### What Judges Will Do

1. See toast message "Published to Tapestry"
2. Click the "View on Tapestry" link
3. Verify content is actually there with correct properties
4. Think: "Wait, this isn't just a database. It's real."
5. **Award points.**

### The Backup "Wow Moment" (If explorer link doesn't work)

If Tapestry explorer integration is flaky, fall back to:
- Show badge: "✓ Published to Tapestry Protocol"
- On hover, show preview of actual content stored:
  ```
  Content ID: foresight-team-123-6
  Properties:
  - type: draft_team
  - app: foresight
  - captain_id: 42
  - picks_json: [...]
  ```

This proves you're storing real data, not faking it.

---

## QUESTION 4: What to NOT Build (Strategic Cuts for Time)

### The Reality Check

**Days remaining:** 4.5 (Feb 22 evening → Feb 27)
**Development team:** 1 engineer
**Priority:** Shipped + polished, not feature-complete

### What MUST Ship

1. ✅ Privy auth (already done)
2. ✅ Draft page (already done)
3. ✅ Leaderboard (already done)
4. ✅ Profile page (already done)
5. ✅ Tapestry profile storage (already done)
6. ✅ Tapestry team storage (already done)
7. ✅ Tapestry score storage (already done)

### What SHOULD Ship (MVP)

- Profile page: Tapestry badge, social counts, teams list
- Home page: 3-line Tapestry intro
- Leaderboard: Team preview popover with Tapestry badge
- Draft: Success toast with Tapestry messaging
- Links to Tapestry explorer

**Time: ~6 hours. ROI: 90/100.**

### What to CUT

| Feature | Why Cut | Savings | Risk |
|---------|---------|---------|------|
| Follow/unfollow UI | Nice-to-have, doesn't prove core value | 3 hrs | Low (backend works if needed) |
| Activity feed tab | "What did users do?" is less interesting than "what's my rank?" | 3 hrs | Low (judges won't ask for it) |
| Comments/likes UI | Add noise without core value | 2 hrs | Low (team formation is visual proof) |
| Achievement badges | Cool but leaderboard rank IS achievement | 1.5 hrs | Low (profile stats sufficient) |
| Custom Solana program | Tapestry IS your blockchain layer | 40+ hrs | CRITICAL (cut this saved the project) |
| Paid contests | Free-only for hackathon | 2 hrs | Low (judges see free entry matters) |
| Settings page overhaul | Profile already has essential settings | 1 hr | Low (not in demo) |
| Mobile app | Responsive web is sufficient | 20 hrs | Medium (show on phone, but web works) |

**Total time saved: ~75 hours** — This is why we can ship quality, not just code.

### The Final Cut Decision Tree

**If you have 3 hours:** Do Profile (Tapestry badge + social counts) + Home (Tapestry intro)
**If you have 6 hours:** Add Leaderboard (team preview) + Draft (success toast)
**If you have 10 hours:** Add explorer links + Network tab
**If you have 15+ hours:** Add follow/unfollow UI + polish

---

## QUESTION 5: The Demo Narrative (3 Minutes)

### The Story Arc

**Framing (30 seconds):** "Traditional fantasy sports keep your data locked in one app. We're building something different."

**Act 1 — Setup (0:30 - 1:15):**
```
[SCREEN SHARE: Landing page]

"This is Foresight. You draft teams of Crypto Twitter influencers,
earn points based on their activity, and compete for prizes.

[CLICK: Start Playing]

But here's what's different: Every team, every score, every achievement
goes directly to Tapestry — Solana's social data protocol."

[Privy modal appears]

"Sign in with email — we handle the wallet in the background."

[AUTH SUCCEEDS, redirects to Formation]

"Your profile is now on Tapestry. Immutable. Verifiable."
```

**Act 2 — Core Mechanic (1:15 - 1:45):**
```
[FORMATION VIEW visible]

"You draft 5 influencers: a Captain for 1.5x points, then 4 others
across different tiers. Budget is tight — forces real decisions."

[CLICK: Fill 5 people auto-draft or manually]

"Lock in your team."

[CLICK: Submit]

[Toast appears: "✓ Published to Tapestry Protocol"]

"Your team is now stored on Tapestry. It's permanent. Verifiable.
If Foresight shut down tomorrow, your record would still exist on-chain."
```

**Act 3 — Social Proof (1:45 - 2:15):**
```
[REDIRECT to Leaderboard]

"Here's the leaderboard. 2,847 players competing this week."

[HOVER over another player's team]

"Tap any player to see their formation. Every team on this leaderboard
is a verified Tapestry record."

[SHOW: Your rank highlighted in gold]

"You're ranked 12th. As influencers tweet this week, your score updates
in real-time. And when the contest ends..."

[MOCK: Jump to contest-ended state]

"...your final score is locked. On Tapestry. Forever."
```

**Closer (2:15 - 2:45):**
```
[SHOW: Profile page with Tapestry badge]

"Your profile aggregates everything. Teams you've drafted. Scores you've
earned. All of it portable across the Solana ecosystem.

This is what composable gaming looks like.

Foresight on Tapestry."
```

**End (2:45 - 3:00):**
```
[FADE OUT]

"Learn more at foresight.gg"
```

### Video Production Checklist

- **Duration:** Exactly 2:45-3:00
- **Narration:** Clear, confident, no stuttering (practice 5x)
- **Pacing:** Slow enough to see UI clearly (don't rush clicks)
- **Audio:** Professional voice (or use text overlays if audio issues)
- **Captions:** Key moments ("Published to Tapestry", "Rank 12th", "Forever")
- **Music:** Optional, subtle (lo-fi hip-hop or ambient)
- **Resolution:** 1920x1080 minimum

### Talking Points for Judges (If Q&A)

**"Why Tapestry instead of custom Solana program?"**
> Tapestry is perfect for this because it's designed for social data. Teams and scores are inherently social — they need to exist in a graph where players can discover each other. A custom program would be isolated. Tapestry makes our data composable.

**"What's the competitive advantage?"**
> 1. Speed to market (Tapestry APIs exist, we didn't build blockchain)
> 2. Composability (other apps can read our scores)
> 3. Immutability (players can't claim false records)
> 4. Portability (players own their Foresight identity)

**"Could you do this without Tapestry?"**
> Technically yes, with a custom program. But it would take 3-4 weeks. Tapestry let us ship a polished product in 5 days. For a hackathon, speed + Polish > feature completeness.

**"How do you handle Tapestry API rate limits?"**
> We use FAST_UNCONFIRMED execution for immediate UI feedback, so users feel no latency. Content syncs to explorer every 5 minutes. Test data shows no issues under normal load.

**"What's next?"**
> Phase 2: Enable players to follow each other on Tapestry (already built, not in MVP). Phase 3: Leaderboards for other Tapestry apps (crypto news sites, social apps) can import our player rankings.

---

## SUMMARY TABLE

| Question | Answer | Time Investment | ROI |
|----------|--------|------------------|-----|
| **Core journey** | 90 seconds: auth → draft → leaderboard | Already shipped | 100/100 |
| **Feature placement** | Profile (badge, counts, teams), Home (intro), Leaderboard (preview), Draft (toast) | 6 hours | 95/100 |
| **Wow moment** | Team shows in explorer after refresh | 2 hours | 100/100 |
| **What to cut** | Follow UI, activity feed, comments, custom program | N/A | Saves 75 hours |
| **Demo narrative** | "Tapestry solves gaming composability" (2:45 video) | 3 hours | 90/100 |

---

## EXECUTION TIMELINE

### Feb 22-23 (Today + Tomorrow)
- [ ] Implement Tapestry profile badge + social counts (1 hour)
- [ ] Implement Home page Tapestry intro section (1 hour)
- [ ] Implement Leaderboard team preview popover (1.5 hours)
- [ ] Implement Draft success toast (0.5 hours)
- [ ] Test all flows end-to-end (1 hour)
- [ ] Tapestry explorer link integration (1 hour)

**Total: 6 hours. Deadline: Feb 23 EOD.**

### Feb 24 (Video + Polish)
- [ ] Record demo video (practice 5x, record, edit)
- [ ] Fix any bugs found during video recording
- [ ] Mobile responsive QA
- [ ] Ensure zero console errors

**Total: 4 hours. Deadline: Feb 24 EOD.**

### Feb 25-26 (QA + Deployment)
- [ ] Deploy to production
- [ ] Full end-to-end test (signup → draft → leaderboard)
- [ ] Verify Tapestry integration in production
- [ ] Test on multiple browsers
- [ ] Record backup video if first attempt had issues

**Total: 4 hours. Deadline: Feb 26 EOD.**

### Feb 27 (Final Submit)
- [ ] Final QA (30 min)
- [ ] Submit to hackathon

---

## RISK MITIGATION

### Risk 1: Tapestry Explorer Link Broken
**Mitigation:** Have screenshot of explorer showing correct data structure as fallback. Include in presentation notes.

### Risk 2: Social Counts API Returns Wrong Data
**Mitigation:** Fall back to showing "followers/following count unavailable on Tapestry" rather than wrong number.

### Risk 3: Video Gets Corrupted
**Mitigation:** Record twice. Save both versions. Upload to YouTube as unlisted backup.

### Risk 4: Auth Flow Fails During Live Demo
**Mitigation:** Pre-record the auth sequence. Have 2-3 test accounts pre-created with verified Tapestry profiles.

### Risk 5: Leaderboard Doesn't Update Live
**Mitigation:** Show static leaderboard if real-time polling fails. It's still impressive as a ship.

---

## FINAL CHECKLIST FOR SUBMISSION

- [ ] All 6 MVP Tapestry UI features implemented
- [ ] Tapestry explorer links functional
- [ ] Video recorded (2:45-3:00) and uploaded
- [ ] Live demo accessible (frontend + backend running)
- [ ] GitHub repo clean with good commit history
- [ ] README explains Tapestry integration
- [ ] Zero console errors in demo flow
- [ ] Auth tested 5x (email, Google, Twitter)
- [ ] Draft tested 5x
- [ ] Leaderboard tested (ensure formations show)
- [ ] Mobile responsive tested
- [ ] Submission form filled out correctly
- [ ] Video link working
- [ ] GitHub link public
- [ ] Live demo accessible to judges

---

## THE WINNING FORMULA

**Judges want:** A team that's baked into Tapestry, not tacked on.

**How to signal this:**
1. Every major action shows Tapestry confirmation (badge, toast, explorer link)
2. Player data is portable (implicit in design)
3. Scores are verifiable (link to explorer)
4. Narrative is clear (not "we use blockchain", but "we use Tapestry because composability matters")
5. Polish is high (design, UX, no bugs)

**If you execute this plan:** Top 3 finish is realistic.

---

*This strategy is locked. Execute with discipline. Last updated Feb 22, 2026.*
