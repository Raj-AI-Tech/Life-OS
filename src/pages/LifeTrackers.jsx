import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { today, last7, fmt } from "../hooks/useToday";
import { MOODS } from "../constants";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import Empty from "../components/ui/Empty";
import PageTitle from "../components/layout/PageTitle";
 
// Also paste these chart style constants at the top of this file (after imports):
const chartTip  = { background:"var(--card)", border:"1px solid var(--borderLight)", color:"var(--text)", borderRadius:10, fontSize:12, boxShadow:"0 8px 24px rgba(0,0,0,.4)" };
const chartAxis = { fill:"var(--textMuted)", fontSize:10, fontFamily:"JetBrains Mono" };
const chartGrid = { stroke:"var(--border)", strokeDasharray:"4 4" };
 
 
export default function LifeTrackers({ lifeLogs, setLifeLogs }) {
  const [form, setForm] = useState({ mood:2, energy:5, sleep:7, notes:"" });
  const td = today();
  const todayLog = lifeLogs.find(l=>l.date===td);

  const save = () => setLifeLogs(ls=>[...ls.filter(l=>l.date!==td),{...form,date:td,id:Date.now()}]);

  const moodData = last7().map((d,i)=>{
    const l=lifeLogs.find(x=>x.date===d);
    return { name:["M","T","W","T","F","S","S"][i], mood:l?l.mood+1:null, energy:l?.energy, sleep:l?.sleep };
  });

  return (
    <div>
      <PageTitle title="Life Log" subtitle="Daily wellbeing — mood, energy, sleep" />
      <div className="g2" style={{ marginBottom:20 }}>
        <Card style={{ padding:"20px 22px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:18 }}>Today's Entry</span>
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <Label>Mood</Label>
              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                {MOODS.map((m,i)=>(
                  <button key={i} onClick={()=>setForm(f=>({...f,mood:i}))}
                    style={{ fontSize:24, opacity:form.mood===i?1:.25, transform:form.mood===i?"scale(1.25)":"scale(1)", background:"none", border:"none", cursor:"pointer", transition:"all .2s", padding:2 }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Energy — {form.energy}/10</Label>
              <input type="range" min={1} max={10} value={form.energy} onChange={e=>setForm(f=>({...f,energy:+e.target.value}))} style={{ width:"100%", marginTop:6 }} />
            </div>
            <div>
              <Label>Sleep — {form.sleep}h</Label>
              <input type="range" min={1} max={12} step={0.5} value={form.sleep} onChange={e=>setForm(f=>({...f,sleep:+e.target.value}))} style={{ width:"100%", marginTop:6 }} />
            </div>
            <div><Label>Notes</Label><Input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="How are you feeling?" /></div>
            <Btn variant="accent" onClick={save} style={{ width:"100%" }}>{todayLog?"Update Today":"Save Today"}</Btn>
          </div>
        </Card>

        <Card style={{ padding:"20px 22px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>7-Day Trends</span>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={moodData}>
              <CartesianGrid {...chartGrid}/>
              <XAxis dataKey="name" tick={chartAxis}/>
              <YAxis tick={chartAxis}/>
              <Tooltip contentStyle={chartTip}/>
              <Line type="monotone" dataKey="mood"   stroke="var(--gold)"   strokeWidth={2} name="Mood"   dot={{fill:"var(--gold)",r:3}}   connectNulls/>
              <Line type="monotone" dataKey="energy" stroke="var(--accent)" strokeWidth={2} name="Energy" dot={{fill:"var(--accent)",r:3}} connectNulls/>
              <Line type="monotone" dataKey="sleep"  stroke="var(--green)"  strokeWidth={2} name="Sleep"  dot={{fill:"var(--green)",r:3}}  connectNulls/>
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", gap:16, marginTop:10, justifyContent:"center" }}>
            {[{c:"var(--gold)",l:"Mood"},{c:"var(--accent)",l:"Energy"},{c:"var(--green)",l:"Sleep"}].map(x=>(
              <span key={x.l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'" }}>
                <span style={{ display:"inline-block", width:12, height:2, borderRadius:1, background:x.c }} />{x.l}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ padding:"20px 22px" }}>
        <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Log History</span>
        {lifeLogs.length===0?<Empty text="No logs yet"/>:(
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {[...lifeLogs].reverse().slice(0,10).map(l=>(
              <div key={l.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", borderRadius:7, background:"var(--surface)", border:"1px solid var(--border)", flexWrap:"wrap" }}>
                <span style={{ fontSize:11, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'", width:60, flexShrink:0 }}>{fmt(l.date)}</span>
                <span style={{ fontSize:20 }}>{MOODS[l.mood]}</span>
                <div style={{ display:"flex", gap:12, fontSize:12, color:"var(--textMuted)" }}>
                  <span>Energy: <b style={{ color:"var(--text)", fontFamily:"'JetBrains Mono'" }}>{l.energy}</b></span>
                  <span>Sleep: <b style={{ color:"var(--text)", fontFamily:"'JetBrains Mono'" }}>{l.sleep}h</b></span>
                </div>
                {l.notes&&<span style={{ fontSize:12, flex:1, color:"var(--textMuted)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.notes}</span>}
                <Btn variant="ghost" size="xs" onClick={()=>setLifeLogs(ls=>ls.filter(x=>x.id!==l.id))} style={{ color:"var(--red)", marginLeft:"auto" }}>✕</Btn>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}