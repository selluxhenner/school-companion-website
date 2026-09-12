# School Companion — Marketing Website

One-page static marketing site for the School Companion app (iOS + Android), built with
Next.js (App Router, static export), TypeScript, and Tailwind CSS.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site written to /out — deploy that folder anywhere
npm run preview    # serve /out locally to check the production build
```

## Fill in the placeholders

Everything you must edit is marked `TODO`. Find them all with a project-wide search
for `TODO`. The important ones:

| What | Where |
| --- | --- |
| `SITE_URL` (production domain) | [src/lib/site.ts](src/lib/site.ts) |
| `APP_ONE_LINER`, `APP_DESCRIPTION` | [src/lib/site.ts](src/lib/site.ts) |
| `APP_STORE_URL`, `PLAY_STORE_URL` | [src/lib/site.ts](src/lib/site.ts) |
| `CONTACT_EMAIL` | [src/lib/site.ts](src/lib/site.ts) |
| `FEATURES[]` (titles + one-liners) | [src/lib/site.ts](src/lib/site.ts) |
| `BRAND_COLORS` | [src/app/globals.css](src/app/globals.css) (`@theme` block) |
| Logo (swap inline SVG for `/logo.svg`) | [src/components/Logo.tsx](src/components/Logo.tsx) |
| Privacy policy wording + date | [src/app/privacy/page.tsx](src/app/privacy/page.tsx) |
| Terms wording | [src/app/terms/page.tsx](src/app/terms/page.tsx) |
| `aggregateRating` (once you have reviews) | [src/app/page.tsx](src/app/page.tsx) |

`SITE_URL` feeds the canonical URLs, Open Graph tags, `sitemap.xml`, and `robots.txt` —
set it before deploying.

## Screenshots

Screenshots live in `public/screenshots/` as raw device captures (no frame — the site
adds a CSS phone frame). To change them:

1. Drop the image in `public/screenshots/` (portrait, ~738×1600 works best; keep files
   under ~150 KB since the static export serves them as-is).
2. Register it in `SCREENSHOTS` in [src/lib/site.ts](src/lib/site.ts) with a descriptive
   `alt` text and a one-line caption.

The hero uses `public/screenshots/overview.jpeg` directly
([src/components/Hero.tsx](src/components/Hero.tsx)). A spare splash-screen shot lives at
`public/screenshots/splash.jpeg` if you'd rather use that.

## Store badges

Official assets in `public/badges/`:

- `app-store-badge.svg` — Apple "Download on the App Store" (from Apple's marketing tools)
- `google-play-badge.png` — Google "Get it on Google Play" (official generic web badge;
  it ships with built-in clear space, which is why it renders slightly larger in
  [src/components/StoreBadges.tsx](src/components/StoreBadges.tsx))

Don't recolor, crop, or reshape them.

## Social share image

`public/og.png` (1200×630) is referenced by the Open Graph/Twitter tags. Regenerate or
replace it if the branding changes.

## Deploy

`npm run build` produces a fully static site in `/out` — every page is pre-rendered HTML.
The site is self-hosted: upload the `/out` folder to the nginx server that serves
schoolcompanion.ch. No hosting platform is connected to this repo.

After deploying, verify SEO output: `curl https://<your-domain>/` should show the H1,
meta description, canonical link, and JSON-LD in the raw HTML.
