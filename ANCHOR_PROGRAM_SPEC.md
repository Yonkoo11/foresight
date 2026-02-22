# ANCHOR PROGRAM SPECIFICATION
## Technical Blueprint for Contest Finalization

**Document:** Technical Implementation Guide
**Status:** Ready for Development
**Effort:** 20-25 hours
**Timeline:** Days 1-2 of 5-day sprint

---

## OVERVIEW

### What the Program Does

Single Anchor program (`foresight-contests`) with one instruction:
- **Instruction:** `finalize_contest()`
- **Input:** contest_id, winners list, score hash
- **Storage:** One PDA per contest
- **Outcome:** Immutable proof that contest results exist and were published

### Program Structure

```
solana/programs/foresight-contests/
├── Cargo.toml
├── Xargo.toml
└── src/
    ├── lib.rs              (main program)
    ├── state.rs            (data structures)
    └── instructions/
        └── finalize_contest.rs
```

### Key Principle

**Off-chain is master, on-chain is witness.**
- Scoring happens in PostgreSQL (fast, complex calculations)
- Results published to Solana (immutable, verifiable)
- Frontend always queries database (source of truth)
- Blockchain is optional verification layer

---

## DEVELOPMENT SETUP

### Prerequisites
```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli --locked
```

### Project Generation
```bash
cd /Users/mujeeb/foresight/solana
anchor init foresight-contests
cd foresight-contests
```

### Initial Directory Structure
```
foresight-contests/
├── Anchor.toml                 # Project config
├── Cargo.toml                  # Rust dependencies
├── package.json                # JS client generation
├── programs/
│   └── foresight-contests/
│       ├── Cargo.toml
│       └── src/
│           └── lib.rs
└── tests/
    └── foresight-contests.ts
```

---

## STEP 1: Define Data Structures (state.rs)

### File: `programs/foresight-contests/src/state.rs`

```rust
use anchor_lang::prelude::*;

/// Account holding finalized contest results
/// PDA seeds: ["contest", contest_id.to_le_bytes()]
#[account]
pub struct ContestResult {
    /// Contest ID (from Foresight PostgreSQL)
    pub contest_id: u64,

    /// Top 10 winner wallet addresses
    /// Fixed array to avoid variable-length account issues
    pub winners: [Pubkey; 10],

    /// Commitment hash of all scores (SHA256)
    /// format: sha256(JSON.stringify({wallet, score}))
    /// enables verification without storing all data
    pub score_hash: [u8; 32],

    /// Unix timestamp when contest ended
    pub timestamp: i64,

    /// Authority that finalized this contest
    pub authority: Pubkey,

    /// Bump seed for PDA derivation
    pub bump: u8,
}

impl ContestResult {
    /// Space calculation for account allocation
    /// const: 8 (discriminator)
    /// u64: 8 (contest_id)
    /// [Pubkey; 10]: 32 * 10 = 320
    /// [u8; 32]: 32 (score_hash)
    /// i64: 8 (timestamp)
    /// Pubkey: 32 (authority)
    /// u8: 1 (bump)
    /// Total: 409 bytes + 8 = 417 bytes (rounded to 440)
    pub const SPACE: usize = 8 + 8 + 320 + 32 + 8 + 32 + 1;
}
```

### Why These Fields?

| Field | Purpose | Why This Size |
|-------|---------|---|
| `contest_id` | Link to PostgreSQL record | u64 = 18 billion contests max |
| `winners` | Top 10 wallets | Fixed array (no dynamic sizing issues) |
| `score_hash` | Proof of scores | SHA256 = 32 bytes always |
| `timestamp` | When finalized | i64 = Unix timestamp |
| `authority` | Who signed | Pubkey = 32 bytes |
| `bump` | PDA derivation | u8 = derived by Anchor |

---

## STEP 2: Define Instructions (lib.rs)

### File: `programs/foresight-contests/src/lib.rs`

