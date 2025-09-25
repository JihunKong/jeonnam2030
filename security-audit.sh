#!/bin/bash

# Security Audit Script for 전라남도교육청 2030 수업 축제
# Run this script to check security status of the deployed website

set -e

DOMAIN="xn--2030-kc8ph53i.kr"
SSH_KEY="/Users/jihunkong/Downloads/jeonnam2030.pem"
SERVER_IP="43.202.241.6"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_check() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to run remote commands
run_remote() {
    ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no ubuntu@$SERVER_IP "$1" 2>/dev/null || echo "Command failed"
}

print_header "Security Audit Report for ${DOMAIN}"
echo "Generated on: $(date)"
echo ""

# 1. SSL Certificate Check
print_header "SSL Certificate Status"
echo "Checking SSL certificate..."

if openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} </dev/null 2>/dev/null | openssl x509 -noout -dates 2>/dev/null; then
    print_check "SSL certificate is active"

    # Check expiry
    expiry_date=$(openssl s_client -connect ${DOMAIN}:443 -servername ${DOMAIN} </dev/null 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    if [ ! -z "$expiry_date" ]; then
        echo "  Certificate expires: $expiry_date"

        # Check if expiring within 30 days
        expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$expiry_date" +%s 2>/dev/null)
        current_epoch=$(date +%s)
        days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))

        if [ $days_until_expiry -lt 30 ]; then
            print_warning "Certificate expires in $days_until_expiry days"
        else
            print_check "Certificate is valid for $days_until_expiry more days"
        fi
    fi
else
    print_error "SSL certificate check failed"
fi

echo ""

# 2. HTTP Security Headers Check
print_header "HTTP Security Headers"
echo "Checking security headers..."

response=$(curl -sI "https://${DOMAIN}" 2>/dev/null)

check_header() {
    header_name=$1
    if echo "$response" | grep -qi "$header_name:"; then
        print_check "$header_name header is set"
        echo "  $(echo "$response" | grep -i "$header_name:" | tr -d '\r')"
    else
        print_warning "$header_name header is missing"
    fi
}

check_header "X-Frame-Options"
check_header "X-Content-Type-Options"
check_header "X-XSS-Protection"
check_header "Strict-Transport-Security"
check_header "Content-Security-Policy"
check_header "Referrer-Policy"

echo ""

# 3. Server Security Status
print_header "Server Security Status"

echo "Checking firewall status..."
ufw_status=$(run_remote "sudo ufw status")
if echo "$ufw_status" | grep -q "Status: active"; then
    print_check "UFW firewall is active"
else
    print_warning "UFW firewall status unclear"
fi

echo ""
echo "Checking fail2ban status..."
fail2ban_status=$(run_remote "sudo fail2ban-client status")
if echo "$fail2ban_status" | grep -q "Number of jail"; then
    print_check "Fail2ban is running"
    echo "  $fail2ban_status"
else
    print_warning "Fail2ban status unclear"
fi

echo ""
echo "Checking SSH configuration..."
ssh_config=$(run_remote "sudo grep -E '^(PermitRootLogin|PasswordAuthentication)' /etc/ssh/sshd_config")
if echo "$ssh_config" | grep -q "PermitRootLogin no"; then
    print_check "Root login is disabled"
else
    print_warning "Root login may be enabled"
fi

if echo "$ssh_config" | grep -q "PasswordAuthentication no"; then
    print_check "Password authentication is disabled"
else
    print_warning "Password authentication may be enabled"
fi

echo ""

# 4. Nginx Configuration Security
print_header "Nginx Configuration Security"

echo "Checking Nginx version disclosure..."
nginx_version=$(run_remote "curl -sI localhost 2>/dev/null | grep -i 'server:' || echo 'Header not found'")
if echo "$nginx_version" | grep -qi "nginx"; then
    if echo "$nginx_version" | grep -q "server: nginx$"; then
        print_check "Nginx version is hidden"
    else
        print_warning "Nginx version may be disclosed: $nginx_version"
    fi
else
    print_check "Server header appears to be hidden"
fi

