# Crypto UX Quick Reference

> TL;DR of `/docs/design/CRYPTO_UX_FRAMEWORK.md` — Use this while implementing

---

## 1. Prize Display (Highest Impact)

### Current
```
0.02 SOL
```

### New (Everywhere)
```
$0.47 USD (0.02 SOL)
```

**Rules:**
- USD is bold/larger text (16px)
- SOL is smaller/gray (12px, monospace)
- Update every 60 seconds from Coingecko API
- If API fails: Show "$$0.47 (0.02 SOL) · updating..."

**Locations:**
- [ ] Contest list cards
- [ ] Contest detail prize breakdown
- [ ] Leaderboard rows
- [ ] Wallet balance (Settings)
- [ ] Prize claim modal
- [ ] Potential winnings everywhere

---

## 2. Wallet Address Display

**Show in 2 places (always):**
```
1. Profile header:      CDLf...F23J [Copy] [View]
2. Settings > Wallet:   CDLf...F23J [Copy] [View on Explorer]
```

**Rules:**
- Font: JetBrains Mono
- Size: 10px on desktop, 9px on mobile
- Truncate as: First 4 + ... + Last 4 chars
- Copy button: Icon only, hover → tooltip "Copy wallet address"
- Explorer link: Icon only, href `https://explorer.solana.com/address/{address}?cluster=devnet`

---

## 3. Transaction Links (Make Them Clickable)

**Every transaction ID should be:**
```
F5X7k... [Copy] [View on Solana Explorer] →
```

**Implementation:**
```tsx
<a href={`https://explorer.solana.com/tx/${txId}?cluster=devnet`}
   target="_blank" rel="noopener noreferrer"
   className="text-gold-400 hover:text-gold-300 inline-flex gap-1">
  {txId.slice(0, 8)}...
  <ArrowSquareOut size={12} />
</a>
```

---

## 4. Copy Changes (Search & Replace)

| Current | New | Location |
|---|---|---|
| "Tapestry" badge | "Saved on Solana" | Leaderboard, profile, badges |
| "Published to Tapestry Protocol" | "Saved to Solana" | Modals, confirmations |
| "Connect Wallet" | "Sign in" | CTA buttons, navigation |
| "Disconnect Wallet" | "Sign out" | Settings |
| "0.02 SOL" | "$0.47 (0.02 SOL)" | All currency displays |

---

## 5. Modals (In Priority Order)

### P1: Wallet Onboarding (After Privy Login)
**Duration:** 5 sec auto-dismiss OR user taps [Start Playing]

```
✓ Your Solana wallet is ready
✓ All teams & scores are stored on-chain
✓ Zero gas fees (we cover hosting)

Wallet: CDLf...F23J [Copy] [View on Solana]
[Start Playing]
```

### P1: Team Success Confirmation
**Replaces:** Simple "Team submitted!" toast

```
✓ Team Saved!
Your 5-player team is now stored on Solana's social graph.

Transaction: F5X7k... [Copy] [View]
Status: ✓ Immutable

[Share on Twitter] [Back to Contests]
```

### P1: Prize Claim Flow (4 states)
**State 1 - Win screen:**
```
🥇 1st Place!
Prize: $23.50 (0.5 SOL)
[Claim Prize]
```

**State 2 - Pre-claim modal:**
```
🎉 You won!
$23.50 will be sent to your wallet
CDLf...F23J (no fees, we cover it)

[Yes, Claim Prize] [Not Now]
```

**State 3 - Processing:**
```
💸 Sending Your Prize
0.5 SOL to CDLf...F23J
⟳ Processing < 5 sec
[View on Solana Explorer]
```

**State 4 - Success:**
```
✅ Prize Claimed!
$23.50 is now in your wallet

Transaction: F5X7k...
Status: ✓ Confirmed
Time: 2.3 seconds

New Balance: $35.88 (1.53 SOL)

[View on Explorer] [Play Again]
```

### P2: Entry Fee Breakdown
**Show before any payment**

```
⚡ Entry Cost Breakdown

Entry Fee:              $0.24 (0.01 SOL)
Foresight Platform:     $0.02 (0.001 SOL)
─────────────────────────────────────
Total:                  $0.26 (0.011 SOL)

✓ No hidden fees
✓ Transaction < 5 seconds
✓ See on Solana Explorer

[Confirm] [Cancel]
```

---

## 6. Tapestry Badge Evolution

**Before:** Just small "✓ Tapestry" text (users ignore)
**After:** Three-state badge

```
STATE 1: Not verified
[○ Not verified]

STATE 2: Verified
[✓ Saved on Solana] ← clickable

