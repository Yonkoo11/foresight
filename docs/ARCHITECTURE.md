# CT league - System Architecture

## Executive Summary

A unified prediction and fantasy gaming ecosystem consisting of three interconnected applications powered by Crypto Twitter data and Base blockchain.

**Apps:**
1. **CT Draft** - Fantasy Crypto Twitter league
2. **CT Whisperer** - Tweet guessing game
3. **Timecaster** - Prediction betting platform

**Core Innovation:** Apps share data and reputation, creating compound engagement loops where each app makes the others more valuable.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  CT Draft    │  │ CT Whisperer │  │  Timecaster  │         │
│  │  (React)     │  │   (React)    │  │   (React)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                   │               │
│         └──────────────────┴───────────────────┘               │
│                            │                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   React Router  │
                    │   wagmi + viem  │
                    │   RainbowKit    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  BACKEND API   │  │  SMART CONTRACTS │  │   DATA LAYER   │
│                │  │                  │  │                │
│  - Express.js  │  │  - Timecaster    │  │  - PostgreSQL  │
│  - REST API    │  │  - CT Draft      │  │  - Redis Cache │
│  - WebSockets  │  │  - Reputation    │  │  - S3 Storage  │
│  - Cron Jobs   │  │  - Treasury      │  │                │
└───────┬────────┘  └────────┬─────────┘  └───────┬────────┘
        │                    │                    │
        │           ┌────────▼─────────┐          │
        │           │   Base Sepolia   │          │
        │           │   (Testnet)      │          │
        │           │   Base Mainnet   │          │
        │           └──────────────────┘          │
        │                                         │
        └─────────────────┬───────────────────────┘
                          │
                 ┌────────▼────────┐
                 │  EXTERNAL APIS  │
                 │                 │
                 │  - Twitter/X    │
                 │  - Farcaster    │
                 │  - Chainlink    │
                 └─────────────────┘
```

---

## Component Overview

### 1. Frontend Layer

**Technology Stack:**
- React 19 + TypeScript
- Vite (build tool)
- React Router v6 (navigation)
- wagmi v2 + viem (Web3)
- RainbowKit (wallet connection)
- TanStack Query (data fetching)
- Tailwind CSS (styling)

**Architecture Pattern:**
- Single-page application (SPA)
- Three main route modules (Draft, Whisperer, Timecaster)
- Shared component library
- Unified state management
- WebSocket real-time updates

**Key Features:**
- Unified authentication (wallet + optional email)
- Real-time score updates
- Optimistic UI updates
- Mobile-responsive (640px Farcaster frames)

---

### 2. Smart Contracts Layer

**Blockchain:** Base (Sepolia testnet → Mainnet)

**Contracts:**

| Contract | Purpose | Complexity |
|----------|---------|------------|
| `TimecasterArena.sol` | 1v1 prediction duels | High |
| `DailyGauntlet.sol` | Daily prediction tournaments | High |
| `CTDraft.sol` | Fantasy league state | Medium |
| `ReputationEngine.sol` | Unified scoring system | Medium |
| `ForesightNFT.sol` | Dynamic soulbound NFT | Medium |
| `Treasury.sol` | Fee collection & distribution | Low |

**Design Principles:**
- Gas optimization (batch operations where possible)
- Upgrade path (transparent proxy pattern)
- Emergency pause functionality
- Role-based access control
- Event-driven architecture (for indexing)

---

### 3. Backend API Layer

**Technology Stack:**
- Node.js 20+
- Express.js (REST API)
- Socket.io (WebSockets)
- PostgreSQL (primary database)
- Redis (caching + pub/sub)
- Bull (job queue)
- TypeScript

**Services:**

| Service | Responsibility |
|---------|----------------|
| `api-server` | REST API endpoints |
| `websocket-server` | Real-time updates |
| `twitter-scraper` | Twitter/X data collection |
| `scoring-engine` | CT Draft score calculation |
| `oracle-keeper` | Resolve predictions via oracles |
| `daily-generator` | Generate daily gauntlets |
| `leaderboard-service` | Aggregate and rank users |

**Architecture Pattern:**
- Microservices (containerized with Docker)
- Event-driven communication
- Horizontal scaling capability
- Rate limiting & caching

---

### 4. Data Layer

**Primary Database:** PostgreSQL 15+

**Schema Categories:**
- User accounts & authentication
- CT Draft teams & scores
- CT Whisperer questions & answers
- Timecaster predictions & bets
- Influencer data & metrics
- Leaderboards & rankings

**Caching:** Redis

**Use Cases:**
- API response caching (TTL: 30s-5min)
- Real-time leaderboards (sorted sets)
- Session storage
- Rate limiting counters
- Pub/sub for WebSocket events

**File Storage:** AWS S3 or Cloudflare R2
- User avatars
- NFT metadata/images
- Tweet screenshots (proof)
- Share card graphics

---

### 5. External Integrations

**Twitter/X API:**
- Scrape tweets from tracked accounts
- Collect engagement metrics (likes, RTs, replies)
- Track follower counts
- Sentiment analysis

**Farcaster:**
- Frame integration for all apps
- Cross-post updates
- Farcaster-native user accounts

**Chainlink Oracles:**
- Price feeds (ETH, BTC, SOL, etc.)
- VRF for randomness (Whisperer question selection)
- Automation (daily gauntlet generation)

**On-Chain Data:**
- Base chain metrics (transaction count, TVL)
- Protocol-specific data (Uniswap, Aave, etc.)

---

## Data Flow Examples

### Example 1: User Creates Arena Duel

```
1. USER (Frontend)
   ↓
   Clicks "Create Duel"
   Fills form: "SOL will outperform ETH this week"
   Stakes: 0.5 ETH

