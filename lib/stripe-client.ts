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
// The key below is the LIVE key: real cards, real money, since the backend
// moved to live keys on 2026-10-12. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY on
// Vercel, when set, takes precedence — the same key is set there too. To test
// again, set that to a test key (pk_test_…) for a test deployment; the payment
// form then says it is in test mode. Whatever the key, it must be from the
// same Stripe account and the same mode as the secret key on Render, or every
// payment fails at Stripe with "no such payment".

import { loadStripe, type Stripe } from '@stripe/stripe-js';

const LIVE_KEY =
  'pk_live_51UGAiSLlZdDHowP0wVCquGl935shejirbEK8BNmlbgu3XDyO5TxlViF1MrI2H04Del2X4v7Xw5TxKxi2jvubZ8lL00FLupbjll';

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || LIVE_KEY;

/** True while Stripe is in test mode: cards are not really charged. */
export const STRIPE_TEST_MODE = STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_');

let loading: Promise<Stripe | null> | null = null;

/** Stripe, loaded from Stripe's own servers the first time a card form needs it. */
export function getStripe(): Promise<Stripe | null> {
  if (!loading) loading = loadStripe(STRIPE_PUBLISHABLE_KEY);
  return loading;
}
