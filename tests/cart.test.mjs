import { test } from 'node:test';
import assert from 'node:assert/strict';

// --- Minimal DOM-less stubs -------------------------------------------------
// Node has no localStorage/window/document/CustomEvent. cart.js must guard all
// access to these globals so it can be imported here (and during Astro's SSR
// build) without throwing. We install lightweight stand-ins BEFORE importing
// the module so its feature-detection finds them.

function makeLocalStorageStub() {
  const store = new Map();
  return {
    store,
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => { store.set(k, String(v)); },
    removeItem: (k) => { store.delete(k); },
    clear: () => { store.clear(); },
  };
}

function makeEventTargetStub() {
  const listeners = new Map();
  const calls = [];
  return {
    calls,
    addEventListener: (type, fn) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener: (type, fn) => {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent: (evt) => {
      calls.push(evt);
      listeners.get(evt.type)?.forEach((fn) => fn(evt));
      return true;
    },
  };
}

globalThis.localStorage = makeLocalStorageStub();
const windowStub = makeEventTargetStub();
const documentStub = makeEventTargetStub();
globalThis.window = windowStub;
globalThis.document = documentStub;
globalThis.CustomEvent = class CustomEvent {
  constructor(type, opts = {}) {
    this.type = type;
    this.detail = opts.detail;
  }
};

const cart = await import('../src/scripts/cart.js');
const { getCart, addLine, removeLine, setQty, clear } = cart;

function reset() {
  clear();
  globalThis.localStorage.store.clear();
  windowStub.calls.length = 0;
  documentStub.calls.length = 0;
}

test('empty cart starts with no lines, zero count/subtotal', () => {
  reset();
  const c = getCart();
  assert.deepEqual(c.lines, []);
  assert.equal(c.count, 0);
  assert.equal(c.subtotal, 0);
});

test('addLine creates a line; getCart().count/subtotal reflect it', () => {
  reset();
  addLine({ id: 'toe-spacers', title: 'Toe Spacers', variant: 'Medium', price: '$45 USD', qty: 1, image: '/x.jpg', href: '/products/toe-spacers' });
  const c = getCart();
  assert.equal(c.lines.length, 1);
  assert.equal(c.count, 1);
  assert.equal(c.subtotal, 45);
  assert.equal(c.lines[0].id, 'toe-spacers');
  assert.equal(c.lines[0].variant, 'Medium');
  assert.equal(c.lines[0].key, 'toe-spacers::Medium');
});

test('addLine defaults qty to 1 when omitted', () => {
  reset();
  addLine({ id: 'toe-spacers', title: 'Toe Spacers', variant: 'Small', price: '$45 USD', image: '/x.jpg', href: '/products/toe-spacers' });
  assert.equal(getCart().count, 1);
});

test('addLine with SAME id+variant merges qty into one line', () => {
  reset();
  addLine({ id: 'toe-spacers', title: 'Toe Spacers', variant: 'Medium', price: '$45 USD', qty: 2, image: '/x.jpg', href: '/products/toe-spacers' });
  addLine({ id: 'toe-spacers', title: 'Toe Spacers', variant: 'Medium', price: '$45 USD', qty: 1, image: '/x.jpg', href: '/products/toe-spacers' });
  const c = getCart();
  assert.equal(c.lines.length, 1);
  assert.equal(c.lines[0].qty, 3);
  assert.equal(c.count, 3);
  assert.equal(c.subtotal, 135);
});

test('addLine with a DIFFERENT variant creates a second line', () => {
  reset();
  addLine({ id: 'toe-spacers', title: 'Toe Spacers', variant: 'Medium', price: '$45 USD', qty: 1, image: '/x.jpg', href: '/products/toe-spacers' });
  addLine({ id: 'toe-spacers', title: 'Toe Spacers', variant: 'Large', price: '$45 USD', qty: 1, image: '/x.jpg', href: '/products/toe-spacers' });
  const c = getCart();
  assert.equal(c.lines.length, 2);
  assert.equal(c.count, 2);
});

test('removeLine(key) removes the matching line only', () => {
  reset();
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 1, image: '', href: '/products/a' });
  addLine({ id: 'b', title: 'B', variant: null, price: '$20 USD', qty: 1, image: '', href: '/products/b' });
  const key = getCart().lines.find((l) => l.id === 'a').key;
  removeLine(key);
  const c = getCart();
  assert.equal(c.lines.length, 1);
  assert.equal(c.lines[0].id, 'b');
});

