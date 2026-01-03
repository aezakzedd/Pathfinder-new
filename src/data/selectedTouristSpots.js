// Selected tourist spots configuration
// Featured spots appear at default zoom, others appear at higher zoom levels

// ZOOM LEVEL REFERENCE (approximate distances):
// Zoom 13 = ~1km scale
// Zoom 15 = ~500m scale  
// Zoom 16 = ~200m scale
// Zoom 18 = ~50m scale

// Popular spots that get iOS-style image markers
export const popularSpots = [
  // Baras
  'Binurong Point',
  'Puraran Beach',
  'Majestic Puraran Beach Resort',
  'Puraran Surf Resort',
  'Balacay Point',
  // San Andres
  'Mamangal Beach Resort',
  'Codon Lighthouse',
  // Caramoran
  'Palumbanes Island',
  // Bagamanoc
  'Paday Falls',
  // Gigmoto
  'Nupa Green Lagoon',
  // Bato
  'Bote Lighthouse',
  'Maribina Falls',
  'Balongbong Falls',
  // San Miguel
  'San Miguel River Park',
  // Virac
  'Twin Rocks Beach',
  'Igang Beach',
  'Marilima Beach',
  // Pandan
  'Pandan Lighthouse',
  // Viga
  'Viga Beach',
  // Panganiban
  'Tignob Sandbar'
];

// Zoom-based visibility configuration for ALL municipalities
// This mimics Google Maps' zoom-level marker clustering
export const zoomBasedSpots = [
  // ===== BARAS MUNICIPALITY =====
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
    minZoom: 15  // Visible at 500m scale
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
    minZoom: 18  // Visible at 50m scale
  },
  {
    municipality: 'BARAS',
    spotName: 'Balacay Point',
    geojsonFile: 'baras.geojson',
    minZoom: 13  // Main viewpoint
  },

  // ===== SAN ANDRES MUNICIPALITY =====
  {
    municipality: 'SAN_ANDRES',
    spotName: 'Mamangal Beach Resort',
    geojsonFile: 'san_andres.geojson',
    minZoom: 13  // Main beach area
  },
  {
    municipality: 'SAN_ANDRES',
    spotName: 'Codon Lighthouse',
    geojsonFile: 'san_andres.geojson',
    minZoom: 13  // Landmark
  },

  // ===== VIRAC MUNICIPALITY =====
  {
    municipality: 'VIRAC',
    spotName: 'Twin Rocks Beach',
    geojsonFile: 'VIRAC.geojson',
    minZoom: 13  // Main beach
  },
  {
    municipality: 'VIRAC',
    spotName: 'Igang Beach',
    geojsonFile: 'VIRAC.geojson',
    minZoom: 13  // Main beach
  },
  {
    municipality: 'VIRAC',
    spotName: 'Marilima Beach',
    geojsonFile: 'VIRAC.geojson',
    minZoom: 13  // Main beach
  },
  {
    municipality: 'VIRAC',
    spotName: 'Igang Chapel Ruins',
    geojsonFile: 'VIRAC.geojson',
    minZoom: 15  // Heritage site
  },

  // ===== BATO MUNICIPALITY =====
  {
    municipality: 'BATO',
    spotName: 'Bote Lighthouse',
    geojsonFile: 'BATO.geojson',
    minZoom: 13  // Landmark
  },
  {
    municipality: 'BATO',
    spotName: 'Maribina Falls',
    geojsonFile: 'BATO.geojson',
    minZoom: 13  // Popular waterfall
  },
  {
    municipality: 'BATO',
    spotName: 'Balongbong Falls',
    geojsonFile: 'BATO.geojson',
    minZoom: 15  // Secondary waterfall
  },
  {
    municipality: 'BATO',
    spotName: 'Bato Church',
    geojsonFile: 'BATO.geojson',
    minZoom: 15  // Heritage site
  },

  // ===== SAN MIGUEL MUNICIPALITY =====
  {
    municipality: 'SAN_MIGUEL',
    spotName: 'San Miguel River Park',
    geojsonFile: 'san_miguel.geojson',
    minZoom: 13  // Main attraction
  },

  // ===== CARAMORAN MUNICIPALITY =====
  {
    municipality: 'CARAMORAN',
    spotName: 'Palumbanes Island',
    geojsonFile: 'caramoran.geojson',
    minZoom: 13  // Main island
  },

  // ===== GIGMOTO MUNICIPALITY =====
  {
    municipality: 'GIGMOTO',
    spotName: 'Nupa Green Lagoon',
    geojsonFile: 'gigmoto.geojson',
    minZoom: 13  // Main lagoon
  },

  // ===== BAGAMANOC MUNICIPALITY =====
  {
    municipality: 'BAGAMANOC',
    spotName: 'Paday Falls',
    geojsonFile: 'bagamanoc.geojson',
    minZoom: 13  // Main waterfall
  },

  // ===== PANDAN MUNICIPALITY =====
  {
    municipality: 'PANDAN',
    spotName: 'Pandan Lighthouse',
    geojsonFile: 'pandan.geojson',
    minZoom: 13  // Main lighthouse
  },
  {
    municipality: 'PANDAN',
    spotName: 'Mangrove Reserve River Cruise',
    geojsonFile: 'pandan.geojson',
    minZoom: 15  // Eco-tourism
  },

  // ===== VIGA MUNICIPALITY =====
  {
    municipality: 'VIGA',
    spotName: 'Viga Beach',
    geojsonFile: 'viga.geojson',
    minZoom: 13  // Main beach
  },

  // ===== PANGANIBAN MUNICIPALITY =====
  {
    municipality: 'PANGANIBAN',
    spotName: 'Tignob Sandbar',
    geojsonFile: 'panganiban.geojson',
    minZoom: 13  // Main attraction
  }
];

