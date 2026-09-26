import marca from '../config/marca.json';

export type TipoMensaje =
  | 'producto' | 'editable' | 'nuevo' | 'evento' | 'avisame' | 'instructivo' | 'hola';
export type Variante = 'basico' | 'nfc';
export type DatosMensaje = { nombre?: string; variante?: Variante };

const variante = (v?: Variante) => (v === 'nfc' ? 'con NFC' : 'básico');

export function mensaje(tipo: TipoMensaje, datos: DatosMensaje = {}): string {
  const base = `Hola, vi ${marca.marca} y quiero el llavero *${datos.nombre ?? ''}* (${variante(datos.variante)}).`;
  const entrega = ' Entrega: ___';
  switch (tipo) {
    case 'producto': return base + entrega;
    case 'editable': return `${base} Texto/nombre: ___ · Colores: ___` + entrega;
    case 'nuevo': return 'Hola, quiero cotizar un diseño nuevo. Idea: ___ · Tamaño aprox: ___ · Colores: ___';
    case 'evento': return 'Hola, quiero cotizar llaveros de recuerdo para mi evento. Boda o XV: ___ · Fecha: ___ · Cantidad aprox: ___ · Nombres: ___';
    case 'avisame': return 'Hola, avísame cuando anden por ___';
    case 'instructivo': return 'Hola, vi el instructivo de mi llavero y quiero...';
    case 'hola': return `Hola, vi ${marca.marca} y tengo una duda.`;
  }
}

/** Arma el enlace wa.me con el mensaje prellenado. El número viene de marca.json salvo que se pase otro. */
export function waLink(tipo: TipoMensaje, datos?: DatosMensaje, numero: string = marca.whatsapp): string {
  const digitos = numero.replace(/\D/g, '');
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje(tipo, datos))}`;
}
