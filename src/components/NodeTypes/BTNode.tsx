import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import type { BTNodeData } from '../../types';
import { DEFINITION_BY_KIND } from '../../nodeDefinitions';
import { useI18n } from '../../i18n/I18nContext';

const CATEGORY_STYLES: Record<BTNodeData['category'], { ring: string; badge: string; bar: string }> = {
  composite: { ring: 'border-indigo-400', badge: 'bg-indigo-500', bar: 'bg-indigo-500' },
  condition: { ring: 'border-sky-400', badge: 'bg-sky-500', bar: 'bg-sky-500' },
  action: { ring: 'border-emerald-400', badge: 'bg-emerald-500', bar: 'bg-emerald-500' },
};

function BTNodeComponent({ data, selected }: NodeProps<BTNodeData>) {
  const { lang } = useI18n();
  const def = DEFINITION_BY_KIND[data.kind];
  const styles = CATEGORY_STYLES[data.category];
  const title = data.customLabel.trim() || def.label[lang];

  // Build a compact one-line summary of the configured parameters.
  const paramSummary = def.params
    .map((p) => `${p.label[lang]}: ${data.params[p.key] ?? p.defaultValue}`)
    .join('  ·  ');

  return (
    <div
      className={`min-w-[180px] max-w-[240px] rounded-lg border-2 bg-white shadow-md transition-shadow ${
        selected ? 'ring-2 ring-offset-2 ring-slate-800 shadow-lg' : ''
      } ${styles.ring}`}
    >
      {/* Composites have an incoming handle (top) only if they can be a child.
          Every node exposes a target (top) and source (bottom) handle so the
          manager can wire any hierarchy; validation enforces semantics. */}
      <Handle type="target" position={Position.Top} className="!h-3 !w-3 !bg-slate-500" />

      <div className={`flex items-center gap-2 rounded-t-md px-3 py-1.5 text-white ${styles.bar}`}>
        <span className="flex h-6 w-6 items-center justify-center rounded bg-white/25 text-sm font-bold">
          {def.glyph}
        </span>
        <span className="truncate text-xs font-semibold uppercase tracking-wide">
          {def.label[lang]}
        </span>
      </div>

      <div className="px-3 py-2">
        <div className="truncate text-sm font-semibold text-slate-800" title={title}>
          {title}
        </div>
        {paramSummary && (
          <div className="mt-1 truncate text-[11px] text-slate-500" title={paramSummary}>
            {paramSummary}
          </div>
        )}
      </div>

      {data.category === 'composite' && (
        <Handle type="source" position={Position.Bottom} className="!h-3 !w-3 !bg-slate-500" />
      )}
    </div>
  );
}

export default memo(BTNodeComponent);
