import { useEffect, useRef, useCallback, memo, useState } from 'react';
import { Maximize, Minimize, Map as MapIcon, List } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { touristSpots } from '../data/touristSpots';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const DEFAULT_ZOOM = 9;

const MapView = memo(function MapView({ isFullscreen = false, onToggleFullscreen }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const popupRef = useRef(null);
  const savedState = useRef({ center: [124.2, 13.8], zoom: DEFAULT_ZOOM });
  const resizeTimeout = useRef(null);
  const animationTimeout = useRef(null);
  const previousZoom = useRef(DEFAULT_ZOOM);
  const [activeView, setActiveView] = useState('map');
  const [selectedSpot, setSelectedSpot] = useState(null);

  // Create info card HTML content
  const createInfoCardHTML = (spot) => {
    return `
      <div style="
        width: 280px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      ">
        <!-- Close button -->
        <button id="close-card-btn" style="
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: background-color 0.2s;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Image section -->
        <div style="
          width: 100%;
          height: 210px;
          background-color: #e5e7eb;
          position: relative;
          overflow: hidden;
        ">
          ${spot.image ? 
            `<img src="${spot.image}" alt="${spot.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none';" />` :
            `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af; font-size: 14px;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>`
          }
        </div>

        <!-- Details section -->
        <div style="padding: 12px 14px; background-color: white;">
          <!-- Location -->
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span style="color: #6b7280; font-size: 11px; font-weight: 500;">${spot.location}</span>
          </div>

          <!-- Name -->
          <h3 style="
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          ">${spot.name}</h3>

          <!-- Rating -->
          <div style="display: flex; align-items: center; gap: 4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#111827" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span style="font-size: 13px; font-weight: 600; color: #111827;">${spot.rating}</span>
            <span style="font-size: 13px; color: #6b7280;">(${spot.reviewCount})</span>
          </div>
        </div>
      </div>
    `;
  };

  // Add tourist spot markers
  const addTouristSpotMarkers = useCallback(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each tourist spot
    touristSpots.forEach(spot => {
      // Create custom marker element with Font Awesome icon
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <i class="fa-solid fa-location-dot" style="
          font-size: 42px;
          color: #84cc16;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
          cursor: pointer;
          transition: transform 0.2s ease;
        "></i>
      `;
      
      const iconElement = markerEl.querySelector('i');
      
      // Add hover effect with bounce animation
      markerEl.addEventListener('mouseenter', () => {
        iconElement.classList.add('fa-bounce');
        iconElement.style.transform = 'scale(1.15)';
      });
      markerEl.addEventListener('mouseleave', () => {
        iconElement.classList.remove('fa-bounce');
        iconElement.style.transform = 'scale(1)';
      });

      // Create marker with proper anchor at the bottom point of the pin
      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: 'bottom' // Anchors at the bottom point of the pin
      })
        .setLngLat(spot.coordinates)
        .addTo(map.current);

      // Add click event to show info card with bounce animation
      markerEl.addEventListener('click', () => {
        // Trigger bounce animation
        iconElement.classList.add('fa-bounce');
        setTimeout(() => {
          iconElement.classList.remove('fa-bounce');
        }, 1000);

        setSelectedSpot(spot);
        
        // Remove existing popup if any
        if (popupRef.current) {
          popupRef.current.remove();
        }

        // Create geo-anchored popup
        // Card height: 210px (image) + 70px (details) = 280px
        // Pin height: ~42px
        // Gap: 20px
        // Total offset: -(280 + 42 + 20) = -342px
        const popup = new maplibregl.Popup({
          offset: [0, -342], // Position well above the pin to avoid blocking
          closeButton: false,
          closeOnClick: false,
          className: 'tourist-spot-popup',
          maxWidth: 'none'
        })
          .setLngLat(spot.coordinates)
          .setHTML(createInfoCardHTML(spot))
          .addTo(map.current);

        popupRef.current = popup;

        // Add close button event listener after popup is added to DOM
        setTimeout(() => {
          const closeBtn = document.getElementById('close-card-btn');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              if (popupRef.current) {
                popupRef.current.remove();
                popupRef.current = null;
              }
              setSelectedSpot(null);
            });
            
            // Add hover effect to close button
            closeBtn.addEventListener('mouseenter', () => {
              closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            });
            closeBtn.addEventListener('mouseleave', () => {
              closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            });
          }
        }, 0);
        
        // Smooth pan to marker location
        map.current.flyTo({
          center: spot.coordinates,
          zoom: Math.max(map.current.getZoom(), 12),
          duration: 800
        });
      });

      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Load Font Awesome CSS
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    fontAwesomeLink.integrity = 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==';
    fontAwesomeLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontAwesomeLink);

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
          center: [124.2, 13.8], // Adjusted to 124.2 longitude
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

          // Add tourist spot markers after map loads
          addTouristSpotMarkers();
        });
      })
      .catch(error => {
        console.error('Error loading map style:', error);
        // Fallback to default style if fetch fails
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: `https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`,
          center: [124.2, 13.8], // Adjusted center in fallback too
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

        map.current.on('load', () => {
          addTouristSpotMarkers();
        });
      });

    return () => {
      // Clean up popup
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      
      // Clean up markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [addTouristSpotMarkers]);

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
            top: isFullscreen ? '12px' : '12px',
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

      {/* Custom CSS for popup */}
      <style>
        {`
          .maplibregl-popup-content {
            padding: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
          }
          .maplibregl-popup-tip {
            display: none !important;
          }
          .tourist-spot-popup .maplibregl-popup-content {
            border-radius: 12px;
          }
          .custom-marker {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  );
});

export default MapView;
