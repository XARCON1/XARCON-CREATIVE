import type { ServiceKind } from "./components/ServiceVisual";
export const services: { id: ServiceKind; name: string; line: string; description: string; audience: string; deliverables: string[] }[] = [
  {
    "id": "software",
    "name": "Software empresarial a medida",
    "line": "Una solución construida alrededor de tu operación.",
    "description": "Cuando las herramientas genéricas no se adaptan a tu negocio, diseñamos aplicaciones con flujos, datos y permisos definidos según tus necesidades.",
    "audience": "Empresas de servicios, comercios y equipos con procesos propios.",
    "deliverables": [
      "Análisis funcional",
      "Aplicaciones a medida",
      "Arquitectura preparada para evolucionar"
    ]
  },
  {
    "id": "web",
    "name": "Web corporativa",
    "line": "Una presencia digital que abre conversaciones comerciales.",
    "description": "Desarrollamos sitios profesionales para explicar tus servicios y facilitar el contacto, con una experiencia adaptable y estructura para buscadores.",
    "audience": "Empresas, profesionales e instituciones.",
    "deliverables": [
      "Diseño personalizado",
      "Desarrollo responsive",
      "SEO técnico inicial"
    ]
  },
  {
    "id": "systems",
    "name": "Sistemas administrativos y de gestión",
    "line": "Centraliza la información y toma el control.",
    "description": "Sustituye procesos dispersos en hojas, archivos y chats por una plataforma que organice el trabajo y facilite el seguimiento.",
    "audience": "Inmobiliarias, intermediarias, comercios y equipos administrativos.",
    "deliverables": [
      "Paneles de gestión",
      "Roles y permisos",
      "Registros y reportes"
    ]
  },
  {
    "id": "automation",
    "name": "Automatización empresarial con IA",
    "line": "Reduce tareas repetitivas y recupera tiempo de trabajo.",
    "description": "Diseñamos flujos de automatización e integración de IA donde aporten valor, con alcance y supervisión acordados según cada proceso.",
    "audience": "Equipos comerciales, administrativos y de atención.",
    "deliverables": [
      "Diagnóstico de procesos",
      "Flujos inteligentes",
      "Integración con herramientas"
    ]
  },
  {
    "id": "commerce",
    "name": "Comercio electrónico",
    "line": "Facilita el recorrido del producto al pedido.",
    "description": "Construimos catálogos y experiencias de compra adaptados a la operación del negocio; las integraciones de pago y entrega se definen por proyecto.",
    "audience": "Tiendas, reposterías y negocios que venden productos.",
    "deliverables": [
      "Catálogo digital",
      "Gestión de pedidos",
      "Experiencia de compra"
    ]
  },
  {
    "id": "strategy",
    "name": "Marketing digital y soluciones creativas",
    "line": "Comunica tu valor con una estrategia coherente.",
    "description": "Alineamos identidad, contenido y canales digitales con tus objetivos comerciales, sin prometer resultados que dependan del mercado.",
    "audience": "Marcas, profesionales y empresas en crecimiento.",
    "deliverables": [
      "Diagnóstico comercial",
      "Estrategia de comunicación",
      "Diseño y contenido"
    ]
  },
  {
    "id": "special",
    "name": "Integraciones tecnológicas",
    "line": "Conecta tus herramientas y evita duplicar trabajo.",
    "description": "Evaluamos APIs, sistemas y servicios externos para intercambiar información y construir experiencias conectadas, según su viabilidad técnica.",
    "audience": "Empresas con plataformas existentes y procesos desconectados.",
    "deliverables": [
      "Evaluación de APIs",
      "Integración de datos",
      "Flujos entre sistemas"
    ]
  },
  {
    "id": "identity",
    "name": "Identidad de marca",
    "line": "Una marca coherente con el valor que ofreces.",
    "description": "Diseñamos sistemas visuales que ayudan a comunicar de manera profesional en los distintos puntos de contacto.",
    "audience": "Nuevas empresas y marcas en evolución.",
    "deliverables": [
      "Dirección de marca",
      "Identidad visual",
      "Guía de uso"
    ]
  }
];
export const processSteps = [
  {
    "title": "Consulta y diagnóstico",
    "text": "Identificamos el reto, los objetivos y los procesos de tu empresa.",
    "image": "mountain"
  },
  {
    "title": "Propuesta tecnológica y comercial",
    "text": "Acordamos alcance, entregables, inversión y plan de trabajo.",
    "image": "studio"
  },
  {
    "title": "Diseño y desarrollo",
    "text": "Construimos la solución y compartimos avances.",
    "image": "future"
  },
  {
    "title": "Validación y pruebas",
    "text": "Revisamos los flujos y ajustamos antes de implementar.",
    "image": "hero"
  },
  {
    "title": "Implementación y acompañamiento",
    "text": "Publicamos, entregamos y acordamos el soporte según el servicio.",
    "image": "ocean"
  }
];
