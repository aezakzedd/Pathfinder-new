# Zoom-Based Marker Visibility - Visual Reference

This document provides a visual representation of how markers appear as you zoom into the Puraran Beach area.

## Zoom Progression Diagram

```
ZOOM LEVEL 9-12 (Provincial/Island View)
┌────────────────────────────────────┐
│                                    │
│     Catanduanes Island            │
│                                    │
│  🏝️ Bote Lighthouse              │
│                                    │
│           🏝️ Mamangal Beach      │
│                                    │
│  🏝️ Palumbanes Island            │
│                                    │
│     (Puraran Beach NOT visible)    │
│                                    │
└────────────────────────────────────┘
Visible Markers: 8 featured spots only
```

```
ZOOM LEVEL 13 (~1km scale)
┌────────────────────────────────────┐
│                                    │
│     Puraran Beach Area            │
│                                    │
│                                    │
│            🏖️                      │
│        Puraran Beach               │
│                                    │
│                                    │
│   (Other resorts NOT visible)     │
│                                    │
└────────────────────────────────────┘
Visible Markers: 9 (8 featured + 1 Puraran)
```

```
ZOOM LEVEL 15 (~500m scale)
┌────────────────────────────────────┐
│                                    │
│     Puraran Beach Resorts         │
│                                    │
│     🏚️ Majestic Puraran          │
│                                    │
│            🏖️                      │
│        Puraran Beach               │
│                                    │
│     🏚️ Puraran Surf Resort       │
│                                    │
│  (Small businesses NOT visible)   │
│                                    │
└────────────────────────────────────┘
Visible Markers: 11 (previous + 2 resorts)
```

```
ZOOM LEVEL 16 (~200m scale)
┌────────────────────────────────────┐
│                                    │
│  Detailed Puraran Beach View     │
│                                    │
│   🏚️ Majestic    🏘️ JoSurfInn     │
│                                    │
│            🏖️                      │
│        Puraran Beach               │
│                                    │
│   🏚️ Surf Resort  ☀️ L'Astrolabe   │
│                                    │
│    (Alon Stay NOT visible yet)    │
│                                    │
└────────────────────────────────────┘
Visible Markers: 13 (previous + 2 businesses)
```

```
ZOOM LEVEL 18+ (~50m scale)
┌────────────────────────────────────┐
│                                    │
│   Maximum Detail - Street View    │
│                                    │
│   🏚️ Majestic    🏘️ JoSurfInn     │
│                                    │
│     🏠 Alon Stay   🏖️ Puraran      │
│                                    │
│   🏚️ Surf Resort  ☀️ L'Astrolabe   │
│                                    │
│  All locations now visible!       │
│                                    │
└────────────────────────────────────┘
Visible Markers: 14 (all Puraran area spots)
```

## Marker Type Legend

- 🏖️ **iOS-Style Image Marker** - Popular spots (has images, large with label)
- 🏚️ **iOS-Style Gradient Marker** - Popular spots (no image, gradient background)
- 🏘️ **Simple Circle + Text** - Standard locations (small circle with text)
- ☀️ **Simple Circle + Text** - Standard locations (small circle with text)
- 🏠 **Simple Circle + Text** - Standard locations (small circle with text)

## Zoom Threshold Table

| Location | minZoom | Scale | Marker Type | Priority |
|----------|---------|-------|-------------|----------|
| **Featured Spots** |||||
| Mamangal Beach | 9 | Island view | iOS-style | High |
| Bote Lighthouse | 9 | Island view | iOS-style | High |
| Palumbanes Island | 9 | Island view | iOS-style | High |
| **Puraran Area** |||||
| Puraran Beach | 13 | ~1km | iOS-style | High |
| Majestic Puraran Resort | 15 | ~500m | iOS-style | High |
| Puraran Surf Resort | 15 | ~500m | iOS-style | High |
| JoSurfInn | 16 | ~200m | Simple | Medium |
| L'Astrolabe | 16 | ~200m | Simple | Medium |
| Alon Stay | 18 | ~50m | Simple | Low |

