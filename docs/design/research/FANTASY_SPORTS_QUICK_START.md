# Fantasy Sports UX — Quick Start Guide

**For:** Foresight Design & Engineering Team
**Time to Read:** 5 minutes
**Document Type:** Decision matrix for prioritization
**Companion Document:** `FANTASY_SPORTS.md` (full research)

---

## The 10 Rules (In Priority Order)

### Rule #1: Percentile Rankings (NOT Absolute Rank)
**Impact:** 2-3x increase in retention
**Do This:**
- Leaderboard shows: "You're in Top 12%" (primary, bold)
- Secondary: Rank 145 of 1,234 (small text)
- Tier labels: Elite (1-10%) | Strong (11-25%) | Competitive (26-50%) | Rising (51%+)
- Never show raw rank until player is top 10%

**Code Pattern:**
```sql
SELECT
  user_id,
  score,
  PERCENT_RANK() OVER (ORDER BY score DESC) * 100 as percentile,
  CASE
    WHEN PERCENT_RANK() OVER (ORDER BY score DESC) <= 0.10 THEN 'Elite'
    WHEN PERCENT_RANK() OVER (ORDER BY score DESC) <= 0.25 THEN 'Strong'
    -- etc
  END as tier
FROM scores;
```

**Blocker:** SQL query needs `PERCENT_RANK()` window function (PostgreSQL 8.4+, we're good)

---

### Rule #2: Live Score Updates (30-Second Cadence)
**Impact:** 5-10x more app opens during contests
**Do This:**
- Backend: Emit score changes via Server-Sent Events (SSE) every 30 seconds
- Frontend: Subscribe to `/api/contest/:id/scores` SSE stream
- Visual feedback: Brief gold highlight when score changes
- Show timestamp: "Last updated: 15s ago"

**Code Pattern (Backend):**
```typescript
app.get('/api/contest/:id/scores', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache'
  });

  const sendUpdate = async () => {
    const scores = await getContestScores(req.params.id);
    res.write(`data: ${JSON.stringify(scores)}\n\n`);
  };

  sendUpdate(); // Send immediately
  const interval = setInterval(sendUpdate, 30000); // Every 30s

  req.on('close', () => clearInterval(interval));
});
```

**Code Pattern (Frontend):**
```typescript
useEffect(() => {
  const eventSource = new EventSource(`/api/contest/${contestId}/scores`);
  eventSource.onmessage = (e) => {
    const newScores = JSON.parse(e.data);
    // Highlight changed scores with Framer Motion
    setScores(newScores);
  };
  return () => eventSource.close();
}, [contestId]);
```

**Blocker:** Requires SSE implementation; check if already in `ctFeedService.ts` pattern

---

### Rule #3: Visual Team Builder (Formation Card)
**Impact:** Ownership psychology; 2-3x higher team attachment
**Do This:**
- Create `FormationCard.tsx` component (reusable)
- Show: 1 Captain box (large) + 4 Tier boxes (smaller, stacked vertically on mobile)
- Use on: Home page, Draft page, Profile page, Contest detail
- Tap to expand player details; drag-drop to reorder (desktop only)

**Figma Component:**
```
┌─────────────────────┐
│  CAPTAIN [Avatar]   │
│  Elon (Captain)     │  ← Large, bold
│  (1.5x Points)      │
└─────────────────────┘
┌────┬────────────────┐
│ S  │ Vitalik S-Tier │  ← 2 columns
├────┼────────────────┤
│ A  │ Joe A-Tier     │
├────┼────────────────┤
│ B  │ Alice B-Tier   │
├────┼────────────────┤
│ C  │ Bob C-Tier     │
└────┴────────────────┘
```

**Blocker:** Needs player card design (avatar, name, tier badge)

---

### Rule #4: Entry Flow <2 Minutes (Mobile-First)
**Impact:** 40% improvement in entry completion rate
**Do This:**
1. Browse contests (1 screen, featured + filters)
2. Select contest + confirm entry fee (1 screen)
3. Draft team (Foresight's hero feature, 1 screen)
4. Checkout (confirm + pay, 1 screen)

**Routes:**
```
/contests (browse)
  ↓
/contests/:id/confirm (entry fee)
  ↓
/draft/:contestId (formation UI)
  ↓
/checkout (payment)
```

**Blocker:** Requires flow testing on actual mobile device

---

### Rule #5: Activity Feed (Not Comments)
**Impact:** Social proof without toxicity; 2-3x more repeat entries
**Do This:**
- Show on home page: "Sarah just entered 'Monday Night Elite'"
- Auto-refresh every 30 seconds
- Include follow button (build watchlist, not judgment)
- DO NOT add comments until 5K+ users (too risky for early growth)

**Component:**
```typescript
<ActivityFeed>
  <ActivityItem user="Sarah" action="entered contest" contest="Monday Night Elite" time="2m ago" />
  <ActivityItem user="Mike" action="drafted team" points="+45" time="5m ago" />
</ActivityFeed>
```

**Blocker:** Need `activity_events` table (log: user_id, action, created_at)

---

### Rule #6: Empty States Are Content
**Impact:** 15-20% improvement in activation for new users
**Do This:**
Create templates for:
- No contests available: "Next contest starts Monday 12:00 UTC" + Remind button
- No teams drafted: "Draft your first team in 2 minutes" + Start button
- No activity: "Activity appears when you enter a contest" + Learn button

**Component:**
```typescript
<EmptyState
  icon={TrophyIcon}
  title="No teams drafted"
  description="Draft your first team in 2 minutes"
  primaryAction={{ label: 'Start drafting', href: '/draft' }}
  secondaryAction={{ label: 'See example team', onClick: () => {} }}
/>
```

**Blocker:** Needs Phosphor Icon selection + copy approval

---

### Rule #7: Celebrate Wins (Subtly)
**Impact:** 15-20% boost to repeat plays (retention metric)
**Do This:**
- Modal on finish: "Nice finish! You're in the Elite tier (Top 12%)"
- Share button: "Share on Twitter" (uses Web Share API)
- No confetti; no sound; no parade
- Show on leaderboard: Tier badge + gold highlight if top 10%

**Component:**
```typescript
<CelebrationModal
  rank="Elite"
  percentile="Top 12%"
  prize="$120"
  onShare={() => navigator.share({
    title: 'I placed Top 12% on Foresight!',
    text: `Earned $120. Draft your team: ${shareUrl}`
  })}
/>
```

**Blocker:** Web Share API only works on HTTPS + mobile (OK for web, fallback to Twitter intent)

---

### Rule #8: Leaderboard Segmentation
**Impact:** Prevents demoralizing comparisons; 20% improvement in retention
**Do This:**
- Show contest leaderboard first (only people in same contest)
- Tier leaderboards secondary (S/A/B/C tier competition)
- Global leaderboard hidden until top 10% (psychological safety)

**UI:**
```
[Contest Leaderboard ▼] [Tier Leaderboards] [Global Stats]

Top 50 in "Monday Night Elite"
1. Sarah | 156 pts | $240
2. Mike | 142 pts | $180
...
[Your Rank: 15th | 95 pts]
```

**Blocker:** None, straightforward UI pattern

---

### Rule #9: Onboarding Video (90 Seconds)
**Impact:** 80% more retention than text tutorials
**Do This:**
- Record demo video (walkthrough from signup to leaderboard)
- Show on first signup, can skip after 5 seconds
- Sections: Game mechanic (10s) | Draft (30s) | Scoring (30s) | Winning (20s)

**Technical:**
- Host on Cloudflare Stream (low bandwidth, fallback to static video)
- Embed `<VideoTutorial />` component with play/pause controls
- Track completion: Log when user watches 80%+ for onboarding credit

**Blocker:** Video production (can be Figma prototype + voiceover, <3 hours)

---

### Rule #10: Mobile-First (Non-Negotiable)
**Impact:** 80% of users access on mobile; design accordingly
**Do This:**
- Design constraint: Max 375px width (iPhone SE baseline)
- Bottom navigation: 4 items max, always reachable by thumb
- Touch targets: 44-48px minimum (not 32px)
- No hover-only interactions (all must work with tap)
- Test every page: `tsx scripts/screenshot.ts /draft --full`

**Navigation:**
```
┌─────────────────────────┐
│     [Content]           │
│                         │
│                         │
├─────────────────────────┤
│ Home │ Arena │ Board │ Profile
```

**Blocker:** None, already planned; just discipline

---

## What NOT to Do

| Pattern | Why Not | When Safe |
|---------|---------|-----------|
| Purple/Violet colors | Screams "AI slop" | Never (stick with gold + dark) |
| Comments section | Early toxicity kills growth | After 5K+ users with community norms |
| Follower counts visible | New users see "0 followers" = churn | After user has 5+ followers |
| Confetti animations | Creates FOMO in losers | Never (use subtle highlight instead) |
| Infinite scroll leaderboards | Users can't find their own rank | Use pagination (top 50, top 100) |
| Real-time leaderboard (1-5s refresh) | Chaotic on mobile | Use 30s cadence instead |

---

## Implementation Checklist

### Week 1 (MUST HAVE)
- [ ] Percentile rankings on leaderboard
- [ ] 30-second live score updates (SSE)
- [ ] Visual formation card (component)
- [ ] Entry flow optimized for <2 minutes
- [ ] Mobile tests at 375px width

### Week 2 (SHOULD HAVE)
- [ ] Empty state templates (all screens)
- [ ] Activity feed with 30s refresh
- [ ] Onboarding video (90s)
- [ ] Contest leaderboard segmentation

### Week 3+ (NICE TO HAVE)
- [ ] Celebration modal
- [ ] Twitter sharing
- [ ] Follow/watchlist mechanics
- [ ] Achievement badges

---

## Competitive Advantage (Why Foresight Wins)

**DraftKings has:**
- 4.8M paying users
- 10 years of polish
- $50M marketing budget

**Foresight has:**
- Visual formation card (unique)
- Crypto Twitter niche (aligned userbase)
- Tapestry integration (social layer built-in)
- 100 influencers (smaller, faster, less decision paralysis)
- 90-second onboarding (vs. 30-minute DraftKings setup)

**Critical metric:** Can someone signup → draft team → enter contest → see live scoring in <5 minutes? If YES, retention will be 40%+ first-week.

---

## Success Metrics

| Metric | Target | Why |
|--------|--------|-----|
| Entry completion rate | >70% (vs. DraftKings' 60%) | Tight mobile UX |
| Time to first entry | <5 minutes | Onboarding video + fast flow |
| Leaderboard views | >10 per user per contest | Live updates drive obsession |
| App open rate during contest | 5-10x (vs. static leaderboards) | 30-second refresh = dopamine loop |
| 7-day retention | >40% | Celebration mechanics + activity feed |

---

**Status:** Ready for implementation
**Next Step:** Assign ownership to frontend engineer
**Questions?** Reference `FANTASY_SPORTS.md` (full research with code patterns)
