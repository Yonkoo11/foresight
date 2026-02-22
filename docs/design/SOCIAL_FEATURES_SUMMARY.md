# Social Features Integration - Executive Summary

**Date:** February 22, 2026
**Status:** Design Complete - Ready for Implementation
**Estimated Build Time:** 6-15 hours (depends on scope)
**Risk Level:** Low (all APIs exist, minimal scope creep)

---

## THE PITCH (To Product / Leadership)

**What:** Add 5 lightweight social interactions to the existing 6 pages. Follow, like, comment, activity feed, social counts.

**Why:** Social features increase daily engagement, create FOMO, and showcase Tapestry Protocol integration for the hackathon bounty. More importantly, they turn the app from a solitary experience ("I drafted a team") into a competitive community ("I'm beating my friends").

**Where:** No new pages. Everything fits into existing layouts (Home, Profile, Compete, Contest Detail).

**Scope:** Two tiers:
- **MVP (6 hours):** Follow + Activity feed. Sufficient for hackathon.
- **Extended (15 hours):** Add likes, comments, social counts. Polished.

**Cost:** Zero new backend work. All APIs are ready via Tapestry Protocol.

**Risks:** None identified. Features are additive (can be disabled if bugs appear).

---

## THE DESIGN DECISIONS (Why This Way?)

### 1. No New Pages or Navigation Items

**Decision:** Social features live on existing pages (Home, Profile, Compete, Contest Detail).

**Why:**
- Bottom nav is sacred on mobile (max 4 items, never 5)
- No time to QA a new "Social" or "Activity" page before demo
- Users already visit these pages daily (dungeon-optimal placement)
- Reduces scope creep risk

**Validation:** DraftKings and FanDuel don't have separate "social" sections. Social features are baked into leaderboards and profiles.

---

### 2. Follow/Unfollow on Leaderboard (Not Just Profile)

**Decision:** Both profile page and leaderboard rows have follow buttons.

**Why:**
- Leaderboard is where social comparison happens
- A rank-12 player wants to "follow" the rank-1 player to watch them
- Creates a watchlist + accountability ("I'm competing with people I follow")
- Turns competitive comparison into relationship building

---

### 3. Activity Feed Card on Home (Not Dedicated Page)

**Decision:** Activity feed is a collapsible card on the home page, not a full page.

**Why:**
- Most users land on home page when they open the app
- Activity data is supplementary (nice to see what friends are doing)
- Full-page activity feed adds 5 hours of work with marginal return
- Mobile users don't have screen space for another top-level page

**Future:** If activity drives massive engagement, graduate to a full page in v2.

---

### 4. Comments Only on Contest Detail (Not Everywhere)

**Decision:** Comments are only on the contest detail page, not on leaderboard or team cards.

**Why:**
- Leaderboard would become cluttered (comments + likes + follows)
- Team card comments are nice-to-have (can add in v2)
- Contest page comments create strategy discussion (higher signal-to-noise)
- Easier to moderate (comments are centralized, not scattered)

**Validation:** Sleeper app only lets you comment in chat (not on leaderboard). It's less cluttered and higher intent.

---

### 5. Like Counts but Not Nested Discussion

**Decision:** Users can like teams, but no threaded replies on comments.

**Why:**
- Threaded replies turn the app into a forum (kills engagement with core game)
- Single-level comments keep the pace fast (read & move on)
- Easier to moderate
- Less noise for new users

**Future:** Nested replies in v3 if the community demands it.

---

### 6. Social Counts Visible, but Not Interactive on Leaderboard

**Decision:** Follower/following counts appear on profile header, not on every leaderboard row.

**Why:**
- Leaderboard rows are already dense (rank, player, points, actions)
- Profile is the right place for social depth (avatars, counts, lists)
- Reduces visual clutter on competitive view

---

## THE FEAR WE HAD (And Why It's Wrong)

### "Won't this make the app feel like a social network instead of a game?"

**Why it's wrong:**
- The *game loop* (draft → score → compete) is still primary
- Social features are *amplifiers* of that loop, not replacements
- Follow = watch how strong players draft
- Like = celebrate strategy choices
- Activity = FOMO about missing engagement
- Comments = discuss strategy in the game context

