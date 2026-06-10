import { buildTestimonials, decorateCitisignalSection } from '../citisignal-showcase/citisignal-showcase-core.js';
import { TESTIMONIALS_CONFIG_KEYS } from '../citisignal-showcase/citisignal-showcase-keys.js';

export default function decorate(block) {
  decorateCitisignalSection(
    block,
    TESTIMONIALS_CONFIG_KEYS,
    (config, anchors, instanceId, fieldSources) => buildTestimonials(
      config,
      anchors,
      instanceId,
      fieldSources,
    ),
    ['reveal', 'testimonials'],
  );
}
