# Real-Time Data Implementation Guide

## Overview

This document explains the complete implementation of real-time Twitter metrics tracking for crypto influencers in your fantasy league platform.

## 🎯 Solution: Twitter API Free Tier (Budget-Friendly)

### Why This Approach?

After evaluating multiple options:

| Option | Cost | Reliability | Verdict |
|--------|------|-------------|---------|
| **Twitter API Free Tier** | FREE | ⭐⭐⭐⭐⭐ | ✅ **CHOSEN** |
| Nitter Scraping | FREE | ⭐⭐ | ❌ Unreliable (instances often down) |
| LunarCrush API | $100-300/mo | ⭐⭐⭐⭐⭐ | 💰 Save for later |
| Apify Scrapers | $50/mo | ⭐⭐⭐⭐ | 💰 Save for later |
| Browserbase | $50+/mo | ⭐⭐⭐ | ❌ Too complex |

### The Magic: Batch Requests

**Key Insight**: Twitter API's batch request feature lets you fetch 100 users with just 1 API call!

```
Free Tier: 1,500 reads/month = ~50 reads/day
Batch Request: 100 users = 1 read
Strategy: Update 50 influencers/day = 1 API call/day
Result: 49 calls left for ad-hoc updates! 🎉
```

## 📁 What Was Built

### 1. Database Schema

**Table: `influencer_metrics`**
Stores historical snapshots of influencer metrics for trend analysis.

```sql
CREATE TABLE influencer_metrics (
  id SERIAL PRIMARY KEY,
  influencer_id INT NOT NULL,
  follower_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  tweet_count INT DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  likes_count INT DEFAULT 0,
  retweets_count INT DEFAULT 0,
  replies_count INT DEFAULT 0,
  scraped_at TIMESTAMP DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'twitter_api',
  FOREIGN KEY (influencer_id) REFERENCES influencers(id)
);
```

**Migration file**: `/migrations/20251123_create_influencer_metrics_history.ts`

### 2. Services

#### **A. Twitter API Service** (`/services/twitterApiService.ts`)

Core features:
- ✅ Batch requests (100 users per call)
- ✅ Automatic rate limit management
- ✅ Efficient data storage
- ✅ Historical tracking

Key methods:
```typescript
// Update single influencer
await twitterApiService.updateInfluencerMetrics(id, 'VitalikButerin');

// Batch update (EFFICIENT!)
await twitterApiService.batchUpdateInfluencers(50); // Uses 1 API call

// Check configuration
twitterApiService.isConfigured(); // true if TWITTER_BEARER_TOKEN set

// Get usage info
console.log(twitterApiService.getRateLimitInfo());
```

#### **B. Nitter Scraper** (`/services/nitterScraper.ts`)

Backup scraping service for when Twitter API isn't available:
- Multi-instance rotation
- Parses HTML with Cheerio
- Fallback option (currently unreliable)

#### **C. Cron Jobs** (`/services/cronJobs.ts`)

Automated daily updates:
```
✅ Daily at 4 AM UTC: Update 50 influencers
✅ Uses 1 API call per day
✅ Skips if TWITTER_BEARER_TOKEN not set
```

### 3. API Endpoints

All endpoints require authentication.

#### **POST** `/api/admin/update-metrics`
Manually trigger metrics update

```bash
curl -X POST http://localhost:3001/api/admin/update-metrics \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"limit": 50}'
```

#### **GET** `/api/admin/metrics-status`
Check Twitter API configuration and usage

```bash
curl http://localhost:3001/api/admin/metrics-status \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

Response:
```json
{
  "success": true,
  "status": {
    "apiConfigured": true,
    "rateLimitInfo": "...",
    "lastUpdate": "2025-01-23T04:00:00.000Z",
    "totalInfluencers": 50,
    "metricsLast24h": 50
  }
}
```

#### **GET** `/api/admin/influencer-metrics/:id?days=30`
Get metrics history for an influencer

```bash
curl "http://localhost:3001/api/admin/influencer-metrics/1?days=30" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

## 🚀 Setup Instructions

### Step 1: Get Twitter API Access (FREE)

See detailed instructions in: `TWITTER_API_SETUP.md`

