// Recorre DecPat con los datos de Ian y guarda cada estado como HTML estatico
// (DOM + CSS reales, sin scripts) en work/snap/, mas una captura de referencia.
// Los assets que pide la app (/_next/static/...) se guardan en work/snap/ con su ruta.
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';

const require = createRequire(import.meta.url);
const puppeteer = require(
  'C:/Users/ian19/AppData/Local/npm-cache/_npx/702923228c2ce1e6/node_modules/puppeteer-core'
);

const BASE = 'http://localhost:3005';
const WORK = path.dirname(new URL(import.meta.url).pathname.slice(1));
const SNAP = path.join(WORK, 'snap');
fs.mkdirSync(SNAP, { recursive: true });

// Valores que se escriben en la app (mock local) y como se muestran en el video.
const MASK = {
  '207800171': '2-0780-••••',
  '00000000': '••••-••••',
  '61044195': '6104-••••',
  '123456789': '1234•••••',
  ISO123: 'ISO•••',
};
const TEXT_SWAP = [[/^Agencia \d \(mock\)$/, 'CN Alajuela']];

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
  args: ['--hide-scrollbars', '--font-render-hinting=none'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 810, deviceScaleFactor: 1 });

page.on('response', async res => {
  try {
    const url = new URL(res.url());
    if (url.origin !== BASE || !res.ok()) return;
    if (!/^\/(_next\/static|_next\/image|icon|favicon)/.test(url.pathname)) return;
    const file = path.join(SNAP, decodeURIComponent(url.pathname));
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, await res.buffer());
  } catch {}
});

const sleep = ms => new Promise(r => setTimeout(r, ms));
const step = async (label, fn) => {
  try {
    await fn();
  } catch (e) {
    console.log('FAIL', label, e.message);
  }
};

const snap = async name => {
  await sleep(600);
  const html = await page.evaluate(
    (mask, swaps) => {
      const m = v => mask[v] ?? v;
      document.querySelectorAll('input, textarea').forEach(el => {
        const v = m(el.value);
        if (el.tagName === 'TEXTAREA') el.textContent = v;
        else el.setAttribute('value', v);
        if (el.type === 'checkbox' && el.checked) el.setAttribute('checked', '');
      });
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const t = n.nodeValue.trim();
        if (!t) continue;
        if (mask[t]) n.nodeValue = n.nodeValue.replace(t, mask[t]);
        for (const [re, to] of swaps) if (new RegExp(re).test(t)) n.nodeValue = to;
      }
      // Los botones de las tablas repiten el dato en aria-label/title.
      document.querySelectorAll('[aria-label], [title]').forEach(el => {
        for (const attr of ['aria-label', 'title']) {
          let v = el.getAttribute(attr);
          if (!v) continue;
          for (const [raw, shown] of Object.entries(mask)) v = v.split(raw).join(shown);
          el.setAttribute(attr, v);
        }
      });
      const clone = document.documentElement.cloneNode(true);
      // CSS insertado por CSSOM (emotion/MUI) no vive en el textContent.
      const live = [...document.querySelectorAll('style')];
      [...clone.querySelectorAll('style')].forEach((s, i) => {
        try {
          s.textContent = [...live[i].sheet.cssRules].map(r => r.cssText).join('\n');
        } catch {}
      });
      clone.querySelectorAll('script, nextjs-portal, link[rel="preload"][as="script"]').forEach(n => n.remove());
      clone.querySelectorAll('[class*="devTrigger"]').forEach(n => n.remove());
      return '<!doctype html>\n' + clone.outerHTML;
    },
    MASK,
    TEXT_SWAP.map(([re, to]) => [re.source, to])
  );
  fs.writeFileSync(path.join(SNAP, `${name}.html`), html);
  await page.screenshot({ path: path.join(SNAP, `${name}.png`) });
  console.log('snap', name);
};

const scopeSel = async () => ((await page.$('[role="dialog"],[role="alertdialog"]')) ? 'D' : '');
const byLabel = async text => {
  const scope = await scopeSel();
  const sel = await page.evaluate(
    (t, s) => {
      const root = s ? document.querySelector('[role="dialog"],[role="alertdialog"]') : document;
      const label = [...root.querySelectorAll('label')].find(l => l.textContent.trim().startsWith(t));
      if (!label) return null;
      let el = label.htmlFor ? document.getElementById(label.htmlFor) : null;
      if (!el) el = label.parentElement.querySelector('input,textarea,button');
      if (!el) return null;
      const key = 'c' + Math.random().toString(36).slice(2, 8);
      el.setAttribute('data-cap', key);
      return `[data-cap="${key}"]`;
    },
    text,
    scope
  );
  if (!sel) throw new Error('sin etiqueta ' + text);
  return sel;
};
const clickText = async (text, scope = 'button') => {
  const ok = await page.evaluate(
    (t, s) => {
      const el = [...document.querySelectorAll(s)].reverse().find(b => b.textContent.trim() === t && !b.disabled);
      if (!el) return false;
      el.setAttribute('data-cap', 'clicktarget');
      return true;
    },
    text,
    scope
  );
  if (!ok) throw new Error('sin boton ' + text);
  await page.click('[data-cap="clicktarget"]');
  await page.evaluate(() => document.querySelector('[data-cap="clicktarget"]')?.removeAttribute('data-cap'));
};
const fill = (label, value) =>
  step('fill ' + label, async () => {
    const sel = await byLabel(label);
    await page.click(sel);
    await page.type(sel, value);
  });
