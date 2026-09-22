// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Tests real sign-in — the session, the sign-in page, and
// the check on where signing in may send somebody.
//
// EACH TEST IS A MISTAKE THAT WOULD NOT LOOK LIKE ONE. None of these fail
// loudly. A wrong password that carries on to the account page looks like a
// working sign-in. A sleeping server read as "signed out" looks like the site
// forgetting people. A sign-out that clears the screen while the session lives
// on looks exactly like a successful sign-out. They are pinned down here
// because nothing on a page would ever show them.
//
// No network: `fetch` is replaced in every test with a stand-in that answers
// by address, the way the backend would.

import React, { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '../render';
import { SessionProvider, useSession } from '@/lib/auth';
import { safeNextPath } from '@/lib/utils';
import type { User } from '@/types';
import { fakeBackend as backend, refusal } from '../fakeBackend';

// ---- next/navigation, which only exists inside a running Next.js app ----
const push = vi.fn();
let search = '';
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: push, back: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(search),
  usePathname: () => '/login',
}));

const SOMEONE: User = {
  id: 'c1',
  firstName: 'Tessa',
  lastName: 'Customer',
  email: 'tessa@example.com',
  phone: '',
  accountType: 'tourist',
  verification: { status: 'unstarted', selfieDone: false, licenseDone: false, identityDocDone: false },
  isIslander: false,
  memberSince: '2026-09-21T00:00:00.000Z',
} as User;

// Renders a component that hands the session out to the test.
function withSession() {
  const latest: { current: ReturnType<typeof useSession> | null } = { current: null };
  function Probe() {
    const session = useSession();
    useEffect(() => {
      latest.current = session;
    });
    return null;
  }
  render(
    <SessionProvider>
      <Probe />
    </SessionProvider>,
  );
  return latest;
}

