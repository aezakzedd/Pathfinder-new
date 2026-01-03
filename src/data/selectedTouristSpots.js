// Selected tourist spots configuration
// Featured spots appear at default zoom, others appear at higher zoom levels

// ZOOM LEVEL REFERENCE (approximate distances):
// Zoom 13 = ~1km scale
// Zoom 15 = ~500m scale  
// Zoom 16 = ~200m scale
// Zoom 18 = ~50m scale

// Popular spots that get iOS-style image markers
export const popularSpots = [
  'Binurong Point',
  'Majestic Puraran Beach Resort',
  'Puraran Surf Resort',
  'Mamangal Beach Resort',
  'Palumbanes Island',
  'Paday Falls',
  'Nupa Green Lagoon',
  'Bote Lighthouse',
  'San Miguel River Park',
  'Codon Lighthouse',
  // Puraran area spots
  'Puraran Beach'
];

// Zoom-based visibility configuration for Puraran Beach area
// This mimics Google Maps' zoom-level marker clustering
export const zoomBasedSpots = [
  {
    municipality: 'BARAS',
    spotName: 'Puraran Beach',
    geojsonFile: 'baras.geojson',
    minZoom: 13  // Visible at 1km scale (default view)
  },
  {
    municipality: 'BARAS',
    spotName: 'Majestic Puraran Beach Resort',
    geojsonFile: 'baras.geojson',
    minZoom: 15  // Visible at 500m scale (second Puraran marker)
  },
  {
    municipality: 'BARAS',
    spotName: 'Puraran Surf Resort',
    geojsonFile: 'baras.geojson',
    minZoom: 15  // Visible at 500m scale
  },
  {
    municipality: 'BARAS',
    spotName: 'JoSurfInn',
    geojsonFile: 'baras.geojson',
    minZoom: 16  // Visible at 200m scale
  },
  {
    municipality: 'BARAS',
    spotName: "L'Astrolabe",
    geojsonFile: 'baras.geojson',
    minZoom: 16  // Visible at 200m scale
  },
  {
    municipality: 'BARAS',
    spotName: 'Alon Stay',
    geojsonFile: 'baras.geojson',
    minZoom: 18  // Visible at 50m scale (most detailed zoom)
  }
];

// Selected tourist spots - Featured spots visible at default zoom
export const selectedSpots = [
  {
    municipality: 'SAN_ANDRES',
    spotName: 'Mamangal Beach Resort',
    geojsonFile: 'san_andres.geojson',
    minZoom: 9  // Default zoom
  },
  {
    municipality: 'CARAMORAN',
    spotName: 'Palumbanes Island',
    geojsonFile: 'caramoran.geojson',
    minZoom: 9
  },
  {
    municipality: 'BAGAMANOC',
    spotName: 'Paday Falls',
    geojsonFile: 'bagamanoc.geojson',
    minZoom: 9
  },
  {
    municipality: 'GIGMOTO',
    spotName: 'Nupa Green Lagoon',
    geojsonFile: 'gigmoto.geojson',
    minZoom: 9
  },
  {
    municipality: 'BATO',
    spotName: 'Bote Lighthouse',
    geojsonFile: 'BATO.geojson',
    minZoom: 9
  },
  {
    municipality: 'SAN_MIGUEL',
    spotName: 'San Miguel River Park',
    geojsonFile: 'san_miguel.geojson',
    minZoom: 9
  },
  {
    municipality: 'BARAS',
    spotName: 'Binurong Point',
    geojsonFile: 'baras.geojson',
    minZoom: 9
  },
  {
    municipality: 'SAN_ANDRES',
    spotName: 'Codon Lighthouse',
    geojsonFile: 'san_andres.geojson',
    minZoom: 9
  },
  // Include zoom-based spots
  ...zoomBasedSpots
];

// Load all spots from specific municipalities (excluding zoom-controlled ones)
export const loadAllSpotsFrom = [
  {
    municipality: 'BARAS',
    geojsonFile: 'baras.geojson',
    // Exclude these spots as they're controlled by zoom levels
    excludeSpots: [
      'Puraran Beach',
      'Majestic Puraran Beach Resort',
      'Puraran Surf Resort',
      'JoSurfInn',
      "L'Astrolabe",
      'Alon Stay'
    ],
    minZoom: 12  // Other Baras spots visible at closer zoom
  }
];

// Helper function to convert municipality name to sentence case
export const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Category colors for the pill badges
export const categoryColors = {
  BEACH: { bg: '#dbeafe', text: '#1e40af' },
  WATERFALL: { bg: '#d1fae5', text: '#065f46' },
  VIEWPOINT: { bg: '#fce7f3', text: '#9f1239' },
  NATURE: { bg: '#dcfce7', text: '#14532d' },
  ACCOMMODATION: { bg: '#fef3c7', text: '#92400e' },
  RESORT: { bg: '#fed7aa', text: '#9a3412' },
  CAFE: { bg: '#e0e7ff', text: '#3730a3' },
  RESTAURANT: { bg: '#fecaca', text: '#991b1b' },
  MUSEUM: { bg: '#e9d5ff', text: '#6b21a8' },
  HERITAGE: { bg: '#f3e8ff', text: '#581c87' },
  RELIGIOUS_SITE: { bg: '#ddd6fe', text: '#4c1d95' },
  SURFING: { bg: '#bfdbfe', text: '#1e3a8a' },
  LANDMARK: { bg: '#fbbf24', text: '#78350f' },
  ECO_PARK: { bg: '#86efac', text: '#14532d' },
  HIKING: { bg: '#fdba74', text: '#7c2d12' },
  ISLAND: { bg: '#99f6e4', text: '#134e4a' },
  BAR: { bg: '#fca5a5', text: '#7f1d1d' },
  PARK: { bg: '#bef264', text: '#3f6212' },
  LAGOON: { bg: '#a5f3fc', text: '#155e75' },
  RIVER: { bg: '#bae6fd', text: '#0c4a6e' },
  default: { bg: '#f3f4f6', text: '#1f2937' }
};

// Category icons mapping (Font Awesome classes)
export const categoryIcons = {
  BEACH: 'fa-umbrella-beach',
  WATERFALL: 'fa-water',
  VIEWPOINT: 'fa-mountain',
  NATURE: 'fa-tree',
  ACCOMMODATION: 'fa-bed',
  RESORT: 'fa-hotel',
  CAFE: 'fa-mug-hot',
  RESTAURANT: 'fa-utensils',
  MUSEUM: 'fa-landmark',
  HERITAGE: 'fa-monument',
  RELIGIOUS_SITE: 'fa-place-of-worship',
  SURFING: 'fa-person-swimming',
  LANDMARK: 'fa-flag',
  ECO_PARK: 'fa-leaf',
  HIKING: 'fa-hiking',
  ISLAND: 'fa-island-tropical',
  BAR: 'fa-martini-glass',
  PARK: 'fa-tree-city',
  LAGOON: 'fa-droplet',
  RIVER: 'fa-water',
  default: 'fa-location-dot'
};
