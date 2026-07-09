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
  }
});

test('getCollection / getItem work', () => {
  assert.ok(getCollection('/collections/all'));
  assert.equal(getCollection('/nope'), undefined);
});
