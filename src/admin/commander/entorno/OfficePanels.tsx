import { ArrowUpRight, Check, ChevronRight, Crosshair, Pause, Play, Send, ShieldCheck, X } from "lucide-react";
import { useOperations } from "../Operations";
import { department, flow } from "../departments";
import { readAgent, STAGE_MS } from "../engine";
import { roomById } from "./floor";
import type { Selection } from "./types";

export function AgentPanel({selection,follow,room}:{selection:Selection;follow():void;room():void}) {
  const {engine,logs,mission}=useOperations();
  const d=department(selection.id),agent=readAgent(d.id,engine),r=roomById(d.id);
  const recent=logs.filter(e=>e.agent===d.agent||e.handoff?.to===d.id).slice(0,3);
  return <>
    <div className="xe-agent-line"><span className="xe-room-icon"><d.icon size={22}/></span><div><h2>{d.agent}</h2><p>{r.title}</p></div></div>
    <span className="xe-state"><i/>{agent.state}</span>
    <dl className="xe-details"><dt>Proyecto</dt><dd>{mission?.projectName??"Sin asignación"}</dd><dt>Tarea actual</dt><dd>{agent.task.label}</dd><dt>Avance de la etapa</dt><dd>{Math.round(agent.progress*100)} %</dd></dl>
    <div className="xe-meter"><i style={{width:agent.progress*100+"%"}}/></div>
    <h3>Capacidades</h3><ul className="xe-capabilities">{d.actions.map(a=><li key={a}><Check size={13}/>{a}</li>)}</ul>
    <h3>Permisos operativos</h3><p>{d.id==="command"?"Coordinar entregas y solicitar revisión humana.":"Consultar el proyecto y entregar resultados simulados."}</p>
    <h3>Actividad reciente</h3>{recent.length?<ul className="xe-events">{recent.map(e=><li key={e.id}><time>{e.time}</time><span>{e.message}</span></li>)}</ul>:<p>Sin entregas registradas.</p>}
    <div className="xe-panel-actions"><button className="xe-primary" onClick={follow}><Crosshair size={15}/> Seguir agente</button><button onClick={room}>Ver oficina <ArrowUpRight size={14}/></button></div>
  </>;
}
export function MissionPanel({onStage}:{onStage(s:Selection):void}) {
  const op=useOperations(),m=op.mission;
  const pct=m?Math.round((m.step+m.elapsed/STAGE_MS)/flow.length*100):0;
  return <>
    <h2>{m && m.phase!=="done"?"Misión en curso":"Misiones"}</h2>
    {m&&<div className="xe-mission-card"><small>{m.id}</small><h3>{m.projectName}</h3><p>{m.objective}</p>
      <div className="xe-progress-label"><span>{m.phase==="review"?"Aprobación humana":m.phase==="done"?"Aprobada":op.paused?"En pausa":department(flow[m.step]).agent}</span><b>{pct} %</b></div>
      <div className="xe-meter"><i style={{width:pct+"%"}}/></div>
      <ol className="xe-stages">{[...flow,"command" as const].map((id,i)=>{const d=department(id),waiting=m.phase==="review"&&id==="command";return <li key={id}>
        <button className={(i===m.step||waiting)?"is-current":""} onClick={()=>onStage({kind:"station",id})}>{i<m.step||m.phase==="done"?<Check size={13}/>:<i/>}<span>{d.agent}</span><small>{id==="command"?"Aprobación":d.title}</small><ChevronRight size={12}/></button>
      </li>;})}</ol>
      {m.phase==="running"&&<div className="xe-panel-actions"><button className="xe-primary" onClick={op.togglePause}>{op.paused?<Play size={14}/>:<Pause size={14}/>} {op.paused?"Reanudar":"Pausar"}</button><button onClick={op.cancel}><X size={14}/> Cancelar</button></div>}
      {m.phase==="review"&&<div className="xe-panel-actions"><button className="xe-primary" onClick={()=>op.resolve(true)}><ShieldCheck size={15}/> Aprobar</button><button onClick={()=>op.resolve(false)}>Rechazar</button></div>}
    </div>}
    {!op.busy&&<form className="xe-form" onSubmit={e=>{e.preventDefault();op.start();}}>
      <h3>Nueva misión simulada</h3><label>Origen<select value={op.source} onChange={e=>op.changeSource(e.target.value as "demo"|"workspace")}><option value="demo">Proyectos de demostración</option><option value="workspace">Proyectos de HQ</option></select></label>
      <label>Proyecto<select value={op.projectId} onChange={e=>op.chooseProject(e.target.value)}>{!op.projects.length&&<option value="">Sin proyectos disponibles</option>}{op.projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
      <label>Objetivo<input value={op.objective} onChange={e=>op.setObjective(e.target.value)} placeholder="Define el resultado esperado" required/></label>
      <button type="submit" className="xe-primary" disabled={!op.project||!op.objective.trim()}><Send size={15}/> Iniciar simulación</button>
    </form>}
    <label className="xe-speed">Velocidad <select value={op.engine.speed} onChange={e=>op.setSpeed(Number(e.target.value))}><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option></select></label>
  </>;
}
export function ActivityPanel(){
  const {logs}=useOperations();
  return <><h2>Actividad</h2><ul className="xe-log">{logs.map(e=><li key={e.id}><time>{e.time}</time><div><b>{e.agent}</b><p>{e.message}</p></div></li>)}</ul></>;
}
