# Tapestry Integration — Your Questions Answered

> **Direct answers to the 5 technical questions asked**
> **Reference:** See `TAPESTRY_TECHNICAL_ARCHITECTURE.md` for detailed patterns

---

## Q1: Data Flow — From UI Click to Tapestry Response

### What state needs to be managed?

**At the context level (global state):**
```typescript
interface TapestryContextValue {
  // Identity
  myTapestryProfileId: string | null; // Extracted at auth signup

  // Social graph cache (session lifetime)
  followingMap: Record<string, boolean>; // e.g. { "tap_xyz123": true, "tap_abc456": false }
  followerCounts: Record<string, number>; // e.g. { "tap_xyz123": 1523, "tap_abc456": 892 }

  // Content interactions cache
  likedTeams: Set<string>; // e.g. new Set(["foresight-team-usr_123-456"])
  teamLikeCounts: Record<string, number>; // e.g. { "foresight-team-usr_123-456": 1234 }

  // Loading states (for disable buttons, show spinners)
  loadingFollows: Set<string>; // profileId being processed
  loadingLikes: Set<string>; // contentId being processed
}
```

**At the component level (local state):**
```typescript
// For a follow button
const [error, setError] = useState<string | null>(null);

// For a comment modal
const [text, setText] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Exact data flow (Follow example):

```
1. USER CLICKS "FOLLOW" BUTTON (UI)
   ↓
2. Component calls useTapestry().follow(targetProfileId)
   ↓
3. Context handler optimistically updates: followingMap[targetProfileId] = true
   ↓
4. Component re-renders: "Following..." with spinner
   ↓
5. axios.post('/api/tapestry/follow', { targetProfileId }, headers)
   ↓
6. Backend calls tapestryService.followProfile(myProfileId, targetProfileId)
   ↓
7. Service calls SocialFi SDK → Tapestry API → Solana
   ↓
8. Response returns 200 OK
   ↓
9. Context removes loading state: loadingFollows.delete(targetProfileId)
   ↓
10. Component re-renders: "Following" (no spinner)
   ↓
11. STATE AT REST: followingMap[targetProfileId] = true
```

**Key points:**
- Optimistic update happens immediately (step 3)
- User sees change before API confirms (better UX)
- If API fails, we revert in catch block
- Loading state prevents double-clicking
- Following state persists for session (cleared on refresh)

---

## Q2: Performance Concerns — What to Cache vs. Fetch

### Performance Bottleneck: The Leaderboard Problem

**Scenario:** Leaderboard shows 100 teams. Each team has a follow button for the author.

**Naive approach:**
```
Team 1 author: GET /api/tapestry/following-state/tap_prof_1 → 300ms
Team 2 author: GET /api/tapestry/following-state/tap_prof_2 → 300ms
...
Team 100 author: GET /api/tapestry/following-state/tap_prof_100 → 300ms
───────────────────────────────────────────────────────────────
TOTAL: 100 × 300ms = 30 SECONDS 🔴
```

### Solution: Batch Check

**Optimized approach:**
```
1x GET /api/tapestry/following-state-batch?profileIds=tap_prof_1,tap_prof_2,...,tap_prof_100
   └─ All 100 checks done in parallel by Tapestry API
   └─ Returns in ~600ms
