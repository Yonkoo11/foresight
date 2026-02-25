# Influencer Leagues: Quick Start Guide

> **TL;DR:** Add a "Signature League" card for CZ's Champions to the top of the contests grid. Gold styling, creator avatar, follower count. Takes 4-6 hours. Judges will love it.

---

## ONE-MINUTE SUMMARY

| Aspect | Decision |
|--------|----------|
| Name | **Signature League** |
| Visual | Gold badge, 4px gold bar, creator avatar |
| Button Text | **"Join CZ's League"** with Crown icon |
| Placement | TOP section (above all contests) |
| Mandatory Pick? | **NO** — Skip for MVP |
| Social Proof | Creator avatar + follower count |
| Mobile | Full width, swipeable section |
| Implementation | 4-6 hours frontend + 1 hour data setup |

---

## IMPLEMENTATION STEPS

### Step 1: Data Setup (Backend - 1 hour)

#### A. Create Contest Record

```sql
-- In migration 20260222300000_add_signature_league.ts
INSERT INTO contests (
  name,
  description,
  type_code,
  type_name,
  entry_fee,
  prize_pool,
  team_size,
  has_captain,
  is_free,
  status,
  lock_time,
  end_time,
  created_by_user_id,
  is_signature_league
) VALUES (
  'CZ''s Champions',
  'The legend''s favorite picks compete here weekly.',
  'FREE_LEAGUE',
  'Signature League',
  0,
  50, -- 50 SOL prize pool
  5,
  true,
  true,
  'open',
  NOW() + INTERVAL '4 days', -- Lock in 4 days
  NOW() + INTERVAL '7 days', -- End in 7 days
  (SELECT id FROM users WHERE wallet_address = 'CZ_WALLET_ADDRESS'),
  true
) RETURNING id;
```

#### B. Add `is_signature_league` Column (if not exists)

```sql
-- In migration
ALTER TABLE contests ADD COLUMN is_signature_league BOOLEAN DEFAULT FALSE;
```

#### C. Seed Demo Entries (10-15 entries with varied scores)

```typescript
// In migration seed function
const contestId = 6; // CZ's Champions
const influencerIds = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

for (let i = 0; i < 15; i++) {
  const userScore = Math.floor(Math.random() * 2000) + 500; // 500-2500
  const captainId = influencerIds[Math.floor(Math.random() * influencerIds.length)];

  // Create entry
  // Add score calculation
}
```

#### D. Verify Creator's Tapestry Profile

```bash
# Check that CZ has:
# - tapestry_user_id populated
# - follower_count updated
# - avatar_url set

SELECT id, username, tapestry_user_id, follower_count, avatar_url
FROM users
WHERE username = 'cz_binance' OR wallet_address = 'CZ_ADDRESS';
```

### Step 2: Update Compete.tsx (2-3 hours)

#### A. Update Contest Interface

```typescript
interface Contest {
  id: number;
  // ... existing fields
  isSignatureLeague: boolean;  // NEW
  createdByUserId?: number;    // NEW
  creatorName?: string;        // NEW
  creatorHandle?: string;      // NEW
  creatorAvatarUrl?: string;   // NEW
  creatorFollowerCount?: number; // NEW
}
```

#### B. Update fetchContestsData() Response Handling

```typescript
const [contestsRes, entriesRes] = await Promise.all([
  axios.get(`${API_URL}/api/v2/contests`, {
    params: { active: 'true', includeCreator: 'true' } // NEW param
  }),
  // ... existing
]);
```

#### C. Separate Signature Leagues from Regular Contests

```typescript
const signatureLeagues = useMemo(() =>
  contests.filter(c => c.isSignatureLeague && c.status === 'open'),
  [contests]
);

const regularContests = useMemo(() =>
  contests.filter(c => !c.isSignatureLeague && c.status === 'open'),
  [contests]
);
```

#### D. Render Signature Section (Before Regular Contests)

```jsx
{/* Signature Leagues Section */}
{signatureLeagues.length > 0 && (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-4">
      <Sparkle size={20} className="text-gold-400" />
      <h2 className="text-lg font-bold text-white">Signature Leagues</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-x-auto pb-2">
      {signatureLeagues.map((league) => (
        <SignatureLeagueCard
          key={league.id}
          league={league}
          hasEntered={enteredContestIds.has(league.id)}
          onEnter={() => handleEnterContest(league)}
        />
      ))}
    </div>
  </div>
)}

{/* Regular Contests (existing, unchanged) */}
<div className="space-y-4">
  {/* ...existing filter pills and contests... */}
</div>
```

### Step 3: Create SignatureLeagueCard.tsx (2 hours)

