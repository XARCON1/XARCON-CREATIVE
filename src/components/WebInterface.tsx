import { ArrowUpRight, Menu } from "lucide-react";
import { Symbol } from "./Logo";
export function WebInterface({ variant = 0 }: { variant?: number }) {
  return (
    <div className={`web-interface web-variant-${variant}`}>
      <div className="web-interface-nav">
        <span>
          <Symbol /> XARCON<span className="web-mini-creative"> CREATIVE</span>
        </span>
        <div>
          Espacios <span>Visión</span> Contacto
        </div>
        <Menu size={12} />
      </div>
      <div className="web-interface-hero">
        <img src="/images/hero.webp" alt="" />
        <div>
          <small>DISEÑAR PARA VIVIR MEJOR</small>
          <strong>
            Un lugar para
            <br />
            lo que sigue.
          </strong>
          <span>
            Espacios que conectan contigo. <ArrowUpRight size={15} />
          </span>
        </div>
        <span className="web-image-counter">01 — 03</span>
      </div>
      <div className="web-interface-bottom">
        <span>
          Arquitectura.
          <br />
          <b>Naturaleza. Posibilidades.</b>
        </span>
        <div>
          <span>Forma</span>
          <span>Función</span>
          <span>Futuro</span>
        </div>
        <ArrowUpRight size={21} />
      </div>
    </div>
  );
}
