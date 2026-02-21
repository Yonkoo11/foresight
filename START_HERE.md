# 🚀 START HERE - FORESIGHT HACKATHON SPECIFICATION
**Final Product Specification - LOCKED FOR IMPLEMENTATION**
**Solana Graveyard Hackathon | Deadline: February 27, 2026 (6 Days)**

---

## 📚 YOU HAVE 4 NEW DOCUMENTS

These were created in the last hour to guide your 6-day sprint:

### 1. **SPECIFICATION_INDEX.md** (← Read this FIRST)
Master navigation guide. Tells you which document to read for any question.
**Read time:** 5 minutes | **Bookmark this**

### 2. **SPEC_EXECUTIVE_SUMMARY.md** (← Read this SECOND)
2-page quick reference. What you're building + key decisions.
**Read time:** 10 minutes | **Print and post at desk**

### 3. **PRODUCT_SPECIFICATION_FINAL.md** (← Reference as needed)
Complete 2,050-line specification. The Bible for implementation details.
**Read time:** 30 minutes (skim) or 2+ hours (deep dive) | **Search for specific sections**

### 4. **BUILD_CHECKLIST.md** (← Use every day)
Day-by-day tasks with time estimates. Your daily roadmap.
**Read time:** 15 minutes | **Print and check off daily**

---

## ⚡ THE 30-SECOND PITCH

**What:** Fantasy sports game for Crypto Twitter influencers
**Why:** SocialFi died (ponzi mechanics). We resurrect with game theory + identity layer.
**How:** Draft 5 influencers, earn points from their social engagement, compete for SOL prizes
**Solana-native:** Using Tapestry Protocol for identity + score portability (no spam, cross-app)

---

## 🎯 WHAT YOU'RE BUILDING (6 Pages, That's It)

| Page | URL | What It Does |
|------|-----|--------------|
| **Home** | `/` | Show my team, current rank, upcoming contests |
| **Draft** | `/draft` | Build team with captain + 4 tiers, 150pt budget |
| **Leaderboard** | `/leaderboard` | Live rankings, scores update hourly |
| **Contest Detail** | `/contest/:id` | Rules, prize breakdown, timeline |
| **CT Feed** | `/feed` | Tweets from top 100 influencers + your team |
| **Profile** | `/profile` | My stats, achievements, wallet connection |

**Delete everything else.** No Quests, no Referrals, no Analytics. Scope = 6 pages.

---

## ⏰ YOUR 6-DAY TIMELINE

| Day | Build | By End of Day |
|-----|-------|------------|
| **Thu Feb 20** | Auth (Privy) + Tapestry setup | Users can sign in with Solana |
| **Fri Feb 21** | Draft page + formation visual + budget | Can build teams, see constraints |
| **Sat Feb 22** | Leaderboard + live scoring + automation | Live rankings, scores updating hourly |
| **Sun Feb 23** | CT Feed + Contest detail + Tapestry storage | Teams stored on-chain, feed works |
| **Mon Feb 24** | Profile page + admin seeding | All 6 pages done, demo data ready |
| **Tue Feb 25** | Testing + demo video + final polish | Live MVP ready for judging |

**Each day has a QA checklist.** See BUILD_CHECKLIST.md

---

## 🎮 GAME MECHANICS (Everything You Need)

**Team:** 5 players (1 Captain + 4 tier-slots)
- Captain: 1.5x bonus, can be any tier
- Tiers: S (4 total) / A (16) / B (30) / C (50)
- Budget: 150 points (artificial scarcity)
- Draft time: 15 minutes or auto-fill

**Scoring (Per-Player, Per-Week):**
- Activity: 0-35 pts (tweets × 1.5)
- Engagement: 0-60 pts (likes + retweets + replies)
- Growth: 0-40 pts (followers gained)
- Viral: 0-25 pts (high-engagement tweets)
- **Team Total = Captain × 1.5 + 4 others × 1**

**Contests:** Monday-Sunday, 7 days
- Updates 4x daily (00:00, 06:00, 12:00, 18:00 UTC)
- Free (no prizes) or Paid (15% rake, 85% payout)
- Leaderboard updates live every 60 seconds

**Full details:** See SPEC_EXECUTIVE_SUMMARY.md (Mechanics section)

---

## 🛠️ TECH DECISIONS (Already Decided)

| Decision | What We Use | Why |
|----------|------------|-----|
| **Frontend** | React 18 + Vite + TailwindCSS | Existing codebase |
| **Backend** | Express + TypeScript + Knex | Existing codebase |
| **Database** | PostgreSQL | Existing, proven |
| **Auth** | Privy + Solana wallet | Required for hackathon |
| **Social Layer** | Tapestry Protocol (Solana) | Identity verification + score storage |
| **Smart Contracts** | Phase 2 only | MVP uses database for state |
| **Twitter Data** | TwitterAPI.io | Already integrated (670 lines) |
| **Design** | Gold + dark theme | Locked (no purple) |

**Migration needed:** SIWE → Privy auth (See BUILD_CHECKLIST Day 1)

---

## 📖 HOW TO GET ANSWERS

**"What should page X look like?"**
→ PRODUCT_SPECIFICATION_FINAL.md → Section 3 (Pages & Screens)

**"What's the scoring formula exactly?"**
→ PRODUCT_SPECIFICATION_FINAL.md → Section 4 (Scoring System)

**"What API endpoint should I call?"**
→ PRODUCT_SPECIFICATION_FINAL.md → Section 9 (API Endpoints)

**"What code do I write today?"**
→ BUILD_CHECKLIST.md → Today's section (with time estimates)

**"Why did we choose Tapestry?"**
→ SPEC_EXECUTIVE_SUMMARY.md → Tech Decisions section

