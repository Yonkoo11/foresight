# Foresight Terminal MVP - Technical Specification

> **Goal:** Build a mobile-first "Bloomberg terminal for predictions" with Dynamic NFT identity as the core UI element.

**Target:** 4-week MVP → User testing → Iterate
**Constraint:** 640px max width (Farcaster miniapp optimized)
**Quality Bar:** Top 0.0001% craft and polish

---

## 📋 Table of Contents

1. [Scope](#scope)
2. [User Flows](#user-flows)
3. [Visual Design System](#visual-design-system)
4. [Component Architecture](#component-architecture)
5. [Dynamic NFT Specifications](#dynamic-nft-specifications)


6. [Terminal Interactions](#terminal-interactions)
7. [Technical Requirements](#technical-requirements)
8. [Performance Budgets](#performance-budgets)
9. [Acceptance Criteria](#acceptance-criteria)

---

## 🎯 Scope

### ✅ MVP Includes (Week 1-4)

**Pages:**
1. **Dashboard** (Dynamic NFT Hero + Terminal View)
2. **Prediction Creation** (Full-screen modal)
3. **Profile** (NFT showcase + stats)

**Features:**
- Dynamic NFT rendering (5 foresight levels)
- Live prediction tape (horizontal scroll)
- Streak visualization (glowing waveform)
- Real-time stat updates
- Terminal aesthetic (dark mode only)
- Mobile-optimized animations

### ❌ MVP Excludes (Post-MVP)

- CT Draft integration
- CT Whisperer integration
- Leaderboard (global)
- Historical analytics dashboard
- Desktop-specific layouts
- Social sharing (screenshots)
- Multiple color themes

---

## 🚶 User Flows

### Flow 1: First-Time User Arrival

```
1. User opens miniapp
   ↓
2. Wallet connection prompt (RainbowKit modal)
   ↓
3. Dashboard loads with:
   - Default "NOVICE" NFT (no predictions yet)
   - Empty prediction tape
   - "Create Your First Prediction" CTA
   ↓
4. User taps NFT card → Full-screen modal
   ↓
5. Prediction creation form
   ↓
6. Lock prediction onchain
   ↓
7. NFT updates in real-time (optimistic UI)
   ↓
8. Dashboard shows:
   - Updated NFT with "1 Active" badge
   - New prediction in tape
```

### Flow 2: Returning User (Active Predictions)

```
1. Dashboard loads
   ↓
2. Dynamic NFT shows current level (e.g., SEER - 67 score)
   ↓
3. Prediction tape auto-scrolls to show:
   - Recent activity
   - Predictions ready to mark
   ↓
4. User swipes tape → finds expired prediction
   ↓
5. Tap prediction card → Mark Outcome modal
   ↓
6. Choose TRUE/FALSE
   ↓
7. NFT re-renders with updated:
   - Accuracy
   - Streak (flash animation if correct)
   - Level up animation (if threshold crossed)
```

### Flow 3: Status Check (Quick Visit)

```
1. Dashboard loads
   ↓
2. User sees NFT + current rank badge
   ↓
3. Checks prediction tape for updates
   ↓
4. Exits (no action needed)
```

---

## 🎨 Visual Design System

### Color Palette (Terminal Dark Mode)

```css
/* Base */
--bg-primary: #0a0e14;       /* Deep charcoal */
--bg-secondary: #0f1419;     /* Slightly lighter charcoal */
--bg-tertiary: #1a1f29;      /* Card backgrounds */

/* Accents */
--neon-cyan: #00d9ff;        /* Primary accent */
--neon-blue: #0066ff;        /* Secondary accent */
--success-green: #00ff88;    /* Correct predictions */
--error-red: #ff4466;        /* Incorrect predictions */

/* Text */
--text-primary: #e6edf3;     /* Main text */
--text-secondary: #8b949e;   /* Muted text */
--text-tertiary: #6e7681;    /* Disabled/placeholder */

/* NFT Level Colors (dynamic) */
--oracle-gold: #ffd700;      /* 90-100 */
--prophet-purple: #9945ff;   /* 75-89 */
--seer-cyan: #00d9ff;        /* 60-74 */
--apprentice-blue: #0066ff;  /* 40-59 */
--novice-gray: #6e7681;      /* 0-39 */
```

### Typography

```css
/* Font: Lexend (already in use) */
--font-primary: 'Lexend', sans-serif;

/* Sizes (mobile-first) */
--text-xs: 11px;     /* Tape timestamps */
--text-sm: 13px;     /* Secondary info */
--text-base: 15px;   /* Body text */
--text-lg: 18px;     /* Card titles */
--text-xl: 24px;     /* NFT stats */
--text-2xl: 32px;    /* Foresight score */
--text-3xl: 48px;    /* Level title */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System (8px base)

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Border Radius

```css
--radius-sm: 6px;    /* Small elements */
--radius-md: 10px;   /* Cards */
--radius-lg: 16px;   /* NFT card */
--radius-xl: 24px;   /* Modals */
```

---

## 🧩 Component Architecture

### 1. Dashboard Layout

```
┌─────────────────────────────────┐
│         Header (48px)           │ ← Wallet + Notifications
├─────────────────────────────────┤
│                                 │
│   Dynamic NFT Hero Card         │
│     (360px height)              │ ← Center of gravity
│                                 │
├─────────────────────────────────┤
│   Quick Stats Row               │ ← 3 metrics
├─────────────────────────────────┤
│   Prediction Tape               │
│   (Horizontal Scroll)           │ ← Live activity feed
├─────────────────────────────────┤
│   Bottom Nav (56px)             │ ← Tab navigation
└─────────────────────────────────┘
```

**Responsive Behavior:**
- Max width: 640px
- Padding: 16px horizontal
- Scroll: Vertical (except tape)

### 2. Dynamic NFT Hero Card

**Dimensions:**
- Width: 100% (max 320px centered)
- Height: 360px
- Aspect ratio: 1:1.125 (portrait card)

**Structure:**

```
┌───────────────────────────┐
│  ┌─────────────────────┐  │
│  │                     │  │ ← Glow aura (level-based color)
│  │   NFT Artwork       │  │
│  │   (SVG rendered)    │  │
│  │                     │  │
│  └─────────────────────┘  │
│                           │
│  🌟 SEER                  │ ← Level badge
│  ━━━━━━━━━━━━━━━━━━━━━  │ ← Streak waveform
│                           │
│  Foresight Score: 67      │ ← Large number
│  12 Predictions • 75% Acc │ ← Sub-stats
│                           │
│  [View Full Profile]      │ ← CTA button
└───────────────────────────┘
```

**Visual States:**
- Default: Subtle pulse animation
- Hover: Glow intensifies
- Tap: Scale down 0.98 → bounce back
- Update: Flash + re-render animation

### 3. NFT Artwork SVG (Simplified for MVP)

**5 Level Designs:**

Each level has:
- **Background gradient** (level color → darker)
- **Central icon** (geometric shape)
- **Accuracy ring** (circular progress bar)
- **Streak particles** (animated dots)

**Example: SEER Level**

```svg
<svg viewBox="0 0 320 320">
  <!-- Background -->
  <defs>
    <radialGradient id="seerGlow">
      <stop offset="0%" stop-color="#00d9ff" />
      <stop offset="100%" stop-color="#0a0e14" />
    </radialGradient>
  </defs>
  <rect fill="url(#seerGlow)" width="320" height="320"/>

  <!-- Accuracy Ring -->
  <circle cx="160" cy="160" r="120"
    stroke="#00d9ff" stroke-width="4"
    stroke-dasharray="754"
    stroke-dashoffset="calculated-based-on-accuracy"
    fill="none" opacity="0.6"/>

  <!-- Central Icon (Eye for SEER) -->
  <g transform="translate(160, 160)">
    <path d="..." fill="#00d9ff"/> <!-- Eye shape -->
  </g>

  <!-- Streak Particles (if streak > 0) -->
  <circle cx="200" cy="100" r="3" fill="#00ff88" opacity="0.8">
    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
  </circle>
  <!-- ... more particles based on streak -->

  <!-- Stats Text -->
  <text x="160" y="280" text-anchor="middle"
    font-family="Lexend" font-size="18" fill="#e6edf3">
    67% Accuracy
  </text>
</svg>
```

**Performance Optimization:**
- Pre-render 5 base templates
- Only update dynamic values (accuracy ring offset, streak particles)
- Use CSS animations for glow/pulse (not JS)

### 4. Streak Waveform Bar

**Visual:**
```
━━━━━━━━━━━━━━━━━━━━━━━
↑ Animated gradient flow (left to right)
```

**Implementation:**

```tsx
<div className="streak-waveform">
  <div
    className="waveform-fill"
    style={{
      width: `${(streak / 10) * 100}%`, // Max streak 10
      background: 'linear-gradient(90deg, #00ff88, #00d9ff)',
      animation: 'flow 2s linear infinite'
    }}
  />
</div>

// CSS
@keyframes flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}
```

**Interaction:**
- Correct prediction → Flash bright + grow
- Incorrect prediction → Flash red + reset
- Duration: 800ms ease-out

### 5. Quick Stats Row

```
┌──────────┬──────────┬──────────┐
│ Active   │ Accuracy │ Streak   │
│   5      │   75%    │   3🔥    │
└──────────┴──────────┴──────────┘
```

**Design:**
- Equal width columns
- Icon + Number + Label
- Subtle borders (--bg-tertiary)
- Tap to expand tooltip (future)

### 6. Prediction Tape (Horizontal Scroll)

**Visual:**
```
← [Card] [Card] [Card] [Card] [Card] →
  ↑ Snap scroll
```

**Card Structure:**

```
┌─────────────────────┐
│ "ETH hits $5k..."   │ ← Prediction text (truncated)
│ 15 days remaining   │ ← Time left
│ ━━━━━━━━━━━━━━━━━  │ ← Progress bar
│ 0.1 ETH staked      │ ← Stake amount
└─────────────────────┘
```

**Card States:**
- **Active:** Blue border, timer counting
- **Ready to mark:** Green pulse border
- **Resolved (correct):** Green background glow
- **Resolved (wrong):** Red background glow

**Scroll Behavior:**
- Snap to card
- Horizontal drag
- Show 1.5 cards at a time (peek next)
- Auto-scroll to "ready to mark" on load

**Animation:**
```css
/* Card entrance (stagger) */
.prediction-card {
  animation: slideIn 0.4s ease-out;
  animation-delay: calc(var(--index) * 0.1s);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### 7. Prediction Creation Modal

**Full-screen overlay:**

```
┌─────────────────────────────────┐
│ [X] Close                       │
├─────────────────────────────────┤
│                                 │
│  Lock New Prediction            │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Write prediction...     │   │
│  │ (500 char max)          │   │
│  └─────────────────────────┘   │
│                                 │
│  Duration:                      │
│  [30] [60] [90] days            │
│                                 │
│  Stake (optional):              │
│  [0.01] [0.05] [0.1] [Custom]   │
│                                 │
│  [Lock Prediction] ← Neon button│
└─────────────────────────────────┘
```

**Interactions:**
- Slide up from bottom (300ms)
- Backdrop blur
- Auto-focus text input
- Character counter (live)
- Duration pills (single select)
- Stake presets (single select + custom input)

**Validation:**
- Min 10 chars
- Max 500 chars
- Duration required
- Stake optional (default 0)

---

## 🔮 Dynamic NFT Specifications

### Level System (Based on Foresight Score)

| Level | Score Range | Color | Icon | Description |
|-------|-------------|-------|------|-------------|
| 🌟 ORACLE | 90-100 | Gold (#ffd700) | Star | Legendary foresight |
| 🔮 PROPHET | 75-89 | Purple (#9945ff) | Crystal ball | Exceptional accuracy |
| 👁️ SEER | 60-74 | Cyan (#00d9ff) | Eye | Strong prediction skills |
| 🌱 APPRENTICE | 40-59 | Blue (#0066ff) | Sprout | Building track record |
| 🎯 NOVICE | 0-39 | Gray (#6e7681) | Target | Just getting started |

### NFT Rendering Logic

**Inputs (from contract):**
```typescript
interface UserStats {
  totalPredictions: number;
  resolvedPredictions: number;
  correctPredictions: number;
  currentStreak: number;
  foresightScore: number; // 0-100
}
```

**Derived Values:**
```typescript
const accuracy = resolvedPredictions > 0
  ? (correctPredictions / resolvedPredictions) * 100
  : 0;

const level =
  foresightScore >= 90 ? 'ORACLE' :
  foresightScore >= 75 ? 'PROPHET' :
  foresightScore >= 60 ? 'SEER' :
  foresightScore >= 40 ? 'APPRENTICE' : 'NOVICE';

const levelColor = {
  ORACLE: '#ffd700',
  PROPHET: '#9945ff',
  SEER: '#00d9ff',
  APPRENTICE: '#0066ff',
  NOVICE: '#6e7681'
}[level];

const glowIntensity = Math.min(currentStreak / 10, 1); // 0-1
```

**SVG Generation Strategy:**

```typescript
// Option 1: Template-based (Fast, MVP approach)
function generateNFT(stats: UserStats) {
  const template = NFT_TEMPLATES[level];
  return template
    .replace('{{COLOR}}', levelColor)
    .replace('{{ACCURACY}}', accuracy.toFixed(0))
    .replace('{{STREAK_PARTICLES}}', generateStreakParticles(currentStreak))
    .replace('{{RING_OFFSET}}', calculateRingOffset(accuracy));
}

// Option 2: Component-based (Flexible, better for iteration)
function NFTArtwork({ stats }: { stats: UserStats }) {
  return (
    <svg viewBox="0 0 320 320">
      <Background color={levelColor} />
      <AccuracyRing accuracy={accuracy} color={levelColor} />
      <LevelIcon level={level} />
      <StreakParticles count={currentStreak} />
      <StatsText accuracy={accuracy} />
    </svg>
  );
}
```

**Recommendation for MVP:** Use Option 2 (React component) for easier iteration.

### Animation Triggers

**1. On Prediction Locked:**
```
NFT Card:
  → Pulse animation (500ms)
  → Update "Active" count
  → Flash cyan glow

Prediction Tape:
  → New card slides in from right
  → Auto-scroll to new card
```

**2. On Outcome Marked (Correct):**
```
NFT Card:
  → Flash green (00ff88)
  → Streak waveform extends + flow animation
  → If accuracy improves: Ring animates to new value
  → If level up: Explosion animation + color transition

Prediction Tape:
  → Card background flashes green
  → Card moves to "resolved" section
```

**3. On Outcome Marked (Incorrect):**
```
NFT Card:
  → Flash red (ff4466)
  → Streak waveform resets (fade out animation)
  → If accuracy drops: Ring animates down
  → If level down: Fade to new color

Prediction Tape:
  → Card background flashes red
  → Card moves to "resolved" section
```

---

## 🎬 Terminal Interactions

### Live Prediction Tape Features

**Data Points (per prediction):**
- Prediction text (truncated to 60 chars)
- Time remaining / Time since resolved
- Stake amount (if any)
- Creator address (truncated)
- Status: Active / Ready / Resolved

**Scroll Behavior:**
```typescript
// Snap scrolling
<div className="prediction-tape" style={{
  display: 'flex',
  gap: '12px',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  padding: '16px',
}}>
  {predictions.map((pred, i) => (
    <PredictionCard
      key={pred.id}
      {...pred}
      style={{ scrollSnapAlign: 'start' }}
    />
  ))}
</div>
```

**Auto-scroll Logic:**
```typescript
useEffect(() => {
  const readyPredictions = predictions.filter(p => p.status === 'ready');
  if (readyPredictions.length > 0) {
    // Scroll to first ready prediction
    const element = document.getElementById(`pred-${readyPredictions[0].id}`);
    element?.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }
}, [predictions]);
```

### Micro-Animations (Terminal Feel)

**1. Typing Indicator (when creating prediction):**
```tsx
<span className="typing-indicator">
  <span>•</span>
  <span>•</span>
  <span>•</span>
</span>

// CSS
.typing-indicator span {
  animation: blink 1.4s infinite;
}
.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}
```

**2. Data Loading Shimmer:**
```tsx
<div className="shimmer-card">
  <div className="shimmer-line w-3/4"></div>
  <div className="shimmer-line w-1/2"></div>
</div>

// CSS
.shimmer-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 0%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

**3. Success Flash:**
```tsx
const [showSuccess, setShowSuccess] = useState(false);

// Trigger on successful transaction
setShowSuccess(true);
setTimeout(() => setShowSuccess(false), 800);

<div className={`nft-card ${showSuccess ? 'flash-success' : ''}`}>
  {/* NFT content */}
</div>

// CSS
.flash-success {
  animation: successFlash 0.8s ease-out;
}

@keyframes successFlash {
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7); }
  50% { box-shadow: 0 0 30px 10px rgba(0, 255, 136, 0.4); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0); }
}
```

---

## ⚙️ Technical Requirements

### Tech Stack (Already in place)

```json
{
  "framework": "React 19",
  "bundler": "Vite",
  "styling": "Tailwind CSS",
  "web3": {
    "wallet": "RainbowKit",
    "hooks": "wagmi v2",
    "client": "viem"
  },
  "routing": "React Router",
  "state": "@tanstack/react-query",
  "animations": "Framer Motion (add for MVP)"
}
```

### New Dependencies to Add

```bash
pnpm add framer-motion           # Smooth animations
pnpm add react-intersection-observer  # Scroll-based animations
pnpm add date-fns                # Time formatting
```

### File Structure

```
frontend/src/
├── components/
│   ├── terminal/
│   │   ├── DynamicNFTCard.tsx       ← Hero NFT component
│   │   ├── NFTArtwork.tsx           ← SVG generator
│   │   ├── StreakWaveform.tsx       ← Animated bar
│   │   ├── PredictionTape.tsx       ← Horizontal scroll
│   │   ├── PredictionCard.tsx       ← Individual card
│   │   ├── QuickStats.tsx           ← Stats row
│   │   └── TerminalShimmer.tsx      ← Loading states
│   ├── modals/
│   │   ├── CreatePredictionModal.tsx
│   │   └── MarkOutcomeModal.tsx
│   └── ui/
│       ├── Button.tsx               ← Neon button component
│       ├── Input.tsx                ← Terminal-styled input
│       └── Badge.tsx                ← Status badges
├── pages/
│   ├── Dashboard.tsx                ← Main terminal view
│   ├── Profile.tsx                  ← Full NFT showcase
│   └── History.tsx                  ← (Future)
├── hooks/
│   ├── useNFTData.tsx               ← Fetch user stats
│   ├── usePredictions.tsx           ← Fetch predictions
│   └── useTerminalAnimations.tsx    ← Shared animation logic
├── utils/
│   ├── nftGenerator.ts              ← NFT SVG generation
│   ├── foresightCalculator.ts      ← Score calculations
│   └── formatters.ts                ← Date/number formatting
└── styles/
    ├── terminal.css                 ← Terminal-specific styles
    └── animations.css               ← Keyframe animations
```

### Smart Contract Integration

```typescript
// hooks/useNFTData.tsx
import { useAccount, useReadContract } from 'wagmi';
import { REPUTATION_ENGINE_ABI, REPUTATION_ENGINE_ADDRESS } from '@/config';

export function useNFTData() {
  const { address } = useAccount();

  const { data: stats, isLoading } = useReadContract({
    address: REPUTATION_ENGINE_ADDRESS,
    abi: REPUTATION_ENGINE_ABI,
    functionName: 'getUserStats',
    args: [address],
    watch: true, // Real-time updates
  });

  const { data: foresightScore } = useReadContract({
    address: REPUTATION_ENGINE_ADDRESS,
    abi: REPUTATION_ENGINE_ABI,
    functionName: 'calculateForesight',
    args: [address],
    watch: true,
  });

  return {
    stats,
    foresightScore,
    isLoading,
  };
}
```

### Optimistic UI Updates

```typescript
// When user marks outcome, update UI immediately
const { writeContract } = useWriteContract();

async function markOutcome(predictionId: bigint, success: boolean) {
  // 1. Optimistic update
  const optimisticStats = calculateOptimisticStats(currentStats, success);
  setOptimisticData(optimisticStats);

  // 2. Trigger animation
  triggerResultAnimation(success);

  // 3. Send transaction
  try {
    await writeContract({
      address: TIMECASTER_ADDRESS,
      abi: TIMECASTER_ABI,
      functionName: 'markOutcome',
      args: [predictionId, success],
    });

    // 4. Wait for confirmation, then refetch real data
    await waitForTransaction();
    refetch();
  } catch (error) {
    // 5. Revert optimistic update on error
    setOptimisticData(null);
    showErrorToast();
  }
}
```

---

## 📊 Performance Budgets

### Load Time Targets (3G Network)

| Metric | Target | Max |
|--------|--------|-----|
| First Contentful Paint (FCP) | < 1.5s | 2s |
| Largest Contentful Paint (LCP) | < 2.5s | 3s |
| Time to Interactive (TTI) | < 3.5s | 5s |
| NFT Render Time | < 100ms | 200ms |
| Animation Frame Rate | 60 fps | 50 fps |

### Bundle Size Targets

| Asset | Target | Max |
|-------|--------|-----|
| Initial JS | < 150 KB | 200 KB |
| Initial CSS | < 20 KB | 30 KB |
| NFT SVG | < 10 KB | 15 KB |
| Total Initial Load | < 200 KB | 300 KB |

### Optimization Strategies

**1. Code Splitting:**
```typescript
// Lazy load modals
const CreatePredictionModal = lazy(() => import('./modals/CreatePredictionModal'));
const MarkOutcomeModal = lazy(() => import('./modals/MarkOutcomeModal'));

// Preload on hover
<button
  onMouseEnter={() => import('./modals/CreatePredictionModal')}
  onClick={() => setShowModal(true)}
>
  Create Prediction
</button>
```

**2. SVG Optimization:**
```typescript
// Memoize NFT generation
const NFTArtwork = memo(({ stats }: { stats: UserStats }) => {
  // Only re-render if stats actually changed
  return <svg>...</svg>;
}, (prev, next) => {
  return prev.stats.foresightScore === next.stats.foresightScore
    && prev.stats.currentStreak === next.stats.currentStreak;
});
```

**3. Image Optimization:**
- Use WebP for any raster images
- Inline critical SVGs
- Lazy load below-fold content

**4. Animation Performance:**
```css
/* Use GPU-accelerated properties only */
.animated-element {
  /* ✅ Good */
  transform: translateX(100px);
  opacity: 0.5;

  /* ❌ Avoid */
  /* margin-left: 100px; */
  /* width: 50%; */
}

/* Enable hardware acceleration */
.nft-card {
  will-change: transform;
  transform: translateZ(0);
}
```

---

## ✅ Acceptance Criteria

### Functional Requirements

**Dashboard:**
- [ ] Dynamic NFT renders correctly for all 5 levels
- [ ] NFT updates in real-time when stats change
- [ ] Streak waveform animates smoothly
- [ ] Quick stats show accurate data
- [ ] Prediction tape scrolls horizontally with snap
- [ ] "Ready to mark" predictions are highlighted
- [ ] Auto-scroll works on first load

**Prediction Creation:**
- [ ] Modal slides in smoothly (300ms)
- [ ] Text input has character counter
- [ ] Duration pills work (single select)
- [ ] Stake presets work (single select + custom)
- [ ] Validation prevents invalid submissions
- [ ] Success shows optimistic UI update
- [ ] Error shows clear message + revert

**Prediction Marking:**
- [ ] Modal shows correct prediction details
- [ ] TRUE/FALSE buttons are clear
- [ ] Correct outcome triggers green flash + streak animation
- [ ] Incorrect outcome triggers red flash + streak reset
- [ ] Level up shows celebration animation
- [ ] NFT re-renders with new stats

**Performance:**
- [ ] LCP < 2.5s on 3G
- [ ] NFT renders in < 100ms
- [ ] All animations run at 60fps
- [ ] No layout shift (CLS < 0.1)
- [ ] Works offline (shows cached data)

### Visual Quality

**Typography:**
- [ ] All text uses Lexend font
- [ ] Font sizes match spec
- [ ] Line heights provide good readability
- [ ] No text overflow/truncation issues

**Spacing:**
- [ ] Consistent 8px spacing system
- [ ] No cramped elements
- [ ] Proper breathing room around NFT card
- [ ] Mobile padding is 16px minimum

**Colors:**
- [ ] Terminal dark theme throughout
- [ ] Neon cyan accents are vibrant
- [ ] Success/error colors are distinct
- [ ] Text contrast meets WCAG AA (4.5:1)

**Animations:**
- [ ] All animations use easing functions (no linear)
- [ ] Durations feel natural (300-800ms range)
- [ ] No janky or stuttering animations
- [ ] Reduced motion preference is respected

### Mobile Optimization

**640px Constraint:**
- [ ] No horizontal scroll (except prediction tape)
- [ ] NFT card is centered and properly sized
- [ ] Tap targets are minimum 44x44px
- [ ] Text is readable without zoom
- [ ] Modals don't overflow viewport

**Touch Interactions:**
- [ ] Tap feedback is immediate (< 100ms)
- [ ] Swipe scrolling feels smooth
- [ ] No accidental taps on small elements
- [ ] Pull-to-refresh is disabled (or shows correct state)

### Edge Cases

**No Predictions Yet:**
- [ ] Shows empty state with CTA
- [ ] NFT shows default NOVICE level
- [ ] Prediction tape shows onboarding message

**Network Error:**
- [ ] Shows error state with retry button
- [ ] Cached data is shown if available
- [ ] User can still browse offline

**Slow Network:**
- [ ] Shows loading skeletons
- [ ] Optimistic UI prevents waiting
- [ ] Transaction pending states are clear

**Wallet Disconnected:**
- [ ] Shows connection prompt
- [ ] No broken states
- [ ] Reconnection works smoothly

---

## 🗓️ 4-Week Build Plan

### Week 1: Foundation
- [ ] Set up design tokens (colors, typography, spacing)
- [ ] Build base components (Button, Input, Badge)
- [ ] Implement Dashboard layout (empty state)
- [ ] Add RainbowKit wallet connection
- [ ] Set up contract read hooks

### Week 2: NFT System
- [ ] Build NFTArtwork SVG component
- [ ] Implement 5 level designs
- [ ] Add accuracy ring animation
- [ ] Build StreakWaveform component
- [ ] Integrate real contract data
- [ ] Test NFT rendering performance

### Week 3: Prediction System
- [ ] Build PredictionTape component
- [ ] Implement PredictionCard states
- [ ] Add horizontal scroll + snap
- [ ] Build CreatePredictionModal
- [ ] Build MarkOutcomeModal
- [ ] Add optimistic UI updates
- [ ] Implement contract write functions

### Week 4: Polish & Testing
- [ ] Add all micro-animations
- [ ] Implement loading states
- [ ] Add error handling
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility audit
- [ ] Deploy to staging

---

## 🚀 Next Steps

1. **Review this spec** - Share with team, gather feedback
2. **Create Figma mockups** - Design before code (optional but recommended)
3. **Set up development environment** - Install Framer Motion, etc.
4. **Start with Week 1 tasks** - Foundation first
5. **Daily standups** - Track progress, unblock issues
6. **Week 2 demo** - Show NFT rendering to stakeholders
7. **Week 4 user testing** - Get 10 CT users to try it
8. **Iterate based on feedback** - Week 5+ improvements

---

## 📝 Open Questions (To Decide)

1. **NFT caching strategy:**
   - Should we cache generated SVGs in localStorage?
   - Or regenerate on every page load?

2. **Prediction tape data source:**
   - Show only user's predictions?
   - Or global feed (all users)?
   - Or hybrid (user + followed accounts)?

3. **Level up animation:**
   - Confetti explosion?
   - Glow pulse?
   - Full-screen modal celebration?

4. **Offline mode:**
   - Show cached data with warning?
   - Or block access entirely?

5. **Social sharing:**
   - Generate static NFT image for Twitter?
   - Or just link to profile?

**Recommendation:** Start with simplest approach, iterate based on user feedback.

---

**End of MVP Spec**

*Last updated: 2025-11-15*
*Version: 1.0*
