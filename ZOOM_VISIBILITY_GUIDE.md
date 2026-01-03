# Zoom-Based Marker Visibility System

This guide explains how the zoom-based marker visibility system works in Pathfinder, similar to Google Maps.

## Overview

Markers appear and disappear based on the current zoom level, preventing map clutter and improving performance. As users zoom in, more detailed locations become visible.

## Zoom Level Scale Reference

| Zoom Level | Approximate Scale | What's Visible |
|------------|------------------|----------------|
| 9-12 | Island/Provincial view | Featured tourist spots only |
| 13 | ~1 km | Main landmarks (e.g., Puraran Beach) |
| 15 | ~500 m | Popular resorts and accommodations |
| 16 | ~200 m | Specific businesses (cafes, surf shops) |
| 18+ | ~50 m | Very detailed locations (small guesthouses) |

## Puraran Beach Area Example

Following Google Maps behavior when zooming into Puraran Beach:

### Zoom Level 13 (~1km scale)
- ✅ **Puraran Beach** (main landmark marker)

### Zoom Level 15 (~500m scale)  
- ✅ **Puraran Beach**
- ✅ **Majestic Puraran Beach Resort**
- ✅ **Puraran Surf Resort**

### Zoom Level 16 (~200m scale)
- ✅ All of the above, plus:
- ✅ **JoSurfInn**
- ✅ **L'Astrolabe**

### Zoom Level 18+ (~50m scale)
- ✅ All of the above, plus:
- ✅ **Alon Stay**

## Configuration

### Adding Zoom-Controlled Spots

In `src/data/selectedTouristSpots.js`, add spots to the `zoomBasedSpots` array:

```javascript
export const zoomBasedSpots = [
  {
    municipality: 'BARAS',
    spotName: 'Your Location Name',
    geojsonFile: 'baras.geojson',
    minZoom: 16  // Visible at zoom 16 and above
  }
];
```

### Zoom Level Guidelines

- **minZoom: 9** - Major tourist attractions (default view)
- **minZoom: 13** - Main area landmarks
- **minZoom: 15** - Popular establishments
- **minZoom: 16** - Specific businesses
- **minZoom: 18** - Detailed/minor locations

## Implementation Details

### Data Loading

The system loads spots with their `minZoom` property:

```javascript
spots.push({
  name: feature.properties.name,
  coordinates: feature.geometry.coordinates,
  minZoom: selection.minZoom || 9,  // Default to zoom 9
  // ... other properties
});
```

### Visibility Check

In `MapView.jsx`, the `shouldShowMarker` function checks:

```javascript
const shouldShowMarker = useCallback((spot, zoom) => {
  return zoom >= (spot.minZoom || 9);
}, []);
```

### Marker Updates

Markers are added/removed dynamically as the map zooms:

```javascript
map.current.on('zoomend', updateVisibleMarkers);
```

## Excluding Spots from Auto-Load

When loading all spots from a municipality, exclude zoom-controlled ones:

```javascript
export const loadAllSpotsFrom = [
  {
    municipality: 'BARAS',
    geojsonFile: 'baras.geojson',
    excludeSpots: [
      'Puraran Beach',
      'JoSurfInn',
      // ... other zoom-controlled spots
    ],
    minZoom: 12
  }
];
```

## Benefits

1. **Reduced Clutter** - Map stays clean at lower zoom levels
2. **Better Performance** - Fewer markers rendered at once
3. **Progressive Detail** - Users discover more as they zoom in
4. **Google Maps UX** - Familiar behavior for users

## Testing

1. Open the map at default zoom (9)
2. Navigate to Puraran Beach area
3. Zoom to level 13 - only "Puraran Beach" should appear
4. Zoom to level 15 - resorts appear
5. Zoom to level 16 - small businesses appear
6. Zoom to level 18 - all locations visible

## Console Logging

The system logs marker visibility changes:

```
➕ Added: Puraran Beach (zoom: 13.2)
➕ Added: JoSurfInn (zoom: 16.1)
➖ Removed: Alon Stay (zoom: 15.8)
📍 Visible: 12/45 spots (zoom: 15.5)
```
