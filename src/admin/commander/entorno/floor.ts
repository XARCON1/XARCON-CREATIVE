import { staff, type DepartmentId } from "../departments";

export type Point = { x:number; z:number };
export type Rect = { x:number; z:number; w:number; d:number };
export type Room = Rect & { id:DepartmentId; side:number; seat:Point; board:Point; title:string; finish:string; tint:string };
const places: Record<DepartmentId,[number,number,string,string,string]> = {
  command:[0,-5.5,"Sala de operaciones","#9f7856","#3f737f"],
  sales:[-11.6,0,"Sala comercial","#bf9875","#7a9199"],
  design:[-11.6,-6.6,"Estudio de diseño","#cca780","#a88b85"],
  marketing:[-11.6,6.6,"Estudio de medios","#c19770","#b98365"],
  quality:[11.6,-6.6,"Sala de validación","#aa977c","#749184"],
  engineering:[11.6,0,"Laboratorio de software","#ab9981","#6d92a2"],
  finance:[11.6,6.6,"Oficina financiera","#c2a17b","#aaa076"]
};
export const rooms: Room[] = staff.map(({id}) => {
  const [x,z,title,finish,tint] = places[id];
  const side = Math.sign(x);
  return { id,x,z,title,finish,tint,side, w:side ? 8.4 : 8.2, d:side ? 6.36 : 7.8, seat:{x,z:z+.38}, board:{x:x+(side || 1)*2.3,z:z-1.75} };
});
export const roomById = (id:DepartmentId) => rooms.find(r => r.id === id)!;
export type Destination = "desk" | "board" | "lounge" | "receive" | "deliver";
export function nodeId(room:DepartmentId, place:Destination) { return room + "/" + place; }
const nodes = new Map<string,Point>();
const links = new Map<string,string[]>();
function node(id:string,x:number,z:number) { nodes.set(id,{x,z}); links.set(id,[]); }
function join(a:string,b:string) { links.get(a)!.push(b); links.get(b)!.push(a); }
node("hub",0,1.65);
node("hub/receive",-.57,1.65);node("hub/deliver",.57,1.65);join("hub","hub/receive");join("hub","hub/deliver");
node("lounge-entry",0,2.45); join("hub","lounge-entry");
for (const side of [-1,1]) {
  node("hall"+side,side*5.62,1.65); join("hub","hall"+side);
  node("table"+side,side*3.5,2.45); join("lounge-entry","table"+side);
}
for (const [i,r] of rooms.entries()) {
  const id = (place:string) => r.id+"/"+place;
  node(id("desk"),r.seat.x,r.seat.z);
  node(id("board"),r.board.x,r.board.z);
  node(id("beside"),r.x+(r.side || 1)*2.35,r.seat.z);
  join(id("desk"),id("beside")); join(id("beside"),id("board"));
  if (r.side) {
    node(id("door"),r.side*7.47,r.seat.z);
    node(id("aisle"),r.side*5.62,r.seat.z);
    join(id("desk"),id("door")); join(id("door"),id("aisle"));
    join(id("aisle"),"hall"+r.side);
    node(id("receive"),r.side*6.40,r.seat.z-.54); node(id("deliver"),r.side*6.40,r.seat.z+.54);
    join(id("receive"),id("aisle"));join(id("deliver"),id("aisle"));
  } else {
    node(id("door"),0,-1.65); join(id("desk"),id("door")); join(id("door"),"hub");
    node(id("receive"),-.57,-.54); node(id("deliver"),.57,-.54);
    join(id("receive"),"hub");join(id("deliver"),"hub");
  }
  const loungeSide = i%2 ? -1 : 1;
  node(id("lounge"),loungeSide*3.50,3.6+Math.floor(i/2)*.88);
  join(id("lounge"),"table"+loungeSide);
}
export const waypoint = (id:string) => nodes.get(id)!;
export function route(from:string,to:string):string[] {
  if (from === to) return [];
  const open = new Set([from]), distance = new Map([[from,0]]), parent = new Map<string,string>();
  while (open.size) {
    let best = ""; let shortest = Infinity;
    for (const id of open) if (distance.get(id)! < shortest) { best=id; shortest=distance.get(id)!; }
    if (best === to) {
      const path = [to];
      while (parent.get(path[0]) !== from) path.unshift(parent.get(path[0])!);
      return path;
    }
    open.delete(best);
    const a=waypoint(best);
    for (const id of links.get(best) ?? []) {
      const b=waypoint(id), cost=shortest+Math.hypot(a.x-b.x,a.z-b.z);
      if (cost < (distance.get(id) ?? Infinity)) { distance.set(id,cost); parent.set(id,best); open.add(id); }
    }
  }
  return [];
}
export const barriers: Rect[] = [];
function block(x:number,z:number,w:number,d:number){barriers.push({x,z,w,d});}
for (const r of rooms) {
  block(r.x,r.z-.55,3.48,1.04);
  if (r.side) {
    const inner = r.side*7.4;
    block(inner,r.z-1.83,.15,2.8);block(inner,r.z+2.40,.15,1.55);
    block(r.x,r.z-3.20,8.42,.10);block(r.x,r.z+3.20,8.42,.10);
    block(r.x+r.side*3.40,r.z-1.20,.72,2.65);
    block(r.x-r.side*2.99,r.z-2.53,.56,.56);
    if(r.id==="sales"){block(r.x-r.side*3.59,r.z-1.42,.74,.84);block(r.x-r.side*2.72,r.z-2.36,.84,.74);block(r.x-r.side*2.9,r.z-1.73,.85,.85);}
    if(r.id==="design")block(r.x+2.57,r.z+2.28,1.10,1.10);
    if(r.id==="finance"||r.id==="engineering"||r.id==="quality")block(r.x+r.side*2.98,r.z+2.08,1.65,.76);
    if(r.id==="marketing")block(r.x+r.side*2.78,r.z+1.95,.70,.70);
  } else {
    block(-4.1,r.z,.12,7.8);block(4.1,r.z,.12,7.8);
    block(-2.65,-1.63,2.9,.14);block(2.65,-1.63,2.9,.14);
  }
}
block(0,-9.37,8.32,.2);
for(const side of [-1,1]){block(side*5.44,8.92,1.45,1.07);block(side*4.20,8.55,.75,.75);block(side*5.85,-8.85,.80,.80);block(side*3.96,5.0,.10,.12);}
block(0,4.97,4.44,1.56);block(0,8.60,3.1,.66);
for (const r of rooms) block(r.seat.x,r.seat.z,.50,.55);
for (const x of [-2.85,2.85]) for(const z of [4.25,5.65]) block(x,z,.52,.54);
export function walkable(x:number,z:number) {
  const radius=.22;
  return Math.abs(x)<15.7-radius && Math.abs(z)<9.82-radius && !barriers.some(b => Math.abs(b.x-x)<b.w/2+radius && Math.abs(b.z-z)<b.d/2+radius);
}
