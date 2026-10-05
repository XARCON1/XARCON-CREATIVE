export type Division = "creative" | "realty" | "construction";
export type Priority = "low" | "medium" | "high" | "critical";

export interface Client {
  id: string;
  name: string;
  company?: string;
  phone: string;
  whatsapp?: string;
  email: string;
  location: string;
  division: Division;
  type: "Empresa" | "Particular" | "Aliado";
  joinedAt: string;
  status: "Activo" | "Prospecto" | "Pausado";
  billed: number;
  pending: number;
  nextAction: string;
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  division: Division;
  description: string;
  owner: string;
  collaborators: string[];
  contracted: number;
  advance: number;
  pending: number;
  startedAt: string;
  targetAt: string;
  progress: number;
  priority: Priority;
  status:
    | "Prospecto"
    | "Propuesta"
    | "Aprobado"
    | "Activo"
    | "En pausa"
    | "En revisión"
    | "Terminado"
    | "Entregado"
    | "Cancelado";
  technologies: string[];
  githubUrl?: string;
  productionUrl?: string;
}

export interface FinanceMovement {
  id: string;
  kind: "income" | "expense";
  label: string;
  amount: number;
  currency: "USD" | "NIO";
  division: Division;
  projectId?: string;
  clientId?: string;
  method: string;
  date: string;
  category: string;
}

export interface Receivable {
  id: string;
  clientId: string;
  projectId: string;
  total: number;
  paid: number;
  dueDate: string;
  status: "al día" | "pendiente" | "vencido" | "parcialmente pagado";
  payments: { id: string; date: string; amount: number; note?: string }[];
}

export interface Task {
  id: string;
  title: string;
  projectId?: string;
  division: Division;
  owner: string;
  priority: Priority;
  status: "Pendiente" | "En curso" | "Bloqueada" | "En revisión" | "Terminada";
  deadline: string;
  description: string;
}

export interface Opportunity {
  id: string;
  clientId?: string;
  clientName: string;
  service: string;
  division: Division;
  value: number;
  owner: string;
  source: string;
  nextAction: string;
  date: string;
  stage: "Lead" | "Contactado" | "Reunión" | "Propuesta" | "Negociación" | "Ganado" | "Perdido";
}

export interface Quote {
  id: string;
  clientName: string;
  service: string;
  division: Division;
  total: number;
  validUntil: string;
  status: "Borrador" | "Enviada" | "Vista" | "Aceptada" | "Rechazada" | "Vencida";
}

export interface Activity {
  id: string;
  type: "client" | "project" | "payment" | "task" | "document" | "quote";
  text: string;
  time: string;
  division: Division;
}

export interface CalendarItem {
  id: string;
  title: string;
  date: string;
  kind: "reunión" | "vencimiento" | "entrega" | "pago" | "publicación" | "tarea" | "evento";
  division: Division;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: "Contrato" | "Cotización" | "Factura" | "Recibo" | "Brief" | "Logo" | "Render" | "PDF" | "Entregable";
  division: Division;
  projectId?: string;
  clientId?: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: "Owner" | "CEO" | "Admin" | "Manager" | "Collaborator" | "Viewer";
  divisions: Division[];
  access: string[];
  status: "Activo" | "Invitado";
}

export const divisionMeta: Record<Division, { label: string; short: string }> = {
  creative: { label: "XARCON Creative", short: "Creative" },
  realty: { label: "XARCON Realty", short: "Realty" },
  construction: { label: "XARCON Construcciones", short: "Construcciones" },
};

export const clients: Client[] = [
  {
    id: "cli-drg",
    name: "Diamantes Realty Group",
    company: "Diamantes Realty Group",
    phone: "+505 8744 6657",
    whatsapp: "+505 8744 6657",
    email: "contacto@demo.xarcon.local",
    location: "Nicaragua",
    division: "creative",
    type: "Empresa",
    joinedAt: "2026-03-10",
    status: "Activo",
    billed: 2000,
    pending: 600,
    nextAction: "Revisar siguiente corte del proyecto",
    notes: "Registro demo para visualizar la ficha CRM. Sustituir por datos reales al conectar persistencia.",
  },
  {
    id: "cli-amy",
    name: "Amy Blandón",
    company: "Amy Blandón Bienes Raíces",
    phone: "+505 8832 4439",
    whatsapp: "+505 8832 4439",
    email: "amy@demo.xarcon.local",
    location: "Nicaragua",
    division: "creative",
    type: "Particular",
    joinedAt: "2026-05-18",
    status: "Activo",
    billed: 560,
    pending: 0,
    nextAction: "Definir alcance del CRM inmobiliario",
    notes: "Datos de demostración. No representan una contabilidad oficial.",
  },
  {
    id: "cli-av",
    name: "AVALNIC",
    company: "Plataforma de Avalúos",
    phone: "—",
    email: "admin@demo.xarcon.local",
    location: "Matagalpa",
    division: "creative",
    type: "Empresa",
    joinedAt: "2026-09-01",
    status: "Activo",
    billed: 0,
    pending: 0,
    nextAction: "Cerrar identidad y módulo público",
    notes: "Proyecto interno demo.",
  },
  {
    id: "cli-spatial",
    name: "XARCON Spatial",
    company: "XARCON",
    phone: "—",
    email: "spatial@demo.xarcon.local",
    location: "Nicaragua",
    division: "realty",
    type: "Empresa",
    joinedAt: "2026-10-01",
    status: "Prospecto",
    billed: 0,
    pending: 0,
    nextAction: "Prototipo de recorrido 360",
    notes: "Línea de innovación en fase conceptual.",
  },
];

