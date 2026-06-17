import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { listProfiles, cloudEnabled, type ProfileSummary } from '../services/persistence';

// Profile selection: pick an existing name to resume, or create a new one.
// Intentionally password-free — the name *is* the identity (e.g. "KayuuWow").
export default function ProfileModal({
  current,
  onSelect,
  onClose,
}: {
  current: string | null;
  onSelect: (name: string) => void;
  onClose?: () => void;
}) {
  const { t } = useI18n();
  const [profiles, setProfiles] = useState<ProfileSummary[] | null>(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listProfiles()
      .then((list) => active && setProfiles(list))
      .catch(() => active && setProfiles([]));
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const exists = profiles?.some((p) => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setError(t('profileTaken'));
      return;
    }
    onSelect(name);
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleString();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-5 py-3 text-white">
          <h2 className="text-base font-bold">{t('profileTitle')}</h2>
          {current && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded px-2 text-xl leading-none text-slate-300 hover:bg-slate-700 hover:text-white"
              aria-label="close"
            >
              ×
            </button>
          )}
        </div>

        <div className="space-y-5 overflow-y-auto px-5 py-5">
          <p className="text-sm text-slate-600">{t('profileIntro')}</p>

          {/* Cloud / local status badge */}
          <div
            className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs ${
              cloudEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${cloudEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {cloudEnabled ? t('cloudOn') : t('cloudOff')}
          </div>

          {/* Existing profiles */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('existingProfiles')}
            </h3>
            {profiles === null ? (
              <p className="text-sm text-slate-400">{t('loadingProfiles')}</p>
            ) : profiles.length === 0 ? (
              <p className="text-sm text-slate-400">{t('noProfilesYet')}</p>
            ) : (
              <ul className="max-h-48 space-y-1.5 overflow-y-auto">
                {profiles.map((p) => (
                  <li key={p.name}>
                    <button
                      type="button"
                      onClick={() => onSelect(p.name)}
                      className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-left transition-colors hover:border-emerald-400 hover:bg-emerald-50"
                    >
                      <span className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold uppercase text-white">
                          {p.name.slice(0, 2)}
                        </span>
                        <span className="text-sm font-medium text-slate-800">{p.name}</span>
                      </span>
                      <span className="text-[11px] text-slate-400">{formatDate(p.updatedAt)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* New profile */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t('newProfile')}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder={t('profileNamePlaceholder')}
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="shrink-0 rounded-md bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('createAndContinue')}
              </button>
            </div>
            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
