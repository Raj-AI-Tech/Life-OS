import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { fmt } from "../hooks/useToday";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import Label from "../components/ui/Label";
import Divider from "../components/ui/Divider";
import Empty from "../components/ui/Empty";
import Modal from "../components/ui/Modal";
import ProgressBar from "../components/ui/ProgressBar";
import PageTitle from "../components/layout/PageTitle";
 
 
export default function GoalSystem({ goals, setGoals, tasks }) {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ title:"", type:"short", deadline:"", linkedTasks:[] });

  const save = () => {
    if (!form.title.trim()) return;
    setGoals(gs=>[...gs,{...form,id:Date.now()}]);
    setForm({ title:"", type:"short", deadline:"", linkedTasks:[] });
    setModal(false);
  };

  const progress = g => {
    if (!g.linkedTasks?.length) return 0;
    const linked = tasks.filter(t=>g.linkedTasks.includes(t.id));
    return linked.length ? Math.round((linked.filter(t=>t.done).length/linked.length)*100) : 0;
  };

  return (
    <div>
      <PageTitle title="Goals" subtitle={`${goals.length} goals · ${goals.filter(g=>progress(g)===100).length} achieved`} action={<Btn variant="accent" onClick={()=>setModal(true)}>+ New Goal</Btn>} />

      {goals.length===0&&<Empty text="No goals yet. Set your first goal to start tracking." />}
      <div className="g2">
        {goals.map(g=>{
          const pct=progress(g);
          return (
            <Card key={g.id} style={{ padding:"20px 22px" }}>
              {pct===100&&<div style={{ fontSize:11, color:"var(--green)", fontFamily:"'JetBrains Mono'", fontWeight:600, marginBottom:8 }}>★ ACHIEVED</div>}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div style={{ flex:1, paddingRight:12 }}>
                  <h3 style={{ fontSize:15, fontWeight:600, color:"var(--text)", marginBottom:6 }}>{g.title}</h3>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
                    <Badge color={g.type==="long"?"blue":"green"}>{g.type==="long"?"Long-term":"Short-term"}</Badge>
                    {g.deadline&&<span style={{ fontSize:11, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'" }}>{fmt(g.deadline)}</span>}
                  </div>
                </div>
                <span style={{ fontSize:22, fontWeight:700, color:pct===100?"var(--green)":"var(--accent)", fontFamily:"'JetBrains Mono'" }}>{pct}%</span>
              </div>
              <ProgressBar value={pct} color={pct===100?"green":"accent"} height={6} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12 }}>
                <span style={{ fontSize:11, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'" }}>
                  {tasks.filter(t=>g.linkedTasks?.includes(t.id)&&t.done).length}/{g.linkedTasks?.length||0} tasks done
                </span>
                <Btn variant="ghost" size="xs" onClick={()=>setGoals(gs=>gs.filter(x=>x.id!==g.id))} style={{ color:"var(--red)" }}>Delete</Btn>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="New Goal">
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><Label>Goal Title</Label><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="What do you want to achieve?" autoFocus /></div>
          <div className="g2">
            <div><Label>Type</Label><Select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}><option value="short">Short-term</option><option value="long">Long-term</option></Select></div>
            <div><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={e=>setForm(f=>({...f,deadline:e.target.value}))} /></div>
          </div>
          <div>
            <Label>Link Tasks</Label>
            <div style={{ maxHeight:150, overflowY:"auto", display:"flex", flexDirection:"column", gap:4, padding:"4px 0" }}>
              {tasks.length===0
                ? <span style={{ fontSize:13, color:"var(--textMuted)" }}>No tasks to link. Create tasks first.</span>
                : tasks.map(t=>(
                  <label key={t.id} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", padding:"4px 0" }}>
                    <input type="checkbox" checked={form.linkedTasks.includes(t.id)} onChange={()=>setForm(f=>({...f,linkedTasks:f.linkedTasks.includes(t.id)?f.linkedTasks.filter(x=>x!==t.id):[...f.linkedTasks,t.id]}))} />
                    <span style={{ fontSize:13, color:"var(--text)" }}>{t.title}</span>
                  </label>
                ))}
            </div>
          </div>
          <Divider />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="outline" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="accent" onClick={save}>Create Goal</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}