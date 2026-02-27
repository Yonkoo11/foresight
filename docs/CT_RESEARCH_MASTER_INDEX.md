# CT Research Master Index

> **For:** Team, judges, investors
> **Purpose:** One-stop shop for understanding CT culture and how Foresight resonates
> **Date:** February 27, 2026

---

## Quick Navigation

**New? Start here:**
1. Read this page (5 min)
2. Read `/docs/design/CT_CULTURE_QUICK_REFERENCE.md` (5 min)
3. Read `/docs/CT_INFLUENCE_CULTURAL_ANALYSIS.md` (10 min)
4. Read `/docs/design/CT_CULTURE.md` for details (30 min)

**Implementing a feature?**
1. Read `/docs/design/CT_CULTURE_QUICK_REFERENCE.md` (5 min)
2. Use `/docs/design/CT_CULTURE_IMPLEMENTATION_AUDIT.md` (10 min per page)

**Explaining Foresight to investors/judges?**
1. Read `CT_INFLUENCE_QUICK_REFERENCE.md` (5 min) — How our scoring works
2. Read `/docs/design/CT_CULTURE.md` Section "What Makes Foresight Shareworthy" (5 min)

---

## The 3 Pillars of CT Culture (And Why Foresight Wins)

### Pillar 1: Transparency
**What CT Values:** Users want to see the formula, not the spin. If you hide the math, you're lying.

**How Foresight Does It:**
- Scoring formula is visible: Activity + Engagement + Growth + Viral
- Each component is explainable
- Data sources documented (Twitter API, follower counts, etc.)
- Timestamps show freshness

**Result:** CT users trust Foresight because they can verify fairness

### Pillar 2: Skill Over Luck
**What CT Values:** Outcomes should be deterministic and based on merit, not randomness. CT respects games where the best player wins.

**How Foresight Does It:**
- Scoring is 100% data-driven (no luck)
- Captain bonus is strategic (1.5x multiplier, not random)
- Tiers are earned by data (followers + engagement rate)
- Winners can explain their strategy ("I picked rising stars")

**Result:** CT users engage seriously because outcomes reflect skill

### Pillar 3: Respect
**What CT Values:** Don't patronize. Assume intelligence. Don't try to be cool. Be honest.

**How Foresight Does It:**
- Copy is direct ("Draft" not "Activate your influence potential")
- No emojis in UI (professional, not try-hard)
- No confetti on every action (respects user)
- Language is native ("alpha," "callout," "degen") not corporate ("leverage," "ecosystem")

**Result:** CT users feel respected and evangelize organically

---

## The 10 Design Principles (Memorize These)