**"I'm confused about tech migration"**
→ PRODUCT_SPECIFICATION_FINAL.md → Section 10 (Tech Migration Plan)

**"Is this in scope for MVP?"**
→ SPEC_EXECUTIVE_SUMMARY.md → Locked decisions table

---

## ✅ BEFORE YOU START CODING (30 Min)

Checklist to verify you're ready:

```bash
# 1. Read the documents (20 min)
[ ] Read SPECIFICATION_INDEX.md - which doc for what
[ ] Read SPEC_EXECUTIVE_SUMMARY.md - the overview
[ ] Read BUILD_CHECKLIST.md - today's tasks
[ ] Skim PRODUCT_SPECIFICATION_FINAL.md - what section for what

# 2. Setup (10 min)
[ ] Install dependencies: pnpm add @privy-io/react-auth socialfi
[ ] Set environment variables in .env.local
[ ] Start backend: cd backend && NODE_OPTIONS='--import tsx' pnpm dev
[ ] Start frontend: cd frontend && pnpm dev
[ ] Run migrations: pnpm exec knex migrate:latest
[ ] Verify: No errors, servers running on 3001 and 5173

# 3. Ready to build
[ ] Understand today's tasks (from BUILD_CHECKLIST)
[ ] Ask clarification questions BEFORE coding
[ ] Start with first task
```

---

## 🎬 THE DEMO (3 Minutes)

**What judges see:**
- Your app working live (draft → leaderboard → scores)
- 3-minute video explaining why Solana

**Your narrative:**
1. **Problem (0:30):** Friend.tech died. SocialFi is dead. Just ponzi mechanics.
2. **Solution (1:45):** Foresight resurrects it with fantasy sports game theory + identity layer.
3. **Impact (0:45):** Using Solana's Tapestry Protocol. Scores portable across apps. Real monetization.

**Full demo strategy:** PRODUCT_SPECIFICATION_FINAL.md → Section 12

---

## 🚨 CRITICAL: DON'T DO THESE THINGS

❌ **Don't build stuff not in the spec**
- No referrals, no quests, no analytics
- 6 pages. That's it.

❌ **Don't deviate from tech decisions**
- Must use Privy (not SIWE)
- Must use Tapestry (not custom API)
- Must be Solana-native

❌ **Don't skip the spec documents**
- Read them before coding
- Reference them when confused
- Ask questions before building

❌ **Don't build multiple features in parallel**
- One page at a time, complete with QA
- Complete Day 1 before starting Day 2

❌ **Don't miss the deadline**
- Feb 27, 6 days to ship
- If behind schedule, cut scope, don't slip deadline

---

## 🆘 WHEN YOU GET STUCK

**Blocked on task?**
→ Check BUILD_CHECKLIST emergency procedures → Ask team lead immediately

**Don't understand a decision?**
→ Find the section in PRODUCT_SPECIFICATION_FINAL.md → Ask for clarification

**Need code reference?**
→ Check existing codebase (fantasyScoringService.ts, ctFeedService.ts)

**Performance issue?**
→ Optimize queries, use lazy loading, add indexes

**Can't decide on implementation?**
→ Spec says exactly what to do → Reference Section X → Ask if unclear

---

## 📊 SUCCESS = THIS

At end of Day 6, you have:

✅ All 6 pages built and working
✅ Users can sign in with Solana wallet
✅ Users can draft teams (formation visual, budget, 15 min timer)
✅ Leaderboard shows live scores (updates every 60 sec)
✅ CT Feed shows tweets from influencers
✅ Teams stored on Tapestry (verified via API)
✅ Contest lifecycle automated (open → locked → finalized)
✅ Demo data seeded (50+ entries, realistic)
✅ 3-minute video recorded
✅ Zero console errors
✅ Mobile responsive
✅ Judges impressed

---

## 📞 QUESTIONS? START HERE

1. **Is this feature in scope?** → SPEC_EXECUTIVE_SUMMARY.md → Locked decisions
2. **What should this look like?** → PRODUCT_SPECIFICATION_FINAL.md → Section 3
3. **What's my task for today?** → BUILD_CHECKLIST.md → Today's section
4. **How do I implement this?** → PRODUCT_SPECIFICATION_FINAL.md → Section 10
5. **Where do I find the file?** → PRODUCT_SPECIFICATION_FINAL.md → Section 8 or 10
6. **Still confused?** → Ask team lead with document reference

---

## 🎯 RIGHT NOW

**Do this immediately:**

1. **Open** SPECIFICATION_INDEX.md → Bookmark it
2. **Read** SPEC_EXECUTIVE_SUMMARY.md → 10 minutes
3. **Read** BUILD_CHECKLIST.md (your day section) → 15 minutes
4. **Start** first task from BUILD_CHECKLIST
5. **Reference** PRODUCT_SPECIFICATION_FINAL.md as needed

**Time investment:** 40 minutes to read everything
**Time saved:** Hours of confusion and rework

---

## 🏁 THE GOAL

Ship a working MVP in 6 days that:
- Shows Solana integration (Tapestry)
- Demonstrates game theory (fantasy sports, not ponzi)
- Resurrects SocialFi with utility
- Wins judges' hearts + votes

**This is possible. You have the spec. You have the timeline. You have the team.**

**Let's build this. 🚀**

---

**Last Updated:** February 21, 2026
**Status:** LOCKED FOR IMPLEMENTATION
**Deadline:** February 27, 2026

### Document Stack:
1. START_HERE.md ← You are here
2. SPECIFICATION_INDEX.md ← Master navigation
3. SPEC_EXECUTIVE_SUMMARY.md ← Quick reference
4. BUILD_CHECKLIST.md ← Daily tasks
5. PRODUCT_SPECIFICATION_FINAL.md ← Full details

**Read them in order. Ask questions. Build on time. Ship to win.**