**Validation:** Sleeper, DraftKings, FanDuel all have social features and are still games. The social layer doesn't cannibalize the game.

---

### "Isn't 15 hours too much for 'secondary' features?"

**Reality check:**
- 6 hours for MVP (follow + activity) = enough for demo
- Remaining 9 hours = polish + edge cases + testing
- Without polish, features look broken (worse than not building)
- These 9 hours are non-negotiable for quality

**If forced to cut:** Drop comments (most complex) and social counts (display-only). Keep follow + activity + likes.

---

## THE MEASUREMENT (How We Know If This Works)

### Success Metrics (For Post-Launch)

1. **Daily Active Follow Count:** % of users who follow someone
   - Target: 40%+ by day 7
   - Why: Indicates peer-to-peer engagement is working

2. **Like-to-View Ratio:** Likes per 100 leaderboard views
   - Target: 5-10%
   - Why: Indicates celebration is happening (not just observation)

3. **Activity Feed Click-Through:** % who click "View More Activity"
   - Target: 25%+
   - Why: Indicates FOMO is real

4. **Comment Volume:** Comments per contest
   - Target: 3-5 comments per contest
   - Why: Indicates strategy discussion (not spam)

### Success Metrics (For Hackathon Demo)

1. **Judges see someone following another player** ← Most important
2. **Judges see activity feed with real data** ← Second most important
3. **Judges see likes on a high-scoring team** ← Nice to have
4. **Comments exist (at least one working example)** ← Nice to have

**Minimum for demo:** Metrics 1 + 2. Done.

---

## THE TIMELINE

### Week 1 (This week) - Design
- [x] Create UX spec (this document)
- [x] Create quick reference guide
- [x] Create wireframes
- [ ] Get stakeholder approval on scope

### Week 2 - MVP Implementation
- [ ] Implement follow buttons (3-4 hours)
- [ ] Implement activity feed card (2-3 hours)
- [ ] Test end-to-end (1-2 hours)
- Total: 6-9 hours (1.5 days of focused work)

### Week 3 - Extended Implementation (Optional)
- [ ] Implement likes (2-3 hours)
- [ ] Implement social counts (1-2 hours)
- [ ] Implement comments (4-5 hours)
- [ ] Polish & testing (2-3 hours)
- Total: 9-13 hours (2-3 days)

### Week 4 - Final QA
- [ ] Test on mobile, tablet, desktop
- [ ] Test error cases (failed API calls, timeouts)
- [ ] Load testing (activity feed with 1000+ items)
- [ ] Demo prep (record backup video)

---

## THE TECH STACK

### Backend (Already Done ✅)

```
All APIs exist via Tapestry Protocol:
✅ POST /api/tapestry/follow
✅ POST /api/tapestry/unfollow
✅ GET /api/tapestry/following-state/:targetProfileId
✅ GET /api/tapestry/followers/:profileId
✅ GET /api/tapestry/following/:profileId
✅ GET /api/tapestry/social-counts/:profileId

✅ POST /api/tapestry/like/:contentId
✅ DELETE /api/tapestry/like/:contentId

✅ POST /api/tapestry/comment/:contentId
✅ GET /api/tapestry/comments/:contentId

✅ GET /api/activity/feed
✅ GET /api/activity/me
✅ GET /api/tapestry/activity
```

**Zero new backend endpoints needed.**

### Frontend

**New Components:**
- `FollowButton.tsx` (reusable)
- `LikeButton.tsx` (reusable)
- `ActivityFeedCard.tsx` (home page specific)
- `CommentsSection.tsx` (contest detail specific)
- `SocialCounts.tsx` (profile specific)

**Modified Components:**
- `Profile.tsx` - Add follow button + social counts
- `Compete.tsx` (leaderboard) - Add follow + like buttons
- `Home.tsx` - Add activity feed card
- `ContestDetail.tsx` - Add comments section

**New Hooks:**
- `useFollowing()` - Check if user follows someone
- `useLike()` - Like/unlike toggle state
- `useActivityFeed()` - Fetch and auto-update activity

**Total new code:** ~800-1000 lines of TypeScript/JSX

---

## THE DEPENDENCY GRAPH

