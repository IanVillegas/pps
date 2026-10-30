// Renderiza snapshots HTML fuera de Next para comprobar que CSS y fuentes cargan.
import { createRequire } from 'node:module';
import path from 'node:path';
import { serve } from './serve.mjs';

const require = createRequire(import.meta.url);
const puppeteer = require(
  'C:/Users/ian19/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core'
);
const WORK = path.dirname(new URL(import.meta.url).pathname.slice(1));
const server = await serve(4124);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: Number(process.env.VW ?? 1440), height: Number(process.env.VH ?? 810) });
const missing = new Set();
page.on('response', r => { if (!r.ok()) missing.add(r.url()); });
for (const name of process.argv.slice(2)) {
  await page.goto(`http://127.0.0.1:4124/brag-output/work/snap/${name}.html`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(WORK, 'snap', `${name}.static.png`) });
  console.log('ok', name);
}
console.log('missing', [...missing]);
await browser.close();
server.close();
