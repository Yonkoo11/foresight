# Creator Leagues — Technical Specification

> **Status:** MVP SPECIFICATION (Feb 27, 2026)
> **Audience:** Backend & Frontend Engineers
> **Purpose:** Detailed API, database, and implementation guide

---

## Overview

Creator Leagues allow users (influencers, brands, DAOs, power users) to launch their own branded contests on Foresight. Creator funds the prize via Solana escrow, Foresight handles scoring and payouts, takes a 10% rake.

**MVP Scope (Feb 27):**
- Database schema design (columns added)
- API endpoints (stubbed, non-functional)
- Frontend components (prototype, wireframe)
- Escrow flow (documented, not integrated)

**Full Implementation (March 2-15):**
- Solana escrow service (real transactions)
- Prize distribution automation
- Creator dashboard

---

## 1. Database Schema

### 1.1 Existing Schema (Already Done)

From `20260225100000_add_signature_league.ts`:

```sql
-- Already in prized_contests table:
ALTER TABLE prized_contests ADD COLUMN is_signature_league BOOLEAN DEFAULT false;
ALTER TABLE prized_contests ADD COLUMN creator_handle VARCHAR(100);
ALTER TABLE prized_contests ADD COLUMN creator_avatar_url VARCHAR(500);
ALTER TABLE prized_contests ADD COLUMN creator_follower_count INTEGER DEFAULT 0;
```

### 1.2 New Schema (MVP)

**Migration File:** `backend/migrations/20260227000000_add_creator_league_fields.ts`

```typescript
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Add creator league fields to prized_contests
  await knex.schema.alterTable('prized_contests', (table) => {
    table.uuid('creator_id').references('id').inTable('users').nullable();
    table.string('creator_wallet', 42).nullable(); // Solana public key
    table.string('prize_escrow_address', 42).nullable(); // Solana wallet holding funds
    table.decimal('prize_amount', 18, 8).nullable(); // Total prize in SOL
    table.decimal('entry_fee_amount', 18, 8).defaultTo(0); // Per-entry fee (0 = free)
    table.boolean('has_entry_fee').defaultTo(false);
    table.string('escrow_tx_hash', 66).nullable(); // Proof of funding
    table.enum('escrow_status', ['pending', 'confirmed', 'distributed', 'refunded']).defaultTo('pending');
    table.integer('max_players').defaultTo(0); // 0 = unlimited
    table.timestamp('escrow_confirmed_at').nullable();
  });

  // Index for fast lookups
  await knex.schema.alterTable('prized_contests', (table) => {
    table.index('creator_id');
    table.index('is_signature_league');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('prized_contests', (table) => {
    table.dropColumn('creator_id');
    table.dropColumn('creator_wallet');
    table.dropColumn('prize_escrow_address');
    table.dropColumn('prize_amount');
    table.dropColumn('entry_fee_amount');
    table.dropColumn('has_entry_fee');
    table.dropColumn('escrow_tx_hash');
    table.dropColumn('escrow_status');
    table.dropColumn('max_players');
    table.dropColumn('escrow_confirmed_at');
  });
}
```

### 1.3 Escaped Funds Tracking (Phase 2)

```sql
CREATE TABLE creator_league_escrows (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER REFERENCES prized_contests(id),
  creator_wallet VARCHAR(42) NOT NULL,
  escrow_wallet VARCHAR(42) NOT NULL,
  prize_amount DECIMAL(18, 8) NOT NULL,
  tx_hash VARCHAR(66) NOT NULL UNIQUE,
  status ENUM('pending', 'confirmed', 'released', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  released_at TIMESTAMP NULL,
  INDEX (contest_id),
  INDEX (creator_wallet)
);
```

---

## 2. API Endpoints

### 2.1 Create Creator League

**Endpoint:** `POST /api/v2/creator-leagues/create`

**Authentication:** Required (Bearer token)

**Request Body:**

