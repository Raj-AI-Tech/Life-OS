import { useAppStore } from "../store/useAppStore";
import { THEMES } from "../theme/theme";
import { useLS } from "../hooks/useLS";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Label from "../components/ui/Label";
import PageTitle from "../components/layout/PageTitle";
 
 
export default function Settings({ theme, setTheme }) {
  const { tasks, habits, goals, notes } = useAppStore();
  const clearAll = () => {
    if (window.confirm("Clear ALL data? This cannot be undone.")) {
      ["los_tasks","los_habits","los_goals","los_notes","los_focus","los_distractions","los_lifelogs","los_content"].forEach(k=>localStorage.removeItem(k));
      window.location.reload();
    }
  };

  const t = THEMES[theme] || THEMES.emerald;

  return (
    <div>
      <PageTitle title="Settings" subtitle="Personalise your Life OS" />
      <div className="g2">
        <Card style={{ padding:"22px 24px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:18 }}>Interface Theme</span>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {Object.entries(THEMES).map(([k,v])=>(
              <button key={k} onClick={()=>setTheme(k)}
                style={{
                  display:"flex", alignItems:"center", gap:12, padding:"11px 14px",
                  borderRadius:8, border:"1.5px solid", cursor:"pointer",
                  borderColor: theme===k?"var(--accent)":"var(--border)",
                  background: theme===k?"var(--accentDim)":"transparent",
                  transition:"all .15s", textAlign:"left",
                }}
                onMouseEnter={e=>{ if(theme!==k){ e.currentTarget.style.background="var(--surface)"; e.currentTarget.style.borderColor="var(--borderLight)"; } }}
                onMouseLeave={e=>{ if(theme!==k){ e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="var(--border)"; } }}
              >
                <div style={{ width:14, height:14, borderRadius:"50%", background:v.accent, flexShrink:0, border:"2px solid rgba(255,255,255,.15)" }} />
                <span style={{ fontSize:13, fontWeight:theme===k?600:400, color:theme===k?"var(--accent)":"var(--text)", flex:1 }}>{v.name}</span>
                {theme===k&&<span style={{ fontSize:10, color:"var(--accent)", fontFamily:"'JetBrains Mono'", fontWeight:600 }}>ACTIVE</span>}
              </button>
            ))}
          </div>
        </Card>

        <Card style={{ padding:"22px 24px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:18 }}>Data Overview</span>
          {[{label:"Tasks",val:tasks.length},{label:"Habits",val:habits.length},{label:"Goals",val:goals.length},{label:"Notes",val:notes.length}].map((x,i,arr)=>(
            <div key={x.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:i<arr.length-1?"1px solid var(--border)":"none" }}>
              <span style={{ fontSize:13, color:"var(--textMuted)" }}>{x.label}</span>
              <span style={{ fontFamily:"'JetBrains Mono'", fontSize:18, fontWeight:700, color:"var(--text)" }}>{x.val}</span>
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            <Btn variant="danger" onClick={clearAll} style={{ width:"100%" }}>⚠ Clear All Data</Btn>
          </div>
        </Card>

        <Card style={{ padding:"22px 24px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>About</span>
          <p style={{ fontSize:13, color:"var(--textMuted)", lineHeight:1.8 }}>
            Life OS is a personal productivity operating system. All data is stored locally in your browser — no accounts, no cloud, no tracking. Your life, your data.
          </p>
          <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:10 }}>
          </div>
        </Card>

        <Card style={{ padding:"22px 24px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Keyboard Shortcuts</span>
          {[["N","New task (Tasks page)"],["F","Start focus timer"],["H","Go to Dashboard"],["Esc","Close any modal"]].map(([k,v],i,arr)=>(
            <div key={k} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:i<arr.length-1?"1px solid var(--border)":"none" }}>
              <kbd style={{
                fontFamily:"'JetBrains Mono'", fontSize:11, padding:"3px 8px", borderRadius:5,
                background:"var(--surface)", border:"1px solid var(--borderLight)",
                color:"var(--text)", boxShadow:"0 1px 3px rgba(0,0,0,.2)",
              }}>{k}</kbd>
              <span style={{ fontSize:13, color:"var(--textMuted)" }}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}