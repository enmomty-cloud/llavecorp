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
