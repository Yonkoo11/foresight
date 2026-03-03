#!/bin/bash

###############################################################################
# Foresight QA Diagnostic Script
# Validates all prerequisites before running E2E test
###############################################################################

set -e

echo "════════════════════════════════════════════════════════════════════"
echo "Foresight QA Test Environment Diagnostic"
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# Helper functions
pass() {
  echo -e "${GREEN}✓ PASS${NC}: $1"
  ((PASS_COUNT++))
}

fail() {
  echo -e "${RED}✗ FAIL${NC}: $1"
  ((FAIL_COUNT++))
}

warn() {
  echo -e "${YELLOW}⚠ WARN${NC}: $1"
  ((WARN_COUNT++))
}

# =============================================================================
# 1. ENVIRONMENT VARIABLES
# =============================================================================

echo ""
echo "1. ENVIRONMENT VARIABLES"
echo "────────────────────────"

if [ -f "/Users/mujeeb/foresight/backend/.env" ]; then
  pass ".env file exists"

  if grep -q "DATABASE_URL" /Users/mujeeb/foresight/backend/.env; then
    pass "DATABASE_URL configured"
  else
    fail "DATABASE_URL missing from .env"
  fi

  if grep -q "PRIVY_APP_ID" /Users/mujeeb/foresight/backend/.env; then
    pass "PRIVY_APP_ID configured"
  else
    fail "PRIVY_APP_ID missing from .env"
  fi

  if grep -q "TREASURY_PUBLIC_KEY" /Users/mujeeb/foresight/backend/.env; then
    TREASURY=$(grep "TREASURY_PUBLIC_KEY" /Users/mujeeb/foresight/backend/.env | cut -d= -f2)
    pass "TREASURY_PUBLIC_KEY configured: ${TREASURY:0:12}..."
  else
    fail "TREASURY_PUBLIC_KEY missing from .env"
  fi

  if grep -q "TREASURY_SECRET_KEY_BASE64" /Users/mujeeb/foresight/backend/.env; then
    pass "TREASURY_SECRET_KEY_BASE64 configured"
  else
    fail "TREASURY_SECRET_KEY_BASE64 missing from .env"
  fi

  if grep -q "TWITTER_API_IO_KEY" /Users/mujeeb/foresight/backend/.env; then
    pass "TWITTER_API_IO_KEY configured"
  else
    warn "TWITTER_API_IO_KEY missing (CT Feed won't auto-refresh, non-critical)"
  fi
else
  fail ".env file not found at /Users/mujeeb/foresight/backend/.env"
fi

# =============================================================================
# 2. SERVICES
# =============================================================================

echo ""
echo "2. BACKEND & FRONTEND SERVICES"
echo "──────────────────────────────"

# Check backend port
if nc -z localhost 3001 2>/dev/null; then
  pass "Backend running on :3001"
else
  fail "Backend NOT running on :3001 (start: cd backend && NODE_OPTIONS='--import tsx' pnpm dev)"
fi

# Check frontend port
if nc -z localhost 5173 2>/dev/null; then
  pass "Frontend running on :5173"
else
  fail "Frontend NOT running on :5173 (start: cd frontend && pnpm dev)"
fi

# =============================================================================
# 3. DATABASE
# =============================================================================

echo ""
echo "3. DATABASE"
echo "───────────"

