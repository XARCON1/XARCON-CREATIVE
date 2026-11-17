import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useId } from "react";
export const demoModes = [
  {name:"Gestión empresarial",heading:"Control de operaciones",intro:"Información, clientes y procesos en un solo lugar.",sections:["Panel general","Clientes","Proyectos","Documentos","Reportes"],cards:[["Clientes","Seguimiento"],["Proyectos","En proceso"],["Documentos","Centralizados"]],rows:[["Solicitud comercial","Por revisar"],["Propuesta de servicio","En preparación"],["Entrega de proyecto","Validación"]],mobile:"Tu operación",mobileRows:["Solicitudes","Proyectos","Documentos"]},
  {name:"Web corporativa",heading:"Tu negocio, visible.",intro:"Una experiencia comercial pensada para generar consultas.",sections:["Inicio","Servicios","Portafolio","Consultas"],cards:[["Servicios","Visibles"],["Consultas","Organizadas"],["Contenido","Editable"]],rows:[["Solicitud de información","Nueva consulta"],["Consulta de servicio","En revisión"],["Contacto comercial","Seguimiento"]],mobile:"Tu presencia digital",mobileRows:["Servicios","Proyectos","Contactar"]},
  {name:"Automatización con IA",heading:"Conecta tus procesos",intro:"Diseña flujos inteligentes con supervisión humana.",sections:["Flujos","Entradas","Revisión","Integraciones","Historial"],cards:[["Entrada","Consulta"],["Proceso","Clasificación"],["Salida","Revisión"]],rows:[["Recibir solicitud","Entrada"],["Organizar información","Procesamiento"],["Revisar respuesta","Validación humana"]],mobile:"Flujos conectados",mobileRows:["Nueva solicitud","En procesamiento","Revisión humana"]},
  {name:"Comercio electrónico",heading:"Del catálogo al pedido",intro:"Gestiona productos y solicitudes en una sola plataforma.",sections:["Catálogo","Pedidos","Clientes","Inventario"],cards:[["Catálogo","Productos"],["Pedidos","Solicitudes"],["Clientes","Seguimiento"]],rows:[["Pedido de catálogo","Recibido"],["Consulta de producto","Por confirmar"],["Preparación de pedido","En proceso"]],mobile:"Tus pedidos",mobileRows:["Catálogo","Solicitudes","Pedidos"]}
];
export function ProductDemo({index}:{index:number}) {
  const mode=demoModes[index] || demoModes[0];
  const reduced=useReducedMotion();
  const fillId=useId();
  return <div className="product-demo">
    <aside className="product-demo-sidebar"><div className="product-demo-brand"><b>X</b> XARCON <small>WORKSPACE</small></div><span className="product-demo-label">ESPACIO DE TRABAJO</span>{mode.sections.map((section,i)=><div key={section} className={i===0?"current":""}><i/> {section}</div>)}<span className="product-demo-demo">ENTORNO ILUSTRATIVO</span></aside>
    <AnimatePresence mode="wait" initial={false}><motion.div className="product-demo-main" key={mode.name} initial={reduced?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.27}}>
    <div className="product-demo-top"><span>PLATAFORMA / {mode.name.toUpperCase()}</span><span><i/> DEMO</span></div>
    <h3>{mode.heading}</h3><p>{mode.intro}</p>
    <div className="product-demo-kpis">{mode.cards.map(([label,value])=><div key={label}><small>{label}</small><strong>{value}</strong><i/></div>)}</div>
    <div className="product-demo-work"><div className="product-demo-graph"><small>FLUJO DE TRABAJO</small><svg viewBox="0 0 220 75" role="presentation"><defs><linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a8ff4e" stopOpacity=".35"/><stop offset="1" stopColor="#a8ff4e" stopOpacity="0"/></linearGradient></defs><path d="M0 16H220 M0 34H220 M0 52H220 M0 70H220" stroke="#324554" strokeWidth=".6"/><path d="M0 65 C18 62 22 46 42 52 S76 33 94 39 S119 17 140 29 S165 12 182 21 S205 8 216 5 V75 H0Z" fill={`url(#${fillId})`}/><path d="M0 65 C18 62 22 46 42 52 S76 33 94 39 S119 17 140 29 S165 12 182 21 S205 8 216 5" fill="none" stroke="#b9ff6b" strokeWidth="2"/><circle cx="216" cy="5" r="3" fill="#d7ffaf"/></svg><div><span>Entrada</span><span>Gestión</span><span>Validación</span></div></div><div className="product-demo-steps"><small>ETAPAS</small>{mode.rows.map(([label,state],i)=><div key={label}><span className={"step-dot step-"+i}/><span>{label}<small>{state}</small></span></div>)}</div></div>
    <div className="product-demo-foot"><span>Diseño y módulos según el proyecto</span><span>XARCON / SOFTWARE</span></div>
    </motion.div></AnimatePresence>
  </div>
}
export function MobileProductDemo({index}:{index:number}){
  const mode=demoModes[index] || demoModes[0];
  return <div className="mobile-ui mobile-product-demo"><div className="mobile-demo-head"><b>X</b><span>WORKSPACE</span></div><small>ACCESO MÓVIL / DEMO</small><h3>{mode.mobile}</h3><p>Todo lo importante, a tu alcance.</p><div className="mobile-demo-tabs"><b>Resumen</b><span>Actividad</span></div>{mode.mobileRows.map((item,i)=><div className="mobile-demo-row" key={item}><i>0{i+1}</i><span>{item}</span><b>›</b></div>)}<div className="mobile-demo-end"><span>Estado de flujo</span><div><i/><i/><i/></div><small>Vista conceptual</small></div></div>
}
