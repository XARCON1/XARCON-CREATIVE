import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cinematicEase } from "../animations/sequence";

const mark = "M4 4h12l8 12 8-12h12L30 24l14 20H32l-8-12-8 12H4l14-20L4 4Z";

/** The site is visible through the brand, then the aperture becomes the scene. */
export default function SceneOpening() {
  const id = useId();
  const reduced = useReducedMotion();
  const [finished, setFinished] = useState(false);
  if (reduced || finished) return null;
  return (
    <motion.div
      className="scene-opening"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.12, duration: 0.3 }}
      onAnimationComplete={() => setFinished(true)}
    >
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
            <rect width="1000" height="1000" fill="white" />
            <g transform="translate(500 500)">
              <motion.g
                initial={{ scale: 2.4, rotate: -8 }}
                animate={{ scale: 68, rotate: 0 }}
                transition={{ delay: 0.42, duration: 1.02, ease: [0.7, 0, 0.2, 1] }}
              >
                <path d={mark} transform="translate(-24 -24)" fill="black" />
              </motion.g>
            </g>
          </mask>
        </defs>
        <rect width="1000" height="1000" fill="#071727" mask={`url(#${id})`} />
        <g transform="translate(500 500)">
          <motion.g
            initial={{ opacity: 1, scale: 2.4, rotate: -8 }}
            animate={{ opacity: 0, scale: 3.1, rotate: 0 }}
            transition={{ delay: 0.36, duration: 0.2 }}
          >
            <path d={mark} transform="translate(-24 -24)" fill="none" stroke="#f7f5ef" strokeWidth="0.5" />
          </motion.g>
        </g>
      </svg>
      <motion.div
        className="opening-signature"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -15] }}
        transition={{ duration: 0.82, times: [0, 0.2, 0.58, 1], ease: cinematicEase }}
      >
        <strong>XARCON</strong>
        <span>CREATIVE</span>
      </motion.div>
    </motion.div>
  );
}
