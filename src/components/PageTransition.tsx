import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cinematicEase } from "../animations/sequence";

export default function PageTransition() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <AnimatePresence initial={false}>
      <motion.div
        className="page-transition page-transition-panels"
        aria-hidden="true"
        key={pathname}
        initial="cover"
        animate="open"
        exit="open"
        variants={{ cover: {}, open: { transition: { staggerChildren: 0.065 } } }}
      >
        {[0, 1, 2, 3].map((panel) => (
          <motion.div
            className="transition-panel"
            key={panel}
            variants={{ cover: { y: "0%" }, open: { y: "-102%" } }}
            transition={{ duration: 0.8, ease: cinematicEase }}
          >
            {panel === 1 && <span>XARCON</span>}
            {panel === 2 && <span>CREATIVE</span>}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
