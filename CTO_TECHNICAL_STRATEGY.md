# Foresight Technical Strategy Memo

**To:** Foresight Founders
**From:** CTO
**Date:** February 9, 2026
**Status:** Strategic Planning
**Revision:** 1.0

---

## EXECUTIVE SUMMARY

**Current State:** Foresight is a well-architected fantasy sports game with 100+ endpoints, smart contract integration, and solid fundamentals. The codebase is clean, the deployment infrastructure is in place, and core features work.

**Proposed Pivot:** From fantasy league → CT intelligence platform with credibility scoring, prediction markets, and premium analytics.

**Assessment:** The current stack is **80% ready** for the pivot. The database schema is extensible, API architecture supports new endpoints, and smart contract infrastructure exists. However, several critical gaps need to be addressed for production mainnet launch.

**Risk Level:** MEDIUM → Manageable with focused execution
**Time to MVP:** 6-8 weeks with 1 engineer, 2-3 weeks if resourced properly
**Critical Path:** Data pipeline > Credibility scoring > Prediction markets > Auth expansion

---

## 1. ARCHITECTURE ASSESSMENT

### Readiness Scorecard (1-5 scale)

| Layer | Score | Status | Comments |
|-------|-------|--------|----------|
| **Frontend** | 4/5 | Strong | React 19, Vite, TypeScript mature. UI component library in place. Missing: card generation, complex analytics views |
| **Backend** | 4/5 | Strong | Express + TypeScript solid. Service architecture clean. 6,200+ LOC across 14 services. Missing: prediction market settlement logic |
| **Database** | 4/5 | Strong | PostgreSQL, 49 tables, Knex migrations. Schema extensible. Missing: prediction market state, historical data retention |
| **Smart Contracts** | 2/5 | Weak | CTDraftPrizedV2 works for contests. 7 dormant contracts create technical debt. Missing: prediction settlement, oracle integration |
| **Infrastructure** | 3/5 | Fair | Railway + Vercel configured. Missing: mainnet gas optimization, rate limiting at scale, caching layer |
| **Data Pipeline** | 2/5 | Weak | TwitterAPI.io integration exists, Nitter fallback present. Missing: historical data retention, prediction accuracy tracking |
| **API Security** | 3/5 | Fair | SIWE auth implemented, rate limiting enabled, CORS configured. Missing: JWT rotation, role-based access control, request signing for critical ops |

### What Stays ✅

1. **Frontend Stack** - React 19 + Vite is excellent. Keep as-is.
2. **Backend Core** - Express architecture solid. Extend, don't replace.
3. **Database Foundation** - PostgreSQL + Knex proven. 49 tables extensible.
4. **Authentication** - SIWE works. Add social/email on top, don't replace.
5. **Smart Contract Container** - Use CTDraftPrizedV2 as template, create new prediction contracts.
6. **Styling System** - Gold/cyan design tokens well-established.

### What Needs Overhaul 🔨

1. **Smart Contracts** - Delete dormant contracts (ReputationEngine, DailyGauntlet, etc.). Build new prediction settlement contract.
2. **Data Pipeline** - Extend TwitterAPI.io to include historical accuracy tracking.
3. **Caching Strategy** - Add Redis for leaderboards, prediction market state, rate limiting.
4. **Security Posture** - Add JWT rotation, RBAC, audit logging before mainnet.
5. **API Gateway** - Current setup works for <1K users. Need better rate limiting at 10K+.

---

## 2. DATA PIPELINE FOR CREDIBILITY SCORES

### The Core Problem

You want to score influencers on "prediction accuracy" — but X (Twitter) doesn't track this directly. You need to:
1. **Define what "prediction" means** for a CT influencer
2. **Collect historical data** on their tweets
3. **Track outcomes** they claimed would happen
4. **Measure accuracy** over time
5. **Attribute scores** without getting sued

### Proposed Approach

#### 2a. What Counts as a "Prediction"?

A tweet qualifies as a prediction if it contains:
- Explicit time-bounded claim: "ETH will hit $4K by Friday"
- Market action claim: "Altcoin X is undervalued, buying"
- Event claim: "Crypto regulation bill passing next month"
- Engagement bet: "This will moon" (weaker signal)

**Detection:** Use NLP + heuristics:
```
Keywords: "will", "gonna", "going to", "about to", "next", "by EOW", "by EOD", "moon", "tank", "pump"
Sentiment: Bullish/bearish prediction
Entity: Mentioned token/project
Timeframe: Explicit (e.g., "next week") or implicit (default = 30 days)
```

**Storage:** Add table:
```sql
CREATE TABLE influencer_predictions (
  id UUID PRIMARY KEY,
  influencer_id INT FK,
  tweet_id VARCHAR,
  prediction_text TEXT,
  predicted_entity VARCHAR,  -- Token/project
  prediction_type VARCHAR,   -- 'price_movement', 'regulatory', 'adoption', 'sentiment'
  sentiment VARCHAR,         -- 'bullish', 'bearish'
  confidence INT,            -- 0-100 (parsed from tweet tone)
  target_price DECIMAL,      -- If specified
  timeframe_days INT,        -- Default 30
  created_at TIMESTAMP,
  resolution_date TIMESTAMP, -- When we know outcome
  resolved BOOLEAN,
  was_accurate BOOLEAN,      -- NULL until resolved
  accuracy_score INT,        -- 0-100
  metadata JSONB
);
```

#### 2b. Data Collection Strategy

**Phase 1: Backfill (Weeks 1-2)**
- Pull last 90 days of tweets from each influencer via TwitterAPI.io
- Extract predictions using NLP model (Mistral 7B via Hugging Face API, ~$0.02/1K tokens)
- Score confidence based on language patterns
- Store in `influencer_predictions` table

**Cost Estimate:**
- TwitterAPI.io: $150-300 for backfill (30 influencers × 20 tweets × 90 days)
- NLP inference: ~$50-100 (3,000 tweets × 0.03)
- **Total: $200-400 one-time**

**Phase 2: Ongoing Collection (Every 6 hours)**
- Cron job fetches latest tweets from active influencers
- Extract predictions with NLP
- Store with unresolved status

**Phase 3: Resolution (Weekly)**
- Cron job checks resolved predictions:
  - Did the price hit the target? ✓
  - Did the regulatory event happen? ✓
  - Did adoption metrics move bullish? ✓
- Mark `was_accurate` and calculate `accuracy_score`
- Update leaderboard

#### 2c. X API Constraints Workaround

**Problem:** X banned "InfoFi" projects in Jan 2026. Official API limits to 30-day history.

**Solution (multi-layered):**

1. **TwitterAPI.io (primary)**
   - Third-party, cheap ($150-600/month)
   - Provides 30-day tweet history + engagement metrics
   - Risk: Could get blocked if X enforcement expands
   - **Mitigation:** Cache all tweets locally

