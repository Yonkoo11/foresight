# Profile Page — Component Specifications

> **Purpose:** Exact component specs for implementation
> **Use this:** When building the three new components
> **Reference:** `/docs/design/DESIGN_PRINCIPLES.md`

---

## 1. PlayerStatusCard Component

### Location
`/frontend/src/components/PlayerStatusCard.tsx`

### Purpose
Merge old "FS Score card" + "Experience Level card" into single focal point.

### Props
```typescript
interface PlayerStatusCardProps {
  // Primary metric
  score: number;                    // e.g., 1135
  tier: string;                     // e.g., "SILVER"
  badge?: string;                   // e.g., "Founder #18"

  // Ranking context
  thisWeekRank?: number;            // e.g., 1
  seasonRank?: number;              // e.g., 2
  allTimeRank?: number;             // e.g., 8

  // Boost state (optional)
  boost?: {
    multiplier: number;             // e.g., 1.58
    daysLeft: number;               // e.g., 87
  };

  // XP progression (secondary)
  xpCurrent: number;                // e.g., 127
  xpLevel: string;                  // e.g., "NOVICE"
  xpProgress: number;               // 0-100, percent to next level

  // Actions
  onLeaderboardClick: () => void;
  onEarnMoreClick: () => void;
}
```

### Layout (Mobile)
```
┌───────────────────────────────┐
│ Foresight Score               │  ← text-white text-lg font-semibold
│ 1,135 FS                      │  ← text-white text-2xl font-black (HERO)
│ SILVER • Founder #18          │  ← text-sm text-gray-400
│                               │
│ This Week: #1                 │  ← text-sm text-gray-400
│ Season: #2 | All-Time: #8     │  ← text-sm text-gray-400
│                               │
│ [☐ 1.58x Active • 87 days]    │  ← Emerald pill (only if boost exists)
│ (gap only shows if boost)      │  ← mb-4 if boost, else no gap
│                               │
│ Progress to GOLD              │  ← text-xs text-gray-400
│ ████████░░░░░ 3,865 to go    │  ← Gold bar, no gradient
│                               │
│ 127 XP • Level 3 (NOVICE)     │  ← text-xs text-gray-500 (secondary)
│                               │
│ [Leaderboard] [Earn More]     │  ← Two flex-1 buttons, gap-3
└───────────────────────────────┘
```

### Styling
```tsx
// Card container
className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"

// Title
className="text-lg font-semibold text-white"

// Score number (hero)
className="text-2xl font-black text-white"

// Tier/badge
className="text-sm text-gray-400"

// Ranking
className="text-sm text-gray-400"

// Boost pill (emerald, only if active)
className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs rounded-full"

// Progress bar label
className="flex items-center justify-between text-xs text-gray-400 mb-2"

// Progress bar background
className="h-2 bg-gray-800 rounded-full overflow-hidden"

// Progress bar fill (GOLD)
className="h-full bg-gold-500 rounded-full"

// XP secondary text
className="text-xs text-gray-500"

// Buttons (flex-1 for equal width)
className="flex-1 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-gray-950 font-medium rounded-lg transition-colors"
// Inactive variant: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
```

### Boost Indicator (Emerald Pill)
Only render if `boost` prop is provided:
```tsx
{boost && (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
    <CheckCircle size={14} weight="fill" className="text-emerald-400" />
    <span className="text-xs font-medium text-emerald-400">
      {boost.multiplier}x Active • {boost.daysLeft}d left
    </span>
  </div>
)}
```

### Progress Bar
```tsx
<div className="flex items-center justify-between text-xs text-gray-400 mb-2">
  <span>Progress to GOLD</span>
  <span>{progressToNextTier} to go</span>
</div>
<div className="h-2 bg-gray-800 rounded-full overflow-hidden">
  <div
    className="h-full bg-gold-500 rounded-full transition-all"
    style={{ width: `${xpProgress}%` }}
  />
</div>
```