```typescript
{
  // Required
  name: string;           // 10-100 chars, e.g., "Pomp's Weekly Draft"
  prizeAmount: number;    // SOL, 0.05-10.0
  duration: 'week' | 'day'; // 7 days or 24 hours

  // Optional
  description?: string;   // 0-300 chars
  entryFee?: number;      // SOL, 0-1.0 (default: 0 = free)
  maxPlayers?: number;    // 0 = unlimited (default: 0)
  customBannerUrl?: string; // Phase 2
  followersOnly?: boolean; // Phase 2
}
```

**Response (MVP - Before Escrow):**

```typescript
{
  success: true,
  data: {
    contestId: number;
    leagueName: string;
    escrowAddress: string;     // Solana wallet to send funds to
    escrowTxRequired: boolean; // true = creator must send SOL
    escrowTxTemplate: {
      to: string;              // Foresight escrow wallet
      amount: number;          // prize_amount in lamports
      memo: string;            // "CREATOR_LEAGUE:{contestId}"
    },
    nextStep: 'send_funds';
    estimatedLiveTime: string; // ISO timestamp
  }
}
```

**Error Responses:**

```typescript
// Validation errors
{
  success: false,
  error: "Prize amount must be between 0.05 and 10 SOL"
}

{
  success: false,
  error: "League name must be 10-100 characters"
}

{
  success: false,
  error: "No active user wallet connected"
}
```

**Implementation Notes:**
- Validate creator has Solana wallet connected
- Check prize amount is in allowed range
- Generate unique escrow wallet address (or use shared Foresight multisig)
- Store contest in `prized_contests` with `escrow_status='pending'`
- Return escrow details for frontend to prompt Solana signing

---

### 2.2 Confirm Escrow Funding

**Endpoint:** `POST /api/v2/creator-leagues/:id/confirm-escrow`

**Authentication:** Required (Bearer token, must be creator)

**Request Body:**

```typescript
{
  escrowTxHash: string;  // Solana transaction hash
}
```

**Response (MVP):**

```typescript
{
  success: true,
  data: {
    contestId: number;
    status: 'funded';
    escrowConfirmedAt: string; // ISO timestamp
    liveAt: string;            // When contest becomes visible
    contestUrl: string;        // /compete?type=contests&id=123
  }
}
```

