import { useRef, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import DeviceScene from "../components/DeviceScene";
import Button from "../components/Button";
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  function parallax(event: PointerEvent<HTMLElement>) {
    if (
      reduced ||
      event.pointerType !== "mouse" ||
      !matchMedia("(min-width: 1025px)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    ref.current?.style.setProperty(
      "--px",
      `${(event.clientX - rect.left) / rect.width - 0.5}`,
    );
    ref.current?.style.setProperty(
      "--py",
      `${(event.clientY - rect.top) / rect.height - 0.5}`,
    );
  }
  return (
    <section
      className="hero"
      ref={ref}
      onPointerMove={parallax}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--px", "0");
        ref.current?.style.setProperty("--py", "0");
      }}
    >
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
      <div className="hero-inner wrap">
        <motion.div
          className="hero-copy"
          initial={reduced ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="eyebrow light">
            <span className="eyebrow-rule" /> ESTUDIO DE DISEÑO & TECNOLOGÍA
          </div>
          <h1>
            Ideas con forma.
            <br />
            Negocios con
            <br />
            <em>futuro.</em>
          </h1>
          <p>
            Unimos estrategia, diseño y tecnología
            <br className="desktop-break" /> para dar vida a lo que sigue.
          </p>
          <div className="hero-actions">
            <Button>Habla con nuestro equipo</Button>
            <Link className="text-link light-link" to="/proceso">
              Ver cómo trabajamos <ArrowUpRight size={17} />
            </Link>
          </div>
        </motion.div>
        <DeviceScene />
      </div>
      <div className="hero-bottom wrap">
        <a href="#soluciones" className="hero-explore">
          <ArrowDown size={16} /> Sigue la idea
        </a>
        <span>BASE EN NICARAGUA · VISIÓN ABIERTA</span>
        <span className="hero-edition">ESTRATEGIA / DISEÑO / DESARROLLO</span>
      </div>
    </section>
  );
}
