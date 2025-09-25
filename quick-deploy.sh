#!/bin/bash

# Quick Deployment Script for Code Updates Only
# Use this for faster deployments when server setup is already complete

set -e

# Configuration
SERVER_IP="43.202.241.6"
DOMAIN="xn--2030-kc8ph53i.kr"
SSH_KEY="/Users/jihunkong/Downloads/jeonnam2030.pem"
DEPLOY_USER="ubuntu"
REMOTE_DIR="/var/www/${DOMAIN}"

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

# Check if this is a quick update or full deployment
QUICK_MODE=${1:-"false"}

print_status "🚀 Starting quick deployment for ${DOMAIN}..."

# Step 1: Build the application
print_status "Building React application..."
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

npm run build

if [ ! -d "dist" ]; then
    print_error "Build failed. dist directory not found."
    exit 1
fi

print_status "✅ Build completed successfully."

# Step 2: Create backup on server
print_status "Creating backup on server..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" "
    sudo mkdir -p /var/backups/website
    sudo tar -czf /var/backups/website/backup_\$(date +%Y%m%d_%H%M%S).tar.gz -C ${REMOTE_DIR} . 2>/dev/null || true
    echo 'Backup created'
"

# Step 3: Deploy new files
print_status "Deploying new files..."
rsync -avz --delete -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    dist/ "${DEPLOY_USER}@${SERVER_IP}:${REMOTE_DIR}/"

# Step 4: Set proper permissions
print_status "Setting file permissions..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" "
    sudo chown -R www-data:www-data ${REMOTE_DIR}
    sudo chmod -R 755 ${REMOTE_DIR}
    sudo find ${REMOTE_DIR} -type f -exec chmod 644 {} \;
"

# Step 5: Test Nginx configuration and reload
print_status "Reloading Nginx..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" "
    sudo nginx -t && sudo systemctl reload nginx
"

# Step 6: Health check
print_status "Performing health check..."
sleep 2

response_code=$(curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}" || echo "000")
if [ "$response_code" = "200" ]; then
    print_status "✅ Deployment successful! Website is responding normally."
    echo "🌐 Visit: https://${DOMAIN}"
else
    print_warning "⚠️  Website returned HTTP $response_code"
    print_warning "Rolling back to previous version..."

    # Rollback
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" "
        latest_backup=\$(ls -t /var/backups/website/backup_*.tar.gz | head -1)
        if [ -f \"\$latest_backup\" ]; then
            sudo rm -rf ${REMOTE_DIR}/*
            sudo tar -xzf \"\$latest_backup\" -C ${REMOTE_DIR}/
            sudo chown -R www-data:www-data ${REMOTE_DIR}
            sudo systemctl reload nginx
            echo 'Rollback completed'
        else
            echo 'No backup found for rollback'
        fi
    "

    # Test again
    sleep 2
    rollback_response=$(curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}" || echo "000")
    if [ "$rollback_response" = "200" ]; then
        print_status "✅ Rollback successful. Please check your build and try again."
    else
        print_error "❌ Rollback failed. Manual intervention required."
    fi
    exit 1
fi

# Step 7: Display deployment info
print_status "📊 Deployment Summary:"
echo "  • Domain: https://${DOMAIN}"
echo "  • Response Code: $response_code"
echo "  • Deployment Time: $(date)"
echo "  • Build Size: $(du -sh dist 2>/dev/null | cut -f1 || echo 'Unknown')"

# Step 8: Optional performance test
print_status "🏃 Performance Test:"
response_time=$(curl -s -o /dev/null -w "%{time_total}" "https://${DOMAIN}" || echo "N/A")
echo "  • Response Time: ${response_time}s"

# Step 9: Show recent logs (last 5 lines)
print_status "📋 Recent Server Logs:"
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "${DEPLOY_USER}@${SERVER_IP}" "
    echo '--- Access Log (Last 5 entries) ---'
    sudo tail -5 /var/log/nginx/*${DOMAIN//./_}*access.log 2>/dev/null | tail -5 || echo 'No access logs found'
    echo '--- Error Log (Last 5 entries) ---'
    sudo tail -5 /var/log/nginx/*${DOMAIN//./_}*error.log 2>/dev/null | tail -5 || echo 'No errors found'
"

print_status "🎉 Quick deployment completed successfully!"

echo ""
echo "💡 Useful commands:"
echo "  • Check website: curl -I https://${DOMAIN}"
echo "  • Monitor logs: ssh -i $SSH_KEY ${DEPLOY_USER}@${SERVER_IP} 'sudo tail -f /var/log/nginx/*access.log'"
echo "  • Server health: ssh -i $SSH_KEY ${DEPLOY_USER}@${SERVER_IP} '/usr/local/bin/server-health.sh'"
echo "  • Security audit: ./security-audit.sh"