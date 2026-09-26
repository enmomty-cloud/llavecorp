// Calcula el hash SHA-256 del script inline del tema (el único inline del sitio) para la CSP de nginx.
// Uso: npm run build && node scripts/csp-hash.mjs
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const html = readFileSync('dist/index.html', 'utf8');
const inlines = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (inlines.length !== 1) {
  console.error(`Se esperaba 1 script inline y hay ${inlines.length}. Revisa Base.astro y la CSP.`);
  process.exit(1);
}
const hash = createHash('sha256').update(inlines[0]).digest('base64');
console.log(`'sha256-${hash}'`);
