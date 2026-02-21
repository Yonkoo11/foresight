# FORESIGHT SPECIFICATION INDEX
**Master Navigation Guide for Product & Build Documents**

**Status:** LOCKED FOR IMPLEMENTATION | **Deadline:** Feb 27, 2026 | **Sprint:** 6 Days

---

## 📋 THE 4 SPECIFICATION DOCUMENTS

### 1. PRODUCT_SPECIFICATION_FINAL.md (2,050 lines)
**The Bible. Reference this for ANY question about what to build.**

Use this if you need to know:
- Product positioning & narrative
- Exact game mechanics (scoring, tiers, draft, contests)
- All 6 page layouts with wireframes
- Exact API endpoints with request/response format
- Data model and database schema
- Tapestry integration details
- Full 6-day build timeline
- Demo strategy and video structure
- Post-launch targets

**Reference patterns:**
- Section 3 for page layout questions
- Section 4 for scoring formula
- Section 5 for draft mechanics
- Section 7 for Tapestry integration
- Section 9 for API endpoints
- Section 11 for build timeline

---

### 2. SPEC_EXECUTIVE_SUMMARY.md (210 lines)
**Quick reference. Keep printed on your desk.**

Use this if you need to:
- Remind yourself what we're building (1-sentence pitch)
- See the 6 pages at a glance with URLs
- Understand game mechanics quickly
- Check tech decisions (Privy, Tapestry, DB)
- Remember critical success factors
- Know which files you'll touch

**Best for:** 5-minute refresher before coding, quick lookups during standup.

---

### 3. BUILD_CHECKLIST.md (574 lines)
**Daily task tracker. Print and post at your desk.**

Use this for:
- Day-by-day breakdown with time estimates
- Task-level details (what exactly to code)
- QA checkpoints for verification
- Demo checks after each day
- Emergency procedures if something breaks
- Daily standup template
- Success criteria at the end

**Best for:** Implementation tracking, daily progress reporting, staying on schedule.

---

### 4. SPECIFICATION_INDEX.md (This Document)
**Navigation guide. You are here.**

Use this to:
- Find which document to read for your question
- Understand the document hierarchy
- See quick decision reference table
- Get answers to "I'm confused, what do I read?"

---

## 🎯 QUICK REFERENCE: DECISION MATRIX

| Question | Answer | Where to Find |
|----------|--------|---------------|
| What are we building? | Skill-based fantasy sports game | SUMMARY (Overview section) |
| What are the 6 pages? | Home, Draft, Leaderboard, ContestDetail, Feed, Profile | SUMMARY (Pages table) or FINAL (Section 3) |
| What's the scoring formula? | Activity (0-35) + Engagement (0-60) + Growth (0-40) + Viral (0-25) + Captain 1.5x | FINAL (Section 4) or CHECKLIST (Scoring reference) |
| How big are teams? | 5 players: 1 Captain (S/A/B/C) + 1S + 1A + 1B + 1C | FINAL (Section 5) or SUMMARY (Mechanics) |
| What's the salary cap? | 150 draft points | FINAL (Section 5) or SUMMARY (Mechanics) |
| How long do contests run? | Monday 12:00 UTC → Sunday 23:59 UTC (7 days) | FINAL (Section 6) or SUMMARY (Contests) |
| Why Solana? | Tapestry Protocol identity layer (no spam, cross-app scores) | FINAL (Section 7) or SUMMARY (Why Solana) |
| What tech do we use? | Privy auth, Solana wallet, Tapestry API, PostgreSQL, React, Express | SUMMARY (Tech Decisions) or FINAL (Section 10) |
| When should I build this? | Day 1-6 of sprint (Feb 20-25) | CHECKLIST (Daily tasks) or FINAL (Section 11) |
| How do I know I'm done? | All 6 pages work, live data, Tapestry integration working, video recorded | CHECKLIST (Success Criteria) or FINAL (Section 13) |
| What if I get stuck? | Check Emergency Procedures section | CHECKLIST (Emergency Procedures) |
| How do I demo it? | 3-minute video: Problem (0:30) + Demo (1:45) + Impact (0:45) | FINAL (Section 12) or CHECKLIST (Day 6) |

---

## 🗺️ DOCUMENT HIERARCHY

