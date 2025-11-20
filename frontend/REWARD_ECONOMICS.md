# Timecaster Reward Economics

## Overview
Timecaster uses a **hybrid dual-token reward system** combining ETH rewards (revenue-funded) with reputation points (inflationary) to create a sustainable, non-exploitable economy.

## 🎯 Daily Gauntlet Prize Pool (Existing)

### How It Works
- **Entry Fee**: 0.05 ETH per gauntlet
- **Prize Pool**: 100% of entry fees (zero-sum game)
- **Distribution**:
  - 5/5 correct: 50% of pool (split among winners)
  - 4/5 correct: 35% of pool (split among winners)
  - 3/5 correct: 15% of pool (split among winners)

### Economic Model
```
Revenue = Entry Fees × Participants
Payouts = 100% of Revenue (redistributed)
House Take = 0% (but could add small % for sustainability)
```

**Status**: ✅ Sustainable (zero-sum, not a ponzi)

---

## 🎁 Quest Reward System (New - Anti-Exploit)

### Two-Tier Rewards

#### 1. **Reputation Points** (Free, Inflationary)
- Awarded instantly for completing quests
- Used for:
  - Leaderboard rankings
  - Unlocking advanced features
  - Multipliers on future rewards
- **No vesting, no withdrawal limits**

#### 2. **ETH Bonuses** (Revenue-Funded, Limited)
- Small bonuses for milestones and streaks
- **Monthly budget cap**: 10 ETH per month
- **Vesting period**: 7 days
- **Daily withdrawal limit**: 0.1 ETH per user
- **Funded by**: Protocol fees, Treasury

### Quest Tiers

#### **Tier 1: Beginner** (Points Only)
- `first_gauntlet`: Complete first Daily Gauntlet (+50 points)
- `first_duel`: Complete first Arena duel (+50 points)
- `first_prediction`: Make your first prediction (+30 points)

#### **Tier 2: Intermediate** (Points + Small ETH)
- `daily_login_7`: Log in 7 days in a row (+100 points, 0.001 ETH)
- `weekly_streak_7`: Play gauntlet 7 days straight (+200 points, 0.005 ETH)
- `perfect_score`: Get 5/5 on gauntlet (+150 points, 0.003 ETH)

#### **Tier 3: Advanced** (Larger ETH Bonuses)
- `monthly_streak_30`: 30-day play streak (+500 points, 0.05 ETH)
- `reputation_milestone_500`: Reach 500 reputation (+0.02 ETH)
- `win_10_duels`: Win 10 arena duels (+300 points, 0.01 ETH)

#### **Tier 4: Referral** (Anti-Sybil)
- `refer_1_friend`: Refer active friend (+200 points, 0.01 ETH)
  - **Requirements**:
    - Referee must play 3+ games
    - Referee must deposit 0.05+ ETH
    - 30-day waiting period (prevents instant extraction)
    - IP hashing (prevents same-person multi-accounting)
  - **Cap**: Max 10 referrals per user

### Anti-Exploit Mechanisms

#### 🛡️ **Multi-Factor Verification**
```typescript
Eligibility Checks:
├── Account Age (min 7 days for ETH rewards)
├── Wallet Age (on-chain history required)
├── Games Played (min 3 for intermediate rewards)
├── Reputation Score (gates advanced rewards)
├── Cooldown Period (prevents quest farming)
└── IP Hashing (Sybil resistance)
```

#### 🔒 **Vesting & Limits**
```typescript
ETH Rewards Flow:
1. Quest Completed → ETH locked for 7 days
2. After 7 days → Becomes claimable
3. Daily limit → Max 0.1 ETH withdrawal/day
4. Monthly budget → Max 10 ETH distributed/month
```

#### 🚫 **Budget Management**
```solidity
// Smart contract auto-adjusts rewards if budget low
if (monthlyBudget.remaining < requestedAmount) {
    awardAmount = monthlyBudget.remaining; // Reduce to available
}
```

#### 🚨 **Flagging System**
- Backend can flag suspicious users (prevents claiming)
- Requires manual review by owner to unflag
- Tracks: IP hash, completion velocity, pattern matching

### Economic Sustainability

#### Revenue Sources (Fund Quest Rewards)
1. **Protocol Fees**: Small % from gauntlet/arena/draft (not yet implemented)
2. **Treasury**: Initial seeding from team/investors
3. **Sponsorships**: Future partnerships with DeFi protocols
4. **Referral Partnerships**: Affiliate revenue

