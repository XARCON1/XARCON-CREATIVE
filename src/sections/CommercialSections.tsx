import Reveal from "../components/Reveal";
import DepthReveal from "../components/DepthReveal";
import Button from "../components/Button";

const principles = [
  ["Tu operación primero.", "Diseñamos alrededor de tus procesos, personas y prioridades."],
  ["Avances que podés ver.", "Alcance acordado, trabajo por etapas y decisiones compartidas."],
  ["Una base para evolucionar.", "Integramos diseño, tecnología y acompañamiento según tu proyecto."],
];

export function WhyXarcon() {
  return <section className="commercial-why">
    <div className="wrap why-stage">
      <DepthReveal className="why-photograph" side={-1} strength={.45}>
        <img src="/images/team.webp" alt="Personas colaborando frente a una computadora" width="1600" height="900" loading="lazy" />
        <span className="why-photo-label">TECNOLOGÍA PARA LAS PERSONAS.</span>
      </DepthReveal>
      <Reveal className="why-copy">
        <span className="eyebrow light">LA DIFERENCIA XARCON</span>
        <h2>Tu negocio.<br />Tus reglas.<br /><em>Tu tecnología.</em></h2>
        <div className="why-principles">{principles.map(([title, detail], i) => <details key={title}><summary><span>0{i + 1}</span>{title}<b>+</b></summary><p>{detail}</p></details>)}</div>
        <Button>Hablemos de tu empresa</Button>
      </Reveal>
      <span className="why-watermark" aria-hidden="true">A MEDIDA.</span>
    </div>
  </section>;
}
