# FINAL ARCHITECTURE DECISIONS - Foresight Social Layer
## Synthesized from 5 Expert Perspectives

> **Date:** February 22, 2026
> **Status:** LOCKED & FINAL
> **Next Phase:** Implementation starts immediately
> **Timeline:** Days 4-5 (48 hours) to complete + QA

---

## EXECUTIVE SUMMARY

This document synthesizes 5 expert perspectives (User Advocate, Growth Hacker, Behavioral Psychologist, Business Strategist, Design Lead) into FINAL architecture decisions for Foresight's social layer.

**The Core Consensus:** Live scoring is mandatory. Follow + Activity Feed is highest-value social layer. Comments are harmful. Likes are optional. Tapestry is infrastructure, not marketing.

**Expected Impact:** Brings us from 86/100 (current) to 93-95/100 (1st place, $2.5K).

---

## PART 1: FINAL DECISIONS (What We're Building)

### Decision Matrix

| Feature | Build? | Priority | Why | Timeline |
|---------|--------|----------|-----|----------|
| **Follow** | ✅ YES | P0 (CRITICAL) | 5/5 experts agree. Drives retention via Friends Leaderboard. High ROI. | 6h |
| **Activity Feed** | ✅ YES | P0 (CRITICAL) | 4/5 agree. Makes app "feel alive". Core retention mechanism. | 6h |
| **Likes** | ❌ NO | P2 (Later) | 3/5 say delay/skip. Medium ROI. Medium effort. Saves 2h. | Cut |
| **Comments** | ❌ NO | P3 (Cut) | 4/5 explicitly say NO. Toxicity risk, moderation burden, dilutes focus. | Cut |
| **Live Scoring** | ✅ ALREADY DONE | P0 (FOUNDATION) | 5/5 agree this is #1. Already implemented (SSE + 30s polling). | Done |
| **Shareable Team Cards** | ✅ YES | P1 (HIGH) | 2/5 strongly emphasize. This is the real viral loop, not in-app social. | 4h |
| **Friends Leaderboard** | ✅ YES | P1 (HIGH) | 5/5 agree > Global leaderboard. Local rivalry beats global rank. | 3h |
| **Tapestry Branding** | ✅ SUBTLE | P1 (HIGH) | Show "Saved to Tapestry", not marketing splash. Purposeful, not aggressive. | 2h |

---

## PART 2: FEATURE PRIORITY (Ordered)

### Tier 0 - FOUNDATION (Already Complete)
1. **Live Scoring** - SSE + 30s polling, shows "🟢 Live" status
   - *Why:* All 5 experts agree this is #1 priority
   - *User motivation:* Real-time dopamine hit from score updates
   - *Retention driver:* Users check app obsessively for updates

### Tier 1 - SOCIAL CORE (Days 4-5)
2. **Follow Button** + Following State Batch Check
   - *Why:* 5/5 agree. Enables Friends Leaderboard. High motivation + excellent ability.
   - *ROI:* Low effort (1 component), high impact (drives D7 retention)
   - *Design:* Cyan button, gold border when following, rose hint on hover
   - *Effort:* 2h backend (batch endpoint already done), 1h frontend

3. **Activity Feed on Home**
   - *Why:* 4/5 agree. Makes app "feel alive". Variable reward schedule (unpredictable refreshes)
   - *What shows:* Follow actions, like actions, score updates (6 items max, 30s refresh)
   - *Why limited:* More than 6 items = noise. Less than 6 = doesn't feel active.
   - *Design:* 280px height card, auto-scroll, timestamps
   - *Effort:* 2h frontend (backend endpoints ready)

4. **Friends Leaderboard**
   - *Why:* 5/5 agree > Global. Local rivalry is stronger retention driver.
   - *Scope:* Show people you follow + their scores (separate tab on /compete)
   - *Design:* Same layout as global, but filtered to follows
   - *Effort:* 1h (query + UI filtering)

5. **Shareable Team Cards**
   - *Why:* 2/5 strongly emphasize as the real viral loop
   - *What:* After draft, show formation card + "Share to Twitter" CTA
   - *Pre-filled Tweet:* "I drafted @user1 @user2 @user3 @user4 @user5 in Foresight. Beat me if you can." + formation screenshot
   - *Design:* Gold borders, clear formation, rank badge
   - *Effort:* 2h frontend (Puppeteer screenshot already working)

