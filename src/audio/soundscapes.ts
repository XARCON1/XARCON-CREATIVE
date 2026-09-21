/** Two original, continuously arranged ambient compositions. No external audio. */
const scores = [
  { bpm: 72, chords: [[40, 52, 55, 59, 66], [36, 48, 52, 55, 62], [43, 55, 59, 62, 69], [38, 50, 54, 57, 64]], cutoff: 1600, step: 2 },
  { bpm: 56, chords: [[38, 50, 54, 61, 64], [35, 47, 50, 54, 64], [31, 43, 47, 54, 59], [33, 45, 49, 52, 59]], cutoff: 1000, step: 4 },
];
type Arrangement = { gain: GainNode; beat: number; next: number; index: number };
const frequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

export class SoundscapeEngine {
  private output: GainNode;
  private bus: DynamicsCompressorNode;
  private reverb: ConvolverNode;
  private wet: GainNode;
  private wave: PeriodicWave;
  private arrangement?: Arrangement;
  private timer?: ReturnType<typeof setInterval>;
  private pauseTimer?: ReturnType<typeof setTimeout>;
  private retireTimers = new Set<ReturnType<typeof setTimeout>>();
  private voices = new Set<OscillatorNode>();
  private playing = false;
  private disposed = false;
  private volume: number;

  constructor(private context: AudioContext, volume: number, private onState: (playing: boolean) => void) {
    this.volume = volume;
    this.bus = context.createDynamicsCompressor();
    this.bus.threshold.value = -21;
    this.bus.knee.value = 16;
    this.bus.ratio.value = 2.5;
    this.output = context.createGain();
    this.output.gain.value = 0;
    this.bus.connect(this.output).connect(context.destination);
    this.wave = context.createPeriodicWave(new Float32Array(6), new Float32Array([0, 1, 0.24, 0.1, 0.035, 0.012]));
    this.reverb = context.createConvolver();
    const impulse = context.createBuffer(2, context.sampleRate * 3.2, context.sampleRate);
    // A seeded stereo impulse keeps the timbre consistent across visits.
    let seed = 48271;
    for (let channel = 0; channel < 2; channel++) {
      const samples = impulse.getChannelData(channel);
      let previous = 0;
      for (let i = 0; i < samples.length; i++) {
        seed = (seed * 16807) % 2147483647;
        previous = previous * 0.65 + (seed / 2147483647 * 2 - 1) * 0.35;
        samples[i] = previous * (1 - i / samples.length) ** 2.7;
      }
    }
    this.reverb.buffer = impulse;
    this.wet = context.createGain();
    this.wet.gain.value = 0.32;
    this.reverb.connect(this.wet).connect(this.bus);
    context.addEventListener("statechange", this.reportState);
  }

  private reportState = () => this.onState(this.playing && this.context.state === "running");

  async play(index: number) {
    if (this.disposed) return;
    clearTimeout(this.pauseTimer);
    await this.context.resume();
    if (this.disposed) return;
    if (!this.arrangement || this.arrangement.index !== index) {
      const now = this.context.currentTime;
      const old = this.arrangement;
      if (old) {
        old.gain.gain.cancelAndHoldAtTime(now);
        old.gain.gain.linearRampToValueAtTime(0, now + 1.2);
        const timer = setTimeout(() => { old.gain.disconnect(); this.retireTimers.delete(timer); }, 1500);
        this.retireTimers.add(timer);
      }
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(1, now + 1.8);
      gain.connect(this.bus);
      gain.connect(this.reverb);
      this.arrangement = { gain, beat: 0, next: now + 0.06, index };
    }
    this.playing = true;
    this.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.output.gain.setTargetAtTime(this.volume * 0.8, this.context.currentTime, 0.2);
    this.schedule();
    if (!this.timer) this.timer = setInterval(() => this.schedule(), 100);
    this.reportState();
  }

  pause() {
    this.playing = false;
    clearInterval(this.timer);
    this.timer = undefined;
    clearTimeout(this.pauseTimer);
    this.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.output.gain.setTargetAtTime(0, this.context.currentTime, 0.04);
    this.pauseTimer = setTimeout(() => { if (!this.disposed && !this.playing) void this.context.suspend(); }, 200);
    this.reportState();
  }

  setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.playing) this.output.gain.setTargetAtTime(this.volume * 0.8, this.context.currentTime, 0.08);
  }

  private schedule() {
    const arrangement = this.arrangement;
    if (!arrangement || !this.playing || this.context.state !== "running") return;
    const score = scores[arrangement.index];
    const beatLength = 60 / score.bpm;
    // Skip elapsed beats after OS interruption; never burst a backlog of notes.
    if (arrangement.next < this.context.currentTime - beatLength) arrangement.next = this.context.currentTime + 0.05;
    while (arrangement.next < this.context.currentTime + 0.35) {
      const { beat, next: time, gain, index } = arrangement;
      const chord = score.chords[Math.floor(beat / 8) % score.chords.length];
      if (beat % 8 === 0) {
        chord.forEach((note, i) => this.note(note, time, beatLength * 9.5, 0.052, gain, score.cutoff, (i - 2) * 0.28, true));
      }
      if (beat % score.step === 0) {
        const sequence = [2, 4, 3, 1, 4, 2, 3, 4];
        const tone = chord[sequence[Math.floor(beat / score.step) % sequence.length]] + 12;
        this.note(tone, time, beatLength * 3.6, index ? 0.062 : 0.046, gain, 3200, Math.sin(beat * 0.8) * 0.65, false);
      }
      if (index === 0 && beat % 4 === 0) this.note(chord[0] - 12, time, beatLength * 2.5, 0.095, gain, 300, 0, false);
      arrangement.beat++;
      arrangement.next += beatLength;
    }
  }

  private note(midi: number, time: number, duration: number, level: number, destination: GainNode, cutoff: number, pan: number, pad: boolean) {
    const ctx = this.context;
    const envelope = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const stereo = ctx.createStereoPanner();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, time);
    filter.frequency.exponentialRampToValueAtTime(cutoff * 0.55, time + duration);
    filter.Q.value = 0.35;
    stereo.pan.value = pan;
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(level, time + (pad ? 1.8 : 0.035));
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    filter.connect(envelope).connect(stereo).connect(destination);
    const count = pad ? 2 : 1;
    let ended = 0;
    for (let i = 0; i < count; i++) {
      const oscillator = ctx.createOscillator();
      if (pad) oscillator.setPeriodicWave(this.wave);
      else oscillator.type = "sine";
      oscillator.frequency.value = frequency(midi);
      oscillator.detune.value = pad ? (i ? 3 : -3) : 0;
      oscillator.connect(filter);
      this.voices.add(oscillator);
      oscillator.onended = () => {
        oscillator.disconnect();
        this.voices.delete(oscillator);
        if (++ended === count) { filter.disconnect(); envelope.disconnect(); stereo.disconnect(); }
      };
      oscillator.start(time);
      oscillator.stop(time + duration + 0.05);
    }
  }

  dispose() {
    this.disposed = true;
    clearInterval(this.timer);
    clearTimeout(this.pauseTimer);
    this.retireTimers.forEach(clearTimeout);
    this.context.removeEventListener("statechange", this.reportState);
    this.voices.forEach(voice => { try { voice.stop(); } catch { /* already ended */ } });
    this.voices.clear();
    this.arrangement?.gain.disconnect();
    this.reverb.disconnect();
    this.wet.disconnect();
    this.bus.disconnect();
    this.output.disconnect();
    void this.context.close();
  }
}