2. FRONTEND
   ↓
   Validates inputs
   Calls smart contract via wagmi

3. SMART CONTRACT (TimecasterArena.sol)
   ↓
   Creates Duel struct
   Locks 0.5 ETH in escrow
   Emits DuelCreated event

4. BACKEND (Event Listener)
   ↓
   Indexes DuelCreated event
   Stores duel in PostgreSQL
   Publishes to Redis pub/sub

5. WEBSOCKET SERVER
   ↓
   Broadcasts duel to all connected clients

6. FRONTEND (All Users)
   ↓
   Displays new open challenge in UI
```

---

### Example 2: Daily Gauntlet Resolution

```
1. CRON JOB (00:00 UTC)
   ↓
   Triggers daily-generator service

2. DAILY-GENERATOR SERVICE
   ↓
   Fetches CT Draft data from database
   Queries Twitter API for trending data
   Generates 5 predictions with oracle IDs

3. SMART CONTRACT (DailyGauntlet.sol)
   ↓
   Creates new gauntlet via keeper transaction
   Stores oracle references
   Emits GauntletCreated event

4. FRONTEND
   ↓
   Users stake on YES/NO throughout the day
   Transactions recorded on-chain

5. CRON JOB (23:59 UTC)
   ↓
   Triggers oracle-keeper service

6. ORACLE-KEEPER SERVICE
   ↓
   Fetches Chainlink price feeds
   Queries CT Draft database for influencer scores
   Checks Twitter API for sentiment data

7. SMART CONTRACT (DailyGauntlet.sol)
   ↓
   Keeper calls resolve() with oracle data
   Calculates winners/losers per prediction
   Distributes payouts automatically
   Emits GauntletResolved event

8. BACKEND
   ↓
   Updates leaderboards
   Calculates user reputation changes

9. FRONTEND
   ↓
   Users see results
   Winnings auto-deposited
   NFTs update dynamically
```

---

### Example 3: CT Draft Score Update

```
1. CRON JOB (Every 15 minutes)
   ↓
   Triggers twitter-scraper service

