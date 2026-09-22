// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Handles everything that can happen when a screen asks
// the backend for information — still loading, arrived, failed, taking a
// while, or not built yet — so every screen deals with them the same way.
//
// WHY THIS EXISTS: before it, every screen did roughly this:
//
//     apiClient.getThing().then(setThing)
//
// which quietly assumes the request always works. When it does not, nothing
// happens at all: no message, no way to try again, and the screen sits on grey
// loading blocks for ever. The person has no idea whether to wait or give up.
//
// ---- WHAT CHANGED WHEN THE BACKEND BECAME REAL ----
//
// The sample data always answered in 350ms and never failed, which hid three
// problems that a real network does not:
//
// 1. ANSWERS COME BACK OUT OF ORDER. Type "jeep" in the search box and five
//    requests go out. They do not return in the order they were sent, and
//    before this the LAST ONE TO ARRIVE won — so the results could end up
//    showing "jee" while the box said "jeep". Every run now carries a number,
//    and an answer from anything but the newest run is dropped.
//
// 2. NOBODY CANCELLED ANYTHING. Those five requests all ran to completion, and
//    one that finished after the screen closed set state on a component that
//    was gone. Each run now aborts the one before it, and the last one aborts
//    when the screen closes.
//
// 3. THE BACKEND SLEEPS. It is on a free plan; the first request after a quiet
//    spell can take a minute. A minute of spinner is indistinguishable from
//    broken, so `slow` turns true after a few seconds and the screen can say
//    it is waking up. That sentence is the whole difference between a site
//    that is slow and a site that looks dead.

import { useCallback, useEffect, useRef, useState } from 'react';
import { isAborted, isApiError, isUnavailable } from '@/lib/api/errors';

export type AsyncState<T> = {
  data: T | undefined;
  // True the first time only. Refreshing does not put the screen back into a
  // skeleton — the old information stays while the new arrives.
  loading: boolean;
  // True while a refresh is in progress.
  refreshing: boolean;
  // Something readable when it went wrong, or nothing when it did not.
  error: string | undefined;
  // The backend's id for the failed request. Worth showing in small grey text:
  // it turns "it didn't work" into something that can be looked up.
  requestId: string | undefined;
  // Still going after a few seconds. Say it is waking up, do not just spin.
  slow: boolean;
  // This screen is built but the endpoint behind it is not. Different from an
  // error: nothing is broken and trying again will not help.
  unavailable: boolean;
  // Try the whole thing again. Used by the retry button and by refreshing.
  refresh: () => void;
};

export function useAsyncData<T>(
  /**
   * The request to make.
   *
   * It may take an AbortSignal and pass it to the request, so an abandoned
   * request is actually cancelled rather than merely ignored. The parameter is
   * optional on purpose: every existing screen passes a zero-argument function
   * and keeps working untouched.
   */
  fetcher: (signal?: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
): AsyncState<T> {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [requestId, setRequestId] = useState<string | undefined>(undefined);
  const [slow, setSlow] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  // Which run is the current one. An answer from an older run is thrown away.
  const runId = useRef(0);
  // The run in flight, so the next one can cancel it.
  const inFlight = useRef<AbortController | null>(null);
  // Whether the screen is still on screen, so nothing sets state after it goes.
  const alive = useRef(true);

  const run = useCallback(
    async (isRefresh: boolean) => {
      const mine = ++runId.current;

      // Whatever was running is no longer wanted.
      inFlight.current?.abort();
      const controller = new AbortController();
      inFlight.current = controller;

      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(undefined);
      setRequestId(undefined);
      setUnavailable(false);
      setSlow(false);

      try {
        const result = await fetcher(controller.signal);
        // A newer run started while this one was in the air. Its answer is the
        // one that matches what is on screen; this one is out of date.
        if (mine !== runId.current || !alive.current) return;
        setData(result);
      } catch (caught) {
        if (mine !== runId.current || !alive.current) return;

        // We cancelled this ourselves. That is not a failure and must never be
        // shown — otherwise the search box flashes an error on every keystroke.
        if (isAborted(caught)) return;

        if (isUnavailable(caught)) {
          setUnavailable(true);
          return;
        }

        setError(readableMessage(caught));
        setRequestId(isApiError(caught) ? caught.requestId : undefined);
      } finally {
        if (mine === runId.current && alive.current) {
          setLoading(false);
          setRefreshing(false);
          setSlow(false);
        }
      }
    },
    // The fetcher is deliberately left out — screens pass a fresh function on
    // every render, and depending on it would loop for ever. The screen's own
    // dependency list is what decides when to re-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  useEffect(() => {
    alive.current = true;
    run(false);

    return () => {
      // The screen is closing. Stop the request rather than letting it finish
      // into nothing.
      alive.current = false;
      inFlight.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const refresh = useCallback(() => {
    run(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, refreshing, error, requestId, slow, unavailable, refresh };
}

// ---- TURNING A FAULT INTO SOMETHING A PERSON CAN READ ----
//
// This used to guess, by matching the text of the error against a list of
// patterns — "does it mention 404", "does it mention network". That was the
// best available when nothing threw anything structured.
//
// The backend now sends a sentence already written for a person to read:
// "We could not find that vehicle." "That email and password do not match."
// It knows what actually failed, so its wording is used as it stands. Guessing
// at it from the outside can only be less accurate, and the old patterns were
// actively wrong in places — a real fetch() failure says "Failed to fetch",
// which matched the network rule even when the true cause was a 404.
//
// Two sentences are still overridden here, in both cases because the backend
// cannot know the context the person is in. See below.
export function readableMessage(caught: unknown): string {
  if (isApiError(caught)) {
    switch (caught.code) {
      case 'unauthorized':
        // The backend says "You need to be signed in to do that." True, but
        // baffling to somebody who WAS signed in a moment ago and has simply
        // been away too long. Only this side knows which of the two it is.
        return 'Your session has ended. Please sign in again.';

      case 'route_not_found':
        // This is a bug in our code — a request to an address that does not
        // exist. Nothing the person did, and nothing they can fix, so they get
        // the general sentence while the detail goes to the console.
        if (process.env.NODE_ENV !== 'production') {
          console.error('[api] asked for an address that does not exist', caught.developerHint, caught.requestId);
        }
        return 'Something went wrong. Please try again.';

      default:
        return caught.message;
    }
  }

  // Not an ApiError, so it never reached lib/api/http.ts — a genuine fault in
  // our own code. Nothing useful to tell somebody about it.
  if (process.env.NODE_ENV !== 'production') {
    console.error('[api] an error that did not come from the backend', caught);
  }
  return 'Something went wrong. Please try again.';
}
