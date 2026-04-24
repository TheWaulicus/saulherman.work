# Design Spec: Portfolio Redesign (Product Engineer)

**Date:** 2026-04-24
**Status:** Draft
**Topic:** Redesigning the personal portfolio into a "Product Engineer" showcase using Astro and Modern Dark aesthetics.

## 1. Overview
Redesign the current Cloudflare-hosted portfolio to better balance the user's identity as a Senior Client Platform Engineer and an Entrepreneur (Founder of Extraction Lab).

### Success Criteria
- **Visual Impact:** A "Modern Dark" aesthetic that feels premium and high-tech.
- **Identity Balance:** Clear "Hybrid Hero" layout highlighting both 32k+ device fleet management and the Extraction Lab product.
- **Maintainability:** Transition from a single-file Worker script to an Astro + MDX architecture.
- **Performance:** Maintain near-instant load times using SSG.

## 2. Visual Design
### Style: Modern Dark
- **Backgrounds:** Deep charcoal (#0a0a0a) and surface colors (#111111).
- **Glassmorphism:** Navigation and feature cards use `backdrop-filter: blur()` with subtle 1px borders.
- **Typography:** 
  - Headings: Serif (e.g., DM Serif Display) for a premium, editorial feel.
  - Body/UI: Modern Sans-Serif (e.g., Inter or Geist) for clarity.
- **Accents:** High-contrast gold/amber (#e8d5a3) for primary actions and stats.

## 3. Layout & Content
### Hybrid Hero Section
- **Primary Messaging:** "Senior Client Platform Engineer & Founder".
- **Feature Cards (Side-by-Side):**
  - **Left Card (Extraction Lab):** Product-focused mockup with tags for AI, Swift, and UX.
  - **Right Card (Scale & Security):** Metric-focused card for the 32k+ device fleet and CIS L2 compliance.

### Experience Timeline (MDX)
- Vertical timeline using MDX to allow for rich formatting within role descriptions.
- Collapsible sections or "focus" states for deep dives into specific Atlassian achievements.

### Bento Toolkit
- A grid of blocks for skills, categorized by:
  - Platforms (Jamf, Okta, etc.)
  - Automation (Python, Bash, Pipelines)
  - Security/Compliance (CIS, SOC2)

## 4. Technical Architecture
### Tech Stack
- **Framework:** Astro (Static Site Generation).
- **Content:** MDX for resume data and project case studies.
- **UI Components:** React (surgically used for the interactive terminal and complex transitions).
- **Styling:** Vanilla CSS with CSS Variables for theme management.

### Deployment Workflow
- **Hosting:** Cloudflare Pages (or Workers with `assets` directory).
- **CI/CD:** Automated deployment via GitHub Action or Cloudflare's native git integration.

## 5. Implementation Strategy
1. **Phase 1: Environment Setup.** Initialize Astro project and migrate existing resume data to MDX.
2. **Phase 2: Core Components.** Build the "Modern Dark" design system and Bento grid components.
3. **Phase 3: Hybrid Hero.** Implement the featured project cards and hero section.
4. **Phase 4: Refinement.** Port the terminal widget to a React component and refine glassmorphic effects.
5. **Phase 5: Deployment.** Configure Cloudflare Pages/Workers for the new Astro build output.

## 6. Testing & Validation
- **Visual Regression:** Compare against the previous design to ensure all critical content is preserved.
- **Performance:** Lighthouse score of 95+ for Performance and SEO.
- **Responsiveness:** Validated on mobile (iOS/Android) and desktop breakpoints.
