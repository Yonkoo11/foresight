#!/bin/bash

# ============================================================================
# Pre-Deployment Checklist
# Verifies everything is ready before deploying contracts
# ============================================================================

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "========================================"
echo "  Pre-Deployment Checklist"
echo "========================================"
echo -e "${NC}"

CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check and report
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo -e "${RED}✗${NC} $2"
        CHECKS_FAILED=$((CHECKS_FAILED + 1))
    fi
}

echo "Checking environment..."
echo ""

# Check if in project root
if [ -d "contracts" ] && [ -d "frontend" ]; then
    check 0 "Running from project root"
else
    check 1 "Running from project root"
fi

# Check Foundry installation
if command -v forge &> /dev/null; then
    FORGE_VERSION=$(forge --version | head -n 1)
    check 0 "Foundry installed ($FORGE_VERSION)"
else
    check 1 "Foundry installed"
fi

# Check Node.js installation
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    check 0 "Node.js installed ($NODE_VERSION)"
else
    check 1 "Node.js installed"
fi

# Check pnpm installation
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    check 0 "pnpm installed ($PNPM_VERSION)"
else
    check 1 "pnpm installed"
fi

echo ""
echo "Checking contracts..."
echo ""

# Check if contracts build
cd contracts
if forge build &> /dev/null; then
    check 0 "Contracts compile successfully"
else
    check 1 "Contracts compile successfully"
fi

# Check if .env exists
if [ -f ".env" ]; then
    check 0 "contracts/.env file exists"

    # Load .env
    source .env

    # Check PRIVATE_KEY
    if [ -n "$PRIVATE_KEY" ] && [ "$PRIVATE_KEY" != "your_deployer_private_key_here_without_0x" ]; then
        check 0 "PRIVATE_KEY configured"

        # Check private key format (should be 64 hex chars)
        if [[ ${#PRIVATE_KEY} -eq 64 ]]; then
            check 0 "PRIVATE_KEY format valid (64 chars)"
        else
            check 1 "PRIVATE_KEY format valid (should be 64 chars, got ${#PRIVATE_KEY})"
        fi
    else
        check 1 "PRIVATE_KEY configured"
        echo -e "  ${YELLOW}Set PRIVATE_KEY in contracts/.env${NC}"
    fi

    # Check RPC URL
    if [ -n "$BASE_SEPOLIA_RPC_URL" ]; then
        check 0 "BASE_SEPOLIA_RPC_URL configured"
    else
        check 1 "BASE_SEPOLIA_RPC_URL configured"
    fi
else
    check 1 "contracts/.env file exists"
    echo -e "  ${YELLOW}Run: cp contracts/.env.example contracts/.env${NC}"
fi

# Check if tests pass
if forge test &> /dev/null; then
    check 0 "All contract tests pass"
else
    check 1 "All contract tests pass"
fi

cd ..

echo ""
echo "Checking frontend..."
echo ""

# Check if frontend dependencies installed
if [ -d "frontend/node_modules" ]; then
    check 0 "Frontend dependencies installed"
else
    check 1 "Frontend dependencies installed"
    echo -e "  ${YELLOW}Run: cd frontend && pnpm install${NC}"
fi

# Check if frontend builds
cd frontend
if pnpm build &> /dev/null; then
    check 0 "Frontend builds successfully"
else
    check 1 "Frontend builds successfully"
fi
cd ..

# Check if ABIs exist
ABI_COUNT=$(ls -1 frontend/src/contracts/abis/*.json 2>/dev/null | wc -l)
if [ $ABI_COUNT -ge 6 ]; then
    check 0 "Contract ABIs present ($ABI_COUNT files)"
else
    check 1 "Contract ABIs present (found $ABI_COUNT, need 6)"
    echo -e "  ${YELLOW}Run: ./scripts/sync-abis.sh${NC}"
fi

echo ""
echo "========================================"
echo "  Summary"
echo "========================================"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All checks passed! ($CHECKS_PASSED/$CHECKS_PASSED)${NC}"
    echo ""
    echo "You're ready to deploy! Run:"
    echo -e "  ${BLUE}./scripts/deploy-and-update.sh${NC}"
    echo ""
    exit 0
else
    echo -e "${YELLOW}Some checks failed ($CHECKS_FAILED failed, $CHECKS_PASSED passed)${NC}"
    echo ""
    echo "Fix the issues above before deploying."
    echo ""

    if [ -z "$PRIVATE_KEY" ] || [ "$PRIVATE_KEY" = "your_deployer_private_key_here_without_0x" ]; then
        echo -e "${BLUE}Next steps:${NC}"
        echo "1. Create a burner wallet"
        echo "2. Get Base Sepolia ETH from faucet"
        echo "3. Set PRIVATE_KEY in contracts/.env"
        echo "4. Run this script again"
    fi

    exit 1
fi
