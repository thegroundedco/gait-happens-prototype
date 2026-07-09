import { test } from 'node:test';
import assert from 'node:assert/strict';
import { menus, accountMenu, routes, getRoute } from '../src/data/sitemap.js';

test('every route has required fields and unique path', () => {
  const seen = new Set();
  for (const r of routes) {
    assert.ok(r.path?.startsWith('/'), `bad path: ${r.path}`);
    assert.ok(r.title, `missing title: ${r.path}`);
    assert.ok(Array.isArray(r.breadcrumb) && r.breadcrumb.length, `missing breadcrumb: ${r.path}`);
    assert.ok(['placeholder', 'built'].includes(r.status), `bad status: ${r.path}`);
    assert.ok(!seen.has(r.path), `duplicate path: ${r.path}`);
    seen.add(r.path);
  }
});

test('every menu href resolves to a real route', () => {
  const paths = new Set(routes.map(r => r.path));
  const hrefs = [
    ...menus.filter(m => m.type === 'link').map(m => m.href),
    ...menus.flatMap(m => (m.cards ?? []).map(c => c.href)),
    ...accountMenu.map(a => a.href),
  ];
  for (const href of hrefs) assert.ok(paths.has(href), `menu href with no route: ${href}`);
});

test('getRoute returns a known route and undefined otherwise', () => {
  assert.equal(getRoute('/pages/about')?.title, 'About');
  assert.equal(getRoute('/nope'), undefined);
});
