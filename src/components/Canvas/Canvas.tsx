import { useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useReactFlow,
  type ReactFlowInstance,
  type NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useTreeStore } from '../../store/useTreeStore';
import { useI18n } from '../../i18n/I18nContext';
import BTNode from '../NodeTypes/BTNode';
import type { BTNodeKind } from '../../types';

const NODE_TYPES = { btNode: BTNode };

export const DRAG_MIME = 'application/bt-node-kind';

function CanvasInner() {
  const { t } = useI18n();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rfInstance = useRef<ReactFlowInstance | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const nodes = useTreeStore((s) => s.nodes);
  const edges = useTreeStore((s) => s.edges);
  const onNodesChange = useTreeStore((s) => s.onNodesChange);
  const onEdgesChange = useTreeStore((s) => s.onEdgesChange);
  const onConnect = useTreeStore((s) => s.onConnect);
  const addNode = useTreeStore((s) => s.addNode);
  const selectNode = useTreeStore((s) => s.selectNode);

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_evt, node) => selectNode(node.id),
    [selectNode],
  );

  const onPaneClick = useCallback(() => selectNode(null), [selectNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const kind = event.dataTransfer.getData(DRAG_MIME) as BTNodeKind;
      if (!kind) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      addNode(kind, position);
    },
    [screenToFlowPosition, addNode],
  );

  const isEmpty = nodes.length === 0;

  const miniMapColor = useMemo(
    () => (n: { data?: { category?: string } }) => {
      switch (n.data?.category) {
        case 'composite':
          return '#6366f1';
        case 'condition':
          return '#0ea5e9';
        case 'action':
          return '#10b981';
        default:
          return '#94a3b8';
      }
    },
    [],
  );

  return (
    <div ref={wrapperRef} className="relative h-full w-full" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={(inst) => (rfInstance.current = inst)}
        nodeTypes={NODE_TYPES}
        fitView
        defaultEdgeOptions={{ type: 'smoothstep' }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={18} color="#e2e8f0" />
        <Controls showInteractive={false} />
        <MiniMap nodeColor={miniMapColor} zoomable pannable className="!bg-slate-100" />
      </ReactFlow>

      {isEmpty && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="max-w-xs rounded-lg bg-white/80 px-4 py-3 text-center text-sm text-slate-500 shadow">
            {t('emptyCanvasHint')}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
