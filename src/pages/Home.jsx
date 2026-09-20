import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Code2,
  Compass,
  Layers3,
  Sparkles,
  Workflow
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionReveal from '../components/SectionReveal';

const NICARAGUA = 'https://images.unsplash.com/photo-1574616747921-03799d70f7c4?auto=format&fit=crop&q=90&w=2400';
const ARCH = 'https://images.unsplash.com/photo-1607331488025-a81a1f2214e8?auto=format&fit=crop&q=88&w=1800';
const OFFICE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=88&w=1800';
const WORK = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=88&w=1800';
const WEB = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=88&w=1600';
const DATA = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=88&w=1600';
const TECH = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=88&w=1600';
const BRAND = 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=88&w=1600';

const services = [
  { icon: Sparkles, title: 'Identidad de marca', text: 'Una presencia con personalidad y dirección.', image: BRAND, label: 'Marca' },
  { icon: Code2, title: 'Sitios web', text: 'Experiencias visuales, rápidas y fáciles de usar.', image: WEB, label: 'Experiencia' },
  { icon: Layers3, title: 'Sistemas digitales', text: 'Herramientas para organizar y hacer crecer tu operación.', image: DATA, label: 'Sistemas' },
  { icon: Workflow, title: 'Automatización', text: 'Menos tareas repetitivas. Más tiempo para avanzar.', image: TECH, label: 'Procesos' }
];

const process = [
  ['01', 'Descubrimiento', 'Entendemos tu reto.'],
  ['02', 'Estrategia', 'Definimos el camino.'],
  ['03', 'Diseño y desarrollo', 'Damos forma a la solución.'],
  ['04', 'Lanzamiento', 'La ponemos en movimiento.']
];