```rust
use anchor_lang::prelude::*;
use std::mem;

mod state;
mod instructions;

use state::ContestResult;
use instructions::finalize_contest::*;

declare_id!("YOUR_PROGRAM_ID_WILL_BE_GENERATED");

#[program]
pub mod foresight_contests {
    use super::*;

    /// Finalize a contest by storing results on-chain
    ///
    /// # Arguments
    /// * `contest_id` - ID from Foresight database
    /// * `winners` - Top 10 wallet addresses
    /// * `score_hash` - SHA256 hash of all final scores
    ///
    /// # Returns
    /// On success, creates PDA and stores immutable result
    pub fn finalize_contest(
        ctx: Context<FinalizeContest>,
        contest_id: u64,
        winners: [Pubkey; 10],
        score_hash: [u8; 32],
    ) -> Result<()> {
        let contest_result = &mut ctx.accounts.contest_result;

        contest_result.contest_id = contest_id;
        contest_result.winners = winners;
        contest_result.score_hash = score_hash;
        contest_result.timestamp = Clock::get()?.unix_timestamp;
        contest_result.authority = ctx.accounts.authority.key();
        contest_result.bump = ctx.bumps.contest_result;

        emit!(ContestFinalized {
            contest_id,
            timestamp: contest_result.timestamp,
            authority: ctx.accounts.authority.key(),
        });

        Ok(())
    }
}

/// Event emitted when contest is finalized
#[event]
pub struct ContestFinalized {
    pub contest_id: u64,
    pub timestamp: i64,
    pub authority: Pubkey,
}

/// Accounts needed for finalize_contest instruction
#[derive(Accounts)]
#[instruction(contest_id: u64)]
pub struct FinalizeContest<'info> {
    /// Authority account (pays rent, signs transaction)
    /// Must be owned by the backend
    #[account(mut)]
    pub authority: Signer<'info>,

    /// ContestResult PDA
    /// Derived from: ["contest", contest_id.to_le_bytes()]
    /// This ensures one result per contest_id
    #[account(
        init,
        payer = authority,
        space = ContestResult::SPACE,
        seeds = [b"contest", contest_id.to_le_bytes().as_ref()],
        bump
    )]
    pub contest_result: Account<'info, ContestResult>,

    /// Solana system program
    pub system_program: Program<'info, System>,
}
```

### Key Concepts

**`#[account(...)]` Macro:**
- `init` = Create the account (will fail if already exists)
- `payer = authority` = Authority pays rent (5,000 lamports for ~440 bytes)
- `space = ContestResult::SPACE` = Pre-allocate space
- `seeds = [...]` = PDA derivation deterministic
- `bump` = Anchor finds bump automatically

**Why PDA (Program Derived Account)?**
- No private key needed (derived from seeds)
- One contest = one PDA (contest_id determines address)
- Safe (can't create duplicates)

---

## STEP 3: Create Instructions Module

### File: `programs/foresight-contests/src/instructions/mod.rs`

```rust
pub mod finalize_contest;

pub use finalize_contest::*;
```

### File: `programs/foresight-contests/src/instructions/finalize_contest.rs`

```rust
use anchor_lang::prelude::*;
use crate::state::ContestResult;

#[derive(Accounts)]
#[instruction(contest_id: u64)]
pub struct FinalizeContest<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = ContestResult::SPACE,
        seeds = [b"contest", contest_id.to_le_bytes().as_ref()],
        bump
    )]
    pub contest_result: Account<'info, ContestResult>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<FinalizeContest>,
    contest_id: u64,
    winners: [Pubkey; 10],
    score_hash: [u8; 32],
) -> Result<()> {
    let contest_result = &mut ctx.accounts.contest_result;

    contest_result.contest_id = contest_id;
    contest_result.winners = winners;
    contest_result.score_hash = score_hash;
    contest_result.timestamp = Clock::get()?.unix_timestamp;
    contest_result.authority = ctx.accounts.authority.key();
    contest_result.bump = ctx.bumps.contest_result;

    Ok(())
}
```

---

## STEP 4: Update Cargo Dependencies

### File: `programs/foresight-contests/Cargo.toml`

```toml
[package]
name = "foresight-contests"
version = "0.1.0"
edition = "2021"

[dependencies]
anchor-lang = "0.30.0"
anchor-spl = "0.30.0"
solana-program = "1.18.0"

[lib]
crate-type = ["cdylib", "lib"]

[profile.release]
overflow-checks = false

[profile.release.package."*"]
overflow-checks = false
```

---

## STEP 5: Build & Test Locally

### Build the Program

```bash
cd /Users/mujeeb/foresight/solana/foresight-contests

# Build (generates IDL)
anchor build

# Output:
# - target/deploy/foresight_contests-keypair.json (authority key)
# - target/deploy/foresight_contests.so (compiled program)
# - target/idl/foresight_contests.json (TypeScript types)
```

### Update Anchor.toml with Program ID

```toml
# Anchor.toml
[programs.devnet]
foresight_contests = "YOUR_PROGRAM_ID"
```

### Write Tests

### File: `tests/foresight-contests.ts`

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ForesightContests } from "../target/types/foresight_contests";
import { expect } from "chai";