echo ""
echo "Checking rate limiting configuration..."
rate_limit_config=$(run_remote "sudo grep -r 'limit_req' /etc/nginx/sites-available/ 2>/dev/null || echo 'Not found'")
if echo "$rate_limit_config" | grep -q "limit_req"; then
    print_check "Rate limiting is configured"
else
    print_warning "Rate limiting may not be configured"
fi

echo ""

# 5. File Permissions Check
print_header "File Permissions"

echo "Checking web directory permissions..."
web_perms=$(run_remote "ls -ld /var/www/${DOMAIN}")
if echo "$web_perms" | grep -q "drwxr-xr-x.*www-data"; then
    print_check "Web directory permissions are correct"
else
    print_warning "Web directory permissions may need review: $web_perms"
fi

echo ""
echo "Checking sensitive files..."
sensitive_files=$(run_remote "find /var/www/${DOMAIN} -name '*.log' -o -name '*.config' -o -name '.env' 2>/dev/null | head -5")
if [ -z "$sensitive_files" ]; then
    print_check "No sensitive files found in web directory"
else
    print_warning "Potential sensitive files found:"
    echo "$sensitive_files"
fi

echo ""

# 6. System Updates
print_header "System Security Updates"

echo "Checking for security updates..."
security_updates=$(run_remote "sudo apt list --upgradable 2>/dev/null | grep -i security | wc -l")
if [ "$security_updates" = "0" ]; then
    print_check "No security updates pending"
else
    print_warning "$security_updates security updates available"
fi

echo ""

# 7. Backup Status
print_header "Backup Status"

echo "Checking backup configuration..."
backup_cron=$(run_remote "crontab -l 2>/dev/null | grep backup || echo 'No backup cron found'")
if echo "$backup_cron" | grep -q "backup-website.sh"; then
    print_check "Backup cron job is configured"
else
    print_warning "Backup cron job may not be configured"
fi

backup_dir=$(run_remote "ls -la /var/backups/website/ 2>/dev/null | tail -5 || echo 'Backup directory not found'")
if echo "$backup_dir" | grep -q ".tar.gz"; then
    print_check "Recent backup files found"
    echo "Latest backups:"
    echo "$backup_dir"
else
    print_warning "No recent backup files found"
fi

echo ""

# 8. Performance and Resource Check
print_header "Performance Status"

echo "Checking server resources..."
resources=$(run_remote "free -h && df -h / | tail -1")
echo "$resources"

echo ""
echo "Checking Nginx process status..."
nginx_processes=$(run_remote "ps aux | grep '[n]ginx' | wc -l")
echo "Nginx processes running: $nginx_processes"

echo ""

# 9. Website Response Check
print_header "Website Availability"

echo "Testing website response..."
response_code=$(curl -s -o /dev/null -w "%{http_code}" "https://${DOMAIN}")
response_time=$(curl -s -o /dev/null -w "%{time_total}" "https://${DOMAIN}")

if [ "$response_code" = "200" ]; then
    print_check "Website is responding (HTTP $response_code)"
    echo "  Response time: ${response_time}s"
else
    print_error "Website response issue (HTTP $response_code)"
fi

# Test redirect from HTTP to HTTPS
http_redirect=$(curl -s -o /dev/null -w "%{http_code}" "http://${DOMAIN}")
if [ "$http_redirect" = "301" ] || [ "$http_redirect" = "302" ]; then
    print_check "HTTP to HTTPS redirect is working (HTTP $http_redirect)"
else
    print_warning "HTTP to HTTPS redirect may not be working (HTTP $http_redirect)"
fi

echo ""

# 10. Summary and Recommendations
print_header "Security Summary & Recommendations"

echo -e "${GREEN}Completed security audit for ${DOMAIN}${NC}"
echo ""
echo "Next steps:"
echo "1. Review any warnings or errors above"
echo "2. Update system packages regularly"
echo "3. Monitor SSL certificate expiry"
echo "4. Check backup integrity periodically"
echo "5. Review access logs for suspicious activity"
echo ""
echo "For detailed logs, check:"
echo "- Access logs: /var/log/nginx/${DOMAIN//./_}_access.log"
echo "- Error logs: /var/log/nginx/${DOMAIN//./_}_error.log"
echo "- System logs: /var/log/syslog"
echo ""
echo -e "${BLUE}Security audit completed on $(date)${NC}"