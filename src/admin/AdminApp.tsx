import { useEffect, useState, type FormEvent } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ArrowRight, KeyRound, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { Symbol } from "../components/Logo";
import AdminShell from "./AdminShell";
import DashboardView from "./DashboardView";
import { ClientsView, ProjectsView, TasksView } from "./OperationsViews";
import {
  CalendarView,
  DocumentsView,
  FinanceView,
  MarketingView,
  QuotesView,
  ReceivablesView,
  SalesView,
  SettingsView,
  TeamView,
} from "./BusinessViews";
import { useWorkspace } from "./useWorkspace";
import "./admin.css";

type AuthState = "checking" | "authenticated" | "unauthenticated" | "unconfigured";

export default function AdminApp() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [error, setError] = useState("");
  const workspace = useWorkspace();

  const checkSession = async () => {
    try {
      const response = await fetch("/api/admin-session", { credentials: "include" });
      if (response.status === 503) {
        setAuth("unconfigured");
        return;
      }
      if (!response.ok) {
        setAuth("unauthenticated");
        return;
      }
      const data = (await response.json()) as { authenticated?: boolean };
      setAuth(data.authenticated ? "authenticated" : "unauthenticated");
    } catch {
      setAuth(import.meta.env.DEV ? "unauthenticated" : "unconfigured");
    }
  };

  useEffect(() => {
    void checkSession();
  }, []);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const accessKey = String(form.get("accessKey") || "");
    try {
      const response = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ accessKey }),
      });
      if (response.status === 503) {
        setAuth("unconfigured");
        return;
      }
      if (!response.ok) {
        setError("Credencial no válida.");
        return;
      }
      setAuth("authenticated");
    } catch {
      setError("No fue posible validar la sesión.");
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/admin-logout", { method: "POST", credentials: "include" });
    } finally {
      setAuth("unauthenticated");
    }
  };

  if (auth === "checking") {
    return (
      <div className="hq-auth-screen">
        <div className="hq-auth-loading">
          <span className="hq-mark"><Symbol /></span>
          <LoaderCircle className="spin" size={22} />
          <p>Validando entorno privado…</p>
        </div>
      </div>
    );
  }

  if (auth !== "authenticated") {
    return (
      <div className="hq-auth-screen">
        <div className="hq-auth-atmosphere" aria-hidden="true" />
        <section className="hq-login-panel">
          <div className="hq-login-brand">
            <span className="hq-mark"><Symbol /></span>
            <div><strong>XARCON</strong><span>OPERATIONS SYSTEM</span></div>
          </div>

          <div className="hq-login-copy">
            <span className="hq-kicker">PRIVATE BUSINESS CONTROL</span>
            <h1>Entrá al centro<br />operativo de XARCON.</h1>
            <p>CRM, proyectos, finanzas y decisiones ejecutivas dentro de una superficie privada.</p>
          </div>

          {auth === "unconfigured" ? (
            <div className="hq-auth-warning">
              <ShieldCheck size={20} />
              <div>
                <strong>Acceso bloqueado por configuración</strong>
                <p>Definí <code>XARCON_ADMIN_ACCESS_KEY</code> y <code>XARCON_ADMIN_SESSION_SECRET</code> en Vercel para habilitar el acceso. El sistema falla cerrado por seguridad.</p>
              </div>
            </div>
          ) : (
            <form className="hq-login-form" onSubmit={login}>
              <label>
                <span>CLAVE DE ACCESO</span>
                <div><KeyRound size={17} /><input name="accessKey" type="password" autoComplete="current-password" required autoFocus /></div>
              </label>
              {error && <p className="hq-login-error">{error}</p>}
              <button type="submit">Acceder al HQ <ArrowRight size={17} /></button>
            </form>
          )}

          <div className="hq-login-foot">
            <LockKeyhole size={14} />
            <span>Sesión protegida mediante cookie HttpOnly · acceso sin indexación pública</span>
          </div>
        </section>
      </div>
    );
  }

  return (
    <AdminShell onLogout={logout}>
      <Routes>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView workspace={workspace} />} />
        <Route path="clients" element={<ClientsView workspace={workspace} />} />
        <Route path="clients/:id" element={<ClientsView workspace={workspace} />} />
        <Route path="projects" element={<ProjectsView workspace={workspace} />} />
        <Route path="projects/:id" element={<ProjectsView workspace={workspace} />} />
        <Route path="finance" element={<FinanceView workspace={workspace} />} />
        <Route path="receivables" element={<ReceivablesView workspace={workspace} />} />
        <Route path="sales" element={<SalesView workspace={workspace} />} />
        <Route path="quotes" element={<QuotesView />} />
        <Route path="tasks" element={<TasksView workspace={workspace} />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="documents" element={<DocumentsView />} />
        <Route path="marketing" element={<MarketingView />} />
        <Route path="team" element={<TeamView />} />
        <Route path="settings" element={<SettingsView workspace={workspace} />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminShell>
  );
}
