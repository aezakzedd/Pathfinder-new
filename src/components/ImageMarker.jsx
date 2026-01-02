/**
 * Reusable Image Marker Component for Map
 * Displays a rounded square image marker with hover effects
 * Used for all tourist spots on the map
 */

import React from 'react';

const ImageMarker = ({ imageUrl, spotName, onClick }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      {/* Image Icon */}
      <div
        className="image-marker-icon"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: 'white',
          border: '3px solid white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={spotName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                ">
                  <i class="fa-solid fa-location-dot" style="font-size: 32px; color: white;"></i>
                </div>
              `;
            }}
          />
        ) : (
          // Fallback gradient with icon
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <i className="fa-solid fa-location-dot" style={{ fontSize: '32px', color: 'white' }} />
          </div>
        )}
      </div>

      {/* Label */}
      <div
        className="marker-label"
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#000000',
          textShadow: `
            -1px -1px 0 #fff,
            1px -1px 0 #fff,
            -1px 1px 0 #fff,
            1px 1px 0 #fff,
            -1.5px 0 0 #fff,
            1.5px 0 0 #fff,
            0 -1.5px 0 #fff,
            0 1.5px 0 #fff
          `,
          marginTop: '6px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textAlign: 'center',
          lineHeight: '1.2',
          opacity: 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        {spotName}
      </div>
    </div>
  );
};

export default ImageMarker;
