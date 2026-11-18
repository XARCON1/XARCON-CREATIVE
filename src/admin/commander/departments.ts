import { Activity, BriefcaseBusiness, CircleDollarSign, Code2, Command, Layers3, Megaphone, ShieldCheck } from "lucide-react";
export type DepartmentId = "command" | "sales" | "design" | "engineering" | "marketing" | "finance" | "quality";
export type Department = { id: DepartmentId; title: string; agent: string; role: string; color: string; icon: typeof Activity; actions: string[]; x: number; y: number };
export const departments: Department[] = [
  { id:"sales", title:"Comercial", agent:"ATLAS", role:"Calificación y alcance", color:"#a8baff", icon:BriefcaseBusiness, actions:["Analizar solicitud","Definir alcance"], x:19,y:23 },
  { id:"design", title:"Diseño", agent:"PRISM", role:"Producto y experiencia", color:"#cf9cff", icon:Layers3, actions:["Diseñar experiencia","Preparar entrega visual"], x:50,y:12 },
  { id:"engineering", title:"Ingeniería", agent:"FORGE", role:"Desarrollo y arquitectura", color:"#78d9fb", icon:Code2, actions:["Planificar arquitectura","Construir módulos"], x:81,y:23 },
  { id:"marketing", title:"Marketing", agent:"PULSE", role:"Contenido y distribución", color:"#f4b68a", icon:Megaphone, actions:["Crear estrategia","Preparar lanzamiento"], x:19,y:76 },
  { id:"finance", title:"Finanzas", agent:"LEDGER", role:"Costos y presupuesto", color:"#e5d58b", icon:CircleDollarSign, actions:["Estimar recursos","Validar presupuesto"], x:50,y:87 },
  { id:"quality", title:"Calidad y seguridad", agent:"AEGIS", role:"Validación y control", color:"#81e4b7", icon:ShieldCheck, actions:["Ejecutar revisión","Preparar aprobación"], x:81,y:76 },
];
export const flow: DepartmentId[] = ["sales","finance","design","engineering","quality","marketing"];
export const demo = [{id:"demo-01",name:"Plataforma empresarial",status:"Simulación"}, {id:"demo-02",name:"Automatización CRM",status:"Simulación"}, {id:"demo-03",name:"Experiencia comercial web",status:"Simulación"}];
export const command: Department = { id: "command", title: "Dirección operativa", agent: "COMMANDER", role: "Orquestación empresarial", color: "#74cdd5", icon: Command, actions: ["Coordinar departamentos", "Solicitar aprobación humana"], x: 50, y: 50 };
export const staff = [command, ...departments];
export function department(id: DepartmentId) { return staff.find(item => item.id === id)!; }
