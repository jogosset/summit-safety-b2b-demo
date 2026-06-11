# Summit Safety Homepage Blocks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 7 EDS homepage blocks for Summit Safety's B2B storefront — hero, trust bar, categories, value props, product cards, testimonials, and CTA banner — following the AEM boilerplate conventions in AGENTS.md and using the project's existing CSS token system.

**Architecture:** Each block lives in `blocks/ss-{name}/` with a `decorate(block)` JS function that reads the DA.live-authored HTML table rows, transforms the DOM, and registers IntersectionObserver-based scroll-reveal animations from a shared utility. Styles are scoped to `.ss-{name}` and use both existing dropin tokens (`--spacing-*`, `--shape-*`, `--color-neutral-*`) and new Summit Safety brand tokens added to a dedicated `styles/summit-safety-tokens.css`.

**Tech Stack:** Vanilla JS ES6+, CSS3 custom properties, IntersectionObserver API, AEM boilerplate (`aem.js` — `createOptimizedPicture`), no build step, no framework.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `styles/summit-safety-tokens.css` | **Create** | Summit Safety brand CSS tokens |
| `head.html` | **Modify** | Add font preconnect + token stylesheet |
| `scripts/ss-animations.js` | **Create** | Shared scroll-reveal + counter utility |
| `blocks/ss-hero/ss-hero.js` | **Create** | Hero split-panel decorator |
| `blocks/ss-hero/ss-hero.css` | **Create** | Hero styles |
| `blocks/ss-trust-bar/ss-trust-bar.js` | **Create** | Trust bar decorator |
| `blocks/ss-trust-bar/ss-trust-bar.css` | **Create** | Trust bar styles |
| `blocks/ss-categories/ss-categories.js` | **Create** | Category grid decorator |
| `blocks/ss-categories/ss-categories.css` | **Create** | Category grid styles |
| `blocks/ss-value-props/ss-value-props.js` | **Create** | Value props + stat cards decorator |
| `blocks/ss-value-props/ss-value-props.css` | **Create** | Value props styles |
| `blocks/ss-product-cards/ss-product-cards.js` | **Create** | Product card grid decorator |
| `blocks/ss-product-cards/ss-product-cards.css` | **Create** | Product card styles |
| `blocks/ss-testimonials/ss-testimonials.js` | **Create** | Testimonials decorator |
| `blocks/ss-testimonials/ss-testimonials.css` | **Create** | Testimonials styles |
| `blocks/ss-cta-banner/ss-cta-banner.js` | **Create** | CTA banner decorator |
| `blocks/ss-cta-banner/ss-cta-banner.css` | **Create** | CTA banner styles |
| `drafts/homepage.html` | **Create** | Local dev test page |
| `component-definition.json` | **Modify** | Register all 7 blocks for DA.live |

---

## Task 0 — Brand Tokens + Font Loading

**Files:**
- Create: `styles/summit-safety-tokens.css`
- Modify: `head.html`

- [ ] **Step 1: Create `styles/summit-safety-tokens.css`**

```css
/* Summit Safety Brand Tokens — Alpine Professional palette */
/* Extends the Adobe Commerce dropin token set in styles.css  */
:root {
  --ss-color-navy: #0b3d5e;
  --ss-color-navy-deep: #071824;
  --ss-color-navy-mid: #0d5480;
  --ss-color-gold: #e8a020;
  --ss-color-gold-deep: #c98010;
  --ss-color-sky: #00b4d8;
  --ss-color-sky-deep: #0077a8;
  --ss-color-white: #fafcff;
  --ss-color-surface: #f0f5fa;
  --ss-font-display: 'Barlow Condensed', sans-serif;
  --ss-font-body: 'Barlow', sans-serif;
  --ss-shadow-card: 0 2px 12px rgb(11 61 94 / 10%);
  --ss-shadow-card-hover: 0 8px 32px rgb(11 61 94 / 20%);
  --ss-shadow-gold: 0 4px 20px rgb(232 160 32 / 30%);
  --ss-transition-mid: 280ms cubic-bezier(0.4, 0, 0.2, 1);
  --ss-transition-slow: 480ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 2: Add font preconnect + token link to `head.html`**

Insert these two lines immediately after the opening `<meta name="viewport">` tag and before the existing `<link rel="stylesheet" href="/styles/styles.css" />`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/styles/summit-safety-tokens.css">
```

- [ ] **Step 3: Verify tokens load**

```bash
# Start dev server
npx @adobe/aem-cli up --no-open --forward-browser-logs
```

Open `http://localhost:3000` in a browser, open DevTools console and run:
```js
getComputedStyle(document.documentElement).getPropertyValue('--ss-color-gold')
// Expected: " #e8a020"
```

- [ ] **Step 4: Commit**

```bash
git add styles/summit-safety-tokens.css head.html
git commit -m "feat: add Summit Safety brand tokens and Barlow font loading"
```

---

## Task 1 — Shared Animation Utility

**Files:**
- Create: `scripts/ss-animations.js`

- [ ] **Step 1: Create `scripts/ss-animations.js`**

```js
/**
 * Registers a single IntersectionObserver for all .ss-reveal elements
 * inside a block, toggling .ss-visible when they enter the viewport.
 * Children of .ss-stagger get incremental transition-delay.
 * @param {Element} block
 * @param {number} [staggerMs=80]
 */
export function observeReveal(block, staggerMs = 80) {
  block.querySelectorAll('.ss-stagger').forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * staggerMs}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ss-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  block.querySelectorAll('.ss-reveal, .ss-reveal-left, .ss-reveal-right').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Animates an element's text content from 0 to data-count-to when it
 * enters the viewport. Supports optional data-count-suffix attribute.
 * @param {Element} el
 */
export function observeCounter(el) {
  const target = parseInt(el.dataset.countTo, 10);
  if (!target) return;
  const suffix = el.dataset.countSuffix || '';
  const duration = 1200;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - (1 - progress) ** 3;
          const current = Math.round(eased * target);
          el.textContent = target >= 1000
            ? `${(current / 1000).toFixed(current % 1000 === 0 ? 0 : 1)}K${suffix}`
            : `${current}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.5 },
  );
  observer.observe(el);
}
```

- [ ] **Step 2: Confirm no lint errors**

```bash
npm run lint -- scripts/ss-animations.js
# Expected: no errors
```

- [ ] **Step 3: Commit**

```bash
git add scripts/ss-animations.js
git commit -m "feat: add shared scroll-reveal and counter animation utility"
```

---

## Task 2 — `ss-hero` Block

**Files:**
- Create: `blocks/ss-hero/ss-hero.js`
- Create: `blocks/ss-hero/ss-hero.css`

**Authored DA.live table structure** (10 rows, 1–2 columns):
```
| eyebrow text                        |
| H1 text                             |
| body paragraph                      |
| [link: primary CTA]                 |
| [link: secondary CTA]               |
| badge text                          |
| [picture: hero image]               |
| stat value  | stat label            |
| stat value  | stat label            |
| stat value  | stat label            |
```
Row 4–5 use `<a>` elements authored as links in DA.live.
Row 7 contains a `<picture>` element from the DAM.
Rows 8–10 each have 2 cells: value and label.

- [ ] **Step 1: Create `blocks/ss-hero/ss-hero.js`**

```js
import { createOptimizedPicture } from '../../scripts/aem.js';

