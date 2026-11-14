import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://saulherman.work',
  trailingSlash: 'always',
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: {
    inlineStylesheets: 'never'
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: '_astro/[name].[hash][extname]',
          sanitizeFileName: (name) => name.replace(/[@[\]]/g, '_')
        }
      }
    }
  }
});
