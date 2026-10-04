import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import DepthReveal from "../components/DepthReveal";
import ServiceVisual from "../components/ServiceVisual";
import { services } from "../data";
export default function Capabilities() {
  const [active, setActive] = useState(1);
  const reduced = useReducedMotion();
  return (
    <section className="capabilities">
      <div className="wrap capabilities-layout">
        <div className="capabilities-intro">
          <Reveal>
            <span className="eyebrow light">02 / EN QUÉ TE AYUDAMOS</span>
            <h2>
              Tu negocio ya tiene una historia.
              <br />
              Nosotros te ayudamos
              <br />
              <em>a llevarla más lejos.</em>
            </h2>
          </Reveal>
          <DepthReveal className="capabilities-depth" side={-1}>
          <div className="capabilities-visual">
            <ServiceVisual kind={services[active].id} />
          </div>
          </DepthReveal>
        </div>
        <DepthReveal className="capabilities-list" side={1} strength={0.65}>
          {services.map((s, i) => (
            <Reveal
              className={`capability ${i === active ? "is-active" : ""}`}
              key={s.id}
              delay={i * 0.07}
            >
              <button
                onClick={() => setActive(i)}
                aria-expanded={i === active}
                aria-controls={`cap-${s.id}`}
              >
                <span>0{i + 1}</span>
                <span className="capability-title">{s.name}</span>
                {i === active ? <Minus size={19} /> : <Plus size={19} />}
              </button>
              <AnimatePresence initial={false}>
                {i === active && (
                  <motion.div
                    id={`cap-${s.id}`}
                    className="capability-description"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduced ? 0 : 0.28 }}
                  >
                    <p>{s.line}</p>
                    <Link to={`/servicios#${s.id}`}>
                      Ver cómo te ayudamos <ArrowUpRight size={15} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </Reveal>
          ))}
          <p className="capabilities-note">
            Diseño, tecnología y acompañamiento.
            <br />
            Todo pensado alrededor de tu negocio.
          </p>
        </DepthReveal>
      </div>
    </section>
  );
}