| # | Principle | Why It Matters | Foresight Example |
|---|-----------|----------------|-------------------|
| 1 | Density over whitespace | CT users are info omnivores | Leaderboard shows 10+ rows without scrolling |
| 2 | Dark theme is identity | Command center aesthetic is CT identity | Black background (#0A0A0F), gold accents |
| 3 | Language matters | CT has vocabulary; using wrong words = outsider | Use "influence," "callout," "alpha" not "leverage" |
| 4 | Monospace for numbers | Signals "real data, not approximations" | All scores in `font-mono` (JetBrains Mono) |
| 5 | Status signaling via badges | CT is hierarchical and competitive | S/A/B/C tier badges with color (gold/cyan/emerald) |
| 6 | Real-time updates expected | CT checks app every 30-60 seconds | Leaderboard updates via 30-60s polling |
| 7 | Gamification respects intelligence | CT hates patronizing mechanics | Captain bonus is strategic, not luck-based |
| 8 | Information architecture assumes high literacy | CT reads whitepapers and analyzes on-chain data | Scoring formula visible, no oversimplification |
| 9 | Mobile first, not mobile only | Majority are mobile, many use desktop | Bottom nav on mobile, 2-column desktop view |
| 10 | Transparency over perfection | CT has been rug-pulled; transparency wins trust | Data freshness shown, disclaimers clear |

---

## The 10 Anti-Patterns (Never Do These)

| # | Anti-Pattern | Why It Fails | How to Fix |
|---|---|---|---|
| 1 | Pastels, bright colors | "This looks like a product for my mom" | Use dark + gold + cyan only |
| 2 | Lots of whitespace | "Why am I swiping 5 pages for one number?" | Show 10+ rows, compact layout |
| 3 | Try-hard coolness | "This company is trying way too hard" | Be professional, let features speak |
| 4 | Hidden complex data | "I don't trust what I can't see" | Show formulas, transparent calculations |
| 5 | Gradient cards | "Looks like a .io game, not serious software" | Use flat colors, remove gradients |
| 6 | Friction before value | "Show me something before I sign up" | Show leaderboard data pre-signup |
| 7 | Notification spam | "This app won't shut up" | Only notify on real milestones |
| 8 | Inconsistent navigation | "Where am I? How do I get back?" | 4 items max bottom nav, consistent everywhere |
| 9 | Purple/violet colors | "This looks AI-generated" | Never use purple (AI slop vibes) |
| 10 | Patronizing gamification | "Treat me like an adult" | Remove confetti, "Great job!" messages |

---

## The Cultural Analysis Files (Full Reference)

### 1. **CT_INFLUENCE_CULTURAL_ANALYSIS.md** (38KB, 850+ lines)
**What:** Deep dive into what "influence" means in CT, how it's measured, what's respected

**Key Sections:**
- What makes someone influential (4 pillars: accuracy, alpha, skin in game, community)
- 5 influencer archetypes (Analyst, Rising Star, Specialist, Trader, Narrative Driver)
- What scoring signals CT respects (engagement rate > follower count)
- Gaming attempt detection (how people try to cheat the system)
- Foresight's scoring assessment: **8/10 Very Respectful**

**For Judges:** "Foresight's scoring system respects CT culture more than any existing product"
**For Team:** "Know why each scoring component matters to CT users"

---

### 2. **CT_INFLUENCE_QUICK_REFERENCE.md** (10KB)
**What:** TL;DR of scoring system + how to talk to CT power users

**Covers:**
- Quick scoring breakdown
- Why each component matters
- How to explain scoring to CT users
- Red flags that would trigger skepticism

**For:** Quick reference during demos, copy writing, Q&A

---

### 3. **CT_CULTURE.md** (15KB, 600+ lines)
**What:** Comprehensive design guide for making Foresight feel native to CT

**Key Sections:**
- 10 design principles that make products feel CT-native
- 10 design anti-patterns that make users bounce
- Authenticity checklist (30 items)
- What makes influencers worth drafting
- Why people share about Foresight
- Competitive analysis (Hyperliquid, Phantom, DraftKings)
- How to talk about Foresight to different audiences

**For:** Design/product decisions, marketing copy, competitive positioning

---

### 4. **CT_CULTURE_QUICK_REFERENCE.md** (8KB)
**What:** 5-minute cheat sheet version of CT_CULTURE.md

**Covers:**
- The 3-second test
- Color palette (no exceptions)
- Language rules
- Numbers must be monospace
- The 10 anti-patterns
- 30-second authenticity checklist
- Decision tree ("Is this OK to ship?")

**For:** Quick review, code review comments, design decisions, "Is this CT?"

---

### 5. **CT_CULTURE_IMPLEMENTATION_AUDIT.md** (20KB)
**What:** Page-by-page QA checklist for every feature

**Covers:**
- Universal checks (every page)
  - Colors & theming
  - Typography
  - Copy & language
  - Information density
  - Gamification
  - Mobile first
  - Real-time & updates
  - Navigation
  - Transparency
- Page-specific audits (Home, Draft, Leaderboard, Contest Detail, Profile, Intel/Feed)
- Design system audit (buttons, cards, badges, inputs)
- Accessibility audit
- Performance audit
- Sign-off checklist

**For:** QA before shipping, design review, ensuring consistency

---

## How These Docs Relate

```
CT_INFLUENCE_CULTURAL_ANALYSIS.md
├─ Explains: What influence means, scoring, 5 archetypes
├─ For: Understanding the game mechanics
└─ Verdict: Foresight's scoring is 8/10 respectful

CT_CULTURE.md
├─ Explains: How to design for CT, what makes products feel native
├─ For: Design, product, copy decisions
├─ Includes: 10 principles, 10 anti-patterns, competitive analysis
└─ Synthesizes: All CT cultural research into design law

CT_CULTURE_QUICK_REFERENCE.md
├─ Explains: Same as above, but in 5 minutes
├─ For: Quick decisions, code review, daily reference
└─ Use when: You need to decide "Is this CT?" fast

CT_CULTURE_IMPLEMENTATION_AUDIT.md
├─ Explains: How to verify every page is CT-native
├─ For: QA, design review, sign-off
└─ Use: Before merging any PR with UI changes
```

---

## The Authenticity Score for Foresight

### Overall: **8.5/10 (Very CT-Native)**

**Scoring Breakdown:**

| Component | Score | Notes |
|-----------|-------|-------|
| Transparency | 9/10 | Formula is visible, data sources documented |
| Skill-based | 9/10 | No luck, deterministic outcomes, strategic bonuses |
| Respect | 8/10 | Copy is native, no patronizing, treats users as intelligent |
| Design Aesthetic | 8/10 | Dark + gold + cyan, dense layout, monospace numbers |
| Language | 8/10 | Mostly native, could be more concise in some areas |
| Gamification | 9/10 | Captain bonus is strategic, no confetti on routine actions |
| Real-time | 8/10 | Updates are frequent, but could show freshness more explicitly |
| Mobile First | 8/10 | Bottom nav works, could show more desktop enhancements |

**What Gets Us to 9/10 (Next Steps):**
1. Ensure all pages have explicit "Last Updated" timestamps
2. Make tier criteria visible on influencer cards
3. Add in-app scoring explanation (tooltip on every metric)
4. Maximize desktop view (show more leaderboard rows)
5. Enhance share mechanics (make viral hooks obvious)

---

## Key Insights (Distilled)

### Why Foresight Will Win With CT

1. **Meritocratic** — Best analytics wins, not who spends most
2. **Transparent** — You can verify fairness
3. **Anti-Gaming** — Hard to fake engagement/followers/growth
4. **Skill-Based** — Outcomes reflect strategy, not luck
5. **Respectful** — No patronizing, no corporate jargon
6. **Data-Driven** — Scoring can be explained and debugged
7. **Native Language** — Uses CT vocabulary ("alpha," "callout," "degen")
8. **Real-Time** — Scores update as engagement happens
9. **Authentic** — Not trying to be cool, just being honest
10. **Shareable** — Creates viral hooks (vindication, upset, discovery)

### Why Foresight Could Fail With CT

1. ❌ If scoring becomes a black box (lose trust)
2. ❌ If copy becomes corporate ("activate your potential")
3. ❌ If design gets flashy (pastels, gradients, confetti)
4. ❌ If leaderboard updates become infrequent (feel slow)
5. ❌ If patronizing mechanics appear ("Great job!")
6. ❌ If high-variance outcomes feel like luck (lose respect)
7. ❌ If try-hard humor appears (cringe)
8. ❌ If data freshness isn't transparent (lose trust)
9. ❌ If design assumes low intelligence (insult)
10. ❌ If sharing is difficult (lose viral potential)

---

## The Demo Narrative (For Judges)

**Hook:** "Foresight is fantasy sports for Crypto Twitter, but unlike DraftKings, the scoring respects how CT actually measures influence."

**Proof Points:**
1. **Transparent scoring** — Show formula: Activity (0-35) + Engagement (0-60) + Growth (0-40) + Viral (0-25)
2. **Data-driven tiers** — S-Tier isn't arbitrary; it's >50K followers + >10% engagement rate
3. **No luck, all skill** — Captain bonus is strategic (1.5x), not random
4. **Native design** — Dark theme, gold accents, monospace numbers, dense layout
5. **Real-time** — Leaderboard updates every 30-60 seconds as tweets happen
6. **Viral-worthy** — "I drafted @analyst when they had 2K followers" stories

**Why CT Users Share:**
- Vindication moments ("I was right about this influencer")
- Upset victories ("Beat the mega-followings with unknowns")
- Discovery ("Found a hidden gem with Foresight")
- Meta commentary ("The Foresight meta shows builders > VC fundeds")

**Why This Wins:**
- Meritocratic (respects CT values)
- Transparent (no hidden algorithms)
- Respectful (doesn't patronize)
- Skill-based (rewards good judgment)
- Shareable (creates organic growth)

---

## Using This Research

### For Design Decisions
1. Read `CT_CULTURE_QUICK_REFERENCE.md` (5 min)
2. Ask: "Does this pass the authenticity checklist?"
3. If unsure, use `/docs/design/CT_CULTURE_IMPLEMENTATION_AUDIT.md`

### For Copy & Messaging
1. Read language section of `CT_CULTURE_QUICK_REFERENCE.md`
2. Strip corporate language
3. Use native words (influence, alpha, callout, degen)
4. Keep CTAs to 1-3 words

### For Feature Implementation
1. Check `CT_CULTURE_IMPLEMENTATION_AUDIT.md` for page type
2. Verify: colors, fonts, copy, density, mobile, real-time
3. Get design review
4. Merge only when audit passes

### For Demos & Pitches
1. Use narrative from "The Demo Narrative" above
2. Show transparent scoring
3. Highlight native design (dark + gold)
4. Show real-time updates
5. Tell share stories (vindication, upset, discovery)

### For Investor/Judge Questions
1. "Why should CT users care?" → Meritocratic, transparent, skill-based
2. "What makes this different from DraftKings?" → Respects CT culture, not patronizing, transparent
3. "How will this go viral?" → Vindication/upset stories, discovery mechanics, shareworthy moments
4. "Is the scoring fair?" → Show formula, explain each component, demonstrate transparency

---

## Checklist: Before Shipping Anything

- [ ] Read `CT_CULTURE_QUICK_REFERENCE.md`
- [ ] Ask "Would a CT native use this?"
- [ ] Run `CT_CULTURE_IMPLEMENTATION_AUDIT.md` for your page
- [ ] Verify: Dark background, monospace numbers, dense layout
- [ ] Verify: Native language, no corporate jargon
- [ ] Verify: Transparent data, timestamps shown
- [ ] Verify: Mobile-friendly, touch targets 44px+
- [ ] Verify: Real-time updates, no stale data
- [ ] Get design review (does it pass authenticity test?)
- [ ] SHIP

---

## Final Word

**Foresight wins by respecting CT culture, not by trying to be cool.**

CT users have been rug-pulled, scammed, and misled. Transparency wins. Skill wins. Honesty wins.

Every design decision should ask: "Does this respect the user's intelligence?"

If yes, ship it. If no, redesign.

---

**Last Updated:** February 27, 2026
**Maintained By:** Product, Design, Content teams
**Next Review:** Monthly (after user feedback cycle)

**Key Files to Bookmark:**
- `/docs/design/CT_CULTURE_QUICK_REFERENCE.md` — Use daily
- `/docs/design/CT_CULTURE_IMPLEMENTATION_AUDIT.md` — Use for QA
- `/docs/design/CT_CULTURE.md` — Use for deep dives
- `/docs/CT_INFLUENCE_CULTURAL_ANALYSIS.md` — Use to understand scoring