6. **Tapestry Visibility (Subtle)**
   - *Why:* Judges ARE developers. Show that we use Tapestry, but don't make it marketing.
   - *What shows:* "Published to Tapestry" badge on profile, "Saved to Tapestry" on draft success
   - *What NOT:* No splash screens, no "Powered by Tapestry" banners
   - *Design:* Small badge, context-aware messaging
   - *Effort:* 2h (badge already done, just more visibility)

### Tier 2 - NICE-TO-HAVE (If Time)
7. **Likes** (IF we have 4+ extra hours)
   - *Why:* Design Lead designed it, but 3/5 say delay
   - *Only if:* Everything else is perfect AND we have buffer time
   - *Design:* Heart icon, gold filled, 1.15x scale animation
   - *Effort:* 2-3h

### Tier 3 - EXPLICITLY CUT (No Time Budget)
8. **Comments** ❌
   - *Why:* 4/5 explicitly say NO. Toxicity risk, moderation burden, dilutes competition focus.
   - *Savings:* 3+ hours
   - *Alternative:* If users want discussion, they tweet about it (off-app)

---

## PART 3: ARCHITECTURE - How Features Connect

### The Engagement Loop (Wiring Diagram)

```
User Opens App (TRIGGER: Status Anxiety - "Where do I rank?")
                ↓
        [Dashboard Display]
          ├─ Your Rank (#47) ← LIVE UPDATED every 30s
          ├─ Your Team Score (47/150 pts) ← LIVE UPDATED
          └─ Activity Feed (6 items) ← Shows who's climbing
                ↓
      (VARIABLE REWARD SCHEDULE)
   User checks scores 3-5x per day
         (highest retention)
                ↓
         [Leaderboard Tab]
      ├─ Global View (everyone)
      └─ Friends View (people I follow) ← LOCAL RIVALRY
                ↓
    [Score Change Animation]
   (green up ↑, red down ↓)
         (emotional hit)
                ↓
       [Completion Moment]
    User drafts/updates team
                ↓
     [Shareable Card Modal]
  "Share this team to Twitter"
   (pre-filled with handles)
                ↓
    User shares on X
  (Reach: 100-10K followers)
                ↓
   New users discover Foresight
    (Growth via external loop)
```

### Data Flow

**Follow Action:**
1. User clicks "Follow" on profile/leaderboard
2. Frontend calls `POST /api/tapestry/follow` (existing)
3. Backend stores in Tapestry
4. Frontend updates button state (cyan → gold border)
5. Toast confirmation: "Following @user"
6. Activity Feed auto-refreshes in 30s

**Activity Feed:**
1. Every 30 seconds, frontend polls `GET /api/tapestry/activity-feed`
2. Returns 6 most recent actions from people you follow
3. Shows: [User] followed [User] | [User]'s score jumped +15
4. No pagination (fixed 6 items, newest first)
5. Optional: Click → go to that user's profile

**Friends Leaderboard:**
1. On `/compete` page, add second tab: "Friends"
2. Query: `GET /api/league/leaderboard?type=friends&userId={me}`
3. Shows only people where `follows[me] = true`
4. Same layout as global (rank, user, score, change)

**Shareable Team Card:**
1. After draft submission, modal shows:
   - Formation visual (captain + 4 slots with colors)
   - "Share to Twitter" button
   - "Or copy link" option
2. On click, Puppeteer captures `/draft?teamId=123&readonly=true`
3. Pre-fills tweet: "I drafted @user1 @user2 @user3 @user4 @user5. Can you beat me?"
4. User hits "Post" → tweet goes out with screenshot

---

## PART 4: CONFLICT RESOLUTIONS

### Conflict 1: Activity Feed Scope
**Positions:**
- Growth Hacker: Minimal (just scores)
- Design Lead: Rich (6 items with social actions)
- User Advocate: Questioning if users even want social in a competition app

**Resolution: HYBRID APPROACH**
- Show only 6 items (not 20) = minimal, not bloated
- Include social actions (follow, score, likes) = gives context
- No comments = keeps focus on competition
- 30s auto-refresh = variable reward schedule (strongest retention)

**Rationale:** Psychological principle of "variable reward" (like slot machines) keeps users engaged. 6 items is enough to feel "alive" without being noisy. Social actions provide context without turning it into a forum.

---

### Conflict 2: Like Feature
**Positions:**
- Design Lead: Built it, should ship
- Psychologist: Delay until week 1
- Growth Hacker: Skip entirely

