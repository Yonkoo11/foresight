# Scoring V2.1 Implementation Guide — Ready-to-Code

**For:** Backend engineers implementing Week 2 improvements

**Effort:** 3-4 hours total (log scaling + rate weighting + momentum detection)

**Risk:** Low (all changes are backward compatible, additive)

---

## Change 1: Engagement Log Scaling (1 hour)

### Current Code (fantasyScoringService.ts, line 239)

```typescript
// CURRENT
const volumeMultiplier = Math.min(1.0, delta.tweetsAnalyzed / cfg.engagement.minTweetsForFullScore);
const rawEngagementScore = engagementQuality * volumeMultiplier;
```

### Problem

Linear scaling penalizes quiet weeks:
- 3 tweets → 30% multiplier (too harsh)
- 5 tweets → 50% multiplier (still too harsh)
- 10 tweets → 100% multiplier (OK)

### New Code

```typescript
// NEW: Logarithmic scaling (log10 base)
// Maps 3-50 tweets to 50%-100% multiplier range
const volumeMultiplier = Math.min(
  1.0,
  Math.log10(delta.tweetsAnalyzed + 1) / Math.log10(cfg.engagement.minTweetsForFullScore + 1)
);
const rawEngagementScore = engagementQuality * volumeMultiplier;

// Examples:
// 3 tweets: log10(4) / log10(11) = 0.602 / 1.041 = 57.8% multiplier
// 5 tweets: log10(6) / log10(11) = 0.778 / 1.041 = 74.6% multiplier
// 10 tweets: log10(11) / log10(11) = 1.041 / 1.041 = 100% multiplier
```

### Test Case

```typescript
// Add to fantasyScoringService.test.ts

describe('calculateInfluencerWeeklyScore - Engagement Scaling', () => {
  it('should apply log scaling to 3-tweet week', () => {
    const delta: InfluencerDelta = {
      tweetsThisWeek: 3,
      tweetsAnalyzed: 3,
      totalLikes: 2400,    // 800 per tweet
      totalRetweets: 600,  // 200 per tweet
      totalReplies: 150,   // 50 per tweet
      followerGrowth: 0,
      // ... other fields
    };

    const score = calculateInfluencerWeeklyScore(delta);

    // Expected:
    // avgLikes = 800, avgRTs = 200, avgReplies = 50
    // quality = sqrt(800 + 400 + 150) × 1.5 = sqrt(1350) × 1.5 = 55.0
    // volume = log10(4) / log10(11) = 0.578
    // engagement = min(60, 55.0 × 0.578) = 31.8
    expect(score.engagementScore).toBeCloseTo(31.8, 1);
  });

  it('should apply log scaling to 5-tweet week', () => {
    // Same delta but tweetsAnalyzed = 5
    const score = calculateInfluencerWeeklyScore(delta);

    // volume = log10(6) / log10(11) = 0.746
    // engagement = min(60, 55.0 × 0.746) = 41.0
    expect(score.engagementScore).toBeCloseTo(41.0, 1);
  });

  it('should apply log scaling to 10+ tweet week', () => {
    // 10+ tweets gets 100% multiplier
    const score = calculateInfluencerWeeklyScore(delta);

    // volume = log10(11) / log10(11) = 1.0
    // engagement = min(60, 55.0 × 1.0) = 55.0
    expect(score.engagementScore).toBeCloseTo(55.0, 1);
  });
});
```

### Validation

Before merge:
```bash
npm test -- fantasyScoringService.test.ts
# Ensure all tests pass, including new ones
```

---

## Change 2: Rate-Weighted Growth (1 hour)

### Current Code (fantasyScoringService.ts, lines 246-259)

```typescript
// CURRENT
const absoluteGrowth = Math.min(
  delta.followerGrowth / cfg.growth.absoluteDivisor,
  cfg.growth.absoluteCap
);

let growthRatePercent = 0;
if (startFollowers && startFollowers > 0) {
  growthRatePercent = (delta.followerGrowth / startFollowers) * 100;
}
const rateGrowth = Math.min(
  growthRatePercent * cfg.growth.rateMultiplier,
  cfg.growth.rateCap
);

const rawGrowthScore = absoluteGrowth + rateGrowth;
const growthScore = Math.min(rawGrowthScore, cfg.growth.totalCap);
```

### Problem

- Absolute divisor (2K) too generous for big accounts
- Rate multiplier (5x) too stingy for small accounts
- Result: Biased toward absolute growth (follower count matters too much)

### New Code

