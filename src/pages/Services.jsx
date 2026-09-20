import { ArrowRight, Code2, Sparkles, Layers3, Workflow, Megaphone, WandSparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionReveal from '../components/SectionReveal';

const ARCH = 'https://images.unsplash.com/photo-1607331488025-a81a1f2214e8?auto=format&fit=crop&q=86&w=2100';
const OFFICE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=85&w=1500';

const items = [
  [Sparkles, 'Identidad de marca', 'Nombre, personalidad, lenguaje visual y piezas esenciales.'],
  [Code2, 'Sitios web', 'Experiencias modernas, rápidas y pensadas para convertir visitas en oportunidades.'],
  [Layers3, 'Sistemas digitales', 'Paneles, usuarios, datos y herramientas creadas a la medida.'],
  [Workflow, 'Automatización', 'Procesos conectados para reducir tareas manuales y mejorar respuesta.'],
  [Megaphone, 'Estrategia digital', 'Comunicación, contenido y rutas claras para atraer y crecer.'],
  [WandSparkles, 'Experiencias especiales', 'Lanzamientos, micrositios y soluciones fuera de lo convencional.']
];

export default function Services() {
  return (
    <>
      <section className="inner-hero photo" style={{ '--page-image': 'url(' + ARCH + ')' }}>
        <div className="inner-overlay" />
        <SectionReveal className="inner-copy">
          <small>SERVICIOS</small>
          <h1>Una idea fuerte merece<br /><span>una ejecución a su altura.</span></h1>
          <p>Combinamos diseño, tecnología y estrategia según lo que tu proyecto realmente necesita.</p>
          <Link className="btn primary" to="/contacto">Cuéntanos tu idea <ArrowRight size={17} /></Link>
        </SectionReveal>
      </section>

      <section className="section light">
        <SectionReveal className="section-head"><div><small>CAPACIDADES</small><h2>Soluciones claras,<br />sin complicarlo de más.</h2></div></SectionReveal>
        <div className="capability-list">
          {items.map(([Icon, title, text], index) => (
            <SectionReveal className="capability-row" key={title} delay={index * .05}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div className="cap-icon"><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
              <ArrowRight size={18} />
            </SectionReveal>
          ))}
        </div>
      </section>

      <section className="split-showcase">
        <div className="split-image" style={{ backgroundImage: 'url(' + OFFICE + ')' }} />
        <SectionReveal className="split-copy">
          <small>UN SOLO EQUIPO</small>
          <h2>Menos piezas sueltas.<br />Más coherencia.</h2>
          <p>Cuando estrategia, diseño y desarrollo trabajan juntos, la experiencia se siente más sólida y el proyecto avanza con menos fricción.</p>
          <Link to="/proceso">Ver nuestro proceso <ArrowRight size={16} /></Link>
        </SectionReveal>
      </section>
    </>
  );
}
