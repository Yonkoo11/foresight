# Scoring System Game Design — Executive Summary

> 5-minute read for non-technical stakeholders

---

## Current State: 72/100 (Acceptable, But Leaving Engagement on Table)

Foresight's scoring system is **solid** but **timid**. It works, but it won't create the emotional investment or replayability that separates good games from great ones.

---

## Key Findings

### 1. Captain Multiplier is Too Low (1.5x)

**The Problem:**
- Captain is only worth +40 pts in a team that scores ~350-400 pts total
- That's ~10% of the team score—it should feel bigger
- Users don't experience "high stakes" when picking captain

**The Fix:**
- Increase to 1.75x or 2.0x (industry standard is 2.0x)
- Takes 15 minutes
- **Zero risk, huge engagement gain**

**Impact:** Captain decisions become memorable. Players think harder about this choice.

---

### 2. Scoring Categories Aren't Communicated

**The Problem:**
- Four scoring categories exist (Activity, Engagement, Growth, Viral) but are hidden
- Players don't know they exist
- They don't understand "why did I win/lose"
- They can't build draft strategy around them (e.g., "I'll build an Engagement-focused team")

**The Fix:**
- Show score breakdown on contest pages
  ```
  Your Team: 542 pts
  ├─ Activity:    89 (23%)
  ├─ Engagement: 156 (40%)
  ├─ Growth:      78 (20%)
  └─ Viral:       32 (8%)
  ```

**Impact:** Players understand their performance. Increases perceived fairness. Creates draft narratives.

---

### 3. Same People Win Every Week (No Variance)

**The Problem:**
- Top 5 players are always optimal to draft
- Meta becomes obvious by Week 2
- Players lose motivation ("Why draft anyone else?")

**The Fix (Post-Deadline):**
- Weekly multiplier events
  - Week 1: Growth scores ×1.5 (reward emerging creators)
  - Week 2: Engagement ×1.25 (reward ratio warriors)
  - Week 3: Viral thresholds lowered (reward content creators)
  - Week 4: Activity ×2 (reward high-volume posters)

**Impact:** Changes optimal roster every week. Players come back to see new meta.

---

## Three Changes That Move the Needle

| Change | Time | Risk | Impact | When |
|--------|------|------|--------|------|
| **Increase Captain to 2.0x** | 15 min | Zero | +2-3 engagement | Immediate (Week 1) |
| **Add Score Breakdowns UI** | 2-3 hrs | Low | +1-2 retention | Week 1-2 |
| **Weekly Multiplier Events** | 4-6 hrs | Low | +5-10 retention | Week 2+ |

---

## For The Hackathon (2 Days Left)

**Ship current scoring.** It's fine. Don't risk changes on deadline.

**Then immediately after:**
- Increase captain multiplier to 2.0x (highest ROI, lowest risk)
- Monitor player retention metrics

---

## Why This Matters

Fantasy sports live and die by **replayability**. If your game feels the same every week, players stop playing.

Foresight's scoring foundation is strong. These tweaks unlock the engagement potential that's already baked in.

---

**For detailed analysis:** See `SCORING_SYSTEM_GAME_DESIGN_ANALYSIS.md` (full 40-page paper)
**For dev implementation:** See `SCORING_QUICK_REFERENCE.md` (copy-paste code snippets)
