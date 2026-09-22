// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests the one piece of code every single request passes
// through — the bit that turns whatever the backend sends back into either the
// data asked for, or one error the app knows how to read.
//
// WHY THIS IS THE FIRST THING TESTED. Everything else in the migration depends
// on it, and its mistakes are the quiet kind. A failure sorted into the wrong
// bucket does not crash: it signs somebody out for a typo, or shows "not
// found" for a car that exists, or flashes an error for a request we cancelled
// on purpose. None of those look like a bug in this file, which is exactly why
// they are pinned down here rather than found later on a page.
//
// No network is involved. `fetch` is replaced for each test, so these run in
// milliseconds and say the same thing whether or not the backend is awake.

import { describe, expect, it, vi, afterEach } from 'vitest';
import { request, ApiError } from '@/lib/api/http';

/**
 * Runs a request that is expected to fail and hands back the ApiError.
 *
 * `.catch(e => e)` alone gives back `unknown`, which means an `as` on every
 * assertion below. This also fails loudly if the request unexpectedly
 * succeeds, rather than quietly asserting against a resolved value.
 */
async function failureFrom(promise: Promise<unknown>): Promise<ApiError> {
  try {
    await promise;
  } catch (caught) {
    return caught as ApiError;
  }
  throw new Error('Expected that request to fail, but it succeeded.');
}

/**
 * Runs a request that will use up all its retries, without waiting for them.
 *
 * A retryable GET now waits 600ms and then six seconds before giving up (see
 * RETRY_DELAYS_MS). That is the right behaviour against a backend that sleeps
 * and the wrong thing to sit through in a test suite — six seconds per case,
 * for cases that are about how a failure is CLASSIFIED and not about retrying
 * at all.
 *
 * So the clock is faked and wound forward. The two steps stay well short of
 * the sixty-second ceiling, which would otherwise fire and abort the very
 * request being measured.
 */
async function failureAfterRetries(run: () => Promise<unknown>): Promise<ApiError> {
  vi.useFakeTimers();
  try {
    const pending = run().then(
      () => {
        throw new Error('Expected that request to fail, but it succeeded.');
      },
      (caught: unknown) => caught as ApiError,
    );

    await vi.advanceTimersByTimeAsync(700); // past the first delay
    await vi.advanceTimersByTimeAsync(6_100); // past the second

    return await pending;
  } finally {
    vi.useRealTimers();
  }
}

// Stands in for the backend. `body` is sent as JSON unless it is a string, in
// which case it is sent as-is — which is how the "not JSON" cases are built.
function respondWith(status: number, body: unknown, init: { json?: boolean } = {}) {
  const asJson = init.json ?? typeof body !== 'string';
  const text = asJson ? JSON.stringify(body) : String(body);

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(status === 204 ? null : text, {
        status,
        headers: { 'Content-Type': asJson ? 'application/json' : 'text/html' },
      }),
    ),
  );
}

