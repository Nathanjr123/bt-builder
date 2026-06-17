import { useI18n } from '../i18n/I18nContext';
import { useTreeStore } from '../store/useTreeStore';
import { EXAMPLE_PRESETS } from '../exampleTree';
import { useFullscreen } from '../hooks/useFullscreen';
import type { Language } from '../types';
import type { SaveStatus } from '../App';

function FullscreenButton() {
  const { t } = useI18n();
  const { isFullscreen, toggle, supported } = useFullscreen();
  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={() => void toggle()}
      title={isFullscreen ? t('exitFullscreen') : t('enterFullscreen')}
      aria-label={isFullscreen ? t('exitFullscreen') : t('enterFullscreen')}
      className="rounded-md border border-slate-600 px-2 py-1 text-sm leading-none text-slate-200 transition-colors hover:bg-slate-700"
    >
      {isFullscreen ? '🗗' : '⛶'}
    </button>
  );
}

function ProfileBadge({
  profile,
  saveStatus,
  onSwitchProfile,
}: {
  profile: string | null;
  saveStatus: SaveStatus;
  onSwitchProfile: () => void;
}) {
  const { t } = useI18n();
  if (!profile) return null;

  const statusText =
    saveStatus === 'saving'
      ? t('saving')
      : saveStatus === 'error'
        ? t('saveError')
        : saveStatus === 'saved'
          ? t('saved')
          : '';
  const statusColor =
    saveStatus === 'error' ? 'text-red-400' : saveStatus === 'saving' ? 'text-amber-300' : 'text-emerald-400';

  return (
    <button
      type="button"
      onClick={onSwitchProfile}
      title={t('switchProfile')}
      className="flex items-center gap-2 rounded-md border border-slate-600 px-2 py-1 transition-colors hover:bg-slate-700"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold uppercase text-white">
        {profile.slice(0, 2)}
      </span>
      <span className="hidden text-xs font-medium text-slate-200 sm:inline">{profile}</span>
      {statusText && <span className={`hidden text-[10px] md:inline ${statusColor}`}>{statusText}</span>}
    </button>
  );
}

function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  const langs: Language[] = ['en', 'pl'];
  return (
    <div className="flex items-center gap-1.5">
      <span className="hidden text-xs font-medium text-slate-400 sm:inline">{t('language')}:</span>
      <div className="flex overflow-hidden rounded-md border border-slate-600">
        {langs.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
              lang === l ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Header({
  showExport,
  onToggleExport,
  onOpenHelp,
  profile,
  saveStatus,
  onSwitchProfile,
}: {
  showExport: boolean;
  onToggleExport: () => void;
  onOpenHelp: () => void;
  profile: string | null;
  saveStatus: SaveStatus;
  onSwitchProfile: () => void;
}) {
  const { lang, t } = useI18n();
  const loadExample = useTreeStore((s) => s.loadExample);
  const clearCanvas = useTreeStore((s) => s.clearCanvas);

  const handleClear = () => {
    if (window.confirm(t('clearConfirm'))) clearCanvas();
  };

  return (
    <header className="flex shrink-0 items-center justify-between gap-3 bg-slate-900 px-4 py-2.5 text-white">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-500 font-bold">
          BT
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold leading-tight">{t('appTitle')}</h1>
          <p className="hidden truncate text-xs text-slate-400 sm:block">{t('appSubtitle')}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenHelp}
          className="rounded-md border border-slate-600 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          ? {t('help')}
        </button>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) loadExample(e.target.value);
          }}
          className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 focus:outline-none"
          title={t('loadExample')}
        >
          <option value="" disabled>
            {t('loadExample')}
          </option>
          {EXAMPLE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name[lang]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-md border border-slate-600 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          {t('clearCanvas')}
        </button>
        <button
          type="button"
          onClick={onToggleExport}
          className="rounded-md border border-slate-600 px-2.5 py-1 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          {showExport ? t('hideExport') : t('showExport')}
        </button>
        <FullscreenButton />
        <ProfileBadge profile={profile} saveStatus={saveStatus} onSwitchProfile={onSwitchProfile} />
        <LanguageToggle />
      </div>
    </header>
  );
}
