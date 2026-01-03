# 📦 Raspberry Pi 4B Deployment Guide

## Prerequisites

### Hardware
- Raspberry Pi 4B (4GB or 8GB RAM recommended)
- MicroSD card (32GB+, Class 10 or better)
- Power supply (5V 3A USB-C)
- Display (HDMI)
- Keyboard + mouse (for initial setup)

### Software
- Raspberry Pi OS (64-bit, Desktop version)
- Node.js 18+ LTS
- Git

---

## 🔧 Initial Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl chromium-browser unclutter
```

### 2. Install Node.js

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

### 3. Clone Repository

```bash
cd ~
git clone https://github.com/aezakzedd/Pathfinder-new.git
cd Pathfinder-new
```

---

## 📦 Build & Deploy

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Sharp for image optimization (optional but recommended)
npm install sharp
```

### 2. Optimize Images (First Time Only)

```bash
# Generate responsive WebP images
npm run optimize:images
```

This will create optimized versions in `public/assets/images/optimized/`

### 3. Build for Production

```bash
# Build optimized production bundle
npm run build:rpi
```

Output will be in `dist/` directory.

### 4. Test Locally

```bash
# Start preview server
npm run preview

# Open browser to http://localhost:5000
```

---

## 🚀 Kiosk Mode Setup

### 1. Copy Kiosk Script

```bash
cp scripts/start-kiosk-rpi.sh ~/start-kiosk.sh
chmod +x ~/start-kiosk.sh
```

### 2. Create Autostart Entry

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/hapihub.desktop
```

Paste this content:

```ini
[Desktop Entry]
Type=Application
Name=HapiHub Kiosk
Exec=/home/pi/start-kiosk.sh
X-GNOME-Autostart-enabled=true
```

Save and exit (Ctrl+X, Y, Enter)

### 3. Set up Preview Server as Service

Create systemd service:

```bash
sudo nano /etc/systemd/system/hapihub.service
```

Paste this content:

```ini
[Unit]
Description=HapiHub Web Server
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/Pathfinder-new
ExecStart=/home/pi/.nvm/versions/node/v18.20.0/bin/npm run preview
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

**Note**: Update Node.js path if different. Check with `which node`

Enable and start service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable hapihub.service
sudo systemctl start hapihub.service

# Check status
sudo systemctl status hapihub.service
```

---

## 🔧 Configuration

### Environment Variables

Edit `.env.production`:

```bash
nano .env.production
```

Update `VITE_MAPTILER_API_KEY` with your actual key.

### Performance Tuning

Edit `config.txt` for GPU memory:

```bash
sudo nano /boot/config.txt
```

Add/modify:

```ini
# Allocate more memory to GPU
gpu_mem=256

# Overclock (optional, may void warranty)
over_voltage=2
arm_freq=1800
```

Reboot:

```bash
sudo reboot
```

---

## 📊 Monitoring

### View Server Logs

```bash
# Real-time logs
sudo journalctl -u hapihub.service -f

# Last 100 lines
sudo journalctl -u hapihub.service -n 100
```

### System Resources

```bash
# CPU and memory usage
htop

# Temperature
vcgencmd measure_temp
```

### Performance Monitor in Browser

- Press **Ctrl+Shift+P** while app is running
- Shows real-time FPS and memory usage

---

## 🔄 Updates

### Pull Latest Changes

```bash
cd ~/Pathfinder-new
git pull origin main
npm install
npm run build:rpi
sudo systemctl restart hapihub.service
```

### Clear Service Worker Cache

Open browser console (F12) and run:

```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(reg => reg.unregister());
});
```

---

## 🚫 Troubleshooting

### App Not Loading

1. Check if service is running:
   ```bash
   sudo systemctl status hapihub.service
   ```

2. Check logs for errors:
   ```bash
   sudo journalctl -u hapihub.service -n 50
   ```

3. Test manually:
   ```bash
   cd ~/Pathfinder-new
   npm run preview
   ```

### Performance Issues

1. Check temperature:
   ```bash
   vcgencmd measure_temp
   ```
   - If over 80°C, improve cooling

2. Monitor memory:
   ```bash
   free -h
   ```
   - If low, reduce marker limits in MapView.jsx

3. Reduce map quality:
   - Edit `vite.config.js`
   - Increase `terserOptions.compress` settings

### Kiosk Not Starting

1. Check autostart file:
   ```bash
   cat ~/.config/autostart/hapihub.desktop
   ```

2. Test script manually:
   ```bash
   ~/start-kiosk.sh
   ```

3. Check X11 display:
   ```bash
   echo $DISPLAY  # Should show :0 or :1
   ```

---

## ✅ Verification Checklist

- [ ] System updated and restarted
- [ ] Node.js installed (v18+)
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] Images optimized (WebP generated)
- [ ] Production build created
- [ ] Service worker registered
- [ ] Systemd service enabled
- [ ] Kiosk script executable
- [ ] Autostart configured
- [ ] MapTiler API key configured
- [ ] Test in browser (http://localhost:5000)
- [ ] Test kiosk mode
- [ ] Performance monitor working (Ctrl+Shift+P)
- [ ] Temperature under control
- [ ] Memory usage acceptable

---

## 📞 Support

For issues:
1. Check logs: `sudo journalctl -u hapihub.service -f`
2. Review browser console (F12)
3. Check GitHub issues
4. Monitor system resources: `htop`

---

Last Updated: 2026-01-03
