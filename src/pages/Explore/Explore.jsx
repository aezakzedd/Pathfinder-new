import { Map } from 'lucide-react';
import FloatingCard from '../../components/FloatingCard';

export default function Explore() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center relative">
      {/* Map icon with more space from the floating card */}
      <div className="absolute z-20" style={{ top: '1.2vh', left: '1.2vw' }}>
        <Map color="white" size={40} strokeWidth={2} />
      </div>
      
      {/* Floating Card */}
      <FloatingCard />
    </div>
  )
}
