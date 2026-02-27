# Fantasy Sports UI Patterns — Visual Reference

**Purpose:** Quick lookup guide for design decisions during implementation
**Format:** Pattern name + visual diagram + code snippet + decision framework
**Audience:** Product, Design, Engineering

---

## Pattern 1: Percentile Rank Display

### Problem
Showing "2,847th of 18,234" crushes motivation. Percentile feels achievable.

### Visual (Leaderboard Header)
```
╔════════════════════════════════════╗
║ YOUR POSITION                      ║
║                                    ║
║  TOP 12% Elite Tier                ║  ← Primary (bold, 18pt)
║                                    ║
║  Rank #145 of 1,234 players        ║  ← Secondary (small, 12pt gray)
║                                    ║
║  Prize Pool: $50,000 | You: $240   ║  ← Context info
╚════════════════════════════════════╝
```

### Component Code
```typescript
// LeaderboardHeader.tsx
<div className="bg-gray-950 border-b border-gray-800 p-4">
  <div className="space-y-2">
    {/* Percentile */}
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-gold-500">
        {tier} Tier
      </span>
      <span className="text-lg text-amber-300">
        Top {percentile}%
      </span>
    </div>

    {/* Secondary rank info */}
    <div className="text-xs text-gray-400">
      Rank #{rank} of {total}
    </div>

    {/* Prize context */}
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">Prize Pool: {totalPrize}</span>
      <span className="text-gold-500 font-semibold">You: {yourPrize}</span>
    </div>
  </div>
</div>
```

### Decision Tree
```
Does player see their absolute rank?
├─ Yes, and they're top 10%? → Show both (percentile + rank, percentile first)
├─ Yes, but bottom 50%? → Percentile only (psychological safety)
└─ Viewing global leaderboard? → Percentile + segment selector (hide global until top 10%)
```

---

## Pattern 2: Live Score Update Indicator

### Problem
Users don't know if leaderboard is stale or live. 30-second refreshes should feel active.

### Visual (Score Cell Animation)
```
Before update:        After update:           After animation:
┌─────────────┐      ┌─────────────┐        ┌─────────────┐
│ 145 pts     │  →   │ 152 pts ✨  │  →   │ 152 pts     │
│ $240        │      │ $280        │        │ $280        │
└─────────────┘      └─────────────┘        └─────────────┘
                     (gold bg, 300ms)      (back to normal)
```

### Component Code
```typescript
// ScoreCell.tsx
import { motion } from 'framer-motion';

export function ScoreCell({ score, prevScore }) {
  const hasChanged = score !== prevScore;

  return (
    <motion.div
      className="text-center"
      animate={hasChanged ? {
        backgroundColor: ['transparent', '#F59E0B', 'transparent']
      } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="font-bold text-lg">{score} pts</div>
      <div className="text-xs text-gray-400">${score * 1.66}</div>

      {hasChanged && (
        <motion.div
          className="text-gold-500 text-xs mt-1"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        >
          +{score - prevScore} ✨
        </motion.div>
      )}
    </motion.div>
  );
}
```

### Last Updated Timestamp
```typescript
// LeaderboardFooter.tsx
<div className="text-xs text-gray-500 py-2 text-center border-t border-gray-800">
  Last updated: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
  {isStale && <span className="ml-2 text-amber-500">⚠ Waiting for updates...</span>}
</div>
```

### Decision Tree
```
How often to update?
├─ Contest in progress? → 30 seconds (feels alive)
├─ Contest ended? → 5 minutes (less frequent)
└─ No contests active? → On-demand (user refreshes)

What if no new data arrives?
├─ After 90 seconds? → Show "Waiting for updates..."
└─ After 5 min? → Show refresh button (manual control)
```

---

## Pattern 3: Visual Formation Card

### Problem
Text roster lists are boring. Visual team cards create ownership and memory.

### Visual Design

