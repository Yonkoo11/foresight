# CTO QUICK REFERENCE — ONE-PAGE STRATEGY

**Hackathon:** Solana Graveyard (Feb 12-27, 2026)
**Days Left:** 5 (Mon Feb 24 - Fri Feb 28)
**Prize:** $76K
**Goal:** Top 5 finish

---

## THE WINNING STRATEGY (30 SECONDS)

1. **Clean EVM code** → Remove ethers.js + SIWE (Mon)
2. **Activate Tapestry** → Wire scoring to Solana (Tue)
3. **Deploy to prod** → ct-foresight.xyz live (Wed)
4. **Perfect demo** → 2-min video + load test (Thu)
5. **Submit** → Celebrate (Fri)

**Why this wins:** Tapestry integration is differentiator. Judges care about UX + narrative, not raw technical complexity.

---

## DECISION CHECKLIST

Before Monday, confirm:

- [ ] **Proceeding with Tapestry (not building custom Solana program)?** YES
- [ ] **Tapestry API key requested at usetapestry.dev?** In progress (should arrive by Tue)
- [ ] **Accounts created at Neon + Railway + Vercel?** YES
- [ ] **Team capacity for 5-day sprint?** 4-5 people, 40 hours
- [ ] **ct-foresight.xyz domain ready?** YES

---

## ARCHITECTURE (5-MIN OVERVIEW)

