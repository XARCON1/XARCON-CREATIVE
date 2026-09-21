import { useEffect, type RefObject } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";

/** One camera, with different travel distances for each visual plane. */
export default function useSceneCamera(ref: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 65, damping: 21 });
  const y = useSpring(pointerY, { stiffness: 65, damping: 21 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const travel = useSpring(scrollYProgress, { stiffness: 180, damping: 32 });

  useMotionValueEvent(x, "change", (value) => {
    ref.current?.style.setProperty("--px", reduced ? "0" : value.toFixed(4));
  });
  useMotionValueEvent(y, "change", (value) => {
    ref.current?.style.setProperty("--py", reduced ? "0" : value.toFixed(4));
  });
  useMotionValueEvent(travel, "change", (value) => {
    ref.current?.style.setProperty(
      "--scene-travel",
      reduced ? "0" : Math.max(0, Math.min(1, value)).toFixed(4),
    );
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (reduced) {
      for (const property of ["--px", "--py", "--scene-travel"])
        element.style.setProperty(property, "0");
      return;
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || window.innerWidth < 1024) return;
      const rect = element.getBoundingClientRect();
      pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
      pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
    };
    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
    };
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", reset);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
    };
  }, [ref, reduced, pointerX, pointerY]);
}
