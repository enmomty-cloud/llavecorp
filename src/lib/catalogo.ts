import sagasJson from '../data/sagas.json';
import productosJson from '../data/productos.json';
import marca from '../config/marca.json';

export type Saga = { slug: string; nombre: string; descripcion: string; icono: string; orden: number };
export type Producto = {
  slug: string; nombre: string; saga: string; descripcion: string; tamano: string;
  precio_basico: number; precio_nfc: number; colores: number;
  editable: boolean; texto_editable: boolean; colores_editables: boolean;
  imagen: string; destacado: boolean; disponible: boolean;
};

/** Regresa la lista de errores del catálogo; vacía si todo está bien. */
export function validarCatalogo(productos: Producto[], sagas: Saga[], minimo: number): string[] {
  const errores: string[] = [];
  const slugsSaga = new Set(sagas.map(s => s.slug));
  const vistos = new Set<string>();
  for (const p of productos) {
    if (vistos.has(p.slug)) errores.push(`Producto "${p.slug}": slug repetido`);
    vistos.add(p.slug);
    if (!slugsSaga.has(p.saga)) errores.push(`Producto "${p.slug}": saga "${p.saga}" no existe`);
    if (p.colores < 1 || p.colores > 4) errores.push(`Producto "${p.slug}": colores debe ser 1..4`);
    if (p.precio_nfc < 0) errores.push(`Producto "${p.slug}": precio_nfc no puede ser negativo`);
    if (p.disponible && p.precio_basico < minimo) errores.push(`Producto "${p.slug}": precio_basico ${p.precio_basico} menor al mínimo ${minimo}`);
    if (p.disponible && p.precio_nfc > 0 && p.precio_nfc < minimo) errores.push(`Producto "${p.slug}": precio_nfc ${p.precio_nfc} menor al mínimo ${minimo}`);
  }
  return errores;
}

export function getSagas(): Saga[] {
  return [...(sagasJson as Saga[])].sort((a, b) => a.orden - b.orden);
}

/** Todos los productos, validados. Lanza error (y rompe el build) si el catálogo es inválido. */
export function getProductos(): Producto[] {
  const productos = productosJson as Producto[];
  const errores = validarCatalogo(productos, getSagas(), marca.precio_minimo);
  if (errores.length) throw new Error(`Catálogo inválido:\n- ${errores.join('\n- ')}`);
  return productos;
}

export const productosPorSaga = (slug: string) => getProductos().filter(p => p.saga === slug);
export const destacados = () => getProductos().filter(p => p.destacado && p.disponible);
export const getProducto = (slug: string) => getProductos().find(p => p.slug === slug);
export const getSaga = (slug: string) => getSagas().find(s => s.slug === slug);

export function precioDesde(): number {
  const disponibles = getProductos().filter(p => p.disponible);
  return Math.min(...disponibles.map(p => p.precio_basico));
}
