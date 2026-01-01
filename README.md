# Vite + React + Tailwind CSS + MapLibre

This project uses the **latest** versions of:
- Vite
- React
- Tailwind CSS (with @tailwindcss/postcss plugin)
- Lucide React (for icons)
- MapLibre GL (for interactive maps)
- React Map GL (MapLibre wrapper)

## Setup
```bash
npm install
npm run dev
```

## Features
- **Interactive Map**: MapLibre-powered map showing Catanduanes province
- **Dark Theme**: Modern dark UI with Carto Dark Matter basemap
- **Responsive Layout**: Split-panel design with map on the right
- **Map Controls**: Built-in navigation controls (zoom, rotate)

## Structure
- `/src/pages/Explore` - Main explore page
- `/src/components/FloatingCard` - Reusable card component with two panels:
  - Left panel: Content area (50% width, gray background)
  - Right panel: Map container (50% width, dark background)
- `/src/components/MapView` - MapLibre map component centered on Catanduanes

## Map Configuration
- **Location**: Catanduanes Province, Philippines
- **Coordinates**: 124.2475°E, 13.8°N
- **Zoom Level**: 9.5
- **Basemap**: Carto Dark Matter

## Notes
- `.gitignore` is included and ready for GitHub upload
- `node_modules` and build outputs are excluded
- Tailwind CSS is configured with PostCSS
