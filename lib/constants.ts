// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Figures that are part of how the business works, rather
// than information fetched about any particular car or booking.
//
// ---- WHY THESE MOVED OUT OF lib/mock/ ----
//
// The commission rate lived in lib/mock/business.ts, alongside the made-up
// cars and the pretend payouts. That was wrong in a way that would have become
// expensive: lib/mock/ is scheduled for deletion once everything reads from
// the backend, and one of the three product rules is built on this number.
// Deleting a folder of sample data should never be able to take a real
// business rule with it.

/**
 * The share of each booking SXM Rentals keeps. The rest is the business's.
 *
 * ---- READ THIS BEFORE USING IT ----
 *
 * This is a COPY of a figure the backend owns. The backend is what actually
 * divides the money; this exists only so a screen can write "30%" in a
 * sentence and show a worked example on the sign-up page.
 *
 * It must never be used to CALCULATE what a business is owed. Every payout
 * figure comes from the backend already split into gross, commission and net —
 * see lib/api-client.ts. If this number and the backend's ever disagree, the
 * backend is right and this is a bug.
 *
 * THE REAL FIX is for the backend to report the rate on
 * GET /providers/me/summary, so there is one copy rather than two. That ask is
 * filed in docs/backend-asks.md. Until then, a rate change means
 * changing it in two places, and the one that gets forgotten is this one.
 */
export const COMMISSION_RATE = 0.3;

/**
 * How long an answer about the public catalogue may be reused, in seconds.
 *
 * Five minutes. A car's price and its description change over hours; the
 * backend sleeps after fifteen minutes and takes up to a minute to wake, and
 * it allows 300 requests per window. Five minutes means one visitor pays for
 * the wake and the rest are served instantly, and a burst of traffic costs one
 * request rather than hundreds.
 *
 * It is NOT used in the booking flow. See the note on ReadOptions in
 * lib/api-client.ts: the price shown at the point of paying has to be the
 * price charged, so those pages ask for live data every time.
 */
export const CATALOGUE_MAX_AGE_SECONDS = 300;
