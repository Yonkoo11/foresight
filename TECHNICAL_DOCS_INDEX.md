# Foresight Technical Documentation Index

## Strategic Planning Documents

This folder contains three complementary strategy documents for the CT intelligence platform pivot. Read them in order of detail level.

---

## 📋 Quick Navigation

### For Executives (10 min read)
**File:** `STRATEGY_SUMMARY.md` (9.5 KB)

Contains:
- One-page overview of the pivot
- Answers to 3 critical questions
- 6-week timeline overview
- Risk matrix
- Success metrics
- Resource requirements

**Read this if:** You need to make go/no-go decision quickly

---

### For Technical Leadership (90 min read)
**File:** `CTO_TECHNICAL_STRATEGY.md` (50 KB)

Contains:
- Detailed architecture assessment (1-5 scores per layer)
- Data pipeline design for credibility scoring (3 fallback sources)
- Prediction market architecture (off-chain + on-chain roadmap)
- API strategy & resilience planning
- Authentication expansion (Privy implementation)
- Mainnet migration checklist
- Infrastructure & scaling limits
- Detailed 6-week sprint plan (day-by-day)
- Security considerations & checklist

**Read this if:** You're engineering the pivot

---

### For Project Management (Ongoing reference)
**File:** `STRATEGY_SUMMARY.md` (Critical Path section)

Contains:
- Week-by-week deliverables
- Dependency mapping
- What blocks what
- Resource allocation

**Read this if:** You're tracking execution

---

## 📂 Repository Structure

```
/foresight/
├── CTO_TECHNICAL_STRATEGY.md         ← Detailed technical playbook (this quarter)
├── STRATEGY_SUMMARY.md               ← Executive summary & quick reference
├── TECHNICAL_DOCS_INDEX.md           ← This file
│
├── CLAUDE.md                         ← Project context (updated with design system)
├── TODO.md                           ← Sprint tracking (6-week plan now included)
├── SECURITY.md                       ← Security notes (JWT secret fix required!)
│
├── backend/
│   ├── DATABASE_SCHEMA.md            ← Current 49 tables (add 2 new for prediction markets)
│   ├── package.json                  ← 14 services, 100+ endpoints
│   └── src/
│       ├── services/                 ← Add: predictionMarketService.ts, credibilityScoreService.ts
│       └── api/                      ← Add: markets.ts, credibilityScores.ts
│
├── frontend/
│   ├── package.json                  ← React 19, Vite, TailwindCSS
│   └── src/
│       ├── components/               ← Add: MarketCard.tsx, ShareableCard.tsx, CredibilityBadge.tsx
│       └── pages/                    ← Add: Markets.tsx, Predictions.tsx
│
├── contracts/
│   └── src/                          ← Keep CTDraftPrizedV2.sol, delete 7 dormant contracts
│
└── docs/
    ├── design/DESIGN_TOKENS.md       ← Gold/cyan design system (use for new components)
    └── planning/                     ← Add: PREDICTION_MARKETS_SPEC.md, CREDIBILITY_SPEC.md
```

---

## 🎯 Key Documents by Section

### 1. Architecture Assessment
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 1
- **What:** Readiness scores for each technical layer
- **Key Finding:** Frontend 4/5, Backend 4/5, Smart Contracts 2/5
- **Action:** Delete dormant contracts, extend existing services

### 2. Data Pipeline for Credibility Scores
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 2
- **What:** How to extract predictions, track outcomes, calculate tiers
- **Tech:** NLP extraction (Mistral), PostgreSQL tracking, weekly cron resolution
- **Cost:** $200-400/month
- **Timeline:** Week 1 (2 weeks engineering)

### 3. Prediction Markets Architecture
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 3
- **What:** Off-chain settlement design, market types, resolution flow
- **Tech:** Database + API logic (no smart contract for MVP)
- **Smart Contract:** Deploy PredictionSettlement.sol later (mainnet)
- **Timeline:** Week 2-3 (3 weeks engineering)

### 4. API Strategy & Risk Mitigation
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 4
- **What:** Multi-source data architecture for X API independence
- **Backup Plan:** TwitterAPI.io → Nitter → Local Cache → Farcaster
- **Caching:** Redis for scale (10K+ users)
- **Rate Limiting:** Per-user limits, exempt admins

### 5. Authentication Expansion
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 5
- **What:** Add email/social login alongside SIWE
- **Solution:** Privy (handles email, Google, wallet, account linking)
- **Cost:** Free up to 5K DAU
- **Timeline:** Week 4 (1 week engineering)

### 6. Mainnet Migration Plan
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 6
- **Phases:** Preparation (security audit) → Deployment → Go-live
- **Key Changes:** Add emergency pause, timelock, rate limiting
- **Gas Costs:** $0.01-0.05 per transaction (Base is cheap)
- **Timeline:** Week 5 (1 week preparation)

### 7. Image Generation for Shareable Cards
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 7
- **Frontend:** html2canvas (free, already bundled)
- **Server-side:** Puppeteer for OG images (Twitter meta tags)
- **Caching:** 1 hour TTL (Redis or in-memory)
- **Timeline:** Week 5 (1 week engineering)

### 8. Infrastructure & Scaling
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 8
- **Current Limits:** 1K concurrent users (Vercel + Railway)
- **At 10K users:** Upgrade to Option 1 ($150/month)
- **At 100K users:** Migrate to serverless or horizontal (redesign needed)
- **Recommendation:** Vertical scale first, plan horizontal after $1M revenue

### 9. Technical Debt Cleanup
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 9
- **What:** Delete dormant contracts, unused quests, dead tables
- **Time:** 2-3 hours cleanup
- **Benefit:** Future clarity + reduced maintenance

