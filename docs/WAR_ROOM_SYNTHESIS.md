# War Room Synthesis — Final Architecture Decisions

> Saved: Feb 22, 2026
> Reference this document for ALL UI/UX decisions

---

## The 5 Expert Perspectives (Summary)

### 1. User Advocate
- **Two personas:** Alex (CT trader, 26, wants to flex predictions) and Jordan (DFS migrant, 32, wants fair competition)
- **Follow ONLY works** if it feeds into "Friends Leaderboard" — following without visible payoff is pointless
- **Like is nice-to-have** but not critical
- **Comments are HARMFUL** — turns game into forum, invites toxicity, distracts from core loop
- **#1 killer:** broken live scoring — if scores don't update, NOTHING else matters
- **Users come for COMPETITION, not SOCIALIZING**
- **Core need:** "I predicted better than everyone else" — that's the emotional hook

### 2. Growth Hacker
- **Core loop** follows Nir Eyal Hook Model: Trigger (status anxiety) → Action (check scores) → Reward (live scoring every 30s) → Investment (team shared on X)
- **Aha moment at T+4:15 minutes** (draft team → see first score update)
- Follow drives retention via **"Friends Leaderboard"** (local rivalry beats global leaderboard)
- Skip comments (+2-5% impact), likes (+0-2%)
- **Viral moment:** "I predicted better than everyone else" → screenshot → share to Twitter
- **Shareable team cards are the REAL viral loop** — not in-app social features
- **Key metric:** D7 retention, driven by checking scores

### 3. Behavioral Psychologist
- **Follow:** HIGH motivation (competitive accountability), EXCELLENT ability (one-click) — BUILD IT
- **Activity Feed:** HIGH motivation (FOMO), EXCELLENT ability (passive consumption) — BUILD IT
- **Like:** MEDIUM motivation — delay until users emotionally invested (week 1+)
- **Comments:** SKIP for MVP — toxicity risk, moderation burden, dilutes competition focus
- **Social comparison anxiety** is real risk at 500+ users — show tier leaderboards, not just global rank
- **Variable reward schedule** (score updates at unpredictable intervals) is the strongest retention mechanism

### 4. Business Strategist
- **Real competitors:** Polymarket, DraftKings crypto vertical, CT Discord communities
- **Moat ranking:** Community ownership (strong) > Proprietary scoring (medium) > Creator partnerships (medium) > Tapestry composability (medium) > First-mover (weak)
- **Tapestry is "developer narrative, not user value"** — needs composability framing for users
- Social features affect retention → LTV impact
- **Shareable team cards are the real viral loop**
- Revenue path: Free → engagement → paid contests (10% rake) → premium features

### 5. Design Lead (EXACT SPECIFICATIONS)

#### Follow Button
- **Not following:** Cyan outline, `border-cyan-500/30 bg-cyan-500/10 text-cyan-400`
- **Following:** Gold border, `border-gold-500/30 bg-gold-500/10 text-gold-400`
- **Hover (unfollow):** Rose hint, `border-rose-500/50 bg-rose-500/10 text-rose-400`
- **Size sm:** `px-2.5 py-1 text-xs`
- **Size md:** `px-3.5 py-1.5 text-sm`

#### Activity Feed
- Home page card, ~280px height, 6 items max
- 30s auto-refresh with live green pulse indicator
- Items: follow events, draft events, score updates
- Each item: icon + text + timestamp

#### Social Counts
- Profile header only
- Grid: Followers | Following | On-chain Items

#### Tapestry Branding
- Subtle, purposeful
- "Saved to Tapestry" (not marketing speak)
- "Verified on Tapestry Protocol" for scores
- Small footer text, not prominent badges

#### Celebration Screen (Post-Draft)
- Enhanced success screen with:
  - Bouncing trophy animation
  - Formation card preview
  - Share to Twitter CTA (primary, blue)
  - Copy team details (secondary, gray)
  - Tapestry confirmation badge
  - "View Leaderboard" link at bottom

#### Share to Twitter
- Pre-filled tweet with @handles
- Include team composition
- Include contest name
- Hashtags: #Foresight #CTFantasy #Solana

---

## LOCKED DECISIONS

### BUILD
| Feature | Consensus | Status |
|---------|-----------|--------|
| Follow Button | 5/5 | Code written, needs UX polish |
| Friends Leaderboard | 5/5 | Code written, needs UX polish |
| Activity Feed | 4/5 | Code written, needs UX polish |
| Shareable Team Card | 4/5 | Code written, needs UX polish |
| Tapestry Badges | 5/5 | Code written, needs UX polish |

### CUT (Makes Product Better)
| Feature | Consensus | Why |
|---------|-----------|-----|
| Comments | 4/5 skip | Toxicity risk, moderation burden |
| Likes | 3/5 delay | Medium ROI, delay until users invested |

### Core Loop
```
Draft Team → See Live Scores (30s) → Check Friends Leaderboard → Share on Twitter
    ↑                                        ↓
    └──────── Follow more players ←──────────┘
```

---

## UX PRINCIPLES FROM WAR ROOM

1. **Competition first, social second** — every social feature must serve the competitive loop
2. **"I predicted better than everyone"** is the emotional hook — make scores feel like achievements
3. **Friends > Global** — local rivalry drives retention more than global rankings
4. **Post-draft is THE moment** — celebration + share is the viral loop, make it feel electric
5. **Scores must feel alive** — if the app looks static, users leave
6. **Tapestry = subtle for users, clear for judges** — two different audiences
7. **Social comparison anxiety** — show tiers, not just absolute rank at scale
8. **Variable rewards** — unpredictable score updates create the "check again" habit

---

## CURRENT GAPS (from screenshot review, Feb 22)

1. Leaderboard has no Follow buttons visible
2. "Friends" tab not rendered
3. Draft influencer cards missing profile images
4. Team submission showing error toast
5. Mobile layout cutting off
6. No competitive tension in leaderboard design
7. Post-draft celebration not tested
8. Activity feed not visible on Home
9. No score update animations
10. Tapestry messaging not visible anywhere in screenshots
