import React from 'react'

export default function Empty({ text }) {
  return (
    <div style={{ padding: "40px 0", textAlign: "center" }}>
      <div style={{ fontSize: 28, opacity: .2, marginBottom: 10 }}>○</div>
      <p style={{ fontSize: 13, color: "var(--textDim)" }}>{text}</p>
    </div>
  );
}
