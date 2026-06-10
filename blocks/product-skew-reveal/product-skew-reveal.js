import { createOptimizedPicture, toClassName } from '../../scripts/aem.js';

const HEADER_FIELD_COUNT = 3;
const REVEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const TILE_DELAY_STEP = 180;

const ALIGNMENTS = new Set(['left', 'right']);
const VARIANTS = new Set(['product', 'media']);
const SPANS = new Set(['standard', 'wide']);
const BACKGROUNDS = new Set(['dark', 'neutral', 'green', 'peach', 'pink']);
const SHAPES = new Set(['none', 'bottle', 'can']);

function createTag(tagName, options = {}) {
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

function getCellText(cell) {
  if (!cell) {
    return '';
  }

  const link = cell.querySelector('a[href]');
  if (link) {
    return link.href || link.textContent.trim();
  }

  const paragraphs = [...cell.querySelectorAll('p')]
    .map((paragraph) => paragraph.textContent.trim())
    .filter(Boolean);

  if (paragraphs.length) {
    return paragraphs.join('\n');
  }

  return cell.textContent.trim();
}

function getCellImage(cell) {
  if (!cell) {
    return null;
  }

  const img = cell.querySelector('picture img, img');

  if (!img) {
    return null;
  }

  return {
    src: img.currentSrc || img.src,
    alt: img.alt || '',
  };
}

function splitLines(value) {
  return String(value || '')
    .split(/\s*\|\s*|\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeChoice(value, allowedValues, fallback) {
  const normalized = toClassName(String(value || ''));
  return allowedValues.has(normalized) ? normalized : fallback;
}

function buildHeaderConfig(columns) {
  return {
    title: getCellText(columns[0]),
    subtitleLines: splitLines(getCellText(columns[1])),
    alignment: normalizeChoice(getCellText(columns[2]), ALIGNMENTS, 'left'),
  };
}

function buildTileConfig(columns) {
  const image = getCellImage(columns[6]);
  const imageAlt = getCellText(columns[7]) || image?.alt || '';

  return {
    variant: normalizeChoice(getCellText(columns[0]), VARIANTS, 'product'),
    span: normalizeChoice(getCellText(columns[1]), SPANS, 'standard'),
    label: getCellText(columns[2]),
    name: getCellText(columns[3]),
    link: getCellText(columns[4]),
    backgroundStyle: normalizeChoice(getCellText(columns[5]), BACKGROUNDS, 'neutral'),
    imageSrc: image?.src || '',
    imageAlt,
    videoUrl: getCellText(columns[8]),
    fallbackShape: normalizeChoice(getCellText(columns[9]), SHAPES, 'none'),
  };
}

function isTileRow(columns) {
  const firstCell = getCellText(columns[0]);
  return VARIANTS.has(normalizeChoice(firstCell, VARIANTS, ''));
}

function parseBlock(block) {
  const header = {
    title: '',
    subtitleLines: [],
    alignment: 'left',
  };
  const tiles = [];

  [...block.children].forEach((row) => {
    const columns = [...row.children];

    if (isTileRow(columns)) {
      tiles.push(buildTileConfig(columns));
      return;
    }

    if (columns.length >= HEADER_FIELD_COUNT && !header.title && !header.subtitleLines.length) {
      Object.assign(header, buildHeaderConfig(columns));
    }
  });

  return { header, tiles };
}

function buildHeader(header) {
  const sectionHeader = createTag('header', {
    className: `psr-section-header psr-align-${header.alignment}`,
  });

  if (header.title) {
    const title = createTag('h2', { className: 'psr-section-title' });
    title.append(createTag('span', {
      className: 'psr-title-inner is-visible',
      text: header.title,
      attrs: {
        'data-psr-reveal': true,
        'data-psr-delay': '0',
      },
    }));
    sectionHeader.append(title);
  }

  if (header.subtitleLines.length) {
    const subtitle = createTag('div', { className: 'psr-section-subtitle' });
    header.subtitleLines.forEach((line, index) => {
      const wrap = createTag('span', { className: 'psr-subtitle-line' });
      wrap.append(createTag('span', {
        className: 'psr-subtitle-inner is-visible',
        text: line,
        attrs: {
          'data-psr-reveal': true,
          'data-psr-delay': String(index * TILE_DELAY_STEP),
        },
      }));
      subtitle.append(wrap);
    });
    sectionHeader.append(subtitle);
  }

  return sectionHeader;
}

function buildPicture(src, alt, className, breakpoints) {
  if (!src) {
    return null;
  }

  const picture = createOptimizedPicture(src, alt, false, breakpoints);
  picture.classList.add(className);
  return picture;
}

function buildFallbackShape(shape) {
  if (shape === 'none') {
    return null;
  }

  const wrap = createTag('div', {
    className: 'psr-product-fallback',
    attrs: { 'aria-hidden': 'true' },
  });

  if (shape === 'bottle') {
    wrap.append(createTag('div', { className: 'psr-shape psr-shape-bottle' }));
    return wrap;
  }

  wrap.append(createTag('div', { className: 'psr-shape psr-shape-can' }));
  return wrap;
}

function getTileAriaLabel(tile) {
  const parts = [tile.label, tile.name].filter(Boolean);
  return parts.join(' - ');
}

function buildProductMedia(tile) {
  const media = createTag('div', { className: 'psr-product-media' });

  if (tile.imageSrc) {
    const picture = buildPicture(
      tile.imageSrc,
      tile.imageAlt,
      'psr-product-picture',
      [{ media: '(min-width: 900px)', width: '900' }, { width: '700' }],
    );

    if (picture) {
      media.append(picture);
      return media;
    }
  }

  const fallback = buildFallbackShape(tile.fallbackShape);
  if (fallback) {
    media.append(fallback);
  }

  return media;
}

function buildMediaBackground(tile) {
  const background = createTag('div', {
    className: `psr-tile-bg psr-bg-${tile.backgroundStyle}`,
  });

  if (tile.imageSrc) {
    const picture = buildPicture(
      tile.imageSrc,
      tile.imageAlt,
      'psr-media-picture',
      [{ media: '(min-width: 900px)', width: '1400' }, { width: '900' }],
    );

    if (picture) {
      background.append(picture);
    }
  }

  background.append(createTag('div', { className: 'psr-media-overlay', attrs: { 'aria-hidden': 'true' } }));
  return background;
}

function buildVideoNode(videoUrl) {
  let url;

  try {
    url = new URL(videoUrl, window.location.href);
  } catch (error) {
    return null;
  }

  const isYouTube = url.hostname.includes('youtube') || url.hostname.includes('youtu.be');
  if (isYouTube) {
    const videoId = url.hostname.includes('youtu.be')
      ? url.pathname.split('/').filter(Boolean).pop()
      : url.searchParams.get('v');

    if (!videoId) {
      return null;
    }

    const iframe = createTag('iframe', {
      className: 'psr-media-video-frame',
      attrs: {
        src: `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`
          + '?autoplay=1&mute=1&controls=0&loop=1'
          + `&playlist=${encodeURIComponent(videoId)}&playsinline=1&rel=0`,
        title: 'Background video',
        loading: 'lazy',
        allow: 'autoplay; fullscreen; picture-in-picture',
        tabindex: '-1',
        'aria-hidden': 'true',
      },
    });

    const wrap = createTag('div', { className: 'psr-media-video' });
    wrap.append(iframe);
    return wrap;
  }

  if (url.hostname.includes('vimeo')) {
    const videoId = url.pathname.split('/').filter(Boolean).pop();

    if (!videoId) {
      return null;
    }

    const iframe = createTag('iframe', {
      className: 'psr-media-video-frame',
      attrs: {
        src: `https://player.vimeo.com/video/${encodeURIComponent(videoId)}`
          + '?background=1&autoplay=1&loop=1&muted=1',
        title: 'Background video',
        loading: 'lazy',
        allow: 'autoplay; fullscreen; picture-in-picture',
        tabindex: '-1',
        'aria-hidden': 'true',
      },
    });

    const wrap = createTag('div', { className: 'psr-media-video' });
    wrap.append(iframe);
    return wrap;
  }

  const video = createTag('video', {
    className: 'psr-media-video-element',
    attrs: {
      autoplay: true,
      muted: true,
      loop: true,
      playsinline: true,
      'aria-hidden': 'true',
    },
  });

  video.append(createTag('source', {
    attrs: {
      src: url.href,
      type: `video/${url.pathname.split('.').pop() || 'mp4'}`,
    },
  }));

  const wrap = createTag('div', { className: 'psr-media-video' });
  wrap.append(video);
  return wrap;
}

function buildTile(tile, index) {
  const TagName = tile.link ? 'a' : 'article';
  const tileClasses = [
    'psr-tile',
    `psr-tile-${tile.variant}`,
    `psr-tile-${tile.span}`,
    `psr-bg-${tile.backgroundStyle}`,
  ].join(' ');
  const tileAttrs = {
    'data-psr-delay': String(index * TILE_DELAY_STEP),
  };

  if (tile.link) {
    tileAttrs.href = tile.link;
    tileAttrs['aria-label'] = getTileAriaLabel(tile) || undefined;
  }

  if (tile.variant === 'media' && tile.videoUrl) {
    tileAttrs['data-video-url'] = tile.videoUrl;
  }

  const tileEl = createTag(TagName, {
    className: tileClasses,
    attrs: tileAttrs,
  });

  if (tile.variant === 'media') {
    tileEl.append(buildMediaBackground(tile));
  } else {
    tileEl.append(createTag('div', {
      className: `psr-tile-bg psr-bg-${tile.backgroundStyle} psr-gradient-bg`,
      attrs: { 'aria-hidden': 'true' },
    }));
    tileEl.append(buildProductMedia(tile));
  }

  if (tile.label || tile.name) {
    const content = createTag('div', { className: 'psr-tile-content' });

    if (tile.label) {
      content.append(createTag('span', {
        className: 'psr-tile-label',
        text: tile.label,
      }));
    }

    if (tile.name) {
      content.append(createTag('span', {
        className: 'psr-tile-name',
        text: tile.name,
      }));
    }

    tileEl.append(content);
  }

  return tileEl;
}

function revealImmediately(root) {
  root.querySelectorAll('[data-psr-reveal], .psr-tile').forEach((element) => {
    element.classList.add('is-visible');
  });
}

function revealElements(elements) {
  elements.forEach((element) => {
    const delay = Number.parseInt(element.dataset.psrDelay || '0', 10);
    window.setTimeout(() => element.classList.add('is-visible'), delay);
  });
}

function isElementNearViewport(element, threshold = 0.92) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  return rect.top < viewportHeight * threshold && rect.bottom > 0;
}

function enhanceHeaderReveal(root) {
  const header = root.querySelector('.psr-section-header');
  if (!header) {
    return;
  }

  const lines = [...header.querySelectorAll('[data-psr-reveal]')];
  if (!lines.length) {
    return;
  }

  if (isElementNearViewport(header)) {
    revealElements(lines);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      revealElements(lines);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -8% 0px',
  });

  observer.observe(header);

  window.setTimeout(() => {
    if (!lines.some((line) => line.classList.contains('is-visible')) && isElementNearViewport(header, 1.1)) {
      revealElements(lines);
      observer.unobserve(header);
    }
  }, 250);
}

function enhanceTileReveal(root) {
  const tiles = [...root.querySelectorAll('.psr-tile')];
  if (!tiles.length) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const delay = Number.parseInt(entry.target.dataset.psrDelay || '0', 10);
      window.setTimeout(() => entry.target.classList.add('is-visible'), delay);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -5% 0px',
  });

  tiles.forEach((tile) => observer.observe(tile));
}

