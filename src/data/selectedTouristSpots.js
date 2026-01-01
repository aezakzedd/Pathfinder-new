// Selected tourist spots - one per municipality with barangay info
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
    spotName: 'San Miguel River Park',
    barangay: 'Salvacion',
    geojsonFile: 'san_miguel.geojson'
  },
  {
    municipality: 'BAGAMANOC',
    spotName: 'Hiyop Highland',
    barangay: 'Bagamanoc',
    geojsonFile: 'bagamanoc.geojson'
  },
  {
    municipality: 'VIGA',
    spotName: 'Tuwad-Tuwadan Lagoon',
    barangay: 'Viga',
    geojsonFile: 'viga.geojson'
  },
  {
    municipality: 'PANGANIBAN',
    spotName: 'Talisoy Beach',
    barangay: 'Panganiban',
    geojsonFile: 'panganiban.geojson'
  },
  {
    municipality: 'PANDAN',
    spotName: 'Pandan Church',
    barangay: 'Pandan Centro',
    geojsonFile: 'pandan.geojson'
  },
  {
    municipality: 'CARAMORAN',
    spotName: 'Tignob Cove',
    barangay: 'Caramoran',
    geojsonFile: 'caramoran.geojson'
  },
  {
    municipality: 'GIGMOTO',
    spotName: 'Gigmoto Port',
    barangay: 'Gigmoto',
    geojsonFile: 'gigmoto.geojson'
  },
  {
    municipality: 'SAN_ANDRES',
    spotName: 'Mamangal Beach',
    barangay: 'San Andres',
    geojsonFile: 'san_andres.geojson'
  }
];

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
  default: { bg: '#f3f4f6', text: '#1f2937' } // gray
};
