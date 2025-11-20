# Smart Contract Deployment Guide
**Target**: Base Sepolia Testnet
**Status**: Ready to Deploy

---

## 📋 Pre-Deployment Checklist

### 1. **Install Foundry** (if not already installed)
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:
```bash
forge --version
cast --version
```

### 2. **Set Up Environment Variables**
Create `.env` file in `/contracts` directory:

```bash
# Deployer wallet
PRIVATE_KEY=your_private_key_here

# Base Sepolia RPC (get from Alchemy/Infura)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Basescan API key (for contract verification)
ETHERSCAN_API_KEY=your_basescan_api_key

# Optional: Backend keeper wallet (or uses deployer)
KEEPER_ADDRESS=0x...

# Optional: Oracle wallet (or uses deployer)
ORACLE_ADDRESS=0x...
```

### 3. **Fund Deployer Wallet**
- Get Base Sepolia ETH from faucet
- Faucets:
  - https://www.alchemy.com/faucets/base-sepolia
  - https://docs.base.org/tools/network-faucets

**Recommended**: 0.5 ETH for deployment + testing

---

## 🚀 Deployment Steps

### Step 1: Test Compilation
```bash
cd /Users/yonko/timecaster/contracts
forge build
```

Expected output: All 6 contracts compile successfully

### Step 2: Run Tests
```bash
forge test
```

Expected output: All tests pass

### Step 3: Dry Run Deployment
```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY
```

This simulates deployment without broadcasting.

### Step 4: Deploy to Base Sepolia
```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

**What this does:**
1. Deploys all 6 contracts in order
2. Configures contract relationships
3. Sets keeper and oracle addresses
4. Verifies contracts on Basescan

**Duration**: ~2-3 minutes

---

## 📦 Contracts Deployed (in order)

1. **Treasury** - Fee collection
2. **ReputationEngine** - Unified scoring system
3. **ForesightNFT** - Dynamic NFT (linked to ReputationEngine)
4. **CTDraft** - Fantasy league game
5. **TimecasterArena** - 1v1 prediction duels
6. **DailyGauntlet** - Daily prediction tournaments

---

## ✅ Post-Deployment

### 1. **Save Contract Addresses**
The deployment script will output all addresses. Example:

```
Contract Addresses:
-------------------
Treasury:            0x1234...
ReputationEngine:    0x5678...
ForesightNFT:        0x9abc...
CTDraft:             0xdef0...
TimecasterArena:     0x1111...
DailyGauntlet:       0x2222...
```

### 2. **Update Frontend Environment**
Create `/frontend/.env.local`:

```bash
VITE_TREASURY_ADDRESS=0x...
VITE_REPUTATION_ENGINE_ADDRESS=0x...
VITE_FORESIGHT_NFT_ADDRESS=0x...
VITE_CT_DRAFT_ADDRESS=0x...
VITE_TIMECASTER_ARENA_ADDRESS=0x...
VITE_DAILY_GAUNTLET_ADDRESS=0x...
```

### 3. **Update Backend Environment**
Add to `/backend/.env`:

```bash
TREASURY_ADDRESS=0x...
REPUTATION_ENGINE_ADDRESS=0x...
FORESIGHT_NFT_ADDRESS=0x...
CT_DRAFT_ADDRESS=0x...
TIMECASTER_ARENA_ADDRESS=0x...
DAILY_GAUNTLET_ADDRESS=0x...
```

### 4. **Verify on Basescan**
Check contracts at: `https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS`

---

## 🧪 Testing Deployed Contracts

### Test 1: Create a Prediction (Terminal Dashboard)
```bash
# In frontend terminal:
pnpm run dev

# Navigate to: http://localhost:5173/terminal
# Connect wallet
# Click "Create Prediction"
# Fill form and submit
```

**Expected**: Transaction succeeds, prediction appears in Terminal

### Test 2: Mark Outcome
```bash
# Wait for prediction to expire (or use past timestamp)
# Click on expired prediction
# Mark TRUE or FALSE
```

**Expected**: Foresight score updates, NFT level may change

### Test 3: Check NFT
```bash
# Navigate to: http://localhost:5173/profile
# or view on OpenSea testnets
```

**Expected**: Dynamic NFT shows your stats

---

## 🔍 Verification

### Contract Verification on Basescan
If auto-verification fails during deployment:

```bash
forge verify-contract \
  --chain-id 84532 \
  --watch \
  YOUR_CONTRACT_ADDRESS \
  src/Treasury.sol:Treasury \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

Repeat for each contract.

### Check Configuration
Run verification function:

```bash
forge script script/Deploy.s.sol:Deploy \
  --sig "verify()" \
  --rpc-url $BASE_SEPOLIA_RPC_URL
```

---

## 🐛 Troubleshooting

### Issue: "Insufficient funds"
**Solution**: Fund deployer wallet with more Base Sepolia ETH

### Issue: "Nonce too low"
**Solution**: Reset nonce or wait for pending tx to confirm

### Issue: "Contract verification failed"
**Solution**:
1. Check ETHERSCAN_API_KEY is correct
2. Wait 30 seconds and try manual verification
3. Verify contracts manually on Basescan

### Issue: "RPC URL not responding"
**Solution**:
1. Check BASE_SEPOLIA_RPC_URL is correct
2. Try alternative RPC: `https://base-sepolia-rpc.publicnode.com`

---

## 📊 Gas Estimates

Estimated gas cost for full deployment:

| Contract | Gas Used | Est. Cost (@ 1 gwei) |
|----------|----------|---------------------|
| Treasury | ~500K | 0.0005 ETH |
| ReputationEngine | ~2M | 0.002 ETH |
| ForesightNFT | ~3M | 0.003 ETH |
| CTDraft | ~1.5M | 0.0015 ETH |
| TimecasterArena | ~4M | 0.004 ETH |
| DailyGauntlet | ~3M | 0.003 ETH |
| **Total** | ~14M | **~0.014 ETH** |

**Plus configuration**: ~1M gas (~0.001 ETH)

**Total Deployment Cost**: ~0.02 ETH

*(Gas prices vary, have 0.5 ETH to be safe)*

---

## 🔐 Security Notes

### Private Key Safety
- **NEVER** commit `.env` to Git
- `.env` is in `.gitignore`
- Use a separate deployer wallet (not your main wallet)
- Fund only what you need for deployment

### Post-Deployment
- **Transfer ownership** to multisig (for mainnet)
- **Set keeper to backend wallet** (separate from deployer)
- **Monitor keeper balance** (needs gas for resolving predictions)

---

## 📝 Next Steps After Deployment

1. ✅ Contracts deployed to Base Sepolia
2. ✅ Frontend `.env.local` updated
3. ✅ Backend `.env` updated
4. ⬜ Create test prediction in Terminal
5. ⬜ Mark test prediction outcome
6. ⬜ Verify NFT updates correctly
7. ⬜ Test all 4 game modes
8. ⬜ Set up backend keeper automation
9. ⬜ Deploy to mainnet (when ready)

---

## 🎯 Success Criteria

Deployment is successful when:

- [x] All 6 contracts deployed
- [x] All contracts verified on Basescan
- [x] ReputationEngine connected to games
- [x] ForesightNFT linked to ReputationEngine
- [x] Keeper and oracle addresses set
- [x] Frontend can interact with contracts
- [x] Test prediction works end-to-end

---

**Ready to deploy?** Run the commands in order and follow the checklist! 🚀
