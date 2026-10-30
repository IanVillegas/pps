// Banda sonora del recorrido animado (27 compases a 110 BPM) -> work/music2.wav
// Los efectos salen de los eventos que exporta composition2 (work/timing2.json).
import fs from 'node:fs';
import path from 'node:path';

const WORK = path.dirname(new URL(import.meta.url).pathname.slice(1));
const { B, BAR, BARS, EV } = JSON.parse(fs.readFileSync(path.join(WORK, 'timing2.json'), 'utf8'));
const SR = 48000;
const DURATION = BARS * BAR;
const N = Math.ceil(DURATION * SR);

const L = new Float32Array(N), R = new Float32Array(N);
const sendL = new Float32Array(N), sendR = new Float32Array(N);
const duck = new Float32Array(N).fill(1);

const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
let seed = 11;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const add = (i, v, pan = 0, send = 0) => {
  if (i < 0 || i >= N) return;
  const gl = Math.cos((pan + 1) * Math.PI / 4), gr = Math.sin((pan + 1) * Math.PI / 4);
  L[i] += v * gl; R[i] += v * gr;
  sendL[i] += v * gl * send; sendR[i] += v * gr * send;
};

const AM = { pad: [57, 60, 64], bass: 33 }, F = { pad: [53, 57, 60], bass: 29 };
const C = { pad: [60, 64, 67], bass: 36 }, G = { pad: [55, 59, 62], bass: 31 };
const CHORDS = [AM, F];
for (let b = 2; b < 24; b++) CHORDS.push([AM, F, C, G][(b - 2) % 4]);
CHORDS.push({ pad: [53, 57, 60, 64], bass: 29 }, { pad: [55, 59, 62, 65], bass: 31 }, { pad: [48, 55, 60, 64, 67], bass: 36 });

