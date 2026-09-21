import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/** Keep the measured shell still while its child travels through the scene. */
export default function DepthReveal({ children, className = "", side = 1, strength = 1 }: {
  children: ReactNode;
  className?: string;
  side?: number;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 96%", "end 8%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 145, damping: 32, mass: 0.55 });
  const x = useTransform(progress, [0, 0.32, 0.76, 1], [side * 85 * strength, 0, 0, -side * 30 * strength]);
  const y = useTransform(progress, [0, 0.32, 0.76, 1], [100 * strength, 0, 0, -45 * strength]);
  const z = useTransform(progress, [0, 0.32, 0.76, 1], [-350 * strength, 0, 0, 45 * strength]);
  const rotateY = useTransform(progress, [0, 0.32, 0.76, 1], [-side * 23 * strength, 0, 0, side * 6 * strength]);
  const rotateX = useTransform(progress, [0, 0.32, 0.76, 1], [9 * strength, 0, 0, -3 * strength]);
  const opacity = useTransform(progress, [0, 0.2, 0.88, 1], [0, 1, 1, 0.75]);
  return (
    <div ref={ref} className={`depth-reveal ${className}`}>
      <motion.div className="depth-plane" style={reduced ? undefined : { x, y, z, rotateX, rotateY, opacity }}>
        {children}
      </motion.div>
    </div>
  );
}
