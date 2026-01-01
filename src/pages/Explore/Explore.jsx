import { Map } from 'lucide-react';

export default function Explore() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {/* Map icon in top left corner - with test background */}
      <div 
        className="absolute z-50"
        style={{
          top: '32px',
          left: '32px',
          backgroundColor: 'red', // Test background to see if it's there
          padding: '8px'
        }}
      >
        <Map color="white" size={48} strokeWidth={2.5} />
      </div>
      
      {/* Rectangle container */}
      <div className="w-full h-full flex items-center justify-center">
        <div 
          style={{
            width: '90vw',
            height: '90vh',
            border: '1px solid white',
            borderRadius: '24px'
          }}
        />
      </div>
    </div>
  )
}
