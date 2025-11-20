#!/bin/bash

# Timecaster Template Clone Script
# Usage: ./clone-template.sh <new-project-name> <new-project-path>

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: ./clone-template.sh <new-project-name> <new-project-path>"
    echo "Example: ./clone-template.sh my-fantasy-game /Users/yonko/my-fantasy-game"
    exit 1
fi

NEW_PROJECT_NAME=$1
NEW_PROJECT_PATH=$2
CURRENT_DIR=$(pwd)

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Timecaster Template Clone Script${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Copy project
echo -e "${GREEN}[1/8]${NC} Copying project to ${NEW_PROJECT_PATH}..."
cp -r "$CURRENT_DIR" "$NEW_PROJECT_PATH"
cd "$NEW_PROJECT_PATH"

# Step 2: Remove git history
echo -e "${GREEN}[2/8]${NC} Removing old git history..."
rm -rf .git
git init
echo -e "✓ Initialized new git repository\n"

# Step 3: Clean up node_modules
echo -e "${GREEN}[3/8]${NC} Cleaning up node_modules..."
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules
echo -e "✓ Cleaned up node_modules\n"

# Step 4: Update root package.json
echo -e "${GREEN}[4/8]${NC} Updating package.json files..."
sed -i '' "s/\"timecaster\"/\"$NEW_PROJECT_NAME\"/" package.json
sed -i '' "s/\"frontend\"/\"${NEW_PROJECT_NAME}-frontend\"/" frontend/package.json
sed -i '' "s/\"timecaster-backend\"/\"${NEW_PROJECT_NAME}-backend\"/" backend/package.json
echo -e "✓ Updated package.json files\n"

# Step 5: Create new database name
DB_NAME=$(echo "$NEW_PROJECT_NAME" | tr '-' '_')
echo -e "${GREEN}[5/8]${NC} Database will be named: ${BLUE}${DB_NAME}${NC}"

# Update knexfile.ts
sed -i '' "s/database: 'timecaster'/database: '${DB_NAME}'/" backend/knexfile.ts

# Update .env if it exists
if [ -f "backend/.env" ]; then
    sed -i '' "s/timecaster/${DB_NAME}/g" backend/.env
fi

echo -e "✓ Updated database configuration\n"

# Step 6: Update index.html title
echo -e "${GREEN}[6/8]${NC} Updating project title..."
PROJECT_TITLE=$(echo "$NEW_PROJECT_NAME" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1')
sed -i '' "s/<title>.*<\/title>/<title>${PROJECT_TITLE}<\/title>/" frontend/index.html
echo -e "✓ Updated to: ${BLUE}${PROJECT_TITLE}${NC}\n"

# Step 7: Create README
echo -e "${GREEN}[7/8]${NC} Creating new README..."
cat > README.md << EOF
# ${PROJECT_TITLE}

Cloned from Timecaster template on $(date +%Y-%m-%d)

## Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Create database
psql postgres -c "CREATE DATABASE ${DB_NAME};"

# Run migrations
cd backend && pnpm db:migrate

# Start backend (terminal 1)
cd backend && pnpm dev

# Start frontend (terminal 2)
cd frontend && pnpm dev
\`\`\`

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Express, TypeScript, PostgreSQL, Knex.js
- **Blockchain**: Foundry, Wagmi, RainbowKit
- **Deployment**: Base Sepolia

## Project Structure

\`\`\`
${NEW_PROJECT_NAME}/
├── frontend/          # React frontend
├── backend/           # Express backend
├── contracts/         # Smart contracts
└── README.md
\`\`\`

## Next Steps

1. Update \`.env\` files
2. Customize the UI
3. Add your own features
4. Deploy smart contracts
5. Launch!

---

Template source: [Timecaster](https://github.com/Yonkoo11/foresight)
EOF

echo -e "✓ Created new README\n"

# Step 8: Initial commit
echo -e "${GREEN}[8/8]${NC} Creating initial commit..."
git add .
git commit -m "Initial commit from Timecaster template

Cloned project structure with:
- React + TypeScript frontend
- Express + PostgreSQL backend
- Smart contracts setup
- Authentication system
- Web3 integration

Ready for customization!"

echo -e "✓ Created initial commit\n"

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Template cloned successfully!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "Project: ${BLUE}${PROJECT_TITLE}${NC}"
echo -e "Location: ${BLUE}${NEW_PROJECT_PATH}${NC}"
echo -e "Database: ${BLUE}${DB_NAME}${NC}\n"

echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. cd ${NEW_PROJECT_PATH}"
echo -e "2. Review and update backend/.env"
echo -e "3. Create database: ${BLUE}psql postgres -c \"CREATE DATABASE ${DB_NAME};\"${NC}"
echo -e "4. Install dependencies: ${BLUE}pnpm install${NC}"
echo -e "5. Run migrations: ${BLUE}cd backend && pnpm db:migrate${NC}"
echo -e "6. Start servers: ${BLUE}pnpm dev${NC}\n"

echo -e "Documentation: ${NEW_PROJECT_PATH}/TEMPLATE_CLONE_GUIDE.md\n"
