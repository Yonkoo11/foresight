# CT league - Technical Documentation

> **The most revolutionary crypto product ever built**

A unified prediction and fantasy gaming ecosystem powered by Crypto Twitter data and Base blockchain.

---

## 🎯 What Is This?

**Three interconnected apps that create an unstoppable engagement flywheel:**

1. **CT Draft** - Fantasy league where you draft 5 CT influencers and compete based on their real performance
2. **CT Whisperer** - Tweet guessing game that trains you to understand CT patterns and personalities
3. **Timecaster** - Prediction betting platform where you put money on CT outcomes

**The Magic:** Each app makes the others more valuable. Draft teaches you who's hot. Whisperer teaches you their patterns. Timecaster lets you profit from that knowledge.

---

## 🔥 Why This Will Go Viral

### The Engagement System

**Daily Value Opportunities:**
- CT Draft: Check scores every 2 hours (track rank changes)
- Whisperer: New rounds every 8 hours (build streak momentum)
- Timecaster: Daily gauntlet at 00:00 UTC (daily opportunities)
- Duels: Ongoing countdowns (anticipation)

**Result:** Users return frequently throughout the day

### The Triple Value Proposition

1. **Fantasy League Excitement** - See FPL success (60M+ players)
2. **Financial Incentives** - Real money, variable rewards, instant feedback
3. **Social Validation** - Public leaderboards, influencer recognition, flex culture

**Combined = Exceptional engagement**

### Influencer Amplification

Every CT influencer becomes a walking billboard:
- Their performance is bettable
- Their reputation is scored onchain
- They'll share duels about themselves (ego)
- Their followers become users (network effects)

### Financial Incentive

- Good players make consistent profit
- Losers "just need one good day" (gambling psychology)
- Monthly champions get serious ETH
- Money keeps you grinding

---

## 📚 Documentation Structure

### Core Documents

| Document | Purpose | Read If... |
|----------|---------|-----------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System design overview | You want the big picture |
| **[SMART_CONTRACTS.md](./SMART_CONTRACTS.md)** | All 6 contracts specs | You're building contracts |
| **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** | All 18 tables | You're building backend |
| **[MVP_ROADMAP.md](./MVP_ROADMAP.md)** | 8-10 week build plan | You're managing the project |

### Quick Reference

**Start Here:**
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Get the overview (20 min)
2. Read [MVP_ROADMAP.md](./MVP_ROADMAP.md) - Understand the plan (15 min)
3. Dive into specific docs based on your role

---

## 🚀 Quick Start (For Developers)

### Prerequisites

```bash
# Install tools
node -v  # 20+
pnpm -v  # 8+
forge --version  # Foundry

# Databases
docker compose up postgres redis
```

### Setup (5 minutes)

```bash
# Clone repo
git clone <repo> && cd timecaster

# Install all dependencies
pnpm install

# Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp contracts/.env.example contracts/.env

# Edit .env files with your keys
nano frontend/.env  # Add Reown Project ID
nano backend/.env   # Add DB credentials, Twitter API
nano contracts/.env # Add private key

# Set up database
cd backend
pnpm db:migrate
pnpm db:seed

# Deploy contracts (testnet)
cd ../contracts
forge build
forge script script/Deploy.s.sol --rpc-url base-sepolia --broadcast

# Update frontend .env with deployed contract addresses

# Start everything
pnpm dev  # Runs all 3 services
```

**Open:** http://localhost:5173 🎉

---

## 🏗️ Architecture at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                      │
│  ┌──────────┐  ┌────────────┐  ┌──────────────┐       │
│  │ CT Draft │  │ Whisperer  │  │  Timecaster  │       │
│  └──────────┘  └────────────┘  └──────────────┘       │
│         One dashboard, shared reputation               │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌─────────┐  ┌─────────┐  ┌─────────┐
   │ Backend │  │ Contracts│  │Database │
   │ Node.js │  │ Solidity │  │Postgres │
   └─────────┘  └─────────┘  └─────────┘
        │            │            │
        └────────────┴────────────┘
                     │
            ┌────────┴────────┐
            ▼                 ▼
      ┌──────────┐      ┌─────────┐
      │ Twitter  │      │  Base   │
      │   API    │      │ Mainnet │
      └──────────┘      └─────────┘
