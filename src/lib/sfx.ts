/* Efectos de sonido sintetizados con Web Audio (sin archivos de audio). */

const STORAGE_KEY = 'happly-sound-muted';

let ctx: AudioContext | null = null;
let muted = false;
let lastTick = 0;

try {
  muted = localStorage.getItem(STORAGE_KEY) === '1';
} catch {
  /* sin almacenamiento: el sonido queda activo */
}

export function isMuted() {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch {
    /* ignorar */
  }
}

function getCtx(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOptions {
  freq: number;
  /** Frecuencia final (barrido exponencial). */
  to?: number;
  type?: OscillatorType;
  start?: number;
  dur?: number;
  gain?: number;
}

function tone({ freq, to, type = 'sine', start = 0, dur = 0.15, gain = 0.08 }: ToneOptions) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const amp = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  amp.gain.setValueAtTime(0.0001, t0);
  amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
  amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(amp).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

/** Curva de desaceleración fuerte (arranca rápido, termina suave), igual a la de la animación. */
const easeOut = (x: number) => 1 - Math.pow(1 - x, 5);

/**
 * Tono continuo que sube siguiendo la misma curva con la que se llenan el
 * porcentaje y las barras, y termina con un "ding" al completarse.
 */
export function sweep(duration: number) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;
  const STEPS = 64;
  const curve = (lo: number, hi: number) =>
    Float32Array.from({ length: STEPS }, (_, i) => lo + (hi - lo) * easeOut(i / (STEPS - 1)));

  [
    { type: 'triangle' as OscillatorType, lo: 260, hi: 1040, peak: 0.055 },
    { type: 'sine' as OscillatorType, lo: 130, hi: 520, peak: 0.04 },
  ].forEach(({ type, lo, hi, peak }) => {
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = type;
    osc.frequency.setValueCurveAtTime(curve(lo, hi), t0, duration);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.linearRampToValueAtTime(peak, t0 + 0.04);
    amp.gain.setValueAtTime(peak, t0 + Math.max(duration - 0.15, 0.05));
    amp.gain.linearRampToValueAtTime(0.0001, t0 + duration + 0.05);
    osc.connect(amp).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.1);
  });

  tone({ freq: 1568, type: 'sine', start: duration, dur: 0.3, gain: 0.06 });
}

/**
 * Fanfarria imponente al abrir la pantalla de felicitaciones (estilo Duolingo):
 * golpe grave de impacto, carrerilla ascendente de metales, acorde mayor
 * enorme con eco y platillo, y destellos agudos de cierre.
 */
export function fanfare() {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;

  /* bus maestro: compresor + eco corto para dar tamaño */
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -20;
  comp.ratio.value = 6;
  comp.connect(c.destination);
  const bus = c.createGain();
  bus.gain.value = 0.9;
  bus.connect(comp);
  const delay = c.createDelay(0.5);
  delay.delayTime.value = 0.17;
  const feedback = c.createGain();
  feedback.gain.value = 0.32;
  const wet = c.createGain();
  wet.gain.value = 0.35;
  bus.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(comp);

  const voice = (freq: number, type: OscillatorType, start: number, dur: number, peak: number, lowpass = 3200) => {
    const s = t0 + start;
    const osc = c.createOscillator();
    const filter = c.createBiquadFilter();
    const amp = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, s);
    filter.type = 'lowpass';
    filter.frequency.value = lowpass;
    amp.gain.setValueAtTime(0.0001, s);
    amp.gain.exponentialRampToValueAtTime(peak, s + 0.012);
    amp.gain.exponentialRampToValueAtTime(peak * 0.55, s + Math.min(0.3, dur * 0.4));
    amp.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    osc.connect(filter).connect(amp).connect(bus);
    osc.start(s);
    osc.stop(s + dur + 0.05);
  };

  const noise = (start: number, dur: number, peak: number, kind: BiquadFilterType, freq: number) => {
    const s = t0 + start;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    const filter = c.createBiquadFilter();
    const amp = c.createGain();
    src.buffer = buf;
    filter.type = kind;
    filter.frequency.value = freq;
    amp.gain.setValueAtTime(peak, s);
    amp.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    src.connect(filter).connect(amp).connect(bus);
    src.start(s);
  };

  /* 1) impacto grave: caída de bombo + golpe de ruido */
  const boom = c.createOscillator();
  const boomAmp = c.createGain();
  boom.type = 'sine';
  boom.frequency.setValueAtTime(130, t0);
  boom.frequency.exponentialRampToValueAtTime(38, t0 + 0.4);
  boomAmp.gain.setValueAtTime(0.0001, t0);
  boomAmp.gain.exponentialRampToValueAtTime(0.28, t0 + 0.012);
  boomAmp.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);
  boom.connect(boomAmp).connect(bus);
  boom.start(t0);
  boom.stop(t0 + 0.55);
  noise(0, 0.18, 0.1, 'lowpass', 900);

  /* 2) carrerilla ascendente de metales hacia el acorde */
  [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => voice(f, 'sawtooth', 0.04 + i * 0.055, 0.2, 0.05, 2600));

  /* 3) acorde mayor enorme (Do) en varias octavas, con platillo */
  const HIT = 0.32;
  [130.81, 261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
    voice(f, i < 2 ? 'sawtooth' : 'triangle', HIT, 1.3, i < 2 ? 0.045 : 0.032, i < 2 ? 1800 : 3200)
  );
  noise(HIT, 0.7, 0.06, 'highpass', 6000);

  /* 4) destellos agudos de cierre */
  [2093, 2637, 3136, 4186, 5274].forEach((f, i) => voice(f, 'sine', HIT + 0.12 + i * 0.08, 0.35, 0.03, 8000));
}

/** Tic corto para los contadores; `progress` (0–1) sube el tono. */
export function tick(progress: number) {
  const now = performance.now();
  if (now - lastTick < 35) return;
  lastTick = now;
  tone({ freq: 700 + progress * 900, type: 'square', dur: 0.045, gain: 0.025 });
}

/** Aparición de una tarjeta. */
export function pop() {
  tone({ freq: 380, to: 900, type: 'sine', dur: 0.13, gain: 0.09 });
}

/** Medalla desbloqueada. */
export function chime() {
  [1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone({ freq: f, type: 'triangle', start: i * 0.07, dur: 0.35, gain: 0.07 }));
}

/** Cierre de la secuencia / trofeo. */
export function success() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
    tone({ freq: f, type: 'triangle', start: i * 0.09, dur: 0.5, gain: 0.07 })
  );
}

export function click() {
  tone({ freq: 520, to: 360, type: 'sine', dur: 0.08, gain: 0.07 });
}
