import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { Pause, Play, Signal, Wifi, BatteryFull } from "lucide-react";
import { MobileProductDemo, demoModes } from "./ProductDemo";
import Laptop from "./Laptop";
import "../styles/devices.css";

const experiences = demoModes.map(mode => mode.name);

export default function DeviceScene({
  paused,
  setPaused,
}: {
  paused: boolean;
  setPaused: Dispatch<SetStateAction<boolean>>;
}) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const fn = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, []);

  useEffect(() => {
    if (reduced || paused || !inView || !visible) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % 4), 6400);
    return () => window.clearInterval(timer);
  }, [reduced, paused, inView, visible]);

  return (
    <div
      ref={ref}
      className="device-scene"
      aria-label="Ejemplos de soluciones digitales de XARCON"
    >
      <div className="scene-objects" aria-hidden="true">
        <div className="laptop-parallax">
          <Laptop paused={paused} active={inView && visible} index={index} />
        </div>

        <div className="phone-parallax">
          <div className="phone">
            <span className="phone-side side-one" />
            <span className="phone-side side-two" />
            <span className="phone-side side-three" />
            <div className="phone-glass">
              <div className="phone-status">
                <span>9:41</span>
                <span>
                  <Signal size={10} />
                  <Wifi size={10} />
                  <BatteryFull size={13} />
                </span>
              </div>
              <span className="dynamic-island" />
              <AnimatePresence mode="sync">
                <motion.div
                  className="phone-content"
                  key={index}
                  initial={
                    reduced ? false : { opacity: 0, y: 25, filter: "blur(4px)" }
                  }
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.55 }}
                >
                  <MobileProductDemo index={index} />
                </motion.div>
              </AnimatePresence>
              <span className="phone-home" />
            </div>
          </div>
        </div>

        <div className="floating-note note-one"><span className="demo-live-dot" /><span>EXPERIENCIA DIGITAL<b>{experiences[index]}</b></span><span className="note-plus">0{index + 1}</span></div>
        <div className="floating-note note-two"><span>DESARROLLO A MEDIDA<b>Una plataforma. Tu operación.</b></span></div>
      </div>

      <div className="scene-caption">
        <span>DEMO CONCEPTUAL / {experiences[index].toUpperCase()}</span>
        <div className="scene-controls">
          {experiences.map((label, i) => (
            <button
              key={label}
              className={index === i ? "selected" : ""}
              aria-label={`Mostrar ${label.toLowerCase()}`}
              aria-pressed={index === i}
              onClick={() => {
                setIndex(i);
                setPaused(true);
              }}
            />
          ))}
          <button
            className="scene-pause"
            aria-label={
              paused ? "Reproducir ejemplos" : "Pausar ejemplos"
            }
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <Play size={11} /> : <Pause size={11} />}
          </button>
        </div>
      </div>
    </div>
  );
}
