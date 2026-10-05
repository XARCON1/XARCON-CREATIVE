import {
  ArrowUpRight,
  Clock3,
  FolderKanban,
  LineChart,
  Users,
  WalletCards,
} from "lucide-react";
import {
  activities,
  clients,
  divisionMeta,
  formatMoney,
  movements,
  projects,
  type Division,
} from "./data";
import type { ReturnTypeWorkspace } from "./workspaceTypes";

type Props = {
  workspace: ReturnTypeWorkspace;
};

export default function DashboardView({ workspace }: Props) {
  const income = movements.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = movements.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);
  const outstanding = workspace.receivables.reduce((sum, item) => sum + Math.max(0, item.total - item.paid), 0);
  const activeProjects = projects.filter((item) => ["Activo", "En revisión"].includes(item.status)).length;
  const criticalTasks = workspace.tasks.filter((item) => item.status !== "Terminada" && item.priority === "critical").length;

  const attention = [
    {
      icon: WalletCards,
      level: "Crítico",
      title: `${workspace.receivables.filter((item) => item.status === "vencido").length} cuenta requiere seguimiento`,
      detail: `${formatMoney(outstanding)} pendientes en datos demo`,
      path: "/admin/receivables",
    },
    {
      icon: Clock3,
      level: "Hoy",
      title: `${criticalTasks} tarea crítica abierta`,
      detail: "Priorizá bloqueos antes de abrir nuevos frentes.",
      path: "/admin/tasks",
    },
    {
      icon: FolderKanban,
      level: "Proyecto",
      title: "DRG concentra el mayor saldo del portafolio demo",
      detail: "Revisar avance, cobro y próxima acción en conjunto.",
      path: "/admin/projects",
    },
  ];

  const divisionStats = (division: Division) => {
    const divisionProjects = projects.filter((item) => item.division === division);
    const ids = new Set(divisionProjects.map((item) => item.clientId));
    const billing = divisionProjects.reduce((sum, item) => sum + item.contracted, 0);
    const progress = divisionProjects.length
      ? Math.round(divisionProjects.reduce((sum, item) => sum + item.progress, 0) / divisionProjects.length)
      : 0;
    return { projects: divisionProjects.length, clients: ids.size, billing, progress };
  };

  return (
    <div className="hq-view hq-dashboard">
      <section className="hq-hero-panel">
        <div className="hq-hero-copy">
          <span className="hq-kicker">EXECUTIVE COMMAND CENTER · OCT 2026</span>
          <h1>Control de empresa,<br /><em>sin ruido operativo.</em></h1>
          <p>
            Visión unificada de caja, proyectos, clientes y prioridades. Esta primera capa funciona
            con datos demo centralizados y está preparada para sustituirse por persistencia real.
          </p>
        </div>
        <div className="hq-hero-signal" aria-label="Estado general">
          <div className="hq-signal-ring">
            <span>{activeProjects}</span>
            <small>proyectos<br />en movimiento</small>
          </div>
          <div className="hq-signal-caption">
            <span className="hq-live-dot" />
            <b>Operación estable</b>
            <small>Sin incidentes de sistema detectados</small>
          </div>
        </div>
      </section>

      <section className="hq-metric-ribbon" aria-label="Resumen financiero y comercial">
        <article>
          <span>INGRESOS REGISTRADOS</span>
          <strong>{formatMoney(income)}</strong>
          <small><ArrowUpRight size={13} /> demo acumulado</small>
        </article>
        <article>
          <span>EGRESOS</span>
          <strong>{formatMoney(expenses)}</strong>
          <small>infraestructura y operación</small>
        </article>
        <article className="accent">
          <span>UTILIDAD REFERENCIAL</span>
          <strong>{formatMoney(income - expenses)}</strong>
          <small>{income ? Math.round(((income - expenses) / income) * 100) : 0}% margen demo</small>
        </article>
        <article className="warning">
          <span>POR COBRAR</span>
          <strong>{formatMoney(outstanding)}</strong>
          <small>requiere seguimiento</small>
        </article>
      </section>

      <section className="hq-attention">
        <div className="hq-section-head">
          <div>
            <span className="hq-kicker">DECISIÓN EJECUTIVA</span>
            <h2>Lo que requiere tu atención</h2>
          </div>
          <p>Prioridades derivadas del estado actual de proyectos, cobros y tareas.</p>
        </div>
        <div className="hq-attention-list">
          {attention.map((item, index) => {
            const Icon = item.icon;
            return (
              <a href={item.path} key={item.title} className="hq-attention-row">
                <span className="hq-attention-index">0{index + 1}</span>
                <span className="hq-attention-icon"><Icon size={19} /></span>
                <span className="hq-attention-copy">
                  <small>{item.level}</small>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </span>
                <ArrowUpRight size={18} />
              </a>
            );
          })}
        </div>
      </section>

      <section className="hq-ecosystem">
        <div className="hq-section-head">
          <div>
            <span className="hq-kicker">ECOSISTEMA XARCON</span>
            <h2>Una empresa, tres frentes operativos.</h2>
          </div>
          <p>Vista espacial de divisiones diseñada para crecer sin rehacer la arquitectura.</p>
        </div>
        <div className="hq-ecosystem-stage">
          <div className="hq-core">
            <span className="hq-core-orbit" />
            <span className="hq-core-orbit second" />
            <strong>X</strong>
            <small>HQ</small>
          </div>
          {(["creative", "realty", "construction"] as Division[]).map((division, index) => {
            const stats = divisionStats(division);
            return (
              <article className={`hq-division-node node-${index + 1}`} key={division}>
                <span className="hq-node-line" />
                <small>{divisionMeta[division].label.toUpperCase()}</small>
                <strong>{divisionMeta[division].short}</strong>
                <div>
                  <span><b>{stats.projects}</b> proyectos</span>
                  <span><b>{stats.clients}</b> clientes</span>
                  <span><b>{formatMoney(stats.billing)}</b> volumen</span>
                </div>
                <i style={{ "--progress": `${stats.progress}%` } as React.CSSProperties} />
              </article>
            );
          })}
          <div className="hq-ecosystem-grid" />
        </div>
      </section>

      <section className="hq-dashboard-lower">
        <div className="hq-portfolio">
          <div className="hq-section-title">
            <span><FolderKanban size={17} /> PORTAFOLIO ACTIVO</span>
            <a href="/admin/projects">Ver todos <ArrowUpRight size={14} /></a>
          </div>
          <div className="hq-project-lines">
            {projects.slice(0, 4).map((project) => (
              <article key={project.id}>
                <div>
                  <span className={`hq-division-tag ${project.division}`}>{divisionMeta[project.division].short}</span>
                  <strong>{project.name}</strong>
                  <small>{project.status} · meta {project.targetAt}</small>
                </div>
                <div className="hq-progress-number">{project.progress}%</div>
                <div className="hq-progress-track"><i style={{ width: `${project.progress}%` }} /></div>
              </article>
            ))}
          </div>
        </div>

        <aside className="hq-activity-panel">
          <div className="hq-section-title">
            <span><LineChart size={17} /> ACTIVIDAD</span>
            <small>últimos eventos</small>
          </div>
          <div className="hq-activity-feed">
            {activities.map((item) => (
              <article key={item.id}>
                <span className={`hq-activity-dot ${item.division}`} />
                <div><strong>{item.text}</strong><small>{item.time}</small></div>
              </article>
            ))}
          </div>
          <div className="hq-client-count">
            <Users size={18} />
            <div><strong>{clients.filter((client) => client.status === "Activo").length}</strong><span>clientes activos demo</span></div>
          </div>
        </aside>
      </section>
    </div>
  );
}
