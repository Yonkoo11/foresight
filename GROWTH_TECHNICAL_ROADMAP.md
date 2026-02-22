# FORESIGHT GROWTH — TECHNICAL IMPLEMENTATION ROADMAP
## Infrastructure & Feature Roadmap to Enable Growth Levers

---

## CURRENT STATE vs. GROWTH REQUIREMENTS

### What We Have (MVP Complete)
✅ Core game loop (draft → scoring → leaderboard)
✅ Tapestry integration (profiles, teams stored on-chain)
✅ Live scoring (SSE polling, 30-sec updates)
✅ Formation visual (design differentiator)
✅ Multi-contest support (multiple contests running)
✅ Basic leaderboard (global rankings)

### What We Need (To Enable Growth)

| Feature | Growth Impact | Current Status | Priority | Est. Hours |
|---------|---|---|---|---|
| **Leaderboard Friend Comparison** | +10-15% retention | ❌ Not built | 🔴 P0 | 4-6 |
| **Rank Change Animations** | +20-30% engagement | ❌ Not built | 🔴 P0 | 2-3 |
| **Trending Teams View** | +5-8% discovery | ❌ Not built | 🟡 P1 | 4-5 |
| **Live Viral Detection** | +20-30% shares | ❌ Not built | 🟡 P1 | 6-8 |
| **Influencer Seeding Script** | 2.0 viral coeff | ❌ Not built | 🟡 P1 | 2-3 |
| **Activity Feed UI** | +8-12% retention | ✅ Backend done | 🟡 P1 | 3-4 |
| **Follow Button UI** | +5-8% retention | ✅ Backend done | 🟠 P2 | 1-2 |
| **Scoring Breakdown Tooltips** | Reduces churn (clarity) | ❌ Not built | 🔴 P0 | 3-4 |
| **Viral Tweet Detection + Notifications** | Drives shares | ❌ Not built | 🟡 P1 | 8-10 |
| **Prediction Accuracy Badge (Tapestry)** | Viral coefficient | ❌ Not built | 🟠 P2 | 4-5 |
| **Event Tracking Dashboard** | Metrics foundation | ❌ Not built | 🔴 P0 | 6-8 |
| **Friend Import (From Twitter/X)** | Activates social FOMO | ❌ Not built | 🟡 P1 | 5-7 |
| **Milestone Notifications** | Celebratory retention | ❌ Not built | 🟠 P2 | 2-3 |

---

## PHASE 1: FOUNDATION (WEEK 1-2 POST-HACKATHON) — 15-18 HOURS

### P0: Metrics + Auth Optimization

**1.1 Event Tracking Setup** (6-8h)
```typescript
// Add event system to capture growth metrics
// Frontend: track signup, draft, leaderboard view, shares
// Backend: track auth completion, time-to-aha, contest entry

Endpoints Needed:
- POST /api/v2/events (bulk event logging)
- GET /api/v2/analytics/dashboard (metrics view)

Events to Capture:
- auth.signup_started → auth.email_clicked / auth.google_clicked / auth.twitter_clicked
- auth.signup_completed
- draft.started → draft.captain_selected → draft.team_completed
- leaderboard.viewed
- leaderboard.share_clicked
- score.updated (track when scores refresh)
- user.returned_d2, returned_d7

Dashboards (via Segment/Mixpanel or custom):
- Funnel: Signups → Auth → Draft → Leaderboard → D1 Return
- Aha Metric: Time from signup to first live score
- Retention Curve: D1, D3, D7, D14, D30
- Share Rate: % of drafted teams shared
```

**Acceptance Criteria:**
- All events logged and queryable
- 90%+ event capture rate
- Dashboard shows D1 retention in real-time
- Time-to-Aha tracked (should be <5 min)

**1.2 Auth Flow Polish** (2-3h)
```typescript
// Frontend optimization to get auth-to-aha under 5 minutes

Issues to Fix:
- Privy modal load time (should <1s)
- Draft page rendering (should load previous leaderboard in bg)
- Leaderboard SSE connection (should subscribe immediately on page load)

Test:
- Incognito signin: Privy email → confirm email → draft team → see live scores
  Target time: <5 minutes total
- Metrics: Track at what step users drop (auth, draft, leaderboard load)
```

