import { buildPartners, decorateCitisignalSection } from '../citisignal-showcase/citisignal-showcase-core.js';
import { PARTNERS_CONFIG_KEYS } from '../citisignal-showcase/citisignal-showcase-keys.js';

export default function decorate(block) {
  decorateCitisignalSection(
    block,
    PARTNERS_CONFIG_KEYS,
    (config, anchors, _instanceId, fieldSources) => buildPartners(config, fieldSources),
    ['reveal'],
  );
}
