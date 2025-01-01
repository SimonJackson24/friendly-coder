#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting installation of the application and Supabase...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo -e "${GREEN}Installing Supabase CLI...${NC}"
    curl -fsSL https://cli.supabase.com/install.sh | sh
fi

# Initialize Supabase project locally
echo -e "${GREEN}Initializing Supabase project...${NC}"
supabase init
supabase start

# Install project dependencies
echo -e "${GREEN}Installing project dependencies...${NC}"
npm install

# Create local environment configuration
echo -e "${GREEN}Setting up local configuration...${NC}"
supabase status -o env > .env.local

# Start the development server
echo -e "${GREEN}Starting the development server...${NC}"
npm run dev

echo -e "${GREEN}Installation complete!${NC}"
echo -e "You can now access:"
echo -e "- Frontend: http://localhost:8080"
echo -e "- Supabase Studio: http://localhost:54323"