function enhanceMediaTiles(root, reducedMotion) {
  const mediaTiles = [...root.querySelectorAll('.psr-tile-media[data-video-url]')];

  if (!mediaTiles.length || reducedMotion) {
    return;
  }

  const loadVideo = (tile) => {
    if (tile.dataset.videoLoaded === 'true') {
      return;
    }

    const videoNode = buildVideoNode(tile.dataset.videoUrl);
    if (!videoNode) {
      tile.dataset.videoLoaded = 'failed';
      return;
    }

    const background = tile.querySelector('.psr-tile-bg');
    if (!background) {
      return;
    }

    background.append(videoNode);
    tile.dataset.videoLoaded = 'true';
  };

  if (!('IntersectionObserver' in window)) {
    mediaTiles.forEach(loadVideo);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      loadVideo(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.25,
  });

  mediaTiles.forEach((tile) => observer.observe(tile));
}

export default function decorate(block) {
  const { header, tiles } = parseBlock(block);
  const shell = createTag('section', { className: 'psr-shell' });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const shouldAnimate = !reducedMotion && 'IntersectionObserver' in window;

  if (header.title || header.subtitleLines.length) {
    shell.append(buildHeader(header));
  }

  const grid = createTag('div', { className: 'psr-grid' });
  tiles.forEach((tile, index) => grid.append(buildTile(tile, index)));
  shell.append(grid);

  block.replaceChildren(shell);

  if (!shouldAnimate) {
    revealImmediately(block);
  } else {
    block.classList.add('psr-animate');
    window.requestAnimationFrame(() => {
      enhanceHeaderReveal(block);
      enhanceTileReveal(block);
    });
  }

  enhanceMediaTiles(block, reducedMotion);
  block.style.setProperty('--psr-ease', REVEAL_EASE);
}