### P0: Leaderboard Core Features

**1.3 Scoring Breakdown Tooltips** (3-4h)

```typescript
// When user hovers over their score, show: "Why did I earn X points?"

Frontend:
- Add ScoreBreakdown component
- Show on hover: "Activity +3 pts, Engagement +4 pts, Viral +1 pts (threshold 50K, you: 45K)"
- Link to help page explaining scoring formula

Backend Change:
- Modify /api/v2/contests/:id/standings to include score_breakdown:
  {
    user_id: 47,
    total_score: 235,
    score_breakdown: {
      activity: 15,
      engagement: 42,
      growth: 18,
      viral: 8,
      captain_bonus: 22,
      spotlight: 12
    }
  }

Test:
- Hover over top 3 scores, verify breakdown matches formula
- Check that all breakdowns sum to total_score
```

**1.4 Rank Change Animations** (2-3h)

```typescript
// Animate rank changes on leaderboard (↑/↓ indicators)

Frontend:
- When scores update via SSE:
  - Detect if user.rank changed from previous
  - Show ↑ (green) if moved up, ↓ (red) if moved down
  - Animate for 1s (fade in/out)
  - Show change magnitude: "↑ 5 spots"

Example:
Before: Rank #47
After:  Rank #42 (with green ↑ 5 animation)

CSS:
.rank-up { animation: slideUp 0.3s ease-out; color: #10B981; }
.rank-down { animation: slideDown 0.3s ease-out; color: #F43F5E; }

Test:
- Submit team, watch score update
- Should see animation if rank changed
- Animation should complete in <1s
```

---

## PHASE 2: SOCIAL ENGAGEMENT (WEEK 3-4) — 20-25 HOURS

### P1: Leaderboard as Social Engine

**2.1 Friend Comparison View** (4-6h)

```typescript
// Add "Friends" tab to leaderboard
// Show user's rank + nearest 3 friends (above + below)

Backend:
POST /api/v2/leaderboard/friends/add
  body: { friend_user_id: 123 }
  response: { success, friends: [...] }

GET /api/v2/leaderboard/friends
  response: {
    current_user: { rank: 47, score: 235 },
    nearby_friends: [
      { rank: 45, score: 243, username: 'friend1', ... },
      { rank: 50, score: 230, username: 'friend2', ... }
    ],
    friend_count: 12
  }

Frontend:
- Add "Friends" tab next to "All"
- Show proximity leaderboard (tight spacing, easier to beat)
- Add "Add More Friends" → Import from X (requires OAuth)
- Show head-to-head vs each friend ("vs @friend1: You: 3-1")

Database:
- Add friend_relationships table:
  user_id (FK)
  friend_id (FK)
  created_at
  is_active (soft delete)

Test:
- Add friend via button
- Should appear on Friends leaderboard
- Should show head-to-head record
- Remove friend should soft-delete relationship
```

**2.2 Friend Import (From Twitter/X)** (5-7h)

```typescript
// "Add Friends" button → Import followers from X
// Shows which followers already on Foresight

Backend:
POST /api/v2/auth/twitter/followers
  body: { oauth_token: ... }
  response: { followers: [...], on_foresight: [...] }

POST /api/v2/leaderboard/friends/bulk-add
  body: { friend_ids: [123, 456, ...] }

Frontend:
- Button: "Import Friends from Twitter"
- OAuth popup → grants read:followers
- Shows list of followers, checkboxes for "add to Foresight friends"
- Bulk action: "Add 5 friends"
- Shows which are already on platform ("already a Foresight player!")

Messaging:
- "Add your Twitter friends to create rivalries"
- "Compete against people you follow"

Test:
- OAuth flow (use test account)
- Bulk-add 5+ followers
- Check friend leaderboard updates
```

**2.3 Trending Teams View** (4-5h)

