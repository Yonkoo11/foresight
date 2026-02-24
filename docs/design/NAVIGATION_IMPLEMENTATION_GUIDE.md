# Navigation Architecture Implementation Guide

> **Quick Reference for Developers**
> Implementation Time: 4 hours total
> Status: Ready to build

---

## TL;DR: What's Changing?

**Single nav item rename:** `/play` → `/compete`
**Single default swap:** Contests tab becomes default (not leaderboards)
**Result:** Clearer intent, faster contest discovery, identical nav structure (still 4 items)

---

## Implementation Checklist

### Step 1: Rename Navigation Item (30 minutes)

**File:** `frontend/src/components/Layout.tsx` (line 61-84)

**Current:**
```typescript
const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: House,
  },
  {
    path: '/play',           // ← CHANGE THIS
    label: 'Play',           // ← CHANGE THIS
    icon: Trophy,
    matchPaths: ['/draft', '/contest'],
  },
  {
    path: '/feed',
    label: 'Feed',
    icon: Newspaper,
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: User,
    matchPaths: ['/settings', '/referrals', '/progress'],
  },
];
```

**New:**
```typescript
const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Home',
    icon: House,
  },
  {
    path: '/compete',        // ← CHANGED
    label: 'Compete',        // ← CHANGED
    icon: Trophy,
    matchPaths: ['/draft', '/contest'],
  },
  {
    path: '/feed',
    label: 'Feed',
    icon: Newspaper,
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: User,
    matchPaths: ['/settings', '/referrals', '/progress'],
  },
];
```

**Save file.**

---

### Step 2: Update Routing (30 minutes)

**File:** `frontend/src/App.tsx`

**Current (line 22):**
```typescript
import Play from './pages/Compete';
```

