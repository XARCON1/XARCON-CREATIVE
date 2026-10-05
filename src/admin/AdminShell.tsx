import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Activity,
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Command,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { Symbol } from "../components/Logo";
import { clients, projects, quotes, tasks } from "./data";

type Props = {
  children: ReactNode;
  onLogout: () => Promise<void>;
};

const navGroups = [
  {
    label: "OPERACIONES",
    items: [
      ["/admin/dashboard", "Centro", LayoutDashboard],
      ["/admin/clients", "Clientes", Users],
      ["/admin/projects", "Proyectos", FolderKanban],
      ["/admin/tasks", "Tareas", Activity],
    ],
  },
  {
    label: "NEGOCIO",
    items: [
      ["/admin/finance", "Finanzas", CircleDollarSign],
      ["/admin/receivables", "Cobros", BadgeDollarSign],
      ["/admin/sales", "Pipeline", BriefcaseBusiness],
      ["/admin/quotes", "Cotizaciones", WalletCards],
    ],
  },
  {
    label: "SISTEMA",
    items: [
      ["/admin/calendar", "Calendario", CalendarDays],
      ["/admin/documents", "Documentos", FileText],
      ["/admin/marketing", "Marketing", Megaphone],
      ["/admin/team", "Equipo", ShieldCheck],
      ["/admin/settings", "Ajustes", Settings],
    ],
  },
] as const;

type SearchItem = {
  id: string;
  title: string;
  meta: string;
  path: string;
};

export default function AdminShell({ children, onLogout }: Props) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const searchItems = useMemo<SearchItem[]>(
    () => [
      ...clients.map((item) => ({
        id: `client-${item.id}`,
        title: item.name,
        meta: `Cliente · ${item.company ?? item.type}`,
        path: `/admin/clients?focus=${item.id}`,
      })),
      ...projects.map((item) => ({
        id: `project-${item.id}`,
        title: item.name,
        meta: `Proyecto · ${item.status}`,
        path: `/admin/projects?focus=${item.id}`,
      })),
      ...tasks.map((item) => ({
        id: `task-${item.id}`,
        title: item.title,
        meta: `Tarea · ${item.status}`,
        path: "/admin/tasks",
      })),
      ...quotes.map((item) => ({
        id: `quote-${item.id}`,
        title: item.service,
        meta: `Cotización · ${item.clientName}`,
        path: "/admin/quotes",
      })),
    ],
    [],
  );

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return searchItems.slice(0, 8);
    return searchItems
      .filter((item) => `${item.title} ${item.meta}`.toLowerCase().includes(normalized))
      .slice(0, 10);
  }, [query, searchItems]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (paletteOpen) window.setTimeout(() => input.current?.focus(), 30);
  }, [paletteOpen]);

  const go = (path: string) => {
    setPaletteOpen(false);
    setMobileOpen(false);
    setQuery("");
    navigate(path);
  };

  return (
    <div className="hq-shell">
      <aside className={`hq-rail ${mobileOpen ? "is-open" : ""}`} aria-label="Navegación XARCON Admin">
        <div className="hq-rail-brand">
          <span className="hq-mark"><Symbol /></span>
          <div>
            <strong>XARCON</strong>
            <span>OPERATIONS SYSTEM</span>
          </div>
          <button className="hq-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Cerrar navegación">
            <X size={18} />
          </button>
        </div>

        <nav className="hq-nav">
          {navGroups.map((group) => (
            <div className="hq-nav-group" key={group.label}>
              <span className="hq-nav-label">{group.label}</span>
              {group.items.map(([to, label, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `hq-nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={17} strokeWidth={1.7} />
                  <span>{label}</span>
                  <ChevronRight className="hq-nav-chevron" size={14} />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="hq-rail-foot">
          <div className="hq-system-status">
            <span className="hq-live-dot" />
            <div><strong>Sistema operativo</strong><small>Datos demo · capa local</small></div>
          </div>
          <button className="hq-logout" onClick={() => void onLogout()}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {mobileOpen && <button className="hq-rail-backdrop" aria-label="Cerrar navegación" onClick={() => setMobileOpen(false)} />}

      <section className="hq-stage">
        <header className="hq-topbar">
          <div className="hq-top-left">
            <button className="hq-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Abrir navegación">
              <Menu size={19} />
            </button>
            <div className="hq-context">
              <span>XARCON HQ</span>
              <b>Centro operativo</b>
            </div>
          </div>
          <div className="hq-top-actions">
            <button className="hq-command-trigger" onClick={() => setPaletteOpen(true)}>
              <Search size={16} />
              <span>Buscar o ejecutar</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button className="hq-ai-preview" type="button" title="Arquitectura preparada para XARCON AI">
              <Sparkles size={16} /> <span>AI ready</span>
            </button>
            <div className="hq-owner-chip" aria-label="Sesión Owner">
              <span>NG</span>
              <div><strong>Owner</strong><small>Acceso total</small></div>
            </div>
          </div>
        </header>

        <div className="hq-demo-strip">
          <span>ENTORNO DEMO</span>
          La interfaz usa registros de demostración centralizados. No representa contabilidad oficial ni datos productivos.
        </div>

        <main className="hq-main" id="hq-main">
          {children}
        </main>

        <nav className="hq-mobile-dock" aria-label="Accesos principales móvil">
          {navGroups[0].items.slice(0, 4).map(([to, label, Icon]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : "")}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
          <button onClick={() => setPaletteOpen(true)}>
            <Command size={18} />
            <span>Comando</span>
          </button>
        </nav>
      </section>

      {paletteOpen && (
        <div className="hq-palette-layer" role="presentation" onMouseDown={() => setPaletteOpen(false)}>
          <section
            className="hq-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command Palette"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="hq-palette-input">
              <Search size={18} />
              <input
                ref={input}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Clientes, proyectos, tareas, cotizaciones…"
              />
              <kbd>ESC</kbd>
            </div>
            <div className="hq-palette-quick">
              <button onClick={() => go("/admin/tasks?new=1")}><Activity size={15} /> Crear tarea</button>
              <button onClick={() => go("/admin/finance?new=income")}><CircleDollarSign size={15} /> Registrar ingreso</button>
              <button onClick={() => go("/admin/clients?new=1")}><Users size={15} /> Crear cliente</button>
            </div>
            <div className="hq-palette-results">
              <span className="hq-palette-heading">RESULTADOS</span>
              {results.length ? results.map((item) => (
                <button key={item.id} onClick={() => go(item.path)}>
                  <span><strong>{item.title}</strong><small>{item.meta}</small></span>
                  <ChevronRight size={15} />
                </button>
              )) : <p>No hay coincidencias.</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
