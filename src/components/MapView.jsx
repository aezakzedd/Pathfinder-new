import { useEffect, useRef, useCallback, memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize, Minimize, Map as MapIcon, List, X } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedSpots, categoryColors, toSentenceCase } from '../data/selectedTouristSpots';
import { getSpotMedia } from '../hooks/useSpotMedia'; // Import the new helper
import PlaceDetailsSidebar from './PlaceDetailsSidebar';
import ItineraryView from './ItineraryView';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const DEFAULT_ZOOM = 9;
const SIDEBAR_WIDTH = 480;

// Popularity threshold - spots with more than this many images are "popular"
const POPULARITY_THRESHOLD = 3;

// Platform configuration
const PLATFORMS = {
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    textColor: '#FFFFFF'
  },
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    textColor: '#FFFFFF'
  },
  tiktok: {
    name: 'TikTok',
    color: '#000000',
    textColor: '#FFFFFF'
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    textColor: '#FFFFFF'
  }
};

// Helper function to fetch route between two coordinates using OSRM
const fetchRoute = async (start, end) => {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
    console.log('🔄 Fetching route:', start, '->', end);
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      console.log('✅ Route fetched');
      return data.routes[0].geometry;
    }
    console.log('❌ No routes found');
    return null;
  } catch (error) {
    console.error('❌ Route fetch error:', error);
    return null;
  }
};

