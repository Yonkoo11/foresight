# Design Research Hub

This directory contains comprehensive research into premium crypto app design patterns. All documents are focused on actionable patterns Foresight should implement.

---

## Documents in This Directory

### 1. **TRADING_APPS.md** (Primary Research)
**Length:** 12,000 words | **Time to read:** 25-30 minutes

The comprehensive analysis of 5 leading crypto trading platforms:
- Hyperliquid (gold standard for professional trading UI)
- Axiom (Solana terminal vernacular)
- Photon (mobile-first memecoin trading)
- Birdeye (analytics dashboard)
- DexScreener (minimalist chart focus)

**What's inside:**
- Visual identity analysis for each app (colors, typography, spacing)
- Real-time update aesthetics and why they matter
- Button/interaction patterns extracted from each platform
- Comparative analysis: color strategies, data density trade-offs
- 10 key design lessons adapted for Foresight
- Implementation checklist (Priority 1/2/3)
- Competitive positioning statement

**When to read:** First time understanding trading app design patterns, or to get the full context before implementation.

---

### 2. **TRADING_APPS_QUICK_REFERENCE.md** (Implementation Cheat Sheet)
**Length:** 3,000 words | **Time to read:** 5-10 minutes

One-page summary of the most important patterns, perfect for keeping open during development.

**What's inside:**
- 10 key patterns (copy-paste ready)
- Color palette quick copy (hex values)
- Spacing scale reference
- Common component patterns
- Real-time updates code structure
- Mobile-first checklist
- Audit checklist before shipping

**When to read:** Daily during implementation. Print it, stick it by your monitor.

---

### 3. **TRADING_APPS_CODE_EXAMPLES.md** (Production-Ready Code)
**Length:** 4,000 words | **Time to read:** 10-15 minutes

Copy-paste React and CSS code snippets extracted from the research.

**What's inside:**
- Real-time score flash animation (CSS + React)
- Glow effects for achievements (CSS + component)
- Monospace number formatting (utility functions)
- Button hierarchy: 4 variants (Primary/Secondary/Ghost/Danger)
- Leaderboard row complete example
- Card variants (default/elevated/highlighted/interactive)
- Hover state reveal patterns
- Tooltip with monospace data
- Type scale quick reference
- Real-time score update handler (service + component)
- Responsive grid patterns
- Toast notifications
- Tailwind config additions
- Usage checklist

**When to read:** When implementing a specific component. Search for the pattern you need, copy the code, adapt it.

---

## How to Use These Documents

### Scenario 1: "I need to understand premium crypto app design"
1. Read **TRADING_APPS.md** (full context)
2. Keep **TRADING_APPS_QUICK_REFERENCE.md** open while designing
3. Implement using **TRADING_APPS_CODE_EXAMPLES.md**

### Scenario 2: "I'm implementing a component and need code"
1. Go to **TRADING_APPS_CODE_EXAMPLES.md**
2. Search for the component (Real-time updates, Buttons, etc.)
3. Copy the code and adapt
4. Cross-reference **TRADING_APPS_QUICK_REFERENCE.md** for styling details

### Scenario 3: "I'm reviewing design changes and want to ensure alignment"
1. Check against the 10 Key Lessons in **TRADING_APPS_QUICK_REFERENCE.md**
2. Use the audit checklist before marking done
3. Reference **TRADING_APPS.md** (Section "Design Debt to Clean Up") for systemic improvements

---

## Key Findings Summary

### What Makes Trading Apps Feel Premium

1. **Monospace Data** — Numbers are in JetBrains Mono, signaling precision and trust
2. **Minimal Color** — Only essential metrics are colored; rest is grayscale
3. **Glow Effects** — Soft glows replace shadows in dark themes
4. **Real-time Subtlety** — Changes flash briefly (150-200ms) then fade
5. **High Contrast Typography** — White text on near-black, medium weights, mono
6. **Ghost Interactions** — Hover reveals without changing default state
7. **No Gradient Cards** — Flat dark backgrounds with color accents inside
8. **Sharp Edges** — Minimal border-radius (3-12px) signals precision
9. **Vertical Scanability** — Every row is a complete information unit
10. **Solana Speed Aesthetics** — Animations max 300ms, snappy not smooth

### Foresight Alignment Score: 80%

**Currently Doing Well:**
- Dark theme (gray-950 base) ✅
- Gold primary color ✅
- Monospace numbers ✅
- Real-time animations (partial) ✅
- Button hierarchy ✅
- Glow effects (present but underutilized) ✅

**Areas to Improve:**
- Type scale (too many sizes, simplify to 6) ⚠️
- Score flash animations (add flash timing) ⚠️
- Glow usage (increase 2x) ⚠️
- Secondary color strategy (cyan overused in crypto, consider emerald) ⚠️

---

## Implementation Roadmap

### Week 1 (High Impact)
- [ ] Add scoreFlash animation to leaderboard (150-200ms)
- [ ] Simplify type scale to 6 core sizes
- [ ] Increase glow usage 2x (especially achievements)
- [ ] Test all components at 375px mobile width

### Week 2 (Polish)
- [ ] Replace 30% of shadows with glows
- [ ] Add emerald accent for free contests
- [ ] Implement pulsing glow for "Live" indicators
- [ ] Audit and update all button hover states

### Week 3 (Refinement)
- [ ] Test with real data (live scoring updates)
- [ ] Verify animations feel right at 30fps/60fps
- [ ] Compare screenshots against Hyperliquid leaderboard
- [ ] Get designer approval

---

## Related Documents

**Core Design System (Required Reading):**
- `docs/design/DESIGN_TOKENS.md` — Color palette, typography, spacing
- `docs/design/DESIGN_PRINCIPLES.md` — 10 core principles (non-negotiable)

**Other Research:**
- `docs/design/DESIGN_RESEARCH_PLAN.md` — Original research methodology
- `docs/design/SOCIAL_FEATURES_UX_SPEC.md` — Community features
- `docs/design/CRYPTO_UX_FRAMEWORK.md` — Crypto-specific patterns

**Implementation Guides:**
- `docs/design/research/TRADING_APPS_CODE_EXAMPLES.md` — Copy-paste code

---

## FAQ

### Q: Should I read all three documents?

**A:** Depends on your role:
- **Designer:** Read TRADING_APPS.md (full context) + QUICK_REFERENCE.md (daily reference)
- **Developer:** Read QUICK_REFERENCE.md + CODE_EXAMPLES.md (implementation)
- **Product Manager:** Read TRADING_APPS.md (Section 10 "Key Lessons")
- **Engineer reviewing PRs:** Use audit checklist in QUICK_REFERENCE.md

### Q: Which patterns are most important for Foresight?

**A:** In order of impact:
1. Score flash animations (150-200ms) — high visibility
2. Glow effects on achievements — brand polish
3. Simplify type scale — information hierarchy
4. Button hover states — interaction feel
5. Monospace data usage — data trust

### Q: Can I just use the code examples without reading the research?

**A:** Yes, but you'll miss important context about *why* these patterns work. Recommend reading QUICK_REFERENCE.md first (5-10 minutes) to understand the philosophy.

### Q: What if I disagree with these patterns?

**A:** Great! These are recommendations based on trading app analysis, not gospel. If you have a better approach:
1. Document it in a design decision RFC
2. Test it against the 10 Key Lessons
3. Get designer + product approval
4. Update this research with your findings

### Q: Should I implement all 10 lessons immediately?

**A:** No. Focus on the 3 highest-impact items:
1. Score flash animations (most visible)
2. Glow effects (brand signal)
3. Simplify type scale (foundation for all UI)

Everything else will feel better once those are done.

---

## Contributing to This Research

If you find additional patterns in other trading apps:
1. Document the pattern (visual description + use case)
2. Extract CSS/React code example
3. Add to TRADING_APPS_CODE_EXAMPLES.md
4. Update QUICK_REFERENCE.md with the pattern
5. Commit with message: `research: add [pattern name] from [app]`

---

## Version History

| Date | Update | Author |
|------|--------|--------|
| Feb 27, 2026 | Initial research complete (3 documents) | Claude (UX Researcher) |
| — | Ready for implementation feedback | — |

---

## Questions?

If you have questions about these patterns:
1. Check QUICK_REFERENCE.md (common questions answered)
2. Search TRADING_APPS_CODE_EXAMPLES.md (pattern you're implementing)
3. Review TRADING_APPS.md (full context and rationale)
4. Ask in #design Slack channel

---

**Next Steps:** Read TRADING_APPS_QUICK_REFERENCE.md and start with Priority 1 implementation items.
