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
import { mockVehicles } from '@/lib/mock/vehicles';
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

export default function HomePage() {
  // The newest handful of cars, shown as a genuine preview of the catalogue
  // rather than pictures chosen to flatter it.
  const previewVehicles = mockVehicles.slice(0, 4);

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
