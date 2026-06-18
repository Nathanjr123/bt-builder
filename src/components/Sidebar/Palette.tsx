import { useState } from 'react';
import { NODE_DEFINITIONS } from '../../nodeDefinitions';
import type { NodeCategory, NodeDefinition, BTNodeKind } from '../../types';
import { useTreeStore } from '../../store/useTreeStore';
import { useI18n } from '../../i18n/I18nContext';
import { DRAG_MIME } from '../Canvas/Canvas';
import type { TranslationKey } from '../../i18n/translations';

const CATEGORY_ORDER: NodeCategory[] = ['composite', 'condition', 'action'];

const CATEGORY_META: Record<
  NodeCategory,
  { titleKey: TranslationKey; dot: string; chip: string }
> = {
  composite: { titleKey: 'categoryComposite', dot: 'bg-indigo-500', chip: 'hover:border-indigo-400' },
  condition: { titleKey: 'categoryCondition', dot: 'bg-sky-500', chip: 'hover:border-sky-400' },
  action: { titleKey: 'categoryAction', dot: 'bg-emerald-500', chip: 'hover:border-emerald-400' },
};

// Each click-to-add nudges placement so nodes don't stack perfectly.
let clickOffset = 0;

function PaletteItem({ def }: { def: NodeDefinition }) {
  const { lang, t } = useI18n();
  const addNode = useTreeStore((s) => s.addNode);
  const meta = CATEGORY_META[def.category];

  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData(DRAG_MIME, def.kind);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onClick = () => {
    clickOffset = (clickOffset + 1) % 6;
    addNode(def.kind as BTNodeKind, {
      x: 300 + clickOffset * 30,
      y: 120 + clickOffset * 30,
    });
  };

  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      title={def.description[lang]}
      className={`group flex w-full items-start gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-left transition-colors ${meta.chip}`}
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-700">
        {def.glyph}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-slate-800">{def.label[lang]}</span>
        <span className="block truncate text-[11px] leading-tight text-slate-500">
          {def.description[lang]}
        </span>
      </span>
      <span className="shrink-0 self-center rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
        {t('addNode')}
      </span>
    </button>
  );
}

export default function Palette() {
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2.5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          {t('paletteTitle')}
        </h2>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded px-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          aria-label={t('togglePalette')}
        >
          {collapsed ? '+' : '–'}
        </button>
      </div>

      {!collapsed && (
        <>
          <p className="px-3 py-2 text-[11px] text-slate-500">{t('paletteHint')}</p>
          <div className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
            {CATEGORY_ORDER.map((category) => {
              const meta = CATEGORY_META[category];
              const defs = NODE_DEFINITIONS.filter((d) => d.category === category);
              return (
                <section key={category}>
                  <h3 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    {t(meta.titleKey)}
                  </h3>
                  <div className="space-y-1.5">
                    {defs.map((def) => (
                      <PaletteItem key={def.kind} def={def} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}
    </aside>
  );
}
