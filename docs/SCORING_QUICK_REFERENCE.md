# Scoring Formula Quick Reference — The Quant

**For:** Team leads, product managers, engineers deciding on scoring improvements

**TL;DR:** Launch with current formula (V2.0). It's production-ready. Deploy V2.1 improvements in Week 2.

---

## Current Formula (V2.0) — SHIP THIS

```
WEEKLY SCORE = Activity(0-35) + Engagement(0-60) + Growth(0-40) + Viral(0-25)
             = 0-160 base
             × 1.5 (captain) or 1.0 (non-captain)
             + 12/8/4 (spotlight bonus for top-3 voted)
             = Final Score

Status: ✅ Tested, working, zero blockers
Tests: 64/64 passing
```

### What Each Category Measures

| Category | Formula | Measures | Notes |
|----------|---------|----------|-------|
| **Activity** | `min(35, tweets × 1.5)` | Consistency, output volume | Caps at 24 tweets (good, prevents spam) |
| **Engagement** | `sqrt(avg_likes + avg_RTs×2 + avg_replies×3) × 1.5 × vol_mult` | Quality of engagement per tweet | Vol multiplier = `tweets/10` (will improve to log scale in V2.1) |
| **Growth** | `min(20, followers/2K) + min(20, growth% × 5)` | Follower growth | Balanced absolute + rate-of-growth |
| **Viral** | `+4/7/12 pts per tweet in 10K-50K / 50K-100K / 100K+ ranges` | Explosive engagement | Currently estimated from avg engagement (acceptable) |

---

## Data Pipeline: Confirmed Working

```
TwitterAPI.io (5.5s rate limit)
  ↓
Weekly Snapshots (Monday + Sunday)
  ↓
Delta Calculations (followers gained, engagement totaled)
  ↓
Scoring (weekly_snapshots → scoring formula → final score)
  ↓
Leaderboard (user_teams table, 60s polling)
```

**Data available:**
- ✅ Followers, following, tweet count
- ✅ Likes, retweets, replies per tweet
- ✅ Views, bookmarks, quote count (captured but not scored yet)
- ❌ Historical tweets older than 7 days (would need paid API tier)

---

## Key Insights: Why This Formula Works

### 1. Normalization Across Tiers (S-tier CZ vs. C-tier emerging)

**Activity:** Absolute (1.5 pts/tweet)
- S-tier tweets 30-40x/week → 35 pts (capped)
- C-tier tweets 2-5x/week → 3-7 pts
- ✅ Fair: Respects that both are doing well for their tier

**Growth:** Hybrid (absolute + rate)
- Absolute: 1 pt per 2K followers gained
- Rate: 5 pts per 1% growth
- ✅ Fair: 1% growth for 8M account is harder than 3% for 50K account

**Engagement:** Normalized by sqrt + volume multiplier
- sqrt() reduces impact of extreme followers
- Volume multiplier prevents penalizing 3-tweet quiet weeks
- ⚠️ Room for improvement: Log scaling instead of linear (V2.1)

### 2. Edge Cases Handled

| Edge Case | Behavior | Status |
|-----------|----------|--------|
| 0 tweets (silent week) | Scores 0 (correct) | ✅ |
| 1-2 tweets (busy person) | Gets 50-70% credit (good) | ⚠️ Could be better with log scale |
| High engagement, low followers | Scores well (correct) | ✅ |
| Low engagement, high followers | Scores moderate (correct) | ✅ |
| New account, explosive growth | Growth score high (correct) | ✅ |

---

## Three Tiers of Improvement

### Tier 1: Polish (Now, 0-1 hour impact)

✅ **Already done:**
- Captain multiplier (×1.5)
- Spotlight bonuses (+12/+8/+4 flat points)
- Edge case handling (null metrics, division by zero)

---

### Tier 2: Incremental Fixes (Week 2, 3-4 hours impact)

These are safe, low-risk improvements:

**Fix 1: Log Scaling for Engagement Volume (1 hour)**

Current:
```typescript
volume = min(1.0, tweets_analyzed / 10);  // Linear
```

Better:
```typescript
volume = min(1.0, Math.log10(tweets_analyzed + 1) / Math.log10(11));  // Log
// 3 tweets = 50% credit (vs. 30%), 5 = 60% (vs. 50%), 10+ = 100%
```

**Impact:** C-tier quiet weeks go from penalized to fair. +1 point on judges' "fairness" rubric.

**Fix 2: Rate-Weighted Growth (1 hour)**

Current:
```typescript
absolute = min(20, followers / 2000);
rate = min(20, growth_rate * 5);
```

