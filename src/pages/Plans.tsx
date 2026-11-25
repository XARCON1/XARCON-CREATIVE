import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Check, Globe2, LayoutDashboard, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";
import Seo from "../components/Seo";
import { launchPlans, launchContactUrl, blackWeekEnds, isBlackWeek, regularActivation, formatLaunchAmount } from "../content/launch";
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
  const [offer, setOffer] = useState(() => isBlackWeek());
  const cardsRef = useRef<HTMLElement>(null);
  const [visiblePlan, setVisiblePlan] = useState<string | null>(null);
  useEffect(() => {
    const grid = cardsRef.current;
    if (!grid) return;
    const mobile = window.matchMedia("(max-width: 720px)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!mobile.matches) { setVisiblePlan(null); return; }
      const nav = document.querySelector(".navigation");
      const viewport = window.visualViewport;
      const top = Math.max(viewport?.offsetTop ?? 0, nav?.getBoundingClientRect().bottom ?? 0);
      const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight);
      const center = (top + bottom) / 2;
      let best: string | null = null;
      let bestHeight = 0;
      let bestDistance = Infinity;
      for (const card of grid.querySelectorAll<HTMLElement>(".launch-plan")) {
        const rect = card.getBoundingClientRect();
        const height = Math.max(0, Math.min(bottom, rect.bottom) - Math.max(top, rect.top));
        const distance = Math.abs((rect.top + rect.bottom) / 2 - center);
        if (height > 0 && (height > bestHeight + 1 || (Math.abs(height - bestHeight) <= 1 && distance < bestDistance))) {
          best = card.id;
          bestHeight = height;
          bestDistance = distance;
        }
      }
      setVisiblePlan(previous => previous === best ? previous : best);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    mobile.addEventListener("change", schedule);
    const resize = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    resize?.observe(grid);
    grid.querySelectorAll(".launch-plan").forEach(card => resize?.observe(card));
    schedule();
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      mobile.removeEventListener("change", schedule);
      resize?.disconnect();
    };
  }, []);
  useEffect(() => {
    const remaining = blackWeekEnds - Date.now();
    if (remaining <= 0) { setOffer(false); return; }
    const timer = window.setTimeout(() => setOffer(false), remaining);
    return () => window.clearTimeout(timer);
  }, []);
  const moveLight = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--launch-x", ((event.clientX - bounds.left) / bounds.width * 100) + "%");
    event.currentTarget.style.setProperty("--launch-y", ((event.clientY - bounds.top) / bounds.height * 100) + "%");
  };
  return (
    <div className="launch-page">
      <Seo page="plans" />
      <section className="launch-intro wrap">
        <div className="launch-kicker"><span className="launch-dot" /> XARCON TECH / LAUNCH</div>
        {offer && <div className="launch-week-banner"><span>BLACK WEEK</span><strong>35% de descuento en activación</strong><small>Hasta el 30 de noviembre</small></div>}
        <h1>Tu próximo nivel<br /><em>empieza online.</em></h1>
        <p>Presencia digital profesional, tecnología gestionada y un plan que se adapta a la etapa de tu negocio.</p>
        <div className="launch-trust"><ShieldCheck size={17} /> Dominio propio · Alojamiento incluido · Diseño profesional</div>
      </section>
      <section ref={cardsRef} className="wrap launch-cards" aria-label="Planes de membresía">
        {launchPlans.map((plan,i) => {
          const Icon = icons[i];
          return <article key={plan.id} className={"launch-plan" + (plan.highlight ? " launch-featured" : "")} id={plan.id} data-scroll-active={visiblePlan === plan.id ? "true" : "false"} onPointerMove={moveLight}>
            <div className="launch-plan-head"><Icon size={24} strokeWidth={1.5} /><span>{plan.highlight ? "PARA NEGOCIOS EN CRECIMIENTO" : "0" + (i+1) + " / LAUNCH"}</span></div>
            {offer && <div className="launch-offer"><span>BLACK WEEK</span><b>−35%</b></div>}
            <h2>{plan.name}</h2><h3>{plan.title}</h3><p className="launch-description">{plan.description}</p>
            <div className="launch-price"><span>Desde US$</span><strong>{plan.monthly}</strong><small>/mes</small></div>
            <div className="launch-activation launch-activation-box">
              {offer && <div className="launch-reference"><s aria-label="Tarifa regular de activación">US$ {formatLaunchAmount(regularActivation(plan))}</s></div>}
              <div className="launch-activation-current">+ US$ {formatLaunchAmount(offer ? plan.activation : regularActivation(plan))} <span>de activación inicial</span></div>
              {offer && <span className="launch-saving">Ahorra US$ {formatLaunchAmount(Math.round((regularActivation(plan) - plan.activation) * 100) / 100)}</span>}
            </div>
            <Link className="launch-action" to={launchContactUrl(plan, search)}>Solicitar {plan.name}<ArrowUpRight size={18}/></Link>
            <ul>{plan.features.map(feature => <li key={feature}><Check size={16} strokeWidth={2}/><span>{feature}</span></li>)}</ul>
          </article>;
        })}
      </section>
      <div className="wrap launch-disclaimer">{offer && "Black Week válida hasta el 30 de noviembre de 2026 (hora de Nicaragua). El descuento se aplica únicamente a la activación inicial, respecto de la tarifa regular que regirá desde el 1 de diciembre. "}Precios de referencia en USD para alcance estándar; sujetos a confirmación de disponibilidad, condiciones e impuestos aplicables. No se realiza ningún cobro al solicitar un plan. <Link to="/terminos-y-condiciones">Términos y condiciones.</Link></div>
      <section className="wrap launch-process"><div><span className="launch-kicker">TU CAMINO DIGITAL</span><h2>De la idea a tu presencia online.</h2></div><div className="launch-steps">{["Elige tu plan","Definimos el alcance","Configuramos y publicamos"].map((step,i)=><div key={step}><span>0{i+1}</span><strong>{step}</strong></div>)}</div></section>
      <section className="wrap launch-faq"><div><span className="launch-kicker">INFORMACIÓN CLARA</span><h2>Preguntas frecuentes.</h2></div><div>{questions.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section>
      <section className="wrap launch-enterprise"><div><span className="launch-kicker">XARCON TECH / SOLUCIONES A MEDIDA</span><h2>¿Tu empresa necesita algo más?</h2><p>Construimos sistemas empresariales, automatizaciones e integraciones diseñadas para necesidades específicas.</p></div><Link to="/contacto" className="launch-action">Hablemos de tu proyecto <ArrowRight size={18}/></Link></section>
    </div>
  );
}
