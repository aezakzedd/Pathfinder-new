import { useState, useRef, useEffect } from 'react';
import { Map, Wifi, ChevronDown } from 'lucide-react';
import FloatingCard from '../../components/FloatingCard';
import MapView from '../../components/MapView';
import ChatBot from '../../components/ChatBot';

export default function Explore() {
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef(null);
  const [translateValues, setTranslateValues] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      
      // Calculate distance from bottom-right (4px, 4px) to top-left (4px, 4px)
      // Button is 40px, so we need to account for that
      const translateX = -(width - 40 - 8);
      const translateY = -(height - 40 - 8);
      
      setTranslateValues({ x: translateX, y: translateY });
    }
  }, []);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* Map icon - top left */}
      <div className="absolute z-20" style={{ top: '1.2vh', left: '1.2vw' }}>
        <Map color="white" size={28} strokeWidth={2} />
      </div>
      
      {/* Online icon - top right */}
      <div className="absolute z-20" style={{ top: '1.2vh', right: '1.2vw' }}>
        <Wifi color="white" size={28} strokeWidth={2} />
      </div>
      
      {/* Centered container for FloatingCard */}
      <div className="w-full h-full flex items-center justify-center">
        <FloatingCard 
          leftContent={<ChatBot />}
          rightContent={<MapView />}
          overlayContent={
            <div 
              ref={containerRef}
              style={{ 
                width: '100%', 
                height: '100%', 
                position: 'relative',
                pointerEvents: isMinimized ? 'none' : 'auto'
              }}
            >
              {/* White card that shrinks following button path */}
              <div
                style={{
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
                  pointerEvents: isMinimized ? 'none' : 'auto'
                }}
              >
                {/* White card background */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '16px',
                    boxSizing: 'border-box',
                    opacity: isMinimized ? 0 : 1,
                    transition: 'opacity 0.4s ease',
                  }}
                >
                  {/* Your white card content goes here */}
                </div>
              </div>

              {/* Green chevron button - moves diagonally, constant size */}
              <div 
                onClick={toggleMinimize}
                style={{
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
                    : '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                <ChevronDown 
                  color="black" 
                  size={20} 
                  strokeWidth={3} 
                  style={{ 
                    transform: isMinimized ? 'rotate(-45deg)' : 'rotate(135deg)',
                    transition: 'transform 0.6s ease'
                  }}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
