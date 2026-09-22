// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Every request to the backend goes through the one
// function in here. It works out the right address, sends the request, and
// turns whatever comes back — an answer, a refusal, a timeout, a dead
// connection — into either the data asked for or one ApiError that the rest of
// the app knows how to read.
//
// It deliberately knows nothing about cars, bookings or customers. What goes
// where is lib/api-client.ts's job; this file is only about getting a request
// there and an answer back in one piece.
//
// ---- THE FOUR THINGS THAT MADE THIS MORE THAN A fetch() WRAPPER ----
//
// 1. THE ADDRESS IS DIFFERENT DEPENDING ON WHO IS ASKING. A page built on the
//    server calls the backend directly. A page running in a browser calls this
//    website instead and is passed through. Neither can use the other's
//    address. The full reasoning is in next.config.mjs.
//
// 2. THE BACKEND GOES TO SLEEP. It is on a free plan and stops after about
//    fifteen minutes of quiet. The first request after that can take up to a
//    minute while it wakes. A minute of spinner is indistinguishable from
//    broken, so there are two clocks: a long one that eventually gives up, and
//    a short one that just says "it is waking up" so the screen can tell
//    somebody what is happening.
//
// 3. TWO DIFFERENT REFUSALS SHARE ONE STATUS. Being signed out and typing the
//    wrong password are both 401. Anything that decides what to do based on the
//    status alone will sign somebody out for a typo. So the "code" in the
//    body — not the status — is what the app branches on.
//
// 4. NOT EVERY FAILURE IS JSON. A proxy timing out, a host being down, a
//    platform error page — those come back as HTML, or as nothing at all.
//    Reading them as JSON throws a second error on top of the first and loses
//    what actually happened.

import type { ApiErrorCode } from './errors';
import { ApiError } from './errors';

export { ApiError };
export type { ApiErrorCode };

/** How long to wait before giving up entirely. */
const HARD_TIMEOUT_MS = 60_000;

/** How long before we admit out loud that this is taking a while. */
const SLOW_AFTER_MS = 4_000;

/**
 * How long to wait before each retry, when a retry is allowed at all.
 *
 * ---- WHY TWO, AND WHY THE SECOND ONE IS SO MUCH LONGER ----
 *
 * There used to be one retry, 600ms later, with a comment saying a sleeping
 * backend refuses the first request and answers the second. Half of that was
 * right. Watching it happen against the real backend:
 *
 *   the connection to a sleeping instance is RESET, not left hanging — the
 *   request fails in under a second rather than timing out, and
 *
 *   the instance then takes about thirteen seconds to come up.
 *
 * So a retry 600ms later asks an instance that is one twentieth of the way
 * through waking, gets refused again, and reports a dead backend to somebody
 * whose backend is merely asleep. The retry existed for this exact case and
 * did not cover it.
 *
 * Hence two, spaced for the two different things that go wrong:
 *
 *   600ms  — a blip. A connection dropped, a moment of packet loss.
 *   6s     — a cold start, caught part-way up.
 *
 * Six rather than thirteen because the request itself then waits: the second
 * attempt is made while the instance is still starting and simply holds the
 * connection until it answers. It does not have to be made after the instance
 * is up, only after it is listening.
 *
 * The total added wait is under seven seconds against a sixty-second ceiling,
 * and SLOW_AFTER_MS has already told the reader it is waking up by then. Both
 * only ever apply to a GET — see worthRetrying.
 */
const RETRY_DELAYS_MS = [600, 6_000];

export type QueryValue = string | number | boolean | undefined | null | string[];

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  /** Sent as JSON. Leave it out for a GET. */
  body?: unknown;
  /** Turned into a query string; see toQueryString for how each type is written. */
  query?: Record<string, QueryValue>;
  /** Lets a caller cancel — see hooks/useAsyncData.ts, which cancels on every re-run. */
  signal?: AbortSignal;
  /** Called once if the request is still going after SLOW_AFTER_MS. */
  onSlow?: () => void;
  /**
   * Send the signed-in person's cookie with this request.
   *
   * In a browser that is `credentials: 'include'`. On the server there is no
   * automatic cookie, so lib/api/server.ts reads it and passes it in `headers`
   * below — which is why this file never imports next/headers and stays usable
   * from both sides.
   */
  auth?: boolean;
  /** Extra headers. Used by lib/api/server.ts to forward the cookie. */
  headers?: Record<string, string>;
  /**
   * Seconds Next.js may reuse this answer for. Server-side only; ignored in
   * the browser, where the option means nothing.
   *
   * ---- IT DOES WORK, DESPITE WHAT THE BACKEND SAYS ----
   *
   * The backend sends "Cache-Control: no-store" on every response, which
   * reads like an instruction not to cache. Setting this overrides it: the
   * answer is kept and reused for the given number of seconds. Measured
   * against a server sending that exact header, not assumed — the earlier
   * note here said the opposite and was wrong.
   *
   * Two things follow that are worth knowing:
   *
   *   It is what keeps the site off the backend's 300-per-window limit and
   *   absorbs its cold start. One visitor waits; the rest do not.
   *
   *   A cached answer keeps being served while the backend is DOWN. An
   *   outage stops being visible on any page whose data is still in hand.
   *
   * This is the caching that matters. `export const revalidate` on a page
   * with an [id] in its address does nothing at all — see the note on
   * app/(site)/vehicles/[id]/page.tsx. Which of the two is used also decides
   * which error page a failure gets, so it is not merely a preference.
   *
   * Never set on a request carrying somebody's cookie. That is refused a few
   * lines further down rather than left to memory.
   */
  revalidate?: number | false;
  /** Cache tags, so a webhook can later clear exactly what changed. */
  tags?: string[];
};

