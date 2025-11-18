#!/bin/bash

# StudyBuddy Setup Script
# This script helps set up the development environment

echo "🚀 StudyBuddy Setup Script"
echo "========================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+ from https://nodejs.org${NC}"
    exit 1
fi

# Check npm
echo -e "${YELLOW}Checking npm...${NC}"
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm found: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi

# Check PostgreSQL
echo -e "${YELLOW}Checking PostgreSQL...${NC}"
if command -v psql &> /dev/null; then
    PG_VERSION=$(psql --version)
    echo -e "${GREEN}✓ PostgreSQL found: $PG_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ PostgreSQL not found in PATH. Make sure PostgreSQL 14+ is installed${NC}"
fi

# Check Ollama
echo -e "${YELLOW}Checking Ollama...${NC}"
if command -v ollama &> /dev/null; then
    OLLAMA_VERSION=$(ollama --version)
    echo -e "${GREEN}✓ Ollama found: $OLLAMA_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Ollama not found. Please install from https://ollama.ai${NC}"
fi

echo ""
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Setup .env file
echo ""
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file already exists, skipping...${NC}"
else
    echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please edit .env file with your database credentials${NC}"
fi

# Check if Ollama model is available
echo ""
echo -e "${YELLOW}Checking Ollama model...${NC}"
if command -v ollama &> /dev/null; then
    if ollama list 2>&1 | grep -q "llama3.1:8b"; then
        echo -e "${GREEN}✓ llama3.1:8b model found${NC}"
    else
        echo -e "${YELLOW}⚠ llama3.1:8b model not found${NC}"
        echo -e "${CYAN}  Run: ollama pull llama3.1:8b${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Could not check Ollama models. Make sure Ollama is running${NC}"
fi

echo ""
echo "========================="
echo -e "${GREEN}Setup complete! 🎉${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo "1. Edit .env file with your database credentials"
echo "2. Pull Ollama model: ollama pull llama3.1:8b"
echo "3. Setup database: npm run db:generate && npm run db:push && npm run db:seed"
echo "4. Start dev server: npm run dev"
echo ""
echo -e "${CYAN}For more information, see README.md${NC}"
