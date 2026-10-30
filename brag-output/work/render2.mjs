// Renderiza composition2/index.html (renderAt asincrono) frame a frame.
//   node render2.mjs stills 1.2 3.5 ...   -> work/stills2/t-<s>.png
//   node render2.mjs video                -> work/video2.mp4 (sin audio)
//   node render2.mjs frame 12.3 out.png   -> un frame suelto
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { serve } from './serve.mjs';

const require = createRequire(import.meta.url);
const puppeteer = require(
  'C:/Users/ian19/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core'
);

const WORK = path.dirname(new URL(import.meta.url).pathname.slice(1));
const FPS = 30;
const PORTRAIT = process.env.FORMAT === 'portrait';
const [W, H] = PORTRAIT ? [1080, 1440] : [1920, 1080];
const SUFFIX = PORTRAIT ? '-portrait' : '';
const server = await serve(4123);
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--font-render-hinting=none', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
page.on('pageerror', e => console.log('PAGEERROR', e.message));
page.on('console', m => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:4123/brag-output/composition2/index.html' + (PORTRAIT ? '?format=portrait' : ''), { waitUntil: 'networkidle0' });
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);
fs.writeFileSync(path.join(WORK, 'timing2.json'), JSON.stringify(await page.evaluate(() => window.TIMING), null, 1));

const at = t => page.evaluate(x => window.renderAt(x), t);
const [mode, ...rest] = process.argv.slice(2);

if (mode === 'stills') {
  const dir = path.join(WORK, 'stills2' + SUFFIX);
  fs.mkdirSync(dir, { recursive: true });
  for (const s of rest) {
    await at(Number(s));
    await page.screenshot({ path: path.join(dir, `t-${s}.png`) });
    console.log('still', s);
  }
} else if (mode === 'frame') {
  await at(Number(rest[0]));
  await page.screenshot({ path: rest[1] });
} else if (mode === 'video') {
  const frames = Math.round(duration * FPS);
  const out = path.join(WORK, 'video2' + SUFFIX + '.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg',
    // Los JPEG de Chrome son rango completo BT.601; se pasa a rango de video BT.709 etiquetado,
    // o los reproductores recortan los grises claros a blanco.
    '-i', '-', '-vf', 'scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709',
    '-color_trc', 'bt709', '-r', String(FPS), out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    await at(i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 120 === 0) console.log(`frame ${i}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('video', out, frames, 'frames');
}

await browser.close();
server.close();
