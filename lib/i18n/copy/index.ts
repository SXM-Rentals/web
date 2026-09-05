// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Gathers every phrase on the site into one place and
// turns it into the four dictionaries the app reads.
//
// THE FILES BESIDE THIS ONE are grouped by subject — the words in the
// navigation, the words on a car's page, the words in the booking flow — so
// somebody translating a section can work through one file and finish it,
// rather than picking phrases out of a list of a thousand.
//
// WHY THE DICTIONARIES ARE BUILT HERE rather than written out by hand: they are
// the same information turned inside out. Each phrase file is organised by
// phrase, with four languages inside; the app needs it organised by language,
// with a thousand phrases inside. Doing that by hand is how the two drift
// apart. Doing it in four lines of code means they cannot.

import type { Phrase } from './types';

import { common } from './common';
import { navigation } from './navigation';
import { auth } from './auth';
import { catalog } from './catalog';
import { booking } from './booking';
import { account } from './account';
import { business } from './business';

import { home } from './home';
import { search } from './search';
import { vehicle } from './vehicle';
import { bookingFlow } from './booking-flow';
import { accountPages } from './account-pages';
import { authPages } from './auth-pages';
import { providerPortal } from './provider-portal';
import { legal } from './legal';
import { shared } from './shared';

export type { Phrase };

// The order matters only if two files use the same key, which they must not.
// The test in tests/lib/i18n.test.tsx checks for exactly that.
export const allCopy = {
  ...common,
  ...navigation,
  ...auth,
  ...catalog,
  ...booking,
  ...account,
  ...business,

  ...home,
  ...search,
  ...vehicle,
  ...bookingFlow,
  ...accountPages,
  ...authPages,
  ...providerPortal,
  ...legal,
  ...shared,
} as const;

// Every key on the site, as a type. This is what stops `t('home.hreo.title')`
// from compiling — a typo in a key is otherwise invisible until the page is
// open and the wrong words are on it.
export type TranslationKey = keyof typeof allCopy;

export type Language = 'en' | 'nl' | 'fr' | 'es';

// ---- TURNING IT INSIDE OUT ----
// From "phrase → four languages" into "language → every phrase", which is the
// shape a lookup needs.
function dictionaryFor(language: Language): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, phrase] of Object.entries(allCopy as Record<string, Phrase>)) {
    out[key] = phrase[language];
  }
  return out;
}

export const dictionaries: Record<Language, Record<string, string>> = {
  en: dictionaryFor('en'),
  nl: dictionaryFor('nl'),
  fr: dictionaryFor('fr'),
  es: dictionaryFor('es'),
};

// Kept because the tests and a few older imports name them directly. They are
// the same objects as above, not copies.
export const en = dictionaries.en;
export const nl = dictionaries.nl;
export const fr = dictionaries.fr;
export const es = dictionaries.es;