// Loading Skeleton Component
const VideoSkeleton = () => (
  <div
    style={{
      width: '267px',
      height: '476px',
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        animation: 'shimmer 2s infinite'
      }}
    />
    <div
      style={{
        width: '48px',
        height: '48px',
        border: '4px solid rgba(255,255,255,0.1)',
        borderTopColor: '#1e40af',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
    <style>
      {`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}
    </style>
  </div>
);

// Performance Monitor Component
const PerformanceMonitor = ({ show }) => {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    if (!show) return;

    const measureFPS = () => {
      frameCount.current++;
      const now = performance.now();
      const delta = now - lastTime.current;

      if (delta >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / delta));
        frameCount.current = 0;
        lastTime.current = now;

        if (performance.memory) {
          const usedMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
          setMemory(usedMB);
        }
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(rafId);
  }, [show]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#1e40af',
        padding: '12px 16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 10002,
        minWidth: '150px',
        border: '1px solid rgba(30, 64, 175, 0.3)'
      }}
    >
      <div style={{ marginBottom: '4px', fontWeight: 'bold', color: 'white' }}>Performance</div>
      <div>FPS: <span style={{ color: fps < 30 ? '#ef4444' : fps < 50 ? '#f59e0b' : '#1e40af' }}>{fps}</span></div>
      {memory > 0 && <div>Memory: {memory} MB</div>}
    </div>
  );
};

const MapView = memo(function MapView({ isFullscreen = false, onToggleFullscreen }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const mapLoaded = useRef(false);
  const markersRef = useRef([]);
  const markerElementsRef = useRef(new Map()); // Store marker elements by spot name
  const visibleMarkersRef = useRef(new Set()); // Track which markers are currently visible
  const popupRef = useRef(null);
  const savedState = useRef({ center: [124.2, 13.8], zoom: DEFAULT_ZOOM });
  const resizeTimeout = useRef(null);
  const animationTimeout = useRef(null);
  const previousZoom = useRef(DEFAULT_ZOOM);
  const [activeView, setActiveView] = useState('map');
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [touristSpots, setTouristSpots] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const itineraryRef = useRef([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalSpot, setModalSpot] = useState(null);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPlace, setSidebarPlace] = useState(null);

  // Video optimization states
  const [loadedVideos, setLoadedVideos] = useState(new Set([0]));
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);
  const iframeRefs = useRef([]);
  const observerRef = useRef(null);

  // Performance monitoring
  const [showPerformance, setShowPerformance] = useState(false);

  // Keep itinerary ref in sync
  useEffect(() => {
    itineraryRef.current = itinerary;
  }, [itinerary]);

  // Toggle performance monitor with Ctrl+Shift+P
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setShowPerformance(prev => !prev);
        console.log('Performance monitor toggled');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Draw routing lines IMPERATIVELY using ref
  const drawRoutes = useCallback(async () => {
    if (!map.current || !mapLoaded.current) return;

    const currentItinerary = itineraryRef.current;
    console.log('🎨 Drawing routes for', currentItinerary.length, 'places');

    // Remove existing route
    if (map.current.getSource('route')) {
      if (map.current.getLayer('route-line')) map.current.removeLayer('route-line');
      if (map.current.getLayer('route-outline')) map.current.removeLayer('route-outline');
      map.current.removeSource('route');
      console.log('🗑️ Removed old routes');
    }

    // Need at least 2 places
    if (currentItinerary.length < 2) {
      console.log('⏭️ Not enough places');
      return;
    }

    // Fetch all route segments
    const routeSegments = [];
    for (let i = 0; i < currentItinerary.length - 1; i++) {
      const start = currentItinerary[i].coordinates;
      const end = currentItinerary[i + 1].coordinates;
      const route = await fetchRoute(start, end);
      if (route) routeSegments.push(route);
    }

    if (routeSegments.length === 0) {
      console.log('❌ No route segments');
      return;
    }

    console.log('✅ Got', routeSegments.length, 'segments');

    // Combine into FeatureCollection
    const combinedGeometry = {
      type: 'FeatureCollection',
      features: routeSegments.map(geometry => ({
        type: 'Feature',
        geometry: geometry
      }))
    };

    // Add source and layers
    map.current.addSource('route', {
      type: 'geojson',
      data: combinedGeometry
    });

    map.current.addLayer({
      id: 'route-outline',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ffffff',
        'line-width': 6,
        'line-opacity': 0.8
      }
    });

    map.current.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#1e40af',
        'line-width': 4,
        'line-opacity': 0.9
      }
    });

    console.log('🎉 Routes drawn successfully!');
  }, []);

  // Call drawRoutes when itinerary changes
  useEffect(() => {
    drawRoutes();
  }, [itinerary.length, drawRoutes]);

  // Video queue system
  const updateVideoQueue = useCallback((centerIndex) => {
    const videoCount = 3;
    const newQueue = new Set();

    newQueue.add(centerIndex);
    if (centerIndex > 0) newQueue.add(centerIndex - 1);
    if (centerIndex < videoCount - 1) newQueue.add(centerIndex + 1);

    setLoadedVideos(newQueue);
    setCurrentVideoIndex(centerIndex);
  }, []);

  // Intersection Observer for lazy loading AND autoplay/pause
  useEffect(() => {
    if (!modalOpen) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.videoIndex);
          const iframe = iframeRefs.current[index];
          
          if (entry.isIntersecting) {
            updateVideoQueue(index);
            
            if (iframe) {
              const platform = getVideoPlatform(index);
              if (platform === 'youtube') {
                iframe.contentWindow?.postMessage(
                  JSON.stringify({ event: 'command', func: 'playVideo', args: '' }),
                  '*'
                );
              }
            }
          } else {
            if (iframe) {
              const platform = getVideoPlatform(index);
              if (platform === 'youtube') {
                iframe.contentWindow?.postMessage(
                  JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
                  '*'
                );
              }
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.5,
        rootMargin: '0px'
      }
    );

    videoRefs.current.forEach((ref) => {
      if (ref) observerRef.current.observe(ref);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [modalOpen, updateVideoQueue]);

  // Load GeoJSON data and extract selected spots with images from manifest
  useEffect(() => {
    const loadTouristSpots = async () => {
      console.log('Starting to load tourist spots...');
      const spots = [];
      
      for (const selection of selectedSpots) {
        try {
          const response = await fetch(`/data/${selection.geojsonFile}`);
          
          if (!response.ok) {
            console.error(`Failed to fetch ${selection.geojsonFile}`);
            continue;
          }
          
          const geojson = await response.json();
          const feature = geojson.features.find(
            f => f.properties.name === selection.spotName
          );
          
          if (feature) {
            // Load images from new manifest system
            const mediaData = await getSpotMedia(
              feature.properties.municipality, 
              feature.properties.name
            );
            
            // Determine if spot is popular based on image count
            const imageCount = mediaData.images.length;
            const isPopular = imageCount > POPULARITY_THRESHOLD;
            
            spots.push({
              name: feature.properties.name,
              location: toSentenceCase(feature.properties.municipality),
              coordinates: feature.geometry.coordinates,
              description: feature.properties.description,
              categories: feature.properties.categories || [],
              images: mediaData.images,
              isPopular: isPopular // Add popularity flag
            });
          }
        } catch (error) {
          console.error(`Error loading ${selection.geojsonFile}:`, error);
        }
      }
      
      console.log(`Loaded ${spots.length} spots (${spots.filter(s => s.isPopular).length} popular, ${spots.filter(s => !s.isPopular).length} less popular)`);
      setTouristSpots(spots);
      setDataLoaded(true);
    };

    loadTouristSpots();
  }, []);

  // Add to itinerary handler
  const addToItinerary = useCallback((spot, buttonElement) => {
    const isAlreadyAdded = itineraryRef.current.some(item => item.name === spot.name);
    
    if (!isAlreadyAdded) {
      console.log('✅ Adding:', spot.name);
      
      if (buttonElement) {
        buttonElement.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        buttonElement.style.backgroundColor = '#22c55e';
        buttonElement.style.pointerEvents = 'none';
        buttonElement.style.minWidth = '28px';
      }
      
      setItinerary(prev => [...prev, spot]);
    }
  }, []);

  // Remove from itinerary handler
  const removeFromItinerary = useCallback((index) => {
    setItinerary(prev => prev.filter((_, i) => i !== index));
    console.log('Removed index:', index);
  }, []);

  // Handle card click from itinerary
  const handleCardClick = useCallback((place) => {
    const imageUrl = place.images && place.images.length > 0 ? place.images[0] : null;
    
    setModalImage(imageUrl);
    setModalSpot(place);
    setModalOpen(true);
    setSidebarPlace(place);
    setSidebarOpen(true);
    setLoadedVideos(new Set([0]));
    setCurrentVideoIndex(0);
  }, []);

  // Handle image click to open modal
  const handleImageClick = useCallback((image, spot) => {
    setModalImage(image);
    setModalSpot(spot);
    setModalOpen(true);
    setSidebarPlace(spot);
    setSidebarOpen(true);
    setLoadedVideos(new Set([0]));
    setCurrentVideoIndex(0);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSidebarOpen(false);
    iframeRefs.current.forEach((iframe, index) => {
      if (iframe) {
        const platform = getVideoPlatform(index);
        if (platform === 'youtube') {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }),
            '*'
          );
        }
      }
    });
    setTimeout(() => {
      setModalImage(null);
      setModalSpot(null);
      setSidebarPlace(null);
      setLoadedVideos(new Set([0]));
      setCurrentVideoIndex(0);
    }, 300);
  }, []);

  // Close sidebar handler
  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    setTimeout(() => {
      setSidebarPlace(null);
    }, 300);
  }, []);

  // Calculate marker scale based on zoom level
  const getMarkerScale = (zoom) => {
    const baseZoom = 9;
    const scale = Math.max(0.5, 1 - (zoom - baseZoom) * 0.1);
    return scale;
  };

  // Update marker sizes based on zoom (only for standard pin markers, NOT image markers)
  const updateMarkerSizes = useCallback((zoom) => {
    const scale = getMarkerScale(zoom);
    markersRef.current.forEach(marker => {
      const element = marker.getElement();
      const icon = element?.querySelector('i');
      
      // Only scale standard pin markers, skip image markers
      if (icon) {
        icon.style.fontSize = `${42 * scale}px`;
      }
      // Image markers remain constant size - no scaling
    });
  }, []);

  // Get category pill HTML
  const getCategoryPill = useCallback((category) => {
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
  }, []);

  // Check if spot is in itinerary using ref
  const isSpotInItinerary = useCallback((spotName) => {
    return itineraryRef.current.some(item => item.name === spotName);
  }, []);

  // Create info card HTML
  const createInfoCardHTML = useCallback((spot) => {
    const categoryHTML = spot.categories
      .slice(0, 2)
      .map(cat => getCategoryPill(cat))
      .join('');

    const isInItinerary = isSpotInItinerary(spot.name);
    const hasImages = spot.images && spot.images.length > 0;
    const imageCount = spot.images ? spot.images.length : 0;
    
    const buttonsHTML = `
      <div style="position: absolute; top: 8px; right: 8px; display: flex; gap: 6px; z-index: 20;">
        <button id="add-to-itinerary-btn" style="
          width: 28px;
          height: 28px;
          min-width: 28px;
          flex-shrink: 0;
          border-radius: 14px;
          background-color: ${isInItinerary ? '#22c55e' : 'rgba(30, 64, 175, 0.95)'};
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: ${isInItinerary ? 'default' : 'pointer'};
          pointer-events: ${isInItinerary ? 'none' : 'auto'};
          padding: 0;
        ">
          ${isInItinerary ? `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ` : `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          `}
        </button>

        <button id="close-card-btn" style="
          width: 28px;
          height: 28px;
          min-width: 28px;
          flex-shrink: 0;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.6);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    `;
    
    // Circle step indicators
    const stepIndicatorsHTML = imageCount > 1 ? `
      <div id="step-indicators" style="
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 6px;
        z-index: 15;
      ">
        ${Array.from({ length: imageCount }, (_, i) => `
          <div class="step-indicator" data-step="${i}" style="
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: ${i === 0 ? 'white' : 'rgba(255, 255, 255, 0.5)'};
            transition: background-color 0.3s ease;
          "></div>
        `).join('')}
      </div>
    ` : '';
    
    const carouselHTML = hasImages ? `
      <div id="carousel-container" style="
        width: 100%;
        height: 210px;
        background-color: #e5e7eb;
        position: relative;
        overflow: hidden;
        border-radius: 12px 12px 0 0;
      ">
        ${buttonsHTML}
        ${stepIndicatorsHTML}
        ${spot.images.map((img, idx) => `
          <img 
            src="${img}" 
            alt="${spot.name}"
            class="carousel-image"
            data-index="${idx}"
            data-image-url="${img}"
            style="
              width: 100%;
              height: 100%;
              object-fit: cover;
              position: absolute;
              top: 0;
              left: 0;
              opacity: ${idx === 0 ? '1' : '0'};
              transition: opacity 0.3s ease;
              cursor: pointer;
            "
          />
        `).join('')}
        
        ${spot.images.length > 1 ? `
          <button id="carousel-prev-btn" style="
            position: absolute;
            left: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            border: none;
            cursor: pointer;
            z-index: 10;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button id="carousel-next-btn" style="
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.5);
            border: none;
            cursor: pointer;
            z-index: 10;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
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
        border-radius: 12px 12px 0 0;
      ">
        ${buttonsHTML}
        <i class="fa-solid fa-location-dot" style="font-size: 48px; color: #9ca3af;"></i>
      </div>
    `;

    return `
      <div class="info-card-popup" style="
        width: 280px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        overflow: visible;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        transform: scale(0.3);
        opacity: 0;
        transform-origin: bottom center;
        transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        position: relative;
      ">
        ${carouselHTML}
        
        <!-- Black Separator Line -->
        <div style="
          width: 100%;
          height: 1px;
          background-color: #000000;
          position: relative;
        "></div>
        
        <!-- Black Pill Button -->
        <button id="view-details-btn" style="
          position: absolute;
          top: 209.5px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 16px;
          background-color: #000000;
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          z-index: 25;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        "
        onmouseover="this.style.transform='translateX(-50%) scale(1.05)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.4)'"
        onmouseout="this.style.transform='translateX(-50%) scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
          View Details
        </button>
        
        <div style="
          padding: 20px 14px 12px 14px;
          box-sizing: border-box;
          width: 100%;
          max-width: 280px;
        ">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <i class="fa-solid fa-location-dot" style="font-size: 12px; color: #6b7280; flex-shrink: 0;"></i>
            <span style="color: #6b7280; font-size: 11px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${spot.location}</span>
          </div>
          <h3 style="
            margin: 0 0 8px 0;
            font-size: 15px;
            font-weight: 600;
            color: #111827;
            line-height: 1.4;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
            width: 100%;
            box-sizing: border-box;
          ">${spot.name}</h3>
          <div style="display: flex; flex-wrap: wrap;">
            ${categoryHTML}
          </div>
        </div>
      </div>
    `;
  }, [getCategoryPill, isSpotInItinerary]);

  // Check if a spot is in the current viewport
  const isSpotInViewport = useCallback((coordinates) => {
    if (!map.current) return false;
    
    const bounds = map.current.getBounds();
    const [lng, lat] = coordinates;
    
    return (
      lng >= bounds.getWest() &&
      lng <= bounds.getEast() &&
      lat >= bounds.getSouth() &&
      lat <= bounds.getNorth()
    );
  }, []);

  // Create marker element based on popularity
  const createMarkerElement = useCallback((spot) => {
    const markerEl = document.createElement('div');
    markerEl.style.display = 'flex';
    markerEl.style.flexDirection = 'column';
    markerEl.style.alignItems = 'center';
    
    if (spot.isPopular) {
      // Popular spots: iOS-style image marker
      const hasImage = spot.images && spot.images.length > 0;
      
      if (hasImage) {
        markerEl.innerHTML = `
          <div class="image-marker-icon" style="
            width: 60px;
            height: 60px;
            border-radius: 16px;
            overflow: hidden;
            background-color: white;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease;
          ">
            <img 
              src="${spot.images[0]}" 
              alt="${spot.name}"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
              "
            />
          </div>
          <div class="marker-label" style="
            font-size: 12px;
            font-weight: 600;
            color: #000000;
            text-shadow: 
              -1px -1px 0 #fff,
              1px -1px 0 #fff,
              -1px 1px 0 #fff,
              1px 1px 0 #fff,
              -1.5px 0 0 #fff,
              1.5px 0 0 #fff,
              0 -1.5px 0 #fff,
              0 1.5px 0 #fff;
            margin-top: 6px;
            white-space: nowrap;
            pointer-events: none;
            text-align: center;
            line-height: 1.2;
            opacity: 1;
            transition: opacity 0.3s ease;
          ">${spot.name}</div>
        `;
      } else {
        markerEl.innerHTML = `
          <div class="image-marker-icon" style="
            width: 60px;
            height: 60px;
            border-radius: 16px;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <i class="fa-solid fa-location-dot" style="font-size: 32px; color: white;"></i>
          </div>
          <div class="marker-label" style="
            font-size: 12px;
            font-weight: 600;
            color: #000000;
            text-shadow: 
              -1px -1px 0 #fff,
              1px -1px 0 #fff,
              -1px 1px 0 #fff,
              1px 1px 0 #fff,
              -1.5px 0 0 #fff,
              1.5px 0 0 #fff,
              0 -1.5px 0 #fff,
              0 1.5px 0 #fff;
            margin-top: 6px;
            white-space: nowrap;
            pointer-events: none;
            text-align: center;
            line-height: 1.2;
            opacity: 1;
            transition: opacity 0.3s ease;
          ">${spot.name}</div>
        `;
      }
      
      // Add hover effects for iOS-style markers
      const imageIcon = markerEl.querySelector('.image-marker-icon');
      markerEl.addEventListener('mouseenter', () => {
        imageIcon.style.transform = 'scale(1.1)';
        imageIcon.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
      });
      markerEl.addEventListener('mouseleave', () => {
        imageIcon.style.transform = 'scale(1)';
        imageIcon.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
      });
    } else {
      // Less popular spots: Simple icon + text
      markerEl.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 6px 12px;
          border-radius: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: all 0.2s ease;
        " class="simple-marker">
          <i class="fa-solid fa-location-dot" style="font-size: 14px; color: #1e40af;"></i>
          <span style="
            font-size: 12px;
            font-weight: 600;
            color: #1f2937;
            white-space: nowrap;
          ">${spot.name}</span>
        </div>
      `;
      
      // Add hover effect for simple markers
      const simpleMarker = markerEl.querySelector('.simple-marker');
      markerEl.addEventListener('mouseenter', () => {
        simpleMarker.style.transform = 'scale(1.05)';
        simpleMarker.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      });
      markerEl.addEventListener('mouseleave', () => {
        simpleMarker.style.transform = 'scale(1)';
        simpleMarker.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      });
    }
    
    return markerEl;
  }, []);

  // Update visible markers based on viewport
  const updateVisibleMarkers = useCallback(() => {
    if (!map.current || !mapLoaded.current || touristSpots.length === 0) return;

    const currentVisibleSpots = new Set();
    
    touristSpots.forEach((spot) => {
      const inViewport = isSpotInViewport(spot.coordinates);
      const isCurrentlyVisible = visibleMarkersRef.current.has(spot.name);
      
      if (inViewport) {
        currentVisibleSpots.add(spot.name);
        
        // Add marker if not already visible
        if (!isCurrentlyVisible) {
          const markerEl = createMarkerElement(spot);
          markerElementsRef.current.set(spot.name, markerEl);

          const marker = new maplibregl.Marker({ 
            element: markerEl, 
            anchor: spot.isPopular ? 'bottom' : 'center'
          })
            .setLngLat(spot.coordinates)
            .addTo(map.current);

          // Add click handler
          markerEl.addEventListener('click', () => {
            setSelectedSpot(spot);
            
            // Hide marker elements when popup opens
            if (spot.isPopular) {
              const icon = markerEl.querySelector('.image-marker-icon');
              const label = markerEl.querySelector('.marker-label');
              if (icon) icon.style.opacity = '0';
              if (label) label.style.opacity = '0';
            } else {
              markerEl.style.opacity = '0';
            }
            
            if (popupRef.current) popupRef.current.remove();

            const popup = new maplibregl.Popup({
              offset: [0, -342],
              closeButton: false,
              closeOnClick: false,
              maxWidth: 'none'
            })
              .setLngLat(spot.coordinates)
              .setHTML(createInfoCardHTML(spot))
              .addTo(map.current);

            popupRef.current = popup;

            // Setup popup interactions
            setTimeout(() => {
              const popupCard = document.querySelector('.info-card-popup');
              if (popupCard) {
                popupCard.style.transform = 'scale(1)';
                popupCard.style.opacity = '1';
              }

              let currentIdx = 0;
              const images = document.querySelectorAll('.carousel-image');
              const stepIndicators = document.querySelectorAll('.step-indicator');
              const prevBtn = document.getElementById('carousel-prev-btn');
              const nextBtn = document.getElementById('carousel-next-btn');

              function showImage(index) {
                images.forEach((img, i) => {
                  img.style.opacity = i === index ? '1' : '0';
                });
                stepIndicators.forEach((indicator, i) => {
                  indicator.style.backgroundColor = i === index ? 'white' : 'rgba(255, 255, 255, 0.5)';
                });
              }

              images.forEach((img) => {
                img.addEventListener('click', (e) => {
                  handleImageClick(e.target.getAttribute('data-image-url'), spot);
                });
              });

              if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  currentIdx = (currentIdx - 1 + images.length) % images.length;
                  showImage(currentIdx);
                });
              }

              if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  currentIdx = (currentIdx + 1) % images.length;
                  showImage(currentIdx);
                });
              }

              const closeBtn = document.getElementById('close-card-btn');
              if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                  if (popupRef.current) {
                    popupRef.current.remove();
                    popupRef.current = null;
                  }
                  
                  // Show marker elements again
                  const currentMarkerEl = markerElementsRef.current.get(spot.name);
                  if (currentMarkerEl) {
                    if (spot.isPopular) {
                      const currentIcon = currentMarkerEl.querySelector('.image-marker-icon');
                      const currentLabel = currentMarkerEl.querySelector('.marker-label');
                      if (currentIcon) currentIcon.style.opacity = '1';
                      if (currentLabel) currentLabel.style.opacity = '1';
                    } else {
                      currentMarkerEl.style.opacity = '1';
                    }
                  }
                  
                  setSelectedSpot(null);
                });
              }

              const addBtn = document.getElementById('add-to-itinerary-btn');
              if (addBtn && !isSpotInItinerary(spot.name)) {
                addBtn.addEventListener('click', () => addToItinerary(spot, addBtn));
              }

              const viewDetailsBtn = document.getElementById('view-details-btn');
              if (viewDetailsBtn) {
                viewDetailsBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  handleImageClick(spot.images[0], spot);
                });
              }
            }, 0);
            
            map.current.flyTo({
              center: spot.coordinates,
              zoom: Math.max(map.current.getZoom(), 12),
              padding: { top: 300, bottom: 50, left: 0, right: 0 },
              duration: 800
            });
          });

          markersRef.current.push(marker);
          console.log(`➕ Added marker: ${spot.name} (${spot.isPopular ? 'popular' : 'simple'})`);
        }
      } else if (isCurrentlyVisible) {
        // Remove marker if no longer in viewport
        const markerIndex = markersRef.current.findIndex(
          m => m.getLngLat().lng === spot.coordinates[0] && 
               m.getLngLat().lat === spot.coordinates[1]
        );
        
        if (markerIndex !== -1) {
          markersRef.current[markerIndex].remove();
          markersRef.current.splice(markerIndex, 1);
          markerElementsRef.current.delete(spot.name);
          console.log(`➖ Removed marker: ${spot.name}`);
        }
      }
    });
    
    visibleMarkersRef.current = currentVisibleSpots;
    console.log(`📍 Visible markers: ${currentVisibleSpots.size} / ${touristSpots.length}`);
  }, [touristSpots, isSpotInViewport, createMarkerElement, createInfoCardHTML, handleImageClick, addToItinerary, isSpotInItinerary]);

  // Initialize map ONCE
  useEffect(() => {
    if (map.current) return;

    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    const bounds = [[123.5, 12.8], [125.0, 14.8]];

    console.log('🌍 Initializing map');

    fetch(`https://api.maptiler.com/maps/toner-v2/style.json?key=${MAPTILER_API_KEY}`)
      .then(response => response.json())
      .then(style => {
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: style,
          center: [124.2, 13.8],
          zoom: DEFAULT_ZOOM,
          attributionControl: false,
          maxBounds: bounds,
          antialias: false,
          fadeDuration: 0
        });

        map.current.on('zoom', () => updateMarkerSizes(map.current.getZoom()));

        // Update markers on move
        map.current.on('moveend', updateVisibleMarkers);
        map.current.on('zoomend', updateVisibleMarkers);

        map.current.on('load', () => {
          console.log('✅ Map loaded');
          mapLoaded.current = true;
          
          // Add mask ONLY ONCE
          if (!map.current.getSource('mask')) {
            map.current.addSource('mask', {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [
                    [[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]],
                    [[124.011, 13.35], [124.011, 14.15], [124.45, 14.15], [124.45, 13.35], [124.011, 13.35]]
                  ]
                }
              }
            });

            map.current.addLayer({
              id: 'mask-layer',
              type: 'fill',
              source: 'mask',
              paint: { 'fill-color': '#000000', 'fill-opacity': 1 }
            });
            
            console.log('✅ Mask added');
          }

          // Initial marker update
          if (dataLoaded && touristSpots.length > 0) {
            console.log('🎯 Data ready, updating markers');
            setTimeout(() => updateVisibleMarkers(), 200);
          }
        });
      })
      .catch(error => {
        console.error('❌ Map init error:', error);
      });

    return () => {
      if (popupRef.current) popupRef.current.remove();
      markersRef.current.forEach(marker => marker.remove());
      if (map.current) {
        map.current.remove();
        map.current = null;
        mapLoaded.current = false;
      }
    };
  }, [updateMarkerSizes, updateVisibleMarkers, dataLoaded, touristSpots]);

  // Update markers when data loads
  useEffect(() => {
    if (mapLoaded.current && dataLoaded && touristSpots.length > 0) {
      console.log('🎯 Data loaded, updating visible markers');
      const timer = setTimeout(() => {
        updateVisibleMarkers();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [dataLoaded, touristSpots, updateVisibleMarkers]);

  // Debounced resize handler
  const handleResize = useCallback(() => {
    if (!map.current) return;
    
    if (resizeTimeout.current) clearTimeout(resizeTimeout.current);

    resizeTimeout.current = setTimeout(() => {
      if (map.current) {
        map.current.resize();
        map.current.jumpTo({ center: savedState.current.center, zoom: savedState.current.zoom });
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (map.current) previousZoom.current = map.current.getZoom();
    if (animationTimeout.current) clearTimeout(animationTimeout.current);
    animationTimeout.current = setTimeout(handleResize, 750);
    return () => clearTimeout(animationTimeout.current);
  }, [isFullscreen, handleResize]);

  const handleToggleFullscreen = useCallback(() => {
    if (onToggleFullscreen) onToggleFullscreen();
  }, [onToggleFullscreen]);

  // Get platform for video
  const getVideoPlatform = (index) => {
    if (index === 1) return 'youtube';
    return 'facebook';
  };

  // Video card component
  const VideoCard = ({ index, isLoaded }) => {
    const platform = getVideoPlatform(index);
    const platformConfig = PLATFORMS[platform];
    const isLandscape = platform === 'youtube';

    return (
      <div
        ref={(el) => (videoRefs.current[index] = el)}
        data-video-index={index}
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          scrollSnapAlign: 'start'
        }}
      >
        <div style={{ width: isLandscape ? '500px' : '300px', height: '85vh', maxHeight: isLandscape ? '400px' : '600px', backgroundColor: '#000', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', overflow: 'hidden', position: 'relative' }}>
          {!isLoaded ? (
            <VideoSkeleton />
          ) : platform === 'youtube' ? (
            <iframe 
              ref={(el) => (iframeRefs.current[index] = el)}
              width="100%" height="100%" 
              src="https://www.youtube.com/embed/j6IsY1PR5XE?enablejsapi=1&autoplay=1&mute=1" 
              frameBorder="0" allowFullScreen
              style={{ border: 'none', borderRadius: '16px' }}
            />
          ) : (
            <iframe 
              ref={(el) => (iframeRefs.current[index] = el)}
              src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F3233230416819996%2F&show_text=false&width=267&autoplay=true" 
              width="267" height="476" 
              frameBorder="0" allowFullScreen
              style={{ border: 'none', borderRadius: '8px' }}
            />
          )}
          {modalSpot && isLoaded && (
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                {modalSpot.location}
              </p>
              <div style={{ padding: '6px 14px', borderRadius: '20px', backgroundColor: platformConfig.color, color: platformConfig.textColor, fontSize: '12px', fontWeight: '600' }}>
                {platformConfig.name}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Modal content
  const ModalContent = () => (
    <div onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9998, display: 'flex' }}>
      <PerformanceMonitor show={showPerformance} />
      <div onClick={(e) => e.stopPropagation()} style={{ width: sidebarOpen ? `calc(100vw - ${SIDEBAR_WIDTH}px)` : '100vw', height: '100vh', overflowY: 'scroll', scrollSnapType: 'y mandatory', scrollbarWidth: 'none' }} className="video-scroll-container">
        {[0, 1, 2].map((index) => (
          <VideoCard key={index} index={index} isLoaded={loadedVideos.has(index)} />
        ))}
      </div>
      {sidebarOpen && <div style={{ width: `${SIDEBAR_WIDTH}px`, height: '100vh' }} />}
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {modalOpen && createPortal(<ModalContent />, document.body)}
      {createPortal(<PlaceDetailsSidebar place={sidebarPlace} isOpen={sidebarOpen} onClose={closeSidebar} onCloseModal={closeModal} />, document.body)}

      {activeView === 'map' && (
        <button onClick={handleToggleFullscreen} style={{ position: 'absolute', top: '12px', left: '12px', width: '36px', height: '36px', borderRadius: '4px', backgroundColor: 'white', border: 'none', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          {isFullscreen ? <Minimize color="black" size={18} /> : <Maximize color="black" size={18} />}
        </button>
      )}

      <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10, display: 'flex', backgroundColor: 'white', borderRadius: '16px', padding: '3px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', gap: '3px' }}>
        <button onClick={() => setActiveView('map')} style={{ padding: '6px 10px', border: 'none', borderRadius: '13px', backgroundColor: activeView === 'map' ? '#1f2937' : 'transparent', color: activeView === 'map' ? 'white' : '#6b7280', cursor: 'pointer' }}>
          <MapIcon size={16} />
        </button>
        <button onClick={() => setActiveView('itinerary')} style={{ padding: '6px 10px', border: 'none', borderRadius: '13px', backgroundColor: activeView === 'itinerary' ? '#1f2937' : 'transparent', color: activeView === 'itinerary' ? 'white' : '#6b7280', cursor: 'pointer' }}>
          <List size={16} />
        </button>
      </div>

      <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', display: activeView === 'map' ? 'block' : 'none' }} />

      {activeView === 'itinerary' && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '16px', backgroundColor: 'white', overflow: 'hidden' }}>
          <ItineraryView itinerary={itinerary} onRemoveItem={removeFromItinerary} onCardClick={handleCardClick} />
        </div>
      )}

      <style>
        {`
          .maplibregl-popup-content { padding: 0 !important; background: transparent !important; box-shadow: none !important; }
          .maplibregl-popup-tip { display: none !important; }
          .video-scroll-container::-webkit-scrollbar { display: none; }
        `}
      </style>
    </div>
  );
});

export default MapView;