# Kit de redes LlaveCorp: textos, hashtags y cómo promocionar sin salir tú

Las imágenes de esta carpeta se generan con `node scripts/generar-redes.mjs` (si cambias precios, promo o logo, vuelve a correrlo). Todas usan el mismo estilo del sitio y ninguna necesita foto tuya.

| Archivo | Para qué |
|---|---|
| `perfil-1080x1080.png` | Foto de perfil de Instagram y Facebook (se recorta en círculo, el emblema cabe). |
| `portada-facebook-820x312.png` | Portada de la página de Facebook. |
| `promo-1080x1080.png` | Post de Instagram y Facebook: promoción de lanzamiento. Fíjalo arriba. |
| `promo-historia-1080x1920.png` | Historia de Instagram y Facebook. Guárdala en destacados como "Promo". |
| `cartuchos-1080x1080.png` | Post de producto: cartuchos 8 y 16 bits. |
| `nfc-1080x1080.png` | Post explicando qué es el poder NFC. |
| `promo-facebook-1200x630.png` | Post horizontal para Facebook y para compartir el enlace en grupos. |

## Bio de Instagram

```
LlaveCorp · Llaveros con poder
Impresos en 3D en Monterrey. Con chip NFC: tocas y pasa algo.
Pide por WhatsApp desde la página ⬇
Promo de lanzamiento: 5° pedido llavero con tu nombre gratis
```
Link en la bio: `https://enmomty-cloud.github.io/llavecorp/` (cuando tengas dominio, `https://llavecorp.com`).

## Descripción de la página de Facebook

```
Llaveros impresos en 3D con chip NFC, estilo retro y anime, hechos en Monterrey. Acércalo al celular y abre tu Wi-Fi, tu WhatsApp o la placa de tu mascota. Pedidos por WhatsApp desde nuestra página. Promoción de lanzamiento: en tu quinto pedido te regalamos un llavero con tu nombre y en el décimo abres la cápsula sorpresa.
```

## Textos para cada post (copia y pega)

**promo-1080x1080 / promo-historia / promo-facebook**
```
Promo de lanzamiento de LlaveCorp 🕹️
Cada pedido desde la página suma un sello:
• Sello 5: llavero con tu nombre GRATIS
• Sello 10: abres la cápsula y te llevas un modelo al azar
Cuentan solo los pedidos por WhatsApp desde la página (link en la bio). Para canjear, muéstranos una captura de que nos sigues aquí y en Facebook.
Promoción de introducción, puede terminar sin previo aviso.
#llaveros #monterrey #impresion3d #retro #anime #nfc #chavorucos #hechoenmexico
```

**cartuchos-1080x1080**
```
Llegaron los cartuchos 🎮 8 bits y 16 bits, impresos en 3D, con tu nombre o tu juego favorito en la etiqueta. Con chip NFC si quieres que además abra tu WhatsApp o tu Wi-Fi.
Desde $75. Pide por WhatsApp desde la página (link en la bio).
#llaveros #cartucho #retrogaming #monterrey #impresion3d #pixelart
```

**nfc-1080x1080**
```
¿Qué es un llavero con poder NFC? Lo acercas al celular y pasa algo: se conecta al Wi-Fi de tu casa, abre tu WhatsApp, tus redes, tu playlist o la placa de tu mascota. Sin pilas, sin app rara. Tú lo programas desde tu cel las veces que quieras y te enseñamos paso a paso.
Instructivo completo en la página (link en la bio).
#nfc #llaveros #tecnologia #monterrey #impresion3d
```

## Cómo promocionar sin salir tú

**Cuentas.** Crea cuenta de Instagram como cuenta de empresa (Configuración, tipo de cuenta) y una página de Facebook, las dos con el nombre LlaveCorp, la misma foto de perfil y el mismo link. Instagram permite un botón de WhatsApp en el perfil: actívalo con tu número. Vincula las dos cuentas para publicar una vez y que salga en ambas.

**Qué mostrar en lugar de tu cara.** Todo lo que se ve bien sin persona:
- La impresora trabajando: timelapse de un llavero de principio a fin (la mayoría de las impresoras o el celular con modo timelapse lo hacen solo). Es el contenido que más se comparte de impresión 3D.
- Manos y producto: sacar el llavero de la cama de impresión, quitar soportes, ponerle la argolla, acercarlo al celular y que se abra el Wi-Fi. Solo se ven manos.
- "Antes y después": el archivo en pantalla y el llavero impreso.
- Pedidos empaquetados con el nombre del cliente tapado.
- La mascota Llavi y los posts de esta carpeta para anuncios de promo y precios.
- Encuestas en historias: "¿cuál imprimo mañana: onigiri o máscara oni?". Genera respuestas sin mostrarte.

**Ritmo.** Tres publicaciones por semana es suficiente al inicio: un producto, un video del proceso, una promo o encuesta. Las historias diarias cuestan poco: un llavero saliendo de la impresora ya es una historia.

**Formatos que Instagram empuja.** Los reels de 7 a 15 segundos con el timelapse y un texto encima ("de rollo a llavero en 40 minutos") llegan a gente que no te sigue. Usa audio de tendencia que sea libre para cuentas de empresa.

**Local.** Etiqueta la ubicación (Monterrey y la colonia del tianguis) en cada post. Únete a grupos de Facebook de compra-venta y de anime o retro de Monterrey y comparte el post horizontal con el enlace; muchos grupos permiten venta los fines de semana. En Marketplace de Facebook puedes subir cada diseño como artículo con el enlace a la página.

**En el puesto.** Un letrero con el QR de la página y "síguenos para la promo". El llavero LlaveCorp con chip que traes en tus llaves es tu tarjeta de presentación: lo acercas al celular de quien pregunte.

**El canje.** El cliente te manda por WhatsApp dos capturas: siguiendo a LlaveCorp en Instagram y en Facebook. Tú llevas la cuenta de pedidos por número de WhatsApp (una nota en el chat o una hoja de cálculo con número, fecha y sellos). En el quinto pedido te dice el nombre para el llavero gratis; en el décimo eliges tú el modelo al azar y se lo mandas en su cápsula.

**Cuando quieras terminar la promo.** En `src/config/marca.json` pon `"activa": false` dentro de `promocion`, sube el cambio, y la sección desaparece del sitio. Avisa en redes con una semana de anticipación para que la gente que va en el sello 4 no se moleste.
