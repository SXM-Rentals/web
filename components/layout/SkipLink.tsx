'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The link that lets somebody using a keyboard jump
// straight past the navigation to the content of the page. It is invisible
// until it is focused, and it is the very first thing the Tab key reaches.
//
// WHY IT IS ITS OWN FILE. It used to be three lines inside app/layout.tsx. That
// file is built on the server and cannot look up a phrase in the reader's
// language, so the one piece of text on every single page of the site stayed in
// English — the most-repeated untranslated string in the whole build, and
// invisible to anybody testing with a mouse.

import React from 'react';
import { useTranslation } from '@/lib/i18n';

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a href="#main" className="skipLink">
      {t('shared.skipToContent')}
    </a>
  );
}

export default SkipLink;
