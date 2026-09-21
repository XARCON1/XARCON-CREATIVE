import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** A short-lived light stroke. No animation loop remains running when idle. */
export default function PointerRibbon() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current;
    const scene = canvas?.closest("section");
    if (!canvas || !scene || reduced) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    let points: { x: number; y: number; time: number }[] = [];
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = scene.clientWidth;
      height = scene.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(scene);
    resize();
    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      points = points.filter((point) => now - point.time < 420);
      if (points.length < 2) {
        frame = 0;
        return;
      }
      const head = points[points.length - 1];
      const tail = points[0];
      const gradient = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
      gradient.addColorStop(0, "#9ec9ff00");
      gradient.addColorStop(0.55, "#8fe0ab88");
      gradient.addColorStop(1, "#e4ffcebb");
      context.beginPath();
      context.moveTo(tail.x, tail.y);
      for (let i = 1; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        context.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
      }
      context.lineTo(head.x, head.y);
      context.globalAlpha = Math.max(0, 1 - (now - head.time) / 420);
      context.strokeStyle = gradient;
      context.lineWidth = 3;
      context.lineCap = "round";
      context.shadowColor = "#c9ff9b66";
      context.shadowBlur = 9;
      context.stroke();
      frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || window.innerWidth < 1024) return;
      const rect = scene.getBoundingClientRect();
      points.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, time: performance.now() });
      if (points.length > 24) points.shift();
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const stop = () => {
      if (!document.hidden) return;
      cancelAnimationFrame(frame);
      frame = 0;
      points = [];
      context.clearRect(0, 0, width, height);
    };
    scene.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", stop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      scene.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [reduced]);
  return <canvas className="pointer-ribbon" ref={ref} aria-hidden="true" />;
}
