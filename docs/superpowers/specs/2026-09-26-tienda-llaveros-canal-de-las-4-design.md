# Spec de diseño — LlaveCorp, tienda de llaveros estilo "Canal de las 4" (venta al menudeo)

**Versión:** 1.0 · **Fecha:** 2026-09-26 · **Estado:** aprobado por el dueño el 2026-09-26

> Complementa y absorbe `spec_pagina_llaveros_marca_nueva.md` (instructivo NFC, v1.0 del 2026-09-25). Donde este documento contradiga al anterior, manda este documento. El instructivo se conserva completo como una zona del sitio (sección 7).

---

## 0. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Marca y dominio | **LlaveCorp**, dominio `llavecorp.com` (comprar también `.mx`). El nombre alude a una corporación de cápsulas de anime solo por concepto: el logo y el arte son originales y no copian ningún logotipo existente. |
| WhatsApp | Marcador `{{WHATSAPP}}` en configuración hasta que el dueño lo entregue. |
| Mascota y estilo | Mascota **Llavi**. El estilo visual se llama "Canal de las 4". Lema: "Llaveros con poder". |
| Anime | Solo **estilo** anime original (chibis, tropos visuales, íconos genéricos). Ningún personaje, nombre, logo ni frase registrada de anime, videojuegos o TV. Aplica a todo el sitio, incluyendo fotos de producto que se suban. |
| Cobro | Solo por WhatsApp, pago en efectivo o transferencia. Sin carrito, sin pasarela, sin cuentas de usuario. |
| Precios | Cada diseño tiene su propio precio (varían tamaño y largo). Precio mínimo de catálogo: **$60 MXN**. La tienda comunica "desde $60". |
| Personalización | Sin personalizador en línea. Modelo "Editable / Colores / Diseño nuevo" (sección 3). El dueño edita y manda foto de preview por WhatsApp. |
| URL del chip | `https://llavecorp.com/activa?c=1`. QR trasero: `https://llavecorp.com/activa?q=1`. La raíz `/` es la tienda. |
| Hosting | Sitio estático. El VPS es de Tu Día; este sitio puede vivir ahí (nginx, carpeta `dist/`, dominio `llavecorp.com`) o gratis en Cloudflare Pages o Vercel. El build debe funcionar en ambos sin cambios. |
| Fotos | Placeholders ilustrados (pixel/anime) hasta que llegue la impresora 3D. Cada producto tiene un campo `imagen` que se llena después sin tocar código. |
| Stack | Astro (salida estática), CSS propio sin framework, JavaScript mínimo como mejora progresiva. |

---

## 1. Objetivo y público

Sitio de una marca nueva de llaveros impresos en 3D, con y sin chip NFC, vendidos al menudeo en tianguis, mercados, y a familiares y amigos (incluyendo amigos que revenden). El sitio debe:

1. Mostrar el catálogo con precios y permitir pedir por WhatsApp en un toque.
2. Explicar qué es el llavero NFC y por qué vale más que uno normal.
3. Decir dónde y cuándo se puede comprar en persona.
4. Explicar con claridad las reglas de personalización.
5. Servir como instructivo cuando el comprador acerca el llavero al celular (zona `/activa`).

**Público:** chavorucos (25–45, nostálgicos de los 90s/2000s y del anime de TV abierta), fans de videojuegos y anime, papás, dueños de mascotas, y revendedores pequeños.

**Idioma y tono:** español mexicano, chavoruco, cálido, con humor de tianguis. Nunca vulgar.

---

## 2. Producto

### 2.1 Dos líneas
- **Básico:** llavero impreso en 3D, sin chip. Desde $60.
- **Con poder NFC:** el mismo llavero con chip NTAG213 grabado con la URL del instructivo. Precio mayor por diseño. Es el diferenciador de la marca y cada llavero vendido trae visitas al sitio.

### 2.2 Precios
- Cada producto declara su propio `precio_basico` y `precio_nfc` en pesos enteros; ningún precio de catálogo baja de $60.
- El hero y el catálogo muestran "Desde $60" calculado automáticamente como el mínimo de los productos disponibles, para que no haya que editarlo a mano.
- Los productos iniciales llevan precios de ejemplo (mínimo 60) que el dueño ajusta en el archivo de datos.