───────────────────────────────────────────────────────────────
TOTAL: 600ms 🟢 (50× faster)
```

**Backend implementation (add to tapestry.ts):**
```typescript
router.get('/following-state-batch', authenticate, asyncHandler(async (req, res) => {
  const profileIds = (req.query.profileIds as string).split(',').filter(id => id.trim());
  const myProfileId = await getTapestryProfileId(req.user!.userId);

  // Parallel: await Promise.all([isFollowing(id1), isFollowing(id2), ...])
  const results = await Promise.all(
    profileIds.map(id => tapestryService.isFollowing(myProfileId, id).catch(() => false))
  );

  const following: Record<string, boolean> = {};
  profileIds.forEach((id, idx) => { following[id] = results[idx]; });

  sendSuccess(res, { following });
}));
```

### What to Cache

| Data | Cache? | How Long | Why |
|------|--------|----------|-----|
| **followingMap** | ✅ YES | Session | Rarely changes during session, expensive to refetch |
| **followerCounts** | ⚠️ MAYBE | 5 min | Changes slowly, cache with soft expiry |
| **likedTeams** | ✅ YES | Session | User's own likes don't change outside app |
| **teamLikeCounts** | ❌ NO | Live | Other users liking → increments in real-time |
| **leaderboardRanks** | ❌ NO | 30s | Changes every 60s from scoring, refresh often |

**Implementation:**
```typescript
// Cache with TTL
const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

// Live data (refresh every 30s in background)
useEffect(() => {
  const interval = setInterval(() => {
    refetchLeaderboard(); // Soft refresh, no spinner
  }, 30000);
  return () => clearInterval(interval);
}, []);

// Invalidate on mutation
const likeTeam = async (contentId: string) => {
  // Optimistic update to local cache
  setTeamLikeCounts(prev => ({ ...prev, [contentId]: prev[contentId] + 1 }));

  // Fire API call (don't wait)
  axios.post(`/api/tapestry/like/${contentId}`).catch(() => {
    // Revert if fails
    setTeamLikeCounts(prev => ({ ...prev, [contentId]: prev[contentId] - 1 }));
  });
};
```

### Fire-and-Forget vs. Blocking

**FIRE-AND-FORGET (don't wait):**
```typescript
// Follow/unfollow
follow(targetProfileId).catch(() => {
  toast.error('Failed to follow'); // Show error but don't block
});

// Like
likeTeam(contentId).catch(() => {
  revertUI(); // Revert optimistic update
});
```

**BLOCKING (wait for response):**
```typescript
// Initial page load
try {
  const teams = await fetchLeaderboard(); // Wait
  setLeaderboard(teams);

  const followMap = await refetchFollowingState(teams.map(t => t.authorId)); // Wait
  setFollowingMap(followMap);
} finally {
  setLoading(false);
}
```

---

## Q3: Leaderboard Problem — How to Handle N Users

### The Challenge

Leaderboard shows 100 users. Each user has:
- Follow button (need to check if user follows)
- Like button (need to know if user liked)
- Comment button

**Naive: 100 sequential calls = 30 seconds**
**Smart: 1 batch call + local cache = 600ms**

### Solution in 3 Steps

**Step 1: Fetch leaderboard data (includes IDs)**
```typescript
const res = await axios.get('/api/league/leaderboard');
const teams = res.data.leaderboard.map(t => ({
  id: t.id,
  teamName: t.team_name,
  totalScore: t.total_score,
  tapestryTeamContentId: t.tapestry_team_content_id, // NEW
  authorTapestryProfileId: t.author_tapestry_profile_id, // NEW
}));
```

**Step 2: Batch fetch following states**
```typescript
const authorIds = teams.map(t => t.authorTapestryProfileId);
const res = await axios.get('/api/tapestry/following-state-batch', {
  params: { profileIds: authorIds.join(',') }
});
// Returns: { following: { tap_id_1: true, tap_id_2: false, ... } }

