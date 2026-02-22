# Foresight Pivot Strategy — Executive Summary

## One-Page Overview

**Current State:** Foresight is a well-built fantasy sports game. The codebase is solid, infrastructure is set up, and core features work.

**Pivot Opportunity:** Become a CT (Crypto Twitter) intelligence platform with credibility scoring and prediction markets.

**Bottom Line:** The tech stack is 80% ready. You can launch an MVP in 6 weeks with 1 engineer.

---

## Three Big Questions (Answered)

### 1. Is the current stack suitable?
**YES.** React 19, Express backend, PostgreSQL, smart contracts all capable. No need to rebuild.

**Weaknesses:** Dormant smart contracts (delete them), weak data pipeline (needs extension), limited caching (add Redis at 10K users).

**Strengths:** Clean code, good separation of concerns, migrations tested, auth system solid.

### 2. How do you score influencer credibility?
**Define predictions → Track outcomes → Calculate accuracy → Display scores.**

You need:
- NLP to extract predictions from tweets (~$50-100/month via Mistral API)
- Database table to store predictions + resolutions
- Weekly cron to update credibility scores (S/A/B/C tiers)
- Frontend to display scores on influencer cards

**Cost:** $200-300/month (TwitterAPI.io + NLP + storage)

### 3. How do you build prediction markets?
**Off-chain settlement now, on-chain later.**

Build markets like this:
- User creates market: "Will @vitalik get 10K likes?"
- Users stake 0.001 ETH on bullish/bearish
- Market auto-resolves using historical data
- Winners claim payouts (off-chain for now)

**No smart contract needed for MVP.** Just database + API logic. Smart contract settlement comes at mainnet launch.

---

## The Pivot in 6 Weeks

### Week 1: Data Pipeline
- Extract predictions from tweets (NLP)
- Calculate credibility scores
- Display on UI
**Status:** Ready to score influencers

### Week 2-3: Prediction Markets
- Create markets (bullish/bearish)
- Users enter with stakes
- Market resolution logic
**Status:** Users can predict

### Week 4: Better Auth
- Email signup (via Privy)
- Google login
- Link wallet later
**Status:** 10x easier onboarding

### Week 5: Mainnet Prep
- Audit smart contracts
- Deploy to Base mainnet
- Shareable score cards
**Status:** Ready for real ETH

### Week 6: Polish
- Bug fixes
- Monitoring setup
- Soft launch to 100 beta users
**Status:** MVP shipped

---

## Critical Decisions

### 1. X API Risk
**Problem:** X could ban you (they did to "InfoFi" in Jan 2026)

**Solution:** Three-layer approach
1. TwitterAPI.io (primary, $150-300/month)
2. Nitter (fallback, free but slow)
3. Local cache (store everything you fetch)

**Mitigation:** Cache tweets locally. If X cuts off, you have 90 days of data to work with.

### 2. Database vs On-Chain
**For prediction settlement: Keep it off-chain.**
- Cheaper (free to resolve)
- Faster (1-2 seconds vs 2-3 blocks)
- Reversible (if dispute, can refund)
- Flexible (can adjust odds on fly)

Move to on-chain only when:
- You have real money flowing
- Users demand decentralized settlement
- You have $500K+ for smart contract audit

### 3. Authentication Expansion
**Use Privy (not custom solution).**
- Handles email, Google, wallet all in one
- Free up to 5K users
- Account linking built-in
- Saves 2 weeks of engineering

### 4. Smart Contract Cleanup
**Delete all dormant contracts.**
- CTDraft v1 (replaced by V2)
- ReputationEngine (never used)
- DailyGauntlet (feature removed)
- Others (technical debt)

Cost: 2 hours of cleanup. Benefit: Future clarity.

---

## Critical Path (What Blocks What)

```
Data Pipeline (Week 1) ─────┐
                             ├─→ Credibility Scores (Week 1-2) ─┐
Prediction Markets (Week 2-3)────────────────────────────────┤
                                                               ├─→ MVP (Week 6)
Auth Expansion (Week 4) ──────────────────────────────────────┤
                                                               ├─→ Mainnet (Week 7)
Mainnet Audit (Week 5) ────────────────────────────────────────┤
                             │
Shareable Cards (Week 5) ────┘
```

**If delayed:**
- Data pipeline delayed? Everything delays (need credibility scores first)
- Prediction markets delayed? Non-blocking (works without, but core feature)
- Auth expansion delayed? Non-blocking (SIWE still works)
- Mainnet delayed? Non-blocking (beta can run on testnet longer)

---

## What You Get by Week 6

