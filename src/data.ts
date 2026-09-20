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
    line: "Que se reconozca. Que se recuerde.",
    description:
      "Transformamos lo que hace único a tu negocio en una identidad con carácter, de la primera impresión al último detalle.",
    deliverables: ["Dirección de marca", "Identidad visual", "Guía de uso"],
  },
  {
    id: "web",
    name: "Sitios web",
    line: "Tu mejor primera impresión.",
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
    line: "Más claridad. Menos fricción.",
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
    line: "Tu tiempo, donde más importa.",
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
    line: "Una dirección antes de acelerar.",
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
    line: "Hay ideas que piden algo distinto.",
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
    title: "Descubrimiento",
    text: "Escuchamos la idea. Encontramos el verdadero reto.",
    image: "mountain",
  },
  {
    title: "Estrategia",
    text: "Un propósito claro y una ruta compartida.",
    image: "studio",
  },
  {
    title: "Diseño",
    text: "La idea toma forma, se prueba y se afina.",
    image: "future",
  },
  {
    title: "Lanzamiento",
    text: "Construimos, comprobamos y ponemos todo en marcha.",
    image: "hero",
  },
];
