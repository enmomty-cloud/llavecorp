import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// En producción el sitio vive en la raíz de llavecorp.com. GitHub Pages lo sirve bajo /llavecorp,
// así que el workflow pasa SITE_URL y BASE por variables de entorno (ver .github/workflows/pages.yml).
const site = process.env.SITE_URL ?? 'https://llavecorp.com';
const base = process.env.BASE ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  integrations: [sitemap()],
  // Scripts y estilos siempre como archivos externos: así la CSP de deploy/nginx.conf
  // solo necesita permitir 'self' más el hash del script inline del tema.
  build: { inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },
});