### 2.3 Sagas (colecciones)
El catálogo se organiza en sagas. Cada saga tiene nombre, descripción corta, ícono e ilustración de cabecera. Sagas iniciales (editables por datos):

| Slug | Saga | Contenido |
|---|---|---|
| `retro` | Saga Retro | Casete, control genérico, consola portátil genérica, disquete, mascota virtual genérica |
| `anime` | Saga Anime | Chibis originales, onigiri, katana, máscara oni, torii, ramen, gato de la suerte, mecha genérico |
| `mascotas` | Saga Mascotas | Placa con huella, hueso, pez, hogar de mascota |
| `nombre` | Saga Con Nombre | Diseños editables con texto (sección 3) |
| `capsula` | Cápsula Sorpresa | Llavero aleatorio de cualquier saga en cápsula estilo gashapon |

### 2.4 Cápsula sorpresa
Producto físico de precio único con un llavero aleatorio. En la página tiene su propia tarjeta con animación de cápsula girando (CSS, respeta `prefers-reduced-motion`). El texto explica: "no sabes cuál te toca, esa es la gracia".

### 2.5 Tarjeta de coleccionista
Tarjeta física de sellos: compra cinco llaveros y el sexto es gratis. La página solo la explica y muestra una ilustración de la tarjeta; no hay registro digital.

### 2.6 Mayoreo / "Vende con nosotros"
Sección para amigos y familiares que quieran revender. Muestra rangos de cantidad y precio por pieza desde un archivo de datos, y un botón de WhatsApp con mensaje prellenado. Sin formulario.

---

## 2.7 Logo y llavero de presentación

El logo de LlaveCorp se diseña para verse en pantalla **y** para imprimirse en 3D como llavero con chip, que el dueño trae en sus llaves y acerca al celular de quien pregunte.

- **Concepto:** cápsula horizontal con una llave pixel dentro y la palabra LLAVECORP en tipografía pixel debajo. La misma cápsula, abierta a la mitad, es la animación de la Cápsula Sorpresa.
- **Reglas de impresión:** tipografía pixel; ninguna forma menor a 2 mm de ancho; máximo tres colores (fondo, letra, acento); proporción pensada para unos 45 mm de largo con espacio para una etiqueta NFC de 25 mm y la argolla en el extremo opuesto al chip.
- **Entregables:** `public/logo/llavecorp.svg` (color, para web), `public/logo/llavecorp-mono.svg` (un color) y `public/logo/llavecorp-capas.svg` con una capa nombrada por color para extruir en el programa de la impresora.
- **Producto:** "Llavero LlaveCorp" en la Saga Retro, con chip, marcado como `destacado`. Es la tarjeta de presentación de la marca.

---

## 3. Personalización

Modelo de tres niveles. Estos textos son el copy base de la sección "Hazlo tuyo" y del bloque que aparece en cada producto editable.

**Editable.** Los diseños con la etiqueta *Editable* se pueden adaptar: tu nombre o texto, y cambio de colores. Me escribes por WhatsApp con el diseño, el nombre y los colores que quieres. Yo lo edito y te mando una foto de cómo queda antes de imprimirlo.

**Colores.** Cada llavero se imprime con máximo cuatro colores. Cada diseño ya trae su número de colores, y ese número no cambia: puedes elegir cuáles, no cuántos. Un diseño de dos colores sigue siendo de dos colores, solo que con los que tú escojas. Los colores disponibles son los de la paleta de filamentos (mostrada como muestras en la página).

**Diseño nuevo.** Si quieres algo que no está en el catálogo, se cotiza aparte. El precio depende del tamaño y del número de colores. Mándame la idea o una referencia por WhatsApp y te digo cuánto y cuándo.

**Reglas de negocio que el sitio debe reflejar:**
- Solo los productos con `editable: true` muestran la etiqueta y el bloque de personalización.
- Cada producto declara `colores: 1..4`. La ficha muestra "N colores" y las muestras de la paleta.
- Un producto puede declarar `texto_editable: true` (acepta nombre o frase corta) y `colores_editables: true` de forma independiente.
- El mensaje prellenado de WhatsApp para un editable incluye el nombre del producto y campos vacíos para texto y colores, para que el cliente solo los llene.
- El bloque "Diseño nuevo" nunca muestra precio; solo la aclaración de que se cotiza.
- La paleta de filamentos vive en configuración (`colores_disponibles`) con nombre y valor hexadecimal aproximado.

---