const pick = (label, option) =>
  step('pick ' + label, async () => {
    const sel = await byLabel(label);
    await page.click(sel);
    await page.waitForSelector('[role="option"]', { timeout: 10000 });
    await sleep(300);
    const opts = await page.$$('[role="option"]');
    const texts = await Promise.all(opts.map(o => o.evaluate(n => n.textContent.trim())));
    const i = option ? texts.findIndex(t => t === option) : -1;
    await opts[i >= 0 ? i : 0].click();
    await sleep(300);
  });
const gotoStep = n =>
  step('paso ' + n, async () => {
    await page.click(`button[aria-label="Paso ${n}"]`);
    await page.waitForFunction(p => location.pathname.endsWith('/' + p), { timeout: 60000 }, n);
    await sleep(2000);
    await page.evaluate(() => window.scrollTo(0, 0));
  });
const addRecord = async (prefix, fillFn, addIndex = 0) => {
  await step('agregar ' + prefix, async () => {
    const btns = await page.$$('button');
    const adds = [];
    for (const b of btns) if ((await b.evaluate(n => n.textContent.trim())) === 'Agregar nuevo') adds.push(b);
    await adds[addIndex].click();
    await page.waitForSelector('[role="dialog"],[role="alertdialog"]', { timeout: 10000 });
    await sleep(700);
  });
  await snap(`${prefix}-modal-empty`);
  await fillFn();
  await snap(`${prefix}-modal`);
  await step('guardar ' + prefix, async () => {
    await clickText('Agregar', '[role="dialog"] button,[role="alertdialog"] button');
    await page.waitForFunction(() => !document.querySelector('[role="dialog"],[role="alertdialog"]'), { timeout: 10000 });
    await sleep(900);
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await snap(`${prefix}-after`);
};

// ---------------- Flujo ----------------
await page.goto(BASE + '/', { waitUntil: 'networkidle0', timeout: 180000 });
await page.waitForSelector('input', { timeout: 120000 });
await sleep(1500);
await snap('login');
await step('login', async () => {
  await page.type(await byLabel('Usuario'), 'ian.villegas');
  await page.type(await byLabel('Contraseña'), 'gmutual');
  await snap('login-filled');
  await clickText('Ingresar');
  await page.waitForFunction(() => location.pathname === '/inicio', { timeout: 120000 });
  await sleep(2500);
  await snap('home');
});

await step('wizard', async () => {
  await page.click('a[href="/mi-declaracion/1"]');
  await page.waitForFunction(() => location.pathname.startsWith('/mi-declaracion'), { timeout: 120000 });
  await sleep(4000);
  await snap('intro');
  await clickText('Entendido');
  await sleep(1200);
  await snap('step1-empty');
});

await fill('Nombre y apellidos', 'Ian Villegas Jiménez');
await pick('Estado civil', 'Soltero(a)');
await fill('Cédula', '207800171');
await fill('Último grado académico', 'Bachillerato universitario');
await fill('Edad en años', '28');
await fill('Carrera', 'Ingeniería en Sistemas');
await fill('Teléfono habitación', '00000000');
await pick('Agencia');
await fill('Teléfono celular', '61044195');
await fill('Oficina para la que labora', 'Oficina Central');
await fill('Dirección actual', 'Las Cañas, Alajuela');
await page.evaluate(() => window.scrollTo(0, 0));
await snap('step1');

await step('continuar', async () => {
  await clickText('Continuar');
  await sleep(2500);
});

await gotoStep(3);
await snap('step3-before');
await addRecord('step3', async () => {
  await pick('Tipo de ingreso', 'Alquileres');
  await fill('Monto', '35000000');
  await fill('Justificación', 'Alquiler de vivienda en Alajuela');
});

await gotoStep(4);
await snap('step4-before');
await addRecord('step4', async () => {
  await fill('Número de finca', '123456789');
  await fill('Ubicación', 'Canoas, Alajuela');
  await fill('Valor de mercado', '7000000000');
  await pick('Destino', 'Alquiler');
  await fill('Forma de adquisición', 'Herencia');
});

await gotoStep(5);
await snap('step5-before');
await addRecord('step5', async () => {
  await pick('Tipo de bien mueble', 'Vehículo');
  await pick('Marca del bien mueble', 'BMW');
  await fill('Descripción', 'X6');
  await fill('Número de placa', 'ISO123');
  await fill('Año', '2026');
  await fill('Valor de mercado', '6680528100');
  await fill('Observación', 'No aplica');
});

await gotoStep(8);
await snap('step8-before');
await addRecord('step8', async () => {
  await pick('Entidad financiera', 'Grupo Mutual');
  await fill('Tipo de préstamo', 'Personal');
  await pick('Moneda', 'Colones');
  await fill('Número de préstamo', 'PR-••••-0418');
  await fill('Monto inicial', '10000000');
  await fill('Saldo actual', '5000000');
  await fill('Monto cuota', '2500000');
  await fill('Fecha de conclusión', '20052027');
});

await gotoStep(12);
await snap('step12');
await step('cierre', async () => {
  await clickText('Terminar');
  await sleep(1500);
  await snap('oath');
  await clickText('Guardar');
  await sleep(900);
  await snap('confirm');
  await clickText('Guardar', '[role="dialog"] button,[role="alertdialog"] button');
  await sleep(250);
  await snap('sending');
  await page.waitForFunction(
    () => [...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Guardado'),
    { timeout: 20000 }
  );
  await sleep(600);
  await snap('saved');
});

await browser.close();
