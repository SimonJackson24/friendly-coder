# Installation Guide

This guide will help you set up the complete application with Supabase locally.

## Prerequisites

- Linux/Unix-based system (including macOS or WSL for Windows)
- Sudo privileges

## Installation

1. Make the installation script executable:
   ```bash
   chmod +x src/scripts/install.sh
   ```

2. Run the installation script:
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

## Accessing the Application

After installation:
- Frontend: http://localhost:8080
- Supabase Studio: http://localhost:54323

## Troubleshooting

If you encounter any issues:
1. Make sure Docker is running
2. Check if ports 8080 and 54323 are available
3. Review the logs in the terminal for any error messages

## Manual Setup

If you prefer to install components manually:

1. Install Docker: https://docs.docker.com/get-docker/
2. Install Node.js: https://nodejs.org/
3. Install Supabase CLI: https://supabase.com/docs/guides/cli
4. Run `supabase init` and `supabase start`
5. Run `npm install`
6. Run `npm run dev`