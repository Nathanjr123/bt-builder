import { useMemo } from 'react';
import type { BTNode, BTEdge, Language } from '../types';
import { DEFINITION_BY_KIND } from '../nodeDefinitions';

export interface ValidationResult {
  warnings: string[];
}

interface ExportResult {
  yaml: string;
  validation: ValidationResult;
  rootId: string | null;
}

// Intermediate tree shape we serialise to YAML.
interface ExportedNode {
  type: string;
  name: string;
  params: Record<string, string | number>;
  conditions: ExportedNode[];
  actions: ExportedNode[];
  children: ExportedNode[];
}

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function formatScalar(value: string | number): string {
  if (typeof value === 'number') return String(value);
  // Numeric-looking strings are still emitted quoted to preserve intent
  // (e.g. an ability id like "012") unless it is a plain integer field.
  return `"${escapeYamlString(value)}"`;
}

// Build the export tree rooted at `rootId` by walking the edge graph.
function buildExportNode(
  nodeId: string,
  nodeById: Map<string, BTNode>,
  childrenByParent: Map<string, string[]>,
): ExportedNode {
  const node = nodeById.get(nodeId)!;
  const def = DEFINITION_BY_KIND[node.data.kind];

  const params: Record<string, string | number> = {};
  for (const p of def.params) {
    const raw = node.data.params[p.key];
    params[p.yamlKey] = raw ?? p.defaultValue;
  }

  const exported: ExportedNode = {
    type: def.yamlType,
    name: node.data.customLabel.trim() || def.label.en,
    params,
    conditions: [],
    actions: [],
    children: [],
  };

  const childIds = childrenByParent.get(nodeId) ?? [];
  for (const childId of childIds) {
    const child = nodeById.get(childId);
    if (!child) continue;
    const childExport = buildExportNode(childId, nodeById, childrenByParent);
    switch (child.data.category) {
      case 'condition':
        exported.conditions.push(childExport);
        break;
      case 'action':
        exported.actions.push(childExport);
        break;
      case 'composite':
        exported.children.push(childExport);
        break;
    }
  }

  return exported;
}

// Serialise a single node. `indent` is the column the node's keys sit at.
// `asListItem` controls whether the first key is prefixed with "- ".
function serialiseNode(node: ExportedNode, indent: number, asListItem: boolean): string {
  const pad = ' '.repeat(indent);
  const lines: string[] = [];
  const firstPrefix = asListItem ? `${' '.repeat(indent - 2)}- ` : pad;

  lines.push(`${firstPrefix}type: "${escapeYamlString(node.type)}"`);
  lines.push(`${pad}name: "${escapeYamlString(node.name)}"`);

  for (const [key, value] of Object.entries(node.params)) {
    lines.push(`${pad}${key}: ${formatScalar(value)}`);
  }

  const block = (label: string, items: ExportedNode[]) => {
    if (items.length === 0) return;
    lines.push(`${pad}${label}:`);
    for (const item of items) {
      lines.push(serialiseNode(item, indent + 4, true));
    }
  };

  block('conditions', node.conditions);
  block('actions', node.actions);
  block('children', node.children);

  return lines.join('\n');
}

function validate(
  nodes: BTNode[],
  rootIds: string[],
  childrenByParent: Map<string, string[]>,
  lang: Language,
): ValidationResult {
  const warnings: string[] = [];
  const w = (en: string, pl: string) => warnings.push(lang === 'pl' ? pl : en);

  if (nodes.length === 0) {
    w('Canvas is empty. Add a node to begin.', 'Plansza jest pusta. Dodaj węzeł, aby rozpocząć.');
    return { warnings };
  }

  if (rootIds.length === 0) {
    w(
      'No root node found. Connect your nodes so one composite has no parent.',
      'Brak węzła głównego. Połącz węzły tak, aby jeden złożony nie miał rodzica.',
    );
  }
  if (rootIds.length > 1) {
    w(
      'Multiple root nodes detected. Only the first is exported.',
      'Wykryto wiele węzłów głównych. Eksportowany jest tylko pierwszy.',
    );
  }

  if (rootIds.length >= 1) {
    const root = nodes.find((n) => n.id === rootIds[0])!;
    if (root.data.category !== 'composite') {
      w(
        'The root should be a composite node (Selector or Sequence).',
        'Węzeł główny powinien być węzłem złożonym (Selektor lub Sekwencja).',
      );
    }
  }

  // Condition/Action nodes must be leaves.
  for (const node of nodes) {
    if (node.data.category !== 'composite') {
      const kids = childrenByParent.get(node.id);
      if (kids && kids.length > 0) {
        const label = node.data.customLabel.trim() || DEFINITION_BY_KIND[node.data.kind].label[lang];
        w(
          `Condition/Action nodes cannot have children: ${label}`,
          `Węzły warunkowe/akcji nie mogą mieć dzieci: ${label}`,
        );
      }
    }
  }

  return { warnings };
}

// Pure export: compute roots, build the tree, validate, and serialise.
// Kept framework-free so it can be unit-tested in isolation.
export function exportTree(nodes: BTNode[], edges: BTEdge[], lang: Language): ExportResult {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  // Preserve insertion/edge order for stable, readable output.
  const childrenByParent = new Map<string, string[]>();
  const hasParent = new Set<string>();
  for (const edge of edges) {
    if (!nodeById.has(edge.source) || !nodeById.has(edge.target)) continue;
    const list = childrenByParent.get(edge.source) ?? [];
    list.push(edge.target);
    childrenByParent.set(edge.source, list);
    hasParent.add(edge.target);
  }

  const rootIds = nodes.filter((n) => !hasParent.has(n.id)).map((n) => n.id);
  const validation = validate(nodes, rootIds, childrenByParent, lang);

  let yaml = '';
  if (rootIds.length >= 1) {
    const tree = buildExportNode(rootIds[0], nodeById, childrenByParent);
    yaml = serialiseNode(tree, 0, false) + '\n';
  } else {
    yaml =
      lang === 'pl'
        ? '# Brak węzła głównego — połącz węzły, aby wygenerować YAML.\n'
        : '# No root node — connect your nodes to generate YAML.\n';
  }

  return { yaml, validation, rootId: rootIds[0] ?? null };
}

// Memoised hook wrapper so the live preview only recomputes on real changes.
export function useTreeExporter(nodes: BTNode[], edges: BTEdge[], lang: Language): ExportResult {
  return useMemo(() => exportTree(nodes, edges, lang), [nodes, edges, lang]);
}
