# Tapestry Integration: Decision Matrix & Priority

> **Purpose:** Visual reference for all 7 strategic questions answered
> **Use this to:** Quickly understand tradeoffs and make implementation decisions

---

## QUESTION 1: Three Load-Bearing Features

| Feature | Load-Bearing? | User Benefit | Judge Benefit | Effort | Impact | Priority |
|---------|---------------|--------------|---------------|--------|--------|----------|
| **Draft Receipt** | ✅ YES | Proof of prediction | Verifiable on Tapestry | 2h | HIGH | P0 |
| **Reputation Score** | ✅ YES | Status signal | Novel use case | 2h | HIGH | P0 |
| **Scouting Panel** | ✅ YES | Competitive advantage | Social graph is core | 3h | HIGH | P0 |
| **Comments** | ❌ NO | Discussion | Noise/toxicity | 3h | LOW | P3 |
| **Likes** | ❌ NO | Celebration | Medium | 2h | MEDIUM | P2 |
| **Follower Counts** | ❌ NO | Social proof | Cosmetic | 1h | LOW | P3 |

**Decision:** Implement P0 items (Draft Receipt + Reputation + Scouting). Skip P2-P3.

---

## QUESTION 2: Tapestry Visibility Map

| Page | Current | Target | What to Add | Effort |
|------|---------|--------|-------------|--------|
| **Draft** | 0% | 70% | Header banner + Receipt modal | 2h |
| **Leaderboard** | 10% | 80% | Reputation badges + Footer | 2h |
| **Contest Detail** | 0% | 60% | Rules section + Verification | 1h |
| **Profile** | 90% | 95% | Enhance existing badge | 0.5h |
| **Home** | 5% | 40% | Activity feed + Upcoming notice | 1h |

**Total visibility effort:** 6.5 hours

**Expected user awareness:** 20% → 65% (users consciously think about Tapestry)

---

## QUESTION 3: Novel Use Cases (Ranked by Judge Appeal)

| Rank | Feature | Novelty | Value to Users | Implementation | Judge Score |
|------|---------|---------|-----------------|-----------------|--------------|
| 1 | Immutable Draft Proof | ⭐⭐⭐⭐⭐ | Screenshot & share | 2h | 40/40 |
| 2 | On-Chain Reputation | ⭐⭐⭐⭐ | Status signal | 2h | 35/40 |
| 3 | Scouting via Follows | ⭐⭐⭐⭐ | Competitive advantage | 3h | 35/40 |
| 4 | Reputation Cascades | ⭐⭐⭐ | Meta-game | 4h | 28/40 |
| 5 | Influencer Scores on Chain | ⭐⭐⭐ | Proof of accuracy | 3h | 25/40 |
| 6 | Cross-App Portability | ⭐⭐ | Ecosystem play | 5h | 20/40 |

