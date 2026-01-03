#!/bin/bash

# HapiHub Kiosk Startup Script for Raspberry Pi 4B
# This script launches Chromium in kiosk mode with optimized flags
#
# Installation:
#   1. Copy this file to /home/pi/start-kiosk.sh
#   2. Make executable: chmod +x /home/pi/start-kiosk.sh
#   3. Add to autostart:
#      mkdir -p ~/.config/autostart
#      Create file: ~/.config/autostart/hapihub.desktop
#
# hapihub.desktop contents:
#   [Desktop Entry]
#   Type=Application
#   Name=HapiHub Kiosk
#   Exec=/home/pi/start-kiosk.sh
#   X-GNOME-Autostart-enabled=true

echo "Starting HapiHub Kiosk Mode..."

# Wait for network (if needed)
sleep 5

# Disable screen blanking
xset s off
xset -dpms
xset s noblank

# Hide cursor after 5 seconds of inactivity
unclutter -idle 5 &

# Launch Chromium in kiosk mode with RPI-optimized flags
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-restore-session-state \
  --disable-gpu \
  --disable-software-rasterizer \
  --disable-smooth-scrolling \
  --disable-accelerated-2d-canvas \
  --disable-accelerated-video-decode \
  --num-raster-threads=2 \
  --enable-features=VaapiVideoDecoder \
  --disable-features=UseChromeOSDirectVideoDecoder \
  --disk-cache-size=52428800 \
  --media-cache-size=52428800 \
  --aggressive-cache-discard \
  --disable-notifications \
  --disable-translate \
  --disable-suggestions-service \
  --disable-sync \
  --disable-background-networking \
  --force-device-scale-factor=1 \
  --window-position=0,0 \
  --window-size=1920,1080 \
  --start-fullscreen \
  http://localhost:5000

# If Chromium exits, restart after 5 seconds
sleep 5
exec $0
