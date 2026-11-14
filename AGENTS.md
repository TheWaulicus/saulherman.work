# Portfolio Redesign (Astro + Cloudflare)

STOP. This project uses Astro 7 and Cloudflare Workers. Always check `src/content.config.ts` for content schemas and `wrangler.jsonc` for deployment config.

## Architecture

- **Astro 7**: SSG mode (`output: 'static'`, `trailingSlash: 'always'`).
- **Content Collections**: Located in `src/content/`. Use `getCollection` to fetch data.
- **Client JS**: Pure Astro plus vanilla JS and Web Components. There is no React runtime.
- **Cloudflare Workers Static Assets**: Serves `dist/`. Headers live in `public/_headers`. Asset handling lives in `wrangler.jsonc` (`html_handling: auto-trailing-slash`, `not_found_handling: 404-page`).
- **Assets**: CSS and JS emit as external `/_astro/*` files with no `@` or brackets in names, so `style-src` needs no `'unsafe-inline'`.

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

## Modern Web Guidance

Before you change HTML, CSS, or client JS, search the guidance and retrieve the matching entry:

```sh
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@latest search "<query>"
DISABLE_TELEMETRY=1 npx -y modern-web-guidance@latest retrieve "<id>"
```

**Browser Support:** Target Baseline Newly available (`"baseline": "newly"` in `.mwgrc`). Origin Trial features are allowed (`allowOriginTrials: true`) only behind explicit feature detection, for example `'modelContext' in document`, with zero impact on browsers that lack support. Build Limited-availability features as pure HTML/CSS progressive enhancement. Do not add runtime npm dependencies for them.
