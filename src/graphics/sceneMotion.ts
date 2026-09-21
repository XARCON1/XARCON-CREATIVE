import { motionValue } from "framer-motion";

// Written by the renderer after camera easing, then read by the DOM cards.
// WebGL and Canvas use precisely the same camera and projection.
export const worldCameraProgress = motionValue(0);
export const cameraFieldOfView = 42;
export function sampleWorldCamera(progress: number, width: number) {
  return {
    angle: progress * Math.PI * 2.1 + 0.45,
    targetY: 4.8 - progress * 9.6,
    distance: width < 768 ? 15.8 : 12.2,
    shift: width * (width < 768 ? 0.14 : 0.075) * Math.sin(progress * Math.PI * 3 + 0.8),
  };
}

export function projectOrbitCard(progress: number, entry: number, index: number, width: number, height: number) {
  const camera = sampleWorldCamera(progress, width);
  // Three points on one helix around the sculpture's vertical axis.
  const phase = [0.10, 1.52, 2.94][index];
  const delta = phase - camera.angle;
  const radius = Math.min(4.15, width / height * 2.3);
  const lift = [0.45, 0.20, 0.25][index];
  const pitch = Math.atan2(2, camera.distance);
  const depth = Math.hypot(camera.distance, 2) - radius * Math.cos(delta) * Math.cos(pitch) - lift * Math.sin(pitch);
  const focal = height / (2 * Math.tan(cameraFieldOfView * Math.PI / 360));
  const reveal = Math.max(0, Math.min(1, (entry + 0.22 - index * 0.1) / 0.28));
  return {
    x: radius * Math.sin(delta) * focal / depth - camera.shift,
    y: -(lift * Math.cos(pitch) - radius * Math.cos(delta) * Math.sin(pitch)) * focal / depth + height * 0.105 + (1 - reveal) * 80,
    scale: Math.min(1.08, 10.1 / depth) * (0.88 + reveal * 0.12),
    rotateY: -Math.sin(delta) * 27,
    rotateZ: -Math.sin(delta) * 4,
    opacity: (index === 2 ? Math.min(1, entry * 5) : 1) * (Math.cos(delta) < -0.2 ? 0.72 : 1),
    zIndex: Math.round(1000 - depth * 25),
  };
}
