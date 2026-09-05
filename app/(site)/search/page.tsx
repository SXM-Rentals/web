// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The vehicle search page — where someone browses and
// narrows down the cars available on the island.
//
// IT WORKS COMPLETELY SIGNED OUT. Nothing here asks who you are. The account is
// asked for at the point of booking, not the point of looking.
//
// This file is only the wrapper: the heading, and what search engines are told
// about the page. The working part is in components/search/SearchView.tsx, which
// has to run in the browser because it reacts to every filter change.
//
// THE SUSPENSE WRAPPER IS REQUIRED, not decoration. Reading the filters out of
// the page address is something only the browser can do, and Next.js refuses to
// build the page unless that part is explicitly marked as arriving later.

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { canonical } from '@/lib/seo';
import { PageHeader } from '@/components/layout/PageHeader';
import { SearchView } from '@/components/search/SearchView';
import { Skeleton } from '@/components/ui';

export const metadata: Metadata = {
  // Deliberately the bare address. A search carries its filters in the address
  // — the town, the price range, the dates — and every combination is a
  // different one. Without this, a search engine would see thousands of nearly
  // identical pages competing with each other and rank all of them worse than
  // the one page deserves.
  alternates: canonical('/search'),
  title: 'Find a Car',
  description:
    'Browse rental cars across Sint Maarten and Saint-Martin. Filter by price, size, gearbox and which side of the island — no account needed to look.',
};

export default function SearchPage() {
  return (
    <div className="container">
      <PageHeader
        titleKey="search.title"
        subtitleKey="search.subtitle"
        crumbs={[
          { labelKey: 'web.nav.home', href: '/' },
          { labelKey: 'search.title' },
        ]}
      />

      <Suspense
        fallback={
          <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
            <Skeleton height={72} radius="var(--radius-lg)" />
            <Skeleton height={420} radius="var(--radius-lg)" />
          </div>
        }
      >
        <SearchView />
      </Suspense>
    </div>
  );
}
