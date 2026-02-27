---
paths: frontend/**/*.tsx, frontend/**/*.ts, frontend/**/*.css
description: Design overhaul process — page-by-page enterprise redesign
---

# Foresight Design Overhaul — Process & Rules

## The Standard
Enterprise-level, CT-native, unique to this product. Think Linear, Hyperliquid, Raycast — not a hackathon side project. Thousands of daily users, revenue, retention.

## The Team Model

| Role | Who | When |
|------|-----|------|
| CTO (orchestrator) | Claude (main) | Every step — owns the process |
| UX Researcher | Subagent | Before each page — competitive intel + what's broken |
| Creative Director | Subagent | When direction is unclear — visual language decisions |
| Lead UX Designer | Subagent | Per page — spec wireframe + interaction design |
| Frontend Architect | Main Claude | Implementation — clean, minimal code |

## Page-by-Page Protocol

**For EVERY page, follow this exact sequence:**

### Step 1: Receive Screenshot
User sends current page screenshot. CTO acknowledges and begins analysis.

### Step 2: Pre-Analysis (CTO does this, no agent needed)
Answer these questions from the screenshot:
- What is this page's ONE job?
- What is broken, confusing, or embarrassing?
- What is the primary action — is it obvious?
- Mobile issues (thumb reach, scroll, touch targets)?
- Specific "AI slop" to remove (glows, gradients, long buttons, emoji, etc.)?

### Step 3: Research Spike (UX Researcher agent — parallel when needed)
- How do 2-3 best-in-class products solve this same screen?
- What CT-specific patterns apply here?
- What creates retention/habit on this specific screen type?

### Step 4: Design Spec (UX Designer agent OR CTO writes inline)
Write a clear spec before touching code:
```
PAGE: [name]
PRIMARY ACTION: [one thing]
LAYOUT CHANGES: [specific changes]
COMPONENTS TO ADD/REMOVE: [list]
COPY CHANGES: [specific text changes]
MOBILE NOTES: [375px considerations]
```

### Step 5: Implement (Frontend Architect — main Claude)
- One page at a time. Never batch.
- Screenshot BEFORE and AFTER
- `npx tsc --noEmit` must pass
- Mobile-first (375px) always

### Step 6: Review
Take after-screenshot. Present to user. Iterate until approved.
Mark page ✅ in REDESIGN_TRACKER.md only after user approval.

---

## Design System Rules (NON-NEGOTIABLE)

### What to REMOVE immediately (AI slop)
- `shadow-glow-neon` and `shadow-glow-neon-intense` — delete everywhere
- `animate-pulse-neon-loop` — remove from all elements
- `neon-500` color (#10F981) — reserve ONLY for Tapestry on-chain verified dot (1 use max)
- Full-width buttons that span the entire container for secondary actions
- Gradient backgrounds on cards
- Emoji in code (use Phosphor icons)
- `text-cyan-*` in UI chrome (only allowed on A-tier badges)

### Colors — The System
```
Background:   #09090B  (gray-950) — deepest base
Surface:      #111111  (gray-900-ish) — cards
Elevated:     #18181B  (gray-900) — modals, dropdowns
Border:       #27272A  (gray-800) — all borders
Border-hover: #3F3F46  (gray-700) — hover states

Primary:      #F59E0B  (gold-500) — ONE CTA per section, S-tier, #1 rank
Text:         #FAFAFA  (white) — primary text
Text-muted:   #A1A1AA  (gray-400) — secondary text
Text-dim:     #71717A  (gray-500) — tertiary, labels

Success:      #22C55E  (green-500) — wins, claimed, verified
Error:        #EF4444  (red-500) — errors only
Warning:      #F59E0B  (gold, same as primary) — budget warnings

Tier badges:
  S-tier:    gold-500 bg / gold-900 text
  A-tier:    cyan-500 bg / cyan-900 text  (ONLY allowed cyan use)
  B-tier:    emerald-500 bg / emerald-900 text
  C-tier:    gray-600 bg / gray-300 text

Rank colors:
  #1:  gold-500 text, font-mono font-bold
  #2:  gray-300 text, font-mono
  #3:  emerald-500 text, font-mono
  4+:  gray-500 text, font-mono
```

### Typography
```
Numbers/Stats:  font-mono tabular-nums (ALL numeric values, no exceptions)
Headings:       font-semibold or font-bold, tracking-tight
Body:           font-normal, leading-relaxed
Labels:         text-xs uppercase tracking-wider text-gray-500
CTAs:           font-semibold
```

### Buttons — The Hierarchy
```
Primary (ONE per section):  bg-gold-500 text-black hover:bg-gold-400 font-semibold px-6 py-2.5 rounded-lg
Secondary:                  border border-gray-700 text-white hover:border-gray-500 hover:bg-gray-900 px-4 py-2 rounded-lg
Ghost (repeated actions):   text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 (hover-reveal only)
Destructive:               text-red-400 hover:text-red-300 (ghost, never filled)

RULE: Primary button max-width should fit content + padding. Never full-width unless it's THE main CTA on the entire screen (e.g., "Start Playing" on landing).
```

### Cards
```
Default:     bg-gray-900 border border-gray-800 rounded-xl p-4
Interactive: default + hover:border-gray-700 cursor-pointer transition-colors duration-150
Selected:    border-gold-500/50 bg-gray-900
NO:          gradient backgrounds, colored borders (except selected state)
```

### Interactions
```
All transitions: duration-150 (never 500ms+)
Hover:          bg/border color shift only — no scale, no lift, no glow
Focus:          ring-2 ring-gold-500/50 ring-offset-2 ring-offset-gray-950
Loading:        Skeleton with animate-pulse (gray-800 → gray-700)
Empty states:   Gray icon + short message + one CTA
```

### Spacing
```
Section gaps:   gap-6 or space-y-6
Card padding:   p-4 (mobile), p-6 (desktop)
Touch targets:  min-h-[44px] on all interactive elements
Grid:           4px base unit strictly
```

---

## Anti-Patterns (Review Before Every PR)

1. ❌ More than 1 gold button visible at once in a section
2. ❌ Any neon glow (shadow-glow-*)
3. ❌ Full-width secondary buttons
4. ❌ Cyan anywhere except A-tier badge
5. ❌ Emoji in JSX (use Phosphor icons)
6. ❌ Numbers without font-mono
7. ❌ Transitions > 200ms
8. ❌ Card background gradients
9. ❌ Hover: scale or translateY (feels cheap)
10. ❌ Absolute positioning hacks for mobile

---

## Screenshot Workflow (MANDATORY)

```bash
# Before any page change
cd /Users/mujeeb/foresight && ./node_modules/.bin/tsx scripts/screenshot.ts /page-name --full

# After implementing
cd /Users/mujeeb/foresight && ./node_modules/.bin/tsx scripts/screenshot.ts /page-name --full

# Save to: screenshots/[page]-before.png and screenshots/[page]-after.png
```

---

## Definition of Done (per page)
- [ ] All anti-patterns removed
- [ ] Screenshot taken after — user approved
- [ ] Mobile screenshot at 375px taken and approved
- [ ] `npx tsc --noEmit` passes
- [ ] Marked ✅ in REDESIGN_TRACKER.md
