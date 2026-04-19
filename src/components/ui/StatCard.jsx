import Card from "./Card";
import Label from "./Label";

export default function StatCard({ label, value, color="accent", sub }) {
  const colorMap = {
    accent: "var(--accent)", green: "var(--green)", red: "var(--red)",
    amber: "var(--amber)", blue: "var(--blue)", gold: "var(--gold)",
  };
  const c = colorMap[color] || colorMap.accent;
  return (
    <Card style={{ padding: "20px 22px" }}>
      <Label style={{ marginBottom: 8 }}>{label}</Label>
      <div style={{ fontSize: 28, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1, letterSpacing: "-0.02em" }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--textMuted)", marginTop: 8, lineHeight: 1.4 }}>{sub}</div>}
      <div className="stat-accent-line" style={{ "--accent": c }} />
    </Card>
  );
}