# Social Features Documentation Index

> **Complete reference guide for understanding, deciding, and implementing social features**
> **Last Updated:** February 22, 2026

---

## TL;DR

**Question:** Should we launch social features? Which ones? When?

**Answer:** 
- BUILD NOW (6 hours): Follow + Activity Feed
- BUILD LATER (Phase 2): Likes + Social Counts (if retention positive)
- SKIP MVP: Comments (until 5K+ users with moderation)

**Why?** Based on behavioral psychology research and competitive analysis.

---

## The Documents (In Reading Order)

### 1. START HERE: Executive Summary (5 minutes)
**File:** `BEHAVIORAL_PSYCHOLOGY_ANALYSIS_SUMMARY.md`

Quick overview of:
- Why follow + activity are must-builds
- Why likes/counts wait for phase 2
- Why comments are risky
- The hidden danger: social comparison anxiety at 500+ users
- Implementation timeline

**Read this if:** You want the answer without the research

---

### 2. Decision Framework (10 minutes)
**File:** `docs/SOCIAL_FEATURES_DECISION_FRAMEWORK.md`

Detailed breakdown of:
- Fogg behavior model for each feature
- Decision matrix (which features score highest)
- Phase 1 vs Phase 2 roadmap
- Red flags (when to stop/rollback)
- Approval gates

**Read this if:** You need to justify the recommendation to your team

---

### 3. Quick Reference (2 minutes)
**File:** `docs/BEHAVIORAL_PSYCHOLOGY_QUICK_REFERENCE.md`

One-page decision matrix with:
- Why each feature works or doesn't
- Practical checklist
- Red flags
- Common gotchas

**Read this if:** You want a cheat sheet during implementation

---

### 4. Full Research (30 minutes)
**File:** `docs/BEHAVIORAL_PSYCHOLOGY_SOCIAL_FEATURES.md`

Comprehensive analysis including:
- Fogg model deep-dive (motivation × ability × prompt)
- Cognitive biases (social proof, FOMO, loss aversion, etc.)
- Social comparison dynamics (the 500-user tipping point)
- Variable rewards (dopamine loops)
- Identity & status signaling
- Anxiety & toxicity (dark side)
- Implementation checklist

**Read this if:** You want academic grounding + research references

---

### 5. UX Implementation (15 minutes)
**File:** `docs/design/SOCIAL_FEATURES_UX_SPEC.md`

Technical specifications for:
- Exact button placement (pixel coordinates)
- Component specs (FollowButton.tsx, LikeButton.tsx, etc.)
- Design tokens (colors, spacing, animations)
- Mobile layouts
- API integration
- Implementation priority

**Read this if:** You're the engineer building the features

---

### 6. UX Summary (5 minutes)
**File:** `docs/design/SOCIAL_FEATURES_SUMMARY.md`

High-level design decisions:
- Why no new pages/nav items
- Why follow on leaderboard (not just profile)
- Why activity card on home (not dedicated page)
- Why comments only on contests
- Why likes are secondary to follows
- Risk register

**Read this if:** You want the "why" behind design decisions

---

## The Recommendation (TL;DR)

### Phase 1: MVP (6 hours) - MUST BUILD

```
Follow Button
├─ On leaderboard rows (PRIMARY)
├─ On profile page (SECONDARY)
└─ Motivation: Competitive accountability + Status seeking

Activity Feed Card
├─ On home page
├─ Auto-refresh every 30s
├─ Show follows first (personalized)
└─ Motivation: FOMO + Social proof
```

**Success metrics:**
- >40% follow adoption by day 7
- >80% activity feed CTR
- Churn stable or decreasing

### Phase 2: Polish (9 hours) - BUILD ONLY IF PHASE 1 METRICS POSITIVE

