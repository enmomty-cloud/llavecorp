# Especificación — Página instructivo de llaveros NFC (marca nueva)

**Versión:** 1.0 · **Fecha:** 2026-09-25

> Producto **independiente de Tu Día**. El nombre de la marca está pendiente: usar el marcador `{{MARCA}}`, el dominio `{{DOMINIO}}` y el WhatsApp `{{WHATSAPP}}` en todo el proyecto (centralizados en un solo archivo de configuración).

---

## 0. Instrucciones para Claude Code

1. Proyecto nuevo, **separado** del repositorio de Tu Día.
2. Sitio **estático** (sin base de datos ni login). Recomendado: Astro o HTML/CSS/JS sin framework. Debe poder alojarse gratis (ej. Cloudflare Pages) o en el VPS.
3. Antes de programar, entrega un plan breve (estructura de carpetas, componentes, cómo se agregan nuevos usos) y **espera confirmación**.
4. Trabaja por etapas (sección 10) y espera confirmación al terminar cada una.
5. No agregues funciones fuera de este documento. No uses personajes, logos ni nombres de marcas registradas (anime, videojuegos, etc.); todo el arte debe ser **original o genérico**.

---

## 1. Objetivo

Cada llavero se vende con el chip grabado con la URL de esta página. Al acercarlo al celular, el cliente llega a un instructivo divertido que:

1. Le explica qué es su llavero NFC.
2. Le enseña a revisar si su celular tiene NFC.
3. Le da la app para reprogramarlo (**NFC Tools**).
4. Le muestra **ideas de uso con tutoriales paso a paso**.
5. Le recuerda cómo volver a la página y cómo pedir más llaveros.

Público: "chavorucos" (adultos de 25–45 nostálgicos de los 90s/2000s), fans de videojuegos y anime, papás (llavero para mochila), dueños de mascotas.

---

## 2. Estilo visual: "chavoruco retro-gamer"

Nostalgia de los 90s y 2000s **sin usar marcas registradas**.

### 2.1 Elementos
- **Estética pixel art / 8-bit** en encabezados, íconos y botones.
- Paleta inspirada en **pantallas de consolas portátiles antiguas** (4 tonos de verde) como tema principal, con un **modo "noche arcade"** (fondo oscuro con neón).
- Efecto opcional de **líneas de TV antigua (scanlines)** muy sutil en el encabezado.
- **Barra de "vida" con corazones pixel** que se llena conforme el usuario completa tutoriales.
- **Ventanas estilo sistema operativo de los 90s** (barra de título con botones de minimizar/cerrar) para las tarjetas de cada uso.
- **Botón principal estilo "PRESIONA START"** parpadeante.
- Mensajes emergentes estilo **"¡LOGRO DESBLOQUEADO!"** al terminar un tutorial.
- Íconos pixel originales: llave, corazón, espada genérica, poción, cofre, huella de mascota, mochila, casete, joystick.

### 2.2 Tono de los textos (español mexicano, chavoruco)
Ejemplos de copy para usar o adaptar:
- Hero: **"¡Nuevo objeto obtenido: Llavero NFC!"**
- "Antes soplabas el cartucho. Ahora solo lo acercas."
- "Este llavero no necesita pilas, ni cargador, ni que le reces."
- "Nivel 1: revisa que tu cel tenga NFC."
- "Guardar partida: graba `{{DOMINIO}}` en tu llavero para volver aquí."
- Pie de página: "Hecho con nostalgia en Monterrey · Presiona START para pedir el tuyo."

### 2.3 Tipografía y accesibilidad
- Fuente pixel **solo en títulos y botones** (ej. "Press Start 2P" o "Silkscreen" de Google Fonts).
- Texto de lectura en una fuente legible (ej. "Space Grotesk" o "Inter"), tamaño mínimo 16 px.
- Contraste WCAG AA; los efectos (scanlines, parpadeo) deben respetar `prefers-reduced-motion`.
- **Sonidos 8-bit** generados con Web Audio (sin archivos con derechos), **apagados por defecto**, con botón de silencio visible.

### 2.4 Easter eggs (opcional, etapa final)
- Código secreto de flechas (↑↑↓↓←→←→BA) o 5 toques al logo → lluvia de corazones pixel.
- Contador "Llaveros activados" en el pie (ver sección 7).

---

## 3. Estructura de la página

Una sola página (`/`) con secciones, más una página por uso (`/usos/{slug}`) para que cada tutorial se pueda compartir.

1. **Hero:** "¡Nuevo objeto obtenido!", ilustración pixel del llavero, botón **PRESIONA START** (baja a la sección 2).
2. **Nivel 1 — ¿Tu cel tiene NFC?**
   - Android: Ajustes → Conexiones / Dispositivos conectados → NFC (activar).
   - iPhone: modelos XS o más nuevos lo leen solos; no hay que activar nada.
   - Si no tiene NFC: "Tranquilo, escanea el QR de atrás de tu llavero."
3. **Nivel 2 — Descarga tu herramienta:** botones a **NFC Tools** en Google Play y App Store (enlaces oficiales).
4. **Nivel 3 — Elige tu poder (usos):** cuadrícula de tarjetas (sección 4). Cada tarjeta abre su tutorial.
5. **Consejos de sabio:** advertencias (sección 5).
6. **Guardar partida:** cómo volver a esta página.
7. **¿Quieres más?:** botón a WhatsApp `{{WHATSAPP}}` con mensaje prellenado ("Hola, vi el instructivo de mi llavero y quiero..."), mención de diseños personalizados y para eventos.
8. **Pie:** marca, redes, créditos.

