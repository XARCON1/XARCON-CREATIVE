import { useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Copy,
  PenTool,
  Monitor,
  Layers3,
  Zap,
  Compass,
  HelpCircle,
} from "lucide-react";
import Seo from "../components/Seo";
import Reveal from "../components/Reveal";
import "../styles/pages.css";
const options = [
  { name: "Identidad de marca", label: "Marca", icon: PenTool },
  { name: "Sitios web", label: "Sitio web", icon: Monitor },
  { name: "Sistemas digitales", label: "Sistema digital", icon: Layers3 },
  { name: "Automatización", label: "Automatización", icon: Zap },
  { name: "Estrategia digital", label: "Estrategia", icon: Compass },
  { name: "No estoy seguro", label: "No estoy seguro", icon: HelpCircle },
];
const email = import.meta.env.VITE_CONTACT_EMAIL?.trim() || "";
const whatsapp = (import.meta.env.VITE_CONTACT_WHATSAPP || "").replace(
  /\D/g,
  "",
);
const connected = Boolean(email || whatsapp);
export default function Contact() {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState(
    options.some((o) => o.name === params.get("servicio"))
      ? params.get("servicio")!
      : "",
  );
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
  });
  const [ready, setReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const update = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));
  const text = `PROYECTO · XARCON CREATIVE\n\nNecesidad: ${selected}\nNombre: ${form.name}\nCorreo: ${form.email}\nEmpresa: ${form.company || "No indicada"}\nPresupuesto: ${form.budget || "Por definir"}\n\n${form.message}`;
  const channel = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`
    : `mailto:${email}?subject=${encodeURIComponent("Nuevo proyecto · " + selected)}&body=${encodeURIComponent(text)}`;
  function advance(e: FormEvent) {
    e.preventDefault();
    if (step === 0 && !selected) return;
    if (step < 2) {
      setStep(step + 1);
    } else {
      setReady(true);
    }
    setTimeout(() => heading.current?.focus(), 0);
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-proyecto-xarcon.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <>
      <Seo page="contact" />
      <section className="contact-page wrap page-intro">
        <div className="contact-intro">
          <Reveal>
            <span className="eyebrow">CONTACTO / EL PRIMER PASO</span>
            <h1>
              Cuéntanos
              <br />
              qué quieres
              <br />
              <em>construir.</em>
            </h1>
            <p>
              Una idea, una pregunta o un reto.
              <br />
              Hay muchas formas de empezar.
            </p>
          </Reveal>
          <div className="contact-side-note">
            <span>BASE EN NICARAGUA</span>
            <p>
              Visión abierta.
              <br />
              Conversaciones cercanas.
            </p>
            <ArrowUpRight size={31} />
          </div>
        </div>
        <div className="project-form">
          {!ready ? (
            <>
              <div
                className="form-progress"
                aria-label={`Paso ${step + 1} de 3`}
              >
                {["Tu idea", "El contexto", "Tus datos"].map((s, i) => (
                  <span className={step >= i ? "complete" : ""} key={s}>
                    <i>{step > i ? <Check size={11} /> : i + 1}</i>
                    {s}
                  </span>
                ))}
              </div>
              <form onSubmit={advance}>
                <span className="eyebrow">
                  0{step + 1} / EMPECEMOS POR AQUÍ
                </span>
                <h2 ref={heading} tabIndex={-1}>
                  {
                    [
                      "¿Qué tienes en mente?",
                      "Danos un poco de contexto.",
                      "¿Cómo te llamas?",
                    ][step]
                  }
                </h2>
                {step === 0 && (
                  <fieldset className="project-options">
                    <legend className="sr-only">Qué necesitas</legend>
                    {options.map((o) => (
                      <label key={o.name}>
                        <input
                          type="radio"
                          name="need"
                          value={o.name}
                          checked={selected === o.name}
                          required
                          onChange={() => setSelected(o.name)}
                        />
                        <span>
                          <o.icon size={22} strokeWidth={1.4} />
                          <b>{o.label}</b>
                          <Check className="choice-check" size={15} />
                        </span>
                      </label>
                    ))}
                  </fieldset>
                )}
                {step === 1 && (
                  <div className="project-fields">
                    <label>
                      ¿Qué te gustaría lograr?
                      <textarea
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        required
                        minLength={10}
                        maxLength={4000}
                        rows={5}
                        placeholder="Cuéntanos sobre tu idea, tu negocio o lo que quieres mejorar."
                        autoComplete="off"
                      />
                    </label>
                    <label>
                      Presupuesto aproximado <span>(opcional, en USD)</span>
                      <select
                        value={form.budget}
                        onChange={(e) => update("budget", e.target.value)}
                      >
                        <option value="">Prefiero conversarlo</option>
                        <option>Menos de US$1,000</option>
                        <option>US$1,000 – US$3,000</option>
                        <option>US$3,000 – US$6,000</option>
                        <option>Más de US$6,000</option>
                      </select>
                    </label>
                    <p className="form-helper">
                      El presupuesto nos orienta. No es una cotización.
                    </p>
                  </div>
                )}
                {step === 2 && (
                  <div className="project-fields">
                    <label>
                      Nombre
                      <input
                        name="name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        required
                        minLength={2}
                        maxLength={100}
                        autoComplete="name"
                        placeholder="Tu nombre"
                      />
                    </label>
                    <label>
                      Correo
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        required
                        maxLength={200}
                        autoComplete="email"
                        placeholder="tu@empresa.com"
                      />
                    </label>
                    <label>
                      Empresa <span>(opcional)</span>
                      <input
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        maxLength={150}
                        autoComplete="organization"
                        placeholder="Nombre de tu negocio"
                      />
                    </label>
                  </div>
                )}
                <div className="form-actions">
                  {step > 0 ? (
                    <button
                      type="button"
                      className="form-back"
                      onClick={() => {
                        setStep(step - 1);
                        setTimeout(() => heading.current?.focus(), 0);
                      }}
                    >
                      <ArrowLeft size={16} /> Atrás
                    </button>
                  ) : (
                    <span className="form-helper">
                      No necesitas tener todo resuelto.
                    </span>
                  )}
                  <button className="button dark" type="submit">
                    {step === 2 ? "Preparar resumen" : "Continuar"}{" "}
                    <span>
                      <ArrowRight size={17} />
                    </span>
                  </button>
                </div>
                <p className="form-privacy">
                  {connected
                    ? "Tus datos permanecen en este dispositivo hasta que decidas compartir el resumen."
                    : "Prepara y descarga tu resumen. El envío directo todavía no está disponible."}
                </p>
              </form>
            </>
          ) : (
            <div className="project-summary">
              <span className="summary-check">
                <Check size={26} />
              </span>
              <span className="eyebrow">TU IDEA, UN POCO MÁS CERCA</span>
              <h2 tabIndex={-1} ref={heading}>
                Ya tiene
                <br />
                un punto de partida.
              </h2>
              <p>
                Tu resumen está preparado.{" "}
                {connected
                  ? "Revísalo y abre tu aplicación para compartirlo."
                  : "Puedes descargarlo o copiarlo para conservarlo."}{" "}
                No se ha enviado ninguna solicitud.
              </p>
              <dl>
                <div>
                  <dt>Proyecto</dt>
                  <dd>{selected}</dd>
                </div>
                <div>
                  <dt>Nombre</dt>
                  <dd>{form.name}</dd>
                </div>
                <div>
                  <dt>Correo</dt>
                  <dd>{form.email}</dd>
                </div>
                <div>
                  <dt>Tu idea</dt>
                  <dd>{form.message}</dd>
                </div>
              </dl>
              {connected && (
                <a
                  className="button dark"
                  href={channel}
                  target={whatsapp ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  Abrir {whatsapp ? "WhatsApp" : "correo"}{" "}
                  <ArrowUpRight size={17} />
                </a>
              )}
              <div className="summary-actions">
                <button onClick={download}>
                  <Download size={17} /> Descargar resumen
                </button>
                <button onClick={copy}>
                  <Copy size={17} /> {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              {copyError && (
                <p role="status">
                  No pudimos copiarlo. Puedes descargar el resumen.
                </p>
              )}
              <p className="summary-status" aria-live="polite">
                {copied
                  ? "Resumen copiado."
                  : !connected
                    ? "El canal de envío está en preparación. Este resumen permanece contigo."
                    : ""}
              </p>
              <button
                className="form-back"
                onClick={() => {
                  setReady(false);
                  setStep(0);
                  setCopied(false);
                }}
              >
                <PenTool size={15} /> Editar mi idea
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
