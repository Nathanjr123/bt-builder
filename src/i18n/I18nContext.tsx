import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Language } from '../types';
import { translate, type TranslationKey } from './translations';

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'bt-builder-lang';

function initialLang(): Language {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
  return stored === 'pl' || stored === 'en' ? stored : 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(initialLang);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore storage failures (e.g. private mode).
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'pl' : 'en');
  }, [lang, setLang]);

  const t = useCallback((key: TranslationKey) => translate(key, lang), [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}
