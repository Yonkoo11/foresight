# CT Whisperer v2 - Complete Redesign

**Problem Identified**: Original CT Whisperer ("guess who tweeted this") is trivially exploitable - users can just search exact tweet text on Twitter.

**Solution**: Sentiment/Stance-based game - "What would [Influencer] say about [Topic]?" - completely un-searchable.

---

## ✅ What's Been Created

### 1. Database Schema
**File**: `/backend/migrations/20250120000000_redesign_ct_whisperer.ts`

**New Tables**:
- `whisperer_questions` - Question bank with topic + 4 options
- `whisperer_user_answers` - User submissions and correctness
- `whisperer_user_stats` - Leaderboard stats (XP, streaks, accuracy)
- `whisperer_daily_challenges` - Optional daily question feature

**Key Features**:
- Category breakdown (tech, market, governance, culture)
- Difficulty levels (easy, medium, hard)
- Streak tracking (current + best)
- XP system (NON-MONETIZED)
- Reference sources for admin verification

### 2. Sample Questions
**File**: `/backend/seeds/004_whisperer_questions.ts`

**10 Example Questions**:
- Vitalik on Solana's approach to scaling
- CZ on portfolio diversification
- Balaji on network states
- Cobie on NFT market crash
- Pomp on Bitcoin as inflation hedge
- Willy Woo on on-chain analytics
- Crypto Cobain on new altcoins
- Andreas on self-custody
- Peter Brandt on technical analysis

**Format**:
```
Question: "What would Vitalik say about Solana's network downtime?"

A) "Solana is fundamentally broken"
B) "Downtime is a learning experience for all blockchains" ✓ CORRECT
C) "Only Ethereum can achieve true decentralization"
D) "Solana should switch to rollups"

Explanation: Vitalik typically takes nuanced, charitable views...
```

###3. Backend API (PARTIALLY UPDATED)
**File**: `/backend/src/api/whisperer.ts`

**Status**: ⚠️ Partially migrated to new system

**Endpoints Needed**:
- ✅ `GET /api/whisperer/question` - Get random unanswered question
- ⏳ `POST /api/whisperer/answer` - Submit answer + get result
- ⏳ `GET /api/whisperer/stats` - Get user stats
- ⏳ `GET /api/whisperer/leaderboard` - Top players

---

## 🎯 Game Mechanics

### Non-Monetized Structure
```
Correct Answer:
├─ Easy: 10 XP
├─ Medium: 20 XP
└─ Hard: 30 XP

Speed Bonus: +5 XP (if answered in <10 seconds)

Wrong Answer: 0 XP (streak resets)
```

### Streak System
- **Current Streak**: Consecutive correct answers
- **Best Streak**: All-time record
- Breaks on first wrong answer
- Displayed on leaderboard

### Categories
- **Tech**: Protocols, development, scaling
- **Market**: Trading, price, investments
- **Governance**: Regulation, decentralization
- **Culture**: Memes, community, philosophy

### Leaderboard Rankings
- **Primary**: Total XP earned
- **Secondary**: Accuracy % (must answer ≥5 questions)
- **Tertiary**: Best streak

---

## 🔧 What Still Needs To Be Done

### Backend

1. **Complete API Migration**
   - Finish updating `/backend/src/api/whisperer.ts` with new endpoints
   - Remove old tweet-based logic entirely
   - Add helper function to update stats after each answer

2. **Run Migration**
   ```bash
   cd backend
   pnpm db:migrate
   ```

3. **Seed Questions**
   ```bash
   pnpm exec knex seed:run --specific=004_whisperer_questions.ts
   ```

4. **Register API Route**
   Make sure `/backend/src/server.ts` includes:
   ```typescript
   import whispererRouter from './api/whisperer';
   app.use('/api/whisperer', whispererRouter);
   ```

### Frontend

1. **Create New Whisperer UI**
   **File**: `/frontend/src/pages/Whisperer.tsx`

   **Design** (clean, minimal):
   ```
   ┌─────────────────────────────────────┐
   │ CT Whisperer                        │
   │ Test your knowledge of CT           │
   │                              Stats→ │
   ├─────────────────────────────────────┤
   │                                     │
   │  Vitalik Buterin (@VitalikButerin)  │
   │  ──────────────────────────────────│
   │                                     │
   │  "What would Vitalik say about     │
   │   Solana's network outages?"       │
   │                                     │
   │  Category: Tech • Difficulty: ⭐⭐  │
   │                                     │
   │  ┌───────────────────────────────┐ │
   │  │ A) Solana is broken           │ │
   │  └───────────────────────────────┘ │
   │  ┌───────────────────────────────┐ │
   │  │ B) Downtime benefits all... ✓│ │
   │  └───────────────────────────────┘ │
   │  ┌───────────────────────────────┐ │
   │  │ C) Only Ethereum works        │ │
   │  └───────────────────────────────┘ │
   │  ┌───────────────────────────────┐ │
   │  │ D) Switch to rollups          │ │
   │  └───────────────────────────────┘ │
   │                                     │
   │  [ Submit Answer ]                  │
   └─────────────────────────────────────┘
   ```

