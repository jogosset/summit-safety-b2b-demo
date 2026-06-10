import { buildDeals, decorateCitisignalSection } from '../citisignal-showcase/citisignal-showcase-core.js';
import { DEALS_CONFIG_KEYS } from '../citisignal-showcase/citisignal-showcase-keys.js';

export default function decorate(block) {
  decorateCitisignalSection(
    block,
    DEALS_CONFIG_KEYS,
    (config, anchors, _instanceId, fieldSources) => buildDeals(config, anchors, fieldSources),
    ['reveal'],
  );
}
