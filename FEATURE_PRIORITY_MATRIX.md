# Feature Priority Matrix - Visual Reference

## THE DECISIONS AT A GLANCE

```
┌─────────────────────────────────────────────────────────────────┐
│                    FORESIGHT FEATURE DECISIONS                  │
│                      (Days 4-5 Sprint)                           │
└─────────────────────────────────────────────────────────────────┘

TIER 1: CRITICAL (Build These First) ⭐⭐⭐⭐⭐
────────────────────────────────────────────────────────────────────
Feature              │ Effort │ ROI  │ Why
─────────────────────┼────────┼──────┼──────────────────────────────
Follow Button        │ 2h     │ High │ 5/5 experts agree. Enables
                     │        │      │ friends leaderboard (retention)
─────────────────────┼────────┼──────┼──────────────────────────────
Activity Feed        │ 2h     │ High │ 4/5 agree. Variable reward
                     │        │      │ schedule (psychological hook)
─────────────────────┼────────┼──────┼──────────────────────────────
Friends Leaderboard  │ 1.5h   │ High │ 5/5 agree. Local rivalry >
                     │        │      │ global rank (retention driver)
─────────────────────┼────────┼──────┼──────────────────────────────
Shareable Team Card  │ 2h     │ High │ 2/5 emphasize heavily. Real
                     │        │      │ viral loop (Twitter reach)
────────────────────────────────────────────────────────────────────
SUBTOTAL: 7.5h, Expected +5 pts (86 → 91)


TIER 2: SUPPORTING (Build After Tier 1) ⭐⭐⭐⭐
────────────────────────────────────────────────────────────────────
Feature              │ Effort │ ROI  │ Why
─────────────────────┼────────┼──────┼──────────────────────────────
Tapestry Badges      │ 1h     │ Med  │ Judges need to see Tapestry
                     │        │      │ integration (40% of rubric)
────────────────────────────────────────────────────────────────────
SUBTOTAL: 1h, Expected +1-2 pts (91 → 92-93)


TIER 3: EXPLICITLY CUT (Do NOT build) ❌❌❌
────────────────────────────────────────────────────────────────────
Feature              │ Effort │ ROI  │ Why
─────────────────────┼────────┼──────┼──────────────────────────────
Comments             │ 3h     │ Low  │ 4/5 say NO. Toxicity risk,
                     │        │      │ moderation burden
─────────────────────┼────────┼──────┼──────────────────────────────
Likes (MVP)          │ 2-3h   │ Low  │ 3/5 say delay. Medium
                     │        │      │ motivation, low engagement
─────────────────────┼────────┼──────┼──────────────────────────────
Other advanced       │ TBD    │ Low  │ Seasonal leaderboards, skill
leaderboard features │        │      │ ratings, win/loss tracking
────────────────────────────────────────────────────────────────────
SAVINGS: 5-6h for polish, testing, buffer
FALLBACK: If anything breaks, remove it entirely


TIER 4: OPTIONAL (Week 2 or Later) 🟡
────────────────────────────────────────────────────────────────────
Feature              │ When   │ Trigger
─────────────────────┼────────┼──────────────────────────────────
Likes (UI)           │ Week 2 │ If D7 retention < target OR if
                     │        │ time permits post-hackathon
─────────────────────┼────────┼──────────────────────────────────
Comments (UI)        │ Never  │ Only if strong user demand for
                     │        │ discussion (unlikely)
────────────────────────────────────────────────────────────────────

═════════════════════════════════════════════════════════════════════
TOTAL EFFORT: 8.5h (Tier 1 + 2)
AVAILABLE: 48h (Days 4-5, full time)
MARGIN: 39.5h for polish, testing, buffer, demo video
═════════════════════════════════════════════════════════════════════
```

---

## PRIORITY BY EXPERT AGREEMENT

