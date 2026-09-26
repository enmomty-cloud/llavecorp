// Genera public/og/default.png (1200x630) a partir del logo y la mascota. Todo son rectángulos, sin fuentes externas.
// Uso: node scripts/generar-og.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { textoARects } from './pixel-texto.mjs';

const logo = readFileSync('public/logo/llavecorp.svg', 'utf8')
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace('</svg>', '');

const lema = textoARects('LLAVEROS CON PODER', 0, 0, 8); // 8 px por celda
const lemaX = Math.round((1200 - lema.ancho) / 2);

// Llavi saludando, copiado de Mascota.astro (estado saluda) con colores fijos.
const mascota = `
<g transform="translate(940 150) scale(3.2)" shape-rendering="crispEdges">
  <rect x="16" y="4" width="64" height="56" rx="14" fill="#1a1433"/><rect x="20" y="8" width="56" height="48" rx="12" fill="#fffaea"/>
  <g fill="#1a1433"><rect x="32" y="24" width="8" height="12"/><rect x="56" y="24" width="8" height="12"/></g>
  <rect x="34" y="26" width="2" height="2" fill="#fffaea"/><rect x="58" y="26" width="2" height="2" fill="#fffaea"/>
  <rect x="26" y="38" width="6" height="4" fill="#ff2e88"/><rect x="64" y="38" width="6" height="4" fill="#ff2e88"/>
  <g fill="#1a1433"><rect x="40" y="44" width="4" height="4"/><rect x="44" y="48" width="8" height="4"/><rect x="52" y="44" width="4" height="4"/></g>
  <rect x="24" y="60" width="48" height="10" fill="#ff2e88"/><rect x="60" y="70" width="10" height="16" fill="#ff2e88"/>
  <rect x="36" y="70" width="24" height="46" fill="#1a1433"/><rect x="40" y="74" width="16" height="38" fill="#fffaea"/>
  <rect x="60" y="100" width="12" height="8" fill="#1a1433"/><rect x="60" y="112" width="16" height="8" fill="#1a1433"/>
  <g fill="#1a1433"><rect x="24" y="78" width="12" height="6"/><rect x="72" y="56" width="6" height="22"/><rect x="66" y="76" width="6" height="6"/></g>
</g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><pattern id="h" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1.8" fill="#1a1433" opacity=".14"/></pattern></defs>
  <rect width="1200" height="630" fill="#fbf4dc"/>
  <rect width="1200" height="630" fill="url(#h)"/>
  <rect x="0" y="0" width="1200" height="14" fill="#ff2e88"/><rect x="0" y="616" width="1200" height="14" fill="#19c3d6"/>
  <g transform="translate(120 110) scale(2.6)" shape-rendering="crispEdges">${logo}</g>
  <g fill="#1a1433" transform="translate(${lemaX} 520)" shape-rendering="crispEdges">${lema.rects.join('')}</g>
  ${mascota}
</svg>`;

mkdirSync('public/og', { recursive: true });
writeFileSync('public/og/default.svg', svg);
const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
writeFileSync('public/og/default.png', png);
console.log(`OG generado: public/og/default.png (${png.length} bytes)`);
