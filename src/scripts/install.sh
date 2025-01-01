#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Error handling
set -e
trap 'last_command=$current_command; current_command=$BASH_COMMAND' DEBUG
trap 'echo -e "${RED}\"${last_command}\" command failed with exit code $?.${NC}"' EXIT

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${GREEN}Starting installation of the application...${NC}"

# Check system requirements
echo -e "${YELLOW}Checking system requirements...${NC}"

# Check if running on Raspberry Pi
if [ ! -f /etc/rpi-issue ]; then
    echo -e "${YELLOW}Note: Not running on Raspberry Pi OS. Some steps might need adjustment.${NC}"
fi

# Check and install Docker if needed
if ! command_exists docker; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN}Docker installed successfully${NC}"
    echo -e "${YELLOW}Please log out and log back in for Docker group changes to take effect${NC}"
    exit 1
fi

# Check and install Node.js if needed
if ! command_exists node; then
    echo -e "${YELLOW}Node.js not found. Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo -e "${GREEN}Node.js installed successfully${NC}"
fi

# Check and install Supabase CLI if needed
if ! command_exists supabase; then
    echo -e "${YELLOW}Supabase CLI not found. Installing Supabase CLI...${NC}"
    curl -fsSL https://cli.supabase.com/install.sh | sh
    echo -e "${GREEN}Supabase CLI installed successfully${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    echo "VITE_SUPABASE_URL=http://localhost:54321" > .env
    echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2MTY5MjMyMDksImV4cCI6MTkzMjQ5OTIwOX0.A123456789-fake-key-for-local-development" >> .env
    echo -e "${GREEN}.env file created with default local development values${NC}"
fi

# Initialize Supabase project if not already initialized
if [ ! -d "supabase" ]; then
    echo -e "${YELLOW}Initializing Supabase project...${NC}"
    supabase init
    echo -e "${GREEN}Supabase project initialized${NC}"
fi

# Start Supabase
echo -e "${YELLOW}Starting Supabase...${NC}"
supabase start

# Install project dependencies
echo -e "${YELLOW}Installing project dependencies...${NC}"
if [ -f "bun.lockb" ]; then
    echo -e "${YELLOW}Using Bun package manager...${NC}"
    # Install Bun if not present
    if ! command_exists bun; then
        echo -e "${YELLOW}Installing Bun...${NC}"
        curl -fsSL https://bun.sh/install | bash
        echo -e "${GREEN}Bun installed successfully${NC}"
    fi
    bun install
else
    npm install
fi

# Get Supabase local credentials
echo -e "${YELLOW}Updating .env with Supabase credentials...${NC}"
supabase status -o env > .env.local
cat .env.local >> .env

# Start the development server
echo -e "${GREEN}Starting the development server...${NC}"
npm run dev &

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

echo -e "${GREEN}Installation complete!${NC}"
echo -e "You can now access:"
echo -e "- Frontend: http://localhost:8080"
echo -e "- Supabase Studio: http://localhost:54323"
echo -e "\nTo stop the application:"
echo -e "1. Press Ctrl+C to stop the development server"
echo -e "2. Run 'supabase stop' to stop Supabase services"
echo -e "\nTo restart the application:"
echo -e "1. Run 'supabase start'"
echo -e "2. Run 'npm run dev'"

# Remove error handling trap
trap - EXIT