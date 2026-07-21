// Progressive enhancement: upgrade native <select data-custom-select> into a
// styled combobox/listbox matching AccountMenu.astro (white hover-panel,
// chevron trigger, yellow/teal option hover). The native <select> STAYS in the
// DOM (display:none via .cselect__native, aria-hidden, tabindex=-1) as the
// value holder + no-JS fallback — choosing an option sets its .value and fires
// a bubbling `change`, so code reading the select (e.g. QuickAddModal's
// selectionSummary) keeps working.
//
// Site JS idiom (see motion.js): module-scope, run once on load + on every
// astro:after-swap. enhanceSelects(root) is also exported so QuickAddModal can
// enhance the Location <select> it injects via innerHTML at populate() time.
//
// Accessibility: WAI-ARIA select-only combobox — trigger role=combobox
// aria-haspopup=listbox aria-expanded, panel role=listbox, options role=option
// aria-selected, keyboard nav via aria-activedescendant.

// ---- Pure helpers (unit-tested; no DOM) --------------------------------

// Colour variant from the data-custom-select value. Bare `data-custom-select`
// (empty string) and any unknown value fall back to 'yellow'.
export function resolveVariant(value) {
  return value === 'teal' ? 'teal' : 'yellow';
}

// A dropdown is disabled when it has no selectable option — every option is
// `disabled` (the "Location…" placeholder is `disabled hidden`) or there are
// none. `opts` is an array of { disabled } (mirrors HTMLOptionElement).
export function isDisabledOptions(opts) {
  return opts.filter((o) => !o.disabled).length === 0;
}

// Next active option index for keyboard nav. No wrap (APG listbox): ArrowDown
// stops at the last, ArrowUp at the first, Home -> 0, End -> last. `current`
// may be -1 (nothing active). Returns a clamped index in [0, count-1], or -1
// when count is 0. Unrelated keys are a no-op (return current).
export function nextActiveIndex(current, count, key) {
  if (count <= 0) return -1;
  const last = count - 1;
  switch (key) {
    case 'ArrowDown': return current < 0 ? 0 : Math.min(current + 1, last);
    case 'ArrowUp': return current < 0 ? last : Math.max(current - 1, 0);
    case 'Home': return 0;
    case 'End': return last;
    default: return current;
  }
}

// ---- DOM enhancement ---------------------------------------------------

let uid = 0;

export function enhanceSelects(root = document) {
  root.querySelectorAll('select[data-custom-select]').forEach((sel) => {
    if (sel.dataset.cselectEnhanced) return;
    sel.dataset.cselectEnhanced = 'true';
    buildDropdown(sel);
  });
}

function buildDropdown(sel) {
  const id = `cselect-${(uid += 1)}`;
  const variant = resolveVariant(sel.dataset.customSelect);
  const opts = Array.from(sel.options);
  const disabled = isDisabledOptions(opts) || sel.disabled;
  const ariaLabel = sel.getAttribute('aria-label');

  // Wrapper inserted before the native select; the select moves inside it.
  const wrap = document.createElement('div');
  wrap.className = `cselect cselect--${variant}`;
  if (sel.dataset.cselectSize === 'compact') wrap.classList.add('cselect--compact');
  if (disabled) wrap.classList.add('cselect--disabled');
  sel.parentNode.insertBefore(wrap, sel);
  wrap.appendChild(sel);
  sel.classList.add('cselect__native');
  sel.setAttribute('aria-hidden', 'true');
  sel.tabIndex = -1;

  // Trigger.
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'cselect__trigger';
  trigger.id = `${id}-trigger`;
  trigger.setAttribute('role', 'combobox');
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  if (ariaLabel) trigger.setAttribute('aria-label', ariaLabel);
  const labelEl = document.createElement('span');
  labelEl.className = 'cselect__label';
  labelEl.textContent = sel.options[sel.selectedIndex]?.text ?? '';
  const chevron = document.createElement('span');
  chevron.className = 'cselect__chevron';
  chevron.setAttribute('aria-hidden', 'true');
  trigger.append(labelEl, chevron);
  wrap.appendChild(trigger);

  if (disabled) {
    trigger.disabled = true;
    trigger.setAttribute('aria-disabled', 'true');
    return; // muted, non-opening placeholder field — no panel, no listeners
  }

  // Panel + options (skip any disabled placeholder option).
  const panel = document.createElement('ul');
  panel.className = 'cselect__panel';
  panel.id = `${id}-panel`;
  panel.setAttribute('role', 'listbox');
  panel.hidden = true;
  if (ariaLabel) panel.setAttribute('aria-label', ariaLabel);
  trigger.setAttribute('aria-controls', panel.id);

  opts.filter((o) => !o.disabled).forEach((opt, i) => {
    const li = document.createElement('li');
    li.className = 'cselect__option';
    li.id = `${id}-opt-${i}`;
    li.setAttribute('role', 'option');
    li.dataset.value = opt.value;
    li.textContent = opt.text;
    li.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
    panel.appendChild(li);
  });
  wrap.appendChild(panel);

  wireInstance(wrap, sel, trigger, labelEl, panel);
}

