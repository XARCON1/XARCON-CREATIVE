import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import DeviceScene from "../components/DeviceScene";
import Button from "../components/Button";
import Reveal from "../components/Reveal";
import SceneOpening from "../components/SceneOpening";
import useSceneCamera from "../animations/useSceneCamera";
import PointerRibbon from "../components/PointerRibbon";
import "../styles/hero-commercial.css";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  useSceneCamera(ref);

  return (
    <>
      <SceneOpening />
      <section className="hero hero-directed hero-commercial" ref={ref}>
        <picture className="hero-picture">
          <source media="(max-width: 767px)" srcSet="/images/studio.webp" />
          <img
            src="/images/studio.webp"
            width="1920"
            height="1080"
            fetchPriority="high"
            alt=""
          />
        </picture>
        <div className="hero-shade" />
        <div className="hero-lightstage" aria-hidden="true"><i /><i /><i /></div>
        <svg className="hero-neon-frame" aria-hidden="true" focusable="false"><rect className="frame-base" x="1" y="1" width="100%" height="100%" rx="14" pathLength="100"/><rect className="frame-halo" x="1" y="1" width="100%" height="100%" rx="14" pathLength="100"/><rect className="frame-pulse" x="1" y="1" width="100%" height="100%" rx="14" pathLength="100"/><rect className="frame-core" x="1" y="1" width="100%" height="100%" rx="14" pathLength="100"/></svg>
        <div className="scene-light" aria-hidden="true" />
        <PointerRibbon />
        <div className="scene-grain" aria-hidden="true" />

        <div className="hero-inner wrap">
          <Reveal className="hero-copy" delay={0.72}>
            <div className="eyebrow light">
              <span className="eyebrow-rule" /> DESARROLLO TECNOLÓGICO · NICARAGUA
            </div>
            <h1>
              Transformamos<br />empresas.<br />
              <em>Con tecnología.</em>
            </h1>
            <p>
              Centraliza tu operación, automatiza tareas y convierte tu presencia digital en una herramienta de negocio. Desarrollamos la tecnología que tu empresa necesita.
            </p>
            <div className="hero-service-links" aria-label="Soluciones destacadas"><Link to="/servicios#software">Software a medida</Link><Link to="/servicios#systems">Gestión empresarial</Link><Link to="/servicios#automation">Automatización con IA</Link><Link to="/servicios#web">Web corporativa</Link></div>
            <div className="hero-actions">
              <Button className="hero-quote">Solicitar una propuesta</Button>
              <Link className="text-link light-link" to="/#proyectos">
                Explorar nuestros proyectos <ArrowUpRight size={17} />
              </Link>
            </div>
          </Reveal>

          <DeviceScene paused={paused} setPaused={setPaused} />
        </div>

        <div className="hero-bottom wrap">
          <a href="#soluciones" className="hero-explore">
            <ArrowDown size={16} /> Conocé lo que hacemos
          </a>
          <span>HECHO EN NICARAGUA · PARA NEGOCIOS REALES</span>
          <span className="hero-edition">SOFTWARE / WEB / IA</span>
        </div>
      </section>
    </>
  );
}