2. TWITTER-SCRAPER SERVICE
   ↓
   Fetches tweets from tracked influencers (last 15min)
   Collects engagement metrics (likes, RTs, impressions)
   Stores in PostgreSQL (tweets table)

3. SCORING-ENGINE SERVICE
   ↓
   Triggered by new tweet data
   Calculates incremental score for each influencer:
     - Engagement velocity
     - Follower growth
     - Meme virality (keyword matching)
     - On-chain impact (Base mentions, etc.)

4. DATABASE
   ↓
   Updates influencer_scores table
   Recalculates team scores for all users

5. LEADERBOARD-SERVICE
   ↓
   Rebuilds leaderboard in Redis

6. WEBSOCKET SERVER
   ↓
   Broadcasts score updates to connected clients

7. FRONTEND
   ↓
   UI updates in real-time
   Users see their rank change
```

---

## Technology Stack Summary

### Frontend
```yaml
Framework: React 19 + TypeScript
Build: Vite 5
Routing: React Router v6
State: TanStack Query + Zustand
Web3: wagmi v2 + viem + RainbowKit
Styling: Tailwind CSS
Charts: Recharts
Real-time: Socket.io-client
```

### Backend
```yaml
Runtime: Node.js 20 LTS
Framework: Express.js
Language: TypeScript
Database: PostgreSQL 15
Cache: Redis 7
Queue: Bull (Redis-based)
WebSockets: Socket.io
Testing: Jest + Supertest
```

### Smart Contracts
```yaml
Language: Solidity 0.8.24
Framework: Foundry
Libraries: OpenZeppelin Contracts v5
Network: Base Sepolia → Mainnet
Oracles: Chainlink
Testing: Forge + Foundry
```

### Infrastructure
```yaml
Hosting: Vercel (Frontend) + Railway/Render (Backend)
Database: Neon/Supabase (Managed PostgreSQL)
Cache: Upstash (Managed Redis)
Storage: Cloudflare R2
CDN: Cloudflare
Monitoring: Sentry + PostHog
```

---

## Security Considerations

### Smart Contract Security
- [ ] Full test coverage (>90%)
- [ ] External audit (post-MVP)
- [ ] Multi-sig for treasury
- [ ] Timelock for upgrades
- [ ] Emergency pause mechanism
- [ ] Rate limiting on-chain (prevent spam)

### API Security
- [ ] Rate limiting (by IP + user)
- [ ] Input validation & sanitization
- [ ] CORS configuration
- [ ] API key rotation
- [ ] DDoS protection (Cloudflare)
- [ ] SQL injection prevention (parameterized queries)

### User Security
- [ ] Wallet-based auth (Sign-In with Ethereum)
- [ ] Optional 2FA for high-value accounts
- [ ] Withdraw limits & cooldowns
- [ ] Suspicious activity detection
- [ ] IP-based fraud detection

---

## Scalability Plan

### Phase 1: MVP (0-1k users)
- Single backend server
- Single PostgreSQL instance
- Redis on same server
- Manual deployments

### Phase 2: Growth (1k-10k users)
- Horizontal backend scaling (3+ instances)
- Load balancer (Cloudflare/Nginx)
- Managed PostgreSQL with read replicas
- Separate Redis cluster
- CI/CD pipeline

### Phase 3: Scale (10k-100k users)
- Microservices architecture (separate containers)
- Database sharding by user cohorts
- Redis cluster with sentinel
- CDN for static assets
- Auto-scaling based on load
- Multi-region deployment

---

## Monitoring & Observability

### Metrics to Track
- Active users (DAU/MAU)
- Transaction volume & value
- API latency (p50, p95, p99)
- Error rates
- Contract gas usage
- Database query performance
- WebSocket connection count

### Tools
- **Application Monitoring:** Sentry
- **Analytics:** PostHog
- **Blockchain:** Dune Analytics + Tenderly
- **Uptime:** UptimeRobot
- **Logs:** Papertrail or Datadog

---

## Development Environment Setup

### Prerequisites
```bash
Node.js 20+
pnpm 8+
Foundry (latest)
PostgreSQL 15+
Redis 7+
Docker (optional but recommended)
```

### Local Development Stack
```bash
# Frontend
cd frontend && pnpm install && pnpm dev
# Runs on localhost:5173

