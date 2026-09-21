import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

export default function HexSurface({ paused }: { paused: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.closest(".hero");
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !host || !context) return;
    const ctx = context;
    let width = 1, height = 1, radius = 25, frame = 0, last = 0, clock = 0;
    let visible = true, disposed = false, px = 0.72, py = 0.43;
    let cells: { x: number; y: number; seed: number }[] = [];
    function request() { if (!frame && visible && !document.hidden && !disposed) frame = requestAnimationFrame(draw); }
    function resize() {
      const bounds = host!.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.25);
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      radius = width < 768 ? 20 : 28;
      cells = [];
      for (let col = -1; col < width / (radius * 1.5) + 1; col++) {
        for (let row = -1; row < height / (radius * Math.sqrt(3)) + 1; row++) {
          cells.push({ x: col * radius * 1.5, y: (row + (col % 2) * 0.5) * radius * Math.sqrt(3), seed: Math.sin(col * 7.1 + row * 3.7) });
        }
      }
      request();
    }
    function draw(time: number) {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      if (!paused && !reduced && time - last < 40) { request(); return; }
      clock += Math.min((time - last) / 1000 || 0, 0.06); last = time;
      const t = paused || reduced ? 0 : clock;
      ctx.clearRect(0, 0, width, height);
      const cx = width * (0.7 + (px - 0.5) * 0.09), cy = height * (0.46 + (py - 0.5) * 0.08);
      for (const cell of cells) {
        const dx = cell.x - cx, dy = cell.y - cy;
        const distance = Math.hypot(dx, dy), angle = Math.atan2(dy, dx);
        const wave = Math.sin(distance * 0.016 - t * 0.9 + angle * 0.35);
        const lift = wave * 6 + Math.sin(distance * 0.008 + t * 0.5) * 3;
        const focus = Math.max(0, 1 - Math.abs(cell.x / width - 0.65));
        const alpha = (0.08 + (wave + 1) * 0.085) * focus;
        const r = radius - 1.6 - Math.max(0, wave) * 1.8;
        const x = cell.x + Math.cos(angle) * lift * 0.6, y = cell.y + lift;
        ctx.beginPath();
        for (let k = 0; k < 6; k++) {
          const hx = x + Math.cos(k * Math.PI / 3) * r, hy = y + Math.sin(k * Math.PI / 3) * r;
          if (k === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(10,44,72,${alpha * 0.65})`; ctx.fill();
        ctx.strokeStyle = `rgba(90,176,222,${alpha})`; ctx.lineWidth = 0.85; ctx.stroke();
        // Three lit bevel edges, with a travelling cyan reflection.
        ctx.beginPath();
        ctx.moveTo(x - r, y); ctx.lineTo(x - r * 0.5, y - r * 0.866); ctx.lineTo(x + r * 0.5, y - r * 0.866); ctx.lineTo(x + r, y);
        ctx.strokeStyle = `rgba(139,210,239,${alpha * (0.7 + Math.max(0, wave) * 0.8)})`;
        ctx.lineWidth = 1; ctx.stroke();
      }
      canvas!.dataset.surfaceState = paused || reduced ? "still" : "animated";
      if (!paused && !reduced) request();
    }
    const pointer = (event: Event) => { const e = event as PointerEvent; const r = host!.getBoundingClientRect(); px = (e.clientX - r.left) / width; py = (e.clientY - r.top) / height; };
    const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else { last = performance.now(); request(); } };
    const viewport = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) { last = performance.now(); request(); } else { cancelAnimationFrame(frame); frame = 0; } });
    const observer = new ResizeObserver(resize); observer.observe(host); viewport.observe(host);
    host.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => { disposed = true; cancelAnimationFrame(frame); observer.disconnect(); viewport.disconnect(); host.removeEventListener("pointermove", pointer); document.removeEventListener("visibilitychange", visibility); };
  }, [paused, reduced]);
  return <canvas ref={ref} className="hero-hex-surface" aria-hidden="true" />;
}
