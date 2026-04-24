# Saul Herman - Portfolio Redesign

This is the redesigned portfolio built with Astro and React, deployed on Cloudflare Workers.

## Architecture

- **Framework**: [Astro 6](https://astro.build/) (Static Site Generation)
- **UI Components**: 
  - [React](https://reactjs.org/) for interactive elements (e.g., Terminal)
  - Astro Components for static layout and sections
- **Styling**: Vanilla CSS (Global and Component-level)
- **Content**: MDX with [Astro Content Layer](https://docs.astro.build/en/guides/content-collections/)
  - `src/content/experience/`: Career history
  - `src/content/projects/`: Project highlights

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

The project is configured for Cloudflare Workers using `wrangler.jsonc`.

```bash
# Deploy to Cloudflare
npm run deploy
```

Static assets are served from the `dist/` directory as configured in `wrangler.jsonc`:

```json
"assets": {
  "directory": "./dist"
}
```
