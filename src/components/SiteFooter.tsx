import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Symbol } from "./Logo";
import { links } from "./Navigation";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <span>
            Diseño y tecnología
            <br />
            <b>hechos para negocios reales.</b>
          </span>

          <nav aria-label="Navegación de pie de página">
            {links.slice(1).map(([to, label]) => (
              <Link to={to} key={to}>
                {label}
              </Link>
            ))}
          </nav>

          <Link className="footer-conversation" to="/contacto">
            ¿Tenés una idea?
            <br />
            Hablemos <ArrowUpRight size={25} />
          </Link>
        </div>

        <Link
          className="footer-wordmark"
          to="/"
          aria-label="XARCON Creative — Inicio"
        >
          XARCON
          <Symbol />
        </Link>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} XARCON Creative</span>
          <span>Hecho en Nicaragua.</span>
          <span>DISEÑO. WEB. SISTEMAS.</span>
        </div>
      </div>
    </footer>
  );
}
