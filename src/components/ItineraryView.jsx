import React, { useState } from 'react';
import { MapPin, X, Calendar, Map, Palmtree, Sun, Compass } from 'lucide-react';

// Helper to calculate estimated travel time (mock for now)
const calculateTravelTime = (place1, place2) => {
  // For now, return mock time - you can integrate with OSRM API later
  const times = ['15m', '20m', '12m', '25m', '18m', '30m'];
  return times[Math.floor(Math.random() * times.length)];
};

const ItineraryView = ({ itinerary, onRemoveItem, onCardClick, onGetStarted }) => {
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
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfccb 100%)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px'
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            opacity: 0.15,
            transform: 'rotate(15deg)'
          }}
        >
          <Palmtree size={80} color="#84cc16" strokeWidth={1.5} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            opacity: 0.12,
            transform: 'rotate(-20deg)'
          }}
        >
          <Map size={100} color="#65a30d" strokeWidth={1.5} />
        </div>
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            opacity: 0.1,
            animation: 'float 6s ease-in-out infinite'
          }}
        >
          <Sun size={60} color="#fbbf24" strokeWidth={1.5} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '20%',
            opacity: 0.12,
            animation: 'float 8s ease-in-out infinite'
          }}
        >
          <Compass size={70} color="#84cc16" strokeWidth={1.5} />
        </div>

        {/* Main content - absolutely centered */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            width: '100%',
            maxWidth: '400px',
            padding: '0 20px',
            boxSizing: 'border-box'
          }}
        >
          {/* Icon circle with gradient */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 40px rgba(132, 204, 22, 0.3)',
              animation: 'pulse 3s ease-in-out infinite'
            }}
          >
            <Calendar color="white" size={56} strokeWidth={2} />
          </div>

          {/* Text content */}
          <div
            style={{
              textAlign: 'center',
              maxWidth: '320px'
            }}
          >
            <h3
              style={{
                margin: 0,
                marginBottom: '8px',
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                letterSpacing: '-0.02em'
              }}
            >
              Start Your Adventure
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.6'
              }}
            >
              Build your perfect itinerary by adding places from the map.
              <br />
              Let's explore Catanduanes together!
            </p>
          </div>

          {/* Get Started Button */}
          <div
            onClick={onGetStarted}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)',
              borderRadius: '28px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(132, 204, 22, 0.4)',
              transition: 'all 0.3s ease',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(132, 204, 22, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(132, 204, 22, 0.4)';
            }}
          >
            <Calendar color="white" size={20} strokeWidth={2.5} />
            <span
              style={{
                color: 'white',
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '-0.01em'
              }}
            >
              Get Started
            </span>
          </div>

          {/* Suggestion chips */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '16px'
            }}
          >
            {['Beaches', 'Waterfalls', 'Heritage'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '6px 16px',
                  borderRadius: '20px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#6b7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#84cc16';
                  e.currentTarget.style.borderColor = '#84cc16';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* CSS animations */}
        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }
            @keyframes float {
              0%, 100% {
                transform: translateY(0) rotate(0deg);
              }
              50% {
                transform: translateY(-20px) rotate(10deg);
              }
            }
          `}
        </style>
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