```

---

## 💡 Key Technical Decisions

### Why These Technologies?

**Smart Contracts: Solidity + Foundry**
- Gas-efficient (users pay less)
- Battle-tested (OpenZeppelin)
- Fast testing (Foundry)
- Base-native (cheap transactions)

**Backend: Node.js + PostgreSQL**
- Fast to build (TypeScript)
- Handles real-time (WebSockets)
- Powerful queries (PostgreSQL)
- Easy to scale (horizontal)

**Frontend: React + wagmi**
- Modern UX (React 19)
- Best Web3 DX (wagmi v2)
- Beautiful wallets (RainbowKit)
- Fast builds (Vite)

### What Makes This Different?

**vs. Prediction Markets (Polymarket, etc):**
- ✅ More social (CT personalities, not events)
- ✅ More engaging (3 apps, not just betting)
- ✅ Easier to understand (influencer performance vs complex politics)

**vs. Fantasy Sports (FPL, DraftKings):**
- ✅ Real money (crypto)
- ✅ 24/7 (CT never sleeps)
- ✅ Faster feedback (scores update every 15min)
- ✅ Onchain reputation (verifiable skill)

**vs. Social Betting (FriendTech, etc):**
- ✅ Skill-based (not just speculation)
- ✅ Multi-dimensional (3 game modes)
- ✅ Data-driven (real CT metrics)
- ✅ Community-owned (treasury redistributes)

---

## 🎮 Product Features

### CT Draft

**Core Loop:**
1. Draft 5 influencers from top 100 CT accounts
2. Their real performance scores your team (every 15 min)
3. Climb leaderboard, compete with friends
4. Top 10 monthly = Share 40% of treasury

**Scoring Formula:**
```
draft_score =
  engagement_velocity × 40 +
  follower_growth × 10 +
  meme_virality × 30 +
  base_mentions × 20