// Save to context
setFollowingMap(res.data.data.following);
```

**Step 3: Render with cached state**
```typescript
teams.forEach(team => {
  const isFollowing = followingMap[team.authorTapestryProfileId] ?? false;
  return <FollowButton isFollowing={isFollowing} ... />;
});
```

**Total time:** ~1.2 seconds (leaderboard fetch 600ms + batch check 600ms)

### For 1000 users?
- Paginate: Show 50 per page, batch check those 50
- Or: One batch call with up to 1000 IDs (Tapestry handles this)
- Same approach, just adjust batch size

---

## Q4: Content ID Mapping — DB Entry ↔ Tapestry Content ID

### The Problem

**Database table (user_teams):**
```sql
id    user_id   contest_id  team_name     total_score
123   usr_abc   456         Dream Team    1,250
124   usr_def   456         Power Squad   1,180
```

**Tapestry content IDs:**
```
foresight-team-usr_abc-456  ← For team ID 123
foresight-team-usr_def-456  ← For team ID 124
```

**When showing leaderboard:**
- Database gives us `team.id = 123`
- But Tapestry needs `contentId = "foresight-team-usr_abc-456"`
- To: Like, comment, share

### Solution: Store in Database

**Migration (to add):**
```typescript
// backend/migrations/20260222000000_add_tapestry_content_ids.ts

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_teams', table => {
    table.string('tapestry_team_content_id').nullable().index();
    table.string('tapestry_score_content_id').nullable().index();
  });

  // Populate existing records: contentId = foresight-team-{userId}-{contestId}
  await knex.raw(`
    UPDATE user_teams
    SET tapestry_team_content_id = 'foresight-team-' || user_id || '-' || contest_id
  `);
}
```

**When creating team (backend):**
```typescript
// backend/src/api/league.ts line 244-252

const [team] = await trx('user_teams').insert({
  user_id: userId,
  contest_id: contest.id,
  team_name,
  tapestry_team_content_id: `foresight-team-${userId}-${contest.id}`, // Generate here
  // ...
}).returning('*');
```

**In leaderboard response (backend):**
```typescript
// backend/src/api/league.ts

res.json({
  leaderboard: leaderboard.map(team => ({
    id: team.id,
    teamName: team.team_name,
    totalScore: team.total_score,
    rank: team.rank,
    tapestryTeamContentId: team.tapestry_team_content_id, // Include this
    authorTapestryProfileId: team.author_tapestry_profile_id, // Include this
  }))
});
```

**In frontend (component):**
```typescript
function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const contentId = entry.tapestryTeamContentId; // Use this

  return (
    <tr>
      <td>{entry.rank}</td>
      <td>{entry.teamName}</td>
      <td>{entry.totalScore}</td>

      {/* Like button uses contentId */}
      <td>
        <LikeButton
          contentId={contentId}
          initialCount={0}
        />
      </td>

      {/* Comment button uses contentId */}
      <td>
        <button onClick={() => openCommentModal(contentId)}>
          💬 Comment
        </button>
      </td>

      {/* Share to Tapestry */}
      <td>
        <a href={`https://protocol.xyz/content/${contentId}`} target="_blank">
          Share on Tapestry
        </a>
      </td>
    </tr>
  );
}
```

**Mapping happens once** → Stored in database → Reused forever ✅

---

## Q5: Minimal Frontend State Structure

### Context = Global, Component = Local

**NEVER PUT IN CONTEXT:**
- Individual form inputs
- Modal open/close flags (per modal)
- Comment thread state
- UI animation states
- Selected team for comparison
- Filter/sort preferences (unless shared across pages)

**ALWAYS PUT IN CONTEXT:**
- User's own Tapestry profile ID
- Which users the current user follows
- Which teams the current user liked
- Loading states (so buttons can disable globally)
- Error messages (for global toast)

### Minimal State Required

```typescript
// Global context (TapestryContext.tsx)
interface TapestryContextValue {
  // Identity (needed everywhere)
  myTapestryProfileId: string | null;

  // Cache (needed in multiple components)
  followingMap: Record<string, boolean>; // profileId → isFollowing
  likedTeams: Set<string>; // contentId → liked

  // Loading (to show/hide spinners and disable buttons)
  loadingFollows: Set<string>; // profileId being processed
  loadingLikes: Set<string>; // contentId being processed

  // Mutations (exposed methods)
  follow(targetProfileId: string): Promise<void>;
  unfollow(targetProfileId: string): Promise<void>;
  likeTeam(contentId: string): Promise<void>;
  unlikeTeam(contentId: string): Promise<void>;
}

