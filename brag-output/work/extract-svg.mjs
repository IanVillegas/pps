// Copia el SVG embebido de los componentes de src/assets/images a work/.
import fs from 'node:fs';

for (const n of ['LogoGrupoMutual', 'LoginWave1', 'LoginWave2', 'LoginWave3']) {
  const src = fs.readFileSync(`src/assets/images/${n}.tsx`, 'utf8');
  const m = [...src.matchAll(/`(<svg [\s\S]*?<\/svg>)`/g)].pop();
  fs.writeFileSync(`brag-output/work/${n}.svg`, m[1]);
  const fills = [...new Set(m[1].match(/(fill|stop-color|opacity)="[^"]+"/g) ?? [])].slice(0, 8);
  console.log(n, m[1].length, fills.join(' '));
}
