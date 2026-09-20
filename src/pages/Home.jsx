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
import heroConcept from '../assets/hero-concept.webp';
import solutionGrowth from '../assets/solution-growth.webp';
import solutionTeam from '../assets/solution-team.webp';
import solutionProduct from '../assets/solution-product.webp';

const process = [
  { number: '01', title: 'Descubrimiento', text: 'Escuchamos, analizamos y entendemos tu visión.', image: solutionProduct },
  { number: '02', title: 'Estrategia', text: 'Definimos el camino con un plan a la medida.', image: solutionGrowth },
  { number: '03', title: 'Diseño', text: 'Damos forma a la idea con experiencias memorables.', image: solutionTeam },
  { number: '04', title: 'Lanzamiento', text: 'Te acompañamos hasta verla en movimiento.', image: heroConcept }
];

export default function Home() {
  return (
    <>
      <section className="hero-reference">
        <div className="hero-reference-bg" />
        <div className="hero-reference-noise" />

        <div className="hero-reference-inner">
          <motion.div
            className="hero-reference-copy"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="hero-kicker">Desde Nicaragua · para marcas en movimiento</p>
            <h1>Soluciones que se<br />adaptan a cada etapa</h1>
            <p className="hero-reference-lead">
              Estrategia, diseño y tecnología para convertir ideas en experiencias reales.
            </p>

            <div className="hero-reference-actions">
              <Link className="btn hero-lime" to="/contacto">
                Habla con nuestro equipo <ArrowRight size={17} />
              </Link>
              <Link className="hero-play-link" to="/proceso">
                <span className="hero-play"><Play size={14} fill="currentColor" /></span>
                Ver cómo trabajamos
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-reference-scene"
            initial={{ opacity: 0, x: 52, scale: .98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: .95, delay: .12, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="hero-reference-photo"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <img src={heroConcept} alt="" />
            </motion.div>

            <motion.div
              className="hero-phone-pro"
              animate={{ y: [0, -12, 0], rotate: [-4, -3, -4] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="hero-phone-notch" />
              <div className="hero-phone-screen" style={{ backgroundImage: 'url(' + solutionGrowth + ')' }}>
                <small>IDEAS EN MOVIMIENTO</small>
                <strong>Diseño que<br />acompaña.</strong>
                <ArrowRight size={16} />
              </div>
            </motion.div>

            <motion.div
              className="hero-float hero-float-top"
              animate={{ y: [0, -9, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BarChart3 size={20} />
              <span><small>Crecimiento</small><b>con dirección</b></span>
            </motion.div>

            <motion.div
              className="hero-float hero-float-bottom"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Compass size={20} />
              <span><small>Soluciones</small><b>con propósito real</b></span>
            </motion.div>
          </motion.div>
        </div>

        <div className="hero-reference-foot">
          <span>Creatividad</span>
          <span>Diseño</span>
          <span>Tecnología</span>
          <span>Estrategia</span>
        </div>
      </section>

      <section className="home-solutions-v4">
        <SectionReveal className="home-solutions-head">
          <div>
            <small>NUESTRAS SOLUCIONES</small>
            <h2>Tres enfoques, un mismo propósito.</h2>
          </div>
          <Link to="/soluciones">Conoce todas las soluciones <ArrowRight size={16} /></Link>
        </SectionReveal>

        <div className="home-solutions-grid">
          <SectionReveal className="home-solution-card card-dark" delay={.02}>
            <img src={solutionGrowth} alt="" />
            <div className="home-solution-shade" />
            <div className="home-solution-content">
              <BarChart3 size={27} />
              <h3>Para marcas<br />en crecimiento</h3>
              <p>Estrategia y diseño para llevar tu marca más lejos.</p>
              <Link to="/soluciones" className="circle-arrow"><ArrowRight size={17} /></Link>
              <div className="solution-pills"><span>Identidad</span><span>Sitios web</span><span>Comunicación</span></div>
            </div>
          </SectionReveal>

          <SectionReveal className="home-solution-card card-light" delay={.08}>
            <img src={solutionTeam} alt="" />
            <div className="home-solution-shade light" />
            <div className="home-solution-content dark">
              <UsersRound size={27} />
              <h3>Para equipos que<br />necesitan organización</h3>
              <p>Herramientas digitales que simplifican y conectan.</p>
              <Link to="/soluciones" className="circle-arrow"><ArrowRight size={17} /></Link>
              <div className="solution-pills"><span>Plataformas</span><span>Automatización</span><span>Experiencias</span></div>
            </div>
          </SectionReveal>

          <SectionReveal className="home-solution-card card-dark" delay={.14}>
            <img src={solutionProduct} alt="" />
            <div className="home-solution-shade" />
            <div className="home-solution-content">
              <Boxes size={27} />
              <h3>Para productos<br />con visión de futuro</h3>
              <p>Soluciones escalables pensadas para el mañana.</p>
              <Link to="/soluciones" className="circle-arrow"><ArrowRight size={17} /></Link>
              <div className="solution-pills"><span>Producto digital</span><span>Escalabilidad</span><span>Innovación</span></div>
            </div>
          </SectionReveal>
        </div>
      </section>

      <section className="home-process-v4">
        <SectionReveal className="home-process-head">
          <div>
            <small>NUESTRO PROCESO</small>
            <h2>De la idea al impacto.</h2>
          </div>
          <p>Un proceso claro y colaborativo para convertir tus ideas en resultados reales.</p>
        </SectionReveal>

        <div className="home-process-track">
          {process.map((step, index) => (
            <SectionReveal className="home-process-step" key={step.number} delay={index * .07}>
              <div className="process-thumb"><img src={step.image} alt="" /></div>
              <div className="process-number">{step.number}</div>
              <div className="process-connector"><i /><b>›</b></div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="home-cta-v4">
        <div className="home-cta-image"><img src={heroConcept} alt="" /></div>
        <div className="home-cta-shade" />
        <SectionReveal className="home-cta-copy">
          <small>TU PRÓXIMO PASO</small>
          <h2>Hagamos realidad lo que sigue.</h2>
          <p>Cuéntanos tu idea y exploremos juntos cómo llevarla al próximo nivel.</p>
        </SectionReveal>
        <SectionReveal className="home-cta-action" delay={.08}>
          <Link className="btn hero-lime" to="/contacto">Iniciar proyecto <ArrowRight size={17} /></Link>
          <span>Base en Nicaragua · visión abierta</span>
        </SectionReveal>
      </section>
    </>
  );
}
