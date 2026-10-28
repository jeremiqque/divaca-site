# Divaca website

The company website for Divaca, the parent brand of five products: Campus Update, Divaca Tech, Divaca Health, PlaySphere and Divaca Innovative Hub.

Built with Astro, Tailwind CSS v4 and React islands (Radix UI for the accordion and select), with Phosphor icons. Deployed on Vercel.

## Getting started

Requires Node 20 or newer and [pnpm](https://pnpm.io).

```
pnpm install
pnpm dev
```

The site runs at http://localhost:4321.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build the site into `dist/` |
| `pnpm preview` | Preview the production build |

## Forms

The updates, contact and partner forms post JSON to the endpoint in `PUBLIC_FORM_ENDPOINT`.

1. Create a form at [Formspree](https://formspree.io) (or any service that accepts JSON POSTs).
2. Copy `.env.example` to `.env` and paste the endpoint.
3. On Vercel, add the same variable under Project Settings > Environment Variables.

Without it, the forms show a "not connected" message instead of failing silently.

## Project structure

```
public/            Favicons, social preview image, fonts, robots.txt
src/
  components/
    site/          Page sections (hero, footer, product grid, bands)
    demos/         Interactive product demos (sample data only)
    ui/            Buttons, inputs, select
  layouts/         Base layout, meta tags, page transitions
  lib/
    products.ts    All product copy: taglines, features, steps, FAQs, facts
    site.ts        Site details and social links
  pages/           Routes: home, products, about, partners, contact, legal
  scripts/         Motion system and the hero background
  styles/          Global CSS, design tokens and animations
```

## Editing content

- **Product copy** lives in `src/lib/products.ts`. Edit it there and the home page, product pages and cards all update.
- **Social links** go in `src/lib/site.ts`. Icons stay greyed out until a URL is filled in.
- **Home page FAQ** is the `faqs` list at the top of `src/pages/index.astro`.

## Design notes

- Colours: DarkMouth Green `#105E34`, Forest `#228B22`, Pistachio `#8ED06C`, Light Green `#DEF1D6`.
- Typeface: Galano Grotesque (files in `public/fonts`).
- Corners are 4px. Cards are static; interaction lives inside components.
- Motion respects `prefers-reduced-motion`, and pointer effects only run on devices with a fine pointer.
- No placeholder statistics or testimonials. Everything on the site must be true.
