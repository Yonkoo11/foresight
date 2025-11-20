# Timecaster Template Clone Guide

Use this guide to clone the Timecaster project as a template for a new project.

---

## 🚀 Quick Clone Steps

### Option 1: Clone from GitHub (After Push)

```bash
# 1. Clone the repository with a new name
git clone https://github.com/Yonkoo11/foresight.git your-new-project-name

# 2. Navigate into the new project
cd your-new-project-name

# 3. Remove the old git history (start fresh)
rm -rf .git
git init
git add .
git commit -m "Initial commit from Timecaster template"

# 4. Optional: Add new remote
git remote add origin https://github.com/YourUsername/your-new-repo.git
git branch -M main
git push -u origin main
```

### Option 2: Clone Locally (Right Now)

```bash
# 1. Copy the entire project to a new location
cp -r /Users/yonko/timecaster /Users/yonko/your-new-project-name

# 2. Navigate into the new project
cd /Users/yonko/your-new-project-name

# 3. Remove the old git history
rm -rf .git
git init

# 4. Clean up (optional)
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
```

---

## 🔧 Configuration Changes Needed

After cloning, you'll need to update various configuration files to match your new project.

### 1. Update Package Names

**`package.json`** (root):
```json
{
  "name": "your-new-project-name",
  "version": "0.0.1",
  ...
}
```

**`frontend/package.json`**:
```json
{
  "name": "your-new-project-frontend",
  ...
}
```

**`backend/package.json`**:
```json
{
  "name": "your-new-project-backend",
  ...
}
```

### 2. Update Database Name

**`backend/knexfile.ts`**:
```typescript
development: {
  client: 'pg',
  connection: {
    database: 'your_new_db_name', // Change from 'timecaster'
    user: 'postgres',
    password: 'postgres',
  },
  ...
}
```

**`backend/.env`**:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/your_new_db_name
```

### 3. Update Project Metadata

**`frontend/index.html`**:
```html
<title>Your New Project Name</title>
```

**`frontend/src/App.tsx`** - Update any references to "Timecaster"

**`backend/src/server.ts`** - Update console logs with project name

### 4. Create New Database

```bash
# Create the new database
psql postgres -c "CREATE DATABASE your_new_db_name;"

# Run migrations
cd backend
pnpm db:migrate

# Seed initial data (if needed)
pnpm exec knex seed:run
```

### 5. Update Contract Addresses (If Applicable)

If you're deploying new smart contracts:

**`frontend/src/contracts/addresses.ts`**:
```typescript
export const CONTRACT_ADDRESSES = {
  treasury: '0x...', // Your new addresses
  reputationEngine: '0x...',
  // ... etc
};
```

---

## 📦 Installation Steps for New Project

```bash
# 1. Install root dependencies
pnpm install

# 2. Install frontend dependencies
cd frontend && pnpm install

# 3. Install backend dependencies
cd ../backend && pnpm install

# 4. Set up environment variables
cd backend
cp .env.example .env
# Edit .env with your values

# 5. Create database
psql postgres -c "CREATE DATABASE your_new_db_name;"

# 6. Run migrations
pnpm db:migrate

