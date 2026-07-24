# Hunter × Hunter — Fan Site

A dynamic, animated fan tribute to Yoshihiro Togashi's *Hunter × Hunter*, built with **Astro.js + HTML + CSS + vanilla JS**.

## Pages

- **Home** — animated aura hero, an interactive Hunter License (3D tilt + shine), the six story arcs, count-up stats.
- **Characters** — 10 dossiers (Gon, Killua, Kurapika, Leorio, Hisoka, Kite, Chrollo, Netero, Ging, Tonpa) with Nen-type filtering and animated stat modals.
- **Nen** — the four principles with a live aura demo, the six-type hexagon chart from the anime (click for affinity %), and a water divination personality test with an animated glass.
- **World Map** — interactive SVG map of the known world, plus a zoom-out reveal of Lake Mobius and the Dark Continent with the Five Calamities.
- **Contact** — GitHub and LinkedIn for the site author.

## About the artwork

Character portraits on this site are anime stills used for an unofficial, non-commercial fan encyclopedia.
Hunter × Hunter and all related characters, artwork and trademarks are the property of their respective copyright holders.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview
```

## Deploy

Pushing to `main` triggers the **Deploy to GitHub Pages** workflow (`.github/workflows/deploy.yml`).
One-time setup: repository **Settings → Pages → Source → GitHub Actions**.
The site is served from `https://deformator852.github.io/hunter-x-hunter/`.
In CI, Astro builds with `base: /hunter-x-hunter`; locally the base stays `/` so root URLs keep working.
