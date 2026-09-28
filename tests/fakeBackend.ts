// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: A stand-in for the backend, for tests. It replaces
// `fetch` with something that answers by address — "GET /customers/me",
// "POST /auth/login" — the way the real backend would, and records every
// request it was asked, so a test can check what the page actually sent.
//
// An address with no answer set up fails the test outright, with the address
// named. A page quietly asking for something the test did not expect is
// exactly the kind of thing worth hearing about.
//
// What each request carried is kept too, in `sent`, for the tests where what
// was sent is the point — that a new car went with its town's map position,
// say, or that an edit left out what the backend will not change.
//
// A photo upload goes to the photo store, not the backend, and as a form
// rather than JSON. It is answered here all the same, by its full address
// ("POST https://api.cloudinary.test/upload"), and its form is kept with each
// file written as "(file, N bytes)".

import { vi } from 'vitest';

export type Answer = { status: number; body?: unknown };

export type Calls = string[] & {
  /** Every request with the body it carried, in order. */
  sent: { call: string; body: unknown }[];
};

/** Answers by "METHOD /path". Returns the list of requests made, in order. */
export function fakeBackend(
  routes: Record<string, Answer | ((sentBody: unknown) => Answer)>,
): Calls {
  const calls = Object.assign([] as string[], { sent: [] as Calls['sent'] });
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const path = String(url).replace(/^.*\/api\/v1/, '').split('?')[0];
      const key = `${init?.method ?? 'GET'} ${path}`;
      const sentBody =
        typeof init?.body === 'string'
          ? JSON.parse(init.body)
          : init?.body instanceof FormData
            ? Object.fromEntries(
                Array.from(init.body.entries()).map(([name, value]) => [
                  name,
                  typeof value === 'string' ? value : `(file, ${value.size} bytes)`,
                ]),
              )
            : undefined;
      calls.push(key);
      calls.sent.push({ call: key, body: sentBody });
      const route = routes[key];
      if (!route) throw new Error(`The test backend has no answer for ${key}`);
      const { status, body } = typeof route === 'function' ? route(sentBody) : route;
      return new Response(status === 204 || body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }),
  );
  return calls;
}

/** The backend's error envelope, as it sends it. */
export function refusal(status: number, code: string, message = 'Refused.'): Answer {
  return { status, body: { error: { code, message, requestId: 'req-test' } } };
}
