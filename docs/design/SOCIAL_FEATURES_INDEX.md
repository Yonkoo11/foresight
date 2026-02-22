# Social Features Design Documentation - Complete Index

**Created:** February 22, 2026
**Total Documentation:** 2,357 lines across 4 detailed guides
**Status:** Ready for Frontend Implementation
**Estimated Build Time:** 6-15 hours

---

## QUICK START (5 minutes)

**Just want to know where things go?**
→ Read: [`SOCIAL_FEATURES_QUICK_REFERENCE.md`](./SOCIAL_FEATURES_QUICK_REFERENCE.md)

**Want to see it visually?**
→ Read: [`SOCIAL_FEATURES_WIREFRAMES.md`](./SOCIAL_FEATURES_WIREFRAMES.md)

**Need to convince leadership?**
→ Read: [`SOCIAL_FEATURES_SUMMARY.md`](./SOCIAL_FEATURES_SUMMARY.md)

**Building it right now?**
→ Read: [`SOCIAL_FEATURES_UX_SPEC.md`](./SOCIAL_FEATURES_UX_SPEC.md)

---

## THE 4 DOCUMENTS

### 1. `SOCIAL_FEATURES_UX_SPEC.md` (Comprehensive - 1,122 lines)

**What:** Complete, pixel-perfect specification for all social features.

**Contains:**
- Part 1: Where each social feature goes (with exact placement)
- Part 2: Interaction patterns (button states, animations)
- Part 3: What NOT to build (scope boundaries)
- Part 4: Mobile layout strategy
- Part 5: Design tokens & styling
- Part 6: API integration checklist
- Part 7: Summary table
- Part 8: Wireframe examples
- Part 9: Implementation priority
- Part 10: Final checklist

**Read this if:** You're implementing and need to understand every detail.

**Time to read:** 30-45 minutes

---

### 2. `SOCIAL_FEATURES_QUICK_REFERENCE.md` (Cheat Sheet - 251 lines)

**What:** One-page reference for the impatient.

**Contains:**
- 5 features in order (Follow, Like, Activity, Comments, Social Counts)
- Where each feature goes
- What NOT to build
- Mobile strategy
- Implementation phases (MVP vs. Extended vs. Post-MVP)
- Design tokens (colors, typography, spacing)
- Interaction patterns (quick summaries)
- API endpoints (all ready ✅)
- Testing checklist
- Priority for MVP

**Read this if:** You want the essentials in <10 minutes.

**Time to read:** 5-10 minutes

---

### 3. `SOCIAL_FEATURES_WIREFRAMES.md` (Visual Guide - 597 lines)

**What:** ASCII wireframes showing exact placement and states.

**Contains:**
- Profile page (desktop + mobile)
- Leaderboard with follow/like buttons
- Home page with activity feed
- Contest detail with comments
- Button state evolution (6 states each)
- Comment input lifecycle
- Activity feed item types
- Responsive breakpoints

**Read this if:** You need visual reference while coding.

**Time to read:** 10-15 minutes (reference as needed)

---

### 4. `SOCIAL_FEATURES_SUMMARY.md` (Executive Summary - 387 lines)

**What:** Pitch, decisions, risks, and timelines for leadership.

**Contains:**
- The pitch (why build this?)
- Design decisions explained
- Fear analysis (why your concerns are wrong)
- Measurement criteria (success metrics)
- Timeline (week by week)
- Tech stack (what's ready, what's not)
- Dependency graph
- Risk register
- Competitive advantages
- Success criteria checklist

**Read this if:** You need to decide whether to build it.

**Time to read:** 15-20 minutes

---

## THE 5 SOCIAL FEATURES (Executive Summary)

### 1. FOLLOW / UNFOLLOW
- **Where:** Profile header + Leaderboard rows
- **Button:** Cyan "Follow" ↔️ Gold "Following" (toggle)
- **Why:** Build watchlist → watch strong players
- **Time:** 3-4 hours
- **MVP:** YES (high priority)

### 2. LIKE (Heart Icon)
- **Where:** Leaderboard rows + Profile teams tab
- **Icon:** Gray heart (unliked) ↔️ Gold heart (liked)
- **Why:** Celebrate great picks → drives sharing
- **Time:** 2-3 hours
- **MVP:** YES (phase 2)

