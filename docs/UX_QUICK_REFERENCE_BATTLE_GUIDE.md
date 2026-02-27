# Foresight: UX Quick Reference — Battle Guide (Feb 27, 2026)

> **Print this. Read it every day. Ask questions when you violate it.**

---

## What Makes Products Feel "Right" to CT Users (In 3 Minutes)

### The Vibe
- **Hyperliquid**: Professional, restrained, monospace everything. Feels like a tool, not a toy.
- **Orca**: Clean and clear. One thing done perfectly. Uncluttered.
- **Photon**: Mobile-first energy. No pretense. Fast.

### The Aesthetic
- **Colors:** Gold + cyan ONLY. Nothing else. No purple (reads as "AI slop")
- **Animations:** 150-200ms micro-flashes on data updates. Not continuous. Not showy.
- **Dark theme:** Off-black (#0A0A0F) + off-white (#FAFAFA). Not pure extremes.
- **Data:** Monospace font (JetBrains Mono) ONLY for: scores, ranks, amounts, addresses
- **Typography:** 6-8 sizes. Lock them. No improvising.

### What Kills Credibility (Don't Do These)
- ❌ Gradient backgrounds on cards (move gradients inside small icons only)
- ❌ Decorative colors (if color doesn't mean something, use gray)
- ❌ "You're awesome!" fake hype messages
- ❌ Artificial urgency (countdown timers, limited-time everything)
- ❌ Purple ANYWHERE (in crypto, purple = "AI slop" in users' minds)
- ❌ Obvious engagement farming (log in daily for no reason, phantom streaks)
- ❌ Body text in monospace (confuses data hierarchy)

---

## Type Scale Locked (Copy This)

| Purpose | Size | Weight | Color | Example |
|---------|------|--------|-------|---------|
| Page Title | 48px | 700 Bold | `text-white` | "Leaderboard" |
| Section Header | 24px | 600 Semi | `text-white` | "Top 10 Teams" |
| Card Title | 18px | 600 Semi | `text-white` | Team name, username |
| Body / Label | 14px | 400 Regular | `text-gray-300` | Descriptions, helpers |
| Small / Caption | 12px | 400 Regular | `text-gray-500` | Timestamps, status |
| **Monospace Data** | **14-16px** | **500-600** | **`text-white`** | **Scores, ranks, $amounts** |

**Rule:** Never use arbitrary sizes. Use only these 6.

---

## Color Semantics (Locked)

| Color | Meaning | Use For | Tailwind |
|-------|---------|---------|----------|
| Gold | Primary / #1 / Win | Primary CTAs, rank #1, achievements | `gold-500` (#F59E0B) |
| Cyan | Secondary / #2 / On-chain | Rank #2, Tapestry indicators, secondary links | `cyan-400` (#22D3EE) |
| Emerald | Success / #3 / Free | Rank #3, free contests, positive outcomes | `emerald-500` (#10B981) |
| Rose | Danger | Destructive actions (unfollow, delete) — hover only | `rose-500` (#F43F5E) |
| Gray | Neutral / Inactive | Borders, disabled states, secondary text, ghost buttons | `gray-*` family |

**Rule:** If you use a color, you must be able to explain what it MEANS. If you can't, it's decorative — remove it.

---

## Leaderboard: The Reference Template

### Row Structure (Mobile-First)
```
[Rank Badge] [Avatar] [Username]
[Score Score Score] ← monospace, hero-size text
[Tier Badge] [Follow Button]
```

### Styling Rules
- Rank badge: colored (gold for 1st, cyan for 2nd, emerald for 3rd, gray for rest)
- Score: `text-2xl font-black text-white font-mono` ← THE HERO
- Username: `font-semibold text-white`
- Follow button: borderless gray text by default (`text-gray-500`), reveal border + background on hover only
- Update animation: 150-200ms gold glow when score changes
- Timestamp: "Updated 30s ago" — update every 5 seconds

### Common Mistake
```
❌ Bad:     [Gold border] [Rank] [Score] [Cyan follow button]
✅ Good:    [Gray border] [Rank] [Score] [Gray follow button, cyan on hover]
```

---

## Animation Rules (Never Violate)

### Timing
- Micro-interactions: 150-200ms
- Transitions: 200-300ms
- Never more than 300ms for any standard interaction

### What to Animate
- ✅ Opacity (fade in/out, reveal)
- ✅ Border color (hover states)
- ✅ Text color (hover states)
- ✅ Background color (soft transitions)

### What NOT to Animate
- ❌ Layout (unless intentional and rare)
- ❌ Size/scale (unless very deliberate, like expanding a section)
- ❌ Position (except smooth scrolling)
- ❌ Continuous loops (makes users anxious)

### Score Update Animation (Implement This)
```javascript
@keyframes scoreFlash {
  0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  100% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
}

.score-updated {
  animation: scoreFlash 150ms ease-out;
}
```

When a score changes, apply `.score-updated` class for 150ms, then remove.

---

## Empty States Template

Every page needs an empty state designed. Use this formula:

```
[Optional small illustration — NOT animated, NOT gradient]
Heading: "No contests running yet"
Description: "Contests start every Monday at 12:00 UTC"
[Gold CTA Button] "Create one now" or "Browse upcoming"
```

### Copy Style
- Conversational (not robotic)
- Action-oriented (tell them what to do next)
- Clear reason (why is it empty?)

### Apply to All 6 Pages
- Home: "No contests running yet"
- Draft: "No teams drafted yet"
- Leaderboard: "No users followed yet"
- Intel: "No results match your search"
- Feed: "No activity from people you follow"
- Profile: "No achievements yet" or "No teams drafted"

---

## Real-Time Data Indicators (Copy This)

When showing live data that updates frequently:

1. **Timestamp:** `"Updated 3s ago"` — update this every 1 second
2. **Visual heartbeat:** 100ms pulse/glow on data that just changed
3. **Optional:** Small gold dot next to "LIVE" if updated in last 5 seconds

### Example in Leaderboard
```
[Rank] [Avatar] [Username] [Score with gold glow] [Updated 2s ago]
```

The glow fades in 150-200ms, making score updates visible without jarring.

---

## Mobile-First Checklist (Before You Ship)

- [ ] Works at 375px width (iPhone SE size)
- [ ] All tappable elements are 44px+ tall (buttons, links, rows)
- [ ] No hover-only states (everything works with tap)
- [ ] Bottom nav has 4 items max (sacred on mobile)
- [ ] Forms use appropriate `inputmode` / `type` (tel, email, number)
- [ ] Tested on actual phone, not just browser dev tools
- [ ] Share flows use Web Share API (not clipboard copy)
- [ ] Animations don't cause jank (60fps minimum)

**If it feels awkward on a phone, redesign it.**

---

## Copy Audit Checklist

When writing UI text, ensure:

- [ ] No jargon ("engagement vectors" → "points from likes and retweets")
- [ ] No AI-generated-sounding copy ("maximize your synergies" → "earn more points")
- [ ] No fake urgency ("limited time" timers that reset)
- [ ] No phantom notifications ("you earned a badge!" for doing nothing)
- [ ] Action-oriented ("Draft a team" not "Team formation interface")
- [ ] Plain language ("Your score increased by 12 points" not "Points accrued from engagement vectors")

**Golden rule:** If you wouldn't say it in a text to a friend, don't write it in the UI.

---

## Notification Strategy (Lock This)

**SEND these:**
- Contest result (when 72-hour contest ends, score is final)
- Major rank shift (if they move ±10 positions in leaderboard)
- Streak milestone (if they unlock a new reward level)
- New social action (if someone follows them)

**DON'T SEND these:**
- Every follow, like, or comment
- Daily login reminders
- Generic "check out new features" spam
- More than 3 per week (or they disable notifications)

**Timing:**
- Send at user's typical engagement hour (learn from analytics)
- Respect quiet hours (no push 10pm-7am)
- Let users customize frequency (instant vs. daily digest)

---

## Common Mistakes & Fixes

| Mistake | Why It's Wrong | Fix |
|---------|---------------|-----|
| Gold border on follow button | Color noise on repeating element | Ghost gray button, border on hover only |
| Gradient background on card | Fights with content for attention | Flat `bg-gray-900` |
| 4+ colors in design | Looks amateur | Lock gold + cyan only |
| Score in body font | Metrics are buried | Use monospace, big, bold |
| Confetti on achievement | Feels like AI slop | Just a subtle pulse or badge highlight |
| "You're awesome!" message | Fake hype kills trust | Just state the fact ("Rank: #1") |
| Continuous polling for updates | Jank + battery drain | Batch server-side, push every 30s |
| No timestamps on live data | Users can't tell if data is fresh | Show "Updated 2s ago" |
| Circular loading spinners | Looks generic | Just fade in new data (simpler) |
| 12+ type sizes in codebase | Looks chaotic | Lock to 6-8 sizes |

---

## Streak Design (If You Implement)

**Real Streaks (Do This):**
- Streak = consistent top 100 performance (not just logging in)
- Show at milestones: 7 days, 30 days, 90 days
- Unlock real rewards: fee discounts, free entries, exclusive badge
- Display on leaderboard: "12-week streak" badge next to name

**Fake Streaks (Don't Do This):**
- "Log in every day" with no connection to game
- Streak resets if you miss one day (creates anxiety)
- No real reward (just a number that goes up)

**Psychological Hook:**
- "You're 2 contests away from your 4-week streak" (loss aversion)
- NOT "Complete 2 more contests to earn a badge" (weak motivation)

---

## Before Shipping Any Feature

Run this checklist:

1. **Color:** Is this color semantic or decorative? (If decorative → remove or use gray)
2. **Type:** Does this use one of the 6 locked sizes? (No arbitrary sizes)
3. **Animation:** Is this 150-300ms? (Anything longer feels slow)
4. **Mobile:** Does it work at 375px? (Test on actual phone)
5. **Authenticity:** Is this authentic or "trying too hard"? (Ask: would Orca do this?)
6. **Empty state:** Is there an empty state designed for this view?
7. **Notification:** Does this need a notification? (Only send 3/week max)
8. **Copy:** Is this plain language? (No jargon, no fake hype)
9. **Contrast:** Is this readable in dark mode? (Verify with actual eyes)
10. **Performance:** Does this animate smoothly at 60fps? (Test on mid-range Android)

**If you can't answer "yes" to all 10, ship it anyway but plan to fix it.**

---

## Competitive Benchmarks (For Reference)

When in doubt about a decision, ask: "What would X do?"

- **Hyperliquid:** Professional, restrained, monospace data, fast
- **Orca:** Clean, one thing done right, uncluttered
- **Photon:** Mobile-first, no pretense, speed is the brand
- **DraftKings/Sleeper:** Visual team builder is the hero, clear budget constraints
- **Linear:** Typography discipline, information hierarchy, dark theme perfection
- **Vercel:** Whitespace is a feature, off-black + off-white, confidence in simplicity

If your design doesn't fit the pattern of at least one of these, rethink it.

---

**Last updated:** February 27, 2026
**Status:** Print this. Reference daily. Break it intentionally, never by accident.
