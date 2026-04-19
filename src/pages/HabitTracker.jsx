import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { today, last7 } from "../hooks/useToday";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Label from "../components/ui/Label";
import Divider from "../components/ui/Divider";
import Empty from "../components/ui/Empty";
import Modal from "../components/ui/Modal";
import PageTitle from "../components/layout/PageTitle";

 
// AFTER:
export default function HabitTracker({ habits, setHabits }) {
  const [newHabit, setNewHabit]   = useState("");
  const [view, setView]           = useState("weekly");
  const [missModal, setMissModal] = useState(null);
  const td = today();

  const addHabit = () => {
    if (!newHabit.trim()) return;
    setHabits(hs=>[...hs,{id:Date.now(),name:newHabit.trim(),history:{},streak:0}]);
    setNewHabit("");
  };

  const toggleHabit = id => {
    setHabits(hs=>hs.map(h=>{
      if (h.id!==id) return h;
      const hist={...h.history};
      if (hist[td]) delete hist[td]; else hist[td]=1;
      let streak=0; const d=new Date();
      while(true){ const ds=d.toISOString().split("T")[0]; if(hist[ds]){streak++;d.setDate(d.getDate()-1);}else break; }
      return {...h,history:hist,streak};
    }));
  };

  const delHabit  = id => setHabits(hs=>hs.filter(h=>h.id!==id));
  const rate7     = h => { const days=last7(); return Math.round((days.filter(d=>h.history[d]).length/7)*100); };
  const heatDays  = Array.from({length:35},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-34+i); return d.toISOString().split("T")[0]; });

  const logMissed = () => {
    if (!missModal) return;
    setHabits(hs=>hs.map(h=>h.id===missModal?{...h,history:{...h.history,[td]:0.5}}:h));
    setMissModal(null);
  };

  const viewDays = (v) => v==="monthly"
    ? Array.from({length:30},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-29+i); return d.toISOString().split("T")[0]; })
    : last7();

  return (
    <div>
      <PageTitle title="Habits" subtitle={`${habits.filter(h=>h.history[td]).length} / ${habits.length} done today`} />

      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <Input value={newHabit} onChange={e=>setNewHabit(e.target.value)} placeholder="Add habit..." onKeyDown={e=>e.key==="Enter"&&addHabit()} style={{ maxWidth:300 }} />
        <Btn variant="accent" onClick={addHabit}>Add</Btn>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:18 }}>
        {["weekly","monthly","heatmap"].map(v=>(
          <Btn key={v} size="sm" variant={view===v?"accent":"outline"} onClick={()=>setView(v)}>
            {v.charAt(0).toUpperCase()+v.slice(1)}
          </Btn>
        ))}
      </div>

      {view==="heatmap"&&(
        <Card style={{ padding:"20px 22px", marginBottom:20 }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Activity Heatmap — Last 35 Days</span>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
            {heatDays.map(d=>{
              const cnt=habits.filter(h=>h.history[d]>=1).length;
              const int=habits.length?cnt/habits.length:0;
              return <div key={d} title={d} style={{ height:16, borderRadius:3, background: int>.7?"var(--green)":int>.4?"var(--accent)":int>0?"var(--accentDim)":"var(--border)", transition:"background .2s" }} />;
            })}
          </div>
          <div style={{ display:"flex", gap:8, marginTop:10, alignItems:"center" }}>
            <span style={{ fontSize:11, color:"var(--textMuted)" }}>Less</span>
            {["var(--border)","var(--accentDim)","var(--accent)","var(--green)"].map((c,i)=>(
              <div key={i} style={{ width:11, height:11, borderRadius:2, background:c }} />
            ))}
            <span style={{ fontSize:11, color:"var(--textMuted)" }}>More</span>
          </div>
        </Card>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {habits.map(h=>{
          const days = viewDays(view);
          const isDone = h.history[td]>=1;
          const r = rate7(h);
          return (
            <Card key={h.id} style={{ padding:"16px 18px" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12, flexWrap:"wrap", gap:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <button onClick={()=>toggleHabit(h.id)} style={{
                    width:28, height:28, borderRadius:"50%",
                    background: isDone?"var(--green)":"var(--inputBg)",
                    border:`2px solid ${isDone?"var(--green)":"var(--border)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    cursor:"pointer", flexShrink:0, transition:"all .2s",
                    boxShadow: isDone?"0 0 0 3px var(--greenDim)":"none",
                  }}>
                    {isDone&&<span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>✓</span>}
                  </button>
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{h.name}</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                  <span style={{ fontSize:11, color:"var(--gold)", fontFamily:"'JetBrains Mono'", fontWeight:600 }}>{h.streak}d streak</span>
                  <Badge color={r>=70?"green":r>=40?"amber":"red"}>{r}%</Badge>
                  <Btn variant="ghost" size="xs" onClick={()=>setMissModal(h.id)} style={{ fontSize:11 }}>Missed?</Btn>
                  <Btn variant="ghost" size="xs" onClick={()=>delHabit(h.id)} style={{ color:"var(--red)" }}>✕</Btn>
                </div>
              </div>
              <div style={{ display:"flex", gap:3 }}>
                {days.map(d=>(
                  <div key={d} title={d} style={{
                    flex:1, height:18, borderRadius:3, minWidth:0,
                    background: h.history[d]>=1?"var(--green)":h.history[d]===.5?"var(--amber)":"var(--border)",
                    transition:"background .2s",
                  }} />
                ))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                <span style={{ fontSize:10, color:"var(--textDim)", fontFamily:"'JetBrains Mono'" }}>{view==="monthly"?"30d ago":"6d ago"}</span>
                <span style={{ fontSize:10, color:"var(--textDim)", fontFamily:"'JetBrains Mono'" }}>Today</span>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={!!missModal} onClose={()=>setMissModal(null)} title="Log Recovery">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <p style={{ fontSize:13, color:"var(--textMuted)" }}>Partial credit (0.5) will be logged. Life happens — keep going.</p>
          <Divider />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="outline" onClick={()=>setMissModal(null)}>Cancel</Btn>
            <Btn variant="accent" onClick={logMissed}>Log Recovery</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}