```
SPECIFICATION_INDEX.md (You are here)
├─ 📌 For quick questions → SPEC_EXECUTIVE_SUMMARY.md
├─ 📌 For daily tasks → BUILD_CHECKLIST.md
├─ 📌 For detailed info → PRODUCT_SPECIFICATION_FINAL.md
└─ 📌 For implementation specifics → Go to FINAL section X
```

---

## 🚀 HOW TO USE THESE DOCUMENTS

### Scenario 1: "I'm starting Day 1. What do I do?"
1. Read: CHECKLIST (Day 1 section) - tells you exact tasks
2. Reference: FINAL (Section 10 - Tech Migration) for implementation details
3. Start coding: Check off tasks as you go

### Scenario 2: "I'm confused about the draft mechanics"
1. Quick overview: SUMMARY (Mechanics section) - 5 min read
2. Deep dive: FINAL (Section 5 - Draft Mechanics) - 15 min read
3. Reference: CHECKLIST (Day 2 - Draft page section) for code tasks

### Scenario 3: "What goes on the Home page?"
1. Layout: FINAL (Section 3, Page 1) - See exact wireframe
2. Data needed: FINAL (Section 3, Page 1 - Data Requirements)
3. States: FINAL (Section 3, Page 1 - States) - loading, error, empty, populated
4. Build: CHECKLIST (Day 1 or 5 - Home page) - Task-level details

### Scenario 4: "Why did we choose Tapestry?"
1. Quick reason: SUMMARY (Why Solana section) - 2 min
2. Full details: FINAL (Section 7 - Tapestry Integration) - 10 min
3. Integration tasks: FINAL (Section 10 - Tech Migration) - 5 min

### Scenario 5: "How do I know I'm done?"
1. Today's checklist: CHECKLIST (Daily QA section)
2. Day X demo check: CHECKLIST (Day X evening - Demo Check)
3. Final success: CHECKLIST (Success Criteria section)

### Scenario 6: "Something's broken. What do I do?"
1. Emergency procedures: CHECKLIST (Emergency Procedures section)
2. Escalate: Tell the team lead immediately
3. Reference: May need FINAL (Relevant section) for context

---

## 📊 BUILD TIMELINE AT A GLANCE

| Day | Focus | Deliverable | CHECKLIST Section |
|-----|-------|-------------|-------------------|
| **1** | Auth + Tapestry | Sign in works | Day 1 |
| **2** | Draft page | Can build teams | Day 2 |
| **3** | Leaderboard + automation | Live scoring + rankings | Day 3 |
| **4** | Feed + contest detail | Tapestry storage confirmed | Day 4 |
| **5** | Profile + seeding | All 6 pages done | Day 5 |
| **6** | Testing + video | Live MVP ready | Day 6 |

**Full timeline with time estimates:** FINAL (Section 11) or CHECKLIST (Daily tasks)

---

## 🔒 LOCKED DECISIONS (Don't Change These)

**These decisions are FINAL. Deviation requires explicit approval.**

| Decision | Locked Value | Why |
|----------|-------------|-----|
| Number of pages | 6 exact pages | Hackathon scope constraint |
| Team size | 5 players | Proven fantasy sports formula |
| Salary cap | 150 points | Competitive balance |
| Scoring formula | Activity/Engagement/Growth/Viral | Tested, anti-gaming |
| Captain bonus | 1.5x (not 2x) | Prevents runaway scoring |
| Contest duration | 7 days (Mon-Sun UTC) | Matches CT discourse cycle |
| Tiers | S/A/B/C (counts: 4/16/30/50) | Player pool size |
| Platform fee | 15% rake (85% payout) | Industry standard |
| Auth method | Privy + Solana | Required for hackathon |
| Integration | Tapestry Protocol | Required for "Solana-native" |
| Database | PostgreSQL + Tapestry | Split: speed + portability |

---

## ❓ FAQ: Document Navigation

**Q: I just started. Where do I begin?**
A: Read SUMMARY first (10 min). Then read CHECKLIST for today's tasks (15 min). Then start coding.

**Q: How detailed should I get?**
A: SUMMARY for overview. CHECKLIST for your daily task. FINAL only if you need more detail.

**Q: Should I read everything?**
A: No. Read SUMMARY entirely. Read CHECKLIST entirely. Reference FINAL only as needed.

