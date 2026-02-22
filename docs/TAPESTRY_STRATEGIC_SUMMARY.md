# Tapestry Product Strategy — Executive Summary

> **Audience:** Product leadership, judges, stakeholders
> **Length:** 5-minute read
> **Purpose:** Why this approach wins the hackathon and positions Foresight for phase 2

---

## The Core Problem We're Solving

**Traditional fantasy sports:** Your data lives in one app's database. You own nothing. You can't prove your rank to other apps. You can't take your identity anywhere.

**Foresight on Tapestry:** Your teams, your scores, your identity live on Solana's social graph. It's immutable. It's verifiable. It's yours.

---

## Why This Matters (In 90 Seconds)

### Act 1: The User's Perspective
1. Sign up (no wallet install needed)
2. Draft a team
3. **Boom.** Team is published to Tapestry
4. Check leaderboard. Your rank is live.
5. Come back next week. **Your team still exists.** On-chain.

### Act 2: The Composability Angle
That team and score on Tapestry? Other apps could read it.
- A Solana news site could show "Top Foresight players this week"
- A social app could say "User's best achievement: 1st place in Foresight"
- An achievement protocol could aggregate scores across all Tapestry games

**Nobody's built this yet.** We're not just shipping a game; we're shipping a data layer.

### Act 3: The Hack Angle
Other hackathon teams will use Tapestry. We'll beat them because:
1. **Real Use Case** — Fantasy sports, not toy data
2. **Multiple Tapestry Features** — Profiles, content storage, social graph (follow/like/comment optional)
3. **Polish** — Professional design, smooth onboarding, zero friction
4. **Narrative** — Clear story: "composability matters, and Tapestry enables it"

---

## The Strategic Decision: Tapestry Over Custom Blockchain

**We could have built a custom Solana program.**

**We chose Tapestry. Here's why:**

| Criteria | Custom Program | Tapestry |
|----------|---|---|
| **Time to ship** | 3-4 weeks | 5 days |
| **Complexity** | High (Solana/Rust learning curve) | Low (REST API) |
| **Composability** | Isolated (only our app) | Built-in (Tapestry ecosystem) |
| **Maintenance** | Ongoing (security audits, upgrades) | Handled by Tapestry team |
| **Hackathon judging** | "Technical but slow" | "Fast, polished, strategic" |

**Verdict:** In a 5-day hackathon, Tapestry lets us ship a polished product. A custom program would ship last-minute and broken.

---

## The "Wow Moment" That Wins Judges

**Scenario:** Judge submits a team, sees toast: "✓ Published to Tapestry Protocol"

30 seconds later, they reload the page. **The team is still there.** On their profile, marked "On Tapestry".

They click "View on Tapestry Explorer". The data is actually there, with correct properties:
```
Content ID: foresight-team-judge-123-6
Properties:
  type: draft_team
  app: foresight
  captain_id: 42
  picks_json: [...]
```

**Judge thinks:** "Wait, this isn't just a database. It's actually on-chain. This is real."

**That's the moment we win.**

---

## Feature Integration Strategy

### What Shows Where (Minimal, Intentional)

| Page | Tapestry Element | Why |
|------|---|---|
| **Home** | "Built on Tapestry" intro (3 feature cards) | Sets expectations, no crypto jargon |
| **Draft** | Success toast: "Published to Tapestry" | Confirms immutability at key moment |
| **Leaderboard** | Team preview + "✓ On Tapestry" badge | Reinforces every ranking is verified |
| **Profile** | Badge, social counts, teams list | User's "permanent record" hub |
| **Explorer Links** | "View on Tapestry" buttons | Judges can verify data integrity |

### What We're NOT Building (Strategic Cuts)

- ❌ Follow/unfollow UI — Interesting but doesn't prove core value
- ❌ Comments/likes UI — Nice-to-have, adds complexity
- ❌ Activity feed tab — "What did users do?" is less compelling than "What's my rank?"
- ❌ Custom Solana program — Takes 3-4 weeks, overkill for hackathon

**Result:** 6 hours of development for MVP features. 10 hours available. We have 4 hours buffer for polish and QA.

---

## The Demo Narrative (3 Minutes)

**Opening (30 sec):**
"Traditional fantasy sports keep your data locked in one app. We're building something different."

**Core Loop (1 min):**
"You draft teams of CT influencers, earn points based on their activity. But here's the key: Every team, every score goes to Tapestry — Solana's social data protocol."

[Show team submission → "Published to Tapestry" toast → Profile shows team with "On Tapestry" badge]

