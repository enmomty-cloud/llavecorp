# LlaveCorp — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el sitio estático de LlaveCorp: tienda de llaveros 3D con estilo "Canal de las 4", pedido por WhatsApp, e instructivo NFC en `/activa`.

**Architecture:** Astro 5 con salida estática. Todo el contenido variable vive en JSON (`src/config`, `src/data`) y se carga con funciones puras en `src/lib` que se prueban con Vitest. Las páginas y componentes `.astro` solo renderizan; el JavaScript del cliente (tema, sonido, progreso, easter eggs) es mejora progresiva en `src/scripts`.

**Tech Stack:** Node 24, Astro 5, TypeScript, Vitest, CSS propio con variables, Google Fonts (Press Start 2P, Space Grotesk), `@astrojs/sitemap`. Sin framework de UI.

**Spec:** `docs/superpowers/specs/2026-09-26-tienda-llaveros-canal-de-las-4-design.md`

## Global Constraints

- Marca **LlaveCorp**, dominio `llavecorp.com`, mascota **Llavi**, lema "Llaveros con poder", estilo "Canal de las 4".
- WhatsApp es el marcador `{{WHATSAPP}}` en `src/config/marca.json` hasta que el dueño lo entregue; el código nunca lo escribe en duro.
- Ningún personaje, nombre, logo ni frase registrada de anime, videojuegos o TV. Arte original o genérico.
- Precio mínimo de catálogo **60 MXN**; el build falla si un producto disponible queda por debajo.
- Máximo **4 colores** por llavero; los productos declaran `colores: 1..4`.
- Español mexicano, `lang="es-MX"`, tono chavoruco, nunca vulgar.
- Mobile-first, sin scroll horizontal desde 320 px, gutter 16 px, contraste AA en tema claro y noche arcade.
- Contenido visible sin JavaScript. `prefers-reduced-motion` apaga todo efecto. Sonido apagado por defecto.
- Sin cookies, sin backend, sin dependencias de tiempo de ejecución en servidor. `npm run build` produce `dist/` servible en nginx, Cloudflare Pages o Vercel.
- Commits con mensaje en español y la línea `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## Estructura de archivos

```
package.json, astro.config.mjs, tsconfig.json, vitest.config.ts, .gitignore, README.md
deploy/nginx.conf
public/
  favicon.svg
  logo/llavecorp.svg            logo a color (web)
  logo/llavecorp-mono.svg       un color
  logo/llavecorp-capas.svg      una capa <g id="capa-..."> por color, para extruir
  img/placeholders/{retro,anime,mascotas,nombre,capsula}.svg
src/
  config/marca.json             marca, dominio, whatsapp, mascota, precio_minimo, colores_disponibles, redes, analitica
  data/sagas.json productos.json tianguis.json mayoreo.json usos.json regalos.json
  lib/whatsapp.ts               waLink(tipo, datos) -> URL wa.me
  lib/catalogo.ts               getSagas, getProductos, productosPorSaga, precioDesde, validarCatalogo
  lib/usos.ts                   getUsos, getUso, PASOS_BASE
  lib/tianguis.ts               getTianguisActivos, ordenados por día
  styles/tokens.css             variables de color/tipografía, tema claro y noche arcade
  styles/base.css               reset, tipografía, layout, accesibilidad
  styles/componentes.css        ventana 90s, botones, tarjetas, etiquetas, paleta
  styles/efectos.css            scanlines, halftone, líneas de velocidad, parpadeo, cápsula
  layouts/Base.astro            <html lang="es-MX">, head, fuentes, OG, nav, pie, botón flotante
  components/Logo.astro Mascota.astro Ventana.astro BotonStart.astro Seccion.astro
             Emote.astro Precio.astro Paleta.astro EtiquetaEditable.astro TarjetaProducto.astro
             CabeceraSaga.astro BotonWhatsApp.astro Capsula.astro BarraCorazones.astro
             ToggleTema.astro ToggleSonido.astro
  pages/index.astro saga/[slug].astro llavero/[slug].astro activa/index.astro activa/[slug].astro
        donde.astro mayoreo.astro
  scripts/tema.ts sonido.ts progreso.ts easter.ts
tests/whatsapp.test.ts catalogo.test.ts usos.test.ts tianguis.test.ts dist.test.ts
```

---

## Etapa 1 — Base y tienda

### Task 1: Proyecto Astro, Vitest y configuración de marca

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `src/config/marca.json`, `src/pages/index.astro`, `tests/dist.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `src/config/marca.json` con la forma `Marca` (abajo). Todas las tareas lo importan como `import marca from '../config/marca.json'`.

- [ ] **Step 1: Crear package.json y config**

`package.json`:
```json
{
  "name": "llavecorp",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "verificar": "astro build && vitest run"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://llavecorp.com',
  output: 'static',
  integrations: [sitemap()],
});
```

`tsconfig.json`:
```json
{ "extends": "astro/tsconfigs/strict", "compilerOptions": { "resolveJsonModule": true } }
```

`vitest.config.ts`:
```ts
import { getViteConfig } from 'astro/config';
export default getViteConfig({ test: { include: ['tests/**/*.test.ts'] } });
```

`src/config/marca.json`:
```json
{
  "marca": "LlaveCorp",
  "lema": "Llaveros con poder",
  "dominio": "llavecorp.com",
  "whatsapp": "{{WHATSAPP}}",
  "mascota": "Llavi",
  "ciudad": "Monterrey",
  "precio_minimo": 60,
  "redes": { "instagram": "", "tiktok": "", "facebook": "" },
  "tu_dia_url": "",
  "analitica_token": "",
  "colores_disponibles": [
    { "nombre": "Negro", "hex": "#111111" },
    { "nombre": "Blanco", "hex": "#f4f4f4" },
    { "nombre": "Rojo", "hex": "#e23b3b" },
    { "nombre": "Azul", "hex": "#2f6fe4" },
    { "nombre": "Amarillo", "hex": "#f4d03f" },
    { "nombre": "Verde", "hex": "#3ec26b" },
    { "nombre": "Rosa", "hex": "#ff6fb1" },
    { "nombre": "Morado", "hex": "#8e5bd6" }
  ]
}
```

`src/pages/index.astro` mínimo:
```astro
---
import marca from '../config/marca.json';
---
<html lang="es-MX"><head><meta charset="utf-8" /><title>{marca.marca}</title></head>
<body><h1>{marca.marca}</h1><p>{marca.lema}</p></body></html>
```

- [ ] **Step 2: Instalar dependencias**

Run: `npm install astro@^5 @astrojs/sitemap@^3 && npm install -D vitest@^3 typescript`
Expected: `node_modules/` creado, sin errores.

- [ ] **Step 3: Escribir prueba de dist**

`tests/dist.test.ts`:
```ts
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
```

- [ ] **Step 4: Build y prueba**

Run: `npm run verificar`
Expected: build sin errores, `dist/index.html` existe, 1 prueba pasa.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Proyecto Astro base con configuración de marca"
```

---

### Task 2: `waLink` — enlaces de WhatsApp

**Files:**
- Create: `src/lib/whatsapp.ts`, `tests/whatsapp.test.ts`

**Interfaces:**
- Produces:
```ts
export type TipoMensaje = 'producto' | 'editable' | 'nuevo' | 'capsula' | 'mayoreo' | 'avisame' | 'instructivo';
export function waLink(tipo: TipoMensaje, datos?: { nombre?: string; variante?: 'basico' | 'nfc' }): string;
export function mensaje(tipo: TipoMensaje, datos?: {...}): string;
```

- [ ] **Step 1: Prueba que falla**

`tests/whatsapp.test.ts`:
```ts
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
  it('cápsula, mayoreo, avísame, instructivo', () => {
    expect(mensaje('capsula')).toBe('Hola, quiero una cápsula sorpresa.');
    expect(mensaje('mayoreo')).toBe('Hola, quiero vender llaveros de LlaveCorp. Cantidad aprox: ___');
    expect(mensaje('avisame')).toBe('Hola, avísame cuando anden por ___');
    expect(mensaje('instructivo')).toBe('Hola, vi el instructivo de mi llavero y quiero...');
  });
});

