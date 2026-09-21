import * as THREE from "three";
import { createBrandGeometry } from "./brandGeometry";
import { sampleWorldCamera, worldCameraProgress } from "./sceneMotion";

/** Project the same spatial sculpture to Canvas when hardware rendering is unavailable. */
export function mountWorldFallback(host: HTMLDivElement, reduced: boolean) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) { host.dataset.sceneState = "fallback"; return () => {}; }
  const ctx = context;
  canvas.className = "world-canvas";
  host.appendChild(canvas);
  const root = host.closest(".immersive-home") as HTMLElement;
  const geometry = createBrandGeometry(1.2, 3);
  const positions = geometry.getAttribute("position");
  const vertices = Array.from({ length: positions.count }, (_, i) => new THREE.Vector3().fromBufferAttribute(positions, i));
  const faces = Array.from({ length: positions.count / 3 }, (_, i) => {
    const a = i * 3, b = a + 1, c = a + 2;
    const center = vertices[a].clone().add(vertices[b]).add(vertices[c]).multiplyScalar(1 / 3);
    const normal = vertices[b].clone().sub(vertices[a]).cross(vertices[c].clone().sub(vertices[a])).normalize();
    return { a, b, c, center, normal, seed: (Math.sin(i * 127.1) * 43758.5453) % 1 };
  });
  const projected = vertices.map(() => new THREE.Vector3());
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 90);
  const model = new THREE.Matrix4();
  const rotation = new THREE.Euler();
  const center = new THREE.Vector3(), normal = new THREE.Vector3(), view = new THREE.Vector3();
  const blueLight = new THREE.Vector3(-.6, .5, .8).normalize();
  const greenLight = new THREE.Vector3(.8, -.2, -.6).normalize();
  const reflection = new THREE.Vector3();
  let width = 1, height = 1, start = 0, extent = 1, hero = 820;
  let progress = 0, target = 0, px = -2, py = -2, power = 0, lastPoint = 0;
  let frame = 0, previous = 0, disposed = false;
  function request() { if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(draw); }
  const scroll = () => { target = Math.max(0, Math.min(1, (window.scrollY - start - hero * .25) / extent)); request(); };
  const resize = () => {
    width = innerWidth; height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, width < 768 ? 1 : 1.25);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    start = root.getBoundingClientRect().top + scrollY;
    hero = root.querySelector(".hero")?.clientHeight || 820;
    extent = Math.max(1, root.offsetHeight - height - hero * .25); scroll();
  };
  function draw(time: number) {
    frame = 0;
    if (disposed || document.hidden) return;
    const dt = Math.min((time - previous) / 1000 || .016, .05); previous = time;
    const ease = 1 - Math.exp(-dt * 7);
    progress += (target - progress) * ease;
    const aim = !reduced && time - lastPoint < 160 ? 1 : 0;
    power += (aim - power) * ease;
    const p = reduced ? .34 : progress;
    const { angle, targetY: y, distance, shift } = sampleWorldCamera(p, width);
    camera.position.set(Math.sin(angle) * distance, y + 2, Math.cos(angle) * distance);
    camera.lookAt(0, y, 0);
    camera.setViewOffset(width, height, shift, 0, width, height);
    worldCameraProgress.set(p);
    camera.updateMatrixWorld();
    rotation.set(0, 0, -.14); model.makeRotationFromEuler(rotation);
    ctx.clearRect(0, 0, width, height);
    if (scrollY > start + hero * .35 || reduced) {
      vertices.forEach((vertex, i) => {
        projected[i].copy(vertex).applyMatrix4(model).project(camera);
        projected[i].x = (projected[i].x + 1) * width / 2;
        projected[i].y = (1 - projected[i].y) * height / 2;
      });
      const visible = faces.map(face => {
        center.copy(face.center).applyMatrix4(model);
        normal.copy(face.normal).transformDirection(model);
        view.copy(camera.position).sub(center).normalize();
        const facing = normal.dot(view);
        const diffuse = Math.max(0, normal.dot(blueLight));
        const green = Math.max(0, normal.dot(greenLight));
        reflection.copy(normal).multiplyScalar(2 * normal.dot(blueLight)).sub(blueLight);
        const specular = Math.pow(Math.max(0, reflection.dot(view)), 22);
        const rim = Math.pow(1 - Math.abs(facing), 2.5);
        return { face, depth: center.distanceToSquared(camera.position), facing, diffuse, green, specular, rim };
      }).filter(face => face.facing > -.08).sort((a, b) => b.depth - a.depth);
      for (const item of visible) {
        const { face, diffuse, green, specular, rim } = item;
        const a = projected[face.a], b = projected[face.b], c = projected[face.c];
        const x = (a.x + b.x + c.x) / 3, y = (a.y + b.y + c.y) / 3;
        if (x < -150 || x > width + 150 || y < -150 || y > height + 150) continue;
        const field = Math.exp(-Math.hypot(x - px, y - py) / (height * .1)) * power;
        const seed = Math.abs(face.seed);
        if (seed < field * .78) {
          ctx.fillStyle = `rgba(181,236,218,${field * .8})`;
          const drift = field * 60 * seed;
          ctx.fillRect(x + Math.sin(seed * 40) * drift, y + Math.cos(seed * 25) * drift, 1.4, 1.4);
          continue;
        }
        const red = Math.round(27 + diffuse * 87 + green * 40 + specular * 100 + rim * 43);
        const g = Math.round(51 + diffuse * 100 + green * 60 + specular * 90 + rim * 60);
        const blue = Math.round(68 + diffuse * 108 + green * 43 + specular * 80 + rim * 76);
        ctx.fillStyle = `rgb(${red},${g},${blue})`; ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = .65;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(c.x, c.y); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      ctx.fillStyle = "#a5d6d44d";
      for (let i = 0; i < 120; i++) {
        const radius = 4 + Math.sin(i * 3.1) * 2;
        center.set(Math.cos(i * 2.39996) * radius, (i / 120 - .5) * 19, Math.sin(i * 2.39996) * radius).project(camera);
        if (center.z < 1) ctx.fillRect((center.x + 1) * width / 2, (1 - center.y) * height / 2, 1.2, 1.2);
      }
    }
    host.dataset.cameraStep = String(Math.round(progress * 100));
    if (!reduced && (Math.abs(target - progress) > .0001 || aim || power > .003)) request();
  }
  const point = (x: number, y: number) => { if (!reduced) { px = x; py = y; lastPoint = performance.now(); request(); } };
  const pointer = (e: PointerEvent) => point(e.clientX, e.clientY);
  const touch = (e: TouchEvent) => { const finger = e.touches[0]; if (finger) point(finger.clientX, finger.clientY); };
  const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else request(); };
  const observer = new ResizeObserver(resize); observer.observe(root);
  window.addEventListener("resize", resize, { passive: true }); window.addEventListener("scroll", scroll, { passive: true });
  root.addEventListener("pointermove", pointer, { passive: true }); root.addEventListener("pointerdown", pointer, { passive: true }); root.addEventListener("touchmove", touch, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  resize(); host.dataset.sceneState = "ready"; host.dataset.renderer = "canvas";
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect(); geometry.dispose(); canvas.remove();
    window.removeEventListener("resize", resize); window.removeEventListener("scroll", scroll);
    root.removeEventListener("pointermove", pointer); root.removeEventListener("pointerdown", pointer); root.removeEventListener("touchmove", touch);
    document.removeEventListener("visibilitychange", visibility);
  };
}
