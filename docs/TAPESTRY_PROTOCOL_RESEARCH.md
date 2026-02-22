# Tapestry Protocol - Comprehensive Research

> **Research Date:** February 22, 2026
> **Status:** Complete Overview with Integration Guide
> **Hackathon:** Solana Graveyard Hack ($5K Tapestry Bounty)

---

## EXECUTIVE SUMMARY

Tapestry Protocol is a **social graph protocol built on Solana** that enables developers to integrate social features into blockchain applications in minutes instead of months.

**Key Value:** Replaces 1,500-2,500 lines of custom code with 10-50 lines using the SDK.

**For Foresight:** We can use Tapestry to store player profiles, team formations, scores, and achievements onchain while building a composable social layer.

---

## SECTION 1: What is Tapestry Protocol?

### 1.1 Definition & Purpose

Tapestry is a **decentralized social graph infrastructure** that allows:
- Users to create composable, interoperable social identities
- Apps to access unified social data across Solana and bridged networks (Farcaster, Lens, Bluesky)
- Developers to integrate pre-built social features without building custom infrastructure

### 1.2 Core Philosophy

**Problem Solved:** Every app today rebuilds social features from scratch. Tapestry creates a single, shared social layer.

**Solution:**
- Off-chain social data (profiles, follows, content) stored in fast databases
- Merkle tree roots anchored on Solana L1 for verification
- Apps access via simple API, data remains composable across ecosystem

### 1.3 Key Metrics

- **208,000+** profiles indexed
- **65,000+** follow relationships
- **127,000+** content nodes
- **Sub-second latency** for queries
- **Supported chains:** Solana (primary), Ethereum (EVM), with Farcaster/Lens bridging

---

## SECTION 2: How Tapestry Works (Architecture)

### 2.1 Hybrid Storage Model

**Off-chain:** User profiles, follows, content, interactions live in optimized graph database
- ✓ Fast reads/writes (no blockchain overhead)
- ✓ Handles high-volume interactions
- ✓ Indexed for efficient queries

**On-chain:** Merkle tree roots stored on Solana L1
- ✓ Cryptographic verification possible
- ✓ Immutable proof of data integrity
- ✓ Decentralized anchor for validity

### 2.2 Data Flow

```
User Action → SocialFi SDK → Off-chain DB Update →
Merkle Tree Recalculation → Root Posted to Solana L1 →
Proof Available for Verification
```

### 2.3 Verification Mechanism

Any piece of social data can be verified:
- Get proof from Tapestry API
- Compare against on-chain Merkle root
- Proves data wasn't tampered with
- Results in cryptographic certainty

---

## SECTION 3: API Reference - Complete Endpoint List

### 3.1 Core API URL

```
Production: https://api.usetapestry.dev/api/v1/
Development: https://api.dev.usetapestry.dev/api/v1/
```

**Authentication:** All requests require `?apiKey=YOUR_API_KEY` query parameter

---

### 3.2 PROFILES - Create & Manage User Identities

#### Create or Fetch Profile
```
POST /profiles/findOrCreate
```
**Parameters:**
- `apiKey` - Your API key (query param)
- `username` - Unique username in your namespace
- `walletAddress` - Solana wallet address (recommended)
- `blockchain` - "SOLANA" (default) or "ETHEREUM"
- `bio` - Optional user bio
- `id` - Optional UUID (defaults to username)
- `execution` - Transaction speed:
  - `FAST_UNCONFIRMED` (~1s, optimistic)
  - `QUICK_SIGNATURE` (returns tx signature)
  - `CONFIRMED_AND_PARSED` (~15s, on-chain confirmed)

**SDK Usage (Recommended):**
```typescript
const client = new SocialFi({ baseURL: 'https://api.usetapestry.dev/api/v1' });
const result = await client.profiles.findOrCreateCreate(
  { apiKey: process.env.TAPESTRY_API_KEY },
  {
    username: "alice",
    walletAddress: "7xL8Qo2Bb8Uo9mK3Xx5Yy2Zz...",
    blockchain: "SOLANA",
    bio: "CT enthusiast",
    execution: "FAST_UNCONFIRMED"
  }
);
console.log(result.profile.id); // Profile ID for later use
```

#### Retrieve Profile
```
GET /profiles/{profileId}
```
**SDK Usage:**
```typescript
const profile = await client.profiles.profilesDetail({
  apiKey: process.env.TAPESTRY_API_KEY,
  id: profileId
});
```

#### Resolve Identity (Find All Profiles for Wallet)
```
GET /identities/{walletAddress}
```
**Purpose:** During onboarding, fetch all profiles user already owns

**SDK Usage:**
```typescript
const result = await client.identities.identitiesDetail({
  apiKey: process.env.TAPESTRY_API_KEY,
  id: walletAddress
});
// Returns array of profiles for that wallet
```

---

### 3.3 FOLLOWS - Build Social Graph

#### Create Follow Relationship
```
POST /followers
```
**Parameters:**
- `startId` - Follower profile ID or username
- `endId` - Followee profile ID or username

**SDK Usage:**
```typescript
await client.followers.followersCreate(
  { apiKey: process.env.TAPESTRY_API_KEY },
  {
    startId: "alice_profile_id",
    endId: "bob_profile_id"
  }
);
```

#### Get Followers List
```
GET /profiles/followers/{profileId}
GET /profiles/followers/{profileId}/count
```

#### Get Following List
```
GET /profiles/following/{profileId}
GET /profiles/following/{profileId}/count
```

#### Check Follow Status
```
GET /followers/check?startId=X&endId=Y
```
Returns: `{ isFollowing: true/false }`

#### Bulk Follow
```
POST /followers/bulk
```
Follow multiple users in one request

#### Unfollow
```
DELETE /followers
```
Remove follow relationship

---

### 3.4 CONTENT - Create Posts/Data

#### Create Content
```
POST /contents/create
```
**Parameters:**
- `profileId` - Owner of content
- `contentType` - "POST", "COMMENT", "ACHIEVEMENT", etc.
- `content` - Text content
- `properties` - Array of key-value metadata:
  ```typescript
  { key: "type", value: "draft_team" }
  { key: "contest_id", value: "123" }
  { key: "score", value: "95" }
  ```

**SDK Usage:**
```typescript
const result = await client.contents.findOrCreateCreate(
  { apiKey: process.env.TAPESTRY_API_KEY },
  {
    id: `foresight-team-${userId}-${contestId}`,
    profileId: tapestryProfileId,
    contentType: "ACHIEVEMENT",
    content: "Drafted S-Tier team",
    properties: [
      { key: "type", value: "draft_team" },
      { key: "app", value: "foresight" },
      { key: "contest_id", value: contestId },
      { key: "captain_id", value: captainId },
      { key: "budget_used", value: "150" },
      { key: "picks_json", value: JSON.stringify(picks) },
      { key: "created_at", value: Date.now() }
    ]
  }
);
```

#### Retrieve Content
```
GET /contents/{contentId}
GET /contents/profile/{profileId}
```

#### Update Content
```
PUT /contents/update
```

#### Delete Content
```
POST /contents/delete
```

---

### 3.5 LIKES - Track Engagement

#### Create Like
```
POST /likes
```
**Parameters:**
- `profileId` - User liking content
- `contentId` - Target content

#### Get Likes for Content
```
GET /likes/content/{contentId}
```

#### Get Likes by User
```
GET /likes/profile/{profileId}
```

#### Get Like Count
```
GET /likes/count/{contentId}
```

#### Check If User Liked
```
GET /likes/check?profileId=X&contentId=Y
```

#### Remove Like
```
DELETE /likes
```

---

### 3.6 COMMENTS - Discussion Layer

#### Create Comment
```
POST /comments
```
**Parameters:**
- `profileId` - Author
- `contentId` - Target content
- `comment` - Comment text

#### Get Comments for Content
```
GET /comments/content/{contentId}
```
Returns: Paginated comments with author info

#### Get Comments by User
```
GET /comments/profile/{profileId}
```

#### Update Comment
```
PUT /comments/{commentId}
```

#### Delete Comment
```
DELETE /comments/{commentId}
```

---

## SECTION 4: Integration Guide - How to Use in Foresight

### 4.1 Installation

```bash
npm install socialfi
# or
pnpm add socialfi
# or
yarn add socialfi
```

### 4.2 Setup (Backend)

**File:** `backend/src/services/tapestryService.ts` (ALREADY CREATED)

The project has a complete Tapestry service implementation. Current usage:

```typescript
import tapestryService from './services/tapestryService';

// During user auth/registration
const profile = await tapestryService.findOrCreateProfile(
  walletAddress,
  username
);

// Store a draft team
await tapestryService.storeTeam(profile.id, userId, {
  contestId: "contest-123",
  picks: [{ influencerId: "...", tier: "S", isCaptain: true, price: 40 }],
  totalBudgetUsed: 150,
  captainId: "influencer-1"
});

// Store a score
await tapestryService.storeScore(profile.id, userId, {
  contestId: "contest-123",
  totalScore: 245,
  rank: 3,
  breakdown: { activity: 50, engagement: 95, growth: 60, viral: 40 }
});
```

### 4.3 Best Practices for Foresight

#### Profile Creation (During Auth)
```typescript
// In auth flow when user connects wallet
const tapestryProfile = await tapestryService.findOrCreateProfile(
  userWalletAddress,
  userUsername // Could be Twitter handle
);

// Store profile ID in users table for reference
await db('users').update({
  tapestry_profile_id: tapestryProfile.id
});
```

#### Team Storage (After Draft)
```typescript
// After user finishes drafting team
await tapestryService.storeTeam(
  userTapestryProfileId,
  userId,
  teamData
);
// This makes team discoverable to other Tapestry apps
// And proves immutably on-chain what team was drafted
```

#### Score Updates (After Scoring)
```typescript
// After contest closes and scores finalized
await tapestryService.storeScore(
  userTapestryProfileId,
  userId,
  {
    contestId,
    totalScore: finalScore,
    rank: userRank,
    breakdown: scoreBreakdown
  }
);
// Enables leaderboards across Tapestry ecosystem
```

#### Social Features (Optional Enhancement)
```typescript
// Create follow relationship in Tapestry
// (Users can follow each other across Tapestry apps)
await client.followers.followersCreate(
  { apiKey },
  {
    startId: profileId1,
    endId: profileId2
  }
);

// Store achievement
await client.contents.findOrCreateCreate(
  { apiKey },
  {
    id: `achievement-${userId}-${achievementId}`,
    profileId: userTapestryProfileId,
    contentType: "ACHIEVEMENT",
    content: "Won Contest #5!",
    properties: [
      { key: "type", value: "achievement" },
      { key: "achievement_type", value: "contest_winner" },
      { key: "contest_id", value: "5" }
    ]
  }
);
```

### 4.4 Execution Methods Explained

**Choose based on use case:**

| Method | Latency | Best For |
|--------|---------|----------|
| `FAST_UNCONFIRMED` | ~1s | Real-time UI updates (draft, team creation) |
| `QUICK_SIGNATURE` | ~2-3s | Less critical operations, showing tx hash |
| `CONFIRMED_AND_PARSED` | ~15s | Final scores, achievements (need certainty) |

**Recommendation for Foresight:**
- Profile creation → `FAST_UNCONFIRMED`
- Team storage → `FAST_UNCONFIRMED`
- Score storage → `CONFIRMED_AND_PARSED` (important for bounty requirements)

---

## SECTION 5: Bounty Requirements (Solana Graveyard Hack)

### 5.1 Prize Structure

