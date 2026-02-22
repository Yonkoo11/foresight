# IMPLEMENTATION CHECKLIST - Days 4-5
## Quick Reference for Developers

---

## PRIORITY ORDER (Do in this sequence)

### Phase 1: Follow Button (2 hours)
- [ ] Create `FollowButton.tsx` component in `frontend/src/components/ui/`
  - States: Not following (cyan) → Hovering (gold glow) → Following (gold border)
  - Calls: `POST /api/tapestry/follow` and `DELETE /api/tapestry/follow/:userId`
  - Toast: "Following @user" (success) | "Unfollowed @user" (info)
  - Loading state: Spinner overlay
- [ ] Wire button into Profile header (`/profile`)
- [ ] Wire button into Leaderboard rows (`/compete`)
- [ ] Test: Click follow → Backend saves → UI updates → Toast shows
- [ ] Mobile: Ensure button fits on small screens

### Phase 2: Activity Feed (2 hours)
- [ ] Create `ActivityFeed.tsx` component in `frontend/src/components/`
  - Renders 6 items max
  - 30-second auto-refresh (polling `GET /api/tapestry/activity-feed`)
  - Shows: User avatar + action + timestamp
  - Example: "@user1 followed @user2" | "@user3's score +15 pts"
- [ ] Add to Home dashboard (above or below leaderboard)
- [ ] Styling: 280px height, gray border, subtle animation on refresh
- [ ] Test: Open home → Wait 30s → Feed updates with new actions

### Phase 3: Friends Leaderboard (1.5 hours)
- [ ] On `/compete` page, add tab navigation
  - Tab 1: "Global" (existing leaderboard)
  - Tab 2: "Friends" (filtered)
- [ ] Query: `GET /api/league/leaderboard?filter=following` (or create new endpoint)
- [ ] Filter logic: Show only users where current_user follows them
- [ ] Same columns: Rank, Username, Weekly Score, Score Change
- [ ] Empty state: "Follow players to see their rankings"
- [ ] Test: Follow 3 users → Switch to Friends tab → Only those 3 show

### Phase 4: Shareable Team Card (2 hours)
- [ ] After draft submission, replace simple success modal with enhanced card
  - Shows formation visual (captain + 4 slots with tier colors)
  - "Share to Twitter" button with pre-filled tweet
  - Tweet: "I drafted @user1 @user2 @user3 @user4 @user5. Can you beat me?"
- [ ] On click, capture screenshot via existing Puppeteer script
- [ ] Open Twitter with pre-filled tweet + image
- [ ] Fallback: If screenshot fails, show shareable link instead
- [ ] "View on Leaderboard" secondary button
- [ ] Test: Draft team → See modal → Click share → Twitter opens with prefill

### Phase 5: Tapestry Visibility (1 hour)
- [ ] Profile page: Add badge below follower count
  - Text: "Saved to Tapestry Protocol" (gray, 12px)
  - No interaction, just visual confirmation
- [ ] Draft success modal: Add text "Your team is stored on Tapestry"
  - Font: 12px, gray, humble (not marketing)
- [ ] Optional: Leaderboard → Hover tooltip "Data on Tapestry"
- [ ] Test: Navigate to profile → See badge | Draft team → See message

---

## TESTING CHECKLIST

### Functional Tests
- [ ] **Follow Flow:** Not following → Click → API call → Button changes → Toast shows
- [ ] **Activity Feed:** Opens → 30s passes → New items appear | Scroll works
- [ ] **Friends Leaderboard:** Follow user → Go to Friends tab → User appears | Unfollow → Disappears
- [ ] **Share Flow:** Submit team → Modal shows → Click share → Twitter opens with pre-fill
- [ ] **Live Scoring:** Leaderboard still updates every 30s (no regressions)

### Mobile Tests
- [ ] Follow button fits on phone (not wrapping text)
- [ ] Activity feed scrolls smoothly (no jank)
- [ ] Leaderboard tabs work on small screens
- [ ] Share modal is readable on phone

### Edge Cases
- [ ] Follow/unfollow rapidly (debounce works)
- [ ] Activity feed on slow connection (handles delay)
- [ ] Share on Twitter while not logged into Twitter (opens OAuth)
- [ ] Refresh page while following modal is open (state persists)

---

## BACKEND VERIFICATION

Run these checks before starting frontend work:

```bash
# Verify endpoints exist
curl -X GET http://localhost:3001/api/tapestry/activity-feed
curl -X POST http://localhost:3001/api/tapestry/follow -d '{"followeeId":"123"}'
curl -X GET http://localhost:3001/api/league/leaderboard

# Check TypeScript
cd backend && npx tsc --noEmit

# Run tests
cd backend && pnpm test
```

---

## DESIGN TOKENS (Copy-Paste)

**Follow Button (Not Following):**
```jsx
<button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
  Follow
</button>
```

**Follow Button (Following):**
```jsx
<button className="px-4 py-2 border-2 border-gold-500 text-white rounded-lg hover:text-rose-500">
  Following
</button>
```

**Activity Feed Container:**
```jsx
<div className="h-72 overflow-y-auto border border-gray-800 rounded-lg p-4 bg-gray-900">
  {/* Items here */}
</div>
```

**Toast (Use existing toast context):**
```jsx
toast.success('Following @user', { duration: 3000 })
```

---

## COMMON PITFALLS (Avoid These)

❌ **Polling forever (infinite loops)**
✅ Use `setInterval` with cleanup in `useEffect`

❌ **Not handling loading states**
✅ Disable button + show spinner while follow request pending

❌ **Friends leaderboard still showing unfollowed users**
✅ Filter BEFORE rendering, not in display

❌ **Activity feed items are clickable everywhere**
✅ Only user avatar/name should be clickable (go to profile)

❌ **Shareable team card screenshot fails silently**
✅ Show fallback text "Can't generate image, use this link instead"

❌ **Forgetting mobile responsive**
✅ Test every component on phone (use devtools)

---

## TIMELINE

**Day 4 (Saturday):**
- 0:00-2:00 → Follow button
- 2:00-4:00 → Activity feed
- 4:00-5:30 → Friends leaderboard
- 5:30-6:00 → Testing + fixes

**Day 5 (Sunday):**
- 0:00-2:00 → Shareable team card
- 2:00-3:00 → Tapestry badges
- 3:00-5:00 → Mobile refinement + E2E testing
- 5:00-8:00 → Buffer + demo video

---

## QUESTIONS? SEE:

**Full decisions:** `/Users/mujeeb/foresight/FINAL_ARCHITECTURE_DECISIONS.md`
**Design system:** `/Users/mujeeb/foresight/docs/design/DESIGN_TOKENS.md`
**Existing code:** Check `backend/src/services/tapestryService.ts` (all endpoints ready)

---
