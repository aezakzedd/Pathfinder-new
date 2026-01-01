import { Map } from 'lucide-react';

export default function Explore() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {/* Map icon in top left corner - outside the rectangle */}
      <div className="absolute top-8 left-8 z-10">
        <Map className="text-white" size={40} strokeWidth={2} />
      </div>
      
      {/* Rectangle container */}
      <div className="w-full h-full flex items-center justify-center">
        <div 
          className="flex items-center justify-center"
          style={{
            width: '90vw',
            height: '90vh',
            border: '1px solid white',
            borderRadius: '24px'
          }}
        >
          <h1 className="text-white text-6xl font-bold">Pathfinder</h1>
        </div>
      </div>
    </div>
  )
}
