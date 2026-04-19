import React from 'react'

export default function Textarea({ value, onChange, placeholder, rows=4, style={} }) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%", background: "var(--inputBg)",
        border: "1.5px solid var(--border)", borderRadius: 8,
        color: "var(--text)", fontFamily: "'Inter', sans-serif",
        fontSize: 13, padding: "8px 12px", outline: "none",
        resize: "vertical", lineHeight: 1.6,
        transition: "border-color .15s, box-shadow .15s",
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accentDim)"; }}
      onBlur={e  => { e.target.style.borderColor = "var(--border)";  e.target.style.boxShadow = "none"; }}
    />
  );
}