```typescript
import { Sparkle, Crown, Users, Gift, Wallet, Clock, CaretRight } from '@phosphor-icons/react';

interface SignatureLeagueCardProps {
  league: Contest;
  hasEntered: boolean;
  onEnter: () => void;
}

export default function SignatureLeagueCard({
  league,
  hasEntered,
  onEnter
}: SignatureLeagueCardProps) {
  const solPrice = 145; // Fetch from parent or hook

  return (
    <div className="relative bg-gold-500/5 border border-gold-500/30 rounded-xl overflow-hidden hover:border-gold-500/50 transition-all group">

      {/* Signature League Badge */}
      <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/30">
        <Sparkle size={12} weight="fill" className="text-gold-400" />
        <span className="text-xs font-medium text-gold-400 uppercase">Signature League</span>
      </div>

      {/* Enhanced Gradient Bar (4px) */}
      <div className="h-1 bg-gradient-to-r from-gold-500 to-amber-600" />

      <div className="p-4 space-y-3">

        {/* Creator Attribution */}
        <div className="flex items-center gap-2 pt-4">
          {league.creatorAvatarUrl ? (
            <img
              src={league.creatorAvatarUrl}
              alt={league.creatorName}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center text-xs font-bold text-gray-950">
              {league.creatorName?.charAt(0).toUpperCase()}
            </div>
          )}
          <h3 className="text-base font-bold text-white">
            {league.name}
          </h3>
        </div>

        {/* Type Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Free League</span>
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-gold-500/20 text-gold-400">
            SIGNATURE SERIES
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center p-2 rounded-lg bg-black/20">
            <div className="text-sm font-bold text-gold-400">FREE</div>
            <div className="text-[10px] text-gray-500">Entry</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-black/20">
            <div className="text-sm font-bold text-emerald-400">
              ${(league.prizePool * solPrice).toFixed(0)}
            </div>
            <div className="text-[10px] text-gray-500">Prize</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-black/20">
            <div className="text-sm font-bold text-white">{league.playerCount}</div>
            <div className="text-[10px] text-gray-500">Players</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-black/20">
            <div className="text-sm font-bold text-white flex items-center justify-center gap-1">
              <Clock size={12} />
              {getTimeRemaining(league.lockTime)}
            </div>
            <div className="text-[10px] text-gray-500">Left</div>
          </div>
        </div>

        {/* Creator Credibility Line */}
        <div className="flex items-center gap-1.5 text-sm text-gray-400 border-t border-gray-800 pt-2">
          <Users size={14} className="text-gold-400 flex-shrink-0" />
          <span>
            Powered by <span className="font-semibold text-gold-400">@{league.creatorHandle}</span> – {league.creatorFollowerCount?.toLocaleString() || 0} followers
          </span>
        </div>

        {/* CTA Button */}
        {hasEntered ? (
          <button
            onClick={() => navigate(`/contest/${league.id}`)}
            className="w-full py-2.5 rounded-lg bg-gray-700 text-white font-bold flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
          >
            <ChartLineUp size={16} />
            View Entry
            <CaretRight size={14} />
          </button>
        ) : (
          <button
            onClick={onEnter}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 text-gray-950 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all hover:scale-105"
          >
            <Crown size={16} weight="fill" />
            Join {league.creatorName?.split("'")[0]}'s League
          </button>
        )}
      </div>
    </div>
  );
}
```

### Step 4: Update ContestDetail.tsx Header (1-1.5 hours)

```typescript
// Add to interface
interface Contest {
  // ... existing
  isSignatureLeague: boolean;
  createdByUserId?: number;
  creatorName?: string;
  creatorHandle?: string;
  creatorAvatarUrl?: string;
  creatorFollowerCount?: number;
}

// In render, add creator hero section if signature league
{contest?.isSignatureLeague && (
  <div className="bg-gradient-to-r from-gold-500/10 to-amber-600/10 border border-gold-500/30 rounded-xl p-6 mb-6">
    <div className="flex items-start gap-4">
      {/* Creator Avatar */}
      <img
        src={contest.creatorAvatarUrl || 'https://api.dicebear.com/7.x/initials/svg?seed=' + contest.creatorHandle}
        alt={contest.creatorName}
        className="w-16 h-16 rounded-full border-2 border-gold-500"
      />

      {/* Creator Info */}
      <div className="flex-1">
        <div className="text-xs text-gold-400 font-bold uppercase">Signature League</div>
        <h2 className="text-2xl font-bold text-white mb-1">{contest.name}</h2>
        <div className="text-sm text-gray-400 mb-3">
          Created by <span className="text-gold-400 font-semibold">@{contest.creatorHandle}</span>
        </div>
        <p className="text-gray-300 mb-3">{contest.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gold-400" />
            <span className="text-sm font-semibold text-white">{contest.creatorFollowerCount?.toLocaleString() || 0} followers</span>
          </div>
          <a
            href={`/profile/${contest.createdByUserId}`}
            className="text-sm text-gold-400 hover:text-gold-300 font-medium"
          >
            View Profile →
          </a>
        </div>
      </div>
    </div>
  </div>
)}
```

