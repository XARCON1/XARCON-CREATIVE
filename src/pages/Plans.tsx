import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Check, Globe2, LayoutDashboard, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import Seo from "../components/Seo";
import { launchPlans, launchContactUrl } from "../content/launch";
import "../styles/launch.css";

const icons = [Globe2, LayoutDashboard, TrendingUp];
const questions = [
  ["¿Qué cubre la activación inicial?", "La puesta en marcha y configuración de la solución elegida, dentro del alcance estándar que confirmaremos en tu propuesta."],
  ["¿El dominio y alojamiento están incluidos?", "Los planes incluyen alojamiento y un dominio .com estándar disponible. Los dominios premium, servicios adicionales y recursos fuera del alcance estándar se cotizan por separado."],
  ["¿Cómo funciona la membresía?", "La activación se paga una vez y la membresía se factura mensualmente una vez contratado el servicio. Antes de confirmar, recibirás el alcance, impuestos aplicables, condiciones de renovación y cancelación, soporte y titularidad del dominio."],
  ["¿Puedo usar mi dominio actual?", "Sí, podemos evaluar la conexión de un dominio que ya poseas. La migración de contenido o servicios existentes se revisa antes de cotizar."],
  ["¿Y si necesito un sistema personalizado?", "Launch está diseñado para soluciones estandarizadas. Para software a medida, automatización avanzada o integraciones empresariales, nuestro equipo prepara una propuesta independiente."]
];
export default function Plans() {
  const { search } = useLocation();
  return (
    <div className="launch-page">
      <Seo page="plans" />
      <section className="launch-intro wrap">
        <div className="launch-kicker"><span className="launch-dot" /> XARCON TECH / LAUNCH</div>
        <h1>Tu próximo nivel<br /><em>empieza online.</em></h1>
        <p>Presencia digital profesional, tecnología gestionada y un plan que se adapta a la etapa de tu negocio.</p>
        <div className="launch-trust"><ShieldCheck size={17} /> Dominio propio · Alojamiento incluido · Diseño profesional</div>
      </section>
      <section className="wrap launch-cards" aria-label="Planes de membresía">
        {launchPlans.map((plan,i) => {
          const Icon = icons[i];
          return <article key={plan.id} className={"launch-plan" + (plan.highlight ? " launch-featured" : "")} id={plan.id}>
            <div className="launch-plan-head"><Icon size={24} strokeWidth={1.5} /><span>{plan.highlight ? "PARA NEGOCIOS EN CRECIMIENTO" : "0" + (i+1) + " / LAUNCH"}</span></div>
            <h2>{plan.name}</h2><h3>{plan.title}</h3><p className="launch-description">{plan.description}</p>
            <div className="launch-price"><span>Desde US$</span><strong>{plan.monthly}</strong><small>/mes</small></div>
            <p className="launch-activation">+ US$ {plan.activation} de activación inicial</p>
            <Link className="launch-action" to={launchContactUrl(plan, search)}>Solicitar {plan.name}<ArrowUpRight size={18}/></Link>
            <ul>{plan.features.map(feature => <li key={feature}><Check size={16} strokeWidth={2}/><span>{feature}</span></li>)}</ul>
          </article>;
        })}
      </section>
      <div className="wrap launch-disclaimer">Precios de referencia en USD para alcance estándar; sujetos a confirmación de disponibilidad, condiciones e impuestos aplicables. No se realiza ningún cobro al solicitar un plan. <Link to="/terminos-y-condiciones">Términos y condiciones.</Link></div>
      <section className="wrap launch-process"><div><span className="launch-kicker">TU CAMINO DIGITAL</span><h2>De la idea a tu presencia online.</h2></div><div className="launch-steps">{["Elige tu plan","Definimos el alcance","Configuramos y publicamos"].map((step,i)=><div key={step}><span>0{i+1}</span><strong>{step}</strong></div>)}</div></section>
      <section className="wrap launch-faq"><div><span className="launch-kicker">INFORMACIÓN CLARA</span><h2>Preguntas frecuentes.</h2></div><div>{questions.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="wrap launch-enterprise"><div><span className="launch-kicker">XARCON TECH / SOLUCIONES A MEDIDA</span><h2>¿Tu empresa necesita algo más?</h2><p>Construimos sistemas empresariales, automatizaciones e integraciones diseñadas para necesidades específicas.</p></div><Link to="/contacto" className="launch-action">Hablemos de tu proyecto <ArrowRight size={18}/></Link></section>
    </div>
  );
}
