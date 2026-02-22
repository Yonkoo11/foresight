# Tapestry Bounty Strategy - Hackathon Winning Plan

> **Deadline:** February 27, 2026 (Solana Graveyard Hack)
> **Prize:** $5,000 ($2.5K first place)
> **Status:** Foundation ready, execution plan below

---

## EXECUTIVE SUMMARY

**Thesis:** Foresight is perfectly positioned to win the Tapestry bounty because:

1. ✅ **Real Use Case** - Not a toy, addresses genuine fantasy sports need
2. ✅ **Proper Tapestry Integration** - Teams & scores stored as immutable content
3. ✅ **Multiple Features** - Profiles, content, (optional) social graph
4. ✅ **Polish & Demo** - Professional design + smooth onboarding
5. ✅ **Onchain Value Prop** - Scores are verifiable across ecosystem

**Our Advantage:** Tapestry is made for **social data infrastructure**. We're using it exactly that way.

---

## WHAT JUDGES WANT

### Evaluation Criteria (Inferred from Tapestry Focus)

1. **Correct Integration** (40%)
   - Uses socialfi SDK properly
   - Data stored with proper execution methods
   - Namespacing correct
   - Keys/values structured well

2. **Innovation** (30%)
   - Novel data structure (how you model teams/scores)
   - Composability thinking (could other apps use your scores?)
   - Real problem solved (not just demo data)

3. **Polish** (20%)
   - Smooth UX/no crashes
   - Error handling works
   - Code quality good
   - Video/repo presentation clean

4. **Demo Narrative** (10%)
   - Clear story of why Tapestry matters
   - Shows immutability/verification
   - Highlights composability benefits

---

## WHAT WE'LL SHOW IN THE DEMO

### 3-Minute Video Walkthrough

```
[0:00] Intro
"Foresight - Fantasy sports for Crypto Twitter, powered by Tapestry"

[0:15] Signup with Wallet
- User connects wallet via Privy
- Backend auto-creates Tapestry profile
- "Your identity on Solana is ready"

[0:30] Draft Team
- Visual formation builder
- Select 5 influencers
- Show: "1x Captain = 1.5x multiplier"
- Click "Submit Team"
- Show: "Team stored on Tapestry ✓"
- Confirm: "Immutable, verifiable, composable"

[1:00] Wait for Contest Close
- Show mock leaderboard
- Teams ranked by score
- User's team in position

[1:15] View Final Score
- Total: 245 points
- Breakdown: Activity (50), Engagement (95), Growth (60), Viral (40)
- Show: "Score stored on Tapestry ✓"
- Mention: "Proof is verifiable on Solana"

[1:30] (Optional) Show Achievement
- "Won Contest #5!"
- Stored as Tapestry content
- Follows player across apps

[1:45] Close Out
"Foresight shows how fantasy sports + social data protocol = next-gen gaming"
"Every score is an asset. Every team is a badge. On Tapestry."

[2:00] End
```

### Live Demo Walkthrough (If Time)

**During presentation, show:**
1. Live signup (30 seconds)
2. Profile created automatically
3. Quick draft team (20 seconds)
4. Submit shows "Stored on Tapestry"
5. Navigate to profile
6. Show "Teams & Scores" section
7. Explain Tapestry integration

**Key talking points:**
- "Traditional fantasy sports keep data in centralized DB. Foresight puts it onchain."
- "Each team is immutable. Each score is verifiable."
- "This data could feed a leaderboard in another Tapestry app."
- "We're building infrastructure for social games on Solana."

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Ensure Tapestry Integration is Working (TODAY)

- [ ] Test `findOrCreateProfile` with real wallet
- [ ] Verify profile appears in Tapestry explorer
- [ ] Test `storeTeam` with sample data
- [ ] Confirm team content visible in explorer
- [ ] Test `storeScore` with different execution methods
- [ ] Check score content on explorer

**Do this by:** Feb 23 EOD

### Phase 2: Add UI/UX Polish (Feb 23-24)

- [ ] Show "Profile created on Tapestry" toast after signup
- [ ] Show "Team stored on Tapestry" after draft submission
- [ ] Show "Score locked on Tapestry" after contest close
- [ ] Add Tapestry logo/branding in appropriate places
- [ ] Add tooltip explaining "what does immutable mean?"
- [ ] Add link to view on Tapestry explorer (optional)

**Do this by:** Feb 24 EOD

### Phase 3: Record Video (Feb 24-25)

