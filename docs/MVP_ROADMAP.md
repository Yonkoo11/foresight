# MVP Development Roadmap

## Overview

Complete development plan from concept to launch for CT league.

**Target:** 8-10 weeks to MVP launch
**Team Size:** 2-3 developers
**Budget:** $10-15k (excluding audits)

---

## Phase Breakdown

```
Week 1-2:  Foundation & Infrastructure
Week 3-4:  Smart Contracts + Backend Core
Week 5-6:  Frontend + Integration
Week 7:    Testing + Refinement
Week 8:    Beta Launch + Iteration
Week 9-10: Public Launch + Growth
```

---

## WEEK 1-2: Foundation & Infrastructure

###  Week 1: Setup & Design Finalization

**Smart Contracts (Days 1-3)**
- [ ] Set up Foundry project structure
- [ ] Install dependencies (OpenZeppelin, Chainlink)
- [ ] Create contract skeletons (6 contracts)
- [ ] Write basic struct definitions
- [ ] Set up test framework

**Backend (Days 1-3)**
- [ ] Initialize Node.js + TypeScript project
- [ ] Set up Express.js server
- [ ] Configure PostgreSQL connection
- [ ] Configure Redis connection
- [ ] Set up database migrations (Knex.js)
- [ ] Create initial migration files

**Frontend (Days 1-3)**
- [ ] Create Vite + React + TypeScript project
- [ ] Install dependencies (wagmi, RainbowKit, TailwindCSS)
- [ ] Set up React Router
- [ ] Create basic layout structure
- [ ] Configure Tailwind + design tokens

**Infrastructure (Days 4-7)**
- [ ] Set up PostgreSQL database (Neon/Supabase)
- [ ] Set up Redis instance (Upstash)
- [ ] Configure development environment
- [ ] Set up Git repository
- [ ] Create .env.example files
- [ ] Set up ESLint + Prettier
- [ ] Create Docker Compose for local dev
- [ ] Document setup instructions

### Week 2: Database & Core Backend

**Database (Days 1-3)**
- [ ] Run initial migrations (18 tables)
- [ ] Create database functions & triggers
- [ ] Set up indexes
- [ ] Create materialized views
- [ ] Seed influencers table (100 accounts)
- [ ] Seed Whisperer questions (100+ tweets)
- [ ] Test all queries for performance

**Backend Core (Days 4-7)**
- [ ] Implement authentication (SIWE + JWT)
- [ ] Create API route structure
- [ ] Implement rate limiting middleware
- [ ] Set up error handling
- [ ] Create database models/repositories
- [ ] Implement user CRUD operations
- [ ] Set up logging (Winston/Pino)
- [ ] Write API documentation (OpenAPI/Swagger)

---

## WEEK 3-4: Smart Contracts + Backend Services

### Week 3: Smart Contracts Development

**TimecasterArena.sol (Days 1-2)**
- [ ] Implement createDuel()
- [ ] Implement acceptDuel()
- [ ] Implement resolveDuel()
- [ ] Implement voting functions
- [ ] Write unit tests (20+ tests)
- [ ] Gas optimization

**DailyGauntlet.sol (Days 3-4)**
- [ ] Implement generateDaily()
- [ ] Implement enterPrediction()
- [ ] Implement resolveGauntlet()
- [ ] Implement claimWinnings()
- [ ] Write unit tests (15+ tests)
- [ ] Gas optimization

**Supporting Contracts (Days 5-7)**
- [ ] Implement CTDraft.sol
- [ ] Implement ReputationEngine.sol
- [ ] Update ForesightNFT.sol with CT Mastery
- [ ] Implement Treasury.sol
- [ ] Write integration tests
- [ ] Test full contract interactions
- [ ] Deploy to Base Sepolia testnet
- [ ] Verify contracts on Basescan

### Week 4: Backend Services

**Twitter Scraper Service (Days 1-2)**
- [ ] Set up Twitter API v2 client
- [ ] Implement influencer tweet fetching
- [ ] Implement engagement metrics collection
- [ ] Store tweets in database
- [ ] Calculate engagement velocity
- [ ] Detect meme keywords
- [ ] Schedule cron job (every 15 min)