## 4. Estilo visual: "Canal de las 4"

Fusión del retro pixel del spec anterior con anime de TV abierta de las tardes de los 90s/2000s. Todo el arte es original o genérico.

### 4.1 Base retro (se conserva del spec anterior)
- Fuente pixel solo en títulos y botones (Press Start 2P o Silkscreen); texto de lectura en Space Grotesk o Inter, mínimo 16 px.
- Ventanas estilo sistema operativo 90s (barra de título con botones) como contenedor de tarjetas.
- Botón principal estilo "PRESIONA START" parpadeante.
- Barra de corazones pixel para el progreso de tutoriales (solo en `/activa`).
- Scanlines muy sutiles en el hero. Íconos pixel originales.

### 4.2 Capa anime (nueva)
- **Tramas halftone** y **líneas de velocidad** como fondos de hero y cabeceras de saga.
- **Emotes** de anime como adornos: gota de sudor, signo de sorpresa, venita, brillos.
- **Mascota chibi original** `{{MASCOTA}}` (por defecto "Llavi", un llavero con cara y bufanda) que presenta secciones y reacciona en easter eggs.
- Los mensajes de logro en `/activa` dicen **"¡POWER UP!"** en vez de "Logro desbloqueado".
- Hero de la tienda como **pantalla de selección de personaje**: los productos destacados son fichas seleccionables.

### 4.3 Paleta (ajuste al spec anterior)
El spec anterior proponía los 4 verdes de consola portátil como tema principal. Para una tienda eso apaga las fotos de producto, así que:
- **Tema claro (por defecto):** fondo crema tipo papel, texto casi negro, acentos pop de anime: magenta, cian y amarillo, más un verde pixel reservado para todo lo "NFC / poder".
- **Modo noche arcade:** fondo oscuro con los mismos acentos en neón. Se activa con `prefers-color-scheme: dark` y con un botón manual que recuerda la elección en `localStorage` (con `try/catch`).
- Contraste WCAG AA en ambos temas. Los 4 verdes de consola se usan como paleta decorativa dentro de `/activa`, no como tema global.

### 4.4 Movimiento y sonido
- Todo efecto (parpadeo, scanlines, cápsula, líneas de velocidad) se desactiva con `prefers-reduced-motion`.
- Sonidos 8-bit generados con Web Audio, apagados por defecto, botón de silencio visible. Sin archivos de audio con derechos.

---

## 5. Estructura del sitio (rutas)

| Ruta | Contenido |
|---|---|
| `/` | Tienda: hero selección de personaje, "Con poder NFC", catálogo por sagas, cápsula sorpresa, "Hazlo tuyo", "¿Dónde estamos?", guía de regalos, tarjeta de coleccionista, "Vende con nosotros", detrás del taller, pie |
| `/saga/{slug}` | Página de una saga con todos sus productos |
| `/llavero/{slug}` | Ficha de producto: imagen, precio (básico y NFC), colores, editable o no, botón "Lo quiero" a WhatsApp, enlace a su saga |
| `/activa` | Instructivo NFC completo (sección 7). Destino del chip y del QR |
| `/activa/{slug}` | Tutorial de un uso, compartible |
| `/donde` | Calendario de tianguis y mercados (misma info que la sección de `/`, en página propia para compartir) |
| `/mayoreo` | Precios por volumen y WhatsApp |

**Secciones de `/` en orden:**
1. **Hero** "Elige tu llavero" con fichas de productos destacados, "Desde $60", y botón PRESIONA START que baja al catálogo.
2. **Con poder NFC:** animación de un celular acercándose al llavero, tres usos ejemplo, enlace a `/activa`.
3. **Catálogo por sagas:** cabecera por saga con sus productos; cada tarjeta muestra imagen, nombre, precio, número de colores, etiqueta Editable si aplica, y botón "Lo quiero".
4. **Cápsula sorpresa.**
5. **Hazlo tuyo:** las tres reglas de personalización (sección 3) y muestras de la paleta.
6. **¿Dónde estamos esta semana?:** lista de puestos por día con lugar y horario, desde datos. Botón "Avísame cuando andes cerca" a WhatsApp.
7. **Guía de regalos:** cuatro tarjetas (papá chavoruco, compa otaku, tu perro o gato, mochila del niño) que enlazan a productos.
8. **Tarjeta de coleccionista.**
9. **Vende con nosotros** (resumen, enlace a `/mayoreo`).
10. **Detrás del taller:** galería de fotos y videos cortos; vacía con placeholder hasta que existan.
11. **Pie:** marca, redes, "Hecho con nostalgia en Monterrey", enlace discreto "¿Tienes boda o XV? Conoce Tu Día", botón de tema y de sonido.

