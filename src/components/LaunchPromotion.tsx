import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";
import { Symbol } from "./Logo";
import { launchPlans, isBlackWeek, blackWeekEnds, regularActivation, formatLaunchAmount } from "../content/launch";
import "../styles/launch.css";

export default function LaunchPromotion() {
  const [visible,setVisible] = useState(false);
  const [offer,setOffer] = useState(() => isBlackWeek());
  useEffect(() => { const remaining = blackWeekEnds - Date.now(); if (remaining <= 0) { setOffer(false); return; } const timer = window.setTimeout(() => setOffer(false), remaining); return () => window.clearTimeout(timer); }, []);
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
      {offer && <div className="launch-offer"><span>BLACK WEEK</span><b>−35% activación</b></div>}
      <h2>Tu negocio merece estar online.</h2>
      <p>Una web profesional con dominio propio y alojamiento incluido.</p>
      <div className="launch-promo-price">Desde <strong>US$ {launchPlans[0].monthly}</strong> /mes</div>
      <small>+ US$ {formatLaunchAmount(offer ? launchPlans[0].activation : regularActivation(launchPlans[0]))} de activación inicial.{offer && " Hasta el 30 de noviembre."}</small>
      <Link to="/planes" className="launch-action" onClick={dismiss}>Explorar planes <ArrowUpRight size={17}/></Link>
    </aside>
  );
}
