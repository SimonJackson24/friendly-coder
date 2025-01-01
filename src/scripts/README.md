# Installation Guide

This guide will help you set up the complete application with Supabase locally on your Raspberry Pi or other Linux-based systems.

## Prerequisites

- Linux/Unix-based system (including Raspberry Pi OS)
- Internet connection
- At least 2GB of free RAM
- At least 2GB of free disk space

## Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url> my-project
   cd my-project
   ```

2. Make the installation script executable:
   ```bash
   chmod +x src/scripts/install.sh
   ```

3. Run the installation script:
   ```bash
   ./src/scripts/install.sh
   ```

The script will:
- Install Docker if not present
- Install Node.js if not present
- Install Supabase CLI
- Initialize and start Supabase locally
- Install project dependencies
- Set up local configuration
- Start the development server

## Memory Management for Raspberry Pi

If you encounter memory issues, you can increase the swap space:

```bash
# Increase swap space
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Set CONF_SWAPSIZE=2048
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

## Accessing the Application

After installation:
- Frontend: http://localhost:8080
- Supabase Studio: http://localhost:54323

## Managing the Application

To stop the application:
```bash
# Stop the development server
Ctrl + C

# Stop Supabase containers
supabase stop
```

To restart the application:
```bash
# Start Supabase
supabase start

# Start the development server
npm run dev
```

## Troubleshooting

If you encounter any issues:
1. Make sure Docker is running and you have the necessary permissions
2. Check if ports 8080 and 54323 are available
3. Review the logs in the terminal for any error messages
4. Ensure you have enough free memory and disk space
5. Try logging out and back in if Docker was just installed

For Docker permission issues:
```bash
# Add your user to the docker group
sudo usermod -aG docker $USER
# Log out and log back in for changes to take effect
```

## Manual Setup

If you prefer to install components manually:

1. Install Docker: https://docs.docker.com/get-docker/
2. Install Node.js: https://nodejs.org/
3. Install Supabase CLI: https://supabase.com/docs/guides/cli
4. Run `supabase init` and `supabase start`
5. Run `npm install`
6. Run `npm run dev`