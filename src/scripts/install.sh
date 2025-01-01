#!/bin/bash

# Print commands and exit on errors
set -ex

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://github.com/nvm-sh/nvm#installing-and-updating"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
if [ "$(echo $NODE_VERSION | cut -d'.' -f1)" -lt 18 ]; then
    echo "Node.js version must be 18 or higher. Current version: $NODE_VERSION"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm 9+ first."
    exit 1
fi

# Check npm version
NPM_VERSION=$(npm -v | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 9 ]; then
    echo "npm version must be 9 or higher. Current version: $(npm -v)"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL
    echo "Please update the .env file with your Supabase credentials"
fi

echo "Installation complete! You can now run 'npm run dev' to start the development server."