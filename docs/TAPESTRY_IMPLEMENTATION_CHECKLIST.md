# Tapestry Implementation Checklist — Quick Reference for Developers

> **Use this during development.** Update as you complete items.

---

## Phase 1: Core MVP Features (6 hours)

### [ ] 1. Profile Page — Tapestry Badge (30 min)

**File:** `frontend/src/pages/Profile.tsx`

**What to add:**
- In Overview tab, add section showing "Tapestry Profile"
- Show: Badge with checkmark + "Published to Tapestry Protocol"
- Show: Tapestry profile ID (from user's auth state)

**Code template:**
```tsx
<div className="mt-6 p-4 bg-gradient-to-br from-gold-500/10 to-transparent border border-gold-500/30 rounded-lg">
  <div className="flex items-center gap-2 mb-2">
    <CheckCircle className="w-5 h-5 text-gold-500" />
    <h3 className="text-lg font-semibold text-gold-400">Tapestry Profile</h3>
  </div>
  <p className="text-sm text-gray-400 mb-2">Published to Solana's Social Graph</p>
  <p className="text-xs text-gray-500 mono font-mono">ID: {tapestryUserId}</p>
</div>
```

**Test:** Click profile, verify badge appears, no console errors

---

### [ ] 2. Profile Page — Social Counts from Tapestry (1 hour)

**File:** `frontend/src/pages/Profile.tsx`

**What to add:**
- Add API call to `/api/tapestry/social-counts?profileId={tapestryUserId}`
- Display followers/following counts in stats section
- Show loading state (skeleton) while fetching

**Code template:**
```tsx
useEffect(() => {
  if (!tapestryUserId) return;
  const fetchSocialCounts = async () => {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${API_URL}/api/tapestry/social-counts`, {
      params: { profileId: tapestryUserId },
      headers: { Authorization: `Bearer ${token}` }
    });
    setSocialCounts(res.data.data); // { followers: N, following: N }
  };
  fetchSocialCounts();
}, [tapestryUserId]);

// In render:
<div className="grid grid-cols-2 gap-4">
  <div>
    <div className="text-2xl font-bold text-gold-500">{socialCounts.followers}</div>
    <div className="text-sm text-gray-400">Followers</div>
  </div>
  <div>
    <div className="text-2xl font-bold text-gold-500">{socialCounts.following}</div>
    <div className="text-sm text-gray-400">Following</div>
  </div>
</div>
```

**Test:** Profile loads, shows follower/following counts, no 404 errors

---

### [ ] 3. Profile Page — Teams on Tapestry Section (1 hour)

**File:** `frontend/src/pages/Profile.tsx`

**What to add:**
- In "Teams" tab, show teams with "✓ On Tapestry" badge
- Add link: "View on Tapestry Explorer"
- Link format: `https://explorer.usetapestry.dev/content/foresight-team-{userId}-{contestId}`

**Code template:**
```tsx
{teams.map(team => (
  <div key={team.id} className="border border-gold-500/20 rounded-lg p-4 mb-3">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold text-white">{team.team_name}</h4>
        <p className="text-sm text-gray-400">Score: {team.total_score} pts</p>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-gold-500" />
        <span className="text-xs text-gold-400">On Tapestry</span>
      </div>
    </div>
    <a href={`https://explorer.usetapestry.dev/content/foresight-team-${userId}-${team.contest_id}`}
       target="_blank"
       rel="noopener noreferrer"
       className="text-sm text-gold-500 hover:text-gold-400">
      View on Tapestry Explorer →
    </a>
  </div>
))}
```

**Test:** Teams tab shows teams with Tapestry badge, links work, explorer opens in new tab

---

### [ ] 4. Home Page — Tapestry Intro Section (1 hour)

**File:** `frontend/src/pages/Home.tsx`

**What to add:**
- After hero section, add "Built on Tapestry" section
- 3 feature cards: On-chain Teams, Social Graph, Verifiable Scores
- Keep copy simple (no crypto jargon)

**Code template:**
```tsx
<section className="py-12 px-4 md:px-8">
  <h2 className="text-3xl font-bold text-center mb-8 text-white">Built on Tapestry</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
    <div className="bg-gradient-to-br from-gold-500/10 to-transparent border border-gold-500/30 rounded-lg p-6">
      <Shield className="w-8 h-8 text-gold-500 mb-4" />
      <h3 className="font-semibold text-white mb-2">Teams Are Permanent</h3>
      <p className="text-sm text-gray-400">Your draft is stored on Solana. No app can take it away.</p>
    </div>
    <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30 rounded-lg p-6">
      <CheckCircle className="w-8 h-8 text-cyan-500 mb-4" />
      <h3 className="font-semibold text-white mb-2">Scores Are Verifiable</h3>
      <p className="text-sm text-gray-400">Every point is locked on-chain. Proof you understand CT.</p>
    </div>
    <div className="bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/30 rounded-lg p-6">
      <Share className="w-8 h-8 text-emerald-500 mb-4" />
      <h3 className="font-semibold text-white mb-2">Data Is Yours</h3>
      <p className="text-sm text-gray-400">Your profile works across Tapestry apps. Composability.</p>
    </div>
  </div>