**Scoring Engine Service (Days 3-4)**
- [ ] Implement Draft score calculation
- [ ] Update influencer_scores table
- [ ] Calculate team scores
- [ ] Update leaderboards
- [ ] Optimize for performance (batch updates)
- [ ] Test with real Twitter data

**Oracle Keeper Service (Days 5-6)**
- [ ] Integrate Chainlink price feeds
- [ ] Implement gauntlet generation logic
- [ ] Implement gauntlet resolution logic
- [ ] Implement duel resolution (PRICE/PROTOCOL types)
- [ ] Schedule cron jobs (00:00 UTC daily)
- [ ] Test end-to-end resolution flow

**API Endpoints (Day 7)**
- [ ] Implement all REST endpoints (see spec)
- [ ] Add request validation
- [ ] Add response caching (Redis)
- [ ] Test all endpoints with Postman/Insomnia
- [ ] Document API responses

---

## WEEK 5-6: Frontend Development + Integration

### Week 5: Frontend Core

**Shared Components (Days 1-2)**
- [ ] Create Layout component
- [ ] Create Header/Footer components
- [ ] Create WalletConnect button (RainbowKit)
- [ ] Create Leaderboard component
- [ ] Create Loading states
- [ ] Create Error boundaries
- [ ] Create Toast notifications
- [ ] Set up theme/design system

**CT Draft App (Days 3-4)**
- [ ] Create Draft homepage
- [ ] Influencer selection UI
- [ ] Team builder interface
- [ ] Team score display
- [ ] Leaderboard page
- [ ] Connect to backend API
- [ ] Real-time score updates (WebSocket)
- [ ] Mobile responsive

**CT Whisperer App (Days 5-7)**
- [ ] Create Whisperer homepage
- [ ] Question display UI
- [ ] Answer selection interface
- [ ] Stats display
- [ ] Streak tracking
- [ ] Category filtering
- [ ] Connect to backend API
- [ ] Timer functionality

### Week 6: Timecaster App + Integration

**Timecaster UI (Days 1-3)**
- [ ] Create Arena page
- [ ] Duel creation form
- [ ] Open challenges list
- [ ] Active duels display
- [ ] Voting interface (narrative duels)
- [ ] Gauntlet page
- [ ] Daily predictions UI
- [ ] Results display
- [ ] Connect to smart contracts (wagmi)

**Smart Contract Integration (Days 4-5)**
- [ ] Set up wagmi config with Base Sepolia
- [ ] Create contract hooks (useCreateDuel, useAcceptDuel, etc.)
- [ ] Implement transaction handling
- [ ] Add transaction notifications
- [ ] Handle errors gracefully
- [ ] Test all contract interactions
- [ ] Add gas estimation

**Unified Dashboard (Days 6-7)**
- [ ] Create main dashboard page
- [ ] Display CT Mastery Score
- [ ] Show stats from all 3 apps
- [ ] Profile page
- [ ] NFT display
- [ ] Connect all data sources
- [ ] Polish UI/UX
- [ ] Mobile optimization

---

## WEEK 7: Testing + Refinement

### Testing (Days 1-4)**

**Smart Contract Testing**
- [ ] Full test coverage (>90%)
- [ ] Integration tests
- [ ] Gas optimization tests
- [ ] Security audit (self-audit with Slither)
- [ ] Test on Base Sepolia with real users

**Backend Testing**
- [ ] Unit tests for all services
- [ ] Integration tests for API
- [ ] Load testing (Artillery/k6)
- [ ] Test cron jobs
- [ ] Test WebSocket connections
- [ ] Test database performance

**Frontend Testing**
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Accessibility testing
- [ ] Performance testing (Lighthouse)

### Bug Fixes + Polish (Days 5-7)**
- [ ] Fix all critical bugs
- [ ] Fix all high-priority bugs
- [ ] UI polish pass
- [ ] Copy/messaging review
- [ ] Add loading states everywhere
- [ ] Add empty states
- [ ] Add error states
- [ ] Performance optimization
- [ ] Security review

---

## WEEK 8: Beta Launch

### Pre-Launch (Days 1-2)**
- [ ] Deploy contracts to Base Sepolia (final)
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Set up monitoring (Sentry, PostHog)
- [ ] Set up analytics
- [ ] Create launch checklist
- [ ] Prepare social media accounts
- [ ] Create announcement tweets
- [ ] Create explainer graphics