2. **Stats Modal**
   ```
   Your Stats
   ├─ Total Questions: 47
   ├─ Correct: 38 (80.9%)
   ├─ Total XP: 760
   ├─ Current Streak: 🔥 5
   └─ Best Streak: 12

   Category Breakdown:
   ├─ Tech: 18/20 (90%)
   ├─ Market: 12/15 (80%)
   ├─ Governance: 5/8 (62.5%)
   └─ Culture: 3/4 (75%)
   ```

3. **Leaderboard Modal**
   Simple ranked list:
   ```
   1. 0x742d...3f2a • 2,450 XP • 92% accuracy
   2. 0x891c...6b4e • 1,890 XP • 88% accuracy
   3. You            • 760 XP • 80.9% accuracy
   ```

4. **Result Feedback**
   After answering, show:
   - ✓ Correct! +20 XP or ✗ Wrong!
   - Correct answer highlight
   - Explanation text
   - [Next Question] button

---

## 🚀 Implementation Steps

### Step 1: Backend Setup
```bash
cd backend

# Run migration
pnpm db:migrate

# Seed sample questions
pnpm exec knex seed:run --specific=004_whisperer_questions.ts

# Verify tables exist
psql timecaster -c "\dt whisperer*"
```

### Step 2: Complete API
- Finish updating `/backend/src/api/whisperer.ts`
- Test endpoints with curl or Postman
- Verify stats calculations work

### Step 3: Build Frontend
- Create clean, simple UI (following Draft page decluttering principles)
- Add XP/streak displays
- Add smooth transitions for answer feedback
- Make it feel fun and snappy

### Step 4: Test Flow
1. User clicks "CT Whisperer" in nav
2. Gets random unanswered question
3. Selects answer
4. Sees immediate feedback (correct/wrong + explanation)
5. XP and streak update
6. Click "Next Question"
7. Repeat!

---

## 🎨 UI Principles (Following Draft Redesign)

**Keep it CLEAN**:
- ❌ No excessive gradients
- ❌ No walls of text
- ❌ No clutter

**Make it FOCUSED**:
- ✅ One question at a time
- ✅ Clear answer options
- ✅ Simple stats display
- ✅ Fast, responsive feedback

**Colors**:
- Gray/white for primary
- Cyan for correct answers
- Red for wrong answers
- Green for XP gains

---

## 📊 Success Metrics

### Engagement
- Average questions answered per user
- Daily active users
- Completion rate (don't abandon mid-game)

### Learning
- Accuracy improvement over time
- Category strengths/weaknesses
- Common wrong answers (to improve questions)

### Community
- Leaderboard competition
- Streak bragging rights
- Social sharing ("I got 12 in a row!")

---

## 🔮 Future Enhancements (V3)

1. **Daily Challenges**: One question everyone gets
2. **Head-to-Head**: 1v1 battles
3. **Custom Quizzes**: Create your own questions
4. **Badges**: "Vitalik Expert", "Market Maven", etc.
5. **AI-Generated Questions**: Scale question bank automatically
6. **Difficulty Adaptation**: Harder questions for better players

---

## ✨ Why This Works

### Un-Cheatable
- Can't search for opinions on Google
- Can't copy-paste into Twitter
- Requires actual CT knowledge

### Engaging
- Tests real understanding
- Feels like a fun quiz
- Instant gratification (XP + streaks)

### Educational
- Learn influencer positions
- Understand crypto philosophies
- Discover nuanced takes

### Non-Monetary
- No gambling/exploitation concerns
- Pure skill-based fun
- Builds reputation organically

---

## 🎯 Next Actions

1. ✅ Database schema created
2. ✅ Sample questions seeded
3. ⏳ Complete backend API
4. ⏳ Build frontend UI
5. ⏳ Test end-to-end flow
6. ⏳ Add 50+ more questions
7. ⏳ Launch!

---

Generated: January 20, 2025