**The Ask (30 sec):**
"This data is immutable. It's verifiable. Other apps could read it. That's composability. That's why Tapestry matters for gaming."

**Close (30 sec):**
"Foresight shows what gaming on a social data layer looks like."

---

## Why This Beats Other Entries

### Other Teams Will Try Tapestry Too
**How we stand out:**

1. **Clearer Use Case**
   - They: "We store data on Tapestry"
   - Us: "We solve composability. Fantasy sports need social proof."

2. **Better Polish**
   - They: "Here's the integration"
   - Us: "Here's the integration + professional UX + smooth onboarding"

3. **Stronger Narrative**
   - They: "We used all the Tapestry APIs"
   - Us: "We used Tapestry to enable a new type of game."

4. **Verifiable Data**
   - They: Claims about immutability
   - Us: "Click here to verify on Tapestry Explorer"

---

## Success Metrics (How We Know We've Won)

**Judge's Experience:**
- ✓ Can understand product in <30 seconds
- ✓ Can sign up in <15 seconds (no wallet install)
- ✓ Can see team on Tapestry immediately
- ✓ Can verify data in Tapestry explorer
- ✓ Has "wow" moment when they realize composability angle

**Our Execution:**
- ✓ Video shows entire flow (signup → leaderboard) in 2:45
- ✓ Live demo works without crashes
- ✓ Code is clean (no hacky solutions)
- ✓ Commit history shows logical progression
- ✓ README explains Tapestry integration clearly

**Expected Result:**
- Top 3 in Tapestry track (realistic)
- $1,500-2,500 prize (conservative estimate)

---

## Phase 2: Post-Hackathon Vision

**This isn't a toy.** If we win or place, we have a real product to build.

### Immediate Next Steps (Weeks 1-4)
- Deploy on mainnet (currently on Sepolia)
- Enable follow/unfollow UI (backend exists)
- Build leaderboard UI for other apps to embed our scores
- Add achievement system (teams are already stored, easy to badge)

### Phase 2 (Months 2-3)
- Player-to-player following (enable social layer)
- Team sharing (let friends see your exact roster)
- Achievement protocol (portable badging across Tapestry)
- API for other Tapestry apps to query Foresight leaderboards

### Phase 3 (Months 4+)
- Composable tournaments (aggregate scores from Foresight + other games)
- Social discovery (find players based on Tapestry graph)
- Paid leagues (now that data is portable, premium contests make sense)
- Mobile app (based on successful web)

**Key insight:** Tapestry isn't a gimmick. It's our infrastructure play. Every feature we build on top of it becomes more valuable.

---

## Risk Mitigation

### Risk 1: Tapestry API Fails During Demo
**Mitigation:** Pre-record video of entire flow as fallback. Have 3 test accounts with verified Tapestry profiles. Show screenshots of explorer if live fails.

### Risk 2: Judge Doesn't Understand Composability Angle
**Mitigation:** Have 2-3 concrete examples ready:
- "Another game could import our player rankings"
- "Achievement protocol could recognize our scores"
- "Social apps could show 'player is #47 in Foresight'"

### Risk 3: Other Teams Also Optimize for Tapestry
**Mitigation:** Our edge is polish + narrative. We focus on design quality and clear messaging. Not feature count, but execution.

### Risk 4: Data Structure Judges Don't Like
**Mitigation:** Our data structure is simple and clean. Teams stored as content with properties. Scores updatable. Exactly what Tapestry designed for.

---

## The Bottom Line

**We're not building "a game that uses Tapestry."**

**We're building "a game that demonstrates why Tapestry matters."**

Every design decision, every feature placement, every line of messaging points to one thing:
> Data portability enables new types of games.

If judges "get it", we win. If they don't, we ship a great product anyway.

---

## Timeline & Deadlines

| Date | Milestone | Status |
|------|-----------|--------|
| **Feb 22** | Product strategy finalized | ✓ Done |
| **Feb 23** | MVP features implemented | ⏳ In progress |
| **Feb 24** | Video recorded + polished | ⏳ To-do |
| **Feb 25** | Deployed to production | ⏳ To-do |
| **Feb 26** | Final QA + submission prep | ⏳ To-do |
| **Feb 27** | Submit before 11:59 PM UTC | ⏳ Target |

---

## For the Team

**You have 4.5 days.**

**The plan is solid.** Follow the implementation checklist. Build features in order. Test as you go.

**Don't gold-plate.** The $5,000 bounty is won on narrative + polish, not feature count.

**The narrative is:** "Composability changes everything."

**Prove it.**

---

*Last updated: February 22, 2026*
