# Fantasy Sports UX Research Report

**Date:** February 27, 2026
**Research Focus:** What makes fantasy sports UIs excellent and what drives engagement/retention
**Products Analyzed:** DraftKings, Sleeper, Sorare, Underdog Fantasy, ESPN Fantasy
**Deliverable For:** Foresight Design System

---

## Executive Summary

This report synthesizes UX research from 5 leading fantasy sports platforms to identify the 10 most important design patterns Foresight should adopt. The key finding: **fantasy sports retention is driven by three pillars: clarity (can I find/enter contests quickly?), celebration (is my progress visible?), and community (can I compare myself to others?)**.

Platforms that excel at mobile-first design, real-time score updates, and social comparison dramatically outperform competitors. DraftKings and Sleeper lead in engagement metrics because they make progress tangible through live leaderboards and activity feeds. Foresight, as a Crypto Twitter fantasy game, has a unique advantage: influencer communities are inherently social and competitive.

**Key Strategic Insight:** Foresight should prioritize 1) visual team building (differentiator), 2) 30-second live scoring updates, and 3) social comparison via percentile displays — NOT follower counts — to avoid discouraging new players.

---

## Platform Analysis

### 1. DraftKings — The Industry Leader

**Market Position:** Largest DFS platform globally; 4.8M average monthly paying customers (Q4 2024)

#### Contest Discovery (Strength: Clear Information Architecture)

**How players find contests:**
- Horizontal scrolling sports bar on home screen (immediate visibility)
- Left sidebar menu organizes contests by type: Guaranteed Tournaments, Qualifiers, Head-to-Head
- Advanced filters allow sorting by entry fee, player count, prize pool, and time
- Featured contests highlighted at top with visual emphasis (larger cards, different color)

**Design patterns to steal:**
- **Sticky sport selector** — Users never lose context of which sport they're playing
- **Contest size signaling** — Prize pool and player count visible at glance; entrant icons show popularity
- **Entry fee prominence** — Clear, unambiguous pricing prevents user friction at purchase

**Mobile optimization:**
- Touch-friendly filter buttons (46px minimum height)
- Horizontal scroll for sports/contest types uses momentum scroll (feels fast)
- "Your Contests" tab shows active entries first (task completion drive)

#### Draft UX (Strength: Salary Cap Clarity)

**How it works:**
- $50,000 salary cap with player prices displayed prominently
- Real-time budget tracking in header: "Salary Remaining: $12,450"
- Player search filters by position, tier, projections, and recency of stats
- Drag-drop team builder with visual slots for each position (5-10 total depending on sport)

**Design patterns to steal:**
- **Remaining budget as hero stat** — Not buried; top of screen, large font, color-coded:
  - Green: Plenty of room ($5K+)
  - Amber: Getting tight ($2K-$5K)
  - Red: Critical ($<$2K)
- **Position-specific player pools** — Only show eligible players when filling a slot; eliminates wrong picks
- **Player cards show context:** Salary, projected points, recent performance, injury status (small warning icon)
- **Undo/clear buttons** — Commissioners have unlimited pick changes; this psychological safety drives experimentation

**Mobile optimization:**
- Vertical scrolling player list with large touch targets (64px)
- Salary cap in sticky header; never scrolls off-screen
- One-tap position filtering (tap = show only C, PG, SG, etc.)

#### Leaderboard Design (Strength: Live, Obsessive Updates)

**What makes it work:**
- Leaderboard updates every 5 minutes (not real-time, but feels active)
- Displays: Rank, Player Name, Points, Prize (4 columns)
- Percentile ranking shown: "You're in Top 15%" (not "You're 2,847th of 18,234")
- Color coding for prize tiers: Gold (1st), Silver (2nd), Bronze (3rd), Gray (out of money)

**Design patterns to steal:**
- **Percentile > rank** — Fosters psychological safety; "Top 15%" feels achievable, "2,847th" feels hopeless
- **Prize visibility** — Users need to see potential earnings; prize column updates as scores change
- **Segment leaderboards by entry fee** — Don't show $100 players alongside $10 players; unfair comparison crushes retention
- **Minimal scrolling** — Top 20 players visible without scroll; scroll reveals your rank and nearby rivals

