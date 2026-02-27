# Foresight UX Research: Executive Summary (Feb 27, 2026)

## The Mission
Answer: How do we design Foresight so CT power users respect it, fantasy players come back daily, and judges see a product they'd use?

## The Answer in 3 Bullet Points

1. **CT users respect authenticity over beauty.** Crypto Twitter power users can smell "AI slop" instantly. They respect products that are restrained, precise, and transparent about how they work. Products that try too hard (gradients, confetti, fake hype) are instant losers.

2. **Fantasy sports retention is solved: streaks + real-time updates + tier leaderboards.** The research shows 2.3x engagement lift from 7+ day streaks, 15% more session time from visible score updates, and critical tipping point at 500 users where social comparison turns negative (unless you use tier-based leaderboards).

3. **Enterprise SaaS dark-theme design is the blueprint.** Linear, Vercel, and modern tools have cracked information density without clutter: tight type scale (6 sizes), elevation through light backgrounds (not shadows), empty states that teach. This exact pattern works for Foresight.

---

## Three Research Areas, 15 Specific Insights

### AREA 1: CT-Native Aesthetics (What Crypto Users Respect)

**Key Insights:**
1. Minimalism + precision = trust. Leading Solana/crypto apps (Hyperliquid, Orca, Photon) do fewer things perfectly. No decorative gradients, no five colors, no confetti.
2. Authenticity beats beauty. Show real data, real users, real constraints. Transparency builds credibility.
3. Dark theme demands off-black + off-white (not pure extremes). Pure black/white causes eye strain and reads as cheap.
4. CT users hate engagement farming tells (artificial urgency, phantom notifications, AI-generated copy). These are instant credibility kills.
5. Secondary color consistency = premium feel. Lock to 2 colors (gold + cyan). Variation reads as amateur.