# Backend API
cd backend && pnpm install && pnpm dev
# Runs on localhost:3000

# Smart contracts
cd contracts && forge build && forge test
# Anvil local chain: anvil

# Database
docker compose up postgres redis
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

---

## Deployment Architecture

### Frontend (Vercel)
```
GitHub → Vercel
- Auto-deploy on push to main
- Preview deployments for PRs
- Edge caching
- Custom domain
```

### Backend (Railway/Render)
```
GitHub → Railway
- Dockerfile deployment
- Auto-scaling
- PostgreSQL addon
- Redis addon
- Environment variables
```

### Smart Contracts (Base)
```
Local → Foundry Script → Base Sepolia
- Deploy via forge script
- Verify on Basescan
- Multi-sig ownership transfer
```

---

## API Architecture Overview

### REST Endpoints

**Authentication:**
- `POST /auth/nonce` - Get signing nonce
- `POST /auth/verify` - Verify signature & get JWT
- `POST /auth/refresh` - Refresh access token

**CT Draft:**
- `GET /draft/influencers` - List tracked influencers
- `POST /draft/team` - Create/update user team
- `GET /draft/team/:userId` - Get user's team
- `GET /draft/leaderboard` - Get rankings
- `GET /draft/scores/:influencerId` - Get influencer scores

**CT Whisperer:**
- `GET /whisperer/daily` - Get daily questions
- `POST /whisperer/answer` - Submit answer
- `GET /whisperer/stats/:userId` - Get user stats

**Timecaster:**
- `GET /timecaster/gauntlet/daily` - Get today's gauntlet
- `GET /timecaster/duels/open` - List open challenges
- `GET /timecaster/duels/:duelId` - Get duel details
- `GET /timecaster/user/:address` - Get user predictions

**Reputation:**
- `GET /reputation/:address` - Get CT Mastery Score
- `GET /reputation/leaderboard` - Global rankings

**Leaderboards:**
- `GET /leaderboard/combined` - Overall top users
- `GET /leaderboard/draft` - CT Draft leaders
- `GET /leaderboard/whisperer` - Whisperer leaders
- `GET /leaderboard/timecaster` - Betting leaders

### WebSocket Events

**Subscribe:**
- `draft:scores` - Real-time score updates
- `gauntlet:stakes` - Live betting activity
- `duel:${duelId}` - Specific duel updates
- `leaderboard:${type}` - Leaderboard changes

**Emit:**
- `score_update` - New influencer scores
- `stake_placed` - New bet placed
- `duel_accepted` - Challenge accepted
- `rank_change` - User rank updated

---

## Database Connection Pooling

```javascript
// PostgreSQL connection pool
const pool = new Pool({
  max: 20, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  maxRetriesPerRequest: 3,
});
```

---

## Error Handling Strategy

### Frontend
- Display user-friendly error messages
- Retry failed transactions
- Fallback to cached data when API fails
- Toast notifications for errors

### Backend
- Structured logging (JSON format)
- Error tracking (Sentry)
- Graceful degradation
- Circuit breakers for external APIs

### Smart Contracts
- Custom error messages (gas efficient)
- Require statements for validation
- No silent failures
- Comprehensive event logging

---

## Next Steps

See detailed specifications in:
- `SMART_CONTRACTS.md` - Contract architecture
- `DATABASE_SCHEMA.md` - Data models
- `BACKEND_API.md` - API specifications
- `FRONTEND_SPEC.md` - UI/UX architecture
- `MVP_ROADMAP.md` - Development timeline
- `DEPLOYMENT.md` - Infrastructure guide