**Botón flotante de WhatsApp** en todas las páginas, con estilo de botón "Continuar" de videojuego.

---

## 6. Datos y configuración

Todo lo que cambia seguido vive en archivos de datos; agregar un producto, un uso o un tianguis no toca código.

### 6.1 `src/config/marca.json`
```json
{
  "marca": "LlaveCorp",
  "dominio": "llavecorp.com",
  "lema": "Llaveros con poder",
  "whatsapp": "{{WHATSAPP}}",
  "mascota": "Llavi",
  "ciudad": "Monterrey",
  "precio_minimo": 60,
  "redes": { "instagram": "", "tiktok": "", "facebook": "" },
  "tu_dia_url": "",
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
La lista de colores es de ejemplo; se ajusta a los filamentos reales. `precio_minimo` solo sirve para validar en el build que ningún producto quede por debajo.

### 6.2 `src/data/sagas.json`
Campos: `slug`, `nombre`, `descripcion`, `icono`, `orden`.

### 6.3 `src/data/productos.json`
Campos por producto:
```json
{
  "slug": "gato-suerte",
  "nombre": "Gato de la suerte",
  "saga": "anime",
  "descripcion": "Mueve la patita para que te vaya bien en el tianguis.",
  "tamano": "5 cm",
  "precio_basico": 70,
  "precio_nfc": 110,
  "colores": 3,
  "editable": true,
  "texto_editable": true,
  "colores_editables": true,
  "imagen": "",
  "destacado": true,
  "disponible": true
}
```
- `imagen` vacía muestra el placeholder ilustrado de la saga.
- `precio_nfc` en 0 significa que ese diseño no se ofrece con chip.
- `tamano` es texto libre (alto o largo aproximado) y se muestra en la ficha, porque el precio depende de él.
- `disponible: false` muestra la tarjeta con etiqueta "Agotado" y sin botón de pedido.
- Precios en pesos mexicanos, enteros, nunca menores a `precio_minimo`. El build falla con mensaje claro si un producto lo viola.

### 6.4 `src/data/tianguis.json`
Campos por puesto: `dia` (lunes…domingo), `lugar`, `zona`, `horario`, `activo`, `nota`.

### 6.5 `src/data/mayoreo.json`
Rangos: `desde`, `hasta`, `precio_basico`, `precio_nfc`, `nota`.

### 6.6 `src/data/usos.json`
Igual que la sección 4 del spec anterior: `slug`, `titulo`, `icono`, `descripcion_corta`, `compatibilidad`, `pasos[]`, `consejo`. Los once usos del spec anterior se cargan tal cual.

### 6.7 Mensajes de WhatsApp
Se generan con una función única `waLink(tipo, datos)` que arma `https://wa.me/{{WHATSAPP}}?text=...` codificado. Plantillas:
- **Producto:** "Hola, vi LlaveCorp y quiero el llavero *{nombre}* ({básico | con NFC})."
- **Producto editable:** la anterior más "Texto/nombre: ___ · Colores: ___".
- **Diseño nuevo:** "Hola, quiero cotizar un diseño nuevo. Idea: ___ · Tamaño aprox: ___ · Colores: ___".
- **Cápsula:** "Hola, quiero una cápsula sorpresa."
- **Mayoreo:** "Hola, quiero vender llaveros de LlaveCorp. Cantidad aprox: ___".
- **Avísame:** "Hola, avísame cuando anden por ___".
- **Instructivo:** "Hola, vi el instructivo de mi llavero y quiero..."

---

## 7. Instructivo NFC (`/activa`)

Se implementa completo según las secciones 1, 3, 4, 5 y 6 del spec anterior, con estos cambios:

- Vive en `/activa`; los tutoriales en `/activa/{slug}` (antes `/usos/{slug}`).
- El mensaje de logro es "¡POWER UP!" y lo presenta la mascota.
- El hero del instructivo mantiene "¡Nuevo objeto obtenido: Llavero NFC!".
- La sección "¿Quieres más?" enlaza a la tienda (`/`) además del WhatsApp.
- Los parámetros `?c=1` y `?q=1` se leen solo para analítica; no cambian el contenido.
- La barra de corazones y el progreso en `localStorage` funcionan igual; sin `localStorage` la página funciona sin progreso.

