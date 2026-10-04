import "../styles/client-marquee.css";

const clients = [
  {
    name: "Diamantes Realty Group",
    logo: "/brands/clients/diamantes-realty-group.webp",
  },
  {
    name: "GeoCampo",
    logo: "/brands/clients/geocampo.webp",
  },
  {
    name: "Amy Blandón",
    logo: "/brands/clients/amy-blandon.webp",
  },
  {
    name: "Pequeños Escritores",
    logo: "/brands/clients/pequenos-escritores.webp",
  },
  {
    name: "Germina",
    logo: "/brands/clients/germina.webp",
  },
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
        <span className="client-showcase-kicker">COLABORACIONES</span>

        <div className="client-showcase-copy">
          <h2 id="client-showcase-title">
            Empresas y marcas con las que <em>hemos colaborado.</em>
          </h2>
          <p>
            Trabajo real, soluciones reales y experiencia que hoy impulsa
            XARCON Creative.
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
