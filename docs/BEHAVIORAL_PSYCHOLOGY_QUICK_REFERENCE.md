# Behavioral Psychology Quick Reference: Social Features

**TL;DR:** Build follow + activity. Delay likes. Skip comments until 5K users.

---

## THE FOGG BEHAVIOR MATRIX (B = Motivation × Ability × Prompt)

| Feature | Motivation | Ability | Prompt | Score | Verdict |
|---------|-----------|---------|--------|-------|---------|
| **Follow** | HIGH (status seeking) | EXCELLENT (one-click) | PERFECT (leaderboard) | 🟢 BUILD NOW | MUST-HAVE |
| **Activity Feed** | EXCELLENT (FOMO) | EXCELLENT (just scroll) | EXCELLENT (auto-refresh) | 🟢 BUILD NOW | MUST-HAVE |
| **Likes** | HIGH (peer validation) | EXCELLENT (frictionless) | MODERATE (visible but not highlighted) | 🟡 BUILD LATER | IF TIME |
| **Social Counts** | MODERATE (vanity metric) | EXCELLENT (just reading) | WEAK (can demoralize new users) | 🟡 BUILD LATER | POLISH ONLY |
| **Comments** | RISKY (attracts toxics) | VERY HIGH (too easy spam) | WEAK (no incentive) | 🔴 SKIP | POST-MVP |

---

## WHY FOLLOW IS THE FOUNDATION

**Psychology:**
- People want to compete with people they follow (loss aversion: "I can't let them beat me")
- Seeing rank #1 on leaderboard triggers "follow them to learn" motivation
- Recursive engagement: Follow → Check their score → See activity feed → Check app more

**Real-world analogy:**
- DraftKings: Strongest engagement driver is following power users
- Robinhood: Users who follow friends trade 3x more frequently
- Sleeper app: 60% of power users have >50 follows

