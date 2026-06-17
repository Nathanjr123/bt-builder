import type { BTNode, BTEdge } from './types';

export interface ExamplePreset {
  id: string;
  name: { en: string; pl: string };
  description: { en: string; pl: string };
  nodes: BTNode[];
  edges: BTEdge[];
}

// --- Preset 1: Combat priorities -----------------------------------------
// Mirrors the export blueprint: heal in an emergency, otherwise engage.
const combatNodes: BTNode[] = [
  {
    id: 'c-root',
    type: 'btNode',
    position: { x: 360, y: 20 },
    data: { kind: 'selector', category: 'composite', customLabel: 'Root Priority', params: {} },
  },
  {
    id: 'c-seq-heal',
    type: 'btNode',
    position: { x: 120, y: 180 },
    data: { kind: 'sequence', category: 'composite', customLabel: 'Emergency Healing', params: {} },
  },
  {
    id: 'c-cond-health',
    type: 'btNode',
    position: { x: 20, y: 360 },
    data: {
      kind: 'healthCheck',
      category: 'condition',
      customLabel: 'Health Below 35%',
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
      customLabel: 'Drink Health Potion',
      params: { ability: 'health_potion' },
    },
  },
  {
    id: 'c-seq-attack',
    type: 'btNode',
    position: { x: 560, y: 180 },
    data: { kind: 'sequence', category: 'composite', customLabel: 'Engage Enemy', params: {} },
  },
  {
    id: 'c-cond-range',
    type: 'btNode',
    position: { x: 470, y: 360 },
    data: {
      kind: 'enemyDistance',
      category: 'condition',
      customLabel: 'Enemy In Range',
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
      customLabel: 'Cast Fireball',
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
const survivalNodes: BTNode[] = [
  {
    id: 's-root',
    type: 'btNode',
    position: { x: 420, y: 20 },
    data: { kind: 'selector', category: 'composite', customLabel: 'Survival Priority', params: {} },
  },
  {
    id: 's-seq-retreat',
    type: 'btNode',
    position: { x: 100, y: 180 },
    data: { kind: 'sequence', category: 'composite', customLabel: 'Retreat When Low', params: {} },
  },
  {
    id: 's-cond-hp',
    type: 'btNode',
    position: { x: 0, y: 360 },
    data: {
      kind: 'healthCheck',
      category: 'condition',
      customLabel: 'Critically Hurt',
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
      customLabel: 'Flee To Safe Zone',
      params: { x: -50, y: 0 },
    },
  },
  {
    id: 's-seq-heal',
    type: 'btNode',
    position: { x: 430, y: 180 },
    data: { kind: 'sequence', category: 'composite', customLabel: 'Cooldown Heal', params: {} },
  },
  {
    id: 's-cond-cd',
    type: 'btNode',
    position: { x: 360, y: 360 },
    data: {
      kind: 'cooldownStatus',
      category: 'condition',
      customLabel: 'Second Wind Ready',
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
      customLabel: 'Cast Second Wind',
      params: { ability: 'second_wind' },
    },
  },
  {
    id: 's-seq-patrol',
    type: 'btNode',
    position: { x: 760, y: 180 },
    data: { kind: 'sequence', category: 'composite', customLabel: 'Default Patrol', params: {} },
  },
  {
    id: 's-act-patrol',
    type: 'btNode',
    position: { x: 760, y: 360 },
    data: {
      kind: 'moveTo',
      category: 'action',
      customLabel: 'Walk Patrol Route',
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

// Convenience exports for the default preset (used by the smoke test).
export const EXAMPLE_NODES = combatNodes;
export const EXAMPLE_EDGES = combatEdges;
