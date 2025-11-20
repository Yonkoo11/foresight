# Timecaster Backend

Backend API for the Timecaster CT Draft fantasy league platform - a Web3 fantasy sports game where players draft teams of Crypto Twitter influencers and compete based on real-time engagement metrics.

## Features

- **CT Draft API**: Create and manage fantasy teams of CT influencers
- **Real-time Scoring**: Automated daily scoring based on Twitter metrics
- **WebSocket Updates**: Live leaderboard and score updates
- **PostgreSQL Database**: Robust data persistence with pg connection pool
- **Automated Tasks**: Cron jobs for Twitter scraping, scoring, and cleanup
- **Rate Limiting**: Protection against API abuse
- **JWT Authentication**: Secure wallet-based authentication
- **RESTful API**: Clean, documented endpoints

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.21.2
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **WebSocket**: Socket.io 4.8.1
- **Task Scheduler**: node-cron
- **Authentication**: JWT (jsonwebtoken)
- **Security**: helmet, cors, express-rate-limit

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm
- **PostgreSQL** 15.x

### Installing PostgreSQL (macOS)

```bash
# Install via Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb timecaster
```

## Installation

1. **Clone the repository** (if not already done):
```bash
cd /path/to/timecaster/backend
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
```bash
cp .env.example .env
```

Edit `.env` and configure the following:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://localhost:5432/timecaster

# JWT Secret (generate your own random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Base Network
RPC_URL=https://sepolia.base.org
CHAIN_ID=84532

# Contract Addresses
CT_DRAFT_ADDRESS=0xYourDeployedContractAddress

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Twitter API (optional - can use mock data)
TWITTER_BEARER_TOKEN=
```

4. **Initialize the database**:
```bash
# Run database schema creation
pnpm exec tsx src/scripts/initDb.ts

# Seed influencers
pnpm exec tsx src/scripts/seedInfluencers.ts
```

This will:
- Create all necessary tables (users, influencers, teams, etc.)
- Seed 50 CT influencers across tiers (S, A, B, C)

## Running the Server

### Development Mode

```bash
pnpm dev
```

Server will start on `http://localhost:3001` with hot reloading.

### Production Mode

```bash
pnpm build
pnpm start
```

## API Endpoints

### Health & Status

#### `GET /health`
Check server health and WebSocket status.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-01-16T12:00:00.000Z",
  "uptime": 3600,
  "websocket": {
    "connected": 5
  }
}
```

#### `GET /api/admin/cron-status`
View status of all cron jobs.

**Response**:
```json
{
  "jobs": [
    {
      "name": "Twitter Scraper",
      "schedule": "Every 15 minutes",
      "cron": "*/15 * * * *",
      "status": "active"
    },
    {
      "name": "Draft Scoring",
      "schedule": "Daily at 00:00 UTC",
      "cron": "0 0 * * *",
      "status": "active"
    }
  ]
}
```

### Authentication

#### `POST /api/auth/nonce`
Generate authentication nonce for wallet signature.

**Request**:
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response**:
```json
{
  "nonce": "Sign this message to authenticate: 123456"
}
```

#### `POST /api/auth/verify`
Verify wallet signature and get JWT token.

**Request**:
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x..."
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "username": null,
    "reputation_score": 0
  }
}
```

### Users

