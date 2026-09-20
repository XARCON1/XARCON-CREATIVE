import { ArrowUpRight, Compass, Layers3, Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
const solutions = [
  {
    title: (
      <>
        Para marcas
        <br />
        en crecimiento.
      </>
    ),
    description: "Una identidad que conecta. Una presencia que abre puertas.",
    tags: ["Identidad", "Experiencia web"],
    image: "mountain",
    icon: Sprout,
    to: "marcas",
  },
  {
    title: (
      <>
        Para equipos
        <br />
        en evolución.
      </>
    ),
    description: "Menos tareas sueltas. Más claridad para avanzar juntos.",
    tags: ["Sistemas", "Automatización"],
    image: "studio",
    icon: Layers3,
    to: "equipos",
  },
  {
    title: (
      <>
        Para productos
        <br />
        con futuro.
      </>
    ),
    description: "Del primer concepto a una experiencia lista para crecer.",
    tags: ["Producto digital", "Estrategia"],
    image: "future",
    icon: Compass,
    to: "productos",
  },
];
export default function SolutionsOverview() {
  return (
    <section id="soluciones" className="section solutions-overview wrap">
      <Reveal className="section-heading">
        <div>
          <span className="eyebrow">01 / SOLUCIONES A TU MEDIDA</span>
          <h2>
            Tres enfoques,
            <br />
            un mismo propósito.
          </h2>
        </div>
        <Link className="text-link" to="/soluciones">
          Encuentra tu siguiente paso <ArrowUpRight size={18} />
        </Link>
      </Reveal>
      <div className="solution-grid">
        {solutions.map((s, i) => (
          <Reveal
            className={`solution-wrap solution-${i}`}
            key={s.to}
            delay={i * 0.08}
          >
            <Link className="solution-card" to={`/soluciones#${s.to}`}>
              <img
                src={`/images/${s.image}.webp`}
                alt=""
                loading="lazy"
                width="800"
                height="1000"
              />
              <div className="solution-shade" />
              <div className="solution-top">
                <s.icon size={23} strokeWidth={1.4} />
                <span>0{i + 1}</span>
              </div>
              <div className="solution-copy">
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                <div className="solution-bottom">
                  <div>
                    {s.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <span className="circle-arrow">
                    <ArrowUpRight size={21} />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
