import { useRef } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import DepthReveal from "../components/DepthReveal";
import { processSteps } from "../data";
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
          <span className="eyebrow">CÓMO TRABAJAMOS</span>
          <h2>De la idea a la entrega.</h2>
        </div>
        <Link className="text-link" to="/proceso">
          Conocé nuestro proceso <ArrowUpRight size={18} />
        </Link>
      </Reveal>
      <div ref={ref} className="process-track">
        <motion.div
          className="process-track-line"
          style={reduced ? {} : { scaleX: scrollYProgress }}
        />
        {processSteps.map((s, i) => (
          <DepthReveal className={`process-tile depth-step depth-step-${i}`} side={i % 2 ? 1 : -1} key={s.title}>
            <span className="process-number">0{i + 1}</span>
            <h3>{s.title}</h3>
            
          </DepthReveal>
        ))}
      </div>
    </section>
  );
}
