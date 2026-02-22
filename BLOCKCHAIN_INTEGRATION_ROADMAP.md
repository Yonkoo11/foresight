# BLOCKCHAIN INTEGRATION ROADMAP
## 5-Day Sprint Plan (Feb 22-27)

**Last Updated:** February 22, 2026
**Status:** Ready for Execution
**Owner:** Engineering Team

---

## EXECUTIVE BRIEF

**Goal:** Integrate Solana blockchain into Foresight to win Graveyard Hackathon

**Strategy:** Minimal Anchor program + Tapestry Protocol integration
- Store contest results on-chain (immutable proof)
- Publish scores to Tapestry (social portability)
- Maintain game speed (off-chain scoring)

**Timeline:** 5 days, 51-70 person-hours
**Resource:** 1 blockchain engineer (days 1-4) + full team (day 5)

---

## DOCUMENTS CREATED

| Document | Purpose | Read This If... |
|----------|---------|---|
| **SOLANA_BLOCKCHAIN_STRATEGY.md** | Deep dive into all decisions | You want full context |
| **BLOCKCHAIN_DECISION_SUMMARY.md** | One-page executive summary | You need quick overview |
| **ANCHOR_PROGRAM_SPEC.md** | Technical blueprint for building | You're implementing the program |
| **This document** | Daily timeline + task breakdown | You're managing the sprint |

---

## DAILY BREAKDOWN

### DAY 1 (Feb 22): ANCHOR SETUP & FOUNDATION

**Goal:** Have working Anchor program on local validator

#### Morning: Project Setup (2-3h)
- [ ] Install Solana CLI, Rust, Anchor
- [ ] Generate new Anchor project: `anchor init foresight-contests`
- [ ] Review ANCHOR_PROGRAM_SPEC.md sections 1-3
- [ ] Create `state.rs` with `ContestResult` struct
- [ ] Create `lib.rs` with `finalize_contest()` instruction

**Deliverable:** Project builds, no errors
```bash
anchor build # Should output .so + IDL
```

#### Afternoon: Local Testing (3-4h)
- [ ] Start local validator: `solana-test-validator`
- [ ] Write tests in `tests/foresight-contests.ts`
- [ ] Run tests: `anchor test`
- [ ] Fix any compilation errors

**Deliverable:** Tests pass locally
```bash
anchor test # All 1-2 tests pass
```

#### End of Day 1
- [ ] Commit code: `git add solana/ && git commit -m "feat: Anchor program core"`
- [ ] Program builds and tests pass
- [ ] Estimate: 5-6 hours used, on track

---

### DAY 2 (Feb 23): DEVNET DEPLOYMENT & TESTING

**Goal:** Program deployed to Devnet, can call from Node.js

#### Morning: Generate Program ID & Deploy (2-3h)
- [ ] Generate keypair: `solana-keygen generate --outfile ...`
- [ ] Get program ID from keypair
- [ ] Update `Anchor.toml` with program ID
- [ ] Deploy to Devnet: `anchor deploy --provider.cluster devnet`

**Deliverable:** Program deployed to Devnet
```bash
solana program info foresight_contests -um devnet
# Shows your program is live
```

#### Afternoon: Backend Integration Code (3-4h)
- [ ] Create `backend/src/blockchain/solana.ts`
- [ ] Implement `finalizeContestOnChain()` function
- [ ] Implement `getContestResultOnChain()` function
- [ ] Add to `backend/package.json`: `@coral-xyz/anchor`, `@solana/web3.js`
- [ ] Test locally (create mock contest, call function)

**Deliverable:** Backend can call finalize_contest
```typescript
const result = await finalizeContestOnChain(6, winners, scoreHash);
console.log(result.signature); // Should be valid tx sig
```

#### End of Day 2
- [ ] Commit: `git add backend/src/blockchain && git commit -m "feat: Backend Solana integration"`
- [ ] Both program + backend working together
- [ ] Estimate: 10-12 hours total, on track

---

### DAY 3 (Feb 24): GAME LOOP INTEGRATION

**Goal:** Contests automatically finalize on Solana

#### Morning: Wire Contest Finalization (2-3h)
- [ ] Update `backend/src/cron/contestLifecycle.ts`
- [ ] Call `finalizeContestOnChain()` when contest ends
- [ ] Add fallback logic (game continues if blockchain fails)
- [ ] Add `blockchain_status` columns to contests table
- [ ] Test with mock contest data

**Deliverable:** When contest ends, blockchain gets called
```typescript
// Check database
SELECT blockchain_status, blockchain_tx_signature FROM contests WHERE id = 6;
# Should show: finalized_on_chain, tx_sig...
```

