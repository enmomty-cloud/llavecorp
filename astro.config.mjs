import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://llavecorp.com',
  output: 'static',
  integrations: [sitemap()],
  // Scripts y estilos siempre como archivos externos: así la CSP de deploy/nginx.conf
  // solo necesita permitir 'self' más el hash del script inline del tema.
  build: { inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },
});
