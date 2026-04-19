import { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { today, fmt } from "../hooks/useToday";
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
import PageTitle from "../components/layout/PageTitle";

 
// AFTER:
export default function NoteVault({ notes, setNotes }) {
  const [search, setSearch]       = useState("");
  const [filterTag, setFilterTag] = useState("All");
  const [modal, setModal]         = useState(false);
  const [ideaModal, setIdeaModal] = useState(false);
  const [form, setForm]           = useState({ title:"", body:"", tag:"Thoughts" });
  const [ideaForm, setIdeaForm]   = useState({ hook:"", caption:"", platform:"Instagram" });
  const TAGS = ["Coding","Content","Thoughts","Ideas","Other"];

  const save = () => {
    if (!form.title.trim()) return;
    setNotes(ns=>[...ns,{...form,id:Date.now(),date:today()}]);
    setForm({title:"",body:"",tag:"Thoughts"}); setModal(false);
  };
  const saveIdea = () => {
    if (!ideaForm.hook.trim()) return;
    setNotes(ns=>[...ns,{title:`Idea: ${ideaForm.hook.slice(0,32)}`,body:`Hook: ${ideaForm.hook}\nCaption: ${ideaForm.caption}`,tag:"Ideas",id:Date.now(),date:today(),platform:ideaForm.platform}]);
    setIdeaForm({hook:"",caption:"",platform:"Instagram"}); setIdeaModal(false);
  };

  const filtered = notes.filter(n=>(filterTag==="All"||n.tag===filterTag)&&(n.title.toLowerCase().includes(search.toLowerCase())||n.body?.toLowerCase().includes(search.toLowerCase())));
  const tagColor = {Coding:"blue",Content:"accent",Thoughts:"default",Ideas:"amber",Other:"default"};

  return (
    <div>
      <PageTitle title="Idea Vault" subtitle={`${notes.length} notes`}
        action={<div style={{ display:"flex",gap:8 }}><Btn variant="accent" onClick={()=>setModal(true)}>+ Note</Btn><Btn variant="default" onClick={()=>setIdeaModal(true)}>⚡ Capture Idea</Btn></div>} />

      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search notes..." style={{ maxWidth:260 }} />
        <Select value={filterTag} onChange={e=>setFilterTag(e.target.value)} style={{ width:"auto", minWidth:130 }}>
          <option>All</option>{TAGS.map(t=><option key={t}>{t}</option>)}
        </Select>
      </div>

      {filtered.length===0&&<Empty text="No notes found"/>}
      <div className="g-auto">
        {filtered.map(n=>(
          <Card key={n.id} style={{ padding:"18px 20px", display:"flex", flexDirection:"column" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <h3 style={{ fontSize:14, fontWeight:600, color:"var(--text)", flex:1, paddingRight:8, lineHeight:1.3 }}>{n.title}</h3>
              <Btn variant="ghost" size="xs" onClick={()=>setNotes(ns=>ns.filter(x=>x.id!==n.id))} style={{ color:"var(--red)", flexShrink:0 }}>✕</Btn>
            </div>
            <p style={{ fontSize:12, color:"var(--textMuted)", lineHeight:1.7, whiteSpace:"pre-wrap", flex:1 }}>{n.body}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, paddingTop:10, borderTop:"1px solid var(--border)" }}>
              <Badge color={tagColor[n.tag]||"default"}>{n.tag}</Badge>
              <span style={{ fontSize:11, color:"var(--textDim)", fontFamily:"'JetBrains Mono'" }}>{fmt(n.date)}</span>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="New Note">
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div><Label>Title</Label><Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="Note title..." autoFocus /></div>
          <div><Label>Content</Label><Textarea rows={5} value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} placeholder="Write your note here..." /></div>
          <div><Label>Tag</Label><Select value={form.tag} onChange={e=>setForm(f=>({...f,tag:e.target.value}))}>{TAGS.map(t=><option key={t}>{t}</option>)}</Select></div>
          <Divider />
          <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
            <Btn variant="outline" onClick={()=>setModal(false)}>Cancel</Btn>
            <Btn variant="accent" onClick={save}>Save Note</Btn>
          </div>
        </div>
      </Modal>

      <Modal open={ideaModal} onClose={()=>setIdeaModal(false)} title="⚡ Capture Idea">
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          <div><Label>Hook</Label><Input value={ideaForm.hook} onChange={e=>setIdeaForm(f=>({...f,hook:e.target.value}))} placeholder="Opening line that stops the scroll..." autoFocus /></div>
          <div><Label>Caption / Details</Label><Textarea rows={3} value={ideaForm.caption} onChange={e=>setIdeaForm(f=>({...f,caption:e.target.value}))} placeholder="Caption or extra details..." /></div>
          <div><Label>Platform</Label><Select value={ideaForm.platform} onChange={e=>setIdeaForm(f=>({...f,platform:e.target.value}))}>{["Instagram","YouTube","Twitter","LinkedIn"].map(p=><option key={p}>{p}</option>)}</Select></div>
          <Divider />
          <div style={{ display:"flex",gap:8,justifyContent:"flex-end" }}>
            <Btn variant="outline" onClick={()=>setIdeaModal(false)}>Cancel</Btn>
            <Btn variant="accent" onClick={saveIdea}>Save Idea</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}