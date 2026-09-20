import { ArrowRight, Search, Route, PenTool, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionReveal from '../components/SectionReveal';

const steps = [
  [Search, '01', 'Descubrimiento', 'Escuchamos, hacemos preguntas y entendemos qué debe cambiar.'],
  [Route, '02', 'Estrategia', 'Definimos prioridades, alcance y una ruta simple para avanzar.'],
  [PenTool, '03', 'Diseño y desarrollo', 'Convertimos la estrategia en una experiencia funcional y cuidada.'],
  [Rocket, '04', 'Lanzamiento', 'Probamos, publicamos y dejamos una base lista para seguir creciendo.']
];

export default function Process() {
  return (
    <>
      <section className="inner-hero dark-simple">
        <SectionReveal className="inner-copy">
          <small>PROCESO</small>
          <h1>Un buen resultado empieza<br /><span>con un camino claro.</span></h1>
          <p>Menos reuniones innecesarias, menos palabras complicadas y más decisiones que hacen avanzar el proyecto.</p>
        </SectionReveal>
        <div className="process-hero-line"><i /><i /><i /><i /></div>
      </section>

      <section className="section light process-page">
        {steps.map(([Icon, number, title, text], index) => (
          <SectionReveal className="big-step" key={number} delay={index * .06}>
            <div className="big-step-index">{number}</div>
            <div className="big-step-icon"><Icon size={26} /></div>
            <div><h2>{title}</h2><p>{text}</p></div>
            <ArrowRight className="big-step-arrow" size={20} />
          </SectionReveal>
        ))}
      </section>

      <section className="expect-band">
        <SectionReveal className="expect-copy"><small>QUÉ PUEDES ESPERAR</small><h2>Claridad durante todo el proyecto.</h2></SectionReveal>
        <div className="expect-grid">
          <SectionReveal><strong>Comunicación directa</strong><p>Sabes qué estamos haciendo y por qué.</p></SectionReveal>
          <SectionReveal delay={.05}><strong>Decisiones visibles</strong><p>Revisas avances antes de seguir construyendo.</p></SectionReveal>
          <SectionReveal delay={.1}><strong>Entrega ordenada</strong><p>Recibes una solución lista para operar.</p></SectionReveal>
        </div>
        <Link className="btn primary" to="/contacto">Empezar un proyecto <ArrowRight size={17} /></Link>
      </section>
    </>
  );
}
