import React from 'react'
import { useState } from "react";

export default function Btn({ children, onClick, variant="default", size="md", className="", disabled=false, style={}, type="button" }) {
  const [pressed, setPressed] = useState(false);

  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, borderRadius: 8, fontFamily: "'Inter', sans-serif",
    fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? .45 : 1, border: "1px solid transparent",
    transition: "all .15s ease", whiteSpace: "nowrap", userSelect: "none",
    transform: pressed ? "translateY(1px)" : "translateY(0)",
    letterSpacing: "0.01em",
  };

  const sizes = {
    xs: { padding: "3px 8px",   fontSize: 11 },
    sm: { padding: "5px 12px",  fontSize: 12 },
    md: { padding: "8px 16px",  fontSize: 13 },
    lg: { padding: "11px 22px", fontSize: 14 },
  };

  const variants = {
    default: {
      background: "var(--surface)", borderColor: "var(--border)", color: "var(--text)",
      boxShadow: pressed ? "inset 0 1px 3px rgba(0,0,0,.2)" : "0 1px 2px rgba(0,0,0,.1)",
    },
    accent: {
      background: "var(--accent)", borderColor: "var(--accent)", color: "var(--accentText)",
      boxShadow: pressed ? "inset 0 1px 3px rgba(0,0,0,.25)" : "0 1px 3px rgba(0,0,0,.2)",
    },
    danger: {
      background: "var(--red)", borderColor: "var(--red)", color: "#fff",
      boxShadow: pressed ? "inset 0 1px 3px rgba(0,0,0,.2)" : "0 1px 2px rgba(0,0,0,.1)",
    },
    success: {
      background: "var(--green)", borderColor: "var(--green)", color: "#fff",
      boxShadow: pressed ? "inset 0 1px 3px rgba(0,0,0,.2)" : "0 1px 2px rgba(0,0,0,.1)",
    },
    ghost: {
      background: "transparent", borderColor: "transparent", color: "var(--textMuted)",
      boxShadow: "none",
    },
    outline: {
      background: "transparent", borderColor: "var(--border)", color: "var(--text)",
      boxShadow: "none",
    },
  };

  const v = variants[variant] || variants.default;

  const handleMouseEnter = (e) => {
    if (disabled) return;
    if (variant === "default") e.currentTarget.style.borderColor = "var(--borderLight)";
    if (variant === "ghost")   { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--text)"; }
    if (variant === "outline") e.currentTarget.style.borderColor = "var(--borderLight)";
  };
  const handleMouseLeave = (e) => {
    if (disabled) return;
    if (variant === "default") e.currentTarget.style.borderColor = "var(--border)";
    if (variant === "ghost")   { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--textMuted)"; }
    if (variant === "outline") e.currentTarget.style.borderColor = "var(--border)";
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={className}
      style={{ ...base, ...sizes[size], ...v, ...style }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => { setPressed(false); if (!disabled && onClick) onClick(); }}
      onMouseLeave={(e) => { setPressed(false); handleMouseLeave(e); }}
      onMouseEnter={handleMouseEnter}
      onClick={undefined}
    >
      {children}
    </button>
  );
}