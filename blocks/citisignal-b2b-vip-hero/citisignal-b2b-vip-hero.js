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
  'nav-link-1-label': 'Deals',
  'nav-link-1-url': '#',
  'nav-link-2-label': 'Devices',
  'nav-link-2-url': '#',
  'nav-link-3-label': 'Plans',
  'nav-link-3-url': '#',
  'nav-link-4-label': 'Network',
  'nav-link-4-url': '#',
  'nav-cta-label': 'VIP Perks',
  'nav-cta-url': '#',
  'vip-badge-label': 'Platinum Member Exclusive',
  'hero-title-line-1': 'You\'ve earned',
  'hero-title-gradient': 'early access.',
  'hero-description': 'As a Platinum VIP, you get first look at our newest devices, exclusive plan upgrades, and members-only pricing before anyone else.',
  'hero-primary-cta-label': 'Shop VIP Collection',
  'hero-primary-cta-url': '#',
  'hero-secondary-cta-label': 'Redeem Rewards',
  'hero-secondary-cta-url': '#',
  'member-avatar-initials': 'JH',
  'member-name': 'Jenifer Hanki',
  'member-tier': 'Platinum Member',
  'member-badge': 'VIP',
  'member-stat-1-value': '24.8k',
  'member-stat-1-label': 'Points',
  'member-stat-2-value': '6 yrs',
  'member-stat-2-label': 'Member',
  'member-stat-3-value': '$2,140',
  'member-stat-3-label': 'Saved',
  'perk-1-icon': '★',
  'perk-1-title': 'Priority Device Access',
  'perk-1-desc': 'New devices 48 hours before public launch',
  'perk-2-icon': '♦',
  'perk-2-title': 'Exclusive Pricing',
  'perk-2-desc': 'Up to 30% off select plans and accessories',
  'perk-3-icon': '☎',
  'perk-3-title': 'Concierge Support',
  'perk-3-desc': 'Dedicated VIP line with zero wait times',
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

function createVipBadgeIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M8 1l2.5 3.5L14 3l-1.5 5H3.5L2 3l3.5 1.5z');
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', '3');
  rect.setAttribute('y', '9.5');
  rect.setAttribute('width', '10');
  rect.setAttribute('height', '2.5');
  rect.setAttribute('rx', '1');
  svg.append(path, rect);
  return svg;
}

