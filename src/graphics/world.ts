import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mountWorldFallback } from "./worldFallback";
import { createBrandGeometry } from "./brandGeometry";

export function mountWorld(host: HTMLDivElement, reduced: boolean) {
  const surface = document.createElement("canvas");
  const context = surface.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "low-power" });
  if (!context) return mountWorldFallback(host, reduced);
  const renderer = new THREE.WebGLRenderer({ canvas: surface, context, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0x06141f, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  const canvas = renderer.domElement;
  canvas.className = "world-canvas";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 90);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();

  const sculpture = new THREE.Group();
  scene.add(sculpture);
  const geometry = createBrandGeometry();
  const uniforms = {
    uPointer: { value: new THREE.Vector2(4, 4) },
    uStrength: { value: 0 },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  };
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xa7c6ce, metalness: 0.96, roughness: 0.22,
    clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 1.5,
    iridescence: 0.5, iridescenceIOR: 1.35,
  });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.fragmentShader = `uniform vec2 uPointer; uniform float uStrength; uniform float uTime; uniform vec2 uResolution;\n${shader.fragmentShader}`;
    shader.fragmentShader = shader.fragmentShader.replace("#include <dithering_fragment>", `
      #include <dithering_fragment>
      vec2 at = gl_FragCoord.xy / uResolution * 2.0 - 1.0;
      float field = exp(-length((at-uPointer)*vec2(uResolution.x/uResolution.y,1.0))*5.0)*uStrength;
      vec2 cell=floor(gl_FragCoord.xy/3.0);
      float grain=fract(sin(dot(cell,vec2(127.1,311.7)))*43758.5453);
      if(grain<field*.78) discard;
      gl_FragColor.rgb += vec3(.10,.30,.23)*field;
    `);
  };
  const body = new THREE.Mesh(geometry, material);
  sculpture.add(body);

  const dustMaterial = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      uniform vec2 uPointer; uniform float uStrength; uniform float uTime; uniform vec2 uResolution;
      varying float vAlpha; varying float vColor;
      void main(){
        vec4 p=projectionMatrix*modelViewMatrix*vec4(position,1.0);
        vec2 screen=p.xy/p.w;
        float field=exp(-length((screen-uPointer)*vec2(uResolution.x/uResolution.y,1.0))*4.0)*uStrength;
        float seed=fract(sin(dot(position,vec3(12.9,78.2,34.4)))*43758.5453);
        vec3 scatter=normal*(.3+seed*.9)*field;
        scatter.y+=sin(seed*40.0+uTime*1.5)*field*.25;
        p=projectionMatrix*modelViewMatrix*vec4(position+scatter,1.0);
        gl_Position=p; gl_PointSize=(1.5+seed*2.5)*field;
        vAlpha=field*.85; vColor=seed;
      }`,
    fragmentShader: `varying float vAlpha; varying float vColor;
      void main(){float d=length(gl_PointCoord-.5);if(d>.5||vAlpha<.02)discard;
        gl_FragColor=vec4(mix(vec3(.52,.78,1.),vec3(.78,1.,.59),vColor),vAlpha*(1.-smoothstep(.15,.5,d)));}`,
  });
  sculpture.add(new THREE.Points(geometry, dustMaterial));

  const orbitGeometry = new THREE.TorusGeometry(4.1, 0.016, 6, 160);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x80dcbf, transparent: true, opacity: 0.2 });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.set(1.15, 0.35, 0.3);
  sculpture.add(orbit);
  const secondOrbit = orbit.clone();
  secondOrbit.rotation.set(-0.65, 1.1, -0.8);
  secondOrbit.scale.setScalar(1.18);
  sculpture.add(secondOrbit);

  const motePositions = new Float32Array(300 * 3);
  for (let i = 0; i < 300; i++) {
    const angle = i * 2.39996;
    const radius = 4 + Math.sin(i * 3.1) * 2;
    motePositions[i * 3] = Math.cos(angle) * radius;
    motePositions[i * 3 + 1] = (i / 300 - 0.5) * 19;
    motePositions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  const moteGeometry = new THREE.BufferGeometry();
  moteGeometry.setAttribute("position", new THREE.BufferAttribute(motePositions, 3));
  const moteMaterial = new THREE.PointsMaterial({ color: 0xa6d7d4, size: 0.021, transparent: true, opacity: 0.38, depthWrite: false });
  scene.add(new THREE.Points(moteGeometry, moteMaterial));
  scene.add(new THREE.HemisphereLight(0xd3e9ff, 0x071827, 1.8));
  const blue = new THREE.DirectionalLight(0x71baff, 3.3);
  blue.position.set(-6, 4, 5); scene.add(blue);
  const green = new THREE.DirectionalLight(0xc9ff9b, 2.5);
  green.position.set(5, -3, -2); scene.add(green);

  const root = host.closest(".immersive-home") as HTMLElement;
  let width = 1, height = 1, start = 0, extent = 1, heroHeight = 820;
  let targetProgress = 0, progress = 0, lastStep = -1;
  let pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0;
  let strengthTarget = 0, lastInteraction = 0, frame = 0, lastTime = 0;
  let disposed = false, contextLost = false;
  function request() {
    if (!frame && !disposed && !contextLost && !document.hidden) frame = requestAnimationFrame(render);
  }
  const refreshScroll = () => {
    targetProgress = Math.max(0, Math.min(1, (window.scrollY - start - heroHeight * 0.25) / extent));
    request();
  };
  const resize = () => {
    width = window.innerWidth; height = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, width < 768 ? 1 : 1.4));
    renderer.setSize(width, height);
    uniforms.uResolution.value.set(canvas.width, canvas.height);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    start = root.getBoundingClientRect().top + window.scrollY;
    heroHeight = root.querySelector(".hero")?.clientHeight || 820;
    extent = Math.max(1, root.offsetHeight - height - heroHeight * 0.25);
    refreshScroll();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(root);
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", refreshScroll, { passive: true });
  const point = (x: number, y: number) => {
    if (reduced) return;
    pointerX = x / width * 2 - 1; pointerY = -(y / height) * 2 + 1;
    strengthTarget = 1; lastInteraction = performance.now();
    request();
  };
  const pointer = (event: PointerEvent) => point(event.clientX, event.clientY);
  const touch = (event: TouchEvent) => {
    const finger = event.touches[0]; if (finger) point(finger.clientX, finger.clientY);
  };
  root.addEventListener("pointermove", pointer, { passive: true });
  root.addEventListener("pointerdown", pointer, { passive: true });
  root.addEventListener("touchmove", touch, { passive: true });

  const render = (time: number) => {
    frame = 0;
    if (disposed || document.hidden || contextLost) { frame = 0; return; }
    const dt = Math.min((time - lastTime) / 1000 || 0.016, 0.05); lastTime = time;
    const ease = 1 - Math.exp(-dt * 7);
    progress += (targetProgress - progress) * ease;
    smoothX += (pointerX - smoothX) * ease; smoothY += (pointerY - smoothY) * ease;
    if (time - lastInteraction > 160) strengthTarget = 0;
    uniforms.uStrength.value += (strengthTarget - uniforms.uStrength.value) * ease;
    uniforms.uPointer.value.set(smoothX, smoothY);
    uniforms.uTime.value = time / 1000;
    const p = reduced ? 0.34 : progress;
    const angle = p * Math.PI * 2.1 + 0.45;
    const targetY = 4.8 - p * 9.6;
    const distance = width < 768 ? 15.8 : 12.2;
    camera.position.set(Math.sin(angle) * distance, targetY + 2, Math.cos(angle) * distance);
    camera.lookAt(0, targetY, 0);
    camera.setViewOffset(width, height, width * (width < 768 ? 0.23 : 0.26) * Math.sin(p * Math.PI * 3 + 0.8), 0, width, height);
    sculpture.rotation.y = reduced ? 0 : smoothX * 0.10;
    sculpture.rotation.z = -0.14 + (reduced ? 0 : smoothY * 0.035);
    const step = Math.round(progress * 100);
    if (step !== lastStep) { host.dataset.cameraStep = String(step); lastStep = step; }
    // The photograph covers the first view. Avoid rendering hidden 3D frames there.
    if (window.scrollY > start + heroHeight * 0.35 || reduced) renderer.render(scene, camera);
    if (!reduced && (Math.abs(targetProgress - progress) > .0001 || strengthTarget > .01 || uniforms.uStrength.value > .003 || Math.abs(pointerX - smoothX) + Math.abs(pointerY - smoothY) > .001)) request();
  };
  const visibility = () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else if (!frame) { lastTime = performance.now(); frame = requestAnimationFrame(render); }
  };
  const lost = (event: Event) => {
    event.preventDefault(); contextLost = true; host.dataset.sceneState = "fallback";
    cancelAnimationFrame(frame); frame = 0;
  };
  const restored = () => { contextLost = false; host.dataset.sceneState = "ready"; visibility(); };
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", restored);
  document.addEventListener("visibilitychange", visibility);
  resize(); host.dataset.sceneState = "ready"; host.dataset.renderer = "webgl";
  request();
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    window.removeEventListener("resize", resize); window.removeEventListener("scroll", refreshScroll);
    root.removeEventListener("pointermove", pointer); root.removeEventListener("pointerdown", pointer); root.removeEventListener("touchmove", touch);
    document.removeEventListener("visibilitychange", visibility);
    canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restored);
    geometry.dispose(); material.dispose(); dustMaterial.dispose(); orbitGeometry.dispose(); orbitMaterial.dispose();
    moteGeometry.dispose(); moteMaterial.dispose(); environment.dispose(); renderer.dispose(); canvas.remove();
  };
}