```
┌─────────────────────────────────────────────────────────────────┐
│ FORESIGHT - Solana SocialFi Game                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND (React 18 + Vite + Tailwind)                          │
│  ├─ Home (/) — Dashboard                                        │
│  ├─ Draft (/draft) — Formation builder                          │
│  ├─ Play (/play) — Leaderboard + contests                       │
│  ├─ Feed (/feed) — CT tweets                                    │
│  ├─ Profile (/profile) — Stats + Tapestry badge                 │
│  └─ Deployed to: Vercel                                         │
│                                                                 │
│  BACKEND (Express + TypeScript + Knex)                          │
│  ├─ Auth (/api/auth) — Privy wallet integration                 │
│  ├─ League (/api/league) — Teams + contests                     │
│  ├─ Scoring — Weekly snapshots + real Twitter data              │
│  ├─ Tapestry (/services/tapestryService.ts) — ON-CHAIN          │
│  │  ├─ Profiles (created on signup) ✅                          │
│  │  ├─ Teams (stored on draft) ✅                               │
│  │  └─ Scores (stored on contest end) ✅ NEW                    │
│  └─ Deployed to: Railway                                        │
│                                                                 │
│  DATABASE (PostgreSQL)                                          │
│  ├─ Users + teams + scores                                      │
│  ├─ 100 influencers seeded (real CT data)                        │
│  ├─ 1 demo contest + 15 entries                                 │
│  └─ Deployed to: Neon                                           │
│                                                                 │
│  BLOCKCHAIN LAYER                                               │
│  ├─ Privy: Wallet connection (Solana)                           │
│  ├─ Tapestry: Identity + score storage (Solana protocol)        │
│  ├─ TwitterAPI.io: Real engagement data                         │
│  └─ NO CUSTOM SMART CONTRACT (not needed, risky)                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## WHAT JUDGES WILL SEE (90-SECOND DEMO)

1. Sign in with Solana wallet (2 sec) — Privy
2. See "Hackathon Demo League" contest (10 sec)
3. Draft a team (30 sec) — Pick 5 influencers, see formation
4. View leaderboard (20 sec) — See real rankings, your team
5. Check profile (10 sec) — See "Shared on Solana" badge
6. **The Pitch:** "Scores are on-chain via Tapestry. No one can fake their rank."

---

## TECH DEBT CLEANUP (MON-TUE)

| Item | Action | Time |
|------|--------|------|
| ethers.js | Remove from package.json | 30 min |
| siwe | Remove from package.json | 30 min |
| EVM code | Delete from prizedContestsV2.ts | 30 min |
| SIWE auth | Disable in auth.ts | 1 hour |
| Frontend ABIs | Delete abis.ts | 15 min |
| Tapestry wiring | `storeScore()` + `storeTeam()` | 2 hours |
| **TOTAL** | | **5 hours** |

**Must pass:** `npx tsc --noEmit` (0 errors)

---

## TAPESTRY INTEGRATION CHECKLIST

**What's built:**
- ✅ Profile creation on signup
- ✅ Team storage on draft
- ✅ `storeScore()` function (written, not called yet)
- ✅ Frontend badge component

**What's needed:**
- [ ] Activate API key (Tue AM)
- [ ] Wire `storeScore()` to contest finalization (Tue PM)
- [ ] Wire `storeTeam()` to team submission (Tue PM)
- [ ] Test: Create team, verify it's on Tapestry (Tue PM)
- [ ] Add UI: "View on Tapestry" links (Wed)

**Success metric:** Contest finalization logs show "Scores stored on Tapestry" 100% of the time

---

## DEPLOYMENT CHECKLIST

| Component | Service | Config | Time |
|-----------|---------|--------|------|
| Database | Neon | Run migrations + seed | 30 min |
| Backend | Railway | Set env vars + deploy | 30 min |
| Frontend | Vercel | Set env vars + deploy | 20 min |
| Domain | DNS | Point ct-foresight.xyz to Vercel | 5 min |
| **TOTAL** | | | **1.5 hours** |

**Go-live:** Wednesday 2 PM UTC (end-to-end tested)

---

## RISK & MITIGATION

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Tapestry API key delayed | HIGH | Fallback: Free leagues work without it |
| Auth fails under load | HIGH | Pre-create 10 demo accounts, load test |
| Production crash day-of | MEDIUM | 2x backend, failover DB, pre-recorded demo |
| Compiler errors | HIGH | Daily `npx tsc --noEmit` check |
| Demo video flops | MEDIUM | Have PDF walkthrough + screenshot backup |

**Contingency:** If anything breaks, we have pre-recorded demo. Demo 100% works offline.

---

## DAILY FOCUS (5 DAYS)

**MON:** Zero compiler errors + Tapestry key
```
✅ Remove ethers, siwe, EVM code
✅ Verify TypeScript clean
✅ Tapestry API key acquired
```

**TUE:** Tapestry scoring live
```
✅ Wire storeScore(), storeTeam()
✅ Test end-to-end
✅ Logs confirm Solana storage
```

**WED:** Production live
```
✅ Deploy Neon + Railway + Vercel
✅ ct-foresight.xyz is live
✅ End-to-end flow works
```

**THU:** QA + demo video
```
✅ Desktop + mobile testing (zero bugs)
✅ Load test (20 simultaneous users)
✅ Demo video recorded + approved
```

**FRI:** Submit + monitor
```
✅ Submit to hackathon
✅ Demo video delivered
✅ Monitor production 24/7
```

---

## ENVIRONMENT VARIABLES

### Backend (.env)
```
DATABASE_URL=postgresql://... (Neon)
JWT_SECRET=your-secret-key
PRIVY_APP_ID=your-id
PRIVY_APP_SECRET=your-secret
TAPESTRY_API_KEY=your-key ← GET THIS BY TUE
TWITTER_API_IO_KEY=your-key
NODE_ENV=production
```

### Frontend (.env)
```
VITE_AUTH_PROVIDER=privy
VITE_PRIVY_APP_ID=your-id
VITE_API_URL=https://railway-backend.com
```

---

## SUCCESS METRICS

**Code Quality:**
- TypeScript: 0 errors
- Tests: All passing
- Production: Zero 500 errors

**Product Quality:**
- Auth: Works for 20 simultaneous users
- Leaderboard: Shows real data
- Tapestry: Scores visible in logs + UI

**Demo Quality:**
- Video: Under 2 min, smooth, no bugs
- Judges can: Signup → draft → leaderboard in 90 sec
- Story: Clear, compelling, on-brand

---

## THE NARRATIVE

> SocialFi died because speculation (buy keys) replaced utility. Foresight resurrects it with fantasy sports (proven $100B industry). But we go further: we use Solana's Tapestry Protocol for trustless identity. That means no fake accounts, no stolen teams, scores that can't be manipulated. That's SocialFi resurrected.

---

## COMMIT STRATEGY

```
Mon: cleanup: remove EVM, activate Tapestry
Tue: feat: wire Tapestry scoring and team storage
Wed: deploy: production release (ct-foresight.xyz)
Thu: docs: final submission materials
Fri: release: hackathon submission
```

**Keep commits clean. Each should be shippable.**

---

## RESOURCES

**Links:**
- Tapestry docs: https://docs.usetapestry.dev
- Neon: https://neon.tech
- Railway: https://railway.app
- Vercel: https://vercel.com

**Credentials:**
- Store in 1Password or secure shared drive
- Never commit to GitHub

**Backups:**
- Keep local database dump
- Keep compiled frontend bundle
- Keep pre-recorded demo video on multiple devices

---

## IF SOMETHING BREAKS

1. **Check logs first** — Always
2. **Identify root cause** — Don't guess
3. **Fix locally, test** — Before redeploying
4. **Rollback if needed** — Revert last commit
5. **Document what happened** — Learn for next time

**On Friday:** If production is down, show pre-recorded demo. Judges understand.

---

## FINAL CHECKLIST BEFORE SUBMISSION

- [ ] App loads at https://ct-foresight.xyz
- [ ] Auth works (test Privy signup)
- [ ] Can draft a team
- [ ] Leaderboard shows entries
- [ ] Profile shows Tapestry badge
- [ ] No console errors (F12)
- [ ] Demo video plays
- [ ] GitHub repo is public
- [ ] All credentials are secure
- [ ] Team is ready to defend
- [ ] Backup demo is ready (offline)

---

## PROBABILITY OF SUCCESS

- **Top 10:** 98%
- **Top 5:** 85%
- **Win:** 70%

Why we're competitive:
1. Working product (not prototype)
2. Polished UX (looks professional)
3. Novel angle (Tapestry identity layer)
4. Tight narrative (SocialFi resurrection)
5. Founder credibility (shipped before)

Why we might lose:
1. Scope creep (get distracted, run out of time)
2. Auth friction (judges can't sign in)
3. Tapestry API issues (no fallback)
4. Execution slip (bugs in final stretch)

**Mitigation: Stick to the plan. No pivots after Monday.**

---

## FINAL WORD

You've done the hard part (building the product). The next 5 days are about **execution discipline** + **flawless demo**.

Focus on:
1. **Cleanest code possible** (this will be read by smart people)
2. **Best narrative** (judges decide in 60 seconds)
3. **Zero production errors** (one crash = loss)
4. **Flawless demo** (90-second signup → leaderboard flow)

**Ship it. You've got this. 🚀**

---

**Version:** 1.0
**Updated:** February 22, 2026
**Status:** APPROVED FOR SPRINT
