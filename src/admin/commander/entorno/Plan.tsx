import { useEffect, useRef } from "react";
import { department } from "../departments";
import { readAgent, type EnvironmentState } from "../engine";
import { rooms } from "./floor";
import { advanceTraveler, createTraveler } from "./activity";
import type { Selection } from "./types";

export default function Plan({environment,select,selected}:{environment:EnvironmentState;select(s:Selection):void;selected:Selection|null}){
  const points=useRef<(SVGCircleElement|null)[]>([]),current=useRef(environment);
  useEffect(()=>{current.current=environment;},[environment]);
  useEffect(()=>{
    const actors=rooms.map(createTraveler);let time=0,last=performance.now();
    const paint=()=>{const now=performance.now(),dt=Math.min(.25,(now-last)/1000);last=now;if(document.hidden)return;
      const env=current.current;if(!env.paused)time+=dt;
      actors.forEach((a,i)=>{advanceTraveler(a,dt*(env.mission?.phase==="running"?env.speed:1),time,env);points.current[i]?.setAttribute("cx",String(a.x));points.current[i]?.setAttribute("cy",String(a.z));});
    };
    paint();const timer=setInterval(paint,120);return()=>clearInterval(timer);
  },[]);
  const choose=(s:Selection)=>(e:React.KeyboardEvent<SVGGElement>)=>{if(e.key===" "||e.key==="Enter"){e.preventDefault();select(s);}};
  return <svg className="xe-plan" viewBox="-18.3 -12 36.6 24" role="group" aria-label="Plano interactivo de la planta corporativa">
    <rect x="-16.2" y="-10" width="32.4" height="20" rx=".18" fill="#ebe8db" stroke="#637776" strokeWidth=".12"/>
    <path d="M-5.6 -9.5v19M5.6 -9.5v19M-5.6 1.65H5.6" fill="none" stroke="#b4b4a4" strokeWidth=".10" strokeDasharray=".22 .24"/>
    {rooms.map(r=>{const d=department(r.id),a=readAgent(r.id,environment);const s:Selection={id:r.id,kind:"office"},station:Selection={id:r.id,kind:"station"};
      return <g key={r.id}>
        <g role="button" tabIndex={0} aria-label={r.title+" · "+d.agent} onClick={()=>select(s)} onKeyDown={choose(s)}>
          <rect x={r.x-r.w/2} y={r.z-r.d/2} width={r.w} height={r.d} rx=".11" fill={selected?.id===r.id?"#b8d5ce":r.finish} stroke="#697c77" strokeWidth=".1"/>
          <text x={r.x} y={r.z-1.85} textAnchor="middle" fill="#233b3b" fontSize=".54" fontWeight="700">{d.agent}</text>
        </g>
        <g role="button" tabIndex={0} aria-label={"Estación de "+d.agent} onClick={()=>select(station)} onKeyDown={choose(station)}>
          <rect x={r.x-1.82} y={r.z-1.05} width="3.64" height="1.12" rx=".12" fill="#f1e6cf" stroke="#707b76" strokeWidth=".08"/>
          <path d={`M${r.x-.75} ${r.z-.76}h1.5`} stroke={a.state==="Ejecutando"?"#00a8a4":"#586f74"} strokeWidth=".20"/>
        </g>
      </g>;})}
    <rect x="-2.23" y="4.17" width="4.46" height="1.6" fill="#b39872" rx=".23"/><text x="0" y="5.16" textAnchor="middle" fontSize=".42" fill="#283e3e">Reuniones</text>
    <rect x="-1.6" y="8.3" width="3.2" height=".60" fill="#a18466"/>
    {rooms.map((r,i)=>{const s:Selection={kind:"agent",id:r.id};return <g key={r.id} role="button" tabIndex={0} aria-label={"Agente "+department(r.id).agent} onClick={()=>select(s)} onKeyDown={choose(s)}>
      <circle ref={n=>{points.current[i]=n;}} cx={r.seat.x} cy={r.seat.z} r=".35" fill="#1f5c63" stroke="#fffae9" strokeWidth=".12"/>
    </g>;})}
  </svg>;
}
