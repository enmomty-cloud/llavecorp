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
});
