import type { ServiceKind } from "./components/ServiceVisual";
export const services: {
  id: ServiceKind;
  name: string;
  line: string;
  description: string;
  deliverables: string[];
}[] = [
  {
    id: "identity",
    name: "Identidad de marca",
    line: "Una marca que se siente tuya y la gente recuerda.",
    description:
      "Transformamos lo que hace único a tu negocio en una identidad con carácter, de la primera impresión al último detalle.",
    deliverables: ["Dirección de marca", "Identidad visual", "Guía de uso"],
  },
  {
    id: "web",
    name: "Sitios web",
    line: "Una web clara, rápida y hecha para representar bien tu negocio.",
    description:
      "Diseñamos y desarrollamos espacios digitales que cuentan tu historia, hacen fácil explorar y convierten el interés en conversación.",
    deliverables: [
      "Diseño a medida",
      "Desarrollo adaptable",
      "Preparación para buscadores",
    ],
  },
  {
    id: "systems",
    name: "Sistemas digitales",
    line: "Menos enredos. Más control sobre lo que pasa en tu negocio.",
    description:
      "Reunimos información, personas y tareas en herramientas pensadas para la forma en que trabaja tu equipo.",
    deliverables: [
      "Paneles de gestión",
      "Roles y permisos",
      "Información conectada",
    ],
  },
  {
    id: "automation",
    name: "Automatización",
    line: "Menos tareas repetidas. Más tiempo para lo importante.",
    description:
      "Conectamos herramientas y simplificamos tareas repetitivas para que puedas concentrarte en las decisiones que hacen crecer tu negocio.",
    deliverables: [
      "Mapa de procesos",
      "Conexiones entre herramientas",
      "Flujos de seguimiento",
    ],
  },
  {
    id: "strategy",
    name: "Estrategia digital",
    line: "Primero entendemos qué necesitás. Después trazamos la ruta.",
    description:
      "Aclaramos a quién quieres llegar, qué necesitas comunicar y qué acciones tienen sentido para tu siguiente etapa.",
    deliverables: [
      "Diagnóstico",
      "Plan de comunicación",
      "Prioridades y medición",
    ],
  },
  {
    id: "special",
    name: "Experiencias especiales",
    line: "Cuando una idea no cabe en una plantilla, la construimos a medida.",
    description:
      "Micrositios, lanzamientos y experiencias interactivas que dan espacio a una idea que no cabe en lo habitual.",
    deliverables: [
      "Concepto creativo",
      "Prototipo interactivo",
      "Desarrollo a medida",
    ],
  },
];
export const processSteps = [
  {
    title: "Nos conocemos",
    text: "Nos contás qué hacés, qué necesitás y qué querés mejorar.",
    image: "mountain",
  },
  {
    title: "Trazamos la ruta",
    text: "Definimos prioridades, alcance y una solución clara antes de construir.",
    image: "studio",
  },
  {
    title: "Lo construimos",
    text: "Diseñamos, desarrollamos y te mostramos avances para decidir juntos.",
    image: "future",
  },
  {
    title: "Lo ponemos a funcionar",
    text: "Probamos, ajustamos y dejamos tu proyecto listo para usar de verdad.",
    image: "hero",
  },
];
