import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ArrowRight, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
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
import {
  observeAdminAuth,
  signInAdminWithGoogle,
  signOutAdmin,
  type AdminIdentity,
} from "./firebaseAuth";
import { useWorkspace } from "./useWorkspace";
import "./admin.css";

type AuthState = "checking" | "authenticated" | "unauthenticated" | "unconfigured" | "signing-in";

export default function AdminApp() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [identity, setIdentity] = useState<AdminIdentity | null>(null);
  const [error, setError] = useState("");
  const workspace = useWorkspace();

  useEffect(() => {
    let active = true;
    let unsubscribe: () => void = () => undefined;

    void observeAdminAuth((snapshot) => {
      if (!active) return;

      if (snapshot.status === "unconfigured") {
        setIdentity(null);
        setAuth("unconfigured");
        return;
      }

      if (snapshot.status === "authorized") {
        setError("");
        setIdentity(snapshot.user);
        setAuth("authenticated");
        return;
      }

      if (snapshot.status === "forbidden") {
        setIdentity(null);
        setError("Esta cuenta de Google no está autorizada para XARCON HQ.");
        setAuth("unauthenticated");
        return;
      }

      setIdentity(null);
      setAuth("unauthenticated");
    })
      .then((cleanup) => {
        if (!active) {
          cleanup();
          return;
        }
        unsubscribe = cleanup;
      })
      .catch(() => {
        if (!active) return;
        setIdentity(null);
        setAuth("unconfigured");
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const login = async () => {
    setError("");
    setAuth("signing-in");

    try {
      const user = await signInAdminWithGoogle();
      if (user) {
        setIdentity(user);
        setAuth("authenticated");
      }
    } catch (loginError) {
      const code =
        typeof loginError === "object" && loginError && "code" in loginError
          ? String((loginError as { code?: unknown }).code)
          : "";

      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setError("Inicio de sesión cancelado.");
      } else if (loginError instanceof Error && loginError.message === "owner-only") {
        setError("Esta cuenta de Google no está autorizada para XARCON HQ.");
      } else if (loginError instanceof Error && loginError.message === "firebase-unconfigured") {
        setAuth("unconfigured");
        return;
      } else {
        setError("No fue posible completar el acceso con Google.");
      }

      setAuth("unauthenticated");
    }
  };

  const logout = async () => {
    await signOutAdmin();
    setIdentity(null);
    setAuth("unauthenticated");
  };

  if (auth === "checking") {
    return (
      <div className="hq-auth-screen">
        <div className="hq-auth-loading">
          <span className="hq-mark"><Symbol /></span>
          <LoaderCircle className="spin" size={22} />
          <p>Validando identidad de Google…</p>
        </div>
      </div>
    );
  }

  if (auth !== "authenticated" || !identity) {
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
            <h1>Acceso privado<br />mediante Google.</h1>
            <p>La identidad se valida con Firebase Authentication antes de habilitar el centro operativo.</p>
          </div>

          {auth === "unconfigured" ? (
            <div className="hq-auth-warning">
              <ShieldCheck size={20} />
              <div>
                <strong>Firebase todavía no está conectado</strong>
                <p>
                  El flujo de Google ya está implementado, pero el deployment necesita las variables
                  públicas de configuración del proyecto Firebase para activar Authentication.
                </p>
              </div>
            </div>
          ) : (
            <div className="hq-login-form">
              <button
                type="button"
                onClick={() => void login()}
                disabled={auth === "signing-in"}
              >
                <span>{auth === "signing-in" ? "Validando cuenta…" : "Continuar con Google"}</span>
                {auth === "signing-in" ? <LoaderCircle className="spin" size={17} /> : <ArrowRight size={17} />}
              </button>
              {error && <p className="hq-login-error">{error}</p>}
            </div>
          )}

          <div className="hq-login-foot">
            <LockKeyhole size={14} />
            <span>Solo la identidad Owner autorizada puede abrir XARCON HQ.</span>
          </div>
        </section>
      </div>
    );
  }

  return (
    <AdminShell identity={identity} onLogout={logout}>
      <Routes>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<DashboardView workspace={workspace} />} />
        <Route path="/admin/clients" element={<ClientsView workspace={workspace} />} />
        <Route path="/admin/clients/:id" element={<ClientsView workspace={workspace} />} />
        <Route path="/admin/projects" element={<ProjectsView workspace={workspace} />} />
        <Route path="/admin/projects/:id" element={<ProjectsView workspace={workspace} />} />
        <Route path="/admin/finance" element={<FinanceView workspace={workspace} />} />
        <Route path="/admin/receivables" element={<ReceivablesView workspace={workspace} />} />
        <Route path="/admin/sales" element={<SalesView workspace={workspace} />} />
        <Route path="/admin/quotes" element={<QuotesView />} />
        <Route path="/admin/tasks" element={<TasksView workspace={workspace} />} />
        <Route path="/admin/calendar" element={<CalendarView />} />
        <Route path="/admin/documents" element={<DocumentsView />} />
        <Route path="/admin/marketing" element={<MarketingView />} />
        <Route path="/admin/team" element={<TeamView />} />
        <Route path="/admin/settings" element={<SettingsView workspace={workspace} />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminShell>
  );
}