function kick(t0, vel = 1) {
  const s = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < 0.45 * SR; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (48 + 100 * Math.exp(-t / 0.035))) / SR;
    const click = i < 0.004 * SR ? noise() * 0.25 * (1 - i / (0.004 * SR)) : 0;
    add(s + i, (Math.sin(ph) * Math.exp(-t / 0.16) + click) * 0.55 * vel);
  }
  for (let i = 0; i < 0.3 * SR; i++) {
    const k = i / (0.3 * SR);
    if (s + i < N) duck[s + i] = Math.min(duck[s + i], 1 - 0.45 * vel * Math.pow(1 - k, 2));
  }
}
function snare(t0, vel = 1) {
  const s = Math.floor(t0 * SR);
  let lp = 0;
  for (let i = 0; i < 0.25 * SR; i++) {
    const t = i / SR, n = noise();
    lp += 0.35 * (n - lp);
    add(s + i, ((n - lp) * Math.exp(-t / 0.07) * 0.5 + Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.04) * 0.4) * 0.13 * vel, 0, 0.5);
  }
}
function hat(t0, vel = 1, pan = 0.25) {
  const s = Math.floor(t0 * SR);
  let lp = 0;
  for (let i = 0; i < 0.06 * SR; i++) {
    const n = noise();
    lp += 0.6 * (n - lp);
    add(s + i, (n - lp) * Math.exp(-(i / SR) / 0.018) * 0.065 * vel, pan, 0.15);
  }
}
function pad() {
  CHORDS.forEach((c, bar) => {
    const t0 = bar * BAR, t1 = bar === CHORDS.length - 1 ? DURATION : (bar + 1) * BAR;
    for (const m of c.pad) for (const det of [-7, 0, 7]) {
      const f = mtof(m) * Math.pow(2, det / 1200);
      const s = Math.floor(t0 * SR), e = Math.min(N, Math.floor((t1 + 0.4) * SR));
      let ph = Math.random(), lp1 = 0, lp2 = 0;
      for (let i = s; i < e; i++) {
        const t = i / SR;
        ph += f / SR; ph -= Math.floor(ph);
        const cutoff = 0.05 + 0.025 * Math.sin(t * 0.9);
        lp1 += cutoff * (2 * ph - 1 - lp1); lp2 += cutoff * (lp1 - lp2);
        const att = Math.min(1, (t - t0) / 0.35), rel = t > t1 ? Math.max(0, 1 - (t - t1) / 0.4) : 1;
        add(i, lp2 * att * rel * 0.033 * duck[i], det / 14, 0.6);
      }
    }
  });
}
function bass() {
  CHORDS.forEach((c, bar) => {
    if (bar < 2) return;
    const long = bar >= 24;
    const steps = long ? [0] : [0, 1, 2, 3, 4, 5, 6, 7];
    for (const st of steps) {
      const t0 = bar * BAR + st * (B / 2), len = long ? BAR : B / 2;
      const f = mtof(c.bass + 12 + (st % 2 ? 12 : 0)), s = Math.floor(t0 * SR);
      const vel = st % 2 ? 0.55 : 1;
      let ph = 0, lp = 0;
      for (let i = 0; i < (len + 0.05) * SR; i++) {
        const t = i / SR;
        ph += f / SR; ph -= Math.floor(ph);
        lp += 0.08 * (Math.sin(2 * Math.PI * ph) + 0.35 * (2 * ph - 1) - lp);
        const env = (long ? Math.exp(-t / 1.2) : Math.exp(-t / 0.16)) * Math.min(1, t / 0.004) * (t > len ? Math.max(0, 1 - (t - len) / 0.05) : 1);
        add(s + i, Math.tanh(lp * 1.6) * env * 0.15 * vel * (duck[s + i] ?? 1));
      }
    }
  });
}
function arp() {
  const pattern = [0, 1, 2, 1, 0, 2, 1, 2];
  CHORDS.forEach((c, bar) => {
    if (bar < 6 || bar > 25) return;
    pattern.forEach((p, st) => {
      const f = mtof(c.pad[p % c.pad.length] + 12), s = Math.floor((bar * BAR + st * (B / 2)) * SR);
      const vel = bar >= 24 ? 0.6 : 1;
      let ph = 0, lp = 0;
      for (let i = 0; i < 0.35 * SR; i++) {
        const t = i / SR;
        ph += f / SR; ph -= Math.floor(ph);
        lp += 0.25 * (1 - 4 * Math.abs(ph - 0.5) - lp);
        add(s + i, lp * Math.exp(-t / 0.12) * Math.min(1, t / 0.003) * 0.04 * vel, st % 2 ? 0.35 : -0.35, 0.45);
      }
    });
  });
}

