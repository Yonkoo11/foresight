#!/bin/bash

# Timecaster Quick Start Script
# Automates the complete setup process for new developers

set -e  # Exit on error

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔮 Timecaster Quick Start${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if PostgreSQL is running
check_postgres() {
    if command_exists psql; then
        if psql -lqt | cut -d \| -f 1 | grep -qw timecaster 2>/dev/null; then
            return 0
        fi
    fi
    return 1
}

# Step 1: Check Prerequisites
echo -e "${YELLOW}Step 1: Checking Prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"

if ! command_exists pnpm; then
    echo -e "${YELLOW}⚠️  pnpm not found. Installing pnpm...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}✅ pnpm: $(pnpm --version)${NC}"

if ! command_exists psql; then
    echo -e "${RED}❌ PostgreSQL is not installed.${NC}"
    echo -e "${YELLOW}Install with: brew install postgresql@15${NC}"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL installed${NC}"

if ! command_exists forge; then
    echo -e "${YELLOW}⚠️  Foundry not found. Skipping contract checks...${NC}"
else
    echo -e "${GREEN}✅ Foundry: $(forge --version | head -1)${NC}"
fi

echo ""

# Step 2: Install Dependencies
echo -e "${YELLOW}Step 2: Installing Dependencies...${NC}"

cd "$(dirname "$0")/.."

if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    pnpm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && pnpm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && pnpm install && cd ..
fi

echo -e "${GREEN}✅ Dependencies installed${NC}\n"

# Step 3: Set Up PostgreSQL
echo -e "${YELLOW}Step 3: Setting Up Database...${NC}"

if ! brew services list | grep postgresql@15 | grep -q started; then
    echo "Starting PostgreSQL..."
    brew services start postgresql@15
    sleep 2
fi

if ! check_postgres; then
    echo "Creating timecaster database..."
    createdb timecaster || echo "Database may already exist"
fi

echo -e "${GREEN}✅ Database ready${NC}\n"

# Step 4: Initialize Database Schema
echo -e "${YELLOW}Step 4: Initializing Database Schema...${NC}"

cd backend

if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env 2>/dev/null || echo "Note: Update .env with your settings"
fi

echo "Running database initialization..."
pnpm exec tsx src/scripts/initDb.ts

echo "Seeding influencers..."
pnpm exec tsx src/scripts/seedInfluencers.ts

cd ..
echo -e "${GREEN}✅ Database initialized with 50 influencers${NC}\n"

# Step 5: Configure Environment
echo -e "${YELLOW}Step 5: Checking Configuration...${NC}"

if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env not found. Please create it from .env.example${NC}"
    exit 1
fi

if [ -f "contracts/.env" ]; then
    echo -e "${GREEN}✅ Contracts configured${NC}"
else
    echo -e "${YELLOW}⚠️  contracts/.env not found (optional for CT Draft)${NC}"
fi

echo ""

# Final Instructions
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${BLUE}To start the application:${NC}\n"
echo -e "  ${YELLOW}Terminal 1 (Backend):${NC}"
echo -e "    cd backend && pnpm dev\n"
echo -e "  ${YELLOW}Terminal 2 (Frontend):${NC}"
echo -e "    cd frontend && pnpm dev\n"
echo -e "  ${YELLOW}Or use the dev script:${NC}"
echo -e "    ./scripts/dev.sh\n"

echo -e "${BLUE}Access the application:${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:3001${NC}"
echo -e "  Health:   ${GREEN}http://localhost:3001/health${NC}\n"

echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Connect your wallet (MetaMask/Rainbow)"
echo -e "  2. Switch to Base Sepolia network"
echo -e "  3. Visit http://localhost:5173"
echo -e "  4. Start drafting your CT team!\n"

echo -e "${YELLOW}For deployment, see:${NC}"
echo -e "  - README.md (root)"
echo -e "  - backend/README.md"
echo -e "  - frontend/README.md\n"
