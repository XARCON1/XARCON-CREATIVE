import * as T from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createOffice } from "./architecture";
import { createPeople, disposeTree } from "./actors";
import { cameraRig } from "./cameras";
import { department } from "../departments";
import type { SceneAPI, SceneView, Selection } from "./types";

type Hooks={ select(s:Selection):void; loaded(n:number):void; fail(reason:string):void };
export function mountScene(host:HTMLDivElement,initial:SceneView,hooks:Hooks):SceneAPI {
  const canvas=document.createElement("canvas");
  const context=canvas.getContext("webgl2",{antialias:true,alpha:false,powerPreference:"high-performance"});
  if(!context)throw new Error("WebGL 2 no disponible");
  const renderer=new T.WebGLRenderer({canvas,context,antialias:true});
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.96;
  renderer.outputColorSpace=T.SRGBColorSpace;renderer.shadowMap.type=T.PCFShadowMap;
  canvas.tabIndex=0;canvas.setAttribute("aria-label","Planta corporativa 3D interactiva de XARCON");
  host.appendChild(canvas);
  const scene=new T.Scene();scene.background=new T.Color("#d5d9d1");scene.fog=new T.FogExp2("#d5d9d1",.0052);
  const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room,.04);
  scene.environment=environment.texture;scene.environmentIntensity=.43;room.dispose();pmrem.dispose();
  const camera=new T.PerspectiveCamera(36,1,.07,240);
  const ground=new T.Mesh(new T.PlaneGeometry(420,420),new T.MeshStandardMaterial({color:"#c4c8bb",roughness:1}));
  ground.rotation.x=-Math.PI/2;ground.position.y=-1.04;ground.receiveShadow=true;scene.add(ground);
  const hemi=new T.HemisphereLight("#f5faff","#a59580",1.10),sun=new T.DirectionalLight("#fff0d1",2.30);
  sun.position.set(-18,28,15);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);
  Object.assign(sun.shadow.camera,{left:-24,right:24,top:23,bottom:-23,near:1,far:87});sun.shadow.camera.updateProjectionMatrix();sun.shadow.bias=-.00025;sun.shadow.normalBias=.025;
  scene.add(hemi,sun,sun.target);
  const office=createOffice(scene),people=createPeople(scene,hooks.loaded,hooks.fail);
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rig=cameraRig(camera,canvas,id=>people.point(id),reduced);
  let view=initial, raf=0,stopped=false,width=1,height=1,t=0,prev=0,paint=0,screenAt=-10;
  let ema=1/40,autoScale=1,lastAdapt=0;
  const pointer=new T.Vector2(), ray=new T.Raycaster();
  const label=document.createElement("span");label.className="xe-scene-label";host.appendChild(label);
  function quality(){
    const simple=view.quality==="low"||(view.quality==="auto"&&(width<700||autoScale<.84));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,simple?1:1.65)*(view.quality==="auto"?autoScale:1));
    renderer.shadowMap.enabled=!simple;
    renderer.setSize(width,height,false);
  }
  function size(){
    width=Math.max(1,host.clientWidth);height=Math.max(1,host.clientHeight);camera.aspect=width/height;camera.updateProjectionMatrix();quality();
  }
  const resize=new ResizeObserver(size);resize.observe(host);size();rig.configure(view);rig.update(0);
  let downX=0,downY=0,downAt=0,pointers=0,dragged=false;
  const pdown=(e:PointerEvent)=>{if(!pointers){downX=e.clientX;downY=e.clientY;downAt=performance.now();dragged=false;}pointers++;if(pointers>1)dragged=true;};
  const pmove=(e:PointerEvent)=>{if(pointers && Math.hypot(e.clientX-downX,e.clientY-downY)>6)dragged=true;};
  function pick(e:PointerEvent){
    if(!pointers)return;pointers--;if(pointers||dragged||performance.now()-downAt>650)return;
    const bounds=canvas.getBoundingClientRect();pointer.set((e.clientX-bounds.left)/width*2-1,1-(e.clientY-bounds.top)/height*2);
    ray.setFromCamera(pointer,camera);
    const hits=ray.intersectObjects([...people.pickers,...office.pickers],false);
    if(hits.length)hooks.select(hits[0].object.userData.selection);
  }
  const cancel=()=>{pointers=0;dragged=true;};
  canvas.addEventListener("pointerdown",pdown);canvas.addEventListener("pointermove",pmove);canvas.addEventListener("pointerup",pick);canvas.addEventListener("pointercancel",cancel);
  const projected=new T.Vector3();
  function draw(now:number){
    if(stopped||document.hidden)return;
    raf=requestAnimationFrame(draw);
    const elapsed=prev?(now-prev)/1000:1/60;
    const budget=view.quality==="low"||reduced?1/24:1/48;
    if(now-paint < budget*1000-1)return;
    if(elapsed>.001&&elapsed<.5)ema=.94*ema+.06*elapsed;
    const dt=Math.min(.30,elapsed);prev=paint=now;
    if(!view.environment.paused)t+=dt;
    if(view.quality==="auto"&&now-lastAdapt>4500){
      const next=T.MathUtils.clamp(autoScale+(ema>.047?-.13:ema<.031?.06:0),.65,1);
      if(Math.abs(next-autoScale)>.005){autoScale=next;quality();}lastAdapt=now;
    }
    people.update(dt,t,view.environment);rig.update(Math.min(elapsed,1));
    if(t-screenAt>.25||screenAt<0){office.update(view.environment,t);screenAt=t;}
    const id=view.selection?.id??(view.mode==="follow"||view.mode==="department"?view.focus:null);
    if(id){
      const actor=people.point(id);projected.set(actor.x,actor.clip==="Typing"||actor.clip==="Monitor"||actor.clip==="Reading"?1.78:2.18,actor.z).project(camera);
      label.hidden=Math.abs(projected.x)>.95||Math.abs(projected.y)>.91||projected.z>1||projected.z< -1;
      label.textContent=department(id).agent;label.style.left=(projected.x*.5+.5)*100+"%";label.style.top=(.5-projected.y*.5)*100+"%";
    }else label.hidden=true;
    renderer.render(scene,camera);
  }
  function visibility(){cancelAnimationFrame(raf);prev=0;paint=0;if(!document.hidden&&!stopped)raf=requestAnimationFrame(draw);}
  const lost=(e:Event)=>{e.preventDefault();if(!stopped){stopped=true;cancelAnimationFrame(raf);hooks.fail("Se interrumpió el contexto gráfico.");}};
  canvas.addEventListener("webglcontextlost",lost,false);document.addEventListener("visibilitychange",visibility);visibility();
  return {update(next){const changed=view.quality!==next.quality,envChanged=view.environment!==next.environment;view=next;rig.configure(view);if(changed)quality();if(envChanged)screenAt=-10;},move:rig.move,dispose(){
    stopped=true;cancelAnimationFrame(raf);resize.disconnect();document.removeEventListener("visibilitychange",visibility);canvas.removeEventListener("webglcontextlost",lost);
    canvas.removeEventListener("pointerdown",pdown);canvas.removeEventListener("pointermove",pmove);canvas.removeEventListener("pointerup",pick);canvas.removeEventListener("pointercancel",cancel);
    rig.dispose();people.stop();disposeTree(scene);sun.shadow.dispose();environment.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();label.remove();
  }};
}
