# Twitter API Setup (FREE Tier)

## Getting Your Free Twitter API Bearer Token

### Step 1: Apply for Twitter API Access

1. Go to https://developer.twitter.com/en/portal/dashboard
2. Sign in with your Twitter account
3. Click **"Sign up for Free Account"**
4. Fill out the application:
   - **Use case**: "Academic/Research" or "Making a bot"
   - **Description**: "Building a crypto influencer tracking platform for educational purposes"
   - Accept terms

### Step 2: Create a Project & App

1. Once approved, go to **Projects & Apps**
2. Click **"+ Create Project"**
3. Name it: `Foresight Metrics`
4. Select use case: **"Exploring the API"**
5. Create an App name: `foresight-scraper`

### Step 3: Get Your Bearer Token

1. After creating the app, you'll see **Keys and Tokens**
2. Under **"Bearer Token"**, click **"Generate"**
3. **COPY THIS TOKEN** - you can't see it again!
4. It looks like: `AAAAAAAAAAAAAAAAAAAAABcdefg1234567890...`

### Step 4: Add to Your .env

```bash
# Add this to your backend/.env file
TWITTER_BEARER_TOKEN=your_bearer_token_here
```

## Free Tier Limits

- **1,500 reads/month** = ~50 reads/day
- **Batch requests** (up to 100 users) count as **1 read**
- **Our strategy**: Update 50 influencers/day = 1 API call/day
- This leaves 49 calls for ad-hoc updates!

## Usage

```typescript
import twitterApiService from './services/twitterApiService';

// Update 50 influencers (uses 1 API call)
await twitterApiService.batchUpdateInfluencers(50);

// Check rate limit info
console.log(twitterApiService.getRateLimitInfo());
```

## Monitoring Your Usage

Check your usage at: https://developer.twitter.com/en/portal/dashboard

## Alternative if Twitter API Doesn't Work

If Twitter API approval takes too long:

1. **Manual updates**: Admin dashboard to manually input metrics
2. **LunarCrush API**: $100/month - crypto-specific, more reliable
3. **RapidAPI scrapers**: Various options $10-50/month

## Testing

```bash
# Run a test update
cd backend
NODE_OPTIONS='--import tsx' pnpm exec tsx src/scripts/testTwitterApi.ts
```
