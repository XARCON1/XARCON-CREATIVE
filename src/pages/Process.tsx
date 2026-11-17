import { useRef } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Compass,
  PenTool,
  Code2,
  Send,
} from "lucide-react";
import Reveal from "../components/Reveal";
import Button from "../components/Button";
import Seo from "../components/Seo";
import Closing from "../sections/Closing";
import "../styles/pages.css";
const steps = [
  {title:"Consulta y diagnóstico",question:"¿Qué necesita resolver tu empresa?",text:"Identificamos objetivos, procesos y necesidades.",delivery:"Diagnóstico inicial",items:["Contexto","Objetivos","Procesos"],icon:Compass},
  {title:"Propuesta tecnológica y comercial",question:"Alcance e inversión claros.",text:"Definimos qué construiremos, los entregables y las condiciones comerciales.",delivery:"Propuesta",items:["Alcance","Inversión","Plan"],icon:ArrowUpRight},
  {title:"Diseño y desarrollo",question:"De la propuesta a una solución funcional.",text:"Diseñamos y desarrollamos por etapas, compartiendo avances.",delivery:"Versión funcional",items:["Diseño","Desarrollo","Integraciones"],icon:Code2},
  {title:"Validación y pruebas",question:"Comprobamos antes de implementar.",text:"Revisamos flujos, permisos y experiencia según el alcance acordado.",delivery:"Validación",items:["Pruebas","Revisión","Ajustes"],icon:PenTool},
  {title:"Implementación y acompañamiento",question:"Una solución lista para operar.",text:"Realizamos la entrega y acordamos el acompañamiento y soporte según el servicio contratado.",delivery:"Entrega",items:["Publicación","Guía","Soporte acordado"],icon:Send},
];
export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const reduced = useReducedMotion();
  return (
    <>
      <Seo page="process" />
      <section className="process-page-intro wrap page-intro">
        <Reveal>
          <span className="eyebrow">PROCESO / HACERLO BIEN, JUNTOS</span>
          <h1>
            Una idea no avanza sola.
            <br />
            <em>Avanza con dirección.</em>
          </h1>
        </Reveal>
        <div>
          <p>Del primer “¿y si…?” a algo que puedes ver, usar y compartir.</p>
          <a href="#camino" className="text-link">
            Recorre el proceso <ArrowDown size={17} />
          </a>
        </div>
      </section>
      <div id="camino" ref={ref} className="process-story wrap">
        <aside className="process-sticky">
          <span className="eyebrow">CINCO ETAPAS. UN PROPÓSITO.</span>
          <h2>
            Claridad en
            <br />
            cada paso.
          </h2>
          <p>
            Conversaciones directas.
            <br />
            Decisiones compartidas.
            <br />
            Avances que puedes ver.
          </p>
          <div className="process-progress">
            <motion.span
              style={reduced ? { scaleX: 1 } : { scaleX: scrollYProgress }}
            />
          </div>
          <Button variant="dark">Empecemos</Button>
        </aside>
        <div className="process-chapters">
          {steps.map((s, i) => (
            <Reveal className="process-chapter" key={s.title}>
              <div className="chapter-heading">
                <span>0{i + 1}</span>
                <h2>{s.title}</h2>
                <s.icon size={23} strokeWidth={1.4} />
              </div>
              <h3>{s.question}</h3>
              <p>{s.text}</p>
              <div className={`deliverable deliverable-${i}`}>
                <div>
                  <span>ENTREGABLE</span>
                  <strong>{s.delivery}</strong>
                </div>
                <div className="deliverable-pills">
                  {s.items.map((item, j) => (
                    <span key={item}>
                      {i === 3 ? <Code2 size={12} /> : <Check size={12} />}{" "}
                      {item}
                      <i style={{ width: (j + 1) * 24 + "px" }} />
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Closing />
    </>
  );
}
