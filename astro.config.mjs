// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

// Static SSG output: every page in src/pages/ becomes a static .html file in
// dist/ at build time. Vercel serves them directly — no Node runtime, no
// headless browser, no SSR functions needed.
//
// React integration lets .tsx components render server-side via
// react-dom/server and hydrate on the client per `client:*` directive.

export default defineConfig({
  site: 'https://www.tw-services.ch',
  output: 'static',
  // The AVV is maintained once, company-wide, on the parent-company site;
  // /avv forwards there instead of duplicating the contract here.
  redirects: {
    '/avv': { status: 301, destination: 'https://www.tw-p.ch/avv' },
    // The service pages were folded into the portal; old links and search results land on the film.
    '/services/premium-werbefilme': { status: 301, destination: '/portal' },
    '/services/visualisierungen': { status: 301, destination: '/portal' },
    '/services/time-to-sell': { status: 301, destination: '/portal' },
  },
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
  integrations: [
    react(),
    tailwind({
      // Tailwind base styles live in src/styles/global.css so we can layer
      // custom utilities; Astro's applyBaseStyles auto-inject is therefore off.
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) =>
        // /impressum, /datenschutz and /agb carry noindex; keep them out of the sitemap too.
        !page.includes('/impressum') &&
        !page.includes('/datenschutz') &&
        !page.includes('/agb'),
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
})
