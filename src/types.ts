import type { Node, Edge } from 'reactflow';

export type Language = 'en' | 'pl';

export type NodeCategory = 'composite' | 'condition' | 'action';

// Every concrete kind of node available in the palette.
export type BTNodeKind =
  | 'selector'
  | 'sequence'
  | 'healthCheck'
  | 'cooldownStatus'
  | 'enemyDistance'
  | 'statusEffect'
  | 'castAbility'
  | 'useItem'
  | 'moveTo'
  | 'interact';

// The kind of UI control a parameter is edited with.
export type ParamType = 'number' | 'text' | 'select';

export interface ParamOption {
  value: string;
  // Display labels per language.
  label: { en: string; pl: string };
}

export interface ParamDefinition {
  key: string;
  type: ParamType;
  label: { en: string; pl: string };
  defaultValue: string | number;
  // For 'select' params only.
  options?: ParamOption[];
  // For 'number' params only.
  min?: number;
  max?: number;
  // The YAML key this param is emitted under (e.g. "value", "ability").
  yamlKey: string;
}

// Static catalogue entry describing how a node kind behaves.
export interface NodeDefinition {
  kind: BTNodeKind;
  category: NodeCategory;
  label: { en: string; pl: string };
  description: { en: string; pl: string };
  // Short glyph shown on the node (e.g. "?" for Selector).
  glyph: string;
  // The `type` string written to the exported YAML.
  yamlType: string;
  params: ParamDefinition[];
}

// The mutable data carried by each node instance on the canvas.
export interface BTNodeData {
  kind: BTNodeKind;
  category: NodeCategory;
  // User-defined custom title. When set, it wins and is shown verbatim.
  customLabel: string;
  // Bilingual default title (e.g. from an example preset). Used when the user
  // hasn't typed a custom label, so the title follows the active language.
  labelI18n?: { en: string; pl: string };
  // Current parameter values keyed by ParamDefinition.key.
  params: Record<string, string | number>;
}

export type BTNode = Node<BTNodeData>;
export type BTEdge = Edge;
