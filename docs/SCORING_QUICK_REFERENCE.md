# Scoring System — Quick Reference for Devs

> TL;DR of the game design analysis. Use this to make fast decisions during implementation.

---

## 1. Current Scoring Formula (Copy-Paste Reference)

```
Team Score = Σ(Influencer Scores) + Captain Multiplier + Spotlight Bonus

Per Influencer:
├─ Activity:    min(35, tweets × 1.5)
├─ Engagement:  min(60, sqrt(weighted_engagement) × 1.5 × volume)
├─ Growth:      min(40, followers_gained/2000 + growth_rate% × 5)
└─ Viral:       min(25, engagement_thresholds)

Captain:   ×1.5 multiplier (SHOULD BE ×1.75 or ×2.0)
Spotlight: Flat +12/+8/+4 pts for top 3 voted
```

**Max per player:** 160 pts/week
**Max per team (5 players):** ~880 pts

---

## 2. Quick Scoring Decision Tree

```
Q: Does the current scoring work for hackathon demo?
A: YES — It's fine. Don't change on deadline.

Q: Do we have <1 hour before submission?
A: → Ship as-is

Q: Do we have 1-2 hours before submission?
A: → Add archetype metadata (Change #3)
   → Takes 1-2 hours, zero breaking changes

Q: Do we have 3-4 hours before submission?
A: → Add score breakdown display (Change #2)
   → Improves UX significantly

Q: Do we have time post-deadline?
A: → Increase captain to 1.75x or 2.0x immediately
   → Fastest, highest ROI change
```

---

## 3. Top 3 Game-Changing Tweaks

### Tweak #1: Captain Multiplier (⭐ HIGHEST ROI)
- **Time:** 15 minutes | **Risk:** Zero | **Impact:** +2-3 engagement
- **Change:** `captainMultiplier: 1.5` → `2.0` (or 1.75 conservative)
- **File:** `backend/src/services/fantasyScoringService.ts:86`
- **Result:** Captain worth 50-60 pts vs 40 now. Feels high-stakes.

### Tweak #2: Score Breakdown Display (⭐ HIGH IMPACT)
- **Time:** 2-3 hours | **Risk:** Low | **Impact:** +1-2 retention
- **Add:** Component showing Activity/Engagement/Growth/Viral breakdown
- **Where:** ContestDetail, Leaderboard hover
- **Why:** Players understand their wins/losses

### Tweak #3: Archetype Metadata (⭐ LOWEST RISK)
- **Time:** 1-2 hours | **Risk:** Zero | **Impact:** +0.5-1 retention
- **Add:** Archetype label (Activity Beast, Engagement Wizard, Viral Sniper)
- **Where:** Database only (API returns new field, UI optional)
- **Why:** Helps new players understand draft strategy

---

## 4. What NOT to Change
- Tier pricing (S: 38-48, A: 28-36, B: 22-28, C: 15-22)
- Category caps (Activity: 35, Engagement: 60, Growth: 40, Viral: 25)
- Spotlight bonuses (12/8/4 pts)
- Contest update frequency (4x daily)

---

## 5. Three Player Archetypes

| Archetype | Activity | Engagement | Growth | Viral |
|-----------|----------|-----------|--------|-------|
| **Activity Beast** | 20-35 | 15-25 | 5-10 | 0-5 |
| **Engagement Wizard** | 10-20 | 40-60 | 3-10 | 5-15 |
| **Viral Sniper** | 5-15 | 10-25 | 10-30 | 10-25 |

---

## 6. Post-Deadline Roadmap

**Week 1:** Increase captain to 1.75-2.0x (highest ROI)
**Week 2-3:** Add score breakdowns + archetype UI
**Week 4+:** Weekly multiplier events (Growth week, Engagement week, etc.)

---

**Read `SCORING_SYSTEM_GAME_DESIGN_ANALYSIS.md` for full strategy.**
