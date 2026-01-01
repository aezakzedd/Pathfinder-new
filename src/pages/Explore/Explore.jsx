import { Map } from 'lucide-react';

export default function Explore() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center relative">
      {/* Map icon in top left corner */}
      <div className="absolute top-8 left-8 z-10">
        <Map className="text-white" size={40} strokeWidth={2} />
      </div>
      
      {/* Empty rectangle */}
      <div 
        style={{
          width: '90vw',
          height: '90vh',
          border: '1px solid white',
          borderRadius: '24px'
        }}
      />
    </div>
  )
}
