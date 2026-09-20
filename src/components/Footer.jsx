import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <BrandMark compact />
        <div><strong>XARCON</strong><small>CREATIVE</small></div>
      </div>
      <p>Diseño, tecnología y estrategia con base en Nicaragua y visión abierta.</p>
      <div className="footer-links">
        <Link to="/servicios">Servicios</Link>
        <Link to="/soluciones">Soluciones</Link>
        <Link to="/contacto">Contacto</Link>
      </div>
      <small className="footer-copy">© {new Date().getFullYear()} XARCON Creative</small>
    </footer>
  );
}
