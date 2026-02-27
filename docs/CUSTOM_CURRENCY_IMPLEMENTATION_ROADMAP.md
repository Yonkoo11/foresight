# ALPHA Token Implementation Roadmap

**Status:** Technical Specification (Feb 27, 2026)
**Scope:** Phase 1 (Hackathon) – Non-Tradeable In-Game Currency
**Effort:** 15 engineering hours
**Complexity:** Low (database accounting, no blockchain)
**Risk Level:** Minimal

---

## Overview: What Is ALPHA in Phase 1?

ALPHA is a **non-tradeable game credit** earned by winning contests and spent on cosmetics.

```
Player wins contest
  ↓
Foresight ranks them (1st place = 500 ALPHA, 100th place = 50 ALPHA)
  ↓
User's alpha_balance increases by earned amount
  ↓
User visits cosmetics shop
  ↓
User spends ALPHA on avatar customization, badges, colors
  ↓
Cosmetic purchase burns ALPHA from their balance and grants cosmetic to profile
```

**No blockchain, no trading, no volatility. Just game currency.**

---

## Part 1: Database Schema Changes (2 hours)

### 1.1 Add ALPHA Balance to Users Table

```sql
-- File: backend/migrations/20260227_add_alpha_to_users.ts
export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('users', table => {
    table.bigInteger('alpha_balance').defaultTo(0).comment('Non-tradeable game currency earned from contests');
    table.timestamp('last_alpha_earned_at').defaultTo(knex.fn.now()).comment('Track last contest win time');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('users', table => {
    table.dropColumn('alpha_balance');
    table.dropColumn('last_alpha_earned_at');
  });
}
```

### 1.2 Create Cosmetics Table

```sql
-- File: backend/migrations/20260227_create_cosmetics.ts
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cosmetics', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable(); // "Golden Avatar Frame"
    table.string('slug').unique().notNullable(); // "golden-avatar-frame"
    table.text('description');
    table.integer('alpha_cost').notNullable(); // Price in ALPHA
    table.enum('category', ['badge', 'color', 'animation', 'frame', 'border']).notNullable();
    table.string('icon_url').nullable(); // Preview image
    table.boolean('limited_edition').defaultTo(false);
    table.integer('max_purchasers').nullable(); // NULL = unlimited
    table.integer('current_purchasers').defaultTo(0); // Track for limited editions
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('cosmetics');
}
```

### 1.3 Create Cosmetic Purchases Table

```sql
-- File: backend/migrations/20260227_create_cosmetic_purchases.ts
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('cosmetic_purchases', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('cosmetic_id').notNullable().references('id').inTable('cosmetics').onDelete('CASCADE');
    table.integer('alpha_spent').notNullable(); // Store cost at time of purchase (for auditing if prices change)
    table.timestamp('purchased_at').defaultTo(knex.fn.now());
    table.timestamps(true, true);
    table.unique(['user_id', 'cosmetic_id']); // Each user can only purchase each cosmetic once
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('cosmetic_purchases');
}
```

### 1.4 Create ALPHA Ledger Table (Audit Trail)

```sql
-- File: backend/migrations/20260227_create_alpha_ledger.ts
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('alpha_ledger', table => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.enum('type', ['earned', 'spent', 'burned', 'refunded']).notNullable();
    table.bigInteger('amount').notNullable();
    table.string('reason').notNullable(); // "Won contest: 1st place", "Purchased: Golden Frame", etc.
    table.uuid('related_id').nullable(); // Contest ID, cosmetic_purchase ID, etc. for tracing
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Index for efficient ledger queries
  await knex.schema.raw(`
    CREATE INDEX idx_alpha_ledger_user_id ON alpha_ledger(user_id);
    CREATE INDEX idx_alpha_ledger_created_at ON alpha_ledger(created_at DESC);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('alpha_ledger');
}
```

---

## Part 2: Scoring Service Updates (3 hours)

### 2.1 ALPHA Reward Distribution Function

```typescript
// File: backend/src/services/alphaRewardService.ts

import { db } from '../db';
import { logger } from '../utils/logger';

