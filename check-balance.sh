#!/bin/bash

ADDRESS="0x414A1F683feB519C4F24EbAbF782FF71A75C7BC0"
RPC="https://sepolia.base.org"

echo "🔍 Checking wallet balance..."
echo ""
echo "Address: $ADDRESS"
echo "Network: Base Sepolia"
echo ""

BALANCE_WEI=$(cast balance $ADDRESS --rpc-url $RPC)
BALANCE_ETH=$(echo "scale=4; $BALANCE_WEI / 1000000000000000000" | bc)

echo "Balance: $BALANCE_ETH ETH"
echo ""

if (( $(echo "$BALANCE_ETH >= 0.1" | bc -l) )); then
    echo "✅ You have enough ETH to deploy!"
    echo ""
    echo "Ready to deploy? Run:"
    echo "  ./scripts/deploy-and-update.sh"
else
    echo "⏳ Need more ETH. Recommended: 0.1+ ETH"
    echo ""
    echo "Get testnet ETH from:"
    echo "  https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet"
fi
