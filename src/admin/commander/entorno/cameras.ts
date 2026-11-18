import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { rooms, roomById, walkable, type Point } from "./floor";
import type { CameraMode, Direction, SceneView } from "./types";
import type { DepartmentId } from "../departments";

export function cameraRig(camera:T.PerspectiveCamera,surface:HTMLCanvasElement,actor:(id:DepartmentId)=>Point & {angle:number;clip:string},reduced:boolean) {
  const orbit=new OrbitControls(camera,surface);
  orbit.enabled=false;orbit.enableDamping=true;orbit.dampingFactor=.095;orbit.minDistance=3;orbit.maxDistance=105;orbit.maxPolarAngle=Math.PI*.484;
  const target=new T.Vector3(), position=new T.Vector3(), goal=new T.Vector3(), aim=new T.Vector3();
  let mode:CameraMode="overview", focus:DepartmentId="command", initialized=false, cinemaTime=0, interiorYaw=.12, interiorPitch=-.05;
  const eye=new T.Vector3(.2,1.67,7.55), keys=new Set<Direction>();
  let pointer:number|null=null,lastX=0,lastY=0;
  const keyMap:Record<string,Direction>={w:"forward",arrowup:"forward",s:"back",arrowdown:"back",a:"left",arrowleft:"left",d:"right",arrowright:"right"};
  function key(e:KeyboardEvent,pressed:boolean){
    if(mode!=="interior" || !keyMap[e.key.toLowerCase()])return;
    e.preventDefault();const k=keyMap[e.key.toLowerCase()];if(pressed)keys.add(k);else keys.delete(k);
  }
  const down=(e:KeyboardEvent)=>key(e,true),up=(e:KeyboardEvent)=>key(e,false),clear=()=>keys.clear();
  function dragStart(e:PointerEvent){if(mode!=="interior")return;pointer=e.pointerId;lastX=e.clientX;lastY=e.clientY;surface.focus({preventScroll:true});surface.setPointerCapture(e.pointerId);}
  function drag(e:PointerEvent){if(pointer!==e.pointerId||mode!=="interior")return;interiorYaw-=(e.clientX-lastX)*.004;interiorPitch=T.MathUtils.clamp(interiorPitch-(e.clientY-lastY)*.003,-.90,.85);lastX=e.clientX;lastY=e.clientY;}
  function dragEnd(){pointer=null;}
  surface.addEventListener("keydown",down);surface.addEventListener("keyup",up);surface.addEventListener("blur",clear);
  surface.addEventListener("pointerdown",dragStart);surface.addEventListener("pointermove",drag);surface.addEventListener("pointerup",dragEnd);surface.addEventListener("pointercancel",dragEnd);
  window.addEventListener("blur",clear);
  function overview(){
    aim.set(0,.35,0);
    const direction=new T.Vector3(.53,.89,1.05).normalize(),right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),direction).normalize(),vertical=new T.Vector3().crossVectors(direction,right);
    const f=Math.tan(T.MathUtils.degToRad(camera.fov/2));
    let distance=1;
    for(const x of [-17.0,17.0])for(const y of [-1.05,3.4])for(const z of [-10.7,11.6]){
      const corner=new T.Vector3(x,y,z).sub(aim);
      distance=Math.max(distance,corner.dot(direction)+Math.max(Math.abs(corner.dot(right))/(f*camera.aspect),Math.abs(corner.dot(vertical))/f));
    }
    goal.copy(aim).addScaledVector(direction,distance*1.08);
  }
  function frameRoom(id:DepartmentId,drift=0){
    const r=roomById(id);
    aim.set(r.x,1.05,r.z-.47);
    const direction=r.side || -1;
    goal.set(r.x-direction*2.88+Math.sin(drift)*.42,2.22,r.z+2.67+Math.cos(drift)*.10);
  }
  function configure(view:SceneView){
    const changed=mode!==view.mode||focus!==view.focus;focus=view.focus;
    if(!changed)return;
    const last=mode;mode=view.mode;keys.clear();pointer=null;orbit.enabled=mode==="orbit";
    if(mode==="orbit"){orbit.target.copy(target);orbit.update();}
    if(mode==="interior"&&last!=="interior"){eye.set(.3,1.67,7.55);interiorYaw=.15;interiorPitch=-.04;surface.focus({preventScroll:true});}
    if(mode==="cinema")cinemaTime=0;
  }
  function update(dt:number) {
    if(mode==="orbit"){orbit.update();target.copy(orbit.target);position.copy(camera.position);return;}
    const lens=mode==="interior"?65:mode==="follow"?48:mode==="department"||mode==="cinema"?53:36;
    const nextFov=T.MathUtils.lerp(camera.fov,lens,1-Math.exp(-dt*5));
    if(Math.abs(camera.fov-nextFov)>.01){camera.fov=nextFov;camera.updateProjectionMatrix();}
    switch(mode){
      case "overview": overview();break;
      case "department":frameRoom(focus);break;
      case "follow":{
        const p=actor(focus),seated=["Monitor","Typing","Reading"].includes(p.clip);
        const sign=roomById(focus).side||1;
        aim.set(p.x,seated?1.03:1.24,p.z);
        goal.set(p.x+Math.cos(p.angle)*1.76*sign+Math.sin(p.angle)*.89,seated?1.79:1.93,p.z-Math.sin(p.angle)*1.76*sign+Math.cos(p.angle)*.89);break;
      }
      case "interior":{
        const forward=Number(keys.has("forward"))-Number(keys.has("back")), side=Number(keys.has("right"))-Number(keys.has("left"));
        const step=2.65*dt/Math.max(1,Math.hypot(forward,side));
        const dx=(-Math.sin(interiorYaw)*forward+Math.cos(interiorYaw)*side)*step,dz=(-Math.cos(interiorYaw)*forward-Math.sin(interiorYaw)*side)*step;
        if(walkable(eye.x+dx,eye.z))eye.x+=dx;if(walkable(eye.x,eye.z+dz))eye.z+=dz;
        goal.copy(eye);aim.set(eye.x-Math.sin(interiorYaw)*Math.cos(interiorPitch)*3,eye.y+Math.sin(interiorPitch)*3,eye.z-Math.cos(interiorYaw)*Math.cos(interiorPitch)*3);break;
      }
      case "cinema":{
        cinemaTime+=dt;const shot=Math.floor(cinemaTime/7)%(rooms.length+1);
        if(!shot)overview();else frameRoom(rooms[shot-1].id,cinemaTime*.27);
        break;
      }
    }
    const alpha=!initialized||reduced?1:1-Math.exp(-dt*(mode==="interior"?7.8:mode==="cinema"?1.35:3.25));
    position.lerp(goal,alpha);target.lerp(aim,alpha);camera.position.copy(position);camera.lookAt(target);initialized=true;
  }
  return {configure,update,move(dir:Direction,pressed:boolean){if(pressed)keys.add(dir);else keys.delete(dir);},dispose(){
    orbit.dispose();window.removeEventListener("blur",clear);
    surface.removeEventListener("keydown",down);surface.removeEventListener("keyup",up);surface.removeEventListener("blur",clear);
    surface.removeEventListener("pointerdown",dragStart);surface.removeEventListener("pointermove",drag);surface.removeEventListener("pointerup",dragEnd);surface.removeEventListener("pointercancel",dragEnd);
  }};
}