test('setQty(key, n) updates qty', () => {
  reset();
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 1, image: '', href: '/products/a' });
  const key = getCart().lines[0].key;
  setQty(key, 5);
  assert.equal(getCart().lines[0].qty, 5);
  assert.equal(getCart().count, 5);
});

test('setQty(key, 0) removes the line', () => {
  reset();
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 1, image: '', href: '/products/a' });
  const key = getCart().lines[0].key;
  setQty(key, 0);
  assert.deepEqual(getCart().lines, []);
});

test('setQty(key, -3) (negative) removes the line', () => {
  reset();
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 1, image: '', href: '/products/a' });
  const key = getCart().lines[0].key;
  setQty(key, -3);
  assert.deepEqual(getCart().lines, []);
});

test('subtotal computes from parsed numeric prices: two $45 USD @ qty 2 => 90', () => {
  reset();
  addLine({ id: 'toe-spacers', title: 'Toe Spacers', variant: 'Medium', price: '$45 USD', qty: 2, image: '', href: '/products/toe-spacers' });
  assert.equal(getCart().subtotal, 90);
});

test('subtotal parses a price range string, using the first/base number', () => {
  reset();
  addLine({ id: 'course-x', title: 'Course X', variant: null, price: '$147–897 USD', qty: 1, image: '', href: '/courses/course-x' });
  assert.equal(getCart().subtotal, 147);
});

test('subtotal parses a numeric price (not a string)', () => {
  reset();
  addLine({ id: 'n', title: 'N', variant: null, price: 45, qty: 2, image: '', href: '/products/n' });
  assert.equal(getCart().subtotal, 90);
});

test('clear() empties the cart', () => {
  reset();
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 1, image: '', href: '/products/a' });
  clear();
  const c = getCart();
  assert.deepEqual(c.lines, []);
  assert.equal(c.count, 0);
  assert.equal(c.subtotal, 0);
});

test('persistence: after a mutation, the localStorage stub holds the serialized cart', () => {
  reset();
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 2, image: '', href: '/products/a' });
  const raw = globalThis.localStorage.getItem('gh_cart');
  assert.ok(raw, 'expected something persisted to localStorage');
  const parsed = JSON.parse(raw);
  const lines = Array.isArray(parsed) ? parsed : parsed.lines;
  assert.equal(lines.length, 1);
  assert.equal(lines[0].qty, 2);
});

test('persistence: a fresh getCart() reflects what was persisted (survives reimport-style read)', () => {
  reset();
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 3, image: '', href: '/products/a' });
  // Simulate "fresh page load": clear in-memory state is not directly
  // accessible, but getCart() should always be consistent with storage.
  const c = getCart();
  assert.equal(c.lines[0].qty, 3);
});

test('cart:change event fires on addLine/removeLine/setQty/clear', () => {
  reset();
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 1, image: '', href: '/products/a' });
  assert.ok(windowStub.calls.some((e) => e.type === 'cart:change') || documentStub.calls.some((e) => e.type === 'cart:change'), 'expected cart:change dispatched on addLine');

  windowStub.calls.length = 0;
  documentStub.calls.length = 0;
  const key = getCart().lines[0].key;
  setQty(key, 2);
  assert.ok(windowStub.calls.some((e) => e.type === 'cart:change') || documentStub.calls.some((e) => e.type === 'cart:change'), 'expected cart:change dispatched on setQty');

  windowStub.calls.length = 0;
  documentStub.calls.length = 0;
  removeLine(key);
  assert.ok(windowStub.calls.some((e) => e.type === 'cart:change') || documentStub.calls.some((e) => e.type === 'cart:change'), 'expected cart:change dispatched on removeLine');

  windowStub.calls.length = 0;
  documentStub.calls.length = 0;
  addLine({ id: 'a', title: 'A', variant: null, price: '$10 USD', qty: 1, image: '', href: '/products/a' });
  windowStub.calls.length = 0;
  documentStub.calls.length = 0;
  clear();
  assert.ok(windowStub.calls.some((e) => e.type === 'cart:change') || documentStub.calls.some((e) => e.type === 'cart:change'), 'expected cart:change dispatched on clear');
});
