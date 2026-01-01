export default function FloatingCard({ children, className = '', ...props }) {
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
        padding: '24px',
        boxSizing: 'border-box',
        ...props.style
      }}
      {...props}
    >
      {/* Children container - 50% width with gray background */}
      <div 
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: '#374151',
          borderRadius: '16px',
          padding: '16px',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </div>
    </div>
  )
}