describe('waLink', () => {
  it('usa wa.me con el número de config y texto codificado', () => {
    const url = waLink('capsula');
    expect(url.startsWith('https://wa.me/')).toBe(true);
    expect(url).toContain('?text=');
    expect(decodeURIComponent(url.split('?text=')[1])).toBe('Hola, quiero una cápsula sorpresa.');
  });
  it('quita todo lo que no sea dígito del número', () => {
    expect(waLink('capsula', undefined, '+52 (81) 1234-5678')).toContain('https://wa.me/528112345678?');
  });
});
```

- [ ] **Step 2: Correr y ver fallar**

Run: `npx vitest run tests/whatsapp.test.ts`
Expected: FAIL, módulo no encontrado.

- [ ] **Step 3: Implementar**

`src/lib/whatsapp.ts`:
```ts
import marca from '../config/marca.json';

export type TipoMensaje = 'producto' | 'editable' | 'nuevo' | 'capsula' | 'mayoreo' | 'avisame' | 'instructivo';
export type DatosMensaje = { nombre?: string; variante?: 'basico' | 'nfc' };

const variante = (v?: 'basico' | 'nfc') => (v === 'nfc' ? 'con NFC' : 'básico');

export function mensaje(tipo: TipoMensaje, datos: DatosMensaje = {}): string {
  const base = `Hola, vi ${marca.marca} y quiero el llavero *${datos.nombre ?? ''}* (${variante(datos.variante)}).`;
  switch (tipo) {
    case 'producto': return base;
    case 'editable': return `${base} Texto/nombre: ___ · Colores: ___`;
    case 'nuevo': return 'Hola, quiero cotizar un diseño nuevo. Idea: ___ · Tamaño aprox: ___ · Colores: ___';
    case 'capsula': return 'Hola, quiero una cápsula sorpresa.';
    case 'mayoreo': return `Hola, quiero vender llaveros de ${marca.marca}. Cantidad aprox: ___`;
    case 'avisame': return 'Hola, avísame cuando anden por ___';
    case 'instructivo': return 'Hola, vi el instructivo de mi llavero y quiero...';
  }
}

export function waLink(tipo: TipoMensaje, datos?: DatosMensaje, numero: string = marca.whatsapp): string {
  const digitos = numero.replace(/\D/g, '');
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje(tipo, datos))}`;
}
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run tests/whatsapp.test.ts`
Expected: 7 pruebas pasan. (Con el marcador `{{WHATSAPP}}` el número queda vacío; la primera prueba solo verifica el prefijo.)

- [ ] **Step 5: Commit**

```bash
git add src/lib/whatsapp.ts tests/whatsapp.test.ts
git commit -m "Enlaces de WhatsApp con mensajes prellenados"
```

---

### Task 3: Datos del catálogo y `catalogo.ts` con validación

**Files:**
- Create: `src/data/sagas.json`, `src/data/productos.json`, `src/data/tianguis.json`, `src/data/mayoreo.json`, `src/lib/catalogo.ts`, `src/lib/tianguis.ts`, `tests/catalogo.test.ts`, `tests/tianguis.test.ts`

**Interfaces:**
- Produces:
```ts
export type Saga = { slug: string; nombre: string; descripcion: string; icono: string; orden: number };
export type Producto = { slug: string; nombre: string; saga: string; descripcion: string; tamano: string;
  precio_basico: number; precio_nfc: number; colores: number; editable: boolean; texto_editable: boolean;
  colores_editables: boolean; imagen: string; destacado: boolean; disponible: boolean };
export function getSagas(): Saga[];                       // ordenadas por `orden`
export function getProductos(): Producto[];               // todos, validados
export function productosPorSaga(slug: string): Producto[];
export function destacados(): Producto[];                 // disponibles y destacados
export function precioDesde(): number;                    // mínimo precio_basico entre disponibles
export function validarCatalogo(productos: Producto[], sagas: Saga[], minimo: number): string[]; // lista de errores
export type Puesto = { dia: string; lugar: string; zona: string; horario: string; activo: boolean; nota: string };
export function getTianguisActivos(): Puesto[];           // activos, ordenados lunes..domingo
export type RangoMayoreo = { desde: number; hasta: number | null; precio_basico: number; precio_nfc: number; nota: string };
```

- [ ] **Step 1: Datos**

`src/data/sagas.json`:
```json
[
  { "slug": "retro", "nombre": "Saga Retro", "descripcion": "Para los que soplaban el cartucho.", "icono": "casete", "orden": 1 },
  { "slug": "anime", "nombre": "Saga Anime", "descripcion": "Directo del canal de las 4 de la tarde.", "icono": "onigiri", "orden": 2 },
  { "slug": "mascotas", "nombre": "Saga Mascotas", "descripcion": "Placa con poder para tu compañero.", "icono": "huella", "orden": 3 },
  { "slug": "nombre", "nombre": "Saga Con Nombre", "descripcion": "Tu nombre, tus colores, tu llavero.", "icono": "etiqueta", "orden": 4 },
  { "slug": "capsula", "nombre": "Cápsula Sorpresa", "descripcion": "No sabes cuál te toca. Esa es la gracia.", "icono": "capsula", "orden": 5 }
]
```

`src/data/productos.json` (precios de ejemplo, mínimo 60; el dueño los ajusta):
```json
[
  { "slug": "llavero-llavecorp", "nombre": "Llavero LlaveCorp", "saga": "retro", "descripcion": "El logo de la casa, con chip. Acércalo y llega aquí.", "tamano": "4.5 cm", "precio_basico": 60, "precio_nfc": 100, "colores": 3, "editable": false, "texto_editable": false, "colores_editables": false, "imagen": "", "destacado": true, "disponible": true },
  { "slug": "casete", "nombre": "Casete", "saga": "retro", "descripcion": "Rebobínalo con una pluma. O no, ya no hace falta.", "tamano": "5 cm", "precio_basico": 70, "precio_nfc": 110, "colores": 2, "editable": true, "texto_editable": true, "colores_editables": true, "imagen": "", "destacado": true, "disponible": true },
  { "slug": "control-retro", "nombre": "Control retro", "saga": "retro", "descripcion": "Dos botones y una cruceta. Suficiente para ser feliz.", "tamano": "5.5 cm", "precio_basico": 75, "precio_nfc": 115, "colores": 3, "editable": true, "texto_editable": false, "colores_editables": true, "imagen": "", "destacado": false, "disponible": true },
  { "slug": "disquete", "nombre": "Disquete", "saga": "retro", "descripcion": "El ícono de guardar, pero de verdad.", "tamano": "4 cm", "precio_basico": 60, "precio_nfc": 100, "colores": 2, "editable": true, "texto_editable": true, "colores_editables": true, "imagen": "", "destacado": false, "disponible": true },
  { "slug": "gato-suerte", "nombre": "Gato de la suerte", "saga": "anime", "descripcion": "Mueve la patita para que te vaya bien en el tianguis.", "tamano": "5 cm", "precio_basico": 70, "precio_nfc": 110, "colores": 3, "editable": true, "texto_editable": false, "colores_editables": true, "imagen": "", "destacado": true, "disponible": true },
  { "slug": "onigiri", "nombre": "Onigiri", "saga": "anime", "descripcion": "Bolita de arroz con carita. Cero calorías.", "tamano": "4 cm", "precio_basico": 60, "precio_nfc": 100, "colores": 3, "editable": false, "texto_editable": false, "colores_editables": false, "imagen": "", "destacado": false, "disponible": true },
  { "slug": "mascara-oni", "nombre": "Máscara oni", "saga": "anime", "descripcion": "Para espantar la mala vibra del lunes.", "tamano": "5.5 cm", "precio_basico": 80, "precio_nfc": 120, "colores": 4, "editable": true, "texto_editable": false, "colores_editables": true, "imagen": "", "destacado": true, "disponible": true },
  { "slug": "ramen", "nombre": "Ramen", "saga": "anime", "descripcion": "Con huevo y todo.", "tamano": "4.5 cm", "precio_basico": 70, "precio_nfc": 110, "colores": 4, "editable": false, "texto_editable": false, "colores_editables": false, "imagen": "", "destacado": false, "disponible": true },
  { "slug": "placa-huella", "nombre": "Placa con huella", "saga": "mascotas", "descripcion": "Nombre de tu mascota y tu teléfono. Con chip, guarda más.", "tamano": "4 cm", "precio_basico": 65, "precio_nfc": 105, "colores": 2, "editable": true, "texto_editable": true, "colores_editables": true, "imagen": "", "destacado": true, "disponible": true },
  { "slug": "hueso", "nombre": "Hueso", "saga": "mascotas", "descripcion": "Clásico. Con el nombre de tu perro.", "tamano": "5 cm", "precio_basico": 65, "precio_nfc": 105, "colores": 2, "editable": true, "texto_editable": true, "colores_editables": true, "imagen": "", "destacado": false, "disponible": true },
  { "slug": "nombre-pixel", "nombre": "Nombre pixel", "saga": "nombre", "descripcion": "Tu nombre en letras de videojuego.", "tamano": "según el nombre", "precio_basico": 70, "precio_nfc": 110, "colores": 2, "editable": true, "texto_editable": true, "colores_editables": true, "imagen": "", "destacado": true, "disponible": true },
  { "slug": "nombre-anime", "nombre": "Nombre estilo anime", "saga": "nombre", "descripcion": "Tu nombre con brillos y líneas de velocidad.", "tamano": "según el nombre", "precio_basico": 75, "precio_nfc": 115, "colores": 3, "editable": true, "texto_editable": true, "colores_editables": true, "imagen": "", "destacado": false, "disponible": true },
  { "slug": "capsula-sorpresa", "nombre": "Cápsula sorpresa", "saga": "capsula", "descripcion": "Un llavero al azar de cualquier saga, en su cápsula.", "tamano": "varía", "precio_basico": 60, "precio_nfc": 0, "colores": 4, "editable": false, "texto_editable": false, "colores_editables": false, "imagen": "", "destacado": true, "disponible": true }
]
```

