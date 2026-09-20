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
  RefreshCw,
} from "lucide-react";
import Reveal from "../components/Reveal";
import Button from "../components/Button";
import Seo from "../components/Seo";
import Closing from "../sections/Closing";
import "../styles/pages.css";
const steps = [
  {
    title: "Descubrir",
    question: "¿Qué vale la pena resolver?",
    text: "Escuchamos tu contexto, tus clientes y tus objetivos. La mejor respuesta empieza con las preguntas correctas.",
    delivery: "Mapa del reto",
    items: ["Contexto", "Personas", "Objetivos"],
    icon: Compass,
  },
  {
    title: "Definir",
    question: "Una idea. Una dirección.",
    text: "Acordamos las prioridades, el alcance y una ruta realista. Sabes qué vamos a construir y por qué.",
    delivery: "Ruta y alcance",
    items: ["Prioridades", "Entregables", "Plan"],
    icon: ArrowUpRight,
  },
  {
    title: "Diseñar",
    question: "Ver la idea antes de construirla.",
    text: "Exploramos la identidad y la experiencia. Revisas propuestas y prototipos para decidir con claridad.",
    delivery: "Diseño y prototipo",
    items: ["Explorar", "Probar", "Afinar"],
    icon: PenTool,
  },
  {
    title: "Construir",
    question: "Que funcione tan bien como se ve.",
    text: "Convertimos el diseño en una solución funcional. Cuidamos velocidad, accesibilidad y adaptación a cada pantalla.",
    delivery: "Versión funcional",
    items: ["Desarrollo", "Conexiones", "Pruebas"],
    icon: Code2,
  },
  {
    title: "Lanzar",
    question: "El momento de salir al mundo.",
    text: "Revisamos juntos los últimos detalles, publicamos y te entregamos lo necesario para usar tu nueva herramienta.",
    delivery: "Publicación y guía",
    items: ["Revisión", "Publicación", "Entrega"],
    icon: Send,
  },
  {
    title: "Evolucionar",
    question: "Lo que sigue también se diseña.",
    text: "Observamos lo que aprendemos y definimos mejoras. El acompañamiento posterior se acuerda según tu proyecto.",
    delivery: "Siguientes pasos",
    items: ["Observar", "Aprender", "Mejorar"],
    icon: RefreshCw,
  },
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
          <span className="eyebrow">SEIS MOMENTOS. UN PROPÓSITO.</span>
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
