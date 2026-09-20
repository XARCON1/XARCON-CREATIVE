import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SectionReveal from '../components/SectionReveal';

export default function Contact() {
  const [sent, setSent] = useState(false);

  function submit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="contact-layout">
      <SectionReveal className="contact-intro">
        <small>CONTACTO</small>
        <h1>Cuéntanos qué quieres<br /><span>hacer realidad.</span></h1>
        <p>No necesitas llegar con todo resuelto. Una idea, un problema o una meta clara es suficiente para empezar.</p>
        <div className="contact-note">
          <strong>Base</strong><span>Nicaragua · trabajo remoto</span>
          <strong>Enfoque</strong><span>Marcas, sitios y soluciones digitales</span>
        </div>
      </SectionReveal>

      <SectionReveal className="contact-card" delay={.08}>
        {sent ? (
          <motion.div className="success-message" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle2 size={42} />
            <h2>Solicitud preparada.</h2>
            <p>La conexión final de correo o WhatsApp se configurará antes del lanzamiento comercial.</p>
          </motion.div>
        ) : (
          <form onSubmit={submit}>
            <label><span>Nombre</span><input required placeholder="Tu nombre" /></label>
            <label><span>Correo</span><input required type="email" placeholder="tu@empresa.com" /></label>
            <label><span>¿Qué necesitas?</span>
              <select required defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Identidad de marca</option><option>Sitio web</option><option>Sistema digital</option><option>Automatización</option><option>Estrategia digital</option><option>No estoy seguro todavía</option></select>
            </label>
            <label><span>Cuéntanos brevemente</span><textarea rows="5" required placeholder="¿Qué quieres lograr?" /></label>
            <button className="btn primary form-button">Preparar solicitud <ArrowRight size={17} /></button>
          </form>
        )}
      </SectionReveal>
    </section>
  );
}
