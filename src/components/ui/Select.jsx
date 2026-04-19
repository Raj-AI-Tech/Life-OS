import React from 'react'

export default function Select({ value, onChange, children, style={} }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: "100%", background: "var(--inputBg)",
        border: "1.5px solid var(--border)", borderRadius: 8,
        color: "var(--text)", fontFamily: "'Inter', sans-serif",
        fontSize: 13, padding: "8px 12px", outline: "none",
        cursor: "pointer", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
        paddingRight: 32,
        transition: "border-color .15s",
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = "var(--accent)"; }}
      onBlur={e  => { e.target.style.borderColor = "var(--border)";  }}
    >
      {children}
    </select>
  );
}