| Feature | Status | Users Can... |
|---------|--------|-------------|
| Credibility Scores | ✅ Live | See influencer prediction accuracy, sorted by tier (S/A/B/C) |
| Prediction Markets | ✅ Live | Create markets, stake ETH, compete for payouts |
| Email Signup | ✅ Live | Sign up without wallet, add wallet later |
| Shareable Cards | ✅ Live | Generate PNG of their score, share on Twitter |
| Mobile-Friendly | ✅ (existing) | Use on phone |
| Leaderboard | ✅ (existing) | See all-time rankings |

---

## Resource Requirements

### Engineering
- **1 engineer (full-time, 6 weeks):** Can ship MVP
- **2 engineers (full-time, 4 weeks):** Can ship MVP + mainnet + premium features
- **3 engineers (full-time, 3 weeks):** Can ship MVP + mainnet + premium + mobile

### Infrastructure
- **Current:** $20-30/month (Vercel + Railway)
- **With growth:** $50-100/month at 5K users
- **At 10K users:** $150-200/month (add caching + better DB)
- **At 100K users:** $300-500/month (full redesign needed)

### API Costs
- TwitterAPI.io: $150-300/month
- Mistral NLP: $50-100/month
- Privy auth: $0 (free up to 5K users)
- Cloudflare DDoS: $0 (free tier)
- **Total: $200-400/month**

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| X bans Foresight (API cut off) | HIGH | MEDIUM | Multi-source data (TwitterAPI.io + Nitter + local cache) |
| Prediction resolution wrong (oracle bug) | CRITICAL | LOW | Dispute window, manual review, testnet validation |
| Smart contract exploit (mainnet launch) | CRITICAL | MEDIUM | Internal audit + slither, multisig approval |
| Database goes down | HIGH | LOW | Railway auto-backups, weekly S3 exports |
| Unscalable at 10K users | MEDIUM | MEDIUM | Vertical scaling first ($150/month), plan horizontal later |
| User funds lost in settlement | CRITICAL | LOW | Off-chain settlement initially (no real risk), clear docs |
| Prediction markets unpopular | MEDIUM | MEDIUM | Add to existing game (don't replace), iterate based on usage |

---

## Next Steps (This Week)

1. **Review this memo** with technical team → Agree on approach or identify gaps
2. **Confirm pivot direction** → Is this what you want to build?
3. **Allocate engineer** → Lock them for 6 weeks, no interruptions
4. **Set up tooling** → Privy account, Mistral API key, TwitterAPI.io subscription
5. **Lock the plan** → This is your spec for 6 weeks, no scope creep

---

## Success Metrics (Week 6)

- [ ] 100 beta users signed up
- [ ] Credibility scores calculated for 30+ influencers
- [ ] 50+ prediction markets created
- [ ] 10% of users entered at least one market
- [ ] Average prediction market has 5 users staked
- [ ] Zero smart contract bugs on testnet
- [ ] Soft launch complete, ready for mainnet decision

---

## Post-MVP Roadmap (If Successful)

**Weeks 7-10:**
- Mainnet deployment (real ETH)
- Premium tier ($4.99/month gated features)
- Email notifications
- Leaderboard API for third-parties

**Weeks 11-16:**
- Mobile app (React Native)
- Farcaster integration (predictions from Farcaster feeds)
- Advanced analytics (accuracy charts, prediction history)
- Referral rewards for new markets

**Months 4+:**
- Institutional partnerships (exchanges using your credibility scores)
- B2B API licensing
- Premium market creation (contests with real prizes)

---

## Bottom Line

**You can ship this MVP in 6 weeks with 1 engineer. The tech stack is ready. The biggest challenge is execution discipline (no scope creep, no distractions).**

The pivot from fantasy league → CT intelligence is strategically smart because:
1. Same user base (CT fans)
2. Same data sources (Twitter metrics)
3. Same monetization (contests + premium)
4. Higher TAM (everyone interested in prediction markets, not just fantasy)

Go build it.

---

## Questions?

This memo is your technical playbook. If you have questions on any section:
- **Section 2 (Data Pipeline):** How do I extract predictions?
- **Section 3 (Markets):** Why off-chain instead of on-chain?
- **Section 4 (API Risk):** What if TwitterAPI.io goes down?
- **Section 6 (Mainnet):** What's the gas cost?
- **Section 10 (Sprint Plan):** What if we fall behind?

I'm available to deep-dive on any topic.

---

**Document:** `CTO_TECHNICAL_STRATEGY.md` (full 15,000-word version)
**Prepared by:** CTO
**Date:** February 9, 2026
**Revision:** 1.0
