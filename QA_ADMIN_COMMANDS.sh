#!/bin/bash

###############################################################################
# Foresight QA Test Plan — Admin Command Reference
#
# Quick copy-paste commands for managing the $100 launch contest QA test
###############################################################################

# =============================================================================
# SETUP: Get your admin JWT token
# =============================================================================

# 1. Log in as admin in Browser (Tab 1)
# 2. Open DevTools (F12) → Application → Cookies
# 3. Find "accessToken" cookie and copy its value
# 4. Export it:

export ADMIN_JWT="<PASTE_YOUR_JWT_HERE>"

# Verify your JWT works:
curl -H "Authorization: Bearer $ADMIN_JWT" \
  http://localhost:3001/api/admin/stats


# =============================================================================
# CREATE CONTEST: 5-minute test duration
# =============================================================================

# For testing: lock in 5 min, end in 10 min from now
NOW=$(date -u +%Y-%m-%dT%H:%M:%SZ)
LOCK_TIME=$(date -u -v+5M +%Y-%m-%dT%H:%M:%SZ)  # +5 min
END_TIME=$(date -u -v+10M +%Y-%m-%dT%H:%M:%SZ) # +10 min

# Create the contest
RESPONSE=$(curl -s -X POST http://localhost:3001/api/v2/admin/contests \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "contestTypeCode": "FREE_LEAGUE",
    "name": "$100 Launch Contest - QA Test",
    "description": "Multi-account test with $100 prize pool (devnet SOL). Lock in 5 min.",
    "lockTime": "'"$LOCK_TIME"'",
    "endTime": "'"$END_TIME"'",
    "customMinPlayers": 2,
    "customMaxPlayers": 10
  }')

echo "Contest creation response:"
echo "$RESPONSE" | jq .

# Extract contest ID
CONTEST_ID=$(echo "$RESPONSE" | jq -r '.contest.id')
echo ""
echo "CONTEST_ID=$CONTEST_ID"
export CONTEST_ID


# =============================================================================
# UPDATE CONTEST: Adjust times (if lock already passed)
# =============================================================================

# If the lock_time has already elapsed, extend it:
NEW_LOCK=$(date -u -v+2M +%Y-%m-%dT%H:%M:%SZ)  # +2 min from now
NEW_END=$(date -u -v+7M +%Y-%m-%dT%H:%M:%SZ)   # +7 min from now

curl -X PATCH http://localhost:3001/api/admin/contests/$CONTEST_ID \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "lock_time": "'"$NEW_LOCK"'",
    "end_time": "'"$NEW_END"'"
  }'


# =============================================================================
# UPDATE PRIZE POOL: Set exact amount
# =============================================================================

# Set to 0.15 SOL ($100 worth if SOL=$1000/ea, or just 150K lamports)
curl -X PATCH http://localhost:3001/api/admin/contests/$CONTEST_ID \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "prize_pool": "0.15",
    "distributable_pool": "0.15"
  }'


# =============================================================================
# MANUAL TRIGGERS: Lock, Score, Finalize
# =============================================================================

echo ""
echo "=== Trigger: Lock Contest ==="
curl -X POST http://localhost:3001/api/admin/trigger-prized-lock \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "=== Trigger: Score Contest ==="
curl -X POST http://localhost:3001/api/admin/trigger-prized-scoring \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" | jq .

echo ""
echo "=== Trigger: Finalize Contest ==="
curl -X POST http://localhost:3001/api/admin/trigger-contest-finalization \
  -H "Authorization: Bearer $ADMIN_JWT" \
  -H "Content-Type: application/json" | jq .


# =============================================================================
# VIEW CONTEST STATE: Check status and entries
# =============================================================================

echo ""
echo "=== Contest Details ==="
curl http://localhost:3001/api/v2/contests/$CONTEST_ID \
  -H "Authorization: Bearer $ADMIN_JWT" | jq .

echo ""
echo "=== Raw DB Row ==="
curl http://localhost:3001/api/admin/contests/$CONTEST_ID/raw \
  -H "Authorization: Bearer $ADMIN_JWT" | jq .

echo ""
echo "=== Leaderboard Entries ==="
curl http://localhost:3001/api/v2/contests/$CONTEST_ID/entries \
  -H "Authorization: Bearer $ADMIN_JWT" | jq '.entries[] | {rank, wallet_address, score, prizeAmount, claimed}'


# =============================================================================
# DATABASE QUERIES: Direct verification
# =============================================================================

echo ""
echo "=== DB: Contest Status ==="
psql postgresql://localhost:5432/foresight -c \
  "SELECT id, name, status, player_count, prize_pool, winners_count, lock_time, end_time
   FROM prized_contests WHERE id = $CONTEST_ID;"

echo ""
echo "=== DB: Entries with Prizes ==="
psql postgresql://localhost:5432/foresight -c \
  "SELECT id, wallet_address, rank, score, prize_won, claimed, claim_tx_hash
   FROM free_league_entries WHERE contest_id = $CONTEST_ID
   ORDER BY rank;"