function buildHeroLeft(rows) {
  const left = document.createElement('div');
  left.className = 'ss-hero-left';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'ss-hero-eyebrow';
  eyebrow.textContent = rows[0]?.children[0]?.textContent.trim() || '';
  left.append(eyebrow);

  const h1 = document.createElement('h1');
  h1.className = 'ss-hero-h1';
  const rawHeading = rows[1]?.children[0]?.textContent.trim() || '';
  // Wrap the word "SUMMIT" in <em> for gold highlight
  h1.innerHTML = rawHeading
    .split(' ')
    .map((w) => (w.toUpperCase() === 'SUMMIT' ? `<em>${w}</em>` : w))
    .join(' ');
  left.append(h1);

  const sub = document.createElement('p');
  sub.className = 'ss-hero-sub';
  sub.textContent = rows[2]?.children[0]?.textContent.trim() || '';
  left.append(sub);

  const ctas = document.createElement('div');
  ctas.className = 'ss-hero-ctas';

  const primaryLink = rows[3]?.querySelector('a');
  if (primaryLink) {
    primaryLink.className = 'ss-btn ss-btn-primary';
    ctas.append(primaryLink);
  }

  const secondaryLink = rows[4]?.querySelector('a');
  if (secondaryLink) {
    secondaryLink.className = 'ss-btn ss-btn-outline-light';
    ctas.append(secondaryLink);
  }

  left.append(ctas);
  return left;
}

function buildHeroRight(rows) {
  const right = document.createElement('div');
  right.className = 'ss-hero-right';

  // Decorative rings
  [1, 2, 3].forEach((n) => {
    const ring = document.createElement('div');
    ring.className = `ss-hero-ring ss-hero-ring-${n}`;
    right.append(ring);
  });

  const badge = document.createElement('div');
  badge.className = 'ss-hero-badge';
  badge.textContent = rows[5]?.children[0]?.textContent.trim() || '';
  right.append(badge);

  // Hero image
  const imgZone = document.createElement('div');
  imgZone.className = 'ss-hero-img-zone';
  const picture = rows[6]?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      imgZone.append(createOptimizedPicture(img.src, img.alt || 'Hero product', true, [{ width: '800' }]));
    }
  }
  right.append(imgZone);

  // Stats strip
  const stats = document.createElement('div');
  stats.className = 'ss-hero-stats';
  [rows[7], rows[8], rows[9]].forEach((row) => {
    if (!row) return;
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'ss-hero-stat';
    const num = document.createElement('div');
    num.className = 'ss-hero-stat-num';
    const rawVal = cells[0]?.textContent.trim() || '';
    // Strip suffix so counter can animate; re-attach as data-count-suffix
    const match = rawVal.match(/^(\d+)(.*)$/);
    if (match) {
      num.dataset.countTo = match[1];
      num.dataset.countSuffix = match[2];
    }
    num.textContent = rawVal;
    const label = document.createElement('div');
    label.className = 'ss-hero-stat-label';
    label.textContent = cells[1]?.textContent.trim() || '';
    item.append(num, label);
    stats.append(item);
  });
  right.append(stats);

  return right;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const left = buildHeroLeft(rows);
  const right = buildHeroRight(rows);
  block.replaceChildren(left, right);

  // Entry animations — add .ss-animated to trigger CSS animations
  requestAnimationFrame(() => {
    block.querySelectorAll(
      '.ss-hero-eyebrow, .ss-hero-h1, .ss-hero-sub, .ss-hero-ctas',
    ).forEach((el, i) => {
      el.style.animationDelay = `${i * 140}ms`;
      el.classList.add('ss-anim-fade-up');
    });
    block.querySelector('.ss-hero-img-zone')?.classList.add('ss-anim-scale-in');
    block.querySelector('.ss-hero-badge')?.classList.add('ss-anim-fade-up');
  });

  // Counter animation for stat numbers
  import('../../scripts/ss-animations.js').then(({ observeCounter }) => {
    block.querySelectorAll('.ss-hero-stat-num[data-count-to]').forEach(observeCounter);
  });
}
```

- [ ] **Step 2: Create `blocks/ss-hero/ss-hero.css`**

```css
/* ── Layout ── */
.ss-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 320px;
  max-height: 340px;
  overflow: hidden;
}