```
Total: $5,000
├─ 1st Place: $2,500
├─ 2nd Place: $1,500
└─ 3rd Place: $1,000
```

### 5.2 Submission Requirements

All winning entries must include:

1. **Working Demo/Prototype**
   - App runs without errors
   - Key features functional
   - Can demonstrate on stage

2. **Video Walkthrough** (max 3 minutes)
   - Show profile creation
   - Demonstrate social feature (team storage, scores)
   - Show content on Tapestry (teams/scores viewable)
   - Highlight onchain verification

3. **GitHub Repository**
   - Clean, readable code
   - README with setup instructions
   - Evidence of Tapestry integration
   - Commit history showing development

4. **Team Size:** 1-5 members

5. **Blockchain:** Must build on Solana

### 5.3 What Judges Look For

Based on typical Tapestry bounty criteria:

**Core Requirements:**
- Uses Tapestry SDK/API correctly
- Data properly stored onchain (Merkle proofs)
- Follows Tapestry namespace conventions

**Innovation Points:**
- Novel use of social graph
- Creative data structure (how you store teams/scores)
- Interoperability potential (could other Tapestry apps use your data?)

**Polish:**
- Smooth UX
- Error handling
- Production-ready code quality

**Narrative:**
- Clear story of why Tapestry matters for this app
- Demo shows composability benefits

---

## SECTION 6: What Makes Foresight Perfect for Tapestry Bounty

### 6.1 Alignment

Foresight uses Tapestry for exactly what it's designed for:
- **Player Profiles** → Tapestry profiles tied to wallets
- **Draft Teams** → Stored as Tapestry content (immutable, discoverable)
- **Contest Scores** → Stored as Tapestry content (proof of performance)
- **Potential Social Layer** → Players can follow each other, see achievements

### 6.2 Bounty Advantage

**Why judges will love this:**
1. **Real use case** - Not a toy app, addresses real fantasy sports needs
2. **Multiple Tapestry features** - Profiles, content, maybe follows
3. **Onchain value** - Scores/teams are verifiable achievements
4. **Composability** - Future Tapestry apps could show your tournament results
5. **Polish** - Professional design + working demo

### 6.3 Implementation Checklist for Judging

```
Demo Narrative: "From signup to leaderboard in 90 seconds"

During Demo:
☐ Sign up with wallet (Privy)
☐ Auto-create Tapestry profile
☐ Draft a team
  - Show confirmation: "Team stored on Tapestry"
  - Mention: "Immutable, discoverable, composable"
☐ View leaderboard
☐ Show score breakdown
  - Mention: "Score stored as Tapestry content"
☐ (Optional) Show Tapestry explorer proving your content is onchain

Video Script Points:
☐ "This is the first fantasy sports game built with Tapestry"
☐ "Each draft team is stored as immutable onchain content"
☐ "Scores are verifiable - judges/other apps can trust them"
☐ "Players own their data - it follows them across Tapestry apps"
```

---

## SECTION 7: API Key & Setup

### 7.1 Getting API Key

1. Visit: https://app.usetapestry.dev/
2. Create account
3. Get API key from dashboard
4. Set unique `namespace` (e.g., "foresight")
5. Add to `.env`:
   ```
   TAPESTRY_API_KEY=your_key_here
   ```

### 7.2 Environment Variables

```bash
# Required
TAPESTRY_API_KEY=sk_xxx...

# Optional (defaults to production)
TAPESTRY_BASE_URL=https://api.usetapestry.dev/api/v1
TAPESTRY_NAMESPACE=foresight
```

### 7.3 Current Project Status

**Already Implemented:**
- ✅ Backend service: `backend/src/services/tapestryService.ts`
- ✅ Profile creation during auth
- ✅ Team storage
- ✅ Score storage
- ✅ Identity resolution

**To Add for Bounty Demo:**
- Highlight Tapestry integration in UI
- Show confirmation messages when storing content
- (Optional) Create simple Tapestry explorer view showing stored data
- Video/narrative emphasizing onchain composability