# 7. Seed data (optional)
pnpm exec knex seed:run
```

---

## 🎯 What You Get in the Template

### Frontend (`/frontend`)
- ✅ React + TypeScript + Vite setup
- ✅ Tailwind CSS configured
- ✅ Wagmi + RainbowKit for Web3
- ✅ Clean UI components
- ✅ Page templates (Draft, Arena, Gauntlet, Whisperer, Dashboard)
- ✅ Notification system
- ✅ Contract hooks (useDraft, useArena, etc.)

### Backend (`/backend`)
- ✅ Express + TypeScript API
- ✅ PostgreSQL with Knex.js
- ✅ JWT authentication
- ✅ WebSocket support
- ✅ Cron jobs setup
- ✅ API routes structure
- ✅ Database migrations & seeds

### Smart Contracts (`/contracts`)
- ✅ Foundry setup
- ✅ Sample contracts (Treasury, ReputationEngine, etc.)
- ✅ Deployment scripts
- ✅ Test suite

---

## 🗑️ What to Remove/Modify for Your Project

### Remove Game-Specific Features (If Not Needed)

1. **CT Draft**:
   - Delete: `frontend/src/pages/Draft.tsx`
   - Delete: `backend/src/api/draft.ts`
   - Delete: `backend/migrations/*draft*`

2. **CT Whisperer**:
   - Delete: `frontend/src/pages/Whisperer.tsx`
   - Delete: `backend/src/api/whisperer.ts`
   - Delete: `backend/migrations/*whisperer*`

3. **Arena/Gauntlet**:
   - Delete: `frontend/src/pages/Arena.tsx`
   - Delete: `frontend/src/pages/Gauntlet.tsx`
   - Delete: `backend/src/api/arena.ts`
   - Delete: `backend/src/api/gauntlet.ts`

### Keep Core Infrastructure

✅ **Keep these** (useful for any project):
- Authentication system (`backend/src/api/auth.ts`)
- User management (`backend/src/api/users.ts`)
- Database setup (Knex migrations)
- Frontend routing
- Web3 integration (Wagmi/RainbowKit)
- Notification system
- WebSocket setup

---

## 🔐 Environment Variables to Update

### Backend `.env`
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/your_new_db_name

# JWT
JWT_SECRET=your_new_random_secret_here

# Blockchain (if applicable)
PRIVATE_KEY=0x...
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Twitter (if scraping)
TWITTER_BEARER_TOKEN=your_token_here

# Server
PORT=3001
NODE_ENV=development
```

### Frontend `.env`
```bash
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

---

## 📝 Checklist After Cloning

- [ ] Update all `package.json` names
- [ ] Change database name in config
- [ ] Update `.env` files
- [ ] Create new database
- [ ] Run migrations
- [ ] Update project title/metadata
- [ ] Remove unused game modes (if any)
- [ ] Set up new git repository
- [ ] Update README with new project info
- [ ] Deploy new smart contracts (if applicable)
- [ ] Update contract addresses in frontend
- [ ] Test full stack locally
- [ ] Update any hardcoded "Timecaster" references

---

## 🚀 Run the New Project

```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

Visit: http://localhost:5173

---

## 💡 Customization Ideas

Now that you have the template, you can:

1. **Change the theme**:
   - Update Tailwind colors in `frontend/tailwind.config.js`
   - Modify components in `frontend/src/components/`

2. **Add new game modes**:
   - Create new pages in `frontend/src/pages/`
   - Add API routes in `backend/src/api/`
   - Create migrations for new tables

3. **Modify smart contracts**:
   - Edit contracts in `contracts/src/`
   - Update deployment scripts
   - Re-deploy to testnet/mainnet

4. **Add new features**:
   - Quest system (already partially implemented)
   - Rewards system
   - Social features
   - Analytics dashboard

---

## 🆘 Common Issues After Cloning

### Database Connection Error
```bash
# Make sure PostgreSQL is running
brew services start postgresql@15

# Verify database exists
psql -l | grep your_new_db_name
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill

# Kill process on port 5173
lsof -ti:5173 | xargs kill
```

### Contract Not Found
```bash
# Re-deploy contracts
cd contracts
forge script script/Deploy.s.sol --rpc-url $BASE_SEPOLIA_RPC_URL --broadcast

# Update addresses in frontend/src/contracts/addresses.ts
```

---

## 📚 Next Steps

After setting up your new project:

1. **Customize the UI** to match your brand
2. **Add your own game mechanics** or features
3. **Deploy smart contracts** to your target network
4. **Set up CI/CD** (GitHub Actions, Vercel, etc.)
5. **Configure production database** (Railway, Supabase, etc.)
6. **Deploy frontend** (Vercel, Netlify, etc.)
7. **Deploy backend** (Railway, Render, Fly.io, etc.)

---

Generated: January 20, 2025

**Template Source**: Timecaster v1.0
