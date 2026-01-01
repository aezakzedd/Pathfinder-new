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
      zoom: 10.5,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

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
