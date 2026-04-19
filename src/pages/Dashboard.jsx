import { useAppStore } from "../store/useAppStore";
import { today } from "../hooks/useToday";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Badge from "../components/ui/Badge";
import ProgressBar from "../components/ui/ProgressBar";
import Empty from "../components/ui/Empty";
import StatCard from "../components/ui/StatCard";
import PageTitle from "../components/layout/PageTitle";
 
 
export default function HomeDashboard({ tasks, setTasks, habits, focusSessions, setPage }) {
  const td = today();
  const todayTasks = tasks.filter(tk => tk.date===td || (!tk.date && !tk.done));
  const done = todayTasks.filter(tk => tk.done).length;
  const pct  = todayTasks.length ? Math.round((done/todayTasks.length)*100) : 0;
  const top3 = [...tasks].filter(tk=>!tk.done).sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority]||1)-({High:0,Medium:1,Low:2}[b.priority]||1)).slice(0,3);
  const todayFocus  = focusSessions.filter(s=>s.date===td).reduce((a,s)=>a+(s.mins||0),0);
  const todayHabits = habits.filter(h=>h.history[td]).length;
  const msg = pct===0?"Ready to build today."
    : pct<40?"Getting started — keep the momentum."
    : pct<70?"Solid progress. Stay focused."
    : pct<100?"Nearly there. Finish strong."
    : "Outstanding day. Every task complete.";

  const priColor = {High:"red",Medium:"amber",Low:"green"};

  return (
    <div>
      <PageTitle title="Dashboard" subtitle={new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})} />

      <div className="g4" style={{ marginBottom:20 }}>
        <StatCard label="Tasks Done"  value={`${done}/${todayTasks.length}`} color="accent" sub="today" />
        <StatCard label="Habits Done" value={`${todayHabits}/${habits.length}`} color="green" sub="today" />
        <StatCard label="Focus Time"  value={`${todayFocus}m`} color="gold" sub="deep work" />
        <StatCard label="Completion"  value={`${pct}%`} color="amber" sub={msg} />
      </div>

      {/* Day progress */}
      <Card style={{ padding:"20px 22px", marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>Day Progress</span>
          <span style={{ fontSize:12, color:"var(--textMuted)" }}>{msg}</span>
        </div>
        <ProgressBar value={pct} color={pct>70?"green":"accent"} height={8} />
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          <span style={{ fontSize:11, color:"var(--textDim)", fontFamily:"'JetBrains Mono'" }}>0%</span>
          <span style={{ fontSize:11, color:"var(--accent)", fontFamily:"'JetBrains Mono'", fontWeight:600 }}>{pct}% done</span>
          <span style={{ fontSize:11, color:"var(--textDim)", fontFamily:"'JetBrains Mono'" }}>100%</span>
        </div>
      </Card>

      <div className="g2" style={{ marginBottom:20 }}>
        {/* Top priorities */}
        <Card style={{ padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>Top Priorities</span>
            <Btn variant="ghost" size="sm" onClick={()=>setPage("tasks")} style={{ fontSize:12 }}>View all →</Btn>
          </div>
          {top3.length===0 ? <Empty text="All clear!" /> : top3.map((tk,i)=>(
            <div key={tk.id} style={{
              display:"flex", alignItems:"center", gap:10, padding:"9px 0",
              borderBottom: i<top3.length-1?"1px solid var(--border)":"none",
            }}>
              <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, background:tk.priority==="High"?"var(--red)":tk.priority==="Medium"?"var(--amber)":"var(--green)" }} />
              <span style={{ fontSize:13, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"var(--text)" }}>{tk.title}</span>
              <Badge color={priColor[tk.priority]}>{tk.priority}</Badge>
            </div>
          ))}
        </Card>

        {/* Habits */}
        <Card style={{ padding:"18px 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>Today's Habits</span>
            <Btn variant="ghost" size="sm" onClick={()=>setPage("habits")} style={{ fontSize:12 }}>View all →</Btn>
          </div>
          {habits.slice(0,5).map((h,i)=>(
            <div key={h.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 0", borderBottom:i<4?"1px solid var(--border)":"none" }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <div style={{
                  width:11, height:11, borderRadius:"50%", flexShrink:0,
                  background: h.history[td]?"var(--green)":"var(--border)",
                  border:`2px solid ${h.history[td]?"var(--green)":"var(--borderLight)"}`,
                  boxShadow: h.history[td]?"0 0 0 3px var(--greenDim)":"none",
                  transition:"all .2s",
                }} />
                <span style={{ fontSize:13, color:"var(--text)" }}>{h.name}</span>
              </div>
              <span style={{ fontSize:11, color:"var(--gold)", fontFamily:"'JetBrains Mono'", fontWeight:500 }}>{h.streak}d</span>
            </div>
          ))}
        </Card>

        {/* Checklist */}
        <Card style={{ padding:"18px 20px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Today's Checklist</span>
          <div style={{ maxHeight:190, overflowY:"auto" }}>
            {todayTasks.length===0 ? <Empty text="No tasks for today" /> : todayTasks.slice(0,8).map(tk=>(
              <label key={tk.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", cursor:"pointer" }}>
                <input type="checkbox" checked={!!tk.done} onChange={()=>setTasks(ts=>ts.map(t=>t.id===tk.id?{...t,done:!t.done}:t))} />
                <span style={{ fontSize:13, color:tk.done?"var(--textDim)":"var(--text)", textDecoration:tk.done?"line-through":"none", flex:1 }}>{tk.title}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Quick launch */}
        <Card style={{ padding:"18px 20px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Quick Launch</span>
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            <Btn variant="accent" onClick={()=>setPage("focus")}    style={{ width:"100%", justifyContent:"center" }}>⏱ Start Focus Session</Btn>
            <Btn variant="default" onClick={()=>setPage("tasks")}   style={{ width:"100%", justifyContent:"center" }}>✓ Add Task</Btn>
            <Btn variant="default" onClick={()=>setPage("habits")}  style={{ width:"100%", justifyContent:"center" }}>◎ Check-in Habits</Btn>
            <Btn variant="default" onClick={()=>setPage("trackers")}style={{ width:"100%", justifyContent:"center" }}>♡ Log Life Stats</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}