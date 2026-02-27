# Trading Apps Design Patterns: Quick Reference
## For Implementation (TL;DR)

---

## 10 Key Patterns: Copy These Now

### 1. Monospace Data Only
```jsx
// ✅ Scores, ranks, amounts
<span className="font-mono text-sm font-medium">+240 pts</span>

// ❌ Don't use mono for body text
<p className="font-mono">Hello user!</p>
```
**Where:** Leaderboard scores, rank numbers, point values
**Font:** JetBrains Mono or equivalent
**Weight:** Medium (500) or Semibold (600), never Light

---

### 2. Glow Over Shadow
```css
/* ✅ Use glows (especially for achievements) */
box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);

/* ❌ Regular shadow doesn't work in dark theme */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
```
**When to use:** Achievements, S-tier badges, live indicators
**Colors:** gold glow `rgba(245, 158, 11, 0.2)`, cyan glow `rgba(6, 182, 212, 0.2)`
**Already in codebase:** `--shadow-gold`, `--shadow-cyan` in DESIGN_TOKENS.md

---

### 3. Real-Time Flash Animation (150-200ms)
```css
@keyframes scoreFlash {
  0% { background-color: rgba(245, 158, 11, 0.2); }
  100% { background-color: transparent; }
}

.score-updated {
  animation: scoreFlash 200ms ease-out forwards;
}
```
**When:** Leaderboard score updates, live scoring
**Duration:** 150-200ms (not 300ms)
**Color:** Use semantic (gold for increase, rose for decrease)

---

### 4. Button Hover: Reveal, Don't Repaint
```jsx
// ✅ Subtle reveal (appear on hover)
<button className="text-gray-500 border-transparent hover:border-gray-700 hover:bg-gray-800 hover:text-gray-300">
  Follow
</button>

// ❌ Jarring color change
<button className="text-gray-500 hover:bg-cyan-500">
  Follow
</button>
```
**Pattern:** `border-transparent` + `hover:border-gray-700` (border *appears* on hover)

---

### 5. Repeated Actions Whisper
| Component | Default | Hover |
|---|---|---|
| Follow button | `text-gray-500 border-transparent` | `border-gray-700 bg-gray-800 text-gray-300` |
| Like button | Gray heart icon | Gold heart icon |
| View profile | `text-gray-400` | `text-gray-200` |

**Every row shouldn't have colored buttons.** Let them appear on hover.

---

### 6. Text Hierarchy in One Row
```
Rank: HUGE + COLORED (primary metric)
Name: Bold, white (secondary metric)
Score: Monospace, medium, white (tertiary metric)
Action: Ghost text, gray (hidden until hover)
```

**Example leaderboard row:**
```
[#1] Avatar @user 2,480 pts [Follow]
```
- #1 is gold, 24px, mono, bold
- Avatar is 40px
- Name is white, 16px, semibold
- 2,480 is white, 16px, mono, medium
- Follow is gray-500 text, appears on hover

---

### 7. Border-Radius Scale
```
Buttons: 6px (rounded-sm to rounded-md)
Cards: 8px (rounded-md)
Modals: 12px (rounded-lg)
Avatars: 9999px (rounded-full)
```
**Rationale:** Slightly rounded feels friendly, not harsh like 3px terminals

---

### 8. Color Semantics (Strict)
| Color | Meaning | Use For |
|---|---|---|
| Gold #F59E0B | Primary / Win | CTAs, rank #1, achievements |
| Cyan #06B6D4 | Secondary / Links | Follow buttons, secondary CTAs |
| Emerald #10B981 | Success / Free | Free contests, positive outcomes |
| Rose #F43F5E | Danger | Destructive actions (hover-only) |
| Gray-400 | Muted | Labels, secondary text |

**If you can't explain why something is colored, use gray.**

---

### 9. Type Scale (Simplified)
```
Hero:      48px + 600wt    (page titles only)
Display:   32px + 600wt    (card titles)
Body-lg:   18px + 400wt    (lead text)
Body:      16px + 400wt    (default)
Body-sm:   14px + 400wt    (secondary text)
Caption:   12px + 400wt    (hints, metadata)
```
**Rule:** Use 6 sizes. Not 12. It creates chaos.

---

### 10. Data Density: One Row = Complete Unit
```
✅ All important info fits on one row at 375px (mobile)
✅ No horizontal scroll needed
✅ No "expand to see more" needed

❌ Data hidden in tabs
❌ Requires swiping left/right
❌ Multiple screens to see one user
```

---

## Color Palette Quick Copy

### Primary (Gold)
```
gold-500:  #F59E0B  ← Use this for CTAs
gold-400:  #FBBF24  ← Use this for hover/lighter
gold-600:  #D97706  ← Use this for dark/pressed
```

