import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Map, ChevronDown } from 'lucide-react';
import FloatingCard from '../components/FloatingCard';
import MapView from '../components/MapView';
import ChatBot from '../components/ChatBot';
import TravellerInformation from '../components/TravellerInformation';
import NetworkStatus from '../components/NetworkStatus';
import TouristSpotDetails from '../components/TouristSpotDetails';

export default function Explore() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [translateValues, setTranslateValues] = useState({ x: 0, y: 0 });
  const resizeTimeoutRef = useRef(null);
  const [selectedSpot, setSelectedSpot] = useState(null); // Changed from touristSpots[0] to null

  // Memoized calculate function to prevent recreation
  const calculateTranslateValues = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      
      // Calculate distance from bottom-right (4px, 4px) to top-left (4px, 4px)
      const translateX = -(width - 40 - 8);
      const translateY = -(height - 40 - 8);
      
      setTranslateValues({ x: translateX, y: translateY });
    }
  }, []);

  // Debounced resize handler for better performance
  const handleResize = useCallback(() => {
    // Clear existing timeout
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    // Debounce resize calculation to avoid excessive calls
    resizeTimeoutRef.current = setTimeout(() => {
      calculateTranslateValues();
    }, 150);
  }, [calculateTranslateValues]);

  useEffect(() => {
    // Calculate on mount
    calculateTranslateValues();

    // Add debounced resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [calculateTranslateValues, handleResize]);

  // Memoized toggle handlers to prevent recreation
  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const toggleMapFullscreen = useCallback(() => {
    setIsMapFullscreen(prev => !prev);
  }, []);

  // Memoize styles to prevent recreation on every render
  const containerStyle = useMemo(() => ({
    width: '90vw',
    height: '90vh',
    border: '1px solid white',
    borderRadius: '24px',
    backgroundColor: 'transparent',
    display: 'flex',
    gap: '24px',
    padding: '24px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden'
  }), []);

  // Updated to account for 24px gap
  const leftContainerStyle = useMemo(() => ({
    width: 'calc((100% - 24px) / 2)',
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  }), []);

  const leftContentStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    borderRadius: '16px',
    padding: '16px',
    boxSizing: 'border-box'
  }), []);

  const overlayContainerStyle = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: isMinimized ? 'none' : 'auto'
  }), [isMinimized]);

  const whiteCardTransformStyle = useMemo(() => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transformOrigin: 'bottom right',
    transform: isMinimized 
      ? `translate(${translateValues.x}px, ${translateValues.y}px) scale(0.1)` 
      : 'translate(0, 0) scale(1)',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: isMinimized ? 'none' : 'auto',
    willChange: 'transform'
  }), [isMinimized, translateValues.x, translateValues.y]);

  const whiteCardBackgroundStyle = useMemo(() => ({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: '#434141', // Darker grey background
    borderRadius: '16px',
    padding: '16px',
    boxSizing: 'border-box',
    opacity: isMinimized ? 0 : 1,
    transition: 'opacity 0.4s ease',
    willChange: 'opacity',
    overflow: 'hidden'
  }), [isMinimized]);

  const buttonStyle = useMemo(() => ({
    position: 'absolute',
    bottom: '4px',
    right: '4px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#84cc16',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transform: isMinimized 
      ? `translate(${translateValues.x}px, ${translateValues.y}px)` 
      : 'translate(0, 0)',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
    zIndex: 20,
    pointerEvents: 'auto',
    boxShadow: isMinimized 
      ? '0 4px 20px rgba(132, 204, 22, 0.6)' 
      : '0 2px 8px rgba(0, 0, 0, 0.15)',
    willChange: 'transform, box-shadow'
  }), [isMinimized, translateValues.x, translateValues.y]);

  const chevronStyle = useMemo(() => ({
    transform: isMinimized ? 'rotate(-45deg)' : 'rotate(135deg)',
    transition: 'transform 0.6s ease',
    willChange: 'transform'
  }), [isMinimized]);

  // Right container that holds both the white container and map overlay
  const rightContainerStyle = useMemo(() => ({
    width: 'calc((100% - 24px) / 2)',
    height: '100%',
    position: 'relative'
  }), []);

  // White container underneath the map - now with TouristSpotDetails
  const whiteUnderContainerStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: '#1f2937', // Match TouristSpotDetails background
    borderRadius: '16px',
    padding: '0', // No padding, let TouristSpotDetails handle it
    boxSizing: 'border-box',
    overflow: 'hidden'
  }), []);

  // Map container - properly sized to cover full parent content area when fullscreen
  const mapContainerStyle = useMemo(() => ({
    position: 'absolute',
    top: isMapFullscreen ? '0' : '0',
    right: isMapFullscreen ? '0' : '0',
    bottom: isMapFullscreen ? '0' : '0',
    // When fullscreen: width = 2x child containers + gap = full parent content width
    width: isMapFullscreen ? 'calc(200% + 24px)' : '100%',
    // When fullscreen: move left by (right container width + gap)
    left: isMapFullscreen ? 'calc(-100% - 24px)' : '0',
    borderRadius: isMapFullscreen ? '16px' : '16px',
    overflow: 'hidden',
    transition: 'all 0.5s ease-in-out',
    zIndex: isMapFullscreen ? 30 : 1
  }), [isMapFullscreen]);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* Map icon - top left */}
      <div className="absolute z-20" style={{ top: '1.2vh', left: '1.2vw' }}>
        <Map color="white" size={28} strokeWidth={2} />
      </div>
      
      {/* Network status - top right */}
      <div className="absolute z-20" style={{ top: '1.2vh', right: '1.2vw' }}>
        <NetworkStatus />
      </div>
      
      {/* Centered container for FloatingCard */}
      <div className="w-full h-full flex items-center justify-center">
        <div style={containerStyle}>
          {/* Left container with ChatBot in black background */}
          <div style={leftContainerStyle}>
            <div style={leftContentStyle}>
              <ChatBot />
            </div>
            
            {/* Overlay for grey card with TravellerInformation */}
            <div ref={containerRef} style={overlayContainerStyle}>
              {/* Grey card that shrinks following button path */}
              <div style={whiteCardTransformStyle}>
                {/* Grey card background with TravellerInformation */}
                <div style={whiteCardBackgroundStyle}>
                  <TravellerInformation />
                </div>
              </div>

              {/* Green chevron button - moves diagonally, constant size */}
              <div onClick={toggleMinimize} style={buttonStyle}>
                <ChevronDown 
                  color="black" 
                  size={20} 
                  strokeWidth={3} 
                  style={chevronStyle}
                />
              </div>
            </div>
          </div>
          
          {/* Right container with TouristSpotDetails underneath map */}
          <div style={rightContainerStyle}>
            {/* TouristSpotDetails with image carousel - only shows when spot selected */}
            <div style={whiteUnderContainerStyle}>
              <TouristSpotDetails spot={selectedSpot} />
            </div>
            
            {/* Map container - covers full parent width when fullscreen */}
            <div style={mapContainerStyle}>
              <MapView 
                isFullscreen={isMapFullscreen}
                onToggleFullscreen={toggleMapFullscreen}
                onSpotSelect={setSelectedSpot}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