## Real-World Distance Reference

```
┌──────────────────────────────────────────┐
│ Zoom 13 (1km)                               │
│ ├─────────────────────────────────┤  │
│ │ 🏖️ Puraran Beach               │  │
│ └─────────────────────────────────┘  │
│                                          │
│ Zoom 15 (500m)                           │
│ ├────────────────┤                     │
│ │ 🏖️  🏚️   🏚️   │                     │
│ └────────────────┘                     │
│                                          │
│ Zoom 16 (200m)                           │
│ ├──────┤                               │
│ │🏖️🏚️🏚️│                               │
│ │🏘️ ☀️ │                               │
│ └──────┘                               │
│                                          │
│ Zoom 18 (50m)                            │
│ ├─┤                                     │
│ │•│ All spots visible                   │
│ └─┘                                     │
└──────────────────────────────────────────┘
```

## User Experience Flow

### Scenario: Tourist Looking for Accommodations in Puraran

**Step 1: Start at Island View (Zoom 9)**
```
User sees: Major attractions across Catanduanes
Thinking: "Where is Puraran Beach?"
Action: Zooms in toward Baras municipality
```

**Step 2: Discover Main Landmark (Zoom 13)**
```
User sees: Puraran Beach marker appears!
Thinking: "Great! I found it. What's around here?"
Action: Continues zooming in
```

**Step 3: Find Resorts (Zoom 15)**
```
User sees: Majestic Puraran and Puraran Surf Resort appear
Thinking: "These look like good options!"
Action: Clicks markers to view details
```

**Step 4: Explore Details (Zoom 16)**
```
User sees: Smaller accommodations like JoSurfInn appear
Thinking: "More budget-friendly options available"
Action: Compares different accommodations
```

**Step 5: Street-Level Detail (Zoom 18)**
```
User sees: All accommodations including Alon Stay
Thinking: "I can see exactly where everything is!"
Action: Adds preferred spots to itinerary
```

## Comparison with Google Maps Behavior

### Google Maps Pattern
```
Low Zoom:  Few major landmarks only
    ↓
Medium:    Popular establishments appear
    ↓
High:      All businesses visible
```

### Pathfinder Implementation
```
Zoom 9-12: Featured tourist spots (8 markers)
    ↓
Zoom 13:   Main landmarks added (Puraran Beach)
    ↓
Zoom 15:   Popular resorts visible
    ↓  
Zoom 16:   Specific businesses shown
    ↓
Zoom 18+:  Everything visible (maximum detail)
```

## Performance Impact

### Before Implementation
```
All zoom levels: 45 markers rendered
Performance: Slower, cluttered
```

### After Implementation
```
Zoom 9:   8 markers  (↓ 82% reduction)
Zoom 13:  9 markers  (↓ 80% reduction)
Zoom 15: 11 markers  (↓ 76% reduction)
Zoom 16: 13 markers  (↓ 71% reduction)
Zoom 18: 14 markers  (↓ 69% reduction)

Result: Faster rendering, cleaner interface
```

## Quick Reference Commands

### Check Current Zoom in Console
```javascript
// Open browser console and type:
map.current.getZoom()
```

### View All Loaded Spots with Zoom Levels
```javascript
// In console:
touristSpots.forEach(s => 
  console.log(`${s.name}: zoom ${s.minZoom}`)
)
```

### Monitor Marker Additions/Removals
```
Look for these console messages:
➕ Added: [spot name] (minZoom: X, current: Y)
➖ Removed: [spot name] (zoom: X, minZoom: Y)
📍 Visible: X/Y (zoom: Z)
```

---

**Tip**: Press `Ctrl+Shift+P` while using the map to toggle performance monitoring and see real-time FPS and memory usage!
