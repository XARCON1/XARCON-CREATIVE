import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Circle,
  Mail,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Layers3,
  CheckCheck,
} from "lucide-react";
import { Symbol } from "./Logo";
import { WebInterface } from "./DeviceScene";
export type ServiceKind =
  "identity" | "web" | "systems" | "automation" | "strategy" | "special";
export function AutomationFlow() {
  const [running, setRunning] = useState(false);
  return (
    <div className={`automation-visual ${running ? "running" : ""}`}>
      <div className="visual-metadata">
        <span>UNA TAREA, MENOS PASOS</span>
        <span>01 — 03</span>
      </div>
      <div className="flow-stage">
        {[
          [Mail, "Nueva consulta"],
          [SlidersHorizontal, "Organizar"],
          [CheckCheck, "Dar seguimiento"],
        ].map(([Icon, label], i) => {
          const I = Icon as typeof Mail;
          return (
            <div className="flow-step" key={i}>
              <span>
                <I size={23} />
              </span>
              <b>{label as string}</b>
              {i < 2 && (
                <i className="flow-connector">
                  <ArrowRight size={18} />
                </i>
              )}
            </div>
          );
        })}
      </div>
      <div className="flow-preview" aria-live="polite">
        {running ? (
          <>
            <Check size={16} />
            <span>Consulta organizada. Seguimiento preparado.</span>
          </>
        ) : (
          <>
            <Circle size={13} />
            <span>Una consulta lista para conectar.</span>
          </>
        )}
      </div>
      <button className="visual-action" onClick={() => setRunning((r) => !r)}>
        {running ? <RotateCcw size={15} /> : <Play size={15} />}{" "}
        {running ? "Reiniciar ejemplo" : "Simular el flujo"}
      </button>
      <small className="concept-label">
        Demostración conceptual · sin envío de mensajes
      </small>
    </div>
  );
}
export function BrandVisual() {
  const [theme, setTheme] = useState(0);
  return (
    <div className={`brand-visual theme-${theme}`}>
      <div className="visual-metadata">
        <span>UNA IDENTIDAD. MUCHAS FORMAS.</span>
        <span>X / C</span>
      </div>
      <div className="brand-art">
        <Symbol />
        <span>
          XARCON
          <br />
          <b>CREATIVE</b>
        </span>
      </div>
      <div className="brand-specimen">
        <span>Aa</span>
        <p>
          Claridad.
          <br />
          Carácter.
          <br />
          Coherencia.
        </p>
        <div>
          {["Noche", "Marfil", "Lima"].map((label, i) => (
            <button
              key={label}
              aria-label={`Ver identidad en ${label.toLowerCase()}`}
              aria-pressed={theme === i}
              onClick={() => setTheme(i)}
            >
              {theme === i && <Check size={12} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export function SystemVisual() {
  const [filter, setFilter] = useState("Todos");
  const tasks = [
    ["Identidad visual", "En diseño"],
    ["Experiencia web", "En revisión"],
    ["Guía de contenidos", "Listo"],
  ];
  return (
    <div className="system-visual">
      <div className="system-sidebar">
        <Symbol />
        <Layers3 size={17} />
        <Circle size={17} />
        <SlidersHorizontal size={17} />
      </div>
      <div className="system-body">
        <div className="visual-metadata">
          <span>VISTA DEL EQUIPO</span>
          <span>EJEMPLO</span>
        </div>
        <h3>
          Un buen día
          <br />
          para avanzar.
        </h3>
        <div className="system-stats">
          <div>
            <span>En curso</span>
            <b>03</b>
          </div>
          <div>
            <span>Por revisar</span>
            <b>01</b>
          </div>
          <div className="system-mini-chart">
            {[33, 48, 42, 75, 62, 85, 98].map((h, i) => (
              <i style={{ height: h + "%" }} key={i} />
            ))}
          </div>
        </div>
        <div className="system-filters" aria-label="Filtrar tareas">
          {["Todos", "En revisión"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="system-task-list">
          {tasks
            .filter((t) => filter === "Todos" || t[1] === filter)
            .map(([title, status]) => (
              <div key={title}>
                <span>{title}</span>
                <span className={status === "Listo" ? "task-done" : ""}>
                  {status}
                </span>
              </div>
            ))}
        </div>
        <span className="concept-label">
          Datos ilustrativos · experiencia conceptual
        </span>
      </div>
    </div>
  );
}
export default function ServiceVisual({ kind }: { kind: ServiceKind }) {
  const [webPage, setWebPage] = useState(0);
  if (kind === "identity") return <BrandVisual />;
  if (kind === "automation") return <AutomationFlow />;
  if (kind === "systems") return <SystemVisual />;
  if (kind === "web")
    return (
      <div className="web-visual">
        <div className="browser-chrome">
          <span />
          <span />
          <span />
          <b>xarcon / experiencia conceptual</b>
        </div>
        <WebInterface variant={webPage} />
        <div className="web-demo-tabs" aria-label="Cambiar vista conceptual">
          {["Explorar", "La visión"].map((label, i) => (
            <button
              aria-pressed={webPage === i}
              onClick={() => setWebPage(i)}
              key={label}
            >
              {label}
            </button>
          ))}
        </div>
        {webPage === 1 && (
          <div className="web-vision">
            <span className="eyebrow">LA VISIÓN</span>
            <h3>
              Más espacio
              <br />
              para lo esencial.
            </h3>
            <p>Una experiencia clara desde el primer clic.</p>
            <ArrowUpRight size={24} />
          </div>
        )}
      </div>
    );
  if (kind === "strategy")
    return (
      <div className="strategy-visual">
        <div className="visual-metadata">
          <span>DE LA INTENCIÓN A LA ACCIÓN</span>
          <Sparkles size={18} />
        </div>
        <h3>
          Tu historia.
          <br />
          <em>Bien contada.</em>
        </h3>
        <div className="strategy-path">
          <span>Escuchar</span>
          <ArrowRight size={15} />
          <span>Conectar</span>
          <ArrowRight size={15} />
          <span>Crecer</span>
        </div>
        <div className="strategy-bottom">
          <span>
            Mensaje
            <br />
            <b>Una voz reconocible.</b>
          </span>
          <span>
            Dirección
            <br />
            <b>Un plan con sentido.</b>
          </span>
        </div>
      </div>
    );
  return (
    <div className="special-visual">
      <img
        src="/images/future.webp"
        alt="Pieza conceptual de vidrio azul sobre piedra natural"
        loading="lazy"
        width="1000"
        height="750"
      />
      <span>
        IDEAS FUERA DE LO HABITUAL <ArrowUpRight size={20} />
      </span>
    </div>
  );
}
