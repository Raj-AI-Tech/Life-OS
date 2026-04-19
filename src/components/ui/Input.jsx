import React from 'react'
import { useRef, useEffect } from "react";

export default function Input({ value, onChange, placeholder, type="text", style={}, onKeyDown, autoFocus=false }) {
  const ref = useRef(null);
  useEffect(() => { if (autoFocus && ref.current) ref.current.focus(); }, [autoFocus]);
  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      style={{
        width: "100%", background: "var(--inputBg)",
        border: "1.5px solid var(--border)", borderRadius: 8,
        color: "var(--text)", fontFamily: "'Inter', sans-serif",
        fontSize: 13, padding: "8px 12px", outline: "none",
        transition: "border-color .15s, box-shadow .15s",
        ...style,
      }}
      onFocus={e => { e.target.style.borderColor = "var(--accent)"; e.target.style.boxShadow = "0 0 0 3px var(--accentDim)"; }}
      onBlur={e  => { e.target.style.borderColor = "var(--border)";  e.target.style.boxShadow = "none"; }}
    />
  );
}