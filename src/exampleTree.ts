import type { BTNode, BTNodeData, BTEdge, Language } from './types';

// Example nodes carry bilingual labels so a preset loaded in Polish shows
// Polish node titles on the canvas (and English in English). They are
// "materialised" into plain BTNodes for the active language at load time.
type LabeledNodeData = Omit<BTNodeData, 'customLabel'> & {
  customLabel: { en: string; pl: string };
};
type LabeledNode = Omit<BTNode, 'data'> & { data: LabeledNodeData };

export interface ExamplePreset {
  id: string;
  name: { en: string; pl: string };
  description: { en: string; pl: string };
  nodes: LabeledNode[];
  edges: BTEdge[];
}

// --- Preset 1: Combat priorities -----------------------------------------
// Mirrors the export blueprint: heal in an emergency, otherwise engage.
const combatNodes: LabeledNode[] = [
  {
    id: 'c-root',
    type: 'btNode',
    position: { x: 360, y: 20 },
    data: {
      kind: 'selector',
      category: 'composite',
      customLabel: { en: 'Root Priority', pl: 'Priorytet główny' },
      params: {},
    },
  },
  {
    id: 'c-seq-heal',
    type: 'btNode',
    position: { x: 120, y: 180 },
    data: {
      kind: 'sequence',
      category: 'composite',
      customLabel: { en: 'Emergency Healing', pl: 'Awaryjne leczenie' },
      params: {},
    },
  },
  {
    id: 'c-cond-health',
    type: 'btNode',
    position: { x: 20, y: 360 },
    data: {
      kind: 'healthCheck',
      category: 'condition',
      customLabel: { en: 'Health Below 35%', pl: 'Zdrowie poniżej 35%' },
      params: { threshold: 35 },
    },
  },
  {
    id: 'c-act-potion',
    type: 'btNode',
    position: { x: 230, y: 360 },
    data: {
      kind: 'castAbility',
      category: 'action',
      customLabel: { en: 'Drink Health Potion', pl: 'Wypij miksturę zdrowia' },
      params: { ability: 'health_potion' },
    },
  },
  {
    id: 'c-seq-attack',
    type: 'btNode',
    position: { x: 560, y: 180 },
    data: {
      kind: 'sequence',
      category: 'composite',
      customLabel: { en: 'Engage Enemy', pl: 'Zaatakuj wroga' },
      params: {},
    },
  },
  {
    id: 'c-cond-range',
    type: 'btNode',
    position: { x: 470, y: 360 },
    data: {
      kind: 'enemyDistance',
      category: 'condition',
      customLabel: { en: 'Enemy In Range', pl: 'Wróg w zasięgu' },
      params: { range: 12 },
    },
  },
  {
    id: 'c-act-cast',
    type: 'btNode',
    position: { x: 680, y: 360 },
    data: {
      kind: 'castAbility',
      category: 'action',
      customLabel: { en: 'Cast Fireball', pl: 'Rzuć kulę ognia' },
      params: { ability: 'fireball' },
    },
  },
];

const combatEdges: BTEdge[] = [
  { id: 'ce1', source: 'c-root', target: 'c-seq-heal', type: 'smoothstep' },
  { id: 'ce2', source: 'c-root', target: 'c-seq-attack', type: 'smoothstep' },
  { id: 'ce3', source: 'c-seq-heal', target: 'c-cond-health', type: 'smoothstep' },
  { id: 'ce4', source: 'c-seq-heal', target: 'c-act-potion', type: 'smoothstep' },
  { id: 'ce5', source: 'c-seq-attack', target: 'c-cond-range', type: 'smoothstep' },
  { id: 'ce6', source: 'c-seq-attack', target: 'c-act-cast', type: 'smoothstep' },
];

