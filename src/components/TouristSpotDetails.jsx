import { MapPin, Star, Clock, DollarSign, Info } from 'lucide-react';
import ImageCarousel from './ImageCarousel';
import { getImageUrl } from '../data/touristSpots';

const TouristSpotDetails = ({ spot }) => {
  if (!spot) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        <p>Select a tourist spot to view details</p>
      </div>
    );
  }

  // Convert image names to URLs
  const imageUrls = spot.images?.map(img => getImageUrl(img)).filter(Boolean) || 
                    (spot.image ? [getImageUrl(spot.image)] : []);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 rounded-lg overflow-hidden">
      {/* Image Carousel - 60% height */}
      <div className="w-full" style={{ height: '60%' }}>
        <ImageCarousel images={imageUrls} alt={spot.name} />
      </div>

      {/* Details section - 40% height */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">{spot.name}</h2>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <MapPin size={16} />
            <span>{spot.location}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-lime-500 text-black px-2 py-1 rounded">
            <Star size={16} fill="currentColor" />
            <span className="font-bold">{spot.rating}</span>
          </div>
          <span className="text-gray-400 text-sm">({spot.reviewCount} reviews)</span>
        </div>

        {/* Category badge */}
        <div className="inline-block bg-gray-800 text-lime-400 px-3 py-1 rounded-full text-sm mb-4">
          {spot.category}
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-4 leading-relaxed">
          {spot.description}
        </p>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-lime-400 mb-1">
              <DollarSign size={16} />
              <span className="text-xs font-semibold">ENTRANCE</span>
            </div>
            <p className="text-white text-sm">{spot.entrance}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-lime-400 mb-1">
              <Clock size={16} />
              <span className="text-xs font-semibold">BEST TIME</span>
            </div>
            <p className="text-white text-sm">{spot.bestTime}</p>
          </div>
        </div>

        {/* Amenities */}
        {spot.amenities && spot.amenities.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lime-400 text-sm font-semibold mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {spot.amenities.map((amenity, index) => (
                <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        {spot.tips && spot.tips.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-lime-400 mb-2">
              <Info size={16} />
              <h3 className="text-sm font-semibold">Visitor Tips</h3>
            </div>
            <ul className="space-y-1">
              {spot.tips.map((tip, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-lime-400 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TouristSpotDetails;
