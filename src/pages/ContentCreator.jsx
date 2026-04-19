import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { today, fmt } from "../hooks/useToday";
import { CONTENT_STATUSES } from "../constants";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Select from "../components/ui/Select";
import Badge from "../components/ui/Badge";
import Label from "../components/ui/Label";
import Divider from "../components/ui/Divider";
import Empty from "../components/ui/Empty";
import Modal from "../components/ui/Modal";
import StatCard from "../components/ui/StatCard";
import PageTitle from "../components/layout/PageTitle";

 
export default function ContentCreator({ content, setContent }) {
  const [modal, setModal]         = useState(false);
  const [filterStatus, setFilter] = useState("All");
  const [form, setForm]           = useState({ title:"", hook:"", caption:"", status:"Idea", platform:"Instagram", scheduledDate:"", views:"", likes:"", saves:"" });

  const save = () => {
    if (!form.title.trim()) return;
    setContent(cs=>[...cs,{...form,id:Date.now(),createdDate:today()}]);
    setForm({title:"",hook:"",caption:"",status:"Idea",platform:"Instagram",scheduledDate:"",views:"",likes:"",saves:""});
    setModal(false);
  };
  const updateStatus = (id,status) => setContent(cs=>cs.map(c=>c.id===id?{...c,status}:c));
  const filtered = content.filter(c=>filterStatus==="All"||c.status===filterStatus);
  const statusColor = {Idea:"default",Scripted:"amber",Filmed:"blue",Posted:"green"};

  return (
    <div>
      <PageTitle title="Content Studio" subtitle={`${content.length} pieces · ${content.filter(c=>c.status==="Posted").length} posted`}
        action={<Btn variant="accent" onClick={()=>setModal(true)}>+ New Content</Btn>} />

      <div className="g4" style={{ marginBottom:20 }}>
        {CONTENT_STATUSES.map(s=>(
          <StatCard key={s} label={s} value={content.filter(c=>c.status===s).length} color="accent" />
        ))}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
        <Select value={filterStatus} onChange={e=>setFilter(e.target.value)} style={{ width:"auto", minWidth:140 }}>
          <option>All</option>{CONTENT_STATUSES.map(s=><option key={s}>{s}</option>)}
        </Select>
        <span style={{ fontSize:12, color:"var(--textMuted)", marginLeft:"auto" }}>{filtered.length} pieces</span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.length===0&&<Empty text="No content pieces found"/>}
        {filtered.map(c=>(
          <Card key={c.id} style={{ padding:"16px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <h3 style={{ fontSize:14, fontWeight:600, color:"var(--text)", marginBottom:6 }}>{c.title}</h3>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  <Badge color={statusColor[c.status]}>{c.status}</Badge>
                  <Badge>{c.platform}</Badge>
                  {c.scheduledDate&&<span style={{ fontSize:11, color:"var(--textMuted)", fontFamily:"'JetBrains Mono'" }}>Scheduled: {fmt(c.scheduledDate)}</span>}
                </div>
              </div>
              <Btn variant="ghost" size="xs" onClick={()=>setContent(cs=>cs.filter(x=>x.id!==c.id))} style={{ color:"var(--red)" }}>✕</Btn>
            </div>
            {c.hook&&<p style={{ fontSize:12, color:"var(--textMuted)", marginBottom:4 }}><b style={{ color:"var(--text)" }}>Hook:</b> {c.hook}</p>}
            {c.caption&&<p style={{ fontSize:12, color:"var(--textMuted)", marginBottom:10 }}><b style={{ color:"var(--text)" }}>Caption:</b> {c.caption}</p>}
            {c.status==="Posted"&&(c.views||c.likes||c.saves)&&(
              <div style={{ display:"flex", gap:16, marginBottom:10 }}>
                {c.views&&<span style={{ fontSize:12, color:"var(--textMuted)" }}>Views: <b style={{ color:"var(--text)", fontFamily:"'JetBrains Mono'" }}>{c.views}</b></span>}
                {c.likes&&<span style={{ fontSize:12, color:"var(--textMuted)" }}>Likes: <b style={{ color:"var(--text)", fontFamily:"'JetBrains Mono'" }}>{c.likes}</b></span>}
                {c.saves&&<span style={{ fontSize:12, color:"var(--textMuted)" }}>Saves: <b style={{ color:"var(--text)", fontFamily:"'JetBrains Mono'" }}>{c.saves}</b></span>}
              </div>
            )}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {CONTENT_STATUSES.map(s=>(
                <Btn key={s} size="xs" variant={c.status===s?"accent":"outline"} onClick={()=>updateStatus(c.id,s)}>{s}</Btn>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="New Content Piece">
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div><Label>Title</Label><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Content title..." autoFocus /></div>
          <div><Label>Hook</Label><Input value={form.hook} onChange={e=>setForm(f=>({...f,hook:e.target.value}))} placeholder="Opening line that stops the scroll..." /></div>
          <div><Label>Caption</Label><Textarea rows={3} value={form.caption} onChange={e=>setForm(f=>({...f,caption:e.target.value}))} placeholder="Caption..." /></div>
          <div className="g2">
            <div><Label>Platform</Label><Select value={form.platform} onChange={e=>setForm(f=>({...f,platform:e.target.value}))}>{["Instagram","YouTube","Twitter","LinkedIn","TikTok"].map(p=><option key={p}>{p}</option>)}</Select></div>
            <div><Label>Status</Label><Select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>{CONTENT_STATUSES.map(s=><option key={s}>{s}</option>)}</Select></div>
          </div>
          <div><Label>Scheduled Date</Label><Input type="date" value={form.scheduledDate} onChange={e=>setForm(f=>({...f,scheduledDate:e.target.value}))} /></div>
          {form.status==="Posted"&&(
            <div className="g3">
              <div><Label>Views</Label><Input value={form.views} onChange={e=>setForm(f=>({...f,views:e.target.value}))} placeholder="0" /></div>
              <div><Label>Likes</Label><Input value={form.likes} onChange={e=>setForm(f=>({...f,likes:e.target.value}))} placeholder="0" /></div>
              <div><Label>Saves</Label><Input value={form.saves} onChange={e=>setForm(f=>({...f,saves:e.target.value}))} placeholder="0" /></div>
            </div>
          )}
          <Divider />
          <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
            <Btn variant="outline" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="accent" onClick={save}>Save Content</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}