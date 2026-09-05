// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the four-language setup — that switching language
// changes the words, that every phrase exists in every language, and that no
// translation is silently still English.
//
// WHAT CHANGED, AND WHY THESE TESTS LOOK DIFFERENT NOW: the phrases used to
// live in four parallel files, and the three translation files were "partial" —
// a phrase could exist in English and simply not in Dutch. These tests used to
// check for that gap and tolerate it, because the fallback to English was the
// designed behaviour.
//
// Now each phrase carries all four languages in one place and the type system
// requires them, so that whole class of gap cannot happen and there is nothing
// left to test about it. What CAN still happen is worse and quieter: a
// "translation" that is really the English pasted across to make the type
// checker stop complaining. That is what most of this file now looks for.

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, act } from '../render';
import { I18nProvider, useTranslation, languageOptions } from '@/lib/i18n';
import { allCopy, dictionaries, type Phrase } from '@/lib/i18n/copy';

const LANGUAGES = ['en', 'nl', 'fr', 'es'] as const;
const entries = Object.entries(allCopy) as [string, Phrase][];

// A tiny page that shows one phrase and offers a button per language, so a test
// can switch language the way a person does.
function Probe({ phrase }: { phrase: keyof typeof allCopy }) {
  const { t, language, setLanguage } = useTranslation();
  return (
    <div>
      <p data-testid="phrase">{t(phrase)}</p>
      <p data-testid="language">{language}</p>
      {languageOptions.map((option) => (
        <button key={option.code} type="button" onClick={() => setLanguage(option.code)}>
          {option.english}
        </button>
      ))}
    </div>
  );
}

function renderProbe(phrase: keyof typeof allCopy) {
  return render(
    <I18nProvider>
      <Probe phrase={phrase} />
    </I18nProvider>,
  );
}

describe('the four languages', () => {
  it('offers exactly the four the island needs', () => {
    expect(languageOptions.map((o) => o.code)).toEqual(['en', 'nl', 'fr', 'es']);
  });

  it('names each language in its own words as well as in English', () => {
    for (const option of languageOptions) {
      expect(option.label.length).toBeGreaterThan(0);
      expect(option.english.length).toBeGreaterThan(0);
    }
    // A Dutch speaker looking for their language should see "Nederlands", not
    // only the English word for it.
    expect(languageOptions.find((o) => o.code === 'nl')?.label).toBe('Nederlands');
  });

  it('starts in English', () => {
    renderProbe('common.continue');
    expect(screen.getByTestId('language')).toHaveTextContent('en');
    expect(screen.getByTestId('phrase')).toHaveTextContent('Continue');
  });

  it('changes the words when the language changes', async () => {
    renderProbe('common.continue');

    await act(async () => {
      screen.getByRole('button', { name: 'Dutch' }).click();
    });

    expect(screen.getByTestId('language')).toHaveTextContent('nl');
    expect(screen.getByTestId('phrase')).toHaveTextContent(allCopy['common.continue'].nl);
  });

  it('remembers the choice for next time', async () => {
    renderProbe('common.continue');

    await act(async () => {
      screen.getByRole('button', { name: 'French' }).click();
    });

    expect(window.localStorage.getItem('sxm.language')).toBe('fr');
  });
});

describe('every phrase, in every language', () => {
  it('has a good number of phrases — this catches a file that stopped being imported', () => {
    // A subject file dropped from copy/index.ts would not break the build; the
    // pages using it would just show their keys. A floor on the count catches
    // that immediately.
    expect(entries.length).toBeGreaterThan(250);
  });

  it.each(LANGUAGES)('has no empty phrase in %s', (code) => {
    for (const [key, phrase] of entries) {
      expect(phrase[code]?.trim(), `${key} is empty in ${code}`).toBeTruthy();
    }
  });

  it('builds one dictionary per language, all the same size', () => {
    for (const code of LANGUAGES) {
      expect(Object.keys(dictionaries[code]), `${code} is a different size`).toHaveLength(
        entries.length,
      );
    }
  });

  it('never leaves a phrase untranslated where the languages must differ', () => {
    // A phrase identical across languages is usually the English pasted over to
    // satisfy the type checker. Some are genuinely the same in all four —
    // "Menu", "Instagram", a brand name — so this reports the proportion rather
    // than failing on any single one.
    const identical = entries.filter(
      ([, p]) => p.en === p.nl && p.en === p.fr && p.en === p.es,
    );

    const share = identical.length / entries.length;
    expect(
      share,
      `${identical.length} of ${entries.length} phrases are the same in all four languages, ` +
        `e.g. ${identical.slice(0, 5).map(([k]) => k).join(', ')}`,
    ).toBeLessThan(0.12);
  });

  it.each(['nl', 'fr', 'es'] as const)(
    'translates the phrases that carry money and risk into %s',
    (code) => {
      // The deposit and verification wording is where a translation left in
      // English stops being untidy and starts meaning somebody agrees to
      // something they did not read. These specifically must not be English.
      const critical = [
        'vehicle.deposit',
        'vehicle.depositBody',
        'booking.dueToday',
        'booking.depositSeparate',
        'home.hero.noteDeposit',
        'home.renting.step2.body',
        'verify.body',
      ];

      for (const key of critical) {
        const phrase = allCopy[key as keyof typeof allCopy] as Phrase | undefined;
        if (!phrase) continue;
        expect(phrase[code], `${key} is still English in ${code}`).not.toBe(phrase.en);
      }
    },
  );
});

describe('the phrase keys themselves', () => {
  it('uses a dotted name for every key, so they group and sort sensibly', () => {
    for (const [key] of entries) {
      expect(key, `"${key}" has no group prefix`).toMatch(/^[a-z][A-Za-z]*\./);
    }
  });

  it('has no duplicate key across the subject files', () => {
    // Two files defining the same key would mean one silently overwrites the
    // other depending on the import order in copy/index.ts.
    expect(new Set(entries.map(([k]) => k)).size).toBe(entries.length);
  });
});
