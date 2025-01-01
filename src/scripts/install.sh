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

# Update system packages
echo -e "\n${GREEN}Updating system packages...${NC}"
sudo apt-get update && sudo apt-get upgrade -y
check_status "Failed to update system packages"

# Install required system dependencies
echo -e "\n${GREEN}Installing system dependencies...${NC}"
sudo apt-get install -y curl git build-essential wget
check_status "Failed to install system dependencies"

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
    sudo apt-get install -y docker-compose
    check_status "Failed to install Docker Compose"
else
    echo -e "${GREEN}✓ Docker Compose is already installed${NC}"
fi

# Install Node.js 20.x using nvm for better ARM compatibility
if ! command -v nvm &> /dev/null; then
    echo -e "${RED}Installing nvm...${NC}"
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    check_status "Failed to install nvm"
else
    echo -e "${GREEN}✓ nvm is already installed${NC}"
fi

# Install Node.js 20.x
echo -e "\n${GREEN}Installing Node.js 20.x...${NC}"
nvm install 20
nvm use 20
check_status "Failed to install Node.js"

# Install Supabase CLI using .deb package
echo -e "\n${GREEN}Installing Supabase CLI...${NC}"
if ! command -v supabase &> /dev/null; then
    # Detect architecture
    ARCH=$(dpkg --print-architecture)
    
    # Latest stable version of Supabase CLI
    SUPABASE_VERSION="1.127.0"
    
    if [ "$ARCH" = "arm64" ]; then
        SUPABASE_DEB="supabase_${SUPABASE_VERSION}_linux_arm64.deb"
    elif [ "$ARCH" = "amd64" ]; then
        SUPABASE_DEB="supabase_${SUPABASE_VERSION}_linux_amd64.deb"
    else
        echo -e "${RED}Unsupported architecture: $ARCH${NC}"
        exit 1
    fi

    # Download and install Supabase CLI
    wget "https://github.com/supabase/cli/releases/download/v${SUPABASE_VERSION}/${SUPABASE_DEB}"
    sudo dpkg -i "${SUPABASE_DEB}"
    rm "${SUPABASE_DEB}"
    check_status "Failed to install Supabase CLI"
else
    echo -e "${GREEN}✓ Supabase CLI is already installed${NC}"
fi

# Verify Supabase CLI installation
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Failed to install Supabase CLI. Please try installing it manually.${NC}"
    exit 1
fi

# Create project directory
echo -e "\n${GREEN}Setting up project directory...${NC}"
PROJECT_DIR="friendly-coder"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Clone the repository (if URL is provided)
if [ -n "$REPO_URL" ]; then
    git clone $REPO_URL .
    check_status "Failed to clone repository"
fi

# Install project dependencies
echo -e "\n${GREEN}Installing project dependencies...${NC}"
npm install
check_status "Failed to install project dependencies"

# Initialize Supabase project
echo -e "\n${GREEN}Initializing Supabase project...${NC}"
supabase init
check_status "Failed to initialize Supabase project"

# Start Supabase services
echo -e "\n${GREEN}Starting Supabase services...${NC}"
supabase start
check_status "Failed to start Supabase services"

# Get Supabase credentials and save them
echo -e "\n${GREEN}Configuring Supabase credentials...${NC}"
SUPABASE_URL=$(supabase status --output json | jq -r '.api.url')
SUPABASE_ANON_KEY=$(supabase status --output json | jq -r '.api.anon_key')

# Update the client configuration
echo -e "\n${GREEN}Updating Supabase client configuration...${NC}"
sed -i "s|const SUPABASE_URL.*|const SUPABASE_URL = \"$SUPABASE_URL\";|" src/integrations/supabase/client.ts
sed -i "s|const SUPABASE_ANON_KEY.*|const SUPABASE_ANON_KEY = \"$SUPABASE_ANON_KEY\";|" src/integrations/supabase/client.ts

# Get hostname for URLs
HOSTNAME=$(hostname)

# Check if ports are available
echo -e "\n${GREEN}Checking port availability...${NC}"
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 8080 is already in use. Please free this port first.${NC}"
    exit 1
fi

if lsof -Pi :54323 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}Port 54323 is already in use. Please free this port first.${NC}"
    exit 1
fi

echo -e "\n${GREEN}Installation complete!${NC}"
echo -e "\nYou can now access:"
echo -e "- Frontend: ${YELLOW}http://${HOSTNAME}:8080${NC}"
echo -e "- Supabase Studio: ${YELLOW}http://${HOSTNAME}:54323${NC}"
echo -e "\n${YELLOW}Important Notes:${NC}"
echo -e "1. If this is your first time running Docker, you may need to log out and back in"
echo -e "2. Make sure ports 8080 and 54323 are not in use"
echo -e "3. To start the development server, run: ${YELLOW}npm run dev${NC}"
echo -e "4. The Supabase Studio credentials are:"
echo -e "   Email: ${YELLOW}admin@admin.com${NC}"
echo -e "   Password: ${YELLOW}admin${NC}"

# Check system resources
echo -e "\n${GREEN}System Resource Check:${NC}"
echo -e "Available Memory:"
free -h
echo -e "\nAvailable Disk Space:"
df -h .

echo -e "\n${YELLOW}Note: For optimal performance on Raspberry Pi, ensure you have at least:${NC}"
echo -e "- 4GB RAM"
echo -e "- 10GB free disk space"
echo -e "- Active cooling or proper heat management"