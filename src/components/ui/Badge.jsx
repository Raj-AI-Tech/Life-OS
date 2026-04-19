import React from 'react'

export default function Badge({ children, color="default", style={} }) {
  const map = {
    default: { bg: "var(--surface)", text: "var(--textMuted)", border: "var(--border)" },
    accent:  { bg: "var(--accentDim)", text: "var(--accent)", border: "var(--accentDim)" },
    green:   { bg: "var(--greenDim)", text: "var(--green)", border: "var(--greenDim)" },
    red:     { bg: "var(--redDim)",   text: "var(--red)",   border: "var(--redDim)"   },
    amber:   { bg: "var(--amberDim)", text: "var(--amber)", border: "var(--amberDim)" },
    blue:    { bg: "var(--blueDim)",  text: "var(--blue)",  border: "var(--blueDim)"  },
  };
  const c = map[color] || map.default;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      borderRadius: 5, padding: "2px 7px", fontSize: 11,
      fontWeight: 500, fontFamily: "'JetBrains Mono', monospace",
      letterSpacing: "0.03em", whiteSpace: "nowrap",
      ...style,
    }}>
      {children}
    </span>
  );
}
