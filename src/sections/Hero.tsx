import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import DeviceScene from "../components/DeviceScene";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import SceneOpening from "../components/SceneOpening";
import useSceneCamera from "../animations/useSceneCamera";
import PointerRibbon from "../components/PointerRibbon";
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  useSceneCamera(ref);
  return (
    <>
    <SceneOpening />
    <section className="hero hero-directed" ref={ref}>
      <picture className="hero-picture">
        <source media="(max-width: 767px)" srcSet="/images/hero-mobile.webp" />
        <img
          src="/images/hero.webp"
          width="1920"
          height="1080"
          fetchPriority="high"
          alt=""
        />
      </picture>
      <div className="hero-shade" />
      <div className="scene-light" aria-hidden="true" />
      <PointerRibbon />
      <div className="scene-grain" aria-hidden="true" />
      <div className="hero-inner wrap">
        <Reveal className="hero-copy" delay={0.72}>
          <div className="eyebrow light">
            <span className="eyebrow-rule" /> ESTUDIO DE DISEÑO & TECNOLOGÍA
          </div>
          <h1>
            Haz que
            <br />
            <em>te elijan.</em>
          </h1>
          <p>
            Marcas que destacan. Webs que convencen.
            <br className="desktop-break" /> Sistemas que hacen avanzar tu negocio.
          </p>
          <div className="hero-actions">
            <Button>Habla con nuestro equipo</Button>
            <Link className="text-link light-link" to="/proceso">
              Ver cómo trabajamos <ArrowUpRight size={17} />
            </Link>
          </div>
        </Reveal>
        <DeviceScene paused={paused} setPaused={setPaused} />
      </div>
      <div className="hero-bottom wrap">
        <a href="#soluciones" className="hero-explore">
          <ArrowDown size={16} /> Sigue la idea
        </a>
        <span>BASE EN NICARAGUA · VISIÓN ABIERTA</span>
        <span className="hero-edition">ESTRATEGIA / DISEÑO / DESARROLLO</span>
      </div>
    </section>
    </>
  );
}
