#!/bin/bash
# Setup script for hohogames.com HTTPS configuration

set -e

echo "🔧 Setting up hohogames.com HTTPS configuration..."

# Check if running as root (needed for Nginx and SSL certs)
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  Some commands require sudo. You may be prompted for your password."
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Install Certbot for Let's Encrypt (if you want real HTTPS)
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot for Let's Encrypt..."
    sudo apt-get install -y certbot python3-certbot-nginx
fi

# Create directories for self-signed cert (temporary, until you point domain)
echo "🔐 Creating SSL certificate directories..."
sudo mkdir -p /etc/ssl/private /etc/ssl/certs

# Generate self-signed certificate (valid for testing)
if [ ! -f /etc/ssl/certs/hohogames.crt ]; then
    echo "🔑 Generating self-signed certificate..."
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/ssl/private/hohogames.key \
        -out /etc/ssl/certs/hohogames.crt \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=hohogames.com"
fi

# Copy Nginx config
echo "📝 Installing Nginx configuration..."
sudo cp nginx.conf /etc/nginx/sites-available/hohogames.com
sudo ln -sf /etc/nginx/sites-available/hohogames.com /etc/nginx/sites-enabled/hohogames.com

# Remove default config if exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
echo "✅ Testing Nginx configuration..."
sudo nginx -t

# Restart Nginx
echo "🚀 Starting/Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx

echo ""
echo "✨ Configuration complete!"
echo ""
echo "📋 Next steps:"
echo "1. Point your domain 'hohogames.com' to this server's IP address"
echo "2. Once domain is pointing, run: sudo certbot --nginx -d hohogames.com -d www.hohogames.com"
echo "3. Certbot will automatically update nginx.conf with real SSL certificates"
echo ""
echo "🌐 Your site will be available at:"
echo "   https://hohogames.com"
echo "   https://www.hohogames.com"
echo ""
echo "✓ Server already running on port 8000"
echo "✓ Nginx reverse proxy listening on 443 (HTTPS)"
echo "✓ HTTP (80) redirects to HTTPS"
