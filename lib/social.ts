// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The one list of SXM Rentals' social accounts. Both places
// that show them — the floating button on the homepage and the row in the footer
// — read from here, so they can never end up showing different things.
//
// THE ADDRESSES ARE EMPTY BECAUSE THE ACCOUNTS DO NOT EXIST YET. When they do,
// fill in the "url" for each one and both places start working. Nothing else
// needs changing.
//
// While a url is empty the button says so rather than going nowhere. A social
// icon that silently does nothing when clicked is worse than one that admits it
// is not set up — people assume the site is broken rather than the account
// unopened, and that impression sticks.

import type { BrandName } from '@/components/ui/BrandIcon';

export type SocialLink = {
  name: string;
  brand: BrandName;
  // The real address, once the account exists. Empty means "not set up yet".
  url: string;
  // Shown to somebody who clicks before it is set up.
  handle: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'Instagram', brand: 'instagram', url: '', handle: '@sxmrentals' },
  { name: 'Facebook', brand: 'facebook', url: '', handle: 'SXM Rentals' },
  { name: 'TikTok', brand: 'tiktok', url: '', handle: '@sxmrentals' },
  { name: 'WhatsApp', brand: 'whatsapp', url: '', handle: 'Business number' },
];

// Email is not a social account — it is a way to reach the business directly —
// so it sits alongside the list above rather than inside it. It has no brand
// mark either; the envelope from our own icon set is right for it.
//
// ---- IT USED TO BE hello@sxmrentals.com, AND THAT WAS DANGEROUS ----
//
// sxmrentals.com is registered and live, and it is not this site's domain.
// Nothing on the site showed this address yet, which is the only reason no
// harm was done. The first "contact us" link would have sent customers'
// messages — booking references, questions about a deposit — toward a domain
// we do not control, whose owner would start receiving them the day they
// switched on email.
//
// sxmrentals.app is the site's own domain. IT DOES NOT RECEIVE MAIL YET:
// nothing arrives until forwarding is set up for it at Namecheap, which
// offers it free with the domain. Until then a message sent here bounces back
// to its sender — the safe way for it to be wrong. Do not link to it from a
// page until a test message has actually arrived.
export const CONTACT_EMAIL = 'hello@sxmrentals.app';
