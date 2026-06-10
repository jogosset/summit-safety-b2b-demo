import {
  buildHeroV2,
  decorateCitisignalSection,
  getHeroAvatarFallback,
} from '../citisignal-showcase/citisignal-showcase-core.js';
import { HERO_V2_CONFIG_KEYS } from '../citisignal-showcase/citisignal-showcase-keys.js';

export default function decorate(block) {
  decorateCitisignalSection(
    block,
    HERO_V2_CONFIG_KEYS,
    (config, anchors, _instanceId, fieldSources) => buildHeroV2(
      config,
      anchors,
      getHeroAvatarFallback(config),
      fieldSources,
    ),
    ['reveal', 'planToggle', 'counters', 'testimonials'],
  );
}
