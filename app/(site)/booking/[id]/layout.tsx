// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Wraps the four steps of the booking flow. It adds no
// visible frame of its own — the customer frame around it already does that —
// and exists for one reason: to keep these pages out of search results.
//
// WHY THEY MUST NOT BE INDEXED: every page here only makes sense partway through
// a booking that is already under way. Somebody arriving at the payment step
// from a search result has no booking to pay for. They would see an error, or an
// empty form, and conclude the site is broken — when in truth they simply
// arrived through a door that was never meant to be an entrance.
//
// The robots note below asks search engines not to list them. The sign-in check
// on the pages themselves is what actually protects them; see app/robots.ts for
// why those are two different jobs.

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
