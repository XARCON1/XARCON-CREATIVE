import { Suspense, lazy, useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import RouteAnchor from "./components/RouteAnchor";
import Navigation from "./components/Navigation";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
import "./styles/global.css";
const Services = lazy(() => import("./pages/Services"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Process = lazy(() => import("./pages/Process"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
export default function App() {
  const { pathname, hash } = useLocation();
  const reduced = useReducedMotion();
  const first = useRef(true);
  useEffect(() => {
    if (hash) {
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!first.current)
      document.getElementById("main")?.focus({ preventScroll: true });
    first.current = false;
  }, [pathname, hash]);
  return (
    <MotionConfig reducedMotion="user">
      <Navigation />
      <motion.main
        id="main"
        tabIndex={-1}
        key={pathname}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Suspense
          fallback={
            <div className="route-loading" aria-label="Cargando página" />
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicios" element={<Services />} />
            <Route path="/soluciones" element={<Solutions />} />
            <Route path="/proceso" element={<Process />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            <Route
              path="*"
              element={
                <div className="wrap not-found">
                  <h1>Esta idea aún no tiene página.</h1>
                  <a className="button" href="/">
                    Volver al inicio
                  </a>
                </div>
              }
            />
          </Routes>
          <RouteAnchor />
        </Suspense>
      </motion.main>
      <SiteFooter />
    </MotionConfig>
  );
}
