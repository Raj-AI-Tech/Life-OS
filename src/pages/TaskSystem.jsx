import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { useLS } from "../hooks/useLS";
import { today, fmt } from "../hooks/useToday";
import { CATEGORIES, PRIORITIES } from "../constants";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import Badge from "../components/ui/Badge";
import Label from "../components/ui/Label";
import Divider from "../components/ui/Divider";
import Empty from "../components/ui/Empty";
import Modal from "../components/ui/Modal";
import PageTitle from "../components/layout/PageTitle";
 
 
export default function TaskSystem({ tasks, setTasks }) {
  const [modal, setModal]       = useState(false);
  const [edit, setEdit]         = useState(null);
  const [filterCat, setFilterCat] = useState("All");
  const [filterPri, setFilterPri] = useState("All");
  const [expandedTask, setExpanded] = useState(null);
  const [pinned, setPinned]     = useLS("los_pinned", null);
  const blank = { title:"", priority:"Medium", category:"Coding", date:today(), recurring:"none", subtasks:[], notes:"" };
  const [form, setForm]         = useState(blank);

  const openNew  = () => { setEdit(null); setForm(blank); setModal(true); };
  const openEdit = (tk) => { setEdit(tk.id); setForm({...tk}); setModal(true); };
  const save = () => {
  if (!form.title.trim()) return;
  const cleaned = { ...form, subtasks: (form.subtasks || []).filter(s => s.title.trim()) };
  if (edit) setTasks(ts => ts.map(t => t.id===edit ? {...cleaned, id:edit} : t));
  else      setTasks(ts => [...ts, {...cleaned, id:Date.now(), done:false}]);
  setModal(false);
};

  const toggle    = id => setTasks(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t));
  const del       = id => setTasks(ts=>ts.filter(t=>t.id!==id));
  const toggleSub = (tid,si) => setTasks(ts=>ts.map(t=>t.id===tid?{...t,subtasks:t.subtasks.map((s,i)=>i===si?{...s,done:!s.done}:s)}:t));

  const filtered  = tasks.filter(t=>(filterCat==="All"||t.category===filterCat)&&(filterPri==="All"||t.priority===filterPri));
  const suggestion= [...tasks].filter(t=>!t.done).sort((a,b)=>({High:0,Medium:1,Low:2}[a.priority]||1)-({High:0,Medium:1,Low:2}[b.priority]||1))[0];
  const priColor  = {High:"red",Medium:"amber",Low:"green"};
  const priDot    = {High:"var(--red)",Medium:"var(--amber)",Low:"var(--green)"};

  return (
    <div>
      <PageTitle
        title="Tasks"
        subtitle={`${tasks.filter(t=>!t.done).length} pending · ${tasks.filter(t=>t.done).length} done`}
        action={<Btn variant="accent" onClick={openNew}>+ New Task</Btn>}
      />

      {suggestion && (
        <Card style={{ padding:"14px 18px", marginBottom:16, borderLeft:"3px solid var(--accent)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ color:"var(--accent)", fontSize:16, flexShrink:0 }}>→</span>
            <div style={{ flex:1, minWidth:0 }}>
              <Label style={{ marginBottom:2 }}>Suggested Next</Label>
              <span style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{suggestion.title}</span>
            </div>
            <Badge color={priColor[suggestion.priority]}>{suggestion.priority}</Badge>
          </div>
        </Card>
      )}

      {pinned && tasks.find(t=>t.id===pinned&&!t.done) && (
        <Card style={{ padding:"14px 18px", marginBottom:16, borderLeft:"3px solid var(--gold)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:11, color:"var(--gold)", fontFamily:"'JetBrains Mono'", fontWeight:600 }}>★ PINNED</span>
            <span style={{ fontSize:14, fontWeight:600, color:"var(--text)", flex:1 }}>{tasks.find(t=>t.id===pinned)?.title}</span>
            <Btn variant="ghost" size="sm" onClick={()=>setPinned(null)}>Unpin</Btn>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>
        <Select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{ width:"auto", minWidth:120 }}>
          <option>All</option>
          {CATEGORIES.map(c=><option key={c}>{c}</option>)}
        </Select>
        <Select value={filterPri} onChange={e=>setFilterPri(e.target.value)} style={{ width:"auto", minWidth:120 }}>
          <option>All</option>
          {PRIORITIES.map(p=><option key={p}>{p}</option>)}
        </Select>
        <span style={{ fontSize:12, color:"var(--textMuted)", marginLeft:"auto" }}>{filtered.length} tasks</span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.length===0 && <Empty text="No tasks match this filter" />}
        {filtered.map(tk=>(
          <Card key={tk.id} style={{ padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <input type="checkbox" checked={!!tk.done} onChange={()=>toggle(tk.id)} style={{ marginTop:2 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap" }}>
                  <div style={{ width:7, height:7, borderRadius:"50%", background:priDot[tk.priority], flexShrink:0 }} />
                  <span style={{ fontSize:13, fontWeight:600, color:tk.done?"var(--textDim)":"var(--text)", textDecoration:tk.done?"line-through":"none" }}>{tk.title}</span>
                  <Badge color={priColor[tk.priority]}>{tk.priority}</Badge>
                  <Badge>{tk.category}</Badge>
                  {tk.recurring&&tk.recurring!=="none"&&<Badge color="blue">{tk.recurring}</Badge>}
                  {tk.date&&<span style={{ fontSize:11, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'" }}>{fmt(tk.date)}</span>}
                </div>
                {tk.subtasks?.length>0&&(
                  <div style={{ marginTop:6 }}>
                    <button onClick={()=>setExpanded(expandedTask===tk.id?null:tk.id)}
                      style={{ fontSize:11, color:"var(--textMuted)", background:"none", border:"none", cursor:"pointer", fontFamily:"'JetBrains Mono'", padding:0 }}>
                      {tk.subtasks.filter(s=>s.done).length}/{tk.subtasks.length} subtasks {expandedTask===tk.id?"▲":"▼"}
                    </button>
                    {expandedTask===tk.id&&(
                      <div style={{ marginTop:8, paddingLeft:12, borderLeft:"2px solid var(--border)" }}>
                        {tk.subtasks.map((s,i)=>(
                          <label key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", cursor:"pointer" }}>
                            <input type="checkbox" checked={!!s.done} onChange={()=>toggleSub(tk.id,i)} />
                            <span style={{ fontSize:12, color:s.done?"var(--textDim)":"var(--text)", textDecoration:s.done?"line-through":"none" }}>{s.title}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ display:"flex", gap:4, flexShrink:0, alignItems:"center" }}>
                <Btn variant="ghost" size="xs" onClick={()=>setPinned(tk.id===pinned?null:tk.id)} style={{ color:tk.id===pinned?"var(--gold)":"var(--textMuted)" }}>★</Btn>
                <Btn variant="ghost" size="xs" onClick={()=>openEdit(tk)}>✎</Btn>
                <Btn variant="ghost" size="xs" onClick={()=>del(tk.id)} style={{ color:"var(--red)" }}>✕</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title={edit?"Edit Task":"New Task"}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div><Label>Title</Label><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Task title..." autoFocus /></div>
          <div className="g2">
            <div><Label>Priority</Label><Select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</Select></div>
            <div><Label>Category</Label><Select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</Select></div>
          </div>
          <div className="g2">
            <div><Label>Deadline</Label><Input type="date" value={form.date||""} onChange={e=>setForm(f=>({...f,date:e.target.value}))} /></div>
            <div><Label>Recurring</Label><Select value={form.recurring||"none"} onChange={e=>setForm(f=>({...f,recurring:e.target.value}))}><option value="none">None</option><option value="daily">Daily</option><option value="weekly">Weekly</option></Select></div>
          </div>
          <div>
            <Label>Subtasks (one per line)</Label>
            <Textarea rows={3} placeholder="Subtask 1&#10;Subtask 2"
  value={(form.subtasks||[]).map(s=>s.title).join("\n")}
  onChange={e => setForm(f => ({
    ...f,
    subtasks: e.target.value.split("\n").map(t => ({ title: t, done: false }))
  }))} />
          </div>
          <Divider />
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <Btn variant="outline" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="accent" onClick={save}>Save Task</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}