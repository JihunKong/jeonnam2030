#!/bin/bash

# Backend Deployment Script
# This script deploys the backend to the server

set -e

# Configuration
SERVER_IP="43.202.241.6"
SSH_KEY="/Users/jihunkong/Downloads/jeonnam2030.pem"
DEPLOY_USER="ubuntu"
BACKEND_DIR="/home/ubuntu/jeonnam2030-backend"

echo "🚀 Starting backend deployment..."

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Create deployment archive
print_status "Creating backend deployment archive..."
tar -czf backend-deploy.tar.gz \
    package.json \
    server.js \
    ecosystem.config.cjs \
    .env 2>/dev/null || tar -czf backend-deploy.tar.gz \
    package.json \
    server.js \
    ecosystem.config.cjs

# Transfer to server
print_status "Transferring files to server..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no backend-deploy.tar.gz "${DEPLOY_USER}@${SERVER_IP}:/tmp/"

# Deploy on server
print_status "Deploying backend on server..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" << 'ENDSSH'
    # Create backend directory if it doesn't exist
    mkdir -p /home/ubuntu/jeonnam2030-backend
    cd /home/ubuntu/jeonnam2030-backend

    # Extract files
    tar -xzf /tmp/backend-deploy.tar.gz
    rm /tmp/backend-deploy.tar.gz

    # Install/update dependencies
    npm install

    # Install PM2 globally if not already installed
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi

    # Create logs directory
    mkdir -p logs

    # Stop existing PM2 process if running
    pm2 stop jeonnam2030-backend 2>/dev/null || true
    pm2 delete jeonnam2030-backend 2>/dev/null || true

    # Start the backend with PM2
    pm2 start ecosystem.config.cjs

    # Save PM2 process list
    pm2 save

    # Setup PM2 to start on boot
    pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

    echo "Backend deployed successfully!"
    pm2 status
ENDSSH

# Cleanup
rm backend-deploy.tar.gz

print_status "✅ Backend deployment completed!"
print_warning "Note: Make sure .env file is configured on the server with correct database credentials"
print_warning "To view logs: ssh to server and run 'pm2 logs jeonnam2030-backend'"
