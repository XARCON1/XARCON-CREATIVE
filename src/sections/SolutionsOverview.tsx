import { useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight, Compass, Layers3, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import DepthReveal from "../components/DepthReveal";
import DissolveImage from "../components/DissolveImage";

const solutions = [
  { title: <>Para marcas<br />en crecimiento.</>, description: "Una identidad que conecta. Una presencia que abre puertas.", tags: ["Identidad", "Experiencia web"], image: "mountain", icon: Sprout, to: "marcas" },
  { title: <>Para equipos<br />en evolución.</>, description: "Menos tareas sueltas. Más claridad para avanzar juntos.", tags: ["Sistemas", "Automatización"], image: "studio", icon: Layers3, to: "equipos" },
  { title: <>Para productos<br />con futuro.</>, description: "Del primer concepto a una experiencia lista para crecer.", tags: ["Producto digital", "Estrategia"], image: "future", icon: Compass, to: "productos" },
];
const desktopQuery = "(min-width: 1024px) and (min-height: 700px)";
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const desktopSnapshot = () => window.matchMedia(desktopQuery).matches;

function Heading() {
  return <Reveal className="section-heading">
    <div><span className="eyebrow">01 / SOLUCIONES A TU MEDIDA</span><h2>Tres enfoques,<br />un mismo propósito.</h2></div>
    <Link className="text-link" to="/soluciones">Encuentra tu siguiente paso <ArrowUpRight size={18} /></Link>
  </Reveal>;
}

function SolutionCard({ index }: { index: number }) {
  const s = solutions[index];
  return <Link className="solution-card" to={`/soluciones#${s.to}`}>
    <DissolveImage src={`/images/${s.image}.webp`} alt="" loading="lazy" width="800" height="1000" />
    <div className="solution-shade" />
    <div className="solution-top"><s.icon size={23} strokeWidth={1.4} /><span>0{index + 1}</span></div>
    <div className="solution-copy">
      <h3>{s.title}</h3><p>{s.description}</p>
      <div className="solution-bottom"><div>{s.tags.map(t => <span key={t}>{t}</span>)}</div><span className="circle-arrow"><ArrowUpRight size={21} /></span></div>
    </div>
  </Link>;
}

const paths = [
  { x: ["-149%", "-119%", "-115%", "-126%"], y: [100, 12, 0, -50], z: [-380, 35, 0, -80], yaw: [38, -8, -7, 12], roll: [-8, -2, 0, -3], opacity: [0.65, 1, 1, 1] },
  { x: ["18%", "7%", "0%", "-3%"], y: [240, 135, 65, 15], z: [-800, -230, 45, 15], yaw: [-38, 22, 0, -9], roll: [7, 3, 0, 1], opacity: [0, 0.8, 1, 1] },
  { x: ["166%", "136%", "115%", "120%"], y: [-50, -12, 10, -48], z: [-680, -200, -30, 15], yaw: [-52, -22, 8, 12], roll: [9, 3, 0, 3], opacity: [0.15, 0.75, 1, 1] },
];
function OrbitCard({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const path = paths[index];
  const stops = [0, 0.3, 0.65, 1];
  const x = useTransform(progress, stops, path.x);
  const y = useTransform(progress, stops, path.y);
  const z = useTransform(progress, stops, path.z);
  const rotateY = useTransform(progress, stops, path.yaw);
  const rotateZ = useTransform(progress, stops, path.roll);
  const opacity = useTransform(progress, stops, path.opacity);
  return <motion.div className={`orbit-card solution-wrap solution-${index}`} style={{ x, y, z, rotateY, rotateZ, opacity }}>
    <SolutionCard index={index} />
  </motion.div>;
}

function OrbitScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 125, damping: 30, mass: 0.6 });
  return <section ref={ref} id="soluciones" className="solutions-overview orbit-scene">
    <div className="orbit-sticky">
      <div className="wrap"><Heading /></div>
      <div className="orbit-arena wrap">
        {solutions.map((s, i) => <OrbitCard index={i} progress={progress} key={s.to} />)}
      </div>
      <div className="orbit-cue" aria-hidden="true"><span>EXPLORA LAS POSIBILIDADES</span><div><motion.i style={{ scaleX: progress }} /></div><ArrowDown size={14} /></div>
    </div>
  </section>;
}

export default function SolutionsOverview() {
  const desktop = useSyncExternalStore(subscribe, desktopSnapshot, () => false);
  const reduced = useReducedMotion();
  if (desktop && !reduced) return <OrbitScene />;
  return <section id="soluciones" className="section solutions-overview solutions-flow wrap">
    <Heading />
    <div className="solution-grid">
      {solutions.map((s, i) => <DepthReveal className={`solution-wrap solution-${i}`} side={i % 2 ? 1 : -1} strength={0.8} key={s.to}><SolutionCard index={i} /></DepthReveal>)}
    </div>
  </section>;
}
