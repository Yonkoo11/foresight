# CREATIVE DIRECTOR: QUICK REFERENCE

> Quick answers to the 7 questions. Full brief in `CREATIVE_DIRECTOR_BRIEF.md`

---

## 7 DEFINITIVE ANSWERS

### 1. Visual Metaphor?
**TRADING TERMINAL DASHBOARD** (not sports arena)
- Monospace data, real-time updates, minimal decoration
- Like Hyperliquid, not like DraftKings

### 2. What's Unique Visually?
**FORMATION GRID** (only Foresight has this)
- 5-player visual layout with captain slot (1.5x scale, gold glow)
- Appears on: Draft, team card, profile, contest detail
- Visual signature that differentiates from trading apps

### 3. Color System?
**60-30-10 Rule**
```
60% Dark (backgrounds)        → #09090B, #111111, #1A1A1F
30% Neutral (text/borders)    → #FAFAFA text, #27272A borders
10% Gold only (primary CTA)   → #F59E0B

Accents:
- Gold #F59E0B = #1 / Primary CTA
- Cyan #06B6D4 = #2 / On-chain
- Emerald #10B981 = #3 / Success
- Rose #F43F5E = Error (hover only)
```

**NO neon glow.** Use: subtle gold flash (200ms) + emerald pulse dot.

### 4. Typography?
**3 Fonts, 6 Sizes**
```
Plus Jakarta Sans (bold headers only)
Inter (95% of UI text)
JetBrains Mono (ALL numbers, IDs, addresses)

6 Sizes: Display (32) | H2 (24) | H3 (18) | Body (16) | Body-sm (14) | Caption (12) | Mono (13)
```

**Rule:** Every number = monospace. Period.

### 5. One Design Principle?
**"COLOR IN CONTENT, NOT CHROME"**

- Chrome (borders, backgrounds, buttons) = dark gray only
- Content (badges, icons, scores) = can use color
- One gold CTA per screen section
- Repeated actions = ghost style (no border by default)
- Destructive = hidden until hover

### 6. Remove Immediately?
**Delete these 7 patterns:**
1. Excessive glow effects (remove 80%)
2. Gradient backgrounds on cards (use flat dark)
3. Neon green as primary signal (use emerald)
4. Long rounded buttons (use compact icons)
5. Multiple gold CTAs per screen (one max)
6. Hover-only information (works on mobile too)
7. Confetti/celebration animations (respectful tone)

### 7. Three References?
**1. Hyperliquid** → Data density, monospace, real-time flash (150-200ms)
**2. Linear** → Polish, micro-interactions, component consistency
**3. Axiom** → Speed (100ms animations), terminal aesthetic, monospace everywhere

---

## CRITICAL RULES (Non-Negotiable)