// Efectos, todos en La menor / Do mayor.
const PENTA = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96];
function tone(t0, m, dur, decay, vol, send = 0.5, pan = 0) {
  const s = Math.floor(t0 * SR), f = mtof(m);
  for (let i = 0; i < dur * SR; i++) {
    const t = i / SR;
    add(s + i, (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t / decay) * Math.min(1, t / 0.002) * vol, pan, send);
  }
}
function whoosh(tCut, len = 0.38, vel = 1) {
  const s = Math.floor((tCut - len) * SR), e = Math.floor((tCut + 0.12) * SR);
  let lp = 0;
  for (let i = s; i < e; i++) {
    const t = i / SR - (tCut - len), k = Math.min(1, t / len);
    lp += (0.01 + 0.12 * k * k) * (noise() - lp);
    add(i, lp * (t < len ? k * k : Math.max(0, 1 - (t - len) / 0.12)) * 0.2 * vel, Math.sin(t * 6) * 0.4, 0.4);
  }
}
function click(t0) {
  const s = Math.floor(t0 * SR);
  for (let i = 0; i < 0.03 * SR; i++) {
    const t = i / SR;
    add(s + i, (Math.sin(2 * Math.PI * 1760 * t) * 0.6 + noise() * 0.3) * Math.exp(-t / 0.006) * 0.055, 0.1, 0.2);
  }
}
function key(t0) {
  const s = Math.floor(t0 * SR);
  let lp = 0;
  for (let i = 0; i < 0.02 * SR; i++) {
    const n = noise();
    lp += 0.5 * (n - lp);
    add(s + i, (n - lp) * Math.exp(-(i / SR) / 0.004) * 0.035, ((t0 * 7) % 1) - 0.5, 0.1);
  }
}
function pop(t0) {
  const s = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < 0.3 * SR; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (mtof(64) * (1 + 0.5 * Math.exp(-t / 0.03)))) / SR;
    add(s + i, Math.sin(ph) * Math.exp(-t / 0.09) * Math.min(1, t / 0.003) * 0.07, 0, 0.5);
  }
}
function blip(t0) {
  tone(t0, 81, 0.4, 0.12, 0.035);
  tone(t0 + B / 4, 88, 0.5, 0.18, 0.035);
}
function ding(t0) {
  for (const [m, d] of [[84, 0], [88, 0.06], [91, 0.12], [96, 0.18]]) {
    const f = mtof(m), s = Math.floor((t0 + d) * SR);
    for (let i = 0; i < 1.8 * SR; i++) {
      const t = i / SR;
      const v = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.55) + 0.3 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t / 0.15)
        + 0.12 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t / 0.06);
      add(s + i, v * Math.min(1, t / 0.002) * 0.04, 0, 0.7);
    }
  }
}
function crash(t0) {
  const s = Math.floor(t0 * SR);
  let lp = 0;
  for (let i = 0; i < 1.8 * SR; i++) {
    const n = noise();
    lp += 0.5 * (n - lp);
    add(s + i, (n - lp) * Math.exp(-(i / SR) / 0.5) * 0.055, 0, 0.6);
  }
}

// Arreglo
for (let bar = 2; bar < 24; bar++) {
  for (let b = 0; b < 4; b++) {
    const t = bar * BAR + b * B;
    kick(t, b % 2 === 0 ? 1 : 0.5);
    if (bar >= 4 && b % 2 === 1) snare(t, 0.85);
    hat(t + B / 2, 1, b % 2 ? 0.3 : -0.3);
    if (bar >= 6) hat(t + B / 4, 0.35, 0.5);
  }
}
crash(2 * BAR);
kick(24 * BAR, 1.1);
crash(24 * BAR);
kick(25 * BAR, 0.6);
pad();
bass();
arp();

EV.ticks.forEach((t, i) => tone(t, PENTA[i], 0.25, 0.07, 0.05 * (0.7 + i * 0.03)));
EV.whoosh.forEach(t => whoosh(t, 0.38, t > 24 * BAR - 0.1 ? 1.3 : 0.75));
EV.clicks.forEach(click);
EV.keys.forEach(key);
EV.pops.forEach(pop);
EV.blips.forEach(blip);
if (EV.ding) ding(EV.ding);

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

let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR, fade = Math.min(1, t / 0.05) * Math.min(1, (DURATION - t) / 0.8);
  L[i] = Math.tanh((L[i] + revL[i] * 0.35) * 1.4) * fade;
  R[i] = Math.tanh((R[i] + revR[i] * 0.35) * 1.4) * fade;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const gain = 0.89 / peak, data = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  data.writeInt16LE(Math.round(L[i] * gain * 32767), i * 4);
  data.writeInt16LE(Math.round(R[i] * gain * 32767), i * 4 + 2);
}
const h = Buffer.alloc(44);
h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
fs.writeFileSync(path.join(WORK, 'music2.wav'), Buffer.concat([h, data]));
console.log('music2.wav', DURATION.toFixed(3), 's, peak', peak.toFixed(3), 'events', Object.fromEntries(Object.entries(EV).map(([k, v]) => [k, Array.isArray(v) ? v.length : v])));
