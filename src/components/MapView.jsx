import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export default function MapView() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`,
      center: [124.2475, 13.8], // Catanduanes coordinates
      zoom: 9,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add mask overlay when map loads
    map.current.on('load', () => {
      // Create mask with rectangular cutout for Catanduanes
      // Outer ring covers entire world, inner ring is the cutout for Catanduanes
      const maskGeoJSON = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            // Outer ring (covers entire world)
            [
              [-180, -90],
              [180, -90],
              [180, 90],
              [-180, 90],
              [-180, -90]
            ],
            // Inner ring (cutout for Catanduanes including Palumbanes Island)
            // Counter-clockwise for hole - adjusted to 124.011 to show full province
            [
              [124.011, 13.35], // Southwest corner - at specified western boundary
              [124.011, 14.15], // Northwest corner
              [124.45, 14.15],  // Northeast corner
              [124.45, 13.35],  // Southeast corner
              [124.011, 13.35]  // Close the ring
            ]
          ]
        }
      };

      // Add source
      map.current.addSource('mask', {
        type: 'geojson',
        data: maskGeoJSON
      });

      // Add layer with solid black fill
      map.current.addLayer({
        id: 'mask-layer',
        type: 'fill',
        source: 'mask',
        paint: {
          'fill-color': '#000000',
          'fill-opacity': 1
        }
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '16px',
        overflow: 'hidden'
      }} 
    />
  );
}
