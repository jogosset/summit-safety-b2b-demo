import { readBlockConfig } from '../../scripts/aem.js';
import {
  buildFieldSources,
  createElement,
  buildAnchors,
  DEFAULT_ANCHOR_NAMESPACE,
  ensureBlockInstrumentation,
  instrumentElement,
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
  'hero-title-line-1': 'Your team\'s network.',
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
  'dash-line-1-icon': '📱',
  'dash-line-1-name': 'Sales Team',
  'dash-line-1-count': '12 lines',
  'dash-line-1-usage': '82% used',
  'dash-line-2-icon': '💻',
  'dash-line-2-name': 'Engineering',
  'dash-line-2-count': '18 lines',
  'dash-line-2-usage': '67% used',
  'dash-line-3-icon': '🏢',
  'dash-line-3-name': 'Operations',
  'dash-line-3-count': '18 lines',
  'dash-line-3-usage': '54% used',
  'dash-card-cta-label': 'View Full Dashboard →',
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

function createEditableElement(tagName, options, prop, fieldSources) {
  return instrumentElement(createElement(tagName, options), prop, fieldSources);
}

function createCtaLink(label, url, anchors, className, prop, fieldSources) {
  const text = toText(label);
  const href = resolveUrl(url, anchors);
  if (!text || !href) {
    return null;
  }
  return createEditableElement('a', {
    className,
    text,
    attrs: { href },
  }, prop, fieldSources);
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

function buildWelcomeHero(config, anchors, fieldSources) {
  const root = createElement('div', { className: 'cb2b-welcome' });

  const nav = createElement('nav', {
    className: 'cb2b-nav',
    attrs: { 'aria-label': 'Primary' },
  });
  const navInner = createElement('div', { className: 'cb2b-nav-inner' });
  const logoLink = createElement('a', {
    className: 'cb2b-nav-logo',
    attrs: { href: resolveUrl('#', anchors) || '#' },
  });
  instrumentElement(logoLink, 'nav-brand', fieldSources);
  const logoIcon = createElement('span', {
    className: 'cb2b-logo-icon',
    attrs: { 'aria-hidden': 'true' },
  });
  logoIcon.append(createLogoIcon());
  logoLink.append(logoIcon);
  logoLink.append(document.createTextNode(toText(config['nav-brand'])));
  navInner.append(logoLink);

  const navLinks = createElement('div', { className: 'cb2b-nav-links' });
  [1, 2, 3, 4].forEach((i) => {
    const label = toText(config[`nav-link-${i}-label`]);
    const href = resolveUrl(config[`nav-link-${i}-url`], anchors);
    if (!label || !href) {
      return;
    }
    navLinks.append(createEditableElement('a', {
      className: 'cb2b-nav-link',
      text: label,
      attrs: { href },
    }, `nav-link-${i}-label`, fieldSources));
  });
  const navCta = createCtaLink(
    config['nav-cta-label'],
    config['nav-cta-url'],
    anchors,
    'cb2b-nav-cta',
    'nav-cta-label',
    fieldSources,
  );
  if (navCta) {
    navLinks.append(navCta);
  }
  navInner.append(navLinks);
  nav.append(navInner);
  root.append(nav);

  const hero = createElement('section', {
    className: 'cb2b-hero',
    attrs: { 'aria-labelledby': 'cb2b-hero-heading' },
  });
  const heroBg = createElement('div', {
    className: 'cb2b-hero-bg',
    attrs: { 'aria-hidden': 'true' },
  });
  const canvas = createElement('canvas', { className: 'cb2b-hero-canvas' });
  heroBg.append(canvas);
  heroBg.append(createElement('div', { className: 'cb2b-hero-dots' }));
  hero.append(heroBg);

  const split = createElement('div', { className: 'cb2b-container cb2b-hero-split' });

  const left = createElement('div', { className: 'cb2b-hero-left' });
  const welcomeBar = createElement('div', { className: 'cb2b-welcome-bar' });
  welcomeBar.append(createEditableElement('div', {
    className: 'cb2b-welcome-avatar',
    text: toText(config['welcome-avatar-initials']),
  }, 'welcome-avatar-initials', fieldSources));
  const welcomeText = createElement('div', { className: 'cb2b-welcome-text' });
  welcomeText.append(document.createTextNode('Welcome back, '));
  welcomeText.append(createEditableElement('strong', {
    text: toText(config['welcome-company-name']),
  }, 'welcome-company-name', fieldSources));
  welcomeBar.append(welcomeText);
  left.append(welcomeBar);

  const h1 = createElement('h1', {
    className: 'cb2b-hero-title',
    attrs: { id: 'cb2b-hero-heading' },
  });
  h1.append(createEditableElement('span', {
    text: toText(config['hero-title-line-1']),
  }, 'hero-title-line-1', fieldSources));
  h1.append(document.createElement('br'));
  h1.append(createEditableElement('span', {
    className: 'cb2b-gradient-text',
    text: toText(config['hero-title-gradient']),
  }, 'hero-title-gradient', fieldSources));
  left.append(h1);

  left.append(createEditableElement('p', {
    className: 'cb2b-hero-desc',
    text: toText(config['hero-description']),
  }, 'hero-description', fieldSources));

  const btnRow = createElement('div', { className: 'cb2b-hero-buttons' });
  const primary = createCtaLink(
    config['hero-primary-cta-label'],
    config['hero-primary-cta-url'],
    anchors,
    'cb2b-btn cb2b-btn--primary',
    'hero-primary-cta-label',
    fieldSources,
  );
  const secondary = createCtaLink(
    config['hero-secondary-cta-label'],
    config['hero-secondary-cta-url'],
    anchors,
    'cb2b-btn cb2b-btn--ghost',
    'hero-secondary-cta-label',
    fieldSources,
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

  const right = createElement('div', { className: 'cb2b-hero-right' });
  const dash = createElement('div', { className: 'cb2b-account-dash' });
  const dashHeader = createElement('div', { className: 'cb2b-dash-header' });
  const dhLeft = createElement('div', { className: 'cb2b-dh-left' });
  dhLeft.append(createEditableElement('div', {
    className: 'cb2b-dh-avatar',
    text: toText(config['dash-avatar-initials']),
  }, 'dash-avatar-initials', fieldSources));
  const dhMeta = createElement('div');
  dhMeta.append(createEditableElement('div', {
    className: 'cb2b-dh-name',
    text: toText(config['dash-company-name']),
  }, 'dash-company-name', fieldSources));
  dhMeta.append(createEditableElement('div', {
    className: 'cb2b-dh-plan',
    text: toText(config['dash-plan']),
  }, 'dash-plan', fieldSources));
  dhLeft.append(dhMeta);
  dashHeader.append(dhLeft);
  dashHeader.append(createEditableElement('div', {
    className: 'cb2b-dash-badge',
    text: toText(config['dash-badge']),
  }, 'dash-badge', fieldSources));
  dash.append(dashHeader);

  const stats = createElement('div', { className: 'cb2b-dash-stats' });
  const stat1 = createElement('div', { className: 'cb2b-ds' });
  stat1.append(createEditableElement('div', {
    className: 'cb2b-ds-val cb2b-ds-val--purple',
    text: toText(config['dash-stat-1-value']),
  }, 'dash-stat-1-value', fieldSources));
  stat1.append(createEditableElement('div', {
    className: 'cb2b-ds-label',
    text: toText(config['dash-stat-1-label']),
  }, 'dash-stat-1-label', fieldSources));
  stats.append(stat1);

  const stat2 = createElement('div', { className: 'cb2b-ds' });
  const stat2Val = createElement('div', { className: 'cb2b-ds-val cb2b-ds-val--cyan' });
  stat2Val.append(createEditableElement('span', {
    text: toText(config['dash-stat-2-value']),
  }, 'dash-stat-2-value', fieldSources));
  const suffix = toText(config['dash-stat-2-suffix']);
  if (suffix) {
    stat2Val.append(createEditableElement('span', {
      className: 'cb2b-ds-suffix',
      text: ` ${suffix}`,
    }, 'dash-stat-2-suffix', fieldSources));
  }
  stat2.append(stat2Val);
  stat2.append(createEditableElement('div', {
    className: 'cb2b-ds-label',
    text: toText(config['dash-stat-2-label']),
  }, 'dash-stat-2-label', fieldSources));
  stats.append(stat2);

  const stat3 = createElement('div', { className: 'cb2b-ds' });
  stat3.append(createEditableElement('div', {
    className: 'cb2b-ds-val cb2b-ds-val--green',
    text: toText(config['dash-stat-3-value']),
  }, 'dash-stat-3-value', fieldSources));
  stat3.append(createEditableElement('div', {
    className: 'cb2b-ds-label',
    text: toText(config['dash-stat-3-label']),
  }, 'dash-stat-3-label', fieldSources));
  stats.append(stat3);
  dash.append(stats);

  const linesWrap = createElement('div', { className: 'cb2b-dash-lines' });
  for (let i = 1; i <= 3; i += 1) {
    const row = createElement('div', { className: 'cb2b-dl' });
    const dlLeft = createElement('div', { className: 'cb2b-dl-left' });
    dlLeft.append(createEditableElement('div', {
      className: 'cb2b-dl-icon',
      text: toText(config[`dash-line-${i}-icon`]),
      attrs: { 'aria-hidden': 'true' },
    }, `dash-line-${i}-icon`, fieldSources));
    const dlText = createElement('div');
    dlText.append(createEditableElement('div', {
      className: 'cb2b-dl-name',
      text: toText(config[`dash-line-${i}-name`]),
    }, `dash-line-${i}-name`, fieldSources));
    dlText.append(createEditableElement('div', {
      className: 'cb2b-dl-number',
      text: toText(config[`dash-line-${i}-count`]),
    }, `dash-line-${i}-count`, fieldSources));
    dlLeft.append(dlText);
    row.append(dlLeft);
    row.append(createEditableElement('div', {
      className: 'cb2b-dl-usage',
      text: toText(config[`dash-line-${i}-usage`]),
    }, `dash-line-${i}-usage`, fieldSources));
    linesWrap.append(row);
  }
  dash.append(linesWrap);

  const dashCta = createCtaLink(
    config['dash-card-cta-label'],
    config['dash-card-cta-url'],
    anchors,
    'cb2b-dash-cta',
    'dash-card-cta-label',
    fieldSources,
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
  ensureBlockInstrumentation(block);
  const raw = readBlockConfig(block);
  const config = buildConfig(raw);
  const instanceId = toText(config['anchor-namespace']) || DEFAULT_ANCHOR_NAMESPACE;
  const anchors = buildAnchors(instanceId);
  const fieldSources = buildFieldSources(block);

  const { root, canvas } = buildWelcomeHero(config, anchors, fieldSources);
  block.replaceChildren(root);

  if (canvas) {
    initHeroCanvas(canvas);
  }
}