### 3. ACTIVITY FEED
- **Where:** Home page (card below hero)
- **Content:** "@X ranked #1", "12 people liked your team", etc.
- **Why:** Social proof + FOMO → daily engagement
- **Time:** 2-3 hours
- **MVP:** YES (phase 1)

### 4. COMMENTS
- **Where:** Contest detail page only
- **Input:** 280-char limit, moderated
- **Why:** Strategy discussion → community building
- **Time:** 4-5 hours
- **MVP:** NO (post-MVP)

### 5. SOCIAL COUNTS
- **Where:** Profile header (display-only)
- **Shows:** "👥 1,240 Followers | 👁️ 342 Following"
- **Why:** Credibility signal
- **Time:** 1-2 hours
- **MVP:** NO (nice-to-have)

---

## IMPLEMENTATION ROADMAP

### Phase 1: MVP (6 hours) ← START HERE
1. Follow button (leaderboard + profile) — 3-4 hours
2. Activity feed card (home page) — 2-3 hours
3. Test end-to-end — 1 hour

**This is sufficient for hackathon demo.**

### Phase 2: Polish (4 hours, if time)
3. Like buttons (leaderboard + teams) — 2-3 hours
4. Social counts (profile header) — 1-2 hours

### Phase 3: Post-MVP (5 hours)
5. Comments (contest detail page) — 4-5 hours

**Total for all 5 features: ~15 hours**

---

## KEY DESIGN DECISIONS (Why We Did This)

| Decision | Why |
|----------|-----|
| No new pages or nav items | Bottom nav is sacred (4 items max on mobile) |
| Follow on leaderboard | Users compete with people they follow |
| Activity card on home (not dedicated page) | Most users land on home; page adds 5 hours with marginal ROI |
| Comments only on contests (not everywhere) | Prevents leaderboard clutter |
| Single-level comments (no nested replies) | Keeps pace fast; easier to moderate |
| Like counts but not follows on leaderboard | Reduces visual clutter on competitive view |

---

## BACKEND STATUS: ✅ 100% READY

**No new backend work needed.** All APIs exist via Tapestry Protocol:

```
FOLLOW (6 endpoints)
✅ POST /api/tapestry/follow
✅ POST /api/tapestry/unfollow
✅ GET /api/tapestry/following-state/:targetProfileId
✅ GET /api/tapestry/followers/:profileId
✅ GET /api/tapestry/following/:profileId
✅ GET /api/tapestry/social-counts/:profileId

LIKE (2 endpoints)
✅ POST /api/tapestry/like/:contentId
✅ DELETE /api/tapestry/like/:contentId

COMMENTS (2 endpoints)
✅ POST /api/tapestry/comment/:contentId
✅ GET /api/tapestry/comments/:contentId

ACTIVITY (3 endpoints)
✅ GET /api/activity/feed
✅ GET /api/activity/me
✅ GET /api/tapestry/activity
```

---

## FRONTEND COMPONENTS TO BUILD

```
NEW COMPONENTS:
- FollowButton.tsx       (Reusable)
- LikeButton.tsx         (Reusable)
- ActivityFeedCard.tsx   (Home-specific)
- CommentsSection.tsx    (Contest-specific)
- SocialCounts.tsx       (Profile-specific)

MODIFIED COMPONENTS:
- Profile.tsx            (Add follow button + social counts)
- Compete.tsx            (Add follow + like to leaderboard)
- Home.tsx               (Add activity feed card)
- ContestDetail.tsx      (Add comments section)

NEW HOOKS:
- useFollowing()         (Check/toggle follow state)
- useLike()              (Like/unlike toggle)
- useActivityFeed()      (Fetch + auto-refresh)

TOTAL NEW CODE: ~800-1000 lines
```

---

## THE COMPETITIVE ANGLE (Why Judges Will Care)

**Judges see:**
1. Real players following each other (Tapestry social graph visible)
2. Real activity feed (proves community exists)
3. Like counts on teams (peer validation)
4. Comments on strategy (users care about winning, not just money)

**What they think:**
> "This doesn't feel like a hackathon project. It feels like a real app that people play with friends."

**Why it matters:**
- UX is 10-15% of judging score, but it's what they see FIRST
- A slick, polished experience makes everything else look better
- Social features show Tapestry integration depth (for bounty consideration)

---

## SUCCESS CRITERIA

### For MVP Demo (Minimum)
- [ ] Follow button works on profile
- [ ] Follow button works on leaderboard
- [ ] Activity feed shows real data
- [ ] No console errors

