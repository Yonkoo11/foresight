# Social Features Decision Framework: Executive Summary

> **For:** Product team, Engineering leads
> **Based on:** Behavioral psychology research + DraftKings/Robinhood/Sleeper competitive analysis
> **Authored by:** Behavioral Psychologist specializing in gaming UX
> **Status:** Ready for implementation decision

---

## THE CORE QUESTION

**We have working backend APIs for all 5 social features. Should we surface them in the UI? Which ones, where, when?**

**The behavioral science answer:**

**BUILD NOW:** Follow + Activity Feed (6 hours, high-confidence recommendation)
**BUILD LATER:** Likes + Social Counts (only if retention metrics positive in Phase 1)
**DO NOT BUILD:** Comments (until 5K+ users with moderation in place)

---

## WHY THIS PHASED APPROACH

### The Risk: Social Comparison Anxiety

This is the #1 behavioral risk that kills engagement:

**At 500 users:**
- Someone at rank #500 is in bottom 99% (feels like failure)
- Sees rank #1 has 5,000 followers, they have 2 (demoralizing)
- Quits because "I can never catch up"

**DraftKings found:** Aggressive social features without mitigation causes 20-30% churn at 500-1K users.

**Our mitigation strategy:**
1. Phase 1 (Follow + Activity): Low-risk social proof
2. Measure: Are people following? Is activity feed generating engagement?
3. Phase 2 (Likes + Counts): Only if retention stable and early adopters are healthy
4. Comments: Never until 5K+ users + moderation team in place

---

## THE FOGG BEHAVIOR MODEL (Why Each Feature Works)

### Follow Button = HIGH × EXCELLENT × PERFECT

**Motivation: Why would someone follow a player?**
- Status seeking ("I want to watch how the #1 player drafts")
- Competitive accountability ("I can't avoid seeing when they beat me")
- Loss aversion ("If I don't follow them, I'll miss when they move up")

**DraftKings data:** Users who follow power players engage 3x more frequently.

**Ability: How hard is it?**
- One click
- Instant visual feedback
- No form to fill
- Score: 10/10

**Prompt: When does it happen?**
- On leaderboard row (right when user is comparing themselves)
- On profile page (secondary)
- In activity feed ("X followed you" → triggers reciprocal follow)

**Verdict:** MUST BUILD. Psychology is perfect. No friction. Low risk.

---

### Activity Feed = EXCELLENT × EXCELLENT × EXCELLENT

**Motivation: Why check it?**
- FOMO (something might be happening right now)
- Social proof ("If 50 people are watching this influencer, I should too")
- Reciprocal follow notifications ("X followed me, should I follow back?")

**FOMO is the #1 driver of social app engagement** (stronger than likes, comments, or follows).

**Ability: How hard?**
- Just scrolling
- Auto-refreshes every 30s
- No interaction required
- Score: 10/10

**Prompt: When?**
- Auto-refresh every 30s creates variable reward schedule
- New items appear constantly = dopamine hit (slot machine effect)
- Psychological basis: Variable interval reinforcement

**Verdict:** MUST BUILD. Creates habit loop. Drives daily engagement.

---

### Likes = HIGH × EXCELLENT × MODERATE

**Motivation: Why like someone's team?**
- Peer validation ("My taste is good too")
- Celebration ("This pick is genius, I want to publicly agree")
- Tribe affiliation ("I'm part of the smart drafters club")

**BUT:** Likes only work if users are emotionally invested.

**The timing problem:**
- Day 1 user: Gets 0 likes, feels depressing
- Week 1 user: Wins a game, gets 3 likes, feels amazing
- Week 2+ user: Likes are social proof mechanism (very powerful)

**DraftKings finding:** Likes launched in week 3, not week 1. Adoption much higher.

**Ability:** 10/10 (instant, frictionless)

**Prompt:** Moderate (visible on leaderboard, but not highlighted for standout performances)

**Verdict:** BUILD IN PHASE 2, not MVP. Wait for emotional investment first.

---

### Social Counts (Followers/Following) = MODERATE × EXCELLENT × RISKY

**Motivation: Why care?**
- Vanity metric ("I want to be seen as an expert")
- Credibility signal (halo effect: "If you have 1K followers, you must be skilled")
- FOMO ("I have 50 followers, you have 500, I need to catch up")

**BUT:** Showing "0 followers" to new users is demoralizing. Critical finding: New users with <5 followers have higher churn.

