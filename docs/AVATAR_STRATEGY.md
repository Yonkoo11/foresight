# Avatar Strategy: DiceBear Fallback + Real URLs

**Date:** February 25, 2026
**Status:** Recommendation for Immediate Implementation
**Impact:** Ensures professional presentation at hackathon demo

---

## Executive Summary

The influencers table has `avatar_url` column that's currently **empty or contains stale Twitter URLs**. For a hackathon demo with 100 real influencer cards, missing or broken avatars = poor visual impression.

**Recommendation:** Use **DiceBear avatars with a graceful fallback pattern**. This is the fastest, most reliable approach with zero operational friction.

---

## Current State

### Database Schema
- **Table:** `influencers`
- **Column:** `avatar_url` (VARCHAR 500, nullable)
- **Current data:** Mostly empty, no scraping currently populates it
- **TwitterAPI.io integration exists** but not used for avatars (100 API calls = 5-10 minutes rate-limited execution)

### Frontend Usage
- Components check: `avatar_url ? <img src={avatar_url} /> : <fallback />`
- Examples:
  - `RisingStarsTab.tsx`: Shows default gradient + X Logo
  - `ComparisonTool.tsx`: Shows profile image or placeholder
  - `InfluencerDetailModal.tsx`: Needs real-looking avatar
  - `DraftBoard.tsx`: Influencer cards need visual distinction

### Missing Avatars Today
- **Visual impact:** Broken images or generic fallbacks feel incomplete
- **Judge perception:** "Feels like an MVP, not a finished product"
- **Time to fix (current approach):** 15-30 minutes to scrape + update

---

## Option Analysis

| Option | Visual Quality | Reliability | Implementation Time | Operational Friction | Cost |
|--------|---|---|---|---|---|
| **A: Real Twitter URLs (re-scrape)** | 10/10 | 7/10 (CDN expiry) | 30 min | Medium (script needed) | 0 (100 API calls) |
| **B: DiceBear Avatars** | 7/10 | 10/10 | 15 min | Zero | Free |
| **C: UI Avatars (initials)** | 5/10 | 10/10 | 10 min | Zero | Free |
| **D: Keep empty + fallback** | 3/10 | 10/10 | 0 min | Zero | Free |
| **E: DiceBear + Real URL fallback** | 9/10 | 10/10 | 20 min | Zero | Free |

---

## Recommendation: Option B (DiceBear) + Graceful Fallback

### Why This Wins

1. **Visual Quality**: DiceBear avatars are professional enough for a dark crypto UI
2. **100% Reliability**: No broken images, no Twitter CDN dependencies
3. **Fast Implementation**: Update frontend to generate DiceBear URLs client-side
4. **Zero Operational Burden**: No API calls, no database updates needed
5. **Perfect for Judging**: Judges see consistent, professional-looking cards

### Implementation (2 Parts)

#### Part 1: Frontend Avatar Fallback (10 minutes)

Create a utility function in `frontend/src/utils/avatar.ts`:

```typescript
/**
 * Generate avatar URL with fallback support
 * Uses DiceBear as primary, falls back to real Twitter URL if available
 */
export function getAvatarUrl(
  twitterHandle: string,
  databaseUrl?: string | null
): string {
  // If database has a real URL and it's from Twitter CDN, use it first
  if (databaseUrl?.includes('pbs.twimg.com')) {
    return databaseUrl;
  }

  // Primary: DiceBear Avatars (pixel-art style for crypto vibe)
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(
    twitterHandle
  )}&scale=80&radius=50`;
}

/**
 * Alternative style if pixel-art doesn't fit
 * Use 'identicon' for more abstract/technical feel
 */
export function getAvatarUrlIdenticon(
  twitterHandle: string,
  databaseUrl?: string | null
): string {
  if (databaseUrl?.includes('pbs.twimg.com')) {
    return databaseUrl;
  }
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
    twitterHandle
  )}&scale=80`;
}
```

#### Part 2: Update Components (10 minutes)

Replace avatar rendering in each component:

**Before:**
```typescript
{inf.avatar ? (
  <img src={inf.avatar} alt="" className="w-12 h-12 rounded-full" />
) : (
  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
    <XLogo size={20} />
  </div>
)}
```

**After:**
```typescript
<img
  src={getAvatarUrl(inf.twitter_handle, inf.avatar)}
  alt=""
  className="w-12 h-12 rounded-full bg-gray-800"
  onError={(e) => {
    // Fallback to initials if both fail
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    target.nextElementSibling?.classList.remove('hidden');
  }}
/>
<div className="hidden w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
  {inf.display_name.split(' ').map(n => n[0]).join('')}
</div>
```

---

## DiceBear Style Selection

### Recommended: `pixel-art` (FOR THIS PROJECT)

**Why pixel-art:**
- Crypto-native aesthetic (nostalgic gaming feel)
- Consistent with "fantasy sports" theme
- High contrast = works well on dark backgrounds
- Deterministic (same handle = same avatar every time)
- Professional enough for judging

