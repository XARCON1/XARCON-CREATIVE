import { useEffect, useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValue, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight, Compass, Layers3, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import DepthReveal from "../components/DepthReveal";
import DissolveImage from "../components/DissolveImage";
import { projectOrbitCard, worldCameraProgress } from "../graphics/sceneMotion";

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

function OrbitCard({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const width = useMotionValue(window.innerWidth);
  const height = useMotionValue(window.innerHeight);
  useEffect(() => {
    const resize = () => { width.set(window.innerWidth); height.set(window.innerHeight); };
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, [width, height]);
  const pose = useTransform(() => projectOrbitCard(worldCameraProgress.get(), progress.get(), index, width.get(), height.get()));
  const x = useTransform(pose, value => value.x);
  const y = useTransform(pose, value => value.y);
  const scale = useTransform(pose, value => value.scale);
  const rotateY = useTransform(pose, value => value.rotateY);
  const rotateZ = useTransform(pose, value => value.rotateZ);
  const opacity = useTransform(pose, value => value.opacity);
  const zIndex = useTransform(pose, value => value.zIndex);
  return <motion.div className={`orbit-card solution-wrap solution-${index}`} style={{ x, y, scale, rotateY, rotateZ, opacity, zIndex }}>
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
      <div className="orbit-arena">
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
