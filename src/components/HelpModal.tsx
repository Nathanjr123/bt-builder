import { useI18n } from '../i18n/I18nContext';
import { useTreeStore } from '../store/useTreeStore';
import { EXAMPLE_PRESETS } from '../exampleTree';
import type { TranslationKey } from '../i18n/translations';

const STEPS: { title: TranslationKey; body: TranslationKey }[] = [
  { title: 'step1Title', body: 'step1Body' },
  { title: 'step2Title', body: 'step2Body' },
  { title: 'step3Title', body: 'step3Body' },
  { title: 'step4Title', body: 'step4Body' },
];

const LEGEND: { dot: string; key: TranslationKey }[] = [
  { dot: 'bg-indigo-500', key: 'legendComposite' },
  { dot: 'bg-sky-500', key: 'legendCondition' },
  { dot: 'bg-emerald-500', key: 'legendAction' },
];

const HIDE_KEY = 'bt-builder-hide-guide';

export default function HelpModal({ onClose }: { onClose: () => void }) {
  const { lang, t } = useI18n();
  const loadExample = useTreeStore((s) => s.loadExample);

  const loadAndClose = (presetId: string) => {
    loadExample(presetId, lang);
    onClose();
  };

  const toggleHide = (checked: boolean) => {
    try {
      if (checked) localStorage.setItem(HIDE_KEY, '1');
      else localStorage.removeItem(HIDE_KEY);
    } catch {
      // Ignore storage failures.
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-3 text-white">
          <h2 className="text-base font-bold">{t('guideTitle')}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-2 text-xl leading-none text-slate-300 hover:bg-slate-700 hover:text-white"
            aria-label="close"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-5 py-5">
          <p className="text-sm text-slate-600">{t('guideIntro')}</p>

          {/* Steps */}
          <ol className="grid gap-3 sm:grid-cols-2">
            {STEPS.map((s) => (
              <li key={s.title} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <h3 className="mb-1 text-sm font-bold text-slate-800">{t(s.title)}</h3>
                <p className="text-xs leading-relaxed text-slate-600">{t(s.body)}</p>
              </li>
            ))}
          </ol>

          {/* Legend */}
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-800">{t('legendTitle')}</h3>
            <ul className="space-y-1.5">
              {LEGEND.map((l) => (
                <li key={l.key} className="flex items-start gap-2 text-xs text-slate-600">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${l.dot}`} />
                  <span>{t(l.key)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example presets */}
          <div>
            <h3 className="text-sm font-bold text-slate-800">{t('tryExampleTitle')}</h3>
            <p className="mb-2 text-xs text-slate-500">{t('tryExampleBody')}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {EXAMPLE_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="flex flex-col rounded-lg border border-slate-200 p-3"
                >
                  <span className="text-sm font-semibold text-slate-800">{preset.name[lang]}</span>
                  <span className="mt-0.5 flex-1 text-xs text-slate-500">
                    {preset.description[lang]}
                  </span>
                  <button
                    type="button"
                    onClick={() => loadAndClose(preset.id)}
                    className="mt-2 self-start rounded-md bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-emerald-400"
                  >
                    {t('loadThis')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-500">
            <input
              type="checkbox"
              defaultChecked={
                typeof localStorage !== 'undefined' && localStorage.getItem(HIDE_KEY) === '1'
              }
              onChange={(e) => toggleHide(e.target.checked)}
              className="h-3.5 w-3.5"
            />
            {t('dontShowAgain')}
          </label>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            {t('gotIt')}
          </button>
        </div>
      </div>
    </div>
  );
}

export function shouldAutoShowGuide(): boolean {
  try {
    return localStorage.getItem(HIDE_KEY) !== '1';
  } catch {
    return true;
  }
}
