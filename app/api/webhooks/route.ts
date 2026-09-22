// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The address outside services call to tell us something
// happened — Stripe saying a payment went through, or that a deposit hold was
// released.
//
// IT DOES NOTHING YET, on purpose, and the reason has changed. There is now a
// backend, but payments are not connected to it — the API has an error code,
// `payments_unavailable`, that says exactly that. So there is still nothing
// real to react to. It answers "ok" so anything pointed at it during setup
// gets a reply rather than an error, and so the address stays reserved.
//
// ONE THING TO KNOW ABOUT WHERE THIS SITS. The site now forwards /api/v1/* to
// the real API through a rewrite in next.config.mjs. This file is NOT caught
// by that: Next.js matches real files before rewrites, and this is a real
// file at /api/webhooks. The two do not collide, and it is worth knowing they
// were checked rather than assumed.
//
// WHEN THIS IS BUILT FOR REAL, the first thing it must do is verify the message
// actually came from Stripe, using the signature they send with it. A webhook
// that trusts whatever is posted to it is a webhook anyone can use to mark their
// own booking as paid.

export async function POST() {
  return new Response('ok');
}
