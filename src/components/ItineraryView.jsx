import React from 'react';
import { 
  MapPin, 
  Church, 
  Waves, 
  Mountain, 
  Trees, 
  Bed, 
  UtensilsCrossed, 
  Coffee, 
  Building2, 
  Landmark,
  Sun,
  Palmtree,
  Compass,
  Beer
} from 'lucide-react';

// Category icon mapping
const getCategoryIcon = (categories) => {
  if (!categories || categories.length === 0) {
    return <MapPin size={20} strokeWidth={2.5} />;
  }

  const category = categories[0]?.toUpperCase();
  
  const iconMap = {
    RELIGIOUS_SITE: <Church size={20} strokeWidth={2.5} />,
    BEACH: <Waves size={20} strokeWidth={2.5} />,
    WATERFALL: <Waves size={20} strokeWidth={2.5} />,
    VIEWPOINT: <Mountain size={20} strokeWidth={2.5} />,
    NATURE: <Trees size={20} strokeWidth={2.5} />,
    ECO_PARK: <Trees size={20} strokeWidth={2.5} />,
    PARK: <Trees size={20} strokeWidth={2.5} />,
    ACCOMMODATION: <Bed size={20} strokeWidth={2.5} />,
    RESORT: <Palmtree size={20} strokeWidth={2.5} />,
    RESTAURANT: <UtensilsCrossed size={20} strokeWidth={2.5} />,
    CAFE: <Coffee size={20} strokeWidth={2.5} />,
    MUSEUM: <Building2 size={20} strokeWidth={2.5} />,
    HERITAGE: <Landmark size={20} strokeWidth={2.5} />,
    LANDMARK: <Landmark size={20} strokeWidth={2.5} />,
    SURFING: <Waves size={20} strokeWidth={2.5} />,
    HIKING: <Mountain size={20} strokeWidth={2.5} />,
    ISLAND: <Palmtree size={20} strokeWidth={2.5} />,
    BAR: <Beer size={20} strokeWidth={2.5} />
  };

  return iconMap[category] || <MapPin size={20} strokeWidth={2.5} />;
};

// Category colors
const categoryColors = {
  BEACH: { bg: '#dbeafe', text: '#1e40af' },
  WATERFALL: { bg: '#d1fae5', text: '#065f46' },
  VIEWPOINT: { bg: '#fce7f3', text: '#9f1239' },
  NATURE: { bg: '#dcfce7', text: '#14532d' },
  ACCOMMODATION: { bg: '#fef3c7', text: '#92400e' },
  RESORT: { bg: '#fed7aa', text: '#9a3412' },
  CAFE: { bg: '#e0e7ff', text: '#3730a3' },
  RESTAURANT: { bg: '#fecaca', text: '#991b1b' },
  MUSEUM: { bg: '#e9d5ff', text: '#6b21a8' },
  HERITAGE: { bg: '#f3e8ff', text: '#581c87' },
  RELIGIOUS_SITE: { bg: '#ddd6fe', text: '#4c1d95' },
  SURFING: { bg: '#bfdbfe', text: '#1e3a8a' },
  LANDMARK: { bg: '#fbbf24', text: '#78350f' },
  ECO_PARK: { bg: '#86efac', text: '#14532d' },
  HIKING: { bg: '#fdba74', text: '#7c2d12' },
  ISLAND: { bg: '#99f6e4', text: '#134e4a' },
  BAR: { bg: '#fca5a5', text: '#7f1d1d' },
  PARK: { bg: '#bef264', text: '#3f6212' },
  default: { bg: '#f3f4f6', text: '#1f2937' }
};

const getCategoryPill = (category) => {
  const colors = categoryColors[category] || categoryColors.default;
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '12px',
        backgroundColor: colors.bg,
        color: colors.text,
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'capitalize',
        marginRight: '6px'
      }}
    >
      {category.toLowerCase().replace('_', ' ')}
    </span>
  );
};

const ItineraryView = ({ itinerary, onRemoveItem }) => {
  if (itinerary.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '40px 20px',
          color: '#9ca3af'
        }}
      >
        <MapPin size={48} strokeWidth={1.5} style={{ marginBottom: '16px', opacity: 0.5 }} />
        <p style={{ fontSize: '16px', fontWeight: '600', margin: 0, marginBottom: '8px' }}>No places added yet</p>
        <p style={{ fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '300px' }}>
          Click "Add to Itinerary" on any tourist spot to start building your trip
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#f9fafb',
        padding: '20px'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
            My Itinerary
          </h2>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
          {itinerary.length} {itinerary.length === 1 ? 'place' : 'places'} added
        </p>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {itinerary.map((place, index) => {
          const isLast = index === itinerary.length - 1;
          const primaryCategory = place.categories?.[0] || 'default';
          const colors = categoryColors[primaryCategory] || categoryColors.default;

          return (
            <div
              key={`${place.name}-${index}`}
              style={{
                position: 'relative',
                paddingLeft: '60px',
                paddingBottom: isLast ? '0' : '24px'
              }}
            >
              {/* Vertical line */}
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    left: '23px',
                    top: '48px',
                    bottom: '0',
                    width: '2px',
                    backgroundColor: '#e5e7eb'
                  }}
                />
              )}

              {/* Icon circle */}
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '16px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: colors.bg,
                  color: colors.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `3px solid white`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 1
                }}
              >
                {getCategoryIcon(place.categories)}
              </div>

              {/* Card */}
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div style={{ display: 'flex' }}>
                  {/* Image */}
                  {place.images && place.images.length > 0 ? (
                    <img
                      src={place.images[0]}
                      alt={place.name}
                      style={{
                        width: '140px',
                        height: '140px',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '140px',
                        height: '140px',
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <MapPin size={32} color="#9ca3af" strokeWidth={1.5} />
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
                    {/* Title */}
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '8px'
                      }}
                    >
                      {place.name}
                    </h3>

                    {/* Location */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <MapPin size={14} color="#6b7280" strokeWidth={2} />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{place.location}</span>
                    </div>

                    {/* Categories */}
                    {place.categories && place.categories.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {place.categories.slice(0, 2).map((cat, idx) => (
                          <React.Fragment key={idx}>{getCategoryPill(cat)}</React.Fragment>
                        ))}
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onRemoveItem) onRemoveItem(index);
                      }}
                      style={{
                        marginTop: 'auto',
                        alignSelf: 'flex-start',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#ef4444',
                        backgroundColor: 'transparent',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#fef2f2';
                        e.currentTarget.style.borderColor = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#fecaca';
                      }}
                    >
                      Remove
                    </button>
                  </div>

                  {/* Three-dot menu */}
                  <div
                    style={{
                      padding: '12px',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#4b5563';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af';
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryView;
