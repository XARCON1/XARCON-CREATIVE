import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Boxes,
  Compass,
  Layers3,
  Play,
  UsersRound
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionReveal from '../components/SectionReveal';

const HERO_BG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=92';
const HERO_SCREEN = 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90';
const PHONE_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=90';

const GROWTH_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=90';
const TEAM_IMAGE = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=90';
const PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1600&q=90';

const PROCESS_IMAGES = [
  'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=700&q=86',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=86',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=700&q=86',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=700&q=86'
];

const CTA_IMAGE = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90';

const process = [
  { number: '01', title: 'Descubrimiento', text: 'Escuchamos, analizamos y entendemos tu visión.' },
  { number: '02', title: 'Estrategia', text: 'Definimos el camino con un plan a la medida.' },
  { number: '03', title: 'Diseño', text: 'Damos forma a la idea con experiencias memorables.' },
  { number: '04', title: 'Lanzamiento', text: 'Te acompañamos hasta verla en movimiento.' }
];

function LaptopExperience() {
  return (
    <motion.div
      className="x-laptop"
      whileHover={{ y: -5, rotateY: -1.2, rotateX: .6 }}
      transition={{ duration: .45 }}
    >
      <div className="x-laptop-lid">
        <div className="x-laptop-camera" />
        <div className="x-screen">
          <div className="x-screen-nav">
            <span className="x-screen-symbol">×</span>
            <div><span>Soluciones</span><span>Proceso</span><span>Contacto</span></div>
            <span className="x-screen-menu">☰</span>
          </div>
          <div className="x-screen-body">
            <div className="x-screen-copy">
              <small>IDEAS QUE IMPULSAN</small>
              <strong>Diseñamos<br />lo que viene.</strong>
              <p>Experiencias digitales con propósito, claridad y personalidad.</p>
              <i>→</i>
            </div>
            <div className="x-screen-image" style={{ backgroundImage: 'url(' + HERO_SCREEN + ')' }}>
              <span>Un mañana<br />más humano.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="x-laptop-base"><i /></div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      <section className="x-hero" style={{ '--x-hero-bg': 'url(' + HERO_BG + ')' }}>
        <div className="x-hero-overlay" />
        <div className="x-hero-light" />

        <div className="x-hero-inner">
          <motion.div
            className="x-hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="x-eyebrow">SOLUCIONES DIGITALES · NICARAGUA + MÁS ALLÁ</p>
            <h1>Ideas que toman forma.<br /><span>Marcas que avanzan.</span></h1>
            <p className="x-hero-lead">
              Estrategia, diseño y tecnología para construir experiencias que se sienten tan bien como funcionan.
            </p>
            <div className="x-hero-actions">
              <Link className="x-btn x-btn-primary" to="/contacto">
                Habla con nuestro equipo <ArrowRight size={17} />
              </Link>
              <Link className="x-hero-video" to="/proceso">
                <span><Play size={13} fill="currentColor" /></span>
                Ver cómo trabajamos
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="x-hero-stage"
            initial={{ opacity: 0, x: 48, scale: .98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: .95, delay: .12, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="x-stage-halo" />
            <LaptopExperience />

            <motion.div
              className="x-phone"
              animate={{ y: [0, -10, 0], rotate: [-4, -3, -4] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="x-phone-notch" />
              <div className="x-phone-screen" style={{ backgroundImage: 'url(' + PHONE_IMAGE + ')' }}>
                <small>CREAR · CONECTAR</small>
                <strong>Diseño en<br />movimiento.</strong>
                <ArrowRight size={15} />
              </div>
            </motion.div>

            <motion.div
              className="x-float-card x-float-top"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BarChart3 size={20} />
              <span><small>Crecimiento</small><b>con dirección</b></span>
            </motion.div>

            <motion.div
              className="x-float-card x-float-bottom"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Compass size={20} />
              <span><small>Soluciones</small><b>con propósito</b></span>
            </motion.div>
          </motion.div>
        </div>

        <div className="x-hero-foot">
          <span>Identidad</span>
          <span>Experiencia web</span>
          <span>Sistemas</span>
          <span>Automatización</span>
        </div>
      </section>

      <section className="x-solutions">
        <SectionReveal className="x-section-head">
          <div>
            <small>NUESTRAS SOLUCIONES</small>
            <h2>Tres enfoques, un mismo propósito.</h2>
          </div>
          <Link to="/soluciones">Conoce todas <ArrowRight size={16} /></Link>
        </SectionReveal>

        <div className="x-solutions-grid">
          <SectionReveal className="x-solution-card x-dark" delay={.02}>
            <img src={GROWTH_IMAGE} alt="" />
            <div className="x-card-shade" />
            <div className="x-card-content">
              <BarChart3 size={25} />
              <h3>Para marcas<br />en crecimiento</h3>
              <p>Estrategia y diseño para llevar tu marca más lejos.</p>
              <Link to="/soluciones" className="x-round-link"><ArrowRight size={17} /></Link>
              <div className="x-tags"><span>Identidad</span><span>Sitios web</span><span>Comunicación</span></div>
            </div>
          </SectionReveal>

          <SectionReveal className="x-solution-card x-light" delay={.08}>
            <img src={TEAM_IMAGE} alt="" />
            <div className="x-card-shade x-card-shade-light" />
            <div className="x-card-content x-dark-copy">
              <UsersRound size={25} />
              <h3>Para equipos que<br />necesitan organización</h3>
              <p>Herramientas digitales que simplifican y conectan.</p>
              <Link to="/soluciones" className="x-round-link"><ArrowRight size={17} /></Link>
              <div className="x-tags"><span>Plataformas</span><span>Automatización</span><span>Experiencias</span></div>
            </div>
          </SectionReveal>

          <SectionReveal className="x-solution-card x-dark" delay={.14}>
            <img src={PRODUCT_IMAGE} alt="" />
            <div className="x-card-shade x-card-shade-green" />
            <div className="x-card-content">
              <Boxes size={25} />
              <h3>Para productos<br />con visión de futuro</h3>
              <p>Soluciones escalables pensadas para el mañana.</p>
              <Link to="/soluciones" className="x-round-link"><ArrowRight size={17} /></Link>
              <div className="x-tags"><span>Producto digital</span><span>Escalabilidad</span><span>Innovación</span></div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="x-process">
        <SectionReveal className="x-process-head">
          <div><small>NUESTRO PROCESO</small><h2>De la idea al impacto.</h2></div>
          <p>Un proceso claro, visual y colaborativo para convertir una buena idea en algo que realmente funciona.</p>
        </SectionReveal>

        <div className="x-process-grid">
          {process.map((step, index) => (
            <SectionReveal className="x-process-item" key={step.number} delay={index * .06}>
              <div className="x-process-image"><img src={PROCESS_IMAGES[index]} alt="" /></div>
              <div className="x-process-top">
                <span>{step.number}</span>
                {index < process.length - 1 && <div className="x-process-line"><i /><b>›</b></div>}
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="x-cta">
        <img className="x-cta-bg" src={CTA_IMAGE} alt="" />
        <div className="x-cta-overlay" />
        <SectionReveal className="x-cta-copy">
          <small>TU PRÓXIMO PASO</small>
          <h2>Hagamos realidad lo que sigue.</h2>
          <p>Cuéntanos tu idea. Nosotros te ayudamos a convertirla en una experiencia clara, útil y memorable.</p>
        </SectionReveal>
        <SectionReveal className="x-cta-action" delay={.08}>
          <Link className="x-btn x-btn-primary" to="/contacto">Iniciar proyecto <ArrowRight size={17} /></Link>
          <span>Base en Nicaragua · visión abierta</span>
        </SectionReveal>
      </section>
    </>
  );
}
