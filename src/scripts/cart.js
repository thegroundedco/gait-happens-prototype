// Framework-free localStorage cart module — pure data/logic, no UI.
//
// Persists to `localStorage` under STORAGE_KEY and dispatches a `cart:change`
// CustomEvent (on `window` AND `document`, so either listener style works)
// after every mutation so drawer/badge UI (Tasks 7–8) can re-render.
//
// Test/SSR safety: this module is imported by `tests/cart.test.mjs` under
// plain Node (no DOM) and by Astro's SSR build. Every touch of `localStorage`
// / `window` / `document` / `CustomEvent` goes through the feature-detected
// helpers below (reading off `globalThis` so a minimal test stub — see the
// test file — is picked up the same way a real browser global would be).
// In a non-DOM context, state simply lives in memory for the module's
// lifetime and dispatch is a no-op.

const STORAGE_KEY = 'gh_cart';
const EVENT_NAME = 'cart:change';

function hasLocalStorage() {
  return typeof globalThis.localStorage !== 'undefined' && globalThis.localStorage !== null;
}

function readStore() {
  if (!hasLocalStorage()) return [];
  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Corrupt/foreign JSON in storage shouldn't crash the cart — start empty.
    return [];
  }
}

function writeStore(lines) {
  if (!hasLocalStorage()) return;
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage may be full/unavailable (e.g. private browsing) — cart still
    // works in-memory for the rest of the session.
  }
}

// In-memory mirror of the persisted lines. Seeded once from storage (or
// empty, in a non-DOM/test context) and kept in sync with every mutation.
let lines = readStore();

function dispatch() {
  const detail = getCart();
  for (const target of [globalThis.window, globalThis.document]) {
    if (target && typeof target.dispatchEvent === 'function' && typeof globalThis.CustomEvent === 'function') {
      target.dispatchEvent(new globalThis.CustomEvent(EVENT_NAME, { detail }));
    }
  }
}

function persist() {
  writeStore(lines);
  dispatch();
}

function keyFor(id, variant) {
  return `${id}::${variant ?? ''}`;
}

// Parses a display price into a number for arithmetic. Accepts a number
// as-is, or a string like "$45 USD" or a range "$147–897 USD" (any dash:
// hyphen, en dash, em dash) — ranges use the first/base number. Returns 0
// for anything unparseable rather than throwing, so a bad catalog entry
// degrades to a $0 line instead of breaking the whole cart.
export function parsePrice(price) {
  if (typeof price === 'number') return Number.isFinite(price) ? price : 0;
  if (typeof price !== 'string') return 0;
  const match = price.match(/[\d,]+(?:\.\d+)?/);
  if (!match) return 0;
  const n = Number(match[0].replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function getCart() {
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.qty * parsePrice(l.price), 0);
  // Return a shallow copy of lines so callers can't mutate internal state
  // directly — all mutation must go through addLine/removeLine/setQty/clear.
  return { lines: lines.map((l) => ({ ...l })), count, subtotal };
}

export function addLine(line) {
  const { id, title, variant = null, price, qty = 1, image, href } = line;
  const key = keyFor(id, variant);
  const existing = lines.find((l) => l.key === key);
  if (existing) {
    existing.qty += qty;
  } else {
    lines.push({ key, id, title, variant, price, qty, image, href });
  }
  persist();
}

export function removeLine(key) {
  lines = lines.filter((l) => l.key !== key);
  persist();
}

export function setQty(key, n) {
  if (n <= 0) {
    removeLine(key);
    return;
  }
  const existing = lines.find((l) => l.key === key);
  if (existing) existing.qty = n;
  persist();
}

export function clear() {
  lines = [];
  persist();
}