```
CONSENSUS FEATURES (Ship immediately):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5/5 agree ⭐⭐⭐⭐⭐
└─ Live Scoring (already done)
└─ Follow Button + Friends Leaderboard (enabler pair)

4/5 agree ⭐⭐⭐⭐
└─ Activity Feed (4 for, User Advocate skeptical)

4/5 agree ⭐⭐⭐⭐
└─ CUT Comments (4 for cutting, Design Lead designed it)


STRATEGIC FEATURES (High value but niche):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2/5 emphasize ⭐⭐
└─ Shareable Team Card (Growth Hacker + Business Strategist)

2/5 emphasize ⭐⭐
└─ Tapestry Messaging (Design Lead + Business Strategist)


WEAK CONSENSUS (Low priority):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3/5 say delay ⭐
└─ Likes (Psychologist + Growth Hacker + others skeptical)

3/5 support cut ⭐
└─ Advanced leaderboard features (not mentioned by most)
```

---

## IMPACT ANALYSIS

```
CURRENT STATE: 86/100
────────────────────
Integration: 38/40
Innovation:  25/30
Polish:      18/20
Narrative:   5/10
────────────
TOTAL:       86/100


AFTER TIER 1 (Follow + Activity Feed + Friends + Shareable Card):
────────────────────────────────────────────────────────────────
Integration: 38 → 40 (+2)  ← Visible social features
Innovation:  25 → 27 (+2)  ← Formation visual + social graph
Polish:      18 → 19 (+1)  ← Animations, toasts, badges
Narrative:   5 → 7 (+2)    ← Clear demo of all features
────────────
SUBTOTAL:    86 → 91 (+5)  ← 2nd-3rd place, $1-1.5K


AFTER TIER 2 (Tapestry Badges):
────────────────────────────────────────────────────────────────
Integration: 40 → 40 (+0)  ← Already counted
Innovation:  27 → 27 (+0)  ← Already counted
Polish:      19 → 20 (+1)  ← Badges are polish
Narrative:   7 → 8 (+1)    ← Integration narrative clearer
────────────
FINAL:       91 → 93 (+2)  ← 1st place, $2.5K


EXPECTED ROI:
─────────────────────────────────────────────────────────────
Effort:     8.5h
Benefit:    +7 points (86 → 93)
Rate:       0.82 points per hour
Confidence: Very high (5 expert consensus)
```

---

## RISK/REWARD ANALYSIS

```
FOLLOW BUTTON
─────────────
Risk:   Very Low (1 component, existing endpoint, tested)
Reward: Very High (enables friends leaderboard)
ROI:    Excellent ✅✅✅✅✅

ACTIVITY FEED
─────────────
Risk:   Low (polling is straightforward, no complex state)
Reward: High (retention driver)
ROI:    Excellent ✅✅✅✅✅

FRIENDS LEADERBOARD
───────────────────
Risk:   Very Low (filtering logic is trivial)
Reward: High (retention driver)
ROI:    Excellent ✅✅✅✅✅

SHAREABLE TEAM CARD
───────────────────
Risk:   Low (screenshot already working, just wire UI)
Reward: Very High (viral growth)
ROI:    Excellent ✅✅✅✅✅

TAPESTRY BADGES
───────────────
Risk:   Very Low (just text + styling)
Reward: Medium (judge narrative)
ROI:    Good ✅✅✅✅

COMMENTS (CUT)
──────────────
Risk:   High (moderation, toxicity)
Reward: Very Low (users don't need it)
ROI:    Terrible ❌❌❌

LIKES (CUT FOR MVP)
───────────────────
Risk:   Low (straightforward feature)
Reward: Very Low (0-2% engagement)
ROI:    Poor ❌
Decision: Delay to week 2 if retention plateaus
```

---

## DECISION MATRIX (Why Each Feature)

