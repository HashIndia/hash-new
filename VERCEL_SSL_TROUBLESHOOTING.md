# Vercel + GoDaddy SSL Certificate Troubleshooting

## 🔍 Current Status
- ✅ Domain resolves to IP: `216.198.79.65`
- ❌ SSL certificate not valid/trusted
- 🏢 Setup: Vercel deployment + GoDaddy domain + Vercel nameservers

## 🚀 Step-by-Step Fix

### Step 1: Verify Vercel Domain Configuration

1. **Check Vercel Dashboard**:
   ```
   1. Go to your Vercel project dashboard
   2. Navigate to Settings → Domains
   3. Verify these domains are added:
      - hashindia.in
      - www.hashindia.in
   4. Check if SSL certificates show "Valid" status
   ```

2. **If domains are not added, add them**:
   ```
   - Click "Add Domain"
   - Enter: www.hashindia.in
   - Click "Add Domain" again
   - Enter: hashindia.in
   ```

### Step 2: Check DNS Configuration in GoDaddy

Since you're using Vercel nameservers, verify in GoDaddy:

1. **Nameservers should be**:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

2. **If using custom DNS records instead, ensure**:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Step 3: Force SSL Certificate Regeneration

In Vercel dashboard:
1. Go to Settings → Domains
2. Find your domain
3. Click the three dots (⋯) next to your domain
4. Click "Refresh Certificate" or "Regenerate Certificate"

### Step 4: Wait for Propagation

SSL certificates can take:
- **Vercel provisioning**: 10-30 minutes
- **DNS propagation**: up to 48 hours
- **Certificate trust**: additional 1-24 hours

## 🔧 Alternative Solutions

### Option 1: Vercel CLI Commands
```bash
# Login to Vercel CLI
npx vercel login

# Add domains
npx vercel domains add hashindia.in
npx vercel domains add www.hashindia.in

# Check domain status
npx vercel domains ls
```

### Option 2: Remove and Re-add Domain
```bash
# In Vercel dashboard:
1. Remove the domain completely
2. Wait 5 minutes
3. Re-add the domain
4. Wait for SSL provisioning
```

### Option 3: Check for Conflicting Records
Ensure no conflicting DNS records exist:
- No duplicate A records
- No conflicting CNAME records
- Clear DNS cache: `ipconfig /flushdns`

## 🔍 Verification Commands

### Check DNS Propagation Globally
```bash
# Use online tools:
# - https://dnschecker.org/
# - https://www.whatsmydns.net/
# Search for: www.hashindia.in
```

### Check SSL Certificate Details
```bash
# Check certificate info
openssl s_client -connect www.hashindia.in:443 -servername www.hashindia.in < /dev/null

# Or use online SSL checker:
# https://www.ssllabs.com/ssltest/analyze.html?d=www.hashindia.in
```

## 🚨 Common Issues & Fixes

### Issue 1: Certificate Shows "Pending"
**Solution**: Wait longer or regenerate certificate in Vercel

### Issue 2: Wrong IP Address
**Solution**: Check if nameservers are correctly set to Vercel's

### Issue 3: Mixed Content Errors
**Solution**: Ensure all resources load via HTTPS

### Issue 4: Cloudflare Interference
**Solution**: If using Cloudflare, ensure SSL mode is "Full" not "Flexible"

## 📱 Testing Different Networks

The fact that you see this error on college LAN suggests:
1. **Firewall restrictions**: College network might block certain SSL certificates
2. **DNS caching**: College DNS might have old records
3. **Proxy interference**: College might use web filtering proxy

### Test on Different Networks:
- Mobile data (hotspot)
- Home WiFi
- Public WiFi
- VPN connection

## 🎯 Immediate Actions

1. **Check Vercel Dashboard** for domain status
2. **Regenerate SSL certificate** in Vercel
3. **Test on mobile data** to isolate network issues
4. **Wait 24 hours** for full propagation

## 📞 If Still Not Working

Run these commands and share the output:

```bash
# Check current DNS
nslookup www.hashindia.in 8.8.8.8

# Check SSL with different DNS
curl -I --resolve www.hashindia.in:443:76.76.19.61 https://www.hashindia.in

# Check certificate chain
openssl s_client -connect www.hashindia.in:443 -servername www.hashindia.in -showcerts < /dev/null
```

Most likely, the SSL certificate just needs more time to propagate, or needs to be regenerated in Vercel!
