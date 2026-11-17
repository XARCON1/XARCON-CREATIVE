import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Symbol } from "./Logo";
import "../styles/product-showcase.css";

export const demoModes = [
  { name: "Gestión empresarial", mobile: "Tu operación, conectada." },
  { name: "Web corporativa", mobile: "Tu marca. Tu mundo." },
  { name: "Automatización con IA", mobile: "El trabajo fluye." },
  { name: "Comercio electrónico", mobile: "Del clic al pedido." },
];

function WorkspaceDemo() {
  return <div className="showcase-workspace">
    <aside className="showcase-sidebar"><Symbol /><b>Mi empresa</b><span className="current">Resumen</span><span>Clientes</span><span>Proyectos</span><span>Documentos</span><small>ESPACIO DE TRABAJO</small></aside>
    <div className="showcase-dashboard">
      <div className="showcase-topline"><span>OPERACIONES</span><b>Vista de ejemplo</b></div>
      <h3>Todo, bajo control.</h3>
      <div className="showcase-summary"><span><i />Tu equipo. Una misma dirección.</span><b>+ Nueva tarea</b></div>
      <div className="showcase-kanban">
        <div><small><i />POR REVISAR</small><article><em>COMERCIAL</em><strong>Nueva propuesta</strong><p>Definir el alcance</p><span>Equipo de ventas <b>NV</b></span></article></div>
        <div><small><i />EN PROCESO</small><article><em>OPERACIONES</em><strong>Tu próximo proyecto</strong><p>Diseño en revisión</p><span>Equipo de trabajo <b>AB</b></span></article></div>
        <div><small><i />COMPLETADO</small><article><em>DOCUMENTOS</em><strong>Todo en su lugar</strong><p>Información organizada</p><span>Documentación <b>✓</b></span></article></div>
      </div>
      <div className="showcase-activity"><i /> Personas, procesos y datos. Conectados.<span>→</span></div>
    </div>
  </div>;
}

function WebsiteDemo() {
  return <div className="showcase-website">
    <div className="showcase-site-nav"><b>FORMA</b><span>Estudio &nbsp; Servicios &nbsp; Contacto</span><i>Hablemos <ArrowUpRight className="showcase-arrow" aria-hidden="true" /></i></div>
    <div className="showcase-site-hero"><img src="/images/workspace.webp" alt="" loading="lazy" width="1600" height="1067" /><div><small>PERSONAS. IDEAS. POSIBILIDADES.</small><h3>Una nueva<br />forma de<br /><em>conectar.</em></h3><span>Descubrí lo que hacemos <ArrowUpRight className="showcase-arrow" aria-hidden="true" /></span></div><b className="showcase-site-index">01 / 03</b></div>
    <div className="showcase-site-footer"><b>Una marca que se vive.</b><span>WEB CORPORATIVA / CONCEPTO</span></div>
  </div>;
}

function FlowDemo() {
  return <div className="showcase-flow">
    <div className="showcase-topline"><span>XARCON / AUTOMATIZACIÓN</span><b>Flujo de ejemplo</b></div>
    <h3>Menos tareas.<br /><em>Más posibilidades.</em></h3>
    <div className="showcase-flow-path"><div><b>01</b><strong>Consulta</strong><small>Recibir</small></div><i /><div><b>02</b><strong>IA + datos</strong><small>Organizar</small></div><i /><div><b>03</b><strong>Tu equipo</strong><small>Revisar</small></div></div>
    <div className="showcase-flow-result"><span>✓</span><div><strong>El siguiente paso, preparado.</strong><small>Con supervisión humana.</small></div><b><ArrowUpRight className="showcase-arrow" aria-hidden="true" /></b></div>
  </div>;
}

function CommerceDemo() {
  return <div className="showcase-commerce">
    <div className="showcase-shop-nav"><b>ESTUDIO / SHOP</b><span>Colección &nbsp; Acerca de &nbsp; Bolsa (0)</span></div>
    <div className="showcase-shop-product"><div><small>LA COLECCIÓN ESENCIAL</small><h3>Diseño que<br />se siente.</h3><p>Tu producto.<br />Su próximo favorito.</p><span>Explorar colección <ArrowUpRight className="showcase-arrow" aria-hidden="true" /></span></div><img src="/images/headphones.webp" alt="" width="800" height="534" loading="lazy" /></div>
    <div className="showcase-shop-foot"><span>CATÁLOGO / PEDIDO / SEGUIMIENTO</span><b>TIENDA CONCEPTUAL</b></div>
  </div>;
}

/** Illustrative interfaces, with no customer records or invented performance figures. */
export function ProductDemo({ index }: { index: number }) {
  const reduced = useReducedMotion();
  return <div className="product-showcase"><AnimatePresence mode="sync" initial={false}><motion.div className="showcase-screen" key={index} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}>
    {index === 1 ? <WebsiteDemo /> : index === 2 ? <FlowDemo /> : index === 3 ? <CommerceDemo /> : <WorkspaceDemo />}
  </motion.div></AnimatePresence></div>;
}

export function MobileProductDemo({ index }: { index: number }) {
  return <div className={`mobile-ui mobile-showcase mobile-showcase-${index}`}>
    <div className="mobile-showcase-brand"><Symbol /><span>{["WORKSPACE", "FORMA", "WORKFLOW", "ESTUDIO / SHOP"][index]}</span></div>
    <small>DISEÑO DE EJEMPLO</small><h3>{demoModes[index].mobile}</h3>
    {index === 1 ? <><img src="/images/workspace.webp" alt="" width="1600" height="1067" loading="lazy" /><div className="mobile-showcase-cta">Conocé nuestra visión <ArrowUpRight className="showcase-arrow" aria-hidden="true" /></div></> : index === 3 ? <><img src="/images/headphones.webp" alt="" width="800" height="534" loading="lazy" /><div className="mobile-showcase-cta">Explorar colección <ArrowUpRight className="showcase-arrow" aria-hidden="true" /></div></> : <>
      <div className="mobile-showcase-label">{index === 2 ? "UN FLUJO. CADA PASO." : "TU ESPACIO DE TRABAJO"}</div>
      {(index === 2 ? ["Recibir consulta", "Organizar con IA", "Revisión humana"] : ["Clientes", "Proyectos", "Documentos"]).map((item, i) => <div className="mobile-showcase-row" key={item}><i>0{i + 1}</i><b>{item}</b><span><ArrowUpRight className="showcase-arrow" aria-hidden="true" /></span></div>)}
      <div className="mobile-showcase-cta">{index === 2 ? "Personas + tecnología" : "Todo en un mismo lugar"}</div>
    </>}
  </div>;
}