```
┌─────────────┬──────────┬─────────┬────────┬──────────┬────────────┐
│ Feature     │ Experts  │ Effort  │ Impact │ Risk     │ Decision   │
├─────────────┼──────────┼─────────┼────────┼──────────┼────────────┤
│ Follow      │ 5/5 ✅   │ 2h      │ +5pts  │ Very Low │ BUILD ✅   │
│ Activity    │ 4/5 ✅   │ 2h      │ +3pts  │ Low      │ BUILD ✅   │
│ Friends     │ 5/5 ✅   │ 1.5h    │ +2pts  │ V.Low    │ BUILD ✅   │
│ Share Card  │ 2/5 ✨   │ 2h      │ +2pts  │ Low      │ BUILD ✅   │
│ Tapestry    │ 2/5 ✨   │ 1h      │ +1pts  │ V.Low    │ BUILD ✅   │
├─────────────┼──────────┼─────────┼────────┼──────────┼────────────┤
│ Comments    │ 4/5 ❌   │ 3h      │ -2pts  │ High     │ CUT ❌     │
│ Likes       │ 3/5 🟡   │ 2h      │ +1pts  │ Low      │ DELAY 🟡   │
└─────────────┴──────────┴─────────┴────────┴──────────┴────────────┘

✅ = Unanimous or strong consensus, low risk
🟡 = Mixed consensus, medium risk, lower priority
❌ = Consensus to cut, higher risk to build
✨ = Strategic importance despite lower consensus
```

---

## IMPLEMENTATION SEQUENCE

```
DAY 4 (Saturday) — 8 hours
──────────────────────────

0h-2h:    Follow Button (FollowButton.tsx)
          └─ States: Not following (cyan) → Following (gold border)
          └─ Calls: POST /follow, DELETE /follow/:id

2h-4h:    Activity Feed (ActivityFeed.tsx)
          └─ 6 items max, 30s refresh
          └─ Shows: Follows + score updates

4h-5h30:  Friends Leaderboard (tab on /compete)
          └─ Filters existing leaderboard to follows
          └─ Empty state: "Follow players..."

5h30-6h:  Testing + fixes


DAY 5 (Sunday) — 8 hours
─────────────────────────

0h-2h:    Shareable Team Card (modal after draft)
          └─ Formation visual + Twitter pre-fill
          └─ Fallback: Share link if screenshot fails

2h-3h:    Tapestry Badges (profile + draft modal)
          └─ "Saved to Tapestry" (gray, 12px, humble)

3h-5h:    Mobile refinement + E2E testing
          └─ Button sizing, feed scrolling, tabs on phone
          └─ All flows: follow, share, leaderboard

5h-8h:    Buffer + demo prep
          └─ Extra QA time, edge cases, polish


DAYS 6-7 (Mon-Tue) — QA + Submission
──────────────────────────────────────

         Demo video (3 minutes)
         Final mobile check
         GitHub cleanup + README
         Submit to hackathon
```

---

## SUCCESS DEFINITION

```
MUST HAVE (Non-negotiable):
══════════════════════════════════════
✓ Follow button: Click → Save → Update UI → Toast
✓ Activity Feed: Refresh every 30s with new items
✓ Friends Leaderboard: Only shows followed users
✓ Share Card: Twitter pre-fill with formation screenshot
✓ Tapestry badges: Visible on profile + draft success
✓ Live scoring: Still updates (no regressions)
✓ Zero TypeScript errors
✓ Mobile responsive

NICE TO HAVE (If time allows):
═════════════════════════════════════
• Animations on follow/unfollow
• Enhanced activity feed filtering
• Tapestry detailed docs

NOT SHIPPING:
═════════════════════════════════════
✗ Comments
✗ Likes (unless week 2)
✗ Advanced leaderboards
```

---

## THE BOTTOM LINE

**Build:** Follow (2h) + Activity Feed (2h) + Friends Leaderboard (1.5h) + Shareable Card (2h) + Tapestry Badges (1h)

**Skip:** Comments + Likes (for MVP)

**Effort:** 8.5h of 48h available

**Expected gain:** +7 points (86 → 93 = 1st place, $2.5K)

**Risk level:** Very Low (all features have 2+ expert consensus, straightforward implementation)

**Fallback plans:** If any feature breaks, remove it entirely (still +5pts with just core features)

**Status:** LOCKED & READY TO BUILD ✅

---