#### `GET /api/users/me`
Get current user profile (requires authentication).

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "username": "cryptomaster",
  "reputation_score": 1250,
  "total_predictions": 42,
  "correct_predictions": 28,
  "created_at": "2025-01-10T12:00:00.000Z"
}
```

#### `PUT /api/users/me`
Update user profile.

**Request**:
```json
{
  "username": "newusername"
}
```

### CT Draft

#### `GET /api/draft/influencers`
Get all available influencers for drafting.

**Query Parameters**:
- `tier` (optional): Filter by tier (S, A, B, C)
- `limit` (optional): Limit results (default: 50)

**Response**:
```json
{
  "influencers": [
    {
      "id": 1,
      "name": "Vitalik Buterin",
      "handle": "VitalikButerin",
      "tier": "S",
      "base_price": 30,
      "follower_count": 5200000,
      "category": "Developer",
      "avatar_url": "https://..."
    }
  ]
}
```

#### `POST /api/draft/team`
Submit a new draft team.

**Request**:
```json
{
  "teamName": "My Dream Team",
  "influencerIds": [1, 5, 12, 23, 45],
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "leagueType": "free"
}
```

**Response**:
```json
{
  "success": true,
  "teamId": 123,
  "message": "Team created successfully"
}
```

#### `GET /api/draft/team/:walletAddress`
Get user's current team.

**Response**:
```json
{
  "team": {
    "id": 123,
    "teamName": "My Dream Team",
    "influencerIds": [1, 5, 12, 23, 45],
    "totalScore": 1850,
    "rank": 5,
    "createdAt": "2025-01-15T08:00:00.000Z"
  }
}
```

#### `GET /api/draft/leaderboard`
Get draft leaderboard rankings.

**Query Parameters**:
- `limit` (optional): Number of teams (default: 10)
- `offset` (optional): Pagination offset (default: 0)

**Response**:
```json
{
  "teams": [
    {
      "rank": 1,
      "team_name": "CT Champions",
      "wallet_address": "0x...",
      "total_score": 2450,
      "influencer_ids": [1, 2, 3, 4, 5]
    }
  ],
  "total": 156
}
```

### Admin Endpoints

#### `POST /api/admin/run-scoring`
Manually trigger scoring cycle (for testing).

**Response**:
```json
{
  "success": true,
  "message": "Scoring cycle completed successfully"
}
```

## Database Schema

### Tables

#### `users`
- `wallet_address` (VARCHAR, PRIMARY KEY)
- `username` (VARCHAR, UNIQUE)
- `reputation_score` (INTEGER)
- `total_predictions` (INTEGER)
- `correct_predictions` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `influencers`
- `id` (SERIAL, PRIMARY KEY)
- `name` (VARCHAR)
- `handle` (VARCHAR, UNIQUE)
- `tier` (VARCHAR) - S, A, B, C
- `base_price` (INTEGER) - Draft cost
- `follower_count` (BIGINT)
- `category` (VARCHAR)
- `avatar_url` (TEXT)
- `bio` (TEXT)
- `created_at` (TIMESTAMP)

#### `ct_draft_teams`
- `id` (SERIAL, PRIMARY KEY)
- `wallet_address` (VARCHAR)
- `team_name` (VARCHAR)
- `influencer_ids` (INTEGER[])
- `total_score` (INTEGER)
- `rank` (INTEGER)
- `league_type` (VARCHAR) - free or prize
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Automated Tasks (Cron Jobs)

The backend runs several automated tasks:

### Active Cron Jobs

1. **Twitter Scraper** - `*/15 * * * *` (Every 15 minutes)
   - Updates influencer follower counts
   - Fetches recent tweets and engagement metrics
   - Requires `TWITTER_BEARER_TOKEN` in `.env`
   - Falls back gracefully if API key not configured

2. **Draft Scoring** - `0 0 * * *` (Daily at midnight UTC)
   - Calculates team scores using formula:
     ```
     score = base_price + (follower_count / 1000000) * 10
     ```
   - Updates team rankings
   - Emits WebSocket events for live updates

3. **Database Cleanup** - `0 3 * * *` (Daily at 3 AM UTC)
   - Removes expired authentication sessions
   - Keeps database optimized

### Disabled Cron Jobs

- **Oracle Keeper**: For Arena/Gauntlet game modes (not yet implemented)
- **Leaderboard Updates**: For other game modes (not yet implemented)

## Scoring System

### Draft Scoring Formula

Each influencer's daily score is calculated as:

```typescript
score = base_price + (follower_count / 1000000) * 10
```

**Example**:
- Influencer with base_price 30 and 5.2M followers:
  - `30 + (5200000 / 1000000) * 10 = 30 + 52 = 82 points`

Team total score is the sum of all 5 influencers' scores.

### Scoring Cycle

1. Fetch all teams from database
2. For each team, get their 5 influencers
3. Calculate each influencer's score
4. Sum to get team total score
5. Update `ct_draft_teams.total_score`
6. Rank teams by score (highest first)
7. Update `ct_draft_teams.rank`
8. Emit WebSocket event: `draft_scores_updated`

## WebSocket Events

The server emits real-time events via Socket.io:

### Server → Client Events

- `draft_scores_updated`: Scores have been recalculated
- `leaderboard_updated`: Leaderboard rankings changed
- `new_team_created`: A new team was drafted

### Client → Server Events

- `join_room`: Join a specific game mode room
- `subscribe_leaderboard`: Subscribe to leaderboard updates

## Testing

### Manual Testing

1. **Health Check**:
```bash
curl http://localhost:3001/health
```

2. **Get Influencers**:
```bash
curl http://localhost:3001/api/draft/influencers
```

3. **Submit Team**:
```bash
curl -X POST http://localhost:3001/api/draft/team \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "Test Team",
    "influencerIds": [1, 2, 3, 4, 5],
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "leagueType": "free"
  }'
