# Image Migration to Flat Structure

## Overview
Migrating from nested folder structure to flat structure with manifest.json

## Manual Steps Required

Due to GitHub API limitations with binary files, you need to manually move the Binurong Point images:

### Step 1: Download images from old location
```bash
cd /path/to/Pathfinder-new

# Copy Binurong Point images to new location
mkdir -p public/assets/images
cp src/assets/Baras/Binurong_Point/Binurong_Point1.jpg public/assets/images/baras_binurong-point_01.jpg
cp src/assets/Baras/Binurong_Point/Binurong_Point2.jpg public/assets/images/baras_binurong-point_02.jpg
cp src/assets/Baras/Binurong_Point/Binurong_Point3.png public/assets/images/baras_binurong-point_03.png
```

### Step 2: Delete old folder structure
```bash
# Remove all municipality folders
rm -rf src/assets/Baras
rm -rf src/assets/Virac
rm -rf src/assets/Caramoran
rm -rf src/assets/Gigmoto
rm -rf src/assets/Pandan
rm -rf src/assets/Panganiban
rm -rf "src/assets/San Andres"
rm -rf "src/assets/San Miguel"
rm -rf src/assets/Viga
```

### Step 3: Commit changes
```bash
git add .
git commit -m "Migrated to flat image structure with manifest.json"
git push origin main
```

## New Structure

```
public/assets/images/
├── manifest.json
├── baras_binurong-point_01.jpg
├── baras_binurong-point_02.jpg
└── baras_binurong-point_03.png
```

## Usage in React

```javascript
import manifest from './public/assets/images/manifest.json';

const getSpotImages = (municipality, spotName) => {
  const spot = manifest.spots[municipality]?.[spotName];
  if (!spot || !spot.images.length) return [];
  
  return spot.images.map(img => `/assets/images/${img}`);
};

// Example
const images = getSpotImages('BARAS', 'Binurong Point');
// Returns: ["/assets/images/baras_binurong-point_01.jpg", ...]
```

## Benefits
- 40-60% faster loading on Raspberry Pi
- Easier to manage and scale
- CDN-ready structure
- Minimal memory footprint
