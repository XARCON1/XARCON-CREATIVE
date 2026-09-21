import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
const rows = [
  ["esc", "", "", "", "", "", "", "", "", "", "", "", "", "◯"],
  ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "−", "+", "⌫"],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "|"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "return"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "shift"],
  ["fn", "ctrl", "opt", "cmd", "space", "cmd", "opt", "←", "↑", "→"],
];
export default function Laptop({ paused, active }: { paused: boolean; active: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (paused || reduced || !active) element.pause();
    else void element.play().catch(() => { element.dataset.videoState = "poster"; });
  }, [paused, reduced, active]);
  return (
    <div className="laptop-arrival">
      <div className="laptop laptop-crafted">
        <div className="laptop-lid">
          <span className="laptop-camera" />
          <div className="laptop-display">
            <div className="laptop-film">
              <video ref={video} muted loop playsInline preload="metadata" poster="/media/xarcon-future-poster.webp"
                onPlaying={event => { event.currentTarget.dataset.videoState = "playing"; }}
                onPause={event => { event.currentTarget.dataset.videoState = "paused"; }}>
                <source src="/media/xarcon-future.mp4" type="video/mp4" />
              </video>
              <div className="laptop-film-brand"><span>XARCON</span><i>CREATIVE / MOTION LAB</i></div>
              <div className="laptop-film-caption"><span>El futuro<br />toma forma.</span><small>DISEÑO × TECNOLOGÍA</small></div>
            </div>
          </div>
          <span className="laptop-screen-label">XARCON / CREATIVE</span>
        </div>
        <div className="laptop-deck">
          <div className="laptop-hinge" />
          <div className="laptop-speaker speaker-left" />
          <div className="laptop-speaker speaker-right" />
          <div className="laptop-keys">
            {rows.map((row, r) => (
              <div className={`keyboard-row row-${r}`} key={r}>
                {row.map((key, i) => (
                  <span
                    key={i}
                    className={
                      key === "space"
                        ? "key-space"
                        : key.length > 2
                          ? "key-wide"
                          : ""
                    }
                  >
                    {key === "space" ? "" : key}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="laptop-trackpad" />
          <div className="laptop-front">
            <i />
            <span />
          </div>
          <div className="laptop-port port-one" />
          <div className="laptop-port port-two" />
        </div>
      </div>
    </div>
  );
}