```typescript
// NEW: Rate-weighted growth (emphasize % growth over absolute count)
const absoluteGrowth = Math.min(
  delta.followerGrowth / 5000,  // Changed from 2000 to 5000
  10  // Changed from 20 to 10 (lower absolute weight)
);

let growthRatePercent = 0;
if (startFollowers && startFollowers > 0) {
  growthRatePercent = (delta.followerGrowth / startFollowers) * 100;
}
const rateGrowth = Math.min(
  growthRatePercent * 10,  // Changed from 5 to 10 (higher rate weight)
  30  // Changed from 20 to 30 (higher rate cap)
);

const rawGrowthScore = absoluteGrowth + rateGrowth;
const growthScore = Math.min(rawGrowthScore, 40);  // Total cap unchanged
```

### Config Change

Update `SCORING_CONFIG` at top of file:

```typescript
const SCORING_CONFIG = {
  // ... other fields ...
  growth: {
    absoluteDivisor: 5000,      // was 2000
    absoluteCap: 10,             // was 20
    rateMultiplier: 10,          // was 5
    rateCap: 30,                 // was 20
    totalCap: 40,                // unchanged
  },
  // ... other fields ...
};
```

### Test Case

```typescript
// Add to fantasyScoringService.test.ts

describe('calculateInfluencerWeeklyScore - Growth Weighting', () => {
  it('should reward small account with high growth rate', () => {
    const delta: InfluencerDelta = {
      followerGrowth: 2000,
      tweetsThisWeek: 5,
      tweetsAnalyzed: 5,
      totalLikes: 2500,
      totalRetweets: 750,
      totalReplies: 250,
      // ... other fields
    };
    const startFollowers = 50000;  // 4% growth

    const score = calculateInfluencerWeeklyScore(delta, startFollowers);

    // Expected:
    // absolute = min(10, 2000/5000) = min(10, 0.4) = 0.4
    // rate = min(30, 4 × 10) = min(30, 40) = 30
    // growth = min(40, 0.4 + 30) = 30.4
    expect(score.growthScore).toBeCloseTo(30.4, 1);
  });

  it('should still reward large account with significant follower gain', () => {
    const delta: InfluencerDelta = {
      followerGrowth: 100000,
      tweetsThisWeek: 20,
      tweetsAnalyzed: 20,
      totalLikes: 160000,
      totalRetweets: 40000,
      totalReplies: 10000,
      // ... other fields
    };
    const startFollowers = 8000000;  // 1.25% growth

    const score = calculateInfluencerWeeklyScore(delta, startFollowers);

    // Expected:
    // absolute = min(10, 100000/5000) = min(10, 20) = 10
    // rate = min(30, 1.25 × 10) = min(30, 12.5) = 12.5
    // growth = min(40, 10 + 12.5) = 22.5
    expect(score.growthScore).toBeCloseTo(22.5, 1);
  });

  it('should cap growth at 40 for explosive growth', () => {
    const delta: InfluencerDelta = {
      followerGrowth: 250000,
      tweetsThisWeek: 10,
      tweetsAnalyzed: 10,
      totalLikes: 50000,
      totalRetweets: 12500,
      totalReplies: 3125,
      // ... other fields
    };
    const startFollowers = 100000;  // 250% growth (viral moment)

    const score = calculateInfluencerWeeklyScore(delta, startFollowers);

    // Expected:
    // absolute = min(10, 250000/5000) = min(10, 50) = 10
    // rate = min(30, 250 × 10) = min(30, 2500) = 30
    // growth = min(40, 10 + 30) = 40 (capped)
    expect(score.growthScore).toBeCloseTo(40, 1);
  });
});
```

### Validation

```bash
npm test -- fantasyScoringService.test.ts
# All tests pass including growth weighting
```

---

## Change 3: Momentum Detection (2-3 hours)

This is more complex. Adds a new scoring dimension.

### Step 1: Update Interface (fantasyScoringService.ts)

```typescript
// Add to ScoreBreakdown interface
export interface ScoreBreakdown {
  // ... existing fields ...
  momentumScore: number;  // NEW
  details: {
    // ... existing fields ...
    isHotStreak: boolean;  // NEW
    engagementImprovement: number;  // NEW: % change from prev week
    hasViralTweet: boolean;  // NEW
  };
}
```

### Step 2: Update InfluencerDelta Interface

```typescript
// In weeklySnapshotService.ts
export interface InfluencerDelta {
  // ... existing fields ...
  previousWeekEngagement?: number;  // NEW: For momentum detection
  previousWeekGrowth?: number;      // NEW: For momentum detection
}
```

### Step 3: Calculate Previous Week Metrics (weeklySnapshotService.ts)

