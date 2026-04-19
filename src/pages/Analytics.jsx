import { useAppStore } from "../store/useAppStore";
import { today, last7 } from "../hooks/useToday";
import { CATEGORIES } from "../constants";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Card from "../components/ui/Card";
import Empty from "../components/ui/Empty";
import Label from "../components/ui/Label";
import StatCard from "../components/ui/StatCard";
import PageTitle from "../components/layout/PageTitle";
 
// Also paste these 3 chart style constants at the top of this file (after imports):
const chartTip  = { background:"var(--card)", border:"1px solid var(--borderLight)", color:"var(--text)", borderRadius:10, fontSize:12, boxShadow:"0 8px 24px rgba(0,0,0,.4)" };
const chartAxis = { fill:"var(--textMuted)", fontSize:10, fontFamily:"JetBrains Mono" };
const chartGrid = { stroke:"var(--border)", strokeDasharray:"4 4" };
 
 
// AFTER:
export default function Analytics({ tasks, habits, focusSessions, distractions }) {
  const days   = last7();
  const labels = days.map(d=>new Date(d).toLocaleDateString("en-IN",{weekday:"short"}));
  const taskData  = days.map((d,i)=>({ name:labels[i], tasks:tasks.filter(t=>t.done&&t.date===d).length }));
  const habitData = days.map((d,i)=>({ name:labels[i], rate:habits.length?Math.round((habits.filter(h=>h.history[d]).length/habits.length)*100):0 }));
  const focusData = days.map((d,i)=>({ name:labels[i], mins:focusSessions.filter(s=>s.date===d).reduce((a,s)=>a+(s.mins||0),0) }));
  const catData   = CATEGORIES.map(c=>({name:c,value:tasks.filter(t=>t.category===c).length})).filter(x=>x.value>0);
  const COLORS    = ["var(--accent)","var(--green)","var(--amber)","var(--red)","var(--blue)"];
  const avgStreak = habits.length?Math.round(habits.reduce((a,h)=>a+h.streak,0)/habits.length):0;
  const doneCount = tasks.filter(t=>t.done).length;
  const distractT = distractions.filter(d=>d.date===today()).length;
  const prodScore = Math.min(100,Math.round((doneCount*8+avgStreak*5)/Math.max(1,distractT+1)));
  const peakHour = focusSessions.length
  ? (() => {
      const h = Array(24).fill(0);
      focusSessions.forEach(s => {
        if (s.hour !== undefined) h[s.hour]++;
      });
      return h.indexOf(Math.max(...h));
    })()
  : null;

  return (
    <div>
      <PageTitle title="Analytics" subtitle="Your productivity at a glance" />
      <div className="g4" style={{ marginBottom:20 }}>
        <StatCard label="Productivity Score" value={prodScore} color={prodScore>70?"green":prodScore>40?"amber":"red"} />
        <StatCard label="Avg Habit Streak" value={`${avgStreak}d`} color="green" />
        <StatCard label="Tasks Completed" value={doneCount} color="accent" />
        <StatCard label="Distractions Today" value={distractT} color="red" />
      </div>

      {peakHour !== null && (
        <Card style={{ padding:"14px 18px", marginBottom:20, borderLeft:"3px solid var(--gold)" }}>
          <div style={{ display:"flex", gap:12, alignItems:"center" }}>
            <span style={{ color:"var(--gold)", fontSize:16 }}>◈</span>
            <div>
              <Label style={{ marginBottom:2 }}>Insight</Label>
              <span style={{ fontSize:13, color:"var(--text)" }}>
                Peak focus at {peakHour}:00 — {peakHour<12?"morning person":peakHour<17?"afternoon grinder":"night owl"} detected.
              </span>
            </div>
          </div>
        </Card>
      )}

      <div className="g2" style={{ marginBottom:14 }}>
        <Card style={{ padding:"18px 20px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Tasks Completed (7d)</span>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={taskData}><CartesianGrid {...chartGrid}/><XAxis dataKey="name" tick={chartAxis}/><YAxis tick={chartAxis}/><Tooltip contentStyle={chartTip}/><Bar dataKey="tasks" fill="var(--accent)" radius={[4,4,0,0]}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding:"18px 20px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Habit Consistency (%)</span>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={habitData}><CartesianGrid {...chartGrid}/><XAxis dataKey="name" tick={chartAxis}/><YAxis tick={chartAxis}/><Tooltip contentStyle={chartTip}/><Line type="monotone" dataKey="rate" stroke="var(--green)" strokeWidth={2} dot={{fill:"var(--green)",r:3}}/></LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding:"18px 20px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Focus Minutes (7d)</span>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={focusData}><CartesianGrid {...chartGrid}/><XAxis dataKey="name" tick={chartAxis}/><YAxis tick={chartAxis}/><Tooltip contentStyle={chartTip}/><Bar dataKey="mins" fill="var(--gold)" radius={[4,4,0,0]}/></BarChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ padding:"18px 20px" }}>
          <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", display:"block", marginBottom:14 }}>Tasks by Category</span>
          {catData.length===0?<Empty text="No tasks to analyze"/>:(
            <ResponsiveContainer width="100%" height={160}>
              <PieChart><Pie data={catData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" label={({name})=>name} labelLine={false}>
                {catData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie><Tooltip contentStyle={chartTip}/></PieChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}