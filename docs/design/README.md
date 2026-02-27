# Design System Documentation

**Complete as of:** February 27, 2026

This folder contains the definitive design direction for Foresight. Three documents, one vision.

---

## 📄 The Three Documents

### 1. **CREATIVE_BRIEF.md** (842 lines)
**"The Vision & Philosophy"**

This is the creative direction. Read this first. Contains:
- Vision statement (what Foresight feels like)
- Target user persona (who we design for)
- Design personality (5 defining adjectives)
- What we are / what we are NOT
- Tone of voice (copy guidelines)
- Core visual language (color, typography, spacing)
- 10 non-negotiable design rules
- Page-by-page design direction (Home, Draft, Leaderboard, Contest Detail, CT Feed, Profile, Progress)
- Component decisions (high-level)
- Inspiration sources (which apps to reference for which pages)

**When to use:** Architects, product managers, designers, anyone making visual decisions.
**Who should read first:** The CTO, the designer, anyone leading UI/UX changes.

---

### 2. **DESIGN_TOKENS_V2.md** (907 lines)
**"The System Specification"**

This is the technical reference. Contains:
- Complete color palette (with hex codes, Tailwind classes, usage)
- Typography scale (6 sizes, exact specifications, CSS/Tailwind)
- Spacing scale (4px increments, usage guidelines)
- Border radius specifications
- Shadow & elevation system
- Animation definitions (timing, easing, keyframes)
- Responsive breakpoints (mobile-first)
- Component scales (buttons, cards, badges)
- Utility tokens (opacity, z-index)
- Accessibility standards (contrast, touch targets, focus)
- Semantic color mapping
- Example Tailwind config

**When to use:** Frontend engineers, developers, QA testers.
**Who should use this:** The person writing CSS/Tailwind. This is the source of truth.

---

### 3. **COMPONENT_SPEC_V2.md** (1,144 lines)
**"The Implementation Details"**

This is the exact spec for building components. Contains detailed specs for:
1. LeaderboardRow (rank, name, score, action)
2. ContestCard (prize pool, entries, status)
3. InfluencerCard (draft page, tier, cost, captain toggle)
4. TweetCard (engagement display, tier badge)
5. ProfileHeader (avatar, name, tier, score)
6. StatNumber (monospace numbers with labels)
7. TierBadge (S/A/B/C color-coded)
8. StatusBadge (LIVE, ENTERED, COMPLETED, etc.)
9. Button Variants (Primary, Secondary, Ghost, Destructive)
10. Navigation (bottom tabs on mobile, top nav on desktop)