interface ContestResults {
  contestId: string;
  totalPlayers: number;
  rankings: {
    rank: number;
    userId: string;
    score: number;
  }[];
}

/**
 * Distribute ALPHA rewards to top 100 finishers
 * Uses logarithmic scale: 1st place gets most, 100th place gets least
 */
export async function distributeAlphaRewards(results: ContestResults): Promise<void> {
  const { contestId, totalPlayers, rankings } = results;

  // Only distribute to top 100 finishers
  const topPlayers = rankings.slice(0, Math.min(100, rankings.length));

  const alphaAllocations: Array<{ userId: string; amount: number; rank: number }> = [];

  for (const { rank, userId, score } of topPlayers) {
    // Logarithmic reward curve:
    // Rank 1: 500 ALPHA
    // Rank 10: 300 ALPHA
    // Rank 50: 150 ALPHA
    // Rank 100: 50 ALPHA

    const alphaAmount = Math.max(
      50,
      Math.round(500 * Math.log(102 - rank) / Math.log(101))
    );

    alphaAllocations.push({ userId, amount: alphaAmount, rank });
  }

  // Atomically update all balances and log to ledger
  await db.transaction(async trx => {
    for (const { userId, amount, rank } of alphaAllocations) {
      // Update user's ALPHA balance
      await trx('users')
        .where('id', userId)
        .increment('alpha_balance', amount)
        .update('last_alpha_earned_at', new Date());

      // Log to ledger (immutable audit trail)
      await trx('alpha_ledger').insert({
        user_id: userId,
        type: 'earned',
        amount,
        reason: `Won contest (Rank #${rank})`,
        related_id: contestId,
      });
    }

    logger.info(`Distributed ALPHA to ${alphaAllocations.length} players in contest ${contestId}`);
  });
}

/**
 * Spend ALPHA on cosmetic (burn from balance)
 */
export async function purchaseCosmetic(
  userId: string,
  cosmeticId: string
): Promise<void> {
  const cosmetic = await db('cosmetics').where('id', cosmeticId).first();

  if (!cosmetic) {
    throw new Error('Cosmetic not found');
  }

  const user = await db('users').where('id', userId).first();

  if (user.alpha_balance < cosmetic.alpha_cost) {
    throw new Error('Insufficient ALPHA balance');
  }

  if (cosmetic.limited_edition && cosmetic.current_purchasers >= cosmetic.max_purchasers) {
    throw new Error('Limited edition cosmetic sold out');
  }

  // Check if already purchased
  const existing = await db('cosmetic_purchases')
    .where({ user_id: userId, cosmetic_id: cosmeticId })
    .first();

  if (existing) {
    throw new Error('You already own this cosmetic');
  }

  await db.transaction(async trx => {
    // Deduct ALPHA
    await trx('users')
      .where('id', userId)
      .decrement('alpha_balance', cosmetic.alpha_cost);

    // Record purchase
    await trx('cosmetic_purchases').insert({
      user_id: userId,
      cosmetic_id: cosmeticId,
      alpha_spent: cosmetic.alpha_cost,
    });

    // Increment purchase counter for limited editions
    if (cosmetic.limited_edition) {
      await trx('cosmetics')
        .where('id', cosmeticId)
        .increment('current_purchasers', 1);
    }

    // Log to ledger
    await trx('alpha_ledger').insert({
      user_id: userId,
      type: 'spent',
      amount: cosmetic.alpha_cost,
      reason: `Purchased cosmetic: ${cosmetic.name}`,
      related_id: cosmeticId,
    });
  });
}

/**
 * Get user's ALPHA history (for ledger view)
 */
export async function getAlphaHistory(userId: string, limit = 50): Promise<any[]> {
  return db('alpha_ledger')
    .where('user_id', userId)
    .orderBy('created_at', 'desc')
    .limit(limit);
}
```

### 2.2 Update Contest Scoring to Call Alpha Distribution

```typescript
// File: backend/src/services/fantasyScoreService.ts (update existing)

