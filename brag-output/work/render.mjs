// Renderiza composition/index.html frame a frame.
//   node render.mjs stills 1.2 3.5 ...   -> work/stills/t-<s>.png
//   node render.mjs video                -> work/video.mp4 (sin audio)
//   node render.mjs frame 12.3 out.png   -> un frame suelto
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const puppeteer = require(
  'C:/Users/ian19/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core'
);

const WORK = path.dirname(new URL(import.meta.url).pathname.slice(1));
const ROOT = path.resolve(WORK, '../..');
const FPS = 30;
const TYPES = { '.html': 'text/html', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.jpg': 'image/jpeg' };

// Servidor estatico de solo lectura sobre la raiz del repo (para fuentes, capturas y SVG).
const server = http.createServer((req, res) => {
  const file = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(4123, '127.0.0.1', r));

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--font-render-hinting=none', '--force-color-profile=srgb'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:4123/brag-output/composition/index.html', { waitUntil: 'networkidle0' });
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);
fs.writeFileSync(path.join(WORK, 'timing.json'), JSON.stringify(await page.evaluate(() => window.TIMING), null, 1));

const at = async t => page.evaluate(x => window.renderAt(x), t);
const [mode, ...rest] = process.argv.slice(2);

if (mode === 'stills') {
  const dir = path.join(WORK, 'stills');
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
  const out = path.join(WORK, 'video.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg',
    '-i', '-', '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(FPS), out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < frames; i++) {
    await at(i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 60 === 0) console.log(`frame ${i}/${frames}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('video', out, frames, 'frames');
}

await browser.close();
server.close();