#### Example Monthly Budget
```
Monthly Allocation: 10 ETH
├── Beginner Quests (0%): 0 ETH (points only)
├── Intermediate Quests (30%): 3 ETH
├── Advanced Quests (50%): 5 ETH
└── Referral Rewards (20%): 2 ETH

Expected Distribution:
- ~500 users completing intermediate quests
- ~100 users completing advanced quests
- ~50 successful referrals
= Total payout: 6-8 ETH (under budget)
```

---

## 💰 Complete User Earning Potential

### Example: Active Daily Player

#### **Month 1 Earnings**
```
Daily Gauntlet Winnings (30 days):
├── Entry Cost: -1.5 ETH (0.05 × 30)
├── Winnings (assuming 4.2/5 avg): +2.1 ETH
└── Net Gauntlet: +0.6 ETH

Quest Bonuses:
├── first_gauntlet: +50 pts, 0 ETH
├── daily_login_7: +100 pts, 0.001 ETH (vested)
├── weekly_streak_7: +200 pts, 0.005 ETH (vested)
├── perfect_score × 3: +450 pts, 0.009 ETH (vested)
├── monthly_streak_30: +500 pts, 0.05 ETH (vested)
└── Total Quests: +1,300 pts, 0.065 ETH (vested)

TOTAL MONTH 1:
✅ +0.6 ETH (gauntlet, instant)
✅ +0.065 ETH (quests, 7-day vest)
✅ +1,300 reputation points
= ~0.665 ETH + reputation
```

#### **Month 3+ Earnings (Compounding)**
```
Higher skill → better gauntlet scores → larger winnings
Higher reputation → unlocks advanced quests
Referrals → passive income
= Sustainable income stream
```

---

## 🔐 Security & Exploit Prevention Summary

### What We Prevent
| Attack Vector | Prevention Mechanism |
|--------------|---------------------|
| **Sybil Attacks** | Multi-wallet detection, IP hashing, account age, deposit requirements |
| **Bot Farming** | Skill-based gates (gauntlet scores), time investment required |
| **Instant Extraction** | 7-day vesting, daily withdrawal limits |
| **Budget Draining** | Monthly caps, dynamic reward reduction, global completion limits |
| **Quest Farming** | Cooldown periods, single completion per user |
| **Referral Abuse** | 30-day waiting period, referee activity requirements, max 10 per user |

### What Makes It Sustainable
1. **Gauntlet is zero-sum**: No new ETH created, just redistributed
2. **Quest rewards are capped**: 10 ETH/month maximum
3. **Vesting reduces velocity**: 7-day lock prevents rapid extraction
4. **Points are inflationary**: Reputation has no direct ETH value
5. **Revenue sources**: Protocol can add small fees to fund quest pool

---

## 📊 Comparison: Before vs After

### Before (Just Gauntlet)
```
Pros:
✅ Zero-sum, sustainable
✅ Skill-based

Cons:
❌ Looks like ponzi (just redistributing fees)
❌ No retention incentives
❌ No streak rewards
```

### After (Gauntlet + Quests)
```
Pros:
✅ Still zero-sum on core game
✅ Skill-based with progression
✅ Quest bonuses funded separately
✅ Multi-layered anti-exploit
✅ Retention via streaks & reputation

Risks Mitigated:
✅ Vesting prevents instant extraction
✅ Budget caps prevent draining
✅ Multi-factor checks prevent Sybil
✅ Flagging system handles edge cases
```

---

## 🚀 Next Steps

### Immediate (Production-Ready)
- [x] QuestRewards smart contract deployed
- [x] Database migration for quest tracking
- [ ] **Frontend integration** (show quest rewards in UI)
- [ ] Run database migration
- [ ] Deploy QuestRewards contract to Base Sepolia
- [ ] Seed quest definitions in database

### Short-Term (Week 1-2)
- [ ] Add small protocol fee (1-2%) on gauntlet to fund quest pool
- [ ] Implement admin dashboard for quest monitoring
- [ ] Add user flagging interface for moderators
- [ ] Create leaderboard showing reputation

### Medium-Term (Month 1-2)
- [ ] Launch referral program with tracking
- [ ] Add reputation-gated features (e.g., private leagues)
- [ ] Implement streak multipliers on gauntlet winnings
- [ ] Partner with DeFi protocols for sponsored quests

---

## 💡 Key Insight

**The magic is in the hybrid model**:
- Gauntlet = competitive, zero-sum, high variance
- Quests = progressive, capped, low variance

Players can:
1. **Grind for income** via gauntlet skill
2. **Build reputation** via consistent quests
3. **Earn bonuses** via milestones & referrals

This creates:
- Retention (daily login streaks)
- Growth (referral incentives)
- Skill ceiling (gauntlet mastery)
- Progression (reputation system)

**Result**: Sustainable P2E economy that's actually "play-to-earn", not "pay-to-lose".