Better:
```typescript
absolute = min(10, followers / 5000);  // Lower weight on absolute count
rate = min(30, growth_rate * 10);      // Higher weight on rate
```

**Impact:** Rewards relative growth (harder for big accounts). Fairer across tiers.

**Fix 3: Momentum Detection (2-3 hours)**

Add bonus for "hot streaks":
```typescript
momentum = 0;
if (growth_rate > 3%) momentum += 3;  // Accelerating
if (engagement_quality_improved_20_pct) momentum += 4;
if (actual_viral_tweet_detected) momentum += 5;
return min(10, momentum);
```

**Impact:** Adds dynamism, rewards emerging voices.

---

### Tier 3: Major Overhaul (Week 2+, 6-8 hours research)

These require more data/validation:

- [ ] Engagement Per Follower (EPF) index
- [ ] Bot detection (manual review first, then automated)
- [ ] Intra-week momentum tracking (requires more frequent snapshots)
- [ ] Viral tweet detection (actual, not estimated)

**Don't do these for hackathon.** Too risky, too late.

---

## One Metric: Engagement Per Follower (EPF)

If you had to pick ONE signal to predict "fantasy value," it's:

```
EPF = (Likes + Retweets + Replies) / Followers

CZ (8M followers, 10K avg engagement): EPF = 0.125% (modest efficiency)
Emerging (50K followers, 100 avg engagement): EPF = 0.2% (better efficiency)
Viral moment (50K followers, 17.5K engagement): EPF = 35% (exceptional)
```

**Why it matters:** Efficiency (points-per-follower) predicts fantasy output better than raw output.

**For hackathon:** Don't add this to scoring (breaks formula). Use it in Week 2 for player selection guidance ("Show me highest-efficiency influencers").

---

## Testing Checklist

Before submitting / deploying:

- [ ] Run 10 sample contests, verify scores calculate correctly
- [ ] Spot-check 3 different tier levels (S, B, C) for fairness
- [ ] Verify captain multiplier (×1.5) applied correctly
- [ ] Verify spotlight bonus applied correctly (+12/+8/+4)
- [ ] Check edge cases:
  - [ ] Influencer with 0 tweets (should score 0)
  - [ ] Influencer with 1 viral tweet (should get +12)
  - [ ] Influencer with growth but no viral (should get growth pts)
- [ ] Verify rankings calculate correctly (sorted by score desc, tiebreak by creation time asc)

---

## Common Gotchas

| Gotcha | Solution |
|--------|----------|
| "Why is quiet week scoring low?" | It should. Quiet is quiet. Show "⚠️ No activity" flag instead of penalizing. |
| "Growth formula favors small accounts" | Correct design. Relative growth is harder for big accounts. |
| "Viral scoring is estimated" | Acceptable for now. We can't fetch all 100+ tweets per influencer without paid API. |
| "Why not use Views?" | Views correlate with followers. Too much noise. Stick with engagement. |
| "Can users game the system?" | No. Scoring is purely influencer-based. Team picks locked at contest start. |

---

## What's NOT in the Scoring (And Why)

| Feature | Why Not | When Add |
|---------|---------|----------|
| **Retweet velocity** (likes per hour) | Requires tick-by-tick data, not weekly snapshots | Week 3+ if snapshots every 4 hours |
| **Tweet sentiment** | Need NLP, third-party service, extra cost | Week 3+ if budget allows |
| **Follower quality** | Can't detect bot followers from API | Manual review, then automated Week 2 |
| **Conversation impact** | Would need NLP on reply threads | Out of scope |
| **Long-term loyalty bonus** | Handled by Foresight Score + XP, don't bloat weekly | Keep separate |

---

## For Judges (Scoring Fairness Narrative)

If judges ask "how is scoring calculated?", say:

> **"We score CT influencers on actual Twitter performance: Activity (consistency), Engagement (quality per tweet), Growth (follower gains), and Viral moments. Each category is normalized across tiers (S-tier CZ and C-tier emerging account both score fairly). Scores update weekly and are immutable on Solana's Tapestry Protocol."**

Key phrases:
- "Normalized across tiers" (fairness)
- "Actual Twitter performance" (data-driven)
- "Immutable on Solana" (blockchain value add)

---

## Data Sources

- **Position paper:** `docs/SCORING_FORMULA_POSITION_PAPER.md` (full analysis, 10K words)
- **Current implementation:** `backend/src/services/fantasyScoringService.ts` (lines 215-310)
- **Snapshot pipeline:** `backend/src/services/weeklySnapshotService.ts`
- **API integration:** `backend/src/services/twitterApiIoService.ts`

---

**Bottom Line:** V2.0 is ready. Ship it. V2.1 improvements in Week 2.