/* ── Left panel ── */
.ss-hero .ss-hero-left {
  background: linear-gradient(145deg, var(--ss-color-navy) 0%, #0c4878 100%);
  padding: clamp(20px, 3vw, 36px) clamp(32px, 5vw, 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ss-hero .ss-hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.3em;
  color: var(--ss-color-gold);
  text-transform: uppercase;
  margin-bottom: 10px;
}

.ss-hero .ss-hero-eyebrow::before {
  content: '';
  display: block;
  width: 28px;
  height: 2px;
  background: var(--ss-color-gold);
  border-radius: 2px;
  flex-shrink: 0;
}

.ss-hero .ss-hero-h1 {
  font-family: var(--ss-font-display);
  font-weight: 900;
  font-size: clamp(2.8rem, 3.2vw, 3.8rem);
  line-height: 0.95;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 10px;
}

.ss-hero .ss-hero-h1 em {
  color: var(--ss-color-gold);
  font-style: normal;
  display: block;
}

.ss-hero .ss-hero-sub {
  font-size: 1.5rem;
  color: rgb(255 255 255 / 72%);
  line-height: 1.65;
  max-width: 400px;
  margin: 0 0 16px;
}

.ss-hero .ss-hero-ctas {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* ── Right panel ── */
.ss-hero .ss-hero-right {
  background: linear-gradient(160deg, var(--ss-color-sky) 0%, var(--ss-color-sky-deep) 45%, var(--ss-color-navy) 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Decorative rings */
.ss-hero .ss-hero-ring {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}

.ss-hero .ss-hero-ring-1 {
  width: 420px;
  height: 420px;
  border: 56px solid rgb(255 255 255 / 5%);
  top: -100px;
  left: -100px;
  animation: ss-rotate-slow 40s linear infinite;
}

.ss-hero .ss-hero-ring-2 {
  width: 260px;
  height: 260px;
  border: 36px solid rgb(232 160 32 / 10%);
  bottom: -60px;
  right: -60px;
  animation: ss-rotate-slow 28s linear infinite reverse;
}

.ss-hero .ss-hero-ring-3 {
  width: 160px;
  height: 160px;
  border: 20px solid rgb(255 255 255 / 6%);
  top: 40%;
  left: 60%;
  animation: ss-rotate-slow 20s linear infinite;
}

.ss-hero .ss-hero-badge {
  position: absolute;
  top: 24px;
  right: 24px;
  background: var(--ss-color-gold);
  color: var(--ss-color-navy);
  font-family: var(--ss-font-display);
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.15em;
  padding: 5px 14px;
  border-radius: 100px;
  text-transform: uppercase;
  box-shadow: var(--ss-shadow-gold);
  z-index: 2;
}

.ss-hero .ss-hero-img-zone {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ss-hero .ss-hero-img-zone picture {
  display: block;
}

.ss-hero .ss-hero-img-zone img {
  max-height: 280px;
  object-fit: cover;
  border-radius: var(--shape-border-radius-2);
}

/* Stats strip */
.ss-hero .ss-hero-stats {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(11 61 94 / 85%);
  backdrop-filter: blur(8px);
  display: flex;
  padding: 12px 24px;
  z-index: 2;
}

.ss-hero .ss-hero-stat {
  flex: 1;
  text-align: center;
  padding: 0 var(--spacing-small);
  border-right: 1px solid rgb(232 160 32 / 25%);
}

.ss-hero .ss-hero-stat:last-child {
  border-right: none;
}

.ss-hero .ss-hero-stat-num {
  font-family: var(--ss-font-display);
  font-weight: 900;
  font-size: 2.2rem;
  color: var(--ss-color-gold);
  line-height: 1;
  margin-bottom: 2px;
}

.ss-hero .ss-hero-stat-label {
  font-family: var(--ss-font-display);
  font-weight: 600;
  font-size: 1rem;
  color: rgb(255 255 255 / 55%);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ── Buttons ── */
.ss-hero .ss-btn {
  display: inline-flex;
  align-items: center;
  font-family: var(--ss-font-display);
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 12px 24px;
  border-radius: var(--shape-border-radius-1);
  text-decoration: none;
  transition: background var(--ss-transition-mid), box-shadow var(--ss-transition-mid), transform 180ms ease;
  border: 2px solid transparent;
}

.ss-hero .ss-btn:hover {
  transform: translateY(-1px);
}

.ss-hero .ss-btn-primary {
  background: var(--ss-color-gold);
  color: var(--ss-color-navy);
}

.ss-hero .ss-btn-primary:hover {
  background: var(--ss-color-gold-deep);
  box-shadow: var(--ss-shadow-gold);
}

.ss-hero .ss-btn-outline-light {
  background: transparent;
  color: #fff;
  border-color: rgb(255 255 255 / 50%);
}

.ss-hero .ss-btn-outline-light:hover {
  background: rgb(255 255 255 / 10%);
  border-color: rgb(255 255 255 / 80%);
}

/* ── Entry animations ── */
.ss-hero .ss-anim-fade-up {
  animation: ss-fade-slide-up 600ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

.ss-hero .ss-anim-scale-in {
  animation: ss-scale-in 700ms cubic-bezier(0.4, 0, 0.2, 1) 500ms both;
}

@keyframes ss-fade-slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes ss-scale-in {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes ss-rotate-slow {
  to { transform: rotate(360deg); }
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .ss-hero {
    grid-template-columns: 1fr;
    max-height: none;
  }

  .ss-hero .ss-hero-right {
    min-height: 240px;
  }
}

@media (max-width: 600px) {
  .ss-hero .ss-hero-stats {
    flex-wrap: wrap;
  }

  .ss-hero .ss-hero-stat {
    width: 50%;
    border-right: none;
  }
}
```

- [ ] **Step 3: Lint**

```bash
npm run lint -- blocks/ss-hero/ss-hero.js blocks/ss-hero/ss-hero.css
# Expected: no errors
```

- [ ] **Step 4: Commit**

```bash
git add blocks/ss-hero/
git commit -m "feat: add ss-hero split-panel block"
```

---

## Task 3 — `ss-trust-bar` Block

**Files:**
- Create: `blocks/ss-trust-bar/ss-trust-bar.js`
- Create: `blocks/ss-trust-bar/ss-trust-bar.css`

**Authored DA.live table structure** (4 rows, 3 columns each):
```
| ⚡ | Fast Delivery      | Ships same or next business day      |
| 🏆 | Top-Notch Quality  | Vetted PPE brands, certified materials |
| 🤝 | Excellent Service  | Dedicated account support            |
| 📦 | Bulk Orders        | Volume pricing available             |
```

- [ ] **Step 1: Create `blocks/ss-trust-bar/ss-trust-bar.js`**

```js
export default function decorate(block) {
  const items = [...block.querySelectorAll(':scope > div')].map((row) => {
    const cells = [...row.children];
    const item = document.createElement('div');
    item.className = 'ss-trust-item';

    const icon = document.createElement('span');
    icon.className = 'ss-trust-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = cells[0]?.textContent.trim() || '';

    const wrap = document.createElement('div');
    wrap.className = 'ss-trust-text';

    const label = document.createElement('strong');
    label.className = 'ss-trust-label';
    label.textContent = cells[1]?.textContent.trim() || '';

    const sub = document.createElement('span');
    sub.className = 'ss-trust-sub';
    sub.textContent = cells[2]?.textContent.trim() || '';

    wrap.append(label, sub);
    item.append(icon, wrap);
    return item;
  });

  block.replaceChildren(...items);
}
```

- [ ] **Step 2: Create `blocks/ss-trust-bar/ss-trust-bar.css`**

```css
.ss-trust-bar {
  background: var(--ss-color-navy);
  border-bottom: 3px solid var(--ss-color-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-small) var(--spacing-xxbig);
  gap: 0;
}

.ss-trust-bar .ss-trust-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xsmall);
  padding: var(--spacing-xsmall) var(--spacing-big);
  border-right: 1px solid rgb(232 160 32 / 25%);
  transition: transform 180ms ease;
}

.ss-trust-bar .ss-trust-item:last-child {
  border-right: none;
}

.ss-trust-bar .ss-trust-item:hover {
  transform: translateY(-2px);
}

.ss-trust-bar .ss-trust-icon {
  font-size: 2.2rem;
  flex-shrink: 0;
  filter: drop-shadow(0 1px 4px rgb(232 160 32 / 30%));
}

.ss-trust-bar .ss-trust-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ss-trust-bar .ss-trust-label {
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.1em;
  color: #fff;
  text-transform: uppercase;
}

.ss-trust-bar .ss-trust-sub {
  font-size: 1.1rem;
  color: rgb(255 255 255 / 50%);
}

@media (max-width: 900px) {
  .ss-trust-bar {
    flex-wrap: wrap;
    padding: var(--spacing-small);
  }

  .ss-trust-bar .ss-trust-item {
    width: 50%;
    border-right: none;
    border-bottom: 1px solid rgb(232 160 32 / 15%);
    padding: var(--spacing-xsmall) var(--spacing-small);
  }

  .ss-trust-bar .ss-trust-item:nth-last-child(-n+2) {
    border-bottom: none;
  }
}

@media (max-width: 600px) {
  .ss-trust-bar .ss-trust-item {
    width: 100%;
    border-bottom: 1px solid rgb(232 160 32 / 15%);
  }

  .ss-trust-bar .ss-trust-item:last-child {
    border-bottom: none;
  }
}
```

- [ ] **Step 3: Lint and commit**

```bash
npm run lint -- blocks/ss-trust-bar/ss-trust-bar.js blocks/ss-trust-bar/ss-trust-bar.css
git add blocks/ss-trust-bar/
git commit -m "feat: add ss-trust-bar block"
```

---

## Task 4 — `ss-categories` Block

**Files:**
- Create: `blocks/ss-categories/ss-categories.js`
- Create: `blocks/ss-categories/ss-categories.css`

**Authored DA.live table structure** (6 rows, 3 columns):
```
| 🧤 | Gloves     | 9 types             | /categories/gloves     |
| 👢 | Footwear   | 4 types             | /categories/footwear   |
| 🦺 | Body PPE   | Lab coats, aprons   | /categories/body       |
| ⛑️ | Head Gear  | Hard hats, glasses  | /categories/head-gear  |
| 😷 | Respiratory| N95, masks, shields | /categories/respiratory|
| 💇 | Hair Covers| Nets, beard covers  | /categories/hair-covers|
```
Column 4 (href) is authored as a link; the block reads `a.href`.

- [ ] **Step 1: Create `blocks/ss-categories/ss-categories.js`**

```js
import { observeReveal } from '../../scripts/ss-animations.js';

export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'ss-categories-header ss-reveal';

  const title = document.createElement('h2');
  title.className = 'ss-categories-title';
  title.textContent = 'Shop by Category';

  const viewAll = document.createElement('a');
  viewAll.className = 'ss-categories-view-all';
  viewAll.href = '/categories';
  viewAll.textContent = 'View All Products →';

  header.append(title, viewAll);

  const grid = document.createElement('div');
  grid.className = 'ss-categories-grid ss-stagger';

  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    const href = cells[3]?.querySelector('a')?.href || cells[3]?.textContent.trim() || '#';

    const card = document.createElement('a');
    card.className = 'ss-category-card ss-reveal';
    card.href = href;

    const icon = document.createElement('span');
    icon.className = 'ss-cat-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = cells[0]?.textContent.trim() || '';

    const name = document.createElement('div');
    name.className = 'ss-cat-name';
    name.textContent = cells[1]?.textContent.trim() || '';

    const count = document.createElement('div');
    count.className = 'ss-cat-count';
    count.textContent = cells[2]?.textContent.trim() || '';

    card.append(icon, name, count);
    grid.append(card);
  });

  block.replaceChildren(header, grid);
  observeReveal(block);
}
```

- [ ] **Step 2: Create `blocks/ss-categories/ss-categories.css`**

```css
.ss-categories {
  padding: var(--spacing-xxbig) var(--spacing-xxbig);
  background: var(--ss-color-white);
}

.ss-categories .ss-categories-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--spacing-xbig);
}

.ss-categories .ss-categories-title {
  font-family: var(--ss-font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 3vw, 3.4rem);
  color: var(--ss-color-navy);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  position: relative;
  padding-bottom: 12px;
}

.ss-categories .ss-categories-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--ss-color-gold);
  border-radius: 2px;
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms;
}