// Selected tourist spots - Featured spots visible at default zoom
export const selectedSpots = [
  // Main featured spots (zoom 9 - province-wide view)
  {
    municipality: 'BARAS',
    spotName: 'Binurong Point',
    geojsonFile: 'baras.geojson',
    minZoom: 9
  },
  {
    municipality: 'SAN_ANDRES',
    spotName: 'Mamangal Beach Resort',
    geojsonFile: 'san_andres.geojson',
    minZoom: 9
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
    municipality: 'SAN_ANDRES',
    spotName: 'Codon Lighthouse',
    geojsonFile: 'san_andres.geojson',
    minZoom: 9
  },
  {
    municipality: 'VIRAC',
    spotName: 'Twin Rocks Beach',
    geojsonFile: 'VIRAC.geojson',
    minZoom: 9
  },
  {
    municipality: 'BATO',
    spotName: 'Maribina Falls',
    geojsonFile: 'BATO.geojson',
    minZoom: 9
  },
  {
    municipality: 'PANDAN',
    spotName: 'Pandan Lighthouse',
    geojsonFile: 'pandan.geojson',
    minZoom: 9
  },
  // Include zoom-based spots
  ...zoomBasedSpots
];

// Load all spots from ALL municipalities (excluding zoom-controlled ones)
export const loadAllSpotsFrom = [
  {
    municipality: 'BARAS',
    geojsonFile: 'baras.geojson',
    excludeSpots: [
      'Puraran Beach',
      'Majestic Puraran Beach Resort',
      'Puraran Surf Resort',
      'JoSurfInn',
      "L'Astrolabe",
      'Alon Stay',
      'Balacay Point'
    ],
    minZoom: 12
  },
  {
    municipality: 'SAN_ANDRES',
    geojsonFile: 'san_andres.geojson',
    excludeSpots: [
      'Mamangal Beach Resort',
      'Codon Lighthouse'
    ],
    minZoom: 12
  },
  {
    municipality: 'VIRAC',
    geojsonFile: 'VIRAC.geojson',
    excludeSpots: [
      'Twin Rocks Beach',
      'Igang Beach',
      'Marilima Beach',
      'Igang Chapel Ruins'
    ],
    minZoom: 12
  },
  {
    municipality: 'BATO',
    geojsonFile: 'BATO.geojson',
    excludeSpots: [
      'Bote Lighthouse',
      'Maribina Falls',
      'Balongbong Falls',
      'Bato Church'
    ],
    minZoom: 12
  },
  {
    municipality: 'SAN_MIGUEL',
    geojsonFile: 'san_miguel.geojson',
    excludeSpots: [
      'San Miguel River Park'
    ],
    minZoom: 12
  },
  {
    municipality: 'CARAMORAN',
    geojsonFile: 'caramoran.geojson',
    excludeSpots: [
      'Palumbanes Island'
    ],
    minZoom: 12
  },
  {
    municipality: 'GIGMOTO',
    geojsonFile: 'gigmoto.geojson',
    excludeSpots: [
      'Nupa Green Lagoon'
    ],
    minZoom: 12
  },
  {
    municipality: 'BAGAMANOC',
    geojsonFile: 'bagamanoc.geojson',
    excludeSpots: [
      'Paday Falls'
    ],
    minZoom: 12
  },
  {
    municipality: 'PANDAN',
    geojsonFile: 'pandan.geojson',
    excludeSpots: [
      'Pandan Lighthouse',
      'Mangrove Reserve River Cruise'
    ],
    minZoom: 12
  },
  {
    municipality: 'VIGA',
    geojsonFile: 'viga.geojson',
    excludeSpots: [
      'Viga Beach'
    ],
    minZoom: 12
  },
  {
    municipality: 'PANGANIBAN',
    geojsonFile: 'panganiban.geojson',
    excludeSpots: [
      'Tignob Sandbar'
    ],
    minZoom: 12
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
  LIGHTHOUSE: { bg: '#fde68a', text: '#92400e' },
  SANDBAR: { bg: '#fed7aa', text: '#9a3412' },
  MANGROVE: { bg: '#86efac', text: '#166534' },
  RUINS: { bg: '#e9d5ff', text: '#6b21a8' },
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
  LIGHTHOUSE: 'fa-lighthouse',
  SANDBAR: 'fa-water',
  MANGROVE: 'fa-tree',
  RUINS: 'fa-monument',
  default: 'fa-location-dot'
};
