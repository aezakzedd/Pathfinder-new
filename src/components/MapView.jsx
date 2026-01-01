import { useEffect, useRef, useCallback, memo, useState } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const DEFAULT_ZOOM = 9;

const MapView = memo(function MapView({ isFullscreen = false, onToggleFullscreen }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const savedState = useRef({ center: [124.2475, 13.8], zoom: DEFAULT_ZOOM });
  const resizeTimeout = useRef(null);
  const animationTimeout = useRef(null);
  const previousZoom = useRef(DEFAULT_ZOOM);
  const [activeView, setActiveView] = useState('map'); // 'map' or 'itinerary'

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
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
      maxBounds: bounds, // Restrict camera movement to these expanded bounds
      
      // Performance optimizations for Raspberry Pi
      antialias: false, // Significant GPU savings
      preserveDrawingBuffer: false, // Enable buffer swapping for better performance
      fadeDuration: 0, // Remove tile fade animations
      maxParallelImageRequests: 8, // Reduce concurrent requests (default is 16)
      refreshExpiredTiles: false, // Don't auto-refresh expired tiles
      trackResize: true, // Still track resize but we'll debounce it
      maxZoom: 18, // Reasonable max zoom limit
      maxPitch: 60, // Limit pitch for better performance
    });

    // Add mask overlay when map loads
    map.current.on('load', () => {
      // Create mask with rectangular cutout for Catanduanes
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
            [
              [124.011, 13.35], // Southwest corner
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

  // Debounced resize handler for better performance
  const handleResize = useCallback(() => {
    if (!map.current) return;
    
    // Save current state before resize
    const currentZoom = map.current.getZoom();
    const currentCenter = map.current.getCenter();
    
    savedState.current = {
      center: currentCenter,
      zoom: currentZoom
    };

    // Clear existing timeout
    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    // Debounce resize to avoid excessive calls
    resizeTimeout.current = setTimeout(() => {
      if (map.current) {
        map.current.resize();
        
        // Determine zoom to use after resize
        let targetZoom = savedState.current.zoom;
        
        // If the previous zoom was at default (9), keep it at 9
        // This prevents zoom drift when going fullscreen at default zoom
        if (Math.abs(previousZoom.current - DEFAULT_ZOOM) < 0.01) {
          targetZoom = DEFAULT_ZOOM;
        }
        
        // Restore the exact center and zoom after resize
        map.current.jumpTo({
          center: savedState.current.center,
          zoom: targetZoom
        });
      }
    }, 100);
  }, []);

  // Resize map AFTER animation completes when fullscreen state changes
  useEffect(() => {
    // Save the current zoom before fullscreen toggle
    if (map.current) {
      previousZoom.current = map.current.getZoom();
    }

    // Clear any existing animation timeout
    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }

    // Wait for CSS animation to complete (700ms) plus a small buffer
    animationTimeout.current = setTimeout(() => {
      handleResize();
    }, 750);

    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [isFullscreen, handleResize]);

  // Memoized button handler to prevent recreation
  const handleToggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    }
  }, [onToggleFullscreen]);

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }} 
    >
      {/* Fullscreen toggle button - top left */}
      <button
        onClick={handleToggleFullscreen}
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
          transition: 'all 0.2s ease',
          willChange: 'background-color'
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

      {/* Map/Itinerary sliding toggle - top right */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          gap: '4px'
        }}
      >
        {/* Map button */}
        <button
          onClick={() => setActiveView('map')}
          style={{
            position: 'relative',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '16px',
            backgroundColor: activeView === 'map' ? '#1f2937' : 'transparent',
            color: activeView === 'map' ? 'white' : '#6b7280',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          Map
        </button>

        {/* Itinerary button */}
        <button
          onClick={() => setActiveView('itinerary')}
          style={{
            position: 'relative',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '16px',
            backgroundColor: activeView === 'itinerary' ? '#1f2937' : 'transparent',
            color: activeView === 'itinerary' ? 'white' : '#6b7280',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          Itinerary
        </button>
      </div>

      {/* Map container */}
      <div 
        ref={mapContainer} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          display: activeView === 'map' ? 'block' : 'none'
        }} 
      />

      {/* Itinerary view placeholder */}
      {activeView === 'itinerary' && (
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '16px',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1f2937',
            fontSize: '18px',
            fontWeight: '600'
          }}
        >
          Itinerary View
        </div>
      )}
    </div>
  );
});

export default MapView;
