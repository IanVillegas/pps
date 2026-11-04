// Renderiza los snapshots HTML con los datos de Ian (work/snap) a 1920x1080 en informe-final/assets/ian/.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import { serve } from '../brag-output/work/serve.mjs';

const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/ian19/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core');
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), 'assets', 'ian');
fs.mkdirSync(OUT, { recursive: true });
const server = await serve(4125);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 810, deviceScaleFactor: 4 / 3 });
for (const name of process.argv.slice(2)) {
  await page.goto(`http://127.0.0.1:4125/brag-output/work/snap/${name}.html`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log('ok', name);
}
await browser.close();
server.close();
