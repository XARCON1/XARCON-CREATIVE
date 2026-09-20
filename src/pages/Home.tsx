import Hero from "../sections/Hero";
import SolutionsOverview from "../sections/SolutionsOverview";
import Capabilities from "../sections/Capabilities";
import ProcessOverview from "../sections/ProcessOverview";
import ConceptLab from "../sections/ConceptLab";
import Closing from "../sections/Closing";
import Seo from "../components/Seo";
import "../styles/sections.css";
export default function Home() {
  return (
    <>
      <Seo page="home" />
      <Hero />
      <SolutionsOverview />
      <Capabilities />
      <ProcessOverview />
      <ConceptLab />
      <div className="origin-line wrap">
        <span>UNA MIRADA LOCAL. POSIBILIDADES GLOBALES.</span>
        <p>
          Desde Nicaragua,
          <br />
          <b>para ideas sin fronteras.</b>
        </p>
        <span>DISEÑO / TECNOLOGÍA / XARCON</span>
      </div>
      <Closing />
    </>
  );
}
