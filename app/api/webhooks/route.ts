// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The address outside services call to tell us something
// happened — Stripe saying a payment went through, or that a deposit hold was
// released.
//
// IT DOES NOTHING YET, on purpose. There is no backend and no payment system, so
// there is nothing real to react to. It answers "ok" so that anything pointed at
// it during setup gets a reply rather than an error, and so the address is
// reserved for when the real handling is written.
//
// WHEN THIS IS BUILT FOR REAL, the first thing it must do is verify the message
// actually came from Stripe, using the signature they send with it. A webhook
// that trusts whatever is posted to it is a webhook anyone can use to mark their
// own booking as paid.

export async function POST() {
  return new Response('ok');
}
