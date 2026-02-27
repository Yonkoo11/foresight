# VISUAL AUDIT CHECKLIST

> Use this before code review, before QA, before shipping any feature.
> Print and laminate. Reference during every design decision.

---

## QUICK PASS/FAIL (30-second audit)

- [ ] Formation grid visible (if draft/team card page)?
- [ ] All numbers monospace?
- [ ] Only one gold CTA visible?
- [ ] No gradients on cards?
- [ ] Dark background verified on phone?

**If all 5 pass:** Continue to detailed audit
**If any fail:** Fix before shipping

---

## DETAILED AUDIT (Per-Page Checklist)

### DATA & TYPOGRAPHY

- [ ] All scores are `font-mono` (JetBrains Mono 13px)
- [ ] All ranks are `font-mono` (e.g., #1, #43, #500)
- [ ] All amounts are `font-mono` (e.g., 1,250, $0.50, 12%)
- [ ] All IDs/addresses are `font-mono` (0x7a..., tx123...)
- [ ] All wallet addresses are `font-mono` with `tabular-nums` class
- [ ] Monospace text is left-aligned (not centered)
- [ ] Headers use Inter or Plus Jakarta Sans (not monospace)
- [ ] Body text is 16px or 14px (no smaller than 12px caption)
- [ ] No text larger than 32px (except in rare display contexts)
- [ ] No more than 2 different header sizes on one page (e.g., h2 + h3, not h1 + h2 + h3)

### COLOR SYSTEM

- [ ] Background is `bg-gray-950` (#09090B) or `bg-gray-900/50`
- [ ] Card backgrounds are `bg-gray-800` (never gradient)
- [ ] Card borders are `border-gray-700` (never colored)
- [ ] Only one `bg-gold-500` (primary CTA) visible on screen section
- [ ] All other buttons are ghost-style or secondary style
- [ ] No `bg-cyan-500` on buttons (cyan only on badges/icons)
- [ ] No `bg-emerald-500` on buttons (emerald only for badges/success)
- [ ] No purple or violet anywhere (search for `purple`, `violet`, `indigo` and delete)
- [ ] No neon green glows (search `shadow-glow-neon` and replace with `shadow-gold` or delete)
- [ ] "Live" indicators use emerald dot + gray text (not neon green)
- [ ] Tier badges: S=gold, A=cyan, B=emerald, C=gray (correct color pairing)

### LAYOUT & SPACING

- [ ] Card padding is consistent (16px standard)
- [ ] Leaderboard row height is consistent (48-56px)
- [ ] Formation grid slots are consistent size (64px × 64px or 80px × 80px)
- [ ] All spacing uses 4px-based scale (4, 8, 12, 16, 20, 24, 32)
- [ ] No arbitrary gaps (e.g., gap-5, gap-7, gap-9)
- [ ] Border radius is consistent (8px for cards, 6-8px for buttons, full for avatars)
- [ ] Modal/popover padding is 24px or 32px
- [ ] Section spacing is 24px or 32px (never 20px, never 30px)

### BUTTONS & INTERACTIONS

- [ ] Primary CTA (`btn-primary`) is gold and appears once per context
- [ ] Secondary buttons use `border border-gray-700` (outlined style)
- [ ] Ghost buttons appear only on hover for repeated actions (follow, like, menu)
- [ ] Hover state reveals border/background, doesn't repaint color
- [ ] No button has padding larger than `py-3` (too tall, visual noise)
- [ ] Focus rings use gold (`ring-gold-500`)
- [ ] Disabled buttons have reduced opacity (50%)
- [ ] No button text wraps onto multiple lines

### FORMATION GRID (If Applicable)

- [ ] Captain slot is 1.5x scale with gold glow
- [ ] Captain slot shows "1.5x" badge in corner
- [ ] Regular slots are equal size (not varying widths)
- [ ] Empty slots show subtle outline (not solid background)
- [ ] Avatar images fit inside slots without overflow
- [ ] Tier badge appears inside or below slot
- [ ] On hover, slot gets gold border pulse animation
- [ ] Grid is stacked on mobile <640px (not side-by-side)
- [ ] Formation grid is the visual hero (not hidden or secondary)

### ANIMATIONS

- [ ] Score update flash is 200ms or less (search for `@keyframes scoreFlash`)
- [ ] All transitions are 150ms-300ms (check `transition-` classes)
- [ ] No animation longer than 300ms for micro-interactions
- [ ] No pulsing or looping animations (except live dot pulse)
- [ ] Live dot pulse uses `animate-pulse` at 2s interval
- [ ] Easing is sharp (`ease-out`, not `ease-in-out`)
- [ ] No animation plays on page load (only on user interaction)
- [ ] Modal/page transitions use `fadeInUp` (300ms max)

### MOBILE AUDIT (375px)

- [ ] No horizontal scroll required
- [ ] Text is readable (16px+ for body)
- [ ] Touch targets are 44px+ tall (buttons, links)
- [ ] Formation grid is stacked, not side-by-side
- [ ] Leaderboard row is single column, not multi-column
- [ ] No hover-only states (provide tap/tap-hold alternative)
- [ ] Bottom nav is always sticky (never scrolls off)
- [ ] Modal title and close button are reachable (not at bottom)

### VISUAL COMPARISON

- [ ] Compare leaderboard to Hyperliquid — Is it data-dense? (20+ rows visible without scroll?)
- [ ] Compare components to Linear — Is every element intentional? (no padding inconsistencies?)
- [ ] Compare animations to Axiom — Does it feel snappy? (200ms or less for updates?)

### COPY & TONE

- [ ] No emoji in UI text (Phosphor icons only)
- [ ] No exclamation points (respectful tone)
- [ ] No FOMO copy ("Only 3 spots left!")
- [ ] No celebration language ("You crushed it!" → "You finished Top 8%")
- [ ] All action verbs are clear ("Join", "Draft", "Follow" not "Assemble", "Create squad", "Connect")

### PERFORMANCE

- [ ] All images are optimized (no >500kb images)
- [ ] Monospace font is loaded from system or fast source (not slow Google Fonts)
- [ ] No unused CSS classes
- [ ] No unused animations in keyframes
- [ ] Animations use `will-change` sparingly (only on frequently animated elements)

---

## ANTI-PATTERNS (Delete If Found)

Search for these and delete without hesitation:

| Pattern | Search Term | Action |
|---------|------------|--------|
| Excessive glows | `shadow-glow-neon`, `glow-intense` | Delete 80%. Keep only on primary CTA and captain slot |
| Gradient cards | `bg-gradient-to-br`, `from-` (on cards) | Replace with `bg-gray-800` |
| Neon green | `#10F981`, `neon-500`, `shadow-glow-neon` | Replace with emerald or delete |
| Purple colors | `purple-`, `violet-`, `indigo-` | Delete entirely |
| Long buttons | `py-3 px-6` (on repeated actions) | Replace with icon-only or `px-3 py-1.5` |
| Multiple gold CTAs | 2+ `btn-primary` on same context | Keep only one, change others to secondary/ghost |
| Confetti | `confetti`, `celebrate`, `🎉` | Delete |
| Celebration toasts | Toast message with multiple exclamation points | Rewrite as neutral: "You finished Top 8%" |
| Rounded modals | `rounded-full`, `rounded-3xl` on UI | Keep as `rounded-lg` (12px) max |

---

## DECISION TREE: "Should I Add This?"

```
Do I need to add a new color to this page?
├─ YES → STOP. Audit existing colors first. Are you using all 4 (gray, gold, cyan, emerald)?
│         If using 4+, you're done. If using <4, use existing colors instead.
└─ NO → Continue

Should this element have a border?
├─ YES → Use border-gray-700 (never bright color)
└─ NO → Use flat background instead

Should this element have a gradient background?
├─ YES → STOP. Gradients are never used on cards. Use flat bg-gray-800 instead.
│        Gradients only live inside small icons or badges.
└─ NO → Continue

Should this animation be longer than 200ms?
├─ YES → STOP. Make it 200ms or delete it. Foresight is snappy, not smooth.
└─ NO → Continue

Does this element appear on every row in a list?
├─ YES → Use ghost style (no border, no background by default). Reveal on hover.
└─ NO → Can use solid button style

Is this a destructive action (unfollow, delete)?
├─ YES → Hide by default. Only show on hover with rose/red color.
└─ NO → Can be visible by default

---

## FINAL CHECKS

Before marking PR as "ready for review":

- [ ] Ran visual audit checklist on this page
- [ ] Monospace numbers verified by searching for every instance
- [ ] Color count is ≤3 (gray + 1 accent max)
- [ ] Animation timing verified (200ms or less)
- [ ] Tested on real phone at 375px (no horizontal scroll)
- [ ] Tested on real phone in dark room (colors verified)
- [ ] Compared to Hyperliquid (density check)
- [ ] Compared to Linear (polish check)
- [ ] Compared to Axiom (speed check)
- [ ] Passed mental test: "Would a CT power user use this 8 hours a day?"

---

## COMMON MISTAKES (Learn From These)

### Mistake 1: Using Non-Monospace Numbers
```jsx
// WRONG
<div className="text-white">1,250</div>

// CORRECT
<div className="font-mono font-bold text-white tabular-nums">1,250</div>
```

### Mistake 2: Multiple Gold Buttons on One Screen
```jsx
// WRONG
<button className="btn-primary">Join Contest</button>
<button className="btn-primary">Create Team</button>

// CORRECT
<button className="btn-primary">Join Contest</button>
<button className="btn-secondary">Create Team</button>
```

### Mistake 3: Gradient Card
```jsx
// WRONG
<div className="bg-gradient-to-br from-emerald-900/30 to-gray-900 border border-emerald-500/30">
  Content
</div>

// CORRECT
<div className="bg-gray-800 border border-gray-700">
  Content
</div>
```

### Mistake 4: Animation Too Long
```jsx
// WRONG
<div className="transition-all duration-500">

// CORRECT
<div className="transition-all duration-200">
```

### Mistake 5: Hover-Only Info on Mobile
```jsx
// WRONG
<button className="text-gray-500 hover:text-gold-500">
  Share (only visible on hover)
</button>

// CORRECT
<button className="text-gold-500 md:hover:text-gold-600">
  Share (visible by default, enhanced on hover)
</button>
```

### Mistake 6: Ghost Button Too Prominent
```jsx
// WRONG
<button className="border border-gold-500 text-gold-500 bg-gold-500/10">
  Follow (too much color for repeated action)
</button>

// CORRECT
<button className="border-transparent text-gray-500 hover:border-gray-600 hover:bg-gray-800">
  Follow (ghost, appears on hover)
</button>
```

---

## MEASUREMENT COMMANDS

Quick checks you can run:

```bash
# Count monospace instances
grep -r "font-mono" frontend/src/components/ | wc -l

# Find non-monospace numbers (requires code review)
grep -r "className.*text-white" frontend/src/components/leaderboard/ | grep -v "font-mono"

# Count gold buttons
grep -r "btn-primary\|bg-gold-500" frontend/src/components/ | wc -l

# Find gradient cards
grep -r "bg-gradient-to" frontend/src/components/ | grep -v "icon\|badge"

# Find animations longer than 200ms
grep -r "duration-300\|duration-500" frontend/src/components/
```

---

## APPROVAL CRITERIA

**Code Review passes when:**
- ✅ All checks in "QUICK PASS/FAIL" section are TRUE
- ✅ No anti-patterns found
- ✅ Monospace numbers verified
- ✅ Color count verified
- ✅ Mobile layout verified
- ✅ Animations verified

**QA passes when:**
- ✅ All visual audits pass on real device
- ✅ Mobile at 375px has no issues
- ✅ Dark room test passes (backgrounds verified)
- ✅ Hyperliquid/Linear/Axiom comparisons pass (informal but required)

**Ship when both Code Review + QA pass.**

---

**Last Updated:** February 27, 2026
**Status:** Active for all pull requests
**Maintained by:** Design systems team
