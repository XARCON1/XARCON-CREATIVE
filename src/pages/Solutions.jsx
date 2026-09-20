import { ArrowRight, Building2, UsersRound, Boxes } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionReveal from '../components/SectionReveal';

const NIC = 'https://images.unsplash.com/photo-1574616747921-03799d70f7c4?auto=format&fit=crop&q=88&w=2100';
const OFFICE = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=85&w=1500';
const ARCH = 'https://images.unsplash.com/photo-1607331488025-a81a1f2214e8?auto=format&fit=crop&q=85&w=1500';

export default function Solutions() {
  const cards = [
    { icon: Building2, title: 'Para marcas en crecimiento', text: 'Una presencia más clara, profesional y preparada para atraer nuevas oportunidades.', image: NIC, tags: ['Identidad', 'Sitio web', 'Comunicación'] },
    { icon: UsersRound, title: 'Para equipos que necesitan orden', text: 'Herramientas digitales que simplifican información, seguimiento y tareas repetitivas.', image: OFFICE, tags: ['Sistemas', 'Automatización', 'Datos'] },
    { icon: Boxes, title: 'Para productos con visión de futuro', text: 'Bases digitales flexibles para lanzar, validar y seguir construyendo.', image: ARCH, tags: ['Producto digital', 'Experiencia', 'Crecimiento'] }
  ];

  return (
    <>
      <section className="inner-hero soft">
        <SectionReveal className="inner-copy dark-text">
          <small>SOLUCIONES</small>
          <h1>Lo correcto depende<br /><span>de dónde estás hoy.</span></h1>
          <p>No vendemos paquetes idénticos. Diseñamos el camino según el reto y la etapa del proyecto.</p>
        </SectionReveal>
        <div className="orbital-art"><i /><i /><i /><b>X</b></div>
      </section>

      <section className="section light solution-page-grid">
        {cards.map((item, index) => {
          const Icon = item.icon;
          return (
            <SectionReveal className="solution-page-card" key={item.title} delay={index * .08}>
              <img src={item.image} alt="" />
              <div className="solution-page-copy">
                <Icon size={25} />
                <h2>{item.title}</h2>
                <p>{item.text}</p>
                <div>{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
              </div>
            </SectionReveal>
          );
        })}
      </section>

      <section className="mini-cta">
        <SectionReveal><h2>¿No sabes exactamente qué necesitas?</h2><p>Empezamos por entender el problema.</p><Link className="btn primary" to="/contacto">Conversemos <ArrowRight size={17} /></Link></SectionReveal>
      </section>
    </>
  );
}
