# Foresight — Progress

## Current Status: Security Audit Complete (Mar 1, 2026)

### Security Audit — COMPLETE
Branch: `audit/security-review` (ready for merge to main)

**Scope:** Full security audit before going live — automated scanning + manual review + browser testing.

**Results:** 45 findings total, 43 fixed/mitigated, 2 accepted risks.

#### Key Security Fixes
- **httpOnly cookies** — JWTs stored in httpOnly cookies, no more localStorage
- **CSRF protection** — double-submit cookie pattern on all mutation endpoints
- **15-min access tokens** — with 30-day httpOnly refresh tokens and auto-refresh
- **Independent ENCRYPTION_KEY** — decoupled from JWT_SECRET to prevent data loss on rotation
- **Logout always clears cookies** — even with expired tokens or stale CSRF
- **Retry backoff** — usePrivyAuth retries max 3x with exponential backoff (2s/4s/8s)
- **Refresh cookie path broadened** — `/` instead of `/api/auth/refresh` for proxy compatibility

#### Browser-Tested Auth Flow
- Login → httpOnly cookies set correctly (accessToken, refreshToken, csrf-token)
- Token expiry → auto-refresh via apiClient interceptor → 200 retry
- Logout → all 3 cookies cleared, session deleted
- CSRF → mutations blocked without matching X-CSRF-Token header

#### Commits on audit branch
- `a58ed6b` audit: fix FINDING-006,007,010,021 — httpOnly cookies, CSRF, JWT hardening
- `2a755e0` fix: decouple ENCRYPTION_KEY from JWT_SECRET
- `0b73895` fix: logout now always clears cookies even with expired tokens
- `4d4b783` harden: broaden refresh cookie path + add retry backoff

#### Known Issues (pre-existing, not security)
- Frontend `vite build` fails due to WalletConnect peer dep mismatch (pre-existing on main)
- Settings.tsx:127 returns 404 on `/api/auth/me` (pre-existing wrong endpoint call)

---

## Previous: SEO + Settings Revamp (Mar 1, 2026)

### Settings Page Revamp — DONE
Rewrote `frontend/src/pages/Settings.tsx`:
- Removed dead Twitter OAuth section (Coming soon, verify-follow, verify-tweet — all non-functional)
- Added **Linked Accounts** card using Privy's `useLinkAccount` hook
  - Wallet row: shows connected Solana wallet
  - Twitter row: Link/Unlink via Privy OAuth (requires X Developer Console setup)
  - Email row: Link/Unlink via Privy email modal
- Unlink disabled when only 1 account linked (prevents lockout)
- Removed full-screen loading spinner that blocked page render
- Matches gold/dark design system

### Formation Preview Update — DONE
Updated `frontend/src/components/FormationPreview.tsx`:
- Added grass texture pitch background (CSS-only, no images)
- Diamond formation layout: captain top, wide mid row, tight bottom row
- Gold pitch lines (circle, center dot, half line, goal arcs)

### SEO Implementation — DONE
**Problem:** Links shared on X showed no preview card. No robots.txt or sitemap.

**Files created:**
- `frontend/public/robots.txt` — allows all crawlers, references sitemap
- `frontend/public/sitemap.xml` — 11 public routes with priorities
- `frontend/src/components/SEO.tsx` — reusable Helmet component for per-route meta tags

**Files modified:**
- `frontend/index.html` — optimized title/description/keywords, added JSON-LD structured data
- `frontend/src/App.tsx` — added HelmetProvider wrapper, react-helmet-async import
- 11 page files — added per-route `<SEO>` with unique title/description/keywords:
  Home, Compete, Intel, Profile, Progress, Settings, Referrals, Terms, Privacy, Cookies, Imprint

**Keywords targeted:** crypto fantasy sports, CT fantasy league, solana fantasy game, draft crypto influencers, web3 fantasy sports, crypto twitter game

**Skipped (not needed for SEO):** CardCompare (internal design tool), Draft (auth-gated), ContestDetail (dynamic)