```typescript
// Show fastest-rising teams (for the week)
// Highlights unconventional picks that are winning

Frontend:
- New "Trending" tab on Compete page
- Sort by: "Rank Change" (fastest rising)
- Show: Team formation, player names, current score, rank yesterday → rank today

Data:
GET /api/v2/contests/:id/standings?sort=trending&limit=10
response: [
  {
    user: { username, avatar },
    team: { formation, players },
    score: 245,
    rank: 3,
    rank_yesterday: 15,
    rank_change: -12,
    trend_direction: "up",
    notable_picks: ["@niche_protocol"] // unconventional picks
  }
]

Backend:
- Calculate rank_yesterday from historical snapshots
- Identify "notable_picks" (tier B/C players in top-10 teams = edge)
- Sort by abs(rank - rank_yesterday) DESC

Test:
- Check that trending teams have biggest rank swings
- Verify edge picks are highlighted
- Should refresh every 30 min (or with score updates)
```

### P1: Viral Growth Mechanics

**2.4 Live Viral Detection + Notifications** (8-10h)

```typescript
// When influencer gets viral tweet (100K+ engagement):
// Notify all users who picked that influencer

Architecture:
1. Cron job (every 15 min): Check TwitterAPI.io feed for viral tweets
2. Definition: 100K+ engagement in <2 hours = viral
3. For each viral tweet:
   - Find all teams with that influencer as player
   - Send notification: "Your pick just went viral!"
   - Trigger share CTA

Backend:
export async function detectViralTweets(): Promise<ViralEvent[]> {
  // Fetch top 100 influencers' recent tweets
  const tweets = await twitterApiIoService.fetchInfluencerTweets();

  const viral = tweets.filter(t => {
    const engagement = t.likes + t.retweets + t.replies;
    const ageHours = (now - t.created_at) / 3600000;
    return engagement > 100000 && ageHours < 2;
  });

  for (const tweet of viral) {
    // Find all teams with this influencer
    const teams = await db('fantasy_league_teams')
      .join('fantasy_league_roster', ...)
      .where('roster.influencer_id', tweet.influencer_id)
      .where('teams.contest_id', activeContestId);

    for (const team of teams) {
      // Send notification
      await sendNotification(team.user_id, {
        title: `Your pick just went viral! 🎉`,
        body: `@${tweet.author} got ${engagement}K engagement. +12 pts earned!`,
        link: `/contest/${team.contest_id}`,
        icon: 'trending'
      });

      // Track event
      await logEvent('viral_notification_sent', {
        user_id: team.user_id,
        influencer_id: tweet.influencer_id,
        engagement
      });
    }
  }
}

Frontend:
- Toast notification: "Your pick just went viral! 🎉"
- Deep link to contest detail page
- Show tweet + engagement metrics
- CTA: "Share your team!" (pre-fills X share)

Database:
- viral_events table: influencer_id, tweet_id, engagement, created_at
- viral_notifications table: user_id, viral_event_id, delivered_at

Test:
- Manually create high-engagement tweet
- Run cron detection
- Check that users with that influencer get notified
- Verify SSE notification delivery (<2 sec)
```

**2.5 Activity Feed UI Integration** (3-4h)

```typescript
// Backend already done, just add frontend visibility
// Show "What friends are doing" on home/feed page

Frontend:
- Card on home page: "Friends Activity"
- Show last 5 activities:
  - "@friend1 drafted a team (rank #47)"
  - "@friend2 moved up 5 spots!"
  - "@friend3 scored +23 pts this week"
- Click to view their team formation

Components:
import ActivityFeedCard from '../components/ActivityFeedCard';

<ActivityFeedCard
  limit={5}
  onActivityClick={(activity) => navigate(`/profile/${activity.user_id}`)}
/>

Backend:
GET /api/v2/activity-feed?limit=5&friends_only=true

Test:
- Add multiple users
- Trigger activities (draft, score change)
- Verify activity feed shows on home page
- Click through to profile works
```

---

## PHASE 3: INFLUENCER SEEDING + SCALE (WEEK 4-5) — 12-15 HOURS

### P1: Influencer Seeding Automation

**3.1 Influencer Seeding Script** (2-3h)

