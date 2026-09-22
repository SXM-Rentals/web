// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The settings Next.js reads when it builds and runs the
// site. Two things: React's "strict mode", which double-checks components
// during development and warns about common mistakes, and the rule below that
// passes API requests through to the backend.
//
// ---- WHY THE WEBSITE PROXIES THE API INSTEAD OF CALLING IT DIRECTLY ----
//
// The website and the backend live at two different addresses — the site on
// Vercel, the API on Render. A browser treats those as two unrelated websites,
// and that causes two problems, either of which alone would break things:
//
//   1. THE BROWSER IS NOT ALLOWED TO CALL IT. The API sends no
//      "access-control-allow-origin" header and answers the browser's
//      permission-check request with a 404. So a direct call from a page is
//      refused before it starts. This was checked against the live API, not
//      assumed.
//
//   2. THE SIGN-IN COOKIE WOULD NOT COME BACK. Signing in sets a cookie on the
//      API's address. A browser will not send that cookie to a different
//      address, so the next request would arrive signed out. Sign-in would
//      appear to work and then forget you.
//
// The rule below fixes both by making the browser only ever talk to this
// website. A request to /api/v1/… on the site is passed straight through to
// the backend, server to server, where neither restriction applies. The cookie
// is then set on the site's own address, so it comes back on every request —
// and page scripts still cannot read it, because it stays httpOnly.
//
// SERVER COMPONENTS DO NOT USE THIS. A page built on the server calls the API
// directly with API_URL. Routing it through our own address would mean the
// server calling itself over HTTP — a second, pointless hop that can deadlock.
// See lib/api/http.ts, which picks the right one.
//
// ---- A REAL DOMAIN DOES NOT MAKE THIS OPTIONAL ON ITS OWN ----
//
// The site now lives at sxmrentals.app. If the backend were ever moved onto
// api.sxmrentals.app, the two would count as the same site and reason 2 above
// would go away. Reason 1 would not: the backend would still have to start
// answering the browser's permission check, and that is a change on its side.
// Until both are true this rule is what makes the connection work at all —
// and leaving it in place afterwards costs nothing.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    const apiUrl = process.env.API_URL;

    // No backend configured — hand back nothing rather than building a rule
    // pointing at "undefined/api/v1", which fails in a way that takes an hour
    // to recognise. See .env.example.
    if (!apiUrl) {
      console.warn(
        '\n  API_URL is not set, so /api/v1 requests will 404.' +
          '\n  Copy .env.example to .env.local — see that file for what each setting is.\n',
      );
      return [];
    }

    // Returning a plain array puts these AFTER the app's own routes, so the
    // existing app/api/webhooks/route.ts still wins for its own address and
    // only genuinely unmatched /api/v1/… requests are passed through.
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl.replace(/\/$/, '')}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
