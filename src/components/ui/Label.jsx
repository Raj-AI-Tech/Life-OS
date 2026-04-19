import React from 'react'

export default function Label({ children, style={} }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, color: "var(--textMuted)",
      letterSpacing: "0.1em", textTransform: "uppercase",
      fontFamily: "'JetBrains Mono', monospace", display: "block",
      marginBottom: 6, ...style,
    }}>
      {children}
    </span>
  );
}