```bash
# Automated script to seed top influencers with demo teams

backend/src/scripts/seedInfluencers.ts

Purpose:
- Create Foresight accounts for top 20 influencers
- Seed their first demo team (auto-draft quality players)
- Mark them as "influencer" with blue badge
- Notify them via email

Execution:
pnpm exec tsx scripts/seedInfluencers.ts

Script:
1. Get top 20 influencers from influencers table (by followers)
2. For each:
   - Create user account with Privy ID (fake, seeded)
   - Create team with balanced roster (5-7 tier mix)
   - Create contest entry linking team
   - Mark is_influencer = true
3. Log created accounts to CSV (for manual outreach)

Output:
- accounts.csv: user_id, username, email, team_id, leaderboard_rank
- For manual email: "Here's your Foresight profile, your team is ranked #47"

Test:
- Run script
- Verify 20 accounts created
- Check they appear on leaderboard
- Verify leaderboard shows their names + teams
```

**3.2 Influencer Email Outreach Template** (1h)

```
Subject: You're ranked #47 on Foresight (Crypto Draft Predictions)

Hi @vitalik,

We built Foresight — a weekly fantasy sports game for Crypto Twitter.
Your name is already on our leaderboard because CT influencers are naturally part of the game.

Here's what's happening:
- Players draft teams of 5 CT people (like you)
- They earn points based on your engagement metrics
- Your followers are competing with your week's performance

Your team (auto-drafted from your stats) is currently ranked #47 out of 214 players.

Want to see it? → [Link to leaderboard]

This is actually proof that people care about predicting your influence.
Worth sharing with your followers?

— Team Foresight
(Solana Graveyard Hackathon)
```

---

## PHASE 4: ADVANCED GROWTH (WEEK 5-6) — 10-12 HOURS

### P2: Prediction Accuracy Badge

**4.1 Prediction Badge on Tapestry** (4-5h)

```typescript
// Track if user's picks were "early" (picked before viral moment)
// Generate Tapestry badge: "📈 Early Caller (predicted 3 viral tweets)"

Service:
export async function updatePredictionAccuracy(userId: number) {
  // Get all users' teams
  const teams = await db('fantasy_league_teams')
    .where('user_id', userId)
    .where('status', 'active');

  for (const team of teams) {
    // Get roster players
    const roster = await db('fantasy_league_roster')
      .where('team_id', team.id);

    // For each player, check if they had viral tweets this week
    let earlyPredictions = 0;
    for (const player of roster) {
      const viralTweets = await db('viral_events')
        .where('influencer_id', player.influencer_id)
        .where('created_at', '>', team.created_at); // After team drafted

      if (viralTweets.length > 0) {
        earlyPredictions += viralTweets.length;
      }
    }

    // Store badge data
    if (earlyPredictions >= 3) {
      const badge = {
        type: 'early_caller',
        count: earlyPredictions,
        week: currentWeek
      };

      // Store on Tapestry
      await tapestryService.publishContent(userId, {
        type: 'achievement',
        data: badge,
        namespace: 'foresight_badges'
      });
    }
  }
}

Cron:
// Run weekly at contest end
cronJobs.schedule('0 0 * * 0', updatePredictionAccuracy);

Frontend:
- Show badge on profile: "📈 Early Caller"
- Hover: "Predicted 3 viral tweets correctly"
- Badge links to Tapestry profile (verifiable on-chain)

Test:
- Draft team
- Wait for influencer to get viral tweet
- Run cron
- Check badge appears on profile + Tapestry
```

### P2: Milestone Notifications

**4.2 Celebration Moments** (2-3h)

```typescript
// Notify users when they hit milestones (rank breakthroughs)

export async function checkMilestones(userId: number) {
  const user = await db('users').where('id', userId).first();
  const standings = await db('foresight_score_leaderboard')
    .where('user_id', userId)
    .orderBy('created_at', 'desc')
    .first();

  const milestones = [
    { rank: 1, message: '🏆 #1 on the leaderboard! You\'re the top predictor.' },
    { rank: 10, message: '🥇 Top 10! You\'re an elite predictor.' },
    { rank: 50, message: '🥈 Top 50! Great predictions this week.' },
    { rank: 100, message: '🥉 Top 100! You\'re in the elite tier.' }
  ];

  for (const milestone of milestones) {
    if (standings.rank <= milestone.rank &&
        !user.last_milestone_notified ||
        user.last_milestone_rank > milestone.rank) {

      // Send notification
      await sendNotification(userId, {
        title: milestone.message,
        body: 'Your prediction skills are recognized!',
        type: 'milestone'
      });

      // Update user
      await db('users')
        .where('id', userId)
        .update({
          last_milestone_notified: new Date(),
          last_milestone_rank: standings.rank
        });
    }
  }
}

Test:
- Manually boost user's score
- Run milestone check
- Verify notification sent
```