---

## 8. Requisitos técnicos

- Astro con salida estática. Sin framework de UI; componentes `.astro` y CSS propio con variables en `:root`.
- Mobile-first. Sin scroll horizontal desde 320 px. Gutter lateral de 16 px.
- Carga inicial menor a 1 s en 4G: imágenes SVG o WebP, sin librerías pesadas, fuentes con `font-display: swap`.
- Todo el contenido visible sin JavaScript. JavaScript solo para: tema, sonido, progreso de tutoriales, easter eggs, animaciones que lo requieran.
- `lang="es-MX"`, metadatos Open Graph por página con imagen ilustrada, `sitemap` y `robots.txt`.
- Accesibilidad: contraste AA, foco visible, `prefers-reduced-motion`, textos alternativos en toda imagen, botones con etiqueta.
- Sin cookies. Analítica opcional sin cookies (Cloudflare Web Analytics o equivalente), activada por una variable de configuración; apagada por defecto.
- Sin dependencias de tiempo de ejecución en el servidor.

---

## 9. Hosting y despliegue

- `npm run build` genera `dist/`.
- **VPS de Tu Día:** se documenta un bloque de nginx que sirve `dist/` en `llavecorp.com` con caché de estáticos y redirección a HTTPS. Sin proceso Node en producción.
- **Cloudflare Pages / Vercel:** se documenta el comando de build y la carpeta de salida. Ambos gratis para este volumen.
- No hay redirecciones en v1, así que no se necesitan `_redirects` ni `vercel.json`.
- README con: cómo agregar un producto, una saga, un uso, un tianguis; cómo subir fotos; cómo cambiar precios; cómo desplegar.

---

## 10. Etapas

Cada etapa termina con el sitio funcionando y revisable en el navegador.

1. **Base y tienda:** proyecto Astro, configuración y datos, sistema de diseño Canal de las 4 (tokens, tipografía, ventana 90s, botón START, tarjetas), logo en SVG (web, mono y por capas) y mascota en SVG, hero, "Con poder NFC", catálogo por sagas, fichas de producto, páginas de saga, "Hazlo tuyo", "¿Dónde estamos?", pie, botón flotante de WhatsApp.
2. **Instructivo NFC:** `/activa` y `/activa/{slug}` con los once usos, barra de corazones, POWER UP, consejos, guardar partida.
3. **Conversión:** cápsula sorpresa con animación, guía de regalos, tarjeta de coleccionista, `/mayoreo`, `/donde`, detrás del taller.
4. **Extras y salida:** modo noche arcade con botón, sonidos 8-bit, easter eggs (código Konami, cinco toques a la mascota, modo VHS), analítica opcional, Open Graph, README de operación y despliegue, guía de nginx.

---

## 11. Criterios de aceptación

- Desde el celular, en menos de 10 segundos se entiende qué vende la marca, desde cuánto, y cómo pedir.
- Cualquier producto se puede pedir por WhatsApp en un toque, con el mensaje correcto ya escrito.
- Un producto editable muestra sus reglas de personalización sin ambigüedad: qué se puede cambiar, cuántos colores tiene, y que un diseño nuevo se cotiza.
- Agregar producto, saga, uso o tianguis requiere solo editar un archivo de datos y volver a construir.
- Al acercar un llavero grabado con `https://llavecorp.com/activa?c=1`, abre el instructivo y un usuario sin experiencia puede grabar su Wi-Fi o su WhatsApp siguiendo solo el tutorial.
- Se ve bien en Android económico e iPhone; sin scroll horizontal; contraste AA en tema claro y noche arcade.
- No aparece ningún personaje, logo, nombre ni frase registrada de terceros.
- `npm run build` produce un `dist/` que se sirve tal cual en nginx, Cloudflare Pages o Vercel.

---

## 12. Fuera de alcance (v1)

- Carrito, pagos en línea, cuentas de usuario, inventario en tiempo real.
- Personalizador en línea con preview automático.
- Registro digital de la tarjeta de coleccionista.
- Contador público "Llaveros activados" (requiere backend).
- Panel de administración; los datos se editan en los archivos JSON.
