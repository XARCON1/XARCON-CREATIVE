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
          <span className="eyebrow light">EL SIGUIENTE CAPÍTULO</span>
          <h2>
            Hagamos realidad
            <br />
            lo que sigue.
          </h2>
          <p>Las buenas conversaciones son el principio de algo grande.</p>
          <Button />
        </Reveal>
        <span className="closing-origin">
          Base en Nicaragua · visión abierta.
        </span>
      </div>
    </section>
  );
}
