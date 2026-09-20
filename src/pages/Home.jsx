import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Code2, Compass, Layers3, Sparkles, Workflow, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionReveal from '../components/SectionReveal';

const NICARAGUA = 'https://images.unsplash.com/photo-1574616747921-03799d70f7c4?auto=format&fit=crop&q=88&w=2200';
const ARCH = 'https://images.unsplash.com/photo-1607331488025-a81a1f2214e8?auto=format&fit=crop&q=85&w=1600';
const OFFICE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=85&w=1600';
const WORK = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=85&w=1600';

const services = [
  { icon: Sparkles, title: 'Identidad de marca', text: 'Una presencia clara, memorable y coherente.', tone: 'green' },
  { icon: Code2, title: 'Sitios web', text: 'Experiencias rápidas, atractivas y fáciles de usar.', tone: 'blue' },
  { icon: Layers3, title: 'Sistemas digitales', text: 'Herramientas hechas alrededor de tu operación.', tone: 'violet' },
  { icon: Workflow, title: 'Automatización', text: 'Menos tareas repetitivas. Más tiempo para avanzar.', tone: 'lime' }
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
      <section className="hero-photo" style={{ '--hero-image': 'url(' + NICARAGUA + ')' }}>
        <div className="hero-overlay" />
        <div className="hero-light" />
        <div className="hero-content">
          <motion.p className="hero-kicker" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }}>
            Desde Nicaragua · para marcas en movimiento
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .28, duration: .7 }}>
            Soluciones que<br />impulsan <span>lo que viene.</span>
          </motion.h1>
          <motion.p className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}>
            Estrategia, diseño y tecnología para convertir buenas ideas en experiencias reales.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }}>
            <Link className="btn primary" to="/contacto">Hablemos de tu idea <ArrowRight size={17} /></Link>
            <Link className="btn glass" to="/soluciones">Ver nuestro enfoque <ArrowUpRight size={16} /></Link>
          </motion.div>
        </div>

        <motion.div className="hero-device" initial={{ opacity: 0, x: 45, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: .9, delay: .36 }}>
          <div className="device-bar"><i /><i /><i /><span>xarcon / experiencia</span></div>
          <div className="device-screen">
            <small>IDEAS EN MOVIMIENTO</small>
            <strong>Diseño que se siente.<br />Tecnología que funciona.</strong>
            <div className="device-photo" style={{ backgroundImage: 'url(' + ARCH + ')' }} />
          </div>
        </motion.div>

        <motion.div className="float-card fc-one" animate={{ y: [0, -12, 0] }} transition={{ duration: 4.8, repeat: Infinity }}>
          <BarChart3 size={20} /><span>Crecimiento<br /><b>con dirección</b></span>
        </motion.div>
        <motion.div className="float-card fc-two" animate={{ y: [0, 10, 0] }} transition={{ duration: 5.6, repeat: Infinity }}>
          <Compass size={20} /><span>Soluciones<br /><b>con propósito</b></span>
        </motion.div>

        <div className="hero-bottom">
          <span>Creatividad</span><span>Diseño</span><span>Tecnología</span><span>Estrategia</span>
        </div>
      </section>

      <section className="section light services-home">
        <SectionReveal className="section-head">
          <div><small>NUESTROS SERVICIOS</small><h2>Todo lo que tu idea necesita,<br />en un mismo lugar.</h2></div>
          <Link to="/servicios">Ver todos <ArrowRight size={16} /></Link>
        </SectionReveal>

        <div className="service-grid">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.title} className={'service-card tone-' + item.tone} delay={index * .06}>
                <div className="service-icon"><Icon size={23} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <Link to="/servicios" aria-label={'Ver ' + item.title}><ArrowUpRight size={17} /></Link>
              </SectionReveal>
            );
          })}
        </div>
      </section>

      <section className="section solutions-preview">
        <SectionReveal className="section-head">
          <div><small>SOLUCIONES PARA CADA ETAPA</small><h2>No todas las marcas<br />necesitan lo mismo.</h2></div>
          <p>Diseñamos el alcance alrededor del objetivo, no alrededor de un paquete rígido.</p>
        </SectionReveal>
        <div className="solution-tiles">
          <SectionReveal className="solution-tile dark" delay={.04}>
            <img src={OFFICE} alt="" />
            <div><small>PARA MARCAS EN CRECIMIENTO</small><h3>Más claridad.<br />Más presencia.</h3><Link to="/soluciones">Explorar <ArrowRight size={16} /></Link></div>
          </SectionReveal>
          <SectionReveal className="solution-tile warm" delay={.1}>
            <img src={WORK} alt="" />
            <div><small>PARA EQUIPOS EN EVOLUCIÓN</small><h3>Procesos más simples.</h3><Link to="/soluciones">Explorar <ArrowRight size={16} /></Link></div>
          </SectionReveal>
          <SectionReveal className="solution-tile green" delay={.16}>
            <div className="abstract-cube"><i /><i /><i /></div>
            <div><small>PARA PRODUCTOS CON FUTURO</small><h3>Una base preparada<br />para crecer.</h3><Link to="/soluciones">Explorar <ArrowRight size={16} /></Link></div>
          </SectionReveal>
        </div>
      </section>

      <section className="section process-preview">
        <SectionReveal className="section-head">
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

      <section className="origin-band">
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