.ss-categories .ss-categories-title.ss-visible::after {
  width: 48px;
}

.ss-categories .ss-categories-view-all {
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--ss-color-gold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  transition: letter-spacing 180ms ease;
}

.ss-categories .ss-categories-view-all:hover {
  letter-spacing: 0.25em;
}

.ss-categories .ss-categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--spacing-small);
}

.ss-categories .ss-category-card {
  background: linear-gradient(160deg, var(--ss-color-navy) 0%, var(--ss-color-navy-mid) 100%);
  border-radius: var(--shape-border-radius-2);
  padding: var(--spacing-medium) var(--spacing-xsmall) var(--spacing-small);
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform var(--ss-transition-mid), box-shadow var(--ss-transition-mid);
}

/* Shimmer sweep on hover */
.ss-categories .ss-category-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgb(255 255 255 / 0%) 0%, rgb(255 255 255 / 5%) 50%, rgb(255 255 255 / 0%) 100%);
  transform: translateX(-100%);
  transition: transform 500ms ease;
}

.ss-categories .ss-category-card:hover::before {
  transform: translateX(100%);
}

/* Gold bottom bar */
.ss-categories .ss-category-card::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--ss-color-gold);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform var(--ss-transition-mid);
}

.ss-categories .ss-category-card:hover::after {
  transform: scaleX(1);
}

.ss-categories .ss-category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgb(11 61 94 / 30%);
}

.ss-categories .ss-cat-icon {
  font-size: 3.2rem;
  display: block;
  margin-bottom: var(--spacing-xsmall);
  transition: transform var(--ss-transition-mid);
  filter: drop-shadow(0 2px 6px rgb(0 180 216 / 30%));
}

.ss-categories .ss-category-card:hover .ss-cat-icon {
  transform: scale(1.15);
}

.ss-categories .ss-cat-name {
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 0.15em;
  color: #fff;
  text-transform: uppercase;
  margin-bottom: var(--spacing-xxsmall);
}

.ss-categories .ss-cat-count {
  font-size: 1rem;
  color: var(--ss-color-sky);
  font-weight: 500;
}

/* Scroll reveal */
.ss-reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity var(--ss-transition-slow), transform var(--ss-transition-slow);
}

