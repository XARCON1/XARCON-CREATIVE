import * as T from "three";
import { department, type DepartmentId } from "../departments";
import { readAgent, type EnvironmentState } from "../engine";
import { canvasTexture } from "./materials";

export function lettering(scene:T.Scene, title:string, subtitle:string, x:number,y:number,z:number,w:number,h:number, color="#f5efe2", background="#273f4a", angle=0) {
  const {ctx,texture}=canvasTexture(768,192);
  ctx.fillStyle=background;ctx.fillRect(0,0,768,192);ctx.fillStyle=color;
  ctx.font="600 74px Arial";ctx.fillText(title,35,100,695);
  ctx.fillStyle="#b4d4d0";ctx.font="26px Arial";ctx.fillText(subtitle,39,152,685);
  texture.needsUpdate=true;texture.anisotropy=4;
  const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:texture,toneMapped:false}));
  mesh.rotation.y=angle;mesh.position.set(x,y,z);scene.add(mesh);return mesh;
}
export function makeScreen(id:DepartmentId) {
  const {ctx,texture}=canvasTexture(384,216);
  const material=new T.MeshBasicMaterial({map:texture,toneMapped:false});
  const d=department(id);
  let signature="";
  function draw(s:EnvironmentState,seconds:number) {
    const agent=readAgent(id,s),active=["Ejecutando","Planificando","Colaborando","En revisión","Esperando aprobación"].includes(agent.state);
    const phase=Math.floor(seconds/(active?1.0:5)), bar=Math.round(agent.progress*100);
    const key=[agent.state,bar,phase].join("/");
    if(key===signature)return;signature=key;
    const fg=d.color, line=active?"#4a7584":"#34515b";
    ctx.fillStyle=active?"#122e3c":"#192e36";ctx.fillRect(0,0,384,216);
    ctx.fillStyle=fg;ctx.fillRect(0,0,384,6);ctx.font="bold 23px Arial";ctx.fillText(d.agent,18,36);
    ctx.fillStyle="#cddada";ctx.font="12px Arial";ctx.fillText(agent.state.toUpperCase(),218,35,155);
    ctx.fillStyle=line;ctx.fillRect(17,49,350,1);ctx.strokeStyle=line;ctx.lineWidth=2;
    if(id==="design") {
      for(let i=0;i<3;i++){
        const x=22+i*115;ctx.strokeRect(x,65,99,105);ctx.fillStyle=i===phase%3?fg:line;ctx.fillRect(x+8,74,82,37);
        ctx.fillStyle="#90a8a9";ctx.fillRect(x+8,122,57,4);ctx.fillRect(x+8,134,74,3);ctx.strokeRect(x+8,148,34,12);
      }
    }else if(id==="engineering"||id==="quality"){
      for(let i=0;i<8;i++){
        ctx.fillStyle=i===phase%8?fg:line;ctx.fillRect(20,63+i*14,5,6);ctx.fillStyle=i%3? "#9cb1ae":fg;
        ctx.fillRect(38+(i%3)*10,63+i*14,36+(i*31)%145,4);ctx.fillStyle=line;ctx.fillRect(232,63+i*14,32+(i*29)%88,4);
      }
    }else if(id==="sales"){
      for(let col=0;col<3;col++)for(let row=0;row<3;row++){
        ctx.fillStyle=(col+row)%3===phase%3?line:"#233e49";ctx.fillRect(18+col*119,62+row*37,109,29);
        ctx.fillStyle=col===phase%3?fg:"#8dabad";ctx.fillRect(25+col*119,70+row*37,45+row*7,4);
      }
    }else if(id==="marketing"){
      ctx.strokeStyle=fg;ctx.beginPath();
      for(let i=0;i<=55;i++){const x=17+i*6.3,y=114+Math.sin(i*.52+phase*.55)*Math.sin(i*.16)*38;if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
      ctx.stroke();
      for(let i=0;i<12;i++){ctx.fillStyle=i%3?line:fg;ctx.fillRect(18+i*29,167,23,5);}
    }else{
      for(let i=0;i<13;i++){
        const h=20+(Math.sin(i*.75+phase*.28)*.5+.5)*44+i*2;
        ctx.fillStyle=i%4===phase%4?fg:line;ctx.fillRect(20+i*19,174-h,13,h);
      }
      for(let row=0;row<5;row++){ctx.fillStyle=row%2?fg:line;ctx.fillRect(280,66+row*23,46+row*6,5);}
    }
    ctx.fillStyle=line;ctx.fillRect(18,194,348,4);ctx.fillStyle=fg;ctx.fillRect(18,194,Math.max(7,348*agent.progress),4);
    texture.needsUpdate=true;
  }
  return {material,draw};
}