// Local component state
function CommentModal() {
  const [text, setText] = useState(''); // Form input
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading
  const [error, setError] = useState<string | null>(null); // Error
  // ↑ Don't elevate these to context
}
```

### Why This Structure?

| State | Location | Reason |
|-------|----------|--------|
| `myTapestryProfileId` | Context | Used in every mutation (follow, like, comment) |
| `followingMap` | Context | Needed in: Sidebar, Leaderboard, Profile |
| `likedTeams` | Context | Needed in: Leaderboard, Contest detail, Profile |
| `loadingFollows` | Context | Need to disable all follow buttons globally |
| `text` (input) | Component | Only one modal uses it, changes frequently |
| `isSubmitting` | Component | Only that modal needs this loading state |
| `selectedCommentThread` | Component | Only the modal's comments section needs it |

**Rule of thumb:** If 2+ pages/components need it → Context. Else → Local state.

### Example: Right vs. Wrong

❌ **Wrong: Everything in context**
```typescript
<TapestryContext>
  <CommentModal
    text={contextText}
    setText={contextSetText}
    isSubmitting={contextIsSubmitting}
    error={contextError}
    setError={contextSetError}
    // ... 20 more props
  />
</TapestryContext>
```

✅ **Right: Only shared state in context**
```typescript
<TapestryContext>
  <CommentModal contentId={contentId} onClose={onClose} />
  {/* Modal manages its own text, error, isSubmitting */}
</TapestryContext>
```

---

## Implementation Roadmap

### Week 1: Setup
- [ ] Add `TapestryContext.tsx` (use code from TAPESTRY_FRONTEND_QUICKSTART.md)
- [ ] Add `TapestryProvider` to App.tsx
- [ ] Create `FollowButton.tsx`, `LikeButton.tsx`, `CommentModal.tsx`

### Week 2: Integration
- [ ] Add buttons to leaderboard rows
- [ ] Test follow/unfollow flow
- [ ] Test like/unlike flow
- [ ] Test comment posting

### Week 3: Polish
- [ ] Add batch fetching endpoint (backend)
- [ ] Optimize leaderboard loading (batch follow checks)
- [ ] Mobile responsive design
- [ ] Toast notifications
- [ ] Error recovery

### Week 4: Launch
- [ ] Final QA on all flows
- [ ] Monitor Tapestry API usage
- [ ] Record demo showing social features
- [ ] Documentation for maintenance

---

## Quick Reference Table

| Question | Answer | File |
|----------|--------|------|
| How to follow? | Call `context.follow(profileId)` → optimistic update → API call | `TAPESTRY_FRONTEND_QUICKSTART.md` |
| How to like? | Call `context.likeTeam(contentId)` → same pattern | Line 95-140 |
| How to handle 100 users? | Use batch endpoint for follow checks (600ms instead of 30s) | `TAPESTRY_TECHNICAL_ARCHITECTURE.md` section 2.1 |
| What state to cache? | followingMap, likedTeams (session lifetime) | Section 2.2 |
| How to link DB to Tapestry? | Store `tapestry_team_content_id` in `user_teams` table | Section 4 |
| What goes in context? | Identity, cache, loading states | Q5 above |

---

## Debugging Checklist

```
[ ] Backend logs show tapestryService calls happening
[ ] API token is in Authorization header
[ ] tapestry_user_id exists for current user in DB
[ ] Content ID format: foresight-team-{userId}-{contestId}
[ ] Profile IDs from response match batch endpoint params
[ ] Optimistic UI updates immediately (before API response)
[ ] Errors revert optimistic updates
[ ] Loading states show spinner and disable buttons
[ ] No loading state gets stuck (always cleaned up in finally)
```

---

*Last updated: Feb 22, 2026*
*Questions? See full implementation guide: `TAPESTRY_TECHNICAL_ARCHITECTURE.md`*
