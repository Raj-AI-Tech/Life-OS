import React from 'react'

export default function ProgressBar({ value, max=100, color="accent", height=6 }) {
  const pct = Math.min(100, Math.max(0, Math.round((value/max)*100)));
  const trackColor = "var(--border)";
  const fillColor  = color === "green" ? "var(--green)" : color === "red" ? "var(--red)" : "var(--accent)";
  return (
    <div style={{ height, background: trackColor, borderRadius: height, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${pct}%`, background: fillColor,
        borderRadius: height, transition: "width .5s cubic-bezier(.4,0,.2,1)",
      }} />
    </div>
  );
}

