import { describe, it, expect } from 'vitest';
import { waLink, mensaje } from '../src/lib/whatsapp';

describe('mensaje', () => {
  it('producto básico', () => {
    expect(mensaje('producto', { nombre: 'Gato de la suerte', variante: 'basico' }))
      .toBe('Hola, vi LlaveCorp y quiero el llavero *Gato de la suerte* (básico).');
  });
  it('producto con NFC', () => {
    expect(mensaje('producto', { nombre: 'Casete', variante: 'nfc' }))
      .toBe('Hola, vi LlaveCorp y quiero el llavero *Casete* (con NFC).');
  });
  it('editable agrega campos de texto y colores', () => {
    expect(mensaje('editable', { nombre: 'Placa', variante: 'basico' }))
      .toBe('Hola, vi LlaveCorp y quiero el llavero *Placa* (básico). Texto/nombre: ___ · Colores: ___');
  });
  it('diseño nuevo no lleva precio', () => {
    expect(mensaje('nuevo')).toBe('Hola, quiero cotizar un diseño nuevo. Idea: ___ · Tamaño aprox: ___ · Colores: ___');
  });
  it('avísame, instructivo, hola', () => {
    expect(mensaje('avisame')).toBe('Hola, avísame cuando anden por ___');
    expect(mensaje('instructivo')).toBe('Hola, vi el instructivo de mi llavero y quiero...');
    expect(mensaje('hola')).toBe('Hola, vi LlaveCorp y tengo una duda.');
  });
});

describe('waLink', () => {
  it('usa wa.me con el número de config y texto codificado', () => {
    const url = waLink('hola');
    expect(url.startsWith('https://wa.me/')).toBe(true);
    expect(url).toContain('?text=');
    expect(decodeURIComponent(url.split('?text=')[1])).toBe('Hola, vi LlaveCorp y tengo una duda.');
  });
  it('quita todo lo que no sea dígito del número', () => {
    expect(waLink('hola', undefined, '+52 (81) 1234-5678')).toContain('https://wa.me/528112345678?');
  });
});