### Button Group
```tsx
<div className="flex gap-3">
  <button
    onClick={onLeaderboardClick}
    className="flex-1 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-gray-950 font-medium rounded-lg transition-colors"
  >
    Leaderboard
  </button>
  <button
    onClick={onEarnMoreClick}
    className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 font-medium rounded-lg transition-colors"
  >
    Earn More
  </button>
</div>
```

### Color Decisions
- **Score number:** White (primary content)
- **Progress bar:** Gold `#F59E0B` (consistent with FS Score color)
- **Boost indicator:** Emerald `#10B981` (positive state)
- **XP text:** Gray `text-gray-500` (secondary, not competing)
- **Button 1:** Gold (primary CTA)
- **Button 2:** Gray (secondary CTA)

### No Gradients
- ❌ No gradient on progress bar
- ❌ No gradient on card background
- ✅ Flat colors only

---

## 2. YourTeamCard Component

### Location
`/frontend/src/components/YourTeamCard.tsx`

### Purpose
Show current drafted team or prompt to draft. Appears on Overview tab.

### Props
```typescript
interface YourTeamCardProps {
  team?: {
    id: number;
    team_name: string;
    total_score: number;
    rank?: number;
    total_budget_used: number;
    max_budget: number;
    picks: Array<{
      id: number;
      influencer_name: string;
      influencer_handle: string;
      influencer_tier: string;
      total_points: number;
    }>;
  };
  hasTeam: boolean;
  onEdit: () => void;
  onShare: () => void;
}
```

### Layout (With Team)
```
┌───────────────────────────────────────┐
│ YOUR TEAM                             │  ← text-white text-lg font-semibold
├───────────────────────────────────────┤
│ [Formation visual: 1 captain + 4]      │  ← FormationPreview component
│                                       │
│ Team Name                             │  ← text-white font-semibold
│ 142 pts • Rank #3                     │  ← text-sm text-gray-400
│ Budget: $150 / $150                   │  ← text-xs text-gray-500
│                                       │
│ [Edit Draft]      [Share Team]        │  ← Two flex-1 buttons
└───────────────────────────────────────┘
```

### Layout (No Team)
```
┌───────────────────────────────────────┐
│ [Trophy icon]                         │  ← Trophy size={48} text-gray-600
│ No Team Yet                           │  ← text-white text-xl font-bold
│ Draft your first squad                │  ← text-gray-400 text-sm
│ [Start Drafting] →                    │  ← Gold button with ArrowRight
└───────────────────────────────────────┘
```

### Styling
```tsx
// Card container
className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"

// Header
className="text-lg font-semibold text-white mb-4"

// Team name
className="font-semibold text-white"

// Team stats
className="text-sm text-gray-400"

// Budget bar
className="text-xs text-gray-500"

// Button group
className="flex gap-3 mt-4"

// Edit button (primary)
className="flex-1 px-4 py-2.5 bg-gold-500 hover:bg-gold-600 text-gray-950 font-medium rounded-lg transition-colors"

// Share button (secondary)
className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 font-medium rounded-lg transition-colors"
```

### Empty State Icon
```tsx
<Trophy
  size={48}
  weight="fill"
  className="mx-auto mb-4 text-gray-600"
/>
```

### Formation Visual
Use existing `FormationPreview` component:
```tsx
<FormationPreview
  variant="compact"
  team={team.picks}
  showStats={false}
  showEdit={false}
/>
```

### Budget Progress Bar
```tsx
<div className="mt-3 flex items-center justify-between text-xs mb-2">
  <span className="text-gray-400">Budget Used</span>
  <span className="text-white font-medium">
    ${team.total_budget_used} / ${team.max_budget}
  </span>
</div>
<div className="h-2 bg-gray-800 rounded-full overflow-hidden">
  <div
    className="h-full bg-gold-500 rounded-full transition-all"
    style={{
      width: `${(team.total_budget_used / team.max_budget) * 100}%`
    }}
  />
</div>
```

### Button Actions
- **Edit Draft:** Navigate to `/compete?tab=contests`
- **Share Team:** Open share modal (via `onShare` callback)

---