// --- Preset 2: Survival & patrol -----------------------------------------
// Retreat when badly hurt, use a cooldown heal if ready, otherwise patrol.
const survivalNodes: LabeledNode[] = [
  {
    id: 's-root',
    type: 'btNode',
    position: { x: 420, y: 20 },
    data: {
      kind: 'selector',
      category: 'composite',
      customLabel: { en: 'Survival Priority', pl: 'Priorytet przetrwania' },
      params: {},
    },
  },
  {
    id: 's-seq-retreat',
    type: 'btNode',
    position: { x: 100, y: 180 },
    data: {
      kind: 'sequence',
      category: 'composite',
      customLabel: { en: 'Retreat When Low', pl: 'Wycofaj się przy niskim zdrowiu' },
      params: {},
    },
  },
  {
    id: 's-cond-hp',
    type: 'btNode',
    position: { x: 0, y: 360 },
    data: {
      kind: 'healthCheck',
      category: 'condition',
      customLabel: { en: 'Critically Hurt', pl: 'Krytycznie ranny' },
      params: { threshold: 25 },
    },
  },
  {
    id: 's-act-flee',
    type: 'btNode',
    position: { x: 210, y: 360 },
    data: {
      kind: 'moveTo',
      category: 'action',
      customLabel: { en: 'Flee To Safe Zone', pl: 'Uciekaj do bezpiecznej strefy' },
      params: { x: -50, y: 0 },
    },
  },
  {
    id: 's-seq-heal',
    type: 'btNode',
    position: { x: 430, y: 180 },
    data: {
      kind: 'sequence',
      category: 'composite',
      customLabel: { en: 'Cooldown Heal', pl: 'Leczenie z odnowienia' },
      params: {},
    },
  },
  {
    id: 's-cond-cd',
    type: 'btNode',
    position: { x: 360, y: 360 },
    data: {
      kind: 'cooldownStatus',
      category: 'condition',
      customLabel: { en: 'Second Wind Ready', pl: 'Drugi oddech gotowy' },
      params: { ability: 'second_wind' },
    },
  },
  {
    id: 's-act-heal',
    type: 'btNode',
    position: { x: 560, y: 360 },
    data: {
      kind: 'castAbility',
      category: 'action',
      customLabel: { en: 'Cast Second Wind', pl: 'Rzuć drugi oddech' },
      params: { ability: 'second_wind' },
    },
  },
  {
    id: 's-seq-patrol',
    type: 'btNode',
    position: { x: 760, y: 180 },
    data: {
      kind: 'sequence',
      category: 'composite',
      customLabel: { en: 'Default Patrol', pl: 'Domyślny patrol' },
      params: {},
    },
  },
  {
    id: 's-act-patrol',
    type: 'btNode',
    position: { x: 760, y: 360 },
    data: {
      kind: 'moveTo',
      category: 'action',
      customLabel: { en: 'Walk Patrol Route', pl: 'Idź trasą patrolu' },
      params: { x: 100, y: 0 },
    },
  },
];

const survivalEdges: BTEdge[] = [
  { id: 'se1', source: 's-root', target: 's-seq-retreat', type: 'smoothstep' },
  { id: 'se2', source: 's-root', target: 's-seq-heal', type: 'smoothstep' },
  { id: 'se3', source: 's-root', target: 's-seq-patrol', type: 'smoothstep' },
  { id: 'se4', source: 's-seq-retreat', target: 's-cond-hp', type: 'smoothstep' },
  { id: 'se5', source: 's-seq-retreat', target: 's-act-flee', type: 'smoothstep' },
  { id: 'se6', source: 's-seq-heal', target: 's-cond-cd', type: 'smoothstep' },
  { id: 'se7', source: 's-seq-heal', target: 's-act-heal', type: 'smoothstep' },
  { id: 'se8', source: 's-seq-patrol', target: 's-act-patrol', type: 'smoothstep' },
];

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  {
    id: 'combat',
    name: { en: 'Combat Priorities', pl: 'Priorytety walki' },
    description: {
      en: 'Heal in an emergency, otherwise close in and attack the enemy.',
      pl: 'Lecz się w nagłym wypadku, w przeciwnym razie zbliż się i atakuj wroga.',
    },
    nodes: combatNodes,
    edges: combatEdges,
  },
  {
    id: 'survival',
    name: { en: 'Survival & Patrol', pl: 'Przetrwanie i patrol' },
    description: {
      en: 'Retreat when critically hurt, use a cooldown heal if ready, else patrol.',
      pl: 'Wycofaj się przy krytycznych obrażeniach, użyj leczenia, w przeciwnym razie patroluj.',
    },
    nodes: survivalNodes,
    edges: survivalEdges,
  },
];

// Resolve a preset's bilingual node labels into plain BTNodes for one language.
export function materializeExampleNodes(nodes: LabeledNode[], lang: Language): BTNode[] {
  return nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      customLabel: n.data.customLabel[lang],
      params: { ...n.data.params },
    },
  }));
}

// Convenience exports for the default preset (used by the smoke test).
export const EXAMPLE_NODES = materializeExampleNodes(combatNodes, 'en');
export const EXAMPLE_EDGES = combatEdges;