- [ ] Script final 3-minute walkthrough
- [ ] Do practice run-throughs (3-5 times)
- [ ] Record on clean desktop/mobile
- [ ] Edit: Add captions, intro/outro
- [ ] Add subtle background music (optional)
- [ ] Test audio/video quality
- [ ] Upload to YouTube (unlisted or public)

**Do this by:** Feb 25 EOD

### Phase 4: GitHub & Submission (Feb 25-26)

- [ ] Ensure GitHub repo is clean
- [ ] Write clear README with:
  - What it does
  - How to run locally
  - How Tapestry is integrated
  - API keys needed
- [ ] Commit history shows logical progression
- [ ] Add `.env.example` with all variables needed
- [ ] Deploy to live URL (Vercel/Railway)
- [ ] Test live deployment works
- [ ] Create submission form:
  - Live demo link
  - GitHub repo link
  - Video link
  - Team members
  - Description (2-3 sentences)

**Do this by:** Feb 26 EOD

### Phase 5: Final QA (Feb 26-27)

- [ ] Full end-to-end test: signup → draft → leaderboard
- [ ] Check no console errors
- [ ] Verify Tapestry integration works (check explorer)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile
- [ ] Fix any bugs found
- [ ] Submit before deadline

**Do this by:** Feb 27 11:59 PM UTC

---

## KEY FEATURES FOR DEMO

### Must-Have
- ✅ User signup with wallet
- ✅ Tapestry profile auto-created
- ✅ Draft team creation
- ✅ Team stored as Tapestry content
- ✅ Leaderboard
- ✅ Score stored as Tapestry content

### Nice-to-Have
- ☐ Tapestry explorer link
- ☐ Achievement system
- ☐ Player follows (optional social layer)
- ☐ Verify score on-chain button
- ☐ Tapestry branding/logo

### Don't Include
- ✗ Real Twitter data fetching (use mock)
- ✗ Real prize distribution
- ✗ Complex admin panels
- ✗ Anything not core to Tapestry story

---

## MESSAGING FOR JUDGES

### The Pitch

**Problem:** "Fantasy sports games and leaderboards are isolated islands. Your data is locked in each platform."

**Solution:** "Tapestry enables us to store all player data onchain. Teams, scores, achievements become portable assets."

**Impact:** "Players own their data. They can take their Foresight profile to other Tapestry apps. Composability."

**Why Now:** "Solana's speed + Tapestry's architecture makes this possible for the first time."

### One-Liner
*"Foresight brings fantasy sports into the Tapestry social graph - every team a verified asset, every score a portable achievement."*

### For Judges (Emphasis Points)

**"This correctly uses Tapestry because..."**
- Teams are content (contentType=ACHIEVEMENT, properties describe structure)
- Scores are content (updateable, verifiable)
- Profiles are linked to wallets (composable identity)
- Namespace is unique to Foresight (no collisions)

**"Judges should care because..."**
- This is a real use case (fantasy sports is huge)
- Multiple Tapestry features used (profiles, content, maybe follows)
- Data structure is reusable (other game devs could copy)
- Polish is high (not a cobbled-together demo)

---

## RISK MITIGATION

### Risk 1: Tapestry Integration Fails During Live Demo
**Mitigation:**
- Pre-record video walkthrough (fallback)
- Prepare pre-made Tapestry profile IDs (for live demo)
- Have offline demo ready (screenshots)
- Test API 2 hours before presentation

### Risk 2: API Key Gets Leaked
**Mitigation:**
- Create demo API key (separate from prod)
- Never commit API keys to GitHub
- Use environment variables
- Rotate keys after hackathon

### Risk 3: Content Takes Too Long to Appear in Explorer
**Mitigation:**
- Use `CONFIRMED_AND_PARSED` execution (slower but verifiable)
- Or show pending state in UI
- Mention "content is immediately available, explorer syncs every 5 min"

### Risk 4: Other Teams Also Use Tapestry
**Mitigation:**
- Our polish is better (design, UX)
- Our use case is stronger (real game)
- Our narrative is clearer (immutability value prop)
- Our code is cleaner (GitHub shows good engineering)

---

## SCORING OUR POSITION

### Evaluation Component | Foresight Score
- **Tapestry API Usage** | 9/10 (proper integration, multiple features)
- **Innovation** | 8/10 (new application domain, verifiable scores)
- **Polish** | 9/10 (design system, smooth UX)
- **Demo Narrative** | 8/10 (clear composability story)
- **Code Quality** | 8/10 (TypeScript, tests, clean)
- **Completeness** | 9/10 (all core features work)

