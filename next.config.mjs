// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The settings Next.js reads when it builds and runs the
// site. Three things: React's "strict mode", which double-checks components
// during development and warns about common mistakes; two redirects, for a
// link the backend's emails use and a page that was folded into another; and
// the rule below that passes API requests through to the backend.
//
// ---- WHY THE WEBSITE PROXIES THE API INSTEAD OF CALLING IT DIRECTLY ----
//
// The website and the backend live at two different addresses — the site at
// www.sxmrentals.app, the API on Render. To a browser those are two different
// sites, and that breaks exactly one thing: the sign-in cookie.
//
// Signing in sets a cookie. Called directly, the API would set it on its own
// address, which is a different site from the page. The backend marks the
// cookie SameSite=Lax, and a browser never sends a Lax cookie on a background
// request from another site — Safari refuses cookies like that outright. So
// sign-in would appear to work and then forget you on the very next request.
//
// The rule below fixes that by making the browser only ever talk to this
// website. A request to /api/v1/… on the site is passed straight through to
// the backend, server to server. The cookie is then set on the site's own
// address, so it comes back on every request — and page scripts still cannot
// read it, because it stays httpOnly.
//
// ---- A CORRECTION, KEPT ON PURPOSE ----
//
// This note used to give a second reason: that the API refused browsers
// outright, sending no "access-control-allow-origin" header. That was wrong.
// The API does answer browsers — for the addresses on its CORS_ORIGINS list,
// which includes www.sxmrentals.app. The first check happened to use an
// address that was not on the list. Checked again on 2026-09-21, against the
// live API, and against the backend's own code.
//
// ---- A SECOND RULE THE BACKEND ENFORCES ----
//
// It refuses any request that changes something — signing in included —
// unless the browser's Origin header is on that same list. Browsers send
// their Origin on every such request and this rule passes it through
// unchanged, so www.sxmrentals.app passes. sxm-rentals.vercel.app is NOT on
// the list, which is why sign-in is refused there, and why that address
// should redirect to www.
//
// SERVER COMPONENTS DO NOT USE THIS. A page built on the server calls the API
// directly with API_URL. Routing it through our own address would mean the
// server calling itself over HTTP — a second, pointless hop that can deadlock.
// See lib/api/http.ts, which picks the right one.
//
// ---- WHEN THIS COULD GO ----
//
// If the backend were moved onto api.sxmrentals.app, it would be the same
// site as the website: a Lax cookie is sent to it, and the browser could call
// it directly, because the API already answers for www.sxmrentals.app. Until
// then this rule is what makes sign-in work at all — and leaving it in place
// afterwards costs nothing.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The backend's emails say "sign in here" and link to /sign-in. The page is
  // /login. Without this, somebody following a link from their own security
  // email lands on "not found" — a bad moment to look broken. Permanent,
  // because those links are already in people's inboxes.
  async redirects() {
    return [
      { source: '/sign-in', destination: '/login', permanent: true },
      // The "do you live here?" question used to be its own page after
      // sign-up. It is now asked on the sign-up form, because the backend
      // needs it when the account is created and cannot change it afterwards.
      // Old links land on the form, with their ?next= carried across.
      { source: '/account-type', destination: '/signup', permanent: true },
    ];
  },

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
