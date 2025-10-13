#!/bin/bash

# Full Deployment Script for 전라남도교육청 2030 수업 축제
# Deploys both frontend (React) and backend (Express + PostgreSQL)
# Server: 43.202.241.6
# Domain: xn--2030-kc8ph53i.kr

set -e

# Configuration
SERVER_IP="43.202.241.6"
DOMAIN="xn--2030-kc8ph53i.kr"
SSH_KEY="/Users/jihunkong/Downloads/jeonnam2030.pem"
DEPLOY_USER="ubuntu"
REMOTE_DIR="/var/www/html"
BACKEND_DIR="/home/ubuntu/jeonnam2030-backend"

echo "🚀 Starting full deployment (frontend + backend)..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Step 1: Build frontend
print_status "Building React frontend..."
npm install
npm run build

if [ ! -d "dist" ]; then
    print_error "Frontend build failed. dist directory not found."
    exit 1
fi

# Step 2: Create deployment archives
print_status "Creating deployment archives..."
tar -czf frontend-deploy.tar.gz dist/

cd backend
tar -czf backend-deploy.tar.gz package.json server.js ecosystem.config.cjs
cd ..

# Step 3: Transfer files to server
print_status "Transferring files to server..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no frontend-deploy.tar.gz "${DEPLOY_USER}@${SERVER_IP}:/tmp/"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no backend/backend-deploy.tar.gz "${DEPLOY_USER}@${SERVER_IP}:/tmp/"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no nginx/jeonnam2030.conf "${DEPLOY_USER}@${SERVER_IP}:/tmp/"

# Step 4: Deploy on server
print_status "Deploying on server..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" << 'ENDSSH'
    echo "=== Deploying Frontend ==="
    # Extract and deploy frontend
    cd /tmp
    sudo tar -xzf frontend-deploy.tar.gz
    sudo rm -rf /var/www/html/*
    sudo cp -r dist/* /var/www/html/
    sudo chown -R www-data:www-data /var/www/html
    sudo chmod -R 755 /var/www/html
    sudo rm -rf dist frontend-deploy.tar.gz

    echo "=== Deploying Backend ==="
    # Create backend directory if needed
    mkdir -p /home/ubuntu/jeonnam2030-backend
    cd /home/ubuntu/jeonnam2030-backend

    # Extract backend files
    tar -xzf /tmp/backend-deploy.tar.gz
    rm /tmp/backend-deploy.tar.gz

    # Create .env if it doesn't exist
    if [ ! -f .env ]; then
        cat > .env << 'EOF'
PORT=3001
DB_USER=jeonnam_app
DB_PASSWORD=jeonnam2030_secure_password_2025
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jeonnam2030
EOF
        echo "Created .env file - please update if needed"
    fi

    # Install dependencies
    npm install

    # Install PM2 if not installed
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi

    # Create logs directory
    mkdir -p logs

    # Restart backend with PM2
    pm2 stop jeonnam2030-backend 2>/dev/null || true
    pm2 delete jeonnam2030-backend 2>/dev/null || true
    pm2 start ecosystem.config.cjs
    pm2 save

    # Setup PM2 startup
    sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || true

    echo "=== Updating Nginx Configuration ==="
    # Update Nginx config
    sudo cp /tmp/jeonnam2030.conf /etc/nginx/sites-available/
    sudo ln -sf /etc/nginx/sites-available/jeonnam2030.conf /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    rm /tmp/jeonnam2030.conf

    # Test and reload Nginx
    sudo nginx -t && sudo systemctl reload nginx

    echo "=== Deployment Status ==="
    pm2 status
    sudo systemctl status nginx --no-pager | head -10
ENDSSH

# Cleanup
rm -f frontend-deploy.tar.gz backend/backend-deploy.tar.gz

print_status "✅ Deployment completed successfully!"
echo ""
print_status "Frontend deployed to: /var/www/${DOMAIN}"
print_status "Backend running on: localhost:3001 (proxied via /api)"
print_status "Website: https://${DOMAIN}"
echo ""
print_warning "Post-deployment checklist:"
echo "1. Verify backend: ssh to server and run 'pm2 logs jeonnam2030-backend'"
echo "2. Test API: curl https://${DOMAIN}/api/health"
echo "3. Test website: https://${DOMAIN}"
echo "4. Check research groups feature works correctly"
