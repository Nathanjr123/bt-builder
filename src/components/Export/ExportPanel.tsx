import { useState } from 'react';
import { useTreeStore } from '../../store/useTreeStore';
import { useI18n } from '../../i18n/I18nContext';
import { useTreeExporter } from '../../hooks/useTreeExporter';

export default function ExportPanel({
  minimized = false,
  onToggleMinimize,
  onClose,
}: {
  minimized?: boolean;
  onToggleMinimize?: () => void;
  onClose?: () => void;
}) {
  const { lang, t } = useI18n();
  const nodes = useTreeStore((s) => s.nodes);
  const edges = useTreeStore((s) => s.edges);
  const { yaml, validation } = useTreeExporter(nodes, edges, lang);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be blocked; the download still works.
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'behavior_tree.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasWarnings = validation.warnings.length > 0;

  return (
    <div className="flex h-full flex-col bg-slate-900">
      <div className="flex items-center justify-between gap-2 border-b border-slate-700 px-4 py-2">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-200">
          {t('exportTitle')}
          {minimized && !hasWarnings && (
            <span className="h-2 w-2 rounded-full bg-emerald-500" title={t('validationOk')} />
          )}
          {minimized && hasWarnings && (
            <span className="h-2 w-2 rounded-full bg-amber-500" title={t('validationTitle')} />
          )}
        </h2>
        <div className="flex items-center gap-2">
          {!minimized && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-md border border-slate-600 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
              >
                {copied ? t('copied') : t('copyButton')}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-emerald-400"
              >
                {t('exportButton')}
              </button>
            </>
          )}
          {onToggleMinimize && (
            <button
              type="button"
              onClick={onToggleMinimize}
              title={minimized ? t('restorePanel') : t('minimizePanel')}
              aria-label={minimized ? t('restorePanel') : t('minimizePanel')}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-600 text-sm leading-none text-slate-200 transition-colors hover:bg-slate-700"
            >
              {minimized ? '▢' : '–'}
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title={t('closePanel')}
              aria-label={t('closePanel')}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-600 text-sm leading-none text-slate-200 transition-colors hover:bg-slate-700"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {minimized ? null : (
        <>
      {/* Validation banner */}
      <div
        className={`border-b px-4 py-1.5 text-xs ${
          hasWarnings
            ? 'border-amber-700/50 bg-amber-950/40 text-amber-300'
            : 'border-emerald-800/50 bg-emerald-950/30 text-emerald-300'
        }`}
      >
        <span className="font-semibold">{t('validationTitle')}: </span>
        {hasWarnings ? (
          <ul className="mt-0.5 list-inside list-disc space-y-0.5">
            {validation.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        ) : (
          <span>{t('validationOk')}</span>
        )}
      </div>

      <pre className="flex-1 overflow-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-slate-100">
        <code>{yaml}</code>
      </pre>
        </>
      )}
    </div>
  );
}