`src/data/tianguis.json`:
```json
[
  { "dia": "sábado", "lugar": "Tianguis (por definir)", "zona": "Monterrey", "horario": "9:00 a 15:00", "activo": true, "nota": "Puesto con la bandera de LlaveCorp." },
  { "dia": "domingo", "lugar": "Mercado (por definir)", "zona": "Monterrey", "horario": "10:00 a 16:00", "activo": true, "nota": "" },
  { "dia": "miércoles", "lugar": "Ejemplo inactivo", "zona": "", "horario": "", "activo": false, "nota": "" }
]
```

`src/data/mayoreo.json`:
```json
[
  { "desde": 10, "hasta": 24, "precio_basico": 50, "precio_nfc": 85, "nota": "Mezcla de diseños." },
  { "desde": 25, "hasta": 49, "precio_basico": 45, "precio_nfc": 80, "nota": "" },
  { "desde": 50, "hasta": null, "precio_basico": 40, "precio_nfc": 75, "nota": "Precio a platicar según diseños." }
]
```

- [ ] **Step 2: Pruebas que fallan**

`tests/catalogo.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getSagas, getProductos, productosPorSaga, destacados, precioDesde, validarCatalogo, type Producto } from '../src/lib/catalogo';

const base: Producto = { slug: 'x', nombre: 'X', saga: 'retro', descripcion: '', tamano: '4 cm', precio_basico: 60, precio_nfc: 100,
  colores: 2, editable: false, texto_editable: false, colores_editables: false, imagen: '', destacado: false, disponible: true };
const sagas = getSagas();

describe('catálogo', () => {
  it('sagas ordenadas por orden', () => {
    expect(sagas.map(s => s.slug)).toEqual(['retro', 'anime', 'mascotas', 'nombre', 'capsula']);
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
```

`tests/tianguis.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { getTianguisActivos, ordenDia } from '../src/lib/tianguis';

describe('tianguis', () => {
  it('solo activos y ordenados por día de la semana', () => {
    const p = getTianguisActivos();
    expect(p.every(x => x.activo)).toBe(true);
    const idx = p.map(x => ordenDia(x.dia));
    expect([...idx].sort((a, b) => a - b)).toEqual(idx);
  });
  it('ordenDia acepta acentos y mayúsculas', () => {
    expect(ordenDia('Miércoles')).toBe(2);
    expect(ordenDia('sabado')).toBe(5);
  });
});
```

Run: `npx vitest run tests/catalogo.test.ts tests/tianguis.test.ts`
Expected: FAIL, módulos no encontrados.

- [ ] **Step 3: Implementar**

`src/lib/catalogo.ts`:
```ts
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
```

`src/lib/tianguis.ts`:
```ts
import tianguisJson from '../data/tianguis.json';
import mayoreoJson from '../data/mayoreo.json';

export type Puesto = { dia: string; lugar: string; zona: string; horario: string; activo: boolean; nota: string };
export type RangoMayoreo = { desde: number; hasta: number | null; precio_basico: number; precio_nfc: number; nota: string };

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const sinAcentos = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export const ordenDia = (dia: string) => DIAS.indexOf(sinAcentos(dia));

export function getTianguisActivos(): Puesto[] {
  return (tianguisJson as Puesto[]).filter(p => p.activo).sort((a, b) => ordenDia(a.dia) - ordenDia(b.dia));
}

export const getMayoreo = () => mayoreoJson as RangoMayoreo[];
```

- [ ] **Step 4: Correr y ver pasar**

Run: `npx vitest run`
Expected: todas pasan (whatsapp 7, catálogo 10, tianguis 2, dist 1).

- [ ] **Step 5: Commit**

```bash
git add src/data src/lib/catalogo.ts src/lib/tianguis.ts tests/catalogo.test.ts tests/tianguis.test.ts
git commit -m "Datos del catálogo, tianguis y mayoreo con validación"
```

---

