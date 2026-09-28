// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: The one kind of error the rest of the app has to know
// about, and the small set of helpers for asking what sort of failure it was.
//
// ---- WHY THE CODE MATTERS AND THE STATUS DOES NOT ----
//
// Being signed out and typing the wrong password both come back as 401. If
// anything decides what to do from the status alone, then mistyping a password
// signs you out of the site — which is exactly the moment somebody least wants
// to be signed out. So every decision in this app is made on `code`, and
// `status` is kept only for logging.
//
// ---- WHY THE MESSAGE IS NOT REWRITTEN ----
//
// The backend already sends a sentence written for a person to read: "We could
// not find that vehicle." "That email and password do not match." It knows
// what actually went wrong; anything invented here would be a guess at it,
// phrased worse. So the message is carried through untouched, and the only
// rewriting happens in hooks/useAsyncData.ts for the two cases where the
// backend cannot know the context — see the note there.

/**
 * Every failure the app distinguishes between.
 *
 * The first group comes from the backend, word for word. The second is made up
 * here for failures that never reached it — there is no server to name those,
 * but the app still has to tell them apart.
 */
export type ApiErrorCode =
  // ---- FROM THE BACKEND ----
  // The list the backend can actually send, read from its code on 2026-09-21.
  // A code missing from here still arrives intact — it is passed through as
  // sent — but it has to be listed before a screen can check for it.
  | 'unauthorized' // not signed in
  | 'invalid_credentials' // signed in attempt, wrong password — NOT the same thing
  | 'email_not_verified' // signed up, never opened the confirmation link
  | 'invalid_or_expired_link' // a confirmation or reset link that is used up or too old
  | 'password_breached' // that password appears in a known data breach
  | 'forbidden' // refused outright — including a change sent from a site not on the backend's list
  | 'not_found'
  | 'invalid_input' // a form problem; see fieldErrors
  | 'rate_limited'
  | 'not_a_provider' // signed in, but not linked to a rental business
  | 'already_a_provider' // tried to register a second business
  | 'vehicle_unavailable' // booked by somebody else in the meantime
  | 'vehicle_has_bookings' // a car with bookings cannot simply be removed
  | 'invalid_dates'
  | 'below_minimum_days'
  | 'above_maximum_days'
  | 'delivery_unavailable'
  | 'cannot_cancel' // the rental has already started
  | 'already_cancelled'
  | 'empty_message'
  | 'payments_unavailable' // Stripe is not connected yet
  | 'has_live_rental' // an account or business with a rental coming up or out cannot close
  | 'has_held_deposit' // nor one with a deposit still held
  | 'owns_business' // an account cannot close while its business is open
  | 'payout_pending' // nor a business with a payment to it still on its way
  | 'owner_only' // only a business's owner can close it
  | 'wrong_password' // the password asked for again, before closing, was wrong
  | 'already_closed'
  | 'route_not_found' // a bug in our code, not something a person did
  // ---- MADE UP HERE ----
  | 'offline' // the request never left, or nothing answered
  | 'timeout' // it left and nothing came back in time
  | 'upstream' // something in between answered instead, badly
  | 'aborted' // we cancelled it ourselves; not a failure at all
  | 'not_implemented' // the screen exists, the endpoint does not
  | 'misconfigured' // the website is set up wrong; a developer problem
  | 'unknown';

export type FieldError = { field: string; message: string };

export class ApiError extends Error {
  /** What kind of failure. Branch on this, never on status. */
  readonly code: ApiErrorCode;
  /** The HTTP status, or 0 when the request never got an answer. For logs. */
  readonly status: number;
  /** The backend's id for this exact request. Worth showing — see below. */
  readonly requestId?: string;
  /** Which fields a form got wrong, when the code is invalid_input. */
  readonly fieldErrors?: FieldError[];
  /** Detail meant for whoever is building this, never shown to a visitor. */
  readonly developerHint?: string;

  constructor(init: {
    code: ApiErrorCode;
    message: string;
    status: number;
    requestId?: string;
    fieldErrors?: FieldError[];
    developerHint?: string;
    cause?: unknown;
  }) {
    super(init.message);
    this.name = 'ApiError';
    this.code = init.code;
    this.status = init.status;
    this.requestId = init.requestId;
    this.fieldErrors = init.fieldErrors;
    this.developerHint = init.developerHint;
    if (init.cause !== undefined) this.cause = init.cause;
  }
}

export function isApiError(caught: unknown): caught is ApiError {
  return caught instanceof ApiError;
}

/** True when this failure means "we cancelled it", which is never worth showing. */
export function isAborted(caught: unknown): boolean {
  if (isApiError(caught)) return caught.code === 'aborted';
  return caught instanceof DOMException && caught.name === 'AbortError';
}

/**
 * True when the thing being asked for genuinely does not exist.
 *
 * Kept separate from every other failure because a server page turns this one
 * into a 404 page and must turn nothing else into one. A search engine treats
 * a 404 as permanent: answer one for a car that exists but whose server was
 * briefly asleep, and the page is dropped from the index. See notFoundOrThrow
 * in lib/api/server.ts.
 */
export function isNotFound(caught: unknown): boolean {
  return isApiError(caught) && caught.code === 'not_found';
}

/** True when this screen is built but the endpoint behind it is not. */
export function isUnavailable(caught: unknown): boolean {
  return (
    isApiError(caught) && (caught.code === 'not_implemented' || caught.code === 'payments_unavailable')
  );
}

/**
 * A failure nobody could have prevented, as opposed to one the person can fix
 * by typing something different. Used to decide whether to offer "try again".
 */
export function isRetryable(caught: unknown): boolean {
  if (!isApiError(caught)) return true;
  return (
    caught.code === 'offline' ||
    caught.code === 'timeout' ||
    caught.code === 'upstream' ||
    caught.code === 'rate_limited' ||
    caught.code === 'unknown'
  );
}

/**
 * Throws a made-up "this does not exist yet" failure.
 *
 * Used by the handful of api-client methods whose screens were built before
 * the backend had anywhere for them to go — rewards, the spreadsheet import,
 * the API connection details. Calling a real address that answers 404 would
 * be worse: it looks like a bug, and it spends a request finding out something
 * we already know.
 */
export function notImplemented(what: string): never {
  throw new ApiError({
    code: 'not_implemented',
    message: 'This is not connected yet.',
    status: 0,
    developerHint: `${what} has no endpoint on the backend. See docs/backend-asks.md.`,
  });
}
