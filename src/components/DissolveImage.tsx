import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { useReducedMotion } from "framer-motion";

const vertex = `attribute vec2 aPosition; varying vec2 vUv;
void main(){vUv=(aPosition+1.0)*.5;gl_Position=vec4(aPosition,0.,1.);}`;
const fragment = `precision highp float;
varying vec2 vUv;
uniform sampler2D uImage; uniform vec2 uSize; uniform vec2 uImageSize;
uniform vec2 uPoint; uniform float uStrength; uniform float uTime;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 cover(vec2 uv){
 float screen=uSize.x/uSize.y;float source=uImageSize.x/uImageSize.y;
 vec2 ratio=vec2(min(screen/source,1.),min(source/screen,1.));
 return (uv-.5)*ratio+.5;
}
void main(){
 vec2 delta=(vUv-uPoint)*vec2(uSize.x/uSize.y,1.);
 float distanceToPoint=length(delta);
 float field=(1.-smoothstep(.02,.44,distanceToPoint))*uStrength;
 vec2 cell=floor(vUv*uSize/5.);
 float grain=hash(cell);
 float wave=sin(distanceToPoint*34.-uTime*4.)*field*.026;
 vec2 drift=vec2(sin(grain*35.+uTime),cos(grain*24.-uTime*.7))*field*.026;
 vec2 uv=cover(vUv+normalize(delta+vec2(.0001))*wave+drift);
 vec4 color=texture2D(uImage,uv);
 color.r=texture2D(uImage,uv+vec2(field*.009,0.)).r;
 color.b=texture2D(uImage,uv-vec2(field*.007,0.)).b;
 float fracture=smoothstep(field*.62,field*.62+.065,grain);
 float edge=(1.-fracture)*field;
 vec3 tint=mix(vec3(.46,.77,.92),vec3(.77,1.,.61),grain);
 color.rgb=mix(color.rgb,tint,edge*.7);
 float alpha=mix(1.,fracture,field*.95);
 gl_FragColor=vec4(color.rgb*alpha,alpha);
}`;

/** Native image first; a local GPU surface enhances it when visible. */
export default function DissolveImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const img = imageRef.current, canvas = canvasRef.current;
    const surface = img?.parentElement;
    if (!img || !canvas || !surface || reduced) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
    if (!gl) return;
    let frame = 0, visible = false, loaded = false, disposed = false;
    let width = 1, height = 1, strength = 0, target = 0;
    let px = .5, py = .5, tx = .5, ty = .5, lastTouch = 0;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, code: string) => {
      const shader = gl.createShader(type)!; shaders.push(shader);
      gl.shaderSource(shader, code); gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("Image shader unavailable");
      return shader;
    };
    const program = gl.createProgram()!;
    let buffer: WebGLBuffer | null = null, texture: WebGLTexture | null = null;
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Image program unavailable");
      gl.useProgram(program);
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, "aPosition");
      gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    } catch {
      shaders.forEach(shader => gl.deleteShader(shader)); gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer); if (texture) gl.deleteTexture(texture);
      return;
    }
    const uniform = Object.fromEntries(["uImage","uSize","uImageSize","uPoint","uStrength","uTime"].map(name => [name, gl.getUniformLocation(program, name)]));
    const draw = (now: number) => {
      frame = 0;
      if (disposed || !visible || !loaded || document.hidden) return;
      if (lastTouch && now - lastTouch > 180) target = 0;
      strength += (target - strength) * .115;
      px += (tx - px) * .2; py += (ty - py) * .2;
      gl.useProgram(program);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniform.uSize, width, height);
      gl.uniform2f(uniform.uImageSize, img.naturalWidth, img.naturalHeight);
      gl.uniform2f(uniform.uPoint, px, py);
      gl.uniform1f(uniform.uStrength, strength);
      gl.uniform1f(uniform.uTime, now / 1000);
      gl.uniform1i(uniform.uImage, 0);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (target > .01 || strength > .003) frame = requestAnimationFrame(draw);
    };
    const request = () => { if (!frame && !disposed) frame = requestAnimationFrame(draw); };
    const resize = () => {
      width = img.clientWidth; height = img.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      request();
    };
    const load = () => {
      if (!img.complete || !img.naturalWidth || disposed) return;
      try {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        loaded = true; resize();
        // Render a complete frame before replacing the original photograph.
        const wasVisible = visible; visible = true; draw(performance.now()); visible = wasVisible;
        setReady(true);
      } catch { setReady(false); }
    };
    const locate = (x: number, y: number, touch = false) => {
      const rect = surface.getBoundingClientRect();
      tx = (x - rect.left) / rect.width; ty = 1 - (y - rect.top) / rect.height;
      target = 1; lastTouch = touch ? performance.now() : 0; request();
    };
    const pointer = (e: PointerEvent) => locate(e.clientX, e.clientY, e.pointerType !== "mouse");
    const touch = (e: TouchEvent) => { const finger = e.touches[0]; if (finger) locate(finger.clientX, finger.clientY, true); };
    const leave = () => { target = 0; request(); };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) { load(); request(); } else { cancelAnimationFrame(frame); frame = 0; strength = 0; target = 0; }
    }, { rootMargin: "100px" });
    const sizeObserver = new ResizeObserver(resize);
    observer.observe(surface); sizeObserver.observe(img);
    img.addEventListener("load", load);
    surface.addEventListener("pointermove", pointer, { passive: true });
    surface.addEventListener("pointerdown", pointer, { passive: true });
    surface.addEventListener("pointerleave", leave);
    surface.addEventListener("pointercancel", leave);
    surface.addEventListener("touchmove", touch, { passive: true });
    surface.addEventListener("touchend", leave, { passive: true });
    const lost = () => { setReady(false); loaded = false; cancelAnimationFrame(frame); };
    canvas.addEventListener("webglcontextlost", lost);
    load();
    return () => {
      disposed = true; cancelAnimationFrame(frame); observer.disconnect(); sizeObserver.disconnect();
      img.removeEventListener("load", load); surface.removeEventListener("pointermove", pointer);
      surface.removeEventListener("pointerdown", pointer); surface.removeEventListener("pointerleave", leave);
      surface.removeEventListener("pointercancel", leave); surface.removeEventListener("touchmove", touch); surface.removeEventListener("touchend", leave);
      canvas.removeEventListener("webglcontextlost", lost);
      gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program); shaders.forEach(shader => gl.deleteShader(shader));
    };
  }, [props.src, reduced]);
  return <>
    <img {...props} ref={imageRef} data-dissolve-ready={ready && !reduced ? "true" : "false"} />
    <canvas ref={canvasRef} className={`dissolve-layer ${ready && !reduced ? "is-ready" : ""}`} aria-hidden="true" />
  </>;
}
