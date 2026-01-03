# 🚀 Raspberry Pi 4B Optimization Checklist

## ✅ Completed Optimizations

### 1. Municipality-Based Marker Loading
- [x] Maximum markers per zoom level (11 at default zoom)
- [x] Municipality filtering at zoom 15+
- [x] Priority sorting (popular spots first)
- [x] Viewport-independent loading at high zoom

### 2. Build Configuration
- [x] Vite terser minification
- [x] Code splitting (React, MapLibre, UI vendors)
- [x] CSS code splitting
- [x] Console removal in production
- [x] Sourcemap disabled

### 3. React Performance
- [x] Lazy loading components (Suspense)
- [x] Loading fallback screen
- [x] Component memoization (`memo`)

### 4. MapLibre Optimization
- [x] Disabled antialiasing
- [x] Disabled fade duration
- [x] Removed text/symbol layers
- [x] Max tile cache limit (50)
- [x] Disabled 3D optimizations
- [x] Disabled touch pitch

### 5. Event Handling
- [x] Debounced map updates (150ms)
- [x] Throttled marker updates

---

## 🔄 Remaining Optimizations

### 6. Image Optimization (HIGH PRIORITY)

**Status**: ❌ Not started

**Steps**:
```bash
# Install sharp for image processing
npm install --save-dev sharp

# Run optimization script
node scripts/optimize-images.js
```

**Expected Result**:
- Multiple image sizes (thumbnail, small, medium, large)
- WebP format (60-70% smaller than JPEG)
- Responsive image loading

**Impact**: 60-70% reduction in image bandwidth

---

### 7. Font Icon Optimization

**Status**: ⚠️ Font Awesome loaded (800KB+)

**Solution**: Already using `lucide-react` - just need to remove Font Awesome

**Steps**:
1. Remove Font Awesome CDN link from `MapView.jsx`
2. Update marker icons to use lucide-react components
3. Create icon component wrapper

**File to modify**: `src/components/MapView.jsx` (line ~1007)

**Impact**: -800KB initial load

---

### 8. Service Worker for Caching

**Status**: ❌ Not implemented

**Steps**:
```bash
# Create service worker
touch public/sw.js

# Register in main.jsx
```

**Benefits**:
- Offline support
- Faster repeat visits
- Cached map tiles

---

### 9. GeoJSON Optimization

**Status**: ⚠️ Multiple files loaded

**Options**:

A. **Merge GeoJSON files** (Simple)
```bash
node scripts/merge-geojson.js
```

B. **Vector tiles** (Advanced)
- Convert to .mbtiles format
- Better performance for large datasets

**Impact**: Reduced network requests

---

### 10. Production Environment

**Status**: ⚠️ Needs .env.production

**Create `.env.production`**:
```bash
VITE_ENABLE_DEVTOOLS=false
VITE_LOG_LEVEL=error
VITE_MAPTILER_API_KEY=your_key_here
```

---

### 11. Memory Management

**Status**: ⚠️ Partial cleanup

**Enhancements needed**:
- Force null on removed markers
- Clear marker cache aggressively
- Monitor memory leaks

---

### 12. Browser Kiosk Configuration

**Status**: ❌ Not configured

**Create `/home/pi/start-kiosk.sh`**:
```bash
#!/bin/bash
chromium-browser \
  --kiosk \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-gpu \
  --disable-software-rasterizer \
  --disable-smooth-scrolling \
  --disable-accelerated-2d-canvas \
  --num-raster-threads=2 \
  --enable-features=VaapiVideoDecoder \
  --disable-features=UseChromeOSDirectVideoDecoder \
  http://localhost:5000
```

**Make executable**:
```bash
chmod +x /home/pi/start-kiosk.sh
```

---

## 📊 Performance Metrics

### Current State (Estimated)
- **Initial Load**: 8-12s
- **Memory Usage**: ~850MB
- **FPS**: 20-30 fps
- **Marker Lag**: Visible on pan/zoom

### Target After All Optimizations
- **Initial Load**: 2-4s ⚡
- **Memory Usage**: ~500MB 💾
- **FPS**: 35-50 fps 🎮
- **Marker Lag**: Smooth updates 🚀

---

## 🎯 Priority Order

1. ⚡ **Image Optimization** (60-70% bandwidth savings)
2. 🗑️ **Remove Font Awesome** (800KB savings)
3. 💾 **Service Worker** (Offline + caching)
4. 🧹 **Memory cleanup enhancements**
5. 🔧 **Kiosk browser config**
6. 📦 **GeoJSON optimization**

---

## 🧪 Testing Commands

```bash
# Build for production
npm run build

# Test production build locally
npm run preview

# Analyze bundle size
npx vite-bundle-visualizer

# Check for memory leaks
# Open Chrome DevTools > Memory > Take Heap Snapshot
```

---

## 📝 Notes

- Press **Ctrl+Shift+P** during runtime to toggle performance monitor
- Monitor FPS and memory usage in real-time
- Test on actual RPI hardware for accurate results
- Consider reducing MAX_MARKERS_PER_ZOOM if still laggy

---

## 🔗 Related Files

- `vite.config.js` - Build configuration
- `src/App.jsx` - Lazy loading
- `src/components/MapView.jsx` - Main map component
- `scripts/debounce.js` - Performance utilities
- `package.json` - Dependencies and scripts

---

Last Updated: 2026-01-03
