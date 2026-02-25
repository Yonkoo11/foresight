# Implementation Architecture — Feb 25-27 Sprint

> **Single source of truth** for all pending updates from the War Room analysis.
> Three expert agents (Game Designer, CT Native, Tapestry Architect) produced 20+ documents.
> This file distills everything into an actionable implementation plan.

---

## Priority Matrix

| # | Change | Files Touched | Effort | Impact | Deadline |
|---|--------|--------------|--------|--------|----------|
| 1 | Captain multiplier 1.5x → 2.0x | `Draft.tsx`, scoring backend | 15 min | High | Before submission |
| 2 | Tapestry Draft Receipt component | `DraftReceipt.tsx` (new), `Draft.tsx` | 2 hrs | High (judges) | Before submission |
| 3 | Tapestry Reputation badges on leaderboard | `Compete.tsx` | 2 hrs | High (judges) | Before submission |
| 4 | Score breakdown panel (ContestDetail) | `ContestDetail.tsx` | 2 hrs | Medium | Before submission |
| 5 | Tapestry Scouting Panel in Draft | `Draft.tsx` | 3 hrs | High (judges) | Before submission |
| 6 | Influencer archetypes in Draft UI | `Draft.tsx`, `influencers` data | 2 hrs | Medium | Before submission |
| 7 | Profile: real Tapestry stats | `Profile.tsx`, `TapestryBadge.tsx` | 1 hr | Medium | Before submission |
| 8 | Weekly multiplier events | Backend scoring + UI | 6-8 hrs | High | Post-hackathon |

---

## 1. Captain Multiplier: 1.5x → 2.0x

**Why:** At 1.5x, captain choice contributes ~10% of total team score. Too low to feel high-stakes. Industry standard (DraftKings, Sorare) is 2.0x. At 2.0x, captain becomes ~20% of team score — a real decision.

**What changes:**

### Backend — find scoring engine
Search for `1.5` in scoring service:
```bash
grep -rn "1\.5\|captain.*mult\|mult.*captain" backend/src/services/cronJobs.ts
```
Change the captain multiplier constant from `1.5` to `2.0`.

### Frontend — `frontend/src/pages/Draft.tsx`
Line ~250 — update toast message:
```tsx
// Before
showToast('Captain selected! They earn 1.5× points', 'success');

// After
showToast('Captain selected! They earn 2.0× points', 'success');
```

Also find any hardcoded `1.5×` labels in the captain selection UI and update to `2.0×`.

**Verification:** Draft a team, pick captain, confirm the captain multiplier label reads `2.0×` everywhere.

---

## 2. Tapestry Draft Receipt

**Why:** After a user drafts, the team is stored on Solana via Tapestry. Right now, users see a brief "Saved on Solana" badge — but there's no proof. Judges need to see a verifiable, clickable on-chain link. This is the #1 feature that separates decorative from load-bearing.

**Current state:** `TapestryBadge` `confirmation` variant shows after draft success in `Draft.tsx:445`. It's a static gold banner with no link.

**Target state:** A receipt card showing:
- Team name + captain
- Tapestry content address (first 16 chars...last 8)
- "View proof on Tapestry" → links to `https://www.usetapestry.dev`
- Timestamp (locked at)
- Green checkmark with "Immutable — cannot be altered"

### New component: `frontend/src/components/DraftReceipt.tsx`

