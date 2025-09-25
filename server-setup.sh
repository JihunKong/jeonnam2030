#!/bin/bash

# Server Setup Script for EC2 Ubuntu Instance
# This script will install and configure all necessary software

set -e

DOMAIN="$1"
APP_NAME="$2"

if [ -z "$DOMAIN" ] || [ -z "$APP_NAME" ]; then
    echo "Usage: $0 <domain> <app_name>"
    exit 1
fi

# Color codes for output
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

print_status "Starting server setup for ${DOMAIN}..."

# Update system packages
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install essential packages
print_status "Installing essential packages..."
apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    htop \
    tree \
    vim

# Install Node.js (LTS version)
print_status "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
apt install -y nodejs

# Install Nginx
print_status "Installing Nginx..."
apt install -y nginx

# Install Certbot for SSL
print_status "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Configure UFW firewall
print_status "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Configure fail2ban
print_status "Configuring fail2ban..."
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
maxretry = 3

[nginx-http-auth]
enabled = true
port = http,https
logpath = %(nginx_error_log)s
maxretry = 3

[nginx-limit-req]
enabled = true
port = http,https
logpath = %(nginx_error_log)s
maxretry = 10

[nginx-botsearch]
enabled = true
port = http,https
logpath = %(nginx_error_log)s
maxretry = 2
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Create web directory
print_status "Creating web directory..."
mkdir -p "/var/www/${DOMAIN}"
chown -R www-data:www-data "/var/www/${DOMAIN}"
chmod -R 755 "/var/www/${DOMAIN}"

# Create initial index.html
cat > "/var/www/${DOMAIN}/index.html" << EOF
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>전라남도교육청 2030 수업 축제</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .logo { font-size: 2em; color: #2563eb; margin-bottom: 20px; }
        .message { font-size: 1.2em; margin-bottom: 30px; }
        .status { color: #059669; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🎓 전라남도교육청 2030 수업 축제</div>
        <div class="message">웹사이트 배포가 완료되었습니다!</div>
        <div class="status">서버 상태: 정상</div>
        <p>곧 새로운 웹사이트가 업데이트됩니다.</p>
    </div>
</body>
</html>
EOF

# Configure system limits
print_status "Configuring system limits..."
cat >> /etc/security/limits.conf << EOF

# Custom limits for web server
www-data soft nofile 65536
www-data hard nofile 65536
root soft nofile 65536
root hard nofile 65536
EOF

# Configure sysctl for better performance
cat > /etc/sysctl.d/99-webserver.conf << EOF
# Network optimizations
net.core.somaxconn = 65536
net.core.netdev_max_backlog = 5000
net.core.rmem_default = 262144
net.core.rmem_max = 16777216
net.core.wmem_default = 262144
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 65536 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_tw_reuse = 1
net.ipv4.ip_local_port_range = 1024 65536

# File system optimizations
fs.file-max = 2097152
vm.swappiness = 10
EOF

sysctl -p /etc/sysctl.d/99-webserver.conf

# Configure Nginx main settings
print_status "Configuring Nginx..."
cat > /etc/nginx/nginx.conf << 'EOF'
user www-data;
worker_processes auto;
pid /run/nginx.pid;
worker_rlimit_nofile 65536;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Basic Settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    keepalive_requests 100;
    types_hash_max_size 2048;
    server_tokens off;
    client_max_body_size 16M;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging Settings
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/m;
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

    # Virtual Host Configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
EOF

# Test Nginx configuration
nginx -t

# Enable and start services
print_status "Starting services..."
systemctl enable nginx
systemctl start nginx
systemctl reload nginx

# Create monitoring script
print_status "Creating monitoring script..."
cat > /usr/local/bin/server-health.sh << 'EOF'
#!/bin/bash

# Server Health Check Script
echo "=== Server Health Check $(date) ==="
echo ""

echo "📊 System Load:"
uptime

echo ""
echo "💾 Memory Usage:"
free -h

echo ""
echo "💿 Disk Usage:"
df -h

echo ""
echo "🌐 Nginx Status:"
systemctl is-active nginx

echo ""
echo "🔥 Nginx Error Logs (last 5 lines):"
tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No errors found"

echo ""
echo "📈 Top Processes:"
ps aux --sort=-%cpu | head -6

echo ""
echo "🛡️ Fail2ban Status:"
fail2ban-client status

echo ""
echo "🔒 SSL Certificate Status:"
if command -v certbot >/dev/null 2>&1; then
    certbot certificates 2>/dev/null | grep -E "(Certificate Name|Expiry Date)" || echo "No certificates found"
fi

echo ""
echo "=== End Health Check ==="
EOF

chmod +x /usr/local/bin/server-health.sh

# Set up log rotation
print_status "Setting up log rotation..."
cat > /etc/logrotate.d/jeonnam2030 << EOF
/var/log/nginx/*jeonnam2030*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 www-data adm
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 \$(cat /var/run/nginx.pid)
        fi
    endscript
}
EOF

# Create cron job for SSL certificate renewal
print_status "Setting up SSL certificate auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

# Create backup script
print_status "Creating backup script..."
cat > /usr/local/bin/backup-website.sh << EOF
#!/bin/bash

# Website Backup Script
BACKUP_DIR="/var/backups/website"
SITE_DIR="/var/www/${DOMAIN}"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p "\$BACKUP_DIR"

echo "Creating backup: \$BACKUP_DIR/website_\$DATE.tar.gz"
tar -czf "\$BACKUP_DIR/website_\$DATE.tar.gz" -C "\$SITE_DIR" .

# Keep only last 7 days of backups
find "\$BACKUP_DIR" -name "website_*.tar.gz" -mtime +7 -delete

echo "Backup completed: \$(ls -lh \$BACKUP_DIR/website_\$DATE.tar.gz)"
EOF

chmod +x /usr/local/bin/backup-website.sh

# Set up daily backup cron job
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-website.sh >> /var/log/backup.log 2>&1") | crontab -

# Final security hardening
print_status "Final security hardening..."

# Disable root login
sed -i 's/^PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl reload ssh

# Set up automatic security updates
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

print_status "✅ Server setup completed successfully!"
print_warning "Important notes:"
echo "1. SSH root login has been disabled"
echo "2. Password authentication has been disabled"
echo "3. Firewall is enabled (SSH and HTTP/HTTPS allowed)"
echo "4. Fail2ban is configured for intrusion detection"
echo "5. Automatic security updates are enabled"
echo "6. Daily backups are scheduled at 2 AM"
echo "7. SSL certificates will auto-renew"
echo ""
echo "🔧 Useful commands:"
echo "- Check server health: /usr/local/bin/server-health.sh"
echo "- Create backup: /usr/local/bin/backup-website.sh"
echo "- View Nginx logs: sudo tail -f /var/log/nginx/*jeonnam2030*"
echo "- Check fail2ban status: sudo fail2ban-client status"