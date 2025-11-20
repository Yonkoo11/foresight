#!/bin/bash
set -euo pipefail

# ============================================================================
# Timecaster Setup & Run Script
# ============================================================================
# This script:
# - Checks/installs required dependencies (Node, pnpm, Foundry)
# - Installs project dependencies
# - Builds and tests smart contracts
# - Starts the frontend development server
# ============================================================================

echo "🚀 Starting Timecaster Setup..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# 1. Check Node.js
# ============================================================================
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"

    # Check if version is 20+
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 20 ]; then
        echo -e "${YELLOW}⚠️  Node.js 20+ recommended (you have v$MAJOR_VERSION)${NC}"
        echo "   Install from: https://nodejs.org/"
    fi
else
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "   Install from: https://nodejs.org/ (v20 or higher)"
    exit 1
fi

# ============================================================================
# 2. Check/Install pnpm
# ============================================================================
echo ""
echo "📦 Checking pnpm..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✓ pnpm installed: $PNPM_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  pnpm not found. Installing...${NC}"
    npm install -g pnpm
    echo -e "${GREEN}✓ pnpm installed${NC}"
fi

# ============================================================================
# 3. Check/Install Foundry
# ============================================================================
echo ""
echo "⚒️  Checking Foundry..."
if command -v forge &> /dev/null; then
    FORGE_VERSION=$(forge --version | head -n 1)
    echo -e "${GREEN}✓ Foundry installed: $FORGE_VERSION${NC}"
else
    echo -e "${YELLOW}⚠️  Foundry not found. Installing...${NC}"
    curl -L https://foundry.paradigm.xyz | bash

    # Source foundryup
    if [ -f ~/.bashrc ]; then
        source ~/.bashrc
    elif [ -f ~/.zshrc ]; then
        source ~/.zshrc
    fi

    # Run foundryup
    foundryup

    echo -e "${GREEN}✓ Foundry installed${NC}"
fi

# ============================================================================
# 4. Navigate to project root
# ============================================================================
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

echo ""
echo "📂 Project root: $PROJECT_ROOT"

# ============================================================================
# 5. Install Contract Dependencies
# ============================================================================
echo ""
echo "📚 Installing contract dependencies..."
cd "$PROJECT_ROOT/contracts"

# Install OpenZeppelin if not present
if [ ! -d "lib/openzeppelin-contracts" ]; then
    echo "   Installing OpenZeppelin contracts..."
    forge install OpenZeppelin/openzeppelin-contracts --no-commit
fi

# Install forge-std if not present
if [ ! -d "lib/forge-std" ]; then
    echo "   Installing forge-std..."
    forge install foundry-rs/forge-std --no-commit
fi

echo -e "${GREEN}✓ Contract dependencies installed${NC}"

# ============================================================================
# 6. Build Smart Contracts
# ============================================================================
echo ""
echo "🔨 Building smart contracts..."
cd "$PROJECT_ROOT/contracts"

if forge build; then
    echo -e "${GREEN}✓ Contracts built successfully${NC}"
else
    echo -e "${RED}✗ Contract build failed${NC}"
    exit 1
fi

# ============================================================================
# 7. Run Contract Tests
# ============================================================================
echo ""
echo "🧪 Running contract tests..."
cd "$PROJECT_ROOT/contracts"

if forge test -vvv; then
    echo -e "${GREEN}✓ All tests passed${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed (continuing anyway)${NC}"
fi

# ============================================================================
# 8. Install Frontend Dependencies
# ============================================================================
echo ""
echo "📚 Installing frontend dependencies..."
cd "$PROJECT_ROOT/frontend"

if pnpm install; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${RED}✗ Frontend dependency installation failed${NC}"
    exit 1
fi

# ============================================================================
# 9. Check Environment Files
# ============================================================================
echo ""
echo "🔐 Checking environment files..."

if [ ! -f "$PROJECT_ROOT/frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  No .env file found in frontend/${NC}"
    echo "   Copying .env.example to .env..."
    cp "$PROJECT_ROOT/frontend/.env.example" "$PROJECT_ROOT/frontend/.env"
    echo -e "${YELLOW}   ⚠️  Please edit frontend/.env with your values${NC}"
fi

if [ ! -f "$PROJECT_ROOT/contracts/.env" ]; then
    if [ -f "$PROJECT_ROOT/contracts/.env.example" ]; then
        echo -e "${YELLOW}⚠️  No .env file found in contracts/${NC}"
        echo "   Copying .env.example to .env..."
        cp "$PROJECT_ROOT/contracts/.env.example" "$PROJECT_ROOT/contracts/.env"
        echo -e "${YELLOW}   ⚠️  Please edit contracts/.env with your values before deploying${NC}"
    fi
fi

# ============================================================================
# 10. Final Summary
# ============================================================================
echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo "════════════════════════════════════════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start the frontend development server:"
echo "   cd frontend && pnpm dev"
echo ""
echo "2. Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "3. To deploy contracts (after setup):"
echo "   cd contracts"
echo "   Edit .env with your PRIVATE_KEY and RPC URL"
echo "   forge script script/Deploy.s.sol --rpc-url base-sepolia --broadcast --verify"
echo ""
echo "════════════════════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# 11. Auto-start frontend (optional - comment out if you don't want this)
# ============================================================================
echo "🌐 Starting frontend development server..."
echo "   Press Ctrl+C to stop"
echo ""

cd "$PROJECT_ROOT/frontend"
pnpm dev
