import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  Filter,
  FolderKanban,
  Mail,
  MapPin,
  Plus,
  Search,
  UserRound,
  X,
} from "lucide-react";
import {
  divisionMeta,
  formatMoney,
  projects,
  type Client,
  type Division,
} from "./data";
import type { ReturnTypeWorkspace } from "./workspaceTypes";

export function ViewHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="hq-module-head">
      <div>
        <span className="hq-kicker">{kicker}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="hq-module-action">{action}</div>}
    </header>
  );
}

export function ClientsView({ workspace }: { workspace: ReturnTypeWorkspace }) {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(params.get("new") === "1");
  const focus = params.get("focus");
  const [selectedId, setSelectedId] = useState(focus || workspace.clients[0]?.id || "");
  const selected = workspace.clients.find((item) => item.id === selectedId) ?? workspace.clients[0];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return workspace.clients;
    return workspace.clients.filter((item) =>
      `${item.name} ${item.company ?? ""} ${item.email} ${divisionMeta[item.division].label}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query, workspace.clients]);

  const createClient = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    if (!name || !email) return;
    const client = workspace.addClient({
      name,
      company: String(form.get("company") || "").trim() || undefined,
      phone: String(form.get("phone") || "—"),
      whatsapp: String(form.get("whatsapp") || "").trim() || undefined,
      email,
      location: String(form.get("location") || "Nicaragua"),
      division: String(form.get("division") || "creative") as Division,
      type: "Empresa",
      status: "Activo",
      nextAction: String(form.get("nextAction") || "Definir próxima acción"),
    });
    setSelectedId(client.id);
    setCreating(false);
    setParams({ focus: client.id });
  };

  return (
    <div className="hq-view">
      <ViewHeader
        kicker="CRM / CLIENTES"
        title="Expedientes que mantienen contexto."
        description="Relaciones, proyectos, valor histórico, saldo y próxima acción en una sola vista operativa."
        action={
          <button className="hq-primary-button" onClick={() => setCreating(true)}>
            <Plus size={16} /> Nuevo cliente
          </button>
        }
      />

      <section className="hq-workspace-split">
        <div className="hq-list-pane">
          <div className="hq-list-tools">
            <label className="hq-inline-search">
              <Search size={15} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente…" />
            </label>
            <button className="hq-quiet-button"><Filter size={15} /> Filtros</button>
          </div>

          <div className="hq-data-header clients">
            <span>Cliente</span><span>División</span><span>Facturado</span><span>Saldo</span><span>Estado</span>
          </div>
          <div className="hq-data-list">
            {filtered.map((client) => (
              <button
                key={client.id}
                onClick={() => {
                  setSelectedId(client.id);
                  setParams({ focus: client.id });
                }}
                className={`hq-data-row clients ${selected?.id === client.id ? "selected" : ""}`}
              >
                <span className="hq-client-cell">
                  <i>{client.name.slice(0, 2).toUpperCase()}</i>
                  <span><strong>{client.name}</strong><small>{client.company || client.type}</small></span>
                </span>
                <span>{divisionMeta[client.division].short}</span>
                <span>{formatMoney(client.billed)}</span>
                <span className={client.pending > 0 ? "hq-danger-text" : ""}>{formatMoney(client.pending)}</span>
                <span><b className={`hq-status-pill ${client.status.toLowerCase()}`}>{client.status}</b></span>
              </button>
            ))}
          </div>
        </div>

        {selected && (
          <aside className="hq-record-panel">
            <div className="hq-record-identity">
              <span className="hq-record-avatar">{selected.name.slice(0, 2).toUpperCase()}</span>
              <div>
                <small>CLIENTE · {divisionMeta[selected.division].short.toUpperCase()}</small>
                <h2>{selected.name}</h2>
                <p>{selected.company || selected.type}</p>
              </div>
            </div>
            <div className="hq-record-meta">
              <span><Mail size={15} /> {selected.email}</span>
              <span><MapPin size={15} /> {selected.location}</span>
              <span><UserRound size={15} /> {selected.type}</span>
            </div>
            <div className="hq-record-financial">
              <article><span>Facturado</span><strong>{formatMoney(selected.billed)}</strong></article>
              <article><span>Pendiente</span><strong>{formatMoney(selected.pending)}</strong></article>
            </div>
            <div className="hq-next-action">
              <span>PRÓXIMA ACCIÓN</span>
              <strong>{selected.nextAction}</strong>
              <small>El siguiente paso debe quedar visible, no enterrado en notas.</small>
            </div>
            <div className="hq-timeline">
              <span className="hq-record-label">LÍNEA DE RELACIÓN</span>
              {["Contacto", "Reunión", "Cotización", "Contrato", "Pago", "Proyecto", "Entrega", "Seguimiento"].map((step, index) => (
                <div className={index < 6 ? "done" : ""} key={step}>
                  <i>{index < 6 ? <Check size={11} /> : null}</i><span>{step}</span>
                </div>
              ))}
            </div>
            <div className="hq-record-note">
              <span className="hq-record-label">NOTA INTERNA</span>
              <p>{selected.notes}</p>
            </div>
          </aside>
        )}
      </section>

      {creating && (
        <div className="hq-modal-layer" onMouseDown={() => setCreating(false)}>
          <form className="hq-modal" onSubmit={createClient} onMouseDown={(event) => event.stopPropagation()}>
            <div className="hq-modal-head">
              <div><span className="hq-kicker">NUEVO REGISTRO</span><h2>Crear cliente</h2></div>
              <button type="button" onClick={() => setCreating(false)} aria-label="Cerrar"><X size={18} /></button>
            </div>
            <div className="hq-form-grid">
              <label><span>Nombre</span><input name="name" required /></label>
              <label><span>Empresa</span><input name="company" /></label>
              <label><span>Correo</span><input name="email" type="email" required /></label>
              <label><span>Teléfono</span><input name="phone" /></label>
              <label><span>WhatsApp</span><input name="whatsapp" /></label>
              <label><span>Ubicación</span><input name="location" defaultValue="Nicaragua" /></label>
              <label><span>División</span>
                <select name="division" defaultValue="creative">
                  <option value="creative">Creative</option>
                  <option value="realty">Realty</option>
                  <option value="construction">Construcciones</option>
                </select>
              </label>
              <label className="wide"><span>Próxima acción</span><input name="nextAction" defaultValue="Definir próxima acción" /></label>
            </div>
            <div className="hq-modal-actions">
              <button type="button" className="hq-quiet-button" onClick={() => setCreating(false)}>Cancelar</button>
              <button className="hq-primary-button" type="submit">Guardar cliente</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function ProjectsView({ workspace }: { workspace: ReturnTypeWorkspace }) {
  const [params, setParams] = useSearchParams();
  const focus = params.get("focus");
  const [selectedId, setSelectedId] = useState(focus || projects[0]?.id || "");
  const selected = projects.find((item) => item.id === selectedId) ?? projects[0];
  const client = workspace.clients.find((item) => item.id === selected?.clientId);

  return (
    <div className="hq-view">
      <ViewHeader
        kicker="PROJECT CONTROL"
        title="Proyectos como unidades de negocio."
        description="Alcance, cliente, avance, dinero, responsables y enlaces técnicos conectados en una misma ficha."
      />
      <section className="hq-project-board">
        <div className="hq-project-index">
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => {
                setSelectedId(project.id);
                setParams({ focus: project.id });
              }}
              className={selected?.id === project.id ? "selected" : ""}
            >
              <span className={`hq-division-tag ${project.division}`}>{divisionMeta[project.division].short}</span>
              <strong>{project.name}</strong>
              <small>{project.status} · {project.owner}</small>
              <div className="hq-project-mini-progress"><i style={{ width: `${project.progress}%` }} /></div>
              <b>{project.progress}%</b>
            </button>
          ))}
        </div>
        {selected && (
          <div className="hq-project-detail">
            <div className="hq-project-detail-head">
              <div>
                <span className="hq-kicker">{divisionMeta[selected.division].label.toUpperCase()}</span>
                <h2>{selected.name}</h2>
                <p>{selected.description}</p>
              </div>
              <span className={`hq-priority ${selected.priority}`}>{selected.priority}</span>
            </div>
            <div className="hq-project-metrics">
              <article><span>Contratado</span><strong>{formatMoney(selected.contracted)}</strong></article>
              <article><span>Anticipo</span><strong>{formatMoney(selected.advance)}</strong></article>
              <article><span>Saldo</span><strong>{formatMoney(selected.pending)}</strong></article>
              <article><span>Avance</span><strong>{selected.progress}%</strong></article>
            </div>
            <div className="hq-project-progress-large">
              <span><b>PROGRESO GENERAL</b><small>{selected.status}</small></span>
              <div><i style={{ width: `${selected.progress}%` }} /></div>
            </div>
            <div className="hq-project-grid">
              <div><span>Cliente</span><strong>{client?.name || "Interno XARCON"}</strong></div>
              <div><span>Responsable</span><strong>{selected.owner}</strong></div>
              <div><span>Inicio</span><strong>{selected.startedAt}</strong></div>
              <div><span>Fecha objetivo</span><strong>{selected.targetAt}</strong></div>
            </div>
            <div className="hq-tech-stack">
              <span>TECNOLOGÍAS / SISTEMAS</span>
              <div>{selected.technologies.map((tech) => <b key={tech}>{tech}</b>)}</div>
            </div>
            {(selected.githubUrl || selected.productionUrl) && (
              <div className="hq-project-links">
                {selected.githubUrl && <a href={selected.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>}
                {selected.productionUrl && <a href={selected.productionUrl} target="_blank" rel="noreferrer">Producción <ArrowUpRight size={14} /></a>}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export function TasksView({ workspace }: { workspace: ReturnTypeWorkspace }) {
  const [scope, setScope] = useState<"all" | "open" | "critical">("open");
  const visible = workspace.tasks.filter((task) => {
    if (scope === "open") return task.status !== "Terminada";
    if (scope === "critical") return task.priority === "critical" && task.status !== "Terminada";
    return true;
  });

  return (
    <div className="hq-view">
      <ViewHeader
        kicker="TASK SYSTEM"
        title="Prioridad antes que volumen."
        description="Trabajo operativo conectado a proyecto, división, responsable, estado y deadline."
        action={<button className="hq-primary-button"><Plus size={16} /> Nueva tarea</button>}
      />
      <div className="hq-segmented" role="tablist" aria-label="Filtro de tareas">
        {([["open", "Abiertas"], ["critical", "Críticas"], ["all", "Todas"]] as const).map(([value, label]) => (
          <button key={value} className={scope === value ? "active" : ""} onClick={() => setScope(value)}>{label}</button>
        ))}
      </div>
      <section className="hq-task-stack">
        {visible.map((task) => {
          const project = projects.find((item) => item.id === task.projectId);
          return (
            <article className={`hq-task-row ${task.status === "Terminada" ? "done" : ""}`} key={task.id}>
              <button className="hq-task-check" onClick={() => workspace.toggleTask(task.id)} aria-label="Cambiar estado de tarea">
                {task.status === "Terminada" ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </button>
              <div className="hq-task-copy">
                <span className={`hq-priority ${task.priority}`}>{task.priority}</span>
                <strong>{task.title}</strong>
                <small>{project?.name || "Operación interna"} · {divisionMeta[task.division].short}</small>
              </div>
              <div className="hq-task-owner"><span>RESPONSABLE</span><b>{task.owner}</b></div>
              <div className="hq-task-date"><Clock3 size={14} /><span>{task.deadline}</span></div>
              <span className={`hq-status-pill ${task.status.toLowerCase().replaceAll(" ", "-")}`}>{task.status}</span>
            </article>
          );
        })}
      </section>
    </div>
  );
}