</section>
```

**Test:** Home page displays 3 cards, layout responsive on mobile, no styling breaks

---

### [ ] 5. Leaderboard — Team Preview with Tapestry Badge (1.5 hours)

**File:** `frontend/src/pages/Compete.tsx`

**What to add:**
- When hovering leaderboard entry, show popover with team formation + "✓ On Tapestry"
- Add "View on Tapestry" link to popover
- Show mini formation (captain + 4 tiers)

**Code template:**
```tsx
{leaderboard.map(entry => (
  <div key={entry.userId}
       onMouseEnter={() => setHoveredUserId(entry.userId)}
       onMouseLeave={() => setHoveredUserId(null)}
       className="hover:bg-gray-800/50 p-3 rounded cursor-pointer relative">

    <div className="flex justify-between items-center">
      <span className="text-gold-500 font-bold">{entry.rank}</span>
      <span className="text-white font-semibold">{entry.username || 'Anonymous'}</span>
      <span className="text-gray-400">{entry.score} pts</span>
    </div>

    {hoveredUserId === entry.userId && (
      <div className="absolute top-12 left-0 z-50 bg-gray-900 border border-gold-500/30 rounded-lg p-4 min-w-80">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-gold-500" />
          <span className="text-xs text-gold-400">Published to Tapestry</span>
        </div>

        {/* Mini formation preview */}
        <FormationPreview team={entry.team} size="sm" />

        {/* Explorer link */}
        <a href={`https://explorer.usetapestry.dev/content/foresight-team-${entry.userId}-${contestId}`}
           target="_blank"
           rel="noopener noreferrer"
           className="text-xs text-gold-500 hover:text-gold-400 mt-3">
          View on Tapestry Explorer →
        </a>
      </div>
    )}
  </div>
))}
```

**Test:** Hover any leaderboard entry, popover appears, explorer link works, formation displays correctly

---

### [ ] 6. Draft Page — Success Toast (0.5 hours)

**File:** `frontend/src/pages/Draft.tsx`

**What to add:**
- When team submit succeeds, show toast with Tapestry confirmation
- Include messaging: "Published to Tapestry Protocol" + immutability statement

**Code template:**
```tsx
// After successful team submission:
const showSuccessToast = () => {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 z-50 bg-green-900/30 border border-green-500 rounded-lg p-4 max-w-sm';
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
      <div>
        <p class="font-semibold text-green-400">Team Submitted Successfully</p>
        <p class="text-sm text-gray-400">✓ Published to Tapestry Protocol</p>
        <p class="text-xs text-gray-500 mt-1">Your team is immutable and verifiable on Solana.</p>
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
};
```

**Alternative:** Use existing toast context if available.

**Test:** Submit team, toast appears, closes after 5 seconds, messaging is clear

---

### [ ] 7. Tapestry Explorer Link Integration (1 hour)

**File:** Create/update `frontend/src/utils/tapestry.ts`

**What to add:**
- Helper function to generate explorer URLs
- Consistent formatting across all pages

**Code template:**
```typescript
// frontend/src/utils/tapestry.ts
export const getTapestryExplorerUrl = (contentId: string): string => {
  return `https://explorer.usetapestry.dev/content/${contentId}`;
};

export const getTeamContentId = (userId: string | number, contestId: string | number): string => {
  return `foresight-team-${userId}-${contestId}`;
};

export const getScoreContentId = (userId: string | number, contestId: string | number): string => {
  return `foresight-score-${userId}-${contestId}`;
};

export const getTapestryExplorerLink = (contentId: string): string => {
  return getTapestryExplorerUrl(contentId);
};
```

**Import everywhere:**
```tsx
import { getTapestryExplorerUrl, getTeamContentId } from '../utils/tapestry';

