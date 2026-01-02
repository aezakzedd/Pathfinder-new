export const touristSpots = [
  {
    id: 'binurong-point',
    name: 'Binurong Point',
    location: 'Viga, Catanduanes',
    coordinates: [124.41410535976011, 13.66633383393473], // [lng, lat]
    rating: 4.9,
    reviewCount: 127,
    // Multiple images for carousel
    images: [
      'binurong-point-1.jpg',
      'binurong-point-2.jpg',
      'binurong-point-3.jpg',
      'binurong-point-4.jpg'
    ],
    // Fallback single image for compatibility
    image: 'binurong-point-1.jpg',
    description: 'Breathtaking coastal cliff with panoramic ocean views. Known for its dramatic rock formations and stunning sunrise/sunset vistas.',
    category: 'Natural Wonder',
    entrance: 'Free',
    bestTime: 'Early morning or late afternoon',
    amenities: ['Viewing deck', 'Photo spots', 'Parking area'],
    tips: [
      'Wear comfortable shoes for walking',
      'Bring water and sunscreen',
      'Best visited during dry season',
      'Stunning for photography'
    ]
  }
  // Add more tourist spots here
];

// Helper function to get image URL from assets
export const getImageUrl = (imageName) => {
  try {
    return new URL(`../assets/images/tourist-spots/${imageName}`, import.meta.url).href;
  } catch (error) {
    console.error(`Failed to load image: ${imageName}`, error);
    return null;
  }
};
