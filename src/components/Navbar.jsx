import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import BrandMark from './BrandMark';

const links = [
  ['/', 'Inicio'],
  ['/servicios', 'Servicios'],
  ['/soluciones', 'Soluciones'],
  ['/proceso', 'Proceso'],
  ['/nosotros', 'Nosotros'],
  ['/contacto', 'Contacto']
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <>
      <header className={scrolled ? 'topbar scrolled' : 'topbar'}>
        <Link to="/" className="brand-lockup" onClick={() => setOpen(false)}>
          <BrandMark />
          <span><strong>XARCON</strong><small>CREATIVE</small></span>
        </Link>

        <nav className="desktop-links" aria-label="Navegación principal">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
          ))}
        </nav>

        <Link className="nav-cta" to="/contacto">
          Iniciar proyecto <ArrowUpRight size={15} />
        </Link>

        <button className="menu-toggle" type="button" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-drawer"
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
          >
            {links.map(([to, label], index) => (
              <motion.div key={to} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
                <NavLink to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
