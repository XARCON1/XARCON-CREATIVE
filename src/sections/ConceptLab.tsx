import { useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Layers3,
  MapPin,
  Building2,
} from "lucide-react";
import Reveal from "../components/Reveal";
import { SystemVisual } from "../components/ServiceVisual";
const tabs = [
  { id: "portal", label: "Portal inmobiliario", icon: Building2 },
  { id: "sistema", label: "Sistema empresarial", icon: Layers3 },
  { id: "reservas", label: "Reservas digitales", icon: CalendarDays },
];
export default function ConceptLab() {
  const [active, setActive] = useState("portal");
  const [filter, setFilter] = useState("Todos");
  const [day, setDay] = useState(18);
  const [time, setTime] = useState("10:00");
  const [booked, setBooked] = useState(false);
  return (
    <section className="concept-lab section">
      <div className="wrap">
        <Reveal className="section-heading">
          <div>
            <span className="eyebrow">04 / UN VISTAZO A LO POSIBLE</span>
            <h2>
              Menos imaginar.
              <br />
              Más experimentar.
            </h2>
          </div>
          <p>
            Explora algunas posibilidades. Son conceptos interactivos, no
            proyectos de clientes.
          </p>
        </Reveal>
        <Reveal className="lab-shell" variant="media">
          <div className="lab-sidebar">
            <span className="lab-label">ELIGE UNA EXPERIENCIA</span>
            <div
              role="tablist"
              aria-label="Experiencias conceptuales"
              className="lab-tabs"
            >
              {tabs.map((t, i) => (
                <button
                  id={`tab-${t.id}`}
                  key={t.id}
                  role="tab"
                  aria-controls={`panel-${t.id}`}
                  aria-selected={active === t.id}
                  tabIndex={active === t.id ? 0 : -1}
                  onClick={() => setActive(t.id)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "ArrowRight" ||
                      e.key === "ArrowDown" ||
                      e.key === "ArrowLeft" ||
                      e.key === "ArrowUp"
                    ) {
                      e.preventDefault();
                      const next =
                        (i +
                          (e.key === "ArrowRight" || e.key === "ArrowDown"
                            ? 1
                            : 2)) %
                        3;
                      setActive(tabs[next].id);
                      document.getElementById(`tab-${tabs[next].id}`)?.focus();
                    }
                  }}
                >
                  <t.icon size={18} />
                  <span>{t.label}</span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            </div>
            <p>
              Diseñamos la herramienta
              <br />
              alrededor de tu negocio.
            </p>
            <span className="lab-concept-stamp">
              CONCEPTO INTERACTIVO
              <br />
              XARCON / CREATIVE
            </span>
          </div>
          <div
            className="lab-display"
            role="tabpanel"
            id={`panel-${active}`}
            aria-labelledby={`tab-${active}`}
            tabIndex={0}
          >
            {active === "portal" && (
              <div className="portal-demo">
                <div className="portal-demo-header">
                  <span>ESPACIOS / CONCEPTO</span>
                  <MapPin size={17} />
                </div>
                <h3>Encuentra tu próximo lugar.</h3>
                <div className="portal-filters" aria-label="Tipo de espacio">
                  {["Todos", "Residencial", "Comercial"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      aria-pressed={filter === f}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <div className="portal-results">
                  {[
                    {
                      name: "Entre naturaleza y arquitectura",
                      type: "Residencial",
                      image: "hero",
                    },
                    {
                      name: "Un espacio para nuevas ideas",
                      type: "Comercial",
                      image: "studio",
                    },
                  ]
                    .filter((p) => filter === "Todos" || p.type === filter)
                    .map((p) => (
                      <article key={p.type}>
                        <img
                          src={`/images/${p.image}.webp`}
                          alt={p.name}
                          loading="lazy"
                          width="550"
                          height="350"
                        />
                        <span>{p.type}</span>
                        <h4>{p.name}</h4>
                      </article>
                    ))}
                </div>
                <span className="concept-label">
                  Espacios ilustrativos · sin propiedades a la venta
                </span>
              </div>
            )}
            {active === "sistema" && <SystemVisual />}
            {active === "reservas" && (
              <div className="booking-demo">
                <div className="portal-demo-header">
                  <span>AGENDA / CONCEPTO</span>
                  <CalendarDays size={18} />
                </div>
                <h3>Un momento para conectar.</h3>
                <p>Prueba cómo se siente una reserva sencilla.</p>
                <fieldset>
                  <legend>Elige un día de ejemplo</legend>
                  <div className="booking-days">
                    {[18, 19, 20, 21, 22].map((d, i) => (
                      <label key={d}>
                        <input
                          type="radio"
                          name="demo-day"
                          checked={day === d}
                          onChange={() => {
                            setDay(d);
                            setBooked(false);
                          }}
                        />
                        <span>
                          {["LUN", "MAR", "MIÉ", "JUE", "VIE"][i]}
                          <b>{d}</b>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="booking-bottom">
                  <label>
                    Hora
                    <select
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                        setBooked(false);
                      }}
                    >
                      <option>10:00</option>
                      <option>11:30</option>
                      <option>14:00</option>
                    </select>
                  </label>
                  <button
                    className="button dark"
                    onClick={() => setBooked(true)}
                  >
                    Simular reserva <ArrowUpRight size={17} />
                  </button>
                </div>
                <p className="booking-feedback" aria-live="polite">
                  {booked ? (
                    <>
                      <Check size={16} /> Ejemplo: día {day}, {time}. No se ha
                      creado una reserva.
                    </>
                  ) : (
                    "Demostración conceptual. No corresponde a una agenda real."
                  )}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
