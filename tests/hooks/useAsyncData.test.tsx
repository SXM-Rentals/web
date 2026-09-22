// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the hook every screen uses to ask the backend for
// something, and in particular the one thing about it that is genuinely hard
// to get right — what happens when two requests are in the air at once.
//
// THE TEST THAT JUSTIFIES THE WHOLE HOOK is "an older answer never wins".
// Type "jeep" into the search box and five requests go out. They do not come
// back in the order they were sent. Before this hook counted its runs, the
// last answer TO ARRIVE won rather than the last one ASKED FOR — so the
// results could settle on "jee" while the box said "jeep", and reloading fixed
// it, which is the signature of a bug nobody can reproduce on demand.
//
// The sample data answered in a fixed 350ms and so could never demonstrate it.
// These tests make the slow request finish last on purpose.

import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAsyncData } from '@/hooks/useAsyncData';
import { ApiError } from '@/lib/api/errors';

/** A promise you resolve by hand, so a test controls the ordering exactly. */
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('two requests in the air at once', () => {
  it('never lets an older answer win', async () => {
    const first = deferred<string>();
    const second = deferred<string>();
    const calls = [first, second];
    let call = 0;

    const { result, rerender } = renderHook(
      ({ query }: { query: string }) =>
        // eslint-disable-next-line react-hooks/exhaustive-deps
        useAsyncData(() => calls[call++].promise, [query]),
      { initialProps: { query: 'jee' } },
    );

    // The second search starts before the first has answered.
    rerender({ query: 'jeep' });

    // Now the answers arrive in the wrong order: the newer one first, then the
    // stale one. This is the exact sequence that used to break it.
    await act(async () => {
      second.resolve('results for jeep');
      await Promise.resolve();
    });
    await act(async () => {
      first.resolve('results for jee');
      await Promise.resolve();
    });

    // What is on screen must match what was last asked for, not what landed
    // last.
    expect(result.current.data).toBe('results for jeep');
  });

  it('cancels the request it is replacing', async () => {
    const seen: (AbortSignal | undefined)[] = [];

    const { rerender } = renderHook(
      ({ query }: { query: string }) =>
        // eslint-disable-next-line react-hooks/exhaustive-deps
        useAsyncData((signal) => {
          seen.push(signal);
          return new Promise<string>(() => {}); // never settles
        }, [query]),
      { initialProps: { query: 'a' } },
    );

    rerender({ query: 'ab' });

    await waitFor(() => expect(seen.length).toBe(2));
    // The first request was abandoned, so it should have been told to stop
    // rather than left running to completion.
    expect(seen[0]?.aborted).toBe(true);
    expect(seen[1]?.aborted).toBe(false);
  });

  it('stops the request when the screen closes', async () => {
    const seen: (AbortSignal | undefined)[] = [];

    const { unmount } = renderHook(() =>
      useAsyncData((signal) => {
        seen.push(signal);
        return new Promise<string>(() => {});
      }, []),
    );

    await waitFor(() => expect(seen.length).toBe(1));
    unmount();
    expect(seen[0]?.aborted).toBe(true);
  });

  it('never shows an error for a request it cancelled itself', async () => {
    // Otherwise the search box flashes "Something went wrong" on every
    // keystroke, which is worse than the stale results it was meant to fix.
    const { result, rerender } = renderHook(
      ({ query }: { query: string }) =>
        // eslint-disable-next-line react-hooks/exhaustive-deps
        useAsyncData(async (signal) => {
          await new Promise((r) => setTimeout(r, 5));
          if (signal?.aborted) {
            throw new ApiError({ code: 'aborted', message: 'That request was cancelled.', status: 0 });
          }
          return query;
        }, [query]),
      { initialProps: { query: 'a' } },
    );

    rerender({ query: 'ab' });
    await waitFor(() => expect(result.current.data).toBe('ab'));
    expect(result.current.error).toBeUndefined();
  });
});

describe('what it says when things fail', () => {
  it('uses the backend’s own sentence', async () => {
    const { result } = renderHook(() =>
      useAsyncData(
        () =>
          Promise.reject(
            new ApiError({
              code: 'not_found',
              message: 'We could not find that vehicle.',
              status: 404,
              requestId: 'req-42',
            }),
          ),
        [],
      ),
    );

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.error).toBe('We could not find that vehicle.');
    // Carried through so it can be shown in small grey text and looked up.
    expect(result.current.requestId).toBe('req-42');
  });

  it('rewords being signed out, because the backend cannot know you just were', async () => {
    const { result } = renderHook(() =>
      useAsyncData(
        () =>
          Promise.reject(
            new ApiError({
              code: 'unauthorized',
              message: 'You need to be signed in to do that.',
              status: 401,
            }),
          ),
        [],
      ),
    );

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.error).toBe('Your session has ended. Please sign in again.');
  });

  it('treats a screen with no endpoint as unavailable, not as an error', async () => {
    // Nothing is broken and trying again will not help, so it gets its own
    // state and the screen shows "not connected yet" instead of a failure.
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useAsyncData(
        () =>
          Promise.reject(
            new ApiError({ code: 'not_implemented', message: 'This is not connected yet.', status: 0 }),
          ),
        [],
      ),
    );

    await waitFor(() => expect(result.current.unavailable).toBe(true));
    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });
});

describe('the ordinary path still works', () => {
  it('loads, then shows the data', async () => {
    const { result } = renderHook(() => useAsyncData(() => Promise.resolve(['a', 'b']), []));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(['a', 'b']);
    expect(result.current.error).toBeUndefined();
  });

  it('keeps what is on screen while refreshing', async () => {
    let answer = 'first';
    const { result } = renderHook(() => useAsyncData(() => Promise.resolve(answer), []));

    await waitFor(() => expect(result.current.data).toBe('first'));

    answer = 'second';
    act(() => result.current.refresh());

    // The old answer stays put rather than the screen dropping back to
    // skeletons — that is the difference between `refreshing` and `loading`.
    expect(result.current.loading).toBe(false);
    await waitFor(() => expect(result.current.data).toBe('second'));
  });

  it('still works for a screen that ignores the cancel signal', async () => {
    // Every screen written before this hook took a signal passes a
    // zero-argument function. Those must keep working untouched.
    const { result } = renderHook(() => useAsyncData(() => Promise.resolve('fine'), []));
    await waitFor(() => expect(result.current.data).toBe('fine'));
  });
});
