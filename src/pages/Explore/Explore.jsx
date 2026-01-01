import { Map } from 'lucide-react';
import FloatingCard from '../../components/FloatingCard';

export default function Explore() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center relative">
      {/* Map icon positioned outside the floating card */}
      <div className="absolute top-8 left-8 z-20">
        <Map className="text-white" size={40} strokeWidth={2} />
      </div>
      
      {/* Floating Card */}
      <FloatingCard />
    </div>
  )
}