### 10. 6-Week Engineering Sprint Plan
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 10
- **Week-by-week breakdown:** Day-by-day tasks, deliverables, tests
- **Assumes:** 1 full-time engineer, no interruptions
- **Feasibility:** Realistic if well-scoped

### 11. Security Considerations
- **File:** CTO_TECHNICAL_STRATEGY.md → Section 11
- **BLOCKER:** Fix JWT secret immediately (currently hardcoded in .env)
- **Mainnet:** Contract audit, multisig, oracle risk, rate limiting
- **Ongoing:** Weekly dependency updates, backups, secrets rotation

---

## ⚡ Quick Start Checklist

### This Week
- [ ] Founders review STRATEGY_SUMMARY.md
- [ ] Technical lead reviews CTO_TECHNICAL_STRATEGY.md
- [ ] Address JWT secret exposure (SECURITY.md → Section 1)
- [ ] Confirm pivot direction (commit to 6-week plan)
- [ ] Lock engineer allocation (no context switches)

### Week 1 Preparation
- [ ] Create Privy account, get app ID
- [ ] Subscribe to TwitterAPI.io ($150-300/month)
- [ ] Create Mistral API account ($50-100/month)
- [ ] Set up Upstash Redis (for later use, free tier)
- [ ] Create git branch for prediction markets feature

### Week 1 Engineering Start
- [ ] Begin credibility score extraction (NLP)
- [ ] Create influencer_predictions table migration
- [ ] Implement cron jobs for score updates
- [ ] Write frontend tier badge components

---

## 📊 Cost Breakdown

### Development Costs (One-Time)
| Item | Cost | Duration |
|------|------|----------|
| Engineering (1 person, 6 weeks) | Variable | 6 weeks |
| TwitterAPI.io setup | $0 | 1 hour |
| Privy integration | $0 | 4 hours |
| NLP API testing | $20-50 | 2 days |
| Smart contract audit | $0 (internal) | 5 days |
| Mainnet deployment | $0 (gas only) | 1 day |
| **Total** | **$20-50** | **6 weeks** |

### Monthly Operational Costs
| Service | Cost | Usage |
|---------|------|-------|
| TwitterAPI.io | $150-300 | Data collection |
| Mistral NLP | $50-100 | Prediction extraction |
| Vercel (frontend) | $0-20 | Current + growth |
| Railway (backend) | $5-20 | Current tier |
| Railway (database) | $5-20 | Current tier |
| Redis (Upstash) | $0-50 | At 10K users |
| Privy auth | $0 | Up to 5K DAU |
| **Total** | **$210-510** | **MVP operations** |

---

## 🚀 Success Definition

### MVP Launch (Week 6)
- Credibility scores calculated & displayed
- Users can create/enter prediction markets
- Email signup works (Privy)
- Shareable score cards generated
- 100+ beta users testing on testnet
- Zero critical bugs in testing

### Post-Launch (Weeks 7-10)
- Mainnet deployment (real ETH)
- 1K+ users with prediction markets active
- Premium tier revenue flowing
- Premium features available

---

## 📝 Document Maintenance

**Last Updated:** February 9, 2026

**Update This Index When:**
- New strategy documents added
- Major changes to 6-week plan
- New technical decisions made
- Learnings from sprint execution

**Owner:** CTO
**Review Frequency:** Weekly (first 6 weeks), then monthly

---

## 🔗 Related Documentation

**Existing docs in repo:**
- `CLAUDE.md` - Project context & design system
- `TODO.md` - Sprint tracking
- `SECURITY.md` - Security requirements
- `backend/DATABASE_SCHEMA.md` - Current DB schema
- `docs/design/DESIGN_TOKENS.md` - Styling guidelines
- `docs/ARCHITECTURE.md` - System architecture

**New docs needed:**
- `docs/planning/PREDICTION_MARKETS_SPEC.md` (detailed market types)
- `docs/planning/CREDIBILITY_ALGORITHM_SPEC.md` (scoring details)
- `docs/API_MIGRATION_GUIDE.md` (for third-party integrations)

---

## ❓ FAQ

**Q: Can we really ship this in 6 weeks with 1 engineer?**
A: Yes, if you lock the scope and avoid distractions. The tech stack is ready. The critical path is clear. Each week has specific deliverables.

**Q: What if we fall behind in Week 1-2?**
A: Prediction markets (Week 2-3) are not blocking. You can ship credibility scores + MVP with just that, and add markets in Week 7.

**Q: What's the biggest technical risk?**
A: X banning you (X API cutoff). Solution: Multi-source data + local caching. Mitigation plan is in Section 4 of main memo.

**Q: Do we need a formal smart contract audit?**
A: Not for testnet MVP. For mainnet launch: Internal audit + slither tool (free) is sufficient if you're careful. Formal audit ($5-15K) optional if you raise capital.

**Q: Should we use on-chain settlement or off-chain?**
A: OFF-CHAIN for MVP (cheaper, faster, reversible). Switch to on-chain after 10K users or if regulatory pressure.

**Q: Can we launch sooner than 6 weeks?**
A: Maybe Week 5 if you have 2 engineers. Week 4 with 3 engineers (parallel streams). But recommend Week 6 for quality.

---

## 💬 Next Steps

1. **Read STRATEGY_SUMMARY.md** (30 min, founders + tech lead)
2. **Read CTO_TECHNICAL_STRATEGY.md** (90 min, tech lead only)
3. **Align on approach** (1 hour meeting)
4. **Fix JWT secret immediately** (30 min, blocker)
5. **Start Week 1 engineering** (lock engineer, begin Week 1 tasks)

---

**Questions? Open an issue or schedule a sync.**

This is your technical playbook for the next 6 weeks. Bookmark it.
