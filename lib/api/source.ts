// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Decides whether the catalogue — the cars, the rental
// businesses, the reviews — comes from the backend or from the sample data in
// lib/mock/.
//
// ---- WHY THIS EXISTS, AND WHEN TO DELETE IT ----
//
// The backend is live and its database is empty. Switching the catalogue over
// in one step therefore does not make the site more real, it makes it look
// broken: every page renders its "nothing here" state, and there is no way to
// tell a working connection from a failing one.
//
// So the connection is built and tested first, and the switch is flipped once
// there are cars to show. With the flag off the site is exactly what it was;
// with it on, it is live. Both can be demonstrated side by side, which is the
// only way to review this honestly.
//
// THIS IS TEMPORARY. Delete this file, the setting in .env.example, and every
// branch that reads it as soon as the live database has real cars in it. A
// switch like this earns its keep for about a fortnight and then quietly
// becomes a second code path nobody tests.
//
// ---- WHAT IT COVERS — MORE THAN THE NAME SAYS, AND LESS EACH WEEK ----
//
// Worth being exact about, because the name says "catalogue". With the flag
// off, everything except accounts reads sample data: the cars, and also
// somebody's bookings, their messages and the business dashboard.
//
// Accounts are never sample data. Signing in, signing up, and "who is signed
// in" always go to the backend, whatever this says — a made-up session is how
// every visitor used to end up signed in as the same demo person.
//
// The rest is being moved off the sample data screen by screen. When the last
// screen is done, this file, the setting and lib/mock/ are deleted together.

export function useLiveCatalogue(): boolean {
  return process.env.NEXT_PUBLIC_LIVE_CATALOGUE === 'true';
}

/** The reverse, for readability at the call site. */
export function useSampleCatalogue(): boolean {
  return !useLiveCatalogue();
}
