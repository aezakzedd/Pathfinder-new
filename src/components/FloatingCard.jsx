export default function FloatingCard({ leftContent, rightContent, overlayContent, className = '', ...props }) {
  return (
    <div 
      className={`floating-card ${className}`}
      style={{
        width: '90vw',
        height: '90vh',
        border: '1px solid white',
        borderRadius: '24px',
        backgroundColor: 'transparent',
        display: 'flex',
        gap: '24px',
        padding: '24px',
        boxSizing: 'border-box',
        ...props.style
      }}
      {...props}
    >
      {/* Left container with overlay */}
      <div 
        style={{
          width: '50%',
          height: '100%',
          position: 'relative'
        }}
      >
        {/* Base left container */}
        <div 
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#374151',
            borderRadius: '16px',
            padding: '16px',
            boxSizing: 'border-box'
          }}
        >
          {leftContent}
        </div>
        
        {/* White overlay container */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px',
            boxSizing: 'border-box'
          }}
        >
          {overlayContent}
        </div>
      </div>
      
      {/* Right container - for map */}
      <div 
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: '#1f2937',
          borderRadius: '16px',
          padding: '0',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {rightContent}
      </div>
    </div>
  )
}