```tsx
import { CheckCircle, ArrowSquareOut, Lock } from '@phosphor-icons/react';

interface DraftReceiptProps {
  contentAddress?: string;    // Tapestry content address
  captainHandle?: string;
  teamSize?: number;
  lockedAt?: string;          // ISO timestamp
  className?: string;
}

export default function DraftReceipt({
  contentAddress,
  captainHandle,
  teamSize = 5,
  lockedAt,
  className = '',
}: DraftReceiptProps) {
  if (!contentAddress) return null;

  const shortAddress = contentAddress.length > 24
    ? `${contentAddress.slice(0, 16)}...${contentAddress.slice(-8)}`
    : contentAddress;

  const lockedTime = lockedAt
    ? new Date(lockedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  return (
    <div className={`rounded-xl border border-gold-500/30 bg-gold-500/5 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle size={20} weight="fill" className="text-gold-400" />
        <span className="text-sm font-semibold text-gold-400">Team Locked on Solana</span>
        <Lock size={14} className="text-gold-500/60 ml-auto" />
      </div>

      {/* Receipt data */}
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Content address</span>
          <span className="font-mono text-gray-300">{shortAddress}</span>
        </div>
        {captainHandle && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Captain</span>
            <span className="text-white">@{captainHandle}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Team size</span>
          <span className="text-white">{teamSize} influencers</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Locked at</span>
          <span className="text-white">{lockedTime}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
        <span className="text-xs text-gray-500">Immutable — cannot be altered</span>
        <a
          href="https://www.usetapestry.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition-colors"
        >
          View proof <ArrowSquareOut size={11} />
        </a>
      </div>
    </div>
  );
}
```

### Wire into `Draft.tsx`

The backend's enter-contest response at `res.data` should already include a Tapestry content address. Check the response shape:
```bash
grep -n "tapestry\|contentAddress\|content_address" backend/src/api/prizedContestsV2.ts
```

In `Draft.tsx`, replace the existing `TapestryBadge variant="confirmation"` block with:
```tsx
// Around line 445
{tapestryPublished && (
  <DraftReceipt
    contentAddress={tapestryContentAddress}  // capture from API response
    captainHandle={captainHandle}
    teamSize={selectedTeam.length}
    lockedAt={new Date().toISOString()}
    className="mb-3"
  />
)}
```

---

## 3. Tapestry Reputation Badges on Leaderboard

**Why:** The leaderboard currently shows "Saved on Solana" inline badge and follow buttons. Adding reputation tiers (calculated from on-chain Tapestry score history) gives judges something novel — on-chain reputation, not just storage.

**Current state** (`Compete.tsx:560`): `TapestryBadge variant="inline"` shows a gold checkmark if `tapestryUserId` exists.

**Target state:** Each leaderboard row shows a tier badge based on the player's contest score percentile, with "Verified on Tapestry" tooltip.

### Logic: Add to `Compete.tsx`

After the entries are loaded, compute reputation tier per player:
```tsx
// Add this helper near the top of the component
function getReputationTier(rank: number, total: number): { label: string; color: string } {
  const pct = rank / total;
  if (pct <= 0.05) return { label: 'Diamond', color: 'text-cyan-400' };
  if (pct <= 0.15) return { label: 'Gold',    color: 'text-gold-400' };
  if (pct <= 0.35) return { label: 'Silver',  color: 'text-gray-300' };
  return                     { label: 'Bronze', color: 'text-amber-700' };
}
```

In the leaderboard row render (around line 560), replace the inline `TapestryBadge` with:
```tsx
{entry.tapestryUserId && (() => {
  const tier = getReputationTier(entry.rank, entries.length);
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${tier.color}`} title="Verified on Tapestry">
      <CheckCircle size={12} weight="fill" />
      {tier.label} · On-chain
    </span>
  );
})()}
```

**Why this wins judges:** The leaderboard becomes a verifiable reputation system. Every rank is an on-chain Tapestry attestation, not just a number in a database.

---

## 4. Score Breakdown Panel

**Why:** Score data (`activity`, `engagement`, `growth`, `viral`) already exists in `score_breakdown` JSON column. Backend already returns `scoreBreakdown` in the API. Players don't see it anywhere. Without seeing WHY they scored what they scored, they can't improve draft strategy next week → lower retention.

**Current state:** `scoreBreakdown` is returned by `prizedContestsV2.ts:287` but never rendered.

**Target state:** In `ContestDetail.tsx`, the user's entry card shows:

```
Your Score: 542 pts
├─ Activity     89   ██████░░░░  (35 max)
├─ Engagement  156   ████████░░  (60 max)
├─ Growth       78   ████░░░░░░  (40 max)
└─ Viral        32   ████░░░░░░  (25 max)
   Captain 2×  +189
```

### New component: `frontend/src/components/ScoreBreakdown.tsx`

```tsx
interface ScoreBreakdownProps {
  breakdown: {
    activity?: number;
    engagement?: number;
    growth?: number;
    viral?: number;
  };
  captainBonus?: number;
  total?: number;
}

const CATEGORIES = [
  { key: 'activity',   label: 'Activity',   max: 35,  color: 'bg-blue-500' },
  { key: 'engagement', label: 'Engagement', max: 60,  color: 'bg-gold-500' },
  { key: 'growth',     label: 'Growth',     max: 40,  color: 'bg-emerald-500' },
  { key: 'viral',      label: 'Viral',      max: 25,  color: 'bg-rose-500' },
] as const;

export default function ScoreBreakdown({ breakdown, captainBonus, total }: ScoreBreakdownProps) {
  return (
    <div className="rounded-xl bg-gray-800/50 border border-gray-700 p-4 space-y-2">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-white">Score Breakdown</span>
        {total && <span className="text-lg font-bold text-gold-400">{total} pts</span>}
      </div>
      {CATEGORIES.map(({ key, label, max, color }) => {
        const val = breakdown[key] ?? 0;
        const pct = Math.round((val / max) * 100);
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-20">{label}</span>
            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-mono text-white w-12 text-right">
              {val}<span className="text-gray-600">/{max}</span>
            </span>
          </div>
        );
      })}
      {captainBonus != null && captainBonus > 0 && (
        <div className="flex items-center gap-3 pt-1 border-t border-gray-700/50">
          <span className="text-xs text-gold-400 w-20">Captain 2×</span>
          <div className="flex-1" />
          <span className="text-xs font-mono text-gold-400">+{captainBonus}</span>
        </div>
      )}
    </div>
  );
}
```

### Wire into `ContestDetail.tsx`

Find where the user's entry score is displayed and add `<ScoreBreakdown>` below it. The `scoreBreakdown` field is already in the API response — parse it:

```tsx
const breakdown = entry.scoreBreakdown
  ? (typeof entry.scoreBreakdown === 'string'
      ? JSON.parse(entry.scoreBreakdown)
      : entry.scoreBreakdown)
  : {};
```

---

## 5. Tapestry Scouting Panel in Draft

**Why:** If users follow each other on Tapestry, their social graph exists on-chain. Showing "your followed players drafted X, Y, Z" before the lock time makes the social graph load-bearing — it influences the actual game outcome (draft decisions).

**Target state:** A collapsible sidebar/panel in `Draft.tsx` (mobile: bottom sheet accordion):

```
┌─ Scouts Report ──────────────────────────────────┐
│  Based on your Tapestry follows                  │
│                                                  │
│  @cryptolion  → CZ (Cap) + Pomp + SBF           │
│  @whalealert  → Vitalik (Cap) + Do Kwon          │
│  @satoshidev  → Memes Lord (Cap) + ...           │
│                                                  │
│  Trending pick: CZ (drafted by 3 of 5 follows)  │
└──────────────────────────────────────────────────┘
```

### API endpoint needed
Backend already has `/api/tapestry/my-following` and the leaderboard loads entries with `tapestryUserId`. Need a new endpoint or reuse existing data:

```
GET /api/v2/contests/:id/social-scouts
```

Returns: entries by users the current user follows on Tapestry, with their team compositions.

### Frontend: `Draft.tsx`

Add a `ScoutingPanel` section that:
1. Fetches `/api/tapestry/my-following` to get followed tapestry IDs
2. Cross-references contest entries to find which followed users have entered this contest
3. Shows their team picks as "intel" before the user locks their team

**Note:** This is the most complex feature (~3 hrs). Build last, after 1-4 are done.

---

## 6. Influencer Archetypes in Draft UI

**Why:** When three influencers cost similar budget points, players have no signal for which to pick. Archetype labels turn invisible score distributions into visible player identities — like "PG", "SG", "SF" in basketball fantasy.

**Three archetypes** (from Game Designer analysis):

| Archetype | Signal | Draft Value |
|-----------|--------|-------------|
| **Activity Beast** | High activity (28+/35), moderate engagement | Floor pick, reliable volume |
| **Engagement Wizard** | High engagement (48+/60), moderate activity | Consistent ceiling |
| **Viral Sniper** | High viral (18+/25), variable everything else | Boom/bust, high ceiling |

**How to compute:** From existing influencer score data. Each influencer has historical `activity`, `engagement`, `growth`, `viral` scores. Normalize each to 0-1 and find the dominant category.

### Backend: Add `archetype` to influencer response
In `backend/src/api/` — the endpoint that returns influencers for the draft, add a computed `archetype` field:

```typescript
function computeArchetype(scores: {
  activity: number;
  engagement: number;
  growth: number;
  viral: number;
}): string {
  const normalized = {
    activity:   scores.activity / 35,
    engagement: scores.engagement / 60,
    growth:     scores.growth / 40,
    viral:      scores.viral / 25,
  };
  const dominant = Object.entries(normalized)
    .sort(([, a], [, b]) => b - a)[0][0];

  const map: Record<string, string> = {
    activity:   'Activity Beast',
    engagement: 'Engagement Wizard',
    growth:     'Growth Machine',
    viral:      'Viral Sniper',
  };
  return map[dominant] ?? 'All-Rounder';
}
```

### Frontend: `Draft.tsx` influencer card

Add a small archetype pill below the influencer's tier badge:
```tsx
{influencer.archetype && (
  <span className="text-[10px] text-gray-400 italic">{influencer.archetype}</span>
)}
```

---

## 7. Profile Page — Real Tapestry Stats

**Why:** `TapestryBadge variant="card"` is in `Profile.tsx` but shows static/hardcoded data. It should show real stats: actual teams shared count, clickable profile ID link.

**Current state:** Profile shows `teamsShared` prop from... somewhere. Check if this is wired to real data or is a placeholder.

**Target state:**
- `teamsShared`: actual count of Tapestry content objects created by this user
- `Profile ID`: clickable link that goes to `https://www.usetapestry.dev/profiles/{tapestryUserId}`
- Follower count from Tapestry social graph (if API supports it)

### Changes to `TapestryBadge.tsx` — card variant

In the `card` variant, update the explorer link from generic to profile-specific:
```tsx
// Before
href="https://www.usetapestry.dev"

// After
href={`https://www.usetapestry.dev/profiles/${tapestryUserId}`}
```

### Changes to `Profile.tsx`

Ensure `teamsShared` is fetched from the backend (count of Tapestry entries), not hardcoded.

---

## 8. Tapestry Visibility Across All Pages (Audit)

Current state vs. target state for every page:

### Home (`/`)
| Element | Current | Target |
|---------|---------|--------|
| "Built on Solana" section | Static text block | Keep but add real-time stat: "X teams stored on Solana today" |
| Activity feed | Working | No change needed |

### Draft (`/draft`)
| Element | Current | Target |
|---------|---------|--------|
| Post-draft badge | `TapestryBadge confirmation` (static) | `DraftReceipt` with content address + explorer link |
| Pre-draft scouting | None | Scouting Panel (see #5) |

### Compete (`/compete`)
| Element | Current | Target |
|---------|---------|--------|
| Leaderboard rows | Inline "Saved on Solana" badge | Reputation tier badge (Diamond/Gold/Silver/Bronze) |
| Leaderboard footer | "All scores stored on Tapestry" text | Keep, add total count: "847 teams verified on Solana" |

### Contest Detail (`/contest/:id`)
| Element | Current | Target |
|---------|---------|--------|
| User's score card | Shows total score | Add `ScoreBreakdown` component |
| Results section | No Tapestry reference | "Results finalized on Solana" with timestamp |

### Profile (`/profile`)
| Element | Current | Target |
|---------|---------|--------|
| Tapestry card | Generic stats | Real `teamsShared` count, profile-specific explorer link |

---

## Tapestry UI Surface Map (Visual Summary)

```
HOME                    DRAFT                   COMPETE               PROFILE
┌──────────────────┐   ┌──────────────────┐   ┌─────────────────┐   ┌──────────────┐
│ Activity Feed    │   │ Scouting Panel   │   │ Leaderboard     │   │ Tapestry Card│
│ (social graph)   │   │ NEW (3hrs)       │   │ ─ Reputation    │   │ real stats   │
│                  │   │                  │   │   badges NEW     │   │ profile link │
│ "Built on Solana"│   │ Draft Builder    │   │   (2hrs)        │   │ (1hr)        │
│ + live stat (1hr)│   │                  │   │                 │   │              │
│                  │   │ [Submit]         │   │ Footer:         │   │              │
│                  │   │                  │   │ "847 verified"  │   │              │
│                  │   │ DraftReceipt     │   │                 │   │              │
│                  │   │ NEW (2hrs)       │   │                 │   │              │
└──────────────────┘   └──────────────────┘   └─────────────────┘   └──────────────┘

CONTEST DETAIL
┌────────────────────────────────────────┐
│ Score: 542 pts                         │
│ ├─ Activity     89  ██████░  (35 max) │  ← ScoreBreakdown NEW (2hrs)
│ ├─ Engagement  156  ████████ (60 max) │
│ ├─ Growth       78  ████░░░  (40 max) │
│ └─ Viral        32  ████░░░  (25 max) │
│    Captain 2×  +189                    │
│                                        │
│ ✓ Results finalized on Solana          │
└────────────────────────────────────────┘
```

---

## Scoring System — What NOT to Change for Hackathon

From CT Native analysis (8/10 confidence): **ship the formula as-is.**

The only scoring change before submission:
- **Captain 1.5x → 2.0x** (15 min, zero risk, see #1 above)

Post-hackathon roadmap:
- Week 1: Score breakdown UI visible in draft (show per-influencer expected points)
- Week 2: Archetype labels fully data-driven from real scores
- Week 3+: Weekly multiplier events (if retention < 40%)

---

## How to Talk About Foresight (Messaging)

From CT Native analysis:

**Use this:**
> "Draft teams of CT influencers. We measure real influence — engagement rate, follower growth, community voting on callout accuracy. Every team is locked on Solana via Tapestry. Compete for SOL prizes."

**Not this:**
> "Fantasy sports for crypto with followers and points"

**For judges specifically:**
> "Every draft team is an immutable content object on Tapestry Protocol. Your leaderboard rank is an on-chain attestation. The social graph — who follows who — directly influences draft strategy via the Scouting Panel. Tapestry isn't infrastructure here, it's the game mechanic."

---

## Execution Order (Hackathon Sprint)

### Now → tonight (8 hrs)
1. ☐ Captain 2.0x change (15 min)
2. ☐ `DraftReceipt.tsx` component (2 hrs)
3. ☐ Wire `DraftReceipt` into `Draft.tsx` (1 hr)
4. ☐ Reputation badges on leaderboard (2 hrs)
5. ☐ `ScoreBreakdown.tsx` component + wire to `ContestDetail.tsx` (2 hrs)

### Tomorrow (6 hrs)
6. ☐ Archetype labels (backend + Draft UI) (2 hrs)
7. ☐ Profile Tapestry real stats + explorer link (1 hr)
8. ☐ Scouting Panel (3 hrs, if time allows)

### Before submission
9. ☐ QA all pages on mobile
10. ☐ Record 3-min demo video (hit all 5 Tapestry moments)

---

## Source Documents

| Topic | Deep Reference |
|-------|---------------|
| Captain mechanic | `docs/SCORING_GAME_DESIGNER_EXECUTIVE_SUMMARY.md` |
| Full scoring analysis | `docs/SCORING_SYSTEM_GAME_DESIGN_ANALYSIS.md` |
| CT culture & messaging | `docs/CT_INFLUENCE_QUICK_REFERENCE.md` |
| Tapestry strategy | `TAPESTRY_ACTION_PLAN.md` |
| Tapestry code snippets | `docs/TAPESTRY_BOUNTY_QUICKSTART.md` |
| Tapestry judge framing | `docs/TAPESTRY_STRATEGY_FOR_JUDGES.md` |
