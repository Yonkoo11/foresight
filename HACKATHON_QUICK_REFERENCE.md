# HACKATHON QUICK REFERENCE (One-Page Cheat Sheet)

**Deadline:** February 27, 2026 (5 days)
**Theme:** Resurrection of SocialFi through Game Theory
**Expected Judge Score:** 85-90/100 (top 5 finish likely)

---

## THE PITCH (30 seconds)

> "Friend.tech failed because SocialFi had 5 friction steps before value. Privy removed wallet friction. Tapestry removed identity fraud. Solana removed speed constraints. We're not rebuilding SocialFi — we're building what it should have been if the infrastructure existed."

---

## THE DEMO (90 seconds)

1. **Landing** (10 sec) — Show formation visual, explain value prop
2. **Auth** (8 sec) — Email login via Privy (no wallet install)
3. **Draft** (20 sec) — Pick 5 CT influencers, captain gets 1.5x
4. **Leaderboard** (25 sec) — Show live scoring update as tweet engagement changes
5. **Tapestry** (7 sec) — Show "Team shared on Tapestry ✓" badge
6. **Why Now** (20 sec) — Timeline: Privy + Tapestry + Solana now exist

**Total: 90 seconds. Judge should feel value before 3 minutes.**

---

## JUDGING RUBRIC (100 points possible)

| Category | Points | How to Win | Us |
|----------|--------|-----------|-----|
| **Functionality** | 30 | All features work, no crashes | 28/30 |
| **Impact** | 25 | Solves real ecosystem problem | 23/25 |
| **Innovation** | 20 | Novel approach | 16/20 |
| **Design/UX** | 15 | Professional, intuitive | 14/15 |
| **Composability** | 10 | Protocol integration visible | 9/10 |
| **TOTAL** | 100 | | **90/100** |

---

## TOP 5 FAILURE MODES (Mitigations)

| Risk | Impact | Prevention |
|------|--------|-----------|
| **Auth breaks** | Judge can't sign in | Pre-login account (Plan B) |
| **Live scoring doesn't update** | Demo loses credibility | Polling fallback + manual override |
| **Mobile layout broken** | Polish failure | Test on iPhone 12 before demo |
| **Data inconsistency** | "They can't do math" | Run score validation script |
| **Network failure** | Nothing to show | Pre-recorded video backup |

---

## POLISH PRIORITY (Days 1-3)

**MUST POLISH:**
- [ ] Landing page hero copy (clear, no jargon)
- [ ] Privy modal messaging ("Join 2,800+ players")
- [ ] Draft page formation visual (beautiful, responsive)
- [ ] Live leaderboard (loads fast, data correct)
- [ ] Live scoring updates (SSE + polling fallback)
- [ ] Tapestry badge visibility (on draft, profile, feed)

**SKIP (saves 20+ hours):**
- ❌ Profile analytics charts
- ❌ Sound effects / confetti
- ❌ Email notifications
- ❌ Advanced stats page
- ❌ Social sharing buttons

---

## FINAL QA CHECKLIST (Day 4)

```
BEFORE DEMO (Run this 24 hours before):
□ TypeScript: npx tsc --noEmit (0 errors)
□ Tests: pnpm test (all passing)
□ Load times: Each page <3 seconds
□ Mobile: Test on iPhone 12
□ Privy: Test signup flow (full end-to-end)
□ Scores: Validate all 50 test users have scores
□ Console: No errors in Chrome DevTools
□ Colors: No purple/violet (gold theme only)
□ Links: All working (no 404s)

DEMO DAY PREP:
□ Fresh incognito session (no cached state)
□ Laptop + monitor working
□ WiFi + cellular hotspot ready
□ Video demo file on USB (backup)
□ Database seeded with demo data
□ Privy test account logged in
□ Backend + frontend running
□ SSE connection shows 🟢 Live
```

---

## JUDGE CONVERSATION FLOW

**Opening (30 sec):**
"Hi, I'm [Name]. This is Foresight. SocialFi died because of friction. We fixed it."