```
Activity Feed
├─ Home.tsx
└─ /api/activity/feed

Follow Button
├─ Profile.tsx
├─ Compete.tsx (leaderboard)
└─ /api/tapestry/follow
   /api/tapestry/unfollow
   /api/tapestry/following-state/:id

Like Button
├─ Compete.tsx (leaderboard)
├─ Profile.tsx (teams tab)
└─ /api/tapestry/like/:contentId
   /api/tapestry/unlike/:contentId

Comments
├─ ContestDetail.tsx
└─ /api/tapestry/comment/:contentId
   /api/tapestry/comments/:contentId

Social Counts
├─ Profile.tsx (header)
└─ /api/tapestry/social-counts/:profileId
   /api/tapestry/followers/:profileId
   /api/tapestry/following/:profileId

Zero dependencies between features.
Each can be built/shipped independently.
```

---

## THE RISK REGISTER

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| API timeouts (follow takes >2s) | Medium | Medium | Implement request timeout (1s) + retry logic |
| Duplicate follow (race condition) | Low | Low | Backend handles idempotency |
| Activity feed stale (not updating) | Low | Medium | Auto-refresh every 30s + fallback polling |
| Comments spam/abuse | Low | Medium | Backend moderation + report button |
| Performance (1000 activity items) | Low | Low | Pagination (20 items/page) + virtual scrolling |

**None of these are blockers.** All have easy fixes.

---

## THE COMPETITIVE ADVANTAGE

### Why This Matters for Judging

**Judges will see:**
1. Real players following each other (Tapestry social graph in action)
2. Real activity feed showing engagement (proof community exists)
3. Like counts on teams (peer validation of strategy)
4. Sincere, non-spammy comments (signal that users care about winning)

**What they'll think:**
> "This doesn't feel like a hackathon project. It feels like a real app that people play with friends."

### Why This Matters for Growth

**New user NPS increases because:**
- They see others are playing (social proof)
- They can follow strong players (learn winning strategies)
- Their wins are celebrated by others (dopamine hit)
- They see activity happening in real-time (FOMO)

**Monetization pathway:**
- Free players build social graph (follow friends, like teams)
- Paid contests let them compete with their followers
- Premium tier adds league features + social privileges

---

## THE SUCCESS CRITERIA (Checklist Before Demo)

### Before Shipping Code

- [ ] Design spec reviewed by product + engineering
- [ ] All stakeholders agree on scope (MVP vs. Extended)
- [ ] Timeline matches reality (6 hours vs. 15 hours)
- [ ] Team has capacity (no conflicting deadline)

### During Development

- [ ] Follow button works (toggle state)
- [ ] Activity feed shows real data (not dummy)
- [ ] Like button animates (visual feedback)
- [ ] Comments validate input (280 char limit)
- [ ] All APIs respond in <1 second
- [ ] Mobile responsive (tested on iPhone 12)
- [ ] No console errors

### Before Demo Day

- [ ] Create test data (50+ users with follows/likes/comments)
- [ ] Test error cases (fail gracefully)
- [ ] Record backup video (in case live demo breaks)
- [ ] Deploy to production (not localhost)
- [ ] Have judges test on multiple devices

### During Demo

- [ ] Show a player's profile (demonstrate follow button)
- [ ] Show leaderboard (demonstrate likes)
- [ ] Show home page (demonstrate activity feed)
- [ ] Have judges follow someone + check if real-time updates work

---

## THE FINAL PITCH TO BUILDERS

**You're not building a social network.** You're building *social oxygen* for a gaming experience. These features take 6-15 hours and unlock:

1. **Credibility:** "Real people play this, here's the proof"
2. **Engagement:** "I want to beat my friends (who I'm now following)"
3. **Virality:** "I just got 12 likes on my draft, I'm sharing this"
4. **Tapestry integration:** "All this social data lives on Solana's social protocol"

The backend is ready. The design is done. The only unknown is:

**Will you build it?**

---

## RELATED DOCUMENTS

For more details, see:
1. **`SOCIAL_FEATURES_UX_SPEC.md`** — Full 10,000-word specification
2. **`SOCIAL_FEATURES_QUICK_REFERENCE.md`** — One-page cheat sheet
3. **`SOCIAL_FEATURES_WIREFRAMES.md`** — ASCII wireframes for every state

---

**Ready to build?** Start with Phase 1 (Follow + Activity). Done in 6 hours.

