import { readBlockConfig } from '../../scripts/aem.js';
import {
  buildAnchors,
  buildConfig,
  buildDeals,
  buildFeatured,
  buildFinalCta,
  buildHero,
  buildNetwork,
  buildPartners,
  buildPlans,
  buildTestimonials,
  createElement,
  enhanceCounters,
  enhancePlanToggle,
  enhanceRevealAnimations,
  enhanceTestimonials,
} from './citisignal-showcase-core.js';

let showcaseCount = 0;

function toText(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(' ');
  }

  if (value === undefined || value === null) {
    return '';
  }

  return String(value).trim();
}

export default function decorate(block) {
  showcaseCount += 1;
  const instanceId = `citisignal-showcase-${showcaseCount}`;
  const config = buildConfig(readBlockConfig(block));
  const anchors = buildAnchors(instanceId);
  const shell = createElement('div', {
    className: 'cs-shell',
    attrs: { id: instanceId },
  });

  const avatarFallback = [
    toText(config['testimonial-1-initials']),
    toText(config['testimonial-2-initials']),
    toText(config['testimonial-3-initials']),
    toText(config['testimonial-4-initials']),
  ].filter(Boolean);

  [
    buildHero(config, anchors, avatarFallback),
    buildPartners(config),
    buildDeals(config, anchors),
    buildFeatured(config, anchors),
    buildPlans(config, anchors),
    buildNetwork(config, anchors),
    buildTestimonials(config, anchors, instanceId),
    buildFinalCta(config, anchors),
  ].filter(Boolean).forEach((section) => shell.append(section));

  block.replaceChildren(shell);

  enhanceRevealAnimations(block);
  enhancePlanToggle(block);
  enhanceCounters(block);
  enhanceTestimonials(block);
}
