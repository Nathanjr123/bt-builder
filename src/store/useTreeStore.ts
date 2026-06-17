import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from 'reactflow';
import type { BTNode, BTEdge, BTNodeKind } from '../types';
import { DEFINITION_BY_KIND, defaultParamsFor } from '../nodeDefinitions';
import { EXAMPLE_PRESETS } from '../exampleTree';

let idCounter = 1;
function nextId(): string {
  return `n${idCounter++}`;
}

// Keep the counter ahead of any ids restored from the example tree so we never
// collide with existing nodes.
function bumpCounterPast(nodes: BTNode[]) {
  for (const n of nodes) {
    const num = parseInt(n.id.replace(/\D/g, ''), 10);
    if (!Number.isNaN(num) && num >= idCounter) {
      idCounter = num + 1;
    }
  }
}

interface TreeState {
  nodes: BTNode[];
  edges: BTEdge[];
  selectedNodeId: string | null;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  addNode: (kind: BTNodeKind, position: { x: number; y: number }) => void;
  updateNodeLabel: (id: string, label: string) => void;
  updateNodeParam: (id: string, key: string, value: string | number) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  clearCanvas: () => void;
  loadExample: (presetId?: string) => void;
}

export const useTreeStore = create<TreeState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as BTNode[] });
    // Keep selection in sync when a node is selected/removed via React Flow.
    const removed = changes.find((c) => c.type === 'remove');
    if (removed && 'id' in removed && removed.id === get().selectedNodeId) {
      set({ selectedNodeId: null });
    }
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  onConnect: (connection) => {
    // A node may have only one parent: drop any existing edge into the target.
    const filtered = get().edges.filter((e) => e.target !== connection.target);
    set({
      edges: addEdge(
        { ...connection, type: 'smoothstep', animated: false },
        filtered,
      ),
    });
  },

  addNode: (kind, position) => {
    const def = DEFINITION_BY_KIND[kind];
    const node: BTNode = {
      id: nextId(),
      type: 'btNode',
      position,
      data: {
        kind,
        category: def.category,
        customLabel: '',
        params: defaultParamsFor(kind),
      },
    };
    set({ nodes: [...get().nodes, node], selectedNodeId: node.id });
  },

  updateNodeLabel: (id, label) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, customLabel: label } } : n,
      ),
    });
  },

  updateNodeParam: (id, key, value) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, params: { ...n.data.params, [key]: value } } }
          : n,
      ),
    });
  },

  deleteNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  clearCanvas: () => set({ nodes: [], edges: [], selectedNodeId: null }),

  loadExample: (presetId) => {
    const preset = EXAMPLE_PRESETS.find((p) => p.id === presetId) ?? EXAMPLE_PRESETS[0];
    const nodes = preset.nodes.map((n) => ({ ...n, data: { ...n.data, params: { ...n.data.params } } }));
    bumpCounterPast(nodes);
    set({ nodes, edges: preset.edges.map((e) => ({ ...e })), selectedNodeId: null });
  },
}));