describe("foresight-contests", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ForesightContests as Program<ForesightContests>;

  it("Finalizes a contest", async () => {
    const contestId = new anchor.BN(6);
    const authority = provider.wallet.publicKey;

    // Mock winners (top 10)
    const winners = [
      authority,
      authority,
      authority,
      authority,
      authority,
      new anchor.web3.PublicKey("11111111111111111111111111111111"),
      new anchor.web3.PublicKey("11111111111111111111111111111111"),
      new anchor.web3.PublicKey("11111111111111111111111111111111"),
      new anchor.web3.PublicKey("11111111111111111111111111111111"),
      new anchor.web3.PublicKey("11111111111111111111111111111111"),
    ] as [anchor.web3.PublicKey, anchor.web3.PublicKey, anchor.web3.PublicKey,
           anchor.web3.PublicKey, anchor.web3.PublicKey, anchor.web3.PublicKey,
           anchor.web3.PublicKey, anchor.web3.PublicKey, anchor.web3.PublicKey,
           anchor.web3.PublicKey];

    // Mock score hash
    const scoreHash = Buffer.alloc(32);
    scoreHash.write("0123456789abcdef0123456789abcdef", 0, 32, "hex");

    // Derive PDA
    const [contestResultPda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("contest"),
        contestId.toBuffer("le", 8),
      ],
      program.programId
    );

    // Call finalize_contest
    const tx = await program.methods
      .finalizeContest(contestId, winners, scoreHash)
      .accounts({
        authority,
        contestResult: contestResultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Transaction signature:", tx);

    // Verify account was created
    const contestResult = await program.account.contestResult.fetch(contestResultPda);
    expect(contestResult.contestId.toNumber()).to.equal(6);
    expect(contestResult.winners[0].toString()).to.equal(authority.toString());
  });
});
```

### Run Tests

```bash
# Start local validator
solana-test-validator

# In another terminal:
cd solana/foresight-contests
anchor test
```

---

## STEP 6: Deploy to Devnet

### Generate Program ID

```bash
solana-keygen generate --outfile target/deploy/foresight_contests-keypair.json
solana address -k target/deploy/foresight_contests-keypair.json
# Output: AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOp (copy this)
```

### Update Anchor.toml

```toml
[programs.devnet]
foresight_contests = "AbCdEfGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKlMnOp"
```

### Deploy

```bash
# Set to Devnet
solana config set --url https://api.devnet.solana.com

# Get SOL from faucet
solana airdrop 2

# Deploy
anchor deploy --provider.cluster devnet

# Verify
solana program info foresight_contests -um devnet
```

---

## STEP 7: Backend Integration (Node.js)

### File: `backend/src/blockchain/solana.ts`

```typescript
import { Connection, clusterApiUrl, PublicKey, Keypair, Transaction } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import IDL from '../../../solana/target/idl/foresight_contests.json';

// Configuration
const RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
const PROGRAM_ID = new PublicKey(process.env.FORESIGHT_PROGRAM_ID!);
const AUTHORITY_SECRET = process.env.SOLANA_AUTHORITY_KEY!; // base58 encoded

// Initialize connection
const connection = new Connection(RPC_URL, 'confirmed');
const authorityKeypair = Keypair.fromSecretKey(
  new Uint8Array(bs58.decode(AUTHORITY_SECRET))
);

