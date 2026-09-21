import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { cinematicEase } from "../animations/sequence";
const MotionNavLink = motion.create(NavLink);
export const links = [
  ["/", "Inicio"],
  ["/servicios", "Servicios"],
  ["/soluciones", "Soluciones"],
  ["/proceso", "Proceso"],
  ["/nosotros", "Nosotros"],
  ["/contacto", "Contacto"],
];
export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const reduce = useReducedMotion();
  const toggle = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current?.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        Saltar al contenido
      </a>
      <header
        className={`navigation ${scrolled ? "is-scrolled" : ""} ${location.pathname === "/" ? "on-hero" : "on-paper"}`}
      >
        <Link to="/" aria-label="XARCON Creative — Inicio">
          <Logo />
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>
              {label}
            </NavLink>
          ))}
        </nav>
        <Link className="nav-project" to="/contacto">
          Iniciar proyecto <ArrowUpRight size={16} />
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label="Abrir menú"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <Menu size={23} />
        </button>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="mobile-menu"
        onCancel={() => setOpen(false)}
        aria-label="Menú principal"
      >
        <div className="mobile-menu-top">
          <Logo />
          <button
            aria-label="Cerrar menú"
            onClick={() => {
              setOpen(false);
              toggle.current?.focus();
            }}
          >
            <X size={28} />
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={reduce ? false : "closed"}
              animate="open"
              variants={{ closed: {}, open: { transition: { staggerChildren: 0.065, delayChildren: 0.08 } } }}
              aria-label="Navegación móvil"
            >
              {links.map(([to, label], i) => (
                <MotionNavLink
                  to={to}
                  end={to === "/"}
                  key={to}
                  onClick={() => setOpen(false)}
                  variants={{ closed: { y: 38, opacity: 0, clipPath: "inset(0 0 100% 0)" }, open: { y: 0, opacity: 1, clipPath: "inset(0)" } }}
                  transition={{ duration: reduce ? 0 : 0.65, ease: cinematicEase }}
                >
                  <span>0{i + 1}</span>
                  {label}
                  <ArrowUpRight size={25} />
                </MotionNavLink>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
        <p>Desde Nicaragua, para ideas sin fronteras.</p>
      </dialog>
    </>
  );
}
