# Social Features - Quick Reference Guide

> **TL;DR:** Where each social feature goes. No new pages. No scope creep. Implement in 10 hours.

---

## THE 5 SOCIAL FEATURES (In Order of Implementation)

### 1. FOLLOW / UNFOLLOW
**Where:** Profile header + Leaderboard rows
**Button:** Cyan "Follow" → Gold "Following" (toggles)
**API:** POST `/api/tapestry/follow` | POST `/api/tapestry/unfollow`
**Time:** 3-4 hours
**Why:** Builds watchlist → checks leaderboard regularly

---

### 2. LIKE (Heart Icon)
**Where:** Leaderboard rows + Profile teams tab
**Icon:** Heart (gray/gold toggle) with count
**API:** POST `/api/tapestry/like/:contentId` | DELETE same
**Time:** 2-3 hours
**Why:** Celebrates great picks → drives sharing

---

### 3. ACTIVITY FEED
**Where:** Home page (new card below hero)
**Content:** "X ranked #1", "Y liked your team", etc.
**API:** GET `/api/activity/feed` (auto-refresh 30s)
**Time:** 2-3 hours
**Why:** Social proof + FOMO → increases daily engagement

---

### 4. COMMENTS
**Where:** Contest detail page only
**Input:** 280-char limit, moderated
**API:** POST `/api/tapestry/comment/:contentId` | GET comments
**Time:** 4-5 hours
**Why:** Strategy discussion → community building

---

### 5. SOCIAL COUNTS
**Where:** Profile header (display only)
**Shows:** "👥 1,240 Followers | 👁️ 342 Following"
**API:** GET `/api/tapestry/social-counts/:profileId`
**Time:** 1-2 hours
**Why:** Credibility signal

---

## WHAT NOT TO BUILD
❌ Direct messaging
❌ User profile editing
❌ Notifications center
❌ Achievements/badges
❌ Nested comment replies
❌ Friends-only contests
❌ Advanced search

---

## MOBILE STRATEGY
- Bottom nav: stays 4 items (don't add 5th)
- Follow button: Full width below avatar
- Like button: Tap or swipe to reveal
- Comments: Collapsed section (tap "💬 5 Comments" to expand)
- Activity: Scrollable card on home page

---

## IMPLEMENTATION PHASES

### PHASE 1 (MVP - 6 hours)
1. Follow button (leaderboard + profile)
2. Activity feed card (home page)

**This is sufficient for hackathon demo.**

### PHASE 2 (Polish - 4 hours, if time)
3. Like buttons (leaderboard + teams)
4. Social counts (profile header)

### PHASE 3 (Post-MVP - 5 hours)
5. Comments (contest detail page)

---

## DESIGN TOKENS

**Colors:**
- Follow not-following: `btn-cyan`
- Follow following: `btn-ghost` + gold border
- Heart unliked: gray
- Heart liked: gold
- Activity icon: gold/cyan

**Typography:**
- Social counts: Inter 500, 14px
- Comments: Inter 400, 14px
- Timestamps: gray-600, 12px

**Spacing:**
- Button padding: 8px 16px
- Icon gap: 6px
- Comment input gap (avatar + input): 8px

---

## INTERACTION PATTERNS

**Follow Button States:**
1. "Follow" (cyan) → Click
2. "⏳ Following..." (loading, disabled)
3. "Following" (gold) → Click
4. "Unfollow?" (hover state)

**Like Button:**
- Gray heart (unliked) → Click → Gold heart (liked)
- Heart animates (scale 1.15x) when clicked
- Count increments

**Comment Input:**
- Max 280 chars (like Twitter)
- Show counter "45 / 280"
- Disable when empty or over limit
- Collapse after submit

**Activity Feed:**
- 6 items showing, [View More] for rest
- Auto-refresh every 30 seconds
- Show action type (rank, like, comment, follow, milestone)

---

## PAGES AFFECTED

| Page | Features Added | Difficulty |
|------|---|---|
| Home | Activity feed card (new) | Easy |
| Profile | Follow button, Social counts, likes on teams | Easy |
| Leaderboard | Follow button, Like button | Easy |
| Contest Detail | Comments section (new) | Medium |

**No new pages. No new navigation items.**

---

## API ENDPOINTS ALREADY EXIST ✅

```
FOLLOW
✅ POST /api/tapestry/follow
✅ POST /api/tapestry/unfollow
✅ GET /api/tapestry/following-state/:targetProfileId
✅ GET /api/tapestry/followers/:profileId
✅ GET /api/tapestry/following/:profileId
✅ GET /api/tapestry/social-counts/:profileId

LIKE
✅ POST /api/tapestry/like/:contentId
✅ DELETE /api/tapestry/like/:contentId

COMMENTS
✅ POST /api/tapestry/comment/:contentId
✅ GET /api/tapestry/comments/:contentId

ACTIVITY
✅ GET /api/activity/feed
✅ GET /api/activity/me
✅ GET /api/tapestry/activity
```

**Zero new backend work needed. Just frontend UI.**

---

## BEFORE YOU START

1. **Read full spec:** `SOCIAL_FEATURES_UX_SPEC.md`
2. **Take screenshot of current state:** `./node_modules/.bin/tsx scripts/screenshot.ts /profile --full`
3. **Decide on Phase:** MVP (1-2) or Extended (1-5)?
4. **Create task list** in Claude Code if doing extended phase
5. **Implement in order:** Follow → Activity → Like → Counts → Comments

---

## TESTING CHECKLIST

- [ ] Follow button toggles state without page refresh
- [ ] Like button animates and updates count
- [ ] Activity feed shows real data (not dummy)
- [ ] Comments have 280-char validation
- [ ] Mobile: All buttons are tappable (44x44px min)
- [ ] Responsive: Works on iPhone + desktop
- [ ] Error handling: Failed API calls show toast + retry

---

## DEMO TALKING POINTS

**For judges:**
- "See who's following whom? That's Tapestry's social graph."
- "This team has 12 likes. Real social proof from real players."
- "Activity feed shows what everyone's doing in real-time."

**Differentiation:**
- Unlike Discord/Telegram, social features are built into the game
- Unlike traditional sports apps, Tapestry makes social data portable

---

## COMMON GOTCHAS

**❌ Don't** show follow counts on leaderboard (clutter)
**✅ Do** show in profile header

**❌ Don't** let users comment on leaderboard entries (too much data)
**✅ Do** only comments on contest detail page

**❌ Don't** add a 5th bottom nav item ("Social" or "Activity")
**✅ Do** put activity on home page (where most users land)

**❌ Don't** build nested comment replies (scope creep)
**✅ Do** flat, single-level comments only

**❌ Don't** send email notifications (complexity)
**✅ Do** toast notifications only (Tapestry handles email)

---

## PRIORITY FOR MVP

If you have 6 hours total:
1. Follow button (3-4 hours) — HIGH impact, low effort
2. Activity feed (2-3 hours) — HIGH impact, low effort

**Do this and you have a social game.**

If you have 10 hours:
Add likes + social counts (easy wins).

If you have 15+ hours:
Add comments (more complex, but nice to have).

---

**That's it. Go build.** 🚀

