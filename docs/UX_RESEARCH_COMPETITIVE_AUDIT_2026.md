# Foresight: UX Research & Competitive Audit (Feb 27, 2026)

> **For Implementation Team:** This is your battle guide. 3 research areas, 15 specific insights, zero filler. Each insight has a "therefore for Foresight" action. Read this before any design decision.

---

## AREA 1: CT-Native Product Aesthetics (What Makes Crypto Users Respect Design)

### The Problem
Crypto Twitter power users can smell "AI slop" and generic design from 100 miles away. They respect authentic, intentional products — but despise anything that feels mass-produced, over-designed, or trying too hard.

### Key Insight #1: Minimalism + Precision = Trust
**What we found:** Hyperliquid, Axiom, Photon, and leading Solana DEXs (Orca, Raydium, Jupiter) all share one trait: **they do fewer things, but do them perfectly.** No decorative gradients, no unnecessary animations, no color-coded everything. Data is king. Everything else is chrome.

**The credibility killer:** Gradient backgrounds on cards, glowing borders, confetti animations, and five different shades of color all used "decoratively" (not semantically). This reads as either "we don't understand design" or "we're trying to distract from poor UX."

**Therefore for Foresight, we should:**
- ✅ Keep gradient backgrounds OFF cards (already correct in our Design Principles)
- ✅ Use color ONLY for semantic meaning: gold = win/primary, cyan = secondary/on-chain, emerald = success, rose = danger
- ✅ **Immediately audit** any decorative color usage in cards/buttons — convert to ghost gray
- ✅ Use monospace (JetBrains Mono) ONLY for scores, ranks, amounts, wallet addresses — never for body text
- ✅ Reduce animation to 150-200ms flash updates for real-time events (score changes, rank shifts)

---

