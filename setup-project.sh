#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🎮 Setting up BINGO-BET-FUN-2025 project structure...${NC}\n"

# Core directories structure
directories=(
    "src/features/game/components/BingoCard"
    "src/features/game/services"
    "src/features/game/hooks"
    "src/features/game/types"
    "src/features/player/components/Dashboard"
    "src/features/player/services"
    "src/features/player/hooks"
    "src/features/stream/components"
    "src/features/stream/services"
    "src/features/admin/components"
    "src/features/admin/services"
    "src/components/ui"
    "src/lib/firebase"
    "src/lib/i18n"
    "src/services/api"
    "src/services/auth"
    "src/styles"
    "src/types/enums"
    "src/types/interfaces"
    "public/assets/images"
    "public/locales"
    "tests/unit"
    "tests/integration"
)

# Create directories
for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo -e "${GREEN}✓ Created directory:${NC} $dir"
    else
        echo -e "${YELLOW}• Directory exists:${NC} $dir"
    fi
done

# Move files to correct locations
echo -e "\n${GREEN}Moving files to correct locations...${NC}"

# Check and move BingoCard
if [ -f "src/components/BingoCard.js" ]; then
    mv src/components/BingoCard.js src/features/game/components/BingoCard/index.tsx
    echo -e "${GREEN}✓ Moved:${NC} BingoCard.js → features/game/components/BingoCard/index.tsx"
fi

# Check and move PlayerDashboard
if [ -f "src/components/PlayerDashboard.tsx" ]; then
    mv src/components/PlayerDashboard.tsx src/features/player/components/Dashboard/index.tsx
    echo -e "${GREEN}✓ Moved:${NC} PlayerDashboard.tsx → features/player/components/Dashboard/index.tsx"
fi

# Check and move GameManager
if [ -f "src/services/GameManager.ts" ]; then
    mv src/services/GameManager.ts src/features/game/services/gameManager.ts
    echo -e "${GREEN}✓ Moved:${NC} GameManager.ts → features/game/services/gameManager.ts"
fi

# Create essential configuration files if they don't exist
echo -e "\n${GREEN}Checking configuration files...${NC}"

# tsconfig.json
if [ ! -f "tsconfig.json" ]; then
    echo '{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}' > tsconfig.json
    echo -e "${GREEN}✓ Created:${NC} tsconfig.json"
fi

# Validate existing files structure
echo -e "\n${GREEN}Validating project structure...${NC}"

# Function to validate directory
validate_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓ Valid:${NC} $1"
        return 0
    else
        echo -e "${RED}✗ Missing:${NC} $1"
        return 1
    fi  # Fixed the syntax error here
}

# Validate core directories
validate_directory "src/features/game"
validate_directory "src/features/player"
validate_directory "src/features/stream"
validate_directory "src/components/ui"
validate_directory "src/lib"
validate_directory "src/services"

echo -e "\n${GREEN}Setup complete!${NC}\n"

# Display next steps
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run 'npm install' to install dependencies"
echo "2. Check for any path updates needed in imports"
echo "3. Run 'npm run dev' to start development server"