---

## SECTION 8: Common Pitfalls & Solutions

### Issue #1: API Key Not Working
**Cause:** Wrong base URL, missing API key
**Solution:** Check `.env` is loaded, use correct URL (prod vs dev)

### Issue #2: Profile Creation Fails
**Cause:** Missing required fields, wallet already has profile
**Solution:** Use `findOrCreate` (not create), check wallet format

### Issue #3: Data Verification Fails
**Cause:** Wrong execution method, checking before confirmed
**Solution:** Use `CONFIRMED_AND_PARSED` for score storage, wait for confirmation

### Issue #4: Namespace Collision
**Cause:** Multiple apps using same username in namespace
**Solution:** Each app gets own namespace; usernames only unique within namespace

### Issue #5: High Latency
**Cause:** Using `CONFIRMED_AND_PARSED` for every operation
**Solution:** Only use confirmed method for important data (scores), fast for UX (drafts)

---

## SECTION 9: Competitive Context

### 9.1 Why Tapestry > Building Alone

**Time Saved:**
- Profiles: 200-300 lines → 10 lines
- Follows: 150-200 lines → 5 lines
- Content storage: 300-400 lines → 15 lines
- Total: 1,500-2,500 lines → ~50 lines

**Infrastructure Saved:**
- Don't build: Graph database, indexing, Merkle proofs
- Don't maintain: Data verification, blockchain interactions
- Don't scale: Handle millions of social operations

### 9.2 Comparable Protocols

**Farcaster Frames:** Web3 social content, less suited for game data
**Lens Protocol:** EVM-focused, more complex onboarding
**Bluesky ATP:** Just being built, limited tooling
**Tapestry:** Production-ready, Solana-native, developer-friendly

Tapestry is the clear choice for Solana hackathon entries.

---

## SECTION 10: Resources & Documentation

### Official Links
- **Main Site:** https://www.usetapestry.dev/
- **Documentation:** https://docs.usetapestry.dev/
- **Dashboard:** https://app.usetapestry.dev/
- **Explorer:** https://explorer.usetapestry.dev/ (view onchain content)
- **NPM Package:** `socialfi` (https://www.npmjs.com/package/socialfi)

### Key Documentation Sections
- **What is Tapestry** - https://docs.usetapestry.dev/documentation/what-is-tapestry
- **How It Works** - https://docs.usetapestry.dev/documentation/how-it-works
- **Profiles** - https://docs.usetapestry.dev/documentation/profile
- **Follows** - https://docs.usetapestry.dev/documentation/follows
- **Content** - https://docs.usetapestry.dev/documentation/content
- **Likes** - https://docs.usetapestry.dev/documentation/likes
- **Comments** - https://docs.usetapestry.dev/documentation/comments
- **Find All Profiles** - https://docs.usetapestry.dev/documentation/findall

### Foresight Integration Files
- **Service:** `/Users/mujeeb/foresight/backend/src/services/tapestryService.ts`
- **Utils:** `/Users/mujeeb/foresight/backend/src/utils/privy.ts` (auth integration)
- **Migrations:** `/Users/mujeeb/foresight/backend/migrations/20260221000001_add_privy_tapestry_fields.ts`

---

## NEXT STEPS FOR TEAM

1. **Review this document** with full team
2. **Check API key status** - Ensure TAPESTRY_API_KEY is set in `.env`
3. **Test the service** - Try profile creation in development
4. **Plan demo narrative** - How to show Tapestry integration best
5. **Add UI messaging** - Show users "Team stored on Tapestry" confirmations
6. **Record video** - 3-min walkthrough for submission
7. **Push to GitHub** - Clean commit history showing Tapestry usage
8. **Submit** - Include video + repo link + live demo link

---

**Last Updated:** February 22, 2026
**Research Depth:** Complete (all API endpoints, integration guide, bounty strategy)
