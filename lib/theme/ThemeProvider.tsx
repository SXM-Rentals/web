'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Decides whether the site shows its light or dark look.
// By default it follows the visitor's own computer setting, so someone whose
// laptop is in dark mode sees a dark site straight away. They can override that
// with the toggle in the top bar, and their choice is remembered next visit.
//
// HOW THE COLOURS ACTUALLY CHANGE: this file does not hand colours to anything.
// It writes a single marker onto the page — data-theme="dark" — and the whole
// palette in app/globals.css switches over in response. That means changing
// theme costs one attribute change rather than re-rendering every component.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getItemSync, setItemSync } from '@/lib/storage';

// The three choices a person can make.
export type ThemePreference = 'system' | 'light' | 'dark';

type ThemeValue = {
  // What the visitor asked for.
  preference: ThemePreference;
  // What we actually ended up showing, once "system" has been resolved.
  scheme: 'light' | 'dark';
  setPreference: (p: ThemePreference) => void;
  // Flips straight between light and dark — what the top-bar button uses.
  toggle: () => void;
};

const ThemeContext = createContext<ThemeValue | null>(null);

export const THEME_STORAGE_KEY = 'sxm.theme-preference';

// Reads the visitor's saved choice. Shared with the small script in the page
// head that runs before anything is drawn, so the two always agree.
function readSavedPreference(): ThemePreference {
  const saved = getItemSync(THEME_STORAGE_KEY);
  return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Starts as "system" on purpose. The page is built on the server, where there
  // is no way to know the visitor's preference, so the first render must match
  // what the server produced or React complains that the two disagree. The real
  // value is read immediately afterwards, in the effect below.
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  // What the visitor's computer is set to right now, watched so that changing
  // it in the operating system updates the site live.
  const [systemScheme, setSystemScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setPreferenceState(readSavedPreference());

    const query = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemScheme(query.matches ? 'dark' : 'light');

    const onChange = (event: MediaQueryListEvent) => {
      setSystemScheme(event.matches ? 'dark' : 'light');
    };

    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // If they chose "system", follow the computer. Otherwise use their choice.
  const scheme: 'light' | 'dark' =
    preference === 'system' ? systemScheme : preference;

  // ---- WRITE THE MARKER THAT SWITCHES THE PALETTE ----
  // "system" deliberately removes the marker rather than setting it, so the
  // stylesheet falls back to following the computer on its own.
  useEffect(() => {
    const root = document.documentElement;
    if (preference === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', preference);
    }
  }, [preference]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    setItemSync(THEME_STORAGE_KEY, next);
  }, []);

  // The top-bar button flips to the opposite of what is on screen now. Someone
  // looking at a dark page and pressing it expects light, whether they got that
  // dark page by choosing it or by inheriting it from their computer.
  const toggle = useCallback(() => {
    setPreference(scheme === 'dark' ? 'light' : 'dark');
  }, [scheme, setPreference]);

  const value = useMemo<ThemeValue>(
    () => ({ preference, scheme, setPreference, toggle }),
    [preference, scheme, setPreference, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// How a component reads the current theme:
//   const { scheme, toggle } = useTheme();
export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider (check app/layout.tsx)');
  }
  return ctx;
}

// ---- STOPPING THE FLASH OF THE WRONG THEME ----
// This runs in the page head, before the browser draws anything at all. Without
// it, someone who chose dark would see a white page for a fraction of a second
// on every single load, which looks broken. It is deliberately tiny and written
// as plain text because it has to run before any of our code has loaded.
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var saved = localStorage.getItem('${THEME_STORAGE_KEY}');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  } catch (e) {
    // Storage blocked. The stylesheet follows the computer's setting instead.
  }
})();
`;
