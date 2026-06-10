import { buildNetwork, decorateCitisignalSection } from '../citisignal-showcase/citisignal-showcase-core.js';
import { NETWORK_CONFIG_KEYS } from '../citisignal-showcase/citisignal-showcase-keys.js';

export default function decorate(block) {
  decorateCitisignalSection(
    block,
    NETWORK_CONFIG_KEYS,
    (config, anchors, _instanceId, fieldSources) => buildNetwork(config, anchors, fieldSources),
    ['reveal', 'counters'],
  );
}