function envelope(code: string, message: string, extra: Record<string, unknown> = {}) {
  return { error: { code, message, requestId: 'req-abc-123', ...extra } };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('a request that works', () => {
  it('hands back the parsed body', async () => {
    respondWith(200, [{ id: 'v1', make: 'Hyundai' }]);
    await expect(request('/vehicles')).resolves.toEqual([{ id: 'v1', make: 'Hyundai' }]);
  });

  it('copes with an empty answer', async () => {
    respondWith(204, null);
    await expect(request('/notifications/x/read', { method: 'POST' })).resolves.toBeUndefined();
  });
});

describe('the backend refusing', () => {
  it('passes the backend’s own sentence through, word for word', async () => {
    // The backend writes these for a person to read and knows what actually
    // failed. Anything written on this side would be a guess at it.
    respondWith(404, envelope('not_found', 'We could not find that vehicle.'));

    const error = await failureFrom(request('/vehicles/nope'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('We could not find that vehicle.');
    expect(error.code).toBe('not_found');
    expect(error.status).toBe(404);
  });

  it('keeps the request id, so a report can be traced', async () => {
    respondWith(500, envelope('unknown', 'Something went wrong.'));
    const error = await failureFrom(request('/vehicles'));
    expect(error.requestId).toBe('req-abc-123');
  });

  // ---- THE ONE THAT MATTERS MOST ----
  it('tells being signed out apart from a wrong password, though both are 401', async () => {
    // If anything decides what to do from the status alone, mistyping a
    // password signs you out of the site — at the exact moment you were
    // trying to sign in. They must never collapse into one case.
    respondWith(401, envelope('unauthorized', 'You need to be signed in to do that.'));
    const signedOut = await failureFrom(request('/customers/me'));

    respondWith(401, envelope('invalid_credentials', 'That email and password do not match.'));
    const wrongPassword = await failureFrom(request('/auth/login', { method: 'POST' }));

    expect(signedOut.status).toBe(401);
    expect(wrongPassword.status).toBe(401);
    expect(signedOut.code).toBe('unauthorized');
    expect(wrongPassword.code).toBe('invalid_credentials');
    expect(signedOut.code).not.toBe(wrongPassword.code);
  });

  it('breaks a form error down by field', async () => {
    respondWith(
      400,
      envelope('invalid_input', 'Some of that was not right.', {
        details: [
          { field: 'email', message: 'That does not look like an email address.' },
          { field: 'password', message: 'Use at least 12 characters.' },
        ],
      }),
    );

    const error = await failureFrom(request('/auth/signup', { method: 'POST' }));
    expect(error.code).toBe('invalid_input');
    expect(error.fieldErrors).toEqual([
      { field: 'email', message: 'That does not look like an email address.' },
      { field: 'password', message: 'Use at least 12 characters.' },
    ]);
  });

  it('ignores a field entry that is missing its field or its message', async () => {
    respondWith(
      400,
      envelope('invalid_input', 'Not right.', {
        details: [{ field: 'email' }, { message: 'orphan' }, { field: 'ok', message: 'kept' }],
      }),
    );
    const error = await failureFrom(request('/auth/signup', { method: 'POST' }));
    expect(error.fieldErrors).toEqual([{ field: 'ok', message: 'kept' }]);
  });
});

describe('a failure that is not the backend’s envelope', () => {
  it('does not throw while reading an HTML error page', async () => {
    // A proxy timing out or a host being down answers with HTML. Reading that
    // as JSON throws a parser complaint on top of the real failure and loses
    // what actually happened.
    respondWith(500, '<html><body>Internal Server Error</body></html>', { json: false });

    const error = await failureFrom(request('/vehicles'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Something went wrong. Please try again.');
    expect(error.developerHint).toContain('not JSON');
  });

  it('calls a gateway failure "upstream", because the backend never answered', async () => {
    respondWith(503, '<html>Service Unavailable</html>', { json: false });
    const error = await failureAfterRetries(() => request('/vehicles'));
    expect(error.code).toBe('upstream');
    // Worth saying out loud: on a free plan this usually means it is waking up.
    expect(error.message).toMatch(/starting up/i);
  });

  it('copes with a completely empty body', async () => {
    respondWith(500, '', { json: false });
    const error = await failureFrom(request('/vehicles'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe('unknown');
  });
});

describe('when nothing answers at all', () => {
  it('calls a dead connection "offline"', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const error = await failureAfterRetries(() => request('/vehicles'));
    expect(error.code).toBe('offline');
    expect(error.message).toMatch(/could not reach/i);
  });

  it('treats a request we cancelled as cancelled, not as a failure', async () => {
    // A cancelled request is normal — it happens on every keystroke in the
    // search box. If it arrives looking like a failure, the screen flashes an
    // error while somebody is still typing.
    const controller = new AbortController();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => {
        controller.abort();
        return Promise.reject(new DOMException('Aborted', 'AbortError'));
      }),
    );

    const error = await failureFrom(request('/vehicles', { signal: controller.signal }));
    expect(error.code).toBe('aborted');
  });
});

describe('trying again', () => {
  it('retries a GET when the connection dies', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'v1' }]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(request('/vehicles')).resolves.toEqual([{ id: 'v1' }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  // ---- THE ONE THE FIRST RETRY DOES NOT COVER ----
  it('tries a third time, because a cold start is not over in 600ms', async () => {
    // This is the real failure, watched against the live backend rather than
    // imagined: a sleeping instance RESETS the connection instead of hanging,
    // so the request fails in well under a second, and the instance then
    // takes about thirteen seconds to come up.
    //
    // With one retry 600ms later, both attempts land while it is still
    // starting and somebody is told the backend is unreachable when it is
    // merely waking. The second retry, six seconds out, is what turns that
    // into a slow page instead of a broken one.
    vi.useFakeTimers();

    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ id: 'v1' }]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const pending = request('/vehicles');

    // Stepped rather than run-all: running every pending timer would also
    // fire the sixty-second ceiling and abort the very request being tested.
    await vi.advanceTimersByTimeAsync(700); // past the first delay
    await vi.advanceTimersByTimeAsync(6_100); // past the second

    await expect(pending).resolves.toEqual([{ id: 'v1' }]);
    expect(fetchMock).toHaveBeenCalledTimes(3);

    vi.useRealTimers();
  });

  it('gives up after the second retry rather than trying forever', async () => {
    // A backend that is actually down must produce an answer, not an
    // indefinite loop of hopeful retries.
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    const error = await failureAfterRetries(() => request('/vehicles'));
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe('offline');
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('never retries a POST', async () => {
    // Sending a booking twice is how somebody ends up with two of them. No
    // amount of convenience is worth that.
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(request('/bookings', { method: 'POST', body: {} })).rejects.toBeInstanceOf(ApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not retry a refusal — asking again will not change the answer', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify(envelope('not_found', 'Not there.')), { status: 404 }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await expect(request('/vehicles/nope')).rejects.toMatchObject({ code: 'not_found' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('the query string', () => {
  // These two are not stylistic. They were found by testing the real backend,
  // which rejects the alternatives.
  it('repeats a list rather than joining it with commas', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await request('/vehicles', { query: { classes: ['suv', 'van'] } });
    expect(fetchMock.mock.calls[0][0]).toContain('classes=suv&classes=van');
  });

  it('writes a yes/no as a word', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await request('/vehicles', { query: { deliveryOnly: true } });
    expect(fetchMock.mock.calls[0][0]).toContain('deliveryOnly=true');
  });

  it('leaves out anything empty, so a whole filter object can be passed as-is', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('[]', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await request('/vehicles', {
      query: { search: '', minPrice: undefined, maxPrice: null, side: 'dutch' },
    });
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain('side=dutch');
    expect(url).not.toContain('search');
    expect(url).not.toContain('minPrice');
    expect(url).not.toContain('maxPrice');
  });
});