2. **Nitter (fallback)**
   - Already implemented in codebase
   - Slower (10-20 sec per user) but free
   - No API rate limits
   - **Use for:** Backup during TwitterAPI.io outages

3. **Local Cache (critical)**
   - Store all tweets in DB the moment we see them
   - Add `ct_tweets` indexing on `created_at` for fast lookups
   - 30 influencers × 10 tweets/day × 365 days = ~110K tweets (small)
   - **Implement:** New cron job that stores tweets before API call completes

4. **Farcaster (future pivot)**
   - Influencers increasingly posting predictions on Farcaster
   - Already have Miniapp SDK integrated
   - Could become primary source in 6-12 months
   - **Plan:** Add Farcaster prediction tracking in Phase 2

**Implementation (3 services):**

```typescript
// Service 1: TwitterAPI.io (primary)
async fetchInfluencerPredictions(handle: string) {
  const tweets = await twitterApiIoService.getTweets(handle, 20);
  const predictions = extractPredictions(tweets);
  await db('influencer_predictions').insert(predictions);
  return predictions;
}

// Service 2: Nitter (fallback)
async fetchInfluencerPredictionsNitter(handle: string) {
  if (!await twitterApiIoService.isHealthy()) {
    const tweets = await nitterScraper.getTweets(handle);
    const predictions = extractPredictions(tweets);
    await db('influencer_predictions').insert(predictions);
    return predictions;
  }
}

// Service 3: Resolution
async resolveOldPredictions() {
  const unresolved = await db('influencer_predictions')
    .where('resolved', false)
    .where('resolution_date', '<=', new Date());

  for (const pred of unresolved) {
    const outcome = await determinePredictionOutcome(pred);
    await db('influencer_predictions')
      .where('id', pred.id)
      .update({
        resolved: true,
        was_accurate: outcome.correct,
        accuracy_score: outcome.score
      });
  }
}
```

#### 2d. Credibility Score Algorithm

```
CREDIBILITY_SCORE = (
  0.4 * PREDICTION_ACCURACY +      // % of past 30 predictions correct
  0.3 * RECENCY_FACTOR +            // Decay: older predictions worth less
  0.2 * CONFIDENCE_PRECISION +      // How often high-confidence bets were right
  0.1 * ENGAGEMENT_WEIGHT          // Followers don't lie (if 1M followers, more visibility)
) * MULTIPLIER

Where:
- PREDICTION_ACCURACY = correct_predictions / total_predictions (0-100)
- RECENCY_FACTOR = exp(-days_since_prediction / 30) * 100
- CONFIDENCE_PRECISION = avg_accuracy_score_of_high_confidence (0-100)
- ENGAGEMENT_WEIGHT = log(followers_count) / log(1,000,000) (normalized 0-100)
- MULTIPLIER = 1.0 (normal) to 1.5x (if prediction included token_contract address)
```

**Tier Mapping:**
- S-Tier (90-100): "Legendary" - Top 1% accuracy
- A-Tier (70-89): "Expert" - Top 10% accuracy
- B-Tier (50-69): "Solid" - Top 25% accuracy
- C-Tier (0-49): "Learning" - Everyone else

**Database Schema Update:**
```sql
ALTER TABLE influencers ADD COLUMN credibility_score INT DEFAULT 0;
ALTER TABLE influencers ADD COLUMN credibility_tier VARCHAR;
ALTER TABLE influencers ADD COLUMN accuracy_30day DECIMAL;  -- Last 30 days
ALTER TABLE influencers ADD COLUMN accuracy_90day DECIMAL;  -- Last 90 days
ALTER TABLE influencers ADD COLUMN credibility_updated_at TIMESTAMP;
CREATE INDEX idx_influencers_credibility ON influencers(credibility_score DESC);
```

---

## 3. PREDICTION MARKET ARCHITECTURE

### Design Decision: Off-Chain Settlement (Preferred)

**Why NOT on-chain settlement:**
- Gas costs: ~$10-50 per market resolution (expensive for free users)
- Speed: On-chain takes 2-3 blocks (~6 seconds), but you need multi-sig approval
- Complexity: Oracle integration, dispute resolution on-chain is hard
- Maintenance: Bug = lost user funds, liability nightmare

**Why OFF-chain settlement:**
- Instant results (1-2 seconds)
- Cheap (free to resolve)
- Flexible (can adjust odds on the fly)
- Reversible (if dispute, can refund before payout)
- Works for "play money" model (pre-mainnet launch)

**Transition to mainnet:** Once live with real ETH, move to on-chain with timelock + multisig.

### Market Types

#### Type 1: Over/Under Engagement

```
Market: "Will @vitalik get >10K likes on next tweet?"
Base: 0.5 ETH
Odds: 1.8x (bullish) vs 2.1x (bearish)
Duration: 7 days
Settlement: Resolved when tweet gets 7 days old or market closes
```

**Tables:**
```sql
CREATE TABLE prediction_markets (
  id UUID PRIMARY KEY,
  market_type VARCHAR,  -- 'over_under', 'directional', 'event'
  influencer_id INT FK,
  metric_name VARCHAR,  -- 'likes', 'retweets', 'engagement'
  threshold INT,        -- Target value
  direction VARCHAR,    -- 'over', 'under'
  entry_fee DECIMAL,    -- 0.001 - 0.1 ETH
  pool_size DECIMAL,    -- Total staked
  bullish_side_size DECIMAL,
  bearish_side_size DECIMAL,
  created_at TIMESTAMP,
  resolved_at TIMESTAMP,
  outcome VARCHAR,      -- 'bullish_win', 'bearish_win', 'draw', 'cancelled'
  final_value INT,      -- Actual metric at resolution
  status VARCHAR        -- 'active', 'resolved', 'disputed'
);

CREATE TABLE market_positions (
  id UUID PRIMARY KEY,
  user_id UUID FK,
  market_id UUID FK,
  side VARCHAR,         -- 'bullish', 'bearish'
  stake_amount DECIMAL,
  position_entered_at TIMESTAMP,
  payout_amount DECIMAL,
  claimed BOOLEAN
);
```

#### Type 2: Head-to-Head Prediction

```
Market: "Whose next tweet gets more engagement: @punk8529 vs @raydium?"
Setup: 50/50 odds initially
Stake: 0.01 ETH per side
Winner: Determined by engagement within 24 hours
```

#### Type 3: Event Markets

```
Market: "Will Ethereum Core Devs approve Shanghai in March?"
Binary: Yes/No
Odds: Market-determined
Duration: Until event confirmed
Settlement: Oracle input + user dispute period
```

### Settlement Flow

