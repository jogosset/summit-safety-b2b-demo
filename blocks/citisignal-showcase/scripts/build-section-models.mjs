import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DEALS_CONFIG_KEYS,
  FEATURED_CONFIG_KEYS,
  FINAL_CTA_CONFIG_KEYS,
  HERO_CONFIG_KEYS,
  NETWORK_CONFIG_KEYS,
  PARTNERS_CONFIG_KEYS,
  PLANS_CONFIG_KEYS,
  TESTIMONIALS_CONFIG_KEYS,
} from '../citisignal-showcase-keys.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..', '..');
const componentModelsPath = path.join(root, 'component-models.json');

const anchorField = {
  component: 'text',
  name: 'anchor-namespace',
  label: 'Anchor Namespace',
  valueType: 'string',
  value: 'citisignal-showcase-1',
};

const sections = [
  { id: 'citisignal-showcase-hero', title: 'CitiSignal Showcase Hero', keys: HERO_CONFIG_KEYS },
  { id: 'citisignal-showcase-partners', title: 'CitiSignal Showcase Partners', keys: PARTNERS_CONFIG_KEYS },
  { id: 'citisignal-showcase-deals', title: 'CitiSignal Showcase Deals', keys: DEALS_CONFIG_KEYS },
  { id: 'citisignal-showcase-featured', title: 'CitiSignal Showcase Featured Product', keys: FEATURED_CONFIG_KEYS },
  { id: 'citisignal-showcase-plans', title: 'CitiSignal Showcase Plans', keys: PLANS_CONFIG_KEYS },
  { id: 'citisignal-showcase-network', title: 'CitiSignal Showcase Network', keys: NETWORK_CONFIG_KEYS },
  { id: 'citisignal-showcase-testimonials', title: 'CitiSignal Showcase Testimonials', keys: TESTIMONIALS_CONFIG_KEYS },
  { id: 'citisignal-showcase-final-cta', title: 'CitiSignal Showcase Final CTA', keys: FINAL_CTA_CONFIG_KEYS },
];

const data = JSON.parse(fs.readFileSync(componentModelsPath, 'utf8'));
const showcase = data.find((m) => m.id === 'citisignal-showcase');
if (!showcase) {
  throw new Error('citisignal-showcase model not found');
}

const fieldByName = new Map(showcase.fields.map((f) => [f.name, f]));

for (const { id, title, keys } of sections) {
  const fields = [anchorField, ...keys.map((name) => {
    const f = fieldByName.get(name);
    if (!f) {
      throw new Error(`Missing field: ${name}`);
    }
    return f;
  })];
  const out = {
    definitions: [
      {
        title,
        id,
        model: id,
        plugins: { da: { type: 'key-value-block' } },
      },
    ],
    models: [{ id, fields }],
    filters: [],
  };
  const dir = path.join(root, 'blocks', id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `_${id}.json`), `${JSON.stringify(out, null, 2)}\n`);
}

console.log('Wrote 8 _*.json files');
