import { useState } from 'react';
import { Map, Wifi, ChevronDown } from 'lucide-react';
import FloatingCard from '../../components/FloatingCard';
import MapView from '../../components/MapView';

export default function Explore() {
  const [isMinimized, setIsMinimized] = useState(false);

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
          leftContent={null}
          rightContent={<MapView />}
          overlayContent={
            <div style={{ 
              width: '100%', 
              height: '100%', 
              position: 'relative'
            }}>
              {/* White overlay with shrink animation */}
              <div 
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  transformOrigin: 'bottom right',
                  transform: isMinimized ? 'scale(0)' : 'scale(1)',
                  opacity: isMinimized ? 0 : 1,
                  overflow: 'hidden',
                  pointerEvents: isMinimized ? 'none' : 'auto'
                }}
              >
                {/* Content can go here */}
              </div>

              {/* Green circle with chevron - always visible */}
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
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  zIndex: 10,
                  boxShadow: isMinimized ? '0 4px 12px rgba(132, 204, 22, 0.4)' : '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ChevronDown 
                  color="black" 
                  size={20} 
                  strokeWidth={3} 
                  style={{ 
                    transform: isMinimized ? 'rotate(-45deg)' : 'rotate(135deg)',
                    transition: 'transform 0.5s ease'
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