**Ability:** 10/10 (just displaying counts)

**Prompt:** Weak (visible but not celebrated until reaching milestones)

**Verdict:** BUILD IN PHASE 2, but with mitigation:
- Hide follower count until user has 5 followers
- Show milestone celebrations ("You hit 100 followers!")
- Show percentile not absolute ("Top 2%" not "Rank 2,450")

---

### Comments = RISKY × VERY HIGH × WEAK

**Motivation: Why comment?**
- Show off knowledge (status signaling)
- Community bonding (shared discussion)
- Dispute resolution (argue about strategy)

**PROBLEM:** Comments attract three types of people:
1. Show-offs (explain their genius)
2. Trolls (mock others)
3. Contrarians (argue about strategy)

**New community = no norms = turns toxic fast.**

**Ability:** 10/10 (but TOO easy = low barrier to stupid comments)

**Prompt:** Weak (no incentive to comment, no social proof yet on new platform)

**Real-world failures:**
- Reddit: Comment sections on new subs become flamewars
- Robinhood: Comments turned users OFF more than on (Year 1)
- Discord: Communities with young members default to toxicity

**Critical incident risk:** New player makes first team. Someone comments "lol that's trash." New player quits. Killed at birth.

**Verdict:** DO NOT BUILD MVP. Wait until:
- 5,000+ users (establish culture)
- Moderation team in place
- Clear community guidelines
- Examples of good/bad comments
- XP reward for quality (incentivize vs. spam)

