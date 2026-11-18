import { flow, type DepartmentId } from "../departments";
import { HANDOFF_AT, readAgent, RELEASE_AT, STAGE_MS, type EnvironmentState } from "../engine";
import { nodeId, roomById, route, waypoint, type Room } from "./floor";

export type OfficeClip = "Idle" | "Walk" | "Typing" | "Reading" | "Monitor" | "Discuss";
type Cue = { node:string; clip:OfficeClip; angle:number };
function handoff(from:DepartmentId,to:DepartmentId,sender:boolean):Cue {
  const crossWing=roomById(from).side*roomById(to).side<0;
  const place=sender?"deliver":"receive";
  const node=crossWing ? "hub/"+place : nodeId(to,place);
  const facingAcross=crossWing||to==="command";
  const angle=facingAcross?(sender?-1:1)*Math.PI/2:sender?Math.PI:0;
  return {node,clip:"Discuss",angle};
}
function cue(r:Room,index:number,t:number,env:EnvironmentState):Cue {
  const seat: Cue = {node:nodeId(r.id,"desk"),clip:r.id==="finance"||r.id==="sales"?"Reading":r.id==="command"||r.id==="quality"?"Monitor":"Typing",angle:Math.PI};
  const board: Cue = {node:nodeId(r.id,"board"),clip:"Idle",angle:r.side ? r.side*1.0+Math.PI : Math.PI};
  const measured=env.agents?.[r.id];
  if(measured) {
    if(measured.state==="Colaborando"||measured.state==="Esperando aprobación") return {node:nodeId(r.id,"lounge"),clip:"Discuss",angle:index%2?Math.PI/2:-Math.PI/2};
    if(measured.state==="Error"||measured.state==="Esperando información") return board;
    if(measured.state!=="Disponible") return seat;
  }
  const m=env.mission;
  if (m && m.phase!=="done") {
    const a=readAgent(r.id,env);
    if (r.id==="command" && m.phase==="review") return {node:nodeId("command","receive"),clip:"Discuss",angle:.8};
    if (m.phase==="running") {
      const part=m.elapsed/STAGE_MS;
      const current=flow[m.step],next=flow[m.step+1]??"command";
      if(part>=HANDOFF_AT && (r.id===current||r.id===next)) return handoff(current,next,r.id===current);
      if (m.step>0 && part<RELEASE_AT && (r.id===flow[m.step-1]||r.id===current)) return handoff(flow[m.step-1],current,r.id!==current);
      if(r.id===current || r.id==="command") return seat;
      if(a.state==="Completado") return part<.42 ? board : seat;
    }
  }
  const cycle=(t+index*11.7)%80;
  if(cycle<42) return seat;
  if(cycle<56) return board;
  if(cycle<74) return {node:nodeId(r.id,"lounge"),clip:"Discuss",angle:index%2?Math.PI/2:-Math.PI/2};
  return seat;
}
export type Traveler = { id:DepartmentId; index:number; x:number; z:number; angle:number; clip:OfficeClip; at:string; target:string; path:string[]; wait:number };
export function createTraveler(r:Room,index:number):Traveler {
  const at=nodeId(r.id,index===2||index===5?"lounge":index===3?"board":"desk");
  const p=waypoint(at);
  return { id:r.id,index,...p,angle:at.endsWith("lounge")?(index%2?1:-1)*Math.PI/2:Math.PI,clip:at.endsWith("desk")?"Monitor":"Idle",at,target:at,path:[],wait:0 };
}
function turn(actor:Traveler,angle:number,dt:number) {
  const delta=Math.atan2(Math.sin(angle-actor.angle),Math.cos(angle-actor.angle));
  actor.angle+=delta*(1-Math.exp(-9*dt));
}
export function advanceTraveler(a:Traveler,dt:number,t:number,env:EnvironmentState) {
  if(env.paused||env.agents?.[a.id]?.state==="Pausado") return;
  const desired=cue(roomById(a.id),a.index,t,env);
  if(desired.node!==a.target) {
    // Finish the current corridor segment before taking a new branch.
    const via=a.path[0]??a.at;
    a.path=[...(a.path.length?[via]:[]),...route(via,desired.node)];
    if (a.at.endsWith("/desk") && a.clip!=="Walk" && a.path.length) {a.wait=.45;a.clip="Idle";}
    a.target=desired.node;
  }
  if(a.wait>0){a.wait-=dt;return;}
  let travel=(1.32+(a.index%3)*.06)*dt;
  while(a.path.length && travel>0) {
    const key=a.path[0],p=waypoint(key),dx=p.x-a.x,dz=p.z-a.z,dist=Math.hypot(dx,dz);
    a.clip="Walk";
    if(dist>.001)turn(a,Math.atan2(dx,dz),dt);
    if(dist<=travel){a.x=p.x;a.z=p.z;a.at=key;a.path.shift();travel-=dist;}
    else{a.x+=dx/dist*travel;a.z+=dz/dist*travel;travel=0;}
  }
  if(!a.path.length){a.clip=desired.clip;turn(a,desired.angle,dt);}
}

