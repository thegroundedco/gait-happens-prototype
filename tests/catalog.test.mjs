import { test } from 'node:test';
import assert from 'node:assert/strict';
import { items, collections, getItem, getCollection } from '../src/data/catalog.js';
import { routes } from '../src/data/sitemap.js';

const routePaths = new Set(routes.map(r => r.path));

test('every item has required fields, unique id, and an href that resolves to a route', () => {
  const seen = new Set();
  for (const it of items) {
    assert.ok(it.id && !seen.has(it.id), `bad/dupe id: ${it.id}`); seen.add(it.id);
    assert.ok(it.title && it.kind && it.image && it.href, `missing fields: ${it.id}`);
    assert.ok(['product','course'].includes(it.kind), `bad kind: ${it.id}`);
    assert.ok(routePaths.has(it.href), `item href not a route: ${it.href}`);
  }
});

test('every collection key is a sitemap route and every itemId resolves', () => {
  for (const [path, col] of Object.entries(collections)) {
    assert.ok(routePaths.has(path), `collection path not a route: ${path}`);
    const ids = col.grouped ? col.grouped.flatMap(g => g.itemIds) : col.itemIds;
    for (const id of ids) assert.ok(getItem(id), `collection ${path} bad itemId: ${id}`);
    for (const id of col.crossSell.itemIds) assert.ok(getItem(id), `crossSell bad itemId: ${id}`);
    assert.ok(routePaths.has(col.crossSell.shopAllHref), `crossSell shopAllHref not a route: ${col.crossSell.shopAllHref}`);
  }
});

test('getCollection / getItem work', () => {
  assert.ok(getCollection('/collections/all'));
  assert.equal(getCollection('/nope'), undefined);
});

// Task 7: guards a half-populated PDP rollout — every product route the
// sitemap marks `built` must actually carry the `pdp` block ProductDetails/
// FourColumn/PdpReviews/CrossSell all read from, and that block's own
// cross-references (crossSell.itemIds, crossSell.shopAllHref) must resolve
// to real items/routes, same as the top-level assertions above.
test('every built product route has a pdp block whose crossSell resolves', () => {
  const builtProductPaths = new Set(
    routes.filter(r => r.status === 'built' && r.kind === 'pdp').map(r => r.path)
  );
  const productItems = items.filter(it => it.kind === 'product' && builtProductPaths.has(it.href));

  // Sanity check the filter itself actually found the rolled-out products —
  // an empty set here would make every assertion below vacuously pass.
  assert.ok(productItems.length >= 6, `expected >=6 built product items, found ${productItems.length}`);

  for (const it of productItems) {
    assert.ok(it.pdp, `built product missing pdp block: ${it.id}`);
    assert.ok(it.pdp.crossSell, `built product pdp missing crossSell: ${it.id}`);
    for (const id of it.pdp.crossSell.itemIds) {
      assert.ok(getItem(id), `${it.id} pdp.crossSell bad itemId: ${id}`);
    }
    assert.ok(
      routePaths.has(it.pdp.crossSell.shopAllHref),
      `${it.id} pdp.crossSell.shopAllHref not a route: ${it.pdp.crossSell.shopAllHref}`
    );
  }
});

// Chunk B1: the course counterpart of the built-product guard above. Every
// course route the sitemap marks `built` must carry the `pdp` block the
// course sections read, an ordered `sections` list for the composer, and a
// resolvable crossSell — otherwise the page silently renders empty sections
// (the composer's unknown/guarded-off types render nothing by design).
test('every built course route has a pdp block with sections and a resolving crossSell', () => {
  const builtCoursePaths = new Set(
    routes.filter(r => r.status === 'built' && r.kind === 'course').map(r => r.path)
  );
  const courseItems = items.filter(it => it.kind === 'course' && builtCoursePaths.has(it.href));

  // Sanity-check the filter — an empty set would make everything below pass vacuously.
  assert.ok(courseItems.length >= 4, `expected >=4 built course items, found ${courseItems.length}`);

  for (const it of courseItems) {
    assert.ok(it.pdp, `built course missing pdp block: ${it.id}`);
    assert.ok(Array.isArray(it.pdp.sections) && it.pdp.sections.length > 0,
      `built course missing pdp.sections: ${it.id}`);
    assert.ok(it.pdp.crossSell, `built course pdp missing crossSell: ${it.id}`);
    for (const id of it.pdp.crossSell.itemIds) {
      assert.ok(getItem(id), `${it.id} pdp.crossSell bad itemId: ${id}`);
    }
    assert.ok(
      routePaths.has(it.pdp.crossSell.shopAllHref),
      `${it.id} pdp.crossSell.shopAllHref not a route: ${it.pdp.crossSell.shopAllHref}`
    );
  }
});
