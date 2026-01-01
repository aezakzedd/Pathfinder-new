import { useEffect, useRef, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

export default function MapView({ isFullscreen = false, onToggleFullscreen }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lockedState = useRef(null);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Define expanded bounds to allow panning while keeping focus on Catanduanes
    const bounds = [
      [123.85, 13.2],  // Southwest corner - expanded for panning room
      [124.6, 14.3]    // Northeast corner - expanded for panning room
    ];

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`,
      center: [124.2475, 13.8], // Catanduanes coordinates
      zoom: 9,
      attributionControl: false,
      maxBounds: bounds // Restrict camera movement to these expanded bounds
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

  // Handle fullscreen transitions with locked state
  useEffect(() => {
    if (!map.current) return;

    // Lock the current state
    lockedState.current = {
      center: map.current.getCenter(),
      zoom: map.current.getZoom(),
      bearing: map.current.getBearing(),
      pitch: map.current.getPitch()
    };

    setIsTransitioning(true);

    // Continuously enforce locked state during transition
    const enforceInterval = setInterval(() => {
      if (map.current && lockedState.current) {
        map.current.jumpTo({
          center: lockedState.current.center,
          zoom: lockedState.current.zoom,
          bearing: lockedState.current.bearing,
          pitch: lockedState.current.pitch
        });
      }
    }, 16); // ~60fps

    // After transition completes
    const transitionTimeout = setTimeout(() => {
      if (map.current) {
        map.current.resize();
        
        // Final enforcement
        if (lockedState.current) {
          map.current.jumpTo({
            center: lockedState.current.center,
            zoom: lockedState.current.zoom,
            bearing: lockedState.current.bearing,
            pitch: lockedState.current.pitch
          });
        }
      }
      
      clearInterval(enforceInterval);
      setIsTransitioning(false);
      lockedState.current = null;
    }, 550);

    return () => {
      clearInterval(enforceInterval);
      clearTimeout(transitionTimeout);
    };
  }, [isFullscreen]);

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }} 
    >
      {/* Fullscreen toggle button */}
      <button
        onClick={onToggleFullscreen}
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          width: '36px',
          height: '36px',
          borderRadius: '4px',
          backgroundColor: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
      >
        {isFullscreen ? (
          <Minimize color="black" size={18} strokeWidth={2} />
        ) : (
          <Maximize color="black" size={18} strokeWidth={2} />
        )}
      </button>

      {/* Map container */}
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden'
        }} 
      />
    </div>
  );
}