#### Mobile (375px)
```
┌─────────────────────────────────────┐
│         CAPTAIN (1.5x Points)       │
│ ┌───────────────────────────────┐   │
│ │ [Avatar]                      │   │
│ │ Elon Musk                     │   │
│ │ S-Tier Influencer             │   │
│ │ 4.2K daily engagement         │   │
│ │ 42 followers selected          │   │
│ └───────────────────────────────┘   │
│                                     │
│ YOUR TEAM (S: 1, A: 1, B: 1, C: 1) │
│ ┌─────────┬─────────────────────┐   │
│ │ S       │ Vitalik S-Tier      │   │
│ │ [Avatar]│ 12K engagement      │   │
│ └─────────┴─────────────────────┘   │
│ ┌─────────┬─────────────────────┐   │
│ │ A       │ Joe A-Tier          │   │
│ │ [Avatar]│ 8K engagement       │   │
│ └─────────┴─────────────────────┘   │
│ ┌─────────┬─────────────────────┐   │
│ │ B       │ Alice B-Tier        │   │
│ │ [Avatar]│ 2K engagement       │   │
│ └─────────┴─────────────────────┘   │
│ ┌─────────┬─────────────────────┐   │
│ │ C       │ Bob C-Tier          │   │
│ │ [Avatar]│ 800 engagement      │   │
│ └─────────┴─────────────────────┘   │
│                                     │
│ Budget Used: 145 / 150 pts          │
│ ┌─────────────────────────────────┐ │
│ │ [=================─] 96.7%       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Desktop (1280px)
```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  CAPTAIN (1.5x)                    YOUR TEAM                 │
│ ┌──────────────┐                 ┌──────────────────┐         │
│ │  [Avatar]    │                 │ S │ A │ B │ C    │         │
│ │ Elon Musk    │                 ├───┼───┼───┼────  │         │
│ │ S-Tier       │                 │ V │ J │ A │ B    │         │
│ │ 4.2K eng     │                 └──────────────────┘         │
│ └──────────────┘                                              │
│                                                               │
│ Budget: 145 / 150 pts [===================─] 96.7%           │
└───────────────────────────────────────────────────────────────┘
```

### Component Code
```typescript
// FormationCard.tsx
export function FormationCard({ team, budget, maxBudget, onSwapPlayer }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Captain Section */}
      <div className="bg-gradient-to-b from-gold-900 to-gray-900 p-6">
        <div className="text-xs font-bold text-gold-500 mb-2">CAPTAIN (1.5x Points)</div>
        <PlayerCard
          player={team.captain}
          size="lg"
          showEngagement
          onClick={() => onSwapPlayer('captain')}
        />
      </div>

      {/* Tier Slots */}
      <div className="p-4 space-y-3">
        {['S', 'A', 'B', 'C'].map(tier => (
          <div key={tier} className="flex gap-3">
            <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center">
              <span className="font-bold text-gold-500">{tier}</span>
            </div>
            <PlayerCard
              player={team[tier]}
              size="sm"
              onClick={() => onSwapPlayer(tier)}
            />
          </div>
        ))}
      </div>

      {/* Budget Tracker */}
      <div className="bg-gray-950 p-4 border-t border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Budget Used</span>
          <span className={`font-bold ${
            budget < 5 ? 'text-red-500' :
            budget < 10 ? 'text-amber-500' :
            'text-green-500'
          }`}>
            {budget} / {maxBudget} pts
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full ${
              budget < 5 ? 'bg-red-500' :
              budget < 10 ? 'bg-amber-500' :
              'bg-gold-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${(budget / maxBudget) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

// PlayerCard.tsx (reusable)
function PlayerCard({ player, size = 'sm', onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg p-${size === 'lg' ? '4' : '2'} text-left transition`}
    >
      <div className="flex gap-3">
        <img
          src={player.avatar}
          alt={player.name}
          className={`${size === 'lg' ? 'w-20 h-20' : 'w-12 h-12'} rounded-lg`}
        />
        <div className="flex-1">
          <div className="font-bold text-sm">{player.name}</div>
          <div className="text-xs text-gray-400">{player.tier} Tier</div>
          <div className="text-xs text-gray-500 mt-1">
            {player.engagement}K engagement
          </div>
        </div>
      </div>
    </button>
  );
}
```

### Decision Tree
```
Where to use FormationCard?
├─ Home page → Show current team (1 per user, scrollable)
├─ Draft page → Primary interface (full-screen, editable)
├─ Profile page → Show "Best Team" + "Current Team" (read-only)
└─ Contest detail → Show top 3 teams (social proof, read-only)

When user clicks player?
├─ Draft page → Open player search modal (swap out)
└─ Other pages → Open player detail modal (read-only)

Mobile vs Desktop?
├─ Mobile (375px) → Vertical stack (captain full-width, then tiers)
└─ Desktop (1280px) → Two-column (captain left, tiers grid right)
```

---

## Pattern 4: Entry Flow Screens

### Problem
Long flows kill conversion. 4 screens max, <2 minutes total.

### Screen 1: Browse Contests
```
┌─────────────────────────────────┐
│ CONTESTS                        │
├─────────────────────────────────┤
│ [All Sports ▼]                  │
│ [Entry Fee: Any ▼]              │
│ [Sort: By Prize ▼]              │
│                                 │
│ FEATURED (3 contests)            │
│ ┌───────────────────────────────┐│
│ │ Monday Night Elite            ││
│ │ $10 entry | Prize: $500       ││
│ │ 2,347 players | Starts: 8:00  ││
│ │           [ENTER] [More info] ││
│ └───────────────────────────────┘│
│ ┌───────────────────────────────┐│
│ │ Daily All-Sport Challenge     ││
│ │ $25 entry | Prize: $2,500     ││
│ │ 5,234 players | Starts: 8:00  ││
│ │           [ENTER] [More info] ││
│ └───────────────────────────────┘│
│ ┌───────────────────────────────┐│
│ │ Whale Friday ($100)           ││
│ │ $100 entry | Prize: $50,000   ││
│ │ 342 players | Starts: 20:00   ││
│ │           [ENTER] [More info] ││
│ └───────────────────────────────┘│
│                                 │
│ BROWSE MORE (scroll for more)   │
└─────────────────────────────────┘
```

### Screen 2: Confirm Entry Fee
```
┌─────────────────────────────────┐
│ CONFIRM ENTRY                   │
├─────────────────────────────────┤
│ Contest: Monday Night Elite     │
│                                 │
│ Entry Details:                  │
│ • Entry Fee: $10                │
│ • Prize Pool: $500              │
│ • Players: 2,347                │
│ • Starts: Monday 8:00 UTC       │
│ • Duration: 1 week              │
│                                 │
│ Rules:                          │
│ 5-player teams (Captain 1.5x)   │
│ Budget: 150 points              │
│ Scoring: Daily activity         │
│                                 │
│ [Cancel] [Continue to Draft]    │
│          └── Gold button, large  │
└─────────────────────────────────┘
```

### Screen 3: Draft Team
(Use FormationCard component from Pattern 3)

### Screen 4: Checkout
```
┌─────────────────────────────────┐
│ CONFIRM ENTRY                   │
├─────────────────────────────────┤
│ Your Team:                      │
│ ┌───────────────────────────────┐│
│ │ [Captain] Elon Musk (S-Tier) ││
│ │ [S-Tier] Vitalik (12K eng)   ││
│ │ [A-Tier] Joe (8K eng)        ││
│ │ [B-Tier] Alice (2K eng)      ││
│ │ [C-Tier] Bob (800 eng)       ││
│ └───────────────────────────────┘│
│                                 │
│ Total Cost: $10                 │
│                                 │
│ Wallet Balance: $245            │
│ ┌─────────────────────────────┐ │
│ │ [Enter with Wallet Balance] │ │
│ │       [Add Funds First]     │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Edit Team] [Cancel]            │
└─────────────────────────────────┘
```

### Route Structure
```typescript
// Navigation flow
/contests                    // Screen 1: Browse
  ↓ (tap "ENTER")
/contests/:id/confirm        // Screen 2: Confirm entry fee
  ↓ (tap "Continue to Draft")
/draft/:contestId            // Screen 3: Form team
  ↓ (tap "Review Entry")
/checkout/:contestId         // Screen 4: Payment
  ↓ (tap "Confirm Entry")
/contests/:id/leaderboard    // Success → See leaderboard
```

### Component Code (Entry Flow)
```typescript
// ContestBrowser.tsx
export function ContestBrowser() {
  const { data: contests } = useGetContests();

  return (
    <div className="space-y-4 pb-24">
      <div className="sticky top-0 bg-gray-950 p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold mb-4">Contests</h1>
        <FilterBar onFilter={setFilters} />
      </div>

      <div className="space-y-3 px-4">
        {contests?.map(contest => (
          <ContestCard
            key={contest.id}
            contest={contest}
            onEnter={() => navigate(`/contests/${contest.id}/confirm`)}
          />
        ))}
      </div>
    </div>
  );
}

// ContestConfirm.tsx
export function ContestConfirm() {
  const { contestId } = useParams();
  const { data: contest } = useGetContest(contestId);

  return (
    <div className="space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold">{contest.name}</h1>

      <div className="bg-gray-900 rounded-lg p-4 space-y-2">
        <InfoRow label="Entry Fee" value={`$${contest.entryFee}`} />
        <InfoRow label="Prize Pool" value={`$${contest.prizePool}`} />
        <InfoRow label="Players" value={contest.playerCount} />
        <InfoRow label="Starts" value={formatTime(contest.startTime)} />
      </div>

      <div className="flex gap-2 fixed bottom-0 left-0 right-0 p-4 bg-gray-950 border-t border-gray-800">
        <button className="flex-1" onClick={() => navigate(-1)}>Cancel</button>
        <button
          className="flex-1 bg-gold-500 text-black font-bold rounded-lg py-3"
          onClick={() => navigate(`/draft/${contestId}`)}
        >
          Continue to Draft
        </button>
      </div>
    </div>
  );
}
```

### Decision Tree
```
User enters contest:
├─ Has deposited funds? → Go to draft directly
└─ No funds yet? → Show deposit step before draft

After contest starts:
├─ User hasn't entered? → Show "Contest in progress" + wait for next one
└─ User in contest? → Go to leaderboard (live updates)
```

---

## Pattern 5: Empty States

### Problem
"Nothing to display" should invite action, not dead-end.

### Empty Contests (Home Page)
```
┌─────────────────────────────────┐
│                                 │
│          🏆 (Large Icon)        │
│                                 │
│     No Active Contests          │
│                                 │
│ Next contest starts Monday      │
│        12:00 UTC                │
│                                 │
│  [🔔 Set Reminder]              │
│  [📋 Browse Contests]           │
│                                 │
└─────────────────────────────────┘
```

### No Teams Drafted (Draft Page)
```
┌─────────────────────────────────┐
│                                 │
│      👥 (Large Icon)            │
│                                 │
│   Your Team is Empty            │
│                                 │
│ Draft your first team in 2 min  │
│ Earn points based on influencer │
│        activity                 │
│                                 │
│   [⚡ Start Drafting]           │
│   [👀 See Example Team]         │
│                                 │
└─────────────────────────────────┘
```

### No Activity (Activity Feed)
```
┌─────────────────────────────────┐
│                                 │
│      📊 (Large Icon)            │
│                                 │
│    Nothing Here Yet             │
│                                 │
│  Activity appears when you enter│
│           a contest             │
│                                 │
│  Check back after 12:00 UTC Mon │
│                                 │
│   [View Leaderboard]            │
│   [Learn Scoring]               │
│                                 │
└─────────────────────────────────┘
```

### Component Code
```typescript
// EmptyState.tsx
export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  illustrationUrl
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center space-y-4">
      {illustrationUrl ? (
        <img src={illustrationUrl} alt={title} className="w-24 h-24" />
      ) : (
        <Icon className="w-20 h-20 text-gray-600" />
      )}

      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-400 max-w-sm">{description}</p>

      <div className="flex gap-3 pt-4">
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="px-6 py-2 bg-gold-500 text-black font-bold rounded-lg"
          >
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}

// Usage on Home page
<EmptyState
  icon={TrophyIcon}
  title="No Active Contests"
  description="Next contest starts Monday 12:00 UTC"
  primaryAction={{ label: '🔔 Set Reminder', onClick: () => {} }}
  secondaryAction={{ label: '📋 Browse Contests', onClick: () => navigate('/contests') }}
/>
```

### Decision Tree
```
When to show empty state?
├─ No contests available? → EmptyState + Reminder CTA
├─ User has no team? → EmptyState + Draft CTA
├─ No activity yet? → EmptyState + Educate CTA
└─ Data loading? → Use Skeleton loader instead (not empty state)
```

---

## Pattern 6: Activity Feed

### Problem
Static leaderboards feel dead. Activity feeds create FOMO and engagement.

### Visual
```
┌─────────────────────────────────┐
│ ACTIVITY (Last 20 Events)       │
├─────────────────────────────────┤
│                                 │
│ Sarah just entered              │
│ "Monday Night Elite"            │
│ 2 minutes ago                   │
│ [👤 Follow] [👁 View]           │
│                                 │
│ Mike finished with 142 pts      │
│ placed 2nd, won $180            │
│ 8 minutes ago                   │
│ [❤️ Like] [💬 Comment]          │
│                                 │
│ Alice drafted new team          │
│ S: Elon, A: Vitalik, ...        │
│ 15 minutes ago                  │
│ [👀 View Team]                  │
│                                 │
│ Joe entered "Daily Challenge"   │
│ 22 minutes ago                  │
│ [👤 Follow]                     │
│                                 │
│ ☐ [Auto-refresh every 30s]      │
└─────────────────────────────────┘
```

### Component Code
```typescript
// ActivityFeed.tsx
export function ActivityFeed() {
  const { data: activities, isLoading } = useGetActivities({ limit: 20 });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      refetchActivities();
      setLastUpdate(new Date());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3 px-4 py-4">
      <div className="text-xs text-gray-500 text-center pb-2">
        Updates every 30 seconds (Last: {formatDistanceToNow(lastUpdate, { addSuffix: true })})
      </div>

      {activities?.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}

// ActivityCard.tsx
function ActivityCard({ activity }) {
  return (
    <div className="bg-gray-900 rounded-lg p-3 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="font-bold text-sm">
            {activity.user.name}
            <span className="text-gray-500 font-normal ml-2">
              {getActivityLabel(activity.type)}
            </span>
          </div>

          {activity.detail && (
            <div className="text-xs text-gray-400 mt-1">
              {activity.detail}
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2">
            {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
          </div>
        </div>

        <img
          src={activity.user.avatar}
          alt={activity.user.name}
          className="w-10 h-10 rounded-lg ml-2"
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-800">
        {activity.type === 'contest_entry' && (
          <>
            <button className="flex-1 text-xs py-1 text-gold-500 hover:bg-gray-800 rounded">
              👤 Follow
            </button>
            <button className="flex-1 text-xs py-1 text-gray-400 hover:bg-gray-800 rounded">
              👁 View
            </button>
          </>
        )}
        {activity.type === 'finish' && (
          <>
            <button className="flex-1 text-xs py-1 text-gray-400 hover:bg-gray-800 rounded">
              ❤️ Like
            </button>
            <button className="flex-1 text-xs py-1 text-gray-400 hover:bg-gray-800 rounded">
              💬 Comment
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Helper
function getActivityLabel(type) {
  const labels = {
    contest_entry: 'just entered a contest',
    team_draft: 'drafted a new team',
    finish: 'finished with a placement',
    follow: 'is now following',
    like: 'liked a team'
  };
  return labels[type] || type;
}
```

### Decision Tree
```
What activities to show?
├─ Contest entries → "User X just entered Contest Y"
├─ Team drafts → "User X drafted new team: S, A, B, C"
├─ Contest finishes → "User X finished 2nd, won $180"
└─ Follows/Likes? → Only if user is interested (Phase 2)

Auto-refresh rate?
├─ 30 seconds (feels alive, not chaotic)
└─ Can be disabled in settings (for low-bandwidth users)

Show all activities or just friends?
├─ Start with "All activities" (maximizes FOMO)
└─ Add filter tabs later: "All | Friends | Influencers"
```

---

## Pattern 7: Celebration Modal

### Problem
Celebration should celebrate the winner, not rub in loser faces.

### Visual
```
┌─────────────────────────────────┐
│ 🎯                              │
│                                 │
│      NICE FINISH!               │
│                                 │
│   You're in the Elite tier      │
│        (Top 12%)                │
│                                 │
│  Final Score: 152 pts           │
│  Prize Won: $240                │
│  Rank: #145 of 1,234            │
│                                 │
│  [🐦 Share on Twitter]          │
│  [✕ Close]                      │
│                                 │
└─────────────────────────────────┘
```

### Component Code
```typescript
// CelebrationModal.tsx
export function CelebrationModal({ rank, percentile, tier, score, prize, onShare, onClose }) {
  const handleShare = async () => {
    const shareData = {
      title: `I placed Top ${percentile}% on Foresight!`,
      text: `Just earned $${prize} with my team. Draft yours: `,
      url: window.location.origin
    };

    try {
      await navigator.share(shareData);
    } catch (e) {
      // Fallback to Twitter intent
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `I placed Top ${percentile}% on Foresight! 🎯 Earned $${prize} with my team. Join the game:`
      )}&url=${encodeURIComponent(window.location.origin)}`;
      window.open(twitterUrl, '_blank');
    }
    onShare();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 border-gold-500">
        <div className="space-y-6 py-8 text-center">
          {/* Icon */}
          <div className="text-5xl animate-pulse">🎯</div>

          {/* Title */}
          <h2 className="text-2xl font-bold">Nice Finish!</h2>

          {/* Tier badge */}
          <div>
            <div className="text-3xl font-bold text-gold-500">{tier} Tier</div>
            <div className="text-gray-400">Top {percentile}%</div>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Final Score:</span>
              <span className="font-bold">{score} pts</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Prize Won:</span>
              <span className="text-gold-500 font-bold">${prize}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-800 pt-2">
              <span className="text-gray-400">Your Rank:</span>
              <span className="font-bold">#{rank} of 1,234</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleShare}
              className="w-full bg-gold-500 text-black font-bold py-3 rounded-lg hover:bg-gold-600"
            >
              🐦 Share on Twitter
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-800 text-gray-300 py-3 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

### When to Show
```typescript
// LeaderboardView.tsx
useEffect(() => {
  if (contest.isFinished && userScore) {
    const userPercentile = calculatePercentile(userScore, allScores);

    // Show if top 10%
    if (userPercentile <= 10) {
      showCelebrationModal(userPercentile);
    }
  }
}, [contest.isFinished, userScore]);
```

### Decision Tree
```
When to show celebration modal?
├─ Contest just finished? → Check if top 10%
├─ Top 10%? → Show with tier badge + share
└─ Below top 10%? → Show subtle notification instead (no modal)

What not to do?
├─ Don't show confetti → Feels cheap
├─ Don't play celebration sound → Annoys users
├─ Don't auto-share → Let user decide
└─ Don't mock losers → "You came close!" messages hurt retention
```

---

## Pattern 8: Leaderboard Segmentation

### Problem
Comparing casual players ($10) to whales ($1K) kills motivation.

### Option A: Contest Leaderboards (Default)
```
┌─────────────────────────────────┐
│ Monday Night Elite LEADERBOARD  │
├─────────────────────────────────┤
│ (50 players in this contest)    │
│                                 │
│ 1  Sarah      156 pts   $240    │
│ 2  Mike       142 pts   $180    │
│ 3  Alex       138 pts   $120    │
│ ...                             │
│ 15 YOU        95 pts    $0      │ ← Highlighted
│ ...                             │
│ 50 Charlie    12 pts    $0      │
│                                 │
│ [All Contests ▼] [By Tier]      │
└─────────────────────────────────┘
```

### Option B: Tier Leaderboards (Secondary Tab)
```
┌─────────────────────────────────┐
│ LEADERBOARDS                    │
├─────────────────────────────────┤
│ [By Contest ◀ By Tier]          │
│                                 │
│ S-TIER TOP PLAYERS              │
│ 1  Elon      4240 pts           │
│ 2  Vitalik   3890 pts           │
│ 3  Joe       3450 pts           │
│ ...                             │
│ 47 YOU       1240 pts           │ ← Your position
│ ...                             │
│ 100 Charlie  245 pts            │
│                                 │
│ [S-Tier ◀ ▶ A-Tier]              │
└─────────────────────────────────┘
```

### Component Code
```typescript
// LeaderboardTabs.tsx
export function LeaderboardTabs({ contestId }) {
  const [tab, setTab] = useState('contest'); // 'contest' | 'tier'

  return (
    <div className="space-y-4">
      {/* Tab selector */}
      <div className="flex gap-2 px-4 border-b border-gray-800">
        <button
          onClick={() => setTab('contest')}
          className={`py-3 font-bold border-b-2 ${
            tab === 'contest'
              ? 'border-gold-500 text-gold-500'
              : 'border-transparent text-gray-500'
          }`}
        >
          By Contest
        </button>
        <button
          onClick={() => setTab('tier')}
          className={`py-3 font-bold border-b-2 ${
            tab === 'tier'
              ? 'border-gold-500 text-gold-500'
              : 'border-transparent text-gray-500'
          }`}
        >
          By Tier
        </button>
      </div>

      {/* Content */}
      {tab === 'contest' && (
        <ContestLeaderboard contestId={contestId} />
      )}
      {tab === 'tier' && (
        <TierLeaderboards contestId={contestId} />
      )}
    </div>
  );
}

// TierLeaderboards.tsx
function TierLeaderboards({ contestId }) {
  const tiers = ['S', 'A', 'B', 'C'];
  const [selectedTier, setSelectedTier] = useState('S');
  const { data: leaderboard } = useGetTierLeaderboard(selectedTier);
  const { data: userRank } = useGetUserTierRank(selectedTier);

  return (
    <div className="space-y-4 px-4">
      {/* Tier selector */}
      <div className="flex gap-2">
        {tiers.map(tier => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`flex-1 py-2 rounded font-bold ${
              selectedTier === tier
                ? 'bg-gold-500 text-black'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            {tier}-Tier
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {leaderboard?.map((entry, idx) => (
          <LeaderboardEntry
            key={entry.userId}
            rank={idx + 1}
            entry={entry}
            highlight={entry.userId === currentUserId}
          />
        ))}
      </div>

      {/* Your rank (if not visible in leaderboard) */}
      {userRank && !leaderboard?.some(e => e.userId === currentUserId) && (
        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-2">YOUR RANK</div>
          <LeaderboardEntry
            rank={userRank.rank}
            entry={userRank}
            highlight
          />
        </div>
      )}
    </div>
  );
}
```

### Decision Tree
```
Which leaderboard to show?
├─ Contest ongoing? → Contest leaderboard (primary)
├─ Contest finished? → Contest leaderboard (final results)
└─ Browsing? → Tier leaderboards (global stats)

Should global leaderboard be visible?
├─ Player in top 10%? → Yes, always
└─ Player below top 10%? → Hide until they improve (psychological safety)

Segment by entry fee?
├─ Only if fee varies 10x+ ($10 vs $1K)
└─ Otherwise, tier segmentation is enough
```

---

## Summary: Decision Framework for Implementation

### Priority 1 (CRITICAL)
- **Pattern 1:** Percentile rankings
- **Pattern 2:** 30-second live updates
- **Pattern 3:** Visual formation card
- **Pattern 4:** Entry flow <2 min

### Priority 2 (IMPORTANT)
- **Pattern 5:** Empty states
- **Pattern 6:** Activity feed
- **Pattern 8:** Leaderboard segmentation

### Priority 3 (NICE TO HAVE)
- **Pattern 7:** Celebration modal

### For Every Screen
- Test on iPhone 12 Pro (375px width)
- Touch targets ≥44px
- No hover-only interactions
- 30s refresh for live data

---

**Document Status:** Ready for development
**Last Updated:** February 27, 2026
**Feedback?** Tag @design in PRs for pattern review
