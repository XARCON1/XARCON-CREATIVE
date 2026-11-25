import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import Seo from "../components/Seo";
import { legalDocuments, type LegalPageKey } from "../content/legal";
import "../styles/legal.css";

export default function LegalPage({ page }: { page: LegalPageKey }) {
  const doc = legalDocuments.find(item => item.page === page)!;
  return (
    <section className="xlegal">
      <Seo page={page} />
      <div className="wrap">
        <header className="xlegal-header">
          <span className="eyebrow">XARCON TECH / INFORMACIÓN LEGAL</span>
          <h1>{doc.title}</h1>
          <p>{doc.intro}</p>
          <small>Última actualización: 24 de noviembre de 2026</small>
        </header>
        <div className="xlegal-grid">
          <nav className="xlegal-nav" aria-label="Documentos legales">
            {legalDocuments.map(item => <NavLink key={item.page} to={item.path}>{item.title}<ArrowUpRight size={15} aria-hidden="true" /></NavLink>)}
          </nav>
          <article className="xlegal-document">
            {doc.sections.map(([title, body], index) => <section key={title}><h2><span>{String(index + 1).padStart(2, "0")}</span>{title}</h2><p>{body}</p></section>)}
            <Link className="xlegal-contact" to="/contacto">Contactar a XARCON TECH <ArrowUpRight size={17} aria-hidden="true" /></Link>
          </article>
        </div>
      </div>
    </section>
  );
}
