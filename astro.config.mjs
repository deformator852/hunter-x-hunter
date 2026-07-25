import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// GitHub Pages serves the site from /hunter-x-hunter/; locally use root so
// http://localhost:4321/ works as before.
const isPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  site: 'https://deformator852.github.io',
  base: isPages ? '/hunter-x-hunter' : '/',
  integrations: [react()],
});