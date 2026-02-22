# BLOCKCHAIN STRATEGY: EXECUTIVE SUMMARY
**One-Page Decision Brief for Foresight Team**

---

## THE DECISION

**Build a MINIMAL Solana Anchor program** that stores contest results on-chain (winner list + score hash).

- **NOT:** Everything on-chain (too complex, too slow, misses hackathon deadline)
- **NOT:** Nothing on-chain (judges want to see Solana understanding)
- **YES:** Lean program that proves integrity without over-engineering

---

## WHY THIS DECISION

| Criteria | Our Choice | Why |
|----------|-----------|-----|
| **UX Impact** | 0 (no user-facing blockchain) | Game speed matters more than on-chain speed |
| **Judge Impression** | HIGH (smart pragmatism) | Shows off-chain wisdom + Solana knowledge |
| **Dev Time** | 40-60h (achievable) | Fits in 5-day window with buffer |
| **Risk** | LOW (game works if blockchain fails) | Off-chain fallback always available |

---

## WHAT WE BUILD

### 1. Anchor Program (20-25h)
```rust
// One instruction: finalize_contest()
// Inputs: contest_id, winners[], score_hash
// Storage: ContestResult PDA
// Purpose: Immutable audit trail of winners
```

**On Solana Devnet:**
- Per-contest storage: ~350 bytes
- Cost per finalization: 5,000 lamports (~$0.0005)
- No user transactions needed (backend pays via authority account)

### 2. Backend Integration (10h)
- Create transactions when contest ends
- Fallback if blockchain fails (continue in DB)
- Store blockchain signature in PostgreSQL

### 3. Frontend Integration (8h)
- Show "Finalized on Solana" badge
- Display transaction signature for verification
- Link to Solana Explorer for proof

### 4. Enable Tapestry storeScore (3h)
- Call after contest ends
- Publish final scores to Tapestry Protocol
- Shows data is portable across ecosystem

---

## EFFORT BREAKDOWN

| Phase | Days | Hours | Owner |
|-------|------|-------|-------|
| **Anchor Setup + Development** | 1-2 | 20h | Blockchain Engineer |
| **Backend Integration** | 2-3 | 10h | Backend Engineer |
| **Frontend Integration** | 3-4 | 8h | Frontend Engineer |
| **Tapestry + Testing** | 4-5 | 8h | Full Team |
| **Demo + Polish** | 5 | 5h | Full Team |
| **TOTAL** | **5 days** | **51h** | **1-2 people** |

**Resource:** Assign 1 engineer full-time to blockchain work (days 1-4), then all-hands demo prep (day 5).

---

## SUCCESS CRITERIA (For Judges)

Judges will be satisfied if demo shows:

1. ✅ Sign up with Solana wallet (Privy) — <30 seconds
2. ✅ Draft team with formation visual — <5 minutes
3. ✅ Real-time leaderboard (SSE updates) — live scores
4. ✅ Contest finalization on Solana — see transaction signature
5. ✅ Tapestry verification badge — shows identity integration
6. ✅ Score verification hash — proves results aren't manipulated

**If all 6 are working: Demo passes technical bar.**

---

## WHAT NOT TO DO

| Mistake | Why Not |
|---------|---------|
| Store every score on-chain | Would need 1000+ transactions per contest (expensive, slow) |
| Per-user blockchain transactions | UX disaster (users see approval popups) |
| Full leaderboard on-chain | Account size limits (can't store 1K+ entries) |
| Custom token distribution | Securities risk + complexity (not needed for demo) |
| Storing data in Solana instead of Tapestry | Tapestry is designed for social data (use it!) |

---

## TIMELINE (5-Day Execution)

```
Day 1-2: ANCHOR PROGRAM
├─ Setup Anchor project
├─ Write finalize_contest() instruction
├─ Deploy to Devnet
└─ ✓ CHECKPOINT: Program works on Devnet

Day 3: BACKEND INTEGRATION
├─ Create transaction logic
├─ Add blockchain_status to contests table
├─ Test end-to-end
└─ ✓ CHECKPOINT: Contest finalization works

Day 4: FRONTEND + TAPESTRY
├─ Show blockchain status on leaderboard
├─ Enable storeScore() for Tapestry
├─ Add verification badges
└─ ✓ CHECKPOINT: Full demo works

Day 5: QA + DEMO VIDEO
├─ Record video: "Sign up → Draft → Win → Solana proof"
├─ Test all user flows
├─ Deploy to prod (or ensure Devnet stable)
└─ ✓ READY FOR JUDGING
```

---

## KEY DECISIONS MADE

| Question | Answer | Evidence |
|----------|--------|----------|
| **Do we need a program?** | YES | Judges expect Solana understanding |
| **How complex?** | MINIMAL | Winners show pragmatism, not complexity |
| **Pay for transactions?** | Backend (authority account) | Better UX, no user friction |
| **Which network?** | Devnet | Free, fast, no real money risk |
| **What about Tapestry?** | Enable storeScore | Judges built Tapestry, will appreciate good use |
| **What about blockchain fallback?** | Game continues if blockchain fails | De-risk the demo |

---

## RISKS & MITIGATIONS

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Anchor program incomplete by deadline | MEDIUM | HIGH | Start immediately (Day 1) |
| Tapestry API key missing | LOW | MEDIUM | Contact Tapestry team NOW |
| Solana RPC downtime during demo | VERY LOW | MEDIUM | Use public Devnet RPC |
| Account size limits reached | VERY LOW | LOW | Minimal program (only winner list, not full ledger) |

---

## JUDGE MESSAGING

When judges ask "Why Solana?"

**Answer:**
> "We use Tapestry Protocol for verified identity (wallet → profile). Solana stores immutable contest results so anyone can prove winners weren't manipulated. Scores update hourly from Twitter data, but finalization on Solana creates an audit trail that lives forever. Game theory + verifiable claims = resurrection of SocialFi."

---

## NEXT STEPS

1. **NOW:** Reach out to Tapestry team (get API key)
2. **Day 1 Morning:** Assign blockchain engineer to Anchor project
3. **Day 1:** Follow Anchor examples (anchor.lang.com/docs)
4. **Day 2:** Test on Devnet with mock data
5. **Day 3:** Wire backend to create transactions
6. **Day 4:** Frontend integration
7. **Day 5:** Demo video

---

**Document:** BLOCKCHAIN_DECISION_SUMMARY.md
**Status:** FINAL RECOMMENDATION
**Owner:** Solana & Blockchain Strategy Agent
**Date:** February 22, 2026

---

**For questions or deeper analysis, see:** `SOLANA_BLOCKCHAIN_STRATEGY.md`
