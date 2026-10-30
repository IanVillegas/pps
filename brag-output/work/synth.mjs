// Sintetiza la banda sonora (musica + efectos en el mismo grid) -> work/music.wav
// Lee los tiempos de la composicion desde work/timing.json (lo escribe render.mjs).
import fs from 'node:fs';
import path from 'node:path';

const WORK = path.dirname(new URL(import.meta.url).pathname.slice(1));
const timing = JSON.parse(fs.readFileSync(path.join(WORK, 'timing.json'), 'utf8'));
const { B, BAR, T } = timing;
const SR = 48000;
const DURATION = 10 * BAR;
const N = Math.ceil(DURATION * SR);

const L = new Float32Array(N), R = new Float32Array(N);
const sendL = new Float32Array(N), sendR = new Float32Array(N);
const duck = new Float32Array(N).fill(1);

const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
let seed = 7;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const add = (i, v, pan = 0, send = 0) => {
  if (i < 0 || i >= N) return;
  const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
  L[i] += v * gl; R[i] += v * gr;
  sendL[i] += v * gl * send; sendR[i] += v * gr * send;
};

// Progresion: un acorde por compas.
const CHORDS = [
  { pad: [57, 60, 64], bass: 33 }, // Am
  { pad: [53, 57, 60], bass: 29 }, // F
  { pad: [60, 64, 67], bass: 36 }, // C
  { pad: [55, 59, 62], bass: 31 }, // G
  { pad: [57, 60, 64], bass: 33 }, // Am
  { pad: [53, 57, 60], bass: 29 }, // F
  { pad: [60, 64, 67], bass: 36 }, // C
  { pad: [55, 59, 62], bass: 31 }, // G
  { pad: [53, 57, 60, 64], bass: 29 }, // Fmaj7
  { pad: [48, 55, 60, 64, 67], bass: 36 }, // C (final)
];

// ---------- Kick (y su envolvente de sidechain) ----------
function kick(t0, vel = 1) {
  const s = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < 0.45 * SR; i++) {
    const t = i / SR;
    const f = 48 + 100 * Math.exp(-t / 0.035);
    ph += (2 * Math.PI * f) / SR;
    const env = Math.exp(-t / 0.16);
    const click = i < 0.004 * SR ? noise() * 0.25 * (1 - i / (0.004 * SR)) : 0;
    add(s + i, (Math.sin(ph) * env + click) * 0.55 * vel);
  }
  for (let i = 0; i < 0.3 * SR; i++) {
    const k = i / (0.3 * SR);
    const d = 1 - 0.45 * vel * Math.pow(1 - k, 2);
    if (s + i < N) duck[s + i] = Math.min(duck[s + i], d);
  }
}

function snare(t0, vel = 1) {
  const s = Math.floor(t0 * SR);
  let lp = 0, hp = 0;
  for (let i = 0; i < 0.25 * SR; i++) {
    const t = i / SR;
    const n = noise();
    lp += 0.35 * (n - lp);
    hp = n - lp;
    const body = Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.04) * 0.4;
    add(s + i, (hp * Math.exp(-t / 0.07) * 0.5 + body) * 0.13 * vel, 0, 0.5);
  }
}

function hat(t0, vel = 1, pan = 0.25) {
  const s = Math.floor(t0 * SR);
  let lp = 0;
  for (let i = 0; i < 0.06 * SR; i++) {
    const n = noise();
    lp += 0.6 * (n - lp);
    add(s + i, (n - lp) * Math.exp(-(i / SR) / 0.018) * 0.07 * vel, pan, 0.15);
  }
}

// ---------- Pad (saws desafinadas, filtradas) ----------
function pad() {
  const voices = [];
  CHORDS.forEach((c, bar) => {
    const t0 = bar * BAR, t1 = bar === CHORDS.length - 1 ? DURATION : (bar + 1) * BAR;
    for (const m of c.pad) for (const det of [-7, 0, 7]) voices.push({ f: mtof(m) * Math.pow(2, det / 1200), t0, t1, pan: det / 14 });
  });
  for (const v of voices) {
    const s = Math.floor(v.t0 * SR), e = Math.min(N, Math.floor((v.t1 + 0.4) * SR));
    let ph = Math.random(), lp1 = 0, lp2 = 0;
    for (let i = s; i < e; i++) {
      const t = i / SR;
      ph += v.f / SR; ph -= Math.floor(ph);
      const saw = 2 * ph - 1;
      const cutoff = 0.05 + 0.025 * Math.sin(t * 0.9);
      lp1 += cutoff * (saw - lp1); lp2 += cutoff * (lp1 - lp2);
      const att = Math.min(1, (t - v.t0) / 0.35);
      const rel = t > v.t1 ? Math.max(0, 1 - (t - v.t1) / 0.4) : 1;
      add(i, lp2 * att * rel * 0.035 * duck[i], v.pan, 0.6);
    }
  }
}

