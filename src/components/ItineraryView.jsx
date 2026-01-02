import React, { useState } from 'react';
import { MapPin, X, Calendar } from 'lucide-react';

// Helper to calculate estimated travel time (mock for now)
const calculateTravelTime = (place1, place2) => {
  // For now, return mock time - you can integrate with OSRM API later
  const times = ['15m', '20m', '12m', '25m', '18m', '30m'];
  return times[Math.floor(Math.random() * times.length)];
};

const ItineraryView = ({ itinerary, onRemoveItem, onCardClick }) => {
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
        {/* Create Itinerary Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px 24px',
            backgroundColor: '#84cc16',
            borderRadius: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(132, 204, 22, 0.6)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(132, 204, 22, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(132, 204, 22, 0.6)';
          }}
        >
          <Calendar color="black" size={20} strokeWidth={3} />
          <span
            style={{
              color: 'black',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            Create Itinerary
          </span>
        </div>
      </div>
    );
  }

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
        {/* Date Header */}
        <div style={{ padding: '16px 20px', backgroundColor: 'white' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827' }}>
            {dateGroup}
          </h2>
        </div>

        {/* Places List */}
        {isExpanded && (
          <div style={{ padding: '0 20px 20px 20px' }}>
            {itinerary.map((place, index) => {
              const isLast = index === itinerary.length - 1;
              const travelTime = !isLast ? calculateTravelTime(place, itinerary[index + 1]) : null;

              return (
                <React.Fragment key={`${place.name}-${index}`}>
                  {/* Place Card - Centered */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <div
                      onClick={() => {
                        if (onCardClick) onCardClick(place);
                      }}
                      style={{
                        width: '100%',
                        maxWidth: '500px',
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
                      <div style={{ display: 'flex', height: '120px' }}>
                        {/* Image */}
                        {place.images && place.images.length > 0 ? (
                          <img
                            src={place.images[0]}
                            alt={place.name}
                            style={{
                              width: '120px',
                              height: '120px',
                              objectFit: 'cover',
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '120px',
                              height: '120px',
                              backgroundColor: '#f3f4f6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <MapPin size={28} color="#9ca3af" strokeWidth={1.5} />
                          </div>
                        )}

                        {/* Content */}
                        <div style={{ flex: 1, padding: '12px 12px 12px 14px', display: 'flex', flexDirection: 'column' }}>
                          {/* Title */}
                          <h3
                            style={{
                              margin: 0,
                              fontSize: '15px',
                              fontWeight: '600',
                              color: '#111827',
                              marginBottom: '4px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: '1.4'
                            }}
                          >
                            {place.name}
                          </h3>

                          {/* Rating */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>4.1</span>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1, 2, 3, 4].map(i => (
                                <span key={i} style={{ color: '#22c55e', fontSize: '11px' }}>●</span>
                              ))}
                              <span style={{ color: '#d1d5db', fontSize: '11px' }}>●</span>
                            </div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>(205)</span>
                          </div>

                          {/* Location and Category */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
                            <MapPin size={12} color="#6b7280" strokeWidth={2} />
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>
                              {place.categories && place.categories.length > 0 ? place.categories[0].toLowerCase().replace('_', ' ') : 'beach'}
                            </span>
                          </div>
                        </div>

                        {/* X button to remove */}
                        <div
                          style={{
                            padding: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onRemoveItem) onRemoveItem(index);
                          }}
                        >
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: '#fee2e2',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#fecaca';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#fee2e2';
                            }}
                          >
                            <X size={14} color="#dc2626" strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transport Time Indicator - Between places */}
                  {!isLast && travelTime && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '16px'
                      }}
                    >
                      {/* Vertical line above */}
                      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Line */}
                        <div
                          style={{
                            width: '2px',
                            height: '20px',
                            backgroundColor: '#fb7185'
                          }}
                        />

                        {/* Transport Button */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            backgroundColor: '#fff1f2',
                            borderRadius: '20px',
                            border: '1px solid #fb7185'
                          }}
                        >
                          {/* Car icon - minimalistic */}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fb7185"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 17h-2v-6l2-5h9l4 5v6h-2"></path>
                            <circle cx="7" cy="17" r="2"></circle>
                            <circle cx="17" cy="17" r="2"></circle>
                          </svg>

                          {/* Time text */}
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#fb7185'
                            }}
                          >
                            1h {travelTime}
                          </span>
                        </div>

                        {/* Line below */}
                        <div
                          style={{
                            width: '2px',
                            height: '20px',
                            backgroundColor: '#fb7185'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryView;