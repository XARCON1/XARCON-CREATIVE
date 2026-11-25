import LaunchPromotion from "../components/LaunchPromotion";
import Hero from "../sections/Hero";
import { WhyXarcon } from "../sections/CommercialSections";
import "../styles/commercial.css";
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
import "../styles/evolution.css";

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
        <WhyXarcon />
        <ProcessOverview />
        <Closing />
      </div>
      <LaunchPromotion />
    </div>
  );
}
