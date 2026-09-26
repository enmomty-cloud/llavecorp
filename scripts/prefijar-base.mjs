// Reescribe las rutas absolutas de dist/ (href="/...", src="/...", url(/...)) para servir el sitio bajo una subruta,
// como https://usuario.github.io/llavecorp/. Solo se usa en el workflow de GitHub Pages; en llavecorp.com no hace falta.
// Uso: node scripts/prefijar-base.mjs /llavecorp
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const base = (process.argv[2] ?? '').replace(/\/$/, '');
if (!base.startsWith('/')) { console.error('Uso: node scripts/prefijar-base.mjs /subruta'); process.exit(1); }
const nombre = base.slice(1);

function* archivos(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) yield* archivos(p);
    else if (/\.(html|css|xml|txt)$/.test(e)) yield p;
  }
}

// No toca "//" (URLs sin esquema) ni rutas que ya traen el prefijo.
const patrones = [
  [new RegExp(`(href|src|content)="/(?!/)(?!${nombre}/)`, 'g'), `$1="${base}/`],
  [new RegExp(`url\\((['"]?)/(?!/)(?!${nombre}/)`, 'g'), `url($1${base}/`],
];

let cambiados = 0;
for (const p of archivos('dist')) {
  const antes = readFileSync(p, 'utf8');
  let despues = antes;
  for (const [re, rep] of patrones) despues = despues.replace(re, rep);
  if (despues !== antes) { writeFileSync(p, despues); cambiados++; }
}
console.log(`Prefijo ${base} aplicado en ${cambiados} archivos.`);
