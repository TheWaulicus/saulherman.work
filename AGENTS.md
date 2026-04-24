# Portfolio Redesign (Astro + Cloudflare)

STOP. This project uses Astro 6 and Cloudflare Workers. Always check `src/content.config.ts` for content schemas and `wrangler.jsonc` for deployment config.

## Architecture

- **Astro 6**: SSG mode.
- **Content Collections**: Located in `src/content/`. Use `getCollection` to fetch data.
- **React**: Used for interactive components (client-side hydration).
- **Cloudflare Workers**: Serves static assets from `dist/`.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local development with Astro |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build |
| `npx wrangler deploy` | Deploy `dist/` to Cloudflare |

## Content Management

Experience and Projects are managed via MDX files in `src/content/`. 
Updating content requires updating the MDX files and potentially the schemas in `src/content.config.ts`.

## Deployment

Configuration is in `wrangler.jsonc`. Static assets are served via the `assets` binding.
