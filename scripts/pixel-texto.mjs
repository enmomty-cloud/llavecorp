// Genera <rect> de una fuente pixel 5x7 propia, para que el logo sea 100% rellenos imprimibles.
// Uso: node scripts/pixel-texto.mjs LLAVECORP 22 60 4   (texto, x, y, tamaño de celda)

const GLIFOS = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

export function textoARects(texto, x0, y0, celda) {
  const rects = [];
  let x = x0;
  for (const letra of texto.toUpperCase()) {
    const g = GLIFOS[letra];
    if (!g) throw new Error(`Sin glifo para "${letra}"`);
    g.forEach((fila, fy) => {
      [...fila].forEach((bit, fx) => {
        if (bit === '1') rects.push(`<rect x="${x + fx * celda}" y="${y0 + fy * celda}" width="${celda}" height="${celda}"/>`);
      });
    });
    x += 6 * celda; // 5 de ancho + 1 de espacio
  }
  return { rects, ancho: texto.length * 6 * celda - celda, alto: 7 * celda };
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('pixel-texto.mjs')) {
  const [texto = 'LLAVECORP', x = '0', y = '0', celda = '4'] = process.argv.slice(2);
  const r = textoARects(texto, Number(x), Number(y), Number(celda));
  console.log(`<!-- ${texto}: ancho ${r.ancho}, alto ${r.alto} -->`);
  console.log(r.rects.join('\n'));
}
