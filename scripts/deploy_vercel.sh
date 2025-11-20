#!/bin/bash
set -euo pipefail

# ============================================================================
# Timecaster Vercel Deployment Script
# ============================================================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Timecaster Vercel Deployment${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Change to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
    echo -e "${GREEN}✓ Vercel CLI installed${NC}"
    echo ""
fi

# Check if .env exists in frontend
if [ ! -f frontend/.env ]; then
    echo -e "${YELLOW}Warning: frontend/.env not found${NC}"
    echo "Make sure to set environment variables in Vercel dashboard after deployment"
    echo ""
fi

cd frontend

# Build the project first to check for errors
echo -e "${YELLOW}Building project...${NC}"
if pnpm build; then
    echo -e "${GREEN}✓ Build successful${NC}"
    echo ""
else
    echo -e "${RED}✗ Build failed${NC}"
    echo "Fix build errors before deploying"
    exit 1
fi

echo -e "${YELLOW}Deploying to Vercel...${NC}"
echo ""

# Deploy to Vercel
vercel --prod

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Important: Set environment variables in Vercel dashboard"
echo ""
echo "Go to your project settings → Environment Variables and add:"
echo "  VITE_WALLETCONNECT_PROJECT_ID"
echo "  VITE_TIMECASTER_ADDRESS"
echo "  VITE_FORESIGHT_NFT_ADDRESS"
echo "  VITE_BASE_SEPOLIA_RPC_URL"
echo ""
echo "After setting variables, redeploy:"
echo "  vercel --prod"
echo ""