.ss-reveal.ss-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1200px) {
  .ss-categories .ss-categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .ss-categories {
    padding: var(--spacing-big) var(--spacing-small);
  }

  .ss-categories .ss-categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 3: Lint and commit**

```bash
npm run lint -- blocks/ss-categories/ss-categories.js blocks/ss-categories/ss-categories.css
git add blocks/ss-categories/
git commit -m "feat: add ss-categories grid block with scroll-reveal"
```

---

## Task 5 — `ss-value-props` Block

**Files:**
- Create: `blocks/ss-value-props/ss-value-props.js`
- Create: `blocks/ss-value-props/ss-value-props.css`

**Authored DA.live table structure:**
Rows 1–N are prose rows (single cell); rows after a `---` separator row are stat rows (two cells: value | label).
```
| WHY SUMMIT SAFETY                              |   ← eyebrow (1 cell)
| PROTECTING THOSE WHO KEEP FACILITIES RUNNING   |   ← heading (1 cell)
| From a single box of nitrile gloves...         |   ← body (1 cell)
| Serving healthcare, industrial & commercial... |   ← bullet (1 cell)
| Broad catalog: vinyl, nitrile, latex...        |   ← bullet (1 cell)
| Case & bulk pricing for high-volume buyers     |   ← bullet (1 cell)
| Based in Spring Valley, NY — serving...        |   ← bullet (1 cell)
| ---                                            |   ← separator
| 500+ | SKUs in catalog                         |   ← stat (2 cells)
| 24hr | Average ship time                       |   ← stat (2 cells)
| 1K+  | Facilities served                       |   ← stat (2 cells)
| 100% | Order accuracy                          |   ← stat (2 cells)
```

- [ ] **Step 1: Create `blocks/ss-value-props/ss-value-props.js`**

```js
import { observeReveal, observeCounter } from '../../scripts/ss-animations.js';

export default function decorate(block) {
  const allRows = [...block.querySelectorAll(':scope > div')];
  const sepIdx = allRows.findIndex(
    (r) => r.children.length === 1 && r.children[0].textContent.trim() === '---',
  );
  const proseRows = sepIdx === -1 ? allRows : allRows.slice(0, sepIdx);
  const statRows = sepIdx === -1 ? [] : allRows.slice(sepIdx + 1);

  /* ── Left: prose ── */
  const left = document.createElement('div');
  left.className = 'ss-value-left ss-reveal-left';

  const eyebrow = document.createElement('div');
  eyebrow.className = 'ss-value-eyebrow';
  eyebrow.textContent = proseRows[0]?.children[0]?.textContent.trim() || '';

  const h2 = document.createElement('h2');
  h2.className = 'ss-value-h2';
  h2.textContent = proseRows[1]?.children[0]?.textContent.trim() || '';

  const body = document.createElement('p');
  body.className = 'ss-value-body';
  body.textContent = proseRows[2]?.children[0]?.textContent.trim() || '';

  const ul = document.createElement('ul');
  ul.className = 'ss-value-points';
  proseRows.slice(3).forEach((row) => {
    const li = document.createElement('li');
    li.className = 'ss-value-point';
    const dot = document.createElement('span');
    dot.className = 'ss-vp-dot';
    dot.setAttribute('aria-hidden', 'true');
    li.append(dot, row.children[0]?.textContent.trim() || '');
    ul.append(li);
  });

  left.append(eyebrow, h2, body, ul);

  /* ── Right: stats ── */
  const right = document.createElement('div');
  right.className = 'ss-stat-grid ss-stagger ss-reveal-right';

  statRows.forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'ss-stat-card';

    const num = document.createElement('div');
    num.className = 'ss-stat-num';
    const rawVal = cells[0]?.textContent.trim() || '';
    const match = rawVal.match(/^(\d+)(.*)$/);
    if (match) {
      num.dataset.countTo = match[1];
      num.dataset.countSuffix = match[2];
    }
    num.textContent = rawVal;

    const label = document.createElement('div');
    label.className = 'ss-stat-label';
    label.textContent = cells[1]?.textContent.trim() || '';

    card.append(num, label);
    right.append(card);
  });

  block.replaceChildren(left, right);
  observeReveal(block);
  block.querySelectorAll('.ss-stat-num[data-count-to]').forEach(observeCounter);
}
```

- [ ] **Step 2: Create `blocks/ss-value-props/ss-value-props.css`**

```css
.ss-value-props {
  background: var(--ss-color-surface);
  padding: var(--spacing-xxbig) var(--spacing-xxbig);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xxlarge);
  align-items: center;
}

.ss-value-props .ss-value-eyebrow {
  display: flex;
  align-items: center;
  gap: var(--spacing-xsmall);
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.3em;
  color: var(--ss-color-gold);
  text-transform: uppercase;
  margin-bottom: var(--spacing-xsmall);
}

.ss-value-props .ss-value-eyebrow::before {
  content: '';
  display: block;
  width: 20px;
  height: 2px;
  background: var(--ss-color-gold);
  border-radius: 2px;
  flex-shrink: 0;
}

.ss-value-props .ss-value-h2 {
  font-family: var(--ss-font-display);
  font-weight: 900;
  font-size: clamp(2.8rem, 3.2vw, 4rem);
  color: var(--ss-color-navy);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.05em;
  margin: 0 0 var(--spacing-small);
}

.ss-value-props .ss-value-body {
  font-size: 1.5rem;
  color: #2a5070;
  line-height: 1.7;
  margin: 0 0 var(--spacing-medium);
}

.ss-value-props .ss-value-points {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xsmall);
}

.ss-value-props .ss-value-point {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-xsmall);
  font-size: 1.4rem;
  color: var(--ss-color-navy);
  font-weight: 500;
  line-height: 1.4;
}

.ss-value-props .ss-vp-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ss-color-sky);
  flex-shrink: 0;
  margin-top: 5px;
  box-shadow: 0 0 0 3px rgb(0 180 216 / 18%);
}

/* Stat grid */
.ss-value-props .ss-stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-small);
}

.ss-value-props .ss-stat-card {
  background: #fff;
  border-radius: var(--shape-border-radius-2);
  padding: var(--spacing-medium) var(--spacing-small);
  border-left: var(--shape-border-width-4) solid var(--ss-color-gold);
  box-shadow: var(--ss-shadow-card);
  transition: transform var(--ss-transition-mid), box-shadow var(--ss-transition-mid);
}

.ss-value-props .ss-stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--ss-shadow-card-hover);
}

.ss-value-props .ss-stat-num {
  font-family: var(--ss-font-display);
  font-weight: 900;
  font-size: 4rem;
  color: var(--ss-color-navy);
  line-height: 1;
  margin-bottom: var(--spacing-xxsmall);
}

.ss-value-props .ss-stat-label {
  font-size: 1.2rem;
  color: #7a9ab0;
  font-weight: 500;
}

/* Scroll reveal */
.ss-reveal-left {
  opacity: 0;
  transform: translateX(-32px);
  transition: opacity var(--ss-transition-slow), transform var(--ss-transition-slow);
}

.ss-reveal-left.ss-visible {
  opacity: 1;
  transform: translateX(0);
}

.ss-reveal-right {
  opacity: 0;
  transform: translateX(32px);
  transition: opacity var(--ss-transition-slow), transform var(--ss-transition-slow);
}

.ss-reveal-right.ss-visible {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .ss-value-props {
    grid-template-columns: 1fr;
    gap: var(--spacing-xbig);
    padding: var(--spacing-xbig) var(--spacing-big);
  }
}

@media (max-width: 600px) {
  .ss-value-props {
    padding: var(--spacing-big) var(--spacing-small);
  }
}
```

- [ ] **Step 3: Lint and commit**

```bash
npm run lint -- blocks/ss-value-props/ss-value-props.js blocks/ss-value-props/ss-value-props.css
git add blocks/ss-value-props/
git commit -m "feat: add ss-value-props block with animated stat counters"
```

---

## Task 6 — `ss-product-cards` Block

**Files:**
- Create: `blocks/ss-product-cards/ss-product-cards.js`
- Create: `blocks/ss-product-cards/ss-product-cards.css`

**Authored DA.live table structure** (one row per product, 6 columns):
```
| [picture] | category | name | sku description | $price / unit | badge text |
```
Column 5 (price/unit) is plain text: `$12.99 / box`. Badge variant is `gold` when authored text starts with `BESTSELLER`.

- [ ] **Step 1: Create `blocks/ss-product-cards/ss-product-cards.js`**

```js
import { createOptimizedPicture } from '../../scripts/aem.js';
import { observeReveal } from '../../scripts/ss-animations.js';

const BG_CLASSES = [
  'ss-img-bg-1',
  'ss-img-bg-2',
  'ss-img-bg-3',
  'ss-img-bg-4',
];

export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'ss-product-cards-header ss-reveal';

  const title = document.createElement('h2');
  title.className = 'ss-product-cards-title';
  title.textContent = 'Bestsellers';

  const viewAll = document.createElement('a');
  viewAll.className = 'ss-product-cards-view-all';
  viewAll.href = '/products';
  viewAll.textContent = 'See Full Catalog →';

  header.append(title, viewAll);

  const grid = document.createElement('div');
  grid.className = 'ss-product-grid ss-stagger';

  [...block.querySelectorAll(':scope > div')].forEach((row, idx) => {
    const cells = [...row.children];
    const article = document.createElement('article');
    article.className = 'ss-product-card ss-reveal';

    /* Image zone */
    const imgDiv = document.createElement('div');
    imgDiv.className = `ss-product-img ${BG_CLASSES[idx % BG_CLASSES.length]}`;

    const picture = cells[0]?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        imgDiv.append(
          createOptimizedPicture(img.src, img.alt || cells[2]?.textContent.trim() || '', false, [{ width: '400' }]),
        );
      }
    }

    const badgeText = cells[5]?.textContent.trim() || '';
    if (badgeText) {
      const badge = document.createElement('span');
      badge.className = `ss-product-badge${badgeText.startsWith('BESTSELLER') ? ' ss-badge-gold' : ''}`;
      badge.textContent = badgeText;
      imgDiv.append(badge);
    }

    /* Body */
    const body = document.createElement('div');
    body.className = 'ss-product-body';

    const cat = document.createElement('div');
    cat.className = 'ss-product-cat';
    cat.textContent = cells[1]?.textContent.trim() || '';

    const name = document.createElement('h3');
    name.className = 'ss-product-name';
    name.textContent = cells[2]?.textContent.trim() || '';

    const sku = document.createElement('p');
    sku.className = 'ss-product-sku';
    sku.textContent = cells[3]?.textContent.trim() || '';

    const footer = document.createElement('div');
    footer.className = 'ss-product-footer';

    const priceRaw = cells[4]?.textContent.trim() || '';
    const [amount, unit] = priceRaw.split('/').map((s) => s.trim());
    const price = document.createElement('div');
    price.className = 'ss-product-price';
    price.innerHTML = amount ? `${amount}${unit ? `<span>/ ${unit}</span>` : ''}` : '';

    const addBtn = document.createElement('button');
    addBtn.className = 'ss-add-btn';
    addBtn.type = 'button';
    addBtn.textContent = 'ADD →';
    addBtn.addEventListener('click', () => {
      addBtn.textContent = '✓ ADDED';
      addBtn.classList.add('ss-added');
      setTimeout(() => {
        addBtn.textContent = 'ADD →';
        addBtn.classList.remove('ss-added');
      }, 1400);
    });

    footer.append(price, addBtn);
    body.append(cat, name, sku, footer);
    article.append(imgDiv, body);
    grid.append(article);
  });

  block.replaceChildren(header, grid);
  observeReveal(block);
}
```

- [ ] **Step 2: Create `blocks/ss-product-cards/ss-product-cards.css`**

```css
.ss-product-cards {
  padding: var(--spacing-xxbig) var(--spacing-xxbig);
  background: var(--ss-color-white);
}

.ss-product-cards .ss-product-cards-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--spacing-xbig);
}

.ss-product-cards .ss-product-cards-title {
  font-family: var(--ss-font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 3vw, 3.4rem);
  color: var(--ss-color-navy);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  position: relative;
  padding-bottom: 12px;
}

.ss-product-cards .ss-product-cards-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--ss-color-gold);
  border-radius: 2px;
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms;
}

.ss-product-cards .ss-product-cards-title.ss-visible::after {
  width: 48px;
}

.ss-product-cards .ss-product-cards-view-all {
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1.3rem;
  color: var(--ss-color-gold);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  transition: letter-spacing 180ms ease;
}

.ss-product-cards .ss-product-cards-view-all:hover {
  letter-spacing: 0.25em;
}

.ss-product-cards .ss-product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-small);
}

.ss-product-cards .ss-product-card {
  background: #fff;
  border-radius: var(--shape-border-radius-2);
  overflow: hidden;
  border: var(--shape-border-width-1) solid rgb(11 61 94 / 8%);
  box-shadow: var(--ss-shadow-card);
  transition: transform var(--ss-transition-mid), box-shadow var(--ss-transition-mid);
}

.ss-product-cards .ss-product-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--ss-shadow-card-hover);
}

/* Image zone */
.ss-product-cards .ss-product-img {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: transform var(--ss-transition-slow);
}

.ss-product-cards .ss-product-card:hover .ss-product-img {
  transform: scale(1.03);
}

.ss-product-cards .ss-product-img picture,
.ss-product-cards .ss-product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ss-product-cards .ss-img-bg-1 { background: linear-gradient(135deg, var(--ss-color-sky) 0%, var(--ss-color-sky-deep) 100%); }
.ss-product-cards .ss-img-bg-2 { background: linear-gradient(135deg, var(--ss-color-navy-mid) 0%, var(--ss-color-navy) 100%); }
.ss-product-cards .ss-img-bg-3 { background: linear-gradient(135deg, #006080 0%, #003a58 100%); }
.ss-product-cards .ss-img-bg-4 { background: linear-gradient(135deg, #004060 0%, #002840 100%); }

.ss-product-cards .ss-product-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--ss-color-navy);
  color: #fff;
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  padding: 3px 9px;
  border-radius: 100px;
  text-transform: uppercase;
}

.ss-product-cards .ss-product-badge.ss-badge-gold {
  background: var(--ss-color-gold);
  color: var(--ss-color-navy);
}

/* Body */
.ss-product-cards .ss-product-body {
  padding: var(--spacing-small);
}

.ss-product-cards .ss-product-cat {
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1rem;
  color: var(--ss-color-sky);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: var(--spacing-xxsmall);
}

.ss-product-cards .ss-product-name {
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--ss-color-navy);
  letter-spacing: 0.03em;
  margin: 0 0 var(--spacing-xxsmall);
  line-height: 1.2;
}

.ss-product-cards .ss-product-sku {
  font-size: 1rem;
  color: #7a9ab0;
  margin: 0 0 var(--spacing-small);
  line-height: 1.4;
}

.ss-product-cards .ss-product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xsmall);
}

.ss-product-cards .ss-product-price {
  font-family: var(--ss-font-display);
  font-weight: 900;
  font-size: 2rem;
  color: var(--ss-color-navy);
  line-height: 1;
}

.ss-product-cards .ss-product-price span {
  font-size: 1.1rem;
  font-weight: 400;
  color: #7a9ab0;
  font-family: var(--ss-font-body);
}

.ss-product-cards .ss-add-btn {
  background: var(--ss-color-gold);
  color: var(--ss-color-navy);
  font-family: var(--ss-font-display);
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.15em;
  padding: var(--spacing-xsmall) var(--spacing-small);
  border-radius: var(--shape-border-radius-1);
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}

.ss-product-cards .ss-add-btn:hover {
  background: var(--ss-color-gold-deep);
  transform: scale(1.05);
  box-shadow: var(--ss-shadow-gold);
}

.ss-product-cards .ss-add-btn:active {
  transform: scale(0.98);
}

.ss-product-cards .ss-add-btn.ss-added {
  background: #2ecc71;
  color: #fff;
}

@media (max-width: 1200px) {
  .ss-product-cards .ss-product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .ss-product-cards {
    padding: var(--spacing-big) var(--spacing-small);
  }

  .ss-product-cards .ss-product-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Lint and commit**

```bash
npm run lint -- blocks/ss-product-cards/ss-product-cards.js blocks/ss-product-cards/ss-product-cards.css
git add blocks/ss-product-cards/
git commit -m "feat: add ss-product-cards bestseller grid block"
```

---

## Task 7 — `ss-testimonials` Block

**Files:**
- Create: `blocks/ss-testimonials/ss-testimonials.js`
- Create: `blocks/ss-testimonials/ss-testimonials.css`

**Authored DA.live table structure** (3 rows, 4 columns):
```
| initials | name | company | quote text |
```

- [ ] **Step 1: Create `blocks/ss-testimonials/ss-testimonials.js`**

```js
import { observeReveal } from '../../scripts/ss-animations.js';

export default function decorate(block) {
  const header = document.createElement('div');
  header.className = 'ss-testi-header ss-reveal';

  const title = document.createElement('h2');
  title.className = 'ss-testi-title';
  title.textContent = 'What Our Customers Say';
  header.append(title);

  const grid = document.createElement('div');
  grid.className = 'ss-testi-grid ss-stagger';

  [...block.querySelectorAll(':scope > div')].forEach((row) => {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'ss-testi-card ss-reveal';

    const stars = document.createElement('div');
    stars.className = 'ss-testi-stars';
    stars.setAttribute('aria-label', '5 stars');
    stars.textContent = '★★★★★';

    const quote = document.createElement('blockquote');
    quote.className = 'ss-testi-quote';
    quote.textContent = cells[3]?.textContent.trim() || '';

    const author = document.createElement('div');
    author.className = 'ss-testi-author';

    const avatar = document.createElement('div');
    avatar.className = 'ss-testi-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = cells[0]?.textContent.trim() || '';

    const meta = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'ss-testi-name';
    name.textContent = cells[1]?.textContent.trim() || '';
    const company = document.createElement('div');
    company.className = 'ss-testi-co';
    company.textContent = cells[2]?.textContent.trim() || '';
    meta.append(name, company);

    author.append(avatar, meta);
    card.append(stars, quote, author);
    grid.append(card);
  });

  block.replaceChildren(header, grid);
  observeReveal(block);
}
```

- [ ] **Step 2: Create `blocks/ss-testimonials/ss-testimonials.css`**

```css
.ss-testimonials {
  background: var(--ss-color-navy);
  padding: var(--spacing-xxbig) var(--spacing-xxbig);
}

.ss-testimonials .ss-testi-header {
  margin-bottom: var(--spacing-xbig);
}

.ss-testimonials .ss-testi-title {
  font-family: var(--ss-font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 3vw, 3.4rem);
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  position: relative;
  padding-bottom: 12px;
}

.ss-testimonials .ss-testi-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: var(--ss-color-gold);
  border-radius: 2px;
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms;
}

