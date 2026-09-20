import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Solutions from './pages/Solutions';
import Process from './pages/Process';
import About from './pages/About';
import Contact from './pages/Contact';

function PageShell({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageShell><Home /></PageShell>} />
          <Route path="/servicios" element={<PageShell><Services /></PageShell>} />
          <Route path="/soluciones" element={<PageShell><Solutions /></PageShell>} />
          <Route path="/proceso" element={<PageShell><Process /></PageShell>} />
          <Route path="/nosotros" element={<PageShell><About /></PageShell>} />
          <Route path="/contacto" element={<PageShell><Contact /></PageShell>} />
          <Route path="*" element={<PageShell><Home /></PageShell>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
}
