# Prompts para explorar el logo de LlaveCorp con IA de imágenes

El logo actual (`public/logo/llavecorp.svg`) es una cápsula horizontal con una llave pixel a la izquierda y barras de señal a la derecha, con la palabra LLAVECORP en fuente pixel debajo. Estos prompts sirven para pedirle a una IA (Midjourney, DALL·E, Ideogram, Leonardo, Stable Diffusion, Gemini) variantes del mismo concepto. Genera varias, elige la que más te guste y luego se vectoriza a mano para que sea imprimible.

## Reglas que el resultado debe cumplir (para que sirva de llavero)

- Formas planas y gruesas, sin degradados, sin sombras suaves, sin brillos realistas.
- Máximo tres colores planos más el fondo: índigo casi negro (#1a1433), crema (#fffaea) y magenta (#ff2e88). Opcional: cian (#19c3d6) o amarillo (#ffd23f) como cuarto.
- Ninguna línea más delgada que 1/20 del ancho total (a 45 mm de llavero, 2 mm).
- Silueta simple y cerrada: cápsula, círculo o escudo. Nada que sobresalga y se rompa.
- Sin texto pequeño dentro del emblema. La palabra va aparte.
- Original: no debe parecerse al logo de ninguna corporación de cápsulas de anime ni a marcas de videojuegos. El guiño es la idea de cápsula, no el diseño.

## Prompt principal (inglés, funciona mejor en la mayoría de generadores)

```
Flat vector logo emblem for "LlaveCorp", a small Mexican brand of 3D-printed keychains with NFC chips.
Concept: a horizontal pill-shaped capsule split in two halves; the left half is deep indigo (#1a1433)
with a chunky pixel-art key in cream (#fffaea); the right half is hot magenta (#ff2e88) with three
cream signal bars of increasing height, like a wireless tap icon. Retro 8-bit / 90s videogame feel
mixed with 90s TV anime energy. Bold, thick shapes only, no thin lines, no gradients, no shadows,
no text inside the emblem, no outline strokes, clean flat colors, high contrast, centered on a
plain cream background (#fbf4dc). Suitable for 3D printing as a keychain: every shape solid and at
least 2 mm wide at 45 mm total width. Original design, not based on any existing logo.
--no gradient, shadow, glow, realistic, 3d render, text, watermark, thin lines
```

## Variantes para pedir después

Pega el prompt principal y cambia solo la frase del concepto:

- **Cápsula vertical:** "a vertical capsule like a gashapon prize, top half magenta, bottom half cream, with a pixel key silhouette across the seam".
- **Escudo arcade:** "a rounded square badge like an arcade cabinet marquee, indigo background, cream pixel key in the center, magenta corner accent".
- **Llave-cápsula:** "a pixel-art key whose head is a capsule split diagonally in indigo and magenta, cream key shaft with two teeth".
- **Mascota:** "a chibi mascot: a pixel-art key with a round cream face, small black eyes, pink cheeks and a magenta scarf, waving, flat colors, no outlines" (para comparar con Llavi).

## Prompt para la palabra (si quieres probar tipografías)

```
Wordmark "LLAVECORP" in a chunky pixel / 8-bit bitmap typeface, all caps, single color deep indigo
(#1a1433) on plain cream background, flat vector, no effects, no gradients, evenly spaced letters,
wide and readable at small sizes. Optional tiny magenta pixel accent on one letter.
--no gradient, shadow, glow, 3d, outline
```

## Prompt en español (para generadores que responden mejor en español, como Gemini)

```
Logo vectorial plano para "LlaveCorp", marca mexicana de llaveros impresos en 3D con chip NFC.
Emblema: una cápsula horizontal partida en dos mitades; la izquierda en índigo oscuro (#1a1433)
con una llave pixel gruesa en crema (#fffaea); la derecha en magenta (#ff2e88) con tres barras
crema de altura creciente, como ícono de señal inalámbrica. Estilo retro de videojuego de 8 bits
con energía de anime de los 90. Solo formas gruesas y sólidas, sin líneas delgadas, sin degradados,
sin sombras, sin texto dentro del emblema, sin contornos, colores planos, alto contraste, centrado
sobre fondo crema liso (#fbf4dc). Debe poder imprimirse en 3D como llavero de 45 mm: ninguna forma
menor a 2 mm. Diseño original, no basado en ningún logo existente.
```

## Cómo pasar la imagen elegida al sitio y a la impresora

1. Pide la versión final en PNG grande (2000 px o más) con fondo liso.
2. Vectorízala: en Illustrator (Image Trace, modo 3 o 4 colores), Inkscape (Trazar mapa de bits, por colores) o un vectorizador en línea. Corrige a mano los bordes para que queden rectos.
3. Guarda como SVG con un grupo por color, igual que `public/logo/llavecorp-capas.svg` (capa-fondo, capa-acento, capa-relieve).
4. Sustituye `public/logo/llavecorp.svg` (web) y regenera la imagen de redes con `npm run og`.
5. El componente `Logo.astro` cambia los colores fijos por variables del tema; si usas otros hexadecimales, actualiza ahí las tres sustituciones.