**Implementation Notes:**
- Query Solana blockchain: `connection.getTransaction(txHash)`
- Verify transaction signature (creator's wallet)
- Verify recipient (Foresight escrow address)
- Verify amount (matches prize_amount)
- Update `prized_contests`: `escrow_status='confirmed'`, `escrow_tx_hash=txHash`
- Mark contest as `status='open'` (live for entries)
- Log event to `prized_contract_events`

---

### 2.3 List Creator Leagues

**Endpoint:** `GET /api/v2/creator-leagues`

**Authentication:** Optional

**Query Parameters:**

```
?status=open|locked|scoring|finalized
?is_live=true|false
?creator_id=<uuid>
?limit=20
?offset=0
```

**Response:**

```typescript
{
  success: true,
  data: [
    {
      id: number;
      name: string;
      description: string;
      creatorHandle: string;
      creatorAvatarUrl: string;
      creatorFollowerCount: number;
      prizeAmount: number;
      entryFee: number;
      status: 'open' | 'locked' | 'scoring' | 'finalized';
      playerCount: number;
      maxPlayers: number;
      lockTime: string; // ISO
      endTime: string;  // ISO
      duration: 'day' | 'week';
      escrowStatus: 'pending' | 'confirmed' | 'distributed' | 'refunded';
      entryUrl: string; // /draft?league=123
    }
  ],
  pagination: {
    total: number;
    offset: number;
    limit: number;
  }
}
```

---

### 2.4 Get Creator League Detail

**Endpoint:** `GET /api/v2/creator-leagues/:id`

**Authentication:** Optional

**Response:**

```typescript
{
  success: true,
  data: {
    id: number;
    name: string;
    description: string;
    creator: {
      id: uuid;
      username: string;
      handle: string;
      avatarUrl: string;
      followerCount: number;
      walletAddress: string;
    };
    contest: {
      prizeAmount: number;
      entryFee: number;
      status: string;
      playerCount: number;
      lockTime: string;
      endTime: string;
      duration: 'day' | 'week';
    };
    leaderboard: [
      {
        rank: number;
        username: string;
        score: number;
        teamId: number;
        prizeAmount: number;
      }
    ];
    escrow: {
      status: string;
      fundedAt: string;
      confirmTxHash: string;
    };
    isCreator: boolean; // Current user is creator?
  }
}
```

---

### 2.5 Modify Contests Endpoint

**Endpoint:** `GET /api/v2/contests` (existing)

**Add Filter:**

```
?is_signature_league=true|false
?creator_id=<uuid>
```

**Response Modification:** Add fields to each contest object:

```typescript
{
  // ... existing fields ...
  isSignatureLeague: boolean;
  creator: {
    id: uuid;
    username: string;
    handle: string;
    avatarUrl: string;
    followerCount: number;
  };
  prizeAmount?: number; // Only for creator leagues
  entryFee?: number;    // Only for creator leagues
}
```

---

## 3. Service Layer

### 3.1 Creator League Service

**File:** `backend/src/services/creatorLeagueService.ts`

```typescript
import db from '../utils/db';
import logger from '../utils/logger';

interface CreateLeagueInput {
  creatorId: string; // UUID
  name: string;
  description?: string;
  prizeAmount: number;
  entryFee: number;
  duration: 'day' | 'week';
  maxPlayers?: number;
}

interface CreatorLeague {
  id: number;
  creatorId: string;
  name: string;
  description: string;
  prizeAmount: number;
  entryFee: number;
  status: string;
  createdAt: Date;
}

export async function createLeague(input: CreateLeagueInput): Promise<CreatorLeague> {
  // Validate input
  if (input.name.length < 10 || input.name.length > 100) {
    throw new Error('League name must be 10-100 characters');
  }

  if (input.prizeAmount < 0.05 || input.prizeAmount > 10) {
    throw new Error('Prize amount must be between 0.05 and 10 SOL');
  }

  if (input.entryFee < 0 || input.entryFee > 1) {
    throw new Error('Entry fee must be between 0 and 1 SOL');
  }

  // Get contest type
  const contestType = input.duration === 'day'
    ? await db('contest_types').where('code', 'DAILY_FLASH').first()
    : await db('contest_types').where('code', 'FREE_LEAGUE').first();

  if (!contestType) {
    throw new Error('Invalid contest duration');
  }

  // Calculate lock/end times
  const now = new Date();
  const lockTime = input.duration === 'day'
    ? new Date(now.getTime() + 6 * 60 * 60 * 1000) // 6h from now
    : new Date();                                     // Immediately lock (for weekly)

  const endTime = new Date(lockTime.getTime() + (
    input.duration === 'day'
      ? 24 * 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000
  ));

  // Create contest
  const [league] = await db('prized_contests')
    .insert({
      contest_type_id: contestType.id,
      contract_contest_id: Date.now() % 100000, // Temp ID
      contract_address: `CREATOR_LEAGUE_${Date.now()}`,
      name: input.name,
      description: input.description || '',
      entry_fee: input.entryFee,
      team_size: 5,
      has_captain: true,
      is_free: input.entryFee === 0,
      rake_percent: 10,
      min_players: 2,
      max_players: input.maxPlayers || 0,
      lock_time: lockTime,
      end_time: endTime,
      status: 'open', // Will be 'pending_escrow' until funded
      player_count: 0,
      prize_pool: input.prizeAmount.toString(),
      distributable_pool: input.prizeAmount.toString(),
      is_signature_league: true,
      creator_id: input.creatorId,
      prize_amount: input.prizeAmount,
      entry_fee_amount: input.entryFee,
      escrow_status: 'pending',
      created_at: now,
      updated_at: now,
    })
    .returning('*');

  logger.info(`[CreatorLeagueService] League created: ${league.id} by ${input.creatorId}`);

  return league;
}

export async function getLeagueById(leagueId: number): Promise<CreatorLeague | null> {
  return db('prized_contests')
    .where('id', leagueId)
    .where('is_signature_league', true)
    .first();
}

export async function listLeaguesByCreator(creatorId: string): Promise<CreatorLeague[]> {
  return db('prized_contests')
    .where('creator_id', creatorId)
    .where('is_signature_league', true)
    .orderBy('created_at', 'desc');
}

export async function confirmEscrow(
  leagueId: number,
  creatorId: string,
  txHash: string
): Promise<CreatorLeague> {
  // Verify creator ownership
  const league = await db('prized_contests')
    .where('id', leagueId)
    .where('creator_id', creatorId)
    .first();

  if (!league) {
    throw new Error('League not found or unauthorized');
  }

  // TODO: Verify Solana tx (Phase 2)
  // const tx = await connection.getTransaction(txHash);
  // Verify amount, recipient, signature, etc.

  // Update league
  const [updated] = await db('prized_contests')
    .where('id', leagueId)
    .update({
      escrow_status: 'confirmed',
      escrow_tx_hash: txHash,
      escrow_confirmed_at: new Date(),
      status: 'open', // Live!
      updated_at: new Date(),
    })
    .returning('*');

  logger.info(`[CreatorLeagueService] Escrow confirmed: ${leagueId} tx=${txHash}`);

  return updated;
}
```

---

### 3.2 Escrow Service (Phase 2)

**File:** `backend/src/services/escrowService.ts` (stub for now)

```typescript
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import logger from '../utils/logger';

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

// Foresight's escrow wallet (multisig or standard)
const ESCROW_WALLET = new PublicKey(process.env.ESCROW_WALLET_PUBLIC_KEY!);

interface EscrowTransaction {
  signature: string;
  recipient: string;
  amount: number;
  timestamp: Date;
}

/**
 * Verify a Solana transaction was received
 * TODO: Implement in Phase 2
 */
export async function verifyEscrowTransaction(
  txHash: string,
  expectedAmount: number
): Promise<EscrowTransaction> {
  try {
    // Query blockchain
    const tx = await connection.getTransaction(txHash);

    if (!tx) {
      throw new Error(`Transaction not found: ${txHash}`);
    }

    // Verify amount and recipient
    // TODO: Check instructions, verify amounts, etc.

    logger.info(`[EscrowService] Verified tx: ${txHash}`);

    return {
      signature: txHash,
      recipient: ESCROW_WALLET.toBase58(),
      amount: expectedAmount,
      timestamp: new Date(tx.blockTime! * 1000),
    };
  } catch (error) {
    logger.error('[EscrowService] Error verifying tx:', error);
    throw error;
  }
}

/**
 * Distribute prize to winner
 * TODO: Implement in Phase 2
 */
export async function distributePrize(
  winnerWallet: string,
  amount: number
): Promise<string> {
  try {
    // Create transaction to send SOL from escrow to winner
    // Sign with Foresight's keypair
    // Send and confirm
    // Return tx hash

    logger.info(`[EscrowService] Distributing ${amount} SOL to ${winnerWallet}`);

    return 'txHashPlaceholder';
  } catch (error) {
    logger.error('[EscrowService] Error distributing prize:', error);
    throw error;
  }
}
```

---

## 4. Frontend Components

### 4.1 Creator League Teaser (MVP)

**File:** `frontend/src/components/CreatorLeagueTeaser.tsx`

```typescript
import { useState } from 'react';
import { Mail, Star, Trophy, Lock } from '@phosphor-icons/react';

export default function CreatorLeagueTeaser() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Send to waitlist (Phase 2)
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-gold-500/10 to-cyan-500/10 border border-gold-500/30 rounded-xl p-6 text-center">
        <Trophy className="w-8 h-8 text-gold-400 mx-auto mb-2" />
        <p className="text-white font-semibold">You're on the list!</p>
        <p className="text-gray-400 text-sm mt-1">
          We'll notify you when Creator Leagues launch (March 2026).
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gold-500/10 to-cyan-500/10 border border-gold-500/30 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <Star className="w-6 h-6 text-gold-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">
            Ready to Start Your Own League?
          </h3>
          <p className="text-gray-300 text-sm mt-2">
            Influencers, brands, and power users can launch branded Foresight
            contests with custom prizes. We handle scoring and prizes. You keep
            the community.
          </p>

          <div className="mt-4 space-y-2">
            {[
              '💰 Fund your own prize pool (0.05 - 10 SOL)',
              '🎯 Full control over contest name & description',
              '🏆 Escrow-protected prizes on Solana',
              '📊 Real-time leaderboard for your followers',
            ].map((feature, i) => (
              <p key={i} className="text-gray-300 text-sm flex items-center gap-2">
                <span>{feature}</span>
              </p>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Join Waitlist
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-2">
            Early access in March 2026. No spam, promise.
          </p>
        </div>
      </div>
    </div>
  );
}
```

### 4.2 Create League Modal (MVP - Prototype)

**File:** `frontend/src/components/CreateLeagueModal.tsx`

```typescript
import { useState } from 'react';
import { X, Info } from '@phosphor-icons/react';

interface Props {
  onClose: () => void;
}

export default function CreateLeagueModal({ onClose }: Props) {
  const [step, setStep] = useState<'form' | 'escrow' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prizeAmount: 0.5,
    entryFee: 0,
    duration: 'week',
  });

  // MVP: Just show the flow, don't actually submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('escrow');
  };

  const handleEscrowConfirm = () => {
    setStep('success');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">Create Your League</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  League Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Pomp's Weekly Draft"
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What makes your league special?"
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Prize (SOL) *
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.05"
                    max="10"
                    value={formData.prizeAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, prizeAmount: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Entry Fee (SOL)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.entryFee}
                    onChange={(e) =>
                      setFormData({ ...formData, entryFee: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Duration</label>
                <div className="flex gap-2">
                  {(['day', 'week'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData({ ...formData, duration: d })}
                      className={`flex-1 py-2 rounded-lg font-semibold text-sm transition ${
                        formData.duration === d
                          ? 'bg-gold-500 text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {d === 'day' ? '24 Hours' : '7 Days'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg transition"
              >
                Next: Fund Prize
              </button>
            </form>
          )}

          {step === 'escrow' && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm">MVP Prototype</p>
                  <p className="text-gray-400 text-xs mt-1">
                    In the real version, you'll sign a Solana transaction to fund the prize.
                  </p>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-semibold text-sm mb-3">
                  Prize Escrow Confirmation
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>League Name:</span>
                    <span className="font-semibold">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prize Amount:</span>
                    <span className="font-semibold">{formData.prizeAmount} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Escrow Wallet:</span>
                    <span className="font-mono text-xs">Foresight...public</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>✓ Funds will be held in escrow</p>
                <p>✓ Winners paid automatically</p>
                <p>✓ If contest fails, auto-refund</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleEscrowConfirm}
                  className="flex-1 py-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg"
                >
                  Sign Solana TX
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">League Created!</h3>
                <p className="text-gray-400 text-sm mt-1">{formData.name}</p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                <p className="text-gray-300">
                  Prize: <span className="text-white font-semibold">{formData.prizeAmount} SOL</span>
                </p>
                <p className="text-gray-300">
                  Status: <span className="text-emerald-400 font-semibold">Live & Accepting Entries</span>
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-gold-500 hover:bg-gold-600 text-black font-semibold rounded-lg"
                >
                  View League
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 5. Integrate Into Compete Page

