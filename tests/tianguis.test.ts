import { describe, it, expect } from 'vitest';
import { getTianguisActivos, ordenDia } from '../src/lib/tianguis';

describe('tianguis', () => {
  it('solo activos y ordenados por día de la semana', () => {
    const p = getTianguisActivos();
    expect(p.length).toBeGreaterThan(0);
    expect(p.every(x => x.activo)).toBe(true);
    const idx = p.map(x => ordenDia(x.dia));
    expect([...idx].sort((a, b) => a - b)).toEqual(idx);
  });
  it('ordenDia acepta acentos y mayúsculas', () => {
    expect(ordenDia('Miércoles')).toBe(2);
    expect(ordenDia('sabado')).toBe(5);
  });
});
