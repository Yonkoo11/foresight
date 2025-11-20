# Timecaster Frontend

React-based Web3 frontend for the Timecaster fantasy sports platform - draft teams of Crypto Twitter influencers, compete in real-time predictions, and earn rewards based on social engagement metrics.

## Features

### Game Modes

- **CT Draft**: Fantasy league drafting of top CT influencers with real-time scoring
- **Arena**: 1v1 prediction duels with on-chain settlement (coming soon)
- **Daily Gauntlet**: Multi-round prediction challenges (coming soon)
- **Whisperer**: Social sentiment prediction market (coming soon)

### Core Features

- **Web3 Wallet Integration**: RainbowKit + Wagmi for seamless wallet connection
- **Real-time Updates**: WebSocket integration for live scores and leaderboards
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Social Sharing**: Share your teams and achievements to social media
- **Achievement System**: Unlock badges and earn reputation points
- **Leaderboards**: Global and weekly rankings across all game modes
- **Profile System**: Track your stats, history, and achievements

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.17
- **Web3**:
  - Wagmi 2.19.2 (Ethereum interactions)
  - Viem 2.38.6 (Ethereum library)
  - RainbowKit 2.2.9 (Wallet connection UI)
- **State Management**:
  - TanStack Query 5.90.7 (Server state)
  - React Context (Global state)
- **Routing**: React Router DOM 7.9.5
- **Animations**: Framer Motion 12.23.24
- **Icons**:
  - Lucide React 0.553.0
  - Phosphor Icons 2.1.10
- **Utils**: date-fns 4.1.0, html2canvas 1.4.1

## Prerequisites

- **Node.js** 18.x or higher
- **pnpm** (recommended) or npm
- **Backend API** running (see `/backend/README.md`)
- **Wallet Extension**: MetaMask, Rainbow, or any WalletConnect-compatible wallet

## Installation

1. **Navigate to frontend directory**:
```bash
cd /path/to/timecaster/frontend
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Configure environment** (optional):

Create `.env.local` if you need to override defaults:
```env
VITE_API_URL=http://localhost:3001
VITE_CHAIN_ID=84532
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## Running the Application

### Development Mode

```bash
pnpm dev
```

Frontend will start on `http://localhost:5173` (or next available port).

### Production Build

```bash
pnpm build
```

Builds optimized production bundle to `/dist`.

### Preview Production Build

```bash
pnpm preview
```

Preview the production build locally.

## Project Structure

```
frontend/
├── src/
│   ├── assets/           # Static assets (images, fonts)
│   ├── components/       # Reusable UI components
│   │   ├── arena/        # Arena mode components
│   │   ├── draft/        # Draft mode components
│   │   ├── gauntlet/     # Gauntlet mode components
│   │   ├── home/         # Landing page components
│   │   ├── modals/       # Modal dialogs
│   │   ├── terminal/     # Terminal/Dashboard components
│   │   └── whisperer/    # Whisperer mode components
│   ├── config/           # Configuration files
│   │   ├── wagmi.ts      # Wagmi/RainbowKit config
│   │   └── contracts.ts  # Contract addresses & ABIs
│   ├── contexts/         # React Context providers
│   │   ├── ToastContext.tsx
│   │   └── NotificationContext.tsx
│   ├── contracts/        # Smart contract ABIs
│   │   └── abis/         # Contract ABI files
│   ├── data/             # Mock/static data
│   ├── hooks/            # Custom React hooks
│   │   └── useWebSocket.ts
│   ├── pages/            # Page components
│   │   ├── Home.tsx      # Landing page
│   │   ├── Draft.tsx     # CT Draft page
│   │   ├── Arena.tsx     # Arena mode page
│   │   ├── Gauntlet.tsx  # Gauntlet mode page
│   │   ├── Whisperer.tsx # Whisperer mode page
│   │   ├── Leaderboard.tsx
│   │   ├── Profile.tsx
│   │   └── TerminalDashboard.tsx
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   └── api.ts        # API client
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global CSS
├── public/               # Public static files
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Key Features

### 1. CT Draft Mode

**Location**: `src/pages/Draft.tsx`

Draft your fantasy team of CT influencers:
- Browse 50+ top CT influencers (S/A/B/C tiers)
- 100-point budget cap system
- 5-player teams
- Real-time leaderboards
- Auto-save teams to wallet address

**User Flow**:
1. Connect wallet via RainbowKit
2. Browse influencers by tier
3. Draft 5 influencers within budget
4. Submit team to backend
5. View leaderboard rankings

### 2. Wallet Integration

**Location**: `src/config/wagmi.ts`

Powered by RainbowKit + Wagmi:
- One-click wallet connection
- Support for MetaMask, Rainbow, Coinbase Wallet, WalletConnect
- Base Sepolia (testnet) and Base Mainnet support
- Automatic network switching
- ENS name resolution

### 3. Real-time Updates

**Location**: `src/hooks/useWebSocket.ts`

WebSocket integration for:
- Live score updates
- Leaderboard changes
- New team notifications
- Game state changes

### 4. Responsive UI

Built with Tailwind CSS:
- Mobile-first design
- Dark mode support (coming soon)
- Smooth animations with Framer Motion
- Glass-morphism effects
- Gradient backgrounds

## Configuration

### Wagmi/RainbowKit Setup

**File**: `src/config/wagmi.ts`

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { baseSepolia, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Timecaster',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [baseSepolia, base],
});
```

Get a WalletConnect Project ID:
1. Go to https://cloud.walletconnect.com
2. Create a new project
3. Copy the Project ID
4. Add to `src/config/wagmi.ts`