### Private Beta (Days 3-5)**
- [ ] Invite 20-30 alpha testers
- [ ] Provide testnet ETH
- [ ] Monitor usage closely
- [ ] Collect feedback
- [ ] Fix bugs immediately
- [ ] Iterate on UX issues
- [ ] Test viral mechanics (sharing)

### Beta Refinement (Days 6-7)**
- [ ] Implement beta feedback
- [ ] Final bug fixes
- [ ] Performance tuning
- [ ] Prepare for public launch
- [ ] Create launch content
- [ ] Coordinate with influencers

---

## WEEK 9-10: Public Launch + Growth

### Public Launch (Week 9)**

**Day 1: Soft Launch**
- [ ] Open to public
- [ ] Post announcement on Twitter/Farcaster
- [ ] Share in crypto Discord servers
- [ ] Monitor for issues
- [ ] Respond to feedback quickly

**Day 2-3: Influencer Seeding**
- [ ] Pay 5-10 CT influencers to create duels
- [ ] Encourage influencer vs influencer battles
- [ ] Share duel links on their accounts
- [ ] Community watches and votes

**Day 4-7: Viral Push**
- [ ] Share user-generated content
- [ ] Highlight big wins
- [ ] Feature top leaderboard players
- [ ] Create daily recap threads
- [ ] Engage with community
- [ ] Fix any issues immediately
- [ ] Scale infrastructure if needed

### Week 10: Optimization + Iteration**

**Product Iteration**
- [ ] Analyze user behavior data
- [ ] Identify drop-off points
- [ ] A/B test improvements
- [ ] Add requested features
- [ ] Improve onboarding flow
- [ ] Optimize for retention

**Growth Tactics**
- [ ] Referral program
- [ ] Weekly tournaments
- [ ] Special events
- [ ] Partnerships with other protocols
- [ ] Farcaster Frame integration
- [ ] Content marketing
- [ ] Community building

**First Monthly Championship**
- [ ] Calculate final rankings
- [ ] Distribute treasury rewards (5-10 ETH)
- [ ] Crown champions
- [ ] Major announcement
- [ ] Start Season 2

---

## MVP Scope Definition

### ✅ INCLUDED in MVP

**CT Draft:**
- Team creation (5 influencers)
- Real-time scoring (15min updates)
- Leaderboard
- Basic stats

**CT Whisperer:**
- Daily questions (10 new per day)
- 4 categories
- Streak tracking
- CT IQ score

**Timecaster:**
- Arena duels (PRICE + NARRATIVE types)
- Daily Gauntlet (3 predictions, not 5)
- Basic voting
- Reputation NFT

**Shared:**
- Wallet auth
- Basic profile
- Leaderboards
- Mobile responsive

### ❌ NOT in MVP (V2 Features)

- Email auth
- Advanced analytics
- Team battles (3v3)
- Tournament brackets
- Social graphs (friends system)
- In-app chat
- Advanced filtering
- Historical charts
- Multi-chain support
- Token launch
- DAO governance
- Mobile app (native)

---

## Resource Requirements

### Team Composition

**Option A: 3-Person Team (Recommended)**
- 1 Full-Stack Smart Contract Dev (Lead)
- 1 Full-Stack Web Dev (Frontend focus)
- 1 Backend/DevOps Engineer

**Option B: 2-Person Team (Lean)**
- 1 Full-Stack Smart Contract Dev
- 1 Full-Stack Web Dev (does both FE/BE)

### Time Commitment

- **Full-time (40h/week):** 8 weeks to MVP
- **Part-time (20h/week):** 16 weeks to MVP

### Technology Costs

| Service | Cost/Month | Purpose |
|---------|------------|---------|
| Neon PostgreSQL | $20 | Database |
| Upstash Redis | $10 | Caching |
| Railway/Render | $20 | Backend hosting |
| Vercel Pro | $20 | Frontend hosting |
| Twitter API | $100 | Data scraping |
| Sentry | $26 | Error tracking |
| PostHog | $0 | Analytics (free tier) |
| **Total** | **~$200/mo** | |

### One-Time Costs