**Expected Ranking:** Top 2-3 in Tapestry track

**Winning Advantage:** Most polished entry + clearest narrative + real use case

---

## VIDEO RECORDING TIPS

### Technical Setup
- **Resolution:** 1920x1080 minimum (4K better)
- **Framerate:** 30fps minimum, 60fps better
- **Audio:** Clear voice (use good microphone)
- **Lighting:** Well-lit screen, no glare

### During Recording
- **Slow down:** Actions should be clear (not 2x speed)
- **Narrate:** Explain what you're doing ("Now creating profile...")
- **Pauses:** Leave 1-2 sec between steps
- **Confidence:** Speak clearly and confidently
- **Enthusiasm:** Show you believe in the project

### Editing
- **Add text overlays:** "Team submitted", "Score stored"
- **Show key moments:** Team draft, leaderboard, score display
- **Music:** Optional, subtle background (no copyright issues)
- **No cuts/jumps:** Smooth transitions
- **Runtime:** Exactly 3 minutes or under

### Example Structure
```
[0:00-0:10] Intro/Title Card
[0:10-0:30] Signup & Profile
[0:30-1:15] Draft Team
[1:15-1:45] Leaderboard & Score
[1:45-2:00] Tapestry Integration Highlight
[2:00-2:30] Closing Statement
[2:30-3:00] Credits/Call-to-Action
```

---

## GITHUB PRESENTATION

### README Structure
```markdown
# Foresight - Fantasy Sports on Tapestry

## Overview
Brief description of app

## The Tapestry Integration
- How profiles are created
- How teams are stored
- How scores are verified
- Link to explorer (optional)

## Getting Started
- Prerequisites
- Installation
- Environment variables
- Running locally

## Architecture
- Frontend tech stack
- Backend tech stack
- Database schema
- Tapestry integration points

## Demo
- Video link
- Live link
- Screenshots

## Team
- Names and roles
```

### Commit History
```
Initial project setup
Add Privy authentication
Add Tapestry profile integration
Add team draft UI
Add Tapestry content storage
Add leaderboard
Add score calculation and storage
Polish UI/UX
Fix bugs and add error handling
Final submission ready
```

**Takeaway:** Commit history shows logical progression, not last-minute chaos.

---

## SUBMISSION FORM TEMPLATE

```
Project Name: Foresight

Category: Tapestry Bounty

Team Members: [Names, 1-5 people]

GitHub Repo: https://github.com/[user]/foresight

Live Demo: https://foresight.vercel.app/

Video Walkthrough: https://youtube.com/watch?v=[id]

Description (2-3 sentences):
"Foresight is a fantasy sports game for Crypto Twitter influencers built entirely on Tapestry.
Players draft teams, earn points based on influencer activity, and compete for prizes.
Every team and score is stored as immutable Tapestry content, enabling composable gameplay."

Why Tapestry:
"We chose Tapestry because it solves a fundamental problem: game data is usually centralized.
With Tapestry, player profiles, teams, and scores become portable assets that follow
them across the Solana ecosystem, creating genuine composability in gaming."
```

---

## SUCCESS METRICS

**Target Results:**
- ✓ Video submitted by deadline
- ✓ Live demo fully functional
- ✓ Tapestry integration working (verified in explorer)
- ✓ Code on GitHub with clean history
- ✓ No console errors during demo
- ✓ Judges understand the Tapestry value prop

**Winning Metrics:**
- Top 3 in Tapestry track
- 1st place = $2,500
- 2nd place = $1,500
- 3rd place = $1,000

---

## FINAL CHECKLIST

- [ ] All Tapestry integration tested
- [ ] UI shows "Stored on Tapestry" confirmations
- [ ] Video recorded and edited (3 min max)
- [ ] GitHub repo cleaned and documented
- [ ] `.env.example` created with all variables
- [ ] Live deployment working
- [ ] No hardcoded secrets in code
- [ ] Console clean (no errors/warnings)
- [ ] Mobile responsive
- [ ] Submission form filled out
- [ ] Video link working
- [ ] GitHub link public
- [ ] Live demo accessible
- [ ] Team ready to present (if live)

---

## GO LIVE DATE

**Submission Deadline:** February 27, 2026, 11:59 PM UTC

**Our Target:** Feb 26, 5 PM PST (12 hours early buffer)

---

**This is our winning strategy. Execute with discipline.**

*Last Updated: February 22, 2026*
