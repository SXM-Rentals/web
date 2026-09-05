// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Produces /robots.txt — the note a search engine reads
// before it starts, saying which parts of the site it should look at and which
// it should leave alone.
//
// WHAT IS BLOCKED AND WHY: the account area, the booking flow, the provider
// dashboard and the sign-in pages. None of them mean anything without being
// signed in, so a search result pointing at one is a dead end for whoever clicks
// it and wasted effort for the search engine.
//
// THIS IS NOT A SECURITY MEASURE, and it should never be mistaken for one. A
// robots file is a request, honoured by well-behaved search engines and ignored
// by anything ill-intentioned. What actually keeps private pages private is the
// sign-in check on the page itself. This only keeps them out of search results.
//
// TO SEE IT: with the site running, open http://localhost:3000/robots.txt

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      // Allow wins over disallow for a more specific path, so the page a rental
      // business needs to find stays findable even though everything else under
      // /provider/ is blocked below.
      allow: ['/', '/provider/apply'],
      disallow: [
        // Somebody else's rentals, messages, saved cars and settings.
        '/account/',
        // Only meaningful partway through a booking that is already under way.
        '/booking/',
        // A rental business's own dashboard. The one public page on that side
        // is /provider/apply, which is allowed back in below.
        '/provider/',
        // Signing in, and the identity checks.
        '/login',
        '/signup',
        '/phone',
        '/otp',
        '/forgot-password',
        '/account-type',
        '/verify-selfie',
        '/verify-id',
        '/verify-status',
        // Nothing under here is a page at all.
        '/api/',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