---

## 4. Usos (tarjetas + tutorial)

Los usos deben definirse en **un archivo de datos** (JSON/YAML/MD) para agregar nuevos sin tocar código. Cada uso tiene: `slug`, `titulo`, `icono`, `descripcion_corta`, `compatibilidad` (android/iphone), `pasos[]`, `consejo`.

**Pasos base en NFC Tools (común a casi todos):**
1. Abre NFC Tools → pestaña **Escribir**.
2. Toca **Agregar un registro** y elige el tipo (URL, Wi-Fi, Contacto, Texto…).
3. Llena los datos → regresa → toca **Escribir** y acerca el llavero a la parte trasera del celular.

| Slug | Uso | Tipo de registro | Notas |
|---|---|---|---|
| `wifi` | Wi-Fi de tu casa | Wi-Fi | Funciona mejor en **Android**; en iPhone puede no conectar automático |
| `contacto` | Tu tarjeta de contacto | Contacto | Ideal para networking |
| `whatsapp` | Tu WhatsApp | URL `https://wa.me/52XXXXXXXXXX` | |
| `redes` | Tu Instagram / TikTok | URL | |
| `ubicacion` | Cómo llegar a tu casa o negocio | URL de Google Maps | |
| `mascota` | Placa de tu mascota | Texto o URL | Nombre de la mascota + teléfono del dueño |
| `mochila` | Mochila de niño | Texto o Contacto | Solo nombre y **teléfono de papá/mamá**; aviso: **no poner dirección** |
| `emergencia` | Datos de emergencia | Texto | Contacto de emergencia; el usuario decide qué datos pone |
| `playlist` | Tu playlist favorita | URL | |
| `automatizacion` | Modo chavoruco: rutinas | Atajos (iPhone) / app de automatización (Android) | Ej. "al tocar el llavero: modo no molestar + alarma". iPhone: Atajos → Automatización → NFC |
| `volver` | Regresar a este instructivo | URL `https://{{DOMINIO}}` | Siempre visible como "Guardar partida" |

Cada tutorial:
- Lista de pasos numerados con capturas o ilustraciones simples (placeholders en v1).
- Al llegar al último paso, botón **"¡Lo logré!"** → mensaje "LOGRO DESBLOQUEADO" + se llena un corazón de la barra de vida (guardar progreso en `localStorage`, con `try/catch`; la página debe funcionar sin él).

---

## 5. Consejos (sección de advertencias)

- **No bloquees el llavero** ("Bloquear etiqueta" es permanente; ya no se podrá cambiar).
- Si le pones **contraseña**, no la olvides: sin ella no se puede modificar.
- El chip no tiene batería; acércalo a la parte trasera del celular (1–4 cm).
- Evita dejarlo pegado a metal o a la tarjeta del metro/banco: puede interferir.
- Si reprogramas el chip, el **QR de atrás** sigue llevando a este instructivo.

---

## 6. Enlace del chip y del QR

- El chip se graba con `https://{{DOMINIO}}/?c=1` (o una ruta corta equivalente). El parámetro permite distinguir visitas desde el chip vs. desde el QR (`?q=1`).
- El QR trasero del llavero apunta a `https://{{DOMINIO}}/?q=1`.
- Mantener la URL **corta** (cabe en NTAG213, 144 bytes).

---

## 7. Métricas (opcional)

- Analítica sin cookies (ej. Cloudflare Web Analytics) para saber cuántas visitas vienen del chip y del QR, y qué tutoriales son los más vistos.
- Contador público "Llaveros activados" opcional (si se implementa, con un endpoint mínimo o una solución sin backend; si no, omitir en v1).

---

## 8. Integración con Tu Día

- La página "Reutiliza tu llavero" de Tu Día (spec de Invitación Llavero NFC, sección 13) enlazará a este sitio.
- Aquí **no** se menciona Tu Día salvo, opcionalmente, un enlace discreto en el pie: "¿Tienes boda o XV? Conoce Tu Día".

---

## 9. Requisitos técnicos

- Mobile-first (la gran mayoría llega desde el celular al acercar el llavero).
- Carga rápida: < 1 s en 4G; imágenes en SVG o WebP; sin librerías pesadas.
- Funciona sin JavaScript para el contenido principal (los efectos son mejora progresiva).
- `lang="es-MX"`, metadatos para compartir (Open Graph) con imagen pixel del llavero.
- Configuración centralizada: `{{MARCA}}`, `{{DOMINIO}}`, `{{WHATSAPP}}`, colores y textos principales.

---

## 10. Etapas

1. **Base:** estructura, estilo retro (paleta, tipografías, componentes: ventana 90s, botón START, barra de corazones), secciones 1–3 y 5–8.
2. **Usos:** archivo de datos, cuadrícula de tarjetas, página de tutorial por uso, "¡Lo logré!" + logros.
3. **Extras:** modo noche arcade, sonidos opcionales, easter egg, analítica.

---

## 11. Criterios de aceptación

- Al acercar un llavero grabado con la URL, la página abre y se entiende en menos de 10 segundos qué hacer.
- Un usuario sin experiencia puede grabar su Wi-Fi o su WhatsApp siguiendo solo el tutorial.
- Se ve bien en celulares Android económicos y en iPhone; sin scroll horizontal.
- Agregar un nuevo uso requiere solo editar el archivo de datos.
- No aparece ningún personaje, logo o nombre de marca registrada de terceros.
