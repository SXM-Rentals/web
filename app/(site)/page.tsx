// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The front door. It is the page a search engine finds, the
// page a shared link opens, and the page somebody who has never heard of SXM
// Rentals lands on — so it has to say what this is, where it operates, and what
// happens next, without assuming anything.
//
// IT WORKS COMPLETELY SIGNED OUT, and that is the single most important thing
// about it. Nothing here asks for an account. The first thing that does is
// starting a booking, and it asks at that point rather than in the way of
// looking.
//
// THIS FILE IS DELIBERATELY THIN. It holds the three things that must be
// produced on the server — the page title and description, the structured
// description a search engine reads, and the cars to preview — and hands the
// visible page to HomeContent, which is a browser component so that it can read
// the reader's chosen language. The reasoning is written out in full at the top
// of components/home/HomeContent.tsx.

import React from 'react';
import type { Metadata } from 'next';
import { apiClient } from '@/lib/api-client';
import { CATALOGUE_MAX_AGE_SECONDS } from '@/lib/constants';
import { HomeContent } from '@/components/home/HomeContent';
import { JsonLd } from '@/components/seo/JsonLd';
import { canonical, jsonLdOrganisation, jsonLdWebsite } from '@/lib/seo';

export const metadata: Metadata = {
  alternates: canonical('/'),
  // "absolute" overrides the site-wide template, which would otherwise append
  // "· SXM Rentals" to a title that already says SXM Rentals.
  title: { absolute: 'SXM Rentals — Rent a car anywhere on Sint Maarten' },
  description:
    'The vehicle rental platform built for both sides of Sint Maarten / Saint-Martin. Book, verify and sign online. Security deposits are held and returned, never charged as revenue.',
};

// Five minutes. The four cars below are a preview, not a live listing, and the
// homepage is the one page where waiting on a sleeping backend costs the most
// — it is where most people arrive.
export const revalidate = 300;

export default async function HomePage() {
  // A handful of cars, shown as a genuine preview of the catalogue rather than
  // pictures chosen to flatter it. The order is whatever the backend
  // recommends, which is the same order the search page opens on.
  //
  // ---- WHY A FAILURE HERE IS SWALLOWED, WHEN ELSEWHERE IT IS NOT ----
  //
  // This is the front door. Everything else on it — what SXM Rentals is, the
  // search box, how it works, the towns — is written into the page and needs
  // no backend at all. Throwing because four preview pictures could not be
  // fetched would replace a working homepage with an error screen, and make
  // the entire site look dead over its least important section.
  //
  // So the preview goes quiet and the rest of the page stands. The opposite
  // call is made on the reviews page, where the fetched thing IS the page —
  // see app/(site)/vehicles/[id]/data.ts.
  const preview = await Promise.allSettled([
    apiClient.listVehicles({ sort: 'recommended' }, { revalidate: CATALOGUE_MAX_AGE_SECONDS }),
  ]);
  const previewVehicles =
    preview[0].status === 'fulfilled' ? preview[0].value.slice(0, 4) : [];

  if (preview[0].status === 'rejected') {
    // Quiet on the page, loud in the log. A homepage silently missing its
    // preview for a week is exactly the kind of thing nobody reports.
    console.error('SXM Rentals — the homepage preview could not be loaded:', preview[0].reason);
  }

  return (
    <>
      {/* Read by search engines only — nothing is drawn. Describes who SXM
          Rentals is, and that the site has a search of its own, which is what
          puts a search box under the result. */}
      <JsonLd data={[jsonLdOrganisation(), jsonLdWebsite()]} />

      <HomeContent previewVehicles={previewVehicles} />
    </>
  );
}
