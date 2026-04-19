import { useEffect } from "react";
import Btn from "./Btn";
import Divider from "./Divider";

export default function Modal({ open, onClose, title, children, width="560px" }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, background: "rgba(0,0,0,.65)", backdropFilter: "blur(6px)",
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="fade-up" style={{
        width: "100%", maxWidth: width,
        background: "var(--card)", border: "1px solid var(--borderLight)",
        borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,.4)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ padding: "20px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)" }}>{title}</h2>
          <Btn variant="ghost" size="sm" onClick={onClose} style={{ padding: "4px 8px", fontSize: 16 }}>✕</Btn>
        </div>
        <Divider />
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}