```
Day 1: Market opens → Users stake → Odds adjust (AMM-style)
Day 7: Market closes → No more entries
Day 8: Oracle checks actual metric (automated)
Day 8-9: Dispute period (users can contest if outcome wrong)
Day 9: Payouts released (off-chain, user claims when ready)
```

**Settlement Service:**
```typescript
// Resolution
async resolveMarket(marketId: string) {
  const market = await db('prediction_markets').where('id', marketId).first();
  const finalValue = await getMetricAtTime(market.influencer_id, market.resolved_at);

  let outcome: 'bullish_win' | 'bearish_win' | 'draw';
  if (market.direction === 'over') {
    outcome = finalValue > market.threshold ? 'bullish_win' : 'bearish_win';
  } else {
    outcome = finalValue < market.threshold ? 'bullish_win' : 'bearish_win';
  }

  const totalPool = market.pool_size;
  const winnerSide = outcome === 'bullish_win' ? 'bullish' : 'bearish';
  const winnerStake = market[`${winnerSide}_side_size`];
  const loserStake = totalPool - winnerStake;
  const payout = totalPool + (loserStake * 0.9); // 10% rake

  // Payout winners
  const winners = await db('market_positions')
    .where('market_id', marketId)
    .where('side', winnerSide);

  for (const winner of winners) {
    const prizeAmount = (winner.stake_amount / winnerStake) * payout;
    await db('market_positions')
      .where('id', winner.id)
      .update({ payout_amount: prizeAmount });
  }
}

// Claim payout
async claimMarketPayout(userId: string, marketId: string) {
  const position = await db('market_positions')
    .where('user_id', userId)
    .where('market_id', marketId)
    .first();

  if (!position.payout_amount) throw new Error('No payout');
  if (position.claimed) throw new Error('Already claimed');

  // Off-chain: Just mark as claimed, store in DB
  await db('market_positions')
    .where('id', position.id)
    .update({ claimed: true });

  // TODO: When on mainnet, send ETH via contract
  return { claimed: true, amount: position.payout_amount };
}
```

### Mainnet Transition

**When you move to real ETH:**

1. Deploy new `PredictionSettlement.sol` contract with:
   - Timelock (2-day delay before payout)
   - Multisig controller (2-of-3 approval)
   - Emergency pause
   - Dispute resolution (users can challenge outcome)

2. Keep off-chain DB as "source of truth" for audit trail

3. Contract calls DB API:
   ```solidity
   function resolveMarket(
     uint256 marketId,
     address oracle
   ) external onlyOwner onlyAfterTimelock {
     (bool correct, uint256 payout) = IMarketOracle(oracle).getOutcome(marketId);
     require(correct, "Oracle check failed");
     // Distribute payouts
   }
   ```

---

## 4. API STRATEGY & RISK MITIGATION

### Current Risk: X API Dependency

**The threat:** X could ban Foresight at any moment (they banned "InfoFi" in Jan 2026).

**Your revenue depends on:**
1. Fetching influencer tweets (for credibility scoring)
2. Tracking engagement metrics (for prediction resolution)
3. Displaying recent tweets (for feed)

### Multi-Source Data Architecture

```
┌─────────────────────────────────────────┐
│       Your App (Foresight)              │
│   Needs: Tweets, engagement, profiles   │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼─────┐ ┌───▼────┐ ┌────▼─────┐
   │   X API  │ │Twitter │ │Farcaster │
   │(Official)│ │API.io  │ │ Network  │
   │          │ │(3party)│ │(Web3)    │
   └────┬─────┘ └───┬────┘ └────┬─────┘
        │           │           │
        └───────────┼───────────┘
                    │
           ┌────────▼────────┐
           │  LOCAL CACHE    │
           │  (PostgreSQL)   │
           └─────────────────┘
```

**Implementation:**

1. **TwitterAPI.io (Primary)**
   ```typescript
   async getTweetsWithFallback(handle: string) {
     try {
       return await twitterApiIoService.getTweets(handle);
     } catch (e) {
       // Fallback to Nitter
       return await nitterScraper.getTweets(handle);
     }
   }
   ```

2. **Nitter Scraper (Fallback)**
   - Already in codebase at `nitterScraper.ts`
   - Can survive X API bans
   - Risk: Nitter instances go down, but distributed globally
   - **Mitigation:** Keep list of 5+ public Nitter instances, rotate on failure

3. **Farcaster (Future)**
   - Many CT influencers posting there
   - Decentralized, can't ban you
   - Already have Miniapp SDK
   - **Add in Phase 2:** Pull predictions from Farcaster alongside Twitter

4. **Local Cache (Critical)**
   - Store every tweet you fetch
   - Index by `created_at` for fast queries
   - Run weekly cleanup (keep 1 year of data)
   - **Cost:** 30 influencers × 10 tweets/day × 365 = 110K tweets per year (~5MB)

### Caching Layer for Scale

At 10K users, request volume will exceed API limits.

**Redis caching strategy:**
```typescript
// Cache influencer metrics for 1 hour
async getInfluencerMetrics(influencerId: number) {
  const cached = await redis.get(`influencer:${influencerId}:metrics`);
  if (cached) return JSON.parse(cached);

  const fresh = await fetchFromTwitterApi(influencerId);
  await redis.setex(
    `influencer:${influencerId}:metrics`,
    3600,  // 1 hour TTL
    JSON.stringify(fresh)
  );
  return fresh;
}

// Cache prediction market state
async getMarketOdds(marketId: string) {
  const cached = await redis.get(`market:${marketId}:odds`);
  if (cached) return JSON.parse(cached);

  const fresh = await calculateOdds(marketId);
  await redis.setex(
    `market:${marketId}:odds`,
    30,  // 30 seconds TTL (frequent updates)
    JSON.stringify(fresh)
  );
  return fresh;
}

// Cache leaderboard (expensive calculation)
async getLeaderboard(season: string) {
  const cached = await redis.get(`leaderboard:${season}`);
  if (cached) return JSON.parse(cached);

  const fresh = await calculateLeaderboard(season);
  await redis.setex(
    `leaderboard:${season}`,
    3600,  // 1 hour TTL
    JSON.stringify(fresh)
  );
  return fresh;
}
```

**Cost Estimate:**
- Upstash Redis (serverless, pay-per-request): ~$50-100/month at 10K users
- Self-hosted Redis on Railway: Free (included)

### Rate Limiting Strategy

Current setup: 1000 req/15min global (dev), 100 req/15min (prod)

**Problem:** At 10K users, legitimate traffic could trigger rate limits.

**Solution:**
```typescript
// Rate limit per user (not just IP)
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,  // 100 requests per 15 minutes per user
  keyGenerator: (req) => req.user.id || req.ip,  // Fallback to IP if not authed
  skip: (req) => req.user?.role === 'admin'      // Exempt admins
});

// Stricter limit on sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,  // 5 auth attempts per minute
  keyGenerator: (req) => req.body.wallet || req.ip
});

router.post('/api/auth/sign', authLimiter, handleAuth);
router.use('/api/', userLimiter);
```

