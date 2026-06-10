import { createOptimizedPicture, readBlockConfig, toClassName } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/ue-utils.js';

export const DEFAULT_ANCHOR_NAMESPACE = 'citisignal-showcase-1';

const DEFAULTS = {
  'hero-badge': '5G coverage just expanded',
  'hero-title': 'Stay Connected.|Stay',
  'hero-highlighted-title': 'Ahead.',
  'hero-description': 'Discover the expanded reach of CitiSignal\'s 5G network. Faster speeds, wider coverage, and smarter plans are just a click away.',
  'hero-primary-cta-label': 'Find Your 5G Phone',
  'hero-primary-cta-url': '#plans',
  'hero-secondary-cta-label': 'Explore Coverage',
  'hero-secondary-cta-url': '#network',
  'hero-proof-stat-value': '2.4M+',
  'hero-proof-stat-text': 'new subscribers this year',
  'hero-visual-image': '',
  'hero-visual-image-alt': 'Featured CitiSignal device',
  'hero-visual-tag': 'Featured Device',
  'hero-visual-title': 'CitiSignal Pro Max',
  'hero-visual-description': '48MP camera, titanium finish, and all-day battery on CitiSignal 5G.',
  'hero-pill-1': '5G Ultra Fast',
  'hero-pill-2': 'Nationwide',
  'hero-pill-3': 'No Contracts',
  'hero-phone-speed': '2.8',
  'hero-phone-speed-unit': 'Gbps',
  'hero-phone-label': 'Download speed',
  'hero-phone-metric-1-value': '8ms',
  'hero-phone-metric-1-label': 'Ping',
  'hero-phone-metric-2-value': '99.9%',
  'hero-phone-metric-2-label': 'Uptime',
  'hero-phone-metric-3-value': '5G+',
  'hero-phone-metric-3-label': 'Band',
  'partners-label': 'Partnered with top brands',
  'partner-names': 'Apple|Samsung|Google|Qualcomm|Ericsson|Nokia|Spotify|YouTube|Disney+|Netflix|Hulu|Xbox',
  'deals-eyebrow': '// Deals',
  'deals-title': 'Save more, spend less.',
  'deals-description': 'Exclusive offers on phones, accessories, and subscriptions. Only at CitiSignal.',
  'deal-1-icon-token': 'music',
  'deal-1-title': '90 days of free music',
  'deal-1-description': 'Stream your favorite artists with a free 90-day music subscription when you sign up for any plan.',
  'deal-1-cta-label': 'Learn More',
  'deal-1-cta-url': '#plans',
  'deal-2-icon-token': 'phone',
  'deal-2-title': 'New line? New phone on us.',
  'deal-2-description': 'Getting a new line? Get the latest smartphone on us with qualifying trade-in. Limited time offer.',
  'deal-2-cta-label': 'See Offer',
  'deal-2-cta-url': '#devices',
  'deal-3-icon-token': 'savings',
  'deal-3-title': 'Family savings bundle',
  'deal-3-description': 'Add lines and save bigger. Our family plans give you more data and bigger discounts the more you add.',
  'deal-3-cta-label': 'View Plans',
  'deal-3-cta-url': '#plans',
  'deal-4-icon-token': 'watch',
  'deal-4-title': 'Exclusive smartwatch bundles',
  'deal-4-description': 'Pair your new phone with a connected smartwatch. Exclusive bundle pricing for CitiSignal members.',
  'deal-4-cta-label': 'Shop Bundles',
  'deal-4-cta-url': '#devices',
  'featured-tag': 'New Arrival',
  'featured-title': 'Get the latest|technology.',
  'featured-description-1': 'Check out the latest technology with the iPhone 16. Filled with modern features like an upgraded camera and blazing speed.',
  'featured-description-2': 'Get the newest phone for your everyday life, now available at CitiSignal with exclusive offers for new and existing members.',
  'featured-feature-list': '48MP camera system with 5x optical zoom|A18 Pro chip for all-day performance|Titanium design, lighter than ever|Free with eligible trade-in at CitiSignal',
  'featured-cta-label': 'Shop iPhone 16',
  'featured-cta-url': '#plans',
  'featured-card-1-label': 'Download',
  'featured-card-1-value': '4.2 Gbps',
  'featured-card-2-label': 'Coverage',
  'featured-card-2-value': 'Strong',
  'featured-card-2-meter': '92',
  'featured-card-3-label': 'Latency',
  'featured-card-3-value': '2ms',
  'plans-eyebrow': '// Plans',
  'plans-title': 'Plans that fit|your life.',
  'plans-description': 'No hidden fees. No annual contracts. Switch, upgrade, or cancel anytime.',
  'plans-monthly-label': 'Monthly',
  'plans-annual-label': 'Annual',
  'plans-saving-label': 'Save 20%',
  'plan-1-name': 'Essential',
  'plan-1-monthly-price': '35',
  'plan-1-annual-price': '28',
  'plan-1-description': 'Reliable coverage and solid speeds for everyday use.',
  'plan-1-feature-list': '50 GB high-speed data|5G access included|Spam call blocking|5 GB mobile hotspot',
  'plan-1-cta-label': 'Choose Essential',
  'plan-1-cta-url': '#cta',
  'plan-1-featured': false,
  'plan-2-name': 'Unlimited',
  'plan-2-monthly-price': '55',
  'plan-2-annual-price': '44',
  'plan-2-description': 'Our most popular plan. More data, more perks, more freedom.',
  'plan-2-feature-list': 'Unlimited premium data|5G Ultra Wideband|25 GB hotspot|90-day free music subscription|International texting 30+ countries',
  'plan-2-cta-label': 'Choose Unlimited',
  'plan-2-cta-url': '#cta',
  'plan-2-featured': true,
  'plan-3-name': 'Unlimited+',
  'plan-3-monthly-price': '75',
  'plan-3-annual-price': '60',
  'plan-3-description': 'The complete experience. Premium everything, no compromises.',
  'plan-3-feature-list': 'Truly unlimited everything|5G+ with priority access|Unlimited hotspot|Global roaming 60+ countries|Smartwatch bundle + device protection',
  'plan-3-cta-label': 'Choose Unlimited+',
  'plan-3-cta-url': '#cta',
  'plan-3-featured': false,
  'network-eyebrow': '// Network',
  'network-title': 'Coverage you|can count on.',
  'network-description': 'Our 5G network keeps expanding. From downtown to the suburbs, from coast to coast, CitiSignal delivers speeds and reliability you can depend on every day.',
  'network-stat-1-value': '99.9',
  'network-stat-1-suffix': '%',
  'network-stat-1-decimals': '1',
  'network-stat-1-label': 'Network reliability across all coverage areas, every quarter',
  'network-stat-1-sub-label': 'INDUSTRY-LEADING UPTIME',
  'network-stat-2-value': '320',
  'network-stat-2-suffix': 'M+',
  'network-stat-2-decimals': '0',
  'network-stat-2-label': 'People covered by our 5G network',
  'network-stat-2-sub-label': 'AND GROWING FAST',
  'network-stat-3-value': '2.4',
  'network-stat-3-suffix': 'M',
  'network-stat-3-decimals': '1',
  'network-stat-3-label': 'New subscribers in the last year',
  'network-stat-3-sub-label': 'FASTEST-GROWING CARRIER',
  'network-stat-4-value': '50',
  'network-stat-4-suffix': '',
  'network-stat-4-decimals': '0',
  'network-stat-4-label': 'States with full 5G coverage',
  'network-stat-4-sub-label': 'COAST TO COAST',
  'testimonials-eyebrow': '// Reviews',
  'testimonials-title': 'People love|CitiSignal.',
  'testimonial-1-quote': 'Switched from my old carrier three months ago. Better signal, better price, and the free music subscription is a nice bonus.',
  'testimonial-1-initials': 'JR',
  'testimonial-1-name': 'Jason Reeves',
  'testimonial-1-role-location': 'Austin, TX',
  'testimonial-2-quote': 'The family plan saved us almost $80 a month. Four lines, unlimited data, and no surprises on the bill.',
  'testimonial-2-initials': 'MP',
  'testimonial-2-name': 'Maria Perez',
  'testimonial-2-role-location': 'Miami, FL',
  'testimonial-3-quote': 'I got the iPhone 16 deal with trade-in and it was seamless. In-store setup took ten minutes. Really impressed.',
  'testimonial-3-initials': 'DL',
  'testimonial-3-name': 'David Lee',
  'testimonial-3-role-location': 'Seattle, WA',
  'testimonial-4-quote': '5G coverage at my office and at home finally. CitiSignal\'s network expansion has been a game changer for me.',
  'testimonial-4-initials': 'RK',
  'testimonial-4-name': 'Rachel Kim',
  'testimonial-4-role-location': 'Chicago, IL',
  'testimonial-5-quote': 'No contracts, no hidden fees. They actually mean it. My bill has been the exact same every month for a year.',
  'testimonial-5-initials': 'TC',
  'testimonial-5-name': 'Tyler Chen',
  'testimonial-5-role-location': 'Denver, CO',
  'final-cta-heading': 'Ready to make|the switch?',
  'final-cta-body': 'Join 2.4 million people who chose better coverage and honest pricing. Setup takes five minutes.',
  'final-cta-label': 'Get Started Today',
  'final-cta-url': '#plans',
};