### Twitter Handle — UNIFIED TO @ForesightCT (placeholder)
All 10 references across frontend + backend now use `@ForesightCT`.
X account not yet created — happening tomorrow. Once created, if a different handle is chosen,
search-and-replace `@ForesightCT` across the entire repo. There's also a `TODO` comment in `index.html` line 46.

### Known Issues — USER ACTION NEEDED
1. **Create X account** — `@ForesightCT` is the placeholder handle everywhere. Create it tomorrow, then update if handle differs.
2. **X Developer Console** — Twitter account linking in Settings requires OAuth 2.0 app configured in Privy dashboard (Client ID + Client Secret from developer.x.com). Callback URL: `https://auth.privy.io/api/v1/oauth/callback`
3. **OG card on X** — after deploying, validate by pasting `https://ct-foresight.xyz` in an X compose box. If cached blank, wait ~24hrs for X to re-crawl.
4. **react-helmet-async** peer dep warns for React 19 (works fine, cosmetic only)

### Commits
- `96099b9` feat: Settings linked accounts + grass pitch formation background

---

## Previous: QA Complete (Feb 28, 2026)

### End-to-End Contest Lifecycle QA — PASSED

Full lifecycle tested on production (`ct-foresight.xyz` / Railway backend):

#### Lifecycle Transitions
- [x] `open` → user can enter via Draft page (Contest #8, Entry #28)
- [x] Entry stored correctly (team_ids=[68,67,98,57,66], captain_id=68)
- [x] `open` → `locked` at lock_time (via `POST /api/admin/trigger-prized-lock`)
- [x] `locked` → `scoring` → `finalized` at end_time (via `POST /api/admin/trigger-prized-scoring`)
- [x] `open` → `cancelled` when player_count < min_players (Contest #10)

#### Scoring
- [x] Scores are non-zero and reasonable (673.51 total)
- [x] Captain gets **2.0x** multiplier (base 122.53 → final 245.05)
- [x] Rankings correct (highest score = rank 1)
- [x] Fallback scoring works (deterministic formula from influencer table when no snapshots)

#### Prize Distribution
- [x] Prizes distributed per `prize_distribution_rules` (50% of 0.05 SOL = 0.025 SOL for rank 1)
- [x] Prize claim works via UI modal ("Prize Claimed! $1.96 is now in your wallet")
- [x] Solana transaction hash stored: `PmZSeCfoP4Wy5FejHMJ5x8TCX7G11mAjtnHHU2ThbN8q...`
- [x] Frontend shows "Confirmed on Solana" with View link

#### Edge Cases
- [x] Double entry → "You have already entered this contest" (or weekly limit)
- [x] Second free league same week → "You have already entered a free league this week"
- [x] Invalid team size (4) → "Team must have exactly 5 influencers"
- [x] Captain not in team → "Captain must be one of the team members"
- [x] Double claim → "Prize has already been claimed"
- [x] Enter finalized contest → "Contest is not open for entries"
- [x] 0 entries at lock_time → Status → `cancelled`

#### Tapestry Integration
- [ ] `storeTeam()` on entry — code exists, needs verification with Tapestry API configured
- [ ] `storeScore()` on finalization — code exists, fires async

### Bug Found & Fixed
1. **Missing prize rules for small contests**: `prize_distribution_rules` only covered 10+ players.
   - Added migration `20260228000001_small_contest_prize_rules.ts` for 1-9 players (50/30/20%)
   - Fixed min_players from 2→1 in `20260228000002_fix_small_contest_min_players.ts`

### New Admin Endpoints Added
- `GET /api/admin/contests/:id/raw` — Raw DB row + entries for any contest
- `PATCH /api/admin/contests/:id` — Update contest settings (lock_time, end_time, min_players, status, etc.)
- `POST /api/admin/trigger-prized-lock` — Trigger contest locking cron
- `POST /api/admin/trigger-prized-scoring` — Trigger contest scoring cron
- `POST /api/admin/trigger-contest-finalization` — Trigger quest finalization cron

### Commits
- `a80bf56` feat: add admin endpoints for contest lifecycle QA testing
- `b7da17d` feat: add prize distribution rules for small contests (2-9 players)
- `fe9318e` fix: set min_players to 1 for small contest prize rules