// Initialize program
const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(authorityKeypair), {
  commitment: 'confirmed',
});
const program = new anchor.Program(IDL as anchor.Idl, PROGRAM_ID, provider);

/**
 * Finalize a contest on-chain
 * Called when contest scoring ends (Sun 23:59 UTC)
 */
export async function finalizeContestOnChain(
  contestId: number,
  winners: string[],  // wallet addresses
  scoreHash: Buffer   // SHA256 hash
): Promise<{ success: boolean; signature?: string; error?: string }> {
  try {
    // Derive PDA for this contest
    const [contestResultPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('contest'),
        new anchor.BN(contestId).toBuffer('le', 8),
      ],
      PROGRAM_ID
    );

    // Convert winners to PublicKeys, pad to 10
    const winnerPubkeys: PublicKey[] = [];
    for (let i = 0; i < 10; i++) {
      if (i < winners.length) {
        winnerPubkeys.push(new PublicKey(winners[i]));
      } else {
        // Pad with system program (placeholder)
        winnerPubkeys.push(new PublicKey('11111111111111111111111111111111'));
      }
    }

    // Create transaction
    const tx = await program.methods
      .finalizeContest(
        new anchor.BN(contestId),
        winnerPubkeys as [PublicKey, ...PublicKey[]],
        scoreHash
      )
      .accounts({
        authority: authorityKeypair.publicKey,
        contestResult: contestResultPda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authorityKeypair])
      .rpc();

    logger.info(`Contest ${contestId} finalized on-chain: ${tx}`, {
      context: 'BlockchainIntegration',
    });

    return { success: true, signature: tx };
  } catch (error) {
    logger.error(`Failed to finalize contest on-chain: ${error.message}`, error, {
      context: 'BlockchainIntegration',
      data: { contestId },
    });

    return { success: false, error: error.message };
  }
}

/**
 * Query contest results from on-chain
 */
export async function getContestResultOnChain(
  contestId: number
): Promise<ContestResult | null> {
  try {
    const [contestResultPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('contest'),
        new anchor.BN(contestId).toBuffer('le', 8),
      ],
      PROGRAM_ID
    );

    const result = await program.account.contestResult.fetch(contestResultPda);
    return result;
  } catch (error) {
    logger.warn(`Contest result not found on-chain for contest ${contestId}`, {
      context: 'BlockchainIntegration',
    });
    return null;
  }
}

export interface ContestResult {
  contestId: anchor.BN;
  winners: PublicKey[];
  scoreHash: number[];
  timestamp: anchor.BN;
  authority: PublicKey;
  bump: number;
}
```

### Wire Into Contest Finalization Cron

### File: `backend/src/cron/contestLifecycle.ts`

```typescript
import { finalizeContestOnChain } from '../blockchain/solana';

async function finalizeContest(contestId: number) {
  try {
    // 1. Calculate scores in PostgreSQL
    const leaderboard = await calculateLeaderboard(contestId);

    // 2. Publish scores to Tapestry
    for (const entry of leaderboard) {
      const user = await db('users').where({ id: entry.user_id }).first();
      if (user?.tapestry_user_id) {
        await tapestryService.storeScore(user.tapestry_user_id, user.id, {
          contestId: contestId.toString(),
          totalScore: entry.final_score,
          rank: entry.rank,
          breakdown: entry.breakdown,
        });
      }
    }

    // 3. Calculate score hash
    const allScores = leaderboard.map(e => ({
      wallet: e.wallet_address,
      score: e.final_score,
    }));
    const scoreHash = sha256(JSON.stringify(allScores));

    // 4. Extract top 10 winners
    const winners = leaderboard.slice(0, 10).map(e => e.wallet_address);

    // 5. Finalize on blockchain
    const blockchainResult = await finalizeContestOnChain(
      contestId,
      winners,
      scoreHash
    );

    // 6. Update PostgreSQL
    await db('contests').where({ id: contestId }).update({
      blockchain_status: blockchainResult.success ? 'finalized_on_chain' : 'finalized_off_chain_only',
      blockchain_tx_signature: blockchainResult.signature || null,
      blockchain_finalized_at: db.fn.now(),
    });

    logger.info(`Contest ${contestId} finalized (blockchain: ${blockchainResult.success})`, {
      context: 'ContestLifecycle',
    });
  } catch (error) {
    logger.error(`Failed to finalize contest ${contestId}`, error, {
      context: 'ContestLifecycle',
    });
  }
}
```

---

## STEP 8: Frontend Integration (React)

### File: `frontend/src/components/ContestLeaderboard.tsx`

```tsx
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface ContestResult {
  blockchain_signature: string | null;
  blockchain_status: 'finalized_on_chain' | 'finalized_off_chain_only';
  blockchain_finalized_at: string;
}