---

## 5. AUTHENTICATION EXPANSION

### Current State
- SIWE only (Sign-In with Ethereum)
- JWT tokens
- 7-day expiry

### New Requirement
- Email + password (for non-crypto users)
- Google/Twitter OAuth (social)
- Keep SIWE (for crypto natives)
- Support users who start with email, add wallet later

### Technical Approach

**Solution: Use Privy (recommended)**

Why Privy:
- Designed exactly for this use case (Web3 + Web2 auth)
- Handles email, Google, wallet all in one
- Built-in account linking (user can add wallet after email signup)
- Farcaster integration (bonus!)
- Cost: Free tier covers 5K DAU

**Implementation (1 week):**

1. Install Privy SDK
   ```bash
   npm install @privy-io/react-auth
   ```

2. Wrap frontend with Privy provider
   ```typescript
   import { PrivyProvider } from '@privy-io/react-auth';

   export default function App() {
     return (
       <PrivyProvider appId="YOUR_PRIVY_APP_ID">
         <YourApp />
       </PrivyProvider>
     );
   }
   ```

3. Replace RainbowKit with Privy login
   ```typescript
   import { usePrivy } from '@privy-io/react-auth';

   function LoginButton() {
     const { login, isReady } = usePrivy();
     return (
       <button onClick={login} disabled={!isReady}>
         Sign In
       </button>
     );
   }
   ```

4. Backend: Accept both Privy JWT and existing SIWE
   ```typescript
   async function authenticate(req: Request, res: Response) {
     const token = req.headers.authorization?.split(' ')[1];

     // Try Privy first
     try {
       const user = await verifyPrivyToken(token);
       return user;
     } catch (e) {
       // Fallback to SIWE
       return verifySiweToken(token);
     }
   }
   ```

5. Database migration
   ```sql
   ALTER TABLE users ADD COLUMN auth_provider VARCHAR;  -- 'siwe', 'email', 'google'
   ALTER TABLE users ADD COLUMN email VARCHAR UNIQUE;
   ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
   CREATE INDEX idx_users_email ON users(email);
   ```

**Cost:** FREE tier (Privy covers 5K DAU for free, then $99/month)

**Alternative: Magic Link (simpler)**
- If you just need email + wallet (no Google)
- Magic Link is cheaper ($0 for dev, pay-as-you-go after)
- Downsides: Less integrated, requires more manual setup

**Alternative: Dynamic (more control)**
- More flexible than Privy
- Requires more implementation work
- Good if you need custom branding

**Recommendation:** Use Privy. You get:
- Email signup (non-crypto users)
- Google/Twitter OAuth (social growth)
- Wallet connection (crypto natives)
- Account linking (user can add wallet later)
- Farcaster support (bonus)
- All for free up to 5K DAU

---

## 6. MAINNET MIGRATION PLAN

### Current State
- Deployed to Base Sepolia (testnet)
- CTDraftPrizedV2 contract is live
- Using testnet ETH for gas

### Mainnet Checklist

#### Phase 1: Preparation (Week 1)

- [ ] **Security Audit**
  - Cost: $500-2000 (skip formal audit, do internal review)
  - Focus: Prize distribution logic, oracle integration, access control
  - Checklist: [See Section 11 below]

- [ ] **Contract Updates**
  ```solidity
  // Add to CTDraftPrizedV2Mainnet

  // 1. Emergency pause (for critical bugs)
  bool public paused;
  modifier whenNotPaused() { require(!paused); _; }
  function pause() external onlyOwner { paused = true; }
  function unpause() external onlyOwner { paused = false; }

  // 2. Timelock (2-day delay for owner actions)
  mapping(bytes32 => uint256) public queuedActions;
  uint constant TIMELOCK_DELAY = 2 days;

  // 3. Rate limiting on contest creation
  mapping(address => uint256) public contestCreationCount;
  mapping(address => uint256) public lastContestCreationTime;
  uint constant MAX_CONTESTS_PER_DAY = 10;
  ```

- [ ] **Gas Optimization**
  - Review CTDraftPrizedV2 for expensive storage operations
  - Avoid storing arrays in mappings (use separate index table)
  - Cache calculations in memory instead of storage
  - Expected gas cost reduction: 20-30%

- [ ] **Environment Setup**
  ```bash
  # Create mainnet config
  cp .env.sepolia .env.mainnet

  # Update:
  RPC_URL=https://base-rpc.publicnode.com
  CHAIN_ID=8453
  PRIV_KEY=<mainnet_deployer_key>
  ```

#### Phase 2: Deployment (Week 2)

1. **Deploy to Base Mainnet**
   ```bash
   cd contracts
   forge script script/Deploy.s.sol \
     --rpc-url base-mainnet \
     --broadcast \
     --verify
   ```

2. **Initialize Contract**
   ```solidity
   // Via etherscan or CLI
   await contract.setTreasury(treasuryWallet);
   await contract.setOracle(oracleAddress);
   ```

3. **Update Frontend Config**
   ```typescript
   // src/config/chains.ts
   export const chainConfig = {
     development: {
       id: 84532,
       rpc: 'http://localhost:8545'
     },
     sepolia: {
       id: 84532,
       rpc: 'https://sepolia-base.publicnode.com',
       contracts: { CTDraft: '0x...' }
     },
     mainnet: {
       id: 8453,
       rpc: 'https://base-rpc.publicnode.com',
       contracts: { CTDraft: '0x...' }
     }
   };
   ```

4. **Update Backend Config**
   ```typescript
   const chainId = parseInt(process.env.CHAIN_ID || '84532');
   const contractAddress = getContractAddress(chainId);
   ```

#### Phase 3: Go-Live (Week 3)

1. **Soft Launch** (invite-only, $0.001 ETH contests)
   - Monitor: Gas costs, transaction success rate, user feedback
   - Duration: 1 week

2. **Full Launch** (public, real ETH)
   - Run contests with real entry fees
   - Monitor 24/7 for first week

3. **Post-Launch** (Week 4+)
   - Monitor gas market, adjust entry fees if needed
   - Collect data on user behavior, engagement
   - Plan features based on feedback

### Gas Cost Considerations

Base mainnet is much cheaper than Ethereum:
- Contest creation: ~$0.02 (vs $1+ on Ethereum)
- Team entry: ~$0.01
- Prize payout: ~$0.03

**Pricing strategy:**
- Entry fee: 0.001 - 0.05 ETH ($0.03 - $1.50 at $30K/ETH)
- Keep small contest types cheap (0.001 ETH)
- Premium contests can be 0.05 ETH