- [ ] **Formation grid is the visual signature** (prominent on draft, visible on team cards)
- [ ] **All numbers = monospace (JetBrains Mono)** (scores, ranks, amounts, IDs, addresses)
- [ ] **One gold CTA per screen section max** (secondary/ghost otherwise)
- [ ] **Dark backgrounds tested on real phone in dark room** (not just #09090B in code)
- [ ] **Animations 200ms or less** (snappy, not smooth)
- [ ] **Mobile first at 375px** (design there, scale up)
- [ ] **No emoji in UI** (Phosphor icons only)
- [ ] **No gradients on cards** (gradients only on small icons/badges)
- [ ] **No hover-only info on mobile** (must tap)
- [ ] **No neon green** (use emerald for success/alive)

---

## COLOR DECISION TREE

```
Is this a button?
├─ Is it the primary action on this screen section?
│  └─ YES → bg-gold-500 text-gray-950
│  └─ NO → Ghost style (bg-transparent border-gray-700 text-gray-400)
│
Is this a badge/tier indicator?
├─ S-Tier? → bg-gold-500/20 text-gold-400
├─ A-Tier? → bg-cyan-500/20 text-cyan-400
├─ B-Tier? → bg-emerald-500/20 text-emerald-400
└─ C-Tier? → bg-gray-500/20 text-gray-400

Is this decorative chrome (border, background, divider)?
└─ Always gray-700 or gray-800 (NEVER bright color)

Is this a number/score/stat?
└─ Font-mono + white text (let monospace be the decoration)
```

---

## ANIMATION DECISION TREE

```
Is this a score update?
└─ scoreFlash (200ms gold background pulse, then fade)

Is this a "live" indicator?
└─ Emerald dot + pulse animation (0.5s), gray "Live" label

Is this a button hover?
└─ Border appears, background subtly shifts (150ms transition-all)

Is this a page transition?
└─ fadeInUp (300ms) for content, backdrop-blur for modals

Is this anything else?
└─ Check if needed. If yes, max 300ms. If doubt, cut it.
```

---

## FORMATION GRID REQUIREMENTS

- [ ] Captain slot is 1.5x scale of regular slots
- [ ] Captain slot has gold glow `shadow-gold`
- [ ] Empty slots are subtle (light gray outline, not prominent)
- [ ] Each slot shows avatar image (no names visible until hover)
- [ ] Tier badges appear inside slot or below (S=gold, A=cyan, B=emerald, C=gray)
- [ ] On hover, position highlights with gold border pulse
- [ ] Responsive: Large on desktop, stacked on mobile <640px
- [ ] Works on: Draft page (large), team card (small), profile (compact), contest detail (locked)

---

## PAGE AUDIT CHECKLIST

Before shipping any page:

**Data & Numbers:**
- [ ] All scores/ranks/amounts are monospace (JetBrains Mono 13px)
- [ ] Monospace numbers align in columns (tabular-nums CSS rule applied)
- [ ] Percentage displays show as "12%" not "0.12"

**Color:**
- [ ] Only one gold CTA visible on screen section
- [ ] No gradients on card backgrounds (use flat dark only)
- [ ] No bright cyan or emerald on chrome (reserved for badges/icons)
- [ ] No purple or violet anywhere
- [ ] No neon green glows (use emerald dot + pulse if needed)

**Typography:**
- [ ] Headers use Plus Jakarta Sans (bold) or Inter (semibold)
- [ ] Body text is 16px Inter or smaller
- [ ] Caption/metadata is 12px max
- [ ] No text smaller than 12px
- [ ] No text larger than 32px for non-display content

**Interactions:**
- [ ] All hover states reveal info, don't repaint
- [ ] Repeated action buttons are ghost-style (no border, appear on hover)
- [ ] Destructive actions (unfollow, delete) only visible on hover
- [ ] All animations are 200ms or less
- [ ] Mobile: no hover-only states (provide alternative for tap)

**Spacing:**
- [ ] Uses 4px-based scale only (4, 8, 12, 16, 20, 24, 32)
- [ ] No arbitrary gaps or paddings
- [ ] Cards have 16px padding (consistent)
- [ ] Leaderboard rows have 12px padding (consistent)

**Mobile (375px):**
- [ ] Content fits without horizontal scroll
- [ ] Touch targets are 44px+ tall
- [ ] Formation grid is stacked, not side-by-side
- [ ] No hover-only information
- [ ] Text is readable (16px+ for body)

**Comparison:**
- [ ] Looks as data-dense as Hyperliquid leaderboard? (Yes/No)
- [ ] Has same polish level as Linear components? (Yes/No)
- [ ] Has same animation snappiness as Axiom? (Yes/No)

---

## PATTERN LIBRARY: COPY-PASTE EXAMPLES

### Score Update Flash
```jsx
const [scoreFlash, setScoreFlash] = useState(false);

useEffect(() => {
  setScoreFlash(true);
  setTimeout(() => setScoreFlash(false), 200);
}, [score]);

return (
  <span className={scoreFlash ? 'animate-scoreFlash' : ''}>
    {score}
  </span>
);
```

### Live Indicator
```jsx
<span className="inline-flex items-center gap-1">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
  <span className="text-gray-400">Live</span>
</span>
```

### Ghost Button (Repeated Actions)
```jsx
<button className="border-transparent text-gray-500 hover:border-gray-600 hover:bg-gray-800 hover:text-gray-400 transition-all duration-150">
  Follow
</button>
```

### Formation Captain Slot
```jsx
<div className="relative w-20 h-20 shadow-gold rounded-lg border-2 border-gold-500/30 bg-gray-800 flex items-center justify-center hover:border-gold-500">
  <img src={captain.image} className="w-full h-full rounded-lg" />
  <span className="absolute -bottom-1 -right-1 bg-gold-500 text-gray-950 text-xs font-bold px-1 py-0.5 rounded">
    1.5x
  </span>
</div>
```

### Monospace Score
```jsx
<span className="font-mono font-bold text-white tabular-nums">
  {score.toLocaleString()}
</span>
```

---

## DEBUGGING CHECKLIST

*If a design doesn't feel right:*

1. **Is there too much color?** → Count colors on screen. Should be ≤3 (gray + 1 accent max)
2. **Is the primary metric the visual hero?** → Look at leaderboard row. Is score the biggest thing? If not, reduce competing elements
3. **Are there multiple gold elements?** → Should only be ONE gold CTA per context. Others = gray
4. **Is animation feeling sluggish?** → Check animation duration. Should be 200ms, not 500ms
5. **Does it look like DraftKings?** → Check for: gradients, emoji, confetti, long buttons, colorful chrome. Delete them
6. **Is monospace inconsistent?** → All numbers should be JetBrains Mono 13px. Check scores, ranks, amounts, IDs
7. **Does it work on mobile?** → Test at 375px. If horizontal scroll needed, redesign it
8. **Is there hover-only info?** → Mobile users can't hover. Make info visible by default or provide tap state

---

## SUCCESS CRITERIA

Ship when:
- ✅ Looks as data-dense as Hyperliquid (numbers scannable in 1 second)
- ✅ Has same polish as Linear (every pixel intentional)
- ✅ Feels as fast as Axiom (animations snappy, no lag)
- ✅ Formation grid is visual signature (prominent and unique)
- ✅ All monospace numbers are consistent (font-mono, tabular-nums)
- ✅ Mobile works at 375px (no horizontal scroll)
- ✅ CT users would use it 8 hours a day without cringing
- ✅ No emoji, no confetti, no gamification (respectful tone)
- ✅ Zero neon green, zero gradients, zero purple

---

**Version:** 1.0
**Last Updated:** February 27, 2026
**Status:** Active guidance for all design work
