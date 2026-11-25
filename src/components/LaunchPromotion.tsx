import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { Symbol } from "./Logo";
import { launchPlans } from "../content/launch";
import "../styles/launch.css";

export default function LaunchPromotion() {
  const [visible,setVisible] = useState(false);
  useEffect(() => {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("xarcon:launch-dismissed") === "1"; } catch {}
    if (dismissed) return;
    const timer = window.setTimeout(() => setVisible(true), 4500);
    return () => window.clearTimeout(timer);
  }, []);
  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem("xarcon:launch-dismissed","1"); } catch {}
  };
  if (!visible) return null;
  return (
    <aside className="launch-promo" aria-label="Conoce XARCON Launch">
      <button type="button" className="launch-promo-close" onClick={dismiss} aria-label="Cerrar promoción"><X size={19}/></button>
      <div className="launch-promo-brand"><Symbol /> <span>XARCON / LAUNCH</span></div>
      <h2>Tu negocio merece estar online.</h2>
      <p>Una web profesional con dominio propio y alojamiento incluido.</p>
      <div className="launch-promo-price">Desde <strong>US$ {launchPlans[0].monthly}</strong> /mes</div>
      <small>+ US$ {launchPlans[0].activation} de activación inicial.</small>
      <Link to="/planes" className="launch-action" onClick={dismiss}>Explorar planes <ArrowUpRight size={17}/></Link>
    </aside>
  );
}
