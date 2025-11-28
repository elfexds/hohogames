# HoHo Games - HTTPS Setup Guide

## Quick Setup

### 1. **Point your domain to your server**

Add a DNS A record:
```
hohogames.com  A  YOUR_SERVER_IP
www.hohogames.com  A  YOUR_SERVER_IP
```

### 2. **Run setup script**

```bash
chmod +x setup-https.sh
./setup-https.sh
```

### 3. **Get real SSL certificate (Let's Encrypt)**

Once domain points to your server:

```bash
sudo certbot --nginx -d hohogames.com -d www.hohogames.com
```

This will:
- ✅ Validate domain ownership
- ✅ Generate free SSL certificate
- ✅ Auto-renew certificate
- ✅ Update Nginx config automatically

## Architecture

```
┌─────────────────────────────────────────┐
│  User Browser (https://hohogames.com)   │
└──────────────────┬──────────────────────┘
                   │ HTTPS (443)
                   ▼
┌──────────────────────────────────────────┐
│  Nginx Reverse Proxy                     │
│  - SSL/TLS termination                  │
│  - Compression (gzip)                   │
│  - Caching headers                      │
│  - Security headers                     │
└──────────────────┬───────────────────────┘
                   │ HTTP (localhost:8000)
                   ▼
┌──────────────────────────────────────────┐
│  Python HTTP Server (port 8000)          │
│  - Keep-alive wrapper (infinite restart) │
│  - Serves static content                │
└──────────────────────────────────────────┘
```

## Files Modified

- **nginx.conf**: Reverse proxy configuration with SSL
- **setup-https.sh**: Automated setup script
- **keep-alive-public-8000.js**: Keep-alive wrapper (already running)

## Status

✅ **Server**: Running on port 8000 (24/7)  
⏳ **Nginx**: Ready to install and configure  
⏳ **SSL**: Self-signed cert template (awaiting domain)  

## Manual Commands

```bash
# Install Nginx
sudo apt-get update && sudo apt-get install -y nginx

# Test Nginx config
sudo nginx -t

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Get Let's Encrypt certificate
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d hohogames.com -d www.hohogames.com

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

**Domain not pointing to server?**
- Check DNS A records are set correctly
- Wait up to 24 hours for DNS propagation
- Use `nslookup hohogames.com` to verify

**Certbot validation fails?**
- Ensure port 80 and 443 are open
- Ensure Nginx is running: `sudo systemctl status nginx`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

**Want to use your own SSL cert?**
Edit `nginx.conf` and point to your cert paths:
```nginx
ssl_certificate /path/to/your/cert.pem;
ssl_certificate_key /path/to/your/key.pem;
```

## Support

Server logs: Check `/var/log/nginx/` for issues
Application: http://localhost:8000 (direct access)