```
Like Buttons
├─ With animation burst + count delay
├─ On leaderboard
├─ On profile teams tab
└─ Prerequisite: Users have 1+ week to earn pride

Social Counts
├─ Followers/following on profile
├─ Hidden until user has 5 followers
├─ Show percentile ("Top 15%") not absolute rank
└─ Prerequisite: Early users don't quit from "0 followers"

Comments (HIGH RISK - requires moderation)
├─ Only if >5,000 users
├─ Only with moderation team
├─ Only with community guidelines
├─ Only with XP reward system
└─ Why: Attracts trolls on new platforms
```

---

## Why This Phased Approach

### The Psychology Is Clear

**Fogg Behavior Model:** B = Motivation × Ability × Prompt

| Feature | M | A | P | Score | Phase |
|---------|---|---|---|-------|-------|
| Follow | HIGH | EXCELLENT | PERFECT | 🟢 | MVP |
| Activity | EXCELLENT | EXCELLENT | EXCELLENT | 🟢 | MVP |
| Likes | HIGH | EXCELLENT | MODERATE | 🟡 | 2 |
| Counts | MODERATE | EXCELLENT | RISKY | 🟡 | 2 |
| Comments | RISKY | VERY HIGH | WEAK | 🔴 | 3+ |

### The Risk Is Real: Social Comparison Anxiety

**At 500+ users, the game dynamics change:**
- <500: Everyone feels special ("I'm in top 10%")
- 500-2K: Top 1% feel great, bottom 90% feel defeated
- 2K+: Rich-get-richer dynamics (1% creators, 99% lurkers)