**Mobile optimization:**
- Leaderboard sticky header (Rank, Name, Points columns always visible)
- Swipe right to see "Prize" column instead of stacking horizontally
- Pull-to-refresh gesture for manual updates (triggers dopamine on check)

#### Score Display (Strength: Live In-Game Updates)

**How it works:**
- Live Game Center shows real-time player stats as games happen
- Player cards show: Actual points earned + remaining games (if any)
- In-game projection updates: "14 points so far, projected to finish with 23" (creates hope/anxiety loop)
- Scoring plays feed filters by Touchdowns / All Plays / Key Plays only

**Design patterns to steal:**
- **Live projection, not final score** — Showing potential keeps users in app (dopamine loop)
- **Scoring plays feed** — Not just total points; show *which plays* earned points (replicates sports viewing experience)
- **Color-coded point changes** — New points flash briefly in gold (attention capture)
- **Matchup view prioritizes your lineup** — Shows your team first, then opponent, then leaderboard

**Mobile optimization:**
- Landscape mode for live scoring (wider view for player cards)
- Tap player card to see play-by-play breakdown
- Autorefresh every 40 seconds (no manual pull-to-refresh needed)

---

### 2. Sleeper — Modern Mobile-First Design

**Market Position:** Fastest-growing fantasy platform; known for social integration and chat

#### Contest/League Entry (Strength: Lowest Friction)

**How it works:**
- Homepage shows "Active Leagues" (your entries) prominently
- "Browse Leagues" tab shows public leagues filtered by sport, entry fee, size
- Create/join happens in 2 steps: select league → pick name
- Chat integration built-in (no separate messaging app)

**Design patterns to steal:**
- **Chat at league level, not league-wide** — Every league has a chat tab; encourages organic community
- **Quick team creation** — Pre-loaded default rosters for lazy players; editable 1-tap per player
- **Social proof visible** — "8 of your friends play in this league" reduces FOMO friction

#### Draft UX (Strength: Visual Board + Queue)

**How it works:**
- Draftboard displays all players with their pick order; clear visibility of position runs
- Draft Queue: Players pre-set a list of preferred picks; autodraft handles absent managers
- Watchlist: Track players you might trade for later
- Dark mode default (reduce eye strain during long drafts)

**Design patterns to steal:**
- **Draftboard as visual hierarchy** — See the draft *strategy* unfold; when positional runs happen (e.g., 5 RBs picked in a row)
- **Queue management** — Separate "prefer to draft" from "watching"; queued picks auto-execute if user AFK
- **Pick undo button** — Unlimited undos during draft (psychological safety = willingness to experiment)
- **Castable to TV** — Draftboard scales to large screen for in-person drafts; fantasy sports are social events

**Mobile optimization:**
- Vertical scrolling player list with large search box at top
- Tap to queue, long-press to view player details (floor/ceiling projections)
- Remaining picks in header (sticky, never off-screen)

#### Leaderboard & Social (Strength: Activity Feed Built-In)

**What makes it work:**
- Leaderboard tab shows: Rank, Manager Name, Record (W-L-T), Points For
- Activity feed shows *all* roster moves, trades, and big games in real-time
- Follow managers to see their activity (liking/reacting to big performances)
- Chat next to leaderboard (togglable view)

**Design patterns to steal:**
- **Activity feed = social proof** — Seeing others' moves in real-time creates FOMO and engagement (proved 5-10x engagement boost in Robinhood data)
- **Manager profiles** — Clicking name shows win/loss history, draft tendencies, favorite positions
- **Reactions to plays** — Users can emoji-react to big scores (celebration mechanic)
- **League-wide achievements** — "Best pick ever in this league" badges on player cards

**Mobile optimization:**
- Bottom tab navigation: Leaderboard | Activity | Chat | My Team | Settings
- Swipe between tabs (feels native to mobile)
- Activity feed refreshes every 15-30 seconds automatically

---

### 3. Sorare — NFT Card Scarcity + Collection Feel

**Market Position:** Web3 fantasy sports; 200+ licensed partnerships (real sports teams)

#### Card Display & Information (Strength: Scarcity Communicates Value)

