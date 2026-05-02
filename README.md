# Astro Dev Template

[![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

> A free, design-token-driven Astro 6 starter for dark-mode dashboards, blogs, and product showcases. Ships with **Basecoat UI**, **Storybook**, **Svelte 5**, **Three.js accents**, and **Cloudflare Pages** deploy.

**[Live Demo](https://baselayer-pk4.pages.dev/)**

<!-- TODO: Replace with your own screenshot. Recommended: 1280x800, placed in public/screenshot.jpg -->
<!-- ![Screenshot](public/screenshot.jpg) -->

---

## One-Click Deploy

Deploy your own copy in under 2 minutes:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/baflow/baselayer)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/baflow/baselayer)

Or use the CLI:

```bash
# Clone
git clone https://github.com/baflow/baselayer.git my-site
cd my-site

# Install & dev
npm install
npm run dev
```

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | [Astro 6](https://astro.build) (static output) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI Kit | [Basecoat CSS](https://basecoat-css.com) |
| Components | [Svelte 5](https://svelte.dev) |
| Icons | Solar (linear) |
| Fonts | Inter + Newsreader (loaded via Astro Fonts) |
| 3D Accents | Three.js |
| Deployment | Cloudflare Pages (via Wrangler) |

---

## Features

- **Content Collections** with typed frontmatter for blog posts and projects
- **Design-token-driven** Tailwind theme mapped 1:1 from `DESIGN.md`
- **Basecoat UI** components (`btn`, `card`, `badge`, `tabs`, etc.) -- no React needed
- **Storybook** with Svelte CSF for isolated component development
- **Expressive Code** for beautiful fenced code blocks
- **RSS, Sitemap, Open Graph** out of the box
- **WebGL accents** via Three.js (optional, degrades gracefully)
- **Cloudflare-ready** with `wrangler.toml` included

---

## Project Structure

```text
├── public/               # Static assets
├── src/
│   ├── assets/           # Images processed by Astro
│   ├── components/       # Astro + Svelte UI components
│   │   └── ui/           # Reusable Svelte components (Storybook-ready)
│   ├── content/          # Markdown/MDX collections
│   ├── layouts/          # Page layouts
│   ├── pages/            # File-based routes
│   └── styles/           # Tailwind theme + Basecoat imports
├── .storybook/           # Storybook config
├── DESIGN.md             # Design system spec
├── astro.config.mjs
├── wrangler.toml
└── README.md
```

---

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run storybook` | Start Storybook at `localhost:6006` |
| `npm run build-storybook` | Build static Storybook |

---

## Before you publish your site

1. **Set your site URL** in `astro.config.mjs`:
   ```js
   site: 'https://your-domain.com',
   ```
2. **Update placeholders** in `src/consts.ts` (title, description, contact links).
3. **Replace the footer** text in `src/components/Footer.astro`.
4. **Add your own content** to `src/content/blog/` and `src/content/projects/`.
5. **Replace screenshot** -- add `public/screenshot.jpg` and uncomment it in this README.
6. **Configure Wrangler** (optional) in `wrangler.toml` and `.env`.
7. **Update repo URL** in the deploy buttons above.

---

## Design System

All design tokens live in `DESIGN.md` and are wired into `src/styles/global.css` under `@theme`.

| Token | Tailwind class |
|-------|---------------|
| Primary `#437652` | `text-primary`, `bg-primary` |
| Secondary `#8DA696` | `text-secondary`, `bg-secondary` |
| Neutral `#142418` | `text-neutral`, `bg-neutral` |
| Display 48px / lh 1 | `text-display-lg` |
| Body 15px / lh 1.625 | `text-body-md` |
| Surface shadow | `shadow-surface` |
| Inset depth | `shadow-inset-depth` |

> Rule: if a token from `DESIGN.md` is missing in Tailwind, extend `@theme` in `global.css`. Never use arbitrary values like `w-[123px]`.

---

## Contributing

Feature requests and PRs are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT -- free for personal and commercial use.