const isBrowser = (): boolean => typeof window !== 'undefined';

/**
 * Where to send this request.
 *
 * In a browser: a path on this website, which next.config.mjs passes through.
 * On the server: the backend directly, because a server calling its own
 * website over HTTP is a second hop that buys nothing and can deadlock.
 */
function baseUrl(): string {
  if (isBrowser()) return '/api/v1';

  const configured = process.env.API_URL;
  if (!configured) {
    throw new ApiError({
      code: 'misconfigured',
      message: 'The website is not set up to reach the booking system yet.',
      status: 0,
      developerHint:
        'API_URL is not set. Copy .env.example to .env.local and fill it in.',
    });
  }
  return `${configured.replace(/\/$/, '')}/api/v1`;
}

/**
 * Turns an options object into a query string.
 *
 * Two details the backend actually cares about, both found by testing it
 * rather than reading about it:
 *
 *   a list is repeated       classes=suv&classes=van   (not "suv,van")
 *   a yes/no is a word       deliveryOnly=true         (not 1, not empty)
 *
 * Anything undefined, null or an empty string is left out entirely, so callers
 * can pass a whole filter object without pruning it first.
 */
function toQueryString(query: Record<string, QueryValue> | undefined): string {
  if (!query) return '';

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      for (const one of value) {
        if (one !== undefined && one !== null && one !== '') params.append(key, String(one));
      }
      continue;
    }
    params.append(key, String(value));
  }

  const text = params.toString();
  return text ? `?${text}` : '';
}

/**
 * Reads the body without ever throwing.
 *
 * A failing request is exactly when the body is least likely to be the JSON we
 * expect — a platform error page, a proxy timeout, an empty response. Throwing
 * here would replace a useful error with a parser complaint.
 */
async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const text = await response.text().catch(() => '');
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return { __notJson: text.slice(0, 500) };
  }
}

/** The envelope the backend sends on every refusal. */
type ErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    requestId?: string;
    details?: { field?: string; message?: string }[];
  };
};

function isErrorEnvelope(body: unknown): body is ErrorEnvelope {
  return typeof body === 'object' && body !== null && 'error' in body;
}

/** Only a handful of failures are worth trying a second time. */
function worthRetrying(error: ApiError, method: string): boolean {
  // Never a POST, PATCH or DELETE. Trying a booking again is how somebody ends
  // up with two of them.
  if (method !== 'GET') return false;

  // A timeout is not retried either. It already had the full minute; asking
  // again just makes somebody wait two.
  return error.code === 'offline' || error.code === 'upstream';
}

/**
 * The two clocks, and the caller's own cancel, folded into one signal.
 *
 * ---- WHY THIS IS HAND-ROLLED ----
 *
 * The obvious way to write this is AbortSignal.any([yours, AbortSignal.timeout(n)]).
 * It reads better and it is wrong here: AbortSignal.any does not exist in
 * Safari before 17.4, and this project supports Safari 15.4. It is also
 * missing from the test environment, which is how it was caught — every
 * cancelled request was arriving as a bare TypeError instead of a cancellation,
 * so the search box would have flashed "Something went wrong" on a keystroke.
 *
 * A plain AbortController works everywhere and is barely longer.
 *
 * Three things come back:
 *   signal    — pass to fetch
 *   timedOut  — true only if the LONG clock fired, so a timeout can be told
 *               apart from somebody navigating away
 *   done()    — must be called in a finally, or a pending timer keeps the
 *               request object alive after the page has moved on
 */
