import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveVariant, isDisabledOptions, nextActiveIndex } from '../src/scripts/custom-select.js';

test('resolveVariant returns teal only for exact "teal", else yellow', () => {
  assert.equal(resolveVariant('teal'), 'teal');
  assert.equal(resolveVariant('yellow'), 'yellow');
  assert.equal(resolveVariant(''), 'yellow');
  assert.equal(resolveVariant(undefined), 'yellow');
  assert.equal(resolveVariant('TEAL'), 'yellow');
});

test('isDisabledOptions is true when no option is selectable', () => {
  // Empty, and placeholder-only (disabled) — both disabled.
  assert.equal(isDisabledOptions([]), true);
  assert.equal(isDisabledOptions([{ disabled: true }]), true);
  // At least one non-disabled option -> enabled.
  assert.equal(isDisabledOptions([{ disabled: true }, { disabled: false }]), false);
  assert.equal(isDisabledOptions([{ disabled: false }]), false);
});

test('nextActiveIndex navigates without wrapping and honours Home/End', () => {
  // ArrowDown clamps at last; from -1 (nothing active) -> 0.
  assert.equal(nextActiveIndex(-1, 3, 'ArrowDown'), 0);
  assert.equal(nextActiveIndex(0, 3, 'ArrowDown'), 1);
  assert.equal(nextActiveIndex(2, 3, 'ArrowDown'), 2);
  // ArrowUp clamps at 0; from -1 -> last.
  assert.equal(nextActiveIndex(-1, 3, 'ArrowUp'), 2);
  assert.equal(nextActiveIndex(2, 3, 'ArrowUp'), 1);
  assert.equal(nextActiveIndex(0, 3, 'ArrowUp'), 0);
  // Home/End.
  assert.equal(nextActiveIndex(2, 3, 'Home'), 0);
  assert.equal(nextActiveIndex(0, 3, 'End'), 2);
  // Empty list -> -1; unrelated key is a no-op.
  assert.equal(nextActiveIndex(0, 0, 'ArrowDown'), -1);
  assert.equal(nextActiveIndex(1, 3, 'x'), 1);
});
