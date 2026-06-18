import { useTreeStore } from '../../store/useTreeStore';
import { useI18n } from '../../i18n/I18nContext';
import { DEFINITION_BY_KIND, nodeDisplayName } from '../../nodeDefinitions';
import type { ParamDefinition } from '../../types';

function ParamField({
  nodeId,
  param,
  value,
}: {
  nodeId: string;
  param: ParamDefinition;
  value: string | number;
}) {
  const { lang } = useI18n();
  const updateNodeParam = useTreeStore((s) => s.updateNodeParam);

  const label = (
    <label className="mb-1 block text-xs font-medium text-slate-600">{param.label[lang]}</label>
  );

  if (param.type === 'number') {
    return (
      <div>
        {label}
        <input
          type="number"
          value={value as number}
          min={param.min}
          max={param.max}
          onChange={(e) => {
            const n = e.target.value === '' ? 0 : Number(e.target.value);
            updateNodeParam(nodeId, param.key, n);
          }}
          className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        />
      </div>
    );
  }

  if (param.type === 'select') {
    return (
      <div>
        {label}
        <select
          value={value as string}
          onChange={(e) => updateNodeParam(nodeId, param.key, e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        >
          {param.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label[lang]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      {label}
      <input
        type="text"
        value={value as string}
        onChange={(e) => updateNodeParam(nodeId, param.key, e.target.value)}
        className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
      />
    </div>
  );
}

export default function PropertyPanel() {
  const { lang, t } = useI18n();
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const node = useTreeStore((s) => s.nodes.find((n) => n.id === s.selectedNodeId) ?? null);
  const updateNodeLabel = useTreeStore((s) => s.updateNodeLabel);
  const deleteNode = useTreeStore((s) => s.deleteNode);

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-2.5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">
          {t('propertiesTitle')}
        </h2>
      </div>

      {!node || !selectedNodeId ? (
        <div className="flex flex-1 items-center justify-center px-6">
          <p className="text-center text-sm text-slate-400">{t('noSelection')}</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
          {(() => {
            const def = DEFINITION_BY_KIND[node.data.kind];
            return (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-medium text-slate-500">{t('nodeType')}</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-700">
                      {def.glyph}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{def.label[lang]}</span>
                    <code className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-500">
                      {def.yamlType}
                    </code>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    {t('customLabel')}
                  </label>
                  <input
                    type="text"
                    value={node.data.customLabel}
                    placeholder={nodeDisplayName(node.data, lang) || t('customLabelPlaceholder')}
                    onChange={(e) => updateNodeLabel(node.id, e.target.value)}
                    className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                  />
                </div>

                <div>
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    {t('description')}
                  </span>
                  <p className="rounded-md bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
                    {def.description[lang]}
                  </p>
                </div>

                {def.params.length > 0 && (
                  <div className="space-y-3">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {t('parameters')}
                    </span>
                    {def.params.map((param) => (
                      <ParamField
                        key={param.key}
                        nodeId={node.id}
                        param={param}
                        value={node.data.params[param.key] ?? param.defaultValue}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => deleteNode(node.id)}
                  className="mt-2 w-full rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  {t('deleteNode')}
                </button>
              </div>
            );
          })()}
        </div>
      )}
    </aside>
  );
}