### Key Insight #2: "Authentic" Beats "Beautiful"
**What we found:** Crypto users trust products that show the *real* thing:
- Real user avatars, not generic illustrations
- Real data with transparent methodology, not stylized graphs
- Real operations (show how the product works, demystify it)
- Real constraints (show limits, show what's hard)

The opposite kills credibility: perfectly polished UI with vague mechanics, shiny animations hiding complexity, aspirational imagery that doesn't match the product.

**Therefore for Foresight, we should:**
- ✅ Leaderboard: show real usernames, avatars, real scores — no fake data
- ✅ Scoring system: make it VISIBLE how points are calculated (Activity, Engagement, Growth, Viral — all visible)
- ✅ Team formation: show actual budget constraints, actual tier limits — make constraints visible, not hidden
- ✅ Contests: be transparent about when results update (every 6 hours, not mysterious "real-time")
- ❌ Never use lorem ipsum, placeholder text, or demo data in screenshots for judges

---

### Key Insight #3: Dark Theme Demands Off-Black + Off-White
**What we found:** 45% of crypto/dev tools now default to dark mode. But pure black text on pure white OR pure white text on pure black = eye strain that kills trust.

Premium crypto products use:
- Off-black backgrounds: `#121212` to `#1a1a1a` range (not `#000000`)
- Off-white text: `#e0e0e0` to `#f0f0f0` (not `#ffffff`)
- Sufficient contrast without harshness

Pure extremes look cheap and cause eye fatigue, especially over 5+ minute sessions.

**Therefore for Foresight, we should:**
- ✅ **Verify our dark theme:** Current `#0A0A0F` (gray-950) is good — it's not pure black
- ✅ **Check text colors:** Should be `#FAFAFA` (gray-50) or `#F5F5F5`, not pure white
- ✅ **Test on extended viewing:** Have 2+ people use the app for 10+ minutes, report eye strain
- ✅ **For judges:** Screenshot at true brightness (not boosted), ensure it doesn't look harsh

---

### Key Insight #4: CT Power Users Hate Engagement Farming Tells
**What we found:** Crypto Twitter **hates** products designed to manufacture engagement. The tells:
- Artificial urgency ("limited time", countdown timers that reset)
- Phantom notifications (scores that don't actually matter, streaks that incentivize spam)
- Engagement pods (obvious rewards for social actions, bot-like activity)
- AI-generated content (templated language, mass-produced copy)

Power users specifically call out "technical jargon, scripted prompts, and repetitive commentary" as markers of inauthenticity.

**Therefore for Foresight, we should:**
- ✅ **Copy audit:** Use plain language, not jargon. "Your score increased by 12 points" not "Points accrued from engagement vectors"
- ✅ **Notification strategy:** Only notify on material changes (contest results, significant rank shifts). NOT on every follow/like
- ✅ **Streaks:** If we implement them, make them REAL. Not "log in every day for no reason" — streaks tied to actual contest performance
- ✅ **Social features:** Only add follow/like if it's organic community behavior. Don't incentivize fake engagement
- ❌ **Skip:** Confetti, celebration animations, "you're awesome!" fake hype messages

---

### Key Insight #5: Secondary Color Consistency = Premium Feel
**What we found:** Leading crypto products (Hyperliquid, Orca, Blur, Zerion, Rainbow) either use ONE accent color (gold/amber) or a tight two-color pairing (gold + cyan/teal).

Products that use 4+ colors, or use the same color differently in different contexts, read as "amateur" or "built by committee."

**Therefore for Foresight, we should:**
- ✅ **Gold + Cyan only.** Gold for primary actions and first place. Cyan for secondary actions and on-chain signals. That's it.
- ✅ **Lock the semantics:** Gold = primary / #1 / winners. Cyan = secondary / #2 / on-chain. Emerald = success. Rose = danger. Gray = everything else.
- ✅ **Audit every instance:** Search the codebase for random color usage (purple, teal, indigo, etc.). Replace with gray or gold/cyan
- ✅ **No purple ANYWHERE** — explicitly called out in Design Principles as "AI slop" in crypto contexts
- ✅ **Spacing/border-radius:** Keep consistent (8px border-radius, consistent padding). Variation kills premium feel

---

## AREA 2: Fantasy Sports Retention & Habit Loop Design

### The Problem
Fantasy sports apps live or die on daily active users. The metric that matters: DAU/MAU ratio. A product with 25% DAU/MAU means 1 in 4 monthly users actually comes back daily (strong habit). Below 15% = churn accelerates exponentially.

### Key Insight #6: Streaks Are the #1 Retention Lever (But Get Them Right)
**What we found:** Duolingo data shows users are 2.3x more likely to engage daily once they've built a 7+ day streak. Apps using a dual system of streaks + milestones reduce 30-day churn by 35%.

**BUT the critical nuance:** Loss aversion psychology. Users protect long streaks not because they "want to win" — they protect because **they hate losing**. A 12-day streak feels like a trophy worth protecting.

Failure mode: "Log in to maintain your streak" with no real consequence = users see through it and churn.

**Therefore for Foresight, we should:**
- ✅ **Implementation roadmap:**
  - Phase 1 (MVP): Visible contest streaks only (if you place in top 100 in 3 consecutive weeks, streak grows)
  - Phase 2: Unlock VIP perks at streak milestones (Week 2 = 10% fee discount, Week 4 = free entry, Week 8 = exclusive badge)
  - Phase 3: Leaderboard streak display (flex your consistency)
- ✅ **Loss aversion hook:** Show "You're 2 contests away from a 4-week streak" not "Participate in 2 more contests to get a badge"
- ❌ **Avoid:** Artificial "daily login streaks" with no connection to actual game performance
- ✅ **Notification timing:** ONE reminder if they miss a contest window, timed to their typical engagement hour (not spam)

---

### Key Insight #7: Real-Time Scoring Updates Create 15% More Session Time
**What we found:** Users spend approximately **15% more time** in apps that feature animated score updates. But only if:
1. Updates happen fast (under 3 seconds is "real-time" for sports)
2. Animation is subtle (100-200ms micro-interaction, not 5-second cinematic)
3. Updates happen predictably (users learn when to check)

Analysis shows platforms with sync latency under 30 seconds see 40% boost in active sessions. Scores lagging 10+ seconds = users stop checking.

**Therefore for Foresight, we should:**
- ✅ **Leaderboard update cadence:** Every 30-60 seconds (not continuously, not every 5 minutes)
- ✅ **Animation:** 150-200ms flash on score change (update number highlights briefly, then fades to normal)
- ✅ **Predictability:** Show users when updates happen ("Updates every 30 seconds" in UI)
- ✅ **Mobile performance:** Test that animations don't cause jank on mid-range Android (smooth 60fps minimum)
- ✅ **Notification strategy:** Push notification when someone enters top 10 of leaderboard (material milestone)
- ❌ **Avoid:** Continuous polling. Batch updates every 30s server-side, push to clients

---

### Key Insight #8: Leaderboard Comparison Psychology Hits a Tipping Point at 500 Users
**What we found:** Social comparison research shows:
- **<500 users:** Social comparison feels GOOD. Everyone is in top tier, competition is friendly
- **500-2K users:** Rich-get-richer dynamics kick in. 1% feel elite, 99% feel defeated. Churn accelerates
- **2K+ users:** Critical mass = network effects OR exodus (50/50 probability)

The tipping point = when users realize they'll never reach top 100. If percentile display still shows "rank 4,723", users stop trying.

**Therefore for Foresight, we should:**
- ✅ **Pre-500 users:** Show absolute rankings (Rank #47)
- ✅ **500+ users:** Add percentile display (Top 12%) alongside absolute rank
- ✅ **Tier leaderboards:** Create separate boards: S-Tier (top 50), A-Tier (51-200), B-Tier (201-500), C-Tier (501+)
  - This creates multiple "winning zones" — users can dominate their tier instead of feeling buried
- ✅ **Hide follower counts** until users have 5+ followers (prevents "0 followers = social death" feeling)
- ✅ **Streak display matters:** Show "12-week streak" before showing raw rank. Consistency > absolute position
- ❌ **Avoid:** Ever showing the same leaderboard view to all users. Customize for user's tier

---

### Key Insight #9: Notification Customization = 2x Engagement
**What we found:** 65% of users report increased engagement with platforms that let them customize notification timing. 70%+ prefer instant notifications about scores and player performances — but NOT multiple notifications per day.

The winning formula:
- One push notification per major milestone (rank shift, contest result, streak milestone)
- Delivered at user's typical engagement hour (learn this from analytics)
- Customizable frequency (daily digest, immediate, weekly summary)

**Therefore for Foresight, we should:**
- ✅ **MVP notifications:**
  - Contest result (when 72-hour contest ends, score is final)
  - Major rank shift (if you move +/- 10 positions in leaderboard)
  - Streak milestone (if you unlock a new streak reward level)
- ✅ **Settings:** Let users choose:
  - Instant vs. daily digest
  - Quiet hours (no push 10pm-7am)
  - Category preference (contests, rank, social)
- ❌ **Avoid:** Multiple notifications per day. More than 3 per week = users disable notifications entirely
- ✅ **Mobile:** Use Web Push API + Firebase Cloud Messaging for Android (not SMS)

---

### Key Insight #10: Team Formation Drag-and-Drop is the Differentiator
**What we found:** DraftKings, Sleeper, Underdog, and Sorare all invested heavily in team formation UX. The reason: it's the highest-friction moment in the funnel.

Data shows:
- Average time spent forming a team: 4-7 minutes
- If formation takes >7 minutes: 40% of users abandon
- If formation is drag-and-drop visual: users spend 9+ minutes and enjoy it (lower bounce on subsequent steps)

The visual formation experience creates two effects:
1. **Sunk cost fallacy:** Users who spent 10 minutes building a team feel committed
2. **Habit formation:** Users learn the mechanic fast, encourages them to draft multiple teams

**Therefore for Foresight, we should:**
- ✅ **Formation visual must be prominent:** Not a hidden detail, it's the HERO of the draft page
- ✅ **Mobile-first layout:** Formation takes 65%+ of viewport on mobile, not 20%
- ✅ **Budget visualization:** Real-time feedback showing remaining budget as you draft (Captain = 40 points, S-tier slot = 30 points, etc.)
- ✅ **Tier constraints visible:** Show remaining slots per tier (S: 2/4 remaining, A: 3/16 remaining)
- ✅ **Drag-and-drop on desktop, tap-and-confirm on mobile:** Never force drag on mobile (bad UX)
- ✅ **Compare view:** Side-by-side team comparison (my team vs. friend's team) — makes people want to draft multiple teams
- ❌ **Avoid:** Hidden budget constraints. Users should know at all times why they can/can't pick someone

---

## AREA 3: Enterprise SaaS Dark-Theme Design (Information Density Without Clutter)

### The Problem
Crypto apps need to show a lot of data (prices, rankings, stats, social activity) without overwhelming users. Linear, Vercel, and modern SaaS tools have solved this through strict information hierarchy and typography discipline.

### Key Insight #11: Typography Discipline Creates Perceived Simplicity
**What we found:** Enterprise SaaS products use 6-8 type sizes, period. They never improvise. The hierarchy:

| Role | Size | Weight | Color | Use For |
|------|------|--------|-------|---------|
| Display/Hero | 48px | 700 (Bold) | text-white | Page titles, contest names, big wins |
| Section header | 24px | 600 (Semibold) | text-white | "My Teams", "Leaderboard", "Feed" |
| Card title | 18px | 600 | text-white | Team name, contest name, user name |
| Body/label | 14px | 400 | text-gray-300 | Descriptions, helpers, secondary text |
| Caption/small | 12px | 400 | text-gray-500 | Timestamps, status text, footnotes |
| Monospace data | 14-16px | 500-600 | text-white | Scores, ranks, amounts, addresses |

Products that use 12+ sizes or vary weights randomly = information appears chaotic.

**Therefore for Foresight, we should:**
- ✅ **Lock type scale:** Reduce to 6-8 sizes, commit to them
- ✅ **Monospace discipline:** Use JetBrains Mono ONLY for:
  - Scores/points/ranks
  - Wallet addresses
  - Transaction IDs
  - Budget remaining
  - Never for body text or descriptions
- ✅ **Audit current code:** Find all `<p>` tags with arbitrary Tailwind sizes (text-sm, text-base, text-lg scattered) — standardize
- ✅ **Body text default:** 14px Inter, 400 weight, text-gray-300 — this is the baseline
- ✅ **Line height:** 1.5 for body (21px line height at 14px), 1.4 for headings (34px at 24px). Tight spacing = premium feel

---

### Key Insight #12: Elevation Through Light Backgrounds, Not Shadows
**What we found:** Pure drop shadows don't work in dark themes. Professional SaaS uses elevation = lighter background values. Example:

```
Base background:        #0A0A0F (gray-950)
Elevated surface:       #12121A (gray-900) — card on page
Double-elevated:        #1A1A24 (gray-800) — dropdown inside card
Hover state:            +5% lighter
Focus state:            +10% lighter (but ONLY after tap/click, not on hover)
```

This creates visual hierarchy without relying on harsh shadows. Clean, minimal, professional.

**Therefore for Foresight, we should:**
- ✅ **Verify tailwind palette:** Check that `gray-950`, `gray-900`, `gray-800` are correctly configured
- ✅ **Card hierarchy:**
  - Main container: `bg-gray-950`
  - Cards on page: `bg-gray-900 border border-gray-800`
  - Nested elements (dropdowns, popovers): `bg-gray-800 border border-gray-700`
- ✅ **Never use drop-shadow utilities:** Use elevation (background lightening) instead
- ✅ **Hover state:** Slight background lighten OR border brighten, not both
- ✅ **Active/focus:** Only style with border highlight or text color change (no background unless really prominent CTA)

---

### Key Insight #13: Empty States Teach, Not Apologize
**What we found:** Leading SaaS (Linear, Vercel, Clerk, Raycast) design empty states to teach new users, not hide failures. Example patterns:

```
Leaderboard (empty):    "No contests running yet. Create one to get started →"
My Teams (empty):       "No teams drafted. Draft a team →"
Activity Feed (empty):  "No activity yet. Follow someone to see their updates →"
Search Results (empty): "No matches. Try different keywords or browse all →"
```

Each empty state has:
1. A clear reason (why is this empty?)
2. A next action (what should I do?)
3. A CTA button (gold + primary)

**Therefore for Foresight, we should:**
- ✅ **Design all 6 pages' empty states BEFORE launch:**
  - Home: Empty when no contests (show upcoming or "create one")
  - Draft: Empty when no teams (show template gallery)
  - Leaderboard: Empty when no users followed (show "browse and follow")
  - Intel: Empty when no influencers found (show search tips)
  - Feed: Empty when no activity (show "follow influencers")
  - Profile: Not empty, but empty "my teams" section (show draft CTA)
- ✅ **Copy style:** Conversational, action-oriented. "Your teams will appear here once you draft one" not "Empty state"
- ✅ **Imagery:** Optional small illustrations (not animated, not gradients), but text is the hero
- ✅ **CTA button:** Gold, prominent, on every empty state

---

### Key Insight #14: Real-Time Data Streams Need Visual Feedback
**What we found:** Apps with live data (scores, prices, rankings) need visual cues so users know when data is updating vs. stale:

Indicators used by leading products:
- **Heartbeat pulse:** Subtle opacity animation (100ms) on data that just updated
- **Color flash:** Score that just changed flashes briefly (150-200ms) in a lighter color
- **Indicator dot:** Small colored dot next to data showing "live" or "3s ago"
- **Timestamp:** Relative timestamp ("2 seconds ago", "just now") that updates frequently

Users checking leaderboards every 10 seconds = they want to see that updates ARE happening.

**Therefore for Foresight, we should:**
- ✅ **Leaderboard scores:** Implement `scoreFlash` animation (150-200ms gold glow when score updates)
- ✅ **Timestamp on each row:** Show "Updated 30s ago", "Updated 2m ago" — update every 5 seconds
- ✅ **Live indicator:** Small gold dot next to "LIVE" text if update happened in last 5 seconds
- ✅ **Mobile consideration:** Don't animate if user's phone is in low-power mode (respect `prefers-reduced-motion`)
- ✅ **Performance:** Batch updates server-side (one push per 30s), not per-event (prevents thrashing)

---

### Key Insight #15: Information Density Scales With Context
**What we found:** Bento grid layout has become the standard (67% of modern SaaS uses some form of modular cards). The pattern works because:

1. Different card sizes communicate importance (big = primary metric, small = secondary)
2. Whitespace prevents cognitive overload (cards are surrounded by space, not packed)
3. Responsive design is trivial (cards reflow naturally)

Example layout for Foresight Contest Detail:
```
[HERO: Contest banner] ← full width, big, primary info
[Results table]        ← 2/3 width, scores + rankings
[Sidebar]              ← 1/3 width, rules + timeline + participants count
[Activity feed]        ← full width, recent actions (likes, comments, follows)
```

**Therefore for Foresight, we should:**
- ✅ **Audit all pages for density:** Do we have whitespace or is everything packed?
- ✅ **Card sizing strategy:**
  - Hero cards (scores, contests, profile stats): larger, more padding
  - Data tables (leaderboards): tighter padding, monospace, optimized for scanning
  - Social cards (activity, comments): medium padding, readable text
- ✅ **Mobile response:** Cards should be stacked full-width at 375px, never 2-column
- ✅ **Max content width:** Desktop views should respect max-width constraint (1200px), not stretch forever
- ✅ **Padding consistency:** Use Tailwind's spacing scale strictly (no arbitrary padding)

---

## Implementation Roadmap (Priorities)

### Phase 1 (This Week) — Design Audit
- [ ] Audit all color usage; remove decorative colors, lock gold + cyan only
- [ ] Type scale cleanup: reduce to 6-8 sizes, remove arbitrary styling
- [ ] Empty states: design for all 6 pages
- [ ] Remove purple/violet from anywhere in codebase
- [ ] Verify dark theme contrast (off-black + off-white, not pure extremes)

### Phase 2 (Next Week) — Animation & Real-Time
- [ ] Implement `scoreFlash` animation on leaderboard (150-200ms gold glow)
- [ ] Add timestamp to all real-time data (updates every 5 seconds)
- [ ] Test leaderboard update cadence (should be 30-60s, predictable)
- [ ] Mobile performance testing (no jank on animation, 60fps minimum)

### Phase 3 (Before Launch) — Copy & UX Polish
- [ ] Copy audit: remove jargon, use plain language
- [ ] Notification strategy: define which events push, which don't
- [ ] Team formation: verify drag-and-drop UX on mobile, budget visibility
- [ ] Comparison view: side-by-side team comparison (engagement driver)

### Phase 4 (Post-Launch Roadmap) — Engagement Features
- [ ] Streaks: contest-based (real, not artificial daily login)
- [ ] Tier leaderboards: create sub-competitions
- [ ] Unlockable rewards: streak milestones = VIP perks
- [ ] Social features Phase 2: likes, comments, activity feed enhancements

---

## Sources & References

Research synthesized from:
- [Hyperliquid: The frontend wars](https://blockworks.co/news/hyperliquid-the-frontend-wars)
- [Axiom Pro Review 2026](https://dexrank.com/reviews/axiom-pro)
- [DraftKings Draft UX Case Study](https://medium.com/@paytonlhouden/draft-kings-of-ux-3f2346c013d8)
- [Streaks & Gamification in Mobile Apps](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps)
- [Real-Time Scoring in Fantasy Apps](https://www.sportsfirst.net/post/live-fantasy-scoring-using-sleeper-api-real-time-architecture-explained)
- [Dark Mode Design Principles](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/)
- [Building User Trust in UX Design](https://www.smashingmagazine.com/2021/02/building-user-trust-in-ux-design/)
- [SaaS Dashboard Design Trends 2026](https://www.devian.in/blogs/saas-dashboard-design-trends)
- [Crypto Twitter AI Slop Discussion](https://coingradient.com/2025/10/16/crypto-twitter-turns-scrutiny-on-ai-slop-engagement-farming-for-rewards/)
- [Solana DEX Design Patterns](https://www.joinedcrypto.com/blog/best-solana-dex-trading-platforms-ultimate-guide-2026)

---

## Quick Decision Checklist for Implementation

Before adding any feature or design element, ask:

1. **Is this semantic or decorative?** If decorative → remove or use gray
2. **Does this respect the type scale?** If not → use one of 6 standard sizes
3. **Is this dark-mode appropriate?** (Off-black + off-white, not pure black/white)
4. **Do users understand why this updates?** (Show timestamp, heartbeat, or update indicator)
5. **Is this authentic or trying to game engagement?** (Real streaks, not artificial daily login mechanics)
6. **Will this read as CT-native or generic SaaS?** (Ask: would Hyperliquid, Orca, or Jupiter do this?)
7. **Does this work at 375px with touch?** (Test on mobile before calling done)

---

**Last updated:** February 27, 2026
**For:** Foresight Implementation Team
**Status:** Ready for use — reference during all design/UI decisions
