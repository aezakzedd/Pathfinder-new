// Selected tourist spots - one per municipality with barangay info
// Using EXACT names from GeoJSON files - verified against all files
export const selectedSpots = [
  {
    municipality: 'VIRAC',
    spotName: 'Marilima Beach',
    barangay: 'Balite',
    geojsonFile: 'VIRAC.geojson'
  },
  {
    municipality: 'BATO',
    spotName: 'Bote Lighthouse',
    barangay: 'Bote',
    geojsonFile: 'BATO.geojson'
  },
  {
    municipality: 'BARAS',
    spotName: 'Binurong Point',
    barangay: 'Baras',
    geojsonFile: 'baras.geojson'
  },
  {
    municipality: 'SAN_MIGUEL',
    spotName: 'San Miguel Beach',
    barangay: 'Salvacion',
    geojsonFile: 'san_miguel.geojson'
  },
  {
    municipality: 'BAGAMANOC',
    spotName: 'Paday Falls',
    barangay: 'Bagamanoc',
    geojsonFile: 'bagamanoc.geojson'
  },
  {
    municipality: 'VIGA',
    spotName: 'Cogon Hills',
    barangay: 'Viga',
    geojsonFile: 'viga.geojson'
  },
  {
    municipality: 'PANGANIBAN',
    spotName: 'Tuwad-Tuwadan Lagoon',
    barangay: 'Panganiban',
    geojsonFile: 'panganiban.geojson'
  },
  {
    municipality: 'PANDAN',
    spotName: 'Immaculate Conception Parish Church',
    barangay: 'Pandan Centro',
    geojsonFile: 'pandan.geojson'
  },
  {
    municipality: 'CARAMORAN',
    spotName: 'Mamangal Beach',
    barangay: 'Caramoran',
    geojsonFile: 'caramoran.geojson'
  },
  {
    municipality: 'GIGMOTO',
    spotName: 'Gigmoto Lighthouse',
    barangay: 'Gigmoto',
    geojsonFile: 'gigmoto.geojson'
  },
  {
    municipality: 'SAN_ANDRES',
    spotName: 'San Andres Beach',
    barangay: 'San Andres',
    geojsonFile: 'san_andres.geojson'
  }
];

// Helper function to convert municipality name to sentence case
export const toSentenceCase = (str) => {
  if (!str) return '';
  // Replace underscores with spaces and convert to title case
  return str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Category colors for the pill badges
export const categoryColors = {
  BEACH: { bg: '#dbeafe', text: '#1e40af' }, // blue
  WATERFALL: { bg: '#d1fae5', text: '#065f46' }, // green
  VIEWPOINT: { bg: '#fce7f3', text: '#9f1239' }, // pink
  NATURE: { bg: '#dcfce7', text: '#14532d' }, // emerald
  ACCOMMODATION: { bg: '#fef3c7', text: '#92400e' }, // amber
  RESORT: { bg: '#fed7aa', text: '#9a3412' }, // orange
  CAFE: { bg: '#e0e7ff', text: '#3730a3' }, // indigo
  RESTAURANT: { bg: '#fecaca', text: '#991b1b' }, // red
  MUSEUM: { bg: '#e9d5ff', text: '#6b21a8' }, // purple
  HERITAGE: { bg: '#f3e8ff', text: '#581c87' }, // violet
  RELIGIOUS_SITE: { bg: '#ddd6fe', text: '#4c1d95' }, // purple
  SURFING: { bg: '#bfdbfe', text: '#1e3a8a' }, // sky
  LANDMARK: { bg: '#fbbf24', text: '#78350f' }, // yellow
  ECO_PARK: { bg: '#86efac', text: '#14532d' }, // lime
  HIKING: { bg: '#fdba74', text: '#7c2d12' }, // orange
  ISLAND: { bg: '#99f6e4', text: '#134e4a' }, // teal
  BAR: { bg: '#fca5a5', text: '#7f1d1d' }, // rose
  PARK: { bg: '#bef264', text: '#3f6212' }, // lime
  default: { bg: '#f3f4f6', text: '#1f2937' } // gray
};