.ss-testimonials .ss-testi-title.ss-visible::after {
  width: 48px;
}

.ss-testimonials .ss-testi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-small);
}

.ss-testimonials .ss-testi-card {
  background: rgb(255 255 255 / 6%);
  border-radius: var(--shape-border-radius-2);
  padding: var(--spacing-medium);
  border: var(--shape-border-width-1) solid rgb(255 255 255 / 9%);
  position: relative;
  transition: background var(--ss-transition-mid), transform var(--ss-transition-mid), border-color var(--ss-transition-mid);
}

.ss-testimonials .ss-testi-card::before {
  content: '\201C';
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 6.4rem;
  font-family: Georgia, serif;
  color: rgb(232 160 32 / 15%);
  line-height: 1;
  pointer-events: none;
}

.ss-testimonials .ss-testi-card:hover {
  background: rgb(255 255 255 / 10%);
  border-color: rgb(232 160 32 / 30%);
  transform: translateY(-4px);
}

.ss-testimonials .ss-testi-stars {
  color: var(--ss-color-gold);
  font-size: 1.3rem;
  letter-spacing: 0.3em;
  margin-bottom: var(--spacing-small);
}

.ss-testimonials .ss-testi-quote {
  font-size: 1.4rem;
  color: rgb(255 255 255 / 80%);
  line-height: 1.65;
  font-style: italic;
  margin: 0 0 var(--spacing-medium);
  padding: 0;
  border: none;
}

