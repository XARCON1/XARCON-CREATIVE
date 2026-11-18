import * as T from "three";

export function canvasTexture(width:number, height:number) {
  const canvas = document.createElement("canvas");
  canvas.width=width; canvas.height=height;
  const ctx=canvas.getContext("2d")!;
  const texture=new T.CanvasTexture(canvas);
  texture.colorSpace=T.SRGBColorSpace;
  return {ctx,texture};
}
function grain() {
  const {ctx,texture}=canvasTexture(256,256);
  ctx.fillStyle="#e8d7c4";ctx.fillRect(0,0,256,256);
  for(let i=0;i<245;i++) {
    const y=(i*93.71)%256, period=9+(i%19)*6;
    ctx.strokeStyle="rgba(80,47,23,"+(.025+(i%6)*.014)+")";
    ctx.lineWidth=.3+i%3*.23;ctx.beginPath();ctx.moveTo(0,y);
    for(let x=0;x<=256;x+=4) ctx.lineTo(x,y+Math.sin(x/period+i)*(.65+i%4*.28));
    ctx.stroke();
  }
  texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=4;texture.needsUpdate=true;
  return texture;
}
export function makePalette() {
  const woodMap=grain();
  const matte=(color:string,roughness=.70,metalness=.0)=>new T.MeshStandardMaterial({color,roughness,metalness});
  return {
    stone:matte("#e4e1d7"), edge:matte("#545f64",.45,.22), shadow:matte("#343f46"), brass:matte("#b79464",.35,.55),
    dark:matte("#273b44",.42,.25), black:matte("#253139",.58,.13), silver:matte("#9ba8a5",.33,.64),
    chalk:matte("#f4eee2"), teal:matte("#3e7776"), terra:matte("#ac745c"), fabric:matte("#9eada5",.94),
    timber:new T.MeshStandardMaterial({color:"#bb9877",map:woodMap,roughness:.62}), oak:new T.MeshStandardMaterial({color:"#e6c6a0",map:woodMap,roughness:.71}),
    floor:matte("#cac9bc",.74), navy:matte("#263f50"), leaf:matte("#47734f",.8), sprout:matte("#789159",.8),
    ceramic:matte("#d0bfaa"), white:matte("#e6e5d9"), glass:new T.MeshStandardMaterial({color:"#95c4c2",metalness:.17,roughness:.15,transparent:true,opacity:.14,depthWrite:false,side:T.DoubleSide}),
    stripe:new T.MeshBasicMaterial({color:"#c6f3e9",transparent:true,opacity:.75,depthWrite:false}),
    light:new T.MeshStandardMaterial({color:"#fff0c9",emissive:"#ffe3ac",emissiveIntensity:1.15}),
    blue:new T.MeshStandardMaterial({color:"#78dadb",emissive:"#42abbe",emissiveIntensity:.52}),
  };
}
function leafGeometry() {
  const p:number[]=[],idx:number[]=[];
  for(let i=0;i<=8;i++){
    const t=i/8, spread=Math.sin(Math.PI*t)**.74*.50;
    p.push(-spread,t,.28*t*t, 0,t,.28*t*t+spread*.17, spread,t,.28*t*t);
    if(i<8)for(const n of [0,1]){const k=i*3+n;idx.push(k,k+1,k+3,k+1,k+4,k+3);}
  }
  const g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function builder(scene:T.Scene) {
  const p=makePalette();
  p.leaf.side=p.sprout.side=T.DoubleSide;
  const geo={box:new T.BoxGeometry(1,1,1), tube:new T.CylinderGeometry(.5,.5,1,16), pot:new T.CylinderGeometry(.5,.38,1,18), leaf:leafGeometry()};
  type Batch={g:T.BufferGeometry;m:T.Material;transforms:T.Matrix4[]};
  const buckets=new Map<string,Batch>();
  const tool=new T.Object3D();
  function piece(g:keyof typeof geo,m:T.Material,x:number,y:number,z:number,w:number,h:number,d:number,rx=0,ry=0,rz=0) {
    const k=g+m.uuid; let b=buckets.get(k);
    if(!b){b={g:geo[g],m,transforms:[]};buckets.set(k,b);}
    tool.position.set(x,y,z);tool.rotation.set(rx,ry,rz);tool.scale.set(w,h,d);tool.updateMatrix();b.transforms.push(tool.matrix.clone());
  }
  const box=(m:T.Material,x:number,y:number,z:number,w:number,h:number,d:number,ry=0)=>piece("box",m,x,y,z,w,h,d,0,ry);
  const cyl=(m:T.Material,x:number,y:number,z:number,w:number,h:number,d=w)=>piece("tube",m,x,y,z,w,h,d);
  function rod(m:T.Material, a:number[], b:number[], width:number) {
    const delta=new T.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
    const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),delta.clone().normalize()),e=new T.Euler().setFromQuaternion(q);
    piece("tube",m,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,width,delta.length(),width,e.x,e.y,e.z);
  }
  function plant(x:number,z:number,size:number,base=0) {
    const pot=.52*size;
    piece("pot",p.ceramic,x,base+pot*.5,z,pot*1.18,pot,pot*1.18);
    cyl(p.shadow,x,base+pot,z,pot*1.06,.025);
    for(let i=0;i<13;i++){
      const angle=i*2.39996+x, reach=(.19+.09*(i%3))*size, top=pot+(.32+.19*(i%4))*size;
      const dx=Math.cos(angle)*reach,dz=Math.sin(angle)*reach;
      rod(p.leaf,[x,base+pot,z],[x+dx,base+top,z+dz],.018*size);
      piece("leaf",i%3?p.leaf:p.sprout,x+dx,base+top-.05,z+dz,.21*size,(.38+(i%3)*.12)*size,.48*size,.35+(i%4)*.19,angle,Math.sin(angle)*.7);
    }
  }
  function flush(){
    for(const b of buckets.values()){
      const mesh=new T.InstancedMesh(b.g,b.m,b.transforms.length);
      b.transforms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.computeBoundingSphere();
      mesh.castShadow=!b.m.transparent;mesh.receiveShadow=!b.m.transparent;scene.add(mesh);
    }
    buckets.clear();
  }
  return {p,box,cyl,rod,plant,piece,flush};
}
export type Kit=ReturnType<typeof builder>;
