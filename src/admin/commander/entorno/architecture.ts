import * as T from "three";
import { department, type DepartmentId } from "../departments";
import type { EnvironmentState } from "../engine";
import { rooms, type Room } from "./floor";
import { builder, type Kit } from "./materials";
import { lettering, makeScreen } from "./displays";
import type { Selection } from "./types";

function chair(k:Kit,x:number,z:number,angle=0,lounge=false) {
  const {box,cyl,rod,p}=k, c=Math.cos(angle),s=Math.sin(angle);
  function at(dx:number,dz:number){return [x+dx*c+dz*s,z+dz*c-dx*s];}
  function part(m:T.Material,dx:number,y:number,dz:number,w:number,h:number,d:number){
    const [px,pz]=at(dx,dz);box(m,px,y,pz,w,h,d,angle);
  }
  cyl(p.dark,x,.25,z,.083,.35);
  for(let i=0;i<5;i++){const v=i*2*Math.PI/5;rod(p.silver,[x,.16,z],[x+Math.sin(v)*.32,.08,z+Math.cos(v)*.32],.033);}
  part(lounge?p.fabric:p.teal,0,.452,0,.53,.105,.50);part(lounge?p.fabric:p.teal,0,.79,.245,.48,.54,.075);
  for(const side of [-1,1]){part(p.dark,side*.273,.56,.025,.032,.23,.04);part(p.black,side*.273,.677,.01,.053,.041,.25);}
}
function monitor(k:Kit,scene:T.Scene,texture:T.Material,x:number,z:number,w=1.22,y=.82,angle=0) {
  const {box,p}=k;
  box(p.dark,x,y+.025,z+.025,.47,.044,.29,angle);box(p.silver,x,y+.24,z,.075,.45,.07,angle);
  box(p.black,x,y+.61,z,w,.65,.063,angle);
  const mesh=new T.Mesh(new T.PlaneGeometry(w-.043,.60),texture);
  mesh.position.set(x+Math.sin(angle)*.037,y+.62,z+Math.cos(angle)*.037);mesh.rotation.y=angle;scene.add(mesh);
}
function desk(k:Kit,scene:T.Scene,r:Room,screen:T.Material) {
  const {box,cyl,p}=k,{x,z}=r,cz=z-.55;
  box(p.oak,x,.79,cz,3.55,.085,1.08);
  for (const dx of [-1.47,1.47]) {
    box(p.dark,x+dx,.395,cz,.085,.74,.74);box(p.dark,x+dx,.055,cz,.33,.055,.82);
  }
  box(p.shadow,x,.64,cz-.34,3.0,.16,.075);
  const twin=r.id==="engineering"||r.id==="command"||r.id==="quality";
  if(twin){monitor(k,scene,screen,x-.65,cz-.26,1.12,.84,.12);monitor(k,scene,screen,x+.57,cz-.26,1.12,.84,-.12);}
  else monitor(k,scene,screen,x-.15,cz-.26,1.42);
  box(p.dark,x-.03,.848,cz+.24,.71,.027,.245);
  for(let i=0;i<10;i++){for(let j=0;j<3;j++)box(p.silver,x-.32+i*.063,.865,cz+.18+j*.066,.044,.007,.036);}
  box(p.dark,x+.52,.857,cz+.22,.095,.038,.15);
  cyl(p.chalk,x-1.27,.94,cz+.17,.134,.19);cyl(p.shadow,x-1.27,1.036,cz+.17,.112,.004);
  box(p.terra,x+1.2,.858,cz+.05,.42,.035,.55,-.15);box(p.chalk,x+1.20,.885,cz+.05,.38,.018,.52,-.15);
  chair(k,r.seat.x,r.seat.z);
}
function glassX(k:Kit,x:number,z:number,depth:number,height=2.55) {
  const {box,p}=k;
  box(p.glass,x,height/2,z,.045,height,depth);box(p.silver,x,height+.015,z,.063,.062,depth);
  box(p.silver,x,.075,z,.05,.10,depth);
  for(const side of [-1,1])box(p.dark,x,height/2,z+side*(depth/2-.03),.072,height,.072);
  box(p.stripe,x,1.18,z,.051,.022,depth);
}
function glassZ(k:Kit,x:number,z:number,width:number,height=2.55) {
  const {box,p}=k;
  box(p.glass,x,height/2,z,width,height,.045);box(p.silver,x,height+.015,z,width,.062,.063);
  box(p.silver,x,.075,z,width,.10,.06);
  for(const side of [-1,1])box(p.dark,x+side*(width/2-.035),height/2,z,.070,height,.070);
  box(p.stripe,x,1.18,z,width,.022,.052);
}
function sideRoom(k:Kit,scene:T.Scene,r:Room,screen:T.Material) {
  const {p,box,cyl,rod,plant}=k,{x,z,side}=r;
  const accent=new T.MeshStandardMaterial({color:r.tint,roughness:.8});
  const panel=new T.MeshStandardMaterial({color:r.finish,roughness:.70,map:p.timber.map});
  box(panel,x,.015,z,r.w,.04,r.d);
  for(let i=-5;i<=5;i++)box(p.timber,x+(i*.71),.038,z,.012,.005,r.d-.07);
  box(accent,x,.046,z+.02,4.78,.016,2.95);
  glassX(k,side*7.4,z-1.83,2.76);glassX(k,side*7.4,z+2.40,1.54);
  if(z<6)glassZ(k,x,z+3.23,8.44);
  const wallZ=z-3.06;
  box(p.navy,x,1.28,wallZ,5.05,2.55,.13);
  for(let i=0;i<15;i++)box(p.timber,x-3.73+i*.113,1.27,wallZ,.063,2.49,.20);
  box(p.brass,x,2.56,wallZ,5.06,.029,.16);
  lettering(scene,department(r.id).agent,r.title.toLocaleUpperCase("es"),x,1.81,wallZ+.071,3.18,.80);
  box(p.light,x,2.43,wallZ+.13,3.89,.024,.04);
  const outer=x+side*3.48;
  box(p.oak,outer,.66,z-1.20,.76,1.22,2.6);
  if(r.id==="engineering"||r.id==="quality"){
    for(let i=0;i<2;i++){
      const timeZ=z-1.94+i*1.26;
      box(p.navy,outer,1.54,timeZ,.63,1.68,.98);
      for(let j=0;j<7;j++){
        box(p.black,outer-side*.33,1.05+j*.17,timeZ,.04,.12,.82);
        box(j%3?p.blue:p.light,outer-side*.36,1.08+j*.17,timeZ+.26,.012,.019,.086);
      }
    }
  }else if(r.id==="design"){
    for(let i=0;i<6;i++){box(i%3===0?p.teal:i%3===1?p.terra:p.chalk,outer,1.32+i*.04,z-1.7+(i%2)*.5,.55,.03,.61,i*.13);}
    for(let i=0;i<4;i++)box(i%2?p.terra:p.fabric,x+1.05+i*.39,1.24,wallZ+.095,.29,.32,.04);
  }else if(r.id==="marketing"){
    const tx=outer-side*.83,tz=z-1.8;
    for(let i=0;i<3;i++)rod(p.black,[tx,1.38,tz],[tx+Math.cos(i*2.094)*.39,.07,tz+Math.sin(i*2.094)*.39],.046);
    box(p.black,tx,1.52,tz,.39,.27,.32);cyl(p.black,tx,1.74,tz,.2,.045);box(p.silver,tx,1.52,tz+.21,.16,.14,.15);
    box(p.chalk,outer,1.80,z-.42,.46,.84,.50,-.35);
  }else{
    for(let i=0;i<11;i++){
      const v=i%4;box(v===0?p.teal:v===1?p.chalk:v===2?p.terra:p.navy,outer,1.47,z-2.21+i*.15,.51,.36+i%3*.076,.095);
    }
    if(r.id==="sales"){cyl(p.timber,x-side*2.9,.72,z-1.73,1.00,.08);cyl(p.dark,x-side*2.9,.38,z-1.73,.14,.70);}
  }
  plant(x-side*2.99,z-2.53,.77);
  desk(k,scene,r,screen);
}
export function createOffice(scene:T.Scene) {
  const k=builder(scene),{p,box,cyl,plant}=k;
  const screens=new Map<DepartmentId,ReturnType<typeof makeScreen>>();
  const pickers:T.Object3D[]=[];
  const pickGeo=new T.BoxGeometry(1,1,1);
  const invisible=new T.MeshBasicMaterial({visible:false});
  function hit(selection:Selection,x:number,y:number,z:number,w:number,h:number,d:number){
    const mesh=new T.Mesh(pickGeo,invisible);mesh.userData.selection=selection;
    mesh.position.set(x,y,z);mesh.scale.set(w,h,d);scene.add(mesh);pickers.push(mesh);
  }
  // Sectioned slab and a continuous street-facing glazed envelope.
  box(p.shadow,0,-.78,0,33.1,.49,21.1);box(p.brass,0,-.51,0,32.94,.075,20.97);
  box(p.stone,0,-.27,0,33.2,.41,21.18);box(p.floor,0,-.046,0,32.36,.09,20.36);
  for(let x=-15;x<16;x+=1.5)box(p.fabric,x,-.0005,0,.012,.008,20.24);
  for(let z=-9;z<10;z+=1.5)box(p.fabric,0,-.0005,z,32.22,.008,.012);
  for(const side of [-1,1]){
    for(let i=0;i<7;i++)glassX(k,side*16.0,-8.57+i*2.855,2.84,2.86);
    for(let i=0;i<5;i++)glassZ(k,side*(3.29+i*2.80),10.0,2.79,2.55);
    for(let i=0;i<5;i++)glassZ(k,side*(2.39+i*3),-10.0,2.98,2.98);
    for(let z=-9.9;z<=10;z+=4.95)box(p.stone,side*16,1.53,z,.23,3.06,.26);
    box(p.stone,side*16,3.03,0,.36,.22,20.35);
    box(p.timber,side*15.6,2.92,0,.27,.12,19.95);
    box(p.brass,side*4.8,.013,.1,.035,.011,18.8);
    plant(side*5.85,-8.85,1.35);
  }
  box(p.stone,0,3.03,-10,32.36,.25,.30);
  // Recessed operations theatre, oak fins and luminous corporate wordmark.
  const core=rooms[0];const coreDisplay=makeScreen("command");screens.set("command",coreDisplay);
  box(p.timber,0,.012,-5.50,8.2,.045,7.8);
  box(p.teal,0,.043,-5.5,5.2,.017,3.9);
  box(p.navy,0,1.61,-9.37,8.32,3.2,.20);
  for(let i=0;i<11;i++)for(const side of [-1,1])box(p.timber,side*(2.36+i*.157),1.62,-9.19,.083,3.15,.23);
  lettering(scene,"XARCON","CENTRO DE OPERACIONES",0,2.15,-9.259,4.30,1.08);
  const wallDisplay=new T.Mesh(new T.PlaneGeometry(3.1,.92),coreDisplay.material);
  wallDisplay.position.set(0,1.04,-9.248);scene.add(wallDisplay);
  glassX(k,-4.1,-5.5,7.8);glassX(k,4.1,-5.5,7.8);glassZ(k,-2.65,-1.63,2.89);glassZ(k,2.65,-1.63,2.89);
  desk(k,scene,core,coreDisplay.material);
  for(const r of rooms){
    if(r.side){const display=makeScreen(r.id);screens.set(r.id,display);sideRoom(k,scene,r,display.material);}
    hit({id:r.id,kind:"office"},r.x,.022,r.z,r.w,.08,r.d);
    hit({id:r.id,kind:"station"},r.x,1.0,r.z-.60,3.57,1.54,1.10);
  }
  // Shared boardroom and reception gallery.
  box(p.fabric,0,.016,4.95,6.35,.027,4.15);
  box(p.oak,0,.82,4.97,4.48,.12,1.55);
  for(const x of [-1.55,1.55])box(p.dark,x,.42,4.97,.29,.75,1.05);
  for(const z of [4.25,5.65]){chair(k,-2.85,z,-Math.PI/2,true);chair(k,2.85,z,Math.PI/2,true);}
  for(const x of [-1.35,1.32]){
    box(p.navy,x,.908,5.1,.56,.037,.37);
    k.piece("box",p.black,x,1.08,4.94,.56,.34,.027,-.15,0,0);
  }
  plant(.05,4.94,.27,.89);
  box(p.timber,0,.52,8.6,3.2,1.0,.68);box(p.chalk,0,1.07,8.58,3.32,.10,.76);
  for(let i=0;i<22;i++)box(p.oak,-1.48+i*.14,.52,8.959,.047,.94,.061);
  lettering(scene,"XARCON","SEDE CORPORATIVA",0,.65,9.004,2.15,.53);
  for(const x of [-4.20,4.2])plant(x,8.55,1.26);
  // Exterior entry treads terminate at the cut face of the model.
  for(let i=0;i<3;i++)box(p.stone,0,-.17-i*.19,10.55+i*.34,3.72,.16,.55);
  k.flush();
  return {pickers,update(state:EnvironmentState,t:number){for(const display of screens.values())display.draw(state,t);}};
}
