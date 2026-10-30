// Mide la x del marcador actual del stepper frame a frame en cada transicion de paso.
import { createRequire } from 'node:module';
import { serve } from './serve.mjs';

const require = createRequire(import.meta.url);
const puppeteer = require(
  'C:/Users/ian19/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core'
);
const server = await serve(4125);
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto('http://127.0.0.1:4125/brag-output/composition2/index.html', { waitUntil: 'networkidle0' });
await page.evaluate(() => window.ready);
const BAR = await page.evaluate(() => window.TIMING.BAR);
for (const startBar of [9, 12, 15, 18, 21]) {
  const xs = [];
  for (let f = 0; f <= 21; f++) {
    const t = startBar * BAR + f / 30;
    const x = await page.evaluate(async t => {
      await window.renderAt(t);
      const d = document.getElementById('slotA').contentDocument;
      return Math.round(d.querySelector('[class*="stepper__marker--current"]').getBoundingClientRect().left);
    }, t);
    xs.push(x);
  }
  const back = xs.some((x, i) => i > 0 && x < xs[i - 1]);
  console.log(`compas ${startBar}: ${xs.join(' ')}  ${back ? 'RETROCEDE' : 'ok, monotono'}`);
}
await browser.close();
server.close();
