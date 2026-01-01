import { Map } from 'lucide-react';
import FloatingCard from '../../components/FloatingCard';

export default function Explore() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden">
      {/* Map icon */}
      <div className="absolute z-20" style={{ top: '1.2vh', left: '1.2vw' }}>
        <Map color="white" size={28} strokeWidth={2} />
      </div>
      
      {/* Centered container for FloatingCard */}
      <div className="w-full h-full flex items-center justify-center">
        <FloatingCard />
      </div>
    </div>
  )
}
