import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { services } from "../data";
import ServiceVisual from "../components/ServiceVisual";
import Reveal from "../components/Reveal";
import Button from "../components/Button";
import Closing from "../sections/Closing";
import Seo from "../components/Seo";
import "../styles/pages.css";
export default function Services() {
  const { hash } = useLocation();
  const [active, setActive] = useState(0);
  useEffect(() => {
    const index = services.findIndex((s) => "#" + s.id === hash);
    if (index !== -1) {
      setActive(index);
      const timer = setTimeout(
        () =>
          document
            .getElementById("explorar-servicios")
            ?.scrollIntoView({ behavior: "instant" }),
        160,
      );
      return () => clearTimeout(timer);
    }
  }, [hash]);
  const service = services[active];
  return (
    <>
      <Seo page="services" />
      <section className="services-intro wrap page-intro">
        <Reveal className="services-intro-copy">
          <span className="eyebrow">SERVICIOS / UNA VISIÓN COMPLETA</span>
          <h1>
            Buenas ideas.
            <br />
            Todas las formas
            <br />
            <em>de hacerlas realidad.</em>
          </h1>
          <p>
            De la personalidad de tu marca a las herramientas que hacen
            funcionar tu negocio.
          </p>
          <a className="text-link" href="#explorar-servicios">
            Explora nuestras capacidades <ArrowUpRight size={17} />
          </a>
        </Reveal>
        <div className="services-intro-art">
          <img
            src="/images/future.webp"
            alt="Escultura conceptual de vidrio azul, luz y piedra"
            width="900"
            height="900"
            fetchPriority="high"
          />
          <div>
            <span>ESTRATEGIA × DISEÑO × TECNOLOGÍA</span>
            <Plus size={23} />
          </div>
        </div>
      </section>
      <section id="explorar-servicios" className="service-explorer section">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ELIGE DÓNDE EMPEZAMOS</span>
              <h2>Una capacidad para cada reto.</h2>
            </div>
            <p>
              Todo se conecta.
              <br />
              Empezamos por lo que necesitas hoy.
            </p>
          </div>
          <div className="service-explorer-layout">
            <nav className="service-index" aria-label="Explorar servicios">
              {services.map((s, i) => (
                <button
                  key={s.id}
                  aria-pressed={active === i}
                  aria-controls="service-detail"
                  onClick={() => setActive(i)}
                >
                  <span>0{i + 1}</span>
                  <span>{s.name}</span>
                  <ArrowUpRight size={18} />
                </button>
              ))}
            </nav>
            <div id="service-detail" className="service-detail">
              <div className="service-detail-visual">
                <ServiceVisual key={service.id} kind={service.id} />
              </div>
              <div className="service-detail-copy" aria-live="polite">
                <span className="eyebrow">{service.name}</span>
                <h3>{service.line}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.deliverables.map((d) => (
                    <li key={d}>
                      <Check size={14} />
                      {d}
                    </li>
                  ))}
                </ul>
                <Button
                  to={`/contacto?servicio=${encodeURIComponent(service.name)}`}
                  variant="dark"
                >
                  Hablemos de tu proyecto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="service-manifesto wrap section">
        <span className="eyebrow">EL VALOR ESTÁ EN LA CONEXIÓN</span>
        <h2>
          Una marca clara.
          <br />
          Una experiencia coherente.
          <br />
          <span>Un negocio que avanza.</span>
        </h2>
        <p>
          Pensamos el conjunto y cuidamos cada detalle. La estrategia orienta,
          el diseño conecta y la tecnología lo hace posible.
        </p>
      </section>
      <Closing />
    </>
  );
}
