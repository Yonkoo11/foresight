# Foresight

Cloned from Timecaster template on January 20, 2025

## Quick Start

```bash
# Install dependencies
pnpm install

# Create database
psql postgres -c "CREATE DATABASE foresight;"

# Run migrations
cd backend && pnpm db:migrate

# Start backend (terminal 1)
cd backend && pnpm dev

# Start frontend (terminal 2)
cd frontend && pnpm dev
```

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Wagmi, RainbowKit
- **Backend**: Express, TypeScript, PostgreSQL, Knex.js
- **Blockchain**: Foundry, Base Sepolia
- **Real-time**: WebSocket

## Project Structure

```
foresight/
├── frontend/          # React frontend
├── backend/           # Express backend
├── contracts/         # Smart contracts (Foundry)
└── README.md
```

## Features

- Web3 wallet authentication (RainbowKit)
- Real-time WebSocket updates
- PostgreSQL database with migrations
- Smart contract integration
- Clean, modern UI with Tailwind CSS

## Next Steps

1. Review and update `backend/.env`
2. Customize the UI in `frontend/src/`
3. Add your own features
4. Deploy smart contracts to Base Sepolia
5. Launch your app!

---

**Template source**: [Timecaster](https://github.com/Yonkoo11/foresight)
