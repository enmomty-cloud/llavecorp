import { describe, it, expect } from 'vitest';
import { getSagas, getProductos, productosPorSaga, destacados, precioDesde, validarCatalogo, type Producto } from '../src/lib/catalogo';

const base: Producto = { slug: 'x', nombre: 'X', saga: 'retro', descripcion: '', tamano: '4 cm', precio_basico: 60, precio_nfc: 100,
  colores: 2, editable: false, texto_editable: false, colores_editables: false, imagen: '', destacado: false, disponible: true };
const sagas = getSagas();

describe('catálogo', () => {
  it('sagas ordenadas por orden', () => {
    expect(sagas.map(s => s.slug)).toEqual(['retro', 'aventura', 'anime', 'mascotas', 'nombre']);
  });
  it('los datos reales validan sin errores', () => {
    expect(validarCatalogo(getProductos(), sagas, 60)).toEqual([]);
  });
  it('productosPorSaga filtra', () => {
    expect(productosPorSaga('mascotas').every(p => p.saga === 'mascotas')).toBe(true);
    expect(productosPorSaga('mascotas').length).toBeGreaterThan(0);
  });
  it('destacados solo disponibles', () => {
    expect(destacados().every(p => p.destacado && p.disponible)).toBe(true);
  });
  it('precioDesde es el mínimo entre disponibles', () => {
    expect(precioDesde()).toBe(60);
  });
});

describe('validarCatalogo', () => {
  it('rechaza precio bajo el mínimo', () => {
    expect(validarCatalogo([{ ...base, precio_basico: 50 }], sagas, 60)[0]).toMatch(/x.*60/);
  });
  it('rechaza más de 4 colores o menos de 1', () => {
    expect(validarCatalogo([{ ...base, colores: 5 }], sagas, 60)).toHaveLength(1);
    expect(validarCatalogo([{ ...base, colores: 0 }], sagas, 60)).toHaveLength(1);
  });
  it('rechaza saga inexistente y slug repetido', () => {
    expect(validarCatalogo([{ ...base, saga: 'nope' }], sagas, 60)).toHaveLength(1);
    expect(validarCatalogo([base, { ...base }], sagas, 60)).toHaveLength(1);
  });
  it('permite precio_nfc 0 (sin chip) pero no negativo', () => {
    expect(validarCatalogo([{ ...base, precio_nfc: 0 }], sagas, 60)).toEqual([]);
    expect(validarCatalogo([{ ...base, precio_nfc: -1 }], sagas, 60)).toHaveLength(1);
  });
  it('no valida precio de productos no disponibles', () => {
    expect(validarCatalogo([{ ...base, precio_basico: 10, disponible: false }], sagas, 60)).toEqual([]);
  });
});
