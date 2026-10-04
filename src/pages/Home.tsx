import Hero from "../sections/Hero";
import SolutionsOverview from "../sections/SolutionsOverview";
import Capabilities from "../sections/Capabilities";
import ProcessOverview from "../sections/ProcessOverview";
import ClientMarquee from "../sections/ClientMarquee";
import Closing from "../sections/Closing";
import Seo from "../components/Seo";
import ImmersiveWorld from "../components/ImmersiveWorld";
import "../styles/sections.css";
import "../styles/immersive.css";
import "../styles/orbit.css";

export default function Home() {
  return (
    <div className="immersive-home">
      <Seo page="home" />
      <ImmersiveWorld />
      <div className="home-content">
        <Hero />
        <ClientMarquee />
        <SolutionsOverview />
        <Capabilities />
        <ProcessOverview />
        <div className="origin-line wrap">
          <span>HECHO DESDE NICARAGUA.</span>
          <p>
            Tecnología cercana,
            <br />
            <b>para negocios reales.</b>
          </p>
          <span>DISEÑO / WEB / SISTEMAS</span>
        </div>
        <Closing />
      </div>
    </div>
  );
}
