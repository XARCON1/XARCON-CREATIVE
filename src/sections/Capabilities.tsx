import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, Minus, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
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
            <span className="eyebrow light">02 / LO QUE HACEMOS</span>
            <h2>
              La idea es tuya.
              <br />
              La forma,
              <br />
              <em>la encontramos juntos.</em>
            </h2>
          </Reveal>
          <div className="capabilities-visual">
            <ServiceVisual kind={services[active].id} />
          </div>
        </div>
        <div className="capabilities-list">
          {services.map((s, i) => (
            <div
              className={`capability ${i === active ? "is-active" : ""}`}
              key={s.id}
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
                      Explorar servicio <ArrowUpRight size={15} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <p className="capabilities-note">
            Estrategia, diseño y desarrollo.
            <br />
            Pensados como una sola experiencia.
          </p>
        </div>
      </div>
    </section>
  );
}