export function ContestLeaderboard({ contestId }: Props) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [blockchainStatus, setBlockchainStatus] = useState<ContestResult | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(`/api/contests/${contestId}/results`);
      const data = await res.json();
      setLeaderboard(data.leaderboard);
      setBlockchainStatus(data.blockchain);
    };

    fetchResults();
  }, [contestId]);

  return (
    <div className="space-y-4">
      {blockchainStatus?.blockchain_status === 'finalized_on_chain' && (
        <div className="bg-emerald-500/10 border border-emerald-500 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓ Verified on Solana</span>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(blockchainStatus.blockchain_finalized_at))} ago
              </span>
            </div>
            <a
              href={`https://explorer.solana.com/tx/${blockchainStatus.blockchain_signature}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-500 text-sm hover:underline"
            >
              View Transaction
            </a>
          </div>
        </div>
      )}

      {blockchainStatus?.blockchain_status === 'finalized_off_chain_only' && (
        <div className="bg-amber-500/10 border border-amber-500 rounded-lg p-4 text-sm">
          <span className="text-amber-500">⚠ Results finalized (blockchain unavailable)</span>
        </div>
      )}

      {/* Leaderboard rows */}
      <div className="space-y-2">
        {leaderboard.map((entry, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 bg-gray-800 rounded">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gold-500">#{entry.rank}</span>
              <span>{entry.username}</span>
            </div>
            <span className="font-bold">{entry.final_score} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## DEPLOYMENT CHECKLIST

- [ ] Anchor project created and builds locally
- [ ] Tests pass on local validator
- [ ] Program deployed to Devnet
- [ ] Authority keypair stored in backend env: `SOLANA_AUTHORITY_KEY`
- [ ] Backend integration code tested (can call finalizeContestOnChain)
- [ ] Frontend shows blockchain status badges
- [ ] Demo works: Draft → Contest ends → Results on Solana → Explorer link works
- [ ] Fallback works: If blockchain fails, game continues with off-chain results

---

## COMMON ISSUES & FIXES

### Issue: "Account already exists"
**Cause:** Calling finalize_contest twice for same contest_id
**Fix:** Check if contest already finalized in DB before calling

### Issue: "Insufficient funds"
**Cause:** Authority account out of SOL
**Fix:** `solana airdrop 2` to authority pubkey

### Issue: "InvalidAccountData"
**Cause:** Program deserializing wrong data
**Fix:** Check that IDL matches program binary (rebuild both)

### Issue: RPC Timeout
**Cause:** Devnet congestion
**Fix:** Use private RPC (Helius, Quicknode) or retry with backoff

---

## WHAT'S NOT INCLUDED

**Future enhancements (post-hackathon):**
- Per-user transaction instructions (requires signer iteration)
- Hourly leaderboard snapshots on-chain (expensive)
- SPL token transfers (requires token program integration)
- Governance (vote on scoring rules)

**For now:** Focus on ONE instruction, ONE job, done well.

---

## SUMMARY

**You now have:**
1. ✅ Anchor program structure
2. ✅ Data model for contest results
3. ✅ Backend integration pattern
4. ✅ Frontend display logic
5. ✅ Testing framework
6. ✅ Deployment checklist

**Next:** Follow the 5-day timeline and execute.

---

**Document:** ANCHOR_PROGRAM_SPEC.md
**Status:** Implementation Ready
**Effort:** 20-25h
**Timeline:** Days 1-2 of 5-day sprint
