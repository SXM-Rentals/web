'use client';

// SXM Rentals — Created by Giordano Bertin-Maurice
// Copyright (c) 2026 Giordano Bertin-Maurice. All rights reserved.
// WHAT THIS FILE DOES: Keeps track of whether someone is signed in and who they
// are, and signs them in, up and out — against the real backend.
//
// ---- THE SESSION ITSELF NEVER PASSES THROUGH HERE ----
//
// Signing in sets an httpOnly cookie, which page scripts cannot read by
// design, so this file never sees or stores the session. The browser sends
// the cookie with every request on its own, through the proxy in
// next.config.mjs. The only way to learn whether somebody is signed in is to
// ask the backend who they are, which is what happens when the site opens.
//
// ---- "WE COULD NOT FIND OUT" IS NOT "SIGNED OUT" ----
//
// The most important distinction in this file. The backend sleeps when it has
// been quiet, and the first request after that can fail or take most of a
// minute. If that failure were read as "nobody is signed in", everybody who
// opened the site at a quiet moment would be told to sign in again — and
// would, and would wonder why the site keeps forgetting them.
//
// So there are three answers, not two. Signed in. Signed out, which only an
// `unauthorized` answer from the backend can establish. And "could not tell",
// which keeps `user` empty but sets `error`, so a page can offer to try again
// instead of a sign-in form. See components/layout/RequireSignIn.tsx.
//
// ---- WHY BROWSING NEEDS NO ACCOUNT ----
//
// On the phone app, somebody signs in before they can browse properly. On the
// web they do not. Anyone can look at the homepage, search, and every car page
// completely signed out — the first thing that needs an account is starting a
// booking. Most people arrive here from a search engine and will simply leave
// if asked to register first, so the funnel is kept open as long as possible.
//
// Signing in with Apple or Google, and the phone app's Face ID, are not here:
// the backend does not offer the first two yet, and a browser cannot offer the
// third.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { isApiError } from '@/lib/api/errors';
import storage from '@/lib/storage';
import type { AccountType, User } from '@/types';

export type SignUpDetails = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // Asked for at sign-up because the backend has nowhere to change it later.
  accountType: AccountType;
};

type SessionValue = {
  user: User | null;
  isSignedIn: boolean;
  /** True until the first answer about who is signed in has come back. */
  loading: boolean;
  /**
   * Set when we could not find out who is signed in — the backend asleep, the
   * connection down. Not the same as signed out, and never treated as it.
   */
  error: string | null;
  /** Asks again, after `error`. */
  retry: () => void;

  /**
   * Signs in. Throws the backend's own error on failure — the page decides
   * what to say about a wrong password, an unconfirmed email, too many tries.
   */
  signIn: (email: string, password: string) => Promise<void>;
  /** Creates the account. Does not sign in: the email has to be confirmed first. */
  signUp: (details: SignUpDetails) => Promise<void>;
  /**
   * Signs out, and reports whether it worked. Never throws.
   *
   * On failure the person STAYS signed in here, because they still are on the
   * backend — clearing the screen while the session carried on working would
   * tell them they were safely signed out when they were not. The caller says
   * so and lets them try again.
   */
  signOut: () => Promise<boolean>;
};

const SessionContext = createContext<SessionValue | null>(null);

// The key the old pretend sign-in left in the browser. Nothing reads it now;
// it is cleared once so it does not linger forever.
const OLD_DEMO_KEY = 'sxm.demo-signed-in';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumped to ask again.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    storage.removeItem(OLD_DEMO_KEY).catch(() => {});
  }, []);

  // ---- WHO IS SIGNED IN? ----
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    apiClient.getCurrentUser(controller.signal).then(
      (me) => {
        setUser(me);
        setLoading(false);
      },
      (caught: unknown) => {
        // Cancelled because the page moved on. Nothing happened, so nothing
        // is recorded.
        if (controller.signal.aborted || (isApiError(caught) && caught.code === 'aborted')) return;

        if (isApiError(caught) && caught.code === 'unauthorized') {
          // The one answer that means signed out.
          setUser(null);
        } else {
          // Anything else means we do not know. See the note at the top.
          setUser(null);
          setError(
            isApiError(caught)
              ? caught.message
              : 'We could not check whether you are signed in. Please try again.',
          );
        }
        setLoading(false);
      },
    );

    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const signIn = useCallback(async (email: string, password: string) => {
    const me = await apiClient.login(email.trim(), password);
    setUser(me);
    setError(null);
  }, []);

  const signUp = useCallback(async (details: SignUpDetails) => {
    await apiClient.signup({
      ...details,
      firstName: details.firstName.trim(),
      lastName: details.lastName.trim(),
      email: details.email.trim(),
    });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch (caught) {
      // Already signed out on the backend's side, so the goal is met.
      // Anything else and the session may well still be alive.
      if (!(isApiError(caught) && caught.code === 'unauthorized')) return false;
    }
    setUser(null);
    return true;
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      user,
      isSignedIn: user !== null,
      loading,
      error,
      retry,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, error, retry, signIn, signUp, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

// How any page finds out who is signed in:
//   const { user, isSignedIn, signOut } = useSession();
export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used inside SessionProvider (check app/layout.tsx)');
  }
  return ctx;
}
