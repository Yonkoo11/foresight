# Tapestry Protocol - Complete API Endpoint Reference

> **Base URL:** `https://api.usetapestry.dev/api/v1`
> **Auth:** All requests require `apiKey` parameter
> **Format:** REST API returning JSON

---

## PROFILES API

### Create or Get Profile

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| POST | `/profiles/findOrCreate` | `profiles.findOrCreateCreate()` | Create user profile or return existing |

**Parameters:**
```typescript
{
  apiKey: string,                              // Required
  username: string,                            // Required, unique per namespace
  walletAddress: string,                       // Optional but recommended
  blockchain: "SOLANA" | "ETHEREUM",           // Optional, default SOLANA
  bio?: string,                                // Optional biography
  id?: string,                                 // Optional UUID
  execution?: "FAST_UNCONFIRMED" | "QUICK_SIGNATURE" | "CONFIRMED_AND_PARSED"
}
```

**Response:**
```typescript
{
  profile: {
    id: string,
    username: string,
    bio?: string,
    image?: string,
    namespace: string
  },
  walletAddress: string
}
```

---

### Get Profile Details

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/profiles/{profileId}` | `profiles.profilesDetail()` | Retrieve profile by ID |

**Parameters:**
```typescript
{
  apiKey: string,
  id: string  // Profile ID
}
```

---

## IDENTITY API

### Resolve Wallet to Profiles

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/identities/{walletAddress}` | `identities.identitiesDetail()` | Get all profiles for a wallet |

**Parameters:**
```typescript
{
  apiKey: string,
  id: string  // Wallet address
}
```

**Response:**
```typescript
{
  identities: Array<{
    wallet?: { address: string },
    profiles: Array<{ profile: ProfileObject }>
  }>
}
```

**Use Case:** During onboarding - "Find all your existing profiles"

---

## FOLLOWERS/FOLLOWS API

### Create Follow

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| POST | `/followers` | `followers.followersCreate()` | One user follows another |

**Parameters:**
```typescript
{
  apiKey: string,
  startId: string,    // Follower's profile ID or username
  endId: string,      // Followee's profile ID or username
  execution?: string
}
```

---

### Get Followers List

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/profiles/followers/{profileId}` | `followers.followersDetail()` | List users following this profile |

**Parameters:**
```typescript
{
  apiKey: string,
  id: string,              // Profile ID
  limit?: number,          // Page size
  offset?: number          // Pagination offset
}
```

---

### Get Followers Count

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/profiles/followers/{profileId}/count` | - | Get follower count |

---

### Get Following List

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/profiles/following/{profileId}` | - | List users this profile follows |

---

### Get Following Count

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/profiles/following/{profileId}/count` | - | Get following count |

---

### Check If User Follows

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/followers/check` | - | Verify follow relationship |

**Query Parameters:**
```
?apiKey=X&startId=Y&endId=Z
```

**Response:**
```typescript
{ isFollowing: boolean }
```

---

### Bulk Follow

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| POST | `/followers/bulk` | `followers.bulkFollowersCreate()` | Follow multiple users |

**Parameters:**
```typescript
{
  apiKey: string,
  followers: Array<{
    startId: string,
    endId: string
  }>,
  execution?: string
}
```

---

### Unfollow

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| DELETE | `/followers` | `followers.followersDelete()` | Remove follow relationship |

**Parameters:**
```typescript
{
  apiKey: string,
  startId: string,
  endId: string
}
```

---

## CONTENTS API

### Create or Update Content

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| POST | `/contents/findOrCreate` | `contents.findOrCreateCreate()` | Create content or return existing |

**Parameters:**
```typescript
{
  apiKey: string,
  id: string,                         // Unique content ID (e.g., "foresight-team-user1-contest1")
  profileId: string,                  // Owner's profile ID
  contentType: string,                // "POST", "ACHIEVEMENT", "COMMENT", etc.
  content?: string,                   // Text content
  execution?: string,
  properties?: Array<{                // Custom metadata
    key: string,
    value: string
  }>
}
```

**Typical Properties for Teams/Scores:**
```typescript
properties: [
  { key: "type", value: "draft_team" },
  { key: "app", value: "foresight" },
  { key: "contest_id", value: "123" },
  { key: "captain_id", value: "influencer_id" },
  { key: "budget_used", value: "150" },
  { key: "picks_json", value: JSON.stringify([...]) },
  { key: "created_at", value: String(Date.now()) }
]
```

---

### Get Content

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/contents/{contentId}` | `contents.contentsDetail()` | Retrieve content by ID |

---

### Get Content by Profile

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/contents/profile/{profileId}` | `contents.contentsByProfileList()` | List all content by user |

**Parameters:**
```typescript
{
  apiKey: string,
  profileId: string,
  limit?: number,
  offset?: number
}
```

---

### Update Content

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| PUT | `/contents/{contentId}` | `contents.contentsUpdate()` | Modify existing content |

**Parameters:**
```typescript
{
  apiKey: string,
  id: string,                    // Content ID
  properties?: Array<{           // Updated properties
    key: string,
    value: string
  }>,
  content?: string,              // Updated text
  execution?: string
}
```

---

### Delete Content

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| DELETE | `/contents/{contentId}` | `contents.contentsDelete()` | Remove content |

---

## LIKES API

### Create Like

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| POST | `/likes` | `likes.likesCreate()` | User likes content |

**Parameters:**
```typescript
{
  apiKey: string,
  profileId: string,      // User liking
  contentId: string       // Content being liked
}
```

---

### Get Likes for Content

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/likes/content/{contentId}` | `likes.likesByContentDetail()` | List who liked content |

