import {THEMES} from '../../theme/theme'
import { NAV } from "../../constants/index";
import Label from "../ui/Label";
import logo from "../../assets/LifeOS.png";

export default function Sidebar({ page, setPage, theme, setTheme, collapsed, setCollapsed, onNavClick }) {
  const t = THEMES[theme] || THEMES.emerald;
  return (
    <aside className="sidebar-inner">
      {/* Logo area */}
      <div style={{
        padding: collapsed ? "0 0" : "0 20px",
        height: 64,
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        gap: 8,
      }}>
        {!collapsed && (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    
    <img 
      src={logo} 
      alt="logo"
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        objectFit: "cover",
        flexShrink: 0,

        animation: "glowPulse 2.5s ease-in-out infinite",
        animation: "glowPulse 2.5s ease-in-out infinite, slowRotate 20s linear infinite",
      }}
    />

    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", letterSpacing: "0.06em" }}>
        LIFE OS
      </div>
      <div style={{ fontSize: 9, color: "var(--textMuted)", fontFamily: "'JetBrains Mono'", letterSpacing: "0.08em" }}>
        {t.name}
      </div>
    </div>

  </div>
)}
        <button
          onClick={() => setCollapsed(v => !v)}
          style={{
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7,
            padding: "5px 8px", color: "var(--textMuted)", cursor: "pointer", fontSize: 11,
            flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all .15s", lineHeight: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--card)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--textMuted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "10px 0" }}>
        {NAV.map(n => {
          const active = page === n.id;
          return (
            <button
              key={n.id}
              onClick={() => { setPage(n.id); if (onNavClick) onNavClick(); }}
              title={collapsed ? n.label : undefined}
              className={active ? "nav-item-active" : ""}
              style={{
                display: "flex", alignItems: "center",
                gap: 10, width: "100%",
                padding: collapsed ? "10px 0" : "9px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                background: "transparent",
                color: "var(--textMuted)",
                border: "none",
                borderLeft: "2px solid transparent",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13, fontWeight: 400,
                cursor: "pointer", textAlign: "left",
                transition: "all .12s ease",
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = "var(--surface)";
                  e.currentTarget.style.color = "var(--text)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--textMuted)";
                }
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0, fontFamily: "'JetBrains Mono'", opacity: active ? 1 : 0.7 }}>{n.icon}</span>
              {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Theme switcher */}
      <div style={{ padding: collapsed ? "12px 8px" : "14px 14px", borderTop: "1px solid var(--border)", flexShrink: 0 }}>
        {collapsed ? (
          <button
            title="Switch theme"
            onClick={() => setTheme(k => { const ks = Object.keys(THEMES); return ks[(ks.indexOf(k)+1) % ks.length]; })}
            style={{
              width: "100%", background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "8px 0", color: "var(--textMuted)", cursor: "pointer",
              fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--textMuted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >◐</button>
        ) : (
          <div>
            <Label style={{ marginBottom: 10 }}>Theme</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {Object.entries(THEMES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setTheme(k)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "7px 10px", borderRadius: 8, border: "1px solid",
                    borderColor: theme === k ? "var(--accent)" : "transparent",
                    background: theme === k ? "var(--accentDim)" : "transparent",
                    cursor: "pointer", transition: "all .12s",
                  }}
                  onMouseEnter={e => {
                    if (theme !== k) { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border)"; }
                  }}
                  onMouseLeave={e => {
                    if (theme !== k) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }
                  }}
                >
                  <div style={{
                    width: 12, height: 12, borderRadius: "50%", background: v.accent, flexShrink: 0,
                    boxShadow: theme === k ? `0 0 6px ${v.accent}` : "none",
                  }} />
                  <span style={{ fontSize: 12, color: theme === k ? "var(--accent)" : "var(--textMuted)", fontWeight: theme === k ? 600 : 400 }}>{v.name}</span>
                  {theme === k && <span style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}