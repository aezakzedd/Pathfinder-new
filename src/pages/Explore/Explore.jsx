import { Map, Wifi, ChevronDown } from 'lucide-react';
import FloatingCard from '../../components/FloatingCard';
import MapView from '../../components/MapView';

export default function Explore() {
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
              {/* Green circle with chevron - bottom right */}
              <div style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#84cc16',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <ChevronDown 
                  color="black" 
                  size={20} 
                  strokeWidth={3} 
                  style={{ transform: 'rotate(135deg)' }}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  )
}