**Why it works:**
- Motivation ✅ (you want their strategy)
- Ability ✅ (one click)
- Prompt ✅ (right when you're comparing yourself)

---

## WHY ACTIVITY FEED CREATES URGENCY

**Psychology:**
- FOMO is the #1 driver of social app engagement (stronger than likes, comments, or follows)
- Seeing "X just jumped to #1" while you're sleeping = anxiety + need to check
- Real-time updates create slot-machine effect (check app compulsively)

**The variable reward:**
```
Check app → 30% chance of score update → dopamine hit → check again
```

**Why it works:**
- Motivation ✅ (FOMO)
- Ability ✅ (just scrolling)
- Prompt ✅ (updates every 30s, creating habit)

---

## WHY LIKES CAN WAIT

**Psychology:**
- Likes only feel good if you're emotionally invested in the game
- New users (day 1) with 0 likes feel depressing ("nobody values my team")
- Likes work AFTER people have played 1+ week (sunk cost = emotional investment)

**The timing issue:**
- Day 1-2: No one has earned enough to feel proud yet
- Day 3-7: First wins happen, people want validation (GOOD TIME FOR LIKES)
- Week 2+: Likes become social proof mechanism (PEAK EFFECTIVENESS)

**Why delay it:**
- Users need to WIN first (feel good about their team)
- Then they want VALIDATION (likes prove they were right)
- Adding likes too early = noise, because there's no pride to validate

**DraftKings lesson:** Likes launched in week 3, not week 1. Adoption much higher.

---

## WHY COMMENTS ARE A TRAP

**The problem:**
- Comments attract three types of people:
  1. Show-offs (explain their genius)
  2. Trolls (mock others)
  3. Contrarians (argue about strategy)
- New community = no norms yet = turns toxic fast

**Real-world examples:**
- Reddit: Comment sections on new subs become flamewars
- Robinhood app: Comments turned people OFF more than on (year 1)
- Sleeper app: Only enables comments in group chats (moderated), NOT public

**The #1 risk:**
- New player makes their first team
- Someone comments "lol that's a terrible pick"
- New player quits (killed before they started)

**When to add comments:**
- Only after 5,000+ users (establish culture)
- Only with moderation team (flag trolling)
- Only with clear guidelines (no mocking)

**Alternative:** Let Twitter be the discussion platform (they're already there)

---

## COGNITIVE BIASES TO LEVERAGE

### Social Proof (copies what others do)
**Implementation:** Activity feed showing "200+ people liked this team" = others doing it = I should too

### Loss Aversion (hurts worse than winning feels good)
**Implementation:** "X jumped to #1 while you were sleeping" = anxiety + need to catch up

### FOMO (fear of missing out)
**Implementation:** Activity feed auto-refresh every 30s = something could happen anytime = check constantly

### Endowment Effect (value what's mine)
**Implementation:** Show likes on YOUR teams prominently = your team is valued by others

### Reciprocity (if you help me, I help you)
**Implementation:** "X followed you" notification = triggers "follow them back" impulse

---

## SOCIAL COMPARISON: THE TIPPING POINT

**Safe zone: <500 users**
- Everyone feels special (top 10%)
- Social comparison feels good ("I beat most people")

**Danger zone: 500-2,000 users**
- Top 1% feel like winners, everyone else feels like losers
- Someone at rank #500 realizes they're in bottom 90%
- Learned helplessness kicks in ("I can never catch up")

**Mitigation (CRITICAL):**
- Show percentile not rank: "Top 15%" instead of "Rank 2,450" ✅
- Show tier leaderboards: "Players ranked 400-600" not global ✅
- Hide follower counts until user has 5 followers (don't demoralize) ❌ (not in current spec)

---

## RED FLAGS (STOP IF YOU SEE THESE)

| Signal | What It Means | Action |
|--------|---------------|--------|
| Follow reciprocal rate <20% | Feature isn't working, users don't understand it | Redesign follow button, add tooltip |
| Activity feed CTR <10% | Users don't care about others' activity | Personalize (show follows first) or delay feature |
| New users quit before reaching 5 followers | Social comparison anxiety | Hide follower counts, show percentile instead |
| Comments turn negative | Toxicity | Pause comments, establish community guidelines |
| Users checking app >5x per hour, but report anxiety | Addiction, not engagement | Reduce notification frequency, add user control |

---

## PRACTICAL CHECKLIST

### MVP Launch (6 hours)
- [ ] Follow button on leaderboard (PRIMARY PLACEMENT)
- [ ] Follow button on profile (secondary)
- [ ] Activity feed shows personalized activity (follows first, not random)
- [ ] 30s refresh rate (not too fast, not too slow)
- [ ] Loading spinner during follow action
- [ ] Error handling (toast notification)
- [ ] Test: Do 50% of internal testers follow at least 1 person?
- [ ] Test: Do 80%+ scroll activity feed?

### If Adoption Good (Week 2)
- [ ] Add like buttons (with animation burst)
- [ ] Add social counts on profile (follower/following)
- [ ] Test: Does like count grow? (target: 5-10% of views get likes)

### If Retention Stable (Week 3)
- [ ] Add comments (with moderation, community guidelines)
- [ ] Add XP reward for comments (incentivize quality)

### If Community Toxic
- [ ] Rollback comments immediately
- [ ] Add moderation rules + reporting
- [ ] Try again in month 2 with stronger enforcement

---

## MESSAGING FOR DIFFERENT USER TYPES

### For New Users (Day 1):
- Emphasize: "Follow power users to learn their strategy"
- Don't show: Follower counts (would be 0)
- Show: Leaderboard with tier-matched players

### For Active Users (Week 1+):
- Emphasize: "Compete with your friends, see real-time rankings"
- Show: Activity feed of follows' activities
- Show: Follower count (now >5, feels good)

### For Power Users (Week 2+):
- Emphasize: "Celebrate your wins with likes, build your following"
- Show: Full social graph (follows, likes, comments)
- Show: Sharing features (share rank to Twitter)

---

## THE ONE-SENTENCE VERSION

**Follow = competitive accountability. Activity = FOMO. Likes = celebration. Comments = risky. Launch follow + activity now, add likes in week 2, save comments for 5K+ users.**

---

## RELATED DOCUMENTS

- **Full analysis:** `BEHAVIORAL_PSYCHOLOGY_SOCIAL_FEATURES.md` (3,000 words, all the research)
- **UX spec:** `SOCIAL_FEATURES_UX_SPEC.md` (where to place buttons)
- **Implementation plan:** `SOCIAL_FEATURES_QUICK_REFERENCE.md` (how to build it)

