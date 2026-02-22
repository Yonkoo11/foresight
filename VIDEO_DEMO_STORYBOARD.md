# VIDEO DEMO STORYBOARD (2:45 - 3:00 Duration)

**Format:** 1920x1080, 30 FPS, H.264 MP4
**Audio:** Professional voiceover + optional subtle background music (no distraction)
**Editing:** Final Cut Pro, Premiere, or DaVinci Resolve
**Delivery:** Hackathon submission portal

---

## SCENE BREAKDOWN (8 Scenes, 180 seconds total)

### SCENE 1: Problem Statement (0:00 - 0:30) [30 seconds]

**Visual Elements:**
- Dark background (#0A0A0F, matches app theme)
- Text overlay (60pt, gold color, Helvetica bold):
  ```
  SOCIALFI IS DEAD
  Friend.tech: $21/month
  92% User Churn
  ```
- Graph showing TVL collapse (Friend.tech Aug 2023 → Jan 2025)
- Fade from one stat to next (1 sec per stat)

**Animation:**
- Fade in text (0.5 sec)
- Graph appears (1 sec)
- Hold on graph (1.5 sec)
- Fade out (0.5 sec)

**Voiceover Script:**
> "Friend.tech promised to turn your Crypto Twitter credibility into income. In August 2023, they were processing $10 million in daily volume. Today, they make $21 a month. What happened? Friction."

**Tone:** Concerned, but hopeful (not doom-and-gloom)

---

### SCENE 2: The Friction (0:30 - 0:50) [20 seconds]

**Visual Elements:**
- Dark background, centered text
- 5-step flow diagram:
  ```
  1. Install wallet     → Screenshot of MetaMask homepage
  2. Buy token         → Screenshot of Uniswap
  3. Deposit funds     → Screenshot of wallet transfer
  4. Learn the game    → Screenshot of help docs
  5. Trade            → Screenshot of first trade
  ```
- Red X appears over "5" (indicating failure point)
- Stat overlay (gold text):
  ```
  90% quit before step 3
  ```

**Animation:**
- Each step appears as voiceover mentions it (4 sec per step)
- Red X animates down on step 5 (1 sec)
- Stat appears and pulses (2 sec)

**Voiceover Script:**
> "To play, you had to install a wallet. Buy a token. Deposit real money. Learn a new game. And then actually trade. Five friction points. Ninety percent of users quit before step three. That's why SocialFi failed. Not because the idea was bad. Because the friction was too high."

**Tone:** Matter-of-fact, then building energy

---

### SCENE 3: Solution Intro (0:50 - 1:15) [25 seconds]

**Visual Elements:**
- App landing page screenshot (foresight.example.com)
  - Hero section with formation visual (5 influencers in soccer shape)
  - Copy: "Fantasy league for Crypto Twitter"
  - [Start Playing] button (gold color)
  - Trust signals: "Free to play | Email login | 2,847 players"
- Zoom slowly into formation visual (0.5x → 1.5x, over 5 seconds)
- Fade to Privy modal:
  - [Google] Sign up with Google
  - [Twitter] Sign up with Twitter
  - [Email] Or email address
  - Message: "We create your wallet for you. It's instant."

**Animation:**
- Landing page fades in (1 sec)
- Formation zooms over 5 seconds (smooth, continuous)
- Fade to Privy modal (1 sec)
- "Wallet created" badge appears and pulses (2 sec)

**Voiceover Script:**
> "We solved it with three things. First: embedded wallets. Second: identity verification. Third: Solana. Look at this. No wallet install. Just email. Or Google. Or Twitter. Your wallet is created automatically in the background. That's the key insight. Wallet creation doesn't have to be the first step. It can be invisible."

**Tone:** Confident, building excitement

---

### SCENE 4: Draft Demo (1:15 - 1:55) [40 seconds]

**Visual Elements:**
- **Sequence A: Auth Flow (5 sec)**
  - Privy modal visible
  - Mouse cursor clicks "Email" input
  - Type "judge@foresight.io" (show typing in real-time, 2 sec)
  - Click [Sign up] button
  - Loading animation ("Creating account...")
  - Success badge: "Account ready! Redirecting..." (2 sec)

- **Sequence B: Draft Page Initial Load (5 sec)**
  - Page loads: `/draft?contestId=6`
  - Formation visual appears on left (5 empty slots, gold borders)
  - Influencer list appears on right (scrollable grid)
  - Budget counter: "150 / 150 SOL"
  - Animation: Formation slots pulse gently (waiting for input)

- **Sequence C: Auto-Draft (15 sec)**
  - Click [Auto-Draft] button
  - Formation fills with cards appearing bottom-up:
    - Captain slot: @vitalik (gold/S-tier badge)
    - Tier-1: @raydium (cyan/A-tier badge)
    - Tier-1: @punk_3882 (cyan/A-tier badge)
    - Tier-2: @defiwral (emerald/B-tier badge)
    - Tier-2: @modular (emerald/B-tier badge)
  - Budget updates: "95 / 150 SOL" (animation showing decrease)
  - Est. score appears: "~102 points"
  - Captain slot glows gold (emphasized)

- **Sequence D: Submit (10 sec)**
  - Click [Lock & Submit] button
  - Page transitions smoothly to success modal
  - Success modal shows:
    ```
    ✓ TEAM CREATED!
    Your team is live on the leaderboard.

    [TapestryBadge]
    ✓ Team shared on Tapestry Protocol

    [View Leaderboard] [Make Another Team]
    ```
  - Celebration animation: Gold confetti or glow (2 sec)
  - Fade to leaderboard view

**Animation Details:**
- Auto-draft: Cards appear with stagger (200ms between each)
- Budget counter: Number animates from 150 → 95
- Captain glow: Subtle gold border animation (pulse, 1 sec cycle)
- Success modal: Scale up from center (spring animation, 0.5 sec)

**Voiceover Script:**
> "Here's what that looks like. Email address. [type] Account created in three seconds. Boom. Now you draft. Pick five Crypto Twitter influencers. Your captain gets 1.5x points — that's your leverage. Auto-draft picks the top five for you. Done. Ninety seconds from landing to having a live team on the leaderboard. That's the speed advantage."

**Tone:** Fast-paced, energetic, impressive

---

### SCENE 5: Live Leaderboard & Scoring (1:55 - 2:35) [40 seconds]

**Visual Elements:**
- **Sequence A: Leaderboard Overview (8 sec)**
  - Leaderboard page (`/contest/6`) loads
  - Table shows:
    ```
    Rank | Player      | This Week | Total | Team
    ────────────────────────────────────────────────
    1    | @alex_tr... | +245      | 8,950 |
    2    | @defi_wh... | +238      | 8,821 |
    ...
    47   | YOU         | +102      | 4,320 | [gold highlight]
    ...
    100  | @small_... | +8        | 250   |
    ```
  - Your entry scrolls into view, highlighted in gold
  - Rank number "47" is enlarged and animated

- **Sequence B: Formation Card Detail (6 sec)**
  - Zoom to formation card showing:
    ```
        [@vitalik]
        Captain, S-tier
        +42 pts (×1.5)

    [@raydium]    [@punk_3882]
    +18 pts       +22 pts

    [@defiwral]   [@modular]
    +12 pts       +8 pts

    TOTAL: 102 pts / 150 possible
    ```
  - Formation visual shows colors by tier (gold=S, cyan=A, emerald=B)
  - Captain multiplier is highlighted with "×1.5" badge

- **Sequence C: Live Update Moment (20 sec) - THE "WOW MOMENT"**
  - Page transitions to CT Feed tab
  - Show @vitalik's tweet:
    ```
    @vitalik
    "The future of Solana is..." [tweet text]

    Engagement: 45K ↑ 12K ↓ 3K 💬
    ```
  - Pause on tweet (3 sec, judge reads it)
  - Engagement numbers update:
    ```
    Engagement: 50K ↑ 12K ↓ 3K 💬
    ```
  - Animation: Numbers flash (yellow highlight, 0.5 sec)
  - Text overlay appears: "Real-time scoring update incoming..."
  - Page transitions back to leaderboard (smooth fade)
  - Your score updates:
    ```
    BEFORE: 102 pts
    AFTER:  105 pts
    DELTA:  +3 pts ← highlighted, gold color
    ```
  - Animation on score: Number counts up from 102 to 105 (1 sec)
  - Explanation appears:
    ```
    Captain earned +2 pts from engagement
    Captain multiplier: ×1.5 = +3 pts total
    ```
  - Your leaderboard rank may shift (if score changed ranking)

- **Sequence D: Closing Shot (6 sec)**
  - Zoom out to full leaderboard
  - Highlight all the moving parts:
    - Your rank (gold background)
    - Your score (animated number)
    - Formation card (showing team composition)
  - Text overlay:
    ```
    LIVE SCORING
    Updated every 30 seconds
    Solana blockchain verified
    ```

**Animation Details:**
- Tweet engagement: 45K → 50K (smooth number counter, 1 sec)
- Score update: 102 → 105 (counting animation, 1 sec)
- Rank change: If moving from #48 to #47, show arrow ↑ (green, 0.5 sec)
- Leaderboard scroll: Smooth, natural (no jumping)

**Voiceover Script:**
> "Here's where it gets exciting. Your team is live on the leaderboard, rank 47 out of 2,847 players. Now watch. Every time someone you picked tweets and gets engagement, you earn points. In real-time. See that? Vitalik's tweet just got fifty thousand engagement. Your score updates. Three more points. Live. Every thirty seconds, we check engagement and update scores. This is why people check the app constantly. You're watching your picks earn points."

**Tone:** Building excitement, amazement (let the demo speak)

---

### SCENE 6: Tapestry Integration (2:35 - 2:45) [10 seconds]

**Visual Elements:**
- Go back to success modal from draft
- Zoom into TapestryBadge component:
  ```
  ✓ TEAM SHARED ON TAPESTRY PROTOCOL

  Your team is verifiable on-chain.
  Learn more about Tapestry →
  ```
- Badge has gold outline, professional styling
- Arrow points to Tapestry explorer link (optional, if configured)

**Animation:**
- Badge appears with scale animation (0.8x → 1.0x, 0.5 sec)
- Gold border glows gently (pulse animation, 1 sec)
- Text fades in (0.5 sec)

**Voiceover Script:**
> "Your team is published to Tapestry — Solana's identity verification layer. That's the anti-fraud mechanism that killed Friend.tech. Scammers can't impersonate celebrities because Tapestry verifies their Solana wallet and Crypto Twitter account. If you win, the win is verifiable. That's why judges should care about this."

**Tone:** Serious, reassuring (building trust)

---

### SCENE 7: Why Now (2:45 - 2:55) [10 seconds]

**Visual Elements:**
- Dark background, timeline visualization:
  ```
  2023          2024              2026
  ────────────────────────────────────
  Friend.tech   Privy launches    Foresight
  ❌ Too early  Tapestry launches ✓ Perfect timing
               Solana matures
  ```
- Each item fades in as voiceover mentions it
- Gold checkmark appears next to 2026
- Final text overlay:
  ```
  $13B/month in prediction markets
  Ready for resurrection
  ```

**Animation:**
- Timeline appears left to right (2 sec)
- Items fade in with audio (2 sec each)
- Checkmark animates (swipe animation, 0.5 sec)
- Final stat pulses (1 sec)

**Voiceover Script:**
> "In 2023, you couldn't build this. Privy didn't exist. Tapestry didn't exist. Solana wasn't ready for consumer applications. In 2026, all three exist. And prediction markets just hit thirteen billion dollars in monthly volume. The infrastructure finally caught up to the idea. Now it works."

**Tone:** Triumphant, vindicated

---

### SCENE 8: Closing Pitch (2:55 - 3:00) [5 seconds]

**Visual Elements:**
- Formation visual appears (centered, full screen)
- Gold color scheme
- Text overlay (bold, 72pt):
  ```
  FORESIGHT

  Predict Influence. Win SOL.
  Resurrection of SocialFi.
  ```
- Logo + project name

**Animation:**
- Formation fades in (1 sec)
- Text appears with fade (1 sec)
- Subtle background glow (gold gradient, fades in, 2 sec)
- Zoom out slightly (2 sec total)

**Voiceover Script:**
> "SocialFi didn't die because influence doesn't matter. It died because the distribution was broken. We fixed it. This is Foresight."

**Tone:** Confident, definitive

---

## TECHNICAL RECORDING GUIDE

### Software Setup (OBS Studio - Free)

**Recording Settings:**
```
Resolution: 1920x1080
FPS: 30
Bitrate: 8,000 kbps (high quality)
Encoder: x264
Profile: High
```

**Capture Settings:**
- Window capture (select app window only, not desktop)
- Disable browser chrome (remove address bar)
- Framerate: 30 FPS

### Pre-Recording Checklist
- [ ] Close Slack, email, notifications
- [ ] Use incognito browser (fresh state)
- [ ] Test Privy API keys are configured
- [ ] Database has demo data seeded
- [ ] Font size set to 120% (readable when recorded)
- [ ] Dark mode enabled (matches design)
- [ ] Test microphone (quiet environment)
- [ ] Do audio test recording (check levels)

### Recording Process

**Take 1: Full run-through (don't stop if minor mistakes)**
- Record entire 3-minute sequence
- Ignore small clicks/pauses (editor can fix)
- Focus on smooth transitions

**Take 2: Backup (in case Take 1 is bad)**
- Record again if Take 1 has issues
- Better to have 2 good takes than 1 mediocre one

**Take 3: Alternative (different approach)**
- Optional: Record alternative flow (e.g., email auth vs. Google auth)
- Useful if Privy auth seems confusing in Take 1

### Audio Recording (Separate)

**Best practice:** Record voiceover separately
- Cleaner audio quality
- Can re-record if speaker makes mistake
- Easier to add background music later

**Setup:**
- USB microphone (Audio-Technica AT2020 or similar)
- Quiet room (closet is fine)
- Gain level: -6dB to -3dB (don't clip)
- Audio format: 48kHz WAV

**Recording:**
- Read script slowly (don't rush)
- Pause between sentences (editor needs gaps to sync)
- Do 2-3 takes of full script
- Do pickup recordings of individual lines (if needed)

---

## POST-PRODUCTION WORKFLOW (Premiere/Final Cut/DaVinci)

### Step 1: Sync Video + Audio (10 min)
- Import screen recording video
- Import voiceover audio
- Sync by visual cues (watch app animations match audio timing)
- Audio level: -12dB to -6dB (comfortable to listen to)

### Step 2: Color Grade (15 min)
- Match app colors (gold #F59E0B, dark #0A0A0F)
- Slight brightness boost (make text readable)
- Saturation: +5% (pop slightly, not oversaturated)
- Contrast: +10% (crispness)

### Step 3: Add Graphics & Titles (30 min)
- Opening title: "SOCIALFI IS DEAD" (0:00-0:30)
- Problem stat: "92% Churn Rate" (0:30-0:50)
- Scene markers between sections
- Final title: "FORESIGHT" + tagline (2:55-3:00)
- Font: Helvetica Bold, 60-72pt
- Color: Gold (#F59E0B) on dark background

**Text Animation Examples:**
- Fade in (0.3 sec)
- Hold (2-3 sec)
- Fade out (0.3 sec)

### Step 4: Add Background Music (5 min) - OPTIONAL
- Keep it subtle (don't overpower voiceover)
- Use royalty-free instrumental
- Genres: Electronic, ambient, or corporate
- Volume: -20dB (way down, barely noticeable)
- Fade in at 0:00, fade out at 2:55

**Music suggestions:**
- Epidemic Sound: "Minimal Tech" playlists
- Artlist: "Corporate Tech" category
- YouTube Audio Library: "Uplifting" category

### Step 5: Final Audio Mix (5 min)
- Voiceover: -12dB
- Background music: -20dB (if used)
- Compression: Add light compression to VO (make consistent)
- Normalize to -2.5dB (headroom for YouTube/submission)

### Step 6: Export (10 min)
- **Codec:** H.264 (best compatibility)
- **Resolution:** 1920x1080
- **Frame rate:** 29.97 FPS (standard broadcast)
- **Bitrate:** 12,000 kbps video (high quality)
- **Audio:** 192 kbps AAC stereo
- **Container:** MP4
- **Output:** 400-500 MB file size (normal)

---

## DISTRIBUTION CHECKLIST

**Before Submitting:**
- [ ] Test video plays on 3 different computers (Windows, Mac, web)
- [ ] Test on phone browser (mobile playback)
- [ ] Audio levels are consistent (no sudden loud/quiet parts)
- [ ] No codec issues (greenscreen artifacts, etc.)
- [ ] Video length exactly 2:45-3:00
- [ ] Text is readable (test at 720p and 1080p)
- [ ] No personal info visible (emails, passwords)
- [ ] Export to final H.264 MP4 file
- [ ] Upload to hackathon portal
- [ ] Get confirmation of successful upload

**Filename:** `foresight_demo_v1.mp4` (clear, versionable)

**Backup:** Keep original video file + project file (in case edits needed)

---

## FAILURE RECOVERY (What to Do If Video Doesn't Work)

**If you're still recording on Day 6:**
1. Shoot simple version (no effects, just straight gameplay)
2. Record voiceover separately
3. Sync them (don't worry about fancy editing)
4. Submit as-is (something > nothing)

**If audio is bad:**
1. Re-record voiceover
2. Sync to existing video
3. Re-export
4. No need to re-shoot entire video

**If text overlay is confusing:**
1. Remove overlays, use plain voiceover
2. Judges don't need graphics
3. Voiceover is enough

**If video is too long:**
1. Cut problem areas (e.g., auth flow is slow, skip to success)
2. Trim silences
3. Re-export

---

**Remember:** A good video demo is better than a broken live demo. Invest the time here.