### Secondary (Cyan)
```
cyan-500:  #06B6D4  ← Use this for secondary actions
cyan-400:  #22D3EE  ← Use this for lighter variant
cyan-600:  #0891B2  ← Use this for darker variant
```

### Success (Emerald)
```
emerald-500: #10B981  ← Use for positive outcomes
emerald-400: #34D399  ← Lighter variant
```

### Neutral (Gray)
```
gray-950: #09090B   ← Base background
gray-900: #18181B   ← Surface
gray-800: #27272A   ← Cards
gray-700: #3F3F46   ← Borders
gray-600: #52525B   ← Hover borders
gray-400: #A1A1AA   ← Muted text
gray-300: #D4D4D8   ← Light text
```

### Danger (Rose)
```
rose-500: #F43F5E   ← Destructive action
rose-400: #FB7185   ← Lighter variant
```

---

## Spacing Quick Reference
```
2px:  1     (tiny gaps)
4px:  2     (icon + label)
8px:  3     (related elements)
12px: 4     (section padding)
16px: 5     (standard padding)
20px: 6     (spacing between sections)
24px: 7     (between major sections)
```

**Example card:**
```
[  p-4 (16px padding)
[  avatar + p-2 (8px gap)
[  name
[  py-2 (8px top/bottom) score
[  pt-3 (12px top) action button
]
```

---

## Common Patterns

### Button Primary
```jsx
<button className="bg-gold-500 text-gray-950 px-4 py-2 rounded-md font-semibold hover:bg-gold-600 transition-colors">
  Join Contest
</button>
```

### Button Secondary
```jsx
<button className="border border-gray-700 text-gray-300 px-4 py-2 rounded-md hover:border-gray-600 hover:bg-gray-800">
  View Details
</button>
```

### Button Ghost (on repeated rows)
```jsx
<button className="text-gray-500 border-transparent hover:border-gray-700 hover:bg-gray-800 hover:text-gray-300 px-3 py-1">
  Follow
</button>
```

### Card Default
```jsx
<div className="bg-gray-800 border border-gray-700 rounded-md p-4">
  Content
</div>
```

### Card Highlighted
```jsx
<div className="bg-gray-800 border border-gold-500/30 rounded-md p-4 shadow-gold">
  Important content
</div>
```

---

## Real-Time Updates Code

### Add Animation to Tailwind
```css
/* In frontend/src/index.css */
@keyframes scoreFlash {
  0% {
    background-color: rgba(245, 158, 11, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

.animate-score-flash {
  animation: scoreFlash 200ms ease-out forwards;
}
```

### Use in Component
```jsx
const [flashRow, setFlashRow] = useState(null);

useEffect(() => {
  // When score updates:
  setFlashRow(userId);
  setTimeout(() => setFlashRow(null), 200);
}, [score]);

return (
  <tr className={flashRow === userId ? 'animate-score-flash' : ''}>
    {/* row content */}
  </tr>
);
```

---

## Mobile-First Checklist

- [ ] Test at 375px width (iPhone SE size)
- [ ] All buttons are 44px minimum height
- [ ] No hover-only states (use tap)
- [ ] Cards stack vertically on mobile
- [ ] No horizontal scroll on leaderboard
- [ ] Touch targets are 12px apart (no cramming)
- [ ] Text is 14px minimum (no squinting)

---

## Audit Checklist

Before marking UI work done:

- [ ] All numbers are monospace
- [ ] Button hovers work on mobile (no tap-to-see-border)
- [ ] Real-time updates flash (150-200ms)
- [ ] Achievements have gold glow
- [ ] No more than 1 gold CTA per page
- [ ] Type scale uses 6 sizes max
- [ ] Repeated actions (follow, like) are ghost-styled
- [ ] Destructive actions only appear on hover
- [ ] All text meets WCAG AA contrast (4.5:1)
- [ ] Glow effects use `--shadow-gold` or `--shadow-cyan`

---

## Debugging

**Animation feels sluggish?** → Check duration (should be 150-300ms max)
**Hover states broken on mobile?** → Check for `:hover` only (add `:active` for touch)
**Colors look wrong?** → Use hex values, not Tailwind shade names (verify in DESIGN_TOKENS.md)
**Text seems hard to read?** → Increase font-weight (use medium/semibold for data)
**Cards feel flat?** → Add `shadow-gold` for important cards, not `shadow-md`

---

## Quick Links

- **Design Tokens:** `/docs/design/DESIGN_TOKENS.md`
- **Design Principles:** `/docs/design/DESIGN_PRINCIPLES.md`
- **Full Research:** `/docs/design/research/TRADING_APPS.md` (this document's parent)
- **Tailwind Config:** `/frontend/tailwind.config.js`
- **CSS:** `/frontend/src/index.css`

---

**Updated:** February 27, 2026
**Reference:** Based on analysis of Hyperliquid, Axiom, Photon, Birdeye, DexScreener
