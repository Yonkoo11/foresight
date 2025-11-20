#!/bin/bash
set -euo pipefail

# ============================================================================
# Timecaster Contract Deployment Script
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Timecaster Contract Deployment${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Change to contracts directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT/contracts"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found in contracts/${NC}"
    echo ""
    echo "Please create contracts/.env with:"
    echo "  BASE_SEPOLIA_RPC_URL=..."
    echo "  PRIVATE_KEY=..."
    echo "  TREASURY_ADDRESS=..."
    echo ""
    echo "See SECURITY_SETUP.md for detailed instructions"
    exit 1
fi

# Load environment variables
source .env

# Verify required variables
if [ -z "$PRIVATE_KEY" ] || [ "$PRIVATE_KEY" = "your_deployer_private_key_here_without_0x" ]; then
    echo -e "${RED}Error: PRIVATE_KEY not set in .env${NC}"
    exit 1
fi

if [ -z "$BASE_SEPOLIA_RPC_URL" ]; then
    echo -e "${RED}Error: BASE_SEPOLIA_RPC_URL not set in .env${NC}"
    exit 1
fi

# Check deployer balance
DEPLOYER_ADDRESS=$(cast wallet address --private-key $PRIVATE_KEY)
BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL)
BALANCE_ETH=$(echo "scale=4; $BALANCE / 1000000000000000000" | bc)

echo -e "${GREEN}Deployer Address: $DEPLOYER_ADDRESS${NC}"
echo -e "${GREEN}Balance: $BALANCE_ETH ETH${NC}"
echo ""

# Check if balance is sufficient (at least 0.01 ETH)
if (( $(echo "$BALANCE_ETH < 0.01" | bc -l) )); then
    echo -e "${RED}Error: Insufficient balance${NC}"
    echo "You need at least 0.01 ETH on Base Sepolia"
    echo "Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
    exit 1
fi

# Build contracts
echo -e "${YELLOW}Building contracts...${NC}"
if forge build; then
    echo -e "${GREEN}✓ Build successful${NC}"
    echo ""
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Ask for confirmation
echo -e "${YELLOW}Ready to deploy to Base Sepolia${NC}"
echo ""
read -p "Continue with deployment? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo -e "${YELLOW}Deploying contracts...${NC}"
echo ""

# Deploy with or without verification
if [ ! -z "${ETHERSCAN_API_KEY:-}" ]; then
    echo "Deploying with verification..."
    forge script script/Deploy.s.sol \
        --rpc-url $BASE_SEPOLIA_RPC_URL \
        --broadcast \
        --verify \
        --etherscan-api-key $ETHERSCAN_API_KEY \
        -vvvv
else
    echo "Deploying without verification (ETHERSCAN_API_KEY not set)..."
    forge script script/Deploy.s.sol \
        --rpc-url $BASE_SEPOLIA_RPC_URL \
        --broadcast \
        -vvvv
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Copy the contract addresses from the output above"
echo "2. Update frontend/.env with the addresses"
echo "3. Restart your frontend dev server"
echo ""