**Decision:** Implement Top 3. (Top 2 are P0, #3 is P1.)

---

## QUESTION 4: Making Follows Meaningful

### Layer 1: Social Proof (Current Implementation ✅)
- Badge: "Following top player" (status)
- Friends leaderboard (local competition)
- Work needed: Show more visibility

### Layer 2: Information Advantage (Day 2 Implementation 🔄)
- Scouting panel (see what follows drafted)
- Learn strategy before finalizing yours
- Creates competitive edge

### Layer 3: Social Rivalry (Future - Post-Hackathon)
- Direct challenges vs. specific players
- Seasonal reputation tracking
- Climb "friend tiers" (D/C/B/A/S)

**Implementation roadmap:**
- ✅ **Now:** Layer 1 + 2
- 📋 **Week 2:** Layer 3
- 📋 **Month 2:** Cross-app follows via Tapestry

---

## QUESTION 5: Top 5 Demo Moments

### Demo Script Breakdown

| Time | Moment | What Judge Sees | Why It Works |
|------|--------|-----------------|--------------|
| **0:00-0:45** | Draft Receipt | Immutable proof on Tapestry explorer | Verifiable |
| **0:45-1:30** | Reputation Tier | On-chain profile properties | Cryptographic certainty |
| **1:30-2:15** | Scouting Insights | Social graph affects draft | Load-bearing |
| **2:15-3:00** | Friends Leaderboard | Competitive + verified | Social features matter |
| **3:00-3:30** | (Bonus) Share Proof | Twitter pre-fill with Solana link | Viral + credible |

**Success metric:** Judge can verify all 5 moments on Tapestry explorer during demo.

---

## QUESTION 6: Influencer Scores on Tapestry

### Decision Matrix

| Approach | Effort | Judge Impact | User Impact | Recommendation |
|----------|--------|--------------|------------|-----------------|
| **Store daily scores** | 4h | +3 | +2 | ❌ NO (API churn) |
| **Store weekly summaries** | 2h | +5 | +3 | ⚠️ MAYBE |
| **Keep in PostgreSQL** | 0h | +0 | +0 | ✅ YES (focus on features) |

**Recommendation:** Keep influencer scores in PostgreSQL. Focus effort on Features 1-3 above (higher ROI).

**Rationale:** Judges care about **social features** (profiles, follows, content), not scoring mechanics. Use Tapestry for what it excels at.

---

## QUESTION 7: Highest-ROI 2-Day Implementation

### Day 1 Breakdown (8 hours)

```
08:00-10:00  Draft Receipt (2h)
             - Modify success modal
             - Show contentId + timestamp
             - Link to Tapestry explorer

10:00-12:00  Reputation Badges (2h)
             - Add CSS classes for S/A/B/C
             - Calculate tier from foresight_score
             - Add to leaderboard rows

12:00-13:00  LUNCH

13:00-15:00  Visibility Banners (2h)
             - Draft page header
             - Contest detail rules section
             - Profile enhancement

15:00-16:00  QA + Testing (1h)
             - Mobile responsive
             - No TypeScript errors
             - Production build clean
```

**Expected Score Increase:** 69 → 74 (+5 points)

### Day 2 Breakdown (6-8 hours)

```
09:00-11:00  Followed Drafts Endpoint (2h)
             - GET /api/tapestry/followed-drafts
             - Query user follows + their teams
             - Return with accuracy %

11:00-13:00  Scouting Panel UI (2h)
             - Create ScoutingPanel.tsx
             - Expand/collapse players
             - Show team composition

13:00-14:00  LUNCH

14:00-15:00  Integration + Testing (1h)
             - Wire to Draft.tsx
             - Mobile responsive
             - Error handling

15:00-16:30  Demo Video (1.5h)
             - Record 3-minute walkthrough
             - All 5 moments clearly shown
             - Audio + captions
```

**Expected Score Increase:** 74 → 80-82 (+6-8 points)

### Final Score Trajectory

```
Starting:  69/100 (2nd-3rd place, $1-1.5K)
After D1:  74/100 (still 2nd-3rd)
After D2:  80-82/100 (1ST PLACE, $2.5K) ✅
```

---

## COMPETITIVE ANALYSIS: What Beats You

### Scenario A: Standard Tapestry Integration (Competition)
- ✅ Store profiles on Tapestry
- ✅ Store data on Tapestry
- ✅ Add "Verified" badge
- ❌ No user-facing innovation
- ❌ No verifiable proofs
- ❌ Social graph is cosmetic
- **Score:** 60-65/100

### Scenario B: Your Implementation (Day 1 Only)
- ✅ Immutable draft proofs
- ✅ Reputation badges visible
- ✅ Visibility everywhere
- ❌ Social graph still cosmetic
- ❌ No innovation story
- **Score:** 72-74/100

### Scenario C: Your Full Implementation (Day 1 + Day 2)
- ✅ Immutable draft proofs (verifiable)
- ✅ Reputation on-chain (credible)
- ✅ Scouting mechanics (load-bearing)
- ✅ Social graph drives gameplay
- ✅ Clear innovation narrative
- **Score:** 80-82/100 ← **YOU WIN** 🏆

---

## DECISION TREE: What to Implement?

```
START
  ↓
"Do you want $2.5K or $1.5K?"
  ├─→ $1.5K: Stop after Day 1 (visibility only)
  └─→ $2.5K: Complete Day 1 + Day 2 (full strategy)
       ↓
     "Have 14-16 hours?"
       ├─→ NO: Do Day 1 only (safe, 8h, +5 points)
       └─→ YES: Do both (14-16h, +11-13 points, WIN)
            ↓
          "Implement 3 features or 1?"
            ├─→ 1 feature (draft receipt): 2h, +3 points
            ├─→ 2 features (+ reputation): 4h, +8 points
            └─→ 3 features (full): 7h, +11-13 points ✅

RECOMMENDATION: $2.5K path, 14-16 hours, all 3 features.
```

---

## TIMELINE & DEPENDENCIES

```
┌─────────────────────────────────────────┐
│ DAY 1 (Friday): 8 hours                 │
├─────────────────────────────────────────┤
│ 1. Draft Receipt                   [2h] │
│    ↓ (depends on: storeTeam API)        │
│ 2. Reputation Badge                [2h] │
│    ↓ (depends on: leaderboard page)     │
│ 3. Visibility Banners              [2h] │
│    ↓ (independent)                      │
│ 4. QA                              [1h] │
│    ↓                                    │
│ SHIP: +5 points                         │
└─────────────────────────────────────────┘
            ↓ (Day 1 ships successfully)
┌─────────────────────────────────────────┐
│ DAY 2 (Saturday): 7-8 hours             │
├─────────────────────────────────────────┤
│ 1. Followed Drafts Endpoint        [2h] │
│    ↓ (depends on: auth, DB queries)     │
│ 2. Scouting Panel UI               [2h] │
│    ↓ (depends on: endpoint from step 1) │
│ 3. Integration                     [1h] │
│    ↓ (depends on: step 1 + 2)           │
│ 4. Demo Video                    [1.5h] │
│    ↓ (depends on: all features work)    │
│ SHIP: +6-8 points                       │
└─────────────────────────────────────────┘
            ↓
     SUBMIT (Feb 27, 11:59 PM UTC)
            ↓
        80-82/100 = 1st place 🏆
```

---

## RISK-REWARD MATRIX

| Scenario | Effort | Risk | Reward | Expected Outcome |
|----------|--------|------|--------|------------------|
| **Skip everything** | 0h | None | 0 | 69/100 (2-3rd) |
| **Day 1 only** | 8h | LOW | +5 | 74/100 (2-3rd) |
| **Day 1 + simple Day 2** | 12h | MED | +8 | 77/100 (2nd) |
| **Day 1 + full Day 2** | 15h | MED | +13 | 82/100 (1st) 🏆 |
| **Overengineer** | 25h | HIGH | +12 | 81/100 (1st) |

**Optimal:** Day 1 + full Day 2 (best risk-reward ratio)

---

## JUDGE EVALUATION CHECKLIST

**What judges will verify during your demo:**

- [ ] **Draft Receipt**
  - [ ] Can I click a link and see proof on Tapestry?
  - [ ] Does it show timestamp, team ID, content ID?
  - [ ] Is the data immutable?

- [ ] **Reputation Score**
  - [ ] Is it calculated from on-chain data?
  - [ ] Can I verify the tier on Tapestry profile?
  - [ ] Does it make sense competitively?

- [ ] **Scouting Insights**
  - [ ] Does it actually show followed players' teams?
  - [ ] Does it impact my draft decision?
  - [ ] Is it connected to the social graph?

- [ ] **Overall Narrative**
  - [ ] Is Tapestry essential (not decorative)?
  - [ ] Would the game work without Tapestry?
  - [ ] Is this novel/innovative?

**Score:** 5+ checks ✅ = 1st place. 3-4 checks = 2nd. <3 checks = 3rd.

---

## FINAL RECOMMENDATION

**If I could only tell you one thing:**

> Your current implementation is solid infrastructure but won't win because judges can't **feel** Tapestry in the experience. With 14-16 hours of focused work on three features (draft receipts, reputation, scouting), you transform Tapestry from "nice storage layer" to "core game mechanic." That's the difference between $1.5K and $2.5K.

**Do the full implementation. It's worth it.**

---

**Next Steps:**
1. Read TAPESTRY_STRATEGY_FOR_JUDGES.md (strategic deep dive)
2. Read TAPESTRY_BOUNTY_QUICKSTART.md (copy-paste code)
3. Read TAPESTRY_EXPERT_MEMO.md (executive summary)
4. Execute the checklist
5. Win the bounty

You have 2.5 days. Go.
