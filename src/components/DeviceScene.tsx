import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Compass,
  Menu,
  Plus,
  Search,
  Signal,
  Wifi,
  BatteryFull,
  Pause,
  Play,
} from "lucide-react";
import { Symbol } from "./Logo";
import Laptop from "./Laptop";
import "../styles/devices.css";

const experiences = [
  "Portal inmobiliario",
  "Sitio corporativo",
  "Panel empresarial",
  "Producto digital",
];
function MobileInterface({ index }: { index: number }) {
  if (index === 2)
    return (
      <div className="mobile-ui mobile-panel">
        <div className="mobile-ui-header">
          <Symbol />
          <Menu size={14} />
        </div>
        <small>TU ESPACIO DE TRABAJO</small>
        <h3>Todo, en su lugar.</h3>
        <div className="mobile-mini-tabs">
          <b>Resumen</b>
          <span>Proyectos</span>
        </div>
        <div className="mobile-stat">
          <span>Proyectos en curso</span>
          <b>
            08 <i>este mes</i>
          </b>
          <div className="mini-bars">
            {[35, 57, 40, 69, 51, 82, 72, 96].map((h, i) => (
              <span style={{ height: `${h}%` }} key={i} />
            ))}
          </div>
        </div>
        <div className="mobile-task">
          <Check size={13} />
          <span>
            Propuesta de marca<small>Lista para revisar</small>
          </span>
        </div>
        <div className="mobile-task">
          <Plus size={13} />
          <span>
            Nuevo sitio web<small>En diseño</small>
          </span>
        </div>
        <div className="mobile-ui-footer">Datos ilustrativos · concepto</div>
      </div>
    );
  if (index === 3)
    return (
      <div className="mobile-ui mobile-product">
        <div className="mobile-ui-header">
          <Symbol />
          <Menu size={14} />
        </div>
        <small>OBJETOS CON OTRA MIRADA</small>
        <h3>
          Menos ruido.
          <br />
          Más intención.
        </h3>
        <img src="/images/future.webp" alt="" />
        <div className="mobile-product-label">
          <span>Forma / Colección 01</span>
          <Plus size={16} />
        </div>
        <span className="mobile-ui-pill">
          Explorar la colección <ArrowUpRight size={13} />
        </span>
      </div>
    );
  if (index === 1)
    return (
      <div className="mobile-ui mobile-corporate">
        <div className="mobile-ui-header">
          <Symbol />
          <Menu size={14} />
        </div>
        <small>IDEAS QUE NOS CONECTAN</small>
        <h3>
          El futuro
          <br />
          se construye
          <br />
          <em>en equipo.</em>
        </h3>
        <img src="/images/studio.webp" alt="" />
        <div className="mobile-corporate-bottom">
          <span>
            Una visión compartida.
            <br />
            Nuevas posibilidades.
          </span>
          <ArrowUpRight size={20} />
        </div>
      </div>
    );
  return (
    <div className="mobile-ui mobile-property">
      <div className="mobile-ui-header">
        <Symbol />
        <Menu size={14} />
      </div>
      <small>HABITAR, A TU MANERA</small>
      <h3>
        Tu próximo
        <br />
        comienzo.
      </h3>
      <div className="mobile-property-image">
        <img src="/images/hero.webp" alt="" />
        <span>Espacios para vivir</span>
      </div>
      <div className="mobile-search">
        <Search size={13} />
        <span>Encuentra tu espacio</span>
        <ArrowUpRight size={13} />
      </div>
      <div className="mobile-property-bottom">
        <span>Arquitectura que inspira.</span>
        <span>01 / 04</span>
      </div>
    </div>
  );
}
export default function DeviceScene() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
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
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % 4), 4400);
    return () => window.clearInterval(timer);
  }, [reduced, paused, inView, visible]);
  return (
    <div
      ref={ref}
      className="device-scene"
      aria-label="Experiencias digitales conceptuales de XARCON"
    >
      <div className="scene-objects" aria-hidden="true">
        <div className="laptop-parallax">
          <Laptop />
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
                  <MobileInterface index={index} />
                </motion.div>
              </AnimatePresence>
              <span className="phone-home" />
            </div>
          </div>
        </div>
        <div className="floating-note note-one">
          <Compass size={21} />
          <span>
            Diseño con<b>intención.</b>
          </span>
          <span className="note-plus">+</span>
        </div>
        <div className="floating-note note-two">
          <BarChart3 size={20} />
          <span>
            Ideas listas<b>para avanzar.</b>
          </span>
        </div>
      </div>
      <div className="scene-caption">
        <span>EXPERIENCIAS CONCEPTUALES</span>
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
              paused ? "Reproducir experiencias" : "Pausar experiencias"
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