function wireInstance(wrap, sel, trigger, labelEl, panel) {
  const options = Array.from(panel.children);
  const activeIndex = () => options.findIndex((li) => li.classList.contains('cselect__option--active'));

  function setActive(i) {
    options.forEach((li, j) => li.classList.toggle('cselect__option--active', j === i));
    if (i >= 0) {
      trigger.setAttribute('aria-activedescendant', options[i].id);
      options[i].scrollIntoView({ block: 'nearest' });
    } else {
      trigger.removeAttribute('aria-activedescendant');
    }
  }

  function open() {
    closeOpenDropdown(); // enforce one-open-at-a-time
    panel.hidden = false;
    wrap.classList.add('cselect--open');
    trigger.setAttribute('aria-expanded', 'true');
    const selIdx = options.findIndex((li) => li.getAttribute('aria-selected') === 'true');
    setActive(selIdx >= 0 ? selIdx : 0);
  }

  function close() {
    panel.hidden = true;
    wrap.classList.remove('cselect--open');
    trigger.setAttribute('aria-expanded', 'false');
    setActive(-1);
  }

  function choose(i) {
    const li = options[i];
    if (!li) return;
    options.forEach((o) => o.setAttribute('aria-selected', 'false'));
    li.setAttribute('aria-selected', 'true');
    labelEl.textContent = li.textContent;
    sel.value = li.dataset.value; // sync the value holder...
    sel.dispatchEvent(new Event('change', { bubbles: true })); // ...and notify
    close();
    trigger.focus();
  }

  trigger.addEventListener('click', () => {
    if (wrap.classList.contains('cselect--open')) close();
    else open();
  });

  trigger.addEventListener('keydown', (e) => {
    const isOpen = wrap.classList.contains('cselect--open');
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) choose(activeIndex());
        else open();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Home':
      case 'End':
        e.preventDefault();
        if (!isOpen) open();
        else setActive(nextActiveIndex(activeIndex(), options.length, e.key));
        break;
      case 'Escape':
        if (isOpen) { e.preventDefault(); close(); }
        break;
      case 'Tab':
        if (isOpen) close();
        break;
      default:
        break;
    }
  });

  options.forEach((li, i) => {
    li.addEventListener('click', () => choose(i));
    li.addEventListener('mousemove', () => setActive(i));
  });
}

// Close whichever dropdown is currently open (generic, DOM-query based so no
// instance registry is needed). Used by open() and the outside-click handler.
function closeOpenDropdown() {
  const open = document.querySelector('.cselect--open');
  if (!open) return;
  const panel = open.querySelector('.cselect__panel');
  const trigger = open.querySelector('.cselect__trigger');
  if (panel) panel.hidden = true;
  open.classList.remove('cselect--open');
  if (trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.removeAttribute('aria-activedescendant');
  }
  open.querySelectorAll('.cselect__option--active').forEach((li) => li.classList.remove('cselect__option--active'));
}

// ---- Bootstrap (guarded so `node --test` can import the pure helpers) ---
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const open = document.querySelector('.cselect--open');
    if (open && e.target instanceof Node && !open.contains(e.target)) closeOpenDropdown();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => enhanceSelects());
  } else {
    enhanceSelects();
  }
  document.addEventListener('astro:after-swap', () => enhanceSelects());
}
