import Button from "../components/Button";
import Reveal from "../components/Reveal";

export default function Closing() {
  return (
    <section className="closing">
      <img
        src="/images/code.webp"
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
            Tu siguiente etapa
            <br />
            empieza aquí.
          </h2>
          <p>
            Contanos qué querés construir. Hagámoslo posible.
          </p>
          <Button>Solicitar una propuesta</Button>
        </Reveal>
        <span className="closing-origin">
          Nicaragua · trabajo cercano · visión grande.
        </span>
      </div>
    </section>
  );
}