---

### Get Likes by User

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/likes/profile/{profileId}` | `likes.likesByProfileList()` | List content user liked |

---

### Get Like Count

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/likes/count/{contentId}` | - | Total likes on content |

---

### Check If User Liked

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/likes/check` | - | Verify like status |

**Query Parameters:**
```
?apiKey=X&profileId=Y&contentId=Z
```

**Response:**
```typescript
{ liked: boolean }
```

---

### Remove Like

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| DELETE | `/likes` | `likes.likesDelete()` | Remove like |

**Parameters:**
```typescript
{
  apiKey: string,
  profileId: string,
  contentId: string
}
```

---

## COMMENTS API

### Create Comment

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| POST | `/comments` | `comments.commentsCreate()` | Add comment to content |

**Parameters:**
```typescript
{
  apiKey: string,
  profileId: string,      // Author
  contentId: string,      // Target content
  comment: string,        // Comment text
  execution?: string
}
```

---

### Get Comments for Content

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/comments/content/{contentId}` | `comments.commentsByContentList()` | List comments |

**Parameters:**
```typescript
{
  apiKey: string,
  contentId: string,
  limit?: number,
  offset?: number
}
```

---

### Get Comments by Author

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| GET | `/comments/profile/{profileId}` | `comments.commentsByProfileList()` | User's comments |

---

### Update Comment

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| PUT | `/comments/{commentId}` | `comments.commentsUpdate()` | Edit comment |

---

### Delete Comment

| Method | Endpoint | SDK Method | Purpose |
|--------|----------|-----------|---------|
| DELETE | `/comments/{commentId}` | `comments.commentsDelete()` | Remove comment |

---

## EXECUTION METHODS

All write operations support execution parameter:

```typescript
execution: "FAST_UNCONFIRMED"       // ~1 second, optimistic
execution: "QUICK_SIGNATURE"         // ~2-3 seconds, returns tx hash
execution: "CONFIRMED_AND_PARSED"    // ~15 seconds, blockchain confirmed
```

**When to use each:**

| Method | Latency | Use Case | Example |
|--------|---------|----------|---------|
| `FAST_UNCONFIRMED` | ~1s | Real-time UI, drafts | Team creation |
| `QUICK_SIGNATURE` | ~2-3s | Medium priority | Profile updates |
| `CONFIRMED_AND_PARSED` | ~15s | Final data, important | Score storage |

---

## ERROR RESPONSES

### Standard Error Format

```typescript
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE"
}
```

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | Success | Profile created |
| 400 | Bad request | Missing required field |
| 401 | Unauthorized | Invalid API key |
| 404 | Not found | Profile doesn't exist |
| 409 | Conflict | Username already exists |
| 429 | Rate limited | Too many requests |
| 500 | Server error | Internal error |

---

## RATE LIMITING

- **Dev Environment:** 1000 requests/15 minutes
- **Prod Environment:** 100 requests/15 minutes

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1234567890
```

---

## NAMESPACE CONCEPT

Each app gets a unique namespace. Usernames are unique per namespace.

```typescript
// App A's namespace
username: "alice"  // Can exist

// App B's namespace
username: "alice"  // Different user, same username OK (different namespace)
```

**Benefits:**
- No naming collisions across apps
- Data isolation per app
- Clear data ownership

---

## QUICK LOOKUP TABLE

| Feature | Create | Read | Update | Delete |
|---------|--------|------|--------|--------|
| Profiles | POST /profiles/findOrCreate | GET /profiles/{id} | - | - |
| Follows | POST /followers | GET /followers/{id} | - | DELETE /followers |
| Content | POST /contents/create | GET /contents/{id} | PUT /contents/{id} | DELETE /contents/{id} |
| Likes | POST /likes | GET /likes/content/{id} | - | DELETE /likes |
| Comments | POST /comments | GET /comments/content/{id} | PUT /comments/{id} | DELETE /comments/{id} |

---

## SDK INITIALIZATION

```typescript
import { SocialFi } from 'socialfi';

const client = new SocialFi({
  baseURL: 'https://api.usetapestry.dev/api/v1'
  // For dev: baseURL: 'https://api.dev.usetapestry.dev/api/v1'
});

const API_KEY = process.env.TAPESTRY_API_KEY;

// All SDK methods follow this pattern:
const result = await client.endpoint.method(
  { apiKey: API_KEY, ...params },
  { ...body }
);
```

---

## REFERENCE DOCS

- **Official Docs:** https://docs.usetapestry.dev/
- **Explorer:** https://explorer.usetapestry.dev/
- **NPM Package:** `socialfi`

---

**Last Updated:** February 22, 2026
**API Version:** v1