**File:** `frontend/src/pages/Compete.tsx`

**Add to JSX (after existing Signature Leagues section):**

```typescript
import CreatorLeagueTeaser from '../components/CreatorLeagueTeaser';
import CreateLeagueModal from '../components/CreateLeagueModal';

export default function Compete() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div>
      {/* ... existing sections ... */}

      {/* Signature Leagues Carousel */}
      <section className="mt-8">
        <h2 className="text-sm font-bold text-gold-400 uppercase tracking-wide mb-4">
          Signature Leagues
        </h2>
        {/* carousel component */}
      </section>

      {/* Creator League Teaser */}
      <section className="mt-12">
        <CreatorLeagueTeaser />
      </section>

      {/* Create League Modal */}
      {showCreateModal && (
        <CreateLeagueModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
```

---

## 6. Testing Strategy (MVP)

### 6.1 Unit Tests

**File:** `backend/tests/services/creatorLeagueService.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createLeague, getLeagueById } from '../services/creatorLeagueService';

describe('CreatorLeagueService', () => {
  describe('createLeague', () => {
    it('should create a league with valid input', async () => {
      const league = await createLeague({
        creatorId: 'test-uuid',
        name: 'Test League',
        prizeAmount: 1.0,
        entryFee: 0,
        duration: 'week',
      });

      expect(league.id).toBeDefined();
      expect(league.name).toBe('Test League');
    });

    it('should reject league name too short', async () => {
      await expect(
        createLeague({
          creatorId: 'test-uuid',
          name: 'Short',
          prizeAmount: 1.0,
          entryFee: 0,
          duration: 'week',
        })
      ).rejects.toThrow('League name must be 10-100 characters');
    });

    it('should reject prize amount too low', async () => {
      await expect(
        createLeague({
          creatorId: 'test-uuid',
          name: 'Valid League Name',
          prizeAmount: 0.01, // Too low
          entryFee: 0,
          duration: 'week',
        })
      ).rejects.toThrow('Prize amount must be between 0.05 and 10 SOL');
    });
  });

  describe('getLeagueById', () => {
    it('should return league by id', async () => {
      const league = await getLeagueById(1);
      expect(league).toBeDefined();
    });
  });
});
```