// ---------- Bajo ----------
function bass() {
  CHORDS.forEach((c, bar) => {
    if (bar === 0) return;
    const steps = bar >= 8 ? [0] : [0, 1, 2, 3, 4, 5, 6, 7];
    for (const st of steps) {
      const t0 = bar * BAR + st * (B / 2);
      const len = bar >= 8 ? BAR * (bar === 9 ? 1 : 1) : B / 2;
      const m = c.bass + 12 + (st % 2 === 1 ? 12 : 0);
      const f = mtof(m);
      const s = Math.floor(t0 * SR);
      let ph = 0, lp = 0;
      const vel = st % 2 === 1 ? 0.55 : 1;
      for (let i = 0; i < len * SR + 0.05 * SR; i++) {
        const t = i / SR;
        ph += f / SR; ph -= Math.floor(ph);
        const tone = Math.sin(2 * Math.PI * ph) + 0.35 * (2 * ph - 1);
        lp += 0.08 * (tone - lp);
        const env = (bar >= 8 ? Math.exp(-t / 1.2) : Math.exp(-t / 0.16)) * Math.min(1, t / 0.004) * (t > len ? Math.max(0, 1 - (t - len) / 0.05) : 1);
        add(s + i, Math.tanh(lp * 1.6) * env * 0.16 * vel * (duck[s + i] ?? 1));
      }
    }
  });
}

// ---------- Arpegio pluck ----------
function arp() {
  const pattern = [0, 1, 2, 1, 0, 2, 1, 2];
  CHORDS.forEach((c, bar) => {
    if (bar < 2 || bar > 7) return;
    pattern.forEach((p, st) => {
      const m = c.pad[p % c.pad.length] + 12;
      const f = mtof(m), t0 = bar * BAR + st * (B / 2);
      const s = Math.floor(t0 * SR);
      let ph = 0, lp = 0;
      for (let i = 0; i < 0.35 * SR; i++) {
        const t = i / SR;
        ph += f / SR; ph -= Math.floor(ph);
        const tri = 1 - 4 * Math.abs(ph - 0.5);
        lp += 0.25 * (tri - lp);
        add(s + i, lp * Math.exp(-t / 0.12) * Math.min(1, t / 0.003) * 0.045, st % 2 ? 0.35 : -0.35, 0.45);
      }
    });
  });
}

// ---------- Efectos ----------
const PENTA = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96]; // La menor pentatonica
function tick(t0, m, vel = 1) {
  const s = Math.floor(t0 * SR), f = mtof(m);
  for (let i = 0; i < 0.25 * SR; i++) {
    const t = i / SR;
    const v = (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t / 0.07) * Math.min(1, t / 0.002);
    add(s + i, v * 0.05 * vel, 0, 0.5);
  }
}
function whoosh(tCut, len = 0.38, vel = 1) {
  const s = Math.floor((tCut - len) * SR), e = Math.floor((tCut + 0.12) * SR);
  let lp = 0;
  for (let i = s; i < e; i++) {
    const t = i / SR - (tCut - len);
    const k = Math.min(1, t / len);
    const cutoff = 0.01 + 0.12 * k * k;
    lp += cutoff * (noise() - lp);
    const env = t < len ? k * k : Math.max(0, 1 - (t - len) / 0.12);
    add(i, lp * env * 0.22 * vel, Math.sin(t * 6) * 0.4, 0.4);
  }
}
function click(t0) {
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < 0.03 * SR; i++) {
    const t = i / SR;
    add(s + i, (Math.sin(2 * Math.PI * 1760 * t) * 0.6 + noise() * 0.3) * Math.exp(-t / 0.006) * 0.06, 0.1, 0.2);
  }
}
function ding(t0) {
  for (const [m, d] of [[86, 0], [91, 0.06], [98, 0.12]]) { // D6, G6, D7
    const f = mtof(m), s = Math.floor((t0 + d) * SR);
    for (let i = 0; i < 1.6 * SR; i++) {
      const t = i / SR;
      const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.5)
        + 0.3 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t / 0.15)
        + 0.12 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t / 0.06);
      add(s + i, v * Math.min(1, t / 0.002) * 0.045, 0, 0.7);
    }
  }
}
function crash(t0) {
  const s = Math.floor(t0 * SR);
  let lp = 0;
  for (let i = 0; i < 1.8 * SR; i++) {
    const n = noise();
    lp += 0.5 * (n - lp);
    add(s + i, (n - lp) * Math.exp(-(i / SR) / 0.5) * 0.06, 0, 0.6);
  }
}