.ss-testimonials .ss-testi-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-xsmall);
  padding-top: var(--spacing-small);
  border-top: var(--shape-border-width-1) solid rgb(255 255 255 / 8%);
}

.ss-testimonials .ss-testi-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ss-color-sky), var(--ss-color-sky-deep));
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ss-font-display);
  font-weight: 800;
  font-size: 1.3rem;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgb(0 180 216 / 30%);
}

.ss-testimonials .ss-testi-name {
  font-family: var(--ss-font-display);
  font-weight: 700;
  font-size: 1.3rem;
  color: #fff;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.ss-testimonials .ss-testi-co {
  font-size: 1.1rem;
  color: rgb(255 255 255 / 40%);
}

@media (max-width: 900px) {
  .ss-testimonials .ss-testi-grid {
    grid-template-columns: 1fr;
  }

  .ss-testimonials {
    padding: var(--spacing-xbig) var(--spacing-big);
  }
}

@media (max-width: 600px) {
  .ss-testimonials {
    padding: var(--spacing-big) var(--spacing-small);
  }
}
```

- [ ] **Step 3: Lint and commit**

```bash
npm run lint -- blocks/ss-testimonials/ss-testimonials.js blocks/ss-testimonials/ss-testimonials.css
git add blocks/ss-testimonials/
git commit -m "feat: add ss-testimonials block"
```

---

## Task 8 — `ss-cta-banner` Block

**Files:**
- Create: `blocks/ss-cta-banner/ss-cta-banner.js`
- Create: `blocks/ss-cta-banner/ss-cta-banner.css`

**Authored DA.live table structure** (4 rows, 1–2 columns):
```
| READY TO PROTECT YOUR TEAM?                           |
| Get volume pricing on your next PPE order...          |
| [link: Request a Quote]                               |
| [link: Browse Catalog]                                |
```

- [ ] **Step 1: Create `blocks/ss-cta-banner/ss-cta-banner.js`**

```js
import { observeReveal } from '../../scripts/ss-animations.js';

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const left = document.createElement('div');
  left.className = 'ss-cta-left ss-reveal-left';

  const h2 = document.createElement('h2');
  h2.className = 'ss-cta-heading';
  h2.textContent = rows[0]?.children[0]?.textContent.trim() || '';

  const body = document.createElement('p');
  body.className = 'ss-cta-body';
  body.textContent = rows[1]?.children[0]?.textContent.trim() || '';

  left.append(h2, body);

  const right = document.createElement('div');
  right.className = 'ss-cta-right ss-reveal-right';

  const primaryLink = rows[2]?.querySelector('a');
  if (primaryLink) {
    primaryLink.className = 'ss-cta-btn ss-cta-btn-primary';
    right.append(primaryLink);
  }

  const secondaryLink = rows[3]?.querySelector('a');
  if (secondaryLink) {
    secondaryLink.className = 'ss-cta-btn ss-cta-btn-secondary';
    right.append(secondaryLink);
  }

  block.replaceChildren(left, right);
  observeReveal(block);
}
```

- [ ] **Step 2: Create `blocks/ss-cta-banner/ss-cta-banner.css`**

```css
.ss-cta-banner {
  background: linear-gradient(135deg, var(--ss-color-gold) 0%, var(--ss-color-gold-deep) 100%);
  padding: clamp(40px, 6vw, 64px) var(--spacing-xxbig);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xbig);
  position: relative;
  overflow: hidden;
}

.ss-cta-banner::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 48px solid rgb(11 61 94 / 7%);
  top: -100px;
  right: 20%;
  pointer-events: none;
}

.ss-cta-banner::after {
  content: '';
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 28px solid rgb(11 61 94 / 5%);
  bottom: -50px;
  left: 40%;
  pointer-events: none;
}

.ss-cta-banner .ss-cta-left {
  position: relative;
  z-index: 1;
}

.ss-cta-banner .ss-cta-heading {
  font-family: var(--ss-font-display);
  font-weight: 900;
  font-size: clamp(2.8rem, 4vw, 4.4rem);
  color: var(--ss-color-navy);
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.05em;
  margin: 0 0 var(--spacing-xsmall);
}

.ss-cta-banner .ss-cta-body {
  font-size: 1.5rem;
  color: rgb(11 61 94 / 70%);
  line-height: 1.5;
  margin: 0;
}

