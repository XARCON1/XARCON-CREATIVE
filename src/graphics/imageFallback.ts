/** Local image displacement for browsers without WebGL. Never intercepts scrolling. */
export function mountImageFallback(img: HTMLImageElement, canvas: HTMLCanvasElement, ready: (value: boolean) => void) {
  const ctx = canvas.getContext("2d");
  const surface = img.parentElement;
  if (!ctx || !surface) return;
  const original = document.createElement("canvas");
  const source = original.getContext("2d")!;
  let width = 0, height = 0, power = 0, target = 0, px = .5, py = .5, tx = .5, ty = .5;
  let frame = 0, visible = false, loaded = false, disposed = false, lastTouch = 0;
  const request = () => { if (!frame && !disposed && visible) frame = requestAnimationFrame(draw); };
  function draw(time: number) {
    frame = 0;
    if (!loaded || !visible || disposed || document.hidden) return;
    if (lastTouch && time - lastTouch > 180) target = 0;
    power += (target - power) * .13; px += (tx - px) * .2; py += (ty - py) * .2;
    ctx!.clearRect(0, 0, width, height); ctx!.drawImage(original, 0, 0);
    if (power > .004) {
      const radius = Math.min(width, height) * .46, cell = 7;
      for (let y = Math.max(0, Math.floor((py - radius) / cell) * cell); y < Math.min(height, py + radius); y += cell) {
        for (let x = Math.max(0, Math.floor((px - radius) / cell) * cell); x < Math.min(width, px + radius); x += cell) {
          const distance = Math.hypot(x - px, y - py) / radius;
          if (distance >= 1) continue;
          const field = (1 - distance) ** 2 * power;
          const seed = Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
          const dx = Math.sin(distance * 24 - time * .004 + seed * 6) * field * 26;
          const dy = Math.cos(seed * 28 + time * .002) * field * 18;
          ctx!.clearRect(x, y, cell, cell);
          ctx!.globalAlpha = 1 - field * (seed < .5 ? .88 : .35);
          const sw = Math.min(cell, width - x), sh = Math.min(cell, height - y);
          ctx!.drawImage(original, x, y, sw, sh, x + dx, y + dy, sw + .5, sh + .5);
          if (seed < field * .45) { ctx!.fillStyle = "#c9ffa6"; ctx!.fillRect(x + dx * 1.6, y + dy * 1.6, 1.3, 1.3); }
        }
      }
      ctx!.globalAlpha = 1;
    }
    if (target > .01 || power > .003) request();
  }
  const resize = () => {
    width = img.clientWidth; height = img.clientHeight;
    if (!width || !height || !img.complete || !img.naturalWidth) return;
    canvas.width = original.width = width; canvas.height = original.height = height;
    const ratio = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const w = img.naturalWidth * ratio, h = img.naturalHeight * ratio;
    source.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
    ctx.drawImage(original, 0, 0); loaded = true; ready(true); request();
  };
  const point = (x: number, y: number, touch = false) => {
    const rect = surface.getBoundingClientRect(); tx = x - rect.left; ty = y - rect.top;
    target = 1; lastTouch = touch ? performance.now() : 0; request();
  };
  const pointer = (e: PointerEvent) => point(e.clientX, e.clientY, e.pointerType !== "mouse");
  const touch = (e: TouchEvent) => { const finger = e.touches[0]; if (finger) point(finger.clientX, finger.clientY, true); };
  const leave = () => { target = 0; request(); };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { resize(); request(); } else { cancelAnimationFrame(frame); frame = 0; power = 0; target = 0; }
  }, { rootMargin: "100px" });
  const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(img); observer.observe(surface);
  img.addEventListener("load", resize);
  surface.addEventListener("pointermove", pointer, { passive: true }); surface.addEventListener("pointerdown", pointer, { passive: true });
  surface.addEventListener("pointerleave", leave); surface.addEventListener("pointercancel", leave);
  surface.addEventListener("touchmove", touch, { passive: true }); surface.addEventListener("touchend", leave, { passive: true });
  resize();
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect(); sizeObserver.disconnect();
    img.removeEventListener("load", resize); surface.removeEventListener("pointermove", pointer); surface.removeEventListener("pointerdown", pointer);
    surface.removeEventListener("pointerleave", leave); surface.removeEventListener("pointercancel", leave);
    surface.removeEventListener("touchmove", touch); surface.removeEventListener("touchend", leave);
  };
}