---

## 7. Deployment Checklist (MVP)

**Before Launch:**
- [ ] Migration file created and tested
- [ ] API routes stubbed (non-functional)
- [ ] Frontend components built (prototype)
- [ ] Email/waitlist form working
- [ ] Documentation complete (this file + STRATEGY + QUICK_REFERENCE)
- [ ] CZ's Champions League visible on /compete (demo)
- [ ] "Coming Soon" teaser visible
- [ ] GitHub README mentions Creator Leagues in roadmap

**Phase 2 (Post-Hackathon):**
- [ ] Solana escrow service integrated
- [ ] Prize distribution working
- [ ] Creator dashboard built
- [ ] Influencer partnerships signed
- [ ] Twitter campaign launched

---

## 8. Environment Variables

**New vars needed (Phase 2):**

```bash
# .env
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
ESCROW_WALLET_PUBLIC_KEY=<keypair public key>
ESCROW_WALLET_PRIVATE_KEY=<keypair secret (encrypted)>
```

---

## Appendix: Database Schema Full Example

```sql
-- Full prized_contests table after migration
CREATE TABLE prized_contests (
  id SERIAL PRIMARY KEY,
  contest_type_id INTEGER,
  contract_contest_id INTEGER,
  contract_address VARCHAR(42),
  name VARCHAR(100),
  description TEXT,
  entry_fee DECIMAL(18,8),
  team_size INTEGER,
  has_captain BOOLEAN,
  is_free BOOLEAN,
  rake_percent DECIMAL(5,2),
  min_players INTEGER,
  max_players INTEGER,
  lock_time TIMESTAMP,
  end_time TIMESTAMP,
  status ENUM('open', 'locked', 'scoring', 'finalized', 'cancelled'),
  player_count INTEGER,
  prize_pool DECIMAL(18,8),
  distributable_pool DECIMAL(18,8),

  -- Signature League Fields (Feb 25)
  is_signature_league BOOLEAN DEFAULT false,
  creator_handle VARCHAR(100),
  creator_avatar_url VARCHAR(500),
  creator_follower_count INTEGER,

  -- Creator League Fields (Feb 27 - NEW)
  creator_id UUID REFERENCES users(id),
  creator_wallet VARCHAR(42),
  prize_escrow_address VARCHAR(42),
  prize_amount DECIMAL(18,8),
  entry_fee_amount DECIMAL(18,8),
  has_entry_fee BOOLEAN,
  escrow_tx_hash VARCHAR(66),
  escrow_status ENUM('pending', 'confirmed', 'distributed', 'refunded'),
  escrow_confirmed_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  INDEX (creator_id),
  INDEX (is_signature_league),
  INDEX (status)
);
```

---

**Document Version:** 1.0
**Last Updated:** Feb 27, 2026
**Status:** READY FOR IMPLEMENTATION

