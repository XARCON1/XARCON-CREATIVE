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
    <aside className="launch-promo launch-promo-compact" aria-label="Conoce XARCON Launch">
      <div className="launch-notice-icon" aria-hidden="true"><Symbol /></div>
      <div className="launch-notice-copy">
        <div className="launch-notice-label">{offer ? "BLACK WEEK · −35% ACTIVACIÓN" : "XARCON / LAUNCH"}</div>
        <h2>Tu web desde US$ {launchPlans[0].monthly}/mes</h2>
        <small>+ US$ {formatLaunchAmount(offer ? launchPlans[0].activation : regularActivation(launchPlans[0]))} de activación inicial.</small>
      </div>
      <Link to="/planes" className="launch-notice-link" onClick={dismiss} aria-label="Ver planes XARCON Launch"><span>Ver planes</span><ArrowUpRight size={15} aria-hidden="true"/></Link>
      <button type="button" className="launch-promo-close" onClick={dismiss} aria-label="Cerrar promoción"><X size={17}/></button>
    </aside>
  );
}
