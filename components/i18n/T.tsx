'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Prints one phrase in the reader's language. It draws no
// markup of its own — it is the words and nothing else.
//
// WHAT IT IS FOR, and this is the whole point of it:
//
// A page built on the server cannot call t(). Reading the chosen language means
// reading the browser's stored setting, and there is no browser on the server.
// That is a real constraint, not an oversight — the car pages, the search page
// and the policy pages are built on the server deliberately, because a search
// engine reads finished HTML and that is most of why this website exists.
//
// So those pages could not translate a single word, and the section headings on
// the most-visited pages of the site stayed in English however much else was
// translated.
//
// This is the way out. A server page can render a browser component perfectly
// well — it just cannot BE one. Dropping <T k="vehicle.atAGlance" /> into a
// server page hands that one phrase to the browser to resolve, and leaves the
// rest of the page exactly as it was: still built on the server, still complete
// HTML for a crawler, still carrying its own title and description.
//
// HOW IT LOOKS ON FIRST PAINT. The server renders the English, because that is
// what it has; the browser swaps it a moment later if the reader has chosen
// something else. The crawler therefore sees English, which matches the page's
// canonical address, which is correct. What this does NOT give you is a Dutch
// page in Dutch search results — that needs a separate address per language.
// See the README.
//
// USE IT ONLY WHERE t() CANNOT REACH. Inside a component that is already marked
// "use client", call t() directly: it is plainer to read and one component less
// on the page.

import React from 'react';
import { useTranslation, type TranslationKey } from '@/lib/i18n';

export function T({ k }: { k: TranslationKey }) {
  const { t } = useTranslation();
  return <>{t(k)}</>;
}

export default T;