#### Afternoon: Frontend Results Display (3-4h)
- [ ] Update `frontend/src/components/ContestLeaderboard.tsx`
- [ ] Show blockchain status badge (✓ Verified on Solana)
- [ ] Display transaction link to Solana Explorer
- [ ] Show fallback badge if off-chain only
- [ ] Test with real contest

**Deliverable:** Demo leaderboard shows blockchain proof
```
✓ Verified on Solana (2 hours ago)
[View Transaction on Explorer]
```

#### End of Day 3
- [ ] Commit: `git add backend frontend && git commit -m "feat: Blockchain game loop"`
- [ ] Full integration working: Draft → Play → Finalize → Show proof
- [ ] Estimate: 20-25 hours total, on track

---

### DAY 4 (Feb 25): TAPESTRY + POLISH

**Goal:** Scores published to Tapestry, all verification features live

#### Morning: Enable Tapestry storeScore (1-2h)
- [ ] Set `TAPESTRY_API_KEY` environment variable
- [ ] Update contest finalization to call `tapestryService.storeScore()`
- [ ] Test: Scores appear in Tapestry after contest ends
- [ ] Monitor logs for success messages

**Deliverable:** Tapestry receives published scores
```
LOG: Tapestry: Published score for user abc123
```

#### Mid-Day: Add Verification Badges (2h)
- [ ] Add "Verified on Tapestry" badge to team cards
- [ ] Add "Immutable on Solana" badge to leaderboard
- [ ] Show verification metadata (timestamp, hash)
- [ ] Link to verification (can check Tapestry + Explorer)

**Deliverable:** Visual proof of blockchain integration
```
┌─────────────────────────┐
│ Team: Dream Apes        │
│ Score: 147 pts          │
│ ✓ Verified on Tapestry  │
│ ✓ On Solana (tx: abc...)│
└─────────────────────────┘
```

#### Afternoon: End-to-End Testing (2-3h)
- [ ] Create test account
- [ ] Draft team
- [ ] Wait for contest end (or manually trigger cron)
- [ ] Verify blockchain signature + Tapestry content + UI badges
- [ ] Test on multiple browsers (mobile too)
- [ ] Check error handling (network fails, blockchain down, etc.)

**Deliverable:** All user journeys working
- Signup → Draft → Wait → Scores update → See blockchain proof

#### End of Day 4
- [ ] Commit: `git add . && git commit -m "feat: Tapestry + verification"`
- [ ] All blockchain features shipping to production
- [ ] Estimate: 35-40 hours total, on track for 5-day window

---

### DAY 5 (Feb 26): QA + DEMO PREP

**Goal:** Demo-ready, zero blockers, perfect presentation

#### Morning: QA Blitz (3-4h)
- [ ] Smoke test all pages: Home, Draft, Compete, Intel, Profile
- [ ] Check blockchain features: badges, links, explorer validation
- [ ] Test on mobile (iOS + Android)
- [ ] Check error states: Network down, API down, blockchain down
- [ ] Console errors: 0 errors, no warnings
- [ ] Performance: All pages load <2s

**Deliverable:** Bug tracker empty, all green
```
✓ Home loads (0.8s)
✓ Draft works (formation responsive)
✓ Compete shows blockchain badge
✓ Intel feed scrolls smoothly
✓ Profile loads (0 errors)
✓ Wallet connects (Privy)
✓ Mobile: All features work
```

#### Mid-Day: Demo Script + Video (2-3h)
**Record 3-minute demo video:**
1. **0:00-0:30** Signup: "Click sign with Solana, done in 5 seconds"
2. **0:30-1:15** Draft: "Pick 5 influencers, formation visual, hit submit"
3. **1:15-2:00** Leaderboard: "Live scores updating, see my rank, blockchain proof"
4. **2:00-2:45** Blockchain: "Click to verify on Solana, results are immutable"
5. **2:45-3:00** Pitch: "Tapestry for identity, Solana for integrity. SocialFi resurrected."

**Deliverable:** Recording showing all features work
- Clean production build
- Devnet deployed + accessible
- All links functional

#### Afternoon: Final Deployment (1-2h)
- [ ] Deploy to production (or ensure Devnet is stable)
- [ ] Double-check all env vars set
- [ ] Verify wallet works (Privy configured)
- [ ] Test from cold start (incognito window)
- [ ] Save final screenshots for submission

**Deliverable:** Live, ready for judging
- Frontend: https://foresight-demo.com (or Vercel link)
- Backend: Running on Render/Railway
- All features accessible

#### End of Day 5: SUBMISSION
- [ ] Git tags final commit: `git tag -a v1.0-submission`
- [ ] README includes: Deployed URLs, how to run locally, feature list
- [ ] Demo video uploaded (YouTube unlisted)
- [ ] Submission complete

---