## 3. TapestryIdentityCard Component

### Location
`/frontend/src/components/TapestryIdentityCard.tsx` (REFACTOR EXISTING)

### Purpose
Showcase on-chain identity and proof. **Moved from bottom to position #2.**

### Changes from Current
1. Add "Live on Solana" badge to header (green dot + text)
2. Reorganize stats for clarity
3. Keep all existing logic (just restructure UI)

### Props
```typescript
interface TapestryIdentityCardProps {
  connected: boolean;
  followers: number;
  following: number;
  teamsOnChain: number;
  tapestryId?: string;
  onViewHistory?: () => void;
}
```

### Layout
```
┌─────────────────────────────────────┐
│ Tapestry Protocol     ✓ Live on     │  ← Header with badge
│ Your on-chain ID      Solana        │
├─────────────────────────────────────┤
│ 0 followers                         │  ← Social counts
│ 3 following                         │
│ 2 teams locked on-chain             │
│                                     │
│ Your 2 teams are permanently        │  ← Proof message
│ recorded on Solana via Tapestry     │
│ Protocol — immutable & verifiable   │
│ by anyone.                          │
│                                     │
│ Tapestry ID: Trader...r_ohm3mi      │  ← Identity reference
│                                     │
│ [View on Solana] [Contest History] →│  ← Links
└─────────────────────────────────────┘
```

### Header with Badge
```tsx
<div className="flex items-center justify-between px-5 py-4 bg-gray-900/80 border-b border-gray-800">
  <div className="flex items-center gap-3">
    <img
      src="/tapestry-icon.png"
      alt="Tapestry"
      className="w-6 h-6 invert opacity-80"
    />
    <div>
      <h3 className="font-semibold text-white text-sm">Tapestry Protocol</h3>
      <p className="text-xs text-gray-500">Your on-chain identity</p>
    </div>
  </div>

  {connected && (
    <span className="flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Live on Solana
    </span>
  )}
</div>
```

### Social Counts
```tsx
<div className="grid grid-cols-3 gap-3 py-4">
  <div className="bg-gray-800/40 rounded-lg p-3 text-center">
    <div className="text-2xl font-bold text-white">{followers}</div>
    <div className="text-xs text-gray-500">Followers</div>
  </div>
  <div className="bg-gray-800/40 rounded-lg p-3 text-center">
    <div className="text-2xl font-bold text-white">{following}</div>
    <div className="text-xs text-gray-500">Following</div>
  </div>
  <div className="bg-gray-800/40 rounded-lg p-3 text-center">
    <div className="text-2xl font-bold text-gold-400">{teamsOnChain}</div>
    <div className="text-xs text-gray-500">Teams on-chain</div>
  </div>
</div>
```

### Proof Message
```tsx
<div className="bg-gray-800/20 rounded-lg p-4 text-sm text-gray-400 leading-relaxed">
  {teamsOnChain > 0 ? (
    <>
      Your <span className="text-white font-medium">{teamsOnChain} draft {teamsOnChain === 1 ? 'team' : 'teams'}</span> are permanently
      recorded on Solana via Tapestry Protocol — immutable and verifiable by anyone.
    </>
  ) : (
    "Submit a team to permanently record your picks on Solana via Tapestry Protocol."
  )}
</div>
```

### Identity Footer
```tsx
<div className="flex items-center justify-between pt-3 border-t border-gray-800/60">
  <div>
    <div className="text-xs text-gray-600 mb-0.5">Your Tapestry identity</div>
    <span className="font-mono text-xs text-gray-400 select-all">
      {tapestryId?.slice(0, 10)}...{tapestryId?.slice(-8)}
    </span>
  </div>
  <button
    onClick={onViewHistory}
    className="flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors font-medium"
  >
    Contest history <ArrowRight size={12} />
  </button>
</div>
```

### Color Notes
- **Live badge:** Emerald `#10B981` (matching success state)
- **Dot pulse:** Animated emerald
- **Team count:** Gold `#F59E0B` (highlight on-chain achievement)
- **Proof message:** Gray text (neutral, informational)
- **Identity ID:** Monospace gray (technical, not emphasized)
- **Link text:** Gold with hover (interactive, consistent)

