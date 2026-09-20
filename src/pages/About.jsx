import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionReveal from '../components/SectionReveal';

const NIC = 'https://images.unsplash.com/photo-1574616747921-03799d70f7c4?auto=format&fit=crop&q=88&w=1900';
const ARCH = 'https://images.unsplash.com/photo-1607331488025-a81a1f2214e8?auto=format&fit=crop&q=85&w=1500';

export default function About() {
  return (
    <>
      <section className="about-hero">
        <div className="about-image" style={{ backgroundImage: 'url(' + NIC + ')' }} />
        <SectionReveal className="about-copy">
          <small>NOSOTROS</small>
          <h1>Ideas bien pensadas.<br /><span>Ejecución que se nota.</span></h1>
          <p>XARCON Creative es un estudio de diseño, tecnología y estrategia. Nuestra base está en Nicaragua; nuestra mirada, en las oportunidades que puede alcanzar una buena idea.</p>
        </SectionReveal>
      </section>

      <section className="section light values">
        <SectionReveal className="section-head"><div><small>CÓMO PENSAMOS</small><h2>Simple por fuera.<br />Bien construido por dentro.</h2></div></SectionReveal>
        <div className="value-grid">
          <SectionReveal><span>01</span><h3>Claridad</h3><p>Las personas deben entender una experiencia sin necesitar instrucciones.</p></SectionReveal>
          <SectionReveal delay={.06}><span>02</span><h3>Propósito</h3><p>El diseño tiene que ayudar al negocio, no solo verse bien.</p></SectionReveal>
          <SectionReveal delay={.12}><span>03</span><h3>Calidad</h3><p>Cuidamos los detalles que hacen que una marca se sienta seria y confiable.</p></SectionReveal>
          <SectionReveal delay={.18}><span>04</span><h3>Evolución</h3><p>Construimos pensando en la siguiente etapa, no solo en el lanzamiento.</p></SectionReveal>
        </div>
      </section>

      <section className="split-showcase reverse">
        <SectionReveal className="split-copy">
          <small>BASE EN NICARAGUA · VISIÓN ABIERTA</small>
          <h2>Lo local es nuestro punto de partida, no nuestro límite.</h2>
          <p>Conocemos el contexto de nuestro mercado y al mismo tiempo trabajamos con estándares, herramientas y experiencias que pueden competir en cualquier lugar.</p>
          <Link to="/contacto">Hablemos <ArrowRight size={16} /></Link>
        </SectionReveal>
        <div className="split-image" style={{ backgroundImage: 'url(' + ARCH + ')' }} />
      </section>
    </>
  );
}
