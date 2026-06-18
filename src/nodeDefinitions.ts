import type { NodeDefinition, BTNodeKind, BTNodeData, Language } from './types';

// The complete catalogue of node kinds the manager can place on the canvas.
// Each entry is bilingual and self-describes how it is configured and exported.
export const NODE_DEFINITIONS: NodeDefinition[] = [
  // ---- Composite nodes -------------------------------------------------
  {
    kind: 'selector',
    category: 'composite',
    glyph: '?',
    yamlType: 'Selector',
    label: { en: 'Selector', pl: 'Selektor' },
    description: {
      en: 'Runs each child in order until one succeeds (logical OR / priority).',
      pl: 'Uruchamia kolejne dzieci, aż jedno odniesie sukces (logiczne LUB / priorytet).',
    },
    params: [],
  },
  {
    kind: 'sequence',
    category: 'composite',
    glyph: '->',
    yamlType: 'Sequence',
    label: { en: 'Sequence', pl: 'Sekwencja' },
    description: {
      en: 'Runs children in order; stops if one fails (logical AND).',
      pl: 'Uruchamia dzieci po kolei; przerywa, gdy jedno zawiedzie (logiczne ORAZ).',
    },
    params: [],
  },

  // ---- Condition nodes -------------------------------------------------
  {
    kind: 'healthCheck',
    category: 'condition',
    glyph: '❤',
    yamlType: 'HealthBelow',
    label: { en: 'Health Check', pl: 'Sprawdzenie zdrowia' },
    description: {
      en: 'Succeeds when health drops below the threshold percentage.',
      pl: 'Zwraca sukces, gdy zdrowie spadnie poniżej progu procentowego.',
    },
    params: [
      {
        key: 'threshold',
        type: 'number',
        yamlKey: 'value',
        label: { en: 'Threshold Percentage', pl: 'Próg procentowy' },
        defaultValue: 35,
        min: 0,
        max: 100,
      },
    ],
  },
  {
    kind: 'cooldownStatus',
    category: 'condition',
    glyph: '⏱',
    yamlType: 'CooldownReady',
    label: { en: 'Cooldown Status', pl: 'Status odnowienia' },
    description: {
      en: 'Succeeds when the named ability is off cooldown.',
      pl: 'Zwraca sukces, gdy wskazana zdolność jest gotowa do użycia.',
    },
    params: [
      {
        key: 'ability',
        type: 'text',
        yamlKey: 'ability',
        label: { en: 'Ability ID / Name', pl: 'ID / nazwa zdolności' },
        defaultValue: 'dash',
      },
    ],
  },
  {
    kind: 'enemyDistance',
    category: 'condition',
    glyph: '⇔',
    yamlType: 'EnemyWithinRange',
    label: { en: 'Enemy Distance', pl: 'Dystans wroga' },
    description: {
      en: 'Succeeds when an enemy is within the given range (metres).',
      pl: 'Zwraca sukces, gdy wróg znajduje się w podanym zasięgu (metry).',
    },
    params: [
      {
        key: 'range',
        type: 'number',
        yamlKey: 'range',
        label: { en: 'Range (m)', pl: 'Zasięg (m)' },
        defaultValue: 10,
        min: 0,
        max: 1000,
      },
    ],
  },
  {
    kind: 'statusEffect',
    category: 'condition',
    glyph: '✨',
    yamlType: 'HasStatusEffect',
    label: { en: 'Status Effect', pl: 'Efekt statusu' },
    description: {
      en: 'Succeeds when the agent is under the selected status effect.',
      pl: 'Zwraca sukces, gdy agent znajduje się pod wybranym efektem statusu.',
    },
    params: [
      {
        key: 'effect',
        type: 'select',
        yamlKey: 'effect',
        label: { en: 'Effect', pl: 'Efekt' },
        defaultValue: 'stun',
        options: [
          { value: 'stun', label: { en: 'Stun', pl: 'Ogłuszenie' } },
          { value: 'root', label: { en: 'Root', pl: 'Unieruchomienie' } },
          { value: 'silence', label: { en: 'Silence', pl: 'Uciszenie' } },
          { value: 'slow', label: { en: 'Slow', pl: 'Spowolnienie' } },
        ],
      },
    ],
  },

  // ---- Action nodes ----------------------------------------------------
  {
    kind: 'castAbility',
    category: 'action',
    glyph: '⚡',
    yamlType: 'ExecuteAbility',
    label: { en: 'Cast Ability', pl: 'Rzuć zdolność' },
    description: {
      en: 'Executes the specified ability by ID or name.',
      pl: 'Wykonuje wskazaną zdolność według ID lub nazwy.',
    },
    params: [
      {
        key: 'ability',
        type: 'text',
        yamlKey: 'ability',
        label: { en: 'Ability ID / Name', pl: 'ID / nazwa zdolności' },
        defaultValue: 'health_potion',
      },
    ],
  },
  {
    kind: 'useItem',
    category: 'action',
    glyph: '\u{1F392}',
    yamlType: 'UseItem',
    label: { en: 'Use Item', pl: 'Użyj przedmiotu' },
    description: {
      en: 'Consumes or activates an item from the inventory.',
      pl: 'Zużywa lub aktywuje przedmiot z ekwipunku.',
    },
    params: [
      {
        key: 'item',
        type: 'text',
        yamlKey: 'item',
        label: { en: 'Item ID / Name', pl: 'ID / nazwa przedmiotu' },
        defaultValue: 'mana_elixir',
      },
    ],
  },
  {
    kind: 'moveTo',
    category: 'action',
    glyph: '\u{1F9ED}',
    yamlType: 'MoveToPosition',
    label: { en: 'Move To Position', pl: 'Przejdź do pozycji' },
    description: {
      en: 'Moves the agent to the target coordinates.',
      pl: 'Przemieszcza agenta do docelowych współrzędnych.',
    },
    params: [
      {
        key: 'x',
        type: 'number',
        yamlKey: 'x',
        label: { en: 'X Coordinate', pl: 'Współrzędna X' },
        defaultValue: 0,
      },
      {
        key: 'y',
        type: 'number',
        yamlKey: 'y',
        label: { en: 'Y Coordinate', pl: 'Współrzędna Y' },
        defaultValue: 0,
      },
    ],
  },
  {
    kind: 'interact',
    category: 'action',
    glyph: '\u{1F91D}',
    yamlType: 'InteractWithObject',
    label: { en: 'Interact With Object', pl: 'Wejdź w interakcję' },
    description: {
      en: 'Interacts with a world object (door, lever, chest, etc.).',
      pl: 'Wchodzi w interakcję z obiektem świata (drzwi, dźwignia, skrzynia itp.).',
    },
    params: [
      {
        key: 'target',
        type: 'text',
        yamlKey: 'target',
        label: { en: 'Target Object', pl: 'Obiekt docelowy' },
        defaultValue: 'lever_01',
      },
    ],
  },
];

export const DEFINITION_BY_KIND: Record<BTNodeKind, NodeDefinition> =
  NODE_DEFINITIONS.reduce((acc, def) => {
    acc[def.kind] = def;
    return acc;
  }, {} as Record<BTNodeKind, NodeDefinition>);

// Resolve the title shown for a node in the active language. A user-typed
// custom label wins; otherwise fall back to the bilingual preset label, then
// to the node definition's name.
export function nodeDisplayName(
  data: Pick<BTNodeData, 'kind' | 'customLabel' | 'labelI18n'>,
  lang: Language,
): string {
  const custom = data.customLabel.trim();
  if (custom) return custom;
  if (data.labelI18n) return data.labelI18n[lang];
  return DEFINITION_BY_KIND[data.kind].label[lang];
}

// Build the default parameter map for a freshly created node of a given kind.
export function defaultParamsFor(kind: BTNodeKind): Record<string, string | number> {
  const def = DEFINITION_BY_KIND[kind];
  const params: Record<string, string | number> = {};
  for (const p of def.params) {
    params[p.key] = p.defaultValue;
  }
  return params;
}