```

**Key engagement features:**
- Every tweet matters (real-time scores)
- Public rankings (flex culture)
- Friend leagues (rivalry)
- Monthly rewards (financial incentive)

### CT Whisperer

**Core Loop:**
1. See a tweet, guess which CT account posted it
2. Build CT IQ score (0-100)
3. Maintain daily streak
4. Master 4 categories (serious, degen, unhinged, alpha)

**Key engagement features:**
- Pattern recognition (brain loves it)
- Streak rewards (build consistency)
- Social proof (flex CT knowledge)
- Trains you for Timecaster bets

### Timecaster

**Two Modes:**

**Arena (1v1 Duels):**
- Challenge anyone to a prediction bet
- Stakes: 0.01-10 ETH
- Types: Price (auto-resolve), Narrative (community vote)
- Winner takes 95%, protocol keeps 5%

**Gauntlet (Daily Tournament):**
- 5 daily predictions (00:00 UTC)
- Stake on YES/NO per prediction
- Auto-resolve at 23:59 UTC
- Winners split losers' stakes

**Key engagement features:**
- Real money (variable rewards)
- Skill-based (CT knowledge helps)
- Social (duels go viral)
- Daily reset (fresh start)

### Unified Reputation

**CT Mastery Score (0-100):**
```
= 30% Draft Performance
+ 30% Whisperer Accuracy
+ 40% Timecaster Win Rate
```

**Dynamic NFT:**
- Soulbound (can't transfer)
- Updates in real-time
- Shows all 3 app stats
- Level badges (NOVICE → ORACLE)
- Flexed on Twitter/Farcaster

---

## 📊 Business Model

### Revenue Streams

1. **Timecaster Duels:** 5% of every pot
2. **Timecaster Gauntlet:** 2% of stakes
3. **Duel Creation Fee:** 0.005 ETH
4. **Premium Features** (V2): $5-10/month

### Treasury Distribution

```
100% of Protocol Revenue:
├─ 40% → Gauntlet Top 10 (monthly)
├─ 30% → Arena Champion (monthly)
├─ 20% → Special Events
└─ 10% → Protocol Operations
```

**Key Insight:** Most revenue returns to users as rewards. This creates:
- Proof the system works (winners flex earnings)
- Incentive to play (you can win too)
- Community ownership (not extractive)

### Unit Economics Example

**Month 1 Projections:**
- 1,000 users
- 50 duels/day @ avg 0.1 ETH
- 500 gauntlet entries/day @ avg 0.01 ETH
- Total volume: ~8 ETH/month
- Protocol revenue: ~0.3 ETH/month
- Distributed as rewards: ~0.27 ETH
- Operations: ~0.03 ETH

**Month 3 Projections:**
- 10,000 users
- 500 duels/day
- 3,000 gauntlet entries/day
- Total volume: ~80 ETH/month
- Protocol revenue: ~3 ETH/month
- Distributed as rewards: ~2.7 ETH
- Operations: ~0.3 ETH

---

## 🎯 Success Metrics

### North Star Metric
**Daily Active Users (DAU)** - Measures true engagement across all 3 apps

### Key Metrics (Month 1)

| Metric | Target | Stretch |
|--------|--------|---------|
| Registered Users | 1,000 | 5,000 |
| WAU | 500 | 2,000 |
| Draft Teams | 200 | 1,000 |
| Whisperer Answers | 5,000 | 20,000 |
| Duels Created | 50 | 200 |
| Total Volume | 5 ETH | 20 ETH |
| Protocol Revenue | 0.2 ETH | 1 ETH |

### Engagement Metrics

- **DAU/MAU Ratio:** Target >40% (very sticky)
- **Session Length:** Target >10 min/session
- **Sessions/Day:** Target >3 (checking scores, placing bets)
- **7-Day Retention:** Target >60%
- **30-Day Retention:** Target >40%

---

## 🚧 Development Timeline

**MVP: 8-10 weeks**

```
Week 1-2:  Infrastructure setup, database, contracts skeleton
Week 3-4:  Smart contracts complete, backend services
Week 5-6:  Frontend development, integration
Week 7:    Testing, bug fixes, polish
Week 8:    Beta launch (20-30 users)
Week 9-10: Public launch, iterate, first monthly championship
```

See [MVP_ROADMAP.md](./MVP_ROADMAP.md) for detailed breakdown.

---

## 🔒 Security Considerations

### Smart Contract Security
- [ ] Comprehensive test coverage (>90%)
- [ ] Slither static analysis
- [ ] Manual review
- [ ] Testnet battle-testing
- [ ] Multi-sig for treasury
- [ ] Timelock for upgrades (V2)
- [ ] Emergency pause mechanism

### Backend Security
- [ ] Rate limiting (prevent spam)
- [ ] Input validation (prevent injection)
- [ ] Authentication (SIWE + JWT)
- [ ] DDoS protection (Cloudflare)
- [ ] SQL injection prevention
- [ ] API key rotation

### User Security
- [ ] Wallet-only auth (no passwords)
- [ ] Withdraw limits (prevent exploits)
- [ ] Suspicious activity monitoring
- [ ] Clear warnings (risk disclosure)

---

## 🌍 Deployment Strategy

### Testnet (Week 8)
- Base Sepolia
- 20-30 alpha testers
- Provide test ETH
- Collect feedback
- Iterate quickly

### Mainnet (Week 9)
- Base Mainnet
- Public launch
- Start with low limits (0.01 ETH min stakes)
- Monitor closely
- Scale as confidence grows

### Infrastructure

```
Frontend:  Vercel (edge deployment)
Backend:   Railway/Render (auto-scaling)
Database:  Neon (managed PostgreSQL)
Cache:     Upstash (managed Redis)
Storage:   Cloudflare R2
Monitoring: Sentry + PostHog
```

---

## 🤝 Contributing

### For Developers

1. **Pick a task** from [MVP_ROADMAP.md](./MVP_ROADMAP.md)
2. **Read relevant docs** ([SMART_CONTRACTS.md](./SMART_CONTRACTS.md), [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md))
3. **Build your feature**
4. **Write tests**
5. **Submit PR**

### Code Standards

- TypeScript everywhere (strict mode)
- ESLint + Prettier (auto-format)
- Test coverage >80%
- Meaningful commit messages
- Document complex logic

---

## 📞 Support & Questions

**Technical Questions:**
- Read the docs first
- Check existing issues
- Ask in Discord (link TBD)

**Bug Reports:**
- Include reproduction steps
- Share error logs
- Describe expected vs actual behavior

---

## 🎉 Let's Build

**This is not just another crypto app.**

This is:
- ✅ Genuinely engaging (multi-layer experience)
- ✅ Skill-based (knowledge = profit)
- ✅ Community-friendly (treasury redistributes)
- ✅ Influencer-amplified (they become salespeople)
- ✅ Financially sustainable (real revenue)
- ✅ Crypto-native (onchain reputation)

**If you're reading this, you're early.**

Let's build the most revolutionary crypto product ever made.

**LFG. 🚀**

---

## License

MIT License - See LICENSE file for details

---

## Appendix: File Structure

```
timecaster/
├── contracts/              # Solidity smart contracts
│   ├── src/
│   │   ├── TimecasterArena.sol
│   │   ├── DailyGauntlet.sol
│   │   ├── CTDraft.sol
│   │   ├── ReputationEngine.sol
│   │   ├── ForesightNFT.sol
│   │   └── Treasury.sol
│   ├── test/              # Foundry tests
│   └── script/            # Deployment scripts
│
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── api/          # REST endpoints
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   ├── utils/        # Helpers
│   │   └── jobs/         # Cron jobs
│   └── migrations/       # Database migrations
│
├── frontend/             # React frontend
│   ├── src/
│   │   ├── pages/        # Routes
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── config/       # wagmi config
│   │   └── utils/        # Helpers
│   └── public/           # Static assets
│
└── docs/                 # 👈 YOU ARE HERE
    ├── README.md
    ├── ARCHITECTURE.md
    ├── SMART_CONTRACTS.md
    ├── DATABASE_SCHEMA.md
    └── MVP_ROADMAP.md
```