### Mainnet RPC Options

**Recommended:**
1. Alchemy (free tier: 300 calls/sec)
   - Cost: Free for dev, $29/month for production
   - Reliability: 99.99% uptime SLA

2. Infura (free: 100,000 API calls/day)
   - Cost: Free tier, $50/month for higher limits
   - Reliability: Good, 99.9% SLA

3. Public RPC (free, no guarantees)
   - https://base-rpc.publicnode.com
   - Use as backup only

**Setup:**
```typescript
const rpcUrl = process.env.RPC_URL || 'https://base-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(rpcUrl);

// With fallback
const providers = [
  new ethers.JsonRpcProvider('https://base.llamarpc.com'),
  new ethers.JsonRpcProvider('https://base-rpc.publicnode.com')
];
const provider = new ethers.FallbackProvider(providers);
```

---

## 7. IMAGE GENERATION FOR SHAREABLE CARDS

### The Need

Users want to share their score/position with "proof" on social media:
```
[Screenshot]
🏆 I'm #1247 on Foresight
Credibility Score: 87 (A-Tier)
30-Day Accuracy: 62%

Share on Twitter | Download PNG
```

### Simplest Approach: HTML → Canvas → PNG

**Not ideal:** Vercel OG (designed for meta tags, limited customization)

**Better:** Puppeteer (you already have it!) + server-side rendering

**Best:** Use `html2canvas` on frontend + share via browser

**Pick:** Frontend `html2canvas` for MVP (shipped, 2 weeks)

#### Implementation (Frontend)

```typescript
// Card component
function ShareableCard({ userId }: { userId: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<UserStats>();

  useEffect(() => {
    fetch(`/api/v2/users/${userId}/stats`).then(r => setUser(r.data));
  }, [userId]);

  const generatePNG = async () => {
    if (!cardRef.current) return;

    // Use html2canvas (already in package.json)
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: '#09090B',  // dark bg
      scale: 2,                     // 2x resolution
      logging: false
    });

    // Download
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `foresight-${user.username}-${new Date().getTime()}.png`;
    link.click();
  };

  const shareToTwitter = async () => {
    const text = `I'm #${user.rank} on Foresight!
Credibility Score: ${user.credibilityScore} (${user.tier})
30-Day Accuracy: ${user.accuracy30}%

