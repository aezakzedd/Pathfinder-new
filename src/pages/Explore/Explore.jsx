import { Map } from 'lucide-react';
import FloatingCard from '../../components/FloatingCard';

export default function Explore() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center relative">
      {/* Map icon in the gap between screen edge and floating card */}
      <div className="absolute z-20" style={{ top: '2.5vh', left: '2.5vw' }}>
        <Map className="text-white" size={40} strokeWidth={2} />
      </div>
      
      {/* Floating Card */}
      <FloatingCard />
    </div>
  )
}
