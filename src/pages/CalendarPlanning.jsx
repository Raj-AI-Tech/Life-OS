import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { today, fmt } from "../hooks/useToday";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Badge from "../components/ui/Badge";
import Label from "../components/ui/Label";
import Empty from "../components/ui/Empty";
import PageTitle from "../components/layout/PageTitle";

export default function CalendarPlanning({ tasks, setTasks }) {
  const [view, setView]     = useState("week");
  const [dragTask, setDrag] = useState(null);

  const getWeek = () => {
    const d=new Date(); const day=d.getDay();
    const diff=d.getDate()-day+(day===0?-6:1);
    return Array.from({length:7},(_,i)=>{ const nd=new Date(d); nd.setDate(diff+i); return nd.toISOString().split("T")[0]; });
  };
  const week      = getWeek();
  const td        = today();
  const tomorrow  = ()=>{ const d=new Date(); d.setDate(d.getDate()+1); return d.toISOString().split("T")[0]; };
  const tomorrowS = tomorrow();
  const moveTask  = (id,date) => setTasks(ts=>ts.map(t=>t.id===id?{...t,date}:t));
  const days      = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const priColor  = {High:"var(--red)",Medium:"var(--amber)",Low:"var(--green)"};

  return (
    <div>
      <PageTitle title="Calendar" subtitle={`Week of ${fmt(week[0])} — ${fmt(week[6])}`} />
      <div style={{ display:"flex", gap:6, marginBottom:18 }}>
        <Btn size="sm" variant={view==="week"?"accent":"outline"} onClick={()=>setView("week")}>Week View</Btn>
        <Btn size="sm" variant={view==="tomorrow"?"accent":"outline"} onClick={()=>setView("tomorrow")}>Plan Tomorrow</Btn>
      </div>

      {view==="tomorrow"?(
        <Card style={{ padding:"20px 22px" }}>
          <span style={{ fontSize:15, fontWeight:600, color:"var(--text)", display:"block", marginBottom:16 }}>Tomorrow — {fmt(tomorrowS)}</span>
          <Label style={{ marginBottom:8 }}>Assigned for Tomorrow</Label>
          {tasks.filter(t=>t.date===tomorrowS).length===0?<Empty text="Nothing scheduled yet"/>:tasks.filter(t=>t.date===tomorrowS).map(t=>(
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:7, marginBottom:6, background:"var(--surface)", border:"1px solid var(--border)" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:priColor[t.priority], flexShrink:0 }} />
              <span style={{ fontSize:13, flex:1, color:"var(--text)" }}>{t.title}</span>
              <Btn variant="ghost" size="xs" onClick={()=>moveTask(t.id,"")} style={{ color:"var(--red)" }}>✕</Btn>
            </div>
          ))}
          <Label style={{ marginTop:16, marginBottom:8 }}>Add from Unscheduled</Label>
          {tasks.filter(t=>!t.date&&!t.done).length===0?<Empty text="No unscheduled tasks"/>:tasks.filter(t=>!t.date&&!t.done).map(t=>(
            <div key={t.id} onClick={()=>moveTask(t.id,tomorrowS)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:7, marginBottom:6, background:"var(--surface)", border:"1px solid var(--border)", cursor:"pointer" }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.background="var(--accentDim)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.background="var(--surface)"; }}>
              <span style={{ fontSize:13, flex:1, color:"var(--text)" }}>{t.title}</span>
              <Badge color="accent">+ Add</Badge>
            </div>
          ))}
        </Card>
      ):(
        <div className="g7">
          {week.map((d,i)=>{
            const dayTasks = tasks.filter(t=>t.date===d);
            const isToday  = d===td;
            return (
              <div key={d} onDragOver={e=>e.preventDefault()} onDrop={()=>{ if(dragTask) moveTask(dragTask,d); setDrag(null); }}>
                <Card style={{ padding:"10px 8px", minHeight:140, borderColor:isToday?"var(--accent)":undefined,
                  boxShadow:isToday?"0 0 0 2px var(--accentDim), 0 4px 12px rgba(0,0,0,.12)":undefined }}>
                  <div style={{ textAlign:"center", marginBottom:8 }}>
                    <div style={{ fontSize:10, fontFamily:"'JetBrains Mono'", color:isToday?"var(--accent)":"var(--textMuted)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{days[i]}</div>
                    <div style={{ fontSize:16, fontFamily:"'JetBrains Mono'", fontWeight:700, color:isToday?"var(--accent)":"var(--text)", lineHeight:1.4 }}>{new Date(d+"T00:00:00").getDate()}</div>
                  </div>
                  {dayTasks.map(t=>(
                    <div key={t.id} draggable onDragStart={()=>setDrag(t.id)} onDragEnd={()=>setDrag(null)}
                      style={{ fontSize:10, padding:"3px 5px", borderRadius:4, marginBottom:3, cursor:"grab", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                        background:t.priority==="High"?"var(--redDim)":t.priority==="Medium"?"var(--amberDim)":"var(--greenDim)",
                        color:t.priority==="High"?"var(--red)":t.priority==="Medium"?"var(--amber)":"var(--green)",
                        border:"1px solid currentColor" }}>
                      {t.title}
                    </div>
                  ))}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}