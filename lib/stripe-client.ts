// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Loads Stripe in the browser, once, with SXM Rentals'
// publishable key — the key Stripe's own card form needs to know whose form it
// is.
//
// ---- WHY A KEY IS WRITTEN IN HERE ----
//
// A publishable key is public by design. It is in the page of every site that
// takes cards through Stripe, and all it can do is start Stripe's form for this
// account; it cannot charge anybody or see anything. The secret key, which
// can, lives only on the backend, on Render, and never comes near this site.
//
// The key below is Stripe's TEST-mode key, matching the backend while Stripe
// is in test mode: no real card is charged, and the payment form says so. When
// the backend moves to live keys, set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY on
// Vercel to the live publishable key (pk_live_…) — it takes precedence — or
// replace the key here. The two must be from the same Stripe account and the
// same mode, or every payment fails at Stripe with "no such payment".

import { loadStripe, type Stripe } from '@stripe/stripe-js';

const TEST_MODE_KEY =
  'pk_test_51UGAj1Q44wCKBXijDVIJ5LYpR3Byeeur0aQSc9AQEDc0EcfaBBgB2NvcakLpg4FNEwSf7bMqLssSP2nPc6rDUwHJ00z0qIN9Jf';

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || TEST_MODE_KEY;

/** True while Stripe is in test mode: cards are not really charged. */
export const STRIPE_TEST_MODE = STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_');

let loading: Promise<Stripe | null> | null = null;

/** Stripe, loaded from Stripe's own servers the first time a card form needs it. */
export function getStripe(): Promise<Stripe | null> {
  if (!loading) loading = loadStripe(STRIPE_PUBLISHABLE_KEY);
  return loading;
}
