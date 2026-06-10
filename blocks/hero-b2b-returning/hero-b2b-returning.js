import { readBlockConfig } from '../../scripts/aem.js';
import {
  createElement,
  buildAnchors,
  DEFAULT_ANCHOR_NAMESPACE,
} from '../citisignal-showcase/citisignal-showcase-core.js';

function toText(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(' ');
  }
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
}

function resolveUrl(url, anchors) {
  const normalized = toText(url);
  if (!normalized) {
    return '';
  }
  if (normalized.startsWith('#')) {
    const key = normalized.slice(1).toLowerCase();
    if (anchors[key]) {
      return `#${anchors[key]}`;
    }
  }
  return normalized;
}

const DEFAULTS = {
  'anchor-namespace': DEFAULT_ANCHOR_NAMESPACE,
  'nav-brand': 'CitiSignal',
  'nav-link-1-label': 'Dashboard',
  'nav-link-1-url': '#',
  'nav-link-2-label': 'Lines',
  'nav-link-2-url': '#',
  'nav-link-3-label': 'Billing',
  'nav-link-3-url': '#',
  'nav-link-4-label': 'Support',
  'nav-link-4-url': '#',
  'nav-cta-label': 'Add a Line',
  'nav-cta-url': '#',
  'welcome-avatar-initials': 'AC',
  'welcome-company-name': 'Acme Corp',
  'hero-title-line-1': "Your team's network.",
  'hero-title-gradient': 'Optimized.',
  'hero-description': 'Manage all 48 lines from one dashboard. Add new team members, track usage, and control costs with CitiSignal Business.',
  'hero-primary-cta-label': 'Manage Account',
  'hero-primary-cta-url': '#',
  'hero-secondary-cta-label': 'Add New Lines',
  'hero-secondary-cta-url': '#',
  'dash-avatar-initials': 'AC',
  'dash-company-name': 'Acme Corp',
  'dash-plan': 'Business Unlimited+',
  'dash-badge': 'Enterprise',
  'dash-stat-1-value': '48',
  'dash-stat-1-label': 'Active Lines',
  'dash-stat-2-value': '2.1',
  'dash-stat-2-suffix': 'TB',
  'dash-stat-2-label': 'Data Used',
  'dash-stat-3-value': '$892',
  'dash-stat-3-label': 'Saved / Mo',
  'dash-line-1-icon': '\u{1F4F1}',
  'dash-line-1-name': 'Sales Team',
  'dash-line-1-count': '12 lines',
  'dash-line-1-usage': '82% used',
  'dash-line-2-icon': '\u{1F4BB}',
  'dash-line-2-name': 'Engineering',
  'dash-line-2-count': '18 lines',
  'dash-line-2-usage': '67% used',
  'dash-line-3-icon': '\u{1F3E2}',
  'dash-line-3-name': 'Operations',
  'dash-line-3-count': '18 lines',
  'dash-line-3-usage': '54% used',
  'dash-card-cta-label': 'View Full Dashboard \u2192',
  'dash-card-cta-url': '#',
};

const CONFIG_KEYS = Object.keys(DEFAULTS).filter((k) => k !== 'anchor-namespace');

function buildConfig(raw) {
  const config = { ...DEFAULTS };
  CONFIG_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      config[key] = raw[key];
    }
  });
  if (Object.prototype.hasOwnProperty.call(raw, 'anchor-namespace')) {
    config['anchor-namespace'] = toText(raw['anchor-namespace']) || DEFAULT_ANCHOR_NAMESPACE;
  }
  return config;
}

function createCtaLink(label, url, anchors, className) {
  const text = toText(label);
  const href = resolveUrl(url, anchors);
  if (!text || !href) {
    return null;
  }
  return createElement('a', {
    className,
    text,
    attrs: { href },
  });
}

function createLogoIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('aria-hidden', 'true');
  [['M4 12V8'], ['M8 12V4'], ['M12 12V6']].forEach(([d]) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('stroke', '#fff');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    svg.append(path);
  });
  return svg;
}

function paintHeroCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  const blobs = [
    {
      x: 0.15, y: 0.3, r: 0.35, c: [224, 215, 250],
    },
    {
      x: 0.8, y: 0.45, r: 0.4, c: [196, 224, 249],
    },
    {
      x: 0.5, y: 0.85, r: 0.25, c: [209, 250, 229],
    },
    {
      x: 0.85, y: 0.15, r: 0.3, c: [237, 220, 255],
    },
  ];

  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = '#FAFAF7';
  ctx.fillRect(0, 0, w, h);
  blobs.forEach((b) => {
    const cx = w * b.x;
    const cy = h * b.y;
    const r = Math.min(w, h) * b.r;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(${b.c.join(',')},.35)`);
    g.addColorStop(0.5, `rgba(${b.c.join(',')},.1)`);
    g.addColorStop(1, `rgba(${b.c.join(',')},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

function initHeroCanvas(canvas) {
  const resize = () => {
    const { offsetWidth, offsetHeight } = canvas;
    if (!offsetWidth || !offsetHeight) {
      return;
    }
    canvas.width = offsetWidth;
    canvas.height = offsetHeight;
    paintHeroCanvas(canvas);
  };

  resize();
  const parent = canvas.parentElement || canvas;
  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(resize);
    ro.observe(parent);
  } else {
    window.addEventListener('resize', resize);
  }
}

function buildReturningHero(config, anchors) {
  const root = createElement('div', { className: 'cb2br-welcome' });

  const nav = createElement('nav', {
    className: 'cb2br-nav',
    attrs: { 'aria-label': 'Primary' },
  });
  const navInner = createElement('div', { className: 'cb2br-nav-inner' });
  const logoLink = createElement('a', {
    className: 'cb2br-nav-logo',
    attrs: { href: resolveUrl('#', anchors) || '#' },
  });
  const logoIcon = createElement('span', {
    className: 'cb2br-logo-icon',
    attrs: { 'aria-hidden': 'true' },
  });
  logoIcon.append(createLogoIcon());
  logoLink.append(logoIcon);
  logoLink.append(document.createTextNode(toText(config['nav-brand'])));
  navInner.append(logoLink);

  const navLinks = createElement('div', { className: 'cb2br-nav-links' });
  [1, 2, 3, 4].forEach((i) => {
    const label = toText(config[`nav-link-${i}-label`]);
    const href = resolveUrl(config[`nav-link-${i}-url`], anchors);
    if (!label || !href) {
      return;
    }
    navLinks.append(createElement('a', {
      className: 'cb2br-nav-link',
      text: label,
      attrs: { href },
    }));
  });
  const navCta = createCtaLink(
    config['nav-cta-label'],
    config['nav-cta-url'],
    anchors,
    'cb2br-nav-cta',
  );
  if (navCta) {
    navLinks.append(navCta);
  }
  navInner.append(navLinks);
  nav.append(navInner);
  root.append(nav);

  const hero = createElement('section', {
    className: 'cb2br-hero',
    attrs: { 'aria-labelledby': 'cb2br-hero-heading' },
  });
  const heroBg = createElement('div', {
    className: 'cb2br-hero-bg',
    attrs: { 'aria-hidden': 'true' },
  });
  const canvas = createElement('canvas', { className: 'cb2br-hero-canvas' });
  heroBg.append(canvas);
  heroBg.append(createElement('div', { className: 'cb2br-hero-dots' }));
  hero.append(heroBg);

  const split = createElement('div', { className: 'cb2br-container cb2br-hero-split' });

  const left = createElement('div', { className: 'cb2br-hero-left' });
  const welcomeBar = createElement('div', { className: 'cb2br-welcome-bar' });
  welcomeBar.append(createElement('div', {
    className: 'cb2br-welcome-avatar',
    text: toText(config['welcome-avatar-initials']),
  }));
  const welcomeText = createElement('div', { className: 'cb2br-welcome-text' });
  welcomeText.append(document.createTextNode('Welcome back, '));
  welcomeText.append(createElement('strong', { text: toText(config['welcome-company-name']) }));
  welcomeBar.append(welcomeText);
  left.append(welcomeBar);

  const h1 = createElement('h1', {
    className: 'cb2br-hero-title',
    attrs: { id: 'cb2br-hero-heading' },
  });
  h1.append(document.createTextNode(toText(config['hero-title-line-1'])));
  h1.append(document.createElement('br'));
  h1.append(createElement('span', {
    className: 'cb2br-gradient-text',
    text: toText(config['hero-title-gradient']),
  }));
  left.append(h1);

  left.append(createElement('p', {
    className: 'cb2br-hero-desc',
    text: toText(config['hero-description']),
  }));

  const btnRow = createElement('div', { className: 'cb2br-hero-buttons' });
  const primary = createCtaLink(
    config['hero-primary-cta-label'],
    config['hero-primary-cta-url'],
    anchors,
    'cb2br-btn cb2br-btn--primary',
  );
  const secondary = createCtaLink(
    config['hero-secondary-cta-label'],
    config['hero-secondary-cta-url'],
    anchors,
    'cb2br-btn cb2br-btn--ghost',
  );
  if (primary) {
    const primaryLabel = toText(config['hero-primary-cta-label']);
    primary.textContent = '';
    primary.append(createElement('span', { text: primaryLabel }));
    btnRow.append(primary);
  }
  if (secondary) {
    btnRow.append(secondary);
  }
  if (btnRow.children.length) {
    left.append(btnRow);
  }
  split.append(left);

  const right = createElement('div', { className: 'cb2br-hero-right' });
  const dash = createElement('div', { className: 'cb2br-account-dash' });
  const dashHeader = createElement('div', { className: 'cb2br-dash-header' });
  const dhLeft = createElement('div', { className: 'cb2br-dh-left' });
  dhLeft.append(createElement('div', {
    className: 'cb2br-dh-avatar',
    text: toText(config['dash-avatar-initials']),
  }));
  const dhMeta = createElement('div');
  dhMeta.append(createElement('div', {
    className: 'cb2br-dh-name',
    text: toText(config['dash-company-name']),
  }));
  dhMeta.append(createElement('div', {
    className: 'cb2br-dh-plan',
    text: toText(config['dash-plan']),
  }));
  dhLeft.append(dhMeta);
  dashHeader.append(dhLeft);
  dashHeader.append(createElement('div', {
    className: 'cb2br-dash-badge',
    text: toText(config['dash-badge']),
  }));
  dash.append(dashHeader);

  const stats = createElement('div', { className: 'cb2br-dash-stats' });
  const stat1 = createElement('div', { className: 'cb2br-ds' });
  stat1.append(createElement('div', {
    className: 'cb2br-ds-val cb2br-ds-val--purple',
    text: toText(config['dash-stat-1-value']),
  }));
  stat1.append(createElement('div', {
    className: 'cb2br-ds-label',
    text: toText(config['dash-stat-1-label']),
  }));
  stats.append(stat1);

  const stat2 = createElement('div', { className: 'cb2br-ds' });
  const stat2Val = createElement('div', { className: 'cb2br-ds-val cb2br-ds-val--cyan' });
  stat2Val.append(document.createTextNode(toText(config['dash-stat-2-value'])));
  const suffix = toText(config['dash-stat-2-suffix']);
  if (suffix) {
    stat2Val.append(createElement('span', {
      className: 'cb2br-ds-suffix',
      text: ` ${suffix}`,
    }));
  }
  stat2.append(stat2Val);
  stat2.append(createElement('div', {
    className: 'cb2br-ds-label',
    text: toText(config['dash-stat-2-label']),
  }));
  stats.append(stat2);

  const stat3 = createElement('div', { className: 'cb2br-ds' });
  stat3.append(createElement('div', {
    className: 'cb2br-ds-val cb2br-ds-val--green',
    text: toText(config['dash-stat-3-value']),
  }));
  stat3.append(createElement('div', {
    className: 'cb2br-ds-label',
    text: toText(config['dash-stat-3-label']),
  }));
  stats.append(stat3);
  dash.append(stats);

  const linesWrap = createElement('div', { className: 'cb2br-dash-lines' });
  for (let i = 1; i <= 3; i += 1) {
    const row = createElement('div', { className: 'cb2br-dl' });
    const dlLeft = createElement('div', { className: 'cb2br-dl-left' });
    dlLeft.append(createElement('div', {
      className: 'cb2br-dl-icon',
      text: toText(config[`dash-line-${i}-icon`]),
      attrs: { 'aria-hidden': 'true' },
    }));
    const dlText = createElement('div');
    dlText.append(createElement('div', {
      className: 'cb2br-dl-name',
      text: toText(config[`dash-line-${i}-name`]),
    }));
    dlText.append(createElement('div', {
      className: 'cb2br-dl-number',
      text: toText(config[`dash-line-${i}-count`]),
    }));
    dlLeft.append(dlText);
    row.append(dlLeft);
    row.append(createElement('div', {
      className: 'cb2br-dl-usage',
      text: toText(config[`dash-line-${i}-usage`]),
    }));
    linesWrap.append(row);
  }
  dash.append(linesWrap);

  const dashCta = createCtaLink(
    config['dash-card-cta-label'],
    config['dash-card-cta-url'],
    anchors,
    'cb2br-dash-cta',
  );
  if (dashCta) {
    dash.append(dashCta);
  }

  right.append(dash);
  split.append(right);
  hero.append(split);
  root.append(hero);

  return { root, canvas };
}

export default function decorate(block) {
  const raw = readBlockConfig(block);
  const config = buildConfig(raw);
  const instanceId = toText(config['anchor-namespace']) || DEFAULT_ANCHOR_NAMESPACE;
  const anchors = buildAnchors(instanceId);

  const { root, canvas } = buildReturningHero(config, anchors);
  block.replaceChildren(root);

  if (canvas) {
    initHeroCanvas(canvas);
  }
}