export default function Home() {
  return (
    <>
      <section className="hero-cinematic" style={{ '--hero-image': 'url(' + NICARAGUA + ')' }}>
        <div className="hero-cinematic-overlay" />
        <div className="hero-cinematic-glow" />

        <div className="hero-cinematic-copy">
          <motion.p
            className="hero-kicker"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .15 }}
          >
            Desde Nicaragua · para marcas en crecimiento
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .24, duration: .7 }}
          >
            Soluciones que se adaptan<br />
            <span>a cada etapa.</span>
          </motion.h1>

          <motion.p
            className="hero-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .34 }}
          >
            Estrategia, diseño y tecnología para convertir ideas en experiencias reales.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .44 }}
          >
            <Link className="btn hero-lime" to="/contacto">
              Hablemos de tu idea <ArrowRight size={17} />
            </Link>
            <Link className="btn hero-outline" to="/proceso">
              Ver cómo trabajamos <ArrowUpRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            className="hero-triad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: .62 }}
          >
            <span><b>Estrategia</b><small>con propósito</small></span>
            <span><b>Diseño</b><small>que conecta</small></span>
            <span><b>Tecnología</b><small>que impulsa</small></span>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual-cluster"
          initial={{ opacity: 0, x: 55, scale: .97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: .9, delay: .3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="laptop-shell">
            <div className="laptop-camera" />
            <div className="laptop-screen">
              <div className="screen-nav">
                <span className="screen-x">✦</span>
                <span>Inicio</span><span>Soluciones</span><span>Proceso</span>
              </div>
              <div className="screen-layout">
                <div className="screen-copy">
                  <small>IDEAS EN MOVIMIENTO</small>
                  <strong>Marcas con propósito<br />en un mundo real.</strong>
                  <p>Diseño que conecta. Tecnología que funciona.</p>
                  <i>→</i>
                </div>
                <div className="screen-photo" style={{ backgroundImage: 'url(' + ARCH + ')' }}>
                  <span>Un mañana<br />más humano.</span>
                </div>
              </div>
            </div>
            <div className="laptop-base" />
          </div>

          <motion.div
            className="phone-shell"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.2, repeat: Infinity }}
          >
            <div className="phone-notch" />
            <div className="phone-screen" style={{ backgroundImage: 'url(' + NICARAGUA + ')' }}>
              <span>Diseño y<br />tecnología<br />en equilibrio.</span>
              <i>→</i>
            </div>
          </motion.div>

          <motion.div
            className="metric-card metric-one"
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: 4.5, repeat: Infinity }}
          >
            <BarChart3 size={22} />
            <span><small>Crecimiento</small><b>con dirección</b></span>
          </motion.div>

          <motion.div
            className="metric-card metric-two"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5.4, repeat: Infinity }}
          >
            <Compass size={22} />
            <span><small>Soluciones</small><b>con propósito</b></span>
          </motion.div>

          <div className="hero-side-words">
            <span>CREAR</span><span>CONECTAR</span><span>TRANSFORMAR</span>
          </div>
        </motion.div>

        <div className="hero-cinematic-bottom">
          <span>Creatividad con propósito</span>
          <span>Base en Nicaragua · visión abierta</span>
        </div>
      </section>

      <section className="section service-showcase">
        <SectionReveal className="section-head compact-head">
          <div>
            <small>NUESTROS SERVICIOS</small>
            <h2>Diseño, tecnología y estrategia<br />en un mismo propósito.</h2>
          </div>
          <Link to="/servicios">Ver todos <ArrowRight size={16} /></Link>
        </SectionReveal>

        <div className="service-image-grid">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <SectionReveal className="service-image-card" key={item.title} delay={index * .06}>
                <div className="service-image" style={{ backgroundImage: 'url(' + item.image + ')' }}>
                  <div className="service-image-overlay" />
                  <span className="service-badge">{item.label}</span>
                </div>
                <div className="service-image-copy">
                  <div className="service-image-icon"><Icon size={22} /></div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link to="/servicios" aria-label={'Ver ' + item.title}><ArrowUpRight size={17} /></Link>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </section>

      <section className="section solutions-editorial">
        <SectionReveal className="section-head compact-head">
          <div>
            <small>SOLUCIONES PARA CADA DESAFÍO</small>
            <h2>Tres enfoques.<br />Un mismo propósito.</h2>
          </div>
          <p>Elegimos la solución según tu etapa, tu operación y el resultado que buscas.</p>
        </SectionReveal>

        <div className="editorial-solution-grid">
          <SectionReveal className="editorial-card" delay={.03}>
            <img src={OFFICE} alt="" />
            <div className="editorial-overlay" />
            <div className="editorial-content">
              <BarChart3 size={24} />
              <h3>Para marcas<br />en crecimiento</h3>
              <p>Más claridad, mejor presencia y una base para avanzar.</p>
              <div className="tag-row"><span>Identidad</span><span>Sitios web</span><span>Comunicación</span></div>
            </div>
          </SectionReveal>

          <SectionReveal className="editorial-card light-card" delay={.09}>
            <img src={WORK} alt="" />
            <div className="editorial-overlay soft" />
            <div className="editorial-content dark-copy">
              <Layers3 size={24} />
              <h3>Para equipos que<br />necesitan organización</h3>
              <p>Herramientas que simplifican y conectan.</p>
              <div className="tag-row"><span>Sistemas</span><span>Automatización</span><span>Datos</span></div>
            </div>
          </SectionReveal>

          <SectionReveal className="editorial-card" delay={.15}>
            <img src={ARCH} alt="" />
            <div className="editorial-overlay" />
            <div className="editorial-content">
              <Compass size={24} />
              <h3>Para productos<br />con visión de futuro</h3>
              <p>Soluciones flexibles para crecer sin rehacerlo todo.</p>
              <div className="tag-row"><span>Producto digital</span><span>Escala</span><span>Innovación</span></div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="section process-preview refined-process">
        <SectionReveal className="section-head compact-head">
          <div><small>NUESTRO PROCESO</small><h2>De la idea al impacto.</h2></div>
          <Link to="/proceso">Cómo trabajamos <ArrowRight size={16} /></Link>
        </SectionReveal>
        <div className="process-line">
          {process.map((step, index) => (
            <SectionReveal key={step[0]} className="process-step" delay={index * .07}>
              <span>{step[0]}</span><h3>{step[1]}</h3><p>{step[2]}</p><i />
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="origin-band refined-origin">
        <div className="origin-photo" style={{ backgroundImage: 'url(' + NICARAGUA + ')' }} />
        <SectionReveal className="origin-copy">
          <small>NUESTRA BASE</small>
          <h2>Nacemos en Nicaragua.<br /><span>Diseñamos sin fronteras.</span></h2>
          <p>Nuestro mercado comienza aquí, pero nuestra forma de trabajar está pensada para acompañar ideas donde tengan oportunidad de crecer.</p>
          <Link to="/nosotros">Conócenos <ArrowRight size={16} /></Link>
        </SectionReveal>
      </section>

      <section className="final-band">
        <SectionReveal>
          <small>TU PRÓXIMO PASO</small>
          <h2>Hagamos realidad<br />lo que sigue.</h2>
          <Link className="btn primary lime" to="/contacto">Iniciar proyecto <ArrowRight size={17} /></Link>
        </SectionReveal>
      </section>
    </>
  );
}