function buildVipHero(config, anchors, fieldSources) {
  const root = createElement('div', { className: 'cb2b-vip' });

  const nav = createElement('nav', {
    className: 'cb2b-vip-nav',
    attrs: { 'aria-label': 'Primary' },
  });
  const navInner = createElement('div', { className: 'cb2b-vip-nav-inner' });
  const logoLink = createElement('a', {
    className: 'cb2b-vip-nav-logo',
    attrs: { href: resolveUrl('#', anchors) || '#' },
  });
  instrumentElement(logoLink, 'nav-brand', fieldSources);
  const logoIcon = createElement('span', {
    className: 'cb2b-vip-logo-icon',
    attrs: { 'aria-hidden': 'true' },
  });
  logoIcon.append(createLogoIcon());
  logoLink.append(logoIcon);
  logoLink.append(document.createTextNode(toText(config['nav-brand'])));
  navInner.append(logoLink);

  const navLinks = createElement('div', { className: 'cb2b-vip-nav-links' });
  [1, 2, 3, 4].forEach((i) => {
    const label = toText(config[`nav-link-${i}-label`]);
    const href = resolveUrl(config[`nav-link-${i}-url`], anchors);
    if (!label || !href) {
      return;
    }
    navLinks.append(createEditableElement('a', {
      className: 'cb2b-vip-nav-link',
      text: label,
      attrs: { href },
    }, `nav-link-${i}-label`, fieldSources));
  });
  const navCta = createCtaLink(
    config['nav-cta-label'],
    config['nav-cta-url'],
    anchors,
    'cb2b-vip-nav-cta',
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
    className: 'cb2b-vip-hero',
    attrs: { 'aria-labelledby': 'cb2b-vip-hero-heading' },
  });
  const heroBg = createElement('div', {
    className: 'cb2b-vip-hero-bg',
    attrs: { 'aria-hidden': 'true' },
  });
  heroBg.append(createElement('div', { className: 'cb2b-vip-hero-grid' }));
  hero.append(heroBg);

  const split = createElement('div', { className: 'cb2b-vip-container cb2b-vip-hero-split' });

  const left = createElement('div', { className: 'cb2b-vip-hero-left' });
  const badgeLabel = toText(config['vip-badge-label']);
  if (badgeLabel) {
    const vipBadge = createEditableElement('div', { className: 'cb2b-vip-badge' }, 'vip-badge-label', fieldSources);
    vipBadge.append(createVipBadgeIcon());
    vipBadge.append(document.createTextNode(badgeLabel));
    left.append(vipBadge);
  }

  const h1 = createElement('h1', {
    className: 'cb2b-vip-hero-title',
    attrs: { id: 'cb2b-vip-hero-heading' },
  });
  h1.append(createEditableElement('span', {
    text: toText(config['hero-title-line-1']),
  }, 'hero-title-line-1', fieldSources));
  h1.append(document.createElement('br'));
  h1.append(createEditableElement('span', {
    className: 'cb2b-vip-gradient-text',
    text: toText(config['hero-title-gradient']),
  }, 'hero-title-gradient', fieldSources));
  left.append(h1);

  left.append(createEditableElement('p', {
    className: 'cb2b-vip-hero-desc',
    text: toText(config['hero-description']),
  }, 'hero-description', fieldSources));

  const btnRow = createElement('div', { className: 'cb2b-vip-hero-buttons' });
  const primary = createCtaLink(
    config['hero-primary-cta-label'],
    config['hero-primary-cta-url'],
    anchors,
    'cb2b-vip-btn cb2b-vip-btn--primary',
    'hero-primary-cta-label',
    fieldSources,
  );
  const secondary = createCtaLink(
    config['hero-secondary-cta-label'],
    config['hero-secondary-cta-url'],
    anchors,
    'cb2b-vip-btn cb2b-vip-btn--ghost',
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

  const right = createElement('div', { className: 'cb2b-vip-hero-right' });
  const panel = createElement('div', { className: 'cb2b-vip-panel' });

  const memberCard = createElement('div', { className: 'cb2b-vip-member-card' });
  const mcTop = createElement('div', { className: 'cb2b-vip-mc-top' });
  const mcUser = createElement('div', { className: 'cb2b-vip-mc-user' });
  mcUser.append(createEditableElement('div', {
    className: 'cb2b-vip-mc-avatar',
    text: toText(config['member-avatar-initials']),
  }, 'member-avatar-initials', fieldSources));
  const mcUserMeta = createElement('div');
  mcUserMeta.append(createEditableElement('div', {
    className: 'cb2b-vip-mc-name',
    text: toText(config['member-name']),
  }, 'member-name', fieldSources));
  mcUserMeta.append(createEditableElement('div', {
    className: 'cb2b-vip-mc-tier',
    text: toText(config['member-tier']),
  }, 'member-tier', fieldSources));
  mcUser.append(mcUserMeta);
  mcTop.append(mcUser);
  mcTop.append(createEditableElement('div', {
    className: 'cb2b-vip-mc-badge',
    text: toText(config['member-badge']),
  }, 'member-badge', fieldSources));
  memberCard.append(mcTop);

  const stats = createElement('div', { className: 'cb2b-vip-mc-stats' });
  [
    { val: 'member-stat-1-value', label: 'member-stat-1-label', tone: 'purple' },
    { val: 'member-stat-2-value', label: 'member-stat-2-label', tone: 'cyan' },
    { val: 'member-stat-3-value', label: 'member-stat-3-label', tone: 'green' },
  ].forEach(({ val, label, tone }) => {
    const cell = createElement('div', { className: 'cb2b-vip-mcs' });
    cell.append(createEditableElement('div', {
      className: `cb2b-vip-mcs-val cb2b-vip-mcs-val--${tone}`,
      text: toText(config[val]),
    }, val, fieldSources));
    cell.append(createEditableElement('div', {
      className: 'cb2b-vip-mcs-label',
      text: toText(config[label]),
    }, label, fieldSources));
    stats.append(cell);
  });
  memberCard.append(stats);
  panel.append(memberCard);

  const perksGrid = createElement('div', { className: 'cb2b-vip-perks' });
  [1, 2, 3].forEach((i) => {
    const perk = createElement('div', { className: 'cb2b-vip-perk' });
    perk.append(createEditableElement('div', {
      className: 'cb2b-vip-perk-icon',
      text: toText(config[`perk-${i}-icon`]),
      attrs: { 'aria-hidden': 'true' },
    }, `perk-${i}-icon`, fieldSources));
    const perkBody = createElement('div');
    perkBody.append(createEditableElement('div', {
      className: 'cb2b-vip-perk-title',
      text: toText(config[`perk-${i}-title`]),
    }, `perk-${i}-title`, fieldSources));
    perkBody.append(createEditableElement('div', {
      className: 'cb2b-vip-perk-desc',
      text: toText(config[`perk-${i}-desc`]),
    }, `perk-${i}-desc`, fieldSources));
    perk.append(perkBody);
    perksGrid.append(perk);
  });
  panel.append(perksGrid);

  right.append(panel);
  split.append(right);
  hero.append(split);
  root.append(hero);

  return root;
}

export default function decorate(block) {
  ensureBlockInstrumentation(block);
  const raw = readBlockConfig(block);
  const config = buildConfig(raw);
  const instanceId = toText(config['anchor-namespace']) || DEFAULT_ANCHOR_NAMESPACE;
  const anchors = buildAnchors(instanceId);
  const fieldSources = buildFieldSources(block);

  block.replaceChildren(buildVipHero(config, anchors, fieldSources));
}