**Q: What if FINAL contradicts SUMMARY?**
A: FINAL is the source of truth. SUMMARY is a condensed version. They shouldn't conflict, but FINAL wins.

**Q: Can I deviate from the timeline?**
A: Only if you're ahead of schedule. If you're behind, escalate immediately.

**Q: Where are the exact API endpoints?**
A: FINAL (Section 9 - API Endpoints). Also reference the existing codebase.

**Q: How do I know what code to write?**
A: CHECKLIST has the exact tasks. FINAL (Section 10) has file locations and what to change.

**Q: What if I have a question not in these docs?**
A: Ask the team lead immediately. Don't guess. Better to clarify than build the wrong thing.

---

## 📁 FILE LOCATIONS

All specification documents live at repo root:
```
/Users/mujeeb/foresight/
├─ PRODUCT_SPECIFICATION_FINAL.md       ← Full specification (2,050 lines)
├─ SPEC_EXECUTIVE_SUMMARY.md            ← Quick reference (210 lines)
├─ BUILD_CHECKLIST.md                   ← Daily tracker (574 lines)
└─ SPECIFICATION_INDEX.md               ← This file
```

**Version control:** All committed to `main` branch with git tags:
```bash
git log --oneline | grep spec
git tag | grep day
```

---

## ✅ BEFORE YOU START CODING

Checklist to verify you're ready:

- [ ] Read SPECIFICATION_INDEX.md (this document) - 5 min
- [ ] Read SPEC_EXECUTIVE_SUMMARY.md - 10 min
- [ ] Read BUILD_CHECKLIST.md - 15 min
- [ ] Skim PRODUCT_SPECIFICATION_FINAL.md - 10 min
- [ ] Environment variables set (.env.local)
- [ ] Dependencies installed (`pnpm install`)
- [ ] Backend server starts (`cd backend && pnpm dev`)
- [ ] Frontend server starts (`cd frontend && pnpm dev`)
- [ ] Database migrates (`pnpm exec knex migrate:latest`)
- [ ] Understand today's tasks (CHECKLIST Day X)
- [ ] Ask clarification questions BEFORE coding

**Time investment:** 40 minutes total. Will save you hours of confusion.

---

## 🎬 FOR THE DEMO

**What judges will see:** Your 3-minute video + live MVP

**What you need to explain:**
1. Problem: SocialFi died (Friend.tech ponzi)
2. Solution: Fantasy sports game + Tapestry identity
3. Impact: Solana-native, cross-app portable

**Where to find demo details:**
- Full strategy: FINAL (Section 12 - Demo Strategy)
- Video structure: FINAL (Section 12 - 3-Minute Format)
- Data to seed: FINAL (Section 12 - What Data to Seed)
- Daily prep: CHECKLIST (Day 6 - Demo section)

---

## 🆘 NEED HELP?

**Q: I'm stuck on a task**
→ Check CHECKLIST emergency procedures → Ask team lead immediately

**Q: I don't understand a decision**
→ Check FINAL section where decision is explained → Ask team lead if confused

**Q: I think we should change something**
→ Document why → Show team lead → Get explicit approval → Update all docs

**Q: I'm ahead of schedule**
→ Polish what you've built → Help teammates → Don't add new scope

**Q: I'm behind schedule**
→ Escalate immediately → Reduce scope if necessary → Focus on critical path

---

## 📞 COMMUNICATION

**For spec questions:** Ask in engineering chat with doc reference
- "How should the draft component work? See FINAL section 5."
- "What's the scoring formula? See SUMMARY mechanics section."

**For implementation issues:** Ask with code context
- "How do I integrate Privy? See FINAL section 10 + CHECKLIST day 1."
- "What Tapestry API should I call? See FINAL section 7 + section 9."

**For blockers:** Escalate immediately with context
- "Privy API key not working. Need help from [person]. See FINAL section 10."

---

## 🎯 FINAL REMINDER

**These documents are the contract between product and engineering.**
- Product promised: "We'll build exactly this."
- Engineering promised: "We'll deliver exactly this on schedule."
- Judge will see: "Does this match what was promised?"

**Read them. Reference them. Follow them. Ship on time.**

---

**Last updated:** February 20, 2026
**Next update:** After hackathon (post-mortems + learnings)
**Questions?** Ask team lead with document reference

🚀 Let's ship this MVP and win the hackathon.
