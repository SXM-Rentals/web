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
// ---- IT APPLIES TO EVERYTHING, NOT JUST THE CATALOGUE ----
//
// Worth being exact about, because the name says "catalogue" and an earlier
// version of this note claimed bookings and messages were always live. They
// are not. With the flag off, every screen on the site reads sample data,
// including somebody's bookings, their messages and the business dashboard.
//
// That is deliberate for now and it is not where this ends up. Signing in is
// not connected yet, so a booking screen asking the backend for "my
// bookings" has no session to ask with, and every account page would show a
// failure instead of a demo.
//
// WHEN SIGNING IN IS REAL, the signed-in reads in lib/api-client.ts lose
// their sample branch first — there is no sample version of somebody's own
// booking worth keeping, and pretending otherwise is how a demo gets
// mistaken for a real reservation. The catalogue is the last thing to switch,
// because it is the only part with nothing to lose.

export function useLiveCatalogue(): boolean {
  return process.env.NEXT_PUBLIC_LIVE_CATALOGUE === 'true';
}

/** The reverse, for readability at the call site. */
export function useSampleCatalogue(): boolean {
  return !useLiveCatalogue();
}
