'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Lets the site speak four languages — English, Dutch,
// French and Spanish — which covers both sides of the island plus the wider
// Caribbean visitor market.
//
// HOW IT WORKS: every piece of text has a short key, like 'nav.home'. A page
// writes t('nav.home') and gets back the words in whichever language is
// selected.
//
// WHERE THE WORDS LIVE: lib/i18n/copy/, one file per subject area, with all four
// languages of a phrase written together. That file layout is explained in
// copy/index.ts — the short version is that a missing translation is visible
// there, and used to be invisible.
//
// THE ENGLISH FALLBACK IS STILL HERE even though every phrase now has all four
// languages and the type system requires it. It costs one line and it means a
// key that somehow arrives unresolved shows readable English rather than the key
// itself printed on the page.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import storage, { getItemSync } from '@/lib/storage';
import { dictionaries, allCopy, type TranslationKey, type Language } from './copy';

export type { TranslationKey, Language };
export { allCopy };

// The names are written in each language itself, which is how language pickers
// are normally shown — a Dutch speaker looks for "Nederlands", not "Dutch".
export const languageOptions: { code: Language; label: string; english: string }[] = [
  { code: 'en', label: 'English', english: 'English' },
  { code: 'nl', label: 'Nederlands', english: 'Dutch' },
  { code: 'fr', label: 'Français', english: 'French' },
  { code: 'es', label: 'Español', english: 'Spanish' },
];

type I18nValue = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export const LANGUAGE_STORAGE_KEY = 'sxm.language';

// Works out which language to start in: the one chosen last time, or failing
// that a hint from the browser's own language setting, or failing that English.
function detectLanguage(): Language {
  const saved = getItemSync(LANGUAGE_STORAGE_KEY);
  if (saved && saved in dictionaries) return saved as Language;

  if (typeof navigator !== 'undefined') {
    // navigator.language looks like "fr-FR" or "nl", so only the part before
    // the dash matters to us.
    const browserCode = navigator.language?.split('-')[0]?.toLowerCase();
    if (browserCode && browserCode in dictionaries) return browserCode as Language;
  }

  return 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Starts in English because the page is built on the server, where there is
  // no browser to ask. The real choice is picked up immediately below. Starting
  // anywhere else would make the first render disagree with the server's.
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    setLanguageState(detectLanguage());
  }, []);

  // Keeps the page's own lang attribute honest, which is what screen readers
  // and browser translation prompts actually read.
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    storage.setItem(LANGUAGE_STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nValue>(() => {
    // Look the phrase up in the chosen language; if it is not translated yet,
    // fall back to English so the page still reads properly.
    const t = (key: TranslationKey, fallback?: string): string => {
      const chosen = dictionaries[language];
      return chosen[key as string] ?? dictionaries.en[key as string] ?? fallback ?? (key as string);
    };
    return { language, setLanguage, t };
  }, [language, setLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// How a page reads text: const { t } = useTranslation();
export function useTranslation(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used inside I18nProvider (check app/layout.tsx)');
  }
  return ctx;
}
