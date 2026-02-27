# Avatar Implementation Quick Start

**Time Required:** 25 minutes
**Complexity:** Low
**Risk:** Zero

---

## TL;DR

Use DiceBear pixel-art avatars for influencer cards. Deterministic, professional, zero operational friction.

---

## Step 1: Create Avatar Utility (5 min)

Create `/frontend/src/utils/avatar.ts`:

```typescript
/**
 * Avatar URL Generator
 * Generates deterministic avatars from Twitter handles
 * Uses DiceBear with graceful fallback
 */

export function getAvatarUrl(
  twitterHandle: string,
  databaseUrl?: string | null
): string {
  // If we have a real Twitter CDN URL, use it
  if (databaseUrl?.includes('pbs.twimg.com')) {
    return databaseUrl;
  }

  // Primary: DiceBear Avatars (pixel-art style)
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(
    twitterHandle
  )}&scale=80&radius=50`;
}

export default {
  getAvatarUrl,
};
```

---

## Step 2: Update Components (15 min)

For each component rendering avatars:

### Pattern 1: RisingStarsTab.tsx
```typescript
// BEFORE
{star.avatar ? (
  <img src={star.avatar} alt="" className="w-12 h-12 rounded-full" />
) : (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
    <XLogo size={20} weight="fill" className="text-white" />
  </div>
)}

// AFTER
import { getAvatarUrl } from '../../utils/avatar';

<img
  src={getAvatarUrl(star.twitter_handle, star.avatar)}
  alt={star.handle}
  className="w-12 h-12 rounded-full object-cover bg-gray-800"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    target.nextElementSibling?.classList.remove('hidden');
  }}
/>
<div className="hidden w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
  <XLogo size={20} weight="fill" className="text-white" />
</div>
```

### Pattern 2: ComparisonTool.tsx
```typescript
// BEFORE
{inf.avatar ? (
  <img src={inf.avatar} alt="" className="w-full h-full rounded-full object-cover" />
) : null}

// AFTER
import { getAvatarUrl } from '../../utils/avatar';

<img
  src={getAvatarUrl(inf.handle, inf.avatar)}
  alt={inf.name}
  className="w-full h-full rounded-full object-cover bg-gray-700"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    const initials = inf.name.split(' ').map((n: string) => n[0]).join('');
    target.outerHTML = `
      <div class="w-full h-full rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
        ${initials}
      </div>
    `;
  }}
/>
```

### Pattern 3: InfluencerDetailModal.tsx
```typescript
// Similar to RisingStarsTab — replace avatar rendering with getAvatarUrl
```

---

## Step 3: Test & Verify (5 min)

1. Import the utility in each component that needs avatars
2. Take a screenshot of pages with avatars
3. Verify:
   - No broken images
   - All avatars render consistently
   - Different handles show different avatars
   - Fallback works (test by temporarily breaking DiceBear URL)

---

## Step 4: Search for Remaining Avatars (3 min)

```bash
# Find all remaining avatar usage
grep -r "avatar" frontend/src/components --include="*.tsx" | grep -v node_modules
```

Update any missed components.

---

## File Checklist

- [ ] Create: `frontend/src/utils/avatar.ts`
- [ ] Modify: `frontend/src/components/intel/RisingStarsTab.tsx`
- [ ] Modify: `frontend/src/components/intel/ComparisonTool.tsx`
- [ ] Modify: `frontend/src/components/intel/InfluencerDetailModal.tsx`
- [ ] Verify: No other components need avatar updates
- [ ] Test: Take screenshots, verify visuals

---

## Why DiceBear pixel-art?

```
✅ Professional enough for judges
✅ Crypto-native aesthetic (retro gaming vibe)
✅ Deterministic (same handle = same avatar always)
✅ No API calls, no backend work
✅ Zero operational friction
✅ Graceful fallback to initials if needed
```

---

## DiceBear URL Format

```
https://api.dicebear.com/7.x/pixel-art/svg?seed={handle}&scale=80&radius=50
```

**Parameters:**
- `seed`: Twitter handle (automatically URL-encoded in our code)
- `scale`: 80 (fills the avatar circle nicely)
- `radius`: 50 (fully rounded, no corners)

---

## Examples

| Handle | Avatar URL |
|--------|-----------|
| VitalikButerin | `https://api.dicebear.com/7.x/pixel-art/svg?seed=VitalikButerin&scale=80&radius=50` |
| elonmusk | `https://api.dicebear.com/7.x/pixel-art/svg?seed=elonmusk&scale=80&radius=50` |
| WhalePanda | `https://api.dicebear.com/7.x/pixel-art/svg?seed=WhalePanda&scale=80&radius=50` |

---

## Timeline

```
00:00 - 05:00  Create avatar.ts utility
05:00 - 20:00  Update 3-4 components
20:00 - 25:00  Test & verify
```

---

## Rollback Plan

If DiceBear goes down (extremely unlikely):
1. Swap `pixel-art` for `identicon` style (different generator, same DiceBear)
2. Or revert to gradient + initials fallback (pre-existing code)

---

## Success Criteria

✅ All influencer cards show consistent, professional avatars
✅ No broken images or missing avatars
✅ Different handles show visually different avatars
✅ Takes less than 30 minutes to implement
✅ Zero backend changes required