STATE 3: On hover/click
┌─────────────────────────────┐
│ ✓ Verified on Solana        │
│ Team is permanent + verified│
│ [View on Explorer] →        │
└─────────────────────────────┘
```

---

## 7. No Hidden Fees Statement

**Add to every transaction:**
```
✓ No hidden fees
✓ What you see is what you pay
```

**Locations:**
- Entry fee modal
- Prize payout breakdown
- Settings > Billing (if added)

---

## 8. Balance Display (Settings)

```
SETTINGS > WALLET

💰 Your Solana Wallet
Address: CDLf...F23J [Copy]

Balance:
$12.47 USD
0.53 SOL (as of now) [Refresh]

Earned on Foresight:
+$23.50 (2 wins)

[Export Keys (advanced)]
[View on Solana Explorer]
[Disconnect Wallet]
```

---

## 9. Phase 1 Implementation (Priority)

### Must-do (5 items, ~4 hours)
1. Update prize display everywhere (USD first)
2. Create wallet onboarding modal
3. Create team success + confirmation modal
4. Create prize claim flow (4 states)
5. Change "Tapestry" label → "Saved on Solana"

### Should-do (2 items, ~2 hours)
6. Entry fee breakdown modal
7. Make all transaction IDs clickable

### Nice-to-have (~3 hours)
8. Real-time SOL/USD ticker
9. Processing animations
10. Wallet balance display refresh

---

## 10. Testing Checklist

Before shipping:
- [ ] Prize display shows USD + SOL everywhere
- [ ] Wallet address visible in 2+ places
- [ ] All transaction links click → Solana Explorer (real txs)
- [ ] Modals render on mobile (44px buttons)
- [ ] Copy buttons work (toast "Copied!")
- [ ] Links to Solana Explorer work (don't break on testnet)
- [ ] SOL/USD price updates every 60s (or shows cached)
- [ ] No console errors on any modal
- [ ] Prize claim success modal shows correct amount
- [ ] "No fees" statement shows on entry + claim

---

## 11. Judges/Demo Talking Points

When showing this to judges:
1. **Wallet:** "We use Privy embedded wallet. User never sees seed phrase. Fully managed, secure."
2. **Transaction:** "Every team is actually saved to Solana. Click [View on Solana] — it's real."
3. **Prize claim:** "When they win, real SOL transfers to their wallet. Not a promise, an actual transaction."
4. **Tapestry:** "All social data (follows, likes, comments) is stored on Solana via Tapestry Protocol."
5. **No code changes required:** "This is all UI/UX improvements. Backend already working."

---

## 12. Files to Update (Copy-Paste)

### `/frontend/src/pages/Home.tsx`
Search for:
```
Start Playing
```
Add hover state:
```
Free to play. No fees. On Solana.
```

### `/frontend/src/components/TapestryBadge.tsx`
Search for:
```
Tapestry
```
Replace with:
```
Saved on Solana
```

### All prize displays
Search for:
```jsx
{prizeAmount} SOL
```
Replace with:
```jsx
${(prizeAmount * solPrice).toFixed(2)} USD ({prizeAmount} SOL)
```

---

## 13. Design Tokens (No Changes Needed)

Existing tokens work:
- Gold: `gold-500` (#F59E0B) — primary actions
- Gray: `gray-400` — secondary text
- Green: `emerald-500` (#10B981) — success/confirmed
- Red: `rose-500` (#F43F5E) — errors
- Monospace: JetBrains Mono (wallet addresses)

---

## 14. Mobile Considerations

- Wallet address on mobile: Truncate more aggressively
  ```
  CDLf...F23J  (4+4 chars minimum)
  ```
- Modals: Full-screen on mobile, center on desktop
- Buttons: 44px minimum height (touch target)
- Prize display: Stack USD above SOL on mobile
  ```
  $0.47
  0.02 SOL (gray, smaller)
  ```
- Copy buttons: Expand on tap (show full address in modal)

---

## 15. Common Pitfalls (Don't Do These)

- ❌ Don't explain "What is Solana?" in onboarding
- ❌ Don't hide wallet address
- ❌ Don't show transaction IDs without links
- ❌ Don't forget "No fees" statement
- ❌ Don't use "Tapestry Protocol" in user-facing copy
- ❌ Don't make users export seed phrases
- ❌ Don't delay showing confirmation (show immediately)
- ❌ Don't leave users wondering if transaction succeeded

---

## 16. Success Metrics

Track these:
- `onboarding_complete` — % of users who see wallet modal + tap "Start Playing"
- `prize_claim_rate` — % of winners who actually claim (should be > 95%)
- `explorer_click_rate` — % who click "View on Solana" (target > 30%)
- `crypto_native_feedback` — Judge responses on demo ("Does this feel real?")

---

## Questions?

See full framework: `/docs/design/CRYPTO_UX_FRAMEWORK.md`