Each component spec includes:
- Visual design mockup
- Desktop layout code (Tailwind classes)
- Mobile layout code
- All possible states (rest, hover, active, disabled, etc.)
- Current issues & fixes (what's wrong now, how to fix it)

**When to use:** Frontend engineers building components, QA verifying components.
**Who should use this:** The developer implementing each page.

---

## 🎯 Quick Start

### If you're a designer:
1. Read **CREATIVE_BRIEF.md** section 1-6 (vision, user, personality, rules, visual language)
2. Keep **CREATIVE_BRIEF.md** open while designing
3. Reference **DESIGN_TOKENS_V2.md** for exact colors/spacing
4. Use **COMPONENT_SPEC_V2.md** for component visual specs

### If you're a frontend engineer:
1. Skim **CREATIVE_BRIEF.md** section 7-8 (rules, component decisions)
2. Use **DESIGN_TOKENS_V2.md** as your Tailwind source of truth
3. Use **COMPONENT_SPEC_V2.md** as your implementation spec (exact classes, all states)
4. Copy/paste code examples from COMPONENT_SPEC_V2.md

### If you're a product manager or CTO:
1. Read **CREATIVE_BRIEF.md** in full (15 min read)
2. Reference **CREATIVE_BRIEF.md** sections 2-10 when making trade-off decisions
3. Use for design review: "Does this match the rules in section 7?"

### If you're a QA tester:
1. Use **COMPONENT_SPEC_V2.md** as your test specification
2. For each component, verify all states are correct
3. Use **DESIGN_TOKENS_V2.md** to spot-check colors/spacing

---

## 🚀 How to Use This in Code

### In Tailwind:

```javascript
// tailwind.config.js - Reference DESIGN_TOKENS_V2.md
module.exports = {
  theme: {
    colors: { /* from Color Palette section */ },
    fontSize: { /* from Typography section */ },
    spacing: { /* from Spacing Scale section */ },
    borderRadius: { /* from Border Radius section */ },
    boxShadow: { /* from Shadows section */ },
  },
};
```

### In Components:

```tsx
// Copy/paste from COMPONENT_SPEC_V2.md
// Example: LeaderboardRow

<tr className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
  <td className="px-4 py-4 text-amber-500 font-mono font-bold text-2xl">
    #1
  </td>
  {/* ... rest from spec ... */}
</tr>
```

### In CSS:

```css
/* index.css - Reference DESIGN_TOKENS_V2.md CSS Variables section */
:root {
  --bg-primary: #09090B;
  --text-primary: #FAFAFA;
  --accent-primary: #F59E0B;
  /* ... all tokens ... */
}
```

---

## ✅ Compliance Checklist

Before marking any UI work done:

- [ ] All colors from DESIGN_TOKENS_V2.md color palette
- [ ] All typography uses 6-size scale (DESIGN_TOKENS_V2.md)
- [ ] All spacing uses 4px increments (DESIGN_TOKENS_V2.md)
- [ ] All numbers are monospace (COMPONENT_SPEC_V2.md)
- [ ] All buttons use 4 variants only (COMPONENT_SPEC_V2.md)
- [ ] Only 1 gold CTA per screen section (CREATIVE_BRIEF.md Rule 2)
- [ ] Mobile layout tested at 375px (CREATIVE_BRIEF.md Rule 6)
- [ ] All animations 150-300ms (CREATIVE_BRIEF.md Rule 7)
- [ ] All component states implemented (COMPONENT_SPEC_V2.md)
- [ ] WCAG AA contrast verified (DESIGN_TOKENS_V2.md Accessibility)

---

## 📋 Key Design Decisions (TL;DR)

| Aspect | Decision | Why |
|--------|----------|-----|
| **Colors** | Gold (#F59E0B) on dark (#09090B), 60-30-10 rule | Crypto-native, premium SaaS aesthetic |
| **Typography** | 6 sizes only (Display, H2, H3, Body, Body-sm, Caption) | Clarity, no visual chaos |
| **Spacing** | 4px increments only | Precision, easy to maintain |
| **Animations** | 200-300ms, ease-out timing | Snappy, not sluggish |
| **Mobile-First** | Design 375px first, add desktop later | 80% of users are mobile |
| **Data Numbers** | Always monospace | Signals trustworthy data |
| **Buttons** | 4 variants (primary, secondary, ghost, destructive) | Clarity, no choice paralysis |
| **Navigation** | 5 items only, gold for active | Thumb-reachable, clear focus |
| **Shadows** | Elevation via shadows, not borders | Dark theme best practice |
| **Rules** | 10 non-negotiables in CREATIVE_BRIEF | Forces decision-making |

---

## 🔗 Related Documents

- `CREATIVE_BRIEF.md` — This document's parent (design vision)
- `DESIGN_TOKENS_V2.md` — This document's parent (technical specs)
- `COMPONENT_SPEC_V2.md` — This document's parent (implementation details)
- `research/TRADING_APPS_QUICK_REFERENCE.md` — What crypto traders expect
- `research/FANTASY_SPORTS.md` — Fantasy sports UX patterns
- `research/FANTASY_TOP.md` — Competitor analysis (what worked, what failed)
- `research/FORESIGHT_VS_FANTASY_TOP.md` — How we're different & better
- `research/PREMIUM_SAAS_DESIGN_PRINCIPLES.md` — Enterprise-grade patterns
- `research/IMPLEMENTATION_ROADMAP.md` — Phase-by-phase polish plan

---

## 🤔 FAQ

**Q: Can I break the rules?**
A: Rule #1 is don't break the rules. If you need to, discuss with the CTO first. The rules exist to maintain consistency.

**Q: What if a component doesn't match the spec?**
A: Update COMPONENT_SPEC_V2.md first (document the change), then implement. Don't implement first then spec—that's backwards.

**Q: I need a new color. Can I add one?**
A: No. Pick from the existing palette (DESIGN_TOKENS_V2.md). If truly new, update DESIGN_TOKENS_V2.md and CREATIVE_BRIEF.md before shipping.

**Q: How often should I reference these docs?**
A: Constantly. Every button, every color, every spacing decision should trace back to these docs.

**Q: Which document is the "most important"?**
A: CREATIVE_BRIEF.md (the vision). Without the vision, the tokens and components are meaningless.

---

## 📞 Questions?

If the spec is unclear, the answer is in one of these three documents. If it's not in any of them, add it.

Document maintainer: Claude (Design Research)
Last updated: February 27, 2026
Status: READY FOR IMPLEMENTATION