export async function finalizeContest(contestId: string): Promise<void> {
  // ... existing scoring logic ...

  // After scores are final, distribute ALPHA
  const results = await getContestResults(contestId);
  await distributeAlphaRewards({
    contestId,
    totalPlayers: results.totalPlayers,
    rankings: results.rankings,
  });

  // ... rest of finalization ...
}
```

---

## Part 3: API Endpoints (3 hours)

### 3.1 User ALPHA Balance Endpoint

```typescript
// File: backend/src/api/alpha.ts

import express from 'express';
import { requireAuth } from '../middleware/auth';
import { db } from '../db';
import { getAlphaHistory } from '../services/alphaRewardService';

const router = express.Router();

/**
 * GET /api/alpha/balance
 * Get user's current ALPHA balance and total earned
 */
router.get('/balance', requireAuth, async (req, res) => {
  try {
    const user = await db('users')
      .where('id', req.userId)
      .select('alpha_balance', 'last_alpha_earned_at')
      .first();

    const totalEarned = await db('alpha_ledger')
      .where({ user_id: req.userId, type: 'earned' })
      .sum('amount as total')
      .first();

    res.json({
      success: true,
      data: {
        balance: user.alpha_balance,
        totalEarned: totalEarned.total || 0,
        lastEarned: user.last_alpha_earned_at,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/alpha/history
 * Get user's ALPHA transaction history
 */
router.get('/history', requireAuth, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const history = await getAlphaHistory(req.userId, limit);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

### 3.2 Cosmetics Browse Endpoint

```typescript
// File: backend/src/api/cosmetics.ts

import express from 'express';
import { requireAuth } from '../middleware/auth';
import { db } from '../db';

const router = express.Router();

/**
 * GET /api/cosmetics
 * Browse all cosmetics with availability
 */
router.get('/', async (req, res) => {
  try {
    const category = req.query.category as string;

    let query = db('cosmetics').select(
      'id',
      'name',
      'slug',
      'description',
      'alpha_cost',
      'category',
      'icon_url',
      'limited_edition',
      db.raw('(max_purchasers - current_purchasers) as available')
    );

    if (category) {
      query = query.where('category', category);
    }

    const cosmetics = await query.orderBy('alpha_cost');

    res.json({
      success: true,
      data: cosmetics,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/cosmetics/:id
 * Get single cosmetic details
 */
router.get('/:id', async (req, res) => {
  try {
    const cosmetic = await db('cosmetics').where('id', req.params.id).first();

    if (!cosmetic) {
      return res.status(404).json({ success: false, error: 'Cosmetic not found' });
    }

    res.json({
      success: true,
      data: cosmetic,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/cosmetics/:id/purchase
 * Buy a cosmetic with ALPHA
 */
router.post('/:id/purchase', requireAuth, async (req, res) => {
  try {
    const { purchaseCosmetic } = await import('../services/alphaRewardService');
    await purchaseCosmetic(req.userId, req.params.id);

    // Get updated balance
    const user = await db('users').where('id', req.userId).first();

    res.json({
      success: true,
      data: {
        message: 'Cosmetic purchased successfully',
        newBalance: user.alpha_balance,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/cosmetics/owned
 * Get user's owned cosmetics
 */
router.get('/owned', requireAuth, async (req, res) => {
  try {
    const owned = await db('cosmetics')
      .innerJoin('cosmetic_purchases', 'cosmetics.id', 'cosmetic_purchases.cosmetic_id')
      .where('cosmetic_purchases.user_id', req.userId)
      .select('cosmetics.*', 'cosmetic_purchases.purchased_at');

    res.json({
      success: true,
      data: owned,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
```

### 3.3 Leaderboard ALPHA Ranking

```typescript
// File: backend/src/api/leaderboard.ts (update existing)

/**
 * GET /api/leaderboard/alpha
 * Get leaderboard ranked by total ALPHA earned
 */
router.get('/alpha', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 1000);
    const offset = parseInt(req.query.offset as string) || 0;

    const leaderboard = await db('users')
      .select('id', 'username', 'avatar_url', 'alpha_balance')
      .where('alpha_balance', '>', 0)
      .orderBy('alpha_balance', 'desc')
      .limit(limit)
      .offset(offset);

    // Add rank to each entry
    const ranked = leaderboard.map((user, idx) => ({
      ...user,
      rank: offset + idx + 1,
    }));

    res.json({
      success: true,
      data: ranked,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## Part 4: Frontend Components (5 hours)

### 4.1 AlphaWallet Component

```typescript
// File: frontend/src/components/AlphaWallet.tsx

import React, { useEffect, useState } from 'react';
import { formatNumber } from '../utils/formatting';

interface AlphaBalance {
  balance: number;
  totalEarned: number;
  lastEarned: string;
}

export function AlphaWallet() {
  const [balance, setBalance] = useState<AlphaBalance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    try {
      const res = await fetch('/api/alpha/balance', {
        headers: { Authorization: `Bearer ${localStorage.authToken}` },
      });
      const { data } = await res.json();
      setBalance(data);
    } catch (error) {
      console.error('Failed to fetch ALPHA balance:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!balance) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gold-500">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">ALPHA Balance</p>
          <p className="text-2xl font-bold text-gold-500">
            {formatNumber(balance.balance)}
          </p>
          <p className="text-gray-500 text-xs">Total Earned: {formatNumber(balance.totalEarned)}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">Last Earned</p>
          <p className="text-gold-500 font-mono text-sm">
            {balance.lastEarned ? new Date(balance.lastEarned).toLocaleDateString() : '—'}
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 4.2 CosmeticsShop Component

```typescript
// File: frontend/src/components/CosmeticsShop.tsx

import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';

interface Cosmetic {
  id: string;
  name: string;
  description: string;
  alpha_cost: number;
  category: string;
  icon_url: string;
  limited_edition: boolean;
  available: number;
}

export function CosmeticsShop() {
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchCosmetics();
    fetchBalance();
  }, [category]);

  async function fetchCosmetics() {
    try {
      const url = category === 'all'
        ? '/api/cosmetics'
        : `/api/cosmetics?category=${category}`;
      const res = await fetch(url);
      const { data } = await res.json();
      setCosmetics(data);
    } catch (error) {
      console.error('Failed to fetch cosmetics:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchBalance() {
    try {
      const res = await fetch('/api/alpha/balance', {
        headers: { Authorization: `Bearer ${localStorage.authToken}` },
      });
      const { data } = await res.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }

  async function purchaseCosmetic(cosmeticId: string, cost: number) {
    if (balance < cost) {
      alert(`Insufficient ALPHA. Need ${cost}, have ${balance}`);
      return;
    }

    try {
      const res = await fetch(`/api/cosmetics/${cosmeticId}/purchase`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.authToken}` },
      });

      if (res.ok) {
        const { data } = await res.json();
        setBalance(data.newBalance);
        alert('Cosmetic purchased!');
        fetchCosmetics(); // Refresh available cosmetics
      } else {
        const { error } = await res.json();
        alert(`Error: ${error}`);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center">
        {['all', 'badge', 'color', 'animation', 'frame'].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded ${
              category === cat
                ? 'bg-gold-500 text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Loading cosmetics...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cosmetics.map(cosmetic => (
            <div key={cosmetic.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              {cosmetic.icon_url && (
                <img src={cosmetic.icon_url} alt={cosmetic.name} className="w-full h-20 object-cover rounded mb-2" />
              )}
              <h3 className="font-bold text-sm text-white">{cosmetic.name}</h3>
              <p className="text-gray-400 text-xs mb-2">{cosmetic.description}</p>

              {cosmetic.limited_edition && (
                <p className="text-gold-500 text-xs font-bold mb-2">
                  Limited: {cosmetic.available} left
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gold-500 font-bold">{cosmetic.alpha_cost} ALPHA</span>
                <Button
                  onClick={() => purchaseCosmetic(cosmetic.id, cosmetic.alpha_cost)}
                  size="sm"
                  variant="primary"
                  disabled={balance < cosmetic.alpha_cost || cosmetic.available === 0}
                >
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 4.3 AlphaLeaderboard Component

```typescript
// File: frontend/src/components/AlphaLeaderboard.tsx

import React, { useEffect, useState } from 'react';
import { formatNumber } from '../utils/formatting';

interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  avatar_url: string;
  alpha_balance: number;
}

export function AlphaLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await fetch('/api/leaderboard/alpha?limit=100');
      const { data } = await res.json();
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h2 className="text-xl font-bold text-gold-500 mb-4">ALPHA Leaderboard</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-gray-400 py-2">Rank</th>
              <th className="text-left text-gray-400 py-2">Player</th>
              <th className="text-right text-gray-400 py-2">ALPHA</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="py-3 font-bold text-gold-500">#{entry.rank}</td>
                <td className="py-3 flex items-center gap-2">
                  <img src={entry.avatar_url} alt={entry.username} className="w-6 h-6 rounded-full" />
                  <span className="text-white">{entry.username}</span>
                </td>
                <td className="py-3 text-right text-gold-500 font-bold">
                  {formatNumber(entry.alpha_balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## Part 5: Testing & Validation (2 hours)

### 5.1 Backend Tests

```typescript
// File: backend/tests/services/alphaRewardService.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../src/db';
import { distributeAlphaRewards, purchaseCosmetic } from '../../src/services/alphaRewardService';

describe('AlphaRewardService', () => {
  beforeEach(async () => {
    // Reset test DB
    await db('alpha_ledger').del();
    await db('cosmetic_purchases').del();
    await db('users').del();
  });

  describe('distributeAlphaRewards', () => {
    it('should distribute ALPHA correctly to top 100 finishers', async () => {
      // Setup
      const users = await Promise.all([
        db('users').insert({ id: 'user1', username: 'player1' }).returning('*'),
        db('users').insert({ id: 'user2', username: 'player2' }).returning('*'),
        db('users').insert({ id: 'user3', username: 'player3' }).returning('*'),
      ]);

      // Distribute rewards
      await distributeAlphaRewards({
        contestId: 'contest1',
        totalPlayers: 100,
        rankings: [
          { rank: 1, userId: 'user1', score: 300 },
          { rank: 2, userId: 'user2', score: 280 },
          { rank: 3, userId: 'user3', score: 260 },
        ],
      });

      // Verify balances
      const user1 = await db('users').where('id', 'user1').first();
      const user2 = await db('users').where('id', 'user2').first();
      const user3 = await db('users').where('id', 'user3').first();

      expect(user1.alpha_balance).toBeGreaterThan(user2.alpha_balance);
      expect(user2.alpha_balance).toBeGreaterThan(user3.alpha_balance);
      expect(user1.alpha_balance).toBeGreaterThanOrEqual(500); // 1st place
    });

    it('should ignore players beyond top 100', async () => {
      await db('users').insert({ id: 'user101', username: 'player101' });

      await distributeAlphaRewards({
        contestId: 'contest1',
        totalPlayers: 150,
        rankings: Array.from({ length: 150 }, (_, i) => ({
          rank: i + 1,
          userId: `user${i + 1}`,
          score: 300 - i,
        })),
      });

      const user101 = await db('users').where('id', 'user101').first();
      expect(user101.alpha_balance).toBe(0); // No reward
    });

    it('should create immutable ledger entries', async () => {
      await db('users').insert({ id: 'user1', username: 'player1' });

      await distributeAlphaRewards({
        contestId: 'contest1',
        totalPlayers: 100,
        rankings: [{ rank: 1, userId: 'user1', score: 300 }],
      });

      const ledger = await db('alpha_ledger').where('user_id', 'user1');
      expect(ledger.length).toBe(1);
      expect(ledger[0].type).toBe('earned');
      expect(ledger[0].reason).toContain('Won contest');
    });
  });

  describe('purchaseCosmetic', () => {
    it('should deduct ALPHA and record purchase', async () => {
      // Setup
      await db('users').insert({ id: 'user1', username: 'player1', alpha_balance: 1000 });
      await db('cosmetics').insert({
        id: 'cosmetic1',
        name: 'Golden Frame',
        slug: 'golden-frame',
        alpha_cost: 500,
        category: 'frame',
      });

      // Purchase
      await purchaseCosmetic('user1', 'cosmetic1');

      // Verify
      const user = await db('users').where('id', 'user1').first();
      expect(user.alpha_balance).toBe(500);

      const purchase = await db('cosmetic_purchases').where('user_id', 'user1').first();
      expect(purchase).toBeDefined();
      expect(purchase.alpha_spent).toBe(500);
    });

    it('should prevent duplicate purchases', async () => {
      await db('users').insert({ id: 'user1', username: 'player1', alpha_balance: 1000 });
      await db('cosmetics').insert({
        id: 'cosmetic1',
        name: 'Golden Frame',
        slug: 'golden-frame',
        alpha_cost: 500,
        category: 'frame',
      });

      await purchaseCosmetic('user1', 'cosmetic1');

      // Second purchase should fail
      await expect(purchaseCosmetic('user1', 'cosmetic1')).rejects.toThrow(
        'You already own this cosmetic'
      );
    });

    it('should reject purchase with insufficient balance', async () => {
      await db('users').insert({ id: 'user1', username: 'player1', alpha_balance: 100 });
      await db('cosmetics').insert({
        id: 'cosmetic1',
        name: 'Golden Frame',
        slug: 'golden-frame',
        alpha_cost: 500,
        category: 'frame',
      });

      await expect(purchaseCosmetic('user1', 'cosmetic1')).rejects.toThrow(
        'Insufficient ALPHA balance'
      );
    });

    it('should track limited edition availability', async () => {
      await db('users').insert({ id: 'user1', username: 'player1', alpha_balance: 1000 });
      await db('cosmetics').insert({
        id: 'cosmetic1',
        name: 'Ultra Rare Badge',
        slug: 'ultra-rare-badge',
        alpha_cost: 500,
        category: 'badge',
        limited_edition: true,
        max_purchasers: 10,
      });

      // First 10 purchases succeed
      for (let i = 0; i < 10; i++) {
        const userId = `user${i}`;
        await db('users').insert({ id: userId, username: `player${i}`, alpha_balance: 1000 });
        await purchaseCosmetic(userId, 'cosmetic1');
      }

      // 11th purchase fails
      await db('users').insert({ id: 'user11', username: 'player11', alpha_balance: 1000 });
      await expect(purchaseCosmetic('user11', 'cosmetic1')).rejects.toThrow(
        'Limited edition cosmetic sold out'
      );
    });
  });
});
```

### 5.2 Integration Test (API Flow)

```typescript
// File: backend/tests/api/alpha.integration.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { request } from 'supertest';
import app from '../../src/app';
import { db } from '../../src/db';

describe('Alpha API Integration', () => {
  beforeEach(async () => {
    await db.truncate();
  });

  it('should return ALPHA balance and history', async () => {
    const userId = 'user1';
    const token = await createTestToken(userId);

    // Setup user with ALPHA
    await db('users').insert({
      id: userId,
      username: 'testuser',
      alpha_balance: 500,
    });

    await db('alpha_ledger').insert({
      user_id: userId,
      type: 'earned',
      amount: 500,
      reason: 'Won contest',
    });

    // Fetch balance
    const response = await request(app)
      .get('/api/alpha/balance')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.balance).toBe(500);
    expect(response.body.data.totalEarned).toBe(500);
  });

  it('should allow purchasing cosmetic', async () => {
    const userId = 'user1';
    const token = await createTestToken(userId);

    await db('users').insert({
      id: userId,
      username: 'testuser',
      alpha_balance: 1000,
    });

    await db('cosmetics').insert({
      id: 'cosmetic1',
      name: 'Test Frame',
      slug: 'test-frame',
      alpha_cost: 500,
      category: 'frame',
    });

    const response = await request(app)
      .post('/api/cosmetics/cosmetic1/purchase')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.newBalance).toBe(500);
  });
});
```

---

## Part 6: Deployment Checklist (30 minutes)

### 6.1 Database Migrations

```bash
# Ensure all migrations are created
ls -la backend/migrations/ | grep alpha

# Running on production (AFTER reviewing)
cd backend
NODE_OPTIONS='--import tsx' pnpm exec knex migrate:latest
```

### 6.2 Seed Cosmetics Data

```typescript
// File: backend/migrations/20260227_seed_cosmetics.ts

export async function up(knex: Knex): Promise<void> {
  const cosmetics = [
    {
      name: 'Golden Avatar Frame',
      slug: 'golden-avatar-frame',
      description: 'Premium golden border for your avatar',
      alpha_cost: 500,
      category: 'frame',
      limited_edition: false,
    },
    {
      name: 'Legendary Grinder Badge',
      slug: 'legendary-grinder-badge',
      description: 'Earned 50K+ ALPHA lifetime',
      alpha_cost: 1000,
      category: 'badge',
      limited_edition: true,
      max_purchasers: 50,
    },
    {
      name: 'Alpha Leaderboard Color',
      slug: 'alpha-leaderboard-color',
      description: 'Appear in gold on leaderboards',
      alpha_cost: 250,
      category: 'color',
      limited_edition: false,
    },
    {
      name: 'Animated Formation',
      slug: 'animated-formation',
      description: 'Smooth animation effects on your team',
      alpha_cost: 750,
      category: 'animation',
      limited_edition: false,
    },
  ];

  for (const cosmetic of cosmetics) {
    await knex('cosmetics').insert({
      id: knex.raw('gen_random_uuid()'),
      ...cosmetic,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('cosmetics').del();
}
```

### 6.3 Update Main App Router

```typescript
// File: backend/src/app.ts (update existing)

import alphaRouter from './api/alpha';
import cosmeticsRouter from './api/cosmetics';

// ... existing setup ...

app.use('/api/alpha', alphaRouter);
app.use('/api/cosmetics', cosmeticsRouter);

// ... rest of app ...
```

---

## Part 7: UI Integration Points

### Add AlphaWallet to Dashboard

```typescript
// File: frontend/src/pages/Home.tsx (update existing)

import { AlphaWallet } from '../components/AlphaWallet';

export function HomePage() {
  return (
    <div className="space-y-6">
      <AlphaWallet />
      {/* ... rest of dashboard ... */}
    </div>
  );
}
```

### Add CosmeticsShop to Profile

```typescript
// File: frontend/src/pages/Profile.tsx (update existing)

import { CosmeticsShop } from '../components/CosmeticsShop';

export function ProfilePage() {
  return (
    <div className="space-y-6">
      {/* ... existing profile content ... */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cosmetics Shop</h2>
        <CosmeticsShop />
      </section>
    </div>
  );
}
```

---

## Timeline

| Phase | Task | Hours | Owner | Status |
|-------|------|-------|-------|--------|
| **1** | Database schema (4 tables) | 2 | Backend | TODO |
| **2** | Scoring service (distribute + purchase) | 3 | Backend | TODO |
| **3** | API endpoints (5 endpoints) | 3 | Backend | TODO |
| **4** | Frontend components (3 components) | 5 | Frontend | TODO |
| **5** | Testing (unit + integration) | 2 | QA | TODO |
| **6** | Deployment & seeding | 1 | DevOps | TODO |
| **TOTAL** | | **16 hours** | | |

---

## Success Criteria

- [ ] Users earn ALPHA from contests (logged to ledger)
- [ ] ALPHA balance displays in dashboard
- [ ] Cosmetics browse/purchase flow works
- [ ] ALPHA leaderboard shows top earners
- [ ] Limited edition cosmetics track availability
- [ ] All tests pass (unit + integration + API)
- [ ] Production database migrated successfully
- [ ] Zero ALPHA balance discrepancies (ledger = actual)
- [ ] Cosmetics appear on user profiles

---

## Questions & Decisions

**Q: What if we run out of cosmetics ideas?**
A: Start with 10-15 cosmetics, add more monthly based on player feedback.

**Q: Can players trade/gift ALPHA?**
A: NO. Phase 1 is non-tradeable only. This keeps it a game currency, not a crypto asset.

**Q: What prevents ALPHA inflation?**
A: Fixed reward pool per contest (500 ALPHA for 1st, decreasing to 50th). Cosmetics burn ALPHA. Seasonal resets.

**Q: Can we reset ALPHA between seasons?**
A: NO for Phase 1. All ALPHA persists. Phase 2+ can add seasonal economy if needed.

---

*This roadmap is Phase 1 only. Once product validates, proceed to Phase 2 (soulbound tokens) and Phase 3 (tradeable, if justified).*
