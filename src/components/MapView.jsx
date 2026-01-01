import { useEffect, useRef, useCallback, memo, useState } from 'react';
import { Maximize, Minimize, Map as MapIcon, List } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedSpots, categoryColors } from '../data/selectedTouristSpots';

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
  const [touristSpots, setTouristSpots] = useState([]);

  // Load GeoJSON data and extract selected spots
  useEffect(() => {
    const loadTouristSpots = async () => {
      const spots = [];
      
      for (const selection of selectedSpots) {
        try {
          const response = await fetch(`/data/${selection.geojsonFile}`);
          const geojson = await response.json();
          
          // Find the specific spot by name
          const feature = geojson.features.find(
            f => f.properties.name === selection.spotName
          );
          
          if (feature) {
            spots.push({
              name: feature.properties.name,
              location: feature.properties.municipality,
              coordinates: feature.geometry.coordinates,
              description: feature.properties.description,
              categories: feature.properties.categories || [],
              image: null // Will be added later when you have images
            });
          }
        } catch (error) {
          console.error(`Error loading ${selection.geojsonFile}:`, error);
        }
      }
      
      setTouristSpots(spots);
    };

    loadTouristSpots();
  }, []);

  // Calculate marker scale based on zoom level
  const getMarkerScale = (zoom) => {
    const baseZoom = 9;
    const scale = Math.max(0.5, 1 - (zoom - baseZoom) * 0.1);
    return scale;
  };

  // Update marker sizes based on zoom
  const updateMarkerSizes = useCallback((zoom) => {
    const scale = getMarkerScale(zoom);
    markersRef.current.forEach(marker => {
      const element = marker.getElement();
      const icon = element?.querySelector('i');
      if (icon) {
        icon.style.fontSize = `${42 * scale}px`;
      }
    });
  }, []);

  // Get category pill HTML
  const getCategoryPill = (category) => {
    const colors = categoryColors[category] || categoryColors.default;
    return `
      <span style="
        display: inline-block;
        padding: 4px 10px;
        border-radius: 12px;
        background-color: ${colors.bg};
        color: ${colors.text};
        font-size: 10px;
        font-weight: 600;
        text-transform: capitalize;
        margin-right: 4px;
        margin-bottom: 4px;
      ">${category.toLowerCase().replace('_', ' ')}</span>
    `;
  };

  // Create info card HTML content
  const createInfoCardHTML = (spot) => {
    const categoryHTML = spot.categories
      .slice(0, 2) // Show max 2 categories
      .map(cat => getCategoryPill(cat))
      .join('');

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
              <i class="fa-solid fa-location-dot" style="font-size: 48px; color: #9ca3af;"></i>
            </div>`
          }
        </div>

        <!-- Details section -->
        <div style="padding: 12px 14px; background-color: white;">
          <!-- Location -->
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <i class="fa-solid fa-location-dot fa-bounce" style="font-size: 12px; color: #6b7280;"></i>
            <span style="color: #6b7280; font-size: 11px; font-weight: 500;">${spot.location}</span>
          </div>

          <!-- Name -->
          <h3 style="
            margin: 0;
            font-size: 15px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          ">${spot.name}</h3>

          <!-- Categories -->
          <div style="display: flex; flex-wrap: wrap; gap: 0;">
            ${categoryHTML}
          </div>
        </div>
      </div>
    `;
  };

  // Add tourist spot markers
  const addTouristSpotMarkers = useCallback(() => {
    if (!map.current || touristSpots.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const currentZoom = map.current.getZoom();
    const scale = getMarkerScale(currentZoom);

    // Add markers for each tourist spot
    touristSpots.forEach(spot => {
      // Create custom marker element with Font Awesome icon
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <i class="fa-solid fa-location-dot" style="
          font-size: ${42 * scale}px;
          color: #84cc16;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
          cursor: pointer;
          transition: font-size 0.3s ease, transform 0.2s ease;
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
        anchor: 'bottom'
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
        const popup = new maplibregl.Popup({
          offset: [0, -342],
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
        
        // Use padding to keep info card visible while centering on marker coordinates
        const targetZoom = Math.max(map.current.getZoom(), 12);
        
        map.current.flyTo({
          center: spot.coordinates,
          zoom: targetZoom,
          padding: { top: 300, bottom: 50, left: 0, right: 0 },
          duration: 800
        });
      });

      markersRef.current.push(marker);
    });
  }, [touristSpots]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Load Font Awesome CSS
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    fontAwesomeLink.integrity = 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==';
    fontAwesomeLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontAwesomeLink);

    // Define bounds
    const bounds = [
      [123.5, 12.8],
      [125.0, 14.8]
    ];

    // Fetch and modify the style
    fetch(`https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`)
      .then(response => response.json())
      .then(style => {
        // Modify layers to show place labels at lower zoom levels
        style.layers = style.layers.map(layer => {
          if (layer.id && (
            layer.id.includes('place') || 
            layer.id.includes('town') || 
            layer.id.includes('city') ||
            layer.id.includes('village')
          ) && layer.type === 'symbol') {
            return {
              ...layer,
              minzoom: Math.min(layer.minzoom || 14, 9)
            };
          }
          return layer;
        });

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: style,
          center: [124.2, 13.8],
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

        // Add zoom event listener
        map.current.on('zoom', () => {
          const currentZoom = map.current.getZoom();
          updateMarkerSizes(currentZoom);
        });

        // Add mask overlay when map loads
        map.current.on('load', () => {
          const maskGeoJSON = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-180, -90],
                  [180, -90],
                  [180, 90],
                  [-180, 90],
                  [-180, -90]
                ],
                [
                  [124.011, 13.35],
                  [124.011, 14.15],
                  [124.45, 14.15],
                  [124.45, 13.35],
                  [124.011, 13.35]
                ]
              ]
            }
          };

          map.current.addSource('mask', {
            type: 'geojson',
            data: maskGeoJSON
          });

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
      });

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [addTouristSpotMarkers, updateMarkerSizes]);

  // Re-add markers when tourist spots are loaded
  useEffect(() => {
    if (map.current && touristSpots.length > 0) {
      addTouristSpotMarkers();
    }
  }, [touristSpots, addTouristSpotMarkers]);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (!map.current) return;
    
    const currentZoom = map.current.getZoom();
    const currentCenter = map.current.getCenter();
    
    savedState.current = {
      center: currentCenter,
      zoom: currentZoom
    };

    if (resizeTimeout.current) {
      clearTimeout(resizeTimeout.current);
    }

    resizeTimeout.current = setTimeout(() => {
      if (map.current) {
        map.current.resize();
        
        let targetZoom = savedState.current.zoom;
        
        if (Math.abs(previousZoom.current - DEFAULT_ZOOM) < 0.01) {
          targetZoom = DEFAULT_ZOOM;
        }
        
        map.current.jumpTo({
          center: savedState.current.center,
          zoom: targetZoom
        });
      }
    }, 100);
  }, []);

  // Resize map after animation
  useEffect(() => {
    if (map.current) {
      previousZoom.current = map.current.getZoom();
    }

    if (animationTimeout.current) {
      clearTimeout(animationTimeout.current);
    }

    animationTimeout.current = setTimeout(() => {
      handleResize();
    }, 750);

    return () => {
      if (animationTimeout.current) {
        clearTimeout(animationTimeout.current);
      }
    };
  }, [isFullscreen, handleResize]);

  // Memoized button handler
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
      {/* Fullscreen toggle button */}
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

      {/* Map/Itinerary toggle */}
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

      {/* Itinerary view placeholder */}
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
