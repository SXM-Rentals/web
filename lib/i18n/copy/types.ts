// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Defines the shape of a single phrase — the same sentence
// in all four languages, kept together.
//
// ALL FOUR ARE REQUIRED, and that is deliberate. Before this, the three
// translation files were "partial": a phrase could be added in English and
// simply never translated, and nothing anywhere would say so. The site would
// fall back to English and look finished. Half the Dutch translation was
// missing for months that way.
//
// Requiring all four means the build stops rather than the gap going unnoticed.
// The cost is that adding one English phrase means writing three more. That is
// the correct cost: a four-language product where three of them quietly rot is
// a one-language product with extra steps.
//
// IF A PHRASE GENUINELY SHOULD NOT BE TRANSLATED — a brand name, a legal
// document that must stay in its authoritative language — write the same string
// in all four. Saying so explicitly is the point; leaving it out is not.

export type Phrase = {
  /** English. The original, and what every other language is written from. */
  en: string;
  /** Dutch — Sint Maarten, the Dutch side. Formal "u" throughout. */
  nl: string;
  /** French — Saint-Martin, the French side. Formal "vous" throughout. */
  fr: string;
  /** Spanish — not official on either side, but widely spoken. Formal "usted". */
  es: string;
};
