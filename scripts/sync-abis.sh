#!/bin/bash

# ============================================================================
# Sync Contract ABIs
# Copies compiled ABIs from contracts/out to frontend/src/contracts/abis
# ============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "========================================"
echo "  Syncing Contract ABIs"
echo "========================================"
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -d "contracts/out" ]; then
    echo "Error: contracts/out directory not found"
    echo "Run 'cd contracts && forge build' first"
    exit 1
fi

if [ ! -d "frontend/src/contracts/abis" ]; then
    echo "Creating frontend/src/contracts/abis directory..."
    mkdir -p frontend/src/contracts/abis
fi

# List of contracts to sync
contracts=(
    "TimecasterArena"
    "CTDraft"
    "DailyGauntlet"
    "ForesightNFT"
    "ReputationEngine"
    "Treasury"
)

echo "Syncing ABIs..."
echo ""

for contract in "${contracts[@]}"; do
    src="contracts/out/${contract}.sol/${contract}.json"
    dest="frontend/src/contracts/abis/${contract}.json"

    if [ -f "$src" ]; then
        cat "$src" | jq '.abi' > "$dest"
        echo -e "${GREEN}✓${NC} $contract"
    else
        echo -e "⚠ $contract not found (skipped)"
    fi
done

echo ""
echo -e "${GREEN}ABI sync complete!${NC}"
echo ""
echo "Updated files:"
echo "  frontend/src/contracts/abis/"
