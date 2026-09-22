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

import { vi } from 'vitest';

export type Answer = { status: number; body?: unknown };

/** Answers by "METHOD /path". Returns the list of requests made, in order. */
export function fakeBackend(routes: Record<string, Answer | (() => Answer)>): string[] {
  const calls: string[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      const path = String(url).replace(/^.*\/api\/v1/, '').split('?')[0];
      const key = `${init?.method ?? 'GET'} ${path}`;
      calls.push(key);
      const route = routes[key];
      if (!route) throw new Error(`The test backend has no answer for ${key}`);
      const { status, body } = typeof route === 'function' ? route() : route;
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