### Step 5: Backend API Update (30 mins)

#### Update `/api/v2/contests` to Include Creator Info

```typescript
// In contests.ts or similar
app.get('/api/v2/contests', async (req, res) => {
  const { active, includeCreator } = req.query;

  let query = knex('contests');

  if (includeCreator === 'true') {
    query = query
      .leftJoin('users', 'contests.created_by_user_id', 'users.id')
      .select(
        'contests.*',
        'users.username as creatorName',
        'users.handle as creatorHandle',
        'users.avatar_url as creatorAvatarUrl',
        'users.follower_count as creatorFollowerCount'
      );
  }

  const contests = await query;
  res.json({ success: true, contests });
});
```

---

## MOBILE IMPLEMENTATION

### Contest Card Width

```css
/* On mobile (< 640px) */
.signature-league-card {
  width: calc(100% - 32px); /* Full width with padding */
  margin: 0 16px 16px 16px;
}

/* On tablet (640px - 1024px) */
@media (min-width: 640px) {
  .signature-leagues-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* On desktop (> 1024px) */
@media (min-width: 1024px) {
  .signature-leagues-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Touch Targets

- Creator avatar: 28px (≥ 44px hit area with padding)
- CTA button: 44px tall (iOS/Android standard)
- Stats grid cells: Tappable (not interactive, but visible)

---

## TESTING CHECKLIST

### Visual Testing

- [ ] Gold gradient bar is 4px thick (not 1px)
- [ ] Signature League badge is gold and positioned top-left
- [ ] Creator avatar loads correctly (fallback to initials if broken)
- [ ] Card border is gold, not gray
- [ ] Hover state brightens gold border (gold-500/50)
- [ ] CTA button has crown icon
- [ ] Follower count displays (e.g., "1,240 followers")

### Functional Testing

- [ ] Click "Join CZ's League" → Navigates to draft with correct contest ID
- [ ] Click creator name → Links to creator profile
- [ ] Stats grid shows correct prize pool (USD calculated from SOL price)
- [ ] Time remaining countdown updates every second
- [ ] Signature section appears above regular contests

### Mobile Testing (375px)

- [ ] Card is full width with 16px padding
- [ ] Creator avatar + name fit on one line (or gracefully wrap)
- [ ] Stats grid is 4 columns (tight but readable)
- [ ] CTA button spans full width
- [ ] Horizontal scroll works on signature section

### Data Testing

- [ ] Contest marked as `is_signature_league = true`
- [ ] Creator's follower count updates from Tapestry
- [ ] Demo entries load (10-15 varied scores)
- [ ] Prize pool calculation is correct (SOL × price)

---

## COMMON PITFALLS

### Pitfall 1: Gold Color Collision
- **Problem:** Existing gold badges clash with new signature badge
- **Fix:** Use gold-500/15 (very light) for card background, gold-500/30 for border

### Pitfall 2: Avatar Missing
- **Problem:** Creator avatar URL is NULL
- **Fix:** Add fallback: `<initials badge>` with creator's first letter

### Pitfall 3: Follower Count is 0
- **Problem:** Tapestry integration not complete
- **Fix:** Seed follower_count in users table manually (e.g., `UPDATE users SET follower_count = 1240 WHERE username = 'cz_binance'`)

### Pitfall 4: Button Text Overflow
- **Problem:** "Join CZ's League" wraps on mobile
- **Fix:** Use conditional text: "Join League" on mobile, "Join CZ's League" on desktop

### Pitfall 5: TypeScript Errors
- **Problem:** New `isSignatureLeague` field not defined in interface
- **Fix:** Update Contest interface AND response handler in Compete.tsx

---

## TIMELINE

| Task | Hours | Owner |
|------|-------|-------|
| Data setup (migration, contest record) | 1 | Backend |
| Compete.tsx updates | 1.5 | Frontend |
| SignatureLeagueCard.tsx component | 2 | Frontend |
| ContestDetail.tsx hero section | 1 | Frontend |
| Backend API updates | 0.5 | Backend |
| Testing + fixes | 1 | Full team |
| **TOTAL** | **6.5** | |

**Accelerated: 4-5 hours if you skip ContestDetail hero section (Phase 2)**

---

## SUCCESS CRITERIA

After implementation, verify:

1. ✅ Signature league appears at top of contests grid
2. ✅ Gold styling visually distinct from regular contests
3. ✅ Creator avatar + name + follower count visible
4. ✅ "Join CZ's League" button works (enters draft)
5. ✅ Mobile responsive (full width, touch targets ≥ 44px)
6. ✅ No TypeScript errors
7. ✅ No console errors on load
8. ✅ Demo entries in leaderboard (not empty)

---

**Done!** You're ready to build signature leagues. Questions? Refer back to INFLUENCER_LEAGUES_UX_SPEC.md for full rationale.
