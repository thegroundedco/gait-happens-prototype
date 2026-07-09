import { defineConfig } from 'astro/config';

// `/_status` is the internal, unlinked build-progress page. Astro's
// file-based router silently drops any path segment starting with `_`
// while walking src/pages (see astro/dist/core/routing/create-manifest.js),
// so a literal src/pages/_status.astro would build to nothing. The
// component instead lives at src/internal/status.astro and is wired to the
// `/_status` URL explicitly here — injectRoute is unaffected by that
// exclusion since it never walks src/pages.
function internalStatusRoute() {
  return {
    name: 'internal-status-route',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        injectRoute({
          pattern: '/_status',
          entrypoint: './src/internal/status.astro',
          prerender: true,
        });
      },
    },
  };
}

export default defineConfig({
  site: 'https://gaithappens.com',
  // Astro View Transitions are enabled per-page via the <ClientRouter /> in BaseLayout.
  integrations: [internalStatusRoute()],
});