# Check PostgreSQL connection
if psql postgresql://localhost:5432/foresight -c "SELECT 1" > /dev/null 2>&1; then
  pass "PostgreSQL connected (localhost:5432/foresight)"

  # Check migrations status
  TABLE_COUNT=$(psql postgresql://localhost:5432/foresight -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d ' ')
  if [ "$TABLE_COUNT" -gt 20 ]; then
    pass "Database initialized ($TABLE_COUNT tables found)"
  else
    fail "Database appears empty or not migrated (only $TABLE_COUNT tables)"
  fi

  # Check influencers table
  INF_COUNT=$(psql postgresql://localhost:5432/foresight -t -c "SELECT COUNT(*) FROM influencers WHERE is_active=true;" 2>/dev/null | tr -d ' ')
  if [ "$INF_COUNT" -gt 0 ]; then
    pass "Influencers seeded ($INF_COUNT active)"
  else
    warn "No active influencers found (seed_demo_contest.ts may not have run)"
  fi

  # Check contest types
  CT_COUNT=$(psql postgresql://localhost:5432/foresight -t -c "SELECT COUNT(*) FROM contest_types;" 2>/dev/null | tr -d ' ')
  if [ "$CT_COUNT" -gt 0 ]; then
    pass "Contest types configured ($CT_COUNT types)"
  else
    fail "No contest types found (migrations incomplete)"
  fi
else
  fail "PostgreSQL NOT connected (start: brew services start postgresql)"
fi

# =============================================================================
# 4. BLOCKCHAIN & SOLANA
# =============================================================================

echo ""
echo "4. SOLANA DEVNET"
echo "────────────────"

# Check Solana CLI installed
if command -v solana &> /dev/null; then
  pass "Solana CLI installed ($(solana --version))"

  # Check RPC connectivity
  if timeout 5 curl -s "https://api.devnet.solana.com" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getEpoch","params":[]}' | grep -q "result"; then
    pass "Solana devnet RPC responsive"
  else
    fail "Solana devnet RPC not responding"
  fi

  # Check treasury wallet balance
  TREASURY="CDLfbiz7nmXCT6jqBqCG7HpGPh8KRJCgyz6koiM1F23J"
  BALANCE=$(solana balance $TREASURY -u devnet 2>/dev/null | awk '{print $1}' || echo "0")
  if (( $(echo "$BALANCE > 0.1" | bc -l) )); then
    pass "Treasury balance: $BALANCE SOL (devnet)"
  elif (( $(echo "$BALANCE > 0" | bc -l) )); then
    warn "Treasury balance: $BALANCE SOL (low, request from https://faucet.solana.com/ if testing claims)"
  else
    fail "Treasury balance: $BALANCE SOL (needs funding)"
  fi
else
  warn "Solana CLI not installed (optional for testing, needed for balance checks)"
fi

# =============================================================================
# 5. NODE DEPENDENCIES
# =============================================================================

echo ""
echo "5. NODE DEPENDENCIES"
echo "────────────────────"

# Check backend node_modules
if [ -d "/Users/mujeeb/foresight/backend/node_modules" ]; then
  pass "Backend node_modules installed"
else
  fail "Backend node_modules NOT found (run: cd backend && pnpm install)"
fi

# Check frontend node_modules
if [ -d "/Users/mujeeb/foresight/frontend/node_modules" ]; then
  pass "Frontend node_modules installed"
else
  fail "Frontend node_modules NOT found (run: cd frontend && pnpm install)"
fi

# Check key packages
if grep -q "@solana/web3.js" /Users/mujeeb/foresight/backend/package.json; then
  pass "@solana/web3.js installed"
else
  warn "@solana/web3.js not in backend/package.json"
fi

if grep -q "knex" /Users/mujeeb/foresight/backend/package.json; then
  pass "knex (database) installed"
else
  fail "knex NOT installed in backend"
fi

# =============================================================================
# 6. API CONNECTIVITY
# =============================================================================

echo ""
echo "6. API CONNECTIVITY"
echo "───────────────────"

# Get an auth token (skip if backend not running)
if nc -z localhost 3001 2>/dev/null; then
  # Try health check endpoint (no auth needed)
  if curl -s http://localhost:3001/api/v2/contest-types | grep -q "contestTypes"; then
    pass "Backend API responding (/api/v2/contest-types)"
  else
    fail "Backend API not responding as expected"
  fi

  # Try admin endpoint (requires JWT, will fail but tests connectivity)
  HTTP_CODE=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:3001/api/admin/stats)
  if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "200" ]; then
    pass "Backend admin endpoints accessible (got HTTP $HTTP_CODE)"
  else
    fail "Backend admin endpoints not accessible (got HTTP $HTTP_CODE)"
  fi
else
  fail "Cannot check API (backend not running)"
fi

# =============================================================================
# 7. PRIVY CONFIGURATION
# =============================================================================

echo ""
echo "7. PRIVY AUTHENTICATION"
echo "──────────────────────"

if [ -f "/Users/mujeeb/foresight/backend/.env" ]; then
  PRIVY_ID=$(grep "PRIVY_APP_ID" /Users/mujeeb/foresight/backend/.env | cut -d= -f2)
  PRIVY_SECRET=$(grep "PRIVY_APP_SECRET" /Users/mujeeb/foresight/backend/.env | cut -d= -f2)

  if [ ! -z "$PRIVY_ID" ] && [ ! -z "$PRIVY_SECRET" ]; then
    pass "Privy credentials configured"

    # Check if they look valid (not empty, reasonable length)
    if [ ${#PRIVY_ID} -gt 10 ] && [ ${#PRIVY_SECRET} -gt 20 ]; then
      pass "Privy credentials look valid"
    else
      fail "Privy credentials look malformed (too short)"
    fi
  else
    fail "Privy credentials missing from .env"
  fi
else
  fail "Cannot check Privy (no .env file)"
fi

# =============================================================================
# 8. MIGRATION STATUS
# =============================================================================

echo ""
echo "8. DATABASE MIGRATIONS"
echo "─────────────────────"

if nc -z localhost 3001 2>/dev/null; then
  # Count migration files
  MIGRATION_COUNT=$(ls -1 /Users/mujeeb/foresight/backend/migrations/*.ts 2>/dev/null | wc -l)
  if [ "$MIGRATION_COUNT" -gt 20 ]; then
    pass "$MIGRATION_COUNT migration files found"

    # Try to get migration status (requires DB)
    if psql postgresql://localhost:5432/foresight -c "SELECT COUNT(*) FROM knex_migrations;" > /dev/null 2>&1; then
      APPLIED=$(psql postgresql://localhost:5432/foresight -t -c "SELECT COUNT(*) FROM knex_migrations;" | tr -d ' ')
      if [ "$APPLIED" -gt 0 ]; then
        pass "$APPLIED migrations applied"
      else
        fail "No migrations applied (run: cd backend && NODE_OPTIONS='--import tsx' pnpm exec knex migrate:latest)"
      fi
    fi
  else
    fail "Not enough migration files found ($MIGRATION_COUNT)"
  fi
else
  warn "Cannot check migrations (backend not running)"
fi

# =============================================================================
# 9. FIREWALL & PORTS
# =============================================================================

echo ""
echo "9. PORTS & FIREWALL"
echo "───────────────────"

# Check if ports are open
for port in 3001 5173 5432; do
  if nc -z localhost $port 2>/dev/null; then
    pass "Port $port is open"
  else
    warn "Port $port not listening (service may not be running)"
  fi
done

# =============================================================================
# 10. TEST READINESS
# =============================================================================

echo ""
echo "10. TEST READINESS CHECKLIST"
echo "───────────────────────────"

if [ $FAIL_COUNT -eq 0 ]; then
  pass "All critical checks passed!"
else
  fail "$FAIL_COUNT critical checks failed"
fi

if [ $WARN_COUNT -gt 0 ]; then
  echo "Warnings: $WARN_COUNT (review above)"
fi

# =============================================================================
# SUMMARY
# =============================================================================

echo ""
echo "════════════════════════════════════════════════════════════════════"
echo "SUMMARY"
echo "════════════════════════════════════════════════════════════════════"
echo ""
echo -e "  ${GREEN}PASS: $PASS_COUNT${NC}"
echo -e "  ${RED}FAIL: $FAIL_COUNT${NC}"
echo -e "  ${YELLOW}WARN: $WARN_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}✓ Environment is ready for QA testing!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Read: /Users/mujeeb/foresight/QA_TEST_PLAN_END_TO_END.md"
  echo "  2. Follow: PART 1 → PART 10 step by step"
  echo "  3. For admin commands: /Users/mujeeb/foresight/QA_ADMIN_COMMANDS.sh"
  echo ""
  exit 0
else
  echo -e "${RED}✗ Fix the above errors before testing${NC}"
  echo ""
  echo "Quick fixes:"
  echo ""
  if [ ! -f "/Users/mujeeb/foresight/backend/.env" ]; then
    echo "  Missing .env? Copy .env.example → .env and fill in values"
    echo "    cp /Users/mujeeb/foresight/backend/.env.example /Users/mujeeb/foresight/backend/.env"
    echo ""
  fi
  if ! nc -z localhost 3001 2>/dev/null; then
    echo "  Backend not running? Start it:"
    echo "    cd /Users/mujeeb/foresight/backend"
    echo "    NODE_OPTIONS='--import tsx' pnpm dev"
    echo ""
  fi
  if ! nc -z localhost 5173 2>/dev/null; then
    echo "  Frontend not running? Start it:"
    echo "    cd /Users/mujeeb/foresight/frontend"
    echo "    pnpm dev"
    echo ""
  fi
  if ! psql postgresql://localhost:5432/foresight -c "SELECT 1" > /dev/null 2>&1; then
    echo "  Database not running? Start PostgreSQL:"
    echo "    brew services start postgresql"
    echo "    Or run migrations: NODE_OPTIONS='--import tsx' pnpm exec knex migrate:latest"
    echo ""
  fi
  exit 1
fi
