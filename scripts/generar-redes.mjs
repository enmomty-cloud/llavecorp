// Genera el kit de redes (Instagram, Facebook) en marketing/redes/ con el mismo sistema visual del sitio.
// Todo es SVG propio: logo, mascota, cartuchos, cápsula. Sin fotos, sin personas.
// Uso: node scripts/generar-redes.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import marca from '../src/config/marca.json' with { type: 'json' };

const C = { fondo: '#fbf4dc', tinta: '#1a1433', crema: '#fffaea', rojo: '#e4342b', cian: '#19c3d6', amarillo: '#ffd23f', verde: '#28d17c', gris: '#4d4666' };
const promo = marca.promocion;
const salida = 'marketing/redes';
mkdirSync(salida, { recursive: true });

const fuentes = { fontFiles: ['marketing/fuentes/press-start-2p.ttf', 'marketing/fuentes/pixelify-sans.ttf'], loadSystemFonts: false, defaultFontFamily: 'Pixelify Sans' };
const PIX = "font-family='Press Start 2P'";
const TXT = "font-family='Pixelify Sans'";

// ---------- piezas ----------
const logoInner = readFileSync('public/logo/llavecorp.svg', 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace('</svg>', '');
const emblemaInner = logoInner.replace(/<g fill="#1a1433" transform="translate\(14 112\)">[\s\S]*?<\/g>\s*$/, '');
const producto = (slug) => readFileSync(`public/img/productos/${slug}.svg`, 'utf8')
  .replace(/^[\s\S]*?<svg[^>]*>/, '').replace('</svg>', '')
  .replace(/<defs>[\s\S]*?<\/defs>/, '').replace(/<rect width="400" height="400"[^>]*\/>/g, '').replace(/<text[\s\S]*?<\/text>/, '');

const mascota = (estado = 'saluda') => {
  const ojos = estado === 'poder'
    ? `<g fill="${C.tinta}"><rect x="32" y="30" width="4" height="4"/><rect x="36" y="26" width="4" height="4"/><rect x="40" y="30" width="4" height="4"/><rect x="52" y="30" width="4" height="4"/><rect x="56" y="26" width="4" height="4"/><rect x="60" y="30" width="4" height="4"/></g>`
    : `<g fill="${C.tinta}"><rect x="32" y="24" width="8" height="12"/><rect x="56" y="24" width="8" height="12"/></g><rect x="34" y="26" width="2" height="2" fill="${C.crema}"/><rect x="58" y="26" width="2" height="2" fill="${C.crema}"/>`;
  const boca = estado === 'sorpresa' ? `<rect x="44" y="42" width="8" height="8" fill="${C.tinta}"/>`
    : `<g fill="${C.tinta}"><rect x="40" y="44" width="4" height="4"/><rect x="44" y="48" width="8" height="4"/><rect x="52" y="44" width="4" height="4"/></g>`;
  const extra = estado === 'poder' ? `<g fill="${C.amarillo}"><rect x="4" y="12" width="8" height="4"/><rect x="84" y="12" width="8" height="4"/><rect x="0" y="40" width="8" height="4"/><rect x="88" y="40" width="8" height="4"/><rect x="8" y="24" width="4" height="8"/><rect x="84" y="24" width="4" height="8"/></g>`
    : estado === 'sorpresa' ? `<g fill="${C.amarillo}"><rect x="80" y="0" width="8" height="20"/><rect x="80" y="24" width="8" height="8"/></g>` : '';
  const brazos = estado === 'saluda' ? `<g fill="${C.tinta}"><rect x="24" y="78" width="12" height="6"/><rect x="72" y="56" width="6" height="22"/><rect x="66" y="76" width="6" height="6"/></g>`
    : `<g fill="${C.tinta}"><rect x="24" y="80" width="12" height="6"/><rect x="60" y="88" width="12" height="6"/></g>`;
  return `<g shape-rendering="crispEdges">${extra}
    <rect x="16" y="4" width="64" height="56" rx="14" fill="${C.tinta}"/><rect x="20" y="8" width="56" height="48" rx="12" fill="${C.crema}"/>
    ${ojos}<rect x="26" y="38" width="6" height="4" fill="${C.rojo}"/><rect x="64" y="38" width="6" height="4" fill="${C.rojo}"/>${boca}
    <rect x="24" y="60" width="48" height="10" fill="${C.rojo}"/><rect x="60" y="70" width="10" height="16" fill="${C.rojo}"/>
    <rect x="36" y="70" width="24" height="46" fill="${C.tinta}"/><rect x="40" y="74" width="16" height="38" fill="${C.crema}"/>
    <rect x="60" y="100" width="12" height="8" fill="${C.tinta}"/><rect x="60" y="112" width="16" height="8" fill="${C.tinta}"/>${brazos}</g>`;
};

const capsula = (abierta = true) => {
  const sep = abierta ? 14 : 0;
  return `<g>
    <g transform="translate(0 ${-sep})"><path d="M8 60 A52 52 0 0 1 112 60 Z" fill="${C.tinta}"/><path d="M14 60 A46 46 0 0 1 106 60 Z" fill="${C.rojo}"/><rect x="30" y="26" width="10" height="6" fill="${C.crema}" opacity=".8"/></g>
    <g transform="translate(0 ${sep})"><path d="M8 60 A52 52 0 0 0 112 60 Z" fill="${C.tinta}"/><path d="M14 60 A46 46 0 0 0 106 60 Z" fill="${C.crema}"/></g>
    ${abierta ? `<g fill="${C.tinta}" transform="translate(48 44)"><rect x="4" y="0" width="16" height="4"/><rect x="0" y="4" width="4" height="8"/><rect x="20" y="4" width="4" height="8"/><rect x="16" y="12" width="4" height="4"/><rect x="10" y="16" width="6" height="4"/><rect x="10" y="20" width="4" height="4"/><rect x="10" y="28" width="4" height="4"/></g>` : `<rect x="8" y="56" width="104" height="8" fill="${C.tinta}"/>`}
  </g>`;
};

const fondo = (w, h) => `<defs><pattern id="h" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="1.8" fill="${C.tinta}" opacity=".13"/></pattern></defs>
  <rect width="${w}" height="${h}" fill="${C.fondo}"/><rect width="${w}" height="${h}" fill="url(#h)"/>
  <rect x="0" y="0" width="${w}" height="16" fill="${C.rojo}"/><rect x="0" y="${h - 16}" width="${w}" height="16" fill="${C.cian}"/>`;

// Ventana 90s como en el sitio
const ventana = (x, y, w, h, titulo, tono, cuerpo) => `<g transform="translate(${x} ${y})">
  <rect x="6" y="6" width="${w}" height="${h}" fill="${C.tinta}"/>
  <rect x="0" y="0" width="${w}" height="${h}" fill="${C.crema}" stroke="${C.tinta}" stroke-width="5"/>
  <rect x="0" y="0" width="${w}" height="46" fill="${tono}" stroke="${C.tinta}" stroke-width="5"/>
  <text x="18" y="31" ${PIX} font-size="16" fill="${C.tinta}">${titulo}</text>
  <rect x="${w - 52}" y="14" width="16" height="16" fill="${C.crema}" stroke="${C.tinta}" stroke-width="3"/><rect x="${w - 30}" y="14" width="16" height="16" fill="${C.crema}" stroke="${C.tinta}" stroke-width="3"/>
  <g transform="translate(0 46)">${cuerpo}</g></g>`;

const boton = (x, y, w, texto, color = C.verde, textoColor = C.tinta) => `<g transform="translate(${x} ${y})">
  <rect x="6" y="6" width="${w}" height="64" fill="${C.tinta}"/><rect x="0" y="0" width="${w}" height="64" fill="${color}" stroke="${C.tinta}" stroke-width="5"/>
  <text x="${w / 2}" y="41" text-anchor="middle" ${PIX} font-size="18" fill="${textoColor}">${texto}</text></g>`;

const render = (nombre, w, h, cuerpo) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${fondo(w, h)}${cuerpo}</svg>`;
  const png = new Resvg(svg, { font: fuentes, fitTo: { mode: 'width', value: w } }).render().asPng();
  writeFileSync(`${salida}/${nombre}-${w}x${h}.png`, png);
  console.log(`${nombre}-${w}x${h}.png`, Math.round(png.length / 1024), 'KB');
};

// ---------- 1. Foto de perfil ----------
render('perfil', 1080, 1080, `<g transform="translate(160 388) scale(3.17)" shape-rendering="crispEdges">${emblemaInner}</g>`);

// ---------- 2. Post: promoción de lanzamiento ----------
render('promo', 1080, 1080, `
  <g transform="translate(90 70) scale(1.5)" shape-rendering="crispEdges">${logoInner}</g>
  <g transform="translate(820 30) scale(2.1)">${mascota('poder')}</g>
  <text x="90" y="360" ${PIX} font-size="34" fill="${C.tinta}">PROMO DE LANZAMIENTO</text>
  <text x="90" y="410" ${TXT} font-size="30" fill="${C.gris}">Cada pedido desde la página suma un sello.</text>
  ${ventana(90, 450, 430, 300, `SELLO ${promo.sellos_llavero}`, C.verde, `
    <text x="20" y="60" ${PIX} font-size="22" fill="${C.tinta}">LLAVERO CON</text>
    <text x="20" y="96" ${PIX} font-size="22" fill="${C.tinta}">TU NOMBRE</text>
    <text x="20" y="150" ${PIX} font-size="34" fill="${C.rojo}">GRATIS</text>
    <text x="20" y="205" ${TXT} font-size="26" fill="${C.gris}">En tu quinto pedido.</text>`)}
  ${ventana(560, 450, 430, 300, `SELLO ${promo.sellos_capsula}`, C.rojo, `
    <g transform="translate(270 20) scale(1.2)">${capsula(true)}</g>
    <text x="20" y="60" ${PIX} font-size="22" fill="${C.tinta}">ABRES LA</text>
    <text x="20" y="96" ${PIX} font-size="22" fill="${C.tinta}">SORPRESA</text>
    <text x="20" y="150" ${TXT} font-size="26" fill="${C.gris}">Un modelo al azar,</text>
    <text x="20" y="182" ${TXT} font-size="26" fill="${C.gris}">gratis, en el décimo.</text>`)}
  <text x="90" y="830" ${TXT} font-size="26" fill="${C.gris}">Solo pedidos por WhatsApp desde la página. Para canjear,</text>
  <text x="90" y="864" ${TXT} font-size="26" fill="${C.gris}">muestra que nos sigues en Instagram y Facebook.</text>
  ${boton(90, 920, 520, 'PIDE EN EL LINK DE LA BIO')}
  <text x="660" y="962" ${PIX} font-size="14" fill="${C.gris}">Promoción de introducción.</text>
  <text x="660" y="988" ${PIX} font-size="14" fill="${C.gris}">Puede terminar sin aviso.</text>`);

// ---------- 3. Post: cartuchos ----------
render('cartuchos', 1080, 1080, `
  <g transform="translate(90 70) scale(1.5)" shape-rendering="crispEdges">${logoInner}</g>
  <g transform="translate(120 330) scale(1.15)">${producto('cartucho-8bits')}</g>
  <g transform="translate(560 360) scale(1.15)">${producto('cartucho-16bits')}</g>
  <text x="90" y="800" ${PIX} font-size="34" fill="${C.tinta}">CARTUCHOS 8 Y 16 BITS</text>
  <text x="90" y="850" ${TXT} font-size="30" fill="${C.gris}">El de 16 bits con tu nombre en la etiqueta. Con chip NFC si quieres.</text>
  <text x="90" y="905" ${PIX} font-size="26" fill="${C.rojo}">DESDE $75</text>
  ${boton(600, 900, 390, 'LINK EN LA BIO')}`);

// ---------- 4. Post: con poder NFC ----------
render('nfc', 1080, 1080, `
  <g transform="translate(90 70) scale(1.5)" shape-rendering="crispEdges">${logoInner}</g>
  ${ventana(90, 330, 900, 380, 'LA MAGIA', C.verde, `
    <g transform="translate(60 40) scale(3.2)" shape-rendering="crispEdges">
      <rect x="0" y="0" width="64" height="48" rx="24" fill="${C.tinta}"/>
      <rect x="16" y="14" width="12" height="4" fill="${C.crema}"/><rect x="16" y="26" width="12" height="4" fill="${C.crema}"/><rect x="16" y="18" width="4" height="8" fill="${C.crema}"/><rect x="28" y="18" width="12" height="4" fill="${C.crema}"/><rect x="36" y="22" width="4" height="4" fill="${C.crema}"/>
      <g fill="${C.verde}"><rect x="76" y="16" width="6" height="16"/><rect x="88" y="8" width="6" height="32"/><rect x="100" y="0" width="6" height="48"/></g>
      <rect x="120" y="-24" width="60" height="96" rx="8" fill="${C.tinta}"/><rect x="126" y="-14" width="48" height="72" fill="${C.cian}"/><rect x="146" y="62" width="8" height="6" fill="${C.crema}"/>
    </g>
    <text x="700" y="90" ${PIX} font-size="20" fill="${C.tinta}">TOCA</text>
    <text x="700" y="130" ${PIX} font-size="20" fill="${C.tinta}">Y LISTO</text>
    <text x="700" y="190" ${TXT} font-size="24" fill="${C.gris}">Sin pilas.</text>
    <text x="700" y="222" ${TXT} font-size="24" fill="${C.gris}">Sin app rara.</text>
    <text x="700" y="254" ${TXT} font-size="24" fill="${C.gris}">Sin que le reces.</text>`)}
  <text x="90" y="800" ${PIX} font-size="30" fill="${C.tinta}">LLAVEROS CON PODER NFC</text>
  <text x="90" y="850" ${TXT} font-size="28" fill="${C.gris}">Abre tu Wi-Fi, tu WhatsApp, tus redes o la placa</text>
  <text x="90" y="884" ${TXT} font-size="28" fill="${C.gris}">de tu mascota con solo acercarlo al celular.</text>
  ${boton(90, 930, 420, 'VER EL INSTRUCTIVO', C.amarillo)}
  <g transform="translate(860 880) scale(1.4)">${mascota('sorpresa')}</g>`);

// ---------- 5. Historia: promoción ----------
render('promo-historia', 1080, 1920, `
  <g transform="translate(240 120) scale(2.5)" shape-rendering="crispEdges">${logoInner}</g>
  <g transform="translate(400 540) scale(3)">${mascota('poder')}</g>
  <text x="540" y="1000" text-anchor="middle" ${PIX} font-size="34" fill="${C.tinta}">PROMO DE LANZAMIENTO</text>
  ${ventana(90, 1060, 900, 200, `SELLO ${promo.sellos_llavero}`, C.verde, `
    <text x="24" y="70" ${PIX} font-size="26" fill="${C.tinta}">LLAVERO CON TU NOMBRE</text>
    <text x="24" y="120" ${PIX} font-size="34" fill="${C.rojo}">GRATIS</text>`)}
  ${ventana(90, 1300, 900, 200, `SELLO ${promo.sellos_capsula}`, C.rojo, `
    <g transform="translate(720 10) scale(1.2)">${capsula(true)}</g>
    <text x="24" y="70" ${PIX} font-size="26" fill="${C.tinta}">ABRES LA SORPRESA</text>
    <text x="24" y="120" ${TXT} font-size="30" fill="${C.gris}">Un modelo al azar, gratis.</text>`)}
  <text x="540" y="1590" text-anchor="middle" ${TXT} font-size="28" fill="${C.gris}">Solo pedidos por WhatsApp desde la página.</text>
  <text x="540" y="1628" text-anchor="middle" ${TXT} font-size="28" fill="${C.gris}">Para canjear, muestra que nos sigues en IG y FB.</text>
  ${boton(240, 1690, 600, 'PIDE EN EL LINK DE LA BIO')}
  <text x="540" y="1830" text-anchor="middle" ${PIX} font-size="14" fill="${C.gris}">Promoción de introducción. Puede terminar sin aviso.</text>`);

// ---------- 6. Portada de Facebook (zona segura centrada: 640 de ancho) ----------
render('portada-facebook', 820, 312, `
  <g transform="translate(120 60) scale(1.25)" shape-rendering="crispEdges">${logoInner}</g>
  <g transform="translate(470 40) scale(0.55)">${producto('cartucho-8bits')}</g>
  <g transform="translate(600 60) scale(0.5)">${producto('cartucho-16bits')}</g>
  <text x="120" y="290" ${PIX} font-size="12" fill="${C.gris}">LLAVEROS 3D CON PODER NFC · ${marca.ciudad.toUpperCase()}</text>`);

// ---------- 7. Post de Facebook (horizontal) ----------
render('promo-facebook', 1200, 630, `
  <g transform="translate(70 60) scale(1.6)" shape-rendering="crispEdges">${logoInner}</g>
  <g transform="translate(520 40) scale(1.6)">${mascota('poder')}</g>
  <text x="70" y="360" ${PIX} font-size="24" fill="${C.tinta}">PROMO DE LANZAMIENTO</text>
  <text x="70" y="410" ${TXT} font-size="26" fill="${C.gris}">Quinto pedido: llavero con tu nombre gratis.</text>
  <text x="70" y="446" ${TXT} font-size="26" fill="${C.gris}">Décimo pedido: abres la cápsula y te llevas uno al azar.</text>
  <text x="70" y="486" ${TXT} font-size="20" fill="${C.gris}">Solo pedidos desde la página.</text>
  <text x="70" y="512" ${TXT} font-size="20" fill="${C.gris}">Para canjear, muestra que nos sigues en IG y FB.</text>
  ${boton(70, 530, 360, 'PIDE POR WHATSAPP')}
  ${ventana(760, 300, 370, 250, 'SELLO 10', C.rojo, `<g transform="translate(120 20) scale(1.3)">${capsula(true)}</g>`)}`);

console.log('Kit de redes listo en', salida);
