// Servidor estatico de solo lectura: raiz del repo, y /_next/* desde work/snap/_next.
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

const WORK = path.dirname(new URL(import.meta.url).pathname.slice(1));
const ROOT = path.resolve(WORK, '../..');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.css': 'text/css', '.jpg': 'image/jpeg', '.js': 'text/javascript',
};

export const serve = (port = 4123) =>
  new Promise(resolve => {
    const server = http.createServer((req, res) => {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const file = p.startsWith('/_next/') ? path.join(WORK, 'snap', p) : path.join(ROOT, p);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