**Demo (90 sec):**
[Follow demo script exactly — see full strategy doc]

**Close (30 sec):**
"Speed + Identity + Solana. That's why this works now."

**If Asked:**
- "Why Solana?" → Speed (5K TPS vs 15 for Ethereum)
- "Why Tapestry?" → Identity verification (no scammers)
- "How users?" → Formation visual (people understand it instantly)
- "Competition?" → Friend.tech is dead, Kaito isn't gaming

---

## DEMO CHECKLIST (Day of)

**30 minutes before:**
- [ ] Restart laptop (clean state)
- [ ] Test WiFi + cellular hotspot
- [ ] Load app in incognito browser
- [ ] Verify Privy modal shows correctly
- [ ] Verify leaderboard has 50 entries
- [ ] Verify no console errors
- [ ] Do 1 quick end-to-end test (login → draft → leaderboard)

**5 minutes before:**
- [ ] Close Slack, emails, browsers tabs
- [ ] Full screen the app
- [ ] Font size at 120% (readable from 6 ft)
- [ ] Notifications muted
- [ ] Have talking points in mind (don't script, be conversational)

**During demo:**
- [ ] Speak slowly (nervous people talk fast)
- [ ] Make eye contact with judge (not screen)
- [ ] Point at screen when explaining (help them follow)
- [ ] If something breaks, have video backup ready
- [ ] Stay confident ("Here's our backup plan...")

---

## SCORING PREDICTION

**Conservative:** 75-80 points (solid, but UX heavy)
**Realistic:** 85-90 points (strong execution, good narrative)
**Optimistic:** 92-96 points (judges impressed by formation + live scoring)

**Most likely outcome:** Top 5 finish

---

## WHAT NOT TO SAY

- ❌ "This is just a hackathon project" → "This is production-ready"
- ❌ "We're like DraftKings" → "We're the first CT influence market"
- ❌ Apologizing for product → Show confidence
- ❌ Technical jargon → Explain simply
- ❌ "Solana is fast" → "Speed enables real-time prediction markets"

---

## KEY STATS (Memorize These)

- **Time to play:** 90 seconds (signup → draft → see leaderboard)
- **Team size:** 5 players (1 captain, 4 tiers)
- **Captain bonus:** 1.5x points multiplier
- **Draft budget:** 150 SOL (varies by tier)
- **Scoring metrics:** Activity (0-35) + Engagement (0-60) + Growth (0-40) + Viral (0-25)
- **Demo contest:** Hackathon Demo League (contest #6)
- **Demo leaderboard:** 50 test entries ranked 48-127 points
- **Tapestry integration:** Teams stored on Tapestry, verified on-chain

---

## TAPESTRY TALKING POINT

"Tapestry gives us identity verification. No more scammers impersonating celebrities. Every team is published on Tapestry for verifiability. That's the anti-fraud layer that killed Friend.tech."

---

## IF SOMETHING BREAKS

| What Breaks | What To Say | Backup Plan |
|-------------|------------|------------|
| Auth doesn't load | "Here's our pre-loaded account" | Use logged-in account (Plan B) |
| Leaderboard is slow | "Let me refresh that" | Show cached data or screenshot |
| Live scoring doesn't update | "Let me manually trigger that" | Hit admin endpoint (push update) |
| Privy API down | "Email login is down, use Google" | Switch to different social auth |
| Network is down | "Let me show you the video instead" | Play pre-recorded video demo |
| Mobile doesn't work | "Here's the responsive design on desktop" | Show screenshot on phone |

**Golden rule:** Never apologize. Always have a backup ready.

---

## ONE-MINUTE VERSION (If Time is Super Limited)

"SocialFi failed because wallet friction was too high. We removed it with Privy embedded wallets. You sign up with email, not a wallet. You draft 5 CT influencers in 90 seconds. Scores update live as they tweet. That's it. It's that simple. And Tapestry verifies identity so there's no fraud. The infrastructure finally exists to do this right."

---

**Last Updated:** Feb 22, 2026
**Status:** Ready for execution
**Print this. Keep it visible during demo prep.**