const ICON_LABELS = {
  music: 'Music offer',
  phone: 'Phone offer',
  savings: 'Savings offer',
  watch: 'Smartwatch offer',
  bundle: 'Bundle offer',
  speed: 'Speed offer',
};

const ICON_GLYPHS = {
  music: '♪',
  phone: '☎',
  savings: '$',
  watch: '⏱',
  bundle: '+',
  speed: '↗',
};

export function createElement(tagName, options = {}) {
  const {
    className,
    text,
    attrs = {},
  } = options;

  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text !== undefined && text !== null) {
    element.textContent = text;
  }

  Object.entries(attrs).forEach(([name, value]) => {
    if (value === undefined || value === null || value === false) {
      return;
    }

    element.setAttribute(name, value === true ? '' : value);
  });

  return element;
}

function toEditorLabel(prop) {
  return toText(prop)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function hasEditorInstrumentation(element) {
  return !!element && [...element.attributes].some(({ name }) => (
    name.startsWith('data-aue-') || name.startsWith('data-richtext-')
  ));
}

export function buildFieldSources(block) {
  const fieldSources = {};

  block.querySelectorAll(':scope > div').forEach((row) => {
    const cols = [...row.children];
    if (!cols[1]) {
      return;
    }

    const prop = toClassName(cols[0].textContent);
    const source = cols[1].querySelector('[data-aue-prop], [data-richtext-prop], [data-aue-type]')
      || cols[1];

    fieldSources[prop] = source;
  });

  return fieldSources;
}

export function instrumentElement(element, prop, fieldSources, type = 'text') {
  if (!element || !prop) {
    return element;
  }

  const source = fieldSources?.[prop];
  if (source && hasEditorInstrumentation(source)) {
    moveInstrumentation(source, element);
  }

  if (!element.hasAttribute('data-aue-prop') && !element.hasAttribute('data-richtext-prop')) {
    element.setAttribute('data-aue-prop', prop);
  }

  if (!element.hasAttribute('data-aue-type') && !element.hasAttribute('data-richtext-prop')) {
    element.setAttribute('data-aue-type', type);
  }

  if (!element.hasAttribute('data-aue-label')) {
    element.setAttribute('data-aue-label', toEditorLabel(prop));
  }

  return element;
}

export function ensureBlockInstrumentation(block) {
  if (block?.hasAttribute('data-aue-resource') && !block.hasAttribute('data-aue-type')) {
    block.setAttribute('data-aue-type', 'component');
  }
}

function createEditableElement(tagName, options, prop, fieldSources, type = 'text') {
  return instrumentElement(createElement(tagName, options), prop, fieldSources, type);
}

function createStatic(markup) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = markup.trim();
  return wrapper.firstElementChild;
}

function toText(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(' ');
  }

  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