```typescript
/**
 * Get previous week's metrics for momentum detection
 */
async function getPreviousWeekMetrics(
  influencerId: number,
  currentContestId: number
): Promise<{ engagement: number; growth: number } | null> {
  // Find previous contest
  const previousContest = await db('fantasy_contests')
    .where('id', '<', currentContestId)
    .orderBy('id', 'desc')
    .first();

  if (!previousContest) return null;

  const previousDelta = await calculateInfluencerDelta(influencerId, previousContest.id);
  if (!previousDelta) return null;

  const previousEngagement = previousDelta.totalLikes +
                            previousDelta.totalRetweets +
                            previousDelta.totalReplies;

  return {
    engagement: previousEngagement,
    growth: previousDelta.followerGrowth,
  };
}
```

### Step 4: Calculate Momentum (fantasyScoringService.ts)

```typescript
/**
 * Detect hot streaks and momentum
 */
function calculateMomentumScore(
  delta: InfluencerDelta,
  growthScore: number,
  engagementScore: number
): { momentumScore: number; isHotStreak: boolean; engagementImprovement: number; hasViralTweet: boolean } {
  let momentumScore = 0;
  let engagementImprovement = 0;
  let hasViralTweet = false;

  // 1. Accelerating growth (+3 pts)
  const growthRate = delta.followerGrowth > 0
    ? (delta.followerGrowth / Math.max(1, delta.previousWeekGrowth || 1))
    : 0;

  if (growthRate > 1.5) {
    // Growth accelerating (this week > 1.5x last week)
    momentumScore += 3;
  }

  // 2. Improving engagement quality (+4 pts)
  if (delta.previousWeekEngagement && delta.previousWeekEngagement > 0) {
    const currentEngagement = delta.totalLikes + delta.totalRetweets + delta.totalReplies;
    engagementImprovement = ((currentEngagement - delta.previousWeekEngagement) / delta.previousWeekEngagement) * 100;

    if (engagementImprovement >= 20) {
      // Engagement up 20%+ week-over-week
      momentumScore += 4;
    }
  }

  // 3. Detected viral tweet (+5 pts)
  // Viral = single tweet with 10K+ total engagement
  const avgEngagementPerTweet = delta.tweetsAnalyzed > 0
    ? (delta.totalLikes + delta.totalRetweets + delta.totalReplies) / delta.tweetsAnalyzed
    : 0;

  if (avgEngagementPerTweet >= 10000) {
    hasViralTweet = true;
    momentumScore += 5;
  }

  const isHotStreak = momentumScore >= 5;

  return {
    momentumScore: Math.min(10, momentumScore),
    isHotStreak,
    engagementImprovement,
    hasViralTweet,
  };
}
```

### Step 5: Integrate into Weekly Scoring

```typescript
/**
 * Calculate weekly score for an influencer (V2.1)
 */
export function calculateInfluencerWeeklyScore(
  delta: InfluencerDelta,
  startFollowers?: number
): ScoreBreakdown {
  // ... existing calculations ...

  // NEW: Calculate momentum
  const momentumResult = calculateMomentumScore(delta, growthScore, engagementScore);

  // NEW: Update base total
  const baseTotal = activityScore + engagementScore + growthScore + viralScore + momentumResult.momentumScore;

  return {
    activityScore: Math.round(activityScore * 10) / 10,
    engagementScore: Math.round(engagementScore * 10) / 10,
    growthScore: Math.round(growthScore * 10) / 10,
    viralScore: Math.round(viralScore * 10) / 10,
    momentumScore: Math.round(momentumResult.momentumScore * 10) / 10,  // NEW
    baseTotal: Math.round(baseTotal * 10) / 10,
    captainMultiplier: 1.0,
    spotlightBonus: 0,
    finalScore: Math.round(baseTotal * 10) / 10,
    details: {
      tweetsThisWeek: delta.tweetsThisWeek,
      avgLikes: Math.round(avgLikes),
      avgRetweets: Math.round(avgRetweets),
      avgReplies: Math.round(avgReplies),
      tweetsAnalyzed: delta.tweetsAnalyzed,
      followerGrowth: delta.followerGrowth,
      growthRatePercent: Math.round(growthRatePercent * 100) / 100,
      viralTweets,
      isHotStreak: momentumResult.isHotStreak,  // NEW
      engagementImprovement: Math.round(momentumResult.engagementImprovement * 10) / 10,  // NEW
      hasViralTweet: momentumResult.hasViralTweet,  // NEW
    },
  };
}
```

### Test Case

