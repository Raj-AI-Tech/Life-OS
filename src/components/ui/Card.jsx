import React from 'react'

export default function Card({ children, style={}, className="", onClick }) {
  return (
    <div
      className={`premium-card fade-up ${className}`}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
      onMouseEnter={onClick ? e => { e.currentTarget.style.borderColor = "var(--borderLight)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.3), 0 0 0 1px var(--borderLight)"; } : undefined}
      onMouseLeave={onClick ? e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; } : undefined}
    >
      {children}
    </div>
  );
}
