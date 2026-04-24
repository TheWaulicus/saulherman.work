# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the portfolio into a "Product Engineer" showcase using Astro, MDX, and a "Modern Dark" aesthetic, balancing the user's identities as a Senior Client Platform Engineer and an Entrepreneur.

**Architecture:** A static site generated with Astro (SSG), using MDX for content management and React for interactive widgets (Terminal). Styled with Vanilla CSS and modern primitives.

**Tech Stack:** Astro, MDX, React, Tailwind CSS (optional, but using Vanilla CSS per design), Cloudflare Pages.

---

### Task 1: Environment & Astro Initialization

**Files:**
- Create: `astro.config.mjs`
- Create: `src/pages/index.astro`
- Modify: `package.json`
- Modify: `wrangler.jsonc`

- [ ] **Step 1: Install Astro and dependencies**
Run: `npm install astro @astrojs/mdx @astrojs/react react react-dom`

- [ ] **Step 2: Initialize Astro configuration**
Create `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [mdx(), react()],
  output: 'static',
  adapter: null // Using Cloudflare Pages native support
});
```

- [ ] **Step 3: Update package.json scripts**
Add `"build": "astro build"`, `"preview": "astro preview"`, and update `"dev": "astro dev"`.

- [ ] **Step 4: Create a basic index.astro**
```astro
---
---
<html lang="en">
  <head>
    <title>Saul Herman | Product Engineer</title>
  </head>
  <body style="background: #0a0a0a; color: white;">
    <h1>Building...</h1>
  </body>
</html>
```

- [ ] **Step 5: Verify dev server**
Run: `npm run dev` and check for "Building...".

- [ ] **Step 6: Commit**
```bash
git add astro.config.mjs src/pages/index.astro package.json package-lock.json
git commit -m "chore: initialize astro project with mdx and react"
```

---

### Task 2: Content Migration to MDX

**Files:**
- Create: `src/content/experience/atlassian-senior.mdx`
- Create: `src/content/experience/atlassian-cpe.mdx`
- Create: `src/content/projects/extraction-lab.mdx`
- Create: `src/content/config.ts`

- [ ] **Step 1: Define content collections**
Create `src/content/config.ts` to define schemas for Experience and Projects.

- [ ] **Step 2: Migrate Experience data**
Extract details from `saul_herman_resume.md` into individual MDX files in `src/content/experience/`.

- [ ] **Step 3: Migrate Project data**
Create `src/content/projects/extraction-lab.mdx` with rich descriptions.

- [ ] **Step 4: Commit**
```bash
git add src/content/
git commit -m "feat: migrate resume and project content to mdx"
```

---

### Task 3: "Modern Dark" Design System

**Files:**
- Create: `src/styles/global.css`
- Create: `src/components/ThemeHandler.astro`

- [ ] **Step 1: Define CSS Variables**
In `src/styles/global.css`, define the charcoal palette, glassmorphism utilities, and typography.
```css
:root {
  --bg: #0a0a0a;
  --surface: #111111;
  --accent: #e8d5a3;
  --text: #f0ede8;
  --glass: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.1);
}
```

- [ ] **Step 2: Configure Fonts**
Import DM Serif Display and Inter/Geist.

- [ ] **Step 3: Commit**
```bash
git add src/styles/global.css
git commit -m "style: implement modern dark design system"
```

---

### Task 4: Hybrid Hero & Featured Cards

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/FeatureCard.astro`

- [ ] **Step 1: Build the Hero component**
Implement the "Senior Client Platform Engineer & Founder" messaging.

- [ ] **Step 2: Build the Glassmorphic FeatureCard**
Create a reusable card with `backdrop-filter: blur(10px)`.

- [ ] **Step 3: Layout side-by-side cards**
Place Extraction Lab (Product focus) and Atlassian Fleet (Scale focus) in the Hero.

- [ ] **Step 4: Commit**
```bash
git add src/components/Hero.astro src/components/FeatureCard.astro
git commit -m "feat: implement hybrid hero and featured cards"
```

---

### Task 5: MDX Experience & Bento Toolkit

**Files:**
- Create: `src/components/ExperienceTimeline.astro`
- Create: `src/components/BentoToolkit.astro`

- [ ] **Step 1: Build the MDX Timeline**
Query the experience collection and render MDX content.

- [ ] **Step 2: Build the Bento Grid**
Create a modular grid for skills (Platforms, Automation, Security).

- [ ] **Step 3: Commit**
```bash
git add src/components/ExperienceTimeline.astro src/components/BentoToolkit.astro
git commit -m "feat: implement experience timeline and bento toolkit"
```

---

### Task 6: Interactive Terminal Component (React)

**Files:**
- Create: `src/components/Terminal.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Port terminal logic to React**
Rewrite the current JS terminal logic into a functional React component with proper state management.

- [ ] **Step 2: Integrate into the homepage**
Add `<Terminal client:load />` to a section or as a floating widget.

- [ ] **Step 3: Commit**
```bash
git add src/components/Terminal.tsx
git commit -m "feat: port interactive terminal to react"
```

---

### Task 7: Deployment Configuration

**Files:**
- Modify: `wrangler.jsonc`
- Create: `public/_redirects` (if needed)

- [ ] **Step 1: Configure static asset serving**
Ensure `wrangler.jsonc` points to `dist/` or `public/` correctly for the Astro build.

- [ ] **Step 2: Run final build and verify**
Run: `npm run build && npx wrangler pages dev dist` (or similar for preview).

- [ ] **Step 3: Commit**
```bash
git add wrangler.jsonc
git commit -m "chore: configure cloudflare deployment for astro"
```
