import { useEffect, useRef, useCallback, memo, useState } from 'react';
import { Maximize, Minimize, Map as MapIcon, List } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedSpots, categoryColors, toSentenceCase } from '../data/selectedTouristSpots';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const DEFAULT_ZOOM = 9;

// Helper function to get image paths for Binurong Point
const getImagePath = (filename) => {
  return `/src/assets/images/tourist-spots/${filename}`;
};

const MapView = memo(function MapView({ isFullscreen = false, onToggleFullscreen }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const mapLoaded = useRef(false);
  const markersRef = useRef([]);
  const popupRef = useRef(null);
  const savedState = useRef({ center: [124.2, 13.8], zoom: DEFAULT_ZOOM });
  const resizeTimeout = useRef(null);
  const animationTimeout = useRef(null);
  const previousZoom = useRef(DEFAULT_ZOOM);
  const [activeView, setActiveView] = useState('map');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [touristSpots, setTouristSpots] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load GeoJSON data and extract selected spots
  useEffect(() => {
    const loadTouristSpots = async () => {
      console.log('Starting to load tourist spots...');
      const spots = [];
      
      for (const selection of selectedSpots) {
        try {
          console.log(`Loading ${selection.geojsonFile}...`);
          const response = await fetch(`/data/${selection.geojsonFile}`);
          
          if (!response.ok) {
            console.error(`Failed to fetch ${selection.geojsonFile}: ${response.status}`);
            continue;
          }
          
          const geojson = await response.json();
          
          // Find the specific spot by name
          const feature = geojson.features.find(
            f => f.properties.name === selection.spotName
          );
          
          if (feature) {
            // Add images for Binurong Point
            let images = [];
            if (feature.properties.name === 'Binurong Point') {
              images = [
                getImagePath('Binurong_Point1.jpg'),
                getImagePath('Binurong_Point2.jpg')
              ];
            }
            
            spots.push({
              name: feature.properties.name,
              location: toSentenceCase(feature.properties.municipality),
              coordinates: feature.geometry.coordinates,
              description: feature.properties.description,
              categories: feature.properties.categories || [],
              images: images
            });
            console.log(`✓ Found: ${feature.properties.name}`);
          } else {
            console.error(`✗ Spot "${selection.spotName}" not found in ${selection.geojsonFile}`);
            console.log('Available spots:', geojson.features.map(f => f.properties.name));
          }
        } catch (error) {
          console.error(`Error loading ${selection.geojsonFile}:`, error);
        }
      }
      
      console.log(`Loaded ${spots.length}/${selectedSpots.length} tourist spots`);
      setTouristSpots(spots);
      setDataLoaded(true);
    };

    loadTouristSpots();
  }, []);

  // Add to itinerary handler
  const addToItinerary = (spot) => {
    const isAlreadyAdded = itinerary.some(item => item.name === spot.name);
    
    if (!isAlreadyAdded) {
      setItinerary(prev => [...prev, spot]);
      console.log('Added to itinerary:', spot.name);
    } else {
      console.log('Already in itinerary:', spot.name);
    }
  };

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

  // Create info card HTML content with image carousel
  const createInfoCardHTML = (spot) => {
    const categoryHTML = spot.categories
      .slice(0, 2)
      .map(cat => getCategoryPill(cat))
      .join('');

    // Create carousel HTML if images exist
    const hasImages = spot.images && spot.images.length > 0;
    const carouselHTML = hasImages ? `
      <div id="carousel-container" style="
        width: 100%;
        height: 210px;
        background-color: #e5e7eb;
        position: relative;
        overflow: hidden;
      ">
        ${spot.images.map((img, idx) => `
          <img 
            src="${img}" 
            alt="${spot.name} ${idx + 1}"
            class="carousel-image"
            data-index="${idx}"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              position: absolute;
              top: 0;
              left: 0;
              opacity: ${idx === 0 ? '1' : '0'};
              transition: opacity 0.3s ease;
            "
          />
        `).join('')}
        
        ${spot.images.length > 1 ? `
          <!-- Previous Button -->
          <button id="prev-btn" style="
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
            z-index: 10;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <!-- Next Button -->
          <button id="next-btn" style="
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
            z-index: 10;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          
          <!-- Image Counter -->
          <div id="image-counter" style="
            position: absolute;
            bottom: 8px;
            right: 8px;
            padding: 4px 8px;
            border-radius: 12px;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            font-size: 11px;
            font-weight: 600;
            z-index: 10;
          ">1 / ${spot.images.length}</div>
        ` : ''}
      </div>
    ` : `
      <div style="
        width: 100%;
        height: 210px;
        background-color: #e5e7eb;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <i class="fa-solid fa-location-dot" style="font-size: 48px; color: #9ca3af;"></i>
      </div>
    `;

    return `
      <div style="
        width: 280px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      ">
        <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; z-index: 10;">
          <button id="add-to-itinerary-btn" class="add-itinerary-btn" style="
            height: 28px;
            min-width: 28px;
            border-radius: 14px;
            background-color: rgba(132, 204, 22, 0.9);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow: hidden;
            white-space: nowrap;
            padding: 0 10px;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0;">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span class="btn-text" style="
              max-width: 0;
              opacity: 0;
              margin-left: 0;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              font-size: 11px;
              font-weight: 600;
              color: white;
            ">Add to Itinerary</span>
          </button>

          <button id="close-card-btn" style="
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        ${carouselHTML}

        <div style="padding: 12px 14px; background-color: white;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <i class="fa-solid fa-location-dot fa-bounce" style="font-size: 12px; color: #6b7280;"></i>
            <span style="color: #6b7280; font-size: 11px; font-weight: 500;">${spot.location}</span>
          </div>

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

          <div style="display: flex; flex-wrap: wrap; gap: 0;">
            ${categoryHTML}
          </div>
        </div>
      </div>

      <style>
        .add-itinerary-btn:hover {
          background-color: rgba(132, 204, 22, 1) !important;
          min-width: 140px !important;
        }
        .add-itinerary-btn:hover .btn-text {
          max-width: 120px !important;
          opacity: 1 !important;
          margin-left: 6px !important;
        }
      </style>

      <script>
        (function() {
          let currentIndex = 0;
          const images = document.querySelectorAll('.carousel-image');
          const totalImages = images.length;
          const counter = document.getElementById('image-counter');
          const prevBtn = document.getElementById('prev-btn');
          const nextBtn = document.getElementById('next-btn');

          function showImage(index) {
            images.forEach((img, i) => {
              img.style.opacity = i === index ? '1' : '0';
            });
            if (counter) {
              counter.textContent = (index + 1) + ' / ' + totalImages;
            }
          }

          if (prevBtn) {
            prevBtn.addEventListener('click', () => {
              currentIndex = (currentIndex - 1 + totalImages) % totalImages;
              showImage(currentIndex);
            });
            prevBtn.addEventListener('mouseenter', () => {
              prevBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            });
            prevBtn.addEventListener('mouseleave', () => {
              prevBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            });
          }

          if (nextBtn) {
            nextBtn.addEventListener('click', () => {
              currentIndex = (currentIndex + 1) % totalImages;
              showImage(currentIndex);
            });
            nextBtn.addEventListener('mouseenter', () => {
              nextBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            });
            nextBtn.addEventListener('mouseleave', () => {
              nextBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            });
          }
        })();
      </script>
    `;
  };

  // Add tourist spot markers - improved with better state checking
  const addTouristSpotMarkers = useCallback(() => {
    // Check if we have everything we need
    if (!map.current || !mapLoaded.current || touristSpots.length === 0) {
      console.log('⏳ Waiting for prerequisites:', {
        hasMap: !!map.current,
        mapLoaded: mapLoaded.current,
        spotsCount: touristSpots.length
      });
      return;
    }

    console.log(`🗺️ Adding ${touristSpots.length} markers to map...`);

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const currentZoom = map.current.getZoom();
    const scale = getMarkerScale(currentZoom);

    // Add markers for each tourist spot
    touristSpots.forEach((spot, index) => {
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
      
      markerEl.addEventListener('mouseenter', () => {
        iconElement.classList.add('fa-bounce');
        iconElement.style.transform = 'scale(1.15)';
      });
      markerEl.addEventListener('mouseleave', () => {
        iconElement.classList.remove('fa-bounce');
        iconElement.style.transform = 'scale(1)';
      });

      const marker = new maplibregl.Marker({
        element: markerEl,
        anchor: 'bottom'
      })
        .setLngLat(spot.coordinates)
        .addTo(map.current);

      markerEl.addEventListener('click', () => {
        iconElement.classList.add('fa-bounce');
        setTimeout(() => iconElement.classList.remove('fa-bounce'), 1000);

        setSelectedSpot(spot);
        
        if (popupRef.current) {
          popupRef.current.remove();
        }

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
            
            closeBtn.addEventListener('mouseenter', () => {
              closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            });
            closeBtn.addEventListener('mouseleave', () => {
              closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            });
          }

          const addBtn = document.getElementById('add-to-itinerary-btn');
          if (addBtn) {
            addBtn.addEventListener('click', () => addToItinerary(spot));
          }
        }, 0);
        
        const targetZoom = Math.max(map.current.getZoom(), 12);
        
        map.current.flyTo({
          center: spot.coordinates,
          zoom: targetZoom,
          padding: { top: 300, bottom: 50, left: 0, right: 0 },
          duration: 800
        });
      });

      markersRef.current.push(marker);
      console.log(`✓ Marker ${index + 1}: ${spot.name}`);
    });

    console.log(`✅ Successfully added ${markersRef.current.length} markers!`);
  }, [touristSpots]);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    fontAwesomeLink.integrity = 'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==';
    fontAwesomeLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontAwesomeLink);

    const bounds = [
      [123.5, 12.8],
      [125.0, 14.8]
    ];

    console.log('🌍 Initializing map...');

    fetch(`https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`)
      .then(response => response.json())
      .then(style => {
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

        map.current.on('zoom', () => {
          const currentZoom = map.current.getZoom();
          updateMarkerSizes(currentZoom);
        });

        map.current.on('load', () => {
          console.log('✅ Map loaded successfully');
          mapLoaded.current = true;
          
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

          // Try to add markers if data is already loaded
          if (dataLoaded && touristSpots.length > 0) {
            console.log('🎯 Data already loaded, adding markers immediately');
            addTouristSpotMarkers();
          }
        });
      })
      .catch(error => {
        console.error('❌ Error loading map style:', error);
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
        mapLoaded.current = false;
      }
    };
  }, [updateMarkerSizes, dataLoaded, touristSpots, addTouristSpotMarkers]);

  // CRITICAL: Add markers when BOTH map is ready AND tourist spots are loaded
  useEffect(() => {
    if (mapLoaded.current && dataLoaded && touristSpots.length > 0) {
      console.log('🎯 Both map and data ready, adding markers...');
      // Small delay to ensure map is fully rendered
      const timer = setTimeout(() => {
        addTouristSpotMarkers();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dataLoaded, touristSpots, addTouristSpotMarkers]);

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
            flexDirection: 'column',
            color: '#1f2937',
            fontSize: '18px',
            fontWeight: '600',
            padding: '20px'
          }}
        >
          <div>Itinerary View</div>
          {itinerary.length > 0 && (
            <div style={{ marginTop: '20px', fontSize: '14px', fontWeight: '400' }}>
              <div style={{ fontWeight: '600', marginBottom: '10px' }}>Items in itinerary: {itinerary.length}</div>
              {itinerary.map((item, index) => (
                <div key={index} style={{ padding: '5px 0' }}>• {item.name}</div>
              ))}
            </div>
          )}
        </div>
      )}

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