### Task 4: Sistema de diseño "Canal de las 4" y layout base

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/componentes.css`, `src/styles/efectos.css`, `src/layouts/Base.astro`, `public/favicon.svg`
- Modify: `src/pages/index.astro` (usar el layout)

**Interfaces:**
- Produces: `Base.astro` con props `{ titulo: string; descripcion: string; imagenOg?: string }` y un `<slot />`. Clases CSS globales: `.ventana`, `.ventana__titulo`, `.btn`, `.btn--start`, `.btn--wa`, `.tarjeta`, `.etiqueta`, `.etiqueta--editable`, `.etiqueta--agotado`, `.paleta`, `.paleta__color`, `.seccion`, `.contenedor`, `.grid`, `.pixel` (fuente pixel), `.halftone`, `.speedlines`, `.scanlines`, `.parpadea`, `.visualmente-oculto`.

- [ ] **Step 1: tokens.css**

```css
:root {
  --fuente-pixel: 'Press Start 2P', monospace;
  --fuente-texto: 'Space Grotesk', system-ui, sans-serif;
  --fondo: #f7f1e3;          /* crema papel */
  --superficie: #fffdf7;
  --tinta: #15131a;
  --tinta-suave: #4a4655;
  --borde: #15131a;
  --magenta: #ff2e88;
  --cian: #16c4d6;
  --amarillo: #ffd23f;
  --verde-nfc: #2ed573;
  --sombra: 4px 4px 0 var(--tinta);
  --radio: 6px;
  --gutter: 16px;
  --ancho-max: 1080px;
  /* verdes de consola, solo decorativos en /activa */
  --gb-0: #0f380f; --gb-1: #306230; --gb-2: #8bac0f; --gb-3: #9bbc0f;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-tema="claro"]) {
    --fondo: #0d0b14; --superficie: #17142a; --tinta: #f3efff; --tinta-suave: #b9b3d1; --borde: #f3efff;
    --magenta: #ff4da0; --cian: #3ee0f0; --amarillo: #ffe066; --verde-nfc: #3cf58a;
    --sombra: 4px 4px 0 var(--magenta);
  }
}
:root[data-tema="noche"] {
  --fondo: #0d0b14; --superficie: #17142a; --tinta: #f3efff; --tinta-suave: #b9b3d1; --borde: #f3efff;
  --magenta: #ff4da0; --cian: #3ee0f0; --amarillo: #ffe066; --verde-nfc: #3cf58a;
  --sombra: 4px 4px 0 var(--magenta);
}
```

- [ ] **Step 2: base.css**

```css
*, *::before, *::after { box-sizing: border-box; }
html { color-scheme: light dark; }
body { margin: 0; background: var(--fondo); color: var(--tinta); font-family: var(--fuente-texto); font-size: 1rem; line-height: 1.55; overflow-x: hidden; }
img, svg { max-width: 100%; height: auto; display: block; }
h1, h2, h3, .pixel { font-family: var(--fuente-pixel); line-height: 1.4; letter-spacing: 0.02em; }
h1 { font-size: clamp(1.1rem, 4.5vw, 2rem); } h2 { font-size: clamp(0.95rem, 3.5vw, 1.4rem); } h3 { font-size: 0.8rem; }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--cian); outline-offset: 3px; }
.contenedor { width: 100%; max-width: var(--ancho-max); margin-inline: auto; padding-inline: var(--gutter); }
.seccion { padding-block: clamp(2rem, 6vw, 4rem); }
.grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
.visualmente-oculto { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
```

- [ ] **Step 3: componentes.css** (ventana 90s, botones, tarjetas, etiquetas, paleta)

```css
.ventana { background: var(--superficie); border: 3px solid var(--borde); box-shadow: var(--sombra); border-radius: var(--radio); }
.ventana__titulo { display: flex; align-items: center; justify-content: space-between; gap: .5rem; padding: .4rem .6rem; border-bottom: 3px solid var(--borde); background: var(--cian); color: #15131a; font-family: var(--fuente-pixel); font-size: .6rem; }
.ventana__botones { display: flex; gap: .3rem; } .ventana__botones span { width: .8rem; height: .8rem; border: 2px solid #15131a; background: var(--superficie); }
.ventana__cuerpo { padding: 1rem; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: .5rem; min-height: 44px; padding: .7rem 1.1rem; border: 3px solid var(--borde); border-radius: var(--radio); background: var(--amarillo); color: #15131a; font-family: var(--fuente-pixel); font-size: .65rem; text-decoration: none; box-shadow: var(--sombra); cursor: pointer; }
.btn:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 var(--tinta); }
.btn--start { background: var(--magenta); color: #fff; }
.btn--wa { background: var(--verde-nfc); }
.btn--fantasma { background: var(--superficie); color: var(--tinta); }
.tarjeta { display: flex; flex-direction: column; gap: .6rem; }
.tarjeta__img { aspect-ratio: 1; background: var(--fondo); border: 3px solid var(--borde); border-radius: var(--radio); display: grid; place-items: center; overflow: hidden; }
.etiqueta { display: inline-block; padding: .2rem .5rem; border: 2px solid var(--borde); font-family: var(--fuente-pixel); font-size: .5rem; background: var(--amarillo); color: #15131a; }
.etiqueta--editable { background: var(--cian); } .etiqueta--nfc { background: var(--verde-nfc); } .etiqueta--agotado { background: var(--tinta-suave); color: #fff; }
.paleta { display: flex; flex-wrap: wrap; gap: .4rem; list-style: none; padding: 0; margin: 0; }
.paleta__color { width: 1.6rem; height: 1.6rem; border: 2px solid var(--borde); border-radius: 50%; }
.precio { font-family: var(--fuente-pixel); font-size: .75rem; } .precio small { font-family: var(--fuente-texto); font-size: .8rem; color: var(--tinta-suave); }
.btn-flotante { position: fixed; right: 1rem; bottom: 1rem; z-index: 50; }
```

- [ ] **Step 4: efectos.css**

```css
.scanlines { position: relative; } .scanlines::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(0,0,0,.06) 0 1px, transparent 1px 3px); }
.halftone { background-image: radial-gradient(var(--tinta) 1px, transparent 1.2px); background-size: 8px 8px; opacity: .12; }
.speedlines { background: repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 4deg, color-mix(in srgb, var(--tinta) 12%, transparent) 4deg 5deg); }
@keyframes parpadeo { 50% { opacity: .25; } } .parpadea { animation: parpadeo 1s steps(2) infinite; }
@keyframes powerup { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); } } .powerup { animation: powerup .5s steps(6) forwards; }
@keyframes girar { to { transform: rotate(360deg); } } .capsula--gira { animation: girar 2.5s linear infinite; }
```

- [ ] **Step 5: Base.astro y favicon**

`src/layouts/Base.astro`:
```astro
---
import marca from '../config/marca.json';
import '../styles/tokens.css'; import '../styles/base.css'; import '../styles/componentes.css'; import '../styles/efectos.css';
interface Props { titulo: string; descripcion: string; imagenOg?: string }
const { titulo, descripcion, imagenOg = '/og/default.png' } = Astro.props;
const url = new URL(Astro.url.pathname, Astro.site);
---
<!doctype html>
<html lang="es-MX">
<head>
  <meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{titulo} · {marca.marca}</title>
  <meta name="description" content={descripcion} />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="canonical" href={url} />
  <meta property="og:title" content={titulo} /><meta property="og:description" content={descripcion} />
  <meta property="og:image" content={new URL(imagenOg, Astro.site)} /><meta property="og:url" content={url} /><meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Space+Grotesk:wght@400;700&display=swap" rel="stylesheet" />
  <script is:inline>try{const t=localStorage.getItem('llavecorp-tema');if(t)document.documentElement.dataset.tema=t;}catch(e){}</script>
</head>
<body>
  <a class="visualmente-oculto" href="#contenido">Saltar al contenido</a>
  <header class="contenedor" style="display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-block:.75rem">
    <a href="/" aria-label={`${marca.marca}, inicio`}><slot name="logo" /></a>
    <nav aria-label="Principal"><a href="/#catalogo">Catálogo</a> · <a href="/donde">Dónde</a> · <a href="/activa">Activa tu llavero</a></nav>
  </header>
  <main id="contenido"><slot /></main>
  <footer class="contenedor seccion" style="font-size:.9rem;color:var(--tinta-suave)">
    <p class="pixel" style="font-size:.6rem">Hecho con nostalgia en {marca.ciudad} · Presiona START para pedir el tuyo.</p>
    <slot name="pie" />
    {marca.tu_dia_url && <p><a href={marca.tu_dia_url}>¿Tienes boda o XV? Conoce Tu Día</a></p>}
  </footer>
  <slot name="flotante" />
</body>
</html>
```

`public/favicon.svg`: cuadrado 32×32 con fondo `#ff2e88` y una llave pixel blanca de 5×9 celdas (dibujar con `<rect>`).

Actualizar `src/pages/index.astro` para usar `Base` con `titulo="Llaveros con poder"` y un `<h1>` de prueba.

- [ ] **Step 6: Verificar**

Run: `npm run verificar`
Expected: build pasa; `dist/index.html` contiene `lang="es-MX"` y `fonts.googleapis.com`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Sistema de diseño Canal de las 4 y layout base"
```

---

### Task 5: Logo (web, mono, capas) y mascota Llavi

**Files:**
- Create: `public/logo/llavecorp.svg`, `public/logo/llavecorp-mono.svg`, `public/logo/llavecorp-capas.svg`, `src/components/Logo.astro`, `src/components/Mascota.astro`, `public/img/placeholders/{retro,anime,mascotas,nombre,capsula}.svg`

**Interfaces:**
- Produces: `<Logo alto={number} />` (inline SVG a color), `<Mascota estado="saluda" | "sorpresa" | "poder" | "duerme" tamano={number} />` (inline SVG chibi), placeholders por saga en `/img/placeholders/{saga}.svg`.

- [ ] **Step 1: Logo por capas (fuente de verdad)**

`public/logo/llavecorp-capas.svg`, viewBox `0 0 180 80`, rejilla de 4 px (cada "pixel" = 4×4, mínimo 2 mm a 45 mm de ancho):
- `<g id="capa-fondo" fill="#15131a">`: cápsula horizontal `rect x=8 y=8 width=164 height=44 rx=22`.
- `<g id="capa-letra" fill="#f7f1e3">`: llave pixel dentro de la cápsula: cabeza 16×16 en (24,22) con hueco 8×8 en (28,26); vástago `rect 40,28 60×8`; dientes `rect 88,36 8×8` y `rect 76,36 8×8`. Texto "LLAVECORP" en `<text x=90 y=72 text-anchor=middle font-family="Press Start 2P" font-size=12>` **y** su versión en trazados (`<path>`) para imprimir: exportar el texto a paths con `fontkit` no es necesario; en su lugar dibujar cada letra con `rect` de 4 px en una fuente pixel 5×7 propia (definir un mapa letra→matriz en un script `scripts/pixel-texto.mjs` que genere los rects y se ejecute una vez).
- `<g id="capa-acento" fill="#ff2e88">`: mitad derecha de la cápsula `path` (semicírculo + rect 80,8 → 172,52) con un brillo blanco `rect 148,16 8×4`.
- Sin trazos: todo son rellenos.

`scripts/pixel-texto.mjs`: exporta `textoARects(texto, x, y, celda)` con matrices 5×7 de A, C, E, L, O, P, R, V; imprime los `<rect>` y se pega en la capa-letra. Ejecutar con `node scripts/pixel-texto.mjs LLAVECORP 22 60 4`.

- [ ] **Step 2: Derivados**

`llavecorp.svg`: mismo contenido, sin ids de capa, con `fill` de tokens (`#15131a`, `#f7f1e3`, `#ff2e88`).
`llavecorp-mono.svg`: todo en `#15131a` salvo la llave y letras en `#f7f1e3` (dos tonos = un color impreso más fondo).

- [ ] **Step 3: Componentes**

`src/components/Logo.astro`: lee `public/logo/llavecorp.svg` con `fs.readFileSync` en build y lo inserta con `set:html`, envuelto en `<span class="logo" style={`height:${alto}px`}>` y `role="img" aria-label="LlaveCorp"`.

`src/components/Mascota.astro`: chibi original "Llavi": cuerpo = llave pixel vertical con cabeza redonda 40×40, ojos 6×6, boca según `estado` (saluda: sonrisa + manita levantada; sorpresa: boca "o" + signo `!` amarillo; poder: ojos cerrados felices + aura de líneas; duerme: ojos línea + "z" pixel). Bufanda magenta 3 rects. Todo `<rect>` en rejilla de 4 px, viewBox `0 0 96 128`. `aria-hidden="true"` (decorativa) salvo que se pase `alt`.

- [ ] **Step 4: Placeholders por saga**

Cinco SVG 400×400 con fondo halftone (`pattern` de círculos) y un ícono pixel central original: casete, onigiri, huella, etiqueta con "?", cápsula. Texto "Foto real muy pronto" abajo en Press Start 2P vía `font-family` (en placeholder web sí puede usar fuente).

- [ ] **Step 5: Verificar visualmente**

Poner `<Logo alto={48} slot="logo" />` en `index.astro` y `<Mascota estado="saluda" />` en el cuerpo. Run: `npm run build` y abrir `dist/index.html` (o `npm run dev`) para revisar. Expected: logo y mascota visibles, sin trazos finos, legible al 25% de zoom.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Logo LlaveCorp (web, mono, capas) y mascota Llavi"
```

---

### Task 6: Componentes de tienda

**Files:**
- Create: `src/components/Ventana.astro`, `BotonStart.astro`, `Seccion.astro`, `Emote.astro`, `Precio.astro`, `Paleta.astro`, `EtiquetaEditable.astro`, `TarjetaProducto.astro`, `CabeceraSaga.astro`, `BotonWhatsApp.astro`

**Interfaces:**
- Produces:
  - `<Ventana titulo="..." class?>` con slot (ventana 90s, botones decorativos `aria-hidden`).
  - `<BotonStart href texto="PRESIONA START" />` (clase `btn btn--start parpadea`).
  - `<Seccion id titulo? subtitulo? fondo?: 'halftone'|'speedlines'|'none'>`.
  - `<Emote tipo="gota"|"sorpresa"|"venita"|"brillo" />` SVG inline pequeño, `aria-hidden`.
  - `<Precio basico nfc />`: muestra "$70" y "con NFC $110"; si `nfc===0`, solo básico.
  - `<Paleta colores={marca.colores_disponibles} />`: `<ul class="paleta">` con `<li class="paleta__color" style="background:#..." title="Rojo">` y texto oculto.
  - `<EtiquetaEditable producto />`: etiqueta "Editable" + texto "N colores · cambia cuáles, no cuántos".
  - `<TarjetaProducto producto />`: ventana con imagen (o placeholder de su saga), nombre, tamaño, precio, etiquetas (Editable, NFC, Agotado), botón "Lo quiero" → `waLink(producto.editable ? 'editable' : 'producto', { nombre, variante: 'basico' })`, y segundo botón "Con NFC" si `precio_nfc > 0`. Sin botones si `!disponible`. Enlace del nombre a `/llavero/{slug}`.
  - `<CabeceraSaga saga />`: h2 pixel + descripción + fondo speedlines.
  - `<BotonWhatsApp tipo datos texto class />`: `<a class="btn btn--wa" href={waLink(...)} target="_blank" rel="noopener">`.

- [ ] **Step 1: Escribir los componentes** con el markup descrito; TarjetaProducto:

```astro
---
import type { Producto } from '../lib/catalogo';
import { waLink } from '../lib/whatsapp';
import Ventana from './Ventana.astro'; import Precio from './Precio.astro'; import EtiquetaEditable from './EtiquetaEditable.astro';
interface Props { producto: Producto }
const { producto: p } = Astro.props;
const img = p.imagen || `/img/placeholders/${p.saga}.svg`;
const tipo = p.editable ? 'editable' : 'producto';
---
<Ventana titulo={p.nombre} class="tarjeta">
  <a class="tarjeta__img" href={`/llavero/${p.slug}`}><img src={img} alt={`Llavero ${p.nombre}`} width="400" height="400" loading="lazy" /></a>
  <h3><a href={`/llavero/${p.slug}`}>{p.nombre}</a></h3>
  <p>{p.descripcion} <small>· {p.tamano}</small></p>
  <div>{p.editable && <EtiquetaEditable producto={p} />}{p.precio_nfc > 0 && <span class="etiqueta etiqueta--nfc">Con poder NFC</span>}{!p.disponible && <span class="etiqueta etiqueta--agotado">Agotado</span>}</div>
  <Precio basico={p.precio_basico} nfc={p.precio_nfc} />
  {p.disponible && <div style="display:flex;gap:.5rem;flex-wrap:wrap">
    <a class="btn btn--wa" href={waLink(tipo, { nombre: p.nombre, variante: 'basico' })} target="_blank" rel="noopener">Lo quiero</a>
    {p.precio_nfc > 0 && <a class="btn btn--fantasma" href={waLink(tipo, { nombre: p.nombre, variante: 'nfc' })} target="_blank" rel="noopener">Con NFC</a>}
  </div>}
</Ventana>
```

- [ ] **Step 2: Prueba de dist** — agregar a `tests/dist.test.ts`:

```ts
it('la tarjeta de un producto editable lleva el mensaje editable', () => {
  const html = leer('index.html');
  expect(html).toContain('Texto%2Fnombre');
  expect(html).toContain('etiqueta--editable');
});
it('la cápsula sorpresa no ofrece botón Con NFC', () => {
  const html = leer('llavero/capsula-sorpresa/index.html');
  expect(html).not.toContain('>Con NFC<');
});
```
(La segunda pasa al terminar la Task 8.)

- [ ] **Step 3: Verificar** con un `index.astro` temporal que renderice `<TarjetaProducto>` de `destacados()`. Run: `npm run build`. Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Componentes de tienda: ventana, botones, tarjeta de producto"
```

---

### Task 7: Página de inicio (tienda)

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `destacados`, `getSagas`, `productosPorSaga`, `precioDesde`, `getTianguisActivos`, `waLink`, todos los componentes de Task 5–6.

- [ ] **Step 1: Escribir la página** con estas secciones en orden (ids fijos, los usan el nav y las pruebas):

1. `#inicio` Hero, clase `scanlines`, fondo speedlines: `<Mascota estado="saluda">`, `<h1>Elige tu llavero</h1>`, `<p class="pixel">Desde ${precioDesde()}</p>`, lema, fichas de `destacados()` como `<a href="/llavero/slug" class="ficha">` (imagen + nombre) en fila con scroll horizontal contenido (`overflow-x:auto` **dentro** de la fila, no de la página), `<BotonStart href="#catalogo" />`.
2. `#nfc` "Con poder NFC": ventana con animación CSS de un celular (rect) acercándose al llavero (keyframes `acercar`, 2 s, respeta reduced-motion), tres usos ejemplo (Wi-Fi, WhatsApp, placa de mascota) y `<a class="btn" href="/activa">Ver el instructivo</a>`.
3. `#catalogo` por cada saga de `getSagas()`: `<CabeceraSaga>` + `<div class="grid">` de `<TarjetaProducto>`; enlace "Ver toda la saga" a `/saga/{slug}`.
4. `#hazlo-tuyo` "Hazlo tuyo": tres ventanas (Editable, Colores, Diseño nuevo) con el copy exacto de la sección 3 del spec, `<Paleta>` en la de Colores, `<BotonWhatsApp tipo="nuevo" texto="Cotizar diseño nuevo" />` en la tercera.
5. `#donde` "¿Dónde estamos esta semana?": lista de `getTianguisActivos()` (día en pixel, lugar, zona, horario, nota) y `<BotonWhatsApp tipo="avisame" texto="Avísame cuando andes cerca" />`. Enlace a `/donde`.
6. Slot `pie`: redes de `marca.redes` que no estén vacías.
7. Slot `flotante`: `<BotonWhatsApp tipo="producto" ... />` no; usar `tipo="instructivo"`? No: el flotante usa `tipo="capsula"`? **Decisión:** el flotante abre WhatsApp con mensaje genérico `mensaje('instructivo')` no aplica en tienda; agregar tipo `'hola'` → "Hola, vi LlaveCorp y tengo una duda." (añadir a `whatsapp.ts` y a su prueba). Clase `btn btn--wa btn-flotante`, texto "Continuar ▶ WhatsApp".

- [ ] **Step 2: Actualizar whatsapp.ts y prueba** con el tipo `'hola'`.

- [ ] **Step 3: Pruebas de dist** — agregar:
```ts
it('inicio tiene todas las secciones y Desde $60', () => {
  const html = leer('index.html');
  for (const id of ['inicio', 'nfc', 'catalogo', 'hazlo-tuyo', 'donde']) expect(html).toContain(`id="${id}"`);
  expect(html).toContain('Desde $60');
  expect(html).toContain('cambia cuáles, no cuántos');
});
```

- [ ] **Step 4: Verificar** — Run: `npm run verificar`. Expected: pasa. Abrir en navegador a 360 px de ancho: sin scroll horizontal (`document.documentElement.scrollWidth === 360`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Página de inicio de la tienda"
```

---

### Task 8: Páginas de saga y de producto

**Files:**
- Create: `src/pages/saga/[slug].astro`, `src/pages/llavero/[slug].astro`

- [ ] **Step 1: saga/[slug].astro**

```astro
---
import Base from '../../layouts/Base.astro'; import Logo from '../../components/Logo.astro';
import CabeceraSaga from '../../components/CabeceraSaga.astro'; import TarjetaProducto from '../../components/TarjetaProducto.astro';
import { getSagas, productosPorSaga } from '../../lib/catalogo';
export function getStaticPaths() { return getSagas().map(s => ({ params: { slug: s.slug }, props: { saga: s } })); }
const { saga } = Astro.props; const productos = productosPorSaga(saga.slug);
---
<Base titulo={saga.nombre} descripcion={saga.descripcion} imagenOg={`/img/placeholders/${saga.slug}.svg`}>
  <Logo alto={40} slot="logo" />
  <section class="contenedor seccion"><CabeceraSaga saga={saga} /><div class="grid">{productos.map(p => <TarjetaProducto producto={p} />)}</div>
  <p><a href="/#catalogo">← Volver al catálogo</a></p></section>
</Base>
```

- [ ] **Step 2: llavero/[slug].astro** — ficha grande: imagen (o placeholder), nombre, saga (enlace), descripción, tamaño, "N colores" con `<Paleta>` si `colores_editables`, bloque de personalización si `editable` (copy de Editable + Colores), `<Precio>`, botones Lo quiero / Con NFC (misma lógica que la tarjeta), "Agotado" si no disponible, y para `saga === 'capsula'` el texto "No sabes cuál te toca. Esa es la gracia." `getStaticPaths` desde `getProductos()`.

- [ ] **Step 3: Verificar** — Run: `npm run verificar`. Expected: existen `dist/saga/anime/index.html` y `dist/llavero/gato-suerte/index.html`; la prueba de cápsula sin "Con NFC" pasa.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Páginas de saga y ficha de producto"
```

---

## Etapa 2 — Instructivo NFC

### Task 9: Datos de usos y `usos.ts`

**Files:**
- Create: `src/data/usos.json`, `src/lib/usos.ts`, `tests/usos.test.ts`

**Interfaces:**
- Produces:
```ts
export type Uso = { slug: string; titulo: string; icono: string; descripcion_corta: string; compatibilidad: ('android'|'iphone')[]; tipo_registro: string; pasos: string[]; consejo: string };
export const PASOS_BASE: string[]; // 3 pasos comunes de NFC Tools
export function getUsos(): Uso[]; export function getUso(slug: string): Uso | undefined;
```

- [ ] **Step 1: Prueba**

```ts
import { describe, it, expect } from 'vitest';
import { getUsos, getUso, PASOS_BASE } from '../src/lib/usos';
describe('usos', () => {
  it('hay 11 usos con slugs únicos y el de volver existe', () => {
    const u = getUsos(); expect(u).toHaveLength(11);
    expect(new Set(u.map(x => x.slug)).size).toBe(11);
    expect(getUso('volver')?.pasos.join(' ')).toContain('llavecorp.com');
  });
  it('todos tienen al menos un paso, consejo y compatibilidad válida', () => {
    for (const x of getUsos()) { expect(x.pasos.length).toBeGreaterThan(0); expect(x.consejo.length).toBeGreaterThan(0);
      expect(x.compatibilidad.every(c => c === 'android' || c === 'iphone')).toBe(true); }
  });
  it('PASOS_BASE tiene 3 pasos', () => { expect(PASOS_BASE).toHaveLength(3); });
});
```

- [ ] **Step 2: Datos** — `usos.json` con los once usos de la tabla del spec anterior (`wifi`, `contacto`, `whatsapp`, `redes`, `ubicacion`, `mascota`, `mochila`, `emergencia`, `playlist`, `automatizacion`, `volver`). Pasos concretos por uso; ejemplo `wifi`:
```json
{ "slug": "wifi", "titulo": "Wi-Fi de tu casa", "icono": "wifi", "descripcion_corta": "Tus visitas tocan el llavero y ya están conectadas.", "compatibilidad": ["android"], "tipo_registro": "Wi-Fi",
  "pasos": ["Abre NFC Tools y entra a la pestaña Escribir.", "Toca Agregar un registro y elige Wi-Fi.", "Escribe el nombre de tu red y la contraseña tal cual.", "Regresa, toca Escribir y acerca el llavero a la parte trasera del celular hasta que diga Escritura completa."],
  "consejo": "En iPhone puede no conectar automático; ahí conviene usar un texto con la contraseña." }
```
`mochila`: consejo obligatorio "Solo nombre y teléfono de papá o mamá. No pongas la dirección." `volver`: URL `https://llavecorp.com/activa`.

- [ ] **Step 3: Implementar `usos.ts`** (importa JSON, exporta `PASOS_BASE`, `getUsos`, `getUso`). Run: `npx vitest run tests/usos.test.ts` → pasa.

- [ ] **Step 4: Commit** — `git commit -m "Datos y carga de usos del instructivo"`.

---

### Task 10: `/activa` — instructivo

**Files:**
- Create: `src/pages/activa/index.astro`, `src/components/BarraCorazones.astro`

- [ ] **Step 1: BarraCorazones.astro** — `<div class="corazones" data-total={total} aria-label="Progreso de tutoriales">` con `total` corazones SVG pixel (`<svg class="corazon" data-i>`), vacíos por defecto (`fill: none; stroke`), llenos con clase `corazon--lleno`. El script `progreso.ts` (Task 11) los llena.

- [ ] **Step 2: Página** con secciones e ids: `#hero` ("¡Nuevo objeto obtenido: Llavero NFC!", `<Mascota estado="sorpresa">`, BotonStart a `#nivel-1`, paleta decorativa `--gb-*` en el fondo), `#nivel-1` (¿Tu cel tiene NFC? Android/iPhone/sin NFC), `#nivel-2` (Descarga NFC Tools: enlaces oficiales `https://play.google.com/store/apps/details?id=com.wakdev.wdnfc` y `https://apps.apple.com/app/nfc-tools/id1252962749`), `#nivel-3` (Elige tu poder: grid de ventanas por uso, enlace a `/activa/{slug}`, `<BarraCorazones total={getUsos().length}>`), `#consejos` (los 5 del spec: no bloquear, contraseña, sin batería 1–4 cm, metal y tarjetas, QR sigue funcionando), `#guardar` (Guardar partida: graba `llavecorp.com/activa`), `#mas` (¿Quieres más? `<BotonWhatsApp tipo="instructivo">` + enlace a `/`). Texto de copy del spec 2.2.

- [ ] **Step 3: Prueba de dist**:
```ts
it('activa tiene los tres niveles, consejos y enlaces a NFC Tools', () => {
  const html = leer('activa/index.html');
  for (const id of ['nivel-1', 'nivel-2', 'nivel-3', 'consejos', 'guardar']) expect(html).toContain(`id="${id}"`);
  expect(html).toContain('play.google.com'); expect(html).toContain('apps.apple.com');
  expect(html).toContain('No bloquees');
});
```

- [ ] **Step 4: Verificar** `npm run verificar` → pasa. **Commit:** `git commit -m "Instructivo /activa"`.

---

### Task 11: Tutoriales `/activa/{slug}` y progreso con POWER UP

**Files:**
- Create: `src/pages/activa/[slug].astro`, `src/scripts/progreso.ts`

**Interfaces:**
- Produces (`progreso.ts`, se carga en `/activa` y `/activa/{slug}`):
```ts
export function leerLogrados(): string[];            // slugs completados, [] si no hay localStorage
export function marcarLogrado(slug: string): string[]; // guarda y regresa la lista
export function pintarCorazones(logrados: string[]): void; // llena N corazones en .corazones
```

- [ ] **Step 1: Página** — `getStaticPaths` desde `getUsos()`. Contenido: título, compatibilidad (etiquetas Android/iPhone), `PASOS_BASE` en una ventana "Lo básico en NFC Tools", pasos numerados del uso en `<ol>`, consejo en ventana amarilla, botón `<button class="btn btn--start" data-logro={slug}>¡Lo logré!</button>` y un `<div id="powerup" hidden role="status">` con `<Mascota estado="poder">` y texto "¡POWER UP!". Enlaces a anterior/siguiente uso y a `/activa#nivel-3`.

- [ ] **Step 2: progreso.ts**

```ts
const CLAVE = 'llavecorp-logros';
export function leerLogrados(): string[] { try { return JSON.parse(localStorage.getItem(CLAVE) ?? '[]'); } catch { return []; } }
export function marcarLogrado(slug: string): string[] {
  const lista = Array.from(new Set([...leerLogrados(), slug]));
  try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch {}
  return lista;
}
export function pintarCorazones(logrados: string[]) {
  document.querySelectorAll<HTMLElement>('.corazones .corazon').forEach((c, i) => c.classList.toggle('corazon--lleno', i < logrados.length));
}
document.addEventListener('DOMContentLoaded', () => {
  pintarCorazones(leerLogrados());
  document.querySelector<HTMLButtonElement>('[data-logro]')?.addEventListener('click', (e) => {
    const slug = (e.currentTarget as HTMLElement).dataset.logro!;
    const lista = marcarLogrado(slug);
    const caja = document.getElementById('powerup'); if (caja) { caja.hidden = false; caja.classList.add('powerup'); }
    pintarCorazones(lista);
    document.dispatchEvent(new CustomEvent('llavecorp:powerup'));
  });
});
```
Incluir en las páginas con `<script src="../../scripts/progreso.ts"></script>` (Astro lo empaqueta). En la página de tutorial también va una `<BarraCorazones>` pequeña.

- [ ] **Step 3: Prueba de dist**: `dist/activa/wifi/index.html` contiene `data-logro="wifi"` y "POWER UP".

- [ ] **Step 4: Verificar en navegador**: pulsar "¡Lo logré!" muestra POWER UP y llena un corazón; recargar conserva el corazón. **Commit:** `git commit -m "Tutoriales por uso con progreso y POWER UP"`.

---

## Etapa 3 — Conversión

### Task 12: Cápsula sorpresa

**Files:**
- Create: `src/components/Capsula.astro`
- Modify: `src/pages/index.astro` (sección `#capsula` entre catálogo y hazlo-tuyo), `src/pages/llavero/[slug].astro` (usar `<Capsula>` como imagen cuando `saga==='capsula'`)

- [ ] **Step 1: Capsula.astro** — SVG de cápsula (dos mitades: superior magenta, inferior crema, línea negra) dentro de `<div class="capsula capsula--gira">`; con `prefers-reduced-motion` no gira. Prop `abierta?: boolean` separa las mitades 12 px y muestra un `?` pixel adentro.
- [ ] **Step 2: Sección `#capsula`** en inicio: ventana "Cápsula Sorpresa", `<Capsula>`, texto "No sabes cuál te toca. Esa es la gracia.", precio del producto `capsula-sorpresa`, `<BotonWhatsApp tipo="capsula" texto="Quiero una cápsula" />`.
- [ ] **Step 3: Prueba de dist**: index contiene `id="capsula"` y `Quiero una cápsula`. `npm run verificar`. **Commit:** `git commit -m "Cápsula sorpresa"`.

---

### Task 13: Guía de regalos, coleccionista, vende con nosotros, detrás del taller

**Files:**
- Create: `src/data/regalos.json`
- Modify: `src/pages/index.astro` (secciones `#regalos`, `#coleccionista`, `#vende`, `#taller` después de `#donde`)

- [ ] **Step 1: regalos.json**
```json
[
  { "para": "Tu papá chavoruco", "texto": "Casete o control retro. Le va a contar a todos.", "productos": ["casete", "control-retro"] },
  { "para": "Tu compa otaku", "texto": "Máscara oni con chip a su playlist.", "productos": ["mascara-oni", "ramen"] },
  { "para": "Tu perro o gato", "texto": "Placa con tu teléfono. Con chip, guarda más datos.", "productos": ["placa-huella", "hueso"] },
  { "para": "La mochila del niño", "texto": "Nombre pixel y el teléfono de mamá o papá.", "productos": ["nombre-pixel"] }
]
```
- [ ] **Step 2: Secciones** — `#regalos`: cuatro ventanas con `para`, `texto` y enlaces a `/llavero/{slug}` (resolver nombre con `getProducto`). `#coleccionista`: ilustración SVG de tarjeta con 5 casillas + sello pixel y texto "Junta cinco sellos y el sexto llavero es gratis. La tarjeta te la doy en el puesto." `#vende`: resumen "¿Quieres vender LlaveCorp con tus amigos? Hay precio de mayoreo desde 10 piezas." + enlace `/mayoreo`. `#taller`: `<div class="grid">` con placeholders "Foto real muy pronto" (3) y texto sobre la impresora; cuando existan fotos, se listan desde `src/data/taller.json` (`[{ "src": "", "alt": "" }]`, crear vacío).
- [ ] **Step 3: Prueba de dist**: ids `regalos`, `coleccionista`, `vende`, `taller` presentes. **Commit:** `git commit -m "Guía de regalos, coleccionista, vende con nosotros y taller"`.

---

### Task 14: Páginas `/donde` y `/mayoreo`

**Files:**
- Create: `src/pages/donde.astro`, `src/pages/mayoreo.astro`

- [ ] **Step 1: donde.astro** — misma lista que `#donde` en una ventana por día; si no hay activos, texto "Esta semana descansamos. Escríbenos y te decimos dónde caemos." `<BotonWhatsApp tipo="avisame">`.
- [ ] **Step 2: mayoreo.astro** — tabla accesible (`<table>` con `<caption>`, `scope`) de `getMayoreo()`: Cantidad ("10 a 24", "25 a 49", "50 o más"), precio básico, precio NFC, nota. Texto: mezcla de diseños permitida, entrega en el puesto o punto acordado, pago al recoger. `<BotonWhatsApp tipo="mayoreo" texto="Quiero vender LlaveCorp" />`.
- [ ] **Step 3: Prueba de dist**: `dist/donde/index.html` y `dist/mayoreo/index.html` existen; mayoreo contiene "50 o más". **Commit:** `git commit -m "Páginas dónde y mayoreo"`.

---

## Etapa 4 — Extras y salida

### Task 15: Modo noche arcade con botón

**Files:**
- Create: `src/components/ToggleTema.astro`, `src/scripts/tema.ts`
- Modify: `src/layouts/Base.astro` (botón en pie)

- [ ] **Step 1: tema.ts**
```ts
const CLAVE = 'llavecorp-tema';
export function temaActual(): 'claro' | 'noche' {
  const forzado = document.documentElement.dataset.tema; if (forzado === 'claro' || forzado === 'noche') return forzado;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'noche' : 'claro';
}
export function fijarTema(t: 'claro' | 'noche') { document.documentElement.dataset.tema = t; try { localStorage.setItem(CLAVE, t); } catch {} }
document.addEventListener('DOMContentLoaded', () => {
  const b = document.querySelector<HTMLButtonElement>('[data-toggle-tema]'); if (!b) return;
  const pintar = () => { b.textContent = temaActual() === 'noche' ? 'Modo día' : 'Noche arcade'; b.setAttribute('aria-pressed', String(temaActual() === 'noche')); };
  b.addEventListener('click', () => { fijarTema(temaActual() === 'noche' ? 'claro' : 'noche'); pintar(); }); pintar();
});
```
- [ ] **Step 2: ToggleTema.astro** — `<button class="btn btn--fantasma" data-toggle-tema type="button">Noche arcade</button>` + `<script src="../scripts/tema.ts">`. Ponerlo en el pie de `Base.astro`.
- [ ] **Step 3: Verificar** en navegador: alterna, persiste al recargar (el script inline del head lo aplica antes de pintar). Contraste AA de `--tinta` sobre `--fondo` en ambos temas (usar el inspector; crema/negro ≈ 15:1, `#f3efff` sobre `#0d0b14` ≈ 17:1). **Commit:** `git commit -m "Modo noche arcade"`.

---

### Task 16: Sonidos 8-bit opcionales

**Files:**
- Create: `src/components/ToggleSonido.astro`, `src/scripts/sonido.ts`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: sonido.ts** — Web Audio con osciladores `square`: `beep(freq, ms)`, `sonidoStart()` (dos notas), `sonidoPowerUp()` (arpegio 4 notas ascendentes). Estado en `localStorage` `llavecorp-sonido` (`'on'|'off'`, por defecto `off`). Escucha `click` en `.btn--start` y el evento `llavecorp:powerup`. Crea el `AudioContext` solo tras el primer clic del usuario.
- [ ] **Step 2: ToggleSonido.astro** — botón `data-toggle-sonido` con `aria-pressed`, texto "Sonido: apagado / encendido". En el pie.
- [ ] **Step 3: Verificar** en navegador: apagado por defecto; al encender, START suena. **Commit:** `git commit -m "Sonidos 8-bit opcionales"`.

---

### Task 17: Easter eggs

**Files:**
- Create: `src/scripts/easter.ts`
- Modify: `src/layouts/Base.astro`, `src/styles/efectos.css`

- [ ] **Step 1: easter.ts** — (a) Código Konami (`↑↑↓↓←→←→BA`) por `keydown` → `lluviaCorazones()` (crea 30 `<span class="corazon-cae">` en posiciones aleatorias, animación `caer` 3 s, se eliminan al terminar); (b) cinco toques a `.mascota` en 3 s → `lluviaCorazones()`; (c) escribir `vhs` → `document.documentElement.classList.toggle('vhs')`, clase que agrega ruido (fondo `repeating-linear-gradient` animado) y desplazamiento de 1 px de `hue-rotate`. Todo respeta `prefers-reduced-motion` (si está activo, no hace nada).
- [ ] **Step 2: CSS** para `.corazon-cae`, `@keyframes caer`, `.vhs`.
- [ ] **Step 3: Verificar** manual. **Commit:** `git commit -m "Easter eggs: Konami, mascota y modo VHS"`.

---

### Task 18: Open Graph, sitemap, robots y analítica opcional

**Files:**
- Create: `public/og/default.png` (1200×630), `public/robots.txt`, `scripts/generar-og.mjs`
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: generar-og.mjs** — usa `@resvg/resvg-js` (devDependency) para rasterizar `public/og/default.svg` (logo + lema + mascota sobre crema con halftone) a `default.png`. Script `"og": "node scripts/generar-og.mjs"`. Ejecutar y commitear el PNG.
- [ ] **Step 2: robots.txt**: `User-agent: *\nAllow: /\nSitemap: https://llavecorp.com/sitemap-index.xml`.
- [ ] **Step 3: Analítica** — en `Base.astro`, si `marca.analitica_token` no está vacío: `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={`{"token": "${marca.analitica_token}"}`}></script>`. Con el token vacío no se emite nada.
- [ ] **Step 4: Prueba de dist**: existe `dist/sitemap-index.xml`; `index.html` contiene `og:image` con `/og/default.png`; no contiene `cloudflareinsights` (token vacío). **Commit:** `git commit -m "Open Graph, sitemap, robots y analítica opcional"`.

---

### Task 19: README de operación, nginx y verificación final

**Files:**
- Create: `README.md`, `deploy/nginx.conf`

- [ ] **Step 1: nginx.conf**
```nginx
server {
  listen 80; server_name llavecorp.com www.llavecorp.com;
  return 301 https://llavecorp.com$request_uri;
}
server {
  listen 443 ssl http2; server_name llavecorp.com;
  # ssl_certificate y ssl_certificate_key los pone certbot
  root /var/www/llavecorp/dist; index index.html;
  location / { try_files $uri $uri/ $uri/index.html =404; }
  location ~* \.(css|js|svg|png|webp|woff2)$ { expires 30d; add_header Cache-Control "public, immutable"; }
}
```
- [ ] **Step 2: README.md** en español: qué es, requisitos (Node 24), comandos (`dev`, `build`, `verificar`, `og`), **cómo agregar** producto / saga / uso / tianguis / rango de mayoreo / foto del taller (campo por campo), cómo subir fotos (`public/img/productos/{slug}.webp` y poner la ruta en `imagen`), cómo cambiar precios (respetar `precio_minimo`), cómo poner el WhatsApp y el token de analítica, cómo desplegar en VPS (copiar `dist/` a `/var/www/llavecorp`, `nginx.conf`, certbot), en Cloudflare Pages (build `npm run build`, salida `dist`) y en Vercel (framework Astro, salida `dist`), qué grabar en el chip (`https://llavecorp.com/activa?c=1`) y en el QR (`?q=1`), y cómo imprimir el logo desde `public/logo/llavecorp-capas.svg`.
- [ ] **Step 3: Verificación final** — Run: `npm run verificar`; revisar en navegador a 360 px y 1280 px las rutas `/`, `/saga/anime`, `/llavero/casete`, `/activa`, `/activa/wifi`, `/donde`, `/mayoreo`, en tema claro y noche. Confirmar: sin scroll horizontal, todos los botones de WhatsApp abren `wa.me`, no aparece ninguna marca registrada (buscar en `dist` con `grep -ril "goku\|naruto\|pokemon\|nintendo\|dragon ball" dist` → vacío).
- [ ] **Step 4: Commit** — `git commit -m "README de operación y configuración de nginx"`.

---

## Auto-revisión del plan

- **Cobertura del spec:** 0 decisiones → Tasks 1, 2, 18; 2.1–2.2 líneas y precios → 3, 6, 7; 2.3 sagas → 3, 7, 8; 2.4 cápsula → 12; 2.5 coleccionista → 13; 2.6 mayoreo → 3, 13, 14; 2.7 logo → 5; 3 personalización → 6, 7, 8; 4 estilo → 4, 5, 15, 16; 5 rutas y secciones → 7, 8, 10, 11, 13, 14; 6 datos → 1, 3, 9, 13; 7 instructivo → 9, 10, 11; 8 técnicos → 4, 18; 9 despliegue → 19; 10 etapas → orden de tareas; 11 aceptación → pruebas de dist y Task 19; 12 fuera de alcance → nada lo implementa.
- **Placeholders:** ninguno; los "por definir" en `tianguis.json` son datos del dueño, no del plan.
- **Consistencia de nombres:** `waLink`/`mensaje` (Task 2) se usan igual en 6, 7, 10, 14; `getUsos`/`getUso`/`PASOS_BASE` (9) en 10, 11; `destacados`/`precioDesde`/`productosPorSaga`/`getProducto` (3) en 7, 8, 13; `llavecorp:powerup` (11) en 16; clases CSS de Task 4 en todas.
