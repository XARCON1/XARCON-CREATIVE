import { tracks } from "./tracks";

/** Original electronic scores: sixteenth-note arrangements, drums, bass and stereo synths. */
type Arrangement = { gain: GainNode; send: GainNode; pads: GainNode; tick: number; next: number; index: number };
const frequency = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

export class SoundscapeEngine {
  private output: GainNode;
  private bus: DynamicsCompressorNode;
  private reverb: ConvolverNode;
  private wet: GainNode;
  private delay: DelayNode;
  private feedback: GainNode;
  private echo: GainNode;
  private wave: PeriodicWave;
  private bassWave: PeriodicWave;
  private noise: AudioBuffer;
  private arrangement?: Arrangement;
  private timer?: ReturnType<typeof setInterval>;
  private pauseTimer?: ReturnType<typeof setTimeout>;
  private retireTimers = new Set<ReturnType<typeof setTimeout>>();
  private voices = new Set<AudioScheduledSourceNode>();
  private playing = false;
  private disposed = false;
  private volume: number;

  constructor(private context: AudioContext, volume: number, private onState: (playing: boolean) => void) {
    this.volume = volume;
    this.bus = context.createDynamicsCompressor();
    this.bus.threshold.value = -16;
    this.bus.knee.value = 10;
    this.bus.ratio.value = 4;
    this.bus.attack.value = 0.008;
    this.bus.release.value = 0.18;
    this.output = context.createGain();
    this.output.gain.value = 0;
    this.bus.connect(this.output).connect(context.destination);
    this.wave = context.createPeriodicWave(new Float32Array(8), new Float32Array([0,1,.32,.2,.11,.07,.035,.018]));
    this.bassWave = context.createPeriodicWave(new Float32Array(5), new Float32Array([0,1,.28,.13,.045]));
    this.reverb = context.createConvolver();
    const impulse = context.createBuffer(2, Math.floor(context.sampleRate * 2.1), context.sampleRate);
    let seed = 48271;
    for (let channel = 0; channel < 2; channel++) {
      const samples = impulse.getChannelData(channel);
      let previous = 0;
      for (let i = 0; i < samples.length; i++) {
        seed = (seed * 16807) % 2147483647;
        previous = previous * 0.55 + (seed / 2147483647 * 2 - 1) * 0.45;
        samples[i] = previous * (1 - i / samples.length) ** 3;
      }
    }
    this.noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const samples = this.noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) { seed = (seed * 16807) % 2147483647; samples[i] = seed / 2147483647 * 2 - 1; }
    this.reverb.buffer = impulse;
    this.wet = context.createGain();
    this.wet.gain.value = 0.3;
    this.reverb.connect(this.wet).connect(this.bus);
    this.delay = context.createDelay(1);
    this.delay.delayTime.value = 0.38;
    this.feedback = context.createGain(); this.feedback.gain.value = 0.25;
    this.echo = context.createGain(); this.echo.gain.value = 0.17;
    this.delay.connect(this.feedback).connect(this.delay);
    this.delay.connect(this.echo).connect(this.bus);
    context.addEventListener("statechange", this.reportState);
  }

  private reportState = () => this.onState(this.playing && this.context.state === "running");

  async play(index: number) {
    if (this.disposed || !tracks[index]) return;
    clearTimeout(this.pauseTimer);
    await this.context.resume();
    if (this.disposed) return;
    if (!this.arrangement || this.arrangement.index !== index) {
      const now = this.context.currentTime;
      const old = this.arrangement;
      if (old) {
        for (const node of [old.gain, old.send]) {
          node.gain.cancelAndHoldAtTime(now);
          node.gain.linearRampToValueAtTime(0, now + 0.75);
        }
        const timer = setTimeout(() => { old.gain.disconnect(); old.send.disconnect(); old.pads.disconnect(); this.retireTimers.delete(timer); }, 1000);
        this.retireTimers.add(timer);
      }
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(1, now + 0.8);
      gain.connect(this.bus);
      const send = this.context.createGain();
      send.gain.setValueAtTime(0, now); send.gain.linearRampToValueAtTime(0.5, now + 0.8);
      send.connect(this.reverb); send.connect(this.delay);
      const pads = this.context.createGain(); pads.connect(gain);
      this.delay.delayTime.setTargetAtTime(60 / tracks[index].bpm * .75, now, .2);
      this.arrangement = { gain, send, pads, tick: 0, next: now + 0.06, index };
    }
    this.playing = true;
    this.output.gain.cancelAndHoldAtTime(this.context.currentTime);
    this.output.gain.setTargetAtTime(this.volume * 0.8, this.context.currentTime, 0.12);
    this.schedule();
    if (!this.timer) this.timer = setInterval(() => this.schedule(), 80);
    this.reportState();
  }

  pause() {
    this.playing = false;
    clearInterval(this.timer); this.timer = undefined;
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
    const a = this.arrangement;
    if (!a || !this.playing || this.context.state !== "running") return;
    const score = tracks[a.index];
    const beat = 60 / score.bpm;
    if (a.next < this.context.currentTime - beat) a.next = this.context.currentTime + 0.05;
    while (a.next < this.context.currentTime + 0.25) {
      const { tick, next: time, gain, send, pads, index } = a;
      const step = tick % 16;
      const chord = score.chords[Math.floor(tick / 32) % score.chords.length];
      const phrase = Math.floor(tick / 64) % 4;
      if (tick % 32 === 0) chord.slice(1).forEach((note, i) => this.note(note, time, beat * 8.8, .032, pads, score.cutoff * .65, (i - 1.5) * .4, "pad", send));
      const kick = index === 3 ? [0,6,10].includes(step) : step % 4 === 0;
      if (kick) {
        this.kick(time, gain, index === 2 ? .68 : .57);
        pads.gain.setValueAtTime(.48, time);
        pads.gain.linearRampToValueAtTime(1, time + beat * .65);
      }
      if (step === 4 || step === 12) {
        this.percussion(time, .16, index === 1 ? .19 : .12, gain, false);
        this.note(53, time, .12, .07, gain, 550, 0, "sine");
      }
      if (step % 2 === 0 || (index === 2 && phrase > 0)) {
        this.percussion(time + (step % 4 === 2 ? .012 : 0), step % 4 === 2 ? .13 : .045, step % 4 === 2 ? .075 : .035, gain, true);
      }
      if (step % 2 === (index === 1 ? 0 : 1)) {
        const bassPattern = [0,0,12,0,0,7,0,12];
        this.note(chord[0] - 12 + bassPattern[Math.floor(step / 2)], time, beat * .44, .2, gain, index === 2 ? 950 : 650, 0, "bass");
      }
      const stride = index === 2 ? 1 : 2;
      if (tick % stride === 0) {
        const melodies = [[2,4,3,2,1,3,4,3],[1,3,4,2,3,4,2,4],[2,3,4,3,1,2,4,2],[4,2,3,1,4,3,2,3]];
        const pos = Math.floor(tick / stride) % 8;
        const note = chord[melodies[index][pos]] + (phrase === 2 ? 12 : 0);
        this.note(note, time, beat * (index === 1 ? 1.5 : .95), index === 2 ? .055 : .073, gain, score.cutoff * (1 + phrase * .2), Math.sin(tick * .7) * .5, "pluck", send);
      }
      if (phrase === 3 && step === 15) this.percussion(time, .075, .08, gain, false);
      a.tick++; a.next += beat / 4;
    }
  }

  private note(midi: number, time: number, duration: number, level: number, destination: GainNode, cutoff: number, pan: number, kind: "pad" | "pluck" | "bass" | "sine", send?: GainNode) {
    const ctx = this.context;
    const envelope = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const stereo = ctx.createStereoPanner();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, time);
    filter.frequency.exponentialRampToValueAtTime(Math.max(90, cutoff * .25), time + duration);
    filter.Q.value = kind === "bass" ? 1.1 : .45;
    stereo.pan.value = pan;
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(level, time + (kind === "pad" ? .65 : .008));
    envelope.gain.exponentialRampToValueAtTime(.0001, time + duration);
    filter.connect(envelope).connect(stereo).connect(destination);
    if (send) stereo.connect(send);
    const count = kind === "pad" ? 2 : 1;
    let ended = 0;
    for (let i = 0; i < count; i++) {
      const oscillator = ctx.createOscillator();
      if (kind === "sine") oscillator.type = "sine";
      else oscillator.setPeriodicWave(kind === "bass" ? this.bassWave : this.wave);
      oscillator.frequency.value = frequency(midi);
      oscillator.detune.value = kind === "pad" ? (i ? 5 : -5) : 0;
      oscillator.connect(filter); this.voices.add(oscillator);
      oscillator.onended = () => {
        oscillator.disconnect(); this.voices.delete(oscillator);
        if (++ended === count) { filter.disconnect(); envelope.disconnect(); stereo.disconnect(); }
      };
      oscillator.start(time); oscillator.stop(time + duration + .03);
    }
  }

  private kick(time: number, destination: GainNode, level: number) {
    const tone = this.context.createOscillator();
    const envelope = this.context.createGain();
    tone.frequency.setValueAtTime(145, time);
    tone.frequency.exponentialRampToValueAtTime(48, time + .06);
    tone.frequency.exponentialRampToValueAtTime(38, time + .38);
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(level, time + .004);
    envelope.gain.exponentialRampToValueAtTime(.0001, time + .43);
    tone.connect(envelope).connect(destination); this.voices.add(tone);
    tone.onended = () => { tone.disconnect(); envelope.disconnect(); this.voices.delete(tone); };
    tone.start(time); tone.stop(time + .45);
  }

  private percussion(time: number, duration: number, level: number, destination: GainNode, hat: boolean) {
    const source = this.context.createBufferSource(); source.buffer = this.noise;
    const filter = this.context.createBiquadFilter();
    filter.type = hat ? "highpass" : "bandpass";
    filter.frequency.value = hat ? 7000 : 1800; filter.Q.value = hat ? .4 : .7;
    const envelope = this.context.createGain();
    envelope.gain.setValueAtTime(0,time); envelope.gain.linearRampToValueAtTime(level,time+.002);
    envelope.gain.exponentialRampToValueAtTime(.0001,time+duration);
    source.connect(filter).connect(envelope).connect(destination); this.voices.add(source);
    source.onended = () => { source.disconnect(); filter.disconnect(); envelope.disconnect(); this.voices.delete(source); };
    source.start(time, hat ? .4 : .1); source.stop(time+duration+.01);
  }

  dispose() {
    this.disposed = true;
    clearInterval(this.timer); clearTimeout(this.pauseTimer);
    this.retireTimers.forEach(clearTimeout);
    this.context.removeEventListener("statechange", this.reportState);
    this.voices.forEach(voice => { try { voice.stop(); } catch { /* already ended */ } });
    this.voices.clear();
    this.arrangement?.gain.disconnect(); this.arrangement?.send.disconnect(); this.arrangement?.pads.disconnect();
    for (const node of [this.reverb,this.wet,this.delay,this.feedback,this.echo,this.bus,this.output]) node.disconnect();
    void this.context.close();
  }
}
