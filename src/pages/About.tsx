import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import { Symbol } from "../components/Logo";
import Closing from "../sections/Closing";
import Seo from "../components/Seo";
import "../styles/pages.css";
const values = [
  [
    "Claridad",
    "Hacemos fácil lo que parece complejo. Cada decisión tiene una razón.",
  ],
  [
    "Propósito",
    "Diseñamos para las personas y para lo que tu negocio necesita lograr.",
  ],
  [
    "Cuidado",
    "La calidad está en el conjunto y en los detalles que casi no se ven.",
  ],
  [
    "Evolución",
    "Las buenas ideas crecen. Creamos bases que permiten seguir avanzando.",
  ],
];
export default function About() {
  return (
    <>
      <Seo page="about" />
      <section className="about-intro page-intro wrap">
        <span className="eyebrow">EL ESTUDIO / NUESTRA FORMA DE VER</span>
        <Reveal>
          <h1>
            Pensamos con intención.
            <br />
            Diseñamos con carácter.
            <br />
            <em>Construimos con propósito.</em>
          </h1>
        </Reveal>
        <div className="about-intro-bottom">
          <Symbol />
          <p>
            Somos XARCON Creative. Un estudio donde estrategia, diseño y
            tecnología se encuentran para hacer avanzar negocios.
          </p>
          <span>
            DISEÑO HUMANO.
            <br />
            MENTALIDAD DIGITAL.
          </span>
        </div>
      </section>
      <section className="about-panorama">
        <img
          src="/images/studio.webp"
          alt="Estudio conceptual rodeado de naturaleza y luz"
          width="1448"
          height="1086"
          fetchPriority="high"
        />
        <div className="about-image-note">
          <span>ESPACIO PARA PENSAR DIFERENTE</span>
          <span>VISIÓN CREATIVA / XARCON</span>
        </div>
      </section>
      <section className="about-belief section wrap">
        <span className="eyebrow">LO QUE NOS MUEVE</span>
        <div>
          <h2>
            Una buena experiencia
            <br />
            hace que todo
            <br />
            <em>tenga más sentido.</em>
          </h2>
          <p>
            Creemos en marcas que se entienden, herramientas que ayudan y
            tecnología que se siente cercana. Escuchamos antes de proponer.
            Pensamos antes de construir.
          </p>
          <p>
            Trabajamos contigo para encontrar una respuesta propia, hecha para
            tu contexto y tu siguiente etapa.
          </p>
        </div>
      </section>
      <section className="about-values">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <span className="eyebrow light">NUESTROS PRINCIPIOS</span>
              <h2>Se nota en cómo trabajamos.</h2>
            </div>
          </div>
          <div className="values-editorial">
            {values.map(([title, text], i) => (
              <Reveal key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section className="about-origin section wrap">
        <div>
          <span className="eyebrow">NUESTRO PUNTO DE PARTIDA</span>
          <h2>
            Base en Nicaragua.
            <br />
            <em>Visión abierta.</em>
          </h2>
        </div>
        <div>
          <p>
            Con raíces aquí y una forma de trabajar que cruza distancias.
            Colaboramos de manera remota, con una mirada cercana a cada negocio.
          </p>
          <Link className="text-link" to="/contacto">
            Conozcamos tu idea <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <Closing />
    </>
  );
}
