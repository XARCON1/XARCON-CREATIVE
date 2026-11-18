import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowLeft, ArrowRight, Bot, BriefcaseBusiness, Check, ChevronRight, CircleDollarSign, Code2, Command, GitBranch, Layers3, Megaphone, Pause, Play, Plus, Radio, RotateCcw, Send, ShieldCheck, Workflow, Users, X } from "lucide-react";
import type { ReturnTypeWorkspace } from "../workspaceTypes";

type Phase = "idle" | "running" | "review" | "done";
type Department = { id: string; title: string; agent: string; role: string; color: string; icon: typeof Activity; actions: string[]; x: number; y: number };
const departments: Department[] = [
  { id:"sales", title:"Comercial", agent:"ATLAS", role:"Calificación y alcance", color:"#a8baff", icon:BriefcaseBusiness, actions:["Analizar solicitud","Definir alcance"], x:19,y:23 },
  { id:"design", title:"Diseño", agent:"PRISM", role:"Producto y experiencia", color:"#cf9cff", icon:Layers3, actions:["Diseñar experiencia","Preparar entrega visual"], x:50,y:12 },
  { id:"engineering", title:"Ingeniería", agent:"FORGE", role:"Desarrollo y arquitectura", color:"#78d9fb", icon:Code2, actions:["Planificar arquitectura","Construir módulos"], x:81,y:23 },
  { id:"marketing", title:"Marketing", agent:"PULSE", role:"Contenido y distribución", color:"#f4b68a", icon:Megaphone, actions:["Crear estrategia","Preparar lanzamiento"], x:19,y:76 },
  { id:"finance", title:"Finanzas", agent:"LEDGER", role:"Costos y presupuesto", color:"#e5d58b", icon:CircleDollarSign, actions:["Estimar recursos","Validar presupuesto"], x:50,y:87 },
  { id:"quality", title:"Calidad y seguridad", agent:"AEGIS", role:"Validación y control", color:"#81e4b7", icon:ShieldCheck, actions:["Ejecutar revisión","Preparar aprobación"], x:81,y:76 },
];
const flow = ["sales","finance","design","engineering","quality","marketing"];
const demo = [{id:"demo-01",name:"Plataforma empresarial",status:"Simulación"}, {id:"demo-02",name:"Automatización CRM",status:"Simulación"}, {id:"demo-03",name:"Experiencia comercial web",status:"Simulación"}];
type Mission = { id:string; projectId:string; projectName:string; objective:string; step:number; phase:Phase };
type Entry = { id:number; time:string; agent:string; message:string };
const stamp=()=>new Date().toLocaleTimeString("es-NI",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
// Integration boundary: real execution must be supplied by an authenticated server-side service.
// This provider is intentionally isolated from Firestore writes and external agent tools.
type CommanderProvider = { mode:"simulation" | "live"; projects: {id:string;name:string;status:string}[] };
function useCommanderProvider(workspace:ReturnTypeWorkspace, mode:"demo"|"workspace"):CommanderProvider {
  return {mode:"simulation",projects:mode==="workspace" ? workspace.projects.map(p=>({id:p.id,name:p.name,status:String(p.status)})):demo};
}
export default function Commander({workspace}:{workspace:ReturnTypeWorkspace}) {
  const [source,setSource]=useState<"demo"|"workspace">("demo");
  const provider=useCommanderProvider(workspace,source);
  const [projectId,setProjectId]=useState(demo[0].id);
  const [objective,setObjective]=useState("");
  const [mission,setMission]=useState<Mission|null>(null);
  const [paused,setPaused]=useState(false);
  const [selected,setSelected]=useState("engineering");
  const [tab,setTab]=useState<"network"|"pipeline"|"activity">("network");
  const [logs,setLogs]=useState<Entry[]>(()=>[{id:0,time:stamp(),agent:"COMMANDER",message:"Entorno de simulación inicializado"}]);
  const project=provider.projects.find(p=>p.id===projectId);
  const dept=departments.find(d=>d.id===selected) || departments[0];
  const active=mission?.phase==="running" ? flow[mission.step] : undefined;
  const completed=mission ? mission.phase==="done" || mission.phase==="review" ? flow.length : mission.step : 0;
  const record=(agent:string,message:string)=>setLogs(old=>[{id:Date.now()+Math.random(),time:stamp(),agent,message},...old].slice(0,80));
  useEffect(()=>{
    if (!mission || mission.phase!=="running" || paused) return;
    const timer=window.setTimeout(()=>{
      const current=departments.find(d=>d.id===flow[mission.step]);
      if(current) record(current.agent,current.actions[1]+" · resultado simulado");
      const next=mission.step+1;
      if(next>=flow.length) {
        setMission({...mission,step:next,phase:"review"});
        record("COMMANDER","Misión preparada para revisión humana");
      } else {
        const nextDept=departments.find(d=>d.id===flow[next]);
        setMission({...mission,step:next});
        if(nextDept) record(nextDept.agent,nextDept.actions[0]+" · ejecución simulada");
      }
    },3600);
    return ()=>window.clearTimeout(timer);
  },[mission,paused]);
  const busy=mission?.phase==="running" || mission?.phase==="review";
  const start=()=>{
    if(!project || !objective.trim() || busy) return;
    setPaused(false);
    setMission({id:"SIM-"+Date.now().toString(36).toUpperCase(),projectId:project.id,projectName:project.name,objective:objective.trim(),step:0,phase:"running"});
    record("COMMANDER","Misión asignada: "+project.name);
    record("ATLAS","Analizar solicitud · ejecución simulada");
    setTab("network");
  };
  const resolve=(approve:boolean)=>{
    if(mission?.phase!=="review") return;
    record("OWNER",approve?"Aprobación simulada registrada":"Misión simulada rechazada");
    setMission(approve?{...mission,phase:"done"}:null);
  };
  const changeSource=(value:"demo"|"workspace")=>{
    setSource(value);setProjectId(value==="demo"?demo[0].id:workspace.projects[0]?.id || "");
  };
  const signals=useMemo(()=>departments.map(d=>({ ...d, state: active===d.id ? paused?"Pausado":"Procesando" : flow.indexOf(d.id)<completed?"Completado":"Disponible"})),[active,completed,paused]);
  return <div className="xc" id="hq-main" tabIndex={-1}>
    <style>{styles}</style>
    <header className="xc-head">
      <div className="xc-brand"><div className="xc-mark"><Command size={25}/></div><div><strong>XARCON<span> / </span></strong><small>COMMANDER</small></div></div>
      <div className="xc-head-mid"><span className="xc-dot"/> Entorno de simulación <i/> <span>Control ejecutivo</span></div>
      <Link className="xc-back" to="/admin/dashboard"><ArrowLeft size={16}/> <span>Volver a HQ</span></Link>
    </header>
    <div className="xc-body">
      <aside className="xc-rail">
        <div className="xc-eyebrow">OPERACIONES</div>
        <button className={tab==="network"?"on":""} onClick={()=>setTab("network")}><Workflow size={19}/> Arquitectura <ChevronRight size={14}/></button>
        <button className={tab==="pipeline"?"on":""} onClick={()=>setTab("pipeline")}><GitBranch size={19}/> Misiones <ChevronRight size={14}/></button>
        <button className={tab==="activity"?"on":""} onClick={()=>setTab("activity")}><Activity size={19}/> Actividad <ChevronRight size={14}/></button>
        <div className="xc-eyebrow xc-spaced">DEPARTAMENTOS</div>
        {signals.map(d=><button key={d.id} className={selected===d.id?"selected":""} onClick={()=>{setSelected(d.id);setTab("network")}}><d.icon size={17} style={{color:d.color}}/>{d.title}<b className={d.state==="Procesando"?"xc-ping":"xc-muted-dot"}/></button>)}
        <div className="xc-rail-bottom"><ShieldCheck size={19}/><div><b>Control humano</b><small>Sin acciones externas</small></div></div>
      </aside>
      <main className="xc-main">
        <div className="xc-intro"><div><div className="xc-eyebrow">XARCON INTELLIGENCE SYSTEM / 01</div><h1>Centro de mando<span>.</span></h1><p>Una empresa. Una red de inteligencia.</p></div><div className="xc-tag"><Radio size={16}/> SIMULATION MODE</div></div>
        <div className="xc-metrics">
          {[["Departamentos",String(departments.length),Workflow],["Agentes activos",active&&!paused?"01":"00",Bot],["Avance",Math.round(completed/flow.length*100)+"%",Activity],["Aprobaciones",mission?.phase==="review"?"01":"00",ShieldCheck]].map(([label,value,Icon])=>{const MetricIcon=Icon as typeof Activity;return <div className="xc-metric" key={String(label)}><MetricIcon size={18}/><span>{String(label)}</span><strong>{String(value)}</strong></div>})}
        </div>
        <div className="xc-stage">
          {tab==="network" ? <>
            <div className="xc-section-head"><div><b>Red neuronal operativa</b><small>Orquestación de departamentos</small></div><span className="xc-status"><span className="xc-dot"/> {paused?"En pausa":active?"Misión en ejecución":"Red disponible"}</span></div>
            <div className="xc-network">
              <div className="xc-grid" aria-hidden="true"/>
              <svg viewBox="0 0 1000 600" preserveAspectRatio="none" className="xc-links" aria-hidden="true">
                <defs><radialGradient id="xcHalo"><stop stopColor="#78d9fb" stopOpacity=".14"/><stop offset="1" stopColor="#78d9fb" stopOpacity="0"/></radialGradient></defs>
                <ellipse cx="500" cy="300" rx="300" ry="230" fill="url(#xcHalo)"/>
                <ellipse cx="500" cy="300" rx="250" ry="190" className="xc-orbit"/><ellipse cx="500" cy="300" rx="390" ry="260" className="xc-orbit"/>
                {signals.map(d=><g key={d.id}><path d={"M500 300 Q "+(500+d.x*10)/2+" "+(d.y<50?290:310)+" "+d.x*10+" "+d.y*6} stroke={d.color} className={"xc-wire "+(d.state==="Procesando"?"working":"")}/>{d.state==="Procesando"&&<circle r="5" fill={d.color}><animateMotion dur="1.7s" repeatCount="indefinite" path={"M500 300 L"+d.x*10+" "+d.y*6}/></circle>}</g>)}
              </svg>
              <div className="xc-core"><div className="xc-ring"/><div className="xc-ring second"/><div className="xc-core-inner"><Command size={36}/><strong>COMMANDER</strong><small>{active?"ORQUESTANDO":"NÚCLEO"}</small></div></div>
              {signals.map(d=><button key={d.id} style={{left:d.x+"%",top:d.y+"%","--node":d.color} as React.CSSProperties} className={"xc-node "+(selected===d.id?"chosen ":"")+(d.state==="Procesando"?"working":"")} onClick={()=>setSelected(d.id)}><d.icon size={22}/><span><b>{d.agent}</b><small>{d.title}</small></span><i/></button>)}
            </div>
            <div className="xc-network-foot"><span><i/> Agentes disponibles</span><span><i className="active"/> Flujo simulado</span><span>Selecciona un departamento</span></div>
          </> : tab==="pipeline" ? <><div className="xc-section-head"><div><b>Cadena de ejecución</b><small>{mission?.projectName || "Sin misión iniciada"}</small></div><GitBranch size={20}/></div><div className="xc-pipeline">{flow.map((id,i)=>{const d=departments.find(item=>item.id===id)!; return <div className="xc-flow-row" key={id}><span className="xc-flow-index">{String(i+1).padStart(2,"0")}</span><d.icon size={22} style={{color:d.color}}/><div><b>{d.title} · {d.agent}</b><small>{d.actions.join(" → ")}</small></div><span className="xc-flow-state">{i<completed?<Check size={19}/>:active===id?paused?"Pausa":"En ejecución":"Pendiente"}</span></div>})}</div></> : <><div className="xc-section-head"><div><b>Registro de eventos</b><small>Eventos locales · no auditoría productiva</small></div><Activity size={20}/></div><div className="xc-all-logs">{logs.map(e=><div key={e.id}><time>{e.time}</time><b>{e.agent}</b><span>{e.message}</span></div>)}</div></>}
        </div>
        <section className="xc-command"><div className="xc-section-head"><div><b><Command size={17}/> Nueva misión</b><small>Proyecto + objetivo · ejecución de prueba</small></div><div className="xc-switch"><button disabled={busy} className={source==="demo"?"on":""} onClick={()=>changeSource("demo")}>Demo</button><button disabled={busy} className={source==="workspace"?"on":""} onClick={()=>changeSource("workspace")}>Proyectos HQ</button></div></div>
          <div className="xc-form"><select aria-label="Proyecto" disabled={busy} value={projectId} onChange={e=>setProjectId(e.target.value)}><option value="">Seleccionar proyecto</option>{provider.projects.map(p=><option key={p.id} value={p.id}>{p.name} · {p.status}</option>)}</select><input aria-label="Objetivo de misión" disabled={busy} value={objective} onChange={e=>setObjective(e.target.value)} placeholder="Define un objetivo de ejecución…" onKeyDown={e=>{if(e.key==="Enter")start()}}/><button className="xc-primary" disabled={!project||!objective.trim()||busy} onClick={start}><Send size={17}/> Ejecutar</button></div>
          {source==="workspace"&&<small className="xc-source">Workspace: {workspace.connection==="live"?"conectado":workspace.connection} · {provider.projects.length} proyectos · solo lectura</small>}
        </section>
      </main>
      <aside className="xc-inspector">
        <div className="xc-eyebrow">INSPECTOR / AGENTE</div>
        <div className="xc-agent-avatar" style={{color:dept.color}}><dept.icon size={32}/></div><h2>{dept.agent}<span>.</span></h2><p>{dept.title} / {dept.role}</p>
        <div className="xc-agent-state"><span className="xc-dot"/>{signals.find(s=>s.id===selected)?.state}<span>SIM</span></div>
        <div className="xc-eyebrow xc-spaced">CAPACIDADES</div>{dept.actions.map(a=><div className="xc-cap" key={a}><Check size={15}/>{a}</div>)}
        <div className="xc-divider"/>
        <div className="xc-section-head compact"><b>Misión actual</b><span className="xc-small">{mission?.id||"—"}</span></div>
        {mission?<><b className="xc-mission-name">{mission.projectName}</b><p className="xc-objective">{mission.objective}</p><div className="xc-progress"><i style={{width:(completed/flow.length*100)+"%"}}/></div><small>{completed}/{flow.length} etapas completas</small>
          {mission.phase==="running"&&<div className="xc-controls"><button onClick={()=>{setPaused(!paused);record("OWNER",paused?"Misión reanudada":"Misión pausada")}}>{paused?<Play size={16}/>:<Pause size={16}/>} {paused?"Reanudar":"Pausar"}</button><button onClick={()=>{setMission(null);setPaused(false);record("OWNER","Misión cancelada")}}><X size={16}/> Cancelar</button></div>}
          {mission.phase==="review"&&<div className="xc-approval"><ShieldCheck size={18}/><b>Revisión humana requerida</b><div className="xc-controls"><button onClick={()=>resolve(true)}><Check size={16}/> Aprobar</button><button onClick={()=>resolve(false)}><X size={16}/> Rechazar</button></div></div>}
          {mission.phase==="done"&&<div className="xc-cap"><Check size={16}/> Simulación completada</div>}
        </>:<p className="xc-empty">Inicia una misión para visualizar el flujo.</p>}
        <div className="xc-divider"/>
        <div className="xc-section-head compact"><b>Señal de actividad</b><button className="xc-text-btn" onClick={()=>setTab("activity")}>Ver todo <ArrowRight size={13}/></button></div>
        <div className="xc-mini-logs">{logs.slice(0,5).map(e=><div key={e.id}><i/><span><b>{e.agent}</b><small>{e.message}</small><time>{e.time}</time></span></div>)}</div>
      </aside>
    </div>
    <footer className="xc-footer"><span>XARCON / COMMANDER — V0.1</span><span><span className="xc-dot"/> SIMULACIÓN · NO SE EJECUTAN AGENTES REALES</span><span>CONTROL PRIVADO</span></footer>
  </div>;
}

const styles = `
.xc{--xc-bg:#080d18;--xc-panel:#101827;--xc-line:#243146;--xc-text:#e6edf7;--xc-dim:#93a4bb;--xc-cyan:#7ae0f4;min-height:100vh;background:var(--xc-bg);color:var(--xc-text);font:14px/1.45 "Manrope Variable","DM Sans Variable",system-ui,sans-serif;display:flex;flex-direction:column;isolation:isolate;outline:none}
.xc *{box-sizing:border-box}.xc button,.xc select,.xc input{font:inherit}.xc button{cursor:pointer}.xc button:disabled,.xc select:disabled,.xc input:disabled{opacity:.48;cursor:not-allowed}.xc button:focus-visible,.xc a:focus-visible,.xc input:focus-visible,.xc select:focus-visible{outline:2px solid var(--xc-cyan);outline-offset:3px}.xc a{color:inherit;text-decoration:none}.xc button{color:inherit}.xc-head{height:72px;padding:0 26px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--xc-line);background:#0c1320;gap:16px}.xc-brand{display:flex;align-items:center;gap:12px;white-space:nowrap;letter-spacing:.13em}.xc-brand strong{font-size:17px}.xc-brand strong span{color:#566c85}.xc-brand small{font-size:11px;color:var(--xc-cyan);font-weight:800}.xc-mark{width:39px;height:39px;display:grid;place-items:center;border:1px solid #3d728a;border-radius:11px;color:var(--xc-cyan);background:#102633}.xc-head-mid,.xc-back{display:flex;gap:10px;align-items:center;color:var(--xc-dim);font-size:12px}.xc-head-mid i{height:15px;width:1px;background:var(--xc-line)}.xc-back{border:1px solid var(--xc-line);padding:9px 13px;border-radius:8px}.xc-back:hover{border-color:var(--xc-cyan)}.xc-dot{display:inline-block;width:7px;height:7px;background:#81e4b7;box-shadow:0 0 11px #81e4b780;border-radius:50%;flex:none}
.xc-body{display:grid;grid-template-columns:200px minmax(0,1fr) 280px;flex:1;min-height:calc(100vh - 105px)}.xc-rail,.xc-inspector{background:#0c1320;padding:23px 15px;border-right:1px solid var(--xc-line)}.xc-rail{display:flex;flex-direction:column;gap:4px}.xc-eyebrow{color:#8397b1;letter-spacing:.14em;font-size:10px;font-weight:800}.xc-rail .xc-eyebrow{margin:0 8px 11px}.xc-rail button{border:1px solid transparent;background:transparent;text-align:left;display:flex;align-items:center;gap:10px;padding:11px 9px;border-radius:8px;color:#a7b6cb;font-size:12px;white-space:nowrap}.xc-rail button svg{flex:none}.xc-rail button svg:last-child,.xc-rail button b{margin-left:auto}.xc-rail button:hover,.xc-rail button.selected{background:#162235;color:#f1f5fc}.xc-rail button.on{color:var(--xc-cyan);background:#132a38;border-color:#265064}.xc-spaced{margin-top:28px!important;margin-bottom:12px!important}.xc-muted-dot,.xc-ping{height:6px;width:6px;border-radius:50%;background:#52637a;flex:none}.xc-ping{background:var(--xc-cyan);box-shadow:0 0 12px var(--xc-cyan)}.xc-rail-bottom{margin-top:auto;padding:18px 6px 0;display:flex;align-items:center;gap:10px;color:#87d9bc;border-top:1px solid var(--xc-line)}.xc-rail-bottom b,.xc-rail-bottom small{display:block}.xc-rail-bottom small{font-size:10px;color:var(--xc-dim)}
.xc-main{min-width:0;padding:24px clamp(14px,2vw,30px) 22px;background:radial-gradient(ellipse at 50% 20%,#14243a 0,transparent 57%)}.xc-intro{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:22px}.xc-intro h1{color:#f1f5ff;font-size:clamp(27px,3vw,43px);line-height:1.08;letter-spacing:-.055em;margin:8px 0 4px;font-weight:700}.xc-intro h1 span,.xc-inspector h2 span{color:var(--xc-cyan)}.xc-intro p,.xc-inspector p{color:var(--xc-dim);margin:0;font-size:12px}.xc-tag{display:flex;align-items:center;gap:7px;border:1px solid #40536b;color:#b1c6dd;padding:8px 10px;border-radius:6px;letter-spacing:.08em;font-size:9px;white-space:nowrap}
.xc-metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:15px}.xc-metric{position:relative;background:linear-gradient(145deg,#152238,#101827);border:1px solid var(--xc-line);border-radius:10px;padding:13px 12px;min-width:0;display:flex;flex-direction:column;gap:3px}.xc-metric svg{color:#7bbad1;position:absolute;right:10px;top:12px}.xc-metric span{color:var(--xc-dim);font-size:10px;padding-right:14px}.xc-metric strong{font-size:28px;line-height:1.1;font-variant-numeric:tabular-nums;font-weight:600;letter-spacing:-.04em}
.xc-stage,.xc-command{background:linear-gradient(155deg,#101b2b,#0d1522);border:1px solid var(--xc-line);border-radius:13px;overflow:hidden}.xc-section-head{display:flex;justify-content:space-between;align-items:center;padding:15px 17px;gap:12px;border-bottom:1px solid var(--xc-line)}.xc-section-head b{display:flex;align-items:center;gap:7px;font-size:13px}.xc-section-head small{display:block;font-size:10px;color:var(--xc-dim);margin-top:2px}.xc-status{display:flex;align-items:center;gap:6px;font-size:10px;color:#a5d8c6;white-space:nowrap}.xc-network{position:relative;height:clamp(300px,42vh,460px);overflow:hidden;background:#0b1423}.xc-grid{position:absolute;inset:0;background-image:linear-gradient(#466b8e13 1px,transparent 1px),linear-gradient(90deg,#466b8e13 1px,transparent 1px);background-size:28px 28px;mask-image:radial-gradient(ellipse,#000 20%,transparent 95%)}.xc-links{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.xc-orbit{stroke:#456885;stroke-width:1;fill:none;stroke-dasharray:3 8;opacity:.5}.xc-wire{fill:none;stroke-width:1.5;stroke-dasharray:4 7;opacity:.35}.xc-wire.working{stroke-width:3;opacity:1;animation:xc-dash 1.2s linear infinite}@keyframes xc-dash{to{stroke-dashoffset:-22}}
.xc-core{position:absolute;left:50%;top:50%;width:132px;height:132px;transform:translate(-50%,-50%);display:grid;place-items:center}.xc-ring{position:absolute;inset:-9px;border:1px dashed #65cae675;border-radius:50%;animation:xc-rotate 19s linear infinite}.xc-ring.second{inset:-22px;border:1px solid #345a7770;border-top:2px solid #79e0f5;border-bottom:2px solid #79e0f5;animation-direction:reverse;animation-duration:12s}@keyframes xc-rotate{to{transform:rotate(360deg)}}.xc-core-inner{width:100%;height:100%;border-radius:50%;border:1px solid #68b7d2;background:radial-gradient(circle at 45% 35%,#25485c,#102236 65%);box-shadow:0 0 50px #53b6e22f,inset 0 0 24px #579bc22a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:var(--xc-cyan)}.xc-core-inner strong{font-size:10px;letter-spacing:.11em}.xc-core-inner small{font-size:8px;letter-spacing:.2em;color:#a7c9d8}
.xc-node{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:8px;min-width:116px;max-width:150px;text-align:left;border:1px solid #31435b;border-radius:9px;background:linear-gradient(145deg,#1b2b41,#121e30);padding:10px 11px;box-shadow:0 8px 22px #0004;transition:border-color .2s,box-shadow .2s,transform .2s;z-index:1}.xc-node svg{color:var(--node);flex:none}.xc-node b,.xc-node small{display:block;white-space:nowrap}.xc-node b{color:var(--node);font-size:11px;letter-spacing:.1em}.xc-node small{color:#b6c5d8;font-size:9px;letter-spacing:-.01em}.xc-node i{width:6px;height:6px;background:var(--node);border-radius:50%;margin-left:auto;opacity:.5}.xc-node:hover,.xc-node.chosen{border-color:var(--node);box-shadow:0 0 24px color-mix(in srgb,var(--node) 16%,transparent);transform:translate(-50%,-50%) scale(1.035)}.xc-node.working{border-color:var(--node);animation:xc-pulse 1.8s infinite}@keyframes xc-pulse{50%{box-shadow:0 0 35px color-mix(in srgb,var(--node) 37%,transparent)}}.xc-network-foot{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:10px 15px;border-top:1px solid var(--xc-line);font-size:9px;color:var(--xc-dim)}.xc-network-foot span{display:flex;align-items:center;gap:5px}.xc-network-foot i{height:6px;width:6px;background:#6e9bbb;border-radius:100%}.xc-network-foot i.active{background:var(--xc-cyan)}
.xc-command{margin-top:15px}.xc-switch{display:flex;border:1px solid var(--xc-line);border-radius:7px;padding:2px}.xc-switch button{padding:5px 8px;font-size:10px;background:none;border:0;color:var(--xc-dim);border-radius:4px;white-space:nowrap}.xc-switch button.on{color:var(--xc-cyan);background:#1b3647}.xc-form{display:grid;grid-template-columns:minmax(115px,1fr) minmax(125px,1.5fr) auto;gap:8px;padding:13px 15px}.xc-form select,.xc-form input{background:#0a1220;color:#d9e5f4;border:1px solid #2a3b50;border-radius:7px;min-width:0;padding:10px;font-size:11px}.xc-form input::placeholder{color:#7d90a9}.xc-primary{display:flex;align-items:center;gap:6px;border:0;background:#7ae0f4;color:#092031!important;padding:9px 14px;border-radius:7px;font-weight:800!important;font-size:11px!important}.xc-source{display:block;color:var(--xc-dim);font-size:10px;padding:0 15px 12px}
.xc-inspector{border-right:0;border-left:1px solid var(--xc-line);padding:24px 19px;min-width:0}.xc-agent-avatar{display:grid;place-items:center;width:62px;height:62px;border:1px solid currentColor;border-radius:16px;background:#152438;margin-top:20px;box-shadow:0 0 28px #285f7422}.xc-inspector h2{font-size:31px;letter-spacing:-.045em;margin:12px 0 0;color:#f5f8ff}.xc-agent-state{display:flex;align-items:center;gap:8px;font-size:11px;color:#9ee5cb;border:1px solid #2b4c48;margin-top:14px;padding:9px 10px;border-radius:7px;background:#102622}.xc-agent-state span:last-child{margin-left:auto;color:#a4b6ca;font-size:9px}.xc-cap{display:flex;align-items:center;gap:8px;color:#c0d1e3;font-size:11px;padding:6px 0}.xc-cap svg{color:var(--xc-cyan);flex:none}.xc-divider{height:1px;background:var(--xc-line);margin:19px 0}.xc-section-head.compact{padding:0;border:0;margin-bottom:13px}.xc-small,.xc-inspector small{font-size:10px;color:var(--xc-dim)}.xc-mission-name{font-size:12px;overflow-wrap:anywhere}.xc-objective{margin:5px 0 12px!important;overflow-wrap:anywhere}.xc-progress{height:5px;background:#26354a;border-radius:8px;margin:10px 0 5px;overflow:hidden}.xc-progress i{display:block;height:100%;background:linear-gradient(90deg,#4d87ee,#7ae0f4);transition:width .5s}.xc-controls{display:flex;flex-wrap:wrap;gap:5px;margin-top:10px}.xc-controls button{display:flex;align-items:center;gap:4px;border:1px solid #34495f;background:#142335;border-radius:6px;padding:6px 8px;font-size:10px}.xc-approval{display:flex;flex-wrap:wrap;align-items:center;gap:6px;color:#f3d39a;font-size:11px;margin-top:12px}.xc-empty{color:var(--xc-dim)}.xc-text-btn{display:flex;align-items:center;gap:4px;border:0;background:none;color:var(--xc-cyan)!important;font-size:10px}.xc-mini-logs>div{display:flex;gap:9px;padding:9px 0;border-bottom:1px solid #1d2a3b}.xc-mini-logs i{width:6px;height:6px;flex:none;border-radius:50%;background:#69c3db;margin-top:5px}.xc-mini-logs span{min-width:0}.xc-mini-logs b,.xc-mini-logs small,.xc-mini-logs time{display:block;overflow-wrap:anywhere}.xc-mini-logs b{font-size:10px;color:#a3d4e5;letter-spacing:.04em}.xc-mini-logs time{font-size:9px;color:#687e99;margin-top:3px}
.xc-pipeline,.xc-all-logs{height:clamp(327px,45vh,487px);overflow:auto;padding:15px}.xc-flow-row{display:flex;align-items:center;gap:13px;padding:16px 10px;border-bottom:1px solid var(--xc-line)}.xc-flow-row>div{flex:1;min-width:0}.xc-flow-row b,.xc-flow-row small{display:block}.xc-flow-row small,.xc-flow-index{font-size:10px;color:var(--xc-dim)}.xc-flow-state{color:var(--xc-cyan);font-size:10px;white-space:nowrap}.xc-all-logs>div{display:grid;grid-template-columns:75px 95px 1fr;gap:10px;padding:12px 4px;border-bottom:1px solid var(--xc-line);font-size:11px;overflow-wrap:anywhere}.xc-all-logs time{color:var(--xc-dim)}.xc-all-logs b{color:var(--xc-cyan)}.xc-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 24px;border-top:1px solid var(--xc-line);background:#0b1320;color:#8093ad;font-size:9px;letter-spacing:.075em}.xc-footer span:nth-child(2){display:flex;align-items:center;gap:6px}
@media(max-width:1190px){.xc-body{grid-template-columns:66px minmax(0,1fr) 240px}.xc-rail{padding:18px 8px}.xc-rail button{font-size:0;justify-content:center;padding:12px 8px;gap:0}.xc-rail button svg:last-child:not(:first-child),.xc-rail button b,.xc-rail .xc-eyebrow,.xc-rail-bottom div{display:none}.xc-rail-bottom{justify-content:center}.xc-inspector{padding:20px 14px}}
@media(max-width:850px){.xc-body{grid-template-columns:1fr}.xc-rail{padding:10px 14px;flex-direction:row;overflow:auto;border-right:0;border-bottom:1px solid var(--xc-line)}.xc-rail button{font-size:11px;gap:6px;flex:none}.xc-rail-bottom{display:none}.xc-inspector{border-left:0;border-top:1px solid var(--xc-line);padding:24px}.xc-head-mid{display:none}.xc-main{padding:20px 14px}.xc-footer span:last-child{display:none}.xc-agent-avatar{margin-top:14px}}
@media(max-width:500px){.xc-head{height:60px;padding:0 12px}.xc-brand{gap:7px}.xc-brand strong{font-size:12px}.xc-brand small{font-size:9px}.xc-back{font-size:10px;padding:7px}.xc-mark{width:32px;height:32px}.xc-intro{align-items:flex-start}.xc-tag{font-size:0;padding:7px}.xc-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.xc-network{height:330px}.xc-node{min-width:0;padding:7px 6px;gap:4px;max-width:105px}.xc-node svg{width:16px}.xc-node b{font-size:9px}.xc-node small{font-size:7px}.xc-node i{display:none}.xc-core{width:95px;height:95px}.xc-core-inner svg{width:25px}.xc-core-inner strong{font-size:8px}.xc-ring.second{inset:-14px}.xc-network-foot{gap:4px;font-size:8px}.xc-network-foot span:last-child{display:none}.xc-section-head{padding:12px}.xc-form{grid-template-columns:1fr auto}.xc-form select{grid-column:1/-1}.xc-footer{padding:9px 12px;font-size:7px;flex-wrap:wrap}.xc-all-logs>div{grid-template-columns:58px 70px 1fr;gap:6px}}
@media(prefers-reduced-motion:reduce){.xc *,.xc *::before,.xc *::after{animation:none!important;transition:none!important}}
`;