| Item | Cost | Purpose |
|------|------|---------|
| Base Sepolia ETH | $50 | Testing/deployment |
| Base Mainnet ETH | $200 | Final deployment |
| Domain name | $15/yr | URL |
| OG images/design | $500 | Branding |
| Influencer seeding | $2,000 | Launch marketing |
| **Total** | **~$2,765** | |

---

## Risk Mitigation

### Technical Risks

**Risk:** Smart contract bugs
**Mitigation:** Extensive testing, self-audit with Slither, consider audit for V2

**Risk:** Twitter API rate limits
**Mitigation:** Implement caching, batch requests, upgrade to higher tier if needed

**Risk:** Database performance at scale
**Mitigation:** Proper indexing, read replicas, caching layer

**Risk:** Frontend bugs on mobile
**Mitigation:** Test on real devices, use responsive design best practices

### Product Risks

**Risk:** Low user adoption
**Mitigation:** Influencer seeding, viral mechanics, referral program

**Risk:** Users don't understand the product
**Mitigation:** Clear onboarding, tutorial mode, explainer videos

**Risk:** Users cheat the system
**Mitigation:** On-chain verification, community voting, reputation systems

### Market Risks

**Risk:** Competitor launches similar product
**Mitigation:** Move fast, build moat with data and community

**Risk:** CT influencers don't engage
**Mitigation:** Pay for initial engagement, show value proposition clearly

**Risk:** Low betting volume
**Mitigation:** Start with low minimums, gamify with leaderboards, weekly prizes

---

## Success Metrics

### Week 1 Targets
- 100 registered users
- 50 Draft teams created
- 200 Whisperer questions answered
- 10 duels created

### Month 1 Targets
- 1,000 registered users
- 500 active weekly users (WAU)
- 200 Draft teams
- 5,000 Whisperer answers
- 50 duels completed
- 1 ETH in total volume

### Month 3 Targets
- 10,000 registered users
- 3,000 WAU
- 2,000 Draft teams
- 50,000 Whisperer answers
- 500 duels completed
- 50 ETH in total volume
- 5 ETH protocol revenue

---

## Launch Checklist

### Pre-Launch
- [ ] All smart contracts deployed & verified
- [ ] Backend deployed & stable
- [ ] Frontend deployed & fast
- [ ] Monitoring set up
- [ ] Analytics tracking
- [ ] Legal disclaimer added
- [ ] Terms of Service posted
- [ ] Privacy Policy posted
- [ ] Social media accounts ready
- [ ] Launch content prepared
- [ ] Influencer partnerships lined up
- [ ] Testnet ETH faucet ready for users

### Launch Day
- [ ] Announce on Twitter
- [ ] Announce on Farcaster
- [ ] Post in Base Discord
- [ ] Post in crypto subreddits
- [ ] Share in group chats
- [ ] Monitor for errors
- [ ] Respond to questions
- [ ] Fix critical bugs immediately
- [ ] Celebrate first users! 🎉

### Post-Launch (Week 1)
- [ ] Daily recap threads
- [ ] Highlight top players
- [ ] Share user wins
- [ ] Collect feedback
- [ ] Ship quick improvements
- [ ] Plan first championship
- [ ] Build community
- [ ] Keep momentum going

---

## Next Iteration (V2 Planning)

After MVP proves product-market fit:

**Product Enhancements:**
- More prediction types
- Team battles (3v3)
- Advanced analytics dashboard
- Historical data visualization
- Social features (follow users)
- In-app notifications

**Technical Improvements:**
- Smart contract upgrades (proxy pattern)
- Multi-chain expansion
- Mobile app (React Native)
- Advanced caching
- Real-time everything (more WebSockets)

**Monetization:**
- Premium analytics ($5/mo)
- Advanced features ($10/mo)
- White-label for other communities
- API access for developers

**Growth:**
- Referral rewards
- Affiliate program
- Creator rewards
- Protocol token (maybe)
- DAO governance (maybe)

---

## Conclusion

**This roadmap is aggressive but achievable.**

Key success factors:
1. **Ship fast** - MVP in 8-10 weeks
2. **Test constantly** - Catch bugs early
3. **Engage community** - Build with users
4. **Iterate quickly** - Respond to feedback
5. **Have fun** - Build something people love

**Let's build the most revolutionary crypto product ever made. 🚀**

Next: See `docs/DEPLOYMENT.md` for infrastructure setup.