**Applied to Foresight:**
- ✅ Remove all decorative colors → use gray for chrome, color only for semantic meaning
- ✅ Keep off-black (#0A0A0F) + off-white (#FAFAFA) dark theme
- ✅ Lock gold + cyan only, remove purple everywhere
- ✅ Show real methodology for scoring (Activity, Engagement, Growth, Viral all visible)
- ✅ Use monospace ONLY for scores/ranks/amounts
- ✅ Copy should be plain language, no jargon, no fake hype

---

### AREA 2: Fantasy Sports Retention (Science-Backed Mechanics)

**Key Insights:**
6. Streaks create 2.3x engagement lift (but only if REAL: tied to actual performance, not just login)
7. Real-time scoring updates + animations increase session time by 15%. Critical: updates must be <3 seconds, animations 150-200ms (not showy)
8. Leaderboard comparison psychology has a tipping point: <500 users = positive competition, 500+ = 99% feel defeated
9. Notifications are powerful but dangerous. One per major milestone, customizable timing, never >3/week or users disable
10. Team formation drag-and-drop is the engagement differentiator. 9+ minute sessions for visual builders vs. 4 minutes for forms

**Applied to Foresight:**
- ✅ Implement contest-based streaks (real: top 100 performance)
- ✅ Add leaderboard update cadence indicator ("Updates every 30s")
- ✅ Implement `scoreFlash` animation (150-200ms gold glow on score change)
- ✅ Use tier leaderboards at 500+ users (prevent 99% feeling defeated)
- ✅ Notifications: contest results, major rank shifts, streak milestones only
- ✅ Formation visual must be the hero (65%+ of draft page on mobile)
- ✅ Real-time budget feedback as users draft

---

### AREA 3: Enterprise SaaS Dark-Theme (Information Density Without Clutter)

**Key Insights:**
11. Typography discipline creates perceived simplicity. 6-8 type sizes locked, never improvised. Monospace ONLY for data
12. Elevation through light backgrounds, not shadows. Off-black base (#0A0A0F) → gray-900 cards → gray-800 nested elements
13. Empty states teach, not apologize. Every view needs designed empty state with reason + next action + gold CTA
14. Real-time data streams need visual feedback. Timestamp ("Updated 3s ago"), heartbeat pulse, or live indicator dot
15. Information density scales with context. Bento grid layout (varied card sizes) prevents cognitive overload. Whitespace is a feature

**Applied to Foresight:**
- ✅ Lock 6 type sizes: 48px hero, 24px section header, 18px card title, 14px body, 12px caption, monospace data
- ✅ Remove all drop-shadows, use elevation (lighter background) instead
- ✅ Design empty states for all 6 pages with gold CTA
- ✅ Add timestamps to live data ("Updated 30s ago")
- ✅ Audit card sizing: hero cards larger, data tables tighter, social cards medium
- ✅ Verify max-width constraint on desktop (1200px), full-width stack on mobile

---

## Implementation Roadmap (This Week)

### Phase 1: Design Audit (Monday-Tuesday)
- Audit all color usage; lock gold + cyan only
- Reduce type scale to 6 sizes
- Design empty states for all 6 pages
- Remove purple from codebase
- Verify dark theme contrast (real eyes, extended viewing)

### Phase 2: Animation + Real-Time (Wednesday-Thursday)
- Implement `scoreFlash` animation on leaderboard
- Add timestamps to all real-time data
- Test leaderboard update cadence (30-60s, predictable)
- Mobile performance test (60fps minimum)

### Phase 3: Copy + UX Polish (Friday)
- Copy audit: remove jargon, use plain language
- Define notification strategy (which events push)
- Verify team formation UX (mobile drag-and-drop, budget visibility)
- Design comparison view (side-by-side team comparison)

---

## Competitive Benchmarks (Reference Points)

When in doubt about a design decision:

| Question | Reference | Pattern |
|----------|-----------|---------|
| "How professional should this feel?" | Hyperliquid | Restrained, monospace data, professional |
| "What's the minimalist approach?" | Orca | Clean, uncluttered, one thing done right |
| "How mobile-first should we be?" | Photon | Mobile-native energy, no pretense |
| "How should we handle dark theme?" | Linear/Vercel | Off-black + off-white, typography discipline |
| "How should team formation work?" | DraftKings | Visual builder, budget visibility, drag-and-drop |
| "How should leaderboards feel?" | Sleeper | Live updates, social features, streaks |

---

## Key Metrics to Track Post-Launch

Research tells us these are the levers:

1. **DAU/MAU ratio** (target: >20%) — Indicator of habit formation
2. **Contest streak retention** — Users who complete 3+ consecutive contests
3. **Leaderboard update engagement** — % of users who check within 30s of update
4. **Team formation completion time** — Should be 6-9 minutes (visual builder effect)
5. **Notification opt-in rate** — >70% means notifications are working
6. **Tier leaderboard engagement** — At 500+ users, monitor if tier boards reduce churn
7. **Session length** — Real-time updates should add 15% more time

---

## What We're NOT Doing (And Why)

Research explicitly recommends against:

- ❌ Confetti, celebration animations, "You're awesome!" messages (reads as AI slop)
- ❌ Artificial engagement farming (log-in streaks, phantom notifications, engagement pods)
- ❌ Colors just for decoration (every color must mean something)
- ❌ Comments as a core social feature (new platforms = high toxicity risk)
- ❌ Direct messaging (scope creep, users have Twitter/Telegram)
- ❌ Multiple push notifications per day (users disable immediately)
- ❌ Body text in monospace (confuses data hierarchy)
- ❌ Continuous polling for updates (causes jank + battery drain)

---

## Sources & Validation

Research synthesized from:

**CT Aesthetics:**
- [Hyperliquid: The frontend wars](https://blockworks.co/news/hyperliquid-the-frontend-wars)
- [Axiom Pro Review 2026](https://dexrank.com/reviews/axiom-pro)
- [Crypto Twitter AI Slop Discussion](https://coingradient.com/2025/10/16/crypto-twitter-turns-scrutiny-on-ai-slop-engagement-farming-for-rewards/)

**Fantasy Sports Retention:**
- [Streaks & Gamification](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps)
- [Real-Time Scoring Impact](https://www.sportsfirst.net/post/live-fantasy-scoring-using-sleeper-api-real-time-architecture-explained)
- [DraftKings Draft UX](https://medium.com/@paytonlhouden/draft-kings-of-ux-3f2346c013d8)

**SaaS Dark Theme:**
- [Dark Mode Design 2026](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/)
- [SaaS Dashboard Trends](https://www.devian.in/blogs/saas-dashboard-design-trends)
- [Building User Trust](https://www.smashingmagazine.com/2021/02/building-user-trust-in-ux-design/)

---

## Next Steps for Implementation Team

1. **Read full research:** `docs/UX_RESEARCH_COMPETITIVE_AUDIT_2026.md` (reference during implementation)
2. **Daily reference:** `docs/UX_QUICK_REFERENCE_BATTLE_GUIDE.md` (print this, use every day)
3. **Execute Phase 1:** Design audit (color, type scale, empty states)
4. **Follow roadmap:** 3-phase implementation (audit → animation → copy)
5. **Track metrics:** Use the 7 metrics above post-launch

---

## The Bottom Line

Foresight doesn't need to be perfect. It needs to be **authentic, competent, and respectful to users' time.**

CT power users will respect a product that:
- Shows real data, not hype
- Updates smoothly, predictably, visibly
- Gets out of the way and lets them compete
- Doesn't manufacture engagement

Fantasy players will come back daily if:
- They can see how their team is performing in real time
- Streaks reward consistency (not artificial daily logins)
- There's a tier they can dominate (not just one leaderboard)
- Notifications matter (not spam)

Judges will see a shipping product if:
- Every page is polished (no rough edges, no placeholder states)
- Design feels premium (CT-native, not generic)
- Mechanics are transparent (users understand how scoring works)
- Performance is smooth (no jank, animations are crisp)

This research validates all three. We're ready to execute.

---

**Research completed:** February 27, 2026, 21:15 UTC
**For:** Foresight implementation team + leadership
**Status:** Approved for implementation phase