beforeEach(() => {
  push.mockReset();
  search = '';
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('finding out who is signed in', () => {
  it('restores the person the backend says is signed in', async () => {
    backend({ 'GET /customers/me': { status: 200, body: SOMEONE } });
    const session = withSession();
    await waitFor(() => expect(session.current?.loading).toBe(false));
    expect(session.current?.user?.email).toBe('tessa@example.com');
    expect(session.current?.error).toBeNull();
  });

  it('treats only an "unauthorized" answer as signed out', async () => {
    backend({ 'GET /customers/me': refusal(401, 'unauthorized') });
    const session = withSession();
    await waitFor(() => expect(session.current?.loading).toBe(false));
    expect(session.current?.isSignedIn).toBe(false);
    expect(session.current?.error).toBeNull();
  });

  // ---- THE ONE THAT MATTERS MOST HERE ----
  it('does not call a failing server "signed out"', async () => {
    // A backend that answered badly, or not at all, has told us nothing about
    // who this is. Reading that as "signed out" makes the site forget
    // everybody who opens it while the server is waking up.
    backend({ 'GET /customers/me': refusal(500, 'unknown', 'Something went wrong.') });
    const session = withSession();
    await waitFor(() => expect(session.current?.loading).toBe(false));
    expect(session.current?.error).toBe('Something went wrong.');
    // Not signed in — but flagged as "could not tell", so a page offers a retry
    // instead of a sign-in form.
    expect(session.current?.user).toBeNull();
  });
});

describe('signing in, up and out', () => {
  it('signs in and keeps the person the backend returns', async () => {
    backend({
      'GET /customers/me': refusal(401, 'unauthorized'),
      'POST /auth/login': { status: 200, body: { user: SOMEONE, session: { expiresAt: '2026-10-21' } } },
    });
    const session = withSession();
    await waitFor(() => expect(session.current?.loading).toBe(false));

    await act(() => session.current!.signIn('tessa@example.com', 'a long enough password'));
    expect(session.current?.user?.id).toBe('c1');
  });

  it('leaves nobody signed in after a wrong password, and says which kind of refusal it was', async () => {
    backend({
      'GET /customers/me': refusal(401, 'unauthorized'),
      'POST /auth/login': refusal(401, 'invalid_credentials', 'That email and password do not match.'),
    });
    const session = withSession();
    await waitFor(() => expect(session.current?.loading).toBe(false));

    await expect(session.current!.signIn('tessa@example.com', 'wrong')).rejects.toMatchObject({
      code: 'invalid_credentials',
    });
    expect(session.current?.isSignedIn).toBe(false);
  });

  it('does not sign anybody in on sign-up — the email has to be confirmed first', async () => {
    const calls = backend({
      'GET /customers/me': refusal(401, 'unauthorized'),
      'POST /auth/signup': { status: 202, body: { message: 'Check your inbox.' } },
    });
    const session = withSession();
    await waitFor(() => expect(session.current?.loading).toBe(false));

    await act(() =>
      session.current!.signUp({
        firstName: 'Tessa',
        lastName: 'Customer',
        email: 'tessa@example.com',
        password: 'a long enough password',
        accountType: 'tourist',
      }),
    );
    expect(calls).toContain('POST /auth/signup');
    expect(session.current?.isSignedIn).toBe(false);
  });

  it('keeps the person signed in when signing out fails', async () => {
    // The session is still alive on the backend. Clearing the screen anyway
    // would tell somebody on a shared computer they were safely out.
    backend({
      'GET /customers/me': { status: 200, body: SOMEONE },
      'POST /auth/logout': refusal(500, 'unknown'),
    });
    const session = withSession();
    await waitFor(() => expect(session.current?.isSignedIn).toBe(true));

    let signedOut: boolean | undefined;
    await act(async () => {
      signedOut = await session.current!.signOut();
    });
    expect(signedOut).toBe(false);
    expect(session.current?.isSignedIn).toBe(true);
  });

  it('counts a sign-out the backend says is already done as done', async () => {
    backend({
      'GET /customers/me': { status: 200, body: SOMEONE },
      'POST /auth/logout': refusal(401, 'unauthorized'),
    });
    const session = withSession();
    await waitFor(() => expect(session.current?.isSignedIn).toBe(true));

    let signedOut: boolean | undefined;
    await act(async () => {
      signedOut = await session.current!.signOut();
    });
    expect(signedOut).toBe(true);
    expect(session.current?.isSignedIn).toBe(false);
  });
});

describe('the sign-in page', () => {
  async function openLoginPage() {
    const { default: LoginPage } = await import('@/app/(auth)/login/page');
    render(
      <SessionProvider>
        <LoginPage />
      </SessionProvider>,
    );
    const email = await screen.findByLabelText(/email/i);
    fireEvent.change(email, { target: { value: 'tessa@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'whatever it is' } });
  }

  // ---- THE BUG FOUND IN PASS 1 ----
  it('stays on the page after a wrong password, and says so', async () => {
    // The pretend sign-in moved on to /account whatever was typed. Wired to a
    // real backend unchanged, a wrong password would have done the same.
    backend({
      'GET /customers/me': refusal(401, 'unauthorized'),
      'POST /auth/login': refusal(401, 'invalid_credentials'),
    });
    await openLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/do not match/i);
    expect(push).not.toHaveBeenCalled();
  });

  it('offers a new confirmation link to somebody who never confirmed', async () => {
    const calls = backend({
      'GET /customers/me': refusal(401, 'unauthorized'),
      'POST /auth/login': refusal(403, 'email_not_verified'),
      'POST /auth/verify-email/resend': { status: 202, body: { message: 'Check your inbox.' } },
    });
    await openLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/confirm your email/i);
    fireEvent.click(screen.getByRole('button', { name: /send a new link/i }));

    // Found by its words rather than its role: the toast area is a "status"
    // region too, and is always on the page.
    expect(await screen.findByText(/new link is on its way/i)).toHaveTextContent('tessa@example.com');
    expect(calls).toContain('POST /auth/verify-email/resend');
    expect(push).not.toHaveBeenCalled();
  });

  it('goes where "next" says after signing in — but never to another site', async () => {
    search = 'next=https%3A%2F%2Flookalike.example%2Fpay';
    backend({
      'GET /customers/me': refusal(401, 'unauthorized'),
      'POST /auth/login': { status: 200, body: { user: SOMEONE, session: { expiresAt: '2026-10-21' } } },
    });
    await openLoginPage();
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/account'));
  });
});

describe('where signing in may send somebody', () => {
  it('accepts a page on this site', () => {
    expect(safeNextPath('/vehicles/v1?start=2026-10-05')).toBe('/vehicles/v1?start=2026-10-05');
    expect(safeNextPath('/booking/v1/confirm')).toBe('/booking/v1/confirm');
  });

  it('refuses anything that would leave the site', () => {
    // Each is a real trick: a full address, a "protocol-relative" one that
    // browsers read as another site, a backslash that some browsers turn into
    // a slash, a tab that browsers strip out, and a script.
    for (const trick of [
      'https://lookalike.example',
      '//lookalike.example',
      '/\\lookalike.example',
      '/\t/lookalike.example',
      'javascript:alert(1)',
      'lookalike.example',
    ]) {
      expect(safeNextPath(trick), trick).toBe('/account');
    }
  });

  it('falls back when there is no note at all', () => {
    expect(safeNextPath(null)).toBe('/account');
    expect(safeNextPath('')).toBe('/account');
    expect(safeNextPath(undefined, '/search')).toBe('/search');
  });
});
