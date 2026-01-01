export default function Explore() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-5xl font-bold">Explore</h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Discover amazing places and experiences
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Tourist Spots</h3>
            <p className="text-gray-400">Explore beautiful destinations</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Activities</h3>
            <p className="text-gray-400">Find exciting things to do</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg hover:bg-gray-800 transition cursor-pointer">
            <h3 className="text-xl font-semibold mb-2">Local Culture</h3>
            <p className="text-gray-400">Experience local traditions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