function splitValues(value) {
  if (Array.isArray(value)) {
    return value.flatMap((item) => splitValues(item));
  }

  return toText(value)
    .split(/\s*\|\s*|\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  return ['true', 'yes', '1', 'on'].includes(toText(value).toLowerCase());
}

function parseNumber(value, fallback = 0) {
  const parsed = Number.parseFloat(toText(value));
  return Number.isNaN(parsed) ? fallback : parsed;
}

function clampPercent(value, fallback = 0) {
  const parsed = Number.parseInt(toText(value), 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return Math.max(0, Math.min(100, parsed));
}

function formatCounterValue(value, decimals, suffix) {
  const formatted = value.toFixed(decimals)
    .replace(/\.0+$/, '')
    .replace(/(\.\d*[1-9])0+$/, '$1');

  return `${formatted}${suffix}`;
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

function appendSplitHeadline(element, text, highlight, fieldSources, prop, highlightProp) {
  const lines = splitValues(text);
  const finalLines = lines.length ? lines : [''];
  const accent = toText(highlight);

  instrumentElement(element, prop, fieldSources);

  finalLines.forEach((line, index) => {
    const lineElement = createElement('span', { className: 'cs-title-line' });
    const isLastLine = index === finalLines.length - 1;

    if (isLastLine && accent) {
      if (line) {
        lineElement.append(document.createTextNode(`${line} `));
      }

      lineElement.append(createEditableElement('span', {
        className: 'cs-gradient-text',
        text: accent,
      }, highlightProp, fieldSources));
    } else {
      lineElement.textContent = line;
    }

    element.append(lineElement);
  });
}

function createEyebrow(text, extraClass, fieldSources, prop) {
  const label = toText(text);

  if (!label) {
    return null;
  }

  return createEditableElement('p', {
    className: `cs-eyebrow ${extraClass || ''}`.trim(),
    text: label,
  }, prop, fieldSources);
}

function createButton(label, url, anchors, className, fieldSources, prop) {
  const buttonLabel = toText(label);
  const href = resolveUrl(url, anchors);

  if (!buttonLabel || !href) {
    return null;
  }

  return createEditableElement('a', {
    className,
    text: buttonLabel,
    attrs: { href },
  }, prop, fieldSources);
}

function createIcon(token) {
  const normalized = toText(token).toLowerCase() || 'bundle';
  const icon = createElement('span', {
    className: `cs-icon cs-icon--${normalized}`,
    attrs: {
      'aria-hidden': 'true',
      'data-token': normalized,
    },
    text: ICON_GLYPHS[normalized] || normalized.charAt(0).toUpperCase(),
  });

  const label = ICON_LABELS[normalized];
  if (label) {
    icon.setAttribute('title', label);
  }

  return icon;
}

function createAvatarLabel(partners, fallbackInitials) {
  const source = partners.length ? partners : fallbackInitials;
  return source.slice(0, 4).map((item) => item.charAt(0).toUpperCase());
}

function createStars() {
  const stars = createElement('div', {
    className: 'cs-stars',
    attrs: { 'aria-hidden': 'true' },
  });

  for (let index = 0; index < 5; index += 1) {
    stars.append(createElement('span', { text: '★' }));
  }

  return stars;
}

function createCheckIcon() {
  return createElement('span', {
    className: 'cs-check-icon',
    text: '✓',
    attrs: { 'aria-hidden': 'true' },
  });
}

function createResponsivePicture(src, alt, className, breakpoints) {
  const imageSrc = toText(src);
  if (!imageSrc) {
    return null;
  }

  const picture = createOptimizedPicture(imageSrc, toText(alt), false, breakpoints);
  if (className) {
    picture.classList.add(className);
  }

  return picture;
}

function createHeroV2Placeholder() {
  return createStatic(`
    <div class="cs-hero-v2-placeholder" aria-hidden="true">
      <span class="cs-hero-v2-placeholder-badge">CitiSignal 5G</span>
      <span class="cs-hero-v2-placeholder-disc cs-hero-v2-placeholder-disc--1"></span>
      <span class="cs-hero-v2-placeholder-disc cs-hero-v2-placeholder-disc--2"></span>
      <span class="cs-hero-v2-placeholder-shine"></span>
      <div class="cs-hero-v2-placeholder-panel">
        <span class="cs-hero-v2-placeholder-line cs-hero-v2-placeholder-line--strong"></span>
        <span class="cs-hero-v2-placeholder-line"></span>
        <span class="cs-hero-v2-placeholder-line cs-hero-v2-placeholder-line--short"></span>
      </div>
    </div>
  `);
}

function createHeroSection(sectionClass = '', visualAttrs = { 'aria-hidden': 'true' }) {
  const hero = createStatic(`
    <section class="cs-section cs-hero">
      <div class="cs-hero-bg" aria-hidden="true"></div>
      <div class="cs-container cs-hero-grid">
        <div class="cs-hero-copy cs-reveal"></div>
        <div class="cs-hero-visual cs-reveal cs-delay-1"></div>
      </div>
      <div class="cs-hero-scroll" aria-hidden="true">
        <span>Scroll</span>
        <span class="cs-hero-scroll-line"></span>
      </div>
    </section>
  `);
  if (sectionClass) {
    hero.classList.add(sectionClass);
  }
  const visual = hero.querySelector('.cs-hero-visual');
  Object.entries(visualAttrs).forEach(([name, value]) => {
    if (value === undefined || value === null || value === false) {
      return;
    }
    visual.setAttribute(name, value === true ? '' : value);
  });
  return hero;
}

function populateHeroCopy(copy, config, anchors, avatarSource, fieldSources) {
  const badge = createEditableElement('p', {
    className: 'cs-badge',
    text: toText(config['hero-badge']),
  }, 'hero-badge', fieldSources);
  badge.prepend(createElement('span', {
    className: 'cs-badge-dot',
    attrs: { 'aria-hidden': 'true' },
  }));
  copy.append(badge);

  const title = createElement('h1', { className: 'cs-hero-title' });
  appendSplitHeadline(
    title,
    config['hero-title'],
    config['hero-highlighted-title'],
    fieldSources,
    'hero-title',
    'hero-highlighted-title',
  );
  copy.append(title);

  copy.append(createEditableElement('p', {
    className: 'cs-body-copy',
    text: toText(config['hero-description']),
  }, 'hero-description', fieldSources));

  const actions = createElement('div', { className: 'cs-button-row' });
  const primaryButton = createButton(
    config['hero-primary-cta-label'],
    config['hero-primary-cta-url'],
    anchors,
    'cs-button cs-button--primary',
    fieldSources,
    'hero-primary-cta-label',
  );
  const secondaryButton = createButton(
    config['hero-secondary-cta-label'],
    config['hero-secondary-cta-url'],
    anchors,
    'cs-button cs-button--secondary',
    fieldSources,
    'hero-secondary-cta-label',
  );

  if (primaryButton) {
    actions.append(primaryButton);
  }

  if (secondaryButton) {
    actions.append(secondaryButton);
  }

  if (actions.children.length) {
    copy.append(actions);
  }

  const proof = createElement('div', { className: 'cs-proof' });
  const avatars = createElement('div', {
    className: 'cs-avatars',
    attrs: { 'aria-hidden': 'true' },
  });
  instrumentElement(avatars, 'partner-names', fieldSources);
  createAvatarLabel(splitValues(config['partner-names']), avatarSource).forEach((label, index) => {
    avatars.append(createElement('span', {
      className: `cs-avatar cs-avatar--${index + 1}`,
      text: label,
    }));
  });
  proof.append(avatars);

  const proofText = createElement('p', { className: 'cs-proof-text' });
  proofText.append(createEditableElement('strong', {
    text: toText(config['hero-proof-stat-value']),
  }, 'hero-proof-stat-value', fieldSources));
  const proofSuffix = toText(config['hero-proof-stat-text']);
  if (proofSuffix) {
    proofText.append(document.createTextNode(' '));
    proofText.append(createEditableElement('span', {
      text: proofSuffix,
    }, 'hero-proof-stat-text', fieldSources));
  }
  proof.append(proofText);
  copy.append(proof);
}

function populateHeroPills(scene, config, fieldSources, decorative = false) {
  [
    config['hero-pill-1'],
    config['hero-pill-2'],
    config['hero-pill-3'],
  ].forEach((pill, index) => {
    const pillSlot = scene.querySelector(`.cs-hero-pill--${index + 1}`);
    const text = toText(pill);

    if (!pillSlot) {
      return;
    }

    if (!text) {
      pillSlot.remove();
      return;
    }

    if (decorative) {
      pillSlot.setAttribute('aria-hidden', 'true');
    }

    pillSlot.append(createElement('span', {
      className: 'cs-hero-pill-dot',
      attrs: { 'aria-hidden': 'true' },
    }));
    pillSlot.append(createEditableElement('span', { text }, `hero-pill-${index + 1}`, fieldSources));
  });
}

export function buildHero(config, anchors, avatarSource, fieldSources) {
  const hero = createHeroSection();
  const copy = hero.querySelector('.cs-hero-copy');
  const visual = hero.querySelector('.cs-hero-visual');

  populateHeroCopy(copy, config, anchors, avatarSource, fieldSources);

  const heroPhone = createStatic(`
    <div class="cs-phone-scene">
      <div class="cs-signal-ring cs-signal-ring--1"></div>
      <div class="cs-signal-ring cs-signal-ring--2"></div>
      <div class="cs-signal-ring cs-signal-ring--3"></div>
      <div class="cs-phone">
        <div class="cs-phone-screen">
          <div class="cs-phone-status">
            <span>9:41</span>
            <span class="cs-phone-brand">CITI 5G</span>
          </div>
          <div class="cs-phone-speed-wrap">
            <div class="cs-phone-speed">
              <span class="cs-phone-speed-value"></span>
              <span class="cs-phone-speed-unit"></span>
            </div>
            <p class="cs-phone-speed-label"></p>
            <div class="cs-phone-bar">
              <span class="cs-phone-bar-fill"></span>
            </div>
          </div>
          <div class="cs-phone-metrics"></div>
        </div>
      </div>
      <div class="cs-hero-pill cs-hero-pill--1"></div>
      <div class="cs-hero-pill cs-hero-pill--2"></div>
      <div class="cs-hero-pill cs-hero-pill--3"></div>
    </div>
  `);

  instrumentElement(heroPhone.querySelector('.cs-phone-speed-value'), 'hero-phone-speed', fieldSources)
    .textContent = toText(config['hero-phone-speed']);
  instrumentElement(heroPhone.querySelector('.cs-phone-speed-unit'), 'hero-phone-speed-unit', fieldSources)
    .textContent = toText(config['hero-phone-speed-unit']);
  instrumentElement(heroPhone.querySelector('.cs-phone-speed-label'), 'hero-phone-label', fieldSources)
    .textContent = toText(config['hero-phone-label']);

  [
    {
      value: config['hero-phone-metric-1-value'],
      label: config['hero-phone-metric-1-label'],
      valueProp: 'hero-phone-metric-1-value',
      labelProp: 'hero-phone-metric-1-label',
    },
    {
      value: config['hero-phone-metric-2-value'],
      label: config['hero-phone-metric-2-label'],
      valueProp: 'hero-phone-metric-2-value',
      labelProp: 'hero-phone-metric-2-label',
    },
    {
      value: config['hero-phone-metric-3-value'],
      label: config['hero-phone-metric-3-label'],
      valueProp: 'hero-phone-metric-3-value',
      labelProp: 'hero-phone-metric-3-label',
    },
  ].forEach((item) => {
    if (!toText(item.value) && !toText(item.label)) {
      return;
    }

    const metric = createElement('div', { className: 'cs-phone-metric' });
    metric.append(createEditableElement('strong', {
      className: 'cs-phone-metric-value',
      text: toText(item.value),
    }, item.valueProp, fieldSources));
    metric.append(createEditableElement('span', {
      className: 'cs-phone-metric-label',
      text: toText(item.label),
    }, item.labelProp, fieldSources));
    heroPhone.querySelector('.cs-phone-metrics').append(metric);
  });

  populateHeroPills(heroPhone, config, fieldSources);

  visual.append(heroPhone);
  return hero;
}

export function buildHeroV2(config, anchors, avatarSource, fieldSources) {
  const hero = createHeroSection('cs-hero-v2', {});
  const copy = hero.querySelector('.cs-hero-copy');
  const visual = hero.querySelector('.cs-hero-visual');

  populateHeroCopy(copy, config, anchors, avatarSource, fieldSources);

  const scene = createStatic(`
    <div class="cs-hero-v2-scene">
      <div class="cs-signal-ring cs-signal-ring--1" aria-hidden="true"></div>
      <div class="cs-signal-ring cs-signal-ring--2" aria-hidden="true"></div>
      <div class="cs-signal-ring cs-signal-ring--3" aria-hidden="true"></div>
      <div class="cs-hero-v2-card">
        <div class="cs-hero-v2-media-frame"></div>
      </div>
      <div class="cs-hero-pill cs-hero-pill--1"></div>
      <div class="cs-hero-pill cs-hero-pill--2"></div>
      <div class="cs-hero-pill cs-hero-pill--3"></div>
    </div>
  `);

  const mediaFrame = scene.querySelector('.cs-hero-v2-media-frame');
  const imageAlt = toText(config['hero-visual-image-alt']) || DEFAULTS['hero-visual-image-alt'];
  const picture = createResponsivePicture(
    config['hero-visual-image'],
    imageAlt,
    'cs-hero-v2-picture',
    [
      { media: '(min-width: 1200px)', width: '1000' },
      { media: '(min-width: 768px)', width: '800' },
      { width: '600' },
    ],
  );

  if (picture) {
    instrumentElement(picture, 'hero-visual-image', fieldSources, 'image');
    mediaFrame.append(picture);
  } else {
    instrumentElement(mediaFrame, 'hero-visual-image', fieldSources, 'image');
    mediaFrame.append(createHeroV2Placeholder());
  }

  const metaContent = [
    toText(config['hero-visual-tag']),
    toText(config['hero-visual-title']),
    toText(config['hero-visual-description']),
  ].filter(Boolean);

  if (metaContent.length) {
    const meta = createElement('div', { className: 'cs-hero-v2-meta' });

    const tag = toText(config['hero-visual-tag']);
    if (tag) {
      meta.append(createEditableElement('p', {
        className: 'cs-hero-v2-tag',
        text: tag,
      }, 'hero-visual-tag', fieldSources));
    }

    const title = toText(config['hero-visual-title']);
    if (title) {
      meta.append(createEditableElement('h3', {
        className: 'cs-hero-v2-title',
        text: title,
      }, 'hero-visual-title', fieldSources));
    }

    const description = toText(config['hero-visual-description']);
    if (description) {
      meta.append(createEditableElement('p', {
        className: 'cs-hero-v2-description',
        text: description,
      }, 'hero-visual-description', fieldSources));
    }

    scene.querySelector('.cs-hero-v2-card').append(meta);
  }

  populateHeroPills(scene, config, fieldSources, true);

  visual.append(scene);
  return hero;
}

export function buildPartners(config, fieldSources) {
  const partners = splitValues(config['partner-names']);

  if (!partners.length) {
    return null;
  }

  const section = createStatic(`
    <section class="cs-section cs-partners">
      <div class="cs-container">
        <p class="cs-partners-label"></p>
        <div class="cs-marquee" aria-hidden="true">
          <div class="cs-marquee-track"></div>
          <div class="cs-marquee-track"></div>
        </div>
      </div>
    </section>
  `);

  instrumentElement(section.querySelector('.cs-partners-label'), 'partners-label', fieldSources)
    .textContent = toText(config['partners-label']);
  instrumentElement(section.querySelector('.cs-marquee'), 'partner-names', fieldSources);
  section.querySelectorAll('.cs-marquee-track').forEach((track) => {
    partners.forEach((partner) => {
      const pill = createElement('span', {
        className: 'cs-marquee-item',
        text: partner,
      });
      pill.prepend(createElement('span', {
        className: 'cs-marquee-mark',
        attrs: { 'aria-hidden': 'true' },
      }));
      track.append(pill);
    });
  });

  return section;
}

export function buildDeals(config, anchors, fieldSources) {
  const section = createStatic(`
    <section class="cs-section cs-deals">
      <div class="cs-container">
        <div class="cs-section-heading cs-reveal"></div>
        <div class="cs-deals-grid"></div>
      </div>
    </section>
  `);

  section.id = anchors.deals;
  const heading = section.querySelector('.cs-section-heading');
  const eyebrow = createEyebrow(config['deals-eyebrow'], '', fieldSources, 'deals-eyebrow');
  if (eyebrow) {
    heading.append(eyebrow);
  }

  const title = createElement('h2', { className: 'cs-section-title' });
  appendSplitHeadline(title, config['deals-title'], '', fieldSources, 'deals-title');
  heading.append(title);

  heading.append(createEditableElement('p', {
    className: 'cs-section-description',
    text: toText(config['deals-description']),
  }, 'deals-description', fieldSources));

  const grid = section.querySelector('.cs-deals-grid');
  const deals = [1, 2, 3, 4].map((index) => ({
    icon: config[`deal-${index}-icon-token`],
    title: config[`deal-${index}-title`],
    description: config[`deal-${index}-description`],
    label: config[`deal-${index}-cta-label`],
    url: config[`deal-${index}-cta-url`],
    iconProp: `deal-${index}-icon-token`,
    titleProp: `deal-${index}-title`,
    descriptionProp: `deal-${index}-description`,
    labelProp: `deal-${index}-cta-label`,
  })).filter((deal) => toText(deal.title));

  deals.forEach((deal, index) => {
    const card = createElement('article', {
      className: `cs-deal-card cs-reveal cs-delay-${Math.min(index + 1, 3)}`,
    });
    const iconWrap = createElement('div', {
      className: 'cs-deal-icon',
      attrs: { 'aria-hidden': 'true' },
    });
    instrumentElement(iconWrap, deal.iconProp, fieldSources);
    iconWrap.append(createIcon(deal.icon));
    card.append(iconWrap);
    card.append(createEditableElement('h3', {
      className: 'cs-card-title',
      text: toText(deal.title),
    }, deal.titleProp, fieldSources));
    card.append(createEditableElement('p', {
      className: 'cs-card-copy',
      text: toText(deal.description),
    }, deal.descriptionProp, fieldSources));

    const link = createButton(
      deal.label,
      deal.url,
      anchors,
      'cs-inline-link',
      fieldSources,
      deal.labelProp,
    );
    if (link) {
      card.append(link);
    }

    grid.append(card);
  });

  return section;
}

export function buildFeatured(config, anchors, fieldSources) {
  const section = createStatic(`
    <section class="cs-section cs-featured">
      <div class="cs-container cs-featured-grid">
        <div class="cs-featured-visual cs-reveal"></div>
        <div class="cs-featured-copy cs-reveal cs-delay-1"></div>
      </div>
    </section>
  `);

  section.id = anchors.devices;

  const visual = section.querySelector('.cs-featured-visual');
  const copy = section.querySelector('.cs-featured-copy');

  const deviceScene = createStatic(`
    <div class="cs-device-scene" aria-hidden="true">
      <div class="cs-device-glow"></div>
      <div class="cs-orbit cs-orbit--1"></div>
      <div class="cs-orbit cs-orbit--2"></div>
      <div class="cs-device-shell">
        <div class="cs-device-notch"></div>
        <div class="cs-device-screen">
          <span class="cs-device-screen-brand">CitiSignal</span>
          <strong class="cs-device-screen-time">9:41</strong>
          <span class="cs-device-screen-copy">Expanded nationwide 5G</span>
        </div>
      </div>
      <div class="cs-floating-card cs-floating-card--1"></div>
      <div class="cs-floating-card cs-floating-card--2"></div>
      <div class="cs-floating-card cs-floating-card--3"></div>
    </div>
  `);

  [
    {
      label: config['featured-card-1-label'],
      value: config['featured-card-1-value'],
      meter: '',
      className: 'cs-floating-card--1',
      labelProp: 'featured-card-1-label',
      valueProp: 'featured-card-1-value',
    },
    {
      label: config['featured-card-2-label'],
      value: config['featured-card-2-value'],
      meter: config['featured-card-2-meter'],
      className: 'cs-floating-card--2',
      labelProp: 'featured-card-2-label',
      valueProp: 'featured-card-2-value',
      meterProp: 'featured-card-2-meter',
    },
    {
      label: config['featured-card-3-label'],
      value: config['featured-card-3-value'],
      meter: '',
      className: 'cs-floating-card--3',
      labelProp: 'featured-card-3-label',
      valueProp: 'featured-card-3-value',
    },
  ].forEach((item) => {
    const card = deviceScene.querySelector(`.${item.className}`);
    const label = toText(item.label);
    const value = toText(item.value);

    if (!label && !value) {
      card.remove();
      return;
    }

    card.append(createEditableElement('span', {
      className: 'cs-floating-label',
      text: label,
    }, item.labelProp, fieldSources));
    card.append(createEditableElement('strong', {
      className: 'cs-floating-value',
      text: value,
    }, item.valueProp, fieldSources));

    if (item.meter) {
      const meter = createElement('span', { className: 'cs-floating-meter' });
      instrumentElement(meter, item.meterProp, fieldSources);
      meter.append(createElement('span', {
        className: 'cs-floating-meter-fill',
        attrs: {
          style: `width: ${clampPercent(item.meter, 92)}%`,
        },
      }));
      card.append(meter);
    }
  });

  visual.append(deviceScene);

  const tag = createEditableElement('p', {
    className: 'cs-feature-tag',
    text: toText(config['featured-tag']),
  }, 'featured-tag', fieldSources);
  tag.prepend(createElement('span', {
    className: 'cs-feature-tag-icon',
    text: '✦',
    attrs: { 'aria-hidden': 'true' },
  }));
  copy.append(tag);

  const title = createElement('h2', { className: 'cs-section-title cs-section-title--light' });
  appendSplitHeadline(title, config['featured-title'], '', fieldSources, 'featured-title');
  copy.append(title);

  ['featured-description-1', 'featured-description-2'].forEach((key) => {
    const text = toText(config[key]);
    if (text) {
      copy.append(createEditableElement('p', {
        className: 'cs-feature-copy',
        text,
      }, key, fieldSources));
    }
  });

  const featureList = splitValues(config['featured-feature-list']);
  if (featureList.length) {
    const list = createElement('ul', { className: 'cs-feature-list' });
    instrumentElement(list, 'featured-feature-list', fieldSources);
    featureList.forEach((item) => {
      const listItem = createElement('li');
      listItem.append(createCheckIcon());
      listItem.append(createElement('span', { text: item }));
      list.append(listItem);
    });
    copy.append(list);
  }

  const cta = createButton(
    config['featured-cta-label'],
    config['featured-cta-url'],
    anchors,
    'cs-button cs-button--light',
    fieldSources,
    'featured-cta-label',
  );
  if (cta) {
    copy.append(cta);
  }

  return section;
}

function createPlanCard(plan, anchors, fieldSources) {
  const card = createElement('article', {
    className: `cs-plan-card ${plan.featured ? 'is-featured' : ''}`.trim(),
  });

  card.append(createEditableElement('p', {
    className: 'cs-plan-name',
    text: plan.name,
  }, plan.nameProp, fieldSources));

  const priceWrap = createElement('div', { className: 'cs-plan-price' });
  priceWrap.append(createElement('span', {
    className: 'cs-plan-currency',
    text: '$',
  }));
  const monthlyPrice = createEditableElement('span', {
    className: 'cs-plan-price-value',
    text: plan.monthly,
    attrs: { 'data-price-mode': 'monthly' },
  }, plan.monthlyProp, fieldSources);
  const annualPrice = createEditableElement('span', {
    className: 'cs-plan-price-value',
    text: plan.annual,
    attrs: {
      'data-price-mode': 'annual',
      hidden: true,
    },
  }, plan.annualProp, fieldSources);
  priceWrap.append(monthlyPrice, annualPrice);
  priceWrap.append(createElement('span', {
    className: 'cs-plan-period',
    text: '/mo',
  }));
  card.append(priceWrap);

  card.append(createEditableElement('p', {
    className: 'cs-card-copy',
    text: plan.description,
  }, plan.descriptionProp, fieldSources));

  const featureList = createElement('ul', { className: 'cs-plan-list' });
  instrumentElement(featureList, plan.featureListProp, fieldSources);
  plan.features.forEach((feature) => {
    const item = createElement('li');
    item.append(createCheckIcon());
    item.append(createElement('span', { text: feature }));
    featureList.append(item);
  });
  card.append(featureList);

  const button = createButton(
    plan.label,
    plan.url,
    anchors,
    `cs-button ${plan.featured ? 'cs-button--primary' : 'cs-button--ghost'}`,
    fieldSources,
    plan.labelProp,
  );
  if (button) {
    card.append(button);
  }

  return card;
}

export function buildPlans(config, anchors, fieldSources) {
  const plans = [1, 2, 3].map((index) => ({
    name: toText(config[`plan-${index}-name`]),
    monthly: toText(config[`plan-${index}-monthly-price`]),
    annual: toText(config[`plan-${index}-annual-price`]),
    description: toText(config[`plan-${index}-description`]),
    features: splitValues(config[`plan-${index}-feature-list`]),
    label: config[`plan-${index}-cta-label`],
    url: config[`plan-${index}-cta-url`],
    featured: parseBoolean(config[`plan-${index}-featured`]),
    nameProp: `plan-${index}-name`,
    monthlyProp: `plan-${index}-monthly-price`,
    annualProp: `plan-${index}-annual-price`,
    descriptionProp: `plan-${index}-description`,
    featureListProp: `plan-${index}-feature-list`,
    labelProp: `plan-${index}-cta-label`,
  })).filter((plan) => plan.name);

  const showAnnualToggle = plans.length > 0 && plans.every((plan) => plan.annual);
  const section = createStatic(`
    <section class="cs-section cs-plans">
      <div class="cs-container">
        <div class="cs-plans-header">
          <div class="cs-section-heading cs-reveal"></div>
          <div class="cs-plans-toggle-wrap cs-reveal cs-delay-1"></div>
        </div>
        <div class="cs-plans-grid"></div>
      </div>
    </section>
  `);

  section.id = anchors.plans;

  const heading = section.querySelector('.cs-section-heading');
  const eyebrow = createEyebrow(config['plans-eyebrow'], '', fieldSources, 'plans-eyebrow');
  if (eyebrow) {
    heading.append(eyebrow);
  }

  const title = createElement('h2', { className: 'cs-section-title' });
  appendSplitHeadline(title, config['plans-title'], '', fieldSources, 'plans-title');
  heading.append(title);
  heading.append(createEditableElement('p', {
    className: 'cs-section-description',
    text: toText(config['plans-description']),
  }, 'plans-description', fieldSources));

  const toggleWrap = section.querySelector('.cs-plans-toggle-wrap');
  if (showAnnualToggle) {
    toggleWrap.append(createEditableElement('span', {
      className: 'cs-toggle-label is-active',
      text: toText(config['plans-monthly-label']),
      attrs: { 'data-mode-label': 'monthly' },
    }, 'plans-monthly-label', fieldSources));

    const toggle = createElement('button', {
      className: 'cs-plan-toggle',
      attrs: {
        type: 'button',
        'aria-pressed': 'false',
        'aria-label': 'Toggle annual pricing',
      },
    });
    toggle.append(createElement('span', {
      className: 'cs-plan-toggle-knob',
      attrs: { 'aria-hidden': 'true' },
    }));
    toggleWrap.append(toggle);

    toggleWrap.append(createEditableElement('span', {
      className: 'cs-toggle-label',
      text: toText(config['plans-annual-label']),
      attrs: { 'data-mode-label': 'annual' },
    }, 'plans-annual-label', fieldSources));

    toggleWrap.append(createEditableElement('span', {
      className: 'cs-saving-pill',
      text: toText(config['plans-saving-label']),
    }, 'plans-saving-label', fieldSources));
  } else {
    toggleWrap.remove();
  }

  const grid = section.querySelector('.cs-plans-grid');
  plans.forEach((plan, index) => {
    const card = createPlanCard(plan, anchors, fieldSources);
    card.classList.add('cs-reveal');
    card.classList.add(`cs-delay-${Math.min(index + 1, 3)}`);
    grid.append(card);
  });

  return section;
}

function buildNetworkGraphic() {
  return createStatic(`
    <div class="cs-network-visual" aria-hidden="true">
      <svg viewBox="0 0 400 400" role="presentation">
        <circle class="cs-network-glow" cx="200" cy="200" r="70"></circle>
        <g class="cs-network-lines">
          <line x1="200" y1="200" x2="100" y2="120"></line>
          <line x1="200" y1="200" x2="300" y2="100"></line>
          <line x1="200" y1="200" x2="320" y2="260"></line>
          <line x1="200" y1="200" x2="80" y2="280"></line>
          <line x1="200" y1="200" x2="200" y2="60"></line>
          <line x1="200" y1="200" x2="340" y2="170"></line>
          <line x1="200" y1="200" x2="60" y2="190"></line>
          <line x1="200" y1="200" x2="160" y2="340"></line>
          <line x1="200" y1="200" x2="280" y2="340"></line>
          <line x1="100" y1="120" x2="200" y2="60"></line>
          <line x1="300" y1="100" x2="340" y2="170"></line>
          <line x1="80" y1="280" x2="160" y2="340"></line>
          <line x1="160" y1="340" x2="280" y2="340"></line>
        </g>
        <g class="cs-network-dots">
          <circle class="cs-network-dot cs-network-dot--primary" cx="200" cy="200" r="9"></circle>
          <circle class="cs-network-dot" cx="100" cy="120" r="5"></circle>
          <circle class="cs-network-dot" cx="300" cy="100" r="5"></circle>
          <circle class="cs-network-dot" cx="320" cy="260" r="5"></circle>
          <circle class="cs-network-dot" cx="80" cy="280" r="5"></circle>
          <circle class="cs-network-dot" cx="200" cy="60" r="4"></circle>
          <circle class="cs-network-dot" cx="340" cy="170" r="4"></circle>
          <circle class="cs-network-dot" cx="60" cy="190" r="4"></circle>
          <circle class="cs-network-dot" cx="160" cy="340" r="4"></circle>
          <circle class="cs-network-dot" cx="280" cy="340" r="4"></circle>
        </g>
      </svg>
    </div>
  `);
}

export function buildNetwork(config, anchors, fieldSources) {
  const stats = [1, 2, 3, 4].map((index) => ({
    value: toText(config[`network-stat-${index}-value`]),
    suffix: toText(config[`network-stat-${index}-suffix`]),
    decimals: Number.parseInt(toText(config[`network-stat-${index}-decimals`]), 10) || 0,
    label: toText(config[`network-stat-${index}-label`]),
    subLabel: toText(config[`network-stat-${index}-sub-label`]),
    valueProp: `network-stat-${index}-value`,
    suffixProp: `network-stat-${index}-suffix`,
    labelProp: `network-stat-${index}-label`,
    subLabelProp: `network-stat-${index}-sub-label`,
  })).filter((stat) => stat.value || stat.label);

  const section = createStatic(`
    <section class="cs-section cs-network">
      <div class="cs-container cs-network-grid">
        <div class="cs-network-stats"></div>
        <div class="cs-network-copy cs-reveal"></div>
      </div>
    </section>
  `);

  section.id = anchors.network;

  const statsWrap = section.querySelector('.cs-network-stats');
  stats.forEach((stat, index) => {
    const card = createElement('article', {
      className: `cs-stat-card cs-reveal cs-delay-${Math.min(index + 1, 3)}`,
    });
    const number = createElement('strong', {
      className: 'cs-stat-number cs-counter',
      attrs: {
        'data-target': parseNumber(stat.value),
        'data-suffix': stat.suffix,
        'data-decimals': stat.decimals,
      },
    });
    const numberValue = createEditableElement('span', {
      text: formatCounterValue(parseNumber(stat.value), stat.decimals, ''),
      attrs: { 'data-counter-part': 'value' },
    }, stat.valueProp, fieldSources);
    number.append(numberValue);
    if (stat.suffix) {
      number.append(createEditableElement('span', {
        text: stat.suffix,
        attrs: { 'data-counter-part': 'suffix' },
      }, stat.suffixProp, fieldSources));
    }
    card.append(number);
    card.append(createEditableElement('p', {
      className: 'cs-card-copy',
      text: stat.label,
    }, stat.labelProp, fieldSources));
    if (stat.subLabel) {
      card.append(createEditableElement('span', {
        className: 'cs-stat-sub-label',
        text: stat.subLabel,
      }, stat.subLabelProp, fieldSources));
    }
    statsWrap.append(card);
  });

  const copy = section.querySelector('.cs-network-copy');
  const eyebrow = createEyebrow(config['network-eyebrow'], '', fieldSources, 'network-eyebrow');
  if (eyebrow) {
    copy.append(eyebrow);
  }

  const title = createElement('h2', { className: 'cs-section-title' });
  appendSplitHeadline(title, config['network-title'], '', fieldSources, 'network-title');
  copy.append(title);
  copy.append(createEditableElement('p', {
    className: 'cs-section-description',
    text: toText(config['network-description']),
  }, 'network-description', fieldSources));
  copy.append(buildNetworkGraphic());

  return section;
}

export function buildTestimonials(config, anchors, instanceId, fieldSources) {
  const testimonials = [1, 2, 3, 4, 5].map((index) => ({
    quote: toText(config[`testimonial-${index}-quote`]),
    initials: toText(config[`testimonial-${index}-initials`]),
    name: toText(config[`testimonial-${index}-name`]),
    roleLocation: toText(config[`testimonial-${index}-role-location`]),
    quoteProp: `testimonial-${index}-quote`,
    initialsProp: `testimonial-${index}-initials`,
    nameProp: `testimonial-${index}-name`,
    roleLocationProp: `testimonial-${index}-role-location`,
  })).filter((item) => item.quote);

  const section = createStatic(`
    <section class="cs-section cs-testimonials">
      <div class="cs-container">
        <div class="cs-section-heading cs-reveal"></div>
      </div>
      <div class="cs-testimonial-shell">
        <div class="cs-testimonial-track" id="${instanceId}-testimonial-track"></div>
        <div class="cs-testimonial-controls">
          <button type="button" class="cs-testimonial-button" aria-label="Previous testimonial">‹</button>
          <button type="button" class="cs-testimonial-button" aria-label="Next testimonial">›</button>
        </div>
      </div>
    </section>
  `);

  section.id = anchors.testimonials;

  const heading = section.querySelector('.cs-section-heading');
  const eyebrow = createEyebrow(config['testimonials-eyebrow'], '', fieldSources, 'testimonials-eyebrow');
  if (eyebrow) {
    heading.append(eyebrow);
  }

  const title = createElement('h2', { className: 'cs-section-title' });
  appendSplitHeadline(title, config['testimonials-title'], '', fieldSources, 'testimonials-title');
  heading.append(title);

  const track = section.querySelector('.cs-testimonial-track');
  testimonials.forEach((item) => {
    const card = createElement('article', {
      className: 'cs-testimonial-card',
    });
    card.append(createStars());
    card.append(createEditableElement('p', {
      className: 'cs-testimonial-quote',
      text: item.quote,
    }, item.quoteProp, fieldSources));

    const author = createElement('div', { className: 'cs-testimonial-author' });
    author.append(createEditableElement('span', {
      className: 'cs-testimonial-avatar',
      text: item.initials || item.name.slice(0, 2).toUpperCase(),
      attrs: { 'aria-hidden': 'true' },
    }, item.initialsProp, fieldSources));

    const textWrap = createElement('div');
    textWrap.append(createEditableElement('strong', {
      className: 'cs-testimonial-name',
      text: item.name,
    }, item.nameProp, fieldSources));
    textWrap.append(createEditableElement('span', {
      className: 'cs-testimonial-role',
      text: item.roleLocation,
    }, item.roleLocationProp, fieldSources));
    author.append(textWrap);
    card.append(author);
    track.append(card);
  });

  if (testimonials.length <= 1) {
    section.querySelector('.cs-testimonial-controls').remove();
  }

  return section;
}

export function buildFinalCta(config, anchors, fieldSources) {
  const section = createStatic(`
    <section class="cs-section cs-final-cta">
      <div class="cs-container">
        <div class="cs-cta-panel cs-reveal"></div>
      </div>
    </section>
  `);

  section.id = anchors.cta;

  const panel = section.querySelector('.cs-cta-panel');
  const title = createElement('h2', { className: 'cs-section-title cs-section-title--light' });
  appendSplitHeadline(title, config['final-cta-heading'], '', fieldSources, 'final-cta-heading');
  panel.append(title);
  panel.append(createEditableElement('p', {
    className: 'cs-feature-copy',
    text: toText(config['final-cta-body']),
  }, 'final-cta-body', fieldSources));

  const button = createButton(
    config['final-cta-label'],
    config['final-cta-url'],
    anchors,
    'cs-button cs-button--light',
    fieldSources,
    'final-cta-label',
  );

  if (button) {
    panel.append(button);
  }

  return section;
}

export function enhanceRevealAnimations(root) {
  const revealElements = [...root.querySelectorAll('.cs-reveal')];

  if (!revealElements.length) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  revealElements.forEach((element) => observer.observe(element));
}

export function enhancePlanToggle(root) {
  const section = root.querySelector('.cs-plans');
  const toggle = section?.querySelector('.cs-plan-toggle');

  if (!toggle) {
    return;
  }

  const labels = {
    monthly: section.querySelector('[data-mode-label="monthly"]'),
    annual: section.querySelector('[data-mode-label="annual"]'),
  };
  const prices = [...section.querySelectorAll('.cs-plan-price')];

  toggle.addEventListener('click', () => {
    const enabled = toggle.getAttribute('aria-pressed') === 'true';
    const nextMode = enabled ? 'monthly' : 'annual';

    toggle.setAttribute('aria-pressed', String(!enabled));
    labels.monthly?.classList.toggle('is-active', nextMode === 'monthly');
    labels.annual?.classList.toggle('is-active', nextMode === 'annual');

    prices.forEach((priceWrap) => {
      priceWrap.querySelectorAll('.cs-plan-price-value').forEach((price) => {
        price.hidden = price.dataset.priceMode !== nextMode;
      });
    });
  });
}

function animateCounter(element) {
  const target = Number.parseFloat(element.dataset.target || '0');
  const decimals = Number.parseInt(element.dataset.decimals || '0', 10);
  const suffix = element.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  const valueEl = element.querySelector('[data-counter-part="value"]');
  const suffixEl = element.querySelector('[data-counter-part="suffix"]');

  const setCounterText = (value) => {
    if (valueEl) {
      valueEl.textContent = formatCounterValue(value, decimals, '');
      if (suffixEl) {
        suffixEl.textContent = suffix;
      }
      return;
    }

    element.textContent = formatCounterValue(value, decimals, suffix);
  };

  const tick = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - ((1 - progress) ** 4);
    setCounterText(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setCounterText(target);
  };

  requestAnimationFrame(tick);
}

export function enhanceCounters(root) {
  const counters = [...root.querySelectorAll('.cs-counter')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.4,
  });

  counters.forEach((counter) => observer.observe(counter));
}

export function enhanceTestimonials(root) {
  const section = root.querySelector('.cs-testimonials');

  if (!section) {
    return;
  }

  const track = section.querySelector('.cs-testimonial-track');
  const buttons = section.querySelectorAll('.cs-testimonial-button');

  if (!track || buttons.length !== 2) {
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollByCard = (direction) => {
    const card = track.querySelector('.cs-testimonial-card');
    const width = card ? card.offsetWidth + 24 : 340;
    track.scrollBy({
      left: width * direction,
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  };

  buttons[0].addEventListener('click', () => scrollByCard(-1));
  buttons[1].addEventListener('click', () => scrollByCard(1));
}

export function pickRawConfig(raw, keys) {
  const picked = {};
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(raw, key)) {
      picked[key] = raw[key];
    }
  });
  return picked;
}

export function getHeroAvatarFallback(config) {
  return [
    toText(config['testimonial-1-initials']),
    toText(config['testimonial-2-initials']),
    toText(config['testimonial-3-initials']),
    toText(config['testimonial-4-initials']),
  ].filter(Boolean);
}

export function buildConfig(rawConfig) {
  return {
    ...DEFAULTS,
    ...rawConfig,
  };
}

export function buildAnchors(instanceId) {
  return {
    deals: `${instanceId}-deals`,
    devices: `${instanceId}-devices`,
    plans: `${instanceId}-plans`,
    network: `${instanceId}-network`,
    testimonials: `${instanceId}-testimonials`,
    cta: `${instanceId}-cta`,
  };
}

/**
 * @param {HTMLElement} block
 * @param {string[]} configKeys - Keys to merge from readBlockConfig (exclude anchor-namespace)
 * @param {(config: object, anchors: object, instanceId: string) => HTMLElement | null} buildFn
 * @param {('reveal'|'planToggle'|'counters'|'testimonials')[]} [enhancers]
 */
export function decorateCitisignalSection(block, configKeys, buildFn, enhancers = ['reveal', 'planToggle', 'counters', 'testimonials']) {
  ensureBlockInstrumentation(block);
  block.classList.add('citisignal-showcase');
  const raw = readBlockConfig(block);
  const fieldSources = buildFieldSources(block);
  const instanceId = toText(raw['anchor-namespace']) || DEFAULT_ANCHOR_NAMESPACE;
  const config = buildConfig(pickRawConfig(raw, configKeys));
  const anchors = buildAnchors(instanceId);
  const shell = createElement('div', { className: 'cs-shell' });
  const section = buildFn(config, anchors, instanceId, fieldSources);
  if (!section) {
    block.replaceChildren();
    return;
  }
  shell.append(section);
  block.replaceChildren(shell);
  if (enhancers.includes('reveal')) enhanceRevealAnimations(block);
  if (enhancers.includes('planToggle')) enhancePlanToggle(block);
  if (enhancers.includes('counters')) enhanceCounters(block);
  if (enhancers.includes('testimonials')) enhanceTestimonials(block);
}
