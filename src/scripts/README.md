# Raspberry Pi Installation Guide

This guide will help you set up the complete application with Supabase locally on your Raspberry Pi.

## Prerequisites

- Raspberry Pi running Raspberry Pi OS
- Internet connection
- Sudo privileges
- At least 4GB of RAM recommended
- At least 10GB of free disk space

## Step-by-Step Installation

1. **Prepare your Raspberry Pi**
   ```bash
   # Update your system
   sudo apt-get update
   sudo apt-get upgrade -y
   ```

2. **Clone the Repository**
   ```bash
   # Clone the repository
   git clone <YOUR_REPOSITORY_URL>
   cd <REPOSITORY_NAME>
   ```

3. **Make the Installation Script Executable**
   ```bash
   chmod +x src/scripts/install.sh
   ```

4. **Run the Installation Script**
   ```bash
   ./src/scripts/install.sh
   ```

   The script will:
   - Install Docker if not present
   - Install Docker Compose if not present
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

1. **Docker Permission Issues**
   ```bash
   # If you get permission errors with Docker, run:
   sudo usermod -aG docker $USER
   # Then log out and log back in
   ```

2. **Port Conflicts**
   ```bash
   # Check if ports are in use
   sudo lsof -i :8080
   sudo lsof -i :54323
   ```

3. **Memory Issues**
   ```bash
   # Check available memory
   free -h
   # If needed, increase swap space:
   sudo dphys-swapfile swapoff
   sudo nano /etc/dphys-swapfile
   # Set CONF_SWAPSIZE=2048
   sudo dphys-swapfile setup
   sudo dphys-swapfile swapon
   ```

4. **Supabase Services**
   ```bash
   # Check Supabase status
   supabase status
   # Restart Supabase if needed
   supabase stop
   supabase start
   ```

## Starting the Application

After installation:

1. **Start Supabase Services** (if not already running)
   ```bash
   supabase start
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Stopping the Application

1. **Stop the Development Server**
   Press `Ctrl+C` in the terminal where the server is running

2. **Stop Supabase Services**
   ```bash
   supabase stop
   ```

## System Requirements

- CPU: Any Raspberry Pi 4 or newer
- RAM: Minimum 4GB (8GB recommended)
- Storage: At least 10GB free space
- OS: Raspberry Pi OS (64-bit recommended)
- Docker: Version 20.10 or newer
- Node.js: Version 18 or newer

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/)