// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Puts a machine-readable description of a page into the
// page itself, for search engines to read. It draws nothing — a person looking
// at the site will never see it.
//
// WHY IT EXISTS AS ITS OWN COMPONENT rather than a line in each page: the script
// tag it writes needs `dangerouslySetInnerHTML`, which is worth writing once,
// carefully, in a place where the reason can be explained — instead of eight
// times across the site where nobody stops to think about it.
//
// IS IT ACTUALLY DANGEROUS HERE? No, and the reason is worth being precise
// about. That React prop is named to make you stop and check, because putting
// text into a page unescaped is how a site gets attacked. Everything handed to
// it here is built in lib/seo.ts from our own typed data and passed through
// JSON.stringify, which cannot produce anything but valid JSON. Nothing typed by
// a customer or a rental business reaches it. The escaping below covers the one
// remaining case anyway.

import React from 'react';

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // A "<" inside a string would end the script tag early if it happened to spell
  // "</script>" — a car described as "seats 4 < 5 adults" is enough to do it.
  // Escaping it keeps the JSON valid and the page intact.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // See the note above: the content is ours, generated, and escaped.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default JsonLd;
