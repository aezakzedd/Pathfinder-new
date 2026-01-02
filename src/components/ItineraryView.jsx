import React, { useState } from 'react';
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
  Palmtree,
  Beer,
  ChevronDown,
  ChevronUp,
  MoreVertical
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

const ItineraryView = ({ itinerary, onRemoveItem }) => {
  const [expandedDates, setExpandedDates] = useState({ 'Feb 01, Sun': true });

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
          color: '#9ca3af',
          backgroundColor: 'white'
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

  const toggleDate = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Group itinerary by date (for now, all go to same date)
  const dateGroup = 'Feb 01, Sun';
  const isExpanded = expandedDates[dateGroup];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: 'white'
      }}
    >
      {/* Date Section */}
      <div style={{ borderBottom: '1px solid #e5e7eb' }}>
        {/* Date Header - Collapsible */}
        <button
          onClick={() => toggleDate(dateGroup)}
          style={{
            width: '100%',
            padding: '16px 20px',
            backgroundColor: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isExpanded ? (
              <ChevronDown size={20} color="#111827" strokeWidth={2} />
            ) : (
              <ChevronUp size={20} color="#111827" strokeWidth={2} />
            )}
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827' }}>
              {dateGroup}
            </h2>
          </div>
        </button>

        {/* Places List with Timeline */}
        {isExpanded && (
          <div style={{ padding: '0 20px 20px 20px' }}>
            {itinerary.map((place, index) => {
              const isLast = index === itinerary.length - 1;
              const primaryCategory = place.categories?.[0] || 'default';
              const colors = categoryColors[primaryCategory] || categoryColors.default;

              return (
                <div
                  key={`${place.name}-${index}`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    gap: '12px',
                    paddingBottom: isLast ? '0' : '16px'
                  }}
                >
                  {/* Timeline - Icon with vertical line */}
                  <div
                    style={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      paddingTop: '12px'
                    }}
                  >
                    {/* Icon circle */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: colors.bg,
                        color: colors.text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        flexShrink: 0,
                        zIndex: 1
                      }}
                    >
                      {getCategoryIcon(place.categories)}
                    </div>

                    {/* Vertical connecting line */}
                    {!isLast && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          backgroundColor: '#e5e7eb',
                          marginTop: '4px',
                          minHeight: '40px'
                        }}
                      />
                    )}
                  </div>

                  {/* Place Card */}
                  <div
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      transition: 'box-shadow 0.2s ease',
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <div style={{ display: 'flex', height: '140px' }}>
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
                      <div style={{ flex: 1, padding: '12px 12px 12px 16px', display: 'flex', flexDirection: 'column' }}>
                        {/* Title and Rating */}
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '16px',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {place.name}
                        </h3>

                        {/* Rating placeholder - you can add real rating data */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>4.1</span>
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {[1, 2, 3, 4].map(i => (
                              <span key={i} style={{ color: '#22c55e', fontSize: '12px' }}>●</span>
                            ))}
                            <span style={{ color: '#d1d5db', fontSize: '12px' }}>●</span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>(205)</span>
                        </div>

                        {/* Category tags */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto' }}>
                          {place.categories && place.categories.length > 0 && (
                            <>
                              {getCategoryIcon([place.categories[0]])}
                              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                                {place.categories[0].toLowerCase().replace('_', ' ')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Three-dot menu */}
                      <div
                        style={{
                          padding: '8px',
                          cursor: 'pointer',
                          color: '#9ca3af',
                          transition: 'color 0.2s ease',
                          display: 'flex',
                          alignItems: 'flex-start'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRemoveItem) onRemoveItem(index);
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#4b5563';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#9ca3af';
                        }}
                      >
                        <MoreVertical size={20} strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryView;