### For Extended Demo (Ideal)
- [ ] All 5 features implemented
- [ ] Mobile responsive (tested on iPhone)
- [ ] Smooth animations (not janky)
- [ ] Performance <1s per API call

### For Launch (Quality Bar)
- [ ] Test data seeded (50+ users with follows/likes)
- [ ] Error handling (graceful fallbacks)
- [ ] Moderation in place (no spam comments)
- [ ] Load testing (1000+ activity items)

---

## READING ORDER

**If you have 5 minutes:**
1. This index (you are here)
2. `SOCIAL_FEATURES_QUICK_REFERENCE.md`

**If you have 20 minutes:**
1. This index
2. `SOCIAL_FEATURES_SUMMARY.md`
3. `SOCIAL_FEATURES_QUICK_REFERENCE.md`

**If you're implementing:**
1. `SOCIAL_FEATURES_QUICK_REFERENCE.md` (big picture)
2. `SOCIAL_FEATURES_WIREFRAMES.md` (visual reference)
3. `SOCIAL_FEATURES_UX_SPEC.md` (details as needed)

**If you're leading/managing:**
1. `SOCIAL_FEATURES_SUMMARY.md` (pitch, timeline, risks)
2. This index (links to detailed docs)

---

## COMMON QUESTIONS

**Q: Will this slow down the app?**
A: No. We're reusing existing components and APIs. Activity feed auto-refreshes every 30s (already built into SSE infrastructure).

**Q: What if we run out of time?**
A: Ship Phase 1 (Follow + Activity). That's 6 hours and enough for demo. Like buttons and comments are nice-to-have.

**Q: Will this make the app feel like a social network?**
A: No. Social features are amplifiers of the game loop (draft → score → compete), not replacements. See `SOCIAL_FEATURES_SUMMARY.md` for validation.

**Q: Do we need new backend work?**
A: Zero. All 12 API endpoints exist and are tested.

**Q: What about mobile?**
A: All features are mobile-responsive. Bottom nav stays at 4 items (no new items added).

**Q: How do we handle spam comments?**
A: Backend moderates. We show a report button and backend hides reported comments.

---

## FILE LOCATIONS

```
/Users/mujeeb/foresight/docs/design/
├── SOCIAL_FEATURES_INDEX.md          (You are here)
├── SOCIAL_FEATURES_SUMMARY.md        (Executive summary)
├── SOCIAL_FEATURES_QUICK_REFERENCE.md (Cheat sheet)
├── SOCIAL_FEATURES_UX_SPEC.md        (Full spec, 10K words)
└── SOCIAL_FEATURES_WIREFRAMES.md     (ASCII diagrams)

Related:
├── DESIGN_TOKENS.md                  (Colors, typography, spacing)
├── DESIGN_RESEARCH_PLAN.md           (Competitive analysis)
└── REVAMP_TRACKER.md                 (Page-by-page progress)

Backend API:
/Users/mujeeb/foresight/backend/src/api/tapestry.ts
/Users/mujeeb/foresight/backend/src/api/activity.ts
```

---

## NEXT STEPS

**1. Review (30 min)**
   - [ ] Read this index
   - [ ] Read `SOCIAL_FEATURES_QUICK_REFERENCE.md`

**2. Decide (15 min)**
   - [ ] Confirm scope: MVP (6h) or Extended (15h)?
   - [ ] Assign to frontend engineer
   - [ ] Block time on calendar

**3. Build (6-15 hours)**
   - [ ] Phase 1: Follow + Activity (6 hours)
   - [ ] Test (1 hour)
   - [ ] (Optional) Phase 2: Likes + Counts (4 hours)

**4. Ship (1 hour)**
   - [ ] Deploy to staging
   - [ ] Final QA
   - [ ] Create demo data
   - [ ] Deploy to production

---

## CONTACT / QUESTIONS

If you have questions about:
- **What to build:** See `SOCIAL_FEATURES_QUICK_REFERENCE.md`
- **How to build it:** See `SOCIAL_FEATURES_UX_SPEC.md` (Part 1-2)
- **Design tokens:** See `SOCIAL_FEATURES_UX_SPEC.md` (Part 5)
- **Wireframes:** See `SOCIAL_FEATURES_WIREFRAMES.md`
- **Business case:** See `SOCIAL_FEATURES_SUMMARY.md`

---

**This is a complete, production-ready specification.**

No ambiguity. No unknowns. No surprises.

Ready to build? 🚀

