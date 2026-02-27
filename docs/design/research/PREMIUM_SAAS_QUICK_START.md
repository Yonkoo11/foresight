# Premium SaaS Design: Developer Quick Start

> **For:** Frontend developers implementing design changes
> **Time:** 5-minute read, then use as reference during development
> **Status:** Action-ready

---

## Color Rule: 60-30-10

| What | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| **Primary Background (60%)** | #09090B | `bg-gray-950` | Main page background |
| **Elevated Surface (30%)** | #111111 | `bg-gray-900` | Cards, dropdowns |
| **Text Primary (30%)** | #FAFAFA | `text-white` | All readable text |
| **Text Secondary (30%)** | #A1A1AA | `text-gray-400` | Hints, meta, timestamps |
| **Border Color (30%)** | #27272A | `border-gray-800` | All borders are gray |
| **ACCENT - Gold (10%)** | #F59E0B | `bg-amber-500` | CTAs ONLY - one per section |
| **Success (semantic)** | #10B981 | `bg-emerald-500` | Status badges only |
| **Error (semantic)** | #EF4444 | `bg-red-500` | Error states only |

**GOLDEN RULE:** If your page has more than one gold element per section, you're doing it wrong.

---

## Button Variants (Pick One Per Use)

```jsx
// Primary - Main CTA
<button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">
  Primary CTA
</button>

// Secondary - Less important
<button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-white rounded-lg">
  Secondary
</button>

// Ghost - Many per row (hidden until hover)
<button className="px-4 py-2 bg-transparent hover:bg-gray-800 text-white rounded-lg">
  View
</button>

// Destructive - Dangerous actions (hide until needed)
<button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
  Delete
</button>

// Icon Button
<button className="w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800">
  ⋮
</button>
```

---

## Card/Surface Design

```jsx
// Standard card
<div className="bg-gray-950 rounded-lg p-6 shadow-sm border border-gray-800">
  Card content
</div>

// Elevated card (modal, popover)
<div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-700">
  Modal content
</div>

// Interactive card (clickable, hovers)
<div className="bg-gray-950 rounded-lg p-6 shadow-sm border border-gray-800 hover:border-gray-700 hover:shadow-md hover:bg-gray-925 transition-all duration-200 cursor-pointer">
  Interactive content
</div>
```

---

## Typography Quick Reference

| Role | Font | Size | Weight | Line Height | Example |
|------|------|------|--------|-------------|---------|
| Page Title | Plus Jakarta Sans | 36px | 700 | 1.2 | "My Teams" heading |
| Section Header (H2) | Inter | 24px | 600 | 1.4 | "Recent Contests" |
| Card Title (H3) | Inter | 18px | 600 | 1.5 | Contest name |
| Body Text | Inter | 16px | 400 | 1.6 | Descriptions, paragraph |
| Small/Hint | Inter | 14px | 400 | 1.5 | Metadata, helper text |
| Caption | Inter | 12px | 500 | 1.4 | Timestamps, labels |
| Monospace | JetBrains Mono | 13px | 400 | 1.4 | Wallet addresses, IDs |

---

## Shadows (Use These 4 Only)

```css
/* Shadow SM - Cards at rest */
box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);

/* Shadow MD - Cards on hover, floating elements */
box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.6);

/* Shadow LG - Dropdowns, popovers */
box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.8);

/* Shadow XL - Modal overlays */
box-shadow: 0 40px 80px 0 rgba(0, 0, 0, 0.9);
```

---

## Timing & Animations

| Use Case | Duration | Easing |
|----------|----------|--------|
| Hover state (button, card) | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| State change (toggle, checkbox) | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Modal/popup enter | 300ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Page transition | 300-500ms | `cubic-bezier(0.4, 0, 0.2, 1)` |

**Never:**
- Use 0ms transitions (feels cheap)
- Use transitions over 500ms (feels sluggish)
- Use bouncy easing on data (feels unprofessional)

---

## Spacing Scale (4px-based)

Use these consistently everywhere:
```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
```

