import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { cinematicEase, sequenceContent } from "../animations/sequence";

export default function Reveal({
  children,
  className = "",
  delay = 0,
  variant,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "content" | "media";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, {
    once: true,
    amount: 0.12,
    margin: "0px 0px -6% 0px",
  });
  const media =
    variant === "media" ||
    (!variant && /solution-wrap|story-visual/.test(className));
  const visible = inView || reduce;
  return (
    <motion.div
      ref={ref}
      className={`${className} reveal reveal-${media ? "media" : "content"}`}
      data-visible={visible ? "true" : "false"}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
      initial={
        reduce || !media
          ? false
          : { opacity: 0, y: 30, clipPath: "inset(10% 0% 0% 0%)" }
      }
      animate={
        visible && media
          ? {
              opacity: 1,
              y: 0,
              clipPath: "inset(0% 0% 0% 0%)",
              transitionEnd: { clipPath: "none", transform: "none" },
            }
          : undefined
      }
      transition={{ duration: 1.05, delay, ease: cinematicEase }}
    >
      {media ? children : sequenceContent(children)}
    </motion.div>
  );
}
