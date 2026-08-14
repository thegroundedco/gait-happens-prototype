import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

// Rewrites root-absolute URLs in a built site so it can be served from a
// sub-path (GitHub project Pages: /<repo>/). Astro's `--base` only rewrites
// the links it generates itself — the several thousand hand-authored
// `/images/...` and `/collections/...` paths in src/ are opaque string
// literals to it and ship unchanged. Rather than refactor every component to
// `import.meta.env.BASE_URL` (which would churn the reference build the
// client's dev team reads), this runs after `astro build` and patches the
// output only. It is idempotent — re-running against an already-rewritten
// dist is a no-op.
//
//   node scripts/rewrite-base.mjs dist /gait-happens-prototype

const [dir = 'dist', rawBase = ''] = process.argv.slice(2);

// Normalize to a leading slash with no trailing slash, so every join below is
// `${BASE}/${path}` and never produces a doubled or missing separator.
const BASE = `/${rawBase.replace(/^\/+|\/+$/g, '')}`;
if (BASE === '/') {
  console.error('usage: node scripts/rewrite-base.mjs <dir> <base>');
  process.exit(1);
}

const MARKUP = new Set(['.html', '.css', '.xml', '.txt', '.json']);

// A path we should prefix: starts with a single `/`, and is not already based.
// The `//` guard is what keeps protocol-relative `//cdn.example.com` out;
// anything with a scheme (`https:`, `mailto:`, `tel:`, `data:`) never starts
// with `/` and so is excluded by construction.
const isRewritable = (p) =>
  p.startsWith('/') && !p.startsWith('//') && p !== BASE && !p.startsWith(`${BASE}/`);

const prefix = (p) => (p === '/' ? `${BASE}/` : `${BASE}${p}`);

function rewriteMarkup(source) {
  let n = 0;
  const bump = () => { n++; };

  const out = source
    // href/src/action/poster/content/data-*="/..."
    .replace(
      /\b(href|src|action|poster|content|data-href|data-src|data-image)="(\/[^"]*)"/g,
      (match, attr, path) => {
        if (!isRewritable(path)) return match;
        bump();
        return `${attr}="${prefix(path)}"`;
      },
    )
    // srcset="/a.png 1x, /b.png 2x" — comma-separated candidates, each a URL
    // plus an optional width/density descriptor.
    .replace(/\bsrcset="([^"]*)"/g, (match, value) => {
      if (!value.includes('/')) return match;
      const rewritten = value
        .split(',')
        .map((candidate) => {
          const trimmed = candidate.trim();
          if (!trimmed) return candidate;
          const [url, ...descriptor] = trimmed.split(/\s+/);
          if (!isRewritable(url)) return candidate;
          bump();
          return [prefix(url), ...descriptor].join(' ');
        })
        .join(', ');
      return `srcset="${rewritten}"`;
    })
    // CSS url(/...) — covers both .css files and inline <style> blocks.
    .replace(/url\((['"]?)(\/[^'")]*)\1\)/g, (match, quote, path) => {
      if (!isRewritable(path)) return match;
      bump();
      return `url(${quote}${prefix(path)}${quote})`;
    });

  return { out, n };
}

// Client scripts hold site paths as plain string literals (the PLP cards and
// quick-add modal build their markup at runtime), and a blind rewrite of every
// `"/..."` in JS would also hit regexes, API paths, and unrelated strings. So
// only literals whose first segment is an actual top-level entry of the build
// get prefixed — `/images/plp/walk.jpg` yes, `/^\d+$/` no.
function rewriteScript(source, topLevel) {
  let n = 0;
  const out = source.replace(/(["'`])(\/[A-Za-z0-9._-]+(?:\/[^"'`\n]*)?)\1/g, (match, quote, path) => {
    const segment = path.slice(1).split('/')[0];
    if (!topLevel.has(segment) || !isRewritable(path)) return match;
    n++;
    return `${quote}${prefix(path)}${quote}`;
  });
  return { out, n };
}

async function* walk(root) {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    // Skip build internals like dist/.prerender, which Astro removes itself
    // on a clean run and which never ship to the served site.
    if (entry.name.startsWith('.')) continue;
    const full = join(root, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

// Derived from the build rather than hardcoded, so a new top-level route or
// public/ folder is covered automatically instead of silently missed.
const topLevel = new Set(
  (await readdir(dir, { withFileTypes: true }))
    .filter((e) => !e.name.startsWith('.'))
    .map((e) => e.name),
);

let filesChanged = 0;
let refsChanged = 0;

for await (const file of walk(dir)) {
  const ext = extname(file).toLowerCase();
  const isScript = ext === '.js' || ext === '.mjs';
  if (!MARKUP.has(ext) && !isScript) continue;

  const source = await readFile(file, 'utf8');
  const { out, n } = isScript ? rewriteScript(source, topLevel) : rewriteMarkup(source);
  if (n === 0) continue;

  await writeFile(file, out);
  filesChanged++;
  refsChanged += n;
}

console.log(`rewrite-base: prefixed ${refsChanged} refs with ${BASE} across ${filesChanged} files.`);