Quick steps:
1. Go to https://developer.twitter.com
2. Sign up for **Free Account**
3. Create a project + app
4. Generate **Bearer Token**
5. Copy the token (you'll only see it once!)

### Step 2: Add to .env

```bash
# Add this to backend/.env
TWITTER_BEARER_TOKEN=AAAAAAAAAAAAAAAAAAAAABcdefg1234567890...
```

### Step 3: Run Migration

```bash
cd backend
NODE_OPTIONS='--import tsx' npx knex migrate:latest
```

### Step 4: Test It!

```bash
# Test with 3 influencers
NODE_OPTIONS='--import tsx' pnpm exec tsx src/scripts/testTwitterApi.ts
```

### Step 5: Start Server

```bash
cd backend
pnpm dev
```

The cron job will automatically run daily at 4 AM UTC!

## 📊 Monitoring

### Check Status via API

```bash
# Get metrics status
curl http://localhost:3001/api/admin/metrics-status \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Check Twitter API Usage

Visit: https://developer.twitter.com/en/portal/dashboard

## 🔄 How It Works

### Daily Automated Update (4 AM UTC)

```
1. Cron job triggers at 4 AM UTC
2. Fetches 50 oldest-updated influencers
3. Batch request to Twitter API (1 API call!)
4. Stores data in:
   - influencer_metrics (history)
   - influencers table (current data)
5. Updates last_scraped_at timestamp
```

### Data Flow

```
Twitter API
    ↓ (batch request - 100 users/call)
twitterApiService
    ↓
Database
    ├─ influencer_metrics (historical snapshots)
    └─ influencers (current metrics)
    ↓
API Endpoints
    ↓
Frontend (coming soon!)
```

## 📈 Scaling Strategy

### Current: Free Tier (Phase 1)
- ✅ 50 influencers/day updates
- ✅ 1 API call/day
- ✅ $0/month

### Growth: Paid APIs (Phase 2)
When you have users/revenue:
- **LunarCrush API** ($100-300/month)
  - Crypto-specific metrics
  - More frequent updates
  - Historical data included
- **Twitter API Basic** ($100/month)
  - 10,000 tweets/month
  - Better rate limits

### Enterprise: Multiple Sources (Phase 3)
- Twitter API + LunarCrush + Custom scrapers
- Real-time WebSocket updates
- Advanced analytics

## 🐛 Troubleshooting

### "Twitter API not configured" Error

```bash
# Check if token is set
echo $TWITTER_BEARER_TOKEN

# If empty, add to .env:
TWITTER_BEARER_TOKEN=your_token_here
```

### Rate Limit Exceeded

You're using >50 calls/day. Solutions:
1. Reduce update frequency
2. Update fewer influencers
3. Upgrade to Twitter API Basic ($100/mo)

### Metrics Not Updating

```bash
# Check cron job status
curl http://localhost:3001/api/admin/cron-status \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"

# Manually trigger update
curl -X POST http://localhost:3001/api/admin/update-metrics \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Database Errors

```bash
# Check if migration ran
psql postgresql://localhost:5432/foresight -c "\d influencer_metrics"

# If not, run migration:
NODE_OPTIONS='--import tsx' npx knex migrate:latest
```

## 📝 Next Steps

1. ✅ **Done**: Database schema
2. ✅ **Done**: Twitter API service
3. ✅ **Done**: Cron jobs
4. ✅ **Done**: API endpoints
5. 🔄 **TODO**: Frontend dashboard to view metrics
6. 🔄 **TODO**: Charts for follower growth
7. 🔄 **TODO**: Engagement rate trending
8. 💰 **Future**: Upgrade to LunarCrush when revenue allows

## 🎓 Key Learnings

1. **Batch requests are game-changers** - 100 users = 1 API call
2. **Twitter Free Tier is powerful** - When used strategically
3. **Nitter is unreliable** - Many instances are down/rate-limited
4. **Historical data is valuable** - Store snapshots for trend analysis
5. **Start free, scale later** - Don't pay until you have users

## 💡 Pro Tips

- **Update at off-peak hours** (4 AM UTC) to avoid rate limits
- **Store historical data** for charts and analytics
- **Monitor API usage** via Twitter Developer Portal
- **Have fallback ready** (Nitter scraper as backup)
- **Upgrade path clear** (LunarCrush when revenue allows)

## 🆘 Support

- Twitter API Docs: https://developer.twitter.com/en/docs
- Rate Limits: https://developer.twitter.com/en/docs/twitter-api/rate-limits
- LunarCrush (future): https://lunarcrush.com/developers/api

---

**Budget**: $0/month
**Reliability**: ⭐⭐⭐⭐⭐
**Scalability**: ✅ Clear upgrade path

You're all set! 🚀
