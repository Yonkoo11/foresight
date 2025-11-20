# ⚡ Quick Setup Guide

## Getting Your Reown Project ID

**Important**: WalletConnect has rebranded to **Reown** in 2024. The libraries (`wagmi`, `viem`, `@rainbow-me/rainbowkit`) still work the same way, but you now get your Project ID from Reown's cloud service.

### Step-by-Step:

1. **Visit Reown Cloud**
   Go to [https://cloud.reown.com](https://cloud.reown.com)

2. **Sign Up / Log In**
   - Use GitHub, Email, or Google to sign up
   - It's completely free for development and small apps

3. **Create a New Project**
   - Click "Create Project"
   - Name it: `Timecaster` (or any name you prefer)
   - Select "App" as project type

4. **Get Your Project ID**
   - Copy the **Project ID** from the dashboard
   - It looks like: `abc123def456...` (long alphanumeric string)

5. **Add to `.env`**
   ```bash
   cd timecaster/frontend
   cp .env.example .env
   nano .env
   ```

   Paste your Project ID:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### Why Do I Need This?

RainbowKit uses Reown's infrastructure to:
- Connect to wallets via WalletConnect protocol
- Enable mobile wallet connections
- Provide QR code scanning
- Support 350+ wallets

### Free Tier Limits

Reown's free tier includes:
- ✅ Unlimited users
- ✅ Up to 1M monthly requests
- ✅ All wallet connectors
- ✅ Perfect for development and small apps

## Contract Configuration

After deploying your contracts, add the addresses to `.env`:

```env
VITE_TIMECASTER_ADDRESS=0x... (from forge script output)
VITE_FORESIGHT_NFT_ADDRESS=0x... (from forge script output)
```

## Quick Test

After setting up `.env`:

```bash
pnpm dev
```

You should see:
1. ✅ App loads without errors
2. ✅ "Connect Wallet" button appears
3. ✅ Clicking it shows wallet options (MetaMask, Coinbase Wallet, etc.)
4. ✅ You can connect on Base Sepolia network

## Troubleshooting

**Error: "Invalid project ID"**
- Double-check you copied the entire Project ID
- Make sure there are no extra spaces
- Verify the `.env` file is in the `frontend/` directory

**Error: "Network not supported"**
- Switch your wallet to **Base Sepolia** network
- Add Base Sepolia manually if needed:
  - Network Name: Base Sepolia
  - RPC URL: https://sepolia.base.org
  - Chain ID: 84532
  - Currency: ETH
  - Block Explorer: https://sepolia.basescan.org

**Wallet not connecting**
- Clear browser cache
- Try a different wallet (MetaMask, Coinbase Wallet, etc.)
- Check browser console for errors

## Next Steps

See **DEPLOYMENT.md** for full deployment guide.

---

💡 **Pro Tip**: Keep your Project ID in a password manager. You'll need it if you redeploy or work on another machine.
