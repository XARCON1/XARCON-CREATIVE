import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Building2, Check, ChevronDown, Compass, Crosshair, Film, Flag, Layers3, Map, Maximize2, Minimize2, MousePointer2, Orbit, RotateCcw, Settings2, X } from "lucide-react";
import { Symbol } from "../../../components/Logo";
import { useOperations } from "../Operations";
import { department, type DepartmentId } from "../departments";
import { rooms } from "./floor";
import { cameras, type CameraMode, type Direction, type Quality, type SceneAPI, type SceneView, type Selection } from "./types";
import { ActivityPanel, AgentPanel, MissionPanel } from "./OfficePanels";
import Plan from "./Plan";
import "./entorno.css";

const icons={overview:Layers3,orbit:Orbit,department:Building2,follow:Crosshair,interior:Compass,cinema:Film};
const qualityLabels:Record<Quality,string>={auto:"Automática",high:"Alta",low:"Ligera",plan:"Plano 2D"};
type Panel="rooms"|"agent"|"mission"|"activity"|"settings"|null;
export default function Entorno() {
  const op=useOperations();
  const [mode,setMode]=useState<CameraMode>("overview"),[quality,setQuality]=useState<Quality>("auto");
  const [panel,setPanel]=useState<Panel>(null),[focus,setFocus]=useState<DepartmentId>("command"),[selected,setSelected]=useState<Selection|null>(null);
  const [failed,setFailed]=useState(""),[ready,setReady]=useState(0),[full,setFull]=useState(false),[expanded,setExpanded]=useState(false);
  const map=quality==="plan"||failed;
  const host=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null),api=useRef<SceneAPI|null>(null);
  const view=useRef<SceneView>({mode,quality,focus,selection:selected,environment:op.engine});
  function select(s:Selection){setSelected(s);setFocus(s.id);setPanel("agent");}
  useLayoutEffect(()=>{
    view.current={mode,quality,focus,selection:selected,environment:op.engine};api.current?.update(view.current);
  },[mode,quality,focus,selected,op.engine]);
  useEffect(()=>{
    if(map||!host.current)return;
    let alive=true;const root=host.current;setReady(0);
    import("./scene").then(({mountScene})=>{
      if(!alive)return;
      api.current=mountScene(root,view.current,{select,loaded:n=>{if(alive)setReady(n);},fail:(reason)=>{if(alive)setFailed(reason); }});
    }).catch((error:unknown)=>{if(alive){console.warn("XARCON Entorno",error);setFailed(error instanceof Error && error.message.includes("WebGL 2") ? "WebGL 2 no está disponible en este navegador." : "No se pudo abrir la vista 3D.");}});
    return()=>{alive=false;api.current?.dispose();api.current=null;};
  },[map]);
  useEffect(()=>{
    const change=()=>setFull(document.fullscreenElement===stage.current);
    const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){setPanel(null);setExpanded(false);}};
    document.addEventListener("fullscreenchange",change);window.addEventListener("keydown",escape);
    const title=document.title;document.title="XARCON Entorno · Commander";
    return()=>{document.title=title;document.removeEventListener("fullscreenchange",change);window.removeEventListener("keydown",escape);};
  },[]);
  function switchPanel(next:Panel){setPanel(p=>p===next?null:next);}
  function camera(next:CameraMode){
    setMode(next);setPanel(null);
    if(map){setFailed("");setQuality("auto");}
    if(next==="overview"){setSelected(null);}
  }
  async function fullscreen() {
    try {
      if(document.fullscreenElement){await document.exitFullscreen();return;}
      if(expanded){setExpanded(false);return;}
      if(stage.current?.requestFullscreen){await stage.current.requestFullscreen();}else setExpanded(true);
    }catch{setExpanded(v=>!v);}
  }
  const Cam=icons[mode], mission=op.mission;
  const missionLabel=mission?.phase==="review"?"Aprobación pendiente":mission?.phase==="done"?"Misión aprobada":op.paused?"Misión en pausa":op.active?department(op.active).agent+" en operación":"Sin misión activa";
  const caption=map?"Plano interactivo":mode==="interior"?"Arrastra para mirar · WASD o flechas para caminar":mode==="orbit"?"Arrastra para girar · rueda o pellizco para acercar":mode==="cinema"?"Recorrido automático":mode==="follow"?"Siguiendo a "+department(focus).agent:"Selecciona un agente o una estación";
  return <main id="hq-main" tabIndex={-1} className={"xe"+(expanded?" xe-expanded":"")} ref={stage}>
    <header className="xe-header">
      <div className="xe-brand"><span className="xe-logo"><Symbol/></span><strong>XARCON</strong><i/><span>Entorno</span></div>
      <span className="xe-sim"><i/> Simulación</span>
      <div className="xe-header-right"><Link to="/admin/commander"><ArrowLeft size={16}/><span>Commander</span></Link>
        <button className={panel==="settings"?"selected":""} aria-label="Calidad gráfica" aria-expanded={panel==="settings"} title="Calidad gráfica" onClick={()=>switchPanel("settings")}><Settings2 size={17}/></button>
        <button aria-label={full||expanded?"Salir de pantalla completa":"Pantalla completa"} title="Pantalla completa" onClick={()=>void fullscreen()}>{full||expanded?<Minimize2 size={17}/>:<Maximize2 size={17}/>}</button>
      </div>
    </header>
    <div className="xe-viewport">
      {map?<Plan environment={op.engine} select={select} selected={selected}/>:<div className="xe-canvas" ref={host}/>}
      <div className={"xe-title"+(!map&&mode!=="orbit"&&mode!=="overview"?" xe-title-detail":"")}><span className="xe-level"><i/> Planta 01</span><h1>Sede corporativa</h1></div>
      <button className={"xe-live"+(mission?" active":"")} aria-expanded={panel==="mission"} onClick={()=>switchPanel("mission")}><Flag size={14}/><span>{missionLabel}</span><ChevronDown size={13}/></button>
      {!map&&ready<rooms.length&&<div className="xe-load" role="status"><i/> {ready ? "Cargando agentes · "+ready+"/7":"Preparando la planta 3D"}</div>}
      {failed&&<div className="xe-fallback" role="status">{failed} <button onClick={()=>{setFailed("");setQuality("low");}}>Reintentar 3D</button></div>}
      {mode==="interior"&&!map&&<div className="xe-dpad" aria-label="Desplazamiento interior">
        {([["left",ArrowLeft,"Izquierda"],["forward",ArrowUp,"Avanzar"],["back",ArrowDown,"Retroceder"],["right",ArrowRight,"Derecha"]] as const).map(([d,I,label])=><button key={d} aria-label={label} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);api.current?.move(d as Direction,true);}} onPointerUp={()=>api.current?.move(d,false)} onLostPointerCapture={()=>api.current?.move(d,false)} onPointerCancel={()=>api.current?.move(d,false)} onKeyDown={e=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();api.current?.move(d,true);}}} onKeyUp={()=>api.current?.move(d,false)} onBlur={()=>api.current?.move(d,false)}><I size={17}/></button>)}
      </div>}
      {panel&&<aside className="xe-panel" aria-label={panel==="agent"?"Ficha de agente":panel==="rooms"?"Departamentos":panel==="settings"?"Calidad gráfica":panel==="mission"?"Control de misión":"Registro de actividad"}>
        <button className="xe-close" aria-label="Cerrar panel" onClick={()=>setPanel(null)}><X size={17}/></button>
        {panel==="agent"&&selected&&<AgentPanel selection={selected} follow={()=>camera("follow")} room={()=>camera("department")}/>}
        {panel==="rooms"&&<><h2>Departamentos</h2><div className="xe-rooms">{rooms.map(r=>{const d=department(r.id);return <button key={r.id} onClick={()=>{select({kind:"office",id:r.id});if(!map)setMode("department");}}><i style={{background:r.tint}}/><span><b>{d.agent}</b><small>{r.title}</small></span><ArrowRight size={14}/></button>;})}</div></>}
        {panel==="mission"&&<MissionPanel onStage={s=>{select(s);if(!map)setMode("department");}}/>}
        {panel==="activity"&&<ActivityPanel/>}
        {panel==="settings"&&<><h2>Calidad gráfica</h2><div className="xe-options">{(Object.keys(qualityLabels) as Quality[]).map(q=><button key={q} aria-pressed={(failed?"plan":quality)===q} onClick={()=>{setQuality(q);setFailed("");setPanel(null);}}><span>{qualityLabels[q]}</span>{(failed?"plan":quality)===q&&<Check size={16}/>}</button>)}</div></>}
      </aside>}
    </div>
    <nav className="xe-toolbar" aria-label="Herramientas de la sede">
      <div className="xe-camera-select">{map?<Map size={17}/>:<Cam size={17}/>}<select aria-label="Perspectiva de cámara" value={map?"plan":mode} onChange={e=>camera(e.target.value as CameraMode)}>{map&&<option value="plan">Plano 2D</option>}{(Object.keys(cameras) as CameraMode[]).map(c=><option key={c} value={c}>{cameras[c]}</option>)}</select><ChevronDown size={13}/></div>
      <button title="Departamentos" className={panel==="rooms"?"selected":""} aria-expanded={panel==="rooms"} onClick={()=>switchPanel("rooms")}><Building2 size={17}/><span>Departamentos</span></button>
      <button title="Misiones" className={panel==="mission"?"selected":""} aria-expanded={panel==="mission"} onClick={()=>switchPanel("mission")}><Flag size={16}/><span>Misiones</span></button>
      <button title="Actividad" className={panel==="activity"?"selected":""} aria-expanded={panel==="activity"} onClick={()=>switchPanel("activity")}><Activity size={17}/><span>Actividad</span></button>
      <span className="xe-hint"><MousePointer2 size={13}/>{caption}</span>
      <button className="xe-reset" aria-label="Volver a la vista general" title="Volver a la vista general" onClick={()=>camera("overview")}><RotateCcw size={16}/></button>
    </nav>
  </main>;
}
