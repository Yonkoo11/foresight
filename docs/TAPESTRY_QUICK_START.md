# Tapestry Protocol - Quick Start Guide

> **For Developers Building Foresight**
> **Copy-paste ready code snippets**

---

## TL;DR

Tapestry stores social data (profiles, teams, scores) onchain. We use it to:
1. Create player profiles linked to wallets
2. Store draft teams as immutable content
3. Store contest scores as verifiable achievements

---

## 1. Installation

```bash
npm install socialfi
# or
pnpm add socialfi
```

---

## 2. Initialize Client

```typescript
import { SocialFi } from 'socialfi';

const client = new SocialFi({
  baseURL: 'https://api.usetapestry.dev/api/v1'
});

const API_KEY = process.env.TAPESTRY_API_KEY;
const NAMESPACE = 'foresight'; // Your app's namespace
```

---

## 3. Create/Get User Profile

**When user signs up:**
```typescript
const result = await client.profiles.findOrCreateCreate(
  { apiKey: API_KEY },
  {
    username: 'alice_twitter', // or unique identifier
    walletAddress: '7xL8Qo2Bb8Uo9mK3Xx5Yy2Zz...', // from Privy
    blockchain: 'SOLANA',
    bio: 'CT Draft Master',
    execution: 'FAST_UNCONFIRMED' // Quick for UX
  }
);

const profileId = result.profile.id;
// Save to: users.tapestry_profile_id
```

---

## 4. Store Draft Team

**After user finalizes team:**
```typescript
const teamData = {
  contestId: 'contest-123',
  picks: [
    { influencerId: 'raydium_dev', tier: 'S', isCaptain: true, price: 40 },
    { influencerId: 'solana_matt', tier: 'A', isCaptain: false, price: 35 },
    // ... 3 more picks
  ],
  totalBudgetUsed: 150,
  captainId: 'raydium_dev'
};

const result = await client.contents.findOrCreateCreate(
  { apiKey: API_KEY },
  {
    id: `foresight-team-${userId}-${contestId}`,
    profileId: userTapestryProfileId,
    contentType: 'ACHIEVEMENT',
    properties: [
      { key: 'type', value: 'draft_team' },
      { key: 'app', value: 'foresight' },
      { key: 'contest_id', value: teamData.contestId },
      { key: 'captain_id', value: teamData.captainId },
      { key: 'budget_used', value: String(teamData.totalBudgetUsed) },
      { key: 'picks_json', value: JSON.stringify(teamData.picks) },
      { key: 'created_at', value: String(Date.now()) }
    ]
  }
);

// Confirmation: Team is now stored on Tapestry!
console.log('Team stored:', result.id);
```

---

## 5. Store Contest Score

**After contest ends and scores are final:**
```typescript
const scoreData = {
  contestId: 'contest-123',
  totalScore: 245,
  rank: 3,
  breakdown: {
    activity: 50,      // 0-35
    engagement: 95,    // 0-60
    growth: 60,        // 0-40
    viral: 40          // 0-25
  }
};

try {
  // Try to update first
  await client.contents.contentsUpdate(
    { apiKey: API_KEY, id: `foresight-score-${userId}-${contestId}` },
    {
      properties: [
        { key: 'total_score', value: String(scoreData.totalScore) },
        { key: 'rank', value: String(scoreData.rank) },
        { key: 'activity_score', value: String(scoreData.breakdown.activity) },
        { key: 'engagement_score', value: String(scoreData.breakdown.engagement) },
        { key: 'growth_score', value: String(scoreData.breakdown.growth) },
        { key: 'viral_score', value: String(scoreData.breakdown.viral) },
        { key: 'updated_at', value: String(Date.now()) }
      ]
    }
  );
} catch (err) {
  // Content doesn't exist, create it
  await client.contents.findOrCreateCreate(
    { apiKey: API_KEY },
    {
      id: `foresight-score-${userId}-${contestId}`,
      profileId: userTapestryProfileId,
      contentType: 'ACHIEVEMENT',
      properties: [
        { key: 'type', value: 'contest_score' },
        { key: 'app', value: 'foresight' },
        { key: 'contest_id', value: scoreData.contestId },
        { key: 'total_score', value: String(scoreData.totalScore) },
        { key: 'rank', value: String(scoreData.rank) },
        { key: 'activity_score', value: String(scoreData.breakdown.activity) },
        { key: 'engagement_score', value: String(scoreData.breakdown.engagement) },
        { key: 'growth_score', value: String(scoreData.breakdown.growth) },
        { key: 'viral_score', value: String(scoreData.breakdown.viral) },
        { key: 'created_at', value: String(Date.now()) }
      ]
    }
  );
}

console.log('Score stored on Tapestry!');
```

---

## 6. Optional: Make Users Followers

**Enable players to follow each other:**
```typescript
await client.followers.followersCreate(
  { apiKey: API_KEY },
  {
    startId: profileId1, // Following
    endId: profileId2    // Followed
  }
);

// Get follower count
const count = await client.followers.followersDetail({
  apiKey: API_KEY,
  id: profileId // followers count
});
```

