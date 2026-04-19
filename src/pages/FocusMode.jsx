import { useState, useEffect, useRef } from "react";
import { useAppStore } from "../store/useAppStore";
import { today } from "../hooks/useToday";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import Empty from "../components/ui/Empty";
import PageTitle from "../components/layout/PageTitle";

 
// AFTER:
export default function FocusMode({ tasks, focusSessions, setFocusSessions }) {
  const [duration, setDuration]       = useState(25);
  const [selectedTask, setSelectedTask] = useState("");
  const [running, setRunning]         = useState(false);
  const [timeLeft, setTimeLeft]       = useState(25*60);
  const [done, setDone]               = useState(false);
  const intervalRef = useRef(null);
  const td = today();
  const todaySessions = focusSessions.filter(s=>s.date===td);
  const todayMins     = todaySessions.reduce((a,s)=>a+(s.mins||0),0);

  const start = () => {
    setTimeLeft(duration*60); setRunning(true); setDone(false);
    intervalRef.current = setInterval(()=>{
      setTimeLeft(t=>{
        if (t<=1){
          clearInterval(intervalRef.current); setRunning(false); setDone(true);
          setFocusSessions(ss=>[...ss,{id:Date.now(),date:td,mins:duration,task:selectedTask,hour:new Date().getHours()}]);
          return 0;
        }
        return t-1;
      });
    },1000);
  };
  const stop = () => { clearInterval(intervalRef.current); setRunning(false); setTimeLeft(duration*60); setDone(false); };
  useEffect(()=>()=>clearInterval(intervalRef.current),[]);

  const mins = Math.floor(timeLeft/60);
  const secs = timeLeft%60;
  const pct  = running ? Math.round(((duration*60-timeLeft)/(duration*60))*100) : 0;
  const R=70, C=2*Math.PI*R;

  return (
    <div>
      <PageTitle title="Focus Mode" subtitle="Deep work — eliminate distractions, amplify output" />
      <div className="g2">
        <Card style={{ padding:"36px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:22 }}>
          {/* Timer ring */}
          <div className={running?"focus-pulse":""} style={{ position:"relative", width:180, height:180 }}>
            <svg width={180} height={180} style={{ position:"absolute", top:0, left:0, transform:"rotate(-90deg)" }}>
              <circle cx={90} cy={90} r={R} fill="none" stroke="var(--border)" strokeWidth={8} />
              <circle cx={90} cy={90} r={R} fill="none" stroke="var(--accent)" strokeWidth={8}
                strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C*(1-pct/100)}
                style={{ transition:"stroke-dashoffset 1s linear" }} />
            </svg>
            <div style={{
              position:"absolute", inset:14, borderRadius:"50%",
              background:"var(--card)", border:"1px solid var(--border)",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            }}>
              <div style={{ fontFamily:"'JetBrains Mono'", fontSize:30, fontWeight:600, color:"var(--text)", letterSpacing:"0.04em", lineHeight:1 }}>
                {String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}
              </div>
              <div style={{ fontSize:10, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'", marginTop:4, letterSpacing:"0.1em" }}>
                {running?"FOCUSING":done?"COMPLETE":"READY"}
              </div>
            </div>
          </div>

          <div style={{ display:"flex", gap:8 }}>
            {[25,50].map(d=>(
              <Btn key={d} size="sm" variant={duration===d?"accent":"outline"} onClick={()=>{ if(!running){setDuration(d);setTimeLeft(d*60);} }}>{d} min</Btn>
            ))}
          </div>

          <Select value={selectedTask} onChange={e=>setSelectedTask(e.target.value)} style={{ maxWidth:280 }}>
            <option value="">Select task (optional)</option>
            {tasks.filter(t=>!t.done).map(t=><option key={t.id} value={t.title}>{t.title}</option>)}
          </Select>

          <div style={{ display:"flex", gap:10 }}>
            {!running
              ? <Btn variant="accent" size="lg" onClick={start}>▶ Start Session</Btn>
              : <Btn variant="danger" size="lg" onClick={stop}>■ Stop</Btn>}
          </div>

          {done&&(
            <div style={{ textAlign:"center", padding:"12px 20px", borderRadius:8, background:"var(--greenDim)", border:"1px solid var(--green)" }}>
              <div style={{ fontSize:13, color:"var(--green)", fontWeight:600 }}>Session complete!</div>
              <div style={{ fontSize:12, color:"var(--textMuted)", marginTop:3 }}>+{duration} minutes logged.</div>
            </div>
          )}
        </Card>

        <Card style={{ padding:"20px 22px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:16 }}>Today's Sessions</span>
          <div style={{ display:"flex", gap:20, padding:"14px 16px", borderRadius:8, background:"var(--surface)", marginBottom:16, border:"1px solid var(--border)" }}>
            <div>
              <div style={{ fontFamily:"'JetBrains Mono'", fontSize:26, fontWeight:700, color:"var(--accent)" }}>{todayMins}m</div>
              <div style={{ fontSize:11, color:"var(--textMuted)", marginTop:2 }}>Deep work</div>
            </div>
            <div style={{ width:1, background:"var(--border)" }} />
            <div>
              <div style={{ fontFamily:"'JetBrains Mono'", fontSize:26, fontWeight:700, color:"var(--green)" }}>{todaySessions.length}</div>
              <div style={{ fontSize:11, color:"var(--textMuted)", marginTop:2 }}>Sessions</div>
            </div>
          </div>
          <div style={{ maxHeight:280, overflowY:"auto", display:"flex", flexDirection:"column", gap:6 }}>
            {todaySessions.length===0&&<Empty text="No sessions today"/>}
            {todaySessions.map(s=>(
              <div key={s.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 12px", borderRadius:7, background:"var(--surface)", border:"1px solid var(--border)" }}>
                <span style={{ fontSize:13, color:"var(--text)" }}>{s.task||"General focus"}</span>
                <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                  <Badge color="accent">{s.mins}m</Badge>
                  <span style={{ fontSize:11, color:"var(--textDim)", fontFamily:"'JetBrains Mono'" }}>{s.hour}:00</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}