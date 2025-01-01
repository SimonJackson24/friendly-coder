#!/bin/bash

# Print commands and exit on errors
set -ex

# Function to check if we're in the project directory
check_project_directory() {
    if [ ! -f "package.json" ]; then
        echo "Error: package.json not found. Please run this script from the project root directory."
        exit 1
    fi
}

# Function to verify required files exist
verify_required_files() {
    required_files=(
        "vite.config.ts"
        "tsconfig.json"
        "src/main.tsx"
        "src/App.tsx"
        "src/index.css"
    )

    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            echo "Error: Required file $file is missing"
            exit 1
        fi
    done
}

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

# Verify we're in the project directory
check_project_directory

# Verify all required files are present
verify_required_files

# Clean install of dependencies
echo "Installing dependencies..."
rm -rf node_modules package-lock.json
npm install

# Create required directories if they don't exist
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/utils
mkdir -p src/hooks
mkdir -p public

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL
    echo "Please update the .env file with your Supabase credentials"
    echo "You can find these values in your Supabase project settings"
fi

# Verify Supabase configuration
if [ ! -d "supabase" ]; then
    echo "Warning: Supabase directory not found. Some features may not work without proper Supabase setup."
fi

echo "Installation complete! You can now:"
echo "1. Update the .env file with your Supabase credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:8080 to view your application"