import * as T from "three";
import { builder } from "./materials";

// The cutaway stays legible in plan view. From inside the glass, the same floor
// opens onto a planted terrace and the other buildings of the campus.
export function createCourtyard(scene:T.Scene){
  const outside=new T.Group();outside.visible=false;scene.add(outside);
  const k=builder(outside),{box,p,piece,rod}=k;
  const bark=new T.MeshStandardMaterial({color:"#72624c",roughness:.95});
  const greens=["#5c765c","#82946a","#68866e","#9caa79"].map(color=>new T.MeshStandardMaterial({color,roughness:.93,flatShading:true}));
  for(const side of [-1,1]){
    box(p.stone,side*23,-.98,0,4.8,.12,61);
    for(let i=0;i<6;i++){
      const x=side*(22.2+i%2*2.8),z=-25+i*9.2,h=3.1+Math.sin(i*8.1+side)*.57;
      box(p.ceramic,x,-.48,z,2.20,.92,2.15);
      rod(bark,[x,-.08,z],[x+.12,h-.40,z],.17);
      for(let c=0;c<9;c++){
        const a=c*2.40+i,reach=c%3===0?.30:1.1,dx=Math.cos(a)*reach,dz=Math.sin(a)*reach;
        if(c<4)rod(bark,[x,1.25,z],[x+dx,h+.18,z+dz],.073);
        piece("crown",greens[(c+i)%4],x+dx,h+.32+(c%3)*.45,z+dz,2.15+(c%2)*.52,1.56+(c%3)*.28,2.23,0,a);
      }
    }
    for(let i=0;i<5;i++){
      const x=side*(32+i%2*5),z=-32+i*14,w=7.5,h=3.3+(i%3)*1.05;
      box(i%2?p.stone:p.ceramic,x,h/2-1,z,w,h,9.6);
      box(p.chalk,x,h-.90,z,w+.32,.21,9.95);
      for(let j=0;j<4;j++){
        const wz=z-3.2+j*2.08;box(p.fabric,x-side*(w/2+.012),h*.56-1,wz,.036,1.10,1.60);
      }
    }
    for(let i=0;i<4;i++){
      const x=-15+i*9.4,z=side*(19.5+(i%2)*3.6);
      box(p.ceramic,x,-.59,z,4.8,.82,1.43);
      for(let j=0;j<6;j++)piece("crown",greens[(i+j)%4],x-1.87+j*.75,.23,z,1.45,.93+(j%2)*.31,1.19,0,j*.79);
    }
  }
  k.flush();return outside;
}
