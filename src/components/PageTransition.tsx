import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cinematicEase } from "../animations/sequence";
import { Symbol } from "./Logo";

export default function PageTransition() {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <AnimatePresence initial={false}>
      <motion.div
        className="page-transition"
        aria-hidden="true"
        key={pathname}
        initial={{ y: "0%" }}
        animate={{ y: "-102%" }}
        exit={{ y: "-102%" }}
        transition={{ duration: 0.68, ease: cinematicEase }}
      >
        <div>
          <Symbol />
          <span>XARCON CREATIVE</span>
          <i />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