**URL Template:**
```
https://api.dicebear.com/7.x/pixel-art/svg?seed={handle}&scale=80&radius=50
```

**Examples:**
- Vitalik: https://api.dicebear.com/7.x/pixel-art/svg?seed=VitalikButerin&scale=80&radius=50
- Elon: https://api.dicebear.com/7.x/pixel-art/svg?seed=elonmusk&scale=80&radius=50

### Alternative: `identicon` (IF MORE PROFESSIONAL FEEL NEEDED)

**Why identicon:**
- More abstract/technical (like Ethereum addresses)
- Still high contrast and readable
- Slightly more "serious" than pixel-art

**URL Template:**
```
https://api.dicebear.com/7.x/identicon/svg?seed={handle}&scale=80
```

### Avoid These:
- `avataaars` - Too cartoonish, generic faces
- `bottts` - Too playful for crypto context
- `shapes` - Too minimal, hard to distinguish between handles

---

## Implementation Checklist

### Step 1: Create Avatar Utility (5 min)
- [ ] Create `/frontend/src/utils/avatar.ts` with `getAvatarUrl()` function
- [ ] Test with 3-4 different handles in browser to verify URLs work

### Step 2: Update Components (10 min)
- [ ] `RisingStarsTab.tsx` - Replace avatar rendering
- [ ] `ComparisonTool.tsx` - Replace avatar rendering
- [ ] `InfluencerDetailModal.tsx` - Replace avatar rendering
- [ ] Any other component using `avatar` field

### Step 3: Verify (5 min)
- [ ] Take screenshot of /feed page (Rising Stars section)
- [ ] Take screenshot of /intel page (Comparison tool)
- [ ] Take screenshot of /draft page (Influencer cards)
- [ ] Verify no broken images, consistent styling

### Step 4: Test Error Handling (5 min)
- [ ] Manually test onError fallback by changing DiceBear URL to invalid
- [ ] Confirm initials display properly

**Total time:** ~25 minutes

---

## Fallback Strategy

If DiceBear becomes unavailable (extremely unlikely):

1. **Layer 1:** Real Twitter URL from DB (if exists)
2. **Layer 2:** DiceBear SVG (primary)
3. **Layer 3:** initials-only fallback with colored background

This is already handled by the utility function + onError handler.

---

## Future Enhancement (POST-HACKATHON)

Once the app grows and user engagement validates the product:

1. **Option F: Real photo refresh**
   - One-time script: `npm run scripts/refreshInfluencerAvatars.ts`
   - Calls TwitterAPI.io to fetch current `profile_image_url`
   - Stores in DB, falls back to DiceBear if unavailable
   - ~15 minutes to build, runs once per week

2. **Combination approach:**
   - Real URLs when available (weekly refresh)
   - DiceBear fallback when Twitter CDN fails
   - Best of both worlds

---

## Why Not Option A (Re-scrape Real URLs)?

**Pros:**
- Authentic photos (judges see "real influencer" cards)

**Cons:**
- Takes 5-10 minutes to run (100 API calls × 5.5 sec rate limit)
- Fragile: Twitter CDN URLs expire/rotate when users update photos
- Requires background script + monitoring
- Not worth the time investment for a 4-day hackathon sprint
- DiceBear avatars are "good enough" for judges

**Verdict:** Overkill for a hackathon. Pick the 80/20 solution.

---

## Visual Comparison

### Current (Broken):
```
[  ] User avatar  ← Empty or broken image
| Display Name
| @handle
| Tier: S-Tier
```

### With DiceBear:
```
[👾] Pixel art avatar
| Display Name
| @handle
| Tier: S-Tier
```

The pixel-art avatar instantly signals "this app is polished" to judges, even though it's not a real photo.

---

## Files to Modify

1. **Create:** `frontend/src/utils/avatar.ts` (new file)
2. **Modify:** `frontend/src/components/intel/RisingStarsTab.tsx`
3. **Modify:** `frontend/src/components/intel/ComparisonTool.tsx`
4. **Modify:** `frontend/src/components/intel/InfluencerDetailModal.tsx`
5. **Modify:** Any other avatar-rendering components (search for `avatar`)

---

## Why This Beats Everything Else

| Aspect | Result |
|--------|--------|
| **Time to implement** | 25 min |
| **Visual impact** | 8/10 (professional enough) |
| **Reliability** | 10/10 (no broken images) |
| **Operational burden** | 0 (no backend changes) |
| **Judge perception** | "Polished, thoughtful design" |
| **Risk of failure** | 0% |

---

## Decision

**PROCEED WITH OPTION B: DiceBear pixel-art style**

This is the fastest path to a visually complete, professional-looking demo. Real photos would be nice but not worth 30+ minutes of time + operational complexity for a 4-day hackathon.

**Next Step:** Implement the utility function + update 3-4 components (total 25 minutes), then take screenshots to verify.