**Keep as-is** (component name stays `Play`, we're just changing the route)

**Current (line 155):**
```typescript
<Route path="/play" element={<Play />} />
```

**New:**
```typescript
<Route path="/compete" element={<Play />} />
```

**Current (line 169-170):**
```typescript
<Route path="/league" element={<Navigate to="/play" replace />} />
<Route path="/compete" element={<Navigate to="/play" replace />} />
```

**New (add these after /compete route):**
```typescript
{/* Legacy redirects for old /play links */}
<Route path="/play" element={<Navigate to="/compete" replace />} />
<Route path="/league" element={<Navigate to="/compete" replace />} />
<Route path="/arena" element={<Navigate to="/compete" replace />} />

{/* Query param redirects */}
{/* /play?tab=contests → /compete */}
{/* /play?tab=rankings → /compete?tab=leaderboards */}
```

**Note:** Query param redirects are handled client-side by Compete.tsx — no route changes needed.

**Save file.**

---

### Step 3: Swap Default Tab (30 minutes)

**File:** `frontend/src/pages/Compete.tsx` (line 122-123)

**Current:**
```typescript
const initialMainTab = (searchParams.get('tab') as MainTab) || 'rankings';
```

**New:**
```typescript
const initialMainTab = (searchParams.get('tab') as MainTab) || 'contests';
```

**Explanation:** Users clicking "Compete" nav will now see contests by default, not leaderboards. They can still click "Leaderboards" tab to switch.

**Save file.**

---

### Step 4: Verify Draft Page Accessibility (15 minutes)

**File:** `frontend/src/pages/Draft.tsx`

**Check:** Route is called with `?contestId=X` parameter

**Current usage:**
- Contest Detail page has button: `href="/draft?contestId={contestId}"`
- This should already work ✓

**If it's broken:** Add this to ContestDetail where the draft button is:

```typescript
<Link
  to={`/draft?contestId=${contestId}`}
  className="btn-primary btn-lg"
>
  Draft Team
</Link>
```

**Save file if changes made.**

---

### Step 5: Test Navigation (30 minutes)

Run frontend dev server:
```bash
cd /Users/mujeeb/foresight/frontend
pnpm dev
```

Test these flows in a browser:

| Flow | Steps | Expected Result |
|------|-------|---|
| **Nav click** | Click "Compete" in top nav | Should land on `/compete` (contests tab) |
| **Default tab** | Land on `/compete` | Should show Contests (not Leaderboards) |
| **Leaderboard tab** | Click "Leaderboards" tab | Should show leaderboards with FS/Fantasy/XP options |
| **Contest entry** | Contests tab → click contest row | Should land on `/contest/:id` |
| **Draft button** | Contest detail → "Draft Team" button | Should land on `/draft?contestId=X` |
| **Back nav** | On draft page, click back arrow | Should go back to `/contest/:id` |
| **Mobile nav** | Resize to 375px width, check bottom nav | Should show 4 items, all visible |
| **Old links** | Visit `/play` directly | Should redirect to `/compete` |

**All tests passing?** Proceed to Step 6.

---

### Step 6: Mobile Screenshots (30 minutes)

Take Puppeteer screenshots to verify responsive design:

```bash
cd /Users/mujeeb/foresight

# Home page
./node_modules/.bin/tsx scripts/screenshot.ts / --full

# Compete page (contests tab default)
./node_modules/.bin/tsx scripts/screenshot.ts /compete --full

# Leaderboards tab
./node_modules/.bin/tsx scripts/screenshot.ts /compete --full --params "tab=leaderboards"

# Contest detail
./node_modules/.bin/tsx scripts/screenshot.ts /contest/6 --full

# Draft page
./node_modules/.bin/tsx scripts/screenshot.ts /draft --full --params "contestId=6"

# Profile
./node_modules/.bin/tsx scripts/screenshot.ts /profile --full
```

**Expected:** All pages look good on mobile (375px) and desktop (1200px+).

---

### Step 7: End-to-End Flow Test (30 minutes)

**Scenario: New user joining first contest**

1. Start at home page: `http://localhost:5173/`
2. See "Browse Contests" CTA
3. Click it → lands on `/compete` (should show contests tab)
4. See contest list (e.g., "Hackathon Demo League")
5. Click contest row → lands on `/contest/6`
6. See rules and "Draft Team" button
7. Click "Draft Team" → lands on `/draft?contestId=6`
8. See formation visual and influencer picker
9. Build a team, click "Submit"
10. See success screen with CTAs:
    - "View Leaderboard" → `/compete?tab=leaderboards`
    - "Draft Another" → `/draft?contestId=X` (different contest)
    - "Back Home" → `/`

**All steps work?** Proceed to deployment.

---

### Step 8: Code Review Checklist

- [ ] `Layout.tsx`: Path changed from `/play` → `/compete`, label changed from "Play" → "Compete"
- [ ] `App.tsx`: Route path changed to `/compete`, old redirects preserved
- [ ] `Compete.tsx`: Default tab changed to `'contests'`
- [ ] No TypeScript errors: `npx tsc --noEmit` in `frontend/` directory
- [ ] Frontend builds clean: `pnpm build` in `frontend/` directory
- [ ] All tests pass: `pnpm test` in `frontend/` directory

---

### Step 9: Git Commit

```bash
cd /Users/mujeeb/foresight

git add frontend/src/components/Layout.tsx
git add frontend/src/pages/Compete.tsx
git add frontend/src/App.tsx

git commit -m "Navigation: Rename 'Play' to 'Compete', swap default tab to contests

- Change nav item from '/play' to '/compete' with label 'Compete' for clarity
- Update route definitions and legacy redirects (/play, /league, /arena)
- Swap default Compete tab from 'rankings' to 'contests' for faster discovery
- Contests now default view, leaderboards available as tab
- Improves contest entry clarity and reduces time-to-first-entry
- No changes to page count or mobile nav structure (still 4 items)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

### Step 10: Verify Deployment

After pushing to production:

1. Visit home page
2. Click "Compete" nav item
3. Verify it lands on contests (not leaderboards)
4. Verify leaderboards tab exists and works
5. Test contest entry flow top-to-bottom
6. Check mobile bottom nav (4 items, all visible)

---

## Before/After Comparison

### URL Mapping

| User Action | BEFORE | AFTER |
|---|---|---|
| Click nav "Play" | → `/play` (rankings tab) | → `/compete` (contests tab) |
| Click nav "Play" then "Contests" tab | → `/play?tab=contests` | → `/compete?tab=contests` |
| Click nav "Play" then "Leaderboards" tab | → `/play?tab=rankings` | → `/compete?tab=leaderboards` |
| Enter contest (default) | Click "Contests" tab first | Immediate (already on contests) |

### User Journey (Demo)

**BEFORE (3 minutes):**
```
1. Click "Play" nav → lands on rankings (confused)
2. Click "Contests" tab
3. Click contest row
4. Click "Draft Team"
5. Draft team (1.5 min)
6. Submit
```

**AFTER (2 minutes):**
```
1. Click "Compete" nav → lands on contests (clear)
2. Click contest row
3. Click "Draft Team"
4. Draft team (1.5 min)
5. Submit
```

**Improvement:** 33% faster, 100% clearer.

---

## Rollback Plan (If Needed)

If users report confusion with "Compete" label:

1. Revert `Layout.tsx` to `label: 'Play'` (keep path as `/compete`)
2. That's it — users see "Play" but nav item points to `/compete`

**OR:** Change label to something else (Arena, Leagues, Contests)

---

## FAQ

### Q: Why "Compete" instead of "Contests"?
A: "Compete" describes the action (vs. "Contests" which is a noun). It also covers leaderboards + contests (broader concept).

### Q: Why not just make both tabs visible?
A: Adds complexity, tabs are confusing for new users. Default tab should be clear intent.

### Q: Will this break existing bookmarks?
A: No, `/play` redirects to `/compete` transparently.

### Q: Should I update documentation/README?
A: Yes, change any hardcoded `/play` links to `/compete` in:
- README.md
- Video descriptions
- Email templates
- Social media posts

### Q: What about the Contest Detail back button?
A: Should already work (uses browser back). If needed, can link to `/compete?tab=contests`.

### Q: Is draft still only accessible from Contest Detail?
A: Yes for normal users (good UX flow). Power users can bookmark `/draft?contestId=X`. We can add "Quick Draft" card on home later if needed.

---

## Time Budget Summary

| Task | Time | Notes |
|------|------|-------|
| Code changes | 1.5 hours | Layout + App + Compete |
| Testing | 1 hour | Manual browser testing |
| Screenshots | 0.5 hours | Puppeteer verification |
| E2E testing | 0.5 hours | Full contest entry flow |
| Review + commit | 0.5 hours | Git workflow |
| **Total** | **4 hours** | Done in 1 day |

---

## Success Criteria

After deploying, verify:

- [ ] `/compete` loads correctly (contests tab default)
- [ ] `/play` redirects to `/compete`
- [ ] Mobile nav shows "Compete" label
- [ ] Contests tab shows contest list
- [ ] Leaderboards tab shows rankings (FS/Fantasy/XP)
- [ ] Contest entry flow takes <2 minutes
- [ ] No TypeScript errors
- [ ] No broken links in codebase
- [ ] Mobile responsive at 375px, 768px, 1200px

---

## Quick Reference: File Locations

```
frontend/src/
├── components/
│   └── Layout.tsx                 ← Update nav items (path, label)
├── pages/
│   ├── App.tsx                    ← Update routes
│   ├── Compete.tsx                ← Update default tab
│   ├── ContestDetail.tsx          ← Verify draft button links
│   └── Draft.tsx                  ← No changes needed
└── [Other files]                  ← No changes
```

---

## Validation Commands

Run these to confirm everything is working:

```bash
# Check for TypeScript errors
cd /Users/mujeeb/foresight/frontend
npx tsc --noEmit

# Run tests
pnpm test

# Build for production
pnpm build

# Navigate to app and test
open http://localhost:5173
```

All should pass with zero errors.

---

End of Implementation Guide