echo ""
echo "=== DB: Prize Distribution Rules ==="
psql postgresql://localhost:5432/foresight -c \
  "SELECT rank, label, percentage, min_players, max_players
   FROM prize_distribution_rules
   WHERE min_players <= 3 ORDER BY rank;"


# =============================================================================
# RESET CONTEST: Clear entries and go back to "open"
# =============================================================================

echo ""
echo "=== Reset Contest (if re-testing) ==="
cd /Users/mujeeb/foresight/backend
NODE_OPTIONS='--import tsx' npx tsx src/scripts/simulateContestFinale.ts $CONTEST_ID --reset


# =============================================================================
# TREASURY VERIFICATION: Check SOL balance
# =============================================================================

echo ""
echo "=== Treasury Balance ==="
TREASURY_WALLET="CDLfbiz7nmXCT6jqBqCG7HpGPh8KRJCgyz6koiM1F23J"
solana balance $TREASURY_WALLET -u devnet

echo ""
echo "Treasury will transfer SOL to winners when they claim."
echo "If balance is low, request devnet SOL from: https://faucet.solana.com/"


# =============================================================================
# SIMULATE CONTEST WITH FAKE OPPONENTS (for testing full finale)
# =============================================================================

# This adds 12 fake opponents and assigns scores so you can win 1st place
# Usage: simulateContestFinale.ts <CONTEST_ID> <YOUR_WALLET> <YOUR_RANK>

echo ""
echo "=== Simulate Contest (add fake opponents) ==="
YOUR_WALLET="0x..."  # Replace with ALPHA_WALLET from test
YOUR_RANK=1          # 1st place

cd /Users/mujeeb/foresight/backend
NODE_OPTIONS='--import tsx' npx tsx src/scripts/simulateContestFinale.ts $CONTEST_ID $YOUR_WALLET $YOUR_RANK


# =============================================================================
# QUICK TEST FLOW: All steps at once
# =============================================================================

# This section runs the complete flow in one script

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "FULL QA TEST FLOW (copy and paste all commands below)"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Step 1: Create contest (see above)
# Step 2: Users enter in browser (3 tabs, each enters different team)
# Step 3: Wait OR manually trigger lock
echo "Step 3: Trigger lock (run this when all 3 users have entered)"
curl -X POST http://localhost:3001/api/admin/trigger-prized-lock \
  -H "Authorization: Bearer $ADMIN_JWT" -H "Content-Type: application/json" | jq '.result'

# Step 4: Wait 10 seconds
sleep 10

# Step 5: Trigger scoring
echo "Step 5: Trigger scoring"
curl -X POST http://localhost:3001/api/admin/trigger-prized-scoring \
  -H "Authorization: Bearer $ADMIN_JWT" -H "Content-Type: application/json" | jq '.result'

# Step 6: Check contest is finalized
echo "Step 6: Verify finalized status"
curl http://localhost:3001/api/v2/contests/$CONTEST_ID \
  -H "Authorization: Bearer $ADMIN_JWT" | jq '.contest.status'

# Step 7: View leaderboard with prizes
echo "Step 7: View leaderboard (check Rank, Score, Prize)"
curl http://localhost:3001/api/v2/contests/$CONTEST_ID/entries \
  -H "Authorization: Bearer $ADMIN_JWT" | jq '.entries[] | {rank, wallet: .walletAddress, score, prizeAmount, claimed}'

# Step 8: Users claim prizes in browser (3 tabs)
echo "Step 8: Users claim prizes (go to browser tabs 1, 2, 3 and click 'Claim Prize')"


# =============================================================================
# DEBUGGING: Check logs and errors
# =============================================================================

echo ""
echo "=== Backend Logs (tail last 50 lines) ==="
# Check Terminal 1 where backend is running for:
# - "[CRON] Locked prized contest"
# - "[CRON] Scoring prized contest"
# - "[CRON] Finalized prized contest"
# - "Prize claimed: X SOL to WALLET"

echo "Look for these in Terminal 1 backend logs:"
echo "  - '[CRON] Locked prized contest'"
echo "  - '[CRON] Scoring prized contest'"
echo "  - '[CRON] Finalized prized contest'"
echo "  - 'Prize claimed: X SOL'"

echo ""
echo "=== Frontend Console Errors ==="
echo "In Browser DevTools (F12 → Console):"
echo "  - No 'Uncaught Error' messages"
echo "  - No 'Failed to fetch' messages"
echo "  - Check Network tab: all API calls return 200 OK"


# =============================================================================
# EXPORT VARIABLES: Use these in other scripts
# =============================================================================

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "SAVE THESE FOR YOUR TEST:"
echo "════════════════════════════════════════════════════════════════════"
echo "export ADMIN_JWT=\"$ADMIN_JWT\""
echo "export CONTEST_ID=\"$CONTEST_ID\""
echo "export ALPHA_WALLET=\"<from browser>\""
echo "export BETA_WALLET=\"<from browser>\""
echo "export GAMMA_WALLET=\"<from browser>\""
echo "export TREASURY_WALLET=\"CDLfbiz7nmXCT6jqBqCG7HpGPh8KRJCgyz6koiM1F23J\""
