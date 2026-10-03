// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Sends the browser off the site — to Stripe, so far —
// as a full page load rather than a move within the site.
//
// One line, in a file of its own, so a test can stand in for it: the test
// browser cannot actually leave, and a test still needs to see where the page
// would have gone.

export function leaveSiteFor(url: string): void {
  window.location.assign(url);
}
