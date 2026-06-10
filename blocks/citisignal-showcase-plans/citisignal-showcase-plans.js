import { buildPlans, decorateCitisignalSection } from '../citisignal-showcase/citisignal-showcase-core.js';
import { PLANS_CONFIG_KEYS } from '../citisignal-showcase/citisignal-showcase-keys.js';

export default function decorate(block) {
  decorateCitisignalSection(
    block,
    PLANS_CONFIG_KEYS,
    (config, anchors, _instanceId, fieldSources) => buildPlans(config, anchors, fieldSources),
    ['reveal', 'planToggle'],
  );
}
