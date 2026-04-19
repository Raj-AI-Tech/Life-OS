export const today = () => new Date().toISOString().split("T")[0];
export const fmt   = (d) => new Date(d + "T00:00:00").toLocaleDateString("en-IN",{ day:"numeric", month:"short" });
export const last7 = () => Array.from({length:7},(_,i)=>{ const d=new Date(); d.setDate(d.getDate()-6+i); return d.toISOString().split("T")[0]; });