const explorerUrl = getTapestryExplorerUrl(getTeamContentId(userId, contestId));
```

**Test:** All links use consistent format, no broken URLs

---

## Phase 2: Polish & Testing (2 hours)

### [ ] 8. End-to-End Flow Test

**Test sequence:**
1. Load app on fresh browser (incognito)
2. Click "Start Playing"
3. Auth with email/Google
4. See Tapestry badge on first load ✓
5. Go to Draft
6. Pick 5 people
7. Submit
8. See toast: "Published to Tapestry" ✓
9. Redirect to leaderboard
10. Hover a team, see popover + explorer link ✓
11. Go to Profile
12. See Tapestry badge ✓
13. See follower/following counts ✓
14. See Teams with "On Tapestry" badge ✓
15. Click explorer link, verify it loads

**Log:** Take screenshot of each step. Document any bugs.

---

### [ ] 9. Mobile Responsive QA

**Test on iPhone 12:**
1. Home page displays 3 feature cards vertically ✓
2. Leaderboard popover doesn't overflow screen ✓
3. Draft page responsive ✓
4. Profile page responsive ✓
5. Tapestry badges visible and legible ✓

**Fix:** Add `md:` breakpoints if needed, adjust spacing for small screens.

---

### [ ] 10. Console Error Audit

**Before submission:**
```bash
# In browser dev tools, check console:
# - No red errors ✓
# - No yellow warnings ✓
# - No 404s for API calls ✓
```

**Common issues to check:**
- Missing API_URL env var
- Tapestry API key not set (should gracefully skip, not error)
- Form submission errors (catch and display as toast)
- Image 404s (avatars, icons)

---

## Phase 3: Demo Video (1 hour)

### [ ] 11. Record Walkthrough

**Setup:**
- Clear desktop (no notifications)
- Zoom to 1.5x (bigger for judges to see)
- Open in incognito (fresh state)
- Slow internet simulation (DevTools throttling)

**Script:**
```
[0:00] Landing page with formation hero
"This is Foresight..."

[0:15] Click "Start Playing"
[Privy modal]

[0:25] Auth flow (use test account)

[0:35] Draft page appears
"You draft 5 influencers..."

[0:50] Select team
[Click submit]

[1:00] Toast appears: "Published to Tapestry"
"Your team is now stored on Tapestry..."

[1:15] Redirect to leaderboard
"Here are 2,847 players competing..."

[1:25] Hover over a player
"Every team on this leaderboard is verified..."

[1:35] Go to profile
"Your profile aggregates all your Foresight data..."

[1:45] Show Tapestry badge + social counts + teams

[1:55] Close
"That's Foresight on Tapestry."
```

**Record tips:**
- Do 5 practice runs first
- Record in 1080p
- Speak clearly
- Move mouse slowly (judges need to follow)
- Leave 2-3 sec between actions

---

## FINAL CHECKLIST BEFORE SUBMISSION

- [ ] All 7 feature areas implemented
- [ ] All links working (explorer URLs valid)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] End-to-end flow tested (5 times)
- [ ] Demo video recorded and tested
- [ ] Profile page Tapestry integration working
- [ ] Leaderboard popover working
- [ ] Draft success toast working
- [ ] Home page intro section visible
- [ ] All Tapestry API calls authenticated
- [ ] Backup video recorded (in case first one fails)
- [ ] GitHub repo clean
- [ ] `.env.example` updated
- [ ] README mentions Tapestry integration
- [ ] Deployment tested on production

---

## Troubleshooting

**Problem:** Tapestry API calls return 401
**Solution:** Check `TAPESTRY_API_KEY` env var in backend. Make sure it's set before starting server.

**Problem:** Social counts show 0 forever
**Solution:** Check if Tapestry profile ID is correct. Verify with `GET /api/v2/fs/me` to see `tapestryUserId`.

**Problem:** Explorer links 404
**Solution:** Verify content ID format is `foresight-team-{userId}-{contestId}`. Check Tapestry explorer directly at https://explorer.usetapestry.dev

**Problem:** Popover doesn't show on hover
**Solution:** Check z-index. Add `z-50` to popover div. Ensure parent isn't `overflow: hidden`.

**Problem:** Toast doesn't appear
**Solution:** Check if toast element is appended to body. Verify CSS classes exist. Check z-index.

---

## Time Tracking

| Task | Est. | Actual | Status |
|------|------|--------|--------|
| 1. Profile badge | 30 min | — | ⏳ |
| 2. Social counts | 1 hr | — | ⏳ |
| 3. Teams list | 1 hr | — | ⏳ |
| 4. Home intro | 1 hr | — | ⏳ |
| 5. Leaderboard popover | 1.5 hrs | — | ⏳ |
| 6. Draft toast | 0.5 hrs | — | ⏳ |
| 7. Explorer helper | 1 hr | — | ⏳ |
| **Subtotal (MVP)** | **6 hrs** | — | |
| 8. E2E testing | 1 hr | — | ⏳ |
| 9. Mobile QA | 0.5 hrs | — | ⏳ |
| 10. Console audit | 0.5 hrs | — | ⏳ |
| **Subtotal (Polish)** | **2 hrs** | — | |
| 11. Demo video | 1 hr | — | ⏳ |
| **Grand Total** | **9 hrs** | — | |

---

## Next Steps

1. Start with #1 (Profile badge) — 30 min, high ROI
2. Batch #2-3 (Profile social/teams) — 2 hours
3. Do #4 (Home) — 1 hour
4. Do #5 (Leaderboard) — 1.5 hours
5. Do #6-7 (Draft + helper) — 1.5 hours
6. Test everything (#8-10) — 2 hours
7. Record video (#11) — 1 hour

**Target completion:** Feb 23 EOD

---

*Last updated: Feb 22, 2026. Update as you progress.*
