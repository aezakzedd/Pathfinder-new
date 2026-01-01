import { useEffect, useRef, useCallback, memo, useState } from 'react';
import { Maximize, Minimize, Map as MapIcon, List } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const DEFAULT_ZOOM = 9;

const MapView = memo(function MapView({ isFullscreen = false, onToggleFullscreen }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const savedState = useRef({ center: [124.1, 13.8], zoom: DEFAULT_ZOOM }); // Adjusted center
  const resizeTimeout = useRef(null);
  const animationTimeout = useRef(null);
  const previousZoom = useRef(DEFAULT_ZOOM);
  const [activeView, setActiveView] = useState('map'); // 'map' or 'itinerary'

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Define more generous bounds to allow better panning while keeping focus on Catanduanes
    const bounds = [
      [123.5, 12.8],  // Southwest corner - more generous for better maneuverability
      [125.0, 14.8]   // Northeast corner - more generous for better maneuverability
    ];

    // Fetch and modify the style to show municipality labels at zoom 9
    fetch(`https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`)
      .then(response => response.json())
      .then(style => {
        // Modify layers to show place labels (municipalities, towns, cities) at lower zoom levels
        style.layers = style.layers.map(layer => {
          // Target place label layers (cities, towns, villages)
          if (layer.id && (
            layer.id.includes('place') || 
            layer.id.includes('town') || 
            layer.id.includes('city') ||
            layer.id.includes('village')
          ) && layer.type === 'symbol') {
            // Set minzoom to 9 or lower to make labels appear earlier
            return {
              ...layer,
              minzoom: Math.min(layer.minzoom || 14, 9)
            };
          }
          return layer;
        });

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: style, // Use modified style
          center: [124.1, 13.8], // Adjusted: moved left to position province more to the right
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
      })
      .catch(error => {
        console.error('Error loading map style:', error);
        // Fallback to default style if fetch fails
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`,
          center: [124.1, 13.8], // Adjusted center in fallback too
          zoom: DEFAULT_ZOOM,
          attributionControl: false,
          maxBounds: bounds,
          antialias: false,
          preserveDrawingBuffer: false,
          fadeDuration: 0,
          maxParallelImageRequests: 8,
          refreshExpiredTiles: false,
          trackResize: true,
          maxZoom: 18,
          maxPitch: 60,
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
      {/* Fullscreen toggle button - top left - only show in map mode */}
      {activeView === 'map' && (
        <button
          onClick={handleToggleFullscreen}
          style={{
            position: 'absolute',
            // Normal: standard 12px from edges
            // Fullscreen: adjust for map container's new position and width
            top: isFullscreen ? '12px' : '12px',
            // In fullscreen, map container shifts left by calc(-100% - 24px)
            // So button at 12px from map container's left = actual left edge + 12px
            // We want button at 12px from actual left, which means:
            // 12px from map container's left + map's left offset
            // = 12px + 0 (since map is already at the parent's left edge)
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
            transition: 'all 0.5s ease-in-out',
            willChange: 'top, left, background-color'
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
      )}

      {/* Map/Itinerary sliding toggle - top right - smaller and closer */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          zIndex: 10,
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '3px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          gap: '3px'
        }}
      >
        {/* Map button */}
        <button
          onClick={() => setActiveView('map')}
          style={{
            position: 'relative',
            padding: '6px 10px',
            border: 'none',
            borderRadius: '13px',
            backgroundColor: activeView === 'map' ? '#1f2937' : 'transparent',
            color: activeView === 'map' ? 'white' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <MapIcon size={16} strokeWidth={2} />
        </button>

        {/* Itinerary button */}
        <button
          onClick={() => setActiveView('itinerary')}
          style={{
            position: 'relative',
            padding: '6px 10px',
            border: 'none',
            borderRadius: '13px',
            backgroundColor: activeView === 'itinerary' ? '#1f2937' : 'transparent',
            color: activeView === 'itinerary' ? 'white' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <List size={16} strokeWidth={2} />
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

      {/* Itinerary view placeholder - properly centered in both modes */}
      {activeView === 'itinerary' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: isFullscreen ? '16px' : '16px',
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
