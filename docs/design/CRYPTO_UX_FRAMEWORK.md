# Crypto/Web3 UX Framework for Foresight

> **Status:** Strategic Framework for Solana + Tapestry Integration
> **Audience:** Full team + judges (show Web3 credibility)
> **Current Issues:** Solved with concrete UI specs below

---

## Executive Summary

Foresight's crypto UX is currently **functional but invisible**. Users can play without realizing they're interacting with Solana, Tapestry, or blockchain. This is a missed opportunity.

**The Goal:** Make crypto feel like a *feature* not a requirement. Users should see Solana integration as a trust signal (verifiability, security, permanence), not jargon they need to understand.

**Strategic Approach (from competitor research):**
- **Sorare** (NFT cards): Shows on-chain ownership in every victory screen
- **Blur** (NFT marketplace): Gas estimation → transparent cost breakdown
- **Axie Scholars:** Wallet setup → earnings dashboard (context matters)
- **Rainbow Wallet:** Makes seed phrases feel simple, not scary

**Foresight's Advantage:** We're *not* asking users to buy crypto or understand blockchain. They draft, we store teams on Solana. Simple.

---

## 1. WALLET ONBOARDING UX: "No Wallet?" Flow

### The Problem
Current: "Sign in with Privy" → (implicit wallet connection) → User plays
Issue: Users don't know they have a Solana wallet. No celebration, no security messaging.

### The Solution: 5-Step Onboarding Flow

#### **Step 1: Auth Entry Point (Home Page CTA)**
**Current:** "Start Playing" button
**New:** Two-path button with hover state