---

## PHASE 5: MEASUREMENT & OPTIMIZATION (ONGOING) — 6-8 HOURS

**5.1 Growth Dashboard** (4-6h)

```typescript
// Real-time metrics dashboard for growth monitoring

GET /api/v2/analytics/growth-dashboard
response: {
  acquisition: {
    signups_today: 142,
    signups_week: 847,
    signups_month: 3420,
    top_source: 'x_organic'
  },
  activation: {
    draft_completion_rate: 0.82,
    aha_seen_rate: 0.71,
    avg_time_to_aha_minutes: 3.2,
    d1_retention: 0.52
  },
  retention: {
    d1: 0.52,
    d3: 0.38,
    d7: 0.28,
    d14: 0.19,
    d30: 0.14
  },
  viral: {
    organic_signup_rate: 0.18,
    viral_coefficient: 0.34,
    avg_shares_per_team: 0.22,
    share_to_signup_conversion: 0.15
  },
  engagement: {
    avg_leaderboard_views: 2.8,
    avg_score_refreshes: 5.2,
    avg_session_length: 8.3,
    contests_per_user: 1.7
  }
}

Frontend:
- Dashboard page: `/analytics`
- 4 cards: Acquisition, Activation, Retention, Viral
- Line charts for trends over time
- Alerts if metrics drop (D1 < 45%, viral coeff < 0.2)

Test:
- Verify all metrics calculate correctly
- Compare to expected targets
- Set up alerts for anomalies
```

---

## IMPLEMENTATION TIMELINE

### Must-Have for Hackathon Submission (Done)
✅ Core loop, live scoring, leaderboard, formation

### Week 1-2 Post-Launch (15-18h)
- [ ] Event tracking system
- [ ] Scoring breakdown tooltips
- [ ] Rank change animations
- [ ] Auth flow polish

### Week 3-4 Post-Launch (20-25h)
- [ ] Friend comparison leaderboard
- [ ] Friend import from Twitter
- [ ] Trending teams view
- [ ] Live viral detection + notifications
- [ ] Activity feed UI

### Week 5-6 Post-Launch (12-15h)
- [ ] Influencer seeding automation
- [ ] Prediction accuracy badges
- [ ] Milestone notifications
- [ ] Growth dashboard

---

## SUCCESS METRICS (By Phase)

| Phase | Metric | Target | Status |
|-------|--------|--------|--------|
| **Launch (Week 1-2)** | D1 Retention | >50% | Measure |
| | Time-to-Aha | <5 min | Measure |
| | Auth Completion | >80% | Measure |
| **Growth (Week 3-4)** | Viral Coefficient | >0.3 | Target |
| | Share Rate | >15% | Target |
| | Friend Activation | >40% | Target |
| **Scale (Week 5+)** | Influencer Share Rate | >30% | Target |
| | D7 Retention | >30% | Target |
| | DAU | 5K+ | Target |

---

## Technical Debt & Risk Mitigation

**Risk: Event Tracking Becomes Noisy**
- Mitigation: Implement event debouncing (300ms min between identical events)
- Test: Verify <1% duplicate events

**Risk: Viral Detection False Positives**
- Mitigation: Set high threshold (100K engagement) + manual review
- Test: Manual tweet monitoring, compare to algorithm

**Risk: Friend Import Hits X Rate Limits**
- Mitigation: Implement queue + backoff strategy
- Test: Bulk import 1000+ followers, verify no throttling

**Risk: Leaderboard Performance Degrades**
- Mitigation: Add indexes on (contest_id, rank) + caching
- Test: Load test 10K simultaneous viewers

---

*This roadmap is tied to the growth strategy in GROWTH_ANALYSIS.md. Each feature directly enables a specific growth lever. Prioritize by business impact, not engineering complexity.*

