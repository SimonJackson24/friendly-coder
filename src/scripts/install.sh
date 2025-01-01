#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check command status and exit if failed
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
    else
        echo -e "${RED}✗ Failed${NC}"
        echo -e "${RED}Error: $1${NC}"
        exit 1
    fi
}

echo -e "${GREEN}Starting installation for Raspberry Pi...${NC}"

# Check if running on Raspberry Pi OS
if ! grep -q "Raspberry Pi" /proc/cpuinfo; then
    echo -e "${YELLOW}Warning: This script is optimized for Raspberry Pi OS. Proceed with caution.${NC}"
fi

# Check system requirements
echo -e "\n${GREEN}Checking system requirements...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    check_status "Failed to install Docker"
    echo -e "${YELLOW}Please log out and back in for Docker group changes to take effect.${NC}"
else
    echo -e "${GREEN}✓ Docker is already installed${NC}"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Installing Docker Compose...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker-compose
    check_status "Failed to install Docker Compose"
else
    echo -e "${GREEN}✓ Docker Compose is already installed${NC}"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    check_status "Failed to install Node.js"
else
    echo -e "${GREEN}✓ Node.js is already installed${NC}"
fi

# Install Supabase CLI
echo -e "\n${GREEN}Installing Supabase CLI...${NC}"
if ! command -v supabase &> /dev/null; then
    # First, try the official installation method
    if ! curl -fsSL https://cli.supabase.com/install.sh | sh; then
        echo -e "${YELLOW}Official installation failed, trying alternative method...${NC}"
        
        # Alternative installation using npm
        echo -e "${GREEN}Installing Supabase CLI via npm...${NC}"
        sudo npm install -g supabase
        check_status "Failed to install Supabase CLI via npm"
    fi
else
    echo -e "${GREEN}✓ Supabase CLI is already installed${NC}"
fi

# Verify Supabase CLI installation
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Failed to install Supabase CLI. Please try installing it manually:${NC}"
    echo -e "Run: sudo npm install -g supabase"
    exit 1
fi

# Create project directory if it doesn't exist
PROJECT_DIR="lovable-project"
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "\n${GREEN}Creating project directory...${NC}"
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR || exit 1
else
    cd $PROJECT_DIR || exit 1
fi

# Initialize Supabase project
echo -e "\n${GREEN}Initializing Supabase project...${NC}"
supabase init
check_status "Failed to initialize Supabase project"

# Start Supabase services
echo -e "\n${GREEN}Starting Supabase services...${NC}"
supabase start
check_status "Failed to start Supabase services"

# Install project dependencies
echo -e "\n${GREEN}Installing project dependencies...${NC}"
npm install
check_status "Failed to install project dependencies"

# Create local environment configuration
echo -e "\n${GREEN}Setting up local configuration...${NC}"
supabase status -o env > .env.local
check_status "Failed to create environment configuration"

echo -e "\n${GREEN}Installation complete!${NC}"
echo -e "\nYou can now access:"
echo -e "- Frontend: ${YELLOW}http://localhost:8080${NC}"
echo -e "- Supabase Studio: ${YELLOW}http://localhost:54323${NC}"
echo -e "\n${YELLOW}Important Notes:${NC}"
echo -e "1. If this is your first time running Docker, you may need to log out and back in"
echo -e "2. Make sure ports 8080 and 54323 are not in use"
echo -e "3. To start the development server, run: ${YELLOW}npm run dev${NC}"