### Smart Contracts

**File**: `src/config/contracts.ts`

Contract addresses and ABIs are configured here:
```typescript
export const CONTRACTS = {
  CT_DRAFT: {
    address: '0x01C5ca0b837E5FC057CF31FA6aD28786261dA13e',
    abi: CTDraftABI,
  },
  REPUTATION_ENGINE: {
    address: '0xYourReputationAddress',
    abi: ReputationEngineABI,
  },
  // ... other contracts
};
```

Update these addresses after deploying contracts (see `/contracts/README.md`).

### API Client

**File**: `src/utils/api.ts`

Configure backend API URL:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getInfluencers() {
  return request('/api/draft/influencers');
}

export async function submitTeam(data: TeamData) {
  return request('/api/draft/team', { method: 'POST', body: data });
}
```

## Backend Integration

The frontend connects to the Express.js backend for:

1. **Influencer Data**: `GET /api/draft/influencers`
2. **Team Submission**: `POST /api/draft/team`
3. **Team Retrieval**: `GET /api/draft/team/:walletAddress`
4. **Leaderboards**: `GET /api/draft/leaderboard`
5. **User Profile**: `GET /api/users/me`

**Required**: Backend must be running on `http://localhost:3001` (or configured URL).

See `/backend/README.md` for API documentation.

## Environment Variables

### Available Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | Backend API URL |
| `VITE_CHAIN_ID` | `84532` | Chain ID (84532 = Base Sepolia) |
| `VITE_WALLET_CONNECT_PROJECT_ID` | - | WalletConnect Project ID |

### Example `.env.local`

```env
# Backend API
VITE_API_URL=http://localhost:3001

# Blockchain
VITE_CHAIN_ID=84532

# WalletConnect
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id_here
```

## Development Workflow

### 1. Start Backend

```bash
cd ../backend
pnpm dev
```

Backend should be running on `http://localhost:3001`.

### 2. Start Frontend

```bash
pnpm dev
```

Frontend will start on `http://localhost:5173`.

### 3. Connect Wallet

1. Click "Connect Wallet" in navbar
2. Select your wallet (MetaMask, Rainbow, etc.)
3. Approve connection
4. Switch to Base Sepolia network if needed

### 4. Test CT Draft Flow

1. Navigate to "CT Draft" page
2. Browse influencers
3. Draft 5 influencers (budget: 100 points)
4. Name your team
5. Submit team
6. View leaderboard

## Testing

### Manual Testing Checklist

- [ ] Wallet connection works
- [ ] Network switching works (Base Sepolia)
- [ ] Influencers load from backend
- [ ] Draft UI shows budget remaining
- [ ] Cannot draft more than 5 influencers
- [ ] Cannot exceed 100-point budget
- [ ] Team submission saves to backend
- [ ] Team auto-loads on page refresh
- [ ] Leaderboard displays correctly
- [ ] Profile page shows wallet info

### Test with Different Wallets

- MetaMask
- Rainbow Wallet
- Coinbase Wallet
- WalletConnect-compatible wallets

## Build & Deployment

### Build for Production

```bash
pnpm build
```

This creates an optimized build in `/dist` directory.

### Preview Production Build

```bash
pnpm preview
```

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel
```

3. **Set Environment Variables** in Vercel dashboard:
   - `VITE_API_URL`: Your production backend URL
   - `VITE_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect Project ID

### Deploy to Netlify

1. **Build** the project:
```bash
pnpm build
```

2. **Deploy** `/dist` folder to Netlify

3. **Configure** environment variables in Netlify dashboard

### Deploy to GitHub Pages

1. **Update** `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/timecaster/',
  plugins: [react()],
})
```

2. **Build**:
```bash
pnpm build
```

3. **Deploy** `/dist` to `gh-pages` branch

## Troubleshooting

### Wallet Not Connecting

- Check that you have a wallet extension installed
- Ensure you're on a supported network (Base Sepolia)
- Clear browser cache and try again
- Check browser console for errors

### API Errors

```
Failed to load influencers
```

**Solution**: Ensure backend is running on `http://localhost:3001`

```bash
cd ../backend
pnpm dev
```

### Build Errors

```
Type error: Cannot find module
```

**Solution**: Ensure all dependencies are installed

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Network Mismatch

```
Please switch to Base Sepolia
```

**Solution**:
1. Click "Switch Network" in RainbowKit modal
2. Approve network switch in wallet
3. Ensure Base Sepolia is added to your wallet

Add Base Sepolia manually:
- Network Name: Base Sepolia
- RPC URL: https://sepolia.base.org
- Chain ID: 84532
- Currency Symbol: ETH
- Block Explorer: https://sepolia.basescan.org

### Port Already in Use

```
Port 5173 is already in use
```

**Solution**: Kill the process or use a different port

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or specify a different port
pnpm dev --port 5174
```

## Performance Optimization

### Code Splitting

Routes are automatically code-split by Vite. Heavy components can be lazy-loaded:

```typescript
import { lazy, Suspense } from 'react';

const Draft = lazy(() => import('./pages/Draft'));

<Suspense fallback={<Loading />}>
  <Draft />
</Suspense>
```

### Image Optimization

- Use WebP format for images
- Lazy load images with `loading="lazy"`
- Use proper image dimensions

### Bundle Analysis

```bash
pnpm build --mode analyze
```

## Contributing

1. Follow existing code style
2. Use TypeScript for all new files
3. Add types for all props and functions
4. Test wallet integration before committing
5. Ensure responsive design (mobile, tablet, desktop)
6. Update this README if adding new features

## License

MIT
