import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const leer = (ruta: string) => readFileSync(`dist/${ruta}`, 'utf8');
const hayDist = existsSync('dist/index.html');

describe.skipIf(!hayDist)('dist generado', () => {
  it('index tiene lang es-MX y la marca', () => {
    const html = leer('index.html');
    expect(html).toContain('lang="es-MX"');
    expect(html).toContain('LlaveCorp');
  });

  it('inicio tiene todas las secciones y Desde $60', () => {
    const html = leer('index.html');
    for (const id of ['inicio', 'nfc', 'catalogo', 'hazlo-tuyo', 'donde']) expect(html).toContain(`id="${id}"`);
    expect(html).toContain('Desde $60');
    expect(html).toContain('puedes elegir cuáles, no cuántos');
  });

  it('la tarjeta de un producto editable lleva el mensaje editable', () => {
    const html = leer('index.html');
    expect(html).toContain('Texto%2Fnombre');
    expect(html).toContain('etiqueta--editable');
  });

  it('existen páginas de saga y de producto', () => {
    expect(existsSync('dist/saga/anime/index.html')).toBe(true);
    expect(existsSync('dist/llavero/gato-suerte/index.html')).toBe(true);
  });

  it('la cápsula sorpresa no ofrece botón Con NFC', () => {
    const html = leer('llavero/capsula-sorpresa/index.html');
    expect(html).not.toContain('>Con NFC<');
  });

  it('todo botón de WhatsApp apunta a wa.me', () => {
    const html = leer('index.html');
    const enlaces = html.match(/class="btn btn--wa[^"]*" href="([^"]+)"/g) ?? [];
    expect(enlaces.length).toBeGreaterThan(3);
    for (const e of enlaces) expect(e).toContain('https://wa.me/');
  });
});

describe.skipIf(!hayDist)('instructivo /activa', () => {
  it('tiene los tres niveles, consejos, guardar y enlaces a NFC Tools', () => {
    const html = leer('activa/index.html');
    for (const id of ['nivel-1', 'nivel-2', 'nivel-3', 'consejos', 'guardar']) expect(html).toContain(`id="${id}"`);
    expect(html).toContain('play.google.com');
    expect(html).toContain('apps.apple.com');
    expect(html).toContain('No bloquees');
    expect(html).toContain('Nuevo objeto obtenido');
  });
  it('el tutorial de wifi tiene botón de logro y POWER UP', () => {
    const html = leer('activa/wifi/index.html');
    expect(html).toContain('data-logro="wifi"');
    expect(html).toContain('POWER UP');
  });
});

describe.skipIf(!hayDist)('etapa 3: conversión', () => {
  it('inicio tiene cápsula, regalos, coleccionista, vende y taller', () => {
    const html = leer('index.html');
    for (const id of ['capsula', 'regalos', 'coleccionista', 'vende', 'taller']) expect(html).toContain(`id="${id}"`);
    expect(html).toContain('Quiero una cápsula');
  });
  it('existen /donde y /mayoreo con sus contenidos', () => {
    expect(existsSync('dist/donde/index.html')).toBe(true);
    const mayoreo = leer('mayoreo/index.html');
    expect(mayoreo).toContain('50 o más');
    expect(mayoreo).toContain('Cantidad%20aprox');
  });
});

describe.skipIf(!hayDist)('etapa 4: salida', () => {
  it('sitemap, robots y Open Graph con PNG', () => {
    expect(existsSync('dist/sitemap-index.xml')).toBe(true);
    expect(existsSync('dist/robots.txt')).toBe(true);
    expect(existsSync('dist/og/default.png')).toBe(true);
    const html = leer('index.html');
    expect(html).toContain('og:image');
    expect(html).toContain('/og/default.png');
  });
  it('fuentes alojadas en el sitio, nada de Google Fonts', () => {
    const html = leer('index.html');
    expect(html).toContain('/fonts/press-start-2p-latin.woff2');
    expect(html).not.toContain('fonts.googleapis.com');
    expect(existsSync('dist/fonts/space-grotesk-latin.woff2')).toBe(true);
  });
  it('sin analítica cuando el token está vacío', () => {
    expect(leer('index.html')).not.toContain('cloudflareinsights');
  });
  it('botones de tema y sonido en todas las páginas', () => {
    for (const r of ['index.html', 'activa/index.html', 'mayoreo/index.html']) {
      const html = leer(r);
      expect(html).toContain('data-toggle-tema');
      expect(html).toContain('data-toggle-sonido');
    }
  });
  it('no aparecen marcas registradas de terceros', () => {
    const html = leer('index.html') + leer('activa/index.html');
    expect(html.toLowerCase()).not.toMatch(/goku|naruto|pok[eé]mon|nintendo|dragon ball|pikachu|sailor moon/);
  });
});
