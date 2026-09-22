import 'server-only';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The way a page built on the server asks the backend for
// something. It adds the two things a server needs and a browser does not, and
// it is kept separate from lib/api/http.ts for one specific reason.
//
// ---- WHY THIS IS NOT JUST PART OF http.ts ----
//
// Reading the signed-in person's cookie on the server needs next/headers,
// which only exists on the server. Importing it into a file the browser also
// loads breaks the build in a way whose error message points nowhere near the
// cause. So http.ts stays usable from both sides and knows nothing about
// cookies, and everything server-only lives here behind "server-only" — which
// turns a mistaken import into a clear error at build time instead of a
// mystery at runtime.
//
// ---- WHY EVERY READ IS WRAPPED IN cache() ----
//
// A page and its own generateMetadata both need the same car. They run in the
// same pass, so without this the car is fetched twice: two round trips to a
// server that may be waking up, for one page. React's cache() makes the second
// call hand back the first one's answer. It lasts for one render and no
// longer, so there is nothing to invalidate and nothing to get stale.

import { cache } from 'react';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { request, type RequestOptions } from './http';
import { isNotFound } from './errors';

/**
 * A read that does not need to know who is asking.
 *
 * Cars, businesses, reviews — the public catalogue. No cookie is sent, so the
 * answer is the same for everybody and is safe to cache.
 */
export const publicGet = cache(
  async <T,>(path: string, options: Omit<RequestOptions, 'auth' | 'method'> = {}): Promise<T> =>
    request<T>(path, { ...options, method: 'GET' }),
);

/**
 * A read that depends on who is asking.
 *
 * Forwards the browser's cookie, because a server has none of its own. Note
 * there is no `revalidate` here and there must never be: caching a response
 * that depends on who asked is how one person's bookings end up being shown to
 * the next visitor. http.ts refuses that combination outright while
 * developing, and this signature makes it hard to ask for in the first place.
 */
export const authedGet = cache(
  async <T,>(path: string, options: Omit<RequestOptions, 'auth' | 'method' | 'revalidate'> = {}): Promise<T> => {
    const jar = await cookies();
    const header = jar
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    return request<T>(path, {
      ...options,
      method: 'GET',
      auth: true,
      headers: { ...options.headers, ...(header ? { Cookie: header } : {}) },
    });
  },
);

/**
 * Turn a failure into a 404 page — but only the one failure that means it.
 *
 * THIS IS THE MOST IMPORTANT FUNCTION IN THE FILE, and the reasoning is worth
 * spelling out because getting it wrong is invisible and expensive.
 *
 * Before the backend existed, a car that could not be found was always a car
 * that did not exist, so every miss became notFound(). Now a miss can also
 * mean the server was asleep, or the connection dropped, or something broke.
 *
 * A 404 tells a search engine the page is gone for good, and it drops it. If a
 * cold start renders a 404, real cars quietly disappear from Google and
 * nothing in the app looks wrong. So: 404 only when the backend actually said
 * "not found". Everything else is thrown, and app/error.tsx shows a page that
 * offers to try again.
 *
 * Use it as the whole catch block:
 *
 *   try { vehicle = await getVehicle(id); }
 *   catch (e) { notFoundOrThrow(e); }
 */
export function notFoundOrThrow(caught: unknown): never {
  if (isNotFound(caught)) notFound();
  throw caught;
}
