# Tapestry Social Integration — 5 Questions, 5 Complete Answers

**Date:** Feb 22, 2026
**Status:** Backend complete, frontend ready for implementation
**Read time:** 2 minutes (quick summary)

---

## Your 5 Questions + Direct Answers

### 1. Data Flow: UI Click → Tapestry → UI Update

**Flow:**
```
User clicks "Follow" 
  ↓ optimistic: followingMap[id] = true (immediate)
  ↓ POST /api/tapestry/follow { targetProfileId }
  ↓ backend → Tapestry API → Solana
  ↓ response: 200 OK
  ↓ removeLoading spinner
  ↓ state locked: followingMap[id] = true
```

**State needed:**
- `followingMap` (Record<string, boolean>) — is user following?
- `loadingFollows` (Set<string>) — which follows in flight?
- `likedTeams` (Set<string>) — which teams liked?
- `teamLikeCounts` (Record<string, number>) — live like counts

**See:** `TAPESTRY_Q_AND_A.md` section Q1

---

### 2. Performance: Which Calls Are Expensive?

**Most expensive:**
- `isFollowing` checks: 300ms each, **N users = 30 seconds**

**Solution: Batch endpoint**
- One call: `/api/tapestry/following-state-batch?profileIds=tap_1,tap_2,...tap_100`
- Time: 600ms for 100 checks (50× faster)
- Cache in context for session

**Cache strategy:**
| Data | Cache? | Reason |
|------|--------|--------|
| followingMap | ✅ | Changes rarely during session |
| likedTeams | ✅ | User's own likes stay same in app |
| teamLikeCounts | ❌ | Others liking → need live updates |
| leaderboardRanks | ❌ | Changes every 60s, refresh often |

**See:** `TAPESTRY_Q_AND_A.md` section Q2

---

### 3. Leaderboard Problem: 100 Users × N Social Actions

**Naive:** 100 sequential follow checks = 30 seconds ❌

**Smart:** 
1. Fetch leaderboard (600ms)
2. Batch fetch all author follow states (600ms)
3. Cache in context (used for all 100 rows)
4. Total: 1.2 seconds ✅

**Code:**
```typescript
// Step 1
const teams = await fetchLeaderboard();

// Step 2
const authorIds = teams.map(t => t.authorTapestryProfileId);
const following = await batchCheckFollowing(authorIds);

// Step 3: All 100 rows render with cached data
teams.map(team => (
  <FollowButton
    isFollowing={following[team.authorTapestryProfileId]}
  />
))
```

**See:** `TAPESTRY_Q_AND_A.md` section Q3

---

### 4. Content ID Mapping: DB Entry ↔ Tapestry ID

**Problem:** DB stores `team.id = 123`, Tapestry needs `contentId = "foresight-team-usr_abc-456"`

**Solution: Store both in DB**
```typescript
// user_teams table
id    user_id   contest_id  tapestry_team_content_id
123   usr_abc   456         foresight-team-usr_abc-456
```

**When returning leaderboard:**
```typescript
res.json({
  leaderboard: teams.map(t => ({
    id: t.id,
    teamName: t.team_name,
    tapestryTeamContentId: t.tapestry_team_content_id, // ← Include this
  }))
})
```

**In component:**
```typescript
<LikeButton contentId={entry.tapestryTeamContentId} />
<CommentButton contentId={entry.tapestryTeamContentId} />
```

**See:** `TAPESTRY_Q_AND_A.md` section Q4 + `TAPESTRY_TECHNICAL_ARCHITECTURE.md` section 3

---

### 5. Frontend State: What's Global vs. Local?

**Context (global):**
- `myTapestryProfileId` — used everywhere
- `followingMap` — needed in sidebar, leaderboard, profile
- `likedTeams` — needed in multiple pages
- `loadingFollows/loadingLikes` — disable buttons globally

**Component (local):**
- Comment text input — only in modal
- Modal open/close — only in one page
- Form validation errors — per form

**Rule:** If 2+ pages need it → Context. Else → Local state.

**See:** `TAPESTRY_Q_AND_A.md` section Q5

---

## What's Ready, What's Next

### ✅ Complete (Backend)
- All Tapestry service functions working
- All API routes implemented
- Error handling in place
- Auth integrated

### ⏳ Next (Frontend)
1. **Context** (4 hours) — Copy from `TAPESTRY_FRONTEND_QUICKSTART.md`
2. **Components** (6 hours) — FollowButton, LikeButton, CommentModal
3. **Integration** (4 hours) — Add to leaderboard
4. **Polish** (2 hours) — Mobile, toasts, accessibility

**Total: 16 hours** (2-3 days of dev)

---

## Code References

| Document | Purpose |
|----------|---------|
| `TAPESTRY_TECHNICAL_ARCHITECTURE.md` | 11-section deep dive with all patterns |
| `TAPESTRY_FRONTEND_QUICKSTART.md` | Copy-paste ready implementation |
| `TAPESTRY_Q_AND_A.md` | Direct answers to 5 questions (this file) |

---

## Next Steps for Your Team

1. **Read** `TAPESTRY_FRONTEND_QUICKSTART.md` (copy code directly)
2. **Create** `TapestryContext.tsx` and add provider to App.tsx
3. **Create** Button and Modal components
4. **Test** each component in isolation
5. **Integrate** into leaderboard
6. **Optimize** with batch endpoint (add to backend)

---

**Need deep technical details?** → `TAPESTRY_TECHNICAL_ARCHITECTURE.md`
**Ready to code?** → `TAPESTRY_FRONTEND_QUICKSTART.md`
**Have questions?** → `TAPESTRY_Q_AND_A.md`