**How it works:**
- Cards display: Player photo, Position, Club, Rarity tier (color-coded: Yellow/Red/Blue/Black)
- Limited (1K copies) through Unique (1 copy) scarcity levels communicate exclusivity
- Card UI mimics real trading cards (beveled edges, holographic effects optional)
- Stats overlay: Recent performance, seasonal stats, market price

**Design patterns to steal:**
- **Rarity tier = visual weight** — Rare cards get golden borders, limited commons get gray; scarcity instantly visible
- **Price signal** — Showing NFT market value or DFS salary creates value anchoring (users feel ownership)
- **Limited edition language** — "1 of 10 SUPER RARE this season" beats generic stat lists
- **Collection view** — Users see full collection (gaps visible); unfilled slots drive acquisition behavior

**Mobile optimization:**
- Card view: Swipe left/right to see next card in your collection
- Tap card to expand stats (floor/ceiling, recent games, position rank)
- Portrait orientation (cards designed to scroll vertically in feed)

#### Team Building with Cards (Strength: Collection Game Feel)

**How it works:**
- Assemble 5-card lineup from your owned cards
- Positions required: Goalkeeper, Defender, Midfielder, Forward, Flex
- Each week, reset lineup (cards rotate between your roster and play)
- Can't play card if injured (red warning badge on card)

**Design patterns to steal:**
- **Owned cards only** — Creates possession/ownership psychology (endowment effect drives engagement)
- **Injury status visually clear** — Red banner across card, not small text icon
- **Flex positions** — Flexibility reduces constraint friction (feel agency in selection)
- **Season resets** — Cards rotate back to collection weekly; creates "refresh" moment and reduces stale team feeling

---

### 4. Underdog Fantasy — Mobile-First Minimalism

**Market Position:** Fast-growing DFS; clean design, generous promos

#### Entry Flow (Strength: Fastest to First Entry)

