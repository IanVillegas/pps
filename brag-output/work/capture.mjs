// Recorre DecPat en Chrome headless y guarda capturas 1920x1080 con datos ficticios.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const puppeteer = require(
  'C:/Users/ian19/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core'
);

const BASE = 'http://localhost:3005';
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname.slice(1)), 'shots');
fs.mkdirSync(OUT, { recursive: true });

const HIDE_DEV = `nextjs-portal{display:none!important}[class*="devTrigger"]{display:none!important}*{caret-color:transparent!important}`;

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 810, deviceScaleFactor: 4 / 3 });

const sleep = ms => new Promise(r => setTimeout(r, ms));
const shot = async name => {
  await page.addStyleTag({ content: HIDE_DEV }).catch(() => {});
  await sleep(350);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log('shot', name);
};
const step = async (label, fn) => {
  try {
    await fn();
  } catch (e) {
    console.log('FAIL', label, e.message);
  }
};

// Marca el control asociado a una etiqueta y devuelve su selector.
const byLabel = async text => {
  const sel = await page.evaluate(t => {
    const label = [...document.querySelectorAll('label')].find(l =>
      l.textContent.trim().startsWith(t)
    );
    if (!label) return null;
    let el = label.htmlFor ? document.getElementById(label.htmlFor) : null;
    if (!el) el = label.parentElement.querySelector('input,textarea,button');
    if (!el) return null;
    const key = 'c' + Math.random().toString(36).slice(2, 8);
    el.setAttribute('data-cap', key);
    return `[data-cap="${key}"]`;
  }, text);
  if (!sel) throw new Error('sin etiqueta ' + text);
  return sel;
};
const clickText = async (text, scope = 'button') => {
  const ok = await page.evaluate(
    (t, s) => {
      const el = [...document.querySelectorAll(s)].find(
        b => b.textContent.trim() === t && !b.disabled
      );
      if (!el) return false;
      el.setAttribute('data-cap', 'clicktarget');
      return true;
    },
    text,
    scope
  );
  if (!ok) throw new Error('sin boton ' + text);
  await page.click('[data-cap="clicktarget"]');
  await page.evaluate(() =>
    document.querySelector('[data-cap="clicktarget"]')?.removeAttribute('data-cap')
  );
};

// 1. Login
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 120000 });
await page.waitForSelector('input', { timeout: 120000 });
await sleep(1500);
await shot('01-login');
await step('login', async () => {
  const user = await byLabel('Usuario');
  const name = 'maria.solis';
  await page.click(user);
  for (let i = 0; i < name.length; i++) {
    await page.type(user, name[i]);
    if ([2, 5, 8].includes(i)) await shot(`02-login-user-${i + 1}`);
  }
  await shot('02-login-user-11');
  const pass = await byLabel('Contraseña');
  await page.click(pass);
  await page.type(pass, 'demo1234');
  await shot('03-login-filled');
  await clickText('Ingresar');
  await page.waitForFunction(() => location.pathname === '/inicio', { timeout: 120000 });
  await sleep(2500);
  await shot('04-home');
});

// 2. Wizard
await step('wizard', async () => {
  await page.click('a[href="/mi-declaracion/1"]');
  await page.waitForFunction(() => location.pathname.startsWith('/mi-declaracion'), {
    timeout: 120000,
  });
  await sleep(4000);
  await shot('05-intro');
  const dialog = await page.$('[role="dialog"],[role="alertdialog"]');
  if (dialog) {
    const btns = await page.$$eval('[role="dialog"] button,[role="alertdialog"] button', bs =>
      bs.map(b => b.textContent.trim())
    );
    console.log('intro buttons', btns);
    const primary = btns.filter(Boolean).pop();
    await clickText(primary);
    await sleep(1200);
  }
  await shot('06-step1-empty');
  await clickText('Continuar');
  await sleep(900);
  await shot('07-step1-errors');
});

const fill = async (label, value, name) => {
  await step('fill ' + label, async () => {
    const sel = await byLabel(label);
    await page.click(sel);
    await page.type(sel, value);
    if (name) await shot(name);
  });
};
const pick = async (label, name) => {
  await step('pick ' + label, async () => {
    const sel = await byLabel(label);
    await page.click(sel);
    await page.waitForSelector('[role="option"]', { timeout: 10000 });
    await sleep(500);
    if (name) await shot(name);
    const opts = await page.$$('[role="option"]');
    await opts[Math.min(1, opts.length - 1)].click();
    await sleep(400);
  });
};

await fill('Nombre y apellidos', 'María Solís Vargas', '08a-step1-name');
await pick('Estado civil', '08b-step1-dropdown');
await fill('Cédula', '109870654');
await fill('Último grado académico', 'Licenciatura');
await fill('Edad en años', '34');
await fill('Carrera', 'Administración de Empresas', '08c-step1-half');
await fill('Teléfono habitación', '22104455');
await pick('Agencia');
await fill('Teléfono celular', '88112233');
await fill('Oficina para la que labora', 'Oficinas centrales');
await fill('Dirección actual', 'Heredia, San Pablo, 200 m norte del parque.');
await page.evaluate(() => window.scrollTo(0, 0));
// El catalogo simulado solo trae "Agencia N (mock)"; para el video se muestra
// "Oficina central" (pedido del usuario), solo en el texto visible de la captura.
await page.evaluate(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (/^Agencia \d \(mock\)$/.test(n.nodeValue.trim())) n.nodeValue = 'Oficina central';
  }
});
await shot('08d-step1-filled');

await step('continuar', async () => {
  await clickText('Continuar');
  await sleep(2500);
  await shot('09-step2');
});

for (const n of [3, 4, 6, 9, 10, 12]) {
  await step('paso ' + n, async () => {
    await page.click(`button[aria-label="Paso ${n}"]`);
    await page.waitForFunction(p => location.pathname.endsWith('/' + p), { timeout: 60000 }, n);
    await sleep(2500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(`10-step${n}`);
  });
}

// 3. Cierre
await step('terminar', async () => {
  const btns = await page.$$eval('button', bs => bs.map(b => b.textContent.trim()).filter(Boolean));
  console.log('step12 buttons', btns);
  await clickText('Terminar');
  await sleep(1500);
  await shot('11-oath');
  const dbtns = await page.$$eval('[role="dialog"] button,[role="alertdialog"] button', bs =>
    bs.map(b => b.textContent.trim())
  );
  console.log('oath buttons', dbtns);
  await clickText('Guardar');
  await sleep(900);
  await shot('12-confirm');
  const confirmBtn = await page.$$('[role="dialog"] button,[role="alertdialog"] button');
  const labels = await Promise.all(confirmBtn.map(b => b.evaluate(n => n.textContent.trim())));
  console.log('confirm buttons', labels);
  await confirmBtn[labels.lastIndexOf('Guardar')].click();
  await sleep(250);
  await shot('13-sending');
  await page.waitForFunction(
    () => [...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Guardado'),
    { timeout: 20000 }
  );
  await sleep(500);
  await shot('14-saved');
});

await browser.close();
