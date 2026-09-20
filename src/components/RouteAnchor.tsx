import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Mount inside Suspense: the destination exists even on a slow first visit.
export default function RouteAnchor() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
}