```
┌─────────────────────────────────────────────────────────────┐
│                    HOVER STATE CHANGE                       │
│ ┌──────────────────────────────────────────────────────────┐│
│ │ Ready to compete? → Sign up with your wallet (new text)  ││
│ │                    ↓                                       ││
│ │ [Sign up]  [Learn how it works]                          ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Copy change:** "Free to play" → "Free to play. No fees. On Solana."

**Implementation:**
- New copy on `/` home page CTA
- Optional: "Learn how it works" link → collapsible FAQ (section below)
- If user clicks "Learn how": Show 30-second explainer modal
- Button should be `btn-primary` (gold, unchanged)

#### **Step 2: Privy Modal (Privy Handles This)**
**What we can't change:** Privy's UI
**What we can optimize:** Our messaging *before* and *after*

**Before (show in a card above the button):**
```
┌─────────────────────────────────────────────────────────────┐
│  ✨ Getting Started                                          │
│  We'll create a secure Solana wallet for you. You won't     │
│  need to manage seed phrases or gas fees — we handle it all.│
│  Tap "Sign up" to proceed.                                  │
└─────────────────────────────────────────────────────────────┘
```

**After Privy login → Step 3**

#### **Step 3: Wallet Setup Confirmation (NEW MODAL)**
Show immediately after Privy succeeds, before redirect to app.

**Desktop + Mobile (full-screen modal, center content):**
```
┌──────────────────────────────────────────────────────────┐
│                  🎉 Welcome to Foresight!                 │
│                                                            │
│  ✓ Your Solana wallet is ready                            │
│  ✓ All teams & scores are stored on-chain (immutable)     │
│  ✓ Zero gas fees (we cover hosting)                       │
│                                                            │
│  Wallet Address (read-only for security):                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ CDLf...F23J  [Copy icon] [Solana Explorer link]     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Start Playing]  (gold, 44px tall)                        │
│                                                            │
│  💡 Tip: Your wallet is linked to your profile. You can    │
│  export it anytime from Settings.                          │
│  [Learn more about Solana wallets]                         │
└──────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- **Checkmarks:** Green (#10B981), not gold (different semantic meaning)
- **Wallet address:** Monospace (JetBrains Mono), truncated (8 chars each side)
- **Copy button:** Icon only, hover to reveal tooltip "Copy wallet address"
- **Solana Explorer link:** Icon only (external), hover → "View on Solana"
- **"Export" mention:** Builds trust (they can always get their keys)
- **No seed phrase in onboarding:** Privy embedded wallet, users never see it

**Timing:** Shown for 5 seconds, OR user taps [Start Playing] to skip to app

#### **Step 4: First Contest Entry (Deferred Wallet Context)**
User enters their first FREE contest (no payment yet).

**Success modal changes:**
```
OLD:
✓ Team submitted!
[Share] [View Results]

NEW:
✓ Team submitted!
Your 5-player team is now stored on the Solana blockchain.
It's permanent, verifiable, and visible to all players.

┌─ Team on-chain ─────────────────────────┐
│ Address: CDLf...F23J                    │
│ Contract: (link to Solana Explorer)     │
│ Status: ✓ Immutable                     │
└─────────────────────────────────────────┘

[Share on Twitter]  [View on Solana]  [Back to Contests]
```

**Why deferred?** User has mental context now (they drafted, they entered). Showing blockchain details here feels like a natural feature, not jargon.

#### **Step 5: First Prize Claim (Wallet becomes Real)**
When user wins and claims prize:

```
OLD:
Prize claimed: 0.02 SOL
[OK]

NEW (CELEBRATION MODAL):
┌──────────────────────────────────────────────────────────┐
│              🏆 Prize Claimed!                            │
│                                                           │
│          You won 0.02 SOL ($0.47 USD)                    │
│                                                           │
│  Sent to your Solana wallet:                             │
│  CDLf...F23J                                             │
│                                                           │
│  ✓ Transaction confirmed on-chain                        │
│  ✓ View on Solana Explorer (link)                        │
│  ✓ Your wallet balance updated                           │
│                                                           │
│  [Claim Again]  [View My Wallet]  (button to Settings)   │
└──────────────────────────────────────────────────────────┘
```

**Animation:** Money icon + confetti (subtle, 200ms)

---

## 2. SOL PRIZE DISPLAY UX: Making "$0.02" Feel Exciting

### The Problem
Current: Prize shows as "0.02 SOL" (raw token, users think "Is that good?")
Issue: No context. User doesn't know if 0.02 SOL is $0.001 or $1.00.

### The Solution: Dual-Display System

#### **Principle: Always Show USD First, SOL as Secondary**
**Not:** "0.02 SOL"
**But:** "$0.47 (0.02 SOL)" — with USD as larger, bolder text

#### **Contest List (Compete Page)**
```
┌─────────────────────────────────────┐
│  Hackathon Demo League              │
│  Free League · 24 players           │
│                                     │
│  Prize Pool:                        │
│  $47.00  (1.0 SOL)  [gold accent]   │
│                                     │
│  Entry: Free  |  Entries: 24/50     │
│  [Enter Contest]                    │
└─────────────────────────────────────┘
```

**Design:**
- USD value: 16px, gold-500, bold
- SOL value: 12px, gray-400, regular weight, parentheses
- Monospace font for the token amount
- Updated real-time (subscribe to SOL/USD ticker every 60s)

#### **Contest Detail Page**
```
PRIZE BREAKDOWN CARD:

┌──────────────────────────────────────┐
│ Prize Pool & Distribution            │
├──────────────────────────────────────┤
│ Total Prize Pool                     │
│ $47.00 USD (1.0 SOL)                │
│                                      │
│ Payouts (top 5):                     │
│ 🥇 1st: $23.50 (0.5 SOL)            │
│ 🥈 2nd: $11.75 (0.25 SOL)           │
│ 🥉 3rd: $7.05 (0.15 SOL)            │
│    4th: $3.52 (0.075 SOL)           │
│    5th: $1.18 (0.025 SOL)           │
│                                      │
│ 📊 SOL/USD Rate: $23.50 as of now   │
│ [Refresh]                           │
└──────────────────────────────────────┘
```

**Key Points:**
- Medals for top 3 (visual hierarchy)
- Each row shows both USD and SOL
- "as of now" with refresh button (transparency)
- No jargon ("payout", "distribution", not "smart contract")

#### **Leaderboard Row**
```
ENTRY:
┌──────────────────────────────────────────┐
│ Alex  Score: 245pt  Prize: $23.50        │
│       (Gold star if verified on Solana)  │
│       (0.5 SOL in gray text below)       │
└──────────────────────────────────────────┘
```

**Implementation:**
- USD value: Primary text (gold)
- SOL value: Smaller, gray, monospace, below or inline
- Star icon for Tapestry verification (optional, if user is verified)

#### **Wallet Balance in Settings**
```
SETTINGS > WALLET:

┌──────────────────────────────────────┐
│ 💰 Your Solana Wallet                │
├──────────────────────────────────────┤
│ Address: CDLf...F23J [Copy]          │
│                                      │
│ Balance:                             │
│ $12.47 USD                           │
│ 0.53 SOL                             │
│                                      │
│ Earned in Foresight:                 │
│ +$0.47 (2 wins)                      │
│                                      │
│ [Export Keys (advanced)]             │
│ [View on Solana Explorer]            │
│ [Disconnect Wallet]                  │
└──────────────────────────────────────┘
```

#### **Real-Time SOL/USD Ticker**
**Implementation:**
```typescript
// backend/src/services/priceService.ts (NEW)
export async function getSolUsdPrice(): Promise<number> {
  // Call Coingecko API or cache Redis
  // Return number like 23.50
}

// frontend: React context for price
const SolPriceContext = createContext<number>(23.50);

// Usage in any component:
const solPrice = useContext(SolPriceContext);
const usdValue = (0.02 * solPrice).toFixed(2);
```

**Cache strategy:** Update every 60 seconds (not on every render)
**Fallback:** If API fails, show last known price + gray-out (user sees "$??.?? (0.02 SOL)")

---

## 3. THE TAPESTRY "PROOF" MOMENT: On-Chain Storage as Superpower

### The Problem
Current: "Tapestry badge" on leaderboard (users ignore it)
Issue: No one knows what Tapestry is. It's jargon that dilutes polish.

### The Solution: The "Saved to Solana" Micro-Interaction

#### **Principle: Show Proof, Not Jargon**
Don't explain "Tapestry Protocol uses Merkle proofs blah blah"
**DO:** Show "Your team is now permanent ✓" with visual confirmation

#### **Moment 1: Team Draft Success (First Time)**
Currently: "Team submitted!" toast
**New:** Full success modal with on-chain confirmation

```
┌─────────────────────────────────────────────────┐
│        ✓ Team Saved!                           │
│                                                 │
│  Your 5-player team is now stored on Solana's  │
│  social graph. It's permanent, verifiable, and │
│  shared with all players.                      │
│                                                 │
│  📊 Transaction Details:                       │
│  ┌───────────────────────────────────────────┐ │
│  │ Team ID: FORESIGHT_DRAFT_001              │ │
│  │ Wallet: CDLf...F23J                       │ │
│  │ Chain: Solana (Devnet)                    │ │
│  │ Block: 451,234,567                        │ │
│  │ Status: ✓ Immutable                       │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  🔗 [View on Solana Explorer]                  │
│  ↗️  Opens explorer.solana.com with proof      │
│                                                 │
│  [Share with Friends]  [Play Again]            │
└─────────────────────────────────────────────────┘
```

**Key UX Principles:**
1. **"Immutable"** is the magic word (not "on blockchain")
2. **Show proof:** Transaction ID (truncated, copyable)
3. **Link to explorer:** Let them verify themselves
4. **Keep it simple:** 3-4 lines max, large text

#### **Moment 2: Badge Evolution on Leaderboard**

**Current:**
```
User's name  Score 245  ✓ Tapestry
```

**New (four states):**

**State A: User NOT on Tapestry (gray, inactive)**
```
User's name  Score 245  ○ Not verified
```

**State B: User on Tapestry (verified)**
```
User's name  Score 245  ✓ Saved on Solana
                        (green icon, clickable)
```

**State C: On hover/click → Show proof popup**
```
┌─────────────────────────────────────────┐
│ ✓ Verified on Solana                    │
│                                         │
│ This team is stored on Solana's social  │
│ graph via Tapestry Protocol.            │
│ See proof: [View on Explorer] →         │
│                                         │
│ What does this mean?                    │
│ • Permanent (can't be deleted)          │
│ • Verifiable (others can check)         │
│ • Transparent (see on blockchain)       │
└─────────────────────────────────────────┘
```

**Design:**
- Checkmark icon: Green (#10B981) or gold-500
- Text: "Saved on Solana" (not "Tapestry")
- Hover → tooltip + link
- Mobile: Tap → small popover

#### **Moment 3: Profile Badge Card**
On user's profile, show Tapestry stats as a feature, not footnote:

```
┌─────────────────────────────────────────────────┐
│  🔗 Teams on Solana (Your Proof)               │
├─────────────────────────────────────────────────┤
│  Total Teams Saved:     12                      │
│  Total Scores Tracked:  3                       │
│                                                 │
│  All data is immutable and verifiable on the    │
│  Solana blockchain via Tapestry Protocol.       │
│                                                 │
│  [View My Tapestry Profile] →                   │
│  [View All Teams on Explorer]                   │
└─────────────────────────────────────────────────┘
```

**Messaging:**
- "Proof" = users own their data
- "Immutable" = permanence
- "Verifiable" = trust

#### **Moment 4: Judges/Demo Narrative**
When showing to judges, emphasize:

**NOT:** "We use the Tapestry Protocol API with Merkle proofs..."
**BUT:** "Every team is automatically saved to Solana. Users can verify their data anytime. Try it: [link to explorer]"

**Visual proof for judges:**
1. Draft a team → see "Saved to Solana" confirmation
2. Click "View on Explorer" → Shows transaction on actual Solana blockchain
3. They see their team stored as immutable content
4. Judges now believe integration is real (not smoke)

---

## 4. ENTRY FEE FRICTION: Paying SOL as Smooth as Apple Pay

### The Problem
Current: "Entry fee: 0.01 SOL" → User doesn't tap
Issue: No bridge between "I want to enter" and "What's 0.01 SOL in dollars?"

### The Solution: Transparent Cost Breakdown (Blur Gas Estimation Pattern)

#### **Before Entry: Cost Breakdown Modal**
User clicks [Enter Paid Contest], see this **before any payment**:

```
┌──────────────────────────────────────────────────┐
│  ⚡ Entry Cost Breakdown                         │
├──────────────────────────────────────────────────┤
│  Entry Fee:                 $0.24 (0.01 SOL)    │
│  Foresight Platform (10%):  $0.02 (0.001 SOL)   │
│  ──────────────────────────────────────────────  │
│  You'll be charged:         $0.26 (0.011 SOL)   │
│                                                  │
│  📊 SOL/USD Rate: $23.50 (as of now)            │
│                                                  │
│  ✓ No hidden fees                               │
│  ✓ Transaction confirmed in < 5 seconds         │
│  ✓ See it on Solana Explorer                    │
│                                                  │
│  [I'm ready, charge me]  [Cancel]               │
└──────────────────────────────────────────────────┘
```

**Transparency Wins:**
1. **Itemized cost** (Blur pattern): Users see exactly what they're paying for
2. **USD in bold** (not SOL): Most users think in dollars
3. **No surprises:** "No hidden fees" statement
4. **Speed promise:** "< 5 seconds" (confidence)

#### **During Payment: Real-Time Status**
After user taps [Charge Me]:

```
LOADING STATE (2-3 seconds):
┌──────────────────────────────────────────────────┐
│         💫 Processing Your Entry                 │
│                                                  │
│  Sending 0.011 SOL from your wallet...          │
│  (Don't close this window)                       │
│                                                  │
│  ⟳ Awaiting confirmation                        │
│                                                  │
│   🔗 View on Solana Explorer (link)              │
└──────────────────────────────────────────────────┘

SUCCESS (5 seconds):
┌──────────────────────────────────────────────────┐
│        ✓ Payment Confirmed!                      │
│                                                  │
│  $0.26 charged to your Solana wallet             │
│                                                  │
│  ✓ Transaction: F5X7k... (truncated, copyable)  │
│  ✓ Confirmed on Solana                          │
│                                                  │
│  [Continue to Draft]                            │
│                                                  │
│  💡 Your entry fee helps fund prize pools       │
│  and keep Foresight free for everyone.          │
└──────────────────────────────────────────────────┘
```

**Error Handling:**
```
PAYMENT FAILED:
┌──────────────────────────────────────────────────┐
│        ⚠ Payment Failed                          │
│                                                  │
│  Your wallet didn't have enough SOL.             │
│                                                  │
│  You need: 0.011 SOL ($0.26)                    │
│  You have: 0.005 SOL ($0.12)                    │
│                                                  │
│  💡 Get SOL:                                     │
│  • Buy on Phantom Wallet (recommended)           │
│  • Transfer from another wallet                  │
│  • [View SOL purchase guide]                     │
│                                                  │
│  [Try Again]  [Play Free Contests]              │
└──────────────────────────────────────────────────┘
```

#### **Post-Entry: Transaction Link**
After successful entry, show this card on the contest detail:

```
YOUR ENTRY:
┌────────────────────────────────────────┐
│ Your team is locked in!                │
│                                        │
│ Entry fee: $0.26 (0.011 SOL)          │
│ Transaction: F5X7k... [Copy] [View]   │
│                                        │
│ Your team starts scoring at UTC time.  │
│ [Share on Twitter] [Go to Leaderboard]│
└────────────────────────────────────────┘
```

---

## 5. THE CLAIM PRIZE FLOW: From Win to Wallet in 4 States

### The Problem
Current: "Prize claimed: 0.02 SOL" → opens Solana Explorer
Issue: User doesn't understand what they're looking at on Explorer. No celebratory moment.

### The Solution: Celebration → Confirmation → Proof

#### **State 1: User Sees They Won**
Leaderboard or contest detail:
```
YOUR RANK: 🥇 1st Place!
Prize: $23.50 USD (0.5 SOL)
[Claim Prize]  (gold button, 44px)
```

#### **State 2: Pre-Claim Confirmation Modal**
User taps [Claim Prize]:

```
┌──────────────────────────────────────────────────┐
│        🎉 Congratulations!                       │
│                                                  │
│  You won 1st place in Hackathon Demo League!     │
│                                                  │
│  Your prize:                                     │
│  💰 $23.50 USD                                   │
│  ₹ 0.5 SOL                                       │
│                                                  │
│  This will be sent to your Solana wallet:        │
│  CDLf...F23J                                     │
│                                                  │
│  Transaction fee: None (we cover it)             │
│                                                  │
│  [Yes, Claim Prize]  [Not Now]                   │
└──────────────────────────────────────────────────┘
```

**Design notes:**
- Celebratory emoji + color (gold background glow)
- Clear destination ("your Solana wallet")
- **No fees:** Trust-building ("we cover it")
- Two buttons: Claim now OR revisit later

#### **State 3: Processing (Optimistic UI)**
After user taps [Yes, Claim Prize]:

```
┌──────────────────────────────────────────────────┐
│        💸 Sending Your Prize                     │
│                                                  │
│  $23.50 is being transferred to your wallet...   │
│                                                  │
│  Your wallet: CDLf...F23J                        │
│  Amount: 0.5 SOL                                 │
│                                                  │
│  ⟳ Processing on Solana (usually < 5 sec)      │
│                                                  │
│  🔗 [View on Solana Explorer]                    │
│  (opens new tab to see transaction live)         │
│                                                  │
│  Don't close this window.                        │
└──────────────────────────────────────────────────┘
```

**UX detail:** Loading animation (not generic spinner) — maybe animated coins moving from platform to wallet

#### **State 4: Success Celebration**
Transaction confirmed on-chain:

```
┌──────────────────────────────────────────────────┐
│        ✅ Prize Claimed!                         │
│                                                  │
│     $23.50 is now in your wallet!               │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ From: Foresight Treasury                   │ │
│  │ To:   CDLf...F23J (Your Wallet)            │ │
│  │ Amount: 0.5 SOL                            │ │
│  │ Block: #451,234,567                        │ │
│  │ Status: ✓ Confirmed                        │ │
│  │ Time: 2.3 seconds                          │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  🎯 New Balance:                                │
│  $35.88 (1.53 SOL)                             │
│                                                  │
│  Earned on Foresight: $23.50 (+$0)              │
│  (Total earnings in app)                         │
│                                                  │
│  [View on Solana Explorer] [Check Balance]      │
│  [Play Next Contest]                            │
│                                                  │
│  Thank you for playing! 🎮                       │
└──────────────────────────────────────────────────┘
```

**Celebration Elements:**
- Checkmark + confetti animation (200ms, subtle)
- Show transaction confirmation ✓
- Show new wallet balance (proof it arrived)
- "Earned on Foresight" line (shows lifetime value)
- Two CTAs: Technical (Explorer) + next action (Play again)

#### **State 5: Claim Button Evolution**
The button itself should show state:

```
BEFORE CLAIM:
[💰 Claim Prize]  (gold, clickable)

DURING:
[💫 Processing...]  (gold, disabled)

AFTER:
[✓ Claimed]  (gray, disabled) with "Claimed on 2/25 at 3:45 PM"
```

---

## 6. CRYPTO CREDIBILITY SIGNALS: The 5 UI Elements That Build Trust

### The Problem
Crypto-native users judge apps by specific signals. Missing these = "this feels sketchy."

### The Solution: 5 Specific Design Elements

#### **Signal 1: Real Wallet Address Visibility (Not Hidden)**
**Anti-pattern:** Hiding wallet address under "Settings > Advanced"
**Our approach:** Show wallet in 2 places, visible, copyable

```
LOCATION 1: Profile page header
┌───────────────────────────────────┐
│ [Avatar] Username                 │
│ Wallet: CDLf...F23J [Copy] [View] │
│ Joined Feb 25, 2026               │
└───────────────────────────────────┘

LOCATION 2: Settings page
┌───────────────────────────────────┐
│ 💰 Your Solana Wallet             │
│ CDLf...F23J [Copy button]         │
│ [Export Keys (advanced)]          │
│ [View on Solana Explorer]         │
└───────────────────────────────────┘
```

**Design rule:**
- Wallet address: Monospace (JetBrains Mono), 10px, gray-400
- Copy button: Icon only, hover → tooltip
- Full address available on tooltip/modal (not on click)
- Never truncate more than 4 chars + 4 chars (CDLf...F23J is the minimum)

#### **Signal 2: Transaction IDs Are Linkable**
**Anti-pattern:** Showing "Transaction: F5X7k..." with no way to verify
**Our approach:** Every transaction ID is clickable → opens Solana Explorer

```
Transaction ID: F5X7k... [Copy] [View on Solana Explorer] →
                         ↑              ↑
                    Hoverable    Always visible, icon-based
```

**Implementation:**
```typescript
// Clickable link component
<a href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
   target="_blank" rel="noopener noreferrer"
   className="text-gold-400 hover:text-gold-300 inline-flex items-center gap-1">
  {truncateTx(txId)}
  <ArrowSquareOut size={12} />
</a>
```

#### **Signal 3: "No Hidden Fees" Statement (Every Entry)**
**Crypto rule:** Users are paranoid about hidden fees (rightfully so)
**Our approach:** Say "no hidden fees" explicitly, every time money is involved

```
✓ No hidden fees
✓ What you see is what you pay
✓ Learn how fees work [link]
```

**Places to show:**
1. Entry fee breakdown modal
2. Prize payout card
3. Settings > Billing (if we build billing)
4. FAQ page

#### **Signal 4: Blockchain Confirmation Status (Visual Indicator)**
**Anti-pattern:** "Processing..." with no ETA
**Our approach:** Show confirmation states visually

```
STATES:
🟡 Pending   (yellow, < 5 sec)
🟢 Confirmed (green, ✓ check)
🔴 Failed    (red, ⚠ warning)
```

**Example in contest detail:**
```
Transaction Status: 🟢 Confirmed on Solana
(Show "Block #451,234,567" link to block explorer)
```

#### **Signal 5: Transparent Wallet Balance (Not Hidden)**
**Anti-pattern:** Balance hidden in Settings
**Our approach:** Show balance prominently in Settings + optional dashboard card

```
SETTINGS > Wallet:
┌─────────────────────────────┐
│ Your Wallet Balance         │
│ $35.88 USD                  │
│ 1.53 SOL (as of 2 min ago)  │
│                             │
│ Earned from Foresight:      │
│ +$23.50 (4 wins)            │
│                             │
│ [Refresh] [Export Keys]     │
└─────────────────────────────┘
```

**Trust mechanism:** Users see they actually have the money in a real Solana wallet

---

## 7. WHAT NOT TO DO: 3 Crypto UX Anti-Patterns (Avoid at All Costs)

### Anti-Pattern 1: "Learn Blockchain" Modals
**❌ DON'T:**
```
"What is Solana?"
"Solana is a blockchain that uses Proof of History..."
[OK] [Tell me more]
```

**✅ DO:**
```
"Your team is now saved permanently"
(Implicit: saved to blockchain, but users don't need the word)
```

**Why:** Crypto-native users find education insulting. Non-native users bounce.
**Alternative:** Put educational content in FAQ, not in critical user flows.

---

### Anti-Pattern 2: "Connect Wallet" Friction
**❌ DON'T:**
```
Landing page → "Connect Wallet" button
→ Wallet selector (Phantom, Backpack, etc.)
→ Approval modal
→ App opens
(User drops off at step 2)
```

**✅ DO:** (What we have with Privy)
```
Landing page → "Sign up" button
→ Email or social login (Privy handles wallet invisibly)
→ App opens
(Wallet already connected, user doesn't know it)
```

**Why:** Forcing wallet connection early kills growth. Privy's embedded wallet solves this.

---

### Anti-Pattern 3: Showing Gas Fees or Network Details to Users
**❌ DON'T:**
```
"Network fee: 0.00001 SOL estimated"
"Gas: ~~~"
"Execution method: CONFIRMED_AND_PARSED"
```

**✅ DO:**
```
"No transaction fee. We cover it all."
(Backend pays, users never see complexity)
```

**Why:** These details confuse users and make the product feel immature.
**Exception:** If user explicitly opts into "View Details" (advanced mode), show transaction ID + block number + cost breakdown.

---

### Anti-Pattern 4: Fake Proof
**❌ DON'T:**
```
"Stored on blockchain" (but actually just in database)
"Verified" (but no actual on-chain verification)
"Immutable" (but user data can be edited)
```

**✅ DO:**
```
Make it real. Every team actually stored on Solana.
Every claim actually sends SOL.
Every verification link actually works.
```

**Why:** One user will click the link, find it fake, and post on Twitter "Foresight is fake Web3"
**For judges:** This is dealbreaker #1. Make it real or don't claim it.

---

### Anti-Pattern 5: QR Codes or Seed Phrases Anywhere
**❌ DON'T:**
```
"Scan your wallet QR"
"Back up your seed phrase"
"Show me my private key"
```

**✅ DO:**
```
Use Privy embedded wallet (seed phrase managed by Privy, user never sees it)
If advanced users want export: Put it in Settings > Advanced > Export Keys
Require password confirmation to view
```

**Why:** Beginners don't understand this. Pros expect secure management. Privy handles both.

---

## Implementation Checklist (Priority Order)

### Phase 1: Critical Path (Affects Demo & First Impressions)
- [ ] **Wallet onboarding Step 3:** "Welcome! Wallet is ready" modal after Privy login
- [ ] **Prize display:** Update all prize amounts to show USD first, SOL second
- [ ] **Tapestry badge:** Change text from "Tapestry" to "Saved on Solana"
- [ ] **Success modal:** Show "Team Saved" confirmation with transaction ID link
- [ ] **Claim prize:** Full 4-state flow (win → confirm → process → celebrate)

### Phase 2: Delight (Polish, 3-5 hours)
- [ ] **Cost breakdown:** Entry fee modal shows itemized fees before payment
- [ ] **Processing state:** Animated UI during transaction (not just spinner)
- [ ] **Wallet balance:** Show in Settings, auto-refresh every 60s
- [ ] **Transaction links:** Make all transaction IDs clickable → Solana Explorer
- [ ] **Celebration animation:** Confetti or money animation on prize claim

### Phase 3: Advanced (Optional, Nice-to-Have)
- [ ] **SOL/USD ticker:** Real-time price updates (Coingecko API)
- [ ] **Wallet export:** Settings > Advanced > Export Keys with password protection
- [ ] **Transaction history:** Settings > Transactions (all entries, claims, winnings)
- [ ] **Earnings dashboard:** Profile > Earnings tab (lifetime $ earned)

---

## Copy Audit (What to Change Across App)

| Current Copy | New Copy | Reasoning |
|---|---|---|
| "Tapestry" | "Saved on Solana" | Users don't know Tapestry |
| "0.02 SOL" | "$0.47 (0.02 SOL)" | USD is primary context |
| "Connect Wallet" | "Sign up" | Less friction, wallet implicit |
| "Disconnect Wallet" | "Sign out" | More familiar terminology |
| "Verify entry" | "Entry confirmed" | Less jargon |
| "Published to Tapestry Protocol" | "Saved to Solana" | Simplified language |
| "Smart contract" | "Transaction" | Don't use unless explaining code |

---

## Competitive Benchmarks (Why These Patterns Work)

| App | Pattern | Why It Works | We Borrow |
|---|---|---|---|
| **Blur** (NFT) | Gas estimation with breakdown | Users feel in control, no surprises | Cost breakdown modal |
| **Sorare** (NFT) | Card claim → celebration screen | Creates emotional moment | Prize claim → celebration |
| **Rainbow Wallet** | Seed phrase never shown | Security + simplicity | Privy embedded wallet (no export for most) |
| **Axie Scholars** | Earnings dashboard | Scholars understand crypto | "Earned on Foresight" stat |
| **DraftKings** | Prize pool breakdown | Transparent payouts build trust | Itemized prize distribution |
| **Phantom Wallet** | Transaction details on-demand | Pro users can deep-dive | "View on Explorer" links |

---

## Success Metrics (How to Measure)

| Metric | Target | How to Track |
|---|---|---|
| Onboarding completion rate | > 85% | GA4: `/wallet-onboarding` → app load |
| Prize claim friction | 0 failed claims | Backend: /claim-prize success rate |
| Explorer link clicks | > 30% of claims | GA4: event tracking on "View on Explorer" |
| Crypto credibility feedback | 9/10 from judges | Demo Q&A: "Does this feel real?" |
| Transaction times | < 10 seconds | Backend: measure finality latency |

---

## FAQ for Implementation Team

**Q: Should we show seed phrases?**
A: No. Privy manages them. If advanced users want export: Settings > Advanced > Export (password-protected).

**Q: What if a transaction fails?**
A: Show clear error modal with next steps. "Insufficient balance?" → Link to buy SOL. "Network error?" → Retry button.

**Q: Real-time price updates—is that worth it?**
A: Yes, 1-2 hours to implement (Coingecko API + React context). Users checking SOL/USD rate = crypto native = high trust.

**Q: Can we hide wallet address on mobile?**
A: No. Show truncated (CDLf...F23J) on mobile, full address on hover/copy modal on desktop.

**Q: What if judges ask for seed phrase?**
A: "It's securely managed by Privy. You can export from Settings if you want to verify." (Shows you prioritize user security.)

---

## Next Steps

1. **Review with team:** Confirm copy changes + implementation order
2. **Design in Figma:** Create mockups for states 2-5 of each flow
3. **Implement Phase 1:** Wallet onboarding + prize display (highest impact)
4. **QA:** Test end-to-end on devnet with real Solana transactions
5. **Judges prep:** Record screen capture of "draft → claim prize" flow as proof of Solana integration

---

## Files to Update

| File | Change | Priority |
|---|---|---|
| `/frontend/src/pages/Home.tsx` | Update CTA copy, add "No Wallet?" messaging | P1 |
| `/frontend/src/pages/Draft.tsx` | Success modal: add "Team Saved" confirmation | P1 |
| `/frontend/src/pages/ContestDetail.tsx` | Prize display: USD first, SOL second | P1 |
| `/frontend/src/components/TapestryBadge.tsx` | Change label to "Saved on Solana" | P1 |
| `/frontend/src/components/new/WalletOnboardingModal.tsx` | Create new modal (Step 3) | P1 |
| `/frontend/src/components/onboarding/CostBreakdownModal.tsx` | Create new modal (entry fees) | P2 |
| `/frontend/src/components/new/PrizeClaimFlow.tsx` | Create 4-state component | P1 |
| `/backend/src/services/priceService.ts` | Add SOL/USD ticker logic | P3 |

---

## Reference: Competitor Deep-Dives

### Blur (Gas Estimation)
What they do: Show exact cost breakdown before user confirms
Why it works: Users feel smart + in control
Translation for us: Show entry fees before charge, prize distribution before claim

### Sorare (Card Reveal)
What they do: Long animation when card unlocks + celebration screen
Why it works: Emotional high point, shareable moment
Translation for us: Prize claim → celebration modal + confetti

### Rainbow Wallet (Seed Phrase)
What they do: Generate + manage seed phrase without showing user
Why it works: Security + UX balance
Translation for us: Use Privy embedded wallet (similar approach)

### Axie Scholars (Earnings Clarity)
What they do: "You earned $23.50 today" + wallet balance + withdrawal options
Why it works: Scholars are crypto-native but want clarity
Translation for us: "Earned on Foresight" stat + wallet balance display

---

## Key Takeaway

**Foresight's crypto UX should feel like:**
> "I drafted a team, it got saved automatically, I can verify it on the blockchain if I want, and when I win, the money actually arrives in my wallet."

**Not:** "I need to understand blockchain to play this game."

Execute the 7 deliverables above and judges will see a credible, trustworthy crypto product.
