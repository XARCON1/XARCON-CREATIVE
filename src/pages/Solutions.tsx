import { ArrowDown, ArrowUpRight } from "lucide-react";
import Reveal from "../components/Reveal";
import Button from "../components/Button";
import { BrandVisual, SystemVisual } from "../components/ServiceVisual";
import Closing from "../sections/Closing";
import Seo from "../components/Seo";
import "../styles/pages.css";
const scenarios = [
  {
    id: "marcas",
    index: "01",
    eyebrow: "MARCAS EN CRECIMIENTO",
    title: "Tu negocio cambió.\nTu marca también puede.",
    challenge:
      "Has crecido, pero tu imagen y tu web todavía no cuentan lo que eres hoy.",
    approach:
      "Una identidad clara, una presencia digital a medida y una voz que conecta.",
    outcome:
      "Una experiencia coherente, preparada para comunicar tu valor y abrir conversaciones.",
    tags: ["Identidad de marca", "Sitio web", "Estrategia digital"],
  },
  {
    id: "equipos",
    index: "02",
    eyebrow: "EQUIPOS EN EVOLUCIÓN",
    title: "Más equipo.\nMenos piezas sueltas.",
    challenge:
      "La información está repartida entre mensajes, archivos y tareas que dependen de una sola persona.",
    approach:
      "Un sistema que reúne información y conecta los pasos de tu operación.",
    outcome:
      "Mayor claridad para colaborar, dar seguimiento y tomar decisiones.",
    tags: ["Sistemas digitales", "Automatización", "Organización"],
  },
  {
    id: "productos",
    index: "03",
    eyebrow: "PRODUCTOS CON VISIÓN DE FUTURO",
    title: "Una idea que merece\nsalir al mundo.",
    challenge:
      "Tienes una idea, pero necesitas saber cómo convertirla en una experiencia útil.",
    approach:
      "Definimos lo esencial, diseñamos un prototipo y construimos una primera versión con sentido.",
    outcome:
      "Un producto listo para probar con personas reales y aprender antes de seguir creciendo.",
    tags: ["Producto digital", "Prototipos", "Experiencia de usuario"],
  },
];
export default function Solutions() {
  return (
    <>
      <Seo page="solutions" />
      <section className="solutions-intro page-intro wrap">
        <Reveal>
          <span className="eyebrow">SOLUCIONES / EL MOMENTO IMPORTA</span>
          <h1>
            Tu siguiente etapa
            <br />
            merece su propia
            <br />
            <em>solución.</em>
          </h1>
        </Reveal>
        <div className="solutions-intro-right">
          <p>
            Hay un punto de partida distinto para cada negocio. Encontramos el
            tuyo.
          </p>
          <nav aria-label="Situaciones de negocio">
            {scenarios.map((s) => (
              <a href={"#" + s.id} key={s.id}>
                <span>{s.index}</span>
                {s.eyebrow.toLowerCase()}
                <ArrowDown size={17} />
              </a>
            ))}
          </nav>
        </div>
      </section>
      <div className="solution-stories">
        {scenarios.map((s, i) => (
          <section id={s.id} className={`solution-story story-${i}`} key={s.id}>
            <div className="wrap story-layout">
              <Reveal className="story-visual">
                <span className="story-oversize">{s.index}</span>
                {i === 0 ? (
                  <>
                    <img
                      src="/images/mountain.webp"
                      alt="Cumbre montañosa iluminada por el sol"
                      loading="lazy"
                      width="800"
                      height="900"
                    />
                    <div className="story-brand">
                      <BrandVisual />
                    </div>
                  </>
                ) : i === 1 ? (
                  <>
                    <img
                      src="/images/studio.webp"
                      alt="Espacio de trabajo conceptual con luz natural"
                      loading="lazy"
                      width="800"
                      height="900"
                    />
                    <div className="story-system">
                      <SystemVisual />
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src="/images/future.webp"
                      alt="Objeto conceptual en vidrio azul"
                      loading="lazy"
                      width="800"
                      height="900"
                    />
                    <span className="story-product-label">
                      DEL CONCEPTO
                      <br />A LO POSIBLE. <ArrowUpRight size={40} />
                    </span>
                  </>
                )}
              </Reveal>
              <Reveal className="story-copy">
                <span className="eyebrow">{s.eyebrow}</span>
                <h2>
                  {s.title.split("\n").map((line, j) => (
                    <span key={line}>
                      {j > 0 && <br />}
                      {line}
                    </span>
                  ))}
                </h2>
                <dl>
                  <div>
                    <dt>El punto de partida</dt>
                    <dd>{s.challenge}</dd>
                  </div>
                  <div>
                    <dt>Lo que construimos</dt>
                    <dd>{s.approach}</dd>
                  </div>
                  <div>
                    <dt>Lo que buscamos lograr</dt>
                    <dd>{s.outcome}</dd>
                  </div>
                </dl>
                <div className="story-tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <Button variant="dark">Encontremos tu solución</Button>
                <small>
                  Escenario conceptual. El alcance se define para cada proyecto.
                </small>
              </Reveal>
            </div>
          </section>
        ))}
      </div>
      <Closing />
    </>
  );
}