**Resolution: CUT FOR MVP, ADD WEEK 2**
- MVP: Follow + Activity Feed only (Tier 1)
- Week 2: Add likes if D7 retention is strong
- Savings: 2-3 hours for polish
- Risk: Zero (feature is non-critical, users won't miss it)

**Rationale:** Limited time budget. Likes are "medium motivation" by behavioral science. Follow + Activity Feed + Live Scoring already drive retention. If we nail those three, likes become bonus, not lifeline.

---

### Conflict 3: Tapestry Visibility
**Positions:**
- Business Strategist: "Developer narrative, not user value"
- Judge persona: "We ARE developers, show that you use it"
- Design Lead: Subtle messaging

**Resolution: DEVELOPERS ARE JUDGES**
- For hackathon: Prominent enough that judges see "Hey, this is built on Tapestry"
- For users: Subtle ("Saved to Tapestry" badge, not marketing splash)
- Strategy: Two messaging paths:
  - **User-facing:** "Your teams are stored on-chain with Tapestry"
  - **Judge-facing:** "This is a real Tapestry integration, storing 8 content types"

**Rationale:** Hackathon judges are developers evaluating integration quality. Hiding Tapestry = wasting part of the $5K bounty narrative. But users don't care about Tapestry specifically — they care that their data is "real" and "safe".

---

### Conflict 4: Share Mechanism Priority
**Positions:**
- Growth Hacker: Twitter share (external, viral)
- Design Lead: In-app sharing (social feed)
- Both: Different mechanisms, same goal

**Resolution: TWITTER SHARE IS PRIMARY, ACTIVITY FEED IS SECONDARY**
- Primary viral loop: Draft → Share to Twitter → Reach 100-10K followers
- Secondary loop: Activity Feed shows "User shared team to Twitter" (social proof)
- Why: External sharing has 100x reach. Twitter is where CT is. In-app sharing reinforces but doesn't drive growth.

**Rationale:** Business Strategist notes "shareable team cards are the real viral loop". Growth Hacker agrees. This is how hackathon attendees will discover the project on X.

---

### Conflict 5: Friends Leaderboard with Small User Base
**Issue:** At hackathon with 50 demo users, "friends" might only be 2-3 people per user

**Resolution: KEEP IT ANYWAY**
- Why: It's only 1h effort and demonstrates the concept
- For demo: We'll seed demo user with 10-15 "friends" (other demo users)
- In production: This becomes the retention driver as user base grows
- UX messaging: "Compete with friends" is the narrative, even if users manually follow peers

**Rationale:** This is a framework decision. Small user base doesn't make it less important; it just makes it less visible in the MVP. Once users invite friends, this becomes the #1 leaderboard people check.

---

## PART 5: TAPESTRY STRATEGY (Users vs. Judges)

### For Users (On-App Messaging)
```
When drafting:
→ "Your team is saved to Tapestry (on-chain social graph)"

When checking profile:
→ Subtle badge: "Saved to Tapestry Protocol" (small, gray text)

When sharing team:
→ No explicit Tapestry mention (just "Share to Twitter")
```

**Philosophy:** Users don't care about Tapestry. They care that their data is safe, verifiable, and can't be lost.

### For Judges (In Video + GitHub)
```
Demo script mentions:
"Your teams and scores are stored on Solana's Tapestry Protocol,
making them immutable and shareable across apps."

GitHub README shows:
- Integration with 8 Tapestry features (profiles, content, follows, likes, comments, activity)
- Diagram of data storage on Tapestry
- Benefits: Composability, verifiability, user ownership
```

**Philosophy:** Judges are developers. Show technical depth and thoughtful integration.

---

## PART 6: VIRAL LOOP MECHANISM

### The Specific Growth Mechanism

**Step 1: User Attraction (T=0)**
- Lands on landing page
- Sees formation hero + "Start Playing" CTA
- Impression: "This looks cool and easy"

**Step 2: First Value (T+90 seconds)**
- Clicks → Privy login (email or Google)
- Auto-redirects to formation builder
- Picks 5 influencers, submits team
- Sees leaderboard with rank

**Step 3: Engagement Trigger (T+120 seconds)**
- Sees "Share to Twitter" button
- Formation card is beautiful (gold borders, tier colors visible)
- Pre-filled tweet has their picks

**Step 4: Viral Amplification (T+130 seconds)**
- User posts: "I drafted @vitalik @balaji @jack @raydium @solend in Foresight. Can you beat me?"
- Reaches their followers (100-10K)
- Followers see: Formation visual, clear game mechanics, mention of specific influencers

**Step 5: New User Conversion**
- Follower clicks link in tweet
- Repeats Step 1
- Cycle continues

**Growth Math:**
- If 50 demo users each share to Twitter
- Average reach: 500 followers per user
- 25,000 impressions
- If 5% CTR: 1,250 new users
- If 20% convert: 250 new players

**How to measure:** Track `utm_source=twitter` in analytics

---

## PART 7: DESIGN SPECIFICATIONS

### Follow Button
**States:**
- Not following: Cyan background (`bg-cyan-500`), "Follow" text
- Hovering (not following): Gold glow, cursor pointer
- Following: Gold border (`border-2 border-gold-500`), white text
- Hovering (following): Rose tint (`text-rose-500`), shows unfollow hint
- Loading: Spinner overlay

**Placement:**
- Profile header (next to profile name)
- Leaderboard row (right side)
- Activity feed action (secondary)

**Toast confirmation:**
- "Following @username" (success, green)
- "Unfollowed @username" (info, gray)

### Activity Feed Card
**Layout:**
- Height: 280px (mobile-friendly)
- Scroll: Vertical, auto-refresh every 30s
- Items: 6 maximum
- Each item: 40px (timestamp + action + avatar)

**Content:**
```
┌─────────────────────────────────┐
│ 🟢 Live Feed                    │
├─────────────────────────────────┤
│ 2m ago                          │
│ @user1 followed @user2          │
│                                 │
│ 5m ago                          │
│ @user3's score jumped +15 pts   │
│                                 │
│ 12m ago                         │
│ @user4 liked @user5's team      │
│                                 │
│ (scroll for more)               │
└─────────────────────────────────┘
```

**Actions:**
- Click on user → Go to their profile
- Click on action → (Maybe) Go to related team/leaderboard
- No inline actions (just view data)

### Friends Leaderboard Tab
**On `/compete` page:**
- Tab navigation: "Global" | "Friends"
- Same layout as global leaderboard
- Filter logic: Show only users where `follows[current_user] = true`
- Empty state: "Follow players to see their rankings" (with follow button)

**Columns:**
- Rank (just number in this view, no global context)
- Username
- Weekly Score
- Score Change (from yesterday)

### Shareable Team Card
**Modal After Draft:**
```
┌─────────────────────────────────────────┐
│            Draft Locked! 🎉             │
├─────────────────────────────────────────┤
│                                         │
│     [Formation Visual Here]             │
│     └─ Captain (gold glow)              │
│     └─ 2 A-Tier (cyan)                  │
│     └─ 2 B-Tier (emerald)               │
│                                         │
│  "Share this team to Twitter"           │
│  [Share to Twitter Button] [Copy Link]  │
│                                         │
│  Pre-filled tweet:                      │
│  "I drafted @vitalik @balaji @jack     │
│   @raydium @solend in Foresight.       │
│   Can you beat me?"                     │
│                                         │
│  [View on Leaderboard]                  │
└─────────────────────────────────────────┘
```

**Design:**
- Gold border around formation
- Tier colors prominent (easy to screenshot)
- Tweet text is clear + achievable
- Button text: "Share to Twitter" (not "Tweet" or "Post")

### Tapestry Visibility Badges
**Profile page:**
- Small gray badge: "Saved to Tapestry Protocol"
- Font: 12px, `text-gray-400`
- Position: Below follower count

**Draft success modal:**
- Subtle text: "Your team is stored on Tapestry"
- Not a button, not interactive
- Just confirmation text

**Leaderboard:**
- Small icon + tooltip: Hover shows "This leaderboard data is stored on Tapestry"

---

## PART 8: WHAT WE'RE CUTTING & WHY

### Comments ❌
**Effort saved:** 3+ hours (backend + frontend + moderation infrastructure)
**Why cut:**
- 4/5 experts explicitly say NO
- Toxicity risk at 100+ users (people attack predictions)
- Moderation burden (need mods, delete policies, reporting)
- Dilutes product focus (we're a prediction game, not a forum)
- Users can discuss on Twitter (where the real conversation is)

**Alternative:** If users want to discuss, they tweet about it. We just benefit from the mentions.

---

### Likes (For MVP) ❌
**Effort saved:** 2-3 hours (backend done, frontend UI)
**Why delay:**
- 3/5 say medium ROI or "delay"
- Medium motivation (nice to have, not critical)
- Users won't miss it in week 1
- If we have time in week 2, add it
- Payoff: If D7 retention is already strong without it, skip entirely

**When to add:** After hackathon if metrics show engagement plateau.

---

### Advanced Leaderboard Features ❌
**What we're NOT building:**
- Seasonal/monthly leaderboards (stick with weekly)
- Skill ratings (just show rank and points)
- Win/loss records (too much complexity)
- Playoff brackets (not fantasy sports, no tournaments)

**Why:** Simplicity. Users care about: "Where do I rank?" and "Can I beat my friends?" Everything else is noise.

---

### In-App Notifications ❌
**What we're NOT building:**
- Push notifications (web doesn't support well, and users mute them anyway)
- Email notifications (out of scope)
- SMS alerts (out of scope)

**What we ARE doing:** Toast notifications + Activity Feed refresh. That's enough.

---

### Advanced Analytics ❌
**What we're NOT building:**
- Win rate per influencer
- Skill score breakdown
- Head-to-head stats
- Historical comparison

**Why:** No time, no user demand. If users want this, it's a week-2 feature.

---

## PART 9: IMPLEMENTATION SCHEDULE

### Days 4-5 (48 hours total)

**Day 4 (Day 1 of 5-day sprint) - 8 hours**
- [ ] 2h: Follow button component + state management
- [ ] 1h: Batch following-state endpoint (if needed; might be done)
- [ ] 2h: Activity Feed component + 30s polling
- [ ] 1.5h: Friends Leaderboard tab + filtering
- [ ] 0.5h: Toast confirmations + error handling
- [ ] 1h: Manual testing + bug fixes

**Day 5 (Day 2 of 5-day sprint) - 8 hours**
- [ ] 2h: Shareable team card modal + Twitter share
- [ ] 1h: Tapestry visibility badges (profile + dashboard)
- [ ] 2h: Mobile responsive refinement
- [ ] 2h: Full E2E testing (follow flow, share flow, leaderboard)
- [ ] 1h: Screenshot verification + demo prep

**Days 6-7 (Buffer + Polish)**
- Quality assurance
- Demo video recording
- Edge case fixes
- Performance optimization

---

## PART 10: SUCCESS CRITERIA

### Must Have (Non-Negotiable)
- [ ] Follow button works end-to-end (save to Tapestry, UI updates)
- [ ] Activity Feed shows in real-time (30s refresh)
- [ ] Friends Leaderboard displays only followed users
- [ ] Shareable team card with Twitter pre-fill works
- [ ] Tapestry badges show on profile + draft success
- [ ] Live scoring still works (no regressions)
- [ ] Zero TypeScript errors
- [ ] Mobile responsive

### Nice to Have (If time permits)
- [ ] Animations on follow/unfollow
- [ ] Like button (if D7 pacing allows)
- [ ] Enhanced activity feed filtering (follow vs. score updates)

### Fallback Plan (If features break)
1. Remove Activity Feed (keeps Follow + Friends Leaderboard + Shares)
2. Remove Friends Leaderboard (keeps Follow + Activity Feed + Shares)
3. Remove Follows (keeps Shares + Tapestry badges)
4. If step 3: Still scores +2-3 points, still submittable

---

## PART 11: JUDGE NARRATIVE

### What Judges Will See
1. **Product clarity:** "Draft 5 CT influencers" (instantly clear)
2. **Social graph:** "Follow players to see their ranks" (shows Tapestry usage)
3. **Live scoring:** Leaderboard updating in real-time (technical sophistication)
4. **Viral mechanism:** "Share team to Twitter" (growth story)
5. **Data persistence:** "Saved to Tapestry" (blockchain integration)

### Scoring Impact Estimate (Solana Graveyard Rubric)
- **Integration:** 38 → 40 (+2, visible Tapestry social features)
- **Innovation:** 25 → 27 (+2, formation visual + social graph)
- **Polish:** 18 → 19 (+1, animations, toasts, badges)
- **Narrative:** 5 → 7 (+2, clear demo showing all features)
- **Total:** 86 → 93 (+7 points) = **1st place, $2.5K**

---

## SUMMARY TABLE

| Feature | Status | Effort | ROI | Timeline |
|---------|--------|--------|-----|----------|
| Live Scoring | ✅ DONE | 0h | Critical | - |
| Follow Button | 📋 TODO | 3h | High | D4 (2h) |
| Activity Feed | 📋 TODO | 2h | High | D4 (2h) |
| Friends Leaderboard | 📋 TODO | 1.5h | High | D4 (1.5h) |
| Shareable Team Card | 📋 TODO | 2h | High | D5 (2h) |
| Tapestry Badges | 📋 TODO | 1h | Medium | D5 (1h) |
| **Total** | - | **9.5h** | - | **48h available** |

---

## FINAL SIGN-OFF

**All 5 perspectives agree on:**
1. Live scoring is non-negotiable
2. Follow + Friends Leaderboard drives retention
3. Comments should be cut
4. Tapestry should be visible but not dominant
5. Shareable cards are the real viral loop

**This plan is final. No more debates. Ship it.**

---