// ---------- Arreglo ----------
for (let bar = 1; bar < 8; bar++) {
  for (let b = 0; b < 4; b++) {
    const t = bar * BAR + b * B;
    kick(t, b % 2 === 0 ? 1 : 0.55);
    if (bar >= 2 && b % 2 === 1) snare(t, 0.9);
    hat(t + B / 2, 1, b % 2 ? 0.3 : -0.3);
    if (bar >= 3) hat(t + B / 4, 0.4, 0.5);
  }
}
kick(8 * BAR, 1.1);
crash(8 * BAR);
kick(9 * BAR, 0.7);

pad();
bass();
arp();

timing.DOT_T.forEach((t, i) => tick(t, PENTA[i], 0.7 + i * 0.03));
for (const cut of [T.login, T.home, T.step1, T.steps, T.oath, T.outro]) whoosh(cut, 0.38, cut === T.outro ? 1.3 : 0.8);
for (const s of timing.SHOTS) if (s.bump && ![T.home, T.step1, T.steps, T.oath].some(c => Math.abs(c - s.t) < 0.01)) tick(s.t, 81, 0.6);
for (const c of timing.CURSOR) click(c.click);
ding(T.oath + 5 * B);

// ---------- Reverb (Schroeder) sobre el envio ----------
function reverb(inp, combs, aps) {
  const out = new Float32Array(N);
  for (const [d, g] of combs) {
    const buf = new Float32Array(d); let idx = 0, lp = 0;
    for (let i = 0; i < N; i++) {
      const y = buf[idx];
      lp += 0.4 * (y - lp);
      buf[idx] = inp[i] + lp * g;
      out[i] += y / combs.length;
      idx = (idx + 1) % d;
    }
  }
  for (const [d, g] of aps) {
    const buf = new Float32Array(d); let idx = 0;
    for (let i = 0; i < N; i++) {
      const x = out[i], y = buf[idx] - g * x;
      buf[idx] = x + g * y;
      out[i] = y;
      idx = (idx + 1) % d;
    }
  }
  return out;
}
const revL = reverb(sendL, [[1557, 0.82], [1617, 0.82], [1491, 0.82], [1422, 0.82]], [[225, 0.5], [556, 0.5]]);
const revR = reverb(sendR, [[1617, 0.82], [1557, 0.82], [1422, 0.82], [1491, 0.82]], [[241, 0.5], [579, 0.5]]);

// ---------- Master ----------
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = Math.min(1, t / 0.05) * Math.min(1, (DURATION - t) / 0.6);
  L[i] = Math.tanh((L[i] + revL[i] * 0.35) * 1.4) * fade;
  R[i] = Math.tanh((R[i] + revR[i] * 0.35) * 1.4) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const gain = 0.89 / peak;
const data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(L[i] * gain * 32767), i * 4);
  data.writeInt16LE(Math.round(R[i] * gain * 32767), i * 4 + 2);
}
const header = Buffer.alloc(44);
header.write('RIFF', 0); header.writeUInt32LE(36 + data.length, 4); header.write('WAVE', 8);
header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(2, 22);
header.writeUInt32LE(SR, 24); header.writeUInt32LE(SR * 4, 28); header.writeUInt16LE(4, 32); header.writeUInt16LE(16, 34);
header.write('data', 36); header.writeUInt32LE(data.length, 40);
fs.writeFileSync(path.join(WORK, 'music.wav'), Buffer.concat([header, data]));
console.log('music.wav', DURATION.toFixed(3), 's, peak', peak.toFixed(3));
