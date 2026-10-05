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
          className="client-logo-card"
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
    <section className="client-showcase" aria-labelledby="client-showcase-title">
      <div className="client-showcase-head wrap">
        <span className="client-showcase-kicker">TRABAJO QUE YA EXISTE</span>
        <div className="client-showcase-copy">
          <h2 id="client-showcase-title">
            Marcas y proyectos con los que <em>ya hemos trabajado.</em>
          </h2>
          <p>
            Detrás de XARCON hay proyectos reales, necesidades reales y
            personas que confiaron en nuestro trabajo.
          </p>
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
