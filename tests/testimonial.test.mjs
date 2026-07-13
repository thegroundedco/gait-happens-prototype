import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nextIndex } from '../src/scripts/testimonial.js';
import { items } from '../src/data/catalog.js';

test('nextIndex wraps forward past the end', () => {
  assert.equal(nextIndex(0, 3, 1), 1);
  assert.equal(nextIndex(2, 3, 1), 0);
});

test('nextIndex wraps backward past the start', () => {
  assert.equal(nextIndex(2, 3, -1), 1);
  assert.equal(nextIndex(0, 3, -1), 2);
});

test('nextIndex clamps to 0 when there is nothing to page between', () => {
  assert.equal(nextIndex(0, 1, 1), 0);
  assert.equal(nextIndex(0, 1, -1), 0);
  assert.equal(nextIndex(0, 0, 1), 0);
});

// Guards the Chunk B1 data migration: the catalog carries exactly ONE
// testimonial shape (an array), so the carousel has a single contract to
// code against and Tasks 2-5 can't reintroduce the old bare-object form.
test('every pdp.testimonial in the catalog is an array of well-formed testimonials', () => {
  for (const it of items) {
    const t = it.pdp?.testimonial;
    if (t === undefined) continue;
    assert.ok(Array.isArray(t), `${it.id}: pdp.testimonial must be an array`);
    assert.ok(t.length > 0, `${it.id}: pdp.testimonial must not be empty`);
    for (const entry of t) {
      assert.ok(Array.isArray(entry.quote), `${it.id}: testimonial.quote must be an array of paragraphs`);
      assert.ok(entry.quote.length > 0, `${it.id}: testimonial.quote must not be empty`);
      assert.ok(entry.author, `${it.id}: testimonial.author is required`);
      assert.ok(
        Number.isInteger(entry.rating) && entry.rating >= 1 && entry.rating <= 5,
        `${it.id}: testimonial.rating must be an integer 1-5`
      );
    }
  }
});
