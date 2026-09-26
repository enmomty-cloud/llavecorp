import usosJson from '../data/usos.json';

export type Compatibilidad = 'android' | 'iphone';
export type Uso = {
  slug: string; titulo: string; icono: string; descripcion_corta: string;
  compatibilidad: Compatibilidad[]; tipo_registro: string; pasos: string[]; consejo: string;
};

/** Los tres pasos comunes en NFC Tools; se muestran una vez en cada tutorial. */
export const PASOS_BASE = [
  'Abre NFC Tools y entra a la pestaña Escribir.',
  'Toca Agregar un registro y elige el tipo (URL, Wi-Fi, Contacto, Texto).',
  'Llena los datos, regresa, toca Escribir y acerca el llavero a la parte trasera del celular.',
];

export const getUsos = (): Uso[] => usosJson as Uso[];
export const getUso = (slug: string): Uso | undefined => getUsos().find(u => u.slug === slug);