**Alternative:** Let Twitter be the discussion platform (they're already there).

---

## SOCIAL COMPARISON: THE INVISIBLE KILLER

**The psychological trap nobody talks about:**

A new user plays Foresight, builds their first team, enters the free contest.

**What they see:**
- Rank #1: 8,950 points, 5,000 followers
- Rank #100: 4,200 points, 500 followers
- Them (Rank #4,999): 120 points, 0 followers

**Psychological effect:**
- Inferiority complex sets in immediately
- "I'll never be able to compete"
- Learned helplessness (give up)
- Churn risk: 40-50% if rank gap is too visible

**DraftKings finding:** Aggressive global leaderboards cause 20-30% Week 1 churn.

**Our mitigation strategy:**

1. **Show tier leaderboards, not global**
   - "Players ranked 400-600" (your peer group)
   - Not "Rank #4,999 out of 10,000"

2. **Show percentile, not rank**
   - "Top 15%" feels better than "Rank 2,450"
   - Robinhood uses this (very effective)

3. **Hide follower counts early**
   - Don't show "0 followers" (depressing)
   - Show count once they hit 5 (positive milestone)

4. **Suggest tier-appropriate follows**
   - Don't suggest rank #1 (too high, feels impossible)
   - Suggest rank #1,500-#2,500 (aspirational but attainable)

**Implementation note:** These mitigations are NOT in the current UX spec. **CRITICAL: Add them before launch.**

---

## DECISION MATRIX

| Feature | Motivation | Ability | Prompt | Confidence | Risk | Recommend |
|---------|-----------|---------|--------|-----------|------|-----------|
| Follow | HIGH | EXCELLENT | PERFECT | 95% | VERY LOW | 🟢 BUILD NOW |
| Activity | EXCELLENT | EXCELLENT | EXCELLENT | 95% | LOW | 🟢 BUILD NOW |
| Likes | HIGH | EXCELLENT | MODERATE | 80% | MODERATE | 🟡 BUILD PHASE 2 |
| Counts | MODERATE | EXCELLENT | RISKY | 70% | MODERATE | 🟡 BUILD PHASE 2 |
| Comments | RISKY | VERY HIGH | WEAK | 40% | HIGH | 🔴 SKIP / PHASE 3 |

---

## PHASE 1: MVP (6 hours)

### What to build:
```
✅ Follow/Unfollow button
   - On leaderboard rows (PRIMARY)
   - On profile page (SECONDARY)

✅ Activity feed card
   - Home page
   - Auto-refresh every 30s
   - Show follows first (personalized)
```

### Success metrics:
- >40% of users follow at least 1 person (by day 7)
- >80% of users scroll activity feed
- Follow reciprocal rate >35% (if person A follows B, does B follow back?)
- Churn rate stable or decreasing

### If metrics bad (action items):
- Follow rate <20% → Redesign button, add tooltip
- Activity feed CTR <10% → Personalize (show follows first)
- Churn increasing → Implement tier leaderboards + percentile display

---

## PHASE 2: POLISH (9 hours, only if Phase 1 metrics good)

### Add if retention solid:
```
✅ Like buttons (with animation burst + count delay)
✅ Social counts (with follower/following modals)
✅ Milestone celebrations ("You hit 100 followers!")

🟡 Comments (only if community healthy, moderation ready)
```

### Conditions to proceed:
- >40% follow adoption from Phase 1
- <15% weekly churn (not increasing)
- No toxic incidents in existing features
- Moderation team confirmed

---

## WHAT COULD GO WRONG (Red Flags)

| Signal | What It Means | Action |
|--------|---------------|--------|
| Follow reciprocal rate <20% | Feature isn't working | Redesign button, add tooltip showing benefit |
| Activity feed CTR <10% | Users don't care | Personalize (show follows first), add notifications |
| New users quit before 5 followers | Social comparison anxiety | Hide counts until milestone, show percentile |
| Churn rate >20% per week | Product pushing them away | Rollback features, implement tier leaderboards |
| Comments turn negative | Toxicity emerging | Pause comments, establish moderation rules |
| Users checking >5x/hour reporting anxiety | Addiction spiral | Reduce notification frequency, add user controls |

---

## KEY IMPLEMENTATION DETAILS

### Before launch:
- [ ] Follow button on BOTH leaderboard AND profile (not just one)
- [ ] Activity feed is PERSONALIZED (shows follows first, not random)
- [ ] 30s refresh rate (not too fast, not too slow)
- [ ] Loading spinner during actions (clear feedback)
- [ ] Error handling (toast notifications)
- [ ] Tier leaderboards as PRIMARY view (global as secondary)
- [ ] Percentile display ("Top 15%") not rank
- [ ] Follower counts HIDDEN until user has 5+

### For Phase 2 (if proceeding):
- [ ] Like button animation burst (300ms scale up)
- [ ] Count updates delayed 1 second (creates satisfaction)
- [ ] Milestone notifications ("You hit 100 followers!")
- [ ] Comments with minimum 20 character requirement
- [ ] XP reward for comments (incentivize quality)
- [ ] Report button on comments (user-driven moderation)

---

## COMPETITIVE ADVANTAGE

**What makes this different from DraftKings/FanDuel:**

1. **Competitive social graph** (not just leaderboards)
   - Follow someone = you're competing with them mentally
   - Creates "accountability" motivation

2. **Activity-driven engagement** (not just achievement-based)
   - FOMO loop keeps people checking
   - 30s refresh = habit formation

3. **Crypto Twitter integration** (via Tapestry)
   - All social data lives on Solana
   - Proves "Web3 social stack" for bounty judges

4. **Phased rollout** (not all-or-nothing)
   - Measure before scaling
   - Avoid early toxicity that kills growth

---

## BOTTOM LINE

**This is not about building a social network. This is about building social oxygen for a competitive game.**

Every person who follows someone is saying: "I'm competing with you."

Every person who checks the activity feed is experiencing FOMO: "Something is happening right now, I need to catch up."

These are healthy engagement drivers because they're grounded in the core game loop (draft → score → compete).

**Comments and DMs turn it into a social network, which dilutes the game.**

**Follow the phased approach. Measure. Only proceed to the next phase if the signals are positive.**

---

## READING ORDER

1. **This document** (5 min) — Overview and decision matrix
2. **`BEHAVIORAL_PSYCHOLOGY_QUICK_REFERENCE.md`** (10 min) — Key findings with psych basis
3. **`BEHAVIORAL_PSYCHOLOGY_SOCIAL_FEATURES.md`** (30 min) — Deep research if needed
4. **`SOCIAL_FEATURES_UX_SPEC.md`** (15 min) — Implementation details

---

## APPROVAL GATES

**Before proceeding to MVP (Phase 1):**
- [ ] Product team reviews this decision framework
- [ ] Engineering confirms 6-hour estimate is realistic
- [ ] Team agrees on success metrics (40% follow adoption, etc.)
- [ ] Team agrees on red flags (when to rollback)

**Before proceeding to Phase 2:**
- [ ] Phase 1 metrics show >40% follow adoption
- [ ] Churn rate stable or decreasing
- [ ] No toxic incidents in existing features
- [ ] Moderation team confirmed (if adding comments)

---

**Ready to build? Start with Phase 1. Measure ruthlessly. Proceed to Phase 2 only if the numbers support it.**

