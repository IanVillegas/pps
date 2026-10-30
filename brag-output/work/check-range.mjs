// Lee el valor Y codificado del fondo gris (#f3f5f6) y lo convierte como lo haria un reproductor
// que asume rango de video (Y 16..235 -> 0..255), que es lo comun en Windows, QuickTime y PowerPoint.
import { execFileSync } from 'node:child_process';

const meanY = file => {
  const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-ss', '24', '-i', file, '-frames:v', '1',
    '-vf', 'crop=40:20:1000:60,extractplanes=y', '-f', 'rawvideo', '-'], { maxBuffer: 1 << 24 });
  return raw.reduce((s, v) => s + v, 0) / raw.length;
};
for (const f of process.argv.slice(2)) {
  const y = meanY(f);
  const shown = Math.min(255, Math.round(((y - 16) * 255) / 219));
  console.log(`${f}: Y codificado ${y.toFixed(1)} -> el reproductor muestra luma ${shown}${shown >= 255 ? ' (recortado a blanco)' : ''}`);
}
console.log('esperado para #f3f5f6: luma ~244');
