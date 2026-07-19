# Hunter × Hunter — Fan Site

A dynamic, animated fan tribute to Yoshihiro Togashi's *Hunter × Hunter*, built with **Astro.js + HTML + CSS + vanilla JS**.

## Pages

- **Home** — animated aura hero, an interactive Hunter License (3D tilt + shine), the six story arcs, count-up stats.
- **Characters** — 10 dossiers (Gon, Killua, Kurapika, Leorio, Hisoka, Kite, Chrollo, Netero, Ging, Tonpa) with Nen-type filtering and animated stat modals.
- **Nen** — the four principles with a live aura demo, the six-type hexagon chart from the anime (click for affinity %), and a water divination personality test with an animated glass.
- **World Map** — interactive SVG map of the known world, plus a zoom-out reveal of Lake Mobius and the Dark Continent with the Five Calamities.

## About the artwork

*Hunter × Hunter* imagery is copyrighted, so nothing is scraped from the internet and nothing is AI-generated. Every emblem, map, and illustration on the site is **original, hand-coded SVG** made in tribute to the series' style.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321/hunter-x-hunter/
npm run build    # static output in dist/
npm run preview
```

## Deploy

Pushing to `main` triggers the **Deploy to GitHub Pages** workflow (`.github/workflows/deploy.yml`).
One-time setup: repository **Settings → Pages → Source → GitHub Actions**.
The site is served from `https://deformator852.github.io/hunter-x-hunter/`.