export const projects: Project[] = [
  {
    id: "prj-xarcon-web",
    name: "XARCON Creative — Web pública",
    clientId: "cli-av",
    division: "creative",
    description: "Evolución del sitio comercial y portafolio de XARCON.",
    owner: "Norvin",
    collaborators: [],
    contracted: 0,
    advance: 0,
    pending: 0,
    startedAt: "2026-09-15",
    targetAt: "2026-10-15",
    progress: 88,
    priority: "high",
    status: "Activo",
    technologies: ["React", "TypeScript", "Vite", "Framer Motion"],
    productionUrl: "https://xarcon-creative.vercel.app/",
  },
  {
    id: "prj-drg",
    name: "Sistema Diamantes Realty Group",
    clientId: "cli-drg",
    division: "creative",
    description: "Plataforma inmobiliaria, paneles, mapa y flujo comercial.",
    owner: "Norvin",
    collaborators: [],
    contracted: 2000,
    advance: 1400,
    pending: 600,
    startedAt: "2026-05-01",
    targetAt: "2026-10-20",
    progress: 83,
    priority: "critical",
    status: "Activo",
    technologies: ["React", "Firebase", "Vercel"],
  },
  {
    id: "prj-amy",
    name: "Ecosistema digital Amy Blandón",
    clientId: "cli-amy",
    division: "creative",
    description: "Web, propiedades, avalúos y base para CRM.",
    owner: "Norvin",
    collaborators: [],
    contracted: 560,
    advance: 560,
    pending: 0,
    startedAt: "2026-06-20",
    targetAt: "2026-10-08",
    progress: 92,
    priority: "high",
    status: "En revisión",
    technologies: ["React", "Firebase", "Vercel"],
  },
  {
    id: "prj-spatial",
    name: "Spatial Showrooms 360",
    clientId: "cli-spatial",
    division: "realty",
    description: "Experiencias inmersivas para propiedades y espacios.",
    owner: "Norvin",
    collaborators: [],
    contracted: 0,
    advance: 0,
    pending: 0,
    startedAt: "2026-10-03",
    targetAt: "2026-11-30",
    progress: 18,
    priority: "medium",
    status: "Propuesta",
    technologies: ["Three.js", "WebGL", "360"],
  },
];

export const movements: FinanceMovement[] = [
  { id: "mov-1", kind: "income", label: "Abono proyecto DRG", amount: 200, currency: "USD", division: "creative", projectId: "prj-drg", clientId: "cli-drg", method: "Transferencia", date: "2026-09-05", category: "Servicios" },
  { id: "mov-2", kind: "income", label: "Entrega web Amy", amount: 160, currency: "USD", division: "creative", projectId: "prj-amy", clientId: "cli-amy", method: "Transferencia", date: "2026-09-28", category: "Servicios" },
  { id: "mov-3", kind: "expense", label: "Infraestructura y herramientas", amount: 36, currency: "USD", division: "creative", method: "Tarjeta", date: "2026-10-01", category: "Software" },
  { id: "mov-4", kind: "expense", label: "Dominio / activos", amount: 18, currency: "USD", division: "creative", method: "Tarjeta", date: "2026-09-22", category: "Infraestructura" },
];

export const receivables: Receivable[] = [
  {
    id: "rec-drg",
    clientId: "cli-drg",
    projectId: "prj-drg",
    total: 2000,
    paid: 1400,
    dueDate: "2026-09-30",
    status: "vencido",
    payments: [
      { id: "pay-1", date: "2026-05-01", amount: 200, note: "Inicial" },
      { id: "pay-2", date: "2026-06-01", amount: 400 },
      { id: "pay-3", date: "2026-07-01", amount: 400 },
      { id: "pay-4", date: "2026-09-05", amount: 400 },
    ],
  },
  {
    id: "rec-amy",
    clientId: "cli-amy",
    projectId: "prj-amy",
    total: 560,
    paid: 560,
    dueDate: "2026-09-28",
    status: "al día",
    payments: [{ id: "pay-a1", date: "2026-09-28", amount: 560 }],
  },
];

export const tasks: Task[] = [
  { id: "tsk-1", title: "Cerrar QA responsive de XARCON", projectId: "prj-xarcon-web", division: "creative", owner: "Norvin", priority: "high", status: "En curso", deadline: "2026-10-06", description: "Validar 1366, tablet y móvil." },
  { id: "tsk-2", title: "Revisar saldo y seguimiento DRG", projectId: "prj-drg", division: "creative", owner: "Norvin", priority: "critical", status: "Pendiente", deadline: "2026-10-05", description: "Preparar seguimiento comercial y financiero." },
  { id: "tsk-3", title: "Especificar flujo de Spatial 360", projectId: "prj-spatial", division: "realty", owner: "Norvin", priority: "medium", status: "Pendiente", deadline: "2026-10-09", description: "Cerrar recorrido mínimo viable." },
  { id: "tsk-4", title: "Preparar módulo documental", division: "creative", owner: "Norvin", priority: "low", status: "En revisión", deadline: "2026-10-12", description: "Definir futura conexión con Drive." },
];

export const opportunities: Opportunity[] = [
  { id: "opp-1", clientId: "cli-amy", clientName: "Amy Blandón", service: "CRM inmobiliario + IA", division: "creative", value: 950, owner: "Norvin", source: "Cliente existente", nextAction: "Reunión de alcance", date: "2026-10-08", stage: "Propuesta" },
  { id: "opp-2", clientName: "Prospecto Showroom", service: "Showroom 360", division: "realty", value: 450, owner: "Norvin", source: "Referido", nextAction: "Enviar demo", date: "2026-10-10", stage: "Contactado" },
  { id: "opp-3", clientName: "Proyecto residencial", service: "Coordinación de obra", division: "construction", value: 4200, owner: "Norvin", source: "Red personal", nextAction: "Levantamiento inicial", date: "2026-10-14", stage: "Lead" },
];

export const quotes: Quote[] = [
  { id: "quo-1", clientName: "Amy Blandón", service: "CRM inmobiliario + IA", division: "creative", total: 950, validUntil: "2026-10-15", status: "Enviada" },
  { id: "quo-2", clientName: "Prospecto Showroom", service: "Showroom 360", division: "realty", total: 450, validUntil: "2026-10-18", status: "Borrador" },
];

export const activities: Activity[] = [
  { id: "act-1", type: "project", text: "XARCON Creative avanzó a 88% de progreso", time: "Hoy · 16:20", division: "creative" },
  { id: "act-2", type: "payment", text: "Se registró un movimiento financiero del proyecto DRG", time: "Hoy · 14:05", division: "creative" },
  { id: "act-3", type: "task", text: "QA responsive cambió a En curso", time: "Ayer · 19:40", division: "creative" },
  { id: "act-4", type: "quote", text: "Cotización CRM inmobiliario marcada como enviada", time: "Ayer · 11:15", division: "creative" },
];

export const calendarItems: CalendarItem[] = [
  { id: "cal-1", title: "QA XARCON Admin", date: "2026-10-06", kind: "tarea", division: "creative" },
  { id: "cal-2", title: "Reunión alcance CRM Amy", date: "2026-10-08", kind: "reunión", division: "creative" },
  { id: "cal-3", title: "Demo Spatial 360", date: "2026-10-10", kind: "entrega", division: "realty" },
  { id: "cal-4", title: "Seguimiento cobro DRG", date: "2026-10-05", kind: "pago", division: "creative" },
];

export const documents: DocumentRecord[] = [
  { id: "doc-1", name: "Contrato DRG — referencia", type: "Contrato", division: "creative", projectId: "prj-drg", clientId: "cli-drg", updatedAt: "2026-09-30" },
  { id: "doc-2", name: "Cotización CRM Amy", type: "Cotización", division: "creative", projectId: "prj-amy", clientId: "cli-amy", updatedAt: "2026-10-02" },
  { id: "doc-3", name: "Brief Spatial 360", type: "Brief", division: "realty", projectId: "prj-spatial", updatedAt: "2026-10-03" },
];

export const team: TeamMember[] = [
  { id: "tm-1", name: "Norvin García", role: "Owner", divisions: ["creative", "realty", "construction"], access: ["*"], status: "Activo" },
];

export const formatMoney = (value: number, currency = "USD") =>
  new Intl.NumberFormat("es-NI", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

export const daysFrom = (date: string) => {
  const diff = Date.now() - new Date(date + "T12:00:00").getTime();
  return Math.max(0, Math.floor(diff / 86400000));
};
