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
              {/* White card that shrinks diagonally */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transformOrigin: 'bottom right',
                  transform: isMinimized 
                    ? 'scale(0.1)' 
                    : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {/* White card */}
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
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  {/* Your white card content goes here */}
                </div>
              </div>

              {/* Green chevron button - moves diagonally with constant size */}
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
                    ? 'translate(calc(-100% + 8px - 4px), calc(-100% + 8px - 4px))' 
                    : 'translate(0, 0)',
                  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
                  zIndex: 20,
                  boxShadow: isMinimized 
                    ? '0 4px 20px rgba(132, 204, 22, 0.6)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
                onMouseEnter={(e) => {
                  const currentTransform = isMinimized 
                    ? 'translate(calc(-100% + 8px - 4px), calc(-100% + 8px - 4px)) scale(1.1)'
                    : 'translate(0, 0) scale(1.1)';
                  e.currentTarget.style.transform = currentTransform;
                }}
                onMouseLeave={(e) => {
                  const currentTransform = isMinimized 
                    ? 'translate(calc(-100% + 8px - 4px), calc(-100% + 8px - 4px)) scale(1)'
                    : 'translate(0, 0) scale(1)';
                  e.currentTarget.style.transform = currentTransform;
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
