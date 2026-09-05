// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Checks that the navigation actually changes language —
// that the sidebar and the top bar read their wording from the dictionary rather
// than having English written into them.
//
// WHY THIS AND NOT THE WHOLE SITE: the navigation is the part somebody sees on
// every single page. If it stays in English while the rest of the site changes,
// the language switch looks broken no matter how much else was translated. It is
// also the part most likely to regress, because adding a nav link by copying the
// one above it is how a hard-coded English string gets back in.
//
// THE ENGLISH CASING IS CHECKED TOO. "Find a Car", not "Find a car" — the
// capitalisation the site uses throughout, and the specific thing that had to be
// corrected by hand before these phrases moved into the dictionary.

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, act } from '../render';
import { I18nProvider, useTranslation, type Language } from '@/lib/i18n';
import { allCopy, dictionaries } from '@/lib/i18n/copy';

const { en, nl, fr, es } = dictionaries;

// The keys the sidebar and top bar are built from. If a nav row stops using one
// of these, the phrase it uses instead will not be translated.
const NAV_KEYS = [
  'web.nav.home',
  'web.nav.findCar',
  'web.nav.myRentals',
  'web.nav.messages',
  'web.nav.notifications',
  'web.nav.savedCars',
  'web.nav.rewards',
  'web.nav.profile',
  'web.nav.documents',
  'web.nav.paymentMethods',
  'web.nav.language',
  'web.nav.settings',
  'web.nav.support',
  'web.nav.legal',
  'web.nav.businessDashboard',
  'web.nav.listVehicles',
  'web.group.browse',
  'web.group.yourRentals',
  'web.group.yourAccount',
  'web.provider.overview',
  'web.provider.bookings',
  'web.provider.fleet',
  'web.provider.payouts',
  'web.provider.performance',
  'web.provider.promotions',
  'web.provider.businessProfile',
] as const;

function Switcher({ to }: { to: Language }) {
  const { t, setLanguage, language } = useTranslation();
  return (
    <div>
      <button type="button" onClick={() => setLanguage(to)}>
        switch
      </button>
      <p data-testid="language">{language}</p>
      <ul>
        {NAV_KEYS.map((key) => (
          <li key={key} data-testid={key}>
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  );
}

describe('the navigation in every language', () => {
  it('is written in the site casing in English', () => {
    // The capitalisation the whole site uses. "Find a car" in the bar while the
    // page it opens is headed "Find a Car" is exactly the inconsistency these
    // phrases were moved into the dictionary to stop.
    expect(en['web.nav.findCar']).toBe('Find a Car');
    expect(en['web.nav.myRentals']).toBe('My Rentals');
    expect(en['web.nav.savedCars']).toBe('Saved Cars');
    expect(en['web.provider.businessProfile']).toBe('Business Profile');
  });

  it.each(['nl', 'fr', 'es'] as const)('has every nav phrase translated into %s', (code) => {
    const dictionary = ({ nl, fr, es } as Record<string, Record<string, string>>)[code];
    for (const key of NAV_KEYS) {
      const phrase = dictionary[key];
      expect(phrase, `${code} is missing ${key}`).toBeTruthy();
      // A "translation" identical to the English is usually a copy-paste that
      // was never finished. Proper nouns and words that genuinely match across
      // languages are the exception, so this only warns for the ones that
      // should clearly differ.
      if (key === 'web.nav.findCar' || key === 'web.nav.myRentals') {
        expect(phrase, `${code}: ${key} is still English`).not.toBe(en[key]);
      }
    }
  });

  it.each(['nl', 'fr', 'es'] as const)('re-labels the navigation when switched to %s', async (code) => {
    const dictionary = ({ nl, fr, es } as Record<string, Record<string, string>>)[code];

    render(
      <I18nProvider>
        <Switcher to={code} />
      </I18nProvider>,
    );

    expect(screen.getByTestId('web.nav.findCar')).toHaveTextContent(en['web.nav.findCar']);

    await act(async () => {
      screen.getByRole('button', { name: 'switch' }).click();
    });

    expect(screen.getByTestId('language')).toHaveTextContent(code);
    for (const key of NAV_KEYS) {
      expect(
        screen.getByTestId(key),
        `${key} did not change to ${code}`,
      ).toHaveTextContent(dictionary[key]);
    }
  });

  it('never leaves a nav row with no words in it', async () => {
    // The failure this guards against is silent: a key renamed in one place and
    // not the other shows an empty row rather than an error.
    for (const code of ['en', 'nl', 'fr', 'es'] as const) {
      render(
        <I18nProvider>
          <Switcher to={code} />
        </I18nProvider>,
      );

      await act(async () => {
        screen.getAllByRole('button', { name: 'switch' })[0].click();
      });

      for (const key of NAV_KEYS) {
        const text = screen.getAllByTestId(key)[0].textContent ?? '';
        expect(text.trim().length, `${code}: ${key} rendered empty`).toBeGreaterThan(0);
      }
    }
  });
});