---

## 7. Retrieve Data from Tapestry

**Get user's stored teams/scores:**
```typescript
// Get all content by profile
const content = await client.contents.contentsByProfileList({
  apiKey: API_KEY,
  profileId: userTapestryProfileId
});

// Filter for teams
const teams = content.filter(c =>
  c.properties.find(p => p.key === 'type' && p.value === 'draft_team')
);

// Filter for scores
const scores = content.filter(c =>
  c.properties.find(p => p.key === 'type' && p.value === 'contest_score')
);
```

---

## 8. Error Handling

```typescript
async function storeTeamWithRetry(profileId, userId, teamData) {
  try {
    const result = await client.contents.findOrCreateCreate(
      { apiKey: API_KEY },
      {
        id: `foresight-team-${userId}-${teamData.contestId}`,
        profileId,
        contentType: 'ACHIEVEMENT',
        properties: [/* ... */]
      }
    );

    return { success: true, contentId: result.id };
  } catch (error) {
    console.error('[Tapestry] Failed to store team:', error);
    // Fallback: Still save to local DB, retry later
    // Don't block user experience
    return { success: false, error: error.message };
  }
}
```

---

## 9. Environment Setup

**.env.local** (development):
```
TAPESTRY_API_KEY=sk_dev_...
TAPESTRY_BASE_URL=https://api.dev.usetapestry.dev/api/v1
```

**.env.production**:
```
TAPESTRY_API_KEY=sk_prod_...
TAPESTRY_BASE_URL=https://api.usetapestry.dev/api/v1
```

---

## 10. Key Methods Reference

| Operation | Method | Purpose |
|-----------|--------|---------|
| Create profile | `profiles.findOrCreateCreate()` | Get/create player profile |
| Get profile | `profiles.profilesDetail()` | Fetch profile by ID |
| Find profiles for wallet | `identities.identitiesDetail()` | Resolve wallet to profiles |
| Create team/score | `contents.findOrCreateCreate()` | Store immutable content |
| Update score | `contents.contentsUpdate()` | Update existing content |
| Delete content | `contents.contentsDelete()` | Remove content |
| Get content | `contents.contentsByProfileList()` | List all player content |
| Create follow | `followers.followersCreate()` | One user follows another |
| Get followers | `followers.followersDetail()` | List followers/following |
| Check follow | `followers.followersDetail()` | Check if user follows |
| Create like | `likes.likesCreate()` | User likes content |
| Get likes | `likes.likesByContentDetail()` | List likes on content |
| Create comment | `comments.commentsCreate()` | Add comment |
| Get comments | `comments.commentsByContentList()` | List comments |

---

## 11. Execution Methods

**Choose execution speed based on use case:**

```typescript
// FAST_UNCONFIRMED (~1s)
// Use for: Draft creation, profile updates, UI interactions
// Don't use for: Final scores (not yet on-chain)
execution: 'FAST_UNCONFIRMED'

// QUICK_SIGNATURE (~2-3s)
// Use for: Less critical updates
// Returns: Transaction signature
execution: 'QUICK_SIGNATURE'

// CONFIRMED_AND_PARSED (~15s)
// Use for: Important data (final scores, achievements)
// Don't use for: Every operation (too slow)
execution: 'CONFIRMED_AND_PARSED'
```

---

## 12. Debugging

**Verify content was stored:**

1. Check Tapestry Explorer: https://explorer.usetapestry.dev/
2. Search by profile ID or content ID
3. See properties and onchain Merkle root

**Common issues:**

| Issue | Fix |
|-------|-----|
| 401 Unauthorized | Check `TAPESTRY_API_KEY` in `.env` |
| 400 Bad Request | Validate all required fields (profileId, contentType) |
| Content not found | Check namespace matches, content ID is correct |
| Slow operations | Use `FAST_UNCONFIRMED` instead of `CONFIRMED_AND_PARSED` |

---

## 13. For Demo/Hackathon

**Show in walkthrough:**
```typescript
// 1. Create profile
"Creating your player profile on Tapestry..."
const profile = await createProfile(walletAddress);

// 2. Draft team
"Team saved to Tapestry - immutable and verifiable"
await storeTeam(profile.id, teamData);

// 3. View score
"Your score is stored onchain - other apps can verify it"
const scores = await retrieveScores(profile.id);
```

**Mention to judges:**
- "Profile is linked to wallet - works across Tapestry apps"
- "Team is stored as immutable content - can't be faked"
- "Score is verifiable - Merkle proof available onchain"
- "This data follows the player, enabling social composability"

---

## Resources

- **Full Docs:** https://docs.usetapestry.dev/
- **Dashboard:** https://app.usetapestry.dev/
- **Explorer:** https://explorer.usetapestry.dev/
- **Foresight Service:** `/Users/mujeeb/foresight/backend/src/services/tapestryService.ts`

---

**Last Updated:** February 22, 2026