Join me: https://foresight.app`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url);
  };

  return (
    <>
      <div ref={cardRef} className="card-container">
        <div className="gradient-bg" />
        <div className="card-content">
          <h2>{user.username}</h2>
          <p className="rank">#{user.rank}</p>
          <div className="stats">
            <div className="stat">
              <label>Score</label>
              <value className="gold">{user.credibilityScore}</value>
            </div>
            <div className="stat">
              <label>Tier</label>
              <value className={`tier-${user.tier.toLowerCase()}`}>
                {user.tier}
              </value>
            </div>
            <div className="stat">
              <label>30-Day Accuracy</label>
              <value>{user.accuracy30}%</value>
            </div>
          </div>
          <footer>Credibility Scores by Foresight</footer>
        </div>
      </div>

      <button onClick={generatePNG}>Download PNG</button>
      <button onClick={shareToTwitter}>Share to Twitter</button>
    </>
  );
}
```

#### CSS (TailwindCSS)

```css
.card-container {
  @apply w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-950
    rounded-2xl p-8 border border-gold-500/20;
  aspect-ratio: 1.2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content {
  @apply text-center text-white;
}

.card-content h2 {
  @apply text-4xl font-bold text-gold-500 mb-2;
}

.card-content .rank {
  @apply text-3xl font-bold text-cyan-400 mb-6;
}

.stats {
  @apply grid grid-cols-3 gap-4 my-8;
}

.stat {
  @apply flex flex-col gap-1;
}

.stat label {
  @apply text-sm text-gray-400;
}

.stat value {
  @apply text-2xl font-bold;
}

.tier-a {
  @apply text-cyan-400;
}

.tier-s {
  @apply text-gold-500;
}

.tier-b {
  @apply text-emerald-400;
}

.tier-c {
  @apply text-gray-400;
}

.card-container footer {
  @apply text-xs text-gray-500 mt-4;
}
```

#### Server-Side Fallback (for sharing via OG)

When users paste link on Twitter, Twitter crawls the meta tags. Generate OG image server-side:

```typescript
// GET /api/v2/users/:username/og-image
router.get('/api/v2/users/:username/og-image', async (req, res) => {
  const user = await db('users')
    .where('username', req.params.username)
    .first();

  if (!user) return res.status(404).send('Not found');

  // Generate image using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Render card as HTML
  const html = `
    <html>
      <head>
        <style>
          body {
            background: #09090B;
            margin: 0;
            padding: 32px;
            font-family: Inter, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1200px;
            height: 630px;
          }
          .card {
            background: linear-gradient(135deg, #1a1a24 0%, #09090B 100%);
            border: 2px solid rgba(245, 158, 11, 0.2);
            border-radius: 16px;
            padding: 48px;
            text-align: center;
            color: white;
            width: 100%;
            height: 100%;
          }
          h1 { color: #F59E0B; font-size: 56px; margin: 0; }
          .rank { color: #06B6D4; font-size: 48px; }
          .stat { display: inline-block; margin: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>${user.username}</h1>
          <p class="rank">#${user.rank}</p>
          <div class="stat">Score: ${user.credibilityScore}</div>
          <div class="stat">Tier: ${user.tier}</div>
          <div class="stat">Accuracy: ${user.accuracy30}%</div>
        </div>
      </body>
    </html>
  `;

  await page.setContent(html);
  const image = await page.screenshot({ type: 'png' });

  await browser.close();

  res.setHeader('Content-Type', 'image/png');
  res.send(image);
});
```

**Then add OG meta tags to user profile page:**

```html
<meta property="og:image" content="https://foresight.app/api/v2/users/username/og-image" />
<meta property="og:title" content="I'm #1247 on Foresight!" />
<meta property="og:description" content="Credibility Score: 87 (A-Tier)" />
```

### Cost Estimate
- Frontend: FREE (html2canvas is bundled)
- Server-side: $5-20/month (Puppeteer instances on Railway)
- CDN caching: Could add Cloudflare, but not needed for MVP

---

## 8. INFRASTRUCTURE & SCALING

### Current Setup

| Component | Provider | Cost | Capacity |
|-----------|----------|------|----------|
| Frontend | Vercel | FREE (within limits) | 100K req/day |
| Backend | Railway | $5-10/month | 1-5K concurrent |
| Database | Railway (PostgreSQL) | $5-20/month | 100GB storage |
| WebSockets | Express socket.io | Included | 1K concurrent |

### Scaling Limits

**At 1K concurrent users:**
- Current setup handles fine
- No changes needed

**At 10K concurrent users:**
- Backend CPU will spike (Express is single-threaded)
- Database connections might hit limit (20 default)
- WebSocket broadcasts slow down

**At 100K concurrent users:**
- Everything breaks, redesign needed

### Upgrade Path (When Needed)

#### Option 1: Vertical Scaling (Easiest)

Upgrade Railway tiers:
- Backend: $5 → $50/month (8GB RAM, 4 CPU)
- Database: $20 → $100/month (dedicated instance)
- Handles 10K concurrent users

**Cost:** $150/month
**Time:** 5 minutes (just upgrade)
**Downtime:** None (Railway auto-migrates)

#### Option 2: Horizontal Scaling (Better)

Separate services:
- **API Gateway** (Express, AWS ALB)
- **API Servers** (3-5 instances, auto-scale)
- **WebSocket Server** (dedicated, use Redis Pub/Sub)
- **Background Jobs** (separate Celery/Bull instance)
- **Cache Layer** (Redis)

**Cost:** $200-500/month
**Time:** 1-2 weeks
**Downtime:** Can do zero-downtime migration

#### Option 3: Serverless (Recommended at Scale)

Move to serverless:
- Frontend: Vercel (already there)
- API: Vercel Functions or AWS Lambda
- Database: AWS RDS (auto-scaling)
- Cache: Upstash Redis (serverless)
- Background: AWS SQS + Lambda

**Cost:** Pay-per-request, $300-1000/month at 100K users
**Time:** 3-4 weeks refactor
**Downtime:** Can be zero

### What Breaks First (at 10K users)

1. **Database connections** (default 20, you'll hit it)
   ```
   Error: FATAL: too many connections for role "postgres"
   ```
   **Fix:** Increase `max_connections` in Railway dashboard

2. **Memory** (cron jobs + WebSocket broadcasts)
   ```
   Error: JavaScript heap out of memory
   ```
   **Fix:** Increase Node memory limit in Railway

3. **API rate limiting** (legitimate users get blocked)
   ```
   Error: 429 Too Many Requests
   ```
   **Fix:** Add Redis-based rate limiting, increase limits for premium users

### Recommended Action Plan

**Now (MVP):**
- Keep current setup
- Add monitoring (Sentry for errors, DataDog for perf)
- Cost: $20-50/month

**At 1K users:**
- Scale database to 50GB tier
- Monitor weekly
- Cost: $50/month

**At 5K users:**
- Upgrade to Option 1 (Vertical scaling)
- Cost: $150/month
- Estimated time: 1 week of prep

**At 20K+ users:**
- Migrate to Option 2 or 3
- Hire second engineer for infrastructure
- Cost: $300-500/month

---

## 9. TECHNICAL DEBT CLEANUP

### Dormant Smart Contracts (Delete)

Current situation: 7 contracts deployed, only 1 (CTDraftPrizedV2) is used.

**Dormant contracts:**
1. CTDraft.sol - v1, replaced by V2
2. CTDraftPrized.sol - v1, replaced by V2
3. ReputationEngine.sol - Never integrated
4. Treasury.sol - Mostly unused
5. QuestRewards.sol - Unused, quests are off-chain
6. DailyGauntlet.sol - Game mode removed
7. TimecasterArena.sol - Legacy product line
8. ForesightNFT.sol - Minted but no use

**Action:** Clean these up before mainnet

**Cost:** Takes 2 hours, saves future confusion

**Steps:**
1. Remove from `contracts/src/`
2. Remove from `deployment-addresses.json`
3. Delete test files
4. Update docs to remove mentions
5. Close old contracts on mainnet with self-destruct (or just ignore them)

### Oversized Quest System

**Current:** 27 quest definitions seeded, but many unused

**Database:**
```sql
SELECT COUNT(*) FROM quest_definitions_v2 WHERE is_active = true;
-- Result: 27, but only ~5 used
```

**Action:** Delete unused, streamline to 5-7 high-value quests

**Recommendation:**
1. Keep: Daily login, Weekly voting, Refer a friend, Win contest, Reach tier milestone
2. Delete: All the niche ones (e.g., "Check CT Feed 3 times")
3. Cost: 1 hour cleanup, saves DB bloat

### Unused Database Tables

Run this query:
```sql
-- Find tables with 0 rows
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND NOT EXISTS (
  SELECT FROM information_schema.columns
  WHERE table_name = tablename
);
```

**Tables to delete:**
- `activity_feed` (never used, we have transaction history)
- `team_transfers` (migrated to `user_teams`)
- `transfer_tier_limits` (not used)
- Several old `*_v1` tables

**Cost:** 1-2 hours, saves storage and clarity

### Migration: Clean Up Routes

Current frontend has 19 pages, but some are unused:
- `Intel.tsx` - Never completed
- `LeagueUltra.tsx` - Duplicate of `League.tsx`
- Old pages from abandoned features

**Action:** Delete unused pages, redirect old URLs

**Recommendation:**
```typescript
// Keep:
- Home (dashboard)
- Draft (team creation)
- Vote (voting interface)
- Progress (scoring/leaderboard)
- Profile (user page)
- Settings
- Quests
- Compete (contests hub)

// Delete:
- Intel (incomplete)
- LeagueUltra (duplicate)
- Cookies, Imprint, Privacy, Terms (move to /docs)
```

---

## 10. 6-WEEK ENGINEERING SPRINT PLAN (1 Engineer)

### Week 1: Foundation (Data Pipeline)

**Goal:** Get prediction data flowing

- **Day 1-2:** Extract predictions from historical tweets
  - Write NLP extraction script using Mistral API
  - Test on 100 tweets, measure accuracy
  - Store in `influencer_predictions` table

- **Day 3:** Credibility score algorithm
  - Implement scoring formula
  - Write tests for tier calculation
  - Add `credibility_score` column to influencers

- **Day 4:** Cron jobs
  - Daily cron: Fetch new tweets, extract predictions
  - Weekly cron: Resolve old predictions, update scores
  - Test both

- **Day 5:** Frontend display
  - Show credibility score on influencer cards
  - Add tier badges (S/A/B/C)
  - Test on all pages

**Deliverable:** Influencers have credibility scores, displayed on UI

**Test:** Run 1 week without changes, verify scores update correctly

---

### Week 2: Prediction Markets (Core Logic)

**Goal:** Users can create and enter prediction markets

- **Day 1:** Database schema
  - Create `prediction_markets` table
  - Create `market_positions` table
  - Add indexes for fast queries

- **Day 2:** API endpoints
  - `POST /api/v2/markets/create` - Create new market
  - `POST /api/v2/markets/:id/enter` - User enters market
  - `GET /api/v2/markets/:id` - Get market details
  - `GET /api/v2/markets/active` - List active markets
  - Add input validation

- **Day 3:** Market logic service
  - Odds calculation (AMM-style)
  - Stake payout calculation
  - Write unit tests

- **Day 4:** Frontend
  - `MarketCard.tsx` - Display single market
  - `MarketEntry.tsx` - Modal to enter
  - `MarketsPage.tsx` - List all markets
  - Wire up API calls

- **Day 5:** Testing
  - Manual test: Create market, enter as different users, verify odds
  - Test payout calculation
  - Test edge cases (min stake, max positions)

**Deliverable:** Users can create/enter prediction markets, see live odds

**Limitation:** No resolution logic yet (manual for now)

---

### Week 3: Market Resolution & Settlement

**Goal:** Markets auto-resolve, payouts calculated

- **Day 1:** Oracle integration
  - Write service to fetch metrics at resolution time
  - Verify prediction was accurate
  - Handle disputes (1-hour window)

- **Day 2:** Settlement logic
  - Implement `resolveMarket()` function
  - Calculate winner payouts
  - Mark positions as claimed/unclaimed
  - Write tests

- **Day 3:** Cron job
  - Daily cron: Check markets past resolution time
  - Auto-resolve if no disputes
  - Move to "claimable" state

- **Day 4:** Claim endpoint
  - `POST /api/v2/markets/:id/claim` - User claims payout
  - Update balance (off-chain for now)
  - Emit event to frontend

- **Day 5:** Frontend
  - Show "Claimable Payout" notification
  - Add claim button
  - Show resolution details (actual value, winner, payout)

**Deliverable:** Markets resolve automatically, users can claim winnings

**Test:** Create market, wait for resolution, claim payout

---

### Week 4: Authentication Expansion

**Goal:** Email signup works alongside SIWE

- **Day 1:** Privy setup
  - Create Privy account, get app ID
  - Install SDK in frontend
  - Add PrivyProvider wrapper

- **Day 2:** Frontend integration
  - Replace RainbowKit with Privy login
  - Handle email signup flow
  - Test account linking (email → add wallet)

- **Day 3:** Backend integration
  - Create JWT verification for Privy tokens
  - Accept both SIWE and Privy tokens
  - Update auth middleware

- **Day 4:** Database
  - Add email, auth_provider columns to users
  - Create migration
  - Handle email uniqueness

- **Day 5:** Testing
  - Sign up with email
  - Sign up with Google
  - Add wallet to email account
  - Log in with existing wallet
  - Verify all flows work

**Deliverable:** Users can sign up with email, Google, or wallet

**Limitation:** No password reset yet (Privy handles it)

---

### Week 5: Mainnet Prep & Card Generation

**Goal:** Contract ready for mainnet, shareable cards work

- **Day 1-2:** Security review
  - Audit CTDraftPrizedV2 for bugs
  - Add emergency pause mechanism
  - Add rate limiting
  - Document security assumptions

- **Day 3:** Card generation
  - Create ShareableCard component
  - Implement html2canvas export
  - Add Twitter share button
  - Test downloads

- **Day 4:** Server-side cards (OG images)
  - Create `/api/v2/users/:username/og-image` endpoint
  - Add Puppeteer generation
  - Add caching (1 hour)
  - Test OG meta tags

- **Day 5:** Mainnet config
  - Update contract addresses for mainnet
  - Set RPC endpoints (Alchemy, Infura)
  - Deploy to Base Sepolia first (mirror mainnet config)
  - Test end-to-end

**Deliverable:** Contracts audit-ready, shareable cards work, testnet deployment complete

---

### Week 6: Polish & Launch

**Goal:** MVP shipping, basic monitoring

- **Day 1-2:** Bug fixes
  - Fix any issues from testing
  - Performance optimizations
  - Edge case handling

- **Day 3:** Monitoring
  - Set up Sentry for error tracking
  - Add basic DataDog dashboard
  - Write runbook for common issues

- **Day 4:** Documentation
  - Update API docs
  - Write user guide for new features
  - Document scoring algorithm
  - Document market resolution process

- **Day 5:** Soft launch
  - Deploy to production (Vercel + Railway)
  - Invite 100 beta users
  - Monitor for 24 hours
  - Fix critical issues

**Deliverable:** MVP shipped, users can use credibility scores + prediction markets

**Metrics to track:**
- DAU (daily active users)
- Market creation rate
- Market entry rate
- Claim rate (payouts)
- Error rate

---

### After 6 Weeks

**Week 7-8:** If time permits
- [ ] Live credibility scoring dashboard
- [ ] Referral rewards for prediction markets
- [ ] Leaderboard of top predictors
- [ ] Analytics page (accuracy charts, prediction history)
- [ ] Email notifications (market resolved, new predictions)

**Week 9+:** Post-MVP
- [ ] Mainnet deployment (if beta successful)
- [ ] Premium tier (gated analytics, higher limits)
- [ ] Mobile app (React Native)
- [ ] Integration with Farcaster

---

## 11. SECURITY CONSIDERATIONS

### Critical: JWT Secret Rotation

**Status:** BLOCKER (must fix before launch)

Your JWT secret is hardcoded in `.env` and was committed to git. This is a critical vulnerability.

**Immediate Action:**
```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Output: (copy this)
a7f9e2b3c1d8e9f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6
```

**1. Update .env locally:**
```
JWT_SECRET=a7f9e2b3c1d8e9f2a3b4c5d6e7f8a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e
```

**2. Update Railway (production):**
- Go to Railway project
- Settings → Variables
- Update JWT_SECRET
- Redeploy backend

**3. Clean git history (optional but recommended):**
```bash
# This rewrites history - coordinate with team!
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env' \
  --prune-empty --tag-name-filter cat -- --all
```

**4. All existing users will need to re-authenticate** (tokens will fail validation)

---

### For Mainnet (Real ETH)

#### 1. Smart Contract Security

Before deploying CTDraftPrizedV2 to mainnet:

**Checklist:**
- [ ] No hardcoded addresses (use constructor params)
- [ ] No `selfdestruct` unless you have a destructor migration plan
- [ ] Reentrancy guards on all external calls
- [ ] Checked arithmetic (no overflow/underflow)
- [ ] Access control: Only owner can create/lock/finalize
- [ ] Events emitted for all state changes
- [ ] No uninitialized storage (use constructor)
- [ ] Proper error messages for failed transactions

**Example fixes:**
```solidity
// BEFORE (vulnerable)
function claimPrize(uint256 contestId) external {
  Entry storage entry = entries[contestId][msg.sender];
  require(entry.rank > 0);

  uint256 prize = calculatePrize(entry.rank);
  msg.sender.call{value: prize}(""); // Reentrancy!
  entry.claimed = true;
}

// AFTER (safe)
function claimPrize(uint256 contestId) external nonReentrant {
  Entry storage entry = entries[contestId][msg.sender];
  require(entry.rank > 0, "Not ranked");
  require(!entry.claimed, "Already claimed");

  uint256 prize = calculatePrize(entry.rank);
  entry.claimed = true;  // State change first

  (bool success, ) = msg.sender.call{value: prize}("");
  require(success, "Transfer failed");

  emit PrizeClaimed(contestId, msg.sender, prize);
}
```

#### 2. Operational Security

**Private Key Management:**
- Never commit private keys to git
- Use Hardware Security Module (HSM) or:
  - AWS Secrets Manager
  - HashiCorp Vault
  - Ledger hardware wallet for deployment

**Multi-Sig for Critical Ops:**
- Deploy a 2-of-3 multisig for owner
- Signers: You (founder) + 2 trusted advisors
- Prevents accidental/malicious actions

**Example (Gnosis Safe):**
```bash
# Create 2-of-3 multisig at https://safe.base.io
# Owners: founder1, advisor1, advisor2
# Threshold: 2

# Any pause/update requires 2 signatures
```

#### 3. Rate Limiting & DDoS Protection

Add Cloudflare in front of your API:
```
Step 1: Update DNS to point to Cloudflare
Step 2: Enable Cloudflare rules:
- Rate limiting: 100 requests/minute per IP
- DDoS protection: Challenge suspicious traffic
- Bot protection: Block known bot IPs
```

**Cost:** FREE tier sufficient for MVP

#### 4. Oracle Risk

When you add oracle (for market resolution):

**Risk:** Oracle gives wrong data → wrong winners paid

**Mitigation:**
- Use Chainlink (decentralized, expensive)
- Use trusted data source (faster, cheaper)
- Implement dispute window (users can contest)
- Keep funds in contract, require 2-of-3 multisig approval

```solidity
contract MarketOracle {
  address public oracleOwner;
  mapping(uint256 => MarketResolution) public resolutions;

  function submitResolution(
    uint256 marketId,
    uint256 finalValue,
    bool bullishWin
  ) external onlyOracleOwner {
    resolutions[marketId] = MarketResolution({
      finalValue: finalValue,
      bullishWin: bullishWin,
      submittedAt: block.timestamp,
      disputed: false
    });
  }

  // Users can dispute for 24 hours
  function disputeResolution(uint256 marketId) external {
    MarketResolution storage res = resolutions[marketId];
    require(block.timestamp < res.submittedAt + 24 hours);
    res.disputed = true;
    // Admin must re-verify
  }
}
```

#### 5. Audit (Light Version)

Can't afford formal audit ($5K-15K)? Do this instead:

**Week 1:**
- [ ] Read through CTDraftPrizedV2.sol line-by-line
- [ ] Check for common patterns (reentrancy, overflow, etc.)
- [ ] Ask ChatGPT: "Find security issues in this Solidity code"
- [ ] Run `slither` (free static analyzer):
  ```bash
  pip install slither-analyzer
  slither contracts/src/CTDraftPrizedV2.sol
  ```

**Week 2:**
- [ ] Test with Echidna (fuzzing tool)
- [ ] Test with Foundry (your current setup)
- [ ] Manual testing: Try to break the contract
  - Enter then withdraw
  - Try to claim twice
  - Try to enter locked contest
  - Try to change settings as non-owner

**Cost:** 20-30 hours effort, FREE

---

### Ongoing Security Practices

1. **Dependency updates**
   ```bash
   npm audit
   pnpm update
   # Weekly check
   ```

2. **Access logs**
   ```sql
   -- Monitor for unusual activity
   SELECT * FROM api_fetch_logs
   WHERE created_at > now() - interval '1 hour'
   ORDER BY response_code DESC;
   ```

3. **Database backups**
   - Railway auto-backs up daily
   - Also: Export weekly snapshot to S3
   - Cost: FREE (S3 lifecycle after 30 days)

4. **Secrets rotation**
   - JWT secret: Every 3 months
   - API keys: Every 6 months
   - Private key: Never (use multisig)

---

## SUMMARY TABLE

| Initiative | Effort | Risk | Impact | Timeline |
|-----------|--------|------|--------|----------|
| Credibility Scoring | 2 weeks | LOW | HIGH (core feature) | Week 1 |
| Prediction Markets | 3 weeks | MEDIUM | HIGH (monetization) | Week 2-4 |
| Auth Expansion | 1 week | LOW | MEDIUM (growth) | Week 4 |
| Mainnet Prep | 1 week | HIGH | CRITICAL | Week 5 |
| Card Sharing | 1 week | LOW | MEDIUM (virality) | Week 5 |
| **TOTAL** | **6 weeks** | **MEDIUM** | **HIGH** | **Feb-Mar** |

---

## RECOMMENDATION

**Ship in this order:**

1. **Weeks 1-3:** Get credibility scoring + prediction markets working (off-chain settlement)
2. **Week 4:** Add email auth
3. **Week 5:** Audit contracts, prepare for mainnet
4. **Week 6:** Soft launch to 100 beta users on testnet
5. **Week 7:** Mainnet deployment (if beta goes well)

**With 1 engineer, this is realistic.** Key is eliminating distractions:
- Freeze feature development during these 6 weeks
- No design changes
- No new pages
- Just these 5 features

**Staffing:** If you bring in a second engineer for weeks 5-6, you can parallelize contract audit + UI work, and launch mainnet Week 6 instead of Week 7.

---

## APPENDIX: Quick Reference

### Data Pipeline
- TwitterAPI.io for data collection ($150-300/month)
- Nitter for fallback (free)
- Cron jobs for daily updates
- Prediction extraction via Mistral NLP (~$50-100/month)

### Prediction Markets
- Off-chain settlement (cheaper, faster)
- On-chain only at scale (mainnet launch)
- Markets settle via historical data lookups
- Users claim payouts manually (automated at scale)

### Auth Expansion
- Use Privy (free up to 5K DAU)
- Handles email, Google, wallet
- Account linking included

### Mainnet
- Use Base (not Ethereum)
- Gas costs ~$0.01-0.05 per transaction
- Contract security: internal audit + slither
- Deployment: Week 5-6

### Scaling
- Current setup handles 10K users
- After 10K: Upgrade Railway tiers ($150/month)
- After 100K: Migrate to serverless or horizontal

### Security
- Fix JWT secret immediately (BLOCKER)
- Add multisig for mainnet
- Regular audits at scale
- Monitor API logs, database access

---

*End of Technical Strategy Memo*

**Next Steps:**
1. Review with team → identify any misalignments
2. Confirm you want to proceed with pivot
3. Lock this plan for 6 weeks
4. Start Week 1 Monday

Questions? I'm ready to dive deeper on any section.