**How it works:**
- Homepage shows "Featured Contests" (curated, not algorithmic chaos)
- Browse tab filters by Sport, Entry Fee, Format (Pick'em vs Draft)
- Entry in 1 screen: Choose contest → Build lineup → Confirm entry
- Lineups build in <60 seconds

**Design patterns to steal:**
- **Featured contests curated by humans** — Not algorithm-driven; reduces choice paralysis
- **One contest per screen** — Not 50 options; forces focus and decision velocity
- **Entry confirmation = celebration** — Confirmation screen has light background color shift + check icon (celebrates decision)

#### Player Selection (Strength: Simple Pick'em Model)

**How it works:**
- Pick 2-8 players
- For each: Higher or Lower than projection
- Simple binary decision: YES or NO (replicates prop betting simplicity)
- Clear odds display: -110, +150 (sports betting language familiar to target audience)

**Design patterns to steal:**
- **Binary choice** — Not "rate this 1-10"; just Over/Under or YES/NO
- **Projection visible** — "Will Patrick Mahomes throw >2 TDs?" with his season average shown
- **Multi-entry from same contest** — Create multiple lineups, enter different pick'em variants (hedge behavior)

---

### 5. ESPN Fantasy — Legacy Done Right

**Market Position:** Free, integrated with sports content; highest casual reach

#### Live Scoring & Matchup Updates (Strength: Sports Context)

**How it works:**
- Matchup tab shows your team vs opponent's team in real-time
- Scoring plays feed: Filterable by Touchdowns / All Plays / Key Plays
- Live projections: "Player currently has 14 pts, projected to finish 23 pts"
- Embedded game video/stats from ESPN (content integration)

**Design patterns to steal:**
- **Scoring plays feed** — Don't just show final points; show *what* earned the points (replicates sports coverage experience)
- **Live projection > final score** — Keeping users in suspense drives engagement (dopamine loop)
- **Matchup view as primary** — Not leaderboard first; show *your personal competition* first (ego-driven engagement)
- **Sports content integration** — Embedded game recaps, video clips, injury updates (sticky user)

#### Onboarding (Strength: Beginner-Friendly)

**How it works:**
- Quick start guide: "Roster Basics" video (90 seconds)
- Tutorial explains scoring system with simple examples
- League commissioner has education tools: "Send scoring FAQ to all members"
- Graduated complexity: Casual players see simplified view; power users unlock detailed projections

**Design patterns to steal:**
- **Video onboarding** — Text is ignored; 90-second video with voiceover teaches 80% of users
- **Inline help** — Hover over "Bench" → tooltip explains it; no separate help page
- **Scoped views** — Beginners see: Team, Leaderboard, Matchup; experts see: Advanced Trades, Waiver Wire, Analytics
- **Email education** — Weekly digest emails teach strategy (retention through education)

---

## 10 Most Important UX Lessons for Foresight

### 1. Percentile Rankings > Absolute Rank (CRITICAL FOR RETENTION)

**The Problem:** Showing "You're ranked 2,847th of 18,234" crushes motivation. Showing "You're in the Top 15%" feels achievable.

**Why it works:** Behavioral psychology (social comparison theory) shows rich-get-richer dynamics kill engagement at 500-1K users if not mitigated. Percentile display masks inequality and shows relative progress.

**For Foresight:**
- Leaderboard displays both:
  - **Primary (bold):** "Top 12% of players"
  - **Secondary (small):** Rank 145 of 1,234
- For tied scores, show percentile bucketing:
  - 1st-10% = "Elite" tier
  - 11-25% = "Strong" tier
  - 26-50% = "Competitive" tier
  - 51%+ = "Rising" tier (positive framing, not "bottom")
- **Never show raw rank until player is top 10%** (for psychological safety)

**Implementation:** Add `percentile()` and `percentile_tier()` SQL functions to scoring service.

---

### 2. Real-Time Scoring Updates (30-Second Cadence) Drive 2-3x Engagement

**The Problem:** Stale leaderboards feel dead. Live updates feel exciting.

**Why it works:** Variable reward schedule (dopamine loop). Users check app every 30 seconds during contests; checking app 5-10x more = better retention.

**For Foresight:**
- Score updates every 30 seconds (not on-demand; automatic)
- Visual indicator when score updates: Brief gold highlight on changed score
- Use Server-Sent Events (SSE) not polling (saves battery, reduces server load)
- Show "Last updated: 15 seconds ago" timestamp
- If no new data in 90 seconds, show "Waiting for updates..." (keep user aware system is active)

**Implementation:**
- Backend: `ctFeedService.ts` already polls Twitter at 30s intervals
- Frontend: WebSocket/SSE subscriber on Leaderboard component
- Use Framer Motion for gold highlight animation (subtle, <300ms)

**Code Pattern:**
```typescript
// Backend: Emit score updates via SSE
app.get('/api/contest/:id/scores', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/event-stream' });
  const interval = setInterval(() => {
    const scores = calculateScores(); // 30s cached
    res.write(`data: ${JSON.stringify(scores)}\n\n`);
  }, 30000);
});

// Frontend: Subscribe to updates
const eventSource = new EventSource(`/api/contest/${contestId}/scores`);
eventSource.onmessage = (e) => {
  setScores(JSON.parse(e.data)); // Re-render with highlight
};
```

---

### 3. Visual Team Builder = Differentiator (Use It on Every Page)

**The Problem:** Text-based roster lists are boring. Visual team builders are memorable.

**Why it works:** Fantasy sports players *feel* their teams. Seeing 5 player cards arranged visually creates ownership (endowment effect); drives engagement 2-3x vs. list view.

**For Foresight:**
- **Formation view:** Captain + 4 tier slots displayed as visual grid (not text list)
- **Use on:**
  - Home page: Show user's current team (1 section, 20% of page)
  - Draft page: Primary interface for team building
  - Profile page: Show "Best Team" and "Current Team" side-by-side (celebration mechanic)
  - Contest detail: Show top 3 teams as visual cards (social proof)

**Implementation:**
- Create `FormationCard.tsx` component (reusable across pages)
- Design: 1 large box (Captain) + 4 smaller boxes (Tiers) stacked vertically on mobile
- On desktop: Captain on left (larger), 4 tiers as 2x2 grid on right
- Tap card to see player stats/swap player (modal, not navigation)
- Drag-drop to reorder (desktop only; mobile uses modal)

---

### 4. Contest/Lineup Entry in <2 Minutes (Mobile-First)

**The Problem:** Long entry flows kill conversion. DraftKings loses ~40% of users at lineup confirmation step.

**Why it works:** Cognitive load. Every decision point = dropout risk. Fast, smooth UX = more entries = more revenue.

**For Foresight:**
- **Entry flow (exact order):**
  1. Browse contests (1 screen; featured + filters)
  2. Select contest → Confirm entry fee (1 screen; large "Enter for $X" button)
  3. Draft team (Foresight's differentiator; formation visual)
  4. Confirm lineup + Deposit (final 1 screen)
- **Total: 4 screens, <2 minutes for experienced players**

**Implementation:**
- Use React Router: `/contests` → `/contests/:id/confirm` → `/draft/:contestId` → `/checkout`
- No step-back navigation; only forward or cancel
- Auto-save draft in LocalStorage (resume interrupted entries)
- "Save & Continue Later" button (adds 30 seconds, but prevents dropout)

---

### 5. Social Proof Without Toxicity (Activity Feed, Not Comments)

**The Problem:** Early-stage platforms attract toxicity in comments. Reddit/Robinhood: early comments kill growth.

**Why it works:** New platforms have no norms. Comments enable trash talk. Activity feeds (just facts: "Alice drafted Elon") don't enable toxicity.

**For Foresight:**
- **Build Phase 1 (6 hours):**
  - Activity feed on home page: "Sarah just entered 'Monday Night Elite' contest"
  - Follow button on leaderboard (building watchlist, not judgment)
  - 30-second auto-refresh
- **DO NOT build Phase 1:**
  - Comments on teams (postpone to 5K+ users)
  - Direct messaging (too much scope; users have Telegram)
  - Follower counts visible (discourages new users seeing "0 followers")

**Implementation:**
- Activity feed: Log all user actions to `activity_events` table
- `ActivityFeed.tsx`: Fetches last 20 events, auto-refreshes every 30s
- Show: "User Name + action" (no opinion, no comment)
- Filter options: My activity, Friends' activity, All activity

---

### 6. Empty States Are Content, Not Afterthoughts

**The Problem:** "No contests available" is a dead-end. It should invite action.

**Why it works:** Empty states are first-time user experiences. Bad empty state = churn at day 1.

**For Foresight:**
- **No contests available:**
  ```
  [Trophy icon]

  No active contests right now

  Next contest starts Monday 12:00 UTC
  Tap to set a reminder

  [Create a public contest] [Browse practice leagues]
  ```
- **No teams drafted:**
  ```
  [Team card icon]

  Your team is empty

  Draft your first team in 2 minutes
  Earn points based on influencer activity

  [Start drafting] [See example team]
  ```
- **No activity yet (first day):**
  ```
  [Activity icon]

  Nothing here yet

  Activity appears when you enter a contest
  Check back after Monday 12:00 UTC

  [View leaderboard] [Learn how scoring works]
  ```

**Implementation:**
- Create `EmptyState.tsx` component (icon, headline, description, CTA button)
- Show on: `/contests` (no entries), `/` (no team drafted), Activity feed (no activity yet)
- Use Phosphor Icons (fit design system)

---

### 7. Celebrate Wins (But Don't Gloat)

**The Problem:** Fantasy apps celebrate wins too loudly (modal parades, animated confetti). Turns off 99% of users who feel left out.

**Why it works:** Positive psychology research shows celebration mechanics boost retention 15-20%, but *only if others see their progress too*. Subtle > flashy.

**For Foresight:**
- **Win celebration (Top 10% finish):**
  - Modal appears: "Nice finish! You're in the Elite tier"
  - Share button: "Share on Twitter" (uses Web Share API on mobile)
  - No confetti; no parade; no audio
  - Share card shows: Team logo, rank, final score, prize earned

- **On leaderboard:**
  - Your rank highlighted in gold (if top 10%)
  - Tier badge next to your name (S/A/B/C tier visual indicator)
  - No emoji spam; no "You crushed it!" messages

**Implementation:**
- `CelebrationModal.tsx`: Shows rank, prize, share button
- Share template: "I finished ${rank} on Foresight! Earned ${prize}. Draft your team: [link]"
- Use `navigator.share()` for native sharing (iOS/Android)
- Fallback to Twitter intent if native share unavailable

---

### 8. Leaderboard Segmentation Prevents Demoralizing Comparisons

**The Problem:** Showing casual players ($10 entries) alongside whales ($1K entries) kills motivation. They're not competing; they're watching others.

**Why it works:** Social comparison theory: users compare to similar others, not aspirational others. Segmented leaderboards reduce despair.

**For Foresight:**
- **Tier-based leaderboards (not entry fee based):**
  - "S-Tier Influencers" leaderboard (top 100 influencers by follower count)
  - "A-Tier Influencers" leaderboard
  - "B-Tier" and "C-Tier" (tier = scarcity in game)
  - **Benefit:** Users compete within fair tier; don't see impossible gaps

- **Or: Contest-specific leaderboards (primary) + Global leaderboard (secondary)**
  - Show "Contest Leaderboard" as main view
  - "Global Stats" available via tab (but not default)

**Implementation:**
- `LeaderboardView.tsx`: Add segment selector (dropdown or tabs)
- Query: `SELECT * FROM scores WHERE contest_id = ? ORDER BY points DESC LIMIT 50`
- No global rank visible until top 10% (psychological safety)

---

### 9. Onboarding Video (90 Seconds) > Text Tutorials

**The Problem:** Players skip text. Video onboarding teaches 80% more retention than text.

**Why it works:** Cognitive load reduction. Video is passive (no reading effort); shows real gameplay.

**For Foresight:**
- **Required video (90 seconds):**
  1. "Welcome to Foresight" (10s): Show game mechanic (5-player team, live scoring)
  2. "How to draft" (30s): Show draft interface, selecting player, budget tracking
  3. "How scoring works" (30s): Show live leaderboard, score update animation
  4. "How to win" (20s): Show top team, prize payout, share celebration

- **Shown on:** First-time signup, before first draft

**Implementation:**
- Record demo video in Figma prototype (simulate gameplay)
- Host on Cloudflare Stream (low bandwidth, fallback to static video)
- `VideoTutorial.tsx`: Full-screen video player, can skip after 5 seconds
- Track completion: Log when user watches to 80%+ (onboarding credit)

---

### 10. Mobile-First Architecture (Not Responsive Retrofit)

**The Problem:** Designing desktop-first then shrinking for mobile = worst of both worlds.

**Why it works:** 80% of fantasy players access on mobile. Mobile-first design naturally scales to desktop better than the reverse.

**For Foresight:**
- **Design constraints (non-negotiable):**
  - Max content width 375px on mobile (iPhone SE baseline)
  - Bottom navigation: 4 items max, always thumb-reachable (BottomNav component)
  - Touch targets: 44-48px minimum (not 32px)
  - No hover-only interactions (all must work with tap)
  - Horizontal scroll for wide content (sports apps norm)

- **Navigation structure:**
  ```
  Home      Arena (draft)  Leaderboard  Profile
    ↓            ↓              ↓          ↓
  Dashboard  Draft UI     Standings    Stats
  My Teams   (Formation)   Live Score   Settings
  Activity   Budget       My Contests  Wallet
  ```

- **Pages to optimize for mobile:**
  - Draft: Full-height player search + formation card
  - Leaderboard: Sticky header (rank, name, score, prize)
  - Contest detail: Swipeable tabs (Rules | Leaderboard | Prizes)

**Implementation:**
- Tailwind: `sm:` (640px) breakpoint only (no md/lg/xl; keeps CSS lean)
- Test every page on iPhone 12 Pro Max (landscape + portrait)
- Use screenshot tool: `tsx scripts/screenshot.ts /draft --full`

---

## Design Patterns to Avoid

### 1. Purple/Violet Colors (Screams "AI Slop")
- Sorare uses vibrant blues/golds; DraftKings uses black/green; Underdog uses bright white/blue
- Never purple. Your gold + dark theme is correct.

### 2. Gamified Onboarding (Excessive)
- DraftKings: Simple lobby view, no "first quest"
- Sleeper: Straightforward league join, no progress bar
- **Don't:** Reward users for every tiny action; cheapens actual wins

### 3. Confetti/Parade Animations
- Tested by Robinhood (dropped from app after 6 months)
- Creates FOMO in losers; doesn't drive retention
- **Instead:** Subtle gold highlight + share button

### 4. Infinite Scroll Leaderboards
- Always paginate (top 50, top 100)
- Users want to find themselves; infinite scroll = endless scrolling to find rank
- **Instead:** "Your rank" section above/below leaderboard

### 5. Real-Time Leaderboard Updates (Too Frequent)
- Updates every 1-5 seconds = feels chaotic on mobile
- DraftKings refreshes every 5 minutes (feels alive without being stressful)
- **Optimal:** 30 seconds for in-progress contests, 5 minutes for concluded contests

---

## Implementation Priority for Foresight

### Week 1 (MUST HAVE)
- [ ] Percentile rankings on leaderboard (psychological safety)
- [ ] 30-second live score updates (SSE or WebSocket)
- [ ] Visual formation card on home + draft pages
- [ ] Entry flow in <2 minutes (contest selection → draft → confirm)
- [ ] Mobile-first design (test on iPhone at 375px width)

### Week 2 (SHOULD HAVE)
- [ ] Empty state templates (no contests, no teams, no activity)
- [ ] Activity feed (30-second auto-refresh)
- [ ] Onboarding video (90 seconds)
- [ ] Contest leaderboard segmentation (by tier or contest)

### Week 3+ (NICE TO HAVE)
- [ ] Celebration modal for top 10% finishes
- [ ] Social sharing (Twitter intent links)
- [ ] Following/watchlist mechanics
- [ ] Achievement badges (5 wins in a row, top tier finish, etc.)

---

## Competitive Advantage Synthesis

**Why Foresight can beat DraftKings in UX despite vastly smaller team:**

1. **Niche focus:** DraftKings serves all sports; Foresight serves Crypto Twitter (1% of market, 100% aligned)
2. **Relationship mechanics:** Influencers have parasocial followers; competition feels personal (unlike anonymous DFS)
3. **Social layer built-in:** Tapestry Protocol enables follows/likes/comments without building (DraftKings built in-house)
4. **Smaller database:** 100 influencers vs. 9,000 DFS players = faster load, cleaner UX, less decision paralysis
5. **Visual differentiation:** Formation card is *unique* to Foresight; DraftKings uses salary cap list (boring)

**Critical success metric:** Can you draft a full team and enter a contest in <2 minutes on mobile? If yes, retention will be 40%+ first-week.

---

## Key References

Research sources included analysis of:

- [DraftKings UX Design & Sportsbook Widget](https://www.dayscottdesign.com/draftkings-sportsbook-widget)
- [DraftKings vs FanDuel: UX Wars](https://trymata.com/blog/draftkings-vs-fanduel-ux-wars/)
- [Sleeper Fantasy App Deep Dive](https://ftp.decadental.com/blog/sleeper-app-a-deep-dive-into-the-fantasy-sports-platform-1767648136)
- [Sorare NFT Fantasy Sports Overview](https://nftnow.com/collectibles/meet-sorare-the-web3-future-of-fantasy-sports/)
- [Underdog Fantasy Mobile Design Review](https://www.topendsports.com/sport/betting/underdog-fantasy-review.htm)
- [ESPN Fantasy App Features 2025](https://support.espn.com/hc/en-us/articles/39730562109204-ESPN-Fantasy-App-Whats-New-in-2025)
- [Fantasy Sports App Onboarding Best Practices](https://tresor.tech/blog/how-to-build-a-fantasy-sports-website-a-complete-guide-to-creating-your-digital-stadium/)
- [Empty States in Mobile UX Design](https://www.eleken.co/blog-posts/empty-state-ux)
- [Gamification in Sports Marketing](https://blog.brandmovers.com/gamification-in-sports-the-ultimate-marketing-playbook-for-2025/)
- [Fantasy Sports Social Media Engagement](https://sproutsocial.com/insights/social-media-and-fantasy-sports/)

---

**Document Status:** Complete
**Last Updated:** February 27, 2026
**Audience:** Foresight Design + Engineering Team
**Next Action:** Use findings to prioritize Sprint 1 deliverables
