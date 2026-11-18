import * as T from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import { department, type DepartmentId } from "../departments";
import type { EnvironmentState } from "../engine";
import { advanceTraveler, createTraveler, type OfficeClip } from "./activity";
import { rooms } from "./floor";

const assets=import.meta.glob<string>("./models/*.glb",{query:"?url",import:"default",eager:true});
export function disposeTree(root:T.Object3D) {
  const geometries=new Set<T.BufferGeometry>(), materials=new Set<T.Material>(), textures=new Set<T.Texture>();
  root.traverse(o=>{
    if(o instanceof T.Mesh){
      geometries.add(o.geometry);
      for(const m of Array.isArray(o.material)?o.material:[o.material]) materials.add(m);
      if(o instanceof T.SkinnedMesh)o.skeleton.dispose();
      if(o instanceof T.InstancedMesh)o.dispose();
    }
  });
  for(const m of materials){for(const v of Object.values(m))if(v instanceof T.Texture)textures.add(v);m.dispose();}
  for(const g of geometries)g.dispose();for(const t of textures)t.dispose();
}
export function createPeople(scene:T.Scene, loaded:(n:number)=>void, failed:(reason:string)=>void) {
  let disposed=false,ready=0;
  const loader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const actors=rooms.map((r,i)=>{
    const traveler=createTraveler(r,i),root=new T.Group();
    root.position.set(traveler.x,.043,traveler.z);root.rotation.y=traveler.angle;scene.add(root);
    const pick=new T.Mesh(new T.BoxGeometry(.65,1.96,.62),new T.MeshBasicMaterial({visible:false}));
    pick.position.y=.98;pick.userData.selection={kind:"agent",id:r.id};root.add(pick);
    const paper=new T.Mesh(new T.BoxGeometry(.24,.012,.31),new T.MeshStandardMaterial({color:"#f2eee0"}));
    paper.position.set(0,.96,.31);paper.rotation.x=-.55;paper.visible=false;root.add(paper);
    return {id:r.id,traveler,root,pick,paper,mixer:null as T.AnimationMixer|null,actions:new Map<OfficeClip,T.AnimationAction>(),current:null as T.AnimationAction|null};
  });
  function play(a:typeof actors[number],clip:OfficeClip) {
    const action=a.actions.get(clip);if(!action||a.current===action)return;
    action.reset();action.setEffectiveTimeScale(1);action.setEffectiveWeight(1);
    action.play();if(a.current)action.crossFadeFrom(a.current,.48,false);
    a.current=action;
  }
  async function loadPerson(a:typeof actors[number]) {
    const key=department(a.id).agent.toLowerCase();
    const gltf=await loader.loadAsync(assets["./models/"+key+".glb"]);
    if(disposed){disposeTree(gltf.scene);return;}
    gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;if(o instanceof T.SkinnedMesh)o.frustumCulled=false;}});
    const scale=[1,.99,.97,1.02,.98,.97,1.02][a.traveler.index];gltf.scene.scale.setScalar(scale);
    a.root.add(gltf.scene);a.mixer=new T.AnimationMixer(gltf.scene);
    for(const clip of gltf.animations)a.actions.set(clip.name as OfficeClip,a.mixer.clipAction(clip));
    if(!a.actions.has("Walk")||!a.actions.has("Typing"))throw new Error("Animación incompleta");
    play(a,a.traveler.clip);a.mixer.update(a.traveler.index*.123);
    ready++;loaded(ready);
  }
  // Two concurrent requests keep the first rooms interactive on mobile connections.
  let cursor=0;
  async function queue(){while(!disposed && cursor<actors.length){const a=actors[cursor++];try{await loadPerson(a);}catch(error){if(!disposed){console.warn("No se pudo cargar el modelo",a.id,error);failed("No se pudo cargar un modelo de la planta.");}return;}}}
  void queue();void queue();
  return {
    actors, pickers:actors.map(a=>a.pick),
    point(id:DepartmentId){const a=actors.find(a=>a.id===id)!;return a.traveler;},
    update(dt:number,t:number,env:EnvironmentState){
      const rate=env.mission?.phase==="running"?env.speed:1;
      for(const a of actors){
        advanceTraveler(a.traveler,dt*rate,t,env);
        const v=a.traveler;a.root.position.set(v.x,.045,v.z);a.root.rotation.y=v.angle;
        play(a,v.clip);a.paper.visible=v.clip==="Reading" && Boolean(a.mixer);
        if(!env.paused && env.agents?.[a.id]?.state!=="Pausado")a.mixer?.update(dt*rate);
      }
    },
    stop(){disposed=true;for(const a of actors){a.mixer?.stopAllAction();if(a.mixer)a.mixer.uncacheRoot(a.mixer.getRoot());}}
  };
}
