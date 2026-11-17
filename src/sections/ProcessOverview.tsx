import { useRef } from "react";
import { motion, useScroll, useReducedMotion, type MotionStyle } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import DepthReveal from "../components/DepthReveal";
const steps = [
  { title: "Escuchamos", text: "Tu reto y tus objetivos." },
  { title: "Definimos", text: "Alcance, inversión y plan." },
  { title: "Construimos", text: "Diseño y desarrollo." },
  { title: "Validamos", text: "Pruebas y ajustes." },
  { title: "Lanzamos", text: "Entrega y acompañamiento." },
];
export default function ProcessOverview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 45%"],
  });
  const reduced = useReducedMotion();
  return (
    <section className="section wrap process-overview">
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow">03 / ASÍ TRABAJAMOS CONTIGO</span>
          <h2>De la idea.<br /><em>A la realidad.</em></h2>
        </div>
        <Link className="text-link" to="/proceso">
          Así lo hacemos <ArrowUpRight size={18} />
        </Link>
      </Reveal>
      <div ref={ref} className="process-track">
        <motion.div
          className="process-track-line"
          style={{ "--process-progress": reduced ? 1 : scrollYProgress } as MotionStyle}
        />
        {steps.map((s, i) => (
          <DepthReveal className={`process-tile depth-step depth-step-${i}`} side={i % 2 ? 1 : -1} strength={.35} key={s.title}>
            <span className="process-number">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </DepthReveal>
        ))}
      </div>
    </section>
  );
}
