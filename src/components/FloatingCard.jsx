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
        ...props.style
      }}
      {...props}
    >
      {children}
    </div>
  )
}