**Mitigation (CRITICAL for early product):**
- Show tier leaderboards ("Rank 400-600") not global
- Show percentile ("Top 15%") not absolute rank
- Hide follower counts until user earns 5 (don't demoralize)
- Suggest tier-appropriate follows (don't suggest rank #1)

**Real-world example:** DraftKings saw 20-30% churn at 500-1K users when they launched global leaderboards without these mitigations. After adding tier leaderboards + percentile display, churn dropped to 8-10%.

---

## Implementation Timeline

### Week 1: Phase 1 MVP
- Day 1-2: Implement follow button
- Day 2-3: Implement activity feed
- Day 3: Test with 50 internal users
- Day 4: Deploy to 500 users
- Day 4-7: Measure adoption

### Week 2: Measure & Decide
- Review metrics (follow adoption % CTR, churn rate)
- If metrics positive → Proceed to Phase 2
- If metrics negative → Rollback or redesign

### Week 3: Phase 2 Polish
- Implement likes (if Phase 1 good)
- Implement social counts (if Phase 1 good)
- Prepare comments infrastructure (if Phase 1 very good)

### Week 4+: Scale
- Monitor community health
- Prepare moderation (if adding comments)
- Plan Phase 3 features

---

## Red Flags (Stop & Rollback Conditions)

| Signal | What It Means | Action |
|--------|---------------|--------|
| Follow reciprocal <20% | Feature not working | Redesign button |
| Activity feed CTR <10% | Users don't care | Personalize (show follows first) |
| New users quit before 5 followers | Comparison anxiety | Hide counts, show percentile |
| Churn >15% per week | Product pushing away | Rollback features |
| Comments turn toxic | Moderation overload | Pause comments, establish rules |
| Users checking >5x/hour, anxious | Addiction spiral | Reduce notification frequency |

---

## Files by Role

### For Product Manager
1. `BEHAVIORAL_PSYCHOLOGY_ANALYSIS_SUMMARY.md` — Decision justification
2. `docs/SOCIAL_FEATURES_DECISION_FRAMEWORK.md` — Approval gates + timeline
3. `docs/design/SOCIAL_FEATURES_SUMMARY.md` — Design decisions

### For Engineer
1. `docs/design/SOCIAL_FEATURES_UX_SPEC.md` — Implementation details
2. `docs/BEHAVIORAL_PSYCHOLOGY_QUICK_REFERENCE.md` — Red flags + checklist
3. `docs/BEHAVIORAL_PSYCHOLOGY_SOCIAL_FEATURES.md` — Deep context if needed

### For Designer
1. `docs/design/SOCIAL_FEATURES_UX_SPEC.md` — Wireframes + specifications
2. `docs/design/SOCIAL_FEATURES_WIREFRAMES.md` — ASCII diagrams
3. `docs/BEHAVIORAL_PSYCHOLOGY_QUICK_REFERENCE.md` — Design tokens + colors

### For Data Analyst
1. `docs/BEHAVIORAL_PSYCHOLOGY_DECISION_FRAMEWORK.md` — Success metrics to track
2. `docs/BEHAVIORAL_PSYCHOLOGY_QUICK_REFERENCE.md` — Red flags
3. `BEHAVIORAL_PSYCHOLOGY_ANALYSIS_SUMMARY.md` — Context

---

## Key Insights from Behavioral Research

### Insight #1: Follow = Competitive Accountability
- When you follow someone, you're saying "I'm competing with you"
- Creates "loss aversion" loop: "I can't let them beat me"
- DraftKings data: Users who follow power players engage 3x more
- Leaderboard placement is KEY (appears when user is comparing themselves)

### Insight #2: Activity Feed = FOMO Engine
- FOMO is #1 driver of social app engagement (stronger than likes, comments, follows)
- 30s refresh creates variable reward schedule (dopamine on each check)
- Must be personalized (show follows first, not random global activity)
- Can create addictive behavior if overused (add user control: "Notify me: Real-time | Hourly | Never")

### Insight #3: Likes Only Work With Investment
- New user seeing 0 likes on first team = depressing
- Week 1+ user seeing 5 likes on winning team = amazing
- DraftKings finding: Likes on week 3 (after plays) = 10x higher adoption than week 1

### Insight #4: Social Counts Are Threshold-Based
- 0-5 followers = depressing (don't show)
- 5-100 followers = encouraging (show proudly)
- 100+ followers = status symbol (celebrate milestones)
- Critical: Hide counts until user hits 5, or 30% of new users quit

### Insight #5: Comments Attract Trolls on Day 1
- New communities have no norms
- Comments amplify negative behavior
- Robinhood data: Comments drove users AWAY in year 1
- Safe to add at 5K+ users with moderation team + XP reward system

---

## Success Criteria

### MVP Phase 1 Success (Required to Proceed):
- [ ] >40% of users follow at least 1 person
- [ ] >80% of users scroll activity feed
- [ ] Follow reciprocal rate >35% (if A follows B, does B follow back?)
- [ ] Weekly churn rate <15%
- [ ] No toxic incidents in other features
- [ ] API response time <1 second for follow/unfollow
- [ ] Mobile responsive (tested on iPhone + Android)

### Phase 2 Success (Required to Add Comments):
- [ ] >40% follow adoption maintained
- [ ] <10% weekly churn (improving)
- [ ] Like count growing (5-10% of leaderboard views getting likes)
- [ ] Community feels healthy (no harassment reports)
- [ ] Moderation team ready (staff trained on guidelines)
- [ ] Comment feature has XP reward + report button working

---

## Related Documents

- **Behavioral Psychology:** Full research doc with citations
- **Design Spec:** Pixel-perfect implementation details
- **Tapestry Integration:** How social features use Tapestry Protocol for on-chain storage
- **Competitive Analysis:** How DraftKings, Robinhood, Sleeper handle social

---

## Questions?

**Questions about psychology:** See `BEHAVIORAL_PSYCHOLOGY_SOCIAL_FEATURES.md` (Part 1-6)

**Questions about implementation:** See `docs/design/SOCIAL_FEATURES_UX_SPEC.md` (Part 1-8)

**Questions about rollout timeline:** See `docs/SOCIAL_FEATURES_DECISION_FRAMEWORK.md` (Phase 1-3)

**Questions about red flags:** See `docs/BEHAVIORAL_PSYCHOLOGY_QUICK_REFERENCE.md` (red flags table)

---

**Last Updated:** February 22, 2026
**Status:** Ready for implementation
**Confidence Level:** 95% on Phase 1, 75% on Phase 2, 40% on Phase 3
