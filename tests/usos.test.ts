import { describe, it, expect } from 'vitest';
import { getUsos, getUso, PASOS_BASE } from '../src/lib/usos';

describe('usos', () => {
  it('hay 11 usos con slugs únicos y el de volver apunta a llavecorp.com', () => {
    const u = getUsos();
    expect(u).toHaveLength(11);
    expect(new Set(u.map(x => x.slug)).size).toBe(11);
    expect(getUso('volver')?.pasos.join(' ')).toContain('llavecorp.com/activa');
  });
  it('todos tienen al menos un paso, consejo y compatibilidad válida', () => {
    for (const x of getUsos()) {
      expect(x.pasos.length).toBeGreaterThan(0);
      expect(x.consejo.length).toBeGreaterThan(0);
      expect(x.compatibilidad.length).toBeGreaterThan(0);
      expect(x.compatibilidad.every(c => c === 'android' || c === 'iphone')).toBe(true);
    }
  });
  it('la mochila advierte no poner dirección', () => {
    expect(getUso('mochila')?.consejo).toMatch(/No pongas la dirección/);
  });
  it('PASOS_BASE tiene 3 pasos', () => {
    expect(PASOS_BASE).toHaveLength(3);
  });
});