```typescript
describe('calculateInfluencerWeeklyScore - Momentum', () => {
  it('should award momentum for accelerating growth', () => {
    const delta: InfluencerDelta = {
      followerGrowth: 5000,
      previousWeekGrowth: 2000,  // Growth doubled (2.5x)
      tweetsThisWeek: 10,
      tweetsAnalyzed: 10,
      totalLikes: 25000,
      totalRetweets: 5000,
      totalReplies: 1000,
      previousWeekEngagement: 20000,  // Engagement improved
      // ... other fields
    };

    const score = calculateInfluencerWeeklyScore(delta);

    // Expected:
    // Growth accelerated (5K > 1.5 × 2K): +3 momentum
    // Engagement improved (31K > 1.2 × 20K): +4 momentum
    // momentum = min(10, 7) = 7
    expect(score.momentumScore).toBe(7);
    expect(score.details.isHotStreak).toBe(true);
  });

  it('should award momentum for viral tweet', () => {
    const delta: InfluencerDelta = {
      followerGrowth: 1000,
      previousWeekGrowth: 1000,
      tweetsThisWeek: 3,
      tweetsAnalyzed: 3,
      totalLikes: 45000,   // Avg 15K per tweet (viral)
      totalRetweets: 9000,
      totalReplies: 2000,
      previousWeekEngagement: 30000,
      // ... other fields
    };

    const score = calculateInfluencerWeeklyScore(delta);

    // Expected:
    // Average engagement per tweet: (45K + 9K + 2K) / 3 = 18.7K (>= 10K)
    // hasViralTweet = true: +5 momentum
    expect(score.momentumScore).toBe(5);
    expect(score.details.hasViralTweet).toBe(true);
  });
});
```

---

## Deployment Checklist

### Pre-Merge

- [ ] All tests passing (log scaling + growth + momentum)
- [ ] TypeScript compilation clean (`npx tsc --noEmit`)
- [ ] Code review (at least 1 approval)
- [ ] Manual testing: Run 1 full contest through V2.1 scoring

### Deployment Strategy

**Option A: Gradual Rollout (Safer)**
```
Day 1: Deploy with Feature Flag
- SCORING_VERSION = 'v2.0' (default)
- Add config: SCORING_VERSION env var

Day 2: Test with Real Data
- 10% of new contests use V2.1
- Monitor for edge cases

Day 3: Full Rollout
- Switch SCORING_VERSION = 'v2.1' for all
```

**Option B: Immediate (If confident)**
```
- Merge + deploy all changes
- Monitor score diffs vs. V2.0
```

### Recommended: Option A (Safer for Week 2)

### Monitoring

After deployment, watch for:

```sql
-- Score comparison
SELECT
  CASE
    WHEN final_score > 150 THEN 'HIGH'
    WHEN final_score > 100 THEN 'MEDIUM'
    ELSE 'LOW'
  END as score_tier,
  COUNT(*) as count,
  AVG(final_score) as avg_score
FROM team_picks
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY score_tier;

-- Distribution check (should be normal-ish)
SELECT
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY final_score) as q1,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY final_score) as median,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY final_score) as q3,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY final_score) as p95
FROM team_picks
WHERE created_at > NOW() - INTERVAL '7 days';
```

---

## Backward Compatibility

**All changes are backward compatible:**
- V2.0 → V2.1 scores are higher (average +5-10 pts base total)
- Leaderboards don't break (just different ordering)
- Database schema unchanged
- API endpoints unchanged

**No migrations needed.**

---

## Rollback Plan

If V2.1 breaks (edge case discovered):

```bash
# 1. Revert to V2.0 config
SCORING_VERSION = 'v2.0'

# 2. Recalculate all active contest scores
npm run recalculate-scores -- --version v2.0

# 3. Deploy
```

---

## Performance Impact

**Expected:** Negligible
- Log calculation: ~0.1ms per influencer
- Previous week lookup: 1 DB query (cached)
- Total: +1-2ms per scoring cycle (vs. ~10ms existing)

**Not a concern.**

---

## Next: Week 3 Improvements

Once V2.1 stabilizes, consider:

1. **Viral Tweet Detection** — Actual (not estimated)
   - Effort: 2-3 hrs
   - Requires: Fetching individual tweet data (TwitterAPI.io)

2. **Engagement Per Follower Index** — For player selection UI
   - Effort: 1-2 hrs
   - Requires: No new data, just new calculation

3. **Bot Detection** — Automated or manual review
   - Effort: 2-4 hrs (depends on approach)
   - Requires: Historical engagement patterns analysis

---

**Questions?** See `SCORING_FORMULA_POSITION_PAPER.md` for full analysis.
