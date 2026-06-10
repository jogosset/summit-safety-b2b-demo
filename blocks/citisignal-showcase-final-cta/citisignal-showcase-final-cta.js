import { buildFinalCta, decorateCitisignalSection } from '../citisignal-showcase/citisignal-showcase-core.js';
import { FINAL_CTA_CONFIG_KEYS } from '../citisignal-showcase/citisignal-showcase-keys.js';

export default function decorate(block) {
  decorateCitisignalSection(
    block,
    FINAL_CTA_CONFIG_KEYS,
    (config, anchors, _instanceId, fieldSources) => buildFinalCta(config, anchors, fieldSources),
    ['reveal'],
  );
}
