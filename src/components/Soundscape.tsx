import { useEffect, useRef, useState } from "react";
import { Check, ChevronUp, Headphones, Pause, Play, VolumeX, X } from "lucide-react";
import type { SoundscapeEngine } from "../audio/soundscapes";
import { tracks } from "../audio/tracks";
import "../styles/soundscape.css";

export default function Soundscape() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [track, setTrack] = useState(0);
  const [volume, setVolume] = useState(35);
  const [error, setError] = useState("");
  const engine = useRef<SoundscapeEngine | null>(null);
  const context = useRef<AudioContext | null>(null);
  const working = useRef(false);
  const mounted = useRef(true);
  const root = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    mounted.current = true;
    const onHidden = () => { if (document.hidden) engine.current?.pause(); };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      mounted.current = false;
      document.removeEventListener("visibilitychange", onHidden);
      if (engine.current) engine.current.dispose();
      else if (context.current) void context.current.close();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  async function start(index: number) {
    if (working.current) return;
    working.current = true;
    setBusy(true);
    setError("");
    try {
      if (!engine.current) {
        // Unlock synchronously from the tap, including on iOS, before loading synthesis code.
        const audioContext = context.current ?? new AudioContext();
        context.current = audioContext;
        const unlocked = audioContext.resume();
        const { SoundscapeEngine } = await import("../audio/soundscapes");
        await unlocked;
        if (!mounted.current) return;
        engine.current = new SoundscapeEngine(audioContext, volume / 100, value => { if (mounted.current) setPlaying(value); });
      }
      await engine.current.play(index);
      if (mounted.current) setTrack(index);
    } catch {
      if (mounted.current) { setError("No se pudo iniciar el sonido. Intenta de nuevo."); setPlaying(false); setOpen(true); }
    } finally {
      working.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  return <div ref={root} className={`soundscape ${playing ? "is-playing" : ""}`}>
    {open && <section id="soundscape-panel" className="soundscape-panel" aria-label="Ambiente sonoro">
      <div className="soundscape-heading"><span><Headphones size={15} /> AMBIENTE SONORO</span><button aria-label="Cerrar opciones de música" onClick={() => { setOpen(false); toggle.current?.focus(); }}><X size={16} /></button></div>
      <p>Una dimensión más para explorar.</p>
      <div className="soundscape-tracks">
        {tracks.map((item, i) => <button key={item.name} aria-pressed={track === i} disabled={busy} onClick={() => void start(i)}>
          <span className="track-number">0{i + 1}</span><span><strong>{item.name}</strong><small>{item.mood}</small></span>{track === i ? <Check size={15} /> : <Play size={14} />}
        </button>)}
      </div>
      <label className="soundscape-volume"><span>Volumen</span><input aria-label="Volumen de la música" type="range" min="0" max="100" value={volume} onChange={event => { const value = Number(event.target.value); setVolume(value); engine.current?.setVolume(value / 100); }} /><output>{volume}%</output></label>
      <div className="soundscape-foot"><span>COMPOSICIONES ORIGINALES / XARCON</span><button disabled={busy} aria-label={playing ? "Pausar ambiente" : "Reproducir ambiente"} onClick={() => playing ? engine.current?.pause() : void start(track)}>{playing ? <Pause size={14} /> : <Play size={14} />}</button></div>
      {error && <p role="alert" className="soundscape-error">{error}</p>}
    </section>}
    <div className="soundscape-dock">
      <button className="soundscape-play" aria-label={playing ? "Pausar música" : "Activar música"} aria-pressed={playing} disabled={busy} onClick={() => playing ? engine.current?.pause() : void start(track)}>
        {playing && volume > 0 ? <span className="soundscape-bars" aria-hidden="true"><i /><i /><i /><i /></span> : <VolumeX size={15} />}
        <span>{busy ? "Cargando…" : playing ? tracks[track].name : "Activar sonido"}</span>
      </button>
      <button ref={toggle} className="soundscape-toggle" aria-label="Elegir música" aria-expanded={open} aria-controls="soundscape-panel" onClick={() => setOpen(value => !value)}><ChevronUp size={16} style={{ rotate: open ? "180deg" : undefined }} /></button>
    </div>
    <span className="soundscape-status" role="status">{playing ? `Sonando: ${tracks[track].name}` : "Música en pausa"}</span>
  </div>;
}
