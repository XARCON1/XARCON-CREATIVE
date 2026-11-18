import * as T from "three";
import { department } from "../departments";
import { canvasTexture, type Kit } from "./materials";
import type { Room } from "./floor";

function wallArt(scene:T.Scene, art:T.CanvasTexture,x:number,y:number,z:number,w:number,h:number) {
  const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:art,roughness:.82}));
  mesh.position.set(x,y,z);scene.add(mesh);return mesh;
}
function brandMark(scene:T.Scene,k:Kit,x:number,y:number,z:number,size:number){
  const shape=new T.Shape();const outline=[[4,4],[16,4],[24,16],[32,4],[44,4],[30,24],[44,44],[32,44],[24,32],[16,44],[4,44],[18,24]];
  outline.forEach(([px,py],i)=>{const a=(px-24)/40,b=(24-py)/40;if(i===0)shape.moveTo(a,b);else shape.lineTo(a,b);});shape.closePath();
  const geometry=new T.ExtrudeGeometry(shape,{depth:.075,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:2});
  const mark=new T.Mesh(geometry,k.p.brass);mark.scale.setScalar(size);mark.position.set(x,y,z);mark.castShadow=true;scene.add(mark);
}
function sofa(k:Kit,x:number,z:number,angle:number) {
  const {p,box}=k;
  function part(m:T.Material,dx:number,y:number,dz:number,w:number,h:number,d:number){
    const px=x+dx*Math.cos(angle)+dz*Math.sin(angle),pz=z+dz*Math.cos(angle)-dx*Math.sin(angle);
    box(m,px,y,pz,w,h,d,angle);
  }
  part(p.shadow,0,.18,.03,.72,.12,.67);part(p.terra,0,.38,0,.84,.25,.74);
  part(p.terra,0,.69,.32,.86,.52,.15);part(p.fabric,0,.52,-.03,.62,.11,.56);
  for(const side of [-1,1])part(p.terra,side*.36,.56,.01,.14,.34,.70);
}
export function departmentFitout(scene:T.Scene,k:Kit,r:Room) {
  const {box,cyl,p}=k,{x,z,side}=r,wall=r.z-2.96,d=department(r.id);
  const {ctx,texture}=canvasTexture(512,256);
  ctx.fillStyle="#ebecdf";ctx.fillRect(0,0,512,256);
  ctx.fillStyle="#2d4952";ctx.font="bold 22px Arial";ctx.fillText(d.title.toUpperCase(),20,32);
  if(r.id==="design"){
    // Material and product samples pinned alongside the digital workstation.
    ctx.fillStyle="#ca8f6c";ctx.fillRect(20,49,200,177);ctx.fillStyle="#f3d9ac";ctx.beginPath();ctx.arc(119,152,67,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#345f63";ctx.fillRect(99,68,104,79);
    for(let i=0;i<4;i++){ctx.fillStyle=["#335f67","#8faaa5","#d4a170","#9f6d5d"][i];ctx.fillRect(241+i*60,54,48,53);}
    ctx.strokeStyle="#698380";ctx.lineWidth=3;ctx.strokeRect(241,122,224,96);ctx.strokeRect(250,132,65,68);ctx.strokeRect(327,132,121,30);
    for(let i=0;i<3;i++)ctx.fillRect(328,172+i*10,95-i*14,3);
    box(p.oak,x+2.38,1.58,wall,.97,.61,.10);wallArt(scene,texture,x+2.38,1.58,wall+.06,.91,.55);
    wallArt(scene,texture,x-1.47,1.04,wall+.06,1.76,.86);
    cyl(p.oak,x+2.57,.62,z+2.28,1.18,.08);cyl(p.teal,x+2.57,.33,z+2.28,.33,.60);
    for(let i=0;i<3;i++)box(i===0?p.terra:i===1?p.navy:p.chalk,x+2.26+i*.25,.699,z+2.27+(i%2)*.08,.22,.055,.29,i*.14);
  } else if(r.id==="sales"){
    sofa(k,x-side*3.59,z-1.42,side*Math.PI/2);sofa(k,x-side*2.72,z-2.36,Math.PI);
    for(let i=0;i<3;i++){ctx.fillStyle=["#487070","#78a5a2","#c2a378"][i];ctx.fillRect(22+i*161,52,148,36);
      for(let j=0;j<=i+1;j++){ctx.strokeStyle="#648586";ctx.strokeRect(24+i*161,99+j*39,145,26);}}
    wallArt(scene,texture,x-1.25,1.02,wall+.065,1.77,.86);
  } else if(r.id==="marketing"){
    for(let i=0;i<7;i++)for(let j=0;j<3;j++)box((i+j)%3?p.dark:p.fabric,x-.70+i*.29,.79+j*.25,wall+.065+(i%2)*.04,.23,.19,.12);
    const px=x+side*2.78,pz=z+1.95;
    for(const f of [-1,1])k.rod(p.black,[px,1.40,pz],[px+f*.41,.10,pz+.20],.033);
    k.rod(p.black,[px,.05,pz],[px,1.87,pz],.04);
    k.piece("pot",p.black,px,1.81,pz,.74,.19,.74,Math.PI*.43,.18,0);
    k.piece("tube",p.chalk,px,1.846,pz+.097,.69,.016,.69,Math.PI*.43,.18,0);
  } else if(r.id==="finance"){
    const px=x+side*2.94,pz=z+2.15;
    box(p.oak,px,.48,pz,1.37,.86,.64);
    for(let i=0;i<3;i++){box(p.fabric,px,.22+i*.26,pz+.33,1.24,.22,.03);box(p.brass,px,.23+i*.26,pz+.36,.30,.018,.035);}
    for(let i=0;i<4;i++){box(i%2?p.navy:p.chalk,px-.40+i*.17,.99,pz,.13,.19,.31);}
    for(let i=0;i<7;i++){ctx.fillStyle=i%2?"#546866":"#9ca89c";ctx.fillRect(20,55+i*25,460,1);ctx.fillRect(30,62+i*25,80+i%3*26,3);ctx.fillRect(352,62+i*25,83-i%3*12,3);}
    wallArt(scene,texture,x-.96,1.02,wall+.06,1.61,.79);
  } else if(r.id==="quality"||r.id==="engineering") {
    const px=x+side*2.98,pz=z+2.08;
    box(p.dark,px,.55,pz,1.65,1.06,.76);box(p.silver,px,1.11,pz,1.7,.075,.82);
    for(let i=0;i<3;i++){
      box(p.black,px-.55+i*.55,1.32,pz,.46,.33,.37);
      box(i===1?p.teal:p.navy,px-.55+i*.55,1.33,pz+.193,.37,.18,.025);box(p.blue,px-.69+i*.55,1.22,pz+.20,.035,.018,.018);
    }
    for(let i=0;i<6;i++){
      const cx=24+i%3*157,cy=52+Math.floor(i/3)*84;
      ctx.fillStyle="#365461";ctx.fillRect(cx,cy,143,70);ctx.strokeStyle=i%2?"#9dccb8":"#dbbf86";ctx.lineWidth=3;ctx.beginPath();
      for(let q=0;q<30;q++){const xx=cx+4+q*4.5,yy=cy+39+Math.sin(q*.45+i)*Math.cos(q*.2)*18;if(!q)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.stroke();
    }
    wallArt(scene,texture,x-.84,.94,wall+.06,1.72,.83);
  }
  if(r.id==="marketing"){texture.dispose();return;}
  texture.needsUpdate=true;
}
export function atrium(scene:T.Scene,k:Kit) {
  const {p,box,cyl,rod,plant}=k;
  // Suspended bronze and opal racetrack over the meeting table. Four slim
  // uprights keep its centre and the circulation routes open in section.
  for(const side of [-1,1]){
    box(p.dark,side*3.96,1.73,5.0,.10,3.41,.12);
    box(p.timber,side*3.90,2.65,5.0,.085,1.59,.14);
  }
  box(p.dark,0,3.42,5.0,8.01,.11,.13);
  for(const x of [-1.63,1.63])rod(p.brass,[x,3.39,5],[x,2.96,5],.018);
  const loop=new T.CurvePath<T.Vector3>();
  const pts:T.Vector3[]=[];
  for(let i=0;i<64;i++){const a=i/64*Math.PI*2,c=Math.cos(a),s=Math.sin(a);pts.push(new T.Vector3(Math.sign(c)*Math.pow(Math.abs(c),.64)*2.65,2.96,5+Math.sign(s)*Math.pow(Math.abs(s),.70)*1.00));}
  for(let i=0;i<pts.length;i++)loop.add(new T.LineCurve3(pts[i],pts[(i+1)%pts.length]));
  const edge=new T.Mesh(new T.TubeGeometry(loop,96,.042,6,true),p.brass);edge.castShadow=true;scene.add(edge);
  const emitter=new T.Mesh(new T.TubeGeometry(loop,96,.022,6,true),p.light);emitter.position.y=-.042;scene.add(emitter);
  brandMark(scene,k,-2.68,2.05,-9.04,.77);
  brandMark(scene,k,0,-.27,10.61,.28);
  for(const side of [-1,1]){
    // Strip canopy and layered exterior planter stay outboard of desks.
    for(let i=0;i<26;i++)box(p.timber,side*15.45,3.04,-9.55+i*.755,1.17,.095,.092);
    box(p.dark,side*14.90,3.08,0,.07,.115,19.85);
    box(p.ceramic,side*5.44,.235,8.92,1.45,.44,1.07);
    for(let i=0;i<3;i++)plant(side*5.44+(i-1)*.42,8.91+(i%2)*.06,.57,.40);
  }
}
export function contactShadows(scene:T.Scene) {
  const {ctx,texture}=canvasTexture(96,96);const g=ctx.createRadialGradient(48,48,3,48,48,47);
  g.addColorStop(0,"rgba(41,35,27,.45)");g.addColorStop(.55,"rgba(41,35,27,.27)");g.addColorStop(1,"rgba(41,35,27,0)");
  ctx.fillStyle=g;ctx.fillRect(0,0,96,96);texture.needsUpdate=true;
  const mat=new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,toneMapped:false});
  const geometry=new T.PlaneGeometry(1,1);geometry.rotateX(-Math.PI/2);
  const mats:T.Matrix4[]=[];
  const add=(x:number,z:number,w:number,d:number,y:number)=>{const m=new T.Matrix4().makeScale(w,1,d);m.setPosition(x,y,z);mats.push(m);};
  add(0,.2,40,28,-1.026);add(0,4.97,6.40,3.58,.039);add(0,8.6,4.63,1.99,.018);
  return {room(r:Room){add(r.x,r.z-.54,4.68,2.54,.068);add(r.seat.x,r.seat.z,.97,.96,.071);if(r.side)add(r.x+r.side*3.41,r.z-1.2,1.42,3.17,.052);},finish(){
    const mesh=new T.InstancedMesh(geometry,mat,mats.length);mats.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.renderOrder=1;scene.add(mesh);
  }};
}
