# Installation Guide for Raspberry Pi

This guide will help you set up the complete application with Supabase on your Raspberry Pi.

## Prerequisites

- Raspberry Pi (recommended: Pi 4 or Pi 5)
- Raspberry Pi OS (64-bit recommended)
- At least 4GB RAM
- At least 10GB of free disk space
- Active internet connection
- Sudo privileges

## Hardware Recommendations

For optimal performance:
- Raspberry Pi 4 (4GB or 8GB RAM) or Raspberry Pi 5
- Active cooling or proper heat sink
- Class 10 SD card or USB 3.0 SSD
- Stable power supply (3A recommended)

## Step-by-Step Installation

1. **Prepare your Raspberry Pi**
   ```bash
   # Update your system
   sudo apt-get update
   sudo apt-get upgrade -y
   ```

2. **Make the Installation Script Executable**
   ```bash
   chmod +x src/scripts/install.sh
   ```

3. **Run the Installation Script**
   ```bash
   ./src/scripts/install.sh
   ```

   The script will:
   - Install Docker and Docker Compose
   - Install Node.js 20.x via nvm
   - Install Supabase CLI
   - Initialize and start Supabase locally
   - Install project dependencies
   - Configure local Supabase credentials

## Accessing the Application

After installation:
- Frontend: http://localhost:8080
- Supabase Studio: http://localhost:54323
  - Email: admin@admin.com
  - Password: admin

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
   ```

4. **Temperature Monitoring**
   ```bash
   # Monitor CPU temperature
   vcgencmd measure_temp
   ```

5. **Supabase Services**
   ```bash
   # Check Supabase status
   supabase status
   # Restart Supabase if needed
   supabase stop
   supabase start
   ```

## Performance Tips

1. **Use an SSD**
   - Consider using a USB 3.0 SSD instead of an SD card for better performance

2. **Enable Memory Swap**
   ```bash
   # Add or increase swap space
   sudo dphys-swapsize=2048
   sudo /etc/init.d/dphys-swapsize restart
   ```

3. **Monitor Resources**
   ```bash
   # Install htop for resource monitoring
   sudo apt-get install htop
   htop
   ```

## System Requirements

- CPU: ARM64 (aarch64)
- RAM: Minimum 4GB (8GB recommended)
- Storage: At least 10GB free space
- OS: Raspberry Pi OS (64-bit recommended)
- Docker: Version 20.10 or newer
- Node.js: Version 20.x

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