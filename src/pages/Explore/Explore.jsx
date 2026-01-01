export default function Explore() {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex items-center justify-center">
      <div 
        className="border-white rounded-3xl"
        style={{
          width: '90vw',
          height: '90vh',
          border: '4px solid white'
        }}
      >
        {/* Test visibility */}
        <div className="text-white p-4">Test</div>
      </div>
    </div>
  )
}
