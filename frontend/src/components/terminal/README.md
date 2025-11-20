# Foresight Terminal Components

**Revolutionary terminal-inspired UI for CT league prediction platform**

This directory contains the core components for the "Foresight Terminal" - a Bloomberg-terminal-inspired interface featuring Dynamic NFT identity cards and real-time prediction tracking.

---

## 📦 Components

### 1. DynamicNFTCard

**The hero component** - displays user's Dynamic NFT with real-time stats.

**Features:**
- 5 level designs (ORACLE → NOVICE)
- Real-time score updates
- Animated streak waveform
- Success/error flash animations
- Loading skeleton state
- Empty state for new users

**Usage:**

```tsx
import { DynamicNFTCard } from './components/terminal/DynamicNFTCard';
import { useNFTData } from './hooks/terminal/useNFTData';

function Dashboard() {
  const { stats, isLoading } = useNFTData();

  return (
    <DynamicNFTCard
      stats={stats}
      isLoading={isLoading}
      onViewProfile={() => navigate('/profile')}
    />
  );
}
```

**Props:**

```typescript
interface DynamicNFTCardProps {
  stats: UserStats | null;        // User stats from contract
  isLoading?: boolean;             // Show skeleton loader
  onViewProfile?: () => void;      // Optional CTA handler
}
```

---

### 2. NFTArtwork

**SVG artwork generator** - renders dynamic NFT based on level and stats.

**Features:**
- 5 unique level icons (star, crystal ball, eye, sprout, target)
- Animated accuracy ring
- Streak particles (0-10)
- Radial gradient backgrounds
- Subtle grid pattern overlay

**Usage:**

```tsx
import { NFTArtwork } from './components/terminal/NFTArtwork';
import { getForesightData } from './utils/terminal/foresightCalculator';

function ProfilePicture() {
  const foresightData = getForesightData(stats);

  return (
    <NFTArtwork
      level={foresightData.level}
      levelColor={foresightData.levelColor}
      accuracy={foresightData.accuracy}
      streak={foresightData.streakCount}
      animated={true}
    />
  );
}
```

**Props:**

```typescript
interface NFTArtworkProps {
  level: ForesightLevel;        // ORACLE | PROPHET | SEER | APPRENTICE | NOVICE
  levelColor: string;           // Hex color for level
  accuracy: number;             // 0-100
  streak: number;               // Current streak count
  animated?: boolean;           // Enable animations (default: true)
}
```

---

### 3. StreakWaveform

**Animated gradient bar** - visualizes streak with flowing gradient.

**Features:**
- Smooth width transitions
- Flowing gradient animation
- Success/error flash overlays
- Max streak capping (default: 10)

**Usage:**

```tsx
import { StreakWaveform } from './components/terminal/StreakWaveform';

function StreakDisplay() {
  const [streak, setStreak] = useState(3);
  const [showFlash, setShowFlash] = useState<'success' | 'error' | null>(null);

  function onCorrectPrediction() {
    setShowFlash('success');
    setStreak(prev => prev + 1);
    setTimeout(() => setShowFlash(null), 800);
  }

  return (
    <StreakWaveform
      streak={streak}
      maxStreak={10}
      animated={true}
      showFlash={showFlash}
    />
  );
}
```

**Props:**

```typescript
interface StreakWaveformProps {
  streak: number;               // Current streak count
  maxStreak?: number;           // Max streak for 100% width (default: 10)
  animated?: boolean;           // Enable animations (default: true)
  showFlash?: 'success' | 'error' | null;  // Flash overlay
}
```

---

## 🔧 Hooks

### useNFTData

**Custom hook** - fetches user stats from ReputationEngine contract.

**Features:**
- Automatic wallet detection
- Real-time updates (5s interval)
- Loading states
- Manual refetch function

**Usage:**

