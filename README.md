# Gait Happens — Website (Astro reference build)

Static Astro reference site for Gait Happens. This project is a design/build
reference that a dev team will port into Shopify — it is not the production
storefront.

> Scaffolded in Task 1 of the web-foundation build. See
> `docs/superpowers/specs/2026-07-08-gait-happens-web-foundation-design.md`
> and `docs/superpowers/plans/2026-07-08-gait-happens-web-foundation.md` for
> the full spec and build plan. Fuller run/handoff notes land in a later task.

## Commands

All commands are run from the repo root:

| Command               | Action                                                        |
| :--------------------- | :------------------------------------------------------------ |
| `npm install`           | Installs dependencies                                          |
| `npm run dev`           | Starts the local dev server at `localhost:4321`                |
| `npm run build`         | Builds the production site to `./dist/`                        |
| `npm run preview`       | Serves the built `./dist/` locally, before deploying            |
| `npm run check:links`   | Builds nothing itself — starts `preview` and crawls it with [linkinator](https://github.com/JustinBeckwith/linkinator) to catch broken internal/external links |
| `npm test`              | Runs the Node test runner (`node --test`) against `**/*.test.mjs` |

## Stack

- [Astro](https://astro.build) — static site generation, `.astro` components
- [GSAP](https://gsap.com) — scroll reveals, hero timelines, micro-interactions
- Astro View Transitions (`<ClientRouter />`) for page-to-page transitions