## TASK BREAKDOWN BY ROLE

### Blockchain Engineer (Full-time, Days 1-4)

| Task | Day | Hours | Status |
|------|-----|-------|--------|
| Anchor setup + hello world | 1 | 5-6 | TBD |
| Program logic + tests | 1-2 | 4-5 | TBD |
| Devnet deployment | 2 | 2-3 | TBD |
| Backend integration | 2-3 | 6-8 | TBD |
| Contest lifecycle wiring | 3 | 3-4 | TBD |
| Tapestry storeScore | 4 | 1-2 | TBD |
| Testing + iteration | 2-4 | 10-12 | TBD |
| **TOTAL** | | **31-40** | |

### Backend Engineer (Part-time, Days 2-3)
- Help integrate Solana SDK
- Wire contest finalization
- Database schema updates
- Error handling

### Frontend Engineer (Part-time, Days 3-4)
- Display blockchain status
- Add verification badges
- Link to Explorer
- Mobile responsiveness

### Full Team (Day 5)
- QA testing
- Demo script + video
- Final deployment
- Presentation prep

---

## CRITICAL PATH

```
Day 1: Program builds locally
  ↓
Day 2: Program on Devnet + backend calls it
  ↓
Day 3: Game loop integrated (contest ends → blockchain called)
  ↓
Day 4: Frontend shows proof + Tapestry enabled
  ↓
Day 5: Demo video + QA
```

**If ANY day slips, day 5 is at risk. Catch blockers early.**

---

## DEPENDENCY CHECKLIST

**Before starting:**
- [ ] Solana CLI installed (`solana --version`)
- [ ] Rust installed (`rustc --version`)
- [ ] Anchor installed (`anchor --version`)
- [ ] `TAPESTRY_API_KEY` obtained (contact Tapestry team NOW)
- [ ] Team has Devnet knowledge (understand PDAs, SPL, basic Anchor)
- [ ] Git repo cleaned (no merge conflicts)

**If any are missing:** Delay start until resolved

---

## RISK MANAGEMENT

### Risk 1: Anchor Learning Curve
**Probability:** MEDIUM
**Mitigation:** Start Day 1 morning, use Anchor examples, pair programming

### Risk 2: Tapestry API Key Missing
**Probability:** LOW
**Mitigation:** Contact Tapestry team Feb 22 (TODAY). Fallback: Demo without it, explain in video

### Risk 3: Devnet Congestion
**Probability:** VERY LOW
**Mitigation:** Fallback to local validator for testing, check before demo

### Risk 4: Time Overruns
**Probability:** MEDIUM
**Mitigation:** Strict daily checkpoints, cut scope if needed (minimum: demo works without badge)

---

## SUCCESS CRITERIA (Day 5)

Judge sees demo and says: **"This is impressive. They understand Solana."**

Checklist:
- ✅ User can sign up (Privy) in <30 sec
- ✅ Can draft team in <5 min
- ✅ Can see live leaderboard
- ✅ Contest finalization visible on Solana
- ✅ Transaction signature link works
- ✅ Tapestry integration badge visible
- ✅ Code is clean, professional, no errors
- ✅ Demo script is polished, <3 min

---

## TEAM COMMUNICATION

**Daily Standup (9 AM):**
- Blockchain engineer: "What I built yesterday, what I'm building today, blockers"
- Other team: "Status on features that depend on blockchain, my blockers"

**Checkpoint Review (5 PM):**
- Show what shipped that day
- Review against expected progress
- Adjust timeline if needed

**Slack Channel:** #blockchain-sprint
- Quick updates throughout day
- Share links (Devnet program, Demo videos, etc.)

---

## REFERENCE DOCUMENTS

| Document | Read This When... |
|----------|---|
| SOLANA_BLOCKCHAIN_STRATEGY.md | You need deep context or have questions |
| BLOCKCHAIN_DECISION_SUMMARY.md | You need quick reference (judges ask questions) |
| ANCHOR_PROGRAM_SPEC.md | You're implementing the Anchor program |
| BLOCKCHAIN_INTEGRATION_ROADMAP.md | You need daily timeline (this file) |

---

## FINAL NOTES

**This is achievable.** We have:
- Clear scope (one instruction, one job)
- Working examples (Anchor docs, our backend/frontend patterns)
- 5 full days to build + test
- Strong product foundation (auth, draft, leaderboard already ship)

**The hardest part is focus.** Don't add features, don't refactor, just ship.

**On Day 5:** You'll show judges a hackathon project that feels like a real product.

---

**Document:** BLOCKCHAIN_INTEGRATION_ROADMAP.md
**Status:** READY FOR EXECUTION
**Last Updated:** February 22, 2026
**Next Step:** Assign blockchain engineer, start Day 1 morning