```tsx
import { useNFTData } from './hooks/terminal/useNFTData';

function Component() {
  const { stats, isLoading, isConnected, address, refetch } = useNFTData();

  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return <DynamicNFTCard stats={stats} />;
}
```

**Returns:**

```typescript
{
  stats: UserStats | null;      // Contract data
  isLoading: boolean;            // Loading state
  isConnected: boolean;          // Wallet connection
  address: `0x${string}` | undefined;  // User address
  refetch: () => void;           // Manual refetch
}
```

---

## 🧮 Utilities

### foresightCalculator

**Utility functions** - calculate levels, colors, and stats.

**Key Functions:**

```typescript
// Get level based on score (0-100)
getForesightLevel(score: number): ForesightLevel

// Get level color
getLevelColor(level: ForesightLevel): string

// Get level emoji
getLevelEmoji(level: ForesightLevel): string

// Calculate accuracy percentage
calculateAccuracy(stats: UserStats): number

// Get complete foresight data
getForesightData(stats: UserStats): ForesightData

// Calculate glow intensity (0-1)
getGlowIntensity(streak: number): number

// Get progress to next level (0-100)
getProgressToNextLevel(score: number, level: ForesightLevel): number
```

**Usage:**

```tsx
import {
  getForesightData,
  getForesightLevel,
  getLevelColor,
} from './utils/terminal/foresightCalculator';

const stats: UserStats = {
  totalPredictions: 10n,
  resolvedPredictions: 8n,
  correctPredictions: 6n,
  currentStreak: 3n,
  foresightScore: 67n,
};

const data = getForesightData(stats);
// {
//   level: 'SEER',
//   levelColor: '#00d9ff',
//   levelEmoji: '👁️',
//   levelDescription: 'Strong prediction skills',
//   accuracy: 75,
//   streakCount: 3,
//   scoreValue: 67,
// }
```

---

## 🎨 Design System

### CSS Variables

All terminal components use CSS variables defined in `styles/terminal.css`:

**Colors:**
```css
--bg-primary: #0a0e14
--neon-cyan: #00d9ff
--success-green: #00ff88
--error-red: #ff4466
```

**Level Colors:**
```css
--oracle-gold: #ffd700
--prophet-purple: #9945ff
--seer-cyan: #00d9ff
--apprentice-blue: #0066ff
--novice-gray: #6e7681
```

**Typography:**
```css
--text-xs: 0.6875rem    /* 11px */
--text-sm: 0.8125rem    /* 13px */
--text-base: 0.9375rem  /* 15px */
--text-xl: 1.5rem       /* 24px */
--text-2xl: 2rem        /* 32px */
```

**Spacing:**
```css
--space-2: 0.5rem    /* 8px */
--space-4: 1rem      /* 16px */
--space-6: 1.5rem    /* 24px */
```

### Animations

Import animations from `styles/animations.css`:

```tsx
// Use utility classes
<div className="animate-slide-in-up" />
<div className="animate-pulse-glow" />
<div className="animate-shimmer" />

// Or use @keyframes directly
animation: flashSuccess 0.8s ease-out
animation: waveformFlow 2s linear infinite
```

---

## 📱 Mobile Optimization

All components are optimized for **640px max width** (Farcaster miniapp constraint):

**Best Practices:**
- Use `max-w-sm` or `max-w-md` for cards
- Center components with `mx-auto`
- Use `p-4` for mobile padding
- Ensure tap targets are minimum 44x44px

**Example:**

```tsx
<div className="max-w-sm mx-auto p-4">
  <DynamicNFTCard stats={stats} />
</div>
```

---

## 🚀 Performance

### Optimization Tips

**1. Memoize NFT rendering:**

```tsx
import { memo } from 'react';

const MemoizedNFT = memo(DynamicNFTCard, (prev, next) => {
  return prev.stats?.foresightScore === next.stats?.foresightScore
    && prev.stats?.currentStreak === next.stats?.currentStreak;
});
```

**2. Lazy load modals:**

```tsx
const CreatePredictionModal = lazy(() => import('./modals/CreatePredictionModal'));

<Suspense fallback={<LoadingSpinner />}>
  {showModal && <CreatePredictionModal />}
</Suspense>
```

**3. Debounce contract reads:**

```tsx
const debouncedRefetch = debounce(refetch, 1000);
```

---

## 🐛 Troubleshooting

### NFT not rendering

**Issue:** NFT shows gray box instead of artwork

**Solution:**
- Check that `stats` is not null
- Verify `foresightScore` is a valid bigint
- Ensure CSS variables are loaded

### Animations not working

**Issue:** Components don't animate

**Solution:**
- Import `animations.css` in `index.css`
- Check `animated` prop is set to `true`
- Verify Framer Motion is installed

### Hook returns null

**Issue:** `useNFTData` always returns null stats

**Solution:**
- Ensure wallet is connected
- Verify `REPUTATION_ENGINE_ADDRESS` is correct
- Check network (should be Base Sepolia)
- Look for ABI mismatches

### Flash animation not triggering

**Issue:** Success/error flash doesn't show

**Solution:**
- Pass `showFlash` prop to StreakWaveform
- Reset `showFlash` to null after 800ms
- Check that score actually changed

---

## 🎯 Examples

### Complete Dashboard Example

```tsx
import { DynamicNFTCard } from './components/terminal/DynamicNFTCard';
import { useNFTData } from './hooks/terminal/useNFTData';
import './styles/terminal.css';
import './styles/animations.css';

export default function TerminalDashboard() {
  const { stats, isLoading, isConnected } = useNFTData();

  if (!isConnected) {
    return <ConnectWalletPrompt />;
  }

  return (
    <div className="min-h-screen terminal-grid p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-glow-cyan">
          Foresight Terminal
        </h1>

        <DynamicNFTCard
          stats={stats}
          isLoading={isLoading}
          onViewProfile={() => navigate('/profile')}
        />

        {/* Add more components */}
      </div>
    </div>
  );
}
```

### Standalone NFT Display

```tsx
import { NFTArtwork } from './components/terminal/NFTArtwork';
import { getForesightData } from './utils/terminal/foresightCalculator';

function ShareableNFT({ stats }: { stats: UserStats }) {
  const data = getForesightData(stats);

  return (
    <div className="w-80 h-80">
      <NFTArtwork
        level={data.level}
        levelColor={data.levelColor}
        accuracy={data.accuracy}
        streak={data.streakCount}
        animated={false} // Static for sharing
      />
    </div>
  );
}
```

---

## 📄 Type Reference

### UserStats

```typescript
interface UserStats {
  totalPredictions: bigint;
  resolvedPredictions: bigint;
  correctPredictions: bigint;
  currentStreak: bigint;
  foresightScore: bigint;
}
```

### ForesightData

```typescript
interface ForesightData {
  level: ForesightLevel;
  levelColor: string;           // Hex color
  levelEmoji: string;
  levelDescription: string;
  accuracy: number;             // 0-100
  streakCount: number;
  scoreValue: number;           // 0-100
}
```

### ForesightLevel

```typescript
type ForesightLevel =
  | 'ORACLE'      // 90-100 score
  | 'PROPHET'     // 75-89 score
  | 'SEER'        // 60-74 score
  | 'APPRENTICE'  // 40-59 score
  | 'NOVICE';     // 0-39 score
```

---

## 🔗 Related Files

- `/docs/FORESIGHT_TERMINAL_MVP_SPEC.md` - Complete specification
- `/frontend/src/config/abis.ts` - Contract ABIs
- `/frontend/src/config/wagmi.ts` - Wagmi configuration
- `/contracts/src/ReputationEngine.sol` - Smart contract

---

**Questions?** See the full MVP spec or reach out to the team.

**Version:** 1.0.0
**Last Updated:** 2025-11-15
