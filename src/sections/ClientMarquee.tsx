import "../styles/client-marquee.css";

const clients = [
  { name: "Diamantes Realty Group", logo: "/brands/clients/diamantes-realty-group.webp", slug: "diamantes" },
  { name: "GeoCampo", logo: "/brands/clients/geocampo.webp", slug: "geocampo" },
  { name: "Amy Blandón", logo: "/brands/clients/amy-blandon.webp", slug: "amy" },
  { name: "Pequeños Escritores", logo: "/brands/clients/pequenos-escritores.webp", slug: "pequenos-escritores" },
  { name: "Germina", logo: "/brands/clients/germina.svg", slug: "germina" },
  { name: "AVALNIC", logo: "/brands/clients/avalnic.svg", slug: "avalnic" },
];

function ClientGroup({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      className="client-marquee-group"
      role={duplicate ? undefined : "list"}
      aria-hidden={duplicate ? true : undefined}
    >
      {clients.map((client) => (
        <div
          className={`client-logo-card client-logo-card--${client.slug}`}
          role={duplicate ? undefined : "listitem"}
          key={client.name}
        >
          <img
            src={client.logo}
            alt={duplicate ? "" : client.name}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

export default function ClientMarquee() {
  return (
    <section id="proyectos" className="client-showcase" aria-labelledby="client-showcase-title" style={{ scrollMarginTop: 115 }}>
      <div className="client-showcase-head wrap">
        <span className="client-showcase-kicker">PROYECTOS / CONEXIONES REALES</span>
        <div className="client-showcase-copy">
          <h2 id="client-showcase-title">
            Tecnología con <em>nombre propio.</em>
          </h2>
        </div>
      </div>

      <div className="client-marquee-viewport">
        <div className="client-marquee-track">
          <ClientGroup />
          <ClientGroup duplicate />
        </div>
      </div>
    </section>
  );
}