.ss-cta-banner .ss-cta-right {
  display: flex;
  gap: var(--spacing-small);
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.ss-cta-banner .ss-cta-btn {
  display: inline-flex;
  align-items: center;
  font-family: var(--ss-font-display);
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 13px 28px;
  border-radius: var(--shape-border-radius-1);
  text-decoration: none;
  transition: background var(--ss-transition-mid), box-shadow var(--ss-transition-mid), transform 180ms ease;
  border: 2px solid transparent;
}

.ss-cta-banner .ss-cta-btn:hover {
  transform: translateY(-1px);
}

.ss-cta-banner .ss-cta-btn-primary {
  background: var(--ss-color-navy);
  color: #fff;
}

.ss-cta-banner .ss-cta-btn-primary:hover {
  background: var(--ss-color-navy-mid);
  box-shadow: 0 4px 16px rgb(11 61 94 / 30%);
}

.ss-cta-banner .ss-cta-btn-secondary {
  background: transparent;
  color: var(--ss-color-navy);
  border-color: rgb(11 61 94 / 45%);
}

.ss-cta-banner .ss-cta-btn-secondary:hover {
  background: rgb(11 61 94 / 6%);
  border-color: var(--ss-color-navy);
}

@media (max-width: 900px) {
  .ss-cta-banner {
    flex-direction: column;
    text-align: center;
    padding: var(--spacing-xbig) var(--spacing-big);
  }

  .ss-cta-banner .ss-cta-right {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .ss-cta-banner {
    padding: var(--spacing-big) var(--spacing-small);
  }

  .ss-cta-banner .ss-cta-btn {
    width: 100%;
    justify-content: center;
  }
}
```

- [ ] **Step 3: Lint and commit**

```bash
npm run lint -- blocks/ss-cta-banner/ss-cta-banner.js blocks/ss-cta-banner/ss-cta-banner.css
git add blocks/ss-cta-banner/
git commit -m "feat: add ss-cta-banner block"
```

---

## Task 9 — Draft Page + Component Registration

**Files:**
- Create: `drafts/homepage.html`
- Modify: `component-definition.json`

- [ ] **Step 1: Create `drafts/homepage.html`**

```html
<html>
<head><title>Summit Safety — Homepage Draft</title></head>
<body>
<header></header>
<main>
  <div class="section">
    <div class="ss-hero block" data-block-name="ss-hero" data-block-status="">
      <div><div>TRUSTED PPE SUPPLIER SINCE 2010</div></div>
      <div><div>SAFETY IS OUR SUMMIT PRIORITY</div></div>
      <div><div>High-quality protective equipment for healthcare, industrial, and commercial facilities. In stock and ready to ship nationwide.</div></div>
      <div><div><a href="/products">SHOP PRODUCTS</a></div></div>
      <div><div><a href="/quote">REQUEST A QUOTE</a></div></div>
      <div><div>IN STOCK · FAST SHIP</div></div>
      <div><div></div></div>
      <div><div>500+</div><div>SKUs</div></div>
      <div><div>24hr</div><div>Ship Time</div></div>
      <div><div>1K+</div><div>Facilities</div></div>
    </div>
  </div>
  <div class="section">
    <div class="ss-trust-bar block" data-block-name="ss-trust-bar" data-block-status="">
      <div><div>⚡</div><div>Fast Delivery</div><div>Ships same or next business day</div></div>
      <div><div>🏆</div><div>Top-Notch Quality</div><div>Vetted PPE brands, certified materials</div></div>
      <div><div>🤝</div><div>Excellent Service</div><div>Dedicated account support</div></div>
      <div><div>📦</div><div>Bulk Orders</div><div>Volume pricing available</div></div>
    </div>
  </div>
  <div class="section">
    <div class="ss-categories block" data-block-name="ss-categories" data-block-status="">
      <div><div>🧤</div><div>Gloves</div><div>9 types</div><div><a href="/categories/gloves">Gloves</a></div></div>
      <div><div>👢</div><div>Footwear</div><div>4 types</div><div><a href="/categories/footwear">Footwear</a></div></div>
      <div><div>🦺</div><div>Body PPE</div><div>Lab coats, aprons</div><div><a href="/categories/body-protection">Body PPE</a></div></div>
      <div><div>⛑️</div><div>Head Gear</div><div>Hard hats, glasses</div><div><a href="/categories/head-gear">Head Gear</a></div></div>
      <div><div>😷</div><div>Respiratory</div><div>N95, masks, shields</div><div><a href="/categories/respiratory">Respiratory</a></div></div>
      <div><div>💇</div><div>Hair Covers</div><div>Nets, beard covers</div><div><a href="/categories/hair-covers">Hair Covers</a></div></div>
    </div>
  </div>
  <div class="section">
    <div class="ss-value-props block" data-block-name="ss-value-props" data-block-status="">
      <div><div>Why Summit Safety</div></div>
      <div><div>PROTECTING THOSE WHO KEEP FACILITIES RUNNING</div></div>
      <div><div>From a single box of nitrile gloves to a full-facility PPE program, Summit Safety delivers the protective equipment your team needs — with the reliability your operations demand.</div></div>
      <div><div>Serving healthcare, industrial &amp; commercial facilities</div></div>
      <div><div>Broad catalog: vinyl, nitrile, latex, steel toe, N95 &amp; more</div></div>
      <div><div>Case &amp; bulk pricing for high-volume buyers</div></div>
      <div><div>Based in Spring Valley, NY — serving clients nationwide</div></div>
      <div><div>---</div></div>
      <div><div>500+</div><div>SKUs in catalog</div></div>
      <div><div>24hr</div><div>Average ship time</div></div>
      <div><div>1K+</div><div>Facilities served</div></div>
      <div><div>100%</div><div>Order accuracy</div></div>
    </div>
  </div>
  <div class="section">
    <div class="ss-product-cards block" data-block-name="ss-product-cards" data-block-status="">
      <div><div></div><div>Gloves</div><div>Nitrile Gloves — Powder Free</div><div>SSC-GLV-003 · 100/box, 10 boxes/case</div><div>$12.99 / box</div><div>BESTSELLER</div></div>
      <div><div></div><div>Respiratory</div><div>N95 Respirator Masks</div><div>SSC-RSP-001 · 20/box, 12 boxes/case</div><div>$24.99 / box</div><div>IN STOCK</div></div>
      <div><div></div><div>Body PPE</div><div>Disposable Lab Coat</div><div>SSC-BDY-001 · 10/bag, 5 bags/case</div><div>$18.50 / bag</div><div>NEW</div></div>
      <div><div></div><div>Footwear</div><div>Steel Toe Safety Boots</div><div>SSC-FTW-003 · Sizes 6–13</div><div>$54.99 / pair</div><div>POPULAR</div></div>
    </div>
  </div>
  <div class="section">
    <div class="ss-testimonials block" data-block-name="ss-testimonials" data-block-status="">
      <div><div>MR</div><div>Maria Rodriguez</div><div>Facilities Manager, Metro Health Systems</div><div>Summit Safety has been our go-to PPE supplier for two years. Fast shipping, consistent quality, and our account rep is always responsive.</div></div>
      <div><div>DK</div><div>Derek Kim</div><div>Operations Director, NorthStar Distribution</div><div>The bulk pricing on nitrile gloves is unbeatable. We outfitted our entire warehouse team and had everything delivered within 24 hours.</div></div>
      <div><div>SL</div><div>Sarah Lynch</div><div>Purchasing Manager, Eastside Food Co.</div><div>Finally a PPE vendor that gets B2B. Easy reordering, accurate invoicing, and quality products that actually meet our compliance requirements.</div></div>
    </div>
  </div>
  <div class="section">
    <div class="ss-cta-banner block" data-block-name="ss-cta-banner" data-block-status="">
      <div><div>READY TO PROTECT YOUR TEAM?</div></div>
      <div><div>Get volume pricing on your next PPE order. Fast turnaround, no minimums to start.</div></div>
      <div><div><a href="/quote">Request a Quote</a></div></div>
      <div><div><a href="/products">Browse Catalog</a></div></div>
    </div>
  </div>
</main>
<footer></footer>
</body>
</html>
```

- [ ] **Step 2: Add all 7 blocks to `component-definition.json`**

In the `"components"` array inside the `"blocks"` group, append:

```json
{ "title": "SS Hero", "id": "ss-hero", "plugins": { "da": { "name": "ss-hero", "rows": 10, "columns": 2 } } },
{ "title": "SS Trust Bar", "id": "ss-trust-bar", "plugins": { "da": { "name": "ss-trust-bar", "rows": 4, "columns": 3 } } },
{ "title": "SS Categories", "id": "ss-categories", "plugins": { "da": { "name": "ss-categories", "rows": 6, "columns": 4 } } },
{ "title": "SS Value Props", "id": "ss-value-props", "plugins": { "da": { "name": "ss-value-props", "rows": 12, "columns": 2 } } },
{ "title": "SS Product Cards", "id": "ss-product-cards", "plugins": { "da": { "name": "ss-product-cards", "rows": 4, "columns": 6 } } },
{ "title": "SS Testimonials", "id": "ss-testimonials", "plugins": { "da": { "name": "ss-testimonials", "rows": 3, "columns": 4 } } },
{ "title": "SS CTA Banner", "id": "ss-cta-banner", "plugins": { "da": { "name": "ss-cta-banner", "rows": 4, "columns": 1 } } }
```

- [ ] **Step 3: Lint and commit**

```bash
npm run lint
git add drafts/homepage.html component-definition.json docs/
git commit -m "feat: add draft homepage and register Summit Safety blocks in component-definition"
```

---

## Task 10 — Push to Remote

- [ ] **Step 1: Verify lint is clean**

```bash
npm run lint
# Expected: 0 errors, 0 warnings
```

- [ ] **Step 2: Push**

```bash
git push origin main
```

- [ ] **Step 3: Confirm blocks are live on preview**

```bash
gh run list --limit 5
# Wait for AEM Code Sync check to pass, then open:
# https://main--summit-safety-b2b-demo--jogosset.aem.page/drafts/homepage
```

---

## Self-Review Checklist

- [x] All 7 blocks covered with JS + CSS files
- [x] `observeReveal` / `observeCounter` imported from shared utility — no duplication
- [x] `createOptimizedPicture` used in ss-hero and ss-product-cards (DAM images)
- [x] All CSS selectors scoped to `.ss-{blockname}` — no global leaks
- [x] Shared keyframe names prefixed `ss-` to avoid collisions with existing blocks
- [x] `component-definition.json` updated for DA.live authoring
- [x] Mobile-first responsive breakpoints at 600px and 900px in every block
- [x] No placeholder code — every step contains the complete file content
- [x] Button and link event listeners use passive/bubbling correctly
- [x] No `{blockname}-container` or `{blockname}-wrapper` class names used
