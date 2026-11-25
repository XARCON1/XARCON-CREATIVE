import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { links } from "./Navigation";
import { legalDocuments } from "../content/legal";
import "../styles/legal.css";

export default function SiteFooter() {
  return (
    <footer className="xarcon-footer" aria-label="Pie de página XARCON TECH">
      <div className="wrap">
        <div className="xf-grid">
          <div className="xf-brand">
            <Link to="/" aria-label="XARCON TECH — Inicio"><Logo /></Link>
            <p>Tecnología que mueve tu negocio.</p>
            <span>Software · Sistemas · Inteligencia artificial</span>
          </div>
          <nav aria-label="Explorar XARCON">
            <h2>Explorar</h2>
            {links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          </nav>
          <nav aria-label="Información legal">
            <h2>Información legal</h2>
            {legalDocuments.map(doc => <Link key={doc.page} to={doc.path}>{doc.title}</Link>)}
          </nav>
          <div className="xf-contact">
            <h2>Conversemos</h2>
            <p>Tu siguiente etapa empieza aquí.</p>
            <Link to="/contacto" className="xf-cta">Solicitar una propuesta <ArrowUpRight size={17} aria-hidden="true" /></Link>
            <span>Matagalpa, Nicaragua</span>
          </div>
        </div>
        <div className="xf-bottom">
          <span>© {new Date().getFullYear()} XARCON TECH. Todos los derechos reservados.</span>
          <Link to="/">www.xarcontech.com</Link>
          <span>Hecho en Nicaragua.</span>
        </div>
      </div>
    </footer>
  );
}
