# LlaveCorp — tienda de llaveros con poder

Sitio estático de LlaveCorp: llaveros impresos en 3D, con y sin chip NFC, estilo "Canal de las 4" (retro pixel + anime de las tardes). Pedidos por WhatsApp, sin carrito ni base de datos.

- **Tienda:** `/` (catálogo por sagas, cápsula sorpresa, personalización, dónde estamos, regalos, coleccionista, mayoreo, taller)
- **Instructivo NFC:** `/activa` (a donde apunta el chip y el QR de cada llavero)
- **Otras páginas:** `/saga/{slug}`, `/llavero/{slug}`, `/activa/{slug}`, `/donde`, `/mayoreo`

Specs y plan en `docs/superpowers/`.

## Requisitos

- Node 24 o más nuevo (viene con npm). Astro 7, Vitest 5.

## Comandos

```bash
npm install          # una sola vez
npm run dev          # servidor local con recarga: http://localhost:4321
npm run build        # genera dist/ listo para subir
npm run preview      # sirve dist/ para revisarlo
npm test             # pruebas de datos y enlaces
npm run verificar    # build + pruebas (úsalo antes de subir)
npm run og           # regenera la imagen de Open Graph (public/og/default.png)
npm run csp-hash     # hash del script inline del tema, para la CSP de deploy/nginx.conf
```

Si el build falla con "Catálogo inválido", el mensaje dice qué producto y qué regla rompió (precio bajo el mínimo, más de 4 colores, saga inexistente, slug repetido).

## Configuración de la marca: `src/config/marca.json`

| Campo | Qué es |
|---|---|
| `whatsapp` | Tu número con lada de país, sin espacios ni signos. Ejemplo: `528112345678`. **Cámbialo antes de subir**: mientras diga `{{WHATSAPP}}` los botones no abren ningún chat. |
| `precio_minimo` | Precio mínimo del catálogo. El build falla si un producto disponible queda por debajo. |
| `colores_disponibles` | Tus filamentos: nombre y color aproximado en hexadecimal. Se muestran como muestras en "Hazlo tuyo". |
| `redes` | Enlaces a Instagram, TikTok, Facebook. Los vacíos no se muestran. |
| `tu_dia_url` | Enlace a Tu Día para el pie. Vacío = no aparece. |
| `analitica_token` | Token de Cloudflare Web Analytics. Vacío = sin analítica. |
| `mascota`, `ciudad`, `lema` | Textos que aparecen en varias partes. |

## Cómo agregar cosas (solo editas JSON y vuelves a construir)

### Un producto: `src/data/productos.json`

```json
{
  "slug": "gato-suerte",            // único, minúsculas y guiones; es la URL /llavero/gato-suerte
  "nombre": "Gato de la suerte",
  "saga": "anime",                  // slug de una saga existente
  "descripcion": "Una línea con gracia.",
  "tamano": "5 cm",                 // texto libre: alto o largo aproximado
  "precio_basico": 70,              // pesos, entero, nunca menor a precio_minimo
  "precio_nfc": 110,                // 0 = este diseño no se ofrece con chip
  "colores": 3,                     // 1 a 4
  "editable": true,                 // muestra la etiqueta Editable y el bloque de personalización
  "texto_editable": false,          // acepta nombre o frase
  "colores_editables": true,        // se pueden cambiar los colores (no la cantidad)
  "imagen": "",                     // vacío = placeholder de la saga; si no, "/img/productos/gato-suerte.webp"
  "destacado": true,                // aparece en las fichas del hero
  "disponible": true                // false = "Agotado", sin botones de pedido
}
```

### Una saga: `src/data/sagas.json`

`slug`, `nombre`, `descripcion`, `icono`, `orden`. Si creas una saga nueva, agrega también su placeholder en `public/img/placeholders/{slug}.svg` (copia uno existente y cambia el dibujo).

### Un uso del instructivo: `src/data/usos.json`

`slug`, `titulo`, `icono` (uno de los de `src/components/IconoUso.astro`), `descripcion_corta`, `compatibilidad` (`["android", "iphone"]`), `tipo_registro`, `pasos` (lista de textos), `consejo`.

### Un tianguis o mercado: `src/data/tianguis.json`

`dia` (lunes a domingo, con o sin acento), `lugar`, `zona`, `horario`, `activo` (false lo oculta sin borrarlo), `nota`.

### Rangos de mayoreo: `src/data/mayoreo.json`

`desde`, `hasta` (`null` en el último = "o más"), `precio_basico`, `precio_nfc`, `nota`.

### Guía de regalos: `src/data/regalos.json`

`para`, `texto`, `productos` (lista de slugs de productos).

### Fotos del taller: `src/data/taller.json`

Lista de `{ "src": "/img/taller/impresora.webp", "alt": "La impresora a media impresión" }`. Mientras esté vacía se muestra el aviso de "la impresora va en camino".

## Fotos de producto

1. Toma la foto cuadrada, con luz pareja.
2. Guárdala en `public/img/productos/{slug}.webp` (WebP de 800×800 pesa poco y se ve bien; JPG también sirve).
3. Pon la ruta en el campo `imagen` del producto: `"/img/productos/{slug}.webp"`.
4. `npm run verificar` y sube `dist/`.

## Chip y QR

- Graba en el chip: `https://llavecorp.com/activa?c=1`
- El QR de atrás apunta a: `https://llavecorp.com/activa?q=1`
- `?c=1` y `?q=1` solo sirven para distinguir en la analítica de dónde vienen las visitas.

## Imprimir el logo como llavero

`public/logo/llavecorp-capas.svg` tiene una capa por color: `capa-fondo` (pieza completa, 3 a 4 mm), `capa-acento` (mitad derecha, 0.6 a 1 mm encima), `capa-relieve` (llave y barras, 0.6 a 1 mm encima) y `capa-argolla` (marca del barreno). A 45 mm de ancho ninguna forma mide menos de 2 mm. El chip de 25 mm va en una cavidad trasera bajo la mitad derecha, lejos de la argolla.

Importa el SVG en el programa de la impresora (Bambu Studio, PrusaSlicer, Tinkercad, Fusion) y extruye cada capa con su altura.

## Despliegue

### VPS con nginx (junto a Tu Día)

```bash
npm run verificar
scp -r dist/ usuario@servidor:/var/www/llavecorp/dist
```

Config de nginx en `deploy/nginx.conf` (instrucciones en el mismo archivo). Sin Node en el servidor: solo archivos.

### Cloudflare Pages o Vercel (gratis)

- Framework: Astro · Comando de build: `npm run build` · Carpeta de salida: `dist`
- Apunta el dominio `llavecorp.com` desde el panel del servicio.

## Estructura

```
src/config/marca.json     marca, WhatsApp, colores, precio mínimo
src/data/*.json           productos, sagas, usos, tianguis, mayoreo, regalos, taller
src/lib/*.ts              carga y validación de datos, enlaces de WhatsApp
src/components/*.astro    ventana 90s, botones, tarjeta, logo, mascota, cápsula...
src/pages/                rutas del sitio
src/styles/               tokens (temas), base, componentes, efectos
src/scripts/              tema, sonido, progreso de tutoriales, easter eggs
public/logo/              logo web, mono y por capas para imprimir
public/img/placeholders/  imágenes de relleno por saga
tests/                    pruebas (vitest)
deploy/nginx.conf         configuración del servidor
```
