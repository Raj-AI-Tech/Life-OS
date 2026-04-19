import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { today } from "../hooks/useToday";
import { DISTRACTION_TYPES } from "../constants";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import Label from "../components/ui/Label";
import Empty from "../components/ui/Empty";
import StatCard from "../components/ui/StatCard";
import PageTitle from "../components/layout/PageTitle";

 
export default function DistractionControl({ distractions, setDistractions, habits }) {
  const [form, setForm]         = useState({ type:"Instagram", trigger:"boredom", notes:"" });
  const [customType, setCustomType] = useState("");
  const td = today();
  const todayD  = distractions.filter(d=>d.date===td);
  const score   = Math.max(0, 10-todayD.length);
  const noScroll = habits.find(h=>h.name==="No Scroll");
  const byType  = DISTRACTION_TYPES.slice(0,-1).map(t=>({name:t,count:distractions.filter(d=>d.type===t).length})).filter(x=>x.count>0);
  const byTrig  = ["boredom","stress","habit","reward","procrastination"].map(t=>({name:t,count:distractions.filter(d=>d.trigger===t).length})).filter(x=>x.count>0);
  const maxCount = Math.max(...[...byType,...byTrig].map(x=>x.count),1);

  const log = () => {
    const type = form.type==="Custom"?customType:form.type;
    if (!type) return;
    setDistractions(ds=>[...ds,{...form,type,id:Date.now(),date:td,time:new Date().toLocaleTimeString()}]);
    setForm({type:"Instagram",trigger:"boredom",notes:""});
  };

  return (
    <div>
      <PageTitle title="Distraction Control" subtitle="Track patterns, reduce friction, reclaim focus" />
      <div className="g3" style={{ marginBottom:20 }}>
        <StatCard label="Focus Score" value={`${score}/10`} color={score>=8?"green":score>=5?"amber":"red"} />
        <StatCard label="Distractions Today" value={todayD.length} color="red" />
        <StatCard label="No-Scroll Streak" value={`${noScroll?.streak||0}d`} color="gold" />
      </div>

      <div className="g2" style={{ marginBottom:16 }}>
        <Card style={{ padding:"20px 22px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:16 }}>Log Distraction</span>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div><Label>Type</Label>
              <Select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                {DISTRACTION_TYPES.map(t=><option key={t}>{t}</option>)}
              </Select>
            </div>
            {form.type==="Custom"&&<div><Label>Custom Name</Label><Input value={customType} onChange={e=>setCustomType(e.target.value)} placeholder="Distraction name..." /></div>}
            <div><Label>Trigger</Label>
              <Select value={form.trigger} onChange={e=>setForm(f=>({...f,trigger:e.target.value}))}>
                {["boredom","stress","habit","reward","procrastination"].map(t=><option key={t}>{t}</option>)}
              </Select>
            </div>
            <div><Label>Notes (optional)</Label><Input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Context..." /></div>
            <Btn variant="danger" onClick={log} style={{ width:"100%" }}>⊗ Log Distraction</Btn>
          </div>
        </Card>

        <Card style={{ padding:"20px 22px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:16 }}>Pattern Analysis</span>
          {byType.length===0&&byTrig.length===0?<Empty text="No patterns yet"/>:<>
            {byType.length>0&&<>
              <Label style={{ marginBottom:8 }}>By Platform</Label>
              {byType.map(x=>(
                <div key={x.name} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                  <span style={{ fontSize:12, width:80, color:"var(--text)", flexShrink:0 }}>{x.name}</span>
                  <div style={{ flex:1, height:8, borderRadius:4, background:"var(--border)", overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:4, width:`${(x.count/maxCount)*100}%`, background:"var(--red)", transition:"width .4s" }} />
                  </div>
                  <span style={{ fontSize:11, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'", width:16, textAlign:"right" }}>{x.count}</span>
                </div>
              ))}
            </>}
            {byTrig.length>0&&<>
              <Label style={{ marginTop:12, marginBottom:8 }}>By Trigger</Label>
              {byTrig.map(x=>(
                <div key={x.name} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
                  <span style={{ fontSize:12, width:100, color:"var(--text)", flexShrink:0 }}>{x.name}</span>
                  <div style={{ flex:1, height:8, borderRadius:4, background:"var(--border)", overflow:"hidden" }}>
                    <div style={{ height:"100%", borderRadius:4, width:`${(x.count/maxCount)*100}%`, background:"var(--amber)", transition:"width .4s" }} />
                  </div>
                  <span style={{ fontSize:11, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'", width:16, textAlign:"right" }}>{x.count}</span>
                </div>
              ))}
            </>}
          </>}
        </Card>
      </div>

      <Card style={{ padding:"20px 22px" }}>
        <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Today's Log</span>
        {todayD.length===0?<Empty text="No distractions today. Clean run! 🎯"/>:(
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {todayD.map(d=>(
              <div key={d.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", borderRadius:7, background:"var(--surface)", border:"1px solid var(--border)", flexWrap:"wrap" }}>
                <Badge color="red">{d.type}</Badge>
                <Badge color="amber">{d.trigger}</Badge>
                {d.notes&&<span style={{ fontSize:12, flex:1, color:"var(--textMuted)", minWidth:60 }}>{d.notes}</span>}
                <span style={{ fontSize:11, color:"var(--textDim)", fontFamily:"'JetBrains Mono'", marginLeft:"auto" }}>{d.time}</span>
                <Btn variant="ghost" size="xs" onClick={()=>setDistractions(ds=>ds.filter(x=>x.id!==d.id))} style={{ color:"var(--red)" }}>✕</Btn>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}