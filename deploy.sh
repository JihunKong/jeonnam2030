#!/bin/bash

# Deployment Script for 전라남도교육청 2030 수업 축제
# Server: 43.202.241.6
# Domain: xn--2030-kc8ph53i.kr

set -e

# Configuration
SERVER_IP="43.202.241.6"
DOMAIN="xn--2030-kc8ph53i.kr"
SSH_KEY="/Users/jihunkong/Downloads/jeonnam2030.pem"
APP_NAME="jeonnam2030-festival"
DEPLOY_USER="ubuntu"
REMOTE_DIR="/var/www/${DOMAIN}"
SERVICE_NAME="jeonnam2030"

echo "🚀 Starting deployment process for ${DOMAIN}..."

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Build the application locally
print_status "Building React application..."
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies and build
npm install
npm run build

if [ ! -d "dist" ]; then
    print_error "Build failed. dist directory not found."
    exit 1
fi

print_status "Build completed successfully."

# Step 2: Create deployment archive
print_status "Creating deployment archive..."
tar -czf deploy.tar.gz dist/ nginx/

# Step 3: Transfer files to server
print_status "Transferring files to server..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no deploy.tar.gz "${DEPLOY_USER}@${SERVER_IP}:/tmp/"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no nginx/jeonnam2030.conf "${DEPLOY_USER}@${SERVER_IP}:/tmp/"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no server-setup.sh "${DEPLOY_USER}@${SERVER_IP}:/tmp/"

# Step 4: Execute server setup and deployment
print_status "Executing server setup..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" "
    chmod +x /tmp/server-setup.sh
    sudo /tmp/server-setup.sh '${DOMAIN}' '${APP_NAME}'
"

# Step 5: Deploy application
print_status "Deploying application..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" "
    # Extract and deploy files
    cd /tmp
    sudo tar -xzf deploy.tar.gz
    sudo rm -rf ${REMOTE_DIR}/*
    sudo cp -r dist/* ${REMOTE_DIR}/
    sudo chown -R www-data:www-data ${REMOTE_DIR}
    sudo chmod -R 755 ${REMOTE_DIR}

    # Update Nginx configuration
    sudo cp /tmp/jeonnam2030.conf /etc/nginx/sites-available/
    sudo ln -sf /etc/nginx/sites-available/jeonnam2030.conf /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default

    # Test and reload Nginx
    sudo nginx -t && sudo systemctl reload nginx

    # Cleanup
    rm -f /tmp/deploy.tar.gz /tmp/jeonnam2030.conf /tmp/server-setup.sh
"

# Step 6: Setup SSL certificate
print_status "Setting up SSL certificate..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" "
    sudo certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} --redirect
"

# Cleanup local files
rm -f deploy.tar.gz

print_status "✅ Deployment completed successfully!"
print_status "🌐 Your website is now available at: https://${DOMAIN}"
print_status "🔒 SSL certificate has been installed and configured."

echo ""
print_warning "Post-deployment checklist:"
echo "1. Test the website: https://${DOMAIN}"
echo "2. Verify SSL certificate: https://www.ssllabs.com/ssltest/"
echo "3. Monitor server logs: sudo journalctl -u nginx -f"
echo "4. Check disk space: df -h"
echo "5. Verify automatic SSL renewal: sudo certbot renew --dry-run"