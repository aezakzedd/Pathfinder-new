import { useEffect, useRef, useCallback, memo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Maximize, Minimize, Map as MapIcon, List, X, Heart, Navigation, Share2, ChevronUp } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { selectedSpots, categoryColors, toSentenceCase } from '../data/selectedTouristSpots';

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const DEFAULT_ZOOM = 9;

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

// Category icon mapping
const CATEGORY_ICONS = {
  'BEACHES': '🏖️',
  'BEACH': '🏖️',
  'WATERFALLS': '💧',
  'WATERFALL': '💧',
  'MOUNTAINS': '🏔️',
  'MOUNTAIN': '🏔️',
  'HIKING': '🥾',
  'CAVES': '🕳️',
  'CAVE': '🕳️',
  'VIEWPOINTS': '🌅',
  'VIEWPOINT': '🌅',
  'HISTORICAL': '🏛️',
  'CULTURAL': '🎭',
  'NATURE': '🌿',
  'ADVENTURE': '⛰️',
  'PHOTOGRAPHY': '📸',
  'SUNSET': '🌇',
  'SUNRISE': '🌄',
  'default': '📍'
};

// Helper function to get asset paths
const getAssetPath = (spotName, filename) => {
  const folderName = spotName.replace(/ /g, '_');
  return `/src/assets/${folderName}/${filename}`;
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
        borderTopColor: '#84cc16',
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
        color: '#84cc16',
        padding: '12px 16px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 10002,
        minWidth: '150px',
        border: '1px solid rgba(132, 204, 22, 0.3)'
      }}
    >
      <div style={{ marginBottom: '4px', fontWeight: 'bold', color: 'white' }}>Performance</div>
      <div>FPS: <span style={{ color: fps < 30 ? '#ef4444' : fps < 50 ? '#f59e0b' : '#84cc16' }}>{fps}</span></div>
      {memory > 0 && <div>Memory: {memory} MB</div>}
    </div>
  );
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalSpot, setModalSpot] = useState(null);

  // Video optimization states
  const [loadedVideos, setLoadedVideos] = useState(new Set([0]));
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);
  const iframeRefs = useRef([]);
  const observerRef = useRef(null);

  // New UI states
  const [savedSpots, setSavedSpots] = useState(new Set());
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const lastTapTime = useRef(0);

  // Performance monitoring
  const [showPerformance, setShowPerformance] = useState(false);

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

  // Video queue system
  const updateVideoQueue = useCallback((centerIndex) => {
    const videoCount = 3;
    const newQueue = new Set();

    newQueue.add(centerIndex);

    if (centerIndex > 0) {
      newQueue.add(centerIndex - 1);
    }

    if (centerIndex < videoCount - 1) {
      newQueue.add(centerIndex + 1);
    }

    setLoadedVideos(newQueue);
    setCurrentVideoIndex(centerIndex);

    console.log('📹 Video Queue Update:', {
      current: centerIndex,
      loaded: Array.from(newQueue)
    });
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
            console.log(`👁️ Video ${index} is now visible - Playing`);
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
            console.log(`👁️ Video ${index} left view - Pausing`);
            
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

  // Load GeoJSON data
  useEffect(() => {
    const loadTouristSpots = async () => {
      console.log('Starting to load tourist spots...');
      const spots = [];
      
      for (const selection of selectedSpots) {
        try {
          const response = await fetch(`/data/${selection.geojsonFile}`);
          
          if (!response.ok) {
            console.error(`Failed to fetch ${selection.geojsonFile}: ${response.status}`);
            continue;
          }
          
          const geojson = await response.json();
          const feature = geojson.features.find(
            f => f.properties.name === selection.spotName
          );
          
          if (feature) {
            let images = [];
            if (feature.properties.name === 'Binurong Point') {
              images = [
                getAssetPath('Binurong Point', 'Binurong_Point1.jpg'),
                getAssetPath('Binurong Point', 'Binurong_Point2.jpg')
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
      setSavedSpots(prev => new Set([...prev, spot.name]));
      console.log('Added to itinerary:', spot.name);
    }
  };

  // Handle image click to open modal
  const handleImageClick = (image, spot) => {
    setModalImage(image);
    setModalSpot(spot);
    setModalOpen(true);
    setLoadedVideos(new Set([0]));
    setCurrentVideoIndex(0);
    setDetailsExpanded(false);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
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
      setLoadedVideos(new Set([0]));
      setCurrentVideoIndex(0);
      setDetailsExpanded(false);
    }, 300);
  };

  // Calculate marker scale
  const getMarkerScale = (zoom) => {
    const baseZoom = 9;
    const scale = Math.max(0.5, 1 - (zoom - baseZoom) * 0.1);
    return scale;
  };

  // Update marker sizes
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

  // Create info card HTML
  const createInfoCardHTML = (spot) => {
    const categoryHTML = spot.categories
      .slice(0, 2)
      .map(cat => getCategoryPill(cat))
      .join('');

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
    `;
  };

  // Add tourist spot markers
  const addTouristSpotMarkers = useCallback(() => {
    if (!map.current || !mapLoaded.current || touristSpots.length === 0) {
      return;
    }

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const currentZoom = map.current.getZoom();
    const scale = getMarkerScale(currentZoom);

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
          let currentIdx = 0;
          const images = document.querySelectorAll('.carousel-image');
          const totalImages = images.length;
          const counter = document.getElementById('image-counter');
          const prevBtn = document.getElementById('carousel-prev-btn');
          const nextBtn = document.getElementById('carousel-next-btn');

          function showImage(index) {
            images.forEach((img, i) => {
              img.style.opacity = i === index ? '1' : '0';
            });
            if (counter) {
              counter.textContent = `${index + 1} / ${totalImages}`;
            }
          }

          images.forEach((img) => {
            img.addEventListener('click', (e) => {
              const imageUrl = e.target.getAttribute('data-image-url');
              handleImageClick(imageUrl, spot);
            });
          });

          if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              currentIdx = (currentIdx - 1 + totalImages) % totalImages;
              showImage(currentIdx);
            });
            prevBtn.addEventListener('mouseenter', () => {
              prevBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            });
            prevBtn.addEventListener('mouseleave', () => {
              prevBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            });
          }

          if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              currentIdx = (currentIdx + 1) % totalImages;
              showImage(currentIdx);
            });
            nextBtn.addEventListener('mouseenter', () => {
              nextBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            });
            nextBtn.addEventListener('mouseleave', () => {
              nextBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            });
          }

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
    });
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
          maxParallelImageRequests: 4,
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

          if (dataLoaded && touristSpots.length > 0) {
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

  useEffect(() => {
    if (mapLoaded.current && dataLoaded && touristSpots.length > 0) {
      const timer = setTimeout(() => {
        addTouristSpotMarkers();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [dataLoaded, touristSpots, addTouristSpotMarkers]);

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

  // Get platform for video
  const getVideoPlatform = (index) => {
    if (index === 1) return 'youtube';
    return 'facebook';
  };

  // Get category icon
  const getCategoryIcon = (categories) => {
    if (!categories || categories.length === 0) return CATEGORY_ICONS.default;
    const category = categories[0].toUpperCase();
    return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
  };

  // Handle double tap to save
  const handleDoubleTap = (spot) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      addToItinerary(spot);
      console.log('💚 Double tap - saved to itinerary!');
    }
    
    lastTapTime.current = now;
  };

  // Video card component
  const VideoCard = ({ index, isLoaded }) => {
    const platform = getVideoPlatform(index);
    const platformConfig = PLATFORMS[platform];
    const isLandscape = platform === 'youtube';
    const isSaved = modalSpot && savedSpots.has(modalSpot.name);

    return (
      <div
        ref={(el) => (videoRefs.current[index] = el)}
        data-video-index={index}
        onClick={() => modalSpot && handleDoubleTap(modalSpot)}
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          position: 'relative'
        }}
      >
        <div
          style={{
            width: isLandscape ? '500px' : '300px',
            height: '85vh',
            maxHeight: isLandscape ? '400px' : '600px',
            backgroundColor: '#000000',
            borderRadius: '16px',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Video iframe */}
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#000000'
            }}
          >
            {!isLoaded ? (
              <VideoSkeleton />
            ) : platform === 'youtube' ? (
              <iframe 
                ref={(el) => (iframeRefs.current[index] = el)}
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/j6IsY1PR5XE?si=9HeiBBjuU3Y_O63y&enablejsapi=1&autoplay=1&mute=1" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                style={{
                  border: 'none',
                  borderRadius: '16px',
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease-in forwards'
                }}
              />
            ) : (
              <iframe 
                ref={(el) => (iframeRefs.current[index] = el)}
                src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2F3233230416819996%2F&show_text=false&width=267&t=0&autoplay=true" 
                width="267" 
                height="476" 
                style={{
                  border: 'none',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  opacity: 0,
                  animation: 'fadeIn 0.5s ease-in forwards'
                }}
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            )}
          </div>
          
          {/* PRIORITY 1: Gradient overlay for text readability */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* PRIORITY 1: Video counter with dots */}
          {modalSpot && isLoaded && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                zIndex: 10
              }}
            >
              {[0, 1, 2].map((dotIndex) => (
                <div
                  key={dotIndex}
                  style={{
                    width: dotIndex === index ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: dotIndex === index ? '#84cc16' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                  }}
                />
              ))}
            </div>
          )}

          {/* PRIORITY 1: Weather widget (mock data) */}
          {modalSpot && isLoaded && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '8px 12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}
            >
              <span style={{ fontSize: '16px' }}>☀️</span>
              <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>28°C</span>
            </div>
          )}

          {/* Bottom info section */}
          {modalSpot && isLoaded && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* PRIORITY 2: Category icon tags */}
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}
              >
                {modalSpot.categories.slice(0, 3).map((cat, idx) => {
                  const icon = getCategoryIcon([cat]);
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>{icon}</span>
                      <span style={{
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}>
                        {cat.toLowerCase().replace('_', ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Location and platform row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '700',
                    color: 'white',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    marginBottom: '4px'
                  }}>
                    {modalSpot.name}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                  }}>
                    📍 {modalSpot.location}
                  </p>
                </div>

                {/* Platform pill */}
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    backgroundColor: platformConfig.color,
                    color: platformConfig.textColor,
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                    flexShrink: 0
                  }}
                >
                  {platformConfig.name}
                </div>
              </div>
            </div>
          )}

          {/* PRIORITY 1: Animated action buttons */}
          {modalSpot && isLoaded && (
            <div
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 10
              }}
            >
              {/* Save button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToItinerary(modalSpot);
                }}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: isSaved ? '#84cc16' : 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  animation: isSaved ? 'pulse 0.5s ease' : 'none'
                }}
              >
                <Heart 
                  size={24} 
                  color="white" 
                  fill={isSaved ? 'white' : 'none'}
                  strokeWidth={2}
                />
              </button>

              {/* Directions button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('🧭 Get directions to:', modalSpot.name);
                }}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <Navigation size={24} color="white" strokeWidth={2} />
              </button>

              {/* Share button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('📤 Share:', modalSpot.name);
                }}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <Share2 size={24} color="white" strokeWidth={2} />
              </button>
            </div>
          )}

          {/* PRIORITY 2: Swipe-up indicator for details */}
          {modalSpot && isLoaded && !detailsExpanded && (
            <button
              onClick={() => setDetailsExpanded(true)}
              style={{
                position: 'absolute',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 20px',
                borderRadius: '20px',
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                zIndex: 10,
                animation: 'bounce 2s infinite',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              Swipe up for details
              <ChevronUp size={16} />
            </button>
          )}
        </div>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.1); }
            }
            @keyframes bounce {
              0%, 100% { transform: translate(-50%, 0); }
              50% { transform: translate(-50%, -8px); }
            }
          `}
        </style>
      </div>
    );
  };

  // PRIORITY 2: Details drawer component
  const DetailsDrawer = () => {
    if (!modalSpot || !detailsExpanded) return null;

    return (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60vh',
          backgroundColor: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.3)',
          zIndex: 10003,
          animation: 'slideUp 0.3s ease',
          overflow: 'auto',
          padding: '24px'
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: '40px',
            height: '4px',
            backgroundColor: '#d1d5db',
            borderRadius: '2px',
            margin: '0 auto 20px',
            cursor: 'pointer'
          }}
          onClick={() => setDetailsExpanded(false)}
        />

        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: '700',
          color: '#111827'
        }}>
          {modalSpot.name}
        </h2>

        <p style={{
          margin: '0 0 16px 0',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          📍 {modalSpot.location}
        </p>

        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {modalSpot.categories.map((cat, idx) => {
            const icon = getCategoryIcon([cat]);
            const colors = categoryColors[cat.toUpperCase()] || categoryColors.default;
            return (
              <div
                key={idx}
                style={{
                  padding: '8px 16px',
                  borderRadius: '16px',
                  backgroundColor: colors.bg,
                  color: colors.text,
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{icon}</span>
                {cat.toLowerCase().replace('_', ' ')}
              </div>
            );
          })}
        </div>

        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px'
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Quick Info
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Best time to visit:</span>
              <strong style={{ color: '#111827' }}>Sunrise & Sunset 🌅</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Entry fee:</span>
              <strong style={{ color: '#111827' }}>Free 💚</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280' }}>Distance from Virac:</span>
              <strong style={{ color: '#111827' }}>~15 km 🚗</strong>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827'
          }}>
            About
          </h3>
          <p style={{
            margin: 0,
            color: '#4b5563',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {modalSpot.description || 'Binurong Point offers breathtaking views of the Pacific Ocean and stunning rock formations. This scenic viewpoint is perfect for photography enthusiasts and nature lovers, especially during golden hour when the sun paints the sky in vibrant colors.'}
          </p>
        </div>

        <style>
          {`
            @keyframes slideUp {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    );
  };

  // PRIORITY 2: Thumbnail strip navigation
  const ThumbnailStrip = () => {
    if (!modalSpot) return null;

    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          zIndex: 10002,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
        }}
      >
        {[0, 1, 2].map((thumbIndex) => {
          const platform = getVideoPlatform(thumbIndex);
          const isActive = thumbIndex === currentVideoIndex;
          
          return (
            <div
              key={thumbIndex}
              onClick={() => {
                const element = videoRefs.current[thumbIndex];
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              style={{
                width: isActive ? '60px' : '50px',
                height: isActive ? '60px' : '50px',
                borderRadius: '12px',
                backgroundColor: isActive ? '#84cc16' : 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: isActive ? '2px solid white' : '2px solid transparent',
                fontSize: '20px'
              }}
            >
              {platform === 'youtube' ? '📹' : '📱'}
            </div>
          );
        })}
      </div>
    );
  };

  // Modal content
  const ModalContent = () => (
    <div
      onClick={closeModal}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: modalOpen ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <PerformanceMonitor show={showPerformance} />

      {/* Close button */}
      <button
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          zIndex: 10001
        }}
      >
        <X color="white" size={24} strokeWidth={2.5} />
      </button>

      {/* Scrollable video container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100vw',
          height: '100vh',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {[0, 1, 2].map((index) => (
          <VideoCard 
            key={index} 
            index={index} 
            isLoaded={loadedVideos.has(index)}
          />
        ))}
      </div>

      {/* PRIORITY 2: Thumbnail strip */}
      <ThumbnailStrip />

      {/* PRIORITY 2: Details drawer */}
      <DetailsDrawer />
    </div>
  );

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }} 
    >
      {modalOpen && createPortal(<ModalContent />, document.body)}

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
            transition: 'all 0.5s ease-in-out'
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
            borderRadius: '16px',
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