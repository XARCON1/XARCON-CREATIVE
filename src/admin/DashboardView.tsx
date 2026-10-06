import {
  ArrowUpRight,
  Clock3,
  FolderKanban,
  LineChart,
  Users,
  WalletCards,
} from "lucide-react";
import {
  divisionMeta,
  formatMoney,
  type Division,
} from "./data";
import type { ReturnTypeWorkspace } from "./workspaceTypes";

type Props = {
  workspace: ReturnTypeWorkspace;
};

export default function DashboardView({ workspace }: Props) {
  const income = workspace.movements
    .filter((item) => item.kind === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenses = workspace.movements
    .filter((item) => item.kind === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const outstanding = workspace.receivables.reduce(
    (sum, item) => sum + Math.max(0, item.total - item.paid),
    0,
  );
  const activeProjects = workspace.projects.filter((item) =>
    ["Activo", "En revisión", "Aprobado"].includes(item.status),
  ).length;
  const criticalTasks = workspace.tasks.filter(
    (item) => item.status !== "Terminada" && item.priority === "critical",
  ).length;

  const largestReceivable = [...workspace.receivables]
    .filter((item) => item.total - item.paid > 0)
    .sort((a, b) => (b.total - b.paid) - (a.total - a.paid))[0];
  const largestProject = workspace.projects.find(
    (item) => item.id === largestReceivable?.projectId,
  );

  const attention = [
    {
      icon: WalletCards,
      level: outstanding > 0 ? "Cobros" : "Cartera",
      title:
        outstanding > 0
          ? `${workspace.receivables.filter((item) => item.status === "vencido").length} cuenta(s) vencida(s)`
          : "Sin saldo pendiente registrado",
      detail:
        outstanding > 0
          ? `${formatMoney(outstanding)} pendientes en cartera`
          : "La cartera registrada está al día.",
      path: "/admin/receivables",
    },
    {
      icon: Clock3,
      level: criticalTasks > 0 ? "Prioridad" : "Tareas",
      title:
        criticalTasks > 0
          ? `${criticalTasks} tarea(s) crítica(s) abierta(s)`
          : "Sin tareas críticas abiertas",
      detail: "Revisá deadlines y bloqueos antes de abrir nuevos frentes.",
      path: "/admin/tasks",
    },
    {
      icon: FolderKanban,
      level: "Proyecto",
      title: largestProject
        ? `${largestProject.name} concentra el mayor saldo pendiente`
        : `${activeProjects} proyecto(s) en movimiento`,
      detail: largestReceivable
        ? `${formatMoney(Math.max(0, largestReceivable.total - largestReceivable.paid))} asociados al proyecto.`
        : "Portafolio calculado desde Firestore.",
      path: "/admin/projects",
    },
  ];

  const divisionStats = (division: Division) => {
    const divisionProjects = workspace.projects.filter((item) => item.division === division);
    const ids = new Set(divisionProjects.map((item) => item.clientId).filter(Boolean));
    const billing = divisionProjects.reduce((sum, item) => sum + item.contracted, 0);
    const progress = divisionProjects.length
      ? Math.round(
          divisionProjects.reduce((sum, item) => sum + item.progress, 0) /
            divisionProjects.length,
        )
      : 0;
    return { projects: divisionProjects.length, clients: ids.size, billing, progress };
  };

  const activity = [
    workspace.movements[0]
      ? {
          id: `movement-${workspace.movements[0].id}`,
          text: `${workspace.movements[0].kind === "income" ? "Ingreso" : "Gasto"} · ${workspace.movements[0].label}`,
          time: workspace.movements[0].date,
          division: workspace.movements[0].division,
        }
      : null,
    workspace.tasks.find((item) => item.status !== "Terminada")
      ? (() => {
          const task = workspace.tasks.find((item) => item.status !== "Terminada")!;
          return {
            id: `task-${task.id}`,
            text: `Tarea abierta · ${task.title}`,
            time: task.deadline,
            division: task.division,
          };
        })()
      : null,
    workspace.projects[0]
      ? {
          id: `project-${workspace.projects[0].id}`,
          text: `${workspace.projects[0].name} · ${workspace.projects[0].progress}%`,
          time: workspace.projects[0].targetAt,
          division: workspace.projects[0].division,
        }
      : null,
  ].filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="hq-view hq-dashboard">
      <section className="hq-hero-panel">
        <div className="hq-hero-copy">
          <span className="hq-kicker">
            EXECUTIVE COMMAND CENTER · {workspace.connection === "live" ? "FIRESTORE LIVE" : "SYNC"}
          </span>
          <h1>Control de empresa,<br /><em>sin ruido operativo.</em></h1>
          <p>
            Caja, proyectos, clientes y prioridades calculados desde el workspace empresarial
            XARCON. Los cambios se sincronizan en tiempo real con Firestore.
          </p>
        </div>
        <div className="hq-hero-signal" aria-label="Estado general">
          <div className="hq-signal-ring">
            <span>{activeProjects}</span>
            <small>proyectos<br />en movimiento</small>
          </div>
          <div className="hq-signal-caption">
            <span className="hq-live-dot" />
            <b>{workspace.connection === "live" ? "Datos sincronizados" : "Sincronizando datos"}</b>
            <small>{workspace.savedAt ? `Última lectura ${workspace.savedAt.toLocaleTimeString("es-NI", { hour: "2-digit", minute: "2-digit" })}` : "Conectando con Firebase"}</small>
          </div>
        </div>
      </section>

      <section className="hq-metric-ribbon" aria-label="Resumen financiero y comercial">
        <article>
          <span>INGRESOS REGISTRADOS</span>
          <strong>{formatMoney(income)}</strong>
          <small><ArrowUpRight size={13} /> Firestore</small>
        </article>
        <article>
          <span>EGRESOS</span>
          <strong>{formatMoney(expenses)}</strong>
          <small>operación registrada</small>
        </article>
        <article className="accent">
          <span>UTILIDAD REFERENCIAL</span>
          <strong>{formatMoney(income - expenses)}</strong>
          <small>{income ? Math.round(((income - expenses) / income) * 100) : 0}% margen</small>
        </article>
        <article className="warning">
          <span>POR COBRAR</span>
          <strong>{formatMoney(outstanding)}</strong>
          <small>cartera real registrada</small>
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
          <p>La vista se recalcula con los proyectos registrados por división.</p>
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
            {workspace.projects.length === 0 && <p className="hq-empty-state">No hay proyectos registrados todavía.</p>}
            {workspace.projects.slice(0, 4).map((project) => (
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
            <span><LineChart size={17} /> SEÑALES OPERATIVAS</span>
            <small>estado actual</small>
          </div>
          <div className="hq-activity-feed">
            {activity.length === 0 && <p className="hq-empty-state">La actividad aparecerá al registrar operaciones.</p>}
            {activity.map((item) => (
              <article key={item.id}>
                <span className={`hq-activity-dot ${item.division}`} />
                <div><strong>{item.text}</strong><small>{item.time}</small></div>
              </article>
            ))}
          </div>
          <div className="hq-client-count">
            <Users size={18} />
            <div><strong>{workspace.clients.filter((client) => client.status === "Activo").length}</strong><span>clientes activos</span></div>
          </div>
        </aside>
      </section>
    </div>
  );
}
