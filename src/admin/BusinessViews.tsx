import { useState, type DragEvent, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Filter,
  FolderOpen,
  Link2,
  Megaphone,
  Plus,
  ReceiptText,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import {
  daysFrom,
  divisionMeta,
  formatMoney,
  team,
  type Division,
  type FinanceMovement,
  type Opportunity,
} from "./data";
import type { ReturnTypeWorkspace } from "./workspaceTypes";
import { ViewHeader } from "./OperationsViews";

export function FinanceView({ workspace }: { workspace: ReturnTypeWorkspace }) {
  const [params, setParams] = useSearchParams();
  const [creating, setCreating] = useState(params.get("new") === "income");
  const income = workspace.movements.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = workspace.movements.filter((item) => item.kind === "expense").reduce((sum, item) => sum + item.amount, 0);
  const byDivision = (division: Division) =>
    workspace.movements
      .filter((item) => item.division === division && item.kind === "income")
      .reduce((sum, item) => sum + item.amount, 0);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount"));
    if (!Number.isFinite(amount) || amount <= 0) return;

    await workspace.addMovement({
      kind: String(form.get("kind") || "income") as FinanceMovement["kind"],
      label: String(form.get("label") || "Movimiento"),
      amount,
      currency: "USD",
      division: String(form.get("division") || "creative") as Division,
      method: String(form.get("method") || "Transferencia"),
      date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
      category: String(form.get("category") || "Servicios"),
    });

    setCreating(false);
    setParams({});
  };

  return (
    <div className="hq-view">
      <ViewHeader
        kicker="FINANZAS XARCON"
        title="Caja empresarial, separada y trazable."
        description="Ingresos, gastos y rentabilidad por división sincronizados con el workspace empresarial."
        action={<button className="hq-primary-button" onClick={() => setCreating(true)}><Plus size={16} /> Registrar movimiento</button>}
      />

      <section className="hq-finance-ledger">
        <div className="hq-finance-summary">
          <article><span>INGRESOS</span><strong>{formatMoney(income)}</strong><small>registros reales</small></article>
          <article><span>EGRESOS</span><strong>{formatMoney(expenses)}</strong><small>operación</small></article>
          <article className="accent"><span>UTILIDAD</span><strong>{formatMoney(income - expenses)}</strong><small>{income ? Math.round(((income - expenses) / income) * 100) : 0}% margen</small></article>
          <article><span>POR COBRAR</span><strong>{formatMoney(workspace.receivables.reduce((sum, item) => sum + item.total - item.paid, 0))}</strong><small>cartera</small></article>
        </div>

        <div className="hq-finance-columns">
          <div className="hq-ledger-table">
            <div className="hq-section-title"><span><ReceiptText size={17} /> MOVIMIENTOS</span><button className="hq-quiet-button"><Filter size={14} /> Filtrar</button></div>
            <div className="hq-data-header finance"><span>Concepto</span><span>División</span><span>Fecha</span><span>Método</span><span>Monto</span></div>
            {workspace.movements.length === 0 && <p className="hq-empty-state">Todavía no hay movimientos financieros registrados.</p>}
            {workspace.movements.map((item) => (
              <div className="hq-data-row finance" key={item.id}>
                <span><strong>{item.label}</strong><small>{item.category}</small></span>
                <span>{divisionMeta[item.division].short}</span>
                <span>{item.date}</span>
                <span>{item.method}</span>
                <span className={item.kind === "income" ? "hq-positive-text" : "hq-danger-text"}>
                  {item.kind === "income" ? "+" : "−"}{formatMoney(item.amount, item.currency)}
                </span>
              </div>
            ))}
          </div>

          <aside className="hq-division-money">
            <span className="hq-kicker">INGRESOS POR DIVISIÓN</span>
            {(["creative", "realty", "construction"] as Division[]).map((division) => {
              const value = byDivision(division);
              const share = income ? Math.round((value / income) * 100) : 0;
              return (
                <article key={division}>
                  <div><strong>{divisionMeta[division].label}</strong><b>{formatMoney(value)}</b></div>
                  <div className="hq-progress-track"><i style={{ width: `${share}%` }} /></div>
                  <small>{share}% del ingreso registrado</small>
                </article>
              );
            })}
          </aside>
        </div>
      </section>

      {creating && (
        <div className="hq-modal-layer" onMouseDown={() => setCreating(false)}>
          <form className="hq-modal compact" onSubmit={(event) => void submit(event)} onMouseDown={(event) => event.stopPropagation()}>
            <div className="hq-modal-head">
              <div><span className="hq-kicker">MOVIMIENTO</span><h2>Registrar finanza</h2></div>
              <button type="button" onClick={() => setCreating(false)}><X size={18} /></button>
            </div>
            <div className="hq-form-grid">
              <label className="wide"><span>Concepto</span><input name="label" required autoFocus /></label>
              <label><span>Tipo</span><select name="kind"><option value="income">Ingreso</option><option value="expense">Gasto</option></select></label>
              <label><span>Monto USD</span><input name="amount" type="number" min="0.01" step="0.01" required /></label>
              <label><span>División</span><select name="division"><option value="creative">Creative</option><option value="realty">Realty</option><option value="construction">Construcciones</option></select></label>
              <label><span>Método</span><select name="method"><option>Transferencia</option><option>Efectivo</option><option>Tarjeta</option></select></label>
              <label><span>Categoría</span><input name="category" defaultValue="Servicios" /></label>
              <label><span>Fecha</span><input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
            </div>
            <div className="hq-modal-actions">
              <button type="button" className="hq-quiet-button" onClick={() => setCreating(false)}>Cancelar</button>
              <button type="submit" className="hq-primary-button">Guardar movimiento</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function ReceivablesView({ workspace }: { workspace: ReturnTypeWorkspace }) {
  const [payingId, setPayingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const outstanding = workspace.receivables.reduce((sum, item) => sum + Math.max(0, item.total - item.paid), 0);

  const submitPayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!payingId) return;
    const form = new FormData(event.currentTarget);
    await workspace.addPayment(payingId, Number(form.get("amount")), String(form.get("note") || "Abono manual"));
    setPayingId(null);
  };

  const createReceivable = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const clientId = String(form.get("clientId") || "");
    const projectId = String(form.get("projectId") || "");
    const total = Number(form.get("total") || 0);
    const paid = Number(form.get("paid") || 0);
    if (!clientId || !projectId || !Number.isFinite(total) || total <= 0) return;

    await workspace.addReceivable({
      clientId,
      projectId,
      total,
      paid: Number.isFinite(paid) ? Math.min(Math.max(0, paid), total) : 0,
      dueDate: String(form.get("dueDate") || new Date().toISOString().slice(0, 10)),
    });
    setCreating(false);
  };

  return (
    <div className="hq-view">
      <ViewHeader
        kicker="CUENTAS POR COBRAR"
        title="El dinero pendiente no puede perderse de vista."
        description="Saldo, vencimiento, días transcurridos y abonos persistidos en Firestore."
        action={<button className="hq-primary-button" onClick={() => setCreating(true)}><Plus size={16} /> Nueva cuenta</button>}
      />
      <section className="hq-receivable-summary">
        <div><span>SALDO PENDIENTE</span><strong>{formatMoney(outstanding)}</strong></div>
        <div><span>CUENTAS VENCIDAS</span><strong>{workspace.receivables.filter((item) => item.status === "vencido").length}</strong></div>
        <div><span>RECUPERADO</span><strong>{formatMoney(workspace.receivables.reduce((sum, item) => sum + item.paid, 0))}</strong></div>
      </section>
      <section className="hq-receivable-table">
        <div className="hq-data-header receivables">
          <span>Cliente / proyecto</span><span>Total</span><span>Pagado</span><span>Pendiente</span><span>Días</span><span>Estado</span><span />
        </div>
        {workspace.receivables.length === 0 && <p className="hq-empty-state">No hay cuentas por cobrar registradas.</p>}
        {workspace.receivables.map((item) => {
          const client = workspace.clients.find((clientItem) => clientItem.id === item.clientId);
          const project = workspace.projects.find((projectItem) => projectItem.id === item.projectId);
          const remaining = Math.max(0, item.total - item.paid);
          return (
            <article className="hq-data-row receivables" key={item.id}>
              <span><strong>{client?.name || "Cliente"}</strong><small>{project?.name || "Proyecto"}</small></span>
              <span>{formatMoney(item.total)}</span>
              <span>{formatMoney(item.paid)}</span>
              <span className={remaining > 0 ? "hq-danger-text" : "hq-positive-text"}>{formatMoney(remaining)}</span>
              <span>{remaining > 0 ? daysFrom(item.dueDate) : 0}</span>
              <span><b className={`hq-status-pill ${item.status.replaceAll(" ", "-")}`}>{item.status}</b></span>
              <button className="hq-row-action" disabled={remaining === 0} onClick={() => setPayingId(item.id)}>Registrar abono</button>
              <div className="hq-payment-timeline">
                {item.payments.map((payment) => (
                  <span key={payment.id}><i /><b>{formatMoney(payment.amount)}</b><small>{payment.date}</small></span>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      {creating && (
        <div className="hq-modal-layer" onMouseDown={() => setCreating(false)}>
          <form className="hq-modal compact" onSubmit={(event) => void createReceivable(event)} onMouseDown={(event) => event.stopPropagation()}>
            <div className="hq-modal-head">
              <div><span className="hq-kicker">CARTERA</span><h2>Nueva cuenta por cobrar</h2></div>
              <button type="button" onClick={() => setCreating(false)}><X size={18} /></button>
            </div>
            <div className="hq-form-grid">
              <label><span>Cliente</span><select name="clientId" required defaultValue=""><option value="" disabled>Seleccionar</option>{workspace.clients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              <label><span>Proyecto</span><select name="projectId" required defaultValue=""><option value="" disabled>Seleccionar</option>{workspace.projects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              <label><span>Total USD</span><input name="total" type="number" min="0.01" step="0.01" required /></label>
              <label><span>Pagado inicial</span><input name="paid" type="number" min="0" step="0.01" defaultValue="0" /></label>
              <label className="wide"><span>Vencimiento</span><input name="dueDate" type="date" required /></label>
            </div>
            <div className="hq-modal-actions">
              <button type="button" className="hq-quiet-button" onClick={() => setCreating(false)}>Cancelar</button>
              <button type="submit" className="hq-primary-button">Guardar cuenta</button>
            </div>
          </form>
        </div>
      )}

      {payingId && (
        <div className="hq-modal-layer" onMouseDown={() => setPayingId(null)}>
          <form className="hq-modal compact" onSubmit={(event) => void submitPayment(event)} onMouseDown={(event) => event.stopPropagation()}>
            <div className="hq-modal-head">
              <div><span className="hq-kicker">ABONO</span><h2>Registrar pago</h2></div>
              <button type="button" onClick={() => setPayingId(null)}><X size={18} /></button>
            </div>
            <div className="hq-form-grid">
              <label><span>Monto USD</span><input name="amount" type="number" min="0.01" step="0.01" required autoFocus /></label>
              <label><span>Nota</span><input name="note" defaultValue="Abono manual" /></label>
            </div>
            <div className="hq-modal-actions">
              <button type="button" className="hq-quiet-button" onClick={() => setPayingId(null)}>Cancelar</button>
              <button type="submit" className="hq-primary-button">Aplicar abono</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const stages: Opportunity["stage"][] = ["Lead", "Contactado", "Reunión", "Propuesta", "Negociación", "Ganado", "Perdido"];

export function SalesView({ workspace }: { workspace: ReturnTypeWorkspace }) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const drop = (event: DragEvent<HTMLDivElement>, stage: Opportunity["stage"]) => {
    event.preventDefault();
    if (dragging) void workspace.moveOpportunity(dragging, stage);
    setDragging(null);
  };

  const createOpportunity = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const clientId = String(form.get("clientId") || "") || undefined;
    const client = workspace.clients.find((item) => item.id === clientId);
    const clientName = client?.name || String(form.get("clientName") || "").trim();
    const service = String(form.get("service") || "").trim();
    if (!clientName || !service) return;

    await workspace.addOpportunity({
      clientId,
      clientName,
      service,
      division: String(form.get("division") || "creative") as Division,
      value: Math.max(0, Number(form.get("value") || 0)),
      owner: String(form.get("owner") || "Norvin").trim() || "Norvin",
      source: String(form.get("source") || "Directo").trim(),
      nextAction: String(form.get("nextAction") || "Definir próxima acción").trim(),
      date: String(form.get("date") || new Date().toISOString().slice(0, 10)),
      stage: String(form.get("stage") || "Lead") as Opportunity["stage"],
    });
    setCreating(false);
  };

  return (
    <div className="hq-view">
      <ViewHeader
        kicker="SALES PIPELINE"
        title="Del interés al cierre, sin perder seguimiento."
        description="Pipeline comercial persistente por etapa, valor estimado, fuente y siguiente acción."
        action={<button className="hq-primary-button" onClick={() => setCreating(true)}><Plus size={16} /> Nueva oportunidad</button>}
      />
      <section className="hq-pipeline" aria-label="Pipeline comercial">
        {stages.map((stage) => {
          const items = workspace.opportunities.filter((item) => item.stage === stage);
          const total = items.reduce((sum, item) => sum + item.value, 0);
          return (
            <div
              key={stage}
              className="hq-pipeline-column"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => drop(event, stage)}
            >
              <header><span>{stage}</span><b>{items.length}</b><small>{formatMoney(total)}</small></header>
              <div className="hq-pipeline-stack">
                {items.map((item) => (
                  <article
                    draggable
                    onDragStart={() => setDragging(item.id)}
                    onDragEnd={() => setDragging(null)}
                    className={dragging === item.id ? "dragging" : ""}
                    key={item.id}
                  >
                    <span className={`hq-division-tag ${item.division}`}>{divisionMeta[item.division].short}</span>
                    <strong>{item.clientName}</strong>
                    <p>{item.service}</p>
                    <b>{formatMoney(item.value)}</b>
                    <small>{item.nextAction} · {item.date}</small>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {creating && (
        <div className="hq-modal-layer" onMouseDown={() => setCreating(false)}>
          <form className="hq-modal compact" onSubmit={(event) => void createOpportunity(event)} onMouseDown={(event) => event.stopPropagation()}>
            <div className="hq-modal-head">
              <div><span className="hq-kicker">PIPELINE</span><h2>Nueva oportunidad</h2></div>
              <button type="button" onClick={() => setCreating(false)}><X size={18} /></button>
            </div>
            <div className="hq-form-grid">
              <label><span>Cliente existente</span><select name="clientId" defaultValue=""><option value="">Prospecto nuevo</option>{workspace.clients.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              <label><span>Nombre si es prospecto</span><input name="clientName" /></label>
              <label className="wide"><span>Servicio / oportunidad</span><input name="service" required /></label>
              <label><span>Valor USD</span><input name="value" type="number" min="0" step="0.01" defaultValue="0" /></label>
              <label><span>División</span><select name="division"><option value="creative">Creative</option><option value="realty">Realty</option><option value="construction">Construcciones</option></select></label>
              <label><span>Etapa</span><select name="stage">{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
              <label><span>Responsable</span><input name="owner" defaultValue="Norvin" /></label>
              <label><span>Fuente</span><input name="source" defaultValue="Directo" /></label>
              <label><span>Fecha</span><input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
              <label className="wide"><span>Próxima acción</span><input name="nextAction" defaultValue="Definir próxima acción" /></label>
            </div>
            <div className="hq-modal-actions">
              <button type="button" className="hq-quiet-button" onClick={() => setCreating(false)}>Cancelar</button>
              <button type="submit" className="hq-primary-button">Guardar oportunidad</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export function QuotesView() {
  return (
    <div className="hq-view">
      <ViewHeader
        kicker="COTIZACIONES"
        title="Propuestas preparadas para convertirse en proyectos."
        description="Este módulo ya no muestra información ficticia. La persistencia de cotizaciones será la siguiente colección operativa."
      />
      <section className="hq-standard-table">
        <div className="hq-data-header quotes"><span>Cliente</span><span>Servicio</span><span>División</span><span>Total</span><span>Vigencia</span><span>Estado</span></div>
        <p className="hq-empty-state">Sin cotizaciones conectadas todavía.</p>
      </section>
      <div className="hq-flow-strip">
        <span>COTIZACIÓN</span><ArrowRight /><span>ACEPTACIÓN</span><ArrowRight /><span>CONTRATO</span><ArrowRight /><span>ANTICIPO</span><ArrowRight /><span>PROYECTO</span>
      </div>
    </div>
  );
}

export function CalendarView({ workspace }: { workspace: ReturnTypeWorkspace }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = new Intl.DateTimeFormat("es-NI", { month: "long", year: "numeric" }).format(today).toUpperCase();

  const entries = [
    ...workspace.tasks.map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      date: task.deadline,
      kind: "tarea",
      division: task.division,
    })),
    ...workspace.receivables.map((item) => {
      const project = workspace.projects.find((candidate) => candidate.id === item.projectId);
      return {
        id: `receivable-${item.id}`,
        title: `Vencimiento · ${project?.name || "Cuenta por cobrar"}`,
        date: item.dueDate,
        kind: "pago",
        division: project?.division || ("creative" as Division),
      };
    }),
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="hq-view">
      <ViewHeader
        kicker="CALENDARIO OPERATIVO"
        title="Fechas que afectan la operación."
        description="Vista generada desde deadlines de tareas y vencimientos de cuentas por cobrar reales."
      />
      <section className="hq-calendar-grid">
        <div className="hq-calendar-month">
          <header><span>{monthLabel}</span><b>{String(today.getDate()).padStart(2, "0")}—{daysInMonth}</b></header>
          <div className="hq-calendar-days">
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
              const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const events = entries.filter((item) => item.date === date);
              return (
                <article key={day} className={day === today.getDate() ? "today" : ""}>
                  <span>{day}</span>
                  {events.map((item) => <b key={item.id} title={item.title}>{item.kind}</b>)}
                </article>
              );
            })}
          </div>
        </div>
        <aside className="hq-calendar-agenda">
          <span className="hq-kicker">PRÓXIMO</span>
          {entries.length === 0 && <p className="hq-empty-state">Sin fechas operativas registradas.</p>}
          {entries.slice(0, 10).map((item) => (
            <article key={item.id}>
              <CalendarDays size={16} />
              <div><strong>{item.title}</strong><small>{item.date} · {divisionMeta[item.division].short}</small></div>
              <b>{item.kind}</b>
            </article>
          ))}
        </aside>
      </section>
    </div>
  );
}

export function DocumentsView() {
  return (
    <div className="hq-view">
      <ViewHeader
        kicker="DOCUMENTOS"
        title="Un índice empresarial, no otra carpeta perdida."
        description="El contenido ficticio fue retirado. La siguiente fase conectará Google Drive y el índice documental."
      />
      <section className="hq-doc-browser">
        <div className="hq-doc-folders">
          {["Contratos", "Cotizaciones", "Entregables", "Identidad", "Renders"].map((folder) => (
            <button key={folder}><FolderOpen size={20} /><span>{folder}</span><small>Drive · pendiente de conexión</small></button>
          ))}
        </div>
        <div className="hq-standard-table">
          <div className="hq-data-header documents"><span>Documento</span><span>Tipo</span><span>División</span><span>Actualizado</span></div>
          <p className="hq-empty-state"><FileText size={15} /> No hay documentos indexados todavía.</p>
        </div>
      </section>
    </div>
  );
}

export function MarketingView() {
  const lanes = [
    ["Ideas", "Contenido por producir"],
    ["Borradores", "Piezas en revisión"],
    ["Programado", "Calendario editorial"],
    ["Publicado", "Historial y analítica"],
  ];
  return (
    <div className="hq-view">
      <ViewHeader
        kicker="MARKETING"
        title="Contenido como operación, no improvisación."
        description="Base para calendario editorial, campañas, publicaciones, leads y conexiones futuras con Metricool, Meta y TikTok."
      />
      <section className="hq-marketing-command">
        <div className="hq-marketing-brief">
          <Megaphone size={22} />
          <span>ORQUESTACIÓN FUTURA</span>
          <h2>“Programa esta propiedad mañana.”</h2>
          <p>La capa de acciones está reservada para integrar automatizaciones y XARCON AI sin rehacer el módulo.</p>
        </div>
        <div className="hq-marketing-lanes">
          {lanes.map(([title, description]) => (
            <article key={title}><span>{title}</span><strong>0</strong><small>{description}</small></article>
          ))}
        </div>
      </section>
    </div>
  );
}

export function TeamView() {
  const permissionRows = [
    ["Clientes", "Ver / crear / editar expedientes"],
    ["Proyectos", "Acceso por división y responsabilidad"],
    ["Finanzas", "Permiso separado de acceso general"],
    ["Documentos", "Lectura y edición por contexto"],
  ];
  return (
    <div className="hq-view">
      <ViewHeader
        kicker="EQUIPO & RBAC"
        title="Acceso por responsabilidad, no por confianza implícita."
        description="Base de roles Owner, CEO, Admin, Manager, Collaborator y Viewer con permisos granulares por división."
      />
      <section className="hq-team-layout">
        <div className="hq-team-members">
          {team.map((member) => (
            <article key={member.id}>
              <span className="hq-record-avatar">{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
              <div><strong>{member.name}</strong><small>{member.role} · {member.status}</small></div>
              <span>{member.divisions.map((division) => divisionMeta[division].short).join(" / ")}</span>
              <b><ShieldCheck size={15} /> Acceso total</b>
            </article>
          ))}
        </div>
        <aside className="hq-permission-matrix">
          <span className="hq-kicker">MATRIZ DE PERMISOS</span>
          {permissionRows.map(([name, description]) => (
            <article key={name}><div><strong>{name}</strong><small>{description}</small></div><span>Owner <CheckCircle2 size={15} /></span></article>
          ))}
        </aside>
      </section>
    </div>
  );
}

export function SettingsView({ workspace }: { workspace: ReturnTypeWorkspace }) {
  const live = workspace.connection === "live";
  const items = [
    ["Persistencia", "Firestore en workspaces/xarcon con listeners en tiempo real.", live ? "Activa" : "Conectando"],
    ["Autenticación", "Firebase Auth + Google Sign-In con allowlist Owner y correo verificado.", "Activa"],
    ["CRM Conversaciones", "Bandeja unificada con formularios web, hilos, estados, notas y vínculo a clientes.", "Activa"],
    ["WhatsApp", "Contrato de canal preparado para webhook, mensajes inbound/outbound y automatización futura.", "Preparado"],
    ["Firestore Rules", "Reglas Owner-only y entrada pública validada versionadas en el repositorio.", "Preparadas"],
    ["Storage", "Reglas Owner-only preparadas; archivos se conectarán con Documentos.", "Preparado"],
    ["Google Calendar", "Calendario interno ya deriva fechas de Firestore; sincronización Google pendiente.", "Preparado"],
    ["Google Drive", "Siguiente integración para documentos empresariales.", "Preparado"],
    ["XARCON AI", "Command surface y acciones separadas de UI para añadir agente.", "Preparado"],
    ["Nexus API", "Integración futura desacoplada; no comparte base de datos.", "Preparado"],
  ];

  return (
    <div className="hq-view">
      <ViewHeader
        kicker="SYSTEM SETTINGS"
        title="Arquitectura preparada para crecer."
        description="Configuración, integraciones y estado técnico de XARCON HQ."
      />
      <section className="hq-settings-layout">
        <div className="hq-settings-list">
          {items.map(([name, description, state]) => (
            <article key={name}>
              <Settings2 size={18} />
              <div><strong>{name}</strong><small>{description}</small></div>
              <span className={state === "Activa" ? "ready" : ""}>{state}</span>
            </article>
          ))}
        </div>
        <aside className="hq-system-panel">
          <span className="hq-kicker">LIVE WORKSPACE</span>
          <h3>{live ? "Datos sincronizados" : "Conectando con Firestore"}</h3>
          <p>
            {workspace.error
              ? `Firestore reportó: ${workspace.error}`
              : "Clientes, proyectos, tareas, finanzas, cobros y pipeline usan persistencia remota en el proyecto Firebase XARCON."}
          </p>
          <div className="hq-system-meta">
            <span><SlidersHorizontal size={14} /> Firestore como fuente de verdad</span>
            <span><Link2 size={14} /> Integraciones desacopladas</span>
            <span><UsersRound size={14} /> RBAC extensible</span>
            <span><CircleDollarSign size={14} /> Finanzas empresariales aisladas</span>
          </div>
        </aside>
      </section>
    </div>
  );
}
