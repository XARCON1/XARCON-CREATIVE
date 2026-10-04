import Button from "../components/Button";
import Reveal from "../components/Reveal";

export default function Closing() {
  return (
    <section className="closing">
      <img
        src="/images/studio.webp"
        alt=""
        loading="lazy"
        width="1400"
        height="1050"
      />
      <div className="closing-overlay" />
      <div className="wrap closing-inner">
        <Reveal>
          <span className="eyebrow light">HABLEMOS</span>
          <h2>
            ¿Tenés una idea?
            <br />
            Conversemos.
          </h2>
          <p>
            Contanos qué querés mejorar, construir o poner en marcha. Nosotros
            te ayudamos a encontrar una forma clara de hacerlo.
          </p>
          <Button>Contanos tu idea</Button>
        </Reveal>
        <span className="closing-origin">
          Nicaragua · trabajo cercano · visión grande.
        </span>
      </div>
    </section>
  );
}