function startClocks(
  caller: AbortSignal | undefined,
  onSlow: (() => void) | undefined,
): { signal: AbortSignal; timedOut: boolean; done: () => void } {
  const controller = new AbortController();
  const state = { timedOut: false };

  const hard = setTimeout(() => {
    state.timedOut = true;
    controller.abort();
  }, HARD_TIMEOUT_MS);

  // The short clock only speaks. It never cancels anything — a slow request is
  // still a request that might succeed.
  const soft = onSlow ? setTimeout(onSlow, SLOW_AFTER_MS) : undefined;

  const relay = () => controller.abort();
  if (caller) {
    if (caller.aborted) controller.abort();
    else caller.addEventListener('abort', relay, { once: true });
  }

  return {
    signal: controller.signal,
    get timedOut() {
      return state.timedOut;
    },
    done() {
      clearTimeout(hard);
      if (soft) clearTimeout(soft);
      caller?.removeEventListener('abort', relay);
    },
  };
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One attempt. `request` below wraps this with the retry.
 */
async function attempt<T>(path: string, options: RequestOptions): Promise<T> {
  const {
    method = 'GET',
    body,
    query,
    signal,
    onSlow,
    auth = false,
    headers = {},
    revalidate,
    tags,
  } = options;

  // Caching a response that carries somebody's cookie means serving one
  // person's bookings to the next visitor. Rather than trusting everyone to
  // remember, it is refused here — loudly, and only while developing, so it is
  // found on the first run and never reaches anybody.
  if (process.env.NODE_ENV !== 'production' && auth && revalidate !== undefined && revalidate !== false) {
    throw new Error(
      `Refusing to cache ${method} ${path}: it sends the signed-in person's cookie. ` +
        'A cached signed-in response gets served to the next visitor. Drop `revalidate`.',
    );
  }

  const url = `${baseUrl()}${path}${toQueryString(query)}`;

  // Two clocks. The long one gives up; the short one only speaks.
  const clock = startClocks(signal, onSlow);

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal: clock.signal,
      credentials: auth && isBrowser() ? 'include' : 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...(revalidate !== undefined || tags
        ? { next: { ...(revalidate !== undefined ? { revalidate } : {}), ...(tags ? { tags } : {}) } }
        : {}),
    });
  } catch (caught) {
    // fetch only rejects when the request never completed: no connection, or
    // somebody cancelled it. Which of the two matters a great deal — a
    // cancelled request is normal and must never look like a failure.
    if (signal?.aborted) {
      throw new ApiError({ code: 'aborted', message: 'That request was cancelled.', status: 0 });
    }
    if (clock.timedOut) {
      throw new ApiError({
        code: 'timeout',
        message:
          'The booking system took too long to answer. It may be starting up — try again in a moment.',
        status: 0,
      });
    }
    throw new ApiError({
      code: 'offline',
      message: 'We could not reach SXM Rentals. Check your connection and try again.',
      status: 0,
      cause: caught,
    });
  } finally {
    clock.done();
  }

  const payload = await readBody(response);

  if (response.ok) return payload as T;

  // ---- A REFUSAL ----
  if (isErrorEnvelope(payload) && payload.error) {
    const { code, message, requestId, details } = payload.error;
    throw new ApiError({
      code: (code as ApiErrorCode) ?? 'unknown',
      // The backend's own sentence, word for word. It knows what actually
      // failed; anything written here would be a guess at it.
      message: message ?? 'Something went wrong. Please try again.',
      status: response.status,
      requestId,
      fieldErrors: details
        ?.filter((d): d is { field: string; message: string } => Boolean(d.field && d.message))
        .map((d) => ({ field: d.field, message: d.message })),
    });
  }

  // Not the backend's envelope, so this came from something in between — a
  // proxy, the host, a gateway. 502/503/504 specifically mean "the thing
  // behind me did not answer", which on a sleeping server is worth one retry.
  const upstream = response.status === 502 || response.status === 503 || response.status === 504;
  throw new ApiError({
    code: upstream ? 'upstream' : 'unknown',
    message: upstream
      ? 'The booking system is not answering. It may be starting up — try again in a moment.'
      : 'Something went wrong. Please try again.',
    status: response.status,
    developerHint:
      typeof payload === 'object' && payload !== null && '__notJson' in payload
        ? `Body was not JSON: ${String((payload as { __notJson: string }).__notJson)}`
        : undefined,
  });
}

/**
 * Make a request. Hands back the parsed answer, or throws an ApiError.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  for (let tryNumber = 0; ; tryNumber += 1) {
    try {
      return await attempt<T>(path, options);
    } catch (caught) {
      const error = caught instanceof ApiError ? caught : null;
      const delay = RETRY_DELAYS_MS[tryNumber];

      // Out of retries, or this is not the kind of failure trying again fixes.
      if (delay === undefined || !error || !worthRetrying(error, options.method ?? 'GET')) {
        throw caught;
      }

      await wait(delay);

      // Checked after the wait as well as inside the request. Six seconds is
      // long enough for somebody to have typed another letter or left the
      // page, and carrying on would put a result on screen for a search
      // nobody is doing any more.
      if (options.signal?.aborted) {
        throw new ApiError({ code: 'aborted', message: 'That request was cancelled.', status: 0 });
      }
    }
  }
}

/**
 * Wakes the backend up without waiting for the answer.
 *
 * The first request after a quiet spell pays the whole start-up cost. Spending
 * it on a health check nobody is watching, the moment the page opens, means
 * the request somebody IS waiting for arrives at a server that is already
 * awake. Failures are ignored on purpose — this is an optimisation, and an
 * optimisation that can break the page is not one.
 */
export function warmUp(): void {
  void request('/health', { method: 'GET' }).catch(() => {});
}