---

## General Rules for All Components

### Spacing Grid
- Padding: 6px, 12px, 24px (use p-1, p-3, p-6)
- Gap between elements: 12px, 24px (use gap-3, gap-6)
- Mobile → Desktop: Same base, more breathing room on wide screens

### Responsive
- Mobile (sm): Full width stacking
- Tablet (md): Can use 2-column grids if space
- Desktop (lg): Full layout flexibility

### Touch Targets
- All buttons: `py-2.5` minimum (~44px tall)
- All clickable areas: ≥44px height for mobile
- Links: Adequate padding to make them tapable

### Transitions
- Button hover: `transition-colors` (150ms)
- Progress bar: `transition-all` (300ms)
- Opacity changes: `transition-opacity` (150ms)
- No layout shifts on hover (use `hover:` for color/opacity only)

### No Anti-Patterns
- ❌ No gradient card backgrounds (`bg-gradient-to-r`)
- ❌ No colored borders on chrome (only on badges/icons)
- ❌ No multiple gold buttons in one card (max 1 primary CTA)
- ❌ No small colored text that competes with main metric
- ❌ No purple/violet colors anywhere

---

## Testing Checklist (Per Component)

### PlayerStatusCard
- [ ] Score displays correctly (large, white, bold)
- [ ] Tier badge shows (gray text)
- [ ] Rankings all visible (week/season/all-time)
- [ ] Boost pill only shows if active (emerald)
- [ ] Progress bar fills correctly (gold color)
- [ ] XP secondary (small, gray, not competing)
- [ ] Buttons responsive (flex-1 on mobile)
- [ ] Hover states work on desktop

### YourTeamCard
- [ ] Shows team name + score + rank when team exists
- [ ] Shows empty state (Trophy icon + "No Team Yet") when no team
- [ ] Formation visual renders
- [ ] Budget bar calculates correctly
- [ ] Edit button navigates to `/compete?tab=contests`
- [ ] Share button calls callback
- [ ] Responsive at 375px, 768px, 1024px

### TapestryIdentityCard
- [ ] Live on Solana badge shows (green dot + text)
- [ ] Social counts display
- [ ] Team count shows gold color
- [ ] Proof message updates based on team count
- [ ] Tapestry ID copyable
- [ ] Links work (external + internal)
- [ ] All text readable on dark background

---

## Integration with Profile.tsx

### Import Statements
```tsx
import PlayerStatusCard from '../components/PlayerStatusCard';
import YourTeamCard from '../components/YourTeamCard';
import TapestryIdentityCard from '../components/TapestryIdentityCard';
```

### Usage in Overview Tab
```tsx
{activeTab === 'overview' && (
  <div className="space-y-6">
    <PlayerStatusCard
      score={stats.foresightScore}
      tier={stats.tier}
      badge={stats.badge}
      thisWeekRank={stats.thisWeekRank}
      seasonRank={stats.seasonRank}
      allTimeRank={stats.allTimeRank}
      boost={stats.activeBoost}
      xpCurrent={stats.xp}
      xpLevel={xpInfo.level}
      xpProgress={xpInfo.progress}
      onLeaderboardClick={() => navigate('/compete?tab=rankings')}
      onEarnMoreClick={() => navigate('/progress')}
    />

    <TapestryIdentityCard
      connected={tapestryStatus.connected}
      followers={socialCounts.followers}
      following={socialCounts.following}
      teamsOnChain={teamsOnChain}
      tapestryId={tapestryStatus.tapestryUserId}
      onViewHistory={() => setActiveTab('history')}
    />

    <YourTeamCard
      team={myTeam}
      hasTeam={!!myTeam && teamForFormation?.length >= 5}
      onEdit={() => navigate('/compete?tab=contests')}
      onShare={() => setShowShareTeam(true)}
    />
  </div>
)}
```

---

*End of component specs. Ready to code!*
