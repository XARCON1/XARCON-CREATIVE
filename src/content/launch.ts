export const launchPlans = [
  { id:"essential", name:"Essential", monthly:19, activation:79, title:"Tu primera presencia digital", description:"Para profesionales y negocios que necesitan una web clara, propia y preparada para recibir consultas.", features:["Landing page profesional","Dominio .com estándar","Alojamiento web y certificado SSL","Integración con WhatsApp","Diseño adaptable a móvil y escritorio"], highlight:false },
  { id:"business", name:"Business", monthly:39, activation:149, title:"Una web que trabaja contigo", description:"Para empresas que quieren mostrar sus servicios, gestionar su contenido y ampliar su presencia comercial.", features:["Todo lo esencial","Web multipágina","Panel administrativo","Catálogo digital básico","SEO inicial","Actualizaciones limitadas según alcance"], highlight:true },
  { id:"growth", name:"Growth", monthly:69, activation:249, title:"Un paso hacia la gestión digital", description:"Para negocios que buscan organizar prospectos y ampliar sus capacidades comerciales.", features:["Todo lo de Business","Catálogo avanzado","CRM básico de prospectos","Estadísticas comerciales básicas","Integraciones básicas según alcance","Soporte prioritario según acuerdo"], highlight:false }
] as const;
export type LaunchPlan = typeof launchPlans[number];
export const launchSubject = (plan: LaunchPlan) => "XARCON Launch — " + plan.name;
// Nicaragua (UTC-06:00). Regular tariff applies after Black Week.
export const blackWeekEnds = Date.parse("2026-12-01T00:00:00-06:00");
export const isBlackWeek = (now = Date.now()) => now < blackWeekEnds;
export const regularActivation = (plan: LaunchPlan) => Math.round(plan.activation / 0.65 * 100) / 100;
export const currentActivation = (plan: LaunchPlan, now = Date.now()) => isBlackWeek(now) ? plan.activation : regularActivation(plan);
export const formatLaunchAmount = (amount: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
export const launchPrice = (plan: LaunchPlan) => "US$" + plan.monthly + "/mes + US$" + formatLaunchAmount(currentActivation(plan)) + " activación";
export function launchContactUrl(plan: LaunchPlan, search = "") {
  const incoming = new URLSearchParams(search);
  const params = new URLSearchParams({ plan: plan.id });
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const value = incoming.get(key);
    if (value) params.set(key, value.slice(0, 100));
  }
  return "/contacto?" + params.toString();
}
