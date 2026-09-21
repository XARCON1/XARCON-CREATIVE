import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Symbol } from "./Logo";

export default function ImmersiveWorld() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    import("../graphics/world").then(({ mountWorld }) => {
      if (cancelled) return;
      try {
        dispose = mountWorld(host, Boolean(reduced));
      } catch {
        host.dataset.sceneState = "fallback";
      }
    }).catch(() => { host.dataset.sceneState = "fallback"; });
    return () => { cancelled = true; dispose?.(); };
  }, [reduced]);
  return (
    <div className="immersive-world" ref={ref} aria-hidden="true" data-scene-state="loading">
      <div className="world-atmosphere" />
      <div className="world-fallback"><Symbol /></div>
      <div className="world-vignette" />
    </div>
  );
}