Map to Tailwind:
```
p-1, p-2, p-3, p-4, p-5, p-6, p-8, p-10, p-12, p-16
```

---

## Common Patterns

### Data Table
```jsx
<table className="w-full">
  <thead>
    <tr>
      <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500 bg-gray-900 border-b border-gray-800">
        Name
      </th>
      <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 bg-gray-900 border-b border-gray-800">
        Score
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
      <td className="px-4 py-4 text-white">Alice</td>
      <td className="px-4 py-4 text-right font-mono text-gray-300">2,450</td>
      <td className="px-4 py-4 text-right">
        {/* Ghost buttons appear here on hover */}
        <button className="px-2 py-1 text-gray-400 hover:text-white hover:bg-gray-800 text-sm rounded">
          View
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

### Status Badge
```jsx
// Success
<span className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 rounded-full px-3 py-1 text-sm font-medium">
  ✓ Active
</span>

// Error
<span className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 rounded-full px-3 py-1 text-sm font-medium">
  ✗ Error
</span>

// Pending (use gray, not blue)
<span className="inline-flex items-center gap-2 bg-gray-700/50 text-gray-300 rounded-full px-3 py-1 text-sm font-medium">
  ⋯ Pending
</span>
```

### Empty State
```jsx
<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
  <Icon className="w-12 h-12 text-gray-600 mb-6" />
  <h2 className="text-xl font-semibold text-white mb-2">No teams yet</h2>
  <p className="text-sm text-gray-400 mb-6 max-w-md">
    Draft your first team to start competing.
  </p>
  <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg">
    Draft Team
  </button>
</div>
```

---

## What to Avoid

```jsx
// ❌ Multiple accent colors on one page
<button className="bg-cyan-500">View</button>
<button className="bg-purple-500">Edit</button>

// ✅ One gold CTA per section
<button className="bg-amber-500">Primary Action</button>
<button className="bg-gray-900 border border-gray-700">Secondary</button>

// ❌ Bright, colored borders
<div className="border border-amber-500">...</div>
<div className="border border-cyan-500">...</div>

// ✅ Gray borders always
<div className="border border-gray-800">...</div>

// ❌ Neon glows
<div className="shadow-lg shadow-amber-500/50">...</div>

// ✅ Subtle black shadows only
<div className="shadow-lg">...</div>

// ❌ Dense spacing (cramped)
<div className="p-2 gap-2">...</div>

// ✅ Generous spacing
<div className="p-6 gap-4">...</div>

// ❌ Too many animations
<div className="hover:scale-110 hover:rotate-2 transition-all">...</div>

// ✅ Subtle, single animation
<div className="hover:-translate-y-1 shadow-md transition-all duration-200">...</div>
```

---

## Pre-Flight Checklist Before Committing

```
[ ] Only 1 gold CTA per screen section
[ ] All borders are gray (#27272A)
[ ] No cyan, purple, or random colors
[ ] Buttons follow 4 variants (primary, secondary, ghost, destructive)
[ ] Cards use shadow system (sm/md/lg/xl)
[ ] Shadows are black, not colored
[ ] Tables use hover lift (no row striping)
[ ] Spacing uses 4px scale
[ ] Micro-interactions are 200-300ms
[ ] Typography hierarchy is clear (size/weight, not color)
[ ] Status indicators use green/red/gray only
[ ] Mobile layout tested (375px width minimum)
[ ] No animations over 500ms (except page nav)
```

---

## Files to Reference

- **Full Design Principles:** `/docs/design/research/PREMIUM_SAAS_DESIGN_PRINCIPLES.md`
- **Design Tokens:** `/docs/design/DESIGN_TOKENS.md`
- **Component Library:** `/frontend/src/components/ui/`
- **Tailwind Config:** `/frontend/tailwind.config.js`

---

**TL;DR:** Gold accents go on CTAs ONLY. Everything else is gray. Big typography does the heavy lifting. Shadows are subtle and black. Animations are snappy (200-300ms). Tables use hover, not borders. That's it.