```

4. **Trigger Scoring**:
```bash
curl -X POST http://localhost:3001/api/admin/run-scoring
```

5. **Check Leaderboard**:
```bash
curl http://localhost:3001/api/draft/leaderboard
```

## Project Structure

```
backend/
├── src/
│   ├── api/              # Route handlers
│   │   ├── auth.ts       # Authentication endpoints
│   │   ├── users.ts      # User profile endpoints
│   │   ├── draft.ts      # CT Draft endpoints
│   │   ├── arena.ts      # Arena mode (future)
│   │   ├── gauntlet.ts   # Gauntlet mode (future)
│   │   └── whisperer.ts  # Whisperer mode (future)
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # JWT authentication
│   │   ├── rateLimiter.ts # Rate limiting
│   │   └── errorHandler.ts # Error handling
│   ├── services/         # Business logic
│   │   ├── twitterScraper.ts # Twitter API integration
│   │   ├── draftScoring.ts   # Scoring calculations
│   │   ├── cronJobs.ts       # Task scheduling
│   │   ├── websocket.ts      # WebSocket server
│   │   └── oracleKeeper.ts   # Oracle resolution (future)
│   ├── scripts/          # Utility scripts
│   │   ├── initDb.ts     # Database initialization
│   │   └── seedInfluencers.ts # Data seeding
│   ├── utils/            # Helper functions
│   │   └── db.ts         # PostgreSQL connection pool
│   ├── server.ts         # Express server setup
│   └── index.ts          # Application entry point
├── package.json
├── tsconfig.json
└── .env
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3001 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `JWT_SECRET` | Yes | - | Secret key for JWT signing |
| `RPC_URL` | Yes | - | Base network RPC endpoint |
| `CHAIN_ID` | Yes | - | Base network chain ID |
| `CT_DRAFT_ADDRESS` | Yes | - | Deployed CT Draft contract address |
| `FRONTEND_URL` | Yes | - | Frontend URL for CORS |
| `TWITTER_BEARER_TOKEN` | No | - | Twitter API v2 bearer token (optional) |

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL
brew services restart postgresql@15

# Verify database exists
psql -l | grep timecaster
```

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Cron Jobs Not Running

Check server logs for cron job initialization:
```
========================================
Initializing Cron Jobs
========================================

✅ Twitter Scraper: Every 15 minutes
✅ Draft Scoring: Daily at 00:00 UTC
✅ Database Cleanup: Daily at 03:00 UTC
```

### Twitter API Errors

If you don't have a Twitter API key:
- The scraper will log warnings but won't crash
- Influencer data will use static follower counts
- Scoring will still work with existing data

To enable Twitter scraping:
1. Get Twitter API v2 access at https://developer.twitter.com
2. Generate a Bearer Token
3. Add `TWITTER_BEARER_TOKEN` to `.env`

## Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate secure `JWT_SECRET`
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Configure PostgreSQL with SSL
- [ ] Set up database backups
- [ ] Enable HTTPS/SSL
- [ ] Configure rate limiting for production traffic
- [ ] Set up monitoring and logging
- [ ] Deploy to Railway/Heroku/AWS

### Recommended Services

- **Hosting**: Railway, Render, Heroku
- **Database**: Railway PostgreSQL, Supabase, AWS RDS
- **Monitoring**: Sentry, LogRocket

## Contributing

1. Ensure TypeScript compilation passes: `pnpm build`
2. Follow existing code style
3. Add types for all new functions
4. Test API endpoints manually
5. Update this README if adding new